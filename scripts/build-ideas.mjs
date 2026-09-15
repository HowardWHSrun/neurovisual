import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const ideas = JSON.parse(await readFile(new URL('data/ideas.json', root), 'utf8'));
const counts = JSON.parse(await readFile(new URL('data/neural-counts.json', root), 'utf8'));
const payload = JSON.stringify({ ...ideas, counts });
await writeFile(new URL('dist/ideas-data.js', root), 'var neuroIdeasData = ' + payload.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n');
console.log(`Ideas: ${ideas.ideas.length} notes, ${ideas.companies.length} strategies, ${counts.milestones.length} milestones.`);
