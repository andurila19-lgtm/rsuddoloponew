import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Edit, Plus, FileText, User, Phone, Calendar, Mail, RefreshCcw, Image, X } from 'lucide-react';

const ManageRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [cost, setCost] = useState<string>('');
  const [classType, setClassType] = useState<string>('');
  const [facilityNotes, setFacilityNotes] = useState<string>('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Modal State for New Registration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    phone: '',
    poli: 'umum',
    date: '',
    payment: 'umum',
    payment_detail: 'Tunai'
  });

  // Proof Modal State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Email Simulation State
  const [emailSent, setEmailSent] = useState<{show: boolean, email: string, msg: string}>({ show: false, email: '', msg: '' });

  const fetchRegs = async () => {
    const data = await api.getRegistrations();
    // Sort by created_at descending
    data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRegistrations(data);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    fetchRegs();
    // Real-time polling every 5 seconds
    const interval = setInterval(fetchRegs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (reg: any) => {
    setEditingId(reg.id);
    setStatus(reg.status || 'Pending');
    setPaymentStatus(reg.payment_status || 'Unpaid');
    setCost(reg.cost ? reg.cost.toString() : '0');
    setClassType(reg.class_type || '');
    setFacilityNotes(reg.facility_notes || '');
  };

  const handleSave = async (id: number, regData: any) => {
    const numericCost = parseInt(cost) || 0;
    // Update all fields including class and facility
    await api.updateRegistration(id, status, paymentStatus, numericCost, undefined, undefined, classType, facilityNotes);
    
    // Simulate Sending Email Logic if Confirmed
    if (status === 'Confirmed') {
        let message = '';
        const priceFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numericCost);
        
        if (regData.payment === 'umum') {
             if (numericCost > 0) {
                if (regData.payment_detail === 'Transfer') {
                    message = `Halo ${regData.name}, pendaftaran Poli ${regData.poli} DITERIMA. Biaya: ${priceFormatted}. Silakan transfer ke BCA 1234567890 a.n RSUD Dolopo.`;
                } else if (regData.payment_detail === 'VA') {
                    message = `Halo ${regData.name}, pendaftaran Poli ${regData.poli} DITERIMA. Biaya: ${priceFormatted}. Silakan transfer ke Virtual Account Mandiri 88000${id} a.n RSUD Dolopo.`;
                } else {
                    message = `Halo ${regData.name}, pendaftaran Poli ${regData.poli} DITERIMA. Biaya: ${priceFormatted}. Silakan bayar di kasir saat kedatangan.`;
                }
             } else {
                 message = `Halo ${regData.name}, pendaftaran Poli ${regData.poli} DITERIMA. Menunggu penetapan biaya dokter.`;
             }
        } else {
             message = `Halo ${regData.name}, pendaftaran Poli ${regData.poli} menggunakan BPJS DITERIMA. Silakan datang sesuai jadwal.`;
        }

        // Trigger Email Simulation Alert
        setEmailSent({ show: true, email: regData.email || 'Email tidak tersedia', msg: message });
        
        // Auto hide after 5 seconds
        setTimeout(() => setEmailSent({ show: false, email: '', msg: '' }), 6000);
    }

    setEditingId(null);
    fetchRegs(); // Refresh immediately after save
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.registerPatient(formData);
        setIsModalOpen(false);
        setFormData({ nik: '', name: '', email: '', phone: '', poli: 'umum', date: '', payment: 'umum', payment_detail: 'Tunai' });
        fetchRegs();
        alert('Pendaftaran berhasil ditambahkan!');
    } catch (error) {
        alert('Gagal menambahkan data.');
    }
  };

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="relative">
      {/* Email Notification Banner */}
      {emailSent.show && (
        <div className="fixed top-4 right-4 z-[60] bg-blue-600 text-white p-4 rounded-xl shadow-2xl animate-in slide-in-from-right max-w-sm border border-blue-500">
            <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm mb-1">Email Notifikasi Terkirim!</h4>
                    <p className="text-xs opacity-90 mb-2">Ke: {emailSent.email}</p>
                    <div className="bg-blue-700/50 p-2 rounded-lg text-xs italic">
                        "{emailSent.msg}"
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Data Pendaftaran Pasien
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                <RefreshCcw className="h-3 w-3" />
                Real-time Sync (Last: {lastRefreshed.toLocaleTimeString()})
            </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Pendaftaran
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Pasien</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Poli</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kelas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Fasilitas / Tindakan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Metode Bayar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Biaya</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status Bayar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status Daftar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors animate-in fade-in duration-300">
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(reg.created_at).toLocaleDateString()}
                    <div className="text-xs text-slate-400">{reg.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{reg.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{reg.nik}</div>
                    <div className="text-xs text-primary-600 mt-0.5">{reg.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{reg.poli}</td>
                  
                  {/* Kelas Column */}
                  <td className="px-6 py-4 text-sm">
                     {editingId === reg.id ? (
                        <select 
                            value={classType}
                            onChange={(e) => setClassType(e.target.value)}
                            className="w-24 text-sm border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                            <option value="">Umum</option>
                            <option value="Kelas 1">Kelas 1</option>
                            <option value="Kelas 2">Kelas 2</option>
                            <option value="Kelas 3">Kelas 3</option>
                            <option value="VIP">VIP</option>
                            <option value="VVIP">VVIP</option>
                        </select>
                     ) : (
                         <span className="text-slate-700">{reg.class_type || '-'}</span>
                     )}
                  </td>

                  {/* Fasilitas Column */}
                  <td className="px-6 py-4 text-sm">
                     {editingId === reg.id ? (
                        <input 
                            type="text"
                            value={facilityNotes}
                            onChange={(e) => setFacilityNotes(e.target.value)}
                            className="w-32 text-sm border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            placeholder="Catatan..."
                        />
                     ) : (
                         <span className="text-slate-700 italic text-xs truncate max-w-[150px] block" title={reg.facility_notes}>
                             {reg.facility_notes || '-'}
                         </span>
                     )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                      reg.payment === 'bpjs' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {reg.payment === 'bpjs' ? 'BPJS' : 'Umum'}
                    </span>
                    <div className="text-xs text-slate-500 mt-1 pl-1">
                        {reg.payment === 'bpjs' ? '-' : (reg.payment_detail || 'Tunai')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {editingId === reg.id ? (
                        <input 
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="w-24 text-sm border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                            placeholder="0"
                        />
                     ) : (
                        <span className="font-mono text-slate-700 text-sm">
                            {formatCurrency(reg.cost || 0)}
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === reg.id ? (
                       <select 
                        value={paymentStatus} 
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="Unpaid">Belum Lunas</option>
                        <option value="Paid">Lunas</option>
                      </select>
                    ) : (
                       <div className="flex flex-col items-start gap-1">
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                               (reg.payment_status === 'Paid' || reg.payment === 'bpjs') 
                               ? 'bg-gradient-to-r from-white to-green-50 text-green-700 border-green-100' 
                               : 'bg-gradient-to-r from-white to-red-50 text-red-700 border-red-100'
                           }`}>
                             {reg.payment === 'bpjs' ? 'Tercover' : (reg.payment_status || 'Unpaid')}
                           </span>
                           {reg.payment_proof && (
                               <button 
                                onClick={() => setPreviewImage(reg.payment_proof)}
                                className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                               >
                                   <Image className="h-3 w-3" />
                                   Lihat Bukti
                               </button>
                           )}
                       </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === reg.id ? (
                      <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border ${
                          reg.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                          reg.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          reg.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-slate-50 text-slate-700'
                      }`}>
                        {reg.status || 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === reg.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(reg.id, reg)} className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200 hover:bg-green-100">Simpan</button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 font-bold text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:bg-slate-100">Batal</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEdit(reg)}
                        className="text-primary-500 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-slate-500">Belum ada data pendaftaran.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pendaftaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Input Pendaftaran Baru</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="text" placeholder="Nomor Induk Kependudukan" 
                        className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})}
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pasien</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="text" placeholder="Nama Lengkap" 
                        className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="email" placeholder="email@contoh.com" 
                        className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="tel" placeholder="08xxxxxxxx" 
                        className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        required
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Poliklinik</label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.poli} onChange={e => setFormData({...formData, poli: e.target.value})}
                    >
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
                            className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                            style={{ colorScheme: 'light' }}
                            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                            required
                        />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <label className={`cursor-pointer border rounded-xl p-3 flex items-center gap-2 transition-all bg-white ${formData.payment === 'umum' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200'}`}>
                        <input 
                            type="radio" name="payment" value="umum" 
                            checked={formData.payment === 'umum'} onChange={e => setFormData({...formData, payment: e.target.value})}
                            className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-slate-900">Umum</span>
                    </label>
                    <label className={`cursor-pointer border rounded-xl p-3 flex items-center gap-2 transition-all bg-white ${formData.payment === 'bpjs' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200'}`}>
                        <input 
                            type="radio" name="payment" value="bpjs" 
                            checked={formData.payment === 'bpjs'} onChange={e => setFormData({...formData, payment: e.target.value})}
                            className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-slate-900">BPJS</span>
                    </label>
                </div>
                {formData.payment === 'umum' && (
                     <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white text-sm"
                        value={formData.payment_detail} onChange={e => setFormData({...formData, payment_detail: e.target.value})}
                    >
                        <option value="Tunai">Tunai</option>
                        <option value="Transfer">Transfer</option>
                        <option value="VA">Virtual Account</option>
                    </select>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Proof */}
      {previewImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}></div>
             <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col">
                <div className="p-4 bg-slate-900 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <Image className="h-5 w-5" /> Bukti Pembayaran
                    </h3>
                    <button onClick={() => setPreviewImage(null)} className="hover:text-slate-300">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
                    <img src={previewImage} alt="Bukti Transfer" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm" />
                </div>
                <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                    <button onClick={() => setPreviewImage(null)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">
                        Tutup
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default ManageRegistrations;