---
description: Planifica la implementacion de una nueva funcionalidad generando un plan detallado en plans/*.md
---

# Planificacion de Feature

Crea un nuevo plan en DIRECTORIO_PLANES para implementar el `Feature` usando exactamente el formato markdown `Formato del Plan`. Sigue las `Instrucciones` para crear el plan y usa los `Archivos Relevantes` para centrarte en los ficheros correctos.

## Variables

DIRECTORIO_PLANES: plans/ - Directorio donde se guardan los planes
FEATURE: $ARGUMENTS - Descripcion de la funcionalidad a implementar

## Instrucciones

- Estas escribiendo un plan para implementar una nueva funcionalidad que aportara valor a la aplicacion.
- Crea el plan en DIRECTORIO_PLANES. Usa kebab-case descriptivo para el nombre del fichero (ej: `plans/filtro-todos-por-estado.md`).
- Usa el `Formato del Plan` de abajo para crear el plan.
- Investiga el codebase para entender los patrones existentes, la arquitectura y las convenciones antes de planificar FEATURE.
- IMPORTANTE: Reemplaza cada <placeholder> en el `Formato del Plan` con el valor solicitado. Anade todo el detalle necesario para implementar FEATURE con exito.
- Usa tu modelo de razonamiento: PIENSA A FONDO sobre los requisitos de FEATURE, el diseño y el enfoque de implementacion.
- Sigue los patrones y convenciones existentes en el codebase. No reinventes la rueda.
- Diseña para extensibilidad y mantenibilidad.
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
# Feature: <nombre de la funcionalidad>

## Descripcion de la Funcionalidad
<describe la funcionalidad en detalle, incluyendo su proposito y valor para los usuarios>

## Historia de Usuario
Como <tipo de usuario>
Quiero <accion/objetivo>
Para que <beneficio/valor>

## Planteamiento del Problema
<define claramente el problema especifico u oportunidad que aborda esta funcionalidad>

## Propuesta de Solucion
<describe el enfoque de solucion propuesto y como resuelve el problema>

## Archivos Relevantes
Usa estos ficheros para implementar la funcionalidad:

<encuentra y lista los ficheros relevantes para la funcionalidad y describe por que son relevantes en viñetas. Si hay ficheros nuevos que necesitan crearse para implementar la funcionalidad, listalos en una seccion h3 'Ficheros Nuevos'.>

## Plan de Implementacion
### Fase 1: Fundamentos
<describe el trabajo fundacional necesario antes de implementar la funcionalidad principal>

### Fase 2: Implementacion Principal
<describe el trabajo principal de implementacion de la funcionalidad>

### Fase 3: Integracion
<describe como la funcionalidad se integrara con la funcionalidad existente>

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

<lista las tareas paso a paso como encabezados h3 mas viñetas. Usa tantos encabezados h3 como sea necesario para implementar la funcionalidad. El orden importa, empieza con los cambios fundamentales compartidos y luego pasa a la implementacion especifica. Incluye la creacion de tests a lo largo del proceso de implementacion. Tu ultimo paso debe ser ejecutar los `Comandos de Validacion` para validar que la funcionalidad funciona correctamente sin regresiones.>

## Estrategia de Testing
### Tests Unitarios
<describe los tests unitarios necesarios para la funcionalidad>

### Tests de Integracion
<describe los tests de integracion necesarios para la funcionalidad>

### Casos Limite
<lista los casos limite que necesitan ser probados>

## Criterios de Aceptacion
<lista criterios especificos y medibles que deben cumplirse para que la funcionalidad se considere completa>

## Comandos de Validacion
Ejecuta cada comando para validar que la funcionalidad funciona correctamente sin regresiones.

<lista los comandos que usaras para validar con 100% de confianza que la funcionalidad esta implementada correctamente sin regresiones. Cada comando debe ejecutarse sin errores, asi que se especifico sobre lo que quieres ejecutar. Incluye comandos para probar la funcionalidad de extremo a extremo.>
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que la funcionalidad funciona sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que la funcionalidad funciona sin regresiones

## Notas
<opcionalmente lista notas adicionales, consideraciones futuras o contexto relevante para la funcionalidad que sean utiles para el desarrollador>
```

## Feature
$ARGUMENTS
