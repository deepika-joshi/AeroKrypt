export default function HeroSection({ onNavigate, onExploreClick }) {
  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick()
    } else {
      const target = document.getElementById('platform-overview-section')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="aerospace-hero-section" aria-label="AEROKRYPT Mission Hero">
      {/* 1. Cinematic Planetary Background with Animated Subtle Drift */}
      <div className="hero-background-viewport">
        {/* Deep space void & starfield */}
        <div className="hero-stars-layer" />

        {/* Cinematic Martian & Lunar horizon curvature with glowing atmospheric limb */}
        <div className="hero-planetary-horizon" />

        {/* Subtle aerospace telemetry coordinate grid */}
        <div className="hero-telemetry-grid" />

        {/* Vignette & contrast gradations */}
        <div className="hero-vignette-overlay" />
      </div>

      {/* 2. Top Mission Telemetry Header Bar */}
      <div className="hero-telemetry-top font-mono">
        <div className="telemetry-item">
          <span className="telemetry-dot" />
          <span>STATUS: OPERATIONAL</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span className="telemetry-bracket">[</span>
          <span>MARS MOLA &bull; MOON LOLA INTEGRATION</span>
          <span className="telemetry-bracket">]</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span>LAT/LON WGS 84 &bull; AREOID DATUM</span>
        </div>
      </div>

      {/* 3. Central Hero Content */}
      <div className="hero-content-shell">
        <div className="hero-subhead-badge font-mono">
          <span className="badge-prefix">//</span> AEROSPACE PLANETARY SCIENCE &amp; ANALOGUE VALIDATION
        </div>

        <h1 className="hero-title-typography">
          AEROKRYPT
        </h1>

        <p className="hero-tagline-text">
          Validating off-world surface architectures through rigorous terrestrial geodesy,
          peer-reviewed field analogues, and authentic Mars MOLA and Lunar LOLA topography.
        </p>

        {/* SpaceX-Inspired Ghost Buttons */}
        <div className="hero-actions-group">
          <button
            type="button"
            className="btn-aerospace btn-aerospace-solid"
            onClick={handleScrollDown}
          >
            <span>EXPLORE THE PLATFORM</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>

          <button
            type="button"
            className="btn-aerospace"
            onClick={() => onNavigate && onNavigate('site-evaluation')}
          >
            <span>LAUNCH SITE EVALUATION</span>
            <span className="btn-arrow">&rarr;</span>
          </button>

          <button
            type="button"
            className="btn-aerospace btn-aerospace-cyan"
            onClick={() => onNavigate && onNavigate('location-explorer')}
          >
            <span>LOCATION EXPLORE</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 12 8" />
            </svg>
          </button>
        </div>

        {/* 4. Bottom Hero Metrics Strip */}
        <div className="hero-metrics-strip font-mono">
          <div className="metric-cell">
            <div className="metric-number">06</div>
            <div className="metric-desc">AUDITED EARTH SITES</div>
          </div>
          <div className="metric-divider" />
          <div className="metric-cell">
            <div className="metric-number">11</div>
            <div className="metric-desc">PLANETARY TERRAINS</div>
          </div>
          <div className="metric-divider" />
          <div className="metric-cell">
            <div className="metric-number">05</div>
            <div className="metric-desc">CONOPS PROTOCOLS</div>
          </div>
          <div className="metric-divider" />
          <div className="metric-cell">
            <div className="metric-number">100%</div>
            <div className="metric-desc">VERIFIED PROVENANCE</div>
          </div>
        </div>
      </div>

      {/* 5. Minimalist Scroll Indicator */}
      <div
        className="hero-scroll-indicator"
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleScrollDown()
        }}
        aria-label="Scroll to exploration sections"
      >
        <span className="scroll-label font-mono">SCROLL</span>
        <div className="scroll-arrow-line">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  )
}

