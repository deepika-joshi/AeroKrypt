import { useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
  BrowserRouter,
  MemoryRouter,
  useInRouterContext,
} from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import LocationFinder from './components/location-finder/LocationFinder.jsx'
import SiteEvaluation from './components/site-evaluation/SiteEvaluation.jsx'
import ResearchHub from './components/research-hub/ResearchHub.jsx'
import PublicDiscovery from './components/public-discovery/PublicDiscovery.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { getRouteForNavId } from './data/navigationData.js'
import './App.css'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Read navigation parameters from router state or search params
  const navParams = {
    ...Object.fromEntries(searchParams.entries()),
    ...(location.state || {}),
  }

  const handleNavigate = (target, params = null) => {
    const path = getRouteForNavId(target)
    navigate(path, { state: params })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearNavigationParams = () => {
    navigate(location.pathname, { replace: true, state: null })
  }

  return (
    <AppLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onNavigate={handleNavigate}
      navigationParams={navParams}
      onClearNavigationParams={handleClearNavigationParams}
    >
      <Routes>
        {/* 1. Dashboard */}
        <Route
          path="/"
          element={
            <ErrorBoundary title="Dashboard Telemetry Error">
              <Dashboard
                onNavigate={handleNavigate}
                searchQuery={searchQuery}
              />
            </ErrorBoundary>
          }
        />

        {/* 2. Location Explore */}
        <Route
          path="/locations"
          element={
            <ErrorBoundary title="Location Explore Anomaly">
              <LocationFinder
                prefocusedLocationId={navParams?.locationId}
                onClearPrefocus={handleClearNavigationParams}
                onNavigate={handleNavigate}
              />
            </ErrorBoundary>
          }
        />

        {/* 3. Analogue Site Assessment */}
        <Route
          path="/assessment"
          element={
            <ErrorBoundary title="Site Evaluation Engine Anomaly">
              <SiteEvaluation
                initialLocationId={navParams?.locationId}
                initialTerrainId={navParams?.terrainId}
                initialExperimentId={navParams?.experimentId}
                onNavigate={handleNavigate}
              />
            </ErrorBoundary>
          }
        />

        {/* 4. Research Hub */}
        <Route
          path="/research"
          element={
            <ErrorBoundary title="Research Hub Telemetry Anomaly">
              <ResearchHub
                initialSubview={navParams?.subview || 'experiments'}
                onNavigate={handleNavigate}
              />
            </ErrorBoundary>
          }
        />

        {/* 5. Public Discovery */}
        <Route
          path="/discovery"
          element={
            <ErrorBoundary title="Public Discovery Archive Anomaly">
              <PublicDiscovery
                onNavigate={handleNavigate}
              />
            </ErrorBoundary>
          }
        />

        {/* Legacy route redirects */}
        <Route path="/location-explorer" element={<Navigate to="/locations" replace />} />
        <Route path="/location-explore" element={<Navigate to="/locations" replace />} />
        <Route path="/site-evaluation" element={<Navigate to="/assessment" replace />} />
        <Route path="/planetary-comparison" element={<Navigate to="/assessment" replace />} />
        <Route path="/research-hub" element={<Navigate to="/research" replace />} />
        <Route path="/experiment-database" element={<Navigate to="/research" replace />} />
        <Route path="/research-records" element={<Navigate to="/research" replace />} />
        <Route path="/researcher-portal" element={<Navigate to="/research" replace />} />
        <Route path="/public-discovery" element={<Navigate to="/discovery" replace />} />

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

function AppRouterWrapper({ children }) {
  const inRouter = useInRouterContext()
  if (inRouter) {
    return children
  }

  const hasHistory =
    typeof window !== 'undefined' &&
    window.history &&
    typeof window.history.pushState === 'function'

  const RouterComponent = hasHistory ? BrowserRouter : MemoryRouter
  return <RouterComponent>{children}</RouterComponent>
}

export default function App() {
  return (
    <AppRouterWrapper>
      <AppContent />
    </AppRouterWrapper>
  )
}
