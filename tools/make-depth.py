import sys, time, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
model, src_dir, out_dir = sys.argv[1:4]
names = sys.argv[4:]
sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
inp = sess.get_inputs()[0].name
H, W = 728, 1092  # multiples of 14, 3:2 like the plates
mean = np.array([0.485, 0.456, 0.406], np.float32); std = np.array([0.229, 0.224, 0.225], np.float32)
for n in names:
    t = time.time()
    img = Image.open(f'{src_dir}/{n}.png').convert('RGB')
    x = (np.asarray(img.resize((W, H), Image.BICUBIC), np.float32) / 255 - mean) / std
    d = sess.run(None, {inp: x.transpose(2, 0, 1)[None]})[0][0]
    lo, hi = np.percentile(d, 0.5), np.percentile(d, 99.5)
    d = np.clip((d - lo) / (hi - lo), 0, 1)  # 1 = near, 0 = far
    raw = Image.fromarray((d * 255).astype(np.uint8)).resize((768, 512), Image.BICUBIC)
    raw.save(f'{out_dir}/{n}-depth-raw.png')
    # Dilate near values a little so object silhouettes keep their own colour when the
    # mesh stretches, then soften so the stretch is gradual rather than a hard tear.
    soft = raw.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2.5))
    soft.save(f'{out_dir}/{n}-depth.png')
    print(n, d.shape, f'{time.time()-t:.1f}s', flush=True)
