import {
  findAllMenuItems,
  findMenuItemById,
  findAllMenuItemsForClients,
  insertMenuItem,
  updateMenuItemById,
  deleteMenuItemById,
} from "../datos/menuRepository.js";

/**
 * Servicio del menú.
 * Capa de Lógica de Negocio - Contiene las reglas de negocio,
 * validaciones y orquestación. No conoce HTTP (req/res).
 */

const TIPOS_PERMITIDOS = ["DESAYUNO", "ALMUERZO", "CENA", "CAFETERIA"];

/**
 * Obtiene todos los items del menú (vista admin).
 */
export const obtenerMenuItems = async () => {
  return await findAllMenuItems();
};

/**
 * Obtiene un item del menú por ID.
 * @throws Error si el item no existe
 */
export const obtenerMenuItem = async (id) => {
  const rows = await findMenuItemById(id);

  if (rows.length === 0) {
    const error = new Error("Item no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

/**
 * Obtiene todos los items del menú (vista cliente).
 */
export const obtenerMenuClientes = async () => {
  return await findAllMenuItemsForClients();
};

/**
 * Crea un nuevo item en el menú.
 * @throws Error si faltan campos requeridos
 */
export const crearMenuItem = async (nombre, descripcion, precio, tipo) => {
  if (!nombre || !precio) {
    const error = new Error("Nombre y precio son requeridos");
    error.statusCode = 400;
    throw error;
  }

  const tipoFinal = TIPOS_PERMITIDOS.includes(tipo) ? tipo : "CAFETERIA";

  const result = await insertMenuItem(nombre, descripcion, precio, tipoFinal);

  return {
    id: result.insertId,
    nombre,
    descripcion,
    precio,
    tipo: tipoFinal,
  };
};

/**
 * Actualiza un item del menú existente.
 * @throws Error si el item no existe
 */
export const actualizarMenuItem = async (id, nombre, descripcion, precio, tipo) => {
  const rows = await findMenuItemById(id);

  if (rows.length === 0) {
    const error = new Error("Item no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const tipoFinal = TIPOS_PERMITIDOS.includes(tipo)
    ? tipo
    : rows[0].tipo || "CAFETERIA";

  await updateMenuItemById(id, nombre, descripcion, precio, tipoFinal);

  return { id, nombre, descripcion, precio, tipo: tipoFinal };
};

/**
 * Elimina un item del menú.
 * @throws Error si el item no existe
 */
export const eliminarMenuItem = async (id) => {
  const rows = await findMenuItemById(id);

  if (rows.length === 0) {
    const error = new Error("Item no encontrado");
    error.statusCode = 404;
    throw error;
  }

  await deleteMenuItemById(id);
};

/**
 * Elimina permanentemente un item del menú.
 * @throws Error si el item no existe
 */
export const eliminarMenuItemPermanente = async (id) => {
  const rows = await findMenuItemById(id);

  if (rows.length === 0) {
    const error = new Error("Item no encontrado");
    error.statusCode = 404;
    throw error;
  }

  await deleteMenuItemById(id);
};
