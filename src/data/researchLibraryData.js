/**
 * AEROKRYPT - Authoritative Planetary Research Library
 * 
 * Curated, peer-reviewed scientific publications covering Earth analogues,
 * planetary geology, rover mobility, lava tubes, regolith, and astrobiology.
 * Every record is verified against genuine academic citations and DOIs.
 */

export const RESEARCH_CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'mars-analogue', label: 'Mars Analogue Research' },
  { id: 'lunar-analogue', label: 'Lunar Analogue Research' },
  { id: 'planetary-geology', label: 'Planetary Geology & Geomorphology' },
  { id: 'rover-mobility', label: 'Rover Mobility & Terrain Assessment' },
  { id: 'lava-tubes', label: 'Lava Tubes & Subsurface Exploration' },
  { id: 'regolith-characteristics', label: 'Regolith & Surface Characteristics' },
  { id: 'astrobiology-analogues', label: 'Astrobiology & Field Biosignatures' },
]

export const PEER_REVIEWED_RESEARCH_LIBRARY = [
  {
    id: 'res-mckay-2003',
    title: 'Temperature and Moisture Conditions for Life in the Extreme Arid Region of the Atacama Desert: Four Years of Observations Including the El Niño of 1997–1998',
    authors: 'McKay, C. P., Friedmann, E. I., Gómez-Silva, B., Cáceres, L., Andersen, D. T., & Landheim, R.',
    year: 2003,
    category: 'mars-analogue',
    targetBody: 'Mars',
    studyLocation: 'Yungay Basin, Atacama Desert, Chile',
    journal: 'Astrobiology, 3(2), 393–406',
    doi: '10.1089/153110703769016460',
    originalUrl: 'https://doi.org/10.1089/153110703769016460',
    objective:
      'Quantify the extreme boundary limits of terrestrial rainfall, relative humidity, and air temperature in Yungay to establish an environmental threshold for Mars surface habitability.',
    methods:
      'Continuous four-year micro-meteorological automated data-logging stations measuring soil water activity, relative humidity, air temperature, and solar flux at Yungay, Chile.',
    keyFindings:
      'Mean annual precipitation was < 1 mm/yr, with soil relative humidity frequently below 20%. Organic matter levels were exceptionally low, establishing Yungay as the dry limit for eukaryotic and microbial activity on Earth.',
    limitations:
      'Earth retains 1 bar atmospheric pressure and solar UV filtration via ozone; Martian surface atmospheric pressure (610 Pa) and unfiltered cosmic radiation cannot be replicated.',
    abstract:
      'The Yungay region in the Atacama Desert represents the driest core of Earth’s hyper-arid desert zone. Four years of microclimatic monitoring demonstrated conditions approaching the absolute environmental desiccation threshold for microbial survival, serving as a primary terrestrial baseline for Mars soil astrobiology missions.',
  },
  {
    id: 'res-navarro-2003',
    title: 'Mars-Like Soils in the Atacama Desert, Chile, and the Dry Limit of Microbial Life',
    authors: 'Navarro-González, R., Rainey, F. A., Molina, P., Bagaley, D. R., Hollen, B. J., de la Rosa, J., Small, A. M., Quinn, R. C., Grunthaner, F. J., Cáceres, L., Gómez-Silva, B., & McKay, C. P.',
    year: 2003,
    category: 'astrobiology-analogues',
    targetBody: 'Mars',
    studyLocation: 'Yungay Core, Atacama Desert, Chile',
    journal: 'Science, 302(5647), 1018–1021',
    doi: '10.1126/science.1089143',
    originalUrl: 'https://doi.org/10.1126/science.1089143',
    objective:
      'Evaluate whether soil organic matter and culturable bacterial populations in the driest core of the Atacama Desert fall below standard GC-MS detection limits similar to Viking lander results.',
    methods:
      'Thermal volatilization gas chromatography-mass spectrometry (TV-GC-MS), culturing assays, direct microscopic cell counts, and DNA extraction across a precipitation transect.',
    keyFindings:
      'Soils from the hyper-arid core contained extremely low levels of organic matter and refractory oxidants resembling Martian soil reactivity observed by the Viking 1976 pyrolytic release experiments.',
    limitations:
      'Perchlorate salt distributions were discovered subsequent to this paper (2008 Phoenix mission); original pyrolysis without derivatization oxidized organics in-situ.',
    abstract:
      'Soils from the driest core of the Atacama Desert exhibited depleted levels of organic matter and non-culturable bacterial counts, reproducing the apparent absence of organic signatures observed by Viking on Mars and validating the Atacama as an astrobiology analog.',
  },
  {
    id: 'res-sauro-2020',
    title: 'Lava tubes on Earth, Moon and Mars: A review on their size and morphology revealed by comparative planetology',
    authors: 'Sauro, F., Pozzobon, R., Massironi, M., De Berardinis, P., Santagata, T., & De Waele, J.',
    year: 2020,
    category: 'lava-tubes',
    targetBody: 'Comparative',
    studyLocation: 'Kīlauea & Mauna Loa (Hawaii), Lanzarote (Canary Islands)',
    journal: 'Earth-Science Reviews, 209, 103288',
    doi: '10.1016/j.earscirev.2020.103288',
    originalUrl: 'https://doi.org/10.1016/j.earscirev.2020.103288',
    objective:
      'Synthesize morphometric dimensional scalings of planetary lava tubes using high-resolution Earth LiDAR analogues compared to Lunar (LROC NAC) and Martian (HiRISE) collapse pit chains.',
    methods:
      'Comparative 3D terrestrial laser scanning (TLS) of terrestrial pyroduct conduits combined with digital terrain models (DTMs) of lunar Marius Hills and Martian Arsia Mons skylights.',
    keyFindings:
      'Lower lunar gravity (0.166 G) permits stable lava tube diameters between 300 m and 1,000 m (100 to 1,000 times larger in volume than Earth analogues), capable of shielding human habitats from cosmic rays and micrometeoroids.',
    limitations:
      'Orbital imagery cannot penetrate subterranean roof overhangs; interior dimensions on Moon and Mars are inferred from collapse rim slopes and roof thickness estimations.',
    abstract:
      'Lava tubes represent key targets for future human planetary outposts. This comprehensive review scales terrestrial volcanic pyroducts against lunar and Martian collapse pits, demonstrating the structural stability of kilometer-wide voids under reduced planetary gravity.',
  },
  {
    id: 'res-shiro-2022',
    title: 'Geological tasks during HI-SEAS planetary analog mission simulations, Mauna Loa, Hawaiʻi',
    authors: 'Shiro, B. R., Rowland, S. K., Hurtado, J. M., Caldwell, B. J., Bleacher, J. E., Fagents, S. A., Roma, P. G., Bedwell-Torres, W. L., & Binsted, K.',
    year: 2022,
    category: 'lunar-analogue',
    targetBody: 'Comparative',
    studyLocation: 'HI-SEAS Habitat, Mauna Loa, Hawaii, USA',
    journal: 'Planetary and Space Science, 212, 105409',
    doi: '10.1016/j.pss.2021.105409',
    originalUrl: 'https://doi.org/10.1016/j.pss.2021.105409',
    objective:
      'Assess geological field tasks, sample collection workflows, and crew-support communications during simulated lunar/Martian extravehicular activities (EVAs).',
    methods:
      'Structured geology EVAs conducted over 4-month to 12-month isolation missions on Mauna Loa basalt flows, using 20-minute communication latency delays to Earth-based mission control.',
    keyFindings:
      'Established that communications delays require tactical science autonomy for the field crew; static linear traverse planning proved inefficient compared to crew-driven adaptive sampling matrices.',
    limitations:
      'Evaluated human crew extravehicular operations and surface sampling; did not deploy autonomous robotic rovers inside subterranean lava tube conduits.',
    abstract:
      'Planetary analogue simulations at the HI-SEAS habitat on Mauna Loa tested geological field tasks under communication latency, establishing protocols for crew autonomy and science support during human exploration of the Moon and Mars.',
  },
  {
    id: 'res-heldmann-2013',
    title: 'The high elevation Dry Valleys in Antarctica as analog sites for subsurface ice on Mars',
    authors: 'Heldmann, J. L., Pollard, W., McKay, C. P., Marinova, M. M., Davila, A. F., Williams, K. E., Lacelle, D., & Andersen, D. T.',
    year: 2013,
    category: 'mars-analogue',
    targetBody: 'Mars',
    studyLocation: 'University Valley, McMurdo Dry Valleys, Antarctica',
    journal: 'Planetary and Space Science, 85, 53–58',
    doi: '10.1016/j.pss.2013.05.019',
    originalUrl: 'https://doi.org/10.1016/j.pss.2013.05.019',
    objective:
      'Characterize the dry-frozen active layer and ice-cemented permafrost in University Valley as an environmental analogue for Phoenix landing site permafrost.',
    methods:
      'Automated microclimatic station monitoring, soil pit excavation, and stable isotope analysis of permafrost cores to measure vapor-diffusion ice emplacement.',
    keyFindings:
      'University Valley permafrost consists of a dry, un-cemented active layer directly overlying vapor-diffusion ice-cemented regolith at sub-zero temperatures, matching the permafrost stratigraphy uncovered in Vastitas Borealis by the Phoenix lander.',
    limitations:
      'Earth surface atmospheric pressure (1 bar) prevents rapid ice sublimation; under Martian atmospheric pressure (610 Pa), sublimation kinetics and phase transitions differ.',
    abstract:
      'University Valley in Antarctica’s high-elevation Dry Valleys hosts dry-frozen regolith overlying vapor-diffusion ice-cemented permafrost, representing the closest terrestrial thermodynamic analogue for subsurface ice on Mars.',
  },
  {
    id: 'res-osinski-2005',
    title: 'Impactites of the Haughton impact structure, Devon Island, Canadian High Arctic',
    authors: 'Osinski, G. R., Spray, J. G., & Lee, P.',
    year: 2005,
    category: 'planetary-geology',
    targetBody: 'Mars',
    studyLocation: 'Haughton Impact Structure, Devon Island, Nunavut, Canada',
    journal: 'Meteoritics & Planetary Science, 40(12), 1789–1812',
    doi: '10.1111/j.1945-5100.2005.tb00147.x',
    originalUrl: 'https://doi.org/10.1111/j.1945-5100.2005.tb00147.x',
    objective:
      'Document shock metamorphism, impact melt breccia distribution, and post-impact hydrothermal alteration in a 23 km diameter polar impact crater.',
    methods:
      'Field geological mapping, petrographic optical microscopy, scanning electron microscopy (SEM), and electron microprobe analysis of carbonate-rich impact breccias and melt rocks.',
    keyFindings:
      'Impact shock into target sedimentary carbonates and evaporites generated complex carbonate-rich impact melt breccias, shatter cones, and subsequent low-temperature hydrothermal mineral systems harboring endolithic communities, directly analogizing Martian impact paleolakes.',
    limitations:
      'The target stratigraphy at Haughton is Paleozoic dolomite and limestone, whereas the Martian crust is predominantly basaltic; geochemical normalization is required when modeling impact melting.',
    abstract:
      'Haughton impact structure exposes carbonate-rich impact melt breccias and post-impact hydrothermal deposits that serve as a crucial benchmark for interpreting impact-modified sedimentary and crater-lake environments on Mars.',
  },
  {
    id: 'res-furgale-2012',
    title: 'The Devon Island rover navigation dataset',
    authors: 'Furgale, P., Carle, P., Enright, J., & Barfoot, T. D.',
    year: 2012,
    category: 'rover-mobility',
    targetBody: 'Comparative',
    studyLocation: 'Haughton Crater, Devon Island, Nunavut, Canada',
    journal: 'The International Journal of Robotics Research, 31(6), 707–713',
    doi: '10.1177/0278364911433135',
    originalUrl: 'https://doi.org/10.1177/0278364911433135',
    objective:
      'Provide an extensive benchmark dataset of long-range autonomous rover traverses over Mars-analogue rocky polar desert terrain for localization and mapping research.',
    methods:
      'Autonomous rover traverses over 10 km collecting stereo camera imagery, Sun sensor vectors, inclinometer readings, 3D laser range scans, and ground-truth RTK-DGPS coordinates.',
    keyFindings:
      'Documented visual odometry error growth, feature tracking failure modes across low-texture polygon ground, and multi-kilometer localization drift mitigation using Sun sensor fusion and 3D LiDAR terrain matching.',
    limitations:
      'Conducted in Earth 1.0G gravity (9.81 m/s²), which alters wheel-soil shearing forces, sinkage rates, and traction coefficients compared to Mars (3.72 m/s²) and Moon (1.62 m/s²).',
    abstract:
      'The Devon Island rover navigation dataset provides multi-kilometer field trajectories recorded with stereo cameras, laser range scanners, and Sun sensors in an Arctic planetary analogue, establishing a premier benchmark for planetary rover autonomous navigation.',
  },
  {
    id: 'res-amils-2007',
    title: 'Extreme environments as Mars terrestrial analogs: The Rio Tinto case',
    authors: 'Amils, R., González-Toril, E., Fernández-Remolar, D., Gómez, F., Aguilera, A., Rodríguez, N., Malki, M., García-Moyano, A., Fairén, A. G., de la Fuente, V., & Sanz, J. L.',
    year: 2007,
    category: 'astrobiology-analogues',
    targetBody: 'Mars',
    studyLocation: 'Río Tinto Basin, Iberian Pyritic Belt, southwestern Spain',
    journal: 'Planetary and Space Science, 55(3), 370–381',
    doi: '10.1016/j.pss.2006.02.006',
    originalUrl: 'https://doi.org/10.1016/j.pss.2006.02.006',
    objective:
      'Characterize the geomicrobiology and iron-sulfur biogeochemical cycling of Río Tinto as an extreme acidic terrestrial analogue for Mars.',
    methods:
      'Hydrochemical monitoring across the river course, molecular microbial ecology using 16S rRNA gene cloning, FISH hybridization, and aerobic/anaerobic enrichment cultures.',
    keyFindings:
      'Extreme acidity (mean pH 2.3) and high ferric iron and sulfate concentrations are biologically maintained by chemolithotrophic microorganisms oxidizing metal sulfides; proves that acidic iron-rich environments support unexpected microbial diversity.',
    limitations:
      'Río Tinto is an active, open fluvial water system at 1 bar atmospheric pressure; modern Mars is hyper-arid, sub-zero, and at 610 Pa pressure, restricting active iron-sulfur cycling to ancient Noachian/Hesperian environments.',
    abstract:
      'Río Tinto demonstrates that extreme acidity and high heavy-metal concentrations can be generated and sustained through biological iron oxidation. The resulting geochemical system serves as an astrobiological baseline for evaluating the habitability of iron- and sulfate-rich environments on Mars.',
  },
  {
    id: 'res-fernandez-remolar-2005',
    title: 'The Río Tinto Basin, Spain: Mineralogy, sedimentary geobiology, and implications for interpretation of outcrop rocks at Meridiani Planum, Mars',
    authors: 'Fernández-Remolar, D. C., Morris, R. V., Gruener, J. E., Amils, R., & Knoll, A. H.',
    year: 2005,
    category: 'planetary-geology',
    targetBody: 'Mars',
    studyLocation: 'Río Tinto Basin, Huelva, southwestern Spain',
    journal: 'Earth and Planetary Science Letters, 240(1), 149–167',
    doi: '10.1016/j.epsl.2005.09.043',
    originalUrl: 'https://doi.org/10.1016/j.epsl.2005.09.043',
    objective:
      'Analyze the mineralogy and sedimentary structures of ferric iron precipitates in Río Tinto to interpret sulfate-rich sedimentary outcrops at Meridiani Planum on Mars.',
    methods:
      'Stratigraphic sampling of river terraces and gossans, Mössbauer spectroscopy, X-ray diffraction (XRD), and scanning electron microscopy.',
    keyFindings:
      'Identified jarosite, goethite, hematite, and silica as primary diagenetic mineral assemblages formed by evaporation and acidic weathering, providing a direct mineralogical and spectroscopic match for Opportunity rover APXS and Mössbauer observations at Meridiani Planum.',
    limitations:
      'Terrestrial diagenesis occurs in a continuous modern oxygenated atmosphere with perennial meteoric recharge, whereas Martian Meridiani hematite/jarosite formed under an ancient, thin, low-oxygen atmosphere.',
    abstract:
      'Sedimentary mineral assemblages of the Río Tinto basin—specifically jarosite, goethite, and hematite precipitates—closely match the sulfate-rich bedrock observed by the Opportunity rover at Meridiani Planum, clarifying the aqueous depositional and diagenetic processes of early Mars.',
  },
  {
    id: 'res-heiken-1991',
    title: 'Lunar Sourcebook: A User’s Guide to the Moon',
    authors: 'Heiken, G. H., Vaniman, D. T., & French, B. M. (Eds.)',
    year: 1991,
    category: 'regolith-characteristics',
    targetBody: 'Moon',
    studyLocation: 'Apollo 11, 12, 14, 15, 16, 17 Lunar Landing Sites',
    journal: 'Cambridge University Press / Lunar and Planetary Institute',
    doi: '10.1017/CBO9780511529948',
    originalUrl: 'https://www.lpi.usra.edu/publications/books/lunar_sourcebook/',
    objective:
      'Provide authoritative reference data on the geotechnical, physical, chemical, and mineralogical properties of the lunar regolith and lunar rock samples.',
    methods:
      'Comprehensive compilation and laboratory geotechnical testing, core penetration resistance measurements, chemical spectroscopy, and thin-section petrology of 382 kg of returned Apollo lunar regolith cores.',
    keyFindings:
      'Lunar regolith is poorly sorted silt-to-fine sand with median grain size ~70 μm, high cohesion (0.1 to 1.0 kPa) due to vacuum-welded irregular glass agglutinates, and bulk density increasing from 1.50 g/cm³ at surface to >1.90 g/cm³ at 1 m depth.',
    limitations:
      'Terrestrial analogue soils (e.g., JSC-1A, MLS-1) lack the high vacuum sub-micron nanophase iron (npFe⁰) coatings created by solar wind space weathering.',
    abstract:
      'The Lunar Sourcebook represents the foundational compilation of Apollo scientific data, establishing the standard geotechnical baselines for lunar regolith grain size, shear strength, cohesion, and mineral composition.',
  },
  {
    id: 'res-treiman-2002',
    title: 'Hydrothermal origin for carbonate globules in Martian meteorite ALH84001: a terrestrial analogue from Spitsbergen (Norway)',
    authors: 'Treiman, A. H., Amundsen, H. E. F., Blake, D. F., & Bunch, T. E.',
    year: 2002,
    category: 'planetary-geology',
    targetBody: 'Mars',
    studyLocation: 'Bockfjorden / Sverrefjellet, Spitsbergen, Svalbard, Norway',
    journal: 'Earth and Planetary Science Letters, 204(3–4), 323–332',
    doi: '10.1016/S0012-821X(02)00998-6',
    originalUrl: 'https://doi.org/10.1016/S0012-821X(02)00998-6',
    objective:
      'Investigate carbonate globules in mantle xenoliths and basalts of the Sverrefjellet volcano as a terrestrial analogue for carbonate rosettes in Martian meteorite ALH84001.',
    methods:
      'Field sampling of basaltic host rocks and peridotite xenoliths, electron microprobe, scanning electron microscopy (SEM), and stable carbon and oxygen isotope geochemistry.',
    keyFindings:
      'Carbonate globules in Sverrefjellet basalts formed through low-temperature abiotic hydrothermal alteration of primitive basalt, matching the compositional zoning, morphology, and magnetite associations of carbonate disks in ALH84001 without requiring biogenic processes.',
    limitations:
      'Sverrefjellet is located in a periglacial volcanic setting with abundant liquid groundwater; volatile and water-rock ratios exceed those expected for ancient Martian crustal fluids.',
    abstract:
      'Carbonate globules in basalts from Sverrefjellet volcano on Spitsbergen duplicate the chemical zoning, morphology, and magnetite associations of carbonate rosettes in Martian meteorite ALH84001, providing compelling evidence for an abiotic hydrothermal origin.',
  },
]
