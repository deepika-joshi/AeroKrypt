export default function AssessmentSummaryCard({ assessmentSummary, experiment }) {
  if (!assessmentSummary) return null

  return (
    <div className="assessment-summary-section">
      <div className="section-title-wrap">
        <div className="section-title-row">
          <h3 className="section-title font-mono">
            SYNTHESIS ASSESSMENT: STRENGTHS, LIMITATIONS, RISKS &amp; FIELD GAPS
          </h3>
          <span className="badge-source font-mono">
            {experiment ? `Protocol: ${experiment.title}` : 'Baseline Summary'}
          </span>
        </div>
        <p className="section-subtitle">
          Holistic scientific evaluation synthesizing field advantages, terrestrial constraints, execution risks, and required field surveys.
        </p>
      </div>

      {/* Scientific Method Notice */}
      <div className="methodology-disclaimer-box font-mono">
        <div className="methodology-title">SCIENTIFIC METHODOLOGY &amp; SCORING POLICY</div>
        <p>{assessmentSummary.scientificMethodologyNotice}</p>
      </div>

      <div className="synthesis-quad-grid">
        {/* Strengths */}
        <div className="synthesis-quad-card card-strengths">
          <div className="quad-card-header font-mono">
            <span className="quad-icon text-earth">&check;</span>
            <h4>VERIFIED SITE STRENGTHS</h4>
          </div>
          <ul className="quad-list">
            {assessmentSummary.keyStrengths.map((item, idx) => (
              <li key={idx} className="quad-list-item">{item}</li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="synthesis-quad-card card-limitations">
          <div className="quad-card-header font-mono">
            <span className="quad-icon text-orange">&Delta;</span>
            <h4>OPERATIONAL LIMITATIONS</h4>
          </div>
          <ul className="quad-list">
            {assessmentSummary.operationalLimitations.map((item, idx) => (
              <li key={idx} className="quad-list-item">{item}</li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="synthesis-quad-card card-risks">
          <div className="quad-card-header font-mono">
            <span className="quad-icon text-red">&#9888;</span>
            <h4>MISSION EXECUTION RISKS</h4>
          </div>
          <ul className="quad-list">
            {assessmentSummary.executionRisks.map((item, idx) => (
              <li key={idx} className="quad-list-item">{item}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Further Measurements */}
        <div className="synthesis-quad-card card-measurements">
          <div className="quad-card-header font-mono">
            <span className="quad-icon text-cyan">&rarr;</span>
            <h4>RECOMMENDED FIELD SURVEYS</h4>
          </div>
          <ul className="quad-list">
            {assessmentSummary.recommendedFieldMeasurements.map((item, idx) => (
              <li key={idx} className="quad-list-item">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
