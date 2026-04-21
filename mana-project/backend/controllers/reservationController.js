import {
  obtenerReservaciones,
  obtenerReservacion,
  obtenerReservacionesUsuario,
  crearReservacion,
  actualizarEstadoReservacion,
  eliminarReservacion,
  verificarDisponibilidad,
} from "../logica/reservationService.js";

import { ReservationBuilder } from "../logica/ReservationBuilder.js";

/**
 * Controlador de reservaciones.
 * Capa de Presentación - Solo maneja HTTP request/response.
 * Delega la lógica de negocio al servicio correspondiente.
 */

// Obtener todas las reservaciones
export const getReservations = async (req, res) => {
  try {
    const reservations = await obtenerReservaciones();
    res.json(reservations);
  } catch (error) {
    console.error("Error al obtener reservaciones:", error);
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
};

// Obtener una reservación por ID
export const getReservation = async (req, res) => {
  try {
    const reservation = await obtenerReservacion(req.params.id);
    res.json(reservation);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al obtener reservación:", error);
    res.status(500).json({ error: "Error al obtener reservación" });
  }
};

// Obtener reservaciones del usuario autenticado
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await obtenerReservacionesUsuario(req.usuario?.id);
    res.json(reservations);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al obtener reservaciones del usuario:", error);
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
};

// Crear una nueva reservación
export const createReservation = async (req, res) => {
  try {
    const reservationData = new ReservationBuilder()
      .setClienteId(req.usuario?.id)
      .setNombre(req.body.nombre)
      .setTelefono(req.body.telefono)
      .setEmail(req.body.email)
      .setPersonas(req.body.personas)
      .setFecha(req.body.fecha)
      .setHora(req.body.hora)
      .setTipoReserva(req.body.tiporeserva ?? req.body.tipoReserva)
      .build();

    const reservation = await crearReservacion(reservationData);

    res.status(201).json(reservation);
  } catch (error) {
    if (error.statusCode) {
      const response = { error: error.message };
      if (error.details) response.message = error.details;
      return res.status(error.statusCode).json(response);
    }
    console.error("Error al crear reservación:", error);
    res.status(500).json({ error: "Error al crear reservación" });
  }
};

// Actualizar estado de reservación
export const updateReservationStatus = async (req, res) => {
  try {
    const result = await actualizarEstadoReservacion(req.params.id, req.body.estado);
    res.json({ message: "Estado actualizado correctamente", ...result });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al actualizar reservación:", error);
    res.status(500).json({ error: "Error al actualizar reservación" });
  }
};

// Eliminar reservación
export const deleteReservation = async (req, res) => {
  try {
    await eliminarReservacion(req.params.id);
    res.json({ message: "Reservación eliminada correctamente" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al eliminar reservación:", error);
    res.status(500).json({ error: "Error al eliminar reservación" });
  }
};

// Verificar disponibilidad de horarios para una fecha
export const checkAvailability = async (req, res) => {
  try {
    const result = await verificarDisponibilidad(req.query.fecha);
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error al verificar disponibilidad:", error);
    res.status(500).json({ error: "Error al verificar disponibilidad" });
  }
};