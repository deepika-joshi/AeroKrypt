import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

// Polyfill window & document for Node.js test environment
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:5173/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
    scrollTo: () => {},
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

test('AEROKRYPT FOUR MAIN NAVIGATION PAGES INTRODUCTORY SECTION SUITE', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const { PAGE_INTRO_CONFIGS } = await vite.ssrLoadModule('./src/data/pageIntrosData.js')
    const { default: LocationFinder } = await vite.ssrLoadModule('./src/components/location-finder/LocationFinder.jsx')
    const { default: SiteEvaluation } = await vite.ssrLoadModule('./src/components/site-evaluation/SiteEvaluation.jsx')
    const { default: ResearchHub } = await vite.ssrLoadModule('./src/components/research-hub/ResearchHub.jsx')
    const { default: PublicDiscovery } = await vite.ssrLoadModule('./src/components/public-discovery/PublicDiscovery.jsx')
    const { default: App } = await vite.ssrLoadModule('./src/App.jsx')

    const EXPECTED_INTROS = {
      'location-explorer': {
        title: 'Discover Earth Analogue Locations',
        description:
          'Explore terrestrial environments that may serve as analogues for Mars and Moon research. Browse curated locations, examine their geological characteristics, and discover why they may be relevant to planetary studies.',
      },
      'site-evaluation': {
        title: 'Evaluate and Compare Analogue Sites',
        description:
          "Examine how selected Earth locations compare with Mars and Moon environments. Explore terrain, geological characteristics, available scientific evidence, and data gaps to understand each site's potential as a planetary analogue.",
      },
      'research-hub': {
        title: 'Your Research Workspace',
        description:
          'Manage your research in one place. Enter observations and measurements, create site evaluations, save results, compare findings, and submit research for review and publication.',
      },
      'public-discovery': {
        title: 'Explore Planetary Science',
        description:
          'Learn about planetary exploration through NASA research instruments and technologies, educational resources, simplified case studies, and the archive of published research.',
      },
    }

    // ------------------------------------------------------------------------
    // 1. EXACT CONFIGURATION AUDIT
    // ------------------------------------------------------------------------
    await t.test('1. Intro configurations contain exact titles and descriptions', () => {
      for (const [key, expected] of Object.entries(EXPECTED_INTROS)) {
        const config = PAGE_INTRO_CONFIGS[key]
        assert.ok(config, `Page intro configuration exists for ${key}`)
        assert.equal(config.title, expected.title, `Title matches exactly for ${key}`)
        assert.equal(config.description, expected.description, `Description matches exactly for ${key}`)
      }
    })

    // ------------------------------------------------------------------------
    // 2. COMPONENT STANDALONE SSR RENDERING AUDIT
    // ------------------------------------------------------------------------
    await t.test('2. LocationFinder renders introductory header before map/globe content', () => {
      const html = ReactDOMServer.renderToString(React.createElement(LocationFinder, {}))
      assert.ok(html.includes(EXPECTED_INTROS['location-explorer'].title), 'Includes exact Location Explore title')
      assert.ok(html.includes(EXPECTED_INTROS['location-explorer'].description), 'Includes exact Location Explore description')
      assert.ok(html.includes('page-intro-header view-header'), 'Uses natural page header semantic class')
      assert.ok(html.includes('page-intro-accent-bar'), 'Includes subtle visual accent')
    })

    await t.test('3. SiteEvaluation renders introductory header before controls', () => {
      const html = ReactDOMServer.renderToString(React.createElement(SiteEvaluation, {}))
      assert.ok(html.includes(EXPECTED_INTROS['site-evaluation'].title), 'Includes exact Site Evaluation title')
      assert.ok(
        html.includes(EXPECTED_INTROS['site-evaluation'].description) ||
        html.includes(EXPECTED_INTROS['site-evaluation'].description.replace("site's", "site&#x27;s")),
        'Includes exact Site Evaluation description'
      )
      assert.ok(html.includes('page-intro-header view-header'), 'Uses natural page header semantic class')
      assert.ok(html.includes('page-intro-accent-bar'), 'Includes subtle visual accent')
    })

    await t.test('4. ResearchHub renders introductory header before researcher session banner', () => {
      const html = ReactDOMServer.renderToString(React.createElement(ResearchHub, {}))
      assert.ok(html.includes(EXPECTED_INTROS['research-hub'].title), 'Includes exact Research Hub title')
      assert.ok(html.includes(EXPECTED_INTROS['research-hub'].description), 'Includes exact Research Hub description')
      assert.ok(html.includes('page-intro-header view-header'), 'Uses natural page header semantic class')
      assert.ok(html.includes('page-intro-accent-bar'), 'Includes subtle visual accent')
    })

    await t.test('5. PublicDiscovery renders introductory header before sub-navigation tabs', () => {
      const html = ReactDOMServer.renderToString(React.createElement(PublicDiscovery, {}))
      assert.ok(html.includes(EXPECTED_INTROS['public-discovery'].title), 'Includes exact Public Discovery title')
      assert.ok(html.includes(EXPECTED_INTROS['public-discovery'].description), 'Includes exact Public Discovery description')
      assert.ok(html.includes('page-intro-header view-header'), 'Uses natural page header semantic class')
      assert.ok(html.includes('page-intro-accent-bar'), 'Includes subtle visual accent')
    })

    // ------------------------------------------------------------------------
    // 3. FULL ROUTE RENDERING AUDIT DIRECTLY BELOW NAVBAR
    // ------------------------------------------------------------------------
    function renderRoute(route) {
      return ReactDOMServer.renderToString(
        React.createElement(
          MemoryRouter,
          { initialEntries: [route] },
          React.createElement(App, {})
        )
      )
    }

    await t.test('6. Route /locations displays intro section directly below navbar', () => {
      const html = renderRoute('/locations')
      assert.ok(html.includes('Discover Earth Analogue Locations'), 'Renders title at route')
      assert.ok(html.includes(EXPECTED_INTROS['location-explorer'].description), 'Renders description at route')
      assert.ok(html.includes('02') && html.includes('Sites &amp; Geodesy'), 'Renders subsystem tag')
    })

    await t.test('7. Route /assessment displays intro section directly below navbar', () => {
      const html = renderRoute('/assessment')
      assert.ok(html.includes('Evaluate and Compare Analogue Sites'), 'Renders title at route')
      assert.ok(
        html.includes(EXPECTED_INTROS['site-evaluation'].description) ||
        html.includes(EXPECTED_INTROS['site-evaluation'].description.replace("site's", "site&#x27;s")),
        'Renders description at route'
      )
      assert.ok(html.includes('03') && html.includes('Scientific Assessment'), 'Renders subsystem tag')
    })

    await t.test('8. Route /research displays intro section directly below navbar', () => {
      const html = renderRoute('/research')
      assert.ok(html.includes('Your Research Workspace'), 'Renders title at route')
      assert.ok(html.includes(EXPECTED_INTROS['research-hub'].description), 'Renders description at route')
      assert.ok(html.includes('04') && html.includes('Field Operations'), 'Renders subsystem tag')
    })

    await t.test('9. Route /discovery displays intro section directly below navbar', () => {
      const html = renderRoute('/discovery')
      assert.ok(html.includes('Explore Planetary Science'), 'Renders title at route')
      assert.ok(html.includes(EXPECTED_INTROS['public-discovery'].description), 'Renders description at route')
      assert.ok(html.includes('05') && html.includes('Public Science'), 'Renders subsystem tag')
    })

    await t.test('10. Home page (/) does not render inner page intro headers', () => {
      const html = renderRoute('/')
      assert.ok(!html.includes('page-intro-header view-header'), 'Home page does not render inner page intro')
      assert.ok(!html.includes('Discover Earth Analogue Locations'), 'Home page does not render Location Explore intro')
    })

  } finally {
    await vite.close()
  }
})
