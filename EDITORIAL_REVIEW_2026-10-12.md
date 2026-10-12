# Editorial review — 12 October 2026

This bounded update adds two practical research resources and extends one existing decoder-evaluation note. The site structure, design, source baselines, lab and company records, and scheduled discovery feeds are unchanged. Only the new resources and revised note receive October 12 review dates.

## Primary sources and access scope

- **PosePAL:** read the [IJCV publication](https://link.springer.com/article/10.1007/s11263-026-02976-z), published **23 September 2026**, and the authors’ [repository and setup instructions](https://github.com/Zhuoyang-Pan/PosePAL). The resource and behavior guide distinguish offline 2D annotation from 3D reconstruction and real-time operation. Software was first released in 2025; the journal publication is the new evidence. Python/PyTorch, tracker weights, and Node.js setup requirements are visible. No software installation or benchmark reproduction was performed.
- **PEM-UDE:** read the [PRX Intelligence publication](https://journals.aps.org/prxintelligence/abstract/10.1103/xtb5-mlc8) and [published full-text PDF](https://journals.aps.org/prxintelligence/pdf/10.1103/xtb5-mlc8), published **8 October 2026**, and the [companion repository](https://github.com/Neuroblox/pem-ude), including its demo and dependency file. The computation guide preserves the distinction between simulated model discovery and indirect checks against recordings. The resource warns that reproduction requires separate data and environment work; it does not promise a clean one-command installation. Software was not executed.
- **LaS:** read the [arXiv record](https://arxiv.org/abs/2610.12921) and [version 1 full text](https://arxiv.org/html/2610.12921v1), submitted **9 October 2026**. Table 1, the evaluation setup, and limitations support the decoder-transfer note. The source remains a preprint. Its speech result concerns intracranial recordings; adaptation and validation caveats remain beside the result. Earlier POYO+ and CEBRA readings retain their October 2 scope.

No private research, personal progress, affiliations, or unverified product claims were added. A general hardware-datasheet knowledge-graph preprint was considered but omitted because it did not demonstrate a neural-interface application.

## Repository and scheduled workflow checks

The starting main commit was `4bcb0e15fcbb73e6cbe405cd3312530fa7320882`. Repository editorial and contribution instructions, existing provenance records, source/build layout, and workflow files were inspected before editing. No `AGENTS.md` or repository-local skill instructions were present in the inspected tree.

The existing frontier and jobs workflows keep their Monday **07:17** and **07:30 UTC** schedules. As of the pre-publication check, the latest visible scheduled runs were **5 October**, both successful: [frontier](https://github.com/HowardWHSrun/neurovisual/actions/runs/37337320493) and [jobs](https://github.com/HowardWHSrun/neurovisual/actions/runs/37339803147). No October 12 run was visible yet. No workflow was duplicated, dispatched, or reconfigured; source snapshots were not manually regenerated.

## Validation

- Installed the locked TypeScript 5.9.3 dependency with `pnpm install --frozen-lockfile`, using a writable package-store location.
- `pnpm check` and the full `pnpm test` passed before and after the content changes. The test command includes the complete build, generated-data parity, URL/escaping boundaries, routes/search, source relationships, notebook rendering and controls, labs, company evidence, people/graphs, and NeuroAI checks.
- The library contains **62** resources. Generated JavaScript is included with its source data. The final content diff was reviewed and `git diff --check` passed.
- Automated rendering checks use element doubles and are not a browser visual-regression test. The separate cloud browser could not reach the workspace preview server. Live browser rendering and exact-commit GitHub Pages deployment are checked after publication; this pre-publication record does not claim those checks have already passed.
