---
description: Restart infrastructure services (PostgreSQL) with full down + up cycle, optionally deleting volumes
allowed-tools: Bash, Read
---

# Reiniciar Infraestructura

## Purpose

Reinicia los servicios de infraestructura del proyecto ejecutando un ciclo completo de parada y arranque. Delega en los comandos `/infra:down` y `/infra:up`.

## Variables

INFRA_DOWN_ARGUMENTS: Extraer de `$ARGUMENTS` los argumentos relevantes para el comando `/infra:down`
INFRA_UP_ARGUMENTS: Extraer de `$ARGUMENTS` los argumentos relevantes para el comando `/infra:up`

## Instructions

- Si la ejecución del comando `/infra:down` falla, detenerse e informar al usuario — no continuar con `/infra:up`

## Workflow

1. Leer y ejecutar el comando `/infra:down` pasando INFRA_DOWN_ARGUMENTS
2. Leer y ejecutar el comando `/infra:up` pasando INFRA_UP_ARGUMENTS
