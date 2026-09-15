# Luan–Xie lab: electrode scaling evidence

Research checked: 15 September 2026. The lab is a provisional reference inferred from the user's Rice context. Public papers establish demonstrated device capability; they do not establish the professor's private inventory, procurement history, or routine experimental capacity.

## Finding

The public record supports a substantial increase in the scale of Luan–Xie electrical interfaces. It does **not** establish a regular doubling of the number of probes every three years. The strongest change is from individual few-site threads to modular implants containing many threads. Recent electronics also reach thousands of channels, but the 2026 demonstration uses a cortical-surface array and must be separated from penetrating NET recordings.

“Probe” changes meaning across papers: a single thin thread, a multi-shank module, or an assembled array. Those are different counting units. Count each separately.

## Verified milestones

| First journal publication | Platform / study | Physical threads or shanks | Electrode sites and recording channels | Evidence interpretation |
|---|---|---:|---|---|
| 15 Feb 2017 | Original NET-50 and NET-10 | One thread per basic probe | NET-50: **8 electrodes/thread**; NET-10: **4/thread** | A tissue-integration and recording-stability demonstration. The reported **16 probes and 80 working electrodes are totals across 7 mice**, not one implant. [Luan et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5310823/) |
| 10 Mar 2018 | Nanofabricated NET-e | Individual threads; seven closely spaced threads shown implanted together | **8 or more electrodes/thread**, design dependent | Main advance: smaller cross section and closer packing. A 32-channel Intan acquisition system is specified; that is not evidence that every example had 32 implanted working contacts. [Wei et al.](https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/advs.201700625) |
| 30 Apr 2019 online, June issue | Parallel implantation of NET arrays | **4–8 shanks** in a typical multi-shank device | **32–128 contacts/device** | Multiple shanks are inserted together using temporary microwire shuttles. This supports increased implantation throughput; it is not a maximum simultaneous functional channel count for an entire animal. [Zhao et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC6506360/) |
| 3 Oct 2022, April 2023 issue | Large-scale modular NET | **8 shanks/module**, **16 sites/shank** in type I; up to **18 modules = 144 shanks** | **128 channels/module**; authors report **2,304 simultaneously monitored channels** in the largest modular implementation | Penetrating rodent recordings. A separately illustrated 1,024-channel implant spans approximately 1 mm³. Counts of sorted units must remain separate from channel counts. [Zhao et al. manuscript, Results and Figs. 1, 6](https://escholarship.org/content/qt9pf3m6nk/qt9pf3m6nk_noSplash_cf2b8f1fe4bd0e418f3f40bb8c98a517.pdf) |
| 4 Aug 2025 | Temporal coding and stable visual representations | **3–7 NET devices/animal**, five mice | **32 channels/NET**, hence **96–224 nominal channels/animal** (calculated) | Study-specific deployment, not a new capacity maximum. The total of 25 devices is pooled over five mice. Shows why each later paper should not be expected to increase channel count. [Zhu et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC12322180/) |
| 3 Aug 2026 | Recording–stimulation ASIC integrated with flexible μECoG | Cortical-surface electrode array; not penetrating NET threads | **5,376 simultaneous recording channels** on ASIC, **20 kS/s/channel**; 224 addressable stimulation channels, at most 32 simultaneous stimulation channels | Rat cortical-surface field-potential demonstration. Keep in a separate μECoG/electronics series. This is a published journal article, superseding the March 2026 preprint still listed on the lab site. [Fan et al.](https://www.nature.com/articles/s44385-026-00103-8), [publication metadata](https://pubmed.ncbi.nlm.nih.gov/42547559/) |

## Important distinctions in the 2022 / 2023 NET milestone

- Publication date: **3 October 2022** is the first journal-publication date; April 2023 is the volume/issue date. Do not enter the same work twice. [Publisher metadata](https://www.nature.com/articles/s41551-022-00941-y)
- The paper explicitly describes up to 18 × 128 = **2,304 simultaneously monitored channels**. Its representative distributed mouse recording has **2,548 sorted units**, including single-unit and multi-unit clusters. “Unit” does not universally mean one independently isolated neuron. [Author manuscript](https://escholarship.org/content/qt9pf3m6nk/qt9pf3m6nk_noSplash_cf2b8f1fe4bd0e418f3f40bb8c98a517.pdf)
- The authors' 2023 review describes that distributed implant as **144 shanks, 1,930 recording channels, and 2,548 units**. The relationship between 1,930 and 2,304 is not explicitly explained in the inspected sources. Treat it as an unresolved reporting discrepancy; do not infer a nominal-versus-working distinction from it. [Luan et al., 2023 review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11078330/)
- A separate example starts with 1,280 contact sites and has **1,036 still connected after surgery**. This directly illustrates why total fabricated/implanted contacts and functioning contacts should be different fields. [Author manuscript](https://escholarship.org/content/qt9pf3m6nk/qt9pf3m6nk_noSplash_cf2b8f1fe4bd0e418f3f40bb8c98a517.pdf)

## What can be compared fairly?

1. **Sites per single thread/shank:** NET-50 in 2017 has 8; type-I NET in 2022 has 16. This is a genuine twofold change in that metric across about 5.6 years. It is a descriptive endpoint comparison, not an estimated law or a claim that no intermediate or alternate design achieved more.
2. **Contacts per multi-shank module:** the 2019 paper describes up to 128; the 2022 paper also uses 128. Much of the later increase comes from packaging, implanting and reading more modules, rather than simply doubling contacts on a module.
3. **Simultaneous channels per animal:** the 2022 paper supplies a strong large-scale endpoint. The 2017 cohort total must not be its baseline. A dependable within-lab doubling-time estimate needs dated per-animal demonstrations or lab records with the same inclusion rule.
4. **Latest electronics capacity:** the 2026 ASIC is valuable evidence of scale and interconnect progress, but combining it with penetrating NET in one fitted series changes sensing modality and biological demonstration.

An apparent sequence such as “8 → 128 → 2,304 → 5,376” looks compelling while switching from one thread, to one module, to one penetrating implant, to a surface-recording electronic platform. It should not be fitted as if those four numbers measured the same thing.

## Suggested fields for future lab-specific tracking

Record date, project, device generation, species, surface/penetrating modality, threads or shanks per animal, contacts per shank, implanted contacts, simultaneously sampled channels, working channels after surgery, single units, multi-units, sampling rate, duration, and verification source. Keep routine typical use separate from a best demonstrated maximum.

A three-year doubling hypothesis means comparing the same field over time. It predicts an 8-fold increase over nine years. The public publications substantiate rapid scaling, while the present evidence is too sparse and heterogeneous to validate that particular within-lab cadence.

## Source ledger

- Luan et al. (2017). *Ultraflexible nanoelectronic probes form reliable, glial scar-free neural integration*. Science Advances 3, e1601966. DOI: [10.1126/sciadv.1601966](https://doi.org/10.1126/sciadv.1601966). Results establish 8 versus 4 electrodes/thread and cohort totals. [UT-hosted paper](https://foil.bme.utexas.edu/publication/luan-2017/luan-2017.pdf).
- Wei et al. (2018). *Nanofabricated Ultraflexible Electrode Arrays for High-Density Intracortical Recording*. Advanced Science 5, 1700625. DOI: [10.1002/advs.201700625](https://doi.org/10.1002/advs.201700625). Results and recording methods.
- Zhao et al. (2019). *Parallel, minimally-invasive implantation of ultra-flexible neural electrode arrays*. Journal of Neural Engineering 16, 035001. DOI: [10.1088/1741-2552/ab05b6](https://doi.org/10.1088/1741-2552/ab05b6). Introduction gives typical contact/shank counts; main study validates implantation approach.
- Zhao et al. (online 2022; issue 2023). *Ultraflexible electrode arrays for months-long high-density electrophysiological mapping of thousands of neurons in rodents*. Nature Biomedical Engineering 7, 520–532. DOI: [10.1038/s41551-022-00941-y](https://doi.org/10.1038/s41551-022-00941-y). Primary source for the large modular implant.
- Luan et al. (2023). *Emerging Penetrating Neural Electrodes: In Pursuit of Large Scale and Longevity*. Annual Review of Biomedical Engineering 25, 185–205. DOI: [10.1146/annurev-bioeng-090622-050507](https://doi.org/10.1146/annurev-bioeng-090622-050507). Author review reports 1,930 channels; its relationship to the primary paper's 2,304 simultaneously monitored channels is unresolved.
- Zhu et al. (2025). *Temporal coding carries more stable cortical visual representations than firing rate over time*. Nature Communications 16, 7162. DOI: [10.1038/s41467-025-62069-2](https://doi.org/10.1038/s41467-025-62069-2). Results gives the actual five-animal deployment.
- Fan et al. (2026). *High-channel-count neural recording and stimulation platform with 5376 simultaneous recording channels*. npj Biomedical Innovations 3, 46. DOI: [10.1038/s44385-026-00103-8](https://doi.org/10.1038/s44385-026-00103-8). Journal version verified; lab publication list is stale on preprint status.
- [Xie lab official publication index](https://www.chongxie.net/copy-of-blank-1). Discovery source linking the above lab work; checked 15 September 2026.
