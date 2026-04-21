import {
  registrarUsuario,
  autenticarUsuario,
  obtenerPerfil,
  verificarEsAdmin,
  manejarErrorBD,
} from "../logica/authService.js";

/**
 * Controlador de autenticación.
 * Capa de Presentación - Solo maneja HTTP request/response.
 * Delega la lógica de negocio al servicio correspondiente.
 */

export const registerUser = async (req, res) => {
  const { nombre, apellido, telefono, email, password } = req.body;

  try {
    const result = await registrarUsuario(nombre, apellido, telefono, email, password);

    res.json({
      message: "Usuario registrado correctamente",
      user: result.user,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    const errorInfo = manejarErrorBD(err);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await autenticarUsuario(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login exitoso",
      usuario: result.usuario,
      token: result.token,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    const errorInfo = manejarErrorBD(err);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const perfil = await obtenerPerfil(req.usuario.id);
    res.json(perfil);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    const errorInfo = manejarErrorBD(err);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Logout exitoso" });
};

// Verificar si el usuario es admin
export const checkAdmin = async (req, res) => {
  try {
    const result = await verificarEsAdmin(req.usuario.id, req.usuario.email);
    res.json(result);
  } catch (err) {
    console.error("Error al verificar admin:", err);
    res.status(500).json({ error: "Error al verificar permisos" });
  }
};
