import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { PLANETARY_OVERVIEWS } from '../../data/analogueData.js'

export default function PlanetaryOverview({ onNavigate }) {
  return (
    <Card
      title="Planetary Overview"
      subtitle="Comparative focus areas linking terrestrial environments to target extraterrestrial planetary bodies"
      badge={<StatusBadge variant="planned" label="PDS4 Ready" size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('planetary-comparison')}
          aria-label="Navigate to Planetary Comparison"
        >
          <span>Planetary Comparison</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      }
      className="planetary-overview-card"
    >
      <div className="planetary-grid">
        {PLANETARY_OVERVIEWS.map((planet) => (
          <div key={planet.id} className="planet-card">
            <div className="planet-card-header">
              <div className="planet-body-indicator">
                <span className={`body-circle body-${planet.id}`} aria-hidden="true" />
                <span className="body-label font-mono">{planet.targetBody}</span>
              </div>
              <h3 className="planet-title">{planet.title}</h3>
              <p className="planet-subtitle">{planet.subtitle}</p>
            </div>

            <div className="planet-sites-section">
              <span className="planet-sub-heading">Primary Terrestrial Field Sites:</span>
              <ul className="planet-sites-list">
                {planet.primarySites.map((site, index) => (
                  <li key={index} className="planet-site-item">
                    <span className="site-bullet" aria-hidden="true">&bull;</span>
                    <span>{site}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="planet-foci-section">
              <span className="planet-sub-heading">Research Investigation Foci:</span>
              <ul className="planet-foci-list">
                {planet.researchFoci.map((focus, index) => (
                  <li key={index} className="planet-focus-item">
                    <span className="focus-bullet" aria-hidden="true">&minus;</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="planet-card-footer">
              <div className="planet-integration-tag font-mono">
                <span className="tag-prefix">Schema:</span> {planet.plannedIntegration}
              </div>
              <button
                type="button"
                className="planet-nav-btn"
                onClick={() => onNavigate && onNavigate('planetary-comparison')}
              >
                Compare Benchmarks &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

