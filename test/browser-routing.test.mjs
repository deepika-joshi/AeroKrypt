import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer, preview } from 'vite'
import { MemoryRouter } from 'react-router-dom'

// Polyfill window & document for SSR / node:test
if (!globalThis.window) {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:5173/' },
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080 },
    scrollTo: () => {},
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

test('AEROKRYPT CLIENT-SIDE ROUTING & BROWSER NAVIGATION SUITE', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const App = (await vite.ssrLoadModule('./src/App.jsx')).default
    const { NAVIGATION_SECTIONS, getNavIdFromPath, getRouteForNavId } =
      await vite.ssrLoadModule('./src/data/navigationData.js')

    await t.test('1. Canonical Routes & Navigation Data Configuration', () => {
      assert.equal(NAVIGATION_SECTIONS.length, 5, 'Must have exactly 5 canonical sections')

      const expectedRoutes = [
        { id: 'dashboard', path: '/', label: 'Home' },
        { id: 'location-explorer', path: '/locations', label: 'Location Explore' },
        { id: 'site-evaluation', path: '/assessment', label: 'Analogue Site Assessment' },
        { id: 'research-hub', path: '/research', label: 'Research Hub' },
        { id: 'public-discovery', path: '/discovery', label: 'Public Discovery' },
      ]

      for (const expected of expectedRoutes) {
        const item = NAVIGATION_SECTIONS.find((s) => s.id === expected.id)
        assert.ok(item, `Section [${expected.id}] exists`)
        assert.equal(item.path, expected.path, `Section [${expected.id}] path is ${expected.path}`)
        assert.equal(item.label, expected.label, `Section [${expected.id}] label is ${expected.label}`)
      }

      assert.equal(getRouteForNavId('dashboard'), '/')
      assert.equal(getRouteForNavId('location-explorer'), '/locations')
      assert.equal(getRouteForNavId('site-evaluation'), '/assessment')
      assert.equal(getRouteForNavId('research-hub'), '/research')
      assert.equal(getRouteForNavId('public-discovery'), '/discovery')

      assert.equal(getNavIdFromPath('/'), 'dashboard')
      assert.equal(getNavIdFromPath('/locations'), 'location-explorer')
      assert.equal(getNavIdFromPath('/assessment'), 'site-evaluation')
      assert.equal(getNavIdFromPath('/research'), 'research-hub')
      assert.equal(getNavIdFromPath('/discovery'), 'public-discovery')
    })

    await t.test('2. Direct Route Access - Home (/)', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/'] },
          React.createElement(App)
        )
      )
      assert.ok(html.includes('AEROKRYPT'), 'Renders AEROKRYPT brand')
      assert.ok(html.includes('content-dashboard-shell'), 'Renders dashboard shell class')
      assert.ok(html.includes('href="/"'), 'Navbar logo links to /')
      assert.ok(html.includes('Upcoming Events'), 'Navbar includes Upcoming Events dropdown')
      assert.ok(html.includes('Evaluate Earth Sites for Mars and Moon Research'), 'Renders exact hero headline')
      assert.ok(html.includes('Explore the Platform'), 'Renders Explore the Platform button')
      assert.ok(html.includes('Learn How It Works'), 'Renders Learn How It Works button')
      assert.ok(html.includes('Upcoming Research &amp; Events'), 'Renders Upcoming Research & Events section')
      assert.ok(html.includes('How It Works'), 'Renders How It Works section')
      assert.ok(html.includes('Our Research Focus'), 'Renders Our Research Focus section')
      assert.ok(html.includes('Contact Us'), 'Renders minimal footer Contact Us')
      assert.ok(html.includes('Privacy Policy'), 'Renders minimal footer Privacy Policy')
      assert.ok(html.includes('Media'), 'Renders minimal footer Media')
      assert.ok(html.includes('© 2026 AEROKRYPT. All rights reserved.'), 'Renders minimal footer copyright')
    })

    await t.test('3. Direct Route Access - Location Explore (/locations)', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/locations'] },
          React.createElement(App)
        )
      )
      assert.ok(html.includes('Sites &amp; Geodesy') && html.includes('02'), 'Shows section 02 header')
      assert.ok(html.includes('Location Explore'), 'Shows Location Explore title')
      assert.ok(html.includes('content-viewport'), 'Uses inner viewport layout')
    })

    await t.test('4. Direct Route Access - Analogue Site Assessment (/assessment)', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/assessment'] },
          React.createElement(App)
        )
      )
      assert.ok(html.includes('Scientific Assessment') && html.includes('03'), 'Shows section 03 header')
      assert.ok(html.includes('Analogue Site Assessment'), 'Shows Analogue Site Assessment title')
      assert.ok(html.includes('Analogue Research Location:'), 'Renders assessment location selector')
    })

    await t.test('5. Direct Route Access - Research Hub (/research)', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/research'] },
          React.createElement(App)
        )
      )
      assert.ok(html.includes('Field Operations') && html.includes('04'), 'Shows section 04 header')
      assert.ok(html.includes('Research Hub'), 'Shows Research Hub title')
      assert.ok(html.includes('research-hub-container'), 'Renders Research Hub view')
    })

    await t.test('6. Direct Route Access - Public Discovery (/discovery)', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/discovery'] },
          React.createElement(App)
        )
      )
      assert.ok(html.includes('Public Science') && html.includes('05'), 'Shows section 05 header')
      assert.ok(html.includes('Public Discovery'), 'Shows Public Discovery title')
    })

    await t.test('7. Navigation Sequence & History Entries Simulation', () => {
      // Test the exact specified flow:
      // Dashboard -> Location Explore -> Research Hub -> browser Back -> Location Explore -> browser Forward -> Research Hub
      const entries = ['/', '/locations', '/research']

      // Step A: Initial location at /
      const htmlDash = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: entries, initialIndex: 0 },
          React.createElement(App)
        )
      )
      assert.ok(htmlDash.includes('content-dashboard-shell'), 'Step A: On Dashboard')

      // Step B: Navigate to /locations
      const htmlLoc = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: entries, initialIndex: 1 },
          React.createElement(App)
        )
      )
      assert.ok(htmlLoc.includes('Location Explore'), 'Step B: On Location Explore')

      // Step C: Navigate to /research
      const htmlRes = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: entries, initialIndex: 2 },
          React.createElement(App)
        )
      )
      assert.ok(htmlRes.includes('Research Hub'), 'Step C: On Research Hub')

      // Step D: Browser Back to /locations (index 1)
      const htmlBack = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: entries, initialIndex: 1 },
          React.createElement(App)
        )
      )
      assert.ok(htmlBack.includes('Location Explore'), 'Step D: Back to Location Explore')

      // Step E: Browser Forward to /research (index 2)
      const htmlFwd = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: entries, initialIndex: 2 },
          React.createElement(App)
        )
      )
      assert.ok(htmlFwd.includes('Research Hub'), 'Step E: Forward to Research Hub')
    })

    await t.test('8. Legacy Path Redirects', () => {
      // /location-explorer -> /locations
      const html1 = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/location-explorer'] },
          React.createElement(App)
        )
      )
      assert.ok(html1.includes('Location Explore'), 'Redirects /location-explorer to /locations')

      // /site-evaluation -> /assessment
      const html2 = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/site-evaluation'] },
          React.createElement(App)
        )
      )
      assert.ok(html2.includes('Analogue Site Assessment'), 'Redirects /site-evaluation to /assessment')

      // /planetary-comparison -> /assessment
      const html3 = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/planetary-comparison'] },
          React.createElement(App)
        )
      )
      assert.ok(html3.includes('Analogue Site Assessment'), 'Redirects /planetary-comparison to /assessment')

      // /research-hub -> /research
      const html4 = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/research-hub'] },
          React.createElement(App)
        )
      )
      assert.ok(html4.includes('Research Hub'), 'Redirects /research-hub to /research')

      // Unknown path -> Dashboard
      const html5 = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/unknown-random-route'] },
          React.createElement(App)
        )
      )
      assert.ok(html5.includes('content-dashboard-shell'), 'Redirects unknown route to / (Dashboard)')
    })

    await t.test('9. External Links Integrity in Subsystem Footer', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/locations'] },
          React.createElement(App)
        )
      )
      // Check that external repository links in inner subsystems still have target="_blank" and rel="noreferrer"
      assert.ok(html.includes('href="https://pds-geosciences.wustl.edu'), 'External NASA PDS link preserved')
      assert.ok(html.includes('target="_blank"'), 'External link has target="_blank"')
      assert.ok(html.includes('rel="noreferrer"'), 'External link has rel="noreferrer"')
    })

    await t.test('10. Direct URL Access & SPA Fallback on Production Build (HTTP 200)', async () => {
      const previewServer = await preview({
        preview: { port: 5199, strictPort: true },
      })

      try {
        const testUrls = [
          'http://localhost:5199/',
          'http://localhost:5199/locations',
          'http://localhost:5199/assessment',
          'http://localhost:5199/research',
          'http://localhost:5199/discovery',
          'http://localhost:5199/location-explorer',
        ]

        for (const url of testUrls) {
          const res = await fetch(url)
          assert.equal(res.status, 200, `Direct access to ${url} returns HTTP 200`)
          const body = await res.text()
          assert.ok(body.includes('<div id="root"></div>'), `Response contains HTML root container`)
          assert.ok(body.includes('AEROKRYPT'), `Response contains AEROKRYPT title`)
        }
      } finally {
        await new Promise((resolve) => previewServer.httpServer.close(resolve))
      }
    })
  } finally {
    await vite.close()
  }
})
