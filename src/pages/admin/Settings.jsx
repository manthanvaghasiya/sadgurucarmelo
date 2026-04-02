import { useState } from 'react';
import {
  Save,
  Building2,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Camera,
  Palette,
  AlertCircle,
} from 'lucide-react';

// ── Reusable Toggle Switch ──
function Toggle({ label, description, checked, onChange, accentColor = false }) {
  return (
    <label className="flex items-center justify-between py-4 cursor-pointer group">
      <div className="flex flex-col pr-4">
        <span className="font-body text-sm font-semibold text-text">{label}</span>
        {description && (
          <span className="font-body text-xs text-text-muted mt-0.5 leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-[26px] rounded-full transition-colors duration-200 shrink-0
          ${checked
            ? accentColor
              ? 'bg-accent'
              : 'bg-primary'
            : 'bg-gray-300 group-hover:bg-gray-400'
          }
        `}
      >
        <span
          className={`
            absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-sm
            transition-transform duration-200
            ${checked ? 'translate-x-[22px]' : 'translate-x-0'}
          `}
        />
      </button>
    </label>
  );
}

// ── Reusable Section Card ──
function SettingsCard({ icon: Icon, title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-surface rounded-2xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-[17px] text-text">{title}</h2>
            {subtitle && (
              <p className="font-body text-xs text-text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Reusable Form Input ──
function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
        {Icon && <Icon className="w-3.5 h-3.5 text-text-muted" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Settings() {
  // ── Profile State ──
  const [dealershipName, setDealershipName] = useState('Sadguru Car Melo');
  const [whatsapp, setWhatsapp] = useState('+91 99136 34447');
  const [email, setEmail] = useState('info@sadgurucarmelo.com');
  const [address, setAddress] = useState(
    'Near Petrol Pump, Main Highway Road,\nRajkot, Gujarat 360001'
  );
  const [website, setWebsite] = useState('www.sadgurucarmelo.com');
  const [businessHours, setBusinessHours] = useState('9:00 AM – 8:00 PM');

  // ── Notification Toggles ──
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);
  const [leadReminders, setLeadReminders] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(false);

  // ── Security State ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Save State ──
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    setSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Password validation placeholder
    if (newPassword !== confirmPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const inputClasses =
    'w-full px-4 py-3 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10';

  return (
    <div className="space-y-6 pb-8">
      {/* ═══════════════════════════════════════
          Page Header
         ═══════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">
            Dealership Settings
          </h1>
          <p className="font-body text-sm text-text-muted mt-1 max-w-lg">
            Manage your public profile, security, and notification preferences.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-bold
            transition-all shadow-lg shrink-0 self-start sm:self-auto
            disabled:opacity-70 disabled:cursor-not-allowed
            ${saved
              ? 'bg-[#10b981] text-white shadow-[#10b981]/20'
              : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'
            }
          `}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Changes Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════
          Settings Grid
         ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Card 1: Public Profile ── */}
        <SettingsCard
          icon={Building2}
          title="Public Profile"
          subtitle="Information visible on your website and listings"
          className="lg:row-span-2"
        >
          <div className="space-y-5">
            {/* Logo / Avatar Preview */}
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-heading font-black text-2xl text-white shadow-lg shadow-primary/20 shrink-0">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-text">Dealership Logo</p>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  JPG or PNG. 400×400px recommended.
                </p>
                <button className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-background rounded-lg font-body text-xs font-semibold text-text-muted hover:text-text transition-colors">
                  <Camera className="w-3 h-3" />
                  Change Logo
                </button>
              </div>
            </div>

            <FormField label="Dealership Name" icon={Building2}>
              <input
                type="text"
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <FormField label="Primary WhatsApp Number" icon={Phone}>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className={inputClasses}
              />
            </FormField>

            <FormField label="Contact Email" icon={Mail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                className={inputClasses}
              />
            </FormField>

            <FormField label="Website" icon={Globe}>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.example.com"
                className={inputClasses}
              />
            </FormField>

            <FormField label="Business Hours" icon={Clock}>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="e.g. 9:00 AM – 8:00 PM"
                className={inputClasses}
              />
            </FormField>

            <FormField label="Full Physical Address" icon={MapPin}>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Enter your showroom address..."
                className={`${inputClasses} resize-none`}
              />
            </FormField>
          </div>
        </SettingsCard>

        {/* ── Card 2: Lead Notifications ── */}
        <SettingsCard
          icon={Bell}
          title="Lead Notifications"
          subtitle="Control how you receive lead alerts"
        >
          <div className="divide-y divide-gray-100">
            <Toggle
              label="WhatsApp Alerts for New Leads"
              description="Receive an instant WhatsApp message when a new lead comes in"
              checked={whatsappAlerts}
              onChange={setWhatsappAlerts}
              accentColor
            />
            <Toggle
              label="Email Alerts for Test Drives"
              description="Get an email when someone books a test drive"
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <Toggle
              label="Daily Inventory Summary"
              description="A morning digest of your stock levels and new leads"
              checked={dailySummary}
              onChange={setDailySummary}
            />
            <Toggle
              label="Lead Follow-up Reminders"
              description="Nudges if you haven't responded to a lead within 24 hours"
              checked={leadReminders}
              onChange={setLeadReminders}
            />
            <Toggle
              label="Market Price Drop Alerts"
              description="Notifications when comparable vehicles in your area drop in price"
              checked={priceDropAlerts}
              onChange={setPriceDropAlerts}
            />
          </div>

          {/* Active notification count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="font-body text-xs text-text-muted">
              <span className="font-semibold text-text">
                {[whatsappAlerts, emailAlerts, dailySummary, leadReminders, priceDropAlerts].filter(Boolean).length} of 5
              </span>{' '}
              notifications enabled
            </p>
          </div>
        </SettingsCard>

        {/* ── Card 3: Account Security ── */}
        <SettingsCard
          icon={Shield}
          title="Account Security"
          subtitle="Update your admin password"
        >
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClasses} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClasses} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Strength Hint */}
              {newPassword.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        newPassword.length < 6
                          ? 'w-1/4 bg-red-400'
                          : newPassword.length < 10
                            ? 'w-2/4 bg-[#f59e0b]'
                            : 'w-full bg-[#10b981]'
                      }`}
                    />
                  </div>
                  <span className="font-body text-[11px] text-text-muted font-medium">
                    {newPassword.length < 6 ? 'Weak' : newPassword.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClasses} pr-11 ${
                    passwordMismatch ? 'ring-2 ring-red-500/20 border-red-300' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="flex items-center gap-1 font-body text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                !currentPassword || !newPassword || !confirmPassword || passwordMismatch
              }
              className="flex items-center gap-2 px-5 py-3 border-2 border-primary text-primary rounded-xl font-body text-sm font-bold hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <Shield className="w-4 h-4" />
              Update Password
            </button>
          </form>
        </SettingsCard>
      </div>

      {/* ═══════════════════════════════════════
          Danger Zone
         ═══════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-red-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[17px] text-text">Danger Zone</h2>
              <p className="font-body text-xs text-text-muted mt-0.5">
                Irreversible actions — proceed with caution
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm font-semibold text-text">
              Reset All Inventory Data
            </p>
            <p className="font-body text-xs text-text-muted mt-0.5">
              This will permanently delete all vehicle listings and lead records. This cannot be undone.
            </p>
          </div>
          <button className="px-5 py-2.5 border-2 border-red-200 text-red-500 rounded-xl font-body text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors shrink-0">
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
