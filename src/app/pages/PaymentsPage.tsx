import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, unwrapList } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

interface Payment {
  id: number;
  student?: number;
  student_info?: string;
  dormitory_name?: string;
  amount?: number;
  method?: string;
  status?: string;
  paid_date?: string;
  valid_until?: string;
}

export function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPayments();
      setItems(unwrapList<Payment>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">To&apos;lovlar</h1>
          <p className="text-surface-600">Tizimdagi to‘lovlar ro‘yxati</p>
        </div>
        <button onClick={load} className="p-2 border rounded-xl">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}
      {loading ? (
        <TableSkeleton cols={5} />
      ) : (
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Talaba
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Summa
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Usul
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-surface-500">
                  To&apos;lovlar yo&apos;q
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm">{p.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {p.student_info || p.student || '—'}
                    {p.dormitory_name ? (
                      <span className="block text-xs text-surface-400">{p.dormitory_name}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {p.amount != null ? `${Number(p.amount).toLocaleString()} so'm` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">{p.method || '—'}</td>
                  <td className="px-4 py-3 text-sm">{p.status || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
