/** Small DOM helpers. */

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export async function getJson(url, fallback = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(String(response.status));
    return await response.json();
  } catch {
    return fallback;
  }
}

/**
 * Scroll the page to `top` with an eased animation of our own. The browser's
 * smooth scroll can stop short over long distances, and this one also stops
 * the moment the reader scrolls for themselves.
 */
let scrollAnim = 0;
export function glideTo(top, { duration } = {}) {
  cancelAnimationFrame(scrollAnim);
  const html = document.documentElement;
  const from = window.scrollY;
  const to = Math.max(0, Math.min(top, html.scrollHeight - window.innerHeight));
  const distance = to - from;
  const time = duration ?? Math.min(2600, 500 + Math.abs(distance) * 0.35);
  const start = performance.now();
  html.style.scrollBehavior = 'auto';
  let cancelled = false;
  const cancel = () => { cancelled = true; };
  for (const type of ['wheel', 'touchstart', 'keydown']) window.addEventListener(type, cancel, { once: true, passive: true });
  return new Promise((resolve) => {
    const frame = (now) => {
      const t = Math.min(1, (now - start) / time);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      if (!cancelled) window.scrollTo(0, from + distance * e);
      if (t < 1 && !cancelled) scrollAnim = requestAnimationFrame(frame);
      else { html.style.scrollBehavior = ''; resolve(); }
    };
    scrollAnim = requestAnimationFrame(frame);
  });
}
