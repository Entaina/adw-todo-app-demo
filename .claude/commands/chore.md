---
description: Planifica la resolucion de un chore generando un plan detallado en plans/*.md
---

# Planificacion de Chore

Crea un nuevo plan en DIRECTORIO_PLANES para resolver el `Chore` usando exactamente el formato markdown `Formato del Plan`. Sigue las `Instrucciones` para crear el plan y usa los `Archivos Relevantes` para centrarte en los ficheros correctos.

## Variables

DIRECTORIO_PLANES: plans/ - Directorio donde se guardan los planes
CHORE: $ARGUMENTS - Descripcion del chore a completar

## Instrucciones

- Estas escribiendo un plan para resolver un chore. Debe ser sencillo pero exhaustivo y preciso para que no se nos escape nada ni perdamos tiempo con una segunda ronda de cambios.
- Crea el plan en DIRECTORIO_PLANES. Usa kebab-case descriptivo para el nombre del fichero (ej: `plans/actualizar-dependencias-frontend.md`).
- Usa el formato de plan de abajo para crear el plan.
- Investiga el codebase y elabora un plan para completar CHORE.
- IMPORTANTE: Reemplaza cada <placeholder> en el `Formato del Plan` con el valor solicitado. Anade todo el detalle necesario para completar CHORE.
- Usa tu modelo de razonamiento: PIENSA A FONDO sobre el plan y los pasos para completar CHORE.
- Respeta los ficheros solicitados en la seccion `Archivos Relevantes`.
- Si DIRECTORIO_PLANES no existe, crealo antes de escribir el plan.
- Comienza tu investigacion leyendo el fichero `README.md`.

## Archivos Relevantes

Centrate en los siguientes ficheros:
- `README.md` - Contiene la descripcion general del proyecto e instrucciones.
- `backend/**` - Contiene el codebase de la API Rails.
- `frontend/**` - Contiene el codebase del frontend React.
- `docker-compose.yml` - Contiene la configuracion de los servicios Docker.

Ignora todos los demas ficheros del codebase.

## Formato del Plan

```md
# Chore: <nombre del chore>

## Descripcion del Chore
<describe el chore en detalle>

## Archivos Relevantes
Usa estos ficheros para resolver el chore:

<encuentra y lista los ficheros relevantes para el chore y describe por que son relevantes en viñetas. Si hay ficheros nuevos que necesitan crearse para completar el chore, listalos en una seccion h3 'Ficheros Nuevos'.>

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

<lista las tareas paso a paso como encabezados h3 mas viñetas. Usa tantos encabezados h3 como sea necesario para completar el chore. El orden importa, empieza con los cambios fundamentales compartidos necesarios y luego pasa a los cambios especificos. Tu ultimo paso debe ser ejecutar los `Comandos de Validacion` para validar que el chore esta completo sin regresiones.>

## Comandos de Validacion
Ejecuta cada comando para validar que el chore esta completo sin regresiones.

<lista los comandos que usaras para validar con 100% de confianza que el chore esta completo sin regresiones. Cada comando debe ejecutarse sin errores, asi que se especifico sobre lo que quieres ejecutar. No valides con comandos curl.>
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el chore esta completo sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el chore esta completo sin regresiones

## Notas
<opcionalmente lista notas adicionales o contexto relevante para el chore que sean utiles para el desarrollador>
```

## Chore
$ARGUMENTS
