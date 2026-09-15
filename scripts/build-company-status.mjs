import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('data/company-status.json',root),'utf8'));
await writeFile(new URL('dist/company-status-data.js',root),'var neuroCompanyStatusData = '+JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n');
console.log(`Company status: ${data.companies.length} dated clinical-program reviews.`);
