import { useState, useEffect } from 'react'
import { NAVIGATION_SECTIONS } from '../../data/navigationData.js'

export default function Navbar({ activeNavId, onNavigate, searchQuery, onSearchChange }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Track window scroll for sticky header background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (id) => {
    onNavigate(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`aerospace-navbar ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* 1. AEROKRYPT Brand Wordmark & Aerospace Icon */}
        <div
          className="navbar-brand"
          onClick={() => handleNavClick('dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNavClick('dashboard')
            }
          }}
          aria-label="AEROKRYPT Homepage"
        >
          <div className="brand-glyph" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {/* Outer orbital trajectory */}
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Elliptical orbital path */}
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00d2ff" strokeWidth="1.2" transform="rotate(-25 12 12)" />
              {/* Planetary core */}
              <circle cx="12" cy="12" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div className="brand-title-group">
            <span className="brand-title-text">AEROKRYPT</span>
            <span className="brand-subtitle-tag font-mono">PLANETARY EXPLORATION</span>
          </div>
        </div>

        {/* 2. Top Horizontal Primary Navigation (The 5 Specified Options) */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          {NAVIGATION_SECTIONS.map((item) => {
            const isActive = activeNavId === item.id || 
              (item.id === 'site-evaluation' && activeNavId === 'planetary-comparison') ||
              (item.id === 'research-hub' && (activeNavId === 'experiment-database' || activeNavId === 'research-records' || activeNavId === 'researcher-portal')) ||
              (item.id === 'location-explorer' && activeNavId === 'location-explore')

            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-link-text">{item.label}</span>
                <span className="nav-link-indicator" aria-hidden="true" />
              </button>
            )
          })}
        </nav>

        {/* 3. Right Status & Quick Utilities */}
        <div className="navbar-utilities">
          {/* Telemetry Status Indicator */}
          <div className="telemetry-pill font-mono" title="Operational Data Standard">
            <span className="telemetry-dot" aria-hidden="true" />
            <span className="telemetry-label">CONOPS // NOMINAL</span>
          </div>

          {/* Quick Search Toggle */}
          <div className="navbar-search-wrapper">
            {isSearchOpen ? (
              <div className="navbar-search-box">
                <input
                  type="text"
                  placeholder="SEARCH SITES, CRITERIA, DOIs..."
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setIsSearchOpen(false)
                  }}
                  className="navbar-search-input font-mono"
                />
                <button
                  type="button"
                  className="search-close-btn"
                  onClick={() => {
                    if (onSearchChange) onSearchChange('')
                    setIsSearchOpen(false)
                  }}
                  aria-label="Close search"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="search-trigger-btn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search filter"
                title="Search sites and records"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={`navbar-mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="toggle-bar" />
            <span className="toggle-bar" />
            <span className="toggle-bar" />
          </button>
        </div>
      </div>

      {/* 4. Mobile Navigation Drawer */}
      <div className={`navbar-mobile-drawer ${isMobileMenuOpen ? 'is-open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title font-mono">// NAVIGATION MENU</span>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {NAVIGATION_SECTIONS.map((item, idx) => {
            const isActive = activeNavId === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="mobile-nav-idx font-mono">0{idx + 1}</span>
                <div className="mobile-nav-content">
                  <span className="mobile-nav-label">{item.label}</span>
                  <span className="mobile-nav-desc">{item.description}</span>
                </div>
                <span className="mobile-nav-arrow">&rarr;</span>
              </button>
            )
          })}
        </nav>

        <div className="mobile-drawer-footer">
          <div className="mobile-footer-pill font-mono">
            <span className="telemetry-dot" />
            <span>PDS4 &amp; USGS VERIFIED ENGINE</span>
          </div>
          <p className="mobile-footer-brand font-mono">AEROKRYPT &bull; MISSION CONOPS 2026</p>
        </div>
      </div>
    </header>
  )
}

