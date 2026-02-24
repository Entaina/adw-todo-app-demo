---
description: Clasifica una issue como /chore, /bug, /feature o none
allowed-tools: []
---

# Clasificar Issue

Analiza la ISSUE y responde con el comando correspondiente a su tipo.

## Variables

ISSUE: $ARGUMENTS - JSON de la issue a clasificar

## Instrucciones

- Analiza el titulo, cuerpo y etiquetas de ISSUE para determinar su tipo.
- Criterios de clasificacion:
  - `/bug`: La issue describe un comportamiento incorrecto, un error, un fallo o algo que no funciona como se espera.
  - `/feature`: La issue solicita nueva funcionalidad, una mejora de UX o una capacidad que no existe actualmente.
  - `/chore`: La issue describe trabajo tecnico sin impacto funcional visible: refactoring, actualizacion de dependencias, configuracion, CI/CD, documentacion.
  - `none`: La issue no encaja en ninguna categoria anterior, o no es accionable.
- Responde EXCLUSIVAMENTE con uno de estos valores exactos: `/bug`, `/feature`, `/chore`, `none`.
- NO incluyas explicaciones, razonamiento ni texto adicional.
- No incluyas los backticks en la respuesta.

## Reporte

Responde con un unico valor: `/bug`, `/feature`, `/chore` o `none`.
