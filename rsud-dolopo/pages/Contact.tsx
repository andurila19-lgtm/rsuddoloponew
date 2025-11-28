import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await api.sendMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); // Reset status after 5s
    } catch (error) {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="bg-slate-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Kami siap mendengar masukan, pertanyaan, atau keluhan Anda untuk pelayanan yang lebih baik.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-900 mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Alamat</h4>
                    <p className="text-slate-600 text-sm">
                      Jl. Raya Dolopo No.117, Dolopo,<br/>
                      Kec. Dolopo, Kab. Madiun,<br/>
                      Jawa Timur 63174
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Telepon</h4>
                    <p className="text-slate-600 text-sm">IGD: (0351) 366096</p>
                    <p className="text-slate-600 text-sm">Informasi: (0351) 366096</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Email</h4>
                    <p className="text-slate-600 text-sm">rsud.dolopo@madiunkab.go.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Jam Operasional</h4>
                    <p className="text-slate-600 text-sm">IGD: 24 Jam</p>
                    <p className="text-slate-600 text-sm">Rawat Jalan: Senin - Sabtu (07.00 - 14.00)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-4">Media Sosial</h4>
                <div className="flex gap-4">
                  <a href="#" className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-primary-600 hover:text-white transition-all">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-primary-600 hover:text-white transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-primary-600 hover:text-white transition-all">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-64 overflow-hidden">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.597653246824!2d111.53641777478796!3d-7.726265792291913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79bdb0c17d3d19%3A0x6e9f5e1f0a5b5b5b!2sRSUD%20Dolopo!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-2xl text-slate-900 mb-6">Kirim Pesan</h3>
              
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="h-5 w-5" />
                  <p>Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5" />
                  <p>Maaf, gagal mengirim pesan. Mohon periksa koneksi Anda dan coba lagi.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                      placeholder="08123xxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subjek</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Pilih Subjek</option>
                    <option value="Info Layanan">Informasi Layanan</option>
                    <option value="Jadwal Dokter">Jadwal Dokter</option>
                    <option value="Kritik & Saran">Kritik & Saran</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pesan</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;