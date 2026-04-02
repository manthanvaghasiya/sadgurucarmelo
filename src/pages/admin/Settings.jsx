import { useState } from 'react';
import {
  Users,
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
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Ban,
  RefreshCw,
  MessageCircle,
  X,
  TrendingUp,
  ChevronDown,
  Home,
  Briefcase,
} from 'lucide-react';

// ── Horizontal Tab Config ──
const TABS = [
  { id: 'team', label: 'Sales Team Management', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
];

// ── Mock staff roster ──
const initialStaff = [
  { id: 'SGM-001', name: 'Ravi Kumar', phone: '+91 98765 43210', status: 'Active', joinDate: 'Jan 15, 2024', leads: 45 },
  { id: 'SGM-002', name: 'Priya Mehta', phone: '+91 87654 32109', status: 'Active', joinDate: 'Feb 02, 2024', leads: 38 },
  { id: 'SGM-003', name: 'Amit Sharma', phone: '+91 76543 21098', status: 'Suspended', joinDate: 'Mar 10, 2024', leads: 12 },
  { id: 'SGM-004', name: 'Neha Patel', phone: '+91 65432 10987', status: 'Active', joinDate: 'Apr 22, 2024', leads: 61 },
  { id: 'SGM-005', name: 'Vikram Singh', phone: '+91 54321 09876', status: 'Active', joinDate: 'May 05, 2024', leads: 27 },
  { id: 'SGM-006', name: 'Kavita Joshi', phone: '+91 43210 98765', status: 'Suspended', joinDate: 'Jun 14, 2024', leads: 8 },
];

const statusConfig = {
  Active: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/20', dot: 'bg-accent' },
  Suspended: { bg: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-500/20', dot: 'bg-red-400' },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('team');

  return (
    <div className="space-y-0">
      {/* ═══════════════════════════════════════
          Page Header
         ═══════════════════════════════════════ */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">
          System Settings & Team
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Manage dealership details, branding, and sales team access.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          Horizontal Tab Navigation
         ═══════════════════════════════════════ */}
      <div className="bg-surface rounded-t-2xl border border-b-0 border-gray-100 px-2 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-4
                  font-body text-sm font-semibold whitespace-nowrap
                  transition-colors duration-200
                  ${isActive
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text'
                  }
                `}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Tab Content
         ═══════════════════════════════════════ */}
      <div className="bg-surface rounded-b-2xl rounded-tr-2xl border border-gray-100 border-t-0">
        {activeTab === 'team' && <TeamPanel />}
        {activeTab === 'security' && <SecurityPanel />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PANEL 1: Sales Team Management (Full-Width)
   ═══════════════════════════════════════════════════════ */
function TeamPanel() {
  const [staff, setStaff] = useState(initialStaff);
  // Registration form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newEmpId, setNewEmpId] = useState('SGM-007');
  const [newPassword, setNewPassword] = useState('Sadguru@2024');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newRole, setNewRole] = useState('salesman');
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  // Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = staff.filter((s) => s.status === 'Active').length;
  const suspendedCount = staff.filter((s) => s.status === 'Suspended').length;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    setIsCreating(true);
    setTimeout(() => {
      setStaff((prev) => [
        ...prev,
        { id: newEmpId, name: newName, phone: newPhone, status: 'Active', joinDate: 'Today', leads: 0 },
      ]);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
      setNewPassword('Sadguru@2024');
      setShowNewPassword(false);
      setNewRole('salesman');
      setNewEmpId(`SGM-${String(staff.length + 2).padStart(3, '0')}`);
      setIsCreating(false);
      setCreated(true);
      setShowRegForm(false);
      setTimeout(() => setCreated(false), 3000);
    }, 1200);
  };

  const handleCopy = (text, tag) => {
    navigator.clipboard.writeText(text);
    setCopiedId(tag);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (empId) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === empId ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s
      )
    );
  };

  const handleDelete = () => {
    setStaff((prev) => prev.filter((s) => s.id !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <>
      {/* ── Modals ── */}
      {deleteTarget && (
        <ConfirmModal
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          iconBg="bg-red-50"
          title="Revoke Access?"
          description={<>This will permanently remove <strong>{deleteTarget}</strong> from the sales team.</>}
          confirmLabel="Yes, Revoke"
          confirmClass="bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {resetTarget && (
        <ConfirmModal
          icon={<KeyRound className="w-5 h-5 text-[#d97706]" />}
          iconBg="bg-[#f59e0b]/10"
          title="Reset Password"
          description={<>Generate a new temporary password for <strong>{resetTarget}</strong>.</>}
          confirmLabel="Confirm Reset"
          confirmClass="bg-primary hover:bg-primary-hover text-white shadow-primary/20"
          onConfirm={() => setResetTarget(null)}
          onCancel={() => setResetTarget(null)}
        >
          <div className="p-3 bg-background rounded-xl flex items-center justify-between my-4">
            <code className="font-body text-sm font-semibold text-text tracking-wide">Sadguru@Reset2024</code>
            <button onClick={() => handleCopy('Sadguru@Reset2024', 'reset-pw')} className="p-1.5 text-text-muted hover:text-text transition-colors">
              {copiedId === 'reset-pw' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </ConfirmModal>
      )}

      <div className="p-6 space-y-6">
        {/* ── Success Banner ── */}
        {created && (
          <div className="flex items-center gap-3 px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl animate-in">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <p className="font-body text-sm font-semibold text-accent">Staff account created successfully! They can now login at /sales/login</p>
          </div>
        )}

        {/* ── Toggle Register Form Button ── */}
        {!showRegForm && (
          <button
            onClick={() => setShowRegForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-accent/20"
          >
            <UserPlus className="w-4 h-4" />
            Register New Sales Team Member
          </button>
        )}

        {/* ── Registration Form Card ── */}
        {showRegForm && (
          <div className="bg-surface rounded-2xl border border-gray-100 shadow-lg shadow-primary/5 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-[17px] text-text">Register New Sales Team Member</h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">Fill in personal details and assign portal credentials</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegForm(false)}
                className="p-2 text-text-muted hover:text-text hover:bg-background rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Section 1: Personal Information */}
              <div className="p-6 space-y-4">
                <h3 className="font-body text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                      <Phone className="w-3.5 h-3.5 text-text-muted" />
                      Mobile Number <span className="text-red-400">*</span>
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
                  <div className="space-y-2 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                        <Mail className="w-3.5 h-3.5 text-text-muted" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="ravi@example.com"
                        className="w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                    <Home className="w-3.5 h-3.5 text-text-muted" />
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Full residential address"
                    className="w-full px-4 py-3 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Section 2: Dealership Credentials */}
              <div className="p-6 bg-background/60 border-y border-gray-100 space-y-4">
                <h3 className="font-body text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  Dealership Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Employee ID */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                      <KeyRound className="w-3.5 h-3.5 text-text-muted" />
                      Employee ID <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEmpId}
                        onChange={(e) => setNewEmpId(e.target.value)}
                        placeholder="SGM-001"
                        className="w-full px-4 py-3 pr-10 bg-surface rounded-xl font-body text-sm font-mono text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 border border-gray-100"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(newEmpId, 'reg-id')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                        title="Copy ID"
                      >
                        {copiedId === 'reg-id' ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Account Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                      <Shield className="w-3.5 h-3.5 text-text-muted" />
                      Account Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-20 bg-surface rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 border border-gray-100"
                        required
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(newPassword, 'reg-pw')}
                          className="p-1.5 text-text-muted hover:text-text transition-colors rounded-md"
                          title="Copy Password"
                        >
                          {copiedId === 'reg-pw' ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="p-1.5 text-text-muted hover:text-text transition-colors rounded-md"
                          title={showNewPassword ? 'Hide Password' : 'Show Password'}
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Access Role */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-body text-sm font-semibold text-text">
                      <Briefcase className="w-3.5 h-3.5 text-text-muted" />
                      Access Role
                    </label>
                    <div className="relative">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-4 py-3 bg-surface rounded-xl font-body text-sm text-text appearance-none cursor-pointer outline-none transition-all focus:ring-2 focus:ring-primary/10 border border-gray-100 pr-10"
                      >
                        <option value="salesman">Standard Salesman</option>
                        <option value="manager">Showroom Manager</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>
                <p className="font-body text-[11px] text-text-muted/60 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Staff will use these credentials to login at <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-[10px] text-text-muted border border-gray-100">/sales/login</code>
                </p>
              </div>

              {/* Action Footer */}
              <div className="p-6">
                <button
                  type="submit"
                  disabled={isCreating || !newName.trim() || !newPhone.trim() || !newEmpId.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-base font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
                      Create Staff Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Roster Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4">
            <h2 className="font-heading font-bold text-lg text-text">
              Staff Roster
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                {activeCount} active
              </span>
              {suspendedCount > 0 && (
                <span className="font-body text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                  {suspendedCount} suspended
                </span>
              )}
            </div>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full pl-9 pr-4 py-2 bg-background rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* ── Full-Width Staff Table ── */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-y border-gray-100">
                {['Employee', 'Contact', 'Performance', 'Status', 'Joined', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className={`font-body text-[11px] font-bold text-text-muted uppercase tracking-wider py-3 bg-background/30 ${
                      col === 'Actions' ? 'text-right pr-6' : 'text-left px-6'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-text-muted/30" />
                      <p className="font-body text-sm text-text-muted">No staff members found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((member, idx) => {
                  const cfg = statusConfig[member.status];
                  return (
                    <tr
                      key={member.id}
                      className={`border-b border-gray-50 hover:bg-background/40 transition-colors group ${
                        idx === filtered.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      {/* Employee */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center font-heading font-bold text-sm text-primary shrink-0">
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-sm font-semibold text-text">{member.name}</p>
                            <p className="font-body text-xs text-text-muted/60 font-mono mt-0.5">
                              ID: {member.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm text-text">{member.phone}</span>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[\s+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-accent/60 hover:text-accent transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Performance */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-text-muted/40" />
                          <span className="font-body text-sm text-text">
                            <span className="font-heading font-bold">{member.leads}</span>
                            <span className="text-text-muted ml-1">leads handled</span>
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {member.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <span className="font-body text-sm text-text-muted">{member.joinDate}</span>
                      </td>

                      {/* Actions */}
                      <td className="pr-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
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
                                : 'text-text-muted hover:text-accent hover:bg-accent/10'
                            }`}
                            title={member.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
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

        {/* Roster Footer */}
        <div className="flex items-center justify-between pt-2 -mx-6 px-6 border-t border-gray-50">
          <p className="font-body text-xs text-text-muted py-3">
            Total: <span className="font-semibold text-text">{staff.length}</span> team members
          </p>
          <p className="font-body text-[11px] text-text-muted/50">
            Staff login at <code className="bg-background px-1.5 py-0.5 rounded font-mono">/sales/login</code>
          </p>
        </div>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   PANEL 3: Security (Centered Max-Width)
   ═══════════════════════════════════════════════════════ */
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
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-text">Account Security</h2>
            <p className="font-body text-xs text-text-muted">Update your admin master password</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          {[
            { label: 'Current Password', value: currentPw, setter: setCurrentPw, show: showCurrent, toggle: setShowCurrent, idx: 0 },
            { label: 'New Password', value: newPw, setter: setNewPw, show: showNew, toggle: setShowNew, idx: 1 },
            { label: 'Confirm New Password', value: confirmPw, setter: setConfirmPw, show: showConfirm, toggle: setShowConfirm, idx: 2 },
          ].map((field) => (
            <div key={field.label} className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? 'text' : 'password'}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11 ${field.idx === 2 && mismatch ? 'ring-2 ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => field.toggle(!field.show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors"
                >
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {field.idx === 1 && newPw.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      newPw.length < 6 ? 'w-1/4 bg-red-400' : newPw.length < 10 ? 'w-2/4 bg-[#f59e0b]' : 'w-full bg-[#10b981]'
                    }`} />
                  </div>
                  <span className="font-body text-[11px] text-text-muted">
                    {newPw.length < 6 ? 'Weak' : newPw.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
              {field.idx === 2 && mismatch && (
                <p className="flex items-center gap-1 font-body text-xs text-red-500">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={!currentPw || !newPw || !confirmPw || mismatch}
            className="flex items-center gap-2 px-5 py-3 border-2 border-primary text-primary rounded-xl font-body text-sm font-bold hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shield className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED: Reusable Components
   ═══════════════════════════════════════════════════════ */
function FieldBlock({ label, icon: Icon, children }) {
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

function ConfirmModal({ icon, iconBg, title, description, confirmLabel, confirmClass, onConfirm, onCancel, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
            {icon}
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-text">{title}</h3>
            <p className="font-body text-sm text-text-muted mt-0.5">{description}</p>
          </div>
        </div>
        {children}
        <div className="flex items-center gap-3 justify-end pt-1">
          <button onClick={onCancel} className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl font-body text-sm font-bold transition-colors shadow-sm ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
