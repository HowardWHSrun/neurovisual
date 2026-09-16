# Neurovisual

A visual field guide to understanding the brain: neuroengineering, NeuroAI, practical tools, learning paths, research connections, and evolving ideas.

Public site: https://howardwhsrun.github.io/neurovisual/

## What is here

- **Start here:** a photography-led introduction, a beginner route, and four ways into the research: companies/labs, problems, people/connections, and countries. Navigation keeps the detailed reference sections in expandable groups.
- **Explore the field:** eight source-linked problem groups and a native interactive map of people, labs, companies, and institutions. Search, filter relationship types, focus on nearby connections, or open one of six starting examples. Country guides connect mapped labs and companies; combine problem and country filters, then open the exact profile or original source.
- **NeuroAI:** sourced project guides spanning connectomics, brain models and emulation, AI inspired by biology, and living neural computing. Follow the four-step Map → Model → Act → Test explanation, then open tools or learning paths. See [NEUROAI.md](NEUROAI.md).
- **Topic guides:** eleven topics grouped by the questions they answer, with visual introductions and expandable workflows, examples, sources, and tools. Use Expand all details for a full read.
- **Resource library:** 53 official tools, tutorials, courses, standards, and datasets. Filter by topic, type, level, and text.
- **Learning paths:** eight four-step projects covering EEG decoding, 3D behavior, network simulation, spike sorting, calcium imaging, stimulation modeling, connectome exploration, and neural representation evaluation. Each includes evaluation criteria and a stretch question.
- **Glossary:** 49 introductory definitions with links to their topic guides.
- **Methods comparison:** a two-method comparison bench with direct links from search, plus the full reference for eight electrical, magnetic, hemodynamic, calcium, and behavioral measurements.
- **Topic depth:** each guide includes engineering tradeoffs, a four-stage workflow, common mistakes, and primary sources, with worked examples where useful.
- **Ideas notebook:** six evolving notes, a six-platform visual gallery with verified YouTube embeds and original scaling diagrams, an interactive site/channel comparison, a bandwidth calculator, and a downloadable 20-milestone research package. Begin at [Ideas](https://howardwhsrun.github.io/neurovisual/#ideas).
- **Research labs:** detailed project-level profiles, institutional discovery directories, and field-specific progress measures across seven regions. Start at [Research labs](https://howardwhsrun.github.io/neurovisual/#labs); see [LABS.md](LABS.md) to extend the evidence.
- **Search:** a compact, on-demand dialog with result previews across lab projects, ideas, companies, guides, resources, and the atlas. Open it with Search, `/`, or Cmd/Ctrl+K; typing preserves the current page and Escape closes it. The results page has its own refinement field.
- **Existing atlas:** technology maps, organizational profiles and rankings, researcher trails, papers and updates, academic/career pathways, and milestones.

Atlas records retain their original dates and limitations. The core resource collection was reviewed on September 7, 2026; new NeuroAI entries show their September 15 review dates; this does not mean every atlas record was reverified that day. The site is a curated starting point, not a complete census or a clinical reference.

## Editorial approach

This is a general guide to the field. Choose featured images and examples for their relevance, clarity, and breadth across institutions and research areas. Personal affiliations do not determine prominence. Keep accurate lab entries and sourced relationships, use alphabetical ordering for the lab directory, and avoid presenting several examples from one research network as a survey of the field.

## People and influence

Browse [People & influence](https://howardwhsrun.github.io/neurovisual/#people): 192 sourced profiles, including 143 ranked using complete OpenAlex metrics. Compare people side by side or inspect the three-step calculation. [PEOPLE.md](PEOPLE.md) documents identity checks, editorial weights, publication-year citation cohorts and refresh instructions. Missing or ambiguous author records remain unranked.

## Develop and validate

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm test
```

The original TypeScript/classic-script architecture is retained. GitHub Pages serves the repository root; compiled `dist/*.js` files must be committed with source changes. No backend or API key is required. All core rendering assets, including D3 7.9.0, are local. Third-party resource links open at their original sites.

`pnpm test` compiles the application and checks HTML escaping, allowed URL schemes, route parsing, search matching, date handling, content relationships, script order, asset paths, and curated job-date integrity, notebook evidence relationships, selected rendered states, and notebook controls using element doubles. It is not a browser or visual test.

## Source layout

| File | Purpose |
| --- | --- |
| `index.html`, `organization.css`, `guide-reading.css` | Navy navigation, research photography, beginner home page, topic directory, and expandable reading |
| `data/neuroai.json`, `src/neuroai*.ts`, `neuroai.css` | NeuroAI dossiers, visual explanation, glossary and practical learning integration |
| `src/explore.ts`, `explore.css`, `data/exploration*.json` | Four exploration views, problem/country combinations, and source-linked starting examples |
| `src/people-map.ts`, `people-map.css`, `scripts/check-people-map.mjs` | Native relationship map, filtered neighborhoods, search, evidence panel, and accessible readable list |
| `scripts/build-explore.mjs`, `scripts/check-explore.mjs` | Generate exploration data and check references, filters, geography, rendering, and navigation |
| `workspace.css` | On-demand search, catalog, dictionary, learning, and comparison layouts |
| `atlas-experience.css` | Map space, researcher/paper reading panes, career controls, and chronology styles |
| `data/ideas.json`, `data/neural-counts.json` | Authored research notes, company strategies, and scoped milestone evidence |
| `data/labs.json`, `src/labs.ts`, `labs.css` | Detailed lab profiles, university directories, filters, and progress measures |
| `scripts/build-labs.mjs`, `scripts/check-labs.mjs` | Generate data/dossier and validate lab evidence, relationships, and rendering |
| `src/company-media.ts`, `company-media.css` | Shared image galleries, click-to-load videos, and interface diagrams |
| `src/ideas.ts`, `ideas.css` | Notebook, comparisons, and arithmetic controls |
| `scripts/build-ideas.mjs`, `scripts/check-ideas.mjs` | Data generation and notebook validation |
| `hub.css` | Responsive hub design and compatible atlas refinements |
| `styles.css` | Original atlas presentation and visualizations |
| `src/hub.ts` | Hub views, resource filters, global search, and hash routing |
| `src/hub-data.ts` | Topic guides, official resources, glossary, and learning paths |
| `src/hub-guides.ts` | Detailed source-linked topic guides and measurement comparisons |
| `src/hub-utils.ts` | Shared escaping, URL, search, date, and route helpers |
| `src/app.ts` | Atlas data, filters, rankings, visualization, and navigation adapter |
| `src/researchers.ts`, `src/pathways.ts` | Existing researcher and study/career data |
| `data/`, `dist/*-data.js` | Dated frontier and job snapshots |
| `scripts/check-hub.mjs` | Content and integration checks |

Hash routes work beneath `/neurovisual/` and do not require server rewrites. Existing `#org/<id>` URLs are preserved. Technologies use `#tech/<id>`; researchers use `#person/<id>`. Atlas-local interactions update the shell without reinitializing their selection or filters.

## Updating content

See [IDEAS.md](IDEAS.md) to add an observation or revise the count evidence. See [CONTRIBUTING.md](CONTRIBUTING.md) for the resource schema and source standards.

```sh
pnpm frontier:update
pnpm jobs:update
```

Scheduled refresh workflows are retained. Snapshot generation time is distinct from source publication or verification time. A failed job-board refresh retains previous rows marked stale; manually curated roles do not receive invented posting dates. Check original listings before applying.

Organization profiles retain the optional AI research workspace. On this public static site it prepares prompts for use in ChatGPT. A deployment can set `window.NEURO_ATLAS_AI_ENDPOINT` to a secure server endpoint accepting `POST { prompt, entity }`. Keep provider keys on the server, never in public HTML or JavaScript.

D3 is distributed under the ISC license; see `assets/D3-LICENSE`.
