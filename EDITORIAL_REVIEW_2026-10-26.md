# Editorial review — 26 October 2026

This bounded update adds one review resource and extends the existing decoder-transfer note. The resource count is 64, and the About-page selective-review date is updated. Site structure, design, collection baselines, lab and NeuroAI dossiers, and scheduled feeds are preserved. No personal progress, affiliations or private information are added.

## Sources and review scope

- Read the [publisher record and full HTML](https://www.nature.com/articles/s44385-026-00119-0) for Gu et al., **Generalizable neural decoding for clinically scalable brain-computer interfaces**, published **23 October 2026** in *npj Biomedical Innovations*. It is a peer-reviewed **Review**. The introduction, transfer discussion, hardware constraints and conclusion support the added context. The resource identifies its evidence type; the note separates observation from a proposed editorial reporting extension. Earlier POYO+, CEBRA and LaS evidence was not re-reviewed.
- Assessed the [21 October CorTec announcement](https://cortec-neuro.com/news/cortec-brain-interface-electrodes-record-stable-signals-for-more-than-four-years). It is company reporting on nonhuman-primate epidural cortical-surface arrays, not penetrating probes. The underlying conference paper was not independently reviewed, so no claims or numerical results from this announcement were added to the site.

Canonical source links are retained; Nature's cookie-error redirect allowed HTML reading. Research software and experimental results were not reproduced. These leads did not justify new lab or NeuroAI project records or advancing their collection dates.

## Repository and workflow checks

Starting main and fresh pre-publication origin/main: `53197275b2e7932418bd943fcd704bcf39bece59`. Inspected contribution/editorial instructions, existing source provenance, content schemas, generated assets and both workflow definitions before editing. No repository-local `AGENTS.md` or `SKILL.md` was found.

Pages serves main at `/`. Existing Monday frontier **07:17 UTC** and jobs **07:30 UTC** schedules remain unchanged. Latest visible runs at the pre-publication check were October 19, both successful: [frontier](https://github.com/HowardWHSrun/neurovisual/actions/runs/39271043460) and [jobs](https://github.com/HowardWHSrun/neurovisual/actions/runs/39273028496). No October 26 run was visible. Neither workflow was duplicated, dispatched or reconfigured; feeds were not regenerated.

## Validation

- Used task-local Node.js 22.20.0 and pnpm 10.18.3; installed locked TypeScript 5.9.3 with `pnpm install --frozen-lockfile` and a task-local package store.
- `pnpm check` and full `pnpm test` passed, including the build, generated-data parity, content/source relationships, URL and escaping boundaries, search/routes, notebook controls, labs, people and NeuroAI checks.
- Browser inspection beneath the local `/neurovisual/` path verified the added resource, its source URL and evidence label, the revised note and date, global search discovery, Review filtering, empty results, Tab focus movement, Escape dismissal, and back/forward behavior. Screenshots inspected at default desktop and 390 × 844 mobile sizes; mobile navigation to Ideas worked. This was selective validation, not a complete interaction or profile-link audit. Temporary viewport override was reset.
- Reviewed the exact source and generated diff; `git diff --check` passed. Source and compiled JavaScript are committed together.
- An environment interruption delayed browser validation; work resumed with the seven edits preserved and fresh main unchanged. Exact commit deployment and served-content verification are post-publication checks reported separately, not claimed by this pre-publication record.
