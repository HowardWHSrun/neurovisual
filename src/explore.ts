declare var neuroExplorationData:any;
declare var neuroExplorationPeopleData:any;

const NeuroExplore=(()=>{
 const e=hubUtils.escapeHtml,u=hubUtils.sourceHref;
 const lenses=[['problems','Problems to solve'],['organizations','Companies & labs'],['people','People & connections'],['countries','Countries']];
 const link=(by:string,params:Record<string,string>={})=>'#explore?'+new URLSearchParams({by,...params}).toString();
 const lab=(id:string)=>neuroLabsData.labs.find(l=>l.id===id);
 const node=(id:string)=>neuroConnectionsData.nodes.find(n=>n.id===id);
 const problems=():any[]=>typeof neuroExplorationData!=='undefined'?neuroExplorationData.problems||[]:[];
 const paths=():any[]=>typeof neuroExplorationPeopleData!=='undefined'?neuroExplorationPeopleData.paths||[]:[];
 const visual=(id:string)=>NeuroVisuals.items().find(m=>m.id===id);
 const labVisual=(id:string)=>visual('lab-'+id);
 const profile=(id:string)=>'#labs/'+encodeURIComponent(id);
 const source=(url:string,title:string)=>`<a href="${u(url)}" target="_blank" rel="noopener noreferrer">${e(title)} <span aria-hidden="true">↗</span></a>`;

 function photo(m:VisualItem|undefined,href:string,priority=false){
  if(!m)return '';
  return `<figure class="ex-photo"><a class="ex-card-media" href="${e(href)}" data-ex-nav aria-label="${e('Explore '+m.title)}">${NeuroVisuals.picture(m,priority)}</a><figcaption><span class="ex-photo-title">${e(m.title)}</span><details class="ex-credit"><summary>Image context &amp; source</summary><p>${e(m.image.caption)}</p>${source(m.image.source,m.image.credit)}${m.image.license?source(m.image.license.url,m.image.license.label+' · image unmodified'):''}</details></figcaption></figure>`;
 }
 function head(by:string){
  return `<header class="ex-head"><span class="eyebrow">EXPLORE NEUROENGINEERING</span><h1>One field. Four ways in.</h1><p>Start with a question, a group, a person, or a place. Follow the same research from a different angle.</p></header><nav class="ex-tabs" aria-label="Ways to explore neuroengineering">${lenses.map(([id,title])=>`<a href="${e(link(id))}" data-ex-nav${by===id?' aria-current="page"':''}>${e(title)}</a>`).join('')}</nav>`;
 }
 function intro(eyebrow:string,title:string,text:string){return `<div class="ex-intro"><span class="eyebrow">${e(eyebrow)}</span><h2>${e(title)}</h2><p>${e(text)}</p></div>`;}
 function problemCard(p:any){
  const href=link('problems',{problem:p.id});
  return `<article class="ex-card">${photo(labVisual(p.imageLabId),href)}<div class="ex-card-body"><span class="ex-card-count">${(p.labLinks||[]).length} starting points</span><h3 class="ex-card-title"><a href="${e(href)}" data-ex-nav>${e(p.title)} <span aria-hidden="true">→</span></a></h3><p>${e(p.question)}</p></div></article>`;
 }
 function labRow(l:LabProfile,why='',relationship='',ref?:{title:string;url:string}){
  const first=ref||l.sources[0];
  return `<article class="ex-lab-row"><div><span class="ex-label">${e(l.institution)} · <a href="${e(link('countries',{country:l.country}))}" data-ex-nav>${e(l.country)}</a></span><h3><a href="${e(profile(l.id))}">${e(l.name)} <span aria-hidden="true">→</span></a></h3><p class="ex-lab-leaders">${e(l.leaders.join(' · '))}</p>${why?`<p>${relationship?`<span class="ex-relationship">${e(relationship)}</span> `:''}${e(why)}</p>`:`<p>${e(l.themes.join(' · '))}</p>`}</div>${first?`<div class="ex-sources">${source(first.url,'Original source')}</div>`:''}</article>`;
 }
 function problemPage(p:any,params:URLSearchParams){
  const all=(p.labLinks||[]).filter((x:any)=>lab(x.labId));
  const selectedCountry=params.get('country')||'';
  const countryOptions=[...new Set<string>(all.map((x:any)=>lab(x.labId)!.country))].sort();
  const items=all.filter((x:any)=>!selectedCountry||lab(x.labId)!.country===selectedCountry);
  const filter=`<form id="ex-problem-filter" class="ex-problem-filter"><label for="ex-problem-country">Narrow by country<select id="ex-problem-country" name="country"><option value="">All countries</option>${selectedCountry&&!countryOptions.includes(selectedCountry)?`<option selected value="${e(selectedCountry)}">${e(selectedCountry)}</option>`:''}${countryOptions.map(country=>`<option value="${e(country)}"${country===selectedCountry?' selected':''}>${e(country)}</option>`).join('')}</select></label><p role="status">${items.length} of ${all.length} selected research starting points${selectedCountry?' · '+e(selectedCountry):''}</p>${selectedCountry?`<a href="${e(link('problems',{problem:p.id}))}" data-ex-nav>Show all countries →</a>`:''}</form>`;
  const guide:Record<string,string>={vision:'bci',movement:'bci',communication:'signals','memory-aging':'computation','neurological-health':'stimulation','neural-repair':'regeneration','understanding-brain':'imaging','research-tools':'interfaces'};
  return `<a class="ex-back" href="${e(link('problems'))}" data-ex-nav>← All problems to solve</a><section class="ex-detail-head"><div><span class="eyebrow">THE QUESTION THAT CONNECTS THIS WORK</span><h2>${e(p.title)}</h2><p class="ex-question">${e(p.question)}</p><p>${e(p.summary)}</p><span class="ex-card-count">${all.length} selected research starting points</span></div>${photo(labVisual(p.imageLabId),profile(p.imageLabId),true)}</section>${filter}<section class="ex-lab-list" aria-label="Research connected to this problem">${!items.length?'<p class="ex-empty">No selected labs in this country for this question. Choose another country or show all countries.</p>':''}${items.map((x:any)=>labRow(lab(x.labId)!,x.reason,x.relationship,x.source)).join('')}</section><div class="ex-actions"><a href="#topic/${e(guide[p.id]||'bci')}">Learn the underlying ideas →</a><a href="#labs">Explore all lab profiles →</a></div><details class="ex-note"><summary>How these groups were chosen</summary><p>These are selected starting points, and a lab can appear in several groups. “Direct focus” connects to the stated problem; “Enabling research” develops tools or basic understanding that may support future work. Open each source for the actual study context and evidence.</p></details>`;
 }
 function problemView(params:URLSearchParams){
  const all=problems(),selected=all.find(p=>p.id===params.get('problem'));
  if(selected)return problemPage(selected,params);
  return `${params.has('problem')?'<p class="ex-note" role="status">That problem group is not in this collection. Choose a starting point below.</p>':''}${intro('START WITH THE PURPOSE','What are people trying to solve?','Choose a human need or a research question. Then see the labs, methods, and original work connected to it.')}<div class="ex-grid ex-problem-grid">${all.map(problemCard).join('')}</div><p class="ex-note">These groups overlap: one technology can help answer several questions.</p>`;
 }
 function organizations(){
  const labImage=labVisual('rice-luan'),companyImage=visual('company-bisc');
  return `${intro('START WITH A GROUP','Who is doing the work?','Look inside a laboratory or explore a company. Each profile connects its approach to projects and original sources.')}<div class="ex-grid ex-organization-grid"><article class="ex-card">${photo(labImage,'#labs',true)}<div class="ex-card-body"><span class="ex-card-count">${neuroLabsData.labs.length} mapped lab profiles</span><h3 class="ex-card-title"><a href="#labs">Research labs <span aria-hidden="true">→</span></a></h3><p>See what each group studies, how it works, and which projects to read first.</p><a href="#labs?view=schools">Find labs by university →</a></div></article><article class="ex-card">${photo(companyImage,'#organizations',true)}<div class="ex-card-body"><span class="ex-card-count">Companies, institutes &amp; research programs</span><h3 class="ex-card-title"><a href="#organizations">Organization atlas <span aria-hidden="true">→</span></a></h3><p>Explore the wider ecosystem, from research teams to the companies developing interfaces and tools.</p><a href="#connections">Follow company research origins →</a></div></article></div><aside class="ex-next"><div><span class="eyebrow">FOLLOW THE IDEA</span><h3>How did research become a company?</h3><p>Read the people, experiments, and technology behind each company history.</p></div><a href="#connections">Explore company origins →</a></aside>`;
 }
 function pathCard(p:any,index:number){
  const image=p.imageNodeId?visual('person-'+p.imageNodeId):undefined;
  const relationshipCount=(p.relationships||[]).length;
  return `<article class="ex-person-card${image?' ex-person-feature':''}">${photo(image,p.href,index===0)}<div class="ex-card-body"><span class="ex-label">${e(p.label||'A RESEARCH CONNECTION')}</span><h3><a href="${e(p.href)}">${e(p.title)} <span aria-hidden="true">→</span></a></h3><p>${e(p.summary)}</p><div class="ex-trail" aria-label="People in this story">${(p.people||[]).map((id:string)=>{const n=node(id);return n?`<a class="ex-trail-node" href="#connections/${encodeURIComponent(n.id)}?view=network">${e(n.name)}</a>`:'';}).join('')}</div><details class="ex-path-evidence"><summary>Read ${relationshipCount} ${relationshipCount===1?'relationship':'relationships'} &amp; sources</summary><ol>${(p.relationships||[]).map((r:any)=>`<li><span class="ex-label">${e(r.type)}</span><p><strong>${e(node(r.from)?.name||r.from)}</strong> → <strong>${e(node(r.to)?.name||r.to)}</strong></p><p>${e(r.description)}</p>${r.limit?`<p class="ex-note">${e(r.limit)}</p>`:''}<div class="ex-sources">${r.source?source(r.source.url,r.source.title):''}</div></li>`).join('')}</ol></details><a class="ex-path-link" href="${e(p.href)}">Follow this connection in the network →</a></div></article>`;
 }
 function people(){
  return `${intro('START WITH THE PEOPLE','How are these scientists connected?','Follow a few real relationships first: who trained whom, who worked together, and how an idea reached a company.')}<div class="ex-person-grid">${paths().map(pathCard).join('')}</div><div class="ex-actions"><a href="#connections?view=network">Explore the whole research network →</a><a href="#people">Browse researcher profiles →</a></div><details class="ex-note"><summary>What does a connection mean?</summary><p>Each relationship has its own label and source. Training, co-authorship, collaboration, and company formation describe different connections. A path through the network does not establish that a technology descended from another.</p></details>`;
 }
 function companyEntries():any[]{return (window.neuroAtlas?.organizations||[]).filter(c=>['Company','Startup','Public company'].includes(c.kind));}
 const isCountry=(country:string)=>!['Global','European Union'].includes(country);
 function countryEntries(){
  const companies=companyEntries();
  return [...new Set([...neuroLabsData.labs.map(l=>l.country),...companies.map(c=>c.country)])].filter(Boolean).sort((a,b)=>a.localeCompare(b)).map(country=>({country,labs:neuroLabsData.labs.filter(l=>l.country===country).sort((a,b)=>a.institution.localeCompare(b.institution)||a.name.localeCompare(b.name)),companies:companies.filter(c=>c.country===country).sort((a,b)=>a.name.localeCompare(b.name))}));
 }
 function companyRow(c:any){return `<article class="ex-lab-row"><div><span class="ex-label">COMPANY · ${e(c.city||c.country)}</span><h3><a href="#org/${encodeURIComponent(c.id)}">${e(c.name)} <span aria-hidden="true">→</span></a></h3><p>${e(c.summary)}</p></div>${c.source?`<div class="ex-sources">${source(c.source,'Original source')}</div>`:''}</article>`;}
 function countryCount(x:{labs:LabProfile[];companies:any[]}){return `${x.labs.length} lab ${x.labs.length===1?'profile':'profiles'} · ${x.companies.length} ${x.companies.length===1?'company':'companies'}`;}
 function countries(params:URLSearchParams){
  const entries=countryEntries(),selected=entries.find(x=>x.country===params.get('country'));
  if(selected){
   const related=problems().map(p=>({problem:p,count:(p.labLinks||[]).filter((x:any)=>lab(x.labId)?.country===selected.country).length})).filter(x=>x.count);
   const questions=related.length?`<section class="ex-country-questions"><h3>Explore the questions being studied here</h3><div>${related.map(x=>`<a href="${e(link('problems',{problem:x.problem.id,country:selected.country}))}" data-ex-nav>${e(x.problem.title)} <span>${x.count}</span></a>`).join('')}</div></section>`:'';
   const image=selected.labs.map(l=>labVisual(l.id)).find(Boolean)||selected.companies.map(c=>visual('company-'+c.id)).find(Boolean),first=selected.labs.slice(0,8),rest=selected.labs.slice(8),companyFirst=selected.companies.slice(0,8),companyRest=selected.companies.slice(8);
   return `<a class="ex-back" href="${e(link('countries'))}" data-ex-nav>← All countries</a><section class="ex-detail-head"><div><span class="eyebrow">${isCountry(selected.country)?'A PLACE TO BEGIN':'WORK ACROSS COUNTRIES'}</span><h2>${e(selected.country)}</h2><p>${countryCount(selected)} mapped in this collection.</p><p>Explore the teams working here, then open the projects and sources that interest you.</p></div>${photo(image,image?.href||'#labs',true)}</section>${questions}${first.length?`<section class="ex-country-section" aria-labelledby="ex-country-labs"><h3 id="ex-country-labs">Research labs <span>${selected.labs.length}</span></h3><div class="ex-lab-list">${first.map(l=>labRow(l)).join('')}</div>${rest.length?`<details class="ex-more-labs"><summary>Show ${rest.length} more mapped lab profiles</summary><div class="ex-lab-list">${rest.map(l=>labRow(l)).join('')}</div></details>`:''}</section>`:''}${companyFirst.length?`<section class="ex-country-section" aria-labelledby="ex-country-companies"><h3 id="ex-country-companies">Companies <span>${selected.companies.length}</span></h3><div class="ex-lab-list">${companyFirst.map(companyRow).join('')}</div>${companyRest.length?`<details class="ex-more-labs"><summary>Show ${companyRest.length} more companies</summary><div class="ex-lab-list">${companyRest.map(companyRow).join('')}</div></details>`:''}</section>`:''}<p class="ex-note">Locations come from the mapped lab and company profiles. This is selected coverage, not a ranking or a census of research activity.</p>`;
  }
  const card=(x:typeof entries[number])=>`<a class="ex-country-card" href="${e(link('countries',{country:x.country}))}" data-ex-nav><h3>${e(x.country)}</h3><span>${countryCount(x)}</span><b aria-hidden="true">→</b></a>`;
  const multi=entries.filter(x=>!isCountry(x.country));
  return `${params.has('country')?'<p class="ex-note" role="status">That country is not in the current collection. Select a listed country below.</p>':''}${intro('START WITH A PLACE','Where is the work happening?','Choose a country to see its mapped labs and companies, with links to their original sources.')}<div class="ex-country-summary"><span>${entries.filter(x=>isCountry(x.country)).length} countries</span><span>${neuroLabsData.labs.length} mapped lab profiles</span><span>${companyEntries().length} companies</span></div><div class="ex-country-grid">${entries.filter(x=>isCountry(x.country)).map(card).join('')}</div>${multi.length?`<section class="ex-country-section"><h3>Across countries</h3><div class="ex-country-grid">${multi.map(card).join('')}</div></section>`:''}<p class="ex-note">Countries are listed alphabetically. Counts describe this collection’s coverage; they do not measure a country’s research output.</p>`;
 }
 function render(params=new URLSearchParams()){
  const requested=params.get('by')||'',by=lenses.some(([id])=>id===requested)?requested:'problems';
  return `<div class="ex-page" data-ex-view="${by}">${head(by)}${by==='organizations'?organizations():by==='people'?people():by==='countries'?countries(params):problemView(params)}</div>`;
 }
 function bind(container:HTMLElement,_params:URLSearchParams,navigate:(hash:string,focusId?:string)=>void){
  container.querySelectorAll<HTMLAnchorElement>('[data-ex-nav]').forEach(a=>a.addEventListener('click',event=>{
   if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
   event.preventDefault();navigate(a.getAttribute('href')!);window.scrollTo({top:0,behavior:'instant' as ScrollBehavior});
  }));
  const countrySelect=container.querySelector<HTMLSelectElement>('#ex-problem-country');
  const updateCountry=()=>{if(countrySelect)navigate(link('problems',{problem:_params.get('problem')||'',...(countrySelect.value?{country:countrySelect.value}:{})}),'ex-problem-country');};
  countrySelect?.addEventListener('change',updateCountry);
  container.querySelector('#ex-problem-filter')?.addEventListener('submit',event=>{event.preventDefault();updateCountry();});
  NeuroVisuals.bind(container);
 }
 function records():HubRecord[]{
  return [...problems().map(p=>({id:'explore-problem-'+p.id,title:p.title,description:p.question+' '+p.summary,kind:'Problem to solve',href:link('problems',{problem:p.id}),keywords:(p.labLinks||[]).map((x:any)=>lab(x.labId)?.name+' '+x.reason).join(' ')})),...countryEntries().map(x=>({id:'explore-country-'+x.country,title:x.country+' — labs & companies',description:countryCount(x)+' mapped in this collection.',kind:'Country guide',href:link('countries',{country:x.country}),keywords:x.labs.map(l=>l.institution+' '+l.name+' '+l.leaders.join(' ')).concat(x.companies.map(c=>c.name+' '+c.summary)).join(' ')})),...paths().map(p=>({id:'explore-path-'+p.id,title:p.title,description:p.summary,kind:'People connection',href:p.href,keywords:(p.people||[]).map((id:string)=>node(id)?.name||'').join(' ')}))];
 }
 return {render,bind,records};
})();
