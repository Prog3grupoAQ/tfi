import { InformesDatabase } from "../database/informes.database.js";
import { generarPdfDesdeTemplate } from "../utils/generar_pdf.js";

export class InformesService {
  constructor() {
    this.informesDb = new InformesDatabase();
  }

  reportePorObrasSociales = async () => {
    const datos = await this.informesDb.porObrasSociales();
    const buffer = await generarPdfDesdeTemplate("obras_sociales_turnos_mes_anterior.hbs", {
      titulo: "Informe de turnos por obra social - mes anterior",
      fecha: new Date().toLocaleString("es-AR"),
      columnas: ["obra_social", "cantidad_turnos"],
      filas: datos,
      leyenda: "Cantidad de turnos atendidos en el mes anterior por obra social"
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
      titulo: "Informe de turnos por especialidad - mes anterior",
      fecha: new Date().toLocaleString("es-AR"),
      columnas: ["especialidad", "cantidad_turnos"],
      filas: datos,
      leyenda: "Cantidad de turnos atendidos en el mes anterior por especialidad"
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
