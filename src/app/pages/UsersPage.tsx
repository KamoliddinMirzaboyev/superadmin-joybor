import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  UserPlus,
  Power,
  PowerOff,
  Pencil,
  Trash2,
  Search,
  X,
  Users,
  Shield,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Mail,
  Phone,
  Eye,
  EyeOff,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
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
  phone: '+998 ',
  first_name: '',
  last_name: '',
  role: 'admin',
};

type RoleFilter = 'all' | 'superadmin' | 'admin' | 'floor_leader' | 'student';
type StatusFilter = 'all' | 'active' | 'inactive';
type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'role';

/**
 * Telefon raqamini formatlash
 */
function formatUzbekPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (!digits) return '+998 ';
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);

  let res = '+998';
  if (digits.length > 0) {
    res += ' (' + digits.slice(0, 2);
  }
  if (digits.length >= 2) {
    res += ') ' + digits.slice(2, 5);
  }
  if (digits.length >= 5) {
    res += '-' + digits.slice(5, 7);
  }
  if (digits.length >= 7) {
    res += '-' + digits.slice(7, 9);
  }
  return res;
}

function cleanPhoneForApi(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('998')) return `+${digits}`;
  return `+998${digits}`;
}

export function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [admins, setAdmins] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminRes, superRes] = await Promise.all([
        api.getAdminUsers().catch(() => []),
        api.getSuperadminUsers().catch(() => api.getUsers().catch(() => [])),
      ]);
      setAdmins(unwrapList<AppUser>(adminRes));
      setUsers(unwrapList<AppUser>(superRes));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Foydalanuvchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Barcha foydalanuvchilar birlashtirilgan va takrorlanmas ro'yxati
  const allUsers = useMemo(() => {
    const map = new Map<number, AppUser>();
    users.forEach((u) => map.set(u.id, u));
    admins.forEach((a) => {
      if (!map.has(a.id)) {
        map.set(a.id, { ...a, role: a.role || 'admin' });
      }
    });
    return Array.from(map.values());
  }, [users, admins]);

  // Statistik hisoblar
  const stats = useMemo(() => {
    const total = allUsers.length;
    const adminCount = allUsers.filter(
      (u) =>
        u.role?.toLowerCase() === 'admin' ||
        u.role?.toLowerCase() === 'dormitory_admin'
    ).length;
    const studentCount = allUsers.filter(
      (u) => u.role?.toLowerCase() === 'student' || u.role?.toLowerCase() === 'talaba'
    ).length;
    const leaderCount = allUsers.filter(
      (u) =>
        u.role?.toLowerCase() === 'floor_leader' ||
        u.role?.toLowerCase() === 'sardor' ||
        u.role?.toLowerCase() === 'qavat_sardori'
    ).length;
    const superCount = allUsers.filter(
      (u) =>
        u.role?.toLowerCase() === 'superadmin' ||
        u.role?.toLowerCase() === 'super_admin' ||
        Boolean(u.is_super_admin)
    ).length;
    const activeCount = allUsers.filter((u) => u.is_active !== false).length;
    const inactiveCount = total - activeCount;

    return {
      total,
      adminCount,
      studentCount,
      leaderCount,
      superCount,
      activeCount,
      inactiveCount,
    };
  }, [allUsers]);

  // Filtrlangan va saralangan foydalanuvchilar ro'yxati
  const filteredUsers = useMemo(() => {
    let list = [...allUsers];

    // 1. Qidiruv
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((u) => {
        const name = (u.full_name || `${u.first_name || ''} ${u.last_name || ''}`).toLowerCase();
        const username = (u.username || '').toLowerCase();
        const phone = (u.phone || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return (
          name.includes(q) ||
          username.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          String(u.id) === q
        );
      });
    }

    // 2. Rol filtri
    if (roleFilter !== 'all') {
      list = list.filter((u) => {
        const r = (u.role || '').toLowerCase();
        if (roleFilter === 'superadmin') {
          return r === 'superadmin' || r === 'super_admin' || Boolean(u.is_super_admin);
        }
        if (roleFilter === 'admin') {
          return r === 'admin' || r === 'dormitory_admin';
        }
        if (roleFilter === 'student') {
          return r === 'student' || r === 'talaba';
        }
        if (roleFilter === 'floor_leader') {
          return r === 'floor_leader' || r === 'sardor' || r === 'qavat_sardori';
        }
        return true;
      });
    }

    // 3. Status filtri
    if (statusFilter === 'active') {
      list = list.filter((u) => u.is_active !== false);
    } else if (statusFilter === 'inactive') {
      list = list.filter((u) => u.is_active === false);
    }

    // 4. Saralash
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'name_asc') {
        const nameA = a.full_name || a.first_name || a.username || '';
        const nameB = b.full_name || b.first_name || b.username || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'name_desc') {
        const nameA = a.full_name || a.first_name || a.username || '';
        const nameB = b.full_name || b.first_name || b.username || '';
        return nameB.localeCompare(nameA);
      }
      if (sortBy === 'role') {
        return (a.role || '').localeCompare(b.role || '');
      }
      return 0;
    });

    return list;
  }, [allUsers, search, roleFilter, statusFilter, sortBy]);

  const displayName = (u: AppUser) =>
    u.full_name ||
    [u.first_name, u.last_name].filter(Boolean).join(' ') ||
    u.username ||
    `Foydalanuvchi #${u.id}`;

  const getInitials = (u: AppUser) => {
    if (u.first_name && u.last_name) {
      return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
    }
    const name = displayName(u);
    return (name[0] || 'U').toUpperCase();
  };

  const getRoleBadge = (role?: string, isSuper?: boolean) => {
    const r = (role || '').toLowerCase();
    if (r === 'superadmin' || r === 'super_admin' || isSuper) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Superadmin
        </span>
      );
    }
    if (r === 'admin' || r === 'dormitory_admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Admin
        </span>
      );
    }
    if (r === 'floor_leader' || r === 'sardor' || r === 'qavat_sardori') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
          Qavat sardori
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
        Talaba
      </span>
    );
  };

  // Actions
  const runAction = async (fn: () => Promise<unknown>, successMsg: string, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
      await fn();
      toast.success(successMsg);
      await loadData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Amalni bajarishda xatolik yuz berdi');
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const startEdit = (u: AppUser) => {
    setEditingUser(u);
    setForm({
      username: u.username || '',
      password: '',
      password2: '',
      email: u.email || '',
      phone: u.phone ? formatUzbekPhone(u.phone) : '+998 ',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      role: u.role || 'admin',
    });
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (form.password || form.password2) {
      if (form.password !== form.password2) {
        setFormError('Parollar bir-biriga mos kelmadi');
        return;
      }
    } else if (!editingUser) {
      setFormError('Parol kiritilishi shart');
      return;
    }

    if (form.role === 'superadmin' && !editingUser) {
      const ok = window.confirm("Superadmin yaratish tizimga to'liq boshqaruv huquqini beradi. Davom etasizmi?");
      if (!ok) return;
    }

    setSaving(true);
    try {
      const cleanPhone = cleanPhoneForApi(form.phone);
      if (editingUser) {
        const payload: Record<string, unknown> = {
          username: form.username.trim(),
          email: form.email.trim() || undefined,
          phone: cleanPhone && cleanPhone !== '+998' ? cleanPhone : undefined,
          first_name: form.first_name.trim() || undefined,
          last_name: form.last_name.trim() || undefined,
          role: form.role,
        };
        if (form.password) {
          payload.password = form.password;
          payload.password2 = form.password2;
        }
        await api.updateSuperadminUser(editingUser.id, payload);
        toast.success("Foydalanuvchi ma'lumotlari yangilandi");
      } else {
        await api.createSuperadminUser({
          username: form.username.trim(),
          password: form.password,
          password2: form.password2,
          email: form.email.trim() || undefined,
          phone: cleanPhone && cleanPhone !== '+998' ? cleanPhone : undefined,
          first_name: form.first_name.trim() || undefined,
          last_name: form.last_name.trim() || undefined,
          role: form.role,
          is_active: true,
        });
        toast.success("Yangi foydalanuvchi muvaffaqiyatli yaratildi");
      }
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const hasActiveFilters = search.trim() !== '' || roleFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest';

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            Foydalanuvchilar
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Barcha adminlar, talabalar va qavat sardorlarini boshqarish
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-surface-600 transition-colors shadow-sm"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yangi foydalanuvchi</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Jami foydalanuvchilar</div>
            <div className="text-xl font-bold text-surface-900">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Adminlar</div>
            <div className="text-xl font-bold text-brand-600">{stats.adminCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Talabalar</div>
            <div className="text-xl font-bold text-emerald-600">{stats.studentCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Qavat sardorlari</div>
            <div className="text-xl font-bold text-amber-600">{stats.leaderCount}</div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm space-y-3.5">
        {/* Row 1: Role tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { id: 'all', label: 'Barchasi', count: stats.total },
              { id: 'admin', label: 'Adminlar', count: stats.adminCount },
              { id: 'student', label: 'Talabalar', count: stats.studentCount },
              { id: 'floor_leader', label: 'Qavat sardorlari', count: stats.leaderCount },
              { id: 'superadmin', label: 'Superadminlar', count: stats.superCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                roleFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  roleFilter === tab.id ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Row 2: Search, Status Filter & Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 border-t border-surface-100">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism, username, telefon yoki email bo'yicha qidirish..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50/50 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50/50 focus:bg-white focus:ring-2 focus:ring-brand-500/30 outline-none transition-colors"
            >
              <option value="all">Barcha statuslar ({stats.total})</option>
              <option value="active">Faqat faol ({stats.activeCount})</option>
              <option value="inactive">Nofaol ({stats.inactiveCount})</option>
            </select>
          </div>

          {/* Sort option */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50/50 focus:bg-white focus:ring-2 focus:ring-brand-500/30 outline-none transition-colors"
            >
              <option value="newest">Yangi qo'shilganlar (ID ↓)</option>
              <option value="oldest">Eski qo'shilganlar (ID ↑)</option>
              <option value="name_asc">Ism (A &rarr; Z)</option>
              <option value="name_desc">Ism (Z &rarr; A)</option>
              <option value="role">Rol bo'yicha</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50 rounded-lg transition-colors shrink-0"
                title="Filtrlarni tozalash"
              >
                Tozalash
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Table Section */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton cols={5} rows={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-50/80 border-b border-surface-200">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Foydalanuvchi
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Aloqa (Tel / Email)
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users className="w-10 h-10 text-surface-300 mx-auto" />
                        <p className="text-sm font-semibold text-surface-700">Foydalanuvchi topilmadi</p>
                        <p className="text-xs text-surface-400">
                          Qidiruv yoki filtr parametrlarini o'zgartirib ko'ring
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={resetFilters}
                            className="mt-2 text-xs font-bold text-brand-600 hover:underline"
                          >
                            Barcha filtrlarni tozalash
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isActive = u.is_active !== false;
                    return (
                      <tr key={u.id} className="hover:bg-surface-50/60 transition-colors">
                        {/* 1. Foydalanuvchi nomi va avatar */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                              {getInitials(u)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-surface-900">
                                  {displayName(u)}
                                </span>
                                <span className="text-[10px] font-mono text-surface-400 bg-surface-100 px-1.5 py-0.2 rounded">
                                  #{u.id}
                                </span>
                              </div>
                              {u.username && (
                                <div className="text-xs text-surface-500 font-mono">
                                  @{u.username}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Rol */}
                        <td className="px-4 py-3.5">{getRoleBadge(u.role, u.is_super_admin)}</td>

                        {/* 3. Telefon va Email */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            {u.phone ? (
                              <a
                                href={`tel:${u.phone}`}
                                className="text-xs font-medium text-surface-800 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-surface-400" />
                                <span>{u.phone}</span>
                              </a>
                            ) : (
                              <span className="text-xs text-surface-400">—</span>
                            )}
                            {u.email && (
                              <a
                                href={`mailto:${u.email}`}
                                className="text-xs text-surface-500 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5 text-surface-400" />
                                <span>{u.email}</span>
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 4. Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-surface-100 text-surface-600 border border-surface-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-surface-400'
                              }`}
                            />
                            {isActive ? 'Faol' : 'Nofaol'}
                          </span>
                        </td>

                        {/* 5. Amallar */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            {/* Faol / Nofaol qilish */}
                            {isActive ? (
                              <button
                                type="button"
                                title="Nofaol qilish"
                                onClick={() =>
                                  runAction(
                                    () => api.deactivateUser(u.id),
                                    `${displayName(u)} hisobi nofaol qilindi`,
                                    `${displayName(u)} hisobini nofaol qilmoqchimisiz?`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-surface-200 hover:bg-surface-100 text-surface-500 hover:text-surface-800 transition-colors"
                              >
                                <PowerOff className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Faollashtirish"
                                onClick={() =>
                                  runAction(
                                    () => api.activateUser(u.id),
                                    `${displayName(u)} hisobi faollashtirildi`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-surface-200 hover:bg-emerald-50 text-emerald-600 transition-colors"
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              type="button"
                              title="Tahrirlash"
                              onClick={() => startEdit(u)}
                              className="p-1.5 rounded-lg border border-surface-200 hover:bg-surface-100 text-surface-600 hover:text-surface-900 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              title="O'chirish"
                              onClick={() =>
                                runAction(
                                  () => api.deleteSuperadminUser(u.id),
                                  `${displayName(u)} hisobi o'chirildi`,
                                  `${displayName(u)} hisobini butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`
                                )
                              }
                              className="p-1.5 rounded-lg border border-surface-200 hover:bg-danger-50 text-danger-500 hover:text-danger-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer summary */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-4 py-3 bg-surface-50 border-t border-surface-200 flex items-center justify-between text-xs text-surface-500 font-medium">
            <span>
              Ko'rsatilmoqda: <strong>{filteredUsers.length}</strong> / {allUsers.length} ta foydalanuvchi
            </span>
            <span>JoyBor Superadmin tizimi</span>
          </div>
        )}
      </div>

      {/* 5. Create / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-900/60 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg bg-white rounded-xl border border-surface-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 bg-surface-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-600 text-white shadow-sm">
                  {editingUser ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900">
                    {editingUser ? `Foydalanuvchini tahrirlash (#${editingUser.id})` : 'Yangi foydalanuvchi yaratish'}
                  </h3>
                  <p className="text-xs text-surface-500">
                    {editingUser ? 'Kerakli maydonlarni yangilang' : "Tizimga yangi foydalanuvchi qo'shing"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-xs font-semibold text-danger-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Username */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="masalan: ali_admin"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* First name */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Ism
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    placeholder="Ali"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Familiya
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    placeholder="Karimov"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: formatUzbekPhone(e.target.value) }))}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="user@joy-bor.uz"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* Role */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Rol *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  >
                    <option value="admin">Admin (Yotoqxona boshqaruvchisi)</option>
                    <option value="student">Talaba (Student)</option>
                    <option value="floor_leader">Qavat sardori (Floor Leader)</option>
                    <option value="superadmin">Superadmin (Global boshqaruv)</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    {editingUser ? 'Yangi parol (ixtiyoriy)' : 'Parol *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingUser}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder={editingUser ? "O'zgartirmaslik uchun bo'sh qoldiring" : 'Parol'}
                      className="w-full px-3 py-2 pr-9 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password 2 */}
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    {editingUser ? 'Parol tasdiq' : 'Parol tasdiq *'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={Boolean(form.password)}
                    value={form.password2}
                    onChange={(e) => setForm((f) => ({ ...f, password2: e.target.value }))}
                    placeholder="Parolni qayta kiriting"
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2.5 pt-3 border-t border-surface-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-surface-200 hover:bg-surface-50 text-surface-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 transition-colors shadow-sm"
                >
                  {saving ? 'Saqlanmoqda...' : editingUser ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
