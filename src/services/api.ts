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
};

export default api;
