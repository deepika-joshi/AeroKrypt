import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer } from 'vite'

// Polyfill window & document for browser libraries like Leaflet evaluated in SSR
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
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
  }
}

test('SECTION 1: Location Explore & Site Evaluation Component Render Verification', async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    // 1. Verify LocationFinder
    const LocationFinder = (await vite.ssrLoadModule('./src/components/location-finder/LocationFinder.jsx')).default
    assert.ok(LocationFinder, 'LocationFinder component exports properly')
    const locHtml = ReactDOMServer.renderToString(React.createElement(LocationFinder, {}))
    assert.ok(locHtml.length > 5000, 'LocationFinder renders substantial HTML (>5000 chars)')
    assert.ok(locHtml.includes('GEODETIC &amp; TOPOGRAPHIC EXPLORER'), 'LocationFinder contains geodetic map explorer header')
    assert.ok(locHtml.includes('Earth Terrestrial Analogue Geodesy'), 'LocationFinder contains initial Earth geodesy map title')
    assert.ok(locHtml.includes('Audited Earth Locations'), 'LocationFinder contains evaluated candidate catalog heading')

    // Verify the 5 Mandatory Filter Tabs
    assert.ok(locHtml.includes('All Sites'), 'LocationFinder contains "All Sites" filter')
    assert.ok(locHtml.includes('Mars Analogues'), 'LocationFinder contains "Mars Analogues" filter')
    assert.ok(locHtml.includes('Moon Analogues'), 'LocationFinder contains "Moon Analogues" filter')
    assert.ok(locHtml.includes('Dual-Purpose Sites'), 'LocationFinder contains "Dual-Purpose Sites" filter')
    assert.ok(locHtml.includes('Research Facilities'), 'LocationFinder contains "Research Facilities" filter')

    // 1b. Verify LocationSidePanel
    const LocationSidePanel = (await vite.ssrLoadModule('./src/components/location-finder/LocationSidePanel.jsx')).default
    const { ANALOGUE_LOCATIONS } = await vite.ssrLoadModule('./src/data/locationsData.js')
    const sidePanelHtml = ReactDOMServer.renderToString(
      React.createElement(LocationSidePanel, {
        location: ANALOGUE_LOCATIONS[0], // Atacama Yungay
        onClose: () => {},
        onNavigate: () => {},
      })
    )
    assert.ok(sidePanelHtml.length > 3000, 'LocationSidePanel renders comprehensive profile')
    assert.ok(sidePanelHtml.includes('Atacama Desert'), 'LocationSidePanel contains location name')
    assert.ok(sidePanelHtml.includes('GEODETIC TELEMETRY'), 'LocationSidePanel contains coordinates and telemetry')
    assert.ok(sidePanelHtml.includes('GEOLOGICAL CHARACTERISTICS'), 'LocationSidePanel contains geological characteristics')
    assert.ok(sidePanelHtml.includes('TERRAIN DESCRIPTION'), 'LocationSidePanel contains terrain description')
    assert.ok(sidePanelHtml.includes('SCIENTIFIC RESEARCH RELEVANCE'), 'LocationSidePanel contains scientific research relevance')
    assert.ok(sidePanelHtml.includes('AVAILABLE ENVIRONMENTAL MEASUREMENTS'), 'LocationSidePanel contains environmental measurements table')
    assert.ok(sidePanelHtml.includes('MISSING DATA GAPS'), 'LocationSidePanel contains missing data & uncertainty')
    assert.ok(sidePanelHtml.includes('SUPPORTING PUBLICATIONS'), 'LocationSidePanel contains supporting publications and citations')
    assert.ok(sidePanelHtml.includes('EVALUATE THIS SITE'), 'LocationSidePanel contains "Evaluate This Site" action')
    assert.ok(sidePanelHtml.includes('Compare with Off-World Terrain'), 'LocationSidePanel contains Mars/Moon comparison option')

    // 2. Verify SiteEvaluation
    const SiteEvaluation = (await vite.ssrLoadModule('./src/components/site-evaluation/SiteEvaluation.jsx')).default
    assert.ok(SiteEvaluation, 'SiteEvaluation component exports properly')
    const siteHtml = ReactDOMServer.renderToString(React.createElement(SiteEvaluation, {}))
    assert.ok(siteHtml.length > 5000, 'SiteEvaluation renders substantial HTML (>5000 chars)')
    assert.ok(siteHtml.includes('Analogue Research Location:'), 'SiteEvaluation contains location selector')
    assert.ok(siteHtml.includes('Planetary Terrain Comparison'), 'SiteEvaluation contains planetary terrain comparison section')
    assert.ok(siteHtml.includes('DUAL-DOMAIN EVALUATION'), 'SiteEvaluation contains dual suitability panel')

    // 3. Verify Dashboard
    const Dashboard = (await vite.ssrLoadModule('./src/components/dashboard/Dashboard.jsx')).default
    assert.ok(Dashboard, 'Dashboard component exports properly')
    const dashHtml = ReactDOMServer.renderToString(React.createElement(Dashboard, {}))
    assert.ok(dashHtml.length > 5000, 'Dashboard renders substantial HTML')

    // 4. Verify ResearchHub
    const ResearchHub = (await vite.ssrLoadModule('./src/components/research-hub/ResearchHub.jsx')).default
    assert.ok(ResearchHub, 'ResearchHub component exports properly')
    const hubHtml = ReactDOMServer.renderToString(React.createElement(ResearchHub, {}))
    assert.ok(hubHtml.length > 2000, 'ResearchHub renders substantial HTML')

    // 5. Verify PublicDiscovery
    const PublicDiscovery = (await vite.ssrLoadModule('./src/components/public-discovery/PublicDiscovery.jsx')).default
    assert.ok(PublicDiscovery, 'PublicDiscovery component exports properly')
    const pubHtml = ReactDOMServer.renderToString(React.createElement(PublicDiscovery, {}))
    assert.ok(pubHtml.length > 2000, 'PublicDiscovery renders substantial HTML')

    // 6. Verify App Shell
    const App = (await vite.ssrLoadModule('./src/App.jsx')).default
    assert.ok(App, 'App component exports properly')
    const appHtml = ReactDOMServer.renderToString(React.createElement(App, {}))
    assert.ok(appHtml.length > 10000, 'App shell renders full default view without error')
  } finally {
    await vite.close()
  }
})
