import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Services from './pages/Services';
import Contact from './pages/Contact';
import CarDetails from './pages/CarDetails';

// Unified Login
import UnifiedLogin from './pages/Login';

// Admin Panel Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AddCar from './pages/admin/AddCar';
import AdminInventory from './pages/admin/Inventory';
import AdminLeads from './pages/admin/Leads';
import AdminSettings from './pages/admin/Settings';

// Sales Portal Imports
import SalesLogin from './pages/sales/SalesLogin';
import SalesDashboard from './pages/sales/SalesDashboard';
import AddLead from './pages/sales/AddLead';

function App() {
  return (
    <BrowserRouter>
      {/* This wrapper ensures the Footer is always pushed to the bottom 
        even if the page content is short.
      */}
      <Routes>
        {/* ── Public Routes (Customer-Facing) ── */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen bg-background font-body text-text">
              <TopNavigation />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/car-details" element={<CarDetails />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* ── Unified Login ── */}
        <Route path="/login" element={<UnifiedLogin />} />

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── Sales Portal Routes ── */}
        <Route path="/sales/login" element={<SalesLogin />} />
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/sales/add-lead" element={<AddLead />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;