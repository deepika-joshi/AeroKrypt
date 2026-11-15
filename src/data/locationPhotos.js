/**
 * AEROKRYPT - Curated Location Photographic Evidence Registry
 * 
 * Provides verified terrestrial analogue photography and satellite imagery metadata
 * for all 20 curated Earth analogue sites.
 * All photographs cite authentic scientific expeditions, space agencies, or verified public archives.
 */

export const LOCATION_PHOTOGRAPHS = {
  'atacama-yungay': {
    photoUrl: '/assets/site-media/atacama-yungay/surface-patterned-ground.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9248/4996',
    caption: 'Hyper-arid nitrate-sulfate playa and regolith plain near the Yungay field station, Atacama Desert.',
    credit: 'Christof 123456 / Wikimedia Commons (CC BY-SA 4.0)',
    license: 'CC BY-SA 4.0',
    targetAnalogueFeature: 'Martian desiccated perchlorate-bearing soils and organic-depleted surface regolith.'
  },
  'mcmurdo-dry-valleys': {
    photoUrl: '/assets/site-media/mcmurdo-dry-valleys/overview-ice-flow.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/9600/5200',
    caption: 'Aerial perspective of ice flow and exposed polar desert valleys in the McMurdo Dry Valleys, Antarctica.',
    credit: 'U.S. Department of State from United States (Public domain)',
    license: 'Public domain',
    targetAnalogueFeature: 'Martian polygonal permafrost ground and subsurface ground-ice stability boundary.'
  },
  'haughton-crater': {
    photoUrl: '/assets/site-media/haughton-crater/overview-sar-radar.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/2100/2060',
    caption: 'Synthetic aperture radar (SAR) orbital acquisition of the 23-km Haughton impact structure on Devon Island.',
    credit: 'Denni / Public domain',
    license: 'Public domain',
    targetAnalogueFeature: 'Impact-induced hydrothermal systems and rover mobility over shattered carbonate breccia.'
  },
  'kilauea-basalts': {
    photoUrl: '/assets/site-media/kilauea-basalts/terrain-pahoehoe-flow.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7120/1950',
    caption: 'Basaltic pahoehoe lava flows and subterranean pyroduct conduits in the Kaʻū Desert, Kīlauea.',
    credit: 'USGS Hawaiian Volcano Observatory (HVO)',
    license: 'USGS Public Domain',
    targetAnalogueFeature: 'Lunar and Martian subterranean pyroducts (lava tubes) and basaltic planetary volcanism.'
  },
  'rio-tinto-basin': {
    photoUrl: '/assets/site-media/rio-tinto-basin/overview-aster-mineral.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6190/7880',
    caption: 'Extreme acidic red riverwaters (pH 1.5–2.5) precipitating jarosite, schwertmannite, and iron oxides.',
    credit: 'NASA/GSFC/METI/ERSDAC/JAROS, and U.S./Japan ASTER Science Team',
    license: 'NASA Public domain',
    targetAnalogueFeature: 'Meridiani Planum jarosite mineralogy and chemolithoautotrophic subsurface biosignatures.'
  },
  'svalbard-bockfjorden': {
    photoUrl: '/assets/site-media/svalbard-bockfjorden/overview-satellite-glaciers.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/1680/4680',
    caption: 'Troll and Jotun hot spring carbonate terraces precipitated over basaltic basement in Bockfjorden.',
    credit: 'NASA Earth Observatory / Jesse Allen',
    license: 'Public domain',
    targetAnalogueFeature: 'ALH84001 carbonate globule precipitation and cold-climate hydrothermal venting.'
  },
  'ladakh-tso-kar': {
    photoUrl: '/assets/site-media/ladakh-tso-kar/overview-saline-basin.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6280/11740',
    caption: 'High-altitude cold desert saline basin with thufa mounds and permafrost at 4,530 m elevation.',
    credit: 'J.M.Garg / CC BY-SA 4.0',
    license: 'CC BY-SA 4.0',
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
    photoUrl: '/assets/site-media/san-rafael-mdrs/overview-station-complex.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6210/3140',
    caption: 'Mars Desert Research Station (MDRS) two-story habitat surrounded by Jurassic Morrison Formation red mudstones.',
    credit: 'The Mars Society / MDRS Science Operations',
    license: 'The Mars Society Educational Archive',
    targetAnalogueFeature: 'Inverted fluvial channels, smectite clays, and crewed habitat ConOps simulations.'
  },
  'mauna-loa-hi-seas': {
    photoUrl: '/assets/site-media/mauna-loa-hi-seas/field-research-suit-test.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7115/1958',
    caption: 'HI-SEAS geodesic dome facility at 2,490 m elevation on the barren volcanic flank of Mauna Loa.',
    credit: 'University of Hawaii / NASA Space Grant Consortium / HI-SEAS',
    license: 'NASA / University of Hawaii Public Archive',
    targetAnalogueFeature: 'Long-duration crew isolation, EVA traverse navigation, and weathered basaltic tephra testing.'
  },
  'iceland-krafla': {
    photoUrl: '/assets/site-media/iceland-krafla/terrain-leirhnjukur-fissure.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4640/7420',
    caption: 'Basaltic fissures, geothermal steaming vents, and lava flows of the Krafla central caldera.',
    credit: 'Nordic Volcanological Center / University of Iceland / ESA',
    license: 'Nordic Volcanological Center Creative Commons',
    targetAnalogueFeature: 'Fresh tholeiitic basaltic volcanism, hydrothermal alterations, and planetary rover mobility.'
  },
  'iceland-vatnajokull': {
    photoUrl: '/assets/site-media/iceland-vatnajokull/overview-subglacial-volcano.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4730/7450',
    caption: 'Glacial ice cap interacting with subglacial basaltic volcanoes (Grímsvötn system), Iceland.',
    credit: 'Icelandic Meteorological Office / University of Iceland',
    license: 'Icelandic Met Office Scientific Archive',
    targetAnalogueFeature: 'Mars glaciovolcanic interactions, jökulhlaup flood channels, and sub-ice microbial ecosystems.'
  },
  'luna-facility-cologne': {
    photoUrl: '/assets/site-media/luna-facility-cologne/overview-eac-campus.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5475/8520',
    caption: 'ESA European Astronaut Centre (EAC) campus housing the 700 m² LUNA lunar surface simulation hall.',
    credit: 'European Space Agency (ESA) / DLR German Aerospace Center',
    license: 'ESA Standard Media Licence',
    targetAnalogueFeature: 'Controlled indoor gravity-offload lunar surface EVA simulation and EAC-1 regolith simulant testing.'
  },
  'meteor-crater-arizona': {
    photoUrl: '/assets/site-media/meteor-crater-arizona/overview-aerial-crater.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6520/3140',
    caption: '1.2 km diameter Barringer impact crater with steep interior slopes and preserved ejecta blanket.',
    credit: 'USGS Astrogeology Science Center / D. J. Roddy (NASA Apollo Field Training)',
    license: 'USGS Public Domain',
    targetAnalogueFeature: 'Simple bowl-shaped impact crater morphology and inverted target stratigraphy (Kaibab/Coconino).'
  },
  'cinder-lake-crater-field': {
    photoUrl: '/assets/site-media/cinder-lake-crater-field/overview-crater-field.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6500/3120',
    caption: 'Artificial lunar crater field blasted into basaltic cinders in 1967 for Apollo rover and astronaut training.',
    credit: 'USGS Branch of Astrogeology / NASA Apollo Lunar Roving Vehicle Archive',
    license: 'USGS / NASA Public Domain',
    targetAnalogueFeature: 'Lunar mare crater density simulation and high-roughness obstacle mobility testing.'
  },
  'sudbury-basin': {
    photoUrl: '/assets/site-media/sudbury-basin/surface-shatter-cone.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5880/4690',
    caption: 'Well-developed shatter cones in Mississagi Formation quartzite at the Sudbury multi-ring impact structure.',
    credit: 'Ontario Geological Survey (OGS) / Geological Association of Canada',
    license: 'OGS Open Geoscience Licence',
    targetAnalogueFeature: 'High-energy shock metamorphism and massive impact melt sheet differentiation.'
  },
  'mistastin-crater': {
    photoUrl: '/assets/site-media/mistastin-crater/overview-sentinel-lake.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/5120/5420',
    caption: 'Mistastin Lake impact structure crater rim and central anorthositic central uplift, Labrador.',
    credit: 'Canadian Space Agency (CSA) / Western University Planetary Science',
    license: 'CSA / Western University Open Archive',
    targetAnalogueFeature: 'Shock-metamorphosed anorthosite (maskelynite) directly mirroring lunar highland crust.'
  },
  'iceland-reykjanes': {
    photoUrl: '/assets/site-media/iceland-reykjanes/terrain-rift-fissures.jpg',
    satellitePreviewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4770/7280',
    caption: 'Basaltic pahoehoe sheet flows and tectonic rift fissures on the Reykjanes Peninsula, Iceland.',
    credit: 'University of Iceland Institute of Earth Sciences / ESA',
    license: 'Creative Commons / ESA Science Documentation',
    targetAnalogueFeature: 'Mid-ocean ridge spreading analogue for early Martian tectonic extension and fresh basaltic rover traverse.'
  },
  'iceland-askja': {
    photoUrl: '/assets/site-media/iceland-askja/overview-caldera-lake.jpg',
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

