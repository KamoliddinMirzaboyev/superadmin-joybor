import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  Building2,
  Users,
  BedDouble,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Percent,
  Search,
} from 'lucide-react';
import { api, unwrapList } from '../../services/api';
import { ReportsSkeleton } from '../components/Skeleton';

type Stats = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function section(obj: unknown): Record<string, unknown> {
  if (obj && typeof obj === 'object') return obj as Record<string, unknown>;
  return {};
}

export function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dash, setDash] = useState<Stats | null>(null);
  const [dorms, setDorms] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dormSearch, setDormSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, d, dormList] = await Promise.all([
        api.getStats().catch(() => ({})),
        api.getDashboard().catch(() => null),
        api.getDormitories().catch(() => ({ results: [] })),
      ]);
      setStats(s);
      setDash(d);
      setDorms(unwrapList<Record<string, unknown>>(dormList));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Statistika ma\'lumotlarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const source = useMemo(() => ({ ...(stats || {}), ...(dash || {}) }), [stats, dash]);
  const users = useMemo(() => section(source.users), [source]);
  const dormitories = useMemo(() => section(source.dormitories), [source]);
  const rooms = useMemo(() => section(source.rooms), [source]);
  const applications = useMemo(() => section(source.applications), [source]);
  const universities = useMemo(() => section(source.universities), [source]);

  // Hisoblangan modellar
  const metrics = useMemo(() => {
    const totalDorms = num(dormitories.total ?? dorms.length);
    const activeDorms = num(dormitories.active ?? dorms.filter((d) => d.is_active).length);
    const totalUnis = num(universities.total ?? source.universities_count ?? 1);

    const totalUsers = num(users.total ?? 0);
    const studentCount = num(users.students ?? 0);
    const adminCount = num(users.admins ?? 0);
    const leaderCount = num(users.sardor ?? 0);

    const totalRooms = num(rooms.total ?? 0);
    const capacity = num(rooms.capacity ?? 0);
    const occupied = num(rooms.occupied ?? 0);
    const free = num(rooms.free ?? (capacity > occupied ? capacity - occupied : 0));
    const occupancyRate = capacity > 0 ? Math.round((occupied / capacity) * 100) : num(rooms.occupancy_rate ?? 0);

    const totalApps = num(applications.total ?? 0);
    const pendingApps = num(applications.pending ?? 0);
    const approvedApps = num(applications.approved ?? 0);
    const rejectedApps = num(applications.rejected ?? 0);

    return {
      totalDorms,
      activeDorms,
      totalUnis,
      totalUsers,
      studentCount,
      adminCount,
      leaderCount,
      totalRooms,
      capacity,
      occupied,
      free,
      occupancyRate,
      totalApps,
      pendingApps,
      approvedApps,
      rejectedApps,
    };
  }, [dormitories, dorms, universities, source, users, rooms, applications]);

  const filteredDorms = useMemo(() => {
    if (!dormSearch.trim()) return dorms;
    const q = dormSearch.toLowerCase().trim();
    return dorms.filter((d) => {
      const name = String(d.name || '').toLowerCase();
      const uni = String(d.university_name || '').toLowerCase();
      return name.includes(q) || uni.includes(q);
    });
  }, [dorms, dormSearch]);

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            Hisobotlar va Tahlillar
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Yotoqxonalar, joylar bandligi, foydalanuvchilar va arizalar bo'yicha umumlashtirilgan ko'rsatkichlar
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-surface-700 text-sm font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <ReportsSkeleton />
      ) : (
        <>
          {/* 1. Asosiy 4 ta guruhlangan KPI kartochkalari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Karta 1: Yotoqxona & Universitetlar */}
            <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Yotoqxonalar
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-surface-900">{metrics.totalDorms}</div>
                <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
                  <span className="text-emerald-600 font-semibold">{metrics.activeDorms} ta faol</span>
                  <span>•</span>
                  <span>{metrics.totalUnis} ta universitet</span>
                </div>
              </div>
            </div>

            {/* Karta 2: Foydalanuvchilar */}
            <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Foydalanuvchilar
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-surface-900">{metrics.totalUsers}</div>
                <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
                  <span className="text-purple-600 font-semibold">{metrics.studentCount} talaba</span>
                  <span>•</span>
                  <span>{metrics.adminCount} admin</span>
                </div>
              </div>
            </div>

            {/* Karta 3: O'rinlar & Bandlik */}
            <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Joylar Bandligi
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-surface-900">
                  {metrics.capacity > 0 ? `${metrics.occupancyRate}%` : `${metrics.totalRooms} xona`}
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
                  <span className="text-emerald-600 font-semibold">{metrics.occupied} band</span>
                  <span>•</span>
                  <span className="text-surface-500">{metrics.free} bo'sh joy</span>
                </div>
              </div>
            </div>

            {/* Karta 4: Arizalar oqimi */}
            <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Jami Arizalar
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-surface-900">{metrics.totalApps}</div>
                <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
                  <span className="text-amber-600 font-semibold">{metrics.pendingApps} kutilmoqda</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">{metrics.approvedApps} tasdiq</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Mantiqiy guruhlangan Tahliliy Panellar (2 ustunli toza ko'rinish) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Panel 1: Foydalanuvchilar taqsimoti */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Foydalanuvchilar tarkibi</span>
                </h3>
                <span className="text-xs font-bold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
                  Jami: {metrics.totalUsers}
                </span>
              </div>

              <div className="space-y-3">
                {/* Talabalar */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <span className="text-surface-700 font-medium">Talabalar</span>
                  </div>
                  <span className="font-bold text-surface-900">{metrics.studentCount}</span>
                </div>

                {/* Adminlar */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <span className="text-surface-700 font-medium">Yotoqxona adminlari</span>
                  </div>
                  <span className="font-bold text-surface-900">{metrics.adminCount}</span>
                </div>

                {/* Qavat sardorlari */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <span className="text-surface-700 font-medium">Qavat sardorlari</span>
                  </div>
                  <span className="font-bold text-surface-900">{metrics.leaderCount}</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Joylar va Sig'im statistikasi */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-600" />
                  <span>Xonalar va Joylar balansi</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {metrics.occupancyRate}% band
                </span>
              </div>

              <div className="space-y-3">
                {/* Visual Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-surface-600 mb-1.5">
                    <span>Band o'rinlar: {metrics.occupied}</span>
                    <span>Bo'sh: {metrics.free}</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(metrics.occupancyRate, 0))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-50">
                    <span className="text-surface-500 block">Jami xonalar</span>
                    <span className="text-base font-bold text-surface-900">{metrics.totalRooms} ta</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-50">
                    <span className="text-surface-500 block">Umumiy sig'im</span>
                    <span className="text-base font-bold text-surface-900">{metrics.capacity} o'rin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Arizalar statusi */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Arizalar holati</span>
                </h3>
                <span className="text-xs font-bold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
                  Jami: {metrics.totalApps}
                </span>
              </div>

              <div className="space-y-3">
                {/* Kutilmoqda */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-surface-700 font-medium">Ko'rib chiqilmoqda</span>
                  </div>
                  <span className="font-bold text-amber-600">{metrics.pendingApps}</span>
                </div>

                {/* Tasdiqlangan */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-surface-700 font-medium">Tasdiqlangan</span>
                  </div>
                  <span className="font-bold text-emerald-600">{metrics.approvedApps}</span>
                </div>

                {/* Rad etilgan */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <XCircle className="w-4 h-4 text-danger-500" />
                    <span className="text-surface-700 font-medium">Rad etilgan</span>
                  </div>
                  <span className="font-bold text-danger-600">{metrics.rejectedApps}</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Yotoqxonalar ro'yxati va holati */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-surface-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-50/50">
              <div>
                <h2 className="text-base font-bold text-surface-900">
                  Yotoqxonalar tafsilotlari ({filteredDorms.length})
                </h2>
                <p className="text-xs text-surface-500">
                  Har bir yotoqxona bo'yicha oylik to'lov va faollik ma'lumotlari
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={dormSearch}
                  onChange={(e) => setDormSearch(e.target.value)}
                  placeholder="Yotoqxona yoki OTM..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-surface-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 border-b border-surface-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Yotoqxona nomi
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Universitet (OTM)
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Oylik to'lov
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredDorms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-surface-500 text-sm">
                        Yotoqxona ma'lumotlari topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredDorms.map((d) => (
                      <tr key={String(d.id)} className="hover:bg-surface-50/60 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-surface-900">
                          {String(d.name || 'Yotoqxona')}
                        </td>
                        <td className="px-4 py-3.5 text-surface-600">
                          {String(d.university_name || d.university || '—')}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              d.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-surface-100 text-surface-600 border border-surface-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                d.is_active ? 'bg-emerald-500' : 'bg-surface-400'
                              }`}
                            />
                            {d.is_active ? 'Faol' : 'Nofaol'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-surface-900">
                          {d.month_price != null && Number(d.month_price) > 0 ? (
                            <span>{Number(d.month_price).toLocaleString()} so'm</span>
                          ) : (
                            <span className="text-surface-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
