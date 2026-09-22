import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import {
    Fuel, Settings2, User, Gauge, MessageCircle, MapPin, Star, Tag, Check,
    ShieldCheck, Palette, RotateCw, CheckCircle2, ChevronLeft, ChevronRight,
    ArrowLeftRight, Download, Maximize2, Share2, X, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosConfig';
import CarCard from '../components/CarCard';
import Car360Viewer from '../components/Car360Viewer';
import EmiCalculator from '../components/EmiCalculator';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCompare } from '../context/CompareContext';
import { generateCarDetailCard } from '../utils/carDetailCardGenerator';

export default function CarDetails() {
    const { id } = useParams();
    const { addToCompare, removeFromCompare, toggleCompare, isInCompare, compareCount } = useCompare();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(null);
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [detailCardUrl, setDetailCardUrl] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [relatedCars, setRelatedCars] = useState([]);
    const [viewMode, setViewMode] = useState('standard'); // 'standard' or '360'

    const whatsappUrl = car ? getCarWhatsAppLink(car) : '#';

    // Normalized list of gallery images (includes generated Car Details Summary Card)
    const rawImages = car?.images && car.images.length > 0 ? car.images : (car?.image ? [car.image] : []);
    const images = detailCardUrl ? [...rawImages, detailCardUrl] : rawImages;

    // Generate branded Car Details Card whenever car data loads
    useEffect(() => {
        if (car) {
            generateCarDetailCard(car).then((cardUrl) => {
                if (cardUrl) setDetailCardUrl(cardUrl);
            }).catch((err) => console.error('Failed to generate detail card:', err));
        }
    }, [car]);

    // Sync activeImage whenever activeImageIdx changes or car loads
    useEffect(() => {
        if (images.length > 0) {
            setActiveImage(images[activeImageIdx] || images[0]);
        }
    }, [activeImageIdx, images.length, car]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowLeft' && images.length > 1) {
                setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }
            if (e.key === 'ArrowRight' && images.length > 1) {
                setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }
        };
        if (isLightboxOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isLightboxOpen, images.length]);

    // Mobile touch swipe handlers
    const minSwipeDistance = 45;
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance && images.length > 1) {
            // Swiped left -> next
            setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        } else if (distance < -minSwipeDistance && images.length > 1) {
            // Swiped right -> prev
            setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareTitle = `${car?.make || 'Sadguru'} ${car?.model || 'Car'} (${car?.year || ''}) | Sadguru Car Melo`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: `Check out this ${car?.make} ${car?.model} at Sadguru Car Melo, Surat!`,
                    url: shareUrl,
                });
            } catch {
                // User dismissed share
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast.success('લિંક કોપી થઈ ગઈ છે · Link copied to clipboard!');
        }
    };

    const handleDownloadAllImages = async () => {
        const rawList = car?.images && car.images.length > 0 ? [...car.images] : [car?.image].filter(Boolean);
        if (!rawList || rawList.length === 0) {
            toast.error('No images available to download');
            return;
        }

        const totalCount = rawList.length + (detailCardUrl ? 1 : 0);
        toast.success(`${totalCount} ફાઈલો ડાઉનલોડ થઈ રહી છે (ફોટા + કાર ડિટેઇલ્સ કાર્ડ)... / Downloading ${totalCount} items (Photos + Details Card)...`, { duration: 5000 });

        // 1. Download all regular photos
        rawList.forEach((img, i) => {
            setTimeout(async () => {
                try {
                    const response = await fetch(getOptimizedUrl(img, 1200));
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${car.make || 'Sadguru'}-${car.model || 'Car'}-${i + 1}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                } catch {
                    const link = document.createElement('a');
                    link.href = getOptimizedUrl(img, 1200);
                    link.download = `${car.make || 'Sadguru'}-${car.model || 'Car'}-${i + 1}.jpg`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, i * 600);
        });

        // 2. Also download the branded Car Details Summary Card
        if (detailCardUrl) {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = detailCardUrl;
                link.download = `${car.make || 'Sadguru'}-${car.model || 'Car'}-Vehicle-Details.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, rawList.length * 600);
        }
    };

    const handleDownloadDetailCardOnly = () => {
        if (!detailCardUrl) {
            toast.error('Details Card is generating...');
            return;
        }
        const link = document.createElement('a');
        link.href = detailCardUrl;
        link.download = `${car.make || 'Sadguru'}-${car.model || 'Car'}-Vehicle-Details.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('ડિટેઇલ્સ કાર્ડ ડાઉનલોડ થઈ ગયું · Details Card downloaded!');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCar = async () => {
            setLoading(true);
            setError('');
            setCar(null);
            try {
                const res = await axiosInstance.get(`/cars/${id}`);
                if (res.data.success) {
                    const fetchedCar = res.data.data;
                    setCar(fetchedCar);
                    setActiveImage(fetchedCar.image || (fetchedCar.images && fetchedCar.images[0]) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=No+Image');

                    // NEW: Automatically set viewMode to '360' if the car has spin images
                    if ((fetchedCar.spinImages || []).length > 0) {
                        setViewMode('360');
                    }

                    // Fetch "Similar Cars"
                    try {
                        const relatedRes = await axiosInstance.get(`/cars?make=${fetchedCar.make}&limit=5&status=Available`);
                        if (relatedRes.data.success || relatedRes.data.data) {
                            const relatedArray = relatedRes.data.data || [];
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

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <SEO
                title={`Used ${car.make} ${car.model} ${car.year} for Sale in Surat | Sadguru Car Surat`}
                description={`Buy ${car.make} ${car.model} (${car.year}) at ₹${car.price?.toLocaleString('en-IN')}. ${car.fuelType || ''}, ${car.transmission || ''}, ${car.kms?.toLocaleString('en-IN') || ''} KM. Certified pre-owned at Sadguru Car Surat, Surat.`}
                image={car.image}
                url={`https://sadgurucarsurat.com/car/${car._id || car.id}`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Vehicle",
                    "name": `${car.make} ${car.model} ${car.year}`,
                    "image": car.image,
                    "description": car.description || `Certified pre-owned ${car.make} ${car.model} (${car.year}) available at Sadguru Car Surat.`,
                    "brand": {
                        "@type": "Brand",
                        "name": car.make
                    },
                    "model": car.model,
                    "vehicleModelDate": car.year,
                    "mileageFromOdometer": {
                        "@type": "QuantitativeValue",
                        "value": car.kms,
                        "unitCode": "KMT"
                    },
                    "fuelType": car.fuelType,
                    "vehicleTransmission": car.transmission,
                    "bodyType": car.bodyType || 'Car',
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "INR",
                        "price": car.price,
                        "availability": car.status === 'Available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "itemCondition": "https://schema.org/UsedCondition",
                        "seller": {
                            "@type": "AutoDealer",
                            "name": "Sadguru Car Surat",
                            "image": "https://sadgurucarsurat.com/og-image.jpg",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha",
                                "addressLocality": "Surat",
                                "postalCode": "395013",
                                "addressRegion": "GJ",
                                "addressCountry": "IN"
                            },
                            "telephone": "+919913634447"
                        }
                    }
                }}
            />
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 font-body text-xs font-semibold text-text-muted">
                            <li><a href="/" className="hover:text-primary transition-colors">Used Cars</a></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li><span className="text-text">{car.make}</span></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li aria-current="page" className="text-text">{car.model}</li>
                        </ol>
                    </nav>
                    <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text leading-tight tracking-tight flex flex-wrap items-center gap-3">
                        {car.make} {car.model} ({car.year})
                        {car.variantTier && (
                            <span className="text-lg sm:text-xl font-body font-bold text-text-muted bg-gray-100 px-3 py-1 rounded-lg">
                                {car.variantTier} Variant
                            </span>
                        )}
                    </h1>
                </div>

                {/* Main Layout — 3 direct children for mobile reordering */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Media Gallery — Always first */}
                    <div className="lg:col-span-2 order-1">
                        {/* Top Quick Actions Bar (Like Hari Ram: Back, Share, Save) */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <Link
                                to="/inventory"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:border-brand-orange text-xs font-bold transition-all shadow-xs"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>બધી કાર જુઓ · Back to Inventory</span>
                            </Link>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-brand-orange/5 text-xs font-bold transition-all shadow-xs active:scale-95"
                                    title="Share Car Details"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">શેર કરો · Share</span>
                                </button>

                                {detailCardUrl && (
                                    <button
                                        type="button"
                                        onClick={handleDownloadDetailCardOnly}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-brand-orange hover:bg-amber-500/20 text-xs font-bold transition-all shadow-xs active:scale-95"
                                        title="Download Vehicle Details Card"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span className="hidden md:inline">ડિટેઇલ્સ કાર્ડ · Details Card</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleDownloadAllImages}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-brand-orange/5 text-xs font-bold transition-all shadow-xs active:scale-95"
                                    title="Download All Photos & Details Card"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">સેવ કરો · Save All & Card</span>
                                    <span className="sm:hidden">સેવ કરો · Save</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">

                            {/* Main Big Screen Viewer */}
                            <div
                                className={`relative w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden mb-4 shadow-sm border border-slate-200/80 group flex items-center justify-center cursor-pointer select-none ${
                                    viewMode === '360' && (car.spinImages || []).length > 0
                                        ? 'aspect-[4/3] lg:aspect-video'
                                        : 'aspect-[4/3] sm:aspect-[16/10]'
                                }`}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                onClick={() => {
                                    if (viewMode === 'standard' && images.length > 0) {
                                        setIsLightboxOpen(true);
                                    }
                                }}
                            >
                                {viewMode === '360' && (car.spinImages || []).length > 0 ? (
                                    <Car360Viewer images={car.spinImages || []} title="360° EXTERIOR SPIN" />
                                ) : (
                                    <>
                                        <img
                                            src={getOptimizedUrl(images[activeImageIdx] || activeImage, 1200)}
                                            alt={`${car.make} ${car.model} Photo ${activeImageIdx + 1}`}
                                            loading="eager"
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                        />

                                        {/* Top Badges */}
                                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-20 pointer-events-none">
                                            {/* Image Counter Badge (like Hari Ram) */}
                                            {images.length > 1 && (
                                                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-heading font-bold text-xs border border-white/15 shadow-md">
                                                    {activeImageIdx + 1} / {images.length}
                                                </span>
                                            )}
                                            {car.status === 'Coming Soon' && (
                                                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow">
                                                    Coming Soon
                                                </span>
                                            )}
                                            {car.status === 'Sold' && (
                                                <span className="px-3 py-1 rounded-md bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                                                    SOLD OUT
                                                </span>
                                            )}
                                        </div>

                                        {/* Maximize / Fullscreen Button (Bottom-Right) */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsLightboxOpen(true);
                                            }}
                                            className="absolute bottom-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                                            title="મોટો ફોટો જુઓ · Open Fullscreen View"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>

                                        {/* Left / Right Chevron Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                                    }}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                                    title="Previous Image"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                                    title="Next Image"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Progressive Thumbnail Strip (Scrollable with Snap) */}
                            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                                {/* 1. The 360° Spin Thumbnail (Always First if it exists) */}
                                {(car.spinImages || []).length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('360')}
                                        className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-start border-2 ${
                                            viewMode === '360'
                                                ? 'border-brand-orange ring-2 ring-brand-orange/40 scale-[0.98] shadow-md'
                                                : 'border-transparent opacity-75 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={getOptimizedUrl((car.spinImages || [])[0], 240)}
                                            className="w-full h-full object-cover opacity-50 blur-[1px]"
                                            alt="360 Spin"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                            <RotateCw className="w-5 h-5 mb-1 text-brand-orange" />
                                            <span className="font-heading font-black text-[9px] tracking-wider uppercase text-amber-300">
                                                360° Spin
                                            </span>
                                        </div>
                                    </button>
                                )}

                                {/* 2. Standard Photo & Details Card Thumbnails */}
                                {images.map((img, i) => {
                                    const isActive = i === activeImageIdx && viewMode === 'standard';
                                    const isDetailCard = img === detailCardUrl;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setActiveImageIdx(i);
                                                setViewMode('standard');
                                            }}
                                            className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-start border-2 ${
                                                isActive
                                                    ? 'border-brand-orange ring-2 ring-brand-orange/40 scale-[0.98] shadow-md'
                                                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                                            }`}
                                            title={isDetailCard ? 'કાર ડિટેઇલ્સ કાર્ડ · Car Details Card' : `Photo ${i + 1}`}
                                        >
                                            <img
                                                src={getOptimizedUrl(img, 240)}
                                                className="w-full h-full object-cover"
                                                alt={isDetailCard ? 'Car Details Card' : `Thumbnail ${i + 1}`}
                                                loading="lazy"
                                            />
                                            {isDetailCard && (
                                                <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-xs py-0.5 px-1 text-center">
                                                    <span className="font-heading font-black text-[9px] text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                                                        📋 Details Card
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 2. Right Column (Pricing/Action Card) — Appears 2nd on mobile, right side on desktop */}
                    <div className="lg:col-span-1 lg:row-span-2 order-2">
                        <div className="sticky top-24 flex flex-col gap-6">

                            {/* Pricing Card */}
                            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-heading font-bold text-[11px] text-text-muted tracking-widest uppercase">{car.registration || 'UNREGISTERED'}</span>
                                    {(car.badges || []).map((b) => (
                                        <span key={b} className="bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded text-[10px] font-heading font-bold uppercase tracking-widest flex items-center gap-1">
                                            {typeof b === 'string' ? b.toUpperCase() : b}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="font-heading font-bold text-[36px] text-accent mb-1 leading-none">₹{car.price?.toLocaleString('en-IN')}</h2>
                                <p className="font-body text-xs text-text-muted mb-4">Last updated: {car.updatedAt && !isNaN(new Date(car.updatedAt).getTime()) ? new Date(car.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>

                                {car.loanAvailable && (
                                    <div className="flex items-center gap-2 mb-6 px-3 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700">
                                        <ShieldCheck className="w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-/70 mb-0.5">Financing Support</span>
                                            <span className="font-body text-sm font-bold leading-none">Car Loan / EMI Available</span>
                                        </div>
                                    </div>
                                )}

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
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-0.5">
                                                <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Mileage</span>
                                                {car.isKmGenuine && (
                                                    <span className="text-[#10b981] flex items-center bg-[#10b981]/10 px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-bold uppercase tracking-wider leading-none shrink-0 whitespace-nowrap">
                                                        <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" /> Genuine
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-body font-bold text-[12px] sm:text-[13px] text-text truncate">{car.kms?.toLocaleString('en-IN')} KM</span>
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
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#25D366] text-white font-body font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
                                    >
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                        INQUIRE ON WHATSAPP
                                    </a>

                                    <button
                                        type="button"
                                        id="btn-car-detail-compare"
                                        onClick={() => toggleCompare(car)}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-bold text-xs border transition-all active:scale-[0.98] ${
                                            isInCompare(car._id || car.id)
                                                ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 shadow-sm'
                                        }`}
                                    >
                                        <ArrowLeftRight className="w-4 h-4" />
                                        {isInCompare(car._id || car.id)
                                            ? `✓ સરખામણીમાં ઉમેરેલ છે · In Compare (Click to Remove)`
                                            : `બીજી કાર સાથે સરખાવો · Add to Compare (${compareCount}/3)`}
                                    </button>

                                    {isInCompare(car._id || car.id) && (
                                        <Link
                                            to="/compare"
                                            id="link-car-detail-view-compare"
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
                                        >
                                            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                                            <span>સરખામણી જુઓ · View Comparison ({compareCount} cars) →</span>
                                        </Link>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleDownloadAllImages}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-98 transition-all"
                                    >
                                        <Download className="w-4 h-4 text-amber-400" />
                                        <span>બધા ફોટા ડાઉનલોડ કરો · Download All Photos ({(car.images && car.images.length > 0) ? car.images.length : 1})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Dealer Info Box (Hidden on Mobile) */}
                            <div className="hidden lg:flex bg-gray-50 rounded-2xl p-6 border border-gray-100 items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-heading font-black text-xl text-primary shrink-0">
                                    S
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-bold text-text text-sm mb-1">Sadguru Car Surat</h4>
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

                    {/* 3. Detailed Specs — Appears 3rd on mobile (after pricing), stays below gallery on desktop */}
                    <div className="lg:col-span-2 order-3">
                        <div className="flex flex-col gap-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            {/* Specific Feature Grids */}
                            {(car.airConditioner || car.powerWindows || car.sunroof || car.parkingSensors || car.displacement || car.maxPower || car.driveType || car.cylinders) && (
                                <div className="flex flex-col gap-6">
                                    {(car.airConditioner || car.powerWindows || car.sunroof || car.parkingSensors) && (
                                        <div>
                                            <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Comfort Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                                {car.airConditioner && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Air Conditioner</span>
                                                        <span className="font-semibold text-text">{car.airConditioner}</span>
                                                    </div>
                                                )}
                                                {car.powerWindows && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Power Windows</span>
                                                        <span className="font-semibold text-text">{car.powerWindows}</span>
                                                    </div>
                                                )}
                                                {car.sunroof && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Sunroof</span>
                                                        <span className="font-semibold text-text">{car.sunroof}</span>
                                                    </div>
                                                )}
                                                {car.parkingSensors && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Parking Sensors</span>
                                                        <span className="font-semibold text-text">{car.parkingSensors}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(car.displacement || car.maxPower || car.driveType || car.cylinders) && (
                                        <div>
                                            <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Engine & Performance</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                                {car.displacement && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Displacement</span>
                                                        <span className="font-semibold text-text">{car.displacement}</span>
                                                    </div>
                                                )}
                                                {car.maxPower && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Max Power</span>
                                                        <span className="font-semibold text-text">{car.maxPower}</span>
                                                    </div>
                                                )}
                                                {car.driveType && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">Drive Type</span>
                                                        <span className="font-semibold text-text">{car.driveType}</span>
                                                    </div>
                                                )}
                                                {car.cylinders && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                        <span className="text-text-muted">No. of Cylinders</span>
                                                        <span className="font-semibold text-text">{car.cylinders}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {car.description && (
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-text mb-4 border-l-4 border-primary pl-3">Description</h3>
                                    <p className="font-body text-sm text-text whitespace-pre-line leading-relaxed">{car.description}</p>
                                </div>
                            )}

                            {(car.features || []).length > 0 && (
                                <div className={car.description ? 'mt-8' : ''}>
                                    <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                        {(car.features || []).map((f, i) => {
                                            const featureStr = String(f || '');
                                            const hasColon = featureStr.includes(':');

                                            // Split at the FIRST colon
                                            let key = featureStr.trim();
                                            let value = (
                                                <span className="inline-flex items-center gap-1 text-[#10b981]">
                                                    <Check className="w-4 h-4 stroke-[3]" /> Yes
                                                </span>
                                            );

                                            if (hasColon) {
                                                const colonIndex = featureStr.indexOf(':');
                                                key = featureStr.substring(0, colonIndex).trim();
                                                const valStr = featureStr.substring(colonIndex + 1).trim();
                                                
                                                if (valStr.toLowerCase() !== 'yes') {
                                                    value = valStr;
                                                }
                                            }

                                            return (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                                    <span className="text-text-muted capitalize">{key}</span>
                                                    <span className="font-semibold text-text text-right">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {(!car.description && (car.features || []).length === 0 && !car.airConditioner && !car.powerWindows && !car.sunroof && !car.parkingSensors && !car.displacement && !car.maxPower && !car.driveType && !car.cylinders) && (
                                <div className="py-6 text-center text-text-muted font-body text-sm">
                                    No description or features provided for this vehicle.
                                </div>
                            )}
                        </div>

                        {/* Interactive EMI Loan Calculator */}
                        <EmiCalculator carPrice={car.price} carTitle={`${car.make} ${car.model} (${car.year})`} />

                        {/* Dealer Info Box (Mobile Only) - Appears after specs */}
                        <div className="flex lg:hidden bg-gray-50 rounded-2xl p-6 border border-gray-100 items-start gap-4 mt-6">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-heading font-black text-xl text-primary shrink-0">
                                S
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-heading font-bold text-text text-sm mb-1">Sadguru Car Surat</h4>
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

                {/* Similar Cars Section */}
                {relatedCars.length > 0 && (
                    <div className="mt-20 md:mt-28 pt-12 border-t border-gray-100 pb-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">Similar Cars You Might Like</h2>
                            <a href={`/inventory?make=${car.make}`} className="font-body text-sm font-bold text-primary hover:text-primary-hover transition-colors hidden sm:block">View all {car.make} models →</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedCars.map((relatedCar) => (
                                <CarCard
                                    key={relatedCar._id || relatedCar.id}
                                    id={relatedCar._id || relatedCar.id}
                                    image={relatedCar.image || (relatedCar.images && relatedCar.images[0])}
                                    title={`${relatedCar.make} ${relatedCar.model} (${relatedCar.year})`}
                                    price={`₹${relatedCar.price?.toLocaleString('en-IN')}`}
                                    fuel={relatedCar.fuelType}
                                    transmission={relatedCar.transmission}
                                    owner={relatedCar.owner}
                                    kms={`${relatedCar.kms?.toLocaleString('en-IN')} KM`}
                                    isKmGenuine={relatedCar.isKmGenuine}
                                    badges={relatedCar.badges || []}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ════ Full-Screen High-Definition Lightbox Modal ════ */}
            {isLightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none animate-[fadeIn_200ms_ease-out]"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Top Navigation Bar */}
                    <div
                        className="flex items-center justify-between w-full max-w-7xl mx-auto z-30 pt-2 sm:pt-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(false)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs border border-white/15 backdrop-blur-md transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>પાછા જાઓ · Back</span>
                        </button>

                        <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white font-heading font-bold text-xs tracking-wider">
                            {activeImageIdx + 1} / {images.length}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 backdrop-blur-md transition-transform active:scale-95"
                                title="Share"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadAllImages}
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 backdrop-blur-md transition-transform active:scale-95"
                                title="Download All Photos"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center border border-red-400/40 backdrop-blur-md transition-transform active:scale-95 ml-1"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Main Center Image */}
                    <div
                        className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center my-3 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getOptimizedUrl(images[activeImageIdx], 1600)}
                            alt={`${car.make} ${car.model} Fullscreen ${activeImageIdx + 1}`}
                            className="max-h-[75vh] max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 bg-white"
                        />

                        {/* Lightbox Prev / Next Controls */}
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                    }}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-90"
                                    title="Previous"
                                >
                                    <ChevronLeft className="w-7 h-7" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-90"
                                    title="Next"
                                >
                                    <ChevronRight className="w-7 h-7" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Bottom Mini Thumbnails Strip */}
                    <div
                        className="w-full max-w-4xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none z-30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((img, idx) => {
                            const isDetailCard = img === detailCardUrl;
                            return (
                                <button
                                    key={`lb-thumb-${idx}`}
                                    type="button"
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`relative shrink-0 w-12 sm:w-16 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImageIdx === idx
                                            ? 'border-brand-orange scale-110 shadow-lg'
                                            : isDetailCard
                                                ? 'border-amber-400/60 opacity-80 hover:opacity-100'
                                                : 'border-white/20 opacity-50 hover:opacity-100'
                                    }`}
                                    title={isDetailCard ? 'Car Details Card' : `Photo ${idx + 1}`}
                                >
                                    <img
                                        src={getOptimizedUrl(img, 150)}
                                        alt={isDetailCard ? 'Details Card' : `Frame ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {isDetailCard && (
                                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-[8px] text-amber-300 font-bold text-center leading-tight">
                                            Card
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}