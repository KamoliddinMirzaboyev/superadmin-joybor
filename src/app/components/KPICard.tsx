import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  icon: LucideIcon;
  color: 'success' | 'brand' | 'warning' | 'danger' | 'info';
  stats: Array<{ label: string; value: string | number }>;
}

const tone = {
  success: 'bg-success-50 text-success-600',
  brand: 'bg-brand-50 text-brand-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-info-50 text-info-600',
};

export function KPICard({ title, icon: Icon, color, stats }: KPICardProps) {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-500">{title}</h3>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone[color]}`}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
      <div className="space-y-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-surface-500">{stat.label}</span>
            <span className="text-lg font-semibold text-surface-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
