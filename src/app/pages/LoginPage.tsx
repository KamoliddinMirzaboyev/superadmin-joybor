import { useState, FormEvent } from 'react';
import { api } from '../../services/api';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await api.login(username.trim(), password);
      sessionStorage.setItem('access', tokens.access);
      sessionStorage.setItem('refresh', tokens.refresh);
      sessionStorage.setItem('isAuth', 'true');
      try {
        const me = await api.me();
        const role = String(me.role || me.is_super_admin || '').toLowerCase();
        const isSuper =
          Boolean(me.is_super_admin) ||
          role.includes('superadmin') ||
          role.includes('super_admin') ||
          role === 'superadmin';
        if (role && !isSuper && !role.includes('admin')) {
          api.logout();
          setError('Bu hisob superadmin emas.');
          return;
        }
        if (me.role) sessionStorage.setItem('userRole', String(me.role));
      } catch {
        // /me/ cheklangan bo'lsa token bilan davom etamiz
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-surface-200 p-8 space-y-4"
      >
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-3 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
            JB
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Xush kelibsiz</h1>
          <p className="text-sm text-surface-500 mt-1">JoyBor Superadmin paneliga kirish</p>
        </div>
        {error && (
          <div className="text-sm text-danger-700 bg-danger-50 border border-danger-100 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1" htmlFor="login">
            Login
          </label>
          <input
            id="login"
            className="w-full px-3 py-2.5 border border-surface-300 rounded-xl bg-white text-surface-900 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-600 outline-none transition-colors duration-150"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1" htmlFor="password">
            Parol
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2.5 border border-surface-300 rounded-xl bg-white text-surface-900 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-600 outline-none transition-colors duration-150"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors duration-150"
        >
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
