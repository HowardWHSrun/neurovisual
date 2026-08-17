const pathwayPrograms = [
    {
        id: "illinois-ne-bs", kind: "undergraduate", name: "BS Neural Engineering", institution: "University of Illinois Urbana-Champaign", location: "Urbana-Champaign, United States", region: "North America", degree: "BS · 128 credit hours", route: "Dedicated neural-engineering major",
        focus: ["neural interfaces", "neural data", "neuroimaging", "cell and tissue engineering"], fit: ["device", "code", "biology", "explore"],
        bestFor: "Students who already want a curriculum built explicitly around neuroscience plus engineering rather than a general BME degree.",
        criteria: "Expect a demanding foundation in calculus, differential equations, physics, chemistry, biology and computing before upper-level neural circuits, interfaces, imaging and design.",
        application: "Apply to Grainger Engineering through Illinois undergraduate admission and select Neural Engineering. Review first-year and transfer requirements for the entry term.",
        funding: "University scholarships and need-based aid vary by residency and citizenship; verify award eligibility with Illinois Student Financial Aid.",
        programUrl: "https://catalog.illinois.edu/undergraduate/engineering/neural-engineering-bs/", applyUrl: "https://www.admissions.illinois.edu/apply"
    },
    {
        id: "rice-ece-neuro", kind: "undergraduate", name: "BSECE · Neuroengineering specialization", institution: "Rice University", location: "Houston, United States", region: "North America", degree: "BS Electrical & Computer Engineering", route: "ECE major with named neuroengineering specialization",
        focus: ["neural interfaces", "signal processing", "machine learning", "biomedical optics"], fit: ["device", "code", "research", "explore"],
        bestFor: "Students who want strong electronics, computation and signal-processing depth with access to Rice Neuroengineering Initiative laboratories and the Texas Medical Center.",
        criteria: "Build strength in calculus, physics, programming and circuits. The specialization requires neuroengineering courses, including measurement/manipulation, neural interfaces and computational options.",
        application: "Apply to Rice undergraduate admission; students choose a major after enrollment under Rice rules. Research applicants should read faculty work and send a concise, skill-specific CV and note.",
        funding: "Rice undergraduate aid is handled centrally. Lab roles may be for credit, volunteer or paid depending on the investigator and project.",
        programUrl: "https://ga.rice.edu/programs-study/departments-programs/engineering/electrical-computer-engineering/electrical-computer-engineering-bsece/", applyUrl: "https://admission.rice.edu/apply"
    },
    {
        id: "jhu-bme-bs", kind: "undergraduate", name: "BS Biomedical Engineering", institution: "Johns Hopkins University", location: "Baltimore, United States", region: "North America", degree: "BS Biomedical Engineering", route: "Selective BME entry with neuroengineering opportunities",
        focus: ["neuroengineering", "imaging", "medical devices", "computational medicine"], fit: ["device", "code", "biology", "clinical"],
        bestFor: "Students seeking engineering training embedded closely with a medical school and hospital ecosystem.",
        criteria: "Hopkins evaluates academic rigor, persistence and impact. BME is limited-enrollment and is the important program-specific exception to Hopkins' otherwise flexible major selection.",
        application: "List BME as the first-choice major in the Hopkins application. No separate BME form is required, but admission to Hopkins does not guarantee admission to BME; external transfers cannot enter BME under the current policy.",
        funding: "Need-based aid and external scholarships are handled by undergraduate financial aid; compare net price rather than published tuition alone.",
        programUrl: "https://www.bme.jhu.edu/academics/undergraduate/", applyUrl: "https://www.bme.jhu.edu/academics/undergraduate/apply-undergraduate-program/"
    },
    {
        id: "duke-bme-bse", kind: "undergraduate", name: "BSE Biomedical Engineering", institution: "Duke University", location: "Durham, United States", region: "North America", degree: "BSE Biomedical Engineering", route: "Broad BME with electrophysiology and instrumentation options",
        focus: ["electrobiology", "imaging", "instrumentation", "design"], fit: ["device", "clinical", "biology", "explore"],
        bestFor: "Students who want hands-on design, data science and flexible combinations with ECE, computer science or another engineering major.",
        criteria: "Prepare with strong mathematics and laboratory science, then show evidence that you can build, analyze and communicate—not only that you are interested in medicine.",
        application: "Apply to Duke and indicate the Pratt School of Engineering. The BME admissions page routes applicants to Duke undergraduate admissions rather than a separate departmental application.",
        funding: "Duke financial aid is centralized; research and design experiences have separate project or summer funding opportunities.",
        programUrl: "https://bme.duke.edu/academics/undergrad/", applyUrl: "https://bme.duke.edu/admissions/undergrad/"
    },
    {
        id: "gatech-bme-bs", kind: "undergraduate", name: "BS Biomedical Engineering", institution: "Georgia Tech / Emory ecosystem", location: "Atlanta, United States", region: "North America", degree: "BS Biomedical Engineering", route: "Broad BME with neuroengineering courses and research option",
        focus: ["neurotechnology", "biomedical data", "devices", "clinical design"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Students who want a large engineering campus, optional co-op or undergraduate thesis, and access to Atlanta clinical collaborators.",
        criteria: "A strong quantitative base is essential. The catalog includes Introduction to Neuroengineering and Frontiers in Neuroengineering alongside design and data courses.",
        application: "Apply through Georgia Tech undergraduate admission for the relevant first-year or transfer cycle; research and co-op options are selected after enrollment.",
        funding: "Institutional aid, co-op income and funded research vary independently. Confirm whether a research role is paid, credit-bearing or volunteer before accepting it.",
        programUrl: "https://catalog.gatech.edu/programs/biomedical-engineering-bs/", applyUrl: "https://admission.gatech.edu/first-year/"
    },
    {
        id: "uic-bme-neural", kind: "undergraduate", name: "BS BME · Neural Engineering concentration", institution: "University of Illinois Chicago", location: "Chicago, United States", region: "North America", degree: "BS Biomedical Engineering", route: "BME major with named neural-engineering concentration",
        focus: ["neural interfaces", "physiology", "modeling", "clinical immersion"], fit: ["device", "biology", "clinical", "explore"],
        bestFor: "Students who want a defined neural concentration in an urban public university with hospital and clinical-immersion connections.",
        criteria: "Complete the engineering, science and BME core, then coordinate neural concentration electives with an adviser so they form a coherent technical focus.",
        application: "Apply to UIC Engineering for Biomedical Engineering. The neural concentration is built within the BS rather than entered through a separate university application.",
        funding: "Use UIC's central aid and scholarship tools; clinical immersion and laboratory roles have their own selection and compensation rules.",
        programUrl: "https://bme.uic.edu/undergraduate/biomedical-engineering-major/", applyUrl: "https://admissions.uic.edu/undergraduate/requirements-deadlines"
    },
    {
        id: "michigan-bme-bse", kind: "undergraduate", name: "BSE Biomedical Engineering", institution: "University of Michigan", location: "Ann Arbor, United States", region: "North America", degree: "BSE Biomedical Engineering", route: "Broad BME in an engineering and medical-school ecosystem",
        focus: ["neural engineering", "medical devices", "signals", "rehabilitation"], fit: ["device", "clinical", "code", "research"],
        bestFor: "Students seeking flexibility across engineering, medicine, rehabilitation and neural-interface laboratories.",
        criteria: "Admission is through Michigan Engineering pathways. Competitive preparation includes calculus, physics, chemistry and evidence of engineering problem solving.",
        application: "Follow Michigan Engineering's first-year or transfer process; the BME department maintains separate guidance for entry into the undergraduate major.",
        funding: "Compare university aid with program-specific scholarships and paid research. Out-of-state and international costs require separate planning.",
        programUrl: "https://bme.umich.edu/academics/undergraduate/", applyUrl: "https://bme.umich.edu/academics/undergraduate/undergraduate-admissions/"
    },
    {
        id: "toronto-engsci-bme", kind: "undergraduate", name: "Engineering Science · Biomedical Systems", institution: "University of Toronto", location: "Toronto, Canada", region: "North America", degree: "BASc Engineering Science", route: "Two foundation years, then Biomedical Systems major",
        focus: ["neurosensory systems", "rehabilitation", "modeling", "instrumentation"], fit: ["device", "code", "biology", "research"],
        bestFor: "Students who enjoy an intensive mathematics-and-science core and want systems-level breadth before specializing.",
        criteria: "Applicants enter Engineering Science, complete a rigorous common foundation and choose Biomedical Systems after second year. The route rewards mathematical stamina and interdisciplinary curiosity.",
        application: "Apply to University of Toronto Engineering Science. Major selection happens after enrollment, so verify current progression and major-allocation rules.",
        funding: "Scholarships, provincial aid and international awards have different eligibility. Co-op and summer research can offset costs but are not guaranteed.",
        programUrl: "https://engsci.utoronto.ca/program/majors/biomedical-systems/", applyUrl: "https://discover.engineering.utoronto.ca/how-to-apply/"
    },
    {
        id: "imperial-bme-meng", kind: "undergraduate", name: "MEng Biomedical Engineering", institution: "Imperial College London", location: "London, United Kingdom", region: "Europe", degree: "MEng Biomedical Engineering", route: "Integrated master's with electrical and computational pathways",
        focus: ["biosignals", "imaging", "instrumentation", "computational bioengineering"], fit: ["device", "code", "biology", "clinical"],
        bestFor: "Students who want an engineering-intensive UK degree with later pathway choices and a strong medical-technology environment.",
        criteria: "Mathematics and physical-science preparation are central. Consult the current qualification table because offers and accepted combinations vary by credential and cycle.",
        application: "Apply through UCAS using Imperial's current course page. Review admissions tests or interview requirements for the exact entry year rather than relying on prior cycles.",
        funding: "Home and overseas fees differ substantially; check Imperial bursaries, scholarships and visa-related costs before applying.",
        programUrl: "https://www.imperial.ac.uk/study/courses/undergraduate/biomedical-engineering/", applyUrl: "https://www.imperial.ac.uk/study/apply/undergraduate/"
    },
    {
        id: "ucl-bme-beng", kind: "undergraduate", name: "BEng / MEng Biomedical Engineering", institution: "University College London", location: "London, United Kingdom", region: "Europe", degree: "BEng or MEng Biomedical Engineering", route: "Broad BME with medical electronics and neural engineering",
        focus: ["medical electronics", "neural engineering", "imaging", "clinical engineering"], fit: ["device", "clinical", "code", "explore"],
        bestFor: "Students interested in healthcare engineering with major London hospital links and a choice between three- and four-year degrees.",
        criteria: "The current course requires advanced mathematics and physics preparation, with biology accepted in defined combinations. Verify the exact offer for your qualification and entry year.",
        application: "Apply through UCAS using UCL's current course code and equal-consideration deadline. International and foundation routes have separate requirements.",
        funding: "Check home/overseas fee status, UCL bursaries and country-specific scholarships; London living costs are a material part of the decision.",
        programUrl: "https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/biomedical-engineering-beng", applyUrl: "https://www.ucl.ac.uk/prospective-students/undergraduate/how-apply"
    },
    {
        id: "nus-bme-beng", kind: "undergraduate", name: "BEng Biomedical Engineering", institution: "National University of Singapore", location: "Singapore", region: "Asia", degree: "BEng Biomedical Engineering", route: "Engineering common admission with BME major",
        focus: ["bioelectronics", "neurotechnology", "medical devices", "data"], fit: ["device", "code", "biology", "clinical"],
        bestFor: "Students seeking engineering training in Singapore's medical-device and biomedical-research ecosystem.",
        criteria: "Mathematics is the core prerequisite; applicants without physics or chemistry may need bridging courses. Requirements differ across A-level, IB, polytechnic and international qualifications.",
        application: "Apply to NUS Engineering and select Biomedical Engineering under the current common-admission rules. Interviews are generally not required except for specific scholarship or aptitude routes.",
        funding: "Review tuition grants, service obligations, scholarships and international-student conditions separately; they can materially change total cost and post-study flexibility.",
        programUrl: "https://cde.nus.edu.sg/bme/undergraduate/", applyUrl: "https://cde.nus.edu.sg/bme/undergraduate/admissions/"
    },
    {
        id: "hku-bme-beng", kind: "undergraduate", name: "BEng Biomedical Engineering", institution: "University of Hong Kong", location: "Hong Kong", region: "Asia", degree: "BEng Biomedical Engineering", route: "Interfaculty engineering and medicine program",
        focus: ["bioinstrumentation", "medical imaging", "neural systems", "translation"], fit: ["device", "biology", "clinical", "translation"],
        bestFor: "Students who want a clinically connected engineering program co-taught across engineering, medicine, dentistry and science.",
        criteria: "Current published requirements emphasize high-school mathematics plus biology, chemistry or physics. Competitive international scores are guidance, not guaranteed admission thresholds.",
        application: "Use the HKU route appropriate to JUPAS or international/non-JUPAS status and verify the current programme code and supporting-document schedule.",
        funding: "Check entrance scholarships, government support, accommodation and international fee status directly with HKU.",
        programUrl: "https://hkumed-ugadmissions.hku.hk/ug_programmes/bme/", applyUrl: "https://admissions.hku.hk/apply"
    },
    {
        id: "sydney-bme-beng", kind: "undergraduate", name: "BEng Honours Biomedical Engineering", institution: "University of Sydney", location: "Sydney, Australia", region: "Oceania", degree: "BEng (Honours) Biomedical Engineering", route: "BME degree with Bionics and Bioelectronics specialization",
        focus: ["bionics", "neural engineering", "biomedical instrumentation", "implants"], fit: ["device", "clinical", "biology", "translation"],
        bestFor: "Students who want a professional engineering degree with a visible bionics/bioelectronics route and required professional engagement.",
        criteria: "The four-year curriculum combines mathematics, computing, engineering cores, biomedical units and an honours thesis. Entry scores depend on applicant type and intake.",
        application: "Apply using the domestic or international route on the course page and check recognized qualifications, English requirements and intake availability.",
        funding: "Domestic support and international tuition differ; scholarships and paid placements should not be assumed until confirmed.",
        programUrl: "https://www.sydney.edu.au/courses/courses/uc/bachelor-of-engineering-honours-biomedical-engineering2.html", applyUrl: "https://www.sydney.edu.au/study/applying.html"
    },
    {
        id: "rice-neuro-grad", kind: "graduate", name: "Neuroengineering through BioE, ECE and allied PhD routes", institution: "Rice University Neuroengineering Initiative", location: "Houston, United States", region: "North America", degree: "PhD / research master's through participating departments", route: "Faculty-first cross-department pathway",
        focus: ["flexible interfaces", "BCI", "neuromodulation", "signal processing"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants who can identify a specific Rice or Texas Medical Center laboratory and choose the department that best supports that work.",
        criteria: "Research fit matters more than the Neuroengineering Initiative label: inspect laboratories, methods, current projects and which home departments admit each faculty member.",
        application: "Apply to the relevant graduate department and explicitly name neuroengineering interests and aligned investigators. Contact laboratories with a concise, evidence-based message when their guidance permits it.",
        funding: "Research PhD support is program- and offer-specific. Professional master's routes and external clinical affiliations may follow different funding rules.",
        programUrl: "https://neuroengineering.rice.edu/join-us", applyUrl: "https://graduate.rice.edu/admissions"
    },
    {
        id: "jhu-bme-phd", kind: "graduate", name: "BME PhD · Neuroengineering focus", institution: "Johns Hopkins University", location: "Baltimore, United States", region: "North America", degree: "PhD Biomedical Engineering", route: "Funded research doctorate with neuroengineering review area",
        focus: ["neural interfaces", "computational neuroscience", "imaging", "clinical translation"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants with substantial research evidence who want engineering and medical-school mentorship in a structured focus area.",
        criteria: "The department currently asks for roughly one academic year or two summers of research-equivalent experience, strong mathematics, college biology and focus-specific preparation such as instrumentation and signals.",
        application: "Submit transcripts, three recommendations, a focused statement and CV through the School of Medicine system. Name realistic faculty fits and verify that they are recruiting.",
        funding: "The program states that matriculating PhD students receive stipend, tuition and health coverage; citizenship rules still affect some training-grant fellowships.",
        programUrl: "https://www.bme.jhu.edu/academics/graduate/phd-program/", applyUrl: "https://www.bme.jhu.edu/academics/graduate/phd-program/apply-to-the-phd-program/"
    },
    {
        id: "stanford-bioe-phd", kind: "graduate", name: "PhD Bioengineering", institution: "Stanford University", location: "Stanford, United States", region: "North America", degree: "PhD Bioengineering", route: "Broad BioE doctorate with neural-interface laboratories",
        focus: ["neural prostheses", "neural dynamics", "bioelectronics", "computation"], fit: ["device", "code", "research", "translation"],
        bestFor: "Applicants with a clear research trajectory who want rotations and cross-school access to engineering, medicine and neuroscience.",
        criteria: "Stanford describes competitive preparation as strong quantitative training plus biology through coursework or research, alongside creativity, initiative and perseverance.",
        application: "Prepare a research-centered statement, CV, transcripts and three letters. The 2026 cycle did not require GRE scores; confirm every requirement for the new cycle.",
        funding: "Review the current graduate-funding page and offer letter; do not infer MS funding from PhD funding or vice versa.",
        programUrl: "https://bioengineering.stanford.edu/academics-admission/graduate-programs/phd-program", applyUrl: "https://bioengineering.stanford.edu/academics-admission/graduate-admission/how-apply"
    },
    {
        id: "cmu-pnc-phd", kind: "graduate", name: "PhD Neural Computation", institution: "Carnegie Mellon University / University of Pittsburgh", location: "Pittsburgh, United States", region: "North America", degree: "PhD Neural Computation", route: "Dedicated quantitative neuroscience doctorate",
        focus: ["computational neuroscience", "machine learning", "statistics", "systems neuroscience"], fit: ["code", "research", "explore"],
        bestFor: "Applicants with strong mathematics, physics, computer science, statistics or data-science preparation who want to apply it to biological questions.",
        criteria: "Demonstrate quantitative depth, research potential and an informed connection to neural computation—not only general AI interest.",
        application: "Use the Neuroscience Institute graduate application and select the correct program. Current review considers academic training, research, letters, GPA and personal statement.",
        funding: "Confirm stipend, tuition, health coverage and any citizenship-limited training support in the admission offer.",
        programUrl: "https://www.cmu.edu/ni/academics/grad/programs/phd-neural-computation", applyUrl: "https://www.cmu.edu/ni/academics/grad/grad-application-process"
    },
    {
        id: "gatech-emory-bme-phd", kind: "graduate", name: "Joint PhD Biomedical Engineering", institution: "Georgia Tech / Emory University", location: "Atlanta, United States", region: "North America", degree: "PhD Biomedical Engineering", route: "Joint engineering-medical program with Neuroengineering area",
        focus: ["neuroengineering", "neurotechnology", "biomedical robotics", "clinical design"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants wanting access to both a major engineering institution and Emory's clinical and neuroscience environment.",
        criteria: "The program expects an engineering, science or mathematics background and evaluates research alignment across its listed areas.",
        application: "Apply through Georgia Tech for the joint BME PhD; the MD/PhD route is handled through Emory. Upload the current required CV, statement and transcripts.",
        funding: "Funding structures vary across programs and grants; verify the guaranteed period, summer support, fees and health insurance in writing.",
        programUrl: "https://bme.gatech.edu/graduate-programs", applyUrl: "https://bme.gatech.edu/apply-now"
    },
    {
        id: "epfl-neurox-msc", kind: "graduate", name: "MSc Neuro-X", institution: "EPFL", location: "Lausanne, Switzerland", region: "Europe", degree: "MSc Neuro-X · 120 ECTS", route: "Dedicated English-language neurotechnology master's",
        focus: ["neuroengineering", "computational neuroscience", "imaging", "machine learning"], fit: ["device", "code", "research", "translation"],
        bestFor: "Engineering or life-science graduates seeking a broad technical bridge into neurotechnology research or product development.",
        criteria: "Direct continuity exists for selected EPFL bachelor's degrees. External applicants need a relevant degree and excellent record; introductory neuroscience is recommended and bridging credits may be assigned.",
        application: "Apply through EPFL's online master's application. Use the current official deadlines and document list; meeting the stated prerequisites does not guarantee admission.",
        funding: "Compare tuition with Lausanne living costs and EPFL excellence fellowships; master's support is not equivalent to a salaried doctoral position.",
        programUrl: "https://www.epfl.ch/education/master/programs/neuro-x/", applyUrl: "https://www.epfl.ch/education/admission/admission-2/master-admission-criteria-application/"
    },
    {
        id: "uzh-eth-nsc-msc", kind: "graduate", name: "MSc Neural Systems and Computation", institution: "University of Zurich / ETH Zurich", location: "Zurich, Switzerland", region: "Europe", degree: "MSc UZH ETH · 90 ECTS", route: "Joint interdisciplinary neural computation master's",
        focus: ["systems neuroscience", "neural computation", "neurotechnology", "neuromorphic engineering"], fit: ["code", "device", "research", "explore"],
        bestFor: "Students crossing among neuroscience, physics, mathematics, computer science and engineering who want a mentor-designed curriculum.",
        criteria: "The program lists a wide range of qualifying disciplines. Applicants still need enough quantitative and neuroscience preparation to succeed in the core and research projects.",
        application: "Applications are handled by the University of Zurich, including for ETH students. Follow the joint program's instructions rather than the ordinary ETH master's portal.",
        funding: "Investigate UZH/ETH scholarships, visa rules and Zurich living costs; the program page does not imply universal stipend support.",
        programUrl: "https://ethz.ch/en/studies/master/degree-programmes/engineering-sciences/neural-systems-and-computation.html", applyUrl: "https://www.nsc.uzh.ch/en/Admission.html"
    },
    {
        id: "imperial-neurotech-mres", kind: "graduate", name: "MRes Neurotechnology", institution: "Imperial College London", location: "London, United Kingdom", region: "Europe", degree: "MRes Neurotechnology · 1 year full-time", route: "Research-intensive taught master's",
        focus: ["brain-machine interfaces", "computational neuroscience", "imaging", "medical-device translation"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants who want a substantial supervised project before PhD study or neurotechnology R&D.",
        criteria: "Current minimum is a UK 2:1 equivalent in engineering, mathematics, physical science, or biological/medical science with quantitative skills.",
        application: "Identify and contact a potential supervisor before submitting because the research project is central. The 2026 cycle is closed; use the live page for the next cycle and never reuse old round dates.",
        funding: "The course lists different home and overseas tuition and limited scholarships; budget for London and check whether your nationality requires ATAS.",
        programUrl: "https://www.imperial.ac.uk/study/courses/postgraduate-taught/neurotechnology/", applyUrl: "https://www.imperial.ac.uk/study/apply/postgraduate-taught/"
    },
    {
        id: "kcl-healthtech-neuro", kind: "graduate", name: "MSc / MRes Healthcare Technologies · Neurotechnology pathway", institution: "King's College London", location: "London, United Kingdom", region: "Europe", degree: "MSc or MRes Healthcare Technologies", route: "Healthcare technology program with neurotechnology pathway",
        focus: ["engineering neuroscience", "imaging", "wearables", "clinical applications"], fit: ["device", "clinical", "translation", "research"],
        bestFor: "Applicants who want clinical neurotechnology exposure spanning engineering, imaging neuroscience and product translation.",
        criteria: "Check the current academic and English-language requirements for the selected MSc or MRes route; research intensity differs between them.",
        application: "Apply through King's postgraduate admissions and choose the relevant course/pathway. Compare project supervision and taught modules before deciding MSc versus MRes.",
        funding: "Review King's fees, scholarships and London living costs; taught-master's funding is usually more limited than funded PhD support.",
        programUrl: "https://www.kcl.ac.uk/study/postgraduate-taught/courses/healthcare-technologies-msc-mres", applyUrl: "https://www.kcl.ac.uk/study/postgraduate-taught/how-to-apply"
    },
    {
        id: "ucl-reat-msc", kind: "graduate", name: "MSc Rehabilitation Engineering and Assistive Technologies", institution: "University College London", location: "London, United Kingdom", region: "Europe", degree: "MSc Rehabilitation Engineering and Assistive Technologies", route: "Assistive technology program with medical electronics and neural engineering",
        focus: ["assistive technology", "rehabilitation", "medical electronics", "neural engineering"], fit: ["device", "clinical", "translation", "code"],
        bestFor: "Applicants motivated by disability, rehabilitation and practical assistive systems rather than neural implants alone.",
        criteria: "The current page expects an upper-second-class equivalent in biomedical science, engineering, computer science or physics, or relevant professional experience.",
        application: "Apply through UCL Graduate Admissions with the requested statement and reference; most laboratory projects require regular on-campus attendance.",
        funding: "Verify fees, scholarships and project costs for the current cycle. Professional master's programs are commonly self-funded.",
        programUrl: "https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/rehabilitation-engineering-and-assistive-technologies-msc", applyUrl: "https://www.ucl.ac.uk/prospective-students/graduate/applying-graduate-study"
    },
    {
        id: "toronto-bme-grad", kind: "graduate", name: "BME MASc / PhD / MEng", institution: "University of Toronto", location: "Toronto, Canada", region: "North America", degree: "MASc, PhD or professional MEng", route: "Research and professional streams with different admissions models",
        focus: ["neural engineering", "rehabilitation", "medical devices", "clinical engineering"], fit: ["device", "clinical", "research", "translation"],
        bestFor: "Applicants who want to choose deliberately between thesis research with a supervisor and a course-based professional route with practicum.",
        criteria: "MASc/PhD admission ultimately requires a faculty supervisor; the MEng is committee-reviewed and does not require one. Relevant backgrounds can include engineering, life science, CS, physics, chemistry or medicine depending on the lab.",
        application: "Apply in the appropriate round and contact realistic supervisors early for MASc/PhD. Enrollment capacity declines in later rounds, and current deadlines must be checked live.",
        funding: "Toronto states guaranteed minimum support for its research MASc and PhD periods; the professional MEng is self-funded.",
        programUrl: "https://bme.utoronto.ca/prospective-student/", applyUrl: "https://bme.utoronto.ca/prospective-student/admission-to-graduate-studies/"
    },
    {
        id: "ubc-bme-grad", kind: "graduate", name: "BME MASc / PhD / MEng", institution: "University of British Columbia", location: "Vancouver, Canada", region: "North America", degree: "MASc, PhD or MEng Biomedical Engineering", route: "Research and professional biomedical-engineering degrees",
        focus: ["neural engineering", "assistive technology", "biomaterials", "biomedical systems"], fit: ["device", "biology", "research", "translation"],
        bestFor: "Applicants seeking a medicine-engineering school with both thesis and professional routes.",
        criteria: "Research MASc/PhD admission requires a School of Biomedical Engineering faculty member to accept the student into a laboratory; document and award deadlines are distinct.",
        application: "Follow the program-specific instructions, secure supervisor alignment for research degrees and submit references and transcripts by their separate deadlines.",
        funding: "Ask potential supervisors about stipend source, guaranteed duration, tuition and summer support. Award-consideration deadlines may precede final application deadlines.",
        programUrl: "https://bme.ubc.ca/education/prospective-graduate-students/applications-admissions/", applyUrl: "https://bme.ubc.ca/education/prospective-graduate-students/applications-admissions/application-instructions-2/"
    },
    {
        id: "nus-bme-grad", kind: "graduate", name: "MEng / PhD Biomedical Engineering", institution: "National University of Singapore", location: "Singapore", region: "Asia", degree: "MEng or PhD Biomedical Engineering", route: "Research degrees in a broad BME department",
        focus: ["bioelectronics", "brain-machine interfaces", "neuromodulation", "biomedical data"], fit: ["device", "code", "biology", "research"],
        bestFor: "Applicants who can match a supervisor in Singapore's bioelectronics, neurotechnology or biomedical-device ecosystem.",
        criteria: "Program and scholarship criteria vary by intake, citizenship and prior degree. A strong research proposal or demonstrated laboratory fit may be important for research routes.",
        application: "Use the NUS graduate-research portal linked by BME and verify whether supervisor contact is expected before applying for the chosen project.",
        funding: "Research scholarships and service conditions differ; read the exact stipend, tuition subsidy and obligation terms before accepting.",
        programUrl: "https://cde.nus.edu.sg/bme/graduate-research-programmes/", applyUrl: "https://cde.nus.edu.sg/graduate/graduate-programmes-by-research/"
    },
    {
        id: "tsinghua-bme-grad", kind: "graduate", name: "MS / PhD Biomedical Engineering", institution: "Tsinghua University", location: "Beijing and Shenzhen, China", region: "Asia", degree: "MS or PhD Biomedical Engineering", route: "Biomedical engineering with neural engineering and intelligent medicine",
        focus: ["neural engineering", "brain-computer interfaces", "medical imaging", "intelligent medicine"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants seeking neural engineering and medical-technology research within a major Chinese engineering and medical ecosystem.",
        criteria: "Language, supervisor, examination and document requirements depend on campus, program and domestic versus international route.",
        application: "Start from Tsinghua's current graduate-program catalog and then use the exact School of Biomedical Engineering or Shenzhen program instructions; avoid mixing deadlines across routes.",
        funding: "University, government and supervisor-linked scholarships have separate rules. Confirm language, tuition and stipend terms in the formal offer.",
        programUrl: "https://www.tsinghua.edu.cn/en/Admissions/Graduate1/Graduate_Programs.htm", applyUrl: "https://yz.tsinghua.edu.cn/en/"
    },
    {
        id: "melbourne-bme-grad", kind: "graduate", name: "MPhil / PhD Biomedical Engineering", institution: "University of Melbourne", location: "Melbourne, Australia", region: "Oceania", degree: "MPhil or PhD Biomedical Engineering", route: "Supervisor-led research degree",
        focus: ["neural interfaces", "brain-computer interfaces", "neurostimulation", "assistive technologies"], fit: ["device", "code", "research", "clinical"],
        bestFor: "Applicants who want a research thesis in neural engineering within a broad biomedical-engineering department.",
        criteria: "Research-degree eligibility, prior thesis preparation and English requirements are set by the university and project; supervisor alignment is central.",
        application: "Review current neural-engineering groups, identify a realistic supervisor and follow Melbourne's graduate-research application sequence.",
        funding: "Apply separately for graduate research scholarships where required and verify whether the project already carries funding.",
        programUrl: "https://biomedical.eng.unimelb.edu.au/study/research", applyUrl: "https://study.unimelb.edu.au/how-to-apply/graduate-research"
    }
];
const pathwayRoles = [
    {
        id: "neural-ml", name: "Neural signal / machine-learning engineer", lane: "Software & data", entry: "BS can enter applied roles; MS/PhD often preferred for research-heavy decoding", fit: ["code", "device", "translation"],
        work: "Build pipelines that turn spikes, fields, EEG, imaging or behavioral data into validated biomarkers, decoders and closed-loop control signals.",
        skills: ["Python", "linear algebra", "signal processing", "statistics", "ML evaluation", "reproducible data"],
        evidence: "A strong portfolio shows one end-to-end neural dataset project, leakage-resistant validation, readable code and an explanation of physiological assumptions.",
        market: "Neurotech titles are a narrow subset of the broader data-science and software market. U.S. BLS projects data-scientist employment to grow 34% from 2024–34; that is context, not a forecast for neural decoding jobs.",
        sourceUrl: "https://www.bls.gov/ooh/math/data-scientists.htm", searchUrl: "https://neurojobs.sfn.org/",
        openRole: { title: "Machine Learning Engineer", employer: "Neuralink", location: "Austin, TX / South San Francisco, CA", url: "https://boards.greenhouse.io/neuralink/jobs/5663271003", asOf: "17 Aug 2026" }
    },
    {
        id: "interface-hardware", name: "Neural-interface hardware engineer", lane: "Electronics & devices", entry: "BS/MS in EE, computer engineering, BME or related engineering", fit: ["device", "code", "translation"],
        work: "Design low-noise analog front ends, stimulation electronics, power, telemetry, test fixtures and safety controls for wearable or implantable systems.",
        skills: ["analog/digital circuits", "PCB design", "embedded systems", "noise analysis", "verification", "bench instrumentation"],
        evidence: "Show schematics, layout decisions, noise or power budgets, firmware tests and measured results—not only a polished enclosure.",
        market: "The closest broad BLS category is electrical/electronics engineering, projected at 7% growth from 2024–34. Neurotech demand is much smaller and concentrated in particular companies and research hubs.",
        sourceUrl: "https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm", searchUrl: "https://www.embs.org/career-resources/",
        openRole: { title: "Electrical Engineer, Implant Embedded Systems", employer: "Neuralink", location: "Austin, TX / South San Francisco, CA", url: "https://boards.greenhouse.io/neuralink/jobs/7702524003", asOf: "17 Aug 2026" }
    },
    {
        id: "bioelectronic-device", name: "Bioelectronic materials / device engineer", lane: "Materials & microfabrication", entry: "BS for process roles; MS/PhD common for novel materials and implant R&D", fit: ["device", "biology", "research"],
        work: "Develop electrodes, coatings, polymers, microfabricated probes, packaging and accelerated-aging tests that keep devices functional in tissue.",
        skills: ["microfabrication", "electrochemistry", "materials characterization", "CAD", "reliability", "biocompatibility"],
        evidence: "Demonstrate fabrication or characterization ownership, quantitative failure analysis and careful separation of in-vitro, animal and human evidence.",
        market: "These jobs appear under materials, process, MEMS, R&D and biomedical-engineering titles; searching only for “neuroengineer” misses much of the market.",
        sourceUrl: "https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm", searchUrl: "https://neurojobs.sfn.org/",
        openRole: { title: "Microfabrication Engineer (R&D)", employer: "Neuralink", location: "Fremont, CA", url: "https://boards.greenhouse.io/neuralink/jobs/7689641003", asOf: "17 Aug 2026" }
    },
    {
        id: "clinical-neuromod", name: "Clinical neuromodulation / applications engineer", lane: "Clinical translation", entry: "BS in BME/EE or clinical engineering; travel and clinical training often required", fit: ["clinical", "device", "translation"],
        work: "Support device programming, procedures, troubleshooting, clinician training and evidence collection for stimulation or monitoring systems.",
        skills: ["neuroanatomy", "instrumentation", "clinical communication", "troubleshooting", "documentation", "patient safety"],
        evidence: "Highlight calm technical work with clinicians or users, traceable documentation and decisions made under safety constraints.",
        market: "Roles may be called field clinical engineer, clinical specialist or therapy development specialist. They can involve operating-room schedules and regional travel.",
        sourceUrl: "https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm", searchUrl: "https://www.medtronic.com/us-en/our-company/careers.html",
        openRole: { title: "Field Clinical Engineer", employer: "Neuralink", location: "Austin, TX", url: "https://boards.greenhouse.io/neuralink/jobs/7796362003", asOf: "17 Aug 2026" }
    },
    {
        id: "computational-neuroscientist", name: "Computational neuroscientist / research scientist", lane: "Research", entry: "PhD is typical for independent scientist roles; MS can support modeling teams", fit: ["code", "research", "explore"],
        work: "Formulate questions about neural systems, design analyses or models, interpret experiments and publish or translate findings with multidisciplinary teams.",
        skills: ["statistics", "dynamical systems", "experimental design", "scientific computing", "writing", "domain depth"],
        evidence: "Research quality is judged through contributions: a thesis, preprint, conference work, rigorous code or letters that explain your independence and judgment.",
        market: "U.S. BLS projects medical-scientist employment to grow 9% from 2024–34, but academic and neurotech research hiring depends strongly on grants, specialty and geography.",
        sourceUrl: "https://www.bls.gov/ooh/life-physical-and-social-science/medical-scientists.htm", searchUrl: "https://neurojobs.sfn.org/",
        openRole: { title: "Neuroengineer, Next Gen", employer: "Neuralink", location: "South San Francisco, CA", url: "https://boards.greenhouse.io/neuralink/jobs/7571489003", asOf: "17 Aug 2026" }
    },
    {
        id: "ephys-specialist", name: "Electrophysiology research specialist", lane: "Experimental research", entry: "BS/MS for technician or specialist roles; PhD for independent research leadership", fit: ["biology", "device", "research"],
        work: "Prepare experiments, acquire extracellular or intracellular recordings, maintain rigs, track quality and connect raw physiology to analysis.",
        skills: ["electrophysiology", "animal or human protocols", "DAQ systems", "scripting", "quality control", "lab documentation"],
        evidence: "Show reliable experimental ownership: preparation success, troubleshooting logs, signal-quality metrics and analysis that influenced the next experiment.",
        market: "Search university laboratories, hospitals, CROs and device companies using technique names such as EEG, ECoG, patch clamp, Neuropixels or intraoperative monitoring.",
        sourceUrl: "https://www.bls.gov/ooh/life-physical-and-social-science/medical-scientists.htm", searchUrl: "https://jobs.nih.gov/",
        openRole: { title: "Research Associate II - In vivo Electrophysiology and Behavior", employer: "Allen Institute", location: "Seattle, WA", url: "https://alleninstitute.org/careers/jobs?jobId=09c3fea4-fb46-9a70-3fbc-bf7562ce3859", asOf: "17 Aug 2026" }
    },
    {
        id: "clinical-research", name: "Clinical research coordinator", lane: "Trials & human research", entry: "BS is common; clinical experience and human-subjects training strengthen applications", fit: ["clinical", "biology", "translation"],
        work: "Coordinate participant visits, consent, protocol adherence, data capture, safety reporting and communication across investigators, sponsors and clinical teams.",
        skills: ["human-subjects research", "protocol operations", "data quality", "communication", "scheduling", "regulatory documentation"],
        evidence: "Use examples of accurate coordination, participant-facing communication, privacy protection and protocol deviations resolved responsibly.",
        market: "O*NET describes the occupation as planning or coordinating clinical research and ensuring protocol compliance; device-trial experience is especially relevant to neurotechnology.",
        sourceUrl: "https://www.onetonline.org/link/details/11-9121.01", searchUrl: "https://jobs.nih.gov/",
        openRole: { title: "Clinical Research Associate", employer: "Neuralink", location: "Austin, TX", url: "https://boards.greenhouse.io/neuralink/jobs/7865371003", asOf: "17 Aug 2026" }
    },
    {
        id: "regulatory-quality", name: "Regulatory affairs / quality engineer", lane: "Safety & evidence", entry: "BS in engineering or science; device quality or regulatory experience is highly valued", fit: ["translation", "clinical", "device"],
        work: "Build design controls, risk files, verification evidence, submissions, post-market processes and traceability for medical-device development.",
        skills: ["design controls", "risk management", "verification", "technical writing", "quality systems", "regulatory strategy"],
        evidence: "Show how you converted a requirement or hazard into traceable tests, documentation and a defensible decision.",
        market: "These roles exist across the medical-device sector and may use titles such as regulatory engineer, quality systems engineer or submissions specialist.",
        sourceUrl: "https://www.onetonline.org/link/details/13-1041.07", searchUrl: "https://www.raps.org/careers",
        openRole: { title: "Regulatory Engineer", employer: "Neuralink", location: "Austin, TX", url: "https://boards.greenhouse.io/neuralink/jobs/7741688003", asOf: "17 Aug 2026" }
    },
    {
        id: "neural-data-infra", name: "Neural-data infrastructure engineer", lane: "Software & open science", entry: "BS/MS in CS, data engineering or quantitative neuroscience", fit: ["code", "research", "translation"],
        work: "Create data formats, ingestion, provenance, visualization, cloud pipelines and reproducible analysis systems for large multimodal neuroscience projects.",
        skills: ["software engineering", "databases", "cloud/HPC", "APIs", "data standards", "testing"],
        evidence: "Contribute to a real open-science project or publish a pipeline with tests, documentation, provenance and a realistic dataset.",
        market: "The broad software market is much larger than neuroscience-specific infrastructure. BLS projects 16% growth for software developers from 2024–34; specialist roles still require domain fluency.",
        sourceUrl: "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm", searchUrl: "https://neurojobs.sfn.org/",
        openRole: { title: "Software Engineer II - Scientific Computing", employer: "Allen Institute", location: "Seattle, WA", url: "https://alleninstitute.org/careers/jobs?jobId=eaf7f3c2-59c1-8e73-7d9e-56463c4bcbe1", asOf: "17 Aug 2026" }
    },
    {
        id: "human-factors-product", name: "Neurotechnology product / human-factors specialist", lane: "Product & responsible use", entry: "BS/MS plus evidence in engineering, design research, clinical workflow or neuroethics", fit: ["translation", "clinical", "explore"],
        work: "Translate user needs, clinical workflows, accessibility, privacy and technical constraints into product requirements and validation studies.",
        skills: ["user research", "requirements", "human factors", "accessibility", "risk communication", "cross-functional planning"],
        evidence: "Show a case study that connects observed user needs to changed requirements and validated outcomes, including what the design should not do.",
        market: "Titles vary widely—human factors engineer, product specialist, UX researcher, program manager or responsible-innovation lead—so search by function as well as industry.",
        sourceUrl: "https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm", searchUrl: "https://neurojobs.sfn.org/",
        openRole: { title: "UI Design Engineer", employer: "Neuralink", location: "South San Francisco, CA", url: "https://boards.greenhouse.io/neuralink/jobs/6057476003", asOf: "17 Aug 2026" }
    }
];
const pathwayGuides = {
    undergraduate: {
        title: "Build options, not a single dream school",
        timing: "Start 12–18 months before enrollment; test one technical and one research experience before committing to a narrow label.",
        steps: [
            "Choose an engineering foundation you would still value if your neurotechnology interests change: ECE for circuits/computation, BME for medical breadth, CS for data, or materials/biology for interfaces.",
            "Compare direct-entry rules. Some programs admit specifically to BME; others admit to engineering first and allocate majors later.",
            "Show quantitative readiness through the strongest mathematics, physics, computing and laboratory science available in your context.",
            "Use essays to connect a real question or project to the curriculum—not to claim that one device will solve a disease.",
            "Compare net cost, research access, advising, co-op/clinical exposure and whether switching majors is possible."
        ],
        avoid: "Do not select by ranking alone or assume a neuroscience major provides the same design, circuits and accreditation preparation as engineering."
    },
    graduate: {
        title: "Match the lab, degree structure and funding",
        timing: "Begin 9–15 months ahead. Many U.S. PhD deadlines fall in late autumn, while international master's and supervisor-led programs use different rounds.",
        steps: [
            "Write a one-sentence research direction, then identify 4–8 faculty whose current methods and questions genuinely match it.",
            "Read two recent papers from each serious laboratory and check whether the principal investigator is accepting students.",
            "Build a CV around research contributions, methods, code, design decisions and outputs; distinguish what you did from what the lab did.",
            "Ask recommenders who observed your research judgment. Give them your CV, goals and deadlines well in advance.",
            "For every offer, compare guaranteed stipend duration, tuition, fees, insurance, summer support, rotations, adviser switching and cost of living in writing."
        ],
        avoid: "Do not use one generic statement everywhere, contact dozens of faculty with the same email, or treat a self-funded professional master's as equivalent to a funded research doctorate."
    },
    jobs: {
        title: "Apply by function, not only by the word neurotech",
        timing: "Begin portfolio and networking work 3–6 months before a target start; hiring is rolling and company timelines change quickly.",
        steps: [
            "Choose a lane—software, electronics, materials, experiments, clinical operations, regulatory or product—and make the first third of your résumé prove that lane.",
            "Search by underlying function and technique: signal processing, implant firmware, MEMS, EEG, clinical specialist, design controls or neural data.",
            "Create one inspectable work sample with context, your decisions, measured result, limitations and a link when disclosure rules allow.",
            "Mirror truthful job-description vocabulary so reviewers can find your evidence; never list a tool you cannot discuss in depth.",
            "Prepare separate stories for technical judgment, teamwork, failure recovery, safety/ethics and why this product or research mission matters."
        ],
        avoid: "Do not infer a neurotechnology job boom from a broad software or biomedical labor statistic. Verify each employer, role, location, work authorization and clinical-travel expectation."
    }
};
const pathwayData = {
    reviewedAt: "17 Aug 2026",
    note: "Curated, globally distributed starting points—not rankings or a complete census. Program names, prerequisites, deadlines, fees, funding and visa rules change; confirm every decision on the linked official page.",
    programs: pathwayPrograms,
    roles: pathwayRoles,
    guides: pathwayGuides
};
