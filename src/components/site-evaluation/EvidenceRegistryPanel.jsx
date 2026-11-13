export default function EvidenceRegistryPanel({ evidenceRegistry, sourceAttribution }) {
  if (!evidenceRegistry || evidenceRegistry.length === 0) return null

  return (
    <div className="evidence-registry-section">
      <div className="section-title-wrap">
        <div className="section-title-row">
          <h3 className="section-title font-mono">
            &check; INDEPENDENT PEER-REVIEWED EVIDENCE REGISTRY
          </h3>
          <span className="badge-source font-mono">Traceable Literature Provenance</span>
        </div>
        <p className="section-subtitle">
          Every scientific claim and environmental parameter in AEROKRYPT is mapped to peer-reviewed planetary literature or official geodetic datasets.
        </p>
      </div>

      <div className="evidence-table-container">
        <table className="evidence-registry-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Publication &amp; Year</th>
              <th>Authors</th>
              <th>Specific Claim Supported</th>
              <th>Traceable DOI Link</th>
            </tr>
          </thead>
          <tbody>
            {evidenceRegistry.map((item, idx) => (
              <tr key={idx} className={`evidence-row status-${item.verificationStatus.toLowerCase()}`}>
                <td>
                  <span className={`confidence-tag conf-${item.verificationStatus.toLowerCase()}`}>
                    {item.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="evidence-pub">
                  <strong>{item.publication}</strong> ({item.year})
                  <div className="evidence-title">{item.title}</div>
                </td>
                <td className="evidence-authors font-mono">{item.authors}</td>
                <td className="evidence-claim">{item.claimSupported}</td>
                <td className="evidence-doi font-mono">
                  <a
                    href={`https://doi.org/${item.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doi-link"
                  >
                    doi:{item.doi} &rarr;
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sourceAttribution && (
        <div className="consortium-attribution-card font-mono">
          <div className="consortium-item">
            <span className="consortium-label">Lead Organization / Institution:</span>
            <span className="consortium-val">{sourceAttribution.organization}</span>
          </div>
          <div className="consortium-item">
            <span className="consortium-label">Analogue Research Program:</span>
            <span className="consortium-val highlight-cyan">{sourceAttribution.program}</span>
          </div>
          <div className="consortium-item">
            <span className="consortium-label">Primary Benchmark Citation:</span>
            <span className="consortium-val">{sourceAttribution.primaryCitation}</span>
          </div>
        </div>
      )}
    </div>
  )
}

