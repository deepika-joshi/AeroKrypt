import Card from '../common/Card.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { MASTER_DATASET_INVENTORY } from '../../data/datasetInventory.js'

export default function DataSourcesCard() {
  const recentDatasets = MASTER_DATASET_INVENTORY.slice(0, 6)

  return (
    <Card
      title="Cataloged External Datasets & PDS/USGS Specifications (Metadata Archive)"
      subtitle="Authoritative planetary and Earth observation archive specifications documented with spatial resolutions, datums, and CRS definitions"
      badge={<StatusBadge variant="source" label="METADATA &amp; MAP SERVICES" size="sm" />}
      className="data-sources-card"
    >
      <div className="integration-disclaimer-banner">
        <span className="banner-icon" aria-hidden="true">&#9881;</span>
        <div className="banner-text">
          <strong>Integration Architecture Disclosure:</strong> AEROKRYPT does not currently run live raster pipelines or parse raw binary grids (PDS3 IMG / NetCDF) on the client. Visual layers operate via public WMTS web tile services (<code>MAP_SERVICE</code>), while terrain comparisons evaluate curated literature and PDS/USGS summary parameters (<code>METADATA_ONLY</code>). Direct API pipelines to PDS4 and USGS STAC remain future integration milestones.
        </div>
      </div>

      <div className="sources-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {recentDatasets.map((ds) => (
          <div key={ds.id} className="source-pipeline-card">
            <div className="source-pipeline-top">
              <div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    color: ds.planetaryBody === 'Mars' ? '#ef4444' : ds.planetaryBody === 'Moon' ? '#38bdf8' : '#10b981',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {ds.planetaryBody}
                </span>
                <h3 className="source-name" style={{ marginTop: '2px', fontSize: '13px' }}>{ds.name}</h3>
              </div>
              <StatusBadge
                variant="source"
                label={ds.dataFormat.split(' ')[0]}
                size="xs"
              />
            </div>

            <p className="source-role" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <strong>Coverage:</strong> {ds.coverage}
            </p>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0' }}>
              <div><strong>Resolution:</strong> {ds.resolution}</div>
              <div><strong>Classification:</strong> <span className="font-mono" style={{ color: 'var(--color-accent-cyan)' }}>METADATA_ONLY</span></div>
            </div>

            <div className="source-pipeline-bottom" style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <div className="source-mode font-mono" style={{ fontSize: '10px' }}>
                <span className="mode-label">CRS:</span> {ds.coordinateReferenceSystem.slice(0, 32)}...
              </div>
              {ds.originalUrl && (
                <a
                  href={ds.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-external-link"
                  aria-label={`Official portal for ${ds.name}`}
                  style={{ color: 'var(--color-accent-cyan)', fontSize: '11px', textDecoration: 'none' }}
                >
                  <span>Data Archive &rarr;</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
