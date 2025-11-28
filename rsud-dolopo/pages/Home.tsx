import React, { useState } from 'react';
import { ArrowRight, Clock, ShieldCheck, HeartPulse, Stethoscope, Activity, Users, Phone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';

const Home: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
            {/* Background Image with overlay */}
          <img 
            src="https://picsum.photos/seed/hospital/1920/1080" 
            alt="RSUD Dolopo" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/50 border border-primary-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                Layanan 24 Jam
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-green-300 animate-gradient-x bg-[length:200%_auto]">
              Kesehatan Anda Adalah Prioritas Utama Kami
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              RSUD Dolopo hadir dengan fasilitas canggih dan pelayanan prima. Kami berkomitmen memberikan perawatan medis terbaik untuk masyarakat dengan sentuhan teknologi modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:0351366096"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:-translate-y-1 ring-4 ring-red-600/20"
              >
                <Phone className="h-5 w-5 animate-pulse" />
                Panggil Ambulans
              </a>
              <button 
                onClick={() => setIsRegistrationOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 group"
              >
                Daftar Online
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <NavLink to="/doctors" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                Lihat Jadwal Dokter
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats / Features */}
      <section className="-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Clock, 
              title: "Layanan IGD 24/7", 
              desc: "Penanganan gawat darurat siap siaga setiap saat.",
              color: "bg-blue-600"
            },
            { 
              icon: ShieldCheck, 
              title: "Dokter Spesialis", 
              desc: "Ditangani langsung oleh tim medis berpengalaman.",
              color: "bg-accent-600"
            },
            { 
              icon: HeartPulse, 
              title: "Teknologi Modern", 
              desc: "Peralatan medis terkini untuk diagnosis akurat.",
              color: "bg-slate-800"
            },
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} rounded-2xl p-8 text-white shadow-xl transform hover:-translate-y-1 transition-transform duration-300`}>
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Layanan Unggulan</h2>
            <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai poliklinik dan layanan penunjang medis yang komprehensif untuk kebutuhan kesehatan keluarga Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Poli Umum', icon: Stethoscope },
              { name: 'Poli Anak', icon: Users },
              { name: 'Poli Jantung', icon: Activity },
              { name: 'Poli Gigi', icon: ShieldCheck }, // Using placeholder icons
              { name: 'Laboratorium', icon: Clock },
              { name: 'Radiologi', icon: HeartPulse },
              { name: 'Bedah', icon: Activity },
              { name: 'Farmasi', icon: ShieldCheck },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-100 transition-all text-center group cursor-pointer">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{service.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <NavLink to="/services" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-2 mx-auto">
              Lihat Seluruh Layanan <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />
    </div>
  );
};

export default Home;