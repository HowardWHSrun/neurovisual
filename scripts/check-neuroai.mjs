import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const data=JSON.parse(await read('data/neuroai.json'));
const context=vm.createContext({URL,URLSearchParams});
for(const name of ['hub-utils','hub-data','hub-guides','company-media','neuroai-data','neuroai-learning','neuroai'])vm.runInContext(await read(`dist/${name}.js`),context);
const {api,utils,snapshot,resources,topics,paths,glossary,guides,checks}=vm.runInContext('({api:NeuroAI,utils:hubUtils,snapshot:neuroAIData,resources:hubResources,topics:hubTopics,paths:hubLearningPaths,glossary:hubGlossary,guides:hubGuides,checks:hubProjectChecks})',context);
assert.equal(JSON.stringify(snapshot),JSON.stringify(data),'Rebuild the generated NeuroAI snapshot after data edits');
assert(data.projects.length>0,'The project collection is not empty');
assert.match(data.reviewed,/^\d{4}-\d{2}-\d{2}$/);
const ids=new Set(data.projects.map(p=>p.id));
assert.equal(ids.size,data.projects.length,'Project IDs are unique');
const required=['male-cns','flywire','microns','shiu-fly','eon','cebra','stonkfly','flygym','brainscore','zapbench'];
for(const id of required)assert(ids.has(id),`Explanation destination ${id} must exist`);
const nonempty=(value,label)=>assert(typeof value==='string' && value.trim(),label);
function https(url,label){assert.equal(new URL(url).protocol,'https:',label);}
function imageRecord(image,label){
  for(const key of ['url','alt','caption','credit','source'])nonempty(image[key],`${label}: image ${key}`);
  https(image.url,label);https(image.source,label);
}
imageRecord(data.hero,'Hero');
for(const p of data.projects){
  assert.match(p.id,/^[a-z0-9-]+$/);
  for(const key of ['title','subtitle','category','evidence','date','summary','question','does','boundary','nextTest'])nonempty(p[key],`${p.id}: ${key}`);
  assert(Object.hasOwn(api.categories,p.category),`${p.id}: known category`);
  assert(p.sources.length>=2,`${p.id}: retain primary evidence and usable context`);
  assert(p.actions.length,`${p.id}: provide a practical destination`);
  for(const s of p.sources){nonempty(s.title,`${p.id}: source title`);https(s.url,`${p.id}: source URL`);}
  for(const a of p.actions){nonempty(a.label,`${p.id}: action label`);https(a.url,`${p.id}: action URL`);}
  for(const f of p.facts){nonempty(f.value,`${p.id}: fact value`);nonempty(f.label,`${p.id}: fact denominator`);nonempty(f.note,`${p.id}: fact scope`);}
  for(const id of p.related)assert(ids.has(id) && id!==p.id,`${p.id}: valid related project ${id}`);
  assert.equal(new Set(p.related).size,p.related.length,`${p.id}: distinct related links`);
  if(p.image)imageRecord(p.image,p.id);
  if(p.video){assert.match(p.video.id,/^[\w-]{11}$/);for(const k of ['title','channel','description'])nonempty(p.video[k],`${p.id}: video ${k}`);}
  for(const person of p.people||[]){nonempty(person.label,`${p.id}: person label`);assert(person.href.startsWith('#') || utils.sourceHref(person.href)!=='#',`${p.id}: safe person destination`);}
}

// These are semantic regression checks for easily confused count denominators,
// not an attempt to infer new biological claims from the size of a number.
const text=id=>{const p=data.projects.find(p=>p.id===id);return [p.does,p.boundary,...p.facts.flatMap(f=>[f.value,f.label,f.note])].join(' ');};
assert.match(text('male-cns'),/male/i);assert.match(text('male-cns'),/nerve cord|VNC/i);
assert.match(text('flywire'),/female/i);assert.match(text('flywire'),/brain/i);
assert.match(text('microns'),/mouse/i);assert.match(text('microns'),/visual[- ]cortex/i);
assert.match(text('shiu-fly'),/127,400/);assert.match(text('shiu-fly'),/630/);
assert.match(text('stonkfly'),/neuron.pair|weighted graph edge/i);assert.match(text('stonkfly'),/synaptic contacts/i);
assert.match(text('zapbench'),/calcium/i);assert.match(text('zapbench'),/larval zebrafish/i);
for(const id of ['eon','stonkfly','doomfly'])assert.match(data.projects.find(p=>p.id===id).evidence,/company|demo|code|creator|repository/i,`${id}: preserve the evidence status of a demonstration`);

for(const id of ['flywire-codex','neuprint','neuroai-course','cebra'])assert(data.resources.some(r=>r.id===id),`Required learning resource ${id}`);
assert.equal(topics.filter(t=>t.id==='neuroai').length,1);
assert.equal(new Set(resources.map(r=>r.id)).size,resources.length,'Resources do not overwrite existing IDs');
for(const r of data.resources){assert.equal(r.topic,'neuroai');assert(resources.some(x=>x.id===r.id));https(r.url,r.id);}
assert(guides.neuroai.sources.length>=2 && guides.neuroai.workflow.length===4);
assert(glossary.filter(t=>t[2]==='neuroai').length>=8);
for(const id of ['connectome','neuroai']){
  const path=paths.find(p=>p.id===id);assert(path,`${id}: learning path`);assert.equal(path.steps.length,4);
  for(const [resource] of path.steps)assert(resources.some(r=>r.id===resource),`Resolve ${resource}`);
  assert(checks[id].checks.length>=3 && checks[id].stretch);
}

function rendered(html){
  assert(!/undefined|NaN/.test(html),'Complete rendered values');
  assert(!/<iframe\b/i.test(html),'Videos are not loaded before a click');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'No duplicate page IDs');
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]*)"/g))assert(url.startsWith('#') || /^https?:\/\//.test(url),`Safe rendered destination: ${url}`);
  assert.equal((html.match(/aria-current="page"/g)||[]).length,html.includes('ai-tabs')?1:0,'A single current NeuroAI view');
}
const overview=api.render();rendered(overview);
assert.equal((overview.match(/class="ai-project-card"/g)||[]).length,data.projects.length);
assert(overview.includes(utils.escapeHtml(data.hero.credit)) && overview.includes(utils.sourceHref(data.hero.source)),'Visible hero attribution and source');
for(const p of data.projects){
  const html=api.render(p.id);rendered(html);
  for(const value of [p.title,p.boundary,p.nextTest])assert(html.includes(utils.escapeHtml(value)),`${p.id}: retain title, limits and test question`);
  assert(html.includes('Editorial research question, not a reported result.'));
  for(const source of p.sources)assert(html.includes(utils.sourceHref(source.url)),`${p.id}: source retained`);
  for(const related of p.related)assert(html.includes(`#neuroai/${related}`));
  if(p.video){assert(html.includes(`data-neuro-video="${p.video.id}"`));assert(html.includes(`https://www.youtube.com/watch?v=${p.video.id}`));assert(html.includes(utils.escapeHtml(p.video.description)));}
}
for(const category of Object.keys(api.categories)){
  const params=new URLSearchParams({category});const expected=data.projects.filter(p=>p.category===category).length;
  assert.equal(api.state(params).projects.length,expected);const html=api.render('',params);rendered(html);
  assert.equal((html.match(/class="ai-project-card"/g)||[]).length,expected);
  assert(html.includes(`value="${category}" selected`));
}
const query=new URLSearchParams({q:'male connectome'});
const expected=data.projects.filter(p=>utils.matches([p.title,p.subtitle,p.summary,p.does,p.evidence].join(' '),'male connectome')).map(p=>p.id);
assert.deepEqual(Array.from(api.state(query).projects,p=>p.id),expected);
assert(api.render('',new URLSearchParams({q:'no-such-project-987123'})).includes('No matching projects.'));
assert(api.render('',new URLSearchParams({category:'bad-category'})).includes('Unknown direction'));
assert(api.render('missing').includes('Project not found.'));
assert(api.render('',new URLSearchParams({view:'unknown'})).includes('Start with the question.'));
for(let stage=0;stage<4;stage++){
  const params=new URLSearchParams({view:'explain',stage:String(stage)}),html=api.render('',params);rendered(html);
  assert.equal(api.stageIndex(params),stage);assert(html.includes(`LAYER ${stage+1} / 4`));
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
  assert(html.includes('anatomical neuron count') && html.includes('weighted graph edge') && html.includes('recording channel'),'Explanation distinguishes units');
  const links=[...html.matchAll(/href="#neuroai\/([a-z0-9-]+)"/g)].map(m=>m[1]);assert.equal(links.length,3,'Each explanation layer retains three working examples');
}
for(const stage of ['-1','4','1.5','not-a-number','Infinity'])assert.equal(api.stageIndex(new URLSearchParams({stage})),0);
const learning=api.render('',new URLSearchParams({view:'learn'}));rendered(learning);
for(const href of ['#topic/neuroai','#learn/connectome','#learn/neuroai','#resources?topic=neuroai'])assert(learning.includes(href));
for(const r of data.resources)assert(learning.includes(utils.sourceHref(r.url)));
const records=api.records();assert.equal(records.length,data.projects.length+1);assert.equal(new Set(records.map(r=>r.id)).size,records.length);
for(const p of data.projects)assert(records.some(r=>r.id===`neuroai-${p.id}` && r.href===`#neuroai/${p.id}`),'Search records resolve projects');
assert(api.spotlight().includes('href="#neuroai"'));assert(api.spotlight().includes(utils.escapeHtml(data.hero.credit)));
assert(api.idea('fly-circuit-learning').includes('#neuroai/stonkfly'));assert(api.idea('connectome-to-model').includes('#neuroai/male-cns'));assert.equal(api.idea('unknown'),'');

// Exercise hostile imported text/URLs without changing the published snapshot.
const original=JSON.parse(JSON.stringify(snapshot.projects[0]));
const probe=snapshot.projects[0],unsafe='javascript:alert(1)',payload='<img src=x onerror="alert(1)">';
Object.assign(probe,{title:payload,boundary:payload,nextTest:payload,people:[{label:payload,href:unsafe}],sources:[{title:payload,url:unsafe,detail:payload}],actions:[{label:payload,url:'data:text/html,bad',note:payload}],image:{url:unsafe,source:unsafe,alt:payload,caption:payload,credit:payload}});
const hostile=api.render(probe.id);rendered(hostile);
assert(hostile.includes(utils.escapeHtml(payload)) && !hostile.includes(payload));
assert(!hostile.includes('javascript:') && !hostile.includes('data:text/html'),'Reject executable source, image, action and person URLs');
Object.assign(probe,original);if(!original.people)delete probe.people;if(!original.image)delete probe.image;
const hostileQuery=api.render('',new URLSearchParams({q:'"><script>alert(1)</script>',view:'"><svg onload=x>'}));
assert(!hostileQuery.includes('<script>') && !hostileQuery.includes('<svg onload='));

// Small controller doubles check route and focus contracts, not browser layout.
function node(props={}){return {events:{},dataset:{},value:'',hidden:false,id:'',addEventListener(type,fn){this.events[type]=fn;},getAttribute(name){return this[name]??null;},...props};}
let navigations=[];
const form=node(),input=node({value:'  fly & model  '}),select=node({value:'models'});
const anchor=node({href:'#neuroai/cebra'});
const stages=[0,1,2,3,1,3].map(i=>node({dataset:{aiStage:String(i)}}));
const errorMessage=node({hidden:true}),image=node({complete:false,naturalWidth:0,parentElement:{querySelector(){return errorMessage;}}});
const container={querySelector(s){return {'#ai-filter':form,'#ai-query':input,'#ai-category':select}[s]||null;},querySelectorAll(s){return {'[data-ai-nav]':[anchor],'[data-ai-stage]':stages,'[data-ai-image]':[image]}[s]||[];}};
const params=new URLSearchParams({view:'explain',stage:'2',q:'retained'});
api.bind(container,params,(...args)=>navigations.push(args));
assert(!input.events.input && !input.events.change,'Typing does not replace the active page');
let prevented=false;form.events.submit({preventDefault(){prevented=true;}});assert(prevented);
assert.deepEqual(navigations.pop(),['#neuroai?q=fly+%26+model&category=models','ai-query']);
input.value=' ';select.value='';form.events.submit({preventDefault(){}});assert.deepEqual(navigations.pop(),['#neuroai','ai-query']);
for(const key of ['metaKey','ctrlKey','shiftKey','altKey']){let prevented=false;anchor.events.click({[key]:true,preventDefault(){prevented=true;}});assert(!prevented);assert.equal(navigations.length,0);}
anchor.events.click({preventDefault(){}});assert.deepEqual(navigations.pop(),['#neuroai/cebra']);
for(const [index,stage] of [[0,0],[4,1],[5,3]]){
  stages[index].events.click();const [hash,focus]=navigations.pop(),route=utils.parseRoute(hash);
  assert.equal(route.route,'neuroai');assert.equal(route.params.get('view'),'explain');assert.equal(route.params.get('stage'),String(stage));assert.equal(route.params.get('q'),'retained');assert.equal(focus,`ai-stage-control-${stage}`);
}
assert.equal(params.get('stage'),'2','Stage navigation does not mutate current state');
image.events.error();assert(image.hidden && !errorMessage.hidden,'Failed image preserves credited fallback text');
const handler=image.events.error;api.bindImages(container);assert.equal(image.events.error,handler,'Image binding is idempotent');
const cachedFallback=node({hidden:true}),cachedImage=node({complete:true,naturalWidth:0,parentElement:{querySelector(){return cachedFallback;}}});
api.bindImages({querySelectorAll(){return [cachedImage];}});assert(cachedImage.hidden && !cachedFallback.hidden,'Cached image failures also show the fallback');
console.log(`Passed: ${data.projects.length} NeuroAI projects, ${data.resources.length} resources, count-scope boundaries, generated data parity, source/media integrity, all project/view/filter renders, learning/search integration, URL escaping, submit-only filters, modified clicks, stage focus, image recovery, and click-to-load video previews.`);
