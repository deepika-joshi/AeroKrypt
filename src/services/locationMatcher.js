/**
 * TERRALAB - Scientific Analogue Location Matching Engine
 * 
 * AUDITED DETERMINISTIC SERVICE (FINAL VALIDATION PASS)
 * Evaluates candidate Earth analogue locations against mission requirements.
 * 
 * MATHEMATICAL SPECIFICATION OF THE INTERNAL MATCHING INDICATOR:
 * -------------------------------------------------------------------------
 * Evaluated Criteria Vector: C = [c_1, c_2, ..., c_k] for all active user-specified criteria:
 *   1. Target Planetary Body (c_body)
 *   2. Mission Activity ConOps (c_activity)
 *   3. Substrate Lithology / Mineralogy (c_lith)
 *   4. Topographic Slope Gradient (c_slope)
 *   5. Thermal / Aridity Regime (c_temp)
 *   6. Data Confidence Threshold (c_conf)
 * 
 * Per-Criterion Scoring: s_i in {1.0, 0.5, 0.0}
 *   - 1.0 (MATCH): Satisfied with verified MEASURED or SOURCED data.
 *   - 0.5 (PARTIAL): Partial alignment (e.g. seasonal sub-zero window, broader rock class,
 *                   or derived from ESTIMATED regional models).
 *   - 0.0 (MISMATCH / UNAVAILABLE): Parameter diverges from requirements, or required data
 *                                   is unmeasured/unavailable.
 * 
 * Weighting: Equal weighting w_i = 1.0 across all active criteria.
 * Treatment of Missing Data:
 *   - Missing/uncataloged parameters receive s_i = 0.0 and flag DATA_UNAVAILABLE.
 *   - Missing critical data strictly bars a site from receiving HIGH_ALIGNMENT.
 * 
 * Compliance Indicator Formula:
 *   I_match = ( sum_{i=1}^k w_i * s_i / sum_{i=1}^k w_i ) * 100%
 * 
 * SCIENTIFIC GOVERNANCE DISCLAIMER:
 * The percentage generated is an "Internal Filter Compliance Indicator" that measures
 * deterministic compliance with the user's specific database query constraints.
 * It is NOT a scientific probability, statistical confidence level, or peer-reviewed
 * planetary suitability score. Terrestrial sites inherently diverge on gravity (1.0G),
 * atmospheric pressure (101.3 kPa vs. vacuum / 0.6 kPa), and geomagnetic shielding.
 * 
 * STRUCTURAL SEPARATION:
 * - Subaerial basaltic terrain and subterranean lava tubes are treated as distinct,
 *   non-interchangeable criteria. A site with basaltic rock but without intact pyroduct
 *   conduits will mismatch lava-tube exploration ConOps.
 */

import { MISSION_OBJECTIVES } from '../data/missionObjectives.js'

export const ALIGNMENT_LEVELS = {
  HIGH_ALIGNMENT: {
    key: 'HIGH_ALIGNMENT',
    label: 'Criteria Satisfied for Protocol',
    badgeVariant: 'verified',
    description:
      'Candidate location satisfies the user-specified testing parameters (lithology, slope, and/or thermal regime). NOTE: This does NOT imply planetary equivalence; Earth gravity, atmospheric pressure, and shielding remain fundamentally divergent.',
  },
  PARTIAL_ALIGNMENT: {
    key: 'PARTIAL_ALIGNMENT',
    label: 'Partial Alignment',
    badgeVariant: 'sample',
    description:
      'Candidate location matches primary geological context but exhibits operational constraints, seasonal restrictions, or slope divergences.',
  },
  SIGNIFICANT_DIVERGENCE: {
    key: 'SIGNIFICANT_DIVERGENCE',
    label: 'Significant Divergence',
    badgeVariant: 'archived',
    description:
      'Candidate location fundamentally diverges from requested planetary body, substrate lithology, structural morphology, or thermal constraints for this protocol.',
  },
  DATA_UNAVAILABLE: {
    key: 'DATA_UNAVAILABLE',
    label: 'Data Unavailable',
    badgeVariant: 'source',
    description:
      'Critical parameters required to verify this mission objective are unmeasured or uncataloged for this specific site.',
  },
}

/**
 * Evaluates a single location against mission requirements
 */
export function evaluateLocationMatch(location, criteria = {}) {
  const {
    targetBody = 'ALL',
    activityId = null,
    lithologyFilter = 'ALL',
    maxSlopeDeg = null,
    tempRegime = 'ALL',
    requireMeasuredOnly = false,
  } = criteria

  const criteriaAudit = []
  const whyItMatches = []
  const whyItDiverges = []
  const missingData = []

  let hasMismatch = false
  let hasPartial = false
  let hasUnavailable = false

  // Detailed Geological Similarity Assessment
  const geologicalSimilarity = {
    rating: 'MODERATE',
    matchedUnits: [],
    divergentUnits: [],
    details: '',
  }

  // Detailed Operational Suitability Assessment
  const operationalSuitability = {
    rating: 'SUITABLE',
    slopeCompliance: 'COMPLIANT',
    thermalCompliance: 'COMPLIANT',
    trafficabilityNotes: '',
  }

  // 1. Target Planetary Body Assessment
  if (targetBody && targetBody !== 'ALL') {
    const isBodyMatched = location.targetBodies.includes(targetBody)
    if (isBodyMatched) {
      criteriaAudit.push({
        id: 'target-body',
        name: 'Target Planetary Body',
        domain: 'GEOLOGY',
        status: 'MATCH',
        evidence: `Directly analogizes ${targetBody} environment: ${location.planetaryAnalogy.specificRegion}.`,
        confidence: 'SOURCED',
        source: location.sourceAttribution.primaryCitation,
      })
      whyItMatches.push(
        `Documented as an active ${targetBody} terrestrial analogue in ${location.sourceAttribution.program}.`
      )
    } else {
      criteriaAudit.push({
        id: 'target-body',
        name: 'Target Planetary Body',
        domain: 'GEOLOGY',
        status: 'MISMATCH',
        evidence: `Cataloged for ${location.targetBodies.join(', ')}, not primary ${targetBody} analogue.`,
        confidence: 'SOURCED',
        source: location.sourceAttribution.primaryCitation,
      })
      whyItDiverges.push(
        `Site is primary analogue for ${location.targetBodies.join(', ')} rather than ${targetBody}.`
      )
      hasMismatch = true
    }
  } else {
    criteriaAudit.push({
      id: 'target-body',
      name: 'Target Planetary Body',
      domain: 'GEOLOGY',
      status: 'MATCH',
      evidence: `Applicable to multiple targets: ${location.targetBodies.join(', ')}.`,
      confidence: 'SOURCED',
      source: location.sourceAttribution.primaryCitation,
    })
  }

  // 2. Mission Activity ConOps Assessment
  const selectedActivity = MISSION_OBJECTIVES.find((m) => m.id === activityId)
  if (selectedActivity) {
    // Structural morphological check: Lava tubes vs. surface basalt
    if (selectedActivity.requiresLavaTubes && !location.hasLavaTubes) {
      criteriaAudit.push({
        id: 'activity-morphology',
        name: 'Lava Tube Structural Morphology',
        domain: 'OPERATIONAL',
        status: 'MISMATCH',
        evidence: `Site has surface volcanic rock units (${location.lithology.slice(0, 2).join(', ')}), but lacks documented subterranean lava tube conduits or collapse skylights.`,
        confidence: 'SOURCED',
        source: 'TERRALAB Speleology Audit (Sauro et al. 2020)',
      })
      whyItDiverges.push(
        'Subterranean lava tube ConOps requires intact pyroduct vaults or collapse pits; surface basalt flows do not satisfy subterranean ingress criteria.'
      )
      operationalSuitability.rating = 'UNSUITABLE'
      hasMismatch = true
    } else {
      const isActivitySupported = location.supportedActivities.includes(activityId)
      if (isActivitySupported) {
        criteriaAudit.push({
          id: 'activity-support',
          name: 'Mission Activity ConOps',
          domain: 'OPERATIONAL',
          status: 'MATCH',
          evidence: `Directly proven for "${selectedActivity.title}" through published trials.`,
          confidence: 'SOURCED',
          source: location.sourceAttribution.program,
        })
        whyItMatches.push(
          `Terrain and substrate have successfully hosted field testing for "${selectedActivity.title}".`
        )
      } else {
        criteriaAudit.push({
          id: 'activity-support',
          name: 'Mission Activity ConOps',
          domain: 'OPERATIONAL',
          status: 'PARTIAL',
          evidence: `Not explicitly benchmarked for "${selectedActivity.title}", though geologically related.`,
          confidence: 'ESTIMATED',
          source: 'TERRALAB Gap Analysis',
        })
        whyItDiverges.push(
          `No prior field documentation for "${selectedActivity.title}" at this specific coordinate set.`
        )
        hasPartial = true
      }
    }
  }

  // 3. Lithology & Substrate Mineralogy Assessment
  if (lithologyFilter && lithologyFilter !== 'ALL') {
    const matchingRock = location.lithology.find((l) =>
      l.toLowerCase().includes(lithologyFilter.toLowerCase())
    )
    if (matchingRock) {
      criteriaAudit.push({
        id: 'lithology',
        name: 'Lithology & Mineralogy',
        domain: 'GEOLOGY',
        status: 'MATCH',
        evidence: `Direct substrate match: ${matchingRock} present in site geological unit.`,
        confidence: location.soilChemistry.status,
        source: location.soilChemistry.sourceCitation,
      })
      whyItMatches.push(`Substrate contains ${matchingRock}, matching mission mineralogical target.`)
      geologicalSimilarity.matchedUnits.push(matchingRock)
      geologicalSimilarity.rating = 'HIGH'
    } else {
      criteriaAudit.push({
        id: 'lithology',
        name: 'Lithology & Mineralogy',
        domain: 'GEOLOGY',
        status: 'MISMATCH',
        evidence: `Requested lithology "${lithologyFilter}" not present in dominant rock units (${location.lithology.slice(0, 3).join(', ')}).`,
        confidence: location.soilChemistry.status,
        source: location.soilChemistry.sourceCitation,
      })
      whyItDiverges.push(
        `Site lithology is dominated by ${location.lithology.join(', ')}, diverging from "${lithologyFilter}".`
      )
      geologicalSimilarity.divergentUnits.push(lithologyFilter)
      geologicalSimilarity.rating = 'LOW'
      hasMismatch = true
    }
  } else if (selectedActivity) {
    const rockMatches = location.lithology.filter((locRock) =>
      selectedActivity.requiredLithology.some((req) =>
        locRock.toLowerCase().includes(req.toLowerCase())
      )
    )
    if (rockMatches.length > 0) {
      criteriaAudit.push({
        id: 'lithology',
        name: 'Lithological Compatibility',
        domain: 'GEOLOGY',
        status: 'MATCH',
        evidence: `Matches activity requirements: ${rockMatches.join(', ')}.`,
        confidence: location.soilChemistry.status,
        source: location.soilChemistry.sourceCitation,
      })
      whyItMatches.push(`Contains required substrate units: ${rockMatches.join(', ')}.`)
      geologicalSimilarity.matchedUnits.push(...rockMatches)
      geologicalSimilarity.rating = 'HIGH'
    } else {
      criteriaAudit.push({
        id: 'lithology',
        name: 'Lithological Compatibility',
        domain: 'GEOLOGY',
        status: 'PARTIAL',
        evidence: `Substrate (${location.lithology.slice(0, 2).join(', ')}) differs from activity baseline (${selectedActivity.requiredLithology.slice(0, 2).join(', ')}).`,
        confidence: location.soilChemistry.status,
        source: location.soilChemistry.sourceCitation,
      })
      geologicalSimilarity.rating = 'MODERATE'
      hasPartial = true
    }
  }

  // 4. Slope & Topographic Gradient Assessment (Operational)
  if (maxSlopeDeg !== null && !isNaN(maxSlopeDeg)) {
    const slopeData = location.slope
    if (!slopeData || slopeData.status === 'UNAVAILABLE') {
      criteriaAudit.push({
        id: 'slope',
        name: 'Slope & Topography',
        domain: 'OPERATIONAL',
        status: 'UNAVAILABLE',
        evidence: 'Quantitative slope gradient uncataloged for this sector.',
        confidence: 'UNAVAILABLE',
        source: 'N/A',
      })
      missingData.push('Slope gradient data is unavailable for this sector.')
      operationalSuitability.slopeCompliance = 'UNAVAILABLE'
      hasUnavailable = true
    } else if (slopeData.typicalDeg <= maxSlopeDeg) {
      criteriaAudit.push({
        id: 'slope',
        name: 'Slope & Topography',
        domain: 'OPERATIONAL',
        status: 'MATCH',
        evidence: `Typical slope is ${slopeData.typicalDeg}°, within ${maxSlopeDeg}° threshold (${slopeData.label}).`,
        confidence: slopeData.status,
        source: slopeData.sourceCitation,
      })
      whyItMatches.push(`Topographic slope (${slopeData.label}) satisfies the <= ${maxSlopeDeg}° constraint.`)
      operationalSuitability.slopeCompliance = 'COMPLIANT'
    } else if (slopeData.minDeg <= maxSlopeDeg) {
      criteriaAudit.push({
        id: 'slope',
        name: 'Slope & Topography',
        domain: 'OPERATIONAL',
        status: 'PARTIAL',
        evidence: `Minimum slope is ${slopeData.minDeg}°, but typical terrain is ${slopeData.typicalDeg}° (exceeds ${maxSlopeDeg}° limit).`,
        confidence: slopeData.status,
        source: slopeData.sourceCitation,
      })
      whyItDiverges.push(
        `Typical slope (${slopeData.typicalDeg}°) exceeds preferred ${maxSlopeDeg}° limit; flat testing corridors are restricted.`
      )
      operationalSuitability.slopeCompliance = 'MARGINAL'
      hasPartial = true
    } else {
      criteriaAudit.push({
        id: 'slope',
        name: 'Slope & Topography',
        domain: 'OPERATIONAL',
        status: 'MISMATCH',
        evidence: `Slope gradient (${slopeData.label}) strictly exceeds ${maxSlopeDeg}° threshold.`,
        confidence: slopeData.status,
        source: slopeData.sourceCitation,
      })
      whyItDiverges.push(
        `Slope (${slopeData.label}) is too steep for vehicle tipping and traction safety envelope.`
      )
      operationalSuitability.slopeCompliance = 'EXCEEDS'
      operationalSuitability.rating = 'UNSUITABLE'
      hasMismatch = true
    }
  }

  // 5. Temperature & Thermal Regime Assessment
  if (tempRegime && tempRegime !== 'ALL') {
    const temp = location.meanAnnualTemp
    if (tempRegime === 'SUB_ZERO') {
      if (temp.value < 0) {
        criteriaAudit.push({
          id: 'temperature',
          name: 'Thermal Regime (Sub-Zero)',
          domain: 'OPERATIONAL',
          status: 'MATCH',
          evidence: `Mean annual temp is ${temp.label}, supporting cryogenic and permafrost testing.`,
          confidence: temp.status,
          source: temp.sourceCitation,
        })
        whyItMatches.push(`Sub-zero thermal regime (${temp.label}) preserves cryo-cemented conditions.`)
        operationalSuitability.thermalCompliance = 'COMPLIANT'
      } else if (temp.min < 0) {
        criteriaAudit.push({
          id: 'temperature',
          name: 'Thermal Regime (Sub-Zero)',
          domain: 'OPERATIONAL',
          status: 'PARTIAL',
          evidence: `Mean annual temp is ${temp.value} °C, but winter lows reach ${temp.min} °C.`,
          confidence: temp.status,
          source: temp.sourceCitation,
        })
        whyItDiverges.push(`Sub-zero testing is seasonally restricted to winter lows (${temp.min} °C).`)
        operationalSuitability.thermalCompliance = 'SEASONAL'
        hasPartial = true
      } else {
        criteriaAudit.push({
          id: 'temperature',
          name: 'Thermal Regime (Sub-Zero)',
          domain: 'OPERATIONAL',
          status: 'MISMATCH',
          evidence: `Site has warm positive temperatures (${temp.label}); cannot support frozen regolith tests.`,
          confidence: temp.status,
          source: temp.sourceCitation,
        })
        whyItDiverges.push(`Mean annual temperature (${temp.label}) is too warm for sub-zero planetary tests.`)
        operationalSuitability.thermalCompliance = 'INCOMPATIBLE'
        operationalSuitability.rating = 'UNSUITABLE'
        hasMismatch = true
      }
    } else if (tempRegime === 'HYPER_ARID_HOT') {
      if (location.annualPrecipitation.value <= 10 && temp.value > 12) {
        criteriaAudit.push({
          id: 'temperature',
          name: 'Thermal Regime (Hyper-Arid)',
          domain: 'OPERATIONAL',
          status: 'MATCH',
          evidence: `Extreme aridity (${location.annualPrecipitation.label}) and temperature (${temp.label}).`,
          confidence: location.annualPrecipitation.status,
          source: location.annualPrecipitation.sourceCitation,
        })
        whyItMatches.push(
          `Hyper-arid moisture envelope (${location.annualPrecipitation.label}) replicates desiccated planetary surfaces.`
        )
        operationalSuitability.thermalCompliance = 'COMPLIANT'
      } else {
        criteriaAudit.push({
          id: 'temperature',
          name: 'Thermal Regime (Hyper-Arid)',
          domain: 'OPERATIONAL',
          status: 'MISMATCH',
          evidence: `Precipitation (${location.annualPrecipitation.label}) exceeds hyper-arid threshold (< 10 mm/yr).`,
          confidence: location.annualPrecipitation.status,
          source: location.annualPrecipitation.sourceCitation,
        })
        whyItDiverges.push(
          `Precipitation (${location.annualPrecipitation.label}) exceeds hyper-arid ceiling.`
        )
        operationalSuitability.thermalCompliance = 'INCOMPATIBLE'
        operationalSuitability.rating = 'UNSUITABLE'
        hasMismatch = true
      }
    }
  }

  // 6. Data Confidence Filter Check
  if (requireMeasuredOnly) {
    const unmeasuredFields = criteriaAudit.filter((c) => c.confidence !== 'MEASURED')
    if (unmeasuredFields.length > 0) {
      hasPartial = true
      missingData.push(
        `${unmeasuredFields.length} criteria depend on SOURCED or ESTIMATED data rather than direct in-situ sensor measurements.`
      )
    }
  }

  // Inherent planetary physical divergences
  location.planetaryDivergences.forEach((div) => {
    whyItDiverges.push(div)
  })

  // Location data gaps
  location.dataGapsAndUncertainty.forEach((gap) => {
    missingData.push(gap)
  })

  // Final Overall Classification
  let overallAlignment = ALIGNMENT_LEVELS.HIGH_ALIGNMENT
  if (hasMismatch) {
    overallAlignment = ALIGNMENT_LEVELS.SIGNIFICANT_DIVERGENCE
  } else if (hasPartial) {
    overallAlignment = ALIGNMENT_LEVELS.PARTIAL_ALIGNMENT
  } else if (hasUnavailable) {
    overallAlignment = ALIGNMENT_LEVELS.DATA_UNAVAILABLE
  }

  const matchCount = criteriaAudit.filter((c) => c.status === 'MATCH').length
  const partialCount = criteriaAudit.filter((c) => c.status === 'PARTIAL').length
  const mismatchCount = criteriaAudit.filter((c) => c.status === 'MISMATCH').length
  const unavailableCount = criteriaAudit.filter((c) => c.status === 'UNAVAILABLE').length

  // Internal Filter Compliance Indicator Calculation:
  // Each evaluated criterion carries equal weight w_i = 1.0.
  // MATCH = 1.0, PARTIAL = 0.5; MISMATCH and UNAVAILABLE contribute 0.0
  const totalCriteria = criteriaAudit.length
  const rawScore = matchCount * 1.0 + partialCount * 0.5
  const compliancePercentage = totalCriteria > 0 ? Math.round((rawScore / totalCriteria) * 100) : 0

  // Evidence Depth & Criteria Safeguard:
  // Prevents an evaluation based on only 1 or 2 criteria from appearing equivalent to a multi-criteria protocol assessment.
  const isPreliminary = totalCriteria < 3
  const evidenceDepth = {
    evaluatedCriteriaCount: totalCriteria,
    level: isPreliminary ? 'PRELIMINARY' : totalCriteria < 5 ? 'MODERATE' : 'COMPREHENSIVE',
    label: isPreliminary
      ? `Preliminary Screening (${totalCriteria} criteria)`
      : totalCriteria < 5
        ? `Moderate Depth (${totalCriteria} criteria)`
        : `Comprehensive Evaluation (${totalCriteria} criteria)`,
    isPreliminary,
    warning: isPreliminary
      ? `Evaluated on only ${totalCriteria} ${totalCriteria === 1 ? 'criterion' : 'criteria'} (minimum 3 required for multi-factor protocol assessment). High compliance on limited criteria does NOT indicate mission suitability.`
      : null,
  }

  return {
    location,
    overallAlignment,
    geologicalSimilarity,
    operationalSuitability,
    planetaryEquivalenceWarning:
      'NOTE: Alignment indicates satisfaction of specific test protocol parameters only. Earth gravity (1.0G), atmospheric pressure (101.3 kPa), atmospheric O2/H2O, and geomagnetic radiation shielding diverge fundamentally from Moon/Mars conditions across all terrestrial sites.',
    matchSummary: {
      totalEvaluated: totalCriteria,
      matchCount,
      partialCount,
      mismatchCount,
      unavailableCount,
    },
    complianceIndicator: {
      percentage: compliancePercentage,
      rawScore,
      totalCriteria,
      matchedCriteriaCount: matchCount,
      displayLabel: `${compliancePercentage}% (${matchCount}/${totalCriteria} criteria)`,
      evidenceDepth,
      label: 'Internal Filter Compliance Indicator',
      disclaimer:
        'Strictly indicates percentage compliance with user-selected filtering constraints in the database. This is NOT a scientific probability, statistical confidence level, or peer-reviewed planetary suitability score.',
    },
    criteriaAudit,
    whyItMatches,
    whyItDiverges,
    missingData,
  }
}

/**
 * Evaluates an array of locations and sorts them deterministically
 * High Alignment first, followed by Partial, then Data Unavailable, then Significant Divergence.
 * NOTE: Sorting strictly reflects filter criteria compliance; it does NOT imply universal scientific superiority.
 */
export function matchLocations(locations, criteria = {}) {
  const evaluated = locations.map((loc) => evaluateLocationMatch(loc, criteria))

  const rankOrder = {
    HIGH_ALIGNMENT: 1,
    PARTIAL_ALIGNMENT: 2,
    DATA_UNAVAILABLE: 3,
    SIGNIFICANT_DIVERGENCE: 4,
  }

  return evaluated.sort((a, b) => {
    const rankDiff =
      rankOrder[a.overallAlignment.key] - rankOrder[b.overallAlignment.key]
    if (rankDiff !== 0) return rankDiff
    // Secondary sort: highest compliance rawScore
    return b.complianceIndicator.rawScore - a.complianceIndicator.rawScore
  })
}
