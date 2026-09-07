interface HubRecord { id: string; title: string; description: string; kind: string; href: string; keywords?: string; }
interface Window { neuroAtlas?: { records: HubRecord[]; counts: { technologies: number; organizations: number; researchers: number }; navigate: (route: string, id?: string, query?: string) => void }; }

(function () {
  const content = document.getElementById('hub-content')!;
  const atlas = document.getElementById('neurotech-atlas-2026')!;
  const search = document.getElementById('global-search') as HTMLInputElement;
  const sidebar = document.getElementById('site-sidebar')!;
  const menu = document.getElementById('mobile-menu')!;
  const main = document.getElementById('main-content')!;
  const labels: Record<string, string> = { overview:'Overview', resources:'Resource library', learn:'Learning paths', glossary:'Glossary', atlas:'Technologies', organizations:'Organizations', researchers:'Researchers', frontier:'Papers & updates', pathways:'Study & careers', timeline:'Milestones', about:'Coverage & sources', search:'Search', topic:'Explore a topic' };
  const descriptions: Record<string, string> = {
    atlas:'Compare recording, stimulation, restoration, and computational methods. Select a point for mechanisms, evidence, and sources.',
    organizations:'Explore source-linked companies, laboratories, programs, and open-science projects. Rankings describe disclosed metrics, not research quality.',
    researchers:'Follow project-linked research trails and find original institutional profiles and literature.',
    frontier:'Browse a dated snapshot of indexed papers, preprints, trial updates, and institutional news.',
    pathways:'Compare academic programs, research directions, role types, and dated job listings.',
    timeline:'Explore selected milestones and the technologies behind them.',
  };
  const e = hubUtils.escapeHtml;
  const url = hubUtils.sourceHref;
  const topicById = (id: string) => hubTopics.find(t => t.id === id);
  const count = window.neuroAtlas?.counts;
  const topicLink = (id: string) => '#topic/' + encodeURIComponent(id);
  const external = (resource: HubResource, label?: string) => `<a href="${url(resource.url)}" target="_blank" rel="noopener noreferrer">${e(label || resource.title)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
  const pageHead = (eyebrow: string, title: string, text: string, extra = '') => `<header class="hub-page-head"><div><div class="eyebrow">${e(eyebrow)}</div><h1>${e(title)}</h1><p>${e(text)}</p></div>${extra}</header>`;
  function resourceCard(r: HubResource) {
    const topic = topicById(r.topic)!;
    return `<article class="resource-card" id="resource-${e(r.id)}"><div class="resource-meta"><span>${e(r.type)}</span><span>${e(r.level)}</span></div><h3>${external(r)}</h3><p>${e(r.description)}</p><a class="topic-tag" href="${topicLink(r.topic)}" style="--topic:${topic.color}">${e(topic.title)}</a></article>`;
  }
  function topicCard(t: HubTopic, index: number) {
    return `<a class="topic-card" href="${topicLink(t.id)}" style="--topic:${t.color}"><div class="topic-card-top"><span>${e(t.eyebrow)}</span><span>0${index + 1}</span></div><h3>${e(t.title)}</h3><p>${e(t.description)}</p><span class="topic-card-bottom">${hubResources.filter(r => r.topic === t.id).length} curated resources <span aria-hidden="true">↗</span></span></a>`;
  }
  function overview() {
    const stats = `<div class="overview-stat"><strong>${count?.technologies ?? '—'}</strong><span>technologies</span></div><div class="overview-stat"><strong>${count?.organizations ?? '—'}</strong><span>organizations</span></div><div class="overview-stat"><strong>${hubResources.length}</strong><span>curated resources</span></div>`;
    const starters = ['neuromatch','mne','deeplabcut'].map(id => resourceCard(hubResources.find(r => r.id === id)!)).join('');
    return pageHead('YOUR FIELD GUIDE', 'Neuroengineering, connected.', 'Understand the field. Find the right tools. Follow the people and ideas moving it forward.', `<a class="button-primary" href="#resources">Explore resources <span aria-hidden="true">↗</span></a>`)
    + `<div class="overview-bar"><span>From neural signals<br><strong>to useful systems.</strong></span><div class="overview-stats">${stats}</div><a href="#about">How this is curated ↗</a></div>
    <section aria-labelledby="topics-heading"><div class="section-heading"><div><span class="eyebrow">FIND YOUR DIRECTION</span><h2 id="topics-heading">Explore the field</h2></div><span>Eight connected areas</span></div><div class="topic-grid">${hubTopics.map(topicCard).join('')}</div></section>
    <section class="overview-bottom"><div><div class="section-heading"><div><span class="eyebrow">MAKE IT PRACTICAL</span><h2>Start with a question</h2></div></div><div class="question-list"><a href="#learn/eeg"><span>How do I build my first neural decoder?<small>EEG → preprocessing → held-out evaluation</small></span><span aria-hidden="true">↗</span></a><a href="#learn/motion"><span>How do I measure behavior in 3D?<small>Video → keypoints → calibrated trajectories</small></span><span aria-hidden="true">↗</span></a><a href="#organizations"><span>Who is working on a particular technology?<small>Explore laboratories, companies, and public projects</small></span><span aria-hidden="true">↗</span></a></div></div><aside class="field-note"><span class="eyebrow">READING THE FIELD</span><h2>Follow the evidence.</h2><p>A compelling demonstration, a registered trial, and a deployed device answer different questions. Follow each record to its source and check the date, study model, and limitations.</p><a href="#frontier">Explore papers &amp; updates ↗</a></aside></section>
    <section><div class="section-heading"><div><span class="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Open resources, real practice</h2></div><a href="#resources?level=Beginner">All beginner resources ↗</a></div><div class="resource-grid three">${starters}</div></section>`;
  }
  function resourcePage(params: URLSearchParams) {
    const query = params.get('q') || '', topic = params.get('topic') || '', type = params.get('type') || '', level = params.get('level') || '';
    const filtered = hubResources.filter(r => (!topic || r.topic === topic) && (!type || r.type === type) && (!level || r.level === level) && matches([r.title,r.description,r.type,r.level,topicById(r.topic)?.title].join(' '), query));
    const opts = (items: string[], selected: string) => items.map(x => `<option value="${e(x)}"${selected === x ? ' selected' : ''}>${e(x)}</option>`).join('');
    return pageHead('CURATED REFERENCES', 'Resource library', 'Official documentation, open tools, datasets, and courses. Each link takes you to the original source.')
      + `<form class="resource-filters" id="resource-filters" role="search"><label class="filter-query">Search resources<input id="resource-query" name="q" type="search" value="${e(query)}" placeholder="Try EEG, Python, 3D, or datasets"></label><label>Topic<select id="resource-topic" name="topic"><option value="">All topics</option>${hubTopics.map(t=>`<option value="${t.id}"${topic===t.id?' selected':''}>${e(t.title)}</option>`).join('')}</select></label><label>Type<select id="resource-type" name="type"><option value="">All types</option>${opts(['Course','Dataset','Hardware','Standard','Tool','Tutorial'],type)}</select></label><label>Level<select id="resource-level" name="level"><option value="">All levels</option>${opts(['Beginner','Intermediate','Advanced'],level)}</select></label></form>
      <div class="results-line"><p role="status">${filtered.length} of ${hubResources.length} resources</p>${query||topic||type||level?'<a href="#resources">Clear filters</a>':'<span>Resource links reviewed 7 Sep 2026</span>'}</div>
      <div class="resource-grid">${filtered.length?filtered.map(resourceCard).join(''):'<div class="hub-empty"><h2>No resources match these filters.</h2><p>Try a broader term or choose another topic.</p><a href="#resources">Show all resources</a></div>'}</div><p class="page-note">Levels are suggested starting points; beginner resources may assume Python or undergraduate science. Check each project’s installation instructions, access terms, and dataset license.</p>`;
  }
  function topicPage(id: string) {
    const topic = topicById(id);
    if (!topic) return notFound();
    const resources = hubResources.filter(r => r.topic === id);
    return `<a class="back-link" href="#overview">← All topics</a>` + pageHead(topic.eyebrow, topic.title, topic.description)
    + `<section class="topic-primer" style="--topic:${topic.color}"><div><span class="eyebrow">THE CENTRAL QUESTION</span><h2>${e(topic.question)}</h2></div><div><h3>Concepts to understand</h3><ul>${topic.concepts.map(c=>`<li>${e(c)}</li>`).join('')}</ul></div></section>
    <div class="topic-next"><a class="button-primary" href="#atlas?q=${encodeURIComponent(topic.atlasQuery)}">Explore related technologies ↗</a><a href="#organizations?q=${encodeURIComponent(topic.atlasQuery)}">Find organizations ↗</a><a href="#glossary?topic=${id}">Key terms ↗</a></div>
    <div class="section-heading"><h2>Tools &amp; references</h2><span>${resources.length} official resources</span></div><div class="resource-grid">${resources.map(resourceCard).join('')}</div><div class="section-heading"><h2>Keep exploring</h2><a href="#learn">Learning paths ↗</a></div><div class="related-topics">${hubTopics.filter(t=>t.id!==id).map(t=>`<a href="${topicLink(t.id)}">${e(t.title)} ↗</a>`).join('')}</div>`;
  }
  function learnPage(id?: string) {
    if (id) {
      const path = hubLearningPaths.find(p => p.id === id);
      if (!path) return notFound();
      return '<a class="back-link" href="#learn">← All learning paths</a>' + pageHead('GUIDED PRACTICE', path.title, path.description)
      + `<div class="path-context"><div><span class="eyebrow">BEFORE YOU START</span><p>${e(path.prerequisites)}</p></div><div><span class="eyebrow">WHAT YOU WILL MAKE</span><p>${e(path.outcome)}</p></div></div><ol class="learning-steps">${path.steps.map((s,i)=>`<li><span class="step-number">0${i+1}</span><div><span class="eyebrow">STEP ${i+1}</span><h2>${e(s[1])}</h2><p>${e(s[2])}</p>${external(hubResources.find(r=>r.id===s[0])!,'Open '+hubResources.find(r=>r.id===s[0])!.title)}</div></li>`).join('')}</ol><p class="page-note">These are editorial learning sequences, not accredited courses. Use research and example data; the outcomes are educational projects.</p>`;
    }
    return pageHead('LEARN BY DOING', 'A path from curiosity to practice.', 'Choose one concrete project. Build the background you need as you go.')
    + `<div class="learning-grid">${hubLearningPaths.map((p,i)=>`<article class="learning-card"><span class="learning-index">0${i+1}</span><span class="eyebrow">4 STEPS · PROJECT BASED</span><h2><a href="#learn/${p.id}">${e(p.title)}</a></h2><p>${e(p.description)}</p><div><span class="eyebrow">YOU WILL MAKE</span><p>${e(p.outcome)}</p></div><a class="button-primary" href="#learn/${p.id}">Open learning path ↗</a></article>`).join('')}</div><div class="learning-support"><h2>Looking for a degree or a research role?</h2><p>Compare programs, explore role types, and investigate the people doing work that interests you.</p><a href="#pathways">Study &amp; careers ↗</a><a href="#researchers">Researcher trails ↗</a></div>`;
  }
  function glossaryPage(params: URLSearchParams) {
    const q = params.get('q') || '', topic = params.get('topic') || '';
    const terms = hubGlossary.filter(t => (!topic || t[2] === topic) && matches(t[0]+' '+t[1],q)).sort((a,b)=>a[0].localeCompare(b[0]));
    return pageHead('PLAIN-LANGUAGE REFERENCE', 'Glossary', 'Short working definitions to help you read across the field.')
    + `<form id="glossary-filter" class="glossary-filter" role="search"><label for="glossary-query">Find a term</label><input id="glossary-query" type="search" placeholder="EEG, closed loop, spike sorting…" value="${e(q)}"></form><div class="results-line"><p role="status">${terms.length} terms${topicById(topic)?' in '+e(topicById(topic)!.title):''}</p><a href="#glossary">Show all terms</a></div><dl class="glossary-list">${terms.map(t=>`<div><dt>${e(t[0])}</dt><dd>${e(t[1])}<a href="${topicLink(t[2])}">Explore ${e(topicById(t[2])!.title.toLowerCase())} ↗</a></dd></div>`).join('') || '<div><dt>No matching terms</dt><dd>Try a shorter term or clear your filters.</dd></div>'}</dl><p class="page-note">Definitions are introductory summaries. Topic pages link to official documentation for greater depth.</p>`;
  }
  const matches = hubUtils.matches;
  function searchRecords(): HubRecord[] {
    return [
      ...hubTopics.map(t=>({id:t.id,title:t.title,description:t.description,kind:'Topic',href:topicLink(t.id),keywords:t.concepts.join(' ')})),
      ...hubResources.map(r=>({id:r.id,title:r.title,description:r.description,kind:'Resource',href:r.url,keywords:topicById(r.topic)!.title+' '+r.type})),
      ...hubLearningPaths.map(p=>({id:p.id,title:p.title,description:p.description,kind:'Learning path',href:'#learn/'+p.id})),
      ...hubGlossary.map(t=>({id:t[0],title:t[0],description:t[1],kind:'Glossary',href:'#glossary?q='+encodeURIComponent(t[0])})),
      ...(window.neuroAtlas?.records || [])
    ];
  }
  function searchPage(params: URLSearchParams) {
    const q = params.get('q') || '', kind = params.get('kind') || '';
    const all = q.trim() ? searchRecords().filter(r=>matches(r.title+' '+r.description+' '+(r.keywords||''),q)).sort((a,b)=>Number(b.title.toLowerCase().includes(q.toLowerCase()))-Number(a.title.toLowerCase().includes(q.toLowerCase()))) : [];
    const filtered = all.filter(r=>!kind||r.kind===kind);
    const page = Math.max(1,Math.min(Math.ceil(filtered.length/30)||1,Number(params.get('page'))||1));
    const displayed = filtered.slice((page-1)*30,page*30);
    const kinds = [...new Set(all.map(r=>r.kind))];
    const link = (k: string, p=1) => '#search?'+new URLSearchParams({q,...(k?{kind:k}:{}),...(p>1?{page:String(p)}:{})}).toString();
    return pageHead('SEARCH THE WHOLE HUB', q ? 'Results for “'+q+'”' : 'What would you like to explore?', 'Search topics, resources, technologies, organizations, researchers, programs, career roles, job listings, and paper snapshots.')
    + `<div class="search-kinds" aria-label="Result type"><a href="${e(link(''))}"${!kind?' aria-current="true"':''}>All <span>${all.length}</span></a>${kinds.map(k=>`<a href="${e(link(k))}"${kind===k?' aria-current="true"':''}>${e(k)} <span>${all.filter(r=>r.kind===k).length}</span></a>`).join('')}</div><p class="results-line" role="status">${filtered.length} results${filtered.length?' · showing '+((page-1)*30+1)+'–'+Math.min(page*30,filtered.length):''}</p><div class="search-results">${displayed.map(r=>`<article><span class="eyebrow">${e(r.kind)}</span><h2><a href="${r.href.startsWith('#')?e(r.href):url(r.href)}"${r.href.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"'}>${e(r.title)} <span aria-hidden="true">↗</span></a></h2><p>${e(r.description)}</p></article>`).join('') || `<div class="hub-empty"><h2>${q?'No matches found.':'Start with a topic or a question.'}</h2><p>Try “EEG”, “Stanford”, “spike sorting”, or “3D”.</p><a href="#resources">Browse the resource library</a></div>`}</div>${filtered.length>30?`<nav class="search-pager" aria-label="Search pages">${page>1?`<a href="${e(link(kind,page-1))}">← Previous</a>`:'<span></span>'}<span>Page ${page} of ${Math.ceil(filtered.length/30)}</span>${page*30<filtered.length?`<a href="${e(link(kind,page+1))}">Next →</a>`:'<span></span>'}</nav>`:''}`;
  }
  function snapshotDate(value: unknown) { const d = new Date(String(value)); return Number.isNaN(d.getTime()) ? 'Unavailable' : d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}); }
  function aboutPage() {
    return pageHead('COVERAGE & SOURCES','A starting point you can inspect.','Neurovisual connects a curated field guide with an existing global neurotechnology atlas.')
    + `<div class="about-grid"><section><h2>What is included</h2><p>The atlas contains ${count?.technologies??'—'} technology categories, ${count?.organizations??'—'} organizations and projects, and ${count?.researchers??'—'} researcher trails. The resource library adds ${hubResources.length} selected official resources across eight areas.</p><p>This is a selective index. Coverage differs by region, language, topic, and source availability. Inclusion is not endorsement, and absence is not a judgment of quality.</p><h2>How to use the evidence</h2><p>Open the original source, check the date, and distinguish animal research, human feasibility studies, registered trials, and regulatory decisions. Trial counts are not evidence of efficacy.</p><p>Capital, workforce, and clinical activity are different measures. Unknown values remain undisclosed; program budgets and private investment should not be treated as interchangeable.</p></section><section class="source-status"><h2>Dates &amp; maintenance</h2><dl><div><dt>Resource links reviewed</dt><dd>Sep 7, 2026</dd></div><div><dt>Atlas editorial baseline</dt><dd>Aug 17, 2026</dd></div><div><dt>Paper snapshot generated</dt><dd>${snapshotDate(typeof frontierSnapshot!=='undefined'?frontierSnapshot.generatedAt:null)}</dd></div><div><dt>Jobs snapshot generated</dt><dd>${snapshotDate(typeof jobsSnapshot!=='undefined'?jobsSnapshot.generatedAt:null)}</dd></div></dl><p>A scheduled refresh is not a guarantee of current data. Snapshot views disclose source failures. Manually curated opportunities need an availability check on the employer’s site.</p><a href="https://github.com/HowardWHSrun/neurovisual/issues" target="_blank" rel="noopener noreferrer">Report a correction or suggest a resource ↗</a></section></div>`;
  }
  function notFound() { return pageHead('PAGE NOT FOUND','This destination is not in the hub.','The link may have changed. You can return to the overview or search the field.')+'<a class="button-primary" href="#overview">Back to overview</a>'; }
  function parseRoute() { return hubUtils.parseRoute(location.hash==='#main-content'?'#overview':location.hash); }
  function closeMenu() { sidebar.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation'); }
  function render(focusMain=false) {
    const {route,id,params} = parseRoute();
    const atlasRoute = route==='org'?'organizations':route==='tech'?'atlas':route==='person'?'researchers':route;
    const isAtlas = !!descriptions[atlasRoute];
    const missingRecord = ['org','tech','person'].includes(route) && window.neuroAtlas && !window.neuroAtlas.records.some(r => r.href === '#'+route+'/'+encodeURIComponent(id));
    const previous = document.activeElement as HTMLInputElement;
    const previousId = previous?.id, selection = previous?.selectionStart;
    content.hidden=isAtlas;atlas.hidden=!isAtlas;
    document.querySelectorAll<HTMLElement>('.site-nav a').forEach(a=>{const active=a.dataset.route===(route==='topic'?'overview':atlasRoute);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.title=(labels[atlasRoute]||'Neuroengineering')+' — Neurovisual';
    if(route==='search')search.value=params.get('q')||'';else search.value='';
    if(missingRecord){atlas.hidden=true;content.hidden=false;content.innerHTML=notFound();}
    else if(isAtlas){
      document.getElementById('atlas-view-title')!.textContent=labels[atlasRoute];
      document.getElementById('atlas-view-description')!.textContent=descriptions[atlasRoute];
      if(window.neuroAtlas)window.neuroAtlas.navigate(route,id,params.get('q')||'');
      else {atlas.hidden=true;content.hidden=false;content.innerHTML=pageHead('ATLAS UNAVAILABLE','The atlas could not load.','Reload the page to retry. The resource library and learning paths are still available.')+'<a href="#resources">Browse resources →</a>';}
    }else{
      content.innerHTML=route==='overview'?overview():route==='resources'?resourcePage(params):route==='topic'?topicPage(id):route==='learn'?learnPage(id):route==='glossary'?glossaryPage(params):route==='search'?searchPage(params):route==='about'?aboutPage():notFound();
      bindFilters(params);
    }
    closeMenu();
    if(focusMain){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant' as ScrollBehavior});}
    else if(previousId&&previousId!=='global-search'){const replacement=document.getElementById(previousId) as HTMLInputElement;replacement?.focus({preventScroll:true});if(replacement?.type==='search'&&selection!=null)replacement.setSelectionRange(selection,selection);}
  }
  function updateHash(hash:string){history.replaceState(null,'',hash);render();}
  function bindFilters(params: URLSearchParams){
    const form = document.getElementById('resource-filters') as HTMLFormElement;
    if(form){const update=()=>{const p=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(String(v).trim())p.set(k,String(v));});updateHash('#resources'+(p.size?'?'+p.toString():''));};form.addEventListener('submit',ev=>{ev.preventDefault();update();});form.addEventListener('change',update);document.getElementById('resource-query')!.addEventListener('input',update);}
    const glossary=document.getElementById('glossary-filter');
    if(glossary){const update=()=>{const p=new URLSearchParams(params);const v=(document.getElementById('glossary-query') as HTMLInputElement).value;if(v)p.set('q',v);else p.delete('q');updateHash('#glossary'+(p.size?'?'+p.toString():''));};glossary.addEventListener('submit',ev=>{ev.preventDefault();update();});document.getElementById('glossary-query')!.addEventListener('input',update);}
  }
  document.querySelector('.skip-link')!.addEventListener('click',ev=>{ev.preventDefault();main.focus();});
  document.getElementById('global-search-form')!.addEventListener('submit',ev=>{ev.preventDefault();const hash='#search?q='+encodeURIComponent(search.value.trim());if(location.hash===hash)render(true);else location.hash=hash;});
  search.addEventListener('input',()=>{const q=search.value;updateHash(q?'#search?q='+encodeURIComponent(q):'#overview');});
  menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');if(open)sidebar.querySelector<HTMLAnchorElement>('a')?.focus();});
  document.addEventListener('keydown',ev=>{const target=ev.target as HTMLElement;if(ev.key==='/'&&!ev.ctrlKey&&!ev.metaKey&&!/INPUT|TEXTAREA|SELECT/.test(target.tagName)&&!target.isContentEditable){ev.preventDefault();search.focus();}if(ev.key==='Escape'&&sidebar.classList.contains('is-open')){closeMenu();menu.focus();}});
  document.addEventListener('click',ev=>{if(sidebar.classList.contains('is-open')&&!sidebar.contains(ev.target as Node)&&!menu.contains(ev.target as Node))closeMenu();});
  window.addEventListener('hashchange',()=>render(true));
  window.addEventListener('neuroatlas:viewchange',(event:Event)=>{
    const detail=(event as CustomEvent).detail, hash=detail.hash||'#'+detail.view;
    if(!detail.internal){location.hash=hash;return;}
    // The atlas already applied this interaction; update its address and shell without resetting local filters or selection.
    if(location.hash!==hash)history.pushState(null,'',hash);
    const route=hubUtils.parseRoute(hash).route;
    const view=route==='org'?'organizations':route==='tech'?'atlas':route==='person'?'researchers':route;
    document.querySelectorAll<HTMLElement>('.site-nav a').forEach(a=>{if(a.dataset.route===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.getElementById('atlas-view-title')!.textContent=labels[view]||'Explore the field';
    document.getElementById('atlas-view-description')!.textContent=descriptions[view]||'';
    document.title=(labels[view]||'Neuroengineering')+' — Neurovisual';
  });
  render();
})();
