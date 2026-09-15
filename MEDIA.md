# Pictures, films, and inline diagrams

## What ships

- Six company/platform pictures, with their six existing official films.
- Twelve university/lab image stories, with five additional institutional films.
- Inline imagery in lab, organization, technology, researcher, and idea views.
- Original, labeled diagrams for methods, topics, learning paths, resources, glossary, papers, careers, and other lab profiles.

The image gallery is at `#visuals`. It supplements the pictures placed beside the relevant explanation. All images are still served by their credited original hosts; no third-party image archive is copied into this repository.

## Add a research picture

1. Add a record to `data/visuals.json` whose `labId` exactly matches `data/labs.json`.
2. Include a concise title and research focus, plus image URL, accurate alt text, caption, credit, and the original institutional source page.
3. State the study context in the caption: actual device, manufacturer illustration, animal experiment, in-vitro preparation, or human research. Do not turn a publicity photograph into a performance claim.
4. If the source explicitly supplies a license, retain its label and URL in `image.license`. The current MIT image uses **CC BY-NC-ND 3.0**, and the EPFL image uses **CC BY-SA 4.0**. Source attribution alone does not establish an open license.
5. An optional `video` object needs an exact YouTube ID, verified title/channel, source page, and a description that distinguishes it from a different pictured project.
6. Run `pnpm test`, inspect the image and caption in both its profile and the gallery, and check mobile layout before publishing source plus `dist/`.

Company imagery uses `data/ideas.json` → `companies[].media`. `image.kind` distinguishes a photograph, illustration, or video preview. Keep the original films when replacing a preview with a device picture.

## Rendering rules

- Scientific figures and device close-ups use `object-fit: contain` to preserve panels and labels.
- The modal image viewer retains the caption, credit, license, and research link.
- Photos match exact organization or investigator relationships. A general schematic is labeled as such and must not imply an experimental result or the wrong access route.
- Media handlers are idempotent; atlas panels can bind them after local redraws.
- Video frames are created only after play. Leaving a panel restores its poster so a hidden film does not continue playing. Client-blocked embeds retain a direct YouTube link.

## Verification for this release

All six company image URLs and the institutional image sources were checked against primary pages. Browser checks confirmed the six company pictures render, including Blackrock and Paradromics hosts that reject command-line HEAD requests. Source oEmbed metadata confirmed the five added university films; playback depends on the browser/client permitting YouTube embeds.

## People in the connection map

`data/connections.json` can include an institutional portrait on a person node, with the same `VisualImage` fields. `NeuroVisuals.items()` adds it to the People gallery and the native image viewer; `media: person-<node-id>` references it in the connection context panel. Zhao’s portrait remains hosted on his UCAS faculty profile. A source credit does not establish a reuse license or identify a photographer. Preserve the original image and its provenance.

## Origin stories and network (15 September 2026)

Origin pages reuse existing credited device images where available. Other entries use simple interface schematics labeled as such; these are not representations of a particular commercial device. Company histories remain linked to the full atlas and visual library. Cytoscape shapes identify entity types, not logos. No remote media is copied into the repository for this feature.
