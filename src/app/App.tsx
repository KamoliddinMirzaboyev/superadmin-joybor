import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { DormitoriesPage } from './pages/DormitoriesPage';
import { UsersPage } from './pages/UsersPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from '../services/api';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppInner() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('access'));

  useEffect(() => {
    if (!authed) return;
    // token yaroqliligini yumshoq tekshirish
    api.me().catch(() => {
      // ba'zi rollarda /me/ cheklangan bo'lishi mumkin — logout qilmaymiz
    });
  }, [authed]);

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  const renderPage = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <DashboardPage />;
      case 'universities':
        return <UniversitiesPage />;
      case 'dormitories':
        return <DormitoriesPage />;
      case 'users':
        return <UsersPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const handleLogout = () => {
    api.logout();
    setAuthed(false);
  };

  const navigate = (id: string) => {
    setActiveMenuItem(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-surface-50">
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
        <Sidebar activeItem={activeMenuItem} onNavigate={navigate} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          onLogout={handleLogout}
          onMenu={() => setSidebarOpen(true)}
          title={activeMenuItem}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
