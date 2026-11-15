export default function HeroSection({ onExploreClick, onLearnClick }) {
  const handleExploreClick = () => {
    if (onExploreClick) {
      onExploreClick()
    } else {
      const target = document.getElementById('explore-platform')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleLearnClick = () => {
    if (onLearnClick) {
      onLearnClick()
    } else {
      const target = document.getElementById('how-it-works')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="aerospace-hero-section" aria-label="AEROKRYPT Platform Hero">
      {/* 1. Large Cinematic Planetary Background */}
      <div className="hero-background-viewport" aria-hidden="true">
        {/* Deep space void & starfield */}
        <div className="hero-stars-layer" />

        {/* Cinematic landscape & planetary horizon */}
        <div className="hero-cinematic-backdrop" />
        <div className="hero-planetary-horizon" />

        {/* Telemetry coordinate grid */}
        <div className="hero-telemetry-grid" />

        {/* Contrast vignette & atmospheric gradient */}
        <div className="hero-vignette-overlay" />
      </div>

      {/* 2. Top Mission Telemetry Bar */}
      <div className="hero-telemetry-top font-mono">
        <div className="telemetry-item">
          <span className="telemetry-dot" aria-hidden="true" />
          <span>MISSION TELEMETRY: NOMINAL</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span className="telemetry-bracket">[</span>
          <span>PLANETARY ANALOGUE RESEARCH CONSORTIUM</span>
          <span className="telemetry-bracket">]</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span>MARS MOLA &bull; MOON LOLA INTEGRATION</span>
        </div>
      </div>

      {/* 3. Central Hero Content (Single Unified Platform Introduction) */}
      <div className="hero-content-shell">
        <div className="hero-subhead-badge font-mono">
          <span className="badge-prefix">//</span> PLANETARY SCIENCE &amp; ANALOGUE VALIDATION
        </div>

        {/* Exact Main Headline */}
        <h1 className="hero-title-typography">
          Evaluate Earth Sites for Mars and Moon Research
        </h1>

        {/* Exact Supporting Description */}
        <p className="hero-tagline-text">
          AEROKRYPT is a planetary analogue research platform that helps researchers discover terrestrial environments, compare their geological and terrain characteristics with Mars and the Moon, and assess their relevance using available scientific evidence.
        </p>

        {/* Exactly Two Hero Actions */}
        <div className="hero-actions-group">
          {/* Action 1: Explore the Platform */}
          <button
            type="button"
            className="btn-aerospace btn-aerospace-solid"
            onClick={handleExploreClick}
          >
            <span>Explore the Platform</span>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>

          {/* Action 2: Learn How It Works */}
          <button
            type="button"
            className="btn-aerospace"
            onClick={handleLearnClick}
          >
            <span>Learn How It Works</span>
            <span className="btn-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      {/* 4. Minimalist Bottom Scroll Cue */}
      <div
        className="hero-scroll-indicator"
        onClick={handleExploreClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleExploreClick()
        }}
        aria-label="Scroll to Explore the Platform"
      >
        <span className="scroll-label font-mono">SCROLL TO EXPLORE</span>
        <div className="scroll-arrow-line">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  )
}
