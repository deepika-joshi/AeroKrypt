export default function SiteReportModal({
  isOpen,
  onClose,
  evaluationData,
}) {
  if (!isOpen || !evaluationData) return null

  const {
    location,
    experiment,
    parameters,
    geologicalSimilarity,
    operationalSuitability,
    missingCriticalParameters,
    planetaryDivergence,
    evidenceRegistry,
    assessmentSummary,
    generatedDate = '2026-11-13',
  } = evaluationData

  const handlePrint = () => {
    window.print()
  }

  const currentDate = generatedDate
  const reportId = `TL-SAR-${location.id.toUpperCase()}-${currentDate.replace(/-/g, '')}`

  return (
    <div className="report-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Screen Controls */}
        <div className="report-screen-controls no-print">
          <div className="controls-left">
            <span className="doc-id font-mono">Dossier ID: {reportId}</span>
            <span className="badge-source font-mono">DEMO / Curated Sample Report</span>
          </div>
          <div className="controls-right">
            <button
              type="button"
              className="btn-print-report font-mono"
              onClick={handlePrint}
            >
              &#128438; Print / Save as PDF
            </button>
            <button
              type="button"
              className="btn-close-modal font-mono"
              onClick={onClose}
            >
              &times; Close
            </button>
          </div>
        </div>

        {/* Printable Formal Document */}
        <div className="printable-report-document" id="printable-dossier">
          {/* Memorandum Header */}
          <header className="report-memo-header">
            <div className="memo-top-line">
              <span className="agency-title font-mono">TERRALAB PLANETARY ANALOGUE RESEARCH PLATFORM &bull; DEMO MODE</span>
              <span className="doc-security font-mono">CURATED RESEARCH SAMPLE &bull; NOT OPERATIONAL FLIGHT QUALIFICATION</span>
            </div>
            <h1 className="memo-title">SCIENTIFIC SITE ASSESSMENT DOSSIER</h1>
            <div className="memo-meta-grid font-mono">
              <div className="memo-meta-cell">
                <span className="meta-label">DOCUMENT NUMBER:</span>
                <span className="meta-val">{reportId}</span>
              </div>
              <div className="memo-meta-cell">
                <span className="meta-label">ASSESSMENT DATE:</span>
                <span className="meta-val">{currentDate}</span>
              </div>
              <div className="memo-meta-cell">
                <span className="meta-label">TARGET ANALOGUE:</span>
                <span className="meta-val">{location.name}</span>
              </div>
              <div className="memo-meta-cell">
                <span className="meta-label">TARGET PLANETARY BODY:</span>
                <span className="meta-val">{location.primaryTarget}</span>
              </div>
              <div className="memo-meta-cell">
                <span className="meta-label">EVALUATION CONTEXT:</span>
                <span className="meta-val">{experiment ? experiment.title : 'General Environmental Baseline'}</span>
              </div>
              <div className="memo-meta-cell">
                <span className="meta-label">GEODETIC DATUM:</span>
                <span className="meta-val">{location.geographicBoundaries?.geodeticDatum || 'WGS 84'}</span>
              </div>
              <div className="memo-meta-cell" style={{ gridColumn: 'span 2' }}>
                <span className="meta-label">DATASET TIER:</span>
                <span className="meta-val">DEMO / CURATED LITERATURE REGISTRY v0.1 (Zero Fabricated In-Situ Readings)</span>
              </div>
            </div>
          </header>

          {/* Section 1: Geographical Boundaries & Geodesy */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">1. GEODESY &amp; GEOGRAPHICAL BOUNDARIES</h2>
            <div className="report-text-block">
              <p>
                <strong>Coordinates:</strong> {location.coordinates} &bull; <strong>Region:</strong> {location.region}, {location.country}
              </p>
              {location.geographicBoundaries && (
                <>
                  <p>
                    <strong>Bounding Box (WGS 84):</strong> North: {location.geographicBoundaries.boundingBox?.north} | South: {location.geographicBoundaries.boundingBox?.south} | West: {location.geographicBoundaries.boundingBox?.west} | East: {location.geographicBoundaries.boundingBox?.east}
                    <br />
                    <strong>Coverage Area:</strong> {location.geographicBoundaries.coverageAreaKm2} &bull; <strong>Jurisdiction:</strong> {location.geographicBoundaries.jurisdiction}
                  </p>
                  <p>
                    <strong>Boundary Classification:</strong> {location.geographicBoundaries.boundaryClassification || 'Developer-Defined Bounding Box (Informal Research Area)'}
                    <br />
                    <strong>Boundary Authority / Survey Evidence:</strong> {location.geographicBoundaries.boundarySource || 'Developer-defined rectangular bounding envelope; not an officially surveyed statutory boundary.'}
                  </p>
                </>
              )}
              <p>
                <strong>Terrain &amp; Geomorphology:</strong> {location.terrainType}
                <br />
                <strong>Geological Setting:</strong> {location.geologicalContext}
              </p>
            </div>
          </section>

          {/* Section 2: Dual-Domain Evaluation */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">2. DUAL-DOMAIN EVALUATION: GEOLOGY VS. OPERATIONS</h2>
            <div className="report-dual-table">
              <div className="dual-box">
                <h3 className="dual-title font-mono">Geological Similarity: {geologicalSimilarity.lithologyMatch}</h3>
                <p><strong>Target Analogue Region:</strong> {geologicalSimilarity.specificTargetRegion}</p>
                <p><strong>Geological Epoch:</strong> {geologicalSimilarity.geologicalEpoch}</p>
                <p><strong>Matched Rock Units:</strong> {geologicalSimilarity.matchedRockTypes.join(', ') || 'None'}</p>
                <p><strong>Mineralogical Baseline:</strong> {geologicalSimilarity.mineralogicalFidelity}</p>
              </div>
              <div className="dual-box">
                <h3 className="dual-title font-mono">Operational Suitability: {operationalSuitability.slopeStatus}</h3>
                <p><strong>Field Precedent:</strong> {operationalSuitability.conopsStatus}</p>
                <p><strong>Topography:</strong> {location.slope.label}</p>
                <p><strong>Mobility &amp; ConOps Notes:</strong> {operationalSuitability.trafficabilityNotes}</p>
                <p><strong>Thermal Envelope:</strong> {location.meanAnnualTemp.label}</p>
              </div>
            </div>
          </section>

          {/* Section 3: Traceable Environmental Parameters */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">3. AUDITED ENVIRONMENTAL PARAMETERS</h2>
            <table className="report-table font-mono">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value &amp; Unit</th>
                  <th>Status</th>
                  <th>Coverage / Station Location</th>
                  <th>Obs. Baseline</th>
                  <th>Traceable Citation</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param) => (
                  <tr key={param.id}>
                    <td>{param.name}</td>
                    <td><strong>{param.displayValue}</strong> ({param.unit})</td>
                    <td>{param.confidence}</td>
                    <td>{param.coverage}</td>
                    <td>{param.period}</td>
                    <td className="font-serif">{param.citation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 4: Planetary Physical Divergence Matrix */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">4. INHERENT PLANETARY DIVERGENCE MATRIX</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Physical Parameter</th>
                  <th>Earth Site Baseline</th>
                  <th>Planetary Condition ({planetaryDivergence.targetBody})</th>
                  <th>Divergence Ratio</th>
                  <th>Hardware &amp; ConOps Impact</th>
                </tr>
              </thead>
              <tbody>
                {planetaryDivergence.divergences.map((div, idx) => (
                  <tr key={idx}>
                    <td className="font-mono"><strong>{div.parameter}</strong></td>
                    <td className="font-mono">{div.earthSite}</td>
                    <td className="font-mono">{div.planetaryTarget}</td>
                    <td className="font-mono">{div.divergenceRatio}</td>
                    <td>{div.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 5: Missing Critical Parameters */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">5. MISSING CRITICAL PARAMETERS &amp; UNCERTAINTIES</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Missing Parameter</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Why It Matters for Mission Validity</th>
                </tr>
              </thead>
              <tbody>
                {missingCriticalParameters.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-mono"><strong>{item.parameterName}</strong></td>
                    <td className="font-mono">{item.importance}</td>
                    <td className="font-mono">{item.currentStatus}</td>
                    <td>{item.experimentalImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 6: Synthesis Summary */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">6. SYNTHESIS ASSESSMENT</h2>
            <div className="report-text-block">
              <p><strong>Key Strengths:</strong></p>
              <ul>
                {assessmentSummary.keyStrengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
              <p><strong>Operational Limitations:</strong></p>
              <ul>
                {assessmentSummary.operationalLimitations.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
              <p><strong>Mission Execution Risks:</strong></p>
              <ul>
                {assessmentSummary.executionRisks.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
              <p><strong>Recommended Gap-Closing In-Situ Surveys:</strong></p>
              <ul>
                {assessmentSummary.recommendedFieldMeasurements.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
              <p className="font-mono text-muted" style={{ fontSize: '0.8rem', marginTop: '12px' }}>
                {assessmentSummary.scientificMethodologyNotice}
              </p>
            </div>
          </section>

          {/* Section 7: Peer-Reviewed Evidence Registry */}
          <section className="report-section">
            <h2 className="report-section-heading font-mono">7. INDEPENDENT EVIDENCE REGISTRY</h2>
            <table className="report-table font-mono" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Publication &amp; Year</th>
                  <th>Authors</th>
                  <th>Supported Claim</th>
                  <th>Traceable DOI Link</th>
                </tr>
              </thead>
              <tbody>
                {evidenceRegistry.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="font-mono" style={{ fontSize: '0.7rem', padding: '2px 4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                        {item.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {item.publication} ({item.year})
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.title}</div>
                    </td>
                    <td>{item.authors}</td>
                    <td>{item.claimSupported}</td>
                    <td>
                      <a
                        href={`https://doi.org/${item.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0284c7', textDecoration: 'underline' }}
                      >
                        doi:{item.doi} &rarr;
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Verification Sign-Off Block */}
          <footer className="report-signoff-block font-mono">
            <div className="signoff-col">
              <span className="signoff-label">PREPARED BY:</span>
              <span className="signoff-line">TERRALAB Planetary Analogue Research Platform</span>
              <span className="signoff-date">Date Generated: {currentDate} &bull; Curated Sample v0.1</span>
            </div>
            <div className="signoff-col">
              <span className="signoff-label">INVESTIGATOR ATTESTATION:</span>
              <span className="signoff-line">[ Curated Analogue Literature Sample Baseline &bull; Pre-Mission Planning Mode ]</span>
              <span className="signoff-date">TERRALAB Demonstration Tier &bull; Zero Fabricated In-Situ Sensor Data</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
