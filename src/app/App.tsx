import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Building2, Users, Home, DollarSign, Calendar, FileText, ScanFace, BarChart3, Settings } from 'lucide-react';
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

export default function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

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
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeMenuItem} onNavigate={setActiveMenuItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}