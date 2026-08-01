import { useEffect, useState } from 'react';
import { Building2, Users, Home, DollarSign, RefreshCw } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { api, unwrapList } from '../../services/api';

type Dash = Record<string, unknown>;

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function pick(obj: unknown, ...keys: string[]): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    if (o[k] !== undefined && o[k] !== null) return o[k];
  }
  return undefined;
}

export function DashboardPage() {
  const [dash, setDash] = useState<Dash | null>(null);
  const [stats, setStats] = useState<Dash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [d, s] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getStats().catch(() => null),
      ]);
      setDash(d);
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

  const source = dash || stats || {};
  const universities = pick(source, 'universities') as Dash | undefined;
  const users = pick(source, 'users') as Dash | undefined;
  const dormitories = pick(source, 'dormitories') as Dash | undefined;
  const rooms = pick(source, 'rooms') as Dash | undefined;
  const applications = pick(source, 'applications') as Dash | undefined;
  const payments = pick(source, 'payments') as Dash | undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Superadmin API statistikasi</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Yangilash
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="UNIVERSITETLAR"
          icon={Building2}
          color="green"
          stats={[
            { label: 'Jami', value: String(num(pick(universities, 'total', 'count'), num(source.universities_count))) },
            { label: 'Faol', value: String(num(pick(universities, 'active'), num(pick(universities, 'total')))) },
          ]}
        />
        <KPICard
          title="FOYDALANUVCHILAR"
          icon={Users}
          color="blue"
          stats={[
            { label: 'Jami', value: String(num(pick(users, 'total', 'count'))) },
            { label: 'Talaba', value: String(num(pick(users, 'students'))) },
            { label: 'Admin', value: String(num(pick(users, 'admins'))) },
          ]}
        />
        <KPICard
          title="YOTOQXONALAR"
          icon={Home}
          color="amber"
          stats={[
            { label: 'Binolar', value: String(num(pick(dormitories, 'total', 'count'))) },
            { label: 'Xonalar', value: String(num(pick(rooms, 'total'))) },
            { label: "Sig'im", value: String(num(pick(rooms, 'capacity'))) },
          ]}
        />
        <KPICard
          title="ARIZA / TO'LOV"
          icon={DollarSign}
          color="red"
          stats={[
            { label: 'Arizalar', value: String(num(pick(applications, 'total'))) },
            { label: 'Pending', value: String(num(pick(applications, 'pending'))) },
            { label: "To'lovlar", value: String(num(pick(payments, 'total', 'count'))) },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Xona bandligi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Band</p>
            <p className="text-xl font-bold">{num(pick(rooms, 'occupied'))}</p>
          </div>
          <div>
            <p className="text-gray-500">Bo&apos;sh</p>
            <p className="text-xl font-bold">{num(pick(rooms, 'free'))}</p>
          </div>
          <div>
            <p className="text-gray-500">Occupancy</p>
            <p className="text-xl font-bold">{num(pick(rooms, 'occupancy_rate'))}%</p>
          </div>
          <div>
            <p className="text-gray-500">Sardorlar</p>
            <p className="text-xl font-bold">{num(pick(users, 'sardor'))}</p>
          </div>
        </div>
        {!dash && stats && (
          <p className="text-xs text-gray-400 mt-4">
            Superadmin dashboard 403/404 bo&apos;lsa umumiy /stats/ ishlatildi
          </p>
        )}
      </div>
    </div>
  );
}
