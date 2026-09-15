#!/usr/bin/env python3
"""Cache Crossref metadata for DOI-bearing primary sources already in the atlas.

Citation metadata is bibliographic context, never evidence of mentorship or IP
transfer. Runs only when invoked; browsing the static site sends no API request.
"""
import datetime
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
relationships = json.loads((ROOT / 'data/connections.json').read_text())
origins = json.loads((ROOT / 'data/company-origins.json').read_text())
sources = {s['url'] for e in relationships['edges'] for s in e['sources']}
sources.update(s['url'] for c in origins['companies'] for s in c['sources'])
dois = set()
for url in sources:
    if match := re.search(r'(10\.\d{4,9}/[^?#\s]+)', url):
        dois.add(re.sub(r'(?:/full|v\d+)$', '', urllib.parse.unquote(match[1]).rstrip('/')))
    elif match := re.search(r'nature\.com/articles/([^/?#]+)', url):
        dois.add('10.1038/' + match[1])
    elif re.search(r'jmir.org/2019/10/[eE]16194', url):
        dois.add('10.2196/16194')

def fetch(doi):
    api = 'https://api.crossref.org/works/' + urllib.parse.quote(doi, safe='')
    request = urllib.request.Request(api, headers={'User-Agent': 'Neurovisual-research-metadata/1.0 (https://howardwhsrun.github.io/neurovisual/)'})
    with urllib.request.urlopen(request, timeout=35) as response:
        work = json.load(response)['message']
    date = work.get('published', work.get('issued', {})).get('date-parts', [[None]])[0]
    return dict(doi=work['DOI'], title=(work.get('title') or [doi])[0], year=date[0],
                url='https://doi.org/' + work['DOI'], publisher=work.get('publisher'),
                references=sorted({x['DOI'].lower() for x in work.get('reference', []) if x.get('DOI')}),
                metadataSource=api)

cache_path = ROOT / 'data/connection-papers.json'
cached = json.loads(cache_path.read_text()).get('papers', []) if cache_path.exists() else []
papers = [p for p in cached if p['doi'].lower() in {d.lower() for d in dois}]
failures = []
for doi in sorted(dois):
    if any(p['doi'].lower() == doi.lower() for p in papers):
        continue
    for attempt in range(3):
        time.sleep(2 + attempt * 3)
        try:
            papers.append(fetch(doi))
            break
        except Exception as error:
            if attempt == 2:
                failures.append({'doi': doi, 'error': str(error)})
result = dict(retrieved=datetime.date.today().isoformat(), provider='Crossref REST API',
              method='DOIs extracted from existing primary-source URLs; publisher metadata only. References do not establish historical descent.',
              papers=sorted(papers, key=lambda p: (p['year'] or 0, p['doi'])), failures=failures)
(ROOT / 'data/connection-papers.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(f'Cached {len(papers)} Crossref records; {len(failures)} failures.')
for failure in failures:
    print(failure)
