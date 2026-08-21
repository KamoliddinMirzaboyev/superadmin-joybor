import { useEffect, useRef, useState } from 'react';
import { Bell, Check, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { api, type InboxNotification } from '../../services/api';
import { useTheme } from '../../theme';

interface HeaderProps {
  onLogout?: () => void;
  onMenu?: () => void;
  title?: string;
  onOpenNotifications?: () => void;
}

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  universities: 'Universitetlar',
  dormitories: 'Yotoqxonalar',
  users: 'Foydalanuvchilar',
  'dormitory-payments': "Obuna to'lovlari",
  applications: 'Arizalar',
  reports: 'Hisobotlar',
  settings: 'Sozlamalar',
  notifications: 'Bildirishnomalar',
};

function formatWhen(raw: string): string {
  if (!raw) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Hozir';
  if (mins < 60) return `${mins} daqiqa oldin`;
  if (mins < 1440) return `${Math.floor(mins / 60)} soat oldin`;
  return date.toLocaleDateString('uz-UZ');
}

export function Header({ onLogout, onMenu, title, onOpenNotifications }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState('Superadmin');
  const [now, setNow] = useState(() => new Date().toLocaleString('uz-UZ'));
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.is_read).length;

  const loadInbox = async () => {
    setLoading(true);
    try {
      setItems(await api.getNotifications());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    void loadInbox();
    const t = setInterval(() => void loadInbox(), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const handleMarkOne = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await api.markNotificationAsRead(id);
    } catch {
      void loadInbox();
    }
  };

  const handleMarkAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await api.markAllNotificationsAsRead();
    } catch {
      void loadInbox();
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300"
            aria-label="Menyu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
            {title ? titles[title] || title : 'JoyBor Superadmin'}
          </p>
          <p className="text-xs text-surface-500 hidden sm:block">{now}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-150"
          aria-label={isDark ? 'Yorug rejim' : 'Qorongu rejim'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v);
              if (!open) void loadInbox();
            }}
            className="relative p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-150"
            aria-label="Bildirishnomalar"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-danger-600 text-white text-[10px] font-semibold flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-[20rem] sm:w-96 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 overflow-hidden z-50">
              <div className="px-3.5 py-2.5 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">Bildirishnomalar</p>
                  <p className="text-[11px] text-surface-500">
                    {unread > 0 ? `${unread} ta o'qilmagan` : "Yangi xabar yo'q"}
                  </p>
                </div>
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAll}
                    className="text-xs font-medium text-brand-600 dark:text-brand-400"
                  >
                    Barchasini o'qish
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loading && items.length === 0 ? (
                  <p className="px-3.5 py-8 text-center text-xs text-surface-500">Yuklanmoqda...</p>
                ) : items.length === 0 ? (
                  <p className="px-3.5 py-8 text-center text-xs text-surface-500">Bildirishnoma yo'q</p>
                ) : (
                  items.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleMarkOne(n.id)}
                      className={`w-full text-left px-3.5 py-2.5 border-b border-surface-100 dark:border-surface-800 last:border-0 transition-colors duration-150 ${
                        n.is_read
                          ? 'bg-white dark:bg-surface-900'
                          : 'bg-brand-50/70 dark:bg-brand-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${n.is_read ? 'text-surface-700 dark:text-surface-300' : 'font-semibold text-surface-900 dark:text-white'}`}>
                          {n.title || n.message || 'Bildirishnoma'}
                        </p>
                        {!n.is_read && (
                          <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                      {n.title && n.message && (
                        <p className="text-xs text-surface-500 line-clamp-2 mt-0.5">{n.message}</p>
                      )}
                      <p className="text-[11px] text-surface-400 mt-1">{formatWhen(n.created_at)}</p>
                    </button>
                  ))
                )}
              </div>
              {onOpenNotifications && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenNotifications();
                  }}
                  className="w-full py-2 text-xs font-medium text-brand-600 dark:text-brand-400 border-t border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  Barchasini ko'rish
                </button>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{name}</p>
          <p className="text-xs text-surface-500">Superadmin</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors duration-150"
            title="Chiqish"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
