import test from 'node:test'
import assert from 'node:assert/strict'
import { NAVIGATION_SECTIONS } from '../src/data/navigationData.js'
import { MASTER_DATASET_INVENTORY } from '../src/data/datasetInventory.js'
import { PLANETARY_TERRAIN_DATASETS } from '../src/data/planetaryTerrainData.js'
import { ANALOGUE_LOCATIONS } from '../src/data/locationsData.js'
import { MISSION_OBJECTIVES } from '../src/data/missionObjectives.js'
import { compareTerrainParameters } from '../src/services/terrainAnalysisService.js'
import {
  getResearchRecords,
  saveEvaluationRecord,
  deleteResearchRecord,
  getAllExperiments,
  addCustomExperiment,
  getCurrentRole,
  setCurrentRole,
} from '../src/services/researchRecordService.js'

test('SECTION 1: Navigation Restructuring (Exactly 5 Main Modules)', () => {
  const ids = NAVIGATION_SECTIONS.map((item) => item.id)
  
  assert.equal(ids.length, 5, 'Navigation must contain exactly 5 top-level items')
  assert.deepEqual(
    ids,
    ['dashboard', 'location-explorer', 'site-evaluation', 'research-hub', 'public-discovery'],
    'Navigation IDs must match the 5 specified platform sections'
  )

  // Verify removed navigation items are not present
  const removedIds = ['planetary-comparison', 'experiment-database', 'research-records', 'researcher-portal']
  for (const removed of removedIds) {
    assert.equal(ids.includes(removed), false, `Standalone navigation item [${removed}] must be removed/merged`)
  }
})

test('SECTION 2: Authoritative Dataset Inventory & Provenance', () => {
  assert.ok(MASTER_DATASET_INVENTORY.length >= 7, 'Master dataset inventory contains all integrated datasets')

  const marsDatasets = MASTER_DATASET_INVENTORY.filter((d) => d.planetaryBody === 'Mars')
  const moonDatasets = MASTER_DATASET_INVENTORY.filter((d) => d.planetaryBody === 'Moon')
  const earthDatasets = MASTER_DATASET_INVENTORY.filter((d) => d.planetaryBody === 'Earth')

  assert.ok(marsDatasets.length >= 3, 'Mars datasets include MOLA, HRSC, CRISM')
  assert.ok(moonDatasets.length >= 2, 'Moon datasets include LOLA GDR, LROC')
  assert.ok(earthDatasets.length >= 2, 'Earth datasets include USGS 3DEP, Sentinel-2 / Copernicus')

  for (const ds of MASTER_DATASET_INVENTORY) {
    assert.ok(ds.name, `Dataset [${ds.id}] has a valid name`)
    assert.ok(ds.source, `Dataset [${ds.id}] cites authoritative source agency`)
    assert.ok(ds.dataFormat, `Dataset [${ds.id}] documents authentic data format`)
    assert.ok(ds.resolution, `Dataset [${ds.id}] documents spatial resolution`)
    assert.ok(ds.coordinateReferenceSystem, `Dataset [${ds.id}] documents CRS & datum`)
    assert.ok(ds.originalUrl.startsWith('http'), `Dataset [${ds.id}] has valid repository URL`)
    assert.ok(ds.limitations, `Dataset [${ds.id}] explicitly discloses data limitations`)
  }
})

test('SECTION 3: Planetary Terrain Datasets (Mars MOLA & Moon LOLA)', () => {
  assert.equal(PLANETARY_TERRAIN_DATASETS.length, 11, 'Catalog contains 11 authentic planetary terrain datasets')

  const marsCount = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Mars').length
  const moonCount = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Moon').length

  assert.equal(marsCount, 6, 'Contains 6 Mars terrain datasets (Jezero, Gale, Meridiani, etc.)')
  assert.equal(moonCount, 5, 'Contains 5 Moon terrain datasets (Marius Hills, Shackleton, Copernicus, etc.)')

  for (const terrain of PLANETARY_TERRAIN_DATASETS) {
    assert.ok(terrain.elevation.localReliefM > 0, `Terrain [${terrain.id}] has positive local relief Δh`)
    assert.ok(terrain.slope.typicalDeg >= 0, `Terrain [${terrain.id}] has typical slope`)
    assert.ok(terrain.slope.maxDeg >= terrain.slope.typicalDeg, `Max slope >= typical slope for [${terrain.id}]`)
    assert.ok(terrain.surfaceRoughness.rmsSlopeDeg > 0, `RMS roughness slope documented for [${terrain.id}]`)
    assert.ok(terrain.datumDescription, `Datum description documented for [${terrain.id}]`)
  }
})

test('SECTION 4: Scientific Terrain Analysis Engine & Planetary Datum Handling', () => {
  const haughton = ANALOGUE_LOCATIONS.find((l) => l.id === 'haughton-crater')
  const copernicus = PLANETARY_TERRAIN_DATASETS.find((d) => d.id === 'moon-copernicus-crater')
  const roverExp = MISSION_OBJECTIVES.find((o) => o.id === 'rover-mobility')

  assert.ok(haughton && copernicus && roverExp)

  const comparison = compareTerrainParameters(haughton, copernicus, roverExp)

  // 1. Transparent breakdown
  assert.ok(comparison.compositeSimilarity >= 75, 'Haughton Crater vs Copernicus Crater yields high terrain similarity (>=75%)')
  assert.equal(comparison.calculationBreakdown.length, 4, 'Includes 4 weighted terrain parameters')

  // 2. Relief normalization caveat
  assert.ok(comparison.reliefComparison.scientificCaveat.includes('Raw elevation datums differ fundamentally'))
  assert.equal(comparison.reliefComparison.earthDatum, 'WGS 84 / EGM96 Geoid')
  assert.ok(
    comparison.reliefComparison.planetDatum.includes('LOLA') ||
    comparison.reliefComparison.planetDatum.includes('Lunar')
  )

  // Verify Mars MOLA datum handling
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  const jezero = PLANETARY_TERRAIN_DATASETS.find((d) => d.id === 'mars-jezero-delta')
  const marsComp = compareTerrainParameters(atacama, jezero, roverExp)
  assert.ok(marsComp.reliefComparison.planetDatum.includes('MOLA Areoid'))

  // 3. Negative Gate: Lava tube structural requirement
  const mariusMoon = PLANETARY_TERRAIN_DATASETS.find((d) => d.id === 'moon-marius-hills-skylight')
  const svalbard = ANALOGUE_LOCATIONS.find((l) => l.id === 'svalbard-bockfjorden')
  const tubeComparison = compareTerrainParameters(svalbard, mariusMoon, null)

  assert.ok(
    tubeComparison.morphologyNotes.includes('CRITICAL STRUCTURAL MISMATCH'),
    'Morphology engine penalizes sites lacking intact lava tubes when planetary target is a pyroduct'
  )

  // 4. Slope safety threshold penalty
  const kilauea = ANALOGUE_LOCATIONS.find((l) => l.id === 'kilauea-basalts')
  const strictSlopeExp = { maxSlopeThreshold: 2.0 } // lower than Kilauea typical slope
  const slopePenaltyComp = compareTerrainParameters(kilauea, jezero, strictSlopeExp)
  const slopeRow = slopePenaltyComp.calculationBreakdown.find((r) => r.parameter.includes('Slope'))

  assert.ok(slopeRow.status.includes('EXCEEDS_VEHICLE_SAFETY_LIMIT') || slopeRow.status.includes('RESTRICTED'))
})

test('SECTION 5: Research Hub Service & Role-Based Workflows', () => {
  // Test role persistence
  setCurrentRole('RESEARCHER')
  assert.equal(getCurrentRole(), 'RESEARCHER', 'Role persists as RESEARCHER')
  setCurrentRole('VIEWER')
  assert.equal(getCurrentRole(), 'VIEWER', 'Role switches to VIEWER')
  setCurrentRole('RESEARCHER') // Restore

  // Test seed records
  const initialRecords = getResearchRecords()
  assert.ok(initialRecords.length >= 4, 'Research records include authentic benchmark peer-reviewed evaluations')

  // Test custom experiment addition
  const customExp = addCustomExperiment({
    title: 'Autonomous Sub-surface Coring in Volcanic Tephra',
    planetaryAnalogue: 'Mars',
    primaryFocus: 'Subsurface Coring',
    requiredTerrain: 'Layered tephra and basaltic ash',
    maxSlopeThreshold: 12,
    description: 'Drill penetration depth test without liquid coolant.',
  })
  assert.ok(customExp.id.startsWith('custom-exp-'), 'Generates unique custom experiment ID')

  const allExps = getAllExperiments()
  assert.ok(allExps.some((e) => e.id === customExp.id), 'Custom experiment is cataloged in database')

  // Test evaluation record save and delete
  const newRecord = saveEvaluationRecord({
    title: 'Test Copernicus Impact Regolith vs. Haughton Dolomite',
    targetBody: 'Moon',
    compositeSimilarity: 78,
    suitabilityLevel: 'HIGH_SUITABILITY',
    summary: 'Impact melt breccia morphological alignment test.',
  })
  assert.ok(newRecord.id.startsWith('eval-rec-'), 'Evaluation record generated')

  const afterSave = getResearchRecords()
  assert.ok(afterSave.some((r) => r.id === newRecord.id), 'Saved evaluation persists in records')

  const afterDelete = deleteResearchRecord(newRecord.id)
  assert.ok(!afterDelete.some((r) => r.id === newRecord.id), 'Record can be deleted by researcher')
})
