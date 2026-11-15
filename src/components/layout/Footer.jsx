import { Link } from 'react-router-dom'

export default function Footer({ onNavigate, isHome = false }) {
  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Sophisticated editorial landing footer for Home page
  if (isHome) {
    return (
      <footer className="aerospace-landing-footer" aria-label="AEROKRYPT Landing Footer">
        <div className="landing-footer-container">
          <div className="landing-footer-top">
            <div className="landing-footer-brand-col">
              <div className="landing-footer-brand-header">
                <span className="landing-footer-brand">AEROKRYPT</span>
                <span className="landing-footer-tagline">Explore. Simulate. Discover.</span>
              </div>
              <p className="landing-footer-desc">
                A unified planetary exploration platform for studying Mars and Moon environments,
                evaluating Earth analogue proving grounds, and advancing scientific research.
              </p>
              <div className="landing-footer-telemetry font-mono">
                <span className="telemetry-dot" />
                <span>PLANETARY EXPLORATION CONSORTIUM // 2026</span>
              </div>
            </div>

            <div className="landing-footer-nav-col">
              <h4 className="landing-footer-heading font-mono">// PLATFORM NAVIGATION</h4>
              <ul className="landing-footer-links-list">
                <li>
                  <Link to="/" onClick={() => handleNavClick('dashboard')} className="landing-footer-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/locations" onClick={() => handleNavClick('location-explorer')} className="landing-footer-link">
                    Location Explore
                  </Link>
                </li>
                <li>
                  <Link to="/assessment" onClick={() => handleNavClick('site-evaluation')} className="landing-footer-link">
                    Analogue Site Assessment
                  </Link>
                </li>
                <li>
                  <Link to="/research" onClick={() => handleNavClick('research-hub')} className="landing-footer-link">
                    Research Hub
                  </Link>
                </li>
                <li>
                  <Link to="/discovery" onClick={() => handleNavClick('public-discovery')} className="landing-footer-link">
                    Public Discovery
                  </Link>
                </li>
              </ul>
            </div>

            <div className="landing-footer-repo-col">
              <h4 className="landing-footer-heading font-mono">// DATA REPOSITORIES</h4>
              <ul className="landing-footer-links-list">
                <li>
                  <a href="https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/" target="_blank" rel="noreferrer" className="landing-footer-link">
                    NASA Mars MOLA MEGDR
                  </a>
                </li>
                <li>
                  <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer" className="landing-footer-link">
                    NASA LRO WAC Global Mosaic
                  </a>
                </li>
                <li>
                  <a href="https://www.usgs.gov/3d-elevation-program" target="_blank" rel="noreferrer" className="landing-footer-link">
                    USGS 3D Elevation Program
                  </a>
                </li>
                <li>
                  <a href="https://archives.esac.esa.int/psa/" target="_blank" rel="noreferrer" className="landing-footer-link">
                    ESA Planetary Science Archive
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <div className="minimal-footer-links font-mono">
              <span className="minimal-footer-item">Contact Us</span>
              <span className="minimal-footer-item">Privacy Policy</span>
              <span className="minimal-footer-item">Media</span>
            </div>
            <div className="minimal-footer-copy font-mono">
              &copy; 2026 AEROKRYPT. All rights reserved.
            </div>
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
