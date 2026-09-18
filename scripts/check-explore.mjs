import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const [data,people,labs,connections,visuals]=await Promise.all(['exploration','exploration-people','labs','connections','visuals'].map(async name=>JSON.parse(await read(`data/${name}.json`))));
const labById=new Map(labs.labs.map(l=>[l.id,l])),nodeById=new Map(connections.nodes.map(n=>[n.id,n])),edgeById=new Map(connections.edges.map(e=>[e.id,e]));
const visualByLab=new Map(visuals.items.map(item=>[item.labId,item]));
const unique=(items,label)=>assert.equal(new Set(items.map(x=>x.id)).size,items.length,`${label} have unique IDs`);
const validSource=(source,label)=>{assert(source?.title?.trim(),`${label} has a source title`);assert.equal(new URL(source.url).protocol,'https:',`${label} uses an HTTPS source`);};
unique(data.problems,'Problem groups');unique(people.paths,'People paths');
assert(data.problems.length && people.paths.length,'Provide both problem groups and people paths');
for(const p of data.problems){
  assert.match(p.id,/^[a-z0-9-]+$/);assert(p.title && p.question && p.summary && p.labLinks.length,`Complete problem ${p.id}`);
  assert.equal(new Set(p.labLinks.map(x=>x.labId)).size,p.labLinks.length,`No duplicate labs in ${p.id}`);
  for(const entry of p.labLinks){assert(labById.has(entry.labId),`Known lab ${entry.labId}`);assert(entry.reason);assert(['Direct focus','Enabling research'].includes(entry.relationship));validSource(entry.source,`${p.id}/${entry.labId}`);}
  if(p.imageLabId){assert(visualByLab.has(p.imageLabId),`Exact sourced photo for ${p.imageLabId}`);assert(p.labLinks.some(x=>x.labId===p.imageLabId),`Problem photo belongs to a listed lab in ${p.id}`);}
}
for(const p of people.paths){
  assert.match(p.id,/^[a-z0-9-]+$/);assert(p.title && p.summary && p.relationships.length,`Complete people path ${p.id}`);
  for(const id of p.people)assert.equal(nodeById.get(id)?.kind,'Person',`Known person ${id}`);
  for(const id of p.nodeIds)assert(nodeById.has(id),`Known graph node ${id}`);
  for(const id of p.edgeIds)assert(edgeById.has(id),`Known graph edge ${id}`);
  if(p.imageNodeId)assert(nodeById.get(p.imageNodeId)?.image,`Exact portrait for ${p.imageNodeId}`);
  const [route,query]=p.href.split('?'),params=new URLSearchParams(query),focus=decodeURIComponent(route.split('/')[1]||'');
  assert(route.startsWith('#connections/') && nodeById.has(focus),`Supported network route for ${p.id}`);assert.equal(params.get('view'),'network');
  assert(p.edgeIds.includes(params.get('edge')),`Selected edge belongs to ${p.id}`);
  const nearby=new Set([focus]);
  for(let depth=0;depth<2;depth++){const before=new Set(nearby);for(const edge of connections.edges)if(edge.basis==='documented'&&(before.has(edge.from)||before.has(edge.to))){nearby.add(edge.from);nearby.add(edge.to);}}
  for(const rel of p.relationships){
    const edge=edgeById.get(rel.edgeId);assert(edge,`Known relationship ${rel.edgeId}`);assert.equal(edge.basis,'documented');
    assert.equal(rel.from,edge.from);assert.equal(rel.to,edge.to);assert(p.edgeIds.includes(rel.edgeId));
    assert(nearby.has(edge.from)&&nearby.has(edge.to),`Relationship visible from ${p.href}`);
    assert(rel.type && rel.description);validSource(rel.source,rel.edgeId);
  }
}

// Read the atlas's literal records without booting its chart or DOM controller.
const app=await read('src/app.ts'),start=app.indexOf('var L = [')+8,end=app.indexOf('\n    ];',start)+6;
assert(start>=8 && end>start,'Atlas organization data is available');
const atlasRows=vm.runInNewContext('('+app.slice(start,end)+')');
const organizations=atlasRows.map(d=>({id:d.id,name:d.n,country:d.country,city:d.city,region:d.r,kind:d.k,summary:d.d,source:d.u}));
const ctx=vm.createContext({URL,URLSearchParams,console,window:{neuroAtlas:{organizations},scrollTo(){}}});
for(const name of ['hub-utils','jobs-data','ideas-data','company-media','labs-data','visuals-data','connections-data','visuals','exploration-data','people-data','people','people-workplaces','people-map','company-locations','explore'])vm.runInContext(await read(`dist/${name}.js`),ctx);
assert.equal(JSON.stringify(vm.runInContext('neuroExplorationData',ctx)),JSON.stringify(data),'Rebuild problem data');
assert.equal(JSON.stringify(vm.runInContext('neuroExplorationPeopleData',ctx)),JSON.stringify(people),'Rebuild people data');
const api=vm.runInContext('NeuroExplore',ctx),escape=vm.runInContext('hubUtils.escapeHtml',ctx);
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const hrefs=html=>[...html.matchAll(/\bhref="([^"]*)"/g)].map(m=>decode(m[1]));
function safeRender(html){
  assert(!/\bundefined\b|\bNaN\b/.test(html),'Complete rendered values');assert(!html.includes('<iframe'),'Exploration does not preload videos');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Unique rendered IDs');
  for(const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)){const value=decode(m[1]);assert(value.startsWith('#')||value.startsWith('./')||/^https?:$/.test(new URL(value).protocol),`Safe rendered URL ${value}`);}
}
const render=params=>{const html=api.render(new URLSearchParams(params));safeRender(html);return html;};
const lensIds=['problems','organizations','people','countries'];
for(const by of lensIds){
  const html=render({by});assert(html.includes(`data-ex-view="${by}"`));
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1,'Exactly one active exploration lens');
  for(const lens of lensIds)assert(hrefs(html).includes(`#explore?by=${lens}`),`Navigate from ${by} to ${lens}`);
}
const locationsHref='#explore?by=countries&view=companies';
assert(hrefs(render({by:'organizations'})).includes(locationsHref),'Organization discovery links to companies by location');
const locationApi=vm.runInContext('CompanyLocations',ctx),originalLocationRender=locationApi.render,originalLocationBind=locationApi.bind;
const locationCalls=[];
try{
  locationApi.render=params=>{locationCalls.push(['render',params.toString()]);return '<div data-company-location-test>Company location view</div>';};
  locationApi.bind=(_container,params)=>locationCalls.push(['bind',params.toString()]);
  const params={by:'countries',view:'companies',country:'United States',city:'Austin'};
  const html=render(params);assert(html.includes('data-company-location-test'),'The location route renders the location module');
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1,'The location view retains one active exploration lens');
  assert(hrefs(html).includes(locationsHref)&&hrefs(html).includes('#explore?by=countries'),'Both company and lab location views remain available');
  api.bind({querySelector(){return null;},querySelectorAll(){return [];}},new URLSearchParams(params),()=>{});
  assert.deepEqual(locationCalls.map(call=>call[0]),['render','bind'],'Location view renders and binds once');
  for(const other of [{by:'countries'},{by:'countries',country:'United States'},{by:'organizations',view:'companies'}]){
    render(other);api.bind({querySelector(){return null;},querySelectorAll(){return [];}},new URLSearchParams(other),()=>{});
  }
  assert.equal(locationCalls.length,2,'Other exploration views do not render or bind the company location module');
}finally{locationApi.render=originalLocationRender;locationApi.bind=originalLocationBind;}
const problemListing=render({by:'problems'});
for(const p of data.problems){
  assert(hrefs(problemListing).includes('#explore?'+new URLSearchParams({by:'problems',problem:p.id})));
  const html=render({by:'problems',problem:p.id});assert(html.includes(escape(p.title)));assert(html.includes(escape(p.summary)));
  for(const item of p.labLinks){assert(hrefs(html).includes('#labs/'+item.labId),`Open lab from ${p.id}`);assert(html.includes(escape(item.reason)));assert(hrefs(html).includes(new URL(item.source.url).href),`Read exact supporting source for ${p.id}/${item.labId}`);}
  if(p.imageLabId)assert(html.includes(escape(new URL(visualByLab.get(p.imageLabId).image.url).href)),`Use ${p.imageLabId}'s own photo`);
}
const labRowLinks=html=>[...html.matchAll(/<article class="ex-lab-row">([\s\S]*?)<\/article>/g)].flatMap(m=>hrefs(m[1]).filter(href=>href.startsWith('#labs/'))).sort();
const selectedCountry=html=>{
  const select=html.match(/<select\b[^>]*id="ex-problem-country"[^>]*>([\s\S]*?)<\/select>/)?.[1];assert(select,'Problem country selector exists');
  const option=[...select.matchAll(/<option\b([^>]*)>/g)].find(m=>/(?:^|\s)selected(?:\s|$|=)/.test(m[1]));
  return option?decode(option[1].match(/\bvalue="([^"]*)"/)?.[1]||''):'';
};
const usVision=render({by:'problems',problem:'vision',country:'United States'});
assert.deepEqual(labRowLinks(usVision),['#labs/rice-luan','#labs/rice-xie'],'Combining vision and country keeps only the two US lab rows');
assert(usVision.includes('2 of 6 selected research starting points · United States'),'Combined filter reports the selected and total counts');
assert.equal(selectedCountry(usVision),'United States');
assert(hrefs(usVision).includes('#explore?by=countries&country=United+States'),'Lab rows lead back to their country');
const unavailableCountry='No mapped country',unavailableVision=render({by:'problems',problem:'vision',country:unavailableCountry});
assert.deepEqual(labRowLinks(unavailableVision),[],'An unmatched country does not silently show unfiltered labs');
assert.equal(selectedCountry(unavailableVision),unavailableCountry,'Keep an unmatched selection visible');
assert(unavailableVision.includes('0 of 6 selected research starting points')&&unavailableVision.includes('No selected labs in this country'),'Explain the empty result');
assert(hrefs(unavailableVision).includes('#explore?by=problems&problem=vision'),'Clear the country while retaining the problem');
const peopleHtml=render({by:'people',view:'map'});
assert(peopleHtml.includes('id="pm-canvas"'),'The people lens opens the native map');
assert(!peopleHtml.includes('ex-person-grid'),'Long story cards are replaced by the interactive map');
for(const path of people.paths){
  const [route,query]=path.href.split('?'),focus=decodeURIComponent(route.split('/')[1]),edge=new URLSearchParams(query).get('edge');
  assert(hrefs(peopleHtml).some(href=>{if(!href.startsWith('#explore?'))return false;const selection=new URLSearchParams(href.split('?')[1]);return selection.get('by')==='people'&&selection.get('focus')===focus&&selection.get('edge')===edge&&selection.get('depth')==='2';}),`Keep ${path.id} as a focused map shortcut`);
}

assert(organizations.some(c=>c.kind==='Startup')&&organizations.some(c=>c.kind==='Public company'),'Country coverage includes private startups and public companies');
const companies=organizations.filter(c=>['Company','Startup','Public company'].includes(c.kind)&&c.country);
const countries=[...new Set([...labs.labs.map(l=>l.country),...companies.map(c=>c.country)])];
const countryListing=render({by:'countries'});
assert(hrefs(countryListing).includes(locationsHref),'Country guides keep company location discovery visible');
for(const country of countries){
  assert(hrefs(countryListing).includes('#explore?'+new URLSearchParams({by:'countries',country})),`Country listing links to ${country}`);
  const html=render({by:'countries',country});assert(html.includes(escape(country)));
  if(companies.some(c=>c.country===country))assert(hrefs(html).includes('#explore?'+new URLSearchParams({by:'countries',view:'companies',country})),`Country guide opens its exact company location view for ${country}`);
  for(const lab of labs.labs.filter(l=>l.country===country))assert(hrefs(html).includes('#labs/'+lab.id),`Keep ${lab.id} in ${country}`);
  for(const company of companies.filter(c=>c.country===country)){assert(hrefs(html).includes('#org/'+encodeURIComponent(company.id)),`Keep ${company.id} in ${country}`);if(company.source)assert(hrefs(html).includes(new URL(company.source).href));}
  for(const company of companies.filter(c=>c.country!==country))assert(!hrefs(html).includes('#org/'+encodeURIComponent(company.id)),`Exclude other countries from ${country}`);
  for(const p of data.problems){
    const applicable=p.labLinks.some(x=>labById.get(x.labId).country===country),problemHref='#explore?'+new URLSearchParams({by:'problems',problem:p.id,country});
    assert.equal(hrefs(html).includes(problemHref),applicable,`${country} links to applicable problems with its country selection`);
  }
}
const records=api.records();unique(records,'Search records');
for(const problem of data.problems)assert(records.some(r=>r.id==='explore-problem-'+problem.id&&r.kind==='Problem to solve'));
for(const path of people.paths)assert(records.some(r=>r.href===path.href&&r.kind==='People connection'));
for(const country of countries)assert(records.some(r=>r.kind==='Country guide'&&r.href==='#explore?'+new URLSearchParams({by:'countries',country})));

// Companies can introduce a country without a curated lab profile; multinational
// records remain discoverable without being counted as additional countries.
ctx.window.neuroAtlas.organizations=[
  {id:'explore-test-company',name:'A <test> company',kind:'Company',country:'Testland',city:'Example City',summary:'A & B',source:'https://example.org/company'},
  {id:'explore-test-network',name:'Excluded network',kind:'Network',country:'Testland',source:'https://example.org/network'},
  ...['Global','European Union'].map((country,i)=>({id:'explore-test-global-'+i,name:'Distributed company '+i,kind:'Company',country,summary:'Across locations',source:'https://example.org/global'}))
];
const syntheticListing=render({by:'countries'}),labCountries=new Set(labs.labs.map(l=>l.country));
assert(syntheticListing.includes(`<span>${labCountries.size+1} countries</span>`),'Global and EU do not inflate country count');
assert(syntheticListing.includes('Across countries'));
const syntheticCountry=render({by:'countries',country:'Testland'});
assert(hrefs(syntheticCountry).includes('#org/explore-test-company'));assert(!hrefs(syntheticCountry).includes('#org/explore-test-network'),'Include only companies from the atlas export');
assert(syntheticCountry.includes('A &lt;test&gt; company'),'Escape dynamic company names');
assert(api.records().some(r=>r.title.includes('Testland')),'Company-only country enters search');
ctx.window.neuroAtlas=undefined;
assert(hrefs(render({by:'countries'})).some(href=>href.includes('country=')),'Lab country navigation works when atlas is unavailable');
ctx.window.neuroAtlas={organizations};

for(const params of [{by:'missing'},{by:'problems',problem:'missing'},{by:'countries',country:'missing'},{by:'<img src=x onerror=alert(1)>'}])assert(!render(params).includes('<img src=x'),'Invalid selections do not inject markup');
const liveData=vm.runInContext('neuroExplorationData',ctx),firstProblem=liveData.problems[0],originalTitle=firstProblem.title,originalSource=firstProblem.labLinks[0].source;
try{
  firstProblem.title='<img src=x onerror="alert(1)">';firstProblem.labLinks[0].source={title:'Unsafe source',url:'javascript:alert(1)'};
  const html=render({by:'problems',problem:firstProblem.id});assert(html.includes('&lt;img src=x'));assert(!html.includes('<img src=x'));assert(!hrefs(html).some(href=>href.startsWith('javascript:')),'Reject non-web source schemes');
}finally{firstProblem.title=originalTitle;firstProblem.labLinks[0].source=originalSource;}

// Ordinary clicks stay in the exploration flow. Modifier and middle clicks keep
// the browser's native new-tab behavior.
const anchor={events:{},addEventListener(type,fn){this.events[type]=fn;},getAttribute(){return '#explore?by=people';}},navigated=[];
api.bind({querySelector(){return null;},querySelectorAll(selector){return selector==='[data-ex-nav]'?[anchor]:[];}},new URLSearchParams(),hash=>navigated.push(hash));
let prevented=0;anchor.events.click({button:0,preventDefault(){prevented++;}});assert.deepEqual(navigated,['#explore?by=people']);assert.equal(prevented,1);
for(const event of [{button:1},{button:0,ctrlKey:true},{button:0,metaKey:true},{button:0,shiftKey:true},{button:0,altKey:true}])anchor.events.click({...event,preventDefault(){prevented++;}});
assert.equal(navigated.length,1);assert.equal(prevented,1,'Preserve native modifier clicks');
const countryControl={value:'United States',events:{},addEventListener(type,fn){this.events[type]=fn;}},countryForm={events:{},addEventListener(type,fn){this.events[type]=fn;}},countryNavigations=[];
api.bind({querySelector(selector){return selector==='#ex-problem-country'?countryControl:selector==='#ex-problem-filter'?countryForm:null;},querySelectorAll(){return [];}},new URLSearchParams({by:'problems',problem:'vision'}),(...args)=>countryNavigations.push(args));
countryControl.events.change();
assert.deepEqual(countryNavigations.at(-1),['#explore?by=problems&problem=vision&country=United+States','ex-problem-country'],'Changing country preserves the problem and requests focus on the selector');
countryControl.value='';let formPrevented=false;
countryForm.events.submit({preventDefault(){formPrevented=true;}});
assert(formPrevented,'The filter form submits within the exploration flow');
assert.deepEqual(countryNavigations.at(-1),['#explore?by=problems&problem=vision','ex-problem-country'],'Clearing country retains the selected problem and focus');
console.log(`Exploration checks passed: ${data.problems.length} problems, ${people.paths.length} people paths, four lenses, ${countries.length} country/location guides, exact lab photos and sources, network links, dynamic company coverage, safe rendering, reciprocal problem/country links, combined filters, and navigation.`);
