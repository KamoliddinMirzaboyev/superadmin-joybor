import { useRef, useState } from 'react';
import { Download, Phone, RefreshCw, Save, Upload } from 'lucide-react';
import {
  ContactContent,
  DEFAULT_CONTACT,
  loadContactContent,
  resetContactContent,
  saveContactContent,
} from '../../services/contactContent';

const fieldClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/40';
const labelClass = 'block text-xs font-medium text-gray-600 mb-1';
const cardClass = 'bg-white border border-gray-200 rounded-xl p-4 space-y-3';

export function ContactSettingsPage() {
  const [data, setData] = useState<ContactContent>(() => loadContactContent());
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (text: string) => {
    setMsg(text);
    window.setTimeout(() => setMsg(''), 2500);
  };

  const set = <K extends keyof ContactContent>(key: K, value: ContactContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveContactContent(data);
    setData(loadContactContent());
    flash('Saqlandi (mock / localStorage)');
  };

  const handleReset = () => {
    if (!window.confirm('Default aloqa maʼlumotlariga qaytarilsinmi?')) return;
    setData(resetContactContent());
    flash('Default qaytarildi');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.json';
    a.click();
    URL.revokeObjectURL(url);
    flash('contact.json yuklandi — Talaba public/ ga qoʻying');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ContactContent;
        const merged = { ...structuredClone(DEFAULT_CONTACT), ...parsed };
        setData(merged);
        saveContactContent(merged);
        flash('JSON import qilindi');
      } catch {
        flash('JSON xato');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Aloqa sozlamalari</h1>
            <p className="text-gray-600 text-sm mt-1">
              Telefon, bot, email, manzil va ijtimoiy tarmoqlar — Talaba ilovasida
              ishlatiladi (mock: localStorage + JSON eksport).
            </p>
            {data.updatedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Oxirgi: {new Date(data.updatedAt).toLocaleString('uz-UZ')}
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
            <Save className="w-4 h-4" /> Saqlash
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
          >
            <Download className="w-4 h-4" /> Eksport
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600"
          >
            <RefreshCw className="w-4 h-4" /> Default
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-100">
          {msg}
        </div>
      )}

      <div className="space-y-4">
        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Sahifa matni</h2>
          <div>
            <label className={labelClass}>Sarlavha</label>
            <input className={fieldClass} value={data.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Izoh</label>
            <textarea
              className={`${fieldClass} min-h-[72px]`}
              value={data.heroSubtitle}
              onChange={(e) => set('heroSubtitle', e.target.value)}
            />
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Asosiy aloqa</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Telefon</label>
              <input className={fieldClass} value={data.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={fieldClass} value={data.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Ish vaqti</label>
              <input className={fieldClass} value={data.workHours} onChange={(e) => set('workHours', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Manzil (qisqa)</label>
              <input className={fieldClass} value={data.address} onChange={(e) => set('address', e.target.value)} />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Telegram bot</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Bot username</label>
              <input
                className={fieldClass}
                placeholder="@Joyboronlinebot"
                value={data.telegramBot}
                onChange={(e) => set('telegramBot', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Bot URL</label>
              <input
                className={fieldClass}
                placeholder="https://t.me/..."
                value={data.telegramUrl}
                onChange={(e) => set('telegramUrl', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Shoshilinch</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Shoshilinch telefon</label>
              <input
                className={fieldClass}
                value={data.emergencyPhone}
                onChange={(e) => set('emergencyPhone', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Izoh</label>
              <input
                className={fieldClass}
                value={data.emergencyNote}
                onChange={(e) => set('emergencyNote', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Xarita / manzil</h2>
          <div>
            <label className={labelClass}>Toʻliq manzil (xarita ostida)</label>
            <input className={fieldClass} value={data.mapLabel} onChange={(e) => set('mapLabel', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="any"
                className={fieldClass}
                value={data.mapLat}
                onChange={(e) => set('mapLat', Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="any"
                className={fieldClass}
                value={data.mapLng}
                onChange={(e) => set('mapLng', Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-gray-900">Ijtimoiy tarmoqlar</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input
                className={fieldClass}
                value={data.instagramUrl}
                onChange={(e) => set('instagramUrl', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input
                className={fieldClass}
                value={data.facebookUrl}
                onChange={(e) => set('facebookUrl', e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
          <p className="font-medium text-slate-800 mb-1">Talaba ilovasiga chiqarish</p>
          <p>
            <strong>JSON eksport</strong> →{' '}
            <code className="text-xs bg-white px-1 rounded">Talaba-JoyBor/public/contact.json</code>
          </p>
        </div>
      </div>
    </div>
  );
}
