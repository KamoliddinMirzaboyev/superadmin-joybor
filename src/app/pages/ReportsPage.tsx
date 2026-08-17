import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, unwrapList } from '../../services/api';
import { ReportsSkeleton } from '../components/Skeleton';

type Stats = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function section(obj: unknown): Record<string, unknown> {
  if (obj && typeof obj === 'object') return obj as Record<string, unknown>;
  return {};
}

export function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dash, setDash] = useState<Stats | null>(null);
  const [dorms, setDorms] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, d, dormList] = await Promise.all([
        api.getStats(),
        api.getDashboard().catch(() => null),
        api.getDormitories().catch(() => ({ results: [] })),
      ]);
      setStats(s);
      setDash(d);
      setDorms(unwrapList<Record<string, unknown>>(dormList));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const source = { ...(stats || {}), ...(dash || {}) };
  const users = section(source.users);
  const dormitories = section(source.dormitories);
  const rooms = section(source.rooms);
  const applications = section(source.applications);
  const universities = section(source.universities);
  const apartments = section(source.apartments);

  const cards = [
    { label: 'Universitetlar', value: num(universities.total ?? source.universities_count) },
    { label: 'Yotoqxonalar', value: num(dormitories.total ?? dorms.length) },
    { label: 'Faol yotoqxona', value: num(dormitories.active) },
    { label: 'Foydalanuvchilar', value: num(users.total) },
    { label: 'Talabalar', value: num(users.students) },
    { label: 'Adminlar', value: num(users.admins) },
    { label: 'Sardorlar', value: num(users.sardor) },
    { label: 'Xonalar', value: num(rooms.total) },
    { label: "Sig'im", value: num(rooms.capacity) },
    { label: 'Band joy', value: num(rooms.occupied) },
    { label: 'Bo‘sh joy', value: num(rooms.free) },
    { label: 'Bandlik %', value: num(rooms.occupancy_rate) },
    { label: 'Arizalar', value: num(applications.total) },
    { label: 'Kutilmoqda', value: num(applications.pending) },
    { label: 'Tasdiqlangan', value: num(applications.approved) },
    { label: 'Rad etilgan', value: num(applications.rejected) },
    { label: 'Apartments', value: num(apartments.total) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Hisobotlar</h1>
          <p className="text-surface-600">
            Universitet, yotoqxona va foydalanuvchi statistikasi
          </p>
        </div>
        <button onClick={load} className="p-2 border rounded-xl">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}
      {loading ? (
        <ReportsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <div
                key={c.label}
                className="bg-white border border-surface-200 rounded-xl p-4"
              >
                <p className="text-xs text-surface-500 uppercase tracking-wide">{c.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3">Yotoqxonalar</h2>
          <div className="bg-white border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Nomi</th>
                  <th className="px-4 py-2 text-left">Universitet</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Oylik</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dorms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-surface-500">
                      Bo‘sh
                    </td>
                  </tr>
                ) : (
                  dorms.map((d) => (
                    <tr key={String(d.id)}>
                      <td className="px-4 py-2 font-medium">{String(d.name || '-')}</td>
                      <td className="px-4 py-2">{String(d.university_name || '-')}</td>
                      <td className="px-4 py-2">
                        {d.is_active ? 'Faol' : 'Nofaol'}
                      </td>
                      <td className="px-4 py-2">
                        {d.month_price != null
                          ? Number(d.month_price).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
