/**
 * TERRALAB - Milestone 2: Detailed Site Evaluation Test Suite
 * 
 * Verifies:
 * 1. Geographic boundaries and geodetic data across all 6 analogue locations.
 * 2. Detailed parameter extraction and confidence classification auditing.
 * 3. Separation of geological similarity from operational testing suitability.
 * 4. Identification of missing critical parameters and "Why It Matters" justifications.
 * 5. Deterministic planetary physical divergence matrix (Earth 1.0G vs. 0.38G/0.166G).
 * 6. Synthesis assessment without arbitrary scalar scores.
 */

import { ANALOGUE_LOCATIONS } from '../src/data/locationsData.js'
import {
  getSiteDetailedParameters,
  getPlanetaryDivergenceData,
  evaluateSite,
} from '../src/services/siteAssessment.js'

let totalTests = 0
let passedTests = 0

function assert(condition, testName, details = '') {
  totalTests++
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`)
    passedTests++
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`)
    process.exitCode = 1
  }
}

console.log('=================================================================')
console.log('TERRALAB MILESTONE 2: DETAILED SITE EVALUATION AUDIT SUITE')
console.log('=================================================================\n')

// ------------------------------------------------------------------
// SECTION 1: GEOGRAPHICAL BOUNDARIES & GEODETIC METADATA
// ------------------------------------------------------------------
console.log('SECTION 1: Geographical Boundaries & Geodesy Verification')

for (const loc of ANALOGUE_LOCATIONS) {
  const geo = loc.geographicBoundaries
  assert(
    geo && geo.boundingBox && geo.geodeticDatum && geo.coverageAreaKm2 && geo.jurisdiction,
    `Geodesy: ${loc.id} has complete boundary coordinates, datum, and jurisdiction`,
    `Incomplete geo metadata for ${loc.id}`
  )
  assert(
    geo.boundingBox.north && geo.boundingBox.south && geo.boundingBox.west && geo.boundingBox.east,
    `Bounding Box: ${loc.id} defines N/S/E/W boundary limits`,
    'Missing bounding box coordinate'
  )
  assert(
    geo.geodeticDatum === 'WGS 84',
    `Datum: ${loc.id} is calibrated to standard WGS 84 ellipsoid`,
    `Unexpected datum ${geo.geodeticDatum}`
  )
}

// ------------------------------------------------------------------
// SECTION 2: ENVIRONMENTAL PARAMETER EXTRACTION & CONFIDENCE
// ------------------------------------------------------------------
console.log('\nSECTION 2: Parameter Extraction & Confidence Audit')

const validConfidences = ['MEASURED', 'SOURCED', 'ESTIMATED', 'UNAVAILABLE']

for (const loc of ANALOGUE_LOCATIONS) {
  const params = getSiteDetailedParameters(loc)
  assert(
    params.length >= 8,
    `Parameters: ${loc.id} yields >= 8 traceable environmental parameters (${params.length} found)`,
    `Got ${params.length}`
  )
  for (const p of params) {
    assert(
      validConfidences.includes(p.confidence),
      `Confidence: ${loc.id} parameter [${p.name}] has valid status (${p.confidence})`,
      `Invalid status ${p.confidence}`
    )
    assert(
      p.unit && p.coverage && p.period && p.citation && p.experimentalRelevance,
      `Metadata: ${loc.id} parameter [${p.name}] carries unit, location, period, citation, and relevance`,
      `Incomplete parameter metadata for ${p.name}`
    )
  }
}

// ------------------------------------------------------------------
// SECTION 3: SEPARATION OF GEOLOGY VS. OPERATIONAL SUITABILITY
// ------------------------------------------------------------------
console.log('\nSECTION 3: Separation of Geological Similarity from Operational Suitability')

// Test Case: Atacama Desert + Rover Mobility
{
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  const evalResult = evaluateSite(atacama, 'rover-mobility')

  assert(
    evalResult.geologicalSimilarity && evalResult.operationalSuitability,
    'Dual Assessment: Generates distinct geological and operational suitability domains',
    'Missing domain assessments'
  )
  assert(
    evalResult.geologicalSimilarity.lithologyMatch && evalResult.operationalSuitability.slopeStatus,
    'Dual Metrics: Separates lithological matching from slope compliance',
    'Missing domain metrics'
  )
  assert(
    evalResult.geologicalSimilarity.specificTargetRegion.includes('Gale') ||
      evalResult.geologicalSimilarity.specificTargetRegion.includes('Jezero'),
    'Geological Target: Links to specific desiccated Martian plains',
    'Target region mismatch'
  )
  assert(
    evalResult.operationalSuitability.slopeStatus === 'COMPLIANT',
    'Operational Slope: Evaluates flat playa slope against vehicle safety envelope',
    `Got ${evalResult.operationalSuitability.slopeStatus}`
  )
}

// ------------------------------------------------------------------
// SECTION 4: MISSING CRITICAL PARAMETERS & EXPERIMENTAL RELEVANCE
// ------------------------------------------------------------------
console.log('\nSECTION 4: Missing Critical Parameters & "Why It Matters" Justifications')

// Test Case 1: Rover mobility requires soil shear strength / cohesion
{
  const haughton = ANALOGUE_LOCATIONS.find((l) => l.id === 'haughton-crater')
  const evalResult = evaluateSite(haughton, 'rover-mobility')
  const missingCohesion = evalResult.missingCriticalParameters.find((m) =>
    m.parameterName.toLowerCase().includes('cohesion') || m.parameterName.toLowerCase().includes('strength')
  )

  assert(
    missingCohesion !== undefined,
    'Missing Parameters 1: Rover mobility flags uncataloged in-situ soil shear strength/cohesion',
    'Cohesion gap not flagged'
  )
  assert(
    missingCohesion && missingCohesion.experimentalImpact.includes('sinkage') && missingCohesion.experimentalImpact.includes('slip'),
    'Why It Matters 1: Explains scientific impact of missing cohesion on vehicle wheel sinkage and slip models',
    'Incomplete impact justification'
  )
}

// Test Case 2: Subsurface coring requires continuous cryogenic stability
{
  const mcmurdo = ANALOGUE_LOCATIONS.find((l) => l.id === 'mcmurdo-dry-valleys')
  const evalResult = evaluateSite(mcmurdo, 'subsurface-coring')
  const tempParam = evalResult.missingCriticalParameters.find((m) =>
    m.parameterName.toLowerCase().includes('temperature')
  )

  assert(
    tempParam !== undefined,
    'Missing Parameters 2: Subsurface coring checks subsurface temperature profile depth',
    'Cryo temperature profile gap not found'
  )
}

// Test Case 3: Lava tube exploration on site without lava tubes (Svalbard)
{
  const svalbard = ANALOGUE_LOCATIONS.find((l) => l.id === 'svalbard-bockfjorden')
  const evalResult = evaluateSite(svalbard, 'lava-tube-exploration')
  const caveGap = evalResult.missingCriticalParameters.find((m) =>
    m.parameterName.toLowerCase().includes('roof') || m.parameterName.toLowerCase().includes('internal geometry')
  )

  assert(
    caveGap && caveGap.currentStatus.includes('MISMATCH'),
    'Missing Parameters 3: Lava tube exploration on surface basalt flags structural cave mismatch',
    `Got ${caveGap?.currentStatus}`
  )
}

// ------------------------------------------------------------------
// SECTION 5: PLANETARY PHYSICAL DIVERGENCE MATRIX
// ------------------------------------------------------------------
console.log('\nSECTION 5: Planetary Physical Divergence Verification')

{
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  const divData = getPlanetaryDivergenceData(atacama, 'Mars')

  assert(
    divData.divergences.length === 5,
    'Planetary Matrix: Evaluates 5 physical divergence dimensions',
    `Got ${divData.divergences.length}`
  )
  const gravityDiv = divData.divergences.find((d) => d.parameter === 'Surface Gravity')
  assert(
    gravityDiv && gravityDiv.earthSite.includes('1.0G') && gravityDiv.planetaryTarget.includes('0.38G'),
    'Gravity Divergence: Validates Earth 1.0G (9.81 m/s²) vs. Mars 0.38G (3.72 m/s²)',
    'Gravity divergence incorrect'
  )
  const pressureDiv = divData.divergences.find((d) => d.parameter === 'Surface Atmospheric Pressure')
  assert(
    pressureDiv && pressureDiv.planetaryTarget.includes('0.6'),
    'Pressure Divergence: Validates Earth barometric pressure vs. Mars ~0.6 kPa CO2',
    'Pressure divergence incorrect'
  )
  const radiationDiv = divData.divergences.find((d) => d.parameter.includes('Radiation'))
  assert(
    radiationDiv && radiationDiv.impact.includes('UV-C') && radiationDiv.impact.includes('ozone'),
    'Radiation Divergence: Notes ozone layer absorption of solar UV-C on Earth',
    'Radiation impact incomplete'
  )
}

// ------------------------------------------------------------------
// SECTION 6: SYNTHESIS ASSESSMENT & NO SINGLE ARBITRARY SCORE
// ------------------------------------------------------------------
console.log('\nSECTION 6: Synthesis Assessment & Scoring Methodology Policy')

for (const loc of ANALOGUE_LOCATIONS) {
  const evalResult = evaluateSite(loc, null)
  const summary = evalResult.assessmentSummary

  assert(
    summary.keyStrengths.length > 0 &&
      summary.operationalLimitations.length > 0 &&
      summary.executionRisks.length > 0 &&
      summary.recommendedFieldMeasurements.length > 0,
    `Synthesis: ${loc.id} includes strengths, limitations, risks, and recommended field surveys`,
    'Incomplete synthesis quad-grid'
  )
  assert(
    typeof summary.scientificMethodologyNotice === 'string' &&
      summary.scientificMethodologyNotice.includes('does not output a composite percentage score'),
    `Scoring Policy: ${loc.id} explicitly disclaims arbitrary composite suitability scores`,
    'Missing methodology notice'
  )
}

console.log('\n=================================================================')
console.log(`TEST RUN COMPLETE: ${passedTests} / ${totalTests} assertions passed.`)
console.log('=================================================================')

if (passedTests === totalTests) {
  process.exit(0)
} else {
  process.exit(1)
}
