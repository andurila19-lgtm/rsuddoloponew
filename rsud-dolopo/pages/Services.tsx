import React from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  Baby, 
  Brain, 
  Eye, 
  Cross, 
  Microscope, 
  Truck, 
  ShieldPlus, 
  Clock, 
  Activity, 
  Phone 
} from 'lucide-react';

// Custom Icon for Bone
const BoneIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
  </svg>
);

const Services: React.FC = () => {
  const polyclinics = [
    { name: 'Penyakit Dalam', icon: Activity, desc: 'Diagnosis dan penanganan penyakit organ dalam dewasa.' },
    { name: 'Bedah Umum', icon: Stethoscope, desc: 'Layanan operasi dan perawatan pasca bedah.' },
    { name: 'Anak (Pediatri)', icon: Baby, desc: 'Kesehatan dan tumbuh kembang anak.' },
    { name: 'Kebidanan & Kandungan', icon: HeartPulse, desc: 'Kesehatan ibu hamil, bersalin, dan reproduksi.' },
    { name: 'Saraf (Neurologi)', icon: Brain, desc: 'Penanganan gangguan sistem saraf.' },
    { name: 'Mata', icon: Eye, desc: 'Pemeriksaan dan pengobatan kesehatan mata.' },
    { name: 'Gigi & Mulut', icon: Cross, desc: 'Perawatan kesehatan gigi dan mulut komprehensif.' },
    { name: 'Orthopedi', icon: BoneIcon, desc: 'Bedah tulang dan persendian.' },
  ];

  const supports = [
    { name: 'Laboratorium 24 Jam', icon: Microscope, desc: 'Pemeriksaan patologi klinik lengkap.' },
    { name: 'Radiologi', icon: ShieldPlus, desc: 'X-Ray, USG, dan layanan pencitraan medis.' },
    { name: 'Farmasi', icon: Activity, desc: 'Layanan obat-obatan lengkap 24 jam.' },
    { name: 'Ambulans', icon: Truck, desc: 'Layanan antar-jemput pasien gawat darurat.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Layanan Kami</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            RSUD Dolopo menyediakan layanan kesehatan terpadu dengan fasilitas modern dan tenaga medis profesional.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* IGD Banner */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border-l-8 border-red-500 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-4 rounded-full animate-pulse">
              <HeartPulse className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">IGD 24 Jam</h2>
              <p className="text-slate-600">Instalasi Gawat Darurat siap melayani kasus kegawatdaruratan medis setiap saat.</p>
            </div>
          </div>
          <a 
            href="tel:0351366096"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:-translate-y-1 ring-4 ring-red-600/20"
          >
            <Phone className="h-5 w-5 animate-pulse" />
            Panggil Ambulans
          </a>
        </div>

        {/* Poliklinik */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Stethoscope className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-slate-900">Poliklinik Spesialis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {polyclinics.map((poli, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all group">
                <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <poli.icon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{poli.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{poli.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rawat Inap */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-slate-900">Fasilitas Rawat Inap</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Kenyamanan & Perawatan Intensif</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Kami menyediakan berbagai kelas perawatan mulai dari VVIP, VIP, Kelas 1, 2, hingga Kelas 3 dengan standar kebersihan dan kenyamanan tinggi. Tersedia juga ruang intensif (ICU/HCU) untuk penanganan kondisi kritis.
                </p>
                <ul className="space-y-3">
                  {['Ruang VVIP & VIP', 'Ruang Perawatan Kelas 1, 2, 3', 'High Care Unit (HCU)', 'Ruang Isolasi', 'Ruang Bersalin (VK)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-64 md:h-auto bg-slate-200 relative">
                 <img 
                  src="https://picsum.photos/seed/hospitalroom/800/600" 
                  alt="Ruang Rawat Inap" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <p className="text-white font-medium">Fasilitas kamar modern untuk kenyamanan pasien</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Penunjang */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ShieldPlus className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-slate-900">Layanan Penunjang</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supports.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className="bg-accent-50 p-3 rounded-lg flex-shrink-0">
                  <item.icon className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;