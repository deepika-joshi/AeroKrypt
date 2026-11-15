import React from 'react'

/**
 * MoonSurfaceVisual Component
 * 
 * An original, animated Lunar surface visualization created using HTML5, CSS3, and layered SVG.
 * Features stark airless crater formations, bright radial ejecta rays, anorthositic highlands,
 * crescent Earthrise on the black horizon, electrostatic levitating dust particles, and metallic specular highlights.
 */

export default function MoonSurfaceVisual({ isHovered = false, isActive = false }) {
  return (
    <div className={`moon-surface-visual-root ${isHovered ? 'is-hovered' : ''} ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      {/* 1. Deep Black Space Sky with Crescent Earthrise */}
      <div className="moon-sky-layer">
        {/* Crescent Earth on the Lunar Horizon */}
        <div className="lunar-earthrise-orb" title="Earthrise from Moon Surface">
          <div className="earth-crescent-body" />
          <div className="earth-blue-glow" />
        </div>
        <div className="moon-stars-sublayer" />
      </div>

      {/* 2. Layered SVG Planetary Terrain Landscape */}
      <svg
        viewBox="0 0 800 360"
        className="moon-landscape-svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Deep vacuum sky gradient */}
          <linearGradient id="moonSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050608" />
            <stop offset="50%" stopColor="#0A0C10" />
            <stop offset="100%" stopColor="#151922" />
          </linearGradient>

          {/* Anorthositic Highland Mountain Rim */}
          <linearGradient id="moonDistantHighlandsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8E99A8" />
            <stop offset="40%" stopColor="#4A5260" />
            <stop offset="100%" stopColor="#1A1D24" />
          </linearGradient>

          {/* Mare Basalt Floor */}
          <linearGradient id="moonMareFloorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#252A33" />
            <stop offset="60%" stopColor="#1E232B" />
            <stop offset="100%" stopColor="#0F1116" />
          </linearGradient>

          {/* High-Albedo Tycho/Copernicus Ejecta Ray */}
          <linearGradient id="lunarRayGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#AEBAC8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4A5260" stopOpacity="0" />
          </linearGradient>

          {/* Sunlit crater rim (Harsh airless white-silver) */}
          <linearGradient id="lunarSunlitRimGrad" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#D8E2EC" />
            <stop offset="80%" stopColor="#6B7888" />
            <stop offset="100%" stopColor="#1A1D24" />
          </linearGradient>

          {/* Pitch-black airless shadow */}
          <linearGradient id="lunarPitchShadowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#040507" />
            <stop offset="80%" stopColor="#0B0D12" />
            <stop offset="100%" stopColor="#151922" />
          </linearGradient>
        </defs>

        {/* Sky backdrop */}
        <rect x="0" y="0" width="800" height="360" fill="url(#moonSkyGrad)" />

        {/* Layer 1: Distant Jagged Crater Rim (Highland Mountains) */}
        <g className="terrain-layer lunar-distant">
          <path
            d="M 0,150 L 50,142 L 110,149 L 180,136 L 250,146 L 340,132 L 430,148 L 520,135 L 610,146 L 700,134 L 800,148 L 800,230 L 0,230 Z"
            fill="url(#moonDistantHighlandsGrad)"
            opacity="0.9"
          />
          {/* Stark jagged peak highlights */}
          <polygon points="180,136 186,145 174,145" fill="#FFFFFF" opacity="0.85" />
          <polygon points="340,132 348,143 334,143" fill="#FFFFFF" opacity="0.9" />
          <polygon points="520,135 527,144 514,144" fill="#FFFFFF" opacity="0.8" />
          <polygon points="700,134 706,143 694,143" fill="#FFFFFF" opacity="0.75" />
        </g>

        {/* Layer 2: Basaltic Mare Plain with Bright Ejecta Rays */}
        <g className="terrain-layer lunar-midground">
          <path
            d="M 0,178 C 110,170 230,188 360,174 C 490,160 620,184 800,170 L 800,310 L 0,310 Z"
            fill="url(#moonMareFloorGrad)"
          />

          {/* Tycho Radial Ejecta Ray Streaks */}
          <g className="lunar-ejecta-rays">
            <line x1="280" y1="260" x2="80" y2="160" stroke="url(#lunarRayGlow)" strokeWidth="3" strokeDasharray="12 4" />
            <line x1="280" y1="260" x2="160" y2="150" stroke="url(#lunarRayGlow)" strokeWidth="2.5" />
            <line x1="280" y1="260" x2="260" y2="135" stroke="url(#lunarRayGlow)" strokeWidth="4" />
            <line x1="280" y1="260" x2="420" y2="145" stroke="url(#lunarRayGlow)" strokeWidth="3.5" strokeDasharray="14 3" />
            <line x1="280" y1="260" x2="560" y2="165" stroke="url(#lunarRayGlow)" strokeWidth="3" />
            <line x1="280" y1="260" x2="680" y2="190" stroke="url(#lunarRayGlow)" strokeWidth="2" strokeDasharray="8 6" />
          </g>
        </g>

        {/* Layer 3: Foreground Complex Impact Crater (Tycho/Shackleton Profile) */}
        <g className="terrain-layer lunar-foreground">
          {/* Regolith Base Terrain */}
          <path
            d="M 0,225 C 140,210 280,240 420,222 C 560,206 690,232 800,218 L 800,360 L 0,360 Z"
            fill="#1D222A"
          />

          {/* Primary Impact Crater */}
          <g className="lunar-crater-main" transform="translate(320, 260)">
            {/* Crater outer rim foundation */}
            <ellipse cx="0" cy="0" rx="150" ry="54" fill="#14181F" />
            {/* Sunlit western terraced rim wall (Brilliant white reflection) */}
            <path
              d="M -145,-4 A 145 50 0 0 1 20 44 L 5 36 A 130 42 0 0 0 -130 -4 Z"
              fill="url(#lunarSunlitRimGrad)"
            />
            {/* Stark pitch-black shadow interior (Zero atmospheric scatter) */}
            <ellipse cx="14" cy="5" rx="122" ry="40" fill="url(#lunarPitchShadowGrad)" />
            {/* Crater flat floor */}
            <ellipse cx="22" cy="11" rx="80" ry="24" fill="#0A0C10" />
            {/* Terraced inner stepped cliffs */}
            <path d="M -115,2 Q -40,32 15,22" stroke="#AEBAC8" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
            <path d="M -85,10 Q -20,36 30,26" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" fill="none" />
            {/* Central uplift peak (Brilliant sunlight) */}
            <polygon points="18,-4 28,12 8,12" fill="#FFFFFF" />
            <polygon points="22,-4 28,12 24,12" fill="#040507" />
          </g>

          {/* Secondary micro-crater */}
          <g className="lunar-crater-secondary" transform="translate(640, 285)">
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#14181F" />
            <path d="M -56,-2 A 56 20 0 0 1 8 18 L 0 14 A 48 16 0 0 0 -48 -2 Z" fill="url(#lunarSunlitRimGrad)" />
            <ellipse cx="6" cy="2" rx="48" ry="16" fill="#050608" />
            <circle cx="6" cy="2" r="2.5" fill="#FFFFFF" />
          </g>

          {/* High-contrast basaltic anorthosite rocks & boulders */}
          <g className="lunar-boulders">
            <polygon points="110,320 124,308 136,322 128,330 114,328" fill="#AEBAC8" />
            <polygon points="124,308 136,322 132,328" fill="#040507" />

            <polygon points="490,332 505,318 522,336 502,342" fill="#D8E2EC" />
            <polygon points="505,318 522,336 515,340" fill="#040507" />

            <circle cx="210" cy="336" r="3.5" fill="#6B7888" />
            <circle cx="390" cy="328" r="4" fill="#8E99A8" />
            <circle cx="580" cy="342" r="5" fill="#6B7888" />
          </g>
        </g>

        {/* Layer 4: Levitating Electrostatic Dust Grains (Animated via CSS) */}
        <g className="lunar-dust-particles">
          <circle className="lunar-grain lg-1" cx="140" cy="190" r="1.8" fill="#FFFFFF" opacity="0.85" />
          <circle className="lunar-grain lg-2" cx="260" cy="160" r="2.2" fill="#AEBAC8" opacity="0.75" />
          <circle className="lunar-grain lg-3" cx="380" cy="220" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle className="lunar-grain lg-4" cx="510" cy="175" r="2" fill="#D8E2EC" opacity="0.8" />
          <circle className="lunar-grain lg-5" cx="660" cy="235" r="2.5" fill="#FFFFFF" opacity="0.7" />
          <circle className="lunar-grain lg-6" cx="210" cy="270" r="1.6" fill="#AEBAC8" opacity="0.85" />
          <circle className="lunar-grain lg-7" cx="440" cy="140" r="1.4" fill="#FFFFFF" opacity="0.95" />
        </g>
      </svg>

      {/* 3. Metallic Specular Rim & Shifting Shadow Edge */}
      <div className="moon-specular-sweep" />
      <div className="moon-terminator-shadow" />
      <div className="moon-vignette" />

      {/* 4. Active Target Status Reticle */}
      <div className="surface-hud-indicator font-mono">
        <span className="hud-ping-dot moon-dot" />
        <span>LUNAR REGOLITH SIMULATION // LOLA 64 PX/DEG</span>
      </div>
    </div>
  )
}
