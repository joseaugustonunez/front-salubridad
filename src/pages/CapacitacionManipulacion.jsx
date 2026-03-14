import React, { useState } from "react";
import {
  FaPlay,
  FaClock,
  FaUtensils,
  FaHandsWash,
  FaCheckCircle,
  FaStar,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";

export default function TrainingVideos() {
  const [completedVideos, setCompletedVideos] = useState([]);
  const [expandedVideo, setExpandedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Capacitación en seguridad del manejo de alimentos",
      duration: "34 min",
      videoUrl: "/videos/modulo1.mp4",
      description:
        "Formación dirigida a manipuladores para garantizar prácticas higiénicas y seguras en la preparación de alimentos.",
      icon: <FaUtensils />,
      emoji: "🍽️",
      headerGradient: "from-teal-500 to-green-600",
      accentColor: "teal",
      badge: "Módulo 1",
      points: [
        "Higiene personal adecuada.",
        "Prevención de contaminación de alimentos.",
        "Limpieza y desinfección de utensilios y áreas.",
      ],
      cardColors: {
        bg: "bg-teal-50",
        border: "border-teal-100",
        text: "text-teal-800",
        pill: "bg-teal-100 text-teal-800",
        pillBorder: "border-teal-200",
        btn: "bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700",
        btnDone: "bg-teal-50 border-2 border-teal-400 text-teal-800",
        dot: "bg-teal-500",
        toggleActive: "bg-gradient-to-r from-teal-500 to-green-600",
        toggleInactive: "bg-teal-50 border border-teal-200 text-teal-800",
        stripe: "from-teal-500 to-green-500",
        numBg: "from-teal-500 to-teal-600",
      },
    },
    {
      id: 2,
      title: "Tips para aplicar buenas prácticas y hábitos de higiene",
      duration: "4 min",
      videoUrl: "/videos/modulo2.mp4",
      description:
        "Son recomendaciones que ayudan a los manipuladores de alimentos a mantener condiciones higiénicas adecuadas durante la preparación y manejo de los alimentos, evitando riesgos para la salud.",
      icon: <FaHandsWash />,
      emoji: "🧼",
      headerGradient: "from-blue-600 to-cyan-600",
      accentColor: "blue",
      badge: "Módulo 2",
      points: [
        "Lavado frecuente y correcto de manos.",
        "Uso adecuado de uniforme y protección (gorro, guantes).",
        "Mantener limpias y desinfectadas las áreas de trabajo.",
      ],
      cardColors: {
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-800",
        pill: "bg-blue-100 text-blue-800",
        pillBorder: "border-blue-200",
        btn: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
        btnDone: "bg-blue-50 border-2 border-blue-400 text-blue-800",
        dot: "bg-blue-500",
        toggleActive: "bg-gradient-to-r from-blue-600 to-cyan-600",
        toggleInactive: "bg-blue-50 border border-blue-200 text-blue-800",
        stripe: "from-blue-500 to-cyan-500",
        numBg: "from-blue-600 to-blue-700",
      },
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 text-white py-12 px-4">
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl shadow-xl">
              <FaShieldAlt className="text-6xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Capacitación
          </h1>
          <p className="text-2xl md:text-3xl font-bold opacity-90 mb-2">
            Manipulación Segura de Alimentos
          </p>
          <p className="text-base opacity-75 max-w-xl mx-auto mb-10">
            Completa los módulos y fortalece tus conocimientos en seguridad alimentaria.
          </p>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-4xl mx-auto px-4 py-14 space-y-10">

        {/* Section title */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-full shadow-lg mb-4">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <FaPlay />
              VIDEOS DE CAPACITACIÓN
            </h2>
          </div>
          <p className="text-slate-600 font-medium">
            Sigue el orden de los módulos para un aprendizaje óptimo
          </p>
        </div>

        {/* Cards */}
        {videos.map((video) => {
          const isDone = completedVideos.includes(video.id);
          const isOpen = expandedVideo === video.id;
          const c = video.cardColors;

          return (
            <div
              key={video.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Colored top bar - más compacto */}
              <div
                className={`bg-gradient-to-r ${video.headerGradient} p-4 text-white text-center relative overflow-hidden`}
              >
                {/* decorative circles */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 left-8 w-14 h-14 bg-white/10 rounded-full" />

                <div className="relative flex items-center justify-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-3xl shadow-lg">
                    {video.emoji}
                  </div>
                  <div>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-bold mb-1 border border-white/30">
                      {video.badge}
                    </div>
                    <h3 className="text-lg font-black leading-tight">{video.title}</h3>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30 mt-1">
                      <FaClock className="text-xs" />
                      {video.duration}
                      {isDone && (
                        <>
                          <span className="mx-1 opacity-60">·</span>
                          <FaCheckCircle className="text-green-300" />
                          <span className="text-green-200">Completado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="relative bg-slate-900" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={video.videoUrl}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Body */}
              <div className="p-8">
                <p className="text-lg text-slate-700 font-medium mb-6 leading-relaxed">
                  {video.description}
                </p>

                {/* Points grid */}
                <div className={`grid md:grid-cols-3 gap-3 mb-6`}>
                  {video.points.map((point, i) => (
                    <div
                      key={i}
                      className={`${c.bg} rounded-xl p-4 border ${c.border}`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5 bg-gradient-to-br ${c.numBg}`}
                        >
                          {i + 1}
                        </span>
                        <p className={`text-sm font-semibold ${c.text}`}>{point}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accordion */}
                <button
                  onClick={() => setExpandedVideo(isOpen ? null : video.id)}
                  className={`flex items-center justify-between w-full text-left font-bold px-5 py-3 rounded-xl transition-all text-sm ${
                    isOpen
                      ? `${c.toggleActive} text-white shadow-md`
                      : c.toggleInactive
                  }`}
                >
                  <span className="flex items-center gap-2">
                    📋 Lo que aprenderás en este módulo
                  </span>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <ul className="mt-3 space-y-2 px-1">
                    {video.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${c.dot}`} />
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Bottom stripe */}
              <div className={`h-2 bg-gradient-to-r ${c.stripe}`} />
            </div>
          );
        })}
      </main>

    </div>
  );
}