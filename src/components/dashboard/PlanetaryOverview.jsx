import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'

export default function PlanetaryOverview({ onNavigate }) {
  const marsDatasets = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Mars')
  const moonDatasets = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Moon')

  return (
    <Card
      title="Planetary Terrain Datasets & Focus Areas"
      subtitle="Authoritative NASA MOLA and LOLA digital elevation models for Mars and the Moon, matched to terrestrial analogue research"
      badge={<StatusBadge variant="source" label="NASA PDS ARCHIVE" size="sm" />}
      action={
        <button
          type="button"
          className="section-action-btn"
          onClick={() => onNavigate && onNavigate('site-evaluation')}
          aria-label="Navigate to Site Evaluation"
        >
          <span>Evaluate Sites &rarr;</span>
        </button>
      }
      className="planetary-overview-card"
    >
      <div className="planetary-grid">
        {/* Mars Focus */}
        <div className="planet-card">
          <div className="planet-card-header">
            <div className="planet-body-indicator">
              <span className="body-circle" style={{ backgroundColor: '#ef4444' }} aria-hidden="true" />
              <span className="body-label font-mono">Mars</span>
            </div>
            <h3 className="planet-title">Martian Surface Analogues</h3>
            <p className="planet-subtitle">
              MOLA MEGDR Topography (128 px/deg) • MOLA Areoid Datum (0m = 610 Pa) • HRSC & HiRISE DTMs
            </p>
          </div>

          <div className="planet-sites-section">
            <span className="planet-sub-heading">Integrated Mars Terrain Models ({marsDatasets.length}):</span>
            <ul className="planet-sites-list">
              {marsDatasets.map((d) => (
                <li key={d.id} className="planet-site-item">
                  <span className="site-bullet" style={{ color: '#ef4444' }} aria-hidden="true">&bull;</span>
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({d.elevation.label}, typical slope {d.slope.typicalDeg}°)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="planet-foci-section">
            <span className="planet-sub-heading">Primary Analogue Research Foci:</span>
            <ul className="planet-foci-list">
              <li className="planet-focus-item">&minus; Fluvial-lacustrine deltaic stratigraphy & sedimentology (Jezero Delta)</li>
              <li className="planet-focus-item">&minus; Subsurface ice-cemented regolith cryo-drilling (Vastitas Borealis / Phoenix)</li>
              <li className="planet-focus-item">&minus; Low-pH ferric sulfate & jarosite biosignature calibration (Meridiani Planum)</li>
              <li className="planet-focus-item">&minus; Deep subterranean pit crater exploration (Arsia Mons Caves)</li>
            </ul>
          </div>
        </div>

        {/* Moon Focus */}
        <div className="planet-card">
          <div className="planet-card-header">
            <div className="planet-body-indicator">
              <span className="body-circle" style={{ backgroundColor: '#38bdf8' }} aria-hidden="true" />
              <span className="body-label font-mono">Moon</span>
            </div>
            <h3 className="planet-title">Lunar Surface Analogues</h3>
            <p className="planet-subtitle">
              LRO LOLA GDR Topography (128–512 px/deg) • 1,737.4 km Sphere Datum • LROC NAC Micro-Relief
            </p>
          </div>

          <div className="planet-sites-section">
            <span className="planet-sub-heading">Integrated Moon Terrain Models ({moonDatasets.length}):</span>
            <ul className="planet-sites-list">
              {moonDatasets.map((d) => (
                <li key={d.id} className="planet-site-item">
                  <span className="site-bullet" style={{ color: '#38bdf8' }} aria-hidden="true">&bull;</span>
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({d.elevation.label}, typical slope {d.slope.typicalDeg}°)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="planet-foci-section">
            <span className="planet-sub-heading">Primary Analogue Research Foci:</span>
            <ul className="planet-foci-list">
              <li className="planet-focus-item">&minus; Subterranean intact lava tube conduit ingress & pyroduct mapping (Marius Hills)</li>
              <li className="planet-focus-item">&minus; Ultra-steep permanently shadowed crater rim mobility (Shackleton PSR)</li>
              <li className="planet-focus-item">&minus; Impact melt sheet hummocky regolith traverse dynamics (Copernicus Crater)</li>
              <li className="planet-focus-item">&minus; Narrow graben boulder-strewn lunar valley traverses (Taurus-Littrow)</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}
