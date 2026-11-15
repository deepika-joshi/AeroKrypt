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

  const isMars = location.analogueRelevance === 'MARS' || (location.targetBodies && location.targetBodies.includes('Mars') && !location.targetBodies.includes('Moon'))
  const isMoon = location.analogueRelevance === 'MOON' || (location.targetBodies && !location.targetBodies.includes('Mars') && location.targetBodies.includes('Moon'))

  const targetBodyBadgeColor = isMars ? '#A94C34' : isMoon ? '#AEBAC8' : '#D6A66B'
  const targetBodyBadgeBg = isMars ? 'rgba(169, 76, 52, 0.16)' : isMoon ? 'rgba(174, 186, 200, 0.14)' : 'rgba(214, 166, 107, 0.16)'

  return (
    <article
      className={`candidate-card reveal-on-scroll ${isPreFocused ? 'pre-focused' : ''} ${
        isSelectedForCompare ? 'selected-for-compare' : ''
      }`}
      id={`candidate-${location.id}`}
    >
      {/* =========================================================================
          A. CARD HEADER: Name, Region, Analogue Category & Coordinates
          ========================================================================= */}
      <div className="candidate-card-top">
        <div className="candidate-card-title-group">
          <div className="candidate-meta-line" style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              className="candidate-target-body font-mono"
              style={{
                color: targetBodyBadgeColor,
                backgroundColor: targetBodyBadgeBg,
                border: `1px solid ${targetBodyBadgeColor}44`,
                padding: '2px 7px',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.04em',
              }}
            >
              {location.analogueRelevance ? `${location.analogueRelevance} ANALOGUE` : `${location.primaryTarget} ANALOGUE`}
            </span>
            <span
              className="candidate-category-badge font-mono"
              style={{
                fontSize: '9.5px',
                padding: '2px 6px',
                borderRadius: '3px',
                background: location.locationCategory === 'RESEARCH_FACILITY' ? 'rgba(196, 146, 85, 0.15)' : 'rgba(214, 166, 107, 0.1)',
                color: location.locationCategory === 'RESEARCH_FACILITY' ? '#C49255' : 'var(--champagne-gold, #D6A66B)',
                border: `1px solid ${location.locationCategory === 'RESEARCH_FACILITY' ? 'rgba(196, 146, 85, 0.35)' : 'rgba(214, 166, 107, 0.25)'}`,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {location.locationCategory === 'RESEARCH_FACILITY' ? 'RESEARCH FACILITY' : 'NATURAL FIELD SITE'}
            </span>
            {location.verificationStatus && (
              <span
                className="candidate-verif-badge font-mono"
                style={{
                  fontSize: '9.5px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: location.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(250, 204, 21, 0.12)',
                  color: location.verificationStatus === 'VERIFIED' ? '#4ade80' : '#facc15',
                  border: `1px solid ${location.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.35)' : 'rgba(250, 204, 21, 0.35)'}`,
                  fontWeight: 600,
                }}
              >
                {location.verificationStatus}
              </span>
            )}
            <span className="candidate-geo">
              {location.region}, <strong style={{ color: '#F2E5D5' }}>{location.country}</strong>
            </span>
          </div>

          <h3 className="candidate-name">{location.name}</h3>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
            <span className="candidate-coords font-mono">{location.coordinates}</span>
            {location.userSuppliedCoordinates && (
              <span className="font-mono" style={{ color: 'var(--text-muted, #9E9287)', fontSize: '10px' }}>
                [Ref: {location.userSuppliedCoordinates.latitude}, {location.userSuppliedCoordinates.longitude}]
              </span>
            )}
          </div>
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

      {/* =========================================================================
          B. QUANTITATIVE TERRAIN SPECS STRIP
          ========================================================================= */}
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

      {/* =========================================================================
          C. TERRAIN CLASSIFICATION & GEOLOGICAL CHARACTERISTICS
          ========================================================================= */}
      <div className="candidate-description-block">
        <div className="desc-row">
          <span className="desc-label">Terrain &amp; Lithology:</span>
          <span className="desc-value">{location.terrainType} ({location.lithology.slice(0, 3).join(', ')})</span>
        </div>
        <div className="desc-row">
          <span className="desc-label">Target Analogy:</span>
          <span className="desc-value highlight-cyan" style={{ color: 'var(--champagne-gold, #D6A66B)' }}>
            {location.planetaryAnalogy.specificRegion}
          </span>
        </div>
      </div>

      {/* =========================================================================
          D. PLANETARY RELEVANCE & TRANSPARENT EVIDENCE SUMMARY
          ========================================================================= */}
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
            className="expand-evidence-btn font-mono"
            onClick={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
          >
            {isEvidenceExpanded ? 'Collapse Evidence Details ▲' : 'Show All Match & Divergence Evidence ▼'}
          </button>
        )}
      </div>

      {/* =========================================================================
          E. CARD ACTIONS: Compare Checkbox, Inspect Profile & Evaluate Site
          ========================================================================= */}
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
            className="action-inspect-btn font-mono"
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
