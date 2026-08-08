import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api, unwrapList } from '../../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

/** Universitetlar bo'yicha yotoqxona soni — real API. */
export function CapacityChart() {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await api.getDormitories();
        const list = unwrapList<Record<string, unknown>>(raw);
        const map = new Map<string, number>();
        for (const d of list) {
          const name = String(d.university_name || 'Noma’lum');
          map.set(name, (map.get(name) || 0) + 1);
        }
        if (!cancelled) {
          setData(Array.from(map.entries()).map(([name, value]) => ({ name, value })));
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
        <h3 className="text-lg font-bold text-gray-900">Universitetlar bo‘yicha yotoqxona</h3>
        <p className="text-sm text-gray-500">`GET /superadmin/dormitories/`</p>
      </div>
      {loading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-sm text-gray-500">Ma’lumot yo‘q</p>
      )}
      {data.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
