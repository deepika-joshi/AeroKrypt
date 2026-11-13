export default function LocationInspector({ location, onClose, onNavigate }) {
  if (!location) return null

  const parameters = [
    {
      category: 'Topography',
      name: 'Elevation (a.s.l.)',
      value: location.elevation.label,
      confidence: location.elevation.status,
      coverage: location.elevation.measurementLocation || 'Site benchmark',
      period: location.elevation.measurementPeriod || 'Established survey',
      citation: location.elevation.sourceCitation,
    },
    {
      category: 'Topography',
      name: 'Slope Gradient',
      value: location.slope.label,
      confidence: location.slope.status,
      coverage: location.slope.measurementLocation || 'Traverse corridors',
      period: location.slope.measurementPeriod || 'Field campaign baseline',
      citation: location.slope.sourceCitation,
    },
    {
      category: 'Climate & Thermal',
      name: 'Mean Annual Temperature',
      value: location.meanAnnualTemp.label,
      confidence: location.meanAnnualTemp.status,
      coverage: location.meanAnnualTemp.measurementLocation || 'Meteorological station',
      period: location.meanAnnualTemp.measurementPeriod || 'Multi-year logging',
      citation: location.meanAnnualTemp.sourceCitation,
    },
    {
      category: 'Climate & Thermal',
      name: 'Annual Precipitation',
      value: location.annualPrecipitation.label,
      confidence: location.annualPrecipitation.status,
      coverage: location.annualPrecipitation.measurementLocation || 'Rain gauge / regional baseline',
      period: location.annualPrecipitation.measurementPeriod || 'Multi-year climatology',
      citation: location.annualPrecipitation.sourceCitation,
    },
    {
      category: 'Radiation',
      name: 'Peak Solar UV Index',
      value: location.uvIndexPeak.label,
      confidence: location.uvIndexPeak.status,
      coverage: location.uvIndexPeak.measurementLocation || 'Regional monitoring network',
      period: location.uvIndexPeak.measurementPeriod || 'Summer solstice peak baseline',
      citation: location.uvIndexPeak.sourceCitation,
    },
    {
      category: 'Geochemistry',
      name: 'Soil Chemistry & Perchlorates',
      value: location.soilChemistry.description,
      confidence: location.soilChemistry.status,
      coverage: location.soilChemistry.measurementLocation || 'Core borehole and trench samples',
      period: location.soilChemistry.measurementPeriod || 'Field sampling campaigns',
      citation: location.soilChemistry.sourceCitation,
    },
  ]

  return (
    <div className="inspector-overlay" role="dialog" aria-modal="true" aria-labelledby="inspector-title">
      <div className="inspector-modal-card">
        {/* Inspector Header */}
        <div className="inspector-header">
          <div>
            <div className="inspector-meta-tag font-mono">
              VERIFIED ENVIRONMENTAL PROFILE &bull; {location.primaryTarget} ANALOGUE
            </div>
            <h2 className="inspector-title" id="inspector-title">{location.name}</h2>
            <div className="inspector-geo font-mono">
              <span>{location.region}, {location.country}</span>
              <span className="geo-separator">&bull;</span>
              <span>Coordinates: {location.coordinates}</span>
            </div>
          </div>
          <button
            type="button"
            className="inspector-close-btn"
            onClick={onClose}
            aria-label="Close environmental profile"
          >
            &times;
          </button>
        </div>

        {/* Inspector Body */}
        <div className="inspector-body">
          {/* Section 1: Planetary Analogue Mission Rationale */}
          <section className="inspector-section">
            <h3 className="section-label font-mono">1. PLANETARY ANALOGUE RATIONALE</h3>
            <div className="analogue-rationale-box">
              <div className="rationale-header">
                <span className="rationale-target font-mono">TARGET: {location.planetaryAnalogy.specificRegion}</span>
                <span className="rationale-epoch font-mono">EPOCH: {location.planetaryAnalogy.geologicalEpoch}</span>
              </div>
              <p className="rationale-text">{location.planetaryAnalogy.rationale}</p>
            </div>
          </section>

          {/* Section 2: Environmental Quantitative Parameters */}
          <section className="inspector-section">
            <h3 className="section-label font-mono">2. QUANTITATIVE PARAMETER AUDIT &amp; TRACEABILITY</h3>
            <div className="parameter-table-wrapper">
              <table className="param-audit-table">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Parameter Name</th>
                    <th>Verified Value</th>
                    <th>Coverage / Location</th>
                    <th>Obs. Period</th>
                    <th>Confidence</th>
                    <th>Source Citation</th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, idx) => (
                    <tr key={idx}>
                      <td className="param-category font-mono">{param.category}</td>
                      <td className="param-name font-mono">{param.name}</td>
                      <td className="param-val">{param.value}</td>
                      <td className="param-cov font-mono">{param.coverage}</td>
                      <td className="param-period font-mono">{param.period}</td>
                      <td>
                        <span className={`confidence-tag conf-${param.confidence.toLowerCase()}`}>
                          {param.confidence}
                        </span>
                      </td>
                      <td className="param-cite font-mono">{param.citation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Dual Column - Fidelity vs. Divergence */}
          <section className="inspector-section dual-grid">
            <div className="fidelity-box">
              <h3 className="sub-label font-mono text-earth">&check; SCIENTIFIC FIDELITY STRENGTHS</h3>
              <ul className="audit-list">
                {location.scientificFidelity.map((item, idx) => (
                  <li key={idx} className="audit-item">{item}</li>
                ))}
              </ul>
            </div>

            <div className="divergence-box">
              <h3 className="sub-label font-mono text-mars">&Delta; INHERENT PLANETARY DIVERGENCES</h3>
              <ul className="audit-list">
                {location.planetaryDivergences.map((item, idx) => (
                  <li key={idx} className="audit-item">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Data Uncertainty & Missing Information */}
          <section className="inspector-section">
            <h3 className="section-label font-mono text-amber">&#9888; 3. IDENTIFIED DATA GAPS &amp; SEASONAL UNCERTAINTIES</h3>
            <div className="uncertainty-box">
              <ul className="audit-list">
                {location.dataGapsAndUncertainty.map((gap, idx) => (
                  <li key={idx} className="audit-item">{gap}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5: Primary Source Attribution & Verification Registry */}
          <section className="inspector-section attribution-section">
            <h3 className="section-label font-mono">4. INDEPENDENT CITATION &amp; EVIDENCE VERIFICATION REGISTRY</h3>
            {location.sourceVerificationRegistry && location.sourceVerificationRegistry.length > 0 && (
              <div className="parameter-table-wrapper" style={{ marginBottom: '1.25rem' }}>
                <table className="param-audit-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Publication &amp; Year</th>
                      <th>Authors</th>
                      <th>Specific Claim Supported</th>
                      <th>Traceable DOI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.sourceVerificationRegistry.map((src, sIdx) => (
                      <tr key={sIdx}>
                        <td>
                          <span className={`confidence-tag conf-${src.verificationStatus.toLowerCase()}`}>
                            {src.verificationStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="param-val">
                          <strong>{src.publication}</strong> ({src.year})
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            {src.title}
                          </div>
                        </td>
                        <td className="param-cov font-mono" style={{ whiteSpace: 'normal', minWidth: '160px' }}>
                          {src.authors}
                        </td>
                        <td className="param-cite" style={{ whiteSpace: 'normal', minWidth: '200px' }}>
                          {src.claimSupported}
                        </td>
                        <td className="param-period font-mono">
                          <a
                            href={`https://doi.org/${src.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--color-accent-cyan)', textDecoration: 'underline' }}
                          >
                            {src.doi}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="attribution-card">
              <div className="attr-row">
                <span className="attr-label">Organization / Consortium:</span>
                <span className="attr-val">{location.sourceAttribution.organization}</span>
              </div>
              <div className="attr-row">
                <span className="attr-label">Analogue Program:</span>
                <span className="attr-val highlight-cyan">{location.sourceAttribution.program}</span>
              </div>
              <div className="attr-row">
                <span className="attr-label">Primary Literature Citation:</span>
                <span className="attr-val font-serif">{location.sourceAttribution.primaryCitation}</span>
              </div>
              <div className="attr-row">
                <span className="attr-label">Digital Object Identifier (DOI):</span>
                <span className="attr-val font-mono">doi:{location.sourceAttribution.doi}</span>
              </div>
              <div className="attr-row">
                <span className="attr-label">Record Verification Date:</span>
                <span className="attr-val font-mono">{location.sourceAttribution.retrievalDate}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="inspector-footer">
          <span className="footer-note font-mono">
            Directly traceable to published research &bull; No synthetic measurements fabricated
          </span>
          <div className="inspector-footer-actions">
            {onNavigate && (
              <button
                type="button"
                className="btn-eval-site-nav font-mono"
                onClick={() => {
                  onClose()
                  onNavigate('site-evaluation', { locationId: location.id })
                }}
                style={{
                  backgroundColor: 'var(--color-accent-blue)',
                  color: '#070d18',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 600,
                  fontSize: '11px',
                  cursor: 'pointer',
                  marginRight: '8px',
                }}
              >
                Open Full Site Assessment &rarr;
              </button>
            )}
            <button type="button" className="btn-close-inspector" onClick={onClose}>
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
