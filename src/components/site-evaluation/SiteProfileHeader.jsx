import StatusBadge from '../common/StatusBadge.jsx'

export default function SiteProfileHeader({ location, onExportClick }) {
  if (!location) return null

  const geo = location.geographicBoundaries || {}
  const bbox = geo.boundingBox || {}

  return (
    <div className="site-profile-header-card">
      <div className="profile-header-top">
        <div className="profile-title-column">
          <div className="profile-meta-tags font-mono">
            <span className="badge-source">{location.primaryTarget} ANALOGUE</span>
            <span className="badge-geo">{location.region}, {location.country}</span>
            <span className="badge-datum">Datum: {geo.geodeticDatum || 'WGS 84'}</span>
          </div>
          <h2 className="profile-name">{location.name}</h2>
          <div className="profile-coords-strip font-mono">
            <span className="coord-item">
              <span className="coord-label">Benchmark:</span> {location.coordinates}
            </span>
            {bbox.north && (
              <span className="coord-item bbox-item">
                <span className="coord-label">Bounding Box:</span> N {bbox.north} &bull; S {bbox.south} &bull; W {bbox.west} &bull; E {bbox.east}
              </span>
            )}
          </div>
        </div>

        <div className="profile-actions-column">
          <StatusBadge variant="verified" label="Audited Terrestrial Baseline" size="md" />
          <button
            type="button"
            className="action-export-dossier-btn font-mono"
            onClick={onExportClick}
            title="Generate print-ready Scientific Site Assessment Dossier"
          >
            <span className="icon-doc" aria-hidden="true">&#128196;</span>
            Export / Print Assessment Report
          </button>
        </div>
      </div>

      <div className="profile-spec-summary-strip">
        <div className="summary-pill">
          <span className="summary-pill-label">Coverage Area:</span>
          <span className="summary-pill-val font-mono">{geo.coverageAreaKm2 || 'Sector defined'}</span>
        </div>
        <div className="summary-pill">
          <span className="summary-pill-label">Administrative Jurisdiction:</span>
          <span className="summary-pill-val">{geo.jurisdiction || location.country}</span>
        </div>
        <div className="summary-pill">
          <span className="summary-pill-label">Boundary Classification:</span>
          <span className="summary-pill-val font-mono">{geo.boundaryClassification || 'Developer-Defined Bounding Box'}</span>
        </div>
        <div className="summary-pill">
          <span className="summary-pill-label">Primary Morphology:</span>
          <span className="summary-pill-val highlight-cyan">{location.terrainType}</span>
        </div>
        <div className="summary-pill">
          <span className="summary-pill-label">Target Analogy:</span>
          <span className="summary-pill-val highlight-orange">{location.planetaryAnalogy.specificRegion}</span>
        </div>
      </div>
    </div>
  )
}

