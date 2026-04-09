import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User, Phone, MessageCircle, Car, MapPin, Flame,
  Thermometer, Snowflake, ArrowLeft, CheckCircle2, Loader2,
  CalendarClock,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';

export default function AddLead() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cars } = useCars();
  const [urgency, setUrgency] = useState('Warm');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      source: 'Walk-in',
    },
  });

  const selectedCarOfInterest = watch('carOfInterest');

  const onSubmit = async (data) => {
    try {
      let combinedNotes = data.notes || '';
      if (data.carOfInterest === 'custom' && data.customCarName) {
        combinedNotes = `Looking for: ${data.customCarName}${combinedNotes ? `\n\n${combinedNotes}` : ''}`;
      }

      const payload = {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || '',
        source: data.source,
        urgency,
        notes: combinedNotes ? `[${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}] ${combinedNotes}` : '',
        carOfInterest: (data.carOfInterest && data.carOfInterest !== 'custom') ? data.carOfInterest : undefined,
        followUpDate: data.followUpDate || undefined,
      };

      await axiosInstance.post('/leads', payload);
      toast.success('Lead captured successfully!', {
        icon: '✅',
        style: { fontFamily: 'var(--font-body)' },
      });
      navigate('/sales');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    }
  };

  // Available cars for dropdown
  const availableCars = cars.filter(c => c.status !== 'Sold');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/sales')}
            className="p-2 bg-background hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text" />
          </button>
          <div className="flex-1">
            <p className="font-body text-xs text-text-muted uppercase tracking-wider">New Lead</p>
            <h1 className="font-heading font-bold text-lg text-text">Capture Walk-in</h1>
          </div>
          <div className="hidden sm:block text-right">
            <p className="font-body text-[10px] text-text-muted uppercase tracking-widest font-bold">Sales Executive</p>
            <p className="font-heading font-bold text-sm text-primary capitalize">{user?.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Customer Info ── */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-heading font-bold text-sm text-text-muted uppercase tracking-widest mb-2">Customer Information</h2>

            {/* Name */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  {...register('customerName', { required: 'Customer name is required' })}
                  placeholder="e.g. Rajesh Patel"
                  className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {errors.customerName && <p className="text-red-500 text-xs font-body mt-1">{errors.customerName.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit phone' },
                  })}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs font-body mt-1">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Email (Optional)
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="e.g. rajesh@email.com"
                className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* ── Lead Details ── */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-heading font-bold text-sm text-text-muted uppercase tracking-widest mb-2">Lead Details</h2>

            {/* Source */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Lead Source *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  {...register('source', { required: 'Source is required' })}
                  className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                >
                  <option value="Walk-in">🚶 Walk-in</option>
                  <option value="WhatsApp">💬 WhatsApp</option>
                  <option value="Phone">📞 Phone Call</option>
                  <option value="Website">🌐 Website</option>
                </select>
              </div>
            </div>

            {/* Car of Interest */}
            <div className="space-y-3">
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                  Car of Interest
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <select
                    {...register('carOfInterest')}
                    className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                  >
                    <option value="">Not specific / General inquiry</option>
                    {availableCars.map((car) => (
                      <option key={car._id || car.id} value={car._id || car.id}>
                        {car.make} {car.model} ({car.year}) — ₹{car.price?.toLocaleString('en-IN')}
                      </option>
                    ))}
                    <option value="custom" className="font-bold text-primary">➕ Other / Custom Car...</option>
                  </select>
                </div>
              </div>

              {selectedCarOfInterest === 'custom' && (
                <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    {...register('customCarName', { required: 'Please enter the car details' })}
                    placeholder="Enter customized car name (e.g., Hyundai Creta 2022)"
                    className="w-full px-4 py-3 bg-primary/5 rounded-xl border border-primary/20 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    autoFocus
                  />
                  {errors.customCarName && <p className="text-red-500 text-xs font-body mt-1">{errors.customCarName.message}</p>}
                </div>
              )}
            </div>

            {/* Urgency */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Hot', label: 'Hot', icon: Flame, color: 'red' },
                  { value: 'Warm', label: 'Warm', icon: Thermometer, color: 'amber' },
                  { value: 'Cold', label: 'Cold', icon: Snowflake, color: 'blue' },
                ].map(({ value, label, icon: UIcon, color }) => {
                  const isActive = urgency === value;
                  const colorMap = {
                    red: isActive ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-text-muted',
                    amber: isActive ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-gray-200 text-text-muted',
                    blue: isActive ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]' : 'border-gray-200 text-text-muted',
                  };
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUrgency(value)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-body text-sm font-bold transition-all ${colorMap[color]}`}
                    >
                      <UIcon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Follow-up Date (Optional)
              </label>
              <div className="relative">
                <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="date"
                  {...register('followUpDate')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-5 sm:p-6">
            <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
              Notes / Remarks
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="e.g. Customer wants white SUV under ₹10 Lakh. Budget flexible. Test drive scheduled for tomorrow."
              className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 resize-none"
            />
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-heading font-bold text-base transition-all shadow-lg shadow-primary/15 disabled:opacity-50 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {isSubmitting ? 'Saving Lead...' : 'Save Lead'}
          </button>
        </form>
      </div>
    </div>
  );
}
