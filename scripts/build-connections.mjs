import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('data/connections.json',root),'utf8'));
await writeFile(new URL('dist/connections-data.js',root),'var neuroConnectionsData = '+JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n');
console.log(`Connections: ${data.nodes.length} entries, ${data.edges.length} relationships.`);
