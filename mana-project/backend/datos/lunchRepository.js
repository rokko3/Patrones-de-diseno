import db from "../config/db.js";

/**
 * Repositorio de acceso a datos para la tabla almuerzo_diario.
 * Capa de Datos (DAL) - Solo interactúa con la base de datos.
 */

export const findLunchImage = async () => {
  const [rows] = await db.query("SELECT almuerzo FROM almuerzo_diario LIMIT 1");
  return rows;
};

export const findLunchRecordId = async () => {
  const [rows] = await db.query("SELECT id FROM almuerzo_diario LIMIT 1");
  return rows;
};

export const updateLunchImage = async (imageBuffer, id) => {
  await db.query("UPDATE almuerzo_diario SET almuerzo = ? WHERE id = ?", [imageBuffer, id]);
};

export const insertLunchImage = async (imageBuffer) => {
  await db.query("INSERT INTO almuerzo_diario (almuerzo) VALUES (?)", [imageBuffer]);
};
