/**
 * The empire map.
 *
 * A dark, textured basemap with the empire of AD 98 in stone and Trajan's
 * additions in red. The reign runs down a vertical timeline beside it: each
 * step sets the year, flies the map to the place and opens its card. Building
 * works are icon pins; the ones inside Rome collapse into a single pin that
 * opens the city view. Zoom with the wheel, a pinch or the buttons.
 */

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { el, clear, getJson } from './dom.js';

const W = 1600, H = 1000;
const ROME = [12.4853, 41.8946];
const ROMAN_MILE_KM = 1.48;

const SEAS = [
  { name: 'Mare Internum', lon: 18.5, lat: 34.6 },
  { name: 'Pontus Euxinus', lon: 34.5, lat: 43.2 },
  { name: 'Oceanus Atlanticus', lon: -12.5, lat: 42, vertical: true },
  { name: 'Mare Rubrum', lon: 38.2, lat: 21.5, vertical: true },
  { name: 'Sinus Persicus', lon: 51.2, lat: 27.4 },
  { name: 'Mare Caspium', lon: 51, lat: 42, vertical: true },
  { name: 'Oceanus Germanicus', lon: 3.5, lat: 55.2 },
];

/** Small line drawings for each kind of work, in a 16-unit box. */
const GLYPHS = {
  forum: 'M-5.5,-1.5 L0,-5.5 L5.5,-1.5 Z M-4,-1 V4 M-1.3,-1 V4 M1.3,-1 V4 M4,-1 V4 M-6,4.5 H6',
  bridge: 'M-6.5,3 H6.5 M-6,3 Q-3,-3 0,3 Q3,-3 6,3 M-6.5,-1 H6.5',
  road: 'M-3.5,6 L-1,-6 M3.5,6 L1,-6 M0,4 V2.5 M0,0 V-1.5 M0,-3.5 V-5',
  harbour: 'M0,-4.5 V5 M-3,-2 H3 M-5,1.5 Q-4.5,5.5 0,5.5 Q4.5,5.5 5,1.5 M-1.4,-6 a1.4,1.4 0 1,0 2.8,0 a1.4,1.4 0 1,0 -2.8,0',
  aqueduct: 'M-7,-3 H7 M-7,-3 V5 M-2.3,5 V0 Q-4.6,-2 -7,0 M2.3,5 V0 Q0,-2 -2.3,0 M7,5 V0 Q4.6,-2 2.3,0 M7,-3 V5',
  arch: 'M-6,5.5 V-5 H6 V5.5 M-2.5,5.5 V0.5 Q0,-3 2.5,0.5 V5.5 M-6,-2.5 H6',
  monument: 'M0,-6 V5 M-1.8,-6 H1.8 M-3.5,5.5 H3.5 M-2,2 H2',
  city: 'M-5,-5 H5 V5 H-5 Z M0,-5 V5 M-5,0 H5',
  baths: 'M-6,-1.5 q1.5,-2 3,0 t3,0 t3,0 t3,0 M-6,2.5 q1.5,-2 3,0 t3,0 t3,0 t3,0',
  rome: 'M0,-6 L1.8,-1.9 L6,-1.9 L2.6,0.8 L3.8,5.2 L0,2.6 L-3.8,5.2 L-2.6,0.8 L-6,-1.9 L-1.8,-1.9 Z',
};

function asGeo(data) {
  if (!data) return null;
  if (data.type === 'Topology') {
    const key = Object.keys(data.objects)[0];
    return topojson.feature(data, data.objects[key]);
  }
  return data;
}

function firstYear(years) {
  const m = String(years ?? '').match(/\d{2,3}/);
  return m ? Number(m[0]) : 0;
}

export async function mountMap(root) {
  const svgNode = root.querySelector('.map__svg');
  const svg = d3.select(svgNode).attr('viewBox', `0 0 ${W} ${H}`);
  const card = root.querySelector('.map__card');
  const timelineList = root.querySelector('.timeline');
  const yearOut = root.querySelector('.map__year strong');

  const [land, rivers, empire, projects, rome, campaigns] = await Promise.all([
    getJson('data/land.json'), getJson('data/rivers.json'), getJson('data/empire.json'),
    getJson('data/projects.json', []), getJson('data/rome.json'), getJson('data/campaigns.json', []),
  ]);
  const landGeo = asGeo(land);
  const empireGeo = asGeo(empire);
  if (!landGeo || !empireGeo) return;
  const riverGeo = asGeo(rivers);

  const idOf = (f) => f.id ?? f.properties?.id;
  const base = empireGeo.features.find((f) => idOf(f) === 'empire-98');
  const gains = empireGeo.features.filter((f) => f.properties?.role === 'acquisition');
  const losses = empireGeo.features.filter((f) => f.properties?.role === 'withdrawn');

  const frame = { type: 'MultiPoint', coordinates: [[-11, 23], [-11, 55], [53, 55], [53, 23], [20, 56], [20, 21]] };
  const projection = d3.geoConicConformal().parallels([30, 48]).rotate([-20, 0]).fitExtent([[0, 0], [W, H]], frame);
  const path = d3.geoPath(projection);

  // ── definitions: sea light, coastal glow, grain, hatch ──
  const defs = svg.append('defs');
  const sea = defs.append('radialGradient').attr('id', 'seaGrad').attr('cx', '45%').attr('cy', '55%').attr('r', '75%');
  sea.append('stop').attr('offset', '0%').attr('stop-color', '#0f1a24');
  sea.append('stop').attr('offset', '100%').attr('stop-color', '#05080b');
  defs.append('filter').attr('id', 'blur').attr('x', '-5%').attr('y', '-5%').attr('width', '110%').attr('height', '110%')
    .append('feGaussianBlur').attr('stdDeviation', 4);
  const grain = defs.append('filter').attr('id', 'grain').attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '100%');
  grain.append('feTurbulence').attr('type', 'fractalNoise').attr('baseFrequency', 0.9).attr('numOctaves', 2).attr('seed', 4).attr('result', 'n');
  grain.append('feColorMatrix').attr('type', 'matrix').attr('values', '0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0.09 0');
  defs.append('pattern').attr('id', 'lost').attr('width', 7).attr('height', 7)
    .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)')
    .call((p) => {
      p.append('rect').attr('width', 7).attr('height', 7).attr('fill', '#2a2721');
      p.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 7).attr('stroke', '#7b705c').attr('stroke-width', 2.2);
    });
  defs.append('clipPath').attr('id', 'land-clip').append('path').attr('d', path(landGeo));

  const world = svg.append('g').attr('class', 'world');
  const romeLayer = svg.append('g').attr('display', 'none');
  const romeInner = romeLayer.append('g');

  world.append('rect').attr('x', -W).attr('y', -H).attr('width', W * 3).attr('height', H * 3).attr('fill', 'url(#seaGrad)');
  world.append('path').attr('class', 'graticule').attr('d', path(d3.geoGraticule().step([10, 10])()));
  world.append('path').attr('class', 'coast-glow').attr('d', path(landGeo));
  world.append('path').attr('class', 'land').attr('d', path(landGeo)).attr('vector-effect', 'non-scaling-stroke');

  const clipped = world.append('g').attr('clip-path', 'url(#land-clip)');
  if (base) clipped.append('path').attr('class', 'empire98').attr('d', path(base)).attr('vector-effect', 'non-scaling-stroke');
  const gainPaths = clipped.selectAll('path.gain').data(gains).join('path')
    .attr('class', 'gain is-hidden').attr('d', path).attr('vector-effect', 'non-scaling-stroke')
    .on('click', (event, d) => showCard({
      name: d.properties.name, latin: d.properties.latin,
      meta: `Added AD ${d.properties.year}${d.properties.approximate ? ' · borders approximate' : ''}`,
      text: d.properties.note,
    }));
  const lossPaths = clipped.selectAll('path.loss').data(losses).join('path')
    .attr('class', 'loss').attr('d', path).attr('fill', 'url(#lost)').attr('opacity', 0)
    .on('click', (event, d) => showCard({
      name: d.properties.name, latin: d.properties.latin,
      meta: `Given up c. AD ${d.properties.year}`, text: d.properties.note,
    }));
  // Grain over the land only, for a printed-map feel.
  clipped.append('rect').attr('class', 'land-tex').attr('x', 0).attr('y', 0).attr('width', W).attr('height', H).attr('filter', 'url(#grain)');

  if (riverGeo) world.append('path').attr('class', 'river').attr('d', path(riverGeo)).attr('vector-effect', 'non-scaling-stroke');

  const labels = world.append('g');
  labels.selectAll('text.label--sea').data(SEAS).join('text')
    .attr('class', 'label label--sea').attr('text-anchor', 'middle')
    .attr('transform', (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x},${y})${d.vertical ? ' rotate(-90)' : ''}`;
    })
    .text((d) => d.name);
  const gainLabels = labels.selectAll('text.gain-label').data(gains).join('text')
    .attr('class', 'label gain-label').attr('text-anchor', 'middle').attr('opacity', 0)
    .attr('transform', (d) => `translate(${path.centroid(d)})`)
    .text((d) => (d.properties.latin || d.properties.name).toUpperCase());

  // ── pins: everything in Rome becomes one pin ──
  const inRome = (d) => Math.abs(d.lon - ROME[0]) < 0.08 && Math.abs(d.lat - ROME[1]) < 0.06;
  const outside = projects.filter((d) => !inRome(d));
  const romeWorks = projects.filter(inRome);
  const pinData = [
    ...outside,
    { id: 'roma', name: 'Rome', latin: 'Roma', lon: ROME[0], lat: ROME[1], kind: 'rome', isRome: true, years: '' },
  ];

  const marker = world.append('g').attr('class', 'marker').attr('opacity', 0);
  marker.append('circle').attr('class', 'pulse').attr('r', 14).attr('stroke-width', 2);
  marker.append('circle').attr('class', 'dot').attr('r', 3).style('fill', '#fff');

  const pins = world.append('g').selectAll('g.pin').data(pinData).join('g')
    .attr('class', 'pin')
    .attr('tabindex', 0)
    .attr('role', 'button')
    .attr('aria-label', (d) => (d.isRome ? 'Rome: open the city map' : d.name))
    .attr('transform', (d) => `translate(${projection([d.lon, d.lat])})`)
    .on('click', (event, d) => (d.isRome ? setView('rome') : selectPin(d)))
    .on('keydown', (event, d) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); (d.isRome ? setView('rome') : selectPin(d)); }
    });
  const pinInner = pins.append('g').attr('class', 'pin__inner');
  pinInner.append('circle').attr('class', 'halo').attr('r', (d) => (d.isRome ? 22 : 18));
  pinInner.append('circle').attr('class', 'disc').attr('r', (d) => (d.isRome ? 12 : 10));
  pinInner.append('path').attr('class', 'glyph').attr('d', (d) => GLYPHS[d.kind] || GLYPHS.monument)
    .attr('transform', (d) => `scale(${d.isRome ? 1 : 0.85})`)
    .style('fill', (d) => (d.isRome ? '#000' : null));
  pinInner.append('text').attr('class', 'name').attr('x', 15).attr('y', 4)
    .text((d) => (d.isRome ? `Rome · ${romeWorks.length} works` : d.name));
  // Rome and the bridge are always labelled.
  pinInner.filter((d) => d.isRome || d.id === 'trajans-bridge').select('.name').style('opacity', 1);

  function selectPin(d) {
    pins.classed('is-active', (p) => p === d);
    showCard({
      id: d.id,
      name: d.name,
      latin: d.latin,
      meta: [d.years && `AD ${d.years}`, d.place, d.architect].filter(Boolean).join(' · '),
      text: d.summary,
    });
  }

  // ── scale bar in Roman miles ──
  const scalebar = svg.append('g').attr('class', 'scalebar').attr('transform', `translate(${W - 270},${H - 80})`);

  // ── zoom ──
  let k = 1;
  // Clicking in the map wakes up wheel and pinch zoom; leaving it puts them back to sleep.
  let active = false;
  const frameEl = root.querySelector('.map__frame');
  const setActive = (on) => { active = on; frameEl.classList.toggle('is-active', on); };
  frameEl.addEventListener('pointerdown', () => setActive(true));
  frameEl.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') setActive(false); });
  document.addEventListener('pointerdown', (e) => { if (!frameEl.contains(e.target)) setActive(false); });
  let view = 'empire';
  const saved = { empire: d3.zoomIdentity, rome: d3.zoomIdentity };
  const zoom = d3.zoom()
    .scaleExtent([1, 14])
    .translateExtent([[-W * 0.1, -H * 0.1], [W * 1.1, H * 1.1]])
    // The wheel and a pinch only work on the map once it has been clicked;
    // until then they scroll the page as usual. Dragging always pans.
    .filter((event) => {
      if (event.type === 'wheel') return active;
      if (event.type.startsWith('touch')) return active;
      return !event.button;
    })
    .on('zoom', (event) => {
      k = event.transform.k;
      if (view === 'rome') {
        romeInner.attr('transform', event.transform);
        rpins?.attr('transform', (d) => `translate(${rp([d.lon, d.lat])}) scale(${1 / k})`);
        return;
      }
      world.attr('transform', event.transform);
      pinInner.attr('transform', `scale(${1 / k})`);
      marker.attr('data-k', k);
      marker.select('.pulse').attr('stroke-width', 2 / k).attr('r', 14 / k);
      marker.select('.dot').attr('r', 3 / k);
      labels.selectAll('.label--sea').style('font-size', `${15 / Math.sqrt(k)}px`);
      labels.selectAll('.gain-label').style('font-size', `${10.5 / Math.sqrt(k)}px`);
      svg.classed('is-close', k >= 3);
      drawScale();
    });
  svg.call(zoom).on('dblclick.zoom', null);

  function drawScale() {
    // A Roman mile measured at the map's centre, at the current zoom.
    const c = projection.invert([W / 2, H / 2]);
    const a = projection(c);
    const b = projection([c[0] + 1, c[1]]);
    const kmPerDeg = 111.32 * Math.cos((c[1] * Math.PI) / 180);
    const pxPerMile = (Math.hypot(b[0] - a[0], b[1] - a[1]) * k * ROMAN_MILE_KM) / kmPerDeg;
    const options = [5, 10, 25, 50, 100, 200, 250, 500, 1000];
    const miles = options.find((m) => m * pxPerMile >= 110) ?? 1000;
    const len = miles * pxPerMile;
    clear(scalebar.node());
    scalebar.append('line').attr('x1', 0).attr('x2', len).attr('y1', 0).attr('y2', 0);
    scalebar.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -5).attr('y2', 5);
    scalebar.append('line').attr('x1', len).attr('x2', len).attr('y1', -5).attr('y2', 5);
    scalebar.append('text').attr('x', 0).attr('y', -10).text(`${miles} Roman miles · ${Math.round(miles * ROMAN_MILE_KM)} km`);
  }
  drawScale();

  function flyTo(lon, lat, scale = 3.2) {
    const [x, y] = projection([lon, lat]);
    const t = d3.zoomIdentity.translate(W / 2, H / 2).scale(scale).translate(-x, -y);
    svg.transition().duration(1200).ease(d3.easeCubicInOut).call(zoom.transform, t);
  }
  const zoomBy = (f) => svg.transition().duration(400).call(zoom.scaleBy, f);
  root.querySelector('[data-zoom="in"]').addEventListener('click', () => zoomBy(1.8));
  root.querySelector('[data-zoom="out"]').addEventListener('click', () => zoomBy(1 / 1.8));
  root.querySelector('[data-zoom="reset"]').addEventListener('click', () => {
    svg.transition().duration(800).call(zoom.transform, d3.zoomIdentity);
    if (view === 'empire') marker.attr('opacity', 0);
  });

  // ── the year ──
  let year = 98;
  function setYear(next, { animate = true } = {}) {
    year = next;
    yearOut.textContent = year;
    gainPaths.classed('is-hidden', (d) => d.properties.year > year);
    lossPaths.transition().duration(animate ? 800 : 0)
      .attr('opacity', (d) => (d.properties.year <= year ? 1 : 0))
      .style('pointer-events', (d) => (d.properties.year <= year ? 'auto' : 'none'));
    gainLabels.transition().duration(animate ? 700 : 0).attr('opacity', (d) => (d.properties.year <= year ? 1 : 0));
    pins.classed('is-later', (d) => !d.isRome && firstYear(d.years) > year);
  }

  // ── the vertical timeline ──
  clear(timelineList);
  const steps = campaigns.map((event) => {
    const button = el('button', { type: 'button', 'aria-pressed': 'false' },
      el('span', { class: 'yr' }, `AD ${event.year}`),
      el('span', { class: 'ttl' }, event.title));
    button.addEventListener('click', () => go(event, button));
    timelineList.appendChild(el('li', {}, button));
    return { event, button };
  });
  function go(event, button) {
    for (const s of steps) s.button.setAttribute('aria-pressed', String(s.button === button));
    setView('empire');
    setYear(firstYear(event.year));
    if (event.lon != null) {
      flyTo(event.lon, event.lat, event.zoom ?? 3);
      marker.attr('transform', `translate(${projection([event.lon, event.lat])})`).attr('opacity', 1);
    }
    showCard({ name: event.title, latin: event.place, meta: `AD ${event.year}`, text: event.text });
  }

  // ── the city of Rome ──
  let rpins = null, rp = null;
  if (rome?.monuments?.length) {
    const pts = { type: 'MultiPoint', coordinates: [...rome.monuments.map((m) => [m.lon, m.lat]), ...(rome.bounds || [])] };
    rp = d3.geoMercator().fitExtent([[140, 90], [W - 140, H - 90]], pts);
    const rpath = d3.geoPath(rp);
    romeLayer.insert('rect', ':first-child').attr('width', W).attr('height', H).attr('fill', '#14130f');
    const wall = asGeo(rome.servianWall ?? rome.wall);
    if (wall) {
      romeInner.append('path').attr('d', rpath(wall)).attr('fill', '#1d1b17').attr('vector-effect', 'non-scaling-stroke')
        .attr('stroke', '#6d6556').attr('stroke-width', 2).attr('stroke-dasharray', '7 5');
      romeInner.append('text').attr('class', 'label').attr('text-anchor', 'middle')
        .attr('transform', `translate(${rpath.centroid(wall)[0]},${rpath.bounds(wall)[0][1] - 16})`)
        .text('MURUS SERVII TULLII');
    }
    const tiber = asGeo(rome.tiber);
    if (tiber) {
      romeInner.append('path').attr('d', rpath(tiber)).attr('fill', 'none').attr('class', 'tiber')
        .attr('stroke', '#24445a').attr('stroke-width', 18).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
    }
    const island = asGeo(rome.tiberIsland);
    if (island) romeInner.append('path').attr('d', rpath(island)).attr('fill', '#3a372f');

    const placed = [];
    const offsets = new Map();
    for (const d of [...rome.monuments].sort((a, b) => rp([a.lon, a.lat])[1] - rp([b.lon, b.lat])[1])) {
      const [x, y] = rp([d.lon, d.lat]);
      let ly = y;
      for (const o of placed) if (Math.abs(o.x - x) < 200 && Math.abs(o.y - ly) < 22) ly = o.y + 22;
      placed.push({ x, y: ly });
      offsets.set(d, ly - y);
    }
    rpins = romeInner.selectAll('g.pin').data(rome.monuments).join('g')
      .attr('class', 'pin').attr('tabindex', 0).attr('role', 'button').attr('aria-label', (d) => d.name)
      .attr('transform', (d) => `translate(${rp([d.lon, d.lat])})`)
      .on('click', (event, d) => {
        rpins.classed('is-active', (p) => p === d);
        showCard({ id: d.id, name: d.name, latin: d.latin, meta: d.years ? `AD ${d.years}` : '', text: d.summary });
      });
    rpins.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 14).attr('y2', (d) => offsets.get(d))
      .attr('stroke', '#8a8378').attr('opacity', (d) => (offsets.get(d) ? 1 : 0));
    rpins.append('circle').attr('class', 'disc').attr('r', (d) => (d.kind === 'landmark' ? 5 : 9))
      .style('fill', (d) => (d.kind === 'landmark' ? '#8a8378' : null));
    rpins.append('text').attr('class', 'name').attr('x', 18).attr('y', (d) => offsets.get(d) + 4)
      .style('opacity', 1).style('font-size', '14px').text((d) => d.name);
    romeLayer.append('text').attr('x', W - 18).attr('y', H - 16).attr('text-anchor', 'end')
      .style('font', '12px "Helvetica Neue", Arial, sans-serif').style('fill', '#8a8378')
      .text('Tiber © OpenStreetMap contributors · Servian Wall approximate');
    const back = romeLayer.append('g').attr('tabindex', 0).attr('role', 'button').style('cursor', 'pointer')
      .attr('transform', `translate(${W - 190},40)`).on('click', () => setView('empire'));
    back.append('rect').attr('width', 170).attr('height', 44).attr('fill', '#fff');
    back.append('text').attr('x', 20).attr('y', 28).style('font', '500 18px "Helvetica Neue", Arial, sans-serif').style('fill', '#000').text('← The empire');
  }

  function setView(next) {
    const isRome = next === 'rome' && rome?.monuments?.length;
    const nextView = isRome ? 'rome' : 'empire';
    if (nextView !== view) {
      // Each view keeps its own zoom.
      saved[view] = d3.zoomTransform(svgNode);
      view = nextView;
      svg.call(zoom.transform, saved[view]);
    }
    world.attr('display', isRome ? 'none' : null);
    scalebar.attr('display', isRome ? 'none' : null);
    romeLayer.attr('display', isRome ? null : 'none');
    svg.attr('aria-label', isRome ? 'Map of ancient Rome with Trajan’s monuments' : 'Map of the Roman Empire');
    for (const button of document.querySelectorAll('[data-view]')) {
      button.setAttribute('aria-checked', String(button.dataset.view === (isRome ? 'rome' : 'empire')));
    }
    hideCard();
  }
  for (const button of document.querySelectorAll('[data-view]')) {
    button.addEventListener('click', () => setView(button.dataset.view));
  }

  // ── the card ──
  function showCard({ id, name, latin, meta, text }) {
    clear(card);
    const img = id ? el('img', { src: `assets/places/${id}.jpg`, alt: '', loading: 'lazy' }) : null;
    if (img) img.addEventListener('error', () => img.remove());
    card.append(
      el('button', { type: 'button', class: 'close', 'aria-label': 'Close', onclick: hideCard }, '×'),
      img || '',
      el('div', { class: 'body' },
        el('h3', {}, name || ''),
        latin ? el('p', { class: 'latin', lang: 'la' }, latin) : '',
        meta ? el('p', { class: 'meta' }, meta) : '',
        text ? el('p', {}, text) : ''),
    );
    card.hidden = false;
  }
  function hideCard() {
    card.hidden = true;
    pins.classed('is-active', false);
  }

  setYear(98, { animate: false });

  // The first time the map is in view, show what the reign added.
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    setTimeout(() => {
      if (year === 98) {
        setYear(117);
        steps.at(-1)?.button.setAttribute('aria-pressed', 'true');
      }
    }, 900);
  }, { threshold: 0.4 });
  io.observe(root);
}
