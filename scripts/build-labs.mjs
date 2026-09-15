import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('data/labs.json',root),'utf8'));
await writeFile(new URL('dist/labs-data.js',root),'var neuroLabsData = '+JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n');
const reference=(l,ids)=>ids.map(id=>{const s=l.sources.find(s=>s.id===id);if(!s)throw new Error(`Missing ${l.id}:${id}`);return `[${l.sources.indexOf(s)+1}](${s.url})`;}).join(' ');
let md=`# Neurovisual: research labs and university directories\n\nSource pages reviewed ${data.reviewed}. ${data.labs.length} detailed profiles; ${new Set(data.labs.map(l=>l.institution)).size} institutions.\n\n## Method\n\n${data.methodology.map(x=>'- '+x).join('\n')}\n\nThis is a selective survey, not a census of every neuroengineering lab. Source dates and review dates are distinct.\n`;
for(const l of data.labs){md+=`\n## ${l.name}\n\n**${l.institution} · ${l.country}**  \nInvestigators: ${l.leaders.join('; ')}  \nAreas: ${l.themes.join('; ')}\n\n${l.summary} ${reference(l,l.overviewRefs)}\n\n${l.approach} ${reference(l,l.overviewRefs)}\n\n**Methods:** ${l.methods.join('; ')}.  \n**Signals:** ${l.signals.join('; ')}.\n\n### Projects\n`;for(const p of l.projects)md+=`\n#### ${p.title}\n\n*${p.stage}*\n\n${p.detail} ${reference(l,p.refs)}\n`;md+=`\n### Progress to track: ${l.scale.metric}\n\n${l.scale.detail} ${reference(l,l.scale.refs)}\n\n### Study context\n\n${l.translation.detail} ${reference(l,l.translation.refs)}\n\n### Editorial notebook question\n\n${l.nextQuestion}\n\n### Sources\n\n${l.sources.map((s,i)=>`${i+1}. [${s.title}](${s.url}) — ${s.kind}; ${s.published||'publication date not recorded'}.`).join('\n')}\n`;}
md+='\n## University and center discovery pages\n';for(const s of data.schools)md+=`\n### ${s.institution} · ${s.country}\n\n${s.detail}\n\n[${s.title}](${s.url})\n`;
await mkdir(new URL('downloads/lab-research/',root),{recursive:true});
await writeFile(new URL('downloads/lab-research/research-directory.md',root),md);
console.log(`Labs: ${data.labs.length} profiles, ${data.schools.length} discovery pages.`);
