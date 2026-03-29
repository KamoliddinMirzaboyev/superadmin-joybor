import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'amber' | 'red';
  stats: Array<{ label: string; value: string | number }>;
}

const colorClasses = {
  green: {
    bg: 'bg-emerald-500',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  amber: {
    bg: 'bg-amber-500',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-500',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
  },
};

export function KPICard({ title, icon: Icon, color, stats }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.iconText}`} />
        </div>
      </div>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="text-lg font-bold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Decorative accent bar */}
      <div className={`mt-4 h-1 ${colors.bg} rounded-full`}></div>
    </div>
  );
}
