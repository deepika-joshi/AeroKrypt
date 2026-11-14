import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="aerospace-card font-mono"
          style={{
            margin: '32px auto',
            maxWidth: '800px',
            padding: '32px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span style={{ fontSize: '13px', letterSpacing: '0.12em', fontWeight: 800 }}>
              // TELEMETRY SUBSYSTEM FAULT DETECTED
            </span>
          </div>

          <h2 style={{ color: '#ffffff', fontSize: '20px', margin: '14px 0 8px 0', textTransform: 'uppercase' }}>
            {this.props.title || 'Component Execution Anomaly'}
          </h2>

          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>
            A runtime exception interrupted the rendering of this module. The fault has been isolated to protect platform integrity.
          </p>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#050608',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '2px',
              color: '#fca5a5',
              fontSize: '12px',
              overflowX: 'auto',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {this.state.error?.toString()}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-aerospace btn-aerospace-cyan"
              onClick={this.handleReset}
              style={{ padding: '8px 18px', fontSize: '11px' }}
            >
              <span>REINITIALIZE MODULE</span>
            </button>
            <button
              type="button"
              className="btn-aerospace"
              onClick={() => window.location.reload()}
              style={{ padding: '8px 18px', fontSize: '11px', color: 'var(--text-secondary)' }}
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

