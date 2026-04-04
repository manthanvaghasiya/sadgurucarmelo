import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Fuel, Settings2, User, Gauge, Calendar, MessageCircle, MapPin, Star, Tag, Check, ShieldCheck, Palette, FileText } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import CarCard from '../components/CarCard';

export default function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(null);
    const [relatedCars, setRelatedCars] = useState([]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axiosInstance.get(`/cars/${id}`);
                if (res.data.success) {
                    const fetchedCar = res.data.data;
                    setCar(fetchedCar);
                    setActiveImage(fetchedCar.image || (fetchedCar.images && fetchedCar.images[0]) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=No+Image');
                    
                    // Fetch "Similar Cars" based on Make
                    try {
                        const relatedRes = await axiosInstance.get(`/cars?make=${fetchedCar.make}&limit=5`);
                        if (relatedRes.data.success || relatedRes.data.data) {
                            const relatedArray = relatedRes.data.data || [];
                            // Ensure the current car isn't listed and keep maximum 3 cars
                            const filteredRelated = relatedArray
                                .filter(c => (c._id || c.id) !== id)
                                .slice(0, 3);
                            setRelatedCars(filteredRelated);
                        }
                    } catch (relatedErr) {
                        console.error('Failed to fetch related cars', relatedErr);
                    }
                } else {
                    setError(res.data.message || 'Car not found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch car details.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-text mb-2">Car Not Found</h2>
                <p className="font-body text-text-muted mb-6">{error || "The car you're looking for doesn't exist or was removed."}</p>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-body font-bold hover:bg-primary-hover transition-colors">
                    Browse All Cars
                </a>
            </div>
        );
    }

    const mainImg = car.image || (car.images && car.images[0]) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=No+Image';

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 font-body text-xs font-semibold text-text-muted">
                            <li><a href="/" className="hover:text-primary transition-colors">Used Cars</a></li>
                            <li><span className="text-gray-400">&gt;</span></li>
                            <li><span className="text-text">{car.make}</span></li>
                            <li><span className="text-gray-400">&gt;</span></li>
                            <li aria-current="page" className="text-text">{car.model}</li>
                        </ol>
                    </nav>
                    <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text leading-tight tracking-tight">
                        {car.make} {car.model} {car.year}
                    </h1>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Media & Specs) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Media Gallery */}
                        <div className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100">
                            {/* Main Viewer */}
                            <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-lg group">
                                <img src={activeImage} alt="Car View" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />

                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-heading font-extrabold px-3 py-1.5 rounded flex items-center gap-1.5 uppercase tracking-wider z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                                    VEHICLE VIEW
                                </div>
                            </div>

                            {/* Thumbnail Strip */}
                            {(car.images && car.images.length > 0) && (
                                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                    {car.images.map((img, i) => {
                                        const isActive = activeImage === img;
                                        return (
                                            <button 
                                                key={i} 
                                                onClick={() => setActiveImage(img)}
                                                className={`relative shrink-0 w-24 sm:w-32 aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none 
                                                    ${isActive ? 'ring-2 ring-red-600 ring-offset-2 opacity-100 z-10' : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-primary/30 hover:ring-offset-1'}`
                                                }
                                            >
                                                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i+1}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Detailed Specs */}
                        <div className="flex flex-col gap-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            {/* Specific Feature Grids */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Comfort Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Air Conditioner</span>
                                            <span className="font-semibold text-text">{car.airConditioner || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Power Windows</span>
                                            <span className="font-semibold text-text">{car.powerWindows || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Sunroof</span>
                                            <span className="font-semibold text-text">{car.sunroof || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Parking Sensors</span>
                                            <span className="font-semibold text-text">{car.parkingSensors || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Engine & Performance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Displacement</span>
                                            <span className="font-semibold text-text">{car.displacement || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Max Power</span>
                                            <span className="font-semibold text-text">{car.maxPower || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">Drive Type</span>
                                            <span className="font-semibold text-text">{car.driveType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                            <span className="text-text-muted">No. of Cylinders</span>
                                            <span className="font-semibold text-text">{car.cylinders || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {car.description && (
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-text mb-4 border-l-4 border-primary pl-3">Description</h3>
                                    <p className="font-body text-sm text-text whitespace-pre-line leading-relaxed">{car.description}</p>
                                </div>
                            )}

                            {car.features && car.features.length > 0 && (
                                <div className={car.description ? 'mt-2' : ''}>
                                    <h3 className="font-heading font-bold text-xl text-text mb-4 border-l-4 border-primary pl-3">Key Features</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {car.features.map((f, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-background border border-gray-200 rounded-full font-body text-xs font-semibold text-text flex items-center gap-1.5">
                                                <Check className="w-3 h-3 text-primary" /> {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {(!car.description && (!car.features || car.features.length === 0)) && (
                                <div className="py-6 text-center text-text-muted font-body text-sm">
                                    No description or features provided for this vehicle.
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column (Sticky Action Card) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 flex flex-col gap-6">

                            {/* Pricing Card */}
                            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-heading font-bold text-[11px] text-text-muted tracking-widest uppercase">{car.registration || 'UNREGISTERED'}</span>
                                    {car.badges && car.badges.map((b) => (
                                        <span key={b} className="bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded text-[10px] font-heading font-extrabold uppercase tracking-widest flex items-center gap-1">
                                            {typeof b === 'string' ? b.toUpperCase() : b}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="font-heading font-extrabold text-[36px] text-accent mb-1 leading-none">₹{car.price?.toLocaleString('en-IN')}</h2>
                                <p className="font-body text-xs text-text-muted mb-6">Last updated: {new Date(car.updatedAt || Date.now()).toLocaleDateString()}</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Fuel className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Fuel</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.fuelType}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Settings2 className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Transmission</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.transmission}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Owner</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.owner || '1st Owner'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Gauge className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Mileage</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.kms?.toLocaleString('en-IN')} KM</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Tag className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Body</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.bodyType || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Palette className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Color</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.color || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                            <div className="flex flex-col gap-3">
                                    <a
                                      href={`https://wa.me/919913634447?text=${encodeURIComponent(`Hi, I am interested in the ${car.year} ${car.make} ${car.model} listed at ₹${car.price?.toLocaleString('en-IN')}. Please share more details.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-body font-bold text-sm hover:bg-[#128C7E] transition-colors shadow-md"
                                    >
                                        <MessageCircle className="w-4 h-4 fill-current" />
                                        INQUIRE ON WHATSAPP
                                    </a>
                                </div>
                            </div>

                            {/* Dealer Info Box */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-heading font-black text-xl text-primary shrink-0">
                                    S
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-bold text-text text-sm mb-1">Sadguru Car Melo</h4>
                                    <p className="font-body text-xs text-text-muted mb-2">Trimruti Compound, Opp. Yoginagar BRTS, Varachha Road, Surat</p>
                                    <div className="flex items-center gap-1 mb-3">
                                        <span className="font-heading font-bold text-xs text-text">4.9</span>
                                        <div className="flex">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="font-body text-[10px] text-text-muted ml-1">Google Reviews</span>
                                    </div>
                                    <a href="https://www.google.com/maps/place/Sadguru+Car+Melo/" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] font-bold text-primary flex items-center gap-1 hover:underline tracking-wide uppercase">
                                        <MapPin className="w-3 h-3" /> Get Directions
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Similar Cars Section */}
                {relatedCars.length > 0 && (
                    <div className="mt-20 md:mt-28 pt-12 border-t border-gray-100 pb-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">Similar Cars You Might Like</h2>
                            <a href={`/inventory?make=${car.make}`} className="font-body text-sm font-bold text-primary hover:text-primary-hover transition-colors hidden sm:block">View all {car.make} models &rarr;</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedCars.map((relatedCar) => (
                                <CarCard
                                  key={relatedCar._id || relatedCar.id}
                                  id={relatedCar._id || relatedCar.id}
                                  image={relatedCar.image || (relatedCar.images && relatedCar.images[0])}
                                  title={`${relatedCar.make} ${relatedCar.model} ${relatedCar.year}`}
                                  price={`₹${relatedCar.price?.toLocaleString('en-IN')}`}
                                  fuel={relatedCar.fuelType}
                                  transmission={relatedCar.transmission}
                                  owner={relatedCar.owner}
                                  kms={`${relatedCar.kms?.toLocaleString('en-IN')} KM`}
                                  badges={relatedCar.badges || []}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}