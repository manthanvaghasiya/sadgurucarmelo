import SidebarFilter from '../components/SidebarFilter';
import InventoryGrid from '../components/InventoryGrid';
import PromoBanner from '../components/PromoBanner';

export default function Inventory() {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 font-body text-[13px] font-medium text-text-muted">
            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li><a href="#" className="hover:text-primary transition-colors">Surat</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li aria-current="page" className="text-text">Used Cars</li>
          </ol>
        </nav>

        {/* Page Header */}
        <h1 className="font-heading font-extrabold text-[36px] sm:text-[42px] text-primary leading-tight mb-10 tracking-tight">
          Explore 120+ Verified Pre-Owned Cars
        </h1>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar (Filters) - 1/4 Width Desktop */}
          <div className="w-full lg:w-1/4 shrink-0">
            <SidebarFilter />
          </div>

          {/* Right Area (Grid + Top Bar) - 3/4 Width Desktop */}
          <div className="w-full lg:w-3/4">
            <InventoryGrid />
          </div>
          
        </div>

        {/* Promotional Banner */}
        <PromoBanner />

      </div>
    </div>
  );
}
