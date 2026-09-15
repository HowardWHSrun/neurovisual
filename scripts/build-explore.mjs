import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const load=async file=>JSON.parse(await readFile(new URL(file,root),'utf8'));
const problems=await load('data/exploration.json'),people=await load('data/exploration-people.json');
const js=(name,data)=>'var '+name+' = '+JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n';
await writeFile(new URL('dist/exploration-data.js',root),js('neuroExplorationData',problems)+js('neuroExplorationPeopleData',people));
console.log(`Exploration: ${problems.problems.length} problem groups, ${people.paths.length} people connections.`);
