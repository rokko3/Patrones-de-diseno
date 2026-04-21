import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  findClienteByEmail,
  findClienteById,
  findClientePasswordById,
  insertCliente,
} from "../datos/clienteRepository.js";

dotenv.config();

const jwt_hash = process.env.JWT_SECRET;

/**
 * Servicio de autenticación.
 * Capa de Lógica de Negocio - Contiene las reglas de negocio,
 * validaciones y orquestación. No conoce HTTP (req/res).
 */

/**
 * Maneja errores de base de datos y retorna un objeto con status y message.
 */
export const manejarErrorBD = (error) => {
  console.error("Error de base de datos:", error);

  if (error.code === "ECONNREFUSED") {
    return {
      status: 503,
      message: "No se puede conectar a la base de datos.",
    };
  }

  if (error.code === "ENOTFOUND") {
    return {
      status: 503,
      message: "Servidor de base de datos no encontrado.",
    };
  }

  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return {
      status: 503,
      message: "Error de credenciales de base de datos.",
    };
  }

  if (error.code === "ETIMEDOUT") {
    return {
      status: 503,
      message: "Timeout de conexión a la base de datos.",
    };
  }

  return {
    status: 500,
    message: "Error interno del servidor.",
  };
};

/**
 * Registra un nuevo usuario.
 * @returns {{ user: object }} datos del usuario creado
 * @throws Error si el email ya está registrado o hay error de BD
 */
export const registrarUsuario = async (nombre, apellido, telefono, email, password) => {
  const existing = await findClienteByEmail(email);

  if (existing.length > 0) {
    const error = new Error("El email ya está registrado");
    error.statusCode = 400;
    throw error;
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await insertCliente(nombre, apellido, telefono, email, hash);

  return {
    user: { id: result.insertId, nombre, email },
  };
};

/**
 * Autentica un usuario con email y password.
 * @returns {{ usuario: object, token: string }} datos del usuario y token JWT
 * @throws Error si las credenciales son inválidas
 */
export const autenticarUsuario = async (email, password) => {
  const usuarios = await findClienteByEmail(email);

  if (usuarios.length === 0) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 400;
    throw error;
  }

  const user = usuarios[0];
  const match = await bcrypt.compare(password, user.Contrasena);

  if (!match) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 400;
    throw error;
  }

  const access_token = jwt.sign(
    { id: user.cliente_id, email: user.Email },
    jwt_hash,
    { expiresIn: "8h" }
  );

  return {
    usuario: {
      id: user.cliente_id,
      nombre: user.Nombre,
      apellido: user.Apellido,
      email: user.Email,
    },
    token: access_token,
  };
};

/**
 * Obtiene el perfil de un usuario por su ID.
 * @returns {object} datos del perfil
 * @throws Error si el usuario no existe
 */
export const obtenerPerfil = async (userId) => {
  const usuarios = await findClienteById(userId);

  if (usuarios.length === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const user = usuarios[0];
  return {
    id: user.cliente_id,
    nombre: user.Nombre,
    apellido: user.Apellido,
    telefono: user.Telefono,
    email: user.Email,
  };
};

/**
 * Verifica si un usuario es administrador.
 * @returns {{ isAdmin: boolean }}
 */
export const verificarEsAdmin = async (userId, userEmail) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_HASH;

  if (!adminEmail || !adminEmail.includes(userEmail)) {
    return { isAdmin: false };
  }

  const usuarios = await findClientePasswordById(userId);

  if (usuarios.length === 0) {
    return { isAdmin: false };
  }

  const match = await bcrypt.compare(adminPassword, usuarios[0].Contrasena);
  return { isAdmin: match };
};
