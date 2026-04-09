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



export default function Home() {
  const { cars, isLoading } = useCars();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />



      {/* 3. Inventory Grid Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-3">Explore Our Verified Vehicles</h2>
              <p className="font-body text-text-muted max-w-2xl">Quality pre-owned vehicles with complete service history and multi-point inspection.</p>
            </div>
          </div>

          {/* Quick Search Component */}
          <div className="mb-12">
            <QuickSearch />
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
      {/* 2. Core Services Section */}
      <section className="pt-20 pb-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-heading font-bold text-[#d1108a] uppercase tracking-widest mb-4 inline-block">
              પ્રીમિયમ ડીલરશીપ સેવાઓ
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#1a2b3c] mb-6 leading-tight">
              સુરતમાં ખરીદ-વેચાણ અને એક્સચેન્જ માટેનું સંપૂર્ણ સોલ્યુશન
            </h2>
            <p className="font-body text-text-muted text-lg leading-relaxed">
              "પારદર્શક અને ભરોસાપાત્ર સેવાઓ દ્વારા અમે તમારા કારના અનુભવને નવી ઊંચાઈએ લઈ જવા માંગીએ છીએ. તમારી દરેક જરૂરિયાત માટે સુરતનું શ્રેષ્ઠ ઓટોમોટિવ ડેસ્ટિનેશન.અમારું લક્ષ્ય પારદર્શિતા અને અતૂટ વિશ્વાસ સાથે તમને કારની શ્રેષ્ઠ સુવિધાઓ આપવાનું છે. અમે દરેક ગ્રાહકની સુવિધા અને સંતોષ માટે સતત પ્રયત્નશીલ છીએ."
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">સર્ટિફાઈડ કાર ખરીદો</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">તમારા ભરોસા માટે ૧૫૦+ પ્રીમિયમ સર્ટિફાઈડ કાર. દરેક કારની સચોટ તપાસ, તમારી સંપૂર્ણ સુરક્ષા.</p>
              <Link to="/about?service=buy" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">વધુ માહિતી માટે →</Link>
            </div>

            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">તમારી કાર તરત જ વેચો</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">પારદર્શક પ્રક્રિયા અને સુરક્ષિત પેમેન્ટ સાથે તમારી કારનું મેળવો શ્રેષ્ઠ બજાર મૂલ્ય.</p>
              <Link to="/about?service=sell" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">વધુ માહિતી માટે →</Link>
            </div>

            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
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
      <section className="py-24 px-4 bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Certified & Tested Cars</h3>
              <p className="font-body text-text-muted text-sm">Every vehicle undergoes a 120+ point inspection for your peace of mind.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <Landmark className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Easy Loan Assistance</h3>
              <p className="font-body text-text-muted text-sm">Get quick approval and flexible EMI options from top banks.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <Headphones className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Local Surat Support</h3>
              <p className="font-body text-text-muted text-sm">Dedicated local team providing post-purchase assistance and service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Google Reviews Section (Dynamic API + CSS Marquee) */}
      <GoogleReviews />
    </div>
  );
}
