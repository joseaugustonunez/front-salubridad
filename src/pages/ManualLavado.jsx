import React from "react";
import {
  FaHandsWash,
  FaTshirt,
  FaClock,
  FaWater,
  FaSoap,
  FaExclamationTriangle,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import { MdCleanHands, MdLocalLaundryService } from "react-icons/md";

export default function HygieneFlyer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 text-white py-12 px-4">
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl">
              <FaHandsWash className="text-6xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Manual de Higiene
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90">
            Estándares Profesionales para Manipulación de Alimentos
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-bold">99.9% efectivo</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-bold">8 pasos certificados</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-bold">40-60 segundos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Section 1: Lavado de Manos */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-full mb-6">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <FaHandsWash className="text-4xl" />
                TÉCNICA DE LAVADO DE MANOS
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-medium">
              Sigue estos 8 pasos en orden para garantizar una limpieza completa
            </p>
          </div>

          {/* Timeline de pasos */}
          <div className="relative space-y-8">
            {/* Línea vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 via-green-400 to-emerald-400 hidden md:block" />

            {/* Paso 1 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                1
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-teal-600">
                    <FaWater />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Moja tus manos
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />5 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Usa agua tibia corriente y moja completamente ambas manos
                  hasta las muñecas
                </p>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <p className="text-sm text-teal-800 font-semibold">
                    💡 Temperatura ideal: 35-40°C
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                2
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-green-600">
                    <FaSoap />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Aplica jabón
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />3 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Dispensa jabón líquido antibacterial suficiente para cubrir
                  toda la superficie
                </p>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-sm text-green-800 font-semibold">
                    💡 Aproximadamente 3-5 ml de jabón
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                3
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-emerald-600">
                    <MdCleanHands />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Frota palmas
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Frota vigorosamente palma con palma con movimientos circulares
                </p>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <p className="text-sm text-emerald-800 font-semibold">
                    💡 Genera espuma abundante
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                4
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-teal-600">
                    <FaHandsWash />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Entre dedos
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Entrelaza los dedos y fricciona los espacios interdigitales
                </p>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <p className="text-sm text-teal-800 font-semibold">
                    💡 No olvides los pulgares
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 5 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                5
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-green-600">
                    <FaHandsWash />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Dorso y palmas
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Frota el dorso de cada mano con la palma de la mano opuesta
                </p>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-sm text-green-800 font-semibold">
                    💡 Movimientos de adelante hacia atrás
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 6 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                6
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-emerald-600">
                    <FaHandsWash />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Uñas y dedos
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Limpia debajo de las uñas frotando contra la palma opuesta con
                  movimientos circulares
                </p>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <p className="text-sm text-emerald-800 font-semibold">
                    💡 Usa cepillo de uñas si disponible
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 7 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                7
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-teal-600">
                    <FaClock />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Muñecas y antebrazos
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Frota las muñecas y parte baja del antebrazo con movimientos
                  rotatorios
                </p>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <p className="text-sm text-teal-800 font-semibold">
                    💡 Hasta 5 cm sobre la muñeca
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 8 */}
            <div className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg z-10">
                8
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl text-green-600">
                    <FaWater />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                      Enjuaga completamente
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      <FaClock className="text-xs" />
                      10 segundos
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium mb-3">
                  Enjuaga con abundante agua corriente desde las puntas de los
                  dedos hasta las muñecas
                </p>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-sm text-green-800 font-semibold">
                    💡 Elimina todo rastro de jabón
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cuándo lavarse */}
          <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl border-l-8 border-red-500">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                <FaExclamationTriangle />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-slate-800 mb-6">
                  ¿Cuándo lavarse las manos?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="inline-block px-4 py-2 rounded-full font-black text-white mb-4 bg-gradient-to-r from-blue-500 to-blue-600">
                      ANTES de:
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-blue-500 font-bold">•</span>
                        <span className="font-medium">
                          Iniciar la jornada laboral
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-blue-500 font-bold">•</span>
                        <span className="font-medium">
                          Manipular alimentos listos para consumir
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-blue-500 font-bold">•</span>
                        <span className="font-medium">
                          Ponerse guantes desechables
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-blue-500 font-bold">•</span>
                        <span className="font-medium">
                          Cambiar de tarea o actividad
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="inline-block px-4 py-2 rounded-full font-black text-white mb-4 bg-gradient-to-r from-red-500 to-red-600">
                      DESPUÉS de:
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">Usar el sanitario</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">
                          Tocar alimentos crudos (carnes, pescados, huevos)
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">
                          Tocar basura o superficies contaminadas
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">
                          Tocarse la cara, cabello o cuerpo
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">Manipular dinero</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="font-medium">Limpiar o barrer</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Uniforme */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full mb-6">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <FaTshirt className="text-4xl" />
                UNIFORME PROFESIONAL
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-medium">
              Cada elemento cumple una función crítica en la seguridad
              alimentaria
            </p>
          </div>

          {/* Elementos del uniforme */}
          <div className="space-y-6">
            {/* Gorro */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
                <div className="text-7xl mb-4">👨‍🍳</div>
                <h3 className="text-3xl font-black text-white mb-2">
                  Gorro o cofia
                </h3>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-700 font-medium mb-6">
                  Cubre completamente el cabello, incluyendo patillas y
                  flequillo
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      📋 Material: Tela no tejida o malla fina
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🔄 Cambio: Cada turno o si se moja/ensucia
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      ✅ Ajuste: Cubrir todo el cabello sin mechones sueltos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chaqueta */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-8 text-center">
                <div className="text-7xl mb-4">👔</div>
                <h3 className="text-3xl font-black text-white mb-2">
                  Chaqueta de cocina
                </h3>
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                  ESENCIAL
                </div>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-700 font-medium mb-6">
                  Uniforme profesional de manga larga, limpio y en buen estado
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🎨 Color: Blanco o tonos claros
                    </p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🧵 Material: Algodón 100% o mezcla resistente
                    </p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      👕 Doble abotonadura, sin bolsillos externos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delantal */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-8 text-center">
                <div className="text-7xl mb-4">🥼</div>
                <h3 className="text-3xl font-black text-white mb-2">
                  Delantal
                </h3>
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                  IMPORTANTE
                </div>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-700 font-medium mb-6">
                  Protección adicional sobre el uniforme, ajustado correctamente
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      💧 Material: Impermeable y resistente
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      📏 Longitud: Hasta la rodilla
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🧼 Limpieza: Después de cada turno
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calzado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
                <div className="text-7xl mb-4">👟</div>
                <h3 className="text-3xl font-black text-white mb-2">
                  Calzado profesional
                </h3>
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                  ESENCIAL
                </div>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-700 font-medium mb-6">
                  Zapatos cerrados, antideslizantes y cómodos para largas
                  jornadas
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🛡️ Punta reforzada, suela antideslizante
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🧴 Material: Cuero sintético fácil de limpiar
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-sm text-slate-700 font-semibold">
                      🏢 Uso únicamente dentro de la cocina
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Normas de higiene personal */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 shadow-xl">
            <h3 className="text-3xl font-black text-slate-800 mb-8 text-center">
              Normas de Higiene Personal
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="text-5xl mb-4 text-center">💅</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Uñas cortas y limpias
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  Sin esmalte, longitud máxima 3mm
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="text-5xl mb-4 text-center">⌚</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Sin accesorios
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  Prohibido: joyas, relojes, pulseras, anillos
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="text-5xl mb-4 text-center">💇</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Cabello recogido
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  Completamente cubierto con gorro/cofia
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="text-5xl mb-4 text-center">💄</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Maquillaje moderado
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  Mínimo, sin perfumes fuertes
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="text-5xl mb-4 text-center">🧔</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Barba controlada
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  Recortada o cubierta con protector
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="text-5xl mb-4 text-center">🤧</div>
                <h4 className="text-xl font-black text-slate-800 mb-2 text-center">
                  Salud óptima
                </h4>
                <p className="text-slate-600 font-medium text-center">
                  No trabajar con síntomas de enfermedad
                </p>
              </div>
            </div>
          </div>

          {/* Mantenimiento */}
          <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl border-l-8 border-purple-500">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                <MdLocalLaundryService />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-slate-800 mb-6">
                  Mantenimiento del Uniforme
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-5xl mb-4">🧺</div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">
                      Lavado diario
                    </h4>
                    <p className="text-slate-600 font-medium">
                      Lavar el uniforme completo después de cada jornada laboral
                      con detergente antibacterial
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-5xl mb-4">🌡️</div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">
                      Temperatura adecuada
                    </h4>
                    <p className="text-slate-600 font-medium">
                      Usar agua caliente (60°C mínimo) para eliminar bacterias y
                      patógenos efectivamente
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-5xl mb-4">☀️</div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">
                      Secado correcto
                    </h4>
                    <p className="text-slate-600 font-medium">
                      Secar completamente al sol si es posible, o en secadora a
                      alta temperatura
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-5xl mb-4">🔄</div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">
                      Reemplazo inmediato
                    </h4>
                    <p className="text-slate-600 font-medium">
                      Cambiar cualquier prenda que se manche, rompa o deteriore
                      durante el turno
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
