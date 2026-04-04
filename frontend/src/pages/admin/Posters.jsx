import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

export default function Posters() {
  const [posters, setPosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [newDesktopFile, setNewDesktopFile] = useState(null);
  const [newMobileFile, setNewMobileFile] = useState(null);

  const fetchPosters = async () => {
    try {
      const res = await axiosInstance.get('/promo-posters');
      if (res.data.success) {
        setPosters(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load posters');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const handleUpload = async () => {
    if (!newDesktopFile || !newMobileFile) {
      return toast.error('Both desktop and mobile images are required.');
    }
    
    if (posters.length >= 10) {
      return toast.error('Maximum of 10 posters reached.');
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('desktopImage', newDesktopFile);
    formData.append('mobileImage', newMobileFile);

    try {
      const res = await axiosInstance.post('/promo-posters/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Poster pair uploaded successfully');
        setNewDesktopFile(null);
        setNewMobileFile(null);
        fetchPosters(); // refresh
      } else {
        toast.error(res.data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poster?')) return;

    try {
      const res = await axiosInstance.delete(`/promo-posters/admin/${id}`);
      if (res.data.success) {
        toast.success('Poster deleted');
        fetchPosters();
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-primary mb-2">Manage Promo Posters</h1>
        <p className="text-text-muted font-body">Upload up to 10 "Arriving Shortly" image pairs. One active pair will be shown randomly on the Homepage.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-heading font-bold text-text mb-4">Add New Poster Pair ({posters.length}/10)</h2>
        
        {posters.length >= 10 ? (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-semibold">
            Maximum limit of 10 reached. Please delete an existing poster to add a new one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
              <ImageIcon className="w-8 h-8 text-text-muted mb-3" />
              <p className="font-semibold text-text text-sm mb-1">Desktop Image (16:9)</p>
              <p className="text-xs text-text-muted mb-4">Recommended: 1920x1080</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setNewDesktopFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
              <ImageIcon className="w-8 h-8 text-text-muted mb-3" />
              <p className="font-semibold text-text text-sm mb-1">Mobile Image (9:16)</p>
              <p className="text-xs text-text-muted mb-4">Recommended: 1080x1920</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setNewMobileFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading || !newDesktopFile || !newMobileFile}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold transition-all ${
                  (isUploading || !newDesktopFile || !newMobileFile) 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary-hover shadow-lg'
                }`}
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {isUploading ? 'Uploading...' : 'Upload Pair'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of existing posters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-heading font-bold text-text mb-6">Active Posters</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posters.length === 0 ? (
          <div className="text-center py-10 text-text-muted font-body">
            No posters uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posters.map((poster, index) => (
              <div key={poster._id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col sm:flex-row shadow-sm">
                
                {/* Desktop View */}
                <div className="sm:w-1/2 h-40 sm:h-auto relative">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold uppercase z-10 backdrop-blur-md">
                    Desktop (16:9)
                  </div>
                  <img src={poster.desktopImageUrl} alt="Desktop Preview" className="w-full h-full object-cover" />
                </div>
                
                {/* Mobile View */}
                <div className="sm:w-1/4 h-40 sm:h-auto relative border-l border-t sm:border-t-0 border-white">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold uppercase z-10 backdrop-blur-md">
                    Mobile (9:16)
                  </div>
                  <img src={poster.mobileImageUrl} alt="Mobile Preview" className="w-full h-full object-cover" />
                </div>

                {/* Actions */}
                <div className="p-4 sm:w-1/4 flex flex-col items-center justify-center gap-2 border-l border-t sm:border-t-0 border-white bg-white">
                  <span className="text-sm font-bold text-gray-500 mb-2">Slot {index + 1}</span>
                  <button
                    onClick={() => handleDelete(poster._id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Poster"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
