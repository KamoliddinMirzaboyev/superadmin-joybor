import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api, unwrapList } from '../../services/api';

/** Real to'lovlar ro'yxatidan oddiy agregat (mock oylik chart o'rniga). */
export function RevenueChart() {
  const [data, setData] = useState<Array<{ label: string; amount: number; count: number }>>(
    []
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await api.getPayments();
        const list = unwrapList<Record<string, unknown>>(raw);
        const byStatus = new Map<string, { amount: number; count: number }>();
        for (const p of list) {
          const status = String(p.status || p.payment_status || 'unknown');
          const amount = Number(p.amount || p.sum || 0) || 0;
          const cur = byStatus.get(status) || { amount: 0, count: 0 };
          cur.amount += amount;
          cur.count += 1;
          byStatus.set(status, cur);
        }
        if (!cancelled) {
          setData(
            Array.from(byStatus.entries()).map(([label, v]) => ({
              label,
              amount: v.amount,
              count: v.count,
            }))
          );
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Xato');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">To‘lovlar holati</h3>
        <p className="text-sm text-gray-500">`GET /payments/` real ma’lumot</p>
      </div>
      {loading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-sm text-gray-500">To‘lov yozuvlari yo‘q</p>
      )}
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#059669" name="Summa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="count" fill="#2563eb" name="Soni" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
