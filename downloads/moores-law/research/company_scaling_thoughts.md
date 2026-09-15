# How companies could grow neural access

**Research cutoff: 15 September 2026.** These notes extend the verified milestone research into an ongoing ideas area. “Verified” means the cited source reports the mechanism or result. “Our inference” and “Next question” are research interpretations, not company roadmaps or established outcomes. Company announcements, peer-reviewed studies, and preprints remain distinct.

## The organizing idea

An electrode count can increase through several different changes:

1. **Replicate structures:** implant more threads, arrays, or modules.
2. **Increase density:** fit more contacts into a given surface area or onto a thread.
3. **Expand concurrent readout:** acquire more of the available contacts at the same moment.
4. **Retain more useful signals:** improve placement, reliability, recording quality, or decoding so that more of the hardware contributes over time.

The first three increase nominal access; the fourth determines how much of that access remains useful. A company's position can advance on one dimension while its headline electrode count stays constant. Track **sites, concurrent channels, coverage, working channels at a stated implant age, and task performance** separately.

The entries below describe the evidence for each route. They should appear as idea cards with a visible **Open question** status, rather than as a league table.

## 1. Neuralink — scaling the complete implantation process

**Suggested card title:** Does surgical throughput become the limit before fabrication does?

**Verified mechanism.** The 2019 research system combined flexible threads, robotic insertion, and local amplification/digitization. Its largest configuration had 96 threads × 32 sites = 3,072 channels; the robot could insert six threads per minute. The same paper describes a lower-channel configuration that was faster to manufacture. The later PRIME brochure specifies 64 threads × 16 electrodes = 1,024 sites for N1. Human implantation began in January 2024. These are different configurations and stages of translation. [2019 technical paper, 31 October 2019](https://doi.org/10.2196/16194), [PRIME brochure](https://neuralink.com/pdfs/PRIME-Study-Brochure.pdf), [company human-use update, 5 February 2025](https://neuralink.com/updates/a-year-of-telepathy/).

**Our inference.** Neuralink illustrates an architecture where more sites can come from either more contacts per thread or more threads. Those changes are not equivalent: extra contacts sample along an existing insertion, whereas extra threads can reach additional locations. The 2019-to-N1 comparison suggests that the manufacturable, implantable, wireless system is the meaningful unit of progress—not the largest count fabricated in an early prototype.

**Bottleneck to investigate.** The time and reliability of placing each thread may constrain thread replication; available wireless power, data transport, and long-term signal retention may constrain how many of the placed sites can be used. This is an engineering interpretation, not a measured ranking of N1's present bottlenecks.

**Testable next question.** At matched total electrode count, does spreading contacts over more threads improve held-out decoding compared with placing more contacts on fewer threads? Use matched anatomical coverage where possible, then report the remaining coverage difference explicitly. Track implantation time and working-channel fraction at fixed follow-up intervals alongside performance.

**What would change our view?** Evidence that extra contacts on existing threads perform as well as distributed threads would favor density; strong gains from wider sampling would favor replication. A rising nominal count with flat retained channels would shift attention toward implant stability.

**Useful fields for an ongoing entry:** threads; contacts/thread; insertion time; successful placement fraction; simultaneous channels; retained working channels; implant age.

## 2. Blackrock / BrainGate — growing coverage through multiple arrays

**Suggested card title:** Where should the next array go?

**Verified mechanism.** The 2006 BrainGate paper describes a 100-electrode sensor with 96 contacts available for recording. A 2023 speech study implanted four 64-electrode arrays, but its principal decoder used only the 128 electrodes in ventral premotor cortex; the other two arrays supplied little speech-production information. A separate 2024 study recorded from 256 intracortical electrodes across four arrays. These are research configurations using the array platform, not a complete history of Blackrock products. [Hochberg et al., 13 July 2006](https://doi.org/10.1038/nature04970), [Willett et al., 23 August 2023](https://doi.org/10.1038/s41586-023-06377-x), [Card et al., 14 August 2024 online](https://doi.org/10.1056/NEJMoa2314132).

**Our inference.** Replicating an established array can increase total access without requiring the same proportional increase in density within an array. But the 2023 result makes placement a central scaling variable: an additional electrode in a useful region and an additional electrode in a weakly informative region do not have the same value.

**Bottleneck to investigate.** Coverage must capture relevant information while the full system supports the extra connections and acquisition. The unresolved question is how much benefit comes from more electrodes versus better placement. The evidence does not justify labeling all additional implanted electrodes as additional useful decoder inputs.

**Testable next question.** Compare decoders with the same number of electrodes selected from one array, neighboring arrays, or separated cortical regions. Hold task, training data, implant age, and evaluation procedure fixed; quantify how much added spatial coverage improves performance after accounting for signal quality.

**What would change our view?** If distributed subsets outperform equally sized local subsets, coverage deserves its own growth curve. If differences disappear after matching signal quality, retention and local density may be more informative than array number.

**Useful fields:** arrays/participant; physical versus connected contacts; regions sampled; electrodes admitted to the decoder; excluded regions and reasons; marginal improvement per added array.

## 3. Precision Neuroscience — separating surface coverage from surface density

**Suggested card title:** Does doubling coverage help more than doubling density?

**Verified mechanism.** Precision reported simultaneous cortical streaming from four nominal 1,024-contact arrays during an April 2024 operation: 4,096 contacts through array replication. Its 2025 design paper describes 977 recording-sized, 42 stimulation-optimized, and five reference contacts in a nominal 1,024-site array. Animal subsampling analyses examined the benefit of denser recordings; the first five human recordings in that paper lasted at most 15 minutes after conventional craniotomy. [Company announcement, 28 May 2024](https://www.globenewswire.com/en/news-release/2024/05/28/2889069/0/en/Precision-Neuroscience-Announces-World-Record-for-Number-of-Electrodes-Placed-On-Human-Brain.html), [Hettick et al., 2 October 2025 online](https://doi.org/10.1038/s41551-025-01501-w).

**Our inference.** A surface array has two independent expansion directions: cover a larger cortical area or place contacts closer together within the same area. The four-array milestone establishes replication at that time; it does not establish that the contacts themselves became denser. These two routes may benefit different tasks.

**Bottleneck to investigate.** Neighboring contacts can carry overlapping information, and additional surface area can include regions irrelevant to a particular task. Translation also has a separate duration constraint: FDA-cleared Layer 7-T is a passive, non-wireless array for temporary use of **less than 30 days**. Its clearance does not establish a chronic wireless communication implant. [FDA K242618, decision 30 March 2025](https://www.accessdata.fda.gov/cdrh_docs/pdf24/K242618.pdf).

**Testable next question.** From a fixed high-density recording, compare (A) all usable contacts in a smaller area with (B) the same number spread across a larger area. Then compare different contact densities within that same larger area. Use the same held-out task and explicitly match or model electrode quality.

**What would change our view?** If the larger-area subset consistently wins, coverage is the more valuable growth mechanism for that task. If dense local subsets win, further miniaturization is supported. A result can depend on signal band and task complexity; it should not become a universal claim about all ECoG.

**Useful fields:** area covered; contact pitch; contact role; concurrently sampled contacts; information gain versus distance; duration; clinical versus animal demonstration.

## 4. Paradromics — increasing the information extracted from a cortical module

**Suggested card title:** When does adding contacts stop adding new information?

**Verified mechanism.** Connexus is specified with 421 microelectrodes extending approximately 1.5 mm below the surface. A January 2026 company analysis describes contacts separated by 300 μm and an electrode-dropping curve that still improves up to an analysis set of 420. The company discusses higher density or additional modules as potential routes forward. Its underlying SONIC preprint evaluates sound decoding in sheep; it is not a human speech benchmark. [Connexus specification, accessed 15 September 2026](https://paradromics.com/connexus/), [company analysis, 21 January 2026](https://paradromics.com/blog/paradromics-sfn-part-2/), [SONIC preprint, posted 2 October 2025](https://doi.org/10.1101/2025.09.30.679683).

**Our inference.** This approach emphasizes the value of each contact's position as well as contact number. The useful scaling question is whether denser sampling within one cortical patch adds independent task information, or whether an additional module sampling a different patch is more valuable. An increasing subsampling curve motivates that question but does not prove how an unbuilt denser array will perform.

**Bottleneck to investigate.** Contact redundancy, signal retention, and transfer of an animal benchmark to a clinical task could each limit gains. The 421 nominal / 420 analyzed distinction needs an explicit accounting; do not assume a cause. The first chronic Connect-One human implantation was announced in June 2026, but that announcement did not establish a participant-specific functional channel count or long-term performance. [Company announcement, 17 June 2026](https://paradromics.com/news/paradromics-completes-first-human-brain-computer-interface-bci-implantation/).

**Testable next question.** In an existing recording, compare adding nearby contacts against adding spatially separated groups, with matched total counts and identical evaluation. Then determine whether the same marginal-gain pattern appears in human attempted-speech recordings when such data become available.

**What would change our view?** A steep gain from local density would support denser modules; early local saturation with gains from distant groups would support broader coverage. Animal-to-human disagreement would show that a shared device count does not imply a shared scaling curve.

**Useful fields:** nominal, acquired and analyzed contacts; contact spacing and depth; modules; implant age; task; delay; definition of information rate.

## 5. Synchron — useful control need not require a rising headline count

**Suggested card title:** Can useful neural access grow while electrode count stays modest?

**Verified mechanism.** The SWITCH study used a 16-electrode Stentrode inside a brain blood vessel, with four implanted participants analyzed over 12 months. Signals supported digital switch actions; initial cursor positioning used eye tracking, and a BCI-only scanning interface was also studied. This evidence establishes an alternative route to accessing brain signals. It does **not** establish a historical doubling series or a future electrode-expansion plan for Synchron. [Mitchell et al., 9 January 2023 online](https://doi.org/10.1001/jamaneurol.2022.4847).

**Our inference.** Synchron is useful in this comparison because it challenges the choice of outcome. More reliable selections, less calibration, or more independent use could constitute meaningful progress without more physical contacts. Those outcomes would be a parallel history of practical access, not evidence that hardware electrode counts doubled.

**Bottleneck to investigate.** The vascular route constrains where contacts can be positioned relative to relevant cortical signals. Adding contacts along a similar sensing path may provide overlapping information. Both the benefit and the redundancy must be measured rather than inferred from the small count alone.

**Testable next question.** Within existing recordings, plot held-out command accuracy and selection time against the number and spatial distribution of usable contacts. Separately report performance with and without eye tracking so that assistance from another input is not attributed to neural-channel scaling.

**What would change our view?** Strong gains from added contacts would motivate a density or coverage hypothesis. Early saturation would point toward placement, signal interpretation, or interface design as more promising directions for that task. Neither result, alone, establishes a clinical preference between endovascular and penetrating devices.

**Useful fields:** contact location; usable channels; neural-only versus assisted control; command accuracy; selection latency; calibration time; independent-use duration.

## 6. BISC — a research example of many sites sharing fewer readout channels

**Suggested card title:** Should the next generation add electrodes or read out more of the existing ones?

**Verified mechanism.** The 2025 BISC paper integrates 65,536 electrodes with processing, wireless power and telemetry on a flexible CMOS substrate. At any given time it can record a selectable subset of up to 1,024 channels. Reported chronic recordings extend to two weeks in pigs and two months in behaving nonhuman primates. This is an academic research platform, included as a useful architectural comparison rather than as a human-company milestone. [Jung et al., 8 December 2025](https://doi.org/10.1038/s41928-025-01509-9).

**Our inference.** The device exposes two very different growth paths: fabricate a larger pool of potential sensing sites, or widen the electronic path that reads them concurrently. A large selectable pool can be valuable for choosing informative locations, but it cannot be counted as that many simultaneous channels.

**Bottleneck to investigate.** Site selection and concurrent acquisition compete for the available system resources. The question is whether the task needs many locations at the same moment or mostly needs a well-chosen subset. Rapidly switching subsets is not automatically equivalent to measuring them all simultaneously when the underlying signals change over time.

**Testable next question.** At the same simultaneous-channel budget, compare a fixed subset against a subset selected using training data only. Test each on held-out sessions; measure any gain and the cost of reselecting locations. A separate hardware study could examine wider readout, but the existing 1,024-channel result does not establish its benefits.

**What would change our view?** Large gains from selection would strengthen the case for many selectable sites. Little benefit after selecting the best subset would motivate either greater simultaneous readout or a different coverage pattern, depending on the task.

**Useful fields:** fabricated sites; selectable sites; simultaneous channels; sampling rate; selection method; switching overhead; wireless power; implant duration.

## Cross-company ideas to keep developing

### Idea A — separate the “count-growth engine” from the “benefit-growth engine”

**Open hypothesis:** the route that most easily increases electrode count is not necessarily the route that most improves an actual BCI task.

- **Replication** raises total contacts by adding structures or modules.
- **Density** raises contacts within an existing region.
- **Readout expansion** makes more contacts concurrent.
- **Retention and selection** raise the contribution of existing contacts.

**Research test:** attribute each published milestone to the mechanism actually changed, then ask which mechanism predicts improved performance in matched tasks. Avoid pooling surface and intracortical signals into a single “bits per electrode” score.

### Idea B — place a measured “usable” count beside every nominal count

**Open hypothesis:** some of the apparent gap between companies reflects counting conventions and implant age rather than different fabrication ability.

**Research test:** record a count ledger for each experiment: physical contacts → connected contacts → concurrently acquired channels → channels passing a predeclared quality threshold → channels actually used by the decoder. Report the threshold, task and implant age; do not relabel the final count as independent neurons.

This ledger makes the differences between the BrainGate 100/96 counts, Precision's contact roles, BISC's 65,536/1,024 split, and Paradromics' 421/420 figures visible without pretending they arise from the same cause.

### Idea C — a growth rate is conditional on a constraint

**Open hypothesis:** “doubling every three years” may hold for one engineering budget and fail for another.

**Research test:** construct separate histories for sites per fixed area, concurrent channels per implant, and working channels retained at a fixed duration. Add insertion time, package size, power and coverage only when sources actually report them. Missing constraints stay missing rather than being assumed constant.

### Idea D — the useful next electrode depends on the task

**Open hypothesis:** placement and the additional information captured by a contact can explain more of its value than company identity.

**Research test:** use channel-subsampling studies with matched train/test conditions, then compare local density gains with gains from wider coverage. Preserve both positive and null results. A task that saturates early does not prove that all tasks do.

## Suggested editorial structure for the website

For each idea, display **What we know → What I think it means → What would test it → What changed**. Keep a visible evidence date and status such as **Open hypothesis**, **Evidence added**, **Supported in one setting**, or **Revised**. Preserve earlier reasoning when a result changes the interpretation so the area becomes a research notebook that evolves, rather than a page of permanent claims.

For company cards, use verbs that describe the demonstrated mechanism: **replicate, densify, expand readout, retain, select**. Keep projections explicitly separate from achieved measurements. These notes provide content and reasoning only; no claims of deployed website integration are made here.
