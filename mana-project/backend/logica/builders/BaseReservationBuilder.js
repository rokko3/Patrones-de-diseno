import { ReservationProduct } from "./ReservationProduct.js";

export class BaseReservationBuilder {
  constructor() {
    this.product = new ReservationProduct();
  }

  setBaseData(data) {
    this.product.reserva.clienteId = data.clienteId;
    this.product.reserva.nombre = data.nombre;
    this.product.reserva.telefono = data.telefono;
    this.product.reserva.email = data.email;
    this.product.reserva.personas = data.personas;
    this.product.reserva.fecha = data.fecha;
    this.product.reserva.hora = data.hora;
    this.product.reserva.tipoReserva = data.tipoReserva;

    this.product.detalle.tipoReserva = data.tipoReserva;
    this.product.detalle.observaciones = data.observaciones ?? null;
    return this;
  }

  buildCommonDetail() {
    return this;
  }

  build() {
    return this.product;
  }
}