# Neurovisual

A neuroengineering reference hub connecting field overviews, learning resources, and the Global Neurotechnology Atlas.

Public site: https://howardwhsrun.github.io/neurovisual/

## What is here

- **Overview:** ten connected topics, with short primers and routes into the atlas.
- **Resource library:** 41 official tools, tutorials, courses, standards, and datasets. Filter by topic, type, level, and text.
- **Learning paths:** six four-step projects covering EEG decoding, 3D behavior, network simulation, spike sorting, calcium imaging, and stimulation modeling. Each includes evaluation criteria and a stretch question.
- **Glossary:** 40 introductory definitions with links to their topic guides.
- **Methods comparison:** a two-method comparison bench with direct links from search, plus the full reference for eight electrical, magnetic, hemodynamic, calcium, and behavioral measurements.
- **Topic depth:** each guide includes engineering tradeoffs, a four-stage workflow, common mistakes, and primary sources, with worked examples where useful.
- **Ideas notebook:** four evolving notes, a six-platform visual gallery with verified YouTube embeds and original scaling diagrams, an interactive site/channel comparison, a bandwidth calculator, and a downloadable 20-milestone research package. Begin at [Ideas](https://howardwhsrun.github.io/neurovisual/#ideas).
- **Research labs:** detailed project-level profiles, institutional discovery directories, and field-specific progress measures across seven regions. Start at [Research labs](https://howardwhsrun.github.io/neurovisual/#labs); see [LABS.md](LABS.md) to extend the evidence.
- **Search:** a compact, on-demand dialog with result previews across lab projects, ideas, companies, guides, resources, and the atlas. Open it with Search, `/`, or Cmd/Ctrl+K; typing preserves the current page and Escape closes it. The results page has its own refinement field.
- **Existing atlas:** technology maps, organizational profiles and rankings, researcher trails, papers and updates, academic/career pathways, and milestones.

Atlas records retain their original dates and limitations. Resource links were reviewed on September 7, 2026; this does not mean every atlas record was reverified that day. The site is a curated starting point, not a complete census or a clinical reference.

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
| `index.html`, `workspace.css` | Compact navigation, on-demand search, catalog, dictionary, learning, and comparison layouts |
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
