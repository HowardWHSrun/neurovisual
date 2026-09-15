#!/usr/bin/env python3
"""Build the static OpenAlex people snapshot; no credentials or runtime site API.

Discovery never approves identities. Review the candidate JSON, then record stable
OpenAlex IDs and supporting evidence in data/people-identity.json. Default refresh
uses those decisions. python3 scripts/update-people.py --help shows all options.
The cache retains exact API responses and retrieval dates; --refresh-cache forces
network refresh. An unresolved or failed record has null metrics, never zeroes.
"""
import argparse, datetime as dt, hashlib, json, os, pathlib, re, shutil, subprocess, sys, time, unicodedata
import urllib.error, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
TODAY = dt.datetime.now(dt.timezone.utc).date().isoformat()
BASE = 'https://api.openalex.org/'
DOCS = [
 {'title':'OpenAlex author attributes and limitations','url':'https://help.openalex.org/data/authors/'},
 {'title':'OpenAlex author disambiguation','url':'https://help.openalex.org/data/authors/disambiguation/'},
 {'title':'OpenAlex API reference','url':'https://help.openalex.org/api/'},
]

def write_json(path, value):
    path=pathlib.Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    temp=path.with_suffix(path.suffix+'.tmp'); temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n'); temp.replace(path)

def norm(text):
    return re.sub(r'[^a-z0-9]+',' ',unicodedata.normalize('NFKD',text or '').encode('ascii','ignore').decode().lower()).strip()

ALIASES = {
 'MIT':['massachusetts institute of technology'], 'EPFL':['ecole polytechnique federale de lausanne'],
 'ETH Zürich':['eth zurich','swiss federal institute of technology zurich'], 'NYU':['new york university','nyu langone'],
 'University College London':['university college london'], 'HHMI Janelia':['janelia','howard hughes medical institute'],
 'NIH':['national institutes of health','national institute of neurological disorders'],
 'UMC Utrecht':['university medical center utrecht','utrecht university'], 'CHUV':['lausanne university hospital','lausanne'],
 'Caltech':['california institute of technology'], 'Penn State':['pennsylvania state university'],
 'Clinatec':['grenoble','cea'], 'NeuroRestore':['lausanne','ecole polytechnique'],
 'University of New South Wales':['university of new south wales','unsw sydney'],
}
def institution_matches(seed, institutions):
    labels=[norm(x) for x in institutions]
    parts=[norm(x) for x in seed.get('institution','').split('/') if len(norm(x))>3]
    for key, vals in ALIASES.items():
        if norm(key) in norm(seed.get('institution','')): parts+=vals
    # University names with lab/school suffixes still match the institution name.
    return [x for x,label in zip(institutions,labels) if any(p in label or (len(label)>10 and label in p) for p in parts)]

def name_matches(a,b):
    aa=norm(a).split(); bb=norm(b).split()
    if not aa or not bb or aa[-1]!=bb[-1]: return False
    if aa[0]==bb[0]: return True
    # Explicit common shortened names only; initials alone need human review.
    nick={'tim':'timothy','ed':'edward','tom':'thomas','charley':'charles','jeff':'jeffrey','nick':'nicholas'}
    return nick.get(aa[0],aa[0])==nick.get(bb[0],bb[0])

class Client:
    def __init__(self,args): self.args=args; self.last=0; self.calls=0; self.cost=0
    def get(self,path,params=None):
        url=BASE+path+(('?'+urllib.parse.urlencode(params)) if params else '')
        cache=pathlib.Path(self.args.cache_dir)/(hashlib.sha256(url.encode()).hexdigest()+'.json')
        if cache.exists() and not self.args.refresh_cache:
            record=json.loads(cache.read_text()); return record['data'],record['retrieved'],url
        if self.args.offline: raise RuntimeError('No cached response: '+url)
        for attempt in range(5):
            time.sleep(max(0,self.args.interval-(time.monotonic()-self.last)))
            self.last=time.monotonic()
            try:
                request=urllib.request.Request(url,headers={'User-Agent':'NeurovisualResearchSnapshot/1.0 (static bibliometric research; Python urllib)','Accept':'application/json'})
                with urllib.request.urlopen(request,timeout=30) as response: data=json.load(response)
                self.calls+=1;self.cost+=(data.get('meta') or {}).get('cost_usd',0) or 0
                write_json(cache,{'url':url,'retrieved':TODAY,'data':data});return data,TODAY,url
            except urllib.error.HTTPError as e:
                if e.code not in (429,500,502,503,504): raise
                body=e.read().decode(errors='replace')
                if e.code==429 and any(x in body.lower() for x in ['budget','credit','daily']):
                    raise RuntimeError('OpenAlex anonymous daily budget exhausted; resume from cache later') from e
                if attempt==4: raise
                time.sleep(min(30,float(e.headers.get('Retry-After') or 2**attempt)))
            except (urllib.error.URLError,TimeoutError):
                if attempt==4: raise
                time.sleep(2**attempt)

def seeds(args):
    if args.seed_file: result=json.loads(pathlib.Path(args.seed_file).read_text())
    else:
        node=os.environ.get('NODE_BINARY') or shutil.which('node')
        bundled=pathlib.Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
        if not node and bundled.exists(): node=str(bundled)
        if not node: raise RuntimeError('Node is required to read dist/researchers.js; set NODE_BINARY or --seed-file')
        js="const fs=require('fs'),vm=require('vm');const c=vm.createContext({});vm.runInContext(fs.readFileSync('dist/researchers.js','utf8'),c);process.stdout.write(JSON.stringify(vm.runInContext('researchers',c)));"
        result=json.loads(subprocess.check_output([node,'-e',js],cwd=ROOT))
    if args.extra_seeds:
        result+=json.loads(pathlib.Path(args.extra_seeds).read_text())
    seen=set(); result=[r for r in result if not (r['id'] in seen or seen.add(r['id']))]
    if args.ids: result=[r for r in result if r['id'] in args.ids.split(',')]
    return result[:args.limit] if args.limit else result

def author_record(client,aid,seed,with_papers=True):
    aid=aid.rsplit('/',1)[-1]
    if not re.fullmatch(r'A\d+',aid) or aid in ('A9999999999','A5317838346'): raise ValueError('Invalid author ID')
    d,retrieved,url=client.get('authors/'+aid)
    inst=sorted(set(x['institution']['display_name'] for x in (d.get('affiliations') or []) if x.get('institution')) | set(x['display_name'] for x in d.get('last_known_institutions') or []))
    years=[{'year':x['year'],'citations':x.get('cited_by_count'),'works':x.get('works_count')} for x in (d.get('counts_by_year') or [])]
    byyear={x['year']:x for x in years}
    recent=sum(byyear[y]['citations'] for y in (2023,2024,2025)) if all(y in byyear and isinstance(byyear[y]['citations'],int) for y in (2023,2024,2025)) else None
    out={'openalexId':d['id'],'matchedName':d['display_name'],'orcid':d.get('orcid'),
      'metrics':{'citations':d.get('cited_by_count'),'works':d.get('works_count'),'hIndex':(d.get('summary_stats') or {}).get('h_index'),'recentCitations':recent},
      'countsByYear':sorted(years,key=lambda x:x['year']),
      'institutions':inst,'lastKnownInstitutions':[x['display_name'] for x in d.get('last_known_institutions') or []],
      'topics':[x['display_name'] for x in d.get('topics') or []], 'nameMatch':name_matches(seed['name'],d['display_name']),
      'institutionMatch':institution_matches(seed,inst),'papers':[],'retrieved':retrieved,'updatedAt':d.get('updated_date'),'sources':[{'title':'OpenAlex author record: '+d['display_name'],'url':url}]}
    if with_papers:
        params={'filter':'author.id:'+aid,'sort':'cited_by_count:desc','per_page':3,'select':'id,doi,title,publication_year,cited_by_count,authorships,primary_topic'}
        w,wr,wu=client.get('works',params)
        for p in w['results']:
            matched=[a for a in (p.get('authorships') or []) if (a.get('author') or {}).get('id')==d['id']]
            out['papers'].append({'title':p.get('title') or '(Untitled indexed work)','year':p.get('publication_year'),'doi':p.get('doi'),'url':p.get('doi') or p['id'],'openalexId':p['id'],'citations':p.get('cited_by_count'),'authorPresent':bool(matched),'authorNames':[a.get('raw_author_name') or a['author'].get('display_name') for a in matched],'authorInstitutions':sorted(set(i['display_name'] for a in matched for i in (a.get('institutions') or []))),'topic':(p.get('primary_topic') or {}).get('display_name')})
        out['sources'].append({'title':'OpenAlex most-cited indexed works for this author','url':wu})
        out['papersRetrieved']=wr
    return out

def discover(client,seed):
    data,retrieved,url=client.get('autocomplete/authors',{'q':seed.get('queryName',seed['name'])})
    hints=data.get('results',[])
    # Keep leading candidates plus any lower-ranked institutional match for audit.
    choices=hints[:3]+[h for h in hints[3:] if institution_matches(seed,[h.get('hint') or ''])]
    unique={x['id']:x for x in choices}
    candidates=[]
    for aid,h in unique.items():
        if not name_matches(seed['name'],h['display_name']) and candidates: continue
        candidates.append(author_record(client,aid,seed))
    plausible=[x for x in candidates if x['nameMatch'] and x['institutionMatch']]
    return {**seed,'candidateSource':url,'candidates':candidates,'proposedId':plausible[0]['openalexId'] if len(plausible)==1 else None,'proposedStatus':'needs-review','reason':'Human review required: compare institution history, research topics and sampled paper bylines. Multiple profiles may be split duplicates; counts must not be merged automatically.'}

def snapshot_person(seed,decision,candidate=None,error=None):
    verified=decision.get('status')=='verified' and candidate is not None and not error
    status='verified' if verified else ('unresolved' if error else decision.get('status','unresolved'))
    reason=error or decision.get('reason') or 'No reviewed author identity match is available.'
    p={'id':seed['id'],'name':seed['name'],'institution':seed.get('institution',''),'openalexId':candidate['openalexId'] if candidate else decision.get('openalexId'),'orcid':candidate.get('orcid') if candidate else None,
       'metrics':candidate['metrics'] if verified else {'citations':None,'works':None,'hIndex':None,'recentCitations':None},
       'countsByYear':candidate['countsByYear'] if verified else [],
       'identity':{'status':status,'reason':reason,'matchedName':candidate['matchedName'] if candidate else '', 'institutions':candidate['institutions'] if candidate else [],'topics':candidate['topics'] if candidate else [],'evidence':decision.get('evidence',[]),'reviewed':decision.get('reviewed')},
       'papers':candidate['papers'] if verified else [],'sources':candidate['sources'] if candidate else [],'retrieved':candidate.get('retrieved') if candidate else TODAY}
    if candidate: p['updatedAt']=candidate.get('updatedAt');p['papersRetrieved']=candidate.get('papersRetrieved')
    if seed.get('profileUrl'): p['sources'].append({'title':'Directory identity reference: '+seed['name'],'url':seed['profileUrl']})
    seen={s['url'] for s in p['sources']}
    for source in decision.get('evidence',[]):
        if isinstance(source,dict) and str(source.get('url','')).startswith('https://') and source['url'] not in seen:
            p['sources'].append({'title':source.get('title') or 'Identity evidence','url':source['url']});seen.add(source['url'])
    return p

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--discover',action='store_true',help='Write candidate evidence only; never approve identities')
    ap.add_argument('--offline',action='store_true');ap.add_argument('--refresh-cache',action='store_true')
    ap.add_argument('--seed-file');ap.add_argument('--extra-seeds');ap.add_argument('--ids');ap.add_argument('--limit',type=int)
    ap.add_argument('--interval',type=float,default=.18)
    ap.add_argument('--cache-dir',default=str(pathlib.Path.home()/'.cache/neurovisual/openalex'))
    ap.add_argument('--candidates-out',default='/tmp/neurovisual-people-candidates.json')
    ap.add_argument('--identity-file',default=str(ROOT/'data/people-identity.json'))
    ap.add_argument('--output',default=str(ROOT/'data/people-metrics.json'))
    args=ap.parse_args();client=Client(args);people=seeds(args);failures=[];out=[]
    if args.discover:
        dest=pathlib.Path(args.candidates_out)
        previous=json.loads(dest.read_text()).get('people',[]) if dest.exists() else []
        byid={p['id']:p for p in previous}
        for n,seed in enumerate(people):
            try: byid[seed['id']]=discover(client,seed)
            except Exception as e: failures.append({'id':seed['id'],'error':str(e)});print('ERROR',seed['id'],str(e),flush=True)
            ordered=[byid[s['id']] for s in people if s['id'] in byid]+[p for p in previous if p['id'] not in {s['id'] for s in people}]
            write_json(dest,{'retrieved':TODAY,'provider':'OpenAlex','people':ordered,'failures':failures})
            print(f'{n+1}/{len(people)} {seed["id"]}',flush=True)
    else:
        identity=json.loads(pathlib.Path(args.identity_file).read_text());decisions={x['id']:x for x in identity['people']}
        # Identity-only supplemental records keep graph people reproducible.
        if not args.ids and not args.limit:
            existing={s['id'] for s in people};people += [x['seed'] for x in identity['people'] if x['id'] not in existing and x.get('seed')]
        for n,seed in enumerate(people):
            decision=decisions.get(seed['id'],{});candidate=None;error=None
            if decision.get('name'): seed={**seed,'name':decision['name']}
            if decision.get('status')=='verified':
                try:
                    candidate=author_record(client,decision['openalexId'],seed)
                    if candidate['openalexId']!=decision['openalexId']: raise RuntimeError('Author ID redirected; review identity before ranking')
                    confirmed=set(decision.get('verifiedMissingAuthorshipWorks',[]))
                    if not all(p['authorPresent'] or p['openalexId'] in confirmed or p.get('doi') in confirmed for p in candidate['papers']): raise RuntimeError('Sampled paper authorship missing; review full publisher/consortium byline')
                    for paper in candidate['papers']:
                        if not paper['authorPresent'] and (paper['openalexId'] in confirmed or paper.get('doi') in confirmed): paper['authorshipVerifiedExternally']=True
                except Exception as e: error=str(e);failures.append({'id':seed['id'],'error':error})
            out.append(snapshot_person(seed,decision,candidate,error))
            print(f'{n+1}/{len(people)} {seed["id"]} {out[-1]["identity"]["status"]}',flush=True)
        verified=[p for p in out if p['identity']['status']=='verified'];ids=[p['openalexId'] for p in verified]
        if len(ids)!=len(set(ids)): raise RuntimeError('Two verified people share an OpenAlex author ID')
        write_json(args.output,{'retrieved':TODAY,'provider':'OpenAlex','schemaVersion':1,'methodology':{
          'scope':'Bibliometric snapshot of this curated directory, not a global ranking or a measure of an individual\'s complete influence.',
          'identity':'Reviewed name, institutional history, research topics and sampled indexed publications; source author clusters can still contain merge/split errors. Institutions are publication metadata and are not verified current employers.',
          'citations':'OpenAlex lifetime cited_by_count across the author profile; includes all indexed disciplines and coauthored works without fractional authorship credit.',
          'works':'OpenAlex works_count includes indexed scholarly work types, not only journal articles.',
          'hIndex':'OpenAlex summary_stats.h_index; database-specific and career-length dependent.',
          'yearBasis':'publication-year','recentCitations':'Lifetime citations to works published in the complete publication years 2023, 2024 and 2025. NOT citations received during those years. Null if any of the three year bins is missing.',
          'recentPublicationYears':[2023,2024,2025], 'papers':'Up to three most-cited indexed works for the matched author; illustrative identity evidence, not a complete bibliography.',
          'refresh':'Static snapshot produced from reviewed stable author IDs. Per-record retrieval dates identify cached responses. Run --refresh-cache to request fresh responses; default reuses cache.',
          'limitations':['OpenAlex author profiles can merge different people or split one person across IDs; no counts from separate IDs are added together.','Citations favor older careers and citation-dense disciplines; papers do not capture every engineering, clinical, mentoring or commercial contribution.','Recent publication cohorts have had different time to accrue citations.','Unresolved identities and failed refreshes remain unranked with null metrics.']},'sources':DOCS,'people':out,'failures':failures})
        print(f'Wrote {len(out)} people; {len(verified)} verified.',flush=True)
    print(f'Network requests {client.calls}; API-reported cost ${client.cost:.4f}',flush=True)

if __name__=='__main__': main()
