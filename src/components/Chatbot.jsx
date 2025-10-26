import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaComment,
} from "react-icons/fa";
import "./Chat.css";
import { enviarMensajeChat } from "../api/chat";

export default function Chatbot(props) {
  const {
    initialOpen = false,
    placeholder = "Escribe tu mensaje...",
    onSend, // opcional callback(message)
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
    // scroll to bottom on new message
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addMessage = (text, from = "user") => {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), from, text }]);
  };

  const simulateBotResponse = (userText) => {
    setTyping(true);
    setTimeout(() => {
      let response = "Entiendo tu consulta. ¿Quieres más detalles?";
      const t = userText.toLowerCase();
      if (t.includes("hola") || t.includes("buenos"))
        response = "¡Hola! ¿En qué puedo ayudarte hoy?";
      else if (t.includes("precio") || t.includes("costo"))
        response =
          "Los precios varían según el servicio. ¿Qué necesitas exactamente?";
      else if (t.includes("horario"))
        response = "Nuestro horario es L-V 9:00-18:00. ¿Quieres agendar?";
      addMessage(response, "bot");
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    // Añadir mensaje del usuario y limpiar input
    addMessage(text, "user");
    setInput("");
    if (onSend) onSend(text);

    // Mostrar indicador de escritura
    setTyping(true);

    try {
      // Llamada al backend
      const result = await enviarMensajeChat(text);

      // El backend puede devolver distintos shapes; priorizamos "respuesta" o "response" o "respuestaBot"
      const respuestaServidor =
        result?.respuesta ||
        result?.response ||
        result?.respuestaBot ||
        (typeof result === "string" ? result : null);

      if (respuestaServidor) {
        addMessage(respuestaServidor, "bot");
      } else if (result?.responseText) {
        addMessage(result.responseText, "bot");
      } else {
        // fallback al simulador si no hay texto
        simulateBotResponse(text);
      }
    } catch (err) {
      console.error("Error enviando mensaje al chat:", err);
      // fallback local
      simulateBotResponse(text);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return createPortal(
    <>
      {/* Botón flotante mejorado */}
      <div className="fixed bottom-6 right-6 w-16 h-16 z-[99999]">
        <button
          onClick={() => setOpen(true)}
          className="relative w-full h-full rounded-full bg-gradient-to-br from-[#49C581] to-[#37a6ca] flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-visible animate-pulse-slow"
          aria-label="Abrir asistente"
        >
          <FaRobot className="text-2xl text-white drop-shadow-md" />

          {/* Halo elegante con color de la paleta */}
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
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50 to-blue-50"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "user" ? "justify-end" : ""}`}
                >
                  {m.from === "bot" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#49C581] to-[#3aa86d] flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaRobot />
                    </div>
                  )}
                  <div
                    className={
                      m.from === "user"
                        ? "bg-gradient-to-br from-[#37a6ca] to-[#2b8ca8] text-white p-3 rounded-2xl max-w-[80%]"
                        : "bg-white p-3 rounded-2xl shadow-sm max-w-[80%]"
                    }
                  >
                    <p className="text-sm">{m.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        m.from === "user" ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {m.from === "user" ? "Ahora" : "Asistente • Ahora"}
                    </p>
                  </div>
                  {m.from === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#37a6ca] to-[#2b8ca8] flex items-center justify-center text-white ml-3 flex-shrink-0">
                      <svg className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de escritura */}
              {typing && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#49C581] to-[#3aa86d] flex items-center justify-center text-white mr-3">
                    <FaRobot />
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-[#49C581] rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-[#49C581] rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-[#49C581] rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={placeholder}
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49C581] bg-slate-50"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <button className="text-slate-400 hover:text-[#37a6ca]">
                      <FaSmile />
                    </button>
                    <button className="text-slate-400 hover:text-[#37a6ca]">
                      <FaPaperclip />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#254A5D] to-[#337179] text-white flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Enviar"
                >
                  <FaPaperPlane />
                </button>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">
                Presiona Enter para enviar • Asistente seguro
              </p>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
