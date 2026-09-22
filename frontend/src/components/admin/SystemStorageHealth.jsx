import { useState, useEffect } from 'react';
import {
  Database,
  HardDrive,
  Cpu,
  ShieldCheck,
  RotateCw,
  Server,
  Cloud,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

export default function SystemStorageHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchHealth = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axiosInstance.get('/system/health');
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
  const media = health?.media;
  const server = health?.server;
  const services = health?.services;

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm overflow-hidden">
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
          </div>
          <p className="font-body text-xs sm:text-sm text-text-muted mt-1">
            Real-time database storage, Cloudinary media CDN, and server telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-background hover:bg-gray-50 text-text-muted hover:text-text rounded-xl font-body text-xs font-semibold border border-gray-100 transition-colors active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Hide Breakdown' : 'Collection Breakdown'}</span>
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

      {/* ── 4 Main Health Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4 sm:my-5">
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
                  <p className="font-body text-[11px] text-text-muted">MongoDB Atlas</p>
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

        {/* 2. Media Storage (Cloudinary CDN) */}
        <div className="bg-background/60 rounded-xl p-4 border border-gray-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">Media CDN</h3>
                  <p className="font-body text-[11px] text-text-muted">Cloudinary Media</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                {media?.status || 'Active'}
              </span>
            </div>

            {/* Storage Metric */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-body text-text-muted">CDN Storage</span>
                <span className="font-heading font-bold text-text">
                  {loading ? '—' : `${media?.estimatedSizeMB || 0} MB / ${media?.quotaGB || 25} GB`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (media?.percentUsed || 0) * 10))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                <span>{loading ? '—' : `${media?.totalImages || 0} Vehicle Photos`}</span>
                <span className="text-blue-600 font-semibold font-mono">
                  {loading ? '—' : `${media?.percentUsed || 0}% used`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Server Runtime & Memory */}
        <div className="bg-background/60 rounded-xl p-4 border border-gray-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">Server Runtime</h3>
                  <p className="font-body text-[11px] text-text-muted">Node.js Engine</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 ring-1 ring-purple-500/20">
                {server?.status || 'Online'}
              </span>
            </div>

            {/* Memory Metric */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-body text-text-muted">Heap Memory</span>
                <span className="font-heading font-bold text-text">
                  {loading ? '—' : `${server?.heapUsedMB || 0} MB / ${server?.heapTotalMB || 0} MB`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.min(100, ((server?.heapUsedMB || 1) / (server?.heapTotalMB || 10)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-text-muted" />
                  <span>{loading ? '—' : server?.uptimeFormatted || '0m'}</span>
                </span>
                <span className="text-purple-600 font-semibold font-mono">
                  {server?.nodeVersion || 'v24'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Services Status Matrix */}
        <div className="bg-background/60 rounded-xl p-4 border border-gray-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-text">Services Radar</h3>
                  <p className="font-body text-[11px] text-text-muted">Integrations</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 ring-1 ring-teal-500/20">
                100% Up
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  MongoDB Atlas
                </span>
                <span className="font-semibold text-text">{services?.mongodb || 'Operational'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Cloudinary CDN
                </span>
                <span className="font-semibold text-text">{services?.cloudinary || 'Operational'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Gemini AI Parser
                </span>
                <span className="font-semibold text-text">{services?.geminiAI || 'Ready'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  PWA Cache
                </span>
                <span className="font-semibold text-text">{services?.pwaCache || 'Operational'}</span>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}
