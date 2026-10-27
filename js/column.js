/**
 * The column, and the climb up it.
 *
 * The frieze arrives as one long strip, cut into rows of an atlas image
 * (assets/frieze/atlas.jpg, described by atlas.json). A shader wraps that strip
 * round the shaft as a true helix: at any point on the shaft it works out which
 * turn of the band it is on and how far along the band that is, and reads the
 * strip there. So the column is built from the frieze itself, not a picture of
 * a column.
 *
 * Scrolling reads the frieze in order. The column turns so the part being read
 * always faces you, and the camera climbs as the band does. At each key scene
 * the climb holds still for a moment while its card is up.
 */

import * as THREE from 'three';
import { toRoman, parseRomanRange } from './roman.js';
import { glideTo } from './dom.js';

const TURNS = 23;          // the band winds 23 times
const SCENES = 155;        // Cichorius' numbering

// ---------------------------------------------------------------------------
// shaders
// ---------------------------------------------------------------------------

const vertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vWorldNormal;
  varying vec3 vWorld;
  void main() {
    vObj = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uAtlas;
  uniform vec2 uAtlasPx;       // atlas width, height in px
  uniform float uRowH;         // px per row (= band height in px)
  uniform float uPerTurn;      // strip px per turn of the band
  uniform float uLength;       // strip length in px
  uniform float uBand;         // band height in world units
  uniform vec2 uHi;            // highlighted strip span, px
  uniform float uHiAmt;        // 0..1
  uniform vec3 uCam;

  varying vec3 vObj;
  varying vec3 vWorldNormal;
  varying vec3 vWorld;

  const float TAU = 6.28318530718;
  const vec3 MARBLE = vec3(0.93, 0.90, 0.84);
  const vec3 STONE = vec3(0.70, 0.67, 0.61);

  // Strip px + height within the band -> atlas uv. Kept inside its own row so
  // filtering never bleeds into the row above or below.
  vec2 atlasUV(float x, float w) {
    float row = floor(x / uAtlasPx.x);
    float col = clamp(x - row * uAtlasPx.x, 0.5, uAtlasPx.x - 0.5);
    float yImg = row * uRowH + clamp((1.0 - w) * uRowH, 0.5, uRowH - 0.5);
    return vec2(col / uAtlasPx.x, 1.0 - yImg / uAtlasPx.y);
  }

  float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    // Rightward on the surface, seen from outside, is increasing u.
    float ang = atan(vObj.z, vObj.x);
    float u = fract(-ang / TAU);

    // Seam-safe derivative of u: take whichever of two branch cuts is smooth here.
    float u2 = fract(-atan(-vObj.z, -vObj.x) / TAU + 0.5);
    vec2 du1 = vec2(dFdx(u), dFdy(u));
    vec2 du2 = vec2(dFdx(u2), dFdy(u2));
    vec2 du = dot(du1, du1) < dot(du2, du2) ? du1 : du2;

    float t = vObj.y / uBand - u;        // the band's bottom edge rises one band per turn
    float k = floor(t);
    float w = t - k;                      // 0 at the bottom of the band, 1 at the top
    float q = k + u;                      // turns along the strip
    float x = q * uPerTurn;               // px along the strip

    vec2 dt = vec2(dFdx(vObj.y), dFdy(vObj.y)) / uBand - du;
    vec2 gx = vec2(du.x * uPerTurn / uAtlasPx.x, -dt.x * uRowH / uAtlasPx.y);
    vec2 gy = vec2(du.y * uPerTurn / uAtlasPx.x, -dt.y * uRowH / uAtlasPx.y);

    vec3 albedo;
    vec3 n = normalize(vWorldNormal);
    bool onFrieze = x >= 0.0 && x < uLength;

    if (onFrieze) {
      vec2 uv = atlasUV(x, w);
      vec3 tex = textureGrad(uAtlas, uv, gx, gy).rgb;
      float l = lum(tex);
      // Cast photographs are toned; bring them to one warm marble.
      albedo = mix(MARBLE * (0.18 + 0.95 * l), tex, 0.25);

      // A little relief from the picture's own shading.
      float e = 1.5;
      float lx = lum(textureGrad(uAtlas, atlasUV(x + e, w), gx, gy).rgb) - lum(textureGrad(uAtlas, atlasUV(x - e, w), gx, gy).rgb);
      float ly = lum(textureGrad(uAtlas, atlasUV(x, w + e / uRowH), gx, gy).rgb) - lum(textureGrad(uAtlas, atlasUV(x, w - e / uRowH), gx, gy).rgb);
      vec3 up = vec3(0.0, 1.0, 0.0);
      vec3 around = normalize(cross(up, n));
      n = normalize(n - 1.6 * (lx * around + ly * up));

      // The fillet between turns: a shadowed groove top and bottom.
      float edge = min(w, 1.0 - w);
      albedo *= mix(0.45, 1.0, smoothstep(0.0, 0.035, edge));

      // Away from the scene being shown, the stone dims.
      float inside = smoothstep(uHi.x - 60.0, uHi.x, x) * (1.0 - smoothstep(uHi.y, uHi.y + 60.0, x));
      albedo *= 1.0 - uHiAmt * 0.6 * (1.0 - inside);
    } else {
      albedo = STONE;
      albedo *= 1.0 - uHiAmt * 0.6;
    }

    // Raking light from the upper left, as in a museum photograph.
    vec3 L1 = normalize(vec3(-0.8, 0.55, 0.65));
    vec3 L2 = normalize(vec3(0.9, 0.1, 0.4));
    vec3 V = normalize(uCam - vWorld);
    float d1 = max(dot(n, L1), 0.0);
    float d2 = max(dot(n, L2), 0.0);
    float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    vec3 col = albedo * (0.16 + 1.05 * d1 * vec3(1.0, 0.95, 0.86) + 0.28 * d2 * vec3(0.75, 0.82, 1.0));
    col += 0.06 * rim;
    col = col / (col + vec3(0.85)) * 1.7;      // soft shoulder
    gl_FragColor = vec4(pow(col, vec3(1.0 / 1.1)), 1.0);
  }
`;

// ---------------------------------------------------------------------------
// the strip
// ---------------------------------------------------------------------------

async function loadAtlas() {
  try {
    const meta = await fetch('assets/frieze/atlas.json').then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
    const texture = await new THREE.TextureLoader().loadAsync('assets/frieze/atlas.jpg');
    return { meta, texture };
  } catch {
    return placeholderAtlas();
  }
}

/** Drawn stand-in so the climb works before the real frieze is in place. */
function placeholderAtlas() {
  const width = 2048, rowHeight = 128, perTurn = rowHeight * 11.5;
  const totalLength = Math.round(perTurn * TURNS);
  const rows = Math.ceil(totalLength / width);
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = rows * rowHeight;
  const g = canvas.getContext('2d');
  g.fillStyle = '#8f887b'; g.fillRect(0, 0, canvas.width, canvas.height);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let x = 0; x < totalLength; x += 9 + rand() * 14) {
    const row = Math.floor(x / width), cx = x - row * width, top = row * rowHeight;
    const h = rowHeight * (0.45 + rand() * 0.4);
    g.fillStyle = `hsl(36, 8%, ${48 + rand() * 30}%)`;
    g.beginPath();
    g.ellipse(cx, top + rowHeight - h * 0.55, 5 + rand() * 4, h * 0.45, 0, 0, Math.PI * 2);
    g.ellipse(cx, top + rowHeight - h, 4.5, 5, 0, 0, Math.PI * 2);
    g.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  return { meta: { rows, rowHeight, width, totalLength, plates: [], placeholder: true }, texture };
}

/**
 * Where a Cichorius scene sits on the strip, in px. The plates in atlas.json
 * say which scenes each one covers; between those we interpolate, and with
 * nothing to go on, the scenes are spread evenly.
 */
function sceneLocator(meta) {
  // Each scene's stretch of strip: from the first plate showing it to the end
  // of the last. A scene often runs across two plates.
  const spans = new Map();
  for (const plate of meta.plates || []) {
    const range = parseRomanRange(plate.scenes);
    if (!range) continue;
    for (let n = range[0]; n <= range[1]; n += 1) {
      const span = spans.get(n);
      spans.set(n, span ? [Math.min(span[0], plate.x0), Math.max(span[1], plate.x1)] : [plate.x0, plate.x1]);
    }
  }
  const even = (n) => [((n - 1) / SCENES) * meta.totalLength, (n / SCENES) * meta.totalLength];
  const spanOf = (n) => spans.get(n) ?? even(n);
  const mids = Array.from({ length: SCENES }, (_, i) => {
    const [a, b] = spanOf(i + 1);
    return (a + b) / 2;
  });
  return {
    /** px for a scene number; n - 0.5 and n + 0.5 are the scene's two ends */
    toX(scene) {
      const n = Math.min(SCENES, Math.max(1, Math.round(scene)));
      const [a, b] = spanOf(n);
      return a + (scene - n + 0.5) * (b - a);
    },
    /** the scene whose middle is nearest a px */
    toScene(x) {
      let best = 1, gap = Infinity;
      mids.forEach((m, i) => {
        const d = Math.abs(m - x);
        if (d < gap) { gap = d; best = i + 1; }
      });
      return best;
    },
  };
}

// ---------------------------------------------------------------------------
// the climb
// ---------------------------------------------------------------------------

/**
 * Scroll progress (0..1) -> what the camera is doing.
 *
 * The first and last few percent pull back to show the whole column. Between,
 * the strip is read at an even pace except at key scenes, where it holds.
 */
function buildTimeline(keyX, perTurn, length) {
  const INTRO = 0.09, OUTRO = 0.1, HOLD = 0.045;
  const start = INTRO, end = 1 - OUTRO;
  const holds = keyX.length * HOLD;
  const moving = end - start - holds;

  // Knots: [progress, strip px]
  const knots = [[start, 0]];
  const windows = [];
  let p = start, lastX = 0;
  for (const x of keyX) {
    p += (moving * (x - lastX)) / length;
    knots.push([p, x]);
    windows.push([p, p + HOLD]);
    p += HOLD;
    knots.push([p, x]);
    lastX = x;
  }
  knots.push([end, length]);

  return {
    INTRO, OUTRO, windows,
    /** strip px being read at progress p */
    stripAt(prog) {
      if (prog <= start) return 0;
      if (prog >= end) return length;
      for (let i = 1; i < knots.length; i += 1) {
        const [p0, x0] = knots[i - 1], [p1, x1] = knots[i];
        if (prog <= p1) {
          const f = p1 === p0 ? 1 : (prog - p0) / (p1 - p0);
          // ease into and out of every hold
          const e = f * f * (3 - 2 * f);
          return x0 + (x1 - x0) * e;
        }
      }
      return length;
    },
    /** index of the key scene being held, or -1, and how deep into it (0..1) */
    holdAt(prog) {
      for (let i = 0; i < windows.length; i += 1) {
        const [a, b] = windows[i];
        const pad = HOLD * 0.35;
        if (prog >= a - pad && prog <= b + pad) {
          const inner = Math.min(1, Math.min(prog - (a - pad), (b + pad) - prog) / pad);
          return { index: i, amount: inner };
        }
      }
      return { index: -1, amount: 0 };
    },
  };
}

export async function mountColumn({ stage, canvas, keyScenes, onScene, onReady }) {
  const { meta, texture } = await loadAtlas();
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  const perTurn = meta.totalLength / TURNS;
  // Band height is one world unit; the circumference follows from the strip's
  // own proportions, so the carving is never stretched.
  const band = 1;
  const circumference = (perTurn / meta.rowHeight) * band;
  const radius = circumference / (2 * Math.PI);
  const shaftH = (TURNS + 1) * band;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 400);

  const column = new THREE.Group();
  scene.add(column);

  const uniforms = {
    uAtlas: { value: texture },
    uAtlasPx: { value: new THREE.Vector2(meta.width, meta.rows * meta.rowHeight) },
    uRowH: { value: meta.rowHeight },
    uPerTurn: { value: perTurn },
    uLength: { value: meta.totalLength },
    uBand: { value: band },
    uHi: { value: new THREE.Vector2(-1e9, 1e9) },
    uHiAmt: { value: 0 },
    uCam: { value: new THREE.Vector3() },
  };
  const shaftMat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  // The shader reads object-space height from 0 at the foot of the shaft, so
  // the geometry itself is lifted rather than the mesh.
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, shaftH, 256, 1, true), shaftMat);
  shaft.geometry.translate(0, shaftH / 2, 0);
  column.add(shaft);

  // Pedestal, wreath, capital, railing and statue: see ornament.js.
  const { buildOrnament } = await import('./ornament.js');
  column.add(await buildOrnament({ radius, band, shaftH }));

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
  key.position.set(-6, 8, 7);
  const fill = new THREE.DirectionalLight(0xbfd0ff, 0.5);
  fill.position.set(8, 2, 4);
  scene.add(key, fill);

  // Key scenes, in strip px.
  const locate = sceneLocator(meta);
  const keyX = keyScenes.map((s) => locate.toX(s.scene));
  const spans = keyScenes.map((s) => [locate.toX(s.scene - 0.5) - perTurn * 0.03, locate.toX(s.scene + 0.5) + perTurn * 0.03]);
  const timeline = buildTimeline(keyX, perTurn, meta.totalLength);

  // ── sizing ──
  let wide = true;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wide = w > 860;
    needs = true;
  }
  new ResizeObserver(resize).observe(stage);

  // ── scroll ──
  let target = 0, current = 0, needs = true, visible = false;
  function readScroll() {
    const rect = stage.parentElement.getBoundingClientRect();
    const total = rect.height - stage.clientHeight;
    const stickTop = parseFloat(getComputedStyle(stage).top) || 0;
    target = Math.min(1, Math.max(0, (stickTop - rect.top) / Math.max(1, total)));
  }
  window.addEventListener('scroll', () => { readScroll(); needs = true; }, { passive: true });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) needs = true; }).observe(stage);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tmp = new THREE.Vector3();
  let shownScene = -2;

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || (!needs && Math.abs(target - current) < 1e-5)) return;
    current += (target - current) * (reduceMotion ? 1 : 0.12);
    if (Math.abs(target - current) < 1e-5) { current = target; needs = false; }

    const p = current;
    const x = timeline.stripAt(p);
    const q = x / perTurn;                        // turns along the strip
    const readY = q * band + band / 2;

    // Turn the column so the point being read faces the camera.
    column.rotation.y = 2 * Math.PI * (0.75 - q);

    // Where the camera looks. Most of the climb follows the band; at the two
    // ends it stops to look at the pedestal and at the capital and statue,
    // and pulls right back to show the whole column.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const fit = (h) => h / (2 * Math.tan(halfFov));
    const D = radius * 2;
    const views = {
      read: { y: readY, dist: fit(band * 7) + radius, lift: -band * 0.8 },
      full: { y: shaftH * 0.5, dist: fit(shaftH + band * 15) * 1.06 + radius, lift: 0 },
      base: { y: -band * 1.2 - D * 0.55, dist: fit(D * 1.25 + band * 4.5) + D, lift: band * 0.6 },
      top: { y: shaftH + band * 3.8, dist: fit(band * 11.5) + D, lift: -band * 1.2 },
    };
    const I = timeline.INTRO, O = 1 - timeline.OUTRO;
    // [progress, view] keyframes; between two, the camera eases.
    const keys = [
      [0, 'full'], [I * 0.38, 'base'], [I * 0.72, 'base'], [I, 'read'],
      [O, 'read'], [O + (1 - O) * 0.3, 'top'], [O + (1 - O) * 0.6, 'top'], [1, 'full'],
    ];
    let view = views.read;
    if (p < I || p > O) {
      let k = 1;
      while (k < keys.length - 1 && p > keys[k][0]) k += 1;
      const [p0, v0] = keys[k - 1], [p1, v1] = keys[k];
      const f = smooth((p - p0) / Math.max(1e-6, p1 - p0));
      const A = views[v0], B = views[v1];
      view = { y: A.y + (B.y - A.y) * f, dist: A.dist + (B.dist - A.dist) * f, lift: A.lift + (B.lift - A.lift) * f };
    }
    const focusY = view.y, dist = view.dist;

    // On a wide screen the column sits left of centre.
    const viewW = 2 * dist * Math.tan(halfFov) * camera.aspect;
    const shift = wide ? viewW * 0.17 : 0;
    camera.position.set(shift, focusY + view.lift, dist);
    camera.lookAt(tmp.set(shift, focusY, 0));
    uniforms.uCam.value.copy(camera.position);

    // Key scene in view?
    const hold = timeline.holdAt(p);
    if (hold.index >= 0) {
      uniforms.uHi.value.set(spans[hold.index][0], spans[hold.index][1]);
      uniforms.uHiAmt.value = hold.amount;
    } else {
      uniforms.uHiAmt.value = 0;
    }
    const on = hold.index >= 0 && hold.amount > 0.25 ? hold.index : -1;
    if (on !== shownScene) { shownScene = on; onScene?.({ index: on }); }

    onScene?.({
      gauge: {
        progress: p,
        feet: Math.round(Math.max(0, Math.min(1, readY / shaftH)) * 100),
        turn: Math.min(TURNS, Math.floor(q) + 1),
        scene: locate.toScene(x),
      },
    });

    renderer.render(scene, camera);
  }

  resize();
  readScroll();
  requestAnimationFrame(frame);
  /** Scroll the page to the middle of key scene i's pause. */
  function goTo(i) {
    const section = stage.parentElement;
    const total = section.offsetHeight - stage.clientHeight;
    const [a, b] = timeline.windows[i];
    const top = section.getBoundingClientRect().top + window.scrollY;
    glideTo(top + ((a + b) / 2) * total);
  }
  onReady?.({ placeholder: Boolean(meta.placeholder), goTo });
}

function smooth(t) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

export { toRoman };
