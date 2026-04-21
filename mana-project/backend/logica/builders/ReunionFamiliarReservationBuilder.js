import { BaseReservationBuilder } from "./BaseReservationBuilder.js";

export class ReunionFamiliarReservationBuilder extends BaseReservationBuilder {
  buildSpecificDetail(data) {
    this.product.detalle.zonaPrivada = data.zonaPrivada ?? 0;
    this.product.detalle.observaciones = data.observaciones ?? null;
    return this;
  }
}