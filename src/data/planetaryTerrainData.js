/**
 * AEROKRYPT - Authentic Planetary Terrain Datasets (Mars & Moon)
 * 
 * Sources:
 * - NASA Planetary Data System (PDS) Geosciences Node
 * - Mars Global Surveyor (MGS) - Mars Orbiter Laser Altimeter (MOLA) MEGDR L3 (128 px/deg)
 * - Lunar Reconnaissance Orbiter (LRO) - Lunar Orbiter Laser Altimeter (LOLA) GDR (64/128 px/deg)
 * - High Resolution Stereo Camera (HRSC) - Mars Express (ESA)
 * - Lunar Reconnaissance Orbiter Camera (LROC) NAC DTMs
 * 
 * Coordinate Reference Systems (CRS):
 * - Mars: IAU 2000 Planetocentric Sphere (R = 3,396.19 km), MOLA Gravitational Equipotential Areoid Datum (U₀ = 12,637,273 m²/s²; distinct from historical 610 Pa Viking datum)
 * - Moon: IAU 2000 Mean Lunar Sphere (R = 1,737.40 km), LOLA Reference Sphere Datum
 * 
 * NOTE: Planetary elevations are referenced to planetary gravimetric/spherical datums,
 * NOT Earth Mean Sea Level or WGS 84 ellipsoid. Local relief, slopes, and roughness
 * must be compared parameter-wise rather than raw absolute geodetic elevation.
 */

export const PLANETARY_TERRAIN_DATASETS = [
  // --------------------------------------------------------------------------
  // MARS TERRAIN DATASETS (NASA MOLA / ESA HRSC)
  // --------------------------------------------------------------------------
  {
    id: 'mars-jezero-delta',
    targetBody: 'Mars',
    name: 'Jezero Crater Delta & Lacustrine Plain',
    region: 'Syrtis Major Quadrangle / Nili Fossae Region',
    centerCoordinates: '18.38°N, 77.58°E',
    boundingBox: {
      north: '18.85°N',
      south: '18.15°N',
      west: '77.20°E',
      east: '77.95°E',
    },
    coverageAreaKm2: '1,250 km²',
    primaryLandform: 'Fluvial Delta Fan & Lacustrine Basin Floor',
    morphologyType: 'Stratified Sedimentary Delta & Crater Basal Plain',
    geologicalEpoch: 'Late Noachian / Early Hesperian (~3.8 to ~3.5 Ga)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / MOLA_128_18N077E',
    sourceAgency: 'NASA PDS Geosciences Node / USGS Astrogeology',
    sourceUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/',
    doi: '10.1029/2001JE001826',
    datumDescription: 'Mars MOLA Areoid (Gravitational equipotential surface U₀ = 12,637,273 m²/s²; distinct from historical 610 Pa pressure surface)',
    coordinateSystem: 'IAU 2000 Mars Planetocentric (East Longitude 0° to 360°)',
    resolution: '463 m/pixel (128 pixels/degree at equator; HRSC local sub-grid 50 m/pixel)',
    
    // Topographic & Surface Roughness Parameters (Audited MOLA/HRSC)
    elevation: {
      baseElevationM: -2530, // Relative to MOLA areoid
      minM: -2680,
      maxM: -2150,
      localReliefM: 530,
      unit: 'm',
      label: '-2,530 m (Relief: 530 m delta scarps to crater floor)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 0.5,
      maxDeg: 28.0,
      typicalDeg: 3.8,
      deltaScarpDeg: 22.0,
      label: '0.5° (basin floor) to 22.0° (delta scarp front)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 68,     // % of area
        moderate5to15Deg: 24,
        steep15to30Deg: 8,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 4.2,      // Root-mean-square slope at 0.5 km baseline
      hurstExponent: 0.72,   // Self-affine fractality (Hurst parameter)
      medianRoughnessM: 0.85,// Vertical height variation at 10m scale
      rockAbundanceFraction: 0.12, // ~12% area covered by meter-scale boulders
      unit: 'm',
      label: 'Moderate roughness (RMS 4.2°, 12% rock abundance, stratified delta benches)',
    },
    lithology: ['Smectite Clay', 'Mg-Carbonate', 'Olivine Sand', 'Impact Breccia', 'Sulfate Silt'],
    analogousEarthSites: ['atacama-yungay', 'rio-tinto-basin', 'svalbard-bockfjorden'],
    scientificSignificance:
      'Landing site of NASA Mars 2020 Perseverance rover. Features an ancient river delta that deposited clay minerals and carbonates capable of preserving microbial biosignatures.',
  },
  {
    id: 'mars-gale-mount-sharp',
    targetBody: 'Mars',
    name: 'Gale Crater & Aeolis Mons (Mount Sharp)',
    region: 'Aeolis Quadrangle / Elysium Basin Transition',
    centerCoordinates: '5.37°S, 137.81°E',
    boundingBox: {
      north: '4.80°S',
      south: '5.90°S',
      west: '137.10°E',
      east: '138.40°E',
    },
    coverageAreaKm2: '4,500 km²',
    primaryLandform: 'Central Mound Sedimentary Butte & Lacustrine Terrace',
    morphologyType: 'Layered Sulfate-Hematite Butte & Rubble Plains',
    geologicalEpoch: 'Hesperian to Early Amazonian (~3.6 to ~3.0 Ga)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / MOLA_128_05S137E',
    sourceAgency: 'NASA PDS Geosciences Node / MSL Science Team',
    sourceUrl: 'https://pds-geosciences.wustl.edu/msl/msl-m-mola-3-rdr-v1/',
    doi: '10.1126/science.1235158',
    datumDescription: 'Mars MOLA Areoid',
    coordinateSystem: 'IAU 2000 Mars Planetocentric',
    resolution: '463 m/pixel (MOLA 128 px/deg; HiRISE local DEM 1.0 m/pixel)',
    
    elevation: {
      baseElevationM: -4450, // Floor of crater
      minM: -4520,
      maxM: +550,           // Peak of Aeolis Mons
      localReliefM: 5070,
      unit: 'm',
      label: '-4,450 m (Floor) to +550 m (Mount Sharp Peak; Relief: 5,070 m)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 1.0,
      maxDeg: 32.0,
      typicalDeg: 7.5,
      label: '1.0° (Bradbury playa floor) to 32.0° (Gediz Vallis ridge)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 45,
        moderate5to15Deg: 38,
        steep15to30Deg: 17,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 6.8,
      hurstExponent: 0.65,
      medianRoughnessM: 1.45,
      rockAbundanceFraction: 0.18,
      unit: 'm',
      label: 'High roughness (RMS 6.8°, mudstone washboard ridges and inverted channels)',
    },
    lithology: ['Hematite Clay', 'Mg-Sulfate (Kieserite)', 'Basaltic Sand Dune', 'Pebble Conglomerate'],
    analogousEarthSites: ['rio-tinto-basin', 'atacama-yungay', 'haughton-crater'],
    scientificSignificance:
      'Traverse site of NASA Curiosity rover. Sequences of fluvio-lacustrine mudstones grading into sulfate-bearing strata recording the global drying of Mars.',
  },
  {
    id: 'mars-meridiani-planum',
    targetBody: 'Mars',
    name: 'Meridiani Planum Sulfate Sandstone Plains',
    region: 'Sinus Sabaeus / Margaritifer Terra Quadrangle',
    centerCoordinates: '0.20°S, 357.50°E',
    boundingBox: {
      north: '1.00°N',
      south: '1.50°S',
      west: '356.00°E',
      east: '359.00°E',
    },
    coverageAreaKm2: '8,200 km²',
    primaryLandform: 'Acidic Sulfate Sandstone Playa & Ripple Plains',
    morphologyType: 'Hyper-Flat Hematite-Spherule Sandstone Outcrop',
    geologicalEpoch: 'Late Noachian / Early Hesperian (~3.7 Ga)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / MOLA_128_00N358E',
    sourceAgency: 'NASA PDS Geosciences Node / MER Science Team',
    sourceUrl: 'https://pds-geosciences.wustl.edu/missions/mer/',
    doi: '10.1126/science.1104259',
    datumDescription: 'Mars MOLA Areoid',
    coordinateSystem: 'IAU 2000 Mars Planetocentric',
    resolution: '463 m/pixel (MOLA MEGDR 128 px/deg)',

    elevation: {
      baseElevationM: -1380,
      minM: -1450,
      maxM: -1280,
      localReliefM: 170,
      unit: 'm',
      label: '-1,380 m (Local relief: 170 m broad shallow depressions)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 0.2,
      maxDeg: 6.0,
      typicalDeg: 1.2,
      label: '0.2° to 6.0° (Extremely flat sandstone plains with micro-ripples)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 94,
        moderate5to15Deg: 6,
        steep15to30Deg: 0,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 1.5,
      hurstExponent: 0.85,
      medianRoughnessM: 0.25,
      rockAbundanceFraction: 0.04,
      unit: 'm',
      label: 'Very low roughness (RMS 1.5°, wind-eroded sulfate laminations, hematite concretions)',
    },
    lithology: ['Jarosite', 'Goethite', 'Hematite Spherules ("Blueberries")', 'Basaltic Sand', 'Gypsum'],
    analogousEarthSites: ['rio-tinto-basin', 'atacama-yungay'],
    scientificSignificance:
      'Landing site of NASA Opportunity rover. Premier planetary site for jarosite precipitate formation under acidic groundwater upwelling conditions.',
  },
  {
    id: 'mars-vastitas-borealis',
    targetBody: 'Mars',
    name: 'Vastitas Borealis High-Latitude Polygonal Permafrost',
    region: 'Mare Boreum / North Polar Lowlands',
    centerCoordinates: '68.22°N, 234.25°E',
    boundingBox: {
      north: '69.00°N',
      south: '67.50°N',
      west: '233.00°E',
      east: '236.00°E',
    },
    coverageAreaKm2: '3,800 km²',
    primaryLandform: 'Thermal Contraction Polygonal Ground & Ice-Cemented Regolith',
    morphologyType: 'Sub-Zero Cryogenic Polygonal Patterned Ground',
    geologicalEpoch: 'Late Amazonian Glacio-Permafrost (~100 Ma to Present)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / MOLA_128_68N234E',
    sourceAgency: 'NASA PDS Geosciences Node / Phoenix Science Archive',
    sourceUrl: 'https://pds-geosciences.wustl.edu/missions/phoenix/',
    doi: '10.1126/science.1172466',
    datumDescription: 'Mars MOLA Areoid',
    coordinateSystem: 'IAU 2000 Mars Planetocentric',
    resolution: '463 m/pixel (MOLA 128 px/deg; HiRISE 25 cm/pixel images)',

    elevation: {
      baseElevationM: -4120,
      minM: -4180,
      maxM: -4060,
      localReliefM: 120,
      unit: 'm',
      label: '-4,120 m (Local relief: 120 m shallow polygonal troughs)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 0.1,
      maxDeg: 5.0,
      typicalDeg: 1.1,
      label: '0.1° to 5.0° (Flat periglacial patterned plains)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 96,
        moderate5to15Deg: 4,
        steep15to30Deg: 0,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 2.1,
      hurstExponent: 0.78,
      medianRoughnessM: 0.40,
      rockAbundanceFraction: 0.05,
      unit: 'm',
      label: 'Low roughness (RMS 2.1°, 3–5m diameter ice-wedge contraction polygons)',
    },
    lithology: ['Water-Ice Cemented Regolith', 'Magnesium Perchlorate', 'Calcite', 'Basaltic Dust'],
    analogousEarthSites: ['mcmurdo-dry-valleys', 'haughton-crater'],
    scientificSignificance:
      'Landing site of NASA Phoenix Mars lander. Confirmed shallow subsurface pure water-ice table at 5–10 cm depth beneath hyper-arid permafrost soil.',
  },
  {
    id: 'mars-arsia-mons-caves',
    targetBody: 'Mars',
    name: 'Arsia Mons Flank Volcanic Pit Craters & Collapse Skylights',
    region: 'Tharsis Volcanic Plateau Quadrangle',
    centerCoordinates: '8.40°S, 239.10°E',
    boundingBox: {
      north: '7.50°S',
      south: '9.30°S',
      west: '238.00°E',
      east: '240.50°E',
    },
    coverageAreaKm2: '6,400 km²',
    primaryLandform: 'Subterranean Lava Tube Skylights & Volcanic Collapse Pits',
    morphologyType: 'Extraterrestrial Basaltic Pyroduct Conduits & Vertical Shafts',
    geologicalEpoch: 'Amazonian Shield Volcanism (~200 Ma to ~50 Ma)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / THEMIS-VIS-IR-V2',
    sourceAgency: 'NASA PDS / ASU Mars Space Flight Facility',
    sourceUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
    doi: '10.1016/j.earscirev.2020.103288',
    datumDescription: 'Mars MOLA Areoid',
    coordinateSystem: 'IAU 2000 Mars Planetocentric',
    resolution: '463 m/pixel (THEMIS thermal infrared 100 m/pixel)',

    elevation: {
      baseElevationM: +8400, // High volcanic flank
      minM: +7900,
      maxM: +9200,
      localReliefM: 1300,
      unit: 'm',
      label: '+8,400 m a.s.l. (Volcanic shield flank; collapse pit depths 80–120 m)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 3.0,
      maxDeg: 55.0, // Vertical pit walls
      typicalDeg: 12.0,
      label: '3.0° (flank slope) to 55.0° (vertical pit entry rim)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 28,
        moderate5to15Deg: 52,
        steep15to30Deg: 14,
        extremeOver30Deg: 6,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 8.9,
      hurstExponent: 0.58,
      medianRoughnessM: 3.80,
      rockAbundanceFraction: 0.32,
      unit: 'm',
      label: 'High to extreme roughness (RMS 8.9°, vesicular basalt rubble, collapse rims)',
    },
    lithology: ['Tholeiitic Basalt', 'Vesicular Basalt Scoria', 'Volcanic Ash', 'Secondary Sulfates'],
    analogousEarthSites: ['kilauea-basalts', 'svalbard-bockfjorden'],
    scientificSignificance:
      'Seven candidate subterranean cave skylights ("Seven Sisters") discovered by THEMIS on the flank of Arsia Mons, presenting prime targets for future robotic cave ingress.',
  },
  {
    id: 'mars-nili-fossae-carbonates',
    targetBody: 'Mars',
    name: 'Nili Fossae Olivine-Carbonate Tectonic Grabens',
    region: 'Isidis Quadrangle',
    centerCoordinates: '22.00°N, 75.00°E',
    boundingBox: {
      north: '23.00°N',
      south: '21.00°N',
      west: '74.00°E',
      east: '76.00°E',
    },
    coverageAreaKm2: '5,000 km²',
    primaryLandform: 'Tectonic Fault Grabens & Ultramafic Carbonate Outcrops',
    morphologyType: 'Ancient Hydrothermal Serpentinized Basalt Fractures',
    geologicalEpoch: 'Early Noachian (~4.0 Ga)',
    pdsProductId: 'MGS-M-MOLA-5-MEGDR-L3-V1.0 / CRISM-TRDR-V3',
    sourceAgency: 'NASA PDS Geosciences Node / JHUAPL CRISM Team',
    sourceUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
    doi: '10.1126/science.1164759',
    datumDescription: 'Mars MOLA Areoid',
    coordinateSystem: 'IAU 2000 Mars Planetocentric',
    resolution: '463 m/pixel (CRISM hyperspectral targeted 18 m/pixel)',

    elevation: {
      baseElevationM: -650,
      minM: -1100,
      maxM: +200,
      localReliefM: 1300,
      unit: 'm',
      label: '-650 m (Fault escarpment relief: 850 m)',
      referenceDatum: 'MOLA Areoid',
    },
    slope: {
      minDeg: 2.0,
      maxDeg: 35.0,
      typicalDeg: 14.0,
      label: '2.0° (graben valley floor) to 35.0° (fault scarps)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 22,
        moderate5to15Deg: 54,
        steep15to30Deg: 24,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 7.2,
      hurstExponent: 0.62,
      medianRoughnessM: 2.10,
      rockAbundanceFraction: 0.22,
      unit: 'm',
      label: 'High roughness (RMS 7.2°, fractured fault talus and ultramafic bedrock)',
    },
    lithology: ['Magnesite (Mg-Carbonate)', 'Forsterite Olivine', 'Serpentine', 'Chlorite', 'Impactite'],
    analogousEarthSites: ['svalbard-bockfjorden', 'haughton-crater'],
    scientificSignificance:
      'Strongest planetary surface spectroscopic signature of low-temperature carbonate minerals formed via serpentinization of ultramafic crust, identical to Svalbard globules and ALH84001.',
  },

  // --------------------------------------------------------------------------
  // MOON TERRAIN DATASETS (NASA LOLA / LROC)
  // --------------------------------------------------------------------------
  {
    id: 'moon-marius-hills-skylight',
    targetBody: 'Moon',
    name: 'Marius Hills Lava Tube Skylight & Rille Complex',
    region: 'Oceanus Procellarum Volcanic Plateau',
    centerCoordinates: '14.09°N, 303.22°E', // 14.09°N, 56.78°W
    boundingBox: {
      north: '14.50°N',
      south: '13.70°N',
      west: '302.60°E',
      east: '303.80°E',
    },
    coverageAreaKm2: '1,800 km²',
    primaryLandform: 'Sinuous Rille & Subterranean Lava Tube Collapse Pit',
    morphologyType: 'Intact Pyroduct Conduit with 65m Diameter Circular Skylight',
    geologicalEpoch: 'Late Imbrian Mare Volcanism (~3.5 to ~3.3 Ga)',
    pdsProductId: 'LRO-L-LOLA-4-GDR-V1.0 / LOLA_128_14N303E',
    sourceAgency: 'NASA PDS Geosciences Node / LROC Science Operations',
    sourceUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/',
    doi: '10.1029/2009GL041753',
    datumDescription: 'LOLA Lunar Reference Sphere (Radius = 1,737.40 km)',
    coordinateSystem: 'IAU 2000 Moon Mean Earth/Polar Axis (East Longitude 0° to 360°)',
    resolution: '118 m/pixel (LOLA 256 px/deg; LROC NAC stereo DTM 2.0 m/pixel)',

    elevation: {
      baseElevationM: -2150, // Relative to 1,737.4 km sphere
      minM: -2240,           // Bottom of collapse pit (-90m below rim)
      maxM: -2020,
      localReliefM: 220,
      unit: 'm',
      label: '-2,150 m (Skylight depth: 88 m; subterranean vault clearance ~40 m)',
      referenceDatum: 'LOLA 1,737.4 km Sphere',
    },
    slope: {
      minDeg: 1.0,
      maxDeg: 78.0, // Overhanging pit entrance
      typicalDeg: 5.5,
      label: '1.0° (mare basalt flow) to 78.0° (vertical basaltic pit wall)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 62,
        moderate5to15Deg: 28,
        steep15to30Deg: 7,
        extremeOver30Deg: 3,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 4.8,
      hurstExponent: 0.70,
      medianRoughnessM: 1.10,
      rockAbundanceFraction: 0.08,
      unit: 'm',
      label: 'Moderate mare surface roughness; interior pyroduct ceiling vault has zero meteoroid gardening',
    },
    lithology: ['Tholeiitic Mare Basalt', 'High-Ti Ilmenite Basalt', 'Pyroxene', 'Lunar Regolith Glass'],
    analogousEarthSites: ['kilauea-basalts', 'svalbard-bockfjorden'],
    scientificSignificance:
      'Premier lunar candidate for human shelter and robotic ingress. SELENE and LROC confirmed an 88-meter deep open collapse pit leading into an intact subterranean pyroduct estimated at >300m width.',
  },
  {
    id: 'moon-shackleton-south-pole',
    targetBody: 'Moon',
    name: 'Shackleton Crater Rim & Permanently Shadowed Region (PSR)',
    region: 'Lunar South Pole / South Pole-Aitken Basin Rim',
    centerCoordinates: '89.90°S, 0.00°E',
    boundingBox: {
      north: '89.50°S',
      south: '90.00°S',
      west: '0.00°E',
      east: '360.00°E',
    },
    coverageAreaKm2: '1,200 km²',
    primaryLandform: 'Polar Impact Crater Rim & Cryogenic Deep Shadow Basin',
    morphologyType: 'Permanently Shadowed Ultra-Cold Volatile Trap',
    geologicalEpoch: 'Pre-Nectarian / Eratosthenian Impact (~3.9 Ga / ~3.6 Ga)',
    pdsProductId: 'LRO-L-LOLA-4-GDR-V1.0 / LOLA_SP_20M_DEM',
    sourceAgency: 'NASA PDS Geosciences Node / NASA Goddard Space Flight Center',
    sourceUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/',
    doi: '10.1038/nature11216',
    datumDescription: 'LOLA Lunar Reference Sphere (Radius = 1,737.40 km)',
    coordinateSystem: 'Lunar Polar Stereographic Projection (South)',
    resolution: '20 m/pixel (LOLA Polar Gridded DEM)',

    elevation: {
      baseElevationM: +1250, // Rim crest in continuous sunlight
      minM: -2950,           // Floor in permanent shadow
      maxM: +1420,
      localReliefM: 4370,
      unit: 'm',
      label: '+1,250 m (Sunlit Peak Rim) to -2,950 m (Cryogenic Interior Floor; Relief: 4,370 m)',
      referenceDatum: 'LOLA 1,737.4 km Sphere',
    },
    slope: {
      minDeg: 3.0,
      maxDeg: 34.0,
      typicalDeg: 28.0, // Crater walls are exceptionally steep
      label: '3.0° (rim ridge crest) to 34.0° (crater interior scarp walls)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 12,
        moderate5to15Deg: 18,
        steep15to30Deg: 48,
        extremeOver30Deg: 22,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 14.5,
      hurstExponent: 0.48,
      medianRoughnessM: 5.20,
      rockAbundanceFraction: 0.28,
      unit: 'm',
      label: 'Very high roughness (RMS 14.5°, steep rubbly ejecta scree, micro-impact pits)',
    },
    lithology: ['Anorthositic Breccia', 'Volatile Water Ice', 'Troctolite', 'Highland Impact Melt'],
    analogousEarthSites: ['mcmurdo-dry-valleys', 'haughton-crater'],
    scientificSignificance:
      'Prime Artemis exploration landing site. Crater rim receives up to 86% annual sunlight for solar power, while the -250°C interior PSR cold-traps substantial water ice deposits.',
  },
  {
    id: 'moon-copernicus-crater',
    targetBody: 'Moon',
    name: 'Copernicus Complex Impact Crater & Central Peaks',
    region: 'Oceanus Procellarum / Mare Insularum',
    centerCoordinates: '9.62°N, 339.92°E', // 9.62°N, 20.08°W
    boundingBox: {
      north: '10.50°N',
      south: '8.80°N',
      west: '338.80°E',
      east: '341.10°E',
    },
    coverageAreaKm2: '6,800 km² (93 km diameter crater)',
    primaryLandform: 'Complex Crater Rim, Terraces, Central Uplift & Melt Pools',
    morphologyType: 'Terraced Rim Fault Scarps & Hydrothermally Shocked Uplift',
    geologicalEpoch: 'Copernican Epoch (~800 Ma)',
    pdsProductId: 'LRO-L-LOLA-4-GDR-V1.0 / LOLA_128_10N340E',
    sourceAgency: 'NASA PDS Geosciences / LROC Team',
    sourceUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/',
    doi: '10.1029/2011JE003887',
    datumDescription: 'LOLA Lunar Reference Sphere (Radius = 1,737.40 km)',
    coordinateSystem: 'IAU 2000 Moon Mean Earth/Polar Axis',
    resolution: '118 m/pixel (LOLA 256 px/deg)',

    elevation: {
      baseElevationM: -3750, // Crater floor
      minM: -3900,
      maxM: -250,            // Rim crest
      localReliefM: 3650,
      unit: 'm',
      label: '-3,750 m (Floor) to -250 m (Rim Crest; Relief: 3,650 m, Central Peak: +1.2 km)',
      referenceDatum: 'LOLA 1,737.4 km Sphere',
    },
    slope: {
      minDeg: 2.0,
      maxDeg: 38.0,
      typicalDeg: 16.5,
      label: '2.0° (melt pools) to 38.0° (fault scarps and central peaks)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 20,
        moderate5to15Deg: 35,
        steep15to30Deg: 32,
        extremeOver30Deg: 13,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 9.2,
      hurstExponent: 0.54,
      medianRoughnessM: 4.10,
      rockAbundanceFraction: 0.35,
      unit: 'm',
      label: 'High to very high roughness (RMS 9.2°, extensive impact melt rubble and boulder fields)',
    },
    lithology: ['Impact Melt Breccia', 'Anorthosite', 'Olivine Dunite (Mantle Exhumation)', 'Shatter Cones'],
    analogousEarthSites: ['haughton-crater', 'svalbard-bockfjorden'],
    scientificSignificance:
      'Classically studied complex impact structure on Moon (93 km diameter) with well-preserved central peaks exhuming deep crustal/mantle olivine lithologies, analogous to Devon Island Haughton crater.',
  },
  {
    id: 'moon-tranquillitatis-pit',
    targetBody: 'Moon',
    name: 'Mare Tranquillitatis Pit Crater (MTP)',
    region: 'Mare Tranquillitatis Equatorial Volcanic Plain',
    centerCoordinates: '8.33°N, 33.22°E',
    boundingBox: {
      north: '8.60°N',
      south: '8.10°N',
      west: '32.90°E',
      east: '33.50°E',
    },
    coverageAreaKm2: '450 km²',
    primaryLandform: 'Steep-Walled Collapse Pit in Layered High-Ti Mare Basalt',
    morphologyType: 'Subterranean Cavern Entry with Confirmed Sub-Surface Conduit Extension',
    geologicalEpoch: 'Late Imbrian Volcanism (~3.6 Ga)',
    pdsProductId: 'LRO-L-LOLA-4-GDR-V1.0 / LROC_NAC_DTM_MTP',
    sourceAgency: 'NASA PDS / LROC Science Operations',
    sourceUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lroc-2-edr-v1/',
    doi: '10.1038/s41550-024-02302-y',
    datumDescription: 'LOLA Lunar Reference Sphere (Radius = 1,737.40 km)',
    coordinateSystem: 'IAU 2000 Moon Mean Earth/Polar Axis',
    resolution: '118 m/pixel (LROC stereo DTM 1.5 m/pixel; radar sounding data)',

    elevation: {
      baseElevationM: -1820,
      minM: -1950,           // Pit floor (-130 m below mare)
      maxM: -1800,
      localReliefM: 150,
      unit: 'm',
      label: '-1,820 m (Mare plain; Pit depth: 130 m, radar conduit extends 80m+ horizontally)',
      referenceDatum: 'LOLA 1,737.4 km Sphere',
    },
    slope: {
      minDeg: 0.8,
      maxDeg: 82.0, // Vertical to overhanging pit entrance
      typicalDeg: 4.2,
      label: '0.8° (mare plain) to 82.0° (vertical basalt scarp entry)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 78,
        moderate5to15Deg: 15,
        steep15to30Deg: 4,
        extremeOver30Deg: 3,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 3.9,
      hurstExponent: 0.74,
      medianRoughnessM: 0.95,
      rockAbundanceFraction: 0.09,
      unit: 'm',
      label: 'Moderate mare surface roughness; pit floor sheltered from solar weathering',
    },
    lithology: ['High-Titanium Mare Basalt (8–13 wt% TiO2)', 'Vesicular Basalt', 'Olivine', 'Pyroxene'],
    analogousEarthSites: ['kilauea-basalts', 'svalbard-bockfjorden'],
    scientificSignificance:
      'Recent 2024 radar sounding data confirmed a subterranean cave conduit accessible from this 130m-deep pit, offering natural radiation and micro-meteorite thermal sheltering for long-term lunar habitats.',
  },
  {
    id: 'moon-taurus-littrow-apollo17',
    targetBody: 'Moon',
    name: 'Taurus-Littrow Valley (Apollo 17 Site)',
    region: 'Mare Serenitatis South-Eastern Rim',
    centerCoordinates: '20.19°N, 30.77°E',
    boundingBox: {
      north: '20.60°N',
      south: '19.80°N',
      west: '30.30°E',
      east: '31.20°E',
    },
    coverageAreaKm2: '1,500 km²',
    primaryLandform: 'Graben Valley Floor Bounded by 2 km High Massifs & Pyroclastic Mantle',
    morphologyType: 'Tectonic Rift Valley with Volcanic Pyroclastic Glass Beads & Light Mantle Avalanche',
    geologicalEpoch: 'Imbrian Massif / Eratosthenian Pyroclastic (~3.8 to ~3.5 Ga)',
    pdsProductId: 'LRO-L-LOLA-4-GDR-V1.0 / LOLA_128_20N030E',
    sourceAgency: 'NASA PDS Geosciences Node / Apollo Lunar Sample Archive',
    sourceUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/',
    doi: '10.1126/science.182.4113.659',
    datumDescription: 'LOLA Lunar Reference Sphere (Radius = 1,737.40 km)',
    coordinateSystem: 'IAU 2000 Moon Mean Earth/Polar Axis',
    resolution: '118 m/pixel (LOLA 256 px/deg)',

    elevation: {
      baseElevationM: -2500, // Valley floor
      minM: -2580,
      maxM: -320,            // North Massif crest
      localReliefM: 2260,
      unit: 'm',
      label: '-2,500 m (Valley Floor) to -320 m (North Massif Rim; Relief: 2,260 m)',
      referenceDatum: 'LOLA 1,737.4 km Sphere',
    },
    slope: {
      minDeg: 1.5,
      maxDeg: 35.0,
      typicalDeg: 11.0,
      label: '1.5° (valley floor rover traverse) to 35.0° (massif avalanche slopes)',
      unit: 'deg',
      distribution: {
        flat0to5Deg: 42,
        moderate5to15Deg: 34,
        steep15to30Deg: 20,
        extremeOver30Deg: 4,
      },
    },
    surfaceRoughness: {
      rmsSlopeDeg: 6.1,
      hurstExponent: 0.66,
      medianRoughnessM: 1.80,
      rockAbundanceFraction: 0.16,
      unit: 'm',
      label: 'Moderate-high roughness (RMS 6.1°, boulder tracks, regolith avalanche tongues)',
    },
    lithology: ['Ilmenite Basalt', 'Orange Pyroclastic Volcanic Glass Beads', 'Anorthositic Norite', 'Regolith Breccia'],
    analogousEarthSites: ['kilauea-basalts', 'haughton-crater', 'atacama-yungay'],
    scientificSignificance:
      'Landing site of Apollo 17 (Cernan & Schmitt). Famous for the discovery of volatile-coated volcanic orange glass beads and rover traverses across complex massif talus slopes.',
  },
]

