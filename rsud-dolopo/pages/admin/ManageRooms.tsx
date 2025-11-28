import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, BedDouble, Users } from 'lucide-react';
import { api, Room } from '../../services/api';

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    class_type: 'Kelas 3',
    total_beds: 1,
    occupied_beds: 0,
    price: 0
  });

  const fetchRooms = async () => {
    const data = await api.getRooms();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus data kamar ini?')) {
      await api.deleteRoom(id);
      fetchRooms();
    }
  };

  const handleEdit = (item: Room) => {
    setEditingId(item.id);
    setFormData({
        name: item.name,
        class_type: item.class_type,
        total_beds: item.total_beds,
        occupied_beds: item.occupied_beds,
        price: item.price
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', class_type: 'Kelas 3', total_beds: 4, occupied_beds: 0, price: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.occupied_beds > formData.total_beds) {
        alert("Jumlah terisi tidak boleh melebihi kapasitas total bed.");
        return;
    }

    const dataToSend = {
        name: formData.name,
        class_type: formData.class_type,
        total_beds: Number(formData.total_beds),
        occupied_beds: Number(formData.occupied_beds),
        price: Number(formData.price)
    };

    if (editingId) {
        await api.updateRoom(editingId, dataToSend);
    } else {
        await api.addRoom(dataToSend);
    }
    setIsModalOpen(false);
    fetchRooms();
  };

  const calculateOccupancy = (occupied: number, total: number) => {
      if (total === 0) return 0;
      return Math.round((occupied / total) * 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Ketersediaan Kamar Inap</h1>
            <p className="text-slate-500 text-sm mt-1">Monitor okupansi dan manajemen harga kamar</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Kamar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         {/* Summary Cards */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                 <BedDouble className="h-6 w-6" />
             </div>
             <div>
                 <p className="text-sm text-slate-500">Total Bed</p>
                 <h3 className="text-2xl font-bold text-slate-800">{rooms.reduce((acc, curr) => acc + curr.total_beds, 0)}</h3>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="p-4 rounded-xl bg-green-50 text-green-600">
                 <Users className="h-6 w-6" />
             </div>
             <div>
                 <p className="text-sm text-slate-500">Terisi</p>
                 <h3 className="text-2xl font-bold text-slate-800">{rooms.reduce((acc, curr) => acc + curr.occupied_beds, 0)}</h3>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                 <BedDouble className="h-6 w-6" />
             </div>
             <div>
                 <p className="text-sm text-slate-500">Tersedia</p>
                 <h3 className="text-2xl font-bold text-slate-800">{rooms.reduce((acc, curr) => acc + (curr.total_beds - curr.occupied_beds), 0)}</h3>
             </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Ruangan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kelas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kapasitas (Terisi/Total)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Okupansi</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Harga / Malam</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((item) => {
                const occupancy = calculateOccupancy(item.occupied_beds, item.total_beds);
                const isFull = item.occupied_beds >= item.total_beds;
                
                return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.class_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    <span className={isFull ? 'text-red-600 font-bold' : 'text-slate-700'}>{item.occupied_beds}</span> / {item.total_beds}
                  </td>
                  <td className="px-6 py-4 w-48">
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${occupancy >= 100 ? 'bg-red-500' : occupancy > 80 ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${occupancy}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{occupancy}% Full</span>
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
              )})}
              {rooms.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada data kamar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Kamar' : 'Tambah Kamar Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ruangan</label>
                <input 
                    type="text" placeholder="Contoh: Mawar 01" 
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
                        <option value="VVIP">VVIP</option>
                        <option value="VIP">VIP</option>
                        <option value="Kelas 1">Kelas 1</option>
                        <option value="Kelas 2">Kelas 2</option>
                        <option value="Kelas 3">Kelas 3</option>
                        <option value="ICU">ICU</option>
                        <option value="Isolasi">Isolasi</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Harga / Malam</label>
                    <input 
                        type="number" placeholder="0" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        required
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Bed</label>
                    <input 
                        type="number" min="1" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.total_beds} onChange={e => setFormData({...formData, total_beds: Number(e.target.value)})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Terisi</label>
                    <input 
                        type="number" min="0" max={formData.total_beds}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.occupied_beds} onChange={e => setFormData({...formData, occupied_beds: Number(e.target.value)})}
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

export default ManageRooms;