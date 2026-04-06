import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Phone, Clock, Plus, CheckCircle2,
  ChevronRight, MessageCircle, Flame, Thermometer,
  Snowflake, CalendarClock, TrendingUp, UserCircle, AlertCircle,
  Car, MapPin, X
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// ── Status config ──
const statusConfig = {
  New: { dot: 'bg-[#f59e0b]', text: 'text-[#d97706]', bg: 'bg-[#f59e0b]/10' },
  Contacted: { dot: 'bg-[#3b82f6]', text: 'text-[#2563eb]', bg: 'bg-[#3b82f6]/10' },
  'Follow-up': { dot: 'bg-[#8b5cf6]', text: 'text-[#7c3aed]', bg: 'bg-[#8b5cf6]/10' },
  Closed: { dot: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-100' },
};

// ── Urgency config ──
const urgencyConfig = {
  Hot: { icon: Flame, text: 'text-red-500', bg: 'bg-red-50' },
  Warm: { icon: Thermometer, text: 'text-amber-600', bg: 'bg-amber-50' },
  Cold: { icon: Snowflake, text: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
};

export default function SalesDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, newCount: 0, followUp: 0, todayFollowUps: 0 });
  const [callingLeadId, setCallingLeadId] = useState(null);
  const [activeCallLead, setActiveCallLead] = useState(null);
  const [callOutcome, setCallOutcome] = useState('complete');
  const [callNotes, setCallNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [processedTodayIds, setProcessedTodayIds] = useState(new Set());

  // ── Fetch leads from API ──
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axiosInstance.get('/leads'),
        axiosInstance.get('/leads/stats'),
      ]);
      if (leadsRes.data.success) setLeads(leadsRes.data.data || []);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Compute today's follow-ups ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFollowUps = leads.filter(l => {
    if (processedTodayIds.has(l._id)) return true;
    if (!l.followUpDate) return false;
    const d = new Date(l.followUpDate);
    return d >= today && d < tomorrow;
  });

  // ── Recent leads (last 5) ──
  const recentLeads = leads.slice(0, 5);

  // ── Quick status update ──
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      toast.success(`Lead marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  // ── Call Log Logic ──
  const handleCallClick = (lead) => {
    setCallingLeadId(lead._id);
    window.location.href = `tel:${lead.phone}`;

    // Automatically pop up the log dialog after a brief delay
    setTimeout(() => {
      setCallingLeadId(null);
      setActiveCallLead(lead);
      setCallOutcome('complete');
      setCallNotes('');
      setNextFollowUp('');
    }, 2500);
  };

  const handleSubmitCallLog = async () => {
    if (!activeCallLead) return;
    setIsSubmittingLog(true);
    try {
      const payload = {};

      if (callNotes) {
        const dateStamp = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const prefix = callOutcome === 'decline' ? '[Declined]' : '[Follow-up]';
        const newEntry = `[${dateStamp}] ${prefix} ${callNotes}`;
        payload.notes = activeCallLead.notes
          ? `${activeCallLead.notes}\n\n${newEntry}`
          : newEntry;
      }

      if (callOutcome === 'complete') {
        if (nextFollowUp) {
          payload.followUpDate = nextFollowUp;
        }
        payload.status = 'Follow-up';
      } else {
        payload.status = 'Closed';
        payload.followUpDate = null;
      }

      const { data } = await axiosInstance.put(`/leads/${activeCallLead._id}`, payload);

      setLeads(prev => prev.map(l => l._id === activeCallLead._id ? { ...l, ...payload } : l));
      setProcessedTodayIds(prev => new Set(prev).add(activeCallLead._id));
      toast.success('Call log saved!');
      setActiveCallLead(null);
    } catch (err) {
      toast.error('Failed to save call log');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // ── KPIs ──
  const kpis = [
    {
      title: 'Total Leads',
      value: stats.total,
      subtitle: 'All time',
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'New Leads',
      value: stats.newCount,
      subtitle: 'Needs attention',
      icon: AlertCircle,
      iconBg: 'bg-[#f59e0b]/10',
      iconColor: 'text-[#d97706]',
      highlight: stats.newCount > 0,
    },
    {
      title: "Today's Follow-ups",
      value: todayFollowUps.length,
      subtitle: `${stats.followUp} total pending`,
      icon: CalendarClock,
      iconBg: 'bg-[#8b5cf6]/10',
      iconColor: 'text-[#8b5cf6]',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-body text-sm text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Call Log Modal ── */}
      {activeCallLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setActiveCallLead(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-bold text-lg text-text">Log Call</h3>
              <button onClick={() => setActiveCallLead(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4 text-text-muted" /></button>
            </div>

            <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
              <p className="font-body text-xs text-text-muted">Recording details for</p>
              <p className="font-heading font-bold text-base text-primary truncate">{activeCallLead.customerName}</p>
            </div>

            <div className="flex bg-background rounded-lg p-1.5 border border-gray-100">
              <button
                onClick={() => setCallOutcome('complete')}
                className={`flex-1 py-2 font-body text-xs font-bold rounded-md transition-all ${callOutcome === 'complete' ? 'bg-surface shadow text-primary' : 'text-text-muted hover:text-text'}`}
              >
                Complete Follow-up
              </button>
              <button
                onClick={() => setCallOutcome('decline')}
                className={`flex-1 py-2 font-body text-xs font-bold rounded-md transition-all ${callOutcome === 'decline' ? 'bg-surface shadow text-red-500' : 'text-text-muted hover:text-text'}`}
              >
                Decline Lead
              </button>
            </div>

            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                {callOutcome === 'decline' ? 'Reason for decline' : 'Client Response / Notes'}
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={3}
                placeholder={callOutcome === 'decline' ? 'e.g., Client is no longer interested...' : 'What did they say?'}
                className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </div>

            {callOutcome === 'complete' && (
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            )}

            <button
              onClick={handleSubmitCallLog}
              disabled={isSubmittingLog || (callOutcome === 'complete' && !nextFollowUp)}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-body font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmittingLog ? 'Saving...' : <><CheckCircle2 className="w-4 h-4" /> Save Call Log</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="bg-surface border-b border-gray-100 px-4 sm:px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-body text-xs text-text-muted uppercase tracking-wider">Sales Executive</p>
            <h1 className="font-heading font-bold text-xl text-text capitalize">
              Welcome, {user?.name} 👋
            </h1>
          </div>
          <button
            onClick={() => navigate('/sales/add-lead')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Lead</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className={`bg-surface rounded-2xl border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all group ${kpi.highlight ? 'border-[#f59e0b]/30' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${kpi.iconColor}`} strokeWidth={2} />
                  </div>
                  {kpi.highlight && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b]/40" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f59e0b]" />
                    </span>
                  )}
                </div>
                <p className="font-heading font-bold text-2xl text-text leading-none mb-1">{kpi.value}</p>
                <p className="font-body text-xs font-semibold text-text-muted">{kpi.title}</p>
                <p className="font-body text-xs text-text-muted/60 mt-0.5">{kpi.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* ── Today's Follow-ups ── */}
        {todayFollowUps.length > 0 && (
          <div className="bg-surface rounded-2xl border border-[#8b5cf6]/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-text flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[#8b5cf6]" />
                Today's Follow-ups
              </h2>
              <span className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-full font-body text-xs font-bold">
                {todayFollowUps.length}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {todayFollowUps.map((lead) => {
                const uCfg = urgencyConfig[lead.urgency] || urgencyConfig['Warm'];
                const UrgencyIcon = uCfg.icon;
                return (
                  <div key={lead._id} className={`flex items-center justify-between py-3 rounded-xl transition-all duration-300 ${callingLeadId === lead._id ? 'bg-green-500/10 border border-green-200 px-3 -mx-3 shadow-sm' : processedTodayIds.has(lead._id) ? 'bg-[#10b981]/10 border border-[#10b981]/20 px-3 -mx-3' : ''}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 ${uCfg.bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <UrgencyIcon className={`w-4 h-4 ${uCfg.text}`} />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-body text-sm font-semibold text-text truncate">{lead.customerName}</p>
                        <p className="font-body text-xs text-text-muted flex items-center gap-3">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary/60" />{lead.source}</span>
                        </p>
                        {lead.carOfInterest && (
                          <p className="font-body text-xs text-primary flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {lead.carOfInterest.year} {lead.carOfInterest.make} {lead.carOfInterest.model}
                          </p>
                        )}
                        {lead.notes && (
                          <p className="font-body text-[11px] text-text-muted/80 pt-1 line-clamp-2">
                            <span className="font-semibold text-text-muted">Notes:</span> {lead.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCallClick(lead)}
                        className={`p-2 rounded-lg transition-colors shadow-sm ${callingLeadId === lead._id ? 'bg-green-500 text-white animate-pulse' : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      {!processedTodayIds.has(lead._id) && (
                        <button
                          onClick={() => handleStatusChange(lead._id, 'Contacted')}
                          className="p-2 text-[#10b981] bg-[#10b981]/5 hover:bg-[#10b981]/10 rounded-lg transition-colors"
                          title="Mark as Contacted"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Recent Leads ── */}
        <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-heading font-bold text-base text-text">Recent Leads</h2>
            <span className="font-body text-xs text-text-muted">{leads.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-text-muted/40" />
                </div>
                <p className="font-body text-sm font-semibold text-text-muted">No leads yet</p>
                <p className="font-body text-xs text-text-muted/60 mt-1">Tap "+ New Lead" to add a walk-in.</p>
              </div>
            ) : (
              recentLeads.map((lead) => {
                const stCfg = statusConfig[lead.status] || statusConfig['New'];
                const uCfg = urgencyConfig[lead.urgency] || urgencyConfig['Warm'];
                const UrgencyIcon = uCfg.icon;

                return (
                  <div key={lead._id} className="p-4 hover:bg-background/40 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                          <UserCircle className="w-5 h-5 text-primary/40" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-body text-sm font-semibold text-text truncate">{lead.customerName}</p>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/5 text-primary rounded font-body text-[10px] font-bold">
                              <MapPin className="w-2.5 h-2.5" />{lead.source}
                            </span>
                          </div>
                          <p className="font-body text-xs text-text-muted flex items-center gap-3">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>
                            {lead.carOfInterest && (
                              <span className="flex items-center gap-1 text-primary">
                                <Car className="w-3 h-3" />
                                {lead.carOfInterest.year} {lead.carOfInterest.make} {lead.carOfInterest.model}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ${uCfg.bg} ${uCfg.text}`}>
                          <UrgencyIcon className="w-2.5 h-2.5" />{lead.urgency}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ${stCfg.bg} ${stCfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />{lead.status}
                        </span>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="ml-12 mt-1.5 p-2 bg-background rounded-lg border border-gray-50">
                        <p className="font-body text-xs text-text-muted/80 line-clamp-2">
                          <span className="font-semibold text-text-muted">Notes:</span> {lead.notes}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 ml-12">
                      <span className="font-body text-[10px] text-text-muted/60">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCallClick(lead)} className={`p-1.5 rounded-md transition-colors ${callingLeadId === lead._id ? 'bg-green-500 text-white animate-pulse' : 'text-primary hover:bg-primary/5'}`}>
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`https://wa.me/${lead.phone?.replace(/[\s+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-accent hover:bg-accent/5 rounded-md transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/sales/add-lead')}
            className="flex items-center justify-center gap-2 p-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-body text-sm font-bold transition-all shadow-sm shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            New Walk-in
          </button>
          <a
            href="tel:+919913634447"
            className="flex items-center justify-center gap-2 p-4 bg-surface hover:bg-background border border-gray-100 rounded-2xl font-body text-sm font-bold text-text transition-all"
          >
            <Phone className="w-5 h-5 text-primary" />
            Call Office
          </a>
        </div>
      </div>
    </div>
  );
}
