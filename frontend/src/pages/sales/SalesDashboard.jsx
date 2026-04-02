import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Phone, Clock, Plus, CheckCircle2,
  ChevronRight, MessageCircle, Flame, Thermometer,
  Snowflake, CalendarClock, TrendingUp, UserCircle, AlertCircle,
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
      {/* ── Top Header ── */}
      <header className="bg-surface border-b border-gray-100 px-4 sm:px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-body text-xs text-text-muted uppercase tracking-wider">Sales Portal</p>
            <h1 className="font-heading font-bold text-xl text-text">
              Welcome, {user?.name || 'Salesman'} 👋
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
                  <div key={lead._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 ${uCfg.bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <UrgencyIcon className={`w-4 h-4 ${uCfg.text}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-text truncate">{lead.customerName}</p>
                        <p className="font-body text-xs text-text-muted">{lead.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone?.replace(/[\s+]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-accent bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleStatusChange(lead._id, 'Contacted')}
                        className="p-2 text-[#10b981] bg-[#10b981]/5 hover:bg-[#10b981]/10 rounded-lg transition-colors"
                        title="Mark as Contacted"
                      >
                        <CheckCircle2 className="w-4 h-4" />
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
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text truncate">{lead.customerName}</p>
                          <p className="font-body text-xs text-text-muted flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />{lead.phone}
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
                      <p className="font-body text-xs text-text-muted/70 ml-12 line-clamp-1">{lead.notes}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 ml-12">
                      <span className="font-body text-[10px] text-text-muted/60">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1">
                        <a href={`tel:${lead.phone}`} className="p-1.5 text-primary hover:bg-primary/5 rounded-md transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
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
