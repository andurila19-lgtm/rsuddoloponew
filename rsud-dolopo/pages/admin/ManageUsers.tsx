import React, { useEffect, useState } from 'react';
import { Plus, Trash2, UserCog, Edit } from 'lucide-react';
import { api } from '../../services/api';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Staff',
    status: 'Active'
  });

  const fetchUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      await api.deleteUser(id);
      fetchUsers();
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({
        name: user.name,
        username: user.username,
        role: user.role,
        status: user.status
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', username: '', role: 'Staff', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        await api.updateUser(editingId, formData);
    } else {
        await api.addUser(formData);
    }
    setIsModalOpen(false);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola data admin dan staff rumah sakit</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Lengkap</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, idx) => (
                <tr key={user.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-primary-500" />
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-white to-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-white to-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-primary-500 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
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
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit User' : 'Tambah User Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                    type="text" placeholder="Nama Lengkap" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                    type="text" placeholder="Username" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                    <option value="Perawat">Perawat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
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

export default ManageUsers;