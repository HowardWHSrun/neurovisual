// Global Neurotechnology Atlas — i18n engine + UI strings + structural labels.
// This file defines the global `I18N` object used by app.ts, and is loaded
// before the data modules so that the language is resolved before first paint.

var I18N = (function () {
  var STORE_KEY = 'na-lang';
  var lang: 'en' | 'zh' = 'en';

  function detectInitial(): 'en' | 'zh' {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
      var nav = (navigator.language || navigator.languages[0] || 'en').toLowerCase();
      return nav.indexOf('zh') === 0 ? 'zh' : 'en';
    } catch (e) { return 'en'; }
  }
  lang = detectInitial();

  // ---------------------------------------------------------------------------
  // UI strings (chrome): key -> { en, zh }
  // ---------------------------------------------------------------------------
  var S: { [k: string]: { en: string; zh: string } } = {
    kicker:            { en: 'Global neuroengineering field atlas', zh: '全球神经工程领域图谱' },
    title:             { en: 'Global neurotechnology atlas', zh: '全球神经技术图谱' },
    subtitle:          { en: 'Browse the field as a map: color marks technology families, position shows access and maturity, and node size reflects mapped organizations. Open details only when you need them.', zh: '以地图方式浏览这一领域：颜色标示技术家族，位置体现接入途径与成熟度，节点大小反映已收录的机构数量。需要时再展开详情。' },
    asofPrefix:        { en: 'Curated through', zh: '数据更新至' },
    asofSuffix:        { en: 'build', zh: '构建' },

    searchPlaceholderAtlas:    { en: 'Search technology, signal, purpose...', zh: '搜索技术、信号、用途……' },
    searchPlaceholderProjects: { en: 'Search projects, organizations, place, technology, or study model...', zh: '搜索项目、机构、地点、技术或研究模型……' },
    searchPlaceholderMap:      { en: 'Search technology, signal, purpose, organization, or study model...', zh: '搜索技术、信号、用途、机构或研究模型……' },
    searchPlaceholderResearchers:{ en: 'Search researcher, institution, milestone, or method...', zh: '搜索研究者、机构、里程碑或方法……' },
    searchPlaceholderFrontier: { en: 'Search frontier title, source, topic, or researcher...', zh: '搜索前沿标题、来源、主题或研究者……' },
    searchPlaceholderFit:      { en: 'Use the three fit choices below...', zh: '使用下方的三项匹配选择……' },
    searchPlaceholderJobs:     { en: 'Search open roles, employer, location, or function...', zh: '搜索在招职位、雇主、地点或职能……' },
    searchPlaceholderRoleGuide:{ en: 'Search role, skill, or work style...', zh: '搜索岗位、技能或工作方式……' },
    searchPlaceholderOpportunities:{ en: 'Search program, organization, eligibility, funding, focus, or deadline...', zh: '搜索项目、机构、资格、资助、方向或截止日期……' },
    searchPlaceholderPathways: { en: 'Search program, institution, location, or focus...', zh: '搜索项目、机构、地点或方向……' },

    sortCapital:  { en: 'Most disclosed capital', zh: '已披露资金最多' },
    sortEmployees:{ en: 'Most workers / team members', zh: '团队人数最多' },
    sortTrials:   { en: 'Most registered trials', zh: '注册试验最多' },
    sortName:     { en: 'Name A–Z', zh: '名称 A–Z' },

    filterToggle: { en: 'Filters', zh: '筛选' },
    filterToggleCount: { en: 'Filters · ', zh: '筛选 · ' },
    clearFilters: { en: 'Clear active filters', zh: '清除当前筛选' },

    viewTechnologies: { en: 'Technologies', zh: '技术' },
    viewOrganizations:{ en: 'Organizations & projects', zh: '机构与项目' },
    viewResearchers:  { en: 'Researcher trails', zh: '研究者轨迹' },
    viewFrontier:     { en: 'Frontier weekly', zh: '每周前沿' },
    viewPathways:     { en: 'Study & careers', zh: '学业与职业' },
    viewMilestones:   { en: 'Milestones', zh: '里程碑' },

    familyAll:  { en: 'All families', zh: '全部家族' },
    purposeAll: { en: 'All purposes', zh: '全部用途' },
    purposeMedical:  { en: 'Medical', zh: '医疗' },
    purposeResearch: { en: 'Research', zh: '科研' },
    purposePersonal: { en: 'Personal', zh: '个人' },
    operationAll:   { en: 'Read + write', zh: '读取 + 写入' },
    operationRead:  { en: 'Read', zh: '读取' },
    operationWrite: { en: 'Write', zh: '写入' },
    operationClosed:{ en: 'Closed loop', zh: '闭环' },
    operationModel: { en: 'Model / compute', zh: '模型 / 计算' },
    regionAll: { en: 'All regions', zh: '全部地区' },
    kindAll:   { en: 'All organization types', zh: '全部机构类型' },
    modelAll:  { en: 'All study models', zh: '全部研究模型' },

    kindIndustry:   { en: 'Industry · startups + companies', zh: '产业 · 初创与公司' },
    kindAcademic:   { en: 'University research', zh: '高校科研' },
    kindIndependent:{ en: 'Independent · public · open', zh: '独立 · 公共 · 开放' },

    paperTrail: { en: 'Professor paper trail', zh: '教授论文脉络' },

    plotHeadingAtlas:      { en: 'Neurotechnology field map', zh: '神经技术领域地图' },
    plotCaptionAtlas:      { en: 'X access · Y maturity · color family · size mapped organizations', zh: 'X 接入途径 · Y 成熟度 · 颜色家族 · 大小已收录机构' },

    orgModeMap:     { en: 'Field map', zh: '领域地图' },
    orgModeRanked:  { en: 'Ranked projects', zh: '排名项目' },
    orgClear:       { en: 'Clear selection', zh: '清除选择' },
    sizeBy:         { en: 'Size by', zh: '尺寸依据' },
    orgWeighted:    { en: 'Linked organizations', zh: '关联机构' },
    orgEqual:       { en: 'Equal cells', zh: '等尺寸单元格' },
    orgUiLabel:     { en: 'Select a field section or technology to open its ranked projects.', zh: '选择领域分区或技术，即可查看相关项目排名。' },

    spaceShowEntities: { en: 'Show organizations', zh: '显示机构' },
    spaceHideEntities: { en: 'Hide organizations', zh: '隐藏机构' },
    spaceFocus:        { en: 'Focus selected', zh: '聚焦选中项' },
    spaceShowAll:      { en: 'Show all', zh: '显示全部' },
    spaceAsk:          { en: 'Ask about this view', zh: '询问此视图' },
    spaceAskCopy:      { en: 'Copy analysis prompt', zh: '复制分析提示词' },

    legendTitle:     { en: 'Legend & reading guide', zh: '图例与阅读指南' },
    legendTechCell:  { en: 'Technology cell', zh: '技术单元格' },
    legendUniversity:{ en: 'University', zh: '高校' },
    legendCompany:   { en: 'Company', zh: '公司' },
    legendIndependent:{ en: 'Independent / public', zh: '独立 / 公共' },
    legendCellArea:  { en: 'Cell area = linked organizations', zh: '单元格面积 = 关联机构数' },
    legendFamilyColor:{ en: 'Technology family color', zh: '技术家族颜色' },
    familyRecord:    { en: 'Record', zh: '记录' },
    familyStimulate: { en: 'Stimulate', zh: '刺激' },
    familyRestore:   { en: 'Restore', zh: '恢复' },
    familyCompute:   { en: 'Decode', zh: '解码' },
    familyRegenerate:{ en: 'Regenerate', zh: '再生' },
    familyPersonal:  { en: 'Personal', zh: '个人' },
    axisGuide1Title: { en: '1 · FIELD SECTIONS', zh: '1 · 领域分区' },
    axisGuide1Text:  { en: 'colored blocks group technologies by what they do', zh: '彩色色块按功能对技术进行分组' },
    axisGuide2Title: { en: '2 · TECHNOLOGY BOXES', zh: '2 · 技术方格' },
    axisGuide2Text:  { en: 'each box is a technology; larger boxes have more linked organizations', zh: '每个方格是一项技术；方格越大关联机构越多' },
    axisGuide3Title: { en: '3 · EXPLORE', zh: '3 · 探索' },
    axisGuide3Text:  { en: 'hover for an explanation, click a section or box to rank its projects', zh: '悬停查看说明，点击分区或方格对其项目进行排名' },

    coverageNoteTitle: { en: 'Coverage note', zh: '覆盖范围说明' },
    coverageNoteText:  { en: 'UNESCO reports roughly 1,400 neurotech companies under a broad definition. This direct-source index is a living research map, not a literal census; regional, language, stealth-company, and inactive-project gaps remain.', zh: '联合国教科文组织（UNESCO）按宽泛定义统计约有 1,400 家神经技术公司。本直源索引是一张持续更新的研究地图，而非精确普查；仍存在地区、语言、隐身公司与停摆项目的覆盖缺口。' },

    closeDetails: { en: 'Close details', zh: '关闭详情' },
    closeAI:      { en: 'Close AI workspace', zh: '关闭 AI 工作区' },

    depth0: { en: 'Remote / no body contact', zh: '远程 / 无身体接触' },
    depth1: { en: 'Wearable / skin contact', zh: '可穿戴 / 皮肤接触' },
    depth2: { en: 'Vascular / minimally invasive', zh: '血管内 / 微创' },
    depth3: { en: 'Neural surface / macro-contact', zh: '神经表面 / 宏接触' },
    depth4: { en: 'Penetrating / cellular-scale', zh: '穿透式 / 细胞尺度' },
    stage0: { en: 'Exploratory concept', zh: '探索性概念' },
    stage1: { en: 'Preclinical evidence', zh: '临床前证据' },
    stage2: { en: 'Human feasibility', zh: '人体可行性' },
    stage3: { en: 'Deployed / cleared', zh: '已部署 / 获批' },
    stage4: { en: 'Established standard', zh: '成熟标准' },

    axisXShort0: { en: 'Remote', zh: '远程' },
    axisXShort1: { en: 'Skin', zh: '皮肤' },
    axisXShort2: { en: 'Vascular', zh: '血管' },
    axisXShort3: { en: 'Surface', zh: '表面' },
    axisXShort4: { en: 'Cellular', zh: '细胞' },
    axisXFull0: { en: 'Remote', zh: '远程' },
    axisXFull1: { en: 'Wearable / skin', zh: '可穿戴 / 皮肤' },
    axisXFull2: { en: 'Vascular', zh: '血管' },
    axisXFull3: { en: 'Cortical surface', zh: '皮层表面' },
    axisXFull4: { en: 'Penetrating', zh: '穿透' },
    axisYShort0: { en: 'Explore', zh: '探索' },
    axisYShort1: { en: 'Preclinical', zh: '临床前' },
    axisYShort2: { en: 'Human', zh: '人体' },
    axisYShort3: { en: 'Deployed', zh: '部署' },
    axisYShort4: { en: 'Standard', zh: '标准' },
    axisXTitleShort:{ en: 'Access: right = closer to tissue', zh: '接入：越靠右越接近组织' },
    axisXTitleFull: { en: 'Access route / tissue proximity · farther right = closer to tissue', zh: '接入途径 / 组织接近度 · 越靠右越接近组织' },
    axisYTitleShort:{ en: 'Curated stage: up = established', zh: '精选阶段：越靠上越成熟' },
    axisYTitleFull: { en: 'Translation stage (curated) · farther up = more mature', zh: '转化阶段（精选）· 越靠上越成熟' },
    axisYear: { en: 'Year', zh: '年份' },


    fieldSection: { en: 'Field section', zh: '领域分区' },
    technologiesWord: { en: 'technologies', zh: '项技术' },
    orgsShort: { en: 'orgs', zh: '个机构' },
    linkedOrganizations: { en: 'linked organizations', zh: '个关联机构' },
    mappedOrganizations: { en: 'mapped organizations', zh: '个已收录机构' },
    clickRankSection: { en: 'Click to rank projects in this section', zh: '点击对此分区的项目排名' },
    equalSizeMode:  { en: 'equal-size mode', zh: '等尺寸模式' },
    areaWeighted:   { en: 'area weighted by linked organizations', zh: '面积按关联机构加权' },
    clickRankTech:  { en: 'Click to rank projects linked to this technology', zh: '点击对关联此技术的项目排名' },
    regionLayer:    { en: 'region layer', zh: '地区层级' },
    linkedTechnologies: { en: 'linked technologies', zh: '个关联技术' },

    profileGroupSep: { en: '·', zh: '·' },

    // Detail (technology) panel
    detailInterface: { en: 'Interface', zh: '接入界面' },
    detailSignal:    { en: 'Signal', zh: '信号' },
    detailSpatial:   { en: 'Spatial', zh: '空间' },
    detailTemporal:  { en: 'Temporal', zh: '时间' },
    detailHorizon:   { en: 'Use horizon', zh: '使用周期' },
    detailPurpose:   { en: 'Purpose', zh: '用途' },
    detailMethodSection:   { en: 'Method, evidence & limits', zh: '方法、证据与局限' },
    detailMethod:    { en: 'Method and mechanism', zh: '方法与机制' },
    detailEvidence:  { en: 'Evidence and readiness', zh: '证据与就绪度' },
    detailWhy:       { en: 'Why it matters', zh: '为什么重要' },
    detailHard:      { en: 'Hard problem', zh: '难题' },
    detailExamplesSection:{ en: 'Examples & evidence links', zh: '示例与证据链接' },
    detailExamples:  { en: 'Methods, systems, and examples', zh: '方法、系统与示例' },
    detailPaperTrail:{ en: 'Professor paper trail', zh: '教授论文脉络' },
    detailEvidenceLinks:{ en: 'Evidence links', zh: '证据链接' },
    detailProjectsSection:{ en: 'Projects & nearby technologies', zh: '项目与邻近技术' },
    detailConnectedProjects:{ en: 'Connected projects & organizations · ', zh: '关联项目与机构 · ' },
    detailBrowseAll: { en: 'Browse all', zh: '浏览全部' },
    detailNearby:    { en: 'Nearby technologies', zh: '邻近技术' },
    askUnpack:       { en: 'Ask Codex to unpack this', zh: '让 Codex 深入解析' },
    askCopyLearning: { en: 'Copy learning prompt', zh: '复制学习提示词' },
    askCopyResearch:{ en: 'Copy research prompt', zh: '复制研究提示词' },
    askResearchThis:{ en: 'Ask Codex to research this effort', zh: '让 Codex 研究此项目' },
    askDeepen:       { en: 'Ask Codex to deepen this trail', zh: '让 Codex 深化此轨迹' },
    askCopyDeepen:   { en: 'Copy deeper-research prompt', zh: '复制深度研究提示词' },
    askAssess:       { en: 'Ask Codex to assess this result', zh: '让 Codex 评估此结果' },
    askCopyAssess:   { en: 'Copy assessment prompt', zh: '复制评估提示词' },
    askRolePlan:     { en: 'Ask Codex for a role plan', zh: '让 Codex 制定岗位计划' },
    askCopyRolePlan: { en: 'Copy role-planning prompt', zh: '复制岗位规划提示词' },
    askFit:          { en: 'Ask Codex to assess fit', zh: '让 Codex 评估匹配度' },
    askCopyFit:      { en: 'Copy fit-assessment prompt', zh: '复制匹配度评估提示词' },
    askBuildPlan:    { en: 'Ask Codex to build my plan', zh: '让 Codex 制定我的计划' },
    askCopyPlan:     { en: 'Copy a personalized planning prompt', zh: '复制个性化规划提示词' },

    // Organization detail / entity page
    disclosedCapital: { en: 'Disclosed capital', zh: '已披露资金' },
    workersTeam:      { en: 'Workers / team', zh: '团队人数' },
    registeredTrials: { en: 'Registered trials', zh: '注册试验' },
    directLeadSponsor:{ en: 'direct lead sponsor', zh: '直接申办方' },
    profileScope:     { en: 'Profile & metric scope', zh: '档案与指标范围' },
    institutionLabel: { en: 'Institution', zh: '所属机构' },
    locationLabel:    { en: 'Location', zh: '地点' },
    regionLabel:      { en: 'Region', zh: '地区' },
    typeLabel:        { en: 'Type', zh: '类型' },
    scopeUncertainty: { en: 'Scope and uncertainty', zh: '范围与不确定性' },
    whyMethods:       { en: 'Why, methods & focus', zh: '动机、方法与方向' },
    whyItMatters:     { en: 'Why it matters', zh: '为什么重要' },
    methodsApproach:  { en: 'Methods and approach', zh: '方法与路径' },
    researchFocus:    { en: 'Research focus', zh: '研究方向' },
    connectionsSources:{ en: 'Connections & sources', zh: '关联与来源' },
    connectedTech:    { en: 'Connected technologies · ', zh: '关联技术 · ' },
    officialSource:   { en: 'Official source', zh: '官方来源' },
    officialPage:     { en: 'Official page', zh: '官方页面' },
    metricSources:    { en: 'Quantitative metric sources', zh: '量化指标来源' },
    connectedEvidence:{ en: 'Connected evidence', zh: '关联证据' },

    tabOverview: { en: 'Overview', zh: '概览' },
    tabWork:     { en: 'Work & methods', zh: '工作与方法' },
    tabScale:    { en: 'Scale & evidence', zh: '规模与证据' },
    tabSources:  { en: 'Sources', zh: '来源' },
    methodsApproachLabel:{ en: 'Methods and approach', zh: '方法与路径' },
    researchProductFocus:{ en: 'Research and product focus', zh: '研究与产品方向' },
    connectedTechnologies:{ en: 'Connected technologies · ', zh: '关联技术 · ' },
    scaleIntro:  { en: 'These are disclosed, source-specific figures—not estimates of total company value, scientific quality, or clinical efficacy.', zh: '以下为已披露、有来源的具体数字——并非对公司总价值、科研质量或临床疗效的估计。' },
    capitalMeasure:   { en: 'Capital measure', zh: '资金口径' },
    workforceMeasure: { en: 'Workforce measure', zh: '团队口径' },
    trialMeasure:     { en: 'Trial measure', zh: '试验口径' },
    noReliableFigure:{ en: 'No reliable figure', zh: '暂无可靠数字' },
    reportedTeam:    { en: 'Reported team or workforce', zh: '已报告的团队规模' },
    noReliableCount: { en: 'No reliable count', zh: '暂无可靠计数' },
    directLeadSponsorRegistrations:{ en: 'Direct lead-sponsor registrations', zh: '直接申办方注册数' },
    readMeasurementScope:{ en: 'Read the measurement scope and uncertainty', zh: '阅读测量范围与不确定性' },
    primaryOrgSource:{ en: 'Primary organization source', zh: '机构主来源' },
    quantitativeSources:{ en: 'Quantitative sources', zh: '量化来源' },
    noQuantSource:   { en: 'No separately verified quantitative source is mapped yet.', zh: '尚未收录单独核实的量化来源。' },
    connectedResearchEvidence:{ en: 'Connected research evidence · ', zh: '关联研究证据 · ' },
    whyItExists:     { en: 'Why it exists', zh: '为何存在' },
    organizationType:{ en: 'Organization type', zh: '机构类型' },
    backToFieldMap:  { en: 'Back to field map', zh: '返回领域地图' },
    backToTechnology:{ en: 'Back to technology', zh: '返回技术' },
    backToOrganizations:{ en: 'Back to organizations', zh: '返回机构列表' },
    aiWorkspace:     { en: 'AI research workspace', zh: 'AI 研究工作区' },
    aiChooseTask:    { en: 'Choose a task, then edit the request', zh: '选择任务，然后编辑请求' },
    aiPromptLabel:   { en: 'Prompt', zh: '提示词' },
    aiQuickBrief:    { en: 'Quick brief', zh: '快速简报' },
    aiDeepResearch:  { en: 'Deep research', zh: '深度研究' },
    aiCompare:       { en: 'Compare', zh: '对比' },
    aiGenerateCodex: { en: 'Generate with Codex', zh: '使用 Codex 生成' },
    aiGenerateHere:  { en: 'Generate here', zh: '在此生成' },
    aiCopyChatgpt:   { en: 'Copy + open ChatGPT', zh: '复制并打开 ChatGPT' },
    aiCopyPrompt:    { en: 'Copy prompt', zh: '复制提示词' },
    aiPrivacy:       { en: 'Your request is sent only after you click. Secure in-page generation requires a server endpoint; API keys are never stored in this page.', zh: '只有在你点击后才会发送请求。页内安全生成需要服务器端点；API 密钥绝不会存储于本页面。' },
    aiToggle:        { en: 'Use AI on this profile', zh: '在此档案上使用 AI' },
    aiHide:          { en: 'Hide AI workspace', zh: '隐藏 AI 工作区' },
    oneLayer:        { en: 'One layer at a time · official sources open separately', zh: '一次一层 · 官方来源单独打开' },
    officialSite:    { en: 'Official site', zh: '官方网站' },
    orgProfile:      { en: 'Organization profile', zh: '机构档案' },
    layeredDetail:   { en: 'layered detail', zh: '分层详情' },

    copyPromptCopied:      { en: 'Prompt copied. You can paste it into any AI tool.', zh: '提示词已复制，可粘贴到任意 AI 工具。' },
    copyPromptChatgpt:     { en: 'Prompt copied. Paste it into ChatGPT to generate the report.', zh: '提示词已复制，粘贴到 ChatGPT 即可生成报告。' },
    writePromptFirst:      { en: 'Write a prompt first.', zh: '请先填写提示词。' },
    sendingCodex:          { en: 'Sending to Codex…', zh: '正在发送给 Codex……' },
    generatingSourceAware: { en: 'Generating a source-aware response…', zh: '正在生成带来源的回复……' },
    copyingOpeningChatgpt: { en: 'Copying the prompt and opening ChatGPT…', zh: '正在复制提示词并打开 ChatGPT……' },
    openedInCodex:         { en: 'The AI research task was opened in Codex.', zh: 'AI 研究任务已在 Codex 中打开。' },
    aiServiceError:        { en: 'The AI service returned', zh: 'AI 服务返回了' },
    aiNoText:              { en: 'The AI service returned no text.', zh: 'AI 服务未返回文本。' },
    aiSynthesisDone:       { en: 'AI synthesis generated. Verify every important claim in the linked primary sources.', zh: 'AI 综合结果已生成。请对照所链接的一手来源核实每项重要论断。' },
    aiPasteChatgptTab:     { en: 'Prompt copied. Paste it into the ChatGPT tab to generate the report.', zh: '提示词已复制，粘贴到 ChatGPT 标签页生成报告。' },
    aiPasteOpenChatgpt:    { en: 'Prompt copied. Open ChatGPT and paste it to generate the report.', zh: '提示词已复制，打开 ChatGPT 并粘贴以生成报告。' },
    aiDidNotComplete:      { en: 'AI generation did not complete. The prompt is still available to copy.', zh: 'AI 生成未完成，提示词仍可复制。' },

    // Organization ranked list
    rankedProjectView: { en: 'Ranked project view', zh: '项目排名视图' },
    showAllProjects:   { en: 'Show all projects', zh: '显示全部项目' },
    howRankingsCounted:{ en: 'How rankings are counted · ', zh: '排名如何统计 · ' },
    capitalWord: { en: 'capital', zh: '资金' },
    workforceWord:{ en: 'workforce', zh: '团队' },
    trialRecordsWord:{ en: 'trial records', zh: '试验记录' },
    unknownSortLast:{ en: 'Unknown values sort last. Venture funding, grants, budgets, and market capitalization are labeled separately. Trials are registered interventional studies led by the entity, not enrollment or proof of efficacy.', zh: '未知值排最后。风险投资、拨款、预算与市值分别标注。试验指由该机构主导的注册干预性研究，而非入组数或疗效证据。' },
    studyModelLabels:{ en: 'Study-model labels:', zh: '研究模型标签：' },
    studyModelNote:{ en: 'These are discovery labels inferred from indexed descriptions, not a systematic review; open a record for its source context.', zh: '这些是根据已收录描述推断的发现型标签，并非系统综述；打开记录可查看其来源语境。' },
    rankedProjectsAria:{ en: 'Ranked projects and organizations · ', zh: '排名项目与机构 · ' },
    rankedNeurotechAria:{ en: 'Ranked neurotechnology projects and organizations', zh: '排名神经技术项目与机构' },
    noMatchingLabs: { en: 'No matching laboratories or initiatives.', zh: '没有匹配的实验室或计划。' },
    showing: { en: 'Showing', zh: '显示' },
    of: { en: 'of', zh: '/ 共' },
    tryAnotherSearch: { en: 'Try another search or filter', zh: '请尝试其他搜索或筛选条件' },
    tryAnotherFilter: { en: 'Try another filter', zh: '请尝试其他筛选条件' },
    previous: { en: 'Previous', zh: '上一页' },
    next:     { en: 'Next', zh: '下一页' },
    metricCapital: { en: 'capital', zh: '资金' },
    metricEmployees:{ en: 'workers / team', zh: '团队人数' },
    metricTrials:   { en: 'registered trials', zh: '注册试验' },
    metricType:     { en: 'Type', zh: '类型' },
    metricDisclosedCapital:{ en: 'Disclosed capital', zh: '已披露资金' },
    capitalKindFundingRaised:{ en: 'funding raised', zh: '已融资' },
    capitalKindMarketCap:{ en: 'market capitalization', zh: '市值' },
    capitalKindPublicGrants:{ en: 'public grants', zh: '公共拨款' },
    capitalKindInstitutional:{ en: 'institutional commitment / budget', zh: '机构投入 / 预算' },
    capitalKindProgram:{ en: 'program budget', zh: '项目预算' },
    capitalKindPhilanthropic:{ en: 'philanthropic funding', zh: '慈善资助' },
    capitalKindUndisclosed:{ en: 'not publicly disclosed', zh: '未公开披露' },
    asOfPrefix: { en: 'As of', zh: '截至' },
    asOfNone:   { en: 'No reliable current figure', zh: '暂无可靠的最新数字' },

    // Researchers
    timelineOrder: { en: 'Timeline order', zh: '时间顺序' },
    sortRegion:    { en: 'Region', zh: '地区' },
    sortFieldFamily:{ en: 'Field family', zh: '领域家族' },
    researcherRegion:{ en: 'Region', zh: '地区' },
    researcherSort: { en: 'Sort', zh: '排序' },
    allRegions:    { en: 'All regions', zh: '全部地区' },
    researcherTrails:{ en: 'researcher trails', zh: '位研究者轨迹' },
    researcherTrailsSub:{ en: 'International, cross-field coverage · deduplicated by researcher ID', zh: '国际跨领域覆盖 · 按研究者 ID 去重' },
    notableContributors:{ en: 'Notable contributors', zh: '重要贡献者' },
    curatedNotRanked:{ en: 'Curated, not ranked · ', zh: '精选，非排名 · ' },
    matchesWord: { en: 'match', zh: '项匹配' },
    matchesWordPlural:{ en: 'matches', zh: '项匹配' },
    searchByResearcher:{ en: 'Search by person, institution, region, method, or technology', zh: '按人物、机构、地区、方法或技术搜索' },
    noResearcherTrails:{ en: 'No researcher trails match these filters.', zh: '没有符合这些筛选条件的研究者轨迹。' },
    howTrailStarts: { en: 'How the trail starts', zh: '轨迹如何开始' },
    howTrailBegins: { en: 'How this trail begins', zh: '此轨迹如何开始' },
    profileContext: { en: 'Profile context', zh: '档案背景' },
    relatedWork:    { en: 'Related work', zh: '相关工作' },
    projectTimeline: { en: 'Project-linked timeline', zh: '项目关联时间线' },
    connectedTechnologiesTitle:{ en: 'Connected technologies', zh: '关联技术' },
    atlasLinks: { en: 'atlas links', zh: '个图谱关联' },
    officialProfile:{ en: 'Official lab or institutional profile', zh: '官方实验室或机构档案' },
    pubmedSearch:  { en: 'PubMed author search', zh: 'PubMed 作者检索' },
    coverageVerificationNote:{ en: 'Coverage and verification note', zh: '覆盖与核实说明' },
    coverageVerificationText:{ en: 'Researcher trails are selected for a direct connection to neuroengineering, neural interfaces, BCI, neuroprosthetics, neuromodulation, neuroimaging, neural data, bioelectronics, rehabilitation, or neuroethics. Professors and established principal investigators are eligible alongside emerging researchers. Each trail links to an institutional, laboratory, or program profile; literature links are provided as a discovery aid. This is a cross-field reading map, not a fame ranking or a complete CV.', zh: '研究者轨迹选取自与神经工程、神经接口、脑机接口、神经假体、神经调控、神经成像、神经数据、生物电子、康复或神经伦理有直接关联的人物。教授与资深项目负责人及新锐研究者均有资格入选。每条轨迹链接至机构、实验室或项目档案；文献链接仅作为探索辅助。这是一张跨领域阅读地图，而非名气排名或完整履历。' },

    // Frontier
    frontierPeerReviewed:{ en: 'Peer-reviewed', zh: '同行评审' },
    frontierPreprint:    { en: 'Preprint', zh: '预印本' },
    frontierTrial:       { en: 'Trial update', zh: '试验更新' },
    frontierNews:        { en: 'Institutional news', zh: '机构动态' },
    frontierAll:   { en: 'All', zh: '全部' },
    frontierPapers:{ en: 'Papers', zh: '论文' },
    frontierPreprints:{ en: 'Preprints', zh: '预印本' },
    frontierTrials:  { en: 'Trials', zh: '试验' },
    frontierNewsPl:  { en: 'News', zh: '动态' },
    noFrontierItems: { en: 'No frontier items match this search and source type.', zh: '没有符合此搜索与来源类型的前沿条目。' },
    preprintCaution: { en: 'This manuscript is a preprint and has not yet completed peer review.', zh: '本稿件为预印本，尚未完成同行评审。' },
    trialCaution:    { en: 'A registry update shows study activity, not safety, efficacy, or a positive result.', zh: '注册更新仅显示研究活动，不代表安全性、疗效或积极结果。' },
    sourceSummary:   { en: 'Source summary', zh: '来源摘要' },
    researchersOrSponsor:{ en: 'Researchers or sponsor', zh: '研究者或申办方' },
    whyInAtlas:     { en: 'Why it appears in this atlas', zh: '为何收录于本图谱' },
    automatedTopic: { en: 'Automated topic match', zh: '自动主题匹配' },
    openOriginal:   { en: 'Open original source', zh: '打开原始来源' },
    updatedAt:      { en: 'Updated', zh: '更新于' },
    newestFirst:    { en: 'newest first', zh: '最新优先' },
    updateMethodSources:{ en: 'Update method, sources & limits', zh: '更新方法、来源与局限' },
    latestRefreshFallbacks:{ en: 'Latest refresh fallbacks: ', zh: '最近刷新回退：' },
    tryAnotherType:{ en: 'Try another search or type', zh: '请尝试其他搜索或类型' },

    // Pathways
    pathwaysReviewed: { en: 'Pathways reviewed', zh: '路径审阅于' },
    officialSourcesCurated:{ en: 'Official sources · curated, not ranked', zh: '官方来源 · 精选，非排名' },
    studyCareerStage:{ en: 'Study and career stage', zh: '学业与职业阶段' },
    stageUndergraduate:{ en: 'Undergraduate', zh: '本科' },
    stageGraduate:     { en: 'Graduate', zh: '研究生' },
    stageOpportunities:{ en: 'Programs & initiatives', zh: '项目与计划' },
    stageJobs:         { en: 'Job market', zh: '就业市场' },
    stageFit:          { en: 'Fit planner', zh: '匹配规划器' },
    studyCareerPathways:{ en: 'Study & career pathways', zh: '学业与职业路径' },
    pathwayCaption: { en: 'Programs, roles, fit criteria, and application playbooks', zh: '项目、岗位、匹配标准与申请攻略' },
    noPathwaysMatch: { en: 'No pathways match this search.', zh: '没有符合此搜索的路径。' },
    tryAnotherStage:{ en: 'Try another search or stage', zh: '请尝试其他搜索或阶段' },
    bestFit:        { en: 'Best fit', zh: '最佳匹配' },
    technicalFocus: { en: 'Technical focus', zh: '技术方向' },
    preparationCriteria:{ en: 'Preparation and criteria', zh: '准备与标准' },
    howToApply:     { en: 'How to apply', zh: '如何申请' },
    fundingReality: { en: 'Funding reality', zh: '资助现实' },
    officialProgram:{ en: 'Official program', zh: '官方项目' },
    applicationInfo:{ en: 'Application information', zh: '申请信息' },
    whatWorkIs:     { en: 'What the work actually is', zh: '工作内容到底是什么' },
    coreSkillStack: { en: 'Core skill stack', zh: '核心技能栈' },
    evidenceHelps:  { en: 'Evidence that helps an application', zh: '有助于申请的证据' },
    marketReality:  { en: 'Market reality', zh: '市场现实' },
    applyNow:       { en: 'Apply now', zh: '立即申请' },
    openLaborSource:{ en: 'Open labor source', zh: '打开劳动力来源' },
    searchCurrentRoles:{ en: 'Search current roles', zh: '搜索当前职位' },
    applicationPlaybook:{ en: 'Application playbook · ', zh: '申请攻略 · ' },
    avoidLabel:     { en: 'Avoid:', zh: '避免：' },
    programsInitiativesReviewed:{ en: 'Programs & initiatives reviewed', zh: '项目与计划审阅于' },
    officialSourcesCuratedNotRanked:{ en: 'Official sources · curated, not ranked · ', zh: '官方来源 · 精选，非排名 · ' },
    shownWord: { en: 'shown', zh: '已显示' },
    whatItOffers: { en: 'What it offers', zh: '提供内容' },
    focusArea:    { en: 'Focus area', zh: '关注领域' },
    eligibility:  { en: 'Eligibility', zh: '资格' },
    fundingWord:  { en: 'Funding', zh: '资助' },
    deadlineWord: { en: 'Deadline', zh: '截止日期' },
    applicationLink:{ en: 'Application link', zh: '申请链接' },
    programDetails:{ en: 'Program details', zh: '项目详情' },
    noOpportunities:{ en: 'No opportunities match these filters.', zh: '没有符合这些筛选条件的机会。' },
    selectOpportunity:{ en: 'Select an opportunity to inspect its details.', zh: '选择一项机会查看详情。' },
    locationFilter: { en: 'Location', zh: '地点' },
    programType:    { en: 'Program type', zh: '项目类型' },
    eligibilityFilter:{ en: 'Eligibility', zh: '资格' },
    focusAreaFilter:{ en: 'Focus area', zh: '关注领域' },
    fundingFilter:  { en: 'Funding', zh: '资助' },
    applicationStatus:{ en: 'Application status', zh: '申请状态' },
    allLocations: { en: 'locations', zh: '地点' },
    allTypes:     { en: 'types', zh: '类型' },
    allEligibility:{ en: 'eligibility', zh: '资格' },
    allFocusAreas:{ en: 'focus areas', zh: '关注领域' },
    allFunding:   { en: 'funding', zh: '资助' },
    directionalFitPlanner:{ en: 'Directional fit planner', zh: '方向匹配规划器' },
    turnInterestsShortlist:{ en: 'Turn interests into a shortlist', zh: '将兴趣转化为候选清单' },
    fitPlannerIntro:{ en: 'This matches declared interests to route tags. It does not estimate admission or hiring probability.', zh: '将已声明的兴趣与路径标签进行匹配，并不估算录取或录用概率。' },
    currentDecision:{ en: 'Current decision', zh: '当前抉择' },
    undergraduateStudy:{ en: 'Undergraduate study', zh: '本科学习' },
    graduateStudy:  { en: 'Graduate study', zh: '研究生学习' },
    jobSearch:      { en: 'Job search', zh: '求职' },
    preferredWork:  { en: 'Preferred work', zh: '偏好的工作' },
    codeAndData:    { en: 'Code & data', zh: '代码与数据' },
    circuitsDevices:{ en: 'Circuits & devices', zh: '电路与器件' },
    biologyExperiments:{ en: 'Biology & experiments', zh: '生物与实验' },
    peopleClinics:  { en: 'People & clinics', zh: '临床与人' },
    primaryGoal:    { en: 'Primary goal', zh: '主要目标' },
    discoverExplain:{ en: 'Discover & explain', zh: '发现与解释' },
    buildTranslate:{ en: 'Build & translate', zh: '构建与转化' },
    keepOptionsOpen:{ en: 'Keep options open', zh: '保持选择开放' },
    programsCompare:{ en: 'Programs to compare', zh: '可对比的项目' },
    startingPoints: { en: 'starting points', zh: '个起点' },
    rolesInvestigate:{ en: 'Roles to investigate', zh: '可调研的岗位' },
    functionMatches:{ en: 'function matches', zh: '个职能匹配' },
    matchesWordJoin:{ en: 'Matches', zh: '匹配' },
    adjacentRoute:  { en: 'Adjacent route worth comparing', zh: '值得对比的邻近路径' },
    threeChoicesShape:{ en: '3 choices shape a directional shortlist', zh: '3 项选择塑造方向候选清单' },
    openRoles: { en: 'open roles', zh: '个在招职位' },
    careerLanes:{ en: 'career lanes', zh: '个职业方向' },
    programsInitiatives:{ en: 'programs & initiatives', zh: '个项目与计划' },
    programsWord:{ en: 'programs', zh: '个项目' },

    // Jobs board
    allLevels: { en: 'All levels', zh: '全部级别' },
    allFunctions:{ en: 'All functions', zh: '全部职能' },
    allEmployers:{ en: 'All employers', zh: '全部雇主' },
    remoteOnly: { en: 'Remote only', zh: '仅远程' },
    level: { en: 'Level', zh: '级别' },
    functionLabel:{ en: 'Function', zh: '职能' },
    employer: { en: 'Employer', zh: '雇主' },
    noOpenRoles:{ en: 'No open roles match these filters.', zh: '没有符合这些筛选条件的在招职位。' },
    remote: { en: 'Remote', zh: '远程' },
    various: { en: 'Various', zh: '多地' },
    locationNotListed:{ en: 'Location not listed', zh: '未列出地点' },
    listing: { en: 'Listing', zh: '招聘信息' },
    updatedWord:{ en: 'updated', zh: '更新于' },
    applyNowPl:{ en: 'Apply now', zh: '立即申请' },
    allRolesAt:{ en: 'All roles at', zh: '的全部职位' },
    openRolesUpdated:{ en: 'Open roles updated', zh: '在招职位更新于' },
    livePostings:{ en: 'Live postings', zh: '实时职位' },
    levelsInferred:{ en: 'levels inferred from titles', zh: '级别由职位名称推断' },
    openRolesTab:{ en: 'Open roles', zh: '在招职位' },
    roleGuideTab:{ en: 'Role guide', zh: '岗位指南' },
    jobMarketMode:{ en: 'Job market mode', zh: '就业市场模式' },

    // Counts / headings
    technologiesWordPl:{ en: 'technologies', zh: '项技术' },
    mappedTechnologies:{ en: 'mapped technologies', zh: '项已收录技术' },
    organizationsHidden:{ en: 'organizations hidden', zh: '机构已隐藏' },
    projectsAndOrganizations:{ en: 'projects & organizations', zh: '个项目与机构' },
    technologyLandscape:{ en: 'Technology landscape', zh: '技术版图' },
    selectedFieldMilestones:{ en: 'Selected field milestones', zh: '领域精选里程碑' },
    clickMilestone:{ en: 'Click a milestone to open its technology', zh: '点击里程碑打开对应技术' },
    organizationProjectsRanked:{ en: 'Organizations & projects · ranked', zh: '机构与项目 · 排名' },
    organizationProjectsMap:{ en: 'Organizations & projects · field map', zh: '机构与项目 · 领域地图' },
    projectsLinkedTo:{ en: 'Projects linked to', zh: '关联项目：' },
    allMappedProjects:{ en: 'All mapped projects and organizations · sort by disclosed capital, workers, trials, or name', zh: '全部已收录项目与机构 · 按已披露资金、团队、试验或名称排序' },
    equalSizeCells:{ en: 'Equal-size cells · color = technology family · click to open ranked projects', zh: '等尺寸单元格 · 颜色 = 技术家族 · 点击打开排名项目' },
    areaLinkedOrganizations:{ en: 'Area = linked organizations · color = technology family · click to open ranked projects', zh: '面积 = 关联机构 · 颜色 = 技术家族 · 点击打开排名项目' },
    researcherTrailsCount:{ en: 'researcher trails', zh: '位研究者轨迹' },
    researcherTrailsSubCount:{ en: 'international contributors · search, filter, then follow one project-linked trail', zh: '国际贡献者 · 搜索、筛选，然后跟随一条项目关联轨迹' },
    frontierItems:{ en: 'frontier items', zh: '条前沿条目' },
    frontierWeeklyHeading:{ en: 'Frontier weekly', zh: '每周前沿' },
    frontierCaption:{ en: 'New papers, preprints, trial updates, and institutional news', zh: '新论文、预印本、试验更新与机构动态' },

    // Filter hints
    filterHintOrganizations:{ en: 'Filter by region, organization type, or study model; human labels indicate human subjects/data, while animal labels indicate model evidence inferred from indexed descriptions.', zh: '按地区、机构类型或研究模型筛选；人体标签表示人体受试者/数据，动物标签表示由已收录描述推断的模型证据。' },
    filterHintResearchers:{ en: 'Researcher filters update the roster and selected trail.', zh: '研究者筛选会更新名单与所选轨迹。' },
    filterHintLabs:{ en: 'Rankings update immediately when a filter changes.', zh: '筛选变化时排名立即更新。' },
    filterHintUniverse:{ en: 'Choosing a region or organization type automatically reveals the matching organizations.', zh: '选择地区或机构类型会自动显示匹配机构。' },
    filterHintTech:{ en: 'Technology filters update the plot immediately.', zh: '技术筛选会立即更新图表。' },

    // Study model
    modelHuman: { en: 'Human / human data', zh: '人体 / 人体数据' },
    modelMixed: { en: 'Human + animal', zh: '人体 + 动物' },
    modelRodent:{ en: 'Rodent', zh: '啮齿类' },
    modelPrimate:{ en: 'Non-human primate', zh: '非人灵长类' },
    modelPig:   { en: 'Pig / porcine', zh: '猪 / 猪科' },
    modelOtherAnimal:{ en: 'Other animal', zh: '其他动物' },
    modelUnspecified:{ en: 'Model not specified', zh: '未注明模型' },
    modelMixedShort:{ en: 'Mixed', zh: '混合' },
    modelHumanShort:{ en: 'Human', zh: '人体' },
    modelRodentShort:{ en: 'Rodent', zh: '啮齿' },
    modelNhpShort:{ en: 'NHP', zh: '灵长' },
    modelPigShort:{ en: 'Pig', zh: '猪' },
    modelAnimalShort:{ en: 'Animal', zh: '动物' },
    modelUnspecifiedShort:{ en: 'Unspecified', zh: '未注明' },
    studyModelBadgeTitle:{ en: 'Study-model label inferred from the indexed description', zh: '研究模型标签由已收录描述推断' },

    // Copy / alert
    copyPromptAlert: { en: 'Research prompt copied to your clipboard.', zh: '研究提示词已复制到剪贴板。' },
    copyPromptTitle: { en: 'Copy this AI prompt:', zh: '复制此 AI 提示词：' },

    // Language switcher
    langLabel: { en: 'Language', zh: '语言' },
    langToggleZh: { en: '中文', zh: '中文' },
    langToggleEn: { en: 'EN', zh: 'EN' },
    switchToZh: { en: '切换到中文', zh: 'Switch to Chinese' },
    switchToEn: { en: 'Switch to English', zh: '切换到英文' },

    // Axis / legend — D3 axis guides
    accessRoute: { en: 'Access route', zh: '接入途径' },
    translationStage: { en: 'Translation stage', zh: '转化阶段' },
  };

  // ---------------------------------------------------------------------------
  // Structural display maps (keyed by the underlying English key, kept stable)
  // ---------------------------------------------------------------------------
  var maps: any = {
    group: {
      record:      { en: 'Record & image', zh: '记录与成像' },
      stimulate:   { en: 'Stimulate & modulate', zh: '刺激与调控' },
      restore:     { en: 'Restore & augment', zh: '恢复与增强' },
      compute:     { en: 'Decode & close loop', zh: '解码与闭环' },
      regenerate:  { en: 'Regenerate & biohybrid', zh: '再生与生物混合' },
      personal:    { en: 'Personal & open tools', zh: '个人与开放工具' }
    },
    purpose: {
      medical: { en: 'Medical', zh: '医疗' },
      research:{ en: 'Research', zh: '科研' },
      personal:{ en: 'Personal', zh: '个人' }
    },
    op: {
      read:   { en: 'Read', zh: '读取' },
      write:  { en: 'Write', zh: '写入' },
      closed: { en: 'Closed loop', zh: '闭环' },
      model:  { en: 'Model / compute', zh: '模型 / 计算' }
    },
    frontierKind: {
      paper:    { en: 'Peer-reviewed', zh: '同行评审' },
      preprint: { en: 'Preprint', zh: '预印本' },
      trial:    { en: 'Trial update', zh: '试验更新' },
      news:     { en: 'Institutional news', zh: '机构动态' }
    },
    region: {
      'North America': { en: 'North America', zh: '北美' },
      'Europe':        { en: 'Europe', zh: '欧洲' },
      'Asia':          { en: 'Asia', zh: '亚洲' },
      'Latin America': { en: 'Latin America', zh: '拉丁美洲' },
      'Oceania':       { en: 'Oceania', zh: '大洋洲' },
      'Africa':        { en: 'Africa', zh: '非洲' },
      'Middle East':   { en: 'Middle East', zh: '中东' },
      'Global':        { en: 'Global', zh: '全球' }
    },
    kind: {
      'Initiative': { en: 'Initiative', zh: '计划' },
      'Infrastructure': { en: 'Infrastructure', zh: '基础设施' },
      'Network': { en: 'Network', zh: '网络' },
      'Governance': { en: 'Governance', zh: '治理' },
      'Clinical network': { en: 'Clinical network', zh: '临床网络' },
      'Clinical hub': { en: 'Clinical hub', zh: '临床中心' },
      'Lab': { en: 'Lab', zh: '实验室' },
      'Center': { en: 'Center', zh: '中心' },
      'Institute': { en: 'Institute', zh: '研究所' },
      'Program': { en: 'Program', zh: '项目' },
      'Startup': { en: 'Startup', zh: '初创公司' },
      'Company': { en: 'Company', zh: '公司' },
      'Open source': { en: 'Open source', zh: '开源' },
      'Consortium': { en: 'Consortium', zh: '联盟' },
      'Foundation': { en: 'Foundation', zh: '基金会' },
      'Nonprofit': { en: 'Nonprofit', zh: '非营利' },
      'Accelerator': { en: 'Accelerator', zh: '加速器' },
      'Directory': { en: 'Directory', zh: '目录' },
      'Research center': { en: 'Research center', zh: '研究中心' }
    },
    country: {
      'United States': { en: 'United States', zh: '美国' },
      'United Kingdom':{ en: 'United Kingdom', zh: '英国' },
      'Germany': { en: 'Germany', zh: '德国' },
      'France':  { en: 'France', zh: '法国' },
      'Switzerland': { en: 'Switzerland', zh: '瑞士' },
      'Netherlands': { en: 'Netherlands', zh: '荷兰' },
      'Sweden': { en: 'Sweden', zh: '瑞典' },
      'Japan':  { en: 'Japan', zh: '日本' },
      'China':  { en: 'China', zh: '中国' },
      'South Korea': { en: 'South Korea', zh: '韩国' },
      'Australia': { en: 'Australia', zh: '澳大利亚' },
      'Canada': { en: 'Canada', zh: '加拿大' },
      'Israel': { en: 'Israel', zh: '以色列' },
      'Singapore': { en: 'Singapore', zh: '新加坡' },
      'India': { en: 'India', zh: '印度' },
      'Denmark': { en: 'Denmark', zh: '丹麦' },
      'Belgium': { en: 'Belgium', zh: '比利时' },
      'Austria': { en: 'Austria', zh: '奥地利' },
      'Italy': { en: 'Italy', zh: '意大利' },
      'Spain': { en: 'Spain', zh: '西班牙' },
      'Finland': { en: 'Finland', zh: '芬兰' },
      'Norway': { en: 'Norway', zh: '挪威' },
      'European Union': { en: 'European Union', zh: '欧盟' },
      'Global': { en: 'Global', zh: '全球' }
    }
  };

  // ---------------------------------------------------------------------------
  // Engine
  // ---------------------------------------------------------------------------
  function applyLang() {
    document.documentElement.setAttribute('lang', lang);
  }

  function setLang(next: 'en' | 'zh') {
    if (next !== 'en' && next !== 'zh') return;
    if (next === lang) { applyLang(); return; }
    lang = next;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    applyLang();
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('na-i18n'));
    }
  }

  function t(key: string): string {
    var entry = S[key];
    if (!entry) return key;
    return (lang === 'zh' ? entry.zh : entry.en);
  }

  function m(mapKey: string, value: string): string {
    var dict = maps[mapKey];
    if (!dict) return value;
    var entry = dict[value];
    if (!entry) return value;
    return lang === 'zh' ? entry.zh : entry.en;
  }

  // Localized display of a keyed data field with graceful English fallback.
  // `kind` one of: tech | org | entity | researcher | pathway | metricNote
  function tr(kind: string, id: string, field: string, fallback: any): any {
    if (lang !== 'zh') return fallback;
    var dict = I18N.data && I18N.data[kind];
    var rec = dict && dict[id];
    if (rec && rec[field] !== undefined && rec[field] !== null && rec[field] !== '') return rec[field];
    return fallback;
  }

  // ---------------------------------------------------------------------------
  // Static DOM translation + language switcher
  // ---------------------------------------------------------------------------
  function translateStatic() {
    if (typeof document === 'undefined') return;
    var els = document.querySelectorAll('[data-i18n]');
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    var ph = document.querySelectorAll('[data-i18n-ph]');
    Array.prototype.forEach.call(ph, function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (key) el.setAttribute('placeholder', t(key));
    });
    var html = document.querySelectorAll('[data-i18n-html]');
    Array.prototype.forEach.call(html, function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });
    var aria = document.querySelectorAll('[data-i18n-aria]');
    Array.prototype.forEach.call(aria, function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
    syncSwitcher();
  }

  function syncSwitcher() {
    var btns = document.querySelectorAll('.na-lang [data-lang]');
    Array.prototype.forEach.call(btns, function (b) {
      var active = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('is-active', active);
      b.title = lang === 'zh' ? t('switchToEn') : t('switchToZh');
    });
  }

  function initSwitcher() {
    if (typeof document === 'undefined') return;
    document.addEventListener('click', function (e) {
      var el = e.target as HTMLElement | null;
      var target = el && el.closest ? el.closest('.na-lang [data-lang]') : null;
      if (target) {
        var next = target.getAttribute('data-lang');
        if (next === 'en' || next === 'zh') setLang(next);
      }
    });
    syncSwitcher();
  }

  function init() {
    translateStatic();
    initSwitcher();
    document.addEventListener('na-i18n', function () {
      translateStatic();
    });
  }

  applyLang();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    get lang(): 'en' | 'zh' { return lang; },
    t: t,
    setLang: setLang,
    m: m,
    tr: tr,
    maps: maps,
    strings: S,
    data: {} as any
  };
})();
