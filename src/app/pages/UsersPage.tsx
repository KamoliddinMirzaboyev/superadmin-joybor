import { useEffect, useState } from 'react';
import { RefreshCw, UserPlus, Power, PowerOff, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';
import { api, unwrapList } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

interface AppUser {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  is_super_admin?: boolean;
}

const emptyForm = {
  username: '',
  password: '',
  password2: '',
  email: '',
  phone: '',
  first_name: '',
  last_name: '',
  role: 'admin',
};

export function UsersPage() {
  const [admins, setAdmins] = useState<AppUser[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [a, u] = await Promise.all([
        api.getAdminUsers({ search: search || undefined }),
        api.getSuperadminUsers({ search: search || undefined }).catch(() =>
          api.getUsers()
        ),
      ]);
      setAdmins(unwrapList<AppUser>(a));
      setUsers(unwrapList<AppUser>(u));
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

  const displayName = (u: AppUser) =>
    u.full_name ||
    [u.first_name, u.last_name].filter(Boolean).join(' ') ||
    u.username ||
    `#${u.id}`;

  const runAction = async (fn: () => Promise<unknown>, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Amal bajarilmadi');
    }
  };

  const startEdit = (u: AppUser) => {
    setEditingId(u.id);
    setForm({
      username: u.username || '',
      password: '',
      password2: '',
      email: u.email || '',
      phone: u.phone || '',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      role: u.role || 'admin',
    });
    setShowCreate(true);
  };

  const cancelForm = () => {
    setShowCreate(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password || form.password2) {
      if (form.password !== form.password2) {
        setError('Parollar mos emas');
        return;
      }
    } else if (!editingId) {
      setError('Parol talab qilinadi');
      return;
    }
    if (form.role === 'superadmin' && !editingId) {
      const ok = window.confirm(
        "Superadmin yaratish to'liq tizim huquqini beradi. Davom etasizmi?"
      );
      if (!ok) return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        // ponytail: PATCH — faqat to'ldirilgan maydonlar yuboriladi, parol bo'sh bo'lsa o'zgartirilmaydi
        const data: Record<string, unknown> = {
          username: form.username,
          email: form.email || undefined,
          phone: form.phone || undefined,
          first_name: form.first_name || undefined,
          last_name: form.last_name || undefined,
          role: form.role,
        };
        if (form.password) {
          data.password = form.password;
          data.password2 = form.password2;
        }
        await api.updateSuperadminUser(editingId, data);
      } else {
        await api.createSuperadminUser({
          username: form.username,
          password: form.password,
          password2: form.password2,
          email: form.email || undefined,
          phone: form.phone || undefined,
          first_name: form.first_name || undefined,
          last_name: form.last_name || undefined,
          role: form.role,
          is_active: true,
        });
      }
      cancelForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  const renderTable = (title: string, rows: AppUser[], withActions = false) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-surface-900 mb-3">{title}</h2>
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Foydalanuvchi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Tel / Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                Status
              </th>
              {withActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">
                  Amallar
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={withActions ? 5 : 4}
                  className="px-4 py-6 text-center text-surface-500 text-sm"
                >
                  Bo‘sh
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={`${title}-${u.id}`}>
                  <td className="px-4 py-3 text-sm font-medium text-surface-900">
                    {displayName(u)}
                    {u.username && (
                      <div className="text-xs text-surface-500">@{u.username}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-600">{u.role || '-'}</td>
                  <td className="px-4 py-3 text-sm text-surface-600">
                    {u.phone || u.email || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.is_active !== false
                          ? 'bg-success-100 text-success-700'
                          : 'bg-surface-100 text-surface-600'
                      }`}
                    >
                      {u.is_active !== false ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  {withActions && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {u.is_active !== false ? (
                          <button
                            type="button"
                            title="Nofaol"
                            onClick={() =>
                              runAction(
                                () => api.deactivateUser(u.id),
                                `${displayName(u)} hisobini nofaol qilmoqchimisiz?`
                              )
                            }
                            className="p-1.5 border rounded hover:bg-surface-50"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Faollashtirish"
                            onClick={() => runAction(() => api.activateUser(u.id))}
                            className="p-1.5 border rounded hover:bg-surface-50"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Promote"
                          onClick={() =>
                            runAction(
                              () => api.promoteUser(u.id),
                              `${displayName(u)} rolini oshirmoqchimisiz (promote)?`
                            )
                          }
                          className="p-1.5 border rounded hover:bg-surface-50"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Demote"
                          onClick={() =>
                            runAction(
                              () => api.demoteUser(u.id),
                              `${displayName(u)} rolini pasaytirmoqchimisiz (demote)?`
                            )
                          }
                          className="p-1.5 border rounded hover:bg-surface-50"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Tahrirlash"
                          onClick={() => startEdit(u)}
                          className="p-1.5 border rounded hover:bg-surface-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="O'chirish"
                          onClick={() =>
                            runAction(
                              () => api.deleteSuperadminUser(u.id),
                              `${displayName(u)} hisobini butunlay o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.`
                            )
                          }
                          className="p-1.5 border rounded hover:bg-danger-50 text-danger-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
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
          <h1 className="text-3xl font-bold text-surface-900">Foydalanuvchilar</h1>
          <p className="text-surface-600">Adminlar va barcha foydalanuvchilar</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <UserPlus className="w-4 h-4" />
            Yangi user
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
            {editingId ? `Tahrirlash: #${editingId}` : 'Yangi foydalanuvchi'}
          </div>
          {(
            [
              ['username', 'Username *'],
              ['password', editingId ? "Yangi parol (ixtiyoriy)" : 'Parol *'],
              ['password2', editingId ? 'Parol tasdiq' : 'Parol tasdiq *'],
              ['first_name', 'Ism'],
              ['last_name', 'Familiya'],
              ['email', 'Email'],
              ['phone', 'Telefon'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="text-surface-600">{label}</span>
              <input
                type={key.includes('password') ? 'password' : 'text'}
                required={key === 'username' || (key.includes('password') && !editingId)}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border rounded-xl"
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="text-surface-600">Rol *</span>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-xl"
            >
              <option value="admin">admin</option>
              <option value="student">student</option>
              <option value="floor_leader">floor_leader</option>
              <option value="superadmin">superadmin</option>
            </select>
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
        <div className="space-y-6">
          <TableSkeleton cols={4} rows={4} />
          <TableSkeleton cols={5} rows={6} />
        </div>
      ) : (
        <>
          {renderTable('Admin foydalanuvchilar', admins)}
          {renderTable('Barcha foydalanuvchilar', users, true)}
        </>
      )}
    </div>
  );
}
