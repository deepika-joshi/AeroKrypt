import { MISSION_OBJECTIVES } from '../../data/missionObjectives.js'

export default function MissionRequirementBuilder({
  criteria,
  onCriteriaChange,
  onResetCriteria,
}) {
  const handleBodyChange = (body) => {
    onCriteriaChange({ ...criteria, targetBody: body })
  }

  const handleActivityChange = (e) => {
    const activityId = e.target.value
    if (!activityId) {
      onCriteriaChange({ ...criteria, activityId: null })
      return
    }
    const act = MISSION_OBJECTIVES.find((m) => m.id === activityId)
    // Pre-populate recommended parameters from mission activity
    onCriteriaChange({
      ...criteria,
      activityId,
      targetBody: act ? act.primaryTarget : criteria.targetBody,
      maxSlopeDeg: act ? act.maxSlopeThreshold : criteria.maxSlopeDeg,
    })
  }

  const selectedActivity = MISSION_OBJECTIVES.find((m) => m.id === criteria.activityId)

  return (
    <section className="mission-builder-card" aria-label="Mission Requirement Parameters">
      <div className="builder-header">
        <div className="builder-header-left">
          <div className="builder-tag font-mono">MODULE A: LOCATION FINDER</div>
          <h2 className="builder-title">Mission Requirements &amp; Environmental Criteria</h2>
          <p className="builder-subtitle">
            Configure target planetary parameters to evaluate candidate Earth analogue sites with transparent evidence.
          </p>
        </div>
        <button
          type="button"
          className="builder-reset-btn"
          onClick={onResetCriteria}
          title="Reset all criteria to defaults"
        >
          Reset Criteria
        </button>
      </div>

      <div className="builder-form-grid">
        {/* 1. Target Planetary Body */}
        <div className="form-group">
          <label className="form-label" htmlFor="target-body-select">
            Target Planetary Body
          </label>
          <div className="planetary-toggle-group" id="target-body-select">
            {['ALL', 'Moon', 'Mars'].map((body) => (
              <button
                key={body}
                type="button"
                className={`toggle-option ${criteria.targetBody === body ? 'active' : ''}`}
                onClick={() => handleBodyChange(body)}
              >
                {body === 'ALL' ? 'All Planetary Targets' : body}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Mission Activity ConOps */}
        <div className="form-group">
          <label className="form-label" htmlFor="mission-activity-select">
            Mission Activity / Testing Objective
          </label>
          <select
            id="mission-activity-select"
            className="form-select"
            value={criteria.activityId || ''}
            onChange={handleActivityChange}
          >
            <option value="">-- Select Specific Testing Activity (Optional) --</option>
            {MISSION_OBJECTIVES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.targetBodies.join('/')})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Substrate & Lithology Filter */}
        <div className="form-group">
          <label className="form-label" htmlFor="lithology-select">
            Substrate &amp; Dominant Lithology
          </label>
          <select
            id="lithology-select"
            className="form-select"
            value={criteria.lithologyFilter}
            onChange={(e) =>
              onCriteriaChange({ ...criteria, lithologyFilter: e.target.value })
            }
          >
            <option value="ALL">All Geological Substrates</option>
            <option value="Basalt">Basaltic Lava &amp; Volcanic Flows</option>
            <option value="Permafrost">Ice-Cemented Permafrost &amp; Ground Ice</option>
            <option value="Perchlorate">Perchlorate &amp; Nitrate Soil</option>
            <option value="Jarosite">Jarosite, Sulfate &amp; Iron Gossans</option>
            <option value="Breccia">Impact Melt Breccia &amp; Shatter Cones</option>
            <option value="Carbonate">Hydrothermal Carbonates &amp; Xenoliths</option>
          </select>
        </div>

        {/* 4. Maximum Slope Tolerance */}
        <div className="form-group">
          <div className="form-label-with-val">
            <label className="form-label" htmlFor="max-slope-slider">
              Max Slope Gradient Tolerance
            </label>
            <span className="form-value-tag font-mono">
              {criteria.maxSlopeDeg ? `<= ${criteria.maxSlopeDeg}°` : 'Unrestricted'}
            </span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              id="max-slope-slider"
              min="5"
              max="45"
              step="5"
              value={criteria.maxSlopeDeg || 45}
              onChange={(e) =>
                onCriteriaChange({
                  ...criteria,
                  maxSlopeDeg: Number(e.target.value),
                })
              }
              className="form-range"
            />
            <div className="slider-ticks font-mono">
              <span>5° (Playa)</span>
              <span>15° (Rovers)</span>
              <span>30° (Slopes)</span>
              <span>45° (Extreme)</span>
            </div>
          </div>
        </div>

        {/* 5. Thermal Regime */}
        <div className="form-group">
          <label className="form-label" htmlFor="thermal-regime-select">
            Target Thermal &amp; Moisture Regime
          </label>
          <select
            id="thermal-regime-select"
            className="form-select"
            value={criteria.tempRegime}
            onChange={(e) =>
              onCriteriaChange({ ...criteria, tempRegime: e.target.value })
            }
          >
            <option value="ALL">All Thermal Regimes</option>
            <option value="SUB_ZERO">Polar Sub-Zero Cryo-Regime (&lt; 0 °C)</option>
            <option value="HYPER_ARID_HOT">Hyper-Arid Desiccated (&lt; 10 mm/yr rain)</option>
          </select>
        </div>

        {/* 6. Scientific Rigor Filter */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={criteria.requireMeasuredOnly}
              onChange={(e) =>
                onCriteriaChange({
                  ...criteria,
                  requireMeasuredOnly: e.target.checked,
                })
              }
              className="form-checkbox"
            />
            <span>
              <strong>Strict Measured Data Only:</strong> Flag sites where criteria depend on SOURCED or ESTIMATED models rather than in-situ sensor measurements.
            </span>
          </label>
        </div>
      </div>

      {selectedActivity && (
        <div className="activity-benchmark-banner">
          <div className="benchmark-badge font-mono">ACTIVE BENCHMARK</div>
          <div className="benchmark-content">
            <strong>{selectedActivity.title}:</strong> {selectedActivity.description}
            <div className="benchmark-meta font-mono">
              <span>Analogy: {selectedActivity.benchmarkAnalogy}</span>
              <span>Preferred Slopes: {selectedActivity.preferredSlopes}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

