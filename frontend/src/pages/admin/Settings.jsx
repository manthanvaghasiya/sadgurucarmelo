import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Settings,
  Users,
  Shield,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCircle,
  AlertTriangle,
  Lock,
  Key,
  Edit2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

// ── Role badge config ──
const roleStyles = {
  admin: 'bg-primary/10 text-primary ring-primary/20',
  sales: 'bg-accent/10 text-accent ring-accent/20',
};

export default function AdminSettings() {
  // ── Tab Management ──
  const [activeTab, setActiveTab] = useState('team');

  // ── Team State ──
  const [staff, setStaff] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // ── Password State ──
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Forms ──
  const {
    register: registerStaff,
    handleSubmit: handleStaffSubmit,
    reset: resetStaff,
    formState: { errors: staffErrors, isSubmitting: staffSubmitting },
  } = useForm();

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    watch: watchPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm();

  // ── Fetch staff roster from API ──
  const fetchStaff = useCallback(async () => {
    setTeamLoading(true);
    try {
      const res = await axiosInstance.get('/auth/users');
      if (res.data.success) {
        setStaff((res.data.data || []).filter(user => user.role !== 'admin'));
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      toast.error('Failed to load team members');
    } finally {
      setTeamLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // ── Create or Edit Staff ──
  const onSubmitStaff = async (data) => {
    try {
      // Find original member if editing to keep their current role
      const member = editTarget ? staff.find(s => s._id === editTarget) : null;

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: editTarget ? (member?.role || 'sales') : 'sales', // Use existing role for edits, 'sales' for new
      };
      if (data.password) payload.password = data.password;
      if (data.phone?.trim()) payload.phone = data.phone.trim();
      if (data.address?.trim()) payload.address = data.address.trim();

      if (editTarget) {
        const res = await axiosInstance.put(`/auth/users/${editTarget}`, payload);
        if (res.data.success) {
          setStaff(prev => prev.map(s => s._id === editTarget ? res.data.data : s));
          resetStaff({});
          setEditTarget(null);
          setShowCreateForm(false);
          toast.success(`${res.data.data.name} updated successfully!`);
        }
      } else {
        const res = await axiosInstance.post('/auth/register', payload);
        if (res.data.success) {
          setStaff(prev => [res.data.data, ...prev]);
          resetStaff({});
          setShowCreateForm(false);
          toast.success(`${res.data.data.name} registered successfully!`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save staff account');
    }
  };

  const handleEditStaff = (member) => {
    resetStaff({
      name: member.name,
      email: member.email,
      role: member.role,
      phone: member.phone || '',
      address: member.address || ''
    });
    setEditTarget(member._id);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Toggle Staff Active/Suspend ──
  const toggleActive = async (userId, currentStatus) => {
    try {
      const res = await axiosInstance.put(`/auth/users/${userId}`, { isActive: !currentStatus });
      if (res.data.success) {
        setStaff(prev => prev.map(s => s._id === userId ? { ...s, isActive: !currentStatus } : s));
        toast.success(!currentStatus ? 'Account activated' : 'Account suspended');
      }
    } catch (err) {
      toast.error('Failed to update account status');
    }
  };

  // ── Delete Staff ──
  const handleDeleteStaff = async () => {
    if (!deleteTarget) return;
    try {
      await axiosInstance.delete(`/auth/users/${deleteTarget}`);
      setStaff(prev => prev.filter(s => s._id !== deleteTarget));
      setDeleteTarget(null);
      toast.success('Staff account removed');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  // ── Change Password ──
  const onChangePassword = async (data) => {
    try {
      const res = await axiosInstance.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        resetPwd();
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const tabs = [
    { id: 'team', label: 'Sales Team', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Delete Account?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">This staff account will be permanently removed.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">Cancel</button>
              <button onClick={handleDeleteStaff} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary animate-[spin_3s_linear_infinite]" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Settings</h1>
          <p className="font-body text-sm text-text-muted">Manage your team and security preferences.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-1.5 inline-flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/15'
                : 'text-text-muted hover:text-text hover:bg-background'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════ Team Tab ═══════════════════════ */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Create Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-text">Sales Team Roster</h2>
              <p className="font-body text-sm text-text-muted mt-0.5">{staff.length} team member{staff.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => {
                if (showCreateForm) {
                  resetStaff({});
                  setEditTarget(null);
                }
                setShowCreateForm(!showCreateForm);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              {showCreateForm ? 'Cancel' : 'Add Staff'}
            </button>
          </div>

          {/* Create / Edit Staff Form */}
          {showCreateForm && (
            <form onSubmit={handleStaffSubmit(onSubmitStaff)} className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-4">
              <h3 className="font-heading font-bold text-base text-text mb-2">
                {editTarget ? 'Edit Staff Account' : 'Create Staff Account'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input
                    {...registerStaff('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. Rahul Patel"
                  />
                  {staffErrors.name && <p className="text-red-500 text-xs font-body mt-1">{staffErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    {...registerStaff('email', { required: 'Email is required' })}
                    className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. rahul@gmail.com"
                  />
                  {staffErrors.email && <p className="text-red-500 text-xs font-body mt-1">{staffErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                    Password {editTarget && '(Leave blank to keep current)'} {!editTarget && '*'}
                  </label>
                  <input
                    type="password"
                    {...registerStaff('password', { required: editTarget ? false : 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                    placeholder="Min 6 characters"
                  />
                  {staffErrors.password && <p className="text-red-500 text-xs font-body mt-1">{staffErrors.password.message}</p>}
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Role</label>
                  <input
                    value="Salesman"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 font-body text-sm text-text-muted cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Phone</label>
                  <input
                    {...registerStaff('phone')}
                    className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Address</label>
                  <input
                    {...registerStaff('address')}
                    className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. Varachha, Surat"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={staffSubmitting}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {staffSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editTarget ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Staff Roster */}
          <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
            {teamLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="mt-4 font-body text-sm text-text-muted">Loading team members...</p>
              </div>
            ) : staff.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-text-muted/40" />
                </div>
                <p className="font-body text-sm font-semibold text-text-muted">No team members yet</p>
                <p className="font-body text-xs text-text-muted/60 mt-1">Click "Add Staff" to create your first team member.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {staff.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-5 hover:bg-background/40 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6 text-primary/40" />
                      </div>
                      <div className="min-w-0 flex flex-col gap-1">
                        <p className="font-body text-sm font-semibold text-text">{member.name}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {member.email && (
                            <p className="font-body text-xs text-text-muted flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {member.email}
                            </p>
                          )}
                          {member.phone && (
                            <p className="font-body text-xs text-text-muted flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {member.phone}
                            </p>
                          )}
                        </div>
                        {member.address && (
                          <p className="font-body text-xs text-text-muted/70 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {member.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full font-body text-[11px] font-bold ring-1 capitalize ${roleStyles[member.role] || roleStyles['sales']}`}>
                        {member.role}
                      </span>
                      <button
                        onClick={() => handleEditStaff(member)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                        title="Edit Staff"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(member._id, member.isActive)}
                        className={`p-1.5 rounded-lg transition-colors ${member.isActive ? 'text-[#10b981] hover:bg-[#10b981]/10' : 'text-red-400 hover:bg-red-50'}`}
                        title={member.isActive ? 'Active — Click to suspend' : 'Suspended — Click to activate'}
                      >
                        {member.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(member._id)}
                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                        title="Delete Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ Security Tab ═══════════════════════ */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-[#d97706]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-text">Change Password</h2>
                <p className="font-body text-sm text-text-muted">Update your admin account password.</p>
              </div>
            </div>
            <form onSubmit={handlePwdSubmit(onChangePassword)} className="space-y-4 max-w-md">
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    {...registerPwd('currentPassword', { required: 'Required' })}
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwdErrors.currentPassword && <p className="text-red-500 text-xs font-body mt-1">{pwdErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    {...registerPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwdErrors.newPassword && <p className="text-red-500 text-xs font-body mt-1">{pwdErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...registerPwd('confirmPassword', {
                      required: 'Required',
                      validate: (val) => val === watchPwd('newPassword') || 'Passwords do not match',
                    })}
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwdErrors.confirmPassword && <p className="text-red-500 text-xs font-body mt-1">{pwdErrors.confirmPassword.message}</p>}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwdSubmitting}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {pwdSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}