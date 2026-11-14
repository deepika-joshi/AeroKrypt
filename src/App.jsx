import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import LocationFinder from './components/location-finder/LocationFinder.jsx'
import SiteEvaluation from './components/site-evaluation/SiteEvaluation.jsx'
import ResearchHub from './components/research-hub/ResearchHub.jsx'
import PublicDiscovery from './components/public-discovery/PublicDiscovery.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
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
            <ErrorBoundary title="Dashboard Telemetry Error">
              <Dashboard
                onNavigate={onNavigate}
                searchQuery={searchQuery}
              />
            </ErrorBoundary>
          )
        }

        // 2. Location Explore
        if (activeNav.id === 'location-explorer' || activeNav.id === 'location-explore') {
          return (
            <ErrorBoundary title="Location Explore Anomaly">
              <LocationFinder
                prefocusedLocationId={navigationParams?.locationId}
                onClearPrefocus={onClearNavigationParams}
                onNavigate={onNavigate}
              />
            </ErrorBoundary>
          )
        }

        // 3. Site Evaluation (merged with Planetary Comparison)
        if (activeNav.id === 'site-evaluation' || activeNav.id === 'planetary-comparison') {
          return (
            <ErrorBoundary title="Site Evaluation Engine Anomaly">
              <SiteEvaluation
                initialLocationId={navigationParams?.locationId}
                initialTerrainId={navigationParams?.terrainId}
                initialExperimentId={navigationParams?.experimentId}
                onNavigate={onNavigate}
              />
            </ErrorBoundary>
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
            <ErrorBoundary title="Research Hub Telemetry Anomaly">
              <ResearchHub
                initialSubview={subview}
                onNavigate={onNavigate}
              />
            </ErrorBoundary>
          )
        }

        // 5. Public Discovery
        if (activeNav.id === 'public-discovery') {
          return (
            <ErrorBoundary title="Public Discovery Archive Anomaly">
              <PublicDiscovery
                onNavigate={onNavigate}
              />
            </ErrorBoundary>
          )
        }

        // Default fallback to Dashboard
        return (
          <ErrorBoundary title="System Dashboard Anomaly">
            <Dashboard
              onNavigate={onNavigate}
              searchQuery={searchQuery}
            />
          </ErrorBoundary>
        )
      }}
    </AppLayout>
  )
}

export default App
