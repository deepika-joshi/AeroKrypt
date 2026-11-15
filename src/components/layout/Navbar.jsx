import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAVIGATION_SECTIONS } from '../../data/navigationData.js'
import { getUpcomingEvents } from '../../data/eventsData.js'

export default function Navbar({ activeNavId, onNavigate, searchQuery, onSearchChange }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const upcomingEvents = getUpcomingEvents()
  const dropdownEvents = upcomingEvents.slice(0, 2)
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

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsEventsDropdownOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsEventsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleScrollToEvents = () => {
    setIsEventsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    const target = document.getElementById('upcoming-events')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      if (onNavigate) {
        onNavigate('dashboard')
      }
      setTimeout(() => {
        const el = document.getElementById('upcoming-events')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }

  return (
    <header className={`aerospace-navbar ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* 1. AEROKRYPT Brand Wordmark & Aerospace Icon */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => {
            setIsMobileMenuOpen(false)
            if (onNavigate) onNavigate('dashboard')
          }}
          aria-label="AEROKRYPT Homepage"
        >
          <div className="brand-glyph" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00d2ff" strokeWidth="1.2" transform="rotate(-25 12 12)" />
              <circle cx="12" cy="12" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div className="brand-title-group">
            <span className="brand-title-text">AEROKRYPT</span>
            <span className="brand-subtitle-tag font-mono">PLANETARY EXPLORATION</span>
          </div>
        </Link>

        {/* 2. Top Horizontal Primary Navigation (Order: Brand, Home, Locations, Assessment, Hub, Discovery, Upcoming Events) */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          {NAVIGATION_SECTIONS.map((item) => {
            const isItemActive = (isActive) => {
              return Boolean(
                isActive ||
                activeNavId === item.id ||
                (item.id === 'site-evaluation' && activeNavId === 'planetary-comparison') ||
                (item.id === 'research-hub' && (activeNavId === 'experiment-database' || activeNavId === 'research-records' || activeNavId === 'researcher-portal')) ||
                (item.id === 'location-explorer' && activeNavId === 'location-explore')
              )
            }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-link-item ${isItemActive(isActive) ? 'active' : ''}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  if (onNavigate) onNavigate(item.id)
                }}
              >
                <span className="nav-link-text">{item.label}</span>
                <span className="nav-link-indicator" aria-hidden="true" />
              </NavLink>
            )
          })}

          {/* 7. Upcoming Events — Dropdown Menu */}
          <div
            className={`nav-dropdown-wrapper ${isEventsDropdownOpen ? 'is-open' : ''}`}
            ref={dropdownRef}
            onMouseEnter={() => setIsEventsDropdownOpen(true)}
            onMouseLeave={() => setIsEventsDropdownOpen(false)}
          >
            <button
              type="button"
              className={`nav-link-item nav-dropdown-trigger ${isEventsDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsEventsDropdownOpen((prev) => !prev)}
              aria-expanded={isEventsDropdownOpen}
              aria-haspopup="true"
              aria-label="Upcoming Events menu"
            >
              <span className="nav-link-text">Upcoming Events</span>
              <svg
                className={`dropdown-chevron ${isEventsDropdownOpen ? 'rotated' : ''}`}
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span className="nav-link-indicator" aria-hidden="true" />
            </button>

            {/* Dropdown Menu Overlay */}
            <div className="nav-dropdown-menu" role="menu" aria-label="Upcoming Events Dropdown">
              <div className="dropdown-menu-header font-mono">
                <span className="dropdown-tag">// PLANETARY EVENTS</span>
                <span className="dropdown-counter font-mono">{`${upcomingEvents.length} EVENTS`}</span>
              </div>

              {dropdownEvents.length > 0 ? (
                <div className="dropdown-events-list">
                  {dropdownEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="dropdown-event-card"
                      role="menuitem"
                      tabIndex={0}
                      onClick={handleScrollToEvents}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleScrollToEvents()
                        }
                      }}
                    >
                      <div className="dropdown-event-eyebrow font-mono">
                        <span className="dropdown-event-idx">{`FEATURED 0${idx + 1}`}</span>
                        <span className="dropdown-event-cat">{event.category || 'EVENT'}</span>
                      </div>
                      <h4 className="dropdown-event-title">{event.title}</h4>
                      <div className="dropdown-event-details font-mono">
                        <span>{event.date}</span>
                        <span>&bull;</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dropdown-empty-state">
                  <div className="dropdown-empty-row">
                    <span className="dropdown-empty-dot" aria-hidden="true" />
                    <span className="dropdown-empty-label font-mono">FEATURED UPCOMING EVENTS 01 &bull; 02</span>
                  </div>
                  <p className="dropdown-empty-desc">
                    No verified events currently queued. Confirmed planetary science conferences and field workshops will appear once validated.
                  </p>
                </div>
              )}

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-action-btn font-mono"
                onClick={handleScrollToEvents}
                role="menuitem"
              >
                <span>View All Events</span>
                <span className="btn-arrow" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
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
            const isItemActive = (isActive) => {
              return Boolean(
                isActive ||
                activeNavId === item.id ||
                (item.id === 'site-evaluation' && activeNavId === 'planetary-comparison') ||
                (item.id === 'research-hub' && (activeNavId === 'experiment-database' || activeNavId === 'research-records' || activeNavId === 'researcher-portal')) ||
                (item.id === 'location-explorer' && activeNavId === 'location-explore')
              )
            }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `mobile-nav-item ${isItemActive(isActive) ? 'active' : ''}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  if (onNavigate) onNavigate(item.id)
                }}
              >
                <span className="mobile-nav-idx font-mono">0{idx + 1}</span>
                <div className="mobile-nav-content">
                  <span className="mobile-nav-label">{item.label}</span>
                  <span className="mobile-nav-desc">{item.description}</span>
                </div>
                <span className="mobile-nav-arrow">&rarr;</span>
              </NavLink>
            )
          })}

          {/* Mobile Upcoming Events */}
          <button
            type="button"
            className="mobile-nav-item"
            onClick={handleScrollToEvents}
          >
            <span className="mobile-nav-idx font-mono">06</span>
            <div className="mobile-nav-content">
              <span className="mobile-nav-label">Upcoming Events</span>
              <span className="mobile-nav-desc">Planetary science conferences, workshops, and opportunities</span>
            </div>
            <span className="mobile-nav-arrow">&rarr;</span>
          </button>
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
