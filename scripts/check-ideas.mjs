import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const ideas = JSON.parse(await read('data/ideas.json'));
const counts = JSON.parse(await read('data/neural-counts.json'));
const context = vm.createContext({URL, URLSearchParams});
for (const path of ['dist/hub-utils.js','dist/ideas-data.js','dist/ideas.js']) vm.runInContext(await read(path), context);
const api = vm.runInContext('NeuroIdeas', context);
assert.equal(JSON.stringify(vm.runInContext('neuroIdeasData', context)), JSON.stringify({...ideas, counts}), 'Rebuild after editing source data');
const atlas = await read('src/app.ts');
const atlasIds=new Set([...atlas.matchAll(/(?:["']?id["']?)\s*:\s*["']([^"']+)["']/g)].map(m=>m[1]));
for (const collection of [ideas.ideas, ideas.companies, counts.milestones]) {
  assert.equal(new Set(collection.map(x => x.id)).size, collection.length, 'Unique IDs');
  for (const x of collection) assert.match(x.id, /^[a-z0-9_-]+$/);
}
for (const idea of ideas.ideas) {
  for (const key of ['title','question','summary','observation','interpretation','test','revision','updated']) assert(idea[key], `${idea.id} missing ${key}`);
  assert(idea.sources.length && idea.history.length, 'Keep evidence and revision history');
  for (const id of idea.related) assert(ideas.ideas.some(x=>x.id===id), `Unknown related idea ${id}`);
  for (const org of idea.organizations) assert(atlasIds.has(org), `Unknown atlas organization ${org}`);
}
for (const c of ideas.companies) {
  for (const key of ['count','context','evidence','thought','bottleneck','question']) assert(c[key], `${c.id} missing ${key}`);
  if(c.org) { assert(atlasIds.has(c.org)); assert.equal(api.companyForOrg(c.org).id,c.id); }
}
for (const x of [...ideas.ideas,...ideas.companies]) for (const s of x.sources) { assert(s.title); assert.equal(new URL(s.url).protocol,'https:'); }
for (const r of counts.milestones) {
  assert(r.denominator && r.date_basis && r.evidence && r.subjects && r.note);
  assert(r.date <= counts.research_cutoff);
  assert.equal(new URL(r.source).protocol,'https:');
  for(const k of ['sites','simultaneous_channels']) assert(r[k]===null || Number.isInteger(r[k]) && r[k]>0);
}
const np1=counts.milestones.find(x=>x.id==='np1_2017'), ultra=counts.milestones.find(x=>x.id==='np_ultra_2025');
assert.equal(np1.simultaneous_channels,384); assert.equal(ultra.simultaneous_channels,384);
assert(Math.abs(8/Math.log2(ultra.sites/np1.sites)-2.98722375)<0.00001, 'Endpoint doubling arithmetic');
const downloadCounts=JSON.parse(await read('downloads/moores-law/data/milestones.json'));
assert.deepEqual(counts,downloadCounts,'Published evidence ledger matches downloadable analysis');

const pages = [api.render(''),api.render('missing')];
for(const idea of ideas.ideas) pages.push(api.render(idea.id));
for(const section of ['thought','counts','companies','evidence']) pages.push(api.render('moores-law-bci',new URLSearchParams({section})));
for(const company of ideas.companies) pages.push(api.render('moores-law-bci',new URLSearchParams({section:'companies',company:company.id})));
pages.push(api.render('moores-law-bci',new URLSearchParams({section:'counts',metric:'channels'})));
for(const html of pages) {
  assert(!/undefined|NaN/.test(html),'Render complete values');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]); assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/href="(\.\/[^"?]+)"/g)) await access(new URL(m[1],root));
}
assert.equal(api.records().length,ideas.ideas.length+ideas.companies.length);
const index=await read('index.html');
const scripts=[...index.matchAll(/<script defer src="([^"?]+)/g)].map(m=>m[1]);
for(const [a,b] of [['hub-utils','ideas'],['ideas-data','ideas'],['ideas','app'],['app','hub'],['i18n','app']]) assert(scripts.indexOf('./dist/'+a+'.js')<scripts.indexOf('./dist/'+b+'.js'));
assert(index.includes('data-route="ideas"'));
for(const key of ['purposeAll','operationAll','axisGuide1Text','axisGuide2Text','axisGuide3Text']) assert(index.includes('data-i18n="'+key+'"'),`Preserve atlas label ${key}`);

// Exercise the interaction controller with small element doubles. This is a
// unit test of URL/focus and arithmetic behavior, not browser or layout testing.
class Element {
  constructor(tag,attrs) { this.tag=tag; this.attrs=attrs; this.id=attrs.id; this.value=attrs.value||''; this.textContent=''; this.events={}; this.dataset={ideaParam:attrs['data-idea-param'],value:attrs['data-value']}; }
  addEventListener(type,fn){this.events[type]=fn;}
  focus(){focused=this.id;}
  checkValidity(){const n=Number(this.value);return this.value!=='' && Number.isInteger(n) && n>=Number(this.attrs.min||0) && n<=Number(this.attrs.max||Infinity);}
}
let focused='',lastUrl='';
class Container {
  set innerHTML(html){this.html=html;this.elements=[...html.matchAll(/<(button|input|select|output|strong)[\s]([^>]+)>/g)].map(m=>new Element(m[1],Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]]))));const bits=this.querySelector('#idea-budget-bits');if(bits)bits.value='16';}
  querySelector(s){return this.elements.find(x=>x.id===s.slice(1))||null;}
  querySelectorAll(s){return this.elements.filter(x=>s==='[data-idea-param]'?x.dataset.ideaParam:s==='input,select'?['input','select'].includes(x.tag):false);}
}
const container=new Container();
context.document={getElementById:id=>container.querySelector('#'+id)};
context.history={replaceState:(_a,_b,url)=>{lastUrl=url;}};
function mount(id,params=new URLSearchParams()){container.innerHTML=api.render(id,params);api.bind(container,id,params);}
mount('moores-law-bci');
container.querySelector('#idea-section-counts').events.click();
assert(lastUrl.includes('section=counts')); assert.equal(focused,'idea-section-counts');
container.querySelector('#idea-channels').events.click();
assert(lastUrl.includes('metric=channels')); assert.equal(focused,'idea-channels');
const slider=container.querySelector('#idea-doubling');slider.value='6';slider.events.input();
assert.equal(container.querySelector('#idea-growth').textContent,'4.00×');
mount('moores-law-bci',new URLSearchParams({section:'companies'}));
container.querySelector('#idea-company-bisc').events.click();assert(lastUrl.includes('company=bisc'));assert(container.html.includes('65,536'));
mount('readout-budget');
assert.equal(container.querySelector('#idea-budget-result').textContent,'491.52 Mb/s · 221.18 GB/hour');
container.querySelector('#idea-budget-channels').value='2048';container.querySelector('#idea-budget-channels').events.input();
assert.equal(container.querySelector('#idea-budget-result').textContent,'983.04 Mb/s · 442.37 GB/hour');
container.querySelector('#idea-budget-channels').value='';container.querySelector('#idea-budget-channels').events.input();
assert(container.querySelector('#idea-budget-result').textContent.startsWith('Enter positive'));

// Run the actual hub router against lightweight shell elements to check that
// notebook routes and search coexist with the retained atlas adapter.
const hubContext=vm.createContext({URL,URLSearchParams,document:{readyState:'loading',documentElement:{setAttribute(){}},addEventListener(){}}});
for(const path of ['dist/i18n.js','dist/hub-utils.js','dist/hub-data.js','dist/hub-guides.js','dist/ideas-data.js','dist/ideas.js']) vm.runInContext(await read(path),hubContext);
const strings=vm.runInContext('I18N.strings',hubContext);
for(const m of atlas.matchAll(/I18N\.t\('([^']+)'\)/g)) assert(strings[m[1]]?.en && strings[m[1]]?.zh,`Missing bilingual key ${m[1]}`);
for(const m of index.matchAll(/data-i18n(?:-aria|-ph|-html)?="([^"]+)"/g)) assert(strings[m[1]],`Missing static translation ${m[1]}`);
function shell(id){return {id,value:'',hidden:false,innerHTML:'',textContent:'',events:{},dataset:{},classList:{remove(){},contains(){return false;}},setAttribute(){},removeAttribute(){},focus(){},addEventListener(t,fn){this.events[t]=fn;},querySelector(){return null;},querySelectorAll(){return [];}};}
const shellIds=['hub-content','neurotech-atlas-2026','global-search','site-sidebar','mobile-menu','main-content','global-search-form','atlas-view-title','atlas-view-description'];
const shellElements=Object.fromEntries(shellIds.map(id=>[id,shell(id)]));
const nav=[...index.matchAll(/data-route="([^"]+)"/g)].map(m=>({...shell(m[1]),dataset:{route:m[1]}}));
const windowEvents={},navigated=[];
hubContext.location={hash:'#ideas'};
hubContext.history={replaceState(_a,_b,hash){hubContext.location.hash=hash;},pushState(_a,_b,hash){hubContext.location.hash=hash;}};
hubContext.window={neuroAtlas:{records:[{id:'neuralink',title:'Neuralink',description:'Organization',kind:'Organization',href:'#org/neuralink'}],counts:{technologies:1,organizations:1,researchers:1},navigate(...args){navigated.push(args);}},addEventListener(type,fn){windowEvents[type]=fn;},scrollTo(){}};
hubContext.document={getElementById:id=>shellElements[id]||null,querySelector:()=>shell('skip-link'),querySelectorAll:()=>nav,addEventListener(){}};
vm.runInContext(await read('dist/hub.js'),hubContext);
const hubContent=shellElements['hub-content'],atlasContent=shellElements['neurotech-atlas-2026'];
assert(hubContent.innerHTML.includes('Big ideas, made testable.'));assert(atlasContent.hidden);
for(const [hash,expected] of [['#ideas/moores-law-bci?section=counts&metric=channels','384'],['#ideas/moores-law-bci?section=companies&company=synchron','Synchron'],['#search?q=Moore','kind=Idea'],['#search?q=Paradromics','Company scaling'],['#ideas/missing','IDEA NOT FOUND']]){
  hubContext.location.hash=hash;windowEvents.hashchange();assert(hubContent.innerHTML.includes(expected),hash);assert(!hubContent.hidden && atlasContent.hidden);
}
hubContext.location.hash='#org/neuralink';windowEvents.hashchange();assert.equal(navigated.at(-1)[1],'neuralink');assert(hubContent.hidden && !atlasContent.hidden);
console.log(`Passed: ${ideas.ideas.length} ideas, ${ideas.companies.length} strategies, ${counts.milestones.length} milestones, ${pages.length} rendered states, dataset parity, source/atlas links, script order, preserved labels, selection URLs/focus, doubling slider, and valid/invalid bandwidth inputs.`);
console.log('Passed: bilingual key coverage, actual hub routing and global search for ideas/strategies, unknown-note state, and atlas adapter navigation.');
