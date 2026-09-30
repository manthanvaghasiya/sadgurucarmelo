/**
 * @file frontend/src/pages/SellYourCar.jsx
 * @description Master page composition root for the Sell Your Car route, assembling
 * the Hero, 3-step selling process, interactive valuation uploader form, comparison matrix,
 * seller testimonials, FAQ accordion, and direct VIP contact hotline.
 */

import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import useSellCarForm from '../hooks/useSellCarForm';
import SellCarHero from '../components/sell/SellCarHero';
import SellCarProcess from '../components/sell/SellCarProcess';
import SellCarForm from '../components/sell/SellCarForm';
import SellCarComparison from '../components/sell/SellCarComparison';
import SellCarTestimonials from '../components/sell/SellCarTestimonials';
import SellCarFaq from '../components/sell/SellCarFaq';
import SellCarDirectCta from '../components/sell/SellCarDirectCta';

const SEO_CONFIG = {
  title: 'Sell Your Car in Surat | Best Market Price & 15-Min Instant Payout | Sadguru Car Melo',
  description:
    'Sell your pre-owned car at Sadguru Car Melo, Varachha, Surat. Get free doorstep inspection, instant market valuation, 15-minute bank payout, ₹0 brokerage, and 100% free legal RTO transfer.',
  ogTitle: 'Sell Your Car at Highest Price in Surat — Instant Payment | Sadguru Car Melo',
  ogDescription:
    'Free car valuation in 30 minutes, spot bank transfer, and zero legal liability with 100% free RTO transfer in Surat.',
};

export default function SellYourCar() {
  const formRef = useRef(null);
  const {
    formData,
    photos,
    previews,
    isSubmitting,
    isSuccess,
    compressing,
    handleInputChange,
    handleBrandSelect,
    handlePhotoSelect,
    removePhoto,
    handleSubmit,
    resetForm,
  } = useSellCarForm();

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#FDFCFB] text-slate-800 font-body selection:bg-brand-orange selection:text-white">
      {/* Route SEO & OpenGraph Metadata */}
      <Helmet>
        <title>{SEO_CONFIG.title}</title>
        <meta name="description" content={SEO_CONFIG.description} />
        <meta property="og:title" content={SEO_CONFIG.ogTitle} />
        <meta property="og:description" content={SEO_CONFIG.ogDescription} />
      </Helmet>

      {/* 1. Hero Section with Value Pillars & Action CTAs */}
      <SellCarHero onScrollToForm={handleScrollToForm} />

      {/* 2. 3-Step Simple Visual Selling Process */}
      <SellCarProcess />

      {/* 3. Interactive Multi-Step Valuation & Photo Upload Form */}
      <SellCarForm
        formRef={formRef}
        formData={formData}
        photos={photos}
        previews={previews}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        compressing={compressing}
        handleInputChange={handleInputChange}
        handleBrandSelect={handleBrandSelect}
        handlePhotoSelect={handlePhotoSelect}
        removePhoto={removePhoto}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      {/* 4. Local Broker vs Sadguru Car Melo Comparison Table */}
      <SellCarComparison />

      {/* 5. Real Surat Car Seller Testimonials & Verified Stories */}
      <SellCarTestimonials />

      {/* 6. Frequently Asked Questions (FAQ) Accordion */}
      <SellCarFaq />

      {/* 7. Direct Phone, WhatsApp & Showroom Consultation CTA */}
      <SellCarDirectCta />
    </div>
  );
}
