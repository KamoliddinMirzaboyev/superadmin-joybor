import { useEffect, useState } from 'react';
import { Home, RefreshCw, Power, PowerOff } from 'lucide-react';
import { api, unwrapList, mediaUrl } from '../../services/api';

interface Dorm {
  id: number;
  name: string;
  address?: string;
  university_name?: string;
  admin_name?: string;
  is_active?: boolean;
  month_price?: number;
  year_price?: number;
  phone_numer?: string;
  statistics?: Record<string, unknown> | string;
  room_statistics?: Record<string, unknown>;
  images?: Array<{ id: number; image: string }>;
}

export function DormitoriesPage() {
  const [items, setItems] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDormitories({ search: search || undefined });
      setItems(unwrapList<Dorm>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (d: Dorm) => {
    try {
      if (d.is_active) await api.deactivateDormitory(d.id);
      else await api.activateDormitory(d.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Amal bajarilmadi');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yotoqxonalar</h1>
          <p className="text-gray-600">Superadmin API — barcha yotoqxonalar</p>
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Qidirish..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            onClick={load}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500">
          <Home className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          Yotoqxonalar topilmadi
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d) => {
            const img = d.images?.[0]?.image;
            const stats =
              (typeof d.statistics === 'object' && d.statistics) ||
              d.room_statistics ||
              {};
            const totalRooms =
              (stats as { total?: { rooms?: number } })?.total?.rooms ??
              (stats as { rooms?: number })?.rooms ??
              '—';
            return (
              <div
                key={d.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {img && (
                  <img
                    src={mediaUrl(img)}
                    alt={d.name}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{d.name}</h3>
                      <p className="text-sm text-gray-500">
                        {d.university_name || d.address || '—'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        d.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {d.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Admin: <span className="font-medium">{d.admin_name || '—'}</span>
                    </p>
                    <p>
                      Xonalar: <span className="font-medium">{String(totalRooms)}</span>
                    </p>
                    <p>
                      Oyiga:{' '}
                      <span className="font-medium">
                        {d.month_price != null ? `${d.month_price.toLocaleString()} so'm` : '—'}
                      </span>
                    </p>
                    {d.phone_numer && <p>Tel: {d.phone_numer}</p>}
                  </div>
                  <button
                    onClick={() => toggleActive(d)}
                    className="mt-4 inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    {d.is_active ? (
                      <>
                        <PowerOff className="w-4 h-4" /> O&apos;chirish
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" /> Faollashtirish
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
