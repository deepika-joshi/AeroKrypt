import { useState } from 'react'
import StatusBadge from '../common/StatusBadge.jsx'

export default function CandidateMatchCard({
  matchResult,
  isSelectedForCompare,
  onToggleCompare,
  onInspectProfile,
  isPreFocused,
  onNavigate,
}) {
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false)
  const {
    location,
    overallAlignment,
    matchSummary,
    complianceIndicator,
    geologicalSimilarity,
    operationalSuitability,
    planetaryEquivalenceWarning,
    whyItMatches,
    whyItDiverges,
    missingData,
  } = matchResult

  return (
    <article
      className={`candidate-card ${isPreFocused ? 'pre-focused' : ''} ${
        isSelectedForCompare ? 'selected-for-compare' : ''
      }`}
      id={`candidate-${location.id}`}
    >
      {/* Top Banner: Alignment Status & Match Counts */}
      <div className="candidate-card-top">
        <div className="candidate-card-title-group">
          <div className="candidate-meta-line">
            <span className="candidate-target-body font-mono">
              {location.primaryTarget} ANALOGUE
            </span>
            <span className="candidate-geo">
              {location.region}, {location.country}
            </span>
          </div>
          <h3 className="candidate-name">{location.name}</h3>
          <span className="candidate-coords font-mono">{location.coordinates}</span>
        </div>

        <div className="candidate-alignment-status">
          <StatusBadge
            variant={overallAlignment.badgeVariant}
            label={overallAlignment.label}
            size="sm"
          />
          <div className="match-counter font-mono">
            <span className="count-match">{matchSummary.matchCount} Matched</span>
            {matchSummary.partialCount > 0 && (
              <span className="count-partial">&bull; {matchSummary.partialCount} Partial</span>
            )}
            {matchSummary.mismatchCount > 0 && (
              <span className="count-mismatch">&bull; {matchSummary.mismatchCount} Divergent</span>
            )}
            {matchSummary.unavailableCount > 0 && (
              <span className="count-unavailable">&bull; {matchSummary.unavailableCount} Gaps</span>
            )}
          </div>
          {geologicalSimilarity && operationalSuitability && (
            <div className="sub-alignment-chips font-mono">
              {complianceIndicator && (
                <span
                  className="sub-chip compliance-chip"
                  title={complianceIndicator.disclaimer}
                >
                  Compliance: {complianceIndicator.displayLabel || `${complianceIndicator.percentage}% (${matchSummary.matchCount}/${matchSummary.totalEvaluated} criteria)`}
                </span>
              )}
              {complianceIndicator?.evidenceDepth?.isPreliminary && (
                <span
                  className="sub-chip depth-preliminary"
                  title={complianceIndicator.evidenceDepth.warning}
                >
                  &Delta; Low Evidence Depth ({complianceIndicator.totalCriteria} criteria)
                </span>
              )}
              <span className="sub-chip">Geology: {geologicalSimilarity.rating}</span>
              <span className="sub-chip">Operations: {operationalSuitability.slopeCompliance}</span>
            </div>
          )}
        </div>
      </div>

      {/* Environmental Metric Badges with Traceable Confidence */}
      <div className="candidate-specs-strip">
        <div className="spec-pill">
          <span className="spec-pill-label">Elevation</span>
          <span className="spec-pill-value font-mono">{location.elevation.label}</span>
          <span className={`spec-pill-conf conf-${location.elevation.status.toLowerCase()}`}>
            {location.elevation.status}
          </span>
        </div>
        <div className="spec-pill">
          <span className="spec-pill-label">Slope Gradient</span>
          <span className="spec-pill-value font-mono">{location.slope.label}</span>
          <span className={`spec-pill-conf conf-${location.slope.status.toLowerCase()}`}>
            {location.slope.status}
          </span>
        </div>
        <div className="spec-pill">
          <span className="spec-pill-label">Mean Annual Temp</span>
          <span className="spec-pill-value font-mono">{location.meanAnnualTemp.label}</span>
          <span className={`spec-pill-conf conf-${location.meanAnnualTemp.status.toLowerCase()}`}>
            {location.meanAnnualTemp.status}
          </span>
        </div>
        <div className="spec-pill">
          <span className="spec-pill-label">Precipitation</span>
          <span className="spec-pill-value font-mono">{location.annualPrecipitation.label}</span>
          <span className={`spec-pill-conf conf-${location.annualPrecipitation.status.toLowerCase()}`}>
            {location.annualPrecipitation.status}
          </span>
        </div>
      </div>

      {/* Terrain & Planetary Analogy Description */}
      <div className="candidate-description-block">
        <div className="desc-row">
          <span className="desc-label">Terrain &amp; Lithology:</span>
          <span className="desc-value">{location.terrainType} ({location.lithology.slice(0, 3).join(', ')})</span>
        </div>
        <div className="desc-row">
          <span className="desc-label">Target Analogy:</span>
          <span className="desc-value highlight-cyan">{location.planetaryAnalogy.specificRegion}</span>
        </div>
      </div>

      {/* Transparent Match / Divergence Summary */}
      <div className="candidate-evidence-summary">
        {whyItMatches.length > 0 && (
          <div className="evidence-bullet-group match-group">
            <span className="evidence-group-title">
              <span className="icon-check" aria-hidden="true">&check;</span> Primary Match Evidence:
            </span>
            <ul className="evidence-list">
              {whyItMatches.slice(0, isEvidenceExpanded ? undefined : 2).map((item, idx) => (
                <li key={idx} className="evidence-item match-item">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {whyItDiverges.length > 0 && (
          <div className="evidence-bullet-group diverge-group">
            <span className="evidence-group-title">
              <span className="icon-diverge" aria-hidden="true">&Delta;</span> Known Planetary Divergences:
            </span>
            <ul className="evidence-list">
              {whyItDiverges.slice(0, isEvidenceExpanded ? undefined : 2).map((item, idx) => (
                <li key={idx} className="evidence-item diverge-item">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {missingData.length > 0 && (
          <div className="evidence-bullet-group gap-group">
            <span className="evidence-group-title">
              <span className="icon-gap" aria-hidden="true">&#9888;</span> Missing Information &amp; Uncertainty:
            </span>
            <ul className="evidence-list">
              {missingData.slice(0, isEvidenceExpanded ? undefined : 1).map((item, idx) => (
                <li key={idx} className="evidence-item gap-item">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {complianceIndicator?.evidenceDepth?.isPreliminary && (
          <div className="preliminary-evidence-notice font-mono">
            <strong>PRELIMINARY FILTERING ({complianceIndicator.totalCriteria} criteria evaluated):</strong> High compliance on limited criteria does NOT indicate overall mission readiness. Add target rock types, slope thresholds, or operational objectives for multi-factor evaluation.
          </div>
        )}

        {planetaryEquivalenceWarning && isEvidenceExpanded && (
          <div className="planetary-warning-banner font-mono">
            <strong>PLANETARY REALITY CAVEAT:</strong> {planetaryEquivalenceWarning}
          </div>
        )}

        {(whyItMatches.length > 2 || whyItDiverges.length > 2 || missingData.length > 1) && (
          <button
            type="button"
            className="expand-evidence-btn"
            onClick={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
          >
            {isEvidenceExpanded ? 'Collapse Evidence Details ▲' : 'Show All Match & Divergence Evidence ▼'}
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div className="candidate-card-footer">
        <label className="compare-checkbox-label">
          <input
            type="checkbox"
            checked={isSelectedForCompare}
            onChange={() => onToggleCompare(location.id)}
            className="form-checkbox"
          />
          <span>Select to Compare</span>
        </label>

        <div className="card-action-buttons">
          <button
            type="button"
            className="action-inspect-btn"
            onClick={() => onInspectProfile(location.id)}
          >
            Inspect Profile &rarr;
          </button>
          {onNavigate && (
            <button
              type="button"
              className="action-eval-btn font-mono"
              onClick={() => onNavigate('site-evaluation', { locationId: location.id })}
            >
              Evaluate Site &rarr;
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
