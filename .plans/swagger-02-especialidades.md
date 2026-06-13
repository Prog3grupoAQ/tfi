# Commit 2 — Swagger: Especialidades

## Context
Documentar el módulo de especialidades. Todos los endpoints requieren JWT Bearer. Las operaciones de escritura son exclusivas del rol 3 (admin).

## Archivos a modificar
- `src/routes/v1/especialidades.routes.js`

## Endpoints a documentar

| Método | Path | Roles | Notas |
|--------|------|-------|-------|
| GET | `/especialidades` | 1,2,3 | query: `inactivos` (boolean, opcional) |
| GET | `/especialidades/{id}` | 1,2,3 | path param: id (integer) |
| POST | `/especialidades` | 3 | body: `{nombre}` (string, 3-120 chars) |
| PUT | `/especialidades/{id}` | 3 | body: `{nombre, activo}` |
| DELETE | `/especialidades/{id}` | 3 | soft delete |
| PATCH | `/especialidades/{id}` | 3 | restaurar (soft delete restore) |

## Schema a reusar
`$ref: '#/components/schemas/Especialidad'` (definido en commit 1)

## Patrón JSDoc
```js
/**
 * @swagger
 * /especialidades:
 *   get:
 *     tags: [Especialidades]
 *     summary: Listar todas las especialidades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: inactivos
 *         schema: { type: boolean }
 *         description: Incluir especialidades inactivas
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Especialidad'
 */
```

## Verificación
Abrir `/api/v1/docs` y confirmar que el tag "Especialidades" aparece con los 6 endpoints.
