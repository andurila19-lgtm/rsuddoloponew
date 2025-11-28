import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        
        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="bg-primary-600 p-3 rounded-xl mb-4 shadow-lg shadow-primary-500/30">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500">Masuk untuk mengelola RSUD Dolopo</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Lock className="h-4 w-4" />
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;