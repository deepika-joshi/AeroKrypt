import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
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

test('AEROKRYPT EARTH CANDIDATE ANALOGUE SITE MEDIA SUITE', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const { ANALOGUE_LOCATIONS } = await vite.ssrLoadModule('./src/data/locationsData.js')
    const {
      SITE_MEDIA_MANIFEST,
      getSiteMedia,
      hasSiteMedia,
      getSiteMediaCategories,
    } = await vite.ssrLoadModule('./src/data/siteMediaManifest.js')
    const { default: EarthSiteMediaViewer } = await vite.ssrLoadModule('./src/components/site-evaluation/EarthSiteMediaViewer.jsx')

    // ------------------------------------------------------------------------
    // 1. MANIFEST COMPLETENESS & DATASET SCHEMA
    // ------------------------------------------------------------------------
    await t.test('1. Every curated analogue site is indexed with authentic metadata or honest unavailable state', () => {
      assert.equal(ANALOGUE_LOCATIONS.length, 20, 'Curated baseline must contain 20 locations')
      assert.equal(Object.keys(SITE_MEDIA_MANIFEST).length, 20, 'Manifest must contain exactly 20 keys')

      const validCategories = ['overview', 'terrain', 'surface', 'field-research']
      const validTypes = ['SATELLITE_ORBITAL', 'GROUND_PHOTOGRAPH', 'SURFACE_MACRO', 'FIELD_RESEARCH']

      let populatedSitesCount = 0
      let unpopulatedSitesCount = 0
      let totalImageCount = 0

      ANALOGUE_LOCATIONS.forEach((loc) => {
        assert.ok(loc.id in SITE_MEDIA_MANIFEST, `Location ${loc.id} must be defined in SITE_MEDIA_MANIFEST`)
        const items = SITE_MEDIA_MANIFEST[loc.id]
        assert.ok(Array.isArray(items), `Media entry for ${loc.id} must be an array`)

        if (items.length > 0) {
          populatedSitesCount++
          items.forEach((item) => {
            totalImageCount++
            assert.ok(typeof item.id === 'string' && item.id.length > 0, `${loc.id} item must have non-empty id`)
            assert.ok(validCategories.includes(item.category), `${loc.id} item ${item.id} has valid category (${item.category})`)
            assert.ok(validTypes.includes(item.imageType), `${loc.id} item ${item.id} has valid imageType (${item.imageType})`)
            assert.ok(typeof item.title === 'string' && item.title.length > 0, `${loc.id} item must have title`)
            assert.ok(typeof item.caption === 'string' && item.caption.length > 0, `${loc.id} item must have caption`)
            assert.ok(typeof item.scientificContext === 'string' && item.scientificContext.length > 0, `${loc.id} item must have scientificContext`)
            assert.ok(typeof item.localPath === 'string' && item.localPath.startsWith('/assets/site-media/'), `${loc.id} localPath must start with /assets/site-media/`)
            assert.ok(typeof item.sourceUrl === 'string' && item.sourceUrl.startsWith('https://'), `${loc.id} sourceUrl must be a secure external URL`)
            assert.ok(typeof item.creator === 'string' && item.creator.length > 0, `${loc.id} item must state creator`)
            assert.ok(typeof item.license === 'string' && item.license.length > 0, `${loc.id} item must state license`)
            assert.ok(item.dimensions && item.dimensions.width > 0 && item.dimensions.height > 0, `${loc.id} item must include dimensions`)
          })
        } else {
          unpopulatedSitesCount++
        }
      })

      assert.equal(populatedSitesCount, 18, 'Exactly 18 curated sites must have verified imagery cataloged')
      assert.equal(unpopulatedSitesCount, 2, 'Exactly 2 sites must have empty arrays (honest uncataloged state)')
      assert.equal(totalImageCount, 29, 'Total verified image collection must contain 29 assets')
      assert.deepEqual(
        Object.entries(SITE_MEDIA_MANIFEST).filter(([, items]) => items.length === 0).map(([k]) => k).sort(),
        ['datong-volcanic-group', 'namakkal-anorthosite'].sort(),
        'Uncataloged sites must be Namakkal Anorthosite and Datong Volcanic Group'
      )
    })

    // ------------------------------------------------------------------------
    // 2. LOCAL ASSETS INTEGRITY ON DISK
    // ------------------------------------------------------------------------
    await t.test('2. All cataloged media files physically exist on disk in public directory', () => {
      let filesVerified = 0
      for (const items of Object.values(SITE_MEDIA_MANIFEST)) {
        for (const item of items) {
          const filePath = path.resolve('public', '.' + item.localPath)
          assert.ok(fs.existsSync(filePath), `Physical image file must exist: ${filePath}`)
          const stat = fs.statSync(filePath)
          assert.ok(stat.size > 1000, `Image file ${item.localPath} must be non-empty (size: ${stat.size} bytes)`)
          filesVerified++
        }
      }
      assert.equal(filesVerified, 29, 'All 29 cataloged media files verified on disk')
    })

    // ------------------------------------------------------------------------
    // 3. MANIFEST HELPER FUNCTIONS
    // ------------------------------------------------------------------------
    await t.test('3. Helper functions getSiteMedia, hasSiteMedia, and getSiteMediaCategories behave predictably', () => {
      // Populated site
      const atacamaMedia = getSiteMedia('atacama-yungay')
      assert.ok(Array.isArray(atacamaMedia) && atacamaMedia.length > 0)
      assert.equal(hasSiteMedia('atacama-yungay'), true)
      const atacamaCats = getSiteMediaCategories('atacama-yungay')
      assert.ok(atacamaCats.includes('surface'))

      // Unpopulated site
      const namakkalMedia = getSiteMedia('namakkal-anorthosite')
      assert.ok(Array.isArray(namakkalMedia) && namakkalMedia.length === 0)
      assert.equal(hasSiteMedia('namakkal-anorthosite'), false)
      assert.deepEqual(getSiteMediaCategories('namakkal-anorthosite'), [])

      // Unknown or null site ID
      assert.deepEqual(getSiteMedia(null), [])
      assert.equal(hasSiteMedia(null), false)
      assert.deepEqual(getSiteMedia('non-existent-site'), [])
      assert.equal(hasSiteMedia('non-existent-site'), false)
    })

    // ------------------------------------------------------------------------
    // 4. SSR RENDERING FOR POPULATED SITE
    // ------------------------------------------------------------------------
    await t.test('4. EarthSiteMediaViewer renders rich gallery with metadata and controls for populated sites', () => {
      const site = ANALOGUE_LOCATIONS.find((l) => l.id === 'atacama-yungay')
      const html = ReactDOMServer.renderToString(
        React.createElement(EarthSiteMediaViewer, {
          locationId: 'atacama-yungay',
          location: site,
          height: '240px',
        })
      )

      // Primary image tag
      assert.ok(html.includes('/assets/site-media/atacama-yungay/surface-patterned-ground.jpg'), 'Renders active image local src')
      assert.ok(html.includes('alt="Hyper-Arid Soil Polygons"'), 'Includes descriptive image alt')

      // Telemetry and badges
      assert.ok(html.includes('SURFACE DETAILS'), 'Includes category badge')

      // View switcher toggle to Map
      assert.ok(html.includes('MAP'), 'Includes map switch toggle button')

      // Attribution drawer preview
      assert.ok(html.includes('Christof 123456'), 'Includes author credit')
      assert.ok(html.includes('CC BY-SA 4.0'), 'Includes license')
      assert.ok(html.includes('Source ↗'), 'Includes external scientific source link')
    })

    // ------------------------------------------------------------------------
    // 5. SSR RENDERING FOR UNPOPULATED SITE (HONEST UNAVAILABLE STATE)
    // ------------------------------------------------------------------------
    await t.test('5. EarthSiteMediaViewer displays scientific unavailable state without fabricating images', () => {
      const site = ANALOGUE_LOCATIONS.find((l) => l.id === 'namakkal-anorthosite')
      const html = ReactDOMServer.renderToString(
        React.createElement(EarthSiteMediaViewer, {
          locationId: 'namakkal-anorthosite',
          location: site,
          height: '240px',
        })
      )

      assert.ok(html.includes('IMAGERY UNAVAILABLE'), 'Explicitly informs user that imagery is uncataloged')
      assert.ok(html.includes('VIEW GEODETIC MAP'), 'Provides action button to view 2D geodetic map')
      assert.ok(html.includes('scientific integrity guidelines'), 'Explains adherence to scientific integrity')
      assert.ok(!html.includes('<img'), 'Must not render broken or fabricated <img> tags')
    })

  } finally {
    await vite.close()
  }
})
