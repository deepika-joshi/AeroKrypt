export default function ResearchFocusSection() {
  const researchDomains = [
    {
      id: 'mars-analogue',
      title: 'Mars Analogue Research',
      target: 'TARGET: MARS // AREOID DATUM',
      badgeClass: 'badge-mars',
      accentColor: 'rgba(239, 68, 68, 0.85)',
      description:
        'Terrestrial hyper-arid deserts, basaltic volcanic plains, and permafrost polygons provide critical field proxies for Martian surface science. Researchers study extreme desiccation, ancient clay-sulfate stratigraphy, and drill coring under extreme cold.',
      analogueApplications: [
        'Desiccated clay basins for bio-signature detection and life-detection limit testing',
        'Subsurface permafrost ice-cemented soil coring (analogous to Martian polar cryosphere)',
        'Autonomous rover mobility over basaltic lava plains and loose regolith dunes',
      ],
      divergenceDisclaimer:
        'Scientific Notice: Terrestrial sites retain Earth gravity (1.0G), atmospheric pressure (101.3 kPa), and solar UV shielding. They model isolated geological and operational parameters, not total Martian atmospheric equivalence (610 Pa CO₂).',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M3 12h18" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      id: 'lunar-analogue',
      title: 'Lunar Analogue Research',
      target: 'TARGET: MOON // MEAN LUNAR SPHERE',
      badgeClass: 'badge-moon',
      accentColor: 'rgba(56, 189, 248, 0.85)',
      description:
        'Impact structures with shatter breccias, anorthositic crustal outcrops, and pyrodactyle volcanic lava tubes serve as key testing grounds for lunar surface exploration, dust mitigation, and subterranean shelter deployment.',
      analogueApplications: [
        'Highland impact craters (e.g. Haughton, Mistastin) for crater morphology and rover wheel slip validation',
        'Subsurface basaltic lava tubes for subterranean habitat integrity and robotic ingress',
        'Abrasive volcanic cinder and ash fields for wheel wear analysis and regolith simulant ConOps',
      ],
      divergenceDisclaimer:
        'Scientific Notice: Earth geomagnetic shielding and thick atmosphere cannot duplicate lunar hard vacuum (10⁻¹⁰ Pa), unshielded solar wind radiation, electrostatic regolith levitation, or 0.166G lunar gravity.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 1-9-9Z" />
        </svg>
      ),
    },
    {
      id: 'earth-environments',
      title: 'Earth-Based Analogue Environments',
      target: 'PLATFORM: TERRESTRIAL FIELD PROVING GROUNDS',
      badgeClass: 'badge-earth',
      accentColor: 'rgba(16, 185, 129, 0.85)',
      description:
        'Audited terrestrial proving grounds enable scientific teams to isolate specific environmental and mechanical variables prior to mission flight freeze. Field campaigns allow rigorous instrument calibration under documented geodetic datums.',
      analogueApplications: [
        'Sensor integration and spectral calibration against peer-reviewed mineral registries',
        'Crew operational protocols, sample contamination barriers, and EVA traverse timelines',
        'Power budget testing and telemetry latency stress tests in remote, extreme topographies',
      ],
      divergenceDisclaimer:
        'Scientific Notice: Terrestrial field operations isolate single or dual test vectors. AEROKRYPT explicitly cautions researchers that Earth candidate sites are functional comparative proxies, not holistic planetary clones.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="research-focus" className="home-content-section" aria-label="Our Research Focus">
      <div className="section-header-block">
        <div className="section-eyebrow font-mono">
          <span className="accent-glyph">//</span> SCIENTIFIC SCOPE
        </div>
        <h2 className="section-main-title">
          Our Research Focus
        </h2>
        <p className="section-lead-text">
          How terrestrial field environments provide disciplined proving grounds to study selected geological, terrain, and operational conditions relevant to planetary exploration.
        </p>
      </div>

      <div className="research-focus-grid">
        {researchDomains.map((domain) => (
          <div key={domain.id} className="research-focus-card aerospace-card">
            <div className="focus-card-header">
              <div className="focus-icon-wrap" style={{ color: domain.accentColor }} aria-hidden="true">
                {domain.icon}
              </div>
              <span className={`focus-target-badge font-mono ${domain.badgeClass}`}>
                {domain.target}
              </span>
            </div>

            <div className="focus-card-body">
              <h3 className="focus-title">{domain.title}</h3>
              <p className="focus-desc">{domain.description}</p>

              <div className="focus-applications-block">
                <h4 className="focus-subhead font-mono">// RESEARCH APPLICATIONS</h4>
                <ul className="focus-bullets">
                  {domain.analogueApplications.map((app, i) => (
                    <li key={i}>
                      <span className="bullet-dash">&bull;</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="focus-card-footer">
              <div className="focus-disclaimer font-mono">
                <span className="disclaimer-dot" aria-hidden="true" />
                <span>{domain.divergenceDisclaimer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
