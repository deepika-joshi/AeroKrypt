import MetricCard from '../common/MetricCard.jsx'
import { PLATFORM_OVERVIEW_METRICS } from '../../data/analogueData.js'

export default function PlatformOverview({ onNavigate }) {
  return (
    <section className="dashboard-section" aria-label="Platform Overview">
      <div className="section-header-row">
        <div>
          <h2 className="section-heading">Platform Overview</h2>
          <p className="section-subheading">
            Terrestrial analogue catalog metrics and research registry parameters
          </p>
        </div>
        <div className="dataset-notice-chip">
          <span className="notice-dot" aria-hidden="true" />
          <span>Curated Sample Registry v0.1 • Non-Simulated Schema</span>
        </div>
      </div>

      <div className="metrics-grid">
        {PLATFORM_OVERVIEW_METRICS.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            subtext={metric.subtext}
            badgeText={metric.badgeText}
            badgeVariant={metric.badgeVariant}
            targetNav={metric.targetNav}
            onClick={onNavigate}
          />
        ))}
      </div>
    </section>
  )
}

