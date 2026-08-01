import { api } from '../../services/api';

export function SettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sozlamalar</h1>
      <p className="text-gray-600 mb-6">API integratsiya holati</p>
      <div className="bg-white border rounded-lg p-6 space-y-3 text-sm">
        <p>
          <span className="font-semibold">API base:</span> https://api.joy-bor.uz/api
        </p>
        <p>
          <span className="font-semibold">Auth:</span> JWT Bearer (sessionStorage.access)
        </p>
        <p className="text-gray-500">
          FaceID monitor va ba&apos;zi vizual widgetlar backendda yo&apos;q — shu sababli
          demo/placeholder qoladi. Asosiy CRUD/list endpointlar ulangan.
        </p>
        <button
          type="button"
          onClick={() => {
            api.logout();
            window.location.reload();
          }}
          className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
}
