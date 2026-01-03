import React, { useState } from "react";
import {
  FaPlay,
  FaClock,
  FaUtensils,
  FaHandsWash,
  FaTshirt,
  FaThermometerHalf,
  FaShieldAlt,
  FaSprayCan,
  FaChevronDown,
  FaCheckCircle,
  FaStar,
  FaArrowDown,
} from "react-icons/fa";

export default function TrainingVideos() {
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  const videos = [
    {
      id: 1,
      title: "Introducción a la Manipulación de Alimentos",
      duration: "15 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Aprende los fundamentos básicos y la importancia de manipular alimentos de forma segura.",
      icon: <FaUtensils />,
      color: "#49C581",
      bgColor: "bg-emerald-50",
      borderColor: "border-[#49C581]",
      emoji: "🍽️",
      points: [
        "Conceptos básicos de seguridad alimentaria",
        "Importancia de las buenas prácticas",
        "Normativas y regulaciones vigentes",
      ],
    },
    {
      id: 2,
      title: "Técnica Correcta de Lavado de Manos",
      duration: "10 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Descubre los 8 pasos esenciales para un lavado de manos efectivo y cuándo realizarlo.",
      icon: <FaHandsWash />,
      color: "#337179",
      bgColor: "bg-cyan-50",
      borderColor: "border-[#337179]",
      emoji: "🧼",
      points: [
        "Los 8 pasos del lavado correcto",
        "Momentos críticos para lavarse",
        "Errores comunes a evitar",
      ],
    },
    {
      id: 3,
      title: "Uso Adecuado del Uniforme",
      duration: "12 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Conoce cómo vestir correctamente el uniforme y mantener la higiene personal en cocina.",
      icon: <FaTshirt />,
      color: "#254A5D",
      bgColor: "bg-slate-50",
      borderColor: "border-[#254A5D]",
      emoji: "👔",
      points: [
        "Elementos del uniforme profesional",
        "Normas de higiene personal",
        "Mantenimiento y limpieza diaria",
      ],
    },
    {
      id: 4,
      title: "Control de Temperaturas en Alimentos",
      duration: "18 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Entiende la zona de peligro y las temperaturas correctas para almacenar y cocinar.",
      icon: <FaThermometerHalf />,
      color: "#F8485E",
      bgColor: "bg-red-50",
      borderColor: "border-[#F8485E]",
      emoji: "🌡️",
      points: [
        "La zona de peligro de temperatura",
        "Temperaturas de almacenamiento",
        "Control durante la cocción",
      ],
    },
    {
      id: 5,
      title: "Prevención de Contaminación Cruzada",
      duration: "20 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Evita la contaminación entre alimentos crudos y cocidos con estas prácticas esenciales.",
      icon: <FaShieldAlt />,
      color: "#37a6ca",
      bgColor: "bg-sky-50",
      borderColor: "border-[#37a6ca]",
      emoji: "🛡️",
      points: [
        "Tipos de contaminación cruzada",
        "Separación de alimentos crudos y cocidos",
        "Uso correcto de tablas y utensilios",
      ],
    },
    {
      id: 6,
      title: "Limpieza y Desinfección Efectiva",
      duration: "16 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "Aprende la diferencia entre limpiar y desinfectar, y cómo hacerlo correctamente.",
      icon: <FaSprayCan />,
      color: "#49C581",
      bgColor: "bg-emerald-50",
      borderColor: "border-[#49C581]",
      emoji: "✨",
      points: [
        "Diferencia entre limpieza y desinfección",
        "Productos y químicos apropiados",
        "Procedimientos paso a paso",
      ],
    },
  ];

  const toggleComplete = (videoId) => {
    setCompletedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Header - Mejorado */}
      <header
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(to right, #337179, #254A5D, #37a6ca)",
        }}
      >
        {/* Patrones decorativos animados */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-ping-slow" />
          <div className="absolute top-40 right-20 w-32 h-32 border-4 border-white rounded-full animate-ping-slower" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-4 border-white rounded-full animate-ping-slow" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/30 shadow-xl animate-fade-in-down">
            <FaStar
              className="animate-spin-slow"
              style={{ color: "#49C581" }}
            />
            <span className="font-bold text-sm tracking-wider">
              CERTIFICACIÓN PROFESIONAL
            </span>
            <FaStar
              className="animate-spin-slow"
              style={{ color: "#49C581" }}
            />
          </div>

          {/* Icono principal con animación */}
          <div className="inline-block mb-8 animate-float">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-2xl animate-pulse-slow opacity-60"
                style={{
                  background: "linear-gradient(to right, #49C581, #37a6ca)",
                }}
              />
              <div className="relative bg-white/20 backdrop-blur-lg p-8 rounded-3xl border-4 border-white/30 shadow-2xl">
                <FaPlay className="text-7xl drop-shadow-2xl" />
              </div>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight animate-fade-in">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white, #49C581, white)",
              }}
            >
              Ruta de Aprendizaje
            </span>
          </h1>
          <p className="text-3xl md:text-4xl opacity-95 font-bold mb-4 animate-fade-in-up">
            Manipulación Segura de Alimentos
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto animate-fade-in-up-delayed">
            Sigue el camino del conocimiento paso a paso
          </p>

          {/* Stats mejorados */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { value: "6", label: "Módulos", icon: "📚" },
              { value: "91", label: "Minutos", icon: "⏱️" },
              { value: "100%", label: "Gratis", icon: "🎁" },
              { value: "∞", label: "Acceso", icon: "🔓" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group hover:scale-110 transition-transform duration-300"
              >
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="text-5xl mb-2">{stat.icon}</div>
                  <div className="text-5xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-6 overflow-hidden border border-white/30">
              <div
                className="h-full transition-all duration-500 flex items-center justify-end px-4"
                style={{
                  width: `${(completedVideos.length / videos.length) * 100}%`,
                  background: "linear-gradient(to right, #49C581, #37a6ca)",
                }}
              >
                {completedVideos.length > 0 && (
                  <span className="text-xs font-bold text-white">
                    {Math.round((completedVideos.length / videos.length) * 100)}
                    %
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm mt-2 opacity-80">
              {completedVideos.length} de {videos.length} módulos completados
            </p>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </header>

      {/* Learning Path - Zigzag Layout */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Título de sección */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full shadow-xl mb-6"
            style={{
              background: "linear-gradient(to right, #337179, #37a6ca)",
            }}
          >
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-lg">Tu Camino al Éxito</span>
          </div>
          <h2 className="text-5xl font-black text-slate-800 mb-4">
            Aprende Paso a Paso
          </h2>
          <p className="text-xl text-slate-600">
            Sigue la ruta y conviértete en un experto
          </p>
        </div>

        <div className="relative">
          {/* Línea central conectora */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, #49C581, #337179, #37a6ca)",
            }}
          />

          {videos.map((video, index) => {
            const isLeft = index % 2 === 0;
            const isCompleted = completedVideos.includes(video.id);

            return (
              <div key={video.id} className="relative mb-12 last:mb-0">
                {/* Connector dot */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div
                    className={`w-20 h-20 rounded-full border-4 shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-125 ${
                      isCompleted ? "border-green-300" : "border-white"
                    }`}
                    style={{
                      background: isCompleted
                        ? "linear-gradient(to bottom right, #49C581, #10b981)"
                        : video.color,
                    }}
                  >
                    {isCompleted ? (
                      <FaCheckCircle className="text-4xl text-white" />
                    ) : (
                      <span className="text-3xl font-black text-white">
                        {video.id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`md:w-[calc(50%-60px)] ${
                    isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                  }`}
                >
                  <article
                    className={`group relative transform transition-all duration-500 hover:scale-105 ${
                      isLeft
                        ? "md:hover:translate-x-4"
                        : "md:hover:-translate-x-4"
                    }`}
                  >
                    {/* Número flotante (móvil) */}
                    <div className="md:hidden absolute -left-4 -top-4 z-10">
                      <div
                        className="w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center"
                        style={{
                          background: isCompleted
                            ? "linear-gradient(to bottom right, #49C581, #10b981)"
                            : video.color,
                        }}
                      >
                        {isCompleted ? (
                          <FaCheckCircle className="text-3xl text-white" />
                        ) : (
                          <span className="text-2xl font-black text-white">
                            {video.id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Card */}
                    <div
                      className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 ${
                        isCompleted ? "border-green-400" : video.borderColor
                      } hover:shadow-3xl transition-all duration-300`}
                    >
                      {/* Completed Badge */}
                      {isCompleted && (
                        <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 animate-bounce-in">
                          <FaCheckCircle />
                          Completado
                        </div>
                      )}

                      {/* Header con gradiente */}
                      <div
                        className={`relative ${video.bgColor} p-6 border-b-4 ${video.borderColor}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl transform group-hover:rotate-12 transition-transform duration-300"
                            style={{ background: video.color }}
                          >
                            {video.icon}
                          </div>

                          {/* Title & Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 leading-tight">
                              {video.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <div
                                className="flex items-center gap-2 text-white px-4 py-2 rounded-full shadow-md font-bold text-sm"
                                style={{ background: video.color }}
                              >
                                <FaClock />
                                {video.duration}
                              </div>
                              <div className="text-4xl animate-bounce-slow">
                                {video.emoji}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Player */}
                      <div
                        className="relative bg-slate-900 group/video"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={video.videoUrl}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/10 transition-colors pointer-events-none" />
                      </div>

                      {/* Description & Points */}
                      <div className="p-6">
                        <p className="text-lg text-slate-700 leading-relaxed mb-4">
                          {video.description}
                        </p>

                        {/* Expandable Points */}
                        <div>
                          <button
                            onClick={() =>
                              setExpandedVideo(
                                expandedVideo === video.id ? null : video.id
                              )
                            }
                            className={`flex items-center justify-between w-full text-left font-bold px-4 py-3 rounded-xl transition-all ${
                              expandedVideo === video.id
                                ? "text-white shadow-lg"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            }`}
                            style={
                              expandedVideo === video.id
                                ? { background: video.color }
                                : {}
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span>📋</span>
                              <span>Lo que aprenderás</span>
                            </span>
                            <FaChevronDown
                              className={`transition-transform duration-300 ${
                                expandedVideo === video.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedVideo === video.id
                                ? "max-h-96 mt-4"
                                : "max-h-0"
                            }`}
                          >
                            <ul className="space-y-3 bg-slate-50 rounded-xl p-4">
                              {video.points.map((point, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 animate-fade-in"
                                  style={{
                                    animationDelay: `${idx * 100}ms`,
                                  }}
                                >
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                                    style={{ background: video.color }}
                                  >
                                    {idx + 1}
                                  </div>
                                  <span className="text-slate-700 leading-relaxed pt-1">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Complete Button */}
                        <button
                          onClick={() => toggleComplete(video.id)}
                          className="mt-6 w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
                          style={{
                            background: isCompleted
                              ? "linear-gradient(to right, #49C581, #10b981)"
                              : video.color,
                          }}
                        >
                          {isCompleted ? (
                            <span className="flex items-center justify-center gap-2">
                              <FaCheckCircle />
                              ¡Completado!
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <FaPlay />
                              Marcar como completado
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Accent Line */}
                      <div
                        className="h-3"
                        style={{ background: video.color }}
                      />
                    </div>
                  </article>
                </div>

                {/* Arrow down (between videos) */}
                {index < videos.length - 1 && (
                  <div className="flex justify-center py-4 md:py-6">
                    <div className="animate-bounce-slow">
                      <FaArrowDown
                        className="text-4xl"
                        style={{ color: "#37a6ca" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* CTA Section - Mejorado */}
      <section
        className="relative overflow-hidden text-white py-24"
        style={{
          background: "linear-gradient(to right, #254A5D, #337179, #49C581)",
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-float-delayed"
            style={{ background: "#37a6ca" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-float-slow"
            style={{ background: "#F8485E" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block animate-bounce-slow mb-6">
            <div className="text-8xl drop-shadow-2xl">🎓</div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            ¿Listo para dominar la{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #49C581, #37a6ca)",
              }}
            >
              manipulación segura
            </span>
            ?
          </h2>
          <p className="text-2xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
            Completa todos los módulos y obtén tu certificación profesional
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/30 shadow-xl">
              <div className="flex items-center gap-3">
                <FaStar className="text-2xl" style={{ color: "#49C581" }} />
                <span className="font-bold">Certificación Incluida</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/30 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <span className="font-bold">A Tu Propio Ritmo</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/30 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔓</span>
                <span className="font-bold">Acceso Ilimitado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(15px);
          }
        }

        @keyframes ping-slow {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes ping-slower {
          75%,
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up-delayed {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          50% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up-delayed 1.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
