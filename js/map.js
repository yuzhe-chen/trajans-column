/**
 * The empire map: AD 98 against AD 117, Trajan's building works as pins, a
 * timeline of his campaigns, and an inset of the city of Rome.
 *
 * Everything is drawn from the GeoJSON in data/. The empire and the provinces
 * he added are clipped to the coastline, so their outlines can be drawn loosely
 * at sea.
 */

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { el, clear, getJson } from './dom.js';

const W = 1600, H = 900;

const SEAS = [
  { name: 'Mare Internum', lon: 18, lat: 34.5 },
  { name: 'Pontus Euxinus', lon: 34, lat: 43.3 },
  { name: 'Oceanus Atlanticus', lon: -11, lat: 41, vertical: true },
  { name: 'Mare Rubrum', lon: 37.6, lat: 22.5, vertical: true },
  { name: 'Sinus Persicus', lon: 51, lat: 27.5 },
  { name: 'Mare Caspium', lon: 51, lat: 41.5, vertical: true },
];

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
  const svg = d3.select(root.querySelector('.map__svg')).attr('viewBox', `0 0 ${W} ${H}`);
  const card = root.querySelector('.map__card');
  const timelineList = root.querySelector('.timeline');

  const [land, rivers, empire, projects, rome, campaigns] = await Promise.all([
    getJson('data/land.json'), getJson('data/rivers.json'), getJson('data/empire.json'),
    getJson('data/projects.json', []), getJson('data/rome.json'), getJson('data/campaigns.json', []),
  ]);

  const landGeo = asGeo(land);
  const riverGeo = asGeo(rivers);
  const empireGeo = asGeo(empire);
  if (!landGeo || !empireGeo) {
    svg.append('text').attr('x', W / 2).attr('y', H / 2).attr('text-anchor', 'middle').attr('class', 'label').text('Map data is not in place yet');
    return;
  }

  const idOf = (f) => f.id ?? f.properties?.id;
  const base = empireGeo.features.find((f) => idOf(f) === 'empire-98');
  const gains = empireGeo.features.filter((f) => f.properties?.role === 'acquisition');
  // Land held in 98 and given up during the reign (southern Scotland, c. 105).
  const losses = empireGeo.features.filter((f) => f.properties?.role === 'withdrawn');

  // Fitted to points, not a polygon, so ring direction can't flip it inside out.
  const frame = { type: 'MultiPoint', coordinates: [[-11, 23], [-11, 54], [52, 54], [52, 23], [20, 55], [20, 22]] };
  const projection = d3.geoConicConformal().parallels([30, 48]).rotate([-20, 0]).fitExtent([[10, 10], [W - 10, H - 10]], frame);
  const path = d3.geoPath(projection);

  const defs = svg.append('defs');
  defs.append('pattern').attr('id', 'lost').attr('width', 6).attr('height', 6)
    .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)')
    .call((p) => {
      p.append('rect').attr('width', 6).attr('height', 6).attr('fill', '#26241f');
      p.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 6).attr('stroke', '#6d6556').attr('stroke-width', 2);
    });
  defs.append('clipPath').attr('id', 'land-clip').append('path').attr('d', path(landGeo));

  const world = svg.append('g');
  const empireLayer = world.append('g');
  const romeLayer = svg.append('g').attr('display', 'none');

  // ── empire view ──
  empireLayer.append('rect').attr('class', 'sea').attr('width', W).attr('height', H);
  empireLayer.append('path').attr('class', 'graticule').attr('d', path(d3.geoGraticule().step([10, 10])()));
  empireLayer.append('path').attr('class', 'land').attr('d', path(landGeo));
  const clipped = empireLayer.append('g').attr('clip-path', 'url(#land-clip)');
  if (base) clipped.append('path').attr('class', 'empire').attr('d', path(base));
  const gainPaths = clipped.selectAll('path.gain').data(gains).join('path')
    .attr('class', 'gain is-hidden')
    .attr('d', path)
    .on('click', (event, d) => showCard({
      name: d.properties.name,
      latin: d.properties.latin,
      meta: `Added AD ${d.properties.year}${d.properties.approximate ? ' · borders approximate' : ''}`,
      text: d.properties.note,
    }));
  const lossPaths = clipped.selectAll('path.loss').data(losses).join('path')
    .attr('class', 'loss')
    .attr('d', path)
    .attr('fill', 'url(#lost)')
    .attr('opacity', 0)
    .style('cursor', 'pointer')
    .on('click', (event, d) => showCard({
      name: d.properties.name,
      latin: d.properties.latin,
      meta: `Given up c. AD ${d.properties.year}`,
      text: d.properties.note,
    }));
  if (riverGeo) empireLayer.append('path').attr('class', 'river').attr('d', path(riverGeo));

  empireLayer.append('g').selectAll('text').data(SEAS).join('text')
    .attr('class', 'label label--sea')
    .attr('text-anchor', 'middle')
    .attr('transform', (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x},${y})${d.vertical ? ' rotate(-90)' : ''}`;
    })
    .text((d) => d.name);

  const gainLabels = empireLayer.append('g').selectAll('text').data(gains).join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('opacity', 0)
    .attr('transform', (d) => `translate(${path.centroid(d)})`)
    .text((d) => d.properties.latin || d.properties.name);

  // campaign marker
  const marker = empireLayer.append('g').attr('opacity', 0);
  marker.append('circle').attr('r', 16).attr('fill', 'none').attr('stroke', '#fff').attr('stroke-width', 1.5);
  marker.append('circle').attr('r', 4).attr('fill', '#fff');

  const pins = empireLayer.append('g').selectAll('g').data(projects).join('g')
    .attr('class', 'pin')
    .attr('tabindex', 0)
    .attr('role', 'button')
    .attr('aria-label', (d) => d.name)
    .attr('transform', (d) => `translate(${projection([d.lon, d.lat])})`)
    .on('click', (event, d) => selectPin(event.currentTarget, d))
    .on('keydown', (event, d) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPin(event.currentTarget, d); }
    });
  pins.append('circle').attr('r', 6.5);
  pins.append('text').attr('x', 10).attr('y', 4).text((d) => d.name);

  function selectPin(node, d) {
    pins.classed('is-active', false);
    d3.select(node).classed('is-active', true);
    showCard({
      name: d.name,
      latin: d.latin,
      meta: [d.years && `AD ${d.years}`, d.place, d.architect].filter(Boolean).join(' · '),
      text: d.summary,
    });
  }

  // zoom and pan
  const zoom = d3.zoom().scaleExtent([1, 6]).translateExtent([[0, 0], [W, H]])
    .filter((event) => event.type !== 'wheel' || event.ctrlKey || event.metaKey)
    .on('zoom', (event) => {
      world.attr('transform', event.transform);
      const k = event.transform.k;
      pins.select('circle').attr('r', 6.5 / Math.sqrt(k)).attr('stroke-width', 1.5 / k);
      pins.select('text').attr('font-size', 10 / k).attr('x', 10 / Math.sqrt(k));
      world.selectAll('.label').attr('font-size', null).style('font-size', `${(1 / Math.sqrt(k)).toFixed(3)}em`);
    });
  svg.call(zoom);

  // ── the year ──
  let year = 98;
  function setYear(next, { animate = true } = {}) {
    year = next;
    gainPaths.classed('is-hidden', (d) => d.properties.year > year);
    lossPaths.transition().duration(animate ? 600 : 0).attr('opacity', (d) => (d.properties.year <= year ? 1 : 0))
      .style('pointer-events', (d) => (d.properties.year <= year ? 'auto' : 'none'));
    gainLabels.transition().duration(animate ? 600 : 0).attr('opacity', (d) => (d.properties.year <= year ? 1 : 0));
    pins.attr('opacity', (d) => (firstYear(d.years) <= year || firstYear(d.years) < 98 ? 1 : 0.25));
    for (const button of root.querySelectorAll('[data-year]')) {
      button.setAttribute('aria-checked', String(Number(button.dataset.year) === (year >= 117 ? 117 : year <= 98 ? 98 : -1)));
    }
  }
  for (const button of root.querySelectorAll('[data-year]')) {
    button.addEventListener('click', () => {
      setYear(Number(button.dataset.year));
      for (const b of timelineList.querySelectorAll('button')) b.setAttribute('aria-pressed', 'false');
      marker.attr('opacity', 0);
    });
  }

  // ── timeline ──
  clear(timelineList);
  for (const event of campaigns) {
    const button = el('button', { type: 'button', 'aria-pressed': 'false' },
      el('div', { class: 'yr' }, String(event.year)),
      el('div', { class: 'ttl' }, event.title));
    button.addEventListener('click', () => {
      for (const b of timelineList.querySelectorAll('button')) b.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-pressed', 'true');
      setView('empire');
      setYear(firstYear(event.year));
      if (event.lon != null) {
        marker.attr('transform', `translate(${projection([event.lon, event.lat])})`).attr('opacity', 1);
      }
      showCard({ name: event.title, latin: event.place, meta: `AD ${event.year}`, text: event.text });
    });
    timelineList.appendChild(el('li', {}, button));
  }

  // ── the city of Rome ──
  if (rome?.monuments?.length) {
    const pts = { type: 'MultiPoint', coordinates: [...rome.monuments.map((m) => [m.lon, m.lat]), ...(rome.bounds || [])] };
    const rp = d3.geoMercator().fitExtent([[140, 90], [W - 140, H - 90]], pts);
    const rpath = d3.geoPath(rp);
    romeLayer.append('rect').attr('class', 'sea').attr('width', W).attr('height', H).style('fill', '#1b1a17');
    const wall = asGeo(rome.servianWall ?? rome.wall);
    if (wall) {
      romeLayer.append('path').attr('d', rpath(wall)).attr('fill', '#22201c')
        .attr('stroke', '#6d6556').attr('stroke-width', 2).attr('stroke-dasharray', '6 5');
      romeLayer.append('text').attr('class', 'label label--sea').attr('text-anchor', 'middle')
        .attr('transform', `translate(${rpath.centroid(wall)[0]},${rpath.bounds(wall)[0][1] - 14})`)
        .text('Murus Servii Tullii');
    }
    const tiber = asGeo(rome.tiber);
    if (tiber) {
      romeLayer.append('path').attr('d', rpath(tiber)).attr('fill', 'none')
        .attr('stroke', '#2c4a5e').attr('stroke-width', 16).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
    }
    const island = asGeo(rome.tiberIsland);
    if (island) romeLayer.append('path').attr('d', rpath(island)).attr('fill', '#3a372f');
    romeLayer.append('text').attr('x', W - 16).attr('y', H - 14).attr('text-anchor', 'end')
      .attr('class', 'label').style('text-transform', 'none').style('font-size', '12px')
      .text('Tiber © OpenStreetMap contributors · wall approximate');
    const rpins = romeLayer.selectAll('g').data(rome.monuments).join('g')
      .attr('class', 'pin')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => d.name)
      .attr('transform', (d) => `translate(${rp([d.lon, d.lat])})`)
      .on('click', (event, d) => {
        rpins.classed('is-active', false);
        d3.select(event.currentTarget).classed('is-active', true);
        showCard({ name: d.name, latin: d.latin, meta: d.years ? `AD ${d.years}` : '', text: d.summary });
      });
    rpins.append('circle').attr('r', (d) => (d.kind === 'landmark' ? 5 : 9))
      .style('fill', (d) => (d.kind === 'landmark' ? '#8a8378' : null));
    // Labels on the right, nudged down where they would collide, with a
    // leader line back to the pin when they move.
    const placed = [];
    const offsets = new Map();
    for (const d of [...rome.monuments].sort((a, b) => rp([a.lon, a.lat])[1] - rp([b.lon, b.lat])[1])) {
      const [x, y] = rp([d.lon, d.lat]);
      let ly = y;
      for (const other of placed) {
        if (Math.abs(other.x - x) < 190 && Math.abs(other.y - ly) < 19) ly = other.y + 19;
      }
      placed.push({ x, y: ly });
      offsets.set(d, ly - y);
    }
    rpins.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 13).attr('y2', (d) => offsets.get(d))
      .attr('stroke', '#8a8378').attr('stroke-width', 1).attr('opacity', (d) => (offsets.get(d) ? 1 : 0));
    rpins.append('text').attr('x', 16).attr('y', (d) => offsets.get(d) + 4)
      .style('opacity', 1).style('font-size', '13px').text((d) => d.name);
  }

  function setView(view) {
    const isRome = view === 'rome' && rome?.monuments?.length;
    world.attr('display', isRome ? 'none' : null);
    romeLayer.attr('display', isRome ? null : 'none');
    svg.attr('aria-label', isRome ? 'Map of ancient Rome with Trajan’s monuments' : 'Map of the Roman Empire');
    for (const button of root.querySelectorAll('[data-view]')) {
      button.setAttribute('aria-checked', String(button.dataset.view === (isRome ? 'rome' : 'empire')));
    }
    hideCard();
  }
  for (const button of root.querySelectorAll('[data-view]')) {
    button.addEventListener('click', () => setView(button.dataset.view));
  }

  // ── the card ──
  function showCard({ name, latin, meta, text }) {
    clear(card);
    card.append(
      el('button', { type: 'button', 'aria-label': 'Close', onclick: hideCard }, '×'),
      el('h3', {}, name || ''),
      latin ? el('p', { class: 'latin', lang: 'la' }, latin) : '',
      meta ? el('p', { class: 'meta' }, meta) : '',
      text ? el('p', {}, text) : '',
    );
    card.hidden = false;
  }
  function hideCard() {
    card.hidden = true;
    pins.classed('is-active', false);
  }

  setYear(98, { animate: false });

  // The first time the map comes into view, play 98 -> 117 once.
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    setTimeout(() => setYear(117), 900);
  }, { threshold: 0.5 });
  io.observe(root);
}
