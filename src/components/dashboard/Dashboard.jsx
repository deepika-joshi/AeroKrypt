import HeroSection from '../home/HeroSection.jsx'
import PlatformOverview from './PlatformOverview.jsx'
import FeaturedLocations from './FeaturedLocations.jsx'
import PlanetaryOverview from './PlanetaryOverview.jsx'
import RecentExperiments from './RecentExperiments.jsx'
import ResearchActivity from './ResearchActivity.jsx'
import DataSourcesCard from './DataSourcesCard.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'

export default function Dashboard({ onNavigate, searchQuery = '' }) {
  const containerRef = useScrollReveal({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  const mainModules = [
    {
      id: 'location-explorer',
      idx: '02',
      title: 'Location Explore',
      description: 'Interactive map and geospatial filtering of 6 global Earth analogue research locations.',
      tag: 'Interactive Map & Geodesy',
      icon: '🌍',
    },
    {
      id: 'site-evaluation',
      idx: '03',
      title: 'Site Evaluation',
      description: 'Unified planetary comparison: evaluate Mars MOLA & Moon LOLA against Earth candidate sites.',
      tag: 'Scientific Terrain Assessment',
      icon: '🪐',
    },
    {
      id: 'research-hub',
      idx: '04',
      title: 'Research Hub',
      description: 'Unified Experiment Database, Research Records registry, and Researcher Workspace.',
      tag: 'Field Operations & Protocols',
      icon: '🔬',
    },
    {
      id: 'public-discovery',
      idx: '05',
      title: 'Public Discovery',
      description: 'Educational exploration for students & public to discover planetary science on Earth.',
      tag: 'Public Exploration',
      icon: '🚀',
    },
  ]

  return (
    <div className="aerospace-dashboard-root" ref={containerRef}>
      {/* 1. Cinematic Full-Screen Aerospace Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Platform Overview Body */}
      <div id="platform-overview-section" className="dashboard-content-stream">
        {/* Section 01: Platform KPI Metrics */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Platform Telemetry & Metrics">
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">01 //</span> PLATFORM TELEMETRY &amp; METRICS
              </div>
              <h2 className="section-heading">
                Operational Analogue Archive
              </h2>
              <p className="section-subheading">
                Real project metrics cataloged across Earth field sites, planetary terrain datasets, and ConOps protocols.
              </p>
            </div>
            <div className="dataset-notice-chip font-mono">
              <span className="notice-dot" />
              <span>AUTHENTIC PROJECT DATA</span>
            </div>
          </div>
          <PlatformOverview onNavigate={onNavigate} />
        </section>

        {/* Section 02: Exploration Modules Grid */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Main Modules Navigation">
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">02 //</span> MISSION ARCHITECTURE
              </div>
              <h2 className="section-heading">
                Exploration &amp; Evaluation Modules
              </h2>
              <p className="section-subheading">
                Direct access to the core scientific workflows of the AEROKRYPT platform.
              </p>
            </div>
          </div>

          <div className="modules-aerospace-grid">
            {mainModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => onNavigate && onNavigate(mod.id)}
                className="module-aerospace-card aerospace-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (onNavigate) {
                      onNavigate(mod.id)
                    }
                  }
                }}
              >
                <div className="module-card-top">
                  <div className="module-header-meta">
                    <span className="module-idx font-mono">{mod.idx}</span>
                    <span className="module-tag font-mono">{mod.tag}</span>
                  </div>
                  <div className="module-icon-wrap" aria-hidden="true">{mod.icon}</div>
                </div>

                <div className="module-card-body">
                  <h3 className="module-card-title">{mod.title}</h3>
                  <p className="module-card-desc">{mod.description}</p>
                </div>

                <div className="module-card-footer font-mono">
                  <span>LAUNCH SUBSYSTEM</span>
                  <span className="footer-arrow">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 03: Featured Earth Analogue Field Sites */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Earth Analogue Field Sites">
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">03 //</span> TERRESTRIAL GEODESY
              </div>
              <h2 className="section-heading">
                Featured Earth Analogue Sites
              </h2>
            </div>
          </div>
          <FeaturedLocations onNavigate={onNavigate} searchQuery={searchQuery} />
        </section>

        {/* Section 04: Planetary Terrain Repositories */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Planetary Terrain Datasets">
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">04 //</span> ORBITAL TOPOGRAPHY
              </div>
              <h2 className="section-heading">
                Planetary Terrain Repositories (Mars &amp; Moon)
              </h2>
            </div>
          </div>
          <PlanetaryOverview onNavigate={onNavigate} />
        </section>

        {/* Section 05: Two-Column Operations & Research Records */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Mission Protocols and Research Activity">
          <div className="section-header-row">
            <div>
              <div className="aerospace-label">
                <span className="aerospace-label-accent">05 //</span> OPERATIONS &amp; RECORDS
              </div>
              <h2 className="section-heading">
                Testing Protocols &amp; Field Records
              </h2>
            </div>
          </div>
          <div className="dashboard-dual-column">
            <RecentExperiments onNavigate={onNavigate} searchQuery={searchQuery} />
            <ResearchActivity onNavigate={onNavigate} searchQuery={searchQuery} />
          </div>
        </section>

        {/* Section 06: External Datasets & PDS/USGS Specifications */}
        <section className="dashboard-section reveal-on-scroll" aria-label="Authoritative Datasets Archive">
          <DataSourcesCard />
        </section>
      </div>
    </div>
  )
}
