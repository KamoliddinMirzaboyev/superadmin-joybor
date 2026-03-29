import { Home } from 'lucide-react';

export function DormitoriesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Yotoqxonalar</h1>
      <p className="text-gray-600 mb-8">Yotoqxona binolarining ma'lumotlari</p>
      
      {/* Dormitories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bin 1</h3>
              <p className="text-sm text-gray-500">Toshkent</p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white font-medium">
              1
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Xonalar: <span className="font-medium">120</span></p>
            <p className="text-sm text-gray-600">Talabalar: <span className="font-medium">360</span></p>
            <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Faol</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bin 2</h3>
              <p className="text-sm text-gray-500">Toshkent</p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white font-medium">
              2
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Xonalar: <span className="font-medium">150</span></p>
            <p className="text-sm text-gray-600">Talabalar: <span className="font-medium">450</span></p>
            <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Faol</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bin 3</h3>
              <p className="text-sm text-gray-500">Samarqand</p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white font-medium">
              3
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Xonalar: <span className="font-medium">100</span></p>
            <p className="text-sm text-gray-600">Talabalar: <span className="font-medium">300</span></p>
            <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Faol</span></p>
          </div>
        </div>
      </div>

      {/* Add Dormitory Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <Home className="w-4 h-4 mr-2" />
          Yotoqxona qo'shish
        </button>
      </div>
    </div>
  );
}