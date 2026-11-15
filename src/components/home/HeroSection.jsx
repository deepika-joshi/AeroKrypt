import { useState } from 'react'
import AnimatedPlanetaryHero from './AnimatedPlanetaryHero.jsx'

export default function HeroSection({
  onExploreClick,
  onLearnClick,
  onMarsClick,
  onMoonClick,
}) {
  const [activePlanet, setActivePlanet] = useState('mars')

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
      const target = document.getElementById('about-aerokrypt') || document.getElementById('how-it-works')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleSelectMars = () => {
    setActivePlanet('mars')
    if (onMarsClick) {
      onMarsClick()
    }
  }

  const handleSelectMoon = () => {
    setActivePlanet('moon')
    if (onMoonClick) {
      onMoonClick()
    }
  }

  return (
    <section
      className={`aerospace-hero-section theme-mode-${activePlanet}`}
      aria-label="AEROKRYPT Cinematic Planetary Hero"
    >
      {/* 1. Deep Space Cinematic Atmospheric Layers */}
      <div className="hero-background-viewport" aria-hidden="true">
        {/* Deep space void & layered starfield */}
        <div className="hero-stars-layer" />
        <div className="hero-deep-void" />

        {/* Dynamic planetary atmosphere nebular aura */}
        <div className={`hero-nebula-atmosphere nebula-${activePlanet}`} />

        {/* Subtle geometric telemetry grid */}
        <div className="hero-telemetry-grid" />

        {/* Edge vignette */}
        <div className="hero-vignette-overlay" />
      </div>

      {/* 2. Top Mission Telemetry Bar */}
      <div className="hero-telemetry-top font-mono">
        <div className="telemetry-item">
          <span className="telemetry-dot" aria-hidden="true" />
          <span>MISSION CONOPS: NOMINAL</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span className="telemetry-bracket">[</span>
          <span>PLANETARY EXPLORATION CONSORTIUM</span>
          <span className="telemetry-bracket">]</span>
        </div>
        <div className="telemetry-item hide-mobile">
          <span className="telemetry-accent">
            {activePlanet === 'mars' ? 'MARS MOLA MEGDR // IAU 2000' : 'MOON LOLA GDR // IAU 2000'}
          </span>
        </div>
      </div>

      {/* 3. Main Hero Two-Column Grid */}
      <div className="hero-editorial-container">
        {/* Left Column: Premium Typography & Actions */}
        <div className="hero-copy-column">
          {/* Eyebrow Label & Capability Tag */}
          <div className="hero-label-group">
            <span className="hero-category-label font-mono">
              <span className="label-prefix">//</span> PLANETARY EXPLORATION PLATFORM
            </span>
            <span className="hero-capability-badge font-mono">
              Evaluate Earth Sites for Mars and Moon Research
            </span>
          </div>

          {/* Large Hero Headline */}
          <h1 className="hero-headline-typography">
            Explore <span className="headline-serif-italic">Beyond Earth.</span>
          </h1>

          {/* Clean Description */}
          <p className="hero-editorial-description">
            Discover planetary environments, explore Earth analogue locations and experience the science
            behind Mars and Moon exploration through one unified platform.
          </p>

          {/* 3 Primary CTA Buttons + Learn Trigger */}
          <div className="hero-cta-button-group">
            {/* CTA 1: Explore the Platform */}
            <button
              type="button"
              className="btn-hero-primary"
              onClick={handleExploreClick}
              aria-label="Explore the Platform"
            >
              <span className="btn-text">Explore the Platform</span>
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

            {/* CTA 2: Explore Mars */}
            <button
              type="button"
              className={`btn-hero-mars ${activePlanet === 'mars' ? 'is-selected' : ''}`}
              onClick={handleSelectMars}
              aria-label="Explore Mars Planetary Environment"
            >
              <span className="btn-indicator mars-indicator" aria-hidden="true" />
              <span className="btn-text">Explore Mars</span>
            </button>

            {/* CTA 3: Explore Moon */}
            <button
              type="button"
              className={`btn-hero-moon ${activePlanet === 'moon' ? 'is-selected' : ''}`}
              onClick={handleSelectMoon}
              aria-label="Explore Moon Planetary Environment"
            >
              <span className="btn-indicator moon-indicator" aria-hidden="true" />
              <span className="btn-text">Explore Moon</span>
            </button>

            {/* Learn trigger */}
            <button
              type="button"
              className="btn-hero-learn font-mono"
              onClick={handleLearnClick}
              aria-label="Learn How AeroKrypt Works"
            >
              <span>Learn How It Works &darr;</span>
            </button>
          </div>

          {/* Quick Body Stats Indicator */}
          <div className="hero-target-status font-mono">
            <span className="status-indicator-dot" aria-hidden="true" />
            <span className="status-text">
              CURRENT FOCUS: {activePlanet === 'mars' ? 'MARS (0.380G // 610 PA)' : 'MOON (0.166G // 10⁻¹⁰ PA)'}
            </span>
          </div>
        </div>

        {/* Right Column: Layered Animated Mars and Moon Planetary Stage */}
        <div className="hero-planet-visual-column">
          <AnimatedPlanetaryHero
            activePlanet={activePlanet}
            onSelectPlanet={(planet) => {
              setActivePlanet(planet)
              if (planet === 'mars' && onMarsClick) onMarsClick()
              if (planet === 'moon' && onMoonClick) onMoonClick()
            }}
          />
        </div>
      </div>
    </section>
  )
}
