import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer } from 'vite'

// Polyfill window & document for browser libraries evaluated in SSR / node:test
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:5173/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
    localStorage: {
      _store: {},
      getItem(key) { return this._store[key] || null },
      setItem(key, val) { this._store[key] = String(val) },
      removeItem(key) { delete this._store[key] },
      clear() { this._store = {} },
    },
  }
}

if (!globalThis.document) {
  globalThis.document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {} },
      innerHTML: '',
      getContext: () => null,
    }),
    documentElement: { style: {} },
    body: { style: {} },
    getElementById: () => null,
  }
}

test('AEROKRYPT 3D EARTH GLOBE & FUTURE EXPANSION AUDIT', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const {
      getAllLocations,
      getLocationCoordinates,
      parseDmsOrDecimal,
      latLngToVector3,
      addCustomLocation,
      removeCustomLocation,
      resetCustomLocations,
      geocodeLocationName,
    } = await vite.ssrLoadModule('./src/services/locationRegistryService.js')

    const EarthGlobe3D = (await vite.ssrLoadModule('./src/components/location-finder/EarthGlobe3D.jsx')).default
    const AddLocationModal = (await vite.ssrLoadModule('./src/components/location-finder/AddLocationModal.jsx')).default
    const LocationFinder = (await vite.ssrLoadModule('./src/components/location-finder/LocationFinder.jsx')).default

    // ------------------------------------------------------------------------
    // SECTION 1: 3D SPHERICAL COORDINATE MATHEMATICS
    // ------------------------------------------------------------------------
    await t.test('Section 1.1: Cardinal points project accurately on 3D sphere', () => {
      const radius = 100

      // North Pole (+90 lat, 0 lng) -> strictly on +Y axis
      const np = latLngToVector3(90, 0, radius)
      assert.ok(Math.abs(np.x) < 0.001, 'North Pole X = 0')
      assert.ok(Math.abs(np.y - 100) < 0.001, 'North Pole Y = 100')
      assert.ok(Math.abs(np.z) < 0.001, 'North Pole Z = 0')

      // South Pole (-90 lat, 0 lng) -> strictly on -Y axis
      const sp = latLngToVector3(-90, 0, radius)
      assert.ok(Math.abs(sp.x) < 0.001, 'South Pole X = 0')
      assert.ok(Math.abs(sp.y - (-100)) < 0.001, 'South Pole Y = -100')
      assert.ok(Math.abs(sp.z) < 0.001, 'South Pole Z = 0')

      // Equator / Prime Meridian (0 lat, 0 lng) -> strictly on +X axis
      const eqPrime = latLngToVector3(0, 0, radius)
      assert.ok(Math.abs(eqPrime.x - 100) < 0.001, 'Equator Prime Meridian X = 100')
      assert.ok(Math.abs(eqPrime.y) < 0.001, 'Equator Prime Meridian Y = 0')
      assert.ok(Math.abs(eqPrime.z) < 0.001, 'Equator Prime Meridian Z = 0')

      // 90° East (0 lat, +90 lng) -> strictly on -Z axis
      const east90 = latLngToVector3(0, 90, radius)
      assert.ok(Math.abs(east90.x) < 0.001, '90° East X = 0')
      assert.ok(Math.abs(east90.y) < 0.001, '90° East Y = 0')
      assert.ok(Math.abs(east90.z - (-100)) < 0.001, '90° East Z = -100')

      // 90° West (0 lat, -90 lng) -> strictly on +Z axis
      const west90 = latLngToVector3(0, -90, radius)
      assert.ok(Math.abs(west90.x) < 0.001, '90° West X = 0')
      assert.ok(Math.abs(west90.y) < 0.001, '90° West Y = 0')
      assert.ok(Math.abs(west90.z - 100) < 0.001, '90° West Z = 100')
    })

    await t.test('Section 1.2: All 20 audited locations yield valid 3D spherical positions', () => {
      const locations = getAllLocations()
      assert.equal(locations.length, 20, 'Curated baseline returns 20 sites')

      locations.forEach((loc) => {
        const coords = getLocationCoordinates(loc)
        assert.ok(typeof coords.lat === 'number' && !isNaN(coords.lat), `Location ${loc.id} has valid lat`)
        assert.ok(typeof coords.lng === 'number' && !isNaN(coords.lng), `Location ${loc.id} has valid lng`)
        assert.ok(coords.lat >= -90 && coords.lat <= 90, `Location ${loc.id} lat within [-90, 90]`)
        assert.ok(coords.lng >= -180 && coords.lng <= 180, `Location ${loc.id} lng within [-180, 180]`)

        const vec = latLngToVector3(coords.lat, coords.lng, 100)
        const length = Math.hypot(vec.x, vec.y, vec.z)
        assert.ok(Math.abs(length - 100) < 0.01, `Location ${loc.id} lies exactly on sphere radius 100`)
      })
    })

    // ------------------------------------------------------------------------
    // SECTION 2: DMS & DECIMAL COORDINATE PARSING
    // ------------------------------------------------------------------------
    await t.test('Section 2.1: Coordinate parser handles DMS and decimal variations', () => {
      // Decimal with signs
      assert.equal(parseDmsOrDecimal('24.0889'), 24.0889)
      assert.equal(parseDmsOrDecimal('-69.9286'), -69.9286)

      // Decimal with directional suffix
      assert.equal(parseDmsOrDecimal('24.0889° S'), -24.0889)
      assert.equal(parseDmsOrDecimal('69.9286° W'), -69.9286)
      assert.equal(parseDmsOrDecimal('33.3061° N'), 33.3061)
      assert.equal(parseDmsOrDecimal('78.0067° E'), 78.0067)

      // DMS without seconds: 24°04′S
      const dms1 = parseDmsOrDecimal('24°04′S')
      assert.ok(Math.abs(dms1 - (-24.0667)) < 0.001, 'Parses 24°04′S')

      // DMS without seconds: 69°59′W
      const dms2 = parseDmsOrDecimal('69°59′W')
      assert.ok(Math.abs(dms2 - (-69.9833)) < 0.001, 'Parses 69°59′W')
    })

    // ------------------------------------------------------------------------
    // SECTION 3: FUTURE EXPANSION & GEOCODING REGISTRY
    // ------------------------------------------------------------------------
    await t.test('Section 3.1: Geocoding parses direct coordinate inputs', async () => {
      const res = await geocodeLocationName('35.011, -115.4734')
      assert.ok(res, 'Direct coordinate geocode succeeds')
      assert.equal(res.lat, 35.011)
      assert.equal(res.lng, -115.4734)
      assert.equal(res.source, 'DIRECT_COORDINATES')
    })

    await t.test('Section 3.2: Geocoding parses DMS coordinate inputs', async () => {
      const res = await geocodeLocationName('35°01\'N, 115°28\'W')
      assert.ok(res, 'DMS coordinate geocode succeeds')
      assert.ok(Math.abs(res.lat - 35.0167) < 0.01, 'Lat is ~35.0167°')
      assert.ok(Math.abs(res.lng - (-115.4667)) < 0.01, 'Lng is ~-115.4667°')
    })

    await t.test('Section 3.3: Geocoding resolves known analogue regions offline', async () => {
      const res = await geocodeLocationName('Mojave Desert')
      assert.ok(res, 'Resolves Mojave Desert')
      assert.ok(res.lat > 34 && res.lat < 37, 'Mojave lat within California range')
      assert.ok(res.lng < -114 && res.lng > -118, 'Mojave lng within California range')
    })

    await t.test('Section 3.4: Adding a custom location registers with UNVERIFIED status', () => {
      resetCustomLocations()

      const newLoc = addCustomLocation({
        name: 'Mojave Desert Volcanic Field',
        country: 'United States',
        region: 'California',
        latitude: 35.011,
        longitude: -115.4734,
        primaryTarget: 'Mars',
        terrainType: 'Basaltic cinder cones and pahoehoe flows',
      })

      assert.ok(newLoc.id.startsWith('custom-mojave-desert'), 'Custom location receives unique custom ID')
      assert.equal(newLoc.verificationStatus, 'UNVERIFIED', 'Custom additions are explicitly UNVERIFIED')
      assert.ok(newLoc.verificationAuditNotice.includes('Pending formal scientific peer-review'), 'Includes audit notice')
      assert.equal(newLoc.isCustom, true, 'isCustom flag is set')

      const all = getAllLocations()
      assert.equal(all.length, 21, 'Total locations expands from 20 to 21')
      const found = all.find((l) => l.id === newLoc.id)
      assert.ok(found, 'New location is present in registry')

      // Clean up
      removeCustomLocation(newLoc.id)
      assert.equal(getAllLocations().length, 20, 'Registry restored to 20 baseline')
    })

    // ------------------------------------------------------------------------
    // SECTION 4: 3D GLOBE UI & COMPONENT RENDERING
    // ------------------------------------------------------------------------
    await t.test('Section 4.1: EarthGlobe3D component renders with HUD overlays and controls', () => {
      const locs = getAllLocations()
      const html = ReactDOMServer.renderToString(
        React.createElement(EarthGlobe3D, {
          locations: locs,
          activeLocationId: locs[0].id,
          onSelectLocation: () => {},
          onEvaluateSite: () => {},
          onOpenAddModal: () => {},
          filterBody: 'ALL',
        })
      )

      assert.ok(html.includes('3D PLANETARY GEODESY GLOBE'), 'HUD top bar renders 3D Globe title')
      assert.ok(html.includes('WGS 84 / WebGL'), 'Geodetic datum badge renders')
      assert.ok(html.includes('All Sites'), 'Filter pill "All Sites" renders')
      assert.ok(html.includes('Mars Analogues'), 'Filter pill "Mars Analogues" renders')
      assert.ok(html.includes('Moon Analogues'), 'Filter pill "Moon Analogues" renders')
      assert.ok(html.includes('Dual Sites'), 'Filter pill "Dual Sites" renders')
      assert.ok(html.includes('Facilities'), 'Filter pill "Facilities" renders')
      assert.ok(html.includes('+ Add Location'), 'Add Location button renders')
      assert.ok(html.includes('Reset'), 'Reset button renders')
      assert.ok(html.includes('Spin'), 'Auto-rotation button renders')
      assert.ok(html.includes('OPEN COMPLETE SITE EVALUATION'), 'HUD card contains "OPEN COMPLETE SITE EVALUATION" button')
    })

    await t.test('Section 4.2: AddLocationModal renders complete form and scientific disclaimer', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(AddLocationModal, {
          isOpen: true,
          onClose: () => {},
          onLocationAdded: () => {},
        })
      )

      assert.ok(html.includes('Add Analogue Research Location'), 'Modal title renders')
      assert.ok(html.includes('AUTOMATIC GEOCODING ASSISTANT'), 'Geocoding assistant section renders')
      assert.ok(html.includes('LATITUDE (WGS 84'), 'Latitude input renders')
      assert.ok(html.includes('LONGITUDE (WGS 84'), 'Longitude input renders')
      assert.ok(html.includes('SCIENTIFIC INTEGRITY RULE'), 'Scientific integrity disclaimer renders')
      assert.ok(html.includes('REGISTER &amp; PLOT ON 3D GLOBE'), 'Submit button renders')
    })

    await t.test('Section 4.3: LocationFinder renders 3D Globe by default with view switchers', () => {
      const html = ReactDOMServer.renderToString(React.createElement(LocationFinder, {}))

      // View mode switcher buttons
      assert.ok(html.includes('3D Globe'), 'View mode switcher has "3D Globe" button')
      assert.ok(html.includes('2D Map'), 'View mode switcher has "2D Map" button')
      assert.ok(html.includes('List View'), 'View mode switcher has "List View" button')

      // Top title and 3D Globe HUD
      assert.ok(html.includes('3D Planetary Globe'), 'Header displays 3D Planetary Globe mode')
      assert.ok(html.includes('3D PLANETARY GEODESY GLOBE'), 'Globe HUD telemetry renders')

      // 5 filter buttons remain available
      assert.ok(html.includes('All Sites'), 'Filter "All Sites" is present')
      assert.ok(html.includes('Mars Analogues'), 'Filter "Mars Analogues" is present')
      assert.ok(html.includes('Moon Analogues'), 'Filter "Moon Analogues" is present')
      assert.ok(html.includes('Dual-Purpose Sites'), 'Filter "Dual-Purpose Sites" is present')
      assert.ok(html.includes('Research Facilities'), 'Filter "Research Facilities" is present')

      // Evaluated candidate catalog below
      assert.ok(html.includes('Audited Earth Locations'), 'Candidate catalog below globe is present')
    })

  } finally {
    await vite.close()
  }
})
