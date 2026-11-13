export default function Topbar({
  activeNav,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
}) {
  return (
    <header className="topbar">
      {/* Left side: Mobile Toggle & Breadcrumb */}
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <nav className="breadcrumb-trail" aria-label="Breadcrumb">
          <span className="breadcrumb-root">TERRALAB</span>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb-active">{activeNav?.label || 'Dashboard'}</span>
        </nav>
      </div>

      {/* Center: Search input for analogue sites, publications & records */}
      <div className="topbar-center">
        <div className="search-container">
          <span className="search-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search analogue sites, experiments, publications..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search research platform"
          />
        </div>
      </div>

      {/* Right side: Data Gateway status & Institutional Access Chip */}
      <div className="topbar-right">
        {/* Dataset Integration indicator with explicit Sample Data labeling */}
        <div
          className="dataset-status-pill"
          title="Data architecture ready for NASA PDS / USGS Earth Analogue data integration"
        >
          <span className="status-dot" aria-hidden="true"></span>
          <span className="dataset-pill-label">PDS / USGS Gateway</span>
          <span className="dataset-pill-tag">Sample Mode</span>
        </div>

        {/* Institutional Research Portal Access (No fictional identities) */}
        <div
          className="researcher-chip"
          role="button"
          tabIndex={0}
          aria-label="Institutional portal access: Analogue Research Workspace"
        >
          <div className="researcher-avatar" aria-hidden="true">
            TL
          </div>
          <div className="researcher-meta">
            <span className="researcher-name">Research Portal</span>
            <span className="researcher-role">Analogue Workspace</span>
          </div>
        </div>
      </div>
    </header>
  )
}
