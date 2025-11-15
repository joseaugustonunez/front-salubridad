"use client";

import { useState, useEffect } from "react";
import { obtenerCategorias } from "../api/categorias";
import { obtenerTipos } from "../api/tipos";
import { crearEstablecimiento } from "../api/establecimientos";

const EstablecimientoForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [ubicacion, setUbicacion] = useState([
    {
      _id: "",
      direccion: "",
      ciudad: "",
      distrito: "",
      codigoPostal: "",
      coordenadas: {
        latitud: 0,
        longitud: 0,
      },
      referencia: "",
    },
  ]);
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Reemplazo: control por rango de día + horas -> genera 'horario' automáticamente
  const [diaInicio, setDiaInicio] = useState("Lunes");
  const [diaFin, setDiaFin] = useState("Domingo");
  const [entradaGlobal, setEntradaGlobal] = useState("");
  const [salidaGlobal, setSalidaGlobal] = useState("");
  const [horario, setHorario] = useState([]);

  // Generar horarios automáticamente cuando cambie el rango o las horas
  useEffect(() => {
    const generarHorariosDesdeRango = () => {
      const start = diasSemana.indexOf(diaInicio);
      const end = diasSemana.indexOf(diaFin);
      if (start === -1 || end === -1) {
        setHorario([]);
        return;
      }
      const nuevos = [];
      let i = start;
      while (true) {
        nuevos.push({
          dia: diasSemana[i],
          entrada: entradaGlobal,
          salida: salidaGlobal,
        });
        if (i === end) break;
        i = (i + 1) % diasSemana.length;
      }
      setHorario(nuevos);
    };

    generarHorariosDesdeRango();
  }, [diaInicio, diaFin, entradaGlobal, salidaGlobal]);

  const copiarPrimerHorarioATodos = () => {
    if (horario.length === 0) return;
    const primerHorario = horario[0];
    setHorario(horario.map(() => ({ ...primerHorario })));
  };

  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState(null);
  const [portada, setPortada] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [redesSociales, setRedesSociales] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [serverStatus, setServerStatus] = useState("checking"); // "checking", "online", "offline"

  useEffect(() => {
    const verificarServidor = async () => {
      try {
        // Intentar hacer una solicitud simple al servidor
        await fetch("/health-check", { method: "GET", mode: "cors" });
        setServerStatus("online");
      } catch (error) {
        console.error("Error al verificar el servidor:", error);
        setServerStatus("offline");
        mostrarMensaje(
          "No se puede conectar al servidor. Verifique que esté en funcionamiento.",
          "error"
        );
      }
    };

    verificarServidor();
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      if (serverStatus !== "online") return;

      try {
        setCategorias(await obtenerCategorias());
        setTipos(await obtenerTipos());
      } catch (error) {
        console.error("Error al cargar datos", error);
        mostrarMensaje(
          "Hubo un error al cargar las opciones. Intente nuevamente.",
          "error"
        );
      }
    };

    cargarDatos();
  }, [serverStatus]);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    if (tipo === "exito") {
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 5000);
    }
  };

  const obtenerUbicacionActual = (index) => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Llama a tu función para actualizar los valores
        handleUbicacionChange(index, "coordenadas.latitud", lat);
        handleUbicacionChange(index, "coordenadas.longitud", lon);
      },
      (error) => {
        alert("No se pudo obtener la ubicación: " + error.message);
      }
    );
  };
  const limpiarMensaje = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const handleMultipleSelect = (event) => {
    const values = Array.from(event.target.selectedOptions, (opt) => opt.value);
    const name = event.target.name;
    if (name === "categoria") setCategoria(values);
    else if (name === "tipo") setTipo(values);
  };

  const handleUbicacionChange = (index, campo, valor) => {
    const nuevasUbicaciones = [...ubicacion];
    if (campo.includes(".")) {
      // Para manejar campos anidados como coordenadas.latitud
      const [campoP, subCampo] = campo.split(".");
      nuevasUbicaciones[index][campoP][subCampo] = valor;
    } else {
      nuevasUbicaciones[index][campo] = valor;
    }
    setUbicacion(nuevasUbicaciones);
  };

  const handleHorarioChange = (index, field, value) => {
    const nuevosHorarios = [...horario];
    nuevosHorarios[index][field] = value;
    setHorario(nuevosHorarios);
  };

  const agregarUbicacion = () => {
    setUbicacion([
      ...ubicacion,
      {
        _id: "",
        direccion: "",
        ciudad: "",
        distrito: "",
        codigoPostal: "",
        coordenadas: {
          latitud: 0,
          longitud: 0,
        },
        referencia: "",
      },
    ]);
  };

  const eliminarUbicacion = (index) => {
    if (ubicacion.length > 1) {
      const nuevasUbicaciones = ubicacion.filter((_, i) => i !== index);
      setUbicacion(nuevasUbicaciones);
    }
  };

  const agregarHorario = () => {
    setHorario([...horario, { dia: "", entrada: "", salida: "" }]);
  };

  const eliminarHorario = (index) => {
    const nuevosHorarios = horario.filter((_, i) => i !== index);
    setHorario(nuevosHorarios);
  };

  const handleRedesSocialesChange = (red, valor) => {
    setRedesSociales({ ...redesSociales, [red]: valor });
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      // 5MB limit
      mostrarMensaje(
        "El archivo es demasiado grande. El tamaño máximo es 5MB.",
        "error"
      );
      e.target.value = "";
      return;
    }
    setter(file);
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    let filesOk = true;

    // Check size of each file
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        filesOk = false;
      }
    });

    if (!filesOk) {
      mostrarMensaje(
        "Uno o más archivos son demasiado grandes. El tamaño máximo por archivo es 5MB.",
        "error"
      );
      e.target.value = "";
      return;
    }

    if (files.length > 5) {
      mostrarMensaje("Máximo 5 imágenes adicionales permitidas.", "error");
      e.target.value = "";
      return;
    }

    setImagenes(files);
    mostrarMensaje(
      `${files.length} imágenes seleccionadas correctamente`,
      "exito"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    limpiarMensaje();

    if (serverStatus !== "online") {
      mostrarMensaje(
        "No se puede conectar al servidor. Verifique que esté en funcionamiento.",
        "error"
      );
      return;
    }

    if (
      !nombre ||
      !descripcion ||
      categoria.length === 0 ||
      tipo.length === 0
    ) {
      mostrarMensaje(
        "Por favor complete todos los campos requeridos.",
        "error"
      );
      return;
    }

    // Validar que todas las ubicaciones tengan al menos dirección y ciudad
    for (let i = 0; i < ubicacion.length; i++) {
      if (!ubicacion[i].direccion || !ubicacion[i].ciudad) {
        mostrarMensaje(
          `La ubicación #${i + 1} debe tener al menos dirección y ciudad.`,
          "error"
        );
        return;
      }
    }

    // Validar que todos los horarios estén completos
    for (let i = 0; i < horario.length; i++) {
      if (!horario[i].dia || !horario[i].entrada || !horario[i].salida) {
        mostrarMensaje(
          `El horario #${
            i + 1
          } debe tener día, hora de entrada y hora de salida.`,
          "error"
        );
        return;
      }
    }

    setCargando(true);

    try {
      await crearEstablecimiento({
        nombre,
        descripcion,
        categoria,
        tipo,
        ubicacion,
        horario,
        telefono,
        imagen,
        portada,
        imagenes,
        redesSociales,
      });

      mostrarMensaje("Establecimiento creado con éxito", "exito");
      // Reset form
      setNombre("");
      setDescripcion("");
      setCategoria([]);
      setTipo([]);
      setUbicacion([
        {
          _id: "",
          direccion: "",
          ciudad: "",
          distrito: "",
          codigoPostal: "",
          coordenadas: {
            latitud: 0,
            longitud: 0,
          },
          referencia: "",
        },
      ]);
      setTelefono("");
      setImagen(null);
      setPortada(null);
      setImagenes([]);
      setHorario([{ dia: "", entrada: "", salida: "" }]);
      setRedesSociales({
        facebook: "",
        instagram: "",
        tiktok: "",
      });

      // Limpiar los inputs de tipo file
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = "";
      });
    } catch (error) {
      console.error("Error al crear establecimiento", error);
      let mensajeError = "Hubo un error al crear el establecimiento.";

      // Extraer mensaje de error más específico si está disponible
      if (error.message) {
        mensajeError += " " + error.message;
      }

      mostrarMensaje(mensajeError, "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-xl md:max-w-5xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold text-white text-center">
            Crear Establecimiento
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-xl"
        >
          {/* Mensaje de notificación */}
          {mensaje && (
            <div className="mx-6 mt-6">
              <div
                className={`p-4 rounded-lg flex items-center ${
                  tipoMensaje === "exito"
                    ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
                    : "bg-red-50 text-red-700 border-l-4 border-red-500"
                }`}
              >
                <span
                  className={`mr-3 text-xl ${
                    tipoMensaje === "exito"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {tipoMensaje === "exito" ? "✓" : "×"}
                </span>
                <span className="text-sm font-medium">{mensaje}</span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Sección 1: Información Básica */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-5">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full mr-3">
                  1
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Básica
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Establecimiento
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm sm:text-base"
                      placeholder="Ej: Restaurante El Paraíso"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={telefono}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,9}$/.test(value)) {
                            setTelefono(value);
                          }
                        }}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        placeholder="999888777"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg min-h-[120px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                    placeholder="Describe tu establecimiento..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorías
                    </label>
                    <select
                      multiple
                      name="categoria"
                      value={categoria}
                      onChange={handleMultipleSelect}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg h-24 md:h-32 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    >
                      {categorias.map((cat) => (
                        <option key={cat._id} value={cat._id} className="py-1">
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Mantén Ctrl presionado para seleccionar múltiples
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipos
                    </label>
                    <select
                      multiple
                      name="tipo"
                      value={tipo}
                      onChange={handleMultipleSelect}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg h-24 md:h-32 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    >
                      {tipos.map((t) => (
                        <option key={t._id} value={t._id} className="py-1">
                          {t.tipo_nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Mantén Ctrl presionado para seleccionar múltiples
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Ubicaciones */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full mr-3">
                    2
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ubicaciones
                  </h3>
                </div>
              </div>
              {/* Botón debajo del título: full-width en móvil, auto en >=sm */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={agregarUbicacion}
                  className="w-full sm:w-auto flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm text-xs sm:text-sm"
                >
                  <svg
                    className="w-3 h-3 mr-2 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Agregar Ubicación
                </button>
              </div>

              <div className="space-y-4">
                {ubicacion.map((ub, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-semibold text-emerald-600">
                        Ubicación {index + 1}
                      </h4>
                      {ubicacion.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarUbicacion(index)}
                          className="text-red-500 hover:text-red-700 transition text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dirección
                          </label>
                          <input
                            type="text"
                            value={ub.direccion}
                            onChange={(e) =>
                              handleUbicacionChange(
                                index,
                                "direccion",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            placeholder="Av. Principal 123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad
                          </label>
                          <input
                            type="text"
                            value={ub.ciudad}
                            onChange={(e) =>
                              handleUbicacionChange(
                                index,
                                "ciudad",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            placeholder="Lima"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Distrito
                          </label>
                          <input
                            type="text"
                            value={ub.distrito}
                            onChange={(e) =>
                              handleUbicacionChange(
                                index,
                                "distrito",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            placeholder="Miraflores"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={ub.codigoPostal}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,5}$/.test(value)) {
                                handleUbicacionChange(
                                  index,
                                  "codigoPostal",
                                  value
                                );
                              }
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            placeholder="15046"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referencia
                        </label>
                        <input
                          type="text"
                          value={ub.referencia}
                          onChange={(e) =>
                            handleUbicacionChange(
                              index,
                              "referencia",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          placeholder="Frente al parque central"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Coordenadas
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <input
                            type="number"
                            placeholder="Latitud"
                            value={ub.coordenadas.latitud}
                            onChange={(e) =>
                              handleUbicacionChange(
                                index,
                                "coordenadas.latitud",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Longitud"
                            value={ub.coordenadas.longitud}
                            onChange={(e) =>
                              handleUbicacionChange(
                                index,
                                "coordenadas.longitud",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => obtenerUbicacionActual(index)}
                            className="flex items-center justify-center px-2 py-0.5 sm:px-3 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm"
                          >
                            <svg
                              className="w-3 h-3 mr-1 sm:mr-2 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Ubicación
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección 3: Horarios (rango de día + horas) */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full mr-3">
                    3
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Horarios de Atención (rango de días)
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Día inicio
                  </label>
                  <select
                    value={diaInicio}
                    onChange={(e) => setDiaInicio(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition text-sm"
                  >
                    {diasSemana.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Día fin
                  </label>
                  <select
                    value={diaFin}
                    onChange={(e) => setDiaFin(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition text-sm"
                  >
                    {diasSemana.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora apertura
                  </label>
                  <input
                    type="time"
                    value={entradaGlobal}
                    onChange={(e) => setEntradaGlobal(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora cierre
                  </label>
                  <input
                    type="time"
                    value={salidaGlobal}
                    onChange={(e) => setSalidaGlobal(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">Horario configurado:</p>

                {/* Resumen compacto en una sola línea (no mostrar lista detallada) */}
                <div className="mt-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-emerald-600">
                      {diaInicio} — {diaFin}
                    </span>
                    {entradaGlobal && salidaGlobal ? (
                      <span className="ml-2">
                        · {entradaGlobal} — {salidaGlobal}
                      </span>
                    ) : (
                      <span className="ml-2 text-gray-500">
                        · Horas no definidas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 4: Imágenes */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full mr-3">
                  4
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Imágenes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Imagen Principal
                    </p>
                    <p className="text-xs text-gray-500 mb-3">1200×800px</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, setImagen)}
                      className="hidden"
                      id="imagen-principal"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imagen-principal").click()
                      }
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
                    >
                      Seleccionar
                    </button>
                    {imagen && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        ✓ Imagen seleccionada
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Imagen de Portada
                    </p>
                    <p className="text-xs text-gray-500 mb-3">1920×480px</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, setPortada)}
                      className="hidden"
                      id="imagen-portada"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imagen-portada").click()
                      }
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
                    >
                      Seleccionar
                    </button>
                    {portada && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        ✓ Imagen seleccionada
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Imágenes Adicionales
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Máximo 5 imágenes
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleMultipleFilesChange}
                      className="hidden"
                      id="imagenes-adicionales"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imagenes-adicionales").click()
                      }
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
                    >
                      Seleccionar
                    </button>
                    {imagenes.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        ✓ {imagenes.length} imagen(es)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 5: Redes Sociales */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full mr-3">
                  5
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Redes Sociales
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(redesSociales).map((red) => (
                  <div key={red}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {red.charAt(0).toUpperCase() + red.slice(1)}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {red === "facebook" && "@"}
                        {red === "instagram" && "@"}
                        {red === "tiktok" && "@"}
                      </span>
                      <input
                        type="text"
                        value={redesSociales[red]}
                        onChange={(e) =>
                          handleRedesSocialesChange(red, e.target.value)
                        }
                        placeholder={`Usuario de ${red}`}
                        className="w-full pl-11 pr-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={cargando}
                className={`w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${
                  cargando ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {cargando ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creando Establecimiento...
                  </span>
                ) : (
                  "Crear Establecimiento"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstablecimientoForm;
