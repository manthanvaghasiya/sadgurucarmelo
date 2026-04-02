import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CarProvider } from './context/CarContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import EditCar from './pages/admin/EditCar';
import AdminInventory from './pages/admin/Inventory';
import AdminLeads from './pages/admin/Leads';
import AdminMessages from './pages/admin/Messages';
import AdminSettings from './pages/admin/Settings';

// Sales Portal Imports
import SalesLogin from './pages/sales/SalesLogin';
import SalesDashboard from './pages/sales/SalesDashboard';
import AddLead from './pages/sales/AddLead';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <CarProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)' } }} />
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
                  <Route path="/car-details/:id" element={<CarDetails />} />
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
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="edit-car/:id" element={<EditCar />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── Sales Portal Routes ── */}
        <Route path="/sales/login" element={<SalesLogin />} />
        <Route path="/sales" element={
          <ProtectedRoute allowedRoles={['admin', 'salesman']}>
            <SalesDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales/add-lead" element={
          <ProtectedRoute allowedRoles={['admin', 'salesman']}>
            <AddLead />
          </ProtectedRoute>
        } />
      </Routes>
    </CarProvider>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;