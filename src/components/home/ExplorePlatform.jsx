import { Link } from 'react-router-dom'

export default function ExplorePlatform({ onNavigate }) {
  const platformFeatures = [
    {
      id: 'location-explorer',
      path: '/locations',
      index: '01',
      title: 'Location Explore',
      subtitle: 'GEODETIC & SITES DIRECTORY',
      description: 'Discover Earth locations and geographical environments relevant to planetary research.',
      details: 'Explore 20 curated analogue locations across 6 continents, complete with coordinate datums, verified photography, and lithological classifications.',
      badge: 'TERRESTRIAL PROVING GROUNDS',
      actionLabel: 'Explore Locations',
      accentColor: '#D6A66B',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      subtitle: 'DUAL-DOMAIN TERRAIN EVALUATION',
      description: 'Explore and evaluate terrestrial environments that resemble Mars and Moon terrain.',
      details: 'Compare topography and slope metrics against NASA MOLA MEGDR and Moon LOLA GDR datasets while separating geological from operational suitability.',
      badge: 'MOLA & LOLA COMPARISON',
      actionLabel: 'Assess Sites',
      accentColor: '#A94C34',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      subtitle: 'FIELD OPERATIONS & RECORDS',
      description: 'Access research resources, scientific knowledge and planetary exploration studies.',
      details: 'Search peer-reviewed DOI citations, query the planetary experiment database, review operational dossiers, and manage verified research records.',
      badge: 'PEER-REVIEWED ARCHIVE',
      actionLabel: 'Access Research',
      accentColor: '#D6A66B',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      subtitle: 'EDUCATION & MISSION EXPLORATION',
      description: 'Explore planetary science through accessible educational experiences.',
      details: 'Engage with planetary exploration instruments, interactive educational modules, Mars and Moon mission stories, and published field discoveries.',
      badge: 'PUBLIC SCIENCE & EDUCATION',
      actionLabel: 'Public Discovery',
      accentColor: '#AEBAC8',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    <section id="explore-platform" className="explore-platform-section" aria-label="Explore the Platform">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header-block">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> CORE PLATFORM ARCHITECTURE
          </div>
          <h2 className="features-main-heading">
            Explore the Platform
          </h2>
          <p className="features-subheading">
            Everything you need to discover, investigate and understand planetary environments.
          </p>
        </div>

        {/* 4 Large Feature Cards Grid */}
        <div className="features-cards-grid">
          {platformFeatures.map((feat) => (
            <div
              key={feat.id}
              className="premium-feature-card"
              onClick={() => handleCardClick(feat.id)}
              role="group"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCardClick(feat.id)
                }
              }}
            >
              {/* Card Header with Index & Badge */}
              <div className="card-top-row">
                <span className="card-index-tag font-mono">{feat.index}</span>
                <span className="card-badge font-mono">{feat.badge}</span>
              </div>

              {/* Icon & Title */}
              <div className="card-icon-title-group">
                <div className="card-icon-container" aria-hidden="true">
                  {feat.icon}
                </div>
                <h3 className="card-main-title">{feat.title}</h3>
                <span className="card-sub-tag font-mono">{feat.subtitle}</span>
              </div>

              {/* Primary Prompt Description */}
              <p className="card-primary-description">
                {feat.description}
              </p>

              {/* Extended Technical Details */}
              <p className="card-detail-body">
                {feat.details}
              </p>

              {/* Explore Button Action */}
              <div className="card-action-row">
                <Link
                  to={feat.path}
                  className="card-explore-btn font-mono"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(feat.id)
                  }}
                >
                  <span>{feat.actionLabel}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
