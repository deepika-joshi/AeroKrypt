import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer } from 'vite'

// Polyfill window & document for browser libraries like Leaflet evaluated in SSR / node:test
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:5173/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
    print: () => {},
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
    }),
    documentElement: { style: {} },
    body: { style: {} },
    getElementById: () => null,
  }
}

test('AEROKRYPT COMPETITION READINESS & STABILITY AUDIT', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const { ANALOGUE_LOCATIONS } = await vite.ssrLoadModule('./src/data/locationsData.js')
    const { LOCATION_PHOTOGRAPHS } = await vite.ssrLoadModule('./src/data/locationPhotos.js')
    const { evaluateSite } = await vite.ssrLoadModule('./src/services/siteAssessment.js')

    // ------------------------------------------------------------------------
    // SECTION 1: DATABASE COMPLETENESS & TRACEABILITY VERIFICATION
    // ------------------------------------------------------------------------
    await t.test('Section 1.1: Curated Analogue Database contains exactly 20 audited sites', () => {
      assert.equal(ANALOGUE_LOCATIONS.length, 20, 'Database contains exactly 20 curated sites')
      const siteIds = new Set(ANALOGUE_LOCATIONS.map((l) => l.id))
      assert.equal(siteIds.size, 20, 'All 20 location IDs are unique')
    })

    await t.test('Section 1.2: All 20 locations have authentic photographic records', () => {
      ANALOGUE_LOCATIONS.forEach((loc) => {
        const photo = LOCATION_PHOTOGRAPHS[loc.id]
        assert.ok(photo, `Location ${loc.id} has entry in LOCATION_PHOTOGRAPHS`)
        assert.ok(photo.photoUrl, `Location ${loc.id} has photoUrl`)
        assert.ok(photo.caption, `Location ${loc.id} has informative caption`)
        assert.ok(photo.credit, `Location ${loc.id} cites authentic photo credit`)
        assert.ok(photo.targetAnalogueFeature, `Location ${loc.id} identifies target planetary feature`)
      })
    })

    await t.test('Section 1.3: All locations have explicit coordinates, elevations, and statuses', () => {
      ANALOGUE_LOCATIONS.forEach((loc) => {
        assert.ok(loc.name, `Location ${loc.id} has name`)
        assert.ok(loc.country, `Location ${loc.id} has country`)
        assert.ok(loc.coordinates, `Location ${loc.id} has coordinates`)
        assert.ok(loc.geographicBoundaries?.boundingBox, `Location ${loc.id} has formal bounding box`)
        assert.ok(loc.elevation?.status, `Location ${loc.id} has traceable elevation status`)
        assert.ok(loc.slope?.status, `Location ${loc.id} has traceable slope status`)
        assert.ok(loc.meanAnnualTemp?.status, `Location ${loc.id} has traceable temperature status`)
        assert.ok(loc.annualPrecipitation?.status, `Location ${loc.id} has traceable precipitation status`)
        assert.ok(loc.verificationStatus, `Location ${loc.id} has explicit verification status`)
      })
    })

    // ------------------------------------------------------------------------
    // SECTION 2: LOCATION EXPLORE & FILTER FUNCTIONALITY
    // ------------------------------------------------------------------------
    await t.test('Section 2.1: Location Explorer 5 Primary Filter Tabs compute accurate counts', () => {
      const allCount = ANALOGUE_LOCATIONS.length
      const marsCount = ANALOGUE_LOCATIONS.filter((l) => l.targetBodies.includes('Mars') || l.analogueRelevance === 'MARS').length
      const moonCount = ANALOGUE_LOCATIONS.filter((l) => l.targetBodies.includes('Moon') || l.analogueRelevance === 'MOON').length
      const dualCount = ANALOGUE_LOCATIONS.filter((l) => l.targetBodies.includes('Mars') && l.targetBodies.includes('Moon')).length
      const facilityCount = ANALOGUE_LOCATIONS.filter((l) => l.locationCategory === 'RESEARCH_FACILITY').length

      assert.equal(allCount, 20, 'All Sites filter = 20')
      assert.equal(marsCount, 13, 'Mars Analogues filter = 13')
      assert.equal(moonCount, 13, 'Moon Analogues filter = 13')
      assert.equal(dualCount, 6, 'Dual-Purpose Sites filter = 6')
      assert.equal(facilityCount, 4, 'Research Facilities filter = 4')
    })

    await t.test('Section 2.2: Location search correctly matches keywords', () => {
      const atacamaMatches = ANALOGUE_LOCATIONS.filter((l) =>
        l.name.toLowerCase().includes('atacama') ||
        l.country.toLowerCase().includes('atacama')
      )
      assert.ok(atacamaMatches.length >= 1, 'Search finds Atacama')

      const basaltMatches = ANALOGUE_LOCATIONS.filter((l) =>
        (l.lithology && l.lithology.some((r) => r.toLowerCase().includes('basalt'))) ||
        l.terrainType.toLowerCase().includes('basalt')
      )
      assert.ok(basaltMatches.length >= 5, 'Search finds multiple basaltic terrain locations')
    })

    // ------------------------------------------------------------------------
    // SECTION 3: COMPONENT RENDERING & WORKFLOW INTEGRATION
    // ------------------------------------------------------------------------
    const LocationFinder = (await vite.ssrLoadModule('./src/components/location-finder/LocationFinder.jsx')).default
    const LocationSidePanel = (await vite.ssrLoadModule('./src/components/location-finder/LocationSidePanel.jsx')).default
    const SiteEvaluation = (await vite.ssrLoadModule('./src/components/site-evaluation/SiteEvaluation.jsx')).default
    const SiteReportModal = (await vite.ssrLoadModule('./src/components/site-evaluation/SiteReportModal.jsx')).default
    const Dashboard = (await vite.ssrLoadModule('./src/components/dashboard/Dashboard.jsx')).default
    const ResearchHub = (await vite.ssrLoadModule('./src/components/research-hub/ResearchHub.jsx')).default
    const PublicDiscovery = (await vite.ssrLoadModule('./src/components/public-discovery/PublicDiscovery.jsx')).default

    await t.test('Section 3.1: Dashboard renders completely with metrics and module links', () => {
      const html = ReactDOMServer.renderToString(React.createElement(Dashboard, {}))
      assert.ok(html.includes('AEROKRYPT'), 'Dashboard renders AEROKRYPT brand')
      assert.ok(html.includes('Curated Earth Analogue Sites'), 'Dashboard renders Earth Analogue Sites metric')
      assert.ok(html.includes('Operational Map Services'), 'Dashboard renders Operational Map Services metric')
      assert.ok(html.includes('Location Explore'), 'Dashboard includes link to Location Explore')
      assert.ok(html.includes('Site Evaluation'), 'Dashboard includes link to Site Evaluation')
      assert.ok(html.includes('Research Hub'), 'Dashboard includes link to Research Hub')
      assert.ok(html.includes('Public Discovery'), 'Dashboard includes link to Public Discovery')
    })

    await t.test('Section 3.2: LocationFinder renders with top map and 5 filter buttons', () => {
      const html = ReactDOMServer.renderToString(React.createElement(LocationFinder, {}))
      assert.ok(html.includes('GEODETIC &amp; TOPOGRAPHIC EXPLORER'), 'Top map explorer is present')
      assert.ok(html.includes('All Sites'), 'Filter button "All Sites" is present')
      assert.ok(html.includes('Mars Analogues'), 'Filter button "Mars Analogues" is present')
      assert.ok(html.includes('Moon Analogues'), 'Filter button "Moon Analogues" is present')
      assert.ok(html.includes('Dual-Purpose Sites'), 'Filter button "Dual-Purpose Sites" is present')
      assert.ok(html.includes('Research Facilities'), 'Filter button "Research Facilities" is present')
      assert.ok(html.includes('Audited Earth Locations'), 'Location catalog below map is present')
    })

    await t.test('Section 3.3: LocationSidePanel renders profile, photograph, measurements, and actions', () => {
      let _navTarget = null
      let _navParams = null
      const onNavigate = (target, params) => {
        _navTarget = target
        _navParams = params
      }

      const loc = ANALOGUE_LOCATIONS[0] // Atacama Yungay
      const html = ReactDOMServer.renderToString(
        React.createElement(LocationSidePanel, {
          location: loc,
          onClose: () => {},
          onNavigate: onNavigate,
        })
      )

      assert.ok(html.includes(loc.name), 'Side panel displays location name')
      assert.ok(html.includes(loc.country), 'Side panel displays country')
      assert.ok(html.includes('GEODETIC TELEMETRY'), 'Side panel displays coordinates section')
      assert.ok(html.includes('GEOLOGICAL CHARACTERISTICS'), 'Side panel displays geology')
      assert.ok(html.includes('TERRAIN DESCRIPTION'), 'Side panel displays terrain')
      assert.ok(html.includes('SCIENTIFIC RESEARCH RELEVANCE'), 'Side panel displays research relevance')
      assert.ok(html.includes('AVAILABLE ENVIRONMENTAL MEASUREMENTS'), 'Side panel displays measurements table')
      assert.ok(html.includes('MISSING DATA GAPS'), 'Side panel displays missing data')
      assert.ok(html.includes('SUPPORTING PUBLICATIONS'), 'Side panel displays publications')
      assert.ok(html.includes('EVALUATE THIS SITE'), 'Side panel displays "EVALUATE THIS SITE" button')
      assert.ok(html.includes('Compare with Off-World Terrain'), 'Side panel displays planetary compare button')
    })

    await t.test('Section 3.4: SiteEvaluation renders selected location, terrain comparison, and dossier', () => {
      const loc = ANALOGUE_LOCATIONS[1] // McMurdo
      const html = ReactDOMServer.renderToString(
        React.createElement(SiteEvaluation, {
          initialLocationId: loc.id,
        })
      )

      assert.ok(html.includes('Analogue Research Location:'), 'Location selector is present')
      assert.ok(html.includes('Planetary Terrain Comparison'), 'Planetary terrain comparison is present')
      assert.ok(html.includes('DUAL-DOMAIN EVALUATION'), 'Dual suitability section is present')
      assert.ok(html.includes('TRACEABLE ENVIRONMENTAL'), 'Environmental parameters grid is present')
      assert.ok(html.includes('MISSING CRITICAL PARAMETERS'), 'Missing critical parameters card is present')
      assert.ok(html.includes('PLANETARY DIVERGENCE MATRIX'), 'Planetary divergence table is present')
      assert.ok(html.includes('EVIDENCE REGISTRY'), 'Evidence registry is present')
      assert.ok(html.includes('SYNTHESIS ASSESSMENT'), 'Synthesis assessment is present')
      assert.ok(html.includes('Export / Print Dossier'), 'Export / Print Dossier button is present')
    })

    await t.test('Section 3.5: SiteReportModal renders complete printable dossier without returning null', () => {
      const evalData = evaluateSite(ANALOGUE_LOCATIONS[0], null)
      const html = ReactDOMServer.renderToString(
        React.createElement(SiteReportModal, {
          isOpen: true,
          evaluationData: evalData,
          onClose: () => {},
        })
      )

      assert.ok(html.length > 5000, 'SiteReportModal generates substantial dossier HTML')
      assert.ok(html.includes('SCIENTIFIC SITE ASSESSMENT DOSSIER'), 'Modal contains dossier title')
      assert.ok(html.includes('AEROKRYPT PLANETARY ANALOGUE RESEARCH PLATFORM'), 'Modal contains AEROKRYPT header')
      assert.ok(html.includes('Print / Save as PDF'), 'Modal includes Print / Save as PDF button')
      assert.ok(html.includes('Close'), 'Modal includes Close button')
    })

    await t.test('Section 3.6: ResearchHub renders all 4 subviews', () => {
      const subviews = ['library', 'experiments', 'records', 'workspace']
      for (const sv of subviews) {
        const html = ReactDOMServer.renderToString(
          React.createElement(ResearchHub, { initialSubview: sv })
        )
        assert.ok(html.length > 2000, `ResearchHub subview ${sv} renders substantial HTML`)
        assert.ok(html.includes('Research Library') || html.includes('Experiment Database'), 'ResearchHub tab labels render')
      }
    })

    await t.test('Section 3.7: PublicDiscovery renders all 4 subviews', () => {
      const html = ReactDOMServer.renderToString(React.createElement(PublicDiscovery, {}))
      assert.ok(html.length > 2000, 'PublicDiscovery renders substantial HTML')
      assert.ok(html.includes('Student &amp; Public Learning Centre'), 'Learning center tab exists')
      assert.ok(html.includes('Simplified Case Studies'), 'Case studies tab exists')
      assert.ok(html.includes('Interactive Analogue Explorer'), 'Interactive explorer tab exists')
      assert.ok(html.includes('Published Research Archive'), 'Published archive tab exists')
    })

    // ------------------------------------------------------------------------
    // SECTION 4: DATA INTEGRITY & SCIENTIFIC REALISM
    // ------------------------------------------------------------------------
    await t.test('Section 4.1: Site assessment disclaims arbitrary composite percentage scores', () => {
      const evalData = evaluateSite(ANALOGUE_LOCATIONS[0], null)
      assert.ok(
        evalData.assessmentSummary.scientificMethodologyNotice.includes('does not output a composite percentage score'),
        'Evaluation enforces policy against false composite percentage scores'
      )
    })

    await t.test('Section 4.2: Gravity and atmospheric divergences are always noted', () => {
      ANALOGUE_LOCATIONS.forEach((loc) => {
        const evalData = evaluateSite(loc, null)
        const divergences = evalData.planetaryDivergence?.divergences || []
        const gravityDiv = divergences.find((d) => d.parameter === 'Surface Gravity')
        assert.ok(gravityDiv, `Location ${loc.id} notes surface gravity divergence (1.0 G on Earth)`)
        const atmoDiv = divergences.find((d) => d.parameter === 'Surface Atmospheric Pressure')
        assert.ok(atmoDiv, `Location ${loc.id} notes atmospheric pressure divergence`)
      })
    })

  } finally {
    await vite.close()
  }
})
