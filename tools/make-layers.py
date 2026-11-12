"""Build 2.5D layers for each background plate.

For assets/NAME.png this writes, into the output folder:
  NAME.png       768x512 RGB: R = front-layer depth, G = back-layer depth (white = near)
  NAME-mask.png  1536x1024 L: front-layer alpha (objects that pop out of their surroundings)
  NAME-back.webp 1536x1024: the plate with the front objects removed and the hole filled

Usage: python make-layers.py MODEL.onnx ASSETS_DIR OUT_DIR CACHE_DIR NAME [NAME...]
MODEL is Depth Anything V2 (onnx-community/depth-anything-v2-base, onnx/model.onnx).
Raw depth is cached as CACHE_DIR/NAME.npy so the layer settings can be re-tuned quickly.
"""
import os
import sys
import numpy as np
from PIL import Image

THRESHOLD = 0.11   # how far (in normalised depth) something must pop out to become front layer
RAMP = 0.05        # soft band around the threshold
ROW_RADIUS = 0.2   # horizontal search radius for the local background, as a fraction of width
SIZE, DEPTH_SIZE = (1536, 1024), (768, 512)


def depth_raw(model, plate, cache):
    if os.path.exists(cache):
        return np.load(cache)
    import onnxruntime as ort
    sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
    H, W = 728, 1092  # multiples of 14 with the plates' 3:2 shape
    mean = np.array([0.485, 0.456, 0.406], np.float32)
    std = np.array([0.229, 0.224, 0.225], np.float32)
    x = (np.asarray(plate.resize((W, H), Image.BICUBIC), np.float32) / 255 - mean) / std
    d = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None]})[0][0]
    lo, hi = np.percentile(d, 0.5), np.percentile(d, 99.5)
    d = np.clip((d - lo) / (hi - lo), 0, 1).astype(np.float32)  # 1 = near
    np.save(cache, d)
    return d


def resize(a, size, method=Image.BILINEAR):
    return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize(size, method), np.float32)


def blur(a, sigma):
    """Approximate Gaussian blur: three box passes."""
    r = max(1, round(sigma * 0.87))
    for _ in range(3):
        a = box(a, r)
    return a.astype(np.float32)


def sliding(a, r, axis, op):
    pad = [(0, 0), (0, 0)]
    pad[axis] = (r, r)
    win = np.lib.stride_tricks.sliding_window_view(np.pad(a, pad, mode='edge'), 2 * r + 1, axis=axis)
    return op(win, axis=-1)


def dilate(a, r):
    return sliding(sliding(a, r, 0, np.max), r, 1, np.max)


def box(a, r):
    p = np.pad(a, r, mode='edge').cumsum(0).cumsum(1)
    p = np.pad(p, ((1, 0), (1, 0)))
    k = 2 * r + 1
    return (p[k:, k:] - p[:-k, k:] - p[k:, :-k] + p[:-k, :-k]) / (k * k)


def guided(guide, src, r, eps):
    """Edge-aware filter: snaps the soft depth-based mask to the painting's real edges."""
    mi, mp = box(guide, r), box(src, r)
    a = (box(guide * src, r) - mi * mp) / (box(guide * guide, r) - mi * mi + eps)
    b = mp - a * mi
    return box(a, r) * guide + box(b, r)


def pull_push(img, valid):
    """Fill invalid pixels smoothly from valid neighbours (multi-resolution diffusion)."""
    img = img if img.ndim == 3 else img[..., None]
    levels = []
    c, w = img * valid[..., None], valid.astype(np.float32)
    while min(w.shape) > 4:
        levels.append((c, w))
        h2, w2 = w.shape[0] // 2 * 2, w.shape[1] // 2 * 2
        c = c[:h2, :w2].reshape(h2 // 2, 2, w2 // 2, 2, -1).mean((1, 3))
        w = w[:h2, :w2].reshape(h2 // 2, 2, w2 // 2, 2).mean((1, 3))
    fill = c / np.maximum(w, 1e-6)[..., None]
    for c, w in reversed(levels):
        up = np.stack([resize(fill[..., i], (w.shape[1], w.shape[0])) for i in range(fill.shape[-1])], -1)
        norm = c / np.maximum(w, 1e-6)[..., None]
        k = np.clip(w * 4, 0, 1)[..., None]  # trust a level once a quarter of it is valid
        fill = k * norm + (1 - k) * up
    return fill


def row_fill(img, valid, soften=5):
    """Fill holes row by row, interpolating between the nearest valid pixels on the left and
    right. Parallax mostly reveals things sideways, and rows keep the sky, ridge and ground
    bands continuous. A vertical blur inside the hole hides the streak structure."""
    img = img if img.ndim == 3 else img[..., None]
    out = img.copy()
    # Interpolate from a softened copy so single edge pixels don't become long streaks.
    src = np.stack([blur(img[..., ch], 3) for ch in range(img.shape[2])], -1)
    xs = np.arange(img.shape[1])
    for y in range(img.shape[0]):
        ok = valid[y] > 0.5
        if ok.all():
            continue
        if not ok.any():
            ok = valid[max(0, y - 1)] > 0.5
            if not ok.any():
                continue
        for ch in range(img.shape[2]):
            out[y, ~ok, ch] = np.interp(xs[~ok], xs[ok], src[y, ok, ch])
    hole = valid < 0.5
    for ch in range(out.shape[2]):
        soft = out[..., ch]
        for _ in range(3):
            soft = sliding(sliding(soft, soften * 2, 0, np.mean), max(1, soften // 2), 1, np.mean)
        out[..., ch] = np.where(hole, soft, out[..., ch])
    return out


def mirror_fill(img, valid, soften=2):
    """Fill each row's holes by mirroring the real pixels just outside them, from the nearer
    side. Parallax only ever uncovers a thin sliver next to an object, and a mirrored sliver
    keeps the scenery's texture (trees, lights, ridges) where interpolation would smear it."""
    img = img if img.ndim == 3 else img[..., None]
    fallback = row_fill(img, valid, 6)
    out = fallback.copy()
    w = img.shape[1]
    for y in range(img.shape[0]):
        ok = valid[y] > 0.5
        if ok.all() or not ok.any():
            continue
        edges = np.flatnonzero(np.diff(np.r_[1, ok.astype(np.int8), 1]))
        for a, b in zip(edges[::2], edges[1::2]):  # hole run [a, b)
            xs = np.arange(a, b)
            from_left = (xs - a < b - xs) if (a > 0 and b < w) else np.full(len(xs), a > 0)
            src = np.where(from_left, 2 * a - 1 - xs, 2 * b - xs)
            good = (src >= 0) & (src < w)
            good[good] &= ok[src[good]]
            out[y, xs[good]] = img[y, src[good]]
    hole = valid < 0.5
    for ch in range(out.shape[2]):
        soft = sliding(sliding(out[..., ch], soften, 0, np.mean), soften, 1, np.mean)
        out[..., ch] = np.where(hole, soft, out[..., ch])
    return out


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def build(model, assets, out, cache, name):
    plate = Image.open(f'{assets}/{name}.png').convert('RGB').resize(SIZE, Image.LANCZOS)
    d = depth_raw(model, plate, f'{cache}/{name}.npy')
    h, w = d.shape

    # Local background: the farthest depth along the same row within ROW_RADIUS. Objects
    # stand out from it; ground, whose depth changes mostly vertically, does not.
    background = blur(sliding(d, int(w * ROW_RADIUS), 1, np.min), 6)
    pop = smoothstep(THRESHOLD - RAMP, THRESHOLD + RAMP, d - background)

    rgb = np.asarray(plate, np.float32) / 255
    lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
    alpha = np.clip(guided(lum, resize(pop, SIZE), 5, 2e-3), 0, 1)
    alpha = smoothstep(0.15, 0.85, alpha)

    # Front depth: push near values a little past the silhouette so the edge pixels ride
    # with the object instead of stretching toward the background.
    dd = resize(d, DEPTH_SIZE)
    front = blur(dilate(dd, 4), 1.5)

    # Back layer: remove the front objects and fill the hole from the surroundings.
    hole_hi = dilate((alpha > 0.5).astype(np.float32), 3)
    hole_lo = dilate(resize(hole_hi, DEPTH_SIZE) > 0.05, 3).astype(np.float32)
    back = blur(row_fill(dd, 1 - hole_lo, 3)[..., 0], 2)
    back = np.where(hole_lo > 0, back, blur(dd, 1.5))
    back_rgb = mirror_fill(rgb, 1 - hole_hi)
    back_rgb = np.where(hole_hi[..., None] > 0, back_rgb, rgb)

    depth_rgb = np.stack([front, back, np.zeros_like(front)], -1)
    Image.fromarray((np.clip(depth_rgb, 0, 1) * 255 + .5).astype(np.uint8)).save(f'{out}/{name}.png', optimize=True)
    Image.fromarray((alpha * 255 + .5).astype(np.uint8)).save(f'{out}/{name}-mask.png', optimize=True)
    Image.fromarray((np.clip(back_rgb, 0, 1) * 255 + .5).astype(np.uint8)).save(f'{out}/{name}-back.webp', quality=74, method=6)
    print(name, f'front covers {alpha.mean() * 100:.1f}% of the plate', flush=True)


if __name__ == '__main__':
    model, assets, out, cache, *names = sys.argv[1:]
    os.makedirs(out, exist_ok=True)
    os.makedirs(cache, exist_ok=True)
    for n in names:
        build(model, assets, out, cache, n)
