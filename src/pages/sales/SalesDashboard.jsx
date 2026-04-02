import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Phone,
  Clock,
  LogOut,
  ChevronRight,
  Flame,
  Thermometer,
  Snowflake,
  User,
  CalendarCheck,
  MessageCircle,
  Briefcase,
} from 'lucide-react';

// ── Mock data ──
const followUps = [
  { id: 1, name: 'Rajesh Patel', phone: '+91 99136 34447', car: '2020 Creta SX', time: '11:00 AM' },
  { id: 2, name: 'Priya Sharma', phone: '+91 98765 43210', car: '2022 Nexon EV', time: '2:30 PM' },
  { id: 3, name: 'Amit Desai', phone: '+91 87654 32100', car: 'Looking for SUV', time: '5:00 PM' },
];

const recentLeads = [
  { id: 'L-101', name: 'Vikram Singh', phone: '+91 65432 10987', status: 'Hot', car: '2020 Creta SX', time: '30 min ago' },
  { id: 'L-102', name: 'Kavita Joshi', phone: '+91 54321 09876', status: 'Warm', car: '2022 Swift VXI', time: '1 hour ago' },
  { id: 'L-103', name: 'Suresh Mehta', phone: '+91 43210 98765', status: 'Cold', car: 'Looking for Hatchback', time: '2 hours ago' },
  { id: 'L-104', name: 'Anita Reddy', phone: '+91 32109 87654', status: 'Hot', car: '2023 XUV700 AX7', time: 'Yesterday' },
  { id: 'L-105', name: 'Deepak Verma', phone: '+91 21098 76543', status: 'Warm', car: '2022 Baleno Zeta', time: 'Yesterday' },
];

const urgencyConfig = {
  Hot: { icon: Flame, bg: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-500/20', dot: 'bg-red-500' },
  Warm: { icon: Thermometer, bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-500/20', dot: 'bg-amber-500' },
  Cold: { icon: Snowflake, bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', ring: 'ring-[#3b82f6]/20', dot: 'bg-[#3b82f6]' },
};

export default function SalesDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/sales/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════
          Top Header Bar
         ═══════════════════════════════════════ */}
      <header className="bg-primary text-white sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center font-heading font-black text-base shadow-md shadow-accent/30">
              S
            </div>
            <div>
              <h1 className="font-heading font-bold text-base leading-tight">Sales Portal</h1>
              <p className="font-body text-[10px] text-white/50 font-semibold uppercase tracking-widest">
                Sadguru Car Melo
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          Content
         ═══════════════════════════════════════ */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Welcome Message */}
        <div>
          <h2 className="font-heading font-bold text-xl text-text">
            Welcome, Sales Team 👋
          </h2>
          <p className="font-body text-sm text-text-muted mt-0.5">
            Here's your day at a glance.
          </p>
        </div>

        {/* ── Quick Action: Add New Lead ── */}
        <Link
          to="/sales/add-lead"
          className="flex items-center justify-center gap-2.5 w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-body font-bold text-base transition-all shadow-lg shadow-accent/25 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          ADD NEW LEAD
        </Link>

        {/* ── Today's Quick Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl border border-gray-100 p-3.5 text-center">
            <p className="font-heading font-bold text-2xl text-text leading-none">
              {followUps.length}
            </p>
            <p className="font-body text-[11px] text-text-muted font-semibold mt-1.5">
              Follow-ups
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-gray-100 p-3.5 text-center">
            <p className="font-heading font-bold text-2xl text-accent leading-none">
              {recentLeads.filter((l) => l.status === 'Hot').length}
            </p>
            <p className="font-body text-[11px] text-text-muted font-semibold mt-1.5">
              Hot Leads
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-gray-100 p-3.5 text-center">
            <p className="font-heading font-bold text-2xl text-text leading-none">
              {recentLeads.length}
            </p>
            <p className="font-body text-[11px] text-text-muted font-semibold mt-1.5">
              Total Today
            </p>
          </div>
        </div>

        {/* ── Follow-ups for Today ── */}
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-[#d97706]" />
              </div>
              <h3 className="font-heading font-bold text-sm text-text">
                Follow-ups for Today
              </h3>
            </div>
            <span className="font-body text-[11px] font-bold text-[#d97706] bg-[#f59e0b]/10 px-2 py-1 rounded-md">
              {followUps.length} pending
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {followUps.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3.5 flex items-center justify-between hover:bg-background/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-text truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-body text-xs text-text-muted">{item.car}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="font-body text-xs text-text-muted flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${item.phone.replace(/\s/g, '')}`}
                  className="shrink-0 w-9 h-9 bg-accent/10 hover:bg-accent/20 rounded-xl flex items-center justify-center text-accent transition-colors ml-3"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Entries ── */}
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-sm text-text">
                Recent Entries
              </h3>
            </div>
            <span className="font-body text-[11px] font-bold text-text-muted bg-background px-2 py-1 rounded-md">
              Last 5
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => {
              const cfg = urgencyConfig[lead.status];
              const UrgencyIcon = cfg.icon;
              return (
                <div
                  key={lead.id}
                  className="px-4 py-3.5 hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-semibold text-text truncate">
                          {lead.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                        >
                          <UrgencyIcon className="w-2.5 h-2.5" />
                          {lead.status}
                        </span>
                      </div>
                      <p className="font-body text-xs text-text-muted mt-0.5">
                        {lead.car}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-xs text-text-muted flex items-center gap-0.5">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="font-body text-[11px] text-text-muted/60">
                          {lead.time}
                        </span>
                      </div>
                    </div>

                    {/* Quick WhatsApp */}
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[\s+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-9 h-9 bg-accent/10 hover:bg-accent/20 rounded-xl flex items-center justify-center text-accent transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom spacer for safe area */}
        <div className="h-4" />
      </div>
    </div>
  );
}
