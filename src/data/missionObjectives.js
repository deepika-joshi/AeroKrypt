/**
 * TERRALAB - Mission Objectives & Planetary Activity Requirements
 * 
 * Verifiable mission activities and environmental parameter benchmarks
 * for Moon and Mars testing campaigns.
 * Sources: NASA Artemis Concept of Operations, NASA Mars 2020 Science Strategy,
 * NASA Analogue Missions Program.
 */

export const MISSION_OBJECTIVES = [
  {
    id: 'rover-mobility',
    title: 'Autonomous Rover Traverse & Trafficability',
    targetBodies: ['Moon', 'Mars'],
    primaryTarget: 'Mars',
    description: 'Evaluation of wheel torque, sinkage, slip, and hazard avoidance over unpaved, high-slip loose regolith and boulder-strewn slopes.',
    benchmarkAnalogy: 'Lunar South Pole craggy terrain & Martian ripple fields (Gale Crater / Jezero Delta)',
    requiredLithology: ['Basalt', 'Volcanic Ash', 'Loose Regolith', 'Sand Dune'],
    preferredSlopes: '5° to 25°',
    maxSlopeThreshold: 30,
    criticalParameters: [
      { name: 'Substrate Cohesion', importance: 'HIGH', note: 'Uncemented particulate matter simulating low-cohesion dust/sand' },
      { name: 'Slope Variance', importance: 'CRITICAL', note: 'Complex slope gradients to test traction and tipping thresholds' },
      { name: 'Rock Abundance', importance: 'HIGH', note: 'Distribution of meter-scale obstacles for autonomous obstacle avoidance' },
    ],
    planetaryDivergenceNote: 'Earth surface gravity (9.81 m/s²) increases vehicle normal force compared to Mars (3.72 m/s²) and Moon (1.62 m/s²); wheel slip models must scale for gravitational load differences.',
  },
  {
    id: 'subsurface-coring',
    title: 'Subsurface Cryogenic Core Drilling & Sample Caching',
    targetBodies: ['Mars', 'Moon'],
    primaryTarget: 'Mars',
    description: 'Drilling into cryo-cemented or competent hard-rock matrices (0.5m to 2.0m depth) without cross-contamination or thermal disruption of volatile ice.',
    benchmarkAnalogy: 'Mars polar permafrost ground (Phoenix lander) & Lunar permanently shadowed craters (PSR)',
    requiredLithology: ['Ice-Cemented Permafrost', 'Dense Basalt', 'Carbonate Breccia'],
    preferredSlopes: '0° to 10° (Stable Flat Surface)',
    maxSlopeThreshold: 15,
    criticalParameters: [
      { name: 'Subsurface Temperature', importance: 'CRITICAL', note: 'Sub-zero ground temperatures to prevent premature melting during drill bite' },
      { name: 'Rock Hardness (Mohs)', importance: 'HIGH', note: 'Compressive strength >= 100 MPa simulating intact basalt or impact breccia' },
      { name: 'Organic Cleanliness', importance: 'CRITICAL', note: 'Extremely low environmental biomass to validate sterile containment tools' },
    ],
    planetaryDivergenceNote: 'Drilling on Earth occurs at 101.3 kPa atmospheric pressure; sublimation mechanics of volatile ices differ fundamentally in vacuum (Moon) or 0.6 kPa CO2 (Mars).',
  },
  {
    id: 'in-situ-spectroscopy',
    title: 'In-Situ Raman & VIS-NIR Spectroscopic Calibration',
    targetBodies: ['Mars', 'Moon'],
    primaryTarget: 'Mars',
    description: 'Benchmarking handheld and mast-mounted reflectance spectrometers, LIBS, and Raman instruments against planetary-relevant secondary minerals.',
    benchmarkAnalogy: 'Meridiani Planum jarosite beds, Jezero crater carbonates, and Lunar highland anorthosites',
    requiredLithology: ['Jarosite', 'Iron Oxides', 'Gypsum', 'Tholeiitic Basalt', 'Impact Breccia'],
    preferredSlopes: 'Any (0° to 35°)',
    maxSlopeThreshold: 45,
    criticalParameters: [
      { name: 'Mineralogical Fidelity', importance: 'CRITICAL', note: 'Natural precipitation of sulfates, phyllosilicates, or olivine' },
      { name: 'Solar UV Background', importance: 'MEDIUM', note: 'High ambient UV flux to verify optical signal-to-noise ratios' },
      { name: 'Weathering Patina', importance: 'HIGH', note: 'Natural rock varnish and desert crust coatings matching Mars orbital spectral signatures' },
    ],
    planetaryDivergenceNote: 'Atmospheric optical absorption and Rayleigh scattering on Earth require spectral atmospheric correction routines absent in the Lunar vacuum.',
  },
  {
    id: 'lava-tube-exploration',
    title: 'Subterranean Lava Tube Exploration & Structural Viability',
    targetBodies: ['Moon', 'Mars'],
    primaryTarget: 'Moon',
    requiresLavaTubes: true,
    description: 'Robotic cave ingress, LiDAR scanning of intact subterranean basaltic vaults, and evaluation of lava tubes as natural radiation and thermal shelters. NOTE: Requires intact subterranean pyroducts; surface basalt alone is insufficient.',
    benchmarkAnalogy: 'Marius Hills pit crater (Moon) & Arsia Mons volcanic collapse pits (Mars)',
    requiredLithology: ['Subterranean Basaltic Tube Vaults', 'Tholeiitic Basalt'],
    requiredMorphology: ['Subterranean Pyroduct Conduit', 'Skylight Collapse Pits'],
    preferredSlopes: 'Subterranean Cavern (Variable Pit Entrances)',
    maxSlopeThreshold: 60,
    criticalParameters: [
      { name: 'Intact Roof Stability', importance: 'CRITICAL', note: 'Stable basaltic roof thicknesses supporting subterranean exploration' },
      { name: 'Internal Geometry', importance: 'HIGH', note: 'Minimum 5m diameter subterranean tube passages for robotic ingress' },
      { name: 'Thermal Buffering', importance: 'HIGH', note: 'Demonstrated constant subterranean temperature despite external diurnal swings' },
    ],
    planetaryDivergenceNote: 'Earth lava tubes are significantly smaller in diameter (typically 5–30m) than Lunar lava tubes (hypothesized up to 500m+) due to Earth higher surface gravity and lower magma flow rates (Sauro et al. 2020).',
  },
  {
    id: 'extremophile-astrobiology',
    title: 'Astrobiology & Extremophile Biosignature Detection',
    targetBodies: ['Mars', 'Europa'],
    primaryTarget: 'Mars',
    description: 'Testing life-detection instruments and bio-molecular sequencing protocols in extreme hyper-arid, high-radiation, and low-biomass terrestrial limits.',
    benchmarkAnalogy: 'Mars Noachian lacustrine sediments & hyper-arid Amazonian desiccated paleolakes',
    requiredLithology: ['Halite Crust', 'Nitrate Playa', 'Perchlorate Soil', 'Hydrothermal Carbonates'],
    preferredSlopes: '0° to 15°',
    maxSlopeThreshold: 20,
    criticalParameters: [
      { name: 'Hyper-Aridity', importance: 'CRITICAL', note: 'Rainfall < 2 mm/year with soil relative humidity frequently below 10%' },
      { name: 'Perchlorate Chemistry', importance: 'HIGH', note: 'Natural perchlorates (ClO4-) replicating Phoenix/Curiosity wet-chemistry results' },
      { name: 'UV Irradiation', importance: 'HIGH', note: 'High incident UV flux driving surface organic degradation' },
    ],
    planetaryDivergenceNote: 'Earth atmosphere shields cosmic and galactic cosmic rays (GCRs); surface solar UV-C is absorbed by the ozone layer, which is absent on Mars.',
  },
]

