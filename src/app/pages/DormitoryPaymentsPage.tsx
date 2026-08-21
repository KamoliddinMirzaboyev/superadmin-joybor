import { useEffect, useState } from 'react';
import { RefreshCw, Receipt, Building2, Check, X, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api, unwrapList, mediaUrl } from '../../services/api';
import { TableSkeleton } from '../components/Skeleton';

interface DormitoryPayment {
  id: number;
  dormitory?: number;
  dormitory_name?: string;
  tariff?: number | null;
  tariff_name?: string;
  period: 'month' | 'year';
  amount: number;
  receipt?: string;
  comment?: string;
  admin_comment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string;
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800',
  APPROVED: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800',
  REJECTED: 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800',
};

const STATUS_ICON: Record<string, typeof Clock> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Ko'rib chiqilmoqda",
  APPROVED: 'Tasdiqlangan',
  REJECTED: 'Rad etilgan',
};

export function DormitoryPaymentsPage() {
  const [items, setItems] = useState<DormitoryPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [actingId, setActingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getSubscriptionPayments(statusFilter ? { status: statusFilter } : undefined);
      setItems(unwrapList<DormitoryPayment>(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklash xatosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const formatDate = (date?: string): string => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return date;
    }
  };

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await api.approveDormitoryPayment(id);
      toast.success("To'lov tasdiqlandi");
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p)));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Tasdiqlashda xatolik yuz berdi');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActingId(id);
    try {
      await api.rejectDormitoryPayment(id, rejectComment.trim());
      toast.success("To'lov rad etildi");
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'REJECTED', admin_comment: rejectComment.trim() } : p))
      );
      setRejectingId(null);
      setRejectComment('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Rad etishda xatolik yuz berdi');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <Receipt className="w-7 h-7 text-brand-500" />
            Obuna to'lovlari
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Yotoqxonalarning SaaS tarifi uchun yuborgan to'lovlari
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

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-wrap gap-2">
        {[
          { value: 'PENDING', label: "Ko'rib chiqilmoqda" },
          { value: 'APPROVED', label: 'Tasdiqlangan' },
          { value: 'REJECTED', label: 'Rad etilgan' },
          { value: '', label: 'Barchasi' },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              statusFilter === s.value
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton cols={6} />
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-12 text-center">
          <Receipt className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">To'lovlar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => {
            const StatusIcon = STATUS_ICON[p.status] || Clock;
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {p.receipt && (
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(mediaUrl(p.receipt!))}
                    className="shrink-0"
                  >
                    <img
                      src={mediaUrl(p.receipt)}
                      alt="Chek"
                      className="w-16 h-16 rounded-lg object-cover border border-surface-200 dark:border-surface-700 hover:opacity-80 transition-opacity cursor-zoom-in"
                    />
                  </button>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-sm font-bold text-surface-900 dark:text-white">
                      {p.dormitory_name || `Yotoqxona #${p.dormitory}`}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[p.status]}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                    <span className="font-bold text-surface-900 dark:text-white">
                      {Number(p.amount).toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                    </span>{' '}
                    &middot; {p.period === 'year' ? 'yillik' : 'oylik'}
                    {p.tariff_name ? ` · ${p.tariff_name}` : ''}
                    {' · '}
                    {formatDate(p.created_at)}
                  </p>
                  {p.comment && (
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{p.comment}</p>
                  )}
                  {p.status === 'REJECTED' && p.admin_comment && (
                    <p className="text-xs text-danger-600 dark:text-danger-400 mt-0.5">Sabab: {p.admin_comment}</p>
                  )}
                </div>

                {p.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0">
                    {rejectingId === p.id ? (
                      <>
                        <input
                          type="text"
                          autoFocus
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          placeholder="Rad etish sababi..."
                          className="w-48 px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg outline-none focus:ring-1 focus:ring-danger-500"
                        />
                        <button
                          onClick={() => handleReject(p.id)}
                          disabled={actingId === p.id}
                          className="px-3 py-2 rounded-lg bg-danger-600 hover:bg-danger-700 text-white text-xs font-bold disabled:opacity-50"
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectComment('');
                          }}
                          className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(p.id)}
                          disabled={actingId === p.id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-success-600 hover:bg-success-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => setRejectingId(p.id)}
                          disabled={actingId === p.id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-danger-200 dark:border-danger-800 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/30 text-xs font-bold disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Rad etish
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-surface-950/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewUrl}
            alt="Chek"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
