import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatBot from './components/AIChatBot';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import ManageMessages from './pages/admin/ManageMessages';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBPJS from './pages/admin/ManageBPJS';
import ManageFacilities from './pages/admin/ManageFacilities';
import ManageRooms from './pages/admin/ManageRooms';
import ManageBanks from './pages/admin/ManageBanks';

// Patient Imports
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for Public Pages (Navbar + Footer)
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <AIChatBot />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="registrations" element={<ManageRegistrations />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bpjs" element={<ManageBPJS />} />
          <Route path="facilities" element={<ManageFacilities />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="banks" element={<ManageBanks />} />
        </Route>

        {/* Patient Routes */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        {/* Public Routes (Wildcard to catch everything else) */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
};

export default App;