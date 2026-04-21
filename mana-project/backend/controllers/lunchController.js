import {
  obtenerImagenAlmuerzo,
  subirImagenAlmuerzo,
} from "../logica/lunchService.js";

/**
 * Controlador del almuerzo diario.
 * Capa de Presentación - Solo maneja HTTP request/response.
 * Delega la lógica de negocio al servicio correspondiente.
 */

// Controlador para obtener el menú de almuerzo del día
export const getLunchMenu = async (req, res) => {
  try {
    const result = await obtenerImagenAlmuerzo();
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al obtener el menú de almuerzo:", error);
    res.status(500).json({ error: "Error al obtener el menú de almuerzo" });
  }
};

// Controlador para subir/actualizar la imagen del almuerzo
export const uploadLunchImage = async (req, res) => {
  try {
    const imageBuffer = req.file ? req.file.buffer : null;
    await subirImagenAlmuerzo(imageBuffer);
    res.json({ message: "Imagen del almuerzo actualizada exitosamente" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al subir imagen del almuerzo:", error);
    res.status(500).json({ error: "Error al subir la imagen del almuerzo" });
  }
};