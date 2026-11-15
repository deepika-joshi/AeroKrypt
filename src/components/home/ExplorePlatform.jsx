import { Link } from 'react-router-dom'

export default function ExplorePlatform({ onNavigate }) {
  const platformFeatures = [
    {
      id: 'location-explorer',
      path: '/locations',
      index: '01',
      title: 'Location Explore',
      explanation: 'Discover terrestrial locations that may serve as analogues for Mars and Moon research.',
      badge: 'GEOSPATIAL & SITES',
      actionLabel: 'Explore Locations',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      id: 'site-evaluation',
      path: '/assessment',
      index: '02',
      title: 'Analogue Site Assessment',
      explanation: 'Compare Earth locations with planetary terrain, geological characteristics, research requirements and available evidence.',
      badge: 'TERRAIN EVALUATION',
      actionLabel: 'Assess Sites',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      ),
    },
    {
      id: 'research-hub',
      path: '/research',
      index: '03',
      title: 'Research Hub',
      explanation: 'Organise research projects, observations, measurements and saved evaluations.',
      badge: 'FIELD OPERATIONS',
      actionLabel: 'Open Research Hub',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="M6 14h6" />
        </svg>
      ),
    },
    {
      id: 'public-discovery',
      path: '/discovery',
      index: '04',
      title: 'Public Discovery',
      explanation: 'Explore planetary science instruments, learning resources, case studies and published research.',
      badge: 'PUBLIC SCIENCE',
      actionLabel: 'Explore Public Discovery',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ]

  const handleCardClick = (targetId) => {
    if (onNavigate) {
      onNavigate(targetId)
    }
  }

  return (
    <section id="explore-platform" className="home-content-section" aria-label="Explore the Platform">
      <div className="section-header-block">
        <div className="section-eyebrow font-mono">
          <span className="accent-glyph">//</span> CORE SUBSYSTEMS
        </div>
        <h2 className="section-main-title">
          Explore the Platform
        </h2>
        <p className="section-lead-text">
          Direct access to the core planetary exploration and scientific evaluation modules of AEROKRYPT.
        </p>
      </div>

      <div className="platform-features-grid">
        {platformFeatures.map((feat) => (
          <div
            key={feat.id}
            className="feature-module-card aerospace-card"
            onClick={() => handleCardClick(feat.id)}
            role="group"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(feat.id)
              }
            }}
          >
            <div className="feature-card-header">
              <div className="feature-icon-box" aria-hidden="true">
                {feat.icon}
              </div>
              <div className="feature-meta font-mono">
                <span className="feature-index">{feat.index}</span>
                <span className="feature-badge">{feat.badge}</span>
              </div>
            </div>

            <div className="feature-card-content">
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.explanation}</p>
            </div>

            <div className="feature-card-footer">
              <Link
                to={feat.path}
                className="feature-action-link font-mono"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onNavigate) onNavigate(feat.id)
                }}
              >
                <span>{feat.actionLabel}</span>
                <span className="action-arrow" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
