#!/usr/bin/env python3
"""Reproduce descriptive calculations and figures; no network or pooled fitting."""
import json
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "data/milestones.json").read_text())
rows = {r["id"]: r for r in data["milestones"]}
assert len(rows) == len(data["milestones"]), "Duplicate milestone ids"
for r in rows.values():
    assert r["year"] <= 2026
    assert r["source"].startswith("https://")
    for key in ("sites", "simultaneous_channels"):
        assert r[key] is None or (isinstance(r[key], int) and r[key] > 0)


def endpoint(first, last, metric, last_year=None):
    a, b = rows[first], rows[last]
    n1, n2 = a[metric], b[metric]
    years = (last_year if last_year is not None else b["year"]) - a["year"]
    ratio = n2 / n1
    return {
        "first_id": first, "last_id": last, "metric": metric,
        "first_value": n1, "last_value": n2, "elapsed_rounded_years": years,
        "ratio": ratio,
        "endpoint_equivalent_doubling_years": years / math.log2(ratio) if ratio > 1 else None,
        "interpretation": "Descriptive endpoints only; no exponential fit. Rounded publication years unless named availability comparison."
    }


calc = {
    "cutoff": data["research_cutoff"],
    "scenarios": [{"doubling_years": d, "annual_growth_percent": 100*(2**(1/d)-1),
                   "relative_growth_after_12_years": 2**(12/d)} for d in (3, 7.4)],
    "comparisons": {
        "np1_to_ultra_sites": endpoint("np1_2017", "np_ultra_2025", "sites"),
        "np1_to_ultra_channels": endpoint("np1_2017", "np_ultra_2025", "simultaneous_channels"),
        "np1_to_np2_single_sites": endpoint("np1_2017", "np2_single_2021", "sites"),
        "np1_to_np2_four_sites": endpoint("np1_2017", "np2_four_2021", "sites"),
        "np1_to_quad_preprint_channels": endpoint("np1_2017", "np_quad_2026", "simultaneous_channels"),
        "np1_to_quad_availability_channels": endpoint("np1_2017", "np_quad_2026", "simultaneous_channels", 2025)
    }
}
assert abs(calc["comparisons"]["np1_to_ultra_sites"]["ratio"] - 6.4) < 1e-9
assert calc["comparisons"]["np1_to_ultra_channels"]["ratio"] == 1
assert rows["precision_2025"]["sites"] == sum(rows["precision_2025"][k] for k in
    ("recording_sized_contacts", "stimulation_optimized_contacts", "reference_contacts"))
assert rows["net_2022"]["sites"] == 18 * rows["net_2022"]["sites_per_module"]
(ROOT / "data/calculations.json").write_text(json.dumps(calc, indent=2) + "\n")

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 11,
    "axes.spines.top": False, "axes.spines.right": False, "axes.titleweight": "bold",
    "figure.facecolor": "#fbfaf7", "axes.facecolor": "#fbfaf7", "text.color": "#182c3c",
    "axes.labelcolor": "#182c3c", "xtick.color": "#182c3c", "ytick.color": "#182c3c"})
fig, (left, right) = plt.subplots(1, 2, figsize=(15, 7), gridspec_kw={"width_ratios": [1, 1.22]})
fig.subplots_adjust(left=.065, right=.98, top=.76, bottom=.29, wspace=.26)
fig.suptitle("A Moore’s law for BCI depends on what you count", x=.065, y=.97,
             ha="left", fontsize=22, fontweight="bold")
fig.text(.065, .90, "A three-year electrode-site comparison can coexist with unchanged simultaneous recording capacity.", fontsize=12)

years = np.linspace(0, 12, 181)
for d, color, label in [(3, "#be562c", "3 years: user’s hypothesis"), (7.4, "#587187", "7.4 years: historical neuron reference")]:
    values = 2**(years/d)
    left.plot(years, values, color=color, lw=2.8, label=label)
    left.annotate(f"{values[-1]:.2f}×", (12, values[-1]), xytext=(-6, 7),
                  textcoords="offset points", ha="right", color=color, fontweight="bold")
left.set(title="A  What the doubling times imply", xlabel="Elapsed years", ylabel="Growth relative to the starting count")
left.set_yscale("log", base=2)
left.set_yticks([1, 2, 4, 8, 16], ["1×", "2×", "4×", "8×", "16×"])
left.set_xticks([0, 3, 6, 9, 12])
left.set_ylim(.85, 24)
left.grid(axis="y", alpha=.18)
left.legend(loc="upper left", fontsize=9, frameon=False)

selected = ["np1_2017", "np2_single_2021", "np_ultra_2025", "np_quad_2026"]
xs = np.arange(len(selected))
for offset, metric, color, label in [(-.19, "sites", "#be562c", "Physical electrode sites"),
                                   (.19, "simultaneous_channels", "#277c80", "Simultaneous recording channels")]:
    values = [rows[k][metric] for k in selected]
    right.bar(xs+offset, values, width=.34, color=color, label=label, zorder=3)
    for x, value in zip(xs+offset, values):
        right.text(x, value*1.12, f"{value:,}", ha="center", va="bottom", fontsize=9, fontweight="bold")
right.set_title("B  Selected Neuropixels configurations")
right.set_ylabel("Count per probe (logarithmic scale)")
right.set_yscale("log", base=2)
right.set_ylim(128, 22000)
right.set_yticks([128, 512, 2048, 8192])
right.yaxis.set_major_formatter(FuncFormatter(lambda x, pos: f"{int(x):,}"))
right.set_xticks(xs, ["2017\n1.0\n1 shank", "2021\n2.0\n1 shank", "2025\nUltra\n1 shank", "2026*\nQuad Base\n4 shanks"], fontsize=10)
right.grid(axis="y", alpha=.18, zorder=0)
right.legend(loc="upper left", fontsize=9, frameon=False)

fig.text(.065, .16, "HOW TO READ THIS", fontweight="bold", fontsize=10)
fig.text(.065, .115, "A: Normalized scenarios, not fitted data or forecasts. The 7.4-year result concerns recorded neurons, not electrode sites.", fontsize=10)
fig.text(.065, .08, "B: 2017 → 2025 sites: 960 → 6,144 (6.4×); endpoint-equivalent doubling = 2.99 years. Channels: 384 → 384.", fontsize=10)
fig.text(.065, .045, "*Quad Base: July 2026 preprint; sold from August 2025. Sources: Jun 2017; Steinmetz 2021; Ye 2025; Chang 2026. Details in milestones.json.", fontsize=9, color="#587187")
(ROOT / "figures").mkdir(exist_ok=True)
for suffix in ("png", "svg"):
    fig.savefig(ROOT / f"figures/scaling_comparison.{suffix}", dpi=180, facecolor=fig.get_facecolor())
plt.close(fig)
print(json.dumps({"milestone_count": len(rows), "np_site_doubling_years": calc["comparisons"]["np1_to_ultra_sites"]["endpoint_equivalent_doubling_years"], "outputs": ["data/calculations.json", "figures/scaling_comparison.png", "figures/scaling_comparison.svg"]}, indent=2))
