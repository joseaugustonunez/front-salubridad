import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { enviarMensajeChat } from "../api/chat";
import { BsTelephoneFill, BsGeoAltFill } from "react-icons/bs";

export default function SearchChat({ onResults }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debounceRef = useRef(null);

  const [overlayStyle, setOverlayStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calcular dimensiones dinámicamente
  const cardHeight = isMobile ? 160 : 140;
  const headerHeight = 40;
  const buttonHeight = 50;
  const padding = isMobile ? 16 : 24;
  const maxVisibleCards = isMobile ? 2 : 3;
  const fixedOverlayHeight =
    cardHeight * Math.min(results.length, maxVisibleCards) +
    headerHeight +
    buttonHeight +
    padding +
    20;

  useEffect(() => {
    const updatePos = () => {
      const el = inputRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      // En móvil, usar posición fija relativa al viewport
      if (isMobile) {
        setOverlayStyle({
          top: r.bottom + 8,
          left: 16,
          width: window.innerWidth - 32,
        });
      } else {
        setOverlayStyle({
          top: r.bottom + window.scrollY + 8,
          left: r.left + window.scrollX,
          width: r.width,
        });
      }
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);

    // Actualizar posición cuando el teclado se abre/cierra
    window.visualViewport?.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
      window.visualViewport?.removeEventListener("resize", updatePos);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      if (onResults) onResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchSuggestions = async (text) => {
    setLoading(true);
    setOpen(true);
    setResults([]);
    try {
      const resp = await enviarMensajeChat(text);
      const list = resp?.results || resp?.resultsEstablecimientos || [];
      const arr = Array.isArray(list) ? list : [];
      setResults(arr);
      if (onResults) onResults(arr);
      setOpen(arr.length > 0);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }, 50);
    } catch (err) {
      console.error("SearchChat error:", err);
      setResults([]);
      if (onResults) onResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    clearTimeout(debounceRef.current);
    fetchSuggestions(query);
  };

  const handleCardClick = (id) => {
    setOpen(false);
    navigate(`/establecimientodetalle/${id}`);
  };

  const overlayPortal = open
    ? createPortal(
        <>
          {/* Backdrop para cerrar al hacer click afuera */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1400,
              background: isMobile ? "rgba(0,0,0,0.3)" : "transparent",
            }}
            onClick={() => setOpen(false)}
          />

          <div
            style={{
              position: isMobile ? "fixed" : "absolute",
              top: overlayStyle.top,
              left: overlayStyle.left,
              width: overlayStyle.width,
              zIndex: 1500,
              pointerEvents: "auto",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              maxHeight: isMobile ? "70vh" : "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                maxHeight: isMobile ? "70vh" : `${fixedOverlayHeight}px`,
              }}
              className="bg-white/98 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-4 flex flex-col"
            >
              <div className="mb-3 px-1 flex-shrink-0">
                <p className="text-sm md:text-base text-white font-semibold">
                  Recomendados para ti
                </p>
              </div>

              {results.length > 0 ? (
                <>
                  <div className="relative flex-1 overflow-hidden">
                    <style>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                        margin: 4px 0;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 10px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                      }
                    `}</style>
                    <div
                      ref={scrollRef}
                      className="h-full overflow-y-auto space-y-3 px-1 custom-scrollbar"
                      style={{
                        maxHeight: isMobile ? "50vh" : "auto",
                        maskImage:
                          "linear-gradient(to bottom, black 90%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 90%, transparent 100%)",
                      }}
                    >
                      {results.slice(0, isMobile ? 5 : 3).map((est) => {
                        const id = est.id || est._id;
                        const img =
                          est.imagen ||
                          est.portada ||
                          (est.imagenes && est.imagenes[0]) ||
                          "";
                        const tipo = Array.isArray(est.tipo)
                          ? est.tipo
                              .map((t) => t.tipo_nombre || t.nombre)
                              .join(", ")
                          : est.tipo?.tipo_nombre ||
                            est.tipo?.nombre ||
                            est.tipo_nombre ||
                            est.tipo ||
                            "";
                        const categoria =
                          est.categoria?.nombre ||
                          est.categoria_nombre ||
                          est.categoria ||
                          "";
                        const descripcion = est.descripcion || "";

                        return (
                          <div
                            key={id}
                            className="flex gap-3 items-start bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
                            onClick={() => handleCardClick(id)}
                            style={{
                              minHeight: isMobile ? "140px" : `${cardHeight}px`,
                              boxSizing: "border-box",
                            }}
                          >
                            <div
                              className="rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm"
                              style={{
                                width: isMobile ? 90 : 130,
                                height: isMobile ? 90 : 120,
                              }}
                            >
                              {img ? (
                                <img
                                  src={`https://back-salubridad.sistemasudh.com/uploads/${img}`}
                                  alt={est.nombre}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <span className="text-gray-400 text-2xl">
                                    🍽️
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-h-full py-1">
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h5 className="text-sm font-bold text-[#254A5D] line-clamp-1">
                                    {est.nombre}
                                  </h5>
                                  {est.distancia && (
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                      {est.distancia}
                                    </span>
                                  )}
                                </div>

                                {categoria && (
                                  <div className="mb-1.5">
                                    <span className="inline-block text-xs font-medium text-white bg-gradient-to-r from-[#254A5D] to-[#337179] px-2 py-0.5 rounded-full shadow-sm">
                                      {categoria}
                                    </span>
                                  </div>
                                )}

                                {tipo && (
                                  <div className="text-xs text-[#337179] font-medium mb-1.5 line-clamp-1">
                                    {tipo}
                                  </div>
                                )}

                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                  {descripcion}
                                </p>
                              </div>

                              <div className="mt-2 flex flex-col gap-1.5">
                                {(est.telefono || est.direccion) && (
                                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    {est.telefono && (
                                      <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                        <BsTelephoneFill className="inline-block mr-1" />{" "}
                                        {est.telefono}
                                      </span>
                                    )}
                                    {est.direccion && (
                                      <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded line-clamp-1 flex-1 min-w-0">
                                        <BsGeoAltFill className="inline-block mr-1" />
                                        {est.direccion}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(id);
                                  }}
                                  className="text-xs bg-[#49C581] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 w-full"
                                >
                                  Ver más
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 text-center flex-shrink-0">
                    <button
                      onClick={() => {
                        setOpen(false);
                        if (onResults) onResults(results);
                      }}
                      className="text-xs md:text-sm text-[#254A5D] bg-white/60 hover:bg-white px-5 py-2 rounded-full border border-gray-200 hover:border-[#254A5D] font-medium transition-all duration-300 shadow-sm hover:shadow-md w-full md:w-auto"
                    >
                      Ver todos los resultados ({results.length})
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 px-1 text-center py-4">
                  Sin recomendaciones disponibles
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-2xl mx-auto px-3 md:px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-green-900/60 p-2 rounded-xl shadow-[0_6px_25px_rgba(0,0,0,0.35)] flex items-center gap-2 backdrop-blur-xl border border-green-600/50 transition-all duration-300 hover:shadow-[0_8px_35px_rgba(0,0,0,0.45)]"
      >
        <div className="p-2 rounded-lg flex-shrink-0 bg-white/10">
          <FaSearch className="text-white text-base" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Busca restaurantes..."
          className="flex-1 min-w-0 px-3 py-2 text-white bg-transparent placeholder-white/70 text-sm outline-none 
                 focus:ring-2 focus:ring-green-300/70 focus:bg-white/5 rounded-lg transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length) setOpen(true);
            const el = inputRef.current;
            if (el) {
              const r = el.getBoundingClientRect();
              if (isMobile) {
                setOverlayStyle({
                  top: r.bottom + 8,
                  left: 16,
                  width: window.innerWidth - 32,
                });
              } else {
                setOverlayStyle({
                  top: r.bottom + window.scrollY + 8,
                  left: r.left + window.scrollX,
                  width: r.width,
                });
              }
            }
          }}
        />

        <button
          type="submit"
          className="flex-shrink-0 bg-[#d21636] hover:bg-[#e41b3d] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold 
                 text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(210,22,54,0.45)] hover:shadow-[0_6px_18px_rgba(210,22,54,0.55)] active:scale-95"
        >
          {loading ? "..." : "Buscar"}
        </button>
      </form>

      {overlayPortal}
    </div>
  );
}
