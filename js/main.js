/**
 * Boot: fill the page from content.js and start each section.
 * Each part starts on its own, so a missing file only blanks its own section.
 */

import * as content from './content.js';
import { el, clear, getJson, glideTo } from './dom.js';
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
const sceneCards = content.keyScenes.map((s, i) => el('article', { class: 'scene', 'aria-hidden': 'true' },
  el('div', { class: 'scene__img' }, el('img', { src: s.image, alt: s.title, loading: 'lazy' })),
  el('div', { class: 'scene__text' },
    el('p', { class: 'scene__num' }, `Scene ${toRoman(s.scene)}`),
    el('h2', { class: 'scene__title' }, s.title),
    el('p', { class: 'scene__latin', lang: 'la' }, s.latin),
    el('p', { class: 'scene__body' }, s.text),
    el('button', { type: 'button', class: 'button scene__next' },
      i < content.keyScenes.length - 1 ? 'Next scene' : 'On to the inscription',
      el('span', { class: 'button__arrow', 'aria-hidden': 'true' })))));
scenesBox.append(...sceneCards);
let goToScene = null;
sceneCards.forEach((card, i) => {
  card.querySelector('.scene__next').addEventListener('click', () => {
    if (i < sceneCards.length - 1 && goToScene) goToScene(i + 1);
    else glideTo(document.querySelector('#inscription').getBoundingClientRect().top + window.scrollY);
  });
});

const stage = document.querySelector('.ascent__stage');
const gauge = {
  fill: stage.querySelector('.gauge__fill'),
  feet: stage.querySelector('.gauge__feet'),
  turn: stage.querySelector('.gauge__turn'),
  scene: stage.querySelector('.gauge__scene'),
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
    last = g;
  }
}

import('./column.js')
  .then(({ mountColumn }) => mountColumn({
    stage,
    canvas: stage.querySelector('.ascent__canvas'),
    keyScenes: content.keyScenes,
    onScene,
    onReady: ({ goTo }) => {
      stage.querySelector('.ascent__loading').hidden = true;
      goToScene = goTo;
    },
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
const allMenu = document.getElementById('menu-all');
const fab = document.querySelector('.fabmenu');
const toggles = [...document.querySelectorAll('.mainnav__item[aria-controls], .menubutton, .fabmenu')];
function closeMenus(except = null) {
  for (const t of toggles) {
    if (t === except) continue;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  }
  if (!except) allMenu.classList.remove('is-floating');
  scrim.hidden = !except;
}
for (const t of toggles) {
  t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') !== 'true';
    closeMenus(open ? t : null);
    t.setAttribute('aria-expanded', String(open));
    allMenu.classList.toggle('is-floating', open && t === fab);
    document.getElementById(t.getAttribute('aria-controls')).hidden = !open;
  });
}
allMenu.querySelector('.megamenu__close').addEventListener('click', () => closeMenus());
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

// The header scrolls away; scrolling back up brings out a menu button.
const masthead = document.querySelector('.masthead');
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const up = y < lastY - 2, down = y > lastY + 2;
  if (y < masthead.offsetHeight || down) fab.classList.remove('is-shown');
  else if (up) fab.classList.add('is-shown');
  if (y < masthead.offsetHeight && fab.getAttribute('aria-expanded') === 'true') closeMenus();
  lastY = y;
}, { passive: true });

// ── the tour: scroll the whole site by itself ──
const tourButton = document.querySelector('.tour');
const tourStop = document.querySelector('.tourstop');
let touring = false, lastT = 0, carry = 0;
function tourStep(t) {
  if (!touring) return;
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
  lastT = t;
  carry += dt * 130;                         // pixels a second
  const whole = Math.floor(carry);
  if (whole) {
    carry -= whole;
    window.scrollBy({ top: whole, behavior: 'instant' });
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) stopTour();
  else requestAnimationFrame(tourStep);
}
function startTour() {
  touring = true; lastT = 0; carry = 0;
  tourStop.hidden = false;
  document.documentElement.style.scrollBehavior = 'auto';
  requestAnimationFrame(tourStep);
}
function stopTour() {
  touring = false;
  tourStop.hidden = true;
  document.documentElement.style.scrollBehavior = '';
}
tourButton.addEventListener('click', startTour);
tourStop.addEventListener('click', stopTour);
// Any move of the reader's own ends the tour.
for (const type of ['wheel', 'touchstart', 'keydown']) {
  window.addEventListener(type, () => { if (touring) stopTour(); }, { passive: true });
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
