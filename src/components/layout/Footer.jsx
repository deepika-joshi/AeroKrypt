import { Link } from 'react-router-dom'

export default function Footer({ onNavigate, isHome = false }) {
  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Exact minimal footer for Home page
  if (isHome) {
    return (
      <footer className="aerospace-minimal-footer" aria-label="AEROKRYPT Minimal Footer">
        <div className="minimal-footer-container">
          <div className="minimal-footer-links font-mono">
            <span className="minimal-footer-item">Contact Us</span>
            <span className="minimal-footer-item">Privacy Policy</span>
            <span className="minimal-footer-item">Media</span>
          </div>
          <div className="minimal-footer-copy font-mono">
            &copy; 2026 AEROKRYPT. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }

  // Detailed repository footer for inner platform subsystems
  return (
    <footer className="aerospace-footer">
      <div className="footer-container">
        {/* Top Grid */}
        <div className="footer-top-grid">
          {/* Brand & Mission Statement */}
          <div className="footer-col-brand">
            <div className="footer-brand-title">AEROKRYPT</div>
            <p className="footer-tagline">
              Evaluate Earth sites for Mars and Moon research using real terrain data, geological evidence and documented field studies.
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
                <Link to="/" onClick={() => handleNavClick('dashboard')} className="footer-link">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/locations" onClick={() => handleNavClick('location-explorer')} className="footer-link">
                  Location Explore &amp; Map
                </Link>
              </li>
              <li>
                <Link to="/assessment" onClick={() => handleNavClick('site-evaluation')} className="footer-link">
                  Analogue Site Assessment
                </Link>
              </li>
              <li>
                <Link to="/research" onClick={() => handleNavClick('research-hub')} className="footer-link">
                  Research Hub &amp; Records
                </Link>
              </li>
              <li>
                <Link to="/discovery" onClick={() => handleNavClick('public-discovery')} className="footer-link">
                  Public Discovery &amp; Education
                </Link>
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
