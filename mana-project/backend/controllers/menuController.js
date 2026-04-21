import {
  obtenerMenuItems,
  obtenerMenuItem,
  crearMenuItem,
  actualizarMenuItem,
  eliminarMenuItem,
  eliminarMenuItemPermanente,
} from "../logica/menuService.js";

/**
 * Controlador del menú.
 * Capa de Presentación - Solo maneja HTTP request/response.
 * Delega la lógica de negocio al servicio correspondiente.
 */

// Obtener todos los items del menú
export const getMenuItems = async (req, res) => {
  try {
    const items = await obtenerMenuItems();
    res.json(items);
  } catch (error) {
    console.error("Error al obtener menú:", error);
    res.status(500).json({ error: "Error al obtener el menú" });
  }
};

// Obtener un item por ID
export const getMenuItem = async (req, res) => {
  try {
    const item = await obtenerMenuItem(req.params.id);
    res.json(item);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al obtener item:", error);
    res.status(500).json({ error: "Error al obtener el item" });
  }
};

// Crear un nuevo item del menú
export const createMenuItem = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo } = req.body;
    const item = await crearMenuItem(nombre, descripcion, precio, tipo);

    res.status(201).json({
      ...item,
      mensaje: "Item creado exitosamente",
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al crear item:", error);
    res.status(500).json({ error: "Error al crear el item" });
  }
};

// Actualizar un item del menú
export const updateMenuItem = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo } = req.body;
    const item = await actualizarMenuItem(req.params.id, nombre, descripcion, precio, tipo);

    res.json({
      ...item,
      mensaje: "Item actualizado exitosamente",
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al actualizar item:", error);
    res.status(500).json({ error: "Error al actualizar el item" });
  }
};

// Eliminar un item
export const deleteMenuItem = async (req, res) => {
  try {
    await eliminarMenuItem(req.params.id);
    res.json({ mensaje: "Item eliminado exitosamente" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al eliminar item:", error);
    res.status(500).json({ error: "Error al eliminar el item" });
  }
};

// Eliminar permanentemente
export const hardDeleteMenuItem = async (req, res) => {
  try {
    await eliminarMenuItemPermanente(req.params.id);
    res.json({ mensaje: "Item eliminado permanentemente" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al eliminar item:", error);
    res.status(500).json({ error: "Error al eliminar el item" });
  }
};
