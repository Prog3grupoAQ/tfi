import { RegistroService } from "../services/registro.service.js";
import { UsuariosService } from "../services/usuarios.service.js";
import { ObrasSocialesService } from "../services/obras_sociales.service.js";
import { AuditoriaService } from "../services/auditoria.service.js";

export class RegistroController {
  constructor() {
    this.registro = new RegistroService();
    this.usuarios = new UsuariosService();
    this.obrasSociales = new ObrasSocialesService();
    this.auditoria = new AuditoriaService();
  }

  registrarMedico = async (req, res) => {
    try {
      const { documento, apellido, nombres, email, contrasenia,
              id_especialidad, matricula, descripcion, valor_consulta } = req.body;
      const foto_path = req.file ? `uploads/${req.file.filename}` : '';

      const resultado = await this.registro.registrarMedico(
        { documento, apellido, nombres, email, contrasenia, foto_path },
        { id_especialidad, matricula, descripcion, valor_consulta }
      );

      if (resultado?.duplicadoUsuario)
        return res.status(409).json({ estado: false, msg: "Ya existe un usuario con ese documento o email" });
      if (resultado?.duplicadoMedico)
        return res.status(409).json({ estado: false, msg: "Ya existe un médico con esa matrícula" });
      if (!resultado || resultado.length === 0)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el médico" });

      this.auditoria.registrar({
        id_usuario: resultado[0].id_usuario,
        email,
        accion: `Se registró ${email} como médico`,
        metodo: req.method,
        endpoint: req.originalUrl,
        status_code: 201,
        ip: req.ip,
      }).catch(e => console.error("Error en auditoría:", e.message));

      return res.status(201).json({ estado: true, msg: "Médico registrado correctamente", data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  registrarPaciente = async (req, res) => {
    try {
      const { documento, apellido, nombres, email, contrasenia } = req.body;
      const id_obra_social = req.body.id_obra_social ?? 1;
      const foto_path = req.file ? `uploads/${req.file.filename}` : '';

      const obraSocial = await this.obrasSociales.buscarPorId(id_obra_social);
      if (!obraSocial || obraSocial.length === 0)
        return res.status(422).json({ estado: false, msg: "La obra social no existe" });

      const resultado = await this.registro.registrarPaciente(
        { documento, apellido, nombres, email, contrasenia, foto_path },
        { id_obra_social }
      );

      if (resultado?.duplicadoUsuario)
        return res.status(409).json({ estado: false, msg: "Ya existe un usuario con ese documento o email" });
      if (!resultado || resultado.length === 0)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el paciente" });

      this.auditoria.registrar({
        id_usuario: resultado[0].id_usuario,
        email,
        accion: `Se registró ${email} como paciente`,
        metodo: req.method,
        endpoint: req.originalUrl,
        status_code: 201,
        ip: req.ip,
      }).catch(e => console.error("Error en auditoría:", e.message));

      return res.status(201).json({ estado: true, msg: "Paciente registrado correctamente", data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  registrarAdmin = async (req, res) => {
    try {
      const { documento, apellido, nombres, email, contrasenia } = req.body;

      const resultadoUsuario = await this.usuarios.crear({
        documento, apellido, nombres, email, contrasenia, foto_path: '', rol: 3
      });
      if (resultadoUsuario?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un usuario con ese documento o email" });
      if (!resultadoUsuario)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el administrador" });

      this.auditoria.registrar({
        id_usuario: resultadoUsuario,
        email,
        accion: `Se registró ${email} como administrador`,
        metodo: req.method,
        endpoint: req.originalUrl,
        status_code: 201,
        ip: req.ip,
      }).catch(e => console.error("Error en auditoría:", e.message));

      return res.status(201).json({ estado: true, msg: "Administrador registrado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
