---
description: Planifica la resolucion de un bug generando un plan detallado en plans/*.md
---

# Planificacion de Bug

Crea un nuevo plan en DIRECTORIO_PLANES para resolver el `Bug` usando exactamente el formato markdown `Formato del Plan`. Sigue las `Instrucciones` para crear el plan y usa los `Archivos Relevantes` para centrarte en los ficheros correctos.

## Variables

DIRECTORIO_PLANES: plans/ - Directorio donde se guardan los planes
BUG: $ARGUMENTS - Descripcion del bug a resolver

## Instrucciones

- Estas escribiendo un plan para resolver un bug. Debe ser exhaustivo y preciso para que arreglemos la causa raiz y evitemos regresiones.
- Crea el plan en DIRECTORIO_PLANES. Usa kebab-case descriptivo para el nombre del fichero (ej: `DIRECTORIO_PLANES/fix-todo-delete.md`).
- Usa el formato de plan de abajo para crear el plan.
- Investiga el codebase para entender BUG, reproducirlo y elaborar un plan para solucionarlo.
- IMPORTANTE: Reemplaza cada <placeholder> en el `Formato del Plan` con el valor solicitado. Anade todo el detalle necesario para corregir BUG.
- Usa tu modelo de razonamiento: THINK HARD sobre BUG, su causa raiz y los pasos para solucionarlo correctamente.
- IMPORTANTE: Se quirurgico con la correccion del bug, resuelve el bug en cuestion y no te desvies.
- IMPORTANTE: Queremos el minimo numero de cambios que corrijan y resuelvan el bug.
- No uses decoradores. Mantenlo simple.
- Si necesitas una nueva gema Ruby, usa `bundle add` y asegurate de reportarlo en la seccion `Notas` del `Formato del Plan`.
- Si necesitas un nuevo paquete npm, usa `npm install` en el directorio frontend y asegurate de reportarlo en la seccion `Notas` del `Formato del Plan`.
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
# Bug: <nombre del bug>

## Descripcion del Bug
<describe el bug en detalle, incluyendo sintomas y comportamiento esperado vs actual>

## Planteamiento del Problema
<define claramente el problema especifico que necesita ser resuelto>

## Propuesta de Solucion
<describe el enfoque de solucion propuesto para corregir el bug>

## Pasos para Reproducir
<lista los pasos exactos para reproducir el bug>

## Analisis de Causa Raiz
<analiza y explica la causa raiz del bug>

## Archivos Relevantes
Usa estos ficheros para corregir el bug:

<encuentra y lista los ficheros relevantes para el bug y describe por que son relevantes en viñetas. Si hay ficheros nuevos que necesitan crearse para corregir el bug, listalos en una seccion h3 'Ficheros Nuevos'.>

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

<lista las tareas paso a paso como encabezados h3 mas viñetas. Usa tantos encabezados h3 como sea necesario para corregir el bug. El orden importa, empieza con los cambios fundamentales compartidos necesarios para corregir el bug y luego pasa a los cambios especificos. Incluye tests que validen que el bug esta corregido con cero regresiones. Tu ultimo paso debe ser ejecutar los `Comandos de Validacion` para validar que el bug esta corregido sin regresiones.>

## Comandos de Validacion
Ejecuta cada comando para validar que el bug esta corregido sin regresiones.

<lista los comandos que usaras para validar con 100% de confianza que el bug esta corregido sin regresiones. Cada comando debe ejecutarse sin errores, asi que se especifico sobre lo que quieres ejecutar. Incluye comandos para reproducir el bug antes y despues de la correccion.>
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el bug esta corregido sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el bug esta corregido sin regresiones

## Notas
<opcionalmente lista notas adicionales o contexto relevante para el bug que sean utiles para el desarrollador>
```

## Bug
$ARGUMENTS
