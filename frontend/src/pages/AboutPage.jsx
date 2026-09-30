/**
 * @file frontend/src/pages/AboutPage.jsx
 * @description Master page composition root for the About Us route, responsible for SEO
 * meta tag rendering and declarative assembly of modular About Page sections.
 */

// External dependencies
import React from 'react';
import { Helmet } from 'react-helmet-async';

// Internal local imports
import useAboutPage from '../hooks/useAboutPage';
import AboutHeroSection from '../components/about/AboutHeroSection';
import AboutCustomerModal from '../components/about/AboutCustomerModal';
import AboutLegacySection from '../components/about/AboutLegacySection';
import AboutComparisonSection from '../components/about/AboutComparisonSection';
import AboutServicesDeck from '../components/about/AboutServicesDeck';
import AboutPromiseSection from '../components/about/AboutPromiseSection';
import GoogleReviews from '../components/GoogleReviews';
import AboutShowroomCta from '../components/about/AboutShowroomCta';

// SEO Meta Constants
const SEO_CONFIG = {
  title: "About Sadguru Car Surat — Surat's Premier Certified Pre-Owned Showroom Since 2011",
  description:
    "Discover Sadguru Car Surat — Surat's most reputable certified pre-owned showroom since 2011. 15+ years of trust, 150+ inspected cars, 120-point quality check, and 5000+ happy families.",
  ogTitle: "About Sadguru Car Surat — 15+ Years of Automotive Trust in Surat",
  ogDescription:
    "Surat's leading certified pre-owned car showroom. 150+ verified vehicles, 120-point inspection, zero hidden charges.",
};

/**
 * About Page View Component
 * Assembles all modular sections and provides route-level state orchestration
 */
export default function AboutPage() {
  const {
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
  } = useAboutPage();

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#FDFCFB] text-slate-800 font-body selection:bg-brand-orange selection:text-white">
      {/* Route SEO & OpenGraph Metadata */}
      <Helmet>
        <title>{SEO_CONFIG.title}</title>
        <meta name="description" content={SEO_CONFIG.description} />
        <meta property="og:title" content={SEO_CONFIG.ogTitle} />
        <meta property="og:description" content={SEO_CONFIG.ogDescription} />
      </Helmet>

      {/* 1. Pinterest-Inspired Hero Section with Curved Smile Arc Showcase */}
      <AboutHeroSection
        heroCustomers={heroCustomers}
        onSelectCustomer={setSelectedCustomerModal}
      />

      {/* 2. Customer Delivery Photo & Testimonial Modal */}
      <AboutCustomerModal
        customer={selectedCustomerModal}
        onClose={() => setSelectedCustomerModal(null)}
      />

      {/* 3. Heritage & Founder Narrative Section */}
      <AboutLegacySection />

      {/* 4. The Sadguru Difference: Broker vs Sadguru Verified Comparison Matrix */}
      <AboutComparisonSection />

      {/* 5. Core Dealership Services Stacking Card Deck */}
      <AboutServicesDeck
        activeTab={activeTab}
        onTabClick={handleTabClick}
        serviceDeckRef={serviceDeckRef}
        card0Scale={card0Scale}
        card0Dim={card0Dim}
        card1Scale={card1Scale}
        card1Dim={card1Dim}
      />

      {/* 6. The Sadguru Promise & Standard (Modern Bento Grid + Deep-Dive Modal) */}
      <AboutPromiseSection
        activePromiseModal={activePromiseModal}
        onOpenModal={setActivePromiseModal}
        onCloseModal={() => setActivePromiseModal(null)}
      />

      {/* 7. Social Proof (Google Reviews) */}
      <div className="bg-white border-t border-slate-100">
        <GoogleReviews />
      </div>

      {/* 8. VIP Showroom Invitation CTA Banner */}
      <AboutShowroomCta />
    </div>
  );
}
