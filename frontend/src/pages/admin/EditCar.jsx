import { useState, useRef, useCallback, useEffect } from 'react';
import { useCars } from '../../context/CarContext';
import { useNavigate, useParams } from 'react-router-dom';
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
  RotateCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import VR360Uploader from '../../components/admin/VR360Uploader';

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

// Feature Manager Component for Key-Value pairs
function FeatureManager({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-body text-sm font-semibold text-text">
          Key Features (Specifications)
        </label>
        <button
          type="button"
          onClick={() => append({ key: '', value: '' })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg font-body text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div className="relative">
                <input
                  {...register(`features.${index}.key`)}
                  placeholder="Feature (e.g. Airbags)"
                  className="w-full px-4 py-2.5 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/40 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="relative">
                <input
                  {...register(`features.${index}.value`)}
                  placeholder="Value (e.g. 6) - Optional"
                  className="w-full px-4 py-2.5 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/40 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
              title="Remove Feature"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {fields.length === 0 && (
        <div 
          onClick={() => append({ key: '', value: '' })}
          className="py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-text-muted/50 hover:text-primary hover:border-primary/20 hover:bg-primary/[0.01] cursor-pointer transition-all"
        >
          <Plus className="w-6 h-6 mb-2" />
          <span className="font-body text-xs font-medium">Click to add your first feature</span>
        </div>
      )}
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

// DropZone component for new files
function DropZone({
  title,
  description,
  icon: Icon,
  files,
  onFilesAdded,
  onRemoveFile,
  accept,
  highlight = false,
  id,
  mainPhoto,
  onMakeMain
}) {
  const [isDragging, useStateDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e) => { e.preventDefault(); e.stopPropagation(); useStateDragging(true); }, []);
  const handleDragOut = useCallback((e) => { e.preventDefault(); e.stopPropagation(); useStateDragging(false); }, []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault(); e.stopPropagation(); useStateDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) onFilesAdded([...e.dataTransfer.files]);
    },
    [onFilesAdded]
  );
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) onFilesAdded([...e.target.files]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${highlight ? 'text-accent' : 'text-text-muted'}`} />
        <h3 className={`font-heading font-bold text-base ${highlight ? 'text-accent' : 'text-text'}`}>{title}</h3>
      </div>
      <div
        onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${highlight ? (isDragging ? 'border-accent bg-accent/10 scale-[1.01]' : 'border-accent/40 bg-accent/5 hover:border-accent hover:bg-accent/8') : (isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-200 bg-background hover:border-primary/30 hover:bg-primary/[0.02]')}`}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={!highlight} onChange={handleFileSelect} className="hidden" id={id} />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${highlight ? 'bg-accent/15' : 'bg-primary/5'}`}>
          <Upload className={`w-6 h-6 ${highlight ? 'text-accent' : 'text-primary'}`} />
        </div>
        <p className="font-body text-sm font-semibold text-text mb-1">{isDragging ? 'Release to upload' : 'Drag & drop files here'}</p>
        <p className="font-body text-xs text-text-muted">{description}</p>
        <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className={`mt-4 px-5 py-2 rounded-xl font-body text-sm font-bold transition-colors ${highlight ? 'bg-accent/15 text-accent hover:bg-accent/25' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}>Browse Files</button>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {files.map((file, index) => {
            const isMain = mainPhoto?.type === 'new' && mainPhoto?.index === index;
            return (
              <div key={index} className="relative group bg-background rounded-xl overflow-hidden border border-gray-100 aspect-[4/3]">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                {isMain && (
                   <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">MAIN</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {!isMain && onMakeMain && (
                     <button type="button" onClick={(e) => { e.stopPropagation(); onMakeMain(index); }} className="text-[10px] bg-white text-black px-3 py-1.5 rounded font-bold hover:bg-gray-200 shadow-sm uppercase tracking-wide">Make Main</button>
                  )}
                  <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }} className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded font-bold hover:bg-red-600 shadow-sm uppercase tracking-wide">Remove</button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="font-body text-[10px] text-white truncate text-center">{file.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EditCar() {
  const { id } = useParams();
  const { updateCar } = useCars();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [spinImages, setSpinImages] = useState([]);
  const [mainPhoto, setMainPhoto] = useState({ type: 'existing', index: 0 });

  const addPhotos = (newFiles) => {
    setPhotos((prev) => [...prev, ...newFiles]);
    // If there were no existing photos, and this is the first upload, set it as main
    if (existingImages.length === 0 && photos.length === 0 && mainPhoto.type === 'existing') {
        setMainPhoto({ type: 'new', index: 0 });
    }
  };
  
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (mainPhoto.type === 'new' && mainPhoto.index === index) {
      setMainPhoto({ type: 'existing', index: 0 }); // Fallback
    } else if (mainPhoto.type === 'new' && mainPhoto.index > index) {
      setMainPhoto({ type: 'new', index: mainPhoto.index - 1 });
    }
  };

  const removeExistingPhoto = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    if (mainPhoto.type === 'existing' && mainPhoto.index === index) {
      setMainPhoto({ type: 'existing', index: 0 }); // Fallback
    } else if (mainPhoto.type === 'existing' && mainPhoto.index > index) {
      setMainPhoto({ type: 'existing', index: mainPhoto.index - 1 });
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      status: 'Available',
      make: '', model: '', manufacturingYear: '', registerYear: '', price: '',
      kmDriven: '', fuelType: '', transmission: '', ownership: '',
      bodyType: '', variant: '', color: '', registration: '', description: '', 
      features: [{ key: '', value: '' }],
      airConditioner: '', powerWindows: '', sunroof: '', parkingSensors: '',
      displacement: '', maxPower: '', driveType: '', cylinders: '',
      isCertified: false, isPetipack: false, validVimo: false, loanAvailable: false, isKmGenuine: false,
      spinImages: []
    }
  });

  // Fetch existing car data and populate form
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axiosInstance.get(`/cars/${id}`);
        const car = res.data.data || res.data;

        setExistingImages(car.images?.length > 0 ? car.images : (car.image ? [car.image] : []));
        setSpinImages(car.spinImages || []);

        const badges = car.badges || [];
        reset({
          status: car.status || 'Available',
          make: car.make || '',
          model: car.model || '',
          manufacturingYear: car.manufacturingYear || car.year || '',
          registerYear: car.registerYear || '',
          price: car.price || '',
          kmDriven: car.kms || '',
          fuelType: car.fuelType || '',
          transmission: car.transmission || '',
          ownership: car.owner || '',
          bodyType: car.bodyType || '',
          variant: car.variant || car.variantTier || '',
          color: car.color || '',
          registration: car.registration || '',
          description: car.description || '',
          features: (car.features || []).map(f => {
            const parts = typeof f === 'string' && f.includes(':') ? f.split(':') : [f];
            return {
              key: parts[0].trim(),
              value: parts.length > 1 ? parts[1].trim() : ''
            };
          }),
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
          loanAvailable: Boolean(car.loanAvailable),
          isKmGenuine: Boolean(car.isKmGenuine),
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
  const loanAvailable = watch('loanAvailable');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('make', data.make);
      formData.append('model', data.model);
      if (data.manufacturingYear) {
        formData.append('manufacturingYear', data.manufacturingYear);
        formData.append('year', data.manufacturingYear); // Legacy fallback
      }
      if (data.registerYear) formData.append('registerYear', data.registerYear);
      if (data.price) formData.append('price', String(data.price).replace(/,/g, ''));
      if (data.kmDriven) formData.append('kms', String(data.kmDriven).replace(/,/g, ''));
      if (data.fuelType) formData.append('fuelType', data.fuelType);
      if (data.transmission) formData.append('transmission', data.transmission);
      if (data.ownership) formData.append('owner', data.ownership);
      formData.append('bodyType', data.bodyType);
      if (data.variant) formData.append('variant', data.variant);
      formData.append('color', data.color);
      formData.append('registration', data.registration);
      formData.append('description', data.description);
      formData.append('status', data.status);
      formData.append('airConditioner', data.airConditioner);
      formData.append('powerWindows', data.powerWindows);
      formData.append('sunroof', data.sunroof);
      formData.append('parkingSensors', data.parkingSensors);
      formData.append('displacement', data.displacement);
      formData.append('maxPower', data.maxPower);
      formData.append('driveType', data.driveType);
      formData.append('cylinders', data.cylinders);
      
      // Add spin images from state (array of URLs) - Loop through to avoid .join(',') as per critical backend requirement
      if (spinImages && spinImages.length > 0) {
        spinImages.forEach((url) => {
          if (url) formData.append('spinImages', url);
        });
      }
      
      // Transform features back to array of "Key: Value" or "Key" strings
      if (data.features && Array.isArray(data.features)) {
        data.features.forEach(f => {
          if (f.key && f.key.trim()) {
            const featureStr = f.value && f.value.trim() 
              ? `${f.key.trim()}: ${f.value.trim()}` 
              : f.key.trim();
            formData.append('features', featureStr);
          }
        });
      }

      if (data.isCertified) formData.append('badges', 'Certified');
      if (data.isPetipack) formData.append('badges', 'Peti-pack');
      if (data.validVimo) formData.append('badges', 'Valid Vimo');
      formData.append('loanAvailable', String(data.loanAvailable));
      formData.append('isKmGenuine', String(data.isKmGenuine));

      if (existingImages.length > 0) {
        existingImages.forEach(url => formData.append('keptImages', url));
      }

      // Add main photo config
      formData.append('mainPhotoType', mainPhoto.type);
      formData.append('mainPhotoIndex', mainPhoto.index);

      // Append any new images
      if (photos.length > 0) {
        photos.forEach(photo => formData.append('images', photo));
      }

      await toast.promise(updateCar(id, formData), {
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
      {existingImages.length > 0 && (
        <div className="mb-6 bg-surface rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <p className="font-heading text-lg font-bold text-text mb-1">Live Photos</p>
          <p className="font-body text-xs text-text-muted mb-4">You can remove old photos or set which one is the Main photo on the car card.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {existingImages.map((img, idx) => {
              const isMain = mainPhoto.type === 'existing' && mainPhoto.index === idx;
              return (
                <div key={idx} className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden bg-background ring-1 ring-gray-100">
                  <img src={img} alt={`Car ${idx + 1}`} className="w-full h-full object-cover" />
                  {isMain && (
                     <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">MAIN</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                     {!isMain && (
                       <button type="button" onClick={() => setMainPhoto({ type: 'existing', index: idx })} className="text-[10px] bg-white text-black px-3 py-1.5 rounded font-bold hover:bg-gray-200 shadow-sm uppercase tracking-wide">Make Main</button>
                     )}
                     <button type="button" onClick={() => removeExistingPhoto(idx)} className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded font-bold hover:bg-red-600 shadow-sm uppercase tracking-wide">Remove</button>
                  </div>
                </div>
              );
            })}
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
            <FormSelect
              label="Listing Status"
              register={register('status', { required: 'Status is required' })}
              error={errors.status}
              placeholder="Select listing status"
              options={['Available', 'Sold', 'Booked', 'Coming Soon']}
            />
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
              label="Mfg. Year"
              type="number"
              register={register('manufacturingYear', { min: { value: 1990, message: 'Invalid year' } })}
              error={errors.manufacturingYear}
              placeholder="e.g. 2022"
            />
            <FormInput
              label="Reg. Year"
              type="number"
              register={register('registerYear', { min: { value: 1990, message: 'Invalid year' } })}
              error={errors.registerYear}
              placeholder="e.g. 2023"
            />
            <FormInput
              label="Price"
              type="text"
              register={register('price', { validate: v => !v || !isNaN(Number(String(v).replace(/,/g, ''))) || 'Invalid price' })}
              error={errors.price}
              placeholder="e.g. 585000 or 5,85,000"
              prefix="₹"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-body text-sm font-semibold text-text">
                  KMs Driven
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${watch('isKmGenuine') ? 'bg-[#10b981] border-[#10b981]' : 'border-gray-300 bg-background group-hover:border-[#10b981]/50'}`}>
                    <CheckCircle2 className={`w-2.5 h-2.5 text-white ${watch('isKmGenuine') ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <input type="checkbox" {...register('isKmGenuine')} className="hidden" />
                  <span className="font-body text-[11px] font-bold text-text-muted group-hover:text-text transition-colors uppercase tracking-wider">Genuine?</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register('kmDriven', { validate: v => !v || !isNaN(Number(String(v).replace(/,/g, ''))) || 'Invalid KMs' })}
                  placeholder="e.g. 23000 or 23,000"
                  className={`w-full px-4 py-3 bg-background border ${errors.kmDriven ? 'border-red-500' : 'border-transparent'} focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10`}
                />
              </div>
              {watch('isKmGenuine') && (
                <p className="mt-1 font-body text-[11px] font-bold text-[#10b981] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Genuine
                </p>
              )}
              {errors.kmDriven && <span className="text-red-500 text-xs font-body">{errors.kmDriven.message}</span>}
            </div>
            <FormSelect
              label="Fuel Type"
              register={register('fuelType')}
              error={errors.fuelType}
              placeholder="Select fuel type"
              options={['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']}
            />
            <FormSelect
              label="Transmission"
              register={register('transmission')}
              error={errors.transmission}
              placeholder="Select transmission"
              options={['Manual', 'Automatic']}
            />
            <FormSelect
              label="Ownership"
              register={register('ownership')}
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
              label="Variant"
              register={register('variant')}
              error={errors.variant}
              placeholder="e.g. LXI, VXI, Top"
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
            <FeatureManager
              control={control}
              register={register}
              errors={errors}
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
            <ToggleSwitch
              label="Loan Available?"
              description="Car loan / EMI options can be arranged"
              checked={loanAvailable}
              onChange={(val) => setValue('loanAvailable', val)}
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

        {/* ── Section 5: Media Upload ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">5</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Replace Media (Upload New)</h2>
          </div>
          <div className="mb-4">
            <p className="text-sm font-body text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100 font-semibold">
              <ImageIcon className="w-4 h-4 inline mr-2 align-text-bottom" />
              Note: Upload new photos here. They will be added alongside your existing photos unless you remove the old ones above.
            </p>
          </div>
          <div className="space-y-8">
            <DropZone
              id="standard-photos"
              title="Add New Photos"
              description="Upload high-quality JPG or PNG images. Pick up to 10 photos."
              icon={ImageIcon}
              files={photos}
              onFilesAdded={addPhotos}
              onRemoveFile={removePhoto}
              mainPhoto={mainPhoto}
              onMakeMain={(idx) => setMainPhoto({ type: 'new', index: idx })}
            />
          </div>

          {/* 360° Exterior Spin - High Resolution */}
          <div className="relative mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#10b981]/20 via-[#10b981]/10 to-[#10b981]/20 rounded-3xl blur-sm" />
            <div className="relative bg-surface rounded-2xl border-2 border-[#10b981]/20 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <RotateCw className="w-4 h-4 text-[#10b981]" />
                <span className="font-body text-xs font-bold text-[#10b981] uppercase tracking-wider">
                  360° Exterior Spin — Direct-to-Cloud
                </span>
              </div>
              
              <VR360Uploader 
                onUploadComplete={(urls) => setSpinImages(urls)}
                initialImages={spinImages}
              />
              
              <div className="mt-4 p-4 bg-background/50 rounded-xl border border-[#10b981]/10">
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  <span className="font-bold text-[#10b981]">Note:</span> You can add more photos or remove current ones. The 360° spinner will automatically update on the buyer's side.
                </p>
              </div>
            </div>
          </div>
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
