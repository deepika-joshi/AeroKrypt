export default function MissingParametersCard({ missingCriticalParameters, experiment }) {
  if (!missingCriticalParameters) return null

  return (
    <div className="missing-parameters-section">
      <div className="section-title-wrap">
        <div className="section-title-row">
          <h3 className="section-title font-mono text-amber">
            &#9888; MISSING CRITICAL PARAMETERS &amp; TESTING UNCERTAINTIES
          </h3>
          <span className="badge-source font-mono">
            {experiment ? `Context: ${experiment.title}` : 'General Site Baseline'}
          </span>
        </div>
        <p className="section-subtitle">
          Critical physical and environmental measurements missing from the site baseline. Every entry explains why the missing data matters for mission protocol validity.
        </p>
      </div>

      {!experiment && (
        <div className="experiment-prompt-box">
          <p>
            <strong>Select an experiment protocol above</strong> to evaluate domain-specific critical parameters (e.g. soil shear strength for rovers, subsurface ice-table mechanics for drilling, or interior volume scans for lava tubes).
          </p>
        </div>
      )}

      <div className="missing-cards-grid">
        {missingCriticalParameters.map((item, idx) => (
          <div key={idx} className="missing-card">
            <div className="missing-card-top">
              <span className={`importance-tag imp-${item.importance.toLowerCase()}`}>
                {item.importance} PRIORITY
              </span>
              <span className="missing-status font-mono">
                Status: {item.currentStatus}
              </span>
            </div>

            <h4 className="missing-param-title font-mono">{item.parameterName}</h4>
            <span className="missing-context font-mono text-muted">
              Target Protocol: {item.experimentName}
            </span>

            <div className="missing-why-it-matters">
              <strong className="why-label font-mono">Why It Matters for the Experiment:</strong>
              <p className="why-text">{item.experimentalImpact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
