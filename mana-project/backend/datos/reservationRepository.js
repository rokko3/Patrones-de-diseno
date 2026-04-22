import db from "../config/db.js";

/**
 * Repositorio de acceso a datos para la tabla reservas.
 * Capa de Datos (DAL) - Solo interactúa con la base de datos.
 */

export const findAllReservations = async () => {
  const [rows] = await db.query(
    `SELECT
      r.*,
      d.tipo_reserva,
      d.decoracion,
      d.pastel,
      d.edad_homenajeado,
      d.empresa,
      d.requiere_proyector,
      d.requiere_wifi,
      d.musica,
      d.zona_privada,
      d.observaciones
     FROM reservas r
     LEFT JOIN detalle_reserva d ON d.reserva_id = r.id
     ORDER BY r.fecha DESC, r.hora DESC`
  );
  return rows;
};

export const findReservationById = async (id) => {
  const [rows] = await db.query(
    `SELECT
      r.*,
      d.tipo_reserva,
      d.decoracion,
      d.pastel,
      d.edad_homenajeado,
      d.empresa,
      d.requiere_proyector,
      d.requiere_wifi,
      d.musica,
      d.zona_privada,
      d.observaciones
     FROM reservas r
     LEFT JOIN detalle_reserva d ON d.reserva_id = r.id
     WHERE r.id = ?`,
    [id]
  );
  return rows;
};

export const findReservationsByClienteId = async (clienteId) => {
  const [rows] = await db.query(
    `SELECT
      r.*,
      d.tipo_reserva,
      d.decoracion,
      d.pastel,
      d.edad_homenajeado,
      d.empresa,
      d.requiere_proyector,
      d.requiere_wifi,
      d.musica,
      d.zona_privada,
      d.observaciones
     FROM reservas r
     LEFT JOIN detalle_reserva d ON d.reserva_id = r.id
     WHERE r.cliente_id = ?
     ORDER BY r.fecha DESC, r.hora DESC`,
    [clienteId]
  );
  return rows;
};

export const findActiveReservationsByFecha = async (fecha) => {
  const [rows] = await db.query(
    "SELECT hora FROM reservas WHERE fecha = ? AND estado NOT IN ('CANCELADA', 'COMPLETADA')",
    [fecha]
  );
  return rows;
};

export const insertReservation = async (clienteId, nombre, telefono, email, personas, fecha, hora) => {
  const [result] = await db.query(
    `INSERT INTO reservas (cliente_id, nombre, telefono, email, personas, fecha, hora, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
    [clienteId, nombre, telefono, email, personas, fecha, hora]
  );
  return result;
};

export const updateReservationStatusById = async (id, estado) => {
  const [result] = await db.query(
    "UPDATE reservas SET estado = ? WHERE id = ?",
    [estado, id]
  );
  return result;
};

export const deleteReservationById = async (id) => {
  const [result] = await db.query("DELETE FROM reservas WHERE id = ?", [id]);
  return result;
};
