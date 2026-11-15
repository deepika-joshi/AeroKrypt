import { useState, useEffect } from 'react'
import { LOCATION_PHOTOGRAPHS } from '../../data/locationPhotos.js'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { locationsApi } from '../../services/apiClient.js'

export default function LocationSidePanel({
  location,
  onClose,
  onNavigate,
}) {
  const [showComparison, setShowComparison] = useState(false)
  const [selectedPlanetTargetId, setSelectedPlanetTargetId] = useState('')
  const [imgError, setImgError] = useState(false)
  const [backendDetail, setBackendDetail] = useState(null)

  // Fetch full detail profile from FastAPI backend on selection
  useEffect(() => {
    if (!location?.id) return
    let isMounted = true
    locationsApi.getLocationById(location.id)
      .then((res) => {
        if (!isMounted) return
        if (res.success && res.data) {
          setBackendDetail(res.data)
        }
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [location?.id])

  if (!location) return null

  const isBackendLoaded = Boolean(backendDetail && backendDetail.id === location.id)

  const photoInfo = LOCATION_PHOTOGRAPHS[location.id] || null

  // Determine default planetary comparison target based on analogue relevance
  const isMoon = location.analogueRelevance === 'MOON' || (location.targetBodies && !location.targetBodies.includes('Mars') && location.targetBodies.includes('Moon'))
  const relevantPlanetaryDatasets = PLANETARY_TERRAIN_DATASETS.filter((d) =>
    isMoon ? d.targetBody === 'Moon' : d.targetBody === 'Mars'
  )
  const activePlanetDataset = PLANETARY_TERRAIN_DATASETS.find((d) => d.id === selectedPlanetTargetId) || relevantPlanetaryDatasets[0] || PLANETARY_TERRAIN_DATASETS[0]

  const isFacility = location.locationCategory === 'RESEARCH_FACILITY'
  const isDual = location.targetBodies && location.targetBodies.length > 1

  const parameters = [
    {
      category: 'Topography',
      name: 'Elevation (a.s.l.)',
      value: location.elevation?.label || `${location.elevation?.value} ${location.elevation?.unit}`,
      tier: location.elevation?.status || 'SOURCED',
      station: location.elevation?.measurementLocation || 'Site benchmark',
      period: location.elevation?.measurementPeriod || 'Established survey',
      citation: location.elevation?.sourceCitation,
    },
    {
      category: 'Topography',
      name: 'Slope Gradient',
      value: location.slope?.label || `${location.slope?.typicalDeg}° typical`,
      tier: location.slope?.status || 'SOURCED',
      station: location.slope?.measurementLocation || 'Traverse corridors',
      period: location.slope?.measurementPeriod || 'Field campaign baseline',
      citation: location.slope?.sourceCitation,
    },
    {
      category: 'Thermal',
      name: 'Mean Annual Temp',
      value: location.meanAnnualTemp?.label || `${location.meanAnnualTemp?.value} ${location.meanAnnualTemp?.unit}`,
      tier: location.meanAnnualTemp?.status || 'SOURCED',
      station: location.meanAnnualTemp?.measurementLocation || 'Meteorological station',
      period: location.meanAnnualTemp?.measurementPeriod || 'Multi-year series',
      citation: location.meanAnnualTemp?.sourceCitation,
    },
    {
      category: 'Precipitation',
      name: 'Annual Precipitation',
      value: location.annualPrecipitation?.label || `${location.annualPrecipitation?.value} ${location.annualPrecipitation?.unit}`,
      tier: location.annualPrecipitation?.status || 'SOURCED',
      station: location.annualPrecipitation?.measurementLocation || 'Rain gauge station',
      period: location.annualPrecipitation?.measurementPeriod || 'Multi-year climatology',
      citation: location.annualPrecipitation?.sourceCitation,
    },
    {
      category: 'Atmosphere',
      name: 'Relative Humidity',
      value: location.relativeHumidity?.label || `${location.relativeHumidity?.value} %`,
      tier: location.relativeHumidity?.status || 'SOURCED',
      station: location.relativeHumidity?.measurementLocation || 'Station hygrometer',
      period: location.relativeHumidity?.measurementPeriod || 'Continuous meteorological series',
      citation: location.relativeHumidity?.sourceCitation,
    },
    {
      category: 'Atmosphere',
      name: 'Atmospheric Pressure',
      value: location.atmosphericPressure?.label || `${location.atmosphericPressure?.value} kPa`,
      tier: location.atmosphericPressure?.status || 'SOURCED',
      station: location.atmosphericPressure?.measurementLocation || 'Barometric station',
      period: location.atmosphericPressure?.measurementPeriod || 'Station archive',
      citation: location.atmosphericPressure?.sourceCitation,
    },
    {
      category: 'Radiation',
      name: 'Peak Solar UV Index',
      value: location.uvIndexPeak?.label || `${location.uvIndexPeak?.value}`,
      tier: location.uvIndexPeak?.status || 'SOURCED',
      station: location.uvIndexPeak?.measurementLocation || 'Regional radiometer network',
      period: location.uvIndexPeak?.measurementPeriod || 'Solstice peak baseline',
      citation: location.uvIndexPeak?.sourceCitation,
    },
    {
      category: 'Geochemistry',
      name: 'Soil Chemistry',
      value: location.soilChemistry?.description || 'Curated regolith mineralogy',
      tier: location.soilChemistry?.status || 'MEASURED',
      station: location.soilChemistry?.measurementLocation || 'Core borehole and trench samples',
      period: location.soilChemistry?.measurementPeriod || 'Field sampling campaigns',
      citation: location.soilChemistry?.sourceCitation,
    },
  ]

  return (
    <aside
      className="location-side-panel aerospace-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(16, 12, 11, 0.97)',
        backdropFilter: 'blur(16px)',
        borderLeft: '1px solid rgba(214, 166, 107, 0.18)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.75)',
        zIndex: 1050,
        overflowY: 'auto',
      }}
      aria-label={`Detailed profile for ${location.name}`}
    >
      {/* 1. Header with Badges & Navigation Action */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(214, 166, 107, 0.16)',
          backgroundColor: 'rgba(24, 19, 17, 0.88)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(14px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '3px',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: isDual
                  ? 'rgba(214, 166, 107, 0.18)'
                  : isMoon
                  ? 'rgba(174, 186, 200, 0.16)'
                  : 'rgba(169, 76, 52, 0.2)',
                color: isDual ? 'var(--champagne-gold, #D6A66B)' : isMoon ? 'var(--lunar-silver, #AEBAC8)' : 'var(--terracotta, #A94C34)',
                border: `1px solid ${isDual ? 'rgba(214, 166, 107, 0.4)' : isMoon ? 'rgba(174, 186, 200, 0.35)' : 'rgba(169, 76, 52, 0.4)'}`,
              }}
            >
              {isDual ? 'Dual-Purpose Analogue' : isMoon ? 'Moon Analogue' : 'Mars Analogue'}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '3px',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: isFacility ? 'rgba(196, 146, 85, 0.18)' : 'rgba(214, 166, 107, 0.12)',
                color: isFacility ? '#C49255' : 'var(--champagne-gold, #D6A66B)',
                border: `1px solid ${isFacility ? 'rgba(196, 146, 85, 0.35)' : 'rgba(214, 166, 107, 0.25)'}`,
              }}
            >
              {isFacility ? 'Research Facility' : 'Natural Field Site'}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '3px',
                fontWeight: 600,
                backgroundColor: location.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                color: location.verificationStatus === 'VERIFIED' ? '#4ade80' : '#facc15',
                border: `1px solid ${location.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.35)' : 'rgba(250, 204, 21, 0.35)'}`,
              }}
            >
              {location.verificationStatus}
            </span>
            {isBackendLoaded && (
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '3px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(214, 166, 107, 0.15)',
                  color: 'var(--champagne-gold, #D6A66B)',
                  border: '1px solid rgba(214, 166, 107, 0.4)',
                }}
              >
                REST DETAILED
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #9E9287)',
              fontSize: '22px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '2px 6px',
            }}
            title="Close side panel"
            aria-label="Close side panel"
          >
            &times;
          </button>
        </div>

        <h2
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--warm-ivory, #F2E5D5)',
            margin: '4px 0 2px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {location.name}
        </h2>
        <div style={{ fontSize: '12px', color: '#B8ADA3' }}>
          {location.region}, <strong style={{ color: '#F2E5D5' }}>{location.country}</strong>
        </div>

        {/* Primary Action Button Bar */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {onNavigate && (
            <button
              type="button"
              className="btn-aerospace font-mono"
              onClick={() => onNavigate('site-evaluation', { locationId: location.id })}
              style={{
                padding: '8px 14px',
                fontSize: '11px',
                flex: 1,
                background: 'linear-gradient(135deg, #D6A66B 0%, #A94C34 100%)',
                color: '#100C0B',
                fontWeight: 700,
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              <span>EVALUATE THIS SITE</span>
              <span> &rarr;</span>
            </button>
          )}

          <button
            type="button"
            className="btn-aerospace font-mono"
            onClick={() => setShowComparison(!showComparison)}
            style={{
              padding: '8px 12px',
              fontSize: '11px',
              border: '1px solid rgba(214, 166, 107, 0.3)',
              background: showComparison ? 'rgba(214, 166, 107, 0.18)' : 'rgba(24, 19, 17, 0.7)',
              color: showComparison ? '#F2E5D5' : '#B8ADA3',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {showComparison ? 'Hide Planetary Comparison' : 'Compare with Off-World Terrain'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Side-by-Side Planetary Comparison Drawer */}
      {showComparison && (
        <section
          style={{
            padding: '14px 20px',
            backgroundColor: 'rgba(20, 16, 14, 0.95)',
            borderBottom: '1px solid rgba(214, 166, 107, 0.15)',
          }}
          aria-label="Planetary Comparison Drawer"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', letterSpacing: '0.08em', fontWeight: 700 }}>
              // OFF-WORLD TERRAIN COMPARATIVE MATRIX
            </span>
            <select
              value={activePlanetDataset.id}
              onChange={(e) => setSelectedPlanetTargetId(e.target.value)}
              className="font-mono"
              style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#100C0B', color: '#F2E5D5', border: '1px solid rgba(214, 166, 107, 0.3)', borderRadius: '3px' }}
            >
              <optgroup label="Mars Planetary Targets (MOLA Areoid)">
                {PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Mars').map((d) => (
                  <option key={d.id} value={d.id}>Mars &mdash; {d.name}</option>
                ))}
              </optgroup>
              <optgroup label="Moon Planetary Targets (Lunar Sphere)">
                {PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Moon').map((d) => (
                  <option key={d.id} value={d.id}>Moon &mdash; {d.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(214, 166, 107, 0.08)', padding: '10px', borderRadius: '3px', border: '1px solid rgba(214, 166, 107, 0.25)' }}>
              <div className="font-mono" style={{ fontSize: '10px', color: 'var(--champagne-gold, #D6A66B)', fontWeight: 700 }}>
                EARTH: {location.name.split('(')[0].trim()}
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '4px' }}>
                <strong>Datum:</strong> WGS 84 / EGM96 Geoid
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '2px' }}>
                <strong>Relief / Landform:</strong> {location.elevation?.label} ({location.terrainType})
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '2px' }}>
                <strong>Slope:</strong> {location.slope?.typicalDeg}° typ (Max: {location.slope?.maxDeg}°)
              </div>
            </div>

            <div style={{ background: 'rgba(169, 76, 52, 0.08)', padding: '10px', borderRadius: '3px', border: '1px solid rgba(169, 76, 52, 0.3)' }}>
              <div className="font-mono" style={{ fontSize: '10px', color: 'var(--terracotta, #A94C34)', fontWeight: 700 }}>
                TARGET: {activePlanetDataset.targetBody.toUpperCase()} &bull; {activePlanetDataset.name.split('&')[0].trim()}
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '4px' }}>
                <strong>Datum:</strong> {activePlanetDataset.datumName}
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '2px' }}>
                <strong>Relief / Landform:</strong> {activePlanetDataset.elevation?.localReliefM}m local ({activePlanetDataset.primaryLandform})
              </div>
              <div style={{ fontSize: '11.5px', color: '#B8ADA3', marginTop: '2px' }}>
                <strong>Slope:</strong> {activePlanetDataset.slope?.typicalDeg}° typ (Max: {activePlanetDataset.slope?.maxDeg}°)
              </div>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              className="btn-aerospace font-mono"
              onClick={() => onNavigate('site-evaluation', { locationId: location.id, terrainId: activePlanetDataset.id })}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '7px 12px',
                fontSize: '11px',
                background: 'linear-gradient(135deg, #D6A66B 0%, #A94C34 100%)',
                color: '#100C0B',
                fontWeight: 700,
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              <span>TRANSFER TO FULL SITE EVALUATION ENGINE</span>
              <span> &rarr;</span>
            </button>
          )}
        </section>
      )}

      {/* 3. Location Photograph & Field Image Section */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(214, 166, 107, 0.2)', background: '#0C0A09' }}>
          {photoInfo?.photoUrl && !imgError ? (
            <img
              src={photoInfo.photoUrl}
              alt={`Terrestrial analogue terrain at ${location.name}`}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'cover',
                display: 'block',
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                height: '180px',
                background: 'linear-gradient(135deg, #181311 0%, #261B18 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛰️</div>
              <div className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', textTransform: 'uppercase' }}>
                ESRI / WGS 84 SATELLITE TERRAIN BENCHMARK
              </div>
              <div style={{ fontSize: '12px', color: '#B8ADA3', marginTop: '4px' }}>
                Coordinates: {location.coordinates}
              </div>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(16, 12, 11, 0.95))',
              padding: '12px 14px 6px 14px',
              fontSize: '11px',
              color: '#ffffff',
            }}
          >
            <div style={{ fontWeight: 600 }}>{photoInfo?.caption || `${location.name} - ${location.terrainType}`}</div>
            <div className="font-mono" style={{ fontSize: '10px', color: '#9E9287', marginTop: '2px' }}>
              Credit: {photoInfo?.credit || location.sourceAttribution?.organization || 'NASA / USGS / ESA Planetary Science Archive'}
            </div>
          </div>
        </div>

        {photoInfo?.targetAnalogueFeature && (
          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', marginTop: '8px', lineHeight: 1.4 }}>
            <strong>Target Planetary Analogy:</strong> {photoInfo.targetAnalogueFeature}
          </div>
        )}
      </section>

      {/* 4. Geographic & Geodetic Telemetry */}
      <section style={{ padding: '14px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
          // GEODETIC TELEMETRY &amp; BOUNDARIES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>COORDINATES</span>
            <div className="font-mono" style={{ color: '#F2E5D5', fontWeight: 600 }}>{location.coordinates}</div>
          </div>
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>GEODETIC DATUM</span>
            <div className="font-mono" style={{ color: '#B8ADA3' }}>{location.geographicBoundaries?.geodeticDatum || 'WGS 84'}</div>
          </div>
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>COVERAGE AREA</span>
            <div style={{ color: '#B8ADA3' }}>{location.geographicBoundaries?.coverageAreaKm2 || 'Established perimeter'}</div>
          </div>
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>SURVEY STATUS</span>
            <div className="font-mono" style={{ color: location.geographicBoundaries?.officialBoundaryEvidenceAvailable ? '#4ade80' : '#facc15' }}>
              {location.geographicBoundaries?.surveyStatus || 'SURVEYED'}
            </div>
          </div>
        </div>

        {location.geographicBoundaries?.boundingBox && (
          <div className="font-mono" style={{ fontSize: '10.5px', marginTop: '8px', color: '#9E9287', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '2px' }}>
            <strong>Bounding Envelope:</strong> N: {location.geographicBoundaries.boundingBox.north} &bull; S: {location.geographicBoundaries.boundingBox.south} &bull; W: {location.geographicBoundaries.boundingBox.west} &bull; E: {location.geographicBoundaries.boundingBox.east}
          </div>
        )}
      </section>

      {/* 5. Geological Characteristics & Substrate Lithology */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          1. GEOLOGICAL CHARACTERISTICS &amp; LITHOLOGY
        </h3>

        <div style={{ fontSize: '12.5px', color: '#B8ADA3', marginBottom: '10px', lineHeight: 1.55 }}>
          {location.geologicalContext}
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287', textTransform: 'uppercase' }}>
            Verified Substrate Lithology:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {location.lithology && location.lithology.map((rock, idx) => (
              <span
                key={idx}
                className="font-mono"
                style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(214, 166, 107, 0.12)',
                  color: 'var(--champagne-gold, #D6A66B)',
                  border: '1px solid rgba(214, 166, 107, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                }}
              >
                &check; {rock}
              </span>
            ))}
          </div>
        </div>

        {location.soilChemistry?.keyMinerals && (
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287', textTransform: 'uppercase' }}>
              Key Mineral Phases:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {location.soilChemistry.keyMinerals.map((mineral, idx) => (
                <span
                  key={idx}
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#B8ADA3',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {mineral}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. Terrain Description & Geomorphology */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: 'var(--terracotta, #A94C34)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          2. TERRAIN DESCRIPTION &amp; TOPOGRAPHY
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>PRIMARY TERRAIN TYPE</span>
            <div style={{ fontWeight: 600, color: '#F2E5D5', marginTop: '2px' }}>{location.terrainType}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>TYPICAL / MAX SLOPE</span>
            <div className="font-mono" style={{ fontWeight: 600, color: '#F2E5D5', marginTop: '2px' }}>
              {location.slope?.typicalDeg}° (Max: {location.slope?.maxDeg}°)
            </div>
          </div>
        </div>

        {location.morphologicalFeatures && (
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287', textTransform: 'uppercase' }}>
              Key Morphological Features:
            </span>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#B8ADA3' }}>
              {location.morphologicalFeatures.map((feat, idx) => (
                <li key={idx} style={{ marginBottom: '2px' }}>{feat}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 7. Scientific Research Relevance */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          3. SCIENTIFIC RESEARCH RELEVANCE
        </h3>

        <div style={{ background: 'rgba(214, 166, 107, 0.08)', padding: '10px 12px', borderRadius: '3px', border: '1px solid rgba(214, 166, 107, 0.25)', marginBottom: '10px' }}>
          <div className="font-mono" style={{ fontSize: '10.5px', color: 'var(--champagne-gold, #D6A66B)', fontWeight: 700 }}>
            TARGET EPOCH: {location.planetaryAnalogy?.geologicalEpoch}
          </div>
          <div style={{ fontSize: '12.5px', color: '#F2E5D5', marginTop: '4px', lineHeight: 1.45 }}>
            {location.planetaryAnalogy?.rationale}
          </div>
        </div>

        {location.scientificFidelity && (
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#4ade80', textTransform: 'uppercase' }}>
              &check; Documented Scientific Fidelity Strengths:
            </span>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#B8ADA3' }}>
              {location.scientificFidelity.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 8. Available Environmental Measurements Table */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="font-mono" style={{ fontSize: '11px', color: 'var(--champagne-gold, #D6A66B)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            4. AVAILABLE ENVIRONMENTAL MEASUREMENTS
          </h3>
          <span className="font-mono" style={{ fontSize: '10px', color: '#9E9287' }}>
            SI Units &bull; Traceable Tiers
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(214, 166, 107, 0.2)', color: '#9E9287' }}>
                <th style={{ padding: '6px 4px' }}>Parameter</th>
                <th style={{ padding: '6px 4px' }}>Value</th>
                <th style={{ padding: '6px 4px' }}>Tier</th>
                <th style={{ padding: '6px 4px' }}>Station / Baseline</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, idx) => {
                const tierColor =
                  p.tier === 'MEASURED'
                    ? '#4ade80'
                    : p.tier === 'SOURCED'
                    ? '#D6A66B'
                    : p.tier === 'ESTIMATED'
                    ? '#facc15'
                    : '#ef4444'

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td className="font-mono" style={{ padding: '6px 4px', color: '#D1C7BD' }}>{p.name}</td>
                    <td style={{ padding: '6px 4px', fontWeight: 600, color: '#F2E5D5' }}>{p.value}</td>
                    <td style={{ padding: '6px 4px' }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '9px',
                          padding: '1px 5px',
                          borderRadius: '2px',
                          border: `1px solid ${tierColor}`,
                          color: tierColor,
                        }}
                      >
                        {p.tier}
                      </span>
                    </td>
                    <td style={{ padding: '6px 4px', color: '#9E9287', fontSize: '10.5px' }}>
                      {p.station}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Missing Data & Physical Divergences */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)', backgroundColor: 'rgba(169, 76, 52, 0.04)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          5. MISSING DATA GAPS &amp; PLANETARY DIVERGENCES
        </h3>

        {location.dataGapsAndUncertainty && (
          <div style={{ marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: '#f59e0b', textTransform: 'uppercase' }}>
              &#9888; Identified Missing Parameters &amp; Gaps:
            </span>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#B8ADA3' }}>
              {location.dataGapsAndUncertainty.map((gap, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {location.planetaryDivergences && (
          <div>
            <span className="font-mono" style={{ fontSize: '10px', color: '#f87171', textTransform: 'uppercase' }}>
              &Delta; Inherent Physical Divergences (Earth vs. Off-World):
            </span>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#B8ADA3' }}>
              {location.planetaryDivergences.map((div, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>{div}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 10. Supporting Publications & Source Verification Registry */}
      <section style={{ padding: '16px 20px', borderBottom: '1px solid rgba(214, 166, 107, 0.12)' }}>
        <h3 className="font-mono" style={{ fontSize: '11px', color: '#F2E5D5', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          6. SUPPORTING PUBLICATIONS &amp; EVIDENCE REGISTRY
        </h3>

        {location.sourceVerificationRegistry && location.sourceVerificationRegistry.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {location.sourceVerificationRegistry.map((src, sIdx) => (
              <div
                key={sIdx}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(214, 166, 107, 0.14)',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: 'var(--champagne-gold, #D6A66B)', fontWeight: 600 }}>
                    {src.publication} ({src.year})
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(74, 222, 128, 0.15)',
                      color: '#4ade80',
                      border: '1px solid #4ade80',
                    }}
                  >
                    {src.verificationStatus || 'VERIFIED'}
                  </span>
                </div>
                <div style={{ color: '#F2E5D5', fontWeight: 500, margin: '2px 0' }}>{src.title}</div>
                <div className="font-mono" style={{ color: '#9E9287', fontSize: '10.5px' }}>{src.authors}</div>
                <div style={{ color: '#B8ADA3', fontSize: '11px', marginTop: '4px' }}>
                  <strong>Claim Verified:</strong> {src.claimSupported}
                </div>
                {src.doi && (
                  <div style={{ marginTop: '4px' }}>
                    <a
                      href={`https://doi.org/${src.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono"
                      style={{ color: 'var(--champagne-gold, #D6A66B)', fontSize: '10.5px', textDecoration: 'underline' }}
                    >
                      doi:{src.doi} &nearr;
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#9E9287' }}>
            Primary Citation: {location.sourceAttribution?.primaryCitation} (doi:{location.sourceAttribution?.doi})
          </div>
        )}
      </section>

      {/* 11. Footer Actions */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(16, 12, 11, 0.95)',
          borderTop: '1px solid rgba(214, 166, 107, 0.16)',
          display: 'flex',
          gap: '10px',
          position: 'sticky',
          bottom: 0,
        }}
      >
        {onNavigate && (
          <button
            type="button"
            className="btn-aerospace font-mono"
            onClick={() => onNavigate('site-evaluation', { locationId: location.id })}
            style={{
              flex: 1,
              padding: '8px 14px',
              fontSize: '11px',
              background: 'linear-gradient(135deg, #D6A66B 0%, #A94C34 100%)',
              color: '#100C0B',
              fontWeight: 700,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            <span>EVALUATE THIS SITE</span>
            <span> &rarr;</span>
          </button>
        )}
        <button
          type="button"
          className="btn-aerospace font-mono"
          onClick={onClose}
          style={{
            padding: '8px 14px',
            fontSize: '11px',
            color: '#B8ADA3',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          CLOSE
        </button>
      </div>
    </aside>
  )
}

