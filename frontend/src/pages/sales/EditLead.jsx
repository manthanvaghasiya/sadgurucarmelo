import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User, Phone, MessageCircle, Car, MapPin, Flame,
  Thermometer, Snowflake, ArrowLeft, CheckCircle2, Loader2,
  CalendarClock, UserCircle, X, Trash2, Plus
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function EditLead() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [carMasters, setCarMasters] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showCustomCar, setShowCustomCar] = useState(false);
  const [customCarName, setCustomCarName] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedCars, setSelectedCars] = useState([]);
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
    const fetchCarMasters = async () => {
      try {
        const res = await axiosInstance.get('/car-masters');
        if (res.data.success) {
          setCarMasters(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch car masters:', err);
      }
    };
    fetchCarMasters();
  }, []);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await axiosInstance.get(`/leads/${id}`);
        const lead = data.data;

        reset({
          customerName: lead.customerName,
          phone: lead.phone,
          email: lead.email || '',
          address: lead.address || lead.email || '',
          source: lead.source,
          followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '',
          notes: lead.notes || '',
        });
        setUrgency(lead.urgency || 'Warm');
        
        if (lead.interestedCarMasters && lead.interestedCarMasters.length > 0) {
           setSelectedCars(lead.interestedCarMasters.map(c => ({
             brand: c.brand || '',
             model: c.model || '',
             fuelType: c.fuelType || '',
             transmission: c.transmission || '',
             customName: !c.brand ? c.model : undefined
           })));
        } else {
           let legacyCars = [];
           const customCarMatch = lead.notes?.match(/Looking for:\s*(.*?)(?:\n|$)/);
           let customCarName = customCarMatch ? customCarMatch[1].trim() : '';

           if (lead.interestedBrand || customCarName) {
              legacyCars.push({
                 brand: lead.interestedBrand || '',
                 model: customCarName ? 'custom' : (lead.interestedModel || ''),
                 fuelType: lead.interestedFuelType || '',
                 transmission: lead.interestedTransmission || '',
                 customName: customCarName
              });
           } else if (lead.carsOfInterest && lead.carsOfInterest.length > 0) {
              lead.carsOfInterest.forEach(c => {
                 legacyCars.push({
                    brand: c.make || '',
                    model: c.model || '',
                    fuelType: '',
                    transmission: ''
                 });
              });
           } else if (lead.carOfInterest) {
              legacyCars.push({
                 brand: lead.carOfInterest.make || '',
                 model: lead.carOfInterest.model || '',
                 fuelType: '',
                 transmission: ''
              });
           }
           setSelectedCars(legacyCars);
        }
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
      let finalCars = [...selectedCars];
      if (selectedBrand || (showCustomCar && customCarName)) {
        finalCars.push({
          brand: selectedBrand,
          model: showCustomCar ? 'custom' : selectedModel,
          fuelType: selectedFuelType,
          transmission: selectedTransmission,
          customName: showCustomCar ? customCarName : undefined
        });
      }

      let customCarNotes = finalCars.filter(c => c.customName).map(c => c.customName).join(', ');
      let combinedNotes = data.notes || '';
      
      combinedNotes = combinedNotes.replace(/\[.*?\]\s*Looking for:.*?(?:\n\n|\n|$)/g, '').trim();
      combinedNotes = combinedNotes.replace(/Looking for:.*?(?:\n\n|\n|$)/g, '').trim();

      if (customCarNotes) {
        combinedNotes = 'Looking for: ' + customCarNotes + (combinedNotes ? '\n\n' + combinedNotes : '');
      }

      const payload = {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address || '',
        source: data.source,
        urgency,
        notes: combinedNotes ? `[${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}] ${combinedNotes}` : '',
        interestedBrand: finalCars.length > 0 ? (finalCars[0].brand || undefined) : undefined,
        interestedModel: finalCars.length > 0 ? (finalCars[0].model === 'custom' ? undefined : finalCars[0].model) : undefined,
        interestedFuelType: finalCars.length > 0 ? (finalCars[0].fuelType || undefined) : undefined,
        interestedTransmission: finalCars.length > 0 ? (finalCars[0].transmission || undefined) : undefined,
        interestedCarMasters: finalCars.length > 0 ? finalCars.map(c => ({
          brand: c.brand || undefined,
          model: c.model === 'custom' ? c.customName : c.model,
          fuelType: c.fuelType || undefined,
          transmission: c.transmission || undefined
        })) : undefined,
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
  const availableBrands = carMasters.map(c => c.brand).sort();
  const selectedCarMaster = carMasters.find(c => c.brand === selectedBrand);
  const availableModelsForBrand = selectedCarMaster ? [...selectedCarMaster.models].sort() : [];

  const handleModelSelect = (e) => {
    const val = e.target.value;
    setSelectedModel(val);
    if (val === 'custom') {
      setShowCustomCar(true);
    } else {
      setShowCustomCar(false);
    }
  };

  const handleBrandSelect = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('');
    setShowCustomCar(false);
  };

  const handleAddCar = () => {
    if (!selectedBrand && !showCustomCar) return;
    if (showCustomCar && !customCarName) {
      toast.error('Please enter the custom car name');
      return;
    }
    
    const newCar = {
      brand: selectedBrand,
      model: showCustomCar ? 'custom' : selectedModel,
      fuelType: selectedFuelType,
      transmission: selectedTransmission,
      customName: showCustomCar ? customCarName : undefined
    };
    
    setSelectedCars([...selectedCars, newCar]);
    
    setSelectedBrand('');
    setSelectedModel('');
    setShowCustomCar(false);
    setCustomCarName('');
    setSelectedFuelType('');
    setSelectedTransmission('');
  };

  const handleRemoveCar = (index) => {
    setSelectedCars(selectedCars.filter((_, i) => i !== index));
  };

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

            {/* Address */}
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Address (Optional)
              </label>
              <input
                type="text"
                {...register('address')}
                placeholder="e.g. 123 Main St, City"
                className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* ── Cars of Interest ── */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-heading font-bold text-sm text-text-muted uppercase tracking-widest mb-2">Cars of Interest</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Brand</label>
                <select 
                  value={selectedBrand} 
                  onChange={handleBrandSelect}
                  className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >
                  <option value="">Select Brand</option>
                  {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Model</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <select 
                     value={selectedModel}
                     onChange={handleModelSelect}
                     disabled={!selectedBrand && !showCustomCar}
                     className="w-full pl-11 pr-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled>Select Car Model</option>
                    {availableModelsForBrand.map(model => <option key={model} value={model}>{model}</option>)}
                    <option value="custom" className="font-bold text-primary">➕ Other / Custom Car...</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Fuel Type</label>
                <select 
                  value={selectedFuelType} 
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Transmission</label>
                <select 
                  value={selectedTransmission} 
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 font-body text-sm text-text outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            {showCustomCar && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300 mt-3">
                <input
                  value={customCarName}
                  onChange={(e) => setCustomCarName(e.target.value)}
                  placeholder="Enter customized car name (e.g., Hyundai Creta 2022)"
                  className="w-full px-4 py-3 bg-primary/5 rounded-xl border border-primary/20 font-body text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  autoFocus
                />
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleAddCar}
                className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Car
              </button>
            </div>

            {/* List of selected cars */}
            {selectedCars.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <h3 className="font-body text-xs font-semibold text-text-muted uppercase tracking-wide">Selected Cars</h3>
                {selectedCars.map((car, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">
                          {car.customName ? car.customName : `${car.brand} ${car.model}`}
                        </p>
                        <p className="text-xs text-text-muted">
                          {[car.fuelType, car.transmission].filter(Boolean).join(' • ') || 'Any Fuel/Transmission'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCar(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  <option value="Instagram">📸 Instagram</option>
                  <option value="Facebook">📘 Facebook</option>
                  <option value="Market Place">🏪 Market Place</option>
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
