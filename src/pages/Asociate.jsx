import React, { useState } from "react";
import {
  Check,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  ChefHat,
  Utensils,
  Camera,
  MessageCircle,
  Heart,
} from "lucide-react";

const Asociate = () => {
  const [activeTab, setActiveTab] = useState("benefits");
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <ChefHat className="w-7 h-7" />,
      title: "Muestra tus Platos",
      description: "Galería visual de tus mejores creaciones culinarias",
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: "Geolocalización",
      description: "Los clientes te encuentran fácilmente en el mapa",
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: "Horarios y Disponibilidad",
      description: "Actualiza tu menú y horarios en tiempo real",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Estadísticas",
      description: "Conoce el alcance y engagement de tu negocio",
    },
    {
      icon: <MessageCircle className="w-7 h-7" />,
      title: "Chat Directo",
      description: "Comunícate directamente con tus clientes",
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: "Reseñas y Ratings",
      description: "Construye tu reputación con opiniones verificadas",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Regístrate",
      description: "Crea tu perfil de negocio en minutos",
    },
    {
      number: "2",
      title: "Personaliza",
      description: "Añade fotos, menú, horarios y ubicación",
    },
    {
      number: "3",
      title: "Comparte",
      description: "Obtén tu enlace único y comienza a vender",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden  "
        style={{
          background: "linear-gradient(135deg, #254A5D 0%, #337179 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 mt-10 sm:mt-10 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: "#49C581" }}
              >
                <Utensils className="w-4 h-4" />
                <span className="text-sm font-semibold">100% Gratuito</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Haz Crecer tu Emprendimiento de Comida
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Únete a la plataforma que conecta emprendedores gastronómicos
                con miles de clientes hambrientos de sabor
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="px-8 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: "#F8485E" }}
                >
                  Comenzar Ahora
                </button>
                <button
                  className="px-8 py-4 rounded-full font-semibold text-lg bg-white transition-all duration-300 hover:scale-105"
                  style={{ color: "#337179" }}
                >
                  Ver Demo
                </button>
              </div>
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold">5,000+</div>
                  <div className="text-gray-300">Emprendedores</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50,000+</div>
                  <div className="text-gray-300">Clientes Activos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9⭐</div>
                  <div className="text-gray-300">Rating Promedio</div>
                </div>
              </div>
            </div>

            {/* Imagen simulada */}
            <div className="hidden lg:block">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl transform rotate-3"
                  style={{ backgroundColor: "#49C581" }}
                ></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-full"
                        style={{ backgroundColor: "#49C581" }}
                      ></div>
                      <div>
                        <div
                          className="font-bold text-lg"
                          style={{ color: "#254A5D" }}
                        >
                          Tu Negocio
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.9 (234 reseñas)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div
                        className="aspect-square rounded-xl"
                        style={{ backgroundColor: "#F8485E" }}
                      ></div>
                      <div
                        className="aspect-square rounded-xl"
                        style={{ backgroundColor: "#37a6ca" }}
                      ></div>
                      <div
                        className="aspect-square rounded-xl"
                        style={{ backgroundColor: "#337179" }}
                      ></div>
                      <div
                        className="aspect-square rounded-xl"
                        style={{ backgroundColor: "#49C581" }}
                      ></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="font-medium text-sm">Visitas hoy</span>
                        <span
                          className="font-bold"
                          style={{ color: "#49C581" }}
                        >
                          +156
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="font-medium text-sm">
                          Pedidos nuevos
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: "#F8485E" }}
                        >
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#254A5D" }}
            >
              Todo lo que Necesitas para Triunfar
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas diseñadas específicamente para emprendedores
              gastronómicos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="bg-white rounded-2xl p-8 transition-all duration-300 cursor-pointer"
                style={{
                  transform:
                    hoveredFeature === index
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredFeature === index
                      ? "0 20px 40px rgba(73, 197, 129, 0.3)"
                      : "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"
                  style={{
                    backgroundColor:
                      hoveredFeature === index ? "#49C581" : "#f0fdf4",
                    color: hoveredFeature === index ? "white" : "#49C581",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#254A5D" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#254A5D" }}
            >
              3 Pasos para Empezar
            </h2>
            <p className="text-xl text-gray-600">
              Es rápido, simple y sin complicaciones
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-1/2 w-full h-1 -z-10"
                    style={{ backgroundColor: "#49C581", opacity: 0.2 }}
                  ></div>
                )}
                <div className="text-center">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold"
                    style={{ backgroundColor: "#49C581" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: "#254A5D" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #49C581 0%, #337179 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <ChefHat className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            ¿Listo para Llevar tu Negocio al Siguiente Nivel?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Únete gratis hoy y comienza a conectar con miles de clientes
            potenciales
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Configuración en 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Soporte 24/7</span>
            </div>
          </div>
          <button
            className="px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "#F8485E", color: "white" }}
          >
            Comenzar
          </button>
          <p className="mt-6 text-sm text-gray-200">
            Más de 500 emprendedores se unieron esta semana
          </p>
        </div>
      </div>
    </div>
  );
};

export default Asociate;
