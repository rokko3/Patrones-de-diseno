import {
  findLunchImage,
  findLunchRecordId,
  updateLunchImage,
  insertLunchImage,
} from "../datos/lunchRepository.js";

/**
 * Servicio del almuerzo diario.
 * Capa de Lógica de Negocio - Contiene las reglas de negocio,
 * validaciones y orquestación. No conoce HTTP (req/res).
 */

/**
 * Obtiene la imagen del menú del almuerzo en formato base64.
 * @throws Error si no hay imagen disponible
 */
export const obtenerImagenAlmuerzo = async () => {
  const rows = await findLunchImage();

  if (!rows || rows.length === 0) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const imagen = rows[0].almuerzo;

  if (!imagen) {
    const error = new Error("No hay imagen disponible");
    error.statusCode = 404;
    throw error;
  }

  // Convertir el buffer a base64
  const base64Image = `data:image/jpeg;base64,${imagen.toString("base64")}`;
  return { imageUrl: base64Image };
};

/**
 * Sube o actualiza la imagen del almuerzo diario.
 * Si ya existe un registro, lo actualiza; si no, crea uno nuevo.
 * @throws Error si no se proporciona imagen
 */
export const subirImagenAlmuerzo = async (imageBuffer) => {
  if (!imageBuffer) {
    const error = new Error("No se ha proporcionado ninguna imagen");
    error.statusCode = 400;
    throw error;
  }

  const existing = await findLunchRecordId();

  if (existing && existing.length > 0) {
    await updateLunchImage(imageBuffer, existing[0].id);
  } else {
    await insertLunchImage(imageBuffer);
  }
};
