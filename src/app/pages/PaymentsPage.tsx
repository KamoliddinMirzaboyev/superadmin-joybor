import { Coins } from 'lucide-react';

export function PaymentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">To'lovlar</h1>
      <p className="text-gray-600 mb-8">To'lovlar ro'yxati va ma'lumotlari</p>
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talaba</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To'lov turi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miqdor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To'lov muddati</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yotoqxona to'lovi</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$150</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-25</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  To'landi
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dars to'lovi</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$300</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-24</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  To'landi
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Kitob to'lovi</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$50</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-23</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  To'landi
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Payment Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <Coins className="w-4 h-4 mr-2" />
          To'lov qo'shish
        </button>
      </div>
    </div>
  );
}