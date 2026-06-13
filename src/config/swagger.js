import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Turnos Médicos | TFI - GRUPO AQ',
      version: '1.0.0',
      description: 'API REST para gestión de turnos médicos desarrollada como parte del Trabajo Final Integrador de la materia Programación III de la Tecnicatura en Desarrollo Web'
    },
    servers: [{ url: 'http://localhost:3003/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Especialidad: {
          type: 'object',
          properties: {
            id_especialidad: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Cardiología' },
            descripcion: { type: 'string', example: 'Especialidad del corazón' },
            activo: { type: 'boolean', example: true },
          },
        },
        ObraSocial: {
          type: 'object',
          properties: {
            id_obra_social: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'OSDE' },
            activo: { type: 'boolean', example: true },
          },
        },
        Medico: {
          type: 'object',
          properties: {
            id_medico: { type: 'integer', example: 1 },
            documento: { type: 'string', example: '30123456' },
            apellido: { type: 'string', example: 'García' },
            nombres: { type: 'string', example: 'Carlos Alberto' },
            email: { type: 'string', format: 'email', example: 'cargar@email.com' },
            matricula: { type: 'integer', example: 12345 },
            descripcion: { type: 'string', example: 'Especialista en cardiología' },
            valor_consulta: { type: 'number', format: 'float', example: 5000.00 },
            foto: { type: 'string', example: 'foto_medico.jpg' },
            activo: { type: 'boolean', example: true },
          },
        },
        Paciente: {
          type: 'object',
          properties: {
            id_paciente: { type: 'integer', example: 1 },
            documento: { type: 'string', example: '40987654' },
            apellido: { type: 'string', example: 'López' },
            nombres: { type: 'string', example: 'María Elena' },
            email: { type: 'string', format: 'email', example: 'marlop@email.com' },
            id_obra_social: { type: 'integer', example: 1 },
            foto: { type: 'string', example: 'foto_paciente.jpg' },
            activo: { type: 'boolean', example: true },
          },
        },
        Turno: {
          type: 'object',
          properties: {
            id_turno: { type: 'integer', example: 1 },
            id_medico: { type: 'integer', example: 1 },
            id_paciente: { type: 'integer', example: 1 },
            id_obra_social: { type: 'integer', example: 1 },
            fecha_hora: { type: 'string', format: 'date-time', example: '2026-06-15T10:00:00' },
            valor_total: { type: 'number', format: 'float', example: 5000.00 },
            atendido: { type: 'boolean', example: false },
            activo: { type: 'boolean', example: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            estado: { type: 'boolean', example: false },
            errores: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string', example: 'El campo es obligatorio' },
                  path: { type: 'string', example: 'email' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [join(__dirname, '../routes/v1/*.js')],
};

export const specs = swaggerJsdoc(options);
