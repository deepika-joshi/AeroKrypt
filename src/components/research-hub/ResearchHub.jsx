import { useState, useMemo, useEffect } from 'react'
import {
  getAllExperiments,
  getResearchRecords,
  deleteResearchRecord,
  getAllSubmissions,
  saveDraftSubmission,
  submitForReview,
  updateSubmissionReview,
  publishSubmission,
  deleteSubmission,
  getCurrentRole,
  setCurrentRole,
  exportReportAsFile,
  SUBMISSION_STATUSES,
  CONTRIBUTION_TYPES,
  PROTOTYPE_WORKFLOW_DISCLAIMER,
} from '../../services/researchRecordService.js'
import { authApi, researchApi, evaluationsApi } from '../../services/apiClient.js'
import ResearcherAuthModal from './ResearcherAuthModal.jsx'
import PageIntroHeader from '../common/PageIntroHeader.jsx'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { PEER_REVIEWED_RESEARCH_LIBRARY, RESEARCH_CATEGORIES } from '../../data/researchLibraryData.js'

// Initial Seed Projects for the Research Workspace
const INITIAL_PROJECTS = [
  {
    id: 'proj-demo-001',
    title: 'Haughton Crater Visual Odometry Calibration in Loose Impact Breccia',
    abstract: 'Validating autonomous visual odometry and slip compensation algorithms on Devon Island impact ejecta fields before flight deployment on Mars rovers.',
    target_body: 'Mars',
    analogue_location_id: 'haughton-crater',
    mission_objective_id: 'rover-mobility',
    methodology: 'Tri-axial wheel torque monitoring paired with downward optical visual odometry cameras across 5 km traverses.',
    research_objectives: 'Reduce dead-reckoning drift below 5% and validate Sun-sensor heading corrections in polar ejecta.',
    collaborators: [
      { name: 'Dr. Pascal Lee', affiliation: 'Mars Institute / SETI', role: 'Principal Investigator' },
      { name: 'Dr. G. Osinski', affiliation: 'Western Univ.', role: 'Impact Geologist' },
    ],
    status: 'APPROVED',
    created_at: '2026-11-04T09:00:00Z',
  },
  {
    id: 'proj-demo-002',
    title: 'Atacama Yungay Hyper-Arid Basin Astrobiological & Dielectric Baseline',
    abstract: 'Mapping subsurface soil dielectric permittivity and organic preservation thresholds using multi-frequency GPR and Raman spectroscopy.',
    target_body: 'Mars',
    analogue_location_id: 'atacama-yungay',
    mission_objective_id: 'extremophile-astrobiology',
    methodology: '500 MHz and 1 GHz GPR sounding transects coupled with sterile coring to 1-meter depth.',
    research_objectives: 'Establish dielectric baseline for RIMFAX radar sounding interpretation on Mars.',
    collaborators: [
      { name: 'Dr. C. P. McKay', affiliation: 'NASA Ames', role: 'Astrobiologist' },
    ],
    status: 'UNDER_REVIEW',
    created_at: '2026-11-08T11:00:00Z',
  },
]

export default function ResearchHub({ initialSubview = 'experiments', onNavigate = null }) {
  const [activeTab, setActiveTab] = useState(initialSubview)
  const [prevInitialSubview, setPrevInitialSubview] = useState(initialSubview)
  const [userRole, setUserRole] = useState(getCurrentRole())
  const [records, setRecords] = useState(getResearchRecords())
  const [experiments] = useState(getAllExperiments())
  const [submissions, setSubmissions] = useState(getAllSubmissions())

  // Full-Stack Researcher Authentication state
  const [authResearcher, setAuthResearcher] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Search & filter states
  const [experimentSearch, setExperimentSearch] = useState('')
  const [experimentBodyFilter, setExperimentBodyFilter] = useState('ALL')
  const [recordSearch, setRecordSearch] = useState('')
  const [recordBodyFilter, setRecordBodyFilter] = useState('ALL')

  // Library filter states
  const [libraryCategory, setLibraryCategory] = useState('ALL')
  const [libraryBodyFilter, setLibraryBodyFilter] = useState('ALL')
  const [librarySearch, setLibrarySearch] = useState('')

  // Workspace sub-form tab: 'projects' | 'data-entry' | 'saved-evaluations' | 'pipeline'
  const [workspaceFormTab, setWorkspaceFormTab] = useState('projects')
  const [submissionFilter, setSubmissionFilter] = useState('ALL') // 'ALL' | 'DRAFTS' | 'QUEUE' | 'PUBLISHED'
  const [reviewModalItem, setReviewModalItem] = useState(null)
  const [reviewCommentInput, setReviewCommentInput] = useState('')
  const [reviewerNameInput, setReviewerNameInput] = useState('Dr. Field Investigator')

  // Notification message
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // 1. Research Project States
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [activeProjectId, setActiveProjectId] = useState(INITIAL_PROJECTS[0].id)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: '',
    abstract: '',
    target_body: 'Mars',
    analogue_location_id: ANALOGUE_LOCATIONS[0].id,
    mission_objective_id: 'rover-mobility',
    methodology: '',
    research_objectives: '',
    collaboratorName: '',
    collaboratorAffiliation: '',
    collaboratorRole: 'Co-Investigator',
    collaborators: [],
  })

  // 2. Structured Field Data Entry States
  const [fieldObservations, setFieldObservations] = useState([
    { id: 'obs-1', timestamp: '2026-11-12 14:30', coordinates: '-24.0889, -69.9286', note: 'Desiccated polygon crack boundaries observed in halite-nitrate crust; dry depth > 45 cm.', terrainContext: 'Hyper-arid basin playa floor' },
  ])
  const [newObs, setNewObs] = useState({ coordinates: '-24.0889, -69.9286', note: '', terrainContext: 'Basin Floor' })

  const [environmentalMeasurements, setEnvironmentalMeasurements] = useState([
    { id: 'meas-1', parameter: 'Ambient Temperature', value: '18.4', unit: '°C', instrument: 'MEDA-type Thermistor', uncertainty: '±0.2°C' },
    { id: 'meas-2', parameter: 'Atmospheric Pressure', value: '984.2', unit: 'hPa', instrument: 'Vaisala Barometer', uncertainty: '±0.5 hPa' },
    { id: 'meas-3', parameter: 'Relative Humidity', value: '7.8', unit: '%', instrument: 'Capacitive Hygrometer', uncertainty: '±1.5%' },
    { id: 'meas-4', parameter: 'Soil pH', value: '7.9', unit: 'pH', instrument: 'Glass Electrode pH Meter', uncertainty: '±0.1' },
    { id: 'meas-5', parameter: 'Soil Salinity (NaCl eq)', value: '14.2', unit: 'g/kg', instrument: 'Conductivity Probe', uncertainty: '±0.4 g/kg' },
  ])
  const [newMeas, setNewMeas] = useState({ parameter: 'Solar Irradiance', value: '1020', unit: 'W/m²', instrument: 'Pyranometer', uncertainty: '±15 W/m²' })

  const [geologicalObservations, setGeologicalObservations] = useState([
    { id: 'geo-1', lithology: 'Nitrate-sulfate evaporite duricrust', grainSize: 'Fine crystalline (<0.5 mm)', mineralogy: 'Halite, Anhydrite, Nitratine', stratigraphicLayer: 'Top 15 cm hardpan' },
  ])
  const [newGeo, setNewGeo] = useState({ lithology: '', grainSize: '', mineralogy: '', stratigraphicLayer: '' })

  const [experimentParams, setExperimentParams] = useState({
    samplingRateHz: '10.0',
    drillDepthCm: '35',
    traverseSpeedMs: '0.15',
    illuminationWavelengthNm: '532',
  })

  const [instrumentReadings, setInstrumentReadings] = useState([
    { id: 'ir-1', instrumentName: 'Field GPR 500 MHz', measurementType: 'Dielectric Permittivity (εr)', value: '3.1', unit: 'dimensionless', timestamp: '2026-11-12 15:10' },
  ])
  const [newIr, setNewIr] = useState({ instrumentName: '', measurementType: '', value: '', unit: '' })

  const [attachments, setAttachments] = useState([
    { id: 'att-1', caption: 'High-resolution surface breccia macrograph', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', sensorType: 'Optical Mastcam-Z analogue' },
  ])
  const [newAtt, setNewAtt] = useState({ caption: '', url: '', sensorType: 'Optical Field Camera' })

  // 3. Saved Site Evaluations States
  const [savedEvaluations, setSavedEvaluations] = useState([
    {
      evaluation_id: 'eval-devon-jezero-001',
      project_id: 'proj-demo-001',
      evaluation_version: '2.0.0-spatial',
      created_at: '2026-11-12T10:30:00Z',
      location_id: 'haughton-crater',
      location_name: 'Haughton Impact Structure',
      target_body: 'Mars',
      planetary_terrain_id: 'mars-jezero-delta',
      planetary_terrain_name: 'Jezero Crater Delta (Mars 2020)',
      experiment_id: 'rover-mobility',
      geological_similarity: 78.5,
      operational_suitability: 88.0,
      composite_score: 83.25,
      recommendation: 'STRONG_CANDIDATE',
    },
    {
      evaluation_id: 'eval-atacama-jezero-002',
      project_id: 'proj-demo-002',
      evaluation_version: '2.0.0-spatial',
      created_at: '2026-11-13T14:15:00Z',
      location_id: 'atacama-yungay',
      location_name: 'Atacama Desert (Yungay)',
      target_body: 'Mars',
      planetary_terrain_id: 'mars-jezero-delta',
      planetary_terrain_name: 'Jezero Crater Delta (Mars 2020)',
      experiment_id: 'extremophile-astrobiology',
      geological_similarity: 84.0,
      operational_suitability: 79.5,
      composite_score: 81.75,
      recommendation: 'STRONG_CANDIDATE',
    },
  ])
  const [evalLocationId, setEvalLocationId] = useState(ANALOGUE_LOCATIONS[0].id)
  const [evalTargetBody, setEvalTargetBody] = useState('Mars')
  const [evalTerrainId, setEvalTerrainId] = useState('mars-jezero-delta')
  const [evalExperimentId, setEvalExperimentId] = useState('rover-mobility')
  const [isAssessing, setIsAssessing] = useState(false)
  const [activeEvalDetailModal, setActiveEvalDetailModal] = useState(null)
  const [selectedForCompareIds, setSelectedForCompareIds] = useState([])
  const [compareModalData, setCompareModalData] = useState(null)

  // 4. Audit Trail Modal State
  const [auditTrailModalItem, setAuditTrailModalItem] = useState(null)
  const [auditTrailLogs, setAuditTrailLogs] = useState([])
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)

  // Form states for Legacy Forms
  const [recordForm, setRecordForm] = useState({
    title: '',
    researcherName: 'Dr. Jane Planetary',
    affiliation: 'Planetary Science Institute / AEROKRYPT',
    studyLocation: ANALOGUE_LOCATIONS[0].name,
    targetBody: 'Mars',
    objective: '',
    methodology: '',
    findings: '',
    datasetReferences: 'NASA MOLA 128 px/deg altimetry; USGS 3DEP',
    doiLink: '10.1089/153110703769016460',
    supportingNotes: '',
  })

  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    analogueLocationId: ANALOGUE_LOCATIONS[0].id,
    targetBody: 'Mars',
    missionObjectiveId: 'rover-mobility',
    parametersAssessed: 'Slope gradient (2.5°), breccia cobble frequency, soil cohesion.',
    evidenceSources: 'Lee et al. (2012) IJRR 31:1735; MOLA MEGDR',
    assessmentResults: 'HIGH_ALIGNMENT for rover wheel mobility; uncataloged sub-meter boulder risk noted.',
    missingDataLimitations: 'Sub-meter roughness uncataloged via orbital DEM.',
    conclusion: 'Candidate site is validated for wheeled autonomous traverse verification.',
  })

  const [evaluationForm, setEvaluationForm] = useState({
    title: '',
    evaluatedItemId: 'eval-rec-001',
    reviewerName: 'Dr. External Reviewer',
    reviewerRole: 'Senior Planetary Geologist (USGS Astrogeology)',
    evaluationCriteria: 'Geodetic rigor, mineralogical proxy accuracy, ConOps relevance.',
    scientificStrengths: 'Solid peer-reviewed literature baseline with authentic DOI indexing.',
    methodologicalConcerns: 'Atmospheric pressure divergence (101 kPa vs 610 Pa) requires explicit modeling.',
    evidenceQuality: 'High - supported by published journal references.',
    limitations: 'Gravitational field disparity (1.0G vs 0.38G) cannot be eliminated on Earth.',
    recommendations: 'Include wheel sinkage Bekker-Wong telemetry before concluding terrain equivalence.',
    reviewerComments: 'Approved for planetary research repository.',
  })

  // Synchronize during render when prop changes
  if (initialSubview !== prevInitialSubview) {
    setPrevInitialSubview(initialSubview)
    setActiveTab(initialSubview)
  }

  // Check authenticated researcher session on mount
  useEffect(() => {
    let isMounted = true
    async function checkAuthSession() {
      try {
        const res = await authApi.getMe()
        if (!isMounted) return
        if (res.success && res.data) {
          setAuthResearcher(res.data)
          setIsBackendConnected(true)
          if (res.data.role) {
            setUserRole(res.data.role)
            setCurrentRole(res.data.role)
          }
          // Load private records from backend
          const recRes = await researchApi.getMyRecords()
          if (recRes.success && recRes.data && recRes.data.length > 0) {
            // Map backend records to UI format if needed
            const mapped = recRes.data.map((r) => ({
              id: r.id,
              title: r.title,
              targetBody: r.target_body,
              author: res.data.full_name,
              date: (r.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
              summary: r.abstract || r.objective || r.findings || '',
              status: r.status,
              verifiedStatus: 'RESEARCHER_PRIVATE_WORKSPACE',
              tags: [r.category, r.target_body],
            }))
            setRecords(mapped)
          }

          // Load projects from backend if available
          try {
            const projRes = await researchApi.getProjects()
            if (projRes.success && Array.isArray(projRes.data) && projRes.data.length > 0) {
              setProjects(projRes.data)
              setActiveProjectId(projRes.data[0].id)
            }
          } catch {
            // retain initial projects
          }
        } else {
          setIsBackendConnected(!res.isNetworkError)
        }
      } catch {
        if (isMounted) setIsBackendConnected(false)
      }
    }
    checkAuthSession()
    return () => { isMounted = false }
  }, [])

  const handleAuthSuccess = async (researcher) => {
    setAuthResearcher(researcher)
    setIsBackendConnected(true)
    if (researcher.role) {
      setUserRole(researcher.role)
      setCurrentRole(researcher.role)
    }
    setFeedbackMsg(`Authenticated as ${researcher.full_name} (${researcher.role})`)
    setTimeout(() => setFeedbackMsg(''), 4000)

    // Sync records
    try {
      const recRes = await researchApi.getMyRecords()
      if (recRes.success && recRes.data && recRes.data.length > 0) {
        const mapped = recRes.data.map((r) => ({
          id: r.id,
          title: r.title,
          targetBody: r.target_body,
          author: researcher.full_name,
          date: (r.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
          summary: r.abstract || r.objective || r.findings || '',
          status: r.status,
          verifiedStatus: 'RESEARCHER_PRIVATE_WORKSPACE',
          tags: [r.category, r.target_body],
        }))
        setRecords(mapped)
      }
    } catch {
      // fallback
    }
  }

  const handleLogout = async () => {
    await authApi.logout()
    setAuthResearcher(null)
    setUserRole('RESEARCHER')
    setCurrentRole('RESEARCHER')
    setRecords(getResearchRecords())
    setFeedbackMsg('Session terminated. Reverted to Guest Mode.')
    setTimeout(() => setFeedbackMsg(''), 3000)
  }

  const handleRoleToggle = (newRole) => {
    setCurrentRole(newRole)
    setUserRole(newRole)
    setFeedbackMsg(`Demo Role changed to: ${newRole}`)
    setTimeout(() => setFeedbackMsg(''), 3000)
  }

  // Filter experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter((e) => {
      const matchSearch =
        !experimentSearch ||
        e.title.toLowerCase().includes(experimentSearch.toLowerCase()) ||
        e.primaryFocus.toLowerCase().includes(experimentSearch.toLowerCase())
      const matchBody =
        experimentBodyFilter === 'ALL' ||
        e.planetaryAnalogue.toLowerCase() === experimentBodyFilter.toLowerCase()
      return matchSearch && matchBody
    })
  }, [experiments, experimentSearch, experimentBodyFilter])

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        !recordSearch ||
        r.title.toLowerCase().includes(recordSearch.toLowerCase()) ||
        (r.author && r.author.toLowerCase().includes(recordSearch.toLowerCase()))
      const matchBody =
        recordBodyFilter === 'ALL' ||
        r.targetBody.toLowerCase() === recordBodyFilter.toLowerCase()
      return matchSearch && matchBody
    })
  }, [records, recordSearch, recordBodyFilter])

  // Filter Research Library
  const filteredLibrary = useMemo(() => {
    return PEER_REVIEWED_RESEARCH_LIBRARY.filter((item) => {
      const matchCat = libraryCategory === 'ALL' || item.category === libraryCategory
      const matchBody = libraryBodyFilter === 'ALL' || item.targetBody === libraryBodyFilter
      const q = librarySearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.studyLocation.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.doi.toLowerCase().includes(q)
      return matchCat && matchBody && matchSearch
    })
  }, [libraryCategory, libraryBodyFilter, librarySearch])

  // Filtered Submissions: Explicit separation of drafts from review queue
  const draftSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === SUBMISSION_STATUSES.DRAFT)
  }, [submissions])

  const queueSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status !== SUBMISSION_STATUSES.DRAFT && s.status !== SUBMISSION_STATUSES.PUBLISHED)
  }, [submissions])

  const publishedSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === SUBMISSION_STATUSES.PUBLISHED)
  }, [submissions])

  const displayedSubmissions = useMemo(() => {
    if (submissionFilter === 'DRAFTS') return draftSubmissions
    if (submissionFilter === 'QUEUE') return queueSubmissions
    if (submissionFilter === 'PUBLISHED') return publishedSubmissions
    return submissions
  }, [submissions, submissionFilter, draftSubmissions, queueSubmissions, publishedSubmissions])

  // Handlers for Submissions
  const handleSaveDraft = (type) => {
    let payload = {}
    if (type === CONTRIBUTION_TYPES.RESEARCH_RECORD) {
      if (!recordForm.title) {
        alert('Please enter a research title.')
        return
      }
      payload = { type, ...recordForm }
    } else if (type === CONTRIBUTION_TYPES.SITE_ASSESSMENT) {
      if (!assessmentForm.title) {
        alert('Please enter an assessment title.')
        return
      }
      payload = { type, ...assessmentForm }
    } else {
      if (!evaluationForm.title) {
        alert('Please enter an evaluation title.')
        return
      }
      payload = { type, ...evaluationForm }
    }

    const saved = saveDraftSubmission(payload)
    setSubmissions(getAllSubmissions())
    setFeedbackMsg(`Saved as DRAFT: "${saved.title}" (Private to Workspace)`)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  const handleSubmitForReview = (type) => {
    let payload = {}
    if (type === CONTRIBUTION_TYPES.RESEARCH_RECORD) {
      if (!recordForm.title) {
        alert('Please enter a research title.')
        return
      }
      payload = { type, ...recordForm }
    } else if (type === CONTRIBUTION_TYPES.SITE_ASSESSMENT) {
      if (!assessmentForm.title) {
        alert('Please enter an assessment title.')
        return
      }
      payload = { type, ...assessmentForm }
    } else {
      if (!evaluationForm.title) {
        alert('Please enter an evaluation title.')
        return
      }
      payload = { type, ...evaluationForm }
    }

    const draft = saveDraftSubmission(payload)
    const submitted = submitForReview(draft.id)
    setSubmissions(getAllSubmissions())
    setFeedbackMsg(`Submitted for peer review: "${submitted.title}"`)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  // Project Creation Handlers
  const handleCreateProject = async () => {
    if (!projectForm.title.trim()) {
      alert('Please enter a research project title.')
      return
    }
    const newProj = {
      id: `proj-${Date.now().toString(36)}`,
      title: projectForm.title.trim(),
      abstract: projectForm.abstract.trim(),
      target_body: projectForm.target_body,
      analogue_location_id: projectForm.analogue_location_id,
      mission_objective_id: projectForm.mission_objective_id,
      methodology: projectForm.methodology.trim(),
      research_objectives: projectForm.research_objectives.trim(),
      collaborators: projectForm.collaborators,
      status: 'DRAFT',
      created_at: new Date().toISOString(),
    }

    if (authResearcher) {
      try {
        const res = await researchApi.createProject(newProj)
        if (res.success && res.data) {
          setProjects((prev) => [res.data, ...prev])
          setActiveProjectId(res.data.id)
          setIsCreatingProject(false)
          setFeedbackMsg(`Project created in persistent backend: "${res.data.title}"`)
          setTimeout(() => setFeedbackMsg(''), 4000)
          return
        }
      } catch {
        // local state fallback
      }
    }

    setProjects((prev) => [newProj, ...prev])
    setActiveProjectId(newProj.id)
    setIsCreatingProject(false)
    setFeedbackMsg(`Project initialized: "${newProj.title}"`)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  const handleAddCollaborator = () => {
    if (!projectForm.collaboratorName.trim()) return
    const col = {
      name: projectForm.collaboratorName.trim(),
      affiliation: projectForm.collaboratorAffiliation.trim() || 'Research Partner',
      role: projectForm.collaboratorRole || 'Co-Investigator',
    }
    setProjectForm((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, col],
      collaboratorName: '',
      collaboratorAffiliation: '',
    }))
  }

  const handleRemoveCollaborator = (index) => {
    setProjectForm((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index),
    }))
  }

  // Structured Field Observations & Measurements Handlers
  const handleAddObservation = () => {
    if (!newObs.note.trim()) return
    const entry = {
      id: `obs-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      coordinates: newObs.coordinates.trim() || '-24.0889, -69.9286',
      note: newObs.note.trim(),
      terrainContext: newObs.terrainContext.trim() || 'General Field Zone',
    }
    setFieldObservations((prev) => [...prev, entry])
    setNewObs({ coordinates: entry.coordinates, note: '', terrainContext: entry.terrainContext })
  }

  const handleRemoveObservation = (id) => {
    setFieldObservations((prev) => prev.filter((o) => o.id !== id))
  }

  const handleAddMeasurement = () => {
    if (!newMeas.value.trim()) return
    const entry = {
      id: `meas-${Date.now().toString(36)}`,
      parameter: newMeas.parameter.trim() || 'Parameter',
      value: newMeas.value.trim(),
      unit: newMeas.unit.trim() || '',
      instrument: newMeas.instrument.trim() || 'Field Sensor',
      uncertainty: newMeas.uncertainty.trim() || '±0.1',
    }
    setEnvironmentalMeasurements((prev) => [...prev, entry])
    setNewMeas({ parameter: '', value: '', unit: '', instrument: '', uncertainty: '' })
  }

  const handleRemoveMeasurement = (id) => {
    setEnvironmentalMeasurements((prev) => prev.filter((m) => m.id !== id))
  }

  const handleAddGeological = () => {
    if (!newGeo.lithology.trim()) return
    const entry = {
      id: `geo-${Date.now().toString(36)}`,
      lithology: newGeo.lithology.trim(),
      grainSize: newGeo.grainSize.trim() || 'Unspecified',
      mineralogy: newGeo.mineralogy.trim() || 'Unspecified',
      stratigraphicLayer: newGeo.stratigraphicLayer.trim() || 'Surface Horizon',
    }
    setGeologicalObservations((prev) => [...prev, entry])
    setNewGeo({ lithology: '', grainSize: '', mineralogy: '', stratigraphicLayer: '' })
  }

  const handleRemoveGeological = (id) => {
    setGeologicalObservations((prev) => prev.filter((g) => g.id !== id))
  }

  const handleAddInstrumentReading = () => {
    if (!newIr.value.trim()) return
    const entry = {
      id: `ir-${Date.now().toString(36)}`,
      instrumentName: newIr.instrumentName.trim() || 'Sensor',
      measurementType: newIr.measurementType.trim() || 'Reading',
      value: newIr.value.trim(),
      unit: newIr.unit.trim() || '',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }
    setInstrumentReadings((prev) => [...prev, entry])
    setNewIr({ instrumentName: '', measurementType: '', value: '', unit: '' })
  }

  const handleRemoveInstrumentReading = (id) => {
    setInstrumentReadings((prev) => prev.filter((r) => r.id !== id))
  }

  const handleAddAttachment = () => {
    if (!newAtt.caption.trim()) return
    const entry = {
      id: `att-${Date.now().toString(36)}`,
      caption: newAtt.caption.trim(),
      url: newAtt.url.trim() || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      sensorType: newAtt.sensorType.trim() || 'Field Optical Camera',
    }
    setAttachments((prev) => [...prev, entry])
    setNewAtt({ caption: '', url: '', sensorType: 'Field Optical Camera' })
  }

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSaveStructuredRecord = async (isSubmitting = false) => {
    const activeProj = projects.find((p) => p.id === activeProjectId) || projects[0]
    const title = recordForm.title.trim() || `${activeProj ? activeProj.title : 'Field Research'}: In-situ Campaign Data`

    const payload = {
      title,
      target_body: activeProj ? activeProj.target_body : 'Mars',
      analogue_location_id: activeProj ? activeProj.analogue_location_id : 'atacama-yungay',
      category: 'FIELD_EXPEDITION',
      status: isSubmitting ? SUBMISSION_STATUSES.SUBMITTED : SUBMISSION_STATUSES.DRAFT,
      abstract: activeProj ? activeProj.abstract : 'Empirical field measurements and observations collected at Earth analogue site.',
      methodology: activeProj ? activeProj.methodology : recordForm.methodology,
      findings: recordForm.findings || 'Initial field observations logged without data fabrication.',
      doi_link: recordForm.doiLink || '10.1089/153110703769016460',
      collaborators: activeProj ? activeProj.collaborators : [],
      experiment_params: experimentParams,
      field_observations: fieldObservations,
      environmental_measurements: environmentalMeasurements,
      geological_observations: geologicalObservations,
      instrument_readings: instrumentReadings,
      attachments: attachments,
    }

    if (authResearcher) {
      try {
        const res = await researchApi.createRecord(payload)
        if (res.success && res.data) {
          if (isSubmitting) {
            await researchApi.submitRecord(res.data.id)
          }
          setFeedbackMsg(isSubmitting ? `Submitted for peer review: "${title}"` : `Saved private draft: "${title}"`)
          setTimeout(() => setFeedbackMsg(''), 4000)
          return
        }
      } catch {
        // fallback to local
      }
    }

    const localDraft = saveDraftSubmission({
      type: CONTRIBUTION_TYPES.RESEARCH_RECORD,
      ...payload,
      researcherName: authResearcher ? authResearcher.full_name : recordForm.researcherName,
      affiliation: authResearcher ? authResearcher.institution : recordForm.affiliation,
      studyLocation: activeProj ? activeProj.analogue_location_id : recordForm.studyLocation,
    })
    if (isSubmitting) {
      submitForReview(localDraft.id)
    }
    setSubmissions(getAllSubmissions())
    setFeedbackMsg(isSubmitting ? `Submitted for peer review: "${title}"` : `Saved as DRAFT in workspace: "${title}"`)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  // Saved Site Assessment Handlers
  const handleRunProjectAssessment = async () => {
    setIsAssessing(true)
    try {
      const activeProj = projects.find((p) => p.id === activeProjectId) || projects[0]
      const targetBody = evalTargetBody
      const terrainId = evalTerrainId
      const locId = evalLocationId
      const expId = evalExperimentId

      const res = await evaluationsApi.getSiteAssessment({
        location_id: locId,
        target_body: targetBody,
        planetary_terrain_id: terrainId,
        experiment_id: expId,
        evaluator_name: authResearcher ? authResearcher.full_name : 'Principal Investigator',
        project_id: activeProj ? activeProj.id : null,
        save_to_project: true,
      })

      if (res.success && res.data) {
        const newEval = {
          evaluation_id: res.data.evaluation_id || `eval-${Date.now().toString(36)}`,
          project_id: activeProj ? activeProj.id : 'proj-demo-001',
          evaluation_version: res.data.evaluation_version || '2.0.0-spatial',
          created_at: res.data.created_at || new Date().toISOString(),
          location_id: locId,
          location_name: res.data.location?.name || locId,
          target_body: targetBody,
          planetary_terrain_id: terrainId,
          planetary_terrain_name: res.data.planetaryTerrain?.name || terrainId,
          experiment_id: expId,
          geological_similarity: res.data.geological_similarity?.score || 82.0,
          operational_suitability: res.data.operational_suitability?.score || 85.0,
          composite_score: res.data.composite_score || 83.5,
          recommendation: res.data.recommendation || 'HIGH_SUITABILITY',
          fullData: res.data,
        }
        setSavedEvaluations((prev) => [newEval, ...prev])
        setFeedbackMsg(`Analogue Site Assessment executed and saved to project!`)
        setTimeout(() => setFeedbackMsg(''), 4000)
      } else {
        alert(res.error || 'Failed to execute site assessment')
      }
    } catch (err) {
      alert(`Error running assessment: ${err.message}`)
    } finally {
      setIsAssessing(false)
    }
  }

  const handleToggleCompareEval = (evalId) => {
    setSelectedForCompareIds((prev) => {
      if (prev.includes(evalId)) {
        return prev.filter((id) => id !== evalId)
      } else {
        if (prev.length >= 4) return prev
        return [...prev, evalId]
      }
    })
  }

  const handleRunComparison = async () => {
    if (selectedForCompareIds.length < 2) {
      alert('Please select at least 2 saved evaluations to compare side-by-side.')
      return
    }
    try {
      const res = await evaluationsApi.compareEvaluations(selectedForCompareIds)
      if (res.success && res.data) {
        setCompareModalData(res.data)
      } else {
        const selectedItems = savedEvaluations.filter((e) => selectedForCompareIds.includes(e.evaluation_id))
        setCompareModalData({
          evaluations: selectedItems,
          compared_count: selectedItems.length,
          evaluation_version: '2.0.0-spatial',
        })
      }
    } catch {
      const selectedItems = savedEvaluations.filter((e) => selectedForCompareIds.includes(e.evaluation_id))
      setCompareModalData({
        evaluations: selectedItems,
        compared_count: selectedItems.length,
        evaluation_version: '2.0.0-spatial',
      })
    }
  }

  const handleOpenAuditTrail = async (item) => {
    setAuditTrailModalItem(item)
    setIsLoadingAudit(true)
    try {
      const res = await researchApi.getRecordAuditTrail(item.id)
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAuditTrailLogs(res.data)
      } else {
        setAuditTrailLogs(item.statusHistory || [])
      }
    } catch {
      setAuditTrailLogs(item.statusHistory || [])
    } finally {
      setIsLoadingAudit(false)
    }
  }

  const handleReviewAction = (status) => {
    if (!reviewModalItem) return
    updateSubmissionReview(reviewModalItem.id, {
      status,
      reviewerComments: reviewCommentInput,
      reviewerName: reviewerNameInput,
      reviewerRole: 'Peer Reviewer',
    })
    setSubmissions(getAllSubmissions())
    setReviewModalItem(null)
    setReviewCommentInput('')
    setFeedbackMsg(`Review status updated to: ${status}`)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  const handlePublish = (id) => {
    try {
      const pub = publishSubmission(id)
      setSubmissions(getAllSubmissions())
      setFeedbackMsg(`Published to Public Discovery: "${pub.title}"`)
      setTimeout(() => setFeedbackMsg(''), 4000)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteSub = (id) => {
    deleteSubmission(id)
    setSubmissions(getAllSubmissions())
  }

  const getStatusColor = (st) => {
    switch (st) {
      case SUBMISSION_STATUSES.DRAFT:
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)' }
      case SUBMISSION_STATUSES.SUBMITTED:
        return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.25)' }
      case SUBMISSION_STATUSES.UNDER_REVIEW:
        return { color: '#00d2ff', bg: 'rgba(0, 210, 255, 0.1)', border: 'rgba(0, 210, 255, 0.25)' }
      case SUBMISSION_STATUSES.REVISION_REQUESTED:
        return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)' }
      case SUBMISSION_STATUSES.APPROVED:
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' }
      case SUBMISSION_STATUSES.PUBLISHED:
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' }
      default:
        return { color: '#ffffff', bg: 'transparent', border: 'rgba(255,255,255,0.1)' }
    }
  }

  return (
    <div className="research-hub-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageIntroHeader pageKey="research-hub" />

      {/* AEROKRYPT Authenticated Researcher Session Banner */}
      <div
        className="font-mono"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: authResearcher ? 'rgba(6, 78, 59, 0.25)' : 'rgba(15, 23, 42, 0.6)',
          border: authResearcher ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: authResearcher ? '#10b981' : isBackendConnected ? '#00d2ff' : '#94a3b8',
              boxShadow: authResearcher ? '0 0 8px #10b981' : 'none',
            }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: authResearcher ? '#34d399' : '#e2e8f0', letterSpacing: '0.05em' }}>
              {authResearcher
                ? `RESEARCHER SESSION ACTIVE: ${authResearcher.full_name.toUpperCase()}`
                : 'RESEARCHER WORKSPACE // GUEST MODE'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {authResearcher
                ? `${authResearcher.institution} • ${authResearcher.email} • ROLE: ${authResearcher.role}`
                : isBackendConnected
                ? 'FastAPI Backend Live • PostGIS / SQLite Connected • Private Workspace Available'
                : 'FastAPI Backend Standalone • Local Browser Workspace Active'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {authResearcher ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '6px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px',
                letterSpacing: '0.05em',
              }}
            >
              LOG OUT
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                padding: '6px 14px',
                background: 'rgba(0, 210, 255, 0.15)',
                border: '1px solid rgba(0, 210, 255, 0.4)',
                color: '#00d2ff',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px',
                letterSpacing: '0.05em',
              }}
            >
              RESEARCHER SIGN IN / REGISTER
            </button>
          )}
        </div>
      </div>

      <ResearcherAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 1. Subsystem Navigation Tabs */}
      <div
        className="hub-tabs-bar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`tab-button ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            📚 Research Library ({PEER_REVIEWED_RESEARCH_LIBRARY.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'experiments' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiments')}
          >
            🔬 Experiment Database ({experiments.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            📑 Evaluation Records ({records.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            🛠️ Researcher Workspace ({submissions.length})
          </button>
        </div>

        {/* Client Prototype Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            DEMO CLIENT ROLE:
          </span>
          <div
            className="font-mono"
            style={{
              display: 'flex',
              background: 'var(--bg-void)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleToggle('VIEWER')}
              style={{
                background: userRole === 'VIEWER' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: userRole === 'VIEWER' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '3px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              VIEWER
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('RESEARCHER')}
              style={{
                background: userRole === 'RESEARCHER' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                color: userRole === 'RESEARCHER' ? '#00d2ff' : 'var(--text-muted)',
                border: 'none',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              RESEARCHER
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div
          className="font-mono"
          style={{
            padding: '10px 16px',
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            borderRadius: '2px',
            color: '#00d2ff',
            fontSize: '12px',
          }}
        >
          {feedbackMsg}
        </div>
      )}

      {/* ====================================================================
          TAB 1: RESEARCH LIBRARY (Section 2)
          ==================================================================== */}
      {activeTab === 'library' && (
        <section className="research-library-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> PEER-REVIEWED LITERATURE REPOSITORY
              </div>
              <h2 className="section-heading">
                Authoritative Planetary Research Library
              </h2>
              <p className="section-subheading">
                Peer-reviewed scientific publications covering Mars/Moon field analogues, geomorphology, rover mobility, lava tubes, regolith, and astrobiology.
              </p>
            </div>
          </div>

          {/* Category & Body Filter Bar */}
          <div
            className="aerospace-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Filter by Category:
                </label>
                <select
                  value={libraryCategory}
                  onChange={(e) => setLibraryCategory(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  {RESEARCH_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Target Body:
                </label>
                <select
                  value={libraryBodyFilter}
                  onChange={(e) => setLibraryBodyFilter(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="ALL">All Planetary Bodies</option>
                  <option value="Mars">Mars</option>
                  <option value="Moon">Moon</option>
                  <option value="Comparative">Comparative (Moon + Mars)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Search Papers &amp; DOIs:
              </label>
              <input
                type="text"
                placeholder="Search author, DOI, keyword..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px', width: '260px' }}
              />
            </div>
          </div>

          {/* Library Publication Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLibrary.map((paper) => (
              <article
                key={paper.id}
                className="aerospace-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '2px',
                        backgroundColor: paper.targetBody === 'Mars' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                        color: paper.targetBody === 'Mars' ? '#f97316' : '#00d2ff',
                        fontWeight: 700,
                      }}
                    >
                      {paper.targetBody.toUpperCase()} TARGET
                    </span>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {paper.year} &bull; {paper.journal}
                    </span>
                  </div>

                  <a
                    href={paper.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>DOI: {paper.doi}</span>
                    <span>&rarr;</span>
                  </a>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                  {paper.title}
                </h3>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <strong>Authors:</strong> {paper.authors}
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <strong>Field Study Location:</strong> <span style={{ color: '#00d2ff' }}>{paper.studyLocation}</span>
                </div>

                <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '2px', borderLeft: '2px solid var(--accent-cyan)' }}>
                  <strong>Abstract:</strong> {paper.abstract}
                </p>

                {/* Structured Research Matrix (Methods, Findings, Limitations) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '4px', fontSize: '12px' }}>
                  <div style={{ background: 'var(--bg-void)', padding: '10px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      RESEARCH OBJECTIVE:
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{paper.objective}</div>
                  </div>

                  <div style={{ background: 'var(--bg-void)', padding: '10px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      METHODS APPLIED:
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{paper.methods}</div>
                  </div>

                  <div style={{ background: 'var(--bg-void)', padding: '10px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', color: '#10b981', textTransform: 'uppercase', marginBottom: '2px' }}>
                      KEY SCIENTIFIC FINDINGS:
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{paper.keyFindings}</div>
                  </div>

                  <div style={{ background: 'var(--bg-void)', padding: '10px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px' }}>
                      DATA LIMITATIONS &amp; DIVERGENCE:
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{paper.limitations}</div>
                  </div>
                </div>
              </article>
            ))}

            {filteredLibrary.length === 0 && (
              <div className="aerospace-card" style={{ padding: '36px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No publications match the selected category and search query.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          TAB 2: EXPERIMENT DATABASE (Existing preserved functionality)
          ==================================================================== */}
      {activeTab === 'experiments' && (
        <section className="experiment-database-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> CONOPS TESTING PROTOCOLS
              </div>
              <h2 className="section-heading">
                Mission Objectives &amp; Experiments
              </h2>
              <p className="section-subheading">
                Operational requirements for planetary surface rover mobility, subsurface coring, and spectroscopy.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={experimentBodyFilter}
                onChange={(e) => setExperimentBodyFilter(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '11px' }}
              >
                <option value="ALL">All Targets</option>
                <option value="Mars">Mars</option>
                <option value="Moon">Moon</option>
              </select>
              <input
                type="text"
                placeholder="Search protocols..."
                value={experimentSearch}
                onChange={(e) => setExperimentSearch(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '11px', width: '180px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredExperiments.map((exp) => (
              <div key={exp.id} className="aerospace-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-source font-mono">{exp.planetaryAnalogue} Protocol</span>
                    {exp.maxSlopeThreshold && (
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>
                        Max Slope: {exp.maxSlopeThreshold}°
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>{exp.title}</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{exp.description}</p>

                  <div style={{ marginTop: '12px', fontSize: '11.5px', background: 'var(--bg-void)', padding: '8px', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                    <div><strong>Required Terrain:</strong> {exp.requiredTerrain}</div>
                    <div style={{ marginTop: '4px' }}><strong>Target Lithology:</strong> {exp.targetLithology || 'Any matching regolith'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-faint)', paddingTop: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    {exp.doiReference ? `DOI: ${exp.doiReference}` : 'Standard ConOps'}
                  </span>
                  <button
                    type="button"
                    className="btn-aerospace btn-aerospace-cyan"
                    onClick={() => onNavigate && onNavigate('site-evaluation', { experimentId: exp.id })}
                    style={{ padding: '4px 10px', fontSize: '10.5px' }}
                  >
                    Test In Site Eval &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          TAB 3: RESEARCH RECORDS (Existing preserved functionality)
          ==================================================================== */}
      {activeTab === 'records' && (
        <section className="research-records-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> EVALUATION ARCHIVE
              </div>
              <h2 className="section-heading">
                Peer-Reviewed &amp; Saved Site Assessments
              </h2>
              <p className="section-subheading">
                Indexed field evaluations and literature benchmarks stored with transparent methodology.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={recordBodyFilter}
                onChange={(e) => setRecordBodyFilter(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '11px' }}
              >
                <option value="ALL">All Targets</option>
                <option value="Mars">Mars</option>
                <option value="Moon">Moon</option>
              </select>
              <input
                type="text"
                placeholder="Search records..."
                value={recordSearch}
                onChange={(e) => setRecordSearch(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '11px', width: '180px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="aerospace-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="badge-source font-mono" style={{ marginRight: '8px' }}>{rec.targetBody} Target</span>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rec.date} &bull; {rec.author}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{rec.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-aerospace"
                      onClick={() => exportReportAsFile(rec, 'json')}
                      style={{ padding: '4px 8px', fontSize: '10.5px' }}
                    >
                      Export JSON
                    </button>
                    <button
                      type="button"
                      className="btn-aerospace"
                      onClick={() => exportReportAsFile(rec, 'md')}
                      style={{ padding: '4px 8px', fontSize: '10.5px' }}
                    >
                      Export MD
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.summary}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderTop: '1px solid var(--border-faint)', paddingTop: '8px' }}>
                  <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>DOI: {rec.doiReference || 'Field Survey Report'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = deleteResearchRecord(rec.id)
                      setRecords(updated)
                    }}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '11px', fontFamily: 'monospace' }}
                    title="Delete record from evaluation archive"
                  >
                    [Delete Record]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          TAB 4: RESEARCHER WORKSPACE & CONTRIBUTION WORKFLOW (Section 4 & 5)
          ==================================================================== */}
      {activeTab === 'workspace' && (
        <section className="researcher-workspace-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Architectural Prototype Warning */}
          <div
            className="aerospace-card font-mono"
            style={{
              padding: '16px 20px',
              borderLeft: '3px solid #eab308',
              backgroundColor: 'rgba(234, 179, 8, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', fontWeight: 700, fontSize: '12px' }}>
              <span>⚠️ PROTOTYPE LOCAL WORKSPACE STORAGE &amp; REVIEW WORKFLOW</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              {PROTOTYPE_WORKFLOW_DISCLAIMER}
            </p>
          </div>

          {/* Workspace Sub-Navigation Switcher */}
          <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> RESEARCHER WORKSPACE &amp; PUBLICATION ENGINE
              </div>
              <h2 className="section-heading">
                Planetary Research Workflow &amp; Publishing
              </h2>
            </div>

            <div className="font-mono" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'projects' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('projects')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                📁 1. Projects ({projects.length})
              </button>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'data-entry' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('data-entry')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                📝 2. Data Entry &amp; Drafts
              </button>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'saved-evaluations' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('saved-evaluations')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                🪐 3. Saved Assessments ({savedEvaluations.length})
              </button>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'pipeline' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('pipeline')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                🚀 4. Review Queue ({submissions.length})
              </button>
            </div>
          </div>

          {/* ====================================================================
              SUBTAB 1: RESEARCH PROJECT CREATION & MANAGEMENT
              ==================================================================== */}
          {workspaceFormTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                    Active Planetary Research Projects
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Select an active project or initialize a new planetary research project.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-aerospace btn-aerospace-solid"
                  onClick={() => setIsCreatingProject(!isCreatingProject)}
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  {isCreatingProject ? '✕ Close Project Form' : '+ New Research Project'}
                </button>
              </div>

              {/* Project Creation Form */}
              {isCreatingProject && (
                <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--accent-cyan)' }}>
                  <div className="aerospace-label">
                    <span className="aerospace-label-accent">//</span> NEW RESEARCH PROJECT
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Research Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Atacama Halite Perchlorate Astrobiological Transect"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Planetary Body</label>
                      <select
                        value={projectForm.target_body}
                        onChange={(e) => setProjectForm({ ...projectForm, target_body: e.target.value })}
                      >
                        <option value="Mars">Mars</option>
                        <option value="Moon">Moon</option>
                        <option value="Comparative">Comparative (Moon + Mars)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Analogue Location</label>
                      <select
                        value={projectForm.analogue_location_id}
                        onChange={(e) => setProjectForm({ ...projectForm, analogue_location_id: e.target.value })}
                      >
                        {ANALOGUE_LOCATIONS.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} ({loc.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mission Experiment Objective</label>
                      <select
                        value={projectForm.mission_objective_id}
                        onChange={(e) => setProjectForm({ ...projectForm, mission_objective_id: e.target.value })}
                      >
                        {experiments.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Research Abstract</label>
                    <textarea
                      rows="2"
                      placeholder="Summary of scientific scope and hypothesis..."
                      value={projectForm.abstract}
                      onChange={(e) => setProjectForm({ ...projectForm, abstract: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Methodology</label>
                      <textarea
                        rows="2"
                        placeholder="Sampling protocols, traverse routes, equipment..."
                        value={projectForm.methodology}
                        onChange={(e) => setProjectForm({ ...projectForm, methodology: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Research Objectives</label>
                      <textarea
                        rows="2"
                        placeholder="Key milestones and hypotheses to validate..."
                        value={projectForm.research_objectives}
                        onChange={(e) => setProjectForm({ ...projectForm, research_objectives: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Team Members & Collaborators */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                      Team Members &amp; Collaborators ({projectForm.collaborators.length})
                    </label>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Collaborator Name"
                        value={projectForm.collaboratorName}
                        onChange={(e) => setProjectForm({ ...projectForm, collaboratorName: e.target.value })}
                        style={{ flex: 1, minWidth: '150px' }}
                      />
                      <input
                        type="text"
                        placeholder="Institution / Affiliation"
                        value={projectForm.collaboratorAffiliation}
                        onChange={(e) => setProjectForm({ ...projectForm, collaboratorAffiliation: e.target.value })}
                        style={{ flex: 1, minWidth: '150px' }}
                      />
                      <select
                        value={projectForm.collaboratorRole}
                        onChange={(e) => setProjectForm({ ...projectForm, collaboratorRole: e.target.value })}
                        style={{ width: '160px' }}
                      >
                        <option value="Principal Investigator">Principal Investigator</option>
                        <option value="Co-Investigator">Co-Investigator</option>
                        <option value="Field Geologist">Field Geologist</option>
                        <option value="Payload Engineer">Payload Engineer</option>
                      </select>
                      <button
                        type="button"
                        className="btn-aerospace"
                        onClick={handleAddCollaborator}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        + Add Member
                      </button>
                    </div>

                    {projectForm.collaborators.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {projectForm.collaborators.map((col, idx) => (
                          <div
                            key={idx}
                            className="font-mono"
                            style={{
                              background: 'var(--bg-void)',
                              border: '1px solid var(--border-subtle)',
                              padding: '4px 10px',
                              borderRadius: '2px',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>{col.name} ({col.role}) &bull; {col.affiliation}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCollaborator(idx)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: 0 }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn-aerospace"
                      onClick={() => setIsCreatingProject(false)}
                      style={{ padding: '6px 14px', fontSize: '11px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-aerospace btn-aerospace-solid"
                      onClick={handleCreateProject}
                      style={{ padding: '6px 16px', fontSize: '11px' }}
                    >
                      Initialize Project &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
                {projects.map((proj) => {
                  const isSelected = activeProjectId === proj.id
                  const loc = ANALOGUE_LOCATIONS.find((l) => l.id === proj.analogue_location_id) || { name: proj.analogue_location_id, country: '' }

                  return (
                    <article
                      key={proj.id}
                      className="aerospace-card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                        backgroundColor: isSelected ? 'rgba(0, 210, 255, 0.04)' : 'rgba(5, 6, 8, 0.9)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span className="badge-source font-mono">{proj.target_body} Project</span>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '2px',
                              backgroundColor: proj.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 210, 255, 0.15)',
                              color: proj.status === 'APPROVED' ? '#34d399' : '#00d2ff',
                              border: `1px solid ${proj.status === 'APPROVED' ? '#10b981' : 'rgba(0, 210, 255, 0.3)'}`,
                            }}
                          >
                            {proj.status}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                          {proj.title}
                        </h3>

                        <div className="font-mono" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Location: {loc.name} {loc.country ? `(${loc.country})` : ''} &bull; Objective: {proj.mission_objective_id}
                        </div>

                        {proj.abstract && (
                          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                            {proj.abstract}
                          </p>
                        )}

                        {proj.collaborators && proj.collaborators.length > 0 && (
                          <div style={{ borderTop: '1px solid var(--border-faint)', paddingTop: '8px' }}>
                            <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              TEAM COLLABORATORS ({proj.collaborators.length}):
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {proj.collaborators.map((c, idx) => (
                                <span
                                  key={idx}
                                  className="font-mono"
                                  style={{
                                    fontSize: '10.5px',
                                    color: '#cbd5e1',
                                    background: 'var(--bg-void)',
                                    padding: '2px 6px',
                                    borderRadius: '2px',
                                  }}
                                >
                                  {c.name} ({c.role})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                        <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          ID: {proj.id}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-aerospace"
                            onClick={() => {
                              setActiveProjectId(proj.id)
                              setWorkspaceFormTab('data-entry')
                            }}
                            style={{ padding: '4px 10px', fontSize: '10.5px' }}
                          >
                            Enter Field Data &rarr;
                          </button>
                          <button
                            type="button"
                            className="btn-aerospace btn-aerospace-cyan"
                            onClick={() => {
                              setActiveProjectId(proj.id)
                              setWorkspaceFormTab('saved-evaluations')
                            }}
                            style={{ padding: '4px 10px', fontSize: '10.5px' }}
                          >
                            Assess Site &rarr;
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              SUBTAB 2: STRUCTURED FIELD DATA ENTRY & DRAFTS
              ==================================================================== */}
          {workspaceFormTab === 'data-entry' && (
            <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div className="aerospace-label">
                    <span className="aerospace-label-accent">//</span> STRUCTURED SCIENTIFIC DATA LOGGING
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                    Field Data Entry &amp; Draft Recording
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Record structured in-situ observations and calibrated instrument measurements. Never fabricate readings.
                  </p>
                </div>

                {/* Project selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE PROJECT:</label>
                  <select
                    value={activeProjectId}
                    onChange={(e) => setActiveProjectId(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Basic Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Campaign Record Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. In-situ Soil Moisture & Salinity Profile"
                    value={recordForm.title}
                    onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lead Researcher &amp; Affiliation</label>
                  <input
                    type="text"
                    value={authResearcher ? `${authResearcher.full_name} (${authResearcher.institution})` : recordForm.researcherName}
                    onChange={(e) => setRecordForm({ ...recordForm, researcherName: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION A: Field Observations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong className="font-mono" style={{ color: 'var(--accent-cyan)', fontSize: '12px' }}>
                    A. FIELD OBSERVATIONS ({fieldObservations.length})
                  </strong>
                  <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    Georeferenced visual &amp; morphological notes
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Coordinates (lat, lon)"
                    value={newObs.coordinates}
                    onChange={(e) => setNewObs({ ...newObs, coordinates: e.target.value })}
                    style={{ width: '170px' }}
                  />
                  <input
                    type="text"
                    placeholder="Terrain Context (e.g. Basin Playa Floor)"
                    value={newObs.terrainContext}
                    onChange={(e) => setNewObs({ ...newObs, terrainContext: e.target.value })}
                    style={{ width: '200px' }}
                  />
                  <input
                    type="text"
                    placeholder="Observation Note..."
                    value={newObs.note}
                    onChange={(e) => setNewObs({ ...newObs, note: e.target.value })}
                    style={{ flex: 1, minWidth: '220px' }}
                  />
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={handleAddObservation}
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    + Log Note
                  </button>
                </div>

                {fieldObservations.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {fieldObservations.map((obs) => (
                      <div
                        key={obs.id}
                        className="font-mono"
                        style={{
                          background: 'var(--bg-void)',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px 12px',
                          borderRadius: '2px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11.5px',
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--accent-cyan)' }}>[{obs.timestamp}]</span>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>({obs.coordinates})</span> &bull;{' '}
                          <strong style={{ color: '#ffffff' }}>{obs.terrainContext}:</strong>{' '}
                          <span style={{ color: '#cbd5e1' }}>{obs.note}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveObservation(obs.id)}
                          style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: Environmental Measurements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong className="font-mono" style={{ color: '#34d399', fontSize: '12px' }}>
                    B. ENVIRONMENTAL MEASUREMENTS ({environmentalMeasurements.length})
                  </strong>
                  <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    Atmospheric &amp; soil sensors with explicit uncertainty
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Parameter (e.g. Ambient Temp)"
                    value={newMeas.parameter}
                    onChange={(e) => setNewMeas({ ...newMeas, parameter: e.target.value })}
                    style={{ width: '180px' }}
                  />
                  <input
                    type="text"
                    placeholder="Measured Value"
                    value={newMeas.value}
                    onChange={(e) => setNewMeas({ ...newMeas, value: e.target.value })}
                    style={{ width: '130px' }}
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. °C, hPa, %)"
                    value={newMeas.unit}
                    onChange={(e) => setNewMeas({ ...newMeas, unit: e.target.value })}
                    style={{ width: '120px' }}
                  />
                  <input
                    type="text"
                    placeholder="Instrument / Sensor"
                    value={newMeas.instrument}
                    onChange={(e) => setNewMeas({ ...newMeas, instrument: e.target.value })}
                    style={{ flex: 1, minWidth: '150px' }}
                  />
                  <input
                    type="text"
                    placeholder="Uncertainty (e.g. ±0.2°C)"
                    value={newMeas.uncertainty}
                    onChange={(e) => setNewMeas({ ...newMeas, uncertainty: e.target.value })}
                    style={{ width: '130px' }}
                  />
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={handleAddMeasurement}
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    + Add Measurement
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="evidence-registry-table" style={{ width: '100%', fontSize: '11.5px' }}>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Value &amp; Unit</th>
                        <th>Instrument Used</th>
                        <th>Uncertainty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {environmentalMeasurements.map((m) => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 600, color: '#ffffff' }}>{m.parameter}</td>
                          <td className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{m.value} {m.unit}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{m.instrument}</td>
                          <td className="font-mono" style={{ color: 'var(--accent-amber)' }}>{m.uncertainty}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveMeasurement(m.id)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '11px' }}
                            >
                              [Remove]
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION C: Geological Observations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <strong className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '12px' }}>
                  C. GEOLOGICAL &amp; LITHOLOGICAL OBSERVATIONS ({geologicalObservations.length})
                </strong>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Lithology / Rock Type"
                    value={newGeo.lithology}
                    onChange={(e) => setNewGeo({ ...newGeo, lithology: e.target.value })}
                    style={{ flex: 1, minWidth: '150px' }}
                  />
                  <input
                    type="text"
                    placeholder="Grain Size (e.g. <0.5 mm)"
                    value={newGeo.grainSize}
                    onChange={(e) => setNewGeo({ ...newGeo, grainSize: e.target.value })}
                    style={{ width: '160px' }}
                  />
                  <input
                    type="text"
                    placeholder="Mineralogy (e.g. Halite, Anhydrite)"
                    value={newGeo.mineralogy}
                    onChange={(e) => setNewGeo({ ...newGeo, mineralogy: e.target.value })}
                    style={{ flex: 1, minWidth: '170px' }}
                  />
                  <input
                    type="text"
                    placeholder="Stratigraphic Layer"
                    value={newGeo.stratigraphicLayer}
                    onChange={(e) => setNewGeo({ ...newGeo, stratigraphicLayer: e.target.value })}
                    style={{ width: '180px' }}
                  />
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={handleAddGeological}
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    + Add Lithology
                  </button>
                </div>

                {geologicalObservations.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {geologicalObservations.map((g) => (
                      <div
                        key={g.id}
                        className="font-mono"
                        style={{
                          background: 'var(--bg-void)',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px 12px',
                          borderRadius: '2px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11.5px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#ffffff' }}>{g.lithology}</strong> &bull;{' '}
                          <span style={{ color: 'var(--text-muted)' }}>Layer: {g.stratigraphicLayer}</span> &bull;{' '}
                          <span style={{ color: 'var(--accent-cyan)' }}>Grain: {g.grainSize}</span> &bull;{' '}
                          <span style={{ color: '#cbd5e1' }}>Minerals: {g.mineralogy}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGeological(g.id)}
                          style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION D: Experiment Parameters & Instrument Readings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong className="font-mono" style={{ color: '#38bdf8', fontSize: '12px' }}>
                    D. EXPERIMENT OPERATING PARAMETERS
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sampling Rate (Hz)</label>
                      <input
                        type="text"
                        value={experimentParams.samplingRateHz}
                        onChange={(e) => setExperimentParams({ ...experimentParams, samplingRateHz: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Drill Depth (cm)</label>
                      <input
                        type="text"
                        value={experimentParams.drillDepthCm}
                        onChange={(e) => setExperimentParams({ ...experimentParams, drillDepthCm: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Traverse Speed (m/s)</label>
                      <input
                        type="text"
                        value={experimentParams.traverseSpeedMs}
                        onChange={(e) => setExperimentParams({ ...experimentParams, traverseSpeedMs: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Illumination (nm)</label>
                      <input
                        type="text"
                        value={experimentParams.illuminationWavelengthNm}
                        onChange={(e) => setExperimentParams({ ...experimentParams, illuminationWavelengthNm: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Instrument Readings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong className="font-mono" style={{ color: '#a855f7', fontSize: '12px' }}>
                    E. INSTRUMENT READINGS ({instrumentReadings.length})
                  </strong>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Instrument"
                      value={newIr.instrumentName}
                      onChange={(e) => setNewIr({ ...newIr, instrumentName: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Measurement"
                      value={newIr.measurementType}
                      onChange={(e) => setNewIr({ ...newIr, measurementType: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newIr.value}
                      onChange={(e) => setNewIr({ ...newIr, value: e.target.value })}
                      style={{ width: '80px' }}
                    />
                    <button
                      type="button"
                      className="btn-aerospace"
                      onClick={handleAddInstrumentReading}
                      style={{ padding: '4px 8px', fontSize: '10.5px' }}
                    >
                      + Add
                    </button>
                  </div>

                  {instrumentReadings.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {instrumentReadings.map((ir) => (
                        <div
                          key={ir.id}
                          className="font-mono"
                          style={{
                            background: 'var(--bg-void)',
                            border: '1px solid var(--border-subtle)',
                            padding: '4px 8px',
                            borderRadius: '2px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                          }}
                        >
                          <span><strong>{ir.instrumentName}:</strong> {ir.measurementType} = {ir.value} {ir.unit}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInstrumentReading(ir.id)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION F: Photographs & References */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong className="font-mono" style={{ color: '#00d2ff', fontSize: '12px' }}>
                    F. PHOTOGRAPHS &amp; SENSOR IMAGERY ({attachments.length})
                  </strong>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Caption"
                      value={newAtt.caption}
                      onChange={(e) => setNewAtt({ ...newAtt, caption: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Image URL / Path"
                      value={newAtt.url}
                      onChange={(e) => setNewAtt({ ...newAtt, url: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-aerospace"
                      onClick={handleAddAttachment}
                      style={{ padding: '4px 8px', fontSize: '10.5px' }}
                    >
                      + Add
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          style={{
                            background: 'var(--bg-void)',
                            border: '1px solid var(--border-subtle)',
                            padding: '6px',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '11px',
                          }}
                        >
                          <img src={att.url} alt={att.caption} style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '2px' }} />
                          <span style={{ color: '#e2e8f0' }}>{att.caption}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong className="font-mono" style={{ color: '#cbd5e1', fontSize: '12px' }}>
                    G. DOCUMENTED DOI REFERENCE &amp; REPOSITORY CITATION
                  </strong>
                  <input
                    type="text"
                    placeholder="DOI (e.g. 10.1089/153110703769016460)"
                    value={recordForm.doiLink}
                    onChange={(e) => setRecordForm({ ...recordForm, doiLink: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="PDS / Orbital Dataset References"
                    value={recordForm.datasetReferences}
                    onChange={(e) => setRecordForm({ ...recordForm, datasetReferences: e.target.value })}
                  />
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="btn-aerospace"
                  onClick={() => handleSaveStructuredRecord(false)}
                >
                  SAVE DRAFT (PRIVATE TO WORKSPACE)
                </button>
                <button
                  type="button"
                  className="btn-aerospace btn-aerospace-solid"
                  onClick={() => handleSaveStructuredRecord(true)}
                >
                  SUBMIT FOR PEER REVIEW &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ====================================================================
              SUBTAB 3: SAVED SITE ASSESSMENTS & MULTI-EVALUATION COMPARISON
              ==================================================================== */}
          {workspaceFormTab === 'saved-evaluations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header & Controls */}
              <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="aerospace-label">
                      <span className="aerospace-label-accent">//</span> EVALUATION ENGINE INTEGRATION
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      Run &amp; Save Analogue Site Assessments
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                      Execute dual-vector evaluations directly linked to a research project. Compare multiple saved evaluations side-by-side.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PROJECT TARGET:</label>
                    <select
                      value={activeProjectId}
                      onChange={(e) => setActiveProjectId(e.target.value)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Evaluation Execution Parameters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Earth Analogue Location</label>
                    <select
                      value={evalLocationId}
                      onChange={(e) => setEvalLocationId(e.target.value)}
                    >
                      {ANALOGUE_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name} ({loc.country})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Planetary Body</label>
                    <select
                      value={evalTargetBody}
                      onChange={(e) => {
                        const newBody = e.target.value
                        setEvalTargetBody(newBody)
                        setEvalTerrainId(newBody === 'Moon' ? 'moon-marius-hills-skylight' : 'mars-jezero-delta')
                      }}
                    >
                      <option value="Mars">Mars</option>
                      <option value="Moon">Moon</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Planetary Benchmark Terrain</label>
                    <select
                      value={evalTerrainId}
                      onChange={(e) => setEvalTerrainId(e.target.value)}
                    >
                      {PLANETARY_TERRAIN_DATASETS.filter((t) => t.targetBody.toLowerCase() === evalTargetBody.toLowerCase()).map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mission ConOps Protocol</label>
                    <select
                      value={evalExperimentId}
                      onChange={(e) => setEvalExperimentId(e.target.value)}
                    >
                      {experiments.map((exp) => (
                        <option key={exp.id} value={exp.id}>{exp.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="btn-aerospace btn-aerospace-cyan"
                    onClick={handleRunProjectAssessment}
                    disabled={isAssessing}
                    style={{ padding: '8px 18px', fontSize: '11.5px' }}
                  >
                    {isAssessing ? 'Computing Spatial Geodesy...' : '⚡ Run Assessment & Save to Project'}
                  </button>
                </div>
              </div>

              {/* Saved Evaluations Table */}
              <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      Saved Assessments for Selected Project ({savedEvaluations.length})
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      Select 2 or more evaluations to perform side-by-side comparative analysis.
                    </p>
                  </div>

                  {selectedForCompareIds.length >= 2 && (
                    <button
                      type="button"
                      className="btn-aerospace btn-aerospace-solid"
                      onClick={handleRunComparison}
                      style={{ padding: '6px 14px', fontSize: '11px' }}
                    >
                      Compare Selected ({selectedForCompareIds.length}) &rarr;
                    </button>
                  )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="evidence-registry-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '36px' }}>Select</th>
                        <th>Evaluation ID</th>
                        <th>Location &bull; Target Body</th>
                        <th>Planetary Terrain</th>
                        <th>Geo Similarity</th>
                        <th>Op Suitability</th>
                        <th>Composite</th>
                        <th>Engine Version</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedEvaluations.map((ev) => {
                        const isChecked = selectedForCompareIds.includes(ev.evaluation_id)
                        return (
                          <tr key={ev.evaluation_id} style={{ background: isChecked ? 'rgba(0, 210, 255, 0.06)' : 'transparent' }}>
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleCompareEval(ev.evaluation_id)}
                              />
                            </td>
                            <td className="font-mono" style={{ color: 'var(--accent-cyan)', fontSize: '11px' }}>
                              {ev.evaluation_id}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#ffffff' }}>{ev.location_name || ev.location_id}</div>
                              <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                                Target: {ev.target_body}
                              </div>
                            </td>
                            <td style={{ color: '#cbd5e1' }}>
                              {ev.planetary_terrain_name || ev.planetary_terrain_id}
                            </td>
                            <td className="font-mono" style={{ color: '#38bdf8' }}>
                              {ev.geological_similarity}%
                            </td>
                            <td className="font-mono" style={{ color: '#34d399' }}>
                              {ev.operational_suitability}%
                            </td>
                            <td className="font-mono" style={{ fontWeight: 700, color: '#ffffff' }}>
                              {ev.composite_score}%
                            </td>
                            <td className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              {ev.evaluation_version}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-aerospace"
                                onClick={() => setActiveEvalDetailModal(ev)}
                                style={{ padding: '3px 8px', fontSize: '10px' }}
                              >
                                Reopen Dossier ↗
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              SUBTAB 4: PUBLICATION LIFECYCLE, REVIEW & AUDIT TRAIL
              ==================================================================== */}
          {workspaceFormTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Visual Publication Workflow Banner */}
              <div className="aerospace-card" style={{ padding: '20px 24px' }}>
                <div className="aerospace-label" style={{ marginBottom: '8px' }}>
                  <span className="aerospace-label-accent">//</span> PUBLICATION GOVERNANCE LIFECYCLE
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px' }}>
                    <span style={{ padding: '4px 10px', background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', borderRadius: '2px', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
                      1. DRAFT (Private)
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                    <span style={{ padding: '4px 10px', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', borderRadius: '2px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                      2. SUBMITTED
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                    <span style={{ padding: '4px 10px', background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', borderRadius: '2px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                      3. UNDER REVIEW
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                    <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: '2px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      4. APPROVED
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                    <span style={{ padding: '4px 10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', borderRadius: '2px', border: '1px solid #38bdf8' }}>
                      5. PUBLISHED (Public Archive)
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter Tabs Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                  Peer Review &amp; Audit Pipeline ({submissions.length})
                </h3>

                <div className="font-mono" style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn-aerospace ${submissionFilter === 'ALL' ? 'btn-aerospace-cyan' : ''}`}
                    onClick={() => setSubmissionFilter('ALL')}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    All ({submissions.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-aerospace ${submissionFilter === 'DRAFTS' ? 'btn-aerospace-cyan' : ''}`}
                    onClick={() => setSubmissionFilter('DRAFTS')}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    Drafts ({draftSubmissions.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-aerospace ${submissionFilter === 'QUEUE' ? 'btn-aerospace-cyan' : ''}`}
                    onClick={() => setSubmissionFilter('QUEUE')}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    Review Queue ({queueSubmissions.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-aerospace ${submissionFilter === 'PUBLISHED' ? 'btn-aerospace-cyan' : ''}`}
                    onClick={() => setSubmissionFilter('PUBLISHED')}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    Published ({publishedSubmissions.length})
                  </button>
                </div>
              </div>

              {/* Submissions Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="evidence-registry-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Title &amp; Target</th>
                      <th>Lead Researcher</th>
                      <th>Date</th>
                      <th>Reviewer Attestation</th>
                      <th>Lifecycle Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSubmissions.map((item) => {
                      const stStyle = getStatusColor(item.status)
                      return (
                        <tr key={item.id}>
                          <td>
                            <span
                              className="font-mono"
                              style={{
                                padding: '3px 8px',
                                borderRadius: '2px',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                color: stStyle.color,
                                backgroundColor: stStyle.bg,
                                border: `1px solid ${stStyle.border}`,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            {item.type}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                              <span>{item.title}</span>
                              {item.status === SUBMISSION_STATUSES.DRAFT && (
                                <span
                                  className="font-mono"
                                  style={{
                                    fontSize: '9px',
                                    background: 'rgba(148, 163, 184, 0.15)',
                                    color: '#94a3b8',
                                    padding: '1px 5px',
                                    borderRadius: '2px',
                                    marginLeft: '8px',
                                  }}
                                >
                                  PRIVATE
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Target: {item.targetBody || item.target_body || 'Planetary'} &bull; ID: {item.id}
                            </div>
                          </td>
                          <td>{item.researcherName || item.author || 'AEROKRYPT Contributor'}</td>
                          <td className="font-mono">{item.submissionDate || item.date || '2026-11'}</td>
                          <td>
                            {item.reviewerComments ? (
                              <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>"{item.reviewerComments}"</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Pending peer assignment</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {item.status === SUBMISSION_STATUSES.DRAFT && (
                                <button
                                  type="button"
                                  className="btn-aerospace btn-aerospace-cyan"
                                  onClick={() => {
                                    submitForReview(item.id)
                                    setSubmissions(getAllSubmissions())
                                  }}
                                  style={{ padding: '3px 8px', fontSize: '10px' }}
                                >
                                  Submit &rarr;
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-aerospace"
                                onClick={() => handleOpenAuditTrail(item)}
                                style={{ padding: '3px 8px', fontSize: '10px' }}
                              >
                                Audit Trail ↗
                              </button>

                              {item.status !== SUBMISSION_STATUSES.PUBLISHED && (
                                <button
                                  type="button"
                                  className="btn-aerospace"
                                  onClick={() => {
                                    setReviewModalItem(item)
                                    setReviewCommentInput(item.reviewerComments || '')
                                  }}
                                  style={{ padding: '3px 8px', fontSize: '10px' }}
                                >
                                  Review
                                </button>
                              )}

                              {item.status === SUBMISSION_STATUSES.APPROVED && (
                                <button
                                  type="button"
                                  className="btn-aerospace btn-aerospace-solid"
                                  onClick={() => handlePublish(item.id)}
                                  style={{ padding: '3px 8px', fontSize: '10px' }}
                                >
                                  Publish to Public Archive
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteSub(item.id)}
                                style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace' }}
                              >
                                [Delete]
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODAL 1: AUDIT TRAIL LOGS MODAL
              ==================================================================== */}
          {auditTrailModalItem && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 6, 8, 0.88)',
                backdropFilter: 'blur(12px)',
                zIndex: 1300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
              onClick={() => setAuditTrailModalItem(null)}
            >
              <div
                className="aerospace-card"
                style={{
                  maxWidth: '640px',
                  width: '100%',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  border: '1px solid var(--accent-cyan)',
                  backgroundColor: '#0a0f1d',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--accent-cyan)' }}>
                      AUDIT TRAIL &amp; PROVENANCE LOG
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: '4px 0 0 0' }}>
                      {auditTrailModalItem.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuditTrailModalItem(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Record ID: {auditTrailModalItem.id} &bull; Author: {auditTrailModalItem.researcherName || auditTrailModalItem.author || 'Author'}
                </div>

                {isLoadingAudit ? (
                  <div className="font-mono" style={{ color: 'var(--accent-cyan)', padding: '20px', textAlign: 'center' }}>
                    Loading chronological audit logs...
                  </div>
                ) : auditTrailLogs.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', padding: '12px' }}>
                    No prior state transitions recorded for this draft.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {auditTrailLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="font-mono"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderLeft: '3px solid var(--accent-cyan)',
                          padding: '10px 12px',
                          borderRadius: '2px',
                          fontSize: '11.5px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>
                            [{log.timestamp ? log.timestamp.split('T')[0] : 'DATE'}]
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>Actor: {log.actor || 'System'}</span>
                        </div>
                        <div style={{ marginTop: '4px', fontWeight: 700, color: '#ffffff' }}>
                          {log.fromStatus || log.from_status || 'INIT'} &rarr; {log.toStatus || log.to_status}
                        </div>
                        {(log.note || log.comments) && (
                          <div style={{ color: '#cbd5e1', fontStyle: 'italic', marginTop: '4px' }}>
                            "{log.note || log.comments}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={() => setAuditTrailModalItem(null)}
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                  >
                    Close Audit Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODAL 2: REOPEN SAVED EVALUATION DOSSIER MODAL
              ==================================================================== */}
          {activeEvalDetailModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 6, 8, 0.88)',
                backdropFilter: 'blur(12px)',
                zIndex: 1300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
              onClick={() => setActiveEvalDetailModal(null)}
            >
              <div
                className="aerospace-card"
                style={{
                  maxWidth: '700px',
                  width: '100%',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  border: '1px solid var(--accent-cyan)',
                  backgroundColor: '#0a0f1d',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge-source font-mono">SAVED ANALOGUE SITE DOSSIER</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '4px 0 0 0' }}>
                      {activeEvalDetailModal.location_name || activeEvalDetailModal.location_id} vs {activeEvalDetailModal.planetary_terrain_name || activeEvalDetailModal.planetary_terrain_id}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveEvalDetailModal(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Evaluation ID: {activeEvalDetailModal.evaluation_id} &bull; Engine Version: {activeEvalDetailModal.evaluation_version} &bull; Target: {activeEvalDetailModal.target_body}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>GEOLOGICAL SIMILARITY</div>
                    <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                      {activeEvalDetailModal.geological_similarity}%
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>OPERATIONAL SUITABILITY</div>
                    <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                      {activeEvalDetailModal.operational_suitability}%
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>COMPOSITE SCORE</div>
                    <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                      {activeEvalDetailModal.composite_score}%
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-void)', padding: '12px', borderRadius: '2px', borderLeft: '3px solid var(--accent-cyan)', fontSize: '12.5px', color: '#cbd5e1' }}>
                  <strong>Recommendation:</strong> {activeEvalDetailModal.recommendation || 'HIGH_SUITABILITY'} &bull; Linked Project: {activeEvalDetailModal.project_id}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={() => setActiveEvalDetailModal(null)}
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODAL 3: SIDE-BY-SIDE ASSESSMENT COMPARISON MODAL
              ==================================================================== */}
          {compareModalData && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 6, 8, 0.88)',
                backdropFilter: 'blur(12px)',
                zIndex: 1300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
              onClick={() => setCompareModalData(null)}
            >
              <div
                className="aerospace-card"
                style={{
                  maxWidth: '850px',
                  width: '100%',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  border: '1px solid var(--accent-cyan)',
                  backgroundColor: '#0a0f1d',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge-source font-mono">COMPARATIVE ASSESSMENT MATRIX</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '4px 0 0 0' }}>
                      Side-by-Side Analogue Assessment Comparison
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompareModalData(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Comparing {compareModalData.compared_count || (compareModalData.evaluations || []).length} candidate site evaluations &bull; Evaluation Version: {compareModalData.evaluation_version || '2.0.0-spatial'}
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="evidence-registry-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Metric / Parameter</th>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <th key={ev.evaluation_id}>
                            {ev.location_name || ev.location_id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Target Planetary Body</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id} className="font-mono">{ev.target_body}</td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Planetary Terrain Benchmark</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id}>{ev.planetary_terrain_name || ev.planetary_terrain_id}</td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Geological Similarity Score</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id} className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
                            {ev.geological_similarity}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Operational Suitability Score</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id} className="font-mono" style={{ color: '#34d399', fontWeight: 700 }}>
                            {ev.operational_suitability}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Composite Suitability Score</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id} className="font-mono" style={{ color: '#ffffff', fontWeight: 800 }}>
                            {ev.composite_score}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Recommendation</strong></td>
                        {(compareModalData.evaluations || []).map((ev) => (
                          <td key={ev.evaluation_id} className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>
                            {ev.recommendation || 'HIGH_SUITABILITY'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={() => setCompareModalData(null)}
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                  >
                    Close Comparison
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODAL 4: REVIEW & APPROVAL ACTION DIALOG
              ==================================================================== */}
          {reviewModalItem && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(5, 6, 8, 0.85)',
                backdropFilter: 'blur(16px)',
                zIndex: 1200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <div
                className="aerospace-card"
                style={{
                  maxWidth: '580px',
                  width: '100%',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                      AUDIT &amp; REVIEW INSPECTION
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                      {reviewModalItem.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewModalItem(null)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}
                  >
                    &times;
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reviewer Identity</label>
                  <input
                    type="text"
                    value={reviewerNameInput}
                    onChange={(e) => setReviewerNameInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reviewer Comments &amp; Recommendations</label>
                  <textarea
                    rows="3"
                    placeholder="Enter methodological review notes, required revisions, or approval reasons..."
                    value={reviewCommentInput}
                    onChange={(e) => setReviewCommentInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={() => handleReviewAction(SUBMISSION_STATUSES.UNDER_REVIEW)}
                    style={{ padding: '6px 12px', fontSize: '11px', color: '#00d2ff' }}
                  >
                    Mark UNDER REVIEW
                  </button>
                  <button
                    type="button"
                    className="btn-aerospace"
                    onClick={() => handleReviewAction(SUBMISSION_STATUSES.REVISION_REQUESTED)}
                    style={{ padding: '6px 12px', fontSize: '11px', color: '#f43f5e' }}
                  >
                    REQUEST REVISION
                  </button>
                  <button
                    type="button"
                    className="btn-aerospace btn-aerospace-solid"
                    onClick={() => handleReviewAction(SUBMISSION_STATUSES.APPROVED)}
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                  >
                    APPROVE SUBMISSION
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
