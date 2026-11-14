import { useState, useMemo, useEffect, useRef } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { matchLocations } from '../../services/locationMatcher.js'
import { getAllLocations } from '../../services/locationRegistryService.js'
import MissionRequirementBuilder from './MissionRequirementBuilder.jsx'
import CandidateMatchCard from './CandidateMatchCard.jsx'
import ComparisonMatrix from './ComparisonMatrix.jsx'
import LocationInspector from './LocationInspector.jsx'
import LocationSidePanel from './LocationSidePanel.jsx'
import InteractiveMap from '../common/InteractiveMap.jsx'
import EarthGlobe3D from './EarthGlobe3D.jsx'
import AddLocationModal from './AddLocationModal.jsx'

const DEFAULT_CRITERIA = {
  targetBody: 'ALL',
  activityId: null,
  lithologyFilter: 'ALL',
  maxSlopeDeg: null,
  tempRegime: 'ALL',
  requireMeasuredOnly: false,
  locationCategory: 'ALL',
}

const PRIMARY_FILTER_TABS = [
  { id: 'ALL', label: 'All Sites', icon: '🌐' },
  { id: 'MARS', label: 'Mars Analogues', icon: '🔴' },
  { id: 'MOON', label: 'Moon Analogues', icon: '⚪' },
  { id: 'DUAL', label: 'Dual-Purpose Sites', icon: '⚖️' },
  { id: 'FACILITY', label: 'Research Facilities', icon: '⌂' },
]

export default function LocationFinder({ prefocusedLocationId = null, _onClearPrefocus, onNavigate }) {
  const [locationsList, setLocationsList] = useState(() => getAllLocations())
  const [viewMode, setViewMode] = useState('globe') // 'globe' | 'map' | 'catalog'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [primaryFilter, setPrimaryFilter] = useState('ALL') // 'ALL' | 'MARS' | 'MOON' | 'DUAL' | 'FACILITY'
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [mapBodyMode, setMapBodyMode] = useState('earth') // 'earth' | 'mars' | 'moon' | 'compare'
  const [activeMapLocationId, setActiveMapLocationId] = useState(prefocusedLocationId || ANALOGUE_LOCATIONS[0].id)
  const [selectedForCompareIds, setSelectedForCompareIds] = useState([])
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [inspectedLocationId, setInspectedLocationId] = useState(prefocusedLocationId || null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(Boolean(prefocusedLocationId))
  const [showFullInspectorModal, setShowFullInspectorModal] = useState(false)
  const [showAdvancedCriteria, setShowAdvancedCriteria] = useState(false)
  const [prevPrefocusedId, setPrevPrefocusedId] = useState(prefocusedLocationId)

  const mapSectionRef = useRef(null)

  // Compare mode selections
  const [comparePlanetId, setComparePlanetId] = useState('mars-jezero-delta')
  const [compareEarthId, setCompareEarthId] = useState('atacama-yungay')

  // Synchronize state during render when prop changes
  if (prefocusedLocationId !== prevPrefocusedId) {
    setPrevPrefocusedId(prefocusedLocationId)
    setInspectedLocationId(prefocusedLocationId)
    setActiveMapLocationId(prefocusedLocationId)
    setIsSidePanelOpen(Boolean(prefocusedLocationId))
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

  // Compute counts for each primary filter tab based on the full 20 locations
  const filterCounts = useMemo(() => {
    return {
      ALL: locationsList.length,
      MARS: locationsList.filter((l) => l.targetBodies.includes('Mars') || l.analogueRelevance === 'MARS' || l.primaryTarget === 'Mars').length,
      MOON: locationsList.filter((l) => l.targetBodies.includes('Moon') || l.analogueRelevance === 'MOON' || l.primaryTarget === 'Moon').length,
      DUAL: locationsList.filter((l) => (l.targetBodies.includes('Mars') && l.targetBodies.includes('Moon')) || l.analogueRelevance === 'BOTH').length,
      FACILITY: locationsList.filter((l) => l.locationCategory === 'RESEARCH_FACILITY').length,
    }
  }, [locationsList])

  // Run pure deterministic matching service
  const baseEvaluatedMatches = useMemo(() => {
    return matchLocations(locationsList, criteria)
  }, [locationsList, criteria])

  // Filter by primary filter tab AND search query
  const evaluatedMatches = useMemo(() => {
    return baseEvaluatedMatches.filter(({ location }) => {
      // 1. Primary Filter Tab Constraint
      if (primaryFilter === 'MARS') {
        const isMars = location.targetBodies.includes('Mars') || location.analogueRelevance === 'MARS'
        if (!isMars) return false
      } else if (primaryFilter === 'MOON') {
        const isMoon = location.targetBodies.includes('Moon') || location.analogueRelevance === 'MOON'
        if (!isMoon) return false
      } else if (primaryFilter === 'DUAL') {
        const isDual = location.targetBodies.includes('Mars') && location.targetBodies.includes('Moon')
        if (!isDual) return false
      } else if (primaryFilter === 'FACILITY') {
        if (location.locationCategory !== 'RESEARCH_FACILITY') return false
      }

      // 2. Text Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = location.name.toLowerCase().includes(q)
        const matchesCountry = location.country.toLowerCase().includes(q)
        const matchesRegion = location.region.toLowerCase().includes(q)
        const matchesLithology = location.lithology && location.lithology.some((l) => l.toLowerCase().includes(q))
        const matchesTarget = location.targetBodies && location.targetBodies.some((b) => b.toLowerCase().includes(q))
        const matchesMinerals = location.soilChemistry?.keyMinerals && location.soilChemistry.keyMinerals.some((m) => m.toLowerCase().includes(q))
        if (!matchesName && !matchesCountry && !matchesRegion && !matchesLithology && !matchesTarget && !matchesMinerals) {
          return false
        }
      }

      return true
    })
  }, [baseEvaluatedMatches, primaryFilter, searchQuery])

  // Map locations to display (synchronized with filtered results)
  const mapLocations = useMemo(() => {
    return evaluatedMatches.map((m) => m.location)
  }, [evaluatedMatches])

  // Selected inspected location object
  const inspectedLocation = useMemo(() => {
    if (!inspectedLocationId) return null
    return locationsList.find((l) => l.id === inspectedLocationId) || null
  }, [inspectedLocationId, locationsList])

  // Handler: Selecting a location (from map marker or location card)
  const handleSelectLocation = (locationId) => {
    setActiveMapLocationId(locationId)
    setInspectedLocationId(locationId)
    setIsSidePanelOpen(true)
    if (mapBodyMode === 'compare') {
      setCompareEarthId(locationId)
    }
  }

  // Handler: New custom location added
  const handleLocationAdded = (newLoc) => {
    const updated = getAllLocations()
    setLocationsList(updated)
    setActiveMapLocationId(newLoc.id)
    setInspectedLocationId(newLoc.id)
    setIsSidePanelOpen(true)
  }

  // Handler: Selecting a card to inspect (scrolls up to map and opens side panel)
  const handleInspectCard = (locationId) => {
    handleSelectLocation(locationId)
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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
    setPrimaryFilter('ALL')
    setSearchQuery('')
  }

  const selectedLocationsForMatrix = useMemo(() => {
    return locationsList.filter((l) => selectedForCompareIds.includes(l.id))
  }, [selectedForCompareIds, locationsList])

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
    return locationsList.find((l) => l.id === compareEarthId) || locationsList[0] || ANALOGUE_LOCATIONS[0]
  }, [compareEarthId, locationsList])

  return (
    <div className="location-finder-container" ref={mapSectionRef}>
      {/* =========================================================================
          1. DARK, SPACE-INSPIRED LEAFLET WORLD MAP (AT THE TOP OF THE PAGE)
          ========================================================================= */}
      <section
        className="location-map-section aerospace-card"
        style={{
          marginTop: '0px',
          marginBottom: '24px',
          overflow: 'hidden',
          backgroundColor: 'rgba(5, 6, 8, 0.94)',
          border: '1px solid var(--border-default)',
        }}
        aria-label="Interactive Maps and Planetary Data Explorer"
      >
        {/* Top Header & Telemetry Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'rgba(10, 15, 25, 0.8)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '0.12em' }}>
                // GEODETIC &amp; TOPOGRAPHIC EXPLORER
              </span>
              <span className="badge-source font-mono">
                {viewMode === 'globe'
                  ? `${mapLocations.length} / ${locationsList.length} 3D Globe Sites Active`
                  : mapBodyMode === 'earth'
                  ? `${mapLocations.length} / ${locationsList.length} Earth Sites Active`
                  : `${PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody.toLowerCase() === mapBodyMode).length} Planetary Targets`}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0 0' }}>
              {viewMode === 'globe' && 'Earth Terrestrial Analogue Geodesy &bull; 3D Planetary Globe'}
              {viewMode === 'map' && mapBodyMode === 'earth' && 'Earth Terrestrial Analogue Geodesy'}
              {viewMode === 'map' && mapBodyMode === 'mars' && 'Mars Global Topography (MOLA Altimetry)'}
              {viewMode === 'map' && mapBodyMode === 'moon' && 'Moon Lunar Surface & Pyroduct Skylights (LRO WAC)'}
              {viewMode === 'map' && mapBodyMode === 'compare' && 'Planetary vs Earth Terrestrial Comparison'}
              {viewMode === 'catalog' && 'Audited Earth Analogue Candidate Catalog'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {viewMode === 'globe'
                ? 'Interactive 3D Earth Globe: rotate, zoom, and select analogue markers to inspect in-situ telemetry and off-world relevance.'
                : 'Click any location marker to inspect verified photographs, lithology, environmental parameters, and off-world terrain comparisons.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Primary Visualization Mode Switcher: 3D Globe vs 2D Map vs List */}
            <div className="font-mono" style={{ display: 'flex', gap: '4px', background: 'var(--bg-void)', padding: '3px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => {
                  setViewMode('globe')
                  setShowMap(true)
                }}
                style={{
                  background: viewMode === 'globe' ? 'rgba(0, 210, 255, 0.2)' : 'none',
                  color: viewMode === 'globe' ? '#00d2ff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                🌐 3D Globe
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('map')
                  setShowMap(true)
                }}
                style={{
                  background: viewMode === 'map' ? 'rgba(0, 210, 255, 0.2)' : 'none',
                  color: viewMode === 'map' ? '#00d2ff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                🗺️ 2D Map
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('catalog')
                  const dirEl = document.querySelector('.location-directory-section')
                  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  background: viewMode === 'catalog' ? 'rgba(0, 210, 255, 0.2)' : 'none',
                  color: viewMode === 'catalog' ? '#00d2ff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                📋 List View
              </button>
            </div>

            {/* 2D Map Celestial Body Selector (Only when in 2D Map mode) */}
            {viewMode === 'map' && (
              <div className="font-mono" style={{ display: 'flex', gap: '4px', background: 'var(--bg-void)', padding: '3px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setMapBodyMode('earth')}
                  style={{
                    background: mapBodyMode === 'earth' ? 'rgba(0, 210, 255, 0.2)' : 'none',
                    color: mapBodyMode === 'earth' ? '#00d2ff' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  Earth
                </button>
                <button
                  type="button"
                  onClick={() => setMapBodyMode('mars')}
                  style={{
                    background: mapBodyMode === 'mars' ? 'rgba(249, 115, 22, 0.2)' : 'none',
                    color: mapBodyMode === 'mars' ? '#f97316' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  Mars
                </button>
                <button
                  type="button"
                  onClick={() => setMapBodyMode('moon')}
                  style={{
                    background: mapBodyMode === 'moon' ? 'rgba(203, 213, 225, 0.2)' : 'none',
                    color: mapBodyMode === 'moon' ? '#cbd5e1' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  Moon
                </button>
                <button
                  type="button"
                  onClick={() => setMapBodyMode('compare')}
                  style={{
                    background: mapBodyMode === 'compare' ? 'rgba(234, 179, 8, 0.2)' : 'none',
                    color: mapBodyMode === 'compare' ? '#eab308' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  Compare
                </button>
              </div>
            )}

            {/* Add Location Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-aerospace font-mono"
              style={{
                padding: '5px 12px',
                fontSize: '11px',
                borderColor: 'var(--accent-cyan)',
                color: '#ffffff',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
              }}
            >
              + Add Site
            </button>

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
              {showMap ? 'Hide Visualizer ▲' : 'Show Visualizer ▼'}
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. THE 5 MANDATORY FILTER CONTROLS BAR (All Sites, Mars, Moon, Dual, Facility)
            ========================================================================= */}
        <div
          className="filter-controls-strip"
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(5, 6, 8, 0.98)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginRight: '4px' }}>
              FILTER SITES:
            </span>
            {PRIMARY_FILTER_TABS.map((tab) => {
              const isActive = primaryFilter === tab.id
              const count = filterCounts[tab.id]

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPrimaryFilter(tab.id)}
                  style={{
                    background: isActive ? 'rgba(0, 210, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#00d2ff' : '#cbd5e1',
                    border: '1px solid',
                    borderColor: isActive ? '#00d2ff' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                  }}
                  aria-pressed={isActive}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '10px',
                      backgroundColor: isActive ? 'rgba(0, 210, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isSidePanelOpen && (
              <span className="font-mono" style={{ fontSize: '11px', color: '#00d2ff' }}>
                Side Panel Active &bull; {inspectedLocation ? inspectedLocation.name.split('(')[0] : 'None'}
              </span>
            )}
            <button
              type="button"
              className="font-mono"
              onClick={() => {
                if (inspectedLocation) {
                  setIsSidePanelOpen(!isSidePanelOpen)
                } else {
                  handleSelectLocation(mapLocations[0]?.id || ANALOGUE_LOCATIONS[0].id)
                }
              }}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--text-secondary)',
                padding: '4px 10px',
                fontSize: '11px',
                borderRadius: '2px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {isSidePanelOpen ? 'Close Side Panel ✕' : 'Open Side Panel ❯'}
            </button>
          </div>
        </div>

        {/* Comparative Planetary vs Earth Drawer (Visible in Compare Mode) */}
        {mapBodyMode === 'compare' && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(5, 6, 8, 0.85)',
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
                    onChange={(e) => {
                      setCompareEarthId(e.target.value)
                      handleSelectLocation(e.target.value)
                    }}
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
                  <strong>Relief Scale:</strong> {selectedEarthAnalogue.elevation?.nominalM}m elevation &bull; {selectedEarthAnalogue.geomorphology?.primaryLandform || selectedEarthAnalogue.terrainType}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Viewport and Interactive Side Panel Container */}
        {showMap && viewMode !== 'catalog' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isSidePanelOpen && inspectedLocation ? '1fr minmax(360px, 460px)' : '1fr',
              transition: 'grid-template-columns 0.25s ease',
              position: 'relative',
              minHeight: viewMode === 'globe' ? '580px' : '540px',
            }}
          >
            {/* 3D Earth Globe Mode */}
            {viewMode === 'globe' && (
              <div style={{ position: 'relative', minHeight: '580px', width: '100%' }}>
                <EarthGlobe3D
                  locations={locationsList}
                  activeLocationId={inspectedLocationId || activeMapLocationId}
                  onSelectLocation={handleSelectLocation}
                  onEvaluateSite={(id) => {
                    if (onNavigate) {
                      onNavigate('site-evaluation', { locationId: id })
                    }
                  }}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  filterBody={primaryFilter}
                  onFilterChange={(tabId) => setPrimaryFilter(tabId)}
                />
              </div>
            )}

            {/* 2D Leaflet World Map Mode */}
            {viewMode === 'map' && (
              <div style={{ position: 'relative', minHeight: '540px' }}>
                <InteractiveMap
                  mode={mapBodyMode === 'compare' ? 'earth' : mapBodyMode}
                  locations={mapLocations}
                  activeLocationId={mapBodyMode === 'compare' ? compareEarthId : activeMapLocationId}
                  onSelectLocation={handleSelectLocation}
                  onEvaluateSite={(id) => {
                    if (onNavigate) {
                      onNavigate('site-evaluation', { locationId: id })
                    }
                  }}
                  height="540px"
                  showLayerSwitcher={true}
                  showLegend={true}
                />
              </div>
            )}

            {/* Interactive Side Panel (Opens when any marker or card is clicked) */}
            {isSidePanelOpen && inspectedLocation && (
              <div
                style={{
                  maxHeight: viewMode === 'globe' ? '580px' : '540px',
                  overflowY: 'auto',
                  borderLeft: '1px solid var(--border-subtle)',
                }}
              >
                <LocationSidePanel
                  location={inspectedLocation}
                  onClose={() => setIsSidePanelOpen(false)}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </div>
        )}

        {/* Catalog Mode Banner */}
        {showMap && viewMode === 'catalog' && (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(5, 6, 8, 0.9)',
              borderBottom: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '6px' }}>
              // CATALOG DIRECTORY MODE ACTIVE
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 14px 0' }}>
              Full candidate location directory is displayed below with multi-criteria ConOps filters and comparison tools.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-aerospace btn-aerospace-cyan font-mono"
                onClick={() => setViewMode('globe')}
                style={{ padding: '6px 14px', fontSize: '11px' }}
              >
                🌐 Launch 3D Earth Globe
              </button>
              <button
                type="button"
                className="btn-aerospace font-mono"
                onClick={() => setViewMode('map')}
                style={{ padding: '6px 14px', fontSize: '11px' }}
              >
                🗺️ Open 2D Geodetic Map
              </button>
            </div>
          </div>
        )}

        {/* Map Layer and Dataset Info Strip */}
        <div
          className="font-mono"
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(5, 6, 8, 0.95)',
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
      </section>

      {/* =========================================================================
          3. COMPLETE WORLDWIDE LOCATION DIRECTORY (BELOW THE MAP)
          ========================================================================= */}
      <section className="location-directory-section" aria-label="Worldwide Location Directory">
        {/* Advanced Filter Collapse Toggle */}
        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="font-mono"
            onClick={() => setShowAdvancedCriteria(!showAdvancedCriteria)}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: showAdvancedCriteria ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              padding: '6px 12px',
              fontSize: '11px',
              borderRadius: '2px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {showAdvancedCriteria ? 'Hide Mission ConOps Builder ▲' : 'Open Mission ConOps & Slope Filters ▼'}
          </button>
        </div>

        {/* Optional Collapsible Mission Requirements & Slope/Thermal Builder */}
        {showAdvancedCriteria && (
          <div style={{ marginBottom: '20px' }}>
            <MissionRequirementBuilder
              criteria={criteria}
              onCriteriaChange={setCriteria}
              onResetCriteria={handleResetCriteria}
            />
          </div>
        )}

        {/* Results Header & Real-Time Search Bar */}
        <div className="results-header-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div className="results-title-group">
            <div className="aerospace-label">
              <span className="aerospace-label-accent">//</span> EVALUATED CANDIDATE CATALOG
            </div>
            <h2 className="results-heading" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
              Audited Earth Locations ({evaluatedMatches.length} Sites)
            </h2>
            <p className="results-subheading" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Showing {primaryFilter === 'ALL' ? 'all' : primaryFilter.toLowerCase()} analogue sites. Synchronized with top interactive map and telemetry profile.
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
              aria-label="Search location directory"
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
                aria-label="Clear search"
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

        {/* Candidate Location Cards Grid */}
        <div className="candidates-grid">
          {evaluatedMatches.map((matchResult) => (
            <CandidateMatchCard
              key={matchResult.location.id}
              matchResult={matchResult}
              isSelectedForCompare={selectedForCompareIds.includes(matchResult.location.id)}
              onToggleCompare={handleToggleCompare}
              onInspectProfile={(id) => handleInspectCard(id)}
              isPreFocused={activeMapLocationId === matchResult.location.id}
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
                No candidate locations match the active filter ({primaryFilter}) and search query "{searchQuery}".
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
      </section>

      {/* 4. Bottom Comparison Tray (Visible when >= 1 candidate selected) */}
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

      {/* 5. Multi-Candidate Comparison Matrix Modal */}
      {isMatrixOpen && (
        <ComparisonMatrix
          selectedLocations={selectedLocationsForMatrix}
          evaluatedMatches={evaluatedMatches}
          onRemoveLocation={handleToggleCompare}
          onClose={() => setIsMatrixOpen(false)}
          onInspectProfile={(id) => {
            setIsMatrixOpen(false)
            handleInspectCard(id)
          }}
        />
      )}

      {/* 6. Optional Fullscreen In-Depth Inspector Modal */}
      {showFullInspectorModal && inspectedLocation && (
        <LocationInspector
          location={inspectedLocation}
          onClose={() => setShowFullInspectorModal(false)}
          onNavigate={onNavigate}
        />
      )}

      {/* 7. Future Expansion: Add New Analogue Location Modal */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLocationAdded={handleLocationAdded}
      />
    </div>
  )
}
