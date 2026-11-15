/**
 * AEROKRYPT — Planetary Science & Analogue Research Events Registry
 *
 * In compliance with scientific integrity protocols, only authoritative,
 * published upcoming events from accredited agencies (ESA, AGU, LPI/USRA, UNM/SSERVI,
 * Europlanet) are maintained using direct official event pages.
 *
 * Unannounced fields strictly display "Not announced".
 * Expired events are automatically excluded based on the current date.
 */

export const EVENT_CATEGORIES = [
  'All Categories',
  'Conferences',
  'Workshops',
  'Webinars',
  'Research Opportunities',
  'Planetary Mission Events',
]

export const UPCOMING_EVENTS = [
  {
    id: 'casa-moon-seminar-nov-2026',
    title: 'CASA Moon Seminar: Highland and Mare Magmatism',
    startDate: '2026-11-18',
    endDate: '2026-11-18',
    date: 'November 18, 2026 (11:00 AM MT)',
    location: 'Northrop Hall 340, University of New Mexico, Albuquerque, NM',
    format: 'Hybrid',
    institution: 'University of New Mexico & NASA SSERVI (CASA Moon Node)',
    category: 'Workshops',
    description: 'Planetary sample science seminar presented by Quinton Vitelli-Hawkins and Lydia Hamilton on lunar crustal evolution, highland anorthosites, and mare basalt magmatism at UNM.',
    officialUrl: 'https://casamoon.unm.edu/',
    registrationUrl: 'https://casamoon.unm.edu/',
    registrationDeadline: null, // Not announced
    lastVerifiedDate: '2026-11-15',
    source: 'UNM Institute of Meteoritics / CASA Moon Official Schedule',
    featured: false,
  },
  {
    id: 'esa-exploration-science-workshop-2026',
    title: 'ESA Exploration Science Workshop 2026',
    startDate: '2026-11-24',
    endDate: '2026-11-26',
    date: 'November 24–26, 2026',
    location: 'Rome, Italy (ASI Headquarters)',
    format: 'In-Person',
    institution: 'European Space Agency (ESA) & Italian Space Agency (ASI)',
    category: 'Workshops',
    description: 'Workshop convening international researchers, ESA delegations, and industry partners to evaluate exploration science across Low Earth Orbit, the Moon, and Mars under the Explore2040 Strategy.',
    officialUrl: 'https://explorationscience.esa.int/event/save-the-date-exploration-science-workshop-2026/',
    registrationUrl: 'https://explorationscience.esa.int/event/save-the-date-exploration-science-workshop-2026/',
    registrationDeadline: null, // Not announced
    lastVerifiedDate: '2026-11-15',
    source: 'ESA Exploration Science Official Event Portal',
    featured: true,
  },
  {
    id: 'casa-moon-seminar-dec-2026',
    title: 'CASA Moon Seminar: Exploration & Technology Needs for Lunar Return',
    startDate: '2026-12-02',
    endDate: '2026-12-02',
    date: 'December 2, 2026 (11:00 AM MT)',
    location: 'Northrop Hall 340, University of New Mexico, Albuquerque, NM',
    format: 'Hybrid',
    institution: 'University of New Mexico & NASA SSERVI (CASA Moon Node)',
    category: 'Workshops',
    description: 'Technical seminar presented by Audrey Morris-Eckart (NASA HQ) on instrumentation, surface systems, and sample collection protocols required for human return to the Moon.',
    officialUrl: 'https://casamoon.unm.edu/',
    registrationUrl: 'https://casamoon.unm.edu/',
    registrationDeadline: null, // Not announced
    lastVerifiedDate: '2026-11-15',
    source: 'UNM Institute of Meteoritics / CASA Moon Official Schedule',
    featured: false,
  },
  {
    id: 'agu-fall-meeting-2026',
    title: 'AGU26 Annual Meeting',
    startDate: '2026-12-07',
    endDate: '2026-12-11',
    date: 'December 7–11, 2026',
    location: 'Moscone Center, San Francisco, CA, USA',
    format: 'In-Person',
    institution: 'American Geophysical Union (AGU)',
    category: 'Conferences',
    description: 'Premier global Earth and space science meeting, featuring technical sessions on planetary geomorphology, Martian terrain evolution, lunar volatile reservoirs, and terrestrial planetary analogues.',
    officialUrl: 'https://www.agu.org/agu26',
    registrationUrl: 'https://www.agu.org/agu26',
    registrationDeadline: null, // Not announced
    lastVerifiedDate: '2026-11-15',
    source: 'American Geophysical Union (AGU) AGU26 Portal',
    featured: true,
  },
  {
    id: 'lpsc-2027',
    title: '58th Lunar and Planetary Science Conference (LPSC 2027)',
    startDate: '2027-03-15',
    endDate: '2027-03-19',
    date: 'March 15–19, 2027',
    location: 'The Woodlands, Texas, USA & Virtual',
    format: 'Hybrid',
    institution: 'Lunar and Planetary Institute (LPI) / USRA & NASA Johnson Space Center',
    category: 'Conferences',
    description: 'Premier international planetary science conference bringing together researchers to share findings in petrology, geochemistry, geophysics, geology, and astronomy of the Moon, Mars, and terrestrial analogue sites.',
    officialUrl: 'https://www.hou.usra.edu/meetings/lpsc2027/',
    registrationUrl: 'https://www.hou.usra.edu/meetings/lpsc2027/',
    registrationDeadline: null, // Not announced (Abstract deadline: Jan 5, 2027)
    lastVerifiedDate: '2026-11-15',
    source: 'USRA / Lunar and Planetary Institute (LPI) Official LPSC Portal',
    featured: true,
  },
  {
    id: 'lpi-summer-intern-program-2027',
    title: 'LPI Summer Intern Program in Planetary Science',
    startDate: '2027-06-07',
    endDate: '2027-08-13',
    date: 'June 7 – August 13, 2027',
    location: 'Houston, TX, USA (LPI / NASA JSC)',
    format: 'In-Person',
    institution: 'Lunar and Planetary Institute (LPI) / USRA',
    category: 'Research Opportunities',
    description: 'Competitive 10-week undergraduate research fellowship providing one-on-one mentorship with NASA and LPI scientists on lunar, Martian, and terrestrial analogue exploration and remote sensing datasets.',
    officialUrl: 'https://www.lpi.usra.edu/lpiintern/',
    registrationUrl: 'https://www.lpi.usra.edu/lpiintern/',
    registrationDeadline: '2026-12-14',
    lastVerifiedDate: '2026-11-15',
    source: 'USRA / Lunar and Planetary Institute (LPI) Official Portal',
    featured: false,
  },
  {
    id: 'epsc-2027',
    title: 'Europlanet Science Congress (EPSC 2027)',
    startDate: '2027-09-19',
    endDate: '2027-09-24',
    date: 'September 19–24, 2027',
    location: 'Centre de Congrès Pierre Baudis, Toulouse, France',
    format: 'Not announced',
    institution: 'Europlanet Society',
    category: 'Conferences',
    description: "Europe's premier planetary science congress, featuring presentations on lunar exploration missions, Martian surface geology, astrobiology, and field evaluation of terrestrial analogue sites.",
    officialUrl: 'https://www.epsc2027.eu/',
    registrationUrl: 'https://www.epsc2027.eu/',
    registrationDeadline: null, // Not announced
    lastVerifiedDate: '2026-11-15',
    source: 'Europlanet Science Congress Official Portal (epsc2027.eu)',
    featured: false,
  },
]

/**
 * Checks whether an event has passed its concluding date relative to a reference time.
 * @param {Object} event
 * @param {Date|string|number} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isEventExpired(event, referenceDate = new Date()) {
  if (!event || !event.endDate) return false
  const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate)
  // An event concludes at the end of its end-date day (23:59:59.999 local)
  const eventEnd = new Date(`${event.endDate}T23:59:59.999`)
  return eventEnd.getTime() < ref.getTime()
}

/**
 * Returns all active, unexpired events sorted chronologically by startDate.
 * @param {Date|string|number} [referenceDate=new Date()]
 * @returns {Array<Object>}
 */
export function getUpcomingEvents(referenceDate = new Date()) {
  return UPCOMING_EVENTS
    .filter((event) => !isEventExpired(event, referenceDate))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

/**
 * Returns featured upcoming events (up to the requested limit).
 * If specific events are flagged with featured: true, those are prioritized.
 * @param {number} [limit=3]
 * @param {Date|string|number} [referenceDate=new Date()]
 * @returns {Array<Object>}
 */
export function getFeaturedUpcomingEvents(limit = 3, referenceDate = new Date()) {
  const active = getUpcomingEvents(referenceDate)
  const featuredOnly = active.filter((e) => e.featured)
  if (featuredOnly.length >= limit) {
    return featuredOnly.slice(0, limit)
  }
  // Fill remaining slots chronologically
  const remaining = active.filter((e) => !e.featured)
  return [...featuredOnly, ...remaining].slice(0, limit)
}

/**
 * Safe field display helper returning "Not announced" when a value is absent.
 * @param {any} value
 * @returns {string}
 */
export function formatEventField(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not announced'
  }
  return String(value)
}
