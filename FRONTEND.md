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
