/**
 * TERRALAB - Scientific Analogue Matching Engine Verification Suite
 * 
 * Tests both positive mission scenarios and negative constraint scenarios:
 * - Positive tests verify software deterministic behavior against scientific data.
 * - Negative tests verify handling of missing data, estimated models, contradictory constraints,
 *   and non-interchangeability of basaltic surface plains vs. subterranean lava tubes.
 * 
 * DISCLAIMER: A test passing confirms software logic complies with specified rules;
 * it does not constitute scientific proof of planetary equivalence.
 */

import { ANALOGUE_LOCATIONS } from '../src/data/locationsData.js'
import { evaluateLocationMatch, matchLocations } from '../src/services/locationMatcher.js'

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
console.log('TERRALAB MATCHER VERIFICATION & SCIENTIFIC DATA INTEGRITY TESTS')
console.log('=================================================================\n')

// ------------------------------------------------------------------
// SECTION 1: FIVE EXISTING POSITIVE MISSION SCENARIOS
// ------------------------------------------------------------------
console.log('SECTION 1: Positive Mission Scenarios (Expected Matches)')

// Positive Test 1: Mars Rover Mobility on Impact Breccia (Haughton)
{
  const haughton = ANALOGUE_LOCATIONS.find((l) => l.id === 'haughton-crater')
  const result = evaluateLocationMatch(haughton, {
    targetBody: 'Mars',
    activityId: 'rover-mobility',
    lithologyFilter: 'Dolomite',
    maxSlopeDeg: 20,
    tempRegime: 'ALL',
  })
  assert(
    result.overallAlignment.key === 'HIGH_ALIGNMENT',
    'Positive 1: Haughton Crater matches Mars rover mobility on dolomite/breccia terrain',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    result.complianceIndicator.percentage === 100,
    'Positive 1: Haughton achieves 100% criteria compliance on specified filters',
    `Got ${result.complianceIndicator.percentage}%`
  )
}

// Positive Test 2: Subsurface Cryogenic Permafrost Drilling (McMurdo Dry Valleys)
{
  const mcmurdo = ANALOGUE_LOCATIONS.find((l) => l.id === 'mcmurdo-dry-valleys')
  const result = evaluateLocationMatch(mcmurdo, {
    targetBody: 'Mars',
    activityId: 'subsurface-coring',
    tempRegime: 'SUB_ZERO',
    maxSlopeDeg: 15,
  })
  assert(
    result.overallAlignment.key === 'HIGH_ALIGNMENT',
    'Positive 2: McMurdo Dry Valleys matches Mars subsurface cryo-ice drilling',
    `Got ${result.overallAlignment.key}`
  )
}

// Positive Test 3: Lunar Subterranean Lava Tube Exploration (Hawaii)
{
  const hawaii = ANALOGUE_LOCATIONS.find((l) => l.id === 'kilauea-basalts')
  const result = evaluateLocationMatch(hawaii, {
    targetBody: 'Moon',
    activityId: 'lava-tube-exploration',
    lithologyFilter: 'Basalt',
  })
  assert(
    result.overallAlignment.key === 'HIGH_ALIGNMENT',
    'Positive 3: Kīlauea / Mauna Loa matches Lunar lava tube exploration',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    hawaii.hasLavaTubes === true,
    'Positive 3: Hawaii site possesses verified subterranean lava tube conduits',
    'hasLavaTubes should be true'
  )
}

// Positive Test 4: Hyper-Arid Astrobiological Soil Extraction (Atacama)
{
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  const result = evaluateLocationMatch(atacama, {
    targetBody: 'Mars',
    activityId: 'extremophile-astrobiology',
    lithologyFilter: 'Perchlorate',
    tempRegime: 'HYPER_ARID_HOT',
  })
  assert(
    result.overallAlignment.key === 'HIGH_ALIGNMENT',
    'Positive 4: Atacama Yungay matches Mars hyper-arid astrobiological sampling',
    `Got ${result.overallAlignment.key}`
  )
}

// Positive Test 5: In-Situ Jarosite / Sulfate Spectroscopy (Río Tinto)
{
  const rioTinto = ANALOGUE_LOCATIONS.find((l) => l.id === 'rio-tinto-basin')
  const result = evaluateLocationMatch(rioTinto, {
    targetBody: 'Mars',
    activityId: 'in-situ-spectroscopy',
    lithologyFilter: 'Jarosite',
  })
  assert(
    result.overallAlignment.key === 'HIGH_ALIGNMENT',
    'Positive 5: Río Tinto matches Mars jarosite/iron-oxide spectroscopic calibration',
    `Got ${result.overallAlignment.key}`
  )
}

// ------------------------------------------------------------------
// SECTION 2: NEGATIVE TESTS & SCIENTIFIC CONSTRAINT CHECKS
// ------------------------------------------------------------------
console.log('\nSECTION 2: Negative Tests & Edge Case Verifications')

// Negative Test 1: Missing Mandatory Data (Uncataloged Slope)
{
  const syntheticLocation = {
    ...ANALOGUE_LOCATIONS[0],
    id: 'synthetic-no-slope',
    name: 'Synthetic Unsurveyed Sector',
    slope: { status: 'UNAVAILABLE', label: 'Unmeasured' },
  }
  const result = evaluateLocationMatch(syntheticLocation, {
    targetBody: 'Mars',
    maxSlopeDeg: 10,
  })
  assert(
    result.overallAlignment.key === 'DATA_UNAVAILABLE',
    'Negative 1: Missing slope data prevents HIGH_ALIGNMENT and returns DATA_UNAVAILABLE',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    result.missingData.some((msg) => msg.includes('Slope gradient data is unavailable')),
    'Negative 1: Missing data list explicitly flags slope uncertainty',
    'Missing data message not found'
  )
}

// Negative Test 2: Estimated Regional Data Under Strict Verification Filter
{
  const svalbard = ANALOGUE_LOCATIONS.find((l) => l.id === 'svalbard-bockfjorden')
  const result = evaluateLocationMatch(svalbard, {
    targetBody: 'Mars',
    tempRegime: 'SUB_ZERO',
    requireMeasuredOnly: true,
  })
  assert(
    result.overallAlignment.key === 'PARTIAL_ALIGNMENT',
    'Negative 2: Site with ESTIMATED temperature (Ny-Ålesund baseline) is demoted under requireMeasuredOnly',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    result.missingData.some((m) => m.includes('SOURCED or ESTIMATED data')),
    'Negative 2: Filter transparently flags that estimated regional models cannot substitute for in-situ sensors',
    'Estimated data warning not found'
  )
}

// Negative Test 3: Contradictory Environmental Constraints
{
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  // Requesting sub-zero thermal regime on hot hyper-arid Atacama (mean 17.5°C, winter low 2°C)
  const result = evaluateLocationMatch(atacama, {
    targetBody: 'Mars',
    tempRegime: 'SUB_ZERO',
  })
  assert(
    result.overallAlignment.key === 'SIGNIFICANT_DIVERGENCE',
    'Negative 3: Requesting SUB_ZERO on warm desert playa returns SIGNIFICANT_DIVERGENCE',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    result.operationalSuitability.thermalCompliance === 'INCOMPATIBLE',
    'Negative 3: Thermal compliance is flagged as INCOMPATIBLE',
    `Got ${result.operationalSuitability.thermalCompliance}`
  )
}

// Negative Test 4: Separation of Lava Tubes vs. Surface Basalt
{
  const svalbard = ANALOGUE_LOCATIONS.find((l) => l.id === 'svalbard-bockfjorden')
  // Svalbard has Quaternary basalt, but NO lava tubes
  assert(
    svalbard.hasBasalticPlains === true && svalbard.hasLavaTubes === false,
    'Negative 4: Svalbard is cataloged with basaltic plains but without lava tubes',
    'Svalbard lava tube flags incorrect'
  )
  const result = evaluateLocationMatch(svalbard, {
    targetBody: 'Mars',
    activityId: 'lava-tube-exploration',
    lithologyFilter: 'Basalt',
  })
  assert(
    result.overallAlignment.key === 'SIGNIFICANT_DIVERGENCE',
    'Negative 4: Svalbard basalt does NOT match lava-tube-exploration activity',
    `Got ${result.overallAlignment.key}`
  )
  assert(
    result.whyItDiverges.some((d) => d.toLowerCase().includes('subterranean lava tube conops requires intact pyroduct vaults')),
    'Negative 4: Matcher explicitly flags that surface basalt flows cannot satisfy subterranean ingress ConOps',
    'Lava tube morphological divergence message not found'
  )
}

// Negative Test 5: Inherent Planetary Operational Divergence Invariance
{
  const allMatched = matchLocations(ANALOGUE_LOCATIONS, { targetBody: 'Mars' })
  const highMatches = allMatched.filter((m) => m.overallAlignment.key === 'HIGH_ALIGNMENT')
  const allHaveGravityCaveats = highMatches.every((m) =>
    m.whyItDiverges.some((d) => d.includes('gravity') || d.includes('1.0G'))
  )
  const allHaveWarning = highMatches.every(
    (m) => typeof m.planetaryEquivalenceWarning === 'string' && m.planetaryEquivalenceWarning.length > 0
  )
  assert(
    allHaveGravityCaveats,
    'Negative 5: Every high alignment match explicitly notes 1.0G Earth gravity divergence',
    'Missing gravity caveat'
  )
  assert(
    allHaveWarning,
    'Negative 5: Every match retains planetaryEquivalenceWarning barring equivalence claims',
    'Missing planetary warning'
  )
}

// Negative Test 6: Criteria Depth Safeguard on Minimal Query (Point 3)
{
  const atacama = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
  const minimalResult = evaluateLocationMatch(atacama, {
    targetBody: 'Mars',
  })
  assert(
    minimalResult.complianceIndicator.evidenceDepth.isPreliminary === true,
    'Negative 6: Query with < 3 criteria is flagged as PRELIMINARY (low evidence depth)',
    `Got ${minimalResult.complianceIndicator.evidenceDepth.level}`
  )
  assert(
    minimalResult.complianceIndicator.displayLabel.includes('(1/1 criteria)'),
    'Negative 6: Display label explicitly includes (1/1 criteria) to prevent false equivalence',
    `Got ${minimalResult.complianceIndicator.displayLabel}`
  )
  const fullResult = evaluateLocationMatch(atacama, {
    targetBody: 'Mars',
    activityId: 'extremophile-astrobiology',
    lithologyFilter: 'Perchlorate',
    tempRegime: 'HYPER_ARID_HOT',
  })
  assert(
    fullResult.complianceIndicator.evidenceDepth.isPreliminary === false,
    'Negative 6: Multi-criteria query (4 criteria) is not flagged as preliminary',
    `Got ${fullResult.complianceIndicator.evidenceDepth.level}`
  )
}

// ------------------------------------------------------------------
// SECTION 3: CITATION & SOURCE REGISTRY INTEGRITY
// ------------------------------------------------------------------
console.log('\nSECTION 3: Citation & Source Verification Registry Integrity')

// Specific Check: Haughton DOI correction (Point 1)
{
  const haughton = ANALOGUE_LOCATIONS.find((l) => l.id === 'haughton-crater')
  const brecciaCitation = haughton.sourceVerificationRegistry.find(
    (s) => s.citationKey === 'osinski-breccia-2005'
  )
  assert(
    brecciaCitation && brecciaCitation.doi === '10.1111/j.1945-5100.2005.tb00147.x',
    'Point 1: Haughton breccia citation has corrected DOI 10.1111/j.1945-5100.2005.tb00147.x (not tb00148.x)',
    `Got ${brecciaCitation?.doi}`
  )
}

// Specific Check: Mauna Loa lava tube evidence distinction (Point 2)
{
  const hawaii = ANALOGUE_LOCATIONS.find((l) => l.id === 'kilauea-basalts')
  const shiroCitation = hawaii.sourceVerificationRegistry.find(
    (s) => s.citationKey === 'shiro-2022'
  )
  assert(
    shiroCitation && shiroCitation.verificationStatus === 'PARTIALLY_SUPPORTED',
    'Point 2: Shiro et al. (2022) is marked PARTIALLY_SUPPORTED (surface EVA tasks, not robotic tube ingress)',
    `Got ${shiroCitation?.verificationStatus}`
  )
}

for (const loc of ANALOGUE_LOCATIONS) {
  assert(
    Array.isArray(loc.sourceVerificationRegistry) && loc.sourceVerificationRegistry.length > 0,
    `Source Registry: ${loc.id} contains structured source verification registry`,
    'Registry missing or empty'
  )
  for (const src of loc.sourceVerificationRegistry) {
    const hasRequiredFields =
      src.title && src.authors && src.year && src.doi && src.publication && src.claimSupported && src.verificationStatus
    assert(
      hasRequiredFields,
      `Source Details: [${src.doi}] for ${loc.id} has complete bibliographic fields and claim mapping`,
      'Incomplete citation fields'
    )
  }
}

console.log('\n=================================================================')
console.log(`TEST RUN COMPLETE: ${passedTests} / ${totalTests} assertions passed.`)
console.log('=================================================================')

if (passedTests === totalTests) {
  process.exit(0)
} else {
  process.exit(1)
}
