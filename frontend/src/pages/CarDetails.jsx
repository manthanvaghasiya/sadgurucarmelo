import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import {
    Fuel, Settings2, User, Gauge, MapPin, Star, Tag, Check,
    ShieldCheck, Palette, RotateCw, CheckCircle2, ChevronLeft, ChevronRight,
    ArrowLeftRight, Download, Maximize2, Share2, X, ArrowLeft, Send, Loader2, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosConfig';
import CarCard from '../components/CarCard';
import Car360Viewer from '../components/Car360Viewer';
import EmiCalculator from '../components/EmiCalculator';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCars } from '../context/CarContext';
import { useCompare } from '../context/CompareContext';
import { useDealershipContact } from '../context/DealershipContactContext';
import { generateCarDetailCard } from '../utils/carDetailCardGenerator';
import { FALLBACK_SHOWCASE } from '../data/showcaseData';

// Helper to safely extract string URL from string or object { url, publicId }
const getSafeImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return '';
};

export default function CarDetails() {
    const { id } = useParams();
    const { cars } = useCars();
    const { telPhone } = useDealershipContact();
    const { addToCompare, removeFromCompare, toggleCompare, isInCompare, compareCount, compareCars } = useCompare();
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
    const [isSendingImages, setIsSendingImages] = useState(false);

    const whatsappUrl = car ? getCarWhatsAppLink(car) : '#';

    // Normalized list of gallery images (always strings, includes generated Car Details Summary Card)
    const rawImages = car?.images && Array.isArray(car.images) && car.images.length > 0
        ? car.images.map(getSafeImageUrl).filter(Boolean)
        : (car?.image ? [getSafeImageUrl(car.image)].filter(Boolean) : []);
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

    const handleDownloadAllImages = async () => {
        const rawList = rawImages.length > 0 ? [...rawImages] : [getSafeImageUrl(car?.image)].filter(Boolean);
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
        toast.success(`બધા ${totalCount} ફોટા ડાઉનલોડ થઈ રહ્યા છે... / Downloading all photos...`, { duration: 4000 });

        const downloadQueue = [];
        if (cardUrl) {
            downloadQueue.push({ url: cardUrl, name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-0-Vehicle-Details.jpg` });
        }
        rawList.forEach((img, idx) => {
            downloadQueue.push({ url: getOptimizedUrl(img, 1600), name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-${idx + 1}.jpg` });
        });

        downloadQueue.forEach((item, i) => {
            setTimeout(async () => {
                try {
                    const response = await fetch(item.url);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = item.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                } catch {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.download = item.name;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, (i + 1) * 400);
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

            const rawList = rawImages.length > 0 ? [...rawImages] : [getSafeImageUrl(car?.image)].filter(Boolean);
            const allImageSources = [];
            if (cardUrl) allImageSources.push({ url: cardUrl, name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-0-Vehicle-Details.jpg`, isCard: true });
            rawList.forEach((img, idx) => {
                allImageSources.push({ url: getOptimizedUrl(img, 1200), name: `${car.make || 'Sadguru'}-${car.model || 'Car'}-${idx + 1}.jpg` });
            });

            const priceStr = typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price || 'કિંમત માટે સંપર્ક કરો');
            const kmsStr = typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} km` : (car.kms || car.kmDriven || 'N/A');
            const shareText = `🚗 *${car.make || ''} ${car.model || 'Car'} ${car.variant || ''} (${car.year || ''})*\n💰 કિંમત: ${priceStr}\n🛣️ કિ.મી.: ${kmsStr}\n⛽ ઇંધણ: ${car.fuelType || car.fuel || 'N/A'}\n📍 સદ્ગુરુ કાર મેળો, વરાછા, સુરત\n🔗 વધુ વિગતો: ${window.location.href}`;

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
                    title: `${car.make} ${car.model}`,
                    text: shareText,
                    files: filesToShare,
                });
            } else {
                handleDownloadAllImages();
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

    // ── Resilient Data Fetching with In-Memory CarContext & Fallback Cache ──
    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;

        const findLocalCar = (targetId) => {
            if (!targetId) return null;
            const strId = String(targetId).trim();

            // 1. Check in-memory CarContext inventory
            if (Array.isArray(cars) && cars.length > 0) {
                const foundInContext = cars.find((c) => {
                    const cId = String(c._id || c.id || '');
                    return cId === strId || (strId.length >= 6 && cId.includes(strId));
                });
                if (foundInContext) return foundInContext;
            }

            // 2. Check FALLBACK_SHOWCASE
            const foundInShowcase = FALLBACK_SHOWCASE.find((c) => {
                const cId = String(c._id || c.id || '');
                return cId === strId || (strId.startsWith('showcase-') && cId.includes(strId.replace('showcase-', '')));
            });
            if (foundInShowcase) return foundInShowcase;

            // 3. Check CompareCars in memory
            if (Array.isArray(compareCars) && compareCars.length > 0) {
                const foundInCompare = compareCars.find((c) => {
                    const cId = String(c._id || c.id || '');
                    return cId === strId;
                });
                if (foundInCompare) return foundInCompare;
            }

            // 4. If ID is '1' or dummy and we have any car in context, return first available
            if (strId === '1' && Array.isArray(cars) && cars.length > 0) {
                return cars[0];
            }

            return null;
        };

        const localMatch = findLocalCar(id);

        // Instant render if car is already in memory
        if (localMatch && isMounted) {
            setCar(localMatch);
            const firstImg = getSafeImageUrl(localMatch.image) || (Array.isArray(localMatch.images) ? getSafeImageUrl(localMatch.images[0]) : '') || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat';
            setActiveImage(firstImg);
            if ((localMatch.spinImages || []).length > 0) {
                setViewMode('360');
            }
            setLoading(false);
        } else {
            setLoading(true);
        }

        const fetchCarData = async () => {
            setError('');

            // Showcase ID check
            if (id && String(id).startsWith('showcase-')) {
                const showcaseCar = FALLBACK_SHOWCASE.find((c) => String(c._id) === String(id));
                if (showcaseCar && isMounted) {
                    setCar(showcaseCar);
                    setActiveImage(getSafeImageUrl(showcaseCar.image));
                    setLoading(false);
                    return;
                }
            }

            // Query API if id is a 24-character hexadecimal MongoDB ObjectId
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(id || '').trim());
            if (isValidObjectId) {
                try {
                    const res = await axiosInstance.get(`/cars/${id}`);
                    if (!isMounted) return;

                    if (res.data && res.data.success && res.data.data) {
                        const fetchedCar = res.data.data;
                        setCar(fetchedCar);
                        const defaultImg = getSafeImageUrl(fetchedCar.image) || (Array.isArray(fetchedCar.images) ? getSafeImageUrl(fetchedCar.images[0]) : '') || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat';
                        setActiveImage(defaultImg);

                        if ((fetchedCar.spinImages || []).length > 0) {
                            setViewMode('360');
                        }

                        // Fetch Similar Cars
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
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.warn('API fetch car by ID error:', err);
                    if (!localMatch && isMounted) {
                        const lateMatch = findLocalCar(id);
                        if (lateMatch) {
                            setCar(lateMatch);
                            setLoading(false);
                            return;
                        }
                        setError(err.response?.data?.message || 'વાહન લોડ કરવામાં સમસ્યા આવી · Failed to fetch car details.');
                    }
                }
            } else {
                // Non-ObjectId fallback
                if (!localMatch && isMounted) {
                    const fallbackMatch = FALLBACK_SHOWCASE.find((c) => String(c._id || c.id) === String(id));
                    if (fallbackMatch) {
                        setCar(fallbackMatch);
                        setActiveImage(getSafeImageUrl(fallbackMatch.image));
                        setLoading(false);
                        return;
                    }
                    setError('વાહન ઉપલબ્ધ નથી · Vehicle Not Available');
                }
            }

            if (isMounted) {
                setLoading(false);
            }
        };

        fetchCarData();
        return () => { isMounted = false; };
    }, [id, cars]);

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
        <div className="bg-background min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-8">
            <SEO
                title={`Used ${car.make || 'Certified'} ${car.model || 'Car'} ${car.year ? car.year : ''} for Sale in Surat | Sadguru Car Surat`}
                description={`Buy ${car.make || ''} ${car.model || ''} ${car.year ? `(${car.year})` : ''} at ${typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price || 'Best Price')}. ${car.fuelType || ''}, ${car.transmission || ''}, ${typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms || '')}. Certified pre-owned at Sadguru Car Surat, Surat.`}
                image={getSafeImageUrl(car.image) || (images[0] || '')}
                url={`https://sadgurucarsurat.com/car-details/${car._id || car.id || ''}`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Vehicle",
                    "name": `${car.make || ''} ${car.model || ''} ${car.year || ''}`.trim(),
                    "image": getSafeImageUrl(car.image) || (images[0] || ''),
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
                    "offers": {
                        "@type": "Offer",
                        "price": car.price,
                        "priceCurrency": "INR",
                        "availability": car.status === 'Sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
                        "seller": {
                            "@type": "AutoDealer",
                            "name": "Sadguru Car Surat",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha",
                                "addressLocality": "Surat",
                                "postalCode": "395013",
                                "addressRegion": "GJ",
                                "addressCountry": "IN"
                            },
                            "telephone": telPhone || "+919913634447"
                        }
                    }
                }}
            />
            <div className="max-w-7xl mx-auto">

                {/* ════ Page Header (Original Spacious Breadcrumbs & Title) ════ */}
                <div className="mb-8">
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 font-body text-xs font-semibold text-text-muted">
                            <li><Link to="/" className="hover:text-primary transition-colors">Used Cars</Link></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li><span className="text-text">{car.make || 'Cars'}</span></li>
                            <li><span className="text-gray-400">{'>'}</span></li>
                            <li aria-current="page" className="text-text">{car.model || 'Model'}</li>
                        </ol>
                    </nav>
                    <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text leading-tight tracking-tight flex flex-wrap items-center gap-3">
                        {car.make || ''} {car.model || 'Vehicle'} {car.year ? `(${car.year})` : ''}
                        {car.variantTier && (
                            <span className="text-lg sm:text-xl font-body font-bold text-text-muted bg-gray-100 px-3 py-1 rounded-lg">
                                {car.variantTier} Variant
                            </span>
                        )}
                    </h1>
                </div>

                {/* ════ Main Layout (Spacious 3-Column Grid) ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Media Gallery — Always first (Left 2 cols on laptop) */}
                    <div className="lg:col-span-2 order-1">
                        {/* Top Quick Actions Bar (Back, Share, Send Images, Save All) */}
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

                                <button
                                    type="button"
                                    onClick={handleSendImages}
                                    disabled={isSendingImages}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
                                    title="Send Car Images & Details Card"
                                >
                                    {isSendingImages ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span>ફોટો મોકલો · Send Images</span>
                                </button>

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

                            {/* Main Big Screen Viewer (Spacious Aspect Ratio, No Height Squish) */}
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
                                            src={getOptimizedUrl(images[activeImageIdx] || activeImage || car.image, 1200) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat'}
                                            alt={`${car.make || ''} ${car.model || 'Car'} Photo ${activeImageIdx + 1}`}
                                            loading="eager"
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                        />

                                        {/* Top Badges */}
                                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-20 pointer-events-none">
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

                                        {/* Maximize Button */}
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

                            {/* Thumbnail Strip */}
                            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
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
                                            src={getOptimizedUrl(getSafeImageUrl((car.spinImages || [])[0]), 240)}
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
                                            className={`relative shrink-0 w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-start bg-gray-50 border-2 ${
                                                isActive
                                                    ? 'border-primary ring-2 ring-primary/30 scale-[0.98] shadow-md'
                                                    : isDetailCard
                                                        ? 'border-amber-400 ring-1 ring-amber-300 opacity-90 hover:opacity-100'
                                                        : 'border-transparent opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={getOptimizedUrl(img, 240)}
                                                alt={`Thumbnail ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {isDetailCard && (
                                                <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-wider">
                                                    SPEC CARD
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                    {/* 2. Pricing & Core Overview Card — Right Column on Desktop, Sticky */}
                    <div className="order-2">
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

                                <h2 className="font-heading font-bold text-[36px] text-accent mb-1 leading-none">
                                    {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : 'કિંમત માટે સંપર્ક કરો')}
                                </h2>
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
                                            <span className="font-body font-bold text-[13px] text-text">{car.fuelType || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                            <Settings2 className="w-5 h-5 text-primary stroke-[2]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-heading text-[10px] uppercase tracking-widest text-text-muted">Transmission</span>
                                            <span className="font-body font-bold text-[13px] text-text">{car.transmission || 'N/A'}</span>
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
                                            <span className="font-body font-bold text-[12px] sm:text-[13px] text-text truncate">
                                                {typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms ? `${car.kms} KM` : 'N/A')}
                                            </span>
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
                                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-6 rounded-xl font-body font-bold text-sm shadow-lg shadow-green-500/20 active:scale-98 transition-all"
                                    >
                                        <WhatsAppIcon className="w-5 h-5" /> WhatsApp પર વાત કરો · Chat
                                    </a>

                                    <button
                                        type="button"
                                        id="btn-car-detail-add-compare"
                                        onClick={() => toggleCompare(car)}
                                        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-body font-bold text-xs border transition-all active:scale-98 ${
                                            isInCompare(car._id || car.id)
                                                ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
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
                                        <span>બધા ફોટા ડાઉનલોડ કરો · Download All Photos ({rawImages.length > 0 ? rawImages.length : 1})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Dealer Info Box (Desktop Only) */}
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

                    {/* 3. Detailed Specs — Below gallery on desktop, 3rd on mobile */}
                    <div className="lg:col-span-2 order-3">
                        <div className="flex flex-col gap-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            {/* Comfort Features */}
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

                            {/* Engine & Performance */}
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
                                                <span className="text-text-muted">Cylinders</span>
                                                <span className="font-semibold text-text">{car.cylinders}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {car.description && (
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-text mb-4 border-l-4 border-primary pl-3">About this Vehicle</h3>
                                    <p className="font-body text-sm text-text whitespace-pre-line leading-relaxed">{car.description}</p>
                                </div>
                            )}

                            {/* Key Features */}
                            {(car.features || []).length > 0 && (
                                <div className={car.description ? 'mt-8' : ''}>
                                    <h3 className="font-heading font-bold text-xl text-text mb-6 border-l-4 border-primary pl-3">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm">
                                        {(car.features || []).map((f, i) => {
                                            const featureStr = String(f || '');
                                            const hasColon = featureStr.includes(':');

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
                        <EmiCalculator carPrice={typeof car.price === 'number' ? car.price : (Number(car.price) || 500000)} carTitle={`${car.make || ''} ${car.model || 'Car'} (${car.year || ''})`} />

                        {/* Dealer Info Box (Mobile Only) */}
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

                {/* ════ Similar Cars Section ════ */}
                {relatedCars.length > 0 && (
                    <div className="mt-20 md:mt-28 pt-12 border-t border-gray-100 pb-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">Similar Cars You Might Like</h2>
                            <Link to={`/inventory?make=${encodeURIComponent(car.make || '')}`} className="font-body text-sm font-bold text-primary hover:text-primary-hover transition-colors hidden sm:block">View all {car.make} models →</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedCars.map((relatedCar) => (
                                <CarCard
                                    key={relatedCar._id || relatedCar.id}
                                    id={relatedCar._id || relatedCar.id}
                                    image={getSafeImageUrl(relatedCar.image) || (Array.isArray(relatedCar.images) && getSafeImageUrl(relatedCar.images[0]))}
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

            {/* ════ Mobile Sticky Bottom Action Bar with iPhone/Android Safe-Area Support ════ */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-4 pt-2.5 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5"
                style={{
                    paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))',
                }}
            >
                <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider leading-none mb-1 truncate">
                        {car.make} {car.model}
                    </span>
                    <span className="font-heading font-black text-lg text-accent leading-none truncate">
                        {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : 'કિંમત માટે સંપર્ક')}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => toggleCompare(car)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-2xs ${
                            isInCompare(car._id || car.id)
                                ? 'bg-brand-orange text-white border-brand-orange'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                        title={isInCompare(car._id || car.id) ? 'સરખામણીમાંથી દૂર કરો' : 'સરખામણીમાં ઉમેરો'}
                        aria-label="Compare Car"
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    {telPhone && (
                        <a
                            href={`tel:${telPhone}`}
                            className="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-body font-bold text-xs flex items-center justify-center shadow-md active:scale-95 transition-all"
                            title="Call Dealership"
                            aria-label="Call Dealership"
                        >
                            <Phone className="w-4 h-4 fill-current" />
                        </a>
                    )}

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-body font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-green-500/25 active:scale-95 transition-all"
                        aria-label="Chat on WhatsApp"
                    >
                        <WhatsAppIcon className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                    </a>
                </div>
            </div>

            {/* ════ Full-Screen High-Definition Lightbox Modal ════ */}
            {isLightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200/80 bg-white/90">
                        <div className="flex items-center gap-3">
                            <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                                {car.make} {car.model} {car.year ? `(${car.year})` : ''}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-heading font-bold border border-slate-200">
                                {activeImageIdx + 1} / {images.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSendImages}
                                disabled={isSendingImages}
                                className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                                title="Send Car Photos"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Send Photos</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDownloadAllImages}
                                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 border border-slate-200"
                                title="Download All Photos"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Save All</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 flex items-center justify-center transition-all border border-slate-200 shadow-xs"
                                title="Close Fullscreen (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Middle Image Stage */}
                    <div className="relative flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                    className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                                    title="Previous Image (Left Arrow)"
                                >
                                    <ChevronLeft className="w-7 h-7" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                                    title="Next Image (Right Arrow)"
                                >
                                    <ChevronRight className="w-7 h-7" />
                                </button>
                            </>
                        )}

                        <img
                            src={getOptimizedUrl(images[activeImageIdx] || activeImage, 1600)}
                            alt={`${car.make} ${car.model} Fullscreen`}
                            className="max-h-[75vh] max-w-[95vw] sm:max-w-[88vw] object-contain drop-shadow-md select-none transition-all duration-300"
                        />
                    </div>

                    {/* Bottom Thumbnail Strip */}
                    <div className="px-4 py-3 border-t border-slate-200/80 bg-white/90">
                        <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-4xl mx-auto py-1 scrollbar-none">
                            {images.map((thumbImg, idx) => {
                                const isDetailCard = thumbImg === detailCardUrl;
                                return (
                                    <button
                                        key={`lb-thumb-${idx}`}
                                        type="button"
                                        onClick={() => setActiveImageIdx(idx)}
                                        className={`relative shrink-0 w-12 sm:w-16 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all bg-white ${
                                            activeImageIdx === idx
                                                ? 'border-brand-orange scale-110 shadow-lg'
                                                : isDetailCard
                                                    ? 'border-amber-400/60 opacity-80 hover:opacity-100'
                                                    : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                                        }`}
                                        title={isDetailCard ? 'Car Details Card' : `Photo ${idx + 1}`}
                                    >
                                        <img
                                            src={getOptimizedUrl(thumbImg, 180)}
                                            alt={`Thumb ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}