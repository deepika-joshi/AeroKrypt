/**
 * AEROKRYPT - Master Dataset Inventory & Provenance Catalog
 * 
 * Comprehensive scientific inventory of all Earth, Mars, and Moon terrain and
 * analogue datasets integrated into the AEROKRYPT platform.
 * 
 * Standards Compliance:
 * - NASA Planetary Data System (PDS4) Information Model
 * - USGS Earth Resources Observation and Science (EROS) standards
 * - Open Geospatial Consortium (OGC) CRS specifications
 */

export const MASTER_DATASET_INVENTORY = [
  // -------------------------------------------------------------------------
  // MARS TOPOGRAPHY & MORPHOMETRY DATASETS
  // -------------------------------------------------------------------------
  {
    id: 'mola-megdr-global',
    name: 'Mars Global Surveyor MOLA MEGDR Topography (128 px/deg)',
    planetaryBody: 'Mars',
    coverage: 'Global (-88° to +88° Latitude, 0° to 360° East Longitude)',
    source: 'NASA Planetary Data System (PDS) Geosciences Node / GSFC',
    originalUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/',
    dataFormat: 'PDS3 IMG / GeoTIFF / NetCDF Gridded Binary',
    availableParameters: [
      'Areoid-referenced topography elevation (m)',
      'Planetary radius (m)',
      'Derived slope gradient (deg)',
      'Regional surface roughness (RMS slope)',
      'Areal relief (m)',
    ],
    resolution: '463 m/pixel at equator (128 pixels per degree; 1/128° grid)',
    units: 'Meters (elevation, radius); Degrees (slope)',
    coordinateReferenceSystem: 'IAU 2000 Mars Planetocentric Sphere (R = 3,396.19 km), MOLA Gravitational Equipotential Areoid Datum (U₀ = 12,637,273 m²/s²; distinct from historical 610 Pa Viking atmospheric pressure surface)',
    limitations:
      'Vertical accuracy ±1 m in flat plains; lateral spatial averaging footprint ~168 m across shot diameter. Micro-relief (< 50 m horizontal) requires HiRISE/HRSC sub-grid interpolation.',
    lastUpdated: '2023-04-12 (PDS4 bundle migration)',
    license: 'NASA Open Data Policy (Public Domain)',
  },
  {
    id: 'hrsc-dtm-regional',
    name: 'Mars Express HRSC High-Resolution Digital Terrain Models',
    planetaryBody: 'Mars',
    coverage: 'Targeted quadrangles (Jezero Delta, Gale Crater, Nili Fossae)',
    source: 'European Space Agency (ESA) Planetary Science Archive (PSA) / German Aerospace Center (DLR)',
    originalUrl: 'https://archives.esac.esa.int/psa/#!Table%20View/HRSC=instrument',
    dataFormat: 'VICAR / GeoTIFF Level 4 DTM',
    availableParameters: [
      'Micro-topographic elevation (m)',
      'Slope gradient maps (deg)',
      'Ortho-rectified panchromatic surface reflectance',
    ],
    resolution: '50 m to 100 m/pixel',
    units: 'Meters (elevation); Degrees (slope)',
    coordinateReferenceSystem: 'IAU 2000 Mars Planetocentric',
    limitations: 'Coverage is non-continuous (orbital swaths); cloud/dust aerosol optical depth can create local stereo correlation artifacts.',
    lastUpdated: '2022-11-18',
    license: 'ESA Open Access / NASA PDS Mirror',
  },
  {
    id: 'crism-mineral-maps',
    name: 'Mars Reconnaissance Orbiter CRISM Targeted Mineral Spectral Data',
    planetaryBody: 'Mars',
    coverage: 'Targeted regions (Meridiani Planum, Jezero, Nili Fossae)',
    source: 'NASA PDS Geosciences Node / JHU Applied Physics Laboratory',
    originalUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
    dataFormat: 'PDS4 Spectral Cube / ENVI Standard',
    availableParameters: [
      'VNIR/IR surface reflectance (0.36 to 3.92 µm)',
      'Mineral summary parameters (BD1900, D2300, HCP, LCP, SINDEX)',
      'Identified sulfate, phyllosilicate, and carbonate detections',
    ],
    resolution: '18 m to 36 m/pixel (targeted mode)',
    units: 'I/F reflectance factor; Band depth dimensionless ratio',
    coordinateReferenceSystem: 'IAU 2000 Mars Planetocentric',
    limitations: 'Cryocooler degradation in late mission limited SWIR channel SNR; dust patina attenuates crystalline mineral spectral contrast.',
    lastUpdated: '2023-01-10',
    license: 'NASA Open Data Policy',
  },

  // -------------------------------------------------------------------------
  // MOON TOPOGRAPHY & MORPHOMETRY DATASETS
  // -------------------------------------------------------------------------
  {
    id: 'lola-gdr-global',
    name: 'Lunar Reconnaissance Orbiter LOLA Gridded Data Record (GDR)',
    planetaryBody: 'Moon',
    coverage: 'Global (-90° to +90° Latitude, 0° to 360° East Longitude)',
    source: 'NASA PDS Geosciences Node / NASA Goddard Space Flight Center',
    originalUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/',
    dataFormat: 'PDS3 IMG / GeoTIFF Polar & Equirectangular Grid',
    availableParameters: [
      'Topographic elevation relative to 1,737.4 km reference sphere (m)',
      'Lunar radius (m)',
      'Surface slope gradient (deg)',
      'Surface roughness (RMS baselength)',
      'Albedo / 1064 nm reflectance',
    ],
    resolution: '118 m/pixel (256 pixels/degree); Polar areas: 20 m/pixel',
    units: 'Meters (elevation); Degrees (slope)',
    coordinateReferenceSystem: 'IAU 2000 Lunar Mean Earth/Polar Axis (Reference Sphere R = 1,737.40 km)',
    limitations: 'Inter-track gaps in equatorial latitudes interpolated at 128 px/deg; vertical accuracy ±1 m.',
    lastUpdated: '2023-09-05',
    license: 'NASA Open Data Policy (Public Domain)',
  },
  {
    id: 'lroc-nac-dtm-targeted',
    name: 'LROC Narrow Angle Camera Stereo Digital Terrain Models',
    planetaryBody: 'Moon',
    coverage: 'Targeted landing sites & skylights (Marius Hills, Mare Tranquillitatis Pit, Shackleton, Taurus-Littrow)',
    source: 'NASA PDS Geosciences Node / Arizona State University (ASU)',
    originalUrl: 'https://wms.lroc.asu.edu/lroc/rdr_product_select',
    dataFormat: 'GeoTIFF / USGS ISIS Cube / CSV Point Clouds',
    availableParameters: [
      'Ultra-high resolution elevation (m)',
      'Micro-slope gradient (deg)',
      'Obstacle boulder distribution (meter scale)',
      'Cavern pit entry cross-sectional profile',
    ],
    resolution: '1.5 m to 2.0 m/pixel',
    units: 'Meters (elevation, roughness); Degrees (slope)',
    coordinateReferenceSystem: 'Lunar Mean Earth/Polar Axis (LROC DTM Equirectangular)',
    limitations: 'Shadowed crater floors require high-gain long-exposure imaging; limited coverage to high-priority exploration targets.',
    lastUpdated: '2024-03-20',
    license: 'NASA Open Data Policy',
  },

  // -------------------------------------------------------------------------
  // EARTH ANALOGUE GEOGRAPHICAL & TERRAIN DATASETS
  // -------------------------------------------------------------------------
  {
    id: 'usgs-3dep-elev',
    name: 'USGS 3D Elevation Program (3DEP) / SRTM Digital Elevation',
    planetaryBody: 'Earth',
    coverage: 'Global coverage for Earth analogue testing locations',
    source: 'USGS National Geospatial Program / Earth Resources Observation and Science (EROS)',
    originalUrl: 'https://www.usgs.gov/3d-elevation-program',
    dataFormat: 'GeoTIFF / Cloud-Optimized GeoTIFF (COG) / WCS',
    availableParameters: [
      'Orthometric elevation (m a.s.l., EGM96 / NAVD88)',
      'Topographic slope gradient (deg)',
      'Aspect and terrain curvature',
      'Hydrological watershed delineations',
    ],
    resolution: '10 m/pixel (USA/Hawaii); 30 m/pixel (Global SRTM/ASTER)',
    units: 'Meters (elevation); Degrees (slope)',
    coordinateReferenceSystem: 'WGS 84 (EPSG:4326) / UTM projected zones',
    limitations: 'Radar foreshortening and layover in steep alpine terrain; void-filling performed in glaciated sectors.',
    lastUpdated: '2023-06-14',
    license: 'USGS Public Domain',
  },
  {
    id: 'terralab-curated-locations',
    name: 'TERRALAB Audited Analogue Locations Registry v0.2',
    planetaryBody: 'Earth',
    coverage: '6 Multi-Parameter Terrestrial Analogue Research Sites (Chile, Antarctica, Canada, USA, Spain, Norway)',
    source: 'TERRALAB Planetary Research Consortium (NASA ASTEP, AMASE, MARTE, BASALT, IceBite Publications)',
    originalUrl: 'https://terralab.aero/data/locations',
    dataFormat: 'Structured JSON / GeoJSON / PDS4 XML Ingestion Draft',
    availableParameters: [
      'Surveyed elevation and geodetic benchmark',
      'Topographic slope range and typical traverse gradients',
      'Mean annual temperature and diurnal amplitude (°C)',
      'Annual precipitation and relative humidity (%)',
      'Surface atmospheric pressure (kPa)',
      'Solar UV index baseline',
      'Substrate mineralogy and elemental geochemistry',
      'Geodetic bounding boxes and administrative jurisdictions',
      'Peer-reviewed evidence registry with cross-verified DOIs',
    ],
    resolution: 'Site-specific in-situ sensor baseline + 1:50,000 geodetic transects',
    units: 'SI Standard (m, deg, °C, mm/yr, %, kPa, UV index)',
    coordinateReferenceSystem: 'WGS 84 Ellipsoid (EPSG:4326)',
    limitations:
      'Subsurface shear strength (c, φ) unmeasured outside central testing transects. Multi-year winter weather records at Arctic sites rely on nearby airport/observatory stations.',
    lastUpdated: '2026-11-13 (Milestone 2 Scientific Integrity Audit Sealed)',
    license: 'Creative Commons Attribution 4.0 International (CC-BY 4.0)',
  },
  {
    id: 'terralab-mission-objectives',
    name: 'TERRALAB Mission Objectives & ConOps Testing Requirements Registry',
    planetaryBody: 'Moon & Mars Analogue Protocols',
    coverage: '5 Standard Planetary Exploration Mission Campaigns',
    source: 'NASA Artemis ConOps / NASA Mars 2020 Science Strategy / ESA Analogue Programs',
    originalUrl: 'https://terralab.aero/data/objectives',
    dataFormat: 'Structured JSON Standard',
    availableParameters: [
      'Required substrate lithologies and mineral suites',
      'Tolerable and maximum slope thresholds (deg)',
      'Surface roughness tolerances',
      'Critical experimental parameters and impact justifications',
      'Planetary physical divergence caveats',
    ],
    resolution: 'Protocol benchmark standard',
    units: 'Degrees, Mohs, wt%, MPa',
    coordinateReferenceSystem: 'N/A (Conceptual / Mission Requirement Baseline)',
    limitations: 'Focuses on robotic mobility, coring, spectroscopy, and speleology; does not cover full human life support infrastructure.',
    lastUpdated: '2026-11-13',
    license: 'CC-BY 4.0',
  },
]

