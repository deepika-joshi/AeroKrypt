/**
 * AnimatedPlanetaryHero Component
 * 
 * Replaces static images with authentic, multi-layered animated Mars and Moon planets
 * occupying different depths in an interactive planetary orbital system.
 * 
 * Initial state: Mars large in foreground, Moon smaller, clearly visible to the side.
 * When switching: smooth depth transitions with scaling, translation, and z-index changes.
 */

export default function AnimatedPlanetaryHero({
  activePlanet = 'mars',
  onSelectPlanet,
}) {
  // Planetary physical telemetry constants (authentic planetary geodesy)
  const planetData = {
    mars: {
      name: 'MARS',
      subhead: 'FOURTH PLANET // AREOID DATUM',
      radius: '3,389.5 km',
      gravity: '0.380 G (3.72 m/s²)',
      rotationPeriod: '24h 37m 22s',
      meanTemp: '-63°C (-81°F)',
      pressure: '610 Pa (0.088 psi)',
      datum: 'MOLA Gravitational Areoid',
      primaryAnalogueFeature: 'Basaltic Regolith & Desiccated Clays',
      highlightColor: '#D6A66B',
      accentColor: '#A94C34',
    },
    moon: {
      name: 'MOON',
      subhead: 'EARTH NATURAL SATELLITE // LOLA DATUM',
      radius: '1,737.4 km',
      gravity: '0.166 G (1.62 m/s²)',
      rotationPeriod: '27.3 d (Tidally Locked)',
      meanTemp: '-20°C (Equator Mean)',
      pressure: '10⁻¹⁰ Pa (Hard Vacuum)',
      datum: 'LOLA Reference Sphere (1,737.4 km)',
      primaryAnalogueFeature: 'Anorthositic Highlands & Basaltic Tubes',
      highlightColor: '#D6A66B',
      accentColor: '#AEBAC8',
    },
  }

  const current = planetData[activePlanet] || planetData.mars

  return (
    <div
      className={`planetary-hero-stage planet-mode-${activePlanet}`}
      aria-label="Interactive 3D Planetary Visualization"
    >
      {/* 1. Deep Space Atmosphere Glow (Responsive to active planet) */}
      <div className="planetary-atmosphere-aurora" aria-hidden="true" />

      {/* 2. Geodetic Coordinate Rings & Orbital Trajectory Arc */}
      <div className="planetary-orbit-reticle" aria-hidden="true">
        <svg viewBox="0 0 640 480" className="reticle-svg">
          <ellipse cx="320" cy="240" rx="280" ry="170" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" fill="none" />
          <ellipse cx="320" cy="240" rx="220" ry="130" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.15" fill="none" />
          {/* Orbital connecting arc between the two planet positions */}
          <path
            d="M 120 200 C 200 120 440 120 520 200 C 460 320 180 320 120 200"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            opacity="0.32"
            fill="none"
          />
          <line x1="310" y1="240" x2="330" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="320" y1="230" x2="320" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* 3. Central Dual Planetary Depth Viewport */}
      <div className="planetary-viewport-wrapper">
        {/* ================= MARS GLOBE ================= */}
        <div
          className={`planetary-body-container mars-body-container ${activePlanet === 'mars' ? 'is-active is-foreground' : 'is-standby is-background'}`}
          onClick={() => { if (onSelectPlanet) onSelectPlanet('mars') }}
          role="button"
          tabIndex={0}
          aria-label={activePlanet === 'mars' ? 'Mars (Selected Planet)' : 'Switch to Mars (Click to select)'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (onSelectPlanet) onSelectPlanet('mars')
            }
          }}
        >
          {/* Atmospheric limb glow (for Mars) */}
          <div className="mars-atmospheric-limb" aria-hidden="true" />

          {/* Spherical Globe Shell */}
          <div className="planetary-sphere globe-mars">
            {/* Layer 1: Seamless Rotating Surface Texture */}
            <div className="surface-texture-track mars-texture-track" aria-hidden="true">
              <svg viewBox="0 0 1200 400" className="surface-svg mars-svg" preserveAspectRatio="none">
                <defs>
                  {/* Basaltic albedo gradients */}
                  <radialGradient id="vallesMarineris" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#351510" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#61251E" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="tharsisVolcano" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C45E3D" />
                    <stop offset="40%" stopColor="#873420" />
                    <stop offset="100%" stopColor="#61251E" />
                  </radialGradient>
                  <radialGradient id="polarIce" cx="50%" cy="20%" r="60%">
                    <stop offset="0%" stopColor="#F8EDE1" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#E2C9B5" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#A94C34" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="craterNoiseMars" width="80" height="80" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="3" fill="#3D1712" opacity="0.4" />
                    <circle cx="65" cy="50" r="4.5" fill="#3D1712" opacity="0.35" />
                    <circle cx="45" cy="70" r="2" fill="#C45E3D" opacity="0.3" />
                  </pattern>
                </defs>

                {/* --- TILE 1 (0 to 600) --- */}
                <g className="tile tile-1">
                  {/* Base terrain bands */}
                  <rect x="0" y="0" width="600" height="400" fill="#873420" />
                  <path d="M0,120 Q150,90 300,130 T600,110 L600,280 Q450,310 300,270 T0,290 Z" fill="#61251E" />
                  <path d="M0,160 Q180,140 320,180 T600,150 L600,240 Q400,270 200,230 T0,250 Z" fill="#4E1D18" />

                  {/* North Polar Ice Cap */}
                  <ellipse cx="300" cy="18" rx="140" ry="24" fill="url(#polarIce)" />
                  <ellipse cx="300" cy="12" rx="90" ry="14" fill="#FAF6F0" opacity="0.9" />

                  {/* Valles Marineris Canyon System */}
                  <path
                    d="M 160,210 Q 230,225 320,218 T 460,222"
                    stroke="#260C09"
                    strokeWidth="11"
                    strokeLinecap="round"
                    fill="none"
                    filter="blur(1px)"
                  />
                  <path
                    d="M 180,212 Q 250,224 340,217 T 440,220"
                    stroke="#190705"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Tharsis Volcanic Shield (Olympus & Tharsis Montes) */}
                  <ellipse cx="140" cy="190" rx="34" ry="30" fill="url(#tharsisVolcano)" />
                  <circle cx="140" cy="190" r="6" fill="#1A0705" />
                  <circle cx="140" cy="190" r="10" stroke="#C45E3D" strokeWidth="1.5" fill="none" opacity="0.6" />

                  <circle cx="190" cy="170" r="14" fill="#61251E" />
                  <circle cx="210" cy="195" r="13" fill="#61251E" />
                  <circle cx="230" cy="220" r="12" fill="#61251E" />

                  {/* Hellas Planitia Basin */}
                  <ellipse cx="440" cy="280" rx="65" ry="42" fill="#9E432E" />
                  <ellipse cx="440" cy="280" rx="48" ry="30" fill="#B3523A" opacity="0.8" />
                  <ellipse cx="440" cy="280" rx="55" ry="36" stroke="#4A1813" strokeWidth="3" fill="none" opacity="0.5" />

                  {/* Syrtis Major Dark Plateau */}
                  <path d="M 370,140 L 420,180 L 390,220 L 350,190 Z" fill="#381410" opacity="0.85" />

                  {/* Fine regolith stippling */}
                  <rect x="0" y="0" width="600" height="400" fill="url(#craterNoiseMars)" />
                </g>

                {/* --- TILE 2 (Seamless Repeat 600 to 1200) --- */}
                <g className="tile tile-2" transform="translate(600, 0)">
                  <rect x="0" y="0" width="600" height="400" fill="#873420" />
                  <path d="M0,120 Q150,90 300,130 T600,110 L600,280 Q450,310 300,270 T0,290 Z" fill="#61251E" />
                  <path d="M0,160 Q180,140 320,180 T600,150 L600,240 Q400,270 200,230 T0,250 Z" fill="#4E1D18" />

                  <ellipse cx="300" cy="18" rx="140" ry="24" fill="url(#polarIce)" />
                  <ellipse cx="300" cy="12" rx="90" ry="14" fill="#FAF6F0" opacity="0.9" />

                  <path
                    d="M 160,210 Q 230,225 320,218 T 460,222"
                    stroke="#260C09"
                    strokeWidth="11"
                    strokeLinecap="round"
                    fill="none"
                    filter="blur(1px)"
                  />
                  <path
                    d="M 180,212 Q 250,224 340,217 T 440,220"
                    stroke="#190705"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />

                  <ellipse cx="140" cy="190" rx="34" ry="30" fill="url(#tharsisVolcano)" />
                  <circle cx="140" cy="190" r="6" fill="#1A0705" />
                  <circle cx="140" cy="190" r="10" stroke="#C45E3D" strokeWidth="1.5" fill="none" opacity="0.6" />

                  <circle cx="190" cy="170" r="14" fill="#61251E" />
                  <circle cx="210" cy="195" r="13" fill="#61251E" />
                  <circle cx="230" cy="220" r="12" fill="#61251E" />

                  <ellipse cx="440" cy="280" rx="65" ry="42" fill="#9E432E" />
                  <ellipse cx="440" cy="280" rx="48" ry="30" fill="#B3523A" opacity="0.8" />
                  <ellipse cx="440" cy="280" rx="55" ry="36" stroke="#4A1813" strokeWidth="3" fill="none" opacity="0.5" />

                  <path d="M 370,140 L 420,180 L 390,220 L 350,190 Z" fill="#381410" opacity="0.85" />
                  <rect x="0" y="0" width="600" height="400" fill="url(#craterNoiseMars)" />
                </g>
              </svg>
            </div>

            {/* Layer 2: 3D Spherical Volume Shading */}
            <div className="sphere-shading-layer mars-shading" aria-hidden="true" />

            {/* Layer 3: Realistic Day/Night Curved Terminator Shadow */}
            <div className="terminator-shadow-layer mars-terminator" aria-hidden="true" />

            {/* Layer 4: Mars Atmospheric Rim Highlights */}
            <div className="limb-specular-ring mars-limb" aria-hidden="true" />
          </div>

          {/* Standby Planet Tooltip Pill (Prompts to click) */}
          <div className="standby-planet-tag font-mono">
            <span>{activePlanet === 'mars' ? 'MARS // 0.380G (ACTIVE)' : 'CLICK TO SELECT MARS // 0.380G'}</span>
          </div>
        </div>

        {/* ================= MOON GLOBE ================= */}
        <div
          className={`planetary-body-container moon-body-container ${activePlanet === 'moon' ? 'is-active is-foreground' : 'is-standby is-background'}`}
          onClick={() => { if (onSelectPlanet) onSelectPlanet('moon') }}
          role="button"
          tabIndex={0}
          aria-label={activePlanet === 'moon' ? 'Moon (Selected Planet)' : 'Switch to Moon (Click to select)'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (onSelectPlanet) onSelectPlanet('moon')
            }
          }}
        >
          {/* Subtle lunar vacuum limb (crisp airless boundary) */}
          <div className="moon-airless-limb" aria-hidden="true" />

          {/* Spherical Globe Shell */}
          <div className="planetary-sphere globe-moon">
            {/* Layer 1: Seamless Rotating Surface Texture */}
            <div className="surface-texture-track moon-texture-track" aria-hidden="true">
              <svg viewBox="0 0 1200 400" className="surface-svg moon-svg" preserveAspectRatio="none">
                <defs>
                  {/* Lunar Maria basaltic tone */}
                  <radialGradient id="lunarMare" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#252A33" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#323844" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#636D7B" stopOpacity="0" />
                  </radialGradient>
                  {/* Tycho impact ejecta ray gradient */}
                  <linearGradient id="ejectaRay" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#AEBAC8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#AEBAC8" stopOpacity="0" />
                  </linearGradient>
                  <pattern id="craterNoiseMoon" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="3" fill="#1E232B" opacity="0.4" />
                    <circle cx="45" cy="35" r="4" fill="#1E232B" opacity="0.3" />
                    <circle cx="30" cy="50" r="2" fill="#E2E8F0" opacity="0.25" />
                  </pattern>
                </defs>

                {/* --- TILE 1 (0 to 600) --- */}
                <g className="tile tile-1">
                  {/* Base anorthositic highlands (feldspathic light grey) */}
                  <rect x="0" y="0" width="600" height="400" fill="#7D8897" />
                  <path d="M0,0 L600,0 L600,140 Q400,180 200,120 T0,150 Z" fill="#8E99A8" />
                  <path d="M0,260 Q200,230 400,280 T600,250 L600,400 L0,400 Z" fill="#8A95A4" />

                  {/* Oceanus Procellarum & Mare Imbrium */}
                  <ellipse cx="160" cy="160" rx="90" ry="75" fill="url(#lunarMare)" />
                  <circle cx="210" cy="130" r="50" fill="url(#lunarMare)" />
                  <circle cx="210" cy="130" r="38" stroke="#1D222A" strokeWidth="2.5" fill="none" opacity="0.5" />

                  {/* Mare Serenitatis & Mare Tranquillitatis */}
                  <ellipse cx="320" cy="140" rx="45" ry="38" fill="url(#lunarMare)" />
                  <ellipse cx="340" cy="195" rx="52" ry="40" fill="url(#lunarMare)" />
                  <ellipse cx="430" cy="165" rx="34" ry="28" fill="url(#lunarMare)" /> {/* Mare Crisium */}

                  {/* Tycho Impact Crater & Spectacular Radial Ejecta Rays */}
                  <g transform="translate(260, 310)">
                    {/* Radial rays spreading across the southern highlands */}
                    <line x1="0" y1="0" x2="-140" y2="-90" stroke="url(#ejectaRay)" strokeWidth="2" strokeDasharray="6 3" />
                    <line x1="0" y1="0" x2="-80" y2="-140" stroke="url(#ejectaRay)" strokeWidth="2" />
                    <line x1="0" y1="0" x2="10" y2="-160" stroke="url(#ejectaRay)" strokeWidth="2.5" />
                    <line x1="0" y1="0" x2="110" y2="-120" stroke="url(#ejectaRay)" strokeWidth="2" />
                    <line x1="0" y1="0" x2="150" y2="-60" stroke="url(#ejectaRay)" strokeWidth="1.8" />
                    <line x1="0" y1="0" x2="-70" y2="40" stroke="url(#ejectaRay)" strokeWidth="1.5" />
                    <line x1="0" y1="0" x2="80" y2="45" stroke="url(#ejectaRay)" strokeWidth="1.5" />

                    {/* Crater bowl & central peak */}
                    <circle cx="0" cy="0" r="14" fill="#E2E8F0" />
                    <circle cx="0" cy="0" r="11" fill="#4A5260" />
                    <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                  </g>

                  {/* Copernicus Crater */}
                  <g transform="translate(190, 185)">
                    <line x1="0" y1="0" x2="-50" y2="-40" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <line x1="0" y1="0" x2="60" y2="-30" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <line x1="0" y1="0" x2="40" y2="50" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="0" cy="0" r="16" fill="#D3DDE8" />
                    <circle cx="0" cy="0" r="12" fill="#3D444E" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                  </g>

                  {/* Kepler Crater */}
                  <circle cx="120" cy="180" r="9" fill="#D3DDE8" />
                  <circle cx="120" cy="180" r="6" fill="#353C46" />

                  {/* Dense crater field noise */}
                  <rect x="0" y="0" width="600" height="400" fill="url(#craterNoiseMoon)" />
                </g>

                {/* --- TILE 2 (Seamless Repeat 600 to 1200) --- */}
                <g className="tile tile-2" transform="translate(600, 0)">
                  <rect x="0" y="0" width="600" height="400" fill="#7D8897" />
                  <path d="M0,0 L600,0 L600,140 Q400,180 200,120 T0,150 Z" fill="#8E99A8" />
                  <path d="M0,260 Q200,230 400,280 T600,250 L600,400 L0,400 Z" fill="#8A95A4" />

                  <ellipse cx="160" cy="160" rx="90" ry="75" fill="url(#lunarMare)" />
                  <circle cx="210" cy="130" r="50" fill="url(#lunarMare)" />
                  <circle cx="210" cy="130" r="38" stroke="#1D222A" strokeWidth="2.5" fill="none" opacity="0.5" />

                  <ellipse cx="320" cy="140" rx="45" ry="38" fill="url(#lunarMare)" />
                  <ellipse cx="340" cy="195" rx="52" ry="40" fill="url(#lunarMare)" />
                  <ellipse cx="430" cy="165" rx="34" ry="28" fill="url(#lunarMare)" />

                  <g transform="translate(260, 310)">
                    <line x1="0" y1="0" x2="-140" y2="-90" stroke="url(#ejectaRay)" strokeWidth="2" strokeDasharray="6 3" />
                    <line x1="0" y1="0" x2="-80" y2="-140" stroke="url(#ejectaRay)" strokeWidth="2" />
                    <line x1="0" y1="0" x2="10" y2="-160" stroke="url(#ejectaRay)" strokeWidth="2.5" />
                    <line x1="0" y1="0" x2="110" y2="-120" stroke="url(#ejectaRay)" strokeWidth="2" />
                    <line x1="0" y1="0" x2="150" y2="-60" stroke="url(#ejectaRay)" strokeWidth="1.8" />
                    <line x1="0" y1="0" x2="-70" y2="40" stroke="url(#ejectaRay)" strokeWidth="1.5" />
                    <line x1="0" y1="0" x2="80" y2="45" stroke="url(#ejectaRay)" strokeWidth="1.5" />

                    <circle cx="0" cy="0" r="14" fill="#E2E8F0" />
                    <circle cx="0" cy="0" r="11" fill="#4A5260" />
                    <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                  </g>

                  <g transform="translate(190, 185)">
                    <line x1="0" y1="0" x2="-50" y2="-40" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <line x1="0" y1="0" x2="60" y2="-30" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <line x1="0" y1="0" x2="40" y2="50" stroke="#C8D4E2" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="0" cy="0" r="16" fill="#D3DDE8" />
                    <circle cx="0" cy="0" r="12" fill="#3D444E" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                  </g>

                  <circle cx="120" cy="180" r="9" fill="#D3DDE8" />
                  <circle cx="120" cy="180" r="6" fill="#353C46" />
                  <rect x="0" y="0" width="600" height="400" fill="url(#craterNoiseMoon)" />
                </g>
              </svg>
            </div>

            {/* Layer 2: 3D Spherical Volume Shading */}
            <div className="sphere-shading-layer moon-shading" aria-hidden="true" />

            {/* Layer 3: Stark Lunar Vacuum Terminator Shadow */}
            <div className="terminator-shadow-layer moon-terminator" aria-hidden="true" />

            {/* Layer 4: Airless Specular & Earthshine Limb */}
            <div className="limb-specular-ring moon-limb" aria-hidden="true" />
          </div>

          {/* Standby Planet Tooltip Pill (Prompts to click) */}
          <div className="standby-planet-tag font-mono">
            <span>{activePlanet === 'moon' ? 'MOON // 0.166G (ACTIVE)' : 'CLICK TO SELECT MOON // 0.166G'}</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Planet Switcher Bar */}
      <div className="planetary-switcher-dock" role="tablist" aria-label="Planet Selector">
        <button
          type="button"
          role="tab"
          aria-selected={activePlanet === 'mars'}
          className={`switcher-pill mars-pill ${activePlanet === 'mars' ? 'active' : ''}`}
          onClick={() => { if (onSelectPlanet) onSelectPlanet('mars') }}
        >
          <span className="pill-dot mars-dot" aria-hidden="true" />
          <span className="pill-label">MARS</span>
          <span className="pill-metric font-mono">0.380G</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activePlanet === 'moon'}
          className={`switcher-pill moon-pill ${activePlanet === 'moon' ? 'active' : ''}`}
          onClick={() => { if (onSelectPlanet) onSelectPlanet('moon') }}
        >
          <span className="pill-dot moon-dot" aria-hidden="true" />
          <span className="pill-label">MOON</span>
          <span className="pill-metric font-mono">0.166G</span>
        </button>
      </div>

      {/* 5. Authentic Planetary Geodetic Telemetry Strip */}
      <div className="planetary-geodetic-hud font-mono" aria-live="polite">
        <div className="hud-metric-item">
          <span className="hud-metric-label">GEODETIC DATUM</span>
          <span className="hud-metric-value">{current.datum}</span>
        </div>
        <div className="hud-metric-item">
          <span className="hud-metric-label">MEAN RADIUS</span>
          <span className="hud-metric-value">{current.radius}</span>
        </div>
        <div className="hud-metric-item">
          <span className="hud-metric-label">ROTATION PERIOD</span>
          <span className="hud-metric-value">{current.rotationPeriod}</span>
        </div>
        <div className="hud-metric-item">
          <span className="hud-metric-label">ATMOSPHERIC PRESSURE</span>
          <span className="hud-metric-value">{current.pressure}</span>
        </div>
      </div>
    </div>
  )
}
