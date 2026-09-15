const FieldVisuals = (() => {
    const e = hubUtils.escapeHtml, u = hubUtils.sourceHref;
    const text = (x, y, value, cls = '') => `<text x="${x}" y="${y}" class="${cls}">${e(value)}</text>`;
    const line = (x1, y1, x2, y2, cls = 'fv-line') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
    const dot = (x, y, r = 5, cls = 'fv-dot') => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
    function arrow(x1, y1, x2, y2, cls = '') {
        const a = Math.atan2(y2 - y1, x2 - x1), len = 7, side = 4;
        const bx = x2 - len * Math.cos(a), by = y2 - len * Math.sin(a);
        return `<g class="fv-arrow ${cls}">${line(x1, y1, bx, by)}<path d="M${x2} ${y2} L${bx + side * Math.sin(a)} ${by - side * Math.cos(a)} L${bx - side * Math.sin(a)} ${by + side * Math.cos(a)}Z"/></g>`;
    }
    function box(x, y, w, h, labels, cls = '') {
        return `<g class="fv-box ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>${labels.map((v, i) => `<text x="${x + w / 2}" y="${y + h / 2 - (labels.length - 1) * 10 + 5 + i * 20}" text-anchor="middle">${e(v)}</text>`).join('')}</g>`;
    }
    function svg(label, content) {
        return `<svg class="fv-svg" viewBox="0 0 360 250" role="img" aria-label="${e(label)}"><title>${e(label)}</title>${content}</svg>`;
    }
    function refs(sources) {
        return sources.slice(0, 2).map((r, i) => `<a href="${u(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="${e('Diagram source: ' + r.title)}" title="${e(r.title)}">Source ${i + 1} ↗</a>`).join('');
    }
    function figure(d, sources = [], extra = '', className = '') {
        return `<figure class="fv-figure ${className}"><div class="fv-art">${d.art}</div><figcaption class="fv-caption"><span class="fv-eyebrow">EXPLANATORY SCHEMATIC</span><strong>${e(d.title)}</strong><p>${e(d.description)}</p>${extra}<div class="fv-foot"><span>Illustrative · not to scale</span>${refs(sources)}</div></figcaption></figure>`;
    }
    function topicRefs(id) { return hubGuides[id]?.sources || []; }
    function waveform(x, y, variant = 0) {
        const waves = [`M${x} ${y} l10 0 4 -4 5 7 6 -3 7 0 3 -20 5 36 5 -21 5 5 10 0 4 -4 5 4 12 0`,
            `M${x} ${y} c8 0 8 -24 17 -24 s10 24 19 24 s9 -15 18 -15 s10 15 21 15`,
            `M${x} ${y} l12 0 0 -22 0 22 17 0 0 -22 0 22 8 0 0 -22 0 22 23 0 0 -22 0 22 15 0`];
        return `<path d="${waves[variant % 3]}" class="fv-signal"/>`;
    }
    function headLayers() {
        return `<path d="M18 89 Q115 71 212 89" class="fv-scalp"/><path d="M18 100 Q115 84 212 100 L212 124 Q115 108 18 124Z" class="fv-skull"/><path d="M18 154 C30 131 41 166 56 145 S82 166 101 145 S128 166 146 145 S175 165 191 145 Q204 133 212 151 V219 H18Z" class="fv-tissue"/>${line(216, 87, 233, 87)}${text(242, 92, 'Scalp', 'fv-muted')}${line(216, 111, 233, 111)}${text(242, 116, 'Skull', 'fv-muted')}${line(216, 151, 233, 151)}${text(242, 156, 'Cortex', 'fv-muted')}`;
    }
    function camera(x, y, label) {
        return `<g class="fv-camera"><rect x="${x}" y="${y}" width="34" height="24" rx="5"/><path d="M${x + 34} ${y + 6} l14 -5 v22 l-14 -5Z"/>${text(x + 8, y + 17, label)}</g>`;
    }
    function poseArt() {
        const body = [[237, 80], [236, 115], [215, 143], [257, 143], [208, 185], [267, 185]];
        return svg('Two calibrated camera views observe body landmarks; matched observations support a three-dimensional reconstruction.', `${camera(21, 43, 'A')}${camera(21, 154, 'B')}<path d="M70 56 L237 80 M70 56 L236 115 M70 168 L237 80 M70 168 L236 115" class="fv-ray"/><path d="M237 80 L236 115 L215 143 L208 185 M236 115 L257 143 L267 185" class="fv-skeleton"/>${body.map(([x, y]) => dot(x, y, 6)).join('')}${text(18, 23, '2D views')}${text(208, 35, '3D landmarks')}${text(34, 233, 'Calibration + shared timing', 'fv-muted')}`);
    }
    function methodDiagram(id) {
        const method = hubMethods.find(m => m.id === id) || hubMethods[0];
        let art = '';
        const hints = {
            eeg: 'Scalp electrodes measure spatially mixed voltage differences.',
            meg: 'Sensors outside the head detect magnetic fields from neural currents.',
            ecog: 'Electrodes at the cortical surface sample nearby population activity.',
            intracortical: 'Contacts inside tissue sample extracellular voltages. Units require further analysis.',
            fmri: 'Blood-oxygen contrast is an indirect, hemodynamic measurement.',
            fnirs: 'Scalp sources and detectors measure light changes linked to hemoglobin.',
            calcium: 'Optical access and calcium-sensitive indicators produce fluorescence measurements.',
            pose: 'Cameras measure behavior. Multiple calibrated views can support 3D reconstruction.'
        };
        if (method.id === 'pose')
            art = poseArt();
        else if (method.id === 'fmri')
            art = svg('An MRI scanner measures blood-oxygen-related contrast in brain regions, an indirect proxy for activity.', `<ellipse cx="159" cy="118" rx="116" ry="97" class="fv-skull"/><ellipse cx="159" cy="118" rx="80" ry="77" class="fv-cutout"/><ellipse cx="159" cy="130" rx="40" ry="48" class="fv-tissue"/><path d="M128 132 Q146 97 160 129 T192 130" class="fv-line"/>${dot(145, 116, 9, 'fv-warm')}${dot(174, 143, 10)}${text(110, 26, 'MRI scanner')}${text(47, 239, 'Blood-oxygen-related contrast', 'fv-muted')}`);
        else {
            let sensor = '';
            if (method.id === 'eeg')
                sensor = `${line(87, 78, 87, 45)}${line(142, 78, 142, 45)}${dot(87, 80, 8)}${dot(142, 80, 8)}${text(38, 25, 'Scalp electrodes')}`;
            if (method.id === 'meg')
                sensor = `<rect x="70" y="28" width="32" height="28" rx="5" class="fv-sensor"/><rect x="127" y="28" width="32" height="28" rx="5" class="fv-sensor"/><path d="M76 66 Q115 37 153 66 M82 72 Q115 52 147 72" class="fv-ray"/>${text(41, 21, 'Magnetic sensors')}`;
            if (method.id === 'ecog')
                sensor = `<path d="M78 138 H162 V44 H193" class="fv-contact-wire"/>${[82, 105, 128, 151].map(x => dot(x, 143, 5)).join('')}${text(28, 27, 'Cortical-surface contacts')}`;
            if (method.id === 'intracortical')
                sensor = `<path d="M112 43 H126 V192 L119 207 L112 192Z" class="fv-probe"/>${[151, 164, 177, 190].map(y => dot(119, y, 3, 'fv-contact')).join('')}${text(43, 26, 'Contacts within tissue')}`;
            if (method.id === 'fnirs')
                sensor = `<path d="M71 81 C81 199 151 201 169 81" class="fv-light-path"/>${dot(71, 83, 8, 'fv-warm')}${dot(169, 83, 8)}${text(26, 26, 'Light source → detector')}`;
            if (method.id === 'calcium')
                sensor = `<rect x="76" y="74" width="87" height="55" class="fv-cutout"/><path d="M100 30 H139 L129 73 H110Z" class="fv-sensor"/><path d="M112 77 L77 195 H163 L129 77Z" class="fv-optical-cone"/>${[[91, 175], [123, 186], [148, 166]].map(([x, y]) => dot(x, y, 7)).join('')}${text(171, 39, 'Optical')}${text(171, 58, 'access')}`;
            art = svg(method.name + ': ' + hints[method.id], headLayers() + sensor);
        }
        return { title: method.name + ' · where the signal comes from', description: hints[method.id], art };
    }
    function method(id) { const m = hubMethods.find(x => x.id === id) || hubMethods[0]; return figure(methodDiagram(m.id), [m.source], '', 'fv-method'); }
    function methods(leftId = 'eeg', rightId = 'intracortical') { return `<div class="fv-method-pair">${method(leftId)}${method(rightId)}</div>`; }
    function signalDiagram(mode = 'signals') {
        if (mode === 'interfaces')
            return { title: 'From tissue to samples', description: 'The electrode, reference, acquisition electronics, and timing together define the recording.', art: svg('An electrode measures voltage relative to a reference. Acquisition electronics digitize it into timestamped samples.', `<path d="M38 44 H53 V136 L46 148 L38 136Z" class="fv-probe"/>${[85, 99, 113, 127].map(y => dot(46, y, 3, 'fv-contact')).join('')}${text(17, 179, 'Electrode')}${arrow(62, 96, 135, 96)}${box(140, 66, 76, 61, ['ADC'])}${arrow(221, 96, 276, 96)}${waveform(267, 102, 0)}${text(259, 179, 'Samples')}${text(122, 214, 'Reference + clock', 'fv-muted')}${line(46, 153, 46, 205)}${line(46, 205, 115, 205)}`) };
        return { title: 'A decoder makes an estimate', description: 'Processing connects measured signals to estimated variables. Evaluate the estimate on data held out from fitting.', art: svg('Recorded traces become features, then a decoder estimates an output. Held-out data test generalization.', `${waveform(23, 75, 0)}${waveform(23, 113, 1)}${text(23, 157, 'Signal')}${arrow(101, 97, 133, 97)}${box(138, 67, 81, 60, ['Features'])}${arrow(224, 97, 258, 97)}${box(263, 67, 77, 60, ['Estimate'])}<path d="M296 133 V191 H145" class="fv-ray"/>${text(38, 219, 'Fit on training data · test separately', 'fv-muted')}`) };
    }
    function loopDiagram(stimulation = false) {
        return { title: stimulation ? 'Target, intervene, measure' : 'Feedback completes the BCI loop', description: stimulation ? 'A modeled field, neural response, and functional effect are distinct things to evaluate.' : 'A BCI translates measured activity into an action. Feedback informs the user or the system’s next adjustment.', art: svg(stimulation ? 'An intervention acts on a target. A response is measured, and the intended effect must be evaluated.' : 'Neural activity is measured and decoded into an action; feedback returns to the user or controller.', `${box(19, 31, 133, 55, stimulation ? ['Intervention'] : ['Neural activity'])}${arrow(158, 59, 201, 59)}${box(208, 31, 133, 55, stimulation ? ['Target'] : ['Decoder'])}${arrow(275, 92, 275, 153)}${box(208, 160, 133, 55, stimulation ? ['Measure response'] : ['Action'])}${arrow(201, 188, 158, 188)}${box(19, 160, 133, 55, stimulation ? ['Evaluate effect'] : ['Feedback'])}${stimulation ? '' : arrow(86, 154, 86, 93)}${text(131, 131, stimulation ? 'Evidence' : 'Closed loop', 'fv-muted')}`) };
    }
    function modelDiagram() {
        const cells = [[130, 53], [190, 59], [151, 111], [211, 124]];
        return { title: 'State assumptions, then test predictions', description: 'A model links proposed mechanisms to predicted responses. The illustration is conceptual; no simulation was run.', art: svg('Inputs enter a simplified network model. A predicted response must be compared with observations.', `${box(14, 77, 81, 56, ['Input'])}${arrow(99, 104, 117, 104)}${line(130, 53, 190, 59)}${line(130, 53, 151, 111)}${line(190, 59, 151, 111)}${line(151, 111, 211, 124)}${line(190, 59, 211, 124)}${cells.map(([x, y]) => dot(x, y, 12, 'fv-neuron')).join('')}${arrow(228, 102, 254, 102)}${waveform(262, 104, 2)}${text(116, 163, 'Circuit model')}${text(265, 163, 'Response')}${text(44, 221, 'Assumptions → predictions → tests', 'fv-muted')}`) };
    }
    function imagingDiagram() {
        return { title: 'Measurement and neural activity differ', description: 'Hemodynamic contrast and calcium fluorescence are different proxies. Their timing and interpretation follow the measurement process.', art: svg('Blood-oxygen-related contrast and calcium fluorescence are two different proxies for neural activity. Example traces illustrate different measurement processes.', `${box(15, 23, 145, 57, ['Hemodynamics'])}${box(201, 23, 144, 57, ['Fluorescence'])}<ellipse cx="82" cy="131" rx="41" ry="34" class="fv-tissue"/>${dot(68, 122, 9, 'fv-warm')}${dot(98, 141, 8)}<rect x="225" y="97" width="96" height="69" rx="8" class="fv-image-field"/>${[[243, 118], [275, 127], [300, 145]].map(([x, y]) => dot(x, y, 7)).join('')}<circle cx="275" cy="127" r="16" class="fv-roi"/>${waveform(43, 203, 1)}${waveform(237, 203, 1)}${text(34, 239, 'BOLD / fNIRS', 'fv-muted')}${text(224, 239, 'Calcium indicator', 'fv-muted')}`) };
    }
    function provenanceDiagram() {
        return { title: 'Keep the chain from data to result', description: 'Dataset identity, metadata, code, parameters, and evaluation choices make a result traceable.', art: svg('A provenance chain connects dataset identifiers, metadata, analysis code and settings, and an evaluated result.', `${box(18, 29, 136, 68, ['Dataset', 'Version & IDs'])}${arrow(160, 63, 200, 63)}${box(206, 29, 136, 68, ['Metadata', 'Units & time'])}${arrow(274, 105, 274, 145)}${box(206, 152, 136, 68, ['Workflow', 'Code & settings'])}${arrow(201, 187, 160, 187)}${box(18, 152, 136, 68, ['Result', 'Split & metric'])}`) };
    }
    function evidenceDiagram(regeneration = false) {
        if (regeneration)
            return { title: 'Three parts of a biohybrid interface', description: 'Electronics, living cells, and host tissue must integrate. Survival, signal access, and functional benefit need separate evidence.', art: svg('A biohybrid interface combines an engineered device, living cells, and host tissue; integration and function must each be evaluated.', `<rect x="27" y="66" width="42" height="109" rx="8" class="fv-probe"/>${[86, 109, 132, 155].map(y => dot(49, y, 5, 'fv-contact')).join('')}${arrow(78, 121, 119, 121)}${[[143, 91], [167, 125], [144, 155], [190, 93], [199, 157]].map(([x, y]) => dot(x, y, 12, 'fv-neuron')).join('')}${arrow(217, 121, 256, 121)}<path d="M269 78 Q290 45 318 78 T317 168 Q288 199 268 166Z" class="fv-tissue"/>${text(15, 212, 'Electronics')}${text(131, 212, 'Living cells')}${text(268, 212, 'Host tissue')}`) };
        return { title: 'Performance is one part of evidence', description: 'Technical performance, functional outcomes, and user experience answer different questions. Feasibility alone does not establish effectiveness.', art: svg('Three separate evidence areas: technical function, meaningful task performance, and user experience. Evidence is connected to a defined intended use.', `${box(108, 23, 145, 51, ['Intended use'])}${line(180, 81, 180, 110)}${line(68, 110, 292, 110)}${line(68, 110, 68, 134)}${line(180, 110, 180, 134)}${line(292, 110, 292, 134)}${box(18, 139, 101, 65, ['Technical', 'function'])}${box(130, 139, 101, 65, ['Task', 'outcome'])}${box(242, 139, 101, 65, ['User', 'experience'])}${text(61, 236, 'Distinct questions · linked evidence', 'fv-muted')}`) };
    }
    function diagram(id) {
        if (id === 'interfaces' || id === 'signals')
            return signalDiagram(id);
        if (id === 'bci' || id === 'stimulation')
            return loopDiagram(id === 'stimulation');
        if (id === 'neuroai')
            return { title: 'Map → model → action → test', description: 'Anatomy, assumed dynamics, a task interface and independent validation are separate layers of a NeuroAI system.', art: NeuroAI.art('models') };
        if (id === 'computation')
            return modelDiagram();
        if (id === 'behavior')
            return { title: 'Two views can recover a third dimension', description: 'Match keypoints across calibrated, synchronized cameras. Reprojection checks compare the reconstruction with the original images.', art: poseArt() };
        if (id === 'imaging')
            return imagingDiagram();
        if (id === 'translation' || id === 'regeneration')
            return evidenceDiagram(id === 'regeneration');
        return provenanceDiagram();
    }
    function topic(id) { return figure(diagram(id), topicRefs(id), '', 'fv-topic'); }
    function learning(id) {
        const path = hubLearningPaths.find(p => p.id === id);
        if (!path)
            return '';
        const topicId = { eeg: 'signals', spikes: 'interfaces', motion: 'behavior', model: 'computation', calcium: 'imaging', 'stimulation-model': 'stimulation', neuroai: 'neuroai', connectome: 'neuroai' };
        const d = diagram(topicId[id] || 'data');
        const steps = `<ol class="fv-roadmap">${path.steps.map(([resource, title], i) => {
            const r = hubResources.find(r => r.id === resource);
            return `<li><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><strong>${e(title)}</strong>${r ? `<a href="${u(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.title)} ↗</a>` : ''}</div></li>`;
        }).join('')}</ol>`;
        return `<section class="fv-learning" aria-label="${e(path.title + ' visual roadmap')}">${figure(d, topicRefs(topicId[id] || 'data'))}<div class="fv-learning-steps"><span class="fv-eyebrow">YOUR PROJECT ROUTE</span>${steps}<p class="fv-outcome"><strong>Build toward</strong>${e(path.outcome)}</p></div></section>`;
    }
    function resources() {
        const cards = [['Tutorial', 'Learn a method', 'Follow a worked example.'], ['Dataset', 'Choose evidence', 'Read labels and metadata.'], ['Tool', 'Build an analysis', 'Record versions and settings.'], ['Standard', 'Package the result', 'Preserve context for reuse.']];
        return `<section class="fv-resource-map" aria-label="Choose a resource for each part of a research workflow">${figure(provenanceDiagram(), topicRefs('data'))}<div class="fv-resource-choices"><span class="fv-eyebrow">WHAT DO YOU NEED NEXT?</span>${cards.map(([type, title, note], i) => `<a href="#resources?type=${encodeURIComponent(type)}"><span class="fv-resource-number" aria-hidden="true">0${i + 1}</span><span><strong>${e(title)}</strong><small>${e(note)}</small></span><b aria-hidden="true">↗</b></a>`).join('')}</div></section>`;
    }
    function glossary() {
        const groups = [{ label: 'Measure', terms: ['EEG', 'ECoG', 'LFP', 'fMRI', 'ΔF/F'] }, { label: 'Interpret', terms: ['Decoder', 'Spike sorting', 'Cross-validation', 'Data leakage'] }, { label: 'Act & evaluate', terms: ['BCI', 'Closed loop', 'Neuromodulation', 'Endpoint'] }];
        return `<section class="fv-glossary-map" aria-label="Concept map: measurement, interpretation, and action"><div class="fv-glossary-heading"><span class="fv-eyebrow">FOLLOW THE CONCEPTS</span><h2>A measurement becomes an estimate.<br>An estimate informs an action.</h2><p>Choose a term to find its definition.</p></div><div class="fv-concept-lanes">${groups.map((g, i) => `<div class="fv-concept-lane"><span class="fv-concept-step" aria-hidden="true">0${i + 1}</span><h3>${e(g.label)}</h3><div>${g.terms.filter(t => hubGlossary.some(x => x[0] === t)).map(t => `<a href="#glossary?q=${encodeURIComponent(t)}">${e(t)}</a>`).join('')}</div></div>`).join('')}</div></section>`;
    }
    function lab(profile) {
        const hay = [...profile.methods, ...profile.signals].join(' ').toLowerCase();
        const modality = /\bfmri\b|functional magnetic resonance/.test(hay) ? 'fmri' : /\bfnirs\b|near.infrared spectroscopy/.test(hay) ? 'fnirs' : /\bmeg\b|magnetoencephal/.test(hay) ? 'meg' : /\beeg\b|electroencephal/.test(hay) ? 'eeg' : /\becog\b|electrocortic/.test(hay) ? 'ecog' : /calcium imaging|calcium fluorescence/.test(hay) ? 'calcium' : /intracortical|extracellular recording|silicon probe/.test(hay) ? 'intracortical' : /pose estimation|motion capture|triangulation/.test(hay) ? 'pose' : '';
        const themeMap = { 'Neural interfaces': 'interfaces', 'Neural decoding': 'signals', 'Neuromodulation': 'stimulation', 'Neuroimaging': 'imaging', 'Rehabilitation & prosthetics': 'signals', 'Bioelectronics': 'interfaces', 'Computational neuroscience': 'computation' };
        const topicId = themeMap[profile.themes[0]] || 'data';
        const d = modality ? methodDiagram(modality) : diagram(topicId);
        const sourceRefs = modality ? [hubMethods.find(m => m.id === modality).source] : topicRefs(topicId);
        const chips = profile.signals.slice(0, 3).map(s => `<span>${e(s)}</span>`).join('');
        return figure({ ...d, description: 'A general explanation of this research method. ' + d.description }, sourceRefs, `<div class="fv-lab-signals"><span>Signals in this profile</span><div>${chips}</div></div>`, 'fv-lab');
    }
    return { methods, method, topic, learning, resources, glossary, lab };
})();
