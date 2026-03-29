import { Building2, Users, Home, DollarSign } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { RevenueChart } from '../components/RevenueChart';
import { CapacityChart } from '../components/CapacityChart';
import { FaceIDMonitor } from '../components/FaceIDMonitor';
import { AuditLog } from '../components/AuditLog';

export function DashboardPage() {
  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="UNIVERSITETLAR"
          icon={Building2}
          color="green"
          stats={[
            { label: 'Jami', value: '15' },
            { label: 'Faol', value: '13' },
            { label: 'Bloklangan', value: '2' },
          ]}
        />
        <KPICard
          title="TALABALAR"
          icon={Users}
          color="blue"
          stats={[
            { label: 'Jami', value: '2050' },
            { label: 'Erkak', value: '1200' },
            { label: 'Ayol', value: '850' },
          ]}
        />
        <KPICard
          title="YOTOQXONALAR"
          icon={Home}
          color="amber"
          stats={[
            { label: 'Binolar', value: '50' },
            { label: 'Xonalar', value: '4500' },
            { label: "Sig'im", value: '18000' },
          ]}
        />
        <KPICard
          title="DAROMAD"
          icon={DollarSign}
          color="red"
          stats={[
            { label: 'Kutilayotgan', value: '$1.2M' },
            { label: 'Tushgan', value: '$500K' },
            { label: 'Qarzdorlar', value: '$150K' },
          ]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart />
        <CapacityChart />
      </div>

      {/* Face ID Monitor */}
      <div className="mb-6">
        <FaceIDMonitor />
      </div>

      {/* Audit Log */}
      <div className="mb-6">
        <AuditLog />
      </div>
    </div>
  );
}
