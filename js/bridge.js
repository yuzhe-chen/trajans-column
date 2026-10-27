/**
 * Trajan's bridge: a slow crossfade of pictures, and the bridge drawn to scale
 * from Cassius Dio's figures.
 */

import { el, clear } from './dom.js';

const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};

export function mountBridge(section, bridge) {
  // ── the pictures ──
  const media = section.querySelector('.bridge__media');
  clear(media);
  const figures = [];
  const dots = el('div', { class: 'bridge__dots', role: 'group', 'aria-label': 'Pictures' });
  let at = 0, timer = null;

  function show(i) {
    at = (i + figures.length) % figures.length;
    figures.forEach((f, j) => f.classList.toggle('is-on', j === at));
    [...dots.children].forEach((d, j) => d.setAttribute('aria-pressed', String(j === at)));
  }
  function start() {
    clearInterval(timer);
    if (figures.length > 1) timer = setInterval(() => show(at + 1), 5500);
  }

  for (const image of bridge.images) {
    const img = el('img', { src: image.src, alt: image.caption, loading: 'lazy' });
    const fig = el('figure', {}, img, el('figcaption', {}, image.caption));
    const dot = el('button', { type: 'button', 'aria-label': image.caption, 'aria-pressed': 'false' });
    // A picture that isn't there yet simply drops out of the rotation.
    img.addEventListener('error', () => {
      const i = figures.indexOf(fig);
      if (i >= 0) { figures.splice(i, 1); fig.remove(); dot.remove(); show(0); start(); }
    });
    dot.addEventListener('click', () => { show(figures.indexOf(fig)); start(); });
    figures.push(fig);
    media.appendChild(fig);
    dots.appendChild(dot);
  }
  media.appendChild(dots);
  show(0);
  start();

  // ── the piers, to Dio's measurements ──
  const svg = section.querySelector('.piers__svg');
  const PIERS = 20, PIER_W = 60, PIER_H = 150, GAP = 170;   // Roman feet, Dio 68.13
  const length = PIERS * PIER_W + (PIERS + 1) * GAP;          // 4,770 ft
  const scale = 1200 / length;
  const top = 60, waterTop = top + 38, bottom = top + PIER_H * scale + 6;
  svg.setAttribute('viewBox', `0 0 1240 ${bottom + 46}`);
  clear(svg);
  const g = svgEl('g', { transform: 'translate(20,0)' });
  svg.appendChild(g);

  g.appendChild(svgEl('rect', { class: 'water', x: 0, y: waterTop, width: 1200, height: bottom - waterTop }));
  g.appendChild(svgEl('line', { class: 'deck', x1: 0, x2: 1200, y1: top, y2: top }));

  const readout = svgEl('text', { class: 'readout', x: 0, y: 26 });
  readout.textContent = `20 piers · ${length.toLocaleString('en')} Roman feet end to end by Dio’s figures (about 1.4 km). The remains show about 1.1 km.`;
  g.appendChild(readout);
  const defaultText = readout.textContent;

  for (let i = 0; i <= PIERS; i += 1) {
    const x0 = i * (PIER_W + GAP) * scale;
    const x1 = x0 + GAP * scale;
    // Timber arch over each span.
    g.appendChild(svgEl('path', { class: 'arch', d: `M${x0},${top + 22} Q${(x0 + x1) / 2},${top - 10} ${x1},${top + 22}` }));
    if (i === PIERS) break;
    const px = x1;
    const pier = svgEl('rect', {
      class: 'pier', x: px, y: top, width: PIER_W * scale, height: PIER_H * scale, tabindex: 0,
      'aria-label': `Pier ${i + 1} of 20`,
    });
    const say = () => { readout.textContent = `Pier ${i + 1} of 20 · 150 Roman feet high, 60 wide, 170 feet to the next (Dio)`; };
    pier.addEventListener('pointerenter', say);
    pier.addEventListener('focus', say);
    pier.addEventListener('pointerleave', () => { readout.textContent = defaultText; });
    pier.addEventListener('blur', () => { readout.textContent = defaultText; });
    g.appendChild(pier);
  }

  const left = svgEl('text', { x: 0, y: bottom + 24 });
  left.textContent = 'Drobeta (Dacia)';
  const right = svgEl('text', { x: 1200, y: bottom + 24, 'text-anchor': 'end' });
  right.textContent = 'Pontes (Moesia)';
  const river = svgEl('text', { x: 600, y: bottom + 24, 'text-anchor': 'middle' });
  river.textContent = 'Danuvius';
  g.append(left, river, right);
}
