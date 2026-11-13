import { useId } from 'react'
import { NAVIGATION_ITEMS } from '../../data/navigation.jsx'

export default function Sidebar({
  activeNavId,
  onSelectNav,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) {
  const headingId = useId()

  const handleNavClick = (id) => {
    onSelectNav(id)
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      aria-labelledby={headingId}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-link">
          <div className="brand-logo-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"></circle>
              <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"></ellipse>
              <circle cx="12" cy="12" r="2.5" fill="currentColor"></circle>
            </svg>
          </div>
          <div className="brand-info">
            <div className="brand-name">
              TERRALAB
              <span className="brand-tag">ANALOGUE</span>
            </div>
            <div className="brand-subtitle" id={headingId}>
              Earth & Planetary Research
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav-container" aria-label="Primary Platform Navigation">
        <div className="nav-section-title">Exploration & Analysis</div>

        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeNavId === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-item-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-item-label">{item.label}</span>
              {item.id === 'dashboard' && !isCollapsed && (
                <span className="nav-item-badge">Core</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer & Data Attribution */}
      <div className="sidebar-footer">
        <div className="data-attribution-card">
          <div className="data-attribution-title">
            <span>NASA / USGS Ingress</span>
            <span className="badge-sample">Sample</span>
          </div>
          <div className="data-attribution-source">
            Planetary Data System (PDS) Analogue Gateway Architecture
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isCollapsed ? (
              <polyline points="9 18 15 12 9 6"></polyline>
            ) : (
              <polyline points="15 18 9 12 15 6"></polyline>
            )}
          </svg>
          <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  )
}
