export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = "/service-worker.js";
      console.log("Intentando registrar Service Worker en:", swUrl);
      navigator.serviceWorker
        .register(swUrl, { scope: "/" })
        .then((reg) => {
          console.log("Service Worker registrado:", reg.scope);
        })
        .catch(async (err) => {
          console.warn("Service Worker registro fallido:", err);
          try {
            // intentar obtener el recurso para ver qué responde el servidor
            const r = await fetch(swUrl, { cache: "no-store" });
            console.warn("Fetch /service-worker.js status:", r.status, r.headers.get("content-type"));
            const text = await r.text();
            console.warn("Contenido recibido (primeros 200 chars):", text.slice(0, 200));
          } catch (fetchErr) {
            console.warn("Fetch de /service-worker.js falló:", fetchErr);
          }
        });
    });
  }
}