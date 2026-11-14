import { useState } from 'react'
import { geocodeLocationName, addCustomLocation } from '../../services/locationRegistryService.js'

export default function AddLocationModal({ isOpen, onClose, onLocationAdded }) {
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [geocodeQuery, setGeocodeQuery] = useState('')
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodeFeedback, setGeocodeFeedback] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [primaryTarget, setPrimaryTarget] = useState('Mars')
  const [locationCategory, setLocationCategory] = useState('NATURAL_SITE')
  const [terrainType, setTerrainType] = useState('')
  const [lithologyInput, setLithologyInput] = useState('')
  const [scientificRationale, setScientificRationale] = useState('')
  const [hasLavaTubes, setHasLavaTubes] = useState(false)
  const [hasBasalticPlains, setHasBasalticPlains] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleGeocode = async () => {
    const q = geocodeQuery.trim() || name.trim() || `${region} ${country}`.trim()
    if (!q) {
      setGeocodeFeedback('Please enter a location name or coordinates to search.')
      return
    }

    setIsGeocoding(true)
    setGeocodeFeedback('Querying geodetic coordinates...')

    try {
      const res = await geocodeLocationName(q)
      if (res) {
        setLatitude(res.lat.toFixed(4))
        setLongitude(res.lng.toFixed(4))
        setGeocodeFeedback(`✓ Coordinates located: ${res.lat.toFixed(4)}°, ${res.lng.toFixed(4)}° (${res.displayName || res.source})`)
        if (!name && res.displayName) {
          setName(res.displayName.split(',')[0])
        }
      } else {
        setGeocodeFeedback('Could not automatically geocode name. Please enter latitude and longitude manually.')
      }
    } catch {
      setGeocodeFeedback('Geocoding service unavailable. Please enter coordinates manually.')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim()) {
      setErrorMsg('Location name is required.')
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrorMsg('Please specify valid latitude (-90° to +90°) and longitude (-180° to +180°).')
      return
    }

    const lithology = lithologyInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      name: name.trim(),
      country: country.trim() || 'Unspecified Country',
      region: region.trim() || 'Candidate Region',
      latitude: lat,
      longitude: lng,
      primaryTarget,
      targetBodies: primaryTarget === 'Both' ? ['Mars', 'Moon'] : [primaryTarget],
      locationCategory,
      terrainType: terrainType.trim() || 'Terrestrial Analogue Terrain',
      lithology: lithology.length > 0 ? lithology : ['Volcanic / Sedimentary Regolith'],
      scientificRationale: scientificRationale.trim() || 'Candidate analogue site for robotic traverse and field science testing.',
      hasLavaTubes,
      hasBasalticPlains,
    }

    try {
      const created = addCustomLocation(payload)
      if (onLocationAdded) {
        onLocationAdded(created)
      }
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register location.')
    }
  }

  return (
    <div
      className="report-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="aerospace-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(8, 12, 20, 0.98)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 210, 255, 0.15)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div>
            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '0.12em' }}>
              // EXPANSION REGISTRY &bull; EXTENSIBLE CANDIDATE INTAKE
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0 0' }}>
              Add Analogue Research Location
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Expand the 3D Earth Globe database with new Earth terrestrial analogue sites or planetary simulation facilities.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
            }}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {errorMsg && (
          <div
            className="font-mono"
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '12px',
              borderRadius: '2px',
            }}
          >
            &Delta; {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Name & Jurisdiction */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                LOCATION NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mojave Desert Lava Beds"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              />
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                COUNTRY *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              />
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                REGION / PROVINCE
              </label>
              <input
                type="text"
                placeholder="e.g. California / Mojave"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              />
            </div>
          </div>

          {/* 2. Geocoding Assistant */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(0, 210, 255, 0.04)',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              borderRadius: '2px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                AUTOMATIC GEOCODING ASSISTANT
              </span>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                WGS 84 / OpenStreetMap
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search place name or paste coords (e.g. 35.01, -115.47)..."
                value={geocodeQuery}
                onChange={(e) => setGeocodeQuery(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={isGeocoding}
                className="btn-aerospace font-mono"
                style={{ padding: '6px 14px', fontSize: '11px', whiteSpace: 'nowrap' }}
              >
                {isGeocoding ? 'Locating...' : 'Auto-Geocode'}
              </button>
            </div>

            {geocodeFeedback && (
              <div className="font-mono" style={{ fontSize: '11px', color: '#38bdf8', marginTop: '6px' }}>
                {geocodeFeedback}
              </div>
            )}
          </div>

          {/* 3. Latitude & Longitude */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                LATITUDE (WGS 84: -90 to +90) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 35.0110"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              />
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                LONGITUDE (WGS 84: -180 to +180) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. -115.4734"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              />
            </div>
          </div>

          {/* 4. Target Body & Classification */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PRIMARY ANALOGUE TARGET
              </label>
              <select
                value={primaryTarget}
                onChange={(e) => setPrimaryTarget(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              >
                <option value="Mars">Mars Analogue</option>
                <option value="Moon">Moon Analogue</option>
                <option value="Both">Dual-Purpose (Moon &amp; Mars)</option>
              </select>
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                FACILITY CLASSIFICATION
              </label>
              <select
                value={locationCategory}
                onChange={(e) => setLocationCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
              >
                <option value="NATURAL_SITE">Natural Terrestrial Field Site</option>
                <option value="RESEARCH_FACILITY">Simulation Habitat / Testing Facility</option>
              </select>
            </div>
          </div>

          {/* 5. Terrain & Minerals */}
          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              TERRAIN TYPE &amp; GEOMORPHOLOGY
            </label>
            <input
              type="text"
              placeholder="e.g. Basaltic lava flows, volcanic cones, and alluvial dry wash"
              value={terrainType}
              onChange={(e) => setTerrainType(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
            />
          </div>

          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              KEY LITHOLOGY &amp; MINERALS (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Basalt, Olivine, Pyroxene, Quartzite"
              value={lithologyInput}
              onChange={(e) => setLithologyInput(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
            />
          </div>

          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              SCIENTIFIC RESEARCH RATIONALE / MISSION RELEVANCE
            </label>
            <input
              type="text"
              placeholder="e.g. Robotic autonomous mobility test over shattered basaltic terrain"
              value={scientificRationale}
              onChange={(e) => setScientificRationale(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', fontSize: '12.5px' }}
            />
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={hasLavaTubes}
                onChange={(e) => setHasLavaTubes(e.target.checked)}
              />
              <span>Has Subterranean Lava Tubes / Caves</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={hasBasalticPlains}
                onChange={(e) => setHasBasalticPlains(e.target.checked)}
              />
              <span>Has Basaltic Volcanic Plains</span>
            </label>
          </div>

          {/* Verification Standards Notice */}
          <div
            className="font-mono"
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(250, 204, 21, 0.08)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              fontSize: '11px',
              color: '#fde047',
              borderRadius: '2px',
              lineHeight: 1.4,
            }}
          >
            <strong>SCIENTIFIC INTEGRITY RULE:</strong> Newly added community candidate sites are cataloged with status <code>UNVERIFIED</code>. They will immediately appear on the 3D globe and in the research directory, but cannot claim flight qualification without independent peer-reviewed literature provenance.
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-aerospace font-mono"
              style={{ padding: '8px 16px', fontSize: '11px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-aerospace btn-aerospace-cyan font-mono"
              style={{ padding: '8px 18px', fontSize: '11px' }}
            >
              <span>+ REGISTER &amp; PLOT ON 3D GLOBE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
