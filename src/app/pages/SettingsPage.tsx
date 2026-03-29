import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tizim Sozlamalari</h1>
      <p className="text-gray-600 mb-8">Tizim sozlamalari va konfiguratsiya</p>
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Umumiy sozlamalar</h4>
              <p className="text-sm text-gray-500">Tizim konfiguratsiyasi</p>
            </div>
            <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
              ⚙️
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Tizim nomi</span>
              <input 
                type="text" 
                value="JoyBor" 
                className="flex-1 form-input border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Tizim nomini kiriting"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Til</span>
              <select className="flex-1 form-select border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Uzbek</option>
                <option>English</option>
                <option>Русский</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Vaqt mintaqasi</span>
              <select className="flex-1 form-select border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Asia/Tashkent</option>
                <option>UTC</option>
                <option>UTC+1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Xavfsizlik</h4>
              <p className="text-sm text-gray-500">Foydalanuvchi xavfsizligi</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-medium">
              🔒
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Autentifikatsiya</span>
              <select className="flex-1 form-select border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Parol + SMS</option>
                <option>Parol + Email</option>
                <option>Biometrik</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sessiya davomiyligi</span>
              <select className="flex-1 form-select border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>1 soat</option>
                <option>4 soat</option>
                <option>8 soat</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Parol qayta tiklash</span>
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                Parolni tiklash
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Bildirishnomalar</h4>
              <p className="text-sm text-gray-500">Bildirishnoma sozlamalari</p>
            </div>
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white font-medium">
              🔔
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked
                className="form-checkbox border border-gray-300 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Yangi arizalar</span>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked
                className="form-checkbox border border-gray-300 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">To'lovlar</span>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked
                className="form-checkbox border border-gray-300 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Davomat</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tizim ma'lumotlari</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Versiya</span>
            <span className="text-sm text-gray-600">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Holat</span>
            <span className="text-sm text-green-600 font-medium">Faol</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Oxirgi yangilanish</span>
            <span className="text-sm text-gray-600">2026-03-29</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Server vaqti</span>
            <span className="text-sm text-gray-600">15:02:57</span>
          </div>
        </div>
      </div>

      {/* Add Settings Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 bg-slate-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition">
          <Settings className="w-4 h-4 mr-2" />
          Sozlamalarni saqlash
        </button>
      </div>
    </div>
  );
}