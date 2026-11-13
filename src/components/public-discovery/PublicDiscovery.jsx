import { useState, useMemo } from 'react'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import {
  EDUCATIONAL_MODULES,
  CASE_STUDIES_SIMPLIFIED,
  PLANETARY_GLOSSARY,
  LEARNING_AUDIENCES,
} from '../../data/learningCenterData.js'
import { getPublicPublishedContributions } from '../../services/researchRecordService.js'
import InteractiveMap from '../common/InteractiveMap.jsx'

export default function PublicDiscovery({ onNavigate = null }) {
  const [activeSection, setActiveSection] = useState('learning') // 'learning' | 'stories' | 'explorer' | 'published'
  const [selectedAudience, setSelectedAudience] = useState('ALL')
  const [expandedModuleId, setExpandedModuleId] = useState('edu-intro-terrains')
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState('')

  // Interactive Map Explorer State
  const [selectedLocationId, setSelectedLocationId] = useState(ANALOGUE_LOCATIONS[0].id)

  // Module quiz states
  const [userQuizAnswers, setUserQuizAnswers] = useState({})

  // Published community research
  const publishedContributions = useMemo(() => {
    return getPublicPublishedContributions()
  }, [])

  const activeLocation = useMemo(() => {
    return ANALOGUE_LOCATIONS.find((l) => l.id === selectedLocationId) || ANALOGUE_LOCATIONS[0]
  }, [selectedLocationId])

  // Filter educational modules
  const filteredModules = useMemo(() => {
    if (selectedAudience === 'ALL') return EDUCATIONAL_MODULES
    return EDUCATIONAL_MODULES.filter((m) => m.audience === selectedAudience)
  }, [selectedAudience])

  const handleSelectQuiz = (moduleId, optionIndex) => {
    setUserQuizAnswers((prev) => ({ ...prev, [moduleId]: optionIndex }))
  }

  return (
    <div className="public-discovery-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Aerospace Hero Sub-Navigation Tabs */}
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
            className={`tab-button ${activeSection === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveSection('learning')}
          >
            🎓 Student &amp; Public Learning Centre
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveSection('stories')}
          >
            📖 Simplified Case Studies
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveSection('explorer')}
          >
            🪐 Interactive Analogue Explorer
          </button>
          <button
            type="button"
            className={`tab-button ${activeSection === 'published' ? 'active' : ''}`}
            onClick={() => setActiveSection('published')}
          >
            🏛️ Published Research Archive ({publishedContributions.length})
          </button>
        </div>

        <div className="telemetry-pill font-mono" style={{ fontSize: '11px' }}>
          <span className="telemetry-dot" />
          <span>ACCESSIBLE PLANETARY SCIENCE</span>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: STUDENT & PUBLIC LEARNING CENTRE (Section 3)
          ==================================================================== */}
      {activeSection === 'learning' && (
        <section className="learning-centre-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> SCIENCE FOUNDATIONS
              </div>
              <h2 className="section-heading">
                Planetary Science Learning Centre
              </h2>
              <p className="section-subheading">
                Beginner-friendly explanations of Mars &amp; Moon terrains, Earth analogue geology, and why scientists study terrestrial deserts to prepare for off-world exploration.
              </p>
            </div>

            {/* Audience Filter Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LEVEL:</span>
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
                {LEARNING_AUDIENCES.map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setSelectedAudience(aud.id)}
                    style={{
                      background: selectedAudience === aud.id ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                      color: selectedAudience === aud.id ? '#00d2ff' : 'var(--text-muted)',
                      border: 'none',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: selectedAudience === aud.id ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Modules Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredModules.map((module) => {
              const isExpanded = expandedModuleId === module.id
              const quizAnswer = userQuizAnswers[module.id]
              const isAnswered = quizAnswer !== undefined
              const isCorrect = isAnswered && quizAnswer === module.quizQuestion?.correctAnswer

              return (
                <article
                  key={module.id}
                  className="aerospace-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div
                    onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '28px' }}>{module.icon}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge-source font-mono">{module.audience.toUpperCase()}</span>
                          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{module.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                          {module.title}
                        </h3>
                      </div>
                    </div>
                    <span style={{ fontSize: '18px', color: 'var(--accent-cyan)' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {module.summary}
                  </p>

                  {/* Expanded Reading Section */}
                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid var(--border-faint)', paddingTop: '16px' }}>
                      {module.sections.map((sec, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#00d2ff' }}>
                            {sec.heading}
                          </h4>
                          <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.6 }}>
                            {sec.content}
                          </p>
                        </div>
                      ))}

                      {/* Fun Fact Pill */}
                      {module.funFact && (
                        <div
                          style={{
                            background: 'rgba(234, 179, 8, 0.05)',
                            border: '1px solid rgba(234, 179, 8, 0.25)',
                            padding: '12px 16px',
                            borderRadius: '2px',
                            fontSize: '12.5px',
                            color: '#eab308',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          <span>💡</span>
                          <div>
                            <strong>Fun Discovery Fact:</strong> {module.funFact}
                          </div>
                        </div>
                      )}

                      {/* Interactive Knowledge Check Quiz */}
                      {module.quizQuestion && (
                        <div
                          style={{
                            background: 'var(--bg-void)',
                            border: '1px solid var(--border-subtle)',
                            padding: '16px',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                          }}
                        >
                          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                            ⚡ QUICK KNOWLEDGE CHECK
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                            {module.quizQuestion.question}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {module.quizQuestion.options.map((opt, oIdx) => {
                              const isOptionSelected = quizAnswer === oIdx
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectQuiz(module.id, oIdx)}
                                  style={{
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    borderRadius: '2px',
                                    fontSize: '12.5px',
                                    background: isOptionSelected ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                    color: isOptionSelected ? '#ffffff' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: isOptionSelected ? '#00d2ff' : 'var(--border-faint)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {opt}
                                </button>
                              )
                            })}
                          </div>

                          {isAnswered && (
                            <div
                              style={{
                                marginTop: '4px',
                                padding: '8px 12px',
                                borderRadius: '2px',
                                fontSize: '12px',
                                backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid',
                                borderColor: isCorrect ? '#10b981' : '#f43f5e',
                                color: isCorrect ? '#10b981' : '#f43f5e',
                              }}
                            >
                              <strong>{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong> {module.quizQuestion.explanation}
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

          {/* Planetary Science Glossary */}
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
          SECTION 2: SIMPLIFIED CASE STUDIES (Section 3)
          ==================================================================== */}
      {activeSection === 'stories' && (
        <section className="case-studies-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> FIELD DISCOVERY STORIES
              </div>
              <h2 className="section-heading">
                Research Case Studies Explained in Plain Language
              </h2>
              <p className="section-subheading">
                Real mission engineering stories: how scientists used extreme Earth locations to solve Mars &amp; Moon challenges.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {CASE_STUDIES_SIMPLIFIED.map((study) => (
              <article
                key={study.id}
                className="aerospace-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-source font-mono">{study.targetBody} Mission</span>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>{study.difficulty}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: '6px' }}>
                    {study.title}
                  </h3>

                  <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Mission: {study.mission} &bull; Analogue: {study.analogueSite}
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 210, 255, 0.05)',
                      border: '1px solid rgba(0, 210, 255, 0.2)',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      fontSize: '12.5px',
                      color: 'var(--accent-cyan)',
                      fontWeight: 600,
                      marginBottom: '14px',
                    }}
                  >
                    "{study.heroQuestion}"
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {study.theStory}
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg-void)',
                    padding: '12px',
                    borderRadius: '2px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                  }}
                >
                  <strong style={{ color: '#10b981' }}>KEY TAKEAWAY:</strong>{' '}
                  <span style={{ color: '#c9ccd6' }}>{study.keyTakeaway}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 3: INTERACTIVE 2D/3D ANALOGUE EXPLORER (Existing preserved)
          ==================================================================== */}
      {activeSection === 'explorer' && (
        <section className="interactive-explorer-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> CARTOGRAPHIC GEODESY
              </div>
              <h2 className="section-heading">
                Interactive Planetary &amp; Earth Explorer
              </h2>
              <p className="section-subheading">
                Compare terrestrial analogue environments against Mars MOLA and Moon LOLA topography.
              </p>
            </div>
          </div>

          <div className="aerospace-card" style={{ padding: '20px', overflow: 'hidden' }}>
            <InteractiveMap
              mode="earth"
              locations={ANALOGUE_LOCATIONS}
              activeLocationId={selectedLocationId}
              onSelectLocation={(id) => setSelectedLocationId(id)}
              onEvaluateSite={(id) => {
                if (onNavigate) onNavigate('site-evaluation', { locationId: id })
              }}
              height="440px"
              showLayerSwitcher={true}
              showLegend={true}
            />

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                  {activeLocation.name} ({activeLocation.country})
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Coordinates: {activeLocation.coordinates} &bull; Terrain: {activeLocation.geomorphology?.primaryLandform}
                </div>
              </div>

              <button
                type="button"
                className="btn-aerospace btn-aerospace-cyan"
                onClick={() => onNavigate && onNavigate('site-evaluation', { locationId: activeLocation.id })}
                style={{ padding: '6px 14px', fontSize: '11px' }}
              >
                LAUNCH SITE EVALUATION &rarr;
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 4: PUBLISHED RESEARCH ARCHIVE (Section 5)
          ==================================================================== */}
      {activeSection === 'published' && (
        <section className="published-archive-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">//</span> PUBLIC EVIDENCE REPOSITORY
              </div>
              <h2 className="section-heading">
                Published Community Research &amp; Evaluations
              </h2>
              <p className="section-subheading">
                Formally reviewed and published research contributions from the AEROKRYPT consortium. Only approved materials are visible here.
              </p>
            </div>
            <div className="dataset-notice-chip font-mono">
              <span className="notice-dot" />
              <span>PEER-REVIEWED &amp; APPROVED ONLY</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {publishedContributions.map((pub) => (
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
                    <span className="badge-source font-mono">{pub.targetBody || 'Planetary'} Analogue</span>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Published: {pub.publishedAt || pub.submissionDate || pub.date}
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
                    OFFICIALLY PUBLISHED
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                  {pub.title}
                </h3>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <strong>Contributor:</strong> {pub.researcherName || pub.author || 'AEROKRYPT Contributor'}
                  {pub.affiliation && <span> &bull; {pub.affiliation}</span>}
                </div>

                {pub.findings && (
                  <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.5 }}>
                    <strong>Key Findings:</strong> {pub.findings}
                  </p>
                )}

                {pub.summary && (
                  <p style={{ fontSize: '13px', color: '#c9ccd6', lineHeight: 1.5 }}>
                    <strong>Summary:</strong> {pub.summary}
                  </p>
                )}

                {pub.reviewerComments && (
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
                    <strong>Reviewer Attestation ({pub.reviewerName || 'AEROKRYPT Peer Reviewer'}):</strong> "{pub.reviewerComments}"
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-faint)', paddingTop: '10px', fontSize: '11px' }}>
                  <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                    DOI / Reference: {pub.doiLink || pub.doiReference || 'AEROKRYPT-OPEN-2026'}
                  </span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    Record ID: {pub.id}
                  </span>
                </div>
              </article>
            ))}

            {publishedContributions.length === 0 && (
              <div className="aerospace-card" style={{ padding: '36px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No submissions currently have PUBLISHED status. Researchers can submit new manuscripts in the Researcher Workspace.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
