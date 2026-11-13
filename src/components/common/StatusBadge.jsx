export default function StatusBadge({ variant = 'sample', label, size = 'sm' }) {
  const getBadgeClasses = () => {
    switch (variant) {
      case 'verified':
        return 'badge-verified'
      case 'planned':
        return 'badge-planned'
      case 'archived':
        return 'badge-archived'
      case 'source':
        return 'badge-source-tag'
      case 'active':
        return 'badge-active'
      case 'sample':
      default:
        return 'badge-sample-tag'
    }
  }

  return (
    <span className={`status-badge ${getBadgeClasses()} size-${size}`}>
      {variant === 'active' && <span className="status-badge-dot" aria-hidden="true" />}
      {variant === 'verified' && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
      {label}
    </span>
  )
}

