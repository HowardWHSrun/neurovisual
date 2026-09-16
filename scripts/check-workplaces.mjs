import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url), read = path => readFile(new URL(path, root), 'utf8');
const context = vm.createContext({URL, URLSearchParams});
for (const name of ['hub-utils', 'connections-data', 'people-data', 'people', 'people-workplaces']) {
  vm.runInContext(await read(`dist/${name}.js`), context, {filename:`dist/${name}.js`});
}
const api = vm.runInContext('PeopleWorkplaces', context), peopleApi = vm.runInContext('NeuroPeople', context);
const data = vm.runInContext('neuroPeopleData', context), graph = vm.runInContext('neuroConnectionsData', context);
const escape = vm.runInContext('hubUtils.escapeHtml', context);
const plain = value => JSON.parse(JSON.stringify(value)), ids = values => Array.from(values, value => value.id);
const sorted = values => [...values].sort(), params = values => new URLSearchParams({by:'people', ...values});
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const attributes = (html, name) => [...html.matchAll(new RegExp(`\\b${name}="([^"]*)"`, 'g'))].map(match => decode(match[1]));
const hrefs = html => attributes(html, 'href'), route = href => new URLSearchParams(href.split('?')[1]);
const nodes = new Map(graph.nodes.map(node => [node.id,node])), edges = new Map(graph.edges.map(edge => [edge.id,edge]));
const canonical = JSON.parse(await read('data/connections.json'));
const canonicalNodes = new Map(canonical.nodes.map(node => [node.id,node]));
const sourcedEdges = canonical.edges.filter(edge => edge.relationshipType === 'affiliation');
const sourceIds = [...new Set(sourcedEdges.map(edge => canonicalNodes.get(edge.from).researcherId))];
assert(sourceIds.every(Boolean), 'Every checked role resolves to a directory researcher identity');
assert(sourceIds.length >= 50, 'The checked cohort meaningfully expands the people map');
const initial = api.state(params()), checked = initial.all;
assert.deepEqual(sorted(ids(checked)), sorted(sourceIds), 'Every sourced researcher appears in the workplace directory');
assert(checked.length < data.people.length, 'The checked subset is kept distinct from all researcher profiles');

let affiliationCount = 0;
for (const personId of sourceIds) {
    const person = checked.find(person => person.id === personId);
    assert(person, `Researcher resolves: ${personId}`);
    const records = sourcedEdges.filter(edge => canonicalNodes.get(edge.from).researcherId === personId);
    assert.equal(person.affiliations.length, records.length, `No dropped or invented roles: ${person.id}`);
    for (const affiliation of person.affiliations) {
      affiliationCount++;
      assert(affiliation.role?.trim(), `Role is stated: ${person.id}`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(affiliation.reviewed), `Explicit review date: ${person.id}`);
      assert(['current','emeritus','historical'].includes(affiliation.status), `Explicit role status: ${person.id}`);
      assert(affiliation.sources.length && affiliation.sources.every(item => item.title && /^https:\/\//.test(item.url)), `Original source links: ${person.id}`);
      const edge = edges.get(affiliation.edgeId), organization = nodes.get(affiliation.organizationId);
      assert(edge, `Affiliation has a graph edge: ${person.id}`);
      assert.equal(edge.relationshipType, 'affiliation');
      assert.equal(edge.from, affiliation.nodeId); assert.equal(edge.to, affiliation.organizationId);
      assert.equal(nodes.get(edge.from)?.kind, 'Person');
      assert(['Institution','Company','Lab'].includes(organization?.kind), 'A workplace connection leads to an organization');
      assert.equal(edge.affiliationStatus, affiliation.status); assert.equal(edge.role, affiliation.role);
      assert.equal(edge.reviewed, affiliation.reviewed); assert.equal(edge.basis, 'documented');
      assert.deepEqual(plain(edge), records.find(record => record.id === edge.id), 'Compiled evidence matches the canonical graph');
      assert(person.connectionIds.includes(edge.from), 'Directory and graph use the same person identity');
      assert.equal(organization.name, affiliation.organizationName);
      assert.deepEqual(plain(edge.sources), plain(affiliation.sources), 'The graph preserves the role evidence');
    }
}
const affiliationEdges = graph.edges.filter(edge => edge.relationshipType === 'affiliation');
assert.equal(affiliationEdges.length, affiliationCount, 'Every affiliation edge belongs to one checked researcher');
assert(affiliationEdges.every(edge => nodes.get(edge.from).kind === 'Person' && nodes.get(edge.to).kind !== 'Person'), 'Shared workplaces never generate person-to-person relationships');
const emeritus = checked.flatMap(person => person.affiliations.filter(a => a.status === 'emeritus').map(a => ({person, affiliation:a})));
assert(emeritus.length >= 2, 'Known emeritus appointments are retained');
for (const {person,affiliation} of emeritus) {
  const html = api.render(params({q:person.name}));
  assert(html.includes('class="pw-status">Emeritus'), `Emeritus remains visible: ${person.id}`);
  assert.equal(edges.get(affiliation.edgeId).affiliationStatus, 'emeritus');
}

// Filtering is checked against the dated roles, without assigning a direct
// collaboration merely because two people share an organization.
for (const organization of initial.organizations) {
  const state = api.state(params({workplace:organization.id}));
  const expected = checked.filter(person => person.affiliations.some(a => a.organizationId === organization.id));
  assert.deepEqual(sorted(ids(state.filtered)), sorted(ids(expected)), `Exact workplace cohort: ${organization.id}`);
  for (const group of new Set(expected.map(person => person.group))) {
    assert.deepEqual(sorted(ids(api.state(params({workplace:organization.id,area:group})).filtered)), sorted(ids(expected.filter(person => person.group === group))), 'Workplace and research-area filters intersect');
  }
}
for (const group of new Set(checked.map(person => person.group))) assert(api.state(params({area:group})).filtered.every(person => person.group === group));
for (const [query,id] of [['Gyorgy Buzsaki','gyorgy-buzsaki'],['györgy buzsáki','gyorgy-buzsaki']]) assert(ids(api.state(params({q:query})).filtered).includes(id), `Accent-insensitive name search: ${query}`);
assert.equal(api.state(params({q:'Frank'})).filtered[0].id,'frank-willett','Name matches precede incidental matches in endowed role titles');
const unmatch = api.state(params({q:'qzxj no such researcher',page:'999'}));
assert.equal(unmatch.filtered.length,0); assert.equal(unmatch.pages,1); assert.equal(unmatch.page,1);
assert(api.render(params({q:'qzxj no such researcher'})).includes('No researchers match.'));
assert.equal(api.state(params({workplace:'missing-organization'})).filtered.length,0);
assert.equal(api.state(params({area:'missing-area'})).filtered.length,0);

const expectedInfluence = [...checked].sort((a,b) => (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name));
assert.deepEqual(ids(initial.filtered), ids(expectedInfluence), 'Publication influence uses the existing score with unranked people last');
assert.deepEqual(ids(api.state(params({sort:'name'})).filtered), ids([...checked].sort((a,b) => a.name.localeCompare(b.name))), 'Name sorting is alphabetical');
assert.equal(api.state(params({sort:'unknown'})).sort,'influence');
assert.equal(initial.shown.length,12); assert.equal(initial.pages,Math.ceil(checked.length/12));
const paged = [];
for (let page=1; page<=initial.pages; page++) paged.push(...ids(api.state(params({page:String(page)})).shown));
assert.deepEqual(paged,ids(initial.filtered),'Pagination covers the cohort once in order');
for (const input of ['-1','0','not-a-number','-Infinity','']) assert.equal(api.state(params({page:input})).page,1,`Invalid lower page: ${input}`);
for (const input of ['999999','Infinity']) assert.equal(api.state(params({page:input})).page,initial.pages,`Upper page clamp: ${input}`);
assert.equal(api.state(params({page:'2.8'})).page,2,'Fractional pages resolve to a whole page');

function safeHtml(html) {
  assert(!/\bundefined\b|\bNaN\b/.test(html),'Rendered values are complete');
  const found = attributes(html,'id'); assert.equal(new Set(found).size,found.length,'Rendered IDs are unique');
  for (const href of hrefs(html)) assert(href.startsWith('#') || /^https?:$/.test(new URL(href).protocol), `Safe link: ${href}`);
  return html;
}
for (const person of checked) {
  const html = safeHtml(api.render(params({q:person.name}))), links = hrefs(html);
  assert(html.includes(`data-researcher="${person.id}"`)); assert(links.includes(`#people/${person.id}`),'Name opens the full researcher profile');
  const personMap = route(api.mapLink(person.affiliations[0].nodeId,true));
  assert.equal(personMap.get('view'),'map'); assert.equal(personMap.get('relation'),'affiliation');
  assert.equal(personMap.get('focus'),person.affiliations[0].nodeId); assert.equal(personMap.get('node'),person.affiliations[0].nodeId);
  assert(links.includes(api.mapLink(person.affiliations[0].nodeId,true)), 'Person map link is rendered');
  for (const affiliation of person.affiliations) {
    const link = api.mapLink(affiliation.organizationId), query = route(link);
    assert(links.includes(link),'Organization opens its neighborhood');
    assert.equal(query.get('focus'),affiliation.organizationId); assert.equal(query.get('relation'),'affiliation'); assert.equal(query.get('depth'),'1');
    assert(html.includes(escape(affiliation.role))); assert(html.includes(escape(affiliation.reviewed)));
    assert(links.includes(new URL(affiliation.sources[0].url).href),'The checked role source is available immediately');
    assert.equal(api.directory(query),false,'Organization and person deep links open the map');
  }
}
assert.equal(api.directory(params()),true); assert.equal(api.directory(params({view:'people',focus:'stanford'})),true);
for (const key of ['focus','node','edge','relation','overview']) assert.equal(api.directory(params({[key]:'anything'})),false);
assert.equal(api.directory(params({view:'map'})),false);
assert(safeHtml(api.render(params())).includes('Mentorship, collaboration, and company formation appear only when separately documented.'),'Shared-workplace scope is explained');
const pageLinks = hrefs(api.render(params({page:'2',sort:'name',q:'',view:'people'}))).filter(href => route(href).has('page'));
assert(pageLinks.length >= 1); for (const link of pageLinks) { assert.equal(route(link).get('sort'),'name'); assert.equal(route(link).get('view'),'people'); }

// Data text and query strings must not become HTML or executable source URLs.
const person = checked[0], affiliation = person.affiliations[0], original = {name:person.name, organizationName:affiliation.organizationName, role:affiliation.role, sources:affiliation.sources};
try {
  person.name='<script>workplace-test</script>'; affiliation.organizationName='<img src=x onerror="alert(1)">'; affiliation.role='<unsafe> & role'; affiliation.sources=[{title:'Unsafe',url:'javascript:alert(1)'}];
  const html = safeHtml(api.render(params({q:'workplace-test'})));
  for (const value of [person.name,affiliation.organizationName,affiliation.role]) assert(html.includes(escape(value)));
  assert(!html.includes('<script>workplace-test') && !html.includes('<img src=x') && !html.includes('href="javascript:'));
  assert(api.render(params({q:'" autofocus onfocus="alert(1)'})).includes('value="&quot; autofocus onfocus=&quot;alert(1)"'));
} finally {person.name=original.name; Object.assign(affiliation,{organizationName:original.organizationName,role:original.role,sources:original.sources});}

const index=await read('index.html');
for (const [before,after] of [['people','people-workplaces'],['people-workplaces','explore'],['people-data','people-workplaces']]) assert(index.indexOf(`./dist/${before}.js`)<index.indexOf(`./dist/${after}.js`),`${before} loads before ${after}`);
console.log(`Workplace checks passed: ${checked.length} researchers, ${affiliationCount} sourced roles, ${initial.organizations.length} workplaces; filters, sorting, pagination, status labels, deep links, evidence, and HTML safety.`);
