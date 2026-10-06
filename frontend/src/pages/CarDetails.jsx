import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import {
    Fuel, Settings2, User, Gauge, MapPin, Star, Tag, Check,
    ShieldCheck, Palette, RotateCw, CheckCircle2, ChevronLeft, ChevronRight,
    ArrowLeftRight, Download, Maximize2, Share2, X, ArrowLeft, Send, Loader2, Phone,
    Sparkles, ArrowRight, Shield, Award, Wrench
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
    const [viewMode, setViewMode] = useState('standard'); // 'standard' or '360'
    const [isSendingImages, setIsSendingImages] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [mobileDetailTab, setMobileDetailTab] = useState('specs'); // 'specs', 'emi', 'dealer'

    const whatsappUrl = car ? getCarWhatsAppLink(car) : '#';

    // Normalized list of gallery images (always strings, includes generated Car Details Summary Card)
    const rawImages = useMemo(() => {
        if (!car) return [];
        if (car.images && Array.isArray(car.images) && car.images.length > 0) {
            return car.images.map(getSafeImageUrl).filter(Boolean);
        }
        if (car.image) {
            return [getSafeImageUrl(car.image)].filter(Boolean);
        }
        return [];
    }, [car]);

    const images = useMemo(() => {
        return detailCardUrl ? [...rawImages, detailCardUrl] : rawImages;
    }, [rawImages, detailCardUrl]);

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
    }, [activeImageIdx, images]);

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
            setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        } else if (distance < -minSwipeDistance && images.length > 1) {
            setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareTitle = `${car?.make || 'Sadguru'} ${car?.model || 'Car'} (${car?.year || ''}) | Sadguru Car Surat`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: `Check out this ${car?.make} ${car?.model} at Sadguru Car Surat!`,
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
            }, (i + 1) * 350);
        });
    };

    const handleSendImages = async () => {
        if (!car) return;
        setIsSendingImages(true);
        toast.loading('ફોટા તૈયાર થઈ રહ્યા છે... / Preparing images to send...', { id: 'send-images' });

        try {
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

    // ── Intelligent Suggested Related Cars Recommendation Engine ──
    const suggestedCars = useMemo(() => {
        if (!car) return [];
        const currentId = String(car._id || car.id || '').trim();
        const currentMake = (car.make || '').trim().toLowerCase();
        const currentModel = (car.model || '').trim().toLowerCase();
        const currentBody = (car.bodyType || '').trim().toLowerCase();
        const currentPrice = Number(car.price) || 0;

        // Use strictly real database inventory cars to ensure all recommended cars are genuinely present in the showroom
        // Filter out any mock/showcase dummy data (showcase-*) so non-existent cars are NEVER shown
        const realCars = Array.isArray(cars) ? cars : [];
        const pool = realCars.filter((item) => {
            if (!item) return false;
            const cId = String(item._id || item.id || '').trim();
            if (!cId) return false;

            // 1. Exclude the vehicle currently being viewed
            if (cId === currentId) return false;

            // 2. Exclude dummy showcase cars (showcase-*) which are not present in the showroom
            if (cId.startsWith('showcase-')) return false;

            // 3. Exclude the same car model (recommend genuine alternative models, not the identical car being viewed)
            const cMake = (item.make || '').trim().toLowerCase();
            const cModel = (item.model || '').trim().toLowerCase();
            if (
                currentMake && currentModel &&
                cMake === currentMake &&
                (cModel === currentModel || cModel.includes(currentModel) || currentModel.includes(cModel))
            ) {
                return false;
            }

            return true;
        });

        // Deduplicate pool by ID
        const seenIds = new Set();
        const uniquePool = [];
        for (const item of pool) {
            const cId = String(item._id || item.id || '').trim();
            if (!seenIds.has(cId)) {
                seenIds.add(cId);
                uniquePool.push(item);
            }
        }

        // Rank candidates by multi-factor relevance:
        // 1. Same body type (SUV to SUV, Sedan to Sedan) -> top similarity factor for buyers
        // 2. Price proximity bracket (closest budget first)
        // 3. Same brand (if another model from the brand exists)
        // 4. Status = Available or Featured
        const ranked = uniquePool.map((c) => {
            let score = 0;
            const cMake = (c.make || '').trim().toLowerCase();
            const cBody = (c.bodyType || '').trim().toLowerCase();
            const cPrice = Number(c.price) || 0;

            // Same body type match (e.g. SUV -> SUV)
            if (currentBody && cBody && cBody === currentBody) {
                score += 8;
            }

            // Same brand if different model exists
            if (currentMake && cMake === currentMake) {
                score += 4;
            }

            // Price range proximity
            if (currentPrice > 0 && cPrice > 0) {
                const diffRatio = Math.abs(currentPrice - cPrice) / currentPrice;
                if (diffRatio < 0.25) score += 6;
                else if (diffRatio < 0.50) score += 3;
            }

            // Prioritize active available cars
            if (c.status === 'Available') score += 2;
            if (c.isFeaturedOnHome) score += 1;

            return { item: c, score };
        });

        ranked.sort((a, b) => b.score - a.score);
        return ranked.slice(0, 4).map((r) => r.item);
    }, [car, cars]);

    // Check if showroom has other cars from the same manufacturer
    const hasMoreFromMake = useMemo(() => {
        if (!car?.make || !Array.isArray(cars)) return false;
        const make = car.make.trim().toLowerCase();
        const count = cars.filter(c => (c.make || '').trim().toLowerCase() === make).length;
        return count > 1;
    }, [car, cars]);

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

    // Render helper for Pricing HUD and Primary CTAs (reused seamlessly in desktop sidebar & mobile flow)
    const renderPricingCard = () => {
        const isSold = String(car.status || '').toLowerCase() === 'sold';

        return (
            <div className="bg-surface rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5">
                <div className="flex justify-between items-start mb-2.5">
                    <span className="font-heading font-bold text-[10px] sm:text-[11px] text-slate-400 tracking-widest uppercase">{car.registration || 'UNREGISTERED'}</span>
                    <div className="flex items-center gap-1">
                        {isSold ? (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider flex items-center gap-1">
                                🔴 SOLD OUT · વેચાઈ ગઈ
                            </span>
                        ) : (
                            (car.badges || ['CERTIFIED']).map((b) => (
                                <span key={b} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    {typeof b === 'string' ? b.toUpperCase() : b}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSold ? 'text-rose-600' : 'text-slate-400'}`}>
                        {isSold ? 'Deal Closed · વેચાઈ ગઈ છે' : 'Special Offer Price'}
                    </span>
                    {isSold ? (
                        <div className="flex items-baseline gap-2 pt-0.5">
                            <h2 className="font-heading font-black text-2xl sm:text-3xl text-rose-600 leading-none tracking-tight">
                                SOLD OUT
                            </h2>
                            <span className="font-heading font-bold text-sm sm:text-base text-slate-400 line-through">
                                {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : '')}
                            </span>
                        </div>
                    ) : (
                        <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-orange leading-none tracking-tight">
                            {typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price ? `₹${car.price}` : 'કિંમત માટે સંપર્ક કરો')}
                        </h2>
                    )}
                </div>

                <p className="font-body text-[11px] text-slate-400 mb-3">
                    {isSold ? 'Delivered by Sadguru Car Surat' : `Last verified: ${car.updatedAt && !isNaN(new Date(car.updatedAt).getTime()) ? new Date(car.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()} · Surat Dealership`}
                </p>

                {car.loanAvailable && !isSold && (
                    <div className="flex items-center gap-2 mb-3.5 px-3 py-2 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-700">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] font-bold uppercase tracking-widest text-blue-500 leading-tight">Financing Support</span>
                            <span className="font-body text-xs font-bold leading-tight truncate">Car Loan / Easy EMI Available</span>
                        </div>
                    </div>
                )}

                {/* Core 6 Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <Fuel className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">Fuel</span>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">{car.fuelType || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <Settings2 className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">Transmission</span>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">{car.transmission || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <User className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">Owner</span>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">{car.owner || '1st Owner'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <Gauge className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">KMs</span>
                                {car.isKmGenuine && (
                                    <span className="text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded text-[7px] font-bold uppercase leading-none">
                                        Genuine
                                    </span>
                                )}
                            </div>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">
                                {typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms ? `${car.kms} KM` : 'N/A')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <Tag className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">Body</span>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">{car.bodyType || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white shadow-2xs flex items-center justify-center text-primary">
                            <Palette className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading text-[9px] uppercase tracking-wider text-slate-400">Color</span>
                            <span className="font-body font-bold text-xs text-slate-800 truncate">{car.color || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-col gap-2.5">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-body font-bold text-sm shadow-md transition-all active:scale-98 ${
                            isSold
                                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                                : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-500/20'
                        }`}
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>
                            {isSold
                                ? 'આના જેવી બીજી કાર શોધો · Inquire Similar Cars'
                                : 'WhatsApp પર વાત કરો · Chat'}
                        </span>
                    </a>

                    {!isSold && (
                        <button
                            type="button"
                            id="btn-car-detail-add-compare"
                            onClick={() => toggleCompare(car)}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-body font-bold text-xs border transition-all active:scale-98 ${
                                isInCompare(car._id || car.id)
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                            }`}
                        >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>
                                {isInCompare(car._id || car.id)
                                    ? `✓ સરખામણીમાં ઉમેરેલ છે · In Compare`
                                    : `બીજી કાર સાથે સરખાવો · Add to Compare (${compareCount}/3)`}
                            </span>
                        </button>
                    )}

                    {!isSold && isInCompare(car._id || car.id) && (
                        <Link
                            to="/compare"
                            id="link-car-detail-view-compare"
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-body font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
                        >
                            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                            <span>સરખામણી જુઓ · View Compare ({compareCount} cars) →</span>
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={handleDownloadAllImages}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-98 transition-all"
                    >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>બધા ફોટા ડાઉનલોડ કરો · Save Photos ({rawImages.length > 0 ? rawImages.length : 1})</span>
                    </button>
                </div>
            </div>
        );
    };

    // Render helper for Dealership Trust and Location card
    const renderDealershipCard = () => (
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center font-heading font-black text-lg text-primary shrink-0">
                S
            </div>
            <div className="flex flex-col min-w-0">
                <h4 className="font-heading font-bold text-slate-900 text-xs mb-0.5">Sadguru Car Surat</h4>
                <p className="font-body text-[11px] text-slate-500 mb-1.5 leading-tight">Trimruti Compound, Opp. Yoginagar BRTS, Varachha Road, Surat</p>
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="font-heading font-bold text-xs text-slate-900">4.9</span>
                    <div className="flex">
                        {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <span className="font-body text-[10px] text-slate-400">Google Reviews</span>
                </div>
                <a
                    href="https://www.google.com/maps/place/Sadguru+Car+Melo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[10px] font-bold text-brand-orange flex items-center gap-1 hover:underline tracking-wide uppercase"
                >
                    <MapPin className="w-3 h-3" /> Get Directions
                </a>
            </div>
        </div>
    );

    // SEO / AEO / GEO Schema Variables
    const pageTitle = `Used ${car.make || 'Certified'} ${car.model || 'Car'} ${car.year ? car.year : ''} for Sale in Surat | Sadguru Car Surat`;
    const priceFormatted = typeof car.price === 'number' ? `₹${car.price.toLocaleString('en-IN')}` : (car.price || 'Best Price');
    const pageDescription = `Certified pre-owned ${car.make || ''} ${car.model || ''} (${car.year || ''}) available for sale at Sadguru Car Surat. Price: ${priceFormatted}. ${car.fuelType || ''}, ${car.transmission || ''}, ${typeof car.kms === 'number' ? `${car.kms.toLocaleString('en-IN')} KM` : (car.kms || '')}. Verified with 120-point inspection, loan/EMI available. Visit Varachha, Surat, Gujarat.`;

    return (
        <div className="relative bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 min-h-screen py-5 sm:py-7 px-3.5 sm:px-6 lg:px-8 pb-24 lg:pb-12 overflow-hidden">
            {/* ── SEO, AEO (Answer Engine), and GEO (Generative Engine Optimization) Structured Metadata ── */}
            <SEO
                title={pageTitle}
                description={pageDescription}
                image={getSafeImageUrl(car.image) || (images[0] || '')}
                url={`https://sadgurucarsurat.com/car-details/${car._id || car.id || ''}`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Vehicle",
                    "name": `${car.make || ''} ${car.model || ''} ${car.year ? `(${car.year})` : ''}`.trim(),
                    "image": getSafeImageUrl(car.image) || (images[0] || ''),
                    "description": car.description || pageDescription,
                    "brand": {
                        "@type": "Brand",
                        "name": car.make || 'Sadguru Car Surat'
                    },
                    "model": car.model || 'Car',
                    "vehicleModelDate": car.year || '2022',
                    "mileageFromOdometer": {
                        "@type": "QuantitativeValue",
                        "value": car.kms || 0,
                        "unitCode": "KMT"
                    },
                    "fuelType": car.fuelType || 'Petrol',
                    "vehicleTransmission": car.transmission || 'Manual',
                    "color": car.color || 'White',
                    "bodyType": car.bodyType || 'SUV',
                    "itemCondition": "https://schema.org/UsedCondition",
                    "offers": {
                        "@type": "Offer",
                        "price": typeof car.price === 'number' ? car.price : 500000,
                        "priceCurrency": "INR",
                        "itemCondition": "https://schema.org/UsedCondition",
                        "availability": car.status === 'Sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
                        "url": `https://sadgurucarsurat.com/car-details/${car._id || car.id || ''}`,
                        "seller": {
                            "@type": "AutoDealer",
                            "name": "Sadguru Car Surat",
                            "url": "https://sadgurucarsurat.com",
                            "telephone": telPhone || "+919913634447",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha",
                                "addressLocality": "Surat",
                                "addressRegion": "Gujarat",
                                "postalCode": "395013",
                                "addressCountry": "IN"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 21.2266,
                                "longitude": 72.8712
                            }
                        }
                    }
                }}
            />

            {/* ── Ambient Radial Showroom Lighting Accent ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-400/5 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto">

                {/* ════ Page Header (Clean Breadcrumbs & Showroom Title) ════ */}
                <div className="mb-4 sm:mb-6">
                    <nav className="flex mb-2" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-1.5 font-body text-xs font-semibold text-slate-500">
                            <li><Link to="/" className="hover:text-brand-orange transition-colors">Used Cars</Link></li>
                            <li><span className="text-slate-300">/</span></li>
                            <li><Link to="/inventory" className="hover:text-brand-orange transition-colors">{car.make || 'Cars'}</Link></li>
                            <li><span className="text-slate-300">/</span></li>
                            <li aria-current="page" className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">{car.model || 'Model'}</li>
                        </ol>
                    </nav>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight flex flex-wrap items-center gap-2.5">
                            <span>{car.make || ''} {car.model || 'Vehicle'}</span>
                            {car.year && <span className="text-brand-orange font-bold">({car.year})</span>}
                            {car.variantTier && (
                                <span className="text-xs sm:text-sm font-heading font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                                    {car.variantTier}
                                </span>
                            )}
                        </h1>

                        <div className="hidden sm:flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-heading font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5" /> 120-Point Inspected
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-heading font-bold uppercase tracking-wider">
                                <Award className="w-3.5 h-3.5" /> Surat Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════ Sold Vehicle Notice Banner ════ */}
                {String(car.status || '').toLowerCase() === 'sold' && (
                    <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-rose-50/90 border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-[fadeScale_200ms_ease-out]">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-heading font-black text-xs uppercase tracking-wider shadow-sm shadow-rose-600/30">
                                SOLD
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-sm sm:text-base text-rose-950">
                                    આ કાર સફળતાપૂર્વક વેચાઈ ગઈ છે · Successfully Delivered to Customer
                                </h3>
                                <p className="font-body text-xs text-rose-800/80 mt-0.5 max-w-2xl">
                                    This vehicle has found a new home. Looking for a similar model? Our Surat dealership can source and 120-point inspect one for you!
                                </p>
                            </div>
                        </div>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-heading font-bold shadow-md shadow-rose-600/20 transition-all shrink-0 active:scale-95 whitespace-nowrap"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            <span>સમાન કાર શોધો · Find Similar</span>
                        </a>
                    </div>
                )}

                {/* ════ Main Showroom 2-Column Responsive Layout ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">

                    {/* ── LEFT COLUMN: Gallery + Specifications (Desktop: cols 1-2) ── */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Top Quick Actions Bar (Back, Share, Send Photos, Save All) */}
                        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
                            <Link
                                to="/inventory"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:border-brand-orange text-xs font-bold transition-all shadow-2xs shrink-0"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span className="sm:hidden">Back</span>
                                <span className="hidden sm:inline">બધી કાર જુઓ · Back to Inventory</span>
                            </Link>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-orange-50/50 text-xs font-bold transition-all shadow-2xs active:scale-95"
                                    title="Share Car Details"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">શેર કરો · Share</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSendImages}
                                    disabled={isSendingImages}
                                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50"
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
                                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-orange hover:bg-orange-50/50 text-xs font-bold transition-all shadow-2xs active:scale-95"
                                    title="Download All Photos & Details Card"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">સેવ કરો · Save All</span>
                                    <span className="sm:hidden">Save</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface p-2.5 sm:p-3.5 rounded-2xl shadow-sm border border-slate-200/80">

                            {/* Main Big Screen Viewer (Spacious Proportions, No Height Squish) */}
                            <div
                                className={`relative w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden mb-3 shadow-xs border border-slate-200/70 group flex items-center justify-center cursor-pointer select-none ${
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
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activeImageIdx}
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.25 }}
                                                src={getOptimizedUrl(images[activeImageIdx] || activeImage || car.image, 1200) || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Sadguru+Car+Surat'}
                                                alt={`${car.make || ''} ${car.model || 'Car'} Photo ${activeImageIdx + 1}`}
                                                loading="eager"
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                                            />
                                        </AnimatePresence>

                                        {/* Top Badges */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
                                            {images.length > 1 && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-heading font-bold text-[11px] sm:text-xs border border-white/15 shadow-md">
                                                    {activeImageIdx + 1} / {images.length}
                                                </span>
                                            )}
                                            {car.status === 'Coming Soon' && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow">
                                                    Coming Soon
                                                </span>
                                            )}
                                            {car.status === 'Sold' && (
                                                <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
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
                                            className="absolute bottom-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
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
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
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
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                                    title="Next Image"
                                                >
                                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                                {(car.spinImages || []).length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('360')}
                                        className={`relative shrink-0 w-20 sm:w-28 aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 snap-start border-2 ${
                                            viewMode === '360'
                                                ? 'border-brand-orange ring-2 ring-brand-orange/40 scale-[0.98] shadow-xs'
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
                                            <RotateCw className="w-4 h-4 mb-0.5 text-brand-orange" />
                                            <span className="font-heading font-black text-[8px] tracking-wider uppercase text-amber-300">
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
                                            className={`relative shrink-0 w-18 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 snap-start bg-gray-50 border-2 ${
                                                isActive
                                                    ? 'border-primary ring-2 ring-primary/30 scale-[0.98] shadow-xs'
                                                    : isDetailCard
                                                        ? 'border-amber-400 ring-1 ring-amber-300 opacity-90 hover:opacity-100'
                                                        : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={getOptimizedUrl(img, 240)}
                                                alt={`Thumbnail ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {isDetailCard && (
                                                <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[7px] font-black uppercase text-center py-0.5 tracking-wider">
                                                    SPEC CARD
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>

                        {/* 2. Mobile Only: Pricing HUD Card & Primary CTAs */}
                        <div className="block lg:hidden">
                            {renderPricingCard()}
                        </div>

                        {/* ── MOBILE DETAIL TAB SWITCHER (NATIVE PWA LUXURY FEEL) ── */}
                        <div className="block lg:hidden mt-2 mb-1">
                            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner">
                                {[
                                    { id: 'specs', label: '📋 ફીચર્સ · Specs' },
                                    { id: 'emi', label: '💰 EMI કેલ્ક્યુલેટર' },
                                    { id: 'dealer', label: '🏢 શોરૂમ · Dealership' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setMobileDetailTab(tab.id)}
                                        className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                                            mobileDetailTab === tab.id
                                                ? 'bg-white text-slate-950 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Detailed Specifications (Directly below Gallery on Desktop; tab-filtered on mobile) */}
                        <div className={`flex flex-col gap-4 sm:gap-5 bg-surface p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 ${mobileDetailTab !== 'specs' ? 'hidden lg:flex' : ''}`}>
                            {/* Comfort Features */}
                            {(car.airConditioner || car.powerWindows || car.sunroof || car.parkingSensors) && (
                                <div>
                                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2.5 border-l-3 border-primary pl-2.5">
                                        Comfort & Convenience Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-body text-xs sm:text-sm">
                                        {car.airConditioner && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Air Conditioner</span>
                                                <span className="font-semibold text-slate-900">{car.airConditioner}</span>
                                            </div>
                                        )}
                                        {car.powerWindows && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Power Windows</span>
                                                <span className="font-semibold text-slate-900">{car.powerWindows}</span>
                                            </div>
                                        )}
                                        {car.sunroof && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Sunroof</span>
                                                <span className="font-semibold text-slate-900">{car.sunroof}</span>
                                            </div>
                                        )}
                                        {car.parkingSensors && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Parking Sensors</span>
                                                <span className="font-semibold text-slate-900">{car.parkingSensors}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Engine & Performance */}
                            {(car.displacement || car.maxPower || car.driveType || car.cylinders) && (
                                <div>
                                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2.5 border-l-3 border-primary pl-2.5">
                                        Engine & Performance Specs
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-body text-xs sm:text-sm">
                                        {car.displacement && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Displacement</span>
                                                <span className="font-semibold text-slate-900">{car.displacement}</span>
                                            </div>
                                        )}
                                        {car.maxPower && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Max Power</span>
                                                <span className="font-semibold text-slate-900">{car.maxPower}</span>
                                            </div>
                                        )}
                                        {car.driveType && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Drive Type</span>
                                                <span className="font-semibold text-slate-900">{car.driveType}</span>
                                            </div>
                                        )}
                                        {car.cylinders && (
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                <span className="text-slate-500">Cylinders</span>
                                                <span className="font-semibold text-slate-900">{car.cylinders}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {car.description && (
                                <div>
                                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 border-l-3 border-primary pl-2.5">
                                        About this Vehicle
                                    </h3>
                                    <p className="font-body text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                        {car.description}
                                    </p>
                                </div>
                            )}

                            {/* Key Features */}
                            {(car.features || []).length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 border-l-3 border-primary pl-2.5">
                                            Key Highlights & Features
                                        </h3>
                                        <span className="text-[11px] font-bold text-slate-400 font-heading">
                                             {car.features.length} Features
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-body text-xs sm:text-sm">
                                        {(showAllFeatures ? (car.features || []) : (car.features || []).slice(0, 8)).map((f, i) => {
                                            const featureStr = String(f || '');
                                            const hasColon = featureStr.includes(':');

                                            let key = featureStr.trim();
                                            let value = (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
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
                                                <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                    <span className="text-slate-500 capitalize">{key}</span>
                                                    <span className="font-semibold text-slate-900 text-right">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {(car.features || []).length > 8 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                                            className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-body font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 border border-slate-200/70"
                                        >
                                            <span>
                                                {showAllFeatures
                                                    ? 'ઓછા ફીચર્સ જુઓ · Show Fewer Features ↑'
                                                    : `બધા ${(car.features || []).length} ફીચર્સ જુઓ · View All ${(car.features || []).length} Features (+${(car.features || []).length - 8} more) ↓`}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            )}

                            {(!car.description && (car.features || []).length === 0 && !car.airConditioner && !car.powerWindows && !car.sunroof && !car.parkingSensors && !car.displacement && !car.maxPower && !car.driveType && !car.cylinders) && (
                                <div className="py-4 text-center text-slate-400 font-body text-xs">
                                    No additional features listed for this vehicle.
                                </div>
                            )}
                        </div>

                        {/* 4. Mobile Only: EMI Calculator & Dealership Card (Filtered by selected tab) */}
                        <div className="block lg:hidden flex flex-col gap-3.5">
                            {mobileDetailTab === 'emi' && (
                                <div className="animate-[fadeScale_200ms_ease-out]">
                                    <EmiCalculator
                                        carPrice={typeof car.price === 'number' ? car.price : (Number(car.price) || 500000)}
                                        carTitle={`${car.make || ''} ${car.model || 'Car'} (${car.year || ''})`}
                                        isSidebar={false}
                                    />
                                </div>
                            )}
                            {mobileDetailTab === 'dealer' && (
                                <div className="animate-[fadeScale_200ms_ease-out] flex flex-col gap-3.5">
                                    {renderDealershipCard()}
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-sm border border-slate-700/50">
                                        <span className="text-[10px] font-heading font-bold text-amber-400 uppercase tracking-widest block mb-2">
                                            સદગુરુ શોરૂમ ભરોસો · Sadguru Assurance
                                        </span>
                                        <div className="grid grid-cols-2 gap-2 text-[11px] font-body">
                                            <div className="flex items-center gap-1.5 text-slate-200">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>120-Point ટેસ્ટ</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-200">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>જેન્યુઈન KM</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-200">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>નોન-એક્સિડેન્ટલ</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-200">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>RTO ટ્રાન્સફર</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Pricing HUD + Dealership + EMI Calculator (Desktop Only: col 3, sticky) ── */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col gap-3.5 sticky top-20 self-start">
                        {renderPricingCard()}
                        {renderDealershipCard()}
                        <EmiCalculator
                            carPrice={typeof car.price === 'number' ? car.price : (Number(car.price) || 500000)}
                            carTitle={`${car.make || ''} ${car.model || 'Car'} (${car.year || ''})`}
                            isSidebar={true}
                        />

                        {/* Dealership Assurance Badge Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-sm border border-slate-700/50">
                            <span className="text-[10px] font-heading font-bold text-amber-400 uppercase tracking-widest block mb-2">
                                સદગુરુ શોરૂમ ભરોસો · Sadguru Assurance
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-body">
                                <div className="flex items-center gap-1.5 text-slate-200">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>120-Point ટેસ્ટ</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>જેન્યુઈન KM</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>નોન-એક્સિડેન્ટલ</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-200">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>RTO ટ્રાન્સફર</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ════ SUGGESTED RELATED CARS SECTION (Guaranteed & Multi-Factor Ranked) ════ */}
                {suggestedCars.length > 0 && (
                    <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-5 sm:mb-6">
                            <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-brand-orange mb-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    તમારા માટે ભલામણ કરેલ કાર્સ · Recommended Similar Cars
                                </span>
                                <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                                    આ કાર જેવી અન્ય ઉત્તમ કાર્સ
                                </h2>
                                <p className="font-body text-xs text-slate-500 mt-0.5">
                                    તમારી પસંદગી અને બજેટને અનુરૂપ સર્ટિફાઈડ પ્રી-ઓન્ડ કાર્સ
                                </p>
                            </div>

                            <Link
                                to={hasMoreFromMake ? `/inventory?make=${encodeURIComponent(car.make || '')}` : '/inventory'}
                                className="font-body text-xs sm:text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors inline-flex items-center gap-1 self-start sm:self-auto group"
                            >
                                <span>{hasMoreFromMake ? `બધી ${car.make} કાર જુઓ · View All` : 'બધી કાર જુઓ · Browse All'}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Mobile Swipeable Snap Carousel + Desktop 4-Col Grid */}
                        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-3 sm:pb-0 snap-x scrollbar-none sm:overflow-visible">
                            {suggestedCars.map((relatedCar) => (
                                <div
                                    key={relatedCar._id || relatedCar.id}
                                    className="w-[78vw] max-w-[280px] sm:w-auto sm:max-w-none shrink-0 snap-start flex flex-col"
                                >
                                    <CarCard
                                        id={relatedCar._id || relatedCar.id}
                                        image={getSafeImageUrl(relatedCar.image) || (Array.isArray(relatedCar.images) && getSafeImageUrl(relatedCar.images[0]))}
                                        title={`${relatedCar.make || ''} ${relatedCar.model || 'Car'} ${relatedCar.year ? `(${relatedCar.year})` : ''}`}
                                        price={typeof relatedCar.price === 'number' ? (relatedCar.price >= 100000 ? `₹${(relatedCar.price / 100000).toFixed(2)} Lakhs` : `₹${relatedCar.price.toLocaleString('en-IN')}`) : (relatedCar.price || 'Call for Price')}
                                        fuel={relatedCar.fuelType || relatedCar.fuel || 'N/A'}
                                        transmission={relatedCar.transmission || 'N/A'}
                                        owner={relatedCar.owner || '1st Owner'}
                                        kms={typeof relatedCar.kms === 'number' ? `${relatedCar.kms.toLocaleString('en-IN')} KM` : (relatedCar.kms ? `${relatedCar.kms} KM` : 'N/A')}
                                        isKmGenuine={relatedCar.isKmGenuine}
                                        badges={relatedCar.badges || ['CERTIFIED']}
                                        status={relatedCar.status || 'Available'}
                                    />
                                </div>
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