// A person-first entry into the same sourced relationship graph.
const PeopleWorkplaces = (() => {
  const e = hubUtils.escapeHtml, u = hubUtils.sourceHref;
  const areas: Record<string, string> = {record:'Recording & imaging', stimulate:'Stimulation & modulation', restore:'Restoration & clinical interfaces', compute:'Computation & decoding', personal:'Ethics & human experience', translation:'Technology translation'};
  const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const people = () => NeuroPeople.scored.filter(p => p.affiliations?.length);
  const directory = (params: URLSearchParams) => params.get('view') === 'people' || (params.get('view') !== 'map' && !['focus','node','edge','relation','overview'].some(key => params.has(key)));
  const href = (params: URLSearchParams, updates: Record<string,string> = {}) => {
    const next = new URLSearchParams({by:'people',view:'people'});
    for (const key of ['q','area','workplace','sort','page']) if (params.get(key)) next.set(key, params.get(key)!);
    Object.entries(updates).forEach(([key,value]) => value ? next.set(key,value) : next.delete(key));
    return '#explore?' + next;
  };
  function state(params: URLSearchParams) {
    const all = people(), q = params.get('q') || '', area = params.get('area') || '', workplace = params.get('workplace') || '', sort = params.get('sort') === 'name' ? 'name' : 'influence';
    const filtered = all.filter(p => (!area || p.group === area) && (!workplace || p.affiliations!.some(a => a.organizationId === workplace)) && normalize([p.name,p.institution,p.summary,...p.affiliations!.map(a => a.role + ' ' + a.country)].join(' ')).includes(normalize(q.trim())));
    filtered.sort((a,b) => {
      const nameMatch = q.trim() ? Number(normalize(b.name).includes(normalize(q.trim()))) - Number(normalize(a.name).includes(normalize(q.trim()))) : 0;
      return nameMatch || (sort === 'name' ? a.name.localeCompare(b.name) : (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name));
    });
    const pages = Math.max(1,Math.ceil(filtered.length / 12)), page = Math.max(1,Math.min(pages,Math.floor(Number(params.get('page')) || 1)));
    const organizations = [...new Map(all.flatMap(p => p.affiliations!).map(a => [a.organizationId,{id:a.organizationId,name:a.organizationName}])).values()].sort((a,b) => a.name.localeCompare(b.name));
    return {all,q,area,workplace,sort,filtered,pages,page,shown:filtered.slice((page-1)*12,page*12),organizations};
  }
  function mapLink(node: string) {
    return '#explore?' + new URLSearchParams({by:'people',view:'map',focus:node,node,depth:'1',relation:'affiliation'});
  }
  function navigation(selected: string) {
    return `<nav class="pw-tabs" aria-label="People exploration views"><a href="#explore?by=people"${selected === 'people' ? ' aria-current="true"' : ''}>People &amp; workplaces</a><a href="#explore?by=people&amp;view=map"${selected === 'map' ? ' aria-current="true"' : ''}>Connection map</a></nav>`;
  }
  function render(params: URLSearchParams) {
    const s = state(params);
    return `${navigation('people')}<section class="pw-heading"><div><span class="eyebrow">START WITH A RESEARCHER</span><h2>People, then places.</h2><p>See where researchers work. Open their organization to find others there, then follow the relationships behind their research.</p></div><div class="pw-count"><strong>${s.all.length}</strong><span>people with checked affiliations<br>${s.organizations.length} organizations</span></div></section>
      <form id="pw-filter" class="pw-filter" role="search"><label class="pw-query"><span>Find a researcher</span><input id="pw-query" type="search" name="q" value="${e(s.q)}" placeholder="Name, workplace, or research area"></label><label><span>Research area</span><select id="pw-area"><option value="">All areas</option>${Object.entries(areas).map(([id,label]) => `<option value="${id}"${s.area === id ? ' selected' : ''}>${e(label)}</option>`).join('')}</select></label><label><span>Workplace</span><select id="pw-workplace"><option value="">All organizations</option>${s.organizations.map(org => `<option value="${e(org.id)}"${s.workplace === org.id ? ' selected' : ''}>${e(org.name)}</option>`).join('')}</select></label><label><span>Order by</span><select id="pw-sort"><option value="influence"${s.sort === 'influence' ? ' selected' : ''}>Publication influence</option><option value="name"${s.sort === 'name' ? ' selected' : ''}>Name A–Z</option></select></label><button type="submit">Find people</button></form>
      <div class="pw-results"><p role="status" id="pw-result-count" tabindex="-1">${s.filtered.length} people · page ${s.page} of ${s.pages}</p><a href="#people?include=all">All ${neuroPeopleData.people.length} researcher profiles ↗</a></div>
      <p class="pw-note">${s.q.trim() ? 'Name matches appear first. ' : ''}${s.sort === 'influence' ? 'Ordered by the atlas’s existing publication-based influence index. ' : 'Names are listed alphabetically. '}<a href="#people?view=method">About the ranking</a> · Roles have their own sources and review dates.</p>
      <div class="pw-list">${s.shown.map(p => `<article class="pw-person" data-researcher="${e(p.id)}"><div class="pw-person-name"><span class="pw-initials" aria-hidden="true">${e(p.name.split(/\s+/).filter(Boolean).map(w => w[0]).filter((_,i,a) => i === 0 || i === a.length-1).join(''))}</span><div><h3><a href="#people/${e(p.id)}">${e(p.name)}</a></h3><p>${e(areas[p.group] || p.group)}</p>${p.score !== null ? `<small>Publication influence #${NeuroPeople.rank(p)}</small>` : ''}</div></div><div class="pw-roles">${p.affiliations!.map(a => `<div class="pw-role"><a class="pw-organization" data-pw-map href="${e(mapLink(a.organizationId))}">${e(a.organizationName)} <span aria-hidden="true">→</span></a><p>${e(a.role)}${a.status !== 'current' ? ` <span class="pw-status">${a.status === 'emeritus' ? 'Emeritus' : 'Historical'}</span>` : ''}</p><small>${e(a.country)} · Checked ${e(a.reviewed)} · <a href="${u(a.sources[0].url)}" target="_blank" rel="noopener noreferrer">Source ↗</a></small></div>`).join('')}</div><a class="pw-map-link" data-pw-map href="${e(mapLink(p.affiliations![0].nodeId))}">Map connections →</a></article>`).join('') || `<div class="pw-empty"><h3>No researchers match.</h3><p>Try a name or a broader workplace filter.</p><a data-pw-nav href="#explore?by=people">Clear filters →</a></div>`}</div>
      ${s.pages > 1 ? `<nav class="pw-pagination" aria-label="Researcher pages">${s.page > 1 ? `<a data-pw-nav href="${e(href(params,{page:String(s.page-1)}))}">← Previous</a>` : '<span></span>'}<span>${s.page} / ${s.pages}</span>${s.page < s.pages ? `<a data-pw-nav href="${e(href(params,{page:String(s.page+1)}))}">Next 12 →</a>` : '<span></span>'}</nav>` : ''}
      <aside class="pw-context"><strong>A shared workplace is a starting point.</strong><p>Two people at the same university are connected through that institution. Mentorship, collaboration, and company formation appear only when separately documented. This checked subset expands the existing researcher atlas.</p></aside>`;
  }
  function bind(container: HTMLElement, params: URLSearchParams, navigate: (hash:string, focusId?:string) => void) {
    const form = container.querySelector<HTMLFormElement>('#pw-filter');
    form?.addEventListener('submit', event => {
      event.preventDefault();
      navigate(href(params,{q:container.querySelector<HTMLInputElement>('#pw-query')!.value.trim(),area:container.querySelector<HTMLSelectElement>('#pw-area')!.value,workplace:container.querySelector<HTMLSelectElement>('#pw-workplace')!.value,sort:container.querySelector<HTMLSelectElement>('#pw-sort')!.value,page:''}),'pw-query');
    });
    container.querySelectorAll<HTMLAnchorElement>('[data-pw-nav],[data-pw-map]').forEach(link => link.addEventListener('click',event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const isMap = link.hasAttribute('data-pw-map');
      navigate(link.getAttribute('href')!,isMap ? 'pm-relation' : 'pw-result-count');
      document.querySelector(isMap ? '.pm-workspace' : '#pw-result-count')?.scrollIntoView({block:'start'});
    }));
  }
  return {render,bind,state,directory,navigation,mapLink};
})();
