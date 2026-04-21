import { BaseReservationBuilder } from "./BaseReservationBuilder.js";

export class CumpleanosReservationBuilder extends BaseReservationBuilder {
  buildSpecificDetail(data) {
    this.product.detalle.decoracion = data.decoracion ?? null;
    this.product.detalle.pastel = data.pastel ?? null;
    this.product.detalle.edadHomenajeado = data.edadHomenajeado ?? null;
    return this;
  }
}