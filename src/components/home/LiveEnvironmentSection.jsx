import { Link } from 'react-router-dom'

export default function LiveEnvironmentSection() {
  const environmentalParameters = [
    {
      id: 'temperature',
      title: 'Temperature',
      symbol: 'T',
      unit: '°C / Kelvin',
      targetContext: 'Surface thermal regimes & diurnal swing',
      description:
        'Monitors extreme surface temperature gradients and diurnal thermal cycles across field proving grounds and compares them against Martian (-125°C to +20°C) and lunar (-130°C to +120°C) thermal extremes.',
      fieldApplications: [
        'Permafrost sublimation & freeze-thaw cycles',
        'Payload thermal stress & electronic survival limits',
        'Subsurface thermal inertia calibration',
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      ),
    },
    {
      id: 'pressure',
      title: 'Atmospheric Pressure',
      symbol: 'P',
      unit: 'kPa / Pascal',
      targetContext: 'Aerodynamic & vacuum differentials',
      description:
        'Analyzes atmospheric density profiles from Earth standard sea-level (101.3 kPa) to the thin carbon dioxide atmosphere of Mars (610 Pa mean) and the ultra-hard vacuum of the lunar surface (10⁻¹⁰ Pa).',
      fieldApplications: [
        'Parachute deceleration & rotorcraft aerodynamics',
        'Vacuum seal integrity & dust seal testing',
        'Volatile degassing & ice sublimation kinetics',
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      id: 'humidity',
      title: 'Humidity',
      symbol: 'RH',
      unit: '% Relative Humidity / ppm',
      targetContext: 'Hyper-aridity & water activity (a_w)',
      description:
        'Quantifies relative humidity, vapor pressure deficits, and soil matric water potentials in hyper-arid terrestrial deserts that simulate the profound desiccation limits of the Martian regolith.',
      fieldApplications: [
        'Deliquescence of perchlorate & chloride salts',
        'Preservation of ancient biomarkers in dry clays',
        'Autonomous drill moisture detection sensor checks',
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: 'oxygen',
      title: 'Oxygen',
      symbol: 'O₂',
      unit: 'Partial Pressure / Mol %',
      targetContext: 'Atmospheric composition & habitability',
      description:
        'Evaluates atmospheric gas composition, oxygen partial pressures, and anoxic geochemical depositional environments that proxy the non-oxidizing or low-oxygen conditions of early planetary surfaces.',
      fieldApplications: [
        'Anaerobic chemolithoautotrophic metabolism models',
        'Oxygen generation & ISRU conversion testing',
        'Closed-loop environmental life support validation',
      ],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      ),
    },
  ]

  return (
    <section id="planetary-environments" className="planetary-environments-section reveal-on-scroll" aria-label="Planetary Environments Monitoring">
      <div className="environments-container">
        {/* Section Header */}
        <div className="environments-header-block">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> PHYSICAL &amp; ATMOSPHERIC PARAMETERS
          </div>
          <h2 className="environments-main-heading">
            Understand <span className="serif-highlight">Planetary Environments.</span>
          </h2>
          <p className="environments-subheading">
            The four primary environmental parameters AeroKrypt evaluates to measure terrestrial analogue
            fidelity against the extreme conditions of Mars and the Moon.
          </p>
        </div>

        {/* 4 Environmental Parameter Cards Grid */}
        <div className="environments-parameters-grid">
          {environmentalParameters.map((param) => (
            <div key={param.id} className="environment-param-card">
              <div className="param-header-row font-mono">
                <span className="param-symbol">{param.symbol}</span>
                <span className="param-unit">{param.unit}</span>
              </div>

              <div className="param-title-row">
                <div className="param-icon" aria-hidden="true">
                  {param.icon}
                </div>
                <div>
                  <h3 className="param-name">{param.title}</h3>
                  <span className="param-context font-mono">{param.targetContext}</span>
                </div>
              </div>

              <p className="param-description">{param.description}</p>

              <div className="param-applications-box">
                <span className="box-title font-mono">// ANALOGUE APPLICATIONS</span>
                <ul className="applications-list">
                  {param.fieldApplications.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Live Telemetry Status Banner (Strictly NO fake readings) */}
        <div className="telemetry-offline-banner font-mono" role="status">
          <div className="banner-left">
            <div className="status-ping-ring">
              <span className="ping-dot" />
            </div>
            <div className="banner-text-block">
              <span className="banner-title">FIELD SENSOR TELEMETRY STREAM &bull; STANDBY STATE</span>
              <p className="banner-detail">
                Live field sensor telemetry is currently offline. Real-time atmospheric and regolith sensor feeds are
                activated during scheduled field campaigns. Audited baseline physical ranges remain accessible in
                the Analogue Site Assessment catalog.
              </p>
            </div>
          </div>
          <div className="banner-right">
            <Link to="/assessment" className="banner-link">
              Inspect Baseline Ranges &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
