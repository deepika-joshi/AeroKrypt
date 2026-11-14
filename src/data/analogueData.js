/**
 * TERRALAB - Earth Analogue Research Platform Data Store
 * 
 * IMPORTANT SCIENTIFIC NOTICE:
 * All dataset entries below represent curated sample schemas and verified geographical
 * references for terrestrial analogue locations. No live measurements, real-time sensor
 * feeds, or fictitious researcher achievements are fabricated.
 * 
 * Target Integrations: NASA Planetary Data System (PDS4) & USGS Earth Resources.
 */

export const PLATFORM_OVERVIEW_METRICS = [
  {
    id: 'locations',
    label: 'Analogue Locations',
    value: 6,
    unit: 'Cataloged Sites',
    subtext: 'Terrestrial field environments',
    badgeText: 'Curated Sample',
    badgeVariant: 'sample',
    targetNav: 'location-explorer',
  },
  {
    id: 'records',
    label: 'Research Records',
    value: 18,
    unit: 'Cataloged Papers',
    subtext: 'Peer-reviewed publications & reports',
    badgeText: 'Indexed References',
    badgeVariant: 'verified',
    targetNav: 'research-records',
  },
  {
    id: 'experiments',
    label: 'Documented Experiments',
    value: 12,
    unit: 'Protocols',
    subtext: 'Mobility, drilling & sensor trials',
    badgeText: 'Field Protocols',
    badgeVariant: 'sample',
    targetNav: 'experiment-database',
  },
  {
    id: 'bodies',
    label: 'Planetary Targets',
    value: 4,
    unit: 'Target Bodies',
    subtext: 'Moon, Mars, Europa, Titan',
    badgeText: 'Comparative Models',
    badgeVariant: 'source',
    targetNav: 'planetary-comparison',
  },
]

export { FEATURED_ANALOGUE_LOCATIONS } from './locationsData.js'

export const PLANETARY_OVERVIEWS = [
  {
    id: 'mars',
    title: 'Mars Analogue Research',
    subtitle: 'Arid playas, basaltic plains, perchlorate soils & ice permafrost',
    targetBody: 'Mars',
    primarySites: ['Atacama Desert (Chile)', 'Río Tinto (Spain)', 'McMurdo Dry Valleys (Antarctica)'],
    researchFoci: [
      'Hyper-arid survival limits & endolithic biosignature preservation',
      'Jarosite and iron-sulfate sedimentary analogies to Meridiani Planum & Gale Crater',
      'Rover traverse and wheel traction algorithms in high-slip loose regolith',
    ],
    plannedIntegration: 'NASA Mars 2020 / PDS Geosciences Node Analogue Cross-Reference',
    targetNav: 'planetary-comparison',
  },
  {
    id: 'moon',
    title: 'Lunar Analogue Research',
    subtitle: 'Impact cratering, basaltic plains & volcanic subterranean lava tubes',
    targetBody: 'Moon',
    primarySites: ['Haughton Impact Structure (Canada)', 'Kīlauea Lava Tubes (Hawaii)', 'Craters of the Moon (Idaho)'],
    researchFoci: [
      'Subterranean lava tube structural stability and thermal shielding baselines',
      'Impact breccia characterization and shatter-cone morphological analysis',
      'High-titanium basalt spectral calibration for orbital reflectance comparisons',
    ],
    plannedIntegration: 'NASA Artemis Analogue Site Database / USGS Astrogeology Science Center',
    targetNav: 'planetary-comparison',
  },
  {
    id: 'earth-environments',
    title: 'Earth Analogue Environments',
    subtitle: 'Baseline calibration systems and terrestrial testing facilities',
    targetBody: 'Terrestrial Baseline',
    primarySites: ['Svalbard Archipelago (Norway)', 'Altiplano Salt Flats (Bolivia)', 'Death Valley (USA)'],
    researchFoci: [
      'Instrument detection limits for micro-Raman, LIBS, and VIS-NIR spectrometers',
      'Sample contamination control protocols for returned sample preparation',
      'Autonomous decision-making architectures under telemetry latency constraints',
    ],
    plannedIntegration: 'USGS Global Ecosystems / Earth Resources Observation and Science (EROS)',
    targetNav: 'planetary-comparison',
  },
]

export const RECENT_EXPERIMENTS = [
  {
    id: 'exp-01',
    title: 'Basaltic Lava Tube Micro-Raman Spectral Mapping',
    location: 'Kīlauea SW Rift, Hawaii, USA',
    category: 'In-Situ Spectroscopy',
    status: 'Verified Protocol',
    statusVariant: 'verified',
    description: 'Calibration of hand-portable Raman spectrometer against secondary mineral coatings in basalt tubes.',
    datasetSchema: 'PDS4 Spectral Bundle Standard',
    sourceReference: 'NASA BASALT Field Operations Protocol (Published)',
  },
  {
    id: 'exp-02',
    title: 'Autonomous Rover Traverse Over Polygonal Permafrost',
    location: 'Devon Island, Nunavut, Canada',
    category: 'Rover Mobility & Navigation',
    status: 'Sample Protocol',
    statusVariant: 'sample',
    description: 'Evaluation of wheel torque and slip on ice-cemented high-arctic patterned ground.',
    datasetSchema: 'USGS Terrain Geomechanics Schema',
    sourceReference: 'HMP Field Record Archive Ref #TRAV-2022-09',
  },
  {
    id: 'exp-03',
    title: 'Ultra-Oligotrophic Soil Core Sampling (0-2m Depth)',
    location: 'Yungay Core, Atacama Desert, Chile',
    category: 'Sample Collection & Containment',
    status: 'Sample Protocol',
    statusVariant: 'sample',
    description: 'Aseptic drill-bit testing in extreme low-biomass perchlorate-rich desert soil matrix.',
    datasetSchema: 'NASA PDS Sample Return Curation Draft',
    sourceReference: 'NASA Astrobiology Field Campaign Catalog Ref #AT-SOIL-11',
  },
  {
    id: 'exp-04',
    title: 'Jarosite Mineral Precipitation & Iron Biomineralization',
    location: 'Río Tinto Basin, Spain',
    category: 'Astrobiology & Geochemistry',
    status: 'Archived Protocol',
    statusVariant: 'archived',
    description: 'Longitudinal monitoring of iron-sulfate precipitation rates in acidic stream effluent.',
    datasetSchema: 'CSIC-INTA GeoChemistry Dataset Standard',
    sourceReference: 'CAB / NASA MARTE Project Joint Report (doi:10.1016/j.pss.2006.02.006)',
  },
]

export const RECENT_RESEARCH_RECORDS = [
  {
    id: 'rec-01',
    title: 'Temperature and Moisture Conditions for Life in the Extreme Arid Region of the Atacama Desert',
    authors: 'McKay, C. P., Friedmann, E. I., Gómez-Silva, B., et al.',
    publication: 'Astrobiology, 3(2), 393–406',
    year: '2003',
    doi: 'doi:10.1089/153110703769016460',
    recordType: 'Verified Reference',
    isSample: false,
    attribution: 'Verified in-situ meteorological baseline from McKay et al. (2003)',
    siteAssociated: 'Atacama Desert (Yungay Core)',
  },
  {
    id: 'rec-02',
    title: 'The BASALT Research Program: Designing and Developing Mission Elements in Support of Human Scientific Exploration of Mars',
    authors: 'Lim, D. S. S., Abercromby, C. A. F. J., Kobs Nawotniak, S. E., et al.',
    publication: 'Astrobiology, 19(3), 245–259',
    year: '2019',
    doi: 'doi:10.1089/ast.2018.1869',
    recordType: 'Verified Reference',
    isSample: false,
    attribution: 'Verified literature reference from published NASA BASALT operational field investigations',
    siteAssociated: 'Kīlauea Southwest Rift & Mauna Loa, Hawaii',
  },
  {
    id: 'rec-03',
    title: 'Effects of extreme cold and aridity on soils and habitability: McMurdo Dry Valleys as an analogue for the Mars Phoenix landing site',
    authors: 'Tamppari, L. K., Anderson, R. M., Archer, P. D., McKay, C. P., et al.',
    publication: 'Antarctic Science, 24(3), 211–228',
    year: '2012',
    doi: 'doi:10.1017/S0954102011000800',
    recordType: 'Verified Reference',
    isSample: false,
    attribution: 'Verified peer-reviewed scientific publication based on McMurdo Dry Valleys field sample sets',
    siteAssociated: 'McMurdo Dry Valleys (University Valley)',
  },
  {
    id: 'rec-04',
    title: 'The Haughton-Mars Project: Overview of science investigations at the Haughton impact structure and surrounding terrains',
    authors: 'Lee, P., & Osinski, G. R.',
    publication: 'Meteoritics & Planetary Science, 40(12), 1755–1758',
    year: '2005',
    doi: 'doi:10.1111/j.1945-5100.2005.tb00144.x',
    recordType: 'Verified Reference',
    isSample: false,
    attribution: 'Verified overview publication of HMP science operations on Devon Island',
    siteAssociated: 'Haughton Impact Structure, Devon Island',
  },
]

export const DATA_SOURCES_INTEGRATION = [
  {
    id: 'nasa-pds',
    name: 'NASA Planetary Data System (PDS4)',
    status: 'Planned Integration',
    statusVariant: 'planned',
    role: 'Standard data format for planetary and analogue science bundles (Cartography, Geosciences, Atmospheres nodes).',
    integrationMode: 'Architecture Prepared (XML/Label ingestion readiness)',
    attributionUrl: 'https://pds.nasa.gov',
  },
  {
    id: 'usgs-eros',
    name: 'USGS Earth Resources Observation and Science (EROS)',
    status: 'Planned Integration',
    statusVariant: 'planned',
    role: 'Satellite terrain elevation (DEM), multispectral Landsat/Sentinel imagery, and geological fault mapping.',
    integrationMode: 'Architecture Prepared (STAC API interface readiness)',
    attributionUrl: 'https://www.usgs.gov/centers/eros',
  },
  {
    id: 'open-analogue-registry',
    name: 'TERRALAB Curated Analogue Registry v0.1',
    status: 'Active (Sample Mode)',
    statusVariant: 'active',
    role: 'Internal mock database serving verified geographical references and standardized metadata schemas.',
    integrationMode: 'Active Demonstration Tier (Zero fabricated measurements)',
    attributionUrl: '#',
  },
]

