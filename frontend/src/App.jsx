import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CarProvider } from './context/CarContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

// ── Lazy Loaded Components (Core Performance Upgrade) ──
const Inventory = lazy(() => import('./pages/Inventory'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Contact = lazy(() => import('./pages/Contact'));
const CarDetails = lazy(() => import('./pages/CarDetails'));

const UnifiedLogin = lazy(() => import('./pages/Login'));

// Admin Panel Imports
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AddCar = lazy(() => import('./pages/admin/AddCar'));
const EditCar = lazy(() => import('./pages/admin/EditCar'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminAddLead = lazy(() => import('./pages/admin/AddLead'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminPosters = lazy(() => import('./pages/admin/Posters'));

// Sales Portal Imports
const SalesDashboard = lazy(() => import('./pages/sales/SalesDashboard'));
const AddLead = lazy(() => import('./pages/sales/AddLead'));
const EditLead = lazy(() => import('./pages/sales/EditLead'));

import MobileBottomNav from './components/MobileBottomNav';

// ── Loading Fallback Component ──
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p className="font-heading font-medium text-text-muted animate-pulse">Loading experience...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <CarProvider>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)' } }} />
          {/* This wrapper ensures the Footer is always pushed to the bottom 
        even if the page content is short.
      */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public Routes (Customer-Facing) ── */}
              <Route
                path="/*"
                element={
                  <div className="flex flex-col min-h-screen bg-background font-body text-text relative pb-24 md:pb-0">
                    <TopNavigation />

                    <MobileBottomNav />
                    <main className="flex-grow">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/car-details/:id" element={<CarDetails />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* ── Unified Login ── */}
              <Route path="/login" element={<UnifiedLogin />} />

              {/* ── Admin Routes ── */}
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
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
                <Route path="add-lead" element={<AdminAddLead />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="posters" element={<AdminPosters />} />
              </Route>

              {/* ── Sales Portal Routes ── */}
              <Route path="/sales/login" element={<Navigate to="/login" replace />} />
              <Route path="/sales" element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <SalesDashboard />
                </ProtectedRoute>
              } />
              <Route path="/sales/add-lead" element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <AddLead />
                </ProtectedRoute>
              } />
              <Route path="/sales/edit-lead/:id" element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <EditLead />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </CarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;