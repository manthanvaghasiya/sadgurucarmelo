import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Always log error to console for diagnosis
    console.error('⚠️ [Sadguru ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleGoInventory = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/inventory';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
          color: '#0f172a',
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
          }}>
            {/* Warning Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fff7ed',
              border: '2px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '1.75rem',
            }}>
              🚗
            </div>

            {/* Bilingual Heading */}
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              marginBottom: '0.5rem',
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}>
              કંઈક ખોટું થયું · Something went wrong
            </h1>

            {/* Subtitle */}
            <p style={{
              color: '#64748b',
              marginBottom: '1.75rem',
              fontSize: '0.925rem',
              lineHeight: '1.6',
            }}>
              અમે દિલગીર છીએ. તમે હોમ પેજ પર જઈ શકો છો અથવા અમારો સંપૂર્ણ કાર સ્ટોક જોઈ શકો છો.
              <br />
              <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                Please choose where you would like to continue:
              </span>
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  background: '#F59423',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.925rem',
                  transition: 'background 0.2s, transform 0.1s',
                  boxShadow: '0 4px 14px rgba(245, 148, 35, 0.3)',
                }}
                onMouseOver={(e) => e.target.style.background = '#e0831a'}
                onMouseOut={(e) => e.target.style.background = '#F59423'}
              >
                🏠 હોમ પેજ પર જાઓ · Return to Home
              </button>

              <button
                type="button"
                onClick={this.handleGoInventory}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.925rem',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.target.style.background = '#1e293b'}
                onMouseOut={(e) => e.target.style.background = '#0f172a'}
              >
                🚗 કાર કલેક્શન જુઓ · Browse Inventory
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#0f172a';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#64748b';
                }}
              >
                🔄 ફરી પ્રયાસ કરો · Refresh Page
              </button>
            </div>

            {/* Dealership Hotline Support */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.8rem',
              color: '#64748b',
            }}>
              સદગુરુ કાર મેળો, વરાછા, સુરત • હેલ્પલાઇન:{' '}
              <a
                href="tel:+919913634447"
                style={{ color: '#F59423', fontWeight: '700', textDecoration: 'none' }}
              >
                +91 99136 34447
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
