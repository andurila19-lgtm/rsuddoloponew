import React, { useState, useEffect } from 'react';
import { Search, Calendar, Star, Loader2 } from 'lucide-react';
import { Doctor } from '../types';
import { api } from '../services/api';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('Semua');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.getDoctors();
        // If API returns empty (server off), use a fallback or show empty state
        if (data.length > 0) {
          setDoctors(data);
        } else {
          // Optional: Add some mock data here if you want a fallback when server is off
          // For now we assume server is meant to be on
        }
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = ['Semua', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'Semua' || doc.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Temukan Dokter Anda</h1>
          <p className="text-slate-600">Jadwal praktik dokter spesialis RSUD Dolopo.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-12 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama dokter atau spesialisasi..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex gap-2">
                {specialties.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setFilterSpecialty(spec)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      filterSpecialty === spec
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
          </div>
        ) : (
          /* Doctor Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="p-6 flex items-start gap-4">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 group-hover:border-primary-200 transition-colors"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
                    <p className="text-primary-600 text-sm font-medium mb-2">{doctor.specialty}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs text-slate-400 font-medium">4.9 (120 Review)</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-start gap-3 text-sm text-slate-600 mb-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-slate-400" />
                    <span>{doctor.schedule}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {doctor.available ? 'Tersedia Hari Ini' : 'Tidak Ada Jadwal'}
                    </span>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                      Buat Janji &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">
              {doctors.length === 0 
                ? "Gagal memuat data dokter. Pastikan server backend aktif."
                : "Tidak ditemukan dokter yang sesuai kriteria pencarian."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Doctors;