import { useState, useEffect } from 'react';
import { Trash2, ImagePlus, Loader2, Sparkles, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

export default function HappyCustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setPreview(null);
    setCustomerName('');
    setReviewText('');
  };

  const handleEditClick = (customer) => {
    setEditingId(customer._id);
    setCustomerName(customer.customerName);
    setReviewText(customer.reviewText || '');
    setPreview(customer.photo); // The current URL from DB
    setFile(null); // No new file selected yet
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/happy-customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load Happy Customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !file) return toast.error('Please select a photo');
    if (!customerName.trim()) return toast.error('Customer name is required');

    setIsSubmitting(true);
    const formData = new FormData();
    if (file) formData.append('photo', file);
    formData.append('customerName', customerName);
    if (reviewText !== undefined) {
      formData.append('reviewText', reviewText);
    }

    try {
      let res;
      if (editingId) {
        res = await axiosInstance.put(`/happy-customers/admin/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axiosInstance.post('/happy-customers/admin', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        toast.success(editingId ? 'Customer updated!' : 'Happy Customer added!');
        resetForm();
        fetchCustomers();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Happy Customer record?')) return;
    try {
      const res = await axiosInstance.delete(`/happy-customers/admin/${id}`);
      if (res.data.success) {
        toast.success('Record deleted');
        setCustomers(customers.filter(c => c._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Happy Customers Gallery</h1>
          <p className="font-body text-text-muted mt-1">Showcase your successful deliveries on the home page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        
        {/* ADD NEW CUSTOMER FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              {editingId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors" title="Cancel Edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Photo Upload Area */}
              <div>
                <label className="block font-heading font-semibold text-sm text-text mb-2">Delivery Photo {!editingId && '*'}</label>
                <div className="relative group">
                  {preview ? (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/20">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      {/* Desktop: hover overlay */}
                      <div className="absolute inset-0 bg-black/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                        <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors">
                          Change Photo
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                      {/* Mobile: always-visible button at bottom */}
                      <label className="sm:hidden absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-center py-2.5 font-body text-xs font-bold cursor-pointer active:bg-black/80 transition-colors">
                        Tap to Change Photo
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 text-gray-400 mb-3 group-hover:text-primary transition-colors" />
                        <p className="mb-2 text-sm text-gray-500 font-body"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-400 font-body">PNG, JPG up to 5MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-heading font-semibold text-sm text-text mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-heading font-semibold text-sm text-text mb-2">Review / Testimonial (Optional)</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="e.g. Best car buying experience!"
                  rows="3"
                  className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-white font-body font-bold py-3.5 px-4 rounded-xl shadow-md disabled:opacity-70 flex justify-center items-center gap-2 transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'Save Changes' : 'Publish Customer Photo')}
              </button>
            </form>
          </div>
        </div>

        {/* GALLERY MANAGER */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-[300px] sm:min-h-[500px]">
             <h2 className="font-heading font-bold text-lg text-text mb-6">Gallery Overview</h2>
             
             {loading ? (
                <div className="flex justify-center items-center h-64">
                   <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
             ) : customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <Sparkles className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="font-heading font-semibold text-text text-lg">No customers uploaded yet</p>
                    <p className="font-body text-text-muted text-sm mt-1">Upload your first delivery photo to the left.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {customers.map((customer) => (
                    <div key={customer._id} className="group rounded-xl overflow-hidden border border-gray-200 bg-white">
                      {/* Image with overlay */}
                      <div className="relative aspect-[4/3]">
                        <img src={customer.photo} alt={customer.customerName} className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                          <h4 className="font-heading font-bold text-white text-sm truncate">{customer.customerName}</h4>
                          {customer.reviewText && (
                            <p className="font-body text-gray-300 text-xs mt-1 line-clamp-2">"{customer.reviewText}"</p>
                          )}
                        </div>

                        {/* Desktop: hover overlay buttons */}
                        <div className="absolute top-2 right-2 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                          <button
                            onClick={() => handleEditClick(customer)}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm active:scale-90 transition-all"
                            title="Edit record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm active:scale-90 transition-all"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile: always-visible action bar */}
                      <div className="sm:hidden flex items-center justify-between px-3 py-2.5 border-t border-gray-100">
                        <div className="min-w-0">
                          <p className="font-body text-xs font-semibold text-text truncate">{customer.customerName}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditClick(customer)}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors active:scale-90"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-90"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
