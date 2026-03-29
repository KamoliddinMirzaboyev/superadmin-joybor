import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Yanvar', tushgan: 450, kutilayotgan: 800 },
  { month: 'Fevral', tushgan: 520, kutilayotgan: 850 },
  { month: 'Mart', tushgan: 480, kutilayotgan: 900 },
  { month: 'Aprel', tushgan: 500, kutilayotgan: 950 },
];

export function RevenueChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Oylik Global Daromad</h3>
        <p className="text-sm text-gray-500">Yanvar-Aprel 2026</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="tushgan" fill="#059669" radius={[4, 4, 0, 0]} name="Tushgan (K$)" />
          <Bar dataKey="kutilayotgan" fill="#2563eb" radius={[4, 4, 0, 0]} name="Kutilayotgan (K$)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
