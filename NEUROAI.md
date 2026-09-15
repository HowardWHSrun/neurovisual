# NeuroAI: from curiosity to a testable question

The NeuroAI area extends the field guide from neural interfaces into connectomics, brain modeling, biological inspiration for AI, and living neural computing. It connects interesting demonstrations to the measurements, assumptions, tools and tests behind them.

## Reader routes

- `#neuroai`: a visual, searchable project collection with four directions: map and measure; model and emulate; learn from brains; compute with cells.
- `#neuroai/<id>`: a project dossier with original sources, publication dates, images or labeled explanatory diagrams, practical tools, evidence limits and a clearly labeled editorial research question.
- `#neuroai?view=explain&stage=0`: a four-step explanation—Map, Model, Act, Test. One layer is shown at a time; buttons and browser history retain the selected layer.
- `#neuroai?view=learn`: entry paths and practical resources.
- `#topic/neuroai`, `#learn/connectome`, `#learn/neuroai`: a topic guide and two guided projects using real tools.
- `#ideas/fly-circuit-learning`, `#ideas/connectome-to-model`: evolving ideas with observations, interpretations, proposed tests and revision criteria kept separate.

Project names enter global search. The glossary defines the new terms, and the resource library filters the same practical tools by the NeuroAI topic. The existing BCI, people, lab, company and connections sections remain available.

## Interpret the examples carefully

Stonkfly is a **software simulation** based on a documented male-fly connectome release. Its public repository describes reward input, plasticity, a fixed action readout and a trading interface. It does not establish profitable learning; the author's social post alone does not independently verify funded trades. The research note proposes evaluation with recorded data and simulated money.

The male CNS map, the female FlyWire brain, and the female BANC nervous-system map have different specimens, coverage and releases. Keep those distinctions visible beside numbers. Anatomical synapses, weighted graph edges, calcium traces and electrical recording channels are different units. Portal totals can differ from a publication; do not silently reconcile them.

The Shiu computational model, Eon's embodied demonstration, and the company's long-term mind-uploading goal are separate claims. An engineering controller connecting a model to a virtual body is part of the system to evaluate. Numerical validation of particular circuit predictions is not a percentage of all fly behavior reproduced.

Predictive neural models are useful without being mechanistic copies of brains. Likewise, a cell culture or organoid experiment has a specific preparation, feedback interface and endpoint; it is not an intact animal brain.

## Content and implementation

| File | Responsibility |
| --- | --- |
| `data/neuroai.json` | Curated project records, sources, evidence labels, related projects, credited media and tools |
| `src/neuroai.ts`, `neuroai.css` | Project collection, dossiers, interactive explanation and learning entry page |
| `src/neuroai-learning.ts` | Topic, guide, glossary definitions and learning-path integration |
| `scripts/build-neuroai.mjs` | Generate the classic-script data payload |
| `scripts/check-neuroai.mjs` | Validate the data, rendering and interactions |

Load the data after the core guide data and before the NeuroAI modules. Commit the generated `dist/neuroai*.js` with the sources. The application is static: it does not fetch live scholarly metrics, run neural simulations, connect to exchange accounts, or require a private API key.

## Adding a project

1. Identify the primary paper, official project documentation or author's repository. A social demonstration can be a discovery lead, with its claim attributed.
2. Write one useful question and a short account of what the system actually does. Specify whether it is biological tissue, a structural reconstruction, a computational model or an embodied controller.
3. Preserve source dates, dataset versions, access conditions and count denominators. Label preprints, company demonstrations and personal experiments.
4. Add original media only with a verified URL, source, credit, caption and alternative text. Schematics must be labeled as explanations. YouTube loads only after a click and has a direct-link fallback.
5. Link related projects and one practical next step. Explain account, installation or restricted-access requirements where material.
6. Label the proposed next test as an editorial question. Do not present a proposed experiment as a reported result.
7. Run `pnpm check` and `pnpm test`; inspect desktop and mobile routes, keyboard behavior, filters, images and browser history. Update the review date only for material actually reviewed.

## Review scope

The September 15, 2026 review inspected primary research, official project pages, documentation and public source repositories. Link and media checks establish accessibility at review time. The research software and models were not installed or reproduced as part of this website update. Third-party images and players may become unavailable; credited original-source links remain available.
