import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosConfig';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/messages', data);
      toast.success('Message sent! We will contact you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-background min-h-screen py-12 pb-24 md:py-20 md:pb-20 px-4 overflow-x-hidden">
      <Helmet>
        <title>Contact Sadguru Car Surat — Visit Our Showroom in Surat</title>
        <meta name="description" content="Contact Sadguru Car Surat for car inquiries, test drives, or selling your vehicle. Located at Trilok Car Bazar, Varachha, Surat. Call +91 99136 34447." />
        <meta property="og:title" content="Contact Sadguru Car Surat — Visit Our Showroom" />
        <meta property="og:description" content="Call +91 99136 34447 or visit us at Trilok Car Bazar, Varachha, Surat." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">

        {/* 1. Page Header Section */}
        <motion.div
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 font-heading text-[11px] font-bold tracking-widest text-text-muted uppercase">
              <li><a href="/" className="hover:text-primary transition-colors min-h-[44px] min-w-[44px] inline-flex items-center">Home</a></li>
              <li><span className="text-gray-300 mx-1">&gt;</span></li>
              <li aria-current="page" className="text-text min-h-[44px] inline-flex items-center">Contact</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-text leading-tight tracking-tight mb-4 whitespace-normal sm:whitespace-nowrap">
            અમારો સંપર્ક કરો | <span className="text-primary block sm:inline">Contact Us</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
            માહિતી, <span className="font-semibold text-slate-800">Inquiry</span> કે કાર ખરીદવા વિશે જાણવા માટે આજે જ સંપર્ક કરો.
            અમે તમને તમારી <span className="font-semibold text-accent">Dream Car</span> શોધવામાં મદદ કરવા તૈયાર છીએ.
          </p>
        </motion.div>

        {/* 2. Main Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          {/* Showroom Details Card */}
          <motion.div
            className="order-1 lg:col-start-1 lg:row-start-1 bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-text">Showroom ની માહિતી</h2>

            <div className="flex flex-col gap-6 md:gap-8">
              {/* Phone */}
              <motion.div className="flex items-start gap-4 md:gap-5" variants={fadeInUp}>
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary fill-primary/10 stroke-[2]" />
                </div>
                <div className="flex flex-col justify-center min-h-[48px]">
                  <span className="font-heading font-semibold text-[10px] md:text-[11px] uppercase tracking-widest text-text-muted block mb-1">Sales & General Inquiry</span>
                  <a href="tel:+919913634447" className="font-heading font-bold text-lg md:text-xl text-primary hover:underline block min-h-[44px] flex items-center">
                    +91 99136 34447
                  </a>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div className="flex items-start gap-4 md:gap-5" variants={fadeInUp}>
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary fill-primary/10 stroke-[2]" />
                </div>
                <div>
                  <span className="font-heading font-semibold text-[10px] md:text-[11px] uppercase tracking-widest text-text-muted block mb-1">Showroom Address</span>
                  <a
                    href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm md:text-base font-medium text-text leading-relaxed block hover:text-primary transition-colors min-h-[44px] pt-1"
                  >
                    Trilok Car Bazar, Simada Canal BRTS Rd,<br />
                    Canal Chokdi, Varachha, Surat,<br />
                    Gujarat 395013
                  </a>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div className="flex items-start gap-4 md:gap-5" variants={fadeInUp}>
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary fill-primary/10 stroke-[2]" />
                </div>
                <div>
                  <span className="font-heading font-semibold text-[10px] md:text-[11px] uppercase tracking-widest text-text-muted block mb-1">Business Hours (સમય)</span>
                  <p className="font-body text-sm md:text-base font-medium text-text mb-1 block min-h-[22px]">
                    સોમવાર - રવિવાર: 9:00 AM થી 7:00 PM
                  </p>
                  <span className="font-body text-xs md:text-[13px] font-semibold text-accent block mt-1">અમે અઠવાડિયાના તમામ દિવસો ખુલ્લા છીએ</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Send us a Message Card Form */}
          <motion.div
            className="order-3 lg:col-start-1 lg:row-start-2 bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-text">અમને Message મોકલો</h2>

            <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-[#f1f5f9] text-text font-body text-sm md:text-base rounded-xl px-4 py-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.name ? 'border border-red-500' : ''}`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <span className="text-red-500 text-[11px] block">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full bg-[#f1f5f9] text-text font-body text-sm md:text-base rounded-xl px-4 py-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.email ? 'border border-red-500' : ''}`}
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-[11px] block">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    className={`w-full bg-[#f1f5f9] text-text font-body text-sm md:text-base rounded-xl px-4 py-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.phone ? 'border border-red-500' : ''}`}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                  />
                  {errors.phone && <span className="text-red-500 text-[11px] block">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Your Message</label>
                <textarea
                  placeholder="How can we help you today?"
                  rows="4"
                  className={`w-full bg-[#f1f5f9] text-text font-body text-sm md:text-base rounded-xl px-4 py-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 resize-none ${errors.message ? 'border border-red-500' : ''}`}
                  {...register("message", { required: "Message is required" })}
                ></textarea>
                {errors.message && <span className="text-red-500 text-[11px] block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-primary text-white font-body font-bold text-sm md:text-base py-4 min-h-[56px] rounded-xl hover:bg-primary-hover active:scale-95 shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </motion.div>

          {/* Real Live Map & WhatsApp */}
          <motion.div
            className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 relative h-[450px] sm:h-[500px] lg:h-auto bg-[#e2e8f0]/40 rounded-3xl overflow-hidden border border-gray-200 mt-6 lg:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            {/* Real Google Map Embed */}
            <iframe
              title="Sadguru Car Surat Showroom Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5210617841512!2d72.89515417470535!3d21.211176681489203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fdde8bfb4e5%3A0x834add64072864dc!2sSadguru%20Car%20Melo!5e0!3m2!1sen!2sin!4v1775327556300!5m2!1sen!2sin"
              width="100%"
              height="100%"
              className="absolute inset-0 grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>

            {/* Fading overlay to match site aesthetic */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Floating WhatsApp Card */}
            <motion.div
              className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 lg:right-auto bg-surface/95 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/20 max-w-sm flex flex-col gap-3 sm:gap-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-text mb-1">તાત્કાલિક Support જોઈએ છે?</h3>
                <p className="font-body text-xs sm:text-sm text-text-muted">અમારી <span className="font-semibold text-slate-800">Sales Team</span> સાથે WhatsApp પર સીધી વાત કરો.</p>
              </div>
              <a
                href="https://wa.me/919913634447"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-bold text-sm sm:text-base py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] rounded-xl hover:bg-[#128C7E] active:scale-95 shadow-md transition-all"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                Start WhatsApp Chat
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
