# 🚀 Guide de Démarrage Rapide - TODO App

## ⚡ Démarrage en 30 secondes

### Option 1 : Docker (Recommandé)
```bash
# Démarrer l'application complète
docker compose up --build -d

# Initialiser la base de données (première fois seulement)
docker compose exec todo-service cp .env.docker .env
docker compose exec todo-service npx prisma db push
docker compose exec todo-service npm run db:seed

# ✅ Application prête !
```

### Option 2 : Local (Développement)
```bash
# Terminal 1 - Service TODO
cd todo-service
cp .env.local .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev

# Terminal 2 - API Gateway
cd ../api-gateway
npm install
npm run dev

# ✅ Application prête !
```

## 🌐 URLs d'accès

- **🏠 Accueil** : http://localhost:3002/
- **📚 Documentation Swagger** : http://localhost:3002/api-docs
- **🔗 API REST** : http://localhost:3002/api/todos
- **💚 Health Check** : http://localhost:3002/health

## 🧪 Tests rapides

### Via PowerShell
```powershell
# Lister tous les TODOs
Invoke-RestMethod -Uri "http://localhost:3002/api/todos" -Method GET

# Créer un nouveau TODO
$body = @{
    title = "Ma nouvelle tâche"
    description = "Description de la tâche"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/todos" -Method POST -Body $body -ContentType "application/json"

# Marquer comme terminé (remplacer {id} par un vrai ID)
Invoke-RestMethod -Uri "http://localhost:3002/api/todos/{id}/toggle" -Method PATCH
```

### Via Swagger UI
1. Ouvrir http://localhost:3002/api-docs
2. Cliquer sur un endpoint pour l'ouvrir
3. Cliquer sur "Try it out"
4. Remplir les paramètres et cliquer "Execute"

## 🛠️ Commandes utiles

### Docker
```bash
# Voir les logs en temps réel
docker compose logs -f

# Redémarrer un service
docker compose restart todo-service

# Arrêter l'application
docker compose down

# Nettoyer complètement (⚠️ perte de données)
docker compose down -v
```

### Base de données
```bash
# Interface graphique Prisma Studio
docker compose exec todo-service npx prisma studio
# Puis ouvrir http://localhost:5555

# Réinitialiser les données
docker compose exec todo-service npm run db:seed

# Voir le contenu de la base (si sqlite3 installé)
docker compose exec todo-service sqlite3 /app/data/todos.db "SELECT * FROM todos;"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│  TODO Service   │
│   (Port 3002)   │    │   (Port 3001)   │
│                 │    │                 │
│ • Swagger Docs  │    │ • SQLite DB     │
│ • Proxy REST    │    │ • Prisma ORM    │
│ • CORS/Security │    │ • CRUD Logic    │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   SQLite File   │
                       │ /app/data/todos │
                       │                 │
                       │ • 10 TODOs      │
                       │ • Portable      │
                       │ • Fast Access   │
                       └─────────────────┘
```

## 📋 Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/todos` | Lister tous les TODOs |
| POST | `/api/todos` | Créer un nouveau TODO |
| GET | `/api/todos/{id}` | Récupérer un TODO par ID |
| PUT | `/api/todos/{id}` | Mettre à jour un TODO |
| DELETE | `/api/todos/{id}` | Supprimer un TODO |
| PATCH | `/api/todos/{id}/toggle` | Basculer le statut completed |
| GET | `/health` | Health check de l'API Gateway |

## 🔧 Dépannage

### Problème : Port déjà utilisé
```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Tuer le processus (remplacer PID par le vrai numéro)
taskkill /PID {PID} /F
```

### Problème : Base de données corrompue
```bash
# Supprimer et recréer la base
docker compose down -v
docker compose up -d
docker compose exec todo-service cp .env.docker .env
docker compose exec todo-service npx prisma db push
docker compose exec todo-service npm run db:seed
```

### Problème : Variables d'environnement
```bash
# Vérifier les variables dans le conteneur
docker compose exec todo-service printenv | grep DATABASE

# Copier le bon fichier .env
docker compose exec todo-service cp .env.docker .env
docker compose restart todo-service
```

## 🎯 Prochaines étapes

1. **Interface utilisateur** : Créer un frontend React/Vue
2. **Tests automatisés** : Ajouter Jest/Mocha
3. **CI/CD** : Pipeline GitHub Actions
4. **Déploiement** : Heroku/Vercel/Railway
5. **Authentification** : JWT + utilisateurs
6. **Notifications** : WebSockets temps réel

## 📚 Documentation complète

- **SQLITE_CONFIGURATION.md** - Configuration SQLite détaillée
- **SWAGGER_DOCUMENTATION.md** - Guide Swagger complet
- **DOCKER_NO_REDIS.md** - Architecture sans Redis
- **Swagger UI** - http://localhost:3002/api-docs

---

**🎉 Félicitations ! Ton application TODO est opérationnelle avec une architecture microservices moderne et simplifiée !**
