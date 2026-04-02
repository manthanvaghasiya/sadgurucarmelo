import { useState } from 'react';
import {
  Users,
  Store,
  Shield,
  Plus,
  Eye,
  EyeOff,
  KeyRound,
  Trash2,
  UserPlus,
  Phone,
  User,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  MoreVertical,
  Ban,
  RefreshCw,
  Globe,
  Clock,
  Building2,
} from 'lucide-react';

// ── Navigation items ──
const NAV_ITEMS = [
  { id: 'team', label: 'Sales Team Management', icon: Users },
  { id: 'general', label: 'General Dealership Info', icon: Store },
  { id: 'security', label: 'Security & Password', icon: Shield },
];

// ── Mock staff data ──
const initialStaff = [
  { id: 'SGM-001', name: 'Ravi Kumar', phone: '+91 98765 43210', status: 'Active', joinDate: 'Jan 15, 2024', leads: 34 },
  { id: 'SGM-002', name: 'Priya Mehta', phone: '+91 87654 32109', status: 'Active', joinDate: 'Feb 02, 2024', leads: 28 },
  { id: 'SGM-003', name: 'Amit Sharma', phone: '+91 76543 21098', status: 'Suspended', joinDate: 'Mar 10, 2024', leads: 12 },
  { id: 'SGM-004', name: 'Neha Patel', phone: '+91 65432 10987', status: 'Active', joinDate: 'Apr 22, 2024', leads: 41 },
  { id: 'SGM-005', name: 'Vikram Singh', phone: '+91 54321 09876', status: 'Active', joinDate: 'May 05, 2024', leads: 19 },
];

const statusConfig = {
  Active: { bg: 'bg-[#10b981]/10', text: 'text-[#059669]', ring: 'ring-[#10b981]/20', dot: 'bg-[#10b981]' },
  Suspended: { bg: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-500/20', dot: 'bg-red-400' },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('team');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════
          Page Header
         ═══════════════════════════════════════ */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-text">
          System Settings & Team
        </h1>
        <p className="font-body text-sm text-text-muted mt-1 max-w-xl">
          Manage dealership details, branding, and sales team access.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          Two-Column Layout
         ═══════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left Column: Navigation ── */}
        <div className="lg:w-[260px] shrink-0">
          {/* Mobile: Dropdown Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-surface rounded-xl border border-gray-100 font-body text-sm font-semibold text-text mb-3"
          >
            <span className="flex items-center gap-2">
              {(() => {
                const item = NAV_ITEMS.find((n) => n.id === activeTab);
                const Icon = item.icon;
                return (
                  <>
                    <Icon className="w-4 h-4 text-primary" />
                    {item.label}
                  </>
                );
              })()}
            </span>
            <svg className={`w-4 h-4 text-text-muted transition-transform ${mobileNavOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Nav Items */}
          <nav
            className={`bg-surface rounded-2xl border border-gray-100 overflow-hidden ${
              mobileNavOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-2 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      font-body text-sm font-semibold
                      transition-all duration-200 text-left relative
                      ${isActive
                        ? 'bg-primary/8 text-primary'
                        : 'text-text-muted hover:text-text hover:bg-background'
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                    )}
                    <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Nav Footer */}
            <div className="px-4 py-3 border-t border-gray-100 mt-1">
              <p className="font-body text-[11px] text-text-muted/50">
                Settings v2.0 — Admin Panel
              </p>
            </div>
          </nav>
        </div>

        {/* ── Right Column: Active Panel ── */}
        <div className="flex-1 min-w-0">
          {activeTab === 'team' && <TeamManagementPanel />}
          {activeTab === 'general' && <GeneralInfoPanel />}
          {activeTab === 'security' && <SecurityPanel />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Panel 1: Sales Team Management
   ═══════════════════════════════════════════════ */
function TeamManagementPanel() {
  const [staff, setStaff] = useState(initialStaff);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmpId, setNewEmpId] = useState('SGM-006');
  const [newPassword, setNewPassword] = useState('Sadguru@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    setIsCreating(true);
    setTimeout(() => {
      setStaff((prev) => [
        ...prev,
        { id: newEmpId, name: newName, phone: newPhone, status: 'Active', joinDate: 'Today', leads: 0 },
      ]);
      setNewName('');
      setNewPhone('');
      setNewEmpId(`SGM-${String(staff.length + 2).padStart(3, '0')}`);
      setNewPassword('Sadguru@2024');
      setIsCreating(false);
      setCreated(true);
      setTimeout(() => setCreated(false), 3000);
    }, 1200);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (empId) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === empId
          ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' }
          : s
      )
    );
    setActionMenu(null);
  };

  const handleDelete = () => {
    setStaff((prev) => prev.filter((s) => s.id !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Revoke Access?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">
                  This will permanently delete <span className="font-semibold text-text">{deleteTarget}</span> and revoke all portal access.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20">
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setResetTarget(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-[#d97706]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Reset Password</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">
                  Generate a new temporary password for <span className="font-semibold text-text">{resetTarget}</span>.
                </p>
              </div>
            </div>
            <div className="p-3 bg-background rounded-xl flex items-center justify-between">
              <code className="font-body text-sm font-semibold text-text">Sadguru@Reset2024</code>
              <button
                onClick={() => handleCopy('Sadguru@Reset2024', 'reset-pw')}
                className="p-1.5 text-text-muted hover:text-text transition-colors"
              >
                {copiedId === 'reset-pw' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setResetTarget(null)} className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
                Close
              </button>
              <button onClick={() => setResetTarget(null)} className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-primary/20">
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section A: Create New Salesman ── */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[17px] text-text">
                Add New Sales Team Member
              </h2>
              <p className="font-body text-xs text-text-muted mt-0.5">
                Create login credentials for the Sales Portal
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <User className="w-3.5 h-3.5 text-text-muted" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <Phone className="w-3.5 h-3.5 text-text-muted" />
                Contact Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          {/* Credentials Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Employee ID */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <KeyRound className="w-3.5 h-3.5 text-text-muted" />
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newEmpId}
                  onChange={(e) => setNewEmpId(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-background rounded-xl font-body text-sm font-mono text-text outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(newEmpId, 'emp-id')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors"
                  title="Copy ID"
                >
                  {copiedId === 'emp-id' ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Temporary Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                <Shield className="w-3.5 h-3.5 text-text-muted" />
                Temporary Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-20 bg-background rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(newPassword, 'pw')}
                    className="p-1.5 text-text-muted hover:text-text transition-colors"
                    title="Copy Password"
                  >
                    {copiedId === 'pw' ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-text-muted hover:text-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            <p className="font-body text-xs text-text-muted/60 hidden sm:block">
              Staff member will use these credentials to login at <span className="font-semibold text-text-muted">/sales/login</span>
            </p>
            <button
              type="submit"
              disabled={isCreating || !newName || !newPhone}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : created ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Account Created!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Create Staff Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section B: Active Staff Roster ── */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[17px] text-text">
                Active Staff Roster
              </h2>
              <p className="font-body text-xs text-text-muted mt-0.5">
                {staff.filter((s) => s.status === 'Active').length} active · {staff.filter((s) => s.status === 'Suspended').length} suspended
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff..."
              className="w-full pl-9 pr-4 py-2.5 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Staff Member', 'Employee ID', 'Status', 'Joined', 'Leads', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className={`font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-3.5 bg-background/40 ${
                      col === 'Actions' ? 'text-right px-6' : 'text-left px-4 first:pl-6'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p className="font-body text-sm text-text-muted">No staff members found.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => {
                  const cfg = statusConfig[member.status];
                  return (
                    <tr key={member.id} className="border-t border-gray-50 hover:bg-background/40 transition-colors group">
                      {/* Name + Phone */}
                      <td className="pl-6 pr-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center font-heading font-bold text-xs text-primary shrink-0">
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-sm font-semibold text-text truncate">{member.name}</p>
                            <p className="font-body text-xs text-text-muted flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />{member.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="px-4 py-4">
                        <code className="font-body text-sm font-mono font-semibold text-text bg-background px-2 py-1 rounded-md">
                          {member.id}
                        </code>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {member.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4">
                        <span className="font-body text-sm text-text-muted">{member.joinDate}</span>
                      </td>

                      {/* Leads */}
                      <td className="px-4 py-4">
                        <span className="font-heading font-bold text-sm text-text">{member.leads}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setResetTarget(member.id)}
                            className="p-2 text-text-muted hover:text-[#d97706] hover:bg-[#f59e0b]/10 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(member.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              member.status === 'Active'
                                ? 'text-text-muted hover:text-[#d97706] hover:bg-[#f59e0b]/10'
                                : 'text-text-muted hover:text-[#059669] hover:bg-[#10b981]/10'
                            }`}
                            title={member.status === 'Active' ? 'Suspend' : 'Reactivate'}
                          >
                            {member.status === 'Active' ? <Ban className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(member.id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Revoke Access"
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

        {/* ── Mobile Card List ── */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredStaff.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-body text-sm text-text-muted">No staff members found.</p>
            </div>
          ) : (
            filteredStaff.map((member) => {
              const cfg = statusConfig[member.status];
              return (
                <div key={member.id} className="p-4 hover:bg-background/40 transition-colors space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center font-heading font-bold text-xs text-primary shrink-0">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-text truncate">{member.name}</p>
                        <code className="font-body text-xs font-mono text-text-muted">{member.id}</code>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {member.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-text-muted">{member.leads} leads · {member.joinDate}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setResetTarget(member.id)} className="p-1.5 text-text-muted hover:text-[#d97706] rounded-md transition-colors">
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(member.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Roster Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="font-body text-xs text-text-muted">
            Total staff: <span className="font-semibold text-text">{staff.length}</span> members
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Panel 2: General Dealership Info
   ═══════════════════════════════════════════════ */
function GeneralInfoPanel() {
  const [dealerName, setDealerName] = useState('Sadguru Car Melo');
  const [supportEmail, setSupportEmail] = useState('info@sadgurucarmelo.com');
  const [publicPhone, setPublicPhone] = useState('+91 99136 34447');
  const [website, setWebsite] = useState('www.sadgurucarmelo.com');
  const [businessHours, setBusinessHours] = useState('9:00 AM – 8:00 PM');
  const [address, setAddress] = useState('Near Petrol Pump, Main Highway Road,\nRajkot, Gujarat 360001');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const inputCls = 'w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10';

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-[17px] text-text">General Dealership Info</h2>
            <p className="font-body text-xs text-text-muted mt-0.5">Public-facing information for your customers</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
              <Store className="w-3.5 h-3.5 text-text-muted" /> Dealership Name
            </label>
            <input type="text" value={dealerName} onChange={(e) => setDealerName(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
              <Mail className="w-3.5 h-3.5 text-text-muted" /> Support Email
            </label>
            <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
              <Phone className="w-3.5 h-3.5 text-text-muted" /> Public Phone Number
            </label>
            <input type="tel" value={publicPhone} onChange={(e) => setPublicPhone(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
              <Globe className="w-3.5 h-3.5 text-text-muted" /> Website
            </label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
              <Clock className="w-3.5 h-3.5 text-text-muted" /> Business Hours
            </label>
            <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
            <MapPin className="w-3.5 h-3.5 text-text-muted" /> Physical Address
          </label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-bold transition-all shadow-lg disabled:opacity-70 ${
              saved
                ? 'bg-[#10b981] text-white shadow-[#10b981]/20'
                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'
            }`}
          >
            {isSaving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Panel 3: Security & Password
   ═══════════════════════════════════════════════ */
function SecurityPanel() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;
  const inputCls = 'w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10';

  const handleUpdate = (e) => {
    e.preventDefault();
    if (mismatch) return;
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-[17px] text-text">Account Security</h2>
            <p className="font-body text-xs text-text-muted mt-0.5">Update your admin master password</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="p-6 space-y-5">
        {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
          const value = [currentPw, newPw, confirmPw][i];
          const setter = [setCurrentPw, setNewPw, setConfirmPw][i];
          const show = [showCurrent, showNew, showConfirm][i];
          const toggle = [setShowCurrent, setShowNew, setShowConfirm][i];
          const hasError = i === 2 && mismatch;
          return (
            <div key={label} className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11 ${hasError ? 'ring-2 ring-red-500/20' : ''}`}
                />
                <button type="button" onClick={() => toggle(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasError && (
                <p className="flex items-center gap-1 font-body text-xs text-red-500">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              {i === 1 && newPw.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      newPw.length < 6 ? 'w-1/4 bg-red-400' : newPw.length < 10 ? 'w-2/4 bg-[#f59e0b]' : 'w-full bg-[#10b981]'
                    }`} />
                  </div>
                  <span className="font-body text-[11px] text-text-muted font-medium">
                    {newPw.length < 6 ? 'Weak' : newPw.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={!currentPw || !newPw || !confirmPw || mismatch}
          className="flex items-center gap-2 px-5 py-3 border-2 border-primary text-primary rounded-xl font-body text-sm font-bold hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Shield className="w-4 h-4" /> Update Password
        </button>
      </form>
    </div>
  );
}
