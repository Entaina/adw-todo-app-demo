---
description: Planifica la resolución de un chore generando un plan detallado en plans/*.md
allowed-tools:
  - Skill
  - Read
  - Glob
  - Grep
  - Write
  - Bash
  - Task
---

# Planificación de Chore

Crea un nuevo plan en DIRECTORIO_PLANES para resolver el `Chore` usando exactamente el formato markdown `Formato del Plan`. Sigue las `Instrucciones` y el `Workflow` para crear el plan.

## Variables

DIRECTORIO_PLANES: plans/ - Directorio donde se guardan los planes
CHORE: $ARGUMENTS - Descripción del chore a completar
RUTA_PLAN: Ruta completa del fichero del plan creado en DIRECTORIO_PLANES

## Instrucciones

- Estás escribiendo un plan para resolver un chore. Debe ser sencillo pero exhaustivo y preciso para que no se nos escape nada ni perdamos tiempo con una segunda ronda de cambios.
- Usa tu modelo de razonamiento: THINK HARD sobre el plan y los pasos para completar CHORE.
- IMPORTANTE: Reemplaza cada <placeholder> en el `Formato del Plan` con el valor solicitado. Añade todo el detalle necesario para completar CHORE.

## Workflow

### Paso 1: Preparar contexto
- Ejecuta el comando `/prime` para entender la estructura y contexto del codebase.
- Ejecuta el comando `/env:setup` para preparar el entorno de desarrollo.
- Si DIRECTORIO_PLANES no existe, créalo antes de escribir el plan.

### Paso 2: Investigar
- Investiga el codebase y elabora un plan para completar CHORE.

### Paso 3: Crear el plan
- Crea el plan en DIRECTORIO_PLANES. Usa kebab-case descriptivo para el nombre del fichero (ej: `DIRECTORIO_PLANES/actualizar-dependencias-frontend.md`).
- Usa el `Formato del Plan` de abajo para crear el plan.

## Formato del Plan

```md
# Chore: <nombre del chore>

## Descripción del Chore
<describe el chore en detalle>

## Archivos Relevantes
Usa estos ficheros para resolver el chore:

<encuentra y lista los ficheros relevantes para el chore y describe por qué son relevantes en viñetas. Si hay ficheros nuevos que necesitan crearse para completar el chore, lístalos en una sección h3 'Ficheros Nuevos'.>

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

<lista las tareas paso a paso como encabezados h3 más viñetas. Usa tantos encabezados h3 como sea necesario para completar el chore. El orden importa, empieza con los cambios fundamentales compartidos necesarios y luego pasa a los cambios específicos. Tu último paso debe ser ejecutar los `Comandos de Validación` para validar que el chore está completo sin regresiones.>

## Comandos de Validación
Ejecuta cada comando para validar que el chore está completo sin regresiones.

<lista los comandos que usarás para validar con 100% de confianza que el chore está completo sin regresiones. Cada comando debe ejecutarse sin errores, así que sé específico sobre lo que quieres ejecutar. No valides con comandos curl.>
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el chore está completo sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el chore está completo sin regresiones

## Notas
<opcionalmente lista notas adicionales o contexto relevante para el chore que sean útiles para el desarrollador>
```

## Reporte

Al finalizar, muestra al usuario:
- La ruta del plan creado: RUTA_PLAN
- Sugiere ejecutar `/implement RUTA_PLAN` para implementar el plan.
