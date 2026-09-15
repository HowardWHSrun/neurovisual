interface LabSource { id:string; title:string; url:string; kind:string; published?:string; }
interface LabProfile {
 id:string; atlasIds:string[]; name:string; institution:string; city:string; country:string; region:string;
 affiliation?:string; leaders:string[]; themes:string[]; summary:string; approach:string; overviewRefs:string[]; methods:string[]; signals:string[];
 projects:{title:string;detail:string;stage:string;refs:string[]}[];
 scale:{metric:string;detail:string;refs:string[]}; translation:{detail:string;refs:string[]}; nextQuestion:string;
 sources:LabSource[]; verified:string;
}
interface LabSchool { institution:string;title:string;url:string;country:string;region:string;detail:string; }
declare var neuroLabsData:{reviewed:string;labs:LabProfile[];schools:LabSchool[];methodology:string[]};

var NeuroLabs = (() => {
 const e=hubUtils.escapeHtml, u=hubUtils.sourceHref;
 const data=neuroLabsData;
 const themes=['Neural interfaces','Neural decoding','Neuromodulation','Neuroimaging','Rehabilitation & prosthetics','Bioelectronics','Computational neuroscience'];
 const colors=['#2563ae','#6850b8','#a24370','#267f85','#9c6217','#387348','#4a648f'];
 const verbs=['Connect','Decode','Modulate','Image','Restore','Build','Model'];
 const color=(l:LabProfile)=>colors[Math.max(0,themes.indexOf(l.themes[0]))];
 const href=(id:string)=>'#labs/'+encodeURIComponent(id);
 function route(params:URLSearchParams, changes:Record<string,string>) {
  const next=new URLSearchParams(params);for(const [k,v] of Object.entries(changes)){if(v)next.set(k,v);else next.delete(k);}
  return '#labs'+(next.size?'?'+next.toString():'');
 }
 function ext(url:string,label:string,extra=''){return `<a href="${u(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${e(label)} <span aria-hidden="true">↗</span></a>`;}
 function refs(l:LabProfile,ids:string[]){return `<span class="lab-refs">${ids.map(id=>{const i=l.sources.findIndex(s=>s.id===id),s=l.sources[i];return s?ext(s.url,'['+(i+1)+']',`aria-label="${e('Source '+(i+1)+': '+s.title)}"`):'';}).join(' ')}</span>`;}
 function glyph(theme:string) {
  const i=themes.indexOf(theme);
  const drawing=[
   '<path d="M22 16v68m17-68v68m17-68v68m17-68v68"/><path d="M18 16h59"/>'+[25,45,65].map(y=>[22,39,56,73].map(x=>`<circle cx="${x}" cy="${y}" r="3" fill="currentColor"/>`).join('')).join(''),
   '<path d="M8 48h12l5-18 7 40 7-51 7 39 6-10h12m8-24v48m7-24h12"/><circle cx="83" cy="23" r="6"/><circle cx="83" cy="73" r="6"/>',
   '<path d="M9 64h15V29h15v35h16V29h15v35h21"/><path d="M10 80h80"/>',
   '<circle cx="49" cy="48" r="30"/><circle cx="49" cy="48" r="18"/><circle cx="49" cy="48" r="5"/><path d="M49 8v14m0 52v14M9 48h14m51 0h14"/>',
   '<path d="m21 22 29 19 24 31M21 22l-8 14m61 36 13-8"/><circle cx="21" cy="22" r="7"/><circle cx="50" cy="41" r="8"/><circle cx="74" cy="72" r="7"/><path d="M14 88h76"/>',
   '<path d="M10 68q20-30 40 0t40 0M10 52q20-30 40 0t40 0M10 36q20-30 40 0t40 0"/><circle cx="30" cy="21" r="3"/><circle cx="70" cy="51" r="3"/>',
   '<path d="m20 24 58 49M20 24l1 50 58-50M21 74l28-26 29 25M49 48l30-24"/>'+[[20,24],[21,74],[49,48],[79,24],[78,73]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="var(--lab-bg,#f4f8fd)"/>`).join('')
  ][i<0?0:i];
  return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawing}</svg>`;
 }
 function selection(params:URLSearchParams) {
  return data.labs.filter(l=>(!params.get('theme')||l.themes.includes(params.get('theme')!))&&(!params.get('school')||l.institution===params.get('school'))&&(!params.get('region')||l.region===params.get('region'))&&hubUtils.matches([l.name,l.institution,l.country,...l.leaders,...l.themes,l.summary,l.approach,...l.methods,...l.signals,...l.projects.map(p=>p.title+' '+p.detail),l.scale.metric,l.scale.detail].join(' '),params.get('q')||''));
 }
 function card(l:LabProfile) {
  return `<article class="lab-card" style="--lab-color:${color(l)}">${NeuroVisuals.labCard(l.id)}
   <div class="lab-card-top"><div><span>${e(l.institution)}</span><small>${e(l.city)} · ${e(l.country)}</small></div><div class="lab-glyph">${glyph(l.themes[0])}</div></div>
   <h2><a href="${href(l.id)}">${e(l.name)}</a></h2><p class="lab-people">${e(l.leaders.join(' · '))}</p><p class="lab-card-summary">${e(l.summary)}</p>
   <div class="lab-card-project"><span>Project spotlight</span><a href="${href(l.id)}">${e(l.projects[0].title)}</a></div>
   <div class="lab-tags">${l.themes.map(t=>`<a href="${e(route(new URLSearchParams(),{theme:t}))}">${e(t)}</a>`).join('')}</div>
   <div class="lab-card-bottom"><span>${l.projects.length} projects <small>${l.sources.length} sources</small></span><a href="${href(l.id)}" aria-label="${e('Read research profile: '+l.name)}">Read profile <span aria-hidden="true">→</span></a></div></article>`;
 }
 function pageHead(view:string) {
  const institutions=new Set(data.labs.map(l=>l.institution)).size;
  const heads:Record<string,{label:string;title:string;detail:string;stat:string;unit:string}>={
   labs:{label:'RESEARCH DIRECTORY',title:'Find the people behind the work.',detail:'Browse projects, methods, and investigators across neuroengineering.',stat:String(data.labs.length),unit:`profiles · ${institutions} institutions`},
   schools:{label:'UNIVERSITY DIRECTORIES',title:'Explore the wider research roster.',detail:'Official department and center pages, grouped by institution.',stat:String(data.schools.length),unit:`discovery pages · ${new Set(data.schools.map(s=>s.institution)).size} institutions`},
   progress:{label:'MEASUREMENT GUIDE',title:'Compare what progress means.',detail:'Read the measures that matter to each research program, alongside its evidence.',stat:String(themes.length).padStart(2,'0'),unit:'research areas · distinct measures'},
   coverage:{label:'SCOPE & SOURCES',title:'A directory you can inspect.',detail:'How the profiles were researched, what they cover, and how to use the evidence.',stat:String(data.labs.length),unit:'selected profiles · source-linked'}
  };
  const h=heads[view];
  return `<header class="lab-view-head lab-head-${view}"><div><span class="eyebrow">${h.label}</span><h1>${h.title}</h1><p>${h.detail}</p></div><div class="lab-view-summary"><strong>${h.stat}</strong><span>${h.unit}</span></div></header>`;
 }
 function filters(params:URLSearchParams,view:string) {
  const schools=view==='schools', optionsData=schools?data.schools:data.labs;
  const opts=(values:string[],key:string)=>values.map(x=>`<option value="${e(x)}"${params.get(key)===x?' selected':''}>${e(x)}</option>`).join('');
  return `<form id="lab-filters" class="lab-filters${schools?' lab-school-filters':''}" role="search" aria-label="${schools?'Filter university directories':'Filter research labs'}">
   <label class="lab-search-label"><span class="sr-only">${schools?'Find an institution or directory':'Find a lab or project'}</span><input id="lab-query" name="q" type="search" value="${e(params.get('q')||'')}" placeholder="${schools?'Institution, country, or research area…':'Lab, investigator, or project…'}"></label>
   <label class="lab-region-label"><span class="sr-only">Region</span><select id="lab-region" name="region"><option value="">All regions</option>${opts([...new Set(optionsData.map(l=>l.region))].sort(),'region')}</select></label>
   <label class="lab-school-label"><span class="sr-only">University or institution</span><select id="lab-school" name="school"><option value="">All institutions</option>${opts([...new Set(optionsData.map(l=>l.institution))].sort(),'school')}</select></label>
   ${schools?'':`<label class="lab-theme-label"><span class="sr-only">Research area</span><select id="lab-theme" name="theme"><option value="">All research areas</option>${opts(themes,'theme')}</select></label>`}
   <button class="lab-filter-submit" type="submit">Find</button></form>`;
 }
 function schoolsPage(params:URLSearchParams) {
  const q=params.get('q')||'',region=params.get('region')||'',school=params.get('school')||'';
  const entries=data.schools.filter(s=>(!region||s.region===region)&&(!school||s.institution===school)&&hubUtils.matches(s.institution+' '+s.country+' '+s.title+' '+s.detail,q));
  const institutions=[...new Set(entries.map(s=>s.institution))].sort((a,b)=>a.localeCompare(b));
  const active=Boolean(q||region||school);
  return `${filters(params,'schools')}<div class="lab-results"><p role="status">${entries.length} discovery pages · ${institutions.length} institutions</p>${active?'<a href="#labs?view=schools">Clear filters</a>':'<span>Alphabetical by institution</span>'}</div>
   <div class="lab-school-index">${institutions.map(institution=>{
    const pages=entries.filter(s=>s.institution===institution),n=data.labs.filter(l=>l.institution===institution).length;
    return `<article class="lab-school-row"><header><span class="lab-school-initial" aria-hidden="true">${e(institution.replace(/^University of /,'').charAt(0))}</span><div><span class="lab-school-location">${e(pages[0].country)} · ${e(pages[0].region)}</span><h2>${e(institution)}</h2>${n?`<a class="lab-school-profiles" href="${e(route(new URLSearchParams(),{school:institution}))}">${n} detailed profile${n===1?'':'s'} here →</a>`:'<span class="lab-school-profiles">Institutional discovery source</span>'}</div></header>
     <ul class="lab-school-links">${pages.map(s=>`<li>${ext(s.url,s.title)}<p>${e(s.detail)}</p></li>`).join('')}</ul></article>`;
   }).join('')||empty('schools')}</div><p class="lab-footnote">These rosters extend beyond the profiles in this directory. Each link opens the institution’s own research page.</p>`;
 }
 function empty(view='labs'){return `<div class="hub-empty"><h2>No matching ${view==='schools'?'directories':'research profiles'}.</h2><p>Try a broader term or clear the filters.</p><a href="${view==='schools'?'#labs?view=schools':view==='progress'?'#labs?view=progress':'#labs'}">Show all ${view==='schools'?'directories':'labs'} →</a></div>`;}
 function directory(params:URLSearchParams) {
  const view=['schools','progress','coverage'].includes(params.get('view')||'')?params.get('view')!:'labs';
  const nav=`<nav class="lab-view-nav" aria-label="Research directory views">${[['labs','Lab directory'],['schools','University directories'],['progress','Progress measures'],['coverage','Scope & sources']].map(([v,n])=>{
   const base=['labs','progress'].includes(view)&&['labs','progress'].includes(v)?params:new URLSearchParams();
   return `<a href="${e(route(base,{view:v==='labs'?'':v,page:''}))}"${view===v?' aria-current="page"':''}>${n}</a>`;
  }).join('')}</nav>`;
  const head=`<div class="lab-page lab-directory lab-view-${view}">${pageHead(view)}${nav}`;
  if(view==='coverage')return `${head}${coverage()}</div>`;
  if(view==='schools')return `${head}${schoolsPage(params)}</div>`;
  const all=selection(params),page=Math.max(1,Math.min(Math.ceil(all.length/24)||1,Math.floor(Number(params.get('page'))||1))),shown=all.slice((page-1)*24,page*24);
  const areas=`<nav class="lab-area-grid" aria-label="Quick filter by research area"><a id="lab-area-all" class="lab-area-all" data-lab-filter href="${e(route(params,{theme:'',page:''}))}"${!params.get('theme')?' aria-current="true"':''}><span>All areas</span></a>${themes.map((t,i)=>`<a id="lab-area-${i}" data-lab-filter href="${e(route(params,{theme:params.get('theme')===t?'':t,page:''}))}" style="--lab-color:${colors[i]}"${params.get('theme')===t?' aria-current="true"':''}>${glyph(t)}<span>${e(t)}</span><strong aria-label="${data.labs.filter(l=>l.themes.includes(t)).length} profiles in this area">${data.labs.filter(l=>l.themes.includes(t)).length}</strong></a>`).join('')}</nav>`;
  const results=`<div class="lab-results"><p role="status">${all.length} of ${data.labs.length} profiles${all.length?` · ${(page-1)*24+1}–${Math.min(page*24,all.length)}`:''}</p>${['q','region','school','theme'].some(k=>params.has(k))?`<a href="${e(route(new URLSearchParams(),{view:view==='labs'?'':view}))}">Clear filters</a>`:'<span>Source review · 15 Sep 2026</span>'}</div>`;
  const rows=view==='progress'?`<div class="lab-progress-wrap"><table class="lab-progress-table"><caption class="sr-only">Source-informed progress measures by research program. These measures are not a common performance scale.</caption><thead><tr><th scope="col">Research program</th><th scope="col">What progress looks like</th></tr></thead><tbody>${shown.map(l=>`<tr style="--lab-color:${color(l)}"><th scope="row"><div class="lab-progress-identity"><div class="lab-glyph">${glyph(l.themes[0])}</div><div><span>${e(l.institution)}</span><h2><a href="${href(l.id)}">${e(l.name)}</a></h2><small>${e(l.themes[0])}</small></div></div><a class="lab-progress-profile" href="${href(l.id)}">${l.projects.length} projects &amp; context →</a></th><td><h3>${e(l.scale.metric)}</h3><p>${e(l.scale.detail)}</p><div class="lab-progress-sources"><span>Evidence</span>${refs(l,l.scale.refs)}</div></td></tr>`).join('')}</tbody></table></div>`:`<div class="lab-grid">${shown.map(card).join('')}</div>`;
  const pages=all.length>24?`<nav class="lab-pagination" aria-label="Lab directory pages">${page>1?`<a href="${e(route(params,{page:String(page-1)}))}">← Previous</a>`:'<span></span>'}<span>Page ${page} of ${Math.ceil(all.length/24)}</span>${page*24<all.length?`<a href="${e(route(params,{page:String(page+1)}))}">Next →</a>`:'<span></span>'}</nav>`:'';
  const note=view==='progress'?'<aside class="lab-progress-note"><p><strong>Different work, different measures.</strong> These source-informed lenses are not a ranking or a shared performance scale.</p><a href="#ideas/moores-law-bci?section=counts">Electrode-count evidence →</a></aside>':'';
  return `${head}${view==='labs'?NeuroVisuals.labBanner():''}${note}${filters(params,view)}${areas}${results}${all.length?rows:empty(view)}${pages}<p class="lab-footnote">Area totals overlap because a lab can work across several fields. Profiles summarize selected programs; university directories help you explore the wider roster.</p></div>`;
 }
 function coverage() {
  return `<div class="lab-coverage"><section class="lab-coverage-method"><span class="eyebrow">THE RESEARCH PROCESS</span><h2>From a roster to a research profile</h2><ol>${data.methodology.map(x=>`<li>${e(x)}</li>`).join('')}</ol></section>
   <aside class="lab-coverage-download"><span class="eyebrow">TAKE THE DIRECTORY WITH YOU</span><h2>Read, reuse, extend.</h2><p>Structured profiles, project-level references, and school discovery pages.</p><a class="button-primary" href="./data/labs.json" download>Research data <span>JSON ↓</span></a><a class="lab-download-secondary" href="./downloads/lab-research/research-directory.md" download>Reading dossier <span>Markdown ↓</span></a><small>New profiles can be added without changing the page design.</small></aside>
   <section class="lab-coverage-boundary"><span class="eyebrow">WHAT THE DIRECTORY CAN TELL YOU</span><h2>Broad coverage, selected evidence.</h2><p>This release is a documented survey, not a census of every neuroengineering lab. A profile’s review date records when its source pages were checked; it does not establish that every project is active today. Source publication dates are recorded where available. Regional and language coverage is uneven.</p><p>University and center pages provide additional leads. The original atlas also contains laboratories, facilities, programs, companies, and independent institutes with different levels of detail.</p><div><a href="#organizations">Wider organization atlas →</a><a href="#labs?view=schools">University rosters →</a><a href="https://github.com/HowardWHSrun/neurovisual/issues" target="_blank" rel="noopener noreferrer">Suggest a lab or correction ↗</a></div></section></div>`;
 }
 function profile(l:LabProfile) {
  const related=data.labs.filter(x=>x.id!==l.id).map(x=>({lab:x,score:x.themes.filter(t=>l.themes.includes(t)).length+(x.institution===l.institution?1:0)})).sort((a,b)=>b.score-a.score||a.lab.name.localeCompare(b.lab.name)).filter(x=>x.score>0).slice(0,3);
  const question=l.nextQuestion.replace(/^Editorial question:\s*/,'');
  return `<article class="lab-page lab-profile" style="--lab-color:${color(l)}">
   <nav class="lab-breadcrumb" aria-label="Research profile breadcrumb"><a href="#labs">← Research labs</a><span aria-hidden="true">/</span><a href="${e(route(new URLSearchParams(),{school:l.institution}))}">${e(l.institution)}</a></nav>
   <header class="lab-profile-head"><div><span class="eyebrow">RESEARCH PROFILE · ${e(l.city)} · ${e(l.country)}</span><h1>${e(l.name)}</h1><p class="lab-leaders">${e(l.leaders.join(' · '))}</p>${l.affiliation?`<p class="lab-affiliation">${e(l.affiliation)}</p>`:''}<p class="lab-summary">${e(l.summary)} ${refs(l,l.overviewRefs)}</p><div class="lab-tags">${l.themes.map(t=>`<a href="${e(route(new URLSearchParams(),{theme:t}))}">${e(t)}</a>`).join('')}</div></div><div class="lab-profile-emblem">${glyph(l.themes[0])}<span>${e(verbs[Math.max(0,themes.indexOf(l.themes[0]))])}</span></div></header>
   <div class="lab-profile-utility"><nav class="lab-profile-nav" aria-label="Jump to profile section">${[['approach','Overview'],['projects',`Projects (${l.projects.length})`],['progress','Progress'],['sources',`Sources (${l.sources.length})`]].map(([id,label])=>`<button type="button" data-lab-section="${id}" aria-controls="lab-profile-${id}">${label}</button>`).join('')}</nav><span class="lab-reviewed">Source review · ${e(l.verified)}</span></div>
   <div class="lab-profile-actions">${ext(l.sources[0].url,'Lab / institutional source')}${l.atlasIds.map(id=>`<a href="#org/${encodeURIComponent(id)}">Organization atlas ↗</a>`).join('')}</div>
   ${NeuroVisuals.labFeature(l.id)||FieldVisuals.lab(l)}<section class="lab-approach" id="lab-profile-approach" tabindex="-1" aria-labelledby="lab-approach-title"><div><span class="eyebrow">THE ENGINEERING APPROACH</span><h2 id="lab-approach-title">What makes this work distinct</h2><p>${e(l.approach)} ${refs(l,l.overviewRefs)}</p></div><div class="lab-method-box"><h3>Methods &amp; instruments</h3><ul>${l.methods.map(m=>`<li>${e(m)}</li>`).join('')}</ul><h3>What is measured</h3><p>${e(l.signals.join(' · '))}</p></div></section>
   <section class="lab-project-section" id="lab-profile-projects" tabindex="-1" aria-labelledby="lab-projects-title"><div class="section-heading"><div><span class="eyebrow">FOLLOW THE ACTUAL WORK</span><h2 id="lab-projects-title">Projects &amp; research threads</h2></div><span>${l.projects.length} documented directions</span></div><div class="lab-projects">${l.projects.map((p,i)=>`<article><span class="lab-project-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><span class="lab-stage">${e(p.stage)}</span><h3>${e(p.title)}</h3><p>${e(p.detail)} ${refs(l,p.refs)}</p></div></article>`).join('')}</div></section>
   <div class="lab-evidence-grid" id="lab-profile-progress" tabindex="-1"><section class="lab-scale"><span class="eyebrow">PROGRESS TO TRACK</span><h2>${e(l.scale.metric)}</h2><p>${e(l.scale.detail)} ${refs(l,l.scale.refs)}</p><a href="#labs?view=progress">Compare measurement lenses →</a></section><section class="lab-translation"><span class="eyebrow">STUDY CONTEXT</span><h2>How to interpret the evidence</h2><p>${e(l.translation.detail)} ${refs(l,l.translation.refs)}</p></section></div>
   <aside class="lab-question"><span class="eyebrow">NOTEBOOK PROMPT · EDITORIAL QUESTION</span><h2>${e(question)}</h2><a href="#ideas">Connect this to your next idea →</a></aside>
   <section class="lab-sources" id="lab-profile-sources" tabindex="-1" aria-labelledby="lab-sources-title"><div class="section-heading"><div><span class="eyebrow">CHECK THE ORIGINALS</span><h2 id="lab-sources-title">Sources &amp; further reading</h2></div><span>${l.sources.length} references</span></div><ol>${l.sources.map(s=>`<li><div><span>${e(s.kind)} · ${s.published?e(s.published):'Publication date not recorded'}</span>${ext(s.url,s.title)}<small>${e(new URL(s.url).hostname)}</small></div></li>`).join('')}</ol><p>Source dates above are separate from the profile review date. A lab page describes its program; project and paper links establish the scope of specific evidence.</p></section>
   <section class="lab-related"><div class="section-heading"><h2>Related research to explore</h2><a href="#labs">All labs →</a></div><p>Connected by shared research areas or institution; this does not imply collaboration.</p><div class="lab-grid">${related.map(x=>card(x.lab)).join('')}</div></section></article>`;
 }
 function render(id='',params=new URLSearchParams()){if(!id)return directory(params);const l=data.labs.find(l=>l.id===id);return l?profile(l):'<div class="hub-empty"><h1>Research profile not found.</h1><a href="#labs">Browse the research directory →</a></div>';}
 function bind(container:HTMLElement,id:string,params:URLSearchParams,update:(hash:string)=>void) {
  if(id){
   container.querySelectorAll<HTMLButtonElement>('[data-lab-section]').forEach(button=>button.addEventListener('click',()=>{
    const target=container.querySelector<HTMLElement>('#lab-profile-'+button.dataset.labSection);
    if(!target)return;
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
   }));
   return;
  }
  const form=container.querySelector<HTMLFormElement>('#lab-filters');if(!form)return;
  const change=()=>{const next=new URLSearchParams(params);next.delete('page');new FormData(form).forEach((v,k)=>{if(String(v).trim())next.set(k,String(v));else next.delete(k);});update(route(next,{}));};
  let composing=false;
  form.addEventListener('submit',event=>{event.preventDefault();if(!composing)change();});form.addEventListener('change',event=>{if(!composing&&(event.target as HTMLElement).tagName==='SELECT')change();});
  const query=container.querySelector('#lab-query');query?.addEventListener('compositionstart',()=>{composing=true;});query?.addEventListener('compositionend',()=>{composing=false;change();});query?.addEventListener('input',(event:InputEvent)=>{if(!composing&&!event.isComposing)change();});
  container.querySelectorAll<HTMLAnchorElement>('[data-lab-filter]').forEach(a=>a.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();update(a.getAttribute('href')!);}));
 }
 function records():HubRecord[]{return data.labs.map(l=>({id:l.id,title:l.name,description:l.institution+' — '+l.summary,kind:'Research lab',href:href(l.id),keywords:[...l.leaders,...l.methods,...l.signals,...l.themes,...l.projects.map(p=>p.title+' '+p.detail),l.country].join(' ')}));}
 function forOrg(id:string){return data.labs.find(l=>l.atlasIds.includes(id));}
 function teaser(id:string){return data.labs.filter(l=>l.atlasIds.includes(id)).map(l=>`<section class="lab-atlas-teaser"><div><span>DETAILED RESEARCH PROFILE</span><h2>${e(l.name)}</h2><p>${e(l.summary)}</p><small>${l.projects.length} projects · ${l.sources.length} linked sources · reviewed ${e(l.verified)}</small></div><a href="${href(l.id)}">Explore projects &amp; evidence ↗</a></section>`).join('');}
 return {render,bind,records,forOrg,teaser,selection,themes};
})();
