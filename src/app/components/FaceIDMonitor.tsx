/** Face ID API backendda yo'q — mock olib tashlandi. */
export function FaceIDMonitor() {
  return (
    <div className="bg-white border border-amber-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Face ID Terminal Monitor</h3>
      <p className="text-sm text-amber-800">
        `api.joy-bor.uz` da Face ID endpointlari mavjud emas. Backend qo‘shilganda shu
        komponent `/superadmin/faceid/terminals/` ga ulanadi.
      </p>
    </div>
  );
}
