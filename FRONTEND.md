# Frontend experience

## Layout responsibilities

- `workspace.css` styles the compact navigation shell and the overview, resource catalog, learning paths, dictionary, method comparison, and search dialog.
- `ideas.css` styles the notebook, count comparison, calculator, and research notes. Company photos and video behavior remain in `company-media.css` / `src/company-media.ts`.
- `labs.css` styles directory browsing, institutional rosters, progress comparisons, and source-linked profiles.
- `atlas-experience.css` refines the map, organization rankings, researcher trails, papers, careers, and milestones without changing the research dataset.
- The hub sets `body[data-view]` and `body[data-detail]` for both URL navigation and atlas-origin navigation. Preserve both paths when adding views.

## Search and focus

Global search opens only on request. Typing updates previews without navigating; submitting or choosing a result navigates. Native dialog modality isolates keyboard focus. Escape restores the invoking control, except while an input method is composing text. Method results include the selected method in their destination URL.

The atlas search-height regression came from mixing `flex-direction: column` with `flex: 1 1 250px`: the intended width basis became a height. Its control row now explicitly uses row direction and 42-pixel inputs. Avoid relying on an inherited flex direction. The topbar and atlas toolbar are in normal page flow so they do not cover reading content.

Resource, glossary, and lab filters preserve focus while results rerender. Text composition must finish before updating filtered content. Mobile navigation is visually and keyboard-hidden while closed.

## Verified for this release

- Full `pnpm test`, including retained evidence, media, and calculation checks, plus new dialog, IME, routing, and method-search checks.
- Desktop, 768-pixel tablet, and 320/390-pixel mobile inspection of the section layouts; atlas input heights were 42 pixels in all six views, with no page-width overflow.
- Search preview without navigation, keyboard dismissal/focus restoration, submission and direct method selection; mobile menu open/navigation/close.
- All 17 timeline entries, year search, empty results, Enter-to-detail navigation, and Chinese wrapping on mobile. Timeline spacing represents sequence, not elapsed time.
- Resource empty results and input clearing with focus retained; alphabetical glossary filtering; method selection; lab section jumps; calculator updates and channel-metric controls.

CSS changes need direct browser inspection in addition to TypeScript and content tests. Keep generated JavaScript and source files together in releases.

## Inline visual system (15 September 2026)

- `data/visuals.json` is the canonical selected lab-media registry; `scripts/build-visuals.mjs` generates `dist/visuals-data.js`. Company photographs and films remain in `data/ideas.json`.
- `src/visuals.ts` / `visuals.css` supply the picture gallery, overview photo entry, lab photographs, image dialog, idea-side illustrations, and interactive 32-site / 8-channel / 6-example-unit explanation. The example is explicitly illustrative. The dialog traps native focus, closes with Escape, returns focus, and clears video frames on close. Bind calls are idempotent.
- `src/field-visuals.ts` / `field-visuals.css` draw sourced explanatory schematics for methods, topics, learning, resources, glossary, and labs without a sourced photograph. These are original code-native illustrations, not experimental figures.
- `src/atlas-visuals.ts` / `atlas-visuals.css` place photographs or method-specific illustrations inside the selected technology, organization, researcher, paper, and career panels. Exact profile matches control photo association; broader matches use clearly labeled reading diagrams.
- `NeuroMedia.resetPlayers()` restores posters when leaving an outgoing panel, so hidden iframes do not continue playing. YouTube remains click-to-load and retains a direct-link fallback when the client blocks playback.
- Keep the current load order: guide data, company and idea data/renderers, lab and visual data, visual renderers, labs, atlas visual renderer, atlas app, hub router. TypeScript is compiled as classic scripts.

See `VISUAL-PLAN.md` for the route-by-route revision checklist. `pnpm test` validates media provenance fields, dataset parity, unique IDs, source and route links, and interactive count stage behavior. Real browser checks cover layout and remote image loading.

## Research connections (15 September 2026)

- `#connections` adds a focused relationship map and an equivalent readable list. Source-backed stories connect people, training, labs, companies, research platforms and technical comparisons.
- `data/connections.json` → `scripts/build-connections.mjs` → `dist/connections-data.js`; `src/connections.ts` / `connections.css` render it. Load connection data and renderer after the visual renderer, before profile renderers and the hub.
- `NeuroConnections.teaser()` provides exact-identity links from company, researcher, technology, lab and company-notebook profiles. Global search indexes connection records. The overview and main navigation provide entry points.
- Institutional portraits join the existing image viewer and the gallery’s People category. Device and lab photos retain their original captions.
- The map preserves source-to-target arrow direction regardless of card placement; comparisons use dashed paths without arrowheads. Native selects, a readable list, evidence focus/scroll, history URLs, and observer cleanup support navigation.

See `CONNECTIONS.md` for provenance rules, important historical distinctions and extension instructions.
