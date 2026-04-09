import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditLead() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const { cars } = useCars();
  const [urgency, setUrgency] = useState('Warm');
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      source: 'Walk-in',
    },
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await axiosInstance.get(`/leads/${id}`);
        const lead = data.data;

        reset({
          customerName: lead.customerName,
          phone: lead.phone,
          email: lead.email || '',
          source: lead.source,
          carOfInterest: lead.carOfInterest?._id || lead.carOfInterest?.id || lead.carOfInterest || '',
          followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '',
          notes: lead.notes || '',
        });
        setUrgency(lead.urgency || 'Warm');
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch lead logic', err);
        toast.error('Failed to load lead details');
        navigate(-1);
      }
    };
    fetchLead();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || '',
        source: data.source,
        urgency,
        notes: data.notes || '',
        carOfInterest: data.carOfInterest || undefined,
        followUpDate: data.followUpDate || undefined,
      };

      await axiosInstance.put(`/leads/${id}`, payload);
      toast.success('Lead updated successfully!', {
        icon: '✅',
        style: { fontFamily: 'var(--font-body)' },
      });
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    }
  };

  // Available cars for dropdown
  const availableCars = cars.filter(c => c.status !== 'Sold');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="font-body text-sm text-text-muted">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-background hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text" />
          </button>
          <div className="flex-1">
            <p className="font-body text-xs text-text-muted uppercase tracking-wider">Edit Properties</p>
            <h1 className="font-heading font-bold text-lg text-text">Edit Lead</h1>
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
                </select>
              </div>
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
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-heading font-bold text-base transition-all shadow-lg shadow-primary/15 disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {isSubmitting ? 'Updating Lead...' : 'Update Lead'}
            </button>

            {!isSubmitting && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await axiosInstance.put(`/leads/${id}`, { status: 'Closed' });
                    toast.success('Deal marked as Complete! 🎉');
                    navigate('/sales');
                  } catch (err) {
                    toast.error('Failed to complete deal');
                  }
                }}
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-heading font-bold text-base transition-all shadow-lg shadow-green-500/20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                ✅ Complete Deal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
