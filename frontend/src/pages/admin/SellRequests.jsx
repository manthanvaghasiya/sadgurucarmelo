import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import {
  Car,
  Phone,
  Mail,
  Trash2,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  IndianRupee,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Eye,
  X
} from 'lucide-react';
import WhatsAppIcon from '../../components/WhatsAppIcon';

const STATUS_OPTIONS = ['Pending', 'Reviewed', 'Contacted', 'Closed'];

export default function SellRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.status = activeTab;
      if (search) params.search = search;

      const res = await axiosInstance.get('/sell-requests', { params });
      if (res.data.success) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sell requests:', err);
      toast.error('Failed to load sell requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/sell-requests/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this sell request and its photos?')) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/sell-requests/${id}`);
      if (res.data.success) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
        toast.success('Sell request deleted');
      }
    } catch (err) {
      console.error('Failed to delete sell request:', err);
      toast.error('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      req.ownerName?.toLowerCase().includes(q) ||
      req.phone?.includes(q) ||
      req.carBrand?.toLowerCase().includes(q) ||
      req.carModel?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Closed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-brand-orange" />
            Sell Car Requests
          </h1>
          <p className="font-body text-slate-500 text-sm mt-1">
            Manage customer car selling submissions, photos, and valuation leads.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, car..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {['All', ...STATUS_OPTIONS].map((tab) => {
          const count =
            tab === 'All'
              ? requests.length
              : requests.filter((r) => r.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-slate-800 mb-1">
            No sell requests found
          </h3>
          <p className="font-body text-slate-500 text-sm">
            {activeTab === 'All'
              ? 'Customer submissions will appear here once submitted from the website.'
              : `No requests with '${activeTab}' status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6 justify-between items-start"
            >
              {/* Left Column: Car & Customer details */}
              <div className="flex-1 space-y-4">
                {/* Header Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    {req.carBrand} {req.carModel} {req.year ? `(${req.year})` : ''}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Specs Chips */}
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                  {req.kmDriven && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      {Number(req.kmDriven).toLocaleString('en-IN')} KM
                    </span>
                  )}
                  {req.fuelType && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      {req.fuelType}
                    </span>
                  )}
                  {req.transmission && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                      {req.transmission}
                    </span>
                  )}
                  {req.expectedPrice && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1.5 rounded-lg border border-amber-100 font-bold">
                      <IndianRupee className="w-3.5 h-3.5" />
                      Expected: ₹{Number(req.expectedPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Notes */}
                {req.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-800">Owner Notes:</strong> {req.notes}
                  </p>
                )}

                {/* Photos Strip */}
                {req.photos && req.photos.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Car Photos ({req.photos.length})
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {req.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedPhoto(photo.url)}
                          className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group shrink-0"
                        >
                          <img
                            src={photo.url}
                            alt="Car"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Customer Info & Actions */}
              <div className="w-full lg:w-72 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Customer Info
                  </p>
                  <p className="font-bold text-slate-900 text-sm">{req.ownerName}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{req.phone}</p>
                  {req.email && <p className="text-xs text-slate-500 truncate">{req.email}</p>}
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${req.phone}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${req.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${req.ownerName}, regarding your sell request for ${req.carBrand} ${req.carModel} at Sadguru Car Melo:`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20bd5a] transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Update Status
                  </label>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(req._id)}
                  className="w-full text-xs font-semibold text-red-600 hover:text-red-700 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-size Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Full Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
