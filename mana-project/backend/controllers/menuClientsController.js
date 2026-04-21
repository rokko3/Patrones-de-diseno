import { obtenerMenuClientes } from "../logica/menuService.js";

/**
 * Controlador del menú para clientes.
 * Capa de Presentación - Solo maneja HTTP request/response.
 * Delega la lógica de negocio al servicio correspondiente.
 */

// Obtener el menú para clientes (público)
export const getClientMenu = async (req, res) => {
  try {
    const items = await obtenerMenuClientes();
    res.json(items);
  } catch (error) {
    console.error("Error al obtener menú de clientes:", error);
    res.status(500).json({ error: "Error al obtener el menú" });
  }
};
