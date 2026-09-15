import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const data=JSON.parse(await read('data/company-status.json'));
const ctx=vm.createContext({URL,URLSearchParams});
for(const name of ['hub-utils','company-status-data','company-status'])vm.runInContext(await read(`dist/${name}.js`),ctx);
const api=vm.runInContext('NeuroStatus',ctx);
const app=await read('src/app.ts'),start=app.indexOf('var L = [')+8,end=app.indexOf('\n    ];',start)+6,atlas=vm.runInNewContext('('+app.slice(start,end)+')');
assert.equal(new Set(data.companies.map(c=>c.id)).size,data.companies.length);
for(const c of data.companies){
 assert(atlas.some(a=>a.id===c.id),c.id+' resolves to atlas');
 assert(c.checkedAt===data.reviewed);assert(c.headline&&c.summary&&c.scope);
 const ids=new Set(c.sources.map(s=>s.id));assert.equal(ids.size,c.sources.length);
 for(const refs of [c.headlineRefs,c.summaryRefs,c.scopeRefs,...c.facts.map(f=>f.refs)]){assert(refs.length);for(const ref of refs)assert(ids.has(ref));}
 for(const s of c.sources){assert(new URL(s.url).protocol==='https:');assert(s.checkedAt===data.reviewed);if(s.published)assert(s.published<=data.reviewed);assert(s.scope);}
 const html=api.render(c.id);assert(!/undefined|NaN/.test(html));assert(html.includes('HUMAN STUDIES'));for(const s of c.sources)assert(html.includes(s.url.replaceAll('&','&amp;')));
 if(c.registry){for(const s of c.registry.studies){assert.equal(s.sponsor,'Neuralink Corp');assert(s.statusUpdated<=data.reviewed);assert(['ACTUAL','ESTIMATED'].includes(s.enrollment.type));}assert.equal(c.registry.studies.length,6);}
}
assert.equal(api.render('not-a-company'),'');
const n=api.get('neuralink');assert(n.headline.includes('January 2024'));assert(n.facts.some(f=>f.title.includes('21 enrolled')));assert(n.facts.some(f=>f.text.includes('3,000')&&f.text.includes('does not establish')));
assert(api.get('precision-neuroscience').scope.includes('less than 30 days'));
assert(api.get('paradromics').summary.includes('14 September 2026'));
// Mutated fixture exercises public rendering boundaries, rather than trusting source text.
vm.runInContext(`neuroCompanyStatusData.companies[0].headline='<img src=x onerror=alert(1)>';neuroCompanyStatusData.companies[0].sources[0].url='javascript:alert(1)'`,ctx);
const hostile=api.render('neuralink');assert(!hostile.includes('<img src=x'));assert(!hostile.includes('href="javascript:'));
const index=await read('index.html');for(const [a,b] of [['hub-utils','company-status'],['company-status-data','company-status'],['company-status','app'],['company-status','ideas'],['company-status','origins']])assert(index.indexOf('dist/'+a+'.js')<index.indexOf('dist/'+b+'.js'));
for(const file of ['src/app.ts','src/ideas.ts','src/origins.ts'])assert((await read(file)).includes('NeuroStatus.render'));
console.log(`Company status checks passed: ${data.companies.length} clinical reviews, source references, registry scope, safe rendering and cross-route integration.`);
