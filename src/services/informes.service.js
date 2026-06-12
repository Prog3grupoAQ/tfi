import { InformesDatabase } from "../database/informes.database.js";
import { generarPdfDesdeTemplate } from "../utils/generar_pdf.js";

export class InformesService {
  constructor() {
    this.informesDb = new InformesDatabase();
    this.meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    this.mesAnterior = this.meses[new Date().getMonth() - 1] + " " + new Date().getFullYear()
  }

  reportePorObrasSociales = async () => {
    const datos = await this.informesDb.porObrasSociales();
    const buffer = await generarPdfDesdeTemplate("obras_sociales_turnos_mes_anterior.hbs", {
      titulo: "Informe de turnos por obra social",
      fecha: this.mesAnterior,
      columnas: ["obra_social", "cantidad_turnos"],
      filas: datos,
      leyenda: "Cantidad de turnos atendidos en el mes de " + this.mesAnterior + " por obra social"
    });

    return {
      buffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=obras_sociales_turnos_mes_anterior.pdf"
      }
    };
  };

  reportePorEspecialidades = async () => {
    const datos = await this.informesDb.porEspecialidades();
    const buffer = await generarPdfDesdeTemplate("especialidades_turnos_mes_anterior.hbs", {
      titulo: "Informe de turnos por especialidad",
      fecha: this.mesAnterior,
      columnas: ["especialidad", "cantidad_turnos"],
      filas: datos,
      leyenda: 'Cantidad de turnos atendidos en el mes de ' + this.mesAnterior + ' por especialidad'
    });

    return {
      buffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=especialidades_turnos_mes_anterior.pdf"
      }
    };
  };
}
