# Academic electrophysiology scaling: evidence notes

Research cutoff: 2026-09-15. Primary papers and first-party specifications checked live. This is a source ledger for synthesis, not a systematic review. Dates below distinguish first publications, later journal publication, and commercial availability.

## Main interpretation

A count of physical electrode sites is different from the number of simultaneous recording channels. Both differ from isolated neuron count and the number of probes/shanks implanted. Neuropixels is an unusually clear example: its main generations increased site count and density for years while simultaneous channels per probe remained 384. Quad Base finally increases that capacity to 1,536. These designs also make different choices about tissue coverage, spatial density, form factor, and stability; plotting every number as one curve would manufacture a misleading trend.

## Source ledger

### A1. Neuropixels 1.0 — 2017

- Jun et al., *Fully integrated silicon probes for high-density recording of neural activity*. Nature 551, 232–236 (2017), DOI 10.1038/nature24636. [Primary paper](https://www.nature.com/articles/nature24636).
- **960 physical sites; 384 simultaneous recording channels; one 10-mm shank.** Two probes recorded more than 700 isolated neurons simultaneously across five structures in an awake mouse. That >700 is an experiment-level neuron yield, not one probe's channel count.
- The consortium's [UCL announcement dated 8 November 2017](https://vocal.swc.ucl.ac.uk/research-news/neuropixels-probes-could-revolutionise-neuroscience) explicitly says the paper appeared that day.
- Inference: choosing 960 as the 2017 baseline answers a site-count question; choosing 384 answers a channel-count question.

### A2. Neuropixels 2.0 — 2021

- Steinmetz et al., Science 372:eabf4588, published **16 April 2021**, DOI 10.1126/science.abf4588. [Primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8244810/).
- **1,280 sites on one shank, or 5,120 on four shanks; 384 simultaneous channels per probe in both cases.** Two probes connected to one headstage give 768 simultaneous channels.
- The paper's 6,144-site example is sequential: two probes sampled 768 sites at a time over eight epochs. It is not a 6,144-channel simultaneous recording.
- Miniaturization and stable longitudinal tracking are central advances, not merely increased electrode count.
- [Current manufacturer specifications](https://www.neuropixels.org/probe2-0) independently confirm the 1,280/5,120 versus 384 distinction.

### A3. Neuropixels Ultra — 2023 preprint; 2025 final paper

- Ye et al., *Ultra-high-density Neuropixels probes improve detection and identification in neuronal recordings*, Neuron 113(23):3966–3982.e12. DOI 10.1016/j.neuron.2025.08.030. **Online 30 September 2025; issue 3 December 2025.** [PubMed dates](https://pubmed.ncbi.nlm.nih.gov/41033305/), [primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12981004/).
- Final paper: **6,144 sites; 384 simultaneous channels**. Sites form a 768×8 grid, with 5×5-µm electrodes on 6-µm centers. The maximal-density active map is 48×8 sites; other configurations trade density for span.
- The earlier [2023 preprint, revised 10 April 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10473688/) describes a 384-site fixed geometry and a switchable variant. Do not attach the final 6,144 specification casually to the first preprint date.
- **Source discrepancy:** Neuropixels Central describes an earlier 6,528-site programmable geometry. Use the peer-reviewed paper's 6,144 when describing the final paper's device; do not blend generations.

### A4. Neuropixels 1.0 NHP — 2025 paper, earlier prototypes

- Trautmann et al., *Large-scale high-density brain-wide neural recording in nonhuman primates*, Nature Neuroscience 28:1562–1575; **23 June 2025**. DOI 10.1038/s41593-025-01976-5. [Primary paper](https://www.nature.com/articles/s41593-025-01976-5).
- Long version: **4,416 sites along 45 mm; 384 simultaneous channels**. The work demonstrates acute macaque recordings; multiple probes or selected banks enable broad/deep access.
- The 4,416 count primarily represents greater anatomical reach, not a tenfold increase in simultaneous channels over 2017.
- The first-party [project technology page](https://www.neuropixelscentral.org/technology) reports prototype delivery in August 2020 and also a 25-mm, 2,496-site variant. A chronology of first availability therefore differs from one using journal publication dates.

### A5. Neuropixels 2.0 Quad Base — 2025 commercial availability; 2026 preprint

- Chang et al., *Neuropixels 1536 Channel Quad Base probe reveals brain-wide communication underlying flexible sensorimotor sequences*. **Preprint posted 27 July 2026**, DOI 10.64898/2026.07.23.740388. [Primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13483804/), [bioRxiv first-party date listing](https://connect.biorxiv.org/relate/content/227/channel/22).
- **5,120 sites on four shanks; 1,536 simultaneous channels per probe.** Two probes supported 3,072-channel recordings in mice. Across 40 sessions in six mice, the authors report a mean of 1,139±94 Kilosort-good units per session. The neuron total is experiment-level and quality-definition-dependent.
- The larger base holds expanded electronics. Sites are unchanged from the four-shank NP2.0, while channels quadruple.
- [First-party Neuropixels Central](https://www.neuropixelscentral.org/technology) says it has been available for purchase since **August 2025**. Label this as a commercial-availability date, not a 2025 peer-reviewed publication. The 2026 paper remains a preprint as located in this search.

### A6. Argo — 2020 preprint; 2021 journal paper

- Sahasrabuddhe et al., *The Argo: a high channel count recording system for neural recording in vivo*, J Neural Eng 18(1):015002; **24 February 2021**, DOI 10.1088/1741-2552/abd0ce. [PubMed metadata](https://pubmed.ncbi.nlm.nih.gov/33624614/), [primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8607496/).
- **65,536 channels is the acquisition system's simultaneous capacity**, at 32 kHz and 12 bits. It is not the reported count of neurons, implanted recording contacts in one chronic human device, or fully validated in-vivo channels.
- Demonstrated **>30,000 simultaneous surface-LFP channels in sheep**, and separately **791 isolated units in rat cortex** with penetrating microwires. The system was an acute, head-fixed preparation.
- The authors explicitly state all 65,536 channels would require a suitably large, well-connected electrode array; the demonstrated arrays did not fill all inputs.
- The [July 2020 preprint](https://doi.org/10.1101/2020.07.17.209403) should be used if the timeline consistently chooses first disclosure. Do not mix its date with later-publication dates elsewhere.

### A7. SiNAPS — useful complementary architecture

- Angotzi et al., *SiNAPS: An implantable active pixel sensor CMOS-probe for simultaneous large-scale neural recordings*, Biosensors and Bioelectronics 126:355–364 (2019). [Primary abstract](https://pubmed.ncbi.nlm.nih.gov/30466053/).
- Early paper describes an architecture scalable to **1,024 electrode-pixels**, but the fabricated implantable single-shaft prototype detailed there has **512 pixels**. Preserve capacity-versus-demonstration distinction.
- Later *Multi-shank 1024 channels active SiNAPS probe for large multi-regional topographical electrophysiological mapping of neural dynamics* demonstrates **1,024 simultaneous channels across eight shanks at 20 kHz/channel** in awake mice. [2024 preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC11326390/); [journal-update pointer](https://pubmed.ncbi.nlm.nih.gov/39149505/) identifies Advanced Science 12(16):e2416239 (April 2025), DOI 10.1002/advs.202416239.
- Unlike selecting 384 sites from a larger grid, this architecture reads the complete 1,024-electrode array concurrently.

### A8. Rice Luan–Xie–Chi 5,376-channel platform — 2026

- Fan et al., *High-channel-count neural recording and stimulation platform with 5376 simultaneous recording channels*, npj Biomedical Innovations 3, article 46; **3 August 2026**. DOI 10.1038/s44385-026-00103-8. [Primary paper](https://www.nature.com/articles/s44385-026-00103-8).
- **5,376 simultaneous recording channels at 20 kS/s**, with >1.3 Gb/s streaming. The paper includes Lan Luan and Chong Xie, alongside Taiyun Chi. Separate stimulation support: 224 addressable, up to 32 simultaneously active channels.
- Flexible µECoG arrays were integrated with the chip; **in-vivo validation records cortical surface field potentials in rats**. A human-scale electrode design was fabricated, but the reported validation is not human clinical implantation.
- The ASIC sits in an external headstage. Do not equate this system with a 5,376-channel fully implanted chronic intracortical BCI.
- This is directly relevant to the user's lab context, but belongs on a surface-recording/backend trajectory separate from chronic penetrating NET results.

### A9. BISC wireless subdural µECoG — 2025

- Jung et al., *A wireless subdural-contained brain–computer interface with 65,536 electrodes and 1,024 channels*, Nature Electronics 8:1272–1288; **8 December 2025**. DOI 10.1038/s41928-025-01509-9. [Primary paper](https://www.nature.com/articles/s41928-025-01509-9), [primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13327737/).
- **65,536 physical electrodes, up to 1,024 simultaneous selected channels**, integrated on a flexible 50-µm-thick CMOS substrate with wireless power and telemetry. This is a surface-recording implant below the dura, without penetrating shanks.
- Demonstrations lasted up to two weeks in pigs and two months in behaving nonhuman primates, involving somatosensory, motor, and visual cortical signals and decoding. These are not 65,536 simultaneously acquired channels or a 65,536-neuron human demonstration.
- This paper's DOI is **s41928-025-01509-9**; s41551-025-01501-w is a different cortical-array paper that links to it.

## Historical-law and data pointers

- Stevenson and Kording (2011), [primary full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3410539/), report **7.4±0.4-year doubling of simultaneously recorded neurons** in 56 selected frontier studies. It is not a count of electrodes or probes. The original figure includes recording modalities beyond purely electrical interfaces.
- Urai et al. (2022), [primary review](https://www.nature.com/articles/s41593-021-00980-9), published 3 January 2022, updates context with modality-separated recording scales. Its authors provide [source data and plotting code](https://github.com/anne-urai/largescale_recordings). This is a better foundation for an updated neuron-yield curve than transcribing large marketing numbers.
- No verified primary source found in this bounded search establishes a universal three-year doubling law for invasive electrical BCI electrode or channel counts.

## Suggested quantitative comparisons

Use endpoint calculations only as descriptive illustrations, not fitted field-wide laws:

1. NP1.0 (2017) → four-shank NP2.0 (2021): sites 960→5,120, a factor of 5.33; channels 384→384. The apparent site doubling time from integer years is 4/log2(5120/960) ≈ **1.66 years**, while channel count shows no growth. The shank count also increased 1→4.
2. Single-shank comparison over the same dates: 960→1,280 sites, factor 1.33, descriptive doubling time ≈ **9.64 years**. Choosing a device variant changes the answer dramatically.
3. NP1.0 (2017) → Quad Base availability (2025): channels 384→1,536, factor 4 over roughly eight years, endpoint doubling ≈ **4 years**. Using the 2026 preprint gives ≈4.5 years. NP2.0 (2021) → 2025 availability gives ≈2 years. None is a universal cadence.
4. NP1.0 (2017) → NP Ultra final paper (2025): single-shank sites 960→6,144, factor 6.4 over eight rounded publication years, endpoint-equivalent doubling = 8/log2(6.4) ≈ **2.99 years**. Both still record 384 simultaneous channels. This is a concrete illustration consistent with the user's three-year intuition **for physical sites in selected designs**, while showing why the metric matters. The denser design has a different spatial sampling trade-off; this endpoint comparison is not a global fit or a regular product release cadence.
5. A fair lab test should use dated counts of simultaneously acquired usable channels per animal/session, track chronic duration and tissue coverage, and keep hardware capacity, fabrication yield, neuron yield, and functional BCI performance as separate fields.

## Final measurement checks

- BISC readout modes: 1,024 simultaneous channels at 8,475 Hz, or 256 at 33,900 Hz. [Primary paper](https://doi.org/10.1038/s41928-025-01509-9).
- NET parallel-implantation paper: published online 30 April 2019; 8 February was its acceptance date. [Publisher Crossmark](https://crossmark.crossref.org/dialog-content?doi=10.1088%2F1741-2552%2Fab05b6&domain=pdf).
