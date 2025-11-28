import React, { useState } from 'react';
import { X, FileText, User, Phone, Calendar, CreditCard, Loader2, CheckCircle, AlertCircle, Banknote, Landmark, Mail, Info } from 'lucide-react';
import { api } from '../services/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [nikStatus, setNikStatus] = useState<string>(''); // 'registered' | ''
  
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    phone: '',
    poli: '',
    date: '',
    payment: 'umum',
    payment_detail: 'Tunai'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Reset status when user starts typing again
    if (e.target.name === 'nik' && nikStatus) {
        setNikStatus('');
    }
    // Clear error message when user types
    if (errorMsg) setErrorMsg('');
  };

  const handleNikBlur = async () => {
    if (formData.nik.length >= 10) {
        try {
            const isRegistered = await api.checkNik(formData.nik);
            if (isRegistered) {
                setNikStatus('registered');
            } else {
                setNikStatus('');
            }
        } catch (error) {
            console.error("Error checking NIK");
        }
    }
  };

  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      if (typeof e.currentTarget.showPicker === 'function') {
        e.currentTarget.showPicker();
      }
    } catch (error) {
      console.log('Date picker trigger not supported');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validasi Field Kosong
    if (!formData.nik) {
      setErrorMsg('NIK wajib diisi.');
      return;
    }
    if (!formData.name) {
      setErrorMsg('Nama Lengkap wajib diisi.');
      return;
    }

    // Validasi Email
    if (!formData.email) {
        setErrorMsg('Email wajib diisi untuk pengiriman notifikasi.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setErrorMsg('Format email tidak valid (contoh: nama@domain.com).');
        return;
    }

    // Validasi WhatsApp
    if (!formData.phone) {
        setErrorMsg('Nomor WhatsApp wajib diisi untuk konfirmasi.');
        return;
    }
    // Minimal 9 digit, maksimal 15, angka saja
    const phoneRegex = /^[0-9]{9,15}$/;
    if (!phoneRegex.test(formData.phone)) {
        setErrorMsg('Nomor WhatsApp harus berupa angka valid (9-15 digit).');
        return;
    }

    if (!formData.poli) {
      setErrorMsg('Silakan pilih Poliklinik.');
      return;
    }
    if (!formData.date) {
      setErrorMsg('Tanggal periksa wajib diisi.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await api.registerPatient(formData);
      
      setBookingCode(result.data.bookingCode || `REG-${Math.floor(Math.random() * 10000)}`);
      setIsSuccess(true);
      
      // Reset form but keep success message for a bit longer or wait for user to close
    } catch (error) {
      setErrorMsg('Gagal melakukan pendaftaran. Pastikan server aktif atau coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setNikStatus('');
    setFormData({ nik: '', name: '', email: '', phone: '', poli: '', date: '', payment: 'umum', payment_detail: 'Tunai' });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary-600 px-6 py-4 flex justify-between items-center text-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pendaftaran Online
            </h2>
            <p className="text-primary-100 text-xs mt-0.5">Isi data diri untuk mendapatkan nomor antrian</p>
          </div>
          <button 
            onClick={handleClose} 
            className="hover:bg-primary-700 p-1.5 rounded-full transition-colors text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-slate-600 mb-6 max-w-xs mx-auto">
                Nomor antrian dan detail jadwal telah dikirimkan ke Email dan WhatsApp Anda.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 w-full mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Kode Booking</p>
                <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest">{bookingCode}</p>
                <p className="text-sm mt-2 text-slate-500 font-medium">Metode: {formData.payment === 'bpjs' ? 'BPJS' : formData.payment_detail}</p>
              </div>
              <button 
                onClick={handleClose}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Selesai
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    onBlur={handleNikBlur}
                    className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white" 
                    placeholder="3502xxxxxxxxxxxx" 
                  />
                </div>
                {nikStatus === 'registered' && (
                    <div className="text-xs text-amber-600 mt-1.5 flex items-start gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-top-1">
                        <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        <span>Info: NIK ini sudah terdaftar sebelumnya. Anda dapat melanjutkan pendaftaran baru.</span>
                    </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white" 
                    placeholder="Sesuai KTP" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white ${errorMsg.includes('Email') ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}
                        placeholder="email@contoh.com" 
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. WhatsApp <span className="text-red-500">*</span></label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white ${errorMsg.includes('WhatsApp') ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}
                        placeholder="08xxxxxxxxxx" 
                    />
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Poliklinik</label>
                  <select 
                    name="poli"
                    value={formData.poli}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                  >
                    <option value="">Pilih Poli</option>
                    <option value="umum">Poli Umum</option>
                    <option value="anak">Poli Anak</option>
                    <option value="dalam">Penyakit Dalam</option>
                    <option value="gigi">Poli Gigi</option>
                    <option value="bedah">Poli Bedah</option>
                    <option value="mata">Poli Mata</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Periksa</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onClick={handleDateClick}
                      className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white cursor-pointer" 
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Pembayaran</label>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${formData.payment === 'umum' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="umum"
                      checked={formData.payment === 'umum'}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500" 
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-900">Umum</span>
                      <span className="text-xs text-slate-500">Bayar Mandiri</span>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${formData.payment === 'bpjs' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bpjs"
                      checked={formData.payment === 'bpjs'}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500" 
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-900">BPJS</span>
                      <span className="text-xs text-slate-500">Kesehatan</span>
                    </div>
                  </label>
                </div>

                {formData.payment === 'umum' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Pilih Metode Bayar</label>
                    <div className="grid grid-cols-3 gap-2">
                       <button
                         type="button"
                         onClick={() => setFormData({...formData, payment_detail: 'Tunai'})}
                         className={`p-2 rounded-lg border text-sm flex flex-col items-center justify-center gap-1 transition-all ${formData.payment_detail === 'Tunai' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                         <Banknote className="h-4 w-4" />
                         Tunai
                       </button>
                       <button
                         type="button"
                         onClick={() => setFormData({...formData, payment_detail: 'Transfer'})}
                         className={`p-2 rounded-lg border text-sm flex flex-col items-center justify-center gap-1 transition-all ${formData.payment_detail === 'Transfer' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                         <Landmark className="h-4 w-4" />
                         Transfer
                       </button>
                       <button
                         type="button"
                         onClick={() => setFormData({...formData, payment_detail: 'VA'})}
                         className={`p-2 rounded-lg border text-sm flex flex-col items-center justify-center gap-1 transition-all ${formData.payment_detail === 'VA' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                         <CreditCard className="h-4 w-4" />
                         Virtual Account
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang
                      <CreditCard className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;