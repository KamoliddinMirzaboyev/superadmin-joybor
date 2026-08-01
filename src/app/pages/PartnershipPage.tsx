import { useRef, useState } from 'react';
import {
  Download,
  Handshake,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  Star,
  ExternalLink,
} from 'lucide-react';
import {
  DEFAULT_PARTNERSHIP,
  extractYoutubeId,
  loadPartnershipContent,
  PartnershipContent,
  PartnershipFeature,
  PartnershipImage,
  PartnershipPlan,
  PartnershipVideo,
  resetPartnershipContent,
  savePartnershipContent,
  uid,
  youtubeEmbedUrl,
  youtubeThumb,
} from '../../services/partnershipContent';

type TabId = 'general' | 'pricing' | 'features' | 'videos' | 'gallery';

const TABS: { id: TabId; label: string }[] = [
  { id: 'general', label: 'Umumiy' },
  { id: 'pricing', label: 'Narxlar' },
  { id: 'features', label: 'Imkoniyatlar' },
  { id: 'videos', label: 'YouTube' },
  { id: 'gallery', label: 'Rasmlar' },
];

const ICON_OPTIONS = [
  'Building2',
  'FileText',
  'Coins',
  'CalendarCheck',
  'Shield',
  'Smartphone',
  'Users',
  'Zap',
  'Globe',
  'Lock',
  'BarChart3',
  'Headphones',
];

const fieldClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/40';
const labelClass = 'block text-xs font-medium text-gray-600 mb-1';
const cardClass = 'bg-white border border-gray-200 rounded-xl p-4 space-y-3';

export function PartnershipPage() {
  const [data, setData] = useState<PartnershipContent>(() => loadPartnershipContent());
  const [tab, setTab] = useState<TabId>('general');
  const [savedMsg, setSavedMsg] = useState('');
  const [featuresText, setFeaturesText] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const showSaved = (msg: string) => {
    setSavedMsg(msg);
    window.setTimeout(() => setSavedMsg(''), 2500);
  };

  const update = <K extends keyof PartnershipContent>(key: K, value: PartnershipContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // plans features from textarea map
    const plans = data.plans.map((p) => ({
      ...p,
      features:
        featuresText[p.id] !== undefined
          ? featuresText[p.id]
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : p.features,
    }));
    const payload = { ...data, plans };
    savePartnershipContent(payload);
    setData(payload);
    showSaved('Saqlandi (mock / localStorage)');
  };

  const handleReset = () => {
    if (!window.confirm('Default kontentga qaytarilsinmi?')) return;
    const fresh = resetPartnershipContent();
    setData(fresh);
    setFeaturesText({});
    showSaved('Default qaytarildi');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partnership.json';
    a.click();
    URL.revokeObjectURL(url);
    showSaved('partnership.json yuklandi — Talaba public/ ga qoʻying');
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PartnershipContent;
        const merged = { ...structuredClone(DEFAULT_PARTNERSHIP), ...parsed };
        setData(merged);
        setFeaturesText({});
        savePartnershipContent(merged);
        showSaved('JSON import qilindi va saqlandi');
      } catch {
        showSaved('JSON oʻqishda xato');
      }
    };
    reader.readAsText(file);
  };

  const planFeaturesValue = (plan: PartnershipPlan) =>
    featuresText[plan.id] ?? plan.features.join('\n');

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hamkorlik sahifasi</h1>
            <p className="text-gray-600 text-sm mt-1">
              Talaba ilovasidagi /hamkorlik kontentini boshqarish (hozircha mock —
              localStorage + JSON eksport).
            </p>
            {data.updatedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Oxirgi yangilanish: {new Date(data.updatedAt).toLocaleString('uz-UZ')}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
          >
            <Save className="w-4 h-4" />
            Saqlash
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            JSON eksport
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Default
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {savedMsg && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-100">
          {savedMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id
                ? 'bg-white border border-b-white border-gray-200 text-slate-900 -mb-px'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="space-y-4">
          <section className={cardClass}>
            <h2 className="font-semibold text-gray-900">Hero</h2>
            <div>
              <label className={labelClass}>Sarlavha</label>
              <input
                className={fieldClass}
                value={data.heroTitle}
                onChange={(e) => update('heroTitle', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Qisqa tavsif</label>
              <textarea
                className={`${fieldClass} min-h-[88px]`}
                value={data.heroSubtitle}
                onChange={(e) => update('heroSubtitle', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>CTA tugma matni</label>
              <input
                className={fieldClass}
                value={data.heroCtaLabel}
                onChange={(e) => update('heroCtaLabel', e.target.value)}
              />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="font-semibold text-gray-900">Loyiha haqida</h2>
            <div>
              <label className={labelClass}>Boʻlim sarlavhasi</label>
              <input
                className={fieldClass}
                value={data.aboutTitle}
                onChange={(e) => update('aboutTitle', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Toʻliq matn (paragraf uchun boʻsh qator)</label>
              <textarea
                className={`${fieldClass} min-h-[160px]`}
                value={data.aboutBody}
                onChange={(e) => update('aboutBody', e.target.value)}
              />
            </div>
          </section>

          <section className={cardClass}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Statistika</h2>
              <button
                type="button"
                className="text-sm text-slate-700 inline-flex items-center gap-1"
                onClick={() =>
                  update('stats', [
                    ...data.stats,
                    { id: uid('s'), label: 'Yangi', value: '0' },
                  ])
                }
              >
                <Plus className="w-4 h-4" /> Qoʻshish
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.stats.map((s, i) => (
                <div key={s.id} className="flex gap-2 items-start border border-gray-100 rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <input
                      className={fieldClass}
                      placeholder="Qiymat"
                      value={s.value}
                      onChange={(e) => {
                        const next = [...data.stats];
                        next[i] = { ...s, value: e.target.value };
                        update('stats', next);
                      }}
                    />
                    <input
                      className={fieldClass}
                      placeholder="Label"
                      value={s.label}
                      onChange={(e) => {
                        const next = [...data.stats];
                        next[i] = { ...s, label: e.target.value };
                        update('stats', next);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={() => update('stats', data.stats.filter((x) => x.id !== s.id))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="font-semibold text-gray-900">Pastki CTA</h2>
            <div>
              <label className={labelClass}>Sarlavha</label>
              <input
                className={fieldClass}
                value={data.ctaTitle}
                onChange={(e) => update('ctaTitle', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Matn</label>
              <textarea
                className={`${fieldClass} min-h-[72px]`}
                value={data.ctaBody}
                onChange={(e) => update('ctaBody', e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tugma matni</label>
                <input
                  className={fieldClass}
                  value={data.ctaButtonLabel}
                  onChange={(e) => update('ctaButtonLabel', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Havola (masalan /contact)</label>
                <input
                  className={fieldClass}
                  value={data.ctaButtonHref}
                  onChange={(e) => update('ctaButtonHref', e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'pricing' && (
        <div className="space-y-4">
          <section className={cardClass}>
            <h2 className="font-semibold text-gray-900">Boʻlim matnlari</h2>
            <div>
              <label className={labelClass}>Sarlavha</label>
              <input
                className={fieldClass}
                value={data.pricingTitle}
                onChange={(e) => update('pricingTitle', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Izoh</label>
              <textarea
                className={`${fieldClass} min-h-[64px]`}
                value={data.pricingSubtitle}
                onChange={(e) => update('pricingSubtitle', e.target.value)}
              />
            </div>
          </section>

          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Tarif paketlar</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-800 text-white rounded-lg"
              onClick={() =>
                update('plans', [
                  ...data.plans,
                  {
                    id: uid('p'),
                    name: 'Yangi paket',
                    price: '0',
                    period: 'soʻm / oy',
                    description: '',
                    features: ['Imkoniyat 1'],
                    highlighted: false,
                    ctaLabel: 'Tanlash',
                  },
                ])
              }
            >
              <Plus className="w-4 h-4" /> Paket
            </button>
          </div>

          {data.plans.map((plan, i) => (
            <section key={plan.id} className={`${cardClass} relative`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{plan.name || 'Paket'}</h3>
                  {plan.highlighted && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3" /> Highlight
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={() => update('plans', data.plans.filter((p) => p.id !== plan.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nomi</label>
                  <input
                    className={fieldClass}
                    value={plan.name}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[i] = { ...plan, name: e.target.value };
                      update('plans', next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Narx</label>
                  <input
                    className={fieldClass}
                    value={plan.price}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[i] = { ...plan, price: e.target.value };
                      update('plans', next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Davr (soʻm / oy…)</label>
                  <input
                    className={fieldClass}
                    value={plan.period}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[i] = { ...plan, period: e.target.value };
                      update('plans', next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA</label>
                  <input
                    className={fieldClass}
                    value={plan.ctaLabel}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[i] = { ...plan, ctaLabel: e.target.value };
                      update('plans', next);
                    }}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tavsif</label>
                <input
                  className={fieldClass}
                  value={plan.description}
                  onChange={(e) => {
                    const next = [...data.plans];
                    next[i] = { ...plan, description: e.target.value };
                    update('plans', next);
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Imkoniyatlar (har qator — bitta)</label>
                <textarea
                  className={`${fieldClass} min-h-[100px] font-mono text-xs`}
                  value={planFeaturesValue(plan)}
                  onChange={(e) =>
                    setFeaturesText((prev) => ({ ...prev, [plan.id]: e.target.value }))
                  }
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={plan.highlighted}
                  onChange={(e) => {
                    const next = data.plans.map((p, idx) =>
                      idx === i
                        ? { ...p, highlighted: e.target.checked }
                        : e.target.checked
                          ? { ...p, highlighted: false }
                          : p
                    );
                    update('plans', next);
                  }}
                />
                Asosiy (tavsiya) paket
              </label>
            </section>
          ))}
        </div>
      )}

      {tab === 'features' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Imkoniyatlar roʻyxati</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-800 text-white rounded-lg"
              onClick={() =>
                update('features', [
                  ...data.features,
                  {
                    id: uid('f'),
                    icon: 'Zap',
                    title: 'Yangi imkoniyat',
                    description: 'Tavsif yozing…',
                  } satisfies PartnershipFeature,
                ])
              }
            >
              <Plus className="w-4 h-4" /> Qoʻshish
            </button>
          </div>
          {data.features.map((f, i) => (
            <section key={f.id} className={cardClass}>
              <div className="flex justify-between gap-2">
                <h3 className="font-medium text-gray-900">{f.title || 'Imkoniyat'}</h3>
                <button
                  type="button"
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={() => update('features', data.features.filter((x) => x.id !== f.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Sarlavha</label>
                  <input
                    className={fieldClass}
                    value={f.title}
                    onChange={(e) => {
                      const next = [...data.features];
                      next[i] = { ...f, title: e.target.value };
                      update('features', next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ikonka</label>
                  <select
                    className={fieldClass}
                    value={f.icon}
                    onChange={(e) => {
                      const next = [...data.features];
                      next[i] = { ...f, icon: e.target.value };
                      update('features', next);
                    }}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tavsif</label>
                <textarea
                  className={`${fieldClass} min-h-[72px]`}
                  value={f.description}
                  onChange={(e) => {
                    const next = [...data.features];
                    next[i] = { ...f, description: e.target.value };
                    update('features', next);
                  }}
                />
              </div>
            </section>
          ))}
        </div>
      )}

      {tab === 'videos' && (
        <VideosTab data={data} update={update} />
      )}

      {tab === 'gallery' && (
        <GalleryTab data={data} update={update} />
      )}

      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
        <p className="font-medium text-slate-800 mb-1">Talaba ilovasiga chiqarish</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Kontentni tahrirlang va <strong>Saqlash</strong>.</li>
          <li>
            <strong>JSON eksport</strong> — <code className="text-xs bg-white px-1 rounded">partnership.json</code>{' '}
            ni yuklab oling.
          </li>
          <li>
            Faylni Talaba-JoyBor <code className="text-xs bg-white px-1 rounded">public/partnership.json</code>{' '}
            joyiga qoʻying (deploy).
          </li>
        </ol>
      </div>
    </div>
  );
}

function VideosTab({
  data,
  update,
}: {
  data: PartnershipContent;
  update: <K extends keyof PartnershipContent>(key: K, value: PartnershipContent[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h2 className="font-semibold text-gray-900">YouTube videolar</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Toʻliq URL yoki video ID: youtube.com/watch?v=…, youtu.be/…, shorts
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-800 text-white rounded-lg shrink-0"
          onClick={() =>
            update('videos', [
              ...data.videos,
              {
                id: uid('v'),
                title: 'Yangi video',
                youtubeUrl: '',
                description: '',
              } satisfies PartnershipVideo,
            ])
          }
        >
          <Plus className="w-4 h-4" /> Video
        </button>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Boʻlim sarlavhasi</label>
        <input
          className={fieldClass}
          value={data.videosTitle}
          onChange={(e) => update('videosTitle', e.target.value)}
        />
      </div>
      {data.videos.length === 0 && (
        <p className="text-sm text-gray-500 py-6 text-center border border-dashed rounded-xl">
          Hali video yoʻq — YouTube havolasini qoʻshing
        </p>
      )}
      {data.videos.map((v, i) => {
        const embed = youtubeEmbedUrl(v.youtubeUrl);
        const thumb = youtubeThumb(v.youtubeUrl);
        const valid = !!extractYoutubeId(v.youtubeUrl);
        return (
          <section key={v.id} className={cardClass}>
            <div className="flex justify-between gap-2">
              <h3 className="font-medium text-gray-900">{v.title || 'Video'}</h3>
              <button
                type="button"
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                onClick={() => update('videos', data.videos.filter((x) => x.id !== v.id))}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Sarlavha</label>
                  <input
                    className={fieldClass}
                    value={v.title}
                    onChange={(e) => {
                      const next = [...data.videos];
                      next[i] = { ...v, title: e.target.value };
                      update('videos', next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>YouTube URL</label>
                  <input
                    className={fieldClass}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={v.youtubeUrl}
                    onChange={(e) => {
                      const next = [...data.videos];
                      next[i] = { ...v, youtubeUrl: e.target.value };
                      update('videos', next);
                    }}
                  />
                  {v.youtubeUrl && !valid && (
                    <p className="text-xs text-rose-600 mt-1">URL notoʻgʻri yoki video ID topilmadi</p>
                  )}
                  {valid && (
                    <a
                      href={v.youtubeUrl.startsWith('http') ? v.youtubeUrl : `https://youtu.be/${extractYoutubeId(v.youtubeUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-600 mt-1 hover:underline"
                    >
                      YouTube da ochish <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Tavsif</label>
                  <textarea
                    className={`${fieldClass} min-h-[64px]`}
                    value={v.description}
                    onChange={(e) => {
                      const next = [...data.videos];
                      next[i] = { ...v, description: e.target.value };
                      update('videos', next);
                    }}
                  />
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 aspect-video flex items-center justify-center">
                {embed ? (
                  <iframe
                    title={v.title}
                    src={embed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : thumb ? (
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-400 px-4 text-center">Preview: URL kiriting</span>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function GalleryTab({
  data,
  update,
}: {
  data: PartnershipContent;
  update: <K extends keyof PartnershipContent>(key: K, value: PartnershipContent[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-900">Loyiha galereyasi</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-800 text-white rounded-lg"
          onClick={() =>
            update('gallery', [
              ...data.gallery,
              {
                id: uid('g'),
                imageUrl: '',
                caption: '',
              } satisfies PartnershipImage,
            ])
          }
        >
          <Plus className="w-4 h-4" /> Rasm
        </button>
      </div>
      <div>
        <label className={labelClass}>Boʻlim sarlavhasi</label>
        <input
          className={fieldClass}
          value={data.galleryTitle}
          onChange={(e) => update('galleryTitle', e.target.value)}
        />
      </div>
      <p className="text-xs text-gray-500">
        Rasm URL (https://…) kiriting. Keyinchalik API orqali fayl yuklash ulanadi.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {data.gallery.map((img, i) => (
          <section key={img.id} className={cardClass}>
            <div className="flex justify-end">
              <button
                type="button"
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                onClick={() => update('gallery', data.gallery.filter((x) => x.id !== img.id))}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
              {img.imageUrl ? (
                <img
                  src={img.imageUrl}
                  alt={img.caption || ''}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Preview
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Rasm URL</label>
              <input
                className={fieldClass}
                value={img.imageUrl}
                placeholder="https://..."
                onChange={(e) => {
                  const next = [...data.gallery];
                  next[i] = { ...img, imageUrl: e.target.value };
                  update('gallery', next);
                }}
              />
            </div>
            <div>
              <label className={labelClass}>Izoh</label>
              <input
                className={fieldClass}
                value={img.caption}
                onChange={(e) => {
                  const next = [...data.gallery];
                  next[i] = { ...img, caption: e.target.value };
                  update('gallery', next);
                }}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

