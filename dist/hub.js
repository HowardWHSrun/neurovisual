(function () {
    const content = document.getElementById('hub-content');
    const atlas = document.getElementById('neurotech-atlas-2026');
    const search = document.getElementById('global-search');
    const searchDialog = document.getElementById('search-dialog');
    const searchTrigger = document.getElementById('search-open');
    const sidebar = document.getElementById('site-sidebar');
    const menu = document.getElementById('mobile-menu');
    const main = document.getElementById('main-content');
    const labels = { overview: 'Start here', topics: 'Topic guides', explore: 'Explore the field', methods: 'Methods comparison', resources: 'Resource library', learn: 'Learning paths', glossary: 'Glossary', atlas: 'Technologies', organizations: 'Organizations', researchers: 'Researchers', frontier: 'Papers & updates', pathways: 'Study & careers', timeline: 'Milestones', about: 'Coverage & sources', search: 'Search', topic: 'Explore a topic' };
    const descriptions = {
        atlas: 'Compare recording, stimulation, restoration, and computational methods. Select a point for mechanisms, evidence, and sources.',
        organizations: 'Explore source-linked companies, laboratories, programs, and open-science projects. Rankings describe disclosed metrics, not research quality.',
        researchers: 'Follow project-linked research trails and find original institutional profiles and literature.',
        frontier: 'Browse a dated snapshot of indexed papers, preprints, trial updates, and institutional news.',
        pathways: 'Compare academic programs, research directions, role types, and dated job listings.',
        timeline: 'Explore selected milestones and the technologies behind them.',
    };
    labels.ideas = 'Ideas notebook';
    labels.labs = 'Research labs';
    labels.visuals = 'Pictures & films';
    labels.connections = 'Research connections';
    labels.people = 'People & influence';
    labels.neuroai = 'NeuroAI & brain models';
    const e = hubUtils.escapeHtml;
    const url = hubUtils.sourceHref;
    const topicById = (id) => hubTopics.find(t => t.id === id);
    const count = window.neuroAtlas?.counts;
    const topicLink = (id) => '#topic/' + encodeURIComponent(id);
    const external = (resource, label) => `<a href="${url(resource.url)}" target="_blank" rel="noopener noreferrer">${e(label || resource.title)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
    const pageHead = (eyebrow, title, text, extra = '') => `<header class="hub-page-head"><div><div class="eyebrow">${e(eyebrow)}</div><h1>${e(title)}</h1><p>${e(text)}</p></div>${extra}</header>`;
    function resourceCard(r) {
        const topic = topicById(r.topic);
        return `<article class="resource-card" id="resource-${e(r.id)}"><div class="resource-meta"><span>${e(r.type)}</span><span>${e(r.level)}</span></div>${r.reviewed ? `<small class="ai-resource-date">Link reviewed ${e(r.reviewed)}</small>` : ''}<h3>${external(r)}</h3><p>${e(r.description)}</p><a class="topic-tag" href="${topicLink(r.topic)}" style="--topic:${topic.color}">${e(topic.title)}</a></article>`;
    }
    function topicCard(t, index) {
        return `<a class="topic-card" href="${topicLink(t.id)}" style="--topic:${t.color}"><div class="topic-card-top"><span>${e(t.eyebrow)}</span><span>${String(index + 1).padStart(2, '0')}</span></div><h3>${e(t.title)}</h3><p>${e(t.description)}</p><span class="topic-card-bottom">${hubResources.filter(r => r.topic === t.id).length} curated resources <span aria-hidden="true">↗</span></span></a>`;
    }
    function overview() {
        const neural = neuroVisualData.items.find(m => m.labId === 'mit-boyden');
        const movement = neuroVisualData.items.find(m => m.labId === 'epfl-courtine');
        const chip = neuroVisualData.items.find(m => m.labId === 'columbia-shepard');
        const speech = neuroVisualData.items.find(m => m.labId === 'ucsf-chang');
        const team = neuroVisualData.items.find(m => m.labId === 'stanford-nptl');
        const cards = [
            { by: 'organizations', title: 'Companies & labs', question: 'Who is building it?', description: 'Go inside a lab or company: its projects, methods, and evidence.', image: chip.image, caption: 'A wireless cortical interface · Columbia' },
            { by: 'problems', title: 'Problems to solve', question: 'What could this help us do?', description: 'Explore vision, movement, communication, memory, and more.', image: speech.image, caption: 'Speech neuroprosthetics · UCSF / UC Berkeley' },
            { by: 'people', title: 'People & connections', question: 'How are the scientists connected?', description: 'Follow mentors, collaborators, and the ideas that become companies.', image: team.image, caption: 'A researcher and study participant · Stanford' },
            { by: 'countries', title: 'Countries', question: 'Where is the work happening?', description: 'Find mapped labs and companies, then follow their work across borders.', image: movement.image, caption: 'Brain–spine interface research · Switzerland' },
        ];
        return `<section class="welcome-research" aria-labelledby="welcome-title"><div class="welcome-research-copy"><span class="eyebrow">THE NEUROENGINEERING FIELD GUIDE</span><h1 id="welcome-title">See the science.<br>Find the connections.</h1><p>Explore how people measure, understand, and interact with the nervous system—from the problem to the people working on it.</p><a class="welcome-begin" href="#topic/bci">New to the field? Start with the basics <span aria-hidden="true">→</span></a></div><figure class="welcome-micrograph"><img data-visual-image src="${url(neural.image.url)}" alt="${e(neural.image.alt)}" decoding="async" fetchpriority="high"><figcaption><strong>Neural tissue, up close</strong><span>Expansion microscopy · proteins and neural processes in mouse cortex</span><a href="${url(neural.image.source)}" target="_blank" rel="noopener noreferrer">${e(neural.image.credit)} ↗</a></figcaption></figure></section>
    <section class="welcome-choices" aria-labelledby="welcome-choices-title"><div class="section-heading"><div><span class="eyebrow">FOUR WAYS INTO THE SAME FIELD</span><h2 id="welcome-choices-title">Follow your curiosity.</h2></div><a href="#explore?by=problems">Explore the field →</a></div><div class="welcome-lenses">${cards.map((card, i) => `<article class="welcome-lens"><figure><a href="#explore?by=${card.by}" aria-label="Explore by ${e(card.title.toLowerCase())}"><img data-visual-image src="${url(card.image.url)}" alt="${e(card.image.alt)}" loading="lazy" decoding="async"></a><figcaption><span>${e(card.caption)}</span><a href="${url(card.image.source)}" target="_blank" rel="noopener noreferrer" aria-label="Image source: ${e(card.image.credit)}">Source ↗</a></figcaption></figure><a class="welcome-lens-copy" href="#explore?by=${card.by}"><span class="eyebrow">0${i + 1} / ${e(card.question)}</span><h3>${e(card.title)} <span aria-hidden="true">→</span></h3><p>${e(card.description)}</p></a></article>`).join('')}</div></section>
    ${NeuroAI.spotlight()}
    <div class="welcome-support"><div><span class="eyebrow">BUILD YOUR UNDERSTANDING</span><h2>A little background goes a long way.</h2></div><a href="#topics">Topic guides <span>Understand a concept →</span></a><a href="#learn">Learning paths <span>Try a guided project →</span></a><a href="#visuals">Pictures &amp; films <span>See the work up close →</span></a></div>
    <aside class="welcome-evidence"><div><strong>Every route leads back to the evidence.</strong><p>Browse short explanations first, then open the projects, relationships, and original sources behind them.</p></div><a href="#about">About the sources <span aria-hidden="true">↗</span></a></aside>`;
    }
    function topicsPage() {
        const groups = [
            { title: 'Measure & understand', description: 'How we record activity, make sense of signals, and relate them to behavior.', ids: ['interfaces', 'signals', 'imaging', 'behavior', 'computation', 'neuroai'] },
            { title: 'Build & interact', description: 'How technology can use signals, influence activity, or connect with living tissue.', ids: ['bci', 'stimulation', 'regeneration'] },
            { title: 'Check & share the evidence', description: 'How results become reproducible and meaningful to the people who use them.', ids: ['data', 'translation'] },
        ];
        return '<a class="back-link" href="#overview">← Start here</a>' + pageHead('LEARN THE BASICS', 'Find the question that interests you.', 'Each guide starts with a visual explanation. Open the workflows, examples, and sources when you want more detail.')
            + `<aside class="topic-start"><span>Not sure where to begin?</span><a href="#topic/bci">Start with brain–computer interfaces →</a><a href="#glossary">Look up a term ↗</a></aside>`
            + groups.map((group, i) => `<section class="topic-directory-group" aria-labelledby="topic-group-${i}"><div class="section-heading"><div><span class="eyebrow">0${i + 1}</span><h2 id="topic-group-${i}">${e(group.title)}</h2><p>${e(group.description)}</p></div></div><div class="topic-directory">${group.ids.map(id => topicById(id)).filter(Boolean).map(t => `<a href="${topicLink(t.id)}" class="topic-directory-card" style="--topic:${t.color}"><span class="eyebrow">${e(t.eyebrow)}</span><h3>${e(t.title)}</h3><p>${e(t.question)}</p><span>Open guide <b aria-hidden="true">→</b></span></a>`).join('')}</div></section>`).join('');
    }
    function resourcePage(params) {
        const query = params.get('q') || '', topic = params.get('topic') || '', type = params.get('type') || '', level = params.get('level') || '';
        const filtered = hubResources.filter(r => (!topic || r.topic === topic) && (!type || r.type === type) && (!level || r.level === level) && matches([r.title, r.description, r.type, r.level, topicById(r.topic)?.title].join(' '), query));
        const opts = (items, selected) => items.map(x => `<option value="${e(x)}"${selected === x ? ' selected' : ''}>${e(x)}</option>`).join('');
        return pageHead('CURATED REFERENCES', 'Resource library', 'Official documentation, open tools, datasets, and courses. Each link takes you to the original source.')
            + FieldVisuals.resources() + `<nav class="resource-shortcuts" aria-label="Resource categories">${[['', 'All resources'], ['Tool', 'Tools'], ['Dataset', 'Datasets'], ['Course', 'Courses'], ['Hardware', 'Hardware']].map(([value, label]) => { const next = new URLSearchParams(params); if (value)
            next.set('type', value);
        else
            next.delete('type'); return `<a href="#resources${next.size ? '?' + e(next.toString()) : ''}"${type === value ? ' aria-current="true"' : ''}>${label}<span>${hubResources.filter(r => !value || r.type === value).length}</span></a>`; }).join('')}</nav><form class="resource-filters" id="resource-filters" role="search"><label class="filter-query">Search resources<input id="resource-query" name="q" type="search" value="${e(query)}" placeholder="Try EEG, Python, 3D, or datasets"></label><label>Topic<select id="resource-topic" name="topic"><option value="">All topics</option>${hubTopics.map(t => `<option value="${t.id}"${topic === t.id ? ' selected' : ''}>${e(t.title)}</option>`).join('')}</select></label><label>Type<select id="resource-type" name="type"><option value="">All types</option>${opts([...new Set(hubResources.map(r => r.type))].sort(), type)}</select></label><label>Level<select id="resource-level" name="level"><option value="">All levels</option>${opts(['Beginner', 'Intermediate', 'Advanced'], level)}</select></label></form>
      <div class="results-line"><p role="status">${filtered.length} of ${hubResources.length} resources</p>${query || topic || type || level ? '<a href="#resources">Clear filters</a>' : '<span>Core collection: 7 Sep 2026; new entries show their review dates</span>'}</div>
      <div class="resource-grid">${filtered.length ? filtered.map(resourceCard).join('') : '<div class="hub-empty"><h2>No resources match these filters.</h2><p>Try a broader term or choose another topic.</p><a href="#resources">Show all resources</a></div>'}</div><p class="page-note">Levels are suggested starting points; beginner resources may assume Python or undergraduate science. Check each project’s installation instructions, access terms, and dataset license.</p>`;
    }
    function guideDetails(id) {
        const guide = hubGuides[id];
        const example = hubWorkedExamples[id];
        if (!guide)
            return '';
        return `<section class="guide-introduction"><span class="eyebrow">UNDERSTAND THE AREA</span><h2>What you are actually working with</h2>${guide.primer.map(p => `<p>${e(p)}</p>`).join('')}</section>
    <section class="guide-reading" aria-labelledby="guide-reading-title"><div class="guide-reading-heading"><div><h2 id="guide-reading-title">Go deeper, one question at a time</h2><p>Open the part you need, or expand the full guide.</p></div><button type="button" id="guide-expand-all" aria-expanded="false">Expand all details</button></div>
    <details class="guide-reading-detail"><summary><span><strong>Tradeoffs that shape the work</strong><small>What each engineering choice gains and costs</small></span></summary><div class="guide-reading-body"><div class="guide-tradeoffs">${guide.tradeoffs.map(t => `<article><h3>${e(t.choice)}</h3><div><span class="eyebrow">WHAT YOU GAIN</span><p>${e(t.benefit)}</p></div><div><span class="eyebrow">WHAT TO ACCOUNT FOR</span><p>${e(t.cost)}</p></div></article>`).join('')}</div></div></details>
    <details class="guide-reading-detail"><summary><span><strong>A practical research workflow</strong><small>${guide.workflow.length} steps from a question to a result</small></span></summary><div class="guide-reading-body"><ol class="guide-workflow">${guide.workflow.map((w, i) => `<li><span class="step-number">${String(i + 1).padStart(2, '0')}</span><div><h3>${e(w.title)}</h3><p>${e(w.action)}</p><p class="workflow-output"><strong>Keep:</strong> ${e(w.output)}</p></div></li>`).join('')}</ol></div></details>
    ${example ? `<details class="guide-reading-detail"><summary><span><strong>Worked example: ${e(example.title)}</strong><small>Follow the calculation and understand its limits</small></span></summary><div class="guide-reading-body"><section class="worked-example"><h3>${e(example.title)}</h3><p>${e(example.setup)}</p><ol>${example.steps.map(step => `<li>${e(step)}</li>`).join('')}</ol><p>${e(example.interpretation)}</p></section></div></details>` : ''}
    <details class="guide-reading-detail"><summary><span><strong>Common mistakes</strong><small>Check your interpretation before drawing a conclusion</small></span></summary><div class="guide-reading-body guide-reading-pitfalls"><ul>${guide.pitfalls.map(p => `<li>${e(p)}</li>`).join('')}</ul></div></details>
    <details class="guide-reading-detail"><summary><span><strong>Further reading &amp; original sources</strong><small>${guide.sources.length} references behind this guide</small></span></summary><div class="guide-reading-body guide-sources"><ul>${guide.sources.map(r => `<li><a href="${url(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.title)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul><p>These guides synthesize the linked sources into an introductory research workflow.</p></div></details></section>`;
    }
    function topicPage(id) {
        const topic = topicById(id);
        if (!topic)
            return notFound();
        const resources = hubResources.filter(r => r.topic === id);
        const related = hubGuides[id]?.related || [];
        const sequence = [['bci', 'See the whole system'], ['interfaces', 'Record a signal'], ['signals', 'Understand the signal']];
        const suggested = sequence.some(([topicId]) => topicId === id) ? `<nav class="guide-reading-sequence" aria-label="Suggested reading"><span>Suggested reading</span>${sequence.map(([topicId, label], index) => `<a href="${topicLink(topicId)}"${topicId === id ? ' aria-current="step"' : ''}><span aria-hidden="true">${index + 1}</span>${e(label)}${topicId === id ? '<small>You are here</small>' : ''}</a>`).join('')}</nav>` : '';
        return `<a class="back-link" href="#topics">← All topics</a>` + pageHead(topic.eyebrow, topic.title, topic.description)
            + `<div class="topic-visual-intro">${FieldVisuals.topic(id)}<section class="topic-primer" style="--topic:${topic.color}"><div><span class="eyebrow">THE CENTRAL QUESTION</span><h2>${e(topic.question)}</h2></div><div><h3>Concepts to understand</h3><ul>${topic.concepts.map(c => `<li>${e(c)}</li>`).join('')}</ul></div></section></div>
    ${id === 'neuroai' ? '<p class="guide-term-help"><a href="#neuroai">Explore sourced NeuroAI projects →</a> · <a href="#neuroai?view=explain">Follow the interactive explanation →</a></p>' : ''}
    <p class="guide-term-help">Unfamiliar words? <a href="#glossary?topic=${id}">Read the key terms for this topic ↗</a></p>
    ${guideDetails(id)}
    <details class="guide-reading-detail guide-resource-detail"><summary><span><strong>Tools &amp; references</strong><small>${resources.length} official resources to put this topic into practice</small></span></summary><div class="guide-reading-body"><div class="resource-grid">${resources.map(resourceCard).join('')}</div></div></details>
    ${suggested}<section class="guide-next-section"><div class="section-heading"><h2>Where to go next</h2><a href="#learn">Try a learning path ↗</a></div><div class="topic-next"><a class="button-primary" href="#atlas?q=${encodeURIComponent(topic.atlasQuery)}">Explore related technologies ↗</a><a href="#organizations?q=${encodeURIComponent(topic.atlasQuery)}">Find organizations ↗</a><a href="#methods">Compare methods ↗</a></div><h3>Connected areas</h3><div class="related-topics">${related.map(id => topicById(id)).filter(Boolean).map(t => `<a href="${topicLink(t.id)}">${e(t.title)} ↗</a>`).join('')}</div></section>`;
    }
    function methodsPage(params) {
        const left = hubMethods.find(m => m.id === params.get('left')) || hubMethods[0];
        const right = hubMethods.find(m => m.id === params.get('right')) || hubMethods.find(m => m.id === (left.id === 'fmri' ? 'eeg' : 'fmri'));
        const methodOptions = (chosen) => hubMethods.map(m => `<option value="${m.id}"${m.id === chosen ? ' selected' : ''}>${e(m.name)}</option>`).join('');
        const dimensions = [['signal', 'Measured signal'], ['access', 'Typical access'], ['strength', 'Useful strength'], ['limit', 'Main limitation']];
        return pageHead('MATCH THE METHOD TO THE QUESTION', 'What does each method measure?', 'Compare the measurement first, then the engineering constraints. There is no single best method across all spatial scales, timescales, and research questions.')
            + `<form id="method-compare" class="method-compare-controls"><div><span class="eyebrow">COMPARISON BENCH</span><h2>Put two methods side by side.</h2></div><label>First method<select id="method-left" name="left">${methodOptions(left.id)}</select></label><span class="method-versus" aria-hidden="true">↔</span><label>Second method<select id="method-right" name="right">${methodOptions(right.id)}</select></label></form>${FieldVisuals.methods(left.id, right.id)}<div class="method-duo-wrap"><table class="method-duo"><caption class="sr-only">${e(left.name)} and ${e(right.name)}: measurement and engineering tradeoffs</caption><thead><tr><th scope="col">Compare</th><th scope="col">${e(left.name)}</th><th scope="col">${e(right.name)}</th></tr></thead><tbody>${dimensions.map(([key, label]) => `<tr><th scope="row">${label}</th><td>${e(String(left[key]))}</td><td>${e(String(right[key]))}</td></tr>`).join('')}<tr><th scope="row">Read the source</th>${[left, right].map(m => `<td><a href="${url(m.source.url)}" target="_blank" rel="noopener noreferrer">${e(m.source.title)} ↗</a></td>`).join('')}</tr></tbody></table></div><div class="method-notes"><p><strong>Electrical, hemodynamic, and calcium signals are different measurements.</strong> An indirect signal can be useful without being a direct readout of spikes. Pose video measures behavior.</p><p>Access descriptions are typical contexts. Suitability depends on the specific implementation, study population, and research setting.</p></div><details class="method-full"><summary>Browse all ${hubMethods.length} methods in the reference table <span aria-hidden="true">+</span></summary><div class="method-table-wrap" role="region" aria-label="Measurement methods comparison; scroll horizontally to see all columns" tabindex="0"><table class="method-table"><caption>Qualitative comparison of ${hubMethods.length} measurement methods</caption><thead><tr><th scope="col">Method</th><th scope="col">Measured signal</th><th scope="col">Typical access</th><th scope="col">Useful strength</th><th scope="col">Main limitation</th></tr></thead><tbody>${hubMethods.map(m => `<tr><th scope="row"><a href="${url(m.source.url)}" target="_blank" rel="noopener noreferrer">${e(m.name)} ↗</a><small>${e(m.source.title)}</small></th><td>${e(m.signal)}</td><td>${e(m.access)}</td><td>${e(m.strength)}</td><td>${e(m.limit)}</td></tr>`).join('')}</tbody></table></div></details><section class="method-questions"><h2>Before choosing a method</h2><ol><li>Define the biological variable and the claim you need to test.</li><li>Decide which temporal, spatial, behavioral, or population scales matter.</li><li>Account for artifacts, access, calibration, synchronization, and the available expertise.</li><li>Choose a validation strategy that could reveal when the method is misleading you.</li></ol><a href="#topic/interfaces">Neural interfaces guide ↗</a><a href="#topic/imaging">Imaging guide ↗</a><a href="#topic/translation">Translation &amp; evidence ↗</a></section>`;
    }
    function learnPage(id) {
        if (id) {
            const path = hubLearningPaths.find(p => p.id === id);
            if (!path)
                return notFound();
            const assessment = hubProjectChecks[path.id];
            return '<a class="back-link" href="#learn">← All learning paths</a>' + pageHead('GUIDED PRACTICE', path.title, path.description)
                + FieldVisuals.learning(id) + `<div class="path-context"><div><span class="eyebrow">BEFORE YOU START</span><p>${e(path.prerequisites)}</p></div><div><span class="eyebrow">WHAT YOU WILL MAKE</span><p>${e(path.outcome)}</p></div></div><p class="learning-reading-hint">Start with step 1, then open each step as you go. You can keep several steps open.</p><ol class="learning-steps learning-reading-steps">${path.steps.map((s, i) => `<li><span class="step-number" aria-hidden="true">0${i + 1}</span><details class="learning-step-detail"${i === 0 ? ' open' : ''}><summary><span><span class="eyebrow">STEP ${i + 1}</span><strong>${e(s[1])}</strong></span></summary><div class="learning-step-body"><p>${e(s[2])}</p>${external(hubResources.find(r => r.id === s[0]), 'Open ' + hubResources.find(r => r.id === s[0]).title)}</div></details></li>`).join('')}</ol>${assessment ? `<section class="project-assessment"><span class="eyebrow">CHECK YOUR WORK</span><h2>What a solid result includes</h2><ul>${assessment.checks.map(c => `<li>${e(c)}</li>`).join('')}</ul><p><strong>Stretch question:</strong> ${e(assessment.stretch)}</p></section>` : ''}<p class="page-note">These are editorial learning sequences, not accredited courses. Use research and example data; the outcomes are educational projects.</p>`;
        }
        return pageHead('LEARN BY DOING', 'A path from curiosity to practice.', 'Choose one concrete project. Build the background you need as you go.')
            + `<div class="learning-grid">${hubLearningPaths.map((p, i) => `<article class="learning-card"><span class="learning-index">0${i + 1}</span><span class="eyebrow">4 STEPS · PROJECT BASED</span><h2><a href="#learn/${p.id}">${e(p.title)}</a></h2><p>${e(p.description)}</p><dl class="learning-card-facts"><div><dt>You will make</dt><dd>${e(p.outcome)}</dd></div><div><dt>Before you start</dt><dd>${e(p.prerequisites)}</dd></div></dl><details class="learning-card-preview"><summary>Preview the four steps</summary><ol class="learning-preview" aria-label="Path sequence">${p.steps.map(s => `<li>${e(s[1])}</li>`).join('')}</ol><div class="learning-visual-preview">${FieldVisuals.topic({ eeg: 'signals', spikes: 'interfaces', motion: 'behavior', model: 'computation', calcium: 'imaging', 'stimulation-model': 'stimulation' }[p.id])}</div></details><a class="button-primary" href="#learn/${p.id}">Open learning path ↗</a></article>`).join('')}</div><div class="learning-support"><h2>Looking for a degree or a research role?</h2><p>Compare programs, explore role types, and investigate the people doing work that interests you.</p><a href="#pathways">Study &amp; careers ↗</a><a href="#researchers">Researcher trails ↗</a></div>`;
    }
    function glossaryPage(params) {
        const q = params.get('q') || '', topic = params.get('topic') || '', letter = params.get('letter') || '';
        const letters = [...new Set(hubGlossary.map(t => t[0][0].toUpperCase()))].sort();
        const terms = hubGlossary.filter(t => (!topic || t[2] === topic) && (!letter || t[0][0].toUpperCase() === letter) && matches(t[0] + ' ' + t[1], q)).sort((a, b) => a[0].localeCompare(b[0]));
        return pageHead('PLAIN-LANGUAGE REFERENCE', 'Glossary', 'Short working definitions to help you read across the field.')
            + FieldVisuals.glossary() + `<nav class="glossary-alphabet" aria-label="Glossary letters">${['', ...letters].map(l => { const p = new URLSearchParams(params); if (l)
            p.set('letter', l);
        else
            p.delete('letter'); return `<a href="#glossary${p.size ? '?' + e(p.toString()) : ''}"${letter === l ? ' aria-current="true"' : ''} aria-label="${l ? 'Terms beginning with ' + l : 'All letters'}">${l || 'All'}</a>`; }).join('')}</nav><form id="glossary-filter" class="glossary-filter" role="search"><label for="glossary-query">Find a term</label><input id="glossary-query" type="search" placeholder="EEG, closed loop, spike sorting…" value="${e(q)}"></form><div class="results-line"><p role="status">${terms.length} terms${topicById(topic) ? ' in ' + e(topicById(topic).title) : ''}</p><a href="#glossary">Show all terms</a></div><dl class="glossary-list">${terms.map(t => `<div><dt>${e(t[0])}</dt><dd>${e(t[1])}<a href="${topicLink(t[2])}">Explore ${e(topicById(t[2]).title.toLowerCase())} ↗</a></dd></div>`).join('') || '<div><dt>No matching terms</dt><dd>Try a shorter term or clear your filters.</dd></div>'}</dl><p class="page-note">Definitions are introductory summaries. Topic pages link to official documentation for greater depth.</p>`;
    }
    const matches = hubUtils.matches;
    function searchRecords() {
        return [
            { id: 'start-here', title: 'Start here', description: 'An introduction to neuroengineering and four ways to explore the research.', kind: 'Section', href: '#overview', keywords: 'beginner new basics overview introduction' },
            { id: 'topic-guides', title: 'Topic guides', description: 'Browse the field by the question you want to answer.', kind: 'Section', href: '#topics', keywords: 'learn basics overview topics' },
            ...NeuroExplore.records(),
            ...NeuroIdeas.records(),
            ...NeuroLabs.records(),
            ...NeuroVisuals.records(), ...NeuroConnections.records(), ...NeuroPeople.records(), ...NeuroAI.records(),
            ...hubTopics.map(t => ({ id: t.id, title: t.title, description: t.description, kind: 'Topic', href: topicLink(t.id), keywords: t.concepts.join(' ') + ' ' + JSON.stringify(hubGuides[t.id] || {}) })),
            ...hubMethods.map(m => ({ id: m.id, title: m.name + ' measurement', description: m.signal, kind: 'Method', href: '#methods?left=' + encodeURIComponent(m.id), keywords: m.strength + ' ' + m.limit + ' ' + m.access })),
            ...hubResources.map(r => ({ id: r.id, title: r.title, description: r.description, kind: 'Resource', href: r.url, keywords: topicById(r.topic).title + ' ' + r.type })),
            ...hubLearningPaths.map(p => ({ id: p.id, title: p.title, description: p.description, kind: 'Learning path', href: '#learn/' + p.id })),
            ...hubGlossary.map(t => ({ id: t[0], title: t[0], description: t[1], kind: 'Glossary', href: '#glossary?q=' + encodeURIComponent(t[0]) })),
            ...(window.neuroAtlas?.records || [])
        ];
    }
    function searchPage(params) {
        const q = params.get('q') || '', kind = params.get('kind') || '';
        const all = q.trim() ? searchRecords().filter(r => matches(r.title + ' ' + r.description + ' ' + (r.keywords || ''), q)).sort((a, b) => Number(b.title.toLowerCase().includes(q.toLowerCase())) - Number(a.title.toLowerCase().includes(q.toLowerCase()))) : [];
        const filtered = all.filter(r => !kind || r.kind === kind);
        const page = Math.max(1, Math.min(Math.ceil(filtered.length / 30) || 1, Number(params.get('page')) || 1));
        const displayed = filtered.slice((page - 1) * 30, page * 30);
        const kinds = [...new Set(all.map(r => r.kind))];
        const link = (k, p = 1) => '#search?' + new URLSearchParams({ q, ...(k ? { kind: k } : {}), ...(p > 1 ? { page: String(p) } : {}) }).toString();
        return pageHead('SEARCH THE WHOLE HUB', q ? 'Results for “' + q + '”' : 'What would you like to explore?', 'Search a topic, person, technology, or question. Use the result types below to narrow your search.')
            + `<form id="results-search-form" class="results-search-form" role="search"><label class="sr-only" for="results-query">Refine search</label><input id="results-query" type="search" value="${e(q)}" placeholder="Search across Neurovisual"><button type="submit">Search</button></form><div class="search-kinds" aria-label="Result type"><a href="${e(link(''))}"${!kind ? ' aria-current="true"' : ''}>All <span>${all.length}</span></a>${kinds.map(k => `<a href="${e(link(k))}"${kind === k ? ' aria-current="true"' : ''}>${e(k)} <span>${all.filter(r => r.kind === k).length}</span></a>`).join('')}</div><p class="results-line" role="status">${filtered.length} results${filtered.length ? ' · showing ' + ((page - 1) * 30 + 1) + '–' + Math.min(page * 30, filtered.length) : ''}</p><div class="search-results">${displayed.map(r => `<article><span class="eyebrow">${e(r.kind)}</span><h2><a href="${r.href.startsWith('#') ? e(r.href) : url(r.href)}"${r.href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}>${e(r.title)} <span aria-hidden="true">↗</span></a></h2><p>${e(r.description)}</p></article>`).join('') || `<div class="hub-empty"><h2>${q ? 'No matches found.' : 'Start with a topic or a question.'}</h2><p>Try “EEG”, “Stanford”, “spike sorting”, or “3D”.</p><a href="#resources">Browse the resource library</a></div>`}</div>${filtered.length > 30 ? `<nav class="search-pager" aria-label="Search pages">${page > 1 ? `<a href="${e(link(kind, page - 1))}">← Previous</a>` : '<span></span>'}<span>Page ${page} of ${Math.ceil(filtered.length / 30)}</span>${page * 30 < filtered.length ? `<a href="${e(link(kind, page + 1))}">Next →</a>` : '<span></span>'}</nav>` : ''}`;
    }
    function snapshotDate(value) { const d = new Date(String(value)); return Number.isNaN(d.getTime()) ? 'Unavailable' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); }
    function aboutPage() {
        return pageHead('COVERAGE & SOURCES', 'A starting point you can inspect.', 'Neurovisual connects a curated field guide with an existing global neurotechnology atlas.')
            + FieldVisuals.topic('data') + `<div class="about-grid"><section><h2>What is included</h2><p>The atlas contains ${count?.technologies ?? '—'} technology categories, ${count?.organizations ?? '—'} organizations and projects, and ${count?.researchers ?? '—'} researcher trails. The resource library adds ${hubResources.length} selected official resources across ${hubTopics.length} areas. The <a href="#neuroai">NeuroAI collection</a> adds ${neuroAIData.projects.length} source-linked projects connecting brain maps, models, behavior and living neural computing.</p><p>This is a selective index. Coverage differs by region, language, topic, and source availability. Inclusion is not endorsement, and absence is not a judgment of quality.</p><h2>How to use the evidence</h2><p>Open the original source, check the date, and distinguish animal research, human feasibility studies, registered trials, and regulatory decisions. Trial counts are not evidence of efficacy.</p><p>Capital, workforce, and clinical activity are different measures. Unknown values remain undisclosed; program budgets and private investment should not be treated as interchangeable.</p></section><section class="source-status"><h2>Dates &amp; maintenance</h2><dl><div><dt>Core resource collection reviewed</dt><dd>Sep 7, 2026</dd></div><div><dt>NeuroAI projects and resources reviewed</dt><dd>Sep 15, 2026 · <a href="#neuroai">Scope &amp; sources</a></dd></div><div><dt>Ideas evidence reviewed</dt><dd>Sep 15, 2026</dd></div><div><dt>Research lab profiles reviewed</dt><dd>Sep 15, 2026 · <a href="#labs?view=coverage">Scope &amp; method</a></dd></div><div><dt>Atlas editorial baseline</dt><dd>Aug 17, 2026</dd></div><div><dt>Paper snapshot generated</dt><dd>${snapshotDate(typeof frontierSnapshot !== 'undefined' ? frontierSnapshot.generatedAt : null)}</dd></div><div><dt>Jobs snapshot generated</dt><dd>${snapshotDate(typeof jobsSnapshot !== 'undefined' ? jobsSnapshot.generatedAt : null)}</dd></div></dl><p>A scheduled refresh is not a guarantee of current data. Snapshot views disclose source failures. Manually curated opportunities need an availability check on the employer’s site.</p><a href="https://github.com/HowardWHSrun/neurovisual/issues" target="_blank" rel="noopener noreferrer">Report a correction or suggest a resource ↗</a></section></div>`;
    }
    function notFound() { return pageHead('PAGE NOT FOUND', 'This destination is not in the hub.', 'The link may have changed. You can return to the overview or search the field.') + '<a class="button-primary" href="#overview">Back to overview</a>'; }
    function parseRoute() { return hubUtils.parseRoute(location.hash === '#main-content' ? '#overview' : location.hash); }
    function setWorkspace(view, detail = false) {
        document.body.dataset.view = view;
        document.body.dataset.detail = String(detail);
        document.getElementById('workspace-page').textContent = labels[view] || 'Neurovisual';
        let section = view === 'overview' ? 'Welcome' : view === 'explore' ? 'Explore' : 'Neurovisual';
        document.querySelectorAll('.nav-group').forEach(group => {
            const active = (group.dataset.views || '').split(' ').includes(view);
            group.open = active;
            group.dataset.active = String(active);
            if (active)
                section = group.querySelector('summary strong')?.textContent || section;
        });
        document.getElementById('workspace-section').textContent = section;
        if (view === 'topic') {
            const topic = topicById(parseRoute().id);
            if (topic)
                document.getElementById('workspace-page').textContent = topic.title;
        }
    }
    function closeMenu() { sidebar.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
    function render(focusMain = false) {
        const { route, id, params } = parseRoute();
        NeuroVisuals.close();
        NeuroConnections.close();
        PeopleMap.close();
        NeuroMedia.resetPlayers(content);
        NeuroMedia.resetPlayers(atlas);
        const atlasRoute = route === 'org' ? 'organizations' : route === 'tech' ? 'atlas' : route === 'person' ? 'researchers' : route;
        const isAtlas = !!descriptions[atlasRoute];
        const missingRecord = ['org', 'tech', 'person'].includes(route) && window.neuroAtlas && !window.neuroAtlas.records.some(r => r.href === '#' + route + '/' + encodeURIComponent(id));
        const previous = document.activeElement;
        const previousId = previous?.id, selection = previous?.selectionStart;
        content.hidden = isAtlas;
        atlas.hidden = !isAtlas;
        document.querySelectorAll('.site-nav a').forEach(a => { const active = a.dataset.route === (route === 'topic' ? 'topics' : atlasRoute); if (active)
            a.setAttribute('aria-current', 'page');
        else
            a.removeAttribute('aria-current'); });
        document.title = (route === 'topic' ? topicById(id)?.title || labels.topic : labels[atlasRoute] || 'Neuroengineering') + ' — Neurovisual';
        setWorkspace(atlasRoute, !!id);
        if (missingRecord) {
            atlas.hidden = true;
            content.hidden = false;
            content.innerHTML = notFound();
        }
        else if (isAtlas) {
            document.getElementById('atlas-view-title').textContent = labels[atlasRoute];
            document.getElementById('atlas-view-description').textContent = descriptions[atlasRoute];
            if (window.neuroAtlas)
                window.neuroAtlas.navigate(route, id, params.get('q') || '');
            else {
                atlas.hidden = true;
                content.hidden = false;
                content.innerHTML = pageHead('ATLAS UNAVAILABLE', 'The atlas could not load.', 'Reload the page to retry. The resource library and learning paths are still available.') + '<a href="#resources">Browse resources →</a>';
            }
        }
        else {
            content.innerHTML = route === 'neuroai' ? NeuroAI.render(id, params) : route === 'people' ? NeuroPeople.render(id, params) : route === 'connections' ? NeuroConnections.render(id, params) : route === 'visuals' ? NeuroVisuals.render(params) : route === 'labs' ? NeuroLabs.render(id, params) : route === 'ideas' ? NeuroIdeas.render(id, params) : route === 'overview' ? overview() : route === 'explore' ? NeuroExplore.render(params) : route === 'topics' ? topicsPage() : route === 'methods' ? methodsPage(params) : route === 'resources' ? resourcePage(params) : route === 'topic' ? topicPage(id) : route === 'learn' ? learnPage(id) : route === 'glossary' ? glossaryPage(params) : route === 'search' ? searchPage(params) : route === 'about' ? aboutPage() : notFound();
            bindFilters(params);
            if (route === 'explore')
                NeuroExplore.bind(content, params, (hash, focusId) => { history.pushState(null, '', hash); render(!focusId); if (focusId)
                    document.getElementById(focusId)?.focus({ preventScroll: true }); });
            if (route === 'ideas')
                NeuroIdeas.bind(content, id, params);
            if (route === 'labs')
                NeuroLabs.bind(content, id, params, updateHash);
            NeuroAI.bindImages(content);
            if (route === 'neuroai')
                NeuroAI.bind(content, params, (hash, focusId) => { history.pushState(null, '', hash); render(!focusId); if (focusId)
                    document.getElementById(focusId)?.focus({ preventScroll: true }); });
            if (route === 'people')
                NeuroPeople.bind(content, id, params, (hash, focusId) => { history.pushState(null, '', hash); render(); const target = focusId ? document.getElementById(focusId) : content.querySelector('.pe-page h1'); if (!focusId) {
                    target?.setAttribute('tabindex', '-1');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                } target?.focus({ preventScroll: true }); });
            if (route === 'connections')
                NeuroConnections.bind(content, id, params, (hash, focusId) => { history.pushState(null, '', hash); render(); if (focusId)
                    document.getElementById(focusId)?.focus({ preventScroll: true });
                else {
                    const heading = content.querySelector('.or-page h1');
                    heading?.setAttribute('tabindex', '-1');
                    heading?.focus({ preventScroll: true });
                } });
        }
        if (route !== 'ideas')
            NeuroVisuals.bind(isAtlas ? atlas : content);
        closeMenu();
        if (focusMain) {
            main.focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        else if (previousId && previousId !== 'global-search') {
            const replacement = document.getElementById(previousId);
            replacement?.focus({ preventScroll: true });
            if (replacement?.type === 'search' && selection != null)
                replacement.setSelectionRange(selection, selection);
        }
    }
    function updateHash(hash) { history.replaceState(null, '', hash); render(); }
    function bindFilters(params) {
        const guideToggle = document.getElementById('guide-expand-all');
        if (guideToggle) {
            const sections = Array.from(content.querySelectorAll('.guide-reading-detail'));
            const syncGuideToggle = () => { const open = sections.every(section => section.open); guideToggle.setAttribute('aria-expanded', String(open)); guideToggle.textContent = open ? 'Collapse all details' : 'Expand all details'; };
            guideToggle.addEventListener('click', () => { const open = !sections.every(section => section.open); sections.forEach(section => { section.open = open; }); syncGuideToggle(); });
            sections.forEach(section => section.addEventListener('toggle', syncGuideToggle));
        }
        const liveInput = (input, update) => { let composing = false; input.addEventListener('compositionstart', () => { composing = true; }); input.addEventListener('compositionend', () => { composing = false; update(); }); input.addEventListener('input', (event) => { if (!composing && !event.isComposing)
            update(); }); };
        const form = document.getElementById('resource-filters');
        if (form) {
            const update = () => { const p = new URLSearchParams(); new FormData(form).forEach((v, k) => { if (String(v).trim())
                p.set(k, String(v)); }); updateHash('#resources' + (p.size ? '?' + p.toString() : '')); };
            form.addEventListener('submit', ev => { ev.preventDefault(); update(); });
            form.addEventListener('change', event => { if (event.target.tagName === 'SELECT')
                update(); });
            liveInput(document.getElementById('resource-query'), update);
        }
        const glossary = document.getElementById('glossary-filter');
        if (glossary) {
            const update = () => { const p = new URLSearchParams(params); const v = document.getElementById('glossary-query').value; if (v)
                p.set('q', v);
            else
                p.delete('q'); updateHash('#glossary' + (p.size ? '?' + p.toString() : '')); };
            glossary.addEventListener('submit', ev => { ev.preventDefault(); update(); });
            liveInput(document.getElementById('glossary-query'), update);
        }
        const compare = document.getElementById('method-compare');
        if (compare)
            compare.addEventListener('change', () => { const p = new URLSearchParams(); new FormData(compare).forEach((v, k) => p.set(k, String(v))); updateHash('#methods?' + p.toString()); });
        const results = document.getElementById('results-search-form');
        if (results)
            results.addEventListener('submit', event => { event.preventDefault(); const q = document.getElementById('results-query').value.trim(); location.hash = '#search' + (q ? '?q=' + encodeURIComponent(q) : ''); });
    }
    document.querySelector('.skip-link').addEventListener('click', ev => { ev.preventDefault(); main.focus(); });
    let searchReturnFocus = null, restoreSearchFocus = true, searchComposing = false;
    function searchPreview() {
        const q = search.value.trim();
        const hits = q ? searchRecords().filter(r => matches(r.title + ' ' + r.description + ' ' + (r.keywords || ''), q)).sort((a, b) => Number(b.title.toLowerCase().includes(q.toLowerCase())) - Number(a.title.toLowerCase().includes(q.toLowerCase()))) : [];
        document.getElementById('search-status').textContent = q ? `${hits.length} ${hits.length === 1 ? 'match' : 'matches'}${hits.length > 6 ? ' · first 6 shown' : ''}` : 'Jump into a section, or search the whole field.';
        document.getElementById('search-suggestions').innerHTML = q ? (hits.slice(0, 6).map(r => `<a href="${r.href.startsWith('#') ? e(r.href) : url(r.href)}"${r.href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}><span>${e(r.kind)}</span><strong>${e(r.title)}</strong><i aria-hidden="true">↗</i></a>`).join('') || '<p class="search-no-results">No matches yet. Try a shorter term, a lab name, or a method.</p>') : `<div class="search-quick-links"><a href="#labs"><span>Research</span><strong>Find a lab ↗</strong></a><a href="#ideas"><span>Notebook</span><strong>Explore ideas ↗</strong></a><a href="#resources"><span>Library</span><strong>Find a tool ↗</strong></a><a href="#methods"><span>Workbench</span><strong>Compare methods ↗</strong></a></div>`;
    }
    function openSearch() { if (searchDialog.open)
        return; closeMenu(); searchReturnFocus = document.activeElement; restoreSearchFocus = true; const { route, params } = parseRoute(); search.value = route === 'search' ? params.get('q') || '' : ''; searchPreview(); searchDialog.showModal(); document.body.classList.add('search-open'); searchTrigger.setAttribute('aria-expanded', 'true'); search.focus(); }
    function closeSearch(restore = true) { restoreSearchFocus = restore; if (searchDialog.open)
        searchDialog.close(); }
    function submitSearch() { const q = search.value.trim(); closeSearch(false); const hash = '#search' + (q ? '?q=' + encodeURIComponent(q) : ''); if (location.hash === hash)
        render(true);
    else
        location.hash = hash; }
    searchTrigger.addEventListener('click', openSearch);
    document.getElementById('search-close').addEventListener('click', () => closeSearch());
    searchDialog.addEventListener('close', () => { document.body.classList.remove('search-open'); searchTrigger.setAttribute('aria-expanded', 'false'); if (restoreSearchFocus)
        searchReturnFocus?.focus({ preventScroll: true }); });
    searchDialog.addEventListener('cancel', event => { if (searchComposing)
        event.preventDefault(); });
    searchDialog.addEventListener('click', event => { if (event.target === searchDialog)
        closeSearch();
    else {
        const link = event.target.closest('a');
        if (link)
            closeSearch(!link.getAttribute('href')?.startsWith('#') || event.metaKey || event.ctrlKey || event.shiftKey);
    } });
    document.getElementById('global-search-form').addEventListener('submit', ev => { ev.preventDefault(); if (!searchComposing)
        submitSearch(); });
    search.addEventListener('compositionstart', () => { searchComposing = true; });
    search.addEventListener('compositionend', () => { searchComposing = false; searchPreview(); });
    search.addEventListener('input', (event) => { if (!searchComposing && !event.isComposing)
        searchPreview(); });
    menu.addEventListener('click', () => { const open = sidebar.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); if (open)
        sidebar.querySelector('a')?.focus(); });
    document.addEventListener('keydown', ev => { const target = ev.target; if (ev.key === 'Escape' && searchDialog.open) {
        if (searchComposing || ev.isComposing)
            return;
        ev.preventDefault();
        closeSearch();
        return;
    } if (ev.key === '/' && !ev.ctrlKey && !ev.metaKey && !/INPUT|TEXTAREA|SELECT/.test(target.tagName) && !target.isContentEditable) {
        ev.preventDefault();
        openSearch();
    } if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
        ev.preventDefault();
        openSearch();
    } if (ev.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeMenu();
        menu.focus();
    } });
    document.addEventListener('click', ev => { if (sidebar.classList.contains('is-open') && !sidebar.contains(ev.target) && !menu.contains(ev.target))
        closeMenu(); });
    window.addEventListener('hashchange', () => render(true));
    window.addEventListener('neuroatlas:viewchange', (event) => {
        const detail = event.detail, hash = detail.hash || '#' + detail.view;
        if (!detail.internal) {
            location.hash = hash;
            return;
        }
        if (location.hash !== hash)
            history.pushState(null, '', hash);
        const route = hubUtils.parseRoute(hash).route;
        const view = route === 'org' ? 'organizations' : route === 'tech' ? 'atlas' : route === 'person' ? 'researchers' : route;
        document.querySelectorAll('.site-nav a').forEach(a => { if (a.dataset.route === view)
            a.setAttribute('aria-current', 'page');
        else
            a.removeAttribute('aria-current'); });
        document.getElementById('atlas-view-title').textContent = labels[view] || 'Explore the field';
        document.getElementById('atlas-view-description').textContent = descriptions[view] || '';
        document.title = (labels[view] || 'Neuroengineering') + ' — Neurovisual';
        setWorkspace(view, ['org', 'tech', 'person'].includes(route));
    });
    render();
})();
