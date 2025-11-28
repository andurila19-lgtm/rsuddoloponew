import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Landmark, CreditCard } from 'lucide-react';
import { api, BankAccount } from '../../services/api';

const ManageBanks: React.FC = () => {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: 'RSUD Dolopo',
    type: 'Transfer' as 'Transfer' | 'VA',
    is_active: true
  });

  const fetchBanks = async () => {
    const data = await api.getBanks();
    setBanks(data);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus rekening ini?')) {
      await api.deleteBank(id);
      fetchBanks();
    }
  };

  const handleEdit = (item: BankAccount) => {
    setEditingId(item.id);
    setFormData({
        bank_name: item.bank_name,
        account_number: item.account_number,
        account_name: item.account_name,
        type: item.type,
        is_active: item.is_active
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
        bank_name: '', 
        account_number: '', 
        account_name: 'RSUD Dolopo', 
        type: 'Transfer', 
        is_active: true 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };

    if (editingId) {
        await api.updateBank(editingId, dataToSend);
    } else {
        await api.addBank(dataToSend);
    }
    setIsModalOpen(false);
    fetchBanks();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Rekening & VA</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola metode pembayaran transfer bank dan Virtual Account</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Rekening
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Bank / Provider</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nomor Rekening / VA</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Atas Nama</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tipe</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banks.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-slate-400" />
                    {item.bank_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">{item.account_number}</td>
                  <td className="px-6 py-4 text-slate-600">{item.account_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'Transfer' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'} border`}>
                        {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.is_active ? 'Aktif' : 'Non-Aktif'}
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
              {banks.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada data rekening.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Rekening' : 'Tambah Rekening Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Bank / Provider VA</label>
                <input 
                    type="text" placeholder="Contoh: BCA, Mandiri, BNI VA" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.bank_name} onChange={e => setFormData({...formData, bank_name: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Rekening / VA</label>
                <input 
                    type="text" placeholder="Nomor Rekening" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white font-mono"
                    value={formData.account_number} onChange={e => setFormData({...formData, account_number: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Atas Nama</label>
                <input 
                    type="text" placeholder="Nama Pemilik Rekening" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.account_name} onChange={e => setFormData({...formData, account_name: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Pembayaran</label>
                <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as 'Transfer' | 'VA'})}
                >
                    <option value="Transfer">Transfer Bank Manual</option>
                    <option value="VA">Virtual Account (VA)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input 
                    type="checkbox" 
                    id="is_active"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">Rekening Aktif</label>
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

export default ManageBanks;