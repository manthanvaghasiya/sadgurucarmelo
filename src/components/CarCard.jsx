import { Fuel, Gauge, User, Settings2, View } from 'lucide-react';

export default function CarCard({ car }) {
  // car data structure:
  // { image, title, price, transmission, fuel, ownership, km, status }

  return (
    <div className="bg-surface rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group/card">
      <div className="relative h-[220px] bg-gray-100 overflow-hidden">
        <img 
          src={car.image || "https://placehold.co/600x400/e2e8f0/64748b?text=Car+Image"} 
          alt={car.title} 
          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
        />
        {car.status && (
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-widest text-white shadow-md z-10 ${
            car.status === 'CERTIFIED' ? 'bg-[#10b981]' : 
            car.status === 'HOT DEAL' ? 'bg-[#f97316]' : 'bg-primary'
          }`}>
            {car.status}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <p className="font-heading font-extrabold text-[28px] text-accent leading-none mb-2">
            {car.price}
          </p>
          <h3 className="font-heading font-semibold text-[17px] text-text truncate" title={car.title}>
            {car.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[13px] text-text-muted mb-6 pb-6 border-b border-gray-100/60 mt-auto">
          <div className="flex items-center gap-2">
            <Settings2 className="w-[15px] h-[15px] text-gray-400 stroke-[2]" />
            <span className="font-body font-medium">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-[15px] h-[15px] text-gray-400 stroke-[2]" />
            <span className="font-body font-medium">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-[15px] h-[15px] text-gray-400 stroke-[2]" />
            <span className="font-body font-medium">{car.km}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-[15px] h-[15px] text-gray-400 stroke-[2]" />
            <span className="font-body font-medium">{car.ownership}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <button className="flex-1 flex items-center justify-center gap-1.5 font-body font-semibold text-[13px] py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 transition-colors">
            <View className="w-4 h-4 stroke-[2]" />
            View 360°
          </button>
          <button className="flex-[1.2] flex items-center justify-center gap-1.5 font-body font-semibold text-[13px] py-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-md">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 0C5.385 0 .004 5.38 .004 12.025c0 2.126.55 4.195 1.594 6.01L0 24l6.113-1.602a12.035 12.035 0 005.918 1.543h.005c6.643 0 12.028-5.385 12.028-12.025C24.062 5.378 18.675 0 12.031 0zm0 21.964c-1.802 0-3.567-.483-5.114-1.4l-.367-.217-3.804.997 1.015-3.708-.238-.378c-1-1.59-1.53-3.428-1.53-5.328 0-5.54 4.51-10.057 10.052-10.057 5.54 0 10.056 4.516 10.056 10.056.002 5.54-4.507 10.055-10.048 10.055h-.022zm5.518-7.536c-.303-.152-1.792-.885-2.072-.986-.28-.101-.484-.152-.687.152-.204.303-.783.985-.961 1.189-.177.202-.355.228-.658.076-1.605-.815-2.864-1.879-3.957-3.414-.112-.158.112-.132.41-.726.076-.152.038-.285-.038-.436-.076-.152-.686-1.655-.941-2.264-.247-.59-.498-.51-.687-.52H7.5c-.203 0-.532.076-.811.38C6.409 6.273 5.545 7.085 5.545 8.73c0 1.646.888 3.242 1.015 3.419.127.177 2.316 3.655 5.679 4.972 2.37.934 3.256.784 3.864.654.764-.163 1.792-.733 2.046-1.442.253-.709.253-1.318.177-1.444-.076-.126-.28-.202-.583-.353z"/>
            </svg>
            Chat Now
          </button>
        </div>
      </div>
    </div>
  );
}
