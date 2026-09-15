import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const ideas = JSON.parse(await read('data/ideas.json'));
const counts = JSON.parse(await read('data/neural-counts.json'));
const context = vm.createContext({URL, URLSearchParams});
for (const path of ['dist/hub-utils.js','dist/ideas-data.js','dist/company-media.js','dist/labs-data.js','dist/visuals-data.js','dist/visuals.js','dist/ideas.js']) vm.runInContext(await read(path), context);
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
  assert.match(c.media.video.id,/^[\w-]{11}$/);
  assert(c.media.video.title && c.media.video.channel && c.media.video.description && c.media.video.source);
  assert(c.media.image.alt && c.media.image.caption && c.media.image.credit && c.media.image.usage);
  for(const url of [c.media.video.source,c.media.image.url,c.media.image.source]) assert.equal(new URL(url).protocol,'https:');
  assert(c.visual.steps.length===3 && c.visual.description);
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
for(const [a,b] of [['hub-utils','ideas'],['ideas-data','company-media'],['company-media','ideas'],['ideas','app'],['app','hub'],['i18n','app']]) assert(scripts.indexOf('./dist/'+a+'.js')<scripts.indexOf('./dist/'+b+'.js'));
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
for(const path of ['dist/i18n.js','dist/hub-utils.js','dist/hub-data.js','dist/hub-guides.js','dist/labs-data.js','dist/visuals-data.js','dist/visuals.js','dist/field-visuals.js','dist/labs.js','dist/ideas-data.js','dist/company-media.js','dist/ideas.js']) vm.runInContext(await read(path),hubContext);
const strings=vm.runInContext('I18N.strings',hubContext);
for(const m of atlas.matchAll(/I18N\.t\('([^']+)'\)/g)) assert(strings[m[1]]?.en && strings[m[1]]?.zh,`Missing bilingual key ${m[1]}`);
for(const m of index.matchAll(/data-i18n(?:-aria|-ph|-html)?="([^"]+)"/g)) assert(strings[m[1]],`Missing static translation ${m[1]}`);
function shell(id){return {id,value:'',hidden:false,innerHTML:'',textContent:'',open:false,events:{},dataset:{},classList:{add(){},remove(){},contains(){return false;}},showModal(){this.open=true;},close(){this.open=false;this.events.close?.();},setAttribute(){},removeAttribute(){},focus(){},addEventListener(t,fn){this.events[t]=fn;},querySelector(){return null;},querySelectorAll(){return [];}};}
const shellIds=['hub-content','neurotech-atlas-2026','global-search','site-sidebar','mobile-menu','main-content','global-search-form','atlas-view-title','atlas-view-description','workspace-page','workspace-section','search-dialog','search-open','search-close','search-status','search-suggestions'];
const shellElements=Object.fromEntries(shellIds.map(id=>[id,shell(id)]));
const nav=[...index.matchAll(/data-route="([^"]+)"/g)].map(m=>({...shell(m[1]),dataset:{route:m[1]}}));
const windowEvents={},documentEvents={},navigated=[];
hubContext.location={hash:'#ideas'};
hubContext.history={replaceState(_a,_b,hash){hubContext.location.hash=hash;},pushState(_a,_b,hash){hubContext.location.hash=hash;}};
hubContext.window={neuroAtlas:{records:[{id:'neuralink',title:'Neuralink',description:'Organization',kind:'Organization',href:'#org/neuralink'}],counts:{technologies:1,organizations:1,researchers:1},navigate(...args){navigated.push(args);}},addEventListener(type,fn){windowEvents[type]=fn;},scrollTo(){}};
hubContext.document={body:shell('body'),getElementById:id=>shellElements[id]||null,querySelector:()=>shell('skip-link'),querySelectorAll:()=>nav,addEventListener(type,fn){documentEvents[type]=fn;}};
vm.runInContext(await read('dist/hub.js'),hubContext);
const hubContent=shellElements['hub-content'],atlasContent=shellElements['neurotech-atlas-2026'];
assert(hubContent.innerHTML.includes('Big ideas, made testable.'));assert(atlasContent.hidden);
for(const [hash,expected] of [['#ideas/moores-law-bci?section=counts&metric=channels','384'],['#ideas/moores-law-bci?section=companies&company=synchron','Synchron'],['#search?q=Moore','kind=Idea'],['#search?q=Paradromics','Company scaling'],['#ideas/missing','IDEA NOT FOUND'],['#labs/rice-tringides','hydroMEA'],['#labs?view=schools','University of Zurich'],['#labs?view=progress','lab-progress-table'],['#search?q=hydroMEA','Research lab'],['#labs/missing','profile not found']]){
  hubContext.location.hash=hash;windowEvents.hashchange();assert(hubContent.innerHTML.includes(expected),hash);assert(!hubContent.hidden && atlasContent.hidden);
}
// On-demand search must preserve the page until a result or submit is chosen.
hubContext.location.hash='#methods';windowEvents.hashchange();
assert(hubContent.innerHTML.includes('method-compare') && hubContent.innerHTML.includes('BOLD fMRI'));
shellElements['search-open'].events.click();assert(shellElements['search-dialog'].open);
shellElements['global-search'].value='hydroMEA';shellElements['global-search'].events.input({isComposing:false});
assert.equal(hubContext.location.hash,'#methods');assert(shellElements['search-suggestions'].innerHTML.includes('Tringides'));
assert.equal(shellElements['search-status'].textContent,'1 match');
documentEvents.keydown({key:'Escape',target:{tagName:'INPUT'},preventDefault(){}});assert(!shellElements['search-dialog'].open);
documentEvents.keydown({key:'/',target:{tagName:'MAIN'},preventDefault(){}});assert(shellElements['search-dialog'].open);
shellElements['global-search'].events.compositionstart();documentEvents.keydown({key:'Escape',isComposing:true,target:{tagName:'INPUT'},preventDefault(){}});assert(shellElements['search-dialog'].open);shellElements['global-search'].value='never-render-during-ime';shellElements['global-search'].events.input({isComposing:true});assert(!shellElements['search-suggestions'].innerHTML.includes('No matches yet'));
shellElements['global-search'].value='hydroMEA';shellElements['global-search'].events.compositionend();
shellElements['global-search-form'].events.submit({preventDefault(){}});assert.equal(hubContext.location.hash,'#search?q=hydroMEA');assert(!shellElements['search-dialog'].open);
for(const [hash,expected] of [['#search?q=Calcium+imaging','methods?left=calcium'],['#methods?left=fmri','EEG'],['#resources?type=Dataset','resource-shortcuts'],['#learn','learning-preview'],['#glossary?letter=E','glossary-alphabet'],['#methods?left=ecog&right=intracortical','Intracortical electrodes']]){hubContext.location.hash=hash;windowEvents.hashchange();assert(hubContent.innerHTML.includes(expected),hash);}
console.log('Passed: on-demand search, keyboard dismissal, IME safety, submit navigation, and purpose-specific section routes.');
hubContext.location.hash='#org/neuralink';windowEvents.hashchange();assert.equal(navigated.at(-1)[1],'neuralink');assert(hubContent.hidden && !atlasContent.hidden);

const media=vm.runInContext('NeuroMedia',context);
for(const c of ideas.companies){
  const html=api.render('moores-law-bci',new URLSearchParams({section:'companies',company:c.id}));
  assert.equal((html.match(/data-neuro-video=/g)||[]).length,1,'One player per company');
  assert(!html.includes('<iframe'),'Load players only after a click');
  assert(html.includes('https://www.youtube.com/watch?v='+c.media.video.id),'Keep direct watch links');
  assert(media.profile(c).includes(c.media.video.description.replaceAll('&','&amp;')),'Keep video context on profiles');
}
assert.equal(media.video({media:{video:{id:'bad-id" onload="x'}}}), '');
let pendingMedia=[],createdFrame,restored=false,notice;
const mediaHost={nextElementSibling:null,insertAdjacentElement(_position,el){notice=el;}};
const mediaButton={dataset:{neuroVideo:'5V108D7Tn5A',videoTitle:'Precision video'},parentElement:mediaHost,addEventListener(_type,fn){this.click=fn;},replaceWith(frame){createdFrame=frame;},focus(){}};
context.document={activeElement:null,createElement(tag){return {tag,isConnected:true,contentDocument:null,focus(){},replaceWith(button){restored=button===mediaButton;},setAttribute(){}};}};
context.window={setTimeout(fn){pendingMedia.push(fn);}};
media.bind({querySelectorAll(selector){return selector==='[data-neuro-video]'?[mediaButton]:[];}});
mediaButton.click();assert.equal(createdFrame.src,'https://www.youtube-nocookie.com/embed/5V108D7Tn5A?autoplay=1&rel=0');
assert.equal(createdFrame.referrerPolicy,'strict-origin-when-cross-origin');assert.equal(createdFrame.title,'Precision video');
pendingMedia.shift()();assert(!restored,'A cross-origin player stays mounted');
mediaButton.click();createdFrame.contentDocument={URL:'about:blank'};pendingMedia.shift()();
assert(restored && notice.innerHTML.includes('Watch on YouTube'),'Recover a client-blocked frame with preview and watch link');
console.log(`Passed: ${ideas.ideas.length} ideas, ${ideas.companies.length} strategies, ${counts.milestones.length} milestones, ${pages.length} rendered states, dataset parity, source/atlas links, script order, preserved labels, selection URLs/focus, doubling slider, and valid/invalid bandwidth inputs.`);
console.log('Passed: bilingual key coverage, actual hub routing and global search for ideas/strategies, unknown-note state, and atlas adapter navigation.');
console.log('Passed: sourced media records, single click-to-load players, persistent video context, safe video IDs, and blocked-frame recovery.');
