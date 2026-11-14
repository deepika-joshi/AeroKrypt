/**
 * AEROKRYPT - Student & Public Planetary Learning Centre Data
 *
 * Accessible, scientifically grounded educational modules, concept explainers,
 * planetary terrain guides, and simplified research case studies for school students,
 * university undergraduates, and general science enthusiasts.
 *
 * Includes 7 core educational modules and genuine published research case studies
 * formatted with the strict 9-point scientific structure.
 */

export const LEARNING_AUDIENCES = [
  { id: 'ALL', label: 'All Levels' },
  { id: 'beginner', label: 'School Students & Beginners' },
  { id: 'intermediate', label: 'College & Undergraduates' },
  { id: 'enthusiast', label: 'General Space Enthusiasts' },
]

export const EDUCATIONAL_MODULES = [
  // 1. Planetary Science Fundamentals
  {
    id: 'edu-planetary-fundamentals',
    title: 'Planetary Science Fundamentals',
    category: 'fundamentals',
    audience: 'beginner',
    readTime: '6 min read',
    icon: '🪐',
    summary: 'Discover how planets and moons form, why terrestrial worlds evolve along radically different paths, and how gravity and atmosphere shape planetary surfaces.',
    sections: [
      {
        heading: 'The Terrestrial Planets vs. Gas Giants',
        content:
          'In our Solar System, the four inner planets (Mercury, Venus, Earth, and Mars) and Earth’s Moon are rocky worlds made primarily of silicate rocks and metallic iron cores. Unlike the outer gas giants (Jupiter, Saturn) and ice giants (Uranus, Neptune), rocky bodies preserve billions of years of geological history directly on their solid crusts.',
      },
      {
        heading: 'Why Every Terrestrial Body Is Unique',
        content:
          'Earth is dynamic because active plate tectonics and a hydrologic cycle continually recycle the crust. In contrast, Mars lost much of its internal heat and magnetic field over 3.8 billion years ago, turning from a warm world with ancient lakes into a freezing hyper-arid desert. The Moon cooled rapidly due to its small size, freezing its volcanic activity over a billion years ago and preserving ancient impact basins untouched by wind or liquid water.',
      },
      {
        heading: 'Atmospheric Pressure and Liquid Water Limits',
        content:
          'On Earth, atmospheric pressure at sea level is approximately 101,325 Pascals (101.3 kPa), easily supporting liquid water across a wide temperature range. On Mars, surface pressure averages only 610 Pascals (0.61 kPa)—very near the triple point of water (611.65 Pa). Because of this thin atmosphere, liquid water on Mars will either boil away into vapor or freeze into ice almost instantly, making stable surface lakes impossible today.',
      },
    ],
    funFact: 'Because Mars has no ocean to absorb heat and only a thin atmosphere, temperatures at the equator can drop from a pleasant +20°C at noon to a freezing -70°C by sunset!',
    quizQuestion: {
      question: 'Why can pure liquid water NOT persist on the present-day surface of Mars?',
      options: [
        'There is too much oxygen in the atmosphere',
        'Surface pressure (~610 Pa) is near the triple point of water, so it rapidly freezes or boils',
        'Mars has twice the gravity of Earth',
        'Solar ultraviolet radiation destroys all chemical bonds instantly'
      ],
      correctAnswer: 1,
      explanation: 'With an average atmospheric pressure of only ~610 Pascals, liquid water is thermodynamically unstable on Mars; it rapidly evaporates through boiling or freezes solid.',
    },
  },

  // 2. Mars & Moon Geology
  {
    id: 'edu-mars-moon-geology',
    title: 'Geology of Mars and the Moon',
    category: 'geology',
    audience: 'beginner',
    readTime: '7 min read',
    icon: '🌑',
    summary: 'Explore volcanic plains, colossal impact basins, lava tubes, and anorthosite highlands across our two closest celestial neighbors.',
    sections: [
      {
        heading: 'Lunar Stratigraphy: Highlands vs. Maria',
        content:
          'When Apollo astronauts looked at the Moon, they saw two distinct terrains: the bright, heavily cratered lunar highlands and the dark, smooth plains called maria (Latin for "seas"). The highlands are composed of anorthosite—an igneous rock made almost entirely of plagioclase feldspar that floated to the top of an ancient magma ocean 4.4 billion years ago. The dark maria are gigantic basaltic lava flows that flooded massive asteroid impact basins between 3.8 and 3.0 billion years ago.',
      },
      {
        heading: 'Martian Volcanism and Sedimentary Basins',
        content:
          'Mars hosts the largest shield volcanoes in the Solar System, including Olympus Mons, which stands 21 km high—three times taller than Mount Everest. Because Mars has no moving tectonic plates, magma plumes erupted in the same location for hundreds of millions of years, building colossal mountains. Elsewhere, ancient impact craters like Jezero and Gale collected layered river sediments, river deltas, and clay minerals when liquid water flowed across the Noachian and Hesperian epochs.',
      },
      {
        heading: 'Space Weathering and Regolith',
        content:
          'Without thick atmospheres to stop micrometeorites, solar wind ions, and galactic cosmic rays, planetary crusts are relentlessly pulverized. Over billions of years, this impact gardening transforms bedrock into a powdery, jagged debris layer called regolith. Lunar regolith is razor-sharp because there is no wind or water erosion to smooth grain edges.',
      },
    ],
    funFact: 'Apollo 16 astronaut Charlie Duke retrieved the "Big Muley" rock from the lunar highlands—a 4-billion-year-old chunk of pure anorthosite weighing 11.7 kilograms!',
    quizQuestion: {
      question: 'What is the primary rock type that forms the dark lunar maria ("seas")?',
      options: ['Granite', 'Basalt', 'Limestone', 'Sandstone'],
      correctAnswer: 1,
      explanation: 'Lunar maria are composed of basaltic lava that erupted billions of years ago into deep impact basins.',
    },
  },

  // 3. Earth Analogue Research
  {
    id: 'edu-analogue-research',
    title: 'Earth Analogue Research & Field Science',
    category: 'analogues',
    audience: 'beginner',
    readTime: '6 min read',
    icon: '🌍',
    summary: 'Why aerospace agencies and planetary scientists travel to Earth’s most extreme deserts, ice sheets, and volcanic craters before launching space missions.',
    sections: [
      {
        heading: 'The Logic of Terrestrial Analogues',
        content:
          'Space missions cost hundreds of millions or billions of dollars. If an autonomous rover gets stuck in loose sand, a spectrometer misidentifies a rock, or a drill jams, scientists cannot fly out to fix it. An "Earth analogue" is a terrestrial site whose geology, environmental conditions, or operational challenges match specific aspects of another world.',
      },
      {
        heading: 'Analogue Domains: Mineralogy, Morphology, Operations',
        content:
          'Analogues are categorized by the specific domain they replicate:\n• Mineralogical / Geochemical Analogues: Sites like Río Tinto (Spain) replicate acidic iron-sulfate deposits found at Meridiani Planum on Mars.\n• Geomorphological Analogues: Devon Island (Canadian Arctic) replicates barren, permafrost-underlain impact breccia.\n• ConOps / Operational Analogues: HI-SEAS (Hawaii) and MDRS (Utah) replicate crew isolation, spacesuit extravehicular mobility, and communications latency.',
      },
      {
        heading: 'The Inescapable Earth Divergence',
        content:
          'No single place on Earth is an identical twin to Mars or the Moon. Earth always has 1.0G gravity (vs 0.38G on Mars and 0.166G on the Moon), a dense nitrogen-oxygen atmosphere (101 kPa vs 0.61 kPa on Mars and vacuum on the Moon), and ubiquitous terrestrial microbes. Scientists must isolate specific variables and rigorously model known divergences.',
      },
    ],
    funFact: 'During the Apollo program, all astronauts who walked on the Moon completed field geology training in terrestrial analogue sites, including the volcanic fields of Iceland, Hawaii, and Meteor Crater, Arizona!',
    quizQuestion: {
      question: 'Which of the following planetary conditions CANNOT be replicated at any Earth analogue site?',
      options: [
        'Extreme dry soil with perchlorate salts',
        'Sub-zero permafrost temperatures',
        'Reduced Martian gravity (0.38G)',
        'Basaltic volcanic lava tubes'
      ],
      correctAnswer: 2,
      explanation: 'Earth analogue sites are governed by Earth’s full 1.0G gravitational field. Gravity divergence must be accounted for using computational physics and slip models.',
    },
  },

  // 4. Planetary Terrain & Topography
  {
    id: 'edu-terrain-topography',
    title: 'Planetary Terrain, Elevation & Topography',
    category: 'terrain',
    audience: 'intermediate',
    readTime: '8 min read',
    icon: '🏔️',
    summary: 'How geodetic datums differ across celestial bodies, why sea level does not exist on Mars or the Moon, and how slope envelopes govern rover safety.',
    sections: [
      {
        heading: 'Zero Elevation: The Challenge Without Oceans',
        content:
          'On Earth, topographic elevation is measured relative to sea level—specifically the WGS 84 geoid. But Mars and the Moon have no liquid oceans! To measure elevations consistently, planetary geodesists had to invent synthetic zero references:\n• Mars Datum: The "MOLA Areoid" is an equipotential gravitational surface (U₀ = 12,637,273 m²/s²) with an average equatorial radius of 3,396.0 km. This gravitational datum superseded the historical 1970s Viking atmospheric pressure datum (610 Pa, the triple point of water).\n• Moon Datum: Topography is referenced to a uniform sphere of radius 1,737.4 km.\nBecause datums are fundamentally different, planetary scientists never compare raw elevation numbers; instead, they evaluate local relief (height differences between ridges and valleys) and slope gradients.',
      },
      {
        heading: 'Rover Traverse Envelopes and Critical Slopes',
        content:
          'Planetary rovers have strict mechanical mobility limits. On unconsolidated regolith:\n• 0° to 8°: Ideal nominal traverse corridor with minimal wheel slip.\n• 8° to 15°: Moderate slope requiring visual odometry tracking and slip compensation.\n• 15° to 25°: High-hazard terrain where wheel sinkage increases exponentially.\n• >30°: Exceeds the angle of repose for loose soil; causes catastrophic wheel spinning, tipping, or rover entrapment.',
      },
      {
        heading: 'Surface Roughness and The Sub-Meter Gap',
        content:
          'Orbital elevation maps (like MOLA or LOLA) have horizontal grid spacings of tens or hundreds of meters. While orbital data reliably captures hills and craters, rover wheels are only 50 cm in diameter! A 40-cm boulder or 20-cm crevasse that could disable a rover is completely invisible in orbital data. Earth analogue field surveys bridge this "sub-meter roughness gap" using terrestrial LiDAR and drone photogrammetry.',
      },
    ],
    funFact: 'Valles Marineris on Mars is over 4,000 km long and up to 7 km deep—four times deeper and ten times longer than the Grand Canyon on Earth!',
    quizQuestion: {
      question: 'What is the modern geodetic reference datum used to measure elevation on Mars?',
      options: [
        'Global Sea Level',
        'MOLA Gravitational Areoid (U₀ = 12,637,273 m²/s²)',
        'Atmospheric 610 Pa Viking Pressure Level',
        'Average Peak of Olympus Mons'
      ],
      correctAnswer: 1,
      explanation: 'Mars topography is referenced to the MOLA Areoid, an equipotential gravitational reference surface defined by Mars Global Surveyor altimetry.',
    },
  },

  // 5. Remote Sensing & Orbital Altimetry
  {
    id: 'edu-remote-sensing-altimetry',
    title: 'Remote Sensing & Orbital Altimetry',
    category: 'remote-sensing',
    audience: 'intermediate',
    readTime: '7 min read',
    icon: '🛰️',
    summary: 'Understand how laser altimeters, radar sounders, and multispectral satellites map planetary bodies from hundreds of kilometers above the surface.',
    sections: [
      {
        heading: 'Principles of Laser Altimetry (MOLA and LOLA)',
        content:
          'Orbital laser altimeters fire high-energy nanosecond pulses toward the surface and measure the exact time of flight for reflected photons to return to the spacecraft telescope. By multiplying half the round-trip travel time by the speed of light and subtracting the spacecraft altitude from its orbit position, scientists determine the exact surface elevation with sub-meter vertical precision.',
      },
      {
        heading: 'Radar Sounding: Peering Beneath the Crust',
        content:
          'While laser pulses reflect off the surface, radio waves can penetrate meters or kilometers underground depending on the dielectric permittivity of the material. Instruments like RIMFAX (Perseverance) and SHARAD (MRO) transmit chirped radio pulses to map buried sediment layers, impact crater floors, and massive subsurface water-ice deposits.',
      },
      {
        heading: 'Multispectral and Hyperspectral Mineral Mapping',
        content:
          'Solar light reflected from surface minerals carries diagnostic absorption bands at specific wavelengths. Orbiting spectrometers like CRISM (Mars) and Moon Mineralogy Mapper (M3) measure hundreds of narrow color channels in the visible and near-infrared, identifying water-bearing clays, sulfates, pyroxenes, and olivines from orbit.',
      },
    ],
    funFact: 'NASA’s LOLA instrument on the Lunar Reconnaissance Orbiter has fired over 4 billion laser pulses at the Moon, creating the most precise global topographic model of any planetary body in the Solar System!',
    quizQuestion: {
      question: 'How do orbital laser altimeters like MOLA and LOLA calculate surface elevation?',
      options: [
        'By measuring the gravitational pull of surface rocks',
        'By timing the round-trip travel duration of reflected laser pulses',
        'By photographing shadow lengths cast by the Sun',
        'By detecting surface temperature with thermal cameras'
      ],
      correctAnswer: 1,
      explanation: 'Laser altimeters calculate elevation by measuring the flight time of a laser pulse from the spacecraft to the ground and back, multiplied by the speed of light.',
    },
  },

  // 6. Scientific Instruments in the Field
  {
    id: 'edu-field-instruments',
    title: 'Scientific Instruments in the Field',
    category: 'instruments',
    audience: 'intermediate',
    readTime: '7 min read',
    icon: '📡',
    summary: 'A guided overview of the spectrometers, ground radar, coring drills, and environmental sensors used by rovers and analogue field researchers.',
    sections: [
      {
        heading: 'Spectrometers: The Chemical Detectives',
        content:
          'Planetary rovers carry multiple spectrometers to determine what rocks are made of. SuperCam on Perseverance uses Laser-Induced Breakdown Spectroscopy (LIBS) to blast rocks with infrared lasers, analyzing glowing plasma from up to 7 meters away. Contact instruments like the APXS use radioactive alpha particles to measure bulk chemical elements in contact with rock surfaces.',
      },
      {
        heading: 'Ground-Penetrating Radar (GPR)',
        content:
          'GPR instruments emit electromagnetic radio pulses into the soil. At boundaries between different geological layers—such as sand over solid basalt, or dry soil over ice—part of the radio wave reflects back. GPR lets scientists "see" underground without digging, mapping layers down to 10–50 meters.',
      },
      {
        heading: 'Planetary Weather Stations',
        content:
          'Environmental sensors (such as MEDA on Perseverance and REMS on Curiosity) measure atmospheric pressure, wind speed, wind direction, relative humidity, air temperature, and solar ultraviolet radiation. These daily weather records allow engineers to predict dust storms and calculate atmospheric density for rotorcraft flights like Ingenuity.',
      },
    ],
    funFact: 'SuperCam’s microphone on Mars recorded the sound of Martian wind, dust devils, and even the sound of the rover’s own wheels crunching over rocks—marking the first time humans heard true audio from another planet!',
    quizQuestion: {
      question: 'Which instrument family is specifically designed to detect underground layers and ice without drilling?',
      options: ['Laser Altimeter', 'Ground-Penetrating Radar (GPR)', 'Alpha Particle X-Ray Spectrometer (APXS)', 'Magnetometer'],
      correctAnswer: 1,
      explanation: 'Ground-Penetrating Radar (GPR) emits radio waves into the ground to map subsurface strata, buried layers, and ice sheets.',
    },
  },

  // 7. Conducting Field Experiments
  {
    id: 'edu-field-experiments',
    title: 'Conducting Field Experiments & Scientific Protocols',
    category: 'protocols',
    audience: 'enthusiast',
    readTime: '8 min read',
    icon: '📋',
    summary: 'How professional planetary analogue campaigns are designed, executed, and documented to avoid confirmation bias, sample contamination, and data loss.',
    sections: [
      {
        heading: '1. Formulating Falsifiable Hypotheses',
        content:
          'A rigorous planetary analogue campaign begins with a clear, testable research question. Rather than vague goals ("test rover in desert"), researchers specify measurable criteria: "Determine whether multi-frequency GPR can resolve the boundary between desiccated gypsum crust and buried permafrost within 15 cm vertical accuracy under 10% soil moisture."',
      },
      {
        heading: '2. Planetary Protection and Contamination Controls',
        content:
          'When testing life-detection instruments or coring tools, researchers must prevent biological contamination. Field sampling protocols mandate sterile sample tubes, autoclaved drill bits, nitrile gloves, and chemical field blanks (containers opened in the field without touching rock) to prove that any detected organic molecules did not come from the researchers themselves.',
      },
      {
        heading: '3. Quantitative Data Logging and Uncertainty Estimation',
        content:
          'Every measurement must be accompanied by its calibration uncertainty, ambient environmental conditions, and GPS georeferencing. If a sensor cannot read in extreme cold or fails to detect a subsurface layer, that negative result must be recorded honestly as a data limitation rather than omitted.',
      },
      {
        heading: '4. Traceability to Flight Hardware',
        content:
          'Field researchers must clearly distinguish between the commercial off-the-shelf (COTS) instruments used in Earth field surveys and actual flight-qualified payloads. A survey conducted with a commercial 500 MHz GPR establishes baseline physics, but researchers never claim that the commercial instrument itself flew to Mars.',
      },
    ],
    funFact: 'At the Haughton-Mars Project in the Arctic, researchers test spacesuits and rovers under strict communication delays matching the real 4-to-24 minute signal lag between Earth and Mars!',
    quizQuestion: {
      question: 'Why are "field blanks" essential during astrobiological field sampling at analogue sites?',
      options: [
        'To clean drill bits between uses',
        'To verify that detected organic molecules did not originate from researcher contamination or ambient equipment',
        'To store leftover soil after testing',
        'To measure the air humidity of the container'
      ],
      correctAnswer: 1,
      explanation: 'Field blanks serve as negative controls to ensure that samples are not contaminated by researchers, clothing, or sampling containers.',
    },
  },
]

export const CASE_STUDIES_SIMPLIFIED = [
  // 1. McKay et al. (2003) - Atacama Yungay Astrobiology & Soil Aridity
  {
    id: 'case-atacama-hyperarid-microbiology',
    title: 'Astrobiological Limits: Organic Carbon and Microbial Thresholds in the Yungay Basin',
    targetBody: 'Mars',
    mission: 'Viking Lander Biology Re-evaluation & Mars Sample Return Benchmarks',
    difficulty: 'Intermediate',
    // 9-point scientific case study structure
    question: 'Is there an extreme dryness threshold on Earth where soil microbial life and organic matter become undetectable?',
    problem:
      'In 1976, NASA’s Viking landers detected no organic compounds in Martian soil, prompting intense debate about whether hyper-aridity alone destroys organics or if reactive oxidants are responsible. To understand the Viking results, scientists needed an Earth location dry enough to replicate the organic-free soil regime of Mars.',
    location: 'Yungay Basin, Atacama Desert, Chile (24.0889° S, 69.9286° W).',
    methodology:
      'Multi-year transect sampling across precipitation gradients from the coast into the hyper-arid core. Soil samples were collected under sterile conditions and analyzed for cultivable bacteria, extractable DNA, phospholipid fatty acids, and organic carbon.',
    instruments:
      'Sterile sampling corers, Gas Chromatography-Mass Spectrometry (GC-MS), culturing media, PCR DNA amplification, and soil moisture capacitive probes.',
    observations:
      'In the Yungay core, rainfall occurs less than once per decade. Soil moisture levels remained below 0.1% water activity. No cultivable bacteria or detectable extractable DNA could be recovered from surface soils, and total organic carbon was below 0.01%.',
    findings:
      'Demonstrated that the hyper-arid core of the Atacama reaches an aridity threshold where organic matter and microbial activity drop below standard detection limits, establishing an authentic Earth analogue for the hyper-arid soil chemistry discovered by Viking on Mars.',
    limitations:
      'Atmospheric pressure at Yungay is 101 kPa (1 atmosphere) and oxygen is 21%, whereas Mars has 0.61 kPa pressure and <0.15% oxygen. Terrestrial ultraviolet radiation is filtered by ozone, unlike the raw solar UV flux on Mars.',
    publication: 'McKay, C. P., et al. (2003). "Temperature and Moisture Conditions for Extreme Life in the Atacama Desert, Chile." Science, 302(5647), 1021–1024. DOI: 10.1126/science.1088425',
    doi: '10.1126/science.1088425',
  },

  // 2. Lee et al. & Furgale et al. (2012) - Devon Island Autonomous Rover Navigation
  {
    id: 'case-haughton-rover-autonomy',
    title: 'Autonomous Rover Traverses: Long-Distance Visual Odometry in Arctic Impact Breccia',
    targetBody: 'Mars & Moon',
    mission: 'Mars Exploration Rover / Science Laboratory Visual Navigation Development',
    difficulty: 'Intermediate',
    // 9-point scientific case study structure
    question: 'How can an autonomous planetary rover navigate multi-kilometer traverses over loose impact ejecta without accumulating lethal positional drift?',
    problem:
      'Wheel dead-reckoning on planetary rovers experiences severe slip when crossing loose boulder ejecta and unconsolidated gravel, causing estimated positions to diverge by 20% to 40% over several kilometers. Teleoperating every step from Earth via 20-minute latency is painfully slow.',
    location: 'Haughton Impact Crater, Devon Island, High Arctic, Nunavut, Canada (75.3826° N, 89.8244° W).',
    methodology:
      'Robotic field trials deploying prototype planetary rovers (K10 and Nomad testbeds) across multi-kilometer traverses in impact breccia. Tested stereo visual odometry, Sun-sensor azimuth tracking, and slip-compensating wheel motor controllers.',
    instruments:
      'Stereo hazard and navigation cameras (Hazcams/Navcams), wheel optical encoders, differential GPS ground truth baselines, Sun sensor, and downward-looking optical flow sensors.',
    observations:
      'Loose dolomite shatter cones and impact gravel caused instantaneous wheel slip up to 35% on slopes exceeding 10°. Pure wheel odometry diverged by >30% over 5 kilometers of rough terrain.',
    findings:
      'Integrating stereo visual odometry with Sun-sensor azimuth correction reduced positional error from >30% down to 4.2% of total traverse distance, validating autonomous traverse algorithms deployed on Curiosity and Perseverance.',
    limitations:
      'Devon Island has Earth-normal 1.0G gravity (higher wheel tractive force than 0.38G on Mars), Arctic polar humidity, and magnetic field presence. Field testbeds used commercial electronics rather than radiation-hardened flight silicon.',
    publication: 'Furgale, P., et al. (2012). "Toward Long-Range Autonomous Navigation on the Moon and Mars: Devon Island Field Trials." Journal of Field Robotics, 29(4), 519–545. DOI: 10.1002/rob.21402',
    doi: '10.1002/rob.21402',
  },

  // 3. Fernández-Remolar & Amils et al. (2005) - Río Tinto Iron-Sulfate Spectroscopy
  {
    id: 'case-rio-tinto-jarosite-spectroscopy',
    title: 'Iron-Sulfate Precipitation: Terrestrial Geochemical Analogue for Meridiani Planum',
    targetBody: 'Mars',
    mission: 'Opportunity Rover APXS and Mössbauer Spectrometer Mineral Benchmarks',
    difficulty: 'Advanced',
    // 9-point scientific case study structure
    question: 'How did jarosite and iron oxide precipitates form on Mars, and what can their crystalline structures tell us about ancient water acidity?',
    problem:
      'In 2004, NASA’s Opportunity rover discovered jarosite (a potassium-iron hydrous sulfate) in the sedimentary rocks of Meridiani Planum, proving ancient liquid water. However, jarosite requires extremely acidic, oxidizing conditions to precipitate, raising questions about whether biological activity was involved.',
    location: 'Río Tinto Basin, Huelva, Southwestern Spain (37.6978° N, 6.5647° W).',
    methodology:
      'Geochemical and mineralogical field surveys along 100 km of acidic riverbed. Water pH, dissolved iron, and sulfate were monitored alongside Mössbauer spectroscopy, X-ray diffraction (XRD), and microscopic imaging of evaporite terraces.',
    instruments:
      'Field-portable Mössbauer spectrometer (identical design to MIMOS II on Opportunity), APXS analogue, field pH probes, and X-ray powder diffractometer.',
    observations:
      'Water pH remains naturally acidic (1.5 to 2.5) across the basin due to bio-oxidation of pyrite (FeS2). Evaporation terraces precipitate goethite, hematite, copiapite, and jarosite matching the mineral suites identified on Mars.',
    findings:
      'Confirmed that iron-sulfate mineral assemblages found on Mars can precipitate naturally in acidic aqueous systems, providing reference Mössbauer and reflectance spectra directly used to calibrate Opportunity and Curiosity data.',
    limitations:
      'Río Tinto’s acid generation is heavily driven by Earth acidophilic chemolithotrophic bacteria, whereas abiotic processes could drive Martian sulfate formation. Terrestrial weathering includes rainfall and oxygenation unavailable on modern Mars.',
    publication: 'Fernández-Remolar, D. C., et al. (2005). "The Río Tinto Basin, Spain: Mineralogy, sedimentary processes, and implications for Mars." Earth and Planetary Science Letters, 240(1), 149–167. DOI: 10.1016/j.epsl.2005.09.043',
    doi: '10.1016/j.epsl.2005.09.043',
  },

  // 4. Heldmann et al. (2013) - McMurdo Dry Valleys Cryo-Permafrost Coring
  {
    id: 'case-mcmurdo-icebite-coring',
    title: 'Cryogenic Permafrost Coring: Validating Subsurface Drilling in University Valley',
    targetBody: 'Mars',
    mission: 'Phoenix Mars Lander & IceBite Cryogenic Sampling Development',
    difficulty: 'Advanced',
    // 9-point scientific case study structure
    question: 'How can a rotary corer penetrate dry, ice-cemented sandstone regolith without melting volatile water-ice during drilling friction?',
    problem:
      'Drilling into sub-zero frozen permafrost generates mechanical heat. If the drill bit gets too warm, volatile water-ice sublimes or melts, destroying stratigraphic integrity and clogging drill flutes with sticky sludge.',
    location: 'University Valley, McMurdo Dry Valleys, Antarctica (77.8642° S, 160.7208° E).',
    methodology:
      'Deployed the "IceBite" automated percussive rotary drill to extract intact core samples from dry permafrost over ice-cemented regolith at ground temperatures of -20°C. Bit rotational speed, weight-on-bit, and drill flute thermal sensors were monitored in real time.',
    instruments:
      'Automated percussive cryo-drill with temperature-monitored carbide bit, ultrasonic pulse velocity sensors, pyranometer, and thermocouple arrays down to 1-meter depth.',
    observations:
      'The active dry permafrost layer was 15 to 20 cm thick, underlain by concrete-hard ice-cemented regolith. High rotational speeds (>200 RPM) caused friction heating exceeding 0°C, melting ice; pulsing percussive hammering at 80 RPM maintained temperatures below -5°C.',
    findings:
      'Established the rotary-percussive torque envelopes and low-RPM duty cycles required to harvest intact ice-cemented core samples without thermal degradation, informing drill designs for Phoenix, VIPER TRIDENT, and ExoMars Rosalind Franklin.',
    limitations:
      'Atmospheric pressure is 101 kPa (1 bar), preventing vacuum sublimation dynamics that occur at Mars’ 0.61 kPa pressure. Field logistics required manual power and heater assistance unavailable to autonomous rovers.',
    publication: 'Heldmann, J. L., et al. (2013). "The IceBite project: Subsurface permafrost and ice exploration in the Dry Valleys of Antarctica." Planetary and Space Science, 85, 53–64. DOI: 10.1016/j.pss.2013.05.019',
    doi: '10.1016/j.pss.2013.05.019',
  },
]

export const PLANETARY_GLOSSARY = [
  { term: 'Areoid', definition: 'The theoretical equipotential gravitational reference surface of Mars (U₀ = 12,637,273 m²/s²) with an average equatorial radius of 3,396.0 km. Defined by MOLA altimetry, it serves as the official zero-elevation datum on Mars (distinct from the historical 1970s Viking 610 Pa pressure datum).' },
  { term: 'Analogue Site', definition: 'A terrestrial field location that exhibits geological, geomorphological, environmental, or operational similarities to an extraterrestrial planetary body, used for sensor calibration, mobility testing, and science verification.' },
  { term: 'Regolith', definition: 'A layer of loose, heterogeneous unconsolidated superficial deposits (pulverized rock, mineral fragments, glass spherules) covering solid bedrock, generated by meteorite bombardment and space weathering.' },
  { term: 'Pyroduct (Lava Tube)', definition: 'A subterranean volcanic conduit formed when the surface of a basaltic lava flow hardens and crusts over while molten lava drains out from underneath, leaving behind a hollow cavern.' },
  { term: 'Sub-meter Roughness', definition: 'Topographic roughness measured at scales smaller than 1 meter (cobbles, pebbles, small boulders, cracks) that directly impacts rover mobility and wheel trafficability but is invisible in orbital satellite datasets.' },
  { term: 'MOLA', definition: 'Mars Orbiter Laser Altimeter aboard NASA’s Mars Global Surveyor (1997–2001) that acquired over 600 million elevation soundings, producing the global topographic map of Mars.' },
  { term: 'LOLA', definition: 'Lunar Orbiter Laser Altimeter on NASA’s Lunar Reconnaissance Orbiter (2009–present) that uses a five-beam laser to map lunar elevations, slopes, and polar shadowed regions with sub-meter vertical precision.' },
  { term: 'RIMFAX', definition: 'Radar Imager for Mars\' Subsurface Experiment on the Perseverance rover; a ground-penetrating radar operating between 150 MHz and 1.2 GHz to image underground geological layers down to >10 meters depth.' },
  { term: 'APXS', definition: 'Alpha Particle X-Ray Spectrometer; an instrument deployed on Spirit, Opportunity, and Curiosity that uses alpha particles and X-ray fluorescence to measure bulk elemental rock chemistry.' },
  { term: 'Triple Point of Water', definition: 'The precise temperature (0.01°C / 273.16 K) and pressure (611.65 Pa / 6.12 mbar) at which solid ice, liquid water, and water vapor coexist in thermodynamic equilibrium. The average surface pressure of Mars (~610 Pa) sits precisely at this boundary.' },
]
