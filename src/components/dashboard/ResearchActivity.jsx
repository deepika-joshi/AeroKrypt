import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { RECENT_RESEARCH_RECORDS } from '../../data/analogueData.js'

export default function ResearchActivity({ onNavigate, searchQuery = '' }) {
  const filteredRecords = RECENT_RESEARCH_RECORDS.filter((rec) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      rec.title.toLowerCase().includes(q) ||
      rec.authors.toLowerCase().includes(q) ||
      rec.publication.toLowerCase().includes(q) ||
      rec.siteAssociated.toLowerCase().includes(q)
    )
  })

  return (
    <Card
      title="Research Activity & Records"
      subtitle="Recently cataloged peer-reviewed research papers, expedition reports, and scientific datasets"
      badge={<StatusBadge variant="verified" label="INDEXED RECORDS" size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('research-records')}
          aria-label="Navigate to Research Records"
        >
          <span>Research Records</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      }
      className="research-activity-card"
    >
      <div className="records-feed">
        {filteredRecords.map((rec) => (
          <article key={rec.id} className="record-item">
            <div className="record-status-col">
              <StatusBadge
                variant={rec.isSample ? 'sample' : 'verified'}
                label={rec.recordType}
                size="xs"
              />
              <span className="record-year font-mono">{rec.year}</span>
            </div>

            <div className="record-content-col">
              <h3 className="record-title">{rec.title}</h3>
              <div className="record-meta-line">
                <span className="record-authors">{rec.authors}</span>
                <span className="record-separator" aria-hidden="true">&bull;</span>
                <span className="record-publication">{rec.publication}</span>
              </div>
              <div className="record-site-line">
                <span className="site-tag">Associated Site: {rec.siteAssociated}</span>
                <span className="doi-tag font-mono">{rec.doi}</span>
              </div>
              <div className="record-attribution-note font-mono">
                Attribution: {rec.attribution}
              </div>
            </div>

            <div className="record-action-col">
              <button
                type="button"
                className="record-link-btn"
                onClick={() => onNavigate && onNavigate('research-records')}
                aria-label={`Inspect citation for ${rec.title}`}
              >
                Inspect Citation &rarr;
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

