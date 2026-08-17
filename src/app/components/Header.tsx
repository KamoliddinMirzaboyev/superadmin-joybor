import { useEffect, useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onLogout?: () => void;
  onMenu?: () => void;
  title?: string;
}

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  universities: 'Universitetlar',
  dormitories: 'Yotoqxonalar',
  users: 'Foydalanuvchilar',
  payments: "To'lovlar",
  attendance: 'Davomat',
  applications: 'Arizalar',
  reports: 'Hisobotlar',
  settings: 'Sozlamalar',
};

export function Header({ onLogout, onMenu, title }: HeaderProps) {
  const [name, setName] = useState('Superadmin');
  const [now, setNow] = useState(() => new Date().toLocaleString('uz-UZ'));

  useEffect(() => {
    api
      .me()
      .then((p) => {
        const first = (p.first_name as string) || '';
        const last = (p.last_name as string) || '';
        const username = (p.username as string) || '';
        setName([first, last].filter(Boolean).join(' ') || username || 'Superadmin');
      })
      .catch(() => {});
    const t = setInterval(() => setNow(new Date().toLocaleString('uz-UZ')), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 text-surface-600"
            aria-label="Menyu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 truncate">
            {title ? titles[title] || title : 'JoyBor Superadmin'}
          </p>
          <p className="text-xs text-surface-500 hidden sm:block">{now}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-surface-900">{name}</p>
          <p className="text-xs text-surface-500">Superadmin</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors duration-150"
            title="Chiqish"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
