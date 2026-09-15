var NeuroLabs = (() => {
    const e = hubUtils.escapeHtml, u = hubUtils.sourceHref;
    const data = neuroLabsData;
    const themes = ['Neural interfaces', 'Neural decoding', 'Neuromodulation', 'Neuroimaging', 'Rehabilitation & prosthetics', 'Bioelectronics', 'Computational neuroscience'];
    const colors = ['#2563ae', '#6850b8', '#a24370', '#267f85', '#9c6217', '#387348', '#4a648f'];
    const verbs = ['Connect', 'Decode', 'Modulate', 'Image', 'Restore', 'Build', 'Model'];
    const color = (l) => colors[Math.max(0, themes.indexOf(l.themes[0]))];
    const href = (id) => '#labs/' + encodeURIComponent(id);
    function route(params, changes) {
        const next = new URLSearchParams(params);
        for (const [k, v] of Object.entries(changes)) {
            if (v)
                next.set(k, v);
            else
                next.delete(k);
        }
        return '#labs' + (next.size ? '?' + next.toString() : '');
    }
    function ext(url, label, extra = '') { return `<a href="${u(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${e(label)} <span aria-hidden="true">↗</span></a>`; }
    function refs(l, ids) { return `<span class="lab-refs">${ids.map(id => { const i = l.sources.findIndex(s => s.id === id), s = l.sources[i]; return s ? ext(s.url, '[' + (i + 1) + ']', `aria-label="${e('Source ' + (i + 1) + ': ' + s.title)}"`) : ''; }).join(' ')}</span>`; }
    function glyph(theme) {
        const i = themes.indexOf(theme);
        const drawing = [
            '<path d="M22 16v68m17-68v68m17-68v68m17-68v68"/><path d="M18 16h59"/>' + [25, 45, 65].map(y => [22, 39, 56, 73].map(x => `<circle cx="${x}" cy="${y}" r="3" fill="currentColor"/>`).join('')).join(''),
            '<path d="M8 48h12l5-18 7 40 7-51 7 39 6-10h12m8-24v48m7-24h12"/><circle cx="83" cy="23" r="6"/><circle cx="83" cy="73" r="6"/>',
            '<path d="M9 64h15V29h15v35h16V29h15v35h21"/><path d="M10 80h80"/>',
            '<circle cx="49" cy="48" r="30"/><circle cx="49" cy="48" r="18"/><circle cx="49" cy="48" r="5"/><path d="M49 8v14m0 52v14M9 48h14m51 0h14"/>',
            '<path d="m21 22 29 19 24 31M21 22l-8 14m61 36 13-8"/><circle cx="21" cy="22" r="7"/><circle cx="50" cy="41" r="8"/><circle cx="74" cy="72" r="7"/><path d="M14 88h76"/>',
            '<path d="M10 68q20-30 40 0t40 0M10 52q20-30 40 0t40 0M10 36q20-30 40 0t40 0"/><circle cx="30" cy="21" r="3"/><circle cx="70" cy="51" r="3"/>',
            '<path d="m20 24 58 49M20 24l1 50 58-50M21 74l28-26 29 25M49 48l30-24"/>' + [[20, 24], [21, 74], [49, 48], [79, 24], [78, 73]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--lab-bg,#f4f8fd)"/>`).join('')
        ][i < 0 ? 0 : i];
        return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawing}</svg>`;
    }
    function selection(params) {
        return data.labs.filter(l => (!params.get('theme') || l.themes.includes(params.get('theme'))) && (!params.get('school') || l.institution === params.get('school')) && (!params.get('region') || l.region === params.get('region')) && hubUtils.matches([l.name, l.institution, l.country, ...l.leaders, ...l.themes, l.summary, l.approach, ...l.methods, ...l.signals, ...l.projects.map(p => p.title + ' ' + p.detail), l.scale.metric, l.scale.detail].join(' '), params.get('q') || ''));
    }
    function card(l) {
        return `<article class="lab-card" style="--lab-color:${color(l)}"><div class="lab-card-top"><span>${e(l.institution)}</span><div class="lab-glyph">${glyph(l.themes[0])}</div></div><h2><a href="${href(l.id)}">${e(l.name)}</a></h2><p class="lab-people">${e(l.leaders.join(' · '))}</p><p>${e(l.summary)}</p><div class="lab-tags">${l.themes.map(t => `<a href="${e(route(new URLSearchParams(), { theme: t }))}">${e(t)}</a>`).join('')}</div><div class="lab-card-bottom"><span>${e(l.country)}<small>${l.projects.length} projects · ${l.sources.length} sources</small></span><a href="${href(l.id)}" aria-label="${e('Read research profile: ' + l.name)}">Explore <span aria-hidden="true">↗</span></a></div></article>`;
    }
    function hero() {
        const schools = new Set(data.labs.map(l => l.institution)).size;
        const sources = new Set(data.labs.flatMap(l => l.sources.map(s => s.url))).size;
        return `<header class="lab-hero"><div><span class="eyebrow">THE RESEARCH LANDSCAPE</span><h1>Meet the labs.<br>Understand the work.</h1><p>Follow the people, instruments, and experiments shaping neuroengineering—from neural circuits to systems people can use.</p><div class="lab-hero-stats"><span><strong>${data.labs.length}</strong> detailed profiles</span><span><strong>${schools}</strong> institutions</span><span><strong>${sources}</strong> source pages</span></div></div><div class="lab-hero-art" aria-hidden="true"><div class="lab-orbit"><span>NEURO<br>ENGINEERING</span></div>${themes.map((t, i) => `<div class="lab-orbit-node node-${i}" style="--lab-color:${colors[i]}">${glyph(t)}<span>${verbs[i]}</span></div>`).join('')}</div></header>`;
    }
    function filters(params, view) {
        const optionsData = view === 'schools' ? data.schools : data.labs;
        const opts = (values, key) => values.map(x => `<option value="${e(x)}"${params.get(key) === x ? ' selected' : ''}>${e(x)}</option>`).join('');
        return `<form id="lab-filters" class="lab-filters" role="search"><label class="lab-search-label">Find a lab or project<input id="lab-query" name="q" type="search" value="${e(params.get('q') || '')}" placeholder="Try hippocampus, hydrogel, speech…"></label><label>Region<select id="lab-region" name="region"><option value="">All regions</option>${opts([...new Set(optionsData.map(l => l.region))].sort(), 'region')}</select></label><label>University or institution<select id="lab-school" name="school"><option value="">All institutions</option>${opts([...new Set(optionsData.map(l => l.institution))].sort(), 'school')}</select></label>${view === 'schools' ? '' : `<label class="sr-only" for="lab-theme">Research area</label><select id="lab-theme" name="theme" class="lab-theme-select"><option value="">All research areas</option>${opts(themes, 'theme')}</select>`}<button class="lab-filter-submit" type="submit">Search</button></form>`;
    }
    function schoolsPage(params) {
        const q = params.get('q') || '', region = params.get('region') || '', school = params.get('school') || '';
        const entries = data.schools.filter(s => (!region || s.region === region) && (!school || s.institution === school) && hubUtils.matches(s.institution + ' ' + s.country + ' ' + s.title + ' ' + s.detail, q));
        return `<div class="lab-section-intro"><h2>Start with the school’s own map.</h2><p>Department research pages and center rosters reveal neighboring groups beyond the profiles here. A university may have several entry points across engineering, medicine, and neuroscience.</p></div>${filters(params, 'schools')}<p class="lab-result-count" role="status">${entries.length} of ${data.schools.length} university and center discovery pages</p><div class="lab-school-grid">${entries.map(s => { const n = data.labs.filter(l => l.institution === s.institution).length; return `<article class="lab-school-card"><div class="eyebrow">${e(s.country)} · ${e(s.region)}</div><h2>${e(s.institution)}</h2><p>${e(s.detail)}</p>${ext(s.url, s.title)}${n ? `<a class="lab-school-profiles" href="${e(route(new URLSearchParams(), { school: s.institution }))}">${n} detailed profile${n === 1 ? '' : 's'} here →</a>` : '<span class="lab-school-profiles">Explore the institutional roster</span>'}</article>`; }).join('') || empty()}</div>`;
    }
    function empty() { return '<div class="hub-empty"><h2>No matching research profiles.</h2><p>Try a broader term or clear the institution and region filters.</p><a href="#labs">Show all labs →</a></div>'; }
    function directory(params) {
        const view = ['schools', 'progress', 'coverage'].includes(params.get('view') || '') ? params.get('view') : 'labs';
        const nav = `<nav class="lab-view-nav" aria-label="Research directory views">${[['labs', 'Research labs'], ['schools', 'University directories'], ['progress', 'How progress is measured'], ['coverage', 'Coverage & method']].map(([v, n]) => `<a href="${e(route(new URLSearchParams(), { view: v === 'labs' ? '' : v }))}"${view === v ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>`;
        if (view === 'coverage')
            return `<div class="lab-page">${hero()}${nav}${coverage()}</div>`;
        if (view === 'schools')
            return `<div class="lab-page">${hero()}${nav}${schoolsPage(params)}</div>`;
        const all = selection(params), page = Math.max(1, Math.min(Math.ceil(all.length / 24) || 1, Math.floor(Number(params.get('page')) || 1))), shown = all.slice((page - 1) * 24, page * 24);
        const areas = `<div class="lab-area-heading"><h2>Explore a research area</h2><a id="lab-area-all" data-lab-filter href="${e(route(params, { theme: '', page: '' }))}">All areas</a></div><div class="lab-area-grid">${themes.map((t, i) => `<a id="lab-area-${i}" data-lab-filter href="${e(route(params, { theme: params.get('theme') === t ? '' : t, page: '' }))}" style="--lab-color:${colors[i]}"${params.get('theme') === t ? ' aria-current="true"' : ''}>${glyph(t)}<span>${e(t)}</span><strong>${data.labs.filter(l => l.themes.includes(t)).length}</strong></a>`).join('')}</div>`;
        const results = `<div class="lab-results"><p role="status">${all.length} of ${data.labs.length} profiles${all.length ? ` · showing ${(page - 1) * 24 + 1}–${Math.min(page * 24, all.length)}` : ''}</p>${['q', 'region', 'school', 'theme'].some(k => params.has(k)) ? `<a href="${e(route(new URLSearchParams(), { view: view === 'labs' ? '' : view }))}">Clear filters</a>` : '<span>Source pages reviewed 15 Sep 2026</span>'}</div>`;
        const rows = view === 'progress' ? `<div class="lab-progress-list">${shown.map(l => `<article style="--lab-color:${color(l)}"><div class="lab-progress-identity"><span>${e(l.institution)}</span><h2><a href="${href(l.id)}">${e(l.name)}</a></h2></div><div><span class="eyebrow">PROGRESS TO TRACK</span><h3>${e(l.scale.metric)}</h3><p>${e(l.scale.detail)} ${refs(l, l.scale.refs)}</p></div><a href="${href(l.id)}">Projects &amp; evidence ↗</a></article>`).join('')}</div>` : `<div class="lab-grid">${shown.map(card).join('')}</div>`;
        const pages = all.length > 24 ? `<nav class="lab-pagination" aria-label="Lab directory pages">${page > 1 ? `<a href="${e(route(params, { page: String(page - 1) }))}">← Previous</a>` : '<span></span>'}<span>Page ${page} of ${Math.ceil(all.length / 24)}</span>${page * 24 < all.length ? `<a href="${e(route(params, { page: String(page + 1) }))}">Next →</a>` : '<span></span>'}</nav>` : '';
        return `<div class="lab-page">${hero()}${nav}${view === 'progress' ? '<div class="lab-section-intro"><h2>More than an electrode count.</h2><p>Each research program has a different engineering target. These source-informed measurement lenses help frame a comparison; they are not a ranking or a common performance scale.</p><a href="#ideas/moores-law-bci?section=counts">Explore the electrode-count evidence →</a></div>' : ''}${areas}${filters(params, view)}${results}${all.length ? rows : empty()}${pages}<p class="lab-footnote">Area totals overlap because a lab can work across several fields. Profiles summarize selected programs; university directories help you explore the wider roster.</p></div>`;
    }
    function coverage() {
        return `<section class="lab-coverage"><span class="eyebrow">A DIRECTORY YOU CAN INSPECT</span><h2>How the research was assembled</h2><ol>${data.methodology.map(x => `<li>${e(x)}</li>`).join('')}</ol><div class="lab-coverage-download"><h3>Use and extend the research</h3><p>Download the structured profiles, project-level references, and school discovery pages. New work can be added without changing the page design.</p><a class="button-primary" href="./data/labs.json" download>Download research data ↓</a><a href="./downloads/lab-research/research-directory.md" download>Download reading dossier ↓</a></div><h3>Coverage is broad, and still selective</h3><p>This release is a documented survey, not a census of every neuroengineering lab. A profile’s review date records when its source pages were checked; it does not establish that every project is active today. Undated sources remain undated. Regional and language coverage is uneven.</p><p>University and center pages provide additional leads. The original atlas also contains laboratories, facilities, programs, companies, and independent institutes with different levels of detail.</p><a href="#organizations">Browse the wider organization atlas →</a><a href="#labs?view=schools">Explore university rosters →</a><a href="https://github.com/HowardWHSrun/neurovisual/issues" target="_blank" rel="noopener noreferrer">Suggest a lab or correction ↗</a></section>`;
    }
    function profile(l) {
        const related = data.labs.filter(x => x.id !== l.id).map(x => ({ lab: x, score: x.themes.filter(t => l.themes.includes(t)).length + (x.institution === l.institution ? 1 : 0) })).sort((a, b) => b.score - a.score || a.lab.name.localeCompare(b.lab.name)).filter(x => x.score > 0).slice(0, 3);
        return `<article class="lab-page lab-profile" style="--lab-color:${color(l)}"><a class="back-link" href="#labs">← All research labs</a><header class="lab-profile-head"><div><span class="eyebrow">${e(l.institution)} · ${e(l.country)}</span><h1>${e(l.name)}</h1><p class="lab-leaders">${e(l.leaders.join(' · '))}</p>${l.affiliation ? `<p class="lab-affiliation">${e(l.affiliation)}</p>` : ''}<p class="lab-summary">${e(l.summary)} ${refs(l, l.overviewRefs)}</p><div class="lab-tags">${l.themes.map(t => `<a href="${e(route(new URLSearchParams(), { theme: t }))}">${e(t)}</a>`).join('')}</div></div><div class="lab-profile-emblem">${glyph(l.themes[0])}<span>${e(verbs[Math.max(0, themes.indexOf(l.themes[0]))])}</span></div></header><div class="lab-profile-actions">${ext(l.sources[0].url, 'Lab / institutional source')}<a href="${e(route(new URLSearchParams(), { school: l.institution }))}">More at this institution →</a>${l.atlasIds.map(id => `<a href="#org/${encodeURIComponent(id)}">Organization atlas ↗</a>`).join('')}<span>Reviewed ${e(l.verified)}</span></div>
  <section class="lab-approach"><div><span class="eyebrow">THE ENGINEERING APPROACH</span><h2>What makes this work distinct</h2><p>${e(l.approach)} ${refs(l, l.overviewRefs)}</p></div><div class="lab-method-box"><h3>Methods &amp; instruments</h3><ul>${l.methods.map(m => `<li>${e(m)}</li>`).join('')}</ul><h3>What is measured</h3><p>${e(l.signals.join(' · '))}</p></div></section>
  <section class="lab-project-section"><div class="section-heading"><div><span class="eyebrow">FOLLOW THE ACTUAL WORK</span><h2>Projects &amp; research threads</h2></div><span>${l.projects.length} documented directions</span></div><div class="lab-projects">${l.projects.map((p, i) => `<article><span class="lab-project-index">${String(i + 1).padStart(2, '0')}</span><div><span class="lab-stage">${e(p.stage)}</span><h3>${e(p.title)}</h3><p>${e(p.detail)} ${refs(l, p.refs)}</p></div></article>`).join('')}</div></section>
  <div class="lab-evidence-grid"><section class="lab-scale"><span class="eyebrow">PROGRESS TO TRACK</span><h2>${e(l.scale.metric)}</h2><p>${e(l.scale.detail)} ${refs(l, l.scale.refs)}</p><a href="#labs?view=progress">Compare measurement lenses →</a></section><section class="lab-translation"><span class="eyebrow">STUDY CONTEXT</span><h2>How to interpret the evidence</h2><p>${e(l.translation.detail)} ${refs(l, l.translation.refs)}</p></section></div>
  <aside class="lab-question"><span class="eyebrow">NOTEBOOK PROMPT · EDITORIAL QUESTION</span><h2>${e(l.nextQuestion)}</h2><a href="#ideas">Connect this to your next idea →</a></aside>
  <section class="lab-sources"><div class="section-heading"><div><span class="eyebrow">CHECK THE ORIGINALS</span><h2>Sources &amp; further reading</h2></div><span>${l.sources.length} references</span></div><ol>${l.sources.map(s => `<li><div><span>${e(s.kind)} · ${s.published ? e(s.published) : 'Publication date not recorded'}</span>${ext(s.url, s.title)}<small>${e(new URL(s.url).hostname)}</small></div></li>`).join('')}</ol><p>Source dates above are separate from the profile review date. A lab page describes its program; project and paper links establish the scope of specific evidence.</p></section><section class="lab-related"><div class="section-heading"><h2>Related research to explore</h2><a href="#labs">All labs →</a></div><p>Connected by shared research areas or institution; this does not imply collaboration.</p><div class="lab-grid">${related.map(x => card(x.lab)).join('')}</div></section></article>`;
    }
    function render(id = '', params = new URLSearchParams()) { if (!id)
        return directory(params); const l = data.labs.find(l => l.id === id); return l ? profile(l) : '<div class="hub-empty"><h1>Research profile not found.</h1><a href="#labs">Browse the research directory →</a></div>'; }
    function bind(container, id, params, update) {
        if (id)
            return;
        const form = container.querySelector('#lab-filters');
        if (!form)
            return;
        const change = () => { const next = new URLSearchParams(params); next.delete('page'); new FormData(form).forEach((v, k) => { if (String(v).trim())
            next.set(k, String(v));
        else
            next.delete(k); }); update(route(next, {})); };
        let composing = false;
        form.addEventListener('submit', event => { event.preventDefault(); if (!composing)
            change(); });
        form.addEventListener('change', event => { if (!composing && event.target.tagName === 'SELECT')
            change(); });
        const query = container.querySelector('#lab-query');
        query?.addEventListener('compositionstart', () => { composing = true; });
        query?.addEventListener('compositionend', () => { composing = false; change(); });
        query?.addEventListener('input', (event) => { if (!composing && !event.isComposing)
            change(); });
        container.querySelectorAll('[data-lab-filter]').forEach(a => a.addEventListener('click', event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return; event.preventDefault(); update(a.getAttribute('href')); }));
    }
    function records() { return data.labs.map(l => ({ id: l.id, title: l.name, description: l.institution + ' — ' + l.summary, kind: 'Research lab', href: href(l.id), keywords: [...l.leaders, ...l.methods, ...l.signals, ...l.themes, ...l.projects.map(p => p.title + ' ' + p.detail), l.country].join(' ') })); }
    function forOrg(id) { return data.labs.find(l => l.atlasIds.includes(id)); }
    function teaser(id) { return data.labs.filter(l => l.atlasIds.includes(id)).map(l => `<section class="lab-atlas-teaser"><div><span>DETAILED RESEARCH PROFILE</span><h2>${e(l.name)}</h2><p>${e(l.summary)}</p><small>${l.projects.length} projects · ${l.sources.length} linked sources · reviewed ${e(l.verified)}</small></div><a href="${href(l.id)}">Explore projects &amp; evidence ↗</a></section>`).join(''); }
    return { render, bind, records, forOrg, teaser, selection, themes };
})();
