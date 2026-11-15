import React from 'react'

/**
 * MarsSurfaceVisual Component
 * 
 * An original, animated Martian surface visualization created using HTML5, CSS3, and layered SVG.
 * Features realistic crater formations, stratified canyon scarps, drifting atmospheric dust,
 * dynamic solar illumination sweep, and interactive hover/active states.
 */

export default function MarsSurfaceVisual({ isHovered = false, isActive = false }) {
  return (
    <div className={`mars-surface-visual-root ${isHovered ? 'is-hovered' : ''} ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      {/* 1. Deep Space Sky with Atmospheric Limb & Phobos */}
      <div className="mars-sky-layer">
        <div className="mars-phobos-moon" title="Phobos in Martian Sky" />
        <div className="mars-stars-sublayer" />
        <div className="mars-dust-haze" />
      </div>

      {/* 2. Layered SVG Planetary Terrain Landscape */}
      <svg
        viewBox="0 0 800 360"
        className="mars-landscape-svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky to surface atmospheric gradient */}
          <linearGradient id="marsAtmosphereGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#100C0B" />
            <stop offset="35%" stopColor="#2A100C" />
            <stop offset="70%" stopColor="#61251E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A94C34" />
          </linearGradient>

          {/* Distant volcanic mountain rim */}
          <linearGradient id="marsDistantRidgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#732B22" />
            <stop offset="100%" stopColor="#431713" />
          </linearGradient>

          {/* Midground canyon scarp stratification */}
          <linearGradient id="marsCanyonScarpGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C45E3D" />
            <stop offset="30%" stopColor="#A94C34" />
            <stop offset="70%" stopColor="#873420" />
            <stop offset="100%" stopColor="#351510" />
          </linearGradient>

          {/* Crater sunlit rim vs deep shadow */}
          <linearGradient id="craterSunlitGrad" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#D6A66B" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#A94C34" />
            <stop offset="100%" stopColor="#2A0E0B" />
          </linearGradient>

          <linearGradient id="craterShadowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#180806" />
            <stop offset="80%" stopColor="#351510" />
            <stop offset="100%" stopColor="#61251E" />
          </linearGradient>

          {/* Dust particle blur filter */}
          <filter id="dustBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Sky backdrop */}
        <rect x="0" y="0" width="800" height="360" fill="url(#marsAtmosphereGrad)" />

        {/* Layer 1: Distant Highland Mountain Horizon (Parallax layer 1) */}
        <g className="terrain-layer terrain-distant">
          <path
            d="M 0,160 Q 90,140 210,152 T 420,138 T 620,150 T 800,142 L 800,240 L 0,240 Z"
            fill="url(#marsDistantRidgeGrad)"
            opacity="0.9"
          />
          {/* Olympus Mons Caldera Silhouette in distance */}
          <ellipse cx="640" cy="144" rx="90" ry="16" fill="#3D1410" opacity="0.6" />
          <ellipse cx="640" cy="142" rx="40" ry="6" fill="#2A0D0A" opacity="0.8" />
        </g>

        {/* Layer 2: Midground Stratified Canyon Scarp (Valles Marineris / Jezero Delta Cliffs) */}
        <g className="terrain-layer terrain-midground">
          <path
            d="M 0,185 C 80,180 140,195 240,182 C 340,170 410,198 520,185 C 620,172 710,188 800,176 L 800,310 L 0,310 Z"
            fill="url(#marsCanyonScarpGrad)"
          />
          {/* Geological strata banding lines */}
          <path d="M 0,195 Q 240,190 520,198 T 800,188" stroke="#D6A66B" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
          <path d="M 0,208 Q 300,202 580,212 T 800,200" stroke="#351510" strokeWidth="2.5" strokeOpacity="0.65" fill="none" />
          <path d="M 0,222 Q 220,216 480,224 T 800,214" stroke="#873420" strokeWidth="1.8" strokeOpacity="0.5" fill="none" />
        </g>

        {/* Layer 3: Foreground Impact Crater Formations & Regolith Basalt */}
        <g className="terrain-layer terrain-foreground">
          {/* Rolling Basalt Dunes Base */}
          <path
            d="M 0,230 C 120,218 260,245 390,228 C 530,212 680,238 800,224 L 800,360 L 0,360 Z"
            fill="#541F1A"
          />

          {/* Primary Impact Crater (Jezero/Gale-style) */}
          <g className="mars-crater-main" transform="translate(460, 260)">
            {/* Crater outer ejecta blanket */}
            <ellipse cx="0" cy="0" rx="140" ry="52" fill="#3D1511" />
            {/* Sunlit western crater rim */}
            <path
              d="M -135, -5 A 135 48 0 0 1 15 42 L 0 35 A 120 40 0 0 0 -120 -5 Z"
              fill="url(#craterSunlitGrad)"
            />
            {/* Deep shadow interior bowl (Eastern slope) */}
            <ellipse cx="12" cy="4" rx="115" ry="38" fill="url(#craterShadowGrad)" />
            {/* Crater floor sedimentary deposit */}
            <ellipse cx="20" cy="10" rx="75" ry="22" fill="#240B08" />
            {/* Central uplift peak */}
            <polygon points="18,0 26,12 10,12" fill="#D6A66B" opacity="0.85" />
            <polygon points="20,0 26,12 21,12" fill="#180806" opacity="0.9" />
          </g>

          {/* Secondary smaller impact crater */}
          <g className="mars-crater-secondary" transform="translate(140, 290)">
            <ellipse cx="0" cy="0" rx="58" ry="22" fill="#3D1511" />
            <path d="M -54,-2 A 54 20 0 0 1 6 18 L 0 14 A 46 16 0 0 0 -46 -2 Z" fill="url(#craterSunlitGrad)" />
            <ellipse cx="6" cy="2" rx="46" ry="15" fill="#1E0907" />
          </g>

          {/* Foreground rocky boulder formations */}
          <g className="mars-boulders" fill="#2A0E0B">
            <polygon points="70,320 82,310 94,324 88,332 72,328" />
            <polygon points="270,335 285,322 298,338 280,344" />
            <polygon points="680,330 695,316 712,334 690,342" />
            <circle cx="210" cy="340" r="4" />
            <circle cx="340" cy="326" r="5" />
            <circle cx="610" cy="345" r="6" />
          </g>
        </g>

        {/* Layer 4: Dynamic Floating Dust Particles (Animated via CSS) */}
        <g className="mars-dust-particles" filter="url(#dustBlur)">
          <circle className="dust-particle dp-1" cx="120" cy="180" r="2.5" fill="#D6A66B" opacity="0.7" />
          <circle className="dust-particle dp-2" cx="290" cy="150" r="3" fill="#A94C34" opacity="0.6" />
          <circle className="dust-particle dp-3" cx="440" cy="210" r="2" fill="#D6A66B" opacity="0.8" />
          <circle className="dust-particle dp-4" cx="580" cy="170" r="2.5" fill="#C45E3D" opacity="0.75" />
          <circle className="dust-particle dp-5" cx="710" cy="230" r="3.5" fill="#A94C34" opacity="0.5" />
          <circle className="dust-particle dp-6" cx="210" cy="260" r="2" fill="#D6A66B" opacity="0.7" />
          <circle className="dust-particle dp-7" cx="370" cy="130" r="1.8" fill="#F2E5D5" opacity="0.6" />
        </g>
      </svg>

      {/* 3. Dynamic Sunlight Sweep & Vignette Overlays */}
      <div className="mars-sunlight-sweep" />
      <div className="mars-atmosphere-glow" />
      <div className="mars-vignette" />

      {/* 4. Active Target Status Reticle */}
      <div className="surface-hud-indicator font-mono">
        <span className="hud-ping-dot mars-dot" />
        <span>MARS REGOLITH SIMULATION // MOLA 128 PX/DEG</span>
      </div>
    </div>
  )
}
