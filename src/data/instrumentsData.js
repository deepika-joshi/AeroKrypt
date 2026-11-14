/**
 * AEROKRYPT - Planetary Science Instruments & Technology Catalogue
 *
 * Educational catalogue of authentic instruments deployed or developed for
 * Mars, Moon, and planetary exploration missions.
 *
 * Categories:
 * - Spectrometers
 * - Cameras & Imaging Systems
 * - Ground-Penetrating Radar (GPR)
 * - Seismometers
 * - Drilling & Subsurface Sampling
 * - Environmental & Atmospheric Sensors
 * - Laser Altimeters & LiDAR
 */

export const INSTRUMENT_CATEGORIES = [
  { id: 'ALL', label: 'All Instruments' },
  { id: 'SPECTROMETER', label: 'Spectrometers' },
  { id: 'IMAGING', label: 'Cameras & Imaging' },
  { id: 'RADAR', label: 'Ground-Penetrating Radar' },
  { id: 'SEISMOMETER', label: 'Seismometers' },
  { id: 'DRILL', label: 'Drilling & Sampling' },
  { id: 'ENVIRONMENTAL', label: 'Environmental Sensors' },
  { id: 'ALTIMETER', label: 'Laser Altimeters & LiDAR' },
]

export const INSTRUMENTS_DATA = [
  // 1. Spectrometers
  {
    id: 'inst-supercam',
    name: 'SuperCam',
    category: 'SPECTROMETER',
    categoryLabel: 'Spectrometer Suite',
    mission: 'Mars 2020 (Perseverance Rover)',
    carrier: 'Perseverance Rover Mast',
    targetBody: 'Mars',
    agency: 'NASA / CNES / LANL / IRAP',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Actively operating on Mars inside Jezero Crater since February 2021.',
    whatItMeasures:
      'Elemental chemical composition (LIBS), mineralogy and molecular structure (Raman and Time-Resolved Fluorescence spectroscopy), and visible/infrared reflectance (VISIR 400–850 nm & 1.3–2.6 µm). Also captures acoustic shockwaves via microphone.',
    howItWorks:
      'Fires an infrared pulsed laser at rock targets up to 7 meters away, vaporizing a microscopic speck into glowing plasma. An optical telescope collects the plasma emission light and sends it through spectrometers to identify chemical elements.',
    whyResearchersUseIt:
      'Enables rapid remote geochemical reconnaissance without driving the rover to every rock. Terrestrial analogues use field-portable Raman and LIBS to benchmark mineral spectra before comparison with Mars data.',
    exampleApplication:
      'Identified altered igneous rocks, carbonate-bearing delta sediments, and hydrated silica in Jezero Crater.',
    references: [
      { title: 'Wiens et al. (2021) Space Sci. Rev. 217:4', link: 'https://doi.org/10.1007/s11214-020-00777-5' },
      { title: 'Maurice et al. (2021) Space Sci. Rev. 217:47', link: 'https://doi.org/10.1007/s11214-021-00807-w' },
    ],
  },
  {
    id: 'inst-apxs',
    name: 'Alpha Particle X-Ray Spectrometer (APXS)',
    category: 'SPECTROMETER',
    categoryLabel: 'X-Ray Spectrometer',
    mission: 'Mars Exploration Rovers (Spirit & Opportunity) / Mars Science Laboratory (Curiosity)',
    carrier: 'Curiosity & Opportunity Robotic Arm Turret',
    targetBody: 'Mars',
    agency: 'NASA / Canadian Space Agency (CSA)',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating on Curiosity in Gale Crater; historical on Spirit and Opportunity.',
    whatItMeasures:
      'Abundance of major, minor, and trace elements from sodium (Na) to bromine (Br) in rocks and soils.',
    howItWorks:
      'Uses a Curium-244 radioactive source to bombard samples with alpha particles and X-rays, inducing X-ray fluorescence emission measured by a silicon drift detector.',
    whyResearchersUseIt:
      'Provides definitive bulk elemental chemistry. Earth analogue studies at Río Tinto and volcanic terrains use portable XRF/APXS analogues to map iron-sulfate weathering sequences.',
    exampleApplication:
      'Discovered high sulfur and phosphorus concentrations in Columbia Hills and manganese oxides in Gale Crater.',
    references: [
      { title: 'Gellert et al. (2006) JGR Planets 111:E02S05', link: 'https://doi.org/10.1029/2005JE002555' },
      { title: 'Campbell et al. (2012) Space Sci. Rev. 170:519', link: 'https://doi.org/10.1007/s11214-012-9873-5' },
    ],
  },
  {
    id: 'inst-nirvss',
    name: 'Near-Infrared Volatiles Spectrometer System (NIRVSS)',
    category: 'SPECTROMETER',
    categoryLabel: 'Near-Infrared Spectrometer',
    mission: 'VIPER / Commercial Lunar Payload Services (CLPS)',
    carrier: 'Lunar Rover / Lander Underside Bracket',
    targetBody: 'Moon',
    agency: 'NASA Ames Research Center',
    operationalStatus: 'MODIFIED_DEPLOYMENT',
    statusDisclaimer: 'Originally developed for the VIPER lunar rover (VIPER vehicle cancelled July 2024; instrument reassigned to upcoming CLPS lunar flight opportunities).',
    whatItMeasures:
      'Surface and near-subsurface water ice (H2O), hydroxyl (OH), carbon dioxide (CO2), and surface mineralogy in the 1.2 to 2.4 µm spectral band, alongside surface temperatures (70–400 K).',
    howItWorks:
      'Illuminates the lunar regolith with specialized LEDs and tungsten lamps, measuring reflectance spectra through a fiber-optic spectrometer coupled with a long-wave calibration sensor.',
    whyResearchersUseIt:
      'Detects surface frost and volatile compounds in permanently shadowed lunar craters. Tested at terrestrial cryogenic analogues such as McMurdo Dry Valleys.',
    exampleApplication:
      'Mapping water-ice concentrations across permanently shadowed regions (PSRs) at the Lunar South Pole.',
    references: [
      { title: 'Roush et al. (2021) Lunar and Planetary Science Conference 52:2152', link: 'https://www.hou.usra.edu/meetings/lpsc2021/pdf/2152.pdf' },
    ],
  },
  {
    id: 'inst-crism',
    name: 'Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)',
    category: 'SPECTROMETER',
    categoryLabel: 'Orbital Hyperspectral Imager',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    carrier: 'Orbital Spacecraft Payload Bay',
    targetBody: 'Mars',
    agency: 'NASA / JHUAPL',
    operationalStatus: 'RETIRED',
    statusDisclaimer: 'Formally retired in April 2023 after 17 years of orbital operation due to cryogenic cooler depletion; archive remains the primary benchmark for Mars mineralogy.',
    whatItMeasures:
      'Visible and near-infrared reflectance spectra (362 to 3920 nm at 6.55 nm/channel) mapping surface mineralogy across 544 wavelength channels at resolutions down to 18 m/pixel.',
    howItWorks:
      'Combines a Ritchey-Chrétien telescope with dual spectrometers cooled to cryogenic temperatures, recording solar reflected light absorbed by hydrated minerals, sulfates, carbonates, and phyllosilicates.',
    whyResearchersUseIt:
      'Discovered the ancient aqueous mineral deposits that determined landing sites for Curiosity, Perseverance, and ExoMars.',
    exampleApplication:
      'Identified clay minerals and magnesium carbonates in the delta deposits of Jezero Crater.',
    references: [
      { title: 'Murchie et al. (2007) JGR Planets 112:E05S03', link: 'https://doi.org/10.1029/2006JE002682' },
      { title: 'Ehlmann et al. (2008) Science 322:1828', link: 'https://doi.org/10.1126/science.1164759' },
    ],
  },

  // 2. Cameras & Imaging Systems
  {
    id: 'inst-mastcam-z',
    name: 'Mastcam-Z',
    category: 'IMAGING',
    categoryLabel: 'Multispectral Stereo Zoom Camera',
    mission: 'Mars 2020 (Perseverance Rover)',
    carrier: 'Perseverance Remote Sensing Mast',
    targetBody: 'Mars',
    agency: 'NASA / Arizona State University / Malin Space Science Systems',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Actively imaging surface targets, rover traverse routes, and atmospheric phenomena on Mars.',
    whatItMeasures:
      'High-resolution stereoscopic color panoramas, 3D digital elevation models, multispectral reflectance in 11 science bandpass filters (400–1000 nm), and video.',
    howItWorks:
      'Dual matched zoom cameras with variable focal length (28–100 mm, 3.6:1 zoom ratio) spaced 24.2 cm apart on the mast provide true binocular stereo vision with up to 1600x1200 pixel CCD resolution.',
    whyResearchersUseIt:
      'Assesses rock textures, sedimentary bedding, grain-size sorting, and rover trafficability. Earth analogue drone and mast-mounted surveys calibrate its spectral filters against known desert breccia.',
    exampleApplication:
      'Resolved cross-bedding and boulder-conglomerate delta stratigraphy at Kodiak Butte in Jezero Crater.',
    references: [
      { title: 'Bell et al. (2021) Space Sci. Rev. 217:24', link: 'https://doi.org/10.1007/s11214-020-00755-x' },
    ],
  },
  {
    id: 'inst-lroc-nac',
    name: 'Lunar Reconnaissance Orbiter Camera — Narrow Angle Camera (LROC NAC)',
    category: 'IMAGING',
    categoryLabel: 'Orbital High-Resolution Imager',
    mission: 'Lunar Reconnaissance Orbiter (LRO)',
    carrier: 'LRO Orbital Instrument Deck',
    targetBody: 'Moon',
    agency: 'NASA / Arizona State University',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating continuously in lunar orbit since June 2009.',
    whatItMeasures:
      'Sub-meter panchromatic orbital imagery of the lunar surface at spatial scales down to 0.5 meters per pixel.',
    howItWorks:
      'Two identical narrow-angle Ritchey-Chrétien line-scan pushbroom cameras sweep across lunar swaths, detecting reflected sunlight across a 5.7° cross-track field of view.',
    whyResearchersUseIt:
      'Essential for identifying landing hazards, lunar lava tube skylights, boulders, and Apollo historical hardware. Benchmark dataset used in AEROKRYPT Moon site evaluations.',
    exampleApplication:
      'Discovered the Marius Hills, Mare Tranquillitatis, and Mare Ingenii volcanic pit craters (lava tube skylights).',
    references: [
      { title: 'Robinson et al. (2010) Space Sci. Rev. 150:81', link: 'https://doi.org/10.1007/s11214-010-9634-2' },
    ],
  },
  {
    id: 'inst-cassis',
    name: 'Colour and Stereo Surface Imaging System (CaSSIS)',
    category: 'IMAGING',
    categoryLabel: 'High-Resolution Stereo Imager',
    mission: 'ExoMars Trace Gas Orbiter (TGO)',
    carrier: 'TGO Orbital Platform',
    targetBody: 'Mars',
    agency: 'ESA / University of Bern',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating in Mars orbit since April 2018.',
    whatItMeasures:
      'High-resolution (4.5 m/pixel) dynamic colour stereo pairs in four colour bands (BLU, PAN, RED, NIR) optimized for slope morphology and surface changes.',
    howItWorks:
      'Uses an off-axis four-mirror telescope mounted on a rotation mechanism that rotates 180° mid-track to photograph the same patch of ground from two angles for immediate stereo reconstruction.',
    whyResearchersUseIt:
      'Monitors recurring slope lineae (RSL), dust devil tracks, and seasonal polar frost dynamics.',
    exampleApplication:
      'Mapped active slope gullies and seasonal carbon dioxide geysers in the Martian southern highlands.',
    references: [
      { title: 'Thomas et al. (2017) Space Sci. Rev. 212:1897', link: 'https://doi.org/10.1007/s11214-017-0421-1' },
    ],
  },

  // 3. Ground-Penetrating Radar (GPR)
  {
    id: 'inst-rimfax',
    name: 'Radar Imager for Mars\' Subsurface Experiment (RIMFAX)',
    category: 'RADAR',
    categoryLabel: 'Ultra-Wideband Ground-Penetrating Radar',
    mission: 'Mars 2020 (Perseverance Rover)',
    carrier: 'Perseverance Lower Rear Chassis',
    targetBody: 'Mars',
    agency: 'NASA / Forsvarets forskningsinstitutt (FFI, Norway)',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Actively sounding the Martian subsurface along Perseverance’s traverse path.',
    whatItMeasures:
      'Dielectric permittivity contrasts, subsurface geological strata, buried crater floors, and structural discontinuities down to depths of >10 meters with vertical resolution of 15–30 cm.',
    howItWorks:
      'Transmits frequency-modulated continuous wave (FMCW) radar pulses from 150 MHz to 1.2 GHz through a downward-directed bowtie antenna mounted on the rover’s rear.',
    whyResearchersUseIt:
      'Reveals the hidden geological layering beneath rover wheels. Analogue campaigns in Svalbard and Yungay (Atacama) tested antenna couplings in desiccated soil and permafrost.',
    exampleApplication:
      'Revealed dipping sedimentary layers beneath the delta front and ancient crater floor basalts in Jezero Crater.',
    references: [
      { title: 'Hamran et al. (2020) Space Sci. Rev. 216:128', link: 'https://doi.org/10.1007/s11214-020-00740-4' },
      { title: 'Hamran et al. (2022) Science 377:945', link: 'https://doi.org/10.1126/science.abp3564' },
    ],
  },
  {
    id: 'inst-lpr',
    name: 'Lunar Penetrating Radar (LPR)',
    category: 'RADAR',
    categoryLabel: 'Dual-Frequency Lunar Radar',
    mission: 'Chang\'e-4 (Yutu-2 Rover) & Chang\'e-5',
    carrier: 'Yutu-2 Underside Chassis',
    targetBody: 'Moon',
    agency: 'CNSA (China National Space Administration)',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating on the lunar farside in Von Kármán crater (Yutu-2).',
    whatItMeasures:
      'Deep basalt flows and regolith thickness down to depths of ~40 meters (500 MHz channel) and hundreds of meters (60 MHz channel).',
    howItWorks:
      'Emits high-voltage nanosecond radar pulses into lunar regolith through two monopole dipoles and a high-frequency dipole array mounted on the rover body.',
    whyResearchersUseIt:
      'Directly measures the thickness of pulverized lunar impact regolith and subsurface ejecta deposits.',
    exampleApplication:
      'Discovered a 12-meter-thick fine regolith layer overlying multi-layered impact ejecta on the lunar farside.',
    references: [
      { title: 'Li et al. (2020) Science Advances 6:eaay4935', link: 'https://doi.org/10.1126/sciadv.aay4935' },
    ],
  },
  {
    id: 'inst-sharad',
    name: 'Shallow Radar (SHARAD)',
    category: 'RADAR',
    categoryLabel: 'Orbital Sounding Radar',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    carrier: 'MRO Spacecraft Nadir Boom',
    targetBody: 'Mars',
    agency: 'ASI (Italian Space Agency) / NASA JPL',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating in Mars orbit since 2006.',
    whatItMeasures:
      'Large-scale subsurface dielectric boundaries, water ice reservoirs, and polar layered deposits down to depths of 1 kilometer at 15-meter vertical resolution in pure ice.',
    howItWorks:
      'Transmits a 15–25 MHz chirped pulse through a 10-meter dipole antenna and records echo return delays from underground dielectric interfaces.',
    whyResearchersUseIt:
      'Maps subsurface glaciers and buried ice sheets in Martian mid-latitudes, guiding future human landing site selections.',
    exampleApplication:
      'Discovered massive sheets of buried glacial ice preserved under rocky debris aprons in Deuteronilus Mensae.',
    references: [
      { title: 'Seu et al. (2007) JGR Planets 112:E05S05', link: 'https://doi.org/10.1029/2006JE002745' },
      { title: 'Holt et al. (2008) Science 322:1235', link: 'https://doi.org/10.1126/science.1164246' },
    ],
  },

  // 4. Seismometers
  {
    id: 'inst-seis',
    name: 'Seismic Experiment for Interior Structure (SEIS)',
    category: 'SEISMOMETER',
    categoryLabel: 'Ultra-Broadband Planetary Seismometer',
    mission: 'InSight Mars Lander',
    carrier: 'Surface-Deployed Sensor with Wind & Thermal Shield (WTS)',
    targetBody: 'Mars',
    agency: 'CNES / IPGP / NASA / ETH Zurich / Max Planck',
    operationalStatus: 'RETIRED',
    statusDisclaimer: 'Mission concluded in December 2022 after dust accumulation on solar arrays; recorded over 1,300 marsquakes that mapped the core, mantle, and crust of Mars.',
    whatItMeasures:
      'Ground vibrations and seismic waves down to fractions of the diameter of a hydrogen atom across frequencies from 0.01 Hz to 50 Hz.',
    howItWorks:
      'Features three ultra-sensitive oblique pendulum sensors enclosed in an evacuated sphere, combined with three short-period silicon micro-machined sensors deployed directly on the Martian regolith.',
    whyResearchersUseIt:
      'Determined the thickness of the Martian crust (20–40 km), the mantle composition, and confirmed a liquid iron-nickel core with a radius of ~1,830 km.',
    exampleApplication:
      'Recorded a magnitude 4.7 marsquake in May 2022 that resonated through the crust for over 10 hours.',
    references: [
      { title: 'Lognonné et al. (2019) Space Sci. Rev. 215:12', link: 'https://doi.org/10.1007/s11214-018-0574-6' },
      { title: 'Banerdt et al. (2020) Nature Geoscience 13:183', link: 'https://doi.org/10.1038/s41561-020-0544-y' },
    ],
  },
  {
    id: 'inst-apollo-pse',
    name: 'Apollo Passive Seismic Experiment (PSE)',
    category: 'SEISMOMETER',
    categoryLabel: 'Historical Lunar Surface Seismometer',
    mission: 'Apollo 11, 12, 14, 15, 16 (ALSEP Package)',
    carrier: 'Astronaut-Deployed Lunar Surface Station',
    targetBody: 'Moon',
    agency: 'NASA',
    operationalStatus: 'HISTORICAL',
    statusDisclaimer: 'Operated on the lunar surface between 1969 and 1977 when the ALSEP ground network was officially powered down.',
    whatItMeasures:
      'Deep moonquakes (tidal stresses), shallow moonquakes (tectonic faults), meteorite impacts, and artificial impacts from spent rocket stages.',
    howItWorks:
      'Three long-period seismometers and one short-period vertical component sensor powered by a SNAP-27 radioisotope thermoelectric generator (RTG).',
    whyResearchersUseIt:
      'Demonstrated that the Moon is not geologically dead and revealed that lunar seismic waves scatter intensely in the dry, shattered megaregolith, ringing for hours.',
    exampleApplication:
      'Recorded artificial impacts from Saturn V S-IVB stages to calibrate the sound velocity profile through the lunar crust.',
    references: [
      { title: 'Latham et al. (1970) Science 167:455', link: 'https://doi.org/10.1126/science.167.3918.455' },
      { title: 'Nakamura et al. (1982) JGR 87:A117', link: 'https://doi.org/10.1029/JB087iS01p0A117' },
    ],
  },

  // 5. Drilling & Subsurface Sampling
  {
    id: 'inst-trident',
    name: 'The Regolith and Ice Drill for Exploring New Terrains (TRIDENT)',
    category: 'DRILL',
    categoryLabel: '1-Meter Percussive Rotary Cryo-Drill',
    mission: 'VIPER / PRIME-1 (CLPS IM-2)',
    carrier: 'Lunar Rover / Lander Drill Mast',
    targetBody: 'Moon',
    agency: 'NASA / Honeybee Robotics',
    operationalStatus: 'ACTIVE_DEVELOPMENT_FLIGHT_READY',
    statusDisclaimer: 'Completed space qualification; scheduled for lunar polar landing on Intuitive Machines IM-2 (PRIME-1) and upcoming CLPS missions.',
    whatItMeasures:
      'Physical regolith strength, torque-resistance profiles, subsurface temperatures down to 1-meter depth, and extracts intact 10-cm bite samples for volatile analysis.',
    howItWorks:
      'A rotary percussive drill with a carbide chisel bit and helical flutes that bites 10 cm at a time, retracts to the surface, and deposits regolith onto an inspection tray.',
    whyResearchersUseIt:
      'Designed specifically to penetrate cryogenically frozen regolith and ice-cemented lunar soils at temperatures down to 40 Kelvin without melting volatile ice.',
    exampleApplication:
      'Extracting ice-bearing samples from lunar permanently shadowed craters at the South Pole for NIRVSS and MSolo spectrometers.',
    references: [
      { title: 'Zacny et al. (2020) ASCEND 2020:4178', link: 'https://doi.org/10.2514/6.2020-4178' },
    ],
  },
  {
    id: 'inst-perseverance-corer',
    name: 'Perseverance Rotary Percussive Coring Drill',
    category: 'DRILL',
    categoryLabel: 'Sample Collection & Caching Drill',
    mission: 'Mars 2020 (Perseverance Rover)',
    carrier: 'Perseverance Robotic Arm Turret',
    targetBody: 'Mars',
    agency: 'NASA JPL',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Actively drilling, hermetically sealing, and caching Mars rock cores for future return to Earth.',
    whatItMeasures:
      'Rock mechanical drillability, torque/feed rates, and extracts cylindrical core samples (13 mm diameter, ~60 mm length) hermetically sealed in titanium tubes.',
    howItWorks:
      'Rotary percussive coring mechanism equipped with hollow coring bits and an abrasion bit, integrated with the internal Adaptive Caching Assembly (ACA) for tube hermetic sealing.',
    whyResearchersUseIt:
      'Collects the first geologically context-rich rock and regolith samples from Mars intended for future return to Earth labs.',
    exampleApplication:
      'Successfully drilled and cached sedimentary, mudstone, and volcanic rock cores across Jezero Crater and its ancient river delta.',
    references: [
      { title: 'Moeller et al. (2021) Space Sci. Rev. 217:5', link: 'https://doi.org/10.1007/s11214-020-00783-7' },
    ],
  },
  {
    id: 'inst-hp3',
    name: 'Heat Flow and Physical Properties Package (HP³)',
    category: 'DRILL',
    categoryLabel: 'Subsurface Heat Probe & Self-Hammering Mole',
    mission: 'InSight Mars Lander',
    carrier: 'Surface-Deployed Tethered Penetrator',
    targetBody: 'Mars',
    agency: 'DLR (German Aerospace Center) / NASA',
    operationalStatus: 'RETIRED',
    statusDisclaimer: 'Operations ceased in January 2021 after unexpected cohesive soil ("duricrust") limited penetration depth to ~40 cm instead of the intended 3–5 meters.',
    whatItMeasures:
      'Thermal conductivity of Martian regolith and the interior geothermal heat flux radiating from the planet’s core.',
    howItWorks:
      'A 40-cm mechanical self-hammering projectile ("The Mole") driven by an internal spring and motor, trailing a sensor-equipped ribbon tether with 14 platinum resistance temperature detectors.',
    whyResearchersUseIt:
      'Highlighted the critical importance of soil mechanical coherence in planetary drilling. Terrestrial analogue tests did not fully predict the high cohesion of Martian duricrust.',
    exampleApplication:
      'Measured thermal properties of the uppermost 40 cm of regolith at Elysium Planitia.',
    references: [
      { title: 'Spohn et al. (2018) Space Sci. Rev. 214:96', link: 'https://doi.org/10.1007/s11214-018-0531-4' },
      { title: 'Spohn et al. (2022) Advances in Space Research 69:3485', link: 'https://doi.org/10.1016/j.asr.2022.02.009' },
    ],
  },

  // 6. Environmental & Atmospheric Sensors
  {
    id: 'inst-meda',
    name: 'Mars Environmental Dynamics Analyzer (MEDA)',
    category: 'ENVIRONMENTAL',
    categoryLabel: 'Planetary Weather Station',
    mission: 'Mars 2020 (Perseverance Rover)',
    carrier: 'Perseverance Mast, Deck, and Chassis',
    targetBody: 'Mars',
    agency: 'CAB (Centro de Astrobiología, Spain) / INTA / NASA',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Actively recording daily Martian meteorology inside Jezero Crater.',
    whatItMeasures:
      'Wind speed and direction, atmospheric pressure, relative humidity, air and ground temperatures, solar ultraviolet and infrared radiation, and dust particle optical depth.',
    howItWorks:
      'A suite of five sensor packages: two wind sensor booms with thermal anemometers, a capacitive barometer, five air temperature sensors, an infrared ground temperature sensor (TIRS), and upward-looking photodetectors (RDS).',
    whyResearchersUseIt:
      'Establishes the surface meteorological baseline required for helicopter flights (Ingenuity) and human exploration planning.',
    exampleApplication:
      'Recorded passage of hundreds of dust devils in Jezero Crater, tracking pressure drops up to 9 Pascals.',
    references: [
      { title: 'Rodriguez-Manfredi et al. (2021) Space Sci. Rev. 217:48', link: 'https://doi.org/10.1007/s11214-021-00816-9' },
    ],
  },
  {
    id: 'inst-rems',
    name: 'Rover Environmental Monitoring Station (REMS)',
    category: 'ENVIRONMENTAL',
    categoryLabel: 'Planetary Weather Station',
    mission: 'Mars Science Laboratory (Curiosity Rover)',
    carrier: 'Curiosity Remote Sensing Mast and Chassis',
    targetBody: 'Mars',
    agency: 'CAB (Centro de Astrobiología, Spain) / NASA',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating continuously on Mars in Gale Crater since August 2012 (>4,000 sols).',
    whatItMeasures:
      'Atmospheric pressure, ambient temperature, ground brightness temperature, wind speed and direction, relative humidity, and UV radiation flux.',
    howItWorks:
      'Micro-fabricated hot-film anemometer booms mounted 120° apart on the rover mast, coupled with silicon pressure sensors and capacitive humidity sensors.',
    whyResearchersUseIt:
      'Provides a multi-year climate record of seasonal barometric cycles caused by carbon dioxide freezing and sublimating at the Martian poles.',
    exampleApplication:
      'Documented daily diurnal pressure swings of ~100 Pa and cyclic seasonal atmospheric pressure variations in Gale Crater.',
    references: [
      { title: 'Gómez-Elvira et al. (2012) Space Sci. Rev. 170:583', link: 'https://doi.org/10.1007/s11214-012-9921-1' },
    ],
  },

  // 7. Laser Altimeters & LiDAR
  {
    id: 'inst-mola',
    name: 'Mars Orbiter Laser Altimeter (MOLA)',
    category: 'ALTIMETER',
    categoryLabel: 'Orbital Laser Altimeter',
    mission: 'Mars Global Surveyor (MGS)',
    carrier: 'MGS Orbital Nadir Deck',
    targetBody: 'Mars',
    agency: 'NASA Goddard Space Flight Center',
    operationalStatus: 'HISTORICAL',
    statusDisclaimer: 'Completed primary science mapping in 2001; MOLA MEGDR gridded altimetry dataset remains the foundational global topographic datum for Mars geodesy.',
    whatItMeasures:
      'High-precision planetary surface elevation, global topography, surface slope, and 1064 nm surface reflectance.',
    howItWorks:
      'Emitted 10-nanosecond pulses from a Q-switched Nd:YAG laser at 10 Hz toward Mars. A 50-cm gold-coated beryllium Cassegrain telescope collected the reflected photon returns, timing the round-trip travel with ~37.5 cm precision.',
    whyResearchersUseIt:
      'Produced the first definitive global topographic map of Mars and established the MOLA Areoid reference datum (gravitational equipotential surface) used in AEROKRYPT evaluations.',
    exampleApplication:
      'Mapped the Martian global dichotomy, the 8-km deep Hellas impact basin, and the 21-km summit of Olympus Mons.',
    references: [
      { title: 'Smith et al. (2001) JGR Planets 106:23689', link: 'https://doi.org/10.1029/2000JE001364' },
      { title: 'Zuber et al. (1998) Science 282:2053', link: 'https://doi.org/10.1126/science.282.5396.2053' },
    ],
  },
  {
    id: 'inst-lola',
    name: 'Lunar Orbiter Laser Altimeter (LOLA)',
    category: 'ALTIMETER',
    categoryLabel: 'Multi-Beam Orbital Laser Altimeter',
    mission: 'Lunar Reconnaissance Orbiter (LRO)',
    carrier: 'LRO Orbital Instrument Deck',
    targetBody: 'Moon',
    agency: 'NASA Goddard Space Flight Center',
    operationalStatus: 'OPERATIONAL',
    statusDisclaimer: 'Operating continuously in lunar orbit since 2009; has acquired over 4 billion topographic soundings.',
    whatItMeasures:
      'Precise surface elevation, local slopes, surface roughness at 5-meter to 50-meter scales, and 1064 nm normal albedo across the lunar globe.',
    howItWorks:
      'Splits a single laser pulse into five diffractive beams arranged in a cross pattern. Measures the flight time of all five beams simultaneously, recording elevation and bidirectional slopes in a single pass.',
    whyResearchersUseIt:
      'Identified permanently shadowed craters with ultra-cold thermal regimes at the lunar poles and evaluated landing approach slopes for Artemis missions.',
    exampleApplication:
      'Characterized slopes and boulders inside Shackleton and Faustini craters at the Lunar South Pole.',
    references: [
      { title: 'Smith et al. (2010) Space Sci. Rev. 150:209', link: 'https://doi.org/10.1007/s11214-009-9512-y' },
      { title: 'Mazarico et al. (2011) Icarus 211:1066', link: 'https://doi.org/10.1016/j.icarus.2010.10.030' },
    ],
  },
  {
    id: 'inst-gala',
    name: 'GANYMEDE Laser Altimeter (GALA)',
    category: 'ALTIMETER',
    categoryLabel: 'Deep Space Laser Altimeter',
    mission: 'JUICE (JUpiter ICy moons Explorer)',
    carrier: 'JUICE Spacecraft Optical Bench',
    targetBody: 'Ganymede / Jovian Icy Moons',
    agency: 'ESA / DLR (German Aerospace Center) / JAXA',
    operationalStatus: 'IN_TRANSIT',
    statusDisclaimer: 'Launched April 2023; in cruise to Jupiter system, arrival scheduled for 2031.',
    whatItMeasures:
      'Topographic elevation, ice shell tidal deformation (measuring the amplitude of the tidal bulge to confirm an internal liquid water ocean), and surface roughness of icy moons.',
    howItWorks:
      'Fires 50-mJ pulsed laser shots at 30 Hz from a 500-km orbit around Ganymede, measuring echo return time with a 27-cm telescope receiver and avalanche photodiode.',
    whyResearchersUseIt:
      'Provides the geodetic foundation to measure whether Ganymede’s ice shell flexes over a liquid subsurface ocean.',
    exampleApplication:
      'Will map tectonic grooved terrain (sulci) and impact crater morphology across Ganymede and Callisto.',
    references: [
      { title: 'Hussmann et al. (2019) EPSC-DPS Joint Meeting 2019:803', link: 'https://meetingorganizer.copernicus.org/EPSC-DPS2019/EPSC-DPS2019-803-1.pdf' },
    ],
  },
]
