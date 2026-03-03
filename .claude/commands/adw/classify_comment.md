---
description: Clasifica un comentario de issue como patch o none
allowed-tools: []
---

# Clasificar Comentario

Analiza el COMENTARIO y responde si requiere un patch (cambio en el codigo) o no.

## Variables

COMENTARIO: $ARGUMENTS - Texto del comentario a clasificar

## Instrucciones

- Analiza el contenido de COMENTARIO para determinar si solicita un cambio en el codigo.
- Criterios de clasificacion:
  - `patch`: El comentario solicita explicitamente un cambio, correccion, mejora, fix, ajuste o modificacion en el codigo o comportamiento de la aplicacion.
  - `none`: El comentario es una pregunta, agradecimiento, aprobacion, informacion general, o no solicita ningun cambio concreto en el codigo.
- Ejemplos de `patch`:
  - "Cambia el color del boton a rojo"
  - "El formulario deberia validar el email"
  - "Falta el manejo de errores cuando el servidor no responde"
  - "La tabla no se ordena correctamente por fecha"
- Ejemplos de `none`:
  - "Gracias, buen trabajo!"
  - "Como funciona el endpoint de login?"
  - "LGTM"
  - "Voy a revisar esto manana"
  - "adw"
- Responde EXCLUSIVAMENTE con uno de estos valores exactos: `patch`, `none`.
- NO incluyas explicaciones, razonamiento ni texto adicional.
- No incluyas los backticks en la respuesta.

## Reporte

Responde con un unico valor: `patch` o `none`.
