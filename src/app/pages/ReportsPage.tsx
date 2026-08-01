import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export function ReportsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const s = await api.getStats();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hisobotlar</h1>
          <p className="text-gray-600">Umumiy platforma statistikasi (/stats/)</p>
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
        <pre className="bg-white border rounded-lg p-4 text-xs overflow-auto max-h-[70vh]">
          {JSON.stringify(stats, null, 2)}
        </pre>
      )}
    </div>
  );
}
