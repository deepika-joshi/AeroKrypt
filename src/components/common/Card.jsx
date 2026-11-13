export default function Card({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
}) {
  return (
    <section className={`scientific-card ${className}`}>
      {(title || badge || action) && (
        <div className="card-header">
          <div className="card-header-left">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          <div className="card-header-right">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  )
}

