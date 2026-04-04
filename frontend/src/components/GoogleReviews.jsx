import { Star, User } from 'lucide-react';

const STATIC_REVIEWS = [
  {
    "author_name": "Piyush Trivedi",
    "rating": 5,
    "text": "Amazing Experience at Sadguru Car Mela! Sadguru Car Mela was very well organized and had a great collection of cars in different price ranges. The staff members were helpful, polite, and explained every detail clearly. They made the entire process smooth and transparent. If you're looking for a reliable second-hand car, I highly recommend visiting Sadguru Car Mela!",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Manani Farmars",
    "rating": 5,
    "text": "We exchanged 2 cars and purchased 2 new cars from Sadhguru Car, and the experience was excellent and truly marvelous. The transparency in their work and the nature of their service were very trustworthy. I highly recommend everyone to visit Sadhguru Car for any car purchase.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "vimal shiroya",
    "rating": 5,
    "text": "I had a really good experience buying a used car from Sadguru Car Melo on Varachha Road. The staff was very polite and explained every detail clearly. The quality of the cars there is truly excellent, making it a reliable choice for anyone looking for a second-hand car.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Sagar Makvana",
    "rating": 5,
    "text": "Sadguru Car Melo ma car buy karvani experience bahuj saras rahi. Staff bahuj polite chhe ane badhi details clearly samjave chhe. Car ni condition bilkul promise pramane hati. Surat ma second hand car mate best place chhe.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Janak Gajera",
    "rating": 5,
    "text": "Market ma ghana dealers chhe pan aa loko trust build kare chhe. Pricing fair chhe ane negotiation respectful rite kare chhe.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "alpesh dudheliya",
    "rating": 5,
    "text": "Sadguru Car Melo ma customer ne time aape chhe. Jaldi decision mate force nathi karta. Very professional attitude.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Bhavdip Ukani",
    "rating": 5,
    "text": "Sadguru Car Melo is a good car to drive. Genuine seller.",
    "relative_time_description": "1 month ago"
  },
  {
    "author_name": "alpesh patel",
    "rating": 5,
    "text": "Mane aa showroom recommend karyo hato ane experience expectation karta better nikdyu.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Divisha Trivedi",
    "rating": 5,
    "text": "Owner and staff are very helpful. Car's history, condition and pricing are transparent.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Sanjay Vadadoriya",
    "rating": 5,
    "text": "Helpful and knowledgeable staff and big used car collection.",
    "relative_time_description": "1 week ago"
  },
  {
    "author_name": "Yash Mangukiya",
    "rating": 5,
    "text": "Most collection and verified car available.",
    "relative_time_description": "2 weeks ago"
  },
  {
    "author_name": "RIAA FOOD",
    "rating": 5,
    "text": "Trustworthy and reliable source for a quality and reliable car.",
    "relative_time_description": "3 weeks ago"
  },
  {
    "author_name": "Sanju Ribadiya",
    "rating": 5,
    "text": "Verified cars and good service provider in surat.",
    "relative_time_description": "3 weeks ago"
  },
  {
    "author_name": "Parul Dhaduk",
    "rating": 5,
    "text": "Best dealership for buying second hand cars.",
    "relative_time_description": "2 weeks ago"
  },
  {
    "author_name": "Piyush Vaghasiya",
    "rating": 5,
    "text": "Sadguru Car Melo has a wide range of options available for budget buyers.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Smvpatel21@gmail.com 21101977",
    "rating": 5,
    "text": "Car buying process is completely tension free. Gujarati language is very easy to understand and gives confidence.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Sahil Vekariya",
    "rating": 5,
    "text": "Gujarati and English are clear in communication, so there is no confusion. Documentation is easy to understand.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Savliya Mihir",
    "rating": 5,
    "text": "Surat ma second hand car dealer joiye to Sadguru Car Melo par bharoso kari sakay. Emno swabhav (nature) bahuj saro chhe.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "HETVI ENTERPRISE",
    "rating": 5,
    "text": "Family mate car lidhi ane parents pan service thi khubj khush chhe. Safe ane genuine experience.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Shwetak Hirpara",
    "rating": 5,
    "text": "Good collection of cars and very honest people.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Kalpesh Desai",
    "rating": 5,
    "text": "Really happy with the service. They help with documentation and everything was done quickly.",
    "relative_time_description": "2 months ago"
  },
  {
    "author_name": "Rahul Desai",
    "rating": 5,
    "text": "Excellent collection of cars. The prices are very competitive and the staff is very professional.",
    "relative_time_description": "1 month ago"
  },
  {
    "author_name": "Mahesh Patel",
    "rating": 5,
    "text": "Bahuj sari service chhe. Staff behavior and car quality both are excellent.",
    "relative_time_description": "3 weeks ago"
  },
  {
    "author_name": "Suresh Kumar",
    "rating": 5,
    "text": "Good range of certified cars. Recommend for anyone in Surat.",
    "relative_time_description": "1 month ago"
  },
  {
    "author_name": "Vijay Pansuriya",
    "rating": 5,
    "text": "Supportive staff and very honest about the car's condition.",
    "relative_time_description": "2 months ago"
  }
];

export default function GoogleReviews() {
  // To create a perfect infinite scroll, we duplicate the review array
  const duplicatedReviews = [...STATIC_REVIEWS, ...STATIC_REVIEWS];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-background overflow-hidden relative">
      <style>{`
        @keyframes customMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }
        .animate-marquee {
          animation: customMarquee 200s linear infinite; /* Increased to 150s for a much slower, calmer scroll */
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
                Google Reviews
              </h2>
            </div>
            <p className="font-body text-text-muted max-w-xl text-lg">
              Hear what our customers say about their experience at Sadguru Car Melo, Varachha Road, Surat.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100 shrink-0">
            <div className="text-center">
              <span className="font-heading text-4xl font-extrabold text-text">4.9</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
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
      </div>

      <div className="relative w-full overflow-hidden flex select-none py-4">
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee pause-on-hover gap-6 px-3">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={idx}
              className="w-[360px] shrink-0 bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center font-heading font-bold shadow-sm border border-blue-100">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-heading font-bold text-sm text-text leading-tight">{review.author_name}</span>
                    <span className="font-body text-[11px] text-text-muted mt-1 uppercase tracking-wider">{review.relative_time_description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Google</span>
                </div>
              </div>

              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                  />
                ))}
              </div>

              <div className="relative">
                <p className="font-body text-sm text-text-muted leading-relaxed text-left line-clamp-4 flex-grow italic pr-4">
                  "{review.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <a
          href="https://www.google.com/maps/place/Sadguru+Car+Melo/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-primary text-primary font-heading font-bold hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-lg"
        >
          View All Reviews on Google
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </section>
  );
}
