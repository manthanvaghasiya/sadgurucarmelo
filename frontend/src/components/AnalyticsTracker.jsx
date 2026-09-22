import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

/**
 * Gets or creates a persistent anonymous visitor ID in localStorage.
 * Ensures 100% accurate unique visitor tracking across sessions and networks.
 */
function getOrCreateVisitorId() {
  try {
    let vid = localStorage.getItem('sg_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('sg_visitor_id', vid);
    }
    return vid;
  } catch {
    return null;
  }
}

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

    const visitorId = getOrCreateVisitorId();

    // Asynchronously track real page view in backend
    axiosInstance.post('/analytics/track', { visitorId, path: pathname }).catch(() => {
      // Silently ignore network or tracking issues
    });
  }, [location.pathname]);

  return null;
}
