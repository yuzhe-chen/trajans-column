/** Roman numerals, both ways. */

const TABLE = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
const VALUE = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function toRoman(n) {
  let left = Math.floor(n);
  if (!(left > 0 && left < 4000)) return '';
  let out = '';
  for (const [value, letters] of TABLE) {
    while (left >= value) { out += letters; left -= value; }
  }
  return out;
}

/** A numeral -> number, or NaN if it is not a well-formed numeral. */
export function fromRoman(text) {
  const s = String(text).trim().toUpperCase();
  if (!/^[IVXLCDM]+$/.test(s)) return NaN;
  let total = 0;
  for (let i = 0; i < s.length; i += 1) {
    const v = VALUE[s[i]], next = VALUE[s[i + 1]] || 0;
    total += v < next ? -v : v;
  }
  return toRoman(total) === s ? total : NaN;
}

/** How a numeral adds up, e.g. CXIII -> "C (100) + X (10) + III (3)". */
export function explainRoman(n) {
  let left = n;
  const parts = [];
  for (const [value, letters] of TABLE) {
    let count = 0;
    while (left >= value) { left -= value; count += 1; }
    if (count) parts.push(`${letters.repeat(count)} (${value * count})`);
  }
  return parts.join(' + ');
}

/** "I–IV", "LXXVIII", "XCVIII-XCIX" -> [first, last] */
export function parseRomanRange(text) {
  if (!text) return null;
  const bits = String(text).split(/\s*[–—-]\s*/).map((b) => (/^\d+$/.test(b) ? Number(b) : fromRoman(b)));
  if (bits.some(Number.isNaN) || !bits.length) return null;
  return [bits[0], bits[bits.length - 1]];
}
