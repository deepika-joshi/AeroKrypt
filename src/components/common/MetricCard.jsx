import StatusBadge from './StatusBadge.jsx'

export default function MetricCard({
  label,
  value,
  unit,
  subtext,
  badgeText,
  badgeVariant = 'sample',
  onClick,
  targetNav,
}) {
  const isClickable = Boolean(onClick && targetNav)

  return (
    <div
      className={`metric-card ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && onClick(targetNav)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick(targetNav)
        }
      }}
    >
      <div className="metric-card-header">
        <span className="metric-label">{label}</span>
        {badgeText && <StatusBadge variant={badgeVariant} label={badgeText} size="xs" />}
      </div>

      <div className="metric-value-wrap">
        <span className="metric-value font-mono">{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>

      <div className="metric-footer">
        <span className="metric-subtext">{subtext}</span>
        {isClickable && (
          <span className="metric-action-hint" aria-hidden="true">
            View &rarr;
          </span>
        )}
      </div>
    </div>
  )
}

