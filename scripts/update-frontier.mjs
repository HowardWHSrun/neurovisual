import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatedAt = new Date();
const generatedDate = generatedAt.toISOString().slice(0, 10);
const windowDays = 45;
const rangeStart = new Date(generatedAt.getTime() - windowDays * 86400000).toISOString().slice(0, 10);
const dataPath = join(root, "data", "frontier.json");
const scriptPath = join(root, "dist", "frontier-data.js");

const sourceDefinitions = [
  { id: "europe-pmc", name: "Europe PMC", kind: "paper", url: "https://europepmc.org/RestfulWebService", note: "Newest peer-reviewed and indexed literature matching the atlas topic vocabulary." },
  { id: "preprints", name: "Europe PMC preprint index", kind: "preprint", url: "https://europepmc.org/RestfulWebService", note: "Recent preprints indexed from source servers; each item links to its original record and is marked as not yet peer reviewed." },
  { id: "clinicaltrials", name: "ClinicalTrials.gov", kind: "trial", url: "https://clinicaltrials.gov/data-api/api", note: "Recently updated registrations, not evidence that a treatment is effective." },
  { id: "nibib", name: "NIH NIBIB News", kind: "news", url: "https://www.nibib.nih.gov/rss", note: "Current official biomedical-engineering news feed; item dates are shown as the weekly observation date when the feed omits them." }
];

const topicRules = {
  record: /\b(recording|electrophysiolog|electrode|probe|imaging|microscop|eeg|ecog|seeg|fmri|meg|calcium|voltage sensor|neural signal)\b/i,
  stimulate: /\b(stimulation|neuromodulation|deep brain stimulation|dbs|tms|ultrasound|optogen|electrical pulse|closed-loop stimulation)\b/i,
  restore: /\b(brain[- ]computer|brain[- ]machine|neuroprosthe|prosthe|paralysis|spinal cord|speech decoding|motor decoding|sensory restoration|rehabilitation)\b/i,
  compute: /\b(decod|machine learning|artificial intelligence|foundation model|spike sort|neural code|computational model|digital twin|data standard)\b/i,
  regenerate: /\b(organoid|cell replacement|stem cell|regenerat|biohybrid|tissue engineering|scaffold|living electrode)\b/i,
  personal: /\b(wearable|consumer|open source|open data|neuroethic|mental privacy|neurofeedback)\b/i
};

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function clean(value = "", limit = 620) {
  const text = decodeXml(String(value)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > limit ? text.slice(0, limit - 1).trimEnd() + "…" : text;
}

function topicsFor(value) {
  const topics = Object.entries(topicRules).filter(([, rule]) => rule.test(value)).map(([topic]) => topic);
  return topics.length ? topics : ["record"];
}

function isRelevant(value) {
  return Object.values(topicRules).some(rule => rule.test(value));
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": "neurovisual-frontier/1.0 (https://github.com/HowardWHSrun/neurovisual)" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function getPapers() {
  const query = `((TITLE_ABS:"brain-computer interface") OR (TITLE_ABS:(brain OR neural OR neuron OR cortical OR spinal) AND TITLE_ABS:(neurotechnology OR "neural interface" OR neuromodulation OR connectomics OR "spatial transcriptomics" OR electrophysiology OR neuroprosthesis OR optogenetics OR "focused ultrasound" OR "deep brain stimulation"))) AND FIRST_PDATE:[${rangeStart} TO ${generatedDate}] sort_date:y`;
  const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&pageSize=100&query=" + encodeURIComponent(query);
  const payload = await fetchJson(url);
  return (payload.resultList?.result || [])
    .filter(row => row.source !== "PPR" && isRelevant(`${row.title || ""} ${row.abstractText || ""}`))
    .slice(0, 12)
    .map(row => ({
      id: `paper-${row.doi || `${row.source}-${row.id}`}`.toLowerCase(), kind: "paper", title: clean(row.title, 260),
      date: row.firstPublicationDate || row.electronicPublicationDate || row.journalInfo?.printPublicationDate || null,
      observedAt: generatedDate, source: "Europe PMC", sourceId: "europe-pmc",
      sourceUrl: row.doi ? `https://doi.org/${row.doi}` : `https://europepmc.org/article/${row.source}/${row.id}`,
      summary: clean(row.abstractText || "Europe PMC does not provide an abstract for this record."),
      authors: clean(row.authorString || "", 240), venue: clean(row.journalTitle || row.journalInfo?.journal?.title || "Indexed research article", 140),
      status: "Peer-reviewed / indexed", topics: topicsFor(`${row.title || ""} ${row.abstractText || ""}`)
    }));
}

async function getPreprints() {
  const query = `SRC:PPR AND ((TITLE_ABS:"brain-computer interface") OR (TITLE_ABS:(brain OR neural OR neuron OR cortical OR spinal) AND TITLE_ABS:(neurotechnology OR "neural interface" OR neuromodulation OR connectomics OR "spatial transcriptomics" OR electrophysiology OR neuroprosthesis OR optogenetics OR "focused ultrasound" OR "deep brain stimulation"))) AND FIRST_PDATE:[${rangeStart} TO ${generatedDate}] sort_date:y`;
  const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&pageSize=80&query=" + encodeURIComponent(query);
  const payload = await fetchJson(url);
  return (payload.resultList?.result || [])
    .filter(row => isRelevant(`${row.title || ""} ${row.abstractText || ""}`))
    .slice(0, 12)
    .map(row => ({
      id: `preprint-${row.doi || row.id}`.toLowerCase(), kind: "preprint", title: clean(row.title, 260),
      date: row.firstPublicationDate || row.electronicPublicationDate || null, observedAt: generatedDate,
      source: clean(row.journalTitle || "Preprint", 80), sourceId: "preprints",
      sourceUrl: row.doi ? `https://doi.org/${row.doi}` : `https://europepmc.org/article/PPR/${row.id}`,
      summary: clean(row.abstractText || "Europe PMC does not provide an abstract for this preprint."),
      authors: clean(row.authorString || "", 240), venue: "Preprint", status: "Preprint · not peer reviewed",
      topics: topicsFor(`${row.title || ""} ${row.abstractText || ""}`)
    }));
}

async function getTrials() {
  const query = `AREA[LastUpdatePostDate]RANGE[${rangeStart}, ${generatedDate}] AND ("brain-computer interface" OR neurostimulation OR neuromodulation OR "deep brain stimulation" OR "spinal cord stimulation" OR neuroprosthesis)`;
  const url = "https://clinicaltrials.gov/api/v2/studies?format=json&pageSize=100&sort=LastUpdatePostDate:desc&query.term=" + encodeURIComponent(query);
  const payload = await fetchJson(url);
  return (payload.studies || []).slice(0, 10).map(study => {
    const protocol = study.protocolSection || {};
    const identification = protocol.identificationModule || {};
    const status = protocol.statusModule || {};
    const design = protocol.designModule || {};
    const sponsor = protocol.sponsorCollaboratorsModule || {};
    const description = protocol.descriptionModule || {};
    const interventions = (protocol.armsInterventionsModule?.interventions || []).map(item => item.name).slice(0, 4).join(", ");
    const title = identification.briefTitle || identification.officialTitle || identification.nctId;
    return {
      id: `trial-${identification.nctId}`.toLowerCase(), kind: "trial", title: clean(title, 260),
      date: status.lastUpdatePostDateStruct?.date || status.studyFirstPostDateStruct?.date || null, observedAt: generatedDate,
      source: "ClinicalTrials.gov", sourceId: "clinicaltrials", sourceUrl: `https://clinicaltrials.gov/study/${identification.nctId}`,
      summary: clean(description.briefSummary || `Registered study involving ${interventions || "a neurotechnology intervention"}.`),
      authors: clean(sponsor.leadSponsor?.name || "", 240), venue: [identification.nctId, ...(design.phases || [])].filter(Boolean).join(" · "),
      status: clean(String(status.overallStatus || "Status not supplied").replaceAll("_", " ").toLowerCase(), 100), topics: topicsFor(`${title} ${description.briefSummary || ""} ${interventions}`)
    };
  });
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? match[1] : "";
}

async function getNews() {
  const response = await fetch("https://www.nibib.nih.gov/rss", { headers: { accept: "application/rss+xml, application/xml", "user-agent": "neurovisual-frontier/1.0 (https://github.com/HowardWHSrun/neurovisual)" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for NIBIB RSS`);
  const xml = await response.text();
  const rows = (xml.match(/<item>[\s\S]*?<\/item>/gi) || []).map(block => {
    const title = clean(tag(block, "title"), 260);
    const summary = clean(tag(block, "description"));
    return { title, summary, sourceUrl: clean(tag(block, "link"), 500) };
  }).filter(row => isRelevant(`${row.title} ${row.summary}`)).slice(0, 8);
  return Promise.all(rows.map(async (row, index) => {
    let date = null;
    try {
      const page = await fetch(row.sourceUrl, { headers: { "user-agent": "neurovisual-frontier/1.0 (https://github.com/HowardWHSrun/neurovisual)" } });
      if (page.ok) {
        const html = await page.text();
        const match = html.match(/field--name-field-publication-date[\s\S]{0,240}?field__item[^>]*>([^<]+)</i) || html.match(/article:published_time[^>]+content="([^"]+)/i);
        if (match) {
          const parsed = new Date(clean(match[1], 80));
          if (!Number.isNaN(parsed.getTime())) date = parsed.toISOString().slice(0, 10);
        }
      }
    } catch {}
    return {
      id: `news-nibib-${index}-${row.sourceUrl.split("/").pop()}`.toLowerCase(), kind: "news", title: row.title, date, observedAt: generatedDate,
      source: "NIH NIBIB News", sourceId: "nibib", sourceUrl: row.sourceUrl, summary: row.summary,
      authors: "National Institute of Biomedical Imaging and Bioengineering", venue: "Official institutional news feed",
      status: date ? "Official institutional news" : "Seen in the current weekly feed", topics: topicsFor(`${row.title} ${row.summary}`)
    };
  }));
}

async function readPrevious() {
  try { return JSON.parse(await readFile(dataPath, "utf8")); } catch { return { items: [] }; }
}

const previous = await readPrevious();
const errors = [];
async function collect(kind, task) {
  try { return await task(); }
  catch (error) {
    errors.push(`${kind}: ${error.message}`);
    return (previous.items || []).filter(item => item.kind === kind);
  }
}

const [papers, preprints, trials, news] = await Promise.all([
  collect("paper", getPapers), collect("preprint", getPreprints), collect("trial", getTrials), collect("news", getNews)
]);

const seen = new Set();
const items = [...papers, ...preprints, ...trials, ...news]
  .filter(item => item.title && item.sourceUrl && !seen.has(item.id) && seen.add(item.id))
  .sort((a, b) => String(b.date || b.observedAt).localeCompare(String(a.date || a.observedAt)) || a.kind.localeCompare(b.kind));

if (!items.length) throw new Error("No frontier items were retrieved and no previous snapshot exists.");

const snapshot = {
  generatedAt: generatedAt.toISOString(), cadence: "Every Monday at 07:17 UTC", windowDays,
  method: "Automated topic matching followed by newest-first ordering. This is a discovery feed, not an impact or efficacy ranking.",
  sources: sourceDefinitions, errors, items
};

await mkdir(dirname(dataPath), { recursive: true });
await mkdir(dirname(scriptPath), { recursive: true });
await writeFile(dataPath, JSON.stringify(snapshot, null, 2) + "\n");
await writeFile(scriptPath, `var frontierSnapshot = ${JSON.stringify(snapshot)};\n`);
console.log(`Frontier snapshot: ${items.length} items (${papers.length} papers, ${preprints.length} preprints, ${trials.length} trials, ${news.length} news).`);
if (errors.length) console.warn(`Source fallbacks used: ${errors.join(" | ")}`);
