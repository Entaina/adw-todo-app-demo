# Tarea 004: Database Seeds con Datos de Ejemplo

## Metadata
task_id: `004`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RF-11, RNF-05`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| db/seeds.rb | Modificación | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 002
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** facilitador del curso
**Quiero** seeds reproducibles que carguen 5 tareas de ejemplo
**Para** tener datos consistentes en demos y permitir que estudiantes reinicien su entorno fácilmente

## Criterios de Aceptación
- [ ] El archivo `db/seeds.rb` crea exactamente 5 tareas predefinidas
- [ ] Las tareas tienen mix de estados (algunas completadas, otras no)
- [ ] Los seeds son idempotentes (se pueden ejecutar múltiples veces sin duplicar)
- [ ] El comando `rails db:seed` ejecuta exitosamente
- [ ] Después de `rails db:reset && rails db:seed` hay exactamente 5 tareas en la base de datos

## Escenarios

### Escenario 1: Ejecutar seeds en base vacía
- **Dado** que tengo una base de datos migrada pero vacía
- **Cuando** ejecuto `rails db:seed`
- **Entonces** se crean 5 tareas con títulos y estados predefinidos

### Escenario 2: Seeds idempotentes
- **Dado** que ya ejecuté `rails db:seed` una vez
- **Cuando** ejecuto `rails db:seed` nuevamente
- **Entonces** no se duplican las tareas (sigue habiendo solo 5)

### Escenario 3: Reset completo
- **Dado** que la base tiene datos modificados
- **Cuando** ejecuto `rails db:reset`
- **Entonces** la base se reconstruye con las 5 tareas originales

## Notas
Los seeds deben ser reproducibles para que facilitadores puedan hacer demos consistentes y estudiantes puedan reiniciar su ambiente. Las 5 tareas de ejemplo deben tener títulos representativos ("Comprar leche", "Llamar al doctor", etc.) y algunas deben estar marcadas como completadas para tener variedad visual.
