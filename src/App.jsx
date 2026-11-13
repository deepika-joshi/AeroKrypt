import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import LocationFinder from './components/location-finder/LocationFinder.jsx'
import SiteEvaluation from './components/site-evaluation/SiteEvaluation.jsx'
import ResearchHub from './components/research-hub/ResearchHub.jsx'
import PublicDiscovery from './components/public-discovery/PublicDiscovery.jsx'
import './App.css'

function App() {
  return (
    <AppLayout>
      {({
        activeNav,
        searchQuery,
        onNavigate,
        navigationParams,
        onClearNavigationParams,
      }) => {
        // 1. Dashboard
        if (activeNav.id === 'dashboard') {
          return (
            <Dashboard
              onNavigate={onNavigate}
              searchQuery={searchQuery}
            />
          )
        }

        // 2. Location Explore
        if (activeNav.id === 'location-explorer' || activeNav.id === 'location-explore') {
          return (
            <LocationFinder
              prefocusedLocationId={navigationParams?.locationId}
              onClearPrefocus={onClearNavigationParams}
              onNavigate={onNavigate}
            />
          )
        }

        // 3. Site Evaluation (merged with Planetary Comparison)
        if (activeNav.id === 'site-evaluation' || activeNav.id === 'planetary-comparison') {
          return (
            <SiteEvaluation
              initialLocationId={navigationParams?.locationId}
              initialTerrainId={navigationParams?.terrainId}
              initialExperimentId={navigationParams?.experimentId}
              onNavigate={onNavigate}
            />
          )
        }

        // 4. Research Hub (merged Experiment Database, Research Records, Researcher Workspace)
        if (
          activeNav.id === 'research-hub' ||
          activeNav.id === 'experiment-database' ||
          activeNav.id === 'research-records' ||
          activeNav.id === 'researcher-portal'
        ) {
          const subview =
            navigationParams?.subview ||
            (activeNav.id === 'research-records'
              ? 'records'
              : activeNav.id === 'researcher-portal'
              ? 'workspace'
              : 'experiments')

          return (
            <ResearchHub
              initialSubview={subview}
              onNavigate={onNavigate}
            />
          )
        }

        // 5. Public Discovery
        if (activeNav.id === 'public-discovery') {
          return (
            <PublicDiscovery
              onNavigate={onNavigate}
            />
          )
        }

        // Default fallback to Dashboard
        return (
          <Dashboard
            onNavigate={onNavigate}
            searchQuery={searchQuery}
          />
        )
      }}
    </AppLayout>
  )
}

export default App
