import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { Doctor } from '../../types';

const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    image: 'https://picsum.photos/seed/newdoc/200/200',
    days: '',
    time: '',
    available: true
  });

  const fetchDoctors = async () => {
    const data = await api.getDoctors();
    setDoctors(data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus dokter ini?')) {
      await api.deleteDoctor(id);
      fetchDoctors();
    }
  };

  const handleEdit = (doc: Doctor) => {
    setEditingId(doc.id);
    // Split schedule string "Day, Time" back to parts
    const parts = doc.schedule.split(', ');
    const days = parts[0] || '';
    const time = parts.slice(1).join(', ') || ''; // Handle if time has commas

    setFormData({
        name: doc.name,
        specialty: doc.specialty,
        image: doc.image,
        days: days,
        time: time,
        available: doc.available
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
        name: '',
        specialty: '',
        image: 'https://picsum.photos/seed/newdoc/200/200',
        days: '',
        time: '',
        available: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullSchedule = `${formData.days}, ${formData.time}`;
    
    const submitData = {
        name: formData.name,
        specialty: formData.specialty,
        image: formData.image,
        schedule: fullSchedule,
        available: formData.available
    };

    if (editingId) {
        await api.updateDoctor(editingId, submitData);
    } else {
        await api.addDoctor(submitData);
    }
    setIsModalOpen(false);
    fetchDoctors();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Dokter</h1>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Dokter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Spesialisasi</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Jadwal</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={doc.image} alt={doc.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium text-slate-900">{doc.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.specialty}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{doc.schedule}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {doc.available ? 'Aktif' : 'Cuti'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(doc)}
                      className="text-primary-500 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Dokter' : 'Tambah Dokter Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                    type="text" placeholder="Nama Lengkap & Gelar" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Spesialisasi</label>
                <input 
                    type="text" placeholder="Spesialisasi" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}
                    required
                />
              </div>
              
              {/* Split Schedule Fields */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hari Praktik</label>
                    <input 
                        type="text" placeholder="Senin - Jumat" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})}
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jam Praktik</label>
                    <input 
                        type="text" placeholder="08.00 - 14.00" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                        required
                    />
                  </div>
              </div>

               <div className="flex items-center gap-2 pt-2">
                <input 
                    type="checkbox" 
                    id="available"
                    checked={formData.available}
                    onChange={e => setFormData({...formData, available: e.target.checked})}
                    className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="available" className="text-sm font-medium text-slate-700 cursor-pointer">Dokter Tersedia (Aktif)</label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;