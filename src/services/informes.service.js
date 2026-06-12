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
      leyenda: `Cantidad de turnos atendidos en el mes de ${this.mesAnterior} por obra social`
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
      leyenda: `Cantidad de turnos atendidos en el mes de ${this.mesAnterior} por especialidad`
    });

    return {
      buffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=especialidades_turnos_mes_anterior.pdf"
      }
    };
  };

  #formatearFecha = (valor) => {
    const d = new Date(valor);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  reporteTurnosMedico = async (idMedico, mes, anio) => {
    const medico = await this.informesDb.datosMedico(idMedico);
    if (!medico) return null;

    const datos = await this.informesDb.turnosCompletadosPorMedico(idMedico, mes, anio);
    const nombreMes = this.meses[mes - 1];
    const periodo = `${nombreMes} ${anio}`;
    const totalTurnos = datos.length;
    const totalMonto = datos.reduce((acc, r) => acc + parseFloat(r.valor_total), 0).toFixed(2);
    const filas = datos.map(r => ({ ...r, fecha_hora: this.#formatearFecha(r.fecha_hora) }));

    const buffer = await generarPdfDesdeTemplate("turnos_medico_por_mes.hbs", {
      titulo: "Informe de turnos por médico",
      fecha: periodo,
      medico,
      filas,
      totalTurnos,
      totalMonto
    });

    return {
      buffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=turnos_medico_${idMedico}_${mes}_${anio}.pdf`
      }
    };
  };

  reporteTurnosCompletados = async (mes, anio) => {
    const datos = await this.informesDb.turnosCompletadosPorMes(mes, anio);
    const nombreMes = this.meses[mes - 1];
    const periodo = `${nombreMes} ${anio}`;
    const totalTurnos = datos.length;
    const totalMonto = datos.reduce((acc, r) => acc + parseFloat(r.valor_total), 0).toFixed(2);
    const filas = datos.map(r => ({ ...r, fecha_hora: this.#formatearFecha(r.fecha_hora) }));

    const buffer = await generarPdfDesdeTemplate("turnos_completados_por_mes.hbs", {
      titulo: "Informe de turnos completados",
      fecha: periodo,
      filas,
      leyenda: `Turnos atendidos`,
      totalTurnos,
      totalMonto
    });

    return {
      buffer,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=turnos_completados_${mes}_${anio}.pdf`
      }
    };
  };
}
