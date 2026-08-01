import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, unwrapList } from '../../services/api';

interface AdminUser {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
}

export function UsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [a, u] = await Promise.all([
        api.getAdminUsers({ search: search || undefined }),
        api.getUsers().catch(() => ({ results: [] })),
      ]);
      setAdmins(unwrapList<AdminUser>(a));
      setUsers(unwrapList<AdminUser>(u));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTable = (title: string, rows: AdminUser[]) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Foydalanuvchi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tel / Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">
                  Bo&apos;sh
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={`${title}-${u.id}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {u.full_name ||
                      [u.first_name, u.last_name].filter(Boolean).join(' ') ||
                      u.username ||
                      `#${u.id}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.role || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.phone || u.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.is_active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.is_active !== false ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-gray-600">Admin-users + Users API</p>
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Admin qidirish..."
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button onClick={load} className="p-2 border rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      {loading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : (
        <>
          {renderTable('Admin foydalanuvchilar', admins)}
          {renderTable('Barcha users', users)}
        </>
      )}
    </div>
  );
}
