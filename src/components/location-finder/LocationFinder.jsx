import { useState, useMemo, useEffect } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { matchLocations } from '../../services/locationMatcher.js'
import MissionRequirementBuilder from './MissionRequirementBuilder.jsx'
import CandidateMatchCard from './CandidateMatchCard.jsx'
import ComparisonMatrix from './ComparisonMatrix.jsx'
import LocationInspector from './LocationInspector.jsx'
import InteractiveMap from '../common/InteractiveMap.jsx'

const DEFAULT_CRITERIA = {
  targetBody: 'ALL',
  activityId: null,
  lithologyFilter: 'ALL',
  maxSlopeDeg: null,
  tempRegime: 'ALL',
  requireMeasuredOnly: false,
}

export default function LocationFinder({ prefocusedLocationId = null, onClearPrefocus, onNavigate }) {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [mapBodyMode, setMapBodyMode] = useState('earth') // 'earth' | 'mars' | 'moon' | 'compare'
  const [activeMapLocationId, setActiveMapLocationId] = useState(prefocusedLocationId)
  const [selectedForCompareIds, setSelectedForCompareIds] = useState([])
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [inspectedLocationId, setInspectedLocationId] = useState(prefocusedLocationId)
  const [prevPrefocusedId, setPrevPrefocusedId] = useState(prefocusedLocationId)

  // Compare mode selections
  const [comparePlanetId, setComparePlanetId] = useState('mars-jezero-delta')
  const [compareEarthId, setCompareEarthId] = useState('atacama-yungay')

  // Synchronize state during render when prop changes
  if (prefocusedLocationId !== prevPrefocusedId) {
    setPrevPrefocusedId(prefocusedLocationId)
    setInspectedLocationId(prefocusedLocationId)
    setActiveMapLocationId(prefocusedLocationId)
  }

  // Auto-scroll to candidate if prefocused
  useEffect(() => {
    if (prefocusedLocationId) {
      const element = document.getElementById(`candidate-${prefocusedLocationId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [prefocusedLocationId])

  // Run pure deterministic matching service
  const baseEvaluatedMatches = useMemo(() => {
    return matchLocations(ANALOGUE_LOCATIONS, criteria)
  }, [criteria])

  // Filter further by text search query if provided
  const evaluatedMatches = useMemo(() => {
    if (!searchQuery.trim()) return baseEvaluatedMatches
    const q = searchQuery.toLowerCase().trim()
    return baseEvaluatedMatches.filter(({ location }) => {
      return (
        location.name.toLowerCase().includes(q) ||
        location.country.toLowerCase().includes(q) ||
        location.region.toLowerCase().includes(q) ||
        (location.lithology && location.lithology.some((l) => l.toLowerCase().includes(q))) ||
        (location.targetBodies && location.targetBodies.some((b) => b.toLowerCase().includes(q)))
      )
    })
  }, [baseEvaluatedMatches, searchQuery])

  // Toggle candidate selection for multi-candidate comparison
  const handleToggleCompare = (locationId) => {
    setSelectedForCompareIds((prev) => {
      if (prev.includes(locationId)) {
        return prev.filter((id) => id !== locationId)
      } else {
        if (prev.length >= 3) return prev
        return [...prev, locationId]
      }
    })
  }

  const handleResetCriteria = () => {
    setCriteria(DEFAULT_CRITERIA)
    setSearchQuery('')
  }

  const selectedLocationsForMatrix = useMemo(() => {
    return ANALOGUE_LOCATIONS.filter((l) => selectedForCompareIds.includes(l.id))
  }, [selectedForCompareIds])

  const inspectedLocation = useMemo(() => {
    return ANALOGUE_LOCATIONS.find((l) => l.id === inspectedLocationId) || null
  }, [inspectedLocationId])

  const mapLocations = useMemo(() => {
    return evaluatedMatches.map((m) => m.location)
  }, [evaluatedMatches])

  const highAlignmentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'HIGH_ALIGNMENT'
  ).length
  const partialAlignmentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'PARTIAL_ALIGNMENT'
  ).length
  const divergentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'SIGNIFICANT_DIVERGENCE'
  ).length

  // Comparative mode objects
  const selectedPlanetTerrain = useMemo(() => {
    return PLANETARY_TERRAIN_DATASETS.find((d) => d.id === comparePlanetId) || PLANETARY_TERRAIN_DATASETS[0]
  }, [comparePlanetId])

  const selectedEarthAnalogue = useMemo(() => {
    return ANALOGUE_LOCATIONS.find((l) => l.id === compareEarthId) || ANALOGUE_LOCATIONS[0]
  }, [compareEarthId])

  return (
    <div className="location-finder-container">
      {/* 1. Requirements Builder */}
      <MissionRequirementBuilder
        criteria={criteria}
        onCriteriaChange={setCriteria}
        onResetCriteria={handleResetCriteria}
      />

      {/* 2. Interactive Planetary Maps & Data Explorer Section */}
      <section
        className="location-map-section aerospace-card"
        style={{
          marginTop: '16px',
          marginBottom: '20px',
          overflow: 'hidden',
        }}
        aria-label="Interactive Maps and Planetary Data Explorer"
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '0.12em' }}>
                // GEODETIC & TOPOGRAPHIC EXPLORER
              </span>
              <span className="badge-source font-mono">
                {mapBodyMode === 'earth' ? `${mapLocations.length} Earth Sites` : `${PLANETARY_TERRAIN_DATASETS.filter(d => d.targetBody.toLowerCase() === mapBodyMode).length} Planetary Targets`}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0 0' }}>
              {mapBodyMode === 'earth' && 'Earth Terrestrial Analogue Geodesy'}
              {mapBodyMode === 'mars' && 'Mars Global Topography (MOLA Altimetry)'}
              {mapBodyMode === 'moon' && 'Moon Lunar Surface & Pyroduct Skylights (LRO WAC)'}
              {mapBodyMode === 'compare' && 'Planetary vs Earth Terrestrial Comparison'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Explore planetary topography, switch cartographic layers, inspect location coordinates, or compare off-world terrains.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Celestial Body Mode Switcher */}
            <div className="font-mono" style={{ display: 'flex', gap: '4px', background: 'var(--bg-void)', padding: '3px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setMapBodyMode('earth')}
                style={{
                  background: mapBodyMode === 'earth' ? 'rgba(0, 210, 255, 0.2)' : 'none',
                  color: mapBodyMode === 'earth' ? '#00d2ff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                🌍 Earth
              </button>
              <button
                type="button"
                onClick={() => setMapBodyMode('mars')}
                style={{
                  background: mapBodyMode === 'mars' ? 'rgba(249, 115, 22, 0.2)' : 'none',
                  color: mapBodyMode === 'mars' ? '#f97316' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                🔴 Mars
              </button>
              <button
                type="button"
                onClick={() => setMapBodyMode('moon')}
                style={{
                  background: mapBodyMode === 'moon' ? 'rgba(203, 213, 225, 0.2)' : 'none',
                  color: mapBodyMode === 'moon' ? '#cbd5e1' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                ⚪ Moon
              </button>
              <button
                type="button"
                onClick={() => setMapBodyMode('compare')}
                style={{
                  background: mapBodyMode === 'compare' ? 'rgba(234, 179, 8, 0.2)' : 'none',
                  color: mapBodyMode === 'compare' ? '#eab308' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                ⚖️ Compare
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="font-mono"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '5px 12px',
                borderRadius: '2px',
                fontSize: '11px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {showMap ? 'Hide Map ▲' : 'Show Map ▼'}
            </button>
          </div>
        </div>

        {/* Comparative Planetary vs Earth Drawer (Visible in Compare Mode) */}
        {mapBodyMode === 'compare' && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(5, 6, 8, 0.75)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    1. Target Planetary Body &amp; Terrain:
                  </label>
                  <select
                    value={comparePlanetId}
                    onChange={(e) => setComparePlanetId(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    <optgroup label="Mars Targets (MOLA Areoid)">
                      {PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Mars').map((d) => (
                        <option key={d.id} value={d.id}>Mars &mdash; {d.name} ({d.planetaryRegion})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Moon Targets (Lunar Sphere)">
                      {PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Moon').map((d) => (
                        <option key={d.id} value={d.id}>Moon &mdash; {d.name} ({d.planetaryRegion})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    2. Terrestrial Earth Candidate:
                  </label>
                  <select
                    value={compareEarthId}
                    onChange={(e) => setCompareEarthId(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    {ANALOGUE_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>Earth &mdash; {loc.name} ({loc.country})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn-aerospace btn-aerospace-cyan"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('site-evaluation', {
                      locationId: compareEarthId,
                      terrainId: comparePlanetId,
                    })
                  }
                }}
                style={{ padding: '8px 16px', fontSize: '11px' }}
              >
                <span>OPEN FULL SITE EVALUATION</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* Quick Side-by-Side Comparison Metric Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '4px' }}>
              <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                <div className="font-mono" style={{ fontSize: '10.5px', color: '#f97316', fontWeight: 700 }}>
                  PLANETARY TARGET: {selectedPlanetTerrain.targetBody.toUpperCase()} &bull; {selectedPlanetTerrain.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Coordinates:</strong> {selectedPlanetTerrain.centerCoordinates} ({selectedPlanetTerrain.datumDescription})
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Typical Slope:</strong> {selectedPlanetTerrain.slope?.typicalDeg}° (Max: {selectedPlanetTerrain.slope?.maxDeg}°)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Relief Scale:</strong> {selectedPlanetTerrain.elevation?.localReliefM}m local relief &bull; {selectedPlanetTerrain.elevation?.label}
                </div>
              </div>

              <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                <div className="font-mono" style={{ fontSize: '10.5px', color: '#00d2ff', fontWeight: 700 }}>
                  EARTH ANALOGUE: {selectedEarthAnalogue.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Coordinates:</strong> {selectedEarthAnalogue.coordinates} (WGS 84 / EGM96 Geoid)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Typical Slope:</strong> {selectedEarthAnalogue.slope?.typicalDeg}° (Max: {selectedEarthAnalogue.slope?.maxDeg}°)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Relief Scale:</strong> {selectedEarthAnalogue.elevation?.nominalM}m elevation &bull; {selectedEarthAnalogue.geomorphology?.primaryLandform}
                </div>
              </div>
            </div>
          </div>
        )}

        {showMap && (
          <div>
            <InteractiveMap
              mode={mapBodyMode === 'compare' ? 'earth' : mapBodyMode}
              locations={mapLocations}
              activeLocationId={mapBodyMode === 'compare' ? compareEarthId : activeMapLocationId}
              onSelectLocation={(id) => {
                setActiveMapLocationId(id)
                setInspectedLocationId(id)
              }}
              onEvaluateSite={(id) => {
                if (onNavigate) {
                  onNavigate('site-evaluation', { locationId: id })
                }
              }}
              height="480px"
              showLayerSwitcher={true}
              showLegend={true}
            />

            {/* Map Layer and Dataset Info Strip */}
            <div
              className="font-mono"
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(5, 6, 8, 0.85)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'var(--text-muted)',
                gap: '12px',
              }}
            >
              <div>
                <strong>Active Geodetic Reference:</strong> {mapBodyMode === 'mars' ? 'IAU2000:49900 (MOLA Areoid 610 Pa Datum)' : mapBodyMode === 'moon' ? 'IAU2000:30100 (Mean Lunar Sphere R = 1737.4 km)' : 'WGS 84 / EGM96 Geoid'}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>NASA MOLA MEGDR [MAP_SERVICE]</span>
                <span style={{ color: 'var(--accent-cyan)' }}>NASA LRO WAC [MAP_SERVICE]</span>
                <span style={{ color: '#eab308' }}>USGS 3DEP [METADATA_ONLY]</span>
                <span style={{ color: '#eab308' }}>Copernicus GLO-30 [METADATA_ONLY]</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Results Header & Text Search Bar */}
      <div className="results-header-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div className="results-title-group">
          <div className="aerospace-label">
            <span className="aerospace-label-accent">//</span> EVALUATED CANDIDATE CATALOG
          </div>
          <h2 className="results-heading" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
            Audited Earth Locations ({evaluatedMatches.length} Sites)
          </h2>
          <p className="results-subheading" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Sorted deterministically by multi-parameter alignment. Every match cites published evidence; no scores are fabricated.
          </p>
        </div>

        {/* Text Filter Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search locations, minerals, features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              width: '260px',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              &times;
            </button>
          )}
        </div>

        <div className="alignment-stat-pills">
          <span className="stat-pill pill-high font-mono">
            <strong>{highAlignmentCount}</strong> High Alignment
          </span>
          <span className="stat-pill pill-partial font-mono">
            <strong>{partialAlignmentCount}</strong> Partial
          </span>
          <span className="stat-pill pill-diverge font-mono">
            <strong>{divergentCount}</strong> Divergent
          </span>
        </div>
      </div>

      {/* 4. Candidate Location Cards List */}
      <div className="candidates-grid">
        {evaluatedMatches.map((matchResult) => (
          <CandidateMatchCard
            key={matchResult.location.id}
            matchResult={matchResult}
            isSelectedForCompare={selectedForCompareIds.includes(matchResult.location.id)}
            onToggleCompare={handleToggleCompare}
            onInspectProfile={(id) => {
              setInspectedLocationId(id)
              setActiveMapLocationId(id)
            }}
            isPreFocused={prefocusedLocationId === matchResult.location.id}
            onNavigate={onNavigate}
          />
        ))}

        {evaluatedMatches.length === 0 && (
          <div
            className="aerospace-card"
            style={{
              gridColumn: '1 / -1',
              padding: '36px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              No candidate locations match the filter criteria and search query "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={handleResetCriteria}
              className="btn-aerospace btn-aerospace-cyan"
              style={{ padding: '6px 14px', fontSize: '11px' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. Bottom Comparison Tray (Visible when >= 1 candidate selected) */}
      {selectedForCompareIds.length > 0 && (
        <aside className="comparison-bottom-tray" aria-label="Comparison Tray">
          <div className="tray-content">
            <div className="tray-info">
              <span className="tray-badge font-mono">{selectedForCompareIds.length} / 3 SELECTED</span>
              <span className="tray-title" style={{ color: '#ffffff', fontWeight: 600 }}>
                Ready to compare candidates side-by-side
              </span>
            </div>

            <div className="tray-selected-names">
              {selectedLocationsForMatrix.map((loc) => (
                <span key={loc.id} className="tray-chip font-mono">
                  {loc.name.split('(')[0]}
                  <button
                    type="button"
                    onClick={() => handleToggleCompare(loc.id)}
                    className="chip-remove-btn"
                    aria-label={`Remove ${loc.name}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="tray-actions">
              <button
                type="button"
                className="btn-aerospace btn-aerospace-cyan"
                onClick={() => setIsMatrixOpen(true)}
                style={{ padding: '6px 14px', fontSize: '11px' }}
              >
                Open Comparison Matrix &rarr;
              </button>
              <button
                type="button"
                className="btn-aerospace"
                onClick={() => setSelectedForCompareIds([])}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                Clear
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 6. Multi-Candidate Comparison Matrix Modal */}
      {isMatrixOpen && (
        <ComparisonMatrix
          selectedLocations={selectedLocationsForMatrix}
          evaluatedMatches={evaluatedMatches}
          onRemoveLocation={handleToggleCompare}
          onClose={() => setIsMatrixOpen(false)}
          onInspectProfile={(id) => {
            setIsMatrixOpen(false)
            setInspectedLocationId(id)
            setActiveMapLocationId(id)
          }}
        />
      )}

      {/* 7. In-Depth Location Environmental Profile Inspector Modal */}
      {inspectedLocation && (
        <LocationInspector
          location={inspectedLocation}
          onClose={() => {
            setInspectedLocationId(null)
            if (onClearPrefocus) onClearPrefocus()
          }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}
