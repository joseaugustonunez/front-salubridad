import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  // Setup: beforeinstallprompt, appinstalled y evento para abrir el modal
  useEffect(() => {
    setIsIos(
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
        !("standalone" in navigator && navigator.standalone)
    );

    const beforeInstall = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      if (!dismissed) setShow(true);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      localStorage.removeItem("pwa_install_dismissed");
      setShow(false);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    };
    const openHandler = (ev) => {
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      if (dismissed && !(ev && ev.detail && ev.detail.force)) return;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("openInstallPrompt", openHandler);

    // Helper global (opcional)
    window.openInstallPrompt = (opts = {}) =>
      window.dispatchEvent(
        new CustomEvent("openInstallPrompt", { detail: opts })
      );

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("openInstallPrompt", openHandler);
    };
  }, []);

  // Fallback: si no hay deferredPrompt, mostrar invitación propia tras 3s
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed || installed) return;
    const t = setTimeout(() => {
      if (!deferredPrompt && !isIos) setShow(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [deferredPrompt, isIos, installed]);

  // Limpiar flag de "desestimado" después de una semana
  useEffect(() => {
    const v = localStorage.getItem("pwa_install_dismissed");
    if (!v) return;
    const ts = parseInt(v, 10);
    const week = 1000 * 60 * 60 * 24 * 7;
    if (Date.now() - ts > week)
      localStorage.removeItem("pwa_install_dismissed");
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowManual(true);
      return;
    }
    if (isPrompting) return;
    setIsPrompting(true);
    setShow(false); // cerrar modal propio antes del prompt nativo
    await new Promise((res) => setTimeout(res, 60));
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      } else {
        localStorage.setItem("pwa_install_dismissed", Date.now().toString());
      }
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    } catch (err) {
      console.error("Install prompt error:", err);
    } finally {
      setIsPrompting(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
    setShow(false);
  };

  // iOS banner (usa instrucciones manuales)
  if (isIos && !show) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50">
        <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-800">
            Para instalar en iOS: toca Compartir → "Agregar a pantalla de
            inicio"
          </div>
        </div>
      </div>
    );
  }

  if (!show || installed) return null;

  return (
    <>
      {showManual && (
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowManual(false)}
            aria-hidden
          />
          <div className="relative max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <h3 className="text-lg font-semibold mb-2">Instalación manual</h3>
            <p className="text-sm text-gray-700 mb-4">
              No es posible abrir el instalador nativo. Sigue estos pasos según
              tu dispositivo.
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside mb-4">
              <li>Android/Chrome: Menú (⋮) → "Instalar aplicación".</li>
              <li>
                Desktop Chrome: Clic en el icono de instalar en la barra de
                direcciones.
              </li>
              <li>iOS Safari: Compartir → "Agregar a pantalla de inicio".</li>
            </ul>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-white border"
                onClick={() => setShowManual(false)}
              >
                Cerrar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#49C581] text-white"
                onClick={() => {
                  localStorage.setItem(
                    "pwa_install_dismissed",
                    Date.now().toString()
                  );
                  setShowManual(false);
                  setShow(false);
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
          aria-hidden
        />
        <div className="relative max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 flex items-start gap-4">
            <img src="/escudo.png" alt="app" className="w-12 h-12 rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                Instalar Boulevard
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Agrega la aplicación a tu dispositivo para acceder rápido desde
                el escritorio o pantalla principal.
              </p>
            </div>
          </div>
          <div className="flex gap-2 p-4 bg-gray-50 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-white border text-sm"
            >
              Ahora no
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-lg bg-[#49C581] text-white font-medium text-sm"
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
