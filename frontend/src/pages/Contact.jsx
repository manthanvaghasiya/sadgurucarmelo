import { Phone, MapPin, Clock, Plus, Minus, Car, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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

  return (
    <div className="bg-background min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Page Header Section */}
        <div className="mb-10">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 font-heading text-[11px] font-bold tracking-widest text-text-muted uppercase">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><span className="text-gray-300 mx-1">&gt;</span></li>
              <li aria-current="page" className="text-text">Contact</li>
            </ol>
          </nav>
          <h1 className="font-heading font-extrabold text-[36px] sm:text-[44px] text-text leading-tight tracking-tight mb-4">
            Get in Touch with Sadguru Car Melo
          </h1>
          <p className="font-body text-base text-text-muted max-w-2xl">
            Visit our lot in Varachha or reach out online for instant support. 
            We're here to help you find your dream car.
          </p>
        </div>

        {/* 2. Main Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 3. Left Column (Details & Form) */}
          <div className="flex flex-col gap-8">
            
            {/* Showroom Details Card */}
            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-2xl text-text mb-8">Showroom Details</h2>
              
              <div className="flex flex-col gap-8">
                
                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary fill-primary/10 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted block mb-1">Sales & General Inquiry</span>
                    <a href="tel:+919913634447" className="font-heading font-bold text-xl text-primary hover:underline">
                      +91 99136 34447
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary fill-primary/10 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted block mb-1">Showroom Address</span>
                    <p className="font-body text-sm font-medium text-text leading-relaxed leading-[1.6]">
                      Trilok Car Bazar, Simada Canal BRTS Rd,<br />
                      Canal Chokdi, Varachha, Surat,<br />
                      Gujarat 395013
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary fill-primary/10 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted block mb-1">Business Hours</span>
                    <p className="font-body text-sm font-medium text-text mb-1">
                      Monday - Sunday: 9:00 AM to 7:00 PM
                    </p>
                    <span className="font-body text-[13px] font-semibold text-accent">Open All Week</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Send us a Message Card (Form) */}
            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-2xl text-text mb-8">Send us a Message</h2>
              
              <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className={`w-full bg-[#f1f5f9] text-text font-body text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.name ? 'border border-red-500' : ''}`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <span className="text-red-500 text-[11px] block">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Email</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className={`w-full bg-[#f1f5f9] text-text font-body text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.email ? 'border border-red-500' : ''}`}
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

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-heading font-semibold text-[11px] uppercase tracking-widest text-text-muted">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className={`w-full bg-[#f1f5f9] text-text font-body text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${errors.phone ? 'border border-red-500' : ''}`}
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
                    className={`w-full bg-[#f1f5f9] text-text font-body text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 resize-none ${errors.message ? 'border border-red-500' : ''}`}
                    {...register("message", { required: "Message is required" })}
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-[11px] block">{errors.message.message}</span>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-primary text-white font-body font-bold text-sm py-4 rounded-xl hover:bg-primary-hover shadow-md transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

          </div>

          {/* 4. Right Column (Map Placeholder & WhatsApp) */}
          <div className="relative h-[600px] lg:h-auto bg-[#e2e8f0]/40 rounded-3xl overflow-hidden border border-gray-200">
            {/* Mock Map Background Grid */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-multiply"
              style={{
                backgroundImage: `radial-gradient(circle at center, transparent 0%, #cbd5e1 100%), 
                                  linear-gradient(rgba(203, 213, 225, 0.4) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(203, 213, 225, 0.4) 1px, transparent 1px)`,
                backgroundSize: '100% 100%, 20px 20px, 20px 20px'
              }}
            ></div>
            
            {/* Decorative concentric circles to mock streets */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-white/50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full border border-white/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square rounded-full border border-white/30"></div>

            {/* Map Zoom Controls */}
            <div className="absolute top-6 right-6 flex flex-col shadow-md rounded-lg overflow-hidden bg-surface">
              <button className="p-2 hover:bg-gray-50 border-b border-gray-100 text-text transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-50 text-text transition-colors">
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Center Map Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-surface px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 mb-2 relative">
                <h3 className="font-heading font-bold text-sm text-primary">Sadguru Car Melo</h3>
                <p className="font-body text-[10px] text-text-muted">Varachha, Surat</p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface rotate-45 border-b border-r border-gray-100"></div>
              </div>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md relative z-10 border-2 border-white">
                <Car className="w-5 h-5" />
              </div>
            </div>

            {/* Floating WhatsApp Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto bg-surface p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm">
              <h3 className="font-heading font-bold text-lg text-text mb-4">Need instant answers?</h3>
              <button className="w-full flex items-center justify-center gap-2 bg-[#10b981] text-white font-body font-bold text-sm py-3.5 rounded-xl hover:bg-[#059669] shadow-sm transition-colors">
                <MessageCircle className="w-5 h-5 fill-current" />
                Start WhatsApp Chat
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
