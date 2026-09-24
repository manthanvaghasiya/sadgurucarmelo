import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import {
    Shield,
    CheckCircle, Landmark, Headphones, Tag, FileText, RefreshCw,
    ShieldCheck,
    ChevronLeft, ChevronRight
} from 'lucide-react';

// --- Animation Variants ---
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const staggerChild = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// 6 Executive Promise Cards for 3D Stacked Carousel / Coverflow Effect
const promiseCards = [
    {
        id: 'certified',
        badge: '૧૨૦+ પોઇન્ટ વેરિફિકેશન',
        title: 'Certified અને 100% Tested Cars',
        desc: 'તમારી સુરક્ષા માટે દરેક Car નું 120+ પોઈન્ટનું કડક Inspection કરવામાં આવે છે.',
        icon: CheckCircle,
        shortTitle: '100% Tested',
        borderAccent: 'border-slate-800/80',
        glowColor: 'rgba(15, 23, 42, 0.12)',
        iconColor: 'text-primary',
        iconBg: 'bg-slate-100 border-slate-200',
        ringColor: 'border-slate-400',
        badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
        bullets: [
            '૧૨૦+ પોઇન્ટ કડક ટેકનિકલ ઈન્સ્પેક્શન',
            'નોન-એક્સિડેન્ટલ & ક્લીન હિસ્ટ્રી ગેરંટી',
            '૧૦૦% સચોટ અને વેરિફાઇડ કિલોમીટર'
        ]
    },
    {
        id: 'finance',
        badge: '૧૦૦% ક્વિક એપ્રૂવલ',
        title: 'ઝડપી Loan અને Finance',
        desc: 'Top Banks માંથી સરળ EMI અને 100% Quick Approval ની ગેરંટી.',
        icon: Landmark,
        shortTitle: 'Loan & Finance',
        borderAccent: 'border-emerald-500/80',
        glowColor: 'rgba(16, 185, 129, 0.16)',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50 border-emerald-100',
        ringColor: 'border-emerald-400',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        bullets: [
            'Top Banks સાથે સીધું ટાઈ-અપ (HDFC, SBI, ICICI)',
            'સરળ અને સસ્તા વ્યાજ દર સાથે સુવિધાજનક EMI',
            'ઝીરો ડાઉન પેમેન્ટ અને ત્વરિત લોન એપ્રૂવલ'
        ]
    },
    {
        id: 'rto',
        badge: '૧૦૦% મફત RTO ટ્રાન્સફર',
        title: 'Hassle-Free RC Transfer',
        desc: 'કાગળકામની તમામ ઝંઝટમાંથી મુક્તિ. સુરત RTO નું નામ ટ્રાન્સફર સંપૂર્ણ અમારી જવાબદારી.',
        icon: FileText,
        shortTitle: 'RC Transfer',
        borderAccent: 'border-blue-500/80',
        glowColor: 'rgba(59, 130, 246, 0.18)',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50 border-blue-100',
        ringColor: 'border-blue-400',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        bullets: [
            '૧૦૦% કાનૂની અને ઝડપી RC ઓનરશિપ ટ્રાન્સફર',
            'સિંગલ / મલ્ટી ઓનર સાચી હિસ્ટ્રી ક્લિયરન્સ',
            'ચલણ ફ્રી અને ઝીરો પેન્ડિંગ ટેક્સ ખાતરી'
        ]
    },
    {
        id: 'exchange',
        badge: 'ઓન-ધ-સ્પોટ બેસ્ટ ભાવ',
        title: 'કાર Exchange & Buyback Guarantee',
        desc: 'તમારી કોઈપણ જૂની કાર લાવો અને શ્રેષ્ઠ માર્કેટ ભાવે નવી સર્ટિફાઈડ કાર સાથે બદલો.',
        icon: RefreshCw,
        shortTitle: 'Exchange',
        borderAccent: 'border-purple-500/80',
        glowColor: 'rgba(168, 85, 247, 0.18)',
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50 border-purple-100',
        ringColor: 'border-purple-400',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        bullets: [
            'માત્ર ૧૫ મિનિટમાં ફ્રી પારદર્શક કાર મૂલ્યાંકન',
            'એક્સચેન્જ પર સ્પેશિયલ બોનસ ડિસ્કાઉન્ટ ઓફર',
            'ઈન્સ્ટન્ટ બેંક ટ્રાન્સફર પેમેન્ટ સુવિધા'
        ]
    },
    {
        id: 'genuine',
        badge: '૧૦૦% જેન્યુઈન મીટર',
        title: 'Non-Accidental & સાચું કિલોમીટર',
        desc: 'ઓરિજિનલ સર્વિસ રેકોર્ડ આધારિત સાચું કિલોમીટર અને નોન-એક્સિડેન્ટલ ની ૧૦૦% ખાતરી.',
        icon: ShieldCheck,
        shortTitle: 'Non-Accident',
        borderAccent: 'border-amber-500/80',
        glowColor: 'rgba(245, 158, 11, 0.2)',
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50 border-amber-100',
        ringColor: 'border-amber-400',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        bullets: [
            'ઓરિજિનલ સર્વિસ રેકોર્ડ સાથે વેરિફાઈડ મીટર',
            'મેઈન ચેસીસ અને એન્જિન ૧૦૦% ઓરિજિનલ & અકબંધ',
            'લેખિત પ્રમાણપત્ર સાથે સંપૂર્ણ માનસિક શાંતિ'
        ]
    },
    {
        id: 'support',
        badge: '૨૪/૭ સુરત લોકલ સપોર્ટ',
        title: 'સુરતની શ્રેષ્ઠ Local Support',
        desc: 'કાર ખરીદ્યા પછી પણ Service અને Support માટે હંમેશા હાજર.',
        icon: Headphones,
        shortTitle: 'Local Care',
        borderAccent: 'border-brand-orange/80',
        glowColor: 'rgba(245, 148, 35, 0.2)',
        iconColor: 'text-brand-orange',
        iconBg: 'bg-orange-50 border-orange-100',
        ringColor: 'border-orange-400',
        badgeBg: 'bg-orange-50 text-brand-orange border-orange-200',
        bullets: [
            'કાર ડિલિવરી પછી પણ સંપૂર્ણ સર્વિસ સહાય',
            'વરાછા, સુરત શોરૂમ પર રૂબરૂ ત્વરિત સપોર્ટ',
            'સમર્પિત કાર એડવાઈઝર દ્વારા ૨૪/૭ માર્ગદર્શન'
        ]
    }
];

// --- Animated Counter Component ---
function AnimatedCounter({ target, suffix = "" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2000
    });

    useEffect(() => {
        if (isInView) {
            springValue.set(target);
        }
    }, [isInView, springValue, target]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <span ref={ref}>
            {displayValue}
            {suffix}
        </span>
    );
}

// --- Main Component ---
export default function WhyChooseUs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextCard = () => {
        setActiveIndex((prev) => (prev + 1) % promiseCards.length);
    };

    const prevCard = () => {
        setActiveIndex((prev) => (prev - 1 + promiseCards.length) % promiseCards.length);
    };

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 35;
        if (info.offset.x < -swipeThreshold || info.velocity.x < -300) {
            nextCard();
        } else if (info.offset.x > swipeThreshold || info.velocity.x > 300) {
            prevCard();
        }
    };

    const getCardStyle = (index) => {
        const total = promiseCards.length;
        let diff = (index - activeIndex) % total;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) {
            return {
                x: 0,
                y: 0,
                scale: 1,
                rotateY: 0,
                zIndex: 30,
                opacity: 1,
                filter: 'blur(0px)',
            };
        } else if (diff === -1) {
            return {
                x: isMobile ? -85 : -240,
                y: 0,
                scale: isMobile ? 0.85 : 0.88,
                rotateY: 26,
                zIndex: 20,
                opacity: 0.75,
                filter: 'blur(0.5px)',
            };
        } else if (diff === 1) {
            return {
                x: isMobile ? 85 : 240,
                y: 0,
                scale: isMobile ? 0.85 : 0.88,
                rotateY: -26,
                zIndex: 20,
                opacity: 0.75,
                filter: 'blur(0.5px)',
            };
        } else if (diff === -2) {
            return {
                x: isMobile ? -145 : -420,
                y: 0,
                scale: isMobile ? 0.72 : 0.76,
                rotateY: 36,
                zIndex: 10,
                opacity: 0.4,
                filter: 'blur(1.5px)',
            };
        } else if (diff === 2) {
            return {
                x: isMobile ? 145 : 420,
                y: 0,
                scale: isMobile ? 0.72 : 0.76,
                rotateY: -36,
                zIndex: 10,
                opacity: 0.4,
                filter: 'blur(1.5px)',
            };
        } else {
            return {
                x: 0,
                y: 0,
                scale: 0.5,
                rotateY: 0,
                zIndex: 0,
                opacity: 0,
                filter: 'blur(4px)',
            };
        }
    };

    return (
        <section className="relative py-28 px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-gray-100">
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/5 blur-[100px]" />
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section heading */}
                <motion.div
                    className="text-center mb-12"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <motion.div
                        variants={scaleIn}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-6 shadow-sm"
                    >
                        <Shield className="w-3.5 h-3.5 text-brand-orange" />
                        <span className="text-brand-orange text-xs font-bold tracking-[0.15em] uppercase">અમારું Promise</span>
                    </motion.div>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        અમને શા માટે <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Choose</span> કરશો?
                    </h2>
                    <p className="font-body text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
                        સુરતના હજારો પરિવારોનો અતૂટ વિશ્વાસ. <span className="font-bold text-slate-800">Verified Car</span> ખરીદવાનો સુરક્ષિત અને સરળ અનુભવ (Trusted Dealer).
                    </p>
                </motion.div>



                {/* Animated Stats Bar */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={staggerChild} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-heading font-black text-3xl sm:text-4xl text-primary mb-1">
                            <AnimatedCounter target={150} suffix="+" />
                        </p>
                        <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold">સર્ટિફાઈડ કાર સ્ટોક</p>
                    </motion.div>

                    <motion.div variants={staggerChild} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-heading font-black text-3xl sm:text-4xl text-brand-orange mb-1">
                            <AnimatedCounter target={10000} suffix="+" />
                        </p>
                        <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold">ખુશ ગ્રાહક પરિવારો</p>
                    </motion.div>

                    <motion.div variants={staggerChild} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-600 mb-1">
                            <AnimatedCounter target={120} suffix="+" />
                        </p>
                        <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold">પોઇન્ટ ટેકનિકલ ચેક</p>
                    </motion.div>

                    <motion.div variants={staggerChild} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-heading font-black text-3xl sm:text-4xl text-slate-800 mb-1">
                            <AnimatedCounter target={14} suffix="+ વર્ષ" />
                        </p>
                        <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold">સુરતમાં અતૂટ વિશ્વાસ (2011)</p>
                    </motion.div>
                </motion.div>

                {/* 3D Stacked Card Carousel / Coverflow Effect for અમારું Promise */}
                <div className="relative max-w-4xl mx-auto mt-6">
                    {/* Perspective Stage */}
                    <div
                        className="relative w-full h-[470px] sm:h-[490px] flex items-center justify-center overflow-visible select-none"
                        style={{ perspective: '1200px' }}
                    >
                        {promiseCards.map((card, index) => {
                            const style = getCardStyle(index);
                            const isActive = index === activeIndex;
                            const IconComponent = card.icon;

                            return (
                                <motion.div
                                    key={card.id}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.18}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => {
                                        if (!isActive) setActiveIndex(index);
                                    }}
                                    animate={{
                                        x: style.x,
                                        y: style.y,
                                        scale: style.scale,
                                        rotateY: style.rotateY,
                                        zIndex: style.zIndex,
                                        opacity: style.opacity,
                                        filter: style.filter,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 26,
                                        mass: 0.8
                                    }}
                                    className={`absolute w-[86%] sm:w-[380px] max-w-[400px] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center backdrop-blur-xl transition-colors duration-300 cursor-grab active:cursor-grabbing ${
                                        isActive
                                            ? `bg-white/95 border-2 ${card.borderAccent} shadow-[0_22px_50px_rgba(15,23,42,0.12)]`
                                            : 'bg-white/80 border border-slate-200/90 shadow-md hover:bg-white hover:opacity-85'
                                    }`}
                                    style={{
                                        boxShadow: isActive ? `0 20px 48px ${card.glowColor}, 0 4px 16px rgba(0,0,0,0.06)` : undefined,
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    {/* Active Top Glow Line */}
                                    {isActive && (
                                        <div className="absolute top-0 inset-x-8 h-[3px] bg-gradient-to-r from-transparent via-brand-orange to-transparent rounded-full" />
                                    )}

                                    {/* Badge */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-black tracking-wider uppercase border shadow-2xs ${card.badgeBg}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-orange animate-ping' : 'bg-slate-400'}`} />
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Icon Container with Rotating Ring */}
                                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 shadow-sm transition-transform">
                                        <div className={`absolute inset-0 rounded-2xl border-2 ${card.ringColor} border-dashed animate-[spin_10s_linear_infinite]`} />
                                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${card.iconBg} border flex items-center justify-center relative z-10 shadow-xs`}>
                                            <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${card.iconColor}`} />
                                        </div>
                                    </div>

                                    {/* Card Title */}
                                    <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 mb-2.5 leading-snug">
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-body text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xs">
                                        {card.desc}
                                    </p>

                                    {/* Bullet Features */}
                                    <div className="w-full space-y-2.5 text-left border-t border-slate-100 pt-4 mt-auto">
                                        {card.bullets.map((point, pIdx) => (
                                            <div key={pIdx} className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-slate-700 font-body">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tap to view hint for background cards */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-white/10 rounded-3xl flex items-center justify-center pointer-events-none">
                                            <span className="sr-only">Click to bring card to front</span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Navigation Controls: Arrows + Tab Pills */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                        {/* Prev Button */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prevCard}
                                aria-label="Previous Promise Card"
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-brand-orange hover:text-brand-orange text-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Indicator Tabs */}
                            <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs max-w-full overflow-x-auto scrollbar-none">
                                {promiseCards.map((card, idx) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer shrink-0 ${
                                            activeIndex === idx
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeIndex === idx ? 'bg-brand-orange' : 'bg-slate-300'}`} />
                                        <span className="hidden sm:inline">{card.shortTitle}</span>
                                        <span className="sm:hidden">0{idx + 1}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={nextCard}
                                aria-label="Next Promise Card"
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-brand-orange hover:text-brand-orange text-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[11px] font-body text-slate-400 mt-3">
                        ⚡ Drag or swipe left/right to explore all 6 promises
                    </p>
                </div>
            </div>
        </section>
    );
}