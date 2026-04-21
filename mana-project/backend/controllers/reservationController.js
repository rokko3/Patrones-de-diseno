import {
  obtenerReservaciones,
  obtenerReservacion,
  obtenerReservacionesUsuario,
  crearReservacion,
  actualizarEstadoReservacion,
  eliminarReservacion,
  verificarDisponibilidad,
} from "../logica/reservationService.js";

export const getReservations = async (req, res) => {
  try {
    const reservations = await obtenerReservaciones();
    res.json(reservations);
  } catch (error) {
    console.error("Error al obtener reservaciones:", error);
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
};

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

export const createReservation = async (req, res) => {
  try {
    const reservationData = {
      clienteId: req.usuario?.id,
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      email: req.body.email,
      personas: req.body.personas,
      fecha: req.body.fecha,
      hora: req.body.hora,
      tipoReserva: req.body.tiporeserva ?? req.body.tipoReserva,
      decoracion: req.body.decoracion,
      pastel: req.body.pastel,
      edadHomenajeado: req.body.edadHomenajeado,
      empresa: req.body.empresa,
      requiereProyector: req.body.requiereProyector,
      requiereWifi: req.body.requiereWifi,
      musica: req.body.musica,
      zonaPrivada: req.body.zonaPrivada,
      observaciones: req.body.observaciones,
    };

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