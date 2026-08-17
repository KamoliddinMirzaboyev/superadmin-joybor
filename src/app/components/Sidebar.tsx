import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Home, 
  Users, 
  Coins, 
  Calendar, 
  FileText, 
  ScanFace, 
  BarChart3, 
  Settings,
  Handshake,
  Phone,
} from 'lucide-react';
import { api } from '../../services/api';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  const [displayName, setDisplayName] = useState('Superadmin');
  const [initials, setInitials] = useState('SA');

  useEffect(() => {
    api
      .me()
      .then((p) => {
        const first = String(p.first_name || '');
        const last = String(p.last_name || '');
        const username = String(p.username || '');
        const name = [first, last].filter(Boolean).join(' ') || username || 'Superadmin';
        setDisplayName(name);
        const parts = name.trim().split(/\s+/);
        setInitials(((parts[0]?.[0] || 'S') + (parts[1]?.[0] || 'A')).toUpperCase());
      })
      .catch(() => {});
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'universities', label: 'Universitetlar', icon: Building2 },
    { id: 'dormitories', label: 'Yotoqxonalar', icon: Home },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'payments', label: 'To\'lovlar', icon: Coins },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'applications', label: 'Arizalar', icon: FileText },
    { id: 'faceid', label: 'Face ID Monitor', icon: ScanFace },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { id: 'partnership', label: 'Hamkorlik', icon: Handshake },
    { id: 'contact', label: 'Aloqa sozlamalari', icon: Phone },
    { id: 'settings', label: 'Tizim Sozlamalari', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-medium">JB</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">JoyBor</h1>
            <p className="text-xs text-gray-500">Superadmin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500">Superadmin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
