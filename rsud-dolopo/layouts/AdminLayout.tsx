import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Activity,
  CreditCard,
  UserCog,
  ExternalLink,
  Menu,
  X,
  BedDouble,
  Receipt,
  Landmark
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-primary-900">RSUD ADMIN</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 md:hidden">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink 
          to="/admin/dashboard" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/admin/doctors" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <Users className="h-5 w-5" />
          Kelola Dokter
        </NavLink>

        <NavLink 
          to="/admin/registrations" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <FileText className="h-5 w-5" />
          Data Pendaftaran
        </NavLink>

        <NavLink 
          to="/admin/messages" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <MessageSquare className="h-5 w-5" />
          Pesan Masuk
        </NavLink>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fasilitas & Kamar</span>
        </div>

        <NavLink 
          to="/admin/facilities" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <Receipt className="h-5 w-5" />
          Tarif Fasilitas
        </NavLink>

        <NavLink 
          to="/admin/rooms" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <BedDouble className="h-5 w-5" />
          Ketersediaan Kamar
        </NavLink>

        <NavLink 
          to="/admin/banks" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <Landmark className="h-5 w-5" />
          Rekening & VA
        </NavLink>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Database</span>
        </div>

        <NavLink 
          to="/admin/users" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <UserCog className="h-5 w-5" />
          Manajemen User
        </NavLink>

        <NavLink 
          to="/admin/bpjs" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`
          }
        >
          <CreditCard className="h-5 w-5" />
          Data BPJS
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link 
          to="/"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
        >
          <ExternalLink className="h-5 w-5" />
          Lihat Website
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Desktop Sidebar */}
      <div className="w-64 hidden md:flex flex-col flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 p-4 md:hidden flex justify-between items-center sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-slate-800 text-lg">Admin Panel</span>
          </div>
          <div className="flex gap-2">
             <Link to="/" className="flex items-center justify-center p-2 text-emerald-600 bg-emerald-50 rounded-lg">
                <ExternalLink className="h-5 w-5" />
             </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;