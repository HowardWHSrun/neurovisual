import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const data = JSON.parse(await read('data/connections.json'));
const context = vm.createContext({ URL, URLSearchParams });
for (const name of ['hub-utils', 'ideas-data', 'company-media', 'labs-data', 'visuals-data', 'visuals', 'connections-data', 'connections']) {
  vm.runInContext(await read(`dist/${name}.js`), context, { filename: `dist/${name}.js` });
}
const api = vm.runInContext('NeuroConnections', context);
const escape = vm.runInContext('hubUtils.escapeHtml', context);
assert.equal(JSON.stringify(vm.runInContext('neuroConnectionsData', context)), JSON.stringify(data), 'Rebuild connection data before testing');
assert.match(data.reviewed, /^\d{4}-\d{2}-\d{2}$/);
const required = (record, fields, label) => fields.forEach(key => {
  assert.equal(typeof record[key], 'string', `${label}: ${key} is text`);
  assert(record[key].trim(), `${label}: ${key} is nonempty`);
});
const unique = (values, label) => assert.equal(new Set(values).size, values.length, `${label}: unique IDs`);
const secureUrl = (value, label) => {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${label}: HTTPS source`);
  assert(!url.username && !url.password, `${label}: no URL credentials`);
};
const route = (value, label) => value.startsWith('#')
  ? assert.match(value, /^#[a-z][a-z0-9-]*(?:[/?][^<>"'\s]*)?$/, `${label}: safe internal route`)
  : secureUrl(value, label);

for (const key of ['nodes', 'edges', 'stories']) {
  assert(Array.isArray(data[key]) && data[key].length, `${key}: populated collection`);
  unique(data[key].map(x => x.id), key);
  data[key].forEach(x => assert.match(x.id, /^[a-z0-9][a-z0-9_-]*$/, `${key}: stable ID`));
}
const nodes = new Map(data.nodes.map(n => [n.id, n]));
const edges = new Map(data.edges.map(x => [x.id, x]));
const media = new Set(vm.runInContext('NeuroVisuals.items()', context).map(x => x.id));
const kinds = new Set(['Person', 'Lab', 'Company', 'Technology', 'Institution', 'Program']);
const expectedEdges = (id, lens = 'all') => data.edges.filter(x => (x.from === id || x.to === id) && (lens === 'all' || x.category === lens));
for (const n of data.nodes) {
  required(n, ['name', 'subtitle', 'summary'], n.id);
  assert(kinds.has(n.kind), `${n.id}: known node kind`);
  assert(expectedEdges(n.id).length, `${n.id}: no isolated node`);
  if (n.href) route(n.href, n.id);
  if (n.aliases) { assert(Array.isArray(n.aliases)); n.aliases.forEach(h => route(h, n.id)); }
  if (n.media) assert(media.has(n.media), `${n.id}: existing credited visual ${n.media}`);
}
for (const x of data.edges) {
  required(x, ['from', 'to', 'label', 'date', 'detail'], x.id);
  assert(nodes.has(x.from) && nodes.has(x.to), `${x.id}: both endpoints exist`);
  assert.notEqual(x.from, x.to, `${x.id}: meaningful distinct endpoints`);
  assert(['people', 'technology'].includes(x.category), `${x.id}: known lens`);
  assert(['documented', 'comparison'].includes(x.basis), `${x.id}: explicit evidence basis`);
  assert(Array.isArray(x.sources) && x.sources.length, `${x.id}: relationship has evidence`);
  for (const s of x.sources) { required(s, ['title', 'url'], x.id); secureUrl(s.url, x.id); }
  if (x.basis === 'comparison') {
    assert.equal(x.category, 'technology', `${x.id}: editorial comparison is technical`);
    assert.notEqual(x.directed, true, `${x.id}: comparison is not directed`);
    assert(!/\b(?:co-?founded|mentored|trained with|licensed from|spun out|successor of|descended from)\b/i.test(x.label), `${x.id}: comparison label must not claim lineage`);
  }
}
for (const s of data.stories) {
  required(s, ['title', 'deck', 'focus'], s.id);
  assert(Array.isArray(s.trail) && s.trail.length > 1, `${s.id}: a multi-entry story`);
  assert(Array.isArray(s.edges) && s.edges.length, `${s.id}: story has relationships`);
  unique(s.trail, `${s.id} trail`); unique(s.edges, `${s.id} edges`);
  s.trail.forEach(id => assert(nodes.has(id), `${s.id}: known trail node ${id}`));
  assert(s.trail.includes(s.focus), `${s.id}: focus belongs to trail`);
  const selected = s.edges.map(id => { assert(edges.has(id), `${s.id}: known relationship ${id}`); return edges.get(id); });
  selected.forEach(x => assert(s.trail.includes(x.from) && s.trail.includes(x.to), `${s.id}: relationship endpoints belong to the story`));
  assert(selected[0].from === s.focus || selected[0].to === s.focus, `${s.id}: story's first evidence is visible at its focus`);
  const reached = new Set([s.focus]);
  for (let size = -1; size !== reached.size;) {
    size = reached.size;
    selected.forEach(x => { if (reached.has(x.from) || reached.has(x.to)) { reached.add(x.from); reached.add(x.to); } });
  }
  assert(s.trail.every(id => reached.has(id)), `${s.id}: story is a connected subgraph, not unrelated names`);
}

const attributes = html => Object.fromEntries([...html.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'g'))].map(m => attributes(m[1]));
const edgeButtons = html => tags(html, 'button').filter(a => a['data-cn-edge']);
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
let rendered = 0;
function checkPage(html, label) {
  rendered++;
  assert(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(html), `${label}: complete rendered values`);
  unique(ids(html), `${label} DOM`);
  assert(!html.includes('<iframe'), `${label}: media starts as an image, not autoplay`);
  for (const a of tags(html, 'a')) {
    assert(a.href, `${label}: link destination`);
    if (a.target === '_blank') assert(/noopener/.test(a.rel || ''), `${label}: external link isolation`);
  }
}
for (const n of data.nodes) {
  for (const lens of ['all', 'people', 'technology']) {
    const expected = expectedEdges(n.id, lens).map(x => x.id).sort();
    const renders = ['map', 'list'].map(view => {
      const params = new URLSearchParams({ lens, view, edge: 'unknown-relationship' });
      const html = api.render(n.id, params); checkPage(html, `${n.id}/${lens}/${view}`);
      const buttons = edgeButtons(html);
      assert.deepEqual(buttons.map(a => a['data-cn-edge']).sort(), expected, `${n.id}/${lens}/${view}: exactly the incident edges`);
      assert.equal(buttons.filter(a => a['aria-pressed'] === 'true').length, expected.length ? 1 : 0, `${n.id}/${lens}/${view}: one selected evidence item`);
      const s = api.state(n.id, params);
      assert.equal(s.current.id, n.id); assert.equal(s.lens, lens); assert.equal(s.list, view === 'list');
      assert.equal(s.selected?.id, expectedEdges(n.id, lens)[0]?.id, 'Unknown edge falls back within the active lens');
      const control = html.match(/<select id="cn-lens"[^>]*>([\s\S]*?)<\/select>/)?.[1] || '';
      assert(control.includes(`value="${lens}" selected`), 'Lens control reflects rendered membership');
      assert.equal(html.includes('id="cn-map"'), view === 'map', 'Map/list switch changes the actual view');
      if (!expected.length) assert(html.includes('No links in this lens.'), 'Empty lens has an actionable explanation');
      return buttons.map(a => a['data-cn-edge']).sort();
    });
    assert.deepEqual(renders[0], renders[1], `${n.id}/${lens}: map and readable list agree`);
  }
}
for (const x of data.edges) {
  // Inspect evidence from both ends, including comparisons reached backwards.
  for (const id of [x.from, x.to]) {
    const html = api.render(id, new URLSearchParams({ edge: x.id, lens: x.category }));
    checkPage(html, `${x.id}/${id}`);
    assert.equal(edgeButtons(html).find(a => a['aria-pressed'] === 'true')?.['data-cn-edge'], x.id);
    assert(html.includes(escape(x.detail)), `${x.id}: selected evidence is shown`);
    if (x.limit) assert(html.includes(escape(x.limit)), `${x.id}: keep the evidence limit`);
    if (x.basis === 'comparison') {
      assert(html.includes('TECHNICAL COMPARISON'), `${x.id}: visible editorial classification`);
      const button = html.match(new RegExp(`<button[^>]*data-cn-edge="${x.id}"[^>]*>([\\s\\S]*?)<\\/button>`))?.[0] || '';
      assert(button.includes('cn-comparison') && button.includes('↔') && !button.includes('→'), `${x.id}: no lineage arrow on comparison button`);
    }
  }
}
for (const s of data.stories) {
  const params = new URLSearchParams({ story: s.id, edge: s.edges[0] });
  const html = api.render(s.focus, params); checkPage(html, `story/${s.id}`);
  assert.equal(api.state(s.focus, params).story.id, s.id);
  assert.equal(api.state(s.focus, new URLSearchParams({ story: s.id })).selected.id, s.edges[0], `${s.id}: entering the story selects its first evidence`);
  assert(html.includes(escape(s.deck)), `${s.id}: story context retained`);
  s.trail.forEach(id => assert(html.includes(escape(nodes.get(id).name)), `${s.id}: every trail entry is rendered`));
}
checkPage(api.render(), 'default route');
assert.equal(api.state('', new URLSearchParams()).current.id, data.stories[0].focus);
const first = data.nodes[0].id;
const invalid = new URLSearchParams({ lens: 'invalid', view: 'invalid', story: 'invalid', edge: 'invalid' });
assert.equal(api.state(first, invalid).lens, 'all'); assert.equal(api.state(first, invalid).list, false);
assert.equal(api.state(first, invalid).story, null);
checkPage(api.render(first, invalid), 'unknown query values');
const missing = api.render('<img src=x onerror=alert(1)>', new URLSearchParams({ story: data.stories[0].id }));
assert(missing.includes('Connection not found.') && !missing.includes('onerror='), 'Invalid routes show a safe not-found state');
checkPage(missing, 'unknown entry');
assert.equal(api.teaser('#unmapped-profile'), '', 'Unmapped profiles have no misleading teaser');
const records = Array.from(api.records()); unique(records.map(x => x.id), 'Search');
assert.equal(records.length, data.nodes.length);
records.forEach(r => assert(nodes.has(decodeURIComponent(r.href.split('/')[1])), 'Search targets a mapped entry'));

// DOM doubles exercise the actual bind/draw controller, including SVG markers,
// direction, URL state, keyboard modifier behavior, and observer cleanup. They
// deliberately do not assert browser layout or pixel appearance.
const makeElement = (attrs = {}) => ({
  attrs: { ...attrs }, dataset: Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v])),
  events: {}, innerHTML: '', focused: false,
  addEventListener(type, fn) { this.events[type] = fn; },
  getAttribute(key) { return this.attrs[key]; }, setAttribute(key, value) { this.attrs[key] = value; },
  focus() { this.focused = true; }, scrollIntoView(options) { this.scrolled = options; }
});
let mobile = false, lastHistory = '', lastNavigation = '', observers = [];
context.window = { matchMedia: query => ({ matches: query.includes('max-width') && mobile }) };
context.history = { pushState: (_a, _b, href) => { lastHistory = href; } };
context.ResizeObserver = class {
  constructor(fn) { this.callback = fn; this.disconnected = false; observers.push(this); }
  observe() {} disconnect() { this.disconnected = true; }
};
function mounted(id, params = new URLSearchParams()) {
  const html = api.render(id, params), buttons = edgeButtons(html).map(makeElement);
  const links = tags(html, 'a').filter(a => Object.hasOwn(a, 'data-cn-nav') || /#connections\//.test(a.href)).map(makeElement);
  const views = tags(html, 'button').filter(a => a['data-cn-view']).map(makeElement);
  const paths = makeElement(), center = makeElement();
  center.getBoundingClientRect = () => ({ left: 400, right: 600, top: 80, height: 100 });
  const branches = tags(html, 'div').filter(a => a['data-cn-branch']).map((a, i) => {
    const branch = makeElement(a), b = makeElement();
    b.getBoundingClientRect = () => ({ left: a['data-side'] === 'left' ? 20 : 800, right: a['data-side'] === 'left' ? 220 : 1000, top: 40 + 120 * i, height: 90 });
    branch.querySelector = selector => selector === '.cn-node' ? b : buttons.find(x => x.dataset.cnEdge === a['data-cn-branch']);
    return branch;
  });
  const map = makeElement(); map.getBoundingClientRect = () => ({ left: 0, top: 0 });
  map.querySelectorAll = () => branches;
  const elements = { '#cn-controls': makeElement(), '#cn-node-select': makeElement(), '#cn-lens': makeElement(), '#cn-evidence-slot': makeElement(), '#cn-evidence': makeElement(), '#cn-map': html.includes('id="cn-map"') ? map : null, '[data-cn-center]': center, '#cn-wire-paths': paths };
  const container = {
    querySelector: selector => elements[selector] || null,
    querySelectorAll: selector => selector === '[data-cn-nav]' ? links : selector === '[data-cn-view]' ? views : selector === '[data-cn-edge]' ? buttons : []
  };
  api.bind(container, id, params, hash => { lastNavigation = hash; });
  return { container, elements, buttons, links, views, paths, branches };
}
for (const n of data.nodes) {
  const m = mounted(n.id);
  const drawn = tags(m.paths.innerHTML, 'path');
  assert.equal(drawn.length, m.branches.length, `${n.id}: one wire per visible relationship`);
  drawn.forEach((path, i) => {
    const x = edges.get(m.branches[i].dataset.cnBranch), comparison = x.basis === 'comparison';
    assert.equal(Boolean(path['marker-end']), !comparison, `${x.id}: comparisons never have arrowheads`);
    assert.equal((path.class || '').includes('cn-dashed'), comparison, `${x.id}: comparisons use dashed wires`);
    if (!comparison) {
      const branch = m.branches[i], incoming = x.to === n.id, left = branch.dataset.side === 'left';
      assert.equal(branch.dataset.direction, incoming ? 'in' : 'out', `${x.id}: documented edge retains subject/object direction`);
      const coordinates = path.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
      assert.equal(coordinates.at(-2), incoming ? (left ? 400 : 600) : (left ? 220 : 800), `${x.id}: arrow terminates on the object node's facing edge`);
    }
    assert(!/NaN|undefined/.test(path.d), `${x.id}: finite wire coordinates`);
  });
}
let m = mounted(first, new URLSearchParams({ lens: 'all', view: 'map', story: data.stories[0].id }));
const comparison = data.edges.find(x => x.basis === 'comparison');
assert(comparison, 'Include an explicit technical comparison in this graph');
m = mounted(comparison.to);
const button = m.buttons.find(b => b.dataset.cnEdge === comparison.id); button.events.click();
assert(lastHistory.includes(`edge=${comparison.id}`), 'Evidence selection updates URL');
assert(m.elements['#cn-evidence-slot'].innerHTML.includes('TECHNICAL COMPARISON'));
assert(m.elements['#cn-evidence'].focused, 'New evidence receives focus');
assert.equal(m.elements['#cn-evidence'].scrolled?.block, 'start', 'Selected evidence is scrolled into view');
assert.equal(m.buttons.filter(b => b.attrs['aria-pressed'] === 'true').length, 1);
m.elements['#cn-lens'].events.change({ target: { value: 'technology' } });
assert(lastNavigation.includes('lens=technology') && !lastNavigation.includes('edge='), 'Lens changes reset stale evidence');
m.views.find(b => b.dataset.cnView === 'list').events.click();
assert(lastNavigation.includes('view=list'), 'Display control navigates to readable list');
m.elements['#cn-node-select'].events.change({ target: { value: first } });
assert(lastNavigation.startsWith(`#connections/${first}`) && !lastNavigation.includes('edge='), 'Entry changes reset stale evidence');
let prevented = false; lastNavigation = '';
m.links[0].events.click({ metaKey: true, preventDefault() { prevented = true; } });
assert(!prevented && !lastNavigation, 'Modified link clicks retain native browser behavior');
m.links[0].events.click({ preventDefault() { prevented = true; } });
assert(prevented && lastNavigation, 'Plain connection links navigate within the workspace');
mobile = true; m = mounted(first); assert.equal(m.paths.innerHTML, '', 'Small viewports omit desktop connector geometry');
const observer = observers.at(-1); api.close(); assert(observer.disconnected, 'Leaving connections disconnects its observer');
assert(observers.every(o => o.disconnected), 'Repeated mounting does not retain old observers');

console.log(`Connections checks passed: ${data.nodes.length} entries, ${data.edges.length} sourced relationships, ${data.stories.length} connected stories, and ${rendered} rendered states.`);
console.log('Passed: map/list lens parity, safe invalid routes, source/media references, DOM IDs, evidence selection and focus, navigation, undirected comparison wires, and observer cleanup.');
