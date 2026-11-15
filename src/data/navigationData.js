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
    description: 'Interactive map and geospatial filtering of terrestrial analogue research sites',
  },
  {
    id: 'site-evaluation',
    label: 'Analogue Site Assessment',
    path: '/assessment',
    section: 'Scientific Assessment',
    description: 'Unified planetary terrain comparison (Mars MOLA & Moon LOLA) and multi-factor analogue evaluation',
  },
  {
    id: 'research-hub',
    label: 'Research Hub',
    path: '/research',
    section: 'Field Operations',
    description: 'Unified Experiment Database, Research Records registry, and Researcher Workspace',
  },
  {
    id: 'public-discovery',
    label: 'Public Discovery',
    path: '/discovery',
    section: 'Public Science',
    description: 'Student and visitor exploration of Mars/Moon terrain analogues, mission stories, and public research findings',
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
