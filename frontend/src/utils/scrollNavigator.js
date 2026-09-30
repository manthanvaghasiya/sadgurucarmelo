/**
 * @file frontend/src/utils/scrollNavigator.js
 * @description Pure DOM navigation and viewport detection utility service, isolating
 * browser I/O, scroll boundaries, and observer lifecycles.
 */

/**
 * Smoothly scrolls the window to an element offset by a designated margin
 * @param {string} elementId - Target DOM element ID
 * @param {number} [topOffset=0] - Spacing between element top and window top in px
 * @returns {boolean} True if element was found and scrolled to, false otherwise
 */
export function scrollToElement(elementId, topOffset = 0) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    return false;
  }

  const yPosition = targetElement.getBoundingClientRect().top + window.scrollY - topOffset;
  window.scrollTo({ top: yPosition, behavior: 'smooth' });
  return true;
}

/**
 * Detects the first matching element within the viewport from a list of candidate IDs
 * @param {string[]} candidateIds - Ordered list of section IDs to inspect
 * @param {number} [threshold=200] - Top offset boundary threshold in px
 * @returns {string|null} ID of the active candidate or null if none active
 */
export function findActiveElementInViewport(candidateIds, threshold = 200) {
  if (typeof document === 'undefined') {
    return null;
  }

  for (const id of candidateIds) {
    const anchor =
      document.getElementById(`service-anchor-${id}`) ||
      document.getElementById(`service-card-${id}`);

    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      if (rect.top <= threshold) {
        return id;
      }
    }
  }

  return null;
}

/**
 * Creates a passive scroll listener for viewport tracking with automatic cleanup
 * @param {Function} onScroll - Handler callback invoked on scroll events
 * @returns {Function} Teardown unsubscribe function
 */
export function bindPassiveScrollListener(onScroll) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}
