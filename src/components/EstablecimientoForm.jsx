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
  const copiarPrimerHorarioATodos = () => {
  if (horario.length === 0) return;
  const primerHorario = horario[0];
  setHorario(horario.map(() => ({ ...primerHorario })));
};

  const [horario, setHorario] = useState([
    { dia: "", entrada: "", salida: "" },
  ]);

  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState(null);
  const [portada, setPortada] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [redesSociales, setRedesSociales] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
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
    mostrarMensaje(`${files.length} imágenes seleccionadas correctamente`, "exito");
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
        twitter: "",
        youtube: "",
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
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-gradient-to-r from-[#49C581] to-[#337179] p-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-white text-center">
          Crear Establecimiento
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-b-lg shadow p-5 mb-5"
      >
        {/* Mensaje de notificación */}
        {mensaje && (
          <div
            className={`mx-8 mt-6 p-4 rounded-lg flex items-center ${
              tipoMensaje === "exito"
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "bg-red-50 text-red-700 border-l-4 border-red-500"
            }`}
          >
            <span
              className={`mr-2 ${
                tipoMensaje === "exito" ? "text-green-500" : "text-red-500"
              }`}
            >
              {tipoMensaje === "exito" ? "✓" : "×"}
            </span>
            {mensaje}
          </div>
        )}
        <div className="p-8">
          <div className="mb-10">
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 text-xs rounded-md mr-2">
                1
              </span>
              Información Básica
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Nombre del establecimiento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Teléfono:
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                    className="pl-8 border border-gray-300 p-2 w-full rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Ej: 999888777"
                  />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Descripción:
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-md min-h-20 focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Describa su establecimiento"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">
                      Categorías:
                    </label>
                    <select
                      multiple
                      name="categoria"
                      value={categoria}
                      onChange={handleMultipleSelect}
                      className="border border-gray-300 p-2 w-full rounded-md h-20 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {categorias.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ctrl para múltiples
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">
                      Tipos:
                    </label>
                    <select
                      multiple
                      name="tipo"
                      value={tipo}
                      onChange={handleMultipleSelect}
                      className="border border-gray-300 p-2 w-full rounded-md h-20 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {tipos.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.tipo_nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ctrl para múltiples
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-gray-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 text-xs rounded-md mr-2">
                  2
                </span>
                Ubicaciones
              </h3>
              <button
                type="button"
                onClick={agregarUbicacion}
                className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-100 transition-all text-xs flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar
              </button>
            </div>

            {ubicacion.map((ub, index) => (
              <div
                key={index}
                className="mb-3 border border-gray-100 p-3 rounded-md bg-gray-50 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-blue-700">
                    Ubicación {index + 1}
                  </h4>
                  {ubicacion.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarUbicacion(index)}
                      className="text-red-600 hover:text-red-800 transition flex items-center text-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-gray-700 text-xs mb-1">
                      Dirección:
                    </label>
                    <input
  type="text"
  value={ub.direccion}
  onChange={e => {
    handleUbicacionChange(index, "direccion", e.target.value);
    buscarDireccion(e.target.value);
  }}
  className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
  placeholder="Av. Principal 123"
/>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1">
                      Ciudad:
                    </label>
                    <input
                      type="text"
                      value={ub.ciudad}
                      onChange={(e) =>
                        handleUbicacionChange(index, "ciudad", e.target.value)
                      }
                      className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
                      placeholder="Lima"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-gray-700 text-xs mb-1">
                      Distrito:
                    </label>
                    <input
                      type="text"
                      value={ub.distrito}
                      onChange={(e) =>
                        handleUbicacionChange(index, "distrito", e.target.value)
                      }
                      className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
                      placeholder="Miraflores"
                    />
                  </div>
                  <div>
  <label className="block text-gray-700 text-xs mb-1">
    Código Postal:
  </label>
  <input
    type="text"
    inputMode="numeric"
    pattern="\d*"
    value={ub.codigoPostal}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d{0,5}$/.test(value)) {
        handleUbicacionChange(index, "codigoPostal", value);
      }
    }}
    className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
    placeholder="15046"
  />
</div>

                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-xs mb-1">
                    Referencia:
                  </label>
                  <input
                    type="text"
                    value={ub.referencia}
                    onChange={(e) =>
                      handleUbicacionChange(index, "referencia", e.target.value)
                    }
                    className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
                    placeholder="Frente al parque central"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1">
                    Coordenadas:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-xs">
                        Lat:
                      </span>
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
                        className="pl-8 border border-gray-300 p-1.5 w-full rounded-md text-xs"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-xs">
                        Long:
                      </span>
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
                        className="pl-8 border border-gray-300 p-1.5 w-full rounded-md text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => obtenerUbicacionActual(index)}
                      className="bg-gray-100 text-gray-700 p-1.5 rounded-md hover:bg-gray-200 transition flex items-center text-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-gray-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 text-xs rounded-md mr-2">
                  3
                </span>
                Horarios
              </h3>
              <button
                type="button"
                onClick={agregarHorario}
                className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-100 transition-all text-xs flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar
              </button>
              <button
  type="button"
  onClick={copiarPrimerHorarioATodos}
  className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
>
  Copiar horario del primer día a todos
</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {horario.map((h, index) => (
                <div
                  key={index}
                  className="border border-gray-100 p-2 rounded-md bg-gray-50 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-blue-700">
                      Horario {index + 1}
                    </h4>
                    {horario.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarHorario(index)}
                        className="text-red-600 hover:text-red-800 transition flex items-center text-xs"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-gray-700 text-xs mb-1">
                        Día:
                      </label>
                      <select
                        value={h.dia}
                        onChange={(e) =>
                          handleHorarioChange(index, "dia", e.target.value)
                        }
                        className="border border-gray-300 p-1.5 w-full rounded-md text-xs"
                      >
                        <option value="">Seleccione día</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-xs mb-1">
                        Apertura:
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        <input
                          type="time"
                          value={h.entrada}
                          onChange={(e) =>
                            handleHorarioChange(
                              index,
                              "entrada",
                              e.target.value
                            )
                          }
                          className="pl-6 border border-gray-300 p-1.5 w-full rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-xs mb-1">
                        Cierre:
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        <input
                          type="time"
                          value={h.salida}
                          onChange={(e) =>
                            handleHorarioChange(index, "salida", e.target.value)
                          }
                          className="pl-6 border border-gray-300 p-1.5 w-full rounded-md text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 text-xs rounded-md mr-2">
                4
              </span>
              Imágenes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-500 transition-colors">
                <label className="block cursor-pointer">
                  <div className="mb-2 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-700 text-xs font-medium mb-1">
                    Imagen principal
                  </div>
                  <p className="text-xs text-gray-500">1200×800px</p>
                  <input
                    type="file"
                    onChange={(e) => setImagen(e.target.files[0])}
                    className="hidden"
                    id="imagen-principal"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("imagen-principal").click()
                    }
                    className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-200 transition"
                  >
                    Seleccionar
                  </button>
                </label>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-500 transition-colors">
                <label className="block cursor-pointer">
                  <div className="mb-2 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-700 text-xs font-medium mb-1">
                    Imagen de portada
                  </div>
                  <p className="text-xs text-gray-500">1920×480px</p>
                  <input
                    type="file"
                    onChange={(e) => setPortada(e.target.files[0])}
                    className="hidden"
                    id="imagen-portada"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("imagen-portada").click()
                    }
                    className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-200 transition"
                  >
                    Seleccionar
                  </button>
                </label>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-500 transition-colors">
        <label className="block cursor-pointer">
          <div className="mb-2 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-gray-700 text-xs font-medium mb-1">
            Imágenes adicionales
          </div>
          <p className="text-xs text-gray-500">
            Puedes subir múltiples imágenes (max. 5)
          </p>
          <input
            type="file"
            multiple
            onChange={handleMultipleFilesChange}
            className="hidden"
            id="imagenes-adicionales"
          />
          <button
            type="button"
            onClick={() =>
              document.getElementById("imagenes-adicionales").click()
            }
            className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-200 transition"
          >
            Seleccionar
          </button>
        </label>
      </div>
      
      {imagenes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados ({imagenes.length}):</p>
          <ul className="mt-2 space-y-1">
            {imagenes.map((file, index) => (
              <li key={index} className="text-xs text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
    <span className="bg-blue-500 text-white px-2 py-0.5 text-sm rounded-md mr-3">
      5
    </span>
    Redes Sociales
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {Object.keys(redesSociales).map((red) => (
      <div key={red}>
        <label className="block text-sm text-gray-700 font-medium mb-1 capitalize">
          {red}
        </label>
        <div className="flex items-stretch rounded-md shadow-sm overflow-hidden">
          <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 text-sm border border-r-0 border-gray-300">
            {red === "facebook" && "facebook.com/"}
            {red === "instagram" && "@"}
            {red === "twitter" && "@"}
            {red === "youtube" && "youtube.com/"}
            {red === "tiktok" && "tiktok.com/"}
          </span>
          <input
            type="text"
            value={redesSociales[red]}
            onChange={(e) => handleRedesSocialesChange(red, e.target.value)}
            placeholder={`Tu nombre de usuario en ${red}`}
            className="flex-1 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 rounded-r-md"
          />
        </div>
      </div>
    ))}
  </div>
</div>


          <div className="mt-10">
            <button
              type="submit"
              className={`w-full py-2 bg-gradient-to-r from-[#49C581] to-[#337179] text-white font-medium rounded  transition shadow ${
                cargando ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={cargando}
            >
              {cargando ? "Creando..." : "Crear Establecimiento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EstablecimientoForm;
