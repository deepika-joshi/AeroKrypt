# AEROKRYPT — Technical Verification & Real Data Integration Audit

**Date of Audit:** 2026-11-13  
**Auditor:** Antigravity (DeepMind Assistant)  
**Target Codebase:** AEROKRYPT (React 19 + Vite 8 + Leaflet 1.9 + Recharts 3.10)  
**Audit Purpose:** Rigorous verification of actual dataset availability, calculation inputs, map tile pipelines, permission architecture, dashboard metrics, and test assertion accounting.

---

## 1. Executive Summary & Audit Statement

> [!CAUTION]
> **Definitive Finding:** AEROKRYPT does **NOT** currently execute real raw dataset integration. There are no local raster DEM files (GeoTIFF, NetCDF, PDS IMG), no dynamic backend/client-side raster decoders, and no pixel-level elevation or roughness extractions.
>
> What is genuinely implemented is:
> 1. A **curated, peer-reviewed scientific metadata registry** (in `locationsData.js` and `planetaryTerrainData.js`) containing literature-derived summary metrics.
> 2. External **pre-rendered web tile services** (`MAP_SERVICE`) displaying visual shaded relief (NASA MOLA on Mars, NASA LRO WAC on Moon, CartoDB/ESRI/OpenTopoMap on Earth).
> 3. A **client-side prototype architecture** for site evaluation and research hub operations without backend authentication.

Describing this state as "integrated real datasets" or "PDS4 / USGS integrated pipelines" is scientifically inaccurate. This document provides a transparent, factual accounting of what genuinely functions, what was corrected, and what remains future milestone work.

---

## 2. Dataset Integration Audit & Taxonomy

Every claimed dataset across `datasetInventory.js`, `planetaryTerrainData.js`, `locationsData.js`, and `InteractiveMap.jsx` has been audited against the required classification standard:

| Dataset Identifier | Claimed Dataset Name | Coverage | Source Agency & URL | Local File Present? | Remote Data Fetch? | Pixel / Vector Extraction? | Classification | Actual Technical Role in Application |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mola-megdr-global` | MGS MOLA MEGDR Topography (128 px/deg) | Mars Global | NASA PDS Geosciences / GSFC <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/) | **No** (0 bytes local) | **No** (No binary IMG/GeoTIFF fetched) | **No** | **MAP_SERVICE** (visual) / **METADATA_ONLY** (metrics) | Rendered as JPEG image tiles in Leaflet from NASA Treks WMTS. Summary slope/relief values in `planetaryTerrainData.js` are static JSON scalars. |
| `hrsc-dtm-regional` | Mars Express HRSC Digital Terrain Models | Mars Targeted Quadrangles | ESA PSA / DLR <br>[archives.esac.esa.int](https://archives.esac.esa.int/psa/#!Table%20View/HRSC=instrument) | **No** | **No** | **No** | **METADATA_ONLY** | No tiles and no raster files loaded. Literature slope limits for Jezero Delta benches cited in metadata. |
| `crism-mineral-maps` | MRO CRISM Targeted Mineral Spectral Data | Mars Targeted Sites | NASA PDS Geosciences / JHU APL <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/missions/mro/crism.htm) | **No** | **No** | **No** | **METADATA_ONLY** / **REFERENCE_ONLY** | No spectral cubes (.lbl/.img) loaded. Mineral names (smectite, jarosite) recorded as string arrays in JSON. |
| `lola-gdr-global` | LRO LOLA Gridded Data Record (GDR) | Moon Global | NASA PDS Geosciences / GSFC <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/lro/lro-l-lola-4-gdr-v1/) | **No** | **No** | **No** | **METADATA_ONLY** | Previous tile endpoint returned HTTP 404. Relief and RMS roughness are static JSON scalars in `planetaryTerrainData.js`. |
| `lro-wac-mosaic` | LRO Camera Wide Angle Camera Global Mosaic | Moon Global | NASA GSFC / ASU / LRO Mission <br>[trek.nasa.gov](https://trek.nasa.gov) | **No** | **Yes** (HTTP 200 JPEG tiles) | **No** | **MAP_SERVICE** | Pre-rendered photographic tiles loaded in Leaflet for Lunar basemap exploration. |
| `lroc-nac-dtm-targeted` | LROC NAC Stereo Digital Terrain Models | Moon Targeted Pits / Rims | NASA PDS Imaging / ASU <br>[wms.lroc.asu.edu](https://wms.lroc.asu.edu/lroc/rdr_product_select) | **No** | **No** | **No** | **METADATA_ONLY** | No DTM rasters loaded. Cave dimensions and boulder limits cited in text. |
| `usgs-3dep-elev` | USGS 3D Elevation Program (3DEP) | Earth Terrestrial Sites | USGS National Geospatial Program <br>[usgs.gov/3dep](https://www.usgs.gov/3d-elevation-program) | **No** | **No** | **No** | **METADATA_ONLY** | No Cloud-Optimized GeoTIFFs (COG) streamed. Elevation and slope for Earth sites are static scalars in `locationsData.js`. |
| `copernicus-dem` | Copernicus 30m Global DEM (GLO-30) | Earth Global | ESA / Copernicus <br>[spacedata.copernicus.eu](https://spacedata.copernicus.eu/) | **No** | **No** | **No** | **METADATA_ONLY** / **REFERENCE_ONLY** | Referenced in layer information banner; no raster tiles or COG queries connected. |
| `sentinel-2` | Sentinel-2 MSI Surface Reflectance | Earth Global | ESA Copernicus / USGS EROS <br>[browser.dataspace.copernicus.eu](https://browser.dataspace.copernicus.eu/) | **No** | **No** | **No** | **REFERENCE_ONLY** | Cited in metadata; no multi-spectral bands loaded. |
| `carto-dark` | CartoDB Dark Matter | Earth Global | CARTO / OpenStreetMap | **No** | **Yes** (HTTP 200 PNG tiles) | **No** | **MAP_SERVICE** | Working external Leaflet basemap. |
| `esri-imagery` | ESRI World Imagery | Earth Global | ESRI / Maxar / Earthstar | **No** | **Yes** (HTTP 200 JPEG tiles) | **No** | **MAP_SERVICE** | Working external satellite basemap. |
| `open-topo-map` | OpenTopoMap Contour Relief | Earth Global | OpenTopoMap / SRTM | **No** | **Yes** (HTTP 200 PNG tiles) | **No** | **MAP_SERVICE** | Working external topographic contour basemap. |
| `terralab-locations` | Audited Analogue Locations Registry | 6 Earth Sites | Peer-reviewed publications | **Yes** (`locationsData.js`) | Local Module | Static JSON | **ACTUAL_LOCAL_DATA** (Curated Registry) | Local structured JavaScript registry verified against peer-reviewed citations. |
| `mission-objectives` | Mission ConOps Requirements Registry | 5 Protocols | NASA ConOps / Analogue literature | **Yes** (`missionObjectives.js`) | Local Module | Static JSON | **ACTUAL_LOCAL_DATA** (Protocol Registry) | Local structured JavaScript registry defining operational envelope limits. |

---

## 3. Planetary Terrain Comparison Technical Verification

An inspection of `src/services/terrainAnalysisService.js` was conducted to establish whether values are derived from actual dataset measurements or heuristics:

### 3.1 Parameter Audit

1. **Elevation & Local Topographic Relief ($\Delta h$):**
   - *Planetary Input:* `planetaryTerrain.elevation.localReliefM` (static scalar cataloged from MOLA/LOLA literature).
   - *Earth Input:* Previously computed via an arbitrary heuristic (`slope.typicalDeg * 25`). Corrected to use cataloged regional relief bounds.
   - *Reference Surfaces:*
     - Mars: MOLA Areoid equipotential datum ($0\,\text{m} = 610\,\text{Pa}$).
     - Moon: Mean Lunar Sphere ($R = 1,737.40\,\text{km}$).
     - Earth: WGS 84 Ellipsoid / EGM96 Geoid.
   - *Limitation:* Raw geodetic elevation cannot be compared or subtracted directly across celestial bodies. Comparison is strictly limited to local relief scale ($\Delta h$).

2. **Topographic Slope Gradient:**
   - *Planetary Input:* `planetaryTerrain.slope.typicalDeg` and `planetaryTerrain.slope.maxDeg` (derived from MOLA 128 px/deg and HRSC 50m DTM literature).
   - *Earth Input:* `earthLocation.slope.typicalDeg` and `earthLocation.slope.maxDeg` (cataloged from in-situ field surveys and regional DEMs).
   - *Method:* Direct comparison of typical and maximum gradient envelopes against the mission vehicle's operational limit (`maxSlopeThreshold`).
   - *Status Taxonomy:* Evaluated as `COMPLIANT`, `CORRIDOR_RESTRICTED`, or `EXCEEDS_VEHICLE_SAFETY_LIMIT`.

3. **Surface Roughness & Micro-Relief:**
   - *Planetary Input:* `planetaryTerrain.surfaceRoughness.rmsSlopeDeg` (MOLA/LOLA orbital laser pulse-width and baseline roughness).
   - *Earth Input:* Previously generated using an arbitrary formula (`typicalDeg * 0.65`). **Removed.**
   - *Correction:* Earth sub-meter roughness is cataloged as `EARTH_DATA_GAPS_UNCATALOGED`. Satellite DEMs cannot resolve sub-meter boulders; in-situ photogrammetry or micro-LiDAR is required.

4. **Geomorphology & Landforms:**
   - *Inputs:* Array of string descriptors (`morphologicalFeatures` vs `primaryLandform` and `morphologyType`).
   - *Method:* Substring regime matching with structural cave gating.
   - *Cave / Pyroduct Gate:* Verifies whether subterranean pyroducts (e.g. Marius Hills Skylight) are matched by intact Earth lava tubes (`earthLocation.hasLavaTubes`).

5. **Lithology & Geochemistry:**
   - *Inputs:* String arrays of secondary minerals and substrate classes.
   - *Method:* Classification of mineral presence (`GEOCHEMICAL_PROXY_PRESENT` vs `DISTINCT_LITHOLOGY`).

---

## 4. Removal of Unsupported Scoring

In accordance with Milestone 2's scientific scoring policy ("*Scoring Policy: explicitly disclaims arbitrary composite suitability scores*"), the following ungrounded calculations were identified and removed:

1. **Arbitrary Composite Weighting Formula:**
   $$\text{Deleted:} \quad 0.30 \times S_{\text{slope}} + 0.20 \times S_{\text{roughness}} + 0.25 \times S_{\text{morphology}} + 0.25 \times S_{\text{lithology}}$$
   *Rationale:* Assigning fixed arbitrary weights (30%, 20%, 25%, 25%) to non-commensurable physical domains creates pseudo-precise composite percentages (e.g., "82% similarity") with no basis in planetary science.
2. **Fabricated Heuristic Coefficients:**
   - `100 - deltaSlopeTyp * 6.5` — **Removed.**
   - `slopeSafetyPenalty = 35` and `slopeSafetyPenalty = 15` — **Removed.**
   - `earthRoughnessProxy = typicalDeg * 0.65` and `deltaRoughness * 9` — **Removed.**
   - `morphologyPenalty = 45` and `sharedFeatureCount * 35 + 20` — **Removed.**
3. **Replacement Methodology:**
   - Multi-factor compliance is presented as **independent domain-by-domain audits** (Slope, Roughness, Morphology, Lithology, Relief).
   - Suitability is categorized as `HIGH_SUITABILITY` (High Dual Alignment), `PARTIAL_SUITABILITY` (Corridor Restricted / Lithological Proxy Only), or `LOW_SUITABILITY` (Divergent).
   - Missing data (such as terrestrial sub-meter roughness) is explicitly marked as `EARTH_DATA_GAPS_UNCATALOGED` rather than populated with an invented value.

---

## 5. Interactive Map Layer Technical Verification

Live HTTP requests were executed using Node.js to verify the tile URLs configured in `InteractiveMap.jsx`:

1. **NASA Mars MOLA Colorized Elevation:**
   - URL: `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0//default/default028mm/0/0/0.jpg`
   - Response: **HTTP 200 (Content-Type: `image/jpeg`)**.
   - Classification: `MAP_SERVICE` (Functional pre-rendered visual basemap).
2. **NASA Moon LOLA Elevation Shaded Relief (Previous URL):**
   - URL: `https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0//default/default028mm/0/0/0.jpg`
   - Response: **HTTP 404 (Not Found)**.
   - Finding: The previously hardcoded LOLA WMTS path was dead.
3. **Moon Tile Layer Correction:**
   - Updated URL: `https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0//default/default028mm/0/0/0.jpg`
   - Response: **HTTP 200 (Content-Type: `image/jpeg`)**.
   - Updated Layer Name: `NASA Moon LRO WAC Global Photographic Mosaic [MAP_SERVICE]`.
4. **Earth Basemaps:**
   - CartoDB Dark Matter: **HTTP 200 OK** (`MAP_SERVICE`).
   - ESRI World Imagery: **HTTP 200 OK** (`MAP_SERVICE`).
   - OpenTopoMap: **HTTP 200 OK** (`MAP_SERVICE`).
5. **Technical Disclosure:**
   - The map component does **not** evaluate elevation grids at click coordinates.
   - Leaflet operates purely on visual PNG/JPG raster tiles.
   - An explicit notice has been added to the map interface: `[MAP_SERVICE: Pre-rendered visual tiles; not a local raw raster DTM]`.

---

## 6. Research Hub Permissions & Security Audit

An audit of `src/components/research-hub/ResearchHub.jsx` and `src/services/researchRecordService.js` established:

- **Backend / Authentication:** **None.** AEROKRYPT is a client-side Vite SPA with no backend server, no database, and no auth provider (JWT, OAuth, or session cookies).
- **Role Enforcement:** The toggle between `VIEWER` and `RESEARCHER` is stored solely in browser `localStorage` (`aerokrypt_user_role_v1`).
- **Data Persistence:** Custom experiments and evaluation records are serialized to `localStorage` strings.
- **Security Reality:** Any user can modify client-side storage via browser DevTools.
- **Corrections Made:**
  - Renamed `SECURITY ROLE:` to `DEMO CLIENT ROLE:`.
  - Added an explicit **Architectural Prototype Notice** in the Researcher Workspace disclosing that authentication is client-side only and records are unencrypted.

---

## 7. Dashboard Metrics Verification

The metrics displayed in `src/components/dashboard/PlatformOverview.jsx` and `DataSourcesCard.jsx` were audited to prevent misleading representations:

| Previous Dashboard Metric Label | Previous Claimed Value | Audit Finding | Corrected Metric Label | Corrected Value & Justification |
| :--- | :--- | :--- | :--- | :--- |
| "Mars & Moon Terrain Datasets" | 11 MOLA & LOLA Sets | Catalog entries were described as integrated datasets, when they are static metadata summaries. | **Planetary Terrain Profiles** | 11 Cataloged Profiles (`METADATA_ONLY`). Subtext explicitly states they are regional summary profiles. |
| "Mission Objectives & Experiments" | 12 Documented Experiments | Mission ConOps requirements were counted as completed experiments. | **Mission ConOps Protocols** | 5 Standard Protocols (`MISSION_OBJECTIVES.length`). |
| "Completed Site Evaluations" | 4 Completed Evaluations | Curated literature benchmarks were counted as user-completed site evaluations. | **Literature Benchmarks & Records** | 4 Indexed Records (seed benchmarks from literature + user-saved records). |
| "Authoritative Datasets" | 8 Authoritative Datasets | Static catalog specifications were presented as active data pipelines. | **PDS4 / USGS Dataset Specifications** | 8 Documented Layers (archive specifications, CRS, and datum references). |
| "Recently Updated Datasets & Integrated Pipelines" | Banner Card | No live data pipelines exist. | **Cataloged External Datasets & Specifications** | Card discloses that layers are `MAP_SERVICE` or `METADATA_ONLY`. |

---

## 8. Test Suite Verification & Assertion Discrepancy Resolution

### 8.1 Independent Test Runs

Each test file was executed independently with `node --test`:

```powershell
node --test test/matcher-audit.test.mjs
```
- **Exit Code:** `0` (Success)
- **Reported Top-Level Test Cases:** `1`
- **Internal Assertions Executed:** **49 passed** (Positive scenarios: 5, Negative/edge cases: 6, Citation checks: 38).

```powershell
node --test test/site-evaluation.test.mjs
```
- **Exit Code:** `0` (Success)
- **Reported Top-Level Test Cases:** `1`
- **Internal Assertions Executed:** **144 passed** (Geodesy: 18, Parameters: 96, Dual suitability: 4, Missing params: 4, Divergence: 5, Synthesis: 17).

```powershell
node --test test/platform-restructuring.test.mjs
```
- **Exit Code:** `0` (Success)
- **Reported Top-Level Test Cases:** `5`
- **Individual Assertions Executed:** **26 passed** (Navigation: 6, Inventory: 9, Planetary datasets: 5, Terrain engine: 4, Research Hub: 2).

### 8.2 Discrepancy Resolution

The previous turn summary reported:
> *"144 / 144 assertions passed."* followed by *"149 total assertions".*

**Root Cause of Discrepancy:**
The previous summary conflated the **144 internal assertions** reported by `site-evaluation.test.mjs` with the **5 top-level `test(...)` blocks** of `platform-restructuring.test.mjs` ($144 + 5 = 149$), completely omitting the 49 assertions in `matcher-audit.test.mjs` and the individual assertions within `platform-restructuring.test.mjs`.

**Actual True Totals:**
- `test/matcher-audit.test.mjs`: **49 assertions**
- `test/site-evaluation.test.mjs`: **144 assertions**
- `test/platform-restructuring.test.mjs`: **26 assertions**
- **Grand Total: 219 individual assertions across 7 test suites, 100% passing (0 failures).**

### 8.3 Linter & Build Verification

```powershell
npm.cmd run lint
```
- **Output:** `Found 0 warnings and 0 errors.` (48 files scanned with 104 rules).

```powershell
npm.cmd run build
```
- **Output:** `vite build` completed in **804ms**; bundle generated cleanly (`dist/assets/index-kudACdBy.js` 1,080 kB, `dist/index.html` 0.45 kB).

---

## 9. Boundary: What Genuinely Works vs. What is a Prototype

```
+---------------------------------------------------------------------------------------------------+
|                                AEROKRYPT SYSTEM STATUS MATRIX                                     |
+---------------------------------------------------------------------------------------------------+
|  FEATURE / SUBSYSTEM           | ACTUAL STATUS        | TECHNICAL REALITY                         |
+--------------------------------+----------------------+-------------------------------------------+
|  5-Section Navigation          | PRODUCTION READY     | Pure React state routing via AppLayout.   |
|  Earth Location Registry       | PRODUCTION READY     | Curated, audited, peer-reviewed JSON.     |
|  Geodetic Coordinates & BBoxes | PRODUCTION READY     | WGS 84 surveyed bounds (ASMA/ASPA/parks). |
|  Evidence Registry & DOIs      | PRODUCTION READY     | Audited DOIs mapped to exact claims.      |
|  Dual Suitability Assessment   | PRODUCTION READY     | Separates geology from operational slope. |
|  Missing Data Disclosures      | PRODUCTION READY     | Flags missing in-situ cohesion/roughness. |
|  Earth Basemap Visualizer      | PRODUCTION READY     | Working CartoDB/ESRI/OpenTopoMap tiles.   |
|  Mars Basemap Visualizer       | PRODUCTION READY     | Working NASA MOLA Treks WMTS (200 OK).    |
|  Moon Basemap Visualizer       | PRODUCTION READY     | Working NASA LRO WAC Treks WMTS (200 OK). |
|  Client Dossier / JSON Export  | PRODUCTION READY     | Browser Blob/download generation.         |
|                                |                      |                                           |
|  Research Hub Permissions      | PROTOTYPE ONLY       | Client-side localStorage toggle; no auth. |
|  Research Records Database     | PROTOTYPE ONLY       | Stored in browser localStorage.           |
|  Planetary Terrain Comparison  | PROTOTYPE (Metadata) | Evaluates static summary scalars, not DEM.|
|                                |                      |                                           |
|  Raw Raster DEM Ingestion      | NOT IMPLEMENTED      | No GeoTIFF/NetCDF binary parser.          |
|  Client-Side Altimetry Query   | NOT IMPLEMENTED      | No altimetry extracted from map tiles.    |
|  PDS4 / USGS Live REST API     | NOT IMPLEMENTED      | No backend ingestion pipeline.            |
+---------------------------------------------------------------------------------------------------+
```

---
*Certified by AEROKRYPT Technical Audit & Verification Process*

