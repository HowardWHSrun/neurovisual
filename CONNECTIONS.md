# Research connections

Neurovisual's `#connections` view connects research people, institutions, laboratories, companies, programs and technologies. Start with eight curated stories or choose any mapped entry. This is an expanding, selected index, not a complete genealogy of neuroengineering.

## Reading the map

- Select a name to center its direct relationships; select a relationship to open its evidence.
- Solid arrows read from subject to object. A training link, a founding role, a hardware-use relationship and an explicit license are different claims.
- Dashed links have no arrowheads. They are editorial technical comparisons supported by the linked technical descriptions, not historical descent.
- The people/organizations and technical lenses filter relationships, not node types. The readable list carries the same relationships as the map.
- Browser URLs preserve the selected node, story, lens, display and evidence. Back/forward restores them. Images retain the existing source credit and native image viewer.
- Node placement balances readability; position and distance are not quantities, dates, influence or importance. Only direct relationships around the selected node are shown; a guided story's entry trail provides jumps across several steps.

## Evidence decisions in this release

**Zhengtuo Zhao / Chong Xie / StairMed:** Xie's lab roster identifies Zhao as a former PhD student. Zhao's UCAS biography places the doctorate at UT Austin, September 2015–August 2019, and lists a combined UT Austin/Rice postdoctoral interval. Rice documents him as a postdoc in May 2020. The graph does not label the doctorate as a Rice degree or infer sole formal supervision. Xue Li is independently listed as a former PhD student and disclosed as a StairMed founder.

**NET → MERF → human uFINE:** The later papers explicitly describe fabrication and assembly based on the earlier work. StairMed hardware in the human uFINE study is a separate relationship. Temporary intraoperative recordings do not establish a chronic wireless implant, and no university patent license to StairMed is inferred.

**Company origins:** Rapoport connects Neuralink and Precision through documented co-founding roles. Rice explicitly describes Motif as a Robinson-lab spinout. Melbourne documents the Synchron founders and multi-institution development. Utah explicitly documents technology licensing to Blackrock. These different relationships must retain their labels.

**Technical branches:** Neuropixels Ultra uses the NP 1.0 platform; do not draw NP 1.0 → NP 2.0 → Ultra as a single succession. Precision/BISC, NET/Neuropixels, and vascular/subdural comparisons are labeled editorial. Physical sites, concurrent channels, reference contacts and identified neurons remain different quantities.

Dates retain their meaning: event dates where established; source dates marked “reported” or “published”; undated events remain undated. Current affiliations are not retroactively applied to training.

## Maintaining it

1. Edit `data/connections.json`. Every edge needs stable endpoints, an exact relationship label, `category`, `basis`, date context, supporting detail and original-source links. Add a limitation when readers could reasonably overinterpret the edge.
2. Nodes can link to an existing profile with `href` and exact alternate profile routes with `aliases`. `media` references the existing visual library. Institutional portraits use `image` with URL, alt text, caption, source and credit; `NeuroVisuals` includes them in its People gallery and image viewer.
3. Each story lists a connected set of entries and evidence edges. The first edge must touch the story's initial focus. The trail is a set of navigation stops, not a chain of unlabeled causal arrows.
4. Run `pnpm test`, `pnpm check`, and `git diff --check`. `scripts/build-connections.mjs` generates `dist/connections-data.js`; TypeScript generates `dist/connections.js`.
5. Inspect desktop/mobile maps, list parity, filters, selected source, source credit, image viewer, profile entry points, search and browser history. Publish source and generated files together; verify the exact Pages build and deployed hashes.

The implementation is in `src/connections.ts` and `connections.css`. SVG connectors follow the actual card positions, with arrowheads only for documented directed statements. A ResizeObserver updates geometry and disconnects when leaving the view. All relationship text, URLs and image metadata use the hub's safe rendering helpers.
