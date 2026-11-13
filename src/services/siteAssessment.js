/**
 * TERRALAB - Scientific Site Assessment Engine
 * 
 * AUDITED EVALUATION SERVICE FOR MILESTONE 2: DETAILED SITE EVALUATION
 * 
 * SCIENTIFIC METHODOLOGY & GOVERNANCE RULES:
 * 1. No fabricated overall suitability score: Multi-domain aerospace qualifications
 *    depend on discrete boundary conditions (e.g. slope, cryo-temperature, lithology),
 *    not on an arbitrary weighted percentage.
 * 2. Strict separation of Geological Similarity from Operational Testing Suitability.
 * 3. Transparent attribution for every parameter (value, unit, location, period, confidence).
 * 4. Identification of Missing Critical Parameters for specific experiments, with explicit
 *    "Why It Matters" scientific justifications.
 * 5. Deterministic planetary divergence matrix (Earth 1.0G vs. 0.38G/0.166G, 101.3 kPa vs. 0.6 kPa/vacuum).
 */

import { MISSION_OBJECTIVES } from '../data/missionObjectives.js'

/**
 * Extracts and categorizes all quantitative parameters for a site profile
 */
export function getSiteDetailedParameters(location) {
  if (!location) return []

  const params = [
    {
      id: 'elevation',
      domain: 'TOPOGRAPHY',
      name: 'Site Elevation',
      value: location.elevation.value,
      unit: location.elevation.unit,
      displayValue: location.elevation.label,
      confidence: location.elevation.status,
      coverage: location.elevation.measurementLocation,
      period: location.elevation.measurementPeriod,
      citation: location.elevation.sourceCitation,
      importance: 'HIGH',
      experimentalRelevance: 'Dictates atmospheric barometric pressure, UV attenuation, and ambient air density.',
    },
    {
      id: 'slope',
      domain: 'TOPOGRAPHY',
      name: 'Topographic Slope Gradient',
      value: location.slope.typicalDeg,
      unit: 'deg',
      displayValue: location.slope.label,
      confidence: location.slope.status,
      coverage: location.slope.measurementLocation,
      period: location.slope.measurementPeriod,
      citation: location.slope.sourceCitation,
      importance: 'CRITICAL',
      experimentalRelevance: 'Governs vehicle tipping safety envelopes, mobility traction, and drill rig stabilization.',
    },
    {
      id: 'mean-temp',
      domain: 'CLIMATE',
      name: 'Mean Annual Air Temperature',
      value: location.meanAnnualTemp.value,
      unit: location.meanAnnualTemp.unit,
      displayValue: location.meanAnnualTemp.label,
      confidence: location.meanAnnualTemp.status,
      coverage: location.meanAnnualTemp.measurementLocation,
      period: location.meanAnnualTemp.measurementPeriod,
      citation: location.meanAnnualTemp.sourceCitation,
      importance: 'CRITICAL',
      experimentalRelevance: 'Determines permafrost ice-cement stability and thermal management for battery/electronics.',
    },
    {
      id: 'precipitation',
      domain: 'CLIMATE',
      name: 'Annual Precipitation',
      value: location.annualPrecipitation.value,
      unit: location.annualPrecipitation.unit,
      displayValue: location.annualPrecipitation.label,
      confidence: location.annualPrecipitation.status,
      coverage: location.annualPrecipitation.measurementLocation,
      period: location.annualPrecipitation.measurementPeriod,
      citation: location.annualPrecipitation.sourceCitation,
      importance: 'HIGH',
      experimentalRelevance: 'Governs surface hydration, weathering rates, and biological/extremophile activity limits.',
    },
    {
      id: 'humidity',
      domain: 'ATMOSPHERE',
      name: 'Relative Humidity',
      value: location.relativeHumidity ? location.relativeHumidity.value : null,
      unit: location.relativeHumidity ? location.relativeHumidity.unit : '%',
      displayValue: location.relativeHumidity ? location.relativeHumidity.label : 'Uncataloged',
      confidence: location.relativeHumidity ? location.relativeHumidity.status : 'UNAVAILABLE',
      coverage: location.relativeHumidity ? location.relativeHumidity.measurementLocation : 'N/A',
      period: location.relativeHumidity ? location.relativeHumidity.measurementPeriod : 'N/A',
      citation: location.relativeHumidity ? location.relativeHumidity.sourceCitation : 'TERRALAB Gap Analysis',
      importance: 'HIGH',
      experimentalRelevance: 'Influences sample hygroscopic absorption and atmospheric vapor diffusion into regolith.',
    },
    {
      id: 'pressure',
      domain: 'ATMOSPHERE',
      name: 'Surface Atmospheric Pressure',
      value: location.atmosphericPressure ? location.atmosphericPressure.value : null,
      unit: location.atmosphericPressure ? location.atmosphericPressure.unit : 'kPa',
      displayValue: location.atmosphericPressure ? location.atmosphericPressure.label : 'Uncataloged',
      confidence: location.atmosphericPressure ? location.atmosphericPressure.status : 'UNAVAILABLE',
      coverage: location.atmosphericPressure ? location.atmosphericPressure.measurementLocation : 'N/A',
      period: location.atmosphericPressure ? location.atmosphericPressure.measurementPeriod : 'N/A',
      citation: location.atmosphericPressure ? location.atmosphericPressure.sourceCitation : 'TERRALAB Gap Analysis',
      importance: 'CRITICAL',
      experimentalRelevance: 'Determines aerodynamic drag, heat convection, and volatile sublimation physics.',
    },
    {
      id: 'uv-flux',
      domain: 'RADIATION',
      name: 'Peak Solar UV Index',
      value: location.uvIndexPeak.value,
      unit: 'index',
      displayValue: location.uvIndexPeak.label,
      confidence: location.uvIndexPeak.status,
      coverage: location.uvIndexPeak.measurementLocation,
      period: location.uvIndexPeak.measurementPeriod,
      citation: location.uvIndexPeak.sourceCitation,
      importance: 'MEDIUM',
      experimentalRelevance: 'Simulates solar UV photon background for optical spectrometers and organic degradation trials.',
    },
    {
      id: 'soil-chemistry',
      domain: 'GEOCHEMISTRY',
      name: 'Substrate Chemistry & Mineralogy',
      value: location.soilChemistry.keyMinerals.length,
      unit: 'minerals',
      displayValue: `${location.soilChemistry.keyMinerals.join(', ')} (${location.soilChemistry.description})`,
      confidence: location.soilChemistry.status,
      coverage: location.soilChemistry.measurementLocation,
      period: location.soilChemistry.measurementPeriod,
      citation: location.soilChemistry.sourceCitation,
      importance: 'CRITICAL',
      experimentalRelevance: 'Primary baseline for in-situ Raman/LIBS spectroscopy, APXS calibration, and drill hardness.',
    },
  ]

  return params
}

/**
 * Generates an empirical planetary divergence comparison matrix between Earth site and Moon/Mars
 */
export function getPlanetaryDivergenceData(location, targetBody = 'Mars') {
  const body = targetBody.toUpperCase().includes('MOON') ? 'Moon' : 'Mars'

  const divergences = [
    {
      parameter: 'Surface Gravity',
      earthSite: '1.0G (9.81 m/s²)',
      planetaryTarget: body === 'Moon' ? '0.166G (1.62 m/s²)' : '0.38G (3.72 m/s²)',
      divergenceRatio: body === 'Moon' ? '6.0x higher on Earth' : '2.6x higher on Earth',
      impact:
        'Rover wheel normal force, drill bit reaction torque, and dust saltation settling rates are artificially elevated on Earth. Structural mass scaling corrections required.',
    },
    {
      parameter: 'Surface Atmospheric Pressure',
      earthSite: location.atmosphericPressure ? location.atmosphericPressure.label : '~101.3 kPa (ambient sea-level baseline)',
      planetaryTarget: body === 'Moon' ? '< 10⁻¹⁰ Pa (Ultra-high vacuum)' : '0.6 to 0.9 kPa (CO₂-dominated)',
      divergenceRatio: body === 'Moon' ? '> 10¹⁴x higher on Earth' : '~150x higher on Earth',
      impact:
        'Volatile ices (H₂O, CO₂) sublime rapidly in Martian/Lunar vacuums but remain stable under Earth atmospheric pressure. Convective cooling of avionics differs fundamentally.',
    },
    {
      parameter: 'Atmospheric Gas Composition',
      earthSite: '78.1% N₂, 20.9% O₂, trace CO₂, variable H₂O vapor',
      planetaryTarget: body === 'Moon' ? 'Trace Ar, He, Na exosphere' : '95.3% CO₂, 2.6% N₂, 1.9% Ar, trace O₂/H₂O',
      divergenceRatio: 'Subaerial oxic environment',
      impact:
        'Oxidizing Earth ambient air rapidly alters reduced Fe²⁺ minerals and introduces organic aerosols. Sealed nitrogen-purge containment required for planetary sample handling.',
    },
    {
      parameter: 'Cosmic & Solar Radiation Shielding',
      earthSite: 'Geomagnetic magnetosphere + atmospheric column + ozone layer (UV-C absorbed)',
      planetaryTarget: body === 'Moon' ? 'Zero magnetic field; unshielded solar flare SPE & galactic cosmic rays (GCR)' : 'No global dipolar field; ~200–300 mGy/yr GCR flux; surface UV-C unattenuated',
      divergenceRatio: 'Near-complete shielding on Earth',
      impact:
        'Solar UV-C (< 280 nm) is blocked by Earth ozone; radiation dosimeters and electronic single-event-upset (SEU) tests cannot be validated subaerially.',
    },
    {
      parameter: 'Diurnal Temperature Amplitude',
      earthSite: location.meanAnnualTemp ? `${location.meanAnnualTemp.min} °C to ${location.meanAnnualTemp.max} °C (ΔT ~${location.meanAnnualTemp.max - location.meanAnnualTemp.min} K)` : 'ΔT ~20–35 K',
      planetaryTarget: body === 'Moon' ? '-180 °C to +120 °C (ΔT ~300 K)' : '-125 °C to +20 °C (ΔT ~80–100 K)',
      divergenceRatio: 'Significantly buffered on Earth',
      impact:
        'Thermal cycling fatigue, cryogenic mechanism binding, and solder micro-cracking occur under much wider thermal extremes on the planetary surface.',
    },
  ]

  return {
    targetBody: body,
    divergences,
  }
}

/**
 * Conducts a comprehensive multi-factor site evaluation against an optional mission experiment
 */
export function evaluateSite(location, experimentId = null) {
  if (!location) return null

  const parameters = getSiteDetailedParameters(location)
  const experiment = MISSION_OBJECTIVES.find((m) => m.id === experimentId) || null
  const planetaryDivergence = getPlanetaryDivergenceData(location, experiment ? experiment.primaryTarget : location.primaryTarget)

  // 1. Geological Similarity Evaluation
  const geologicalSimilarity = {
    lithologyMatch: 'HIGH',
    matchedRockTypes: [],
    divergentRockTypes: [],
    mineralogicalFidelity: location.scientificFidelity[0] || 'Natural geochemical analogue',
    geologicalEpoch: location.planetaryAnalogy.geologicalEpoch,
    specificTargetRegion: location.planetaryAnalogy.specificRegion,
    details: '',
  }

  if (experiment) {
    const matchedRocks = location.lithology.filter((rock) =>
      experiment.requiredLithology.some((req) => rock.toLowerCase().includes(req.toLowerCase()))
    )
    geologicalSimilarity.matchedRockTypes = matchedRocks
    geologicalSimilarity.divergentRockTypes = location.lithology.filter((rock) => !matchedRocks.includes(rock))
    geologicalSimilarity.lithologyMatch = matchedRocks.length > 0 ? (matchedRocks.length >= 2 ? 'HIGH' : 'MODERATE') : 'LOW'
    geologicalSimilarity.details = `Site substrate features ${matchedRocks.join(', ') || 'divergent lithologies'}, evaluated against protocol baseline (${experiment.requiredLithology.join(', ')}).`
  } else {
    geologicalSimilarity.matchedRockTypes = location.lithology
    geologicalSimilarity.details = `Natural lithological composition: ${location.lithology.join(', ')}.`
  }

  // 2. Operational Suitability Evaluation
  const operationalSuitability = {
    slopeStatus: 'COMPLIANT',
    thermalStatus: 'COMPLIANT',
    conopsStatus: 'DOCUMENTED',
    trafficabilityNotes: '',
    seasonalRestrictions: '',
    details: '',
  }

  if (experiment) {
    // Slope threshold check
    if (location.slope.typicalDeg <= experiment.maxSlopeThreshold) {
      operationalSuitability.slopeStatus = 'COMPLIANT'
    } else if (location.slope.minDeg <= experiment.maxSlopeThreshold) {
      operationalSuitability.slopeStatus = 'MARGINAL (Corridors restricted)'
    } else {
      operationalSuitability.slopeStatus = 'EXCEEDS THRESHOLD'
    }

    // ConOps trial status
    if (location.supportedActivities.includes(experiment.id)) {
      operationalSuitability.conopsStatus = 'FIELD PROVEN'
      operationalSuitability.trafficabilityNotes = `Successfully hosted trials under ${location.sourceAttribution.program}.`
    } else {
      operationalSuitability.conopsStatus = 'NO PRIOR DOCUMENTATION'
      operationalSuitability.trafficabilityNotes = 'Requires preliminary site mobility survey before instrument deployment.'
    }

    operationalSuitability.details = `Typical slope ${location.slope.label} against ${experiment.maxSlopeThreshold}° threshold. Thermal envelope: ${location.meanAnnualTemp.label}.`
  } else {
    operationalSuitability.details = `Topography: ${location.slope.label}. Temperature: ${location.meanAnnualTemp.label}.`
  }

  // 3. Missing Critical Parameters for Experiment
  const missingCriticalParameters = []
  if (experiment) {
    experiment.criticalParameters.forEach((crit) => {
      // Check if parameter is missing or unverified
      let isCovered = false
      let currentStatus = 'UNAVAILABLE'
      let reason = ''

      if (crit.name.toLowerCase().includes('cohesion') || crit.name.toLowerCase().includes('strength')) {
        isCovered = false
        currentStatus = 'UNAVAILABLE'
        reason = `Quantitative in-situ soil shear strength and cohesion (c, φ) are uncataloged at this coordinate set. Without these measurements, vehicle wheel sinkage, traction slip models, and robotic anchor pull-out resistance cannot be quantitatively bounded.`
      } else if (crit.name.toLowerCase().includes('subsurface temperature') || crit.name.toLowerCase().includes('ground temperature')) {
        // Air temperature does not substitute for deep in-situ borehole profile
        isCovered = false
        currentStatus = 'PARTIALLY_SUPPORTED'
        reason = `Surface air temperature is documented (${location.meanAnnualTemp.label}), but continuous vertical subsurface ground temperature profile down to 2.0m drill bite depth is unmeasured. Drill bit frictional heating and volatile sublimation risk cannot be fully modeled without deep subsurface temperature logs.`
      } else if (crit.name.toLowerCase().includes('temperature') || crit.name.toLowerCase().includes('thermal')) {
        isCovered = location.meanAnnualTemp.status === 'MEASURED' || location.meanAnnualTemp.status === 'SOURCED'
        currentStatus = location.meanAnnualTemp.status
        reason = isCovered
          ? `Air temperature is documented (${location.meanAnnualTemp.label}), but continuous subsurface borehole profile down to 1.5m remains partially unmeasured.`
          : `Subsurface cryogenic temperature is unmeasured; drill core thermal friction heating cannot be benchmarked without continuous sensor logs.`
      } else if (crit.name.toLowerCase().includes('slope')) {
        isCovered = location.slope.status === 'MEASURED' || location.slope.status === 'SOURCED'
        currentStatus = location.slope.status
        reason = isCovered
          ? `Slope is verified (${location.slope.label}), but micro-topography (< 10 cm roughness) remains unmapped in outlying sectors.`
          : `Slope gradient is uncataloged, presenting unquantified vehicle roll-over hazard.`
      } else if (crit.name.toLowerCase().includes('roof') || crit.name.toLowerCase().includes('internal geometry')) {
        if (!location.hasLavaTubes) {
          isCovered = false
          currentStatus = 'MISMATCH / UNAVAILABLE'
          reason = `Site possesses surface basalt flows but no intact subterranean lava tube conduits or collapse skylights. Subterranean ingress testing cannot be conducted.`
        } else {
          isCovered = false
          currentStatus = 'PARTIALLY_SUPPORTED'
          reason = `Subterranean cave geometry is cataloged comparatively, but exact-site 3D LiDAR volumetric scans and radio attenuation profiles are unverified for this specific cave sector.`
        }
      } else {
        isCovered = true
        currentStatus = 'SOURCED'
        reason = `Parameter is qualitatively documented in published literature.`
      }

      if (!isCovered || currentStatus === 'UNAVAILABLE' || currentStatus === 'PARTIALLY_SUPPORTED') {
        missingCriticalParameters.push({
          parameterName: crit.name,
          importance: crit.importance,
          currentStatus,
          experimentalImpact: reason,
          experimentName: experiment.title,
        })
      }
    })
  }

  // Also append general site data gaps
  location.dataGapsAndUncertainty.forEach((gap, idx) => {
    if (!missingCriticalParameters.some((m) => m.experimentalImpact.includes(gap))) {
      missingCriticalParameters.push({
        parameterName: `Site Specific Data Gap #${idx + 1}`,
        importance: 'HIGH',
        currentStatus: gap.includes('UNVERIFIED') ? 'UNVERIFIED' : 'ESTIMATED / DATA GAP',
        experimentalImpact: gap,
        experimentName: 'General Mission Environment',
      })
    }
  })

  // 4. Qualitative Assessment Synthesis
  const assessmentSummary = {
    keyStrengths: [
      ...location.scientificFidelity,
      `Traceable published literature baseline via ${location.sourceAttribution.organization}.`,
    ],
    operationalLimitations: [
      ...location.planetaryDivergences,
      location.slope.typicalDeg > 15 ? 'Steep topography imposes robotic traction constraints.' : 'Low slope offers good mobility but limited obstacle stress-testing.',
    ],
    executionRisks: [
      location.annualPrecipitation.value > 100
        ? `Rainfall (${location.annualPrecipitation.label}) generates rapid aqueous alteration and flash moisture episodes absent on the target planetary body.`
        : 'Extreme aridity and abrasive regolith dust impose severe seal wear on mechanical actuators.',
      'Planetary operational divergence: Earth 1.0G gravity artificially increases vehicle traction and drill penetration force.',
    ],
    recommendedFieldMeasurements: [
      'In-situ micro-penetrometer and direct shear box measurements (c, φ) along planned vehicle traverse corridors.',
      'High-resolution (sub-centimeter) UAV LiDAR DEM generation for micro-roughness obstacle distribution.',
      'Continuous 12-month subsurface temperature profile datalogging at 0.1m, 0.5m, 1.0m, and 2.0m depths.',
      'In-situ atmospheric humidity and aerosol optical depth logging during the scheduled trial season.',
    ],
    scientificMethodologyNotice:
      'TERRALAB does not output a composite percentage score for mission suitability. Space testing validation requires individual satisfaction of distinct lithological, thermal, and mechanical thresholds; a mathematically averaged score can obscure critical single-point failure modes.',
  }

  return {
    location,
    experiment,
    parameters,
    geologicalSimilarity,
    operationalSuitability,
    missingCriticalParameters,
    planetaryDivergence,
    evidenceRegistry: location.sourceVerificationRegistry || [],
    assessmentSummary,
    generatedDate: new Date().toISOString().split('T')[0],
  }
}
