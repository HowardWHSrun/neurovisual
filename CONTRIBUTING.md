# Contributing to Neurovisual

Use an issue or pull request to propose a correction, a resource, or a coverage improvement. Include the original source and the date you checked it.

## Resources and topic guides

Edit `src/hub-data.ts`. Each resource has a stable `id`, title, HTTPS URL, brief description, topic, type, and suggested level. Prefer official documentation, open datasets, university courses, and primary research sources. The resource should help a reader take a concrete next step.

- Use an existing topic ID or add a coherent topic guide and update related links.
- Use `Course`, `Dataset`, `Hardware`, `Standard`, `Tool`, or `Tutorial` as the resource type.
- Use `Beginner`, `Intermediate`, or `Advanced` as editorial guidance, not a formal prerequisite guarantee.
- Verify the destination and describe what it actually provides. Do not imply that open documentation means all software, data, hardware, or compute is free.
- Learning steps reference resource IDs; keep those IDs stable.
- Advance the displayed resource review date only after reviewing the resource collection.

## Atlas evidence

Preserve source URLs, dates, uncertainty, and the scope of numerical claims. Distinguish company claims from independent results, human studies from animal models, trial registration from efficacy, and regulatory authorization from broader clinical usefulness. Funding, institutional budgets, workforce, and trial counts are not a quality ranking.

Keep historical records labeled with their actual dates. Do not label a resource or opportunity as current just because an automated snapshot was generated. A manually curated job needs its own availability check; failed source refreshes must remain visible.

## Code changes

Keep existing atlas views and organization URLs working. The hub owns browser routes; `window.neuroAtlas` provides a catalog and navigation adapter. Atlas-origin view events use `internal: true` so the hub updates the URL and navigation without clearing local state.

Escape external text at its HTML boundary with `hubUtils.escapeHtml`; validate outbound source links with `hubUtils.sourceHref`. Keep original, unescaped data for filters and copied research prompts. Use native controls and preserve keyboard focus when lists rerender.

Run `pnpm test` and `pnpm check`. Commit the generated JavaScript alongside the TypeScript. Validate changes under a GitHub Pages subdirectory. When browser testing is performed, cover desktop and mobile navigation, search, filters, profile links, back/forward behavior, empty results, and keyboard operation; record what was actually tested.
