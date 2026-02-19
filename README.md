# Todo List App - Rails API + React

A sample todo list application built with a **Ruby on Rails** API backend and a **React** frontend. Designed as a hands-on project for practicing agentic development workflows.

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Backend  | Ruby on Rails 8.1 (API mode) |
| Frontend | React 18 + Vite 6            |
| Database | SQLite3                       |
| Testing  | Minitest (backend), Vitest + React Testing Library (frontend) |

## Project Structure

```
├── backend/          # Rails API (port 3000)
├── frontend/         # React + Vite app (port 5173)
├── features/         # Feature planning & documentation
└── run-tasks.sh      # Task automation script
```

## Prerequisites

- Ruby 3.3.1
- Node.js 18+
- Bundler

## Getting Started

### Backend

```bash
docker compose up -d
cd backend
bin/setup
```

The API will be available at `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/tasks`       | List all tasks       |
| POST   | `/api/tasks`       | Create a task        |
| PATCH  | `/api/tasks/:id`   | Update a task        |
| DELETE | `/api/tasks/:id`   | Delete a task        |

## Running Tests

```bash
# Backend
cd backend
rails test

# Frontend
cd frontend
npm run test
```

## Data Model

**Task**

| Field       | Type     | Constraints                      |
|-------------|----------|----------------------------------|
| title       | string   | Required, max 200 characters     |
| completed   | boolean  | Default: `false`                 |
| created_at  | datetime | Auto-generated                   |
| updated_at  | datetime | Auto-generated                   |

## Seed Data

The backend includes sample tasks for development:

- Comprar leche
- Llamar al doctor
- Enviar reporte mensual
- Revisar correos pendientes
- Preparar presentacion
