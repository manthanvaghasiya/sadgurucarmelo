import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, Banknote, ShieldCheck,
  Search, Play, Star, Landmark, Headphones, Loader2,
  Quote, ChevronLeft, ChevronRight, MapPin, Phone
} from 'lucide-react';
import CarCard from '../components/CarCard';
import { useCars } from '../context/CarContext';
import HeroSection from '../components/HeroSection';
import ArrivingShortly from '../components/ArrivingShortly';
import GoogleReviews from '../components/GoogleReviews';
import QuickSearch from '../components/QuickSearch';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
  const { cars, isLoading } = useCars();

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-slate-50 via-white to-slate-50">

      {/* Global Decorative Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Changed to 'fixed' so the glow follows the user as they scroll, or keep it absolute for a top-glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/5 blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      {/* Wrap content in a relative z-10 div so it sits above the decorative background */}
      <div className="relative z-10 flex flex-col flex-grow">

        {/* 1. Hero Section */}
        <HeroSection />

        {/* 3. Inventory Grid Section (Removed bg-gray-50) */}
        <section className="py-20 px-4 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-6">
              <div className="xl:flex-1 pr-4">
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-2">Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500">Verified Vehicles</span></h2>
                <p className="font-body text-text-muted">Quality pre-owned vehicles with complete service history and multi-point inspection.</p>
              </div>

              {/* Quick Search Component */}
              <div className="w-full xl:w-[680px] shrink-0">
                <QuickSearch compact={true} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="font-body text-text-muted font-semibold">Loading inventory...</p>
                </div>
              ) : (!cars || cars.length === 0) ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="font-heading text-lg text-text font-bold mb-2">Our inventory is currently being updated.</p>
                  <p className="font-body text-text-muted">Check back soon for the latest arrivals!</p>
                </div>
              ) : (
                cars.filter(car => car.isFeaturedOnHome).slice(0, 8).map((car) => (
                  <CarCard
                    key={car._id}
                    id={car._id}
                    image={car.image}
                    title={`${car.make} ${car.model} (${car.year})`}
                    price={car.price >= 100000 ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : `₹${(car.price || 0).toLocaleString('en-IN')}`}
                    badges={car.badges || []}
                    fuel={car.fuelType}
                    transmission={car.transmission}
                    owner={car.owner || '1st Owner'}
                    kms={`${(car.kms || 0).toLocaleString('en-IN')} KM`}
                  />
                ))
              )}
            </div>

            <div className="mt-12 text-center">
              <Link to="/inventory" className="inline-block px-8 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer">
                View Full Inventory
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Core Services Section (Removed bg-background) */}
        <section className="pt-20 pb-20 px-4 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-sm font-heading font-bold text-[#d1108a] uppercase tracking-widest mb-4 inline-block">
                પ્રીમિયમ ડીલરશીપ સેવાઓ
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#1a2b3c] mb-6 leading-tight">
                સુરતમાં <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500">ખરીદ-વેચાણ અને એક્સચેન્જ</span> માટેનું સંપૂર્ણ સોલ્યુશન
              </h2>
              <p className="font-body text-text-muted text-lg leading-relaxed">
                "પારદર્શક અને ભરોસાપાત્ર સેવાઓ દ્વારા અમે તમારા કારના અનુભવને નવી ઊંચાઈએ લઈ જવા માંગીએ છીએ. તમારી દરેક જરૂરિયાત માટે સુરતનું શ્રેષ્ઠ ઓટોમોટિવ ડેસ્ટિનેશન.અમારું લક્ષ્ય પારદર્શિતા અને અતૂટ વિશ્વાસ સાથે તમને કારની શ્રેષ્ઠ સુવિધાઓ આપવાનું છે. અમે દરેક ગ્રાહકની સુવિધા અને સંતોષ માટે સતત પ્રયત્નશીલ છીએ."
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">સર્ટિફાઈડ કાર ખરીદો</h3>
                <p className="font-body text-text-muted leading-relaxed mb-6">તમારા ભરોસા માટે ૧૫૦+ પ્રીમિયમ સર્ટિફાઈડ કાર. દરેક કારની સચોટ તપાસ, તમારી સંપૂર્ણ સુરક્ષા.</p>
                <Link to="/about?service=buy" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">વધુ માહિતી માટે →</Link>
              </div>

              <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Banknote className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">તમારી કાર તરત જ વેચો</h3>
                <p className="font-body text-text-muted leading-relaxed mb-6">પારદર્શક પ્રક્રિયા અને સુરક્ષિત પેમેન્ટ સાથે તમારી કારનું મેળવો શ્રેષ્ઠ બજાર મૂલ્ય.</p>
                <Link to="/about?service=sell" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">વધુ માહિતી માટે →</Link>
              </div>

              <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">તમારી જૂની કારનું શ્રેષ્ઠ એક્સચેન્જ</h3>
                <p className="font-body text-text-muted leading-relaxed mb-6">શ્રેષ્ઠ એક્સચેન્જ વેલ્યુ અને આકર્ષક ફાયદાઓ સાથે તમારી મનપસંદ કાર મેળવો.</p>
                <Link to="/about?service=exchange" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">વધુ માહિતી માટે →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Highlight Banner (Dynamic) */}
        <ArrivingShortly />

        {/* 5. Why Choose Us */}
        {/* Note: You might want to remove the redundant background classes directly inside the WhyChooseUs component now that the Home page handles it */}
        <WhyChooseUs />

        {/* 6. Google Reviews Section (Dynamic API + CSS Marquee) */}
        <GoogleReviews />
      </div>
    </div>
  );
}