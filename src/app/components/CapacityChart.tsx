import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'JoyBor Uni', value: 5200, color: '#3b82f6' },
  { name: 'Tashkent IT', value: 4100, color: '#8b5cf6' },
  { name: 'Samarkand Med', value: 3800, color: '#ec4899' },
  { name: 'Bukhara State', value: 2900, color: '#f59e0b' },
  { name: 'Fergana Tech', value: 2000, color: '#10b981' },
];

export function CapacityChart() {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Universitetlar bo'yicha Sig'im</h3>
        <p className="text-sm text-gray-500">Jami talabalar taqsimoti</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
