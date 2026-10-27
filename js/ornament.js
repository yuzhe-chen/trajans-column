/**
 * The carved parts of the column above and below the frieze.
 *
 * Below: the pedestal, its four sides heaped with captured Dacian arms
 * (shields, helmets, curved falces, dragon standards, trumpets), the front with
 * the dedicatory inscription held up by two winged Victories over the door to
 * the tomb chamber, eagles at the four upper corners carrying laurel garlands,
 * and a great laurel wreath as the base of the shaft.
 *
 * Above: a bead-and-reel ring, the Doric capital with its egg-and-dart, the
 * square abacus, the modern railing of the viewing platform, the drum, and the
 * bronze statue on top (Trajan's, lost; St Peter's since 1588).
 *
 * All of it is drawn here on canvases, as height maps that light as relief, so
 * there are no extra images to load.
 */

import * as THREE from 'three';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// drawing helpers: everything is a height map (light = raised)
// ---------------------------------------------------------------------------

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/** A raised dome: bright centre, falling away to the rim. */
function dome(g, x, y, rx, ry, rot = 0, peak = 1) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(1, ry / rx);
  const grad = g.createRadialGradient(-rx * 0.15, -rx * 0.15, rx * 0.05, 0, 0, rx);
  grad.addColorStop(0, `rgba(255,255,255,${peak})`);
  grad.addColorStop(0.75, `rgba(200,200,200,${peak * 0.85})`);
  grad.addColorStop(1, `rgba(120,120,120,${peak * 0.6})`);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(0, 0, rx, 0, TAU);
  g.fill();
  g.restore();
}

function shield(g, r, x, y, s) {
  const kind = r() < 0.7 ? 0 : 1;
  const rot = (r() - 0.5) * 1.2;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.fillStyle = '#d9d9d9';
  g.strokeStyle = '#ffffff';
  g.lineWidth = s * 0.08;
  g.beginPath();
  if (kind === 0 || kind === 2) g.ellipse(0, 0, s, s * 1.35, 0, 0, TAU);                  // oval Dacian shield
  else if (kind === 1) {                                                       // hexagonal
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * TAU + Math.PI / 6;
      g.lineTo(Math.cos(a) * s * 1.05, Math.sin(a) * s * 1.3);
    }
    g.closePath();
  }
  g.fill();
  g.stroke();
  // decoration: a ring of studs or a wreath line, and the boss
  g.strokeStyle = 'rgba(255,255,255,.9)';
  g.lineWidth = s * 0.05;
  g.beginPath();
  g.ellipse(0, 0, s * 0.6, s * 0.8, 0, 0, TAU);
  g.stroke();
  g.restore();
  dome(g, x, y, s * 0.28, s * 0.28);
}

function helmet(g, x, y, s, r) {
  dome(g, x, y, s, s * 0.8, (r() - 0.5) * 0.6);
  g.fillStyle = 'rgba(255,255,255,.85)';
  g.fillRect(x - s * 1.1, y + s * 0.55, s * 2.2, s * 0.22);                   // brim
  g.fillRect(x - s * 0.08, y - s * 1.1, s * 0.16, s * 0.5);                   // crest stalk
}

function falx(g, x, y, s, r) {
  g.save();
  g.translate(x, y);
  g.rotate(r() * TAU);
  g.strokeStyle = '#f2f2f2';
  g.lineCap = 'round';
  g.lineWidth = s * 0.16;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -s * 1.2);                                                        // grip
  g.stroke();
  g.lineWidth = s * 0.24;
  g.beginPath();
  g.moveTo(0, -s * 1.2);
  g.quadraticCurveTo(s * 0.2, -s * 2.6, s * 1.4, -s * 2.4);                    // curved blade
  g.stroke();
  g.restore();
}

function draco(g, x, y, s, r) {
  // The Dacian dragon standard: a wolf's head on a pole with a cloth tube body.
  g.save();
  g.translate(x, y);
  g.rotate((r() - 0.5) * 1.4);
  g.strokeStyle = '#eeeeee';
  g.lineWidth = s * 0.12;
  g.beginPath(); g.moveTo(0, s * 1.5); g.lineTo(0, -s * 0.2); g.stroke();
  dome(g, s * 0.25, -s * 0.4, s * 0.45, s * 0.3);
  g.lineWidth = s * 0.4;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(-s * 0.2, -s * 0.35);
  g.bezierCurveTo(-s * 1, -s * 0.6, -s * 1.4, 0, -s * 2.2, -s * 0.5);
  g.stroke();
  g.restore();
}

function trumpet(g, x, y, s, r) {
  g.save();
  g.translate(x, y);
  g.rotate(r() * TAU);
  g.strokeStyle = '#f0f0f0';
  g.lineWidth = s * 0.14;
  g.beginPath();
  g.arc(0, 0, s * 1.2, 0.3, 4.2);
  g.stroke();
  dome(g, Math.cos(4.2) * s * 1.2, Math.sin(4.2) * s * 1.2, s * 0.35, s * 0.35);
  g.restore();
}

/** A heap of captured arms filling a rectangle. */
function spolia(g, x0, y0, w, h, seed, scale = 1) {
  const r = rng(seed);
  // Spears first, so the rest piles on top of them.
  g.strokeStyle = '#e6e6e6';
  g.lineCap = 'round';
  for (let i = 0; i < Math.round(w / 45); i += 1) {
    const x = x0 + r() * w, y = y0 + r() * h, a = r() * Math.PI, L = 120 + r() * 160;
    g.lineWidth = 6 * scale;
    g.beginPath(); g.moveTo(x - Math.cos(a) * L / 2, y - Math.sin(a) * L / 2); g.lineTo(x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2); g.stroke();
  }
  const n = Math.round((w * h) / (2300 / (scale * scale)));
  for (let i = 0; i < n; i += 1) {
    const x = x0 + r() * w, y = y0 + r() * h;
    const s = (26 + r() * 30) * scale;
    const pick = r();
    if (pick < 0.42) shield(g, r, x, y, s);
    else if (pick < 0.6) helmet(g, x, y, s * 0.7, r);
    else if (pick < 0.75) falx(g, x, y, s * 0.6, r);
    else if (pick < 0.88) draco(g, x, y, s * 0.7, r);
    else trumpet(g, x, y, s * 0.7, r);
  }
}

/** A laurel garland hanging in a swag from (x0,y) to (x1,y). */
function swag(g, x0, x1, y, sag, thick) {
  const r = rng(Math.round(x0 * 7 + y));
  const steps = 60;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const yy = y + Math.sin(t * Math.PI) * sag;
    const th = thick * (0.55 + Math.sin(t * Math.PI) * 0.6);
    leaf(g, x + (r() - 0.5) * th, yy + (r() - 0.5) * th, th * 0.7, (r() - 0.5) * 2.4 + Math.PI / 2);
  }
}

function leaf(g, x, y, len, rot) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  const grad = g.createLinearGradient(0, -len * 0.3, 0, len * 0.3);
  grad.addColorStop(0, '#bcbcbc');
  grad.addColorStop(0.5, '#ffffff');
  grad.addColorStop(1, '#a8a8a8');
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(0, 0, len, len * 0.32, 0, 0, TAU);
  g.fill();
  g.strokeStyle = 'rgba(90,90,90,.7)';
  g.lineWidth = Math.max(1, len * 0.06);
  g.beginPath(); g.moveTo(-len, 0); g.lineTo(len, 0); g.stroke();
  g.restore();
}

/** A winged Victory, in low relief, facing left or right. */
function victory(g, x, y, s, dir) {
  g.save();
  g.translate(x, y);
  g.scale(dir, 1);
  g.fillStyle = '#e8e8e8';
  // wing: a fan of feathers
  for (let i = 0; i < 9; i += 1) {
    g.save();
    g.rotate(-1.9 + i * 0.13);
    g.beginPath();
    g.ellipse(s * 0.9, 0, s * (0.9 + i * 0.03), s * 0.12, 0, 0, TAU);
    g.fill();
    g.restore();
  }
  // body and drapery
  g.fillStyle = '#f4f4f4';
  g.beginPath();
  g.moveTo(-s * 0.15, -s * 1.1);
  g.quadraticCurveTo(s * 0.35, -s * 0.2, s * 0.25, s * 1.6);
  g.lineTo(-s * 0.55, s * 1.6);
  g.quadraticCurveTo(-s * 0.5, -s * 0.1, -s * 0.15, -s * 1.1);
  g.fill();
  dome(g, -s * 0.05, -s * 1.3, s * 0.2, s * 0.22);
  // arm reaching toward the panel
  g.strokeStyle = '#f4f4f4';
  g.lineWidth = s * 0.14;
  g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, -s * 0.85); g.lineTo(s * 0.75, -s * 1.05); g.stroke();
  g.restore();
}

function frame(g, x, y, w, h, t) {
  g.strokeStyle = '#ffffff';
  g.lineWidth = t;
  g.strokeRect(x, y, w, h);
  g.strokeStyle = '#9a9a9a';
  g.lineWidth = t * 0.4;
  g.strokeRect(x + t, y + t, w - 2 * t, h - 2 * t);
}

/** Height map -> a marble colour map with the relief shaded into it. */
function toColour(height, tint = [0.9, 0.87, 0.81]) {
  const [c, g] = canvas(height.width, height.height);
  g.drawImage(height, 0, 0);
  const img = g.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i] / 255;
    const shade = 0.42 + v * 0.62;
    d[i] = 255 * Math.min(1, tint[0] * shade);
    d[i + 1] = 255 * Math.min(1, tint[1] * shade);
    d[i + 2] = 255 * Math.min(1, tint[2] * shade);
  }
  g.putImageData(img, 0, 0);
  return c;
}

function texture(c, { repeatX = 1, srgb = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set(repeatX, 1);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------------------
// the pedestal faces
// ---------------------------------------------------------------------------

const BG = '#6e6e6e';

function pedestalFace(seed, { front = false, inscription = null } = {}) {
  const S = 1024;
  const [c, g] = canvas(S, S);
  g.fillStyle = BG;
  g.fillRect(0, 0, S, S);
  // raised border
  frame(g, 26, 26, S - 52, S - 52, 16);

  if (!front) {
    spolia(g, 70, 150, S - 140, S - 230, seed);
  } else {
    // arms heaped to the sides and below
    spolia(g, 60, 140, 190, S - 220, seed);
    spolia(g, S - 250, 140, 190, S - 220, seed + 1);
    spolia(g, 250, 610, S - 500, 60, seed + 2, 0.6);
    // the inscription panel, held by two Victories
    const px = 300, py = 320, pw = S - 600, ph = 250;
    victory(g, px - 70, py + 150, 95, 1);
    victory(g, px + pw + 70, py + 150, 95, -1);
    g.fillStyle = '#858585';
    g.fillRect(px, py, pw, ph);
    frame(g, px - 14, py - 14, pw + 28, ph + 28, 12);
    // the door to the tomb chamber
    g.fillStyle = '#121212';
    g.fillRect(S / 2 - 90, S - 330, 180, 280);
    frame(g, S / 2 - 108, S - 348, 216, 316, 14);
  }

  const colour = toColour(c);
  if (front && inscription) {
    // the stone itself in the panel, toned to match
    const cg = colour.getContext('2d');
    cg.save();
    cg.filter = 'grayscale(1) sepia(.25) brightness(1.05) contrast(1.1)';
    cg.drawImage(inscription, 300, 320, S - 600, 250);
    cg.restore();
  }
  return { height: c, colour };
}

// ---------------------------------------------------------------------------
// bands: laurel, egg-and-dart, bead-and-reel
// ---------------------------------------------------------------------------

function laurelStrip() {
  const [c, g] = canvas(1024, 256);
  g.fillStyle = '#7a7a7a';
  g.fillRect(0, 0, 1024, 256);
  const r = rng(11);
  // Leaves in overlapping rows, all pointing one way round the wreath, with a
  // ribbon binding every so often.
  for (let row = 0; row < 7; row += 1) {
    for (let x = -40; x < 1080; x += 26) {
      const y = 18 + row * 36 + (r() - 0.5) * 10;
      leaf(g, x + (row % 2) * 13, y, 30 + r() * 6, -0.55 + (r() - 0.5) * 0.25);
    }
  }
  for (const x of [128, 640]) {
    g.fillStyle = 'rgba(255,255,255,.95)';
    g.save();
    g.translate(x, 128);
    g.rotate(0.35);
    g.fillRect(-14, -140, 28, 280);
    g.restore();
  }
  return { height: c, colour: toColour(c) };
}

function eggDartStrip() {
  const W = 2048, H = 256, N = 28;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#5a5a5a';
  g.fillRect(0, 0, W, H);
  const step = W / N;
  for (let i = 0; i < N; i += 1) {
    const x = (i + 0.5) * step;
    // the egg in its shell
    g.fillStyle = '#d0d0d0';
    g.beginPath();
    g.ellipse(x, H * 0.5, step * 0.42, H * 0.38, 0, 0, TAU);
    g.fill();
    g.fillStyle = '#4a4a4a';
    g.beginPath();
    g.ellipse(x, H * 0.52, step * 0.33, H * 0.3, 0, 0, TAU);
    g.fill();
    dome(g, x, H * 0.5, step * 0.3, H * 0.28);
    // the dart between eggs
    const dx = i * step;
    g.fillStyle = '#f0f0f0';
    g.beginPath();
    g.moveTo(dx, H * 0.86);
    g.lineTo(dx - step * 0.08, H * 0.3);
    g.lineTo(dx, H * 0.14);
    g.lineTo(dx + step * 0.08, H * 0.3);
    g.closePath();
    g.fill();
  }
  // fillets above and below
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H * 0.06);
  g.fillRect(0, H * 0.94, W, H * 0.06);
  return { height: c, colour: toColour(c) };
}

function beadStrip() {
  const W = 1024, H = 64, N = 40;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#555';
  g.fillRect(0, 0, W, H);
  const step = W / N;
  for (let i = 0; i < N; i += 1) {
    const x = i * step;
    dome(g, x + step * 0.35, H / 2, step * 0.3, H * 0.42);                      // bead
    dome(g, x + step * 0.78, H / 2, step * 0.08, H * 0.32);                     // reel
    dome(g, x + step * 0.92, H / 2, step * 0.08, H * 0.32);
  }
  return { height: c, colour: toColour(c) };
}

function material(maps, { repeatX = 1, bump = 0.06, colour = 0xffffff, rough = 0.85 } = {}) {
  return new THREE.MeshStandardMaterial({
    map: texture(maps.colour, { repeatX, srgb: true }),
    bumpMap: texture(maps.height, { repeatX }),
    bumpScale: bump,
    color: colour,
    roughness: rough,
    metalness: 0,
  });
}

// ---------------------------------------------------------------------------
// 3D parts
// ---------------------------------------------------------------------------

function eagle(stoneMat, s) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), stoneMat);
  body.scale.set(0.32 * s, 0.5 * s, 0.3 * s);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16 * s, 16, 12), stoneMat);
  head.position.set(0, 0.55 * s, 0.12 * s);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06 * s, 0.2 * s, 10), stoneMat);
  beak.position.set(0, 0.52 * s, 0.3 * s);
  beak.rotation.x = Math.PI / 2;
  // Spread wings: a scalloped outline, extruded thin.
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.5, 0.55, 1.15, 0.5);
  for (let i = 0; i < 5; i += 1) {
    const x = 1.15 - i * 0.24;
    shape.quadraticCurveTo(x - 0.06, 0.1 - i * 0.03, x - 0.24, 0.32 - i * 0.07);
  }
  shape.lineTo(0, -0.25);
  shape.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
  wingGeo.scale(s, s, s);
  // The eagle faces out from the corner; each wing folds back along one of
  // the two faces that meet there, drooping a little.
  const wing = (turn) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0.2 * s, -0.05 * s);
    pivot.rotation.y = turn;
    const w = new THREE.Mesh(wingGeo, stoneMat);
    w.rotation.z = 0.3;
    w.scale.setScalar(1.35);
    pivot.add(w);
    return pivot;
  };
  const left = wing(Math.PI / 4 - 0.45);
  const right = wing((3 * Math.PI) / 4 + 0.45);
  // talons gripping the garland
  const claws = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 0.25 * s, 10), stoneMat);
  claws.position.set(0, -0.55 * s, 0.05 * s);
  g.add(body, head, beak, left, right, claws);
  return g;
}

function garland(mat, from, to, sag, thick) {
  const mid = from.clone().lerp(to, 0.5);
  mid.y -= sag;
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 40, thick, 12, false), mat);
}

/** A limb from point a to point b: a capsule of radius r. */
function limb(mat, a, b, r) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 6, 14), mat);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

/** Push every vertex out or in along its own radius, for folds and curls. */
function displace(geo, fn) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.z, v.x);
    const k = fn(a, v.y, v);
    pos.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  geo.computeVertexNormals();
  return geo;
}

/** One of St Peter's keys: a ring bow, a long shaft and a notched bit. */
function key(mat, s) {
  const g = new THREE.Group();
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.055 * s, 0.014 * s, 8, 24), mat);
  bow.position.y = -0.04 * s;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.014 * s, 0.014 * s, 0.42 * s, 8), mat);
  shaft.position.y = 0.2 * s;
  const bit = new THREE.Mesh(new THREE.BoxGeometry(0.07 * s, 0.1 * s, 0.018 * s), mat);
  bit.position.set(0.04 * s, 0.36 * s, 0);
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.03 * s, 0.025 * s, 0.022 * s), mat);
  notch.position.set(0.07 * s, 0.33 * s, 0);
  g.add(bow, shaft, bit, notch);
  return g;
}

function statue(bronze, s) {
  // St Peter in bronze, as he has stood on the column since 1588: a long
  // tunic falling in folds, a cloak over the back and one shoulder, the keys
  // of heaven raised in his right hand and a scroll in his left. Built facing
  // +z; the caller turns him to face the inscription.
  const g = new THREE.Group();
  const V = (x, y, z) => new THREE.Vector3(x * s, y * s, z * s);

  // the tunic, turned on a lathe, then pleated
  const profile = [
    [0, 0], [0.27, 0], [0.29, 0.04], [0.27, 0.14], [0.24, 0.45], [0.215, 0.8], [0.2, 1.05],
    [0.19, 1.22], [0.205, 1.4], [0.225, 1.58], [0.235, 1.7], [0.21, 1.8], [0.13, 1.87], [0.075, 1.9], [0, 1.9],
  ].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const tunicGeo = displace(new THREE.LatheGeometry(profile, 96), (a, y) => {
    const t = y / s;
    const below = Math.max(0, 1 - t / 1.25);            // folds deepen toward the hem
    return 1 + 0.06 * below * Math.sin(a * 13 + t * 1.6) + 0.025 * Math.sin(a * 27 - t * 3);
  });
  const tunic = new THREE.Mesh(tunicGeo, bronze);
  tunic.scale.z = 0.74;
  g.add(tunic);

  // the cloak: an open shell over the back and the left shoulder, hanging in
  // heavier folds, with a sash slung across the chest
  const cloakGeo = displace(
    new THREE.CylinderGeometry(0.245 * s, 0.31 * s, 1.35 * s, 96, 24, true, Math.PI * 0.35, Math.PI * 1.3),
    (a, y) => 1 + 0.07 * Math.sin(a * 9 + y / s * 2.5),
  );
  const cloak = new THREE.Mesh(cloakGeo, bronze);
  cloak.position.y = 1.12 * s;
  cloak.scale.z = 0.8;
  cloak.material = bronze;
  g.add(cloak);
  const sash = new THREE.Mesh(new THREE.TorusGeometry(0.235 * s, 0.035 * s, 10, 48, Math.PI), bronze);
  sash.position.set(0, 1.5 * s, 0.02 * s);
  sash.rotation.set(Math.PI / 2 - 0.25, 0.55, 0);
  sash.scale.set(1, 0.74, 1);
  g.add(sash);

  // feet under the hem
  for (const x of [-0.09, 0.09]) {
    const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.04 * s, 0.1 * s, 4, 10), bronze);
    foot.rotation.x = Math.PI / 2;
    foot.position.set(x * s, 0.04 * s, 0.2 * s);
    g.add(foot);
  }

  // neck and head
  g.add(limb(bronze, V(0, 1.86, 0), V(0, 2.0, 0.01), 0.055 * s));
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105 * s, 28, 22), bronze);
  head.scale.set(0.92, 1.12, 1);
  head.position.copy(V(0, 2.09, 0.02));
  g.add(head);
  // curly hair: a cap of bumps over the back and top of the head
  const hairGeo = displace(new THREE.SphereGeometry(0.112 * s, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), (a, y, v) => 1 + 0.06 * Math.sin(a * 14) * Math.sin(y / s * 140));
  const hair = new THREE.Mesh(hairGeo, bronze);
  hair.scale.set(0.95, 1.1, 1);
  hair.position.copy(V(0, 2.1, 0.005));
  hair.rotation.x = -0.25;
  g.add(hair);
  // beard, nose, ears
  const beardGeo = displace(new THREE.SphereGeometry(0.075 * s, 20, 14), (a, y) => 1 + 0.08 * Math.sin(a * 10 + y / s * 90));
  const beard = new THREE.Mesh(beardGeo, bronze);
  beard.scale.set(1, 1.15, 0.7);
  beard.position.copy(V(0, 2.0, 0.07));
  g.add(beard);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.016 * s, 0.05 * s, 8), bronze);
  nose.rotation.x = Math.PI / 2;
  nose.position.copy(V(0, 2.1, 0.12));
  g.add(nose);
  for (const x of [-0.1, 0.1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.022 * s, 10, 8), bronze);
    ear.scale.set(0.5, 1, 0.8);
    ear.position.copy(V(x, 2.09, 0.0));
    g.add(ear);
  }

  // right arm raised, holding up the two crossed keys
  const shoulderR = V(0.2, 1.74, 0.02), elbowR = V(0.34, 1.52, 0.1), handR = V(0.36, 1.86, 0.16);
  g.add(limb(bronze, shoulderR, elbowR, 0.055 * s), limb(bronze, elbowR, handR, 0.046 * s));
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.045 * s, 14, 10), bronze);
  fist.position.copy(handR);
  g.add(fist);
  const keys = new THREE.Group();
  const k1 = key(bronze, s); k1.rotation.z = 0.35;
  const k2 = key(bronze, s); k2.rotation.z = -0.35;
  k2.position.z = 0.02 * s;
  keys.add(k1, k2);
  keys.position.copy(handR).add(V(0, 0.02, 0.02));
  g.add(keys);

  // left arm bent, holding a scroll against the body
  const shoulderL = V(-0.2, 1.74, 0.02), elbowL = V(-0.27, 1.4, 0.05), handL = V(-0.12, 1.3, 0.2);
  g.add(limb(bronze, shoulderL, elbowL, 0.055 * s), limb(bronze, elbowL, handL, 0.046 * s));
  const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * s, 0.035 * s, 0.26 * s, 14), bronze);
  scroll.position.copy(handL).add(V(0, 0.02, 0.03));
  scroll.rotation.set(0.2, 0, 1.2);
  g.add(scroll);

  // a small square plinth under his feet
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.62 * s, 0.06 * s, 0.62 * s), bronze);
  plinth.position.y = -0.03 * s;
  g.add(plinth);
  return g;
}

/**
 * Build everything that isn't the frieze. `shaftH` is the height of the
 * carved shaft; the shaft's foot is at y = 0. Returns a Group to add to the
 * column, which turns with it. The inscription faces +x, which faces the
 * camera at the start and end of the climb.
 */
export async function buildOrnament({ radius, band, shaftH }) {
  const group = new THREE.Group();
  const D = radius * 2;

  const inscription = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'assets/misc/inscription.jpg';
  });

  const plain = new THREE.MeshStandardMaterial({ color: 0xcdc6b8, roughness: 0.88 });
  const faces = [0, 1, 2, 3].map((i) => pedestalFace(31 + i * 17, { front: i === 0, inscription }));
  const faceMat = (f) => material(f, { bump: 0.09 });

  // ── pedestal ──
  const pedW = D * 1.5, dieH = D * 1.25;
  const dieTop = -band * 1.2;                       // top of the die, under the cornice
  const die = new THREE.Mesh(new THREE.BoxGeometry(pedW, dieH, pedW), [
    faceMat(faces[0]), faceMat(faces[2]), plain, plain, faceMat(faces[1]), faceMat(faces[3]),
  ]);
  die.position.y = dieTop - dieH / 2;
  group.add(die);

  // base mouldings: two steps and a torus
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(pedW * 1.14, band * 0.6, pedW * 1.14), plain);
  step1.position.y = dieTop - dieH - band * 0.3;
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(pedW * 1.07, band * 0.35, pedW * 1.07), plain);
  step2.position.y = dieTop - dieH + band * 0.17;
  group.add(step1, step2);

  // cornice: stepped out over the die
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(pedW * 1.04, band * 0.3, pedW * 1.04), plain);
  c1.position.y = dieTop + band * 0.15;
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(pedW * 1.1, band * 0.45, pedW * 1.1), plain);
  c2.position.y = dieTop + band * 0.52;
  // the square plinth the wreath sits on
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(D * 1.32, band * 0.55, D * 1.32), plain);
  plinth.position.y = dieTop + band * 1.0;
  group.add(c1, c2, plinth);

  // eagles at the four top corners, garlands slung between them
  const laurel = laurelStrip();
  const garlandMat = material(laurel, { repeatX: 6, bump: 0.05 });
  const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  const half = pedW / 2 + 0.02;
  const eagleY = dieTop - band * 0.3;
  for (const [sx, sz] of corners) {
    const e = eagle(plain, band * 0.9);
    e.position.set(sx * (half + 0.12), eagleY, sz * (half + 0.12));
    e.rotation.y = Math.atan2(sx, sz);
    group.add(e);
  }
  for (let i = 0; i < 4; i += 1) {
    const [ax, az] = corners[i], [bx, bz] = corners[(i + 1) % 4];
    const a = new THREE.Vector3(ax * half, eagleY - band * 0.2, az * half);
    const b = new THREE.Vector3(bx * half, eagleY - band * 0.2, bz * half);
    // push the swag a little off the face so it hangs in front of the relief
    const out = a.clone().add(b).multiplyScalar(0.5).setY(0).normalize().multiplyScalar(0.12);
    a.add(out); b.add(out);
    group.add(garland(garlandMat, a, b, band * 0.55, band * 0.15));
  }

  // ── the laurel wreath at the foot of the shaft ──
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.04, band * 0.42, 32, 160), material(laurel, { repeatX: 10, bump: 0.08 }));
  wreath.rotation.x = Math.PI / 2;
  wreath.position.y = dieTop + band * 1.62;
  group.add(wreath);
  const fillet = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.06, band * 0.22, 96), plain);
  fillet.position.y = dieTop + band * 2.1;
  group.add(fillet);

  // ── the top ──
  const beads = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.01, band * 0.12, 16, 160), material(beadStrip(), { repeatX: 4, bump: 0.04 }));
  beads.rotation.x = Math.PI / 2;
  beads.position.y = shaftH - band * 0.05;
  const echinus = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.3, radius * 1.02, band * 1.0, 160, 1, true),
    material(eggDartStrip(), { bump: 0.1 }),
  );
  echinus.position.y = shaftH + band * 0.5;
  const abacus = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.8, band * 0.75, radius * 2.8), plain);
  abacus.position.y = shaftH + band * 1.38;
  const abacusLip = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.9, band * 0.14, radius * 2.9), plain);
  abacusLip.position.y = shaftH + band * 1.8;
  group.add(beads, echinus, abacus, abacusLip);

  // The railing of the viewing platform round the abacus (iron, modern).
  const iron = new THREE.MeshStandardMaterial({ color: 0x2a2826, roughness: 0.6, metalness: 0.4 });
  const railH = band * 1.1, edge = radius * 1.38, railY = shaftH + band * 1.87;
  const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, railH, 6), iron, 4 * 14);
  const m = new THREE.Matrix4();
  let n = 0;
  for (let side = 0; side < 4; side += 1) {
    for (let i = 0; i < 14; i += 1) {
      const t = -1 + (2 * i) / 13;
      const [x, z] = [[edge, t * edge], [t * edge, edge], [-edge, t * edge], [t * edge, -edge]][side];
      m.makeTranslation(x, railY + railH / 2, z);
      posts.setMatrixAt(n, m);
      n += 1;
    }
  }
  group.add(posts);
  for (const [w, d, x, z] of [[edge * 2, 0.05, 0, edge], [edge * 2, 0.05, 0, -edge], [0.05, edge * 2, edge, 0], [0.05, edge * 2, -edge, 0]]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), iron);
    rail.position.set(x, railY + railH, z);
    group.add(rail);
  }

  // The drum the statue stands on, with a moulded top.
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.72, radius * 0.8, band * 2.0, 96), plain);
  drum.position.y = shaftH + band * 2.9;
  const drumCap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.8, band * 0.5, 96), plain);
  drumCap.position.y = shaftH + band * 4.15;
  group.add(drum, drumCap);

  const bronze = new THREE.MeshStandardMaterial({ color: 0x8c7650, roughness: 0.42, metalness: 0.3, side: THREE.DoubleSide });
  const figure = statue(bronze, band * 1.7);
  figure.position.y = shaftH + band * 4.4;
  figure.rotation.y = Math.PI / 2;            // faces the same way as the inscription
  group.add(figure);

  return group;
}
