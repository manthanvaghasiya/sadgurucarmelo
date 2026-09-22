import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  UploadCloud,
  CheckCircle2,
  X,
  Phone,
  MessageCircle,
  ShieldCheck,
  Banknote,
  Clock,
  Sparkles,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import axiosInstance from '../api/axiosConfig';

const POPULAR_BRANDS = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Toyota', 'Honda',
  'Kia', 'Mahindra', 'Volkswagen', 'Skoda', 'MG', 'Renault', 'Ford'
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

export default function SellYourCar() {
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    carBrand: '',
    carModel: '',
    year: new Date().getFullYear() - 3,
    kmDriven: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    expectedPrice: '',
    notes: '',
  });

  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 10) {
      toast.error('You can upload a maximum of 10 photos');
      return;
    }

    setCompressing(true);
    const toastId = toast.loading('Optimizing images for fast upload...');

    try {
      const compressedFiles = [];
      const newPreviews = [];

      for (const file of files) {
        // Compress client-side to keep under 1MB
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        };
        const compressed = await imageCompression(file, options);
        compressedFiles.push(compressed);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      setPhotos((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      toast.success('Photos added!', { id: toastId });
    } catch (err) {
      console.error('Compression failed:', err);
      toast.error('Failed to process some images', { id: toastId });
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.ownerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.carBrand.trim()) {
      toast.error('Please enter or select your car brand');
      return;
    }
    if (!formData.carModel.trim()) {
      toast.error('Please enter your car model');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your car details...');

    try {
      const data = new FormData();
      data.append('ownerName', formData.ownerName.trim());
      data.append('phone', cleanPhone);
      if (formData.email) data.append('email', formData.email.trim());
      data.append('carBrand', formData.carBrand.trim());
      data.append('carModel', formData.carModel.trim());
      if (formData.year) data.append('year', formData.year);
      if (formData.kmDriven) data.append('kmDriven', formData.kmDriven);
      data.append('fuelType', formData.fuelType);
      data.append('transmission', formData.transmission);
      if (formData.expectedPrice) data.append('expectedPrice', formData.expectedPrice);
      if (formData.notes) data.append('notes', formData.notes.trim());

      if (photos.length > 0) {
        const compressOptions = {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        const compressedPhotos = await Promise.all(
          photos.map(async (photo) => {
            try {
              return await imageCompression(photo, compressOptions);
            } catch (err) {
              console.warn('Sell car photo compression failed, using original', err);
              return photo;
            }
          })
        );
        compressedPhotos.forEach((photo) => {
          data.append('photos', photo);
        });
      }

      const res = await axiosInstance.post('/sell-requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setIsSuccess(true);
        toast.success('Your car selling request has been received!', { id: toastId });
      } else {
        toast.error(res.data.message || 'Submission failed', { id: toastId });
      }
    } catch (err) {
      console.error('Sell car submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit request. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Sell Your Car in Surat | Best Price & Instant Payment | Sadguru Car Melo</title>
        <meta
          name="description"
          content="Sell your pre-owned car at Sadguru Car Melo, Varachha, Surat. Get free doorstep inspection, instant market valuation, transparent paperwork, and spot payment."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header Title Section */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            સુરતમાં તમારી કારનું શ્રેષ્ઠ મૂલ્ય
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 font-heading">
            Sell Your Car at <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">The Best Price</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg font-body leading-relaxed">
            Free valuation, zero hassle, transparent paperwork, and instant payment. Share your vehicle details below and get an offer within 30 minutes.
          </p>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">Best Market Price</p>
                <p className="text-slate-500 text-xs">No middlemen commission</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">Spot Payment</p>
                <p className="text-slate-500 text-xs">Direct bank transfer</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">Free RC Transfer</p>
                <p className="text-slate-500 text-xs">100% legal paperwork</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 font-heading">
              Request Received Successfully!
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8 font-body leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.ownerName}</strong>. Our valuation expert at Sadguru Car Melo will inspect your vehicle details and call you at <strong className="text-slate-900">{formData.phone}</strong> shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/919913634447?text=${encodeURIComponent(
                  `Hello Sadguru Car Melo, I just submitted a sell request for my ${formData.carBrand} ${formData.carModel} (${formData.year}). Please check my valuation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp Directly
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    ownerName: '',
                    phone: '',
                    email: '',
                    carBrand: '',
                    carModel: '',
                    year: new Date().getFullYear() - 3,
                    kmDriven: '',
                    fuelType: 'Petrol',
                    transmission: 'Manual',
                    expectedPrice: '',
                    notes: '',
                  });
                  setPhotos([]);
                  setPreviews([]);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
              >
                Submit Another Vehicle
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Form Container */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 space-y-10"
          >
            {/* Step 1: Car Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <span className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Car Details</h2>
              </div>

              {/* Quick Brand Pills */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Select Brand or Enter Below
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, carBrand: brand }))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        formData.carBrand === brand
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Car Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="carBrand"
                    required
                    placeholder="e.g. Hyundai, Maruti Suzuki"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Car Model & Variant <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    required
                    placeholder="e.g. Creta SX(O) / Swift VXi"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Registration / Manufacturing Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium bg-white"
                  >
                    {yearOptions.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    KM Driven
                  </label>
                  <input
                    type="number"
                    name="kmDriven"
                    placeholder="e.g. 45000"
                    value={formData.kmDriven}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Fuel Type
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {FUEL_TYPES.map((fuel) => (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, fuelType: fuel }))}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          formData.fuelType === fuel
                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Transmission
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSMISSIONS.map((trans) => (
                      <button
                        key={trans}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, transmission: trans }))}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          formData.transmission === trans
                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {trans}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Photos Upload */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-heading">Car Photos</h2>
                    <p className="text-xs text-slate-500 font-body">Upload up to 10 photos (exterior, interior, odometer)</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                  {photos.length}/10 Photos
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-slate-200 hover:border-brand-orange rounded-2xl p-6 text-center transition-all cursor-pointer bg-slate-50/50 hover:bg-brand-orange/5 group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={photos.length >= 10 || compressing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {compressing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-1">
                    Click or Drag to Upload Car Photos
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports JPG, PNG, WEBP (Photos are auto-compressed for quick upload)
                  </p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {previews.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                    >
                      <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Expected Price & Notes */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <span className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Expected Price & Condition</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Expected Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    name="expectedPrice"
                    placeholder="e.g. 550000"
                    value={formData.expectedPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Additional Details / Condition Notes
                  </label>
                  <textarea
                    rows={3}
                    name="notes"
                    placeholder="e.g. 1st owner, full service history at showroom, new tyres, non-accidental..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Contact Info */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <span className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Your Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    placeholder="e.g. Rajesh Patel"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9898558222"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Your details are 100% confidential. No spam guaranteed.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || compressing}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-white font-heading font-bold text-base shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Get Instant Valuation</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Direct Call & WhatsApp Assistance Box */}
        <div className="mt-10 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Prefer speaking with a car valuation expert directly?
            </h3>
            <p className="text-slate-600 text-xs font-body mt-0.5">
              Call us or message on WhatsApp with your car photos for an instant quote.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919913634447"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4" />
              +91 99136 34447
            </a>
            <a
              href="https://wa.me/919913634447?text=Hello%20Sadguru%20Car%20Melo%2C%20I%20want%20to%20sell%20my%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#20bd5a] transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
