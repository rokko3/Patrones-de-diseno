import db from "../config/db.js";

/**
 * Repositorio de acceso a datos para la tabla menu.
 * Capa de Datos (DAL) - Solo interactúa con la base de datos.
 */

export const findAllMenuItems = async () => {
  const [rows] = await db.query(
    "SELECT id, nombre, descripcion, precio, tipo, fecha FROM menu ORDER BY fecha DESC"
  );
  return rows;
};

export const findMenuItemById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, nombre, descripcion, precio, tipo, fecha FROM menu WHERE id = ?",
    [id]
  );
  return rows;
};

export const findAllMenuItemsForClients = async () => {
  const [rows] = await db.query(
    "SELECT * FROM menu ORDER BY tipo, nombre ASC"
  );
  return rows;
};

export const insertMenuItem = async (nombre, descripcion, precio, tipo) => {
  const [result] = await db.query(
    "INSERT INTO menu (nombre, descripcion, precio, tipo) VALUES (?, ?, ?, ?)",
    [nombre, descripcion, precio, tipo]
  );
  return result;
};

export const updateMenuItemById = async (id, nombre, descripcion, precio, tipo) => {
  const [result] = await db.query(
    "UPDATE menu SET nombre = ?, descripcion = ?, precio = ?, tipo = ? WHERE id = ?",
    [nombre, descripcion, precio, tipo, id]
  );
  return result;
};

export const deleteMenuItemById = async (id) => {
  const [result] = await db.query("DELETE FROM menu WHERE id = ?", [id]);
  return result;
};
