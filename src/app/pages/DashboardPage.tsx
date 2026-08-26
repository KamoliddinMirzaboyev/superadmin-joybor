import { useEffect, useState } from 'react';
import { Building2, Users, Home, FileText, MessageSquare, Wallet, RefreshCw } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { DashboardSkeleton } from '../components/Skeleton';
import { api, unwrapList } from '../../services/api';

type Dash = Record<string, unknown>;

interface Complaint {
  status?: string;
}

interface SubscriptionPayment {
  amount?: number;
  status?: string;
}

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

function money(n: number): string {
  return `${n.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
}

export function DashboardPage() {
  const [dash, setDash] = useState<Dash | null>(null);
  const [stats, setStats] = useState<Dash | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [d, s, c, p] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getStats().catch(() => null),
        api.getComplaints().catch(() => []),
        api.getSubscriptionPayments().catch(() => []),
      ]);
      setDash(d);
      setStats(s);
      setComplaints(unwrapList<Complaint>(c));
      setPayments(unwrapList<SubscriptionPayment>(p));
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
  const applications = pick(source, 'applications') as Dash | undefined;

  const pendingComplaints = complaints.filter((c) => c.status === 'pending').length;
  const revenue = payments
    .filter((p) => p.status === 'APPROVED')
    .reduce((sum, p) => sum + num(p.amount), 0);
  const pendingRevenue = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + num(p.amount), 0);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">Tizimning umumiy ko‘rinishi</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          Yangilash
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Universitetlar"
          icon={Building2}
          color="success"
          stats={[
            { label: 'Jami', value: String(num(pick(universities, 'total', 'count'), num(source.universities_count))) },
            { label: 'Faol', value: String(num(pick(universities, 'active'), num(pick(universities, 'total')))) },
          ]}
        />
        <KPICard
          title="Foydalanuvchilar"
          icon={Users}
          color="brand"
          stats={[
            { label: 'Jami', value: String(num(pick(users, 'total', 'count'))) },
            { label: 'Talaba', value: String(num(pick(users, 'students'))) },
            { label: 'Admin', value: String(num(pick(users, 'admins'))) },
          ]}
        />
        <KPICard
          title="Yotoqxonalar"
          icon={Home}
          color="warning"
          stats={[
            { label: 'Jami', value: String(num(pick(dormitories, 'total', 'count'))) },
            { label: 'Faol', value: String(num(pick(dormitories, 'active'), num(pick(dormitories, 'total')))) },
          ]}
        />
        <KPICard
          title="Shikoyat va takliflar"
          icon={MessageSquare}
          color="danger"
          stats={[
            { label: 'Jami', value: String(complaints.length) },
            { label: 'Yangi', value: String(pendingComplaints) },
          ]}
        />
        <KPICard
          title="Arizalar"
          icon={FileText}
          color="info"
          stats={[
            { label: 'Jami', value: String(num(pick(applications, 'total'))) },
            { label: 'Pending', value: String(num(pick(applications, 'pending'))) },
          ]}
        />
        <KPICard
          title="Platforma daromadi"
          icon={Wallet}
          color="success"
          stats={[
            { label: 'Tasdiqlangan', value: money(revenue) },
            { label: 'Kutilmoqda', value: money(pendingRevenue) },
          ]}
        />
      </div>
    </div>
  );
}
