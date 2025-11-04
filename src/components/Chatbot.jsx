// ...existing code...
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhone,
  FaHeart,
  FaCheckCircle,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import "./Chat.css";
import { enviarMensajeChat } from "../api/chat";

// 🎨 Componente de tarjeta compacta de establecimiento
function EstablecimientoCard({ establecimiento }) {
  // Soporta diferentes formas de recibir el "tipo"
  const tipoNombre =
    establecimiento?.tipo?.tipo_nombre ||
    establecimiento?.tipo_nombre ||
    establecimiento?.tipo ||
    "";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
      {/* Imagen más pequeña */}
      {establecimiento.imagen && (
        <div className="relative h-32 bg-slate-200">
          <img
            src={`https://back-salubridad.sistemasudh.com/uploads/${establecimiento.imagen}`}
            alt={establecimiento.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          {establecimiento.verificado && (
            <div className="absolute top-2 right-2 bg-[#49C581] text-white px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-medium">
              <FaCheckCircle className="text-[8px]" />
              Verificado
            </div>
          )}
        </div>
      )}

      <div className="p-3">
        {/* Título compacto */}
        <h3 className="font-bold text-sm text-[#254A5D] mb-1.5 line-clamp-1">
          {establecimiento.nombre}
        </h3>

        {/* Tipo y categoría */}
        <div className="mb-2 flex items-center gap-2">
          {tipoNombre && (
            <span className="bg-[#37a6ca]/10 text-[#254A5D] px-2 py-0.5 rounded-full text-[10px] font-medium">
              {tipoNombre}
            </span>
          )}
          {establecimiento.categorias && (
            <span className="bg-[#49C581]/10 text-[#49C581] px-2 py-0.5 rounded-full text-[10px] font-medium">
              {establecimiento.categorias.split(",")[0].trim()}
            </span>
          )}
        </div>

        {/* Información esencial */}
        <div className="space-y-1.5 text-xs">
          {establecimiento.direccion &&
            establecimiento.direccion !== "Dirección no disponible" && (
              <div className="flex items-start gap-1.5 text-slate-600">
                <FaMapMarkerAlt className="text-[#49C581] mt-0.5 flex-shrink-0 text-[10px]" />
                <span className="line-clamp-1">
                  {establecimiento.direccion}
                </span>
              </div>
            )}

          {establecimiento.telefono &&
            establecimiento.telefono !== "No disponible" && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <FaPhone className="text-[#37a6ca] flex-shrink-0 text-[10px]" />
                <span>{establecimiento.telefono}</span>
              </div>
            )}
        </div>

        {/* Footer compacto */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          {/* Likes */}
          {establecimiento.likes > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <FaHeart className="text-red-400" />
              <span>{establecimiento.likes}</span>
            </div>
          )}

          {/* Redes sociales mini */}
          <div className="flex gap-1.5">
            {establecimiento.redesSociales?.map((red, idx) => {
              if (red.includes("Instagram"))
                return (
                  <a
                    key={idx}
                    href={red.split(": ")[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    <FaInstagram className="text-xs" />
                  </a>
                );
              if (red.includes("Facebook"))
                return (
                  <a
                    key={idx}
                    href={red.split(": ")[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaFacebook className="text-xs" />
                  </a>
                );
              if (red.includes("TikTok"))
                return (
                  <a
                    key={idx}
                    href={red.split(": ")[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-slate-800"
                  >
                    <FaTiktok className="text-xs" />
                  </a>
                );
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Chatbot(props) {
  const {
    initialOpen = false,
    placeholder = "Escribe tu mensaje...",
    onSend,
  } = props;

  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (open)
      setTimeout(
        () => messagesRef.current?.querySelector("input")?.focus(),
        200
      );
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addMessage = (text, from = "user", results = null) => {
    setMessages((m) => [
      ...m,
      { id: Date.now() + Math.random(), from, text, results },
    ]);
  };

  // Envía el texto del bot en "pedazos" para simular envío lento
  const sendBotMessageSlow = async (fullText, establecimientos = []) => {
    if (!fullText || fullText.trim() === "") {
      addMessage(
        "...",
        "bot",
        establecimientos.length ? establecimientos : null
      );
      return;
    }

    // Dividir por frases/párrafos para envío más natural
    const parts = fullText
      .match(/[^.!?]+[.!?]*\s*/g)
      ?.map((p) => p.trim())
      .filter(Boolean) || [fullText];

    setTyping(true);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Simular "escritura" antes de añadir el fragmento
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(800 + part.length * 8, 1600))
      );
      // Si es el último fragmento, adjuntar resultados (si hay)
      const resultsToAttach =
        i === parts.length - 1 && establecimientos.length
          ? establecimientos
          : null;
      addMessage(part, "bot", resultsToAttach);
    }

    setTyping(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    addMessage(text, "user");
    setInput("");
    if (onSend) onSend(text);

    setTyping(true);

    try {
      const result = await enviarMensajeChat(text);

      const respuestaTexto =
        result?.respuesta || result?.response || result?.respuestaBot || "";

      const establecimientos = result?.results || [];

      // Enviar respuesta lenta
      await sendBotMessageSlow(respuestaTexto, establecimientos);
    } catch (err) {
      console.error("Error enviando mensaje al chat:", err);
      addMessage(
        "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.",
        "bot"
      );
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return createPortal(
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 w-16 h-16 z-[99999]">
        <button
          onClick={() => setOpen(true)}
          className="relative w-full h-full rounded-full bg-gradient-to-br from-[#49C581] to-[#37a6ca] flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-visible animate-pulse-slow"
          aria-label="Abrir asistente"
        >
          <FaRobot className="text-2xl text-white drop-shadow-md" />
          <span className="absolute inset-0 rounded-full pointer-events-none">
            <span className="absolute inset-0 rounded-full animate-glow-palette"></span>
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[99999] flex items-end justify-end md:items-center md:justify-center p-4"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md h-[85vh] md:h-[600px] flex flex-col overflow-hidden z-[100000]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#254A5D] to-[#337179] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="font-bold">Asistente Virtual</h3>
                  <div className="text-sm opacity-90 flex items-center">
                    <span className="w-2 h-2 bg-[#49C581] rounded-full mr-2" />
                    Responde al instante
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/90 hover:text-white bg-white/10 p-2 rounded-full"
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mensajes */}
            <div
              ref={messagesRef}
              id="chat-messages"
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-50 to-blue-50"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "flex-col"
                  }`}
                >
                  {m.from === "bot" ? (
                    <>
                      {/* Mensaje de texto del bot */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#49C581] to-[#3aa86d] flex items-center justify-center text-white mr-2 flex-shrink-0">
                          <FaRobot className="text-sm" />
                        </div>
                        <div className="bg-white p-2.5 rounded-2xl shadow-sm max-w-[85%]">
                          <p className="text-xs whitespace-pre-line leading-relaxed">
                            {m.text}
                          </p>
                          <p className="text-[10px] mt-1.5 text-slate-400">
                            Asistente • Ahora
                          </p>
                        </div>
                      </div>

                      {/* Tarjetas compactas de establecimientos */}
                      {m.results && m.results.length > 0 && (
                        <div className="ml-10 mt-2 space-y-2">
                          {m.results.slice(0, 3).map((est) => (
                            <EstablecimientoCard
                              key={est.id || est._id}
                              establecimiento={est}
                            />
                          ))}
                          {m.results.length > 3 && (
                            <div className="text-center bg-white/50 rounded-lg py-2">
                              <p className="text-[10px] text-slate-500">
                                +{m.results.length - 3} lugares más encontrados
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-[#37a6ca] to-[#2b8ca8] text-white p-2.5 rounded-2xl max-w-[75%]">
                        <p className="text-xs">{m.text}</p>
                        <p className="text-[10px] mt-1.5 text-white/70">
                          Ahora
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#37a6ca] to-[#2b8ca8] flex items-center justify-center text-white ml-2 flex-shrink-0">
                        <svg className="w-3 h-3" />
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Indicador de escritura compacto */}
              {typing && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#49C581] to-[#3aa86d] flex items-center justify-center text-white mr-2">
                    <FaRobot className="text-sm" />
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm flex items-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-[#49C581] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#49C581] rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-[#49C581] rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={placeholder}
                    className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C581] bg-slate-50"
                  />
                </div>

                <button
                  onClick={handleSend}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#254A5D] to-[#337179] text-white flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Enviar"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-1.5">
                Presiona Enter para enviar
              </p>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
// ...existing code...
