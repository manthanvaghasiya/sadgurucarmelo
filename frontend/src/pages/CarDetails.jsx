import { Fuel, Settings2, User, Gauge, Calendar, MessageCircle, MapPin, Star } from 'lucide-react';

export default function CarDetails() {
    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 font-body text-xs font-semibold text-text-muted">
                            <li><a href="/" className="hover:text-primary transition-colors">Used Cars in Surat</a></li>
                            <li><span className="text-gray-400">&gt;</span></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Hyundai</a></li>
                            <li><span className="text-gray-400">&gt;</span></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Creta</a></li>
                            <li><span className="text-gray-400">&gt;</span></li>
                            <li aria-current="page" className="text-text">2020 SX(O)</li>
                        </ol>
                    </nav>
                    <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text leading-tight tracking-tight">
                        2020 Hyundai Creta SX (O) 1.5 Diesel
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
                                <img src="https://placehold.co/1200x800/e2e8f0/64748b?text=Main+Car+Image" alt="Car Exterior" className="w-full h-full object-cover" />

                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-heading font-bold px-3 py-1.5 rounded flex items-center gap-1.5 uppercase tracking-wider z-10 shadow-sm">
                                    360° EXTERIOR
                                </div>

                                {/* 360 Spin Overlay */}
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 backdrop-blur text-primary px-6 py-3 rounded-lg font-heading font-bold text-sm shadow-lg flex flex-col items-center gap-2">
                                        <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        CLICK & DRAG TO SPIN 360°
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                                <div className="h-16 sm:h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-primary">
                                    <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Thumb+1" className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                                <div className="h-16 sm:h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/50">
                                    <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Thumb+2" className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                                <div className="h-16 sm:h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/50">
                                    <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Thumb+3" className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                                <div className="h-16 sm:h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/50">
                                    <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Thumb+4" className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Specs */}
                        <div className="flex flex-col gap-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            {/* Comfort Features */}
                            <div>
                                <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Comfort Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Air Conditioner</span>
                                        <span className="font-semibold text-text">Automatic Climate Control</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Power Windows</span>
                                        <span className="font-semibold text-text">Front & Rear</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Sunroof</span>
                                        <span className="font-semibold text-text">Panoramic</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Parking Sensors</span>
                                        <span className="font-semibold text-text">Rear with Camera</span>
                                    </div>
                                </div>
                            </div>

                            {/* Engine & Performance */}
                            <div className="mt-4">
                                <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Engine & Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Displacement</span>
                                        <span className="font-semibold text-text">1493 cc</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Max Power</span>
                                        <span className="font-semibold text-text">113.42bhp@4000rpm</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">No. of Cylinders</span>
                                        <span className="font-semibold text-text">4</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <span className="text-text-muted">Drive Type</span>
                                        <span className="font-semibold text-text">FWD</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sticky Action Card) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 flex flex-col gap-6">

                            {/* Pricing Card */}
                            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-heading font-bold text-[11px] text-text-muted tracking-widest uppercase">GJ-05 (SURAT RTO)</span>
                                    <span className="bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded text-[10px] font-heading font-extrabold uppercase tracking-widest flex items-center gap-1">
                                        CERTIFIED
                                    </span>
                                </div>

                                <h2 className="font-heading font-extrabold text-[36px] text-accent mb-1 leading-none">₹12.75 Lakhs</h2>
                                <p className="font-body text-xs text-text-muted mb-6">Last updated: Today</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Fuel className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Fuel</span>
                                            <span className="font-body font-bold text-[13px] text-text">CNG+Petrol</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Settings2 className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Transmission</span>
                                            <span className="font-body font-bold text-[13px] text-text">Manual</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Owner</span>
                                            <span className="font-body font-bold text-[13px] text-text">1st Owner</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Gauge className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Mileage</span>
                                            <span className="font-body font-bold text-[13px] text-text">45,000 KM</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-primary text-primary font-body font-bold text-sm hover:bg-primary/5 transition-colors">
                                        <Calendar className="w-4 h-4 stroke-[2]" />
                                        Schedule Test Drive
                                    </button>
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