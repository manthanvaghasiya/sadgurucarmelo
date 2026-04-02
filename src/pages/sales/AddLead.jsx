import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Car,
  IndianRupee,
  Megaphone,
  Flame,
  Thermometer,
  Snowflake,
  StickyNote,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  Save,
} from 'lucide-react';

// ── WhatsApp inline icon ──
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 0C5.385 0 .004 5.38.004 12.025c0 2.126.55 4.195 1.594 6.01L0 24l6.113-1.602a12.035 12.035 0 005.918 1.543h.005c6.643 0 12.028-5.385 12.028-12.025C24.062 5.378 18.675 0 12.031 0zm5.518 14.428c-.303-.152-1.792-.885-2.072-.986-.28-.101-.484-.152-.687.152-.204.303-.783.985-.961 1.189-.177.202-.355.228-.658.076-1.605-.815-2.864-1.879-3.957-3.414-.112-.158.112-.132.41-.726.076-.152.038-.285-.038-.436-.076-.152-.686-1.655-.941-2.264-.247-.59-.498-.51-.687-.52H7.5c-.203 0-.532.076-.811.38C6.409 6.273 5.545 7.085 5.545 8.73c0 1.646.888 3.242 1.015 3.419.127.177 2.316 3.655 5.679 4.972 2.37.934 3.256.784 3.864.654.764-.163 1.792-.733 2.046-1.442.253-.709.253-1.318.177-1.444-.076-.126-.28-.202-.583-.353z" />
    </svg>
  );
}

// ── Reusable Select ──
function FormSelect({ label, icon: Icon, options, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
        {Icon && <Icon className="w-3.5 h-3.5 text-text-muted" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text appearance-none cursor-pointer outline-none transition-all focus:ring-2 focus:ring-primary/10 pr-10"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}

export default function AddLead() {
  const navigate = useNavigate();

  // ── Form State ──
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [carInterest, setCarInterest] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [urgency, setUrgency] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => navigate('/sales'), 1500);
    }, 1200);
  };

  const urgencyIcons = {
    hot: Flame,
    warm: Thermometer,
    cold: Snowflake,
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading font-bold text-xl text-text">Lead Saved!</h2>
          <p className="font-body text-sm text-text-muted">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="min-h-screen bg-background pb-24">
      {/* ═══════════════════════════════════════
          Header
         ═══════════════════════════════════════ */}
      <header className="bg-surface border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center gap-3">
          <Link
            to="/sales"
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-background rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading font-bold text-base text-text leading-tight">
              Log New Customer Inquiry
            </h1>
            <p className="font-body text-[11px] text-text-muted">
              Capture walk-in or call details
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          Form Content
         ═══════════════════════════════════════ */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* ── Section 1: Customer Details ── */}
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-sm text-text">Customer Details</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <User className="w-3.5 h-3.5 text-text-muted" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Patel"
                className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <Phone className="w-3.5 h-3.5 text-text-muted" />
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            {/* WhatsApp Checkbox */}
            <label className="flex items-center gap-3 p-3 bg-background rounded-xl cursor-pointer group">
              <div
                onClick={() => setHasWhatsApp(!hasWhatsApp)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  hasWhatsApp
                    ? 'bg-accent border-accent'
                    : 'bg-transparent border-gray-300 group-hover:border-gray-400'
                }`}
              >
                {hasWhatsApp && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <WhatsAppIcon className="w-4 h-4 text-accent" />
                <span className="font-body text-sm font-medium text-text">
                  Has WhatsApp on this number?
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* ── Section 2: Vehicle Interest ── */}
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-sm text-text">Vehicle Interest</h2>
          </div>
          <div className="p-4 space-y-4">
            <FormSelect
              label="Car of Interest"
              icon={Car}
              value={carInterest}
              onChange={setCarInterest}
              placeholder="Select a vehicle or category"
              options={[
                { value: '2020-creta', label: '2020 Hyundai Creta SX' },
                { value: '2022-nexon', label: '2022 Tata Nexon EV' },
                { value: '2023-city', label: '2023 Honda City V CVT' },
                { value: '2022-swift', label: '2022 Maruti Swift VXI' },
                { value: 'hatchback', label: 'Looking for Hatchback' },
                { value: 'suv', label: 'Looking for SUV' },
                { value: 'sedan', label: 'Looking for Sedan' },
                { value: 'other', label: 'Other / Undecided' },
              ]}
            />

            <FormSelect
              label="Budget Range"
              icon={IndianRupee}
              value={budgetRange}
              onChange={setBudgetRange}
              placeholder="Select budget range"
              options={[
                { value: 'under-5', label: 'Under ₹5 Lakhs' },
                { value: '5-10', label: '₹5 Lakhs – ₹10 Lakhs' },
                { value: '10-15', label: '₹10 Lakhs – ₹15 Lakhs' },
                { value: '15-25', label: '₹15 Lakhs – ₹25 Lakhs' },
                { value: '25-plus', label: '₹25 Lakhs+' },
              ]}
            />
          </div>
        </div>

        {/* ── Section 3: Lead Info ── */}
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center">
              <Megaphone className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-sm text-text">Lead Info</h2>
          </div>
          <div className="p-4 space-y-4">
            <FormSelect
              label="Lead Source"
              icon={Megaphone}
              value={leadSource}
              onChange={setLeadSource}
              placeholder="How did the customer reach us?"
              options={['Walk-in', 'Phone Call', 'Referral', 'Other']}
            />

            <FormSelect
              label="Urgency"
              icon={Flame}
              value={urgency}
              onChange={setUrgency}
              placeholder="How likely are they to buy?"
              options={[
                { value: 'hot', label: '🔥 Hot — Buying this week' },
                { value: 'warm', label: '🌡️ Warm — Exploring options' },
                { value: 'cold', label: '❄️ Cold — Just looking' },
              ]}
            />

            {/* Urgency Visual Indicator */}
            {urgency && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-bold ${
                  urgency === 'hot'
                    ? 'bg-red-50 text-red-500'
                    : urgency === 'warm'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                }`}
              >
                {urgency === 'hot' && <Flame className="w-3.5 h-3.5" />}
                {urgency === 'warm' && <Thermometer className="w-3.5 h-3.5" />}
                {urgency === 'cold' && <Snowflake className="w-3.5 h-3.5" />}
                {urgency === 'hot' && 'Priority lead — follow up immediately'}
                {urgency === 'warm' && 'Good prospect — schedule a follow-up'}
                {urgency === 'cold' && 'Low priority — add to nurture list'}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <StickyNote className="w-3.5 h-3.5 text-text-muted" />
                Salesman Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="e.g. Customer wants to exchange their old Swift. Has finance pre-approval from HDFC Bank. Wants delivery within 10 days..."
                className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10 resize-none"
              />
              <p className="font-body text-[11px] text-text-muted/50 text-right">
                {notes.length} / 500
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Sticky Bottom Action Bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-gray-100 z-30">
        <div className="max-w-lg mx-auto px-4 py-3.5">
          <button
            type="submit"
            disabled={isSaving || !fullName || !mobile}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-body font-bold text-base transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Lead Data
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
