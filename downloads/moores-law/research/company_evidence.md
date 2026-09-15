# Company and clinical electrode-count evidence

Checked 2026-09-15. This is an evidence notebook, not a fitted growth series. Dates distinguish demonstrations from publications. An electrode contact, a simultaneously digitized channel, a usable neural feature, and a decoded output are different quantities. Company statements are identified as such.

## Neuralink

### 2019 research system: 3,072 sites and recording channels

- **Primary paper, 2019-10-31:** Musk and Neuralink, *An Integrated Brain-Machine Interface Platform With Thousands of Channels*. [JMIR](https://www.jmir.org/2019/10/e16194/), [PDF](https://www.jmir.org/2019/10/e16194/PDF), DOI 10.2196/16194.
- Abstract and electronics/Table 2: 96 flexible threads with 32 contacts each; System B has 3,072 channels and wired USB-C broadband acquisition. Discussion reports simultaneous recording from over 3,000 inserted electrodes in a freely moving rat.
- The illustrated System A experiment is a distinct result: 40 successfully inserted threads, 1,280 implanted contacts, 1,020 recorded simultaneously, and 43.4% spiking yield. Two overlapping configurations covered the implanted contacts. Do not mistake this example for 3,072 validated single units.
- **Classification:** rodent research system, chronic implantation with wired recording, not a 2019 implanted human BCI. The paper explicitly describes clinical wireless packaging as future development.

### 2023 specification / 2024 human milestone: N1, 1,024 electrodes

- **Primary clinical recruitment brochure:** [PRIME Study brochure](https://neuralink.com/pdfs/PRIME-Study-Brochure.pdf), devices section: 1,024 electrodes over 64 threads. This is a stated device configuration, not proof that all contacts remain useful after implantation.
- **Company update, 2025-02-05:** [A Year of Telepathy](https://neuralink.com/updates/a-year-of-telepathy/) confirms the first participant received an implant in January 2024 and describes use of a fully implanted wireless system.
- **Interpretation:** 3,072 in a 2019 wired rat prototype versus 1,024 in a human wireless implant in 2024 is not a monotonic technological regression. It shows why unlike product generations cannot define a single exponential curve.
- **Open issue:** exact simultaneous/effective channel counts per participant are not established by the brochure; use 1,024 as nominal sites. No unverified roadmap count is entered as an achieved milestone.

## Blackrock / BrainGate

### 2006 published human demonstration: 96 electrodes

- **Primary study, 2006-07-13:** Hochberg et al., *Neuronal ensemble control of prosthetic devices by a human with tetraplegia*, Nature 442, 164–171, DOI 10.1038/nature04970. [Publisher](https://www.nature.com/articles/nature04970), [university-hosted paper PDF](https://www.cs.miami.edu/home/odelia/teaching/compneuro2021/syllabus/2006donhogueNature.pdf).
- The abstract specifies 96 recording microelectrodes. Figure 1b clarifies a **100-electrode sensor with 96 available for recording**; keep physical and connected counts separate. The publication year should not be silently relabeled as the implantation year.

### 2023 speech BCI: 256 implanted contacts, 128 used for main decoding

- **Primary study, 2023-08-23:** Willett et al., *A high-performance speech neuroprosthesis*. [Nature](https://www.nature.com/articles/s41586-023-06377-x), DOI 10.1038/s41586-023-06377-x.
- Four 64-electrode arrays: two in ventral premotor area 6v and two in area 44. Extended Data Fig. 1 confirms 64 contacts per array. **256 implanted** is derived as 4 × 64.
- Main text states that further decoding analyses use only area 6v because area 44 supplied little speech-production information: **128 electrodes for the main speech decoder**, not all 256. Extended Data Fig. 1 reports spiking criteria on 118/128 area-6v contacts and 113/128 area-44 contacts on one specified day; these yields are session-specific.
- This human chronic intracortical study is particularly useful for showing that more implanted contacts and more useful decoding inputs are not interchangeable.

### 2024 speech BCI: 256 recorded intracortical electrodes

- **Primary study, 2024-08-14 online:** Card et al., *An Accurate and Rapidly Calibrating Speech Neuroprosthesis*. [NEJM](https://www.nejm.org/doi/abs/10.1056/NEJMoa2314132), DOI 10.1056/NEJMoa2314132.
- Abstract: four implanted arrays recorded from **256 intracortical electrodes**. Human chronic speech BCI; reported follow-up extends 8.4 months. This is a different participant/study from the 2023 example, not the next annual hardware generation.

### Manufacturer specification versus demonstrated implant

- [Blackrock Utah Array product page](https://blackrockneurotech.com/products/utah-array/), checked 2026-09-15: describes up to 1,024 channels at a system level. Its sections inconsistently refer to 96, 100–128, and up to 128 electrodes per array.
- Consequently, use **paper-specific counts** for historical data. Do not turn the current product page's 1,024-system capacity into a dated human implantation result. Do not repeat its suggestion that a Breakthrough Device designation itself constitutes approval for human use.

## Precision Neuroscience

### April 2024 human intraoperative record: four arrays, 4,096 contacts

- **Company announcement, 2024-05-28; procedure April 2024:** [Precision press release](https://www.globenewswire.com/en/news-release/2024/05/28/2889069/0/en/Precision-Neuroscience-Announces-World-Record-for-Number-of-Electrodes-Placed-On-Human-Brain.html).
- Four Layer 7 surface arrays, each nominally 1,024 electrodes; the system streamed cortical data from all four, totaling **4,096** during a Mount Sinai operation. This was cortical mapping/visualization, not evidence of a chronic implanted communication BCI using 4,096 independent neurons.
- Treat the announcement's global-record wording as a **company claim**, not an exhaustive independently established record. Per-array counts stayed constant; this particular increase comes from placing more arrays and covering more cortex.

### FDA decision March 2025: temporary passive array, not a cleared wireless BCI

- **Regulatory primary record:** [K242618 FDA entry](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K242618), decision **2025-03-30**. [FDA clearance letter and summary](https://www.accessdata.fda.gov/cdrh_docs/pdf24/K242618.pdf).
- Summary pages 4–6 of the 15-page PDF: **Layer 7-T has 1,024 contacts**, intended for temporary **less than 30 days** recording, monitoring and stimulation on the brain surface. It is a passive device connected to external equipment and has **no wireless functionality or software**.
- The [2025-04-17 company announcement](https://www.precisionneuro.io/articles/company-news/precision-neuroscience-receives-fda-clearance-for-high-resolution-cortical-electrode-array) says the fully implantable wireless BCI remains under development. Use the regulatory wording for the cleared indication.

### Peer-reviewed 2025 design and first five human recordings

- **Primary paper, 2025-10-02:** *Minimally invasive implantation of scalable high-density cortical microelectrode arrays for multimodal neural decoding and stimulation*. [Nature Biomedical Engineering](https://www.nature.com/articles/s41551-025-01501-w), DOI 10.1038/s41551-025-01501-w.
- Design section: nominal 1,024-site array includes **977 recording-sized contacts, 42 stimulation-optimized contacts and 5 references**. Contacts can serve recording or stimulation roles; nominal contact count is not automatically 1,024 equivalent neural recording sites.
- Methods: first five human recordings used a 1,024-channel array for **up to 15 minutes after conventional craniotomy**. Micro-slit delivery without craniotomy was demonstrated in animals and cadavers. The paper's human result should not be described as a minimally invasive chronic human implant.
- Rejected high-impedance electrodes were excluded from neural decoding. Animal electrode-downsampling experiments show task-dependent benefit from denser sampling; they do not establish a human exponential growth rate.

## Paradromics

### Device count: 421 per cortical module

- [Company Connexus page](https://paradromics.com/connexus/), checked 2026-09-15, describes **421 microelectrodes** extending about 1.5 mm below the cortical surface and a fully internal wireless architecture. The greater-than-ten-year recording life is a **design goal**, not a demonstrated human lifetime.
- [Company SfN analysis, 2026-01-21](https://paradromics.com/blog/paradromics-sfn-part-2/), electrode-dropping section, uses a full analysis set of **420**. The reason for the difference from the nominal 421 should not be assumed without the acquisition/protocol details.
- Earlier platform descriptions of four modules / around 1,600 sites must not be substituted for a verified number implanted in a specific human.

### 2025 temporary human recording versus 2026 chronic trial

- **Company announcement 2025-06-02:** [First human recording](https://paradromics.com/news/paradromics-completes-first-in-human-recording-with-the-connexus-brain-computer-interface/): implantation, recording and intact removal in **less than 20 minutes**, during epilepsy surgery. This is an acute human milestone.
- **Company announcement 2026-06-17:** [First Connect-One implantation](https://paradromics.com/news/paradromics-completes-first-human-brain-computer-interface-bci-implantation/): first implanted participant in the chronic early-feasibility study at Michigan. It reports an IDE in November 2025 and planned six-year follow-up. At this cutoff it is incorrect to describe all Paradromics human work as still only temporary or planned.
- **Open issue:** that chronic implantation announcement does not give a participant-specific implanted/effective channel count. Pair it with the 421 module specification only with this caveat; do not claim 1,684 implanted channels or successful chronic speech decoding from this announcement.

### Benchmark scope

- **Primary preprint, posted 2025-10-02:** Perkins et al., [SONIC: A Benchmarking Paradigm for Brain-Computer Interfaces](https://www.biorxiv.org/content/10.1101/2025.09.30.679683v1), DOI 10.1101/2025.09.30.679683.
- Its >200-bits/s result decodes experimentally presented sounds from **sheep auditory cortex**. This is an animal sensory benchmark, not human speech throughput or cursor-control performance. Do not compare it numerically with human task bits/s as if tasks and definitions were matched.

## Synchron

### 2019–2021 implants, 2023 full study: 16 electrodes

- **Primary clinical paper, 2023-01-09 online:** Mitchell et al., [SWITCH study](https://jamanetwork.com/journals/jamaneurology/fullarticle/2799839), DOI 10.1001/jamaneurol.2022.4847.
- Devices section: **16-electrode** Stentrode, chronically implanted in the superior sagittal sinus; enrollment/implant period 2019–2021, final follow-up January 2022, four implanted participants analyzed over 12 months.
- Endovascular signals supported switch/click control. Initial cursor positioning used eye tracking; a BCI-only item-scanning demonstration was also evaluated. This is an invasive endovascular interface, with population-level signals and a different sampling geometry from penetrating intracortical arrays.
- Count 16 as physical sensing electrodes, not 16 simultaneously isolated neurons or 16 independent commands. The study does not supply a longitudinal series showing a doubling of Synchron electrodes.

## What this evidence can support

These examples support substantial growth in available electrical interfaces but **do not test a universal three-year doubling law**. A valid series must fix at least modality, species, implant duration, per-array versus per-system scale, simultaneous channel definition, and evidence type. The most instructive confounds here are Neuralink research versus clinical form factor, Precision multiplication of fixed-size arrays, BrainGate implanted versus decoding electrodes, and Paradromics nominal versus analysis channels.
