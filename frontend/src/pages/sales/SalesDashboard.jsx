import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Phone, Clock, Plus, CheckCircle2,
  ChevronRight, MessageCircle, Flame, Thermometer,
  Snowflake, CalendarClock, TrendingUp, UserCircle, AlertCircle,
  Car, MapPin, X, LogOut
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
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, newCount: 0, followUp: 0, todayFollowUps: 0 });
  const [callingLeadId, setCallingLeadId] = useState(null);
  const [activeCallLead, setActiveCallLead] = useState(null);
  const [callOutcome, setCallOutcome] = useState('complete');
  const [callNotes, setCallNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);


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

  // ── Compute today's follow-ups (Strict Accountability Board) ──
  const todayFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return leads.filter(l => {
      const isUpdatedToday = new Date(l.updatedAt) >= today && new Date(l.updatedAt) < tomorrow;
      
      // Rule 1: It is PENDING if the follow-up date is today or past, AND it is not closed.
      const isPending = l.followUpDate && new Date(l.followUpDate) < tomorrow && l.status !== 'Closed';
      
      // Rule 2: It is DONE if it was updated today AND (the salesman pushed the follow-up date to the future OR closed it).
      const isDoneToday = isUpdatedToday && (l.status === 'Closed' || (l.followUpDate && new Date(l.followUpDate) >= tomorrow));

      return isPending || isDoneToday;
    }).sort((a, b) => {
      // Sort: Pending items at the top, Done items at the bottom
      const aDone = new Date(a.updatedAt) >= today && (a.status === 'Closed' || new Date(a.followUpDate) >= tomorrow);
      const bDone = new Date(b.updatedAt) >= today && (b.status === 'Closed' || new Date(b.followUpDate) >= tomorrow);
      
      if (aDone === bDone) return new Date(b.updatedAt) - new Date(a.updatedAt);
      return aDone ? 1 : -1;
    });
  }, [leads]);

  // ── Recent leads (last 5) ──
  const recentLeads = leads.slice(0, 5);

  // ── Quick status update ──
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      if (newStatus === 'Closed') {
        toast.success('Deal marked as Complete! 🎉');
      } else {
        toast.success(`Lead marked as ${newStatus}`);
      }
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
      if (data.success) {
        setLeads(prev => prev.map(l => l._id === activeCallLead._id ? data.data : l));
      }
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
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'New Leads',
      value: stats.newCount,
      icon: AlertCircle,
      iconBg: 'bg-[#f59e0b]/10',
      iconColor: 'text-[#d97706]',
      highlight: stats.newCount > 0,
    },
    {
      title: "Today's Follow-ups",
      value: todayFollowUps.length,
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

      {/* ── Sticky Top Header ── */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: Welcome */}
          <div className="min-w-0 flex-1">
            <p className="font-body text-[10px] text-text-muted uppercase tracking-wider truncate">Sales Executive</p>
            <h1 className="font-heading font-bold text-sm sm:text-xl text-text capitalize truncate leading-tight">
              Welcome, {user?.name} 👋
            </h1>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 1. New Lead Button (Bigger / Wider) */}
            <button
              onClick={() => navigate('/sales/add-lead')}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-xs sm:text-sm font-bold transition-all shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Create New Lead</span>
            </button>

            {/* 2. Logout Button (Smaller / Compact) */}
            <button
              onClick={logout}
              title="Logout"
              className="flex items-center justify-center p-2 sm:px-3 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-body text-xs sm:text-sm font-bold transition-colors border border-red-100 shrink-0"
            >
              <LogOut className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1.5">Logout</span>
            </button>

          </div>

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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const isUpdatedToday = new Date(lead.updatedAt) >= today && new Date(lead.updatedAt) < tomorrow;
                const isActuallyDone = isUpdatedToday && (lead.status === 'Closed' || (lead.followUpDate && new Date(lead.followUpDate) >= tomorrow));
                
                const uCfg = urgencyConfig[lead.urgency] || urgencyConfig['Warm'];
                const UrgencyIcon = uCfg.icon;
                return (
                  <div key={lead._id} className={`flex items-center justify-between py-3 rounded-xl transition-all duration-300 ${callingLeadId === lead._id ? 'bg-green-500/10 border border-green-200 px-3 -mx-3 shadow-sm' : isActuallyDone ? 'bg-green-50 px-3 -mx-3 border border-green-100 shadow-sm' : ''}`}>
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
                          <p className="font-body text-[11px] text-text-muted/80 pt-1 line-clamp-2" title={lead.notes.split('\n').filter(e => e.trim()).join(' , ')}>
                            <span className="font-semibold text-text-muted">Notes:</span> {lead.notes.split('\n').filter(e => e.trim()).join(' , ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {isActuallyDone ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-body text-[10px] font-bold ring-1 ring-green-200">
                          ✅ {lead.status === 'Closed' ? 'Complete' : 'Done'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full font-body text-[10px] font-bold ring-1 ring-orange-200">
                            <span className="w-1 h-1 rounded-full bg-orange-600 animate-pulse" />
                            ⏳ Pending
                          </span>
                          <button
                            onClick={() => handleStatusChange(lead._id, 'Closed')}
                            className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-[10px] shadow-md shadow-green-500/20 transition-all active:scale-95 whitespace-nowrap"
                          >
                            ✅ Complete Deal
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleCallClick(lead)}
                        className={`p-2 rounded-lg transition-colors shadow-sm ${callingLeadId === lead._id ? 'bg-green-500 text-white animate-pulse' : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
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
                        <p className="font-body text-xs text-text-muted/80 line-clamp-2" title={lead.notes.split('\n').filter(e => e.trim()).join(' , ')}>
                          <span className="font-semibold text-text-muted">Notes:</span> {lead.notes.split('\n').filter(e => e.trim()).join(' , ')}
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
        <div className="grid grid-cols-1">
          <button
            onClick={() => navigate('/sales/add-lead')}
            className="flex items-center justify-center gap-2 p-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-body text-base font-bold transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
            Create New Lead
          </button>
        </div>
      </div>
    </div>
  );
}
