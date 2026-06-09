import { UsuariosService } from "../services/usuarios.service.js";
import { MedicosService } from "../services/medicos.service.js";
import { PacientesService } from "../services/pacientes.service.js";
import { ObrasSocialesService } from "../services/obras_sociales.service.js";

export class RegistroController {
  constructor() {
    this.usuarios = new UsuariosService();
    this.medicos = new MedicosService();
    this.pacientes = new PacientesService();
    this.obrasSociales = new ObrasSocialesService();
  }

  registrarMedico = async (req, res) => {
    try {
      const { documento, apellido, nombres, email, contrasenia,
              id_especialidad, matricula, descripcion, valor_consulta } = req.body;
      const foto_path = req.file ? `uploads/${req.file.filename}` : '';

      const resultadoUsuario = await this.usuarios.crear({
        documento, apellido, nombres, email, contrasenia, foto_path, rol: 1
      });
      if (resultadoUsuario?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un usuario con ese documento o email" });
      if (!resultadoUsuario)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el usuario" });

      const nuevoMedico = await this.medicos.crear({
        id_usuario: resultadoUsuario, id_especialidad, matricula, descripcion, valor_consulta
      });
      if (nuevoMedico?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un médico con esa matrícula" });
      if (!nuevoMedico || nuevoMedico.length === 0)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el médico" });

      return res.status(201).json({ estado: true, msg: "Médico registrado correctamente", data: nuevoMedico[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  registrarPaciente = async (req, res) => {
    try {
      const { documento, apellido, nombres, email, contrasenia, id_obra_social } = req.body;
      const foto_path = req.file ? `uploads/${req.file.filename}` : '';

      const obraSocial = await this.obrasSociales.buscarPorId(id_obra_social);
      if (!obraSocial || obraSocial.length === 0)
        return res.status(422).json({ estado: false, msg: "La obra social no existe" });

      const resultadoUsuario = await this.usuarios.crear({
        documento, apellido, nombres, email, contrasenia, foto_path, rol: 2
      });
      if (resultadoUsuario?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un usuario con ese documento o email" });
      if (!resultadoUsuario)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el usuario" });

      const nuevoPaciente = await this.pacientes.crear({ id_usuario: resultadoUsuario, id_obra_social });
      if (nuevoPaciente?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un paciente con ese usuario" });
      if (!nuevoPaciente || nuevoPaciente.length === 0)
        return res.status(500).json({ estado: false, msg: "No se pudo crear el paciente" });

      return res.status(201).json({ estado: true, msg: "Paciente registrado correctamente", data: nuevoPaciente[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
