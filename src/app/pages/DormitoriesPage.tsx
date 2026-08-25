import { useEffect, useState } from 'react';
import {
  Home,
  RefreshCw,
  Power,
  PowerOff,
  Plus,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  DoorOpen,
  BedDouble,
  Banknote,
  Phone,
  User,
} from 'lucide-react';
import { api, unwrapList, mediaUrl, type TariffPlan } from '../../services/api';
import { CardsSkeleton } from '../components/Skeleton';

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
  tariff?: number | null;
  tariff_name?: string;
  paid_until?: string | null;
  last_billing_reminder?: string | null;
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
  const [tariffs, setTariffs] = useState<TariffPlan[]>([]);
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
    tariff: '',
    paid_until: '',
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, u, a, t] = await Promise.all([
        api.getDormitories({ search: search || undefined }),
        api.getUniversities(),
        api.getAdminUsers(),
        api.getTariffs(),
      ]);
      setItems(unwrapList<Dorm>(data));
      setUnis(unwrapList<Uni>(u));
      setAdmins(unwrapList<AdminUser>(a));
      setTariffs(unwrapList<TariffPlan>(t));
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
      tariff: d.tariff != null ? String(d.tariff) : '',
      paid_until: d.paid_until || '',
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
        tariff: form.tariff ? Number(form.tariff) : undefined,
        paid_until: form.paid_until || undefined,
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
          <h1 className="text-3xl font-bold text-surface-900">Yotoqxonalar</h1>
          <p className="text-surface-600">Barcha yotoqxonalarni boshqarish</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Qidirish..."
            className="px-3 py-2 border border-surface-200 rounded-xl text-sm"
          />
          <button
            onClick={load}
            className="inline-flex items-center px-3 py-2 border border-surface-200 rounded-xl text-sm hover:bg-surface-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => (showCreate ? cancelForm() : setShowCreate(true))}
            className="inline-flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi yotoqxona
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white border border-surface-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="sm:col-span-2 text-sm font-medium text-surface-700">
            {editingId ? `Tahrirlash: ${form.name || `#${editingId}`}` : 'Yangi yotoqxona'}
          </div>
          <label className="text-sm sm:col-span-2">
            <span className="text-surface-600">Nomi *</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-surface-600">Manzil *</span>
            <input
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm">
            <span className="text-surface-600">Universitet *</span>
            <select
              required
              value={form.university}
              onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
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
            <span className="text-surface-600">Admin *</span>
            <select
              required
              value={form.admin}
              onChange={(e) => setForm((f) => ({ ...f, admin: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
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
            <span className="text-surface-600">Oylik narx</span>
            <input
              type="number"
              value={form.month_price}
              onChange={(e) => setForm((f) => ({ ...f, month_price: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm">
            <span className="text-surface-600">Yillik narx</span>
            <input
              type="number"
              value={form.year_price}
              onChange={(e) => setForm((f) => ({ ...f, year_price: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm">
            <span className="text-surface-600">Telefon</span>
            <input
              value={form.phone_numer}
              onChange={(e) => setForm((f) => ({ ...f, phone_numer: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm">
            <span className="text-surface-600">Tarif</span>
            <select
              value={form.tariff}
              onChange={(e) => setForm((f) => ({ ...f, tariff: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            >
              <option value="">Tanlanmagan</option>
              {tariffs.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-surface-600">To'lov muddati</span>
            <input
              type="date"
              value={form.paid_until}
              onChange={(e) => setForm((f) => ({ ...f, paid_until: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-surface-600">Tavsif</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
              rows={2}
            />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm disabled:opacity-50"
            >
              {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Yaratish'}
            </button>
            <button type="button" onClick={cancelForm} className="px-4 py-2 border rounded-xl text-sm">
              Bekor
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <CardsSkeleton />
      ) : items.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-xl p-10 text-center text-surface-500">
          <Home className="w-10 h-10 mx-auto mb-3 text-surface-300" />
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
            const statsObj = stats as {
              total?: { rooms?: number; capacity?: number; free?: number };
              rooms?: number;
              capacity?: number;
              free?: number;
            };
            const totalRooms = statsObj.total?.rooms ?? statsObj.rooms ?? '—';
            const freeSpots = statsObj.total?.free ?? statsObj.free;
            const capacity = statsObj.total?.capacity ?? statsObj.capacity;
            return (
              <div
                key={d.id}
                className="group bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-200 flex flex-col"
              >
                {/* Banner */}
                <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
                  {img ? (
                    <img
                      src={mediaUrl(img)}
                      alt={d.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  {img && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  )}

                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      d.is_active
                        ? 'bg-success-500 text-white'
                        : 'bg-surface-700/85 text-white'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        d.is_active ? 'bg-white' : 'bg-surface-300/80'
                      }`}
                    />
                    {d.is_active ? 'Faol' : 'Nofaol'}
                  </span>

                  {(d.university_name || d.address) && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 text-surface-700 backdrop-blur-sm max-w-[75%]">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-brand-600" />
                      <span className="truncate">{d.university_name || d.address}</span>
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 leading-snug">
                      {d.name}
                    </h3>
                    {d.address && d.university_name && (
                      <p className="flex items-start gap-1.5 mt-1 text-sm text-surface-500">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-surface-400" />
                        <span className="line-clamp-2">{d.address}</span>
                      </p>
                    )}
                  </div>
                  {/* Stats */}
                  <div
                    className={`grid gap-2 ${freeSpots != null || capacity != null ? 'grid-cols-3' : 'grid-cols-2'}`}
                  >
                    <div className="rounded-xl bg-surface-50 border border-surface-100 p-2.5 text-center">
                      <DoorOpen className="w-4 h-4 mx-auto mb-1 text-brand-600" />
                      <p className="text-lg font-semibold text-surface-900 leading-none">
                        {String(totalRooms)}
                      </p>
                      <p className="text-[11px] text-surface-500 mt-1">Xona</p>
                    </div>
                    <div className="rounded-xl bg-surface-50 border border-surface-100 p-2.5 text-center">
                      <BedDouble className="w-4 h-4 mx-auto mb-1 text-info-600" />
                      <p className="text-lg font-semibold text-surface-900 leading-none">
                        {capacity != null ? String(capacity) : '—'}
                      </p>
                      <p className="text-[11px] text-surface-500 mt-1">O'rin</p>
                    </div>
                    {freeSpots != null && (
                      <div className="rounded-xl bg-brand-50 border border-brand-100 p-2.5 text-center">
                        <BedDouble className="w-4 h-4 mx-auto mb-1 text-brand-600" />
                        <p className="text-lg font-semibold text-success-700 leading-none">
                          {String(freeSpots)}
                        </p>
                        <p className="text-[11px] text-surface-500 mt-1">Bo'sh</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-100 px-3 py-2.5 text-sm">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Banknote className="w-4 h-4 text-brand-600" /> Oylik narx
                    </span>
                    <span className="font-semibold text-surface-900">
                      {d.month_price != null
                        ? `${d.month_price.toLocaleString()} so'm`
                        : '—'}
                    </span>
                  </div>

                  {(d.tariff_name || d.paid_until) && (
                    <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-100 px-3 py-2.5 text-sm">
                      <span className="text-surface-500">
                        {d.tariff_name || 'Tarif'}
                      </span>
                      {d.paid_until && (
                        <span
                          className={`font-semibold ${
                            new Date(d.paid_until) < new Date()
                              ? 'text-danger-600'
                              : 'text-surface-900'
                          }`}
                        >
                          {new Date(d.paid_until) < new Date() ? "Muddati o'tgan · " : ''}
                          {d.paid_until}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5 text-sm text-surface-600">
                    {d.admin_name && (
                      <p className="flex items-center gap-1.5">
                        <User className="w-4 h-4 shrink-0 text-surface-400" />
                        Admin: <span className="font-medium text-surface-800">{d.admin_name}</span>
                      </p>
                    )}
                    {d.phone_numer && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 shrink-0 text-surface-400" />
                        {d.phone_numer}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-surface-100">
                    <button
                      onClick={() => toggleActive(d)}
                      className={`inline-flex items-center justify-center gap-1.5 text-sm px-2 py-2 rounded-lg border font-medium transition-colors duration-150 shrink-0 min-w-0 ${
                        d.is_active
                          ? 'border-surface-200 text-surface-600 hover:bg-surface-50'
                          : 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700'
                      }`}
                    >
                      {d.is_active ? (
                        <>
                          <PowerOff className="w-4 h-4 shrink-0" /> Nofaol
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 shrink-0" /> Faol
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(d)}
                      className="inline-flex items-center justify-center gap-1.5 text-sm px-2 py-2 rounded-lg border border-surface-200 text-surface-700 hover:bg-surface-50 transition-colors duration-150 shrink-0 min-w-0"
                    >
                      <Pencil className="w-4 h-4 shrink-0" /> O'zgartir
                    </button>
                    <button
                      onClick={() => handleDelete(d)}
                      className="inline-flex items-center justify-center gap-1.5 text-sm px-2 py-2 rounded-lg border border-danger-100 bg-danger-50 text-danger-700 hover:bg-danger-100 transition-colors duration-150 shrink-0 min-w-0"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" /> O'chirish
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
