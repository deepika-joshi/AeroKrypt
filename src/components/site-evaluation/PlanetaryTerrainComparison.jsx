import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { MISSION_OBJECTIVES } from '../../data/missionObjectives.js'
import { compareTerrainParameters } from '../../services/terrainAnalysisService.js'
import { saveEvaluationRecord } from '../../services/researchRecordService.js'
import InteractiveMap from '../common/InteractiveMap.jsx'
import StatusBadge from '../common/StatusBadge.jsx'

export default function PlanetaryTerrainComparison({
  initialTargetBody = 'Mars',
  initialTerrainId = null,
  initialLocationId = null,
  initialExperimentId = null,
  onNavigate = null,
}) {
  const initialLoc = initialLocationId
    ? ANALOGUE_LOCATIONS.find((l) => l.id === initialLocationId)
    : null
  const determinedInitialBody = initialLoc
    ? (initialLoc.analogueRelevance === 'MOON' || (!initialLoc.targetBodies.includes('Mars') && initialLoc.targetBodies.includes('Moon')))
      ? 'Moon'
      : (initialLoc.analogueRelevance === 'MARS' || (!initialLoc.targetBodies.includes('Moon') && initialLoc.targetBodies.includes('Mars')))
      ? 'Mars'
      : initialTargetBody
    : initialTargetBody

  const [targetBody, setTargetBody] = useState(determinedInitialBody)
  const [selectedTerrainId, setSelectedTerrainId] = useState(
    initialTerrainId || (determinedInitialBody === 'Mars' ? 'mars-jezero-delta' : 'moon-marius-hills-skylight')
  )
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialLocationId || 'atacama-yungay'
  )
  const [selectedExperimentId, setSelectedExperimentId] = useState(
    initialExperimentId || 'autonomous-rover-mobility'
  )
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  const handleLocationChange = (newLocId) => {
    setSelectedLocationId(newLocId)
    const loc = ANALOGUE_LOCATIONS.find((l) => l.id === newLocId)
    if (loc) {
      const isMoonOnly = loc.analogueRelevance === 'MOON' || (!loc.targetBodies.includes('Mars') && loc.targetBodies.includes('Moon'))
      const isMarsOnly = loc.analogueRelevance === 'MARS' || (!loc.targetBodies.includes('Moon') && loc.targetBodies.includes('Mars'))
      if (isMoonOnly && targetBody !== 'Moon') {
        setTargetBody('Moon')
        setSelectedTerrainId('moon-marius-hills-skylight')
      } else if (isMarsOnly && targetBody !== 'Mars') {
        setTargetBody('Mars')
        setSelectedTerrainId('mars-jezero-delta')
      }
    }
  }

  const [prevInitialLocId, setPrevInitialLocId] = useState(initialLocationId)
  const [prevInitialTerrainId, setPrevInitialTerrainId] = useState(initialTerrainId)

  // Synchronize state during render when prop changes
  if (initialTerrainId && initialTerrainId !== prevInitialTerrainId) {
    setPrevInitialTerrainId(initialTerrainId)
    setSelectedTerrainId(initialTerrainId)
    const t = PLANETARY_TERRAIN_DATASETS.find((d) => d.id === initialTerrainId)
    if (t) {
      setTargetBody(t.targetBody)
    }
  }

  if (initialLocationId && initialLocationId !== prevInitialLocId) {
    setPrevInitialLocId(initialLocationId)
    setSelectedLocationId(initialLocationId)
    const loc = ANALOGUE_LOCATIONS.find((l) => l.id === initialLocationId)
    if (loc) {
      const isMoonOnly = loc.analogueRelevance === 'MOON' || (!loc.targetBodies.includes('Mars') && loc.targetBodies.includes('Moon'))
      const isMarsOnly = loc.analogueRelevance === 'MARS' || (!loc.targetBodies.includes('Moon') && loc.targetBodies.includes('Mars'))
      if (isMoonOnly && targetBody !== 'Moon') {
        setTargetBody('Moon')
        setSelectedTerrainId('moon-marius-hills-skylight')
      } else if (isMarsOnly && targetBody !== 'Mars') {
        setTargetBody('Mars')
        setSelectedTerrainId('mars-jezero-delta')
      }
    }
  }

  // Filter planetary datasets by target body
  const availablePlanetaryDatasets = useMemo(() => {
    return PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === targetBody)
  }, [targetBody])

  // Active Planetary Terrain Object
  const planetaryTerrain = useMemo(() => {
    const found = availablePlanetaryDatasets.find((d) => d.id === selectedTerrainId)
    if (found) return found
    return availablePlanetaryDatasets[0] || PLANETARY_TERRAIN_DATASETS[0]
  }, [availablePlanetaryDatasets, selectedTerrainId])

  // Active Earth Candidate Location Object
  const earthLocation = useMemo(() => {
    return (
      ANALOGUE_LOCATIONS.find((loc) => loc.id === selectedLocationId) ||
      ANALOGUE_LOCATIONS[0]
    )
  }, [selectedLocationId])

  // Active Mission Objective / Experiment
  const selectedExperiment = useMemo(() => {
    return (
      MISSION_OBJECTIVES.find((obj) => obj.id === selectedExperimentId) || null
    )
  }, [selectedExperimentId])

  // Run scientific comparison engine
  const comparisonResult = useMemo(() => {
    return compareTerrainParameters(earthLocation, planetaryTerrain, selectedExperiment)
  }, [earthLocation, planetaryTerrain, selectedExperiment])

  // Switch target body helper
  const handleBodyChange = (body) => {
    setTargetBody(body)
    const datasetsForBody = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === body)
    if (datasetsForBody.length > 0) {
      setSelectedTerrainId(datasetsForBody[0].id)
    }
  }

  // Handle Save Evaluation to Research Hub
  const handleSaveToResearchHub = () => {
    if (!comparisonResult) return
    const record = {
      title: `${planetaryTerrain.name} vs. ${earthLocation.name} Terrain Comparison`,
      targetBody,
      planetaryTerrainId: planetaryTerrain.id,
      earthLocationId: earthLocation.id,
      experimentId: selectedExperiment ? selectedExperiment.id : 'general-terrain',
      author: 'Principal Investigator / Site Evaluation Engine',
      compositeSimilarity: comparisonResult.compositeSimilarity,
      suitabilityLevel: comparisonResult.suitabilityLevel,
      summary: `Evaluated ${planetaryTerrain.name} (${planetaryTerrain.primaryLandform}) against ${earthLocation.name}. Composite similarity: ${comparisonResult.compositeSimilarity}%. Suitability: ${comparisonResult.suitabilityLabel}.`,
      tags: [targetBody, earthLocation.id, planetaryTerrain.id, comparisonResult.suitabilityLevel],
    }
    saveEvaluationRecord(record)
    setSaveSuccessMsg('Evaluation report saved successfully to Research Hub!')
    setTimeout(() => setSaveSuccessMsg(''), 4000)
  }

  // Prepare Chart Data
  const slopeBarData = useMemo(() => {
    if (!comparisonResult) return []
    return [
      {
        name: 'Typical Slope (°)',
        Planetary: planetaryTerrain.slope.typicalDeg,
        Earth: earthLocation.slope.typicalDeg,
        MissionLimit: selectedExperiment?.maxSlopeThreshold || null,
      },
      {
        name: 'Max Slope (°)',
        Planetary: planetaryTerrain.slope.maxDeg,
        Earth: earthLocation.slope.maxDeg,
        MissionLimit: selectedExperiment?.maxSlopeThreshold || null,
      },
      {
        name: 'Roughness (RMS °)',
        Planetary: planetaryTerrain.surfaceRoughness.rmsSlopeDeg,
        Earth: Number((earthLocation.slope.typicalDeg * 0.65).toFixed(1)),
        MissionLimit: null,
      },
    ]
  }, [comparisonResult, planetaryTerrain, earthLocation, selectedExperiment])

  const radarData = useMemo(() => {
    if (!comparisonResult) return []
    return comparisonResult.calculationBreakdown.map((item) => ({
      parameter: item.parameter.split(' ')[0],
      score: item.score,
      fullMark: 100,
    }))
  }, [comparisonResult])

  return (
    <div className="planetary-terrain-comparison-module" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 10-Step Workflow Controller Header */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface-elevated, #131722)',
          border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
          borderRadius: '6px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🪐</span>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Planetary Terrain Comparison &amp; Site Suitability Engine
              </h2>
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  color: 'var(--color-accent-cyan, #06b6d4)',
                }}
              >
                10-STEP SCIENTIFIC WORKFLOW
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Compare NASA MOLA/LOLA extraterrestrial topography with Earth analogue field sites across relief, slope distributions, RMS roughness, and geomorphic landforms.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {saveSuccessMsg ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#10b981', fontWeight: 500 }}>
                  ✓ {saveSuccessMsg}
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('research-hub', { subview: 'records' })}
                    className="font-mono"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-accent-cyan, #06b6d4)',
                      border: '1px solid var(--color-accent-cyan, #06b6d4)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    View in Research Hub &rarr;
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveToResearchHub}
                className="font-mono"
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--color-accent-cyan, #06b6d4)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                💾 Save to Research Hub
              </button>
            )}
          </div>
        </div>

        {/* Workflow Parameter Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {/* Step 1: Target Planetary Body */}
          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              1. TARGET PLANETARY BODY
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleBodyChange('Mars')}
                className="font-mono"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: targetBody === 'Mars' ? '1px solid #ef4444' : '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                  backgroundColor: targetBody === 'Mars' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  color: targetBody === 'Mars' ? '#ef4444' : 'var(--text-secondary)',
                  fontWeight: targetBody === 'Mars' ? 600 : 400,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                🔴 Mars (MOLA)
              </button>
              <button
                type="button"
                onClick={() => handleBodyChange('Moon')}
                className="font-mono"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: targetBody === 'Moon' ? '1px solid #38bdf8' : '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                  backgroundColor: targetBody === 'Moon' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: targetBody === 'Moon' ? '#38bdf8' : 'var(--text-secondary)',
                  fontWeight: targetBody === 'Moon' ? 600 : 400,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                ⚪ Moon (LOLA)
              </button>
            </div>
          </div>

          {/* Step 2: Mission Objective / Experiment */}
          <div>
            <label htmlFor="comp-experiment-select" className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              2. MISSION OBJECTIVE / EXPERIMENT
            </label>
            <select
              id="comp-experiment-select"
              value={selectedExperimentId}
              onChange={(e) => setSelectedExperimentId(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-input, #0d1117)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle, rgba(255,255,255,0.15))',
                fontSize: '12px',
              }}
            >
              <option value="">-- General Topography Baseline --</option>
              {MISSION_OBJECTIVES.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.title} ({obj.planetaryAnalogue})
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Mars / Moon Terrain Dataset */}
          <div>
            <label htmlFor="comp-terrain-select" className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              3. {targetBody.toUpperCase()} TERRAIN DATASET (PDS)
            </label>
            <select
              id="comp-terrain-select"
              value={planetaryTerrain.id}
              onChange={(e) => setSelectedTerrainId(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-input, #0d1117)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle, rgba(255,255,255,0.15))',
                fontSize: '12px',
              }}
            >
              {availablePlanetaryDatasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Earth Candidate Analogue Location */}
          <div>
            <label htmlFor="comp-earth-select" className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              4. EARTH CANDIDATE ANALOGUE SITE
            </label>
            <select
              id="comp-earth-select"
              value={earthLocation.id}
              onChange={(e) => handleLocationChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-input, #0d1117)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle, rgba(255,255,255,0.15))',
                fontSize: '12px',
              }}
            >
              {ANALOGUE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.country}) — [{loc.locationCategory === 'RESEARCH_FACILITY' ? 'FACILITY' : 'NATURAL'}] {loc.analogueRelevance || loc.primaryTarget}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Side-by-Side Terrain Comparison Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left: Planetary Terrain (Mars/Moon) */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: `1px solid ${targetBody === 'Mars' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              backgroundColor: targetBody === 'Mars' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(56, 189, 248, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  color: targetBody === 'Mars' ? '#ef4444' : '#38bdf8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Planetary Reference Terrain • {targetBody}
              </span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                {planetaryTerrain.name}
              </h3>
            </div>
            <StatusBadge variant="source" label={targetBody === 'Mars' ? 'MOLA MEGDR' : 'LRO LOLA'} size="xs" />
          </div>

          <div style={{ height: '240px', position: 'relative' }}>
            <InteractiveMap
              mode={targetBody === 'Mars' ? 'mars' : 'moon'}
              height="240px"
              defaultZoom={4}
            />
          </div>

          <div style={{ padding: '14px 16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CENTER COORDINATES</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>{planetaryTerrain.centerCoordinates}</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PRIMARY LANDFORM</span>
                <div style={{ fontWeight: 500 }}>{planetaryTerrain.primaryLandform}</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TYPICAL / MAX SLOPE</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>{planetaryTerrain.slope.typicalDeg}° (Max: {planetaryTerrain.slope.maxDeg}°)</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LOCAL RELIEF (&Delta;h)</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>{planetaryTerrain.elevation.localReliefM} m</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SURFACE ROUGHNESS</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>RMS {planetaryTerrain.surfaceRoughness.rmsSlopeDeg}° (H={planetaryTerrain.surfaceRoughness.hurstExponent})</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PDS PRODUCT ID</span>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-accent-cyan)' }}>{planetaryTerrain.pdsProductId.split('/')[0]}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', paddingTop: '8px' }}>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DATUM SPECIFICATION</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{planetaryTerrain.datumDescription}</div>
            </div>

            <div>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LITHOLOGY / REGOLITH</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{planetaryTerrain.lithology.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Right: Earth Candidate Analogue */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  color: 'var(--color-accent-cyan, #06b6d4)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Earth Candidate Analogue • {earthLocation.country}
              </span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                {earthLocation.name}
              </h3>
            </div>
            <StatusBadge variant="verified" label="WGS 84 DEM" size="xs" />
          </div>

          <div style={{ height: '240px', position: 'relative' }}>
            <InteractiveMap
              mode="earth"
              locations={[earthLocation]}
              activeLocationId={earthLocation.id}
              height="240px"
              defaultZoom={5}
            />
          </div>

          <div style={{ padding: '14px 16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COORDINATES</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>{earthLocation.coordinates}</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PRIMARY TARGET</span>
                <div style={{ fontWeight: 500 }}>{earthLocation.primaryTarget} Analogue</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TYPICAL / MAX SLOPE</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>{earthLocation.slope.typicalDeg}° (Max: {earthLocation.slope.maxDeg}°)</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ESTIMATED RELIEF (&Delta;h)</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>~{comparisonResult?.reliefComparison.earthReliefM} m</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ROUGHNESS PROXY</span>
                <div className="font-mono" style={{ fontWeight: 500 }}>RMS ~{(earthLocation.slope.typicalDeg * 0.65).toFixed(1)}°</div>
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ELEVATION (MSL)</span>
                <div className="font-mono" style={{ fontSize: '11px' }}>{earthLocation.elevation.label}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', paddingTop: '8px' }}>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DATUM SPECIFICATION</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>WGS 84 Ellipsoid / EGM96 Geoid (Mean Sea Level)</div>
            </div>

            <div>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LITHOLOGY &amp; MINERALOGY</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{earthLocation.lithology.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Domain Alignment & Suitability Classification Banner */}
      {comparisonResult && (
        <section
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: `1px solid ${
              comparisonResult.suitabilityLevel === 'HIGH_SUITABILITY'
                ? '#10b981'
                : comparisonResult.suitabilityLevel === 'PARTIAL_SUITABILITY'
                ? '#f59e0b'
                : '#ef4444'
            }`,
            borderRadius: '6px',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor:
                  comparisonResult.suitabilityLevel === 'HIGH_SUITABILITY'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : comparisonResult.suitabilityLevel === 'PARTIAL_SUITABILITY'
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid currentColor',
                color:
                  comparisonResult.suitabilityLevel === 'HIGH_SUITABILITY'
                    ? '#10b981'
                    : comparisonResult.suitabilityLevel === 'PARTIAL_SUITABILITY'
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                STATUS
              </span>
              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                {comparisonResult.suitabilityLevel === 'HIGH_SUITABILITY'
                  ? 'ALIGNED'
                  : comparisonResult.suitabilityLevel === 'PARTIAL_SUITABILITY'
                  ? 'PARTIAL'
                  : 'DIVERGENT'}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {comparisonResult.suitabilityLabel}
                </h3>
                <StatusBadge
                  variant={comparisonResult.suitabilityVariant}
                  label={comparisonResult.suitabilityLevel}
                  size="xs"
                />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0', maxWidth: '640px' }}>
                {comparisonResult.morphologyNotes}
              </p>
            </div>
          </div>

          <div className="font-mono" style={{ fontSize: '11px', textAlign: 'right', color: 'var(--text-muted)' }}>
            <div>Scoring Policy: No Arbitrary Composite Weights</div>
            <div>Parameter-by-Parameter Scientific Assessment</div>
          </div>
        </section>
      )}

      {/* Visual Recharts Comparison Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Slope & Roughness Bar Chart */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
            borderRadius: '6px',
            padding: '16px',
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Slope &amp; Roughness Parameter Comparison
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Direct gradient alignment between {planetaryTerrain.name} and {earthLocation.name}
          </p>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slopeBarData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} unit="°" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', fontSize: '12px' }}
                />
                <Bar dataKey="Planetary" fill={targetBody === 'Mars' ? '#ef4444' : '#38bdf8'} name={`${targetBody} Target`} />
                <Bar dataKey="Earth" fill="#10b981" name="Earth Analogue" />
                {selectedExperiment && selectedExperiment.maxSlopeThreshold && (
                  <Bar dataKey="MissionLimit" fill="#f59e0b" name="Vehicle Limit" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Multi-Parameter Similarity Radar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
            borderRadius: '6px',
            padding: '16px',
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Multi-Domain Alignment Profile (Exploratory Heuristic)
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Domain-specific alignment indicator; non-standardized protocol model
          </p>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="parameter" stroke="#9ca3af" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" fontSize={10} />
                <Radar name="Alignment Index" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transparent Parameter-by-Parameter Audit Table */}
      {comparisonResult && (
        <section
          style={{
            backgroundColor: 'var(--bg-surface-elevated, #131722)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Transparent Parameter-by-Parameter Alignment Audit
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Audited against Milestone 2 scientific governance: no invented composite weights, unmeasured values flagged as data gaps.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Parameter Domain</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Domain</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Earth Analogue Value</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>{targetBody} Planetary Target</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Method &amp; Extraction Status</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Evaluation Status</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResult.calculationBreakdown.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.parameter}</td>
                    <td className="font-mono" style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{row.weightPct}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.earthValue}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.planetaryValue}</td>
                    <td className="font-mono" style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {row.method}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          backgroundColor:
                            row.status === 'COMPLIANT' || row.status === 'MATCHED' || row.status === 'LANDFORM_MATCHED' || row.status === 'SUBTERRANEAN_CONDUIT_MATCH' || row.status === 'GEOCHEMICAL_PROXY_PRESENT'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : row.status.includes('MISMATCH') || row.status.includes('EXCEEDS')
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            row.status === 'COMPLIANT' || row.status === 'MATCHED' || row.status === 'LANDFORM_MATCHED' || row.status === 'SUBTERRANEAN_CONDUIT_MATCH' || row.status === 'GEOCHEMICAL_PROXY_PRESENT'
                              ? '#10b981'
                              : row.status.includes('MISMATCH') || row.status.includes('EXCEEDS')
                              ? '#ef4444'
                              : '#f59e0b',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Scientific Caveats & Missing Data Gaps */}
      {comparisonResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Planetary Equivalence Warning */}
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '6px',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#f59e0b' }}>⚠️</span>
              <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>
                Planetary Non-Equivalence Principle
              </h4>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Terrain and morphological similarity do <strong>not</strong> prove complete environmental equivalence. Earth gravity (1.0G / 9.81 m/s²) remains divergent from {targetBody === 'Mars' ? 'Mars (0.38G / 3.72 m/s²)' : 'the Moon (0.166G / 1.62 m/s²)'}. Atmospheric pressure (Earth 101.3 kPa vs. {targetBody === 'Mars' ? '~0.6 kPa' : 'hard vacuum'}), surface moisture, and solar UV-C ozone shielding remain fundamentally unrepresentative.
            </p>
          </div>

          {/* Missing Data & Uncertainties */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated, #131722)',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              borderRadius: '6px',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--color-accent-cyan)' }}>🔍</span>
              <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase' }}>
                Missing Parameters &amp; Scientific Uncertainty
              </h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {comparisonResult.missingDataGaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
