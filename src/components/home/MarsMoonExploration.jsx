import { useState } from 'react'
import { Link } from 'react-router-dom'
import MarsSurfaceVisual from './MarsSurfaceVisual.jsx'
import MoonSurfaceVisual from './MoonSurfaceVisual.jsx'

export default function MarsMoonExploration({
  selectedPlanet = 'mars',
  onSelectPlanet,
  onNavigate,
}) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null)

  const handleCardSelect = (planet) => {
    if (onSelectPlanet) {
      onSelectPlanet(planet)
    }
  }

  const handleNavigateTarget = (targetBody) => {
    if (onNavigate) {
      onNavigate('site-evaluation', { targetBody })
    }
  }

  return (
    <section id="mars-moon-exploration" className="mars-moon-section reveal-on-scroll" aria-label="Mars and Moon Exploration">
      <div className="mars-moon-container">
        {/* Section Header */}
        <div className="mars-moon-header">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> TARGET CELESTIAL BODIES
          </div>
          <h2 className="mars-moon-main-title">
            <span className="serif-highlight">Two Worlds.</span> Endless Discoveries.
          </h2>
          <p className="mars-moon-subhead">
            Comparative planetary terrain analysis powered by orbital laser altimetry, high-resolution imaging,
            and audited Earth field proxies.
          </p>
          <div className="research-focus-tag font-mono">
            <span className="focus-dot" />
            <span>Our Research Focus &bull; Mars &amp; Lunar Analogue Science</span>
          </div>
        </div>

        {/* Two Large Side-by-Side Cinematic Planetary Cards Grid */}
        <div className="planetary-cards-duo">
          {/* ================= MARS CARD (LEFT) ================= */}
          <div
            className={`cinematic-planetary-card card-mars ${selectedPlanet === 'mars' ? 'is-active-card' : ''} ${hoveredPlanet === 'mars' ? 'is-card-hovered' : ''}`}
            onMouseEnter={() => setHoveredPlanet('mars')}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handleCardSelect('mars')}
            role="button"
            tabIndex={0}
            aria-label="Select Mars Environment"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardSelect('mars')
              }
            }}
          >
            <div className="card-ambient-aura mars-aura" aria-hidden="true" />

            {/* Visual Viewport with Original Animated Mars Surface */}
            <div className="card-visual-viewport mars-viewport">
              <MarsSurfaceVisual
                isHovered={hoveredPlanet === 'mars'}
                isActive={selectedPlanet === 'mars'}
              />
              <div className="card-telemetry-overlay font-mono">
                <span className="telemetry-badge-mars">TARGET: MARS // AREOID DATUM</span>
                <span className="telemetry-coords">18.38°N, 77.58°E</span>
              </div>
            </div>

            {/* Card Content Block */}
            <div className="card-content-block">
              <div className="card-eyebrow-row font-mono">
                <span className="body-tag mars-tag">RED PLANET</span>
                <span className="datum-tag">MOLA MEGDR L3 &bull; 0.380G</span>
              </div>

              <h3 className="planetary-card-heading mars-heading">
                Explore Mars
              </h3>

              <p className="planetary-card-intro">
                Investigate hyper-arid terrains, ancient lacustrine clay basins, and polar permafrost polygons
                analogous to Jezero Crater Delta, Gale Crater, and Valles Marineris canyon networks.
              </p>

              <div className="planetary-spec-list font-mono">
                <div className="spec-item">
                  <span className="spec-label">Atmosphere</span>
                  <span className="spec-value">610 Pa (CO₂-dominated)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Surface Gravity</span>
                  <span className="spec-value">0.380G (3.72 m/s²)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Key Terrestrial Analogues</span>
                  <span className="spec-value">Atacama, McMurdo, Svalbard</span>
                </div>
              </div>

              <div className="card-cta-row">
                <Link
                  to="/assessment"
                  state={{ targetBody: 'Mars' }}
                  className="btn-discover-mars font-mono"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigateTarget('Mars')
                  }}
                >
                  <span>Discover Mars</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/locations"
                  state={{ targetFilter: 'mars' }}
                  className="btn-secondary-link font-mono"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) onNavigate('location-explorer')
                  }}
                >
                  View 13 Mars Analogues &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* ================= MOON CARD (RIGHT) ================= */}
          <div
            className={`cinematic-planetary-card card-moon ${selectedPlanet === 'moon' ? 'is-active-card' : ''} ${hoveredPlanet === 'moon' ? 'is-card-hovered' : ''}`}
            onMouseEnter={() => setHoveredPlanet('moon')}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handleCardSelect('moon')}
            role="button"
            tabIndex={0}
            aria-label="Select Moon Environment"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardSelect('moon')
              }
            }}
          >
            <div className="card-ambient-aura moon-aura" aria-hidden="true" />

            {/* Visual Viewport with Original Animated Moon Surface */}
            <div className="card-visual-viewport moon-viewport">
              <MoonSurfaceVisual
                isHovered={hoveredPlanet === 'moon'}
                isActive={selectedPlanet === 'moon'}
              />
              <div className="card-telemetry-overlay font-mono">
                <span className="telemetry-badge-moon">TARGET: MOON // MEAN LUNAR SPHERE</span>
                <span className="telemetry-coords">89.9°S, 0.0°E</span>
              </div>
            </div>

            {/* Card Content Block */}
            <div className="card-content-block">
              <div className="card-eyebrow-row font-mono">
                <span className="body-tag moon-tag">LUNAR SURFACE</span>
                <span className="datum-tag">LOLA GDR &bull; 0.166G</span>
              </div>

              <h3 className="planetary-card-heading moon-heading">
                Explore the Moon
              </h3>

              <p className="planetary-card-intro">
                Evaluate anorthositic crustal highlands, permanently shadowed polar craters, and subterranean
                basaltic pyroducts analogous to Shackleton Crater, Oceanus Procellarum, and Hadley Rille.
              </p>

              <div className="planetary-spec-list font-mono">
                <div className="spec-item">
                  <span className="spec-label">Atmosphere</span>
                  <span className="spec-value">10⁻¹⁰ Pa (Hard Vacuum)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Surface Gravity</span>
                  <span className="spec-value">0.166G (1.62 m/s²)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Key Terrestrial Analogues</span>
                  <span className="spec-value">Haughton, Kīlauea, Mistastin</span>
                </div>
              </div>

              <div className="card-cta-row">
                <Link
                  to="/assessment"
                  state={{ targetBody: 'Moon' }}
                  className="btn-discover-moon font-mono"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigateTarget('Moon')
                  }}
                >
                  <span>Discover the Moon</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/locations"
                  state={{ targetFilter: 'moon' }}
                  className="btn-secondary-link font-mono"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) onNavigate('location-explorer')
                  }}
                >
                  View 13 Moon Analogues &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
