import { BaseReservationBuilder } from "./BaseReservationBuilder.js";

export class FiestaReservationBuilder extends BaseReservationBuilder {
  buildSpecificDetail(data) {
    this.product.detalle.musica = data.musica ?? null;
    this.product.detalle.decoracion = data.decoracion ?? null;
    this.product.detalle.zonaPrivada = data.zonaPrivada ?? 0;
    return this;
  }
}