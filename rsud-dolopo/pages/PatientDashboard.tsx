import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, CheckCircle, Clock, Calendar, Stethoscope, CreditCard, RefreshCw, X, Copy, Banknote, Landmark, Upload, Image as ImageIcon, Send, BedDouble, Trash2, Edit } from 'lucide-react';
import { api, BankAccount } from '../services/api';

const PatientDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [patientName, setPatientName] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'Tunai', 'Transfer', 'VA'
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [isSavingMethod, setIsSavingMethod] = useState(false);
  
  // Data State
  const [availableBanks, setAvailableBanks] = useState<BankAccount[]>([]);
  
  // Payment Proof Upload State
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    const nik = localStorage.getItem('patientNik');
    if (!nik) return;

    try {
      const result = await api.loginPatient(nik);
      if (result.found) {
          const sorted = result.data.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setRegistrations(sorted);
          setLastUpdated(new Date());
          
          if (sorted.length > 0) {
              setPatientName(sorted[0].name);
          }
      }
    } catch (error) {
      console.log("Sync error");
    }
  };

  const fetchBanks = async () => {
      try {
          const banks = await api.getBanks();
          setAvailableBanks(banks);
      } catch (error) {
          console.error("Failed to load banks");
      }
  }

  useEffect(() => {
    const nik = localStorage.getItem('patientNik');
    if (!nik) {
      navigate('/patient/login');
      return;
    }
    fetchData();
    fetchBanks();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('patientNik');
    navigate('/patient/login');
  };

  const openPaymentModal = (reg: any) => {
      setSelectedReg(reg);
      
      // Determine base method for UI selection
      // Logic: If detail is exactly "VA" -> VA
      // If detail is "Tunai" -> Tunai
      // If detail matches a bank name -> Transfer
      let method = 'Tunai';
      const detail = (reg.payment_detail || '').toLowerCase();
      
      if (detail === 'va' || detail.includes('virtual')) {
          method = 'VA';
      } else if (detail === 'tunai') {
          method = 'Tunai';
      } else {
          // Asumsi jika bukan Tunai dan bukan VA, maka Transfer (nama Bank)
          method = 'Transfer';
      }
      
      setPaymentMethod(method);
      setSelectedBankId(null); // Reset selection
      setProofFile(null); // Reset file
      setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
      setIsPaymentModalOpen(false);
      setSelectedReg(null);
      setProofFile(null);
  };

  const determineFinalDetail = () => {
      let finalDetail = paymentMethod;
      
      if (paymentMethod === 'Transfer' && selectedBankId) {
          const bank = availableBanks.find(b => b.id === selectedBankId);
          if (bank) {
              finalDetail = bank.bank_name; // Simpan "BCA", "BRI", dll
          }
      } else if (paymentMethod === 'VA') {
          finalDetail = 'VA'; // Simpan "VA"
      } else if (paymentMethod === 'Tunai') {
          finalDetail = 'Tunai';
      }
      return finalDetail;
  };

  const handleUpdatePaymentMethod = async () => {
      if (!selectedReg) return;
      setIsSavingMethod(true);
      try {
          const finalDetail = determineFinalDetail();

          await api.updateRegistration(selectedReg.id, selectedReg.status, selectedReg.payment_status, selectedReg.cost, finalDetail);
          
          // Update local state to reflect change immediately
          setSelectedReg({ ...selectedReg, payment_detail: finalDetail });
          
          await fetchData();
          alert("Metode pembayaran berhasil diubah!");
      } catch (error) {
          alert("Gagal mengubah metode pembayaran");
      } finally {
          setIsSavingMethod(false);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('payment-proof-input')?.click();
  };

  const handleUploadProof = async () => {
    if (!selectedReg || !proofFile) return;
    setIsUploading(true);
    try {
        const isUpdate = selectedReg.payment_status === 'Paid';
        
        // Update detail if user selected a bank before uploading
        let finalDetail = selectedReg.payment_detail;
        
        // Only update detail if the user explicitly selected a bank/method in the UI
        if (selectedBankId || (paymentMethod !== 'Transfer' && paymentMethod !== 'VA')) {
             finalDetail = determineFinalDetail();
        }

        // Upload proof AND set status to 'Paid' immediately to trigger the gradient UI
        await api.updateRegistration(
            selectedReg.id, 
            selectedReg.status, 
            'Paid', // Force status to Paid
            selectedReg.cost, 
            finalDetail,
            proofFile
        );
        
        // Refresh local data immediately
        if (selectedReg) {
            setSelectedReg({ ...selectedReg, payment_proof: proofFile, payment_status: 'Paid', payment_detail: finalDetail });
        }
        
        await fetchData();
        // Close modal after success to show the dashboard change
        setTimeout(() => {
            alert(isUpdate ? "Bukti pembayaran berhasil diperbarui!" : "Pembayaran Berhasil! Status telah diperbarui.");
            closePaymentModal();
        }, 500);
        
    } catch (error) {
        alert("Gagal mengunggah bukti pembayaran.");
    } finally {
        setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Nomor berhasil disalin!");
  };

  const getPaymentInfo = () => {
      if (selectedBankId) {
          const bank = availableBanks.find(b => b.id === Number(selectedBankId));
          if (bank) {
              return {
                  bank: bank.bank_name,
                  number: bank.account_number,
                  name: bank.account_name,
                  desc: bank.type === 'VA' ? 'Virtual Account' : 'Transfer Manual'
              };
          }
      }

      // Fallback or default if nothing selected yet but type matches (shows first available or default text)
      if (paymentMethod === 'Transfer') {
          return null; // Force selection
      } else if (paymentMethod === 'VA') {
          return null; // Force selection
      }
      return null;
  };

  const getFacilityDisplay = (classType: string | null | undefined) => {
    if (!classType) return "Umum";
    const lower = classType.toLowerCase();
    if (lower.includes('vip')) return "VIP";
    if (lower.includes('kelas 1')) return "1";
    if (lower.includes('kelas 2')) return "2";
    if (lower.includes('kelas 3')) return "3";
    return "Umum";
  };

  const paymentInfo = getPaymentInfo();
  
  // Filter banks based on payment method
  const filteredBanks = availableBanks.filter(b => b.is_active && b.type === paymentMethod);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Pasien */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-lg text-slate-900 block leading-none">Area Pasien</span>
                        <span className="text-xs text-slate-500">RSUD Dolopo</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-slate-600 text-sm font-medium">Halo, {patientName}</span>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live Update
                        </span>
                     </div>
                     <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                     >
                        <LogOut className="h-4 w-4" />
                        Logout
                     </button>
                </div>
            </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Status Pendaftaran Saya</h1>
                <p className="text-slate-500">Pantau status pendaftaran, pembayaran, dan jadwal Anda secara real-time.</p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Updated: {lastUpdated.toLocaleTimeString()}
            </div>
        </div>

        <div className="space-y-6">
            {registrations.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-slate-500">Belum ada riwayat pendaftaran.</p>
                </div>
            ) : (
                registrations.map((reg, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                                
                                {/* Info Utama */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Didaftar pada: {new Date(reg.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm border border-primary-100 font-mono">
                                            {reg.bookingCode || 'NO-CODE'}
                                        </span>
                                    </h2>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <Stethoscope className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Pilihan Fasilitas</p>
                                            <p className="font-semibold text-slate-800 capitalize">Poli {reg.poli}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                            <BedDouble className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Kelas Rawat</p>
                                            <p className="font-semibold text-slate-800">{getFacilityDisplay(reg.class_type)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Jadwal Periksa</p>
                                            <p className="font-semibold text-slate-800">{reg.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Pembayaran & Pembayaran */}
                                <div className="flex flex-col gap-4 min-w-[220px]">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors duration-300">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">Status Pembayaran</p>
                                        
                                        {(reg.payment_status === 'Paid' || reg.payment === 'bpjs') ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="w-full bg-gradient-to-r from-blue-500 to-green-500 animate-gradient-x bg-[length:200%_auto] text-white p-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                                                    <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-bold text-sm tracking-wide">SUDAH BAYAR</span>
                                                </div>
                                                {/* Tombol Lihat Bukti untuk Paid Status */}
                                                {reg.payment_proof && (
                                                    <button 
                                                        onClick={() => openPaymentModal(reg)}
                                                        className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-primary-600 bg-primary-50 rounded-lg border border-primary-100 hover:bg-primary-100 transition-colors"
                                                    >
                                                        <ImageIcon className="h-3 w-3" />
                                                        Lihat Bukti Pembayaran
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between text-red-700 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                                    <span className="font-bold text-sm">Belum Lunas</span>
                                                    <span className="text-[10px] bg-red-100 px-2 py-0.5 rounded uppercase tracking-wide">Tagihan</span>
                                                </div>
                                                
                                                {/* Tombol Bayar jika Umum dan Cost > 0 */}
                                                {reg.payment === 'umum' && reg.cost > 0 && (
                                                    <button 
                                                        onClick={() => openPaymentModal(reg)}
                                                        className="w-full bg-primary-600 text-white text-sm py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center justify-center gap-1.5"
                                                    >
                                                        <CreditCard className="h-3.5 w-3.5" />
                                                        Bayar Tagihan
                                                    </button>
                                                )}
                                                
                                                {/* Pesan jika biaya belum keluar */}
                                                {reg.payment === 'umum' && (!reg.cost || reg.cost === 0) && (
                                                    <p className="text-xs text-slate-400 italic text-center">Menunggu rincian biaya...</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 text-sm text-slate-600 flex items-center gap-2 border-t border-slate-200 pt-2">
                                            <CreditCard className="h-4 w-4 text-slate-400" />
                                            Metode: <span className="font-medium">{reg.payment === 'bpjs' ? 'BPJS' : (reg.payment_detail || 'Tunai')}</span>
                                        </div>
                                        {reg.cost > 0 && (
                                            <div className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                                                 <span className="ml-6 font-bold text-slate-800">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(reg.cost)}
                                                 </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Pendaftaran Badge */}
                                    <div className="text-center">
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-all duration-300 ${
                                            reg.status === 'Confirmed' ? 'bg-green-500 text-white ring-4 ring-green-100' :
                                            reg.status === 'Pending' ? 'bg-amber-400 text-white ring-4 ring-amber-100' :
                                            reg.status === 'Cancelled' ? 'bg-red-500 text-white' :
                                            'bg-slate-400 text-white'
                                        }`}>
                                            {reg.status === 'Confirmed' ? 'Disetujui' : 
                                             reg.status === 'Pending' ? 'Menunggu Konfirmasi' : 
                                             reg.status}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Footer Card */}
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                            <span>Pasien: {reg.name}</span>
                            <span>NIK: {reg.nik}</span>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && selectedReg && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closePaymentModal}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-green-400" />
                            <h3 className="font-bold text-lg">
                                {selectedReg.payment_status === 'Paid' ? 'Rincian Pembayaran' : 'Pembayaran Tagihan'}
                            </h3>
                        </div>
                        <button onClick={closePaymentModal} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
                    </div>
                    
                    <div className="p-6">
                        {/* Amount */}
                        <div className="text-center mb-6">
                            <p className="text-slate-500 text-sm mb-1">Total Tagihan</p>
                            <h2 className="text-3xl font-bold text-slate-900">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedReg.cost)}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">{selectedReg.bookingCode}</p>
                            
                            {selectedReg.payment_status === 'Paid' && (
                                <div className="mt-4 w-full border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-bold mb-4">
                                        LUNAS
                                    </div>
                                    
                                    {/* Updated Section: Payment Success Detail */}
                                    <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                                        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Informasi Pembayaran Berhasil</p>
                                        <div className="flex flex-col items-center justify-center gap-1 font-bold text-slate-800 text-lg">
                                            <div className="flex items-center gap-2">
                                                {selectedReg.payment_detail.toLowerCase().includes('tunai') ? (
                                                    <Banknote className="h-5 w-5 text-green-600"/>
                                                ) : (
                                                    <Landmark className="h-5 w-5 text-green-600"/>
                                                )}
                                                {/* Tampilkan Nama Bank (BCA/BRI) atau VA atau Tunai */}
                                                <span>{selectedReg.payment_detail}</span>
                                            </div>
                                        </div>
                                        {(selectedReg.payment_detail !== 'Tunai') && (
                                            <p className="text-xs text-slate-400 mt-2 italic">
                                                Bank RSUD Dolopo
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method Selector (Only show if not paid yet) */}
                        {selectedReg.payment_status !== 'Paid' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Metode Pembayaran</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        onClick={() => { setPaymentMethod('Tunai'); setSelectedBankId(null); }}
                                        className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Tunai' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <Banknote className="h-5 w-5" />
                                        Tunai
                                    </button>
                                    <button 
                                        onClick={() => { setPaymentMethod('Transfer'); setSelectedBankId(null); }}
                                        className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Transfer' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <Landmark className="h-5 w-5" />
                                        Transfer
                                    </button>
                                    <button 
                                        onClick={() => { setPaymentMethod('VA'); setSelectedBankId(null); }}
                                        className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${paymentMethod === 'VA' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        VA (Auto)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Bank Selection */}
                        {(paymentMethod === 'Transfer' || paymentMethod === 'VA') && selectedReg.payment_status !== 'Paid' && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pilih {paymentMethod === 'VA' ? 'Virtual Account' : 'Rekening Tujuan'}
                                </label>
                                <div className="space-y-2">
                                    {filteredBanks.length > 0 ? (
                                        filteredBanks.map(bank => (
                                            <div 
                                                key={bank.id}
                                                onClick={() => setSelectedBankId(bank.id)}
                                                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${selectedBankId === bank.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-primary-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-1.5 rounded border border-slate-100">
                                                        <Landmark className="h-5 w-5 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{bank.bank_name}</p>
                                                        <p className="text-xs text-slate-500">a.n {bank.account_name}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBankId === bank.id ? 'border-primary-500 bg-primary-500' : 'border-slate-300'}`}>
                                                    {selectedBankId === bank.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic p-2 bg-slate-50 rounded text-center">Tidak ada rekening tersedia untuk metode ini.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment Details & Actions */}
                        {paymentMethod === 'Tunai' && selectedReg.payment_status !== 'Paid' && (
                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
                                Silakan melakukan pembayaran langsung di <strong>Kasir RSUD Dolopo</strong> dengan menunjukkan kode booking <strong>{selectedReg.bookingCode}</strong>.
                             </div>
                        )}

                        {(paymentMethod === 'Transfer' || paymentMethod === 'VA') && (
                            <>
                                {paymentInfo ? (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 relative group animate-in zoom-in duration-200">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-3">{paymentInfo.bank}</p>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-mono text-2xl font-bold text-slate-800 tracking-wider">{paymentInfo.number}</span>
                                            <button 
                                                onClick={() => copyToClipboard(paymentInfo.number)}
                                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-primary-600 transition-colors"
                                                title="Salin Nomor"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-600">a.n {paymentInfo.name}</p>
                                        
                                        <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
                                            {paymentMethod === 'Transfer' 
                                                ? 'Mohon upload bukti transfer melalui form dibawah ini.'
                                                : 'Pembayaran akan terverifikasi otomatis dalam 10-15 menit.'}
                                        </div>
                                    </div>
                                ) : (
                                    (paymentMethod === 'Transfer' || paymentMethod === 'VA') && selectedReg.payment_status !== 'Paid' && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-6 text-center text-slate-500 italic text-sm">
                                            Silakan pilih rekening tujuan di atas untuk melihat detail pembayaran.
                                        </div>
                                    )
                                )}
                                
                                {/* Upload Proof Section for Transfer/VA */}
                                {((paymentMethod === 'Transfer' || paymentMethod === 'VA') && paymentInfo) || selectedReg.payment_status === 'Paid' ? (
                                    <div className="mb-6 border-t border-slate-100 pt-4">
                                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Konfirmasi Pembayaran
                                        </h4>

                                        {/* Input File (Hidden) */}
                                        <input 
                                            type="file" 
                                            id="payment-proof-input" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        
                                        {selectedReg.payment_proof || proofFile ? (
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-green-800">Bukti Terlampir</p>
                                                        <p className="text-xs text-green-600">
                                                            {selectedReg.payment_status === 'Paid' ? 'Pembayaran telah diverifikasi' : 'Siap dikirim'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* Preview Image */}
                                                <div className="relative rounded-lg overflow-hidden border border-green-100 h-32 w-full bg-slate-100 flex items-center justify-center group mb-3">
                                                    <img 
                                                        src={proofFile || selectedReg.payment_proof} 
                                                        alt="Bukti Transfer" 
                                                        className="h-full w-full object-contain cursor-pointer"
                                                        onClick={() => window.open(proofFile || selectedReg.payment_proof, '_blank')}
                                                    />
                                                </div>
                                                
                                                {/* Action Buttons in Preview Mode - Always visible to allow corrections */}
                                                <div className="flex gap-2">
                                                    {/* Change File Button */}
                                                    <button 
                                                        type="button"
                                                        onClick={triggerFileInput}
                                                        disabled={isUploading}
                                                        className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        {selectedReg.payment_status === 'Paid' ? 'Ubah Bukti' : 'Ganti File'}
                                                    </button>
                                                    
                                                    {/* Submit Button */}
                                                    <button 
                                                        type="button"
                                                        onClick={handleUploadProof}
                                                        disabled={isUploading}
                                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                        {selectedReg.payment_status === 'Paid' ? 'Simpan Perubahan' : 'Kirim Bukti'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {/* Only allow upload if not paid (initial state) */}
                                                {selectedReg.payment_status !== 'Paid' && (
                                                    <div className="relative">
                                                        <label 
                                                            htmlFor="payment-proof-input" 
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all group"
                                                        >
                                                            <div className="bg-slate-100 p-3 rounded-full mb-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                                <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-primary-500" />
                                                            </div>
                                                            <span className="text-sm text-slate-500 font-medium group-hover:text-primary-600">Klik untuk upload bukti</span>
                                                            <span className="text-xs text-slate-400 mt-1">Format: JPG, PNG</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </>
                        )}

                        <div className="space-y-3">
                            {/* Update Method Button if method changed (only if no proof exists yet AND not paid) */}
                            {paymentMethod !== selectedReg.payment_detail && !proofFile && selectedReg.payment_status !== 'Paid' && (
                                <button 
                                    onClick={handleUpdatePaymentMethod}
                                    disabled={isSavingMethod}
                                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSavingMethod ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                    Simpan Perubahan Metode
                                </button>
                            )}

                            <button 
                                onClick={closePaymentModal}
                                className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default PatientDashboard;