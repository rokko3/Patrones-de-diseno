import {
  findAllReservations,
  findReservationById,
  findReservationsByClienteId,
  findActiveReservationsByFecha,
  insertReservation,
  updateReservationStatusById,
  deleteReservationById,
} from "../datos/reservationRepository.js";

/**
 * Servicio de reservaciones.
 * Capa de Lógica de Negocio - Contiene las reglas de negocio,
 * validaciones y orquestación. No conoce HTTP (req/res).
 */

const ESTADOS_VALIDOS = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];
const TIPOS_RESERVA_VALIDOS = ["Reunion Familiar", "Cumpleaños", "Negocios", "Fiesta"];

const HORARIOS_BASE = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];

/**
 * Obtiene todas las reservaciones (admin).
 */
export const obtenerReservaciones = async () => {
  return await findAllReservations();
};

/**
 * Obtiene una reservación por ID.
 * @throws Error si no existe
 */
export const obtenerReservacion = async (id) => {
  const rows = await findReservationById(id);

  if (rows.length === 0) {
    const error = new Error("Reservación no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

/**
 * Obtiene las reservaciones de un cliente específico.
 * @throws Error si no hay clienteId
 */
export const obtenerReservacionesUsuario = async (clienteId) => {
  if (!clienteId) {
    const error = new Error("Usuario no autenticado");
    error.statusCode = 401;
    throw error;
  }

  return await findReservationsByClienteId(clienteId);
};

/**
 * Crea una nueva reservación.
 * Aplica reglas de negocio: validación de campos, rango de personas,
 * horario válido y disponibilidad (2h entre reservas).
 * @throws Error si falla alguna validación
 */
export const crearReservacion = async (reservationData) => {
  if (!reservationData || typeof reservationData !== "object") {
    const error = new Error("Datos de reservación inválidos");
    error.statusCode = 400;
    throw error;
  }

  const {
    clienteId,
    nombre,
    telefono,
    email,
    personas,
    fecha,
    hora,
    tipoReserva,
  } = reservationData;

  

  const tipoReservaNormalizado = TIPOS_RESERVA_VALIDOS.find(
    (tipo) => tipo.toLowerCase() === String(tipoReserva).toLowerCase().trim()
  );

  if (!tipoReservaNormalizado) {
    const error = new Error("Tipo de reserva no válido");
    error.statusCode = 400;
    throw error;
  }

  if (personas < 1 || personas > 35) {
    const error = new Error("El número de personas debe ser entre 1 y 35");
    error.statusCode = 400;
    throw error;
  }

  const [horaTexto, minutosTexto] = String(hora).split(":");
  const horaNum = parseInt(horaTexto, 10);
  const minutos = parseInt(minutosTexto, 10);

  if (
    Number.isNaN(horaNum) ||
    Number.isNaN(minutos) ||
    horaNum < 7 ||
    horaNum > 19 ||
    (horaNum === 7 && minutos < 30) ||
    (horaNum === 19 && minutos > 0)
  ) {
    const error = new Error("La hora debe estar entre 7:30 AM y 7:00 PM");
    error.statusCode = 400;
    throw error;
  }

  const existingReservations = await findActiveReservationsByFecha(fecha);
  const nuevaHoraMinutos = horaNum * 60 + minutos;

  for (const reserva of existingReservations) {
    const [h, m] = reserva.hora.split(":").map(Number);
    const reservaMinutos = h * 60 + m;
    const diferencia = Math.abs(nuevaHoraMinutos - reservaMinutos);

    if (diferencia < 120) {
      const error = new Error("Horario no disponible");
      error.statusCode = 409;
      error.details =
        "Ya existe una reserva cercana a este horario. Debe haber al menos 2 horas entre reservas.";
      throw error;
    }
  }

  const result = await insertReservation(
    clienteId,
    nombre,
    telefono,
    email,
    personas,
    fecha,
    hora,
    tipoReservaNormalizado
  );

  return {
    id: result.insertId,
    cliente_id: clienteId,
    nombre,
    telefono,
    email,
    personas,
    fecha,
    hora,
    estado: "PENDIENTE",
    tiporeserva: tipoReservaNormalizado,
  };
};

/**
 * Actualiza el estado de una reservación.
 * @throws Error si el estado no es válido o la reservación no existe
 */
export const actualizarEstadoReservacion = async (id, estado) => {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    const error = new Error("Estado no válido");
    error.statusCode = 400;
    throw error;
  }

  const result = await updateReservationStatusById(id, estado);

  if (result.affectedRows === 0) {
    const error = new Error("Reservación no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return { estado };
};

/**
 * Elimina una reservación por ID.
 * @throws Error si la reservación no existe
 */
export const eliminarReservacion = async (id) => {
  const result = await deleteReservationById(id);

  if (result.affectedRows === 0) {
    const error = new Error("Reservación no encontrada");
    error.statusCode = 404;
    throw error;
  }
};

/**
 * Verifica disponibilidad de horarios para una fecha.
 * @throws Error si no se proporciona fecha
 */
export const verificarDisponibilidad = async (fecha) => {
  if (!fecha) {
    const error = new Error("La fecha es requerida");
    error.statusCode = 400;
    throw error;
  }

  const reservations = await findActiveReservationsByFecha(fecha);

  const horasOcupadas = reservations.map((r) => {
    const [h, m] = r.hora.split(":").map(Number);
    return h * 60 + m;
  });

  const horariosDisponibles = HORARIOS_BASE.filter((horario) => {
    const [h, m] = horario.split(":").map(Number);
    const minutosTotales = h * 60 + m;
    return !horasOcupadas.some(
      (ocupada) => Math.abs(minutosTotales - ocupada) < 120
    );
  });

  return {
    fecha,
    horariosDisponibles,
    horariosOcupados: HORARIOS_BASE.filter(
      (h) => !horariosDisponibles.includes(h)
    ),
  };
};