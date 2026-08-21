import { useEffect, useState } from 'react';
import { Bell, Check, RefreshCw, Search } from 'lucide-react';
import { api, type InboxNotification } from '../../services/api';

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

export function NotificationsPage() {
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = async () => {
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
    void load();
  }, []);

  const unread = items.filter((n) => !n.is_read).length;
  const visible = items.filter((n) => {
    if (filter === 'unread' && n.is_read) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${n.title || ''} ${n.message}`.toLowerCase().includes(q);
  });

  const markOne = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await api.markNotificationAsRead(id);
    } catch {
      void load();
    }
  };

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await api.markAllNotificationsAsRead();
    } catch {
      void load();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header: sarlavha + qidirish/filter */}
      <div className="sticky top-0 z-10 bg-surface-50 dark:bg-surface-950 pb-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-surface-900 dark:text-white">Bildirishnomalar</h1>
            <p className="text-xs text-surface-500 mt-0.5">
              {unread > 0 ? `${unread} ta o'qilmagan` : "Yangi xabar yo'q"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {unread > 0 && (
              <button type="button" onClick={markAll} className="text-xs font-medium text-brand-600 dark:text-brand-400 px-2 py-1.5">
                Barchasini o'qish
              </button>
            )}
            <button
              type="button"
              onClick={() => void load()}
              className="w-8 h-8 inline-flex items-center justify-center rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500"
              aria-label="Yangilash"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-8 pr-2.5 py-2 text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className="px-2 py-2 text-xs border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 rounded-xl"
          >
            <option value="all">Barchasi</option>
            <option value="unread">O'qilmagan</option>
          </select>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

      {loading ? (
        <p className="text-sm text-surface-500 py-10 text-center">Yuklanmoqda...</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 py-12 text-center">
          <Bell className="w-8 h-8 text-surface-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Bildirishnoma yo'q</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markOne(n.id)}
              className={`w-full text-left flex items-start gap-2.5 p-3 rounded-2xl border transition-colors duration-150 ${
                n.is_read
                  ? 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'
                  : 'bg-brand-50/70 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${n.is_read ? 'text-surface-700 dark:text-surface-300' : 'font-semibold text-surface-900 dark:text-white'}`}>
                    {n.title || n.message}
                  </p>
                  <span className="text-[11px] text-surface-400 shrink-0">{formatWhen(n.created_at)}</span>
                </div>
                {n.title && n.message && (
                  <p className="text-xs text-surface-500 line-clamp-2 mt-0.5">{n.message}</p>
                )}
              </div>
              {!n.is_read && <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />}
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
