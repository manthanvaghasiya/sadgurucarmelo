import { useState, useRef, useCallback } from 'react';
import { useCars } from '../../context/CarContext';
import { useNavigate } from 'react-router-dom';
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
function FormSelect({ label, options, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-2">
      <label className="font-body text-sm font-semibold text-text">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer pr-10"
          required={required}
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
    </div>
  );
}

// Reusable Text Input component
function FormInput({ label, type = 'text', value, onChange, placeholder, required, prefix }) {
  return (
    <div className="space-y-2">
      <label className="font-body text-sm font-semibold text-text">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm font-semibold text-text-muted">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10`}
          required={required}
        />
      </div>
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

// Drag & Drop Zone component
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
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesAdded([...e.dataTransfer.files]);
      }
    },
    [onFilesAdded]
  );

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded([...e.target.files]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${highlight ? 'text-accent' : 'text-text-muted'}`} />
        <h3 className={`font-heading font-bold text-base ${highlight ? 'text-accent' : 'text-text'}`}>
          {title}
        </h3>
      </div>

      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8
          flex flex-col items-center justify-center text-center
          transition-all duration-200
          ${highlight
            ? isDragging
              ? 'border-accent bg-accent/10 scale-[1.01]'
              : 'border-accent/40 bg-accent/5 hover:border-accent hover:bg-accent/8'
            : isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-gray-200 bg-background hover:border-primary/30 hover:bg-primary/[0.02]'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={!highlight}
          onChange={handleFileSelect}
          className="hidden"
          id={id}
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            highlight ? 'bg-accent/15' : 'bg-primary/5'
          }`}
        >
          <Upload className={`w-6 h-6 ${highlight ? 'text-accent' : 'text-primary'}`} />
        </div>

        <p className="font-body text-sm font-semibold text-text mb-1">
          {isDragging ? 'Release to upload' : 'Drag & drop files here'}
        </p>
        <p className="font-body text-xs text-text-muted">
          {description}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className={`mt-4 px-5 py-2 rounded-xl font-body text-sm font-bold transition-colors ${
            highlight
              ? 'bg-accent/15 text-accent hover:bg-accent/25'
              : 'bg-primary/5 text-primary hover:bg-primary/10'
          }`}
        >
          Browse Files
        </button>
      </div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-background rounded-xl overflow-hidden border border-gray-100 aspect-[4/3]"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="font-body text-[10px] text-white truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddCar() {
  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [ownership, setOwnership] = useState('');

  // Toggles
  const [isCertified, setIsCertified] = useState(false);
  const [isPetipack, setIsPetipack] = useState(false);
  const [validVimo, setValidVimo] = useState(false);

  // Files
  const [photos, setPhotos] = useState([]);
  const [vrImage, setVrImage] = useState([]);

  // Submission state
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const { addCar } = useCars();
  const navigate = useNavigate();

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append('make', make);
      formData.append('model', model);
      formData.append('year', year);
      formData.append('price', price);
      formData.append('kms', kmDriven);
      formData.append('fuelType', fuelType);
      formData.append('transmission', transmission);
      formData.append('owner', ownership);
      formData.append('status', 'Available');

      if (isCertified) formData.append('badges', 'Certified');
      if (isPetipack) formData.append('badges', 'Peti-pack');
      if (validVimo) formData.append('badges', 'Valid Vimo');

      // Inject the file if available
      if (photos.length > 0) {
        formData.append('image', photos[0]);
      }

      await addCar(formData);

      // Reset form
      setMake('');
      setModel('');
      setYear('');
      setPrice('');
      setKmDriven('');
      setFuelType('');
      setTransmission('');
      setOwnership('');
      setIsCertified(false);
      setIsPetipack(false);
      setValidVimo(false);
      setPhotos([]);
      setVrImage([]);

      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        navigate('/admin/inventory');
      }, 2000);
    } catch (error) {
      console.error('Failed to publish car:', error);
      alert('Failed to publish vehicle. Please verify the connection and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const addPhotos = (newFiles) => setPhotos((prev) => [...prev, ...newFiles]);
  const removePhoto = (index) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const addVrImage = (newFiles) => setVrImage(newFiles.slice(0, 1)); // Only 1 VR image
  const removeVrImage = () => setVrImage([]);

  return (
    <form onSubmit={handlePublish} className="pb-24">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-text">Add New Vehicle</h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Fill in the details below to list a new car in the inventory.
        </p>
      </div>

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
              value={make}
              onChange={setMake}
              placeholder="e.g. Maruti Suzuki"
              required
            />
            <FormInput
              label="Model"
              value={model}
              onChange={setModel}
              placeholder="e.g. Swift VXI"
              required
            />
            <FormInput
              label="Year"
              type="number"
              value={year}
              onChange={setYear}
              placeholder="e.g. 2022"
              required
            />
            <FormInput
              label="Price"
              type="number"
              value={price}
              onChange={setPrice}
              placeholder="e.g. 585000"
              prefix="₹"
              required
            />
            <FormInput
              label="KMs Driven"
              type="number"
              value={kmDriven}
              onChange={setKmDriven}
              placeholder="e.g. 23000"
              required
            />
            <FormSelect
              label="Fuel Type"
              value={fuelType}
              onChange={setFuelType}
              placeholder="Select fuel type"
              options={['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']}
              required
            />
            <FormSelect
              label="Transmission"
              value={transmission}
              onChange={setTransmission}
              placeholder="Select transmission"
              options={['Manual', 'Automatic', 'CVT', 'DCT', 'AMT', 'iMT']}
              required
            />
            <FormSelect
              label="Ownership"
              value={ownership}
              onChange={setOwnership}
              placeholder="Select ownership"
              options={['1st Owner', '2nd Owner', '3rd Owner', '4th Owner+', 'Unregistered']}
              required
            />
          </div>
        </section>

        {/* ── Section 2: Condition & Badges ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">2</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Condition & Badges</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ToggleSwitch
              label="Is Certified?"
              description="Vehicle has passed our multi-point inspection"
              checked={isCertified}
              onChange={setIsCertified}
            />
            <ToggleSwitch
              label="Is Peti-pack?"
              description="All body panels are original with no dent or paint"
              checked={isPetipack}
              onChange={setIsPetipack}
            />
            <ToggleSwitch
              label="Valid Vimo?"
              description="Vehicle has valid insurance coverage"
              checked={validVimo}
              onChange={setValidVimo}
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

        {/* ── Section 3: Media Upload ── */}
        <section className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-primary">3</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-text">Media Upload</h2>
          </div>

          <div className="space-y-8">
            {/* Standard Photos */}
            <DropZone
              id="standard-photos"
              title="Exterior & Interior Photos"
              description="Upload high-quality JPG or PNG images. Recommended: 1200×800px or higher."
              icon={ImageIcon}
              files={photos}
              onFilesAdded={addPhotos}
              onRemoveFile={removePhoto}
              accept="image/*"
            />

            {/* VR 360° Image - Highlighted */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-3xl blur-sm" />
              <div className="relative bg-surface rounded-2xl border-2 border-accent/20 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-accent" />
                  <span className="font-body text-xs font-bold text-accent uppercase tracking-wider">
                    Premium Feature — Heavy File Upload
                  </span>
                </div>
                <DropZone
                  id="vr-360-image"
                  title="Upload 360° Interior VR Image"
                  description="Upload a single high-res equirectangular panorama (JPG/PNG). File can be up to 50MB."
                  icon={View}
                  files={vrImage}
                  onFilesAdded={addVrImage}
                  onRemoveFile={removeVrImage}
                  accept="image/*"
                  highlight
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-gray-100 z-30">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 font-body text-sm text-text-muted">
            {published ? (
              <span className="flex items-center gap-2 text-accent font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Vehicle published to inventory!
              </span>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Fill all required fields before publishing.</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              className="px-6 py-3 bg-background border border-gray-200 rounded-xl font-body text-sm font-bold text-text-muted hover:text-text hover:border-primary/20 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-accent/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Publish Vehicle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
