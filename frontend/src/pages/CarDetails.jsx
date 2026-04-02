import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Fuel, Settings2, User, Gauge, Calendar, MessageCircle, MapPin, Star, Tag, Check, ShieldCheck, Palette, FileText } from 'lucide-react';

export default function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`/api/cars/${id}`);
                const json = await res.json();
                if (json.success) {
                    setCar(json.data);
                } else {
                    setError(json.message || 'Car not found');
                }
            } catch (err) {
                setError('Failed to fetch car details.');
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
                        {car.year} {car.make} {car.model}
                    </h1>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Media & Specs) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Media Gallery */}
                        <div className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-xl overflow-hidden mb-4 group cursor-pointer">
                                {/* 360 Viewer Placeholder */}
                                <img src={mainImg} alt="Car Exterior" className="w-full h-full object-cover" />

                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-heading font-bold px-3 py-1.5 rounded flex items-center gap-1.5 uppercase tracking-wider z-10 shadow-sm">
                                    VEHICLE EXTERIOR
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {(car.images && car.images.length > 0) && (
                                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                                    {car.images.slice(0, 4).map((img, i) => (
                                        <div key={i} className="h-16 sm:h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/50">
                                            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i+1}`} />
                                        </div>
                                    ))}
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
                                    <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-body font-bold text-sm hover:bg-[#128C7E] transition-colors shadow-md">
                                        <MessageCircle className="w-4 h-4 fill-current" />
                                        INQUIRE ON WHATSAPP
                                    </button>
                                </div>
                            </div>

                            {/* Dealer Info Box */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-heading font-black text-xl text-primary shrink-0">
                                    S
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-bold text-text text-sm mb-1">Sadguru Car Melo</h4>
                                    <p className="font-body text-xs text-text-muted mb-2">Vesu Road, Near SD Jain School, Surat</p>
                                    <div className="flex items-center gap-1 mb-3">
                                        <span className="font-heading font-bold text-xs text-text">4.8</span>
                                        <div className="flex">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="font-body text-[10px] text-text-muted ml-1">(1.2k Reviews)</span>
                                    </div>
                                    <a href="#" className="font-body text-[11px] font-bold text-primary flex items-center gap-1 hover:underline tracking-wide uppercase">
                                        <MapPin className="w-3 h-3" /> Get Directions
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}