/**
 * @file frontend/src/components/about/AboutServicesDeck.jsx
 * @description Master services component delegating to the executive CoreServicesConsole.
 * Preserves backwards compatibility for page composition roots.
 */

// External dependencies
import React from 'react';

// Internal local imports
import CoreServicesConsole from './services/CoreServicesConsole';

/**
 * About Services Deck Orchestrator
 * @param {Object} props
 * @param {string} props.activeTab - Currently active service tab identifier
 * @param {Function} props.onTabClick - Tab change handler
 */
export default function AboutServicesDeck({ activeTab, onTabClick }) {
  return <CoreServicesConsole activeTab={activeTab} onTabClick={onTabClick} />;
}
