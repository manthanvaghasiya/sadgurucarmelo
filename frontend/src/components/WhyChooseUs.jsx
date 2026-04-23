import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import {
    Shield,
    CheckCircle, Landmark, Headphones, Tag, FileText, RefreshCw
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
                        સુરતના હજારો પરિવારોનો અતૂટ વિશ્વાસ. <span className="font-bold text-slate-800">Premium Car</span> ખરીદવાનો સુરક્ષિત અને સરળ અનુભવ.
                    </p>
                </motion.div>



                {/* Feature cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {/* Feature 1 */}
                    <motion.div
                        className="group flex flex-col items-center text-center"
                        variants={staggerChild}
                    >
                        <motion.div
                            className="relative w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-7 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/20 transition-all duration-500"
                            whileHover={{ rotate: 5 }}
                        >
                            <div className="absolute inset-0 rounded-3xl border border-blue-200 border-dashed animate-[spin_8s_linear_infinite]" />
                            <CheckCircle className="w-11 h-11 text-blue-500 relative z-10" />
                        </motion.div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">Certified અને 100% Tested Cars</h3>
                        <p className="font-body text-slate-600 text-[15px] leading-relaxed max-w-xs">
                            તમારી સુરક્ષા માટે દરેક <span className="font-semibold text-brand-orange">Car</span> નું 120+ પોઈન્ટનું કડક <span className="font-semibold text-brand-orange">Inspection</span> કરવામાં આવે છે.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        className="group flex flex-col items-center text-center"
                        variants={staggerChild}
                    >
                        <motion.div
                            className="relative w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-7 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-emerald-500/20 transition-all duration-500"
                            whileHover={{ rotate: -5 }}
                        >
                            <div className="absolute inset-0 rounded-3xl border border-emerald-200 border-dashed animate-[spin_10s_linear_infinite_reverse]" />
                            <Landmark className="w-11 h-11 text-emerald-500 relative z-10" />
                        </motion.div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">ઝડપી Loan અને Finance</h3>
                        <p className="font-body text-slate-600 text-[15px] leading-relaxed max-w-xs">
                            <span className="font-semibold text-brand-orange">Top Banks</span> માંથી સરળ <span className="font-semibold text-brand-orange">EMI</span> અને 100% <span className="font-semibold text-brand-orange">Quick Approval</span> ની ગેરંટી.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        className="group flex flex-col items-center text-center"
                        variants={staggerChild}
                    >
                        <motion.div
                            className="relative w-24 h-24 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-7 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500"
                            whileHover={{ rotate: 5 }}
                        >
                            <div className="absolute inset-0 rounded-3xl border border-purple-200 border-dashed animate-[spin_12s_linear_infinite]" />
                            <Headphones className="w-11 h-11 text-purple-500 relative z-10" />
                        </motion.div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">સુરતની શ્રેષ્ઠ Local Support</h3>
                        <p className="font-body text-slate-600 text-[15px] leading-relaxed max-w-xs">
                            કાર ખરીદ્યા પછી પણ <span className="font-semibold text-brand-orange">Service</span> અને <span className="font-semibold text-brand-orange">Support</span> માટે હંમેશા હાજર.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}