import db from "../config/db.js";

export const insertReservationDetail = async (reservaId, detalle) => {
  const [result] = await db.query(
    `INSERT INTO detalle_reserva
     (reserva_id, tipo_reserva, decoracion, pastel, edad_homenajeado, empresa,
      requiere_proyector, requiere_wifi, musica, zona_privada, observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reservaId,
      detalle.tipoReserva,
      detalle.decoracion,
      detalle.pastel,
      detalle.edadHomenajeado,
      detalle.empresa,
      detalle.requiereProyector,
      detalle.requiereWifi,
      detalle.musica,
      detalle.zonaPrivada,
      detalle.observaciones,
    ]
  );

  return result;
};