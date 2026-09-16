const MilestoneExperience = (() => {
    const e = hubUtils.escapeHtml;
    const tx = (en, zh) => I18N.lang === 'zh' ? zh : en;
    let era = 'all';
    const eras = () => [
        { id: 'foundations', label: tx('Foundations', '奠基阶段'), range: '1924–1999', title: tx('Learning to listen. Beginning to intervene.', '学习记录，开始干预。'), test: (year) => year < 2000 },
        { id: 'circuits', label: tx('Circuit tools', '神经环路工具'), range: '2000–2019', title: tx('More precise tools. More possibilities.', '更精确的工具，更多的可能。'), test: (year) => year >= 2000 && year < 2020 },
        { id: 'translation', label: tx('New interfaces', '新型接口'), range: '2020–2026', title: tx('From neural signals to human interaction.', '从神经信号到人与世界的交互。'), test: (year) => year >= 2020 }
    ];
    const imageFor = { '2017:net': 'lab-rice-xie', '2023:ti': 'lab-stanford-nptl', '2025.6:connexus': 'company-paradromics' };
    function imagePanel(m, hero = false, caption = '') {
        return `<figure class="ms-image ${hero ? 'ms-hero-image' : ''}"><button type="button" data-visual-open="${e(m.id)}" aria-label="${e(tx('Enlarge image: ', '放大图片：') + m.title)}">${NeuroVisuals.picture(m, hero)}<span class="ms-enlarge" aria-hidden="true">⤢</span></button><figcaption><span>${e(hero ? tx('2023 · Speech & expression through an avatar', '2023 · 通过虚拟形象表达语言与表情') : caption || tx('Related research image · view caption', '相关研究图片 · 查看图注'))}</span><a href="${hubUtils.sourceHref(m.image.source)}" target="_blank" rel="noopener noreferrer">${e(m.image.credit)} ↗</a></figcaption></figure>`;
    }
    function render(host, milestones, allMilestones, technologies, groups, selected, detailOpen, activate) {
        const allCount = allMilestones.length;
        const media = NeuroVisuals.items();
        const hero = media.find(m => m.id === 'lab-ucsf-chang');
        const sections = eras();
        const visible = milestones.filter(m => era === 'all' || sections.find(section => section.id === era).test(m.year));
        const first = Math.floor(Math.min(...allMilestones.map(m => m.year)));
        const last = Math.floor(Math.max(...allMilestones.map(m => m.year)));
        const count = host.closest('#neurotech-atlas-2026')?.querySelector('.na-count');
        if (count)
            count.textContent = visible.length + tx(' of ', ' / ') + allCount + ' ' + tx('Milestones', '项里程碑');
        const cards = (entries) => entries.map(m => {
            const t = technologies.find(t => t.id === m.id);
            const image = media.find(image => image.id === imageFor[m.year + ':' + m.id]);
            const label = t.n;
            const caption = m.year === 2017 ? tx('2020 concept illustration · related NET research', '2020 年概念图 · 相关 NET 研究') : m.year === 2023 ? tx('2023 speech-BCI study · Stanford', '2023 年语音脑机接口研究 · 斯坦福大学') : tx('Connexus platform image · related context', 'Connexus 平台图片 · 相关背景');
            return `<li class="ms-entry" style="--ms-accent:${groups[t.g].color}"><div class="ms-date"><time datetime="${Math.floor(m.year)}">${Math.floor(m.year)}</time><span aria-hidden="true"></span></div><article class="ms-card ${image ? 'ms-has-image' : ''}"><div class="ms-card-copy"><span class="ms-family">${e(groups[t.g].name)}</span><h3>${e(m.title)}</h3><p>${e(label)}</p><button type="button" class="ms-open" data-milestone-tech="${e(m.id)}" data-milestone-key="${e(m.year + ':' + m.id)}" aria-pressed="${detailOpen && selected === m.id}">${tx('Explore the technology', '探索相关技术')} <span aria-hidden="true">↗</span></button></div>${image ? imagePanel(image, false, caption) : ''}</article></li>`;
        }).join('');
        host.innerHTML = `<header class="ms-hero"><div class="ms-hero-copy"><span class="ms-eyebrow">${tx('A CHRONOLOGY OF NEUROENGINEERING', '神经工程发展年表')}</span><h2>${tx('A century of ways<br>into the brain.', '跨越百年，<br>走进大脑。')}</h2><p>${tx('Follow the discoveries, tools, and interfaces that changed how we study and interact with the nervous system.', '沿着关键发现、研究工具与神经接口，了解我们如何探索并与神经系统交互。')}</p><div class="ms-span"><span>${first}</span><i aria-hidden="true"></i><span>${last}</span><small>${allCount} ${tx('selected milestones', '项精选里程碑')}</small></div></div>${hero ? imagePanel(hero, true) : ''}</header><div class="ms-navigation"><div class="ms-era-tabs" role="group" aria-label="${tx('Filter milestones by era', '按时代筛选里程碑')}"><button type="button" data-ms-era="all" aria-pressed="${era === 'all'}">${tx('All years', '全部年份')} <span>${milestones.length}</span></button>${sections.map(section => `<button type="button" data-ms-era="${section.id}" aria-pressed="${era === section.id}">${section.label}<small>${section.range}</small></button>`).join('')}</div><p>${tx('Read in chronological order. Spacing is not a measure of elapsed time.', '按年份排列；条目间距不代表时间间隔。')}</p></div><div class="ms-results" role="status">${visible.length} ${tx('milestones shown', '项里程碑')}</div><div class="ms-chronology">${sections.filter(section => era === 'all' || era === section.id).map((section) => {
            const entries = visible.filter(m => section.test(m.year));
            return entries.length ? `<section class="ms-era-section"><header class="ms-era-heading"><span>${section.range}</span><div><small>${section.label}</small><h2>${section.title}</h2></div></header><ol class="ms-entries">${cards(entries)}</ol></section>` : '';
        }).join('') || `<div class="ms-empty"><h2>${tx('No milestones in this selection', '当前筛选没有里程碑')}</h2><p>${tx('Try another era, a shorter search, or clear the atlas filters.', '请尝试其他时代、简化搜索词，或清除筛选条件。')}</p></div>`}</div><footer class="ms-footer"><span>${tx('Keep following the story', '继续探索')}</span><a href="#researchers">${tx('Meet the researchers', '认识研究者')} ↗</a><a href="#visuals">${tx('Explore pictures & films', '浏览图片与视频')} ↗</a></footer>`;
        host.querySelectorAll('[data-ms-era]').forEach(button => button.addEventListener('click', () => {
            era = button.dataset.msEra;
            render(host, milestones, allMilestones, technologies, groups, selected, detailOpen, activate);
            host.querySelector(`[data-ms-era="${era}"]`)?.focus({ preventScroll: true });
        }));
        host.querySelectorAll('[data-milestone-tech]').forEach(button => button.addEventListener('click', () => activate(button.dataset.milestoneTech, button.dataset.milestoneKey)));
        NeuroVisuals.bind(host);
    }
    return { render };
})();
