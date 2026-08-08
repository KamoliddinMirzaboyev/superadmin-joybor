import { useEffect, useState } from 'react';
import { RefreshCw, Handshake, Building2, Home } from 'lucide-react';
import { api, unwrapList } from '../../services/api';

interface Uni {
  id: number;
  name: string;
  address?: string;
}

interface Dorm {
  id: number;
  name: string;
  university_name?: string;
  is_active?: boolean;
  month_price?: number;
  address?: string;
}

/**
 * CMS /public/partnership/ API yo'q.
 * Hamkorlik sahifasi real universitet + yotoqxona ma'lumotlaridan yig'iladi.
 */
export function PartnershipPage() {
  const [unis, setUnis] = useState<Uni[]>([]);
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [u, d, s] = await Promise.all([
        api.getUniversities(),
        api.getDormitories(),
        api.getStats().catch(() => null),
      ]);
      setUnis(unwrapList<Uni>(u));
      setDorms(unwrapList<Dorm>(d));
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rooms = (stats?.rooms as Record<string, unknown>) || {};
  const dormStats = (stats?.dormitories as Record<string, unknown>) || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hamkorlik</h1>
          <p className="text-gray-600 text-sm mt-1">
            CMS mock olib tashlandi — real `/universities/` va `/superadmin/dormitories/`
          </p>
        </div>
        <button onClick={load} className="p-2 border rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">Universitetlar</p>
              <p className="text-2xl font-bold">{unis.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">Yotoqxonalar</p>
              <p className="text-2xl font-bold">
                {Number(dormStats.total) || dorms.length}
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">Xonalar</p>
              <p className="text-2xl font-bold">{Number(rooms.total) || 0}</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">Sig‘im</p>
              <p className="text-2xl font-bold">{Number(rooms.capacity) || 0}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Universitetlar
          </h2>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {unis.length === 0 ? (
              <p className="text-gray-500 text-sm">Universitet yo‘q</p>
            ) : (
              unis.map((u) => (
                <div key={u.id} className="bg-white border rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.address || '—'}</p>
                </div>
              ))
            )}
          </div>

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Home className="w-5 h-5" /> Yotoqxonalar
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {dorms.length === 0 ? (
              <div className="text-gray-500 text-sm flex items-center gap-2">
                <Handshake className="w-4 h-4" /> Yotoqxona yo‘q
              </div>
            ) : (
              dorms.map((d) => (
                <div key={d.id} className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold text-gray-900">{d.name}</p>
                    <span className="text-xs text-gray-500">
                      {d.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{d.university_name || '—'}</p>
                  <p className="text-sm text-gray-600 mt-1">{d.address || '—'}</p>
                  {d.month_price != null && (
                    <p className="text-sm font-medium mt-1">
                      {Number(d.month_price).toLocaleString()} so‘m/oy
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
