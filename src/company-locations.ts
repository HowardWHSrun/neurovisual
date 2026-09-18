interface LocationCompany {
 id:string; name:string; country:string; city:string; region?:string; kind:string; summary:string; source:string;
}
interface CompanyPlace { name:string; count:number; href:string; region:string; }
interface CompanyPlaceGroup { name:string; region:string; places:CompanyPlace[]; }

const CompanyLocations=(()=>{
 const e=hubUtils.escapeHtml,u=hubUtils.sourceHref;
 const pageSize=12;
 const colors:Record<string,string>={'North America':'#347dc2',Europe:'#2b957c',Asia:'#c47739','Middle East':'#aa5d92',Oceania:'#7b64bd','Latin America':'#348f9c','Location not listed':'#66788d'};
 let observer:ResizeObserver|undefined;
 const countryOf=(c:LocationCompany)=>c.country?.trim()||'Country not listed';
 const cityOf=(c:LocationCompany)=>c.city?.trim()||'City not listed';
 const regionOf=(c:LocationCompany)=>c.region?.trim()||'Location not listed';
 const count=(n:number)=>`${n} ${n===1?'company':'companies'}`;
 const companies=():LocationCompany[]=>(window.neuroAtlas?.organizations||[]).filter(c=>['Company','Startup','Public company'].includes(c.kind));
 function link(params:URLSearchParams,patch:Record<string,string>={}){
  const next=new URLSearchParams({by:'countries',view:'companies'});
  for(const key of ['country','city','q','sort','page']){const value=key in patch?patch[key]:params.get(key);if(value)next.set(key,value);}
  return '#explore?'+next.toString();
 }
 function model(params:URLSearchParams){
  const all=companies(),country=params.get('country')||'',city=country?(params.get('city')||''):'';
  const q=(params.get('q')||'').trim(),sort=params.get('sort')==='name'?'name':'location';
  const countries=[...new Set(all.map(countryOf))].sort((a,b)=>a.localeCompare(b));
  const cities=[...new Set(all.filter(c=>countryOf(c)===country).map(cityOf))].sort((a,b)=>a.localeCompare(b));
  const rows=all.filter(c=>(!country||countryOf(c)===country)&&(!city||cityOf(c)===city)&&hubUtils.matches([c.name,c.summary,cityOf(c),countryOf(c),regionOf(c)].join(' '),q)).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):countryOf(a).localeCompare(countryOf(b))||cityOf(a).localeCompare(cityOf(b))||a.name.localeCompare(b.name));
  const pages=Math.max(1,Math.ceil(rows.length/pageSize)),requested=Number(params.get('page')||1);
  const page=Number.isFinite(requested)?Math.min(pages,Math.max(1,Math.floor(requested))):1;
  const groups:CompanyPlaceGroup[]=[];
  const add=(groupName:string,region:string,name:string,href:string)=>{
   let group=groups.find(g=>g.name===groupName);if(!group){group={name:groupName,region,places:[]};groups.push(group);}
   let place=group.places.find(p=>p.href===href);if(!place){place={name,href,region,count:0};group.places.push(place);}place.count++;
  };
  for(const c of rows){
   if(city)add(city,regionOf(c),c.name,'#org/'+encodeURIComponent(c.id));
   else if(country)add(country,regionOf(c),cityOf(c),link(params,{city:cityOf(c),page:''}));
   else add(regionOf(c),regionOf(c),countryOf(c),link(params,{country:countryOf(c),city:'',page:''}));
  }
  for(const g of groups)g.places.sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
  groups.sort((a,b)=>b.places.reduce((n,p)=>n+p.count,0)-a.places.reduce((n,p)=>n+p.count,0)||a.name.localeCompare(b.name));
  return {all,rows,country,city,q,sort,countries,cities,groups,page,pages,visible:rows.slice((page-1)*pageSize,page*pageSize)};
 }
 function layout(groups:CompanyPlaceGroup[],width:number,height:number){
  if(!groups.length)return [];
  const root=d3.hierarchy({children:groups.map(g=>({...g,children:g.places}))}).sum(d=>d.count||0);
  d3.treemap().size([width,height]).paddingInner(5).paddingOuter(d=>d.depth===1?Math.min(7,(d.y1-d.y0)/12,(d.x1-d.x0)/12):7).paddingTop(d=>d.depth===1?Math.min(30,Math.max(16,(d.y1-d.y0)*.25)):4).round(true)(root);
  return root.children||[];
 }
 function chart(groups:CompanyPlaceGroup[],width:number,height:number){
  const box=(n:any)=>`left:${n.x0/width*100}%;top:${n.y0/height*100}%;width:${(n.x1-n.x0)/width*100}%;height:${(n.y1-n.y0)/height*100}%;`;
  return layout(groups,width,height).map(g=>{
   const color=colors[g.data.region]||colors['Location not listed'];
   return `<div class="cl-region${g.y1-g.y0<96?' cl-region-compact':''}" style="${box(g)}--cl-color:${color}"><span>${e(g.data.name)}</span></div>`+g.children.map(n=>{
    const p=n.data as CompanyPlace,small=n.x1-n.x0<90||n.y1-n.y0<52;
    const hint=`${p.name} · ${count(p.count)}${p.href.startsWith('#org/')?' · Open company profile':' · Explore this location'}`;
    return `<a class="cl-cell${small?' cl-cell-small':''}" href="${e(p.href)}" data-cl-nav data-cl-hint="${e(hint)}" title="${e(hint)}" aria-label="${e(hint)}" style="${box(n)}--cl-color:${color}"><strong>${e(p.name)}</strong><span>${count(p.count)}</span></a>`;
   }).join('');
  }).join('');
 }
 // Official company career pages checked 17 September 2026; MCN added 18 September. Keep identity
 // matching explicit: the generic Kernel Ashby board is an unrelated business.
 const careers:Record<string,string>={'max-connectivity':'https://www.maxconnectivity.com/#careers',neuralink:'https://neuralink.com/careers/',neuropace:'https://www.neuropace.com/about-neuropace/neuropace-careers/','motif-neurotech':'https://motifneuro.tech/careers',synchron:'https://synchron.com/careers'};
 function careerUrl(c:LocationCompany){return careers[c.id]||'';}
 const external=(href:string,label:string)=>`<a href="${u(href)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
 function row(c:LocationCompany,params:URLSearchParams){
  const careers=careerUrl(c);
  return `<article class="cl-company" data-company-id="${e(c.id)}"><div class="cl-company-place"><a href="${e(link(params,{country:countryOf(c),city:'',page:''}))}" data-cl-nav>${e(countryOf(c))}</a><a href="${e(link(params,{country:countryOf(c),city:cityOf(c),page:''}))}" data-cl-nav>${e(cityOf(c))}</a></div><div class="cl-company-info"><h4><a href="#org/${encodeURIComponent(c.id)}">${e(c.name)} <span aria-hidden="true">→</span></a></h4><p>${e(c.summary||'Open the company profile for its work and sources.')}</p></div><div class="cl-company-actions">${careers?external(careers,'Careers'):''}${c.source?external(c.source,'Company website'):''}<a href="#org/${encodeURIComponent(c.id)}">View profile →</a></div></article>`;
 }
 function render(params=new URLSearchParams()){
  const m=model(params),level=m.city?'Companies':m.country?'Cities':'Countries';
  const options=(values:string[],value:string)=>[...(value&&!values.includes(value)?[value]:[]),...values].map(v=>`<option value="${e(v)}"${v===value?' selected':''}>${e(v)}</option>`).join('');
  const home=link(params,{country:'',city:'',page:''});
  const breadcrumbs=`<nav class="cl-breadcrumbs" aria-label="Company location"><a href="${e(home)}" data-cl-nav${!m.country?' aria-current="location"':''}>All locations</a>${m.country?`<span aria-hidden="true">/</span><a href="${e(link(params,{city:'',page:''}))}" data-cl-nav${!m.city?' aria-current="location"':''}>${e(m.country)}</a>`:''}${m.city?`<span aria-hidden="true">/</span><span aria-current="location">${e(m.city)}</span>`:''}</nav>`;
  const pager=m.pages>1?`<nav class="cl-pagination" aria-label="Company results pages">${m.page>1?`<a href="${e(link(params,{page:String(m.page-1)}))}" data-cl-nav data-cl-focus="cl-results-heading">← Previous</a>`:'<span></span>'}<span>Page ${m.page} of ${m.pages}</span>${m.page<m.pages?`<a href="${e(link(params,{page:String(m.page+1)}))}" data-cl-nav data-cl-focus="cl-results-heading">Next →</a>`:'<span></span>'}</nav>`:'';
  return `<section class="cl-page" aria-labelledby="cl-title"><header class="cl-heading"><div><span class="eyebrow">FIND YOUR NEXT WORKPLACE</span><h1 id="cl-title">Companies, by location.</h1><p>Explore a country, choose a city, and get to know the companies working there.</p></div><a href="#pathways" class="cl-career-link">Explore study &amp; careers ↗</a></header><form id="cl-filters" class="cl-filters"><label for="cl-query">Search companies<input id="cl-query" name="q" type="search" value="${e(m.q)}" placeholder="Name, technology, or place"></label><label for="cl-country">Country<select id="cl-country" name="country"><option value="">All countries</option>${options(m.countries,m.country)}</select></label><label for="cl-city">City<select id="cl-city" name="city"${!m.country?' disabled':''}><option value="">${m.country?'All cities':'Choose a country first'}</option>${options(m.cities,m.city)}</select></label><button type="submit">Search</button>${m.country||m.q?`<a href="${e(link(new URLSearchParams()))}" data-cl-nav>Reset</a>`:''}</form>${breadcrumbs}<div class="cl-map-heading"><h3>${e(m.city||m.country||'The company landscape')}</h3><span>${count(m.rows.length)}${!m.country?` · ${m.groups.reduce((n,g)=>n+g.places.length,0)} countries`:!m.city?` · ${m.groups.reduce((n,g)=>n+g.places.length,0)} cities`:''}</span></div>${m.rows.length?`<p class="cl-map-explainer">${level} sized by company count. ${m.city?'Each box is one company. Select one to open its profile.':`Select a ${m.country?'city':'country'} to explore.`}</p><div id="cl-treemap" class="cl-treemap" role="group" aria-label="${e(level+' treemap, sized by mapped company count')}" aria-describedby="cl-map-hint">${chart(m.groups,1100,470)}</div><p id="cl-map-hint" class="cl-map-hint">Color groups locations by region. Hover or focus a box for its full name and count.</p><details class="cl-places"><summary>Browse ${level.toLowerCase()} as a list</summary><div>${m.groups.flatMap(g=>g.places).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<a href="${e(p.href)}" data-cl-nav><span>${e(p.name)}</span><b>${count(p.count)}</b></a>`).join('')}</div></details>`:'<p class="cl-empty" role="status">No companies match these filters. Try another place or search term, or reset the filters.</p>'}<div class="cl-results-heading"><div><h3 id="cl-results-heading" tabindex="-1">${m.city?'Companies in '+e(m.city):m.country?'Companies in '+e(m.country):'Explore the companies'}</h3><p role="status">${m.rows.length?`${(m.page-1)*pageSize+1}–${Math.min(m.page*pageSize,m.rows.length)} of ${count(m.rows.length)}`:'0 companies'}</p></div><label for="cl-sort">Sort by<select id="cl-sort"><option value="location"${m.sort==='location'?' selected':''}>Location · A–Z</option><option value="name"${m.sort==='name'?' selected':''}>Company · A–Z</option></select></label></div><div class="cl-company-list">${m.visible.map(c=>row(c,params)).join('')}</div>${pager}<p class="cl-coverage">Locations are those recorded in the atlas, and may not include every office. Each company is counted once. Box area shows this collection’s coverage, not vacancies or company size. Check company websites for current roles and work locations.</p></section>`;
 }
 function close(){observer?.disconnect();observer=undefined;}
 function bind(container:HTMLElement,params:URLSearchParams,navigate:(hash:string,focusId?:string)=>void){
  close();
  const page=container.querySelector<HTMLElement>('.cl-page');if(!page)return;
  page.addEventListener('click',event=>{
   const a=(event.target as HTMLElement).closest<HTMLAnchorElement>('[data-cl-nav]');
   if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
   const href=a.getAttribute('href')!;if(!href.startsWith('#explore?'))return;
   event.preventDefault();navigate(href,a.dataset.clFocus||'cl-title');
   document.getElementById(a.dataset.clFocus||'cl-title')?.scrollIntoView({block:'start'});
  });
  const title=page.querySelector<HTMLElement>('#cl-title');title?.setAttribute('tabindex','-1');
  const form=page.querySelector<HTMLFormElement>('#cl-filters')!,country=page.querySelector<HTMLSelectElement>('#cl-country')!,city=page.querySelector<HTMLSelectElement>('#cl-city')!,query=page.querySelector<HTMLInputElement>('#cl-query')!;
  const update=(focus:string,resetCity=false)=>navigate(link(params,{q:query.value.trim(),country:country.value,city:resetCity?'':city.value,page:''}),focus);
  form.addEventListener('submit',event=>{event.preventDefault();update('cl-query');});
  country.addEventListener('change',()=>update('cl-country',true));
  city.addEventListener('change',()=>update('cl-city'));
  const sort=page.querySelector<HTMLSelectElement>('#cl-sort')!;
  sort.addEventListener('change',()=>navigate(link(params,{sort:sort.value,page:''}),'cl-sort'));
  const map=page.querySelector<HTMLElement>('#cl-treemap'),hint=page.querySelector<HTMLElement>('#cl-map-hint');
  if(map){
   const selected=model(params),groups=selected.groups;
   const showHint=(event:Event)=>{const cell=(event.target as HTMLElement).closest<HTMLElement>('[data-cl-hint]');if(cell&&hint)hint.textContent=cell.dataset.clHint!;};
   map.addEventListener('pointerover',showHint);map.addEventListener('focusin',showHint);
   let lastWidth=0;
   const resize=()=>{
    const width=Math.round(map.getBoundingClientRect().width);if(!width||width===lastWidth)return;lastWidth=width;
    const active=document.activeElement as HTMLAnchorElement,href=map.contains(active)?active.getAttribute('href'):null;
    const height=selected.city?Math.min(470,Math.max(190,Math.ceil(selected.rows.length/(width<600?2:4))*100)):width<600?520:470;map.style.height=height+'px';map.innerHTML=chart(groups,width,height);
    if(href)Array.from(map.querySelectorAll<HTMLAnchorElement>('a')).find(a=>a.getAttribute('href')===href)?.focus({preventScroll:true});
   };
   resize();observer=new ResizeObserver(resize);observer.observe(map);
  }
 }
 function records():HubRecord[]{return [{id:'company-locations',title:'Companies by location',description:'Explore neurotechnology companies by country and city, with company profiles and career links.',kind:'Company locations',href:link(new URLSearchParams()),keywords:'jobs careers employers country city region location treemap'}];}
 return {render,bind,close,records,model,layout};
})();
