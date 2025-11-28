import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, CheckCircle, Edit, Reply } from 'lucide-react';
import { api } from '../../services/api';

const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMsg, setEditingMsg] = useState<any>(null);

  const fetchMsgs = async () => {
    const data = await api.getMessages();
    setMessages(data);
  };

  useEffect(() => {
    fetchMsgs();
  }, []);

  const markAsRead = async (id: number) => {
    await api.updateMessage(id, { is_read: true });
    fetchMsgs();
  };

  const handleEdit = (msg: any) => {
      setEditingMsg({...msg});
      setIsEditModalOpen(true);
  }

  const handleReply = (msg: any) => {
      window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}`;
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(editingMsg) {
          await api.updateMessage(editingMsg.id, { 
              subject: editingMsg.subject,
              message: editingMsg.message
          });
          setIsEditModalOpen(false);
          fetchMsgs();
      }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Pesan Masuk</h1>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
            msg.is_read ? 'border-slate-100 opacity-70' : 'border-primary-200 shadow-md border-l-4 border-l-primary-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`font-bold text-lg ${msg.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{msg.subject}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                  <span className="font-medium text-primary-600">{msg.name}</span> &bull; {msg.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2 mt-2">
                    {!msg.is_read && (
                        <button 
                            onClick={() => markAsRead(msg.id)}
                            className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                        >
                            <CheckCircle className="h-3 w-3" />
                            Tandai Dibaca
                        </button>
                    )}
                    <button 
                        onClick={() => handleEdit(msg)}
                        className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                        title="Edit Pesan"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleReply(msg)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Balas Pesan"
                    >
                        <Reply className="h-4 w-4" />
                    </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {msg.message}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {msg.phone}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {msg.email}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">Belum ada pesan masuk.</p>
          </div>
        )}
      </div>

       {/* Edit Modal */}
       {isEditModalOpen && editingMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit Pesan Masuk</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
                <input 
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={editingMsg.subject} 
                    onChange={e => setEditingMsg({...editingMsg, subject: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Isi Pesan</label>
                <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={editingMsg.message} 
                    onChange={e => setEditingMsg({...editingMsg, message: e.target.value})}
                    required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMessages;