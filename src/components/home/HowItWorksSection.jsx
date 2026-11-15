export default function HowItWorksSection() {
  const workflowSteps = [
    {
      step: '01',
      title: 'Select a Research Objective',
      description: 'The researcher identifies the planetary body, experiment or mission objective.',
      tag: 'OBJECTIVE & TARGET',
      detail: 'Choose between Mars or the Moon, and define operational testing parameters (rover mobility, life detection, drill coring, or shelter engineering).',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Discover Analogue Locations',
      description: 'Explore potential terrestrial locations relevant to the selected research objective.',
      tag: 'GEOSPATIAL DISCOVERY',
      detail: 'Filter audited Earth sites by mineralogy, terrain morphology, elevation datums, and documented operational readiness.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Assess and Compare',
      description: 'Compare terrain, geological characteristics, available measurements and research evidence.',
      tag: 'SCIENTIFIC COMPARISON',
      detail: 'Execute dual-domain assessments: separate geological similarity from vehicle operational suitability against Mars MOLA and Moon LOLA topography.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Document Research',
      description: 'Use the Research Hub to organise observations, evaluations and research records.',
      tag: 'OPERATION DOSSIER',
      detail: 'Save evaluation dossiers, link peer-reviewed DOI citations, export standardized field reports, and manage verified research records.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ]

  return (
    <section id="how-it-works" className="home-content-section" aria-label="How It Works">
      <div className="section-header-block">
        <div className="section-eyebrow font-mono">
          <span className="accent-glyph">//</span> RESEARCH PROTOCOL
        </div>
        <h2 className="section-main-title">
          How It Works
        </h2>
        <p className="section-lead-text">
          A clear, structured workflow guiding planetary researchers from mission objective definition to verified field documentation.
        </p>
      </div>

      <div className="workflow-steps-layout">
        {workflowSteps.map((stepItem, idx) => (
          <div key={stepItem.step} className="workflow-step-card aerospace-card">
            <div className="step-card-header">
              <div className="step-number-tag font-mono">
                <span className="step-label">STEP</span>
                <span className="step-num">{stepItem.step}</span>
              </div>
              <div className="step-icon-wrap" aria-hidden="true">
                {stepItem.icon}
              </div>
            </div>

            <div className="step-connector-rail" aria-hidden="true">
              <div className="connector-dot" />
              {idx < workflowSteps.length - 1 && <div className="connector-line" />}
            </div>

            <div className="step-card-body">
              <span className="step-phase-tag font-mono">{stepItem.tag}</span>
              <h3 className="step-title">{stepItem.title}</h3>
              <p className="step-desc-primary">{stepItem.description}</p>
              <p className="step-desc-detail">{stepItem.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
