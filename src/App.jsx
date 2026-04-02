import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Services from './pages/Services';
import Contact from './pages/Contact';
import CarDetails from './pages/CarDetails';

// Admin Panel Imports
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AddCar from './pages/admin/AddCar';

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

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="leads" element={<Dashboard />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;