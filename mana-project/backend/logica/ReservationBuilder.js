export class ReservationBuilder {
  constructor() {
    this.reservation = {
      clienteId: null,
      nombre: "",
      telefono: "",
      email: "",
      personas: 1,
      fecha: "",
      hora: "",
      tipoReserva: "",
    };
  }

  setClienteId(value) {
    this.reservation.clienteId = value;
    return this;
  }

  setNombre(value) {
    this.reservation.nombre = value;
    return this;
  }

  setTelefono(value) {
    this.reservation.telefono = value;
    return this;
  }

  setEmail(value) {
    this.reservation.email = value;
    return this;
  }

  setPersonas(value) {
    this.reservation.personas = value;
    return this;
  }

  setFecha(value) {
    this.reservation.fecha = value;
    return this;
  }

  setHora(value) {
    this.reservation.hora = value;
    return this;
  }

  setTipoReserva(value) {
    this.reservation.tipoReserva = value;
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

    if (!clienteId) throw new Error("clienteId es obligatorio");
    if (!nombre) throw new Error("nombre es obligatorio");
    if (!telefono) throw new Error("telefono es obligatorio");
    if (!email) throw new Error("email es obligatorio");
    if (!personas) throw new Error("personas es obligatorio");
    if (!fecha) throw new Error("fecha es obligatoria");
    if (!hora) throw new Error("hora es obligatoria");
    if (!tipoReserva) throw new Error("tipoReserva es obligatorio");

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