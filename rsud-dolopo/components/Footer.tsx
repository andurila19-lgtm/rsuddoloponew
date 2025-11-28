import React from 'react';
import { Activity, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">RSUD DOLOPO</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Memberikan pelayanan kesehatan terbaik dengan fasilitas modern dan tenaga medis profesional untuk masyarakat Dolopo dan sekitarnya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Jadwal Dokter</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Fasilitas & Layanan</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Informasi Kamar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Jl. Raya Dolopo No. 123, Madiun</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>(0351) 123456 (IGD)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>info@rsuddolopo.id</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Berita Terbaru</h3>
            <p className="text-sm text-slate-400 mb-4">Dapatkan info kesehatan terkini.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="bg-slate-800 border-none text-sm px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors">
                Kirim
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} RSUD Dolopo. All rights reserved.</p>
          <Link to="/admin/login" className="flex items-center gap-1 hover:text-slate-300 transition-colors mt-2 md:mt-0 opacity-30 hover:opacity-100">
            <Lock className="h-3 w-3" />
            <span className="text-xs">Admin Panel</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;