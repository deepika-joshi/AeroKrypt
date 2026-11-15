import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SimulationPreviewSection({ onNavigate }) {
  const [targetBody, setTargetBody] = useState('Mars')
  const navigate = useNavigate()

  const simulationPresets = {
    Mars: {
      title: 'Mars Jezero Crater Delta & Lacustrine Plain',
      region: 'Syrtis Major Quadrangle // 18.38°N, 77.58°E',
      datum: 'MOLA Gravitational Areoid (U₀ = 12,637,273 m²/s²)',
      elevationRange: '-2,680 m to -2,150 m (530 m local relief)',
      slopeRange: '0.5° to 28.0° (Mean: 5.2°)',
      terrainClass: 'Stratified sedimentary delta fan & basaltic crater floor',
      analogueProxy: 'Atacama Desert Playa & Lake Thetis Microbialites',
      accentColor: '#A94C34',
      bgClass: 'sim-bg-mars',
    },
    Moon: {
      title: 'Moon South Pole Shackleton Crater Rim',
      region: 'South Pole-Aitken Basin Rim // 89.9°S, 0.0°E',
      datum: 'LOLA Reference Sphere (R = 1,737.40 km)',
      elevationRange: '+1,120 m rim to -3,080 m floor (4,200 m relief)',
      slopeRange: '2.0° to 38.0° (Steep inner crater walls)',
      terrainClass: 'Permanently Shadowed Region (PSR) & ultra-cold trap',
      analogueProxy: 'Devon Island Haughton Impact Breccia',
      accentColor: '#AEBAC8',
      bgClass: 'sim-bg-moon',
    },
  }

  const currentPreset = simulationPresets[targetBody]

  const handleLaunchSimulation = () => {
    if (onNavigate) {
      onNavigate('site-evaluation', { targetBody })
    } else {
      navigate('/assessment', { state: { targetBody } })
    }
  }

  return (
    <section id="planetary-simulation" className="simulation-preview-section reveal-on-scroll" aria-label="Mars and Moon Simulation Preview">
      <div className="simulation-container">
        {/* Section Header */}
        <div className="simulation-header-block">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> HIGH-FIDELITY DIGITAL ELEVATION SIMULATION
          </div>
          <h2 className="simulation-main-heading">
            Step Into <span className="serif-highlight">Another World.</span>
          </h2>
          <p className="simulation-subheading">
            Experience interactive planetary terrain visualization and multi-parameter analogue comparison
            derived directly from NASA and ESA orbital altimetry datasets.
          </p>
        </div>

        {/* Target Switcher Controls */}
        <div className="simulation-switcher-bar font-mono" role="tablist" aria-label="Simulation Target Planet">
          <button
            type="button"
            role="tab"
            aria-selected={targetBody === 'Mars'}
            className={`sim-switch-btn mars-switch ${targetBody === 'Mars' ? 'active' : ''}`}
            onClick={() => setTargetBody('Mars')}
          >
            <span className="switch-dot mars-dot" aria-hidden="true" />
            <span>MARS ELEVATION SIMULATION</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={targetBody === 'Moon'}
            className={`sim-switch-btn moon-switch ${targetBody === 'Moon' ? 'active' : ''}`}
            onClick={() => setTargetBody('Moon')}
          >
            <span className="switch-dot moon-dot" aria-hidden="true" />
            <span>MOON ELEVATION SIMULATION</span>
          </button>
        </div>

        {/* Large Immersive Simulation Viewport Card */}
        <div className={`simulation-viewport-card ${currentPreset.bgClass}`}>
          {/* Subtle Grid & Coordinate Overlays */}
          <div className="sim-grid-overlay" aria-hidden="true" />
          <div className="sim-scanline-overlay" aria-hidden="true" />

          {/* Top HUD Bar */}
          <div className="sim-hud-top font-mono">
            <div className="hud-badge-left">
              <span className="hud-pulse-dot" />
              <span>DIGITAL ELEVATION MODEL &bull; READY</span>
            </div>
            <div className="hud-badge-right">
              <span>{currentPreset.region}</span>
            </div>
          </div>

          {/* Center Immersive Telemetry & Landscape Profile */}
          <div className="sim-center-content">
            <span className="sim-target-tag font-mono">TARGET MODEL // {targetBody.toUpperCase()}</span>
            <h3 className="sim-target-title">{currentPreset.title}</h3>
            <p className="sim-target-summary">{currentPreset.terrainClass}</p>

            <div className="sim-specs-grid font-mono">
              <div className="sim-spec-box">
                <span className="spec-label">VERTICAL RELIEF</span>
                <span className="spec-val">{currentPreset.elevationRange}</span>
              </div>
              <div className="sim-spec-box">
                <span className="spec-label">SURFACE SLOPE</span>
                <span className="spec-val">{currentPreset.slopeRange}</span>
              </div>
              <div className="sim-spec-box">
                <span className="spec-label">REFERENCE DATUM</span>
                <span className="spec-val">{currentPreset.datum}</span>
              </div>
              <div className="sim-spec-box">
                <span className="spec-label">EARTH PROXIES</span>
                <span className="spec-val">{currentPreset.analogueProxy}</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="sim-action-bottom">
            <button
              type="button"
              className="btn-launch-simulation font-mono"
              onClick={handleLaunchSimulation}
              aria-label={`Launch ${targetBody} Terrain Simulation`}
            >
              <span>Launch Simulation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
            <span className="sim-disclaimer-note font-mono">
              NASA PDS4 MOLA &amp; LOLA AUDITED DATA &bull; ZERO SYNTHETIC TELEMETRY
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
