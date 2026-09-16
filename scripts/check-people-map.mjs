import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const graph=JSON.parse(await read('data/connections.json'));
const stories=JSON.parse(await read('data/exploration-people.json')).paths;
const nodes=new Map(graph.nodes.map(node=>[node.id,node]));
const edges=new Map(graph.edges.map(edge=>[edge.id,edge]));
const kinds=new Set(['Person','Company','Institution','Lab']);
const eligible=graph.edges.filter(edge=>edge.basis==='documented'&&kinds.has(nodes.get(edge.from).kind)&&kinds.has(nodes.get(edge.to).kind));
const eligibleNodes=new Set(eligible.flatMap(edge=>[edge.from,edge.to]));
const context=vm.createContext({URL,URLSearchParams,console});
for(const name of ['hub-utils','ideas-data','company-media','labs-data','visuals-data','connections-data','visuals','exploration-data','people-map'])vm.runInContext(await read(`dist/${name}.js`),context,{filename:`dist/${name}.js`});
const api=vm.runInContext('PeopleMap',context);
const escape=vm.runInContext('hubUtils.escapeHtml',context);
const plain=value=>JSON.parse(JSON.stringify(value));
const sorted=values=>[...values].sort();
const ids=items=>items.map(item=>item.id);
const params=values=>new URLSearchParams({by:'people',...values});
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const attributes=(html,name)=>[...html.matchAll(new RegExp(`\\b${name}="([^"]*)"`,'g'))].map(match=>decode(match[1]));
const hrefs=html=>attributes(html,'href');
function safeHtml(html){
  assert(!/\bundefined\b|\bNaN\b/.test(html),'Rendered values are complete');
  const found=attributes(html,'id');assert.equal(new Set(found).size,found.length,'Rendered IDs are unique');
  for(const value of [...hrefs(html),...attributes(html,'src')])assert(value.startsWith('#')||value.startsWith('./')||['https:','http:'].includes(new URL(value).protocol),`Safe URL: ${value}`);
  return html;
}
function model(values={}){
  const result=plain(api.model(params(values))),nodeIds=new Set(ids(result.nodes));
  assert.equal(nodeIds.size,result.nodes.length,'No duplicated nodes');
  assert.equal(new Set(ids(result.edges)).size,result.edges.length,'No duplicated relationships');
  for(const edge of result.edges){assert(eligible.some(item=>item.id===edge.id),`Only documented supported relationships: ${edge.id}`);assert(nodeIds.has(edge.from)&&nodeIds.has(edge.to),'Every line has both endpoints');}
  for(const node of result.nodes)assert(kinds.has(node.kind),'Only people and their organizations appear');
  return result;
}

// The map represents curated relationships, with no default person or ranking.
const all=model();
assert.equal(all.focus,'','The full map does not privilege a first person');
assert.deepEqual(sorted(ids(all.edges)),sorted(ids(eligible)),'Full map includes every eligible relationship, across all evidence categories');
assert.deepEqual(sorted(ids(all.nodes)),sorted(eligibleNodes),'Full map includes exactly their endpoints');
assert.equal(all.invalidFocus,false);
assert.equal(all.depth,1,'Nearby exploration starts with direct connections');
assert(!all.nodes.some(node=>node.kind==='Technology'||node.kind==='Program'),'Technical objects stay in the wider network');

const knownGroups={
  training:['lefloch-jia-training','ye-park-training','hiatt-normann-training','clark-shepherd-mentor','maryland-fischell-degree','zhao-rice-postdoc'],
  founding:['rapoport-precision','cortec-shareholder','sabes-neuralink-founding','neurosoft-bio-spinout','nucleus-cochlear-commercialization'],
  work:['uci-nurotron-translation','harvard-axoft-license','palanker-stanford','williams-garell-development','tolosa-precision','genlight-acquired-nuowei']
};
for(const [group,examples] of Object.entries(knownGroups))for(const id of examples)assert.equal(api.relationGroup(edges.get(id)),group,`Conservative relationship grouping: ${id}`);
const classified=['training','founding','work'].map(relation=>model({relation}));
assert.deepEqual(sorted(classified.flatMap(set=>ids(set.edges))),sorted(ids(eligible)),'Relationship filters partition all evidence without dropping or duplicating lines');
for(const [i,relation] of ['training','founding','work'].entries())for(const edge of classified[i].edges)assert.equal(api.relationGroup(edge),relation);

// Independently traverse the selected evidence so nearby views cannot leak
// neighbors from another filter or treat a technical comparison as a link.
function nearby(focus,allowed,depth){
  const reached=new Set([focus]);let frontier=new Set([focus]);
  for(let step=0;step<depth;step++){
    const next=new Set();
    for(const edge of allowed){if(frontier.has(edge.from)&&!reached.has(edge.to))next.add(edge.to);if(frontier.has(edge.to)&&!reached.has(edge.from))next.add(edge.from);}
    for(const id of next)reached.add(id);frontier=next;
  }
  return {nodes:sorted(reached),edges:sorted(allowed.filter(edge=>reached.has(edge.from)&&reached.has(edge.to)).map(edge=>edge.id))};
}
let cases=0;
for(const focus of eligibleNodes)for(const relation of ['all','training','founding','work'])for(const depth of [1,2]){
  const allowed=relation==='all'?eligible:eligible.filter(edge=>api.relationGroup(edge)===relation);
  const expected=nearby(focus,allowed,depth),actual=model({focus,relation,depth:String(depth)});
  assert.deepEqual(sorted(ids(actual.nodes)),expected.nodes,`${focus}/${relation}/${depth}: exact nearby entries`);
  assert.deepEqual(sorted(ids(actual.edges)),expected.edges,`${focus}/${relation}/${depth}: exact nearby relationships`);
  cases++;
}
const missing=model({focus:'missing-entry'});assert.equal(missing.invalidFocus,true,'Unknown focus is reported');
assert.equal(model({relation:'missing-filter'}).relation,'all','Unknown relationship filter falls back safely');
assert.equal(model({depth:'500'}).depth,1,'Invalid depth does not expand the graph without bound');

// Search is over entries with relationship evidence, including diacritics and
// supported aliases, rather than conflating the larger influence directory.
assert(ids(plain(api.search('Lacour'))).includes('stephanie-lacour'));
assert(ids(plain(api.search('Stéphanie'))).includes('stephanie-lacour'));
assert(ids(plain(api.search('Stephanie'))).includes('stephanie-lacour'));
assert.equal(plain(api.search('no mapped entry qzxj')).length,0);
for(const query of ['brain','neural','Stanford','Rice','co-founded',''])for(const result of plain(api.search(query)))assert(eligibleNodes.has(result.id),'Search results are within this map');

// Source evidence must remain exact and available from the selected map line.
for(const edge of eligible){
  const html=safeHtml(api.edgeDetail(edge.id,params({edge:edge.id})));
  for(const text of [nodes.get(edge.from).name,nodes.get(edge.to).name,edge.label,edge.date,edge.detail,...(edge.limit?[edge.limit]:[])])assert(html.includes(escape(text)),`Preserve evidence wording for ${edge.id}: ${text}`);
  for(const source of edge.sources){assert(html.includes(escape(source.title)));assert(hrefs(html).includes(new URL(source.url).href),`Original source is linked: ${edge.id}`);}
}
for(const id of eligibleNodes){const html=safeHtml(api.nodeDetail(id,params({node:id})));assert(html.includes(escape(nodes.get(id).name)));assert(html.includes(escape(nodes.get(id).summary)));}

const defaultHtml=safeHtml(api.render(params())),defaultState=model({focus:'paul-le-floch',depth:'2'});
assert(defaultHtml.includes('Example connection'),'The initial focused story is explicitly labeled as an example');
assert(defaultHtml.includes(`${defaultState.nodes.length} entries · ${defaultState.edges.length} relationships`),'The initial example reports its actual neighborhood counts');
assert(hrefs(defaultHtml).includes('#explore?by=people&overview=1'),'The whole graph remains one click from the example');
const defaultReadable=defaultHtml.match(/<details class="pm-readable">([\s\S]*)<\/details>/)?.[1];
assert.deepEqual(sorted(attributes(defaultReadable,'data-pm-node')),sorted(ids(defaultState.nodes)),'Initial example matches the documented two-step neighborhood');
const fullHtml=safeHtml(api.render(params({overview:'1'})));
assert(fullHtml.includes('pm-canvas'),'Native map is rendered');
assert(!fullHtml.includes('<iframe'),'The map is embedded directly without an external host');
assert(!fullHtml.includes('Example connection'),'Whole-map route overrides the introductory example');
for(const values of [{overview:'1'},{focus:'paul-le-floch'},{focus:'newronika',relation:'founding',depth:'2'},{relation:'training'},{focus:'newronika',relation:'training'},{focus:'missing-entry'}]){
  const html=safeHtml(api.render(params(values))),set=model(values);
  const readable=html.match(/<details class="pm-readable">([\s\S]*)<\/details>/)?.[1];assert(readable,'Equivalent readable list exists');
  assert.deepEqual(sorted(attributes(readable,'data-pm-edge')),sorted(ids(set.edges)),'Keyboard-readable relationships exactly match filtered graph');
  assert.deepEqual(sorted(attributes(readable,'data-pm-node')),sorted(ids(set.nodes)),'Keyboard-readable entries exactly match the filtered graph, including an isolated focus');
}
for(const story of stories){
  const selected=story.edgeIds.find(id=>eligible.some(edge=>edge.id===id));assert(selected,`${story.id} retains a supported relationship`);
  const html=safeHtml(api.render(params({edge:selected})));
  assert(html.includes(escape(edges.get(selected).detail)),`${story.id}: selected shortcut exposes exact source evidence`);
}

// A selected route is shareable, and changing scope can explicitly clear only
// the selection while retaining the chosen relationship type and neighborhood.
const selectedParams=params({relation:'founding',focus:'axoft',depth:'2',edge:'paul-le-floch-axoft-founder',overview:'1',unrelated:'discard'});
const selectedUrl=api.href(selectedParams),roundTrip=new URLSearchParams(selectedUrl.split('?')[1]);
assert(selectedUrl.startsWith('#explore?'));
for(const key of ['by','relation','focus','depth','edge','overview'])assert.equal(roundTrip.get(key),selectedParams.get(key),`Shareable ${key}`);
assert(!roundTrip.has('unrelated'),'Other page parameters do not leak into map routes');
const cleared=new URLSearchParams(api.href(selectedParams,{edge:'',node:'paul-le-floch'}).split('?')[1]);
assert(!cleared.has('edge'));assert.equal(cleared.get('node'),'paul-le-floch');assert.equal(cleared.get('focus'),'axoft');
assert(!api.edgeDetail('rapoport-precision',params({focus:'newronika'})).includes(escape(edges.get('rapoport-precision').detail)),'A selection outside the active neighborhood does not display unrelated evidence');
assert(!api.edgeDetail('missing-relationship',params()).includes('undefined'),'Unknown selected edge is handled');
assert(!api.nodeDetail('missing-person',params()).includes('undefined'),'Unknown selected entry is handled');

const liveGraph=vm.runInContext('neuroConnectionsData',context),liveEdge=liveGraph.edges.find(edge=>edge.id==='rapoport-precision');
const originalLabel=liveEdge.label,originalSources=liveEdge.sources;
try{
  liveEdge.label='<img src=x onerror="alert(1)">';liveEdge.sources=[{title:'<unsafe> & source',url:'javascript:alert(1)'}];
  const html=safeHtml(api.edgeDetail(liveEdge.id,params()));
  assert(html.includes('&lt;img src=x'));assert(!html.includes('<img src=x'));assert(html.includes('&lt;unsafe&gt; &amp; source'));assert(!hrefs(html).some(value=>value.startsWith('javascript:')));
}finally{liveEdge.label=originalLabel;liveEdge.sources=originalSources;}

// Capture the actual Cytoscape configuration and lifecycle, without pretending
// that a DOM stub can validate layout, browser focus, or pointer geometry.
const controls=new Map(),listeners=[];
function control(id){
  if(!controls.has(id))controls.set(id,{id,innerHTML:'',value:'',hidden:false,scrollTop:0,clientWidth:900,clientHeight:620,events:{},attributes:{},
    addEventListener(type,fn,options){this.events[type]=fn;listeners.push(options?.signal);},setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},contains(){return false;},querySelector(){return null;},querySelectorAll(){return [];}});
  return controls.get(id);
}
const mapButtons=['#pm-fit','#pm-zoom-in','#pm-zoom-out'].map(control);
const container={events:{},querySelector:control,querySelectorAll:selector=>selector==='.pm-map-controls button:not(#pm-show-details)'?mapButtons:[],contains:()=>true,addEventListener(type,fn,options){this.events[type]=fn;listeners.push(options?.signal);}};
let config,created=0,destroyed=0,observed=0,disconnected=0,resized=0,onResize;
const graphEvents={},pushed=[],navigations=[],fits=[];
const collection={removeClass(){return this;},addClass(){return this;},connectedNodes(){return this;},closedNeighborhood(){return this;}};
context.AbortController=AbortController;
context.document={addEventListener(_type,_fn,options){listeners.push(options?.signal);}};
context.history={pushState(_state,_unused,hash){pushed.push(hash);}};
context.ResizeObserver=class{constructor(callback){onResize=callback;}observe(){observed++;}disconnect(){disconnected++;}};
context.cytoscape=options=>{config=options;created++;return {on(type,selector,fn){graphEvents[`${type}:${typeof selector==='string'?selector:'canvas'}`]=fn||selector;},elements:()=>collection,getElementById:()=>collection,destroy(){destroyed++;},fit(...args){fits.push(args);},resize(){resized++;},zoom(){return 1;}};};
api.bind(container,params({overview:'1'}),(...args)=>navigations.push(args));
assert.equal(created,1);assert.equal(observed,1);
assert.deepEqual(sorted(config.elements.filter(item=>!item.data.source).map(item=>item.data.id)),sorted(ids(all.nodes)),'Canvas receives exactly the displayed entries');
assert.deepEqual(sorted(config.elements.filter(item=>item.data.source).map(item=>item.data.edgeId)),sorted(ids(all.edges)),'Canvas receives exactly the documented relationships');
const startingPositions=config.elements.filter(item=>!item.data.source).map(item=>item.position);
assert(startingPositions.every(position=>Number.isFinite(position?.x)&&Number.isFinite(position?.y)),'Every node has finite initial coordinates before force layout');
assert.equal(new Set(startingPositions.map(position=>`${position.x},${position.y}`)).size,startingPositions.length,'Distinct initial coordinates prevent a coincident-position force-layout failure');
assert.equal(config.style.find(item=>item.selector==='edge').style['target-arrow-shape'],'triangle','Arrows follow the stored direction');
const nodeStyle=config.style.find(item=>item.selector==='node').style;
assert.equal(typeof nodeStyle.width,'number','Node size is not based on connection count or ranking');
graphEvents['tap:node']({target:{id:()=> 'paul-le-floch'}});
assert.equal(new URLSearchParams(pushed.at(-1).split('?')[1]).get('node'),'paul-le-floch');
assert(control('#pm-panel').innerHTML.includes('Paul Le Floch'));
graphEvents['tap:edge']({target:{data:()=> 'lefloch-jia-training'}});
assert.equal(new URLSearchParams(pushed.at(-1).split('?')[1]).get('edge'),'lefloch-jia-training');
assert(!new URLSearchParams(pushed.at(-1).split('?')[1]).has('node'),'Selecting a line clears node selection');
assert(control('#pm-panel').innerHTML.includes(escape(edges.get('lefloch-jia-training').detail)));
assert.equal(created,1,'Selecting entries or evidence preserves the existing graph and viewport');
assert.equal(control('#pm-show-details').hidden,false,'Selecting a relationship offers the mobile details jump');
control('#pm-show-details').events.click();assert(control('#pm-panel').scrolled&&control('#pm-panel').focused,'The details jump reaches and focuses the evidence panel');
onResize();assert.equal(resized,1);assert.equal(fits.length,0,'An unchanged resize notification preserves the current pan and zoom');
control('#pm-canvas').clientWidth=390;onResize();assert.equal(fits.length,1,'A changed viewport width refits the map');assert.equal(fits.at(-1)[1],28,'The narrow viewport uses compact fitting padding');
onResize();assert.equal(fits.length,1,'Repeated unchanged geometry does not reset the viewport');
control('#pm-canvas').clientHeight=520;onResize();assert.equal(fits.length,2,'A changed viewport height also refits the map');
control('#pm-relation').events.change({target:{value:'training'}});
const filteredRoute=new URLSearchParams(navigations.at(-1)[0].split('?')[1]);assert.equal(filteredRoute.get('relation'),'training');assert(!filteredRoute.has('node')&&!filteredRoute.has('edge'),'Changing filter clears stale selection');
assert.equal(navigations.at(-1)[1],'pm-relation','Filter rerender requests focus restoration');
assert(listeners.every(signal=>signal&&!signal.aborted),'Controller owns abortable event listeners');
api.close();api.close();assert.equal(destroyed,1,'Closing destroys the graph exactly once');assert.equal(disconnected,1,'Closing disconnects the resize observer exactly once');assert(listeners.every(signal=>signal.aborted),'Closing removes document and control listeners');
delete context.cytoscape;
api.bind(container,params(),()=>{});
assert(control('#pm-canvas').innerHTML.includes('readable relationship list'),'Renderer failure preserves the readable fallback');
assert(mapButtons.every(button=>button.disabled),'Unavailable map controls are disabled');assert(!control('#pm-show-details').disabled,'Readable evidence remains reachable when the graph cannot render');api.close();

const index=await read('index.html'),scripts=[...index.matchAll(/<script\b[^>]*\bsrc="([^"?]+)/g)].map(match=>match[1]);
for(const before of ['hub-utils','connections-data','exploration-data'])assert(scripts.indexOf(`./dist/${before}.js`)<scripts.indexOf('./dist/people-map.js'),`${before} loads before the map`);
assert(scripts.indexOf('./dist/people-map.js')<scripts.indexOf('./dist/explore.js'),'Map loads before exploration routes');
assert(scripts.findIndex(path=>/cytoscape/i.test(path))<scripts.indexOf('./dist/people-map.js'),'Graph renderer is ready before binding the map');
assert((await read('src/hub.ts')).includes('PeopleMap.close()'),'Leaving the route releases the map controller');

console.log(`People map checks passed: ${all.nodes.length} entries, ${all.edges.length} documented relationships, ${cases} filtered neighborhoods, exact sources, safe search, readable alternatives, shareable selection, finite layout initialization, mobile evidence access, resize behavior, cleanup, and fallback.`);
