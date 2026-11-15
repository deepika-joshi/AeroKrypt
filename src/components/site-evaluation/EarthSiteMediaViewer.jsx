import { useState, useMemo } from 'react'
import { getSiteMedia } from '../../data/siteMediaManifest.js'
import InteractiveMap from '../common/InteractiveMap.jsx'

const CATEGORY_LABELS = {
  all: 'All',
  overview: 'Site Overview',
  terrain: 'Terrain',
  surface: 'Surface Details',
  'field-research': 'Field Research',
}

const TYPE_CONFIG = {
  SATELLITE_ORBITAL: {
    label: 'SATELLITE / ORBITAL',
    icon: '🛰️',
    color: '#00d2ff',
    bg: 'rgba(0, 210, 255, 0.15)',
    border: 'rgba(0, 210, 255, 0.35)',
  },
  GROUND_PHOTOGRAPH: {
    label: 'GROUND TERRAIN',
    icon: '🏔️',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  SURFACE_MACRO: {
    label: 'SURFACE DETAILS',
    icon: '🔬',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.35)',
  },
  FIELD_RESEARCH: {
    label: 'FIELD RESEARCH',
    icon: '🧑‍🔬',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)',
  },
}

function EarthSiteMediaGallery({ locationId, location, height = '240px' }) {
  const [viewMode, setViewMode] = useState('media') // 'media' | 'map'
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get curated media collection for the currently selected site
  const siteMedia = useMemo(() => {
    return getSiteMedia(locationId)
  }, [locationId])

  // Extract distinct categories available for this specific site
  const availableCategories = useMemo(() => {
    const cats = new Set(siteMedia.map((m) => m.category))
    return ['all', ...Array.from(cats)]
  }, [siteMedia])

  // Filter media by active category
  const filteredMedia = useMemo(() => {
    if (selectedCategory === 'all') return siteMedia
    return siteMedia.filter((m) => m.category === selectedCategory)
  }, [siteMedia, selectedCategory])

  const activeImage = filteredMedia[currentIndex] || filteredMedia[0] || null

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey)
    setCurrentIndex(0)
    setHasError(false)
  }

  const handlePrev = (e) => {
    e.stopPropagation()
    if (filteredMedia.length <= 1) return
    setCurrentIndex((prev) => (prev === 0 ? filteredMedia.length - 1 : prev - 1))
    setHasError(false)
  }

  const handleNext = (e) => {
    e.stopPropagation()
    if (filteredMedia.length <= 1) return
    setCurrentIndex((prev) => (prev === filteredMedia.length - 1 ? 0 : prev + 1))
    setHasError(false)
  }

  const typeConfig = activeImage?.imageType
    ? TYPE_CONFIG[activeImage.imageType] || TYPE_CONFIG.GROUND_PHOTOGRAPH
    : TYPE_CONFIG.GROUND_PHOTOGRAPH

  // If map view is selected, render the interactive Leaflet map seamlessly
  if (viewMode === 'map') {
    return (
      <div style={{ height, position: 'relative', overflow: 'hidden' }}>
        <InteractiveMap
          mode="earth"
          locations={location ? [location] : []}
          activeLocationId={locationId}
          height={height}
          defaultZoom={5}
        />
        {/* Toggle back to media viewer */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 1000,
            display: 'flex',
            gap: '6px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('media')}
            className="font-mono"
            style={{
              backgroundColor: 'rgba(5, 8, 14, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--accent-cyan, #00d2ff)',
              color: '#ffffff',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Switch back to site photography gallery"
          >
            <span>📷</span>
            <span>SITE MEDIA</span>
          </button>
        </div>
      </div>
    )
  }

  // Unavailable state for sites with no verified open-access imagery
  if (!siteMedia || siteMedia.length === 0) {
    return (
      <div
        className="font-mono"
        style={{
          height,
          position: 'relative',
          backgroundColor: '#070b14',
          borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          textAlign: 'center',
          color: '#94a3b8',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '24px', opacity: 0.6, marginBottom: '6px' }}>📷 ✕</div>
        <div
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#facc15',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          IMAGERY UNAVAILABLE
        </div>
        <p
          style={{
            fontSize: '11px',
            lineHeight: 1.45,
            maxWidth: '340px',
            margin: '0 0 10px 0',
            color: 'var(--text-muted, #64748b)',
          }}
        >
          Verified public-domain or open-access scientific photography is currently uncataloged for this site.
          In accordance with scientific integrity guidelines, unrelated stock images are not substituted.
        </p>
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className="font-mono"
          style={{
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            border: '1px solid rgba(0, 210, 255, 0.4)',
            color: '#00d2ff',
            fontSize: '10.5px',
            padding: '5px 10px',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>🗺️</span>
          <span>VIEW GEODETIC MAP</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="earth-site-media-viewer font-mono"
      style={{
        height,
        position: 'relative',
        backgroundColor: '#040710',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* =====================================================================
          1. TOP CONTROLS & CATEGORY STRIP
          ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '8px',
          right: '8px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
        }}
      >
        {/* Category Filter Pills */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: '3px',
            background: 'rgba(4, 7, 16, 0.88)',
            backdropFilter: 'blur(8px)',
            padding: '2px',
            borderRadius: '2px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            overflowX: 'auto',
            maxWidth: 'calc(100% - 90px)',
          }}
        >
          {availableCategories.map((catKey) => {
            const isActive = selectedCategory === catKey
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategorySelect(catKey)}
                style={{
                  background: isActive ? 'rgba(0, 210, 255, 0.25)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#00d2ff' : '#94a3b8',
                  fontSize: '9.5px',
                  fontWeight: isActive ? 700 : 500,
                  padding: '2px 6px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                }}
              >
                {CATEGORY_LABELS[catKey] || catKey}
              </button>
            )
          })}
        </div>

        {/* View Mode Toggle Button */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              backgroundColor: 'rgba(4, 7, 16, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              fontSize: '9.5px',
              padding: '3px 7px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Switch to 2D Geodetic Map"
          >
            <span>🗺️</span>
            <span>MAP</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. PRIMARY IMAGE & NAVIGATION CONTAINER
          ===================================================================== */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        {activeImage && !hasError ? (
          <img
            key={activeImage.id}
            src={activeImage.localPath}
            alt={activeImage.title || activeImage.caption}
            loading="lazy"
            onError={() => setHasError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transition: 'opacity 0.25s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '11px',
              backgroundColor: '#0a0f1d',
            }}
          >
            Image asset loading error
          </div>
        )}

        {/* Top-Left Image Type Badge */}
        {activeImage && (
          <div
            style={{
              position: 'absolute',
              top: '34px',
              left: '8px',
              backgroundColor: typeConfig.bg,
              border: `1px solid ${typeConfig.border}`,
              color: typeConfig.color,
              fontSize: '9px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '2px',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 5,
            }}
          >
            <span>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
          </div>
        )}

        {/* Top-Right Index Counter */}
        {filteredMedia.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '34px',
              right: '8px',
              backgroundColor: 'rgba(5, 8, 14, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '9.5px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '2px',
              backdropFilter: 'blur(6px)',
              zIndex: 5,
            }}
          >
            {currentIndex + 1} / {filteredMedia.length}
          </div>
        )}

        {/* Navigation Arrows (visible when multiple images exist) */}
        {filteredMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous site image"
              style={{
                position: 'absolute',
                top: '50%',
                left: '6px',
                transform: 'translateY(-50%)',
                background: 'rgba(4, 7, 16, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '26px',
                height: '32px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                zIndex: 6,
                backdropFilter: 'blur(4px)',
                transition: 'background 0.15s ease',
              }}
            >
              ❮
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next site image"
              style={{
                position: 'absolute',
                top: '50%',
                right: '6px',
                transform: 'translateY(-50%)',
                background: 'rgba(4, 7, 16, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '26px',
                height: '32px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                zIndex: 6,
                backdropFilter: 'blur(4px)',
                transition: 'background 0.15s ease',
              }}
            >
              ❯
            </button>
          </>
        )}

        {/* =====================================================================
            3. BOTTOM CAPTION & ATTRIBUTION OVERLAY
            ===================================================================== */}
        {activeImage && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(3, 6, 12, 0.96) 0%, rgba(3, 6, 12, 0.8) 75%, transparent 100%)',
              padding: '18px 10px 6px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              zIndex: 5,
            }}
          >
            {/* Title & Caption */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: '#f8fafc',
                  lineHeight: 1.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: isDetailsOpen ? 'normal' : 'nowrap',
                }}
                title={activeImage.caption || activeImage.title}
              >
                {activeImage.title}: <span style={{ fontWeight: 400, color: '#cbd5e1' }}>{activeImage.caption}</span>
              </div>

              {activeImage.scientificContext && (
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDetailsOpen ? '#00d2ff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '9.5px',
                    padding: 0,
                    whiteSpace: 'nowrap',
                    textDecoration: 'underline',
                  }}
                >
                  {isDetailsOpen ? 'less' : 'details'}
                </button>
              )}
            </div>

            {/* Expandable Scientific Context */}
            {isDetailsOpen && activeImage.scientificContext && (
              <p
                style={{
                  fontSize: '10px',
                  lineHeight: 1.35,
                  color: '#94a3b8',
                  margin: '3px 0',
                  padding: '4px 6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '2px',
                  borderLeft: '2px solid var(--accent-cyan, #00d2ff)',
                }}
              >
                <strong>Scientific Context:</strong> {activeImage.scientificContext}
              </p>
            )}

            {/* Attribution Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9px',
                color: '#94a3b8',
                marginTop: '1px',
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                <span style={{ color: 'var(--accent-cyan, #00d2ff)' }}>📷</span> {activeImage.creator} &bull;{' '}
                <span style={{ color: '#cbd5e1' }}>{activeImage.license}</span>
              </div>
              {activeImage.sourceUrl && (
                <a
                  href={activeImage.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00d2ff', textDecoration: 'none', fontSize: '9px' }}
                  title="View verified original archive source"
                >
                  Source ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          4. THUMBNAIL STRIP (When category has >1 image)
          ===================================================================== */}
      {filteredMedia.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#040710',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
          }}
        >
          {filteredMedia.map((item, idx) => {
            const isSelected = idx === currentIndex
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx)
                  setHasError(false)
                }}
                style={{
                  width: '38px',
                  height: '24px',
                  padding: 0,
                  border: isSelected ? '1.5px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#000000',
                  opacity: isSelected ? 1 : 0.6,
                  flexShrink: 0,
                  transition: 'opacity 0.15s ease, border-color 0.15s ease',
                }}
                title={item.title}
              >
                <img
                  src={item.localPath}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function EarthSiteMediaViewer({
  locationId = null,
  location = null,
  height = '240px',
}) {
  return (
    <EarthSiteMediaGallery
      key={locationId || 'default'}
      locationId={locationId}
      location={location}
      height={height}
    />
  )
}
