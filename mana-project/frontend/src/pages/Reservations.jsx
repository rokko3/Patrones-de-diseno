import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Minus, Plus, Calendar, Clock, Users, User, Phone, Mail, CalendarDays, CheckCircle, LogIn, X } from "lucide-react";

const API_URL = "/api";

function Reservations() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState(1);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tipoReserva, setTipoReserva] = useState("");
  const [detalleReserva, setDetalleReserva] = useState({
    decoracion: "",
    pastel: "",
    edadHomenajeado: "",
    empresa: "",
    requiereProyector: false,
    requiereWifi: false,
    musica: "",
    zonaPrivada: false,
    observaciones: "",
  });
  const MAX_PERSONAS = 35;
  const MIN_PERSONAS = 1;

  // Horarios base (7:30 AM - 7:00 PM)
  const horariosBase = [
    "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00"
  ];
  const tiposReserva = ["Reunion Familiar", "Cumpleaños", "Negocios", "Fiesta"];

  // Verificar autenticación al cargar (silenciosamente)
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUserData(response.data);
      // Pre-llenar datos del usuario si está autenticado
      setNombre(`${response.data.nombre || ''} ${response.data.apellido || ''}`.trim());
      setTelefono(response.data.telefono || '');
      setEmail(response.data.email || '');
    } catch (error) {
      console.log("Usuario no autenticado");
      setIsAuthenticated(false);
    }
  };

  // Cargar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (fecha) {
      fetchAvailability(fecha);
    } else {
      setHorariosDisponibles(horariosBase);
      setHorariosOcupados([]);
    }
  }, [fecha]);

  const fetchAvailability = async (selectedDate) => {
    setLoadingHorarios(true);
    setHora(""); // Limpiar hora seleccionada al cambiar fecha
    try {
      const response = await axios.get(`${API_URL}/reservations/availability?fecha=${selectedDate}`);
      setHorariosDisponibles(response.data.horariosDisponibles);
      setHorariosOcupados(response.data.horariosOcupados);
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      // En caso de error, mostrar todos los horarios
      setHorariosDisponibles(horariosBase);
      setHorariosOcupados([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handlePersonasChange = (delta) => {
    setPersonas(prev => {
      const newValue = prev + delta;
      return Math.min(MAX_PERSONAS, Math.max(MIN_PERSONAS, newValue));
    });
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const formatHora = (h) => {
    const hour = parseInt(h.split(':')[0]);
    const min = h.split(':')[1];
    if (hour >= 12) {
      return `${hour === 12 ? '12' : hour - 12}:${min} PM`;
    }
    return `${h} AM`;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^0-9\s\-+()]/g, '');
    setTelefono(cleaned);

    if (cleaned && !validatePhone(cleaned)) {
      setErrors(prev => ({ ...prev, telefono: 'El número debe tener exactamente 10 dígitos' }));
    } else {
      setErrors(prev => ({ ...prev, telefono: null }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Ingresa un correo electrónico válido' }));
    } else {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const canProceedStep1 = nombre && telefono && email && validatePhone(telefono) && validateEmail(email);
  const canProceedStep2 = fecha && hora && tipoReserva;

  const handleDetalleChange = (field, value) => {
    setDetalleReserva((prev) => ({ ...prev, [field]: value }));
  };

  const getDetallePayload = () => {
    if (tipoReserva === "Cumpleaños") {
      return {
        decoracion: detalleReserva.decoracion || null,
        pastel: detalleReserva.pastel || null,
        edadHomenajeado: detalleReserva.edadHomenajeado
          ? Number(detalleReserva.edadHomenajeado)
          : null,
      };
    }

    if (tipoReserva === "Negocios") {
      return {
        empresa: detalleReserva.empresa || null,
        requiereProyector: detalleReserva.requiereProyector ? 1 : 0,
        requiereWifi: detalleReserva.requiereWifi ? 1 : 0,
        zonaPrivada: detalleReserva.zonaPrivada ? 1 : 0,
      };
    }

    if (tipoReserva === "Fiesta") {
      return {
        musica: detalleReserva.musica || null,
        decoracion: detalleReserva.decoracion || null,
        zonaPrivada: detalleReserva.zonaPrivada ? 1 : 0,
      };
    }

    if (tipoReserva === "Reunion Familiar") {
      return {
        zonaPrivada: detalleReserva.zonaPrivada ? 1 : 0,
        observaciones: detalleReserva.observaciones || null,
      };
    }

    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !hora || !tipoReserva || !nombre || !telefono || !email) {
      return;
    }

    // Verificar si está autenticado antes de enviar
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);

    const reservaData = {
      nombre,
      telefono,
      email,
      personas,
      fecha,
      hora,
      tipoReserva,
      ...getDetallePayload(),
    };

    try {
      await axios.post(`${API_URL}/reservations`, reservaData, {
        withCredentials: true, // Enviar cookie con token
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error al crear reserva:", error);
      if (error.response?.status === 401) {
        // No autenticado
        setShowLoginModal(true);
      } else if (error.response?.status === 409) {
        // Conflicto de horario
        alert("Este horario ya no está disponible. Por favor selecciona otro horario.");
        fetchAvailability(fecha); // Recargar disponibilidad
        setStep(2); // Volver al paso de selección de hora
        setHora("");
      } else {
        alert("Error al crear la reserva. Intenta nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setPersonas(1);
    setFecha("");
    setHora("");
    setTipoReserva("");
    setDetalleReserva({
      decoracion: "",
      pastel: "",
      edadHomenajeado: "",
      empresa: "",
      requiereProyector: false,
      requiereWifi: false,
      musica: "",
      zonaPrivada: false,
      observaciones: "",
    });
    if (userData) {
      setNombre(`${userData.nombre || ''} ${userData.apellido || ''}`.trim());
      setTelefono(userData.telefono || '');
      setEmail(userData.email || '');
    } else {
      setNombre("");
      setTelefono("");
      setEmail("");
    }
    setStep(1);
    setSuccess(false);
  };

  // Modal de login requerido
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-amber-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Casi listo!</h2>
          <p className="text-gray-600 mb-6">
            Para confirmar tu reserva necesitas iniciar sesión o crear una cuenta.
            Así podrás ver y gestionar todas tus reservaciones.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login", { state: { from: "/reservations" } })}
              className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/register", { state: { from: "/reservations" } })}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
            >
              Crear Cuenta
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-4">
            Tu información de reserva se guardará mientras te registras
          </p>
        </div>
      </div>
    </div>
  );

  if (success) {
    return (
      // AJUSTE COLOR Y PADDING
      <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-[#E8E4D9]">
            <div className="w-20 h-20 bg-[#F0EBE0] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-[#8B7355]" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-[#4A4036] mb-4">Reserva Confirmada</h1>
            <p className="text-[#6B5D4D] mb-8">
              Gracias <span className="font-semibold text-[#8B7355]">{nombre}</span>, tu reserva ha sido registrada exitosamente.
              Te contactaremos por WhatsApp para coordinar los detalles.
            </p>

            <div className="bg-[#FAF9F6] rounded-2xl p-6 mb-8 text-left space-y-3 border border-[#E8E4D9]">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-[#8B7355]" size={20} />
                <span className="text-[#4A4036]">{new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-[#8B7355]" size={20} />
                <span className="text-[#4A4036]">{formatHora(hora)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-[#8B7355]" size={20} />
                <span className="text-[#4A4036]">{personas} {personas === 1 ? 'persona' : 'personas'}</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-[#8B7355] text-white py-4 rounded-xl hover:bg-[#6F5B43] transition font-semibold shadow-md"
            >
              Hacer otra reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // AJUSTE COLOR Y PADDING (pt-24 para compensar navbar)
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-12 px-4">
      {/* Modal de Login */}
      {showLoginModal && <LoginModal />}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A4036] mb-3">
            Reserva tu <span className="text-[#8B7355]">Mesa</span>
          </h1>
          <p className="text-[#6B5D4D] text-lg">
            Te contactaremos por WhatsApp para coordinar el menú
          </p>
        </div>

        {/* Progress Steps (Tonos tierra) */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-[#8B7355] text-white' : 'bg-[#E8E4D9] text-[#9A8C7D]'
              }`}>
              1
            </div>
            <div className={`w-16 h-1 rounded transition-all ${step >= 2 ? 'bg-[#8B7355]' : 'bg-[#E8E4D9]'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-[#8B7355] text-white' : 'bg-[#E8E4D9] text-[#9A8C7D]'
              }`}>
              2
            </div>
            <div className={`w-16 h-1 rounded transition-all ${step >= 3 ? 'bg-[#8B7355]' : 'bg-[#E8E4D9]'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-[#8B7355] text-white' : 'bg-[#E8E4D9] text-[#9A8C7D]'
              }`}>
              3
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Datos de Contacto */}
          <div className={`transition-all duration-300 ${step === 1 ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E8E4D9]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F0EBE0] rounded-xl flex items-center justify-center">
                  <User className="text-[#8B7355]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#4A4036]">Tus Datos</h2>
                  <p className="text-[#6B5D4D] text-sm">Ingresa tu información de contacto</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Inputs con colores tierra suaves */}
                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4036] mb-2">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8C7D]" size={20} />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] transition-all bg-[#FAF9F6]"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4036] mb-2">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8C7D]" size={20} />
                    <input
                      type="tel"
                      value={telefono}
                      onChange={handlePhoneChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#8B7355] transition-all bg-[#FAF9F6] ${errors.telefono ? 'border-red-300 focus:border-red-400' : 'border-[#E8E4D9] focus:border-[#8B7355]'
                        }`}
                      placeholder="300 123 4567"
                      maxLength={15}
                    />
                  </div>
                  {errors.telefono && (
                    <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4036] mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8C7D]" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#8B7355] transition-all bg-[#FAF9F6] ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-[#E8E4D9] focus:border-[#8B7355]'
                        }`}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full mt-8 bg-[#8B7355] text-white py-4 rounded-xl hover:bg-[#6F5B43] transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Continuar
              </button>
            </div>
          </div>

          {/* Step 2: Fecha y Hora */}
          <div className={`transition-all duration-300 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E8E4D9]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F0EBE0] rounded-xl flex items-center justify-center">
                  <Calendar className="text-[#8B7355]" size={24} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-[#4A4036]">Fecha y Hora</h2>
                  <p className="text-[#6B5D4D] text-sm">Elige cuándo quieres visitarnos</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#4A4036] mb-3">Selecciona la fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-4 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] transition-all text-lg bg-[#FAF9F6]"
                  />
                </div>
                <div className="space-y-6">
                  <label className="block text-sm font-medium text-[#4A4036] mb-3">Selecciona el tipo de reserva</label>
                  <div className="grid grid-cols-2 gap-4">
                    {tiposReserva.map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => {
                          setTipoReserva(tipo);
                          setDetalleReserva({
                            decoracion: "",
                            pastel: "",
                            edadHomenajeado: "",
                            empresa: "",
                            requiereProyector: false,
                            requiereWifi: false,
                            musica: "",
                            zonaPrivada: false,
                            observaciones: "",
                          });
                        }}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${tipoReserva === tipo
                          ? 'bg-[#8B7355] text-white shadow-lg scale-105'
                          : 'bg-[#F0EBE0] text-[#6B5D4D] hover:bg-[#E8E4D9]'
                          }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>

                {tipoReserva === "Cumpleaños" && (
                  <div className="space-y-4 bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-5">
                    <p className="text-sm font-semibold text-[#4A4036]">Detalles opcionales para cumpleaños</p>
                    <input
                      type="text"
                      value={detalleReserva.pastel}
                      onChange={(e) => handleDetalleChange("pastel", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Pastel (ej: chocolate, vainilla)"
                    />
                    <input
                      type="text"
                      value={detalleReserva.decoracion}
                      onChange={(e) => handleDetalleChange("decoracion", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Decoración (ej: temática, globos)"
                    />
                    <input
                      type="number"
                      min="1"
                      value={detalleReserva.edadHomenajeado}
                      onChange={(e) => handleDetalleChange("edadHomenajeado", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Edad del homenajeado"
                    />
                  </div>
                )}

                {tipoReserva === "Negocios" && (
                  <div className="space-y-4 bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-5">
                    <p className="text-sm font-semibold text-[#4A4036]">Detalles opcionales para negocios</p>
                    <input
                      type="text"
                      value={detalleReserva.empresa}
                      onChange={(e) => handleDetalleChange("empresa", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Empresa"
                    />
                    <label className="flex items-center gap-3 text-[#4A4036]">
                      <input
                        type="checkbox"
                        checked={detalleReserva.requiereProyector}
                        onChange={(e) => handleDetalleChange("requiereProyector", e.target.checked)}
                      />
                      Requiere proyector
                    </label>
                    <label className="flex items-center gap-3 text-[#4A4036]">
                      <input
                        type="checkbox"
                        checked={detalleReserva.requiereWifi}
                        onChange={(e) => handleDetalleChange("requiereWifi", e.target.checked)}
                      />
                      Requiere WiFi
                    </label>
                    <label className="flex items-center gap-3 text-[#4A4036]">
                      <input
                        type="checkbox"
                        checked={detalleReserva.zonaPrivada}
                        onChange={(e) => handleDetalleChange("zonaPrivada", e.target.checked)}
                      />
                      Zona privada
                    </label>
                  </div>
                )}

                {tipoReserva === "Fiesta" && (
                  <div className="space-y-4 bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-5">
                    <p className="text-sm font-semibold text-[#4A4036]">Detalles opcionales para fiesta</p>
                    <input
                      type="text"
                      value={detalleReserva.musica}
                      onChange={(e) => handleDetalleChange("musica", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Música (ej: DJ, playlist, en vivo)"
                    />
                    <input
                      type="text"
                      value={detalleReserva.decoracion}
                      onChange={(e) => handleDetalleChange("decoracion", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      placeholder="Decoración"
                    />
                    <label className="flex items-center gap-3 text-[#4A4036]">
                      <input
                        type="checkbox"
                        checked={detalleReserva.zonaPrivada}
                        onChange={(e) => handleDetalleChange("zonaPrivada", e.target.checked)}
                      />
                      Zona privada
                    </label>
                  </div>
                )}

                {tipoReserva === "Reunion Familiar" && (
                  <div className="space-y-4 bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-5">
                    <p className="text-sm font-semibold text-[#4A4036]">Detalles opcionales para reunión familiar</p>
                    <label className="flex items-center gap-3 text-[#4A4036]">
                      <input
                        type="checkbox"
                        checked={detalleReserva.zonaPrivada}
                        onChange={(e) => handleDetalleChange("zonaPrivada", e.target.checked)}
                      />
                      Zona privada
                    </label>
                    <textarea
                      value={detalleReserva.observaciones}
                      onChange={(e) => handleDetalleChange("observaciones", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E8E4D9] rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] bg-white"
                      rows={3}
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4A4036] mb-3">
                    <Clock size={16} />
                    Horario disponible: 7:30 AM - 7:00 PM
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {horariosDisponibles.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHora(h)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${hora === h
                          ? 'bg-[#8B7355] text-white shadow-lg scale-105'
                          : 'bg-[#F0EBE0] text-[#6B5D4D] hover:bg-[#E8E4D9]'
                          }`}
                      >
                        {formatHora(h)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-[#F0EBE0] text-[#6B5D4D] py-4 rounded-xl hover:bg-[#E8E4D9] transition font-semibold"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 bg-[#8B7355] text-white py-4 rounded-xl hover:bg-[#6F5B43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Número de Personas */}
          <div className={`transition-all duration-300 ${step === 3 ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E8E4D9]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F0EBE0] rounded-xl flex items-center justify-center">
                  <Users className="text-[#8B7355]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#4A4036]">Número de Personas</h2>
                  <p className="text-[#6B5D4D] text-sm">Máximo {MAX_PERSONAS} personas por reserva</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 py-10">
                <button
                  type="button"
                  onClick={() => handlePersonasChange(-1)}
                  disabled={personas <= MIN_PERSONAS}
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F0EBE0] hover:bg-[#E8E4D9] transition disabled:opacity-30 disabled:cursor-not-allowed text-[#4A4036]"
                >
                  <Minus size={28} />
                </button>

                <div className="text-center">
                  <span className="text-7xl font-bold text-[#4A4036]">{personas}</span>
                  <p className="text-[#6B5D4D] mt-2 text-lg">
                    {personas === 1 ? "persona" : "personas"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePersonasChange(1)}
                  disabled={personas >= MAX_PERSONAS}
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#8B7355] text-white hover:bg-[#6F5B43] transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                >
                  <Plus size={28} />
                </button>
              </div>

              {/* Resumen */}
              <div className="bg-[#FAF9F6] rounded-2xl p-6 mb-6 border border-[#E8E4D9]">
                <h3 className="font-semibold text-[#4A4036] mb-4">Resumen de tu reserva</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B5D4D]">Nombre:</span>
                    <span className="font-medium text-[#4A4036]">{nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5D4D]">Fecha:</span>
                    <span className="font-medium text-[#4A4036]">
                      {fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5D4D]">Hora:</span>
                    <span className="font-medium text-[#4A4036]">{hora ? formatHora(hora) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5D4D]">Tipo de reserva:</span>
                    <span className="font-medium text-[#4A4036]">{tipoReserva || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5D4D]">Personas:</span>
                    <span className="font-medium text-[#4A4036]">{personas}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#F0EBE0] text-[#6B5D4D] py-4 rounded-xl hover:bg-[#E8E4D9] transition font-semibold"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#8B7355] text-white py-4 rounded-xl hover:bg-[#6F5B43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? "Procesando..." : "Confirmar Reserva"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reservations;