/**
 * @file frontend/src/components/sell/SellCarForm.jsx
 * @description Master interactive valuation and car submission form for the Sell Car page,
 * supporting client-side image compression, brand quick-pills, and instant quote dispatch.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  UploadCloud,
  CheckCircle2,
  X,
  Phone,
  ShieldCheck,
  Banknote,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { POPULAR_BRANDS, FUEL_TYPES, TRANSMISSIONS } from '../../data/sellCarData';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function SellCarForm({
  formRef,
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
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - i);

  return (
    <section
      ref={formRef}
      id="sell-car-form-section"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> ત્વરિત મૂલ્યાંકન · INSTANT QUOTE FORM
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            તમારી કારની વિગતો{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              અહીં દાખલ કરો
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            માત્ર 2 મિનિટમાં કારની માહિતી ભરો. અમારા કાર એક્સપર્ટ 30 મિનિટમાં તમને સીધો સંપર્ક કરશે.
          </p>
        </div>

        {/* ── SUCCESS STATE VIEW ── */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F8FAFC] rounded-[32px] p-8 sm:p-12 md:p-16 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 font-heading">
              વિનંતી સફળતાપૂર્વક મળી ગઈ છે!
            </h3>
            <span className="text-sm font-mono text-emerald-600 font-bold block mb-4">
              Sell Request Submitted Successfully
            </span>
            <p className="text-slate-600 max-w-lg mx-auto mb-8 font-body text-sm sm:text-base leading-relaxed">
              ધન્યવાદ, <strong className="text-slate-950 font-bold">{formData.ownerName}</strong>! સદગુરુ કાર મેળોના વેલ્યુએશન એક્સપર્ટ તમારી કારની વિગતો તપાસીને ટૂંક સમયમાં તમારા મોબાઈલ નંબર{' '}
              <strong className="text-slate-950 font-bold">{formData.phone}</strong> પર કોલ કરશે.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <a
                href={buildWhatsAppUrl(
                  `નમસ્તે સદગુરુ કાર મેળો, મેં મારી ${formData.carBrand} ${formData.carModel} (${formData.year}) વેચવા માટે વિનંતી મોકલી છે. કૃપા કરીને વેલ્યુએશન કન્ફર્મ કરશો.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>WhatsApp પર સીધી વાત કરો</span>
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-heading font-bold text-sm hover:bg-white transition-all hover:border-slate-400"
              >
                બીજી કાર સબમિટ કરો
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── MAIN HIGH-CONVERSION FORM CONTAINER ── */
          <form
            onSubmit={handleSubmit}
            className="bg-[#F8FAFC] rounded-[32px] p-6 sm:p-10 md:p-12 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-10"
          >
            {/* Step 1: Car Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-slate-950 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                  1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                    કારની પ્રાથમિક વિગતો (Car Details)
                  </h3>
                  <p className="text-xs text-slate-500 font-body">બ્રાન્ડ, મોડેલ, વર્ષ અને ટ્રાન્સમિશન પસંદ કરો</p>
                </div>
              </div>

              {/* Popular Brand Pills */}
              <div className="mb-5">
                <label className="block text-xs font-heading font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  લોકપ્રિય બ્રાન્ડ્સ (Quick Select):
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                        formData.carBrand === brand
                          ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-orange/40 hover:bg-slate-50'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    કાર બ્રાન્ડ (Car Brand) <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="carBrand"
                    required
                    placeholder="દા.ત. Hyundai, Maruti Suzuki"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    કાર મોડેલ &amp; વેરિઅન્ટ <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    required
                    placeholder="દા.ત. Creta SX(O) / Swift VXi"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    રજિસ્ટ્રેશન / મેન્યુફેક્ચરિંગ વર્ષ
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  >
                    {yearOptions.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    કિલોમીટર ચાલેલી (KM Driven)
                  </label>
                  <input
                    type="number"
                    name="kmDriven"
                    placeholder="દા.ત. 45000"
                    value={formData.kmDriven}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ફ્યુઅલ ટાઇપ (Fuel Type)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {FUEL_TYPES.map((fuel) => (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'fuelType', value: fuel } })}
                        className={`py-2 rounded-xl text-xs font-heading font-black border transition-all text-center cursor-pointer ${
                          formData.fuelType === fuel
                            ? 'border-brand-orange bg-brand-orange text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ટ્રાન્સમિશન (Transmission)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSMISSIONS.map((trans) => (
                      <button
                        key={trans}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'transmission', value: trans } })}
                        className={`py-2 rounded-xl text-xs font-heading font-black border transition-all text-center cursor-pointer ${
                          formData.transmission === trans
                            ? 'border-brand-orange bg-brand-orange text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-950 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                    2
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                      કારના ફોટા (Car Photos)
                    </h3>
                    <p className="text-xs text-slate-500 font-body">મહત્તમ 10 ફોટા (આગળ, પાછળ, ઇન્ટિરિયર અને મીટર)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-700 shadow-xs">
                  {photos.length}/10 Photos
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-orange rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer bg-white hover:bg-amber-50/20 group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={photos.length >= 10 || compressing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {compressing ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <UploadCloud className="w-7 h-7" />
                    )}
                  </div>
                  <p className="font-heading font-black text-slate-900 text-sm sm:text-base mb-1">
                    ફોટા પસંદ કરવા માટે ક્લિક કરો અથવા અહીં ડ્રેગ કરો
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    JPG, PNG, WEBP સપોર્ટેડ છે (ઓટો-કમ્પ્રેસ થઈને ઝડપથી અપલોડ થશે)
                  </p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {previews.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs group"
                    >
                      <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Expected Valuation & Notes */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-slate-950 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                    અપેક્ષિત કિંમત &amp; સ્થિતિ (Expected Price &amp; Notes)
                  </h3>
                  <p className="text-xs text-slate-500 font-body">તમારી અપેક્ષા અને કારની વિશેષતા જણાવો</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    અપેક્ષિત વેચાણ કિંમત (₹ Expected Price)
                  </label>
                  <input
                    type="number"
                    name="expectedPrice"
                    placeholder="દા.ત. 550000"
                    value={formData.expectedPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    વધારાની માહિતી / કારની કન્ડિશન
                  </label>
                  <textarea
                    rows={3}
                    name="notes"
                    placeholder="દા.ત. 1st Owner, કંપની સર્વિસ રેકોર્ડ, નવા ટાયર, નોન-એક્સિડેન્ટલ..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Contact Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-slate-950 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                  4
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                    સંપર્ક વિગતો (Your Contact Information)
                  </h3>
                  <p className="text-xs text-slate-500 font-body">ઓફર મેળવવા માટે સાચો મોબાઈલ નંબર લખો</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    તમારું પૂરું નામ <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    placeholder="દા.ત. રાજેશભાઈ પટેલ"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    મોબાઈલ નંબર <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="દા.ત. 9898558222"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ઈમેઇલ એડ્રેસ (વૈકલ્પિક)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-medium text-slate-900 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Submit Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>તમારી માહિતી 100% સુરક્ષિત અને ગુપ્ત રહેશે. No Spam Guarantee.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || compressing}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-white font-heading font-black text-sm sm:text-base shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>સબમિટ થઈ રહ્યું છે...</span>
                  </>
                ) : (
                  <>
                    <span>ત્વરિત માર્કેટ વેલ્યુ મેળવો</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
