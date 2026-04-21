export class ReservationProduct {
  constructor() {
    this.reserva = {
      clienteId: null,
      nombre: "",
      telefono: "",
      email: "",
      personas: 1,
      fecha: "",
      hora: "",
      estado: "PENDIENTE",
      tipoReserva: "",
    };

    this.detalle = {
      tipoReserva: "",
      decoracion: null,
      pastel: null,
      edadHomenajeado: null,
      empresa: null,
      requiereProyector: null,
      requiereWifi: null,
      musica: null,
      zonaPrivada: null,
      observaciones: null,
    };
  }
}