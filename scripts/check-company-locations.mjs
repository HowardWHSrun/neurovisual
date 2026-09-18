import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const app=await read('src/app.ts'),start=app.indexOf('var L = [')+8,end=app.indexOf('\n    ];',start)+6;
assert(start>=8&&end>start,'The atlas exposes its canonical organization data');
const atlas=JSON.parse(JSON.stringify(vm.runInNewContext('('+app.slice(start,end)+')')));
const organizations=atlas.map(d=>({id:d.id,name:d.n,country:d.country,city:d.city,region:d.r,kind:d.k,summary:d.d,source:d.u}));
const expected=organizations.filter(c=>['Company','Startup','Public company'].includes(c.kind));
const observers=[],document={activeElement:null,getElementById(){return {scrollIntoView(){}};}};
class Observer {constructor(callback){this.callback=callback;this.disconnects=0;observers.push(this);}observe(node){this.node=node;}disconnect(){this.disconnects++;}}
const context=vm.createContext({URL,URLSearchParams,console,document,ResizeObserver:Observer,window:{neuroAtlas:{organizations}}});
for(const path of ['assets/d3.v7.min.js','dist/hub-utils.js','dist/company-locations.js'])vm.runInContext(await read(path),context,{filename:path});
const api=vm.runInContext('CompanyLocations',context),plain=value=>JSON.parse(JSON.stringify(value));
const params=value=>new URLSearchParams({by:'countries',view:'companies',...value});
const model=value=>plain(api.model(params(value)));
const sortedIds=rows=>rows.map(row=>row.id).sort();
const places=m=>m.groups.flatMap(group=>group.places);
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const attrs=(html,name)=>[...html.matchAll(new RegExp(`\\b${name}="([^"]*)"`,'g'))].map(match=>decode(match[1]));
const hrefs=html=>attrs(html,'href');
function render(value={}){
  const html=api.render(params(value)),ids=attrs(html,'id');
  assert(!/\b(?:undefined|NaN|Infinity)\b/.test(html),'Rendered values are complete');
  assert.equal(new Set(ids).size,ids.length,'Rendered IDs are unique');
  for(const href of hrefs(html))assert(href.startsWith('#')||['https:','http:'].includes(new URL(href).protocol),`Safe link ${href}`);
  return html;
}

const all=model();
assert.equal(all.rows.length,120,'Current collection contains 120 companies');
assert.equal(all.countries.length,29,'Current collection contains 29 countries');
assert.equal(new Set(all.rows.map(c=>c.country+'\0'+c.city)).size,86,'City counts use country-city pairs');
assert.deepEqual(sortedIds(all.rows),sortedIds(expected),'Include exactly companies, startups, and public companies from the atlas');
assert.equal(new Set(all.rows.map(c=>c.id)).size,all.rows.length,'Each company occurs once');
assert.equal(places(all).reduce((n,p)=>n+p.count,0),120,'Treemap total equals company coverage');
assert.equal(new Set(places(all).map(p=>p.href)).size,29,'Every country has one treemap destination');
for(const group of all.groups)for(const place of group.places){
  assert.equal(place.count,expected.filter(c=>c.country===place.name&&c.region===group.region).length,'Region and country counts reflect exact atlas locations');
}

const models=[all];
for(const country of all.countries){
  const m=model({country}),countryRows=expected.filter(c=>c.country===country);models.push(m);
  assert.deepEqual(sortedIds(m.rows),sortedIds(countryRows),`Country drilldown keeps exactly ${country}'s companies`);
  assert.equal(places(m).reduce((n,p)=>n+p.count,0),countryRows.length,'City cells preserve the country total');
  for(const place of places(m)){
    const next=new URLSearchParams(place.href.split('?')[1]);assert.equal(next.get('country'),country);assert.equal(next.get('city'),place.name);
    const city=model({country,city:place.name});models.push(city);
    assert.deepEqual(sortedIds(city.rows),sortedIds(countryRows.filter(c=>c.city===place.name)),'City drilldown keeps country identity');
    assert.deepEqual(places(city).map(p=>p.href).sort(),city.rows.map(c=>'#org/'+encodeURIComponent(c.id)).sort(),'City cells link directly to every company profile');
    assert(places(city).every(p=>p.count===1),'Every company is one cell at city level');
  }
}
// A synthetic UK company checks a same-name city without changing the atlas.
const initialOrganizations=context.window.neuroAtlas.organizations;
try{
  context.window.neuroAtlas.organizations=[...initialOrganizations,{id:'test-cambridge-uk',name:'Cambridge example',kind:'Company',country:'United Kingdom',city:'Cambridge',region:'Europe',summary:'Test only',source:'https://example.org/'}];
  const cambridgeUS=model({country:'United States',city:'Cambridge'}),cambridgeUK=model({country:'United Kingdom',city:'Cambridge'});
  assert(cambridgeUS.rows.length&&cambridgeUK.rows.length,'Both Cambridge locations are represented in the fixture');
  assert(!cambridgeUS.rows.some(c=>cambridgeUK.rows.some(other=>other.id===c.id)),'Cities with the same name in different countries never merge');
  assert.deepEqual(sortedIds(cambridgeUK.rows),['test-cambridge-uk']);
}finally{context.window.neuroAtlas.organizations=initialOrganizations;}


for(const value of [{country:'Missing country'},{country:'United States',city:'Missing city'},{q:'zzzz-unmatched-company'}]){
  const m=model(value);assert.equal(m.rows.length,0,'An unknown location or query remains an empty selection');assert.equal(m.groups.length,0);assert.equal(m.visible.length,0);
  const html=render(value);assert(html.includes('No companies match'),'Explain empty results');
  if(value.country)assert(html.includes(`value="${value.country}" selected`),'Keep a stale country visible');
  if(value.city)assert(html.includes(`value="${value.city}" selected`),'Keep a stale city visible');
}
const named=model({sort:'name'});assert.deepEqual(named.rows.map(c=>c.name),expected.map(c=>c.name).sort((a,b)=>a.localeCompare(b)),'Company name sorting is alphabetical');
const ordered=[...expected].sort((a,b)=>a.country.localeCompare(b.country)||a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
assert.deepEqual(sortedIds(all.rows),sortedIds(ordered));assert.deepEqual(all.rows.map(c=>c.id),ordered.map(c=>c.id),'Default sorting groups country then city then name');
const visited=[];
for(let page=1;page<=all.pages;page++){const m=model({page:String(page)});assert(m.visible.length<=12);visited.push(...m.visible.map(c=>c.id));}
assert.deepEqual(visited,all.rows.map(c=>c.id),'Paging traverses all companies once without gaps');
assert.equal(model({page:'99999'}).page,all.pages,'A stale page clamps to the final result page');
for(const page of ['-5','NaN','Infinity'])assert.equal(model({page}).page,1,'Invalid page values use the first page');
const neuralink=model({q:'  NEURALINK  '});assert(neuralink.rows.some(c=>c.id==='neuralink'),'Queries are case insensitive and trim whitespace');
const qCountry=model({country:'United States',q:'Houston'});assert(qCountry.rows.length);assert(qCountry.rows.every(c=>c.country==='United States'&&[c.name,c.summary,c.city,c.country,c.region].join(' ').toLowerCase().includes('houston')),'Search combines with country selection');
const contextModel=model({country:'United States',q:'neural',sort:'name',page:'2'});
for(const place of places(contextModel)){
  const next=new URLSearchParams(place.href.split('?')[1]);assert.equal(next.get('q'),'neural');assert.equal(next.get('sort'),'name');assert.equal(next.get('country'),'United States');assert(!next.has('page'),'Drilldown resets the result page');
}
const paged=render({country:'United States',sort:'name',page:'2'});
assert(hrefs(paged).some(href=>{const next=new URLSearchParams(href.split('?')[1]);return next.get('page')==='1'&&next.get('country')==='United States'&&next.get('sort')==='name';}),'Pagination preserves country and sort');

for(const m of models)for(const [width,height] of [[1100,470],[320,520]]){
  const groups=api.layout(m.groups,width,height),nodes=groups.flatMap(group=>[group,...group.children]);
  for(const n of nodes){
    assert([n.x0,n.x1,n.y0,n.y1].every(Number.isFinite),'Layout coordinates are finite');
    assert(n.x0>=0&&n.y0>=0&&n.x1<=width&&n.y1<=height,'Layout stays within its container');
    assert(n.x1>n.x0&&n.y1>n.y0,`Every location remains a positive-size target at width ${width}: ${n.data.name}`);
  }
  assert.equal(groups.flatMap(group=>group.children).length,places(m).length,'Layout includes every location');
}
assert.equal(api.layout([],320,520).length,0,'Empty selections have no phantom boxes');
render();render({country:'United States'});render({country:'United States',city:'Cambridge'});

// Hostile source text is rendered as text; unsafe URLs never become executable.
const original=context.window.neuroAtlas.organizations,payload='<img src=x onerror="alert(1)">';
try{
  context.window.neuroAtlas.organizations=[{id:'malicious',name:payload,country:'Test & Place',city:payload,region:payload,kind:'Company',summary:payload,source:'javascript:alert(1)'}];
  for(const value of [{},{country:'Test & Place'},{country:'Test & Place',city:payload},{q:payload}]){
    const html=render(value);assert(!html.includes('<img'));assert(!html.includes('href="javascript:'));assert(html.includes('&lt;img'),'Escape names, descriptions, filters, and labels');
  }
}finally{context.window.neuroAtlas.organizations=original;}
vm.runInContext('var jobsSnapshot={employerBoards:{Neuralink:"https://boards.greenhouse.io/neuralink"},jobs:[{title:"FAKE VACANCY SENTINEL",company:"Neuralink"}],jobCount:123456};',context);
const careerHtml=render({q:'Neuralink'});assert(hrefs(careerHtml).includes('https://neuralink.com/careers/'),'The exact employer receives its verified official careers page');assert(!hrefs(careerHtml).includes('https://boards.greenhouse.io/neuralink'),'Snapshot board guesses do not override verified career pages');
assert(!careerHtml.includes('FAKE VACANCY SENTINEL')&&!careerHtml.includes('123456'),'The company count does not become a job count');
assert(careerHtml.includes('not vacancies'),'Explain that company coverage is not vacancy availability');
const records=plain(api.records());assert(records.some(record=>record.href==='#explore?by=countries&view=companies'),'Global search reaches the location view');assert.equal(new Set(records.map(record=>record.id)).size,records.length);

// Exercise delegated navigation, native modifier clicks, filters, resize, and cleanup.
const element=(value='')=>({value,events:{},dataset:{},attributes:{},style:{},addEventListener(name,fn){this.events[name]=fn;},setAttribute(name,value){this.attributes[name]=value;}});
function fixture(){
  const nodes=Object.fromEntries(['cl-title','cl-filters','cl-country','cl-city','cl-query','cl-sort','cl-treemap','cl-map-hint'].map(id=>[id,element()]));
  const map=nodes['cl-treemap'];let html='';map.width=1100;map.writes=0;map.getBoundingClientRect=()=>({width:map.width});map.contains=node=>map.links?.includes(node);map.querySelectorAll=()=>map.links||[];
  Object.defineProperty(map,'innerHTML',{get(){return html;},set(value){html=value;map.writes++;map.links=hrefs(value).map(href=>({getAttribute(){return href;},focus(){document.activeElement=this;}}));}});
  const page=element();page.querySelector=selector=>nodes[selector.slice(1)]||null;
  return {page,nodes,map,container:{querySelector:selector=>selector==='.cl-page'?page:null}};
}
const f=fixture(),navigations=[];
f.nodes['cl-country'].value='United States';f.nodes['cl-city'].value='Cambridge';f.nodes['cl-query'].value='  neural  ';f.nodes['cl-sort'].value='name';
api.bind(f.container,params({country:'United States',q:'neural',page:'2'}),(...args)=>navigations.push(args));
assert.equal(observers.at(-1).node,f.map,'Observe the active treemap');assert.equal(f.map.style.height,'470px');
let prevented=0;const target={closest(){return {getAttribute(){return '#explore?by=countries&view=companies&country=Japan';},dataset:{}};}};
f.page.events.click({target,button:0,preventDefault(){prevented++;}});assert.equal(prevented,1);assert.equal(navigations.at(-1)[1],'cl-title','Drilldown focuses the new heading');
const before=navigations.length;
for(const modifiers of [{button:1},{button:0,ctrlKey:true},{button:0,metaKey:true},{button:0,shiftKey:true},{button:0,altKey:true}])f.page.events.click({target,...modifiers,preventDefault(){prevented++;}});
assert.equal(navigations.length,before,'Modified and middle clicks retain native behavior');assert.equal(prevented,1);
f.nodes['cl-country'].value='Canada';f.nodes['cl-country'].events.change();
let next=new URLSearchParams(navigations.at(-1)[0].split('?')[1]);assert.equal(next.get('country'),'Canada');assert(!next.has('city')&&!next.has('page'),'Changing country clears city and pagination');assert.equal(next.get('q'),'neural');
f.nodes['cl-filters'].events.submit({preventDefault(){}});assert.equal(navigations.at(-1)[1],'cl-query','Search restores input focus');
f.nodes['cl-sort'].events.change();next=new URLSearchParams(navigations.at(-1)[0].split('?')[1]);assert.equal(next.get('sort'),'name');assert(!next.has('page'));
const firstObserver=observers.at(-1),focused=f.map.links[0];assert(focused);document.activeElement=focused;const focusedHref=focused.getAttribute('href');f.map.width=320;firstObserver.callback();
assert.equal(f.map.style.height,'520px','Phone width uses the taller treemap');assert.equal(document.activeElement.getAttribute('href'),focusedHref,'Resize preserves the focused location');
const writes=f.map.writes;firstObserver.callback();assert.equal(f.map.writes,writes,'An unchanged width does not redraw the map');
const second=fixture();api.bind(second.container,params(),()=>{});assert.equal(firstObserver.disconnects,1,'Rebinding disconnects the previous observer');
const lastObserver=observers.at(-1);api.close();api.close();assert.equal(lastObserver.disconnects,1,'Route cleanup is idempotent');

console.log('Company location checks passed: 120 companies, 29 countries, 86 country-city pairs, exact drilldowns, URL context, search/sort/pagination, safe rendering, truthful career links, desktop/mobile layout, focus, native navigation, and observer cleanup.');
