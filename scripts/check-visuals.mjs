import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const data=JSON.parse(await read('data/visuals.json')),labs=JSON.parse(await read('data/labs.json'));
const ctx=vm.createContext({URL,URLSearchParams,console});
for(const name of ['hub-utils','ideas-data','company-media','labs-data','visuals-data','connections-data','visuals'])vm.runInContext(await read('dist/'+name+'.js'),ctx);
const api=vm.runInContext('NeuroVisuals',ctx),all=api.items();
assert.equal(JSON.stringify(vm.runInContext('neuroVisualData',ctx)),JSON.stringify(data));
assert.equal(new Set(all.map(x=>x.id)).size,all.length);
for(const item of data.items){
 assert(labs.labs.some(l=>l.id===item.labId),'Existing profile '+item.labId);
 assert(item.title&&item.focus&&item.image.alt&&item.image.caption&&item.image.credit);
 for(const url of [item.image.url,item.image.source])assert.equal(new URL(url).protocol,'https:');
 if(item.video){assert.match(item.video.id,/^[\w-]{11}$/);assert(item.video.title&&item.video.channel&&item.video.description);assert.equal(new URL(item.video.source).protocol,'https:');}
 const html=api.labFeature(item.labId);assert(html.includes(item.image.url.replaceAll('&','&amp;')));assert(html.includes(item.image.source.replaceAll('&','&amp;')));assert(!html.includes('<iframe'),'No video tracking before play');
}
for(const group of ['', 'all','labs','companies','people','explainers','invalid']){
 const html=api.render(new URLSearchParams({group}));assert(!/\bundefined\b|\bNaN\b/.test(html));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 const active=['labs','people','explainers'].includes(group)?group:'companies';
 assert(html.includes(`data-visual-group="${active}"`),'Unknown and legacy all routes open devices');
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1,'One active section');
 for(const label of ['Device pictures','In the lab','People','How to read neural counts'])assert(html.includes('>'+label+'</a>'),'Explicit section '+label);
 assert(!html.includes('>Everything<'),'No mixed landing gallery');
 assert.equal((html.match(/class="visual-card"/g)||[]).length,active==='explainers'?0:all.filter(x=>x.group===active).length,'One gallery focus per section');
 if(active==='people')assert(html.includes('href="#people"'),'Portraits connect to broader people directory');
 if(active==='explainers'){
  assert(html.includes('32 sites. 8 channels. 6 units.'));
  assert(html.includes('id="visual-count-prev"')&&html.includes('id="visual-count-next"'),'Guided navigation');
  assert(html.includes('data-count-site="31"'),'Initial diagram is visible before binding');
  assert(!html.includes('visual-source-note'),'Diagram view does not show irrelevant photo boilerplate');
 }else assert(!html.includes('id="visual-count-art"'),'Count demo only appears in its own section');
 assert(!html.includes('<iframe'));
}
for(const r of api.records())assert(all.some(m=>m.id===r.id&&m.href===r.href),'Specific destination from visual search');
// Exercise the complete journey, direct steps, bank selection and rebinding.
// The third frame intentionally analyzes recordings together, with no lines
// connecting individual channels to individual putative units.
const node=()=>({innerHTML:'',textContent:'',hidden:false,disabled:false,events:{},attrs:{},dataset:{},bindings:0,focused:false,focus(){this.focused=true;},addEventListener(k,v){this.events[k]=v;this.bindings++;},setAttribute(k,v){this.attrs[k]=v;}});
const stage=node(),copy=node(),bank=node(),previous=node(),next=node(),position=node(),steps=[0,1,2].map(i=>Object.assign(node(),{dataset:{countStep:String(i)}}));
const container={querySelector(s){return {'#visual-count-art':stage,'#visual-count-copy':copy,'#visual-count-bank':bank,'#visual-count-prev':previous,'#visual-count-next':next,'#visual-count-position':position}[s]||null;},querySelectorAll(s){return s==='[data-count-step]'?steps:[];}};
const count=(html,attr)=>(html.match(new RegExp(' '+attr+'="','g'))||[]).length;
api.bind(container);assert(copy.innerHTML.includes('32 physical sites'));assert(bank.hidden);assert(previous.disabled);assert(!next.disabled);assert.equal(position.textContent,'Step 1 of 3');
assert.equal(count(stage.innerHTML,'data-count-site'),32);assert.equal(count(stage.innerHTML,'data-count-channel'),0);
next.events.click();const first=stage.innerHTML;assert(copy.innerHTML.includes('8 simultaneous channels'));assert(!bank.hidden);assert(!previous.disabled);
assert.equal(count(stage.innerHTML,'data-count-site'),32);assert.equal(count(stage.innerHTML,'data-count-channel'),8);
assert.equal((stage.innerHTML.match(/data-selected="true"/g)||[]).length,8);
const sampled=new Set();
for(let group=0;group<4;group++){
 assert(copy.innerHTML.includes(`Group ${group+1} of 4`));
 for(const match of stage.innerHTML.matchAll(/data-count-site="(\d+)" data-selected="true"/g))sampled.add(Number(match[1]));
 bank.events.click();assert(copy.innerHTML.includes('8 simultaneous channels'));
}
assert.equal(sampled.size,32,'Four banks sample all 32 physical sites');assert.equal(stage.innerHTML,first,'Bank selection cycles without changing readout capacity');
assert.equal(steps[1].attrs['aria-pressed'],'true');
next.events.click();assert(copy.innerHTML.includes('6 example units'));assert(bank.hidden);assert(next.disabled);assert(previous.focused,'Focus moves to the available previous control at the end');assert.equal(position.textContent,'Step 3 of 3');
assert.equal(count(stage.innerHTML,'data-count-channel'),8);assert.equal(count(stage.innerHTML,'data-count-unit'),6);assert.equal(count(stage.innerHTML,'data-count-site'),0);
assert(stage.innerHTML.includes('Spike sorting'));assert(stage.innerHTML.includes('no one-to-one channel mapping'));
assert(copy.innerHTML.includes('One unit can appear on several channels'));
previous.events.click();assert(copy.innerHTML.includes('8 simultaneous channels'));assert(!next.disabled);previous.events.click();assert(next.focused,'Focus moves to the available next control at the beginning');
steps[0].events.click();assert(copy.innerHTML.includes('32 physical sites'));assert(previous.disabled);
steps[2].events.click();assert(copy.innerHTML.includes('6 example units'));
const bindings=next.bindings;api.bind(container);assert.equal(next.bindings,bindings,'Binding remains idempotent');assert(copy.innerHTML.includes('6 example units'),'Rebinding preserves the chosen step');
for(const id of ['moores-law-bci','density-or-coverage','useful-channels','readout-budget']){const html=api.idea(id);assert(html.includes('<img'));assert(html.includes('EXPLANATORY DIAGRAM'));}
console.log(`Visual checks passed: ${all.length} sourced stories, ${all.filter(x=>x.video).length} videos, captions, exact search destinations, safe rendering, focused gallery sections, and the complete sites/channels/units journey.`);
