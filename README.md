# TODO Application - Architecture Microservices

Cette application TODO utilise une architecture microservices avec :

## Architecture

- **API Gateway** (`api-gateway/`) - Point d'entrée unique pour toutes les requêtes
- **Service TODO** (`todo-service/`) - Service métier pour la gestion des tâches
- **Base de données** - PostgreSQL pour la persistance des données

## Structure du projet

```
TODO-APP/
├── api-gateway/          # API Gateway (Port 3000)
│   ├── src/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   └── server.js
├── todo-service/         # Service TODO (Port 3001)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── database/
│   ├── package.json
│   └── server.js
├── docker-compose.yml    # Configuration Docker
└── README.md
```

## Installation et démarrage

### Option 1: Avec Docker (Recommandé)
```bash
# Démarrer PostgreSQL avec Docker

# Ou manuellement :
docker run --name postgres-todo -e POSTGRES_DB=todoapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
