import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard, Edit } from 'lucide-react';
import { api } from '../../services/api';

const ManageBPJS: React.FC = () => {
  const [listBpjs, setListBpjs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    card_number: '',
    name: '',
    class_type: 'Kelas 3',
    status: 'Aktif',
    faskes: ''
  });

  const fetchBPJS = async () => {
    const data = await api.getBPJS();
    setListBpjs(data);
  };

  useEffect(() => {
    fetchBPJS();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus data peserta ini?')) {
      await api.deleteBPJS(id);
      fetchBPJS();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
        card_number: item.card_number,
        name: item.name,
        class_type: item.class_type,
        status: item.status,
        faskes: item.faskes
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ card_number: '', name: '', class_type: 'Kelas 3', status: 'Aktif', faskes: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        await api.updateBPJS(editingId, formData);
    } else {
        await api.addBPJS(formData);
    }
    setIsModalOpen(false);
    fetchBPJS();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Data Peserta BPJS</h1>
            <p className="text-slate-500 text-sm mt-1">Database kepesertaan BPJS pasien</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Input Peserta
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">No. Kartu</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Peserta</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kelas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Faskes Tingkat 1</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listBpjs.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{item.card_number}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-white to-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                        {item.class_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.faskes}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-white to-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                      {item.status}
                    </span>
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
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Data BPJS' : 'Input Peserta BPJS'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Kartu BPJS</label>
                <input 
                    type="text" placeholder="000xxxxxxxxxx" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.card_number} onChange={e => setFormData({...formData, card_number: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Peserta</label>
                <input 
                    type="text" placeholder="Nama Peserta" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.class_type} onChange={e => setFormData({...formData, class_type: e.target.value})}
                    >
                        <option value="Kelas 1">Kelas 1</option>
                        <option value="Kelas 2">Kelas 2</option>
                        <option value="Kelas 3">Kelas 3</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                        <option value="Menunggak">Menunggak</option>
                    </select>
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Faskes Tingkat 1</label>
                <input 
                    type="text" placeholder="Puskesmas/Klinik" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.faskes} onChange={e => setFormData({...formData, faskes: e.target.value})}
                    required
                />
              </div>
             
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBPJS;