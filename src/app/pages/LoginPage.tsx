import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { api, isSuperAdminUser } from '../../services/api';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      let me: Record<string, unknown>;
      try {
        me = await api.me();
      } catch {
        api.logout();
        setError("Profilni tekshirib bo'lmadi. Qayta urinib ko'ring.");
        return;
      }
      if (!isSuperAdminUser(me)) {
        api.logout();
        setError('Bu hisob superadmin emas. Faqat superadmin kira oladi.');
        return;
      }
      if (me.role) sessionStorage.setItem('userRole', String(me.role));
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-8 space-y-4"
      >
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-3 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            JB
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Xush kelibsiz</h1>
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
            className="w-full px-3.5 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/40 focus:border-brand-600 outline-none transition-colors duration-150 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Foydalanuvchi nomi"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1" htmlFor="password">
            Parol
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3.5 py-2.5 pr-10 border border-surface-300 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/40 focus:border-brand-600 outline-none transition-colors duration-150 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Parol"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 focus:outline-none transition-colors"
              aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors duration-150 shadow-sm mt-2"
        >
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
