import { useState } from 'react'

export default function AboutAeroKrypt() {
  const [activeStep, setActiveStep] = useState(0)

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
    <section id="about-aerokrypt" className="about-aerokrypt-section" aria-label="About AeroKrypt Platform">
      <div className="about-editorial-container">
        {/* Section Header */}
        <div className="about-header-block">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> PLATFORM MISSION &amp; FOUNDATION
          </div>
          <h2 className="about-main-heading">
            Understanding <span className="serif-highlight">Worlds Beyond Our Own.</span>
          </h2>
          <p className="about-lead-description">
            A unified platform for exploring planetary environments, studying Earth analogue locations and
            understanding the conditions of other worlds.
          </p>
        </div>

        {/* Two-Column Editorial Storytelling Grid */}
        <div className="about-twocol-grid">
          {/* Left Column: Scientific Narrative */}
          <div className="about-narrative-col">
            <div className="narrative-paragraph-card">
              <span className="narrative-tag font-mono">01 / THE ANALOGUE PARADOX</span>
              <h3 className="narrative-subheading">Why Earth Proving Grounds Matter</h3>
              <p className="narrative-body">
                Before robotic rovers or human crews venture millions of kilometers into the solar system,
                scientific payloads, autonomous navigation systems, and astrobiological sample acquisition protocols
                must be rigorously proven in extreme environments on Earth.
              </p>
              <p className="narrative-body">
                From the hyper-arid core of the Atacama Desert to the high-arctic impact breccias of Devon Island,
                Earth hosts extraordinary geographical analogues that mirror the terrain, mineralogy, and physical
                stresses of Mars and the Moon.
              </p>
            </div>

            <div className="narrative-paragraph-card">
              <span className="narrative-tag font-mono">02 / RIGOROUS SCIENTIFIC BOUNDARIES</span>
              <h3 className="narrative-subheading">Separating Geological from Operational Fidelity</h3>
              <p className="narrative-body">
                AeroKrypt rejects arbitrary composite scoring and synthetic telemetry. Instead, our platform
                maintains strict dual-domain evaluation: isolating geological similarity (mineralogy, desiccation,
                impact morphology) from mechanical operational suitability (slope, vehicle traction, obstacle clearance).
              </p>
              <div className="narrative-metrics-pill font-mono">
                <span className="pill-item">20 AUDITED SITES</span>
                <span className="pill-dot">&bull;</span>
                <span className="pill-item">NASA PDS4 MOLA</span>
                <span className="pill-dot">&bull;</span>
                <span className="pill-item">USGS 3DEP</span>
              </div>
            </div>
          </div>

          {/* Right Column: Planetary Portal Diagram & Visual Showcase */}
          <div className="about-visual-col">
            <div className="planetary-portal-card">
              <div className="portal-header font-mono">
                <span className="portal-badge">// GEODETIC REFERENCE ARCHITECTURE</span>
                <span className="portal-indicator">ACTIVE</span>
              </div>

              {/* Graphical schematic connecting Earth, Mars, and Moon */}
              <div className="portal-schematic-wrapper">
                <div className="schematic-target-card earth-card">
                  <div className="schematic-badge font-mono">ORIGIN BASELINE</div>
                  <div className="schematic-body-title">TERRESTRIAL PROVING GROUNDS</div>
                  <div className="schematic-meta font-mono">1.000G &bull; 101.3 kPa &bull; WGS 84 Ellipsoid</div>
                  <p className="schematic-desc">
                    20 curated and audited field analogues: hyper-arid basins, permafrost polygons, basaltic lava tubes.
                  </p>
                </div>

                <div className="schematic-vector-arrow font-mono">
                  <span>&darr; DUAL-DOMAIN COMPARATIVE ALTIMETRY &darr;</span>
                </div>

                <div className="schematic-dual-targets">
                  <div className="schematic-target-card mars-target">
                    <div className="schematic-badge mars-badge font-mono">TARGET // MARS</div>
                    <div className="schematic-body-title">MOLA AREOID DATUM</div>
                    <div className="schematic-meta font-mono">0.380G &bull; 610 Pa &bull; R = 3,389.5 km</div>
                    <p className="schematic-desc">
                      Jezero delta, Gale, and Valles Marineris altimetry derived from NASA MGS MOLA MEGDR L3.
                    </p>
                  </div>

                  <div className="schematic-target-card moon-target">
                    <div className="schematic-badge moon-badge font-mono">TARGET // MOON</div>
                    <div className="schematic-body-title">LOLA SPHERICAL DATUM</div>
                    <div className="schematic-meta font-mono">0.166G &bull; 10⁻¹⁰ Pa &bull; R = 1,737.4 km</div>
                    <p className="schematic-desc">
                      Highland craters, Shackleton polar rim, and lava tubes derived from NASA LRO LOLA GDR.
                    </p>
                  </div>
                </div>
              </div>

              <div className="portal-footer font-mono">
                <span className="footer-tag">STATUS: 100% AUDITED SCIENTIFIC BASELINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Operational Workflow (How It Works) */}
        <div id="how-it-works" className="about-workflow-container">
          <div className="workflow-header-row">
            <div className="workflow-title-group">
              <span className="section-eyebrow font-mono">// STEP-BY-STEP CONOPS</span>
              <h3 className="workflow-main-title">How It Works</h3>
              <p className="workflow-subhead">
                A structured, four-phase scientific workflow to discover, analyze, and document planetary analogues.
              </p>
            </div>
            <div className="workflow-nav-dots font-mono">
              {workflowSteps.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  className={`dot-btn ${activeStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  aria-label={`View step ${s.step}`}
                >
                  {s.step}
                </button>
              ))}
            </div>
          </div>

          <div className="workflow-cards-grid">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.step}
                className={`workflow-step-card ${activeStep === idx ? 'is-focused' : ''}`}
                onClick={() => setActiveStep(idx)}
                role="group"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveStep(idx)
                  }
                }}
              >
                <div className="step-card-header font-mono">
                  <span className="step-number">{step.step}</span>
                  <span className="step-tag">{step.tag}</span>
                </div>
                <div className="step-icon-wrapper" aria-hidden="true">
                  {step.icon}
                </div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.description}</p>
                <p className="step-detail">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
