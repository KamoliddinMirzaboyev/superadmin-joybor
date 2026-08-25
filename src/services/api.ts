const API_BASE = 'https://api.joy-bor.uz/api';

function getToken(): string | null {
  return sessionStorage.getItem('access');
}

function clearAuth() {
  sessionStorage.removeItem('access');
  sessionStorage.removeItem('refresh');
  sessionStorage.removeItem('isAuth');
}

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const refresh = sessionStorage.getItem('refresh');
    if (!refresh) return false;
    try {
      const res = await fetch(`${API_BASE}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { access?: string };
      if (!data.access) return false;
      sessionStorage.setItem('access', data.access);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && !retried) {
    const ok = await tryRefresh();
    if (ok) return apiFetch(path, options, true);
    clearAuth();
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/';
    }
    throw new Error('Sessiya tugadi. Qayta kiring.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { detail?: string })?.detail ||
        (data as { message?: string })?.message ||
        `HTTP ${res.status}`
    );
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export interface TariffPlan {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  badge: string;
  min_beds: number;
  max_beds: number;
  month_price: number;
  year_price: number;
  yearly_discount_percent: number;
  year_label?: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export type TariffPlanInput = Omit<TariffPlan, 'id' | 'year_label'>;

export interface PlatformBanner {
  id: number;
  image: string;
  image_url: string;
  source_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

export interface PlatformSettings {
  official_name: string;
  hero_title: string;
  hero_subtitle: string;
  telegram_bot_url: string;
  support_url: string;
  about: string;
  banners: PlatformBanner[];
  updated_at?: string;
}

export type PlatformSettingsInput = Omit<PlatformSettings, 'banners' | 'updated_at'>;

export interface ContactInfo {
  phone: string;
  phone_extra: string;
  email: string;
  working_hours: string;
  address: string;
  telegram_url: string;
  instagram_url: string;
  youtube_url: string;
  website_url: string;
  updated_at?: string;
}

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export function unwrapList<T>(data: Paginated<T> | T[] | unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as Paginated<T>).results)) {
    return (data as Paginated<T>).results;
  }
  return [];
}

async function fetchAllPages<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<Paginated<T>> {
  const results: T[] = [];
  let page = 1;
  let count = 0;
  while (page <= 40) {
    const data = await apiFetch<Paginated<T> | T[]>(
      `${path}${qs({ ...params, page, page_size: 100 })}`
    );
    if (Array.isArray(data)) {
      return { results: data, count: data.length, next: null, previous: null };
    }
    const batch = data.results ?? [];
    count = typeof data.count === 'number' ? data.count : results.length + batch.length;
    results.push(...batch);
    if (!data.next || batch.length === 0) break;
    page += 1;
  }
  return { results, count, next: null, previous: null };
}

function qs(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** Media URL: API ba'zan http qaytaradi */
export function mediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://api.joy-bor.uz')) {
    return url.replace('http://', 'https://');
  }
  if (url.startsWith('/')) return `https://api.joy-bor.uz${url}`;
  return url;
}

export interface InboxNotification {
  id: number;
  message: string;
  title?: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function isSuperAdminUser(me: Record<string, unknown> | null | undefined): boolean {
  if (!me) return false;
  if (me.is_super_admin === true) return true;
  const role = String(me.role ?? '')
    .toLowerCase()
    .replace(/[_\s-]/g, '');
  return role === 'superadmin';
}

export const api = {
  login: (username: string, password: string) =>
    apiFetch<{ access: string; refresh: string }>('/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => apiFetch<Record<string, unknown>>('/me/'),

  logout: () => {
    clearAuth();
  },

  getNotifications: async (): Promise<InboxNotification[]> => {
    try {
      const res = await apiFetch<unknown>('/notifications/');
      const list = unwrapList<Record<string, unknown>>(res);
      return list.map((n) => ({
        id: Number(n.id),
        message: String(n.message ?? n.title ?? n.content ?? ''),
        title: n.title != null ? String(n.title) : undefined,
        type: String(n.type ?? n.notification_type ?? 'info'),
        is_read: Boolean(n.is_read ?? n.read ?? n.isRead),
        created_at: String(n.created_at ?? n.createdAt ?? ''),
      }));
    } catch {
      return [];
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const res = await apiFetch<unknown>('/notifications/unread-count/');
      if (typeof res === 'number') return res;
      if (res && typeof res === 'object') {
        const o = res as Record<string, unknown>;
        return Number(o.unread ?? o.count ?? o.unread_count ?? 0);
      }
      return 0;
    } catch {
      return 0;
    }
  },

  markNotificationAsRead: (id: number) =>
    apiFetch('/notifications/mark-read/', {
      method: 'POST',
      body: JSON.stringify({ notification_id: id, id }),
    }),

  markAllNotificationsAsRead: () =>
    apiFetch('/notifications/mark-all-read/', {
      method: 'POST',
      body: '{}',
    }),

  getDashboard: () => apiFetch<Record<string, unknown>>('/superadmin/dashboard/'),
  getStats: () => apiFetch<Record<string, unknown>>('/stats/'),

  getAdminUsers: (params?: { search?: string; page?: number; page_size?: number }) =>
    params?.page != null
      ? apiFetch(`/superadmin/admin-users/${qs(params)}`)
      : fetchAllPages('/superadmin/admin-users/', params),

  getSuperadminUsers: (params?: { search?: string; page?: number; page_size?: number; role?: string }) =>
    params?.page != null
      ? apiFetch(`/superadmin/users/${qs(params)}`)
      : fetchAllPages('/superadmin/users/', params),

  createSuperadminUser: (data: Record<string, unknown>) =>
    apiFetch('/superadmin/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSuperadminUser: (id: number | string, data: Record<string, unknown>) =>
    apiFetch(`/superadmin/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteSuperadminUser: (id: number | string) =>
    apiFetch(`/superadmin/users/${id}/`, { method: 'DELETE' }),

  activateUser: (id: number | string) =>
    apiFetch(`/superadmin/users/${id}/activate/`, { method: 'POST', body: '{}' }),

  deactivateUser: (id: number | string) =>
    apiFetch(`/superadmin/users/${id}/deactivate/`, { method: 'POST', body: '{}' }),

  promoteUser: (id: number | string) =>
    apiFetch(`/superadmin/users/${id}/promote/`, { method: 'POST', body: '{}' }),

  demoteUser: (id: number | string) =>
    apiFetch(`/superadmin/users/${id}/demote/`, { method: 'POST', body: '{}' }),

  getDormitories: (params?: {
    search?: string;
    is_active?: boolean;
    university?: number;
    page?: number;
    page_size?: number;
  }) =>
    params?.page != null
      ? apiFetch(`/superadmin/dormitories/${qs(params)}`)
      : fetchAllPages('/superadmin/dormitories/', params),

  createDormitory: (data: Record<string, unknown>) =>
    apiFetch('/superadmin/dormitories/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDormitory: (id: number | string, data: Record<string, unknown>) =>
    apiFetch(`/superadmin/dormitories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteDormitory: (id: number | string) =>
    apiFetch(`/superadmin/dormitories/${id}/`, { method: 'DELETE' }),

  activateDormitory: (id: number | string) =>
    apiFetch(`/superadmin/dormitories/${id}/activate/`, { method: 'POST', body: '{}' }),

  deactivateDormitory: (id: number | string) =>
    apiFetch(`/superadmin/dormitories/${id}/deactivate/`, { method: 'POST', body: '{}' }),

  assignAdmin: (id: number | string, adminId: number) =>
    apiFetch(`/superadmin/dormitories/${id}/assign-admin/`, {
      method: 'POST',
      body: JSON.stringify({ admin: adminId }),
    }),

  getDormitoryStats: (id: number | string) =>
    apiFetch(`/superadmin/dormitories/${id}/stats/`),

  getDormitoryStudents: (dormitoryId: number | string) =>
    apiFetch(`/superadmin/dormitories/${dormitoryId}/students/`),

  getDormitoryApplications: (dormitoryId: number | string) =>
    apiFetch(`/superadmin/dormitories/${dormitoryId}/applications/`),

  getDormitoryPayments: (dormitoryId: number | string) =>
    apiFetch(`/superadmin/dormitories/${dormitoryId}/payments/`),

  getDormitoryComplaints: (dormitoryId: number | string) =>
    apiFetch(`/superadmin/dormitories/${dormitoryId}/complaints/`),

  getUniversities: (params?: { search?: string; page?: number; page_size?: number }) =>
    params?.page != null
      ? apiFetch(`/universities/${qs(params)}`)
      : fetchAllPages('/universities/', params),

  createUniversity: (data: Record<string, unknown>) =>
    apiFetch('/universities/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUniversity: (id: number | string, data: Record<string, unknown>) =>
    apiFetch(`/universities/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUniversity: (id: number | string) =>
    apiFetch(`/universities/${id}/`, { method: 'DELETE' }),

  getUsers: (params?: { page?: number; page_size?: number }) =>
    params?.page != null ? apiFetch(`/users/${qs(params)}`) : fetchAllPages('/users/', params),

  getApplications: (params?: { page?: number; page_size?: number; status?: string }) =>
    params?.page != null
      ? apiFetch(`/applications/${qs(params)}`)
      : fetchAllPages('/applications/', params),

  getPayments: (params?: { page?: number; page_size?: number }) =>
    params?.page != null
      ? apiFetch(`/payments/${qs(params)}`)
      : fetchAllPages('/payments/', params),

  getAttendanceSessions: (params?: { page?: number; page_size?: number; date?: string }) =>
    params?.page != null
      ? apiFetch(`/attendance-sessions/${qs(params)}`)
      : fetchAllPages('/attendance-sessions/', params),

  getTariffs: () => apiFetch<TariffPlan[]>('/tariffs/'),

  createTariff: (data: TariffPlanInput) =>
    apiFetch<TariffPlan>('/superadmin/tariffs/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTariff: (id: number | string, data: Partial<TariffPlanInput>) =>
    apiFetch<TariffPlan>(`/superadmin/tariffs/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTariff: (id: number | string) =>
    apiFetch(`/superadmin/tariffs/${id}/`, { method: 'DELETE' }),

  getContact: () => apiFetch<ContactInfo>('/superadmin/contact/'),

  // Obuna to'lovlari (yotoqxonalarning SaaS tarifiga to'lovlari)
  getSubscriptionPayments: (params?: { dormitory?: number; status?: string; period?: string; ordering?: string; page?: number }) =>
    apiFetch(`/dormitory-payments/${qs(params)}`),

  approveDormitoryPayment: (id: number | string, admin_comment = '') =>
    apiFetch(`/superadmin/dormitory-payments/${id}/approve/`, {
      method: 'POST',
      body: JSON.stringify({ admin_comment }),
    }),

  rejectDormitoryPayment: (id: number | string, admin_comment = '') =>
    apiFetch(`/superadmin/dormitory-payments/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify({ admin_comment }),
    }),

  // Shikoyat va takliflar
  getComplaints: (params?: {
    search?: string;
    ordering?: string;
    target_role?: string;
    sender_role?: string;
    type?: string;
    status?: string;
    category?: string;
    dormitory?: number | string;
    page?: number;
  }) => apiFetch(`/superadmin/complaints/${qs(params)}`),

  respondComplaint: (id: number | string, data: { status?: string; admin_response?: string }) =>
    apiFetch(`/superadmin/complaints/${id}/respond/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateContact: (data: ContactInfo) =>
    apiFetch<ContactInfo>('/superadmin/contact/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getPlatform: () => apiFetch<PlatformSettings>('/superadmin/platform/'),

  updatePlatform: (data: PlatformSettingsInput) =>
    apiFetch<PlatformSettings>('/superadmin/platform/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  createBanner: (data: FormData) =>
    apiFetch<PlatformBanner>('/superadmin/platform/banners/', {
      method: 'POST',
      body: data,
    }),

  updateBanner: (id: number, data: Partial<Pick<PlatformBanner, 'is_primary' | 'sort_order' | 'source_url'>>) =>
    apiFetch<PlatformBanner>(`/superadmin/platform/banners/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteBanner: (id: number) => apiFetch(`/superadmin/platform/banners/${id}/`, { method: 'DELETE' }),
};

export default api;
