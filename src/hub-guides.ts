// Introductory synthesis; exact sources are attached to each guide and method.
const hubGuides: Record<string, HubGuide> = {
  "interfaces": {
    "primer": [
      "A recording interface connects tissue and sensor to a calibrated digital signal through electrodes, a reference, amplification, acquisition, and timing.",
      "High-density extracellular probes sample voltages near neuronal populations; their channel count alone does not establish how many distinct neurons can be recovered or tracked over time."
    ],
    "tradeoffs": [
      {
        "choice": "Recording density versus system complexity",
        "benefit": "More recording sites can improve population coverage and distinguish spatially overlapping waveforms.",
        "cost": "Acquisition bandwidth, storage, spike sorting, and channel bookkeeping all grow."
      },
      {
        "choice": "Local access versus experimental burden",
        "benefit": "Intracortical electrodes can resolve nearby spiking activity that scalp measurements cannot isolate.",
        "cost": "Implantation and limited tissue sampling constrain experimental access and interpretation."
      },
      {
        "choice": "Simple clocks versus shared synchronization",
        "benefit": "Independent devices are easy to assemble into a flexible recording rig.",
        "cost": "Matching nominal sample rates does not correct start offsets or clock drift."
      }
    ],
    "workflow": [
      {
        "title": "Specify the measurement",
        "action": "Choose the neural variable, anatomical coverage, reference scheme, and recording duration needed by the question.",
        "output": "A measurement specification with acceptance criteria."
      },
      {
        "title": "Map and calibrate",
        "action": "Verify channel identities, voltage scaling, probe geometry, and signal quality using known inputs before collecting experimental data.",
        "output": "A checked channel map and calibration record."
      },
      {
        "title": "Establish a common clock",
        "action": "Record a shared synchronization signal across acquisition, stimulus, and behavior streams; examine alignment throughout the session.",
        "output": "A documented timestamp transform and residual timing error."
      },
      {
        "title": "Audit a pilot session",
        "action": "Inspect noise, artifacts, lost samples, drift, and recoverable activity before scaling collection.",
        "output": "A pilot report linking hardware settings to usable data."
      }
    ],
    "pitfalls": [
      "Treating every detected waveform or recording channel as a distinct, stable neuron.",
      "Aligning streams only at recording start and assuming their clocks remain synchronized."
    ],
    "sources": [
      {
        "title": "Jun et al. — Fully integrated silicon probes for high-density recording of neural activity",
        "url": "https://www.nature.com/articles/nature24636"
      },
      {
        "title": "Open Ephys — Synchronizing Data Streams",
        "url": "https://open-ephys.github.io/gui-docs/Tutorials/Data-Synchronization.html"
      }
    ],
    "related": [
      "signals",
      "behavior",
      "data"
    ]
  },
  "signals": {
    "primer": [
      "Neural signal processing turns calibrated recordings into quantities such as event-related responses, spectral power, or candidate spike trains while preserving their measurement context.",
      "Electrophysiology measures electrical potentials, and MEG detects associated magnetic fields. fNIRS and BOLD fMRI track hemodynamic changes and require different timing and interpretation."
    ],
    "tradeoffs": [
      {
        "choice": "Artifact removal versus signal preservation",
        "benefit": "Rejecting contaminated channels or intervals can improve interpretability.",
        "cost": "Aggressive cleaning can remove biological activity and change which trials remain."
      },
      {
        "choice": "Short windows versus stable estimates",
        "benefit": "Short analysis windows retain transient changes and event timing.",
        "cost": "Spectral estimates become less stable and nearby frequencies harder to separate."
      },
      {
        "choice": "Strict unit selection versus population coverage",
        "benefit": "Multiple spike-sorting quality measures can identify questionable candidate units.",
        "cost": "Thresholds alter the sampled population and cannot substitute for known ground truth."
      }
    ],
    "workflow": [
      {
        "title": "Inspect the raw recording",
        "action": "Check units, reference, channel types, discontinuities, and event markers before transforming the signal.",
        "output": "A raw-data quality report and event table."
      },
      {
        "title": "Define preprocessing",
        "action": "Choose filters and artifact rules from the question; preserve raw data and record parameters and exclusions.",
        "output": "A reproducible preprocessing configuration."
      },
      {
        "title": "Extract an appropriate representation",
        "action": "Create event-aligned epochs for responses, time-frequency features for rhythms, or spike-sorting outputs for extracellular units.",
        "output": "A feature set with explicit units and time coordinates."
      },
      {
        "title": "Challenge the result",
        "action": "Compare sensible parameter choices, inspect discarded data, and evaluate multiple unit-quality metrics when sorting spikes.",
        "output": "A sensitivity summary showing which conclusions persist."
      }
    ],
    "pitfalls": [
      "Interpreting a cleaner-looking trace as proof that preprocessing preserved the relevant biology.",
      "Reporting a spike-sorting quality score as if it were a direct measurement of sorting accuracy."
    ],
    "sources": [
      {
        "title": "MNE — The Epochs data structure",
        "url": "https://mne.tools/stable/auto_tutorials/epochs/10_epochs_overview.html"
      },
      {
        "title": "SpikeInterface — Quality Metrics module",
        "url": "https://spikeinterface.readthedocs.io/en/stable/modules/metrics/quality_metrics.html"
      }
    ],
    "related": [
      "interfaces",
      "bci",
      "imaging"
    ]
  },
  "bci": {
    "primer": [
      "A brain-computer interface maps recorded neural activity to an output such as a selection, cursor command, or communication signal, usually within a feedback loop.",
      "A useful decoder must survive the conditions in which it will operate: within-session prediction, transfer to later sessions, and online use answer different engineering questions."
    ],
    "tradeoffs": [
      {
        "choice": "Individual calibration versus setup burden",
        "benefit": "Participant-specific training can adapt to individual signal characteristics.",
        "cost": "Calibration consumes time and may need repeating as recordings change."
      },
      {
        "choice": "Longer evidence windows versus responsiveness",
        "benefit": "Combining more signal can improve the stability of a decision.",
        "cost": "The user waits longer, and delayed feedback can change closed-loop behavior."
      },
      {
        "choice": "Adaptive decoding versus evaluation clarity",
        "benefit": "Updating a decoder may accommodate signal drift.",
        "cost": "Evaluation must specify what target-session data and labels the update can use."
      }
    ],
    "workflow": [
      {
        "title": "Define the task",
        "action": "Specify outputs, the no-command state, feedback, and metrics for errors, latency, and task completion.",
        "output": "An operational task specification."
      },
      {
        "title": "Build a baseline",
        "action": "Fit a simple preprocessing-and-decoding pipeline using training data only, including learned normalization and feature selection.",
        "output": "A reproducible baseline and calibration record."
      },
      {
        "title": "Match evaluation to deployment",
        "action": "Report within-session held-out trials separately from held-out sessions; group correlated windows and document any target-session adaptation.",
        "output": "A split manifest and performance by participant and session."
      },
      {
        "title": "Test the feedback loop",
        "action": "Measure end-to-end delay, false commands, recovery, and task completion during authorized online evaluation.",
        "output": "An online task report; clinical benefit requires separately defined clinical endpoints."
      }
    ],
    "pitfalls": [
      "Splitting overlapping windows across training and test sets or fitting learned preprocessing before the split.",
      "Treating offline classification accuracy as evidence of reliable daily use or clinical benefit."
    ],
    "sources": [
      {
        "title": "MNE — Decoding (MVPA)",
        "url": "https://mne.tools/stable/auto_tutorials/machine-learning/50_decoding.html"
      },
      {
        "title": "MOABB — CrossSessionEvaluation",
        "url": "https://moabb.neurotechx.com/docs/generated/moabb.evaluations.CrossSessionEvaluation.html"
      }
    ],
    "related": [
      "signals",
      "interfaces",
      "translation"
    ]
  },
  "stimulation": {
    "primer": [
      "Neural stimulation research studies how an imposed perturbation interacts with neural tissue; this introductory workflow focuses on electric-field modeling for non-invasive stimulation.",
      "A SimNIBS field map estimates exposure under anatomical and physical assumptions, while neural responses, behavioral changes, and clinical outcomes require separate measurements."
    ],
    "tradeoffs": [
      {
        "choice": "Target exposure versus off-target exposure",
        "benefit": "Optimizing electrode or coil configuration can improve a specified target-field objective.",
        "cost": "The complete field distribution still matters; a single target summary hides exposure elsewhere."
      },
      {
        "choice": "Individual anatomy versus preparation effort",
        "benefit": "An individual head model represents that participant's geometry.",
        "cost": "Segmentation, registration, and mesh errors require inspection and can affect predictions."
      },
      {
        "choice": "Fixed assumptions versus uncertainty analysis",
        "benefit": "A nominal simulation is quick to inspect and compare.",
        "cost": "A single answer conceals sensitivity to uncertain tissue conductivity and device placement."
      }
    ],
    "workflow": [
      {
        "title": "State the modeling question",
        "action": "Define the target region, field quantity, coordinate system, and comparison of interest using example data first.",
        "output": "A research question and a defined field metric."
      },
      {
        "title": "Inspect the model",
        "action": "Check tissue boundaries, mesh quality, and the alignment of the anatomical model and device model.",
        "output": "A documented anatomy and geometry review."
      },
      {
        "title": "Compare simulations",
        "action": "Run documented example configurations and vary relevant modeling assumptions without treating outputs as dosing instructions.",
        "output": "Comparable field maps and sensitivity estimates."
      },
      {
        "title": "Separate prediction from evidence",
        "action": "Report model assumptions and uncertainty, then specify which independent neural or behavioral measurements would test the hypothesis.",
        "output": "A modeling report with clearly separated research and clinical endpoints."
      }
    ],
    "pitfalls": [
      "Reading a field hotspot as proof that a brain region was activated or that a treatment will work.",
      "Comparing maps with inconsistent coordinates, field quantities, color scales, or anatomical assumptions."
    ],
    "sources": [
      {
        "title": "SimNIBS — Setting up and Running Simulations",
        "url": "https://simnibs.github.io/simnibs/build/html/tutorial/gui.html"
      },
      {
        "title": "SimNIBS — Uncertainty Quantification",
        "url": "https://simnibs.github.io/simnibs/build/html/tutorial/advanced/uq.html"
      }
    ],
    "related": [
      "computation",
      "imaging",
      "translation"
    ]
  },
  "computation": {
    "primer": [
      "Computational neuroscience expresses a hypothesis as a model whose simulated or predicted observations can be compared with data.",
      "A model's explanatory value depends on what it can distinguish from alternatives, not just whether one parameter setting produces a plausible-looking neural trace."
    ],
    "tradeoffs": [
      {
        "choice": "Biological detail versus identifiability",
        "benefit": "Additional mechanisms allow more specific physiological questions.",
        "cost": "More parameters may admit multiple explanations of the same observations."
      },
      {
        "choice": "Numerical precision versus compute cost",
        "benefit": "Smaller time steps can better resolve fast simulated dynamics.",
        "cost": "Runtime and storage increase, and convergence still needs checking."
      },
      {
        "choice": "Rich monitoring versus efficient simulation",
        "benefit": "Recording more state variables makes the mechanism easier to inspect.",
        "cost": "Monitor sampling and scheduling can dominate memory use or hide important events."
      }
    ],
    "workflow": [
      {
        "title": "Write a falsifiable hypothesis",
        "action": "Choose an observable and state how competing mechanisms would produce different outcomes.",
        "output": "A hypothesis with a discriminating prediction."
      },
      {
        "title": "Build the smallest useful model",
        "action": "Implement equations with explicit physical units; document inputs, initial states, thresholds, resets, and parameter meanings.",
        "output": "An executable model specification."
      },
      {
        "title": "Verify numerical behavior",
        "action": "Check units, integration time step, monitor timing, repeatability, and whether repeated runs reset or continue the network.",
        "output": "A numerical verification record."
      },
      {
        "title": "Test generalization",
        "action": "Sweep plausible parameters and random seeds, then compare predictions with observations withheld from model tuning.",
        "output": "A prediction comparison and sensitivity map."
      }
    ],
    "pitfalls": [
      "Mistaking a numerical artifact, monitor timing choice, or unit conversion error for a neural mechanism.",
      "Claiming a mechanism is uniquely established because one fitted model reproduces the data."
    ],
    "sources": [
      {
        "title": "Brian2 — Physical units",
        "url": "https://brian2.readthedocs.io/en/stable/user/units.html"
      },
      {
        "title": "Brian2 — Running a simulation",
        "url": "https://brian2.readthedocs.io/en/stable/user/running.html"
      }
    ],
    "related": [
      "signals",
      "stimulation",
      "data"
    ]
  },
  "behavior": {
    "primer": [
      "Video-based pose estimation measures behavior by predicting visible body landmarks; it does not directly record neural activity.",
      "DeepLabCut provides learned landmark tracking, while a multi-camera workflow such as Anipose combines calibrated views to reconstruct three-dimensional positions."
    ],
    "tradeoffs": [
      {
        "choice": "Single view versus multiple views",
        "benefit": "One camera simplifies acquisition and can answer many planar-motion questions.",
        "cost": "Occlusion and depth ambiguity remain; three-dimensional reconstruction adds calibration and synchronization demands."
      },
      {
        "choice": "Broad labels versus annotation effort",
        "benefit": "Training examples spanning subjects, postures, and backgrounds improve coverage of the intended setting.",
        "cost": "Consistent landmark definitions and representative labeling take time."
      },
      {
        "choice": "Smoothing versus fast movement",
        "benefit": "Temporal and anatomical constraints can suppress implausible tracking jumps.",
        "cost": "Strong constraints may erase real rapid movements or conceal failed detections."
      }
    ],
    "workflow": [
      {
        "title": "Define observable landmarks",
        "action": "Choose repeatable anatomical points and capture representative views, lighting, subjects, and movements.",
        "output": "A labeling guide and representative video set."
      },
      {
        "title": "Calibrate geometry and time",
        "action": "For multiple views, estimate camera intrinsics and extrinsics, preserve scale units, and verify frame correspondence.",
        "output": "A calibration record and shared frame timeline."
      },
      {
        "title": "Train and inspect predictions",
        "action": "Label diverse examples, evaluate held-out videos or subjects, and review overlays for occlusions and identity swaps.",
        "output": "Landmark predictions with an error audit."
      },
      {
        "title": "Reconstruct and validate behavior",
        "action": "Triangulate matched views, inspect reprojections and implausible motion, then align derived behavior with neural events.",
        "output": "Validated trajectories with uncertainty and a documented time base."
      }
    ],
    "pitfalls": [
      "Treating high landmark confidence as proof of accurate three-dimensional position or camera calibration.",
      "Randomly splitting adjacent video frames and calling the result generalization to new animals or recording sessions."
    ],
    "sources": [
      {
        "title": "DeepLabCut — Get started: key recommendations",
        "url": "https://deeplabcut.github.io/DeepLabCut/docs/UseOverviewGuide.html"
      },
      {
        "title": "Anipose — Tutorial",
        "url": "https://anipose.readthedocs.io/en/stable/tutorial.html"
      }
    ],
    "related": [
      "interfaces",
      "signals",
      "bci"
    ]
  },
  "imaging": {
    "primer": [
      "Functional imaging converts physical contrast into measurements related to neural activity: BOLD fMRI and fNIRS reflect hemodynamics, while calcium imaging records fluorescence from calcium-sensitive indicators.",
      "These are different observation processes from electrical recording, so acquisition timing, signal conversion, spatial sampling, and nuisance sources must match the modality."
    ],
    "tradeoffs": [
      {
        "choice": "Broad coverage versus cellular specificity",
        "benefit": "Large-scale imaging can compare activity-related signals across anatomical regions.",
        "cost": "Cell-resolved optical measurements answer different questions and require access to the labeled tissue."
      },
      {
        "choice": "Averaging versus individual dynamics",
        "benefit": "Averaging repeated responses can improve visibility of a consistent signal.",
        "cost": "Trial variability and the temporal behavior of the measurement process can be hidden."
      },
      {
        "choice": "Nuisance correction versus model dependence",
        "benefit": "Motion, scalp-coupling, and neuropil checks improve the interpretation of extracted signals.",
        "cost": "Correction choices and baseline definitions influence the quantities finally compared."
      }
    ],
    "workflow": [
      {
        "title": "Identify the observation process",
        "action": "State whether the data are anatomical contrast, hemodynamic responses, or calcium-dependent fluorescence and define the expected comparison.",
        "output": "A modality-specific measurement model."
      },
      {
        "title": "Check acquisition context",
        "action": "Inspect movement, sensor or image geometry, event timing, and modality-specific quality indicators.",
        "output": "An acquisition-quality and alignment report."
      },
      {
        "title": "Convert and extract",
        "action": "For fNIRS, inspect optical density before estimating relative hemoglobin changes; for calcium data, inspect masks, neuropil correction, and fluorescence normalization.",
        "output": "Interpretable signals with documented units and preprocessing."
      },
      {
        "title": "Evaluate the biological claim",
        "action": "Compare conditions and nuisance explanations, inspect trial consistency, and keep proxy-signal changes separate from inferred neuronal events.",
        "output": "A result with explicit measurement limitations."
      }
    ],
    "pitfalls": [
      "Calling a hemodynamic response a direct voltage recording or assigning each fluorescence peak to a single spike.",
      "Ignoring motion, systemic physiology, or surrounding-tissue fluorescence because the final average looks plausible."
    ],
    "sources": [
      {
        "title": "MNE — Preprocessing functional near-infrared spectroscopy data",
        "url": "https://mne.tools/stable/auto_tutorials/preprocessing/70_fnirs_processing.html"
      },
      {
        "title": "AllenSDK — Brain Observatory",
        "url": "https://allensdk.readthedocs.io/en/latest/brain_observatory.html"
      }
    ],
    "related": [
      "signals",
      "stimulation",
      "data"
    ]
  },
  "data": {
    "primer": [
      "Reusable neuroengineering data preserve the relationship among measurements, events, participants, devices, and processing decisions.",
      "NWB is a neurophysiology data standard supported by DANDI; OpenNeuro distributes datasets organized with BIDS, including versioned snapshots and study metadata."
    ],
    "tradeoffs": [
      {
        "choice": "Standard structure versus conversion effort",
        "benefit": "Common formats make tools and datasets easier to combine.",
        "cost": "Conversion requires careful mapping of units, timestamps, identities, and experimental meaning."
      },
      {
        "choice": "Rich context versus sharing constraints",
        "benefit": "Detailed metadata helps another researcher interpret and reuse the observations.",
        "cost": "Consent, data rights, and identifying information constrain what may be shared."
      },
      {
        "choice": "Convenient derivatives versus provenance",
        "benefit": "Processed signals accelerate exploration and reduce repeated computation.",
        "cost": "They are difficult to audit without raw inputs, parameters, software versions, and exclusion records."
      }
    ],
    "workflow": [
      {
        "title": "Choose data by the question",
        "action": "Check modality, task, subjects, session structure, licensing, and whether the necessary events and outcomes exist.",
        "output": "A dataset suitability note."
      },
      {
        "title": "Pin the source",
        "action": "Record the dataset identifier, exact release or snapshot, selected files, and required acknowledgments.",
        "output": "A source manifest that another researcher can recover."
      },
      {
        "title": "Validate meaning and structure",
        "action": "Run applicable format checks, then inspect units, channel identities, trial labels, timestamps, missingness, and representative recordings.",
        "output": "A validation report covering both format and scientific interpretation."
      },
      {
        "title": "Make the analysis reproducible",
        "action": "Save code, environment, parameters, split definitions, and derived outputs linked to their inputs; cite the dataset version.",
        "output": "A reproducible analysis package with traceable provenance."
      }
    ],
    "pitfalls": [
      "Assuming successful schema validation proves that event labels, units, or scientific metadata are correct.",
      "Using a changing dataset without recording its version, then being unable to reproduce the result."
    ],
    "sources": [
      {
        "title": "DANDI — Neurodata Without Borders",
        "url": "https://docs.dandiarchive.org/getting-started/data-standards/nwb/"
      },
      {
        "title": "OpenNeuro — User Guide",
        "url": "https://docs.openneuro.org/user_guide.html"
      }
    ],
    "related": [
      "signals",
      "computation",
      "translation"
    ]
  },
  "translation": {
    "primer": [
      "Clinical translation connects a defined user need to a device, an evidence plan, and responsible long-term use. FDA's implanted BCI guidance addresses nonclinical testing and clinical study considerations for devices intended for people with paralysis or amputation.",
      "An early feasibility study can investigate initial safety and functionality and inform design changes. It does not by itself establish durable effectiveness or readiness for routine care. Useful outcomes should connect technical performance to the intended task and the user's experience.",
      "UNESCO and OECD place autonomy, informed consent, privacy, inclusion, and accountability across the technology lifecycle. These frameworks guide ethical analysis; applying a recommendation does not replace the laws, regulatory decisions, or research oversight relevant to a particular project."
    ],
    "tradeoffs": [
      {
        "choice": "Narrow intended use",
        "benefit": "Makes evidence and outcomes easier to interpret.",
        "cost": "Limits claims beyond the studied setting."
      },
      {
        "choice": "Broad data sharing",
        "benefit": "Supports scrutiny and reuse.",
        "cost": "Requires purpose limits, consent, and appropriate privacy safeguards."
      }
    ],
    "workflow": [
      {
        "title": "Define the need",
        "action": "Describe the intended users, setting, task, and meaningful outcome with user input.",
        "output": "A focused use-case statement."
      },
      {
        "title": "Map the evidence",
        "action": "Separate bench evidence, initial clinical safety, functionality, and longer-term effectiveness questions.",
        "output": "An evidence-gap map."
      },
      {
        "title": "Review responsibilities",
        "action": "Map consent, data access, accessibility, accountability, and ongoing support across the lifecycle.",
        "output": "A responsibilities matrix."
      },
      {
        "title": "Plan expert review",
        "action": "Identify applicable guidance and unresolved questions for clinical, regulatory, and ethics specialists.",
        "output": "A research-planning brief."
      }
    ],
    "pitfalls": [
      "Treating decoder accuracy as sufficient evidence of meaningful benefit.",
      "Confusing feasibility evidence with established safety or effectiveness.",
      "Treating a governance framework as universal legal authorization."
    ],
    "sources": [
      {
        "title": "FDA: Implanted BCI devices—nonclinical testing and clinical considerations",
        "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/implanted-brain-computer-interface-bci-devices-patients-paralysis-or-amputation-non-clinical-testing"
      },
      {
        "title": "FDA: Early Feasibility Studies Program",
        "url": "https://www.fda.gov/medical-devices/investigational-device-exemption-ide/early-feasibility-studies-efs-program"
      },
      {
        "title": "UNESCO: Recommendation on the Ethics of Neurotechnology",
        "url": "https://www.unesco.org/en/legal-affairs/recommendation-ethics-neurotechnology"
      },
      {
        "title": "OECD: Neurotechnology",
        "url": "https://www.oecd.org/en/topics/sub-issues/neurotechnology.html"
      }
    ],
    "related": [
      "bci",
      "interfaces",
      "stimulation",
      "data"
    ]
  },
  "regeneration": {
    "primer": [
      "Biohybrid regenerative bioelectronics combines implantable electronics with living cellular components. The engineering question concerns integration among the device, the transplanted cells, and host tissue, with recording or modulation linked to a proposed function.",
      "The Cambridge perspective identifies unresolved challenges in selectivity, tissue architecture, transplant survival, and guidance of integration. Its future applications are research directions. Demonstrating cell survival, signal recording, or anatomical contact alone does not establish functional restoration in people.",
      "NIH's stem-cell directory links regenerative medicine and translation programs, including research using adult stem cells and induced pluripotent stem cells. It provides broader research context, not evidence that a particular neural implant works. Program descriptions and archived material should be checked before inferring current opportunities."
    ],
    "tradeoffs": [
      {
        "choice": "More complex tissue",
        "benefit": "May better represent a target's organization.",
        "cost": "Makes survival, characterization, and device integration harder."
      },
      {
        "choice": "Closer biological integration",
        "benefit": "May improve access to relevant host activity.",
        "cost": "Creates additional cell, tissue, and manufacturing dependencies."
      }
    ],
    "workflow": [
      {
        "title": "Separate the claims",
        "action": "Distinguish recording, modulation, tissue integration, and functional restoration in the proposed application.",
        "output": "A claim map."
      },
      {
        "title": "Locate the evidence",
        "action": "Label findings by model, comparator, observation period, and the outcome actually measured.",
        "output": "An evidence table."
      },
      {
        "title": "Map interface questions",
        "action": "Compare cell survival, tissue organization, selectivity, and stability across the proposed components.",
        "output": "An engineering question list."
      },
      {
        "title": "Define the next review",
        "action": "Identify missing evidence and expertise needed to assess the concept's translational plausibility.",
        "output": "A research review brief."
      }
    ],
    "pitfalls": [
      "Equating anatomical integration with useful function.",
      "Extending an animal or culture result directly to people.",
      "Interpreting an NIH program listing as treatment approval."
    ],
    "sources": [
      {
        "title": "Carnicer-Lombarte, Malliaras, and Barone: The future of biohybrid regenerative bioelectronics",
        "url": "https://www.repository.cam.ac.uk/bitstreams/c6175e61-28b4-4766-98b6-7d5567978794/download"
      },
      {
        "title": "NIH: Stem Cell Research",
        "url": "https://stemcells.nih.gov/NIH-Stem-Cell-Research"
      },
      {
        "title": "NIH Common Fund: Regenerative Medicine Program health relevance (archived)",
        "url": "https://commonfund.nih.gov/stemcells/public"
      }
    ],
    "related": [
      "interfaces",
      "stimulation",
      "translation",
      "imaging"
    ]
  }
};
const hubMethods: HubMethod[] = [
  {
    "id": "eeg",
    "name": "EEG",
    "signal": "Voltage differences at scalp electrodes, reflecting spatially mixed electrical activity.",
    "access": "Non-invasive scalp recording in research and clinical settings.",
    "strength": "Tracks rapid changes in electrical activity with flexible sensor arrangements.",
    "limit": "Reference choice and artifacts affect measurements; scalp patterns do not uniquely identify their neural sources.",
    "source": {
      "title": "MNE — Setting the EEG reference",
      "url": "https://mne.tools/stable/auto_tutorials/preprocessing/55_setting_eeg_reference.html"
    }
  },
  {
    "id": "meg",
    "name": "MEG",
    "signal": "Magnetic fields outside the head generated by neural electrical currents.",
    "access": "Non-invasive recording using specialized magnetic sensors and facilities.",
    "strength": "Tracks rapid neural population dynamics and supports anatomical source modeling.",
    "limit": "Head-to-sensor geometry and source assumptions matter; specialized equipment limits access.",
    "source": {
      "title": "NIMH — Magnetoencephalography Core Facility",
      "url": "https://www.nimh.nih.gov/research/research-conducted-at-nimh/research-areas/research-support-services/meg"
    }
  },
  {
    "id": "ecog",
    "name": "ECoG",
    "signal": "Electrical potentials recorded by electrodes at the cortical surface.",
    "access": "Invasive recording; human research commonly accompanies clinically indicated electrode placement.",
    "strength": "Samples cortical population activity close to the tissue with clear anatomical electrode locations.",
    "limit": "Coverage is restricted to implanted regions, and participants and locations reflect access constraints.",
    "source": {
      "title": "MNE — Working with ECoG data",
      "url": "https://mne.tools/stable/auto_tutorials/clinical/30_ecog.html"
    }
  },
  {
    "id": "intracortical",
    "name": "Intracortical electrodes",
    "signal": "Extracellular voltages within tissue, including waveforms used to estimate spikes and local field activity.",
    "access": "Invasive animal research and selected human research contexts.",
    "strength": "Can resolve activity from nearby individual neurons and local populations.",
    "limit": "Samples selected tissue volumes; separating neurons and establishing stable identities require additional analysis.",
    "source": {
      "title": "Jun et al. — Fully integrated silicon probes for high-density recording of neural activity",
      "url": "https://www.nature.com/articles/nature24636"
    }
  },
  {
    "id": "fmri",
    "name": "BOLD fMRI",
    "signal": "MRI contrast associated with blood oxygenation changes; an indirect hemodynamic measure.",
    "access": "Non-invasive imaging in an MRI scanner.",
    "strength": "Relates functional responses to anatomical regions, including structures inaccessible to surface sensors.",
    "limit": "The vascular response limits temporal interpretation; scanner conditions and movement affect experiments.",
    "source": {
      "title": "NIBIB — Magnetic Resonance Imaging",
      "url": "https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri"
    }
  },
  {
    "id": "fnirs",
    "name": "fNIRS",
    "signal": "Changes in light attenuation used to estimate relative oxy- and deoxyhemoglobin changes.",
    "access": "Non-invasive scalp optodes; research focusing on accessible cortical regions.",
    "strength": "Measures hemodynamic responses with a flexible arrangement of sources and detectors.",
    "limit": "Scalp coupling, motion, and non-neural physiology affect the signal; depth coverage is limited.",
    "source": {
      "title": "MNE — Preprocessing functional near-infrared spectroscopy data",
      "url": "https://mne.tools/stable/auto_tutorials/preprocessing/70_fnirs_processing.html"
    }
  },
  {
    "id": "calcium",
    "name": "Calcium imaging",
    "signal": "Fluorescence changes from calcium-sensitive indicators; a proxy for cellular activity.",
    "access": "Predominantly animal research with labeled cells and optical access to tissue.",
    "strength": "Associates activity-related signals with identified cells in an imaging field.",
    "limit": "Indicator dynamics, cell segmentation, and surrounding neuropil complicate the link between fluorescence and spikes.",
    "source": {
      "title": "AllenSDK — Brain Observatory",
      "url": "https://allensdk.readthedocs.io/en/latest/brain_observatory.html"
    }
  },
  {
    "id": "pose",
    "name": "Pose video",
    "signal": "Visible body landmarks and derived trajectories: a behavioral measurement, not a neural recording.",
    "access": "Camera-based human or animal behavior experiments; multiple calibrated views support 3D reconstruction.",
    "strength": "Quantifies movement and provides context for interpreting simultaneously recorded neural activity.",
    "limit": "Occlusion, training coverage, calibration, and synchronization can create plausible but incorrect trajectories.",
    "source": {
      "title": "Anipose — Tutorial",
      "url": "https://anipose.readthedocs.io/en/stable/tutorial.html"
    }
  }
];
