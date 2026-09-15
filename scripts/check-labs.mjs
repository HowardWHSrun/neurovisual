import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const data=JSON.parse(await read('data/labs.json'));
const ctx=vm.createContext({URL,URLSearchParams,console});
for(const file of ['hub-utils','hub-data','hub-guides','ideas-data','company-media','labs-data','visuals-data','visuals','connections-data','connections','origins-data','connection-network','origins','field-visuals','labs'])vm.runInContext(await read('dist/'+file+'.js'),ctx);
const api=vm.runInContext('NeuroLabs',ctx);
assert.equal(JSON.stringify(vm.runInContext('neuroLabsData',ctx)),JSON.stringify(data));
assert(data.labs.length>=60,'Substantive detailed coverage');
assert(new Set(data.labs.map(l=>l.region)).size>=7,'Coverage across all represented regions');
const ids=new Set(data.labs.map(l=>l.id));assert.equal(ids.size,data.labs.length);
const app=await read('src/app.ts'),start=app.indexOf('var L = [')+8,end=app.indexOf('\n    ];',start)+6;
const atlas=vm.runInNewContext('('+app.slice(start,end)+')');
for(const l of data.labs){
 assert(/^[a-z0-9-]+$/.test(l.id));assert(l.projects.length>=2);assert(l.sources.length>=2);assert(l.methods.length>=2);assert(l.leaders.length);assert(l.signals.length);
 for(const t of l.themes)assert(api.themes.includes(t),l.id+': invalid theme');
 const refs=new Set(l.sources.map(s=>s.id));assert.equal(refs.size,l.sources.length);
 for(const group of [l.overviewRefs,l.scale.refs,l.translation.refs,...l.projects.map(p=>p.refs)]){assert(group.length);for(const id of group)assert(refs.has(id),l.id+': missing '+id);}
 assert.equal(l.verified,data.reviewed);
 assert(l.audit,l.id+': missing website review');assert(['reviewed','partial'].includes(l.audit.status));assert(l.audit.summary&&l.audit.changes.length&&l.audit.pages.length);
 const auditUrls=new Set(l.audit.pages.map(p=>p.url));
 for(const p of l.audit.pages){assert(new URL(p.url));assert(p.title&&p.supports);assert.equal(p.checkedAt,data.reviewed);assert(['read','abstract-only','unavailable'].includes(p.status));}
 if(l.audit.latest){assert(l.audit.latest.title&&l.audit.latest.date);assert(l.audit.latest.date<=data.reviewed);assert(auditUrls.has(l.audit.latest.url),l.id+': latest source must have been checked');}
 for(const source of l.sources){assert(source.review,l.id+': source access scope missing');assert(auditUrls.has(source.url),l.id+': retained source absent from page review');assert.equal(source.review.checkedAt,data.reviewed);assert(['read','abstract-only','unavailable'].includes(source.review.status));assert(source.review.note);}
 for(const group of [l.overviewRefs,l.scale.refs,l.translation.refs,...l.projects.map(p=>p.refs)])assert(group.some(id=>l.sources.find(s=>s.id===id).review.status!=='unavailable'),l.id+': claim has no accessible supporting source');

 for(const s of l.sources){assert(['https:','http:'].includes(new URL(s.url).protocol));assert(s.title.trim());if(s.published){assert(/^\d{4}(-\d{2})?(-\d{2})?$/.test(s.published),l.id+' '+s.published);assert(s.published<=data.reviewed);}}
 for(const id of l.atlasIds)assert(atlas.some(a=>a.id===id),l.id+': unknown atlas '+id);
 const html=api.render(l.id);assert(html.includes(l.name.replaceAll('&','&amp;')));assert(!/\bundefined\b|\bNaN\b/.test(html));assert.equal((html.match(/class="lab-stage"/g)||[]).length,l.projects.length);
 assert(html.includes('What the source review found'));assert(html.includes('Newest dated source found'));if(l.audit.status==='partial')assert(html.includes('Review has unresolved gaps'));assert(html.includes('EDITORIAL QUESTION'));assert(html.includes('STUDY CONTEXT'));
 for(const s of l.sources)assert(html.includes(s.url.replaceAll('&','&amp;')),'Source link missing '+l.id);
 const domIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(domIds).size,domIds.length);
}
assert.equal(api.records().length,data.labs.length);
assert(api.render('toronto-rel').includes('Target, intervene, measure'),'Rehabilitation stimulation profile gets an intervention diagram');
assert(api.selection(new URLSearchParams('q=hydroMEA')).some(l=>l.id==='rice-tringides'));
assert.equal(api.selection(new URLSearchParams('q=zzzzzz-no-lab')).length,0);
assert.equal(api.selection(new URLSearchParams({school:'Rice University'})).length,8);
for(const region of new Set(data.labs.map(l=>l.region))){const selected=api.selection(new URLSearchParams({region}));assert(selected.length);assert(selected.every(l=>l.region===region));}
for(const theme of api.themes){const selected=api.selection(new URLSearchParams({theme}));assert(selected.length);assert(selected.every(l=>l.themes.includes(theme)));}
const htmls=['','view=schools','view=progress','view=coverage','page=2','page=9999','page=-5','page=NaN','q=%3Cimg%20src=x%20onerror=alert(1)%3E'].map(q=>api.render('',new URLSearchParams(q)));
for(const html of htmls){assert(!/<img src=x/.test(html));assert(!/\bundefined\b|\bNaN\b/.test(html));}
assert(api.render('missing').includes('not found'));
assert(api.teaser('mcgovern').includes('Anikeeva')&&api.teaser('mcgovern').includes('Boyden'),'Many labs may link to one center');
for(const s of data.schools){assert(new URL(s.url));assert(s.institution&&s.detail&&s.title&&s.region);assert(s.review&&s.review.note);assert(['read','abstract-only','unavailable'].includes(s.review.status));assert.equal(s.review.checkedAt,data.reviewed);}
const index=await read('index.html');assert(index.includes('data-route="labs"'));
for(const [before,after] of [['labs-data','labs'],['labs','app'],['app','hub']])assert(index.indexOf(`dist/${before}.js`)<index.indexOf(`dist/${after}.js`));
const dossier=await read('downloads/lab-research/research-directory.md');for(const l of data.labs)assert(dossier.includes('## '+l.name));
console.log(`Labs checks passed: ${data.labs.length} profiles, references, atlas relationships, filters, all views, and downloadable dossier.`);

// Exercise composition and native-control updates independently of browser layout.
const eventNode=()=>({events:{},addEventListener(k,fn){this.events[k]=fn;}});
const form=eventNode(),query=eventNode(),updates=[];
ctx.FormData=class {forEach(fn){for(const [k,v] of [['q','神经'],['region','Asia'],['school','']])fn(v,k);}};
const container={querySelector:s=>s==='#lab-filters'?form:s==='#lab-query'?query:null,querySelectorAll:()=>[]};
api.bind(container,'',new URLSearchParams('page=2&theme=Neural+interfaces'),hash=>updates.push(hash));
query.events.compositionstart();query.events.input({isComposing:true});query.events.input({isComposing:false});assert.equal(updates.length,0,'Do not destroy an active IME input');
query.events.compositionend();assert.equal(updates.length,1);assert(updates[0].includes('region=Asia'));assert(!updates[0].includes('page='));assert(updates[0].includes('theme=Neural+interfaces'));
form.events.change({target:{tagName:'INPUT'}});assert.equal(updates.length,1,'Ignore search blur change after input rerender');
form.events.change({target:{tagName:'SELECT'}});assert.equal(updates.length,2);
const schoolsHtml=api.render('',new URLSearchParams('view=schools'));for(const s of data.schools)assert(schoolsHtml.includes('value="'+s.institution.replaceAll('&','&amp;')+'"'),'Discovery institutions must be selectable');
console.log('Labs control checks passed: IME composition, native selects, paging reset, and university-directory options.');
