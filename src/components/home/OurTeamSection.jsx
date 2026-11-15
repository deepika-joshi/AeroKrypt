export default function OurTeamSection() {
  const teamDivisions = [
    {
      id: 'systems-engineering',
      role: 'Platform Systems Engineering',
      focus: 'Architecture & Geospatial Infrastructure',
      description:
        'Engineers the client-side geodetic coordinate engines, responsive 3D globe representations, and standardized data ingestion pipelines connecting NASA PDS4 and USGS datums.',
      status: 'CORE ENGINEERING CONSORTIUM',
      avatarGlyph: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      id: 'planetary-science',
      role: 'Planetary Science & Geodesy Curation',
      focus: 'MOLA & LOLA Scientific Evidence Auditing',
      description:
        'Audits Mars Global Surveyor (MGS) laser altimeter and Lunar Reconnaissance Orbiter (LRO) datasets, ensuring strict separation between planetary equipotential surfaces and Earth mean sea level.',
      status: 'ACADEMIC & FIELD ADVISORY',
      avatarGlyph: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      id: 'field-operations',
      role: 'Field Operations & Analogue Registry',
      focus: '20 Curated Proving Grounds Verification',
      description:
        'Documents terrestrial analogue expeditions, cross-references peer-reviewed DOI citations, and compiles photographic evidence registries from certified planetary analogue field stations worldwide.',
      status: 'FIELD PROVING RESEARCHERS',
      avatarGlyph: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ]

  return (
    <section id="our-team" className="our-team-section reveal-on-scroll" aria-label="AeroKrypt Team and Consortium">
      <div className="team-container">
        {/* Section Header */}
        <div className="team-header-block">
          <div className="section-eyebrow font-mono">
            <span className="eyebrow-accent">//</span> COLLABORATIVE RESEARCH CONSORTIUM
          </div>
          <h2 className="team-main-heading">
            The Minds Behind <span className="serif-highlight">AeroKrypt.</span>
          </h2>
          <p className="team-subheading">
            An open interdisciplinary initiative uniting planetary scientists, geospatial engineers, and field
            researchers committed to authentic, non-simulated analogue science.
          </p>
        </div>

        {/* Team Profile Cards Grid */}
        <div className="team-cards-grid">
          {teamDivisions.map((division) => (
            <div key={division.id} className="team-profile-card">
              <div className="profile-top-row font-mono">
                <span className="profile-status-badge">{division.status}</span>
                <span className="profile-id-tag">DIV // {division.id.toUpperCase().slice(0, 4)}</span>
              </div>

              {/* Placeholder Avatar Icon */}
              <div className="profile-avatar-wrapper" aria-hidden="true">
                <div className="avatar-placeholder-ring">
                  {division.avatarGlyph}
                </div>
              </div>

              <h3 className="profile-role-title">{division.role}</h3>
              <span className="profile-focus-tag font-mono">{division.focus}</span>

              <p className="profile-description">{division.description}</p>

              <div className="profile-card-footer font-mono">
                <span className="footer-status-dot" />
                <span>CONSORTIUM ACTIVE CONTRIBUTOR</span>
              </div>
            </div>
          ))}
        </div>

        {/* Open Consortium Collaboration Note */}
        <div className="team-consortium-note font-mono">
          <div className="note-icon-col" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className="note-text">
            Individual scientific investigators, university research labs, and field analogue stations are indexed
            in our peer-reviewed DOI registry. To register a verified analogue testing site or submit research, visit
            the Researcher Workspace in the Research Hub.
          </p>
        </div>
      </div>
    </section>
  )
}
