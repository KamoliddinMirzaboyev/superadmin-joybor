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
import { FaceIDMonitorPage } from './pages/FaceIDMonitorPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { ContactSettingsPage } from './pages/ContactSettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from '../services/api';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppInner() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
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
      case 'faceid':
        return <FaceIDMonitorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'partnership':
        return <PartnershipPage />;
      case 'contact':
        return <ContactSettingsPage />;
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeMenuItem} onNavigate={setActiveMenuItem} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
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
