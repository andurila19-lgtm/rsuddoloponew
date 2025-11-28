import React, { useEffect, useState } from 'react';
import { Users, UserPlus, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { api } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    registrations: 0,
    messages: 0
  });

  const [registrations, setRegistrations] = useState<any[]>([]);

  const fetchData = async () => {
    const docs = await api.getDoctors();
    const regs = await api.getRegistrations();
    const msgs = await api.getMessages();
    
    setStats({
      doctors: docs.length,
      registrations: regs.length,
      messages: msgs.length
    });
    setRegistrations(regs);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: 'Total Dokter', value: stats.doctors, icon: Users, color: 'bg-blue-500' },
    { title: 'Pendaftaran Masuk', value: stats.registrations, icon: UserPlus, color: 'bg-green-500' },
    { title: 'Pesan Baru', value: stats.messages, icon: MessageSquare, color: 'bg-amber-500' },
    { title: 'Kunjungan (Est)', value: '1.2k', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  // Dummy data generation for charts based on real counts would be complex, 
  // so we'll simulate data structure for visualization
  const trendData = [
    { name: 'Senin', pasien: 45 },
    { name: 'Selasa', pasien: 52 },
    { name: 'Rabu', pasien: 38 },
    { name: 'Kamis', pasien: 65 },
    { name: 'Jumat', pasien: 48 },
    { name: 'Sabtu', pasien: 25 },
    { name: 'Minggu', pasien: 15 },
  ];

  const pieData = [
    { name: 'Umum', value: registrations.filter(r => r.poli === 'umum').length || 10 },
    { name: 'Anak', value: registrations.filter(r => r.poli === 'anak').length || 5 },
    { name: 'Gigi', value: registrations.filter(r => r.poli === 'gigi').length || 3 },
    { name: 'Dalam', value: registrations.filter(r => r.poli === 'dalam').length || 8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
         <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <Activity className="h-3 w-3 animate-pulse" />
            Live Monitoring
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`${card.color} p-4 rounded-xl text-white shadow-lg shadow-gray-200`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 animate-in fade-in">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Tren Kunjungan (7 Hari Terakhir)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPasien" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="pasien" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPasien)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Distribusi Poli</h2>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;