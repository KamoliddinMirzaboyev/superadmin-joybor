import { Search, Bell, Plus } from 'lucide-react';

export function Header() {
  const currentTime = '2026-03-29 15:02:57';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Global qidiruv..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Add University Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Universitet Qo'shish</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Kamiliddin Mirzaboyev</p>
            <p className="text-xs text-gray-500">Oxirgi yangilanish: {currentTime}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            KM
          </div>
        </div>
      </div>
    </header>
  );
}
