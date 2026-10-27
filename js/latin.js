/**
 * The Latin tools: the abbreviation drill, the numeral reader, the reading room,
 * the name builder, and the word glosses that work anywhere on the page.
 */

import { el, clear } from './dom.js';
import { toRoman } from './roman.js';

// ---------------------------------------------------------------------------
// abbreviations
// ---------------------------------------------------------------------------

export function mountDrill(card, abbreviations) {
  const abbr = card.querySelector('.drill__abbr');
  const choices = card.querySelector('.drill__choices');
  const result = card.querySelector('.drill__result');
  const score = card.querySelector('.drill__score');
  let right = 0, asked = 0, order = shuffle(abbreviations.map((_, i) => i)), at = 0;

  function next() {
    if (at >= order.length) { order = shuffle(order); at = 0; }
    const [short, full, english] = abbreviations[order[at]];
    at += 1;
    abbr.textContent = short;
    result.textContent = '';
    const wrong = shuffle(abbreviations.filter(([s]) => s !== short)).slice(0, 3);
    const options = shuffle([[short, full, english], ...wrong]);
    clear(choices);
    for (const [s, f] of options) {
      const button = el('button', { type: 'button' }, f);
      button.addEventListener('click', () => {
        asked += 1;
        const ok = s === short;
        if (ok) right += 1;
        for (const b of choices.children) {
          b.disabled = true;
          if (b.textContent === full) b.classList.add('is-right');
        }
        if (!ok) button.classList.add('is-wrong');
        result.replaceChildren(
          el('strong', {}, ok ? 'Recte! ' : 'Minime. '),
          `${short} = ${full}: “${english}”. `,
          el('button', { type: 'button', class: 'button', style: { padding: '8px 12px', marginLeft: '6px' }, onclick: next }, 'Next'),
        );
        score.textContent = `${right} of ${asked} right`;
      });
      choices.appendChild(button);
    }
  }
  next();
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------------------
// the name builder
// ---------------------------------------------------------------------------

/**
 * Trajan's titulature in a given year. Tribunician power was renewed each
 * 10 December, so for most of year Y he held it for the (Y − 96)th time — which
 * is why the column's inscription, TRIB POT XVII, dates to 113.
 */
export function mountNameBuilder(box, { titles, consulships }) {
  const range = box.querySelector('input');
  const yearOut = box.querySelector('.namebuilder__ad');
  const latin = box.querySelector('.namebuilder__latin');
  const expanded = box.querySelector('.namebuilder__expanded');
  const english = box.querySelector('.namebuilder__english');
  let previous = null;

  function render() {
    const year = Number(range.value);
    yearOut.textContent = year;
    const held = titles.filter((t) => t.from <= year);
    const cos = consulships.filter(([y]) => y <= year).pop()?.[1] ?? 1;
    const trp = year - 96;
    const newOnes = new Set(previous == null ? [] : held.filter((t) => t.from > previous).map((t) => t.abbr));

    // IMP CAES NERVA TRAIANVS [OPTIMVS] AVG GERM DAC [PARTH] P M TR P … COS … P P
    const mark = (t, text) => el('span', { class: newOnes.has(t.abbr) ? 'new' : '' }, text);
    const optimus = held.find((t) => t.abbr === 'OPTIMVS');
    latin.replaceChildren(
      'IMP · CAES · NERVA · TRAIANVS · ',
      optimus ? mark(optimus, 'OPTIMVS · ') : '',
      'AVG · ',
      ...held.filter((t) => t !== optimus).map((t) => mark(t, `${t.abbr} · `)),
      `P · M · TR · P · ${toRoman(trp)} · COS · ${toRoman(cos)} · P · P`,
    );
    const names = held.filter((t) => t.abbr !== 'OPTIMVS').map((t) => t.full).join(' ');
    expanded.textContent = `Imperator Caesar Nerva Traianus ${held.some((t) => t.abbr === 'OPTIMVS') ? 'Optimus ' : ''}Augustus ${names ? `${names} ` : ''}pontifex maximus, tribunicia potestate ${toRoman(trp)}, consul ${toRoman(cos)}, pater patriae`;
    english.textContent = `Emperor Caesar Nerva Trajan${held.some((t) => t.abbr === 'OPTIMVS') ? ' the Best' : ''}, Augustus${held.filter((t) => t.abbr !== 'OPTIMVS').map((t) => `, ${t.english}`).join('')}, chief priest, holding tribunician power for the ${ordinal(trp)} time, consul ${cos === 1 ? 'once' : `${cos} times`}, father of his country.`;
    previous = year;
  }
  range.addEventListener('input', render);
  render();
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---------------------------------------------------------------------------
// the reading room
// ---------------------------------------------------------------------------

export function mountReadings(box, readings) {
  for (const text of readings) {
    const article = el('article', { class: 'reading__text', 'data-mode': 'both', id: text.id });
    const toggle = el('div', { class: 'reading__toggle', role: 'group', 'aria-label': 'Show' },
      el('button', { type: 'button', 'aria-pressed': 'true', 'data-mode': 'both' }, 'Latin + English'),
      el('button', { type: 'button', 'aria-pressed': 'false', 'data-mode': 'la' }, 'Latin only'));
    toggle.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      article.dataset.mode = button.dataset.mode;
      for (const b of toggle.children) b.setAttribute('aria-pressed', String(b === button));
    });
    const body = el('div', { class: 'reading__body' });
    text.latin.forEach((para, i) => {
      body.append(
        el('p', { class: 'la' }, ...glossed(para, text.vocab)),
        el('p', { class: 'en' }, text.english[i] ?? ''),
      );
    });
    article.append(
      el('div', { class: 'reading__head' }, el('h3', {}, text.title), el('span', { class: 'src' }, text.source), toggle),
      body,
    );
    box.appendChild(article);
  }
}

/** Split a Latin paragraph so the words in `vocab` carry a gloss. */
function glossed(text, vocab = {}) {
  const keys = new Map(Object.entries(vocab).map(([k, v]) => [k.toLowerCase(), v]));
  return text.split(/(\p{L}+)/u).map((part) => {
    const gloss = keys.get(part.toLowerCase());
    return gloss ? el('span', { class: 'w', 'data-gloss': gloss, tabindex: 0 }, part) : part;
  });
}

/** One tooltip for every [data-gloss] on the page. */
export function mountGlosses(tip) {
  function showFor(target, x, y) {
    tip.textContent = target.dataset.gloss;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(window.innerWidth - r.width - 12, x + 14)}px`;
    tip.style.top = `${Math.max(12, y - r.height - 14)}px`;
  }
  document.addEventListener('pointerover', (event) => {
    const target = event.target.closest?.('[data-gloss]');
    if (target) showFor(target, event.clientX, event.clientY);
  });
  document.addEventListener('pointermove', (event) => {
    const target = event.target.closest?.('[data-gloss]');
    if (target) showFor(target, event.clientX, event.clientY);
    else tip.hidden = true;
  });
  document.addEventListener('focusin', (event) => {
    const target = event.target.closest?.('[data-gloss]');
    if (!target) return;
    const r = target.getBoundingClientRect();
    showFor(target, r.left, r.top);
  });
  document.addEventListener('focusout', () => { tip.hidden = true; });
}

/** Cassius Dio, in English: he wrote in Greek. */
export function mountDio(box, passages) {
  for (const passage of passages) {
    box.appendChild(el('figure', {},
      el('h4', {}, passage.title),
      el('blockquote', {}, passage.text),
      el('figcaption', {}, `Cassius Dio, ${passage.ref}`)));
  }
}
