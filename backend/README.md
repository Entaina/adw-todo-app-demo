# Todo List API - Backend

Backend Rails API para la aplicación Todo List.

## Prerrequisitos
- Ruby 3.2 o superior
- Bundler

## Instalación

```bash
# Instalar dependencias
bundle install

# Crear base de datos
rails db:create
rails db:migrate
```

## Desarrollo

```bash
# Arrancar servidor de desarrollo (puerto 3000)
rails server

# Ejecutar tests
rails test
```

## API Endpoints

Los endpoints estarán disponibles en `http://localhost:3000/api/`

(Los recursos específicos se añadirán en tareas posteriores)

## Configuración CORS

El backend está configurado para permitir requests desde:
- http://localhost:5173 (frontend React con Vite)
