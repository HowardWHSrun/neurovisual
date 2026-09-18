# Origins and research connections

Neurovisual now starts with company histories instead of a centered card-and-wire map. The September 2026 release investigates 33 companies involved in implanted interfaces, stimulation, sensory prostheses and supporting hardware. Its coverage ledger lists all 121 companies in the wider atlas and identifies the remaining entries as not audited for origins in this release. This is a curated, expandable research collection, not a complete genealogy.

## Four ways to explore

1. **Company origins:** three numbered stages explain the research background, translation into a company, and interface engineering. Dated milestones, original sources, engineering changes and unresolved gaps follow. Stage order is explanatory, not a proportional time axis; a later research collaboration is not presented as a pre-founding event.
2. **Technology families:** seven engineering groups organize the histories. Group membership is a taxonomy, not evidence of descent, licensing or collaboration. Generic interface drawings are explicitly labeled schematics; existing credited device images remain in use.
3. **Explore the network:** Cytoscape.js renders two-step neighborhoods, the whole network, or a shortest path between two entries. Named examples provide a quick start. Nodes can be selected, panned and zoomed. Relationships have an equivalent keyboard-readable list and a source dialog. Shortest paths traverse relationships in either direction; individual arrows always retain the original subject/object statement. A route through a university does not establish technology transfer.
4. **Coverage & sources:** the company ledger, method, downloads and imported paper metadata make coverage inspectable.

URLs use `#connections/<id>?view=origins|network`, with directory/families/coverage routes at `#connections?view=…`. Network parameters include `to`, `scope=all`, `comparisons=yes` and `edge`. Old company/node links remain resolvable; the old `story` parameter is accepted as an obsolete parameter while the node and selected evidence still open. Back/forward restores the current route. Company filters submit explicitly and search referenced names and relationship details as well as stage prose.

## Evidence boundaries

- Training, company formation, institutional affiliation, collaboration, acquisition, licensing, hardware use and technical continuity are different claims. Every graph relationship retains its exact label, date context, evidence and limits.
- Solid arrows express a documented statement. Dashed, undirected technical comparisons are opt-in. Similar materials, signal types, anatomy or CMOS fabrication do not establish ancestry.
- Zhengtuo Zhao's doctorate was at UT Austin, followed by UT Austin/Rice postdoctoral work. The Xie-group training, StairMed co-founding, NET–MERF–uFINE method sequence and StairMed hardware contribution have distinct evidence. No university-to-StairMed patent license is inferred.
- Blackrock's 2007/2008 founding-date discrepancy and INBRAIN's 2019/2020 discrepancy remain visible. Historical agreements are not silently treated as active agreements.
- The Stanford speech-decoding license disclosures connect both Neuralink and Blackrock; separate UC Regents applications connect Paradromics. A disclosed license does not establish implementation of a particular decoder in a product.
- NICTA combined with CSIRO's digital-research teams to form Data61; this is not described as a simple rename. Science's PRIMA story traces an acquired program through Pixium and Stanford, not the origin of every Science platform.
- MicroPort's vascular BCI work is a prospective 2026 collaboration. Brain Navi's surgical robot is supporting infrastructure. Neither is silently promoted to an established implanted BCI product.
- Physical sites, simultaneous channels, identified neurons and stimulation contacts remain different quantities. Acute human acquisition, chronic preclinical work, clinical studies and marketed systems remain distinct.

## Data and imports

- `data/connections.json`: canonical graph identities, typed evidence edges and retained legacy trails.
- `data/company-origins.json`: 33 dossiers, the wider company inventory and seven families. Stages, milestones and engineering notes each carry direct sources as well as optional edge references.
- `data/research/origins-2026-09/`: original research batches and integration corrections, retained as provenance. The canonical publishable files above include explicit identity normalization and final stage editing; do not blindly overwrite them from a raw batch.
- `scripts/update-connection-papers.py`: opt-in Crossref REST import for DOI-bearing sources already present in the research. It caches metadata, retries rate limits and records failures. It never turns a citation into a mentor, founder or licensing edge. The website makes no runtime API requests to Crossref.
- `data/connection-papers.json`: 15 retrieved paper records, publication metadata and reference DOIs. This is bibliographic context, not a complete bibliography of every company.
- `scripts/build-connections.mjs`: creates `dist/connections-data.js`, `dist/origins-data.js` and the portable `downloads/connections.cy.json` graph.
- Cytoscape.js 3.34.3 is vendored from the npm registry in `assets/`; its MIT license is alongside it. No graph account, API key, remote graph backend or third-party map upload is required.

## Implementation and validation

`src/origins.ts` owns the story/family/coverage UI and profile/search adapters. `src/connection-network.ts` owns graph selection, shortest paths, layouts and cleanup. `src/connections.ts` renders shared relationship evidence. The old centered-card renderer has been removed. Styles are in `origins.css` and the retained evidence/teaser rules in `connections.css`.

Run `pnpm test`, `pnpm check` and `git diff --check`. The connection checks validate graph endpoints, HTTPS sources, dossier evidence, company inventory mappings, independent shortest-path distances, exact neighborhood/list parity, comparison arrows, escaped routes, search, source dialogs, exported files and script order. Inspect actual desktop/mobile layout and graph interactions before publishing source and generated files together. Require the exact GitHub Pages commit to reach `built` and compare deployed content hashes.
