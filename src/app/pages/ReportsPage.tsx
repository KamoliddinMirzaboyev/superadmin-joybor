import { BarChart3 } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hisobotlar</h1>
      <p className="text-gray-600 mb-8">Tizim hisobotlari va statistik ma'lumotlar</p>
      
      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Umumiy hisobot</h4>
              <p className="text-sm text-gray-500">2026 yil</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
              📊
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Talabalar: <span className="font-medium">2050</span></p>
            <p className="text-sm text-gray-600">Yotoqxonalar: <span className="font-medium">50</span></p>
            <p className="text-sm text-gray-600">Universitetlar: <span className="font-medium">15</span></p>
            <p className="text-sm text-gray-600">Daromad: <span className="font-medium">$1.2M</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Talaba hisobati</h4>
              <p className="text-sm text-gray-500">Jami ma'lumotlar</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-medium">
              📈
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Faol talabalar: <span className="font-medium">1850</span></p>
            <p className="text-sm text-gray-600">Kech talabalar: <span className="font-medium">200</span></p>
            <p className="text-sm text-gray-600">Qoldirib qolganlar: <span className="font-medium">0</span></p>
            <p className="text-sm text-gray-600">Daromad: <span className="font-medium">$500K</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">To'lov hisobati</h4>
              <p className="text-sm text-gray-500">To'lov statistikasi</p>
            </div>
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white font-medium">
              💰
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">To'lovlar: <span className="font-medium">1500</span></p>
            <p className="text-sm text-gray-600">Jami miqdor: <span className="font-medium">$750K</span></p>
            <p className="text-sm text-gray-600">O'rtacha: <span className="font-medium">$500</span></p>
            <p className="text-sm text-gray-600">Qarzdorlar: <span className="font-medium">$150K</span></p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Talabalar grafik</h4>
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-medium text-lg border border-slate-200">
            Talabalar grafikini keling
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">To'lovlar diagramma</h4>
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-medium text-lg border border-slate-200">
            To'lovlar diagrammasini keling
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Hisobotlar jadvali</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hisobot turi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amal qilgan kun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Talaba hisoboti</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-25</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tayyor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Yuklash</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">To'lov hisoboti</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-24</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tayyor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Yuklash</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yotoqxona hisoboti</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-23</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Jarayonda
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Yuklash</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Report Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <BarChart3 className="w-4 h-4 mr-2" />
          Hisobot yaratish
        </button>
      </div>
    </div>
  );
}