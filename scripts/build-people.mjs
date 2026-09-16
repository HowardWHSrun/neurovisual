import {readFile, writeFile, mkdir} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const json = async path => JSON.parse(await read(path));
const snapshot = await json('data/people-metrics.json');
const links = await json('data/people-connections.json');
const extras = await json('data/people-profiles.json');
const graph = await json('data/connections.json');
const context = vm.createContext({URL, URLSearchParams});
vm.runInContext(ts.transpileModule(await read('src/researchers.ts'), {
  compilerOptions: {target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None}
}).outputText, context);
const researchers = vm.runInContext('researchers', context);
const corrections = [...links.affiliationCorrections, ...(extras.corrections || [])];
const metricById = new Map(snapshot.people.map(p => [p.id, p]));
const groupOverrides = {'takao-someya':'record', 'satrajit-ghosh':'compute', 'yaroslav-halchenko':'compute', 'peter-brown':'stimulate'};
const people = researchers.map(p => ({
  id: p.id, name: p.name, institution: p.institution, country: p.country,
  group: groupOverrides[p.id] || p.group, summary: p.summary, profileUrl: p.profileUrl,
  trailHref: '#person/' + p.id,
  connectionIds: links.researcherToConnectionNodes[p.id] || [],
  sources: [{title: p.name + ' — original profile', url: p.profileUrl}]
}));
for (const p of extras.people) {
  if (!people.some(x => x.id === p.id)) people.push(p);
}
for (const p of people) {
  const correction = corrections.find(x => x.researcherId === p.id);
  if (correction) {
    const c = correction.recommended;
    for (const key of ['name', 'institution', 'country', 'profileUrl']) {
      if (c[key]) p[key] = c[key];
    }
    p.status = c.careerStatus === 'deceased' ? 'Historical contributions' : c.careerStatus === 'emeritus' ? 'Emeritus' : '';
    if (c.careerStatus === 'deceased' || c.careerStatus === 'emeritus') p.affiliationNote = correction.reason;
    else if (c.institution) p.affiliationNote = 'Institutional context checked against the linked source on ' + correction.verified + '.';
    p.sources.push(...correction.sources);
  }
  const mapped = graph.nodes.filter(n => n.kind === 'Person' && n.researcherId === p.id).map(n => n.id);
  p.connectionIds = [...new Set([...p.connectionIds, ...mapped])];
  p.affiliations = graph.edges.filter(x => x.relationshipType === 'affiliation' && p.connectionIds.includes(x.from)).map(x => {
    const org = graph.nodes.find(n => n.id === x.to);
    return {edgeId:x.id,nodeId:x.from,organizationId:org.id,organizationName:org.name,country:org.country || '',role:x.role,status:x.affiliationStatus,reviewed:x.reviewed,sources:x.sources};
  });
  if (p.affiliations.length) {
    const active = p.affiliations.filter(a => a.status !== 'historical');
    if (active.length) {
      p.institution = [...new Set(active.map(a => a.organizationName))].join(' / ');
      p.country = [...new Set(active.map(a => a.country).filter(Boolean))].join(' / ');
      p.status = active.every(a => a.status === 'emeritus') ? 'Emeritus' : '';
      p.affiliationNote = 'Roles checked against original institutional sources on ' + active.map(a => a.reviewed).sort().at(-1) + '.';
      p.profileUrl = active[0].sources[0].url;
    }
    p.sources.push(...p.affiliations.flatMap(a => a.sources));
  }
  p.sources = p.sources.filter((s, i, a) => a.findIndex(t => t.url === s.url) === i);
  p.metric = metricById.get(p.id);
}
const data = {
  reviewed: snapshot.retrieved,
  recentYears: [2023, 2024, 2025],
  method: {
    version: 'Research influence index v1; publication-year cohorts; editorial weights.',
    weights: {citations: .5, hIndex: .3, recentCitations: .2}
  },
  coverage: {researcherTrails: researchers.length, connectionPeople: people.filter(p => p.connectionIds.length).length,
    matched: people.filter(p => p.metric?.identity.status === 'verified').length},
  people
};
const emitted = 'var neuroPeopleData = ' + JSON.stringify(data).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
await writeFile(new URL('dist/people-data.js', root), emitted);

// Use the same pure ranking module for the site and its downloadable snapshot.
vm.runInContext(await read('dist/hub-utils.js'), context);
vm.runInContext(emitted, context);
vm.runInContext(ts.transpileModule(await read('src/people.ts'), {
  compilerOptions: {target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None}
}).outputText, context);
const api = vm.runInContext('NeuroPeople', context);
const escape = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
const rows = [['atlas_rank', 'id', 'name', 'institution', 'research_area', 'research_influence_index', 'citations', 'h_index',
  'citations_to_2023_2025_publications', 'indexed_works', 'identity_status', 'openalex_author', 'profile_source', 'snapshot_date']];
for (const p of api.scored.slice().sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name))) {
  const m = p.metric?.identity.status === 'verified' ? p.metric.metrics : {};
  rows.push([api.rank(p), p.id, p.name, p.institution, p.group, p.score, m?.citations, m?.hIndex, m?.recentCitations,
    m?.works, p.metric?.identity.status || 'unresolved', p.metric?.openalexId, p.profileUrl, data.reviewed]);
}
await mkdir(new URL('downloads/', root), {recursive: true});
await writeFile(new URL('downloads/people-influence.csv', root), rows.map(row => row.map(escape).join(',')).join('\n') + '\n');
console.log(`People: ${people.length} profiles; ${api.cohort.length} matched authors ranked; ${data.coverage.connectionPeople} people with documented graph identities.`);
