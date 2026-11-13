import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import LocationFinder from './components/location-finder/LocationFinder.jsx'
import SiteEvaluation from './components/site-evaluation/SiteEvaluation.jsx'
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
        if (activeNav.id === 'dashboard') {
          return (
            <Dashboard
              onNavigate={onNavigate}
              searchQuery={searchQuery}
            />
          )
        }

        if (activeNav.id === 'location-explorer') {
          return (
            <LocationFinder
              prefocusedLocationId={navigationParams?.locationId}
              onClearPrefocus={onClearNavigationParams}
              onNavigate={onNavigate}
            />
          )
        }

        if (activeNav.id === 'site-evaluation') {
          return (
            <SiteEvaluation
              initialLocationId={navigationParams?.locationId}
              initialExperimentId={navigationParams?.experimentId}
              onNavigate={onNavigate}
            />
          )
        }

        // Other secondary views will render the default architectural placeholder shells
        return null
      }}
    </AppLayout>
  )
}

export default App
