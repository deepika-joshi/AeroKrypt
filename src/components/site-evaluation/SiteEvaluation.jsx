import { useState, useMemo, useEffect } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { MISSION_OBJECTIVES } from '../../data/missionObjectives.js'
import { evaluateSite } from '../../services/siteAssessment.js'
import { evaluationsApi } from '../../services/apiClient.js'
import SiteProfileHeader from './SiteProfileHeader.jsx'
import DualSuitabilityPanel from './DualSuitabilityPanel.jsx'
import EnvironmentalParameterGrid from './EnvironmentalParameterGrid.jsx'
import MissingParametersCard from './MissingParametersCard.jsx'
import PlanetaryDivergenceTable from './PlanetaryDivergenceTable.jsx'
import EvidenceRegistryPanel from './EvidenceRegistryPanel.jsx'
import AssessmentSummaryCard from './AssessmentSummaryCard.jsx'
import SiteReportModal from './SiteReportModal.jsx'
import PlanetaryTerrainComparison from './PlanetaryTerrainComparison.jsx'
import '../../styles/site-evaluation.css'

export default function SiteEvaluation({
  initialLocationId = null,
  initialTerrainId = null,
  initialExperimentId = null,
  onNavigate = null,
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialLocationId || ANALOGUE_LOCATIONS[0].id
  )
  const [prevInitialLocId, setPrevInitialLocId] = useState(initialLocationId)
  if (initialLocationId && initialLocationId !== prevInitialLocId) {
    setPrevInitialLocId(initialLocationId)
    setSelectedLocationId(initialLocationId)
  }
  const [selectedExperimentId, setSelectedExperimentId] = useState(
    initialExperimentId || ''
  )
  const [prevInitialExpId, setPrevInitialExpId] = useState(initialExperimentId)
  if (initialExperimentId && initialExperimentId !== prevInitialExpId) {
    setPrevInitialExpId(initialExperimentId)
    setSelectedExperimentId(initialExperimentId)
  }
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('ALL')
  const [backendAssessment, setBackendAssessment] = useState(null)
  const [backendEngineStatus, setBackendEngineStatus] = useState('LOCAL_ENGINE') // 'API_ENGINE' | 'LOCAL_ENGINE'

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

  // Asynchronously query FastAPI / evaluations / site-assessment endpoint
  useEffect(() => {
    let isMounted = true
    async function fetchBackendAssessment() {
      try {
        const targetBody = activeLocation.primaryTarget === 'Moon' ? 'Moon' : 'Mars'
        const terrainId = targetBody === 'Moon' ? 'moon-marius-hills-skylight' : 'mars-jezero-delta'
        const res = await evaluationsApi.getSiteAssessment({
          location_id: activeLocation.id,
          target_body: targetBody,
          planetary_terrain_id: terrainId,
          experiment_id: selectedExperimentId || null,
        })
        if (!isMounted) return
        if (res.success && res.data) {
          setBackendAssessment(res.data)
          setBackendEngineStatus('API_ENGINE')
        } else {
          setBackendEngineStatus('LOCAL_ENGINE')
        }
      } catch {
        if (isMounted) setBackendEngineStatus('LOCAL_ENGINE')
      }
    }
    fetchBackendAssessment()
    return () => { isMounted = false }
  }, [activeLocation.id, activeLocation.primaryTarget, selectedExperimentId])

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
      {/* 1. Module Main Heading & Telemetry Bar */}
      <div className="section-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div className="aerospace-label">
            <span className="aerospace-label-accent">//</span> SCIENTIFIC GEODESY &amp; ANALOGUE FIDELITY
          </div>
          <h2 className="section-heading">Analogue Site Assessment</h2>
          <p className="section-subheading">
            Dual-vector evaluation of terrestrial analogue fidelity and operational mission suitability against Mars and Lunar orbital baselines.
          </p>
        </div>
        <div className="dataset-notice-chip font-mono">
          <span className="notice-dot" />
          <span>DUAL-VECTOR GEOLOGICAL &amp; OPERATIONAL ASSESSMENT</span>
        </div>
      </div>

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
                  {loc.name} ({loc.country}) — [{loc.locationCategory === 'RESEARCH_FACILITY' ? 'FACILITY' : 'NATURAL'}] {loc.analogueRelevance || loc.primaryTarget}
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
          <div className="control-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  backgroundColor: backendEngineStatus === 'API_ENGINE' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                  color: backendEngineStatus === 'API_ENGINE' ? '#4ade80' : '#38bdf8',
                  border: `1px solid ${backendEngineStatus === 'API_ENGINE' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
                }}
              >
                {backendEngineStatus === 'API_ENGINE' ? '⚡ FASTAPI ASSESSMENT: LIVE' : '💾 DETERMINISTIC ENGINE: LOCAL'}
              </span>
            </div>
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
        <div className="section-tabs-strip font-mono" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveSection('ALL')}
          >
            All Evaluation Modules
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSection === 'PLANETARY' ? 'active' : ''}`}
            onClick={() => setActiveSection('PLANETARY')}
            style={{ color: 'var(--color-accent-cyan)', fontWeight: 600 }}
          >
            🪐 Planetary Terrain Comparison (Mars / Moon)
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
      <div className="site-evaluation-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Core Scientific Planetary Terrain Comparison (Merged Module) */}
        {(activeSection === 'ALL' || activeSection === 'PLANETARY') && (
          <PlanetaryTerrainComparison
            initialTargetBody={activeLocation.primaryTarget === 'Moon' ? 'Moon' : 'Mars'}
            initialTerrainId={initialTerrainId}
            initialLocationId={selectedLocationId}
            initialExperimentId={selectedExperimentId}
            onNavigate={onNavigate}
          />
        )}

        {/* 2. Terrestrial Field Profile Header */}
        {(activeSection === 'ALL' || activeSection !== 'PLANETARY') && (
          <SiteProfileHeader
            location={location}
            onExportClick={() => setIsReportModalOpen(true)}
          />
        )}

        {/* 3. Dual Suitability */}
        {(activeSection === 'ALL' || activeSection === 'DUAL') && (
          <DualSuitabilityPanel
            geologicalSimilarity={geologicalSimilarity}
            operationalSuitability={operationalSuitability}
            experiment={experiment}
            backendAssessment={backendAssessment}
          />
        )}

        {/* 4. Missing Critical Parameters */}
        {(activeSection === 'ALL' || activeSection === 'GAPS') && (
          <MissingParametersCard
            missingCriticalParameters={missingCriticalParameters}
            experiment={experiment}
          />
        )}

        {/* 5. Environmental Parameters Grid */}
        {(activeSection === 'ALL' || activeSection === 'PARAMS') && (
          <EnvironmentalParameterGrid
            parameters={parameters}
          />
        )}

        {/* 6. Planetary Physical Divergences */}
        {(activeSection === 'ALL' || activeSection === 'DIVERGENCE') && (
          <PlanetaryDivergenceTable
            planetaryDivergence={planetaryDivergence}
            location={location}
          />
        )}

        {/* 7. Synthesis Assessment Summary */}
        {(activeSection === 'ALL' || activeSection === 'SYNTHESIS') && (
          <AssessmentSummaryCard
            assessmentSummary={assessmentSummary}
            location={location}
          />
        )}

        {/* 8. Traceable Evidence Registry */}
        {(activeSection === 'ALL' || activeSection === 'EVIDENCE') && (
          <EvidenceRegistryPanel
            evidenceRegistry={evidenceRegistry}
          />
        )}
      </div>

      {/* Printable / Exportable Site Dossier Modal */}
      {isReportModalOpen && (
        <SiteReportModal
          isOpen={isReportModalOpen}
          evaluationData={evaluationData}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  )
}
