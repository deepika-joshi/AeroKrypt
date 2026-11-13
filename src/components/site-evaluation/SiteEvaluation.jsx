import { useState, useMemo } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { MISSION_OBJECTIVES } from '../../data/missionObjectives.js'
import { evaluateSite } from '../../services/siteAssessment.js'
import SiteProfileHeader from './SiteProfileHeader.jsx'
import DualSuitabilityPanel from './DualSuitabilityPanel.jsx'
import EnvironmentalParameterGrid from './EnvironmentalParameterGrid.jsx'
import MissingParametersCard from './MissingParametersCard.jsx'
import PlanetaryDivergenceTable from './PlanetaryDivergenceTable.jsx'
import EvidenceRegistryPanel from './EvidenceRegistryPanel.jsx'
import AssessmentSummaryCard from './AssessmentSummaryCard.jsx'
import SiteReportModal from './SiteReportModal.jsx'
import '../../styles/site-evaluation.css'

export default function SiteEvaluation({
  initialLocationId = null,
  initialExperimentId = null,
  onNavigate = null,
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialLocationId || ANALOGUE_LOCATIONS[0].id
  )
  const [selectedExperimentId, setSelectedExperimentId] = useState(
    initialExperimentId || ''
  )
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('ALL')

  // Find active location
  const activeLocation = useMemo(() => {
    return (
      ANALOGUE_LOCATIONS.find((loc) => loc.id === selectedLocationId) ||
      ANALOGUE_LOCATIONS[0]
    )
  }, [selectedLocationId])

  // Run comprehensive site evaluation
  const evaluationData = useMemo(() => {
    return evaluateSite(activeLocation, selectedExperimentId || null)
  }, [activeLocation, selectedExperimentId])

  const {
    location,
    experiment,
    parameters,
    geologicalSimilarity,
    operationalSuitability,
    missingCriticalParameters,
    planetaryDivergence,
    evidenceRegistry,
    assessmentSummary,
  } = evaluationData

  return (
    <div className="site-evaluation-container" id="site-evaluation-module">
      {/* Top Scientific Control Panel */}
      <section className="evaluation-controls-bar">
        <div className="controls-form-grid">
          {/* Location Selector */}
          <div className="control-group">
            <label htmlFor="eval-location-select" className="control-label font-mono">
              Analogue Research Location:
            </label>
            <select
              id="eval-location-select"
              className="control-select"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              {ANALOGUE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.country}) — {loc.primaryTarget}
                </option>
              ))}
            </select>
          </div>

          {/* Planned Experiment Context */}
          <div className="control-group">
            <label htmlFor="eval-experiment-select" className="control-label font-mono">
              Mission Experiment Protocol (ConOps Context):
            </label>
            <select
              id="eval-experiment-select"
              className="control-select"
              value={selectedExperimentId}
              onChange={(e) => setSelectedExperimentId(e.target.value)}
            >
              <option value="">-- General Site Baseline (No Specific Experiment) --</option>
              {MISSION_OBJECTIVES.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.title} ({obj.primaryTarget})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="control-actions">
            <button
              type="button"
              className="btn-export-dossier font-mono"
              onClick={() => setIsReportModalOpen(true)}
            >
              &#128196; Export / Print Dossier
            </button>
            {onNavigate && (
              <button
                type="button"
                className="btn-nav-finder font-mono"
                onClick={() => onNavigate('location-explorer', { locationId: location.id })}
              >
                &larr; Cross-Reference in Location Finder
              </button>
            )}
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="location-quick-strip font-mono">
          <span className="strip-label">Quick Switch:</span>
          <div className="location-pills">
            {ANALOGUE_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={`loc-pill ${loc.id === selectedLocationId ? 'active' : ''}`}
                onClick={() => setSelectedLocationId(loc.id)}
              >
                {loc.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="section-tabs-strip font-mono">
          <button
            type="button"
            className={`tab-btn ${activeSection === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveSection('ALL')}
          >
            All Evaluation Modules
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'DUAL' ? 'active' : ''}`}
            onClick={() => setActiveSection('DUAL')}
          >
            Geology vs. Operations
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'PARAMS' ? 'active' : ''}`}
            onClick={() => setActiveSection('PARAMS')}
          >
            Traceable Parameters ({parameters.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'DIVERGENCE' ? 'active' : ''}`}
            onClick={() => setActiveSection('DIVERGENCE')}
          >
            Planetary Divergence
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'GAPS' ? 'active' : ''}`}
            onClick={() => setActiveSection('GAPS')}
          >
            Data Gaps &amp; Uncertainties
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'EVIDENCE' ? 'active' : ''}`}
            onClick={() => setActiveSection('EVIDENCE')}
          >
            Evidence Registry ({evidenceRegistry.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'SYNTHESIS' ? 'active' : ''}`}
            onClick={() => setActiveSection('SYNTHESIS')}
          >
            Synthesis Assessment
          </button>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="site-evaluation-body">
        {/* Profile Header */}
        <SiteProfileHeader
          location={location}
          onExportClick={() => setIsReportModalOpen(true)}
        />

        {/* Dual Suitability */}
        {(activeSection === 'ALL' || activeSection === 'DUAL') && (
          <DualSuitabilityPanel
            geologicalSimilarity={geologicalSimilarity}
            operationalSuitability={operationalSuitability}
            experiment={experiment}
          />
        )}

        {/* Missing Critical Parameters */}
        {(activeSection === 'ALL' || activeSection === 'GAPS') && (
          <MissingParametersCard
            missingCriticalParameters={missingCriticalParameters}
            experiment={experiment}
          />
        )}

        {/* Environmental Parameters Grid */}
        {(activeSection === 'ALL' || activeSection === 'PARAMS') && (
          <EnvironmentalParameterGrid
            parameters={parameters}
          />
        )}

        {/* Planetary Physical Divergences */}
        {(activeSection === 'ALL' || activeSection === 'DIVERGENCE') && (
          <PlanetaryDivergenceTable
            planetaryDivergence={planetaryDivergence}
            location={location}
          />
        )}

        {/* Synthesis Assessment Summary */}
        {(activeSection === 'ALL' || activeSection === 'SYNTHESIS') && (
          <AssessmentSummaryCard
            assessmentSummary={assessmentSummary}
            location={location}
            experiment={experiment}
          />
        )}

        {/* Peer-Reviewed Evidence Registry */}
        {(activeSection === 'ALL' || activeSection === 'EVIDENCE') && (
          <EvidenceRegistryPanel
            evidenceRegistry={evidenceRegistry}
            sourceAttribution={location.sourceAttribution}
          />
        )}
      </div>

      {/* Printable Dossier Modal */}
      <SiteReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        evaluationData={evaluationData}
      />
    </div>
  )
}

