/**
 * @file frontend/src/hooks/useAboutPage.js
 * @description Master custom hook encapsulating state machines, query synchronization,
 * declarative scroll transforms, and service layer integration for the About page.
 */

// External dependencies
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScroll, useTransform } from 'framer-motion';

// Internal local imports
import CustomerService from '../services/customerService';
import { FALLBACK_HERO_CUSTOMERS } from '../data/aboutData';

// Constants
const VALID_SERVICES = Object.freeze(['buy', 'sell', 'exchange']);
const DEFAULT_SERVICE_TAB = 'buy';

/**
 * @typedef {Object} AboutPageState
 * @property {string} activeTab - Currently active service tab identifier
 * @property {import('../services/customerService').CustomerRecord[]} heroCustomers - Customer list
 * @property {import('../services/customerService').CustomerRecord|null} selectedCustomerModal - Selected customer story
 * @property {Function} setSelectedCustomerModal - Dispatcher to select customer story
 * @property {Object|null} activePromiseModal - Selected pillar detail object
 * @property {Function} setActivePromiseModal - Dispatcher to select pillar detail
 * @property {React.RefObject} serviceDeckRef - Stacking deck target container ref
 * @property {import('framer-motion').MotionValue} card0Scale - First card scale transform
 * @property {import('framer-motion').MotionValue} card0Dim - First card dimming opacity
 * @property {import('framer-motion').MotionValue} card1Scale - Second card scale transform
 * @property {import('framer-motion').MotionValue} card1Dim - Second card dimming opacity
 * @property {Function} handleTabClick - Interactive tab selection handler
 */

/**
 * Custom hook governing the reactive state and lifecycle of the About Page
 * @returns {AboutPageState} Complete state and event contracts
 */
export function useAboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Reactive URL & Tab State Synchronization
  const serviceFromQuery = searchParams.get('service');
  const initialTab = isValidServiceTab(serviceFromQuery) ? serviceFromQuery : DEFAULT_SERVICE_TAB;
  const [activeTab, setActiveTab] = useState(initialTab);

  // 2. Modal Presentation States
  const [selectedCustomerModal, setSelectedCustomerModal] = useState(null);
  const [activePromiseModal, setActivePromiseModal] = useState(null);

  // 3. Customer Testimonial Data Layer
  const [heroCustomers, setHeroCustomers] = useState(FALLBACK_HERO_CUSTOMERS);

  // 4. Stacking Deck Scroll Physics Transforms
  const serviceDeckRef = useRef(null);
  const { scrollYProgress: deckScrollYProgress } = useScroll({
    target: serviceDeckRef,
    offset: ['start start', 'end end'],
  });

  const card0Scale = useTransform(deckScrollYProgress, [0.1, 0.45, 0.8], [1, 0.96, 0.92]);
  const card0Dim = useTransform(deckScrollYProgress, [0.15, 0.5], [0, 0.08]);
  const card1Scale = useTransform(deckScrollYProgress, [0.45, 0.85], [1, 0.96]);
  const card1Dim = useTransform(deckScrollYProgress, [0.55, 0.88], [0, 0.06]);

  // Effect: Fetch verified customers using domain service
  useEffect(() => {
    let isCancelled = false;

    async function loadCustomers() {
      const customers = await CustomerService.getHeroCustomers();
      if (!isCancelled) {
        setHeroCustomers(customers);
      }
    }

    loadCustomers();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Effect: Synchronize tab when URL service parameter changes
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (isValidServiceTab(serviceParam)) {
      setActiveTab(serviceParam);
    }
  }, [searchParams]);

  // Public Handler: User initiated tab click
  const handleTabClick = useCallback(
    (tabId) => {
      if (!isValidServiceTab(tabId)) return;

      setActiveTab(tabId);
      setSearchParams({ service: tabId }, { replace: true });
    },
    [setSearchParams]
  );

  return {
    activeTab,
    heroCustomers,
    selectedCustomerModal,
    setSelectedCustomerModal,
    activePromiseModal,
    setActivePromiseModal,
    serviceDeckRef,
    card0Scale,
    card0Dim,
    card1Scale,
    card1Dim,
    handleTabClick,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure Helper Predicates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pure predicate validating if a service identifier belongs to allowed set
 * @param {string|null} serviceId
 * @returns {boolean} True if supported service tab ID
 */
function isValidServiceTab(serviceId) {
  return typeof serviceId === 'string' && VALID_SERVICES.includes(serviceId);
}

export default useAboutPage;
