# Commit 1 — Setup Swagger + Auth + Registro

## Context
Instalar swagger-jsdoc y swagger-ui-express, crear la configuración central con todos los schemas reutilizables, montar la UI en el servidor, y documentar los endpoints públicos (login, perfil, registro de médico y paciente).

## Paquetes
```
npm install swagger-jsdoc swagger-ui-express
```

## Archivos a crear/modificar

### CREAR: `src/config/swagger.js`
- `swaggerDefinition`: openapi 3.0.0, info (título "TP Final - Sistema de Turnos Médicos", version "1.0.0"), server `http://localhost:3003/api/v1`
- Security scheme: `bearerAuth` (HTTP, bearer, JWT)
- Componentes/schemas: `Especialidad`, `ObraSocial`, `Medico`, `Paciente`, `Turno`, `ErrorResponse`
- `apis`: apunta a `src/routes/v1/*.js`
- Exportar `specs = swagger-jsdoc(options)`

### MODIFICAR: `src/server.js`
Importar y montar **antes** de las rutas autenticadas:
```js
const swaggerUi = require('swagger-ui-express')
const specs = require('./config/swagger')
this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs))
```

### MODIFICAR: `src/routes/v1/auth.routes.js`
Anotar con JSDoc:
- `POST /auth/login` — body: `{email, contrasenia}`, response 200: `{estado, token}`, 401 Unauthorized
- `GET /auth/perfil` — security: bearerAuth, response 200: `{estado, usuario}`

### MODIFICAR: `src/routes/v1/registro.routes.js`
Anotar con JSDoc:
- `POST /registro/medico` — multipart/form-data; campos requeridos: documento, apellido, nombres, email, contrasenia, id_especialidad (integer), matricula (integer), valor_consulta (number); opcionales: descripcion, foto (file)
- `POST /registro/paciente` — multipart/form-data; campos requeridos: documento, apellido, nombres, email, contrasenia; opcionales: id_obra_social (integer, default 1), foto (file)

## Verificación
1. `npm install` sin errores
2. `node src/index.js` arranca sin errores
3. `GET http://localhost:3003/api/v1/docs` muestra la UI con tags Auth y Registro
4. `POST /auth/login` ejecutable desde la UI retorna token
