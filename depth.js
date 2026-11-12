/* 2.5D depth world: each background plate becomes a mesh displaced by its depth map
   (assets/depth/NAME.png), so the camera can drift and fly with real parallax.
   world.js falls back to the flat #scenery images when WebGL2 or motion is unavailable.
   Tune the feel in SETTINGS; lab/depth.html (local only) has live sliders for them. */
(() => {
  'use strict';
  const SETTINGS = {
    depth: 1.0,          // 0 = flat image, 1 = estimated depth, >1 exaggerated
    parallax: 0.8,       // mouse parallax strength
    flightSeconds: 2.0,  // Neural Tree <-> destination flight
    dissolveSeconds: 1.1,// other page changes
    edgeSoftening: true  // blur the mesh where it stretches behind near objects
  };

  // Every pixel lies on its own ray from the original camera; depth only moves it along
  // that ray, so from the resting viewpoint the painting is reproduced exactly.
  const IMG_TAN_Y = Math.tan(20 * Math.PI / 180), IMG_TAN_X = IMG_TAN_Y * 1.5;
  const NEAR = 1, FAR = 10, FOCUS = 3;
  const OVERSCAN = 0.9;               // world.css sizes the map canvas to match (/ .9)
  const ARRIVE = [0, 0, -0.22];       // resting eye on destination pages: a step into the scene
  const DOLLY = 0.5, TURN = 0.3, FADE_START = 0.38, FADE_LEN = 0.28;

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
uniform float uNear, uFar, uFocus, uStrength;
out vec2 vUv; out float vEdge;
float zOf(float d){ float z = 1.0 / (1.0/uFar + (1.0/uNear - 1.0/uFar) * d); return uFocus + (z - uFocus) * uStrength; }
void main(){
  float d = texture(uDepth, aUv).r;
  float dx = texture(uDepth, aUv + vec2(uTexel.x * 2.0, 0)).r - texture(uDepth, aUv - vec2(uTexel.x * 2.0, 0)).r;
  float dy = texture(uDepth, aUv + vec2(0, uTexel.y * 2.0)).r - texture(uDepth, aUv - vec2(0, uTexel.y * 2.0)).r;
  vEdge = smoothstep(0.015, 0.08, length(vec2(dx, dy)));
  float z = zOf(d);
  vUv = aUv;
  gl_Position = uVP * vec4((aUv.x - 0.5) * 2.0 * uTan.x * z, (0.5 - aUv.y) * 2.0 * uTan.y * z, -z, 1.0);
}`;
  const FS = `#version 300 es
precision highp float;
in vec2 vUv; in float vEdge;
uniform sampler2D uColor; uniform float uAlpha, uMove;
out vec4 o;
void main(){
  vec3 c = texture(uColor, vUv).rgb;
  float k = vEdge * uMove;
  if (k > 0.0) c = mix(c, textureLod(uColor, vUv, 3.5).rgb, clamp(k * 1.4, 0.0, 0.9));
  o = vec4(c, uAlpha);
}`;

  function create() {
    const canvas = document.createElement('canvas');
    canvas.id = 'depth';
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const U = {}; ['uDepth', 'uColor', 'uVP', 'uTan', 'uTexel', 'uNear', 'uFar', 'uFocus', 'uStrength', 'uAlpha', 'uMove'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    gl.uniform2f(U.uTan, IMG_TAN_X, IMG_TAN_Y); gl.uniform1f(U.uNear, NEAR); gl.uniform1f(U.uFar, FAR); gl.uniform1f(U.uFocus, FOCUS);
    gl.uniform1i(U.uDepth, 0); gl.uniform1i(U.uColor, 1);

    const GX = 320, GY = 214;
    const uvs = new Float32Array((GX + 1) * (GY + 1) * 2);
    for (let y = 0, i = 0; y <= GY; y++) for (let x = 0; x <= GX; x++) { uvs[i++] = x / GX; uvs[i++] = y / GY; }
    const idx = new Uint32Array(GX * GY * 6);
    for (let y = 0, i = 0; y < GY; y++) for (let x = 0; x < GX; x++) { const a = y * (GX + 1) + x, b = a + 1, c = a + GX + 1, d = c + 1; idx.set([a, c, b, b, c, d], i); i += 6; }
    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aUv'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ---- Scene loading -------------------------------------------------------
    const scenes = new Map(), ready = new Map();
    const get = name => { const sc = ready.get(name); if (!sc) throw new Error('Scene not loaded: ' + name); return sc; };
    const loadImage = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not load ' + src)); i.src = src; });
    function texture(img, mips) {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mips) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      return t;
    }
    function load(name) {
      if (!scenes.has(name)) scenes.set(name, Promise.all([loadImage(`assets/${name}.webp`), loadImage(`assets/depth/${name}.png`)]).then(([color, depth]) => {
        const c = document.createElement('canvas'); c.width = depth.width; c.height = depth.height;
        const cx = c.getContext('2d', { willReadFrequently: true }); cx.drawImage(depth, 0, 0);
        const data = cx.getImageData(0, 0, c.width, c.height).data;
        const sc = { name, color: texture(color, true), depth: texture(depth, false), w: c.width, h: c.height, data };
        ready.set(name, sc); return sc;
      }).catch(e => { scenes.delete(name); throw e; }));
      return scenes.get(name);
    }
    // Nearest depth in a small window, so a point on a building's edge picks the building.
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
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
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
    // The eye slides while looking at the focus plane: nearer things move one way, the
    // mountains drift the other. hold() eases it back to rest (map routes stay aligned).
    function restCam(now, base) {
      const k = 0.09 * SETTINGS.parallax * (1 - holdK);
      const drift = [Math.sin(now * 0.00023) * 0.012 * (1 - holdK), Math.sin(now * 0.00031) * 0.008 * (1 - holdK), 0];
      const eye = add(add(base, drift), [pointer.sx * k, -pointer.sy * k * 0.6, 0]);
      return { eye, target: add(base, [0, 0, -FOCUS]) };
    }

    function draw(sc, cam, alpha, move, focus, zoom = 1) {
      gl.uniformMatrix4fv(U.uVP, false, mul(projFor(focus, zoom), lookAt(cam.eye, cam.target)));
      gl.uniform1f(U.uStrength, SETTINGS.depth); gl.uniform2f(U.uTexel, 1 / sc.w, 1 / sc.h);
      gl.uniform1f(U.uAlpha, alpha); gl.uniform1f(U.uMove, SETTINGS.edgeSoftening ? move : 0);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sc.depth);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, sc.color);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
    }

    // ---- State & transitions ---------------------------------------------------
    let view = null;   // { sc, base, focus }
    let anim = null;   // running transition
    let lastCam = null, frameHook = null, lost = false;
    const deferred = () => { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; };
    function finish() { if (!anim) return; const a = anim; anim = null; view = a.end; a.swap.resolve(); a.done.resolve(); }
    function start(a) {
      finish();
      a.t0 = performance.now(); a.swap = deferred(); a.done = deferred(); anim = a;
      return { swap: a.swap.promise, done: a.done.promise };
    }
    const baseFor = arrive => arrive ? ARRIVE : [0, 0, 0];

    const api = {
      el: canvas, settings: SETTINGS, paused: false,
      load: name => load(name),
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
        const from = view;
        return start({ type: 'dissolve', from, end: { sc, base: baseFor(arrive), focus }, dur: SETTINGS.dissolveSeconds * 1000 });
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

    function frame(now) {
      requestAnimationFrame(frame);
      if (lost || document.hidden || api.paused) return;
      pointer.sx += (pointer.x - pointer.sx) * 0.06; pointer.sy += (pointer.y - pointer.sy) * 0.06;
      holdK += ((hold ? 1 : 0) - holdK) * 0.1;
      gl.clearColor(0.03, 0.08, 0.15, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      if (anim?.type === 'fly') {
        const a = anim, raw = clamp01((now - a.t0) / a.dur), t = a.reverse ? 1 - raw : raw;
        const eye = lerp3([0, 0, 0], scale(a.p, DOLLY), ease(t));
        const look = norm(lerp3([0, 0, -1], norm(a.p), TURN * easeOut(clamp01(t * 1.4))));
        const flyCam = { eye, target: add(eye, scale(look, FOCUS)) };
        const fade = clamp01((t - FADE_START) / FADE_LEN);
        const destCam = restCam(now, lerp3([0, 0, 0.05], ARRIVE, easeOut(clamp01((t - FADE_START) / (1 - FADE_START)))));
        if (fade < 1) draw(a.tree, flyCam, 1, Math.min(1, Math.hypot(...eye) / 0.5), a.treeFocus, 1 + 0.14 * Math.sin(Math.PI * Math.min(1, t * 1.4)));
        if (fade > 0) draw(a.dest, destCam, fade, 0, a.focus);
        // Swap the page content once the destination dominates (or the tree, on the way back).
        if (a.reverse ? fade < 0.5 : fade > 0.5) a.swap.resolve();
        if (raw >= 1) finish();
      } else if (anim?.type === 'dissolve') {
        const a = anim, t = clamp01((now - a.t0) / a.dur), f = easeOut(clamp01(t / 0.6));
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
