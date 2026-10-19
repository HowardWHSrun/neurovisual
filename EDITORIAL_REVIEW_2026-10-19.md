# Editorial review — 19 October 2026

This bounded update adds one resource, two guide examples and evidence context for the existing readout-budget note. The resource count and About-page selective-review date are corrected. Design, navigation, collection baselines, lab and NeuroAI dossiers, and scheduled feeds are preserved. No personal progress, private information or affiliations are added.

## Primary sources and access scope

- **Multiplexing:** read the [publisher record](https://www.nature.com/articles/s41528-026-00654-1) and [accepted full-text PDF](https://www.nature.com/articles/s41528-026-00654-1_reference.pdf). Published **19 October 2026**, accepted **1 October**; a peer-reviewed **Review** awaiting the final Version of Record. Sections on bidirectional neural interfaces, requirements and architecture selection, and Table 5 support the added engineering context and benchmark-comparability caveat. This is a literature synthesis, not a new device demonstration. Earlier BISC/Rice evidence and calculator assumptions were not re-reviewed; the note history records that scope.
- **RL and rTMS:** read the [publisher record](https://www.nature.com/articles/s41746-026-03417-4) and [accepted full-text PDF](https://www.nature.com/articles/s41746-026-03417-4_reference.pdf). Published **19 October 2026**, accepted **5 October**; a peer-reviewed research article awaiting the final Version of Record. The abstract, evaluation setup and limitations support the neuromodulation example. The guide identifies the retrospective cohort, held-out clinics, association, modeled episode-wide projections, and need for prospective testing. Session-level policy evaluation is distinct from real-time neural-feedback control. No clinical recommendations are made.

Publisher HTML redirects required its cookie-error fallback to read; canonical article links are retained. Research software, hardware and clinical results were not reproduced. These leads do not justify new lab affiliations or a NeuroAI project dossier, so those collections retain their prior evidence dates.

## Repository and workflow checks

Starting main: `1318b6103187ab3df25cce9d3f042052d51d00ea`. Reviewed contribution/editorial instructions, existing provenance, content schemas, generated assets and workflow files before editing. No repository-local `AGENTS.md` or `SKILL.md` was present.

GitHub Pages serves `main` at `/`. The existing Monday frontier **07:17 UTC** and jobs **07:30 UTC** workflows are unchanged. At the pre-publication check, the latest visible scheduled runs were October 12, both successful: [frontier](https://github.com/HowardWHSrun/neurovisual/actions/runs/38279426505) and [jobs](https://github.com/HowardWHSrun/neurovisual/actions/runs/38280664918). No October 19 run was visible. Neither workflow was duplicated, dispatched or reconfigured, and feeds were not manually regenerated.

## Validation

- Installed locked TypeScript **5.9.3** with `pnpm install --frozen-lockfile` and a task-local package store.
- `pnpm check` and the full `pnpm test` passed, including the build, generated-data parity, source relationships, URL/escaping boundaries, routes/search, notebook controls, labs, people, company records and NeuroAI checks. The resource count is **63**.
- Generated JavaScript is committed with source changes. Final content diff reviewed; `git diff --check` passed.
- Automated rendering checks use element doubles, not a browser. Browser inventory was empty in this environment; desktop/mobile visual and interactive inspection could not be performed. No layout or interaction code was changed.
- Exact remote commit, Pages deployment and served asset verification are post-publication checks and are reported separately; this pre-publication record does not claim they already passed.
