import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const context = vm.createContext({URL, URLSearchParams});
for (const name of ['hub-utils', 'connections-data', 'people-data', 'people']) {
  vm.runInContext(await read(`dist/${name}.js`), context);
}
const api = vm.runInContext('NeuroPeople', context);
const data = vm.runInContext('neuroPeopleData', context);
assert(data.people.length >= 100, 'At least 100 people');
assert(api.cohort.length >= 100, 'At least 100 matched authors with complete ranking metrics');
assert.equal(new Set(data.people.map(p => p.id)).size, data.people.length, 'Unique people');
assert.equal(new Set(api.cohort.map(p => p.metric.openalexId)).size, api.cohort.length, 'Do not rank one author identity twice');
assert.deepEqual(Array.from(data.recentYears), [2023, 2024, 2025]);
assert.equal(api.percentile([0, 10, 10, 30], 10), 50, 'Average percentile for ties');
assert.equal(api.percentile([0, 10, 10, 30], 0), 0, 'A verified zero is a real observation');
assert.equal(api.percentile([12], 12), 50, 'A singleton cannot imply a high or low position');
for (const p of api.scored) {
  assert(p.sources.length && p.sources.every(s => /^https?:\/\//.test(s.url)), `Profile evidence: ${p.id}`);
  const html = api.render(p.id);
  assert(!/NaN|undefined|width:null/.test(html), `Safe profile: ${p.id}`);
  assert(html.includes('Where their work connects'));
  if (p.score === null) {
    assert.equal(api.rank(p), null, 'Unverified or incomplete records have no numeric rank');
    assert(html.includes('Unranked'));
    continue;
  }
  assert(p.score >= 0 && p.score <= 100 && Number.isFinite(p.score));
  assert.equal(p.metric.identity.status, 'verified');
  assert(p.metric.openalexId && p.metric.papers.length, `Identity and paper evidence: ${p.id}`);
  const m = p.metric.metrics;
  const independentlyComputed = Object.entries(data.method.weights).reduce((sum, [key, weight]) => {
    const ordered = api.cohort.map(x => x.metric.metrics[key]).sort((a, b) => a - b);
    const first = ordered.indexOf(m[key]), last = ordered.lastIndexOf(m[key]);
    return sum + weight * (first + last) / 2 / (ordered.length - 1) * 100;
  }, 0);
  assert.equal(p.score, Math.round(independentlyComputed * 10) / 10, `Reproduce index: ${p.id}`);
  const recent = p.metric.countsByYear.filter(x => data.recentYears.includes(x.year)).reduce((n, y) => n + y.citations, 0);
  assert.equal(m.recentCitations, recent, `Recent counts use publication-year bins: ${p.id}`);
}
const ranked = api.viewState(new URLSearchParams()).filtered;
assert.equal(ranked.length, api.cohort.length);
assert(ranked.every((p, i) => !i || ranked[i - 1].score >= p.score));
const one = api.viewState(new URLSearchParams({q: ranked[ranked.length - 1].name}));
assert.equal(api.rank(one.filtered.find(p => p.id === ranked[ranked.length - 1].id)), api.rank(ranked[ranked.length - 1]), 'Filters retain cohort ranks');
assert.equal(api.viewState(new URLSearchParams({page: '-4'})).page, 1);
assert.equal(api.viewState(new URLSearchParams({page: '9999'})).page, Math.ceil(api.cohort.length / 25));
assert(api.render('', new URLSearchParams({q: 'zzzznotaresearcher'})).includes('No people match'));
assert(api.render('', new URLSearchParams({view: 'method'})).includes('editorial choice'));
assert(api.render('', new URLSearchParams({view: 'method'})).includes('published in 2023–2025'));
assert(api.render('', new URLSearchParams({view: 'compare', a: ranked[0].id, b: ranked[0].id})).includes('same person'));
assert(api.render('not-a-person').includes('Person not found'));
assert(api.render('',new URLSearchParams({page:'2'})).includes('?page=2'), 'Profile links preserve the current result page');
assert(!api.render('',new URLSearchParams({view:'method',example:'timothy-brown'})).includes('— + — + —'), 'Unranked authors never become a fake calculation example');
const originalName = api.scored[0].name;
api.scored[0].name = '<script>alert(1)</script>';
assert(!api.render(api.scored[0].id).includes('<script>'));
api.scored[0].name = originalName;
const csv = await read('downloads/people-influence.csv');
assert.equal(csv.trim().split('\n').length, data.people.length + 1);
assert(csv.includes('citations_to_2023_2025_publications'));
const index = await read('index.html');
assert(index.includes('data-route="people"'));
for (const [a, b] of [['people-data', 'people'], ['people', 'hub'], ['connections-data', 'people']]) {
  assert(index.indexOf(`./dist/${a}.js`) < index.indexOf(`./dist/${b}.js`), `Load ${a} before ${b}`);
}
console.log(`People checks passed: ${data.people.length} sourced profiles; ${api.cohort.length} identity-matched ranked authors; reproducible index, ties, missing data, filters, rendered profiles and CSV.`);
