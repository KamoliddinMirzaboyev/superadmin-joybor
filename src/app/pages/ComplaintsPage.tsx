import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, MessageSquareWarning, Building2, User, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api, unwrapList } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

interface Complaint {
  id: number;
  student?: number;
  student_name?: string;
  dormitory?: number;
  dormitory_name?: string;
  category: string;
  title: string;
  description: string;
  status: string;
  admin_response?: string;
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  room: 'Xona',
  food: 'Ovqat',
  staff: 'Xodim',
  noise: "Shovqin",
  other: 'Boshqa',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'in_progress', label: "Ko'rib chiqilmoqda" },
  { value: 'resolved', label: 'Hal qilindi' },
  { value: 'rejected', label: 'Rad etildi' },
];

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800',
  in_progress: 'bg-info-50 dark:bg-info-900/20 text-info-700 dark:text-info-400 border-info-200 dark:border-info-800',
  resolved: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800',
  rejected: 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800',
};

const statusLabel = (s: string) => STATUS_OPTIONS.find((o) => o.value === s)?.label || s || '—';

export function ComplaintsPage() {
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dormFilter, setDormFilter] = useState('');
  const [active, setActive] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params: { status?: string; category?: string } = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const data = await api.getComplaints(params);
      setItems(unwrapList<Complaint>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const dormitories = useMemo(
    () => Array.from(new Set(items.map((c) => c.dormitory_name).filter(Boolean))) as string[],
    [items]
  );

  const filtered = items.filter((c) => !dormFilter || c.dormitory_name === dormFilter);

  const formatDate = (date?: string): string => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return date;
    }
  };

  const openDetail = (c: Complaint) => {
    setActive(c);
    setResponseText(c.admin_response || '');
  };

  const handleSave = async (status: string) => {
    if (!active) return;
    setSaving(true);
    try {
      const updated = await api.updateComplaint(active.id, {
        status,
        admin_response: responseText.trim(),
      });
      toast.success('Shikoyat holati yangilandi');
      setItems((prev) => prev.map((c) => (c.id === active.id ? { ...c, ...(updated as Complaint) } : c)));
      setActive(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <MessageSquareWarning className="w-7 h-7 text-brand-500" />
            Shikoyatlar va takliflar
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Talabalardan kelgan shikoyat va takliflar
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yangilash
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">{error}</div>}

      {/* Filters */}
      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
        >
          <option value="">Barcha statuslar</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
        >
          <option value="">Barcha turlar</option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {dormitories.length > 0 && (
          <select
            value={dormFilter}
            onChange={(e) => setDormFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
          >
            <option value="">Barcha yotoqxonalar</option>
            {dormitories.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <TableSkeleton cols={5} />
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-12 text-center">
          <MessageSquareWarning className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Shikoyatlar topilmadi</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase">Mavzu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase">Talaba / Yotoqxona</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase">Turi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase">Sana</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-600">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => openDetail(c)}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{c.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-surface-600 dark:text-surface-300">
                        <User className="w-3.5 h-3.5 text-surface-400" />
                        {c.student_name || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {c.dormitory_name || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">
                      {CATEGORY_LABEL[c.category] || c.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          STATUS_STYLE[c.status] || STATUS_STYLE.pending
                        }`}
                      >
                        {statusLabel(c.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail / respond modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
              <div>
                <h3 className="text-base font-bold text-surface-900 dark:text-white">{active.title}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {active.student_name || '—'} &middot; {active.dormitory_name || '—'} &middot;{' '}
                  {CATEGORY_LABEL[active.category] || active.category}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed whitespace-pre-wrap">
                {active.description}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">
                  Javob (talabaga ko'rinadi)
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  placeholder="Javobingizni yozing..."
                  className="w-full px-3.5 py-2.5 text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-5 pt-0 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => handleSave('rejected')}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-danger-200 dark:border-danger-800 text-danger-600 dark:text-danger-400 text-sm font-semibold hover:bg-danger-50 dark:hover:bg-danger-950/30 disabled:opacity-50"
              >
                Rad etish
              </button>
              <button
                onClick={() => handleSave('in_progress')}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50"
              >
                Ko'rib chiqilmoqda
              </button>
              <button
                onClick={() => handleSave('resolved')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success-600 hover:bg-success-700 text-white text-sm font-semibold shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Hal qilindi va javob berish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
