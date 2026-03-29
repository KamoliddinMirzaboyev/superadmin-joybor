import { Activity } from 'lucide-react';

export function AuditLog() {
  const logs = [
    { 
      id: 1, 
      user: 'Kamiliddin', 
      role: 'Superadmin', 
      action: 'Universitet Qo\'shish', 
      details: 'Tashkent IT Uni', 
      time: '2026-03-29 14:45:22',
      type: 'create'
    },
    { 
      id: 2, 
      user: 'Aleksey', 
      role: 'Moderator', 
      action: 'Talaba O\'chirish', 
      details: 'Dorm 2, ID: 45312', 
      time: '2026-03-29 14:30:15',
      type: 'delete'
    },
    { 
      id: 3, 
      user: 'Malika', 
      role: 'Admin', 
      action: 'To\'lov Tasdiqlash', 
      details: 'Yotoqxona A, 1,500,000 so\'m', 
      time: '2026-03-29 14:15:08',
      type: 'update'
    },
    { 
      id: 4, 
      user: 'Kamiliddin', 
      role: 'Superadmin', 
      action: 'Face ID Terminal Qo\'shish', 
      details: 'Samarkand Med - Terminal 4', 
      time: '2026-03-29 13:50:42',
      type: 'create'
    },
    { 
      id: 5, 
      user: 'Jamshid', 
      role: 'Moderator', 
      action: 'Ariza Rad Etish', 
      details: 'Ariza #1234 - Xona o\'zgartirish', 
      time: '2026-03-29 13:20:33',
      type: 'update'
    },
    { 
      id: 6, 
      user: 'Zilola', 
      role: 'Admin', 
      action: 'Davomat Yangilash', 
      details: 'Korpus B - 45 talaba', 
      time: '2026-03-29 12:55:19',
      type: 'update'
    },
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'update':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Audit Log - Harakatlar Tarixi</h3>
          <p className="text-sm text-gray-500">Tizimda amalga oshirilgan barcha harakatlar</p>
        </div>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{log.user}</span>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                  {log.role}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getActionColor(log.type)}`}>
                  {log.action}
                </span>
                <span className="text-sm text-gray-600">{log.details}</span>
              </div>
              <div className="text-xs text-gray-500">{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
