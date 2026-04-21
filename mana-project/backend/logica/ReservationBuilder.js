export class ReservationBuilder {
  constructor() {
    this.reservation = {
      clienteId: null,
      nombre: "",
      telefono: "",
      email: "",
      personas: null,
      fecha: "",
      hora: "",
      tipoReserva: "",
    };
  }

  static badRequest(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
  }

  setClienteId(value) {
    this.reservation.clienteId = value;
    return this;
  }

  setNombre(value) {
    this.reservation.nombre = String(value ?? "").trim();
    return this;
  }

  setTelefono(value) {
    this.reservation.telefono = String(value ?? "").trim();
    return this;
  }

  setEmail(value) {
    this.reservation.email = String(value ?? "").trim();
    return this;
  }

  setPersonas(value) {
    this.reservation.personas = Number(value);
    return this;
  }

  setFecha(value) {
    this.reservation.fecha = String(value ?? "").trim();
    return this;
  }

  setHora(value) {
    this.reservation.hora = String(value ?? "").trim();
    return this;
  }

  setTipoReserva(value) {
    this.reservation.tipoReserva = String(value ?? "").trim();
    return this;
  }

  build() {
    const {
      clienteId,
      nombre,
      telefono,
      email,
      personas,
      fecha,
      hora,
      tipoReserva,
    } = this.reservation;

    if (!clienteId) {
      const error = new Error("Debes iniciar sesión para hacer una reserva");
      error.statusCode = 401;
      throw error;
    }

    const requiredFields = [
      ["nombre", nombre],
      ["telefono", telefono],
      ["email", email],
      ["personas", personas],
      ["fecha", fecha],
      ["hora", hora],
      ["tipoReserva", tipoReserva],
    ];

    for (const [field, value] of requiredFields) {
      if (value === "" || value === null || value === undefined) {
        throw ReservationBuilder.badRequest(`${field} es obligatorio`);
      }
    }

    if (!Number.isInteger(personas) || personas <= 0) {
      throw ReservationBuilder.badRequest("personas debe ser un número entero positivo");
    }

    return {
      clienteId,
      nombre,
      telefono,
      email,
      personas,
      fecha,
      hora,
      tipoReserva,
    };
  }
}