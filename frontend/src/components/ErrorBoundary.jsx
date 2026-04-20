import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send this to Sentry or similar error tracking
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
          background: '#fafbfc',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.75rem',
          }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a2b3c' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.6' }}>
            We're sorry for the inconvenience. Please refresh the page to continue browsing our vehicles.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.875rem 2.5rem',
              background: '#1a2b3c',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.875rem',
              letterSpacing: '0.025em',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = '#2d4a63'}
            onMouseOut={(e) => e.target.style.background = '#1a2b3c'}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
