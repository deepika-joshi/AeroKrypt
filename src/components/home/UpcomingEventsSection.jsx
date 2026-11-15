import { useState } from 'react'
import {
  EVENT_CATEGORIES,
  getUpcomingEvents,
  getFeaturedUpcomingEvents,
  formatEventField,
} from '../../data/eventsData.js'

export default function UpcomingEventsSection({ onNavigate: _onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [viewMode, setViewMode] = useState('featured') // 'featured' | 'all'
  const [activeModalEvent, setActiveModalEvent] = useState(null)

  // Retrieve unexpired events sorted chronologically
  const activeEvents = getUpcomingEvents()

  // Filter by category
  const categoryFilteredEvents = activeEvents.filter((ev) => {
    if (selectedCategory === 'All Categories') return true
    return ev.category === selectedCategory
  })

  // Displayed events: if 'featured' and 'All Categories', show 2-3 featured; otherwise show all matching
  const displayedEvents =
    viewMode === 'featured' && selectedCategory === 'All Categories'
      ? getFeaturedUpcomingEvents(3)
      : categoryFilteredEvents

  return (
    <section id="upcoming-events" className="home-content-section" aria-label="Upcoming Research & Events">
      <div className="section-header-block">
        <div className="section-eyebrow font-mono">
          <span className="accent-glyph">//</span> CALENDAR &amp; CONFERENCES
        </div>
        <h2 className="section-main-title">
          Upcoming Research &amp; Events
        </h2>
        <p className="section-lead-text">
          Published planetary science proceedings, lunar exploration forums, and analogue field workshops from accredited space agencies and academic institutions.
        </p>
      </div>

      {/* Category Filter Pills & View Mode Bar */}
      <div className="events-controls-row">
        <div className="event-categories-bar font-mono" role="tablist" aria-label="Event Categories">
          {EVENT_CATEGORIES.map((cat) => {
            const count =
              cat === 'All Categories'
                ? activeEvents.length
                : activeEvents.filter((e) => e.category === cat).length

            return (
              <button
                key={cat}
                type="button"
                className={`event-category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat)
                  // If user selects a specific category, show all matching in that category
                  if (cat !== 'All Categories') {
                    setViewMode('all')
                  }
                }}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                <span>{cat}</span>
                {count > 0 && <span className="category-count-badge">({count})</span>}
              </button>
            )
          })}
        </div>

        {/* View Toggle (Featured vs All) */}
        {selectedCategory === 'All Categories' && activeEvents.length > 3 && (
          <div className="events-view-toggle font-mono">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'featured' ? 'active' : ''}`}
              onClick={() => setViewMode('featured')}
            >
              Featured (3)
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              View All ({activeEvents.length})
            </button>
          </div>
        )}
      </div>

      {/* Events Container */}
      <div className="upcoming-events-container">
        {displayedEvents.length > 0 ? (
          <>
            <div className="events-grid">
              {displayedEvents.map((event) => (
                <article key={event.id} className="event-card aerospace-card" aria-labelledby={`event-title-${event.id}`}>
                  <div className="event-card-header">
                    <span className="event-category-badge font-mono">{event.category}</span>
                    <span className="event-format-chip font-mono">{formatEventField(event.format)}</span>
                  </div>

                  <div className="event-card-body">
                    <h3 id={`event-title-${event.id}`} className="event-title">
                      {event.title}
                    </h3>

                    <div className="event-date-chip font-mono">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{event.date}</span>
                    </div>

                    {event.registrationDeadline && (
                      <div className="event-deadline-tag font-mono">
                        <span className="deadline-label">APPLICATION / REGISTRATION DEADLINE:</span> {event.registrationDeadline}
                      </div>
                    )}

                    <div className="event-meta-list font-mono">
                      <div className="event-institution">
                        <span className="institution-label">ORGANISER:</span> {formatEventField(event.institution)}
                      </div>
                      <div className="event-location">
                        <span className="location-label">LOCATION:</span> {formatEventField(event.location)}
                      </div>
                    </div>

                    <p className="event-desc">{event.description}</p>

                    <div className="event-source font-mono">
                      <span className="source-label">SOURCE:</span> {formatEventField(event.source)}
                    </div>
                  </div>

                  <div className="event-card-footer">
                    <a
                      href={event.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-aerospace btn-aerospace-sm font-mono event-external-btn"
                      aria-label={`View official page for ${event.title}`}
                    >
                      <span>View Event</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>

                    <button
                      type="button"
                      className="btn-aerospace-ghost btn-aerospace-sm font-mono"
                      onClick={() => setActiveModalEvent(event)}
                      aria-label={`View details for ${event.title}`}
                    >
                      <span>Details</span>
                      <span className="btn-arrow" aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom prompt if viewing featured and more are available */}
            {viewMode === 'featured' && selectedCategory === 'All Categories' && activeEvents.length > 3 && (
              <div className="events-expand-bar">
                <button
                  type="button"
                  className="btn-aerospace font-mono"
                  onClick={() => setViewMode('all')}
                >
                  <span>Explore All {activeEvents.length} Events</span>
                  <span className="btn-arrow" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* High-Aesthetic Scientific Empty State */
          <div className="events-empty-state aerospace-card">
            <div className="empty-state-telemetry font-mono">
              <span className="telemetry-dot" aria-hidden="true" />
              <span>REGISTRY INTEGRITY: ACTIVE PROCEEDINGS &amp; EVENTS</span>
            </div>

            <div className="empty-state-icon-wrap" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div className="empty-state-content">
              <h3 className="empty-state-title">
                No Upcoming Events in Selected Category
              </h3>
              <p className="empty-state-desc">
                AEROKRYPT indexes published scientific proceedings, planetary mission workshops, and symposiums from NASA, ESA, AGU, and the Lunar and Planetary Institute (LPI). No unconfirmed dates or placeholders are presented.
              </p>
              <p className="empty-state-note font-mono">
                Categories Monitored: Conferences &bull; Workshops &bull; Webinars &bull; Research Opportunities &bull; Planetary Mission Events
              </p>
            </div>

            <div className="empty-state-action">
              <button
                type="button"
                className="btn-aerospace btn-aerospace-sm font-mono"
                onClick={() => {
                  setSelectedCategory('All Categories')
                  setViewMode('all')
                }}
              >
                <span>View All Events</span>
                <span className="btn-arrow" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {activeModalEvent && (
        <div
          className="event-modal-backdrop"
          onClick={() => setActiveModalEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-event-title"
        >
          <div className="event-modal-card aerospace-card" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div className="modal-badge-group">
                <span className="event-modal-badge font-mono">{activeModalEvent.category}</span>
                <span className="event-modal-format font-mono">{formatEventField(activeModalEvent.format)}</span>
              </div>
              <button
                type="button"
                className="event-modal-close"
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close Event Modal"
              >
                &times;
              </button>
            </div>

            <h3 id="modal-event-title" className="event-modal-title">
              {activeModalEvent.title}
            </h3>

            <div className="event-modal-grid font-mono">
              <div className="modal-grid-cell">
                <span className="modal-cell-label">DATE SCHEDULE</span>
                <span className="modal-cell-val">{activeModalEvent.date}</span>
              </div>
              <div className="modal-grid-cell">
                <span className="modal-cell-label">LOCATION</span>
                <span className="modal-cell-val">{formatEventField(activeModalEvent.location)}</span>
              </div>
              <div className="modal-grid-cell">
                <span className="modal-cell-label">ORGANISER</span>
                <span className="modal-cell-val">{formatEventField(activeModalEvent.institution)}</span>
              </div>
              <div className="modal-grid-cell">
                <span className="modal-cell-label">REGISTRATION DEADLINE</span>
                <span className="modal-cell-val">{formatEventField(activeModalEvent.registrationDeadline)}</span>
              </div>
              <div className="modal-grid-cell">
                <span className="modal-cell-label">OFFICIAL SOURCE</span>
                <span className="modal-cell-val">{formatEventField(activeModalEvent.source)}</span>
              </div>
              <div className="modal-grid-cell">
                <span className="modal-cell-label">LAST VERIFIED</span>
                <span className="modal-cell-val">{formatEventField(activeModalEvent.lastVerifiedDate)}</span>
              </div>
            </div>

            <div className="event-modal-desc-wrap">
              <div className="modal-section-label font-mono">OVERVIEW &amp; SCIENTIFIC SCOPE</div>
              <p className="event-modal-desc">{activeModalEvent.description}</p>
            </div>

            <div className="event-modal-actions font-mono">
              <a
                href={activeModalEvent.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-aerospace btn-aerospace-solid"
              >
                <span>View Official Event Page</span>
                <span className="btn-arrow" aria-hidden="true">&rarr;</span>
              </a>

              {activeModalEvent.registrationUrl && (
                <a
                  href={activeModalEvent.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-aerospace"
                >
                  <span>Portal / Registration</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}

              <button
                type="button"
                className="btn-aerospace-ghost"
                onClick={() => setActiveModalEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
