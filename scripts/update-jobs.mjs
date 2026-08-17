import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Refresh the live "open roles" feed for the Job market view.
// Public ATS boards are fetched directly; companies that use non-public ATS
// (ADP, Workday, Rippling, custom) are kept in a small curated list below and
// must be updated by hand. Level and function are inferred from title keywords.

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatedAt = new Date();
const dataPath = join(root, "data", "jobs.json");
const scriptPath = join(root, "dist", "jobs-data.js");

const USER_AGENT = "neurovisual-jobs/1.0 (https://github.com/HowardWHSrun/neurovisual)";

// --- Public ATS boards (auto-fetched) ---
const boards = [
  { name: "Neuralink", ats: "greenhouse", token: "neuralink" },
  { name: "NeuroPace", ats: "greenhouse", token: "neuropace" },
  { name: "Motif Neurotech", ats: "greenhouse", token: "motifneurotech" },
  { name: "Kernel", ats: "ashby", token: "kernel" }
];

// --- Curated entries (non-public ATS) ---
const SYNC = "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=d290c04e-0230-4cd9-8bf0-f116bfab1405&ccId=19000101_000003&lang=en_US&jobId=";
const curated = [
  { title: "Senior R&D Engineer, Mechanical/Biomedical", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201627514618_1" },
  { title: "Senior Quality Engineer, New Product Dev", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201609769879_1" },
  { title: "Senior Quality Engineer, Operations", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201609762270_1" },
  { title: "Electrical Engineer, ASIC Program Lead", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201592899997_1" },
  { title: "Senior Director, Regulatory Affairs", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201592489640_1" },
  { title: "Senior R&D Engineer, Electrical Engineering", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201546894497_1" },
  { title: "Senior Engineer, Mechanical Engineering", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201544249618_1" },
  { title: "Senior Engineer, Embedded Software/Firmware", employer: "Synchron", location: "San Diego, CA", url: SYNC + "9201542540262_1" },
  { title: "Research Associate II - In vivo Electrophysiology and Behavior", employer: "Allen Institute", location: "Seattle, WA", url: "https://alleninstitute.org/careers/jobs?jobId=09c3fea4-fb46-9a70-3fbc-bf7562ce3859" },
  { title: "Software Engineer II - Scientific Computing", employer: "Allen Institute", location: "Seattle, WA", url: "https://alleninstitute.org/careers/jobs?jobId=eaf7f3c2-59c1-8e73-7d9e-56463c4bcbe1" }
];

const LEVELS = ["Intern", "Junior", "Mid", "Senior", "Lead"];
const FUNCTIONS = ["Engineering", "Data & Software", "Science & Research", "Clinical & Medical", "Quality & Regulatory", "Design & Product", "Operations & Other"];

function inferLevel(title) {
  const t = " " + String(title).toLowerCase() + " ";
  if (/\bintern(?:ship)?\b|\bco-?op\b|\bapprentice\b/.test(t)) return "Intern";
  if (/\bdirector\b|\bvp\b|\bhead\b|\bchief\b|\bexecutive\b|\bpresident\b/.test(t)) return "Lead";
  if (/\bprincipal\b|\bstaff\b|\bsenior\b|\bsr\b|\bsr\.\b|\blead\b|\bmanager\b|\bsupervisor\b/.test(t)) return "Senior";
  if (/\bjunior\b|\bentry[- ]?level\b|\bnew grad\b|\bgraduate\b|\btrainee\b|\bassociate\b|\btechnician\b|\b[ i1]\b$/.test(t)) return "Junior";
  return "Mid";
}

function inferFunction(title) {
  const t = " " + String(title).toLowerCase() + " ";
  if (/\bembedded\b|\bfirmware\b|\bhardware\b|\belectrical\b|\basic\b|\bfpga\b|\bpcb\b|\brf\b|\bmechanical\b|\bmicrofabrication\b|\bmaterials\b|\bmanufactur\b|\bprocess\b|\belectrode\b|\bcleanroom\b|\bsemiconductor\b|\brobot\b|\boptical\b|\bcompute architecture\b/.test(t)) return "Engineering";
  if (/\bmachine learning\b|\bml engineer\b|\bdata scien\b|\bdata engineer\b|\bsoftware\b|\balgorithm\b|\bsignal processing\b|\bai\b|\bdeep learning\b|\bcomputer vision\b|\bdevops\b|\bcloud\b|\binfrastructure\b|\bdata\b/.test(t)) return "Data & Software";
  if (/\bscientist\b|\bresearch\b|\bneuroscien\b|\belectrophysiolog\b|\bin vivo\b|\bbiology\b|\bbioinformatic\b|\bimaging\b/.test(t)) return "Science & Research";
  if (/\bclinical\b|\btrial\b|\bpatient\b|\bmedical affairs\b|\bfield clinical\b|\bstudy\b/.test(t)) return "Clinical & Medical";
  if (/\bregulatory\b|\bquality\b|\bcompliance\b|\bdocument control\b|\bra\b|\bqa\b|\baudit\b/.test(t)) return "Quality & Regulatory";
  if (/\bhuman factors\b|\busability\b|\bux\b|\bui design\b|\bproduct\b|\buser research\b|\bdesign\b/.test(t)) return "Design & Product";
  return "Operations & Other";
}

function isRemote(location, workplaceType) {
  const s = String(location || "") + " " + String(workplaceType || "");
  return /remote/i.test(s);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function fetchGreenhouse(board) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`;
  const payload = await fetchJson(url);
  return (payload.jobs || []).map((job) => ({
    id: `${board.token}-${job.id}`,
    title: String(job.title || "").trim(),
    employer: board.name,
    location: String((job.location && job.location.name) || "").trim(),
    url: job.absolute_url || "",
    postedAt: job.updated_at ? String(job.updated_at).slice(0, 10) : null,
    source: "Greenhouse"
  }));
}

async function fetchAshby(board) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${board.token}`;
  const payload = await fetchJson(url);
  return (payload.jobs || []).map((job) => ({
    id: `${board.token}-${job.id || job.jobUrl}`,
    title: String(job.title || "").trim(),
    employer: board.name,
    location: String(job.location || "").trim(),
    url: job.jobUrl || job.applyUrl || "",
    postedAt: job.publishedAt ? String(job.publishedAt).slice(0, 10) : null,
    source: "Ashby"
  }));
}

async function fetchBoard(board) {
  if (board.ats === "greenhouse") return fetchGreenhouse(board);
  if (board.ats === "ashby") return fetchAshby(board);
  return [];
}

const errors = [];
async function collectBoard(board) {
  try {
    return await fetchBoard(board);
  } catch (error) {
    errors.push(`${board.name}: ${error.message}`);
    return [];
  }
}

const fetched = (await Promise.all(boards.map(collectBoard))).flat();

const curatedJobs = curated.map((entry, index) => ({
  id: `curated-${index}`,
  title: entry.title,
  employer: entry.employer,
  location: entry.location,
  url: entry.url,
  postedAt: generatedAt.toISOString().slice(0, 10),
  source: "Curated"
}));

const seen = new Set();
const jobs = [...fetched, ...curatedJobs]
  .filter((job) => job.title && job.url && !seen.has(job.url) && seen.add(job.url))
  .map((job) => ({
    ...job,
    level: inferLevel(job.title),
    fn: inferFunction(job.title),
    remote: isRemote(job.location)
  }))
  .sort((a, b) => a.employer.localeCompare(b.employer) || a.title.localeCompare(b.title));

const employerBoards = {
  "Neuralink": "https://boards.greenhouse.io/neuralink",
  "NeuroPace": "https://boards.greenhouse.io/neuropace",
  "Motif Neurotech": "https://boards.greenhouse.io/motifneurotech",
  "Kernel": "https://jobs.ashbyhq.com/kernel",
  "Synchron": "https://synchron.com/careers",
  "Allen Institute": "https://alleninstitute.org/careers/jobs"
};

const snapshot = {
  generatedAt: generatedAt.toISOString(),
  cadence: "Every Monday at 07:30 UTC",
  method: "Live postings pulled from public ATS boards plus a small curated list for companies without a public API. Levels and functions are inferred from title keywords and are approximate.",
  boards,
  employerBoards,
  curatedSources: ["Synchron (ADP)", "Allen Institute (careers site)"],
  errors,
  jobs
};

await mkdir(dirname(dataPath), { recursive: true });
await mkdir(dirname(scriptPath), { recursive: true });
await writeFile(dataPath, JSON.stringify(snapshot, null, 2) + "\n");
await writeFile(scriptPath, `var jobsSnapshot = ${JSON.stringify(snapshot)};\n`);

const byLevel = {};
const byFn = {};
for (const job of jobs) {
  byLevel[job.level] = (byLevel[job.level] || 0) + 1;
  byFn[job.fn] = (byFn[job.fn] || 0) + 1;
}
const byEmployer = {};
for (const job of jobs) byEmployer[job.employer] = (byEmployer[job.employer] || 0) + 1;

console.log(`Jobs snapshot: ${jobs.length} postings across ${Object.keys(byEmployer).length} employers.`);
console.log("By employer:", JSON.stringify(byEmployer));
console.log("By level:", JSON.stringify(byLevel));
console.log("By function:", JSON.stringify(byFn));
if (errors.length) console.warn("Board errors:", errors.join(" | "));
