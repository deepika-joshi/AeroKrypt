export default function Footer({ onNavigate }) {
  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="aerospace-footer">
      <div className="footer-container">
        {/* Top Grid */}
        <div className="footer-top-grid">
          {/* Brand & Mission Statement */}
          <div className="footer-col-brand">
            <div className="footer-brand-title">AEROKRYPT</div>
            <p className="footer-tagline">
              Planetary Analogue Research &amp; Comparative Site Evaluation Architecture.
              Validating off-world surface operations through audited terrestrial geodesy,
              in-situ mineralogy, and NASA/ESA orbital topography.
            </p>
            <div className="footer-telemetry font-mono">
              <span className="telemetry-dot" />
              <span>STATION: GLOBAL MISSION ARCHIVE // V2.0</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading font-mono">// PLATFORM MODULES</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => handleNavClick('dashboard')} className="footer-link">
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNavClick('location-explorer')} className="footer-link">
                  Location Explore &amp; Map
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNavClick('site-evaluation')} className="footer-link">
                  Site Evaluation &amp; Comparison
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNavClick('research-hub')} className="footer-link">
                  Research Hub &amp; Records
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNavClick('public-discovery')} className="footer-link">
                  Public Discovery &amp; Education
                </button>
              </li>
            </ul>
          </div>

          {/* Planetary Targets & Standards */}
          <div className="footer-col">
            <h4 className="footer-heading font-mono">// DATA REPOSITORIES</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/" target="_blank" rel="noreferrer" className="footer-link">
                  NASA Mars MOLA MEGDR
                </a>
              </li>
              <li>
                <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer" className="footer-link">
                  NASA LRO WAC Global Mosaic
                </a>
              </li>
              <li>
                <a href="https://www.usgs.gov/3d-elevation-program" target="_blank" rel="noreferrer" className="footer-link">
                  USGS 3D Elevation Program (3DEP)
                </a>
              </li>
              <li>
                <a href="https://archives.esac.esa.int/psa/" target="_blank" rel="noreferrer" className="footer-link">
                  ESA Planetary Science Archive
                </a>
              </li>
              <li>
                <a href="https://spacedata.copernicus.eu/" target="_blank" rel="noreferrer" className="footer-link">
                  Copernicus GLO-30 DEM
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specifications */}
          <div className="footer-col">
            <h4 className="footer-heading font-mono">// SCIENTIFIC INTEGRITY</h4>
            <p className="footer-spec-text">
              Zero simulated sensor measurements. Dual assessment splits geological similarity from vehicle operational suitability.
              Planetary elevation datums strictly separated (MOLA Areoid vs Mean Lunar Sphere vs WGS 84).
            </p>
            <div className="footer-spec-badge font-mono">
              <span>PEER-REVIEWED DOI REGISTRY</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="footer-bottom-bar font-mono">
          <div className="footer-copy">
            &copy; 2026 AEROKRYPT &bull; ADVANCED PLANETARY RESEARCH CONSORTIUM. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-subtext">
            INSPIRED BY AEROSPACE EXPLORATION ARCHITECTURES &bull; NOT AFFILIATED WITH SPACEX
          </div>
        </div>
      </div>
    </footer>
  )
}
