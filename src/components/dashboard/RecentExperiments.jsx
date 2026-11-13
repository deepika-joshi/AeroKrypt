import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { MISSION_OBJECTIVES } from '../../data/missionObjectives.js'

export default function RecentExperiments({ onNavigate, searchQuery = '' }) {
  const filteredObjectives = MISSION_OBJECTIVES.filter((obj) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      obj.title.toLowerCase().includes(q) ||
      obj.primaryFocus.toLowerCase().includes(q) ||
      obj.planetaryAnalogue.toLowerCase().includes(q) ||
      obj.requiredTerrain.toLowerCase().includes(q)
    )
  })

  return (
    <Card
      title="Mission Objectives & Protocols"
      subtitle="Standardized field testing protocols, rover mobility trials, and subsurface sampling procedures"
      badge={<StatusBadge variant="verified" label={`${MISSION_OBJECTIVES.length} PROTOCOLS`} size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('research-hub', { subview: 'experiments' })}
          aria-label="Navigate to Experiment Database in Research Hub"
        >
          <span>Research Hub &rarr;</span>
        </button>
      }
      className="recent-experiments-card"
    >
      <div className="experiments-list">
        {filteredObjectives.map((obj) => (
          <div key={obj.id} className="experiment-row-card">
            <div className="experiment-main">
              <div className="experiment-meta-top">
                <span className="experiment-category font-mono" style={{ color: 'var(--color-accent-cyan)' }}>
                  {obj.planetaryAnalogue} Mission
                </span>
                <StatusBadge variant="verified" label="STANDARDIZED PROTOCOL" size="xs" />
              </div>
              <h3 className="experiment-title">{obj.title}</h3>
              <p className="experiment-description">{obj.description}</p>
              <div className="experiment-location-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Terrain: {obj.requiredTerrain}</span>
              </div>
            </div>

            <div className="experiment-side">
              <div className="experiment-schema-badge font-mono">
                <span className="schema-label">Threshold:</span>
                <span className="schema-value">Slope &le; {obj.maxSlopeThreshold}&deg;</span>
              </div>
              <button
                type="button"
                className="experiment-action-btn"
                onClick={() => onNavigate && onNavigate('site-evaluation', { experimentId: obj.id })}
                aria-label={`Evaluate sites for ${obj.title}`}
              >
                <span>Test Sites</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filteredObjectives.length === 0 && (
          <div className="empty-search-state">
            <p>No mission objectives matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </Card>
  )
}
