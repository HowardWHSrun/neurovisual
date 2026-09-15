const NeuroConnections = (() => {
    const e = hubUtils.escapeHtml, u = hubUtils.sourceHref, d = neuroConnectionsData;
    const node = (id) => d.nodes.find(n => n.id === id);
    const edge = (id) => d.edges.find(x => x.id === id);
    const glyphs = { Person: '○', Lab: '⌂', Company: '▦', Technology: '◇', Institution: '▥', Program: '◎' };
    function href(id, params = new URLSearchParams(), changes = {}) { const p = new URLSearchParams(params); Object.entries(changes).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k)); return '#connections/' + encodeURIComponent(id) + (p.size ? '?' + p.toString() : ''); }
    function incident(id, lens = 'all') { return d.edges.filter(x => (x.from === id || x.to === id) && (lens === 'all' || x.category === lens)); }
    function state(id, params) {
        const story = d.stories.find(s => s.id === params.get('story')) || (!id ? d.stories[0] : null);
        const current = node(id) || (!id ? node(story.focus) : undefined);
        const lens = ['people', 'technology'].includes(params.get('lens') || '') ? params.get('lens') : 'all';
        const edges = current ? incident(current.id, lens) : [];
        const selected = edges.find(x => x.id === (params.get('edge') || story?.edges[0])) || edges[0];
        return { story, current, lens, edges, selected, list: params.get('view') === 'list' };
    }
    function identity(n, selected = false, params = new URLSearchParams()) {
        const inner = `<span class="cn-kind"><i aria-hidden="true">${glyphs[n.kind]}</i>${e(n.kind)}</span><strong>${e(n.name)}</strong><small>${e(n.subtitle)}</small>`;
        return selected ? `<div class="cn-node cn-current" data-cn-center data-kind="${n.kind}">${inner}<span class="cn-current-label">YOU ARE HERE</span></div>` : `<a class="cn-node" data-cn-nav href="${e(href(n.id, params, { edge: '' }))}" data-kind="${n.kind}" aria-label="Explore connections: ${e(n.name)}">${inner}<span class="cn-explore" aria-hidden="true">Explore ↗</span></a>`;
    }
    function relation(x, current, selected, params, side = 'right') {
        const incoming = x.basis !== 'comparison' && x.to === current.id, other = node(x.to === current.id ? x.from : x.to);
        return `<div class="cn-branch" data-cn-branch="${e(x.id)}" data-direction="${incoming ? 'in' : 'out'}" data-side="${side}">${identity(other, false, params)}<button type="button" class="cn-edge ${x.basis === 'comparison' ? 'cn-comparison' : ''}" data-cn-edge="${e(x.id)}" aria-pressed="${selected?.id === x.id}" aria-label="Evidence: ${e(node(x.from).name + ' ' + x.label + ' ' + node(x.to).name)}"><span>${e(x.label)} <b aria-hidden="true">${x.basis === 'comparison' ? '↔' : ((side === 'left') !== incoming ? '←' : '→')}</b></span><small>${e(x.date)}${x.basis === 'comparison' ? ' · comparison' : ''}</small></button></div>`;
    }
    function evidence(x) {
        if (!x)
            return `<section class="cn-evidence"><span class="eyebrow">RELATIONSHIP EVIDENCE</span><h2>No links in this lens.</h2><p>Choose “All connections” to see this entry’s documented relationships.</p></section>`;
        return `<section class="cn-evidence" id="cn-evidence" tabindex="-1"><div class="cn-evidence-head"><span class="eyebrow">${x.basis === 'comparison' ? 'TECHNICAL COMPARISON' : 'DOCUMENTED CONNECTION'}</span><span>${e(x.date)}</span></div><h2>${e(node(x.from).name)} <em>${e(x.label)}</em> ${e(node(x.to).name)}</h2><p>${e(x.detail)}</p>${x.limit ? `<p class="cn-limit">${e(x.limit)}</p>` : ''}<div class="cn-sources"><span>CHECK THE ORIGINAL EVIDENCE</span>${x.sources.map(s => `<a href="${u(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} <b aria-hidden="true">↗</b></a>`).join('')}</div></section>`;
    }
    function nodeContext(n) {
        const m = n.media ? NeuroVisuals.items().find(m => m.id === n.media) : null;
        return `<section class="cn-context">${m ? `<figure><button type="button" class="cn-photo" data-visual-open="${e(m.id)}" aria-label="Enlarge image: ${e(m.title)}">${NeuroVisuals.picture(m)}<span>View research image ⤢</span></button>${NeuroVisuals.credit(m)}</figure>` : ''}<span class="eyebrow">${e(n.kind)} IN CONTEXT</span><h2>${e(n.name)}</h2><p>${e(n.summary)}</p>${n.href ? `<a class="cn-profile" href="${n.href.startsWith('#') ? e(n.href) : u(n.href)}"${n.href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}>Open full profile ↗</a>` : ''}</section>`;
    }
    function graph(current, edges, selected, params, side = 'right') {
        const split = Math.ceil(edges.length / 2), left = edges.slice(0, split), right = edges.slice(split);
        return `<div class="cn-map" id="cn-map"><svg class="cn-wires" aria-hidden="true" focusable="false"><defs><marker id="cn-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7" fill="currentColor"/></marker></defs><g id="cn-wire-paths"></g></svg><div class="cn-map-side"><span class="cn-column-label">CONNECTED ENTRIES</span>${left.map(x => relation(x, current, selected, params, 'left')).join('') || '<p class="cn-no-branch">No links documented in this lens.</p>'}</div><div class="cn-map-focus">${identity(current, true)}<span class="cn-degree">${edges.length} direct connections</span></div><div class="cn-map-side"><span class="cn-column-label">FOLLOW THE THREAD</span>${right.map(x => relation(x, current, selected, params, 'right')).join('') || '<p class="cn-no-branch">Explore a connected entry to follow the next link.</p>'}</div></div>`;
    }
    function list(current, edges, selected, params) {
        return `<div class="cn-list">${edges.map(x => `<article class="cn-list-row"><div><a data-cn-nav href="${e(href(x.from, params, { edge: '' }))}">${e(node(x.from).name)}</a><span>${e(x.label)} ${x.basis === 'comparison' ? '↔' : '→'}</span><a data-cn-nav href="${e(href(x.to, params, { edge: '' }))}">${e(node(x.to).name)}</a></div><button type="button" data-cn-edge="${e(x.id)}" aria-pressed="${selected?.id === x.id}" aria-label="Evidence: ${e(node(x.from).name + ' ' + x.label + ' ' + node(x.to).name)}">${e(x.date)} · ${x.basis === 'comparison' ? 'Comparison' : 'Evidence'} ↗</button></article>`).join('') || '<p>No relationships in this lens. Choose “All connections” to see the other links.</p>'}</div>`;
    }
    function render(id = '', params = new URLSearchParams()) {
        const { story, current, lens, edges, selected, list: isList } = state(id, params);
        if (!current)
            return `<div class="cn-page"><h1>Connection not found.</h1><p>This entry has not been mapped yet.</p><a href="#connections">Explore the research connections →</a></div>`;
        const p = new URLSearchParams(params);
        if (story)
            p.set('story', story.id);
        return `<div class="cn-page"><header class="cn-head"><div><span class="eyebrow">PEOPLE · LABS · COMPANIES · TECHNOLOGIES</span><h1>Ideas have histories.</h1><p>Follow the people who trained together, the companies they built, and the engineering that connects their work.</p></div><div class="cn-stat"><strong>${d.edges.length}</strong><span>documented &amp; compared<br>across ${d.nodes.length} entries</span></div></header>
   <section class="cn-stories" aria-label="Guided connection stories"><div class="cn-section-label"><span>START WITH A STORY</span><a href="#connections/${e(current.id)}" data-cn-nav>Free exploration ↗</a></div><nav>${d.stories.map((s, i) => `<a href="${e(href(s.focus, new URLSearchParams({ story: s.id, edge: s.edges[0] })))}" data-cn-nav${story?.id === s.id ? ' aria-current="true"' : ''}><span>0${i + 1}</span>${e(s.title)}</a>`).join('')}</nav>${story ? `<div class="cn-story-copy"><p>${e(story.deck)}</p><div class="cn-trail" aria-label="Entries in this story; select one to explore">${story.trail.map((id, i) => `<a data-cn-nav href="${e(href(id, p, { edge: '' }))}"${current.id === id ? ' aria-current="true"' : ''}><i aria-hidden="true">${glyphs[node(id).kind]}</i>${e(node(id).name)}</a>${i < story.trail.length - 1 ? '<span aria-hidden="true">·</span>' : ''}`).join('')}</div></div>` : ''}</section>
   <form class="cn-toolbar" id="cn-controls"><label><span>Explore an entry</span><select id="cn-node-select" name="node">${['Person', 'Lab', 'Institution', 'Company', 'Technology', 'Program'].map(k => `<optgroup label="${k}">${d.nodes.filter(n => n.kind === k).sort((a, b) => a.name.localeCompare(b.name)).map(n => `<option value="${e(n.id)}"${n.id === current.id ? ' selected' : ''}>${e(n.name)}</option>`).join('')}</optgroup>`).join('')}</select></label><label><span>Connection lens</span><select id="cn-lens" name="lens"><option value="all"${lens === 'all' ? ' selected' : ''}>All connections</option><option value="people"${lens === 'people' ? ' selected' : ''}>People &amp; organizations</option><option value="technology"${lens === 'technology' ? ' selected' : ''}>Technical relationships</option></select></label><div class="cn-view" role="group" aria-label="Connection display">${['map', 'list'].map(v => `<button type="button" data-cn-view="${v}" aria-pressed="${isList ? v === 'list' : v === 'map'}">${v === 'map' ? 'Connection map' : 'Readable list'}</button>`).join('')}</div></form>
   <div class="cn-workbench"><section class="cn-network" aria-labelledby="cn-network-title"><div class="cn-network-head"><div><span class="eyebrow">FOLLOW A CONNECTION</span><h2 id="cn-network-title">Around ${e(current.name)}</h2></div><span class="cn-legend"><i></i> Documented <i class="cn-dash"></i> Comparison</span></div><p class="cn-map-help">Select a name to move through the map. Select a relationship to read its evidence.</p>${isList ? list(current, edges, selected, p) : graph(current, edges, selected, p)}<div class="cn-reading-note">Arrows read from subject to object: “person → co-founded → company.” Dashed comparisons have no direction. A shared method does not establish mentorship, a spinout, or an IP transfer.</div><div id="cn-evidence-slot" aria-live="polite">${evidence(selected)}</div></section><aside>${nodeContext(current)}</aside></div>
   <details class="cn-method"><summary>How these connections are researched</summary><p>This is a selected, expanding map, reviewed ${e(d.reviewed)}. Each relationship has its own primary sources and date context. Dates describe the event where established; “reported” dates identify source publication, and “undated” means the source gives no event date. Technical comparisons are editorial readings of the linked papers, not claims of descent or collaboration. Missing links mean the relationship has not been documented here.</p><p>Institution labels follow the place and period in the evidence. Current affiliations are not applied retroactively to a person’s training. “Co-authored” does not mean “supervised”; “uses” does not mean “licensed.”</p><a href="./data/connections.json" download>Download the relationship data ↓</a></details></div>`;
    }
    let observer;
    function close() { observer?.disconnect(); observer = undefined; }
    function draw(container) {
        const map = container.querySelector('#cn-map'), center = container.querySelector('[data-cn-center]'), paths = container.querySelector('#cn-wire-paths');
        if (!map || !center || !paths)
            return;
        if (window.matchMedia('(max-width: 700px)').matches) {
            paths.innerHTML = '';
            return;
        }
        const bounds = map.getBoundingClientRect(), c = center.getBoundingClientRect();
        paths.innerHTML = Array.from(map.querySelectorAll('[data-cn-branch]')).map(branch => { const b = branch.querySelector('.cn-node').getBoundingClientRect(), incoming = branch.dataset.direction === 'in'; const left = branch.dataset.side === 'left', bx = left ? b.right : b.left, cx = left ? c.left : c.right, x1 = (incoming ? bx : cx) - bounds.left, y1 = (incoming ? b.top + b.height / 2 : c.top + c.height / 2) - bounds.top, x2 = (incoming ? cx : bx) - bounds.left, y2 = (incoming ? c.top + c.height / 2 : b.top + b.height / 2) - bounds.top, mid = (x1 + x2) / 2; const comparison = edge(branch.dataset.cnBranch).basis === 'comparison', active = branch.querySelector('button').getAttribute('aria-pressed') === 'true'; return `<path d="M${x1} ${y1}C${mid} ${y1},${mid} ${y2},${x2} ${y2}" class="${comparison ? 'cn-dashed ' : ''}${active ? 'cn-wire-active' : ''}" ${comparison ? '' : 'marker-end="url(#cn-arrow)"'}/>`; }).join('');
    }
    function bind(container, id, params, navigate) {
        close();
        const s = state(id, params);
        if (!s.current)
            return;
        const current = s.current;
        const p = new URLSearchParams(params);
        if (s.story)
            p.set('story', s.story.id);
        container.querySelectorAll('[data-cn-nav]').forEach(a => a.addEventListener('click', ev => { if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey)
            return; ev.preventDefault(); navigate(a.getAttribute('href')); }));
        container.querySelector('#cn-controls')?.addEventListener('submit', ev => ev.preventDefault());
        container.querySelector('#cn-node-select')?.addEventListener('change', ev => navigate(href(ev.target.value, p, { edge: '' }), 'cn-node-select'));
        container.querySelector('#cn-lens')?.addEventListener('change', ev => navigate(href(current.id, p, { lens: ev.target.value, edge: '' }), 'cn-lens'));
        container.querySelectorAll('[data-cn-view]').forEach(b => b.addEventListener('click', () => navigate(href(current.id, p, { view: b.dataset.cnView }))));
        container.querySelectorAll('[data-cn-edge]').forEach(b => b.addEventListener('click', () => { const x = edge(b.dataset.cnEdge); p.set('edge', x.id); history.pushState(null, '', href(current.id, p)); container.querySelectorAll('[data-cn-edge]').forEach(el => el.setAttribute('aria-pressed', String(el === b))); container.querySelector('#cn-evidence-slot').innerHTML = evidence(x); draw(container); const target = container.querySelector('#cn-evidence'); target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }));
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(() => draw(container));
            const map = container.querySelector('#cn-map');
            if (map)
                observer.observe(map);
        }
        draw(container);
    }
    function teaser(profileHref) { const n = d.nodes.find(n => n.href === profileHref || n.aliases?.includes(profileHref)); if (!n)
        return ''; const count = incident(n.id).length; return `<a class="cn-teaser" href="${e(href(n.id))}"><span class="cn-teaser-icon" aria-hidden="true">○—◇—▦</span><span><small>RESEARCH CONNECTIONS</small><strong>Follow ${e(n.name)}’s connections</strong><span>${count} sourced relationships · people, organizations &amp; technologies</span></span><b aria-hidden="true">↗</b></a>`; }
    function spotlight() { return `<a class="cn-spotlight" href="#connections"><div><span class="eyebrow">THE RELATIONSHIP MAP</span><h2>Who learned from whom?<br>Where did the idea go next?</h2><p>Trace the paths between researchers, their labs, companies, and technologies.</p><strong>Explore research connections ↗</strong></div><div class="cn-spotlight-path" aria-hidden="true"><span>Person</span><i>→ trained with →</i><span>Researcher</span><i>→ co-founded →</i><span>Company</span></div></a>`; }
    function records() { return d.nodes.map(n => ({ id: 'connection-' + n.id, title: n.name + ' — connections', description: n.summary, kind: 'Research connection', href: href(n.id), keywords: n.subtitle + ' ' + incident(n.id).map(x => node(x.from).name + ' ' + x.label + ' ' + node(x.to).name).join(' ') })); }
    return { render, bind, close, records, teaser, spotlight, incident, state };
})();
