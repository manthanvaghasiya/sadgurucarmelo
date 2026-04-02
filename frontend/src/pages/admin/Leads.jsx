import { useState, useMemo } from 'react';
import {
  Search,
  Users,
  MessageCircle,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  X,
  ArrowUpDown,
  AlertTriangle,
  ExternalLink,
  Car,
  CalendarClock,
  SlidersHorizontal,
} from 'lucide-react';

// ── WhatsApp SVG Icon (inline for badge) ──
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 0C5.385 0 .004 5.38.004 12.025c0 2.126.55 4.195 1.594 6.01L0 24l6.113-1.602a12.035 12.035 0 005.918 1.543h.005c6.643 0 12.028-5.385 12.028-12.025C24.062 5.378 18.675 0 12.031 0zm0 21.964c-1.802 0-3.567-.483-5.114-1.4l-.367-.217-3.804.997 1.015-3.708-.238-.378c-1-1.59-1.53-3.428-1.53-5.328 0-5.54 4.51-10.057 10.052-10.057 5.54 0 10.056 4.516 10.056 10.056.002 5.54-4.507 10.055-10.048 10.055h-.022zm5.518-7.536c-.303-.152-1.792-.885-2.072-.986-.28-.101-.484-.152-.687.152-.204.303-.783.985-.961 1.189-.177.202-.355.228-.658.076-1.605-.815-2.864-1.879-3.957-3.414-.112-.158.112-.132.41-.726.076-.152.038-.285-.038-.436-.076-.152-.686-1.655-.941-2.264-.247-.59-.498-.51-.687-.52H7.5c-.203 0-.532.076-.811.38C6.409 6.273 5.545 7.085 5.545 8.73c0 1.646.888 3.242 1.015 3.419.127.177 2.316 3.655 5.679 4.972 2.37.934 3.256.784 3.864.654.764-.163 1.792-.733 2.046-1.442.253-.709.253-1.318.177-1.444-.076-.126-.28-.202-.583-.353z" />
    </svg>
  );
}

// ── Mock lead data ──
const allLeads = [
  {
    id: 'L-001',
    name: 'Rajesh Patel',
    phone: '+91 99136 34447',
    source: 'WhatsApp',
    vehicle: '2020 Hyundai Creta SX',
    status: 'New',
    date: 'Today, 10:30 AM',
    message: 'Interested in the Creta. Is it still available?',
  },
  {
    id: 'L-002',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    source: 'Contact Form',
    vehicle: '2022 Maruti Swift VXI',
    status: 'Contacted',
    date: 'Today, 9:15 AM',
    message: 'Wants to know about financing options.',
  },
  {
    id: 'L-003',
    name: 'Amit Desai',
    phone: '+91 87654 32100',
    source: 'Test Drive',
    vehicle: '2023 Tata Nexon EV Max',
    status: 'New',
    date: 'Yesterday, 4:45 PM',
    message: 'Booked test drive for Saturday.',
  },
  {
    id: 'L-004',
    name: 'Neha Gupta',
    phone: '+91 76543 21098',
    source: 'WhatsApp',
    vehicle: '2020 Toyota Fortuner 4X4',
    status: 'Closed',
    date: 'Yesterday, 2:10 PM',
    message: 'Purchased the vehicle. Deal closed.',
  },
  {
    id: 'L-005',
    name: 'Vikram Singh',
    phone: '+91 65432 10987',
    source: 'WhatsApp',
    vehicle: '2022 Maruti Baleno Zeta',
    status: 'New',
    date: 'Mar 31, 11:00 AM',
    message: 'What is the last price for the Baleno?',
  },
  {
    id: 'L-006',
    name: 'Kavita Joshi',
    phone: '+91 54321 09876',
    source: 'Contact Form',
    vehicle: '2021 Kia Seltos HTX+',
    status: 'Contacted',
    date: 'Mar 31, 9:30 AM',
    message: 'Wants a callback regarding the Seltos.',
  },
  {
    id: 'L-007',
    name: 'Suresh Mehta',
    phone: '+91 43210 98765',
    source: 'Test Drive',
    vehicle: '2023 Honda City V CVT',
    status: 'Contacted',
    date: 'Mar 30, 3:00 PM',
    message: 'Test drove and wants to negotiate price.',
  },
  {
    id: 'L-008',
    name: 'Anita Reddy',
    phone: '+91 32109 87654',
    source: 'WhatsApp',
    vehicle: '2023 Mahindra XUV700 AX7',
    status: 'New',
    date: 'Mar 30, 12:15 PM',
    message: 'Asking about service history and insurance.',
  },
  {
    id: 'L-009',
    name: 'Deepak Verma',
    phone: '+91 21098 76543',
    source: 'Contact Form',
    vehicle: '2019 Volkswagen Polo GT',
    status: 'Closed',
    date: 'Mar 29, 5:45 PM',
    message: 'Not interested anymore. Budget changed.',
  },
  {
    id: 'L-010',
    name: 'Meera Nair',
    phone: '+91 10987 65432',
    source: 'WhatsApp',
    vehicle: '2021 Hyundai i20 Asta',
    status: 'New',
    date: 'Mar 29, 10:00 AM',
    message: 'Can you share more interior photos?',
  },
  {
    id: 'L-011',
    name: 'Rohit Kapoor',
    phone: '+91 98712 34567',
    source: 'Test Drive',
    vehicle: '2022 Hyundai Verna SX(O)',
    status: 'Contacted',
    date: 'Mar 28, 2:30 PM',
    message: 'Wants to compare with City before deciding.',
  },
  {
    id: 'L-012',
    name: 'Sneha Kulkarni',
    phone: '+91 87612 34567',
    source: 'WhatsApp',
    vehicle: '2023 Maruti Brezza ZXI+',
    status: 'New',
    date: 'Mar 28, 11:20 AM',
    message: 'Is exchange available? Have a 2018 WagonR.',
  },
];

const ITEMS_PER_PAGE = 10;

// ── Source badge config ──
const sourceConfig = {
  WhatsApp: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    ring: 'ring-accent/20',
    Icon: WhatsAppIcon,
  },
  'Contact Form': {
    bg: 'bg-primary/8',
    text: 'text-primary',
    ring: 'ring-primary/15',
    Icon: Phone,
  },
  'Test Drive': {
    bg: 'bg-[#8b5cf6]/10',
    text: 'text-[#8b5cf6]',
    ring: 'ring-[#8b5cf6]/20',
    Icon: Car,
  },
};

// ── Lead status badge config ──
const statusConfig = {
  New: {
    bg: 'bg-[#f59e0b]/10',
    text: 'text-[#d97706]',
    ring: 'ring-[#f59e0b]/20',
    dot: 'bg-[#f59e0b]',
    pulse: true,
  },
  Contacted: {
    bg: 'bg-[#3b82f6]/10',
    text: 'text-[#2563eb]',
    ring: 'ring-[#3b82f6]/20',
    dot: 'bg-[#3b82f6]',
    pulse: false,
  },
  Closed: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    ring: 'ring-gray-200',
    dot: 'bg-gray-400',
    pulse: false,
  },
};

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // ── Filtering ──
  const filtered = useMemo(() => {
    let list = allLeads;

    if (sourceFilter !== 'All') {
      list = list.filter((l) => l.source === sourceFilter);
    }

    if (statusFilter !== 'All') {
      list = list.filter((l) => l.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.vehicle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, sourceFilter, statusFilter]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const resetPage = () => setCurrentPage(1);
  const handleSearch = (v) => { setSearchQuery(v); resetPage(); };
  const handleSourceFilter = (v) => { setSourceFilter(v); resetPage(); };
  const handleStatusFilter = (v) => { setStatusFilter(v); resetPage(); };

  // ── KPI calculations ──
  const kpis = useMemo(() => {
    const total = allLeads.length;
    const newCount = allLeads.filter((l) => l.status === 'New').length;
    const followUp = allLeads.filter((l) => l.status === 'Contacted').length;
    return { total, newCount, followUp };
  }, []);

  const kpiCards = [
    {
      title: 'Total Leads',
      subtitle: 'This Month',
      value: kpis.total,
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'New / Unread',
      subtitle: 'Needs attention',
      value: kpis.newCount,
      icon: MessageCircle,
      iconBg: 'bg-[#f59e0b]/10',
      iconColor: 'text-[#d97706]',
      highlight: true,
    },
    {
      title: 'Follow-ups Pending',
      subtitle: 'In progress',
      value: kpis.followUp,
      icon: Clock,
      iconBg: 'bg-[#3b82f6]/10',
      iconColor: 'text-[#2563eb]',
    },
  ];

  // ── Status counts for status pills ──
  const statusCounts = useMemo(() => {
    const c = { All: allLeads.length, New: 0, Contacted: 0, Closed: 0 };
    allLeads.forEach((l) => { if (c[l.status] !== undefined) c[l.status]++; });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════
          Delete Confirmation Modal
         ═══════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Delete Lead?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">
                  This lead record will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          Page Header
         ═══════════════════════════════════════ */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-text">
          Lead Management
        </h1>
        <p className="font-body text-sm text-text-muted mt-1 max-w-xl">
          Track and respond to WhatsApp inquiries, test drives, and contact requests.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          KPI Stats Row
         ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`bg-surface rounded-2xl border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group ${
                kpi.highlight ? 'border-[#f59e0b]/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} strokeWidth={2} />
                </div>
                {kpi.highlight && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b]/40" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]" />
                  </span>
                )}
              </div>
              <h3 className="font-body text-sm font-semibold text-text-muted mb-1">
                {kpi.title}
              </h3>
              <p className="font-heading font-bold text-3xl text-text leading-none mb-1">
                {kpi.value}
              </p>
              <span className="font-body text-xs text-text-muted/60">
                {kpi.subtitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════
          Status Filter Pills
         ═══════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
        {['All', 'New', 'Contacted', 'Closed'].map((status) => {
          const active = statusFilter === status;
          const cfg = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-semibold
                transition-all duration-200 whitespace-nowrap shrink-0
                ${active
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'bg-surface text-text-muted border border-gray-100 hover:border-primary/20 hover:text-text'
                }
              `}
            >
              {status !== 'All' && cfg && (
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : cfg.dot}`} />
              )}
              {status}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  active ? 'bg-white/20 text-white' : 'bg-background text-text-muted'
                }`}
              >
                {statusCounts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════
          Search & Filter Bar
         ═══════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Name or Phone..."
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/60 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Filter */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            value={sourceFilter}
            onChange={(e) => handleSourceFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2.5 bg-background rounded-xl font-body text-sm text-text appearance-none cursor-pointer outline-none border border-transparent focus:border-primary/20 transition-colors"
          >
            <option value="All">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Contact Form">Contact Form</option>
            <option value="Test Drive">Test Drive</option>
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Data Table
         ═══════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* ── Desktop / Tablet Table ── */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date', 'Customer', 'Source', 'Vehicle of Interest', 'Status', 'Actions'].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 ${
                        i === 0 ? 'pl-6 pr-4 text-left' :
                        col === 'Actions' ? 'px-6 text-right' :
                        'px-4 text-left'
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                        <Users className="w-7 h-7 text-text-muted/40" />
                      </div>
                      <p className="font-body text-sm font-semibold text-text-muted">
                        No leads found
                      </p>
                      <p className="font-body text-xs text-text-muted/60">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((lead) => {
                  const sCfg = sourceConfig[lead.source] || sourceConfig['WhatsApp'];
                  const stCfg = statusConfig[lead.status] || statusConfig['New'];
                  const SourceIcon = sCfg.Icon;
                  const isExpanded = expandedRow === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      className="border-t border-gray-50 hover:bg-background/40 transition-colors group cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : lead.id)}
                    >
                      {/* Date */}
                      <td className="pl-6 pr-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-text-muted/40 shrink-0" />
                          <span className="font-body text-sm text-text-muted whitespace-nowrap">
                            {lead.date}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text">
                            {lead.name}
                          </p>
                          <p className="font-body text-xs text-text-muted mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </p>
                          {/* Expandable message preview */}
                          {isExpanded && lead.message && (
                            <p className="font-body text-xs text-text-muted/80 mt-2 p-2.5 bg-background rounded-lg border border-gray-100 italic leading-relaxed">
                              "{lead.message}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${sCfg.bg} ${sCfg.text} ${sCfg.ring}`}
                        >
                          <SourceIcon className="w-3 h-3" />
                          {lead.source}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-4">
                        <span className="font-body text-sm font-semibold text-text">
                          {lead.vehicle}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${stCfg.bg} ${stCfg.text} ${stCfg.ring}`}
                        >
                          {stCfg.pulse ? (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stCfg.dot} opacity-75`} />
                              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${stCfg.dot}`} />
                            </span>
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                          )}
                          {lead.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[\s+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            className="p-2 text-text-muted hover:text-[#059669] hover:bg-[#10b981]/10 rounded-lg transition-colors"
                            title="Mark Resolved"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(lead.id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile / Tablet Card List ── */}
        <div className="lg:hidden divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-text-muted/40" />
              </div>
              <p className="font-body text-sm font-semibold text-text-muted">No leads found</p>
            </div>
          ) : (
            paginated.map((lead) => {
              const sCfg = sourceConfig[lead.source] || sourceConfig['WhatsApp'];
              const stCfg = statusConfig[lead.status] || statusConfig['New'];
              const SourceIcon = sCfg.Icon;

              return (
                <div key={lead.id} className="p-4 hover:bg-background/40 transition-colors space-y-3">
                  {/* Row 1: Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-body text-sm font-semibold text-text">{lead.name}</p>
                      <p className="font-body text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${stCfg.bg} ${stCfg.text} ${stCfg.ring}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                      {lead.status}
                    </span>
                  </div>

                  {/* Row 2: Vehicle + Source */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-sm font-medium text-text truncate">
                      {lead.vehicle}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${sCfg.bg} ${sCfg.text} ${sCfg.ring}`}
                    >
                      <SourceIcon className="w-3 h-3" />
                      {lead.source}
                    </span>
                  </div>

                  {/* Row 3: Date + Actions */}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-text-muted">{lead.date}</span>
                    <div className="flex items-center gap-1">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[\s+]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-accent hover:bg-accent/10 rounded-md transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <button className="p-1.5 text-text-muted hover:text-[#059669] rounded-md transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead.id)}
                        className="p-1.5 text-text-muted hover:text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ═══════════════════════════════════════
            Pagination Footer
           ═══════════════════════════════════════ */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
            <p className="font-body text-sm text-text-muted">
              Showing{' '}
              <span className="font-semibold text-text">{showingFrom}</span> to{' '}
              <span className="font-semibold text-text">{showingTo}</span> of{' '}
              <span className="font-semibold text-text">{filtered.length}</span>{' '}
              leads
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg font-body text-sm font-bold flex items-center justify-center transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-background text-text-muted hover:text-text'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
