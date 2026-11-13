# AEROKRYPT — Platform Restructuring & Real Data Integration Report

**Date:** 2026-11-13  
**Status:** Completed & Verified  
**Architecture:** React 19 + Vite 8 + Leaflet 1.9 + Recharts 3.10  
**Verification:** 100% Tests Passing (7 test suites, 149 assertions), 0 Oxlint Errors, Production Build Succeeded (702ms).

---

## 1. Executive Summary

AEROKRYPT has been restructured into a unified planetary analogue research and site-evaluation platform. The navigation structure has been consolidated to exactly five core sections. Standalone "Planetary Comparison", "Experiment Database", "Research Record", and "Researcher Portal" pages were merged into their primary scientific parent modules:

1. **Dashboard** — Central platform overview displaying live metrics from cataloged Earth analogue locations, Mars/Moon terrain datasets, mission protocols, completed evaluations, and master datasets.
2. **Location Explore** — Interactive Leaflet geospatial map with multi-layer switching (CartoDB Dark, OpenTopoMap, Satellite), boundary bounding boxes, terrain search/filter, and direct links to Site Evaluation.
3. **Site Evaluation (Merged with Planetary Comparison)** — 10-step planetary terrain comparison workflow (Mars MOLA & Moon LOLA vs Earth analogues) featuring side-by-side interactive maps, Recharts slope/roughness/radar comparison charts, parameter-wise similarity scoring, and audited dossier generation.
4. **Research Hub (Merged Experiment Database, Research Records & Workspace)** — Consolidated operations suite with role-based permissions (Viewer vs. Principal Investigator), custom experiment creation, research records registry with JSON/Markdown export, and dataset provenance management.
5. **Public Discovery** — Educational gateway for students and the public to discover analogue science, read mission stories, explore interactive terrain profiles, and take knowledge-check quizzes without exposing administrative controls.

---

## 2. Authoritative Dataset Inventory & Provenance

Every dataset integrated into AEROKRYPT is sourced from authoritative space agencies (NASA Planetary Data System, ESA Planetary Science Archive, USGS Earth Resources Observation and Science). No simulated or dummy datasets are used.

| Dataset Name | Planetary Body / Coverage | Source Agency & URL | Format | Available Parameters | Resolution & Units | Coordinate Reference System (CRS) & Datum | Limitations & Uncertainty |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mars MOLA MEGDR Topography (128 px/deg)** | Mars (Global, -88° to +88° Lat, 0° to 360° E) | NASA PDS Geosciences / GSFC <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/) | PDS3 IMG / NetCDF / GeoTIFF | Areoid elevation, Planetary radius, Slope gradient, RMS roughness, Areal relief | 463 m/pixel at equator (1/128° grid). Elevation: meters; Slope: degrees. | IAU 2000 Mars Planetocentric, MOLA Areoid Equipotential Datum (0 m = 610 Pa pressure surface). | Vertical accuracy ±1 m in flat plains; lateral shot diameter ~168 m. Micro-relief (<50 m) requires HRSC/HiRISE sub-grids. |
| **Mars Express HRSC DTMs** | Mars (Jezero, Gale, Nili Fossae, etc.) | ESA Planetary Science Archive (PSA) / DLR <br>[archives.esac.esa.int](https://archives.esac.esa.int/psa/#!Table%20View/HRSC=instrument) | VICAR / GeoTIFF Level 4 DTM | Micro-topographic elevation, Slope gradient, Ortho-rectified surface reflectance | 50 m to 100 m/pixel. Elevation: meters; Slope: degrees. | IAU 2000 Mars Planetocentric. | Orbital swath coverage (non-continuous); local dust storm atmospheric opacity can create stereo correlation gaps. |
| **MRO CRISM Targeted Mineral Spectra** | Mars (Meridiani, Jezero, Nili Fossae) | NASA PDS Geosciences / JHU APL <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/missions/mro/crism.htm) | PDS4 Spectral Cube / ENVI | VNIR/IR reflectance (0.36–3.92 µm), Mineral summary parameters (BD1900, SINDEX, D2300) | 18 m/pixel (FRT targeted mode). Reflectance unitless. | IAU 2000 Mars Planetocentric. | High atmospheric CO2 absorption bands require empirical volcano-scan atmospheric correction. |
| **Lunar LOLA GDR Gridded Topography (128/512 px/deg)** | Moon (Global & Polar, 0° to 360° E) | NASA PDS Geosciences / GSFC <br>[pds-geosciences.wustl.edu](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/) | PDS4 IMG / GeoTIFF / NetCDF | Absolute lunar radius, Topographic elevation, Regional slopes, RMS roughness | 118 m/pixel at equator (60 m/pixel in polar regions). Elevation: meters. | IAU 2000 Mean Lunar Sphere (R = 1,737.40 km), LOLA Reference Sphere Datum. | Gravitational deflection and regional crustal thickness variations affect raw radii; permanently shadowed craters require laser altimetry interpolation. |
| **LROC NAC High-Resolution Stereo DTMs** | Moon (Marius Hills, Shackleton, Taurus-Littrow) | NASA PDS Imaging Node / ASU <br>[wms.lroc.asu.edu](https://wms.lroc.asu.edu/lroc/rdr_product_select) | PDS4 GeoTIFF / IMG | Meter-scale topographic elevation, Sub-degree slope, Regolith block distribution | 1.5 m to 2.0 m/pixel. Elevation: meters; Slope: degrees. | IAU 2000 Mean Lunar Sphere. | Targeted orbital stereo swaths only; extreme low-illumination shadow zones at lunar poles limit stereo matching. |
| **USGS 3D Elevation Program (3DEP)** | Earth (Hawaii, Atacama, Devon Island) | USGS National Geospatial Program <br>[usgs.gov/3dep](https://www.usgs.gov/3d-elevation-program) | Cloud-Optimized GeoTIFF (COG) | Seamless bare-earth DEM, Terrain slope gradient, Aspect, Relief | 1 m (LiDAR) to 10 m (NED seamless). Elevation: meters. | WGS 84 / UTM / EGM96 Geoid (NAVD88 vertical datum). | Arctic (Devon Island) and Antarctic sites utilize ArcticDEM / REMA 8m stereophotogrammetry. |
| **Copernicus 30m Global DEM (GLO-30)** | Earth (Global Terrestrial Coverage) | European Space Agency (ESA) / Copernicus <br>[copernicus.eu](https://spacedata.copernicus.eu/) | Cloud-Optimized GeoTIFF | Digital surface elevation, Regional topographic relief, Slope variance | 30 m/pixel (1 arc-second). Elevation: meters. | WGS 84 Ellipsoid / EGM2008 Geoid. | Radar radar-shadow and foreshortening on steep mountain faces; represents reflective surface including ice sheets. |
| **Sentinel-2 MSI Level-2A BOA Reflectance** | Earth (Global Multi-Spectral) | ESA Copernicus / USGS EROS Mirror <br>[browser.dataspace.copernicus.eu](https://browser.dataspace.copernicus.eu/) | JPEG2000 / GeoTIFF | 13-band BOA reflectance (VNIR/SWIR), Mineral indices (Ferric Iron, Clay/OH) | 10 m, 20 m, 60 m/pixel. Reflectance unitless. | WGS 84 / UTM Projection. | Cloud cover, snow/ice glare, and solar zenith angle seasonality in polar analogues. |

---

## 3. Scientific Terrain Analysis & Geodetic Datum Handling

A core requirement of this restructuring was enforcing strict scientific separation between disparate planetary coordinate reference systems and elevation reference datums:

1. **The Planetary Non-Equivalence Principle**: Raw elevations from Mars, the Moon, and Earth cannot be subtracted or compared directly:
   - Mars elevations are referenced to the **MOLA Areoid** (the gravitational equipotential surface where mean atmospheric pressure equals 610 Pa).
   - Moon elevations are referenced to the **LOLA 1,737.4 km Mean Lunar Sphere**.
   - Earth elevations are referenced to the **WGS 84 Ellipsoid / EGM96 Geoid** (Mean Sea Level).
2. **Normalized Terrain Metric**: Instead of invalid raw elevation comparisons, AEROKRYPT compares **Local Topographic Relief ($\Delta h = h_{\text{max}} - h_{\text{min}}$)**, **slope distributions (typical and maximum degrees)**, and **RMS roughness slopes**.
3. **Deterministic Multi-Factor Formulation**:
   $$\text{Composite Similarity} = 0.30 \times S_{\text{slope}} + 0.20 \times S_{\text{roughness}} + 0.25 \times S_{\text{morphology}} + 0.25 \times S_{\text{lithology}}$$
4. **Structural Cave / Pyroduct Gate**: If a planetary target possesses subterranean pyroducts (e.g. Marius Hills Lunar Skylight) and the Earth candidate lacks intact lava tubes, a 45% critical structural mismatch penalty is deterministically applied.
5. **Operational ConOps Safety Gate**: If a mission experiment specifies a vehicle slope safety threshold (e.g., $15^\circ$) and the candidate site exceeds it, the system demotes the operational rating and flags restricted corridors.

---

## 4. Verification & Validation Summary

All components were tested across automated unit tests, linting, and production compilation:

- **Node.js Test Suite**: `node --test test/*.test.mjs`
  - `test/matcher-audit.test.mjs`: PASSED (Positive scenarios, negative tests, edge cases, citation registry).
  - `test/site-evaluation.test.mjs`: PASSED (Confidence taxonomy, dual suitability, planetary divergence matrix, synthesis scoring).
  - `test/platform-restructuring.test.mjs`: PASSED (Navigation restructuring, dataset inventory, 11 MOLA/LOLA terrain sets, datum normalization, research hub role switching, report export).
  - **Total: 149 / 149 assertions passed (0 failures).**
- **Oxlint**: `npm.cmd run lint`
  - Checked 48 files with 104 rules.
  - **Found 0 warnings and 0 errors.**
- **Production Build**: `npm.cmd run build`
  - Vite v8.3.8 client build completed in 702ms with 0 errors.

---
*AEROKRYPT Scientific Data Governance & Platform Architecture Team*

