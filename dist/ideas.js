const NeuroIdeas = (() => {
    const e = hubUtils.escapeHtml;
    const source = (s) => `<a href="${hubUtils.sourceHref(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} ↗</a>`;
    const sources = (items) => `<ul class="idea-sources">${items.map(s => `<li>${source(s)}</li>`).join('')}</ul>`;
    const href = (id) => '#ideas/' + encodeURIComponent(id);
    const ideas = neuroIdeasData.ideas;
    const companies = neuroIdeasData.companies;
    const get = (id) => ideas.find((x) => x.id === id);
    const n = (v) => v == null ? 'Not established' : v.toLocaleString('en-US');
    const head = (eyebrow, title, text) => `<header class="hub-page-head"><div><div class="eyebrow">${e(eyebrow)}</div><h1>${e(title)}</h1><p>${e(text)}</p></div></header>`;
    const card = (x) => `<a class="idea-card" href="${href(x.id)}"><div class="idea-meta"><span>${e(x.theme)}</span><span class="idea-status">${e(x.status)}</span></div><h2>${e(x.title)}</h2><p>${e(x.summary)}</p><span class="idea-card-end">Explore the question <span aria-hidden="true">↗</span></span></a>`;
    function records() {
        return [...ideas.map((x) => ({ id: x.id, title: x.title, description: x.summary, kind: 'Idea', href: href(x.id), keywords: [x.question, x.theme, x.observation, x.interpretation, x.organizations.join(' ')].join(' ') })),
            ...companies.map((c) => ({ id: 'strategy-' + c.id, title: c.name + ' · ' + c.headline, description: c.thought, kind: 'Company scaling', href: href('moores-law-bci') + '?section=companies&company=' + c.id, keywords: c.mechanism + ' ' + c.count }))];
    }
    function notebook() {
        return head('AN EVOLVING RESEARCH NOTEBOOK', 'Big ideas, made testable.', 'Observations, evidence, and open questions in neuroengineering. Each note separates what is known from what could be tested next.')
            + NeuroMedia.gallery() + `<section class="idea-feature"><div><span class="eyebrow">START WITH THE COUNT</span><h2>What exactly is doubling?</h2><p>Electrode sites, simultaneous channels, and useful neural signals tell different stories about progress.</p><a class="button-primary" href="${href('moores-law-bci')}">Explore Moore’s law of BCI ↗</a></div><dl><div><dt>Site-count comparison</dt><dd>2.99 <small>years / doubling</small></dd><p>960 → 6,144 · Neuropixels, 2017–2025</p></div><div><dt>Same two designs</dt><dd>384 → 384</dd><p>Simultaneous channels per probe</p></div></dl></section>
      <p class="idea-footnote">Endpoint arithmetic, not a fitted law. ${source({ title: 'Jun 2017', url: 'https://doi.org/10.1038/nature24636' })} · ${source({ title: 'Ye 2025', url: 'https://doi.org/10.1016/j.neuron.2025.08.030' })}</p>
      <div class="section-heading"><div><span class="eyebrow">QUESTIONS TO KEEP DEVELOPING</span><h2>The notebook</h2></div><span>${ideas.length} notes · reviewed ${e(neuroIdeasData.reviewed)}</span></div><div class="idea-grid">${ideas.map(card).join('')}</div>
      <aside class="idea-editorial"><h2>From a thought to an experiment</h2><p>Capture the observation. Attach the original evidence. State an interpretation, identify a test, and preserve what changed when new evidence arrives.</p><p>${e(neuroIdeasData.editorial_note)}</p></aside>`;
    }
    function thought(x) {
        return `<div class="idea-reading"><section><span class="eyebrow">OBSERVATION</span><h2>What prompted the question</h2><p>${e(x.observation)}</p></section><section class="idea-inference"><span class="eyebrow">RESEARCH THOUGHT</span><h2>A working interpretation</h2><p>${e(x.interpretation)}</p></section><section><span class="eyebrow">MAKE IT TESTABLE</span><h2>The next comparison</h2><p>${e(x.test)}</p><h3>What would change this view?</h3><p>${e(x.revision)}</p></section></div>`;
    }
    function countExplorer(params) {
        const metric = params.get('metric') === 'channels' ? 'channels' : 'sites';
        const key = metric === 'sites' ? 'sites' : 'simultaneous_channels';
        const ids = ['np1_2017', 'np2_single_2021', 'np_ultra_2025', 'np_quad_2026'];
        const rows = ids.map(id => neuroIdeasData.counts.milestones.find((x) => x.id === id));
        const maximum = Math.max(...rows.map((x) => x[key]));
        const bars = rows.map((r) => `<div class="idea-bar-row"><div><strong>${e(r.name)}</strong><span>${r.year}${r.id === 'np_quad_2026' ? ' preprint' : ''} · ${r.shanks} ${r.shanks === 1 ? 'shank' : 'shanks'}</span></div><div class="idea-bar-track" aria-hidden="true"><span style="width:${r[key] / maximum * 100}%"></span></div><strong>${n(r[key])}</strong><a href="${hubUtils.sourceHref(r.source)}" target="_blank" rel="noopener noreferrer" aria-label="Source for ${e(r.name)}">Source ↗</a></div>`).join('');
        return `<section class="idea-panel"><div class="idea-panel-heading"><div><span class="eyebrow">ONE FAMILY, DIFFERENT COUNTS</span><h2>Change the metric. Change the story.</h2></div><div class="idea-toggle" role="group" aria-label="Count metric"><button type="button" id="idea-sites" data-idea-param="metric" data-value="sites" aria-pressed="${metric === 'sites'}">Electrode sites</button><button type="button" id="idea-channels" data-idea-param="metric" data-value="channels" aria-pressed="${metric === 'channels'}">Simultaneous channels</button></div></div><p>Selected configurations, counted per probe. Shank count, geometry, and publication status remain visible.</p><div class="idea-bars" aria-label="${metric === 'sites' ? 'Physical sites' : 'Concurrent channels'} per probe">${bars}</div><p class="idea-result">${metric === 'sites' ? '<strong>2017 → 2025: 6.4-fold more sites.</strong> Eight rounded publication years imply 2.99 years per doubling. The intermediate designs do not establish a regular cadence.' : '<strong>2017 → 2025: 384 channels in both endpoint designs.</strong> Quad Base expands this to 1,536; its 2026 preprint follows August 2025 commercial availability.'}</p><p class="idea-footnote">Quad Base is a four-shank design, not the successor to single-shank Ultra. This is a comparison of published configurations, not a fitted technology curve. ${source({ title: 'Quad Base availability', url: 'https://www.neuropixelscentral.org/technology' })}</p></section>
      <div class="idea-count-definitions">${[['Probes', 'Physical threads, shafts, or assembled arrays: specify which.'], ['Sites', 'Fabricated or implanted contacts, including any reference/stimulation roles.'], ['Channels', 'Signals acquired concurrently at a stated rate and bandwidth.'], ['Neurons', 'Quality-assessed units; neither one site nor one channel equals one neuron.']].map(([a, b]) => `<div><h3>${a}</h3><p>${b}</p></div>`).join('')}</div>
      <section class="idea-panel idea-scenario"><div><span class="eyebrow">ARITHMETIC, NOT A FORECAST</span><h2>What does a doubling time imply?</h2><p>The historical 2011 estimate was 7.4 years for recorded neurons. Your three-year hypothesis describes a much faster curve.</p>${source({ title: 'Stevenson & Kording · 2011', url: 'https://doi.org/10.1038/nn.2731' })}</div><div><label for="idea-doubling">Assumed doubling time: <output id="idea-doubling-value">3</output> years</label><input id="idea-doubling" type="range" min="2" max="10" step="0.1" value="3"><div class="idea-scenario-result"><strong id="idea-growth">16.0×</strong><span>relative growth after 12 years</span></div><p>7.4-year reference: <strong>3.08×</strong> over the same interval.</p></div></section>`;
    }
    function companyExplorer(params) {
        const selected = companies.find((x) => x.id === params.get('company')) || companies[0];
        return `<section class="nv-company-explorer" aria-label="Visual company guide"><div class="nv-company-selector" role="group" aria-label="Choose a company or research platform">${companies.map((c, i) => `<button type="button" id="idea-company-${c.id}" data-idea-param="company" data-value="${c.id}" aria-pressed="${selected.id === c.id}">${NeuroMedia.image(c, true)}<span class="nv-selector-name">${e(c.visual.name)}<i aria-hidden="true">${String(i + 1).padStart(2, '0')}</i></span><small>${e(c.visual.route)}</small></button>`).join('')}</div>
      <article class="nv-company-story" style="--nv-accent:${NeuroMedia.tone(selected)}"><div class="nv-company-hero">${NeuroMedia.photo(selected)}<div class="nv-company-intro"><span class="nv-kicker">${e(selected.visual.route)}${selected.id === 'bisc' ? ' · Research platform' : ''}</span><h2>${e(selected.name)}</h2><p class="nv-standfirst">${e(selected.headline)}</p><div class="nv-key-count"><span>THE COUNT IN CONTEXT</span><strong>${e(selected.count)}</strong><p>${e(selected.context)}</p></div>${selected.org ? `<a class="nv-hero-link" href="#org/${selected.org}">Explore organization ↗</a>` : ''}</div></div>
      <div class="nv-story-media">${NeuroMedia.mechanism(selected)}${selected.media?.image?.kind === 'photo' ? NeuroMedia.video(selected) : NeuroMedia.watchNotes(selected)}</div>
      <div class="nv-insights"><section><span class="nv-section-label">01 / THE EVIDENCE</span><h3>What has been shown</h3><p>${e(selected.evidence)}</p></section><section><span class="nv-section-label">02 / THE RESEARCH THOUGHT</span><h3>Where to look next</h3><p>${e(selected.thought)}</p></section></div>
      <section class="nv-next-question"><span class="nv-question-mark" aria-hidden="true">?</span><div><span class="nv-section-label">AN EXPERIMENT WORTH DOING</span><h3>${e(selected.question)}</h3></div></section>
      <details class="nv-evidence-drawer"><summary>Sources, limitations &amp; the next bottleneck <span>Evidence reviewed ${e(neuroIdeasData.reviewed)}</span></summary><p>${e(selected.bottleneck)}</p>${sources(selected.sources)}<p class="idea-footnote">Scaling diagrams and future comparisons are editorial interpretations. Device demonstrations and company videos do not establish a general growth law.</p></details></article></section>`;
    }
    function evidence() {
        const rows = neuroIdeasData.counts.milestones;
        return `<section class="idea-panel"><span class="eyebrow">RICE LUAN–XIE CONTEXT</span><h2>Keep the denominator visible</h2><div class="idea-lab-ledger">${[['2017', '4 or 8 sites', 'Per NET thread'], ['2019', '32–128 contacts', 'Per multi-shank device'], ['2022', '2,304 channels', 'Reported assembled penetrating implant'], ['2026', '5,376 channels', 'Surface μECoG acquisition platform']].map(([year, value, scope]) => `<div><time>${year}</time><strong>${value}</strong><span>${scope}</span></div>`).join('')}</div><p>These four entries switch counting units and should not be fitted as one growth curve. The 2026 system uses an external headstage and rat surface recordings. Public papers do not establish a private lab’s routine equipment history.</p><p>The primary NET paper’s 2,304 channels and an author review’s 1,930-channel description are not explicitly reconciled. Neither number is silently treated as a verified working-channel yield.</p>${sources([{ title: 'NET 2017', url: 'https://doi.org/10.1126/sciadv.1601966' }, { title: 'Parallel implantation 2019', url: 'https://doi.org/10.1088/1741-2552/ab05b6' }, { title: 'Modular NET 2022', url: 'https://doi.org/10.1038/s41551-022-00941-y' }, { title: 'Author review 2023', url: 'https://doi.org/10.1146/annurev-bioeng-090622-050507' }, { title: 'Rice platform 2026', url: 'https://doi.org/10.1038/s44385-026-00103-8' }])}</section>
      <details class="idea-ledger"><summary>Inspect all ${rows.length} sourced milestones</summary><p>Selected examples, not a complete census. “Not established” means not extracted or demonstrated by that source. Channels may describe acquisition capacity; read each scope note.</p><div class="idea-table-scroll" tabindex="0" role="region" aria-label="Milestone table"><table><thead><tr><th scope="col">Year / system</th><th scope="col">Sites</th><th scope="col">Channels</th><th scope="col">Scope & evidence</th></tr></thead><tbody>${rows.map((r) => `<tr><th scope="row">${r.year} · ${e(r.name)}<small>${e(r.date_basis)}</small><a href="${hubUtils.sourceHref(r.source)}" target="_blank" rel="noopener noreferrer">Original source ↗</a></th><td>${n(r.sites)}</td><td>${n(r.simultaneous_channels)}</td><td><strong>${e(r.subjects)} · ${e(r.denominator)}</strong><p>${e(r.evidence)}. ${e(r.note)}</p></td></tr>`).join('')}</tbody></table></div></details><div class="idea-downloads"><a href="./downloads/moores-law-research.zip" download>Download the full research package</a><a href="./data/neural-counts.json" download>Download the milestone data</a><a href="./downloads/moores-law/RESEARCH_BRIEF.md" download>Download the research brief</a></div>`;
    }
    function bandwidth() {
        return `<section class="idea-panel"><span class="eyebrow">ACQUISITION THOUGHT EXPERIMENT</span><h2>The raw data budget</h2><p>Channels × samples per second × bits per sample. This excludes headers, compression, redundancy, and processing. Raw bit rate is not neural information rate.</p><div class="idea-budget-inputs"><label>Channels<input id="idea-budget-channels" type="number" min="1" max="1000000" step="1" value="1024"></label><label>Samples / second / channel<input id="idea-budget-rate" type="number" min="1" max="1000000" step="1" value="30000"></label><label>Bits / sample<select id="idea-budget-bits"><option>8</option><option>12</option><option selected>16</option><option>24</option><option>32</option></select></label></div><p class="idea-budget-output" role="status"><strong id="idea-budget-result">491.52 Mb/s · 221.18 GB/hour</strong><span>Hypothetical uncompressed acquisition · decimal units</span></p></section>`;
    }
    function render(id, params = new URLSearchParams()) {
        if (!id)
            return notebook();
        const x = get(id);
        if (!x)
            return head('IDEA NOT FOUND', 'This note is not in the notebook.', 'Use the notebook index to find an existing question.') + '<a href="#ideas">Back to ideas</a>';
        const section = ['thought', 'counts', 'companies', 'evidence'].includes(params.get('section') || '') ? params.get('section') : 'thought';
        const main = x.id === 'moores-law-bci';
        return `<div class="${main && section === 'companies' ? 'nv-compact-heading' : ''}"><a class="back-link" href="#ideas">← All ideas</a>` + head(x.theme, x.title, x.question) + '</div>'
            + `<div class="idea-meta idea-article-meta"><span class="idea-status">${e(x.status)}</span><span>Updated ${e(x.updated)}</span><span>Evidence and interpretation are separated below.</span></div>`
            + (main ? `<nav class="idea-tabs" aria-label="Moore’s law sections">${[['thought', 'The idea'], ['counts', 'Compare counts'], ['companies', 'Company strategies'], ['evidence', 'Evidence & sources']].map(([v, label]) => `<button type="button" id="idea-section-${v}" data-idea-param="section" data-value="${v}" aria-pressed="${v === section}">${label}</button>`).join('')}</nav>` : '')
            + (main && section === 'counts' ? countExplorer(params) : main && section === 'companies' ? companyExplorer(params) : main && section === 'evidence' ? evidence() : thought(x) + (x.id === 'readout-budget' ? bandwidth() : '') + sources(x.sources))
            + (main && section === 'thought' ? `<div class="idea-next-links"><a href="${href(x.id)}?section=counts">Explore the counts ↗</a><a href="${href(x.id)}?section=companies">Compare company strategies ↗</a></div>` : '')
            + `<details class="idea-history"><summary>How this idea has changed</summary><ul>${x.history.map((h) => `<li><time>${e(h.date)}</time> ${e(h.change)}</li>`).join('')}</ul></details><section class="idea-related"><h2>Keep exploring</h2><div>${x.related.map((id) => `<a href="${href(id)}">${e(get(id)?.title || id)} ↗</a>`).join('')}</div></section>`;
    }
    function bind(container, id, params) {
        NeuroMedia.bind(container);
        container.querySelectorAll('[data-idea-param]').forEach(b => b.addEventListener('click', () => {
            const next = new URLSearchParams(params);
            next.set(b.dataset.ideaParam, b.dataset.value);
            history.replaceState(null, '', href(id) + '?' + next.toString());
            const focusId = b.id;
            container.innerHTML = render(id, next);
            bind(container, id, next);
            document.getElementById(focusId)?.focus({ preventScroll: true });
        }));
        const slider = container.querySelector('#idea-doubling');
        slider?.addEventListener('input', () => { container.querySelector('#idea-doubling-value').textContent = slider.value; container.querySelector('#idea-growth').textContent = (2 ** (12 / Number(slider.value))).toFixed(2) + '×'; });
        const budget = container.querySelector('#idea-budget-channels');
        if (budget) {
            const calculate = () => {
                const rate = container.querySelector('#idea-budget-rate'), bits = container.querySelector('#idea-budget-bits');
                const out = container.querySelector('#idea-budget-result');
                if (!budget.checkValidity() || !rate.checkValidity() || !budget.value || !rate.value) {
                    out.textContent = 'Enter positive whole numbers within the displayed limits.';
                    return;
                }
                const bps = Number(budget.value) * Number(rate.value) * Number(bits.value);
                out.textContent = (bps / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' Mb/s · ' + (bps / 8 * 3600 / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' GB/hour';
            };
            container.querySelectorAll('input,select').forEach(el => el.addEventListener('input', calculate));
            calculate();
        }
    }
    function companyForOrg(org) { return companies.find((x) => x.org === org); }
    return { render, bind, records, companyForOrg };
})();
