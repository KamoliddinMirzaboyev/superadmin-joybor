import { ScanFace } from 'lucide-react';

export function FaceIDMonitorPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Face ID Monitor</h1>
      <p className="text-gray-600 mb-8">Talabalar yuz tanlov tizimi</p>
      
      {/* Face ID Monitor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Yuz tanlov holati</h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Faol
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Jami talabalar</h4>
            <p className="text-3xl font-bold">2050</p>
          </div>
          <div className="bg-emerald-600 rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Tanlangan</h4>
            <p className="text-3xl font-bold">1850</p>
          </div>
          <div className="bg-amber-600 rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Tanlanmagan</h4>
            <p className="text-3xl font-bold">200</p>
          </div>
          <div className="bg-red-600 rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Xatolik</h4>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">So'ngi tanlovlar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talaba</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaqt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xona</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                      SB
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Shohruh Baxtiyorov</div>
                      <div className="text-sm text-gray-500">Talaba</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08:30</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Muvaffaqiyatli
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bin 1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">101</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                      AA
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Alisher Abduvohidov</div>
                      <div className="text-sm text-gray-500">Talaba</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08:32</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Muvaffaqiyatli
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bin 2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">205</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                      KM
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Kamiliddin Mirzaboyev</div>
                      <div className="text-sm text-gray-500">Talaba</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08:35</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Muvaffaqiyatli
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bin 3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">310</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Face ID Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <ScanFace className="w-4 h-4 mr-2" />
          Yuz tanlov qo'shish
        </button>
      </div>
    </div>
  );
}