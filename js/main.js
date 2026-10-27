/**
 * Boot: fill the page from content.js and start each section.
 * Each part starts on its own, so a missing file only blanks its own section.
 */

import * as content from './content.js';
import { el, clear, getJson } from './dom.js';
import { toRoman } from './roman.js';
import { mountDrill, mountNameBuilder, mountReadings, mountGlosses, mountDio } from './latin.js';

const read = (key) => key.split('.').reduce((o, k) => o?.[k], content);

// ── words from content.js ──
for (const node of document.querySelectorAll('[data-content]')) {
  const value = read(node.dataset.content);
  if (typeof value === 'string') node.textContent = value;
}
// A list of paragraphs.
for (const node of document.querySelectorAll('[data-list]')) {
  const value = read(node.dataset.list);
  if (Array.isArray(value)) node.replaceChildren(...value.map((text) => el('p', {}, text)));
}
// [label, value] pairs as a definition list, one row each.
for (const node of document.querySelectorAll('[data-facts]')) {
  const value = read(node.dataset.facts);
  if (Array.isArray(value)) node.replaceChildren(...value.map(([dt, dd]) => el('div', {}, el('dt', {}, dt), el('dd', {}, dd))));
}

// ── the climb ──
const scenesBox = document.querySelector('.scenes');
const sceneCards = content.keyScenes.map((s) => el('article', { class: 'scene', 'aria-hidden': 'true' },
  el('div', { class: 'scene__img' }, el('img', { src: s.image, alt: s.title, loading: 'lazy' })),
  el('div', { class: 'scene__text' },
    el('p', { class: 'scene__num' }, `Scene ${toRoman(s.scene)}`),
    el('h2', { class: 'scene__title' }, s.title),
    el('p', { class: 'scene__latin', lang: 'la' }, s.latin),
    el('p', { class: 'scene__body' }, s.text))));
scenesBox.append(...sceneCards);

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

// ── the inscription station ──
(async () => {
  const boxes = await getJson('assets/misc/inscription.json', []);
  const { mountStation } = await import('./station.js');
  mountStation(document.querySelector('.station'), {
    inscription: content.inscription,
    boxes: Array.isArray(boxes) ? boxes : boxes.lines || [],
  });
})();

// ── the coins ──
(async () => {
  const files = await getJson('assets/coins/coins.json', []);
  const byId = new Map((Array.isArray(files) ? files : []).map((c) => [c.id, c]));
  const coins = content.coins.map((coin) => {
    const src = byId.get(coin.id) || {};
    const face = (side) => ({
      image: typeof src[side] === 'string' ? `assets/${src[side]}` : `assets/coins/${coin.id}-${side === 'obverse' ? 'obv' : 'rev'}.jpg`,
      ...(coin[side] || {}),
    });
    return { ...coin, obverse: face('obverse'), reverse: face('reverse') };
  });
  const { mountGallery } = await import('./gallery.js');
  mountGallery(document.querySelector('.coins'), { coins });
})();

// ── the emperor ──
mountNameBuilder(document.querySelector('.namebuilder'), content);

// ── the bridge ──
import('./bridge.js').then(({ mountBridge }) => mountBridge(document.querySelector('.bridge'), content.bridge));

// ── the map, once it is near ──
const empire = document.querySelector('.map');
new IntersectionObserver(([entry], observer) => {
  if (!entry.isIntersecting) return;
  observer.disconnect();
  import('./map.js').then(({ mountMap }) => mountMap(empire)).catch((error) => console.error(error));
}, { rootMargin: '800px' }).observe(empire);

// ── sources ──
mountReadings(document.querySelector('.reading'), content.readings);
mountDio(document.querySelector('.dio'), content.dio);
mountDrill(document.querySelector('.drill'), content.abbreviations);
mountGlosses(document.querySelector('.gloss'));

// ── the menu ──
const scrim = document.querySelector('.menuscrim');
const toggles = [...document.querySelectorAll('.mainnav__item[aria-controls], .menubutton')];
function closeMenus(except = null) {
  for (const t of toggles) {
    if (t === except) continue;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  }
  scrim.hidden = !except;
}
for (const t of toggles) {
  t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') !== 'true';
    closeMenus(open ? t : null);
    t.setAttribute('aria-expanded', String(open));
    document.getElementById(t.getAttribute('aria-controls')).hidden = !open;
  });
}
scrim.addEventListener('click', () => closeMenus());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });
for (const link of document.querySelectorAll('.megamenu a')) {
  link.addEventListener('click', () => {
    closeMenus();
    if (link.dataset.openView) {
      // The map loads when it comes near; press its button once it has.
      const press = () => {
        if (document.querySelector('.map__svg .world')) document.querySelector(`[data-view="${link.dataset.openView}"]`).click();
        else setTimeout(press, 200);
      };
      press();
    }
  });
}

// ── credits ──
(async () => {
  const credits = await getJson('assets/credits.json', []);
  const box = document.querySelector('.credits');
  clear(box);
  for (const c of Array.isArray(credits) ? credits : credits.files || []) {
    box.appendChild(el('p', {},
      c.sourceUrl ? el('a', { href: c.sourceUrl, rel: 'noopener' }, c.title || c.file) : c.title || c.file,
      ` — ${c.author || 'unknown'}${c.license ? ', ' : ''}`,
      c.licenseUrl ? el('a', { href: c.licenseUrl, rel: 'noopener license' }, c.license) : c.license || ''));
  }
  box.appendChild(el('p', {}, 'Map data: Natural Earth (public domain); Tiber © OpenStreetMap contributors (ODbL); frontiers drawn for this site. ',
    el('a', { href: 'data/SOURCES.md' }, 'Full list')));
  box.appendChild(el('p', {}, 'Texts: Cassius Dio tr. E. Cary (Loeb, 1925), via LacusCurtius; Latin texts from The Latin Library; translations of the Latin by the author. Background: R. B. Ulrich, ',
    el('a', { href: 'https://www.trajans-column.org/', rel: 'noopener' }, 'trajans-column.org'), '; C. Cichorius, Die Reliefs der Traianssäule (1896–1900).'));
})();
