import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  CreditCard,
  Building2,
  Share2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  Youtube,
  Facebook,
  Globe,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  LogOut,
  Upload,
  ExternalLink,
  Layers,
  Calculator,
  Percent,
  Check,
  Calendar,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { api, type TariffPlan, type TariffPlanInput } from '../../services/api';
import { FormCardSkeleton } from '../components/Skeleton';

type SettingsTab = 'profile_security' | 'tariffs' | 'platform_info' | 'contacts_socials';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tarif';
}

function tariffSubtitle(minBeds: number, maxBeds: number): string {
  return minBeds > 0 ? `${minBeds} - ${maxBeds} o'ringacha` : `${maxBeds} tagacha o'rin`;
}

const emptyPlanForm: TariffPlanInput = {
  name: '',
  slug: '',
  subtitle: '',
  badge: '',
  min_beds: 0,
  max_beds: 500,
  month_price: 300000,
  year_price: 0,
  yearly_discount_percent: 10,
  features: ["Barcha asosiy imkoniyatlar", "Kunlik monitoring"],
  is_popular: false,
  is_active: true,
  sort_order: 0,
};

export interface FlexiblePlanConfig {
  rateMultiplier: number; // 0.003
  ratePercentText: string; // '0.003 (0.3%)'
  vacantNote: string;
  freeMonthsNote: string;
}

export interface PlatformInfo {
  platformName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  bannerImages: string[];
  botUrl: string;
  supportLink: string;
  aboutText: string;
}

export interface ContactInfo {
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  workingHours: string;
  telegramUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  websiteUrl: string;
}

const DEFAULT_FLEXIBLE_CONFIG: FlexiblePlanConfig = {
  rateMultiplier: 0.003,
  ratePercentText: '0.003 (0.3%)',
  vacantNote: "Bo'sh joylar uchun to'lov yo'q",
  freeMonthsNote: "Iyul va Avgustda to'lov: 0 so'm (bepul saqlash)",
};

const DEFAULT_PLATFORM_INFO: PlatformInfo = {
  platformName: 'JoyBor — Talabalar Turar Joyi Tizimi',
  heroTitle: "Yotoqxonangizni tez va oson toping hamda band qiling",
  heroSubtitle: "JoyBor platformasi orqali universitet yotoqxonalariga ariza topshiring, xonalarni ko'ring va navbatsiz joylashing.",
  heroImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
  bannerImages: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
  ],
  botUrl: 'https://t.me/JoyBorobot',
  supportLink: 'https://t.me/JoyBorobot',
  aboutText: "JoyBor — Oliy ta'lim muassasalari talabalari uchun yaratilgan zamonaviy, shaffof va qulay yotoqxona boshqaruv tizimi.",
};

const DEFAULT_CONTACTS: ContactInfo = {
  phone: '+998 (71) 200-00-00',
  secondaryPhone: '+998 (90) 123-45-67',
  email: 'info@joy-bor.uz',
  address: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 108",
  workingHours: 'Dushanba - Shanba: 09:00 - 18:00',
  telegramUrl: 'https://t.me/JoyBorobot',
  instagramUrl: 'https://instagram.com/joybor_uz',
  youtubeUrl: 'https://youtube.com/@joybor',
  facebookUrl: 'https://facebook.com/joybor',
  websiteUrl: 'https://joy-bor.uz',
};

function formatUzbekPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (!digits) return '+998 ';
  if (digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  let res = '+998';
  if (digits.length > 0) res += ' (' + digits.slice(0, 2);
  if (digits.length >= 2) res += ') ' + digits.slice(2, 5);
  if (digits.length >= 5) res += '-' + digits.slice(5, 7);
  if (digits.length >= 7) res += '-' + digits.slice(7, 9);
  return res;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('tariffs');
  const [tariffMode, setTariffMode] = useState<'static' | 'dynamic'>('static');
  const [loading, setLoading] = useState(true);

  // 1. Profile & Security State
  const [me, setMe] = useState<Record<string, unknown> | null>(null);
  const [profileForm, setProfileForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '+998 ',
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // 2. SaaS Platform Tariffs State (backend: /api/tariffs/, /api/superadmin/tariffs/)
  const [fixedPlans, setFixedPlans] = useState<TariffPlan[]>([]);
  const [tariffsLoading, setTariffsLoading] = useState(true);

  useEffect(() => {
    api
      .getTariffs()
      .then(setFixedPlans)
      .catch(() => toast.error("Tariflarni yuklashda xatolik yuz berdi"))
      .finally(() => setTariffsLoading(false));
  }, []);

  const [flexibleConfig, setFlexibleConfig] = useState<FlexiblePlanConfig>(() => {
    const saved = localStorage.getItem('joybor_saas_flexible_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_FLEXIBLE_CONFIG;
  });

  const [editingPlan, setEditingPlan] = useState<TariffPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planForm, setPlanForm] = useState<TariffPlanInput>(emptyPlanForm);

  // Interactive Calculator State
  const [flexiblePercentInput, setFlexiblePercentInput] = useState<string>(() => {
    return String(+(flexibleConfig.rateMultiplier * 100).toFixed(4));
  });

  const handleSaveFlexibleRate = (percentVal?: number) => {
    const rawNum = percentVal !== undefined ? percentVal : parseFloat(flexiblePercentInput);
    if (isNaN(rawNum) || rawNum <= 0) {
      toast.error("Iltimos, to'g'ri foiz qiymatini kiriting (masalan: 0.3)");
      return;
    }

    const multiplier = +(rawNum / 100).toFixed(6);
    const updated: FlexiblePlanConfig = {
      ...flexibleConfig,
      rateMultiplier: multiplier,
      ratePercentText: `${multiplier} (${rawNum}%)`,
    };

    setFlexibleConfig(updated);
    setFlexiblePercentInput(String(rawNum));
    localStorage.setItem('joybor_saas_flexible_config', JSON.stringify(updated));
    toast.success(`Dinamik tarif ulushi ${rawNum}% (${multiplier}) qilib saqlandi`);
  };

  const [calcStudents, setCalcStudents] = useState<number>(200);
  const [calcRentPrice, setCalcRentPrice] = useState<number>(350000);

  const calcTotalRevenue = useMemo(() => {
    return calcStudents * calcRentPrice;
  }, [calcStudents, calcRentPrice]);

  const calcPlatformFee = useMemo(() => {
    return Math.round(calcTotalRevenue * flexibleConfig.rateMultiplier);
  }, [calcTotalRevenue, flexibleConfig.rateMultiplier]);

  // 3. Platform Info State
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    const saved = localStorage.getItem('joybor_platform_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_PLATFORM_INFO;
  });
  const [savingPlatform, setSavingPlatform] = useState(false);

  // 4. Contacts & Socials State
  const [contacts, setContacts] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('joybor_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_CONTACTS;
  });
  const [savingContacts, setSavingContacts] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((data) => {
        setMe(data);
        setProfileForm({
          username: String(data.username || ''),
          first_name: String(data.first_name || ''),
          last_name: String(data.last_name || ''),
          email: String(data.email || ''),
          phone: data.phone ? formatUzbekPhone(String(data.phone)) : '+998 ',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Yangi parollar mos kelmadi');
        return;
      }
    }

    setSavingProfile(true);
    try {
      const cleanPhone = profileForm.phone.replace(/\D/g, '');
      const payload: Record<string, unknown> = {
        username: profileForm.username.trim(),
        first_name: profileForm.first_name.trim() || undefined,
        last_name: profileForm.last_name.trim() || undefined,
        email: profileForm.email.trim() || undefined,
        phone: cleanPhone ? `+${cleanPhone}` : undefined,
      };
      if (passwordForm.newPassword) {
        payload.password = passwordForm.newPassword;
        payload.password2 = passwordForm.confirmPassword;
      }

      if (me?.id) {
        await api.updateSuperadminUser(me.id as number, payload);
      }
      toast.success("Profil ma'lumotlari muvaffaqiyatli saqlandi");
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Saqlashda xatolik yuz berdi");
    } finally {
      setSavingProfile(false);
    }
  };

  // Save Platform Info
  const handleSavePlatformInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlatform(true);
    localStorage.setItem('joybor_platform_info', JSON.stringify(platformInfo));
    setTimeout(() => {
      setSavingPlatform(false);
      toast.success("Platforma ma'lumotlari saqlandi");
    }, 300);
  };

  // Multiple Banner Images Upload Handlers
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((newImages) => {
      setPlatformInfo((p) => {
        const existing = Array.isArray(p.bannerImages) ? p.bannerImages : (p.heroImageUrl ? [p.heroImageUrl] : []);
        const combined = [...existing, ...newImages];
        return {
          ...p,
          bannerImages: combined,
          heroImageUrl: combined[0] || p.heroImageUrl,
        };
      });
      toast.success(`${newImages.length} ta rasm yuklandi`);
    });
  };

  const handleRemoveBannerImage = (index: number) => {
    setPlatformInfo((p) => {
      const existing = Array.isArray(p.bannerImages) ? p.bannerImages : [];
      const next = existing.filter((_, i) => i !== index);
      return {
        ...p,
        bannerImages: next,
        heroImageUrl: next[0] || '',
      };
    });
    toast.success("Rasm o'chirildi");
  };

  const handleSetPrimaryBannerImage = (index: number) => {
    setPlatformInfo((p) => {
      const existing = Array.isArray(p.bannerImages) ? [...p.bannerImages] : [];
      const selected = existing.splice(index, 1)[0];
      const next = [selected, ...existing];
      return {
        ...p,
        bannerImages: next,
        heroImageUrl: selected,
      };
    });
    toast.success("Asosiy rasm etib belgilandi");
  };

  // Save Contacts & Socials
  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContacts(true);
    localStorage.setItem('joybor_contacts', JSON.stringify(contacts));
    setTimeout(() => {
      setSavingContacts(false);
      toast.success("Aloqa va ijtimoiy tarmoqlar saqlandi");
    }, 300);
  };

  // Fixed Plan Actions
  const handleOpenPlanModal = (item?: TariffPlan) => {
    if (item) {
      setEditingPlan(item);
      const { id: _id, year_label: _yearLabel, ...rest } = item;
      setPlanForm({ ...rest, features: rest.features.length ? [...rest.features] : [''] });
    } else {
      setEditingPlan(null);
      setPlanForm({ ...emptyPlanForm, sort_order: fixedPlans.length + 1 });
    }
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      toast.error('Tarif nomini kiriting');
      return;
    }

    const monthPrice = Number(planForm.month_price) || 0;
    const discount = Number(planForm.yearly_discount_percent) || 0;
    const payload: TariffPlanInput = {
      ...planForm,
      slug: slugify(planForm.name),
      subtitle: tariffSubtitle(Number(planForm.min_beds) || 0, Number(planForm.max_beds) || 0),
      badge: planForm.is_popular ? 'OMMABOP' : '',
      year_price: Math.round(monthPrice * 10 * (1 - discount / 100)),
      features: planForm.features.map((f) => f.trim()).filter(Boolean),
    };

    setSavingPlan(true);
    try {
      if (editingPlan) {
        const updated = await api.updateTariff(editingPlan.id, payload);
        setFixedPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? updated : p)));
        toast.success("Tarif o'zgarishlari saqlandi");
      } else {
        const created = await api.createTariff(payload);
        setFixedPlans((prev) => [...prev, created]);
        toast.success("Yangi tarif qo'shildi");
      }
      setIsPlanModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Saqlashda xatolik yuz berdi');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!window.confirm("Haqiqatan ham bu tarifni o'chirmoqchimisiz?")) return;
    try {
      await api.deleteTariff(id);
      setFixedPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success("Tarif o'chirildi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            Tizim Sozlamalari
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            Yotoqxonalar uchun platforma tariflari, xavfsizlik, landing sahifa va aloqa sozlamalari
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            api.logout();
            window.location.href = '/login';
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-danger-200 text-danger-600 hover:bg-danger-50 text-xs sm:text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('tariffs')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'tariffs'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tariflar va Rejalar (SaaS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile_security')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'profile_security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Profil va Parol</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('platform_info')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'platform_info'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Platforma va Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contacts_socials')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'contacts_socials'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Aloqa va Tarmoqlar</span>
        </button>
      </div>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <>
          {/* ========================================================================= */}
          {/* TAB 1: TARIFLAR VA REJALAR (JOYBOR PLATFORM SAAS SUBPRICING) */}
          {/* ========================================================================= */}
          {activeTab === 'tariffs' && (
            <div className="space-y-6">
              {/* Banner Top Info */}
              <div className="bg-white rounded-xl border border-surface-200 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Platforma Xizmat Narxlari
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-surface-900 tracking-tight">
                      JOY BOR — TARIFLAR REJASI
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-surface-600 mt-1">
                      10 oylik to'lov yili (Sentyabr - Iyun) | <strong className="text-success-600">Iyul va Avgust bepul saqlanadi</strong>
                    </p>
                  </div>

                  {tariffMode === 'static' && (
                    <button
                      type="button"
                      onClick={() => handleOpenPlanModal()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors self-start md:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi Qat'iy Tarif Qo'shish</span>
                    </button>
                  )}
                </div>

                {/* Sub-tab: Statik / Dinamik */}
                <div className="flex items-center gap-1 p-1 mt-5 bg-surface-100 rounded-xl border border-surface-200 w-full sm:w-fit">
                  <button
                    type="button"
                    onClick={() => setTariffMode('static')}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      tariffMode === 'static'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Statik tarif</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTariffMode('dynamic')}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      tariffMode === 'dynamic'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Dinamik tarif</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* STATIK TARIF */}
              {/* ========================================================= */}
              {tariffMode === 'static' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-surface-900">Qat'iy tariflar</h3>
                    <p className="text-sm text-surface-500 mt-0.5">
                      10 oylik to'liq to'lovga <strong>10% chegirma</strong> beriladi
                    </p>
                  </div>

                  {tariffsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-surface-100 animate-pulse" />
                      ))}
                    </div>
                  ) : fixedPlans.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-surface-200 text-center text-sm text-surface-500">
                      Hozircha qat'iy tarif yo'q. "Yangi Qat'iy Tarif Qo'shish" tugmasi orqali qo'shing.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {fixedPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`bg-white rounded-xl border ${
                            plan.is_popular
                              ? 'border-brand-500 ring-2 ring-brand-500/15'
                              : 'border-surface-200'
                          } p-5 transition-all shadow-sm relative flex flex-col ${!plan.is_active ? 'opacity-60' : ''}`}
                        >
                          {plan.is_popular && (
                            <span className="absolute top-4 right-4 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm">
                              {plan.badge || 'Ommabop'}
                            </span>
                          )}

                          <h4 className="text-lg font-bold text-surface-900">{plan.name}</h4>
                          <span className="inline-block mt-1 w-fit text-xs font-semibold text-surface-600 bg-surface-50 px-2.5 py-0.5 rounded-md border border-surface-200">
                            {plan.subtitle}
                          </span>
                          {!plan.is_active && (
                            <span className="inline-block mt-1.5 w-fit text-[10px] font-bold uppercase tracking-wider text-surface-400">
                              Nofaol
                            </span>
                          )}

                          <div className="mt-4">
                            <div className="text-2xl font-black text-surface-900">
                              {plan.month_price.toLocaleString('uz-UZ')}{' '}
                              <span className="text-xs font-medium text-surface-500">so'm / oy</span>
                            </div>
                            <div className="text-xs font-semibold text-success-600 mt-0.5">
                              Yillik (-{plan.yearly_discount_percent}%):{' '}
                              <strong className="text-surface-900">{plan.year_price.toLocaleString('uz-UZ')} so'm</strong>
                            </div>
                          </div>

                          {/* Features */}
                          {plan.features && plan.features.length > 0 && (
                            <div className="flex flex-col gap-1.5 pt-4 mt-4 border-t border-surface-100 text-xs text-surface-600 flex-1">
                              {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-success-600 shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-surface-100">
                            <button
                              type="button"
                              onClick={() => handleOpenPlanModal(plan)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-50 text-surface-700 text-xs font-medium transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Tahrirlash</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-1.5 rounded-lg border border-danger-200 text-danger-600 hover:bg-danger-50 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-surface-100 border border-surface-200 text-center text-xs font-semibold text-surface-700">
                    💡 Iyul va Avgust uchun to'lov olinmaydi (Bepul saqlanadi)
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* DINAMIK TARIF */}
              {/* ========================================================= */}
              {tariffMode === 'dynamic' && (
                <div className="space-y-6">
                  {/* Dynamic Rate Setting Card */}
                  <div className="bg-white rounded-xl border border-surface-200 p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-surface-900 flex items-center gap-2">
                          <Percent className="w-5 h-5 text-brand-600" />
                          <span>Dinamik Tarif Ulushini Belgilash</span>
                        </h3>
                        <p className="text-xs text-surface-500 mt-0.5">
                          Yotoqxona oylik umumiy daromadidan JoyBor tizimi oladigan ulush foizi
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-surface-500">Joriy ulush:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold font-mono">
                          {flexibleConfig.ratePercentText}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-600 mb-1.5">
                          Platforma Ulushi Foizi (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="100"
                            value={flexiblePercentInput}
                            onChange={(e) => setFlexiblePercentInput(e.target.value)}
                            placeholder="0.3"
                            className="w-full pl-3.5 pr-8 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 font-bold text-surface-900"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-surface-400">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-600 mb-1.5">
                          Tezkor tanlovlar
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[0.2, 0.3, 0.5, 0.8, 1.0].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => {
                                setFlexiblePercentInput(String(rate));
                                handleSaveFlexibleRate(rate);
                              }}
                              className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                                Math.abs(flexibleConfig.rateMultiplier * 100 - rate) < 0.001
                                  ? 'bg-brand-600 text-white shadow-sm'
                                  : 'bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200'
                              }`}
                            >
                              {rate}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="button"
                          onClick={() => handleSaveFlexibleRate()}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Ulushni Saqlash</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Hisoblash formulasi Card */}
                    <div className="bg-brand-50/60 rounded-xl border border-brand-200 p-5 text-center flex flex-col justify-center">
                      <p className="text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-2">
                        Hisoblash formulasi
                      </p>
                      <div className="text-sm sm:text-base font-black text-brand-900 bg-white py-2.5 px-3 rounded-lg border border-brand-200 shadow-sm font-mono">
                        Talabalar × Ijara narxi × {flexibleConfig.rateMultiplier}
                      </div>
                    </div>

                    {/* Hisob-kitob namunalari */}
                    <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-3">
                      <p className="text-xs font-bold text-surface-700 uppercase tracking-wider">
                        Hisob-kitob namunalari
                      </p>

                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-200 text-xs text-surface-800 space-y-1">
                        <p className="font-semibold text-surface-900">150 ta talaba (300 000 so'm/dan):</p>
                        <p className="text-surface-600">
                          45 mln daromad &rarr; <strong className="text-brand-700">{Math.round(150 * 300000 * flexibleConfig.rateMultiplier).toLocaleString('uz-UZ')} so'm/oy</strong>
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-200 text-xs text-surface-800 space-y-1">
                        <p className="font-semibold text-surface-900">300 ta talaba (400 000 so'm/dan):</p>
                        <p className="text-surface-600">
                          120 mln daromad &rarr; <strong className="text-brand-700">{Math.round(300 * 400000 * flexibleConfig.rateMultiplier).toLocaleString('uz-UZ')} so'm/oy</strong>
                        </p>
                      </div>
                    </div>

                    {/* Asosiy Qulayliklar Card */}
                    <div className="bg-success-50/70 rounded-xl border border-success-200 p-5 space-y-2">
                      <p className="text-xs font-bold text-success-800 uppercase tracking-wider">
                        Asosiy qulayliklar
                      </p>
                      <ul className="space-y-1.5 text-xs text-success-900 font-medium">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                          <span>Bo'sh joylar uchun to'lov yo'q</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                          <span>Iyul-Avgustda to'lov: <strong>0 so'm</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* INTERAKTIV KALKULYATOR */}
                  <div className="bg-white rounded-xl border border-surface-200 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-brand-600" />
                      <h4 className="text-sm font-bold text-surface-900">
                        Interaktiv hisob-kitob kalkulyatori
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                      <div>
                        <label className="block text-surface-600 font-semibold mb-1.5">
                          Talabalar soni: <strong className="text-surface-900">{calcStudents} ta</strong>
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={1000}
                          step={10}
                          value={calcStudents}
                          onChange={(e) => setCalcStudents(Number(e.target.value))}
                          className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                      </div>

                      <div>
                        <label className="block text-surface-600 font-semibold mb-1.5">
                          Talaba oylik to'lovi (so'm):
                        </label>
                        <input
                          type="number"
                          step={10000}
                          value={calcRentPrice}
                          onChange={(e) => setCalcRentPrice(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-brand-50 rounded-lg border border-brand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="text-surface-500 font-medium text-xs">Yotoqxona oylik daromadi:</p>
                        <p className="text-base font-bold text-surface-900">
                          {calcTotalRevenue.toLocaleString('uz-UZ')} so'm
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-brand-600 font-medium text-xs">
                          JoyBor dastur haqi ({+(flexibleConfig.rateMultiplier * 100).toFixed(2)}%):
                        </p>
                        <p className="text-lg font-black text-brand-700">
                          {calcPlatformFee.toLocaleString('uz-UZ')} so'm / oy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PROFIL VA PAROL */}
          {/* ========================================================================= */}
          {activeTab === 'profile_security' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-surface-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-600" />
                      <span>Shaxsiy Ma'lumotlar</span>
                    </h3>
                    <p className="text-xs text-surface-500 mt-0.5">
                      Superadmin akkauntingizning asosiy ma'lumotlarini o'zgartiring
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Username (Login) *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, username: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Telefon Raqam
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            phone: formatUzbekPhone(e.target.value),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Ism
                      </label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, first_name: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Familiya
                      </label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, last_name: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Email Manzili
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Parol o'zgartirish bloki */}
                  <div className="pt-4 border-t border-surface-100 space-y-4">
                    <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-brand-600" />
                      <span>Yangi Parol o'rnatish</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                          Yangi Parol
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                            }
                            placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
                            className="w-full px-3.5 py-2.5 pr-10 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                          Parolni Tasdiqlang
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Parolni qayta kiriting"
                          className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingProfile ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* O'ng taraf: Profil kartochkasi */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-brand-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm">
                  {(profileForm.username[0] || 'S').toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-surface-900">
                    {[profileForm.first_name, profileForm.last_name].filter(Boolean).join(' ') ||
                      profileForm.username ||
                      'Superadmin'}
                  </h4>
                  <p className="text-xs font-mono text-surface-500 mt-0.5">@{profileForm.username}</p>
                </div>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  Superadmin tizimi
                </span>
                <div className="w-full pt-4 border-t border-surface-100 text-left space-y-2 text-xs text-surface-600">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Email:</span>
                    <span className="font-semibold text-surface-800">{profileForm.email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Telefon:</span>
                    <span className="font-semibold text-surface-800">{profileForm.phone || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PLATFORMA MA'LUMOTLARI VA HERO BANNER */}
          {/* ========================================================================= */}
          {activeTab === 'platform_info' && (
            <form onSubmit={handleSavePlatformInfo} className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-surface-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-600" />
                  <span>Platforma va Landing Sahifa Sozlamalari</span>
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Talaba sayti bosh sahifasidagi sarlavhalar, ta'riflar, rasmlar va yo'naltiruvchi havolalar
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Platforma Rasmiy Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={platformInfo.platformName}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, platformName: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Bosh Sarlavha (Hero Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={platformInfo.heroTitle}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, heroTitle: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Qisqacha Ta'rif (Hero Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={platformInfo.heroSubtitle}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, heroSubtitle: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                {/* Multiple Banner Images File Upload */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                        Platforma Banner Rasmlari (Bir nechta yuklash mumkin)
                      </label>
                      <p className="text-xs text-surface-500 mt-0.5">
                        Kompyuterdan fayl tanlang yoki bir nechta rasm yuklang
                      </p>
                    </div>

                    <label
                      htmlFor="banner-files-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Rasm yuklash</span>
                      <input
                        id="banner-files-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Drag & Drop Upload Dropzone */}
                  <label
                    htmlFor="banner-files-upload"
                    className="border-2 border-dashed border-surface-300 hover:border-brand-500 bg-surface-50/60 hover:bg-brand-50/30 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white text-brand-600 shadow-sm border border-surface-200 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-surface-800">
                      Rasmlarni tanlash uchun bu yerga bosing yoki sudrab olib keling
                    </p>
                    <p className="text-[11px] text-surface-500 mt-0.5">
                      PNG, JPG, WEBP formatlar (Bir vaqtda bir nechta fayl tanlashingiz mumkin)
                    </p>
                  </label>

                  {/* Previews Grid */}
                  {platformInfo.bannerImages && platformInfo.bannerImages.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-surface-500">
                        <span>Yuklangan rasmlar ({platformInfo.bannerImages.length} ta):</span>
                        <span className="text-[11px] text-surface-400">Birinchi rasm asosiy banner hisoblanadi</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {platformInfo.bannerImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="group relative rounded-xl overflow-hidden border border-surface-200 bg-surface-100 aspect-video shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={`Banner ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                                Asosiy
                              </span>
                            )}

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryBannerImage(idx)}
                                  className="px-2 py-1 bg-white text-surface-900 rounded-md text-[11px] font-bold shadow hover:bg-surface-100 transition-colors"
                                  title="Asosiy rasm qilish"
                                >
                                  Asosiy
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveBannerImage(idx)}
                                className="p-1.5 bg-danger-600 text-white rounded-md hover:bg-danger-700 shadow transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manual URL input fallback */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-surface-500 mb-1">
                      Yoki to'g'ridan-to'g'ri rasm havolasini (URL) kiriting:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={platformInfo.heroImageUrl}
                        onChange={(e) =>
                          setPlatformInfo((p) => ({ ...p, heroImageUrl: e.target.value }))
                        }
                        className="flex-1 px-3 py-1.5 text-xs border border-surface-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (platformInfo.heroImageUrl) {
                            setPlatformInfo((p) => {
                              const existing = Array.isArray(p.bannerImages) ? p.bannerImages : [];
                              if (!existing.includes(platformInfo.heroImageUrl)) {
                                return { ...p, bannerImages: [...existing, platformInfo.heroImageUrl] };
                              }
                              return p;
                            });
                            toast.success("Rasm havolasi ro'yxatga qo'shildi");
                          }
                        }}
                        className="px-3 py-1.5 bg-surface-100 hover:bg-surface-200 text-surface-700 text-xs font-semibold rounded-lg border border-surface-200 transition-colors"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Rasmiy Telegram Bot Havolasi
                  </label>
                  <input
                    type="url"
                    value={platformInfo.botUrl}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, botUrl: e.target.value }))
                    }
                    placeholder="https://t.me/JoyBorobot"
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Qo'llab-quvvatlash Havolasi
                  </label>
                  <input
                    type="url"
                    value={platformInfo.supportLink}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, supportLink: e.target.value }))
                    }
                    placeholder="https://t.me/JoyBorobot"
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                    Platforma Haqida To'liq Ma'lumot
                  </label>
                  <textarea
                    rows={3}
                    value={platformInfo.aboutText}
                    onChange={(e) =>
                      setPlatformInfo((p) => ({ ...p, aboutText: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingPlatform}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingPlatform ? 'Saqlanmoqda...' : 'Platforma Ma\'lumotlarini Saqlash'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ALOQA VA IJTIMOIY TARMOQLAR */}
          {/* ========================================================================= */}
          {activeTab === 'contacts_socials' && (
            <form onSubmit={handleSaveContacts} className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-surface-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand-600" />
                  <span>Aloqa va Ijtimoiy Tarmoqlar</span>
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Talabalar uchun ko'rinadigan rasmiy telefonlar, manzil va ijtimoiy tarmoq havolalari
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-3">
                    Asosiy Aloqa Ma'lumotlari
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Asosiy Telefon Raqam *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="text"
                          required
                          value={contacts.phone}
                          onChange={(e) =>
                            setContacts((c) => ({
                              ...c,
                              phone: formatUzbekPhone(e.target.value),
                            }))
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Qo'shimcha Telefon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="text"
                          value={contacts.secondaryPhone || ''}
                          onChange={(e) =>
                            setContacts((c) => ({
                              ...c,
                              secondaryPhone: formatUzbekPhone(e.target.value),
                            }))
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Rasmiy Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="email"
                          value={contacts.email}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, email: e.target.value }))
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Ish Vaqti
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="text"
                          value={contacts.workingHours}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, workingHours: e.target.value }))
                          }
                          placeholder="Dushanba - Shanba: 09:00 - 18:00"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Bosh Ofis / Manzil
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="text"
                          value={contacts.address}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, address: e.target.value }))
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-100">
                  <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-3">
                    Ijtimoiy Tarmoq Havolalari
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Telegram Havolasi
                      </label>
                      <div className="relative">
                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                        <input
                          type="url"
                          value={contacts.telegramUrl}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, telegramUrl: e.target.value }))
                          }
                          placeholder="https://t.me/JoyBorobot"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Instagram Havolasi
                      </label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                        <input
                          type="url"
                          value={contacts.instagramUrl}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, instagramUrl: e.target.value }))
                          }
                          placeholder="https://instagram.com/joybor_uz"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        YouTube Havolasi
                      </label>
                      <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                        <input
                          type="url"
                          value={contacts.youtubeUrl}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, youtubeUrl: e.target.value }))
                          }
                          placeholder="https://youtube.com/@joybor"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Rasmiy Vebsayt
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-600" />
                        <input
                          type="url"
                          value={contacts.websiteUrl}
                          onChange={(e) =>
                            setContacts((c) => ({ ...c, websiteUrl: e.target.value }))
                          }
                          placeholder="https://joy-bor.uz"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingContacts}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingContacts ? 'Saqlanmoqda...' : 'Aloqa Ma\'lumotlarini Saqlash'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODAL: QAT'IY TARIF QO'SHISH VA TAHRIRLASH */}
          {/* ========================================================================= */}
          {isPlanModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-900/60 backdrop-blur-sm">
              <div
                className="relative w-full max-w-lg bg-white rounded-xl border border-surface-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 bg-surface-50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-brand-600 text-white shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-surface-900">
                        {editingPlan ? 'Tarifni Tahrirlash' : 'Yangi Qat\'iy Tarif Yaratish'}
                      </h3>
                      <p className="text-xs text-surface-500">
                        O'rinlar soni va oylik narx parametrlarini belgilang
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSavePlan} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Nomi */}
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Tarif Nomi *
                      </label>
                      <input
                        type="text"
                        required
                        value={planForm.name}
                        onChange={(e) =>
                          setPlanForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="masalan: Small, Medium, Large"
                        className="w-full px-3.5 py-2 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                      />
                    </div>

                    {/* Min o'rin */}
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Min o'rin
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={planForm.min_beds}
                        onChange={(e) =>
                          setPlanForm((p) => ({ ...p, min_beds: Number(e.target.value) || 0 }))
                        }
                        placeholder="0"
                        className="w-full px-3.5 py-2 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                      />
                    </div>

                    {/* Max o'rin */}
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Max o'rin *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={planForm.max_beds}
                        onChange={(e) =>
                          setPlanForm((p) => ({ ...p, max_beds: Number(e.target.value) || 0 }))
                        }
                        placeholder="500"
                        className="w-full px-3.5 py-2 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                      />
                      <p className="text-[10px] text-surface-400 mt-1">
                        Sig'im: {tariffSubtitle(Number(planForm.min_beds) || 0, Number(planForm.max_beds) || 0)}
                      </p>
                    </div>

                    {/* Oylik Narxi */}
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Oylik Narxi (so'm) *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={10000}
                        value={planForm.month_price}
                        onChange={(e) =>
                          setPlanForm((p) => ({ ...p, month_price: Number(e.target.value) || 0 }))
                        }
                        className="w-full px-3.5 py-2 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                      />
                    </div>

                    {/* Yillik Chegirma % */}
                    <div>
                      <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider mb-1">
                        Yillik Chegirma (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={planForm.yearly_discount_percent}
                        onChange={(e) =>
                          setPlanForm((p) => ({ ...p, yearly_discount_percent: Number(e.target.value) || 0 }))
                        }
                        className="w-full px-3.5 py-2 text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                      />
                      <p className="text-[10px] text-surface-400 mt-1">
                        10 oy uchun yillik: {Math.round((Number(planForm.month_price) || 0) * 10 * (1 - (Number(planForm.yearly_discount_percent) || 0) / 100)).toLocaleString('uz-UZ')} so'm
                      </p>
                    </div>

                    {/* Imkoniyatlar ro'yxati */}
                    <div className="sm:col-span-2 space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                          Tarifdagi imkoniyatlar
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setPlanForm((p) => ({ ...p, features: [...p.features, ''] }))
                          }
                          className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Qo'shish</span>
                        </button>
                      </div>

                      {planForm.features.map((feat, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const next = [...planForm.features];
                              next[index] = e.target.value;
                              setPlanForm((p) => ({ ...p, features: next }));
                            }}
                            placeholder={`Imkoniyat #${index + 1}`}
                            className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-surface-200 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none"
                          />
                          {planForm.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = planForm.features.filter((_, i) => i !== index);
                                setPlanForm((p) => ({ ...p, features: next }));
                              }}
                              className="p-1.5 rounded-lg text-danger-500 hover:bg-danger-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Checkboxlar */}
                    <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-surface-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={planForm.is_popular}
                          onChange={(e) =>
                            setPlanForm((p) => ({ ...p, is_popular: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-brand-600"
                        />
                        <span>Tavsiya etilgan (Ommabop)</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-surface-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={planForm.is_active}
                          onChange={(e) =>
                            setPlanForm((p) => ({ ...p, is_active: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-brand-600"
                        />
                        <span>Faol holatda</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-4 border-t border-surface-100">
                    <button
                      type="button"
                      onClick={() => setIsPlanModalOpen(false)}
                      disabled={savingPlan}
                      className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-surface-200 hover:bg-surface-50 text-surface-700 transition-colors disabled:opacity-50"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={savingPlan}
                      className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                      {savingPlan ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
