export function FaceIDMonitor() {
  const terminals = [
    { id: 1, university: 'JoyBor Uni', dormitory: 'Yotoqxona A', terminal: 'Terminal 1 - Kirish', status: 'online', lastActivity: '2 daqiqa oldin' },
    { id: 2, university: 'JoyBor Uni', dormitory: 'Yotoqxona B', terminal: 'Terminal 2 - Chiqish', status: 'online', lastActivity: '5 daqiqa oldin' },
    { id: 3, university: 'Tashkent IT', dormitory: 'IT Korpus 1', terminal: 'Terminal 1 - Kirish', status: 'online', lastActivity: '1 daqiqa oldin' },
    { id: 4, university: 'Samarkand Med', dormitory: 'Med Korpus A', terminal: 'Terminal 3 - Lobby', status: 'offline', lastActivity: '45 daqiqa oldin' },
    { id: 5, university: 'Bukhara State', dormitory: 'Bosh Korpus', terminal: 'Terminal 1 - Kirish', status: 'online', lastActivity: '3 daqiqa oldin' },
    { id: 6, university: 'Fergana Tech', dormitory: 'Korpus 2', terminal: 'Terminal 2 - Kirish', status: 'offline', lastActivity: '1 soat oldin' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Face ID Terminal Monitor</h3>
        <p className="text-sm text-gray-500">Real vaqtda terminallar holati</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Universitet</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Yotoqxona</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Terminal Nomi</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Holati</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Oxirgi Faollik</th>
            </tr>
          </thead>
          <tbody>
            {terminals.map((terminal) => (
              <tr key={terminal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{terminal.university}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{terminal.dormitory}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{terminal.terminal}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    terminal.status === 'online' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      terminal.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {terminal.status === 'online' ? 'Onlayn' : 'Offlayn'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{terminal.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
