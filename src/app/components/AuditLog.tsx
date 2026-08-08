import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { api, unwrapList } from '../../services/api';

interface LogRow {
  id: string;
  user: string;
  action: string;
  details: string;
  time: string;
  type: 'create' | 'update' | 'info';
}

/**
 * Audit-log endpoint yo'q. So'nggi arizalar + to'lovlardan faoliyat lenta.
 */
export function AuditLog() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [apps, payments] = await Promise.all([
          api.getApplications().catch(() => ({ results: [] })),
          api.getPayments().catch(() => ({ results: [] })),
        ]);
        const appList = unwrapList<Record<string, unknown>>(apps);
        const payList = unwrapList<Record<string, unknown>>(payments);
        const rows: LogRow[] = [];

        for (const a of appList.slice(0, 10)) {
          rows.push({
            id: `app-${a.id}`,
            user: String(a.name || a.user_name || 'Ariza'),
            action: 'Ariza',
            details: String(a.status || a.dormitory_name || ''),
            time: String(a.created_at || a.updated_at || ''),
            type: 'info',
          });
        }
        for (const p of payList.slice(0, 10)) {
          rows.push({
            id: `pay-${p.id}`,
            user: String(p.student_name || p.user_name || 'To‘lov'),
            action: 'To‘lov',
            details: `${p.amount ?? p.sum ?? ''} · ${p.status ?? ''}`,
            time: String(p.created_at || p.date || ''),
            type: 'update',
          });
        }
        rows.sort((a, b) => String(b.time).localeCompare(String(a.time)));
        if (!cancelled) setLogs(rows.slice(0, 15));
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
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">So‘nggi faoliyat</h3>
          <p className="text-sm text-gray-500">
            Audit API yo‘q — arizalar/to‘lovlar ro‘yxatidan
          </p>
        </div>
      </div>
      {loading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && logs.length === 0 && (
        <p className="text-sm text-gray-500">Yozuv yo‘q</p>
      )}
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{log.user}</span>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                  {log.action}
                </span>
              </div>
              <p className="text-sm text-gray-600">{log.details}</p>
              {log.time && <div className="text-xs text-gray-500 mt-1">{log.time}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
