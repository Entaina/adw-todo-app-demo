---
description: Restart the full application (stop and start all services)
allowed-tools: Bash, Read
---

# Reiniciar la Aplicación

## Purpose

Reinicia todos los servicios de desarrollo ejecutando un ciclo completo de parada y arranque.
Delega en los comandos `/stop` y `/start`. Los argumentos se pasan al comando `/stop`.

## Variables

STOP_ARGUMENTS: `$ARGUMENTS` — se pasan íntegros al comando `/stop` (ej: `--infra`)

## Instructions

- Si la ejecución del comando `/stop` falla, detenerse e informar al usuario — no continuar
  con `/start`

## Workflow

1. Leer y ejecutar el comando `/stop` pasando STOP_ARGUMENTS
2. Leer y ejecutar el comando `/start`
