import { useState, useEffect } from 'react'
import { NAVIGATION_ITEMS } from '../../data/navigation.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppLayout({ children }) {
  const [activeNavId, setActiveNavId] = useState('dashboard')
  const [navigationParams, setNavigationParams] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close mobile navigation on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileNavOpen])

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileNavOpen])

  const handleNavigate = (navId, params = null) => {
    setActiveNavId(navId)
    setNavigationParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeNav =
    NAVIGATION_ITEMS.find((item) => item.id === activeNavId) || NAVIGATION_ITEMS[0]

  return (
    <div className="app-shell scientific-grid-bg">
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileNavOpen ? 'active' : ''}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeNavId={activeNavId}
        onSelectNav={(id) => handleNavigate(id, null)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Viewport */}
      <div className={`app-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar
          activeNav={activeNav}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="content-viewport" id="main-content">
          {/* Scientific View Header */}
          <header className="view-header">
            <div className="view-header-top">
              <div className="view-title-group">
                <h1 className="view-title">{activeNav.label}</h1>
                <span className="badge-source">Section: {activeNav.section}</span>
                <span className="badge-sample">Verified Module</span>
              </div>
            </div>
            <p className="view-description">{activeNav.description}</p>
            <div className="view-meta-bar">
              <span className="badge-source font-mono">
                Source Standard: NASA PDS4 &amp; USGS Geosciences
              </span>
              <span className="badge-sample">
                Verified: Non-Simulated Evidence Engine
              </span>
            </div>
          </header>

          {/* Children or View Placeholder */}
          {children ? (
            children({
              activeNav,
              searchQuery,
              onNavigate: handleNavigate,
              navigationParams,
              onClearNavigationParams: () => setNavigationParams(null),
            })
          ) : (
            <section className="view-placeholder-shell">
              <div className="placeholder-icon-wrap" aria-hidden="true">
                {activeNav.icon}
              </div>
              <h2 className="placeholder-heading">{activeNav.label} Subsystem Ready</h2>
              <p className="placeholder-summary">
                Architecture and layout foundation prepared. This view is reserved for authentic 
                analogue field datasets, comparative planetary parameters, and peer-reviewed 
                scientific records.
              </p>

              <div className="placeholder-specs">
                <div className="spec-item">
                  <div className="spec-title">Data Ingestion Standard</div>
                  <div className="spec-desc">
                    NASA Planetary Data System (PDS4) XML/Label specifications and USGS Earth Resources Observation standards.
                  </div>
                </div>
                <div className="spec-item">
                  <div className="spec-title">Analogue Verification</div>
                  <div className="spec-desc">
                    Terrestrial baseline fidelity scoring across mineralogy, geomorphology, and environmental parameters.
                  </div>
                </div>
                <div className="spec-item">
                  <div className="spec-title">Scientific Attribution</div>
                  <div className="spec-desc">
                    Explicit publication provenance with DOI indexing and traceable sample registry metadata.
                  </div>
                </div>
              </div>

              {activeNavId !== 'dashboard' && (
                <button
                  type="button"
                  className="section-action-btn"
                  style={{ marginTop: '16px' }}
                  onClick={() => handleNavigate('dashboard', null)}
                >
                  &larr; Return to Dashboard Overview
                </button>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
