# Moore’s Law of Brain–Computer Interfaces

Research snapshot: **15 September 2026**

**Question:** Are invasive brain-interface probes or electrodes doubling approximately every three years, and how do academic laboratories and companies compare?

This folder separates physical probes, electrode sites, recording channels, recorded neurons, and useful BCI performance. They do not share one established growth rate.

## Start here

- [Research brief](RESEARCH_BRIEF.md) — findings, Rice Luan–Xie context, company comparison, and conclusions.
- [Scaling figure](figures/scaling_comparison.png) — selected hardware comparisons and clearly labeled doubling scenarios.
- [Evidence data](data/milestones.json) — dated, sourced measurements with their units and limitations.
- [Methods and lab-history template](METHODS.md) — how to test the three-year hypothesis with comparable observations.
- [Research notes](research/) — source checks and detailed qualifications.
- [Reproduce the analysis](scripts/analyze.py) — generates the figure and numerical calculations from the saved data.

Run from any directory:

```sh
python3 scripts/analyze.py
```

Requires Python 3, NumPy, and Matplotlib. No live network access is needed for reproduction.

## Scope

This is a targeted, primary-source research brief, not an exhaustive systematic review or an audit of a private lab’s equipment. Public research milestones describe published capabilities and experiments. They do not establish when a lab first acquired or routinely used those systems. Company specifications are labeled separately from demonstrated results.
