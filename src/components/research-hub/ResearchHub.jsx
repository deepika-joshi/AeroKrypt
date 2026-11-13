import { useState, useMemo } from 'react'
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
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { PEER_REVIEWED_RESEARCH_LIBRARY, RESEARCH_CATEGORIES } from '../../data/researchLibraryData.js'

export default function ResearchHub({ initialSubview = 'experiments', onNavigate = null }) {
  const [activeTab, setActiveTab] = useState(initialSubview)
  const [prevInitialSubview, setPrevInitialSubview] = useState(initialSubview)
  const [userRole, setUserRole] = useState(getCurrentRole())
  const [records, setRecords] = useState(getResearchRecords())
  const [experiments] = useState(getAllExperiments())
  const [submissions, setSubmissions] = useState(getAllSubmissions())

  // Search & filter states
  const [experimentSearch, setExperimentSearch] = useState('')
  const [experimentBodyFilter, setExperimentBodyFilter] = useState('ALL')
  const [recordSearch, setRecordSearch] = useState('')
  const [recordBodyFilter, setRecordBodyFilter] = useState('ALL')

  // Library filter states
  const [libraryCategory, setLibraryCategory] = useState('ALL')
  const [libraryBodyFilter, setLibraryBodyFilter] = useState('ALL')
  const [librarySearch, setLibrarySearch] = useState('')

  // Workspace sub-form tab
  const [workspaceFormTab, setWorkspaceFormTab] = useState('record') // 'record' | 'assessment' | 'evaluation'
  const [submissionFilter, setSubmissionFilter] = useState('ALL') // 'ALL' | 'DRAFTS' | 'QUEUE' | 'PUBLISHED'
  const [reviewModalItem, setReviewModalItem] = useState(null)
  const [reviewCommentInput, setReviewCommentInput] = useState('')
  const [reviewerNameInput, setReviewerNameInput] = useState('Dr. Field Investigator')

  // Notification message
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Form states for Researcher Workspace
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
                  {userRole === 'RESEARCHER' && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = deleteResearchRecord(rec.id)
                        setRecords(updated)
                      }}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '11px', fontFamily: 'monospace' }}
                    >
                      [Delete Record]
                    </button>
                  )}
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

          {/* Form Selection Switcher */}
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> SUBMISSION ENGINE
              </div>
              <h2 className="section-heading">
                Contribute Research, Assessments &amp; Evaluations
              </h2>
            </div>

            <div className="font-mono" style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'record' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('record')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                A. Research Record Form
              </button>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'assessment' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('assessment')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                B. Site Assessment Form
              </button>
              <button
                type="button"
                className={`btn-aerospace ${workspaceFormTab === 'evaluation' ? 'btn-aerospace-cyan' : ''}`}
                onClick={() => setWorkspaceFormTab('evaluation')}
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                C. Peer Evaluation Form
              </button>
            </div>
          </div>

          {/* FORM A: Research Record Form */}
          {workspaceFormTab === 'record' && (
            <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                Form A: Submit Field Research Record
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Research Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Spectral Mössbauer Calibration at Río Tinto"
                    value={recordForm.title}
                    onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Researcher Name &amp; Affiliation</label>
                  <input
                    type="text"
                    value={recordForm.researcherName}
                    onChange={(e) => setRecordForm({ ...recordForm, researcherName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Planetary Body</label>
                  <select
                    value={recordForm.targetBody}
                    onChange={(e) => setRecordForm({ ...recordForm, targetBody: e.target.value })}
                  >
                    <option value="Mars">Mars</option>
                    <option value="Moon">Moon</option>
                    <option value="Comparative">Comparative</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Study Location</label>
                  <input
                    type="text"
                    value={recordForm.studyLocation}
                    onChange={(e) => setRecordForm({ ...recordForm, studyLocation: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Research Objective</label>
                <textarea
                  rows="2"
                  placeholder="Define the primary scientific inquiry..."
                  value={recordForm.objective}
                  onChange={(e) => setRecordForm({ ...recordForm, objective: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Methodology</label>
                  <textarea
                    rows="3"
                    placeholder="Instruments, sensors, traverses, sampling protocols..."
                    value={recordForm.methodology}
                    onChange={(e) => setRecordForm({ ...recordForm, methodology: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Observations &amp; Findings</label>
                  <textarea
                    rows="3"
                    placeholder="Key empirical findings..."
                    value={recordForm.findings}
                    onChange={(e) => setRecordForm({ ...recordForm, findings: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dataset References &amp; PDS Layers</label>
                  <input
                    type="text"
                    value={recordForm.datasetReferences}
                    onChange={(e) => setRecordForm({ ...recordForm, datasetReferences: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DOI or Original Publication Link</label>
                  <input
                    type="text"
                    value={recordForm.doiLink}
                    onChange={(e) => setRecordForm({ ...recordForm, doiLink: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-aerospace"
                  onClick={() => handleSaveDraft(CONTRIBUTION_TYPES.RESEARCH_RECORD)}
                >
                  SAVE AS DRAFT (PRIVATE)
                </button>
                <button
                  type="button"
                  className="btn-aerospace btn-aerospace-solid"
                  onClick={() => handleSubmitForReview(CONTRIBUTION_TYPES.RESEARCH_RECORD)}
                >
                  SUBMIT FOR PEER REVIEW &rarr;
                </button>
              </div>
            </div>
          )}

          {/* FORM B: Site Assessment Form */}
          {workspaceFormTab === 'assessment' && (
            <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                Form B: Submit Site Assessment
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assessment Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Assessment of Devon Island Breccia for ExoMars Bogie"
                    value={assessmentForm.title}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Earth Analogue Location</label>
                  <select
                    value={assessmentForm.analogueLocationId}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, analogueLocationId: e.target.value })}
                  >
                    {ANALOGUE_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name} ({loc.country})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Planet / Moon</label>
                  <select
                    value={assessmentForm.targetBody}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, targetBody: e.target.value })}
                  >
                    <option value="Mars">Mars</option>
                    <option value="Moon">Moon</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ConOps Mission Protocol</label>
                  <select
                    value={assessmentForm.missionObjectiveId}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, missionObjectiveId: e.target.value })}
                  >
                    {experiments.map((exp) => (
                      <option key={exp.id} value={exp.id}>{exp.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Terrain Parameters Assessed</label>
                  <textarea
                    rows="2"
                    value={assessmentForm.parametersAssessed}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, parametersAssessed: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evidence &amp; Citation Sources</label>
                  <textarea
                    rows="2"
                    value={assessmentForm.evidenceSources}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, evidenceSources: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assessment Results</label>
                  <textarea
                    rows="2"
                    value={assessmentForm.assessmentResults}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentResults: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Missing Data &amp; Limitations</label>
                  <textarea
                    rows="2"
                    value={assessmentForm.missingDataLimitations}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, missingDataLimitations: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Researcher Conclusion</label>
                <textarea
                  rows="2"
                  value={assessmentForm.conclusion}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, conclusion: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-aerospace"
                  onClick={() => handleSaveDraft(CONTRIBUTION_TYPES.SITE_ASSESSMENT)}
                >
                  SAVE AS DRAFT (PRIVATE)
                </button>
                <button
                  type="button"
                  className="btn-aerospace btn-aerospace-solid"
                  onClick={() => handleSubmitForReview(CONTRIBUTION_TYPES.SITE_ASSESSMENT)}
                >
                  SUBMIT ASSESSMENT &rarr;
                </button>
              </div>
            </div>
          )}

          {/* FORM C: Peer Evaluation Form */}
          {workspaceFormTab === 'evaluation' && (
            <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                Form C: Submit Research Evaluation (Peer Review)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evaluation Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Methodological Review of Atacama Life Detection Limits"
                    value={evaluationForm.title}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Item Being Evaluated</label>
                  <select
                    value={evaluationForm.evaluatedItemId}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, evaluatedItemId: e.target.value })}
                  >
                    {records.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reviewer Name &amp; Role</label>
                  <input
                    type="text"
                    value={evaluationForm.reviewerName}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, reviewerName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evaluation Criteria</label>
                  <input
                    type="text"
                    value={evaluationForm.evaluationCriteria}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, evaluationCriteria: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: '#10b981' }}>Scientific Strengths</label>
                  <textarea
                    rows="2"
                    value={evaluationForm.scientificStrengths}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, scientificStrengths: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: '#f43f5e' }}>Methodological Concerns</label>
                  <textarea
                    rows="2"
                    value={evaluationForm.methodologicalConcerns}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, methodologicalConcerns: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evidence Quality</label>
                  <input
                    type="text"
                    value={evaluationForm.evidenceQuality}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, evidenceQuality: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Limitations &amp; Gaps</label>
                  <input
                    type="text"
                    value={evaluationForm.limitations}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, limitations: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recommendations &amp; Comments</label>
                <textarea
                  rows="2"
                  value={evaluationForm.recommendations}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, recommendations: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-aerospace"
                  onClick={() => handleSaveDraft(CONTRIBUTION_TYPES.PEER_EVALUATION)}
                >
                  SAVE AS DRAFT (PRIVATE)
                </button>
                <button
                  type="button"
                  className="btn-aerospace btn-aerospace-solid"
                  onClick={() => handleSubmitForReview(CONTRIBUTION_TYPES.PEER_EVALUATION)}
                >
                  SUBMIT EVALUATION &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Submissions & Review Workflow Queue */}
          <div className="section-header-row" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> LIFECYCLE MANAGEMENT
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                Contribution Review &amp; Publishing Pipeline ({submissions.length} Submissions)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Separate local private drafts from active peer review queue and approved public contributions.
              </p>
            </div>

            <div className="font-mono" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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

          <div style={{ overflowX: 'auto' }}>
            <table className="evidence-registry-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Title &amp; Target</th>
                  <th>Contributor</th>
                  <th>Date</th>
                  <th>Reviewer Comments</th>
                  <th>Workflow Actions</th>
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
                                letterSpacing: '0.05em',
                              }}
                            >
                              PRIVATE DRAFT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Target: {item.targetBody || 'Planetary'} &bull; ID: {item.id}
                        </div>
                      </td>
                      <td>{item.researcherName || item.author || 'AEROKRYPT Contributor'}</td>
                      <td className="font-mono">{item.submissionDate || item.date}</td>
                      <td>
                        {item.reviewerComments ? (
                          <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>"{item.reviewerComments}"</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No reviewer notes yet</span>
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
                              Submit
                            </button>
                          )}

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
                              Review &bull; Audit Trail
                            </button>
                          )}

                          {item.status === SUBMISSION_STATUSES.APPROVED && (
                            <button
                              type="button"
                              className="btn-aerospace btn-aerospace-solid"
                              onClick={() => handlePublish(item.id)}
                              style={{ padding: '3px 8px', fontSize: '10px' }}
                            >
                              Publish to Public Discovery
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

          {/* Review Modal Dialog */}
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

                {/* Status Transition Audit Trail */}
                {reviewModalItem.statusHistory && reviewModalItem.statusHistory.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      STATUS TRANSITION AUDIT TRAIL ({reviewModalItem.statusHistory.length} LOGGED EVENTS)
                    </label>
                    <div
                      className="font-mono"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '2px',
                        padding: '10px',
                        maxHeight: '130px',
                        overflowY: 'auto',
                        fontSize: '10.5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {reviewModalItem.statusHistory.map((entry, idx) => (
                        <div key={idx} style={{ borderBottom: idx < reviewModalItem.statusHistory.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '4px' }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>[{entry.timestamp ? entry.timestamp.split('T')[0] : 'DATE'}]</span>{' '}
                          <strong style={{ color: '#ffffff' }}>{entry.fromStatus || 'INIT'} &rarr; {entry.toStatus}</strong>
                          <span style={{ color: 'var(--text-muted)' }}> by {entry.actor}</span>
                          {entry.note && <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>"{entry.note}"</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Associated Review Comments */}
                {reviewModalItem.reviewComments && reviewModalItem.reviewComments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      ASSOCIATED REVIEW COMMENTS ({reviewModalItem.reviewComments.length})
                    </label>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '2px',
                        padding: '10px',
                        maxHeight: '110px',
                        overflowY: 'auto',
                        fontSize: '11px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {reviewModalItem.reviewComments.map((comm) => (
                        <div key={comm.id} style={{ borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '8px' }}>
                          <div className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            <strong style={{ color: '#ffffff' }}>{comm.reviewerName}</strong> ({comm.reviewerRole || 'Reviewer'}) &bull; {comm.date ? comm.date.split('T')[0] : ''} &bull; <span style={{ color: 'var(--accent-cyan)' }}>[{comm.action}]</span>
                          </div>
                          <div style={{ color: '#cbd5e1', marginTop: '2px' }}>"{comm.comment}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
