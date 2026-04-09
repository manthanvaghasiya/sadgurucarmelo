import { useState, useMemo } from 'react';
import { useCars } from '../../context/CarContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Clock, Plus, Trash2, Edit3, Car, AlertTriangle } from 'lucide-react';

export default function Posters() {
  const { cars, deleteCar } = useCars();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter only 'Coming Soon' cars
  const comingSoonCars = useMemo(() => {
    return cars
      .filter((c) => c.status === 'Coming Soon')
      .map((c) => ({
        id: c._id || c.id,
        image: c.image || 'https://placehold.co/120x80/e2e8f0/64748b?text=Car',
        title: `${c.make} ${c.model} (${c.year})`,
        price: c.price >= 100000 ? `₹${(c.price / 100000).toFixed(2)} Lakhs` : `₹${(c.price || 0).toLocaleString('en-IN')}`,
        dateAdded: new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
      }));
  }, [cars]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ═══════════════════════════════════════════════
          Delete Confirmation Modal
         ═══════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5 animate-[fadeScale_200ms_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Delete Vehicle?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCar(deleteTarget);
                    toast.success('Coming soon vehicle deleted.');
                  } catch (error) {
                    toast.error('Failed to delete vehicle.');
                  }
                  setDeleteTarget(null);
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          Page Header
         ═══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-heading font-extrabold text-primary">
              Coming Soon Cars
            </h1>
          </div>
          <p className="font-body text-sm text-text-muted max-w-lg">
            Manage your highly anticipated vehicles. These cars are indicated as arriving shortly.
            To add a car here, create or edit a car and set its status to "Coming Soon".
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-car')}
          className="inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-lg shadow-accent/20 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Car
        </button>
      </div>

      {/* ═══════════════════════════════════════════════
          Content Grid
         ═══════════════════════════════════════════════ */}
      {comingSoonCars.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Car className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="font-heading font-bold text-xl text-text mb-2">No Coming Soon Cars</h3>
          <p className="font-body text-text-muted max-w-sm mb-6">
            You don't have any vehicles marked as "Coming Soon" right now. Add a new listing to build hype!
          </p>
          <button
            onClick={() => navigate('/admin/add-car')}
            className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-body text-sm font-bold transition-colors"
          >
            Add Vehicle Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonCars.map((car) => (
            <div
              key={car.id}
              className="group bg-surface rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300"
            >
              {/* Image Header */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase z-10 shadow-md flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Coming Soon
                </div>
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                    className="p-3 bg-white text-primary hover:bg-primary hover:text-white rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                    title="Edit Vehicle"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(car.id)}
                    className="p-3 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-text truncate mb-1" title={car.title}>
                  {car.title}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-heading font-bold text-accent text-xl">{car.price}</p>
                  <p className="font-body text-xs text-text-muted font-semibold bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                    Added: {car.dateAdded}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
