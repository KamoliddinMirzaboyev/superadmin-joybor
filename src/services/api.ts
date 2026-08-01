const API_BASE = 'https://api.joy-bor.uz/api';

function getToken(): string | null {
  return sessionStorage.getItem('access');
}

function clearAuth() {
  sessionStorage.removeItem('access');
  sessionStorage.removeItem('refresh');
  sessionStorage.removeItem('isAuth');
}

async function tryRefresh(): Promise<boolean> {
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
    throw new Error('Authentication required');
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

  getAdminUsers: (params?: { search?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return apiFetch(`/superadmin/admin-users/${q ? `?${q}` : ''}`);
  },

  getDormitories: (params?: {
    search?: string;
    is_active?: boolean;
    university?: number;
    page?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.is_active !== undefined) sp.set('is_active', String(params.is_active));
    if (params?.university) sp.set('university', String(params.university));
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return apiFetch(`/superadmin/dormitories/${q ? `?${q}` : ''}`);
  },

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

  getUniversities: (params?: { search?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return apiFetch(`/universities/${q ? `?${q}` : ''}`);
  },

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

  getUsers: (params?: { page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return apiFetch(`/users/${q ? `?${q}` : ''}`);
  },

  getApplications: (params?: { page?: number; status?: string }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.status) sp.set('status', params.status);
    const q = sp.toString();
    return apiFetch(`/applications/${q ? `?${q}` : ''}`);
  },

  getPayments: (params?: { page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return apiFetch(`/payments/${q ? `?${q}` : ''}`);
  },
};

export default api;
