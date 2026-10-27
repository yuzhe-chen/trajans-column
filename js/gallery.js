/**
 * The coins exhibit: one coin per screen, moving sideways as you scroll down.
 * Hovering a face magnifies it under the pointer. On a phone the slides simply
 * swipe.
 */

import { el, clear } from './dom.js';
import { expandedNodes } from './station.js';

function legendBlock(side, face) {
  if (!face?.legend) return '';
  return el('div', { class: 'legend' },
    el('p', { class: 'legend__side' }, side),
    el('p', { class: 'legend__carved', lang: 'la' }, face.legend),
    face.expanded ? el('p', { class: 'legend__expanded' }, ...expandedNodes(face.expanded)) : '',
    face.english ? el('p', { class: 'legend__english' }, face.english) : '',
    face.gloss?.length ? el('p', { class: 'legend__gloss' }, face.gloss.map(([t, m]) => `${t}: ${m}`).join(' · ')) : '');
}

function faceFigure(side, face) {
  const zoom = el('div', { class: 'zoom' });
  const fig = el('figure', { class: 'coin-face' },
    el('img', { src: face.image, alt: `${side}: ${face.legend || ''}`, loading: 'lazy', draggable: 'false' }),
    zoom,
    el('figcaption', {}, side));
  fig.addEventListener('pointermove', (event) => {
    const r = fig.getBoundingClientRect();
    const fx = (event.clientX - r.left) / r.width, fy = (event.clientY - r.top) / r.height;
    const z = 2.6;
    zoom.style.backgroundImage = `url("${face.image}")`;
    zoom.style.backgroundSize = `${r.width * 1.12 * z}px ${r.height * 1.12 * z}px`;
    zoom.style.backgroundPosition = `${fx * 100}% ${fy * 100}%`;
  });
  return fig;
}

export function mountGallery(section, { coins }) {
  const track = section.querySelector('.coins__track');
  const stage = section.querySelector('.coins__stage');
  const dots = section.querySelector('.coins__progress');
  clear(track);
  clear(dots);

  for (const coin of coins) {
    track.appendChild(el('article', { class: 'coin-slide', 'aria-label': coin.name },
      el('div', { class: 'coin-slide__faces' },
        faceFigure('Obverse', coin.obverse),
        faceFigure('Reverse', coin.reverse)),
      el('div', { class: 'coin-slide__text' },
        el('h3', { class: 'coin-slide__name' }, coin.name),
        el('p', { class: 'coin-slide__meta' }, [coin.metal, coin.date, coin.ref].filter(Boolean).join(' · ')),
        coin.about ? el('p', { class: 'coin-slide__about' }, coin.about) : '',
        legendBlock('Obverse', coin.obverse),
        legendBlock('Reverse', coin.reverse))));
    dots.appendChild(el('i'));
  }

  const narrow = () => window.matchMedia('(max-width: 860px)').matches;
  function setHeight() {
    section.style.height = narrow() ? '' : `${coins.length * 85 + 40}svh`;
  }
  setHeight();
  window.addEventListener('resize', () => { setHeight(); update(); });

  function update() {
    if (narrow()) return;
    const rect = section.getBoundingClientRect();
    const total = rect.height - stage.offsetHeight;
    const stick = parseFloat(getComputedStyle(stage).top) || 0;
    const p = Math.min(1, Math.max(0, (stick - rect.top) / Math.max(1, total)));
    // Ease between slides so each one settles before the next moves in.
    const raw = p * (coins.length - 1);
    const i = Math.floor(raw), f = raw - i;
    const pos = Math.min(coins.length - 1, i + smooth((f - 0.2) / 0.6));
    track.style.transform = `translateX(${-pos * window.innerWidth}px)`;
    const on = Math.round(pos);
    [...dots.children].forEach((d, j) => d.classList.toggle('is-on', j === on));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function smooth(t) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}
