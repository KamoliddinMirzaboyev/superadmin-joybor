import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  Coins,
  Calendar,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import { api } from '../../services/api';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'universities', label: 'Universitetlar', icon: Building2 },
  { id: 'dormitories', label: 'Yotoqxonalar', icon: Home },
  { id: 'users', label: 'Foydalanuvchilar', icon: Users },
  { id: 'payments', label: "To'lovlar", icon: Coins },
  { id: 'attendance', label: 'Davomat', icon: Calendar },
  { id: 'applications', label: 'Arizalar', icon: FileText },
  { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
  { id: 'settings', label: 'Sozlamalar', icon: Settings },
];

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

  return (
    <aside className="w-64 h-full bg-white border-r border-surface-200 flex flex-col">
      <div className="px-5 py-5 border-b border-surface-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
            JB
          </div>
          <div>
            <h1 className="font-bold text-surface-900 leading-tight">JoyBor</h1>
            <p className="text-xs text-surface-500">Superadmin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-600" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-surface-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-900 truncate">{displayName}</p>
            <p className="text-xs text-surface-500">Superadmin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
