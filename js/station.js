/**
 * The inscription station.
 *
 * The stone fills the screen and the section pins in place while you scroll.
 * Scrolling reads it line by line: the spotlight moves to the line and the
 * magnifying glass sweeps along it, while all six lines sit together below,
 * the current one lit. Move the mouse over the stone and the glass follows you
 * instead; on a phone, drag it.
 */

import { el, clear } from './dom.js';

/** "Imp(eratori) Caesari" -> nodes, the restored letters picked out. */
export function expandedNodes(text) {
  const out = [];
  for (const part of String(text).split(/(\([^)]*\))/)) {
    if (!part) continue;
    if (part.startsWith('(')) out.push(el('span', { class: 'fill' }, part.slice(1, -1)));
    else out.push(document.createTextNode(part));
  }
  return out;
}

export function mountStation(section, { inscription, boxes }) {
  const stage = section.querySelector('.station__stage');
  const art = section.querySelector('.station__art');
  const img = section.querySelector('.station__img');
  const hl = section.querySelector('.station__hl');
  const lens = section.querySelector('.lens');
  const lensImage = lens.querySelector('.lens__image');
  const list = section.querySelector('.station__lines');
  const notes = section.querySelector('.station__notes');
  const lines = inscription.lines;

  // Scroll budget: a screen to arrive, then about half a screen per line.
  const narrow = () => window.matchMedia('(max-width: 640px)').matches;
  function setHeight() {
    section.style.height = narrow() ? '' : `calc(${100 + lines.length * 55}svh)`;
  }
  setHeight();
  window.addEventListener('resize', setHeight);

  img.decode?.().catch(() => {}).finally?.(() => {
    if (img.naturalWidth) art.style.setProperty('--ratio', String(img.naturalWidth / img.naturalHeight));
  });

  // ── the six lines, all at once ──
  clear(list);
  const items = lines.map((line, i) => {
    const li = el('li', { tabindex: 0 },
      el('p', { class: 'carved', lang: 'la' }, el('b', {}, String(i + 1)), line.carved),
      el('p', { class: 'expanded' }, ...expandedNodes(line.expanded)),
      el('p', { class: 'english' }, line.english),
      line.gloss?.length ? el('p', { class: 'gloss-line' }, line.gloss.map(([t, m]) => `${t}: ${m}`).join(' · ')) : '');
    li.addEventListener('click', () => scrollToLine(i));
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter') scrollToLine(i); });
    list.appendChild(li);
    return li;
  });

  let active = -1;
  function setActive(i) {
    if (i === active || !boxes[i]) return;
    active = i;
    items.forEach((li, j) => li.classList.toggle('is-on', j === i));
    const gloss = lines[i].gloss || [];
    notes.replaceChildren(...gloss.flatMap(([t, m], k) => [k ? ' · ' : '', el('b', {}, t), `: ${m}`]));
    const b = boxes[i];
    Object.assign(hl.style, {
      left: `${b.x0 * 100}%`, top: `${b.y0 * 100}%`,
      width: `${(b.x1 - b.x0) * 100}%`, height: `${(b.y1 - b.y0) * 100}%`,
    });
  }

  // ── the glass ──
  function placeLens(x, y) {
    const r = art.getBoundingClientRect();
    const size = lens.offsetWidth;
    const zoom = parseFloat(getComputedStyle(lens).getPropertyValue('--zoom')) || 2.6;
    lens.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
    lensImage.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    lensImage.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
    lensImage.style.backgroundPosition = `${size / 2 - x * zoom - 6}px ${size / 2 - y * zoom - 6}px`;
  }
  const lineAt = (fx, fy) => boxes.findIndex((b) => fx >= b.x0 - 0.01 && fx <= b.x1 + 0.01 && fy >= b.y0 - 0.02 && fy <= b.y1 + 0.02);

  // The glass eases toward where it should be, one frame at a time, so it
  // glides smoothly however the scroll events arrive.
  const target = { x: 0, y: 0 }, at = { x: 0, y: 0 };
  let easing = false, primed = false;
  function aim(x, y, immediate = false) {
    target.x = x; target.y = y;
    if (immediate || !primed) { at.x = x; at.y = y; primed = true; placeLens(x, y); return; }
    if (!easing) { easing = true; requestAnimationFrame(step); }
  }
  function step() {
    at.x += (target.x - at.x) * 0.2;
    at.y += (target.y - at.y) * 0.2;
    placeLens(at.x, at.y);
    if (Math.abs(target.x - at.x) + Math.abs(target.y - at.y) > 0.3) requestAnimationFrame(step);
    else { at.x = target.x; at.y = target.y; placeLens(at.x, at.y); easing = false; }
  }

  // ── scroll drives the reading ──
  let pointer = false;
  function progress() {
    const rect = section.getBoundingClientRect();
    const total = rect.height - stage.offsetHeight;
    const stick = parseFloat(getComputedStyle(stage).top) || 0;
    return Math.min(1, Math.max(0, (stick - rect.top) / Math.max(1, total)));
  }
  function onScroll() {
    if (pointer || narrow()) return;
    const p = progress() * lines.length;
    const i = Math.min(lines.length - 1, Math.floor(p));
    setActive(i);
    // The glass sweeps along the line as you scroll through it.
    const t = Math.min(1, Math.max(0, p - i));
    const b = boxes[i];
    if (!b) return;
    const r = art.getBoundingClientRect();
    const fx = b.x0 + 0.06 + (b.x1 - b.x0 - 0.12) * t;
    const fy = (b.y0 + b.y1) / 2;
    aim(fx * r.width, fy * r.height);
  }
  // Scrolling always takes the glass back from the mouse: with the stone
  // filling the screen the pointer is nearly always over it.
  window.addEventListener('scroll', () => { pointer = false; onScroll(); }, { passive: true });

  function scrollToLine(i) {
    if (narrow()) { setActive(i); return; }
    const rect = section.getBoundingClientRect();
    const total = rect.height - stage.offsetHeight;
    const stick = parseFloat(getComputedStyle(stage).top) || 0;
    const y = window.scrollY + rect.top - stick + ((i + 0.35) / lines.length) * total;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // ── the mouse takes the glass ──
  art.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointer = true;
    const r = art.getBoundingClientRect();
    const x = event.clientX - r.left, y = event.clientY - r.top;
    aim(x, y, true);
    const i = lineAt(x / r.width, y / r.height);
    if (i >= 0) setActive(i);
  });
  art.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointer = false;
    onScroll();
  });

  // Touch: drag the glass across the stone.
  let dragging = false;
  art.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    dragging = true;
    art.setPointerCapture(event.pointerId);
    move(event);
  });
  art.addEventListener('pointermove', (event) => { if (dragging) move(event); });
  art.addEventListener('pointerup', () => { dragging = false; });
  function move(event) {
    const r = art.getBoundingClientRect();
    const x = event.clientX - r.left, y = event.clientY - r.top - lens.offsetWidth * 0.7;
    aim(x, y, true);
    const i = lineAt(x / r.width, y / r.height);
    if (i >= 0) setActive(i);
  }

  setActive(0);
  requestAnimationFrame(onScroll);
  window.addEventListener('resize', onScroll);
}
