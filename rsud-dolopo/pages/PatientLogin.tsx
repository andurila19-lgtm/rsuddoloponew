import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, UserCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const PatientLogin: React.FC = () => {
  const [nik, setNik] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Assuming api.loginPatient returns the list of registrations for this NIK
      const result = await api.loginPatient(nik);
      if (result.found) {
        localStorage.setItem('patientNik', nik);
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'NIK tidak ditemukan dalam database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative border border-slate-100">
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="bg-primary-50 p-4 rounded-full mb-4 ring-8 ring-primary-50/50">
            <UserCircle className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login Pasien</h1>
          <p className="text-slate-500 text-center mt-1">
            Masuk untuk melihat status pendaftaran dan riwayat pemeriksaan Anda.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Induk Kependudukan (NIK)</label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-slate-50 focus:bg-white text-lg tracking-wide font-mono placeholder:text-slate-400 placeholder:font-sans"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan 16 digit NIK"
              maxLength={16}
            />
            <p className="text-xs text-slate-400 mt-2 px-1">
              *Gunakan NIK yang terdaftar saat melakukan pendaftaran online.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || nik.length < 10}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk ke Area Pasien'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm">Belum pernah mendaftar?</p>
            <Link to="/" className="text-primary-600 font-semibold hover:text-primary-700 mt-1 inline-block">
                Kembali ke Beranda untuk Daftar
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;