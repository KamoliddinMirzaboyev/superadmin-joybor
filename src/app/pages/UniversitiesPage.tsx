import { Building2 } from 'lucide-react';

export function UniversitiesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Universitetlar</h1>
      <p className="text-gray-600 mb-8">Universitetlar ro'yxati va ma'lumotlari</p>
      
      {/* Universities Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viloyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talabalar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Toshkent Davlat Universiteti</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Davlat</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toshkent</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Faol
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Inha Universiteti</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Xususiy</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toshkent</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Faol
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Samarqand Davlat Universiteti</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Davlat</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Samarqand</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Faol
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add University Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <Building2 className="w-4 h-4 mr-2" />
          Universitet qo'shish
        </button>
      </div>
    </div>
  );
}