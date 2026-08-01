import { useEffect, useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1">
        <p className="text-sm text-gray-500">JoyBor Superadmin · api.joy-bor.uz</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{now}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
