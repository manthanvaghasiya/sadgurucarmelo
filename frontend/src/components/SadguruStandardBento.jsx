/**
 * @file frontend/src/components/SadguruStandardBento.jsx
 * @description Master Bento Grid layout orchestrator for Sadguru's 4 Core Pillars,
 * assembling asymmetric telemetry cards, SVG charts, and interactive standard viewers.
 */

// External dependencies
import React, { useMemo } from 'react';

// Internal local imports
import InspectionTelemetryCard from './bento/InspectionTelemetryCard';
import RtoTransferCard from './bento/RtoTransferCard';
import TransparentPricingCard from './bento/TransparentPricingCard';
import LoanApprovalsCard from './bento/LoanApprovalsCard';

/**
 * SadguruStandardBento Orchestrator Component
 * @param {Object} props
 * @param {Array<Object>} [props.pillars=[]] - 4 pillars data definitions
 * @param {Function} [props.onOpenModal] - Modal trigger handler
 */
export default function SadguruStandardBento({ pillars = [], onOpenModal = () => {} }) {
  // Extract and memoize pillars map using defensive strategy
  const { inspection, rcTransfer, pricing, loan } = useMemo(
    () => extractPillarsMap(pillars),
    [pillars]
  );

  return (
    <div className="w-full">
      {/* 2-Column Asymmetric Architectural Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Left Tall Flagship (Inspection Guarantee & Telemetry) */}
        <InspectionTelemetryCard pillar={inspection} onOpenModal={onOpenModal} />

        {/* Right Column (7 cols): Top 2 Cards + Bottom Wide Card */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 2: Legal & RTO Transfer */}
            <RtoTransferCard pillar={rcTransfer} onOpenModal={onOpenModal} />

            {/* Card 3: Zero Brokerage & Transparent Pricing */}
            <TransparentPricingCard pillar={pricing} onOpenModal={onOpenModal} />
          </div>

          {/* Card 4: Banking Partners & EMI Sanction */}
          <LoanApprovalsCard pillar={loan} onOpenModal={onOpenModal} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure Strategy & Mapping Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Safely extracts four designated pillars by ID with resilient array index fallbacks
 * @param {Array<Object>} rawPillars - Input list from state or configuration
 * @returns {{ inspection: Object, rcTransfer: Object, pricing: Object, loan: Object }}
 */
function extractPillarsMap(rawPillars) {
  const safeList = Array.isArray(rawPillars) ? rawPillars : [];

  const pillarMap = new Map(safeList.map((item) => [item?.id, item]));

  return {
    inspection: pillarMap.get('inspection') || safeList[0] || {},
    rcTransfer: pillarMap.get('rc-transfer') || safeList[1] || {},
    pricing: pillarMap.get('transparent-pricing') || safeList[3] || {},
    loan: pillarMap.get('loan-approvals') || safeList[2] || {},
  };
}
