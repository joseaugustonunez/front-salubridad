import React from 'react';
import toast from 'react-hot-toast';

export default function InstallModal({ deferredPrompt, onClose }) {
  if (!deferredPrompt) return null;

  const handleInstall = async () => {
    try {
      // Show the native prompt
      deferredPrompt.prompt();
      // Wait for the user's choice
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        toast.success('Instalación aceptada. Puedes abrir la app desde tu dispositivo.');
      } else {
        toast('Instalación cancelada');
      }
    } catch (err) {
      console.error('Error al intentar instalar PWA:', err);
      toast.error('No se pudo iniciar la instalación');
    } finally {
      // limpiar el evento y cerrar modal
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    toast('Recordaré que puedes instalar la app desde el navegador');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Instalar aplicación</h3>
        <p className="text-sm text-gray-600 mb-4">
          Puedes instalar esta aplicación en tu dispositivo para acceder más rápido y sin necesidad de navegador.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#49C581] to-[#37a6ca] text-white hover:opacity-95"
            onClick={handleInstall}
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
