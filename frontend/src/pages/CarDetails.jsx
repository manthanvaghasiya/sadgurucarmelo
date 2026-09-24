import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import {
    Fuel, Settings2, User, Gauge, MapPin, Star, Tag, Check,
    ShieldCheck, Palette, RotateCw, CheckCircle2, ChevronLeft, ChevronRight,
    ArrowLeftRight, Download, Maximize2, Share2, X, ArrowLeft, Send, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosConfig';
import CarCard from '../components/CarCard';
import Car360Viewer from '../components/Car360Viewer';
import EmiCalculator from '../components/EmiCalculator';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCompare } from '../context/CompareContext';
import { generateCarDetailCard } from '../utils/carDetailCardGenerator';
import { FALLBACK_SHOWCASE } from '../data/showcaseData';

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
    const rawImages = car?.images && Array.isArray(car.images) && car.images.length > 0
        ? car.images
        : (car?.image ? [car.image] : []);
    const images = detailCardUrl ? [...rawImages, detailCardUrl] : rawImages;

    // Generate branded Car Details Card whenever car data loads
    useEffect(() => {
        let isMounted = true;
        if (car) {
            try {
                generateCarDetailCard(car).then((cardUrl) => {
                    if (isMounted && cardUrl) setDetailCardUrl(cardUrl);
                }).catch((err) => console.warn('Failed to generate detail card:', err));
            } catch (err) {
                console.warn('Sync error in generateCarDetailCard:', err);
            }
        }
        return () => { isMounted = false; };
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

    const [isSendingImages, setIsSendingImages] = useState(false);

    const handleDownloadAllImages = async () => {
        const rawList = car?.images && car.images.length > 0 ? [...car.images] : [car?.image].filter(Boolean);
        if (!rawList || rawList.length === 0) {
            toast.error('No images available to download');
            return;
        }

        // 1. Ensure Details Card is available
        let cardUrl = detailCardUrl;
        if (!cardUrl && car) {
            try {
                cardUrl = await generateCarDetailCard(car);
                if (cardUrl) setDetailCardUrl(cardUrl);
            } catch (err) {
                console.error('Failed to generate card for download:', err);
            }
        }

        const totalCount = rawList.length + (cardUrl ? 1 : 0);
        toast.success(`${totalCount} ફાઈલો ડાઉનલોડ થઈ રહી છે (ડિટેઇલ્સ કાર્ડ + ફોટા)... / Downloading ${totalCount} items (Details Card + Photos)...`, { duration: 5000 });

        // Download Details Card first
        if (cardUrl) {
            const link = document.createElement('a');
            link.href = cardUrl;
            link.download = `${car.make || 'Sadguru'}-${car.model || 'Car'}-0-Vehicle-Details.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Download all car photos with staggered interval
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
            }, (i + 1) * 500);
        });
    };

    const handleSendImages = async () => {
        if (!car) return;
        setIsSendingImages(true);
        toast.loading('ફોટા તૈયાર થઈ રહ્યા છે... / Preparing images to send...', { id: 'send-images' });

        try {
            // 1. Ensure Details Card is generated
            let cardUrl = detailCardUrl;
            if (!cardUrl) {
                try {
                    cardUrl = await generateCarDetailCard(car);
                    if (cardUrl) setDetailCardUrl(cardUrl);
                } catch (err) {
                    console.error('Failed to generate detail card:', err);
                }
            }

            const rawList = car?.images && car.images.length > 0 ? [...car.images] : [car?.image].filter(Boolean);
            const allImageSources = [];
            if (cardUrl) allImageSources.push({ url: cardUrl, name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-0-Vehicle-Details.jpg`, isCard: true });
            rawList.forEach((img, idx) => {
                allImageSources.push({ url: getOptimizedUrl(img, 1200), name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-${idx + 1}.jpg` });
            });

            const priceStr = typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price || 'કિંમત માટે સંપર્ક કરો');
            const kmsStr = typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} km` : (car.kms || car.kmDriven || 'N/A');
            const shareText = `🚗 *${car.make || ''} ${car.model || 'Car'} ${car.variant || ''} (${car.year || ''})*\n💰 કિંમત: ${priceStr}\n🛣️ કિ.મી.: ${kmsStr}\n⛽ ઇંધણ: ${car.fuelType || car.fuel || 'N/A'}\n📍 સદ્ગુરુ કાર મેળો, વરાછા, સુરત\n🔗 વધુ વિગતો: ${window.location.href}`;

            // Check if Web Share API with files is supported
            let canShareFiles = false;
            let filesToShare = [];

            if (navigator.canShare) {
                try {
                    for (const item of allImageSources.slice(0, 10)) {
                        const res = await fetch(item.url);
                        const blob = await res.blob();
                        const file = new File([blob], item.name, { type: 'image/jpeg' });
                        filesToShare.push(file);
                    }
                    if (filesToShare.length > 0 && navigator.canShare({ files: filesToShare })) {
                        canShareFiles = true;
                    }
                } catch (e) {
                    console.warn('File preparation for share failed, using fallback', e);
                    canShareFiles = false;
                }
            }

            if (canShareFiles && filesToShare.length > 0) {
                toast.dismiss('send-images');
                await navigator.share({
                    title: `${car.make || 'Sadguru'} ${car.model || 'Car'} (${car.year || ''})`,
                    text: shareText,
                    files: filesToShare,
                });
                toast.success('ફોટો સફળતાપૂર્વક મોકલ્યા! · Images sent successfully!');
            } else {
                // Fallback for desktop / unsupported devices:
                // 1. Trigger download of all images including the Details Card
                handleDownloadAllImages();
                // 2. Open WhatsApp with car details pre-filled
                toast.dismiss('send-images');
                toast.success('WhatsApp ખુલી રહ્યું છે અને ફોટા ડાઉનલોડ થઈ રહ્યા છે · Opening WhatsApp and downloading photos to send...', { duration: 5000 });
                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                window.open(waUrl, '_blank');
            }
        } catch (err) {
            console.error('Send images error:', err);
            toast.dismiss('send-images');
            if (err.name !== 'AbortError') {
                toast.error('Unable to send images directly. Downloading photos instead...');
                handleDownloadAllImages();
            }
        } finally {
            setIsSendingImages(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const fetchCar = async () => {
            setLoading(true);
            setError('');
            setCar(null);

            // 1. Instant check for showcase fallback vehicles (from HeroSection)
            if (id && String(id).startsWith('showcase-')) {
                const showcaseCar = FALLBACK_SHOWCASE.find((c) => c._id === id);
                if (showcaseCar && isMounted) {
                    setCar(showcaseCar);
                    setActiveImage(showcaseCar.image);
                    setLoading(false);
                    return;
                }
            }

            try {
                const res = await axiosInstance.get(`/cars/${id}`);
                if (!isMounted) return;

                if (res.data && res.data.success && res.data.data) {
                    const fetchedCar = res.data.data;
                    setCar(fetchedCar);
                    const defaultImg = fetchedCar.image || (Array.isArray(fetchedCar.images) && fetchedCar.images[0]) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat';
                    setActiveImage(defaultImg);

                    // NEW: Automatically set viewMode to '360' if the car has spin images
                    if ((fetchedCar.spinImages || []).length > 0) {
                        setViewMode('360');
                    }

                    // Fetch "Similar Cars"
                    try {
                        const makeQuery = encodeURIComponent(fetchedCar.make || '');
                        const relatedRes = await axiosInstance.get(`/cars?make=${makeQuery}&limit=5&status=Available`);
                        if (isMounted && (relatedRes.data?.success || relatedRes.data?.data)) {
                            const relatedArray = Array.isArray(relatedRes.data.data) ? relatedRes.data.data : [];
                            const filteredRelated = relatedArray
                                .filter(c => (c._id || c.id) !== id)
                                .slice(0, 3);
                            setRelatedCars(filteredRelated);
                        }
                    } catch (relatedErr) {
                        console.warn('Failed to fetch related cars', relatedErr);
                    }
                } else {
                    // Check fallback showcase before showing error
                    const showcaseMatch = FALLBACK_SHOWCASE.find((c) => c._id === id);
                    if (showcaseMatch) {
                        setCar(showcaseMatch);
                        setActiveImage(showcaseMatch.image);
                    } else {
                        setError(res.data?.message || 'વાહન ઉપલબ્ધ નથી · Vehicle not found');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    const showcaseMatch = FALLBACK_SHOWCASE.find((c) => c._id === id);
                    if (showcaseMatch) {
                        setCar(showcaseMatch);
                        setActiveImage(showcaseMatch.image);
                    } else {
                        setError(err.response?.data?.message || 'વાહન લોડ કરવામાં સમસ્યા આવી · Failed to fetch car details.');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        if (id) fetchCar();
        return () => { isMounted = false; };
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 py-16">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-text mb-2">વાહન ઉપલબ્ધ નથી · Vehicle Not Available</h2>
                <p className="font-body text-text-muted mb-6 max-w-md">{error || "The car you're looking for doesn't exist, is sold, or was removed."}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to="/" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-body font-bold hover:bg-slate-800 transition-colors">
                        🏠 હોમ પેજ · Home Page
                    </Link>
                    <Link to="/inventory" className="px-6 py-3 bg-primary text-white rounded-xl font-body font-bold hover:bg-primary-hover transition-colors">
                        🚗 બધી કાર જુઓ · Browse All Cars
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-3 sm:py-5 px-3 sm:px-4 pb-20 lg:pb-8">
            <SEO
                title={`Used ${car.make || 'Certified'} ${car.model || 'Car'} ${car.year ? car.year : ''} for Sale in Surat | Sadguru Car Surat`}
                description={`Buy ${car.make || ''} ${car.model || ''} ${car.year ? `(${car.year})` : ''} at ${typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price || 'Best Price')}. ${car.fuelType || ''}, ${car.transmission || ''}, ${typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms || '')}. Certified pre-owned at Sadguru Car Surat, Surat.`}
                image={car.image}
                url={`https://sadgurucarsurat.com/car/${car._id || car.id || ''}`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Vehicle",
                    "name": `${car.make || ''} ${car.model || ''} ${car.year || ''}`.trim(),
                    "image": car.image,
                    "description": car.description || `Certified pre-owned ${car.make || ''} ${car.model || ''} (${car.year || ''}) available at Sadguru Car Surat.`,
                    "brand": {
                        "@type": "Brand",
                        "name": car.make || 'Sadguru Car Surat'
                    },
                    "model": car.model || 'Car',
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

                {/* Page Header - Tighter, compact spacing */}
                <div className="mb-2.5 sm:mb-3.5">
                    <nav className="flex mb-1" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-1.5 font-body text-xs font-semibold text-text-muted">
                            <li><Link to="/" className="hover:text-primary transition-colors">Used Cars</Link></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li><span className="text-text">{car.make || 'Cars'}</span></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li aria-current="page" className="text-text">{car.model || 'Model'}</li>
                        </ol>
                    </nav>
                    <h1 className="font-heading font-bold text-lg sm:text-2xl text-text leading-tight tracking-tight flex flex-wrap items-center gap-2">
                        {car.make || ''} {car.model || 'Vehicle'} {car.year ? `(${car.year})` : ''}
                        {car.variantTier && (
                            <span className="text-xs sm:text-sm font-body font-bold text-text-muted bg-gray-100 px-2 py-0.5 rounded-md">
                                {car.variantTier} Variant
                            </span>
                        )}
                    </h1>
                </div>

                {/* Main Layout — Tighter gap between gallery and pricing card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">

                    {/* 1. Media Gallery — Always first */}
                    <div className="lg:col-span-2 order-1">
                        {/* Top Quick Actions Bar (Compact & Sleek) */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <Link
                                to="/inventory"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:border-brand-orange text-xs font-bold transition-all shadow-xs shrink-0"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span className="sm:hidden">Back</span>
                                <span className="hidden sm:inline">બધી કાર જુઓ · Back</span>
                            </Link>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="w-7 h-7 sm:w-auto sm:px-3 sm:py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-brand-orange/5 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                                    title="Share Car Details"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Share</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSendImages}
                                    disabled={isSendingImages}
                                    className="h-7 sm:h-auto px-2 sm:px-3 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
                                    title="Send Car Images & Details Card"
                                >
                                    {isSendingImages ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span className="hidden sm:inline">ફોટો મોકલો · </span>
                                    <span>Send</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDownloadAllImages}
                                    className="w-7 h-7 sm:w-auto sm:px-3 sm:py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-brand-orange/5 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                                    title="Download All Photos & Details Card"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Save All</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs border border-gray-100">

                            {/* Main Big Screen Viewer — Decreased height as requested */}
                            <div
                                className={`relative w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden mb-2 shadow-xs border border-slate-200/80 group flex items-center justify-center cursor-pointer select-none max-h-[300px] sm:max-h-[380px] lg:max-h-[400px] aspect-[16/9] ${viewMode === '360' && (car.spinImages || []).length > 0
                                        ? 'lg:aspect-video'
                                        : ''
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
                                            src={getOptimizedUrl(images[activeImageIdx] || activeImage || car.image, 1200) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat'}
                                            alt={`${car.make || ''} ${car.model || 'Car'} Photo ${activeImageIdx + 1}`}
                                            loading="eager"
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                        />

                                        {/* Top Badges */}
                                        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex items-center gap-1.5 sm:gap-2 z-20 pointer-events-none">
                                            {/* Image Counter Badge */}
                                            {images.length > 1 && (
                                                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-heading font-bold text-[11px] sm:text-xs border border-white/15 shadow-md">
                                                    {activeImageIdx + 1} / {images.length}
                                                </span>
                                            )}
                                            {car.status === 'Coming Soon' && (
                                                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow">
                                                    Coming Soon
                                                </span>
                                            )}
                                            {car.status === 'Sold' && (
                                                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-red-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-lg">
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
                                            className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                                            title="મોટો ફોટો જુઓ · Open Fullscreen View"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5" />
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
                                                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                                    title="Previous Image"
                                                >
                                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                                    }}
                                                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                                    title="Next Image"
                                                >
                                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Progressive Thumbnail Strip (Compact & Clean) */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
                                {/* 1. The 360° Spin Thumbnail (Always First if it exists) */}
                                {(car.spinImages || []).length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('360')}
                                        className={`relative shrink-0 w-14 sm:w-16 aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 snap-start border-2 ${viewMode === '360'
                                                ? 'border-brand-orange ring-2 ring-brand-orange/40 scale-[0.98] shadow-xs'
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
                                            <RotateCw className="w-3.5 h-3.5 mb-0.5 text-brand-orange" />
                                            <span className="font-heading font-black text-[7.5px] tracking-wider uppercase text-amber-300">
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
                                            className={`relative shrink-0 w-14 sm:w-16 aspect-[16/10] bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 snap-start border-2 ${isActive
                                                    ? 'border-brand-orange ring-2 ring-brand-orange/40 scale-[0.98] shadow-xs'
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
                                                <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-xs py-0.5 px-0.5 text-center">
                                                    <span className="font-heading font-black text-[7px] text-amber-300 uppercase tracking-wider">
                                                        Card
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 2. Right Column (Pricing/Action Card) — Compact Bento Layout */}
                    <div className="lg:col-span-1 lg:row-span-2 order-2">
                        <div className="sticky top-16 flex flex-col gap-2.5">

                            {/* Pricing Card */}
                            <div className="bg-surface rounded-xl sm:rounded-2xl shadow-xs border border-gray-100 p-3 sm:p-4">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="font-heading font-bold text-[9px] sm:text-[10px] text-text-muted tracking-widest uppercase">{car.registration || 'UNREGISTERED'}</span>
                                    <div className="flex items-center gap-1">
                                        {(car.badges || []).map((b) => (
                                            <span key={b} className="bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-heading font-bold uppercase tracking-widest flex items-center gap-1">
                                                {typeof b === 'string' ? b.toUpperCase() : b}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="font-heading font-black text-2xl sm:text-3xl text-accent mb-0.5 leading-none">
                                    {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : 'કિંમત માટે સંપર્ક કરો')}
                                </h2>
                                <p className="font-body text-[10px] text-text-muted mb-2">Last updated: {car.updatedAt && !isNaN(new Date(car.updatedAt).getTime()) ? new Date(car.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>

                                {car.loanAvailable && (
                                    <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-blue-50/60 border border-blue-100 rounded-md text-blue-700">
                                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                        <div className="flex items-center gap-1">
                                            <span className="font-heading text-[8px] font-bold uppercase tracking-wider text-blue-600/70">Financing:</span>
                                            <span className="font-body text-[11px] font-bold">Loan / EMI Available</span>
                                        </div>
                                    </div>
                                )}

                                {/* Specs Grid — Tight & Compact Bento */}
                                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <Fuel className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Fuel</span>
                                            <span className="font-body font-bold text-[11px] text-text truncate">{car.fuelType || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <Settings2 className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Transmission</span>
                                            <span className="font-body font-bold text-[11px] text-text truncate">{car.transmission || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <User className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Owner</span>
                                            <span className="font-body font-bold text-[11px] text-text truncate">{car.owner || '1st Owner'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <Gauge className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Mileage</span>
                                                {car.isKmGenuine && (
                                                    <span className="text-[#10b981] flex items-center text-[7px] font-bold uppercase leading-none">
                                                        <CheckCircle2 className="w-1.5 h-1.5 mr-0.5" /> Genuine
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-body font-bold text-[11px] text-text truncate">
                                                {typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms ? `${car.kms} KM` : 'N/A')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <Tag className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Body</span>
                                            <span className="font-body font-bold text-[11px] text-text truncate">{car.bodyType || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100/60">
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow-2xs">
                                            <Palette className="w-3 h-3 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-heading text-[7.5px] uppercase tracking-wider text-text-muted">Color</span>
                                            <span className="font-body font-bold text-[11px] text-text truncate">{car.color || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTAs — Tight & Responsive */}
                                <div className="flex flex-col gap-1.5">
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white font-body font-bold text-xs sm:text-sm hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/25 active:scale-[0.98]"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                                        <span>INQUIRE ON WHATSAPP</span>
                                    </a>

                                    <button
                                        type="button"
                                        id="btn-car-detail-compare"
                                        onClick={() => toggleCompare(car)}
                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-body font-bold text-xs border transition-all active:scale-[0.98] ${isInCompare(car._id || car.id)
                                                ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 shadow-2xs'
                                            }`}
                                    >
                                        <ArrowLeftRight className="w-3.5 h-3.5" />
                                        {isInCompare(car._id || car.id)
                                            ? `✓ સરખામણીમાં ઉમેરેલ છે · In Compare`
                                            : `બીજી કાર સાથે સરખાવો · Add to Compare (${compareCount}/3)`}
                                    </button>

                                    {isInCompare(car._id || car.id) && (
                                        <Link
                                            to="/compare"
                                            id="link-car-detail-view-compare"
                                            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl font-body font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xs"
                                        >
                                            <ArrowLeftRight className="w-3 h-3 text-amber-400" />
                                            <span>સરખામણી જુઓ · View Comparison ({compareCount}) →</span>
                                        </Link>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleDownloadAllImages}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-body font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-98 transition-all"
                                    >
                                        <Download className="w-3.5 h-3.5 text-amber-400" />
                                        <span>બધા ફોટા ડાઉનલોડ કરો · Download All Photos ({(car.images && car.images.length > 0) ? car.images.length : 1})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Dealer Info Box (Hidden on Mobile) */}
                            <div className="hidden lg:flex bg-gray-50 rounded-xl p-3.5 border border-gray-100 items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg shadow-2xs border border-gray-100 flex items-center justify-center font-heading font-black text-lg text-primary shrink-0">
                                    S
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-bold text-text text-xs mb-0.5">Sadguru Car Surat</h4>
                                    <p className="font-body text-[11px] text-text-muted mb-1.5">Trimruti Compound, Opp. Yoginagar BRTS, Varachha Road, Surat</p>
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="font-heading font-bold text-xs text-text">4.9</span>
                                        <div className="flex">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="font-body text-[9px] text-text-muted ml-1">Google Reviews</span>
                                    </div>
                                    <a href="https://www.google.com/maps/place/Sadguru+Car+Melo/" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] font-bold text-primary flex items-center gap-1 hover:underline tracking-wide uppercase">
                                        <MapPin className="w-3 h-3" /> Get Directions
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 3. Detailed Specs — Compact & Space-Efficient */}
                    <div className="lg:col-span-2 order-3">
                        <div className="flex flex-col gap-3.5 bg-surface p-3 sm:p-4 rounded-xl shadow-xs border border-gray-100">
                            {/* Specific Feature Grids */}
                            {(car.airConditioner || car.powerWindows || car.sunroof || car.parkingSensors || car.displacement || car.maxPower || car.driveType || car.cylinders) && (
                                <div className="flex flex-col gap-3">
                                    {(car.airConditioner || car.powerWindows || car.sunroof || car.parkingSensors) && (
                                        <div>
                                            <h3 className="font-heading font-bold text-sm sm:text-base text-text mb-1.5 border-l-3 border-primary pl-2">Comfort Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-body text-xs sm:text-sm">
                                                {car.airConditioner && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Air Conditioner</span>
                                                        <span className="font-semibold text-text">{car.airConditioner}</span>
                                                    </div>
                                                )}
                                                {car.powerWindows && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Power Windows</span>
                                                        <span className="font-semibold text-text">{car.powerWindows}</span>
                                                    </div>
                                                )}
                                                {car.sunroof && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Sunroof</span>
                                                        <span className="font-semibold text-text">{car.sunroof}</span>
                                                    </div>
                                                )}
                                                {car.parkingSensors && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Parking Sensors</span>
                                                        <span className="font-semibold text-text">{car.parkingSensors}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(car.displacement || car.maxPower || car.driveType || car.cylinders) && (
                                        <div>
                                            <h3 className="font-heading font-bold text-sm sm:text-base text-text mb-1.5 border-l-3 border-primary pl-2">Engine & Performance</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-body text-xs sm:text-sm">
                                                {car.displacement && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Displacement</span>
                                                        <span className="font-semibold text-text">{car.displacement}</span>
                                                    </div>
                                                )}
                                                {car.maxPower && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Max Power</span>
                                                        <span className="font-semibold text-text">{car.maxPower}</span>
                                                    </div>
                                                )}
                                                {car.driveType && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                        <span className="text-text-muted">Drive Type</span>
                                                        <span className="font-semibold text-text">{car.driveType}</span>
                                                    </div>
                                                )}
                                                {car.cylinders && (
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
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
                                    <h3 className="font-heading font-bold text-sm sm:text-base text-text mb-1.5 border-l-3 border-primary pl-2">Description</h3>
                                    <p className="font-body text-xs sm:text-sm text-text whitespace-pre-line leading-relaxed">{car.description}</p>
                                </div>
                            )}

                            {(car.features || []).length > 0 && (
                                <div className={car.description ? 'mt-3' : ''}>
                                    <h3 className="font-heading font-bold text-sm sm:text-base text-text mb-1.5 border-l-3 border-primary pl-2">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-body text-xs sm:text-sm">
                                        {(car.features || []).map((f, i) => {
                                            const featureStr = String(f || '');
                                            const hasColon = featureStr.includes(':');

                                            // Split at the FIRST colon
                                            let key = featureStr.trim();
                                            let value = (
                                                <span className="inline-flex items-center gap-1 text-[#10b981]">
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Yes
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
                                                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-1 pt-0.5">
                                                    <span className="text-text-muted capitalize">{key}</span>
                                                    <span className="font-semibold text-text text-right">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {(!car.description && (car.features || []).length === 0 && !car.airConditioner && !car.powerWindows && !car.sunroof && !car.parkingSensors && !car.displacement && !car.maxPower && !car.driveType && !car.cylinders) && (
                                <div className="py-3 text-center text-text-muted font-body text-xs sm:text-sm">
                                    No description or features provided for this vehicle.
                                </div>
                            )}
                        </div>

                        {/* Interactive EMI Loan Calculator */}
                        <div className="mt-3">
                            <EmiCalculator carPrice={typeof car.price === 'number' ? car.price : (Number(car.price) || 500000)} carTitle={`${car.make || ''} ${car.model || 'Car'} (${car.year || ''})`} />
                        </div>

                        {/* Dealer Info Box (Mobile Only) - Compact */}
                        <div className="flex lg:hidden bg-gray-50 rounded-xl p-3 border border-gray-100 items-start gap-2.5 mt-3">
                            <div className="w-9 h-9 bg-white rounded-lg shadow-2xs border border-gray-100 flex items-center justify-center font-heading font-black text-base text-primary shrink-0">
                                S
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h4 className="font-heading font-bold text-text text-xs mb-0.5">Sadguru Car Surat</h4>
                                <p className="font-body text-[10px] text-text-muted mb-1 leading-snug">Trimruti Compound, Opp. Yoginagar BRTS, Varachha Road, Surat</p>
                                <div className="flex items-center gap-1 mb-1.5">
                                    <span className="font-heading font-bold text-[11px] text-text">4.9</span>
                                    <div className="flex">
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <span className="font-body text-[9px] text-text-muted ml-1">Google Reviews</span>
                                </div>
                                <a href="https://www.google.com/maps/place/Sadguru+Car+Melo/" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] font-bold text-primary flex items-center gap-1 hover:underline tracking-wide uppercase">
                                    <MapPin className="w-2.5 h-2.5" /> Get Directions
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Similar Cars Section */}
                {relatedCars.length > 0 && (
                    <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 pb-4">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Similar Cars You Might Like</h2>
                            <Link to={`/inventory?make=${encodeURIComponent(car.make || '')}`} className="font-body text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors hidden sm:block">View all {car.make} models →</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {relatedCars.map((relatedCar) => (
                                <CarCard
                                    key={relatedCar._id || relatedCar.id}
                                    id={relatedCar._id || relatedCar.id}
                                    image={relatedCar.image || (Array.isArray(relatedCar.images) && relatedCar.images[0])}
                                    title={`${relatedCar.make || ''} ${relatedCar.model || 'Car'} ${relatedCar.year ? `(${relatedCar.year})` : ''}`}
                                    price={typeof relatedCar.price === 'number' ? `₹${relatedCar.price.toLocaleString('en-IN')}` : (relatedCar.price ? `₹${relatedCar.price}` : 'Call for Price')}
                                    fuel={relatedCar.fuelType || relatedCar.fuel || 'N/A'}
                                    transmission={relatedCar.transmission || 'N/A'}
                                    owner={relatedCar.owner || '1st Owner'}
                                    kms={typeof relatedCar.kms === 'number' ? `${relatedCar.kms.toLocaleString('en-IN')} KM` : (relatedCar.kms ? `${relatedCar.kms} KM` : 'N/A')}
                                    isKmGenuine={relatedCar.isKmGenuine}
                                    badges={relatedCar.badges || []}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ════ Mobile Sticky Bottom Action Bar ════ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5 truncate">
                        {car.make} {car.model}
                    </span>
                    <span className="font-heading font-black text-base text-accent leading-none truncate">
                        {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : 'કિંમત માટે સંપર્ક')}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => toggleCompare(car)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-2xs ${
                            isInCompare(car._id || car.id)
                                ? 'bg-brand-orange text-white border-brand-orange'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                        title={isInCompare(car._id || car.id) ? 'સરખામણીમાંથી દૂર કરો' : 'સરખામણીમાં ઉમેરો'}
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-body font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-green-500/25 active:scale-95 transition-all"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </a>
                </div>
            </div>

            {/* ════ Full-Screen High-Definition Lightbox Modal (White Theme) ════ */}
            {isLightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none animate-[fadeIn_200ms_ease-out]"
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs border border-slate-200 shadow-xs transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-700" />
                            <span>પાછા જાઓ · Back</span>
                        </button>

                        <div className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-heading font-bold text-xs tracking-wider shadow-xs">
                            {activeImageIdx + 1} / {images.length}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-brand-orange flex items-center justify-center border border-slate-200 shadow-xs transition-all active:scale-95"
                                title="Share"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadAllImages}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-brand-orange flex items-center justify-center border border-slate-200 shadow-xs transition-all active:scale-95"
                                title="Download All Photos"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95 ml-1"
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
                            className="max-h-[75vh] max-w-full object-contain rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 bg-white border border-slate-200/80"
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
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                                    title="Previous"
                                >
                                    <ChevronLeft className="w-7 h-7 text-slate-700" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                                    title="Next"
                                >
                                    <ChevronRight className="w-7 h-7 text-slate-700" />
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
                                    className={`relative shrink-0 w-12 sm:w-16 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all bg-white ${activeImageIdx === idx
                                            ? 'border-brand-orange scale-110 shadow-lg'
                                            : isDetailCard
                                                ? 'border-amber-400/60 opacity-80 hover:opacity-100'
                                                : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
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