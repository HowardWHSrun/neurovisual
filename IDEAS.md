# Growing the Ideas notebook

The notebook is the ongoing home for neuroengineering observations and research questions. It lives at [`#ideas`](https://howardwhsrun.github.io/neurovisual/#ideas); the first collection asks how electrode counts grow and what those counts mean.

## Add the next thought

1. Copy the object in `data/idea-template.json` into the `ideas` array in `data/ideas.json`. Choose a permanent, lowercase hyphenated `id`.
2. Write the question and a short summary. Keep `observation` tied to a named source and its study context. Put your proposed explanation in `interpretation` and the next experiment or comparison in `test`.
3. Use `revision` to state what evidence would change the idea. Add sources as `{ "title": "...", "url": "https://..." }`. Include original papers or company announcements and identify which is which.
4. Set `updated` and append a `history` item `{ "date": "YYYY-MM-DD", "change": "What changed and why" }`. Use `related` for other idea IDs and `organizations` for existing atlas IDs (for example, `neuralink`). These are relationships, not endorsements.
5. Use a clear status such as `Open hypothesis` or `Evidence review`. Leave unknown counts unknown. The notebook's current hypotheses were drafted with AI assistance; revise them into your own position as your thinking develops.
6. Run `pnpm test` and `pnpm check`. Commit both content and generated `dist/ideas-data.js` / `dist/ideas.js` before publishing. New standard notes automatically appear in the index and global search at `#ideas/<id>`.

This is a file-backed notebook: it does not store unpublished thoughts through a browser form. The authored JSON is the source of truth. Keep implementation details here; public notes should focus on the research question.

## Revise the counting evidence

`data/neural-counts.json` is the published milestone ledger, initially copied from the adjacent **Moores Law of Brain-Computer Interfaces** research folder. Each row needs a counting denominator, study model, evidence type, date basis, source, and limitations. Sites, simultaneous channels, working signals, neurons, and decoder features are different measures. An endpoint comparison is not a fitted growth law.

The archived analysis is in `downloads/moores-law/`. To revise the evidence:

1. Review the primary source and update the research folder's `data/milestones.json` and relevant brief/methods/notes.
2. Run its `scripts/analyze.py` with NumPy and Matplotlib installed. Review its calculations and figures.
3. Copy the revised ledger to `data/neural-counts.json` and the revised research package to `downloads/moores-law/`. Keep the downloadable README commands portable; do not publish local machine paths.
4. Regenerate `downloads/moores-law-research.zip` with `moores-law/` as the archive root. The checks enforce equality between the web and downloadable ledgers.
5. Review displayed comparisons and company cards against the revised evidence. The four selected Neuropixels configurations in `src/ideas.ts` are an explicit comparison, not an automatically chosen record frontier. Review their IDs and explanatory text when changing that comparison.
6. Advance only the dates actually reviewed. An Ideas review does not refresh all atlas records or the resource library.

Company strategy records live in the `companies` array in `data/ideas.json`. Separate `evidence` from `thought`, `bottleneck`, and `question`. Describe plausible experiments as hypotheses; do not invent corporate roadmaps. Use `org` to link to an existing organization profile; leave it empty for a research platform without a matching organization.

## Routes and implementation

- `#ideas` — notebook index.
- `#ideas/moores-law-bci?section=counts&metric=channels` — comparable-count explorer.
- `#ideas/moores-law-bci?section=companies&company=precision` — a shareable company comparison.
- `#ideas/moores-law-bci?section=evidence` — full ledger and research downloads.
- `#ideas/readout-budget` — raw acquisition calculator.

`scripts/build-ideas.mjs` compiles JSON into a local classic script. `src/ideas.ts` renders and binds the notebook; `ideas.css` styles it. The hub owns navigation; the atlas links organization profiles back to the corresponding counting strategy. Tests cover data integrity, rendered states, URL/focus behavior, and arithmetic with element doubles. They do not substitute for browser/layout review.
