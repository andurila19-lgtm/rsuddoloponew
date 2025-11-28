import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Receipt } from 'lucide-react';
import { api, Facility } from '../../services/api';

const ManageFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0
  });

  const fetchFacilities = async () => {
    const data = await api.getFacilities();
    setFacilities(data);
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus data tarif ini?')) {
      await api.deleteFacility(id);
      fetchFacilities();
    }
  };

  const handleEdit = (item: Facility) => {
    setEditingId(item.id);
    setFormData({
        name: item.name,
        category: item.category,
        price: item.price
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price)
    };

    if (editingId) {
        await api.updateFacility(editingId, dataToSend);
    } else {
        await api.addFacility(dataToSend);
    }
    setIsModalOpen(false);
    fetchFacilities();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Tarif Fasilitas & Layanan</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola harga tindakan medis dan administrasi</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Tarif
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Layanan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kategori</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Harga (IDR)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-slate-400" />
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-primary-500 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {facilities.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada data tarif.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Tarif' : 'Tambah Tarif Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Layanan / Tindakan</label>
                <input 
                    type="text" placeholder="Contoh: Cek Gula Darah" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                >
                    <option value="">Pilih Kategori</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Poli Jalan">Poli Jalan</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Radiologi">Radiologi</option>
                    <option value="UGD">UGD</option>
                    <option value="Rawat Inap">Rawat Inap</option>
                    <option value="Farmasi">Farmasi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Harga (IDR)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">Rp</div>
                    <input 
                        type="number" placeholder="0" 
                        className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        required
                    />
                </div>
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

export default ManageFacilities;