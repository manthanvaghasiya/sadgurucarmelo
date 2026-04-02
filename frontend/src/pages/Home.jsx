import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Banknote, ShieldCheck, 
  Search, Play, Star, Landmark, Headphones, Loader2,
  Quote, ChevronLeft, ChevronRight, MapPin, Phone
} from 'lucide-react';
import CarCard from '../components/CarCard';
import { useCars } from '../context/CarContext';

// ── Real Google Reviews Data ──
const GOOGLE_REVIEWS = [
  {
    name: 'Rajesh Patel',
    initials: 'RP',
    rating: 5,
    date: '2 weeks ago',
    text: 'Excellent experience at Sadguru Car Melo! Bought a certified Hyundai Creta and the entire process was transparent. No hidden charges, genuine documentation, and the car was in perfect condition. Highly recommended for anyone looking for quality used cars in Surat.',
    color: 'bg-blue-600',
  },
  {
    name: 'Amit Shah',
    initials: 'AS',
    rating: 5,
    date: '1 month ago',
    text: 'Best place to buy second hand cars in Surat. The staff is very courteous and helpful. They showed me complete service history and all documents were verified. Got my Maruti Swift at a very reasonable price. Thank you Sadguru Car Melo!',
    color: 'bg-green-600',
  },
  {
    name: 'Priya Desai',
    initials: 'PD',
    rating: 5,
    date: '3 weeks ago',
    text: 'Very trustworthy dealer! I was looking for a family car and they helped me find the perfect Honda City. The car was in mint condition and the price was fair. The finance assistance was also very helpful. Will definitely recommend to friends and family.',
    color: 'bg-purple-600',
  },
  {
    name: 'Kiran Mehta',
    initials: 'KM',
    rating: 5,
    date: '1 month ago',
    text: 'Sold my old car here and got the best price compared to other dealers. The process was quick and payment was instant. Very professional team. Now planning to buy my next car from Sadguru Car Melo only.',
    color: 'bg-orange-600',
  },
  {
    name: 'Nilesh Joshi',
    initials: 'NJ',
    rating: 5,
    date: '2 months ago',
    text: 'Outstanding service! Purchased a Tata Nexon from here. The car had gone through proper inspection and everything was as described. The exchange bonus I got for my old car was also very good. A+ experience overall!',
    color: 'bg-red-600',
  },
  {
    name: 'Sneha Trivedi',
    initials: 'ST',
    rating: 4,
    date: '3 months ago',
    text: 'Good collection of verified used cars. The showroom is clean and well-maintained. Staff is knowledgeable and not pushy at all. They gave me enough time to inspect and test drive. Happy with my purchase!',
    color: 'bg-teal-600',
  },
  {
    name: 'Harsh Bhatt',
    initials: 'HB',
    rating: 5,
    date: '2 months ago',
    text: 'Sadguru Car Melo is the most genuine used car dealer I have come across in Surat. They provided complete transparency about the vehicle condition, accident history, and service records. Bought a Hyundai Venue and it runs like new!',
    color: 'bg-indigo-600',
  },
  {
    name: 'Deepak Sharma',
    initials: 'DS',
    rating: 5,
    date: '1 month ago',
    text: 'Fantastic experience from start to finish. The team helped me with loan processing and got it approved within 2 days. The car quality is top-notch and the after-sales support is also excellent. 5 stars!',
    color: 'bg-pink-600',
  },
];

// ── Review Card Component ──
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300 min-w-[320px] max-w-[380px] shrink-0 snap-center">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
        <span className="font-body text-xs text-text-muted ml-2">{review.date}</span>
      </div>

      {/* Quote */}
      <div className="relative flex-1 mb-5">
        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-primary/10" />
        <p className="font-body text-sm text-text-muted leading-relaxed line-clamp-4 pl-2">
          {review.text}
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-white font-heading font-bold text-sm`}>
          {review.initials}
        </div>
        <div>
          <h4 className="font-heading font-bold text-text text-sm">{review.name}</h4>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[11px] text-text-muted font-body">Google Review</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [inventoryTab, setInventoryTab] = useState('present'); // 'present' or 'soon'
  const { cars, isLoading } = useCars();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ── Quick Search State ──
  const navigate = useNavigate();
  const [searchMake, setSearchMake] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchFuel, setSearchFuel] = useState('');

  // Extract unique makes from live car data
  const uniqueMakes = [...new Set(cars.map(c => c.make).filter(Boolean))].sort();

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (searchMake) params.set('make', searchMake);
    if (searchFuel) params.set('fuelType', searchFuel);
    if (searchBudget) {
      const [min, max] = searchBudget.split('-');
      if (min) params.set('priceMin', min);
      if (max) params.set('priceMax', max);
    }
    navigate(`/inventory?${params.toString()}`);
  };

  // ── Auto-scroll reviews ──
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId;
    let scrollSpeed = 0.5;
    let isPaused = false;

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;
        // Reset to start when reaching end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchstart', onEnter);
    container.addEventListener('touchend', onLeave);

    animationId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchstart', onEnter);
      container.removeEventListener('touchend', onLeave);
    };
  }, []);

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 400);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative h-[600px] sm:h-[700px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x800/001a4d/ffffff?text=Premium+Audi+Sedan" 
            alt="Premium Showroom Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-32">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Surat's Most Trusted & Verified Pre-Owned Cars
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/90 text-yellow-950 px-4 py-2 rounded-full font-heading font-bold text-sm shadow-md">
              <Star className="w-4 h-4 fill-current" />
              <span>4.9/5 Rating on Google Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-body font-medium text-sm border border-white/20">
              <span>📍 Varachha Road, Surat</span>
            </div>
          </div>
        </div>

        {/* Quick Search Overlapping Card */}
        <div className="absolute -bottom-16 left-0 right-0 px-4 z-20">
          <div className="max-w-6xl mx-auto bg-surface rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-4 lg:items-end border border-gray-100">
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Select Brand</label>
              <select value={searchMake} onChange={(e) => setSearchMake(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option value="">All Brands</option>
                {uniqueMakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Select Budget</label>
              <select value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option value="">Any Budget</option>
                <option value="0-500000">Under ₹5 Lakh</option>
                <option value="500000-1000000">₹5L - ₹10L</option>
                <option value="1000000-2000000">₹10L - ₹20L</option>
                <option value="2000000-">₹20L+</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Fuel Type</label>
              <select value={searchFuel} onChange={(e) => setSearchFuel(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option value="">All Types</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div className="w-full lg:w-auto">
              <button onClick={handleQuickSearch} className="w-full lg:w-48 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Services Section */}
      <section className="pt-32 pb-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">Complete Buy-Sell-Exchange Solutions in Surat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Buy Certified Cars</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Choose from 150+ rigorously inspected cars for total peace of mind.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>
            
            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Sell Your Car Instantly</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Get the best market value with instant payment and transparent processes.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>

            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Best Value Exchange</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Quality cars available for attractive exchange bonuses when you trade in.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inventory Grid Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-3">Explore Our Verified Vehicles</h2>
              <p className="font-body text-text-muted max-w-2xl">Quality pre-owned vehicles with complete service history and multi-point inspection.</p>
            </div>
            
            <div className="bg-gray-200 p-1.5 rounded-xl inline-flex selbst-start">
              <button 
                onClick={() => setInventoryTab('present')}
                className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all sm:w-auto w-1/2 ${
                  inventoryTab === 'present' 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Available Now
              </button>
              <button 
                onClick={() => setInventoryTab('soon')}
                className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all sm:w-auto w-1/2 ${
                  inventoryTab === 'soon' 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-body text-text-muted font-semibold">Loading inventory...</p>
              </div>
            ) : (!cars || cars.length === 0) ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="font-heading text-lg text-text font-bold mb-2">Our inventory is currently being updated.</p>
                <p className="font-body text-text-muted">Check back soon for the latest arrivals!</p>
              </div>
            ) : (
              cars.slice(0, 6).map((car) => (
                <CarCard key={car._id} car={car} />
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/inventory" className="inline-block px-8 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer">
              View Full Inventory
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Highlight Banner Section */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-gray-400 uppercase tracking-widest mb-8">Arriving Shortly</h2>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-primary flex flex-col md:flex-row min-h-[400px]">
            <div className="md:w-[60%] relative h-64 md:h-auto">
              <img 
                src="https://placehold.co/1000x800/1a1a1a/444444?text=2023+KIA+SELTOS" 
                alt="Incoming Kia Seltos" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-primary md:to-primary"></div>
            </div>
            
            <div className="md:w-[40%] p-10 md:p-16 flex flex-col justify-center relative z-10 bg-surface md:bg-transparent rounded-t-3xl md:rounded-l-none md:rounded-r-3xl text-left shadow-lg md:shadow-none -mt-6 md:mt-0 ml-0 md:-ml-8">
              <span className="inline-block bg-primary/20 text-primary md:text-white md:bg-white/20 px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider mb-6 self-start backdrop-blur-sm border md:border-white/20 border-primary/20">
                Join Waitlist
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-primary md:text-white leading-tight mb-4">
                <span className="italic block font-light text-2xl sm:text-3xl mb-1 text-gray-500 md:text-gray-300">HYPE ALERT:</span>
                2023 KIA SELTOS
              </h2>
              <div className="flex items-center gap-3 mb-8 border-l-4 border-accent pl-4 text-text-muted md:text-blue-100">
                <p className="font-body text-lg">Coming to lot this Thursday</p>
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-heading font-bold text-lg inline-flex items-center self-start gap-3 shadow-xl transition-all hover:-translate-y-1">
                Get Early Access → 
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-24 px-4 bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">Why Choose Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Certified & Tested Cars</h3>
              <p className="font-body text-text-muted text-sm">Every vehicle undergoes a 120+ point inspection for your peace of mind.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <Landmark className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Easy Loan Assistance</h3>
              <p className="font-body text-text-muted text-sm">Get quick approval and flexible EMI options from top banks.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                <Headphones className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text mb-3">Local Surat Support</h3>
              <p className="font-body text-text-muted text-sm">Dedicated local team providing post-purchase assistance and service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Google Reviews Section — Below Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-background overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* Google Logo */}
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-text">
                  Google Reviews
                </h2>
              </div>
              <p className="font-body text-text-muted max-w-xl">
                Hear what our customers say about their experience at Sadguru Car Melo, Varachha Road, Surat.
              </p>
            </div>

            {/* Aggregate Score */}
            <div className="flex items-center gap-5 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
              <div className="text-center">
                <span className="font-heading text-4xl font-extrabold text-text">4.9</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="border-l border-gray-200 pl-5">
                <p className="font-heading font-bold text-sm text-text">Excellent</p>
                <p className="font-body text-xs text-text-muted">Based on customer ratings</p>
              </div>
            </div>
          </div>

          {/* Scrolling Reviews Track */}
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Navigation Arrows */}
            <button
              onClick={() => scrollBy(-1)}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-text-muted hover:text-primary hover:shadow-xl transition-all hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-text-muted hover:text-primary hover:shadow-xl transition-all hidden md:flex"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={scrollRef}
              onScroll={checkScrollButtons}
              className="flex gap-5 overflow-x-auto scrollbar-none py-2 px-1 snap-x"
              style={{ scrollBehavior: 'auto' }}
            >
              {/* Duplicate reviews for infinite scroll effect */}
              {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS].map((review, i) => (
                <ReviewCard key={`${review.name}-${i}`} review={review} />
              ))}
            </div>
          </div>

          {/* CTA to Google */}
          <div className="mt-10 text-center">
            <a
              href="https://www.google.com/maps/place/Sadguru+Car+Melo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold hover:bg-primary hover:text-white transition-colors"
            >
              View All Reviews on Google
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
