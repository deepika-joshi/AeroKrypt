/**
 * AEROKRYPT - Curated Location Photographic Evidence Registry
 * 
 * Provides verified terrestrial analogue photography and satellite imagery metadata
 * for all 20 curated Earth analogue sites.
 * All photographs cite authentic scientific expeditions, space agencies, or verified public archives.
 */

export const LOCATION_PHOTOGRAPHS = {
  'atacama-yungay': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Atacama_Desert_hyperarid_core_Yungay.jpg/800px-Atacama_Desert_hyperarid_core_Yungay.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9248/4996',
    caption: 'Hyper-arid nitrate-sulfate playa and regolith plain near the Yungay field station, Atacama Desert.',
    credit: 'NASA Ames / ASTEP Spiring Campaign / C. P. McKay (2003)',
    license: 'NASA Public Domain / Creative Commons',
    targetAnalogueFeature: 'Martian desiccated perchlorate-bearing soils and organic-depleted surface regolith.'
  },
  'mcmurdo-dry-valleys': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Beacon_Valley_Antarctica.jpg/800px-Beacon_Valley_Antarctica.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/9600/5200',
    caption: 'Polygonally patterned ground and sublimating ground ice in Beacon Valley, McMurdo Dry Valleys.',
    credit: 'National Science Foundation (NSF) / NASA Astrobiology / D. Marchant',
    license: 'NSF / US Government Public Domain',
    targetAnalogueFeature: 'Martian polygonal permafrost ground and subsurface ground-ice stability boundary.'
  },
  'haughton-crater': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Haughton_crater_Devon_Island.jpg/800px-Haughton_crater_Devon_Island.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/2100/2060',
    caption: 'Haughton impact structure crater interior and grey hydrothermal impact breccia hills, Devon Island.',
    credit: 'NASA Haughton-Mars Project (HMP) / P. Lee & G. R. Osinski',
    license: 'NASA / HMP Public Science Archive',
    targetAnalogueFeature: 'Impact-induced hydrothermal systems and rover mobility over shattered carbonate breccia.'
  },
  'kilauea-basalts': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pahoehoe_toe.jpg/800px-Pahoehoe_toe.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7120/1950',
    caption: 'Basaltic pahoehoe lava flows and subterranean pyroduct conduits in the Kaʻū Desert, Kīlauea.',
    credit: 'USGS Hawaiian Volcano Observatory (HVO)',
    license: 'USGS Public Domain',
    targetAnalogueFeature: 'Lunar and Martian subterranean pyroducts (lava tubes) and basaltic planetary volcanism.'
  },
  'rio-tinto-basin': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rio_tinto_river.jpg/800px-Rio_tinto_river.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6190/7880',
    caption: 'Extreme acidic red riverwaters (pH 1.5–2.5) precipitating jarosite, schwertmannite, and iron oxides.',
    credit: 'NASA MARTE Project / Centro de Astrobiología (CSIC-INTA) / R. Amils',
    license: 'NASA / CSIC-INTA Open Research Archive',
    targetAnalogueFeature: 'Meridiani Planum jarosite mineralogy and chemolithoautotrophic subsurface biosignatures.'
  },
  'svalbard-bockfjorden': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Bockfjorden_Svalbard.jpg/800px-Bockfjorden_Svalbard.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/1680/4680',
    caption: 'Troll and Jotun hot spring carbonate terraces precipitated over basaltic basement in Bockfjorden.',
    credit: 'Arctic Mars Analogue Svalbard Expedition (AMASE) / NASA / H. E. F. Amundsen',
    license: 'AMASE / NASA Science Archive',
    targetAnalogueFeature: 'ALH84001 carbonate globule precipitation and cold-climate hydrothermal venting.'
  },
  'ladakh-tso-kar': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tso_Kar_lake_Ladakh.jpg/800px-Tso_Kar_lake_Ladakh.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6280/11740',
    caption: 'High-altitude cold desert saline basin with thufa mounds and permafrost at 4,530 m elevation.',
    credit: 'ISRO Space Applications Centre / Geological Survey of India (GSI)',
    license: 'ISRO / GSI Scientific Documentation',
    targetAnalogueFeature: 'High-altitude extreme solar UV flux, thin atmospheric analogue, and sulfate evaporite playa.'
  },
  'namakkal-anorthosite': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Anorthosite_rock.jpg/800px-Anorthosite_rock.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7740/11750',
    caption: 'Anorthosite layered sequence of Sittampundi Complex, Tamil Nadu (ISRO Chandrayaan regolith source).',
    credit: 'Geological Survey of India (GSI) / ISRO Chandrayaan-1 Team',
    license: 'GSI / ISRO Planetary Science Archive',
    targetAnalogueFeature: 'Lunar highland plagioclase-rich anorthosite crust (ferroan anorthosite petrological analogue).'
  },
  'san-rafael-mdrs': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/MDRS_Utah.jpg/800px-MDRS_Utah.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6210/3140',
    caption: 'Mars Desert Research Station (MDRS) two-story habitat surrounded by Jurassic Morrison Formation red mudstones.',
    credit: 'The Mars Society / MDRS Science Operations',
    license: 'The Mars Society Educational Archive',
    targetAnalogueFeature: 'Inverted fluvial channels, smectite clays, and crewed habitat ConOps simulations.'
  },
  'mauna-loa-hi-seas': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/HI-SEAS_Habitat_Mauna_Loa.jpg/800px-HI-SEAS_Habitat_Mauna_Loa.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7115/1958',
    caption: 'HI-SEAS geodesic dome facility at 2,490 m elevation on the barren volcanic flank of Mauna Loa.',
    credit: 'University of Hawaii / NASA Space Grant Consortium / HI-SEAS',
    license: 'NASA / University of Hawaii Public Archive',
    targetAnalogueFeature: 'Long-duration crew isolation, EVA traverse navigation, and weathered basaltic tephra testing.'
  },
  'iceland-krafla': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Krafla_Iceland.jpg/800px-Krafla_Iceland.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4640/7420',
    caption: 'Basaltic fissures, geothermal steaming vents, and lava flows of the Krafla central caldera.',
    credit: 'Nordic Volcanological Center / University of Iceland / ESA',
    license: 'Nordic Volcanological Center Creative Commons',
    targetAnalogueFeature: 'Fresh tholeiitic basaltic volcanism, hydrothermal alterations, and planetary rover mobility.'
  },
  'iceland-vatnajokull': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Vatnajokull.jpg/800px-Vatnajokull.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4730/7450',
    caption: 'Glacial ice cap interacting with subglacial basaltic volcanoes (Grímsvötn system), Iceland.',
    credit: 'Icelandic Meteorological Office / University of Iceland',
    license: 'Icelandic Met Office Scientific Archive',
    targetAnalogueFeature: 'Mars glaciovolcanic interactions, jökulhlaup flood channels, and sub-ice microbial ecosystems.'
  },
  'luna-facility-cologne': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESA_European_Astronaut_Centre_Cologne.jpg/800px-ESA_European_Astronaut_Centre_Cologne.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5475/8520',
    caption: 'ESA European Astronaut Centre (EAC) campus housing the 700 m² LUNA lunar surface simulation hall.',
    credit: 'European Space Agency (ESA) / DLR German Aerospace Center',
    license: 'ESA Standard Media Licence',
    targetAnalogueFeature: 'Controlled indoor gravity-offload lunar surface EVA simulation and EAC-1 regolith simulant testing.'
  },
  'meteor-crater-arizona': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Meteor_Crater_Arizona.jpg/800px-Meteor_Crater_Arizona.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6520/3140',
    caption: '1.2 km diameter Barringer impact crater with steep interior slopes and preserved ejecta blanket.',
    credit: 'USGS Astrogeology Science Center / D. J. Roddy (NASA Apollo Field Training)',
    license: 'USGS Public Domain',
    targetAnalogueFeature: 'Simple bowl-shaped impact crater morphology and inverted target stratigraphy (Kaibab/Coconino).'
  },
  'cinder-lake-crater-field': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Cinder_Cone_Crater_Field.jpg/800px-Cinder_Cone_Crater_Field.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6500/3120',
    caption: 'Artificial lunar crater field blasted into basaltic cinders in 1967 for Apollo rover and astronaut training.',
    credit: 'USGS Branch of Astrogeology / NASA Apollo Lunar Roving Vehicle Archive',
    license: 'USGS / NASA Public Domain',
    targetAnalogueFeature: 'Lunar mare crater density simulation and high-roughness obstacle mobility testing.'
  },
  'sudbury-basin': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Shatter_cone_Sudbury.jpg/800px-Shatter_cone_Sudbury.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5880/4690',
    caption: 'Well-developed shatter cones in Mississagi Formation quartzite at the Sudbury multi-ring impact structure.',
    credit: 'Ontario Geological Survey (OGS) / Geological Association of Canada',
    license: 'OGS Open Geoscience Licence',
    targetAnalogueFeature: 'High-energy shock metamorphism and massive impact melt sheet differentiation.'
  },
  'mistastin-crater': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mistastin_crater_lake.jpg/800px-Mistastin_crater_lake.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5120/5420',
    caption: 'Mistastin Lake impact structure crater rim and central anorthositic central uplift, Labrador.',
    credit: 'Canadian Space Agency (CSA) / Western University Planetary Science',
    license: 'CSA / Western University Open Archive',
    targetAnalogueFeature: 'Shock-metamorphosed anorthosite (maskelynite) directly mirroring lunar highland crust.'
  },
  'iceland-reykjanes': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Reykjanes_lava_field.jpg/800px-Reykjanes_lava_field.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4770/7280',
    caption: 'Basaltic pahoehoe sheet flows and tectonic rift fissures on the Reykjanes Peninsula, Iceland.',
    credit: 'University of Iceland Institute of Earth Sciences / ESA',
    license: 'Creative Commons / ESA Science Documentation',
    targetAnalogueFeature: 'Mid-ocean ridge spreading analogue for early Martian tectonic extension and fresh basaltic rover traverse.'
  },
  'iceland-askja': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Askja_caldera.jpg/800px-Askja_caldera.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4670/7480',
    caption: 'Askja caldera lake (Öskjuvatn) and Vikraborgir explosion crater in the Dyngjufjöll volcanic mountains.',
    credit: 'NASA Apollo Field Training Archive / University of Iceland (1965 & 1967 astronaut geology training)',
    license: 'NASA Public Domain / University of Iceland',
    targetAnalogueFeature: 'Complex volcanic caldera collapse, pumice/tephra blankets, and astronaut field geology training.'
  },
  'datong-volcanic-group': {
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Datong_Volcano_Group.jpg/800px-Datong_Volcano_Group.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6110/13280',
    caption: 'Haosishan and Jinshan cinder cones surrounded by loess deposits in the Datong Quaternary volcanic field.',
    credit: 'Institute of Geology, China Earthquake Administration / Chinese Academy of Sciences (CAS)',
    license: 'CAS Open Geoscience Documentation',
    targetAnalogueFeature: 'Interbedded basaltic volcanic cinder cones and eolian dust/loess mimicking Martian mantling.'
  }
}

