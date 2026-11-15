import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServer } from 'vite'
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

test('AEROKRYPT UPCOMING RESEARCH & EVENTS SUITE', async (t) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  try {
    const {
      EVENT_CATEGORIES,
      UPCOMING_EVENTS,
      isEventExpired: _isEventExpired,
      getUpcomingEvents,
      getFeaturedUpcomingEvents,
      formatEventField: _formatEventField,
    } = await vite.ssrLoadModule('./src/data/eventsData.js')

    const UpcomingEventsSection = (
      await vite.ssrLoadModule('./src/components/home/UpcomingEventsSection.jsx')
    ).default

    const Navbar = (
      await vite.ssrLoadModule('./src/components/layout/Navbar.jsx')
    ).default

    await t.test('1. Event Registry Schema & Provenance Integrity', () => {
      assert.equal(UPCOMING_EVENTS.length, 7, 'Exact published event count is 7')

      const allowedDomains = [
        'unm.edu',
        'esa.int',
        'agu.org',
        'usra.edu',
        'epsc2027.eu',
      ]

      for (const ev of UPCOMING_EVENTS) {
        assert.ok(ev.id && typeof ev.id === 'string', `Event ${ev.id} has valid id`)
        assert.ok(ev.title && typeof ev.title === 'string', `Event ${ev.id} has title`)
        assert.ok(ev.startDate && /^\d{4}-\d{2}-\d{2}$/.test(ev.startDate), `Event ${ev.id} startDate is YYYY-MM-DD`)
        assert.ok(ev.endDate && /^\d{4}-\d{2}-\d{2}$/.test(ev.endDate), `Event ${ev.id} endDate is YYYY-MM-DD`)
        assert.ok(ev.startDate <= ev.endDate, `Event ${ev.id} startDate <= endDate`)
        assert.ok(ev.location && typeof ev.location === 'string', `Event ${ev.id} has location`)
        assert.ok(ev.format && ['In-Person', 'Virtual', 'Hybrid', 'Not announced'].includes(ev.format), `Event ${ev.id} has valid format`)
        assert.ok(ev.institution && typeof ev.institution === 'string', `Event ${ev.id} has institution`)
        assert.ok(EVENT_CATEGORIES.includes(ev.category), `Event ${ev.id} has valid category (${ev.category})`)
        assert.ok(ev.description && typeof ev.description === 'string', `Event ${ev.id} has description`)
        assert.ok(ev.officialUrl && typeof ev.officialUrl === 'string', `Event ${ev.id} has officialUrl`)
        assert.ok(ev.source && typeof ev.source === 'string', `Event ${ev.id} has authoritative source citation`)
        assert.ok(ev.lastVerifiedDate && /^\d{4}-\d{2}-\d{2}$/.test(ev.lastVerifiedDate), `Event ${ev.id} has lastVerifiedDate`)

        // Verify officialUrl domain matches allowed primary domains
        const urlObj = new URL(ev.officialUrl)
        const matchesDomain = allowedDomains.some((d) => urlObj.hostname.includes(d))
        assert.ok(matchesDomain, `Event ${ev.id} URL (${ev.officialUrl}) matches authoritative institution domain`)
      }
    })

    await t.test('2. Final Verified URLs & Formats', () => {
      // 1. CASA Moon Seminars
      const casaNov = UPCOMING_EVENTS.find((e) => e.id === 'casa-moon-seminar-nov-2026')
      assert.ok(casaNov, 'CASA Moon Nov seminar exists')
      assert.equal(casaNov.format, 'Hybrid', 'CASA Moon Nov is Hybrid (confirmed by LPI calendar & UNM Institute of Meteoritics)')
      assert.equal(casaNov.officialUrl, 'https://casamoon.unm.edu/')
      assert.ok(casaNov.location.includes('Northrop Hall 340'), 'Location is Northrop Hall 340, UNM')

      const casaDec = UPCOMING_EVENTS.find((e) => e.id === 'casa-moon-seminar-dec-2026')
      assert.ok(casaDec, 'CASA Moon Dec seminar exists')
      assert.equal(casaDec.format, 'Hybrid', 'CASA Moon Dec is Hybrid (confirmed by LPI calendar & UNM Institute of Meteoritics)')
      assert.equal(casaDec.officialUrl, 'https://casamoon.unm.edu/')

      // 2. ESA
      const esa = UPCOMING_EVENTS.find((e) => e.id === 'esa-exploration-science-workshop-2026')
      assert.ok(esa, 'ESA workshop exists')
      assert.equal(esa.format, 'In-Person', 'ESA format is In-Person')
      assert.equal(
        esa.officialUrl,
        'https://explorationscience.esa.int/event/save-the-date-exploration-science-workshop-2026/',
        'ESA direct event-specific URL'
      )

      // 3. AGU26
      const agu = UPCOMING_EVENTS.find((e) => e.id === 'agu-fall-meeting-2026')
      assert.ok(agu, 'AGU26 exists')
      assert.equal(agu.format, 'In-Person', 'AGU26 format is In-Person (not labeled Hybrid)')
      assert.equal(agu.officialUrl, 'https://www.agu.org/agu26', 'AGU26 direct event URL')

      // 4. LPSC 2027
      const lpsc = UPCOMING_EVENTS.find((e) => e.id === 'lpsc-2027')
      assert.ok(lpsc, 'LPSC 2027 exists')
      assert.equal(lpsc.format, 'Hybrid', 'LPSC format is Hybrid')
      assert.equal(lpsc.officialUrl, 'https://www.hou.usra.edu/meetings/lpsc2027/')

      // 5. LPI Summer Intern Program
      const lpiIntern = UPCOMING_EVENTS.find((e) => e.id === 'lpi-summer-intern-program-2027')
      assert.ok(lpiIntern, 'LPI Intern exists')
      assert.equal(lpiIntern.format, 'In-Person', 'LPI Intern is In-Person')
      assert.equal(lpiIntern.officialUrl, 'https://www.lpi.usra.edu/lpiintern/')
      assert.equal(lpiIntern.startDate, '2027-06-07', 'Event starts June 7, 2027')
      assert.equal(lpiIntern.registrationDeadline, '2026-12-14', 'Application deadline is December 14, 2026')

      // 6. EPSC2027
      const epsc = UPCOMING_EVENTS.find((e) => e.id === 'epsc-2027')
      assert.ok(epsc, 'EPSC2027 exists')
      assert.equal(epsc.format, 'Not announced', 'EPSC2027 format is Not announced without explicit confirmation')
      assert.equal(epsc.officialUrl, 'https://www.epsc2027.eu/')

      // 7. DPS 2027 removal verification
      const dps = UPCOMING_EVENTS.find((e) => e.id === 'aas-dps-meeting-2027')
      assert.equal(dps, undefined, 'DPS 2027 removed until verified')
    })

    await t.test('3. Chronological Sorting & Automatic Expiration Logic', () => {
      const referenceDate = new Date('2026-11-15T00:00:00Z')
      const active = getUpcomingEvents(referenceDate)

      assert.equal(active.length, 7, 'All 7 published events are active on 2026-11-15')

      for (let i = 0; i < active.length - 1; i++) {
        const currentStart = new Date(active[i].startDate).getTime()
        const nextStart = new Date(active[i + 1].startDate).getTime()
        assert.ok(currentStart <= nextStart, `Events are sorted chronologically (${active[i].id} <= ${active[i + 1].id})`)
      }

      const farFuture = new Date('2030-01-01T00:00:00Z')
      const expiredAll = getUpcomingEvents(farFuture)
      assert.equal(expiredAll.length, 0, 'All current events expire by 2030')
    })

    await t.test('4. Featured Events Selection', () => {
      const referenceDate = new Date('2026-11-15T00:00:00Z')
      const featured = getFeaturedUpcomingEvents(3, referenceDate)
      assert.equal(featured.length, 3, 'Returns exactly 3 featured events')
      for (const fe of featured) {
        assert.equal(fe.featured, true, `Event ${fe.id} has featured: true`)
      }
    })

    await t.test('5. Home Page UpcomingEventsSection SSR Rendering', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(UpcomingEventsSection)
      )

      assert.ok(html.includes('Upcoming Research &amp; Events'), 'Renders Upcoming Research & Events title')
      assert.ok(html.includes('ESA Exploration Science Workshop 2026'), 'Renders ESA workshop')
      assert.ok(html.includes('AGU26 Annual Meeting'), 'Renders AGU Meeting')
      assert.ok(html.includes('58th Lunar and Planetary Science Conference (LPSC 2027)'), 'Renders LPSC 2027')

      // Official event link integrity
      assert.ok(
        html.includes('href="https://explorationscience.esa.int/event/save-the-date-exploration-science-workshop-2026/"'),
        'ESA direct save-the-date link present'
      )
      assert.ok(html.includes('href="https://www.agu.org/agu26"'), 'AGU26 direct event URL present')
      assert.ok(html.includes('target="_blank"'), 'External link has target="_blank"')
      assert.ok(html.includes('rel="noreferrer"'), 'External link has rel="noreferrer"')
    })

    await t.test('6. Navbar Dropdown Upcoming Events SSR Rendering', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(MemoryRouter, { initialEntries: ['/'] },
          React.createElement(Navbar, { activeNavId: 'dashboard' })
        )
      )

      assert.ok(html.includes('Upcoming Events'), 'Navbar has Upcoming Events trigger')
      assert.ok(html.includes('7 EVENTS'), 'Navbar displays exact published event count')
      assert.ok(html.includes('FEATURED 01'), 'Navbar dropdown previews Featured 01')
      assert.ok(html.includes('View All Events'), 'Navbar dropdown has View All Events button')
    })
  } finally {
    await vite.close()
  }
})
