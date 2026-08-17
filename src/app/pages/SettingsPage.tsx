import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FormCardSkeleton } from '../components/Skeleton';

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
      <h1 className="text-3xl font-bold text-surface-900 mb-2">Sozlamalar</h1>
      <p className="text-surface-600 mb-6">Profil ma'lumotlari</p>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <div className="bg-white border border-surface-200 rounded-2xl shadow-sm p-6 space-y-3 text-sm">
          {error && <p className="text-danger-600">{error}</p>}
          {me && (
            <div className="space-y-2">
              <p>
                <span className="text-surface-500">Username:</span>{' '}
                <span className="font-medium text-surface-900">{String(me.username || '—')}</span>
              </p>
              <p>
                <span className="text-surface-500">Email:</span>{' '}
                <span className="font-medium text-surface-900">{String(me.email || '—')}</span>
              </p>
              <p>
                <span className="text-surface-500">Rol:</span>{' '}
                <span className="font-medium text-surface-900">{String(me.role || '—')}</span>
              </p>
              <p>
                <span className="text-surface-500">Ism:</span>{' '}
                <span className="font-medium text-surface-900">
                  {[me.first_name, me.last_name].filter(Boolean).join(' ') || '—'}
                </span>
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              api.logout();
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm hover:bg-brand-700 transition-colors duration-150"
          >
            Chiqish
          </button>
        </div>
      )}
    </div>
  );
}
