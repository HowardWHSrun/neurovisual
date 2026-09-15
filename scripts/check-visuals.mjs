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
for(const group of ['all','labs','companies','people','explainers','invalid']){
 const html=api.render(new URLSearchParams({group}));assert(!/\bundefined\b|\bNaN\b/.test(html));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 if(group==='labs')assert.equal((html.match(/class="visual-card"/g)||[]).length,data.items.length);
 if(group==='companies')assert.equal((html.match(/class="visual-card"/g)||[]).length,6);
 assert(!html.includes('<iframe'));
}
for(const r of api.records())assert(all.some(m=>m.id===r.id&&m.href===r.href),'Specific destination from visual search');
// Exercise step switching and bank switching: the displayed channel count
// remains eight when the sampled positions change.
const node=()=>({innerHTML:'',hidden:false,events:{},attrs:{},dataset:{},addEventListener(k,v){this.events[k]=v;},setAttribute(k,v){this.attrs[k]=v;}});
const stage=node(),copy=node(),bank=node(),steps=[0,1,2].map(i=>Object.assign(node(),{dataset:{countStep:String(i)}}));
const container={querySelector(s){return {'#visual-count-art':stage,'#visual-count-copy':copy,'#visual-count-bank':bank}[s]||null;},querySelectorAll(s){return s==='[data-count-step]'?steps:[];}};
api.bind(container);assert(copy.innerHTML.includes('32 sites'));assert(bank.hidden);
steps[1].events.click();const first=stage.innerHTML;assert(copy.innerHTML.includes('8 channels'));assert(!bank.hidden);
bank.events.click();assert.notEqual(stage.innerHTML,first);assert(copy.innerHTML.includes('8 channels'));assert.equal(steps[1].attrs['aria-pressed'],'true');
steps[2].events.click();assert(copy.innerHTML.includes('6 example units'));assert(bank.hidden);
for(const id of ['moores-law-bci','density-or-coverage','useful-channels','readout-budget']){const html=api.idea(id);assert(html.includes('<img'));assert(html.includes('EXPLANATORY DIAGRAM'));}
console.log(`Visual checks passed: ${all.length} sourced stories, ${all.filter(x=>x.video).length} videos, captions, exact search destinations, safe rendering, and interactive count stages.`);
