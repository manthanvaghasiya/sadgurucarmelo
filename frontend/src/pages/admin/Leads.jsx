import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  MessageCircle,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  X,
  AlertTriangle,
  Car,
  CalendarClock,
  SlidersHorizontal,
  Flame,
  Thermometer,
  Snowflake,
  Edit2,
  UserCircle,
  Eye,
  ListFilter,
  User as UserIcon,
  Calendar,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

// ── Lead status badge config ──
const statusConfig = {
  New: {
    bg: 'bg-[#f59e0b]/10', text: 'text-[#d97706]', ring: 'ring-[#f59e0b]/20',
    dot: 'bg-[#f59e0b]', pulse: true,
  },
  Contacted: {
    bg: 'bg-[#3b82f6]/10', text: 'text-[#2563eb]', ring: 'ring-[#3b82f6]/20',
    dot: 'bg-[#3b82f6]', pulse: false,
  },
  'Follow-up': {
    bg: 'bg-[#8b5cf6]/10', text: 'text-[#7c3aed]', ring: 'ring-[#8b5cf6]/20',
    dot: 'bg-[#8b5cf6]', pulse: false,
  },
  Closed: {
    bg: 'bg-gray-100', text: 'text-gray-500', ring: 'ring-gray-200',
    dot: 'bg-gray-400', pulse: false,
  },
};

// ── Urgency config ──
const urgencyConfig = {
  Hot: { icon: Flame, bg: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-500/20' },
  Warm: { icon: Thermometer, bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-500/20' },
  Cold: { icon: Snowflake, bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', ring: 'ring-[#3b82f6]/20' },
};

// ── Source badge config ──
const sourceConfig = {
  WhatsApp: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/20' },
  'Walk-in': { bg: 'bg-primary/8', text: 'text-primary', ring: 'ring-primary/15' },
  Phone: { bg: 'bg-[#8b5cf6]/10', text: 'text-[#8b5cf6]', ring: 'ring-[#8b5cf6]/20' },
  Website: { bg: 'bg-[#10b981]/10', text: 'text-[#059669]', ring: 'ring-[#10b981]/20' },
};

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [leadStats, setLeadStats] = useState({ total: 0, newCount: 0, followUp: 0, todayFollowUps: 0 });
  const [showTodayTracker, setShowTodayTracker] = useState(false);
  const [salesmen, setSalesmen] = useState([]);

  // New Filters Refactor
  const [columnFilters, setColumnFilters] = useState({ 
    date: '', 
    customer: '', 
    car: '', 
    salesman: '' 
  });
  const [activeFilterBox, setActiveFilterBox] = useState(null); // 'date', 'customer', 'car', 'salesman' or null

  // ── Fetch leads from API ──
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sourceFilter !== 'All') params.set('source', sourceFilter);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (urgencyFilter !== 'All') params.set('urgency', urgencyFilter);

      const [leadsRes, statsRes] = await Promise.all([
        axiosInstance.get(`/leads?${params.toString()}`),
        axiosInstance.get('/leads/stats'),
      ]);

      if (leadsRes.data.success) setLeads(leadsRes.data.data || []);
      if (statsRes.data.success) setLeadStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [sourceFilter, statusFilter, urgencyFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/users');
        if (data.success) {
          setSalesmen(data.data.filter(u => u.role === 'sales'));
        }
      } catch (err) {
        console.error('Failed to fetch salesmen:', err);
      }
    };
    fetchSalesmen();
  }, []);

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilterBox && !event.target.closest('.filter-container')) {
        setActiveFilterBox(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilterBox]);

  const toggleFilter = (box) => {
    setActiveFilterBox(activeFilterBox === box ? null : box);
  };

  // ── Filtering ──
  const filtered = useMemo(() => {
    let result = leads;

    // Global search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.customerName?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.email?.toLowerCase().includes(q)
      );
    }

    // Column-specific local filters
    result = result.filter(lead => {
      // Date filter
      const matchesDate = !columnFilters.date || 
        new Date(lead.createdAt).toISOString().split('T')[0] === columnFilters.date;
      
      // Customer filter
      const matchesCustomer = !columnFilters.customer || 
        lead.customerName?.toLowerCase().includes(columnFilters.customer.toLowerCase());
      
      // Car filter
      const matchesCar = !columnFilters.car || (
        lead.carOfInterest && (
          `${lead.carOfInterest.make} ${lead.carOfInterest.model} ${lead.carOfInterest.year}`
            .toLowerCase()
            .includes(columnFilters.car.toLowerCase())
        )
      );
      
      // Salesman filter
      const matchesSalesman = !columnFilters.salesman || 
        lead.assignedTo?._id === columnFilters.salesman;

      return matchesDate && matchesCustomer && matchesCar && matchesSalesman;
    });

    return result;
  }, [leads, searchQuery, columnFilters]);

  // ── Today's Follow-ups Filtered Logic ──
  const todayLeads = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return leads.filter(l => l.followUpDate && new Date(l.followUpDate).toISOString().split('T')[0] === todayStr);
  }, [leads]);

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
  const handleUrgencyFilter = (v) => { setUrgencyFilter(v); resetPage(); };

  // ── Update lead status ──
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      toast.success(`Lead marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  // ── Delete lead ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosInstance.delete(`/leads/${deleteTarget}`);
      setLeads(prev => prev.filter(l => l._id !== deleteTarget));
      setDeleteTarget(null);
      toast.success('Lead deleted');
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  // ── KPI Cards ──
  const kpiCards = [
    {
      title: 'Total Leads', subtitle: 'All time',
      value: leadStats.total, icon: Users,
      iconBg: 'bg-primary/10', iconColor: 'text-primary',
    },
    {
      title: 'New / Unread', subtitle: 'Needs attention',
      value: leadStats.newCount, icon: MessageCircle,
      iconBg: 'bg-[#f59e0b]/10', iconColor: 'text-[#d97706]',
      highlight: true,
    },
    {
      title: 'Today\'s Follow-ups', subtitle: 'Requires attention today',
      value: leadStats.todayFollowUps, icon: CalendarClock,
      iconBg: 'bg-red-50', iconColor: 'text-red-500',
      interactive: true,
      onClick: () => setShowTodayTracker(true),
    },
  ];

  // ── Status counts ──
  const statusCounts = useMemo(() => {
    const c = { All: leads.length, New: 0, Contacted: 0, 'Follow-up': 0, Closed: 0 };
    leads.forEach(l => { if (c[l.status] !== undefined) c[l.status]++; });
    return c;
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Delete Lead?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">This lead record will be permanently removed.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* History / View Log Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-lg p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-heading font-bold text-lg text-text">Lead History & Notes</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">{viewTarget.customerName} - {viewTarget.phone}</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-body text-sm text-text/80 leading-relaxed whitespace-pre-wrap">
              {viewTarget.notes ? (
                viewTarget.notes
              ) : (
                <div className="text-center py-8 text-text-muted">No interactions or notes logged yet.</div>
              )}
            </div>

            {(viewTarget.followUpDate || viewTarget.assignedTo) && (
              <div className="mt-4 pt-4 border-t border-gray-100 shrink-0 flex items-center justify-between bg-background rounded-xl p-3">
                <div className="flex flex-col gap-1 text-xs">
                  {viewTarget.assignedTo ? (
                    <span className="font-body font-semibold text-text flex items-center gap-1.5"><UserCircle className="w-3.5 h-3.5 text-text-muted" />{viewTarget.assignedTo.name}</span>
                  ) : <span className="font-body text-text-muted font-semibold flex items-center gap-1.5"><UserCircle className="w-3.5 h-3.5" />Unassigned</span>}
                </div>
                {viewTarget.followUpDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="w-4 h-4 text-primary" />
                    <span className="font-body text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">Next: {new Date(viewTarget.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's Activity Tracker Slide-Over */}
      {showTodayTracker && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowTodayTracker(false)} />
          <div className="relative bg-surface w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-surface shrink-0">
              <div>
                <h3 className="font-heading font-bold text-lg text-text">Today's Follow-up Tracker</h3>
                <p className="font-body text-xs text-text-muted mt-0.5">Accountability & Performance Monitoring</p>
              </div>
              <button 
                onClick={() => setShowTodayTracker(false)}
                className="p-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30">
              {todayLeads.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Clock className="w-8 h-8 text-text-muted/20" />
                  </div>
                  <p className="font-body text-sm font-semibold text-text-muted">No follow-ups scheduled for today</p>
                  <p className="font-body text-xs text-text-muted/60 mt-1">Check back later or view general leads.</p>
                </div>
              ) : (
                todayLeads.map((lead) => {
                  const isUpdatedToday = new Date(lead.updatedAt).toDateString() === new Date().toDateString();
                  return (
                    <div 
                      key={lead._id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isUpdatedToday 
                          ? 'bg-green-50 border-green-100 ring-1 ring-green-200 shadow-sm shadow-green-100' 
                          : 'bg-orange-50 border-orange-100 ring-1 ring-orange-200 shadow-sm shadow-orange-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <h4 className="font-body text-sm font-bold text-text truncate">{lead.customerName}</h4>
                          <p className="font-body text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5" />{lead.phone}
                          </p>
                        </div>
                        {isUpdatedToday ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full font-body text-[10px] font-bold ring-1 ring-green-500/20 whitespace-nowrap">
                            Logged Today
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full font-body text-[10px] font-bold ring-1 ring-orange-500/20 whitespace-nowrap">
                            Pending Call
                          </span>
                        )}
                      </div>

                      {lead.carOfInterest && (
                        <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded-xl mb-3">
                          <Car className="w-3.5 h-3.5 text-text-muted" />
                          <span className="font-body text-xs font-medium text-text truncate">
                            {lead.carOfInterest.year} {lead.carOfInterest.make} {lead.carOfInterest.model}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/[0.03]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-black/[0.05]">
                            <UserIcon className="w-3.5 h-3.5 text-text-muted" />
                          </div>
                          <span className="font-body text-xs font-semibold text-text-muted">
                            {lead.assignedTo?.name || 'Unassigned'}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setShowTodayTracker(false);
                            setViewTarget(lead);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary border border-primary/20 hover:bg-primary/5 rounded-lg font-body text-xs font-bold transition-all shadow-sm active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Log
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-text">Lead Management</h1>
        <p className="font-body text-sm text-text-muted mt-1 max-w-xl">Track and respond to inquiries, walk-ins, and contact requests.</p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.title} 
              onClick={kpi.onClick}
              className={`bg-surface rounded-2xl border p-6 transition-all duration-300 group ${kpi.highlight ? 'border-[#f59e0b]/20' : 'border-gray-100'} ${kpi.interactive ? 'cursor-pointer hover:ring-2 hover:ring-red-600 hover:shadow-lg' : 'hover:shadow-lg hover:shadow-primary/5'}`}
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
              <h3 className="font-body text-sm font-semibold text-text-muted mb-1">{kpi.title}</h3>
              <p className="font-heading font-bold text-3xl text-text leading-none mb-1">{kpi.value}</p>
              <span className="font-body text-xs text-text-muted/60">{kpi.subtitle}</span>
            </div>
          );
        })}
      </div>



      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Name, Phone, or Email..."
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/60 outline-none transition-colors"
          />
          {searchQuery && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="mt-4 font-body text-sm text-text-muted">Loading leads...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {/* Date Column with Filter */}
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 pl-6 pr-4 text-left relative filter-container">
                      <div 
                        className="flex items-center justify-between cursor-pointer group hover:text-primary transition-colors"
                        onClick={() => toggleFilter('date')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          {columnFilters.date && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                        <ListFilter className={`w-3.5 h-3.5 transition-colors ${activeFilterBox === 'date' ? 'text-primary' : 'text-text-muted/40 group-hover:text-primary/60'}`} />
                      </div>
                      
                      {activeFilterBox === 'date' && (
                        <div className="absolute top-full left-6 mt-1 w-56 bg-white p-3 rounded-xl shadow-2xl ring-1 ring-black/[0.05] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5 px-1 font-heading">Pick a date</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              className="w-full pl-3 pr-3 py-2 bg-background border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-normal text-slate-700"
                              value={columnFilters.date}
                              onChange={(e) => {
                                setColumnFilters({...columnFilters, date: e.target.value});
                                setCurrentPage(1);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {columnFilters.date && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setColumnFilters({...columnFilters, date: ''});
                                  setCurrentPage(1);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </th>

                    {/* Customer Column with Filter */}
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative filter-container">
                      <div 
                        className="flex items-center justify-between cursor-pointer group hover:text-primary transition-colors"
                        onClick={() => toggleFilter('customer')}
                      >
                        <div className="flex items-center gap-1">
                          Customer
                          {columnFilters.customer && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                        <ListFilter className={`w-3.5 h-3.5 transition-colors ${activeFilterBox === 'customer' ? 'text-primary' : 'text-text-muted/40 group-hover:text-primary/60'}`} />
                      </div>
                      
                      {activeFilterBox === 'customer' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white p-3 rounded-xl shadow-2xl ring-1 ring-black/[0.05] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <input 
                            type="text" 
                            placeholder="Search customer name..."
                            autoFocus
                            className="w-full px-3 py-2 bg-background border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-normal text-slate-700 normal-case tracking-normal"
                            value={columnFilters.customer}
                            onChange={(e) => {
                              setColumnFilters({...columnFilters, customer: e.target.value});
                              setCurrentPage(1);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </th>

                    {/* Car Column with Filter */}
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative filter-container">
                      <div 
                        className="flex items-center justify-between cursor-pointer group hover:text-primary transition-colors"
                        onClick={() => toggleFilter('car')}
                      >
                        <div className="flex items-center gap-1">
                          Car of Interest
                          {columnFilters.car && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                        <ListFilter className={`w-3.5 h-3.5 transition-colors ${activeFilterBox === 'car' ? 'text-primary' : 'text-text-muted/40 group-hover:text-primary/60'}`} />
                      </div>
                      
                      {activeFilterBox === 'car' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white p-3 rounded-xl shadow-2xl ring-1 ring-black/[0.05] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <input 
                            type="text" 
                            placeholder="Search car make/model..."
                            autoFocus
                            className="w-full px-3 py-2 bg-background border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-normal text-slate-700 normal-case tracking-normal"
                            value={columnFilters.car}
                            onChange={(e) => {
                              setColumnFilters({...columnFilters, car: e.target.value});
                              setCurrentPage(1);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </th>

                    {/* Salesman Column with Filter */}
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative filter-container">
                      <div 
                        className="flex items-center justify-between cursor-pointer group hover:text-primary transition-colors"
                        onClick={() => toggleFilter('salesman')}
                      >
                        <div className="flex items-center gap-1">
                          Salesman
                          {columnFilters.salesman && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                        <ListFilter className={`w-3.5 h-3.5 transition-colors ${activeFilterBox === 'salesman' ? 'text-primary' : 'text-text-muted/40 group-hover:text-primary/60'}`} />
                      </div>
                      
                      {activeFilterBox === 'salesman' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white p-3 rounded-xl shadow-2xl ring-1 ring-black/[0.05] z-50 animate-in fade-in slide-in-from-top-1 duration-200" onClick={e => e.stopPropagation()}>
                          <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5 px-1 font-heading">Filter by staff</label>
                          <select
                            value={columnFilters.salesman}
                            onChange={(e) => {
                              setColumnFilters({...columnFilters, salesman: e.target.value});
                              setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 bg-background border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-normal text-slate-700 cursor-pointer"
                          >
                            <option value="">All Salesmen</option>
                            {salesmen.map(s => (
                              <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </th>

                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left">History</th>
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative group">
                      <div className="flex items-center gap-1 cursor-pointer w-max h-full">
                        Source
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:text-primary" />
                        {sourceFilter !== 'All' && <span className="w-1.5 h-1.5 bg-primary rounded-full absolute top-[18px] right-2" />}
                        <select
                          value={sourceFilter}
                          onChange={(e) => handleSourceFilter(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-transparent"
                        >
                          <option value="All">All Sources</option>
                          <option value="Walk-in">Walk-in</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Phone">Phone</option>
                          <option value="Website">Website</option>
                        </select>
                      </div>
                    </th>
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative group">
                      <div className="flex items-center gap-1 cursor-pointer w-max h-full">
                        Urgency
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:text-primary" />
                        {urgencyFilter !== 'All' && <span className="w-1.5 h-1.5 bg-primary rounded-full absolute top-[18px] right-2" />}
                        <select
                          value={urgencyFilter}
                          onChange={(e) => handleUrgencyFilter(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-transparent"
                        >
                          <option value="All">All Urgency</option>
                          <option value="Hot">Hot</option>
                          <option value="Warm">Warm</option>
                          <option value="Cold">Cold</option>
                        </select>
                      </div>
                    </th>
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-4 text-left relative group">
                      <div className="flex items-center gap-1 cursor-pointer w-max h-full">
                        Status
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:text-primary" />
                        {statusFilter !== 'All' && <span className="w-1.5 h-1.5 bg-primary rounded-full absolute top-[18px] right-2" />}
                        <select
                          value={statusFilter}
                          onChange={(e) => handleStatusFilter(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-transparent"
                        >
                          <option value="All">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </th>
                    <th className="font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-4 bg-background/40 px-6 text-right">Actions</th>
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
                          <p className="font-body text-sm font-semibold text-text-muted">No leads found</p>
                          <p className="font-body text-xs text-text-muted/60">Try adjusting your search or filter criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((lead) => {
                      const stCfg = statusConfig[lead.status] || statusConfig['New'];
                      const uCfg = urgencyConfig[lead.urgency] || urgencyConfig['Warm'];
                      const UrgencyIcon = uCfg.icon;
                      const sCfg = sourceConfig[lead.source] || sourceConfig['Website'];

                      return (
                        <tr key={lead._id} className="border-t border-gray-50 hover:bg-background/40 transition-colors group">
                          <td className="pl-6 pr-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarClock className="w-3.5 h-3.5 text-text-muted/40 shrink-0" />
                              <span className="font-body text-sm text-text-muted whitespace-nowrap">
                                {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="min-w-0">
                              <p className="font-body text-sm font-semibold text-text">{lead.customerName}</p>
                              <p className="font-body text-xs text-text-muted mt-0.5 flex items-center gap-1">
                                <Phone className="w-3 h-3" />{lead.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {lead.carOfInterest ? (
                              <div className="flex flex-col">
                                <span className="font-body text-xs font-semibold text-text truncate max-w-[150px]">
                                  {lead.carOfInterest.make} {lead.carOfInterest.model}
                                </span>
                                <span className="font-body text-[11px] text-text-muted truncate max-w-[150px]">
                                  {lead.carOfInterest.year}
                                </span>
                              </div>
                            ) : (
                              <span className="font-body text-xs text-text-muted/60 italic">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                              <UserIcon className="w-4 h-4 text-slate-400" />
                              {lead.assignedTo?.name}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <button onClick={() => setViewTarget(lead)} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-primary border border-primary/20 hover:bg-primary/5 rounded-lg font-body text-xs font-semibold transition-colors">
                              <Eye className="w-3.5 h-3.5" /> View Log
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${sCfg.bg} ${sCfg.text} ${sCfg.ring}`}>
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-body text-[11px] font-bold ring-1 ${uCfg.bg} ${uCfg.text} ${uCfg.ring}`}>
                              <UrgencyIcon className="w-3 h-3" />{lead.urgency}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                              className={`px-3 py-1.5 rounded-full font-body text-[11px] font-bold outline-none cursor-pointer appearance-none border-0 ring-1 ${stCfg.bg} ${stCfg.text} ${stCfg.ring}`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/sales/edit-lead/${lead._id}`)}
                                className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                title="Edit Lead"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(lead._id)}
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

            {/* Mobile Card List */}
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
                  const stCfg = statusConfig[lead.status] || statusConfig['New'];
                  const uCfg = urgencyConfig[lead.urgency] || urgencyConfig['Warm'];
                  const sCfg = sourceConfig[lead.source] || sourceConfig['Website'];
                  const UrgencyIcon = uCfg.icon;

                  return (
                    <div key={lead._id} className="p-4 hover:bg-background/40 transition-colors space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text">{lead.customerName}</p>
                          <p className="font-body text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />{lead.phone}
                          </p>
                          {lead.carOfInterest && (
                            <p className="font-body text-xs text-primary flex items-center gap-1 mt-1">
                              <Car className="w-3 h-3" />
                              {lead.carOfInterest.year} {lead.carOfInterest.make} {lead.carOfInterest.model}
                            </p>
                          )}
                          <p className="font-body text-xs text-text-muted flex items-center gap-1 mt-1">
                            <UserIcon className="w-3 h-3" /> {lead.assignedTo?.name}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${stCfg.bg} ${stCfg.text} ${stCfg.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ring-1 ${uCfg.bg} ${uCfg.text} ${uCfg.ring}`}>
                          <UrgencyIcon className="w-2.5 h-2.5" />{lead.urgency}
                        </span>
                        <span className="font-body text-xs text-text-muted">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-50">
                        {lead.followUpDate ? (
                          <div className="flex items-center gap-1.5 text-primary">
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span className="font-body text-xs font-semibold">Next: {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                          </div>
                        ) : <div />}
                        <button onClick={() => setViewTarget(lead)} className="flex items-center gap-1 px-2.5 py-1 bg-surface text-primary border border-primary/20 hover:bg-primary/5 rounded-md font-body text-[11px] font-bold transition-colors">
                          <Eye className="w-3 h-3" /> View Log
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ring-1 ${sCfg.bg} ${sCfg.text} ${sCfg.ring}`}>
                          {lead.source}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => navigate(`/sales/edit-lead/${lead._id}`)} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-md transition-colors" title="Edit Lead">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(lead._id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-md transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
                <p className="font-body text-sm text-text-muted">
                  Showing <span className="font-semibold text-text">{showingFrom}</span> to{' '}
                  <span className="font-semibold text-text">{showingTo}</span> of{' '}
                  <span className="font-semibold text-text">{filtered.length}</span> leads
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-9 h-9 rounded-lg font-body text-sm font-bold flex items-center justify-center transition-colors ${pg === currentPage ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-background text-text-muted hover:text-text'}`}>
                      {pg}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Next<ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
