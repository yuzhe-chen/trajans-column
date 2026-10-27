/**
 * Boot: fill the page from content.js and start each section.
 * Each part loads on its own, so a missing data file only blanks its section.
 */

import * as content from './content.js';
import { el, clear, getJson } from './dom.js';
import { toRoman } from './roman.js';
import { mountDrill, mountNumerals, mountNameBuilder, mountReadings, mountGlosses } from './latin.js';

// ── words from content.js into [data-content] ──
for (const node of document.querySelectorAll('[data-content]')) {
  const value = node.dataset.content.split('.').reduce((o, k) => o?.[k], content);
  if (typeof value === 'string') node.textContent = value;
}

// ── the key scene cards ──
const scenesBox = document.querySelector('.scenes');
const sceneCards = content.keyScenes.map((s) => el('article', { class: 'scene', 'aria-hidden': 'true' },
  el('div', { class: 'scene__img' }, el('img', { src: s.image, alt: s.title, loading: 'lazy' })),
  el('div', { class: 'scene__text' },
    el('p', { class: 'scene__num' }, `Scene ${toRoman(s.scene)}`),
    el('h2', { class: 'scene__title' }, s.title),
    el('p', { class: 'scene__latin', lang: 'la' }, s.latin),
    el('p', { class: 'scene__body' }, s.text))));
scenesBox.append(...sceneCards);

// ── the climb ──
const stage = document.querySelector('.ascent__stage');
const gauge = {
  fill: stage.querySelector('.gauge__fill'),
  feet: stage.querySelector('.gauge__feet'),
  turn: stage.querySelector('.gauge__turn'),
  scene: stage.querySelector('.gauge__scene'),
  hint: stage.querySelector('.ascent__hint'),
};
let last = {};
function onScene(update) {
  if ('index' in update) {
    sceneCards.forEach((card, i) => {
      const on = i === update.index;
      card.classList.toggle('is-on', on);
      card.setAttribute('aria-hidden', String(!on));
    });
  }
  const g = update.gauge;
  if (g) {
    gauge.fill.style.height = `${g.feet}%`;
    if (g.feet !== last.feet) gauge.feet.textContent = toRoman(g.feet) || '0';
    if (g.turn !== last.turn) gauge.turn.textContent = toRoman(g.turn);
    if (g.scene !== last.scene) gauge.scene.textContent = toRoman(g.scene);
    gauge.hint.style.opacity = g.progress < 0.03 ? 1 : 0;
    last = g;
  }
}

import('./column.js')
  .then(({ mountColumn }) => mountColumn({
    stage,
    canvas: stage.querySelector('.ascent__canvas'),
    keyScenes: content.keyScenes,
    onScene,
    onReady: () => { stage.querySelector('.ascent__loading').hidden = true; },
  }))
  .catch((error) => {
    console.error(error);
    stage.querySelector('.ascent__loading').textContent = 'The column needs WebGL, which this browser has turned off.';
  });

// ── the evidence table ──
(async () => {
  const [boxes, coinData] = await Promise.all([
    getJson('assets/misc/inscription.json', []),
    getJson('assets/coins/coins.json', []),
  ]);
  const coins = mergeCoins(coinData, content.coins);
  const { mountLens } = await import('./lens.js');
  mountLens({
    table: document.querySelector('.evidence__table'),
    inscription: content.inscription,
    boxes: Array.isArray(boxes) ? boxes : boxes.lines,
    coins,
  });
})();

/**
 * The coins in content.js, with their pictures found through
 * assets/coins/coins.json (matched by id).
 */
function mergeCoins(fromFiles, fromContent) {
  const files = new Map((Array.isArray(fromFiles) ? fromFiles : []).map((c) => [c.id, c]));
  return (fromContent || []).map((coin) => {
    const src = files.get(coin.id) || {};
    const face = (side) => ({
      image: typeof src[side] === 'string' ? `assets/${src[side]}` : `assets/coins/${coin.id}-${side === 'obverse' ? 'obv' : 'rev'}.jpg`,
      legend: src[`${side}Legend`] || '',
      ...(coin[side] || {}),
    });
    return {
      ...coin,
      date: coin.date || src.date,
      ref: coin.ref || src.ric,
      obverse: face('obverse'),
      reverse: face('reverse'),
    };
  });
}

// ── the emperor ──
mountNameBuilder(document.querySelector('.namebuilder'), content);

// ── the map, once it is near ──
const empire = document.querySelector('.map');
new IntersectionObserver(([entry], observer) => {
  if (!entry.isIntersecting) return;
  observer.disconnect();
  import('./map.js').then(({ mountMap }) => mountMap(empire)).catch((error) => console.error(error));
}, { rootMargin: '600px' }).observe(empire);

// ── Latin ──
mountDrill(document.querySelector('.drill'), content.abbreviations);
mountNumerals(document.querySelector('.numerals'));
mountReadings(document.querySelector('.reading'), content.readings);
mountGlosses(document.querySelector('.gloss'));

// ── English / Latin headings ──
const langSwitch = document.querySelector('.langswitch');
const swappable = [...document.querySelectorAll('[data-la]')];
for (const node of swappable) node.dataset.en = node.textContent;
langSwitch.addEventListener('click', () => {
  const latin = langSwitch.getAttribute('aria-pressed') !== 'true';
  langSwitch.setAttribute('aria-pressed', String(latin));
  for (const node of swappable) {
    node.textContent = latin ? node.dataset.la : node.dataset.en;
    node.lang = latin ? 'la' : '';
  }
  try { localStorage.setItem('lang', latin ? 'la' : 'en'); } catch { /* private mode */ }
});
try { if (localStorage.getItem('lang') === 'la') langSwitch.click(); } catch { /* private mode */ }

// ── which section the bar is on ──
const navLinks = [...document.querySelectorAll('.topnav a')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const a of navLinks) a.toggleAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}`);
  }
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navObserver.observe(s));

// ── credits ──
(async () => {
  const credits = await getJson('assets/credits.json', []);
  const box = document.querySelector('.credits');
  const sources = await fetch('data/SOURCES.md').then((r) => (r.ok ? r.text() : '')).catch(() => '');
  clear(box);
  for (const c of Array.isArray(credits) ? credits : credits.files || []) {
    box.appendChild(el('p', {},
      el('a', { href: c.sourceUrl, rel: 'noopener' }, c.title || c.file),
      ` — ${c.author || 'unknown'}, `,
      c.licenseUrl ? el('a', { href: c.licenseUrl, rel: 'noopener license' }, c.license) : c.license || ''));
  }
  if (sources) {
    box.appendChild(el('p', {}, 'Map data: ', el('a', { href: 'data/SOURCES.md' }, 'sources and licences')));
  }
})();
