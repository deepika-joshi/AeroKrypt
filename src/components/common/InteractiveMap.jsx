import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PLANETARY_TERRAIN_DATASETS } from '../../data/planetaryTerrainData.js'
import { BASEMAP_DEFINITIONS } from '../../data/mapLayerData.js'

export { BASEMAP_DEFINITIONS }

export default function InteractiveMap({
  mode = 'earth', // 'earth' | 'mars' | 'moon'
  locations = [],
  activeLocationId = null,
  onSelectLocation = null,
  onEvaluateSite = null,
  height = '480px',
  center = null,
  zoom = null,
  defaultZoom = null,
  showLayerSwitcher = true,
  showLegend = true,
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersLayerGroupRef = useRef(null)
  
  const [activeBasemapKey, setActiveBasemapKey] = useState(
    mode === 'mars' ? 'marsMola' : mode === 'moon' ? 'moonWac' : 'earthDark'
  )
  const [cursorCoords, setCursorCoords] = useState(null)
  const [activeMetadataModal, setActiveMetadataModal] = useState(null)

  // Determine current active basemap config
  const currentBasemap = BASEMAP_DEFINITIONS[activeBasemapKey] || BASEMAP_DEFINITIONS.earthDark

  // Default coordinate centers per planetary body
  const defaultCenter =
    center || (mode === 'mars' ? [0, 0] : mode === 'moon' ? [0, 0] : [20, 0])
  const effectiveZoom = zoom || defaultZoom || (mode === 'earth' ? 2 : 1)

  // When mode changes externally, auto-switch to body default
  useEffect(() => {
    if (mode === 'mars' && (!currentBasemap || currentBasemap.body !== 'Mars')) {
      setActiveBasemapKey('marsMola')
    } else if (mode === 'moon' && (!currentBasemap || currentBasemap.body !== 'Moon')) {
      setActiveBasemapKey('moonWac')
    } else if (mode === 'earth' && (!currentBasemap || currentBasemap.body !== 'Earth')) {
      setActiveBasemapKey('earthDark')
    }
  }, [mode, currentBasemap])

  // Invalidate map size after mount and after mode/height changes to ensure tiles fill container
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [mode, height])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id
    }

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: effectiveZoom,
      minZoom: 1,
      maxZoom: mode === 'earth' ? 18 : 7,
      worldCopyJump: true,
      zoomControl: true,
    })

    // Add scale bar
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map)

    const initialBasemap = BASEMAP_DEFINITIONS[activeBasemapKey] || BASEMAP_DEFINITIONS.earthDark
    if (initialBasemap.url) {
      const tileLayer = L.tileLayer(initialBasemap.url, {
        attribution: initialBasemap.attribution,
        subdomains: initialBasemap.subdomains || 'abc',
        maxZoom: initialBasemap.maxZoom,
        errorTileUrl: 'https://tile.openstreetmap.org/1/0/0.png',
      }).addTo(map)
      tileLayerRef.current = tileLayer
    }

    const markersGroup = L.layerGroup().addTo(map)

    // Track mouse cursor coordinates
    map.on('mousemove', (e) => {
      const lat = e.latlng.lat.toFixed(4)
      const lng = e.latlng.lng.toFixed(4)
      setCursorCoords({ lat, lng })
    })

    map.on('mouseout', () => {
      setCursorCoords(null)
    })

    mapInstanceRef.current = map
    markersLayerGroupRef.current = markersGroup

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch basemap layer when activeBasemapKey changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const basemapConfig = BASEMAP_DEFINITIONS[activeBasemapKey]
    if (!basemapConfig) return

    // If layer has a live URL (MAP_SERVICE), switch tile layer
    if (basemapConfig.url) {
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(basemapConfig.url)
      } else {
        const tileLayer = L.tileLayer(basemapConfig.url, {
          attribution: basemapConfig.attribution,
          subdomains: basemapConfig.subdomains || 'abc',
          maxZoom: basemapConfig.maxZoom,
          errorTileUrl: 'https://tile.openstreetmap.org/1/0/0.png',
        }).addTo(mapInstanceRef.current)
        tileLayerRef.current = tileLayer
      }
    }

    if (mapInstanceRef.current.attributionControl) {
      mapInstanceRef.current.attributionControl.setPrefix(false)
    }
  }, [activeBasemapKey])

  // Populate map markers depending on mode
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return

    const markersGroup = markersLayerGroupRef.current
    markersGroup.clearLayers()

    // Select locations to plot: if Earth mode, use passed locations (or defaults);
    // if Mars/Moon mode, use authentic PLANETARY_TERRAIN_DATASETS pins!
    let itemsToPlot = []
    if (mode === 'earth') {
      itemsToPlot = locations
    } else if (mode === 'mars') {
      itemsToPlot = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Mars')
    } else if (mode === 'moon') {
      itemsToPlot = PLANETARY_TERRAIN_DATASETS.filter((d) => d.targetBody === 'Moon')
    }

    if (!itemsToPlot || itemsToPlot.length === 0) return

    const bounds = L.latLngBounds([])

    itemsToPlot.forEach((loc) => {
      let lat = 0
      let lng = 0

      // Extract coordinates
      const coordStr = loc.centerCoordinates || loc.coordinates
      if (coordStr) {
        const parts = coordStr.split(',')
        lat = parseDmsOrDecimal(parts[0])
        lng = parseDmsOrDecimal(parts[1])
      }

      if (isNaN(lat) || isNaN(lng)) return

      const isCurrentActive = activeLocationId === loc.id
      const isFacility = loc.locationCategory === 'RESEARCH_FACILITY'
      const markerColor = isCurrentActive
        ? '#eab308'
        : mode === 'mars'
        ? '#f97316'
        : mode === 'moon'
        ? '#cbd5e1'
        : isFacility
        ? '#c084fc'
        : '#00d2ff'

      const glyph = mode === 'mars' ? '♂' : mode === 'moon' ? '☾' : isFacility ? '⌂' : '⊕'

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(markerColor, glyph),
        title: loc.name,
      })

      // Popup Content
      const popupDiv = document.createElement('div')
      popupDiv.className = 'map-leaflet-popup font-mono'
      popupDiv.innerHTML = `
        <div style="margin-bottom: 4px;">
          ${loc.locationCategory ? `
            <span style="display: inline-block; font-size: 8px; font-weight: 800; padding: 1px 4px; border-radius: 2px; text-transform: uppercase; background: ${isFacility ? 'rgba(192,132,252,0.2)' : 'rgba(0,210,255,0.15)'}; color: ${isFacility ? '#c084fc' : '#00d2ff'}; border: 1px solid ${isFacility ? '#c084fc' : '#00d2ff'}; margin-bottom: 3px;">
              ${isFacility ? 'Research Facility' : 'Natural Field Site'}
            </span>
          ` : ''}
          ${loc.verificationStatus ? `
            <span style="display: inline-block; font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 2px; text-transform: uppercase; background: rgba(255,255,255,0.08); color: ${loc.verificationStatus === 'VERIFIED' ? '#4ade80' : '#facc15'}; margin-left: 2px;">
              ${loc.verificationStatus}
            </span>
          ` : ''}
        </div>
        <div style="font-weight: 800; font-size: 13px; color: #050608; margin-bottom: 4px; text-transform: uppercase;">
          ${loc.name}
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">
          ${loc.region || loc.planetaryRegion || ''} &bull; <strong>${coordStr}</strong>
        </div>
        <div style="font-size: 11px; color: #0284c7; margin-bottom: 8px;">
          <strong>Target:</strong> ${loc.analogueRelevance || loc.targetBody || loc.primaryTarget || 'Planetary'} Analogue
          <br><strong>Relief:</strong> ${loc.elevation?.label || loc.elevation?.nominalM + 'm' || 'Documented'}
          <br><strong>Slope:</strong> ${loc.slope?.typicalDeg !== undefined ? loc.slope.typicalDeg + '° typical' : 'Curated'}
        </div>
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button id="btn-view-profile-${loc.id}" style="background: #050608; color: #ffffff; border: none; padding: 4px 8px; font-size: 10px; border-radius: 2px; cursor: pointer; text-transform: uppercase; font-family: monospace;">
            Inspect
          </button>
          <button id="btn-eval-site-${loc.id}" style="background: #00d2ff; color: #050608; border: none; padding: 4px 8px; font-size: 10px; border-radius: 2px; cursor: pointer; font-weight: 700; text-transform: uppercase; font-family: monospace;">
            Evaluate &rarr;
          </button>
        </div>
      `

      marker.bindPopup(popupDiv)

      marker.on('click', () => {
        if (onSelectLocation) {
          onSelectLocation(loc.id)
        }
      })

      marker.on('popupopen', () => {
        const btnProfile = document.getElementById(`btn-view-profile-${loc.id}`)
        const btnEval = document.getElementById(`btn-eval-site-${loc.id}`)

        if (btnProfile && onSelectLocation) {
          btnProfile.onclick = () => onSelectLocation(loc.id)
        }
        if (btnEval && onEvaluateSite) {
          btnEval.onclick = () => onEvaluateSite(loc.id)
        }
      })

      marker.addTo(markersGroup)
      bounds.extend([lat, lng])

      // Plot bounding boxes if available for Earth sites
      if (loc.geographicBoundaries && loc.geographicBoundaries.boundingBox) {
        const bbox = loc.geographicBoundaries.boundingBox
        const north = parseDmsOrDecimal(bbox.north)
        const south = parseDmsOrDecimal(bbox.south)
        const west = parseDmsOrDecimal(bbox.west)
        const east = parseDmsOrDecimal(bbox.east)

        if (!isNaN(north) && !isNaN(south) && !isNaN(west) && !isNaN(east)) {
          const rect = L.rectangle(
            [
              [south, west],
              [north, east],
            ],
            {
              color: isCurrentActive ? '#eab308' : '#00d2ff',
              weight: isCurrentActive ? 2 : 1,
              fillOpacity: isCurrentActive ? 0.15 : 0.04,
              dashArray: isCurrentActive ? null : '4 4',
            }
          )
          rect.addTo(markersGroup)
        }
      }
    })

    // Auto-pan if active location selected
    if (activeLocationId) {
      const activeLoc = itemsToPlot.find((l) => l.id === activeLocationId)
      if (activeLoc) {
        const coordStr = activeLoc.coordinates || activeLoc.centerCoordinates
        if (coordStr) {
          const parts = coordStr.split(',')
          const lat = parseDmsOrDecimal(parts[0])
          const lng = parseDmsOrDecimal(parts[1])
          if (!isNaN(lat) && !isNaN(lng)) {
            mapInstanceRef.current.flyTo([lat, lng], 5, { duration: 1.0 })
          }
        }
      }
    } else if (itemsToPlot.length > 0 && bounds.isValid() && mode === 'earth') {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 })
    }
  }, [locations, activeLocationId, mode, onSelectLocation, onEvaluateSite])

  // Get available layers for the current body
  const availableLayers = Object.values(BASEMAP_DEFINITIONS).filter((d) => {
    if (mode === 'mars') return d.body === 'Mars'
    if (mode === 'moon') return d.body === 'Moon'
    return d.body === 'Earth'
  })

  return (
    <div className="interactive-map-wrapper" style={{ position: 'relative', width: '100%', height }}>
      {/* Map Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* 1. Top Right Floating Layer Switcher */}
      {showLayerSwitcher && (
        <div
          className="map-layer-selector-bar font-mono"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            background: 'rgba(5, 6, 8, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '2px',
            padding: '6px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
            fontSize: '11px',
            maxWidth: '90%',
          }}
        >
          <span style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LAYER:</span>
          {availableLayers.map((layer) => {
            const isSelected = activeBasemapKey === layer.id
            const isVisual = layer.type === 'MAP_SERVICE'

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => {
                  if (isVisual) {
                    setActiveBasemapKey(layer.id)
                  } else {
                    setActiveMetadataModal(layer)
                  }
                }}
                title={layer.description}
                style={{
                  background: isSelected ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#00d2ff' : isVisual ? '#ffffff' : '#eab308',
                  border: '1px solid',
                  borderColor: isSelected ? '#00d2ff' : isVisual ? 'rgba(255,255,255,0.1)' : 'rgba(234, 179, 8, 0.3)',
                  borderRadius: '2px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '10.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{layer.name}</span>
                <span
                  style={{
                    fontSize: '9px',
                    padding: '1px 3px',
                    borderRadius: '2px',
                    backgroundColor: isVisual ? 'rgba(0, 210, 255, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                    color: isVisual ? '#00d2ff' : '#eab308',
                  }}
                >
                  {layer.type === 'MAP_SERVICE' ? 'VISUAL' : 'METADATA'}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* 2. Top Left Live Telemetry & Coordinate Readout */}
      <div
        className="map-telemetry-badge font-mono"
        style={{
          position: 'absolute',
          top: '12px',
          left: '52px', // Next to Leaflet zoom controls
          zIndex: 1000,
          background: 'rgba(5, 6, 8, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '2px',
          padding: '4px 10px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ color: mode === 'mars' ? '#f97316' : mode === 'moon' ? '#cbd5e1' : '#00d2ff', fontWeight: 700 }}>
          {mode.toUpperCase()} TARGET
        </span>
        <span>&bull;</span>
        <span>
          {cursorCoords ? `${cursorCoords.lat}° Lat, ${cursorCoords.lng}° Lon` : 'PAN OR HOVER FOR COORDINATES'}
        </span>
        <span>&bull;</span>
        <span style={{ color: 'var(--text-muted)' }}>
          {mode === 'mars' ? 'MOLA Areoid (610 Pa)' : mode === 'moon' ? 'Lunar Sphere' : 'WGS 84'}
        </span>
      </div>

      {/* 3. Bottom Right Technical Attribution & Legend Pill */}
      {showLegend && (
        <div
          className="map-legend-pill font-mono"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 1000,
            background: 'rgba(5, 6, 8, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '2px',
            padding: '6px 12px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentBasemap.type === 'MAP_SERVICE' ? '#00d2ff' : '#eab308' }} />
            <span style={{ color: '#ffffff' }}>{currentBasemap.name}</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--accent-cyan)' }}>[{currentBasemap.type}]</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>{currentBasemap.crs}</span>
        </div>
      )}

      {/* 4. Metadata Layer Specification Modal */}
      {activeMetadataModal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(5, 6, 8, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setActiveMetadataModal(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              padding: '24px',
              maxWidth: '540px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '10px', color: '#eab308', letterSpacing: '0.12em' }}>
                  METADATA_ONLY SPECIFICATION
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {activeMetadataModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMetadataModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeMetadataModal.description}
            </p>

            <div className="font-mono" style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.04)', padding: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div><strong>AGENCY:</strong> {activeMetadataModal.attribution}</div>
              <div style={{ marginTop: '4px' }}><strong>COORDINATE SYSTEM:</strong> {activeMetadataModal.crs}</div>
              <div style={{ marginTop: '4px', color: '#eab308' }}>
                <strong>INTEGRATION STATUS:</strong> Cataloged in metadata registry. Client-side binary raster parsing is slated for the dedicated raster pipeline milestone.
              </div>
            </div>

            <button
              type="button"
              className="btn-aerospace btn-aerospace-solid"
              onClick={() => setActiveMetadataModal(null)}
              style={{ padding: '8px 16px', fontSize: '11px', alignSelf: 'flex-end', marginTop: '6px' }}
            >
              CLOSE SPECIFICATION
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Creates an aerospace-styled circular marker with target glyph
 */
function createCustomIcon(markerColor, glyph) {
  return L.divIcon({
    className: 'custom-aerospace-marker',
    html: `
      <div style="
        width: 26px;
        height: 26px;
        background: ${markerColor};
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${markerColor}, 0 2px 6px rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #050608;
        font-weight: 900;
        font-size: 13px;
        line-height: 1;
        font-family: monospace;
        cursor: pointer;
      ">${glyph}</div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  })
}

/**
 * Parses DMS (e.g., 24°04′S, 69°59′W) or decimal degrees into float
 */
function parseDmsOrDecimal(coordStr) {
  if (!coordStr) return NaN
  const str = String(coordStr).trim()

  // Match decimal degrees e.g. 18.38°N, -24.0667, 77.58°E, 18.38 N
  const decMatch = str.match(/^([+-]?\d+(?:\.\d+)?)\s*°?\s*([NSEW])?$/i)
  if (decMatch) {
    let val = parseFloat(decMatch[1])
    const dir = decMatch[2]?.toUpperCase()
    if (dir === 'S' || dir === 'W') val = -val
    return val
  }

  // Match DMS with seconds e.g. 24°04′30″S or 24 04 30 S
  const dmsWithSec = str.match(/^(\d+)[°\s]+(\d+)[′']?\s*(\d+(?:\.\d+)?)[″"]?\s*([NSEW])?$/i)
  if (dmsWithSec) {
    const deg = parseFloat(dmsWithSec[1])
    const min = parseFloat(dmsWithSec[2])
    const sec = parseFloat(dmsWithSec[3])
    let val = deg + min / 60 + sec / 3600
    const dir = dmsWithSec[4]?.toUpperCase()
    if (dir === 'S' || dir === 'W') val = -val
    return val
  }

  // Match DMS e.g. 24°04′S or 69°59′W
  const dmsMatch = str.match(/^(\d+)[°\s]+(\d+)[′']?\s*([NSEW])?$/i)
  if (dmsMatch) {
    const deg = parseFloat(dmsMatch[1])
    const min = parseFloat(dmsMatch[2])
    let val = deg + min / 60
    const dir = dmsMatch[3]?.toUpperCase()
    if (dir === 'S' || dir === 'W') val = -val
    return val
  }

  const raw = parseFloat(str)
  return isNaN(raw) ? 0 : raw
}
