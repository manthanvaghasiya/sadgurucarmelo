import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, Zap, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

const INQUIRY_TYPES = [
  { id: 'Buy Car', label: 'કાર ખરીદવી છે', en: 'Buy a Car', icon: '🚗' },
  { id: 'Sell Car', label: 'કાર વેચવી છે', en: 'Sell My Car', icon: '💰' },
  { id: 'Exchange', label: 'એક્સચેન્જ', en: 'Exchange', icon: '🔄' },
  { id: 'Finance', label: 'લોન / EMI', en: 'Loan / EMI', icon: '🏦' },
  { id: 'General', label: 'અન્ય પૂછપરછ', en: 'General', icon: '💬' },
];

export default function ContactInquiryForm() {
  const [selectedType, setSelectedType] = useState('Buy Car');
  const [preferredContact, setPreferredContact] = useState('WhatsApp');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        type: selectedType,
        message: `[Purpose: ${selectedType}] [Preferred: ${preferredContact}] ${formData.message}`,
      };

      await axiosInstance.post('/messages', payload);
      toast.success('તમારો Message સફળતાપૂર્વક મોકલાયો છે! અમારી ટીમ ટૂંક સમયમાં સંપર્ક કરશે.');
      reset();
    } catch (error) {
      console.error('Failed to submit contact message:', error);
      toast.error('Message મોકલવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો અથવા સીધો ફોન કરો.');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-heading font-semibold tracking-wider uppercase mb-2.5">
          <Sparkles className="w-3.5 h-3.5" /> ઝડપી સંપર્ક ફોર્મ · FAST INQUIRY DESK
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          અમને તમારી જરૂરિયાત જણાવો
        </h2>
        <p className="font-body text-slate-600 text-sm mt-1 leading-relaxed">
          નીચે વિગતો ભરો — અમારા સિનિયર કન્સલ્ટન્ટ 15 મિનિટમાં યોગ્ય માહિતી સાથે તમારો સંપર્ક કરશે.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        {/* Purpose Selector Pills */}
        <div>
          <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            પૂછપરછનો હેતુ પસંદ કરો · Select Purpose *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INQUIRY_TYPES.map((t) => {
              const isSelected = selectedType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-heading font-bold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/15 scale-[1.02]'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base leading-none">{t.icon}</span>
                  <div className="flex flex-col">
                    <span className="leading-tight">{t.label}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {t.en}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name and Phone Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              તમારું નામ · Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-body text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
                {...register('name', { required: 'નામ લખવું જરૂરી છે (Name is required)' })}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs font-body mt-1 block">{errors.name.message}</span>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              મોબાઇલ નંબર · Mobile Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                placeholder="e.g. 98765 43210"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-body text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all ${
                  errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
                {...register('phone', {
                  required: 'મોબાઇલ નંબર જરૂરી છે (Phone is required)',
                  pattern: {
                    value: /^[0-9+\-\s()]{10,15}$/,
                    message: 'કૃપા કરીને સાચો મોબાઇલ નંબર દાખલ કરો',
                  },
                })}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-xs font-body mt-1 block">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Email and Preferred Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div>
            <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ઇમેઇલ એડ્રેસ · Email (ઓપ્શનલ)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. ramesh@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-body text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all"
                {...register('email')}
              />
            </div>
          </div>

          {/* Preferred Contact Mode */}
          <div>
            <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              સંપર્ક કરવાની પસંદગી · Preferred Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreferredContact('WhatsApp')}
                className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer ${
                  preferredContact === 'WhatsApp'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>💬 WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setPreferredContact('Call')}
                className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer ${
                  preferredContact === 'Call'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>📞 Phone Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message / Requirements */}
        <div>
          <label className="block font-heading text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            તમારો મેસેજ અથવા કાર વિશે વિગત · Message & Requirements *
          </label>
          <div className="relative">
            <textarea
              rows={4}
              placeholder={
                selectedType === 'Buy Car'
                  ? 'E.g. I am looking for a certified Kia Seltos or Hyundai Creta (2020-2023), Diesel or Petrol, budget around ₹11-13 Lakhs.'
                  : selectedType === 'Sell Car'
                  ? 'E.g. I want to sell my Maruti Swift VXI 2021 model, single owner, 35,000 km driven, GJ-05 registered.'
                  : 'How can our dealership team assist you today? Feel free to ask about any car model, pricing, or inspection.'
              }
              className={`w-full p-4 bg-slate-50 border rounded-2xl font-body text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all resize-none ${
                errors.message ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
              }`}
              {...register('message', { required: 'મેસેજ લખવો જરૂરી છે (Message is required)' })}
            />
          </div>
          {errors.message && (
            <span className="text-red-500 text-xs font-body mt-1 block">{errors.message.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-orange via-amber-500 to-amber-600 hover:from-accent-hover hover:to-amber-700 text-white font-heading font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-orange/25 hover:shadow-xl hover:shadow-brand-orange/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>મેસેજ મોકલાઈ રહ્યો છે... Sending Inquiry</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>સંપર્ક સબમિટ કરો · Send Priority Inquiry</span>
              </>
            )}
          </button>
        </div>

        {/* Trust Safeguards */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-slate-500 text-[11px] font-body font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% ગોપનીયતા સુરક્ષિત (Privacy Protected)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>15-મિનિટમાં ઝડપી રિસ્પોન્સ ગેરંટી</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>કોઈ છૂપો ચાર્જ નથી (Zero Obligation)</span>
          </div>
        </div>
      </form>
    </div>
  );
}
