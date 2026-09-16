const PeopleMap = (() => {
    const e = hubUtils.escapeHtml, u = hubUtils.sourceHref, data = neuroConnectionsData;
    const kinds = ['Person', 'Company', 'Institution', 'Lab'];
    const groups = [['all', 'All relationships'], ['training', 'Training & mentorship'], ['founding', 'Founding & spinouts'], ['work', 'Work & research']];
    const nodeById = new Map(data.nodes.map(n => [n.id, n]));
    const baseEdges = data.edges.filter(x => x.basis === 'documented' && kinds.includes(nodeById.get(x.from)?.kind) && kinds.includes(nodeById.get(x.to)?.kind));
    const baseIds = new Set(baseEdges.flatMap(x => [x.from, x.to]));
    const baseNodes = data.nodes.filter(n => baseIds.has(n.id)).sort((a, b) => a.name.localeCompare(b.name));
    let cy = null, resize, events;
    function viewParams(initial) {
        const params = new URLSearchParams(initial);
        if (!['focus', 'relation', 'node', 'edge', 'overview'].some(key => params.has(key))) {
            params.set('focus', 'paul-le-floch');
            params.set('depth', '2');
            params.set('example', '1');
        }
        return params;
    }
    function relationGroup(x) {
        if (/phd|student|postdoc|degree|train|mentor|bachelor|master|doctorate/i.test(x.label))
            return 'training';
        if (/^(co[- ]?founded|founded|founder of|founding shareholder|helped build founding team|co-established|spun|spin)|participated in the formation/i.test(x.label))
            return 'founding';
        return 'work';
    }
    function href(params, updates = {}) {
        const next = new URLSearchParams({ by: 'people' });
        for (const key of ['relation', 'focus', 'depth', 'node', 'edge', 'overview'])
            if (params.get(key))
                next.set(key, params.get(key));
        Object.entries(updates).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
        return '#explore?' + next.toString();
    }
    function model(params = new URLSearchParams()) {
        const relation = groups.some(([id]) => id === params.get('relation')) ? params.get('relation') : 'all';
        const requested = params.get('focus') || '', focus = baseIds.has(requested) ? requested : '';
        const depth = params.get('depth') === '2' ? 2 : 1;
        let edges = baseEdges.filter(x => relation === 'all' || relationGroup(x) === relation);
        let ids = new Set(edges.flatMap(x => [x.from, x.to]));
        if (focus) {
            ids = new Set([focus]);
            for (let step = 0; step < depth; step++) {
                const before = new Set(ids);
                edges.forEach(x => { if (before.has(x.from) || before.has(x.to)) {
                    ids.add(x.from);
                    ids.add(x.to);
                } });
            }
            edges = edges.filter(x => ids.has(x.from) && ids.has(x.to));
        }
        return { nodes: baseNodes.filter(n => ids.has(n.id)), edges, relation, focus, depth, invalidFocus: !!requested && !focus };
    }
    const normalized = (text) => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    function search(query) {
        const q = normalized(query.trim());
        if (!q)
            return [];
        return baseNodes.filter(n => normalized([n.name, n.subtitle, ...(n.aliases || [])].join(' ')).includes(q))
            .sort((a, b) => Number(normalized(b.name).startsWith(q)) - Number(normalized(a.name).startsWith(q)) || a.name.localeCompare(b.name));
    }
    function sourceLinks(sources) {
        return `<div class="pm-sources">${sources.map(s => `<a href="${u(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
    }
    function sentence(x) {
        return `<strong>${e(nodeById.get(x.from).name)}</strong> <span>${e(x.label)}</span> <strong>${e(nodeById.get(x.to).name)}</strong>`;
    }
    function starters(params) {
        return `<div class="pm-starters">${neuroExplorationPeopleData.paths.map((p) => {
            const [route, query] = p.href.split('?'), focus = decodeURIComponent(route.split('/')[1]), edge = new URLSearchParams(query).get('edge') || '';
            return `<a data-pm-nav href="${e(href(params, { focus, edge, node: '', relation: '', depth: '2' }))}"><small>${e(p.label || 'Explore a connection')}</small><strong>${e(p.title)} <span aria-hidden="true">→</span></strong></a>`;
        }).join('')}</div>`;
    }
    function welcome(params) {
        return `<div class="pm-panel-head"><span class="eyebrow">FOLLOW A CONNECTION</span><h3>Who connects to whom?</h3><p>Search for someone, or choose a starting connection below. Select a name or line on the map to read more.</p></div><div class="pm-empty-guide"><h4>A few places to begin</h4>${starters(params)}</div>`;
    }
    function nodeDetail(id, params) {
        const state = model(params), n = state.nodes.find(n => n.id === id);
        if (!n)
            return `<p class="pm-empty">This entry is outside the current map. Search for it to open its connections.</p>`;
        const related = state.edges.filter(x => x.from === id || x.to === id);
        const person = typeof NeuroPeople === 'undefined' ? undefined : NeuroPeople.scored.find(p => p.connectionIds.includes(id));
        const fullProfile = person ? '#people/' + encodeURIComponent(person.id) : n.href;
        return `<button class="pm-panel-back" type="button" data-pm-clear>← Map guide</button><div class="pm-panel-head"><span class="eyebrow">${e(n.kind)}</span><h3>${e(n.name)}</h3><p class="pm-subtitle">${e(n.subtitle)}</p>${n.summary && n.summary !== n.subtitle ? `<p>${e(n.summary)}</p>` : ''}</div><div class="pm-panel-actions"><a class="pm-focus-action" data-pm-nav href="${e(href(params, { focus: id, node: id, edge: '', depth: '1' }))}">Focus on these connections</a>${fullProfile ? `<a href="${fullProfile.startsWith('#') ? e(fullProfile) : u(fullProfile)}"${fullProfile.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}>Open full profile ↗</a>` : ''}</div><h4>${related.length} ${related.length === 1 ? 'relationship' : 'relationships'} in this view</h4><div class="pm-neighbors">${related.map(x => {
            const other = nodeById.get(x.from === id ? x.to : x.from);
            return `<div><button type="button" data-pm-node="${e(other.id)}"><strong>${e(other.name)}</strong><small>${e(other.kind)}</small></button><button class="pm-neighbor-relation" type="button" data-pm-edge="${e(x.id)}">${e(nodeById.get(x.from).name)} → ${e(x.label)} → ${e(nodeById.get(x.to).name)} <span>Read evidence ↗</span></button></div>`;
        }).join('') || '<p class="pm-empty">No relationships match this filter. Choose All relationships to explore more.</p>'}</div>`;
    }
    function edgeDetail(id, params) {
        const x = model(params).edges.find(x => x.id === id);
        if (!x)
            return '<p class="pm-empty">This relationship is outside the current map. Clear the filter or return to the map guide.</p>';
        return `<button class="pm-panel-back" type="button" data-pm-clear>← Map guide</button><section class="pm-evidence"><span class="eyebrow">DOCUMENTED RELATIONSHIP</span><div class="pm-evidence-direction"><button type="button" data-pm-node="${e(x.from)}">${e(nodeById.get(x.from).name)}</button><span>↓ ${e(x.label)}</span><button type="button" data-pm-node="${e(x.to)}">${e(nodeById.get(x.to).name)}</button></div><h3>${e(x.label)}</h3><small>${e(x.date)}</small><p>${e(x.detail)}</p>${x.limit ? `<p class="pm-limit">${e(x.limit)}</p>` : ''}<h4>Original sources</h4>${sourceLinks(x.sources)}</section>`;
    }
    function panel(params) {
        return params.get('edge') ? edgeDetail(params.get('edge'), params) : params.get('node') ? nodeDetail(params.get('node'), params) : welcome(params);
    }
    function render(params = new URLSearchParams()) {
        params = viewParams(params);
        const state = model(params);
        const legend = [['Person', 'People'], ['Company', 'Companies'], ['Institution', 'Institutions'], ['Lab', 'Labs']];
        return `<section class="pm-heading"><div><h2>See the people. Follow the connections.</h2><p>Explore the training, shared work, and organizations that connect researchers.</p></div><a href="#people">Browse all researcher profiles ↗</a></section><section class="pm-workspace" aria-label="People and organizations relationship map"><div class="pm-toolbar"><div class="pm-search"><label for="pm-search">Find a person or organization</label><input id="pm-search" type="search" placeholder="Search names, labs, companies…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="pm-search-results" aria-expanded="false"><div id="pm-search-results" class="pm-search-results" role="listbox" aria-label="Matching entries" hidden></div></div><div class="pm-filter"><label for="pm-relation">Show relationships</label><select id="pm-relation">${groups.map(([id, title]) => `<option value="${id}"${state.relation === id ? ' selected' : ''}>${title}</option>`).join('')}</select></div><a class="pm-reset" data-pm-nav href="#explore?by=people&amp;overview=1">Show whole map</a></div>${state.invalidFocus ? '<p class="pm-empty" role="status">That entry is not in this people-and-organizations map. Showing the overview.</p>' : ''}<div class="pm-map-status"><span id="pm-map-count" role="status">${state.nodes.length} ${state.nodes.length === 1 ? 'entry' : 'entries'} · ${state.edges.length} ${state.edges.length === 1 ? 'relationship' : 'relationships'}</span>${state.focus ? `<span class="pm-selection-badge">${params.get('example') ? 'Example connection' : 'Around ' + e(nodeById.get(state.focus).name)}</span><a class="pm-scope" data-pm-nav href="${e(href(params, { depth: state.depth === 1 ? '2' : '1', edge: '', node: state.focus }))}">${state.depth === 1 ? 'Show two steps' : 'Show direct connections'}</a>` : ''}</div><div class="pm-layout"><div class="pm-stage"><div id="pm-canvas" role="img" aria-label="Interactive map of sourced relationships. Use search or the readable list below for keyboard access."></div><div class="pm-map-controls" aria-label="Map controls"><button id="pm-zoom-in" type="button" aria-label="Zoom in">+</button><button id="pm-zoom-out" type="button" aria-label="Zoom out">−</button><button id="pm-fit" type="button">Fit map</button><button id="pm-show-details" type="button"${params.get('node') || params.get('edge') ? '' : ' hidden'}>Details ↓</button></div><div class="pm-map-hint">Drag to move · pinch or scroll to zoom</div></div><aside class="pm-panel" id="pm-panel" tabindex="-1" aria-label="Selected entry or relationship" aria-live="polite">${panel(params)}</aside></div><div class="pm-footer"><div class="pm-legend" aria-label="Map legend">${legend.map(([kind, label]) => `<span data-kind="${kind}"><i aria-hidden="true"></i>${label}</span>`).join('')}</div><p>Arrows describe sourced relationships. Position and size do not rank importance.</p></div></section><details class="pm-readable"><summary>Explore the same map as a readable list <span>${state.edges.length} ${state.edges.length === 1 ? 'relationship' : 'relationships'}</span></summary><details class="pm-readable-entries"><summary>Find an entry alphabetically</summary><div class="pm-entry-list">${state.nodes.map(n => `<button type="button" data-pm-node="${e(n.id)}"><strong>${e(n.name)}</strong><small>${e(n.kind)}</small></button>`).join('')}</div></details><div class="pm-readable-list">${state.edges.map(x => `<button type="button" data-pm-edge="${e(x.id)}">${sentence(x)}<small>${e(x.date)} · Read evidence ↗</small></button>`).join('') || '<p>No relationships match this view.</p>'}</div></details><div class="ex-actions"><a href="#connections?view=network">Include technologies in the full research network →</a><a href="#connections?view=coverage">Coverage &amp; sources →</a></div>`;
    }
    function close() {
        events?.abort();
        events = undefined;
        resize?.disconnect();
        resize = undefined;
        if (cy) {
            cy.destroy();
            cy = null;
        }
    }
    function bind(container, initial, navigate) {
        const canvas = container.querySelector('#pm-canvas');
        if (!canvas)
            return;
        close();
        events = new AbortController();
        const signal = events.signal;
        let params = viewParams(initial);
        const state = model(params), detail = container.querySelector('#pm-panel');
        const input = container.querySelector('#pm-search'), results = container.querySelector('#pm-search-results');
        let matches = [], active = -1, composing = false;
        const emphasize = () => {
            if (!cy)
                return;
            cy.elements().removeClass('pm-selected pm-related pm-dim');
            const edge = params.get('edge'), node = params.get('node');
            if (edge && state.edges.some(x => x.id === edge)) {
                cy.elements().addClass('pm-dim');
                const selected = cy.getElementById('pm-edge-' + edge);
                selected.removeClass('pm-dim').addClass('pm-selected');
                selected.connectedNodes().removeClass('pm-dim').addClass('pm-related');
            }
            else if (node && state.nodes.some(n => n.id === node)) {
                cy.elements().addClass('pm-dim');
                const selected = cy.getElementById(node);
                selected.closedNeighborhood().removeClass('pm-dim').addClass('pm-related');
                selected.addClass('pm-selected');
            }
        };
        const select = (kind, id = '', keyboard = false) => {
            params.delete('node');
            params.delete('edge');
            if (kind)
                params.set(kind, id);
            history.pushState(null, '', href(params));
            detail.innerHTML = panel(params);
            detail.scrollTop = 0;
            emphasize();
            const jump = container.querySelector('#pm-show-details');
            if (jump)
                jump.hidden = !kind;
            if (keyboard)
                detail.focus();
        };
        container.addEventListener('click', event => {
            const target = event.target.closest('[data-pm-node],[data-pm-edge],[data-pm-nav],[data-pm-clear]');
            if (!target || !container.contains(target))
                return;
            const mouse = event;
            if (target.hasAttribute('data-pm-nav')) {
                if (mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey || mouse.button !== 0)
                    return;
                event.preventDefault();
                navigate(target.getAttribute('href'), 'pm-relation');
                return;
            }
            if (target.hasAttribute('data-pm-clear'))
                select('', '', mouse.detail === 0);
            else if (target.dataset.pmEdge)
                select('edge', target.dataset.pmEdge, mouse.detail === 0);
            else if (target.dataset.pmNode && !results.contains(target))
                select('node', target.dataset.pmNode, mouse.detail === 0);
        }, { signal });
        const hideSearch = () => { results.hidden = true; active = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); };
        const openResult = (id) => navigate(href(params, { focus: id, node: id, edge: '', depth: '1', relation: '' }), 'pm-panel');
        const drawResults = () => {
            matches = search(input.value).slice(0, 10);
            active = -1;
            input.removeAttribute('aria-activedescendant');
            if (!input.value.trim()) {
                hideSearch();
                return;
            }
            results.hidden = false;
            input.setAttribute('aria-expanded', 'true');
            results.innerHTML = matches.map((n, i) => `<button type="button" role="option" aria-selected="false" tabindex="-1" id="pm-result-${i}" data-pm-node="${e(n.id)}"><strong>${e(n.name)}</strong><small>${e(n.kind)} · ${e(n.subtitle)}</small></button>`).join('') || '<p role="status">No mapped matches. Try a surname, company, or institution.</p>';
        };
        input.addEventListener('input', () => { if (!composing)
            drawResults(); }, { signal });
        input.addEventListener('compositionstart', () => { composing = true; }, { signal });
        input.addEventListener('compositionend', () => { composing = false; drawResults(); }, { signal });
        input.addEventListener('keydown', event => {
            if (event.isComposing || composing)
                return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                hideSearch();
            }
            if (['ArrowDown', 'ArrowUp'].includes(event.key) && matches.length && !results.hidden) {
                event.preventDefault();
                active = active < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1) : (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
                results.querySelectorAll('[role=option]').forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
                input.setAttribute('aria-activedescendant', 'pm-result-' + active);
                results.querySelector('#pm-result-' + active)?.scrollIntoView({ block: 'nearest' });
            }
            if (event.key === 'Enter' && matches.length && !results.hidden) {
                event.preventDefault();
                openResult(matches[Math.max(0, active)].id);
            }
        }, { signal });
        results.addEventListener('click', event => { const button = event.target.closest('[data-pm-node]'); if (button)
            openResult(button.dataset.pmNode); }, { signal });
        document.addEventListener('click', event => { if (!event.target.closest('.pm-search'))
            hideSearch(); }, { signal });
        container.querySelector('#pm-relation').addEventListener('change', event => navigate(href(params, { relation: event.target.value, node: state.focus, edge: '' }), 'pm-relation'), { signal });
        container.querySelector('#pm-show-details')?.addEventListener('click', () => { detail.scrollIntoView({ block: 'start' }); detail.focus({ preventScroll: true }); }, { signal });
        const controls = container.querySelectorAll('.pm-map-controls button:not(#pm-show-details)');
        const fallback = () => { canvas.innerHTML = '<p class="pm-fallback">The map could not load here. Search for an entry or open the readable relationship list below.</p>'; controls.forEach(button => button.disabled = true); };
        if (typeof cytoscape === 'undefined') {
            fallback();
            return;
        }
        const fitPadding = () => canvas.clientWidth < 500 ? 28 : 65;
        try {
            cy = cytoscape({
                container: canvas,
                elements: [...state.nodes.map((n, index) => {
                        const angle = index * Math.PI * (3 - Math.sqrt(5)), radius = 90 * Math.sqrt(index + 1);
                        return { data: { id: n.id, label: n.name, kind: n.kind }, position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius } };
                    }), ...state.edges.map(x => ({ data: { id: 'pm-edge-' + x.id, edgeId: x.id, source: x.from, target: x.to, label: x.label } }))],
                layout: { name: 'cose', animate: false, randomize: false, nodeDimensionsIncludeLabels: true, nodeRepulsion: () => 4500, idealEdgeLength: () => 80, componentSpacing: 75, gravity: .08, numIter: 600, padding: fitPadding() },
                minZoom: .12, maxZoom: 2.5,
                style: [
                    { selector: 'node', style: { 'label': 'data(label)', 'font-family': 'Inter, system-ui, sans-serif', 'font-size': 13, 'font-weight': 500, 'color': '#183655', 'text-wrap': 'wrap', 'text-max-width': 115, 'text-valign': 'bottom', 'text-margin-y': 7, 'text-background-color': '#f8fafc', 'text-background-opacity': .88, 'text-background-padding': 2, 'background-color': '#173b65', 'border-width': 2, 'border-color': '#ffffff', 'width': 32, 'height': 32 } },
                    { selector: 'node[kind="Company"]', style: { 'background-color': '#287b78', 'shape': 'round-rectangle' } },
                    { selector: 'node[kind="Institution"]', style: { 'background-color': '#a77d34', 'shape': 'round-rectangle' } },
                    { selector: 'node[kind="Lab"]', style: { 'background-color': '#806895' } },
                    { selector: 'edge', style: { 'width': 1.5, 'line-color': '#b5c5d4', 'target-arrow-color': '#8fa8be', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': .7, 'label': state.nodes.length <= 18 ? 'data(label)' : '', 'font-size': 10, 'color': '#426181', 'text-wrap': 'wrap', 'text-max-width': 95, 'text-background-color': '#f8fafc', 'text-background-opacity': .95, 'text-background-padding': 3 } },
                    { selector: '.pm-dim', style: { 'opacity': .38 } },
                    { selector: 'node.pm-related', style: { 'border-color': '#749bbb', 'border-width': 3 } },
                    { selector: 'node.pm-selected', style: { 'border-color': '#122f55', 'border-width': 5, 'font-weight': 700 } },
                    { selector: 'edge.pm-related, edge.pm-selected', style: { 'width': 2.7, 'line-color': '#244e79', 'target-arrow-color': '#244e79', 'label': 'data(label)' } }
                ]
            });
            cy.on('tap', 'node', (event) => select('node', event.target.id()));
            cy.on('tap', 'edge', (event) => select('edge', event.target.data('edgeId')));
            cy.on('tap', (event) => { if (event.target === cy)
                select(''); });
            container.querySelector('#pm-fit').addEventListener('click', () => cy?.fit(undefined, fitPadding()), { signal });
            const zoom = (factor) => cy?.zoom({ level: Math.max(.12, Math.min(2.5, cy.zoom() * factor)), renderedPosition: { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 } });
            container.querySelector('#pm-zoom-in').addEventListener('click', () => zoom(1.35), { signal });
            container.querySelector('#pm-zoom-out').addEventListener('click', () => zoom(1 / 1.35), { signal });
            if (typeof ResizeObserver !== 'undefined') {
                let width = canvas.clientWidth, height = canvas.clientHeight;
                resize = new ResizeObserver(() => {
                    if (!cy)
                        return;
                    cy.resize();
                    if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
                        cy.fit(undefined, fitPadding());
                        width = canvas.clientWidth;
                        height = canvas.clientHeight;
                    }
                });
                resize.observe(canvas);
            }
            emphasize();
        }
        catch (_) {
            if (cy) {
                cy.destroy();
                cy = null;
            }
            fallback();
        }
    }
    return { render, bind, close, model, relationGroup, search, nodeDetail, edgeDetail, href };
})();
