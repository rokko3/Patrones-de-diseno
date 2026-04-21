import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "/api/auth/register";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    const telefono = (formData.telefono || "").trim();
    const telefonoDigits = telefono.replace(/\D/g, "");
    if (telefonoDigits.length !== 10) {
      setError("El teléfono debe tener exactamente 10 dígitos");
      return;
    }
    if (!/^\d+$/.test(telefonoDigits)) {
      setError("El teléfono debe ser numérico");
      return;
    }

    const email = (formData.email || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no es válido");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true, // Permite enviar/recibir cookies
      });


      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Registro exitoso");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrarse:", error);
      setError(
        error.response?.data?.error || "Error al registrarse."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // AJUSTE FONDO: #FDFBF7
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 pt-32">
      {/* AJUSTE CONTENEDOR: Borde suave y sombra */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-[#E8E4D9]">
        {/* Header */}
        <div>
          {/* AJUSTE COLOR TEXTO: #4A4036 */}
          <h2 className="text-center text-4xl font-extrabold text-[#4A4036]">
            Crear Cuenta
          </h2>
          {/* AJUSTE COLOR SUBTITULO: #8C705F */}
          <p className="mt-2 text-center text-sm text-[#8C705F]">
            Únete a Mana Restobar
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative text-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-[#6B5D4D] mb-2" // AJUSTE LABEL
              >
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                // AJUSTE INPUT: Fondo #FAF9F6, Borde #E8E4D9, Focus #8B7355
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="Juan Pérez"
              />
            </div>
            { /* Apellido */}
            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-[#6B5D4D] mb-2"
              >
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                required
                value={formData.apellido}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="García"
              />
            </div>
            {/* Telefono*/}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-[#6B5D4D] mb-2"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="3123456789"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#6B5D4D] mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#6B5D4D] mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#6B5D4D] mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4D9] placeholder-[#9A8C7D] text-[#4A4036] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
             
              disabled={loading}
              // AJUSTE BOTÓN: bg-[#8B7355] hover-[#6F5B43]
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#8B7355] hover:bg-[#6F5B43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B7355] disabled:bg-[#E8E4D9] disabled:text-[#9A8C7D] disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </div>

          {/* Link a login */}
          <div className="text-center">
            <p className="text-sm text-[#6B5D4D]">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                // AJUSTE LINK: text-[#8B7355]
                className="font-bold text-[#8B7355] hover:text-[#6F5B43] transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;