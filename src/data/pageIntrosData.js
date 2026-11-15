/**
 * AEROKRYPT - Canonical Page Intro Content Registry
 *
 * Defines the introductory title, description, and telemetry metadata
 * for the four primary navigation pages.
 */

export const PAGE_INTRO_CONFIGS = {
  'location-explorer': {
    id: 'location-explorer',
    sectionCode: '02',
    sectionLabel: 'Sites & Geodesy',
    navLabel: 'Location Explore',
    title: 'Discover Earth Analogue Locations',
    description:
      'Explore terrestrial environments that may serve as analogues for Mars and Moon research. Browse curated locations, examine their geological characteristics, and discover why they may be relevant to planetary studies.',
  },
  'site-evaluation': {
    id: 'site-evaluation',
    sectionCode: '03',
    sectionLabel: 'Scientific Assessment',
    navLabel: 'Analogue Site Assessment',
    title: 'Evaluate and Compare Analogue Sites',
    description:
      "Examine how selected Earth locations compare with Mars and Moon environments. Explore terrain, geological characteristics, available scientific evidence, and data gaps to understand each site's potential as a planetary analogue.",
    extraChip: 'DUAL-VECTOR GEOLOGICAL & OPERATIONAL ASSESSMENT',
  },
  'research-hub': {
    id: 'research-hub',
    sectionCode: '04',
    sectionLabel: 'Field Operations',
    navLabel: 'Research Hub',
    title: 'Your Research Workspace',
    description:
      'Manage your research in one place. Enter observations and measurements, create site evaluations, save results, compare findings, and submit research for review and publication.',
  },
  'public-discovery': {
    id: 'public-discovery',
    sectionCode: '05',
    sectionLabel: 'Public Science',
    navLabel: 'Public Discovery',
    title: 'Explore Planetary Science',
    description:
      'Learn about planetary exploration through NASA research instruments and technologies, educational resources, simplified case studies, and the archive of published research.',
  },
}
