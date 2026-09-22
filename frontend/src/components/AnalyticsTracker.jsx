import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

/**
 * AnalyticsTracker automatically records page views and unique visitors
 * for customer-facing public routes. Admin and login paths are excluded.
 */
export default function AnalyticsTracker() {
  const location = useLocation();
  const lastPathRef = useRef('');

  useEffect(() => {
    const pathname = location.pathname;

    // Do not track admin panel or login routes as consumer showroom traffic
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      return;
    }

    // Prevent double-counting if same route re-renders
    if (lastPathRef.current === pathname) {
      return;
    }
    lastPathRef.current = pathname;

    // Asynchronously track page view in backend
    axiosInstance.post('/analytics/track').catch(() => {
      // Silently ignore network or tracking issues
    });
  }, [location.pathname]);

  return null;
}
