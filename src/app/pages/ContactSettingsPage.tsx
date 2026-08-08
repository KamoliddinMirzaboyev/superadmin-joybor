import { useEffect, useState } from 'react';
import { RefreshCw, Phone } from 'lucide-react';
import { api, unwrapList } from '../../services/api';

interface DormContact {
  id: number;
  name: string;
  address?: string;
  phone_numer?: string;
  university_name?: string;
  admin_name?: string;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
}

/**
 * CMS /public/contact/ API hali backendda yo'q.
 * Aloqa ma'lumotlari real yotoqxona yozuvlaridan olinadi.
 */
export function ContactSettingsPage() {
  const [items, setItems] = useState<DormContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDormitories();
      setItems(unwrapList<DormContact>(data));
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
          <h1 className="text-3xl font-bold text-gray-900">Aloqa ma&apos;lumotlari</h1>
          <p className="text-gray-600 text-sm mt-1">
            Public CMS endpoint yo‘q — yotoqxonalar API dagi telefon/manzil ko‘rsatiladi.
            Tahrirlash: Yotoqxonalar bo‘limida.
          </p>
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
      ) : items.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-500">
          <Phone className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          Yotoqxona topilmadi
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{d.name}</h3>
                  <p className="text-sm text-gray-500">{d.university_name || '—'}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    d.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {d.is_active ? 'Faol' : 'Nofaol'}
                </span>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <span className="text-gray-500">Telefon:</span>{' '}
                  {d.phone_numer || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Admin:</span> {d.admin_name || '—'}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-gray-500">Manzil:</span> {d.address || '—'}
                </p>
                {(d.latitude != null || d.longitude != null) && (
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Geo:</span> {d.latitude},{' '}
                    {d.longitude}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
