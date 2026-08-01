import { useEffect, useState } from 'react';
import { Building2, RefreshCw, Plus } from 'lucide-react';
import { api, unwrapList, mediaUrl } from '../../services/api';

interface Uni {
  id: number;
  name: string;
  address?: string;
  description?: string;
  contact?: string;
  logo?: string | null;
}

export function UniversitiesPage() {
  const [items, setItems] = useState<Uni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getUniversities();
      setItems(unwrapList<Uni>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim() || !address.trim()) return;
    setSaving(true);
    try {
      await api.createUniversity({ name: name.trim(), address: address.trim() });
      setName('');
      setAddress('');
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yaratish xatosi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Universitetlar</h1>
          <p className="text-gray-600">API: GET/POST /universities/</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Qo&apos;shish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 space-y-3 max-w-lg">
          <input
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Nomi *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Manzil *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            onClick={create}
            disabled={saving}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Manzil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kontakt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Universitetlar yo&apos;q
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {u.logo && (
                        <img
                          src={mediaUrl(u.logo)}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      {u.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.contact || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
