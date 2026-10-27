/**
 * The magnifying glass on the evidence table.
 *
 * It follows the pointer over the inscription and the coins, showing the
 * surface magnified. Each line of the inscription and each face of a coin is a
 * hotspot: when the glass is over one, the glass shows what is carved there and
 * the case notes beside it fill out the abbreviations and translate.
 *
 * Mouse: the glass replaces the cursor. Touch: press on an object and drag.
 * Keyboard: every hotspot is a stop in the tab order.
 */

import { el, clear } from './dom.js';

/** "Imp(eratori) Caesari" -> nodes, the restored letters picked out. */
function expandedNodes(text) {
  const out = [];
  for (const part of String(text).split(/(\([^)]*\))/)) {
    if (!part) continue;
    if (part.startsWith('(')) out.push(el('span', { class: 'fill' }, part.slice(1, -1)));
    else out.push(document.createTextNode(part));
  }
  return out;
}

function notesFor(item) {
  return [
    item.heading ? el('p', { class: 'casenotes__label', style: { border: 0, padding: 0, marginBottom: '6px' } }, item.heading) : null,
    el('p', { class: 'casenotes__carved', lang: 'la' }, item.carved || '—'),
    item.expanded ? el('p', { class: 'casenotes__expanded' }, ...expandedNodes(item.expanded)) : null,
    item.english ? el('p', { class: 'casenotes__english' }, item.english) : null,
    item.gloss?.length
      ? el('dl', {}, ...item.gloss.flatMap(([term, meaning]) => [el('dt', { lang: 'la' }, term), el('dd', {}, meaning)]))
      : null,
  ].filter(Boolean);
}

export function mountLens({ table, inscription, boxes, coins }) {
  const lens = table.querySelector('.lens');
  const lensImage = lens.querySelector('.lens__image');
  const reading = lens.querySelector('.lens__reading');
  const notes = table.querySelector('.casenotes__body');
  const empty = notes.innerHTML;

  // ── hotspots over the inscription lines ──
  const figure = table.querySelector('.artifact--inscription');
  inscription.lines.forEach((line, i) => {
    const box = boxes?.[i];
    if (!box) return;
    const spot = el('button', {
      type: 'button',
      class: 'hotspot',
      'aria-label': `Line ${i + 1}: ${line.english}`,
      style: {
        left: `${box.x0 * 100}%`, top: `${box.y0 * 100}%`,
        width: `${(box.x1 - box.x0) * 100}%`, height: `${(box.y1 - box.y0) * 100}%`,
        background: 'none', border: 0, padding: 0, cursor: 'inherit',
      },
    });
    spot.hotspot = { heading: `Line ${i + 1} of ${inscription.lines.length}`, ...line };
    figure.querySelector('.artifact__frame').appendChild(spot);
  });

  // ── coins ──
  const coinBox = table.querySelector('.coins');
  for (const coin of coins) {
    const faces = ['obverse', 'reverse'].map((side) => {
      const face = coin[side];
      if (!face?.image) return null;
      const spot = el('button', {
        type: 'button',
        class: 'coin__face hotspot',
        style: { position: 'relative', border: 0, padding: 0, cursor: 'inherit' },
        'aria-label': `${coin.name}, ${side}${face.english ? `: ${face.english}` : ''}`,
      }, el('img', { src: face.image, alt: '', loading: 'lazy', draggable: 'false' }));
      spot.hotspot = {
        heading: `${coin.name} · ${side}${coin.ref ? ` · ${coin.ref}` : ''}`,
        carved: face.legend,
        expanded: face.expanded,
        english: face.english,
        gloss: face.gloss,
      };
      return spot;
    }).filter(Boolean);
    if (!faces.length) continue;
    coinBox.appendChild(el('figure', { class: 'coin' },
      el('div', { class: 'coin__faces' }, ...faces),
      el('figcaption', {}, [coin.name, coin.date].filter(Boolean).join(' · '))));
  }

  // ── following the pointer ──
  let current = null;
  function show(spot) {
    if (spot === current) return;
    current?.classList.remove('is-hit');
    current = spot;
    if (!spot) {
      reading.classList.remove('is-on');
      return;
    }
    spot.classList.add('is-hit');
    reading.textContent = spot.hotspot.carved || '';
    reading.classList.toggle('is-on', Boolean(spot.hotspot.carved));
    clear(notes);
    notes.append(...notesFor(spot.hotspot));
  }

  function imageUnder(x, y) {
    for (const img of table.querySelectorAll('.artifact img, .coin__face img')) {
      const r = img.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return { img, r };
    }
    return null;
  }

  function spotUnder(x, y) {
    for (const spot of table.querySelectorAll('.hotspot')) {
      const r = spot.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return spot;
    }
    return null;
  }

  function place(clientX, clientY, lift = 0) {
    const t = table.getBoundingClientRect();
    const size = lens.offsetWidth;
    // On touch the glass floats above the finger so the finger doesn't hide it.
    const cx = clientX, cy = clientY - lift;
    lens.style.transform = `translate(${cx - t.left - size / 2}px, ${cy - t.top - size / 2}px)`;

    const hit = imageUnder(cx, cy);
    if (hit) {
      const zoom = parseFloat(getComputedStyle(lens).getPropertyValue('--zoom')) || 2.4;
      const w = hit.r.width * zoom, h = hit.r.height * zoom;
      const px = (cx - hit.r.left) * zoom, py = (cy - hit.r.top) * zoom;
      lensImage.style.backgroundImage = `url("${hit.img.currentSrc || hit.img.src}")`;
      lensImage.style.backgroundSize = `${w}px ${h}px`;
      lensImage.style.backgroundPosition = `${size / 2 - px - 7}px ${size / 2 - py - 7}px`;
      lensImage.style.opacity = 1;
    } else {
      lensImage.style.opacity = 0;
    }
    show(spotUnder(cx, cy));
  }

  const notesBox = table.querySelector('.casenotes');
  table.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const overNotes = notesBox.contains(event.target);
    lens.classList.toggle('is-on', !overNotes);
    if (!overNotes) place(event.clientX, event.clientY);
  });
  table.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') lens.classList.remove('is-on');
  });

  // Touch: press on an object and drag.
  let dragging = false;
  table.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    if (!event.target.closest('.artifact, .coin')) return;
    dragging = true;
    table.setPointerCapture(event.pointerId);
    lens.classList.add('is-on');
    place(event.clientX, event.clientY, lens.offsetWidth * 0.75);
  });
  table.addEventListener('pointermove', (event) => {
    if (dragging && event.pointerType !== 'mouse') place(event.clientX, event.clientY, lens.offsetWidth * 0.75);
  });
  const stop = () => { dragging = false; };
  table.addEventListener('pointerup', stop);
  table.addEventListener('pointercancel', stop);
  // Only the objects themselves refuse to scroll, so the page still scrolls past.
  for (const item of table.querySelectorAll('.artifact img, .coin__face')) item.style.touchAction = 'none';

  // Keyboard: focus a hotspot and the glass goes to it.
  table.addEventListener('focusin', (event) => {
    const spot = event.target.closest('.hotspot');
    if (!spot || !spot.matches(':focus-visible')) return;
    const r = spot.getBoundingClientRect();
    lens.classList.add('is-on');
    place(r.left + r.width / 2, r.top + r.height / 2);
  });
  table.addEventListener('focusout', (event) => {
    if (!table.contains(event.relatedTarget)) {
      lens.classList.remove('is-on');
      show(null);
      notes.innerHTML = empty;
    }
  });
}
