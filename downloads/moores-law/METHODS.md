# Methods: testing a three-year doubling hypothesis

## 1. Define the thing being counted

| Metric | Definition | Common mistake |
|---|---|---|
| Physical probe | A shaft, thread, or other inserted structure; specify the design | Counting an entire array as one probe in one year and each shank in another |
| Electrode sites | Conductive contacts fabricated or implanted | Treating every contact as simultaneously digitized |
| Simultaneous recording channels | Distinct electrode signals acquired during the same recording, at a stated rate and bandwidth | Counting switchable sites, repeated banks, or summed sessions |
| Isolated neurons | Distinct units that pass stated spike-sorting quality criteria in one session | Summing units across animals or sessions; assuming one electrode equals one neuron |
| Stable usable channels | Channels meeting a fixed signal-quality criterion at a specified time after implantation | Counting nominal channels despite channel loss |
| BCI performance | A defined task outcome, with its error rate, latency, and calibration burden | Inferring useful information transfer directly from raw channel count |

Keep penetrating intracortical, surface ECoG, and endovascular systems in separate strata. Separate animal from human work; acute from chronic; wired external hardware from fully implanted wireless systems. Recording and stimulation capacities require separate fields.

## 2. What was done in this folder

- Searched primary publications, author/lab pages, and manufacturer announcements through 2026-09-15.
- Selected illustrative milestones that resolve the user’s question or expose a counting ambiguity. This sample is not a complete annual census.
- Recorded publication or announcement dates explicitly; a paper’s year is not assumed to be the experiment or purchase year.
- Preferred journal articles to earlier versions of the same preprint. Unpublished or commercial specifications remain labeled.
- Used JSON for extracted facts, with missing values represented as `null`.
- Calculated only explicitly named endpoint comparisons. No regression combines companies, species, anatomical interfaces, or incompatible count types.
- Plotted relative three- and 7.4-year doubling curves as mathematical illustrations. Neither curve is a fit to the selected hardware examples.

## 3. The calculation

For the same quantity measured at two dates:

\[
T_d = \frac{t_2-t_1}{\log_2(N_2/N_1)}.
\]

This is an **endpoint-equivalent doubling time**, not evidence of continuous exponential growth. A flat series has no finite doubling time; a declining series is not a positive doubling trend.

The three-year hypothesis is:

\[
N(t)=N_0\,2^{(t-t_0)/3}.
\]

It implies about 26% annual growth and a 16-fold increase in 12 years. The historical 7.4-year reference implies about 9.8% annual growth and a 3.08-fold increase in 12 years. The reference concerns recorded neurons; using it beside hardware counts illustrates the arithmetic only.

For a sufficiently populated, comparable series, estimate `log2(N) = a + b × year`, with `T_d = 1/b` when `b > 0`. Report uncertainty, residuals, sample size, sensitivity to start/end dates, and comparisons to linear or stepwise growth. A high R² alone does not establish a law. Multiple configurations from one paper are not independent generations.

## 4. A useful lab-history record

Duplicate this blank record for each dated configuration. Leave unknowns blank; no private laboratory counts have been inferred here.

| Field | Verified entry |
|---|---|
| Lab / investigator | |
| Experiment date and evidence | |
| Platform / hardware revision | |
| Typical experiment or maximum demonstration? | |
| Species and number of subjects | |
| Penetrating / surface / endovascular | |
| Physical probes per subject | |
| Sites per probe and total implanted sites | |
| Simultaneously recorded channels per subject | |
| Sampling rate, bandwidth, wired / wireless | |
| Implant age at recording | |
| Working channels and quality threshold | |
| Isolated neurons, quality criteria, session duration | |
| Task performance and calibration time | |
| Acquisition cost / ongoing cost, if documented | |
| Source file, paper, equipment log, or dated note | |

Collect a dated observation for every available platform revision and representative intervening experiments. Analyze typical lab capacity separately from the best published result. A lab buying additional copies of the same hardware measures adoption or resources as well as technology.

## 5. A stronger follow-up research question

**How fast does useful, stable neural access improve under fixed practical constraints?**

Report simultaneous channels together with usable-channel fraction at fixed implant ages, spatial coverage, decoded performance, power, volume, surgery burden, and cost. Avoid collapsing these into one arbitrary score.

An experiment that subsamples a single recording to 32, 64, 128, 256, and more channels can isolate the value of additional inputs. Retrain the decoder for each channel subset; use repeated spatially balanced subsets and identical held-out trials. Fix training-data quantity and evaluate on later days as well. This tests performance scaling within that dataset, without confusing it with the historical speed of hardware development.
