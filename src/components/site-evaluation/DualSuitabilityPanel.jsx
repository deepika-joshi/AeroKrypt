export default function DualSuitabilityPanel({ geologicalSimilarity, operationalSuitability, experiment }) {
  if (!geologicalSimilarity || !operationalSuitability) return null

  return (
    <div className="dual-suitability-section">
      <div className="section-title-wrap">
        <h3 className="section-title font-mono">
          DUAL-DOMAIN EVALUATION: GEOLOGICAL SIMILARITY VS. OPERATIONAL SUITABILITY
        </h3>
        <p className="section-subtitle">
          Aerospace analogue qualification strictly separates mineralogical and environmental fidelity from vehicle mobility, safety envelopes, and testing ConOps.
        </p>
      </div>

      <div className="dual-suitability-grid">
        {/* Panel 1: Geological Similarity */}
        <div className="suitability-panel geo-panel">
          <div className="panel-header">
            <div className="panel-header-title">
              <span className="domain-tag font-mono">DOMAIN 1: GEOLOGY &amp; LITHOLOGY</span>
              <h4 className="panel-heading">Geological Similarity Assessment</h4>
            </div>
            <span className={`rating-badge rating-${geologicalSimilarity.lithologyMatch.toLowerCase()}`}>
              Similarity: {geologicalSimilarity.lithologyMatch}
            </span>
          </div>

          <div className="panel-body">
            <div className="field-group">
              <span className="field-label">Target Analogue Epoch:</span>
              <span className="field-value highlight-cyan font-mono">{geologicalSimilarity.geologicalEpoch}</span>
            </div>

            <div className="field-group">
              <span className="field-label">Primary Planetary Target Region:</span>
              <span className="field-value">{geologicalSimilarity.specificTargetRegion}</span>
            </div>

            <div className="field-group">
              <span className="field-label">Substrate Lithological Match:</span>
              <div className="rock-tag-list">
                {geologicalSimilarity.matchedRockTypes.map((rock, idx) => (
                  <span key={idx} className="rock-tag match font-mono">
                    &check; {rock}
                  </span>
                ))}
                {geologicalSimilarity.divergentRockTypes.map((rock, idx) => (
                  <span key={idx} className="rock-tag divergent font-mono">
                    &Delta; {rock}
                  </span>
                ))}
              </div>
            </div>

            <div className="field-group">
              <span className="field-label">Mineralogical Fidelity Baseline:</span>
              <p className="field-text">{geologicalSimilarity.mineralogicalFidelity}</p>
            </div>

            <div className="field-assessment-notes">
              <strong>Geological Assessment Details:</strong>
              <p>{geologicalSimilarity.details}</p>
            </div>
          </div>
        </div>

        {/* Panel 2: Operational Testing Suitability */}
        <div className="suitability-panel ops-panel">
          <div className="panel-header">
            <div className="panel-header-title">
              <span className="domain-tag font-mono">DOMAIN 2: CONOPS &amp; FIELD TESTING</span>
              <h4 className="panel-heading">Operational Suitability Assessment</h4>
            </div>
            <span className={`rating-badge rating-${operationalSuitability.slopeStatus.toLowerCase().includes('comp') ? 'high' : 'moderate'}`}>
              Slope: {operationalSuitability.slopeStatus}
            </span>
          </div>

          <div className="panel-body">
            <div className="field-group">
              <span className="field-label">Field Trial Precedent (ConOps):</span>
              <span className="field-value highlight-orange font-mono">{operationalSuitability.conopsStatus}</span>
            </div>

            <div className="field-group">
              <span className="field-label">Topographic Gradient &amp; Tipping Safety:</span>
              <span className="field-value">{operationalSuitability.slopeStatus}</span>
            </div>

            <div className="field-group">
              <span className="field-label">Mobility &amp; Trafficability Record:</span>
              <p className="field-text">{operationalSuitability.trafficabilityNotes}</p>
            </div>

            {experiment && (
              <div className="field-group">
                <span className="field-label">Target Protocol Envelope:</span>
                <p className="field-text font-mono">
                  Max Slope Limit: {experiment.maxSlopeThreshold}° &bull; Preferred: {experiment.preferredSlopes}
                </p>
              </div>
            )}

            <div className="field-assessment-notes ops-notes">
              <strong>Operational Assessment Details:</strong>
              <p>{operationalSuitability.details}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

