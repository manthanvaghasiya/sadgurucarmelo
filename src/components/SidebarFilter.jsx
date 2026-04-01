import { CarFront, Truck } from 'lucide-react';

export default function SidebarFilter() {
  return (
    <aside className="w-full bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="font-heading font-bold text-lg text-text">Advanced Filters</h2>
        <button className="text-primary font-body text-sm font-semibold hover:underline">Clear All</button>
      </div>

      {/* Budget Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Budget</h3>
        <div className="px-2 pt-2">
          {/* Mock Dual Slider */}
          <div className="relative h-1.5 bg-gray-200 rounded-full w-full">
            <div className="absolute left-[15%] right-[30%] h-full bg-primary rounded-full"></div>
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow cursor-pointer"></div>
            <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow cursor-pointer"></div>
          </div>
          <div className="flex justify-between items-center mt-3 font-body text-xs text-text font-medium">
            <span>₹2L</span>
            <span>₹20L</span>
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Brand</h3>
        <div className="flex flex-col gap-3 font-body text-sm text-text">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary" />
              <span className="group-hover:text-primary transition-colors font-medium">Maruti</span>
            </div>
            <span className="text-text-muted text-xs">24</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary" />
              <span className="group-hover:text-primary transition-colors font-medium">Hyundai</span>
            </div>
            <span className="text-text-muted text-xs">18</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary" />
              <span className="group-hover:text-primary transition-colors font-medium">Tata</span>
            </div>
            <span className="text-text-muted text-xs">12</span>
          </label>
        </div>
      </div>

      {/* Fuel Type Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Fuel Type</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="py-2.5 rounded-xl border border-gray-200 bg-surface text-text font-body text-xs font-medium hover:border-primary hover:text-primary transition-colors">
            Petrol
          </button>
          <button className="py-2.5 rounded-xl border border-gray-200 bg-surface text-text font-body text-xs font-medium hover:border-primary hover:text-primary transition-colors">
            Diesel
          </button>
          {/* Active state for CNG */}
          <button className="py-2.5 rounded-xl border gap-2 border-primary bg-primary/5 text-primary font-body text-xs font-bold transition-colors">
            CNG
          </button>
          <button className="py-2.5 rounded-xl border border-gray-200 bg-surface text-text font-body text-xs font-medium hover:border-primary hover:text-primary transition-colors">
            Electric
          </button>
        </div>
      </div>

      {/* Body Type Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Body Type</h3>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-transparent hover:bg-gray-50 text-text font-body text-sm font-medium transition-colors">
            <CarFront className="w-5 h-5 text-text-muted" strokeWidth={1.5} />
            Sedan
          </button>
          {/* Active state for SUV */}
          <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-primary/20 bg-primary/5 text-primary font-body text-sm font-bold transition-colors">
            <Truck className="w-5 h-5 text-primary" strokeWidth={2} />
            SUV
          </button>
        </div>
      </div>

    </aside>
  );
}
