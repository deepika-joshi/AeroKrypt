import { useState } from 'react'
import { NAVIGATION_ITEMS } from '../../data/navigation.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function AppLayout({ children }) {
  const [activeNavId, setActiveNavId] = useState('dashboard')
  const [navigationParams, setNavigationParams] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNavigate = (navId, params = null) => {
    setActiveNavId(navId)
    setNavigationParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeNav =
    NAVIGATION_ITEMS.find((item) => item.id === activeNavId) || NAVIGATION_ITEMS[0]

  // Map section index for aerospace numbering
  const sectionIndices = {
    'dashboard': '01',
    'location-explorer': '02',
    'location-explore': '02',
    'site-evaluation': '03',
    'planetary-comparison': '03',
    'research-hub': '04',
    'experiment-database': '04',
    'research-records': '04',
    'researcher-portal': '04',
    'public-discovery': '05',
  }

  const sectionIndex = sectionIndices[activeNavId] || '01'

  return (
    <div className="app-shell aerospace-grid-bg">
      {/* 1. SpaceX-Inspired Sticky Top Horizontal Navigation */}
      <Navbar
        activeNavId={activeNavId}
        onNavigate={(id) => handleNavigate(id, null)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Viewport (Full-Width, No Sidebar) */}
      <div className="app-main">
        <main className={activeNavId === 'dashboard' ? 'content-dashboard-shell' : 'content-viewport'} id="main-content">
          {/* Sleek Aerospace Header on Inner Subsystems (Not on Dashboard hero) */}
          {activeNavId !== 'dashboard' && (
            <header className="view-header">
              <div className="view-header-top">
                <div className="view-title-group">
                  <span className="view-index-tag font-mono">
                    {sectionIndex} // {activeNav.section || 'MISSION SUBSYSTEM'}
                  </span>
                  <h1 className="view-title">{activeNav.label}</h1>
                </div>
                <div className="view-badges">
                  <span className="badge-source font-mono">
                    NASA PDS4 &amp; USGS 3DEP
                  </span>
                  <span className="badge-sample font-mono">
                    VERIFIED EVIDENCE ENGINE
                  </span>
                </div>
              </div>
              <p className="view-description">{activeNav.description}</p>
            </header>
          )}

          {/* View Render */}
          {children ? (
            children({
              activeNav,
              searchQuery,
              onNavigate: handleNavigate,
              navigationParams,
              onClearNavigationParams: () => setNavigationParams(null),
            })
          ) : null}
        </main>

        {/* 3. Aerospace Platform Footer */}
        <Footer onNavigate={(id) => handleNavigate(id, null)} />
      </div>
    </div>
  )
}
