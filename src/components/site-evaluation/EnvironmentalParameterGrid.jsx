import { useState } from 'react'

export default function EnvironmentalParameterGrid({ parameters }) {
  const [domainFilter, setDomainFilter] = useState('ALL')
  const [confidenceFilter, setConfidenceFilter] = useState('ALL')

  if (!parameters || parameters.length === 0) return null

  const filtered = parameters.filter((param) => {
    if (domainFilter !== 'ALL' && param.domain !== domainFilter) return false
    if (confidenceFilter !== 'ALL' && param.confidence !== confidenceFilter) return false
    return true
  })

  const domains = ['ALL', 'TOPOGRAPHY', 'CLIMATE', 'ATMOSPHERE', 'RADIATION', 'GEOCHEMISTRY']
  const confidences = ['ALL', 'MEASURED', 'SOURCED', 'ESTIMATED', 'UNAVAILABLE']

  // Summary counts
  const measuredCount = parameters.filter((p) => p.confidence === 'MEASURED').length
  const sourcedCount = parameters.filter((p) => p.confidence === 'SOURCED').length
  const estimatedCount = parameters.filter((p) => p.confidence === 'ESTIMATED').length
  const unavailableCount = parameters.filter((p) => p.confidence === 'UNAVAILABLE').length

  return (
    <div className="parameter-grid-section">
      <div className="section-title-wrap">
        <div className="section-title-row">
          <h3 className="section-title font-mono">
            TRACEABLE ENVIRONMENTAL &amp; PHYSICAL PARAMETERS
          </h3>
          <div className="confidence-summary-badges font-mono">
            <span className="conf-count conf-measured">{measuredCount} Measured</span>
            <span className="conf-count conf-sourced">{sourcedCount} Sourced</span>
            <span className="conf-count conf-estimated">{estimatedCount} Estimated</span>
            {unavailableCount > 0 && (
              <span className="conf-count conf-unavailable">{unavailableCount} Unavailable</span>
            )}
          </div>
        </div>
        <p className="section-subtitle">
          Every numerical value carries SI units, specific measurement coordinates, observation baseline period, and an audited confidence classification.
        </p>
      </div>

      {/* Confidence Legend Bar */}
      <div className="confidence-legend-bar font-mono">
        <span className="legend-title">AUDIT CLASSIFICATION:</span>
        <span className="legend-item">
          <span className="legend-pill conf-measured">MEASURED</span> Direct in-situ sensor/trench data
        </span>
        <span className="legend-item">
          <span className="legend-pill conf-sourced">SOURCED</span> Official survey/observatory baseline
        </span>
        <span className="legend-item">
          <span className="legend-pill conf-estimated">ESTIMATED</span> Regional climate/topographic model
        </span>
        <span className="legend-item">
          <span className="legend-pill conf-unavailable">UNAVAILABLE</span> Uncataloged at site coordinates
        </span>
      </div>

      {/* Filter Control Bar */}
      <div className="parameter-filters-bar">
        <div className="filter-group">
          <span className="filter-label font-mono">Domain:</span>
          <div className="filter-pills font-mono">
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                className={`filter-btn ${domainFilter === dom ? 'active' : ''}`}
                onClick={() => setDomainFilter(dom)}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label font-mono">Confidence:</span>
          <div className="filter-pills font-mono">
            {confidences.map((conf) => (
              <button
                key={conf}
                type="button"
                className={`filter-btn ${confidenceFilter === conf ? 'active' : ''}`}
                onClick={() => setConfidenceFilter(conf)}
              >
                {conf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parameter Table */}
      <div className="parameter-table-container">
        <table className="site-parameter-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Parameter Name</th>
              <th>Documented Value</th>
              <th>Unit</th>
              <th>Confidence</th>
              <th>Observation Location</th>
              <th>Observation Period</th>
              <th>Traceable Source Citation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((param) => (
              <tr key={param.id} className={`param-row conf-row-${param.confidence.toLowerCase()}`}>
                <td className="param-domain font-mono">{param.domain}</td>
                <td className="param-name font-mono">
                  <strong>{param.name}</strong>
                  <div className="param-relevance">{param.experimentalRelevance}</div>
                </td>
                <td className="param-value font-mono highlight-val">{param.displayValue}</td>
                <td className="param-unit font-mono">{param.unit}</td>
                <td>
                  <span className={`confidence-tag conf-${param.confidence.toLowerCase()}`}>
                    {param.confidence}
                  </span>
                </td>
                <td className="param-loc font-mono">{param.coverage}</td>
                <td className="param-period font-mono">{param.period}</td>
                <td className="param-cite font-mono">{param.citation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

