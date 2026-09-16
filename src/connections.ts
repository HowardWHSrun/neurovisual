interface ConnectionNode {id:string;name:string;kind:'Person'|'Lab'|'Company'|'Technology'|'Institution'|'Program';subtitle:string;summary:string;href?:string;aliases?:string[];media?:string;image?:VisualImage;researcherId?:string;country?:string;}
interface ConnectionEdge {id:string;from:string;to:string;label:string;category:'people'|'technology'|'translation';basis:'documented'|'comparison';date:string;detail:string;limit?:string;sources:{title:string;url:string}[];relationshipType?:'affiliation';affiliationStatus?:'current'|'emeritus'|'historical';role?:string;reviewed?:string;}
interface ConnectionStory {id:string;title:string;deck:string;focus:string;trail:string[];edges:string[];}
declare var neuroConnectionsData:{reviewed:string;nodes:ConnectionNode[];edges:ConnectionEdge[];stories:ConnectionStory[]};

const ConnectionEvidence=(()=>{
 const e=hubUtils.escapeHtml,u=hubUtils.sourceHref,d=neuroConnectionsData;
 const node=(id:string)=>d.nodes.find(n=>n.id===id);
 function incident(id:string){return d.edges.filter(x=>x.from===id||x.to===id);}
 function evidence(x:ConnectionEdge|undefined){
  if(!x)return `<section class="cn-evidence"><span class="eyebrow">RELATIONSHIP EVIDENCE</span><h2>No links in this lens.</h2><p>Choose “All connections” to see this entry’s documented relationships.</p></section>`;
  return `<section class="cn-evidence" id="cn-evidence" tabindex="-1"><div class="cn-evidence-head"><span class="eyebrow">${x.basis==='comparison'?'TECHNICAL COMPARISON':'DOCUMENTED CONNECTION'}</span><span>${e(x.date)}</span></div><h2>${e(node(x.from)!.name)} <em>${e(x.label)}</em> ${e(node(x.to)!.name)}</h2><p>${e(x.detail)}</p>${x.limit?`<p class="cn-limit">${e(x.limit)}</p>`:''}<div class="cn-sources"><span>CHECK THE ORIGINAL EVIDENCE</span>${x.sources.map(s=>`<a href="${u(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} <b aria-hidden="true">↗</b></a>`).join('')}</div></section>`;
 }
 function nodeContext(n:ConnectionNode){
  const m=n.media?NeuroVisuals.items().find(m=>m.id===n.media):null;
  return `<section class="cn-context">${m?`<figure><button type="button" class="cn-photo" data-visual-open="${e(m.id)}" aria-label="Enlarge image: ${e(m.title)}">${NeuroVisuals.picture(m)}<span>View research image ⤢</span></button>${NeuroVisuals.credit(m)}</figure>`:''}<span class="eyebrow">${e(n.kind)} IN CONTEXT</span><h2>${e(n.name)}</h2><p>${e(n.summary)}</p>${n.href?`<a class="cn-profile" href="${n.href.startsWith('#')?e(n.href):u(n.href)}"${n.href.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"'}>Open full profile ↗</a>`:''}</section>`;
 }
 return {evidence,nodeContext,incident};
})();
