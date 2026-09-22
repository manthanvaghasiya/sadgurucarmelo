import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, X, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/promo-posters/all');
      if (res.data?.success) {
        setBanners(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      toast.error('Failed to load promo banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desktopImage || !mobileImage) {
      return toast.error('Both Desktop and Mobile images are required');
    }

    setSaving(true);
    try {
      const { default: imageCompression } = await import('browser-image-compression');
      const options = { maxSizeMB: 1.5, maxWidthOrHeight: 1920, useWebWorker: true };

      const compressedDesktop = await imageCompression(desktopImage, options);
      const compressedMobile = await imageCompression(mobileImage, options);

      const fd = new FormData();
      if (title.trim()) fd.append('title', title.trim());
      if (link.trim()) fd.append('link', link.trim());
      fd.append('desktopImage', compressedDesktop, desktopImage.name || 'desktop.jpg');
      fd.append('mobileImage', compressedMobile, mobileImage.name || 'mobile.jpg');

      await axiosInstance.post('/promo-posters/admin', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Promo Banner uploaded successfully!');
      setTitle('');
      setLink('');
      setDesktopImage(null);
      setMobileImage(null);
      setShowForm(false);
      fetchBanners();
    } catch (err) {
      console.error('Upload banner error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload banner');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axiosInstance.put(`/promo-posters/admin/${id}`, { isActive: newStatus });
      toast.success(newStatus ? 'Banner activated' : 'Banner deactivated');
      setBanners((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: newStatus } : b))
      );
    } catch (err) {
      console.error('Toggle active error:', err);
      toast.error('Failed to update banner status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await axiosInstance.delete(`/promo-posters/admin/${id}`);
      toast.success('Banner deleted');
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error('Delete banner error:', err);
      toast.error('Failed to delete banner');
    }
  };

  const ImagePreview = ({ file, label, onClear, onChange, aspectDesc }) => (
    <div className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group h-44">
      {file ? (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-500 transition-colors z-10"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <ImageIcon size={32} className="text-amber-500/70 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-700 dark:text-gray-200 font-bold">{label}</span>
          <span className="text-xs text-gray-400 mt-0.5">{aspectDesc}</span>
          <span className="text-xs text-amber-500 font-semibold mt-2">Click to select photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Promo Banners (પ્રમોશનલ બેનર્સ)
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage promotional offer banners displayed on the homepage slider.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : '+ Add Banner'}
        </button>
      </div>

      {/* Upload Form Modal / Drawer */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 p-6 md:p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>✨</span> Create New Promo Banner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Banner Title (વૈકલ્પિક શીર્ષક)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. દિવાળી ધમાકા ઓફર 2024 / Festival Deals"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Destination Link (ક્લિક લિંક)
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. /inventory or /sell-your-car"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                  💡 <strong>Tip:</strong> Upload high quality images. Desktop banner should be landscape (16:9 ratio, ~1920x800px). Mobile banner should be vertical or square (4:5 or 1:1, ~800x800px).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Desktop Image * (કમ્પ્યુટર વ્યુ)
                </label>
                <ImagePreview
                  file={desktopImage}
                  label="Desktop Banner"
                  aspectDesc="Landscape (16:9)"
                  onClear={() => setDesktopImage(null)}
                  onChange={setDesktopImage}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Mobile Image * (મોબાઇલ વ્યુ)
                </label>
                <ImagePreview
                  file={mobileImage}
                  label="Mobile Banner"
                  aspectDesc="Square / Vertical (4:5)"
                  onClear={() => setMobileImage(null)}
                  onChange={setMobileImage}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Compressing & Uploading...</span>
                </>
              ) : (
                <span>Upload Banner</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))
        ) : banners.length > 0 ? (
          banners.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all flex flex-col group"
            >
              {/* Image Previews: Desktop (2/3) + Mobile (1/3) split */}
              <div className="flex w-full h-44 bg-slate-950 relative border-b border-gray-100 dark:border-slate-800">
                <div className="w-2/3 h-full relative border-r border-white/10 overflow-hidden">
                  <img
                    src={b.desktopImageUrl}
                    alt={b.title || 'Desktop'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white tracking-wider">
                    Desktop
                  </div>
                </div>

                <div className="w-1/3 h-full relative overflow-hidden bg-slate-900">
                  <img
                    src={b.mobileImageUrl}
                    alt={b.title || 'Mobile'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white tracking-wider">
                    Mobile
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md ${
                      b.isActive
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base line-clamp-1">
                    {b.title || 'Untitled Banner'}
                  </h3>
                  {b.link ? (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs mt-1.5 font-medium truncate">
                      <LinkIcon size={12} className="shrink-0" />
                      <span className="truncate">{b.link}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">No destination link</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 gap-2">
                  <button
                    onClick={() => toggleActive(b._id, b.isActive)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
                      b.isActive
                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                    }`}
                  >
                    {b.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    title="Delete banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 p-8 text-center">
            <ImageIcon size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">No Banners Uploaded Yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Upload promotional banners to showcase festival offers and special discounts on your website homepage.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-amber-600 transition-colors"
            >
              + Create First Banner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
