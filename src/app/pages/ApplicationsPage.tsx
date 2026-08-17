import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, unwrapList } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

interface Application {
  id: number;
  name?: string;
  last_name?: string;
  status?: string;
  dormitory_name?: string;
  faculty?: string;
  course?: string;
  phone?: string;
  created_at?: string;
  gender?: string;
}

export function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getApplications({ status: status || undefined });
      setItems(unwrapList<Application>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Arizalar</h1>
          <p className="text-surface-600">Yotoqxona arizalari</p>
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm"
          >
            <option value="">Barchasi</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button onClick={load} className="p-2 border rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}
      {loading ? (
        <TableSkeleton cols={4} />
      ) : (
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Talaba
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Yotoqxona
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Kurs
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-surface-500">
                  Arizalar yo&apos;q
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-sm font-medium">
                    {[a.name, a.last_name].filter(Boolean).join(' ') || `#${a.id}`}
                    {a.phone && (
                      <span className="block text-xs text-surface-400">{a.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{a.dormitory_name || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    {a.course || '—'}
                    {a.faculty ? ` · ${a.faculty}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-100">
                      {a.status || '—'}
                    </span>
                  </td>
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
