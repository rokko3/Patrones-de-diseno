import { CumpleanosReservationBuilder } from "./CumpleanosReservationBuilder.js";
import { NegociosReservationBuilder } from "./NegociosReservationBuilder.js";
import { FiestaReservationBuilder } from "./FiestaReservationBuilder.js";
import { ReunionFamiliarReservationBuilder } from "./ReunionFamiliarReservationBuilder.js";

export class ReservationDirector {
  getBuilder(tipoReserva) {
    const tipo = String(tipoReserva).toLowerCase().trim();

    if (tipo === "cumpleaños" || tipo === "cumpleanos") {
      return new CumpleanosReservationBuilder();
    }

    if (tipo === "negocios") {
      return new NegociosReservationBuilder();
    }

    if (tipo === "fiesta") {
      return new FiestaReservationBuilder();
    }

    if (tipo === "reunion familiar") {
      return new ReunionFamiliarReservationBuilder();
    }

    throw new Error("Tipo de reserva no válido");
  }

  construct(data) {
    const builder = this.getBuilder(data.tipoReserva);
    return builder
      .setBaseData(data)
      .buildSpecificDetail(data)
      .build();
  }
}