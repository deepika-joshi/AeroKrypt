import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { FEATURED_ANALOGUE_LOCATIONS } from '../../data/analogueData.js'

export default function FeaturedLocations({ onNavigate, searchQuery = '' }) {
  const filteredLocations = FEATURED_ANALOGUE_LOCATIONS.filter((loc) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.terrainType.toLowerCase().includes(q) ||
      loc.planetaryAnalogue.toLowerCase().includes(q) ||
      loc.targetBody.toLowerCase().includes(q)
    )
  })

  return (
    <Card
      title="Featured Analogue Locations"
      subtitle="Selected terrestrial field environments exhibiting extreme environmental and geochemical fidelity to target planetary bodies"
      badge={<StatusBadge variant="sample" label="SAMPLE DATA" size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('location-explorer')}
          aria-label="View all locations in Location Explorer"
        >
          <span>Location Explorer</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      }
      className="featured-locations-card"
    >
      <div className="sample-data-disclaimer">
        <span className="disclaimer-icon" aria-hidden="true">&#9432;</span>
        <span>
          <strong>Sample Dataset Notice:</strong> Locations and terrain characteristics listed below are authentic documented Earth analogue sites. Coordinates and geological descriptors serve as reference demonstration schemas; no live sensor data or unverified findings are represented.
        </span>
      </div>

      <div className="locations-grid">
        {filteredLocations.map((loc) => (
          <article key={loc.id} className="location-item-card">
            <div className="location-item-header">
              <div className="location-primary-info">
                <span className="location-target-tag">{loc.targetBody} Analogue</span>
                <h3 className="location-name">{loc.name}</h3>
                <span className="location-geo">
                  {loc.region}, {loc.country}
                </span>
              </div>
              <span className="location-coords font-mono">{loc.coordinates}</span>
            </div>

            <div className="location-specs-list">
              <div className="location-spec-row">
                <span className="spec-label">Terrain Type:</span>
                <span className="spec-val">{loc.terrainType}</span>
              </div>
              <div className="location-spec-row">
                <span className="spec-label">Planetary Analogy:</span>
                <span className="spec-val highlight-val">{loc.planetaryAnalogue}</span>
              </div>
              <div className="location-spec-row">
                <span className="spec-label">Key Environmental Fidelity:</span>
                <span className="spec-val text-muted-val">{loc.keyFidelityTrait}</span>
              </div>
            </div>

            <div className="location-item-footer">
              <div className="location-source-note font-mono" title={loc.sourceAttribution}>
                <span className="source-label">Ref:</span> {loc.sourceAttribution}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="location-card-nav-link"
                  onClick={() => onNavigate && onNavigate('location-explorer', { locationId: loc.id })}
                >
                  Finder &rarr;
                </button>
                <button
                  type="button"
                  className="location-card-eval-link font-mono"
                  onClick={() => onNavigate && onNavigate('site-evaluation', { locationId: loc.id })}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--color-accent-cyan)',
                    fontSize: '11px',
                    padding: '3px 7px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Evaluate &rarr;
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredLocations.length === 0 && (
          <div className="empty-search-state">
            <p>No analogue locations matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </Card>
  )
}

