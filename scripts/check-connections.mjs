import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const graph = JSON.parse(await read('data/connections.json'));
const origins = JSON.parse(await read('data/company-origins.json'));
const bibliography = JSON.parse(await read('data/connection-papers.json'));
const context = vm.createContext({ URL, URLSearchParams });
const modules = ['hub-utils', 'ideas-data', 'company-media', 'labs-data', 'visuals-data', 'visuals', 'connections-data', 'connections', 'origins-data', 'connection-network', 'origins'];
for (const name of modules) vm.runInContext(await read(`dist/${name}.js`), context, { filename: `dist/${name}.js` });
const api = vm.runInContext('NeuroConnections', context);
const network = vm.runInContext('ConnectionNetwork', context);
const evidence = vm.runInContext('ConnectionEvidence', context);
const escape = vm.runInContext('hubUtils.escapeHtml', context);
const plain = value => JSON.parse(JSON.stringify(value));
assert(JSON.stringify(vm.runInContext('neuroConnectionsData', context)) === JSON.stringify(graph), 'Rebuild graph data before testing');
assert(JSON.stringify(vm.runInContext('neuroOriginsData', context)) === JSON.stringify({ ...origins, papers: bibliography.papers }), 'Rebuild company origins and bibliography before testing');
const required = (record, fields, label) => fields.forEach(key => {
  assert.equal(typeof record[key], 'string', `${label}: ${key} is text`);
  assert(record[key].trim(), `${label}: ${key} is nonempty`);
});
const unique = (values, label) => assert.equal(new Set(values).size, values.length, `${label}: unique IDs`);
const list = (values, label, populated = true) => assert(Array.isArray(values) && (!populated || values.length), `${label}: ${populated ? 'populated ' : ''}array`);
const secureUrl = (value, label) => {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${label}: HTTPS source`);
  assert(!url.username && !url.password, `${label}: no URL credentials`);
};
const route = (value, label) => value.startsWith('#')
  ? assert.match(value, /^#[a-z][a-z0-9-]*(?:[/?][^<>"'\s]*)?$/, `${label}: safe internal route`)
  : secureUrl(value, label);
function sources(items, label, populated = true) {
  list(items, label, populated);
  for (const source of items) {
    required(source, ['title', 'url'], label);
    secureUrl(source.url, label);
    if (source.published !== undefined) required(source, ['published'], label);
  }
}
function collection(items, label, populated = true) {
  list(items, label, populated); unique(items.map(x => x.id), label);
  for (const x of items) assert.match(x.id, /^[a-z0-9][a-z0-9_-]*$/, `${label}: stable ID`);
}
for (const data of [graph, origins]) assert.match(data.reviewed, /^\d{4}-\d{2}-\d{2}$/, 'Explicit evidence review date');
collection(graph.nodes, 'Graph nodes'); collection(graph.edges, 'Graph edges');
const nodes = new Map(graph.nodes.map(n => [n.id, n]));
const edges = new Map(graph.edges.map(x => [x.id, x]));
const media = new Set(vm.runInContext('NeuroVisuals.items()', context).map(x => x.id));
for (const n of graph.nodes) {
  required(n, ['name', 'subtitle', 'summary'], n.id);
  assert(['Person', 'Lab', 'Company', 'Technology', 'Institution', 'Program'].includes(n.kind), `${n.id}: known kind`);
  assert(graph.edges.some(x => x.from === n.id || x.to === n.id), `${n.id}: no isolated graph entry`);
  if (n.href) route(n.href, n.id);
  if (n.aliases) { list(n.aliases, `${n.id} aliases`, false); n.aliases.forEach(h => route(h, n.id)); }
  if (n.media) assert(media.has(n.media), `${n.id}: existing credited visual ${n.media}`);
}
for (const x of graph.edges) {
  required(x, ['from', 'to', 'label', 'date', 'detail'], x.id);
  assert(nodes.has(x.from) && nodes.has(x.to), `${x.id}: known endpoints`);
  assert.notEqual(x.from, x.to, `${x.id}: distinct endpoints`);
  assert(['people', 'technology', 'translation'].includes(x.category), `${x.id}: known relationship category`);
  assert(['documented', 'comparison'].includes(x.basis), `${x.id}: explicit evidence basis`);
  sources(x.sources, x.id);
  if (x.basis === 'comparison') {
    assert.equal(x.category, 'technology', `${x.id}: comparison is technical`);
    assert.notEqual(x.directed, true, `${x.id}: comparison does not claim direction`);
    assert(!/\b(?:co-?founded|mentored|trained with|licensed from|spun out|successor of|descended from)\b/i.test(x.label), `${x.id}: comparison label does not claim descent`);
  }
}
// Legacy curated trails remain exportable even though the new UI uses dossiers.
if (graph.stories) {
  collection(graph.stories, 'Story trails', false);
  for (const s of graph.stories) {
    required(s, ['title', 'deck', 'focus'], s.id);
    list(s.trail, `${s.id} trail`); list(s.edges, `${s.id} edges`);
    unique(s.trail, `${s.id} trail`); unique(s.edges, `${s.id} edges`);
    assert(s.trail.includes(s.focus), `${s.id}: focus belongs to trail`);
    s.trail.forEach(id => assert(nodes.has(id), `${s.id}: known trail node ${id}`));
    const selected = s.edges.map(id => { assert(edges.has(id), `${s.id}: known edge ${id}`); return edges.get(id); });
    selected.forEach(x => assert(s.trail.includes(x.from) && s.trail.includes(x.to), `${s.id}: endpoints belong to trail`));
    const reached = new Set([s.focus]);
    for (let size = -1; size !== reached.size;) {
      size = reached.size;
      selected.forEach(x => { if (reached.has(x.from) || reached.has(x.to)) { reached.add(x.from); reached.add(x.to); } });
    }
    assert(s.trail.every(id => reached.has(id)), `${s.id}: trail is connected`);
  }
}
collection(origins.companies, 'Company dossiers'); collection(origins.inventory, 'Coverage inventory'); collection(origins.families, 'Technology families');
const companies = new Map(origins.companies.map(c => [c.id, c]));
const inventory = new Map(origins.inventory.map(c => [c.id, c]));
const families = new Map(origins.families.map(f => [f.id, f]));
unique(origins.companies.map(c => c.nodeId), 'Company graph mappings');
for (const f of origins.families) required(f, ['name', 'description'], f.id);
for (const c of origins.inventory) { required(c, ['name', 'scope', 'url'], c.id); secureUrl(c.url, c.id); }
function refs(ids, map, label) {
  list(ids, label, false); unique(ids, label);
  ids.forEach(id => assert(map.has(id), `${label}: known reference ${id}`));
}
for (const c of origins.companies) {
  required(c, ['nodeId', 'name', 'family', 'summary'], c.id);
  assert(inventory.has(c.id), `${c.id}: appears in coverage inventory`);
  assert.equal(nodes.get(c.nodeId)?.kind, 'Company', `${c.id}: mapped company node`);
  assert(families.has(c.family), `${c.id}: known technology family`);
  refs(c.edgeIds, edges, `${c.id} dossier edges`); assert(c.edgeIds.length, `${c.id}: documented relationships`);
  assert.equal(c.stages?.length, 3, `${c.id}: research roots, translation and interface stages`);
  list(c.timeline, `${c.id} timeline`); list(c.changes, `${c.id} engineering changes`); list(c.gaps, `${c.id} gaps`, false);
  c.gaps.forEach(gap => assert(typeof gap === 'string' && gap.trim(), `${c.id}: readable evidence gap`));
  if (c.sources) sources(c.sources, `${c.id} original sources`, false);
  for (const [kind, items] of [['stage', c.stages], ['milestone', c.timeline], ['change', c.changes]]) {
    for (const [i, item] of items.entries()) {
      const label = `${c.id} ${kind} ${i + 1}`;
      required(item, ['title', 'text', ...(kind === 'milestone' ? ['date'] : [])], label);
      refs(item.edges, edges, label);
      item.edges.forEach(id => assert(c.edgeIds.includes(id), `${label}: reference belongs to dossier edge list`));
      if (kind === 'stage') refs(item.nodes, nodes, `${label} nodes`);
      if (item.sources) sources(item.sources, `${label} sources`, false);
      assert(item.edges.length || item.sources?.length, `${label}: directly cited or linked source evidence`);
    }
  }
}
unique(bibliography.papers.map(p => p.doi), 'Bibliographic DOI records');
for (const paper of bibliography.papers) {
  required(paper, ['doi', 'title', 'url'], 'Bibliographic paper'); secureUrl(paper.url, paper.doi);
  assert(Number.isInteger(paper.year), `${paper.doi}: publication year`);
  list(paper.references, `${paper.doi} bibliographic references`, false);
}

// Verify graph selection independently of the renderer. Paths can traverse a
// documented relationship backwards, but each edge retains its source/object.
const allowed = comparisons => graph.edges.filter(x => comparisons || x.basis === 'documented');
function adjacency(comparisons) {
  const a = new Map(graph.nodes.map(n => [n.id, []]));
  for (const x of allowed(comparisons)) { a.get(x.from).push([x.to, x.id]); a.get(x.to).push([x.from, x.id]); }
  return a;
}
function distances(start, comparisons) {
  const a = adjacency(comparisons), result = new Map([[start, 0]]), queue = [start];
  for (let i = 0; i < queue.length; i++) for (const [next] of a.get(queue[i]) || []) if (!result.has(next)) { result.set(next, result.get(queue[i]) + 1); queue.push(next); }
  return result;
}
const sorted = values => [...values].sort();
let pathsChecked = 0;
function checkPath(from, to, comparisons) {
  const result = plain(network.shortest(from, to, comparisons)), distance = distances(from, comparisons).get(to);
  pathsChecked++;
  if (distance === undefined) { assert.equal(result, null, `${from}/${to}: disconnected path`); return; }
  assert(result, `${from}/${to}: reachable path exists`);
  assert.equal(result.edges.length, distance, `${from}/${to}: shortest number of steps`);
  assert.equal(result.nodes.length, result.edges.length + 1);
  assert.equal(result.nodes[0], from); assert.equal(result.nodes.at(-1), to);
  unique(result.nodes, 'Shortest path nodes'); unique(result.edges, 'Shortest path edges');
  result.edges.forEach((id, i) => {
    const x = edges.get(id), pair = result.nodes.slice(i, i + 2);
    assert(x && pair.includes(x.from) && pair.includes(x.to), `${id}: consecutive path endpoints`);
    assert(comparisons || x.basis === 'documented', `${id}: comparison requires opt-in`);
  });
}
for (const comparisons of [false, true]) {
  const params = new URLSearchParams(comparisons ? { comparisons: 'yes' } : {});
  const all = plain(network.subset('', params));
  assert.equal(all.mode, 'all'); assert.deepEqual(sorted(all.nodes), sorted(nodes.keys()));
  assert.deepEqual(sorted(all.edges), sorted(allowed(comparisons).map(x => x.id)));
  for (const n of graph.nodes) {
    const dist = distances(n.id, comparisons), near = new Set([...dist].filter(([, steps]) => steps <= 2).map(([id]) => id));
    const set = plain(network.subset(n.id, params));
    assert.equal(set.mode, 'nearby'); assert.deepEqual(sorted(set.nodes), sorted(near), `${n.id}: exact two-step neighborhood`);
    assert.deepEqual(sorted(set.edges), sorted(allowed(comparisons).filter(x => near.has(x.from) && near.has(x.to)).map(x => x.id)), `${n.id}: induced neighborhood relationships`);
    const full = plain(network.subset(n.id, new URLSearchParams({ ...Object.fromEntries(params), scope: 'all' })));
    assert.deepEqual(sorted(full.edges), sorted(all.edges), `${n.id}: whole-network scope`);
    const farthest = [...dist].sort((a, b) => b[1] - a[1])[0][0];
    checkPath(n.id, farthest, comparisons); checkPath(n.id, n.id, comparisons);
    const missing = graph.nodes.find(x => !dist.has(x.id)); if (missing) checkPath(n.id, missing.id, comparisons);
    const target = farthest;
    const pathSet = plain(network.subset(n.id, new URLSearchParams({ ...Object.fromEntries(params), to: target })));
    assert.equal(pathSet.mode, 'path'); assert.deepEqual(pathSet.path, plain(network.shortest(n.id, target, comparisons)));
    assert.deepEqual(pathSet.nodes, pathSet.path.nodes); assert.deepEqual(pathSet.edges, pathSet.path.edges);
  }
}
for (const x of graph.edges) { checkPath(x.from, x.to, false); checkPath(x.to, x.from, true); }
assert.equal(network.shortest('missing-node', graph.nodes[0].id), null, 'Unknown start has no path');
assert.equal(network.shortest(graph.nodes[0].id, 'missing-node'), null, 'Unknown destination has no path');
const elementData = plain(network.elements([...nodes.keys()], [...edges.keys()])).map(x => x.data);
unique(elementData.map(x => x.id), 'Cytoscape node/edge IDs share one namespace');
assert.equal(elementData.length, nodes.size + edges.size);
for (const x of graph.edges) {
  const el = elementData.find(v => v.edgeId === x.id);
  assert(el, `${x.id}: graph element`); assert.equal(el.source, x.from); assert.equal(el.target, x.to); assert.equal(el.basis, x.basis);
  assert.deepEqual(el.sources, x.sources, `${x.id}: exportable element retains its evidence`);
}

const attributes = html => Object.fromEntries([...html.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const tags = (html, tag = '[a-zA-Z][\\w:-]*') => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'g'))].map(m => attributes(m[1]));
const attrValues = (html, name) => tags(html).filter(a => a[name]).map(a => a[name]);
let rendered = 0;
const downloads = new Set();
function page(html, label) {
  rendered++;
  assert(!/\bNaN\b|\[object Object\]|>undefined</.test(html), `${label}: complete rendered values`);
  unique(attrValues(html, 'id'), `${label}: unique DOM IDs`);
  assert(!/<iframe\b/.test(html), `${label}: media does not autoplay`);
  for (const a of tags(html, 'a')) {
    assert(a.href, `${label}: link destination`);
    assert(!/^(?:javascript|data):/i.test(a.href), `${label}: safe link protocol`);
    if (a.target === '_blank') assert(/noopener/.test(a.rel || ''), `${label}: external link isolation`);
    if (a.href.startsWith('./')) downloads.add(a.href.split('?')[0]);
  }
  for (const id of attrValues(html, 'data-or-evidence')) assert(edges.has(id), `${label}: evidence button resolves`);
  for (const id of attrValues(html, 'data-or-network-edge')) assert(edges.has(id), `${label}: network evidence resolves`);
  return html;
}
function checkNetwork(id = '', params = new URLSearchParams()) {
  const html = page(network.render(id, params), `network/${id}/${params}`), set = plain(network.subset(id, params));
  assert.deepEqual(attrValues(html, 'data-or-network-edge'), set.edges, 'Readable list exactly matches graph/path subset and ordering');
  assert(html.includes('role="status"'), 'Network counts are announced');
  assert(html.includes('equivalent relationship list'), 'Canvas points to keyboard-readable alternative');
  for (const block of html.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const id = attrValues(block[1], 'data-or-network-edge')[0];
    if (id && edges.get(id).basis === 'comparison') assert(/technical comparison/i.test(block[1]), `${id}: readable list visibly labels comparison`);
  }
  return html;
}
page(api.render(), 'Default directory');
for (const view of ['origins', 'families', 'network', 'coverage']) {
  const html = page(api.render('', new URLSearchParams({ view })), view);
  assert(html.includes(`data-or-view="${view}"`), `${view}: route selects actual view`);
  assert.equal(tags(html, 'a').filter(x => x['aria-current'] === 'page').length, 1, `${view}: one active view tab`);
}
for (const c of origins.companies) {
  assert.equal(api.company(c.id).nodeId, c.nodeId); assert.equal(api.company(c.nodeId).id, c.id);
  for (const id of new Set([c.id, c.nodeId])) {
    const html = page(api.render(id), `company/${id}`);
    assert(html.includes('data-or-view="origins"') && html.includes(escape(c.name)), `${id}: company defaults to its origin story`);
    for (const item of [...c.stages, ...c.timeline, ...c.changes]) {
      assert(html.includes(escape(item.title)), `${id}: keep title ${item.title}`);
      assert(html.includes(escape(item.text)), `${id}: retain evidence narrative`);
    }
    c.gaps.forEach(gap => assert(html.includes(escape(gap)), `${id}: preserve uncertainty`));
    assert.equal(tags(html, 'article').filter(x => x.class === 'or-stage').length, 3, `${id}: three rendered stages`);
    const buttons = new Set(attrValues(html, 'data-or-evidence'));
    c.edgeIds.forEach(edge => assert(buttons.has(edge), `${id}: dossier relationship remains inspectable`));
  }
}
const cardIds = html => tags(html, 'a').filter(a => (a.class || '').split(' ').includes('or-company-card')).map(a => decodeURIComponent(a.href.split('/')[1].split('?')[0]));
for (const f of origins.families) {
  const html = page(api.render('', new URLSearchParams({ family: f.id })), `directory/${f.id}`);
  assert.deepEqual(sorted(cardIds(html)), sorted(origins.companies.filter(c => c.family === f.id).map(c => c.id)), `${f.id}: exact directory membership`);
}
assert(cardIds(api.render('', new URLSearchParams({q:'Michael I. Jordan'}))).includes('neuralink'), 'Company search includes people in referenced relationships');
const absentQuery = 'no-such-company-9d92bfa5';
assert.equal(cardIds(page(api.render('', new URLSearchParams({ q: absentQuery })), 'Empty query')).length, 0);
assert.equal(api.teaser('#unmapped-profile'), '', 'Unmapped profiles have no misleading teaser');
for (const n of graph.nodes) {
  checkNetwork(n.id); checkNetwork(n.id, new URLSearchParams({ comparisons: 'yes' }));
  if (n.href) {
    const teaser = page(api.teaser(n.href), `teaser/${n.id}`);
    assert(teaser.includes('cn-teaser'), `${n.id}: linked profile has a teaser`);
  }
}
checkNetwork('', new URLSearchParams({ comparisons: 'yes' }));
for (const x of graph.edges) {
  const html = page(evidence.evidence(x), `evidence/${x.id}`);
  assert(html.includes(escape(x.detail)), `${x.id}: complete evidence`);
  if (x.limit) assert(html.includes(escape(x.limit)), `${x.id}: preserve the evidence limit`);
  assert(html.includes(x.basis === 'comparison' ? 'TECHNICAL COMPARISON' : 'DOCUMENTED CONNECTION'));
}
const malicious = '<img src=x onerror=alert(1)>';
for (const view of ['origins', 'families', 'network', 'coverage', 'invalid']) {
  const html = page(api.render(malicious, new URLSearchParams({ view, q: malicious, family: malicious, to: malicious, edge: malicious })), `Invalid route/${view}`);
  assert(!html.includes('<img src=x') && !/<[^>]*\sonerror=/.test(html), 'Route/query text cannot inject HTML');
}
assert(api.render(malicious, new URLSearchParams({ view: 'origins' })).includes('Company history not found.'), 'Missing company returns not found');
const invalid = page(api.render('', new URLSearchParams({ view: 'invalid' })), 'Unknown view');
assert(invalid.includes('data-or-view="origins"'), 'Unknown view falls back to directory');
const records = plain(api.records()); unique(records.map(r => r.id), 'Search records');
assert.equal(records.length, nodes.size, 'Every graph entry is searchable');
for (const r of records) {
  required(r, ['id', 'title', 'description', 'kind', 'href'], r.id);
  const [path, query] = r.href.split('?'), id = decodeURIComponent(path.split('/')[1]), view = new URLSearchParams(query).get('view');
  assert(companies.has(id) || nodes.has(id), `${r.id}: searchable destination exists`);
  assert(['origins', 'network'].includes(view), `${r.id}: correct search route type`);
}
page(api.spotlight(), 'Overview spotlight');
for (const path of downloads) await access(new URL(path, root));

// Capture the real Cytoscape configuration without browser geometry. This
// verifies semantic arrow styles and data, not rendering pixels or SVG paths.
const controls = new Map();
const control = id => controls.get(id) || controls.set(id, { innerHTML: '', clientWidth: 800, clientHeight: 600, addEventListener() {}, querySelector() { return control('detail-button'); } }).get(id);
const container = { querySelector: control, querySelectorAll: () => [] };
let config, destroyed = 0;
context.cytoscape = options => {
  config = options;
  const style = { selector() { return this; }, style() { return this; }, update() {} };
  return { style: () => style, on() {}, destroy() { destroyed++; } };
};
network.bind(container, '', new URLSearchParams({ comparisons: 'yes' }), () => {}, () => {});
assert(config, 'Actual network controller initializes Cytoscape');
assert.deepEqual(plain(config.elements), plain(network.elements([...nodes.keys()], [...edges.keys()])), 'Renderer receives the exact selected graph');
const normalStyle = config.style.find(x => x.selector === 'edge').style;
const comparisonStyle = config.style.find(x => x.selector === 'edge[basis="comparison"]').style;
assert.equal(normalStyle['target-arrow-shape'], 'triangle', 'Documented edge arrow follows stored from/to');
assert.equal(comparisonStyle['target-arrow-shape'], 'none', 'Comparison has no target arrow');
assert.equal(comparisonStyle['line-style'], 'dashed', 'Comparison has a distinct line pattern');
assert(!comparisonStyle['source-arrow-shape'] || comparisonStyle['source-arrow-shape'] === 'none', 'Comparison has no reverse arrow');
network.close(); assert.equal(destroyed, 1, 'Leaving the network destroys its graph instance');

const index = await read('index.html');
const scripts = [...index.matchAll(/<script\b[^>]*\bsrc="([^"?]+)/g)].map(m => m[1]);
unique(scripts, 'Loaded script paths');
for (const [before, after] of [
  ['hub-utils', 'connections'], ['visuals-data', 'visuals'], ['visuals', 'origins'],
  ['connections-data', 'connections'], ['connections-data', 'connection-network'],
  ['connections', 'origins'], ['origins-data', 'connection-network'], ['origins-data', 'origins'],
  ['connection-network', 'origins'], ['origins', 'app'], ['origins', 'hub']
]) {
  const a = scripts.indexOf(`./dist/${before}.js`), b = scripts.indexOf(`./dist/${after}.js`);
  assert(a >= 0 && b >= 0 && a < b, `${before} loads before ${after}`);
}
const cytoscapeScript = scripts.findIndex(path => /cytoscape/i.test(path));
assert(cytoscapeScript >= 0 && cytoscapeScript < scripts.indexOf('./dist/connection-network.js'), 'Cytoscape library is loaded before network initialization');
assert(index.includes('data-route="connections"'), 'Connections is reachable from the workspace navigation');
console.log(`Origins checks passed: ${origins.companies.length} dossiers, ${origins.inventory.length} inventory entries, ${nodes.size} graph nodes, ${edges.size} relationships, ${pathsChecked} path cases, ${rendered} rendered states.`);
console.log('Passed: source integrity, three-stage evidence, directory membership, exact network subsets, shortest paths, undirected comparisons, safe routes, full narrative rendering, export links, search mappings, graph cleanup, and script order.');
