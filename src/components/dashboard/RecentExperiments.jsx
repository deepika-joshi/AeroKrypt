import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { RECENT_EXPERIMENTS } from '../../data/analogueData.js'

export default function RecentExperiments({ onNavigate, searchQuery = '' }) {
  const filteredExperiments = RECENT_EXPERIMENTS.filter((exp) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      exp.title.toLowerCase().includes(q) ||
      exp.location.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      exp.status.toLowerCase().includes(q)
    )
  })

  return (
    <Card
      title="Recent Experiments"
      subtitle="Documented testing protocols, rover mobility trails, and astrobiological sampling procedures"
      badge={<StatusBadge variant="sample" label="4 PROTOCOLS" size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('experiment-database')}
          aria-label="Navigate to Experiment Database"
        >
          <span>Experiment Database</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      }
      className="recent-experiments-card"
    >
      <div className="experiments-list">
        {filteredExperiments.map((exp) => (
          <div key={exp.id} className="experiment-row-card">
            <div className="experiment-main">
              <div className="experiment-meta-top">
                <span className="experiment-category font-mono">{exp.category}</span>
                <StatusBadge variant={exp.statusVariant} label={exp.status} size="xs" />
              </div>
              <h3 className="experiment-title">{exp.title}</h3>
              <p className="experiment-description">{exp.description}</p>
              <div className="experiment-location-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{exp.location}</span>
              </div>
            </div>

            <div className="experiment-side">
              <div className="experiment-schema-badge font-mono">
                <span className="schema-label">Standard:</span>
                <span className="schema-value">{exp.datasetSchema}</span>
              </div>
              <div className="experiment-source-attribution" title={exp.sourceReference}>
                <span>Source: {exp.sourceReference}</span>
              </div>
              <button
                type="button"
                className="experiment-inspect-btn"
                onClick={() => onNavigate && onNavigate('experiment-database')}
              >
                Protocol Details &rarr;
              </button>
            </div>
          </div>
        ))}

        {filteredExperiments.length === 0 && (
          <div className="empty-search-state">
            <p>No experiments matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </Card>
  )
}

