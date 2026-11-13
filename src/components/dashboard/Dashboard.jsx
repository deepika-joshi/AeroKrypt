import PlatformOverview from './PlatformOverview.jsx'
import FeaturedLocations from './FeaturedLocations.jsx'
import PlanetaryOverview from './PlanetaryOverview.jsx'
import RecentExperiments from './RecentExperiments.jsx'
import ResearchActivity from './ResearchActivity.jsx'
import DataSourcesCard from './DataSourcesCard.jsx'

export default function Dashboard({ onNavigate, searchQuery = '' }) {
  return (
    <div className="scientific-dashboard-layout">
      {/* 1. Platform Overview KPI Cards */}
      <PlatformOverview onNavigate={onNavigate} />

      {/* 2. Featured Earth Analogue Locations */}
      <FeaturedLocations onNavigate={onNavigate} searchQuery={searchQuery} />

      {/* 3. Planetary Overview (Moon, Mars, Earth Environments) */}
      <PlanetaryOverview onNavigate={onNavigate} />

      {/* Two-Column Grid for Experiments and Research Activity */}
      <div className="dashboard-dual-column">
        {/* 4. Recent Field Experiments */}
        <RecentExperiments onNavigate={onNavigate} searchQuery={searchQuery} />

        {/* 5. Research Activity & Publications */}
        <ResearchActivity onNavigate={onNavigate} searchQuery={searchQuery} />
      </div>

      {/* 6. Data Sources & Planned NASA/USGS Integrations */}
      <DataSourcesCard />
    </div>
  )
}

