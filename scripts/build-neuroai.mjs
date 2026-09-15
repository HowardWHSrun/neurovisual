import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('data/neuroai.json',root),'utf8'));
await writeFile(new URL('dist/neuroai-data.js',root),'var neuroAIData = '+JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n');
console.log(`NeuroAI: ${data.projects.length} projects, ${data.resources.length} practical resources.`);
