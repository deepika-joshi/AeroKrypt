import React, { useState, useEffect } from 'react';

/**
 * SpaceXLanding Component
 * 
 * An Earth Analog Mission platform landing experience for AstroKrypt,
 * built strictly in the minimalist, cinematic design language of SpaceX.
 * 
 * Features:
 * - 100% self-contained standard CSS directly in this file (no Tailwind or external CSS needed)
 * - Pure all-black (#000000) backdrop with high-contrast crisp white sans-serif typography
 * - Massive cinematic full-viewport background images with atmospheric gradients
 * - Lower-left anchored typography and iconic SpaceX-style interactive hover buttons
 * - SpaceX top navigation bar with hamburger slide-out drawer
 * - Interactive 'Explore Sites' modal and smooth scroll navigation
 */

export default function SpaceXLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSitesModalOpen, setIsSitesModalOpen] = useState(false);
  const [activeSite, setActiveSite] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for subtle navbar backdrop enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Analog mission sites data for AstroKrypt
  const analogSites = [
    {
      id: 'atacama',
      name: 'ATACAMA BASIN PROVING GROUND',
      tag: 'MARS HYPER-ARID REGOLITH ANALOG',
      location: 'Antofagasta Region, Chile // 24°04′S, 69°59′W',
      elevation: '960 m a.s.l.',
      targetBody: 'MARS',
      tempRange: '-2.0°C to +38.5°C',
      description: 'The driest non-polar desert on Earth. Hyper-arid nitrate-chloride playa used for testing deep astrobiological drill systems, autonomous rover navigation, and extreme desiccated regolith operations.',
      bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2400&q=85'
    },
    {
      id: 'haughton',
      name: 'HAUGHTON IMPACT CRATER',
      tag: 'HIGH-ARCTIC LUNAR & MARS PROVING GROUND',
      location: 'Devon Island, Nunavut, Canada // 75°22′N, 89°41′W',
      elevation: '210 m a.s.l.',
      targetBody: 'MOON & MARS',
      tempRange: '-45.0°C to +12.0°C',
      description: 'A 23-km diameter impact structure situated in the polar desert of Devon Island. Characterized by shatter cones, impact melt breccias, and perennial permafrost that simulate lunar and martian impact terrains.',
      bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85'
    },
    {
      id: 'kilauea',
      name: 'MAUNA LOA & KĪLAUEA LAVA TUBES',
      tag: 'SUB-SURFACE BASALTIC HABITAT PROVING GROUND',
      location: 'Hawaii, USA // 19°25′N, 155°17′W',
      elevation: '2,480 m a.s.l.',
      targetBody: 'MOON & MARS',
      tempRange: '+4.0°C to +24.0°C',
      description: 'Expansive basaltic volcanic flows and pyrodactyle lava tubes. Serves as the prime proving ground for subterranean planetary shelter construction, lunar seal integrity, and long-duration crew isolation.',
      bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=85'
    },
    {
      id: 'mcmurdo',
      name: 'MCMURDO DRY VALLEYS',
      tag: 'COLD HYPER-ARID CRYOSPHERE ANALOG',
      location: 'Victoria Land, Antarctica // 77°30′S, 162°00′E',
      elevation: '1,400 m a.s.l.',
      targetBody: 'MARS POLAR',
      tempRange: '-58.0°C to -10.0°C',
      description: 'The coldest, driest region on Earth with no snow cover. Features ancient subsurface permafrost ice-cemented soils, validating life-detection sensors for future Mars polar landers.',
      bgImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2400&q=85'
    }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openSiteDetails = (site) => {
    setActiveSite(site);
    setIsSitesModalOpen(true);
  };

  return (
    <div className="spacex-landing">
      {/* =========================================================================
          EMBEDDED STYLES: Standard CSS, zero external dependencies
          ========================================================================= */}
      <style>{`
        /* Reset and Base Theme */
        .spacex-landing {
          margin: 0;
          padding: 0;
          background-color: #000000;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          letter-spacing: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          width: 100%;
          min-height: 100vh;
        }

        .spacex-landing * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* -------------------------------------------------------------------------
           NAVBAR
           ------------------------------------------------------------------------- */
        .spacex-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          z-index: 1000;
          transition: background-color 0.4s ease, backdrop-filter 0.4s ease;
        }

        .spacex-header.scrolled {
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .spacex-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
        }

        .spacex-logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #ffffff;
          text-transform: uppercase;
        }

        .spacex-logo-sub {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          padding-left: 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.3);
        }

        .spacex-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }

        .spacex-nav-links a {
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 4px;
          transition: opacity 0.2s ease;
        }

        .spacex-nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: #ffffff;
          transition: width 0.3s ease;
        }

        .spacex-nav-links a:hover::after {
          width: 100%;
        }

        .spacex-menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 12px;
          transition: opacity 0.2s ease;
        }

        .spacex-menu-btn:hover {
          opacity: 0.7;
        }

        .spacex-hamburger-icon {
          width: 18px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .spacex-hamburger-icon span {
          display: block;
          width: 100%;
          height: 2px;
          background-color: #ffffff;
          transition: transform 0.3s ease;
        }

        /* -------------------------------------------------------------------------
           HERO & CINEMATIC SECTIONS
           ------------------------------------------------------------------------- */
        .spacex-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: flex-end;
          padding: 0 0 110px 80px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Hero Image specifically with deep space & planetary analog atmosphere */
        .spacex-hero-section {
  background-image: 
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.9) 100%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 90, 30, 0.15) 0%, transparent 60%),
    url('/analog-bg.jpg');
  background-color: #050505;
}

        .spacex-section-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.88) 100%);
          pointer-events: none;
        }

        .spacex-content-box {
          position: relative;
          z-index: 10;
          max-width: 820px;
        }

        .spacex-eyebrow {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .spacex-eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background-color: #ffffff;
        }

        .spacex-headline {
          font-size: clamp(34px, 5.2vw, 56px);
          font-weight: 800;
          line-height: 1.08;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ffffff;
          margin-bottom: 24px;
        }

        .spacex-subtext {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.75);
          max-width: 600px;
          margin-bottom: 32px;
          letter-spacing: 0.5px;
        }

        /* -------------------------------------------------------------------------
           SPACEX SIGNATURE BUTTON
           Rectangular, crisp white 2px border, slide-up hover fill
           ------------------------------------------------------------------------- */
        .spacex-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 42px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #ffffff;
          background: transparent;
          border: 2px solid #ffffff;
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          transition: color 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 1;
        }

        .spacex-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: -1;
        }

        .spacex-btn:hover {
          color: #000000;
        }

        .spacex-btn:hover::before {
          transform: translateY(0%);
        }

        .spacex-btn-secondary {
          margin-left: 18px;
          border-color: rgba(255, 255, 255, 0.4);
          color: rgba(255, 255, 255, 0.9);
        }

        .spacex-btn-secondary::before {
          background-color: rgba(255, 255, 255, 0.9);
        }

        /* -------------------------------------------------------------------------
           SCROLL DOWN ARROW INDICATOR
           ------------------------------------------------------------------------- */
        .spacex-scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          z-index: 10;
          color: #ffffff;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .spacex-scroll-indicator:hover {
          opacity: 1;
        }

        .spacex-chevron {
          width: 20px;
          height: 20px;
          border-left: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
          transform: rotate(-45deg);
          animation: spacexBounce 2s infinite ease-in-out;
        }

        @keyframes spacexBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) rotate(-45deg);
          }
          40% {
            transform: translateY(8px) rotate(-45deg);
          }
          60% {
            transform: translateY(4px) rotate(-45deg);
          }
        }

        /* -------------------------------------------------------------------------
           DRAWER MENU (Right slide-in)
           ------------------------------------------------------------------------- */
        .spacex-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .spacex-drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .spacex-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          max-width: 90vw;
          height: 100%;
          background-color: #000000;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 2100;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          padding: 40px 48px;
        }

        .spacex-drawer.open {
          transform: translateX(0);
        }

        .spacex-drawer-close {
          align-self: flex-end;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 28px;
          cursor: pointer;
          padding: 8px;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        .spacex-drawer-close:hover {
          transform: scale(1.15);
        }

        .spacex-drawer-links {
          margin-top: 40px;
          list-style: none;
          display: flex;
          flex-direction: column;
        }

        .spacex-drawer-links li {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .spacex-drawer-links button,
        .spacex-drawer-links a {
          display: block;
          width: 100%;
          text-align: right;
          padding: 18px 0;
          color: #ffffff;
          background: none;
          border: none;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .spacex-drawer-links button:hover,
        .spacex-drawer-links a:hover {
          opacity: 0.6;
          transform: translateX(-4px);
        }

        .spacex-drawer-footer {
          margin-top: auto;
          text-align: right;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1.5px;
          line-height: 1.8;
          text-transform: uppercase;
        }

        /* -------------------------------------------------------------------------
           MODAL: EXPLORE SITES DETAILS
           ------------------------------------------------------------------------- */
        .spacex-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .spacex-modal {
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 860px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 48px;
        }

        .spacex-modal-close {
          position: absolute;
          top: 24px;
          right: 28px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 26px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .spacex-modal-close:hover {
          opacity: 0.6;
        }

        .spacex-modal-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .spacex-modal-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .spacex-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin: 28px 0;
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .spacex-spec-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .spacex-spec-label {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .spacex-spec-value {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #ffffff;
        }

        .spacex-modal-desc {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 32px;
        }

        /* -------------------------------------------------------------------------
           FOOTER (SpaceX Minimalist Strip)
           ------------------------------------------------------------------------- */
        .spacex-footer {
          background-color: #000000;
          padding: 40px 48px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .spacex-footer-copy {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.45);
          text-transform: uppercase;
        }

        .spacex-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          list-style: none;
        }

        .spacex-footer-links a {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .spacex-footer-links a:hover {
          color: #ffffff;
        }

        /* -------------------------------------------------------------------------
           RESPONSIVE ADJUSTMENTS
           ------------------------------------------------------------------------- */
        @media (max-width: 900px) {
          .spacex-header {
            padding: 0 24px;
          }
          .spacex-nav-links {
            display: none;
          }
          .spacex-section {
            padding: 0 24px 80px 24px;
          }
          .spacex-headline {
            font-size: 32px;
          }
          .spacex-btn {
            width: 100%;
            padding: 16px 20px;
          }
          .spacex-btn-secondary {
            margin-left: 0;
            margin-top: 12px;
          }
          .spacex-footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>

      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className={`spacex-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="spacex-logo-container" onClick={() => scrollToSection('hero')}>
          <span className="spacex-logo-text">ASTROKRYPT</span>
          <span className="spacex-logo-sub">ANALOG MISSIONS</span>
        </div>

        <nav>
          <ul className="spacex-nav-links">
            <li>
              <a href="#atacama" onClick={(e) => { e.preventDefault(); scrollToSection('atacama'); }}>
                ATACAMA
              </a>
            </li>
            <li>
              <a href="#haughton" onClick={(e) => { e.preventDefault(); scrollToSection('haughton'); }}>
                HAUGHTON CRATER
              </a>
            </li>
            <li>
              <a href="#kilauea" onClick={(e) => { e.preventDefault(); scrollToSection('kilauea'); }}>
                MAUNA LOA
              </a>
            </li>
            <li>
              <a href="#mcmurdo" onClick={(e) => { e.preventDefault(); scrollToSection('mcmurdo'); }}>
                MCMURDO VALLEYS
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); openSiteDetails(analogSites[0]); }}>
                SPECS
              </a>
            </li>
          </ul>
        </nav>

        <button 
          className="spacex-menu-btn" 
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <span>MENU</span>
          <div className="spacex-hamburger-icon">
            <span />
            <span />
            <span />
          </div>
        </button>
      </header>

      {/* =========================================================================
          SLIDE-OUT MENU DRAWER
          ========================================================================= */}
      <div 
        className={`spacex-drawer-backdrop ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside className={`spacex-drawer ${isMenuOpen ? 'open' : ''}`}>
        <button 
          className="spacex-drawer-close" 
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close Menu"
        >
          ✕
        </button>
        <ul className="spacex-drawer-links">
          <li>
            <button onClick={() => scrollToSection('hero')}>MISSION OVERVIEW</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('atacama')}>ATACAMA REGOLITH PROVING GROUND</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('haughton')}>HAUGHTON IMPACT CRATER</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('kilauea')}>MAUNA LOA LAVA TUBES</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('mcmurdo')}>MCMURDO CRYOSPHERE VALLEYS</button>
          </li>
          <li>
            <button onClick={() => { setIsMenuOpen(false); openSiteDetails(analogSites[0]); }}>
              DETAILED TELEMETRY & SPECS
            </button>
          </li>
        </ul>
        <div className="spacex-drawer-footer">
          ASTROKRYPT FLIGHT DIRECTORY<br />
          AUTONOMOUS PLANETARY PROVING SYSTEM<br />
          VERIFIED AUDITED DATASET
        </div>
      </aside>

      {/* =========================================================================
          HERO SECTION: Massive Cinematic Area, Headline, and 'Explore Sites' Button
          ========================================================================= */}
      <section id="hero" className="spacex-section spacex-hero-section">
        <div className="spacex-section-overlay" />
        
        <div className="spacex-content-box">
          <div className="spacex-eyebrow">
            PLANETARY SURFACE SIMULATION // ACTIVE EXPEDITION
          </div>
          
          <h1 className="spacex-headline">
            ASTROKRYPT: EARTH AS A PROVING GROUND
          </h1>

          <p className="spacex-subtext">
            Validating deep space surface operations, life-support hardware, and autonomous 
            robotic systems across Earth's most severe planetary analogs before lunar and martian departure.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button 
              className="spacex-btn" 
              onClick={() => scrollToSection('atacama')}
            >
              Explore Sites
            </button>
            <button 
              className="spacex-btn spacex-btn-secondary" 
              onClick={() => openSiteDetails(analogSites[0])}
            >
              Mission Specs
            </button>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div 
          className="spacex-scroll-indicator" 
          onClick={() => scrollToSection('atacama')}
          title="Scroll to Explore"
        >
          <div className="spacex-chevron" />
        </div>
      </section>

      {/* =========================================================================
          CINEMATIC SECTION 2: ATACAMA BASIN
          ========================================================================= */}
      <section 
        id="atacama" 
        className="spacex-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.92) 100%), url('${analogSites[0].bgImage}')`
        }}
      >
        <div className="spacex-section-overlay" />
        <div className="spacex-content-box">
          <div className="spacex-eyebrow">{analogSites[0].tag}</div>
          <h2 className="spacex-headline">{analogSites[0].name}</h2>
          <p className="spacex-subtext">{analogSites[0].description}</p>
          <button 
            className="spacex-btn"
            onClick={() => openSiteDetails(analogSites[0])}
          >
            Explore Site Specs
          </button>
        </div>
      </section>

      {/* =========================================================================
          CINEMATIC SECTION 3: HAUGHTON IMPACT CRATER
          ========================================================================= */}
      <section 
        id="haughton" 
        className="spacex-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.92) 100%), url('${analogSites[1].bgImage}')`
        }}
      >
        <div className="spacex-section-overlay" />
        <div className="spacex-content-box">
          <div className="spacex-eyebrow">{analogSites[1].tag}</div>
          <h2 className="spacex-headline">{analogSites[1].name}</h2>
          <p className="spacex-subtext">{analogSites[1].description}</p>
          <button 
            className="spacex-btn"
            onClick={() => openSiteDetails(analogSites[1])}
          >
            Explore Site Specs
          </button>
        </div>
      </section>

      {/* =========================================================================
          CINEMATIC SECTION 4: MAUNA LOA & KĪLAUEA LAVA TUBES
          ========================================================================= */}
      <section 
        id="kilauea" 
        className="spacex-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.92) 100%), url('${analogSites[2].bgImage}')`
        }}
      >
        <div className="spacex-section-overlay" />
        <div className="spacex-content-box">
          <div className="spacex-eyebrow">{analogSites[2].tag}</div>
          <h2 className="spacex-headline">{analogSites[2].name}</h2>
          <p className="spacex-subtext">{analogSites[2].description}</p>
          <button 
            className="spacex-btn"
            onClick={() => openSiteDetails(analogSites[2])}
          >
            Explore Site Specs
          </button>
        </div>
      </section>

      {/* =========================================================================
          CINEMATIC SECTION 5: MCMURDO DRY VALLEYS
          ========================================================================= */}
      <section 
        id="mcmurdo" 
        className="spacex-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.92) 100%), url('${analogSites[3].bgImage}')`
        }}
      >
        <div className="spacex-section-overlay" />
        <div className="spacex-content-box">
          <div className="spacex-eyebrow">{analogSites[3].tag}</div>
          <h2 className="spacex-headline">{analogSites[3].name}</h2>
          <p className="spacex-subtext">{analogSites[3].description}</p>
          <button 
            className="spacex-btn"
            onClick={() => openSiteDetails(analogSites[3])}
          >
            Explore Site Specs
          </button>
        </div>
      </section>

      {/* =========================================================================
          EXPLORE SITE SPECS MODAL
          ========================================================================= */}
      {isSitesModalOpen && activeSite && (
        <div 
          className="spacex-modal-backdrop"
          onClick={() => setIsSitesModalOpen(false)}
        >
          <div 
            className="spacex-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="spacex-modal-close" 
              onClick={() => setIsSitesModalOpen(false)}
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className="spacex-modal-tag">{activeSite.tag}</div>
            <h3 className="spacex-modal-title">{activeSite.name}</h3>

            <div className="spacex-specs-grid">
              <div className="spacex-spec-item">
                <span className="spacex-spec-label">Target Body</span>
                <span className="spacex-spec-value">{activeSite.targetBody}</span>
              </div>
              <div className="spacex-spec-item">
                <span className="spacex-spec-label">Coordinates</span>
                <span className="spacex-spec-value">{activeSite.location}</span>
              </div>
              <div className="spacex-spec-item">
                <span className="spacex-spec-label">Elevation</span>
                <span className="spacex-spec-value">{activeSite.elevation}</span>
              </div>
              <div className="spacex-spec-item">
                <span className="spacex-spec-label">Surface Temperature</span>
                <span className="spacex-spec-value">{activeSite.tempRange}</span>
              </div>
            </div>

            <p className="spacex-modal-desc">{activeSite.description}</p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="spacex-btn"
                onClick={() => {
                  setIsSitesModalOpen(false);
                  scrollToSection(activeSite.id);
                }}
              >
                Go to Section
              </button>
              <button 
                className="spacex-btn spacex-btn-secondary"
                onClick={() => setIsSitesModalOpen(false)}
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SPACEX MINIMALIST FOOTER
          ========================================================================= */}
      <footer className="spacex-footer">
        <span className="spacex-footer-copy">ASTROKRYPT © 2026</span>
        <ul className="spacex-footer-links">
          <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>OVERVIEW</a></li>
          <li><a href="#privacy" onClick={(e) => e.preventDefault()}>PRIVACY POLICY</a></li>
          <li><a href="#protocols" onClick={(e) => e.preventDefault()}>MISSION PROTOCOLS</a></li>
          <li><a href="#atlas" onClick={(e) => e.preventDefault()}>ANALOG ATLAS</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noreferrer">TWITTER / X</a></li>
          <li><a href="https://youtube.com" target="_blank" rel="noreferrer">YOUTUBE</a></li>
        </ul>
      </footer>
    </div>
  );
}
