/* 2.5D depth world. Each background plate is drawn as two depth-displaced layers, so the
   camera can drift and fly with real parallax without stretching near objects:
     back  = assets/depth/NAME-back.webp (plate with pop-out objects removed and filled in)
     front = assets/NAME.webp cut out by assets/depth/NAME-mask.png
   assets/depth/NAME.png holds both depths (R = front, G = back). tools/make-layers.py makes them.
   world.js falls back to the flat #scenery images when WebGL2 or motion is unavailable. */
(() => {
  'use strict';
  const SETTINGS = {
    depth: 1.0,          // 0 = flat image, 1 = estimated depth, >1 exaggerated
    parallax: 0.8,       // mouse parallax strength
    flightSeconds: 2.0,  // Neural Tree <-> destination flight
    dissolveSeconds: 1.1,// other page changes
    edgeSoftening: true, // soften what little the back layer still stretches
    maxPixels: 1920      // cap on the canvas's backing width; the plates are 1536 wide
  };

  // Every pixel lies on its own ray from the original camera; depth only moves it along
  // that ray, so from the resting viewpoint the painting is reproduced exactly.
  const IMG_TAN_Y = Math.tan(20 * Math.PI / 180), IMG_TAN_X = IMG_TAN_Y * 1.5;
  const NEAR = 1, FAR = 10, FOCUS = 3;
  const OVERSCAN = 0.9;               // world.css sizes the map canvas to match (/ .9)
  const ARRIVE = [0, 0, -0.22];       // resting eye on destination pages: a step into the scene
  const DOLLY = 0.5, TURN = 0.3, FADE_START = 0.38, FADE_LEN = 0.28, FLIGHT_ZOOM = 0.12;

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const lerp3 = (a, b, t) => add(a, scale(sub(b, a), t));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm = a => scale(a, 1 / Math.hypot(...a));
  const clamp01 = t => Math.min(1, Math.max(0, t));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const smooth = t => t * t * (3 - 2 * t);
  function lookAt(eye, target) {
    const z = norm(sub(eye, target)), x = norm(cross([0, 1, 0], z)), y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
  }
  function mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }
  // Off-axis perspective: (cx, cy) shifts the view across the painting, like background-position.
  const perspective = (tx, ty, cx, cy, n = 0.03, f = 50) => [1 / tx, 0, 0, 0, 0, 1 / ty, 0, 0, cx / tx, cy / ty, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0];
  const zOf = d => { const z = 1 / (1 / FAR + (1 / NEAR - 1 / FAR) * d); return FOCUS + (z - FOCUS) * SETTINGS.depth; };
  const pointAt = (u, v, d) => { const z = zOf(d); return [(u - .5) * 2 * IMG_TAN_X * z, (.5 - v) * 2 * IMG_TAN_Y * z, -z]; };

  const VS = `#version 300 es
in vec2 aUv;
uniform sampler2D uDepth; uniform mat4 uVP; uniform vec2 uTan, uTexel;
uniform float uNear, uFar, uFocus, uStrength, uFront;
out vec2 vUv; out float vEdge;
float zOf(float d){ float z = 1.0 / (1.0/uFar + (1.0/uNear - 1.0/uFar) * d); return uFocus + (z - uFocus) * uStrength; }
float depthAt(vec2 uv){ vec2 rg = texture(uDepth, uv).rg; return mix(rg.g, rg.r, uFront); }
void main(){
  float d = depthAt(aUv);
  vEdge = 0.0;
  if (uFront < 0.5) {
    float dx = depthAt(aUv + vec2(uTexel.x * 2.0, 0)) - depthAt(aUv - vec2(uTexel.x * 2.0, 0));
    float dy = depthAt(aUv + vec2(0, uTexel.y * 2.0)) - depthAt(aUv - vec2(0, uTexel.y * 2.0));
    vEdge = smoothstep(0.015, 0.08, length(vec2(dx, dy)));
  }
  float z = zOf(d);
  vUv = aUv;
  gl_Position = uVP * vec4((aUv.x - 0.5) * 2.0 * uTan.x * z, (0.5 - aUv.y) * 2.0 * uTan.y * z, -z, 1.0);
}`;
  const FS = `#version 300 es
precision highp float;
in vec2 vUv; in float vEdge;
uniform sampler2D uColor, uMask; uniform float uAlpha, uMove, uFront;
out vec4 o;
void main(){
  float a = uAlpha;
  if (uFront > 0.5) { a *= texture(uMask, vUv).r; if (a < 0.004) discard; }
  vec3 c = texture(uColor, vUv).rgb;
  float k = vEdge * uMove;
  if (k > 0.0) c = mix(c, textureLod(uColor, vUv, 3.5).rgb, clamp(k * 1.4, 0.0, 0.9));
  o = vec4(c, a);
}`;

  function create() {
    const canvas = document.createElement('canvas');
    canvas.id = 'depth';
    // No MSAA: the mesh is smooth and edges come from the mask texture, so it buys nothing
    // and costs a lot on integrated GPUs.
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const U = {}; ['uDepth', 'uColor', 'uMask', 'uVP', 'uTan', 'uTexel', 'uNear', 'uFar', 'uFocus', 'uStrength', 'uAlpha', 'uMove', 'uFront'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    gl.uniform2f(U.uTan, IMG_TAN_X, IMG_TAN_Y); gl.uniform1f(U.uNear, NEAR); gl.uniform1f(U.uFar, FAR); gl.uniform1f(U.uFocus, FOCUS);
    gl.uniform1i(U.uDepth, 0); gl.uniform1i(U.uColor, 1); gl.uniform1i(U.uMask, 2);

    // Silhouettes come from the mask, not the mesh, so a modest grid is enough.
    const GX = 240, GY = 160;
    const uvs = new Float32Array((GX + 1) * (GY + 1) * 2);
    for (let y = 0, i = 0; y <= GY; y++) for (let x = 0; x <= GX; x++) { uvs[i++] = x / GX; uvs[i++] = y / GY; }
    const idx = new Uint32Array(GX * GY * 6);
    for (let y = 0, i = 0; y < GY; y++) for (let x = 0; x < GX; x++) { const a = y * (GX + 1) + x, b = a + 1, c = a + GX + 1, d = c + 1; idx.set([a, c, b, b, c, d], i); i += 6; }
    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aUv'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ---- Scene loading -------------------------------------------------------
    const scenes = new Map(), ready = new Map();
    const get = name => { const sc = ready.get(name); if (!sc) throw new Error('Scene not loaded: ' + name); return sc; };
    // createImageBitmap decodes off the main thread and gives the GPU a ready-to-copy bitmap,
    // so neither decoding nor the upload stalls a frame.
    const loadImage = src => fetch(src).then(r => { if (!r.ok) throw new Error('Could not load ' + src); return r.blob(); })
      .then(b => createImageBitmap(b, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }));
    // format: 'rgba' for colour, 'r' for the mask, 'rg' for the two depths (smaller on the GPU).
    function texture(img, mips, format = 'rgba') {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      const [internal, fmt] = { rgba: [gl.RGBA8, gl.RGBA], r: [gl.R8, gl.RED], rg: [gl.RG8, gl.RG] }[format];
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, fmt, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mips) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      return t;
    }
    function load(name) {
      if (!scenes.has(name)) scenes.set(name, Promise.all([
        loadImage(`assets/${name}.webp`), loadImage(`assets/depth/${name}-back.webp`),
        loadImage(`assets/depth/${name}.png`), loadImage(`assets/depth/${name}-mask.png`)
      ]).then(async ([color, back, depth, mask]) => {
        // One GPU upload per frame, so loading a scene never stalls the animation.
        const sc = { name, used: performance.now() };
        sc.color = texture(color, true); await nextFrame();
        sc.back = texture(back, true); await nextFrame();
        sc.mask = texture(mask, false, 'r'); sc.depth = texture(depth, false, 'rg'); await nextFrame();
        const c = document.createElement('canvas'); c.width = depth.width; c.height = depth.height;
        const cx = c.getContext('2d', { willReadFrequently: true }); cx.drawImage(depth, 0, 0);
        Object.assign(sc, { w: c.width, h: c.height, data: cx.getImageData(0, 0, c.width, c.height).data });
        [color, back, depth, mask].forEach(b => b.close());
        ready.set(name, sc); evict(); return sc;
      }).catch(e => { scenes.delete(name); throw e; }));
      return scenes.get(name);
    }
    const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
    // Each scene holds ~19 MB of textures; keep the six most recently used (never the tree
    // or anything on screen) and let the rest reload on demand.
    function evict() {
      const busy = new Set(['tree', view?.sc.name, anim?.tree?.name, anim?.dest?.name, anim?.from?.sc.name, anim?.end?.sc.name]);
      const idle = [...ready.values()].filter(sc => !busy.has(sc.name)).sort((a, b) => a.used - b.used);
      while (ready.size > 6 && idle.length) {
        const sc = idle.shift();
        [sc.color, sc.back, sc.mask, sc.depth].forEach(t => gl.deleteTexture(t));
        ready.delete(sc.name); scenes.delete(sc.name);
      }
    }
    // Nearest front depth in a small window, so a point on a building's edge picks the building.
    function depthAt(sc, u, v, r = 6) {
      const cx = Math.round(u * (sc.w - 1)), cy = Math.round(v * (sc.h - 1)); let best = 0;
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        const px = Math.min(sc.w - 1, Math.max(0, cx + x)), py = Math.min(sc.h - 1, Math.max(0, cy + y));
        best = Math.max(best, sc.data[(py * sc.w + px) * 4] / 255);
      }
      return best;
    }

    // ---- Viewport --------------------------------------------------------------
    let tanX = IMG_TAN_X, tanY = IMG_TAN_Y, W = 1, H = 1;
    function resize() {
      W = innerWidth; H = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, SETTINGS.maxPixels / W);
      canvas.width = Math.round(W * ratio); canvas.height = Math.round(H * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const A = W / H; // background-size: cover, slightly zoomed so parallax never reaches the edge
      if (A >= 1.5) { tanX = IMG_TAN_X * OVERSCAN; tanY = tanX / A; } else { tanY = IMG_TAN_Y * OVERSCAN; tanX = tanY * A; }
    }
    addEventListener('resize', resize); resize();
    // focus [fx, fy] works like background-position percentages (0..1).
    function projFor(focus, zoom = 1) {
      const tx = tanX / zoom, ty = tanY / zoom;
      const cx = (focus[0] - .5) * 2 * (IMG_TAN_X - tx) * 0.9, cy = (.5 - focus[1]) * 2 * (IMG_TAN_Y - ty) * 0.9;
      return perspective(tx, ty, cx, cy);
    }

    // ---- Camera ------------------------------------------------------------------
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    let holdK = 0, hold = false;
    addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || innerWidth < 761) return;
      pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = e.clientY / innerHeight * 2 - 1;
    }, { passive: true });
    // Parallax + idle drift, as an offset of the eye. The eye slides while looking at the
    // focus plane: nearer things move one way, the mountains drift the other.
    function offset(now) {
      const k = 0.09 * SETTINGS.parallax * (1 - holdK), still = 1 - holdK;
      return [Math.sin(now * 0.00023) * 0.012 * still + pointer.sx * k, Math.sin(now * 0.00031) * 0.008 * still - pointer.sy * k * 0.6, 0];
    }
    const restCam = (now, base) => ({ eye: add(base, offset(now)), target: add(base, [0, 0, -FOCUS]) });

    function drawLayer(front, sc, vp, alpha, move) {
      gl.uniform1f(U.uFront, front ? 1 : 0);
      gl.uniform1f(U.uAlpha, alpha); gl.uniform1f(U.uMove, SETTINGS.edgeSoftening && !front ? move : 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, front ? sc.color : sc.back);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
    }
    function draw(sc, cam, alpha, move, focus, zoom = 1) {
      sc.used = performance.now();
      const vp = mul(projFor(focus, zoom), lookAt(cam.eye, cam.target));
      gl.uniformMatrix4fv(U.uVP, false, vp);
      gl.uniform1f(U.uStrength, SETTINGS.depth); gl.uniform2f(U.uTexel, 1 / sc.w, 1 / sc.h);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sc.depth);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, sc.mask);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      drawLayer(false, sc, vp, alpha, move);
      drawLayer(true, sc, vp, alpha, move);
    }

    // ---- State & transitions ---------------------------------------------------
    let view = null;   // { sc, base, focus }
    let anim = null;   // running transition
    let lastCam = null, frameHook = null, lost = false;
    const deferred = () => { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; };
    let animEnded = 0;
    function finish() { if (!anim) return; const a = anim; anim = null; animEnded = performance.now(); view = a.end; a.swap.resolve(); a.done.resolve(); }
    function start(a) {
      finish();
      a.t0 = performance.now(); a.swap = deferred(); a.done = deferred(); anim = a;
      return { swap: a.swap.promise, done: a.done.promise };
    }
    const baseFor = arrive => arrive ? ARRIVE : [0, 0, 0];

    const api = {
      el: canvas, settings: SETTINGS, paused: false,
      load: name => load(name),
      // True during a transition and shortly after: background preloading waits for calm.
      get busy() { return !!anim || performance.now() - animEnded < 500; },
      get lost() { return lost; },
      // Transitions below are synchronous: call load() first, then start them.
      async show(name, { focus = [.5, .5], arrive = false } = {}) {
        const sc = await load(name);
        if (anim) return; // a transition started meanwhile; it decides the final view
        view = { sc, base: baseFor(arrive), focus };
      },
      // Neural Tree -> destination: slide toward the landmark, crossfade into the plate.
      fly(name, uv, { focus = [.5, .5], treeFocus = [.5, .5] } = {}) {
        const tree = get('tree'), dest = get(name);
        const p = pointAt(uv[0], uv[1], depthAt(tree, uv[0], uv[1]));
        return start({ type: 'fly', reverse: false, tree, dest, p, focus, treeFocus, dur: SETTINGS.flightSeconds * 1000,
          end: { sc: dest, base: ARRIVE, focus } });
      },
      // Destination -> Neural Tree: the same path played backwards.
      flyBack(uv, { treeFocus = [.5, .5] } = {}) {
        const tree = get('tree');
        const dest = view?.sc || tree, focus = view?.focus || [.5, .5];
        const p = pointAt(uv[0], uv[1], depthAt(tree, uv[0], uv[1]));
        return start({ type: 'fly', reverse: true, tree, dest, p, focus, treeFocus, dur: SETTINGS.flightSeconds * 1000,
          end: { sc: tree, base: [0, 0, 0], focus: treeFocus } });
      },
      // Any other page change: crossfade while stepping gently forward.
      dissolve(name, { focus = [.5, .5], arrive = false } = {}) {
        const sc = get(name);
        if (!view) { view = { sc, base: baseFor(arrive), focus }; return { swap: Promise.resolve(), done: Promise.resolve() }; }
        return start({ type: 'dissolve', from: view, end: { sc, base: baseFor(arrive), focus }, dur: SETTINGS.dissolveSeconds * 1000 });
      },
      hold(on) { hold = on; },
      // Screen offset of a Neural Tree landmark from where it sits at rest (for HTML labels).
      offset(u, v) {
        if (!lastCam || !view || view.sc.name !== 'tree' || anim) return [0, 0];
        const p = pointAt(u, v, depthAt(view.sc, u, v));
        const at = cam => { const m = mul(projFor(view.focus), lookAt(cam.eye, cam.target)); const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]; return [(x / w * .5 + .5) * W, (.5 - y / w * .5) * H]; };
        const a = at(lastCam), b = at({ eye: view.base, target: add(view.base, [0, 0, -FOCUS]) });
        return [a[0] - b[0], a[1] - b[1]];
      },
      onFrame(fn) { frameHook = fn; },
      onLost: null
    };
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; api.onLost?.(); });

    let prev = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      // Time-based smoothing, so the motion feels the same at 30, 60 or 144 fps.
      const dt = Math.min(0.1, Math.max(0, (now - prev) / 1000)); prev = now;
      if (lost || document.hidden || api.paused) return;
      const kp = 1 - Math.exp(-dt / 0.28), kh = 1 - Math.exp(-dt / 0.18);
      pointer.sx += (pointer.x - pointer.sx) * kp; pointer.sy += (pointer.y - pointer.sy) * kp;
      holdK += ((hold ? 1 : 0) - holdK) * kh;
      gl.clearColor(0.03, 0.08, 0.15, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      if (anim?.type === 'fly') {
        const a = anim, raw = clamp01((now - a.t0) / a.dur), t = a.reverse ? 1 - raw : raw;
        // Parallax/drift is blended out over the first part of the flight (and back in at the
        // end of a return), so the camera never jumps when a flight starts or lands.
        const settle = 1 - smooth(clamp01(t / 0.4));
        const base = lerp3([0, 0, 0], scale(a.p, DOLLY), ease(t));
        const look = norm(lerp3([0, 0, -1], norm(a.p), TURN * easeOut(clamp01(t * 1.4))));
        const flyCam = { eye: add(base, scale(offset(now), settle)), target: add(base, scale(look, FOCUS)) };
        const fade = smooth(clamp01((t - FADE_START) / FADE_LEN));
        const destCam = restCam(now, lerp3([0, 0, 0.05], ARRIVE, easeOut(clamp01((t - FADE_START) / (1 - FADE_START)))));
        // Zoom only ever increases with t: a zoom that eased back while the camera still moved
        // forward read as a stall.
        if (fade < 1) draw(a.tree, flyCam, 1, Math.min(1, Math.hypot(...base) / 0.5), a.treeFocus, 1 + FLIGHT_ZOOM * smooth(clamp01(t / 0.66)));
        if (fade > 0) draw(a.dest, destCam, fade, 0, a.focus);
        // Swap the page content once the destination dominates (or the tree, on the way back).
        if (a.reverse ? fade < 0.5 : fade > 0.5) a.swap.resolve();
        if (raw >= 1) finish();
      } else if (anim?.type === 'dissolve') {
        const a = anim, t = clamp01((now - a.t0) / a.dur), f = smooth(clamp01(t / 0.6));
        draw(a.from.sc, restCam(now, lerp3(a.from.base, add(a.from.base, [0, 0, -0.18]), easeOut(t))), 1, 0, a.from.focus);
        draw(a.end.sc, restCam(now, lerp3(add(a.end.base, [0, 0, 0.08]), a.end.base, easeOut(t))), f, 0, a.end.focus);
        if (t > 0.3) a.swap.resolve();
        if (t >= 1) finish();
      }
      if (!anim && view) { lastCam = restCam(now, view.base); draw(view.sc, lastCam, 1, 0, view.focus); }
      frameHook?.();
    }
    requestAnimationFrame(frame);
    return api;
  }
  window.DepthWorld = { create, SETTINGS };
})();
