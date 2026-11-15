import { useState, useMemo, useEffect } from 'react'
import {
  INSTRUMENTS_DATA,
  INSTRUMENT_CATEGORIES,
} from '../../data/instrumentsData.js'
import {
  EDUCATIONAL_MODULES,
  CASE_STUDIES_SIMPLIFIED,
  PLANETARY_GLOSSARY,
  LEARNING_AUDIENCES,
} from '../../data/learningCenterData.js'
import { researchApi } from '../../services/apiClient.js'
import { getPublicPublishedContributions } from '../../services/researchRecordService.js'
import PageIntroHeader from '../common/PageIntroHeader.jsx'

export default function PublicDiscovery({ onNavigate = null }) {
  const [activeSection, setActiveSection] = useState('instruments') // 'instruments' | 'learning' | 'case-studies' | 'published-archive'

  // --- Section 1: Instruments & Technology State ---
  const [instrumentCategory, setInstrumentCategory] = useState('ALL')
  const [instrumentTargetBody, setInstrumentTargetBody] = useState('ALL')
  const [instrumentSearch, setInstrumentSearch] = useState('')
  const [expandedInstrumentId, setExpandedInstrumentId] = useState(null)

  // --- Section 2: Student & Public Learning Centre State ---
  const [selectedAudience, setSelectedAudience] = useState('ALL')
  const [expandedModuleId, setExpandedModuleId] = useState('edu-planetary-fundamentals')
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState('')
  const [userQuizAnswers, setUserQuizAnswers] = useState({})

  // --- Section 3: Simplified Case Studies State ---
  const [caseStudyBodyFilter, setCaseStudyBodyFilter] = useState('ALL')
  const [caseStudySearch, setCaseStudySearch] = useState('')
  const [expandedCaseStudyId, setExpandedCaseStudyId] = useState('case-atacama-hyperarid-microbiology')

  // --- Section 4: Published Research Archive State ---
  const [publishedRecords, setPublishedRecords] = useState([])
  const [archiveTargetBody, setArchiveTargetBody] = useState('ALL')
  const [archiveSearch, setArchiveSearch] = useState('')
  const [selectedPublishedRecord, setSelectedPublishedRecord] = useState(null)
  const [isLoadingArchive, setIsLoadingArchive] = useState(false)
  const [archiveDataSource, setArchiveDataSource] = useState('FETCHING') // 'FASTAPI_POSTGRES' | 'LOCAL_ARCHIVE'

  // Fetch approved published research from FastAPI backend
  useEffect(() => {
    let isMounted = true
    async function loadPublishedArchive() {
      setIsLoadingArchive(true)
      try {
        const params = {}
        if (archiveTargetBody !== 'ALL') params.target_body = archiveTargetBody
        if (archiveSearch.trim()) params.search = archiveSearch.trim()

        const res = await researchApi.getPublicPublished(params)
        if (!isMounted) return

        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPublishedRecords(res.data)
          setArchiveDataSource('FASTAPI_POSTGRES')
        } else {
          // Resilient fallback to local published records
          const localFallback = getPublicPublishedContributions()
          setPublishedRecords(localFallback)
          setArchiveDataSource(res.isNetworkError ? 'LOCAL_ARCHIVE' : 'FASTAPI_POSTGRES')
        }
      } catch {
        if (isMounted) {
          const localFallback = getPublicPublishedContributions()
          setPublishedRecords(localFallback)
          setArchiveDataSource('LOCAL_ARCHIVE')
        }
      } finally {
        if (isMounted) setIsLoadingArchive(false)
      }
    }

    loadPublishedArchive()
    return () => { isMounted = false }
  }, [archiveTargetBody, archiveSearch])

  // Filter Instruments
  const filteredInstruments = useMemo(() => {
    return INSTRUMENTS_DATA.filter((inst) => {
      const matchCat = instrumentCategory === 'ALL' || inst.category === instrumentCategory
      const matchBody =
        instrumentTargetBody === 'ALL' ||
        inst.targetBody.toLowerCase().includes(instrumentTargetBody.toLowerCase())
      const q = instrumentSearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        inst.name.toLowerCase().includes(q) ||
        inst.mission.toLowerCase().includes(q) ||
        inst.agency.toLowerCase().includes(q) ||
        inst.whatItMeasures.toLowerCase().includes(q)
      return matchCat && matchBody && matchSearch
    })
  }, [instrumentCategory, instrumentTargetBody, instrumentSearch])

  // Filter Educational Modules
  const filteredModules = useMemo(() => {
    if (selectedAudience === 'ALL') return EDUCATIONAL_MODULES
    return EDUCATIONAL_MODULES.filter((m) => m.audience === selectedAudience)
  }, [selectedAudience])

  // Filter Case Studies
  const filteredCaseStudies = useMemo(() => {
    return CASE_STUDIES_SIMPLIFIED.filter((cs) => {
      const matchBody =
        caseStudyBodyFilter === 'ALL' ||
        cs.targetBody.toLowerCase().includes(caseStudyBodyFilter.toLowerCase())
      const q = caseStudySearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        cs.title.toLowerCase().includes(q) ||
        cs.location.toLowerCase().includes(q) ||
        cs.question.toLowerCase().includes(q) ||
        cs.findings.toLowerCase().includes(q)
      return matchBody && matchSearch
    })
  }, [caseStudyBodyFilter, caseStudySearch])

  const handleSelectQuiz = (moduleId, optionIndex) => {
    setUserQuizAnswers((prev) => ({ ...prev, [moduleId]: optionIndex }))
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'OPERATIONAL':
        return { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', border: 'rgba(74, 222, 128, 0.4)', label: '● OPERATIONAL' }
      case 'RETIRED':
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)', label: 'RETIRED / SCIENCE ARCHIVE' }
      case 'HISTORICAL':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', label: 'HISTORICAL BENCHMARK' }
      case 'MODIFIED_DEPLOYMENT':
      case 'ACTIVE_DEVELOPMENT_FLIGHT_READY':
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)', label: 'FLIGHT-READY / CLPS REDEPLOYMENT' }
      case 'IN_TRANSIT':
        return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', label: 'IN TRANSIT TO DESTINATION' }
      default:
        return { color: '#cbd5e1', bg: 'rgba(255, 255, 255, 0.08)', border: 'var(--border-subtle)', label: status }
    }
  }

  return (
    <div className="public-discovery-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageIntroHeader pageKey="public-discovery" />

      {/* 1. Sub-Navigation Tabs */}
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
            className={`tab-button ${activeSection === 'instruments' ? 'active' : ''}`}
            onClick={() => setActiveSection('instruments')}
          >
            📡 Research Instruments &amp; Technology ({INSTRUMENTS_DATA.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveSection('learning')}
          >
            🎓 Student &amp; Public Learning Centre ({EDUCATIONAL_MODULES.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'case-studies' ? 'active' : ''}`}
            onClick={() => setActiveSection('case-studies')}
          >
            📖 Simplified Case Studies ({CASE_STUDIES_SIMPLIFIED.length})
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'published-archive' ? 'active' : ''}`}
            onClick={() => setActiveSection('published-archive')}
          >
            🏛️ Published Research Archive ({publishedRecords.length})
          </button>
        </div>

        <div className="telemetry-pill font-mono" style={{ fontSize: '11px' }}>
          <span className="telemetry-dot" />
          <span>ACCESSIBLE PLANETARY SCIENCE &amp; INSTRUMENTATION</span>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: RESEARCH INSTRUMENTS & TECHNOLOGY
          ==================================================================== */}
      {activeSection === 'instruments' && (
        <section className="instruments-catalogue-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> INSTRUMENTATION CATALOGUE
              </div>
              <h2 className="section-heading">
                Planetary Research Instruments &amp; Technology
              </h2>
              <p className="section-subheading">
                Educational reference of authentic spectrometers, ground radar, seismometers, coring drills, and environmental sensors deployed on Mars, Moon, and interplanetary missions.
              </p>
            </div>
            <div className="dataset-notice-chip font-mono">
              <span className="notice-dot" />
              <span>AUTHENTIC MISSION HARDWARE</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            className="aerospace-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(10, 15, 25, 0.75)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CATEGORY:</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {INSTRUMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setInstrumentCategory(cat.id)}
                    className="font-mono"
                    style={{
                      background: instrumentCategory === cat.id ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: instrumentCategory === cat.id ? '#00d2ff' : '#94a3b8',
                      border: '1px solid',
                      borderColor: instrumentCategory === cat.id ? '#00d2ff' : 'var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={instrumentTargetBody}
                onChange={(e) => setInstrumentTargetBody(e.target.value)}
                className="font-mono"
                style={{
                  background: 'var(--bg-void)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 10px',
                  borderRadius: '2px',
                  fontSize: '11.5px',
                }}
              >
                <option value="ALL">All Target Bodies</option>
                <option value="Mars">Mars Missions</option>
                <option value="Moon">Moon Missions</option>
                <option value="Ganymede">Outer Solar System</option>
              </select>

              <input
                type="text"
                placeholder="Search instrument, mission, agency..."
                value={instrumentSearch}
                onChange={(e) => setInstrumentSearch(e.target.value)}
                style={{
                  background: 'var(--bg-void)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  width: '240px',
                }}
              />
            </div>
          </div>

          {/* Instruments Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredInstruments.map((inst) => {
              const statusStyle = getStatusBadgeStyle(inst.operationalStatus)
              const isExpanded = expandedInstrumentId === inst.id

              return (
                <article
                  key={inst.id}
                  className="aerospace-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    border: isExpanded ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="badge-source font-mono">{inst.categoryLabel}</span>
                        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>
                          {inst.targetBody}
                        </span>
                      </div>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '2px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                        {inst.name}
                      </h3>
                      <div className="font-mono" style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {inst.mission} &bull; {inst.agency}
                      </div>
                    </div>

                    {/* Operational Disclaimer Alert */}
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderLeft: `3px solid ${statusStyle.color}`,
                        padding: '8px 12px',
                        borderRadius: '2px',
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      <strong style={{ color: '#ffffff' }}>Status Note:</strong> {inst.statusDisclaimer}
                    </div>

                    <div>
                      <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '2px' }}>
                        WHAT IT MEASURES:
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                        {inst.whatItMeasures}
                      </p>
                    </div>

                    <div>
                      <div className="font-mono" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                        HOW IT WORKS:
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {inst.howItWorks}
                      </p>
                    </div>

                    {isExpanded && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div className="font-mono" style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginBottom: '2px' }}>
                            WHY FIELD RESEARCHERS USE IT:
                          </div>
                          <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                            {inst.whyResearchersUseIt}
                          </p>
                        </div>

                        <div>
                          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 600, marginBottom: '2px' }}>
                            KEY APPLICATION &amp; DISCOVERY:
                          </div>
                          <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                            {inst.exampleApplication}
                          </p>
                        </div>

                        {inst.references && inst.references.length > 0 && (
                          <div>
                            <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              DOCUMENTED SCIENTIFIC CITATIONS:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {inst.references.map((ref, idx) => (
                                <a
                                  key={idx}
                                  href={ref.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono"
                                  style={{
                                    fontSize: '11px',
                                    color: 'var(--accent-cyan)',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                  }}
                                >
                                  ↗ {ref.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-faint)' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Mounted on: {inst.carrier}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedInstrumentId(isExpanded ? null : inst.id)}
                      className="font-mono"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-cyan)',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? 'Show Less ▲' : 'Read Full Specs ▼'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 2: STUDENT & PUBLIC LEARNING CENTRE
          ==================================================================== */}
      {activeSection === 'learning' && (
        <section className="learning-centre-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> PUBLIC &amp; STUDENT LEARNING CENTRE
              </div>
              <h2 className="section-heading">
                Planetary Geodesy &amp; Analogue Science Modules
              </h2>
              <p className="section-subheading">
                Accessible, scientifically rigorous explanations for school students, undergraduates, and space enthusiasts.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {LEARNING_AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setSelectedAudience(aud.id)}
                  className="font-mono"
                  style={{
                    background: selectedAudience === aud.id ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedAudience === aud.id ? '#00d2ff' : '#94a3b8',
                    border: '1px solid',
                    borderColor: selectedAudience === aud.id ? '#00d2ff' : 'var(--border-subtle)',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredModules.map((mod) => {
              const isExpanded = expandedModuleId === mod.id
              const chosenQuiz = userQuizAnswers[mod.id]
              const hasAnsweredQuiz = chosenQuiz !== undefined

              return (
                <article
                  key={mod.id}
                  className="aerospace-card"
                  style={{
                    padding: '24px',
                    border: isExpanded ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '26px' }}>{mod.icon}</span>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className="badge-source font-mono">{mod.audience.toUpperCase()}</span>
                          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mod.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 0 0' }}>
                          {mod.title}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="font-mono"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? '▲ Collapse' : '▼ Read Module'}
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {mod.summary}
                  </p>

                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                      {mod.sections.map((sec, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#00d2ff', margin: 0 }}>
                            {sec.heading}
                          </h4>
                          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                            {sec.content}
                          </p>
                        </div>
                      ))}

                      {mod.funFact && (
                        <div
                          style={{
                            background: 'rgba(234, 179, 8, 0.08)',
                            borderLeft: '3px solid #eab308',
                            padding: '12px 16px',
                            borderRadius: '2px',
                            fontSize: '12.5px',
                            color: '#fef08a',
                          }}
                        >
                          <strong>Planetary Fact:</strong> {mod.funFact}
                        </div>
                      )}

                      {/* Interactive Knowledge Check Quiz */}
                      {mod.quizQuestion && (
                        <div
                          style={{
                            background: 'var(--bg-void)',
                            border: '1px solid var(--border-subtle)',
                            padding: '16px 20px',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                          }}
                        >
                          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                            // QUICK KNOWLEDGE CHECK
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>
                            {mod.quizQuestion.question}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {mod.quizQuestion.options.map((opt, optIdx) => {
                              const isSelected = chosenQuiz === optIdx
                              const isCorrect = optIdx === mod.quizQuestion.correctAnswer

                              let optBg = 'rgba(255, 255, 255, 0.03)'
                              let optBorder = 'var(--border-subtle)'
                              let optColor = '#e2e8f0'

                              if (hasAnsweredQuiz) {
                                if (isCorrect) {
                                  optBg = 'rgba(16, 185, 129, 0.2)'
                                  optBorder = '#10b981'
                                  optColor = '#34d399'
                                } else if (isSelected) {
                                  optBg = 'rgba(239, 68, 68, 0.2)'
                                  optBorder = '#ef4444'
                                  optColor = '#f87171'
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuiz(mod.id, optIdx)}
                                  disabled={hasAnsweredQuiz}
                                  style={{
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    borderRadius: '2px',
                                    background: optBg,
                                    border: `1px solid ${optBorder}`,
                                    color: optColor,
                                    fontSize: '12.5px',
                                    cursor: hasAnsweredQuiz ? 'default' : 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {opt}
                                </button>
                              )
                            })}
                          </div>

                          {hasAnsweredQuiz && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: chosenQuiz === mod.quizQuestion.correctAnswer ? '#34d399' : '#f87171',
                                lineHeight: 1.4,
                              }}
                            >
                              <strong>{chosenQuiz === mod.quizQuestion.correctAnswer ? '✓ Correct!' : '✗ Scientific Correction:'}</strong>{' '}
                              <span style={{ color: 'var(--text-secondary)' }}>{mod.quizQuestion.explanation}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {/* Planetary Geodesy Glossary */}
          <div className="aerospace-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="aerospace-label">
              <span className="aerospace-label-accent">//</span> KEY VOCABULARY
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
              Planetary Geodesy &amp; Exploration Glossary
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Click any term to inspect its scientific definition and operational context in space missions.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PLANETARY_GLOSSARY.map((item) => (
                <button
                  key={item.term}
                  type="button"
                  onClick={() => setActiveGlossaryTerm(activeGlossaryTerm === item.term ? '' : item.term)}
                  className="font-mono"
                  style={{
                    background: activeGlossaryTerm === item.term ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeGlossaryTerm === item.term ? '#00d2ff' : '#cbd5e1',
                    border: '1px solid',
                    borderColor: activeGlossaryTerm === item.term ? '#00d2ff' : 'var(--border-subtle)',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                  }}
                >
                  {item.term}
                </button>
              ))}
            </div>

            {activeGlossaryTerm && (
              <div
                style={{
                  background: 'var(--bg-void)',
                  padding: '14px 18px',
                  borderRadius: '2px',
                  borderLeft: '3px solid var(--accent-cyan)',
                  fontSize: '13px',
                  color: '#ffffff',
                  lineHeight: 1.5,
                }}
              >
                <strong>{activeGlossaryTerm}:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  {PLANETARY_GLOSSARY.find((g) => g.term === activeGlossaryTerm)?.definition}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 3: SIMPLIFIED RESEARCH CASE STUDIES (9-POINT STRUCTURE)
          ==================================================================== */}
      {activeSection === 'case-studies' && (
        <section className="case-studies-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> FIELD DISCOVERY STUDIES (9-POINT SCIENTIFIC STRUCTURE)
              </div>
              <h2 className="section-heading">
                Genuine Planetary Analogue Case Studies
              </h2>
              <p className="section-subheading">
                Peer-reviewed terrestrial field campaigns explained with strict methodological transparency: problem, instruments, empirical observations, limitations, and DOI citations.
              </p>
            </div>
            <div className="dataset-notice-chip font-mono">
              <span className="notice-dot" />
              <span>STRICT 9-POINT REPORTING</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            className="aerospace-card"
            style={{
              padding: '14px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(10, 15, 25, 0.75)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TARGET:</span>
              <button
                type="button"
                onClick={() => setCaseStudyBodyFilter('ALL')}
                className="font-mono"
                style={{
                  background: caseStudyBodyFilter === 'ALL' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: caseStudyBodyFilter === 'ALL' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: caseStudyBodyFilter === 'ALL' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                All Targets
              </button>
              <button
                type="button"
                onClick={() => setCaseStudyBodyFilter('Mars')}
                className="font-mono"
                style={{
                  background: caseStudyBodyFilter === 'Mars' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: caseStudyBodyFilter === 'Mars' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: caseStudyBodyFilter === 'Mars' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Mars Studies
              </button>
              <button
                type="button"
                onClick={() => setCaseStudyBodyFilter('Moon')}
                className="font-mono"
                style={{
                  background: caseStudyBodyFilter === 'Moon' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: caseStudyBodyFilter === 'Moon' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: caseStudyBodyFilter === 'Moon' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Moon &amp; Dual Studies
              </button>
            </div>

            <input
              type="text"
              placeholder="Search case studies by keyword..."
              value={caseStudySearch}
              onChange={(e) => setCaseStudySearch(e.target.value)}
              style={{
                background: 'var(--bg-void)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '2px',
                fontSize: '12px',
                width: '260px',
              }}
            />
          </div>

          {/* Case Studies Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredCaseStudies.map((study) => {
              const isExpanded = expandedCaseStudyId === study.id

              return (
                <article
                  key={study.id}
                  className="aerospace-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    border: isExpanded ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="badge-source font-mono">{study.targetBody} Analogue</span>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>{study.difficulty}</span>
                    </div>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Mission Groundwork: {study.mission}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0 }}>
                      {study.title}
                    </h3>
                    <div className="font-mono" style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginTop: '6px' }}>
                      Location: {study.location}
                    </div>
                  </div>

                  {/* Point 1: Question */}
                  <div
                    style={{
                      background: 'rgba(0, 210, 255, 0.05)',
                      borderLeft: '3px solid var(--accent-cyan)',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      fontSize: '13px',
                      color: '#ffffff',
                    }}
                  >
                    <strong style={{ color: 'var(--accent-cyan)' }}>1. SCIENTIFIC QUESTION:</strong> "{study.question}"
                  </div>

                  {/* Point 2: Problem */}
                  <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    <strong style={{ color: '#ffffff' }}>2. THE ENGINEERING / SCIENCE PROBLEM:</strong> {study.problem}
                  </div>

                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      {/* Point 3: Location */}
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                        <strong style={{ color: '#ffffff' }}>3. ANALOGUE LOCATION:</strong> {study.location}
                      </div>

                      {/* Point 4: Methodology */}
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                        <strong style={{ color: '#ffffff' }}>4. METHODOLOGY &amp; CAMPAIGN DESIGN:</strong> {study.methodology}
                      </div>

                      {/* Point 5: Instruments */}
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                        <strong style={{ color: '#ffffff' }}>5. SCIENTIFIC INSTRUMENTS USED:</strong> {study.instruments}
                      </div>

                      {/* Point 6: Observations */}
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                        <strong style={{ color: '#ffffff' }}>6. EMPIRICAL OBSERVATIONS:</strong> {study.observations}
                      </div>

                      {/* Point 7: Findings */}
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          borderLeft: '3px solid #10b981',
                          padding: '10px 14px',
                          borderRadius: '2px',
                          fontSize: '13px',
                          color: '#e2e8f0',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: '#34d399' }}>7. KEY FINDINGS &amp; MISSION RELEVANCE:</strong> {study.findings}
                      </div>

                      {/* Point 8: Limitations */}
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          borderLeft: '3px solid #ef4444',
                          padding: '10px 14px',
                          borderRadius: '2px',
                          fontSize: '13px',
                          color: '#fca5a5',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: '#f87171' }}>8. ANALOGUE LIMITATIONS &amp; EARTH DIVERGENCES:</strong> {study.limitations}
                      </div>

                      {/* Point 9: Publication DOI */}
                      <div
                        style={{
                          background: 'var(--bg-void)',
                          border: '1px solid var(--border-subtle)',
                          padding: '10px 14px',
                          borderRadius: '2px',
                          fontSize: '12px',
                        }}
                      >
                        <strong style={{ color: 'var(--accent-amber)' }}>9. PEER-REVIEWED PUBLICATION &amp; DOI:</strong>{' '}
                        <span style={{ color: '#e2e8f0' }}>{study.publication}</span>
                        {study.doi && (
                          <div style={{ marginTop: '4px' }}>
                            <a
                              href={`https://doi.org/${study.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono"
                              style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
                            >
                              ↗ Open Documented DOI: {study.doi}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setExpandedCaseStudyId(isExpanded ? null : study.id)}
                      className="font-mono"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-cyan)',
                        padding: '5px 12px',
                        borderRadius: '2px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? 'Collapse 9-Point Breakdown ▲' : 'Inspect Complete 9-Point Study ▼'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 4: PUBLISHED RESEARCH ARCHIVE
          ==================================================================== */}
      {activeSection === 'published-archive' && (
        <section className="published-archive-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> PUBLIC EVIDENCE REPOSITORY
              </div>
              <h2 className="section-heading">
                Published Research Archive
              </h2>
              <p className="section-subheading">
                Formally reviewed and approved planetary research records. Only research that has passed peer review and attained PUBLISHED status is indexed here.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  backgroundColor: archiveDataSource === 'FASTAPI_POSTGRES' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                  color: archiveDataSource === 'FASTAPI_POSTGRES' ? '#4ade80' : '#38bdf8',
                  border: `1px solid ${archiveDataSource === 'FASTAPI_POSTGRES' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
                }}
              >
                {archiveDataSource === 'FASTAPI_POSTGRES' ? '⚡ FASTAPI PERSISTENT ARCHIVE' : '💾 PEER BENCHMARK ARCHIVE'}
              </span>
              <div className="dataset-notice-chip font-mono">
                <span className="notice-dot" />
                <span>FORMALLY APPROVED &amp; PUBLISHED ONLY</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            className="aerospace-card"
            style={{
              padding: '14px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(10, 15, 25, 0.75)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BODY:</span>
              <button
                type="button"
                onClick={() => setArchiveTargetBody('ALL')}
                className="font-mono"
                style={{
                  background: archiveTargetBody === 'ALL' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: archiveTargetBody === 'ALL' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: archiveTargetBody === 'ALL' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                All Bodies
              </button>
              <button
                type="button"
                onClick={() => setArchiveTargetBody('Mars')}
                className="font-mono"
                style={{
                  background: archiveTargetBody === 'Mars' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: archiveTargetBody === 'Mars' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: archiveTargetBody === 'Mars' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Mars Research
              </button>
              <button
                type="button"
                onClick={() => setArchiveTargetBody('Moon')}
                className="font-mono"
                style={{
                  background: archiveTargetBody === 'Moon' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: archiveTargetBody === 'Moon' ? '#00d2ff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: archiveTargetBody === 'Moon' ? '#00d2ff' : 'var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Moon Research
              </button>
            </div>

            <input
              type="text"
              placeholder="Search published records..."
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              style={{
                background: 'var(--bg-void)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '2px',
                fontSize: '12px',
                width: '260px',
              }}
            />
          </div>

          {/* List of Published Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isLoadingArchive ? (
              <div className="aerospace-card" style={{ padding: '36px', textAlign: 'center' }}>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>Synchronizing Published Research Archive...</span>
              </div>
            ) : publishedRecords.length === 0 ? (
              <div className="aerospace-card" style={{ padding: '36px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No published research matching your query. Submitted drafts undergoing peer review will appear here once approved and published.
                </p>
              </div>
            ) : (
              publishedRecords.map((pub) => {
                const dateStr = pub.published_at || pub.publishedAt || pub.submissionDate || pub.date || pub.created_at || 'Verified'
                const displayDate = typeof dateStr === 'string' && dateStr.includes('T') ? dateStr.split('T')[0] : dateStr

                return (
                  <article
                    key={pub.id}
                    className="aerospace-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge-source font-mono">{pub.target_body || pub.targetBody || 'Planetary'} Analogue</span>
                        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Published: {displayDate}
                        </span>
                      </div>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '10.5px',
                          color: '#10b981',
                          padding: '2px 8px',
                          borderRadius: '2px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                      >
                        OFFICIALLY PUBLISHED &amp; AUDITED
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0 }}>
                      {pub.title}
                    </h3>

                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      <strong>Lead Researcher:</strong> {pub.researcher_name || pub.researcherName || pub.author || 'AEROKRYPT Contributor'}
                      {(pub.affiliation || pub.institution) && <span> &bull; {pub.affiliation || pub.institution}</span>}
                      {pub.analogue_location_id && <span> &bull; Location: {pub.analogue_location_id}</span>}
                    </div>

                    {(pub.abstract || pub.objective) && (
                      <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.5, margin: 0 }}>
                        <strong>Objective:</strong> {pub.abstract || pub.objective}
                      </p>
                    )}

                    {pub.findings && (
                      <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.5, margin: 0 }}>
                        <strong>Key Findings:</strong> {pub.findings}
                      </p>
                    )}

                    {pub.reviewer_comments || pub.reviewerComments ? (
                      <div
                        style={{
                          background: 'var(--bg-void)',
                          padding: '10px 14px',
                          borderRadius: '2px',
                          borderLeft: '2px solid #10b981',
                          fontSize: '11.5px',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                        }}
                      >
                        <strong>Peer Review Attestation ({pub.reviewer_name || pub.reviewerName || 'AEROKRYPT Peer Reviewer'}):</strong> "{pub.reviewer_comments || pub.reviewerComments}"
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-faint)', paddingTop: '10px', fontSize: '11px', flexWrap: 'wrap', gap: '8px' }}>
                      <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                        DOI Reference: {pub.doi_link || pub.doiLink || pub.doiReference || 'AEROKRYPT-OPEN-2026'}
                      </span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                          Record ID: {pub.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedPublishedRecord(pub)}
                          className="font-mono"
                          style={{
                            background: 'rgba(0, 210, 255, 0.1)',
                            border: '1px solid rgba(0, 210, 255, 0.3)',
                            color: '#00d2ff',
                            padding: '3px 8px',
                            borderRadius: '2px',
                            fontSize: '10.5px',
                            cursor: 'pointer',
                          }}
                        >
                          View Full Dossier ↗
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>

          {/* Full Record Inspection Modal */}
          {selectedPublishedRecord && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
              }}
              onClick={() => setSelectedPublishedRecord(null)}
            >
              <div
                className="aerospace-card"
                style={{
                  width: '100%',
                  maxWidth: '750px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  backgroundColor: '#0a0f1d',
                  border: '1px solid var(--accent-cyan)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge-source font-mono">PUBLISHED RESEARCH DOSSIER</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 0 0' }}>
                      {selectedPublishedRecord.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPublishedRecord(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="font-mono" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  ID: {selectedPublishedRecord.id} &bull; Author: {selectedPublishedRecord.researcher_name || selectedPublishedRecord.author || 'AEROKRYPT Contributor'} &bull; Target: {selectedPublishedRecord.target_body || selectedPublishedRecord.targetBody}
                </div>

                {selectedPublishedRecord.abstract && (
                  <div>
                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '12px' }}>ABSTRACT / OBJECTIVE:</strong>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: 1.5, marginTop: '4px' }}>
                      {selectedPublishedRecord.abstract}
                    </p>
                  </div>
                )}

                {selectedPublishedRecord.methodology && (
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '12px' }}>METHODOLOGY:</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginTop: '4px' }}>
                      {selectedPublishedRecord.methodology}
                    </p>
                  </div>
                )}

                {selectedPublishedRecord.findings && (
                  <div>
                    <strong style={{ color: '#34d399', fontSize: '12px' }}>DOCUMENTED FINDINGS:</strong>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: 1.5, marginTop: '4px' }}>
                      {selectedPublishedRecord.findings}
                    </p>
                  </div>
                )}

                {/* Structured Fields if available */}
                {selectedPublishedRecord.environmental_measurements && Array.isArray(selectedPublishedRecord.environmental_measurements) && selectedPublishedRecord.environmental_measurements.length > 0 && (
                  <div>
                    <strong style={{ color: 'var(--accent-amber)', fontSize: '12px' }}>DOCUMENTED ENVIRONMENTAL MEASUREMENTS:</strong>
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {selectedPublishedRecord.environmental_measurements.map((m, idx) => (
                        <div key={idx} className="font-mono" style={{ fontSize: '11.5px', background: 'var(--bg-void)', padding: '6px 10px', borderRadius: '2px' }}>
                          <strong>{m.parameter}:</strong> {m.value} {m.unit} (Instrument: {m.instrument || 'Calibrated Sensor'})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPublishedRecord.field_observations && Array.isArray(selectedPublishedRecord.field_observations) && selectedPublishedRecord.field_observations.length > 0 && (
                  <div>
                    <strong style={{ color: '#38bdf8', fontSize: '12px' }}>FIELD OBSERVATIONS:</strong>
                    <ul style={{ color: '#cbd5e1', fontSize: '12.5px', marginTop: '4px', paddingLeft: '20px' }}>
                      {selectedPublishedRecord.field_observations.map((obs, idx) => (
                        <li key={idx}>{obs.note || obs.observation || JSON.stringify(obs)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  style={{
                    background: 'var(--bg-void)',
                    padding: '12px',
                    borderRadius: '2px',
                    borderLeft: '3px solid #10b981',
                    fontSize: '12px',
                    color: '#e2e8f0',
                  }}
                >
                  <strong>Review Status:</strong> APPROVED &amp; PUBLISHED &bull; Reviewer: {selectedPublishedRecord.reviewer_name || selectedPublishedRecord.reviewerName || 'AEROKRYPT Editorial Board'}
                  {selectedPublishedRecord.reviewer_comments && (
                    <div style={{ fontStyle: 'italic', marginTop: '4px', color: 'var(--text-secondary)' }}>
                      "{selectedPublishedRecord.reviewer_comments}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPublishedRecord(null)}
                    className="btn-aerospace"
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                  >
                    Close Dossier
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
