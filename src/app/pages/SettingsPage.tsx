import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function SettingsPage() {
  const [me, setMe] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then(setMe)
      .catch((e) => setError(e instanceof Error ? e.message : 'Yuklash xatosi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sozlamalar</h1>
      <p className="text-gray-600 mb-6">Joriy superadmin sessiyasi (`GET /me/`)</p>

      <div className="bg-white border rounded-lg p-6 space-y-3 text-sm">
        <p>
          <span className="font-semibold">API base:</span> https://api.joy-bor.uz/api
        </p>
        <p>
          <span className="font-semibold">Auth:</span> JWT Bearer (sessionStorage.access)
        </p>

        {loading && <p className="text-gray-500">Profil yuklanmoqda...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {me && (
          <div className="mt-4 space-y-1 border-t pt-4">
            <p>
              <span className="text-gray-500">Username:</span>{' '}
              {String(me.username || '—')}
            </p>
            <p>
              <span className="text-gray-500">Email:</span> {String(me.email || '—')}
            </p>
            <p>
              <span className="text-gray-500">Rol:</span> {String(me.role || '—')}
            </p>
            <p>
              <span className="text-gray-500">Ism:</span>{' '}
              {[me.first_name, me.last_name].filter(Boolean).join(' ') || '—'}
            </p>
            <p>
              <span className="text-gray-500">Superadmin:</span>{' '}
              {me.is_super_admin ? 'ha' : 'yo‘q'}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            api.logout();
            window.location.reload();
          }}
          className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
}
