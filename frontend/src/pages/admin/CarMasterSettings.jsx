import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle2, Car, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

export default function CarMasterSettings() {
  const [carMasters, setCarMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaster, setCurrentMaster] = useState(null);
  
  const [brand, setBrand] = useState('');
  const [modelsInput, setModelsInput] = useState('');

  const fetchCarMasters = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/car-masters');
      if (res.data.success) {
        setCarMasters(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load car brands');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarMasters();
  }, []);

  const openModal = (master = null) => {
    setCurrentMaster(master);
    if (master) {
      setBrand(master.brand);
      setModelsInput(master.models.join(', '));
    } else {
      setBrand('');
      setModelsInput('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMaster(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const models = modelsInput.split(',').map(m => m.trim()).filter(m => m);
      const payload = { brand: brand.trim(), models };

      if (currentMaster) {
        await axiosInstance.put(`/car-masters/${currentMaster._id}`, payload);
        toast.success('Car brand updated successfully');
      } else {
        await axiosInstance.post('/car-masters', payload);
        toast.success('Car brand added successfully');
      }
      
      closeModal();
      fetchCarMasters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save car brand');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand and all its models?')) return;
    try {
      await axiosInstance.delete(`/car-masters/${id}`);
      toast.success('Car brand deleted successfully');
      fetchCarMasters();
    } catch (err) {
      toast.error('Failed to delete car brand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Car Brands & Models</h1>
          <p className="font-body text-sm text-text-muted mt-1">Manage the list of car brands and models for Leads.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider font-heading">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider font-heading">Models</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-surface">
                {carMasters.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-text-muted text-sm">
                      No car brands found. Click "Add Brand" to create one.
                    </td>
                  </tr>
                ) : (
                  carMasters.map((master) => (
                    <tr key={master._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Car className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-heading font-bold text-sm text-text">{master.brand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {master.models.length > 0 ? master.models.map((model, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-text-muted rounded-md text-xs font-semibold">
                              {model}
                            </span>
                          )) : <span className="text-xs text-text-muted italic">No models</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(master)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(master._id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-surface rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-text">
                  {currentMaster ? 'Edit Car Brand' : 'Add Car Brand'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Hyundai"
                  className="w-full px-4 py-2.5 bg-background border border-gray-200 focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Models (Comma-separated)</label>
                <textarea
                  rows="3"
                  value={modelsInput}
                  onChange={(e) => setModelsInput(e.target.value)}
                  placeholder="e.g. Creta, i20, Venue"
                  className="w-full px-4 py-2.5 bg-background border border-gray-200 focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2 bg-background font-body text-sm font-bold text-text-muted hover:text-text rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-white font-body text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                  <CheckCircle2 className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
