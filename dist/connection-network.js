const ConnectionNetwork = (() => {
    const e = hubUtils.escapeHtml, u = hubUtils.sourceHref, d = neuroConnectionsData;
    let cy = null, resize;
    const node = (id) => d.nodes.find(n => n.id === id);
    const href = (id = '', params = {}) => '#connections' + (id ? '/' + encodeURIComponent(id) : '') + '?' + new URLSearchParams({ view: 'network', ...params }).toString();
    function shortest(from, to, comparisons = false) { if (!node(from) || !node(to))
        return null; if (from === to)
        return { nodes: [from], edges: [] }; const queue = [from], seen = new Set(queue), previous = new Map(); for (let i = 0; i < queue.length; i++) {
        const id = queue[i];
        for (const x of d.edges.filter(x => (comparisons || x.basis === 'documented') && (x.from === id || x.to === id))) {
            const next = x.from === id ? x.to : x.from;
            if (seen.has(next))
                continue;
            seen.add(next);
            previous.set(next, { node: id, edge: x.id });
            queue.push(next);
            if (next === to) {
                const nodes = [to], edges = [];
                let at = to;
                while (at !== from) {
                    const p = previous.get(at);
                    edges.unshift(p.edge);
                    nodes.unshift(p.node);
                    at = p.node;
                }
                return { nodes, edges };
            }
        }
    } return null; }
    function subset(id, params) { const comparison = params.get('comparisons') === 'yes', allowed = d.edges.filter(x => comparison || x.basis === 'documented'), to = params.get('to') || ''; if (id && to) {
        const path = shortest(id, to, comparison);
        return { nodes: path?.nodes || [id, to].filter(id => node(id)), edges: path?.edges || [], path, mode: 'path' };
    } if (!node(id) || params.get('scope') === 'all')
        return { nodes: d.nodes.map(n => n.id), edges: allowed.map(x => x.id), path: null, mode: 'all' }; const ids = new Set([id]); for (let depth = 0; depth < 2; depth++) {
        const before = new Set(ids);
        allowed.forEach(x => { if (before.has(x.from) || before.has(x.to)) {
            ids.add(x.from);
            ids.add(x.to);
        } });
    } return { nodes: [...ids], edges: allowed.filter(x => ids.has(x.from) && ids.has(x.to)).map(x => x.id), path: null, mode: 'nearby' }; }
    function elements(ids, edgeIds) { return [...ids.map(id => { const n = node(id); return { data: { id, label: n.name, kind: n.kind, summary: n.summary, url: n.href || '' } }; }), ...edgeIds.map(id => { const x = d.edges.find(x => x.id === id); return { data: { id: 'edge-' + id, edgeId: id, source: x.from, target: x.to, label: x.label, basis: x.basis, date: x.date, detail: x.detail, sources: x.sources } }; })]; }
    function sentence(id) { const x = d.edges.find(x => x.id === id); return `<strong>${e(node(x.from).name)}</strong> <em>${e(x.label)}</em> <strong>${e(node(x.to).name)}</strong>`; }
    function render(id, params) { if (id && !node(id))
        return '<h1>Connection not found.</h1><p>This entry has not been mapped yet.</p><a href="#connections">Explore company histories →</a>'; const selected = node(id), set = subset(id, params), all = d.nodes.slice().sort((a, b) => a.name.localeCompare(b.name)), opts = (value) => all.map(n => `<option value="${e(n.id)}"${value === n.id ? ' selected' : ''}>${e(n.name)} · ${e(n.kind)}</option>`).join(''); const start = selected?.id || ''; return `<header class="or-network-head"><div><span class="eyebrow">FOLLOW THE WIDER WEB</span><h1>${selected ? 'Connections around ' + e(selected.name) : 'Explore the network.'}</h1><p>Find a bridge between two entries, or explore nearby people, institutions and technologies.</p></div><a href="./downloads/connections.cy.json" download>Export graph ↓</a></header><nav class="or-network-examples" aria-label="Example connections"><span>Try a path</span><a data-or-network-nav href="${e(href('neuralink', { to: 'precision' }))}">Neuralink & Precision ↗</a><a data-or-network-nav href="${e(href('stairmed', { to: 'axoft' }))}">StairMed & Axoft ↗</a><a data-or-network-nav href="${e(href('synchron', { to: 'cochlear' }))}">Synchron & Cochlear ↗</a></nav><form class="or-network-filters" id="or-network-filters"><label>Start with<select name="from" id="or-network-from"><option value="">Whole network</option>${opts(start)}</select></label><label>Find a connection to<select name="to" id="or-network-to"><option value="">Explore nearby connections</option>${opts(params.get('to') || '')}</select></label><button type="submit">Show connections →</button></form><div class="or-network-options"><label><input id="or-network-comparisons" type="checkbox"${params.get('comparisons') === 'yes' ? ' checked' : ''}> Include technical comparisons</label>${selected ? `<a href="${e(href(id, { scope: params.get('scope') === 'all' ? 'nearby' : 'all', ...(params.get('comparisons') === 'yes' ? { comparisons: 'yes' } : {}) }))}" data-or-network-nav>${params.get('scope') === 'all' ? 'Focus nearby' : 'Show whole network'} ↗</a>` : ''}<span id="or-network-status" role="status">${set.nodes.length} entries · ${set.edges.length} relationships${set.mode === 'nearby' ? ' · within two steps' : ''}</span></div>${set.mode === 'path' ? `<section class="or-path-intro"><h2>${set.path ? (set.path.edges.length ? set.path.edges.length + ' links connect these entries.' : 'You selected the same entry.') : 'No path found in the selected evidence.'}</h2><p>${set.path ? 'This is a shortest path through the available relationships. Read each statement in its own direction; a route through people or collaborators does not establish technological descent.' : 'Try nearby connections, or include clearly labeled technical comparisons. A missing path is a research gap, not proof that no relationship exists.'}</p></section>` : ''}<div class="or-network-layout" data-mode="${set.mode}"><section class="or-canvas-panel"><div class="or-map-tools"><span>Drag to pan · scroll or pinch to zoom · select any entry</span><div><button type="button" id="or-zoom-out" aria-label="Zoom out">−</button><button type="button" id="or-zoom-in" aria-label="Zoom in">+</button><button type="button" id="or-fit">Fit map</button><button type="button" id="or-layout">Rearrange</button></div></div><div id="or-network-canvas" role="img" aria-label="Interactive research network. The equivalent relationship list follows this map."></div><div class="or-map-legend">${[['Person', 'People'], ['Lab', 'Labs'], ['Institution', 'Institutions'], ['Company', 'Companies'], ['Technology', 'Technologies'], ['Program', 'Programs']].map(([kind, name]) => `<span data-kind="${kind}"><i></i>${name}</span>`).join('')}<span>→ Documented statement</span><span>┄ Comparison</span></div></section><aside id="or-network-detail" class="or-network-detail" aria-live="polite">${selected ? `<span class="eyebrow">${e(selected.kind)}</span><h2>${e(selected.name)}</h2><p>${e(selected.summary)}</p>` : '<span class="eyebrow">START EXPLORING</span><h2>Choose an entry or a line.</h2><p>Select an entry to highlight its immediate neighbors. Select a line to read the source-backed relationship.</p>'}<p class="or-map-hint">Names and connections are available in the readable list below, including for keyboard navigation.</p></aside></div><details class="or-network-list"${set.mode === 'path' ? ' open' : ''}><summary>${set.mode === 'path' ? 'Read the path, link by link' : 'Read all relationships shown'} <span>${set.edges.length}</span></summary><ol>${set.edges.map(x => `<li><div>${sentence(x)}<small>${d.edges.find(z => z.id === x).basis === 'comparison' ? 'Technical comparison · ' : 'Documented · '}${e(d.edges.find(z => z.id === x).date)}</small></div><button type="button" data-or-network-edge="${e(x)}" aria-label="Evidence: ${e(node(d.edges.find(z => z.id === x).from).name + ' ' + d.edges.find(z => z.id === x).label + ' ' + node(d.edges.find(z => z.id === x).to).name)}">Evidence ↗</button></li>`).join('')}</ol></details><p class="or-network-foot">Layout shows relationships, not importance or historical time. Built with <a href="https://js.cytoscape.org/" target="_blank" rel="noopener noreferrer">Cytoscape.js</a>. A line carries only the specific statement supported by its sources.</p>`; }
    function close() { resize?.disconnect(); resize = undefined; if (cy) {
        cy.destroy();
        cy = null;
    } }
    function bind(container, id, params, navigate, openEvidence) {
        const canvas = container.querySelector('#or-network-canvas');
        if (!canvas)
            return;
        close();
        const set = subset(id, params), detail = container.querySelector('#or-network-detail');
        const showEdge = (edgeId) => { const x = d.edges.find(x => x.id === edgeId); if (!x)
            return; detail.innerHTML = `<span class="eyebrow">${x.basis === 'comparison' ? 'TECHNICAL COMPARISON' : 'DOCUMENTED RELATIONSHIP'}</span><h2>${sentence(edgeId)}</h2><small>${e(x.date)}</small><p>${e(x.detail)}</p>${x.limit ? `<p class="or-network-limit">${e(x.limit)}</p>` : ''}<button type="button" id="or-network-open-source">Open sources ↗</button>`; detail.querySelector('#or-network-open-source').addEventListener('click', ev => openEvidence(edgeId, ev.currentTarget)); if (cy) {
            cy.elements().removeClass('is-neighbor is-selected is-dim');
            const target = cy.getElementById('edge-' + edgeId);
            target.addClass('is-selected');
            target.connectedNodes().addClass('is-neighbor');
        } };
        const showNode = (nodeId) => { const n = node(nodeId); const c = neuroOriginsData.companies.find(c => c.nodeId === nodeId); detail.innerHTML = `<span class="eyebrow">${e(n.kind)}</span><h2>${e(n.name)}</h2><p>${e(n.summary)}</p>${c ? `<a href="#connections/${e(c.id)}?view=origins">Read the origin story ↗</a>` : ''}<a href="${e(href(n.id))}">Explore two steps from here ↗</a>${n.href ? `<a href="${n.href.startsWith('#') ? e(n.href) : u(n.href)}"${n.href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}>Open full profile ↗</a>` : ''}`; if (cy) {
            cy.elements().removeClass('is-neighbor is-selected is-dim');
            const focus = cy.getElementById(nodeId);
            cy.elements().addClass('is-dim');
            focus.closedNeighborhood().removeClass('is-dim').addClass('is-neighbor');
            focus.addClass('is-selected');
        } };
        const update = () => { const from = container.querySelector('#or-network-from').value, to = container.querySelector('#or-network-to').value, comparison = container.querySelector('#or-network-comparisons').checked; navigate(href(from, { ...(to && from ? { to } : {}), ...(comparison ? { comparisons: 'yes' } : {}) }), 'or-network-from'); };
        container.querySelector('#or-network-filters').addEventListener('submit', ev => { ev.preventDefault(); update(); });
        container.querySelector('#or-network-comparisons').addEventListener('change', update);
        container.querySelectorAll('[data-or-network-nav]').forEach(a => a.addEventListener('click', ev => { if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey)
            return; ev.preventDefault(); navigate(a.getAttribute('href')); }));
        container.querySelectorAll('[data-or-network-edge]').forEach(b => b.addEventListener('click', () => openEvidence(b.dataset.orNetworkEdge, b)));
        if (typeof cytoscape === 'undefined') {
            canvas.innerHTML = '<p class="or-network-fallback">The interactive renderer could not load. All connections remain available in the readable list below.</p>';
            return;
        }
        const layout = () => set.mode === 'path' ? { name: 'preset', positions: Object.fromEntries(set.nodes.map((key, i) => [key, canvas.clientWidth < 500 ? { x: 140, y: 80 + i * 140 } : { x: 80 + i * 250, y: 120 }])), padding: 55, fit: true, animate: false } : { name: 'cose', animate: false, randomize: false, nodeDimensionsIncludeLabels: true, nodeRepulsion: () => 18000, idealEdgeLength: () => 180, edgeElasticity: () => 140, gravity: .12, numIter: 500, padding: 45 };
        cy = cytoscape({ container: canvas, elements: elements(set.nodes, set.edges), layout: layout(), minZoom: .08, maxZoom: 2.5, style: [{ selector: 'node', style: { 'label': 'data(label)', 'font-family': 'Inter, system-ui, sans-serif', 'font-size': 13, 'font-weight': 500, 'color': '#223b4b', 'text-wrap': 'wrap', 'text-max-width': 128, 'text-valign': 'bottom', 'text-margin-y': 8, 'background-color': '#547f91', 'border-width': 3, 'border-color': '#f6faf9', 'width': 34, 'height': 34 } }, { selector: 'node[kind="Company"]', style: { 'shape': 'round-rectangle', 'background-color': '#257c70', 'width': 44, 'height': 38, 'font-weight': 700 } }, { selector: 'node[kind="Person"]', style: { 'background-color': '#8870ac' } }, { selector: 'node[kind="Institution"]', style: { 'shape': 'rectangle', 'background-color': '#b68645' } }, { selector: 'node[kind="Lab"]', style: { 'shape': 'round-rectangle', 'background-color': '#c36f66' } }, { selector: 'node[kind="Technology"]', style: { 'shape': 'diamond', 'background-color': '#4e85b6' } }, { selector: 'edge', style: { 'width': 1.6, 'line-color': '#b2c5cc', 'target-arrow-color': '#8ba6b2', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': .8, 'label': set.mode === 'path' ? 'data(label)' : '', 'font-size': 10, 'text-wrap': 'wrap', 'text-max-width': 120, 'text-background-color': '#f9fcfc', 'text-background-opacity': 1, 'text-background-padding': 4 } }, { selector: 'edge[basis="comparison"]', style: { 'line-style': 'dashed', 'target-arrow-shape': 'none', 'line-color': '#b4a2cb' } }, { selector: '.is-selected', style: { 'border-width': 4, 'border-color': '#dfab54', 'line-color': '#287b72', 'target-arrow-color': '#287b72', 'width': 4 } }, { selector: 'edge.is-selected', style: { 'label': 'data(label)' } }, { selector: '.is-dim', style: { 'opacity': .18 } }, { selector: 'node.is-neighbor', style: { 'border-color': '#76b3a6' } }] });
        cy.style().selector('node.is-selected').style({ 'width': 46, 'height': 46 }).update();
        cy.on('tap', 'node', (ev) => showNode(ev.target.id()));
        cy.on('tap', 'edge', (ev) => { const edgeId = ev.target.data('edgeId'); const p = new URLSearchParams(params); p.set('view', 'network'); p.set('edge', edgeId); history.replaceState(null, '', '#connections' + (id ? '/' + encodeURIComponent(id) : '') + '?' + p.toString()); showEdge(edgeId); });
        cy.on('tap', (ev) => { if (ev.target === cy)
            cy.elements().removeClass('is-dim is-neighbor is-selected'); });
        container.querySelector('#or-fit').addEventListener('click', () => cy.fit(undefined, 45));
        container.querySelector('#or-layout').addEventListener('click', () => cy.layout({ ...layout(), randomize: true }).run());
        container.querySelector('#or-zoom-in').addEventListener('click', () => cy.zoom({ level: Math.min(2.5, cy.zoom() * 1.3), renderedPosition: { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 } }));
        container.querySelector('#or-zoom-out').addEventListener('click', () => cy.zoom({ level: Math.max(.08, cy.zoom() / 1.3), renderedPosition: { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 } }));
        if (typeof ResizeObserver !== 'undefined') {
            resize = new ResizeObserver(() => cy?.resize());
            resize.observe(canvas);
        }
        if (params.get('edge') && set.edges.includes(params.get('edge')))
            showEdge(params.get('edge'));
    }
    return { render, bind, close, shortest, subset, elements };
})();
