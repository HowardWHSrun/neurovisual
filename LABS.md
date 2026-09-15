# Developing the research directory

The research directory lives at `#labs`. The canonical content is `data/labs.json`. A build creates `dist/labs-data.js` and a readable, source-linked dossier at `downloads/lab-research/research-directory.md`.

## What a profile contains

Each profile has a stable ID, institution and location, named investigators, research areas, an overview and approach, methods and measured signals, at least two documented projects, a progress measure, study context, an editorial question, and source records. Each project and interpretation cites source IDs local to that profile.

- `summary` and `approach`: describe specific engineering work, with `overviewRefs`.
- `projects`: each entry has `title`, `detail`, `stage`, and `refs`. State human, animal, in-vitro, computational, or proposed-program scope.
- `scale`: a source-informed measurement lens, not a lab ranking. Keep sites, simultaneous acquisition, wireless throughput, isolated neurons, stimulation outputs, and study participants separate.
- `translation`: explain the evidence's practical boundary without inventing a regulatory status.
- `nextQuestion`: an editorial question, visibly distinguished from a claimed lab result.
- `sources`: stable local reference `id`, `title`, `url`, `kind`, and optional `published`. Dates may be a year, year-month, or full date. Use source dates; do not substitute the review date.
- `verified`: source-page review date. Reading a dated project page does not prove that project is still active.
- `atlasIds`: related existing organization IDs. A center may link to several lab profiles; all matching profiles appear on its page.
- `affiliation`: optional fuller affiliation or collaboration context when the filter uses a shorter institution name.

`schools` stores institutional discovery pages. Use the same institution label as the matching lab where appropriate; a wider directory can legitimately contain additional institutions without detailed profiles.

## Adding or revising work

1. Begin with the school's own department/center roster, then inspect lab projects and primary studies. Record which claims each source supports.
2. Copy a complete profile in `data/labs.json`, assign a new ID, and replace all content and source IDs. Use the existing seven research-area labels. Do not infer missing counts or clinical outcomes.
3. Add a school discovery page if it exposes neighboring groups. Avoid presenting an old brochure as a current faculty census.
4. Run `pnpm test` and `pnpm check`; inspect the rendered profile and relevant filters on desktop and mobile. Commit source data, compiled scripts, and the generated dossier together.

## Coverage and interpretation

The September 2026 release is a broad selected survey, not an exhaustive census. Institutions have overlapping centers and affiliations; counts describe the directory's records. An absent lab is not a negative assessment. The original atlas remains available with its own editorial dates and evidence limitations.

The diagrams are original qualitative symbols for research areas. They encode no measured electrode geometry, neural connectivity, or experimental result.

## Release validation

The automated checks render every profile, resolve project references and atlas relationships, compare source data with generated assets, and exercise filtering, pagination, global search, routes, and text-input composition. Browser checks cover desktop and 390-pixel mobile layouts, search focus, empty results, Rice and university filters, topic controls, profile navigation, and links from the original atlas. The existing company-media and ideas checks remain in the full test run.
