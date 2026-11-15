import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer } from 'vite'

// Polyfill window & document for Node.js test environment
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:5173/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
    matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
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

test('AEROKRYPT 3D CINEMATIC GLOBE & SPHERICAL GEODESY SUITE', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const { ANALOGUE_LOCATIONS } = await vite.ssrLoadModule('./src/data/locationsData.js')
    const {
      getLocationCoordinates,
      getSphericalDistanceDeg,
      getAnalogueClassificationLabel,
    } = await vite.ssrLoadModule('./src/services/locationRegistryService.js')
    const { default: EarthGlobe3D } = await vite.ssrLoadModule('./src/components/location-finder/EarthGlobe3D.jsx')

    // ------------------------------------------------------------------------
    // 1. DATASET INTEGRITY & COORDINATE EXTRACTION
    // ------------------------------------------------------------------------
    await t.test('1. Every curated location record has valid numeric WGS 84 coordinates', () => {
      assert.equal(ANALOGUE_LOCATIONS.length, 20, 'Curated baseline must contain exactly 20 locations')

      ANALOGUE_LOCATIONS.forEach((loc) => {
        const coords = getLocationCoordinates(loc)
        assert.equal(typeof coords.lat, 'number', `Location ${loc.id} latitude must be a number`)
        assert.equal(typeof coords.lng, 'number', `Location ${loc.id} longitude must be a number`)
        assert.ok(!isNaN(coords.lat), `Location ${loc.id} latitude must not be NaN`)
        assert.ok(!isNaN(coords.lng), `Location ${loc.id} longitude must not be NaN`)
        assert.ok(coords.lat >= -90 && coords.lat <= 90, `Location ${loc.id} latitude must be between -90 and +90`)
        assert.ok(coords.lng >= -180 && coords.lng <= 180, `Location ${loc.id} longitude must be between -180 and +180`)
      })
    })

    // ------------------------------------------------------------------------
    // 2. SPHERICAL ANGULAR DISTANCE & FRONT-FACING REVEAL LOGIC
    // ------------------------------------------------------------------------
    await t.test('2. Spherical distance calculations for front-facing site labels', () => {
      // Identical coordinates -> 0° separation
      const d0 = getSphericalDistanceDeg(0, 0, 0, 0)
      assert.ok(Math.abs(d0) < 0.001, 'Identical point distance is 0°')

      // Antipodal coordinates -> 180° separation
      const d180 = getSphericalDistanceDeg(0, 0, 0, 180)
      assert.ok(Math.abs(d180 - 180) < 0.001, 'Antipodal point distance is 180°')

      // North Pole to South Pole -> 180° separation
      const dPoles = getSphericalDistanceDeg(90, 0, -90, 0)
      assert.ok(Math.abs(dPoles - 180) < 0.001, 'North to South pole distance is 180°')

      // Prime Meridian to 45° East along Equator -> 45° (< 70° front-facing)
      const d45 = getSphericalDistanceDeg(0, 0, 0, 45)
      assert.ok(Math.abs(d45 - 45) < 0.001, 'Equator 45° distance is 45°')
      assert.ok(d45 < 70, '45° is eligible for front-facing label reveal (< 70°)')

      // Prime Meridian to 85° East along Equator -> 85° (> 70° outside front field)
      const d85 = getSphericalDistanceDeg(0, 0, 0, 85)
      assert.ok(Math.abs(d85 - 85) < 0.001, 'Equator 85° distance is 85°')
      assert.ok(d85 > 70, '85° is outside the 70° front-facing label threshold')
    })

    // ------------------------------------------------------------------------
    // 3. ANALOGUE CLASSIFICATION LABEL MAPPING
    // ------------------------------------------------------------------------
    await t.test('3. Analogue classification maps correctly to human-readable badges', () => {
      const marsSite = { targetBodies: ['Mars'], primaryTarget: 'Mars', analogueRelevance: 'MARS' }
      assert.equal(getAnalogueClassificationLabel(marsSite), 'Mars Analogue Site')

      const moonSite = { targetBodies: ['Moon'], primaryTarget: 'Moon', analogueRelevance: 'MOON' }
      assert.equal(getAnalogueClassificationLabel(moonSite), 'Lunar Analogue Site')

      const dualSite = { targetBodies: ['Mars', 'Moon'], analogueRelevance: 'BOTH' }
      assert.equal(getAnalogueClassificationLabel(dualSite), 'Dual-purpose Analogue (Mars & Moon)')

      const facilitySite = { locationCategory: 'RESEARCH_FACILITY', targetBodies: [] }
      assert.equal(getAnalogueClassificationLabel(facilitySite), 'Research Facility')
    })

    // ------------------------------------------------------------------------
    // 4. SERVER-SIDE RENDERING & COMPONENT INTERFACE
    // ------------------------------------------------------------------------
    await t.test('4. EarthGlobe3D renders SSR without throwing window errors and displays complete HUD', () => {
      const locs = ANALOGUE_LOCATIONS
      const html = ReactDOMServer.renderToString(
        React.createElement(EarthGlobe3D, {
          locations: locs,
          activeLocationId: locs[0].id,
          onSelectLocation: () => {},
          onEvaluateSite: () => {},
          onOpenAddModal: () => {},
          filterBody: 'ALL',
          onSwitchTo2D: () => {},
        })
      )

      // HUD Telemetry Header
      assert.ok(html.includes('// 3D PLANETARY GEODESY GLOBE'), 'Includes globe header telemetry')
      assert.ok(html.includes('WGS 84 / WebGL'), 'Includes datum badge')
      assert.ok(html.includes('Sites Active'), 'Shows active sites telemetry')

      // Target Filter Tabs
      assert.ok(html.includes('All Sites'), 'Includes All Sites button')
      assert.ok(html.includes('Mars Analogues'), 'Includes Mars Analogues button')
      assert.ok(html.includes('Moon Analogues'), 'Includes Moon Analogues button')
      assert.ok(html.includes('Dual Sites'), 'Includes Dual Sites button')
      assert.ok(html.includes('Facilities'), 'Includes Facilities button')
      assert.ok(html.includes('+ Add Location'), 'Includes Add Location action')

      // Bottom Right HUD Controls
      assert.ok(html.includes('Spin'), 'Includes rotation toggle control')
      assert.ok(html.includes('Reset'), 'Includes Reset view control')
      assert.ok(html.includes('2D Map'), 'Includes 2D Map toggle button')

      // Selected Location Dossier Card
      assert.ok(html.includes(locs[0].name), 'Displays active location name')
      assert.ok(html.includes('OPEN COMPLETE SITE EVALUATION'), 'Includes evaluation button')
      assert.ok(html.includes('INSPECT FULL PROFILE DOSSIER'), 'Includes dossier button')
    })

  } finally {
    await vite.close()
  }
})
