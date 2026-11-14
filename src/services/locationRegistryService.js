/**
 * AEROKRYPT - Planetary Analogue Location Registry Service
 * 
 * Provides unified data access, coordinate extraction, custom location expansion,
 * and geocoding support for both 3D Earth Globe and 2D Geodetic Explorer.
 * Preserves the 20 audited benchmark locations while enabling extensible community
 * additions with strict scientific verification status boundaries.
 */

import { ANALOGUE_LOCATIONS as CURATED_LOCATIONS } from '../data/locationsData.js'

const STORAGE_KEY = 'aerokrypt_custom_analogue_locations'

/**
 * Calculates 3D Cartesian coordinates on sphere from latitude and longitude.
 * Mathematically aligned with Three.js SphereGeometry equirectangular UV mapping.
 * @param {number} lat - Latitude in degrees (-90 to +90)
 * @param {number} lng - Longitude in degrees (-180 to +180)
 * @param {number} radius - Sphere radius
 * @returns {{ x: number, y: number, z: number }} Vector3 position
 */
export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return { x, y, z }
}

/**
 * Extracts or parses accurate numeric latitude and longitude from location record.
 * @param {Object} loc - Location record
 * @returns {{ lat: number, lng: number }} Numeric WGS 84 coordinates
 */
export function getLocationCoordinates(loc) {
  if (!loc) return { lat: 0, lng: 0 }

  // 1. Check userSuppliedCoordinates first (exact benchmark numeric coordinates)
  if (
    loc.userSuppliedCoordinates &&
    typeof loc.userSuppliedCoordinates.latitude === 'number' &&
    typeof loc.userSuppliedCoordinates.longitude === 'number' &&
    !isNaN(loc.userSuppliedCoordinates.latitude) &&
    !isNaN(loc.userSuppliedCoordinates.longitude)
  ) {
    return {
      lat: loc.userSuppliedCoordinates.latitude,
      lng: loc.userSuppliedCoordinates.longitude,
    }
  }

  // 2. Check direct latitude/longitude fields
  if (
    typeof loc.latitude === 'number' &&
    typeof loc.longitude === 'number' &&
    !isNaN(loc.latitude) &&
    !isNaN(loc.longitude)
  ) {
    return { lat: loc.latitude, lng: loc.longitude }
  }

  // 3. Parse formatted DMS or decimal string e.g. "24°04′S, 69°59′W" or "37.6967, -6.5567"
  const coordStr = loc.coordinates || loc.centerCoordinates
  if (coordStr) {
    const parts = coordStr.split(',')
    if (parts.length >= 2) {
      const lat = parseDmsOrDecimal(parts[0])
      const lng = parseDmsOrDecimal(parts[1])
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng }
      }
    }
  }

  // 4. Check geographicBoundaries bounding box center
  if (loc.geographicBoundaries?.boundingBox) {
    const bb = loc.geographicBoundaries.boundingBox
    const north = parseDmsOrDecimal(bb.north)
    const south = parseDmsOrDecimal(bb.south)
    const east = parseDmsOrDecimal(bb.east)
    const west = parseDmsOrDecimal(bb.west)
    if (!isNaN(north) && !isNaN(south) && !isNaN(east) && !isNaN(west)) {
      return {
        lat: (north + south) / 2,
        lng: (east + west) / 2,
      }
    }
  }

  return { lat: 0, lng: 0 }
}

/**
 * Parses DMS (degrees, minutes, seconds) or decimal string into numeric float.
 */
export function parseDmsOrDecimal(coordStr) {
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

/**
 * Retrieves all locations: 20 curated baseline locations + user-submitted custom locations.
 */
export function getAllLocations() {
  const customLocations = getStoredCustomLocations()

  // Enhance all curated locations with guaranteed lat/lng coordinates
  const enhancedCurated = CURATED_LOCATIONS.map((loc) => {
    const coords = getLocationCoordinates(loc)
    return {
      ...loc,
      latitude: coords.lat,
      longitude: coords.lng,
      isCustom: false,
    }
  })

  return [...enhancedCurated, ...customLocations]
}

/**
 * Retrieves custom stored locations from localStorage.
 */
export function getStoredCustomLocations() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error reading custom analogue locations from localStorage:', err)
    return []
  }
}

/**
 * Persists a new custom location for future expansion.
 * Sets verificationStatus to UNVERIFIED to preserve scientific audit standards.
 */
export function addCustomLocation(input) {
  if (!input || !input.name) {
    throw new Error('Location name is required.')
  }

  const lat = typeof input.latitude === 'number' ? input.latitude : parseFloat(input.latitude)
  const lng = typeof input.longitude === 'number' ? input.longitude : parseFloat(input.longitude)

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Valid latitude (-90 to +90) and longitude (-180 to +180) are required.')
  }

  const id = `custom-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
  const targetBodies = input.targetBodies || (input.primaryTarget === 'Both' ? ['Mars', 'Moon'] : [input.primaryTarget || 'Mars'])
  const primaryTarget = input.primaryTarget || targetBodies[0] || 'Mars'
  const analogueRelevance = targetBodies.length > 1 ? 'BOTH' : primaryTarget.toUpperCase()

  const formatCoord = (val, isLat) => {
    const abs = Math.abs(val).toFixed(4)
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W')
    return `${abs}° ${dir}`
  }

  const newLocation = {
    id,
    name: input.name.trim(),
    country: input.country?.trim() || 'Unspecified Jurisdiction',
    region: input.region?.trim() || 'Research Sector',
    coordinates: `${formatCoord(lat, true)}, ${formatCoord(lng, false)}`,
    latitude: lat,
    longitude: lng,
    userSuppliedCoordinates: { latitude: lat, longitude: lng },
    targetBodies,
    primaryTarget,
    analogueRelevance,
    locationCategory: input.locationCategory || 'NATURAL_SITE',
    verificationStatus: 'UNVERIFIED', // Explicitly unverified to ensure scientific integrity
    verificationAuditNotice: 'Community / Researcher Submitted Candidate Site. Pending formal scientific peer-review audit.',
    terrainType: input.terrainType || 'Unclassified Planetary Analogue Terrain',
    hasLavaTubes: Boolean(input.hasLavaTubes),
    hasBasalticPlains: Boolean(input.hasBasalticPlains),
    morphologicalFeatures: input.morphologicalFeatures || [input.terrainType || 'Planetary Analogue Field'],
    lithology: input.lithology || ['Undifferentiated Analogue Matrix'],
    geologicalContext: input.geologicalContext || 'Candidate site submitted for off-world planetary simulation comparison.',
    elevation: {
      value: input.elevationM || 100,
      unit: 'm',
      label: `${input.elevationM || 100} m a.s.l. (User submitted)`,
      status: 'ESTIMATED',
      measurementLocation: 'Site estimated centroid',
      measurementPeriod: 'Submission baseline',
      sourceCitation: 'Researcher Contributed Submission (AEROKRYPT Registry)',
    },
    slope: {
      typicalDeg: input.typicalSlopeDeg || 4.0,
      maxDeg: input.maxSlopeDeg || 12.0,
      label: `${input.typicalSlopeDeg || 4.0}° typical (Estimated)`,
      status: 'ESTIMATED',
      measurementLocation: 'Regional topographic model',
      measurementPeriod: 'Estimated profile',
      sourceCitation: 'User-specified terrain parameter',
    },
    meanAnnualTemp: {
      value: input.meanTempC || 15.0,
      unit: '°C',
      label: `${input.meanTempC || 15.0} °C (Regional estimate)`,
      status: 'ESTIMATED',
      measurementLocation: 'Regional meteorological series',
      measurementPeriod: 'Climatological estimate',
      sourceCitation: 'Regional climatology archive',
    },
    annualPrecipitation: {
      value: input.annualPrecipMm || 200,
      unit: 'mm/year',
      label: `${input.annualPrecipMm || 200} mm/yr (Estimated)`,
      status: 'ESTIMATED',
      measurementLocation: 'Regional precipitation baseline',
      measurementPeriod: 'Climatology series',
      sourceCitation: 'Regional climatology estimate',
    },
    planetaryAnalogy: {
      specificRegion: input.planetaryAnalogy || `${primaryTarget} surface environment analogue`,
      scientificRationale: input.scientificRationale || 'Terrestrial simulation candidate for planetary analogue experimentation.',
    },
    isCustom: true,
    dateAdded: new Date().toISOString(),
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    const existing = getStoredCustomLocations()
    const updated = [newLocation, ...existing]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return newLocation
}

/**
 * Removes a custom location by ID.
 */
export function removeCustomLocation(locationId) {
  if (typeof window === 'undefined' || !window.localStorage) return

  const existing = getStoredCustomLocations()
  const updated = existing.filter((l) => l.id !== locationId)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/**
 * Resets custom locations and restores curated benchmark baseline.
 */
export function resetCustomLocations() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Geocodes an address or place name using OpenStreetMap Nominatim API.
 * Falls back to local coordinate parsing or default scientific regions.
 * @param {string} query - Place name or coordinates
 * @returns {Promise<{ lat: number, lng: number, displayName: string } | null>}
 */
export async function geocodeLocationName(query) {
  if (!query || !query.trim()) return null
  const q = query.trim()

  // 1. Direct coordinate format check e.g. "34.56, -112.34" or "34°30'N, 112°20'W"
  if (q.includes(',')) {
    const parts = q.split(',')
    const lat = parseDmsOrDecimal(parts[0])
    const lng = parseDmsOrDecimal(parts[1])
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return {
        lat,
        lng,
        displayName: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
        source: 'DIRECT_COORDINATES',
      }
    }
  }

  // 2. Query Nominatim Public Geocoding API
  try {
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
    const res = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AeroKrypt-Planetary-Research-Platform/1.0',
      },
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        const item = data[0]
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            lat,
            lng,
            displayName: item.display_name,
            source: 'NOMINATIM_OSM',
          }
        }
      }
    }
  } catch (err) {
    console.warn('Online geocoding unavailable or rate-limited, falling back to local heuristic:', err)
  }

  // 3. Fallback dictionary of common planetary research analogues
  const KNOWN_ANALOGUE_REGIONS = {
    'mojave': { lat: 35.011, lng: -115.4734, displayName: 'Mojave Desert, California, USA' },
    'death valley': { lat: 36.5323, lng: -116.9325, displayName: 'Death Valley, California, USA' },
    'white sands': { lat: 32.7797, lng: -106.1717, displayName: 'White Sands National Park, New Mexico, USA' },
    'kamchatka': { lat: 56.1325, lng: 160.7208, displayName: 'Kamchatka Volcanic Peninsula, Russia' },
    'kilbourne hole': { lat: 31.9708, lng: -106.9667, displayName: 'Kilbourne Hole Maar, New Mexico, USA' },
    'tenere': { lat: 19.0, lng: 10.0, displayName: 'Ténéré Desert, Niger, Sahara' },
    'lut desert': { lat: 30.606, lng: 58.802, displayName: 'Lut Desert (Dasht-e Lut), Iran' },
    'danakil': { lat: 14.2417, lng: 40.3, displayName: 'Danakil Depression, Afar, Ethiopia' },
    'rothesay': { lat: 56.55, lng: -6.15, displayName: 'Isle of Mull Basalts, Scotland, UK' },
  }

  const lower = q.toLowerCase()
  for (const [key, val] of Object.entries(KNOWN_ANALOGUE_REGIONS)) {
    if (lower.includes(key)) {
      return {
        ...val,
        source: 'OFFLINE_ANALOGUE_DICTIONARY',
      }
    }
  }

  return null
}
