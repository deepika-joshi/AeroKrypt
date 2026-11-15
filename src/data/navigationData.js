/**
 * AEROKRYPT - Canonical Navigation Structure
 *
 * Defines the 5 primary platform sections:
 * 1. Dashboard
 * 2. Location Explore
 * 3. Site Evaluation
 * 4. Research Hub
 * 5. Public Discovery
 */

export const NAVIGATION_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Home',
    path: '/',
    section: 'Overview',
    description: 'Central platform overview of Earth analogue sites, Mars/Moon terrain datasets, and evaluation metrics',
  },
  {
    id: 'location-explorer',
    label: 'Location Explore',
    path: '/locations',
    section: 'Sites & Geodesy',
    pageTitle: 'Discover Earth Analogue Locations',
    description: 'Explore terrestrial environments that may serve as analogues for Mars and Moon research. Browse curated locations, examine their geological characteristics, and discover why they may be relevant to planetary studies.',
  },
  {
    id: 'site-evaluation',
    label: 'Analogue Site Assessment',
    path: '/assessment',
    section: 'Scientific Assessment',
    pageTitle: 'Evaluate and Compare Analogue Sites',
    description: "Examine how selected Earth locations compare with Mars and Moon environments. Explore terrain, geological characteristics, available scientific evidence, and data gaps to understand each site's potential as a planetary analogue.",
  },
  {
    id: 'research-hub',
    label: 'Research Hub',
    path: '/research',
    section: 'Field Operations',
    pageTitle: 'Your Research Workspace',
    description: 'Manage your research in one place. Enter observations and measurements, create site evaluations, save results, compare findings, and submit research for review and publication.',
  },
  {
    id: 'public-discovery',
    label: 'Public Discovery',
    path: '/discovery',
    section: 'Public Science',
    pageTitle: 'Explore Planetary Science',
    description: 'Learn about planetary exploration through NASA research instruments and technologies, educational resources, simplified case studies, and the archive of published research.',
  },
]

export const ROUTE_MAP = {
  dashboard: '/',
  'location-explorer': '/locations',
  'location-explore': '/locations',
  'site-evaluation': '/assessment',
  'planetary-comparison': '/assessment',
  'research-hub': '/research',
  'experiment-database': '/research',
  'research-records': '/research',
  'researcher-portal': '/research',
  'public-discovery': '/discovery',
}

export function getRouteForNavId(navId) {
  return ROUTE_MAP[navId] || (navId && navId.startsWith('/') ? navId : '/')
}

export function getNavIdFromPath(pathname) {
  if (!pathname || pathname === '/') return 'dashboard'
  if (pathname.startsWith('/locations') || pathname.startsWith('/location')) return 'location-explorer'
  if (pathname.startsWith('/assessment') || pathname.startsWith('/site-evaluation') || pathname.startsWith('/planetary-comparison')) return 'site-evaluation'
  if (pathname.startsWith('/research') || pathname.startsWith('/experiment') || pathname.startsWith('/researcher')) return 'research-hub'
  if (pathname.startsWith('/discovery') || pathname.startsWith('/public-discovery')) return 'public-discovery'
  return 'dashboard'
}
