import { Calendar } from 'lucide-react';

export function AttendancePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Davomat</h1>
      <p className="text-gray-600 mb-8">Talabalar davomat ma'lumotlari</p>
      
      {/* Attendance Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mart oyining davomati</h3>
          <div className="flex items-center gap-2">
<button className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-500 hover:bg-gray-200">
              {'<'}
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-500 hover:bg-gray-200">
              {'>'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          <div className="text-center text-xs text-gray-500 font-medium">D</div>
          <div className="text-center text-xs text-gray-500 font-medium">S</div>
          <div className="text-center text-xs text-gray-500 font-medium">C</div>
          <div className="text-center text-xs text-gray-500 font-medium">P</div>
          <div className="text-center text-xs text-gray-500 font-medium">J</div>
          <div className="text-center text-xs text-gray-500 font-medium">S</div>
          <div className="text-center text-xs text-gray-500 font-medium">A</div>
          <div className="text-center text-sm text-gray-400">1</div>
          <div className="text-center text-sm text-gray-400">2</div>
          <div className="text-center text-sm text-gray-400">3</div>
          <div className="text-center text-sm text-gray-400">4</div>
          <div className="text-center text-sm text-gray-400">5</div>
          <div className="text-center text-sm text-gray-400">6</div>
          <div className="text-center text-sm text-gray-400">7</div>
          <div className="text-center text-sm text-gray-400">8</div>
          <div className="text-center text-sm text-gray-400">9</div>
          <div className="text-center text-sm text-gray-400">10</div>
          <div className="text-center text-sm text-gray-400">11</div>
          <div className="text-center text-sm text-gray-400">12</div>
          <div className="text-center text-sm text-gray-400">13</div>
          <div className="text-center text-sm text-gray-400">14</div>
          <div className="text-center text-sm text-gray-400">15</div>
          <div className="text-center text-sm text-gray-400">16</div>
          <div className="text-center text-sm text-gray-400">17</div>
          <div className="text-center text-sm text-gray-400">18</div>
          <div className="text-center text-sm text-gray-400">19</div>
          <div className="text-center text-sm text-gray-400">20</div>
          <div className="text-center text-sm text-gray-400">21</div>
          <div className="text-center text-sm text-gray-400">22</div>
          <div className="text-center text-sm text-gray-400">23</div>
          <div className="text-center text-sm text-gray-400">24</div>
          <div className="text-center text-sm text-gray-400">25</div>
          <div className="text-center text-sm text-gray-400">26</div>
          <div className="text-center text-sm text-gray-400">27</div>
          <div className="text-center text-sm text-gray-400">28</div>
          <div className="text-center text-sm text-gray-400">29</div>
          <div className="text-center text-sm text-gray-400">30</div>
          <div className="text-center text-sm text-gray-400">31</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talaba</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaqt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kun</th>
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Hadir
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08:30</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-25</td>
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Kech
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08:45</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-25</td>
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Qoldirib
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">---</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-03-25</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Ko'rish</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Attendance Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <Calendar className="w-4 h-4 mr-2" />
          Davomat qo'shish
        </button>
      </div>
    </div>
  );
}