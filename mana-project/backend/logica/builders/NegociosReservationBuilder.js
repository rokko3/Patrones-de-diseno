import { BaseReservationBuilder } from "./BaseReservationBuilder.js";

export class NegociosReservationBuilder extends BaseReservationBuilder {
  buildSpecificDetail(data) {
    this.product.detalle.empresa = data.empresa ?? null;
    this.product.detalle.requiereProyector = data.requiereProyector ?? 0;
    this.product.detalle.requiereWifi = data.requiereWifi ?? 0;
    this.product.detalle.zonaPrivada = data.zonaPrivada ?? 0;
    return this;
  }
}