import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { DormitoriesPage } from './pages/DormitoriesPage';
import { UsersPage } from './pages/UsersPage';
import { DormitoryPaymentsPage } from './pages/DormitoryPaymentsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { api, isSuperAdminUser } from '../services/api';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import { useTheme } from '../theme';

// URL path -> menyu id si. Refresh qilinganda ham sahifa yo'qolmaydi.
const PAGE_PATHS: Record<string, string> = {
  '/': 'dashboard',
  '/universities': 'universities',
  '/dormitories': 'dormitories',
  '/users': 'users',
  '/dormitory-payments': 'dormitory-payments',
  '/complaints': 'complaints',
  '/applications': 'applications',
  '/reports': 'reports',
  '/settings': 'settings',
  '/notifications': 'notifications',
};

function AppInner() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('access'));

  useEffect(() => {
    if (!authed) return;
    api
      .me()
      .then((me) => {
        if (!isSuperAdminUser(me)) {
          api.logout();
          setAuthed(false);
        }
      })
      .catch(() => {
        api.logout();
        setAuthed(false);
      });
  }, [authed]);

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  const activeMenuItem = PAGE_PATHS[location.pathname] || 'dashboard';

  const handleNavigate = (id: string) => {
    routerNavigate(id === 'dashboard' ? '/' : `/${id}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    api.logout();
    setAuthed(false);
  };

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Yopish"
          className="fixed inset-0 bg-surface-900/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar activeItem={activeMenuItem} onNavigate={handleNavigate} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          onLogout={handleLogout}
          onMenu={() => setSidebarOpen(true)}
          title={activeMenuItem}
          onOpenNotifications={() => routerNavigate('/notifications')}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/dormitories" element={<DormitoriesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/dormitory-payments" element={<DormitoryPaymentsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isDark } = useTheme();
  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors theme={isDark ? 'dark' : 'light'} />
      <AppInner />
    </ErrorBoundary>
  );
}
