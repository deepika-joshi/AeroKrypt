import { useState, useMemo, useEffect } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { matchLocations } from '../../services/locationMatcher.js'
import MissionRequirementBuilder from './MissionRequirementBuilder.jsx'
import CandidateMatchCard from './CandidateMatchCard.jsx'
import ComparisonMatrix from './ComparisonMatrix.jsx'
import LocationInspector from './LocationInspector.jsx'

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
  const [selectedForCompareIds, setSelectedForCompareIds] = useState([])
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [inspectedLocationId, setInspectedLocationId] = useState(prefocusedLocationId)
  const [prevPrefocusedId, setPrevPrefocusedId] = useState(prefocusedLocationId)

  // Synchronize state during render when prop changes
  if (prefocusedLocationId !== prevPrefocusedId) {
    setPrevPrefocusedId(prefocusedLocationId)
    setInspectedLocationId(prefocusedLocationId)
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
  const evaluatedMatches = useMemo(() => {
    return matchLocations(ANALOGUE_LOCATIONS, criteria)
  }, [criteria])

  // Toggle selection for comparison (max 3)
  const handleToggleCompare = (locationId) => {
    setSelectedForCompareIds((prev) => {
      if (prev.includes(locationId)) {
        return prev.filter((id) => id !== locationId)
      }
      if (prev.length >= 3) {
        // Replace oldest or cap at 3
        return [...prev.slice(1), locationId]
      }
      return [...prev, locationId]
    })
  }

  const handleResetCriteria = () => {
    setCriteria(DEFAULT_CRITERIA)
  }

  const selectedLocationsForMatrix = useMemo(() => {
    return ANALOGUE_LOCATIONS.filter((loc) => selectedForCompareIds.includes(loc.id))
  }, [selectedForCompareIds])

  const inspectedLocation = useMemo(() => {
    return ANALOGUE_LOCATIONS.find((loc) => loc.id === inspectedLocationId) || null
  }, [inspectedLocationId])

  // Compute counts
  const highAlignmentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'HIGH_ALIGNMENT'
  ).length
  const partialAlignmentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'PARTIAL_ALIGNMENT'
  ).length
  const divergentCount = evaluatedMatches.filter(
    (e) => e.overallAlignment.key === 'SIGNIFICANT_DIVERGENCE'
  ).length

  return (
    <div className="location-finder-container">
      {/* 1. Requirements Builder */}
      <MissionRequirementBuilder
        criteria={criteria}
        onCriteriaChange={setCriteria}
        onResetCriteria={handleResetCriteria}
      />

      {/* 2. Results Header & Summary */}
      <div className="results-header-bar">
        <div className="results-title-group">
          <h2 className="results-heading">
            Evaluated Candidate Locations ({evaluatedMatches.length} Sites)
          </h2>
          <p className="results-subheading">
            Sorted deterministically by multi-parameter alignment. Every match cites published evidence; no scores are fabricated.
          </p>
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

      {/* 3. Candidate Location Cards List */}
      <div className="candidates-grid">
        {evaluatedMatches.map((matchResult) => (
          <CandidateMatchCard
            key={matchResult.location.id}
            matchResult={matchResult}
            isSelectedForCompare={selectedForCompareIds.includes(matchResult.location.id)}
            onToggleCompare={handleToggleCompare}
            onInspectProfile={(id) => setInspectedLocationId(id)}
            isPreFocused={prefocusedLocationId === matchResult.location.id}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* 4. Bottom Comparison Tray (Visible when >= 1 candidate selected) */}
      {selectedForCompareIds.length > 0 && (
        <aside className="comparison-bottom-tray" aria-label="Comparison Tray">
          <div className="tray-content">
            <div className="tray-info">
              <span className="tray-badge font-mono">{selectedForCompareIds.length} / 3 SELECTED</span>
              <span className="tray-title">
                Ready to compare candidates side-by-side
              </span>
            </div>

            <div className="tray-selected-names">
              {selectedLocationsForMatrix.map((loc) => (
                <span key={loc.id} className="tray-chip">
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
                className="btn-open-matrix"
                onClick={() => setIsMatrixOpen(true)}
              >
                Open Comparison Matrix &rarr;
              </button>
              <button
                type="button"
                className="btn-clear-tray"
                onClick={() => setSelectedForCompareIds([])}
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
            setInspectedLocationId(id)
          }}
        />
      )}

      {/* 6. In-Depth Location Environmental Profile Inspector Modal */}
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
