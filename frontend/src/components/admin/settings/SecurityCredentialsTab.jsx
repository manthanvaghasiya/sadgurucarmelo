/**
 * @file frontend/src/components/admin/settings/SecurityCredentialsTab.jsx
 * @description Comprehensive Security & Login Credentials control center with
 * identity management, password vault, real-time strength analyzer, cryptographic
 * generator, and active session protection metrics.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Shield,
  Key,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Save,
  Loader2,
  Sparkles,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react';
import axiosInstance from '../../../api/axiosConfig';
import { useAuth } from '../../../context/AuthContext';
import { useDealershipContact } from '../../../context/DealershipContactContext';
import PasswordStrengthMeter from './PasswordStrengthMeter';

export default function SecurityCredentialsTab() {
  const { user: authUser, updateUser } = useAuth();
  const { updateContact } = useDealershipContact();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(authUser || null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: authUser?.name || '',
      email: authUser?.email || '',
      phone: authUser?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedNewPassword = watch('newPassword') || '';
  const watchedConfirmPassword = watch('confirmPassword') || '';

  // ── 1. Fetch Current Admin Profile Once on Mount ──
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/auth/me');
        if (isMounted && res.data?.success && res.data?.data) {
          const u = res.data.data;
          setProfileData(u);
          reset({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          if (updateUser) updateUser(u);
        }
      } catch (err) {
        console.error('Failed to load admin profile:', err);
        if (isMounted && authUser) {
          setProfileData(authUser);
          reset({
            name: authUser.name || '',
            email: authUser.email || '',
            phone: authUser.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []); // Run once on mount to avoid infinite loops

  // ── 2. Cryptographic Password Generator ──
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    const array = new Uint32Array(16);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    }
    let generated = '';
    for (let i = 0; i < 16; i++) {
      generated += chars[array[i] % chars.length];
    }

    setValue('newPassword', generated, { shouldValidate: true });
    setValue('confirmPassword', generated, { shouldValidate: true });
    setShowNew(true);
    setShowConfirm(true);

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(generated).then(() => {
        toast.success('Strong password generated & copied to clipboard!');
      });
    } else {
      toast.success('Strong password generated!');
    }
  };

  // ── 3. Form Submission Handler ──
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
      };

      const hasPasswordChange = Boolean(data.newPassword && data.newPassword.trim());

      if (hasPasswordChange) {
        if (!data.currentPassword || !data.currentPassword.trim()) {
          toast.error('Current password is required to set a new password');
          return;
        }
        if (data.newPassword !== data.confirmPassword) {
          toast.error('New password and confirm password do not match');
          return;
        }
        if (data.newPassword.trim().length < 6) {
          toast.error('New password must be at least 6 characters');
          return;
        }
        payload.currentPassword = data.currentPassword;
        payload.newPassword = data.newPassword.trim();
      }

      const res = await axiosInstance.put('/auth/profile', payload);

      if (res.data?.success) {
        toast.success(res.data.message || 'Credentials and live website contact details updated successfully!');
        if (res.data.data) {
          setProfileData(res.data.data);
          if (updateUser) updateUser(res.data.data);
          if (updateContact) {
            updateContact({
              name: res.data.data.name,
              email: res.data.data.email,
              phone: res.data.data.phone,
            });
          }
        }

        // Reset password fields only
        setValue('currentPassword', '');
        setValue('newPassword', '');
        setValue('confirmPassword', '');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }
    } catch (err) {
      console.error('Update credentials error:', err);
      toast.error(err.response?.data?.message || 'Failed to update credentials. Please check current password.');
    }
  };

  const userInitial = (profileData?.name || profileData?.email || authUser?.email || 'A')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="max-w-3xl space-y-6">
      {/* Identity & Status Ribbon */}
        <div className="bg-surface rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white font-heading font-black text-xl flex items-center justify-center shadow-sm">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-text">
                  {profileData?.name || authUser?.name || 'Administrator'}
                </h2>
                <BadgeCheck className="w-4 h-4 text-brand-orange shrink-0" />
                {isLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-text-muted shrink-0" />
                )}
              </div>
              <p className="font-body text-xs text-text-muted font-medium">
                {profileData?.email || authUser?.email || 'admin@sadgurucarmelo.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-wider">
              {profileData?.role === 'admin' ? 'Master Admin' : profileData?.role || 'Admin'}
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-heading font-bold uppercase tracking-wider border border-emerald-200">
              Verified
            </span>
          </div>
        </div>

        {/* Core Credentials & Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Card 1: Account Identity Info */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">
                  Security & Login Credentials
                </h3>
                <p className="font-body text-xs text-text-muted">
                  Update your admin login email address, profile name, and security contact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="e.g. Sadguru Admin"
                    className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 font-body">{errors.name.message}</p>}
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Login Email Address */}
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Login Email Address (Username) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address format',
                      },
                    })}
                    placeholder="admin@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email.message}</p>}
                <p className="text-xs font-body text-text-muted/70 mt-1">
                  This is your username for logging into the admin portal.
                </p>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-5 border-t border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-brand-orange" />
                  <h4 className="font-heading font-bold text-sm text-text">Change Password</h4>
                  <span className="font-body text-xs text-text-muted">(Leave blank to keep current)</span>
                </div>

                {/* 1-Click Cryptographic Generator Button */}
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 text-xs font-heading font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Generate Strong Password</span>
                </button>
              </div>

              {/* Current Password */}
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Current Password {watchedNewPassword ? '*' : ''}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    {...register('currentPassword')}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {watchedNewPassword && !watch('currentPassword') && (
                  <p className="text-amber-600 text-xs mt-1 font-body flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Current password is required to change password
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    {...register('newPassword')}
                    placeholder="Min 6 characters"
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Strength Meter */}
                <PasswordStrengthMeter
                  password={watchedNewPassword}
                  confirmPassword={watchedConfirmPassword}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Repeat new password"
                    className="w-full pl-11 pr-11 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-body text-text-muted">
                Changes take effect immediately for current and future sessions.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-sm shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
    </div>
  );
}
