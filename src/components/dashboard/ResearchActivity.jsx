import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { getResearchRecords } from '../../services/researchRecordService.js'

export default function ResearchActivity({ onNavigate, searchQuery = '' }) {
  const records = getResearchRecords()
  const filteredRecords = records.filter((rec) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (rec.title && rec.title.toLowerCase().includes(q)) ||
      (rec.author && rec.author.toLowerCase().includes(q)) ||
      (rec.targetBody && rec.targetBody.toLowerCase().includes(q)) ||
      (rec.summary && rec.summary.toLowerCase().includes(q))
    )
  })

  return (
    <Card
      title="Recent Research Records & Evaluations"
      subtitle="Peer-reviewed analogue benchmarks, field evaluation results, and indexed scientific publications"
      badge={<StatusBadge variant="verified" label={`${records.length} RECORDS`} size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('research-hub', { subview: 'records' })}
          aria-label="Navigate to Research Records in Research Hub"
        >
          <span>Research Records &rarr;</span>
        </button>
      }
      className="research-activity-card"
    >
      <div className="records-feed">
        {filteredRecords.map((rec) => (
          <article key={rec.id} className="record-item">
            <div className="record-status-col">
              <StatusBadge
                variant={rec.verifiedStatus === 'PEER_REVIEWED_BENCHMARK' ? 'verified' : 'sample'}
                label={rec.targetBody || 'MARS'}
                size="xs"
              />
              <span className="record-year font-mono">{rec.date ? rec.date.split('-')[0] : '2026'}</span>
            </div>

            <div className="record-content-col">
              <h3 className="record-title">{rec.title}</h3>
              <p className="record-authors font-mono">{rec.author}</p>
              <p className="record-snippet">{rec.summary}</p>
              {rec.doiReference && (
                <div className="record-doi font-mono">
                  <span>DOI:</span>{' '}
                  <a
                    href={`https://doi.org/${rec.doiReference}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doi-link"
                    style={{ color: 'var(--color-accent-cyan)', textDecoration: 'underline' }}
                  >
                    {rec.doiReference}
                  </a>
                </div>
              )}
            </div>

            <div className="record-meta-col">
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Similarity</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-accent-cyan)' }}>
                  {rec.compositeSimilarity}%
                </div>
              </div>
              <button
                type="button"
                className="record-view-btn font-mono"
                onClick={() =>
                  onNavigate &&
                  onNavigate('site-evaluation', {
                    locationId: rec.earthLocationId,
                    terrainId: rec.planetaryTerrainId,
                    experimentId: rec.experimentId,
                  })
                }
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                View Comparison &rarr;
              </button>
            </div>
          </article>
        ))}

        {filteredRecords.length === 0 && (
          <div className="empty-search-state">
            <p>No research records matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </Card>
  )
}
