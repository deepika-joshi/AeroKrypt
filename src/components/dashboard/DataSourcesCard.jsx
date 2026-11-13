import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { DATA_SOURCES_INTEGRATION } from '../../data/analogueData.js'

export default function DataSourcesCard() {
  return (
    <Card
      title="Data Sources & Planned Integrations"
      subtitle="Standardized institutional data pipelines and planetary archive integration status"
      badge={<StatusBadge variant="planned" label="PDS4 / USGS SCHEMA" size="sm" />}
      className="data-sources-card"
    >
      <div className="integration-disclaimer-banner">
        <span className="banner-icon" aria-hidden="true">&#9881;</span>
        <div className="banner-text">
          <strong>Integration Architecture Disclosure:</strong> TERRALAB is architected around NASA Planetary Data System (PDS4) data dictionary standards and USGS Earth Resources Observation and Science (EROS) STAC specifications. Direct API pipelines are planned for production integration; current interfaces operate on verified geographical metadata schemas.
        </div>
      </div>

      <div className="sources-grid">
        {DATA_SOURCES_INTEGRATION.map((source) => (
          <div key={source.id} className="source-pipeline-card">
            <div className="source-pipeline-top">
              <h3 className="source-name">{source.name}</h3>
              <StatusBadge
                variant={source.statusVariant}
                label={source.status}
                size="xs"
              />
            </div>

            <p className="source-role">{source.role}</p>

            <div className="source-pipeline-bottom">
              <div className="source-mode font-mono">
                <span className="mode-label">Mode:</span> {source.integrationMode}
              </div>
              {source.attributionUrl !== '#' && (
                <a
                  href={source.attributionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-external-link"
                  aria-label={`Official documentation for ${source.name}`}
                >
                  <span>Official Portal</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

