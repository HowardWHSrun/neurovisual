interface HubResource { reviewed?: string; id: string; title: string; url: string; description: string; topic: string; type: string; level: string; }
interface HubTopic { id: string; title: string; eyebrow: string; description: string; question: string; concepts: string[]; atlasQuery: string; color: string; }
const hubTopics: HubTopic[] = [
  { id: 'interfaces', title: 'Neural interfaces', eyebrow: 'CONNECT', description: 'Electrodes, acquisition electronics, materials, and the interface with living tissue.', question: 'How do we record useful signals without losing stability over time?', concepts: ['Electrode impedance and noise', 'Biocompatibility and chronic stability', 'Bandwidth, power, and telemetry'], atlasQuery: 'electrode', color: '#155bc5' },
  { id: 'signals', title: 'Signals & decoding', eyebrow: 'INTERPRET', description: 'From raw EEG and spikes to features, neural codes, and reproducible models.', question: 'What information is in a neural signal, and does a decoder generalize?', concepts: ['Filtering and artifact rejection', 'Spike sorting and quality control', 'Cross-validation and distribution shift'], atlasQuery: 'decod', color: '#7149b9' },
  { id: 'bci', title: 'Brain–computer interfaces', eyebrow: 'RESTORE', description: 'Systems that translate neural activity into communication, control, and feedback.', question: 'How do sensing, decoding, and feedback become a usable closed-loop system?', concepts: ['Motor and speech decoding', 'Real-time latency and calibration', 'Sensory feedback and user agency'], atlasQuery: 'BCI', color: '#077e77' },
  { id: 'stimulation', title: 'Neuromodulation', eyebrow: 'MODULATE', description: 'Electrical, magnetic, optical, and acoustic methods for influencing neural activity.', question: 'How do we choose a target, quantify a dose, and evaluate an effect?', concepts: ['Targeting and field modeling', 'Open-loop versus adaptive control', 'Experimental endpoints and evidence'], atlasQuery: 'stimulation', color: '#b75221' },
  { id: 'computation', title: 'Computational neuroscience', eyebrow: 'MODEL', description: 'Models linking cells, circuits, population dynamics, and behavior.', question: 'Which level of model can answer a specific biological question?', concepts: ['Single-neuron and network models', 'Dynamical systems and population codes', 'Model assumptions and validation'], atlasQuery: 'model', color: '#5757bf' },
  { id: 'behavior', title: 'Behavior & 3D vision', eyebrow: 'OBSERVE', description: 'Pose estimation, synchronized experiments, and quantitative behavior analysis.', question: 'How do we connect neural activity to reliably measured behavior?', concepts: ['Keypoints and held-out evaluation', 'Camera calibration and triangulation', 'Synchronization and kinematics'], atlasQuery: 'behavior', color: '#087a54' },
  { id: 'imaging', title: 'Imaging & brain maps', eyebrow: 'MAP', description: 'From calcium imaging and MRI to cellular atlases and connectivity.', question: 'What does an imaging measurement capture, and at what scale?', concepts: ['Spatial and temporal resolution', 'Motion correction and segmentation', 'Functional versus structural measures'], atlasQuery: 'imaging', color: '#a53c72' },
  { id: 'data', title: 'Open data & reproducibility', eyebrow: 'REPRODUCE', description: 'Public datasets, shared formats, provenance, and reusable analysis workflows.', question: 'Can another researcher inspect and reproduce the result?', concepts: ['NWB and BIDS data standards', 'Metadata, consent, and provenance', 'Versioned workflows and evaluation'], atlasQuery: 'data', color: '#486378' },
];
const hubGlossary = [
 ['Action potential', 'A brief electrical event in a neuron. Extracellular recordings detect related voltage changes near an electrode.', 'signals'],
 ['BCI', 'Brain–computer interface: a system that uses measured brain activity to communicate with or control an external system.', 'bci'],
 ['BIDS', 'Brain Imaging Data Structure: conventions for organizing neuroimaging and related neuroscience data and metadata.', 'data'],
 ['Closed loop', 'A system in which measured activity or performance changes the next action, such as stimulation or decoder feedback.', 'bci'],
 ['DBS', 'Deep brain stimulation: stimulation delivered through implanted electrodes to selected brain targets.', 'stimulation'],
 ['Decoder', 'A model that estimates a variable, such as movement or intended speech, from neural measurements.', 'signals'],
 ['EEG', 'Electroencephalography: electrical potential differences recorded at the scalp, reflecting aggregate neural activity.', 'signals'],
 ['ECoG', 'Electrocorticography: electrical recordings from electrodes on or near the surface of the brain.', 'interfaces'],
 ['EMG', 'Electromyography: measurement of electrical activity associated with muscles. It is a peripheral signal, not a direct brain recording.', 'interfaces'],
 ['fMRI', 'Functional magnetic resonance imaging; commonly uses blood-oxygen-level-dependent contrast as an indirect measure related to neural activity.', 'imaging'],
 ['Impedance', 'A frequency-dependent relationship between voltage and current. Electrode impedance interacts with the recording or stimulation circuit.', 'interfaces'],
 ['LFP', 'Local field potential: a low-frequency extracellular voltage signal reflecting combined activity around a recording site.', 'signals'],
 ['MEG', 'Magnetoencephalography: measurement of very small magnetic fields associated with neural electrical activity.', 'imaging'],
 ['Neuromodulation', 'Changing neural activity using an intervention. Methods differ in mechanism, spatial scale, invasiveness, and evidence.', 'stimulation'],
 ['NWB', 'Neurodata Without Borders: a data standard and software ecosystem for organizing neurophysiology data.', 'data'],
 ['Optogenetics', 'Use of genetically introduced light-sensitive proteins to influence activity in targeted cells.', 'stimulation'],
 ['Spike sorting', 'Estimating which recorded extracellular events arose from which units. Unit quality and stability require assessment.', 'signals'],
 ['TMS', 'Transcranial magnetic stimulation: changing electric fields in tissue using a time-varying magnetic field applied outside the head.', 'stimulation'],
 ['Triangulation', 'Estimating a 3D point from observations in multiple calibrated camera views.', 'behavior'],
 ['Cross-validation', 'Evaluating models on held-out data. Splits should respect subjects, sessions, or time when these can cause leakage.', 'computation'],
];
const hubResources: HubResource[] = [
 { id:'bci2000',title:'BCI2000 user tutorial',url:'https://bci2000.org/mediawiki/index.php/User_Tutorial',description:'Connect signal acquisition, processing, stimulus presentation, and feedback in a BCI workflow.',topic:'bci',type:'Tutorial',level:'Beginner'},
 { id:'brainflow',title:'BrainFlow',url:'https://brainflow.readthedocs.io/en/stable/',description:'A common API for acquiring and analyzing EEG, EMG, ECG, and other biosensor streams.',topic:'bci',type:'Tool',level:'Intermediate'},
 { id:'open-ephys',title:'Open Ephys GUI',url:'https://open-ephys.github.io/gui-docs/',description:'Modular acquisition software and practical guides for extracellular electrophysiology.',topic:'interfaces',type:'Tool',level:'Intermediate'},
 { id:'neuropixels',title:'Neuropixels',url:'https://www.neuropixels.org/',description:'Official probe, acquisition-system, software, manual, and training resources for dense neural recordings.',topic:'interfaces',type:'Hardware',level:'Advanced'},
 { id:'mne',title:'MNE-Python tutorials',url:'https://mne.tools/stable/auto_tutorials/index.html',description:'Work through EEG and MEG loading, preprocessing, visualization, and decoding.',topic:'signals',type:'Tutorial',level:'Beginner'},
 { id:'spikeinterface',title:'SpikeInterface',url:'https://spikeinterface.readthedocs.io/en/stable/',description:'Build reproducible spike-sorting workflows with quality metrics, curation, and visualization.',topic:'signals',type:'Tool',level:'Intermediate'},
 { id:'brian',title:'Brian 2',url:'https://brian2.readthedocs.io/en/stable/',description:'Simulate spiking neurons and networks with Python equations and worked examples.',topic:'computation',type:'Tool',level:'Intermediate'},
 { id:'neuron',title:'NEURON simulator',url:'https://www.neuronsimulator.org/en/latest/index.html',description:'Build biophysical neuron and network models using Python, HOC, or graphical tools.',topic:'computation',type:'Tool',level:'Advanced'},
 { id:'deeplabcut',title:'DeepLabCut',url:'https://deeplabcut.github.io/DeepLabCut/docs/UseOverviewGuide.html',description:'Get started with markerless animal pose estimation using notebooks, a GUI, or Python.',topic:'behavior',type:'Tutorial',level:'Beginner'},
 { id:'anipose',title:'Anipose tutorial',url:'https://anipose.readthedocs.io/en/stable/tutorial.html',description:'Reconstruct 3D movement from multiple camera views, including calibration and filtering.',topic:'behavior',type:'Tutorial',level:'Intermediate'},
 { id:'bonsai',title:'Bonsai',url:'https://bonsai-rx.org/docs/',description:'Create visual workflows for hardware interfaces, video, and real-time data streams.',topic:'behavior',type:'Tool',level:'Intermediate'},
 { id:'nilearn',title:'Nilearn quickstart',url:'https://nilearn.github.io/stable/quickstart.html',description:'Analyze brain volumes and surfaces using statistical models, decoding, and connectivity.',topic:'imaging',type:'Tutorial',level:'Intermediate'},
 { id:'suite2p',title:'Suite2p',url:'https://suite2p.readthedocs.io/en/latest/index.html',description:'Process calcium imaging through registration, cell detection, and signal extraction.',topic:'imaging',type:'Tool',level:'Intermediate'},
 { id:'simnibs',title:'SimNIBS tutorials',url:'https://simnibs.github.io/simnibs/build/html/tutorial/tutorial.html',description:'Create head models and investigate simulated electric fields for TES and TMS research.',topic:'stimulation',type:'Tutorial',level:'Advanced'},
 { id:'leaddbs',title:'Lead-DBS user guide',url:'https://netstim.gitbook.io/leaddbs',description:'Research workflows for DBS electrode localization, stimulation modeling, and connectomics.',topic:'stimulation',type:'Tool',level:'Advanced'},
 { id:'physionet',title:'EEG motor movement / imagery',url:'https://www.physionet.org/content/eegmmidb/1.0.0/',description:'Public EEG recordings for exploring motor imagery and offline BCI classification.',topic:'data',type:'Dataset',level:'Beginner'},
 { id:'allen',title:'Allen Brain Observatory',url:'https://allensdk.readthedocs.io/en/latest/brain_observatory.html',description:'Explore mouse visual-cortex calcium responses, stimulus tables, and tuning metrics.',topic:'data',type:'Dataset',level:'Intermediate'},
 { id:'dandi',title:'DANDI Archive',url:'https://docs.dandiarchive.org/',description:'Find shared electrophysiology, optical physiology, and behavioral datasets.',topic:'data',type:'Dataset',level:'Intermediate'},
 { id:'openneuro',title:'OpenNeuro',url:'https://docs.openneuro.org/',description:'Discover public neuroimaging datasets and learn their download and sharing workflows.',topic:'data',type:'Dataset',level:'Beginner'},
 { id:'nwb',title:'Neurodata Without Borders',url:'https://nwb.org/',description:'A common data standard connecting neurophysiology recordings, stimuli, and behavior.',topic:'data',type:'Standard',level:'Beginner'},
 { id:'neuromatch',title:'Neuromatch Academy',url:'https://compneuro.neuromatch.io/',description:'A structured computational neuroscience course, from prerequisite refreshers to models.',topic:'computation',type:'Course',level:'Beginner'},
 { id:'mit',title:'MIT: Introduction to Neural Computation',url:'https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/',description:'University lectures, notes, and exercises on neurons and quantitative neural data analysis.',topic:'computation',type:'Course',level:'Intermediate'},
];
const hubLearningPaths = [
 { id:'eeg', title:'Build your first EEG decoder', description:'Go from an unfamiliar recording to a transparent offline classification baseline.', prerequisites:'Basic Python, arrays, and introductory statistics', outcome:'An annotated notebook with preprocessing choices, feature plots, and held-out results.', steps:[['bci2000','Understand the loop','Connect acquisition, processing, and feedback. Identify what an offline decoder can and cannot establish.'],['mne','Inspect the signal','Load example EEG, inspect artifacts, annotate events, and create epochs.'],['physionet','Choose a real dataset','Select motor-imagery runs and document labels, subjects, and recording conditions.'],['mne','Evaluate a baseline','Use a decoding tutorial. Split by subject or session where appropriate; fit preprocessing on training data only.']] },
 { id:'motion', title:'Turn video into 3D movement', description:'Connect keypoint tracking to calibrated, interpretable behavioral measurements.', prerequisites:'Basic Python and access to multiview example video', outcome:'Labeled video, reconstructed 3D tracks, and a short report on trajectory quality.', steps:[['bonsai','Understand synchronized streams','Inspect video frames and timestamps. Explain how timing errors affect a movement trace.'],['deeplabcut','Track keypoints','Run a demo, evaluate held-out frames, and inspect occlusions and tracking failures.'],['anipose','Reconstruct in 3D','Use the multiview tutorial to calibrate cameras, triangulate, and inspect reprojection error.'],['anipose','Measure behavior','Plot trajectories and joint angles. Check units, missing points, and agreement with source video.']] },
 { id:'model', title:'Understand a neural network by building one', description:'Connect biological assumptions, mathematical models, and simulated activity.', prerequisites:'Basic Python; introductory calculus is helpful', outcome:'A reproducible notebook comparing voltage traces, raster plots, and firing rates.', steps:[['neuromatch','Refresh the foundations','Use the Python, mathematics, and neuroscience introductions to close prerequisite gaps.'],['mit','Connect equations to biology','Study membrane dynamics, integrate-and-fire neurons, and synapses. State simplifying assumptions.'],['brian','Implement the model','Simulate neurons, synaptic connections, and recorded activity using worked examples.'],['brian','Run a controlled comparison','Change input strength or coupling, compare outcomes, and explain the mechanism behind them.']] },
];

interface HubGuide {
  primer: string[];
  tradeoffs: {choice: string; benefit: string; cost: string}[];
  workflow: {title: string; action: string; output: string}[];
  pitfalls: string[];
  sources: {title: string; url: string}[];
  related: string[];
}
interface HubMethod {
  id: string; name: string; signal: string; access: string; strength: string; limit: string;
  source: {title: string; url: string};
}

hubLearningPaths.push(
 {id:'spikes',title:'Take extracellular data from raw traces to units',description:'Build a reproducible spike-sorting workflow and explain why a detected cluster may or may not be a useful unit.',prerequisites:'Python, signal-processing fundamentals, and an example extracellular recording',outcome:'A versioned notebook containing preprocessing choices, unit-quality metrics, and a documented inclusion policy.',steps:[['open-ephys','Audit the recording','Inspect channel maps, units, sampling rate, references, and event timestamps. Keep an untouched copy of the input. Explain how you would align behavioral events.'],['spikeinterface','Run a transparent pipeline','Start with a small recording segment. Document filtering, referencing, bad-channel handling, sorter version, and parameters before scaling to the complete dataset.'],['spikeinterface','Evaluate unit quality','Inspect waveforms, refractory-period violations, firing stability, and contamination-related metrics together. Document exclusion decisions rather than treating every output cluster as a neuron.'],['nwb','Package the result','Store units, event timing, recording metadata, and provenance in a documented structure. Include a reproducible command or notebook and a limitations section.']]},
 {id:'calcium',title:'Connect calcium recordings to stimulus responses',description:'Use open visual-cortex data to compare responses while respecting measurement and trial structure.',prerequisites:'Python, basic statistics, and introductory neuroscience',outcome:'A response-analysis notebook with trial-aligned plots, uncertainty estimates, and a clear description of the calcium signal.',steps:[['allen','Choose the experiment','Read the session and stimulus metadata. Record which cells, trials, visual stimuli, and behavioral variables are available before designing the comparison.'],['suite2p','Understand the preprocessing','Work through what registration, ROI detection, neuropil correction, and signal extraction accomplish. For preprocessed example data, identify which decisions were made upstream.'],['allen','Compare responses','Align fluorescence traces to stimulus times. Compare trial-level responses, retain trial structure, and distinguish measured fluorescence from inferred events.'],['nwb','Make the result reproducible','Save the dataset identifier, analysis parameters, and inclusion rules. Explain the limits of deconvolution and why a fluorescence transient is not a direct spike timestamp.']]},
 {id:'stimulation-model',title:'Explore a stimulation model responsibly',description:'Use a published example model to understand how assumptions change simulated electric fields.',prerequisites:'Basic electromagnetism and comfort following a scientific software tutorial',outcome:'A simulation report documenting input models, field summaries, sensitivity to assumptions, and the limits of inference.',steps:[['simnibs','Identify the modeled question','Start with provided examples and define a research question about a modeled electric field. This is a computational exercise, not a stimulation protocol for a person.'],['simnibs','Inspect inputs and geometry','Read the tutorial on head models, tissue segmentation, conductivity assumptions, and coordinate systems. Check alignment and units before interpreting a result.'],['simnibs','Compare model assumptions','Reproduce a baseline example, then change one documented model assumption at a time. Compare field summaries and maps without equating field strength with therapeutic benefit.'],['leaddbs','Connect modeling to evidence','Read how electrode localization and imaging uncertainty enter another stimulation-modeling workflow. Write down which predictions would still require experimental or clinical validation.']]}
);
const hubProjectChecks: Record<string,{checks:string[];stretch:string}> = {
 eeg:{checks:['Keep all epochs from a held-out subject or session out of training when testing that form of generalization.','Fit learned preprocessing and feature selection within each training split; compare against a simple baseline.','Report the split, sample counts, class balance, metric, and sources of uncertainty.'],stretch:'Compare within-session and across-session performance without changing the final test set.'},
 motion:{checks:['Inspect held-out frames and difficult poses, not only training loss or confidence scores.','Record camera calibration, timestamps, coordinate units, and missing-data handling.','Inspect reprojection error and overlay tracked points on the original videos.'],stretch:'Measure how calibration or time-alignment errors alter an example kinematic measurement.'},
 model:{checks:['State the biological question and the assumptions omitted by your model.','Record equations, units, integration method, timestep, and random seed.','Change one parameter at a time and test whether key results persist at a smaller timestep.'],stretch:'Compare an uncoupled population with a coupled one and explain which differences are caused by coupling.'},
 spikes:{checks:['Inspect raw traces and artifacts before trusting automated sorting output.','Use several quality metrics and waveform inspection; document an explicit inclusion policy.','Separate unit identity uncertainty from downstream scientific conclusions.'],stretch:'Compare two reasonable preprocessing or sorter configurations and report how stable your conclusions are.'},
 calcium:{checks:['Keep fluorescence, normalized fluorescence, and inferred events conceptually separate.','Preserve trial and session structure when calculating uncertainty or splitting data.','Trace every plot back to the dataset, cell-selection rules, and stimulus metadata.'],stretch:'Test whether an apparent stimulus-response effect persists after accounting for a measured behavioral variable.'},
 'stimulation-model':{checks:['Check coordinate systems, input geometry, units, and the software version.','Distinguish a predicted electric field from neural activation and clinical benefit.','State which tissue properties, segmentation choices, and placements drive uncertainty.'],stretch:'Compare a result under two plausible modeling assumptions and explain how that changes your confidence.'}
};

hubGlossary.push(
 ['ADC', 'Analog-to-digital converter: samples a voltage signal and represents each sample with a finite number of bits. Input range, noise, bandwidth, and sampling rate affect useful resolution.', 'interfaces'],
 ['Aliasing', 'A sampling artifact in which unresolved high-frequency content appears at lower frequencies. Appropriate analog filtering and sampling are part of acquisition design.', 'signals'],
 ['Common reference', 'A shared reference used to express recorded voltages. The reference can introduce or remove shared signal components and must be documented.', 'interfaces'],
 ['Signal-to-noise ratio', 'A comparison of a defined signal contribution with a defined noise contribution. The value depends on the measurement, bandwidth, and chosen definition.', 'signals'],
 ['Data leakage', 'Information from evaluation data entering training, preprocessing, feature selection, or model decisions, producing an overly optimistic assessment.', 'signals'],
 ['Domain shift', 'A change in data conditions between training and use, such as a different subject, recording session, task, or acquisition system.', 'bci'],
 ['Latency', 'Delay between an event and the system response. Acquisition, buffering, processing, communication, and actuation can each contribute.', 'bci'],
 ['Jitter', 'Variation in timing or latency from event to event. A correct average delay does not guarantee consistent alignment.', 'behavior'],
 ['Reprojection error', 'The discrepancy between an observed image point and the image position predicted by a calibrated 3D reconstruction.', 'behavior'],
 ['ROI', 'Region of interest: a selected region, mask, or cell candidate used for analysis. Selection rules can affect results.', 'imaging'],
 ['Neuropil', 'The dense mesh of neuronal and glial processes surrounding cell bodies; its fluorescence can contribute to a calcium-imaging measurement near a selected cell.', 'imaging'],
 ['ΔF/F', 'A relative fluorescence-change measure, typically (F − F₀) / F₀. The baseline definition F₀ matters; the quantity is not itself a direct spike count.', 'imaging'],
 ['Deconvolution', 'Estimating a latent signal or event process from an observed signal using assumptions about how the measurement was generated.', 'signals'],
 ['Identifiability', 'Whether the available measurements can distinguish a model parameter or mechanism from competing possibilities.', 'computation'],
 ['Provenance', 'The record of where data came from and which processing steps, parameters, software versions, and decisions produced an output.', 'data'],
 ['FAIR', 'Findable, Accessible, Interoperable, and Reusable: principles for managing data and metadata. Accessible does not necessarily mean unrestricted.', 'data'],
 ['IDE', 'Investigational Device Exemption: a U.S. framework for certain investigational medical-device studies. An IDE is not marketing authorization or a demonstration of efficacy.', 'translation'],
 ['Endpoint', 'A defined measurement used to evaluate a study objective. Technical accuracy, functional performance, safety, and quality of life are distinct outcomes.', 'translation'],
 ['Biohybrid interface', 'An interface combining living biological components with engineered structures or devices. Integration and long-term function require their own evidence.', 'regeneration'],
 ['Organoid', 'A self-organizing three-dimensional cell culture that models some features of an organ. It does not reproduce every property of a mature human organ.', 'regeneration']
);
const hubWorkedExamples: Record<string,{title:string;setup:string;steps:string[];interpretation:string}> = {
 interfaces:{title:'Estimate the raw data budget',setup:'Illustrative acquisition: 64 channels, 20,000 samples per second per channel, 16 bits per sample.',steps:['Raw bit rate = channels × sampling rate × bits per sample.','64 × 20,000 × 16 = 20,480,000 bits/s = 20.48 Mb/s.','Divide by 8: 2.56 MB/s. Over one hour: 2.56 × 3,600 = 9,216 MB = 9.216 GB.'],interpretation:'These use decimal SI units and exclude timestamps, headers, redundant storage, and other overhead. This is a storage/transport calculation, not a recommendation for a particular recording.'},
 signals:{title:'Why accuracy alone can mislead',setup:'Illustrative test set: 95 rest examples and 5 movement examples. A trivial classifier predicts rest for every example.',steps:['Correct predictions = 95 out of 100. Accuracy = 95%.','Detected movement examples = 0 out of 5. Movement recall = 0%.','Rest recall = 100%; balanced accuracy = (100% + 0%) / 2 = 50%.'],interpretation:'A high overall accuracy can coexist with complete failure on the event you care about. Choose metrics and splits around the intended use, and report class balance.'},
 behavior:{title:'Frame rate is only one part of timing',setup:'Illustrative camera setting: 200 frames per second, with a separate neural recording clock.',steps:['Frame interval = 1 / frame rate.','1 / 200 seconds = 0.005 seconds = 5 ms between nominal frames.','Check timestamps or shared events to estimate clock offset, drift, dropped frames, and variable delays.'],interpretation:'A 5 ms nominal frame interval does not establish 5 ms synchronization accuracy. Exposure timing and clock alignment must be measured separately.'}
};

// Additional primary-source resources and complementary areas.
hubTopics.push(...[
  {
    "id": "translation",
    "title": "Clinical translation & neuroethics",
    "eyebrow": "TRANSLATE",
    "description": "Connect device performance to meaningful outcomes, clinical evidence, and the rights of people who use neurotechnology.",
    "question": "What evidence and responsibilities turn a promising prototype into a credible clinical technology?",
    "concepts": [
      "Intended use",
      "Nonclinical evidence",
      "Feasibility studies",
      "Functional outcomes",
      "Informed consent",
      "Neural data governance"
    ],
    "atlasQuery": "clinical",
    "color": "#a35229"
  },
  {
    "id": "regeneration",
    "title": "Neural repair & biohybrid interfaces",
    "eyebrow": "REPAIR",
    "description": "Explore how regenerative biology and implantable electronics might work together, and what remains unresolved before clinical use.",
    "question": "What must living cells, host tissue, and electronics each demonstrate for a biohybrid interface to be useful?",
    "concepts": [
      "Cell-device integration",
      "Host integration",
      "Tissue survival",
      "Spatial selectivity",
      "Functional evidence",
      "Translation barriers"
    ],
    "atlasQuery": "biohybrid",
    "color": "#7550a9"
  }
]);
hubResources.push(...[
  {
    "id": "intan",
    "title": "Intan RHD recording systems",
    "url": "https://intantech.com/RHD_system.html",
    "description": "Explore the headstage, controller, software, and electrode compatibility choices behind a modular electrophysiology recording setup.",
    "topic": "interfaces",
    "type": "Hardware",
    "level": "Intermediate"
  },
  {
    "id": "lsl",
    "title": "Lab Streaming Layer",
    "url": "https://labstreaminglayer.readthedocs.io/info/intro.html",
    "description": "Stream, time-stamp, synchronize, and record neural and behavioral measurements from multiple devices through a shared software layer.",
    "topic": "interfaces",
    "type": "Tool",
    "level": "Intermediate"
  },
  {
    "id": "moabb",
    "title": "Mother of All BCI Benchmarks",
    "url": "https://moabb.neurotechx.com/docs/index.html",
    "description": "Compare EEG decoding pipelines across public datasets with within-session, cross-session, and cross-subject evaluation strategies.",
    "topic": "bci",
    "type": "Tool",
    "level": "Intermediate"
  },
  {
    "id": "kilosort",
    "title": "Kilosort",
    "url": "https://kilosort.readthedocs.io/en/latest/",
    "description": "Sort extracellular spikes with a GPU-based Python workflow, then inspect drift correction and exported units using the documented curation tools.",
    "topic": "signals",
    "type": "Tool",
    "level": "Advanced"
  },
  {
    "id": "elephant",
    "title": "Elephant electrophysiology analysis",
    "url": "https://elephant.readthedocs.io/en/latest/",
    "description": "Analyze spike trains and continuous electrode signals with a modular Python library that supports Neo objects and physical units.",
    "topic": "signals",
    "type": "Tool",
    "level": "Intermediate"
  },
  {
    "id": "fieldtrip",
    "title": "FieldTrip documentation",
    "url": "https://www.fieldtriptoolbox.org/documentation/",
    "description": "Work through MATLAB examples for EEG and MEG analysis, from importing data to more specialized analysis and real-time processing.",
    "topic": "signals",
    "type": "Tutorial",
    "level": "Intermediate"
  },
  {
    "id": "eeglab",
    "title": "EEGLAB",
    "url": "https://eeglab.org/",
    "description": "Follow a documented EEG workflow covering import, preprocessing, artifact review, source analysis, group analysis, and reusable scripts.",
    "topic": "signals",
    "type": "Tool",
    "level": "Intermediate"
  },
  {
    "id": "nest",
    "title": "NEST Simulator",
    "url": "https://www.nest-simulator.org/",
    "description": "Build spiking neural network models and explore how neuron models, synapses, connectivity, and recording devices shape network dynamics.",
    "topic": "computation",
    "type": "Tool",
    "level": "Intermediate"
  },
  {
    "id": "psychopy",
    "title": "PsychoPy documentation",
    "url": "https://psychopy.org/documentation.html",
    "description": "Design behavioral experiments with the Builder interface or Python, and learn how stimulus presentation connects to external hardware.",
    "topic": "behavior",
    "type": "Tool",
    "level": "Beginner"
  },
  {
    "id": "bids",
    "title": "Brain Imaging Data Structure",
    "url": "https://bids.neuroimaging.io/index.html",
    "description": "Organize imaging, EEG, MEG, and related research data with consistent folders and metadata, supported by validators and analysis tools.",
    "topic": "data",
    "type": "Standard",
    "level": "Beginner"
  },
  {
    "id": "bnci",
    "title": "BNCI Horizon 2020 datasets",
    "url": "https://bnci-horizon-2020.eu/database/data-sets",
    "description": "Find openly downloadable BCI datasets, checking each dataset's paradigm, documentation, license, and associated publication before reuse.",
    "topic": "bci",
    "type": "Dataset",
    "level": "Intermediate"
  },
  {
    "id": "openbci",
    "title": "OpenBCI Cyton documentation",
    "url": "https://docs.openbci.com/Cyton/CytonLanding/",
    "description": "Inspect the Cyton biosensing board's specifications, data format, firmware, and software interfaces when planning a research acquisition setup.",
    "topic": "interfaces",
    "type": "Hardware",
    "level": "Intermediate"
  },
  {
    "id": "sparc",
    "title": "SPARC data and models",
    "url": "https://sparc.science/",
    "description": "Explore the NIH-supported portal's peripheral nervous system datasets, anatomical maps, and computational resources for bioelectronic medicine research.",
    "topic": "stimulation",
    "type": "Dataset",
    "level": "Intermediate"
  },
  {
    "id": "fda-bci",
    "title": "FDA implanted BCI guidance",
    "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/implanted-brain-computer-interface-bci-devices-patients-paralysis-or-amputation-non-clinical-testing",
    "description": "Read FDA recommendations on nonclinical evidence and clinical study considerations for implanted BCIs intended for people with paralysis or amputation.",
    "topic": "translation",
    "type": "Guidance",
    "level": "Advanced"
  },
  {
    "id": "fda-efs",
    "title": "FDA Early Feasibility Studies",
    "url": "https://www.fda.gov/medical-devices/investigational-device-exemption-ide/early-feasibility-studies-efs-program",
    "description": "Understand how early device studies investigate initial safety and functionality, inform design changes, and fit into FDA engagement and IDE review.",
    "topic": "translation",
    "type": "Guidance",
    "level": "Advanced"
  },
  {
    "id": "unesco-neuroethics",
    "title": "UNESCO ethics of neurotechnology",
    "url": "https://www.unesco.org/en/legal-affairs/recommendation-ethics-neurotechnology",
    "description": "Use the adopted recommendation to examine autonomy, informed consent, mental privacy, inclusion, and accountability throughout a neurotechnology project.",
    "topic": "translation",
    "type": "Guidance",
    "level": "Beginner"
  },
  {
    "id": "oecd-neurotech",
    "title": "OECD responsible neurotechnology",
    "url": "https://www.oecd.org/en/topics/sub-issues/neurotechnology.html",
    "description": "Connect responsible innovation principles to safety, transparency, brain-data protection, societal dialogue, and equitable access; includes the OECD recommendation and toolkit.",
    "topic": "translation",
    "type": "Guidance",
    "level": "Beginner"
  },
  {
    "id": "biohybrid-review",
    "title": "The future of biohybrid regenerative bioelectronics",
    "url": "https://www.repository.cam.ac.uk/bitstreams/c6175e61-28b4-4766-98b6-7d5567978794/download",
    "description": "Read a Cambridge-hosted perspective on combining living cells with implantable electronics, including integration, selectivity, tissue survival, and translation barriers.",
    "topic": "regeneration",
    "type": "Review",
    "level": "Advanced"
  },
  {
    "id": "nih-stemcells",
    "title": "NIH stem-cell research programs",
    "url": "https://stemcells.nih.gov/NIH-Stem-Cell-Research",
    "description": "Find NIH regenerative medicine and stem-cell translation programs as broader research context; their existence does not establish efficacy for a neural repair application.",
    "topic": "regeneration",
    "type": "Directory",
    "level": "Beginner"
  }
]);
