import { useState, useRef, useCallback, useEffect } from 'react';
import { useCars } from '../../context/CarContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';
import {
  Upload,
  X,
  Image as ImageIcon,
  View,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  GripVertical,
} from 'lucide-react';

// Reusable Select component
function FormSelect({ label, options, placeholder, register, error }) {
  return (
    <div className="space-y-2">
      <label className="font-body text-sm font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        <select
          {...register}
          className={`w-full px-4 py-3 bg-background border ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer pr-10`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      {error && <span className="text-red-500 text-xs font-body">{error.message}</span>}
    </div>
  );
}

// Reusable Text Input component
function FormInput({ label, type = 'text', placeholder, prefix, register, error }) {
  return (
    <div className="space-y-2">
      <label className="font-body text-sm font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm font-semibold text-text-muted">
            {prefix}
          </span>
        )}
        <input
          type={type}
          {...register}
          placeholder={placeholder}
          className={`w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-3 bg-background border ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10`}
        />
      </div>
      {error && <span className="text-red-500 text-xs font-body">{error.message}</span>}
    </div>
  );
}

// Reusable Textarea component
function FormTextarea({ label, placeholder, register, error, rows = 4 }) {
  return (
    <div className="space-y-2">
      <label className="font-body text-sm font-semibold text-text">
        {label}
      </label>
      <textarea
        {...register}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-background border ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10 resize-none`}
      />
      {error && <span className="text-red-500 text-xs font-body">{error.message}</span>}
    </div>
  );
}

// Toggle Switch component
function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-4 bg-background rounded-xl cursor-pointer group hover:bg-background/80 transition-colors">
      <div className="flex flex-col">
        <span className="font-body text-sm font-semibold text-text">{label}</span>
        {description && (
          <span className="font-body text-xs text-text-muted mt-0.5">{description}</span>
        )}
      </div>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent' : 'bg-gray-300'
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
}

export default function EditCar() {
  const { id } = useParams();
  const { updateCar } = useCars();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existingImage, setExistingImage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      make: '', model: '', year: '', price: '',
      kmDriven: '', fuelType: '', transmission: '', ownership: '',
      bodyType: '', color: '', registration: '', description: '', features: '',
      airConditioner: '', powerWindows: '', sunroof: '', parkingSensors: '',
      displacement: '', maxPower: '', driveType: '', cylinders: '',
      isCertified: false, isPetipack: false, validVimo: false
    }
  });

  // Fetch existing car data and populate form
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axiosInstance.get(`/cars/${id}`);
        const car = res.data.data || res.data;

        setExistingImage(car.image || '');

        const badges = car.badges || [];
        reset({
          make: car.make || '',
          model: car.model || '',
          year: car.year || '',
          price: car.price || '',
          kmDriven: car.kms || '',
          fuelType: car.fuelType || '',
          transmission: car.transmission || '',
          ownership: car.owner || '',
          bodyType: car.bodyType || '',
          color: car.color || '',
          registration: car.registration || '',
          description: car.description || '',
          features: (car.features || []).join(', '),
          airConditioner: car.airConditioner || '',
          powerWindows: car.powerWindows || '',
          sunroof: car.sunroof || '',
          parkingSensors: car.parkingSensors || '',
          displacement: car.displacement || '',
          maxPower: car.maxPower || '',
          driveType: car.driveType || '',
          cylinders: car.cylinders || '',
          isCertified: badges.includes('Certified'),
          isPetipack: badges.includes('Peti-pack'),
          validVimo: badges.includes('Valid Vimo'),
        });
      } catch (err) {
        toast.error('Failed to load car data.');
        navigate('/admin/inventory');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id, reset, navigate]);

  const isCertified = watch('isCertified');
  const isPetipack = watch('isPetipack');
  const validVimo = watch('validVimo');

  const onSubmit = async (data) => {
    try {
      const payload = {
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        kms: data.kmDriven,
        fuelType: data.fuelType,
        transmission: data.transmission,
        owner: data.ownership,
        bodyType: data.bodyType,
        color: data.color,
        registration: data.registration,
        description: data.description,
        airConditioner: data.airConditioner,
        powerWindows: data.powerWindows,
        sunroof: data.sunroof,
        parkingSensors: data.parkingSensors,
        displacement: data.displacement,
        maxPower: data.maxPower,
        driveType: data.driveType,
        cylinders: data.cylinders,
      };

      // Features as comma-separated string — backend parses it
      if (data.features) {
        payload.features = data.features;
      }

      // Badges
      const badges = [];
      if (data.isCertified) badges.push('Certified');
      if (data.isPetipack) badges.push('Peti-pack');
      if (data.validVimo) badges.push('Valid Vimo');
      payload.badges = badges;

      await toast.promise(updateCar(id, payload), {
        loading: 'Updating vehicle...',
        success: 'Vehicle updated successfully!',
        error: 'Failed to update vehicle.',
      });

      navigate('/admin/inventory');
    } catch (error) {
      console.error('Failed to update car:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-text">Edit Vehicle</h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Update the details for this vehicle listing.
        </p>
      </div>

      {/* Existing Image Preview */}
      {existingImage && (
        <div className="mb-6 bg-surface rounded-2xl border border-gray-100 p-4">
          <p className="font-body text-sm font-semibold text-text mb-3">Current Image</p>
          <div className="w-40 h-28 rounded-xl overflow-hidden bg-background ring-1 ring-gray-100">
            <img src={existingImage} alt="Current car" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* ── Section 1: Basic Details ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">1</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Basic Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormInput
              label="Make"
              register={register('make', { required: 'Make is required' })}
              error={errors.make}
              placeholder="e.g. Maruti Suzuki"
            />
            <FormInput
              label="Model"
              register={register('model', { required: 'Model is required' })}
              error={errors.model}
              placeholder="e.g. Swift VXI"
            />
            <FormInput
              label="Year"
              type="number"
              register={register('year', { required: 'Year is required', min: { value: 1990, message: 'Invalid year' } })}
              error={errors.year}
              placeholder="e.g. 2022"
            />
            <FormInput
              label="Price"
              type="number"
              register={register('price', { required: 'Price is required', min: { value: 1000, message: 'Invalid price' } })}
              error={errors.price}
              placeholder="e.g. 585000"
              prefix="₹"
            />
            <FormInput
              label="KMs Driven"
              type="number"
              register={register('kmDriven', { required: 'KMs Driven is required' })}
              error={errors.kmDriven}
              placeholder="e.g. 23000"
            />
            <FormSelect
              label="Fuel Type"
              register={register('fuelType', { required: 'Fuel Type is required' })}
              error={errors.fuelType}
              placeholder="Select fuel type"
              options={['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']}
            />
            <FormSelect
              label="Transmission"
              register={register('transmission', { required: 'Transmission is required' })}
              error={errors.transmission}
              placeholder="Select transmission"
              options={['Manual', 'Automatic']}
            />
            <FormSelect
              label="Ownership"
              register={register('ownership', { required: 'Ownership is required' })}
              error={errors.ownership}
              placeholder="Select ownership"
              options={['1st Owner', '2nd Owner', '3rd Owner', '4th Owner+', 'Unregistered']}
            />
            <FormSelect
              label="Body Type"
              register={register('bodyType')}
              error={errors.bodyType}
              placeholder="e.g. SUV"
              options={['SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'Convertible']}
            />
            <FormInput
              label="Color"
              register={register('color')}
              error={errors.color}
              placeholder="e.g. Polar White"
            />
            <FormInput
              label="Registration"
              register={register('registration')}
              error={errors.registration}
              placeholder="e.g. GJ-05"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-5 mt-5">
            <FormInput
              label="Features"
              register={register('features')}
              error={errors.features}
              placeholder="Enter features separated by commas (e.g., Sunroof, Bluetooth, Airbags)"
            />
            <FormTextarea
              label="Description"
              register={register('description')}
              error={errors.description}
              placeholder="Detailed description of the car..."
              rows={4}
            />
          </div>
        </section>

        {/* ── Section 2: Comfort Features ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">2</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Comfort Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormInput label="Air Conditioner" register={register('airConditioner')} placeholder="e.g. Automatic Climate Control" />
            <FormInput label="Power Windows" register={register('powerWindows')} placeholder="e.g. Front & Rear" />
            <FormInput label="Sunroof" register={register('sunroof')} placeholder="e.g. Panoramic" />
            <FormInput label="Parking Sensors" register={register('parkingSensors')} placeholder="e.g. Rear with Camera" />
          </div>
        </section>

        {/* ── Section 3: Engine & Performance ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">3</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Engine & Performance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormInput label="Displacement" register={register('displacement')} placeholder="e.g. 1493 cc" />
            <FormInput label="Max Power" register={register('maxPower')} placeholder="e.g. 113.42bhp@4000rpm" />
            <FormInput label="Drive Type" register={register('driveType')} placeholder="e.g. FWD" />
            <FormInput type="number" label="No. of Cylinders" register={register('cylinders')} placeholder="e.g. 4" />
          </div>
        </section>

        {/* ── Section 4: Condition & Badges ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">4</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Condition & Badges</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ToggleSwitch
              label="Is Certified?"
              description="Vehicle has passed our multi-point inspection"
              checked={isCertified}
              onChange={(val) => setValue('isCertified', val)}
            />
            <ToggleSwitch
              label="Is Peti-pack?"
              description="All body panels are original with no dent or paint"
              checked={isPetipack}
              onChange={(val) => setValue('isPetipack', val)}
            />
            <ToggleSwitch
              label="Valid Vimo?"
              description="Vehicle has valid insurance coverage"
              checked={validVimo}
              onChange={(val) => setValue('validVimo', val)}
            />
          </div>

          {/* Active Badges Preview */}
          {(isCertified || isPetipack || validVimo) && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
              <span className="font-body text-xs text-text-muted font-semibold mr-2 self-center">
                Active badges:
              </span>
              {isCertified && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-[#10b981]/10 text-[#059669] rounded-full font-body text-xs font-bold ring-1 ring-[#10b981]/20">
                  <CheckCircle2 className="w-3 h-3" /> Certified
                </span>
              )}
              {isPetipack && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-body text-xs font-bold ring-1 ring-primary/20">
                  <CheckCircle2 className="w-3 h-3" /> Peti-pack
                </span>
              )}
              {validVimo && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full font-body text-xs font-bold ring-1 ring-accent/20">
                  <CheckCircle2 className="w-3 h-3" /> Valid Vimo
                </span>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-gray-100 z-30">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 font-body text-sm text-text-muted">
            {Object.keys(errors).length > 0 ? (
              <span className="flex items-center gap-2 text-red-500 font-semibold">
                <AlertCircle className="w-4 h-4" />
                Missing required fields.
              </span>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Update the fields you need to change.</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className="px-6 py-3 bg-background border border-gray-200 rounded-xl font-body text-sm font-bold text-text-muted hover:text-text hover:border-primary/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-accent/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
