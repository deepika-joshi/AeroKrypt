import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '../../data/navigation.jsx'
import { getNavIdFromPath, getRouteForNavId } from '../../data/navigationData.js'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function AppLayout({
  children,
  activeNavId: propActiveNavId,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  onNavigate: propOnNavigate,
  navigationParams: propNavigationParams,
  onClearNavigationParams: propOnClearNavigationParams,
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery
  const onSearchChange = propOnSearchChange || setInternalSearchQuery

  const [internalParams, setInternalParams] = useState(null)
  const navigationParams = propNavigationParams !== undefined
    ? propNavigationParams
    : (location.state || internalParams)

  const handleClearNavigationParams = () => {
    if (propOnClearNavigationParams) {
      propOnClearNavigationParams()
    } else {
      setInternalParams(null)
      navigate(location.pathname, { replace: true, state: null })
    }
  }

  const handleNavigate = (target, params = null) => {
    if (propOnNavigate) {
      propOnNavigate(target, params)
    } else {
      const path = getRouteForNavId(target)
      navigate(path, { state: params })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const activeNavId = propActiveNavId || getNavIdFromPath(location.pathname)

  const activeNav =
    NAVIGATION_ITEMS.find((item) => item.id === activeNavId) || NAVIGATION_ITEMS[0]

  return (
    <div className="app-shell aerospace-grid-bg">
      {/* 1. SpaceX-Inspired Sticky Top Horizontal Navigation */}
      <Navbar
        activeNavId={activeNavId}
        onNavigate={(id) => handleNavigate(id, null)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* 2. Main Viewport (Full-Width, No Sidebar) */}
      <div className="app-main">
        <main className={activeNavId === 'dashboard' ? 'content-dashboard-shell' : 'content-viewport'} id="main-content">
          {/* View Render */}
          {typeof children === 'function' ? (
            children({
              activeNav,
              searchQuery,
              onNavigate: handleNavigate,
              navigationParams,
              onClearNavigationParams: handleClearNavigationParams,
            })
          ) : (
            children
          )}
        </main>

        {/* 3. Aerospace Platform Footer */}
        <Footer onNavigate={(id) => handleNavigate(id, null)} isHome={activeNavId === 'dashboard'} />
      </div>
    </div>
  )
}
