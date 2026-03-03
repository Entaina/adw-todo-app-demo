---
description: Corrige problemas encontrados durante la revision de codigo
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Edit
  - Write
---

# Resolver Problemas de Revision

Corrige los problemas encontrados durante la revision de codigo.

## Instrucciones

1. **Analizar los Problemas**
   - Revisa las sugerencias de correccion proporcionadas en los `Datos de Revision`
   - Entiende que necesita ser corregido y por que

2. **Descubrimiento de Contexto**
   - Comprueba los cambios recientes: `git diff origin/main --stat --name-only`
   - Centrate solo en los ficheros afectados por los problemas reportados

3. **Corregir los Problemas**
   - Haz cambios minimos y dirigidos para resolver los problemas reportados
   - No modifiques codigo ni ficheros no relacionados
   - Asegurate de que las correcciones no rompen funcionalidad existente

4. **Validar las Correcciones**
   - Verifica que los cambios resuelven los problemas reportados
   - Ejecuta los tests relevantes si los problemas podrian afectar funcionalidad

## Datos de Revision

$ARGUMENTS

## Reporte

Proporciona un resumen conciso de:
- Problemas identificados
- Correcciones aplicadas
- Confirmacion de que los problemas estan resueltos
