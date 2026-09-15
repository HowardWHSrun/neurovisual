// Inline atlas illustrations. These are reading aids, never measured data or
// substitutes for a paper figure. Photographs retain their verified captions.
const AtlasVisuals = (() => {
  const e=hubUtils.escapeHtml,u=hubUtils.sourceHref;
  const tx=(en:string,zh:string)=>I18N.lang==='zh'?zh:en;
  type Mode='electrode'|'field'|'imaging'|'stimulate'|'decode'|'feedback'|'tissue'|'workflow';
  const tones:Record<Mode,string>={electrode:'#26718c',field:'#387899',imaging:'#397f70',stimulate:'#a35d79',decode:'#7362a4',feedback:'#b07732',tissue:'#527d57',workflow:'#527188'};
  const labels:Record<Mode,[string,string][]>= {
    electrode:[['Neural tissue','神经组织'],['Contacts','电极触点'],['Readout','信号读出']],
    field:[['Activity','神经活动'],['Sensor','传感器'],['Signal','测量信号']],
    imaging:[['Tissue','组织'],['Acquisition','成像采集'],['Image','图像']],
    stimulate:[['Control','控制参数'],['Interface','刺激界面'],['Response','生理响应']],
    decode:[['Recordings','记录'],['Features','特征'],['Estimate','估计']],
    feedback:[['Input','输入'],['Device','装置'],['Feedback','反馈']],
    tissue:[['Material','材料'],['Cells','细胞'],['Readout','检测']],
    workflow:[['Question','问题'],['Method','方法'],['Evidence','证据']]
  };
  function mode(d:any):Mode {
    const id=d?.id||'';
    if(['calcium','voltage','neurotransmitter','twophoton','fmri','fnirs','pet','fus','clearing','connectome','cellatlas'].includes(id))return 'imaging';
    if(['eeg','hdeeg','meg','ecog','layer7','stentrode','consumer','openbci','wearable'].includes(id))return 'field';
    if(['utah','silicon','neuropixels','net','mesh','n1','connexus'].includes(id))return 'electrode';
    if(['motorbci','bionichand'].includes(id))return 'feedback';
    if(['organoid','brainoware','scaffold','living'].includes(id))return 'tissue';
    if(['dbs','icms','stimnet','corticalstim','ees','fes','vns','tes','consumertes'].includes(id))return 'stimulate';
    if(['spikesort','decoder','neuralcode','digitaltwin','neuromorphic'].includes(id))return 'decode';
    // A modality-neutral process avoids depicting optical/chemical/acoustic
    // stimulation as an implanted electrical electrode, or every BCI as a hand.
    return 'workflow';
  }
  function art(kind:Mode){
    const node=(x:number,y:number,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" class="av-dot"/>`;
    const neurons=(x:number,y:number)=>`<g transform="translate(${x} ${y})"><path d="M0 0 26 20 12 55M26 20 57 10 81 35M26 20 47 57 81 66M57 10 68-7M12 55 0 79"/>${[[0,0],[26,20],[12,55],[57,10],[81,35],[47,57],[81,66]].map(p=>node(p[0],p[1],4)).join('')}</g>`;
    const trace=(x:number,y:number)=>`<path d="M${x} ${y}h15l7-8 7 17 7-34 7 40 7-15h20"/>`;
    const arrow=(x:number,y:number)=>`<path d="M${x} ${y}h27m-7-6 7 6-7 6" class="av-arrow"/>`;
    let drawing='';
    if(kind==='electrode')drawing=`<path class="av-wash" d="M17 87Q55 62 98 86t63 0v118H17Z"/>${neurons(28,120)}<rect x="92" y="31" width="22" height="145" rx="8" class="av-device"/>${[65,91,117,143].map(y=>node(103,y,4)).join('')}<path d="M103 31V17h136v37"/><rect x="191" y="55" width="82" height="112" rx="9" class="av-device"/>${[75,93,111,129,147].map(y=>`<path d="M182 ${y}h9m82 0h9"/>`).join('')}${arrow(288,112)}${[80,116,152].map(y=>trace(326,y)).join('')}`;
    if(kind==='field')drawing=`${neurons(30,91)}<path d="M29 67q44-39 85 7M17 53q58-56 111 6M30 189q49 31 91-14m-96 31q57 37 106-11" class="av-dashed"/>${arrow(137,118)}<rect x="192" y="67" width="80" height="108" rx="10" class="av-device"/><path d="M207 82h50v24h-50Z"/><circle cx="233" cy="140" r="13"/><path d="m228 140 5-7 7 10"/>${arrow(287,118)}${trace(326,94)}${trace(326,144)}`;
    if(kind==='imaging')drawing=`<rect x="20" y="60" width="115" height="119" rx="18" class="av-wash"/>${neurons(36,89)}${arrow(147,118)}<rect x="194" y="68" width="81" height="105" rx="8" class="av-device"/><circle cx="234" cy="119" r="26"/><path d="M213 119h42m-21-21v42"/>${arrow(289,117)}${Array.from({length:25},(_,i)=>`<rect x="${330+i%5*14}" y="${80+Math.floor(i/5)*14}" width="11" height="11" rx="2" fill="currentColor" opacity="${[.17,.35,.65,.45,.85][(i*3+Math.floor(i/5))%5]}" stroke="none"/>`).join('')}`;
    if(kind==='stimulate')drawing=`<rect x="24" y="60" width="101" height="117" rx="12" class="av-device"/><path d="M42 91h64m-64 27h64m-64 27h64"/>${node(60,91)}${node(89,118)}${node(72,145)}${arrow(138,117)}<rect x="188" y="68" width="80" height="103" rx="10" class="av-device"/><circle cx="228" cy="119" r="24"/><circle cx="228" cy="119" r="9"/>${arrow(282,117)}<rect x="326" y="60" width="91" height="117" rx="12" class="av-device"/><path d="M342 80v77h59m-53-25 14-16 12 8 19-24"/>`;
    if(kind==='decode')drawing=`${[77,117,157].map(y=>trace(22,y)).join('')}${arrow(109,118)}<rect x="155" y="49" width="124" height="137" rx="12" class="av-device"/>${[[177,77],[185,90],[178,101],[205,128],[216,119],[218,139],[249,81],[256,99],[241,94]].map(p=>node(p[0],p[1],4)).join('')}<path d="m173 171 81-104" class="av-dashed"/>${arrow(291,118)}<rect x="332" y="58" width="78" height="116" rx="9" class="av-device"/><path d="M346 84h47M346 96h34M346 143h47"/><path d="m360 121 12 12 21-30"/>`;
    if(kind==='feedback')drawing=`${neurons(25,88)}${arrow(116,116)}<rect x="164" y="67" width="85" height="100" rx="10" class="av-device"/><path d="M180 91h52m-52 15h35m-35 34h52"/>${arrow(264,116)}<path d="m315 149 12-18-4-44q4-12 11 0l7 27 5-52q5-10 10 0l1 49 7-42q7-9 11 3l-3 44 10-30q9-7 11 4l-11 66-16 20h-29Z" class="av-device"/><path d="M360 188v26H64v-33m-6 7 6-7 6 7" class="av-dashed"/>`;
    if(kind==='tissue')drawing=`<path d="m23 131 66-43 60 34-67 45Z" class="av-device"/><path d="m23 145 59 34 67-44m-126 25 59 34 67-44M44 120l59 35M65 106l59 35M50 147l65-43M72 158l65-43"/>${arrow(158,118)}<path d="M203 67h75v95q-38 20-75 0Z" class="av-wash"/><ellipse cx="240" cy="68" rx="38" ry="12"/>${[[218,111],[247,91],[264,128],[236,145],[212,149]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="8" ry="6"/>`).join('')}${arrow(290,118)}${trace(331,106)}<path d="M332 153h74m-68 0v-15m16 15v-28m16 28v-44m16 44v-25"/>`;
    if(kind==='workflow')drawing=`${[27,174,321].map((x,i)=>`<rect x="${x}" y="57" width="94" height="125" rx="11" class="av-device"/><circle cx="${x+47}" cy="95" r="19" class="av-wash"/>${i===0?`<path d="M${x+40} 88q0-11 12-7t-3 18v5m0 8v2"/>`:i===1?`<path d="M${x+34} 98l9-12 9 15 9-8"/>`:`<path d="m${x+35} 95 8 8 17-20"/>`}<path d="M${x+20} 139h54m-54 14h36"/>`).join('')}${arrow(132,119)}${arrow(279,119)}`;
    return `<svg viewBox="0 0 440 235" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg>`;
  }
  function schematic(kind:Mode,title:string,detail:string,source?:{url:string;label:string},steps?:string[]){
    return `<figure class="av-visual av-schematic" style="--av-accent:${tones[kind]}"><div class="av-art">${art(kind)}</div><div class="av-stages">${(steps||labels[kind].map(x=>tx(x[0],x[1]))).map((x,i)=>`<span><b>${String(i+1).padStart(2,'0')}</b>${e(x)}</span>`).join('')}</div><figcaption><small>${tx('READING GUIDE · CONCEPTUAL SCHEMATIC','阅读辅助 · 概念示意图')}</small><strong>${e(title)}</strong><p>${e(detail)}</p>${source?.url?`<a href="${u(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.label)} ↗</a>`:''}</figcaption></figure>`;
  }
  function media(m:VisualItem,context:string){
    return `<figure class="av-visual av-photo"><button type="button" class="av-photo-open" data-visual-open="${e(m.id)}" aria-label="${e(tx('Enlarge image: ','放大图片：')+m.title)}"><span class="av-image"><img data-visual-image loading="lazy" decoding="async" src="${u(m.image.url)}" alt="${e(m.image.alt)}"><span class="av-image-fallback">${tx('Open the source to view the image','请打开原始来源查看图片')}</span></span><span class="av-enlarge">${tx('View image','查看图片')} ⤢</span></button><figcaption><small>${e(context)}</small><strong>${e(m.title)}</strong><p>${e(m.image.caption)}</p><a href="${u(m.image.source)}" target="_blank" rel="noopener noreferrer">${e(m.image.credit)} ↗</a>${m.image.license?`<a class="av-license" href="${u(m.image.license.url)}" target="_blank" rel="noopener noreferrer">${e(m.image.license.label)} ↗</a>`:''}${m.video?`<button type="button" class="av-watch" data-visual-open="${e(m.id)}" data-visual-mode="video">${tx('Watch the related film','观看相关视频')} ▷</button>`:''}</figcaption></figure>`;
  }
  function labMedia(orgId:string){const ids=neuroLabsData.labs.filter(l=>l.atlasIds.includes(orgId)).map(l=>'lab-'+l.id);return NeuroVisuals.items().find(m=>ids.includes(m.id));}
  function methodVisual(d:any){
    // Exact, supported method IDs only: FieldVisuals otherwise defaults to EEG.
    const exact:Record<string,string>={eeg:'eeg',hdeeg:'eeg',meg:'meg',ecog:'ecog',fmri:'fmri',fnirs:'fnirs',calcium:'calcium',utah:'intracortical',silicon:'intracortical',neuropixels:'intracortical',net:'intracortical',mesh:'intracortical',n1:'intracortical',connexus:'intracortical'};
    if(exact[d?.id])return FieldVisuals.method(exact[d.id]);
    // No shared implant anatomy for electrical, optical, acoustic, and chemical
    // interventions. These blocks describe the evidence process for each.
    if(d?.g==='stimulate'||d?.o==='write'||mode(d)==='stimulate')return FieldVisuals.topic('stimulation');
    if(d?.id==='seeg')return schematic('workflow',d.n,tx('Depth contacts sample intracranial potentials along selected trajectories. This acquisition flow does not depict contact geometry, cortical-surface placement, or an isolated neuron.','深部触点沿选定轨迹采集颅内电位。此采集流程不表示触点几何结构、皮层表面放置方式或单个分离神经元。'),undefined,[tx('Depth contacts','深部触点'),tx('Acquisition','信号采集'),tx('Potentials','电位')]);
    return '';
  }
  function technology(d:any,sourceLinks:any[]=[]){
    const mediaIds:Record<string,string>={utah:'company-blackrock',n1:'company-neuralink',layer7:'company-precision',connexus:'company-paradromics',stentrode:'company-synchron',net:'lab-rice-xie',stimnet:'lab-rice-luan',speechspike:'lab-stanford-nptl',speechecog:'lab-ucsf-chang',brainspine:'lab-epfl-courtine'};
    const m=mediaIds[d.id]&&NeuroVisuals.items().find(m=>m.id===mediaIds[d.id]);
    if(m)return media(m,tx('RELATED PLATFORM OR STUDY · SEE CAPTION','相关平台或研究 · 详见图注'));
    const method=methodVisual(d);if(method)return method;
    const title=d.n||d.name||tx('Method in view','方法示意');
    const signal=d.signal?tx('Signal in this record: ','本条目的信号：')+d.signal+'. ':'';
    const process=mode(d)==='workflow'?(d.o==='closed'?[tx('Measure','测量'),tx('Process','处理'),tx('Act / feedback','作用与反馈')]:d.o==='write'?[tx('Target','作用目标'),tx('Intervention','干预'),tx('Assess response','评估响应')]:undefined):undefined;
    return schematic(mode(d),title,signal+tx('Trace the measurement or intervention through the diagram. Shapes and traces are illustrative; they do not show device geometry or a measured result.','沿示意图理解测量或干预过程。形状与波形仅用于解释，不代表设备几何结构或测量结果。'),sourceLinks[0],process);
  }
  function organization(d:any,related:any[]=[]){
    const company=NeuroIdeas.companyForOrg(d.id);
    const companyImage=company&&NeuroVisuals.items().find(m=>m.id==='company-'+company.id);
    if(companyImage)return media(companyImage,tx('VERIFIED PLATFORM IMAGE · SEE CAPTION','已核实的平台图像 · 详见图注'));
    const m=labMedia(d.id);if(m)return media(m,tx('RESEARCH FROM THIS LAB','本实验室研究'));
    const t=related[0];
    const method=methodVisual(t);if(method)return method;
    return schematic(t?mode(t):'workflow',t?.n||d.n,tx('A schematic of a linked research method, not a photograph of this organization’s equipment. The adjacent description identifies its actual work.','这是关联研究方法的示意图，并非该机构设备的照片。具体工作范围见旁文。'),{url:d.u,label:tx('Organization source','机构原始来源')});
  }
  function researcher(d:any,related:any[]=[]){
    const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const labs=neuroLabsData.labs.filter(l=>l.leaders.some(n=>norm(n)===norm(d.name)));
    const m=NeuroVisuals.items().find(m=>labs.some(l=>m.id==='lab-'+l.id));
    if(m)return media(m,tx('A RESEARCH EXAMPLE FROM THIS INVESTIGATOR’S LAB','这位研究者所在实验室的研究实例'));
    const t=related[0];
    const method=methodVisual(t);if(method)return method;
    return schematic(t?mode(t):'workflow',t?.n||tx('Read the research trail','阅读研究脉络'),tx('Use this linked method to connect the researcher’s questions, instruments, and evidence. This is an explanatory sketch, not a figure from a listed paper.','以关联方法串联研究问题、仪器与证据。这是解释性示意图，并非所列论文的原图。'),{url:d.profileUrl,label:tx('Investigator profile','研究者资料')});
  }
  function frontier(d:any){
    const trial=d.kind==='trial',preprint=d.kind==='preprint';
    const stages=trial?[tx('Study design','研究设计'),tx('Recruitment','招募状态'),tx('Results?','研究结果？')]:[tx('Research question','研究问题'),tx('Method & controls','方法与对照'),tx('Result & limits','结果与局限')];
    const detail=trial?tx('Registration describes a planned study. Check outcomes, enrollment, and posted results at the source; the registry status is not an efficacy result.','注册信息描述研究计划。请核对结局指标、入组与已发布结果；注册状态不代表疗效。'):preprint?tx('Read the method, comparison, and uncertainty together. This item is a preprint; the diagram is a reading checklist, not the authors’ result.','结合方法、对照与不确定性阅读。本条目为预印本；示意图仅是阅读清单，不是作者的结果。'):tx('Follow the claim back to the study design, comparison, and measured outcome. The diagram organizes your reading; it does not recreate a paper figure.','沿着主张核对研究设计、对照与测量结果。该图用于组织阅读，并非论文原图。');
    return schematic('workflow',trial?tx('From registration to evidence','从注册到证据'):tx('Trace the claim','追溯研究主张'),detail,{url:d.sourceUrl,label:d.source},stages);
  }
  function pathway(d:any,kind:string){
    const job=kind==='job'||kind==='role';
    const steps=job?[tx('Learn the method','掌握方法'),tx('Build a project','完成项目'),tx('Show your evidence','展示证据')]:kind==='opportunity'?[tx('Check fit','核对方向'),tx('Verify eligibility','核对资格'),tx('Prepare materials','准备材料')]:[tx('Foundations','基础训练'),tx('Research practice','研究实践'),tx('Next application','下一步申请')];
    const topics=(d.skills||d.focus||[d.fn||d.lane]).filter(Boolean).slice(0,3);
    const detail=tx('Preparation sketch, not an admission or hiring guarantee. ','这是准备路径示意，不代表录取或招聘承诺。')+(topics.length?tx('Connect your work to: ','将训练与这些方向联系起来：')+topics.join(' · '):tx('Use the adjacent criteria to choose what to learn and demonstrate.','结合旁文要求，选择要学习和展示的能力。'));
    return schematic('workflow',job?tx('Turn skills into visible work','让技能变成可展示的工作'):tx('Build your route into the field','规划进入该领域的路径'),detail,{url:d.programUrl||d.url||d.sourceUrl,label:tx('Verify at the official source','在官方来源核实')},steps);
  }
  function fit(){return schematic('workflow',tx('Make the comparison concrete','将比较落到实处'),tx('Start with the work you enjoy, identify a method to practice, then build one piece of evidence for a program or role. This is a planning guide, not a fit score.','从你喜欢的工作出发，选择可练习的方法，再为目标项目或岗位制作一份能力证据。这是规划辅助，不是匹配评分。'),undefined,[tx('Interest','兴趣'),tx('Practice','实践'),tx('Evidence','证据')]);}
  function mount(container:HTMLElement,markup:string,selector:string){
    const anchor=container.querySelector<HTMLElement>(selector);if(!anchor||!markup)return;
    const pair=document.createElement('div');pair.className='av-context-pair';
    const visual=document.createElement('div');visual.className='av-context-visual';visual.innerHTML=markup;
    anchor.before(pair);pair.append(visual,anchor);anchor.classList.add('av-context-copy');
    NeuroVisuals.bind(visual);
  }
  return {technology,organization,researcher,frontier,pathway,fit,mount,mode};
})();
