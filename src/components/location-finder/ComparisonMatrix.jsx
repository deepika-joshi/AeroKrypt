import StatusBadge from '../common/StatusBadge.jsx'

export default function ComparisonMatrix({
  selectedLocations,
  evaluatedMatches,
  onRemoveLocation,
  onClose,
  onInspectProfile,
}) {
  if (!selectedLocations || selectedLocations.length === 0) {
    return null
  }

  // Get evaluation result for each selected location
  const candidateEvaluations = selectedLocations.map((loc) => {
    const found = evaluatedMatches.find((e) => e.location.id === loc.id)
    return found || { location: loc, overallAlignment: { label: 'Evaluated', badgeVariant: 'sample' } }
  })

  return (
    <div className="comparison-overlay" role="dialog" aria-modal="true" aria-labelledby="matrix-title">
      <div className="comparison-modal-card">
        {/* Header */}
        <div className="comparison-header">
          <div>
            <div className="matrix-badge font-mono">MULTI-CANDIDATE COMPARISON MATRIX</div>
            <h2 className="comparison-title" id="matrix-title">
              Side-by-Side Planetary Analogue Evaluation ({selectedLocations.length} Candidate Sites)
            </h2>
            <p className="comparison-subtitle">
              Comparing verified environmental parameters, physical divergences, and data uncertainties.
            </p>
          </div>
          <button
            type="button"
            className="matrix-close-btn"
            onClick={onClose}
            aria-label="Close comparison matrix"
          >
            &times;
          </button>
        </div>

        {/* Matrix Table */}
        <div className="matrix-scroll-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="param-col-header">Parameter / Criteria</th>
                {candidateEvaluations.map(({ location, overallAlignment }) => (
                  <th key={location.id} className="candidate-col-header">
                    <div className="col-header-content">
                      <div className="col-header-top">
                        <span className="col-body-tag font-mono">{location.primaryTarget} ANALOGUE</span>
                        <button
                          type="button"
                          className="col-remove-btn"
                          onClick={() => onRemoveLocation(location.id)}
                          title="Remove from comparison"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="col-name">{location.name}</div>
                      <div className="col-geo">{location.region}, {location.country}</div>
                      <div className="col-badge">
                        <StatusBadge
                          variant={overallAlignment.badgeVariant}
                          label={overallAlignment.label}
                          size="xs"
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Target Planetary Analogy */}
              <tr>
                <td className="param-label-cell">
                  <strong>Planetary Analogy</strong>
                  <span className="param-desc">Target extraterrestrial surface feature</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <span className="text-highlight-cyan">{location.planetaryAnalogy.specificRegion}</span>
                    <div className="cell-subnote">{location.planetaryAnalogy.geologicalEpoch}</div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Terrain & Lithology */}
              <tr>
                <td className="param-label-cell">
                  <strong>Lithology &amp; Substrate</strong>
                  <span className="param-desc">Dominant rock units &amp; ground texture</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="cell-value-bold">{location.terrainType}</div>
                    <div className="tags-flex">
                      {location.lithology.map((rock, idx) => (
                        <span key={idx} className="cell-tag">{rock}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 3: Elevation */}
              <tr>
                <td className="param-label-cell">
                  <strong>Elevation (a.s.l.)</strong>
                  <span className="param-desc">Pressure &amp; atmospheric density proxy</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="font-mono cell-value-bold">{location.elevation.label}</div>
                    <span className={`confidence-tag conf-${location.elevation.status.toLowerCase()}`}>
                      {location.elevation.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Topographic Slope */}
              <tr>
                <td className="param-label-cell">
                  <strong>Slope Gradient</strong>
                  <span className="param-desc">Rover trafficability &amp; stability</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="font-mono cell-value-bold">{location.slope.label}</div>
                    <span className={`confidence-tag conf-${location.slope.status.toLowerCase()}`}>
                      {location.slope.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Temperature Regime */}
              <tr>
                <td className="param-label-cell">
                  <strong>Thermal Regime</strong>
                  <span className="param-desc">Annual mean and diurnal range</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="font-mono cell-value-bold">{location.meanAnnualTemp.label}</div>
                    <span className={`confidence-tag conf-${location.meanAnnualTemp.status.toLowerCase()}`}>
                      {location.meanAnnualTemp.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Annual Precipitation */}
              <tr>
                <td className="param-label-cell">
                  <strong>Annual Precipitation</strong>
                  <span className="param-desc">Aridity and moisture ceiling</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="font-mono cell-value-bold">{location.annualPrecipitation.label}</div>
                    <span className={`confidence-tag conf-${location.annualPrecipitation.status.toLowerCase()}`}>
                      {location.annualPrecipitation.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 7: Peak UV Flux */}
              <tr>
                <td className="param-label-cell">
                  <strong>Peak Solar UV Index</strong>
                  <span className="param-desc">Surface radiation degradation proxy</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="font-mono cell-value-bold">{location.uvIndexPeak.label}</div>
                    <span className={`confidence-tag conf-${location.uvIndexPeak.status.toLowerCase()}`}>
                      {location.uvIndexPeak.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 8: Primary Planetary Divergences */}
              <tr>
                <td className="param-label-cell">
                  <strong>Planetary Divergences</strong>
                  <span className="param-desc">Inherent Earth vs. Planet differences</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <ul className="cell-bullet-list">
                      {location.planetaryDivergences.map((div, idx) => (
                        <li key={idx} className="diverge-bullet">{div}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 9: Data Gaps & Uncertainty */}
              <tr>
                <td className="param-label-cell">
                  <strong>Uncertainties &amp; Gaps</strong>
                  <span className="param-desc">Missing or seasonal measurements</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <ul className="cell-bullet-list">
                      {location.dataGapsAndUncertainty.map((gap, idx) => (
                        <li key={idx} className="gap-bullet">{gap}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 10: Primary Citation */}
              <tr>
                <td className="param-label-cell">
                  <strong>Source Attribution</strong>
                  <span className="param-desc">Published scientific program</span>
                </td>
                {candidateEvaluations.map(({ location }) => (
                  <td key={location.id} className="param-data-cell">
                    <div className="cell-source-text">{location.sourceAttribution.primaryCitation}</div>
                    <div className="cell-doi font-mono">DOI: {location.sourceAttribution.doi}</div>
                    <button
                      type="button"
                      className="matrix-inspect-link"
                      onClick={() => onInspectProfile(location.id)}
                    >
                      View Full Profile &rarr;
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="comparison-footer">
          <span className="footer-disclaimer font-mono">
            Confidence tags: [MEASURED = In-situ sensors] &bull; [SOURCED = Geological survey] &bull; [ESTIMATED = Derived model]
          </span>
          <button type="button" className="btn-close-matrix" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}

