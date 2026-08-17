import { useEffect, useState } from 'react';
import { Building2, RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';
import { api, unwrapList, mediaUrl } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

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
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setAddress('');
  };

  const startEdit = (u: Uni) => {
    setEditingId(u.id);
    setName(u.name);
    setAddress(u.address || '');
    setShowForm(true);
  };

  const create = async () => {
    if (!name.trim() || !address.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await api.updateUniversity(editingId, { name: name.trim(), address: address.trim() });
      } else {
        await api.createUniversity({ name: name.trim(), address: address.trim() });
      }
      cancelForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u: Uni) => {
    if (!window.confirm(`"${u.name}" universitetini butunlay o'chirmoqchimisiz?`)) return;
    try {
      await api.deleteUniversity(u.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Amal bajarilmadi');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Universitetlar</h1>
          <p className="text-surface-600">Universitetlarni boshqarish</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="p-2 border border-surface-200 rounded-xl hover:bg-surface-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => (showForm ? cancelForm() : setShowForm(true))}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Qo&apos;shish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 bg-white border border-surface-200 rounded-xl p-4 space-y-3 max-w-lg">
          <input
            className="w-full px-3 py-2 border rounded-xl"
            placeholder="Nomi *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-xl"
            placeholder="Manzil *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={create}
              disabled={saving}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm disabled:opacity-50"
            >
              {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Yaratish'}
            </button>
            <button onClick={cancelForm} className="px-4 py-2 border rounded-xl text-sm">
              Bekor
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <TableSkeleton cols={4} />
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Manzil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Kontakt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-surface-500">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-surface-300" />
                  Universitetlar yo&apos;q
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 text-sm font-medium text-surface-900">
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
                  <td className="px-6 py-4 text-sm text-surface-500">{u.address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{u.contact || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-1">
                      <button
                        title="Tahrirlash"
                        onClick={() => startEdit(u)}
                        className="p-1.5 border rounded hover:bg-surface-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="O'chirish"
                        onClick={() => remove(u)}
                        className="p-1.5 border rounded hover:bg-danger-50 text-danger-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
