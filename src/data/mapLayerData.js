/**
 * AEROKRYPT - Map Layer Definitions & Planetary Data Taxonomy
 * 
 * Defines all available visual map services (MAP_SERVICE) and documented
 * dataset specifications (METADATA_ONLY) across Earth, Mars, and Moon.
 */

export const BASEMAP_DEFINITIONS = {
  // Earth Layers
  earthDark: {
    id: 'earthDark',
    name: 'CartoDB Dark Matter',
    body: 'Earth',
    type: 'MAP_SERVICE',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19,
    description: 'Pre-rendered high-contrast vector cartographic basemap.',
    crs: 'EPSG:3857 (WGS 84 / Pseudo-Mercator)',
  },
  earthSatellite: {
    id: 'earthSatellite',
    name: 'ESRI World Imagery Satellite',
    body: 'Earth',
    type: 'MAP_SERVICE',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics & USGS EROS',
    maxZoom: 18,
    description: 'High-resolution global satellite photography mosaic.',
    crs: 'EPSG:3857 (WGS 84 / Web Mercator)',
  },
  earthTopo: {
    id: 'earthTopo',
    name: 'OpenTopoMap Contour Relief',
    body: 'Earth',
    type: 'MAP_SERVICE',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (CC-BY-SA) & SRTM Altimetry',
    subdomains: 'abc',
    maxZoom: 17,
    description: 'Shaded topographic relief with elevation contour intervals.',
    crs: 'EPSG:3857 (WGS 84)',
  },
  earthUsgs: {
    id: 'earthUsgs',
    name: 'USGS 3D Elevation Program (3DEP)',
    body: 'Earth',
    type: 'METADATA_ONLY',
    attribution: '&copy; USGS National Geospatial Program',
    description: '1-meter to 1/3-arc-second terrestrial LiDAR DTM specification. Client binary raster ingestion is planned.',
    crs: 'NAD83 / WGS 84 UTM Projected',
  },
  earthCopernicus: {
    id: 'earthCopernicus',
    name: 'Copernicus Global DEM (GLO-30)',
    body: 'Earth',
    type: 'METADATA_ONLY',
    attribution: '&copy; European Space Agency / Copernicus',
    description: '30-meter global radar digital elevation model. Direct cloud STAC streaming is planned.',
    crs: 'WGS 84 / EGM96 Geoid',
  },

  // Mars Layers
  marsMola: {
    id: 'marsMola',
    name: 'NASA Mars MOLA Elevation Colorized',
    body: 'Mars',
    type: 'MAP_SERVICE',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0//default/default028mm/{z}/{y}/{x}.jpg',
    attribution: '&copy; NASA / JPL-Caltech / GSFC / USGS Astrogeology [MAP_SERVICE]',
    maxZoom: 7,
    description: 'Mars Global Surveyor MOLA 128 px/deg shaded color altimetry mosaic referenced to the gravitational equipotential areoid.',
    crs: 'IAU2000:49900 (MOLA Gravitational Equipotential Areoid: U₀ = 12,637,273 m²/s²; distinct from historical 610 Pa Viking pressure datum)',
  },
  marsHrsc: {
    id: 'marsHrsc',
    name: 'ESA Mars Express HRSC Regional DTMs',
    body: 'Mars',
    type: 'METADATA_ONLY',
    attribution: '&copy; ESA / DLR / Freie Universität Berlin',
    description: '50-meter stereophotogrammetric DTM quadrangles for targeted valleys and deltas.',
    crs: 'Mars Sinusoidal / Areoid Datum',
  },
  marsCrism: {
    id: 'marsCrism',
    name: 'MRO CRISM Targeted Mineral Spectral Data',
    body: 'Mars',
    type: 'METADATA_ONLY',
    attribution: '&copy; NASA / JHU APL / PDS Geosciences',
    description: 'Compact Reconnaissance Imaging Spectrometer hyperspectral cubes (smectite/jarosite).',
    crs: 'MRO Planetocentric',
  },

  // Moon Layers
  moonWac: {
    id: 'moonWac',
    name: 'NASA Moon LRO WAC Global Photographic Mosaic',
    body: 'Moon',
    type: 'MAP_SERVICE',
    url: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0//default/default028mm/{z}/{y}/{x}.jpg',
    attribution: '&copy; NASA / GSFC / ASU / LRO Science Team [MAP_SERVICE]',
    maxZoom: 7,
    description: 'LRO Camera Wide Angle Camera 100-meter global surface reflectance mosaic.',
    crs: 'IAU2000:30100 (Mean Lunar Sphere R = 1,737.4 km)',
  },
  moonLola: {
    id: 'moonLola',
    name: 'NASA LRO LOLA Gridded Altimetry (GDR)',
    body: 'Moon',
    type: 'METADATA_ONLY',
    attribution: '&copy; NASA PDS Geosciences / GSFC',
    description: 'Orbital laser altimetry gridded relief and RMS pulse roughness.',
    crs: 'Lunar Mean Sphere Radius Datum',
  },
  moonLroc: {
    id: 'moonLroc',
    name: 'NASA LROC NAC Targeted Pit Crater DTMs',
    body: 'Moon',
    type: 'METADATA_ONLY',
    attribution: '&copy; NASA PDS Imaging Node / Arizona State University',
    description: '2-meter to 5-meter stereo elevation models for lunar skylights and crater rims.',
    crs: 'Lunar Topographic Polar / Equatorial',
  },
}

export const OPERATIONAL_MAP_SERVICES = Object.values(BASEMAP_DEFINITIONS).filter(
  (l) => l.type === 'MAP_SERVICE'
)

export const DOCUMENTED_DEM_SPECIFICATIONS = Object.values(BASEMAP_DEFINITIONS).filter(
  (l) => l.type === 'METADATA_ONLY'
)


