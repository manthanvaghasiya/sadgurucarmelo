import { useState, useEffect } from 'react';
import {
  Database,
  HardDrive,
  RotateCw,
  Layers,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  ExternalLink,
  ArrowRight,
  X,
  Info,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

export default function SystemStorageHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('imagekit_alert_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showModalManual, setShowModalManual] = useState(false);

  const fetchHealth = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const endpoint = isManual ? '/system/health?refresh=true' : '/system/health';
      const res = await axiosInstance.get(endpoint);
      if (res.data?.success) {
        setHealth(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchHealth(), 60000);
    return () => clearInterval(interval);
  }, []);

  const db = health?.database;
  const imagekit = health?.imagekit || health?.media;
  const services = health?.services;

  // 80% quota warning state (live from ImageKit API)
  const isWarningActive = Boolean(imagekit?.isWarning80);

  // Storage metrics (live from ImageKit API)
  const storageQuotaGB = imagekit?.storage?.quotaGB || 20;
  const storageUsedGB = imagekit?.storage?.usedGB ?? 0;
  const storagePercent = Number(imagekit?.storage?.percentUsed ?? 0);
  const storageUsedFormatted =
    storageUsedGB >= 1
      ? `${storageUsedGB.toFixed(2)} GB`
      : `${(storageUsedGB * 1024).toFixed(1)} MB`;

  // Bandwidth metrics (live from ImageKit API)
  const bandwidthQuotaGB = imagekit?.bandwidth?.quotaGB || 20;
  const bandwidthUsedGB = imagekit?.bandwidth?.usedGB ?? 0;
  const bandwidthPercent = Number(imagekit?.bandwidth?.percentUsed ?? 0);
  const bandwidthUsedFormatted =
    bandwidthUsedGB >= 1
      ? `${bandwidthUsedGB.toFixed(2)} GB`
      : `${(bandwidthUsedGB * 1024).toFixed(1)} MB`;

  // Big modal open condition (automatic when live 80% is hit and not dismissed, or manual click)
  const isModalOpen = (isWarningActive && !modalDismissed) || showModalManual;

  const handleDismissModal = () => {
    setModalDismissed(true);
    setShowModalManual(false);
    try {
      sessionStorage.setItem('imagekit_alert_dismissed', 'true');
    } catch { }
  };

  const getBarColor = (percent) => {
    if (percent >= 80) return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]';
    if (percent >= 60) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'bg-emerald-500';
  };

  const getBadgeColor = (percent) => {
    if (percent >= 80) return 'bg-red-50 text-red-600 ring-red-500/20';
    if (percent >= 60) return 'bg-amber-50 text-amber-600 ring-amber-500/20';
    return 'bg-emerald-50 text-emerald-600 ring-emerald-500/20';
  };

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm overflow-hidden relative">
      {/* ── Top Warning Banner if >= 80% ── */}
      {isWarningActive && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-[pulse_3s_ease-in-out_infinite]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-heading font-bold text-sm text-red-700">
                  ImageKit 80%+ Quota Threshold Triggered
                </p>
              </div>
              <p className="font-body text-xs text-red-600/90 mt-0.5">
                Storage ({storagePercent}%) or Bandwidth ({bandwidthPercent}%) has reached the critical 80% mark. Review developer action options to avoid image interruption.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModalManual(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-body text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95 shrink-0"
          >
            <span>View 80% Action Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-50">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-text">
              System Storage Health
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-[#10b981]/10 text-[#059669] ring-1 ring-[#10b981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              All Systems Operational
            </span>
            {isWarningActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-red-500/10 text-red-600 ring-1 ring-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                80% Quota Alert Active
              </span>
            )}
          </div>
          <p className="font-body text-xs sm:text-sm text-text-muted mt-1">
            Real-time MongoDB Atlas database storage and ImageKit.io media & bandwidth telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">

          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-background hover:bg-gray-50 text-text-muted hover:text-text rounded-xl font-body text-xs font-semibold border border-gray-100 transition-colors active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Hide Collections' : 'Collection Breakdown'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => fetchHealth(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-primary/5 hover:bg-primary/10 text-primary rounded-xl font-body text-xs font-semibold transition-colors disabled:opacity-50 active:scale-95"
            title="Refresh Health Metrics"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Checking...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* ── 3 Main Health Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-4 sm:my-5">
        {/* 1. Database Storage (MongoDB Atlas) */}
        <div className="bg-background/60 rounded-xl p-3.5 sm:p-4 border border-gray-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">Database Storage</h3>
                  <p className="font-body text-[11px] text-text-muted">MongoDB Atlas (M0)</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
                {db?.status || 'Connected'}
              </span>
            </div>

            {/* Storage Metric */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-body text-text-muted">Storage Used</span>
                <span className="font-heading font-bold text-text">
                  {loading ? '—' : `${db?.storageSizeMB || 0} MB / ${db?.quotaMB || 512} MB`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (db?.percentUsed || 0) * 10))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                <span>{loading ? '—' : `${db?.totalRecords || 0} Documents`}</span>
                <span className="text-emerald-600 font-semibold font-mono">
                  {loading ? '—' : `${db?.latencyMs || 0} ms ping`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ImageKit Storage (Media Assets) */}
        <div className={`bg-background/60 rounded-xl p-4 border flex flex-col justify-between transition-all ${storagePercent >= 80 ? 'border-red-300 ring-1 ring-red-400/30' : 'border-gray-100/80'
          }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${storagePercent >= 80
                    ? 'bg-red-500/15 text-red-600'
                    : storagePercent >= 60
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-indigo-500/10 text-indigo-600'
                  }`}>
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">ImageKit Storage</h3>
                  <p className="font-body text-[11px] text-text-muted">Media CDN (20 GB Free)</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ring-1 ${imagekit?.configured
                  ? getBadgeColor(storagePercent)
                  : 'bg-amber-50 text-amber-600 ring-amber-500/20'
                }`}>
                {imagekit?.configured ? 'Connected' : 'Setup Required'}
              </span>
            </div>

            {/* Storage Metric */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-body text-text-muted">Storage Used</span>
                <span className="font-heading font-bold text-text">
                  {loading ? '—' : `${storageUsedFormatted} / ${storageQuotaGB} GB`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(storagePercent)}`}
                  style={{ width: `${Math.max(2, Math.min(100, storagePercent))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                <span>{loading ? '—' : `${imagekit?.totalImages || 0} Photos Hosted`}</span>
                <span className={`font-semibold font-mono ${storagePercent >= 80
                    ? 'text-red-600 font-bold animate-pulse'
                    : storagePercent >= 60
                      ? 'text-amber-600'
                      : 'text-indigo-600'
                  }`}>
                  {loading ? '—' : `${storagePercent}% full`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ImageKit Bandwidth (Monthly Data Egress) */}
        <div className={`bg-background/60 rounded-xl p-4 border flex flex-col justify-between transition-all ${bandwidthPercent >= 80 ? 'border-red-300 ring-1 ring-red-400/30' : 'border-gray-100/80'
          }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bandwidthPercent >= 80
                    ? 'bg-red-500/15 text-red-600'
                    : bandwidthPercent >= 60
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-cyan-500/10 text-cyan-600'
                  }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">ImageKit Bandwidth</h3>
                  <p className="font-body text-[11px] text-text-muted">Monthly Egress (20 GB)</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ring-1 ${getBadgeColor(bandwidthPercent)}`}>
                {imagekit?.configured ? 'Active Sync' : 'Estimated'}
              </span>
            </div>

            {/* Bandwidth Metric */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-body text-text-muted">Monthly Egress</span>
                <span className="font-heading font-bold text-text">
                  {loading ? '—' : `${bandwidthUsedFormatted} / ${bandwidthQuotaGB} GB`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(bandwidthPercent)}`}
                  style={{ width: `${Math.max(2, Math.min(100, bandwidthPercent))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                <span>Monthly Rolling Cycle</span>
                <span className={`font-semibold font-mono ${bandwidthPercent >= 80
                    ? 'text-red-600 font-bold animate-pulse'
                    : bandwidthPercent >= 60
                      ? 'text-amber-600'
                      : 'text-cyan-600'
                  }`}>
                  {loading ? '—' : `${bandwidthPercent}% full`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Services Integration Matrix ── */}
      <div className="mt-2 pt-3 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-text-muted font-semibold">Live Integrations:</span>
          <span className="inline-flex items-center gap-1.5 text-text">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            MongoDB Atlas
          </span>
          <span className="inline-flex items-center gap-1.5 text-text">
            <span className={`w-2 h-2 rounded-full ${imagekit?.configured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            ImageKit.io CDN
          </span>
          <span className="inline-flex items-center gap-1.5 text-text">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Gemini AI Parser
          </span>
          <span className="inline-flex items-center gap-1.5 text-text">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            PWA Smart Cache
          </span>
        </div>

        {isWarningActive && (
          <button
            onClick={() => setShowModalManual(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 flex items-center gap-1"
          >
            <span>Review 80% Quota Action Plan</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── Collapsible Breakdown Drawer ── */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-[fadeScale_200ms_ease-out]">
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-muted mb-3">
            MongoDB Database Collection Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {[
              { label: 'Vehicles', count: db?.breakdown?.cars || 0, icon: '🚗' },
              { label: 'Inquiries / Msgs', count: db?.breakdown?.messages || 0, icon: '💬' },
              { label: 'Sell Requests', count: db?.breakdown?.sellRequests || 0, icon: '💰' },
              { label: 'Promo Posters', count: db?.breakdown?.posters || 0, icon: '🎨' },
              { label: 'Deliveries', count: db?.breakdown?.happyCustomers || 0, icon: '🤝' },
              { label: 'Analytics Days', count: db?.breakdown?.analytics || 0, icon: '📊' },
            ].map((col) => (
              <div
                key={col.label}
                className="bg-background rounded-lg p-2.5 sm:p-3 border border-gray-100 flex items-center gap-2"
              >
                <span className="text-base shrink-0">{col.icon}</span>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm text-text leading-none">{col.count}</p>
                  <p className="font-body text-[11px] text-text-muted truncate mt-1">{col.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── BIG 80% QUOTA WARNING MODAL (Developer-Grade UX) ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-[fadeIn_200ms_ease-out]">
          <div className="bg-surface max-w-2xl w-full rounded-3xl border border-red-500/30 p-6 sm:p-8 shadow-2xl shadow-red-500/10 relative overflow-hidden my-8">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* Close Button */}
            <button
              onClick={handleDismissModal}
              className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-text hover:bg-background/80 transition-colors z-10"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-600 flex items-center justify-center shrink-0 ring-4 ring-red-500/20">
                <AlertTriangle className="w-7 h-7 animate-bounce" />
              </div>
              <div className="pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 ring-1 ring-red-500/20 uppercase tracking-wider">
                    High Capacity Warning (80%+)
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-text mt-1.5 leading-tight">
                  ImageKit Storage or Bandwidth Near Capacity
                </h3>
                <p className="font-body text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                  ImageKit Free Tier provides <strong>20 GB of cloud storage</strong> and <strong>20 GB of monthly bandwidth</strong>. Your account has exceeded the 80% safety margin. Review the live breakdown and select a recommended developer solution below to guarantee continuous photo loading.
                </p>
              </div>
            </div>

            {/* Live Dual Quota Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 p-4 rounded-2xl bg-background/80 border border-gray-100">
              {/* Storage Gauge */}
              <div className="p-3 bg-surface rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-body font-semibold text-text flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                    Storage Used
                  </span>
                  <span className={`font-mono font-bold ${storagePercent >= 80 ? 'text-red-600' : 'text-text'}`}>
                    {storagePercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
                  {/* 80% marker */}
                  <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-400 z-10" title="80% Threshold" />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(storagePercent)}`}
                    style={{ width: `${Math.min(100, storagePercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                  <span>{storageUsedFormatted} used</span>
                  <span>Limit: {storageQuotaGB} GB</span>
                </div>
              </div>

              {/* Bandwidth Gauge */}
              <div className="p-3 bg-surface rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-body font-semibold text-text flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-500" />
                    Monthly Bandwidth
                  </span>
                  <span className={`font-mono font-bold ${bandwidthPercent >= 80 ? 'text-red-600' : 'text-text'}`}>
                    {bandwidthPercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
                  {/* 80% marker */}
                  <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-400 z-10" title="80% Threshold" />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(bandwidthPercent)}`}
                    style={{ width: `${Math.min(100, bandwidthPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                  <span>{bandwidthUsedFormatted} used</span>
                  <span>Limit: {bandwidthQuotaGB} GB</span>
                </div>
              </div>
            </div>

            {/* 3 Developer-Grade Action Options */}
            <div className="space-y-3">
              <p className="font-heading font-bold text-xs uppercase tracking-wider text-text-muted">
                Recommended Developer Solutions
              </p>

              {/* Option 1: Upgrade ImageKit */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-gray-100 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-text">
                      Option 1: Upgrade ImageKit Plan (Instant Scale)
                    </h4>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Expand storage and bandwidth immediately to 100 GB+ from the ImageKit console. No code changes required.
                    </p>
                  </div>
                </div>
                <a
                  href="https://imagekit.io/dashboard/settings/plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary text-white rounded-xl font-body text-xs font-bold hover:bg-primary-hover transition-colors shrink-0 shadow-sm shadow-primary/20"
                >
                  <span>Open ImageKit</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Option 2: Clean Up Sold Vehicle Photos */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-gray-100 hover:border-amber-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-text">
                      Option 2: Clean Up Sold Vehicle Photos
                    </h4>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Delete media for vehicles that are already marked as "Sold" to immediately free up space below 80%.
                    </p>
                  </div>
                </div>
                <a
                  href="/admin/inventory"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-background hover:bg-gray-100 text-text rounded-xl font-body text-xs font-semibold border border-gray-200 transition-colors shrink-0"
                >
                  <span>Manage Cars</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Info className="w-4 h-4 text-primary" />
                <span>Alert triggers automatically on any session crossing 80% quota.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDismissModal}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-body text-xs font-bold transition-all active:scale-95 shadow-md shadow-accent/20"
                >
                  Acknowledge & Snooze Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
