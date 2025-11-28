import React, { useState } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Menu, X, Activity, UserCircle } from 'lucide-react';
import { NavLink } from '../types';
import RegistrationModal from './RegistrationModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: NavLink.HOME },
    { name: 'Jadwal Dokter', path: NavLink.DOCTORS },
    { name: 'Layanan', path: NavLink.SERVICES },
    { name: 'Kontak', path: NavLink.CONTACT },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-slate-900 leading-none">RSUD DOLOPO</span>
                  <span className="text-xs text-slate-500 tracking-wider">HEALTHCARE</span>
                </div>
              </RouterLink>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <RouterLink
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </RouterLink>
              ))}
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <RouterLink 
                    to="/patient/login"
                    className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors"
                  >
                    <UserCircle className="h-5 w-5" />
                    Cek Status
                  </RouterLink>
                  <button 
                    onClick={() => setIsRegistrationOpen(true)}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 active:scale-95"
                  >
                    Daftar Online
                  </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-5 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <RouterLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </RouterLink>
              ))}
              <RouterLink 
                 to="/patient/login"
                 onClick={() => setIsOpen(false)}
                 className="flex items-center gap-2 px-3 py-3 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              >
                 <UserCircle className="h-5 w-5" />
                 Area Pasien / Cek Status
              </RouterLink>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsRegistrationOpen(true);
                }}
                className="w-full mt-4 bg-primary-600 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-primary-700 active:scale-95 transition-all shadow-md"
              >
                Daftar Online
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Registration Modal Component */}
      <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />
    </>
  );
};

export default Navbar;