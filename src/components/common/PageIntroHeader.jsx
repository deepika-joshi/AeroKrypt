/**
 * AEROKRYPT - Canonical Page Intro Header Component
 *
 * Provides a standardized, compact, and cinematic introductory header
 * across the four primary navigation pages directly below the navbar.
 */

import { PAGE_INTRO_CONFIGS } from '../../data/pageIntrosData.js'

export default function PageIntroHeader({ pageKey }) {
  const intro = PAGE_INTRO_CONFIGS[pageKey]
  if (!intro) return null

  return (
    <header className="page-intro-header view-header" aria-label={intro.title}>
      <div className="view-header-top">
        <div className="view-title-group">
          <div className="view-index-tag font-mono">
            {intro.sectionCode} // {intro.sectionLabel} • {intro.navLabel}
          </div>
          <h1 className="view-title page-intro-heading">
            {intro.title}
          </h1>
          <div className="page-intro-accent-bar" aria-hidden="true" />
        </div>
        <div className="view-badges">
          <span className="badge-source font-mono">
            NASA PDS4 &amp; USGS 3DEP
          </span>
          <span className="badge-sample font-mono">
            VERIFIED EVIDENCE ENGINE
          </span>
          {intro.extraChip && (
            <div className="dataset-notice-chip font-mono">
              <span className="notice-dot" />
              <span>{intro.extraChip}</span>
            </div>
          )}
        </div>
      </div>
      <p className="view-description page-intro-text">
        {intro.description}
      </p>
    </header>
  )
}
