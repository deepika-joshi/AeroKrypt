import MetricCard from '../common/MetricCard.jsx'
import { ANALOGUE_LOCATIONS } from '../../data/locationsData.js'
import { PEER_REVIEWED_RESEARCH_LIBRARY } from '../../data/researchLibraryData.js'
import { EDUCATIONAL_MODULES, CASE_STUDIES_SIMPLIFIED } from '../../data/learningCenterData.js'
import {
  getAllSubmissions,
  getPublicPublishedContributions,
  SUBMISSION_STATUSES,
} from '../../services/researchRecordService.js'
import { BASEMAP_DEFINITIONS } from '../common/InteractiveMap.jsx'

export default function PlatformOverview({ onNavigate }) {
  // 1. Available operational visual map services (strictly excluding METADATA_ONLY specifications)
  const operationalMapServicesCount = Object.values(BASEMAP_DEFINITIONS).filter(
    (l) => l.type === 'MAP_SERVICE'
  ).length
  const metadataSpecificationsCount = Object.values(BASEMAP_DEFINITIONS).filter(
    (l) => l.type === 'METADATA_ONLY'
  ).length

  // 2. Curated Earth analogue sites
  const earthLocationsCount = ANALOGUE_LOCATIONS.length

  // 3. Indexed research publications
  const indexedPublicationsCount = PEER_REVIEWED_RESEARCH_LIBRARY.length

  // 4. Research submissions
  const allSubmissions = getAllSubmissions()
  const researchSubmissionsCount = allSubmissions.length

  // 5. Assessments awaiting review
  const awaitingReviewCount = allSubmissions.filter(
    (s) => s.status === SUBMISSION_STATUSES.SUBMITTED || s.status === SUBMISSION_STATUSES.UNDER_REVIEW
  ).length

  // 6. Published research
  const publishedResearchCount = getPublicPublishedContributions().length

  // 7. Recently added learning resources
  const learningResourcesCount = EDUCATIONAL_MODULES.length + CASE_STUDIES_SIMPLIFIED.length

  const dynamicMetrics = [
    {
      id: 'map-layers',
      label: 'Operational Map Services',
      value: operationalMapServicesCount,
      unit: 'Visual Services',
      subtext: `${operationalMapServicesCount} active visual basemaps (Earth, Mars, Moon) + ${metadataSpecificationsCount} documented DEM specifications`,
      badgeText: 'Active Basemaps',
      badgeVariant: 'source',
      targetNav: 'location-explorer',
    },
    {
      id: 'earth-locations',
      label: 'Curated Earth Analogue Sites',
      value: earthLocationsCount,
      unit: 'Curated Sites',
      subtext: 'Audited field sites with verified coordinates and literature DOIs',
      badgeText: 'Audited Baseline',
      badgeVariant: 'verified',
      targetNav: 'location-explorer',
    },
    {
      id: 'library-publications',
      label: 'Indexed Research Papers',
      value: indexedPublicationsCount,
      unit: 'Peer-Reviewed',
      subtext: 'Mars/Moon analogue, geology, rover mobility, and astrobiology studies',
      badgeText: 'Library Archive',
      badgeVariant: 'verified',
      targetNav: 'research-hub',
    },
    {
      id: 'research-submissions',
      label: 'Research Submissions',
      value: researchSubmissionsCount,
      unit: 'Contributions',
      subtext: 'Total community research records, site assessments, and evaluations',
      badgeText: 'Workspace Registry',
      badgeVariant: 'sample',
      targetNav: 'research-hub',
    },
    {
      id: 'awaiting-review',
      label: 'Assessments in Review',
      value: awaitingReviewCount,
      unit: 'In Pipeline',
      subtext: 'Submissions currently under peer reviewer inspection',
      badgeText: 'Active Queue',
      badgeVariant: 'planned',
      targetNav: 'research-hub',
    },
    {
      id: 'published-research',
      label: 'Published Research',
      value: publishedResearchCount,
      unit: 'Public Records',
      subtext: 'Approved peer-reviewed contributions published to Public Discovery',
      badgeText: 'Peer Approved',
      badgeVariant: 'verified',
      targetNav: 'public-discovery',
    },
    {
      id: 'learning-resources',
      label: 'Learning Resources',
      value: learningResourcesCount,
      unit: 'Articles & Cases',
      subtext: 'Accessible planetary terrain guides, case studies, and glossary terms',
      badgeText: 'Public Education',
      badgeVariant: 'source',
      targetNav: 'public-discovery',
    },
  ]

  return (
    <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {dynamicMetrics.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
          subtext={metric.subtext}
          badgeText={metric.badgeText}
          badgeVariant={metric.badgeVariant}
          targetNav={metric.targetNav}
          onClick={onNavigate}
        />
      ))}
    </div>
  )
}
