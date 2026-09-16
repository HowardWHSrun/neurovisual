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

## Origins and connections (15 September 2026)

- The default `#connections` view is a directory of 33 researched company histories, each with three stages, milestones, original sources and evidence gaps. Technology families provide an explanatory taxonomy. Coverage lists all 120 wider-atlas companies and shows which have origin dossiers.
- `src/origins.ts` supplies the story views; `src/connection-network.ts` uses vendored Cytoscape.js for neighborhoods, whole-network exploration and shortest paths. `src/connections.ts` retains shared source evidence. See `CONNECTIONS.md` for data and route contracts.
- `NeuroConnections.teaser()` links exact company, researcher, technology and lab identities to the appropriate story or network. Global search includes graph entries; company-directory search includes referenced people and relationship text.
- Filters remain compact, submit explicitly and restore focus. Mobile stories stack vertically, graph paths adapt to canvas width, and every graph edge also appears in a keyboard-readable list. Source dialogs restore trigger focus on close.
- Builds create both data globals and a portable Cytoscape graph. Crossref imports are cached at authoring time. The deployed site does not depend on live graph or bibliography APIs.

## Reader organization (15 September 2026)

- `organization.css` defines the three navigation groups, the beginner landing page (`#overview`, labeled Start here), and the topic directory (`#topics`). Existing section and record links continue to work.
- Navigation uses native details elements. `setWorkspace` opens the active group for both hash navigation and atlas-originated view changes; topic routes highlight Topic guides and show the topic title in the location bar.
- `guide-reading.css` keeps visual introductions visible and organizes complete topic guides into expandable sections. Expand all details opens the complete guide, including resources; individually toggling sections updates the button state.
- The recommended reading sequence starts with the whole BCI system, then recording and signal interpretation. Learning cards show prerequisites and outcomes before the expandable four-step preview; project pages open the first step and leave assessment criteria visible.
- Content remains in the page when collapsed. Source links, concepts, worked examples, pitfalls, learning instructions, and evaluation criteria are retained.

## Four exploration views (15 September 2026)

- `#explore?by=organizations|problems|people|countries` supplies four views of the same research. The default is problems. `problem` and `country` parameters can be combined; country pages link back to their relevant problem groups.
- `data/exploration.json` holds purpose-based selections and a reason/source for each lab link. Direct focus and enabling research are different labels. Problem group membership is editorial and overlapping, not a claim of a demonstrated treatment outcome.
- `data/exploration-people.json` supplies short entry stories using existing graph IDs, relationship types, and exact sources. Graph edge direction is preserved. Training, co-authorship, collaboration, and founding are kept distinct.
- `scripts/build-explore.mjs` generates `dist/exploration-data.js`. Load this and `dist/explore.js` before the hub router. `window.neuroAtlas.organizations` exposes the existing named country fields for company discovery; no country is inferred from text search.
- Country guides include exact mapped lab and company locations. Counts measure collection coverage. Global and European Union entries appear separately as work across countries. Long lists initially show eight entries with the rest in native disclosures.
- Home and exploration images retain their research captions and original sources. The home microscopy shows expansion-microscopy research from MIT; photographs and experimental figures are kept distinct from explanation diagrams.
- Explore navigation pushes history and moves focus to the main content. Changing the country selector keeps focus on the replacement selector. Ordinary modified clicks remain native.

## People and focused explanations (15 September 2026)

- `#people` is the publication-influence directory; `#people/<id>` shows metrics, identity evidence, indexed papers and documented graph connections. Research-area filtering keeps cohort ranks stable. Profile links retain the results page and filters. `#person/<id>` retains the original research trail.
- `#people?view=compare` places two people side by side; `#people?view=method` explains matching, metrics and weighted percentiles using a real example. Unknown identities and missing metrics never become fabricated zero scores.
- `src/visuals.ts` now presents four focused sections: device pictures, labs, people, and neural counts. The illustrative 32-site /8-channel /6-unit journey has one active step, visible context and direct controls.
- `people.css` adapts the ranked table to compact cards on phones. Native forms, focus restoration and result-page links support keyboard browsing.

## NeuroAI and brain models (15 September 2026)

- `#neuroai` adds a project collection, detailed source trails, and separate explanation and learning views. `neuroai.css` gives these views a shared visual language with layouts appropriate to their function.
- `data/neuroai.json` holds reviewed evidence and credited media. Its resources join the main resource library; project records join global search. `src/neuroai-learning.ts` adds a guide, glossary terms and two practical paths.
- The explanation has four native buttons with one active layer. Stage changes push history and restore focus; project filters submit explicitly and keep search focus. Controls are compact and remain in normal document flow.
- Original research images have source captions. Code-native diagrams describe the system and do not claim to show experimental results. YouTube players use the existing click-to-load behavior and are cleared on route changes.
- See `NEUROAI.md` for scope, evidence standards and extension instructions.

NeuroAI release verification: full `pnpm test` and `pnpm check` passed. Browser checks covered the project collection, source-linked dossiers, the four explanation layers, filtered search/focus and browser back, plus 390- and 320-pixel phone layouts. Original images were checked against their source pages; tall publication figures use contained, uncropped bounds and an original-image link. This browser blocked the YouTube embed, and the poster/direct-link fallback recovered correctly. Research software was not executed.

## Native people map (15 September 2026)

- `#explore?by=people` uses the bundled Cytoscape renderer and the existing documented graph. It includes people, companies, institutions, and labs; conceptual technology links remain in the wider research network.
- The first visit opens a labeled example neighborhood; `overview=1` shows the whole map. Search opens a direct neighborhood; `focus`, `depth`, and `relation` preserve the view in the URL. `node` and `edge` preserve the selected detail. Selecting entries updates the panel without recreating the graph or resetting pan and zoom.
- Training, founding, and work filters organize exact sourced edge labels. Node positions and uniform sizes carry no importance ranking. A readable list provides equivalent entry and relationship access without the canvas.
- `dist/people-map.js` loads before `dist/explore.js`; the hub destroys its graph, event handlers, and observer before route changes. `scripts/check-people-map.mjs` covers filtered neighborhoods, source fidelity, search, routing, selection, and lifecycle cleanup.
