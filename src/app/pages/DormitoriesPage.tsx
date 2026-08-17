import { useEffect, useState } from 'react';
import { Home, RefreshCw, Power, PowerOff, Plus, Pencil, Trash2 } from 'lucide-react';
import { api, unwrapList, mediaUrl } from '../../services/api';

interface Dorm {
  id: number;
  name: string;
  address?: string;
  university_name?: string;
  admin_name?: string;
  is_active?: boolean;
  month_price?: number;
  year_price?: number;
  phone_numer?: string;
  statistics?: Record<string, unknown> | string;
  room_statistics?: Record<string, unknown>;
  images?: Array<{ id: number; image: string }>;
  university?: number;
  admin?: number;
}

interface Uni {
  id: number;
  name: string;
}

interface AdminUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export function DormitoriesPage() {
  const [items, setItems] = useState<Dorm[]>([]);
  const [unis, setUnis] = useState<Uni[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const emptyForm = {
    name: '',
    address: '',
    university: '',
    admin: '',
    month_price: '',
    year_price: '',
    phone_numer: '',
    description: '',
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, u, a] = await Promise.all([
        api.getDormitories({ search: search || undefined }),
        api.getUniversities(),
        api.getAdminUsers(),
      ]);
      setItems(unwrapList<Dorm>(data));
      setUnis(unwrapList<Uni>(u));
      setAdmins(unwrapList<AdminUser>(a));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (d: Dorm) => {
    try {
      if (d.is_active) await api.deactivateDormitory(d.id);
      else await api.activateDormitory(d.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Amal bajarilmadi');
    }
  };

  const startEdit = (d: Dorm) => {
    setEditingId(d.id);
    setForm({
      name: d.name || '',
      address: d.address || '',
      university: d.university != null ? String(d.university) : '',
      admin: d.admin != null ? String(d.admin) : '',
      month_price: d.month_price != null ? String(d.month_price) : '',
      year_price: d.year_price != null ? String(d.year_price) : '',
      phone_numer: d.phone_numer || '',
      description: '',
    });
    setShowCreate(true);
  };

  const cancelForm = () => {
    setShowCreate(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (d: Dorm) =>
    runAction(
      () => api.deleteDormitory(d.id),
      `"${d.name}" yotoqxonasini butunlay o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.`
    );

  const runAction = async (fn: () => Promise<unknown>, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Amal bajarilmadi');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = {
        name: form.name.trim(),
        address: form.address.trim(),
        university: Number(form.university),
        admin: Number(form.admin),
        month_price: form.month_price ? Number(form.month_price) : undefined,
        year_price: form.year_price ? Number(form.year_price) : undefined,
        phone_numer: form.phone_numer || undefined,
        description: form.description || undefined,
      };
      if (editingId) {
        await api.updateDormitory(editingId, data);
      } else {
        await api.createDormitory({ ...data, is_active: true });
      }
      cancelForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yotoqxonalar</h1>
          <p className="text-gray-600">Superadmin API — barcha yotoqxonalar</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Qidirish..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            onClick={load}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => (showCreate ? cancelForm() : setShowCreate(true))}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi yotoqxona
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="sm:col-span-2 text-sm font-medium text-gray-700">
            {editingId ? `Tahrirlash: ${form.name || `#${editingId}`}` : 'Yangi yotoqxona'}
          </div>
          <label className="text-sm sm:col-span-2">
            <span className="text-gray-600">Nomi *</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-gray-600">Manzil *</span>
            <input
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Universitet *</span>
            <select
              required
              value={form.university}
              onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Tanlang</option>
              {unis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Admin *</span>
            <select
              required
              value={form.admin}
              onChange={(e) => setForm((f) => ({ ...f, admin: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Tanlang</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>
                  {[a.first_name, a.last_name].filter(Boolean).join(' ') ||
                    a.username ||
                    `#${a.id}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Oylik narx</span>
            <input
              type="number"
              value={form.month_price}
              onChange={(e) => setForm((f) => ({ ...f, month_price: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Yillik narx</span>
            <input
              type="number"
              value={form.year_price}
              onChange={(e) => setForm((f) => ({ ...f, year_price: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Telefon</span>
            <input
              value={form.phone_numer}
              onChange={(e) => setForm((f) => ({ ...f, phone_numer: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-gray-600">Tavsif</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Yaratish'}
            </button>
            <button type="button" onClick={cancelForm} className="px-4 py-2 border rounded-lg text-sm">
              Bekor
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500">
          <Home className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          Yotoqxonalar topilmadi
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d) => {
            const img = d.images?.[0]?.image;
            const stats =
              (typeof d.statistics === 'object' && d.statistics) ||
              d.room_statistics ||
              {};
            const totalRooms =
              (stats as { total?: { rooms?: number } })?.total?.rooms ??
              (stats as { rooms?: number })?.rooms ??
              '—';
            return (
              <div
                key={d.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {img && (
                  <img
                    src={mediaUrl(img)}
                    alt={d.name}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{d.name}</h3>
                      <p className="text-sm text-gray-500">
                        {d.university_name || d.address || '—'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        d.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {d.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Admin: <span className="font-medium">{d.admin_name || '—'}</span>
                    </p>
                    <p>
                      Xonalar: <span className="font-medium">{String(totalRooms)}</span>
                    </p>
                    <p>
                      Oyiga:{' '}
                      <span className="font-medium">
                        {d.month_price != null
                          ? `${d.month_price.toLocaleString()} so'm`
                          : '—'}
                      </span>
                    </p>
                    {d.phone_numer && <p>Tel: {d.phone_numer}</p>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleActive(d)}
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      {d.is_active ? (
                        <>
                          <PowerOff className="w-4 h-4" /> Nofaol
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4" /> Faollashtirish
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(d)}
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" /> Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(d)}
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" /> O&apos;chirish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
