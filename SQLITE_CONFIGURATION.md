# Configuration SQLite - TODO App

## 🎯 Architecture simplifiée avec SQLite

Cette configuration utilise **SQLite** comme base de données unique, éliminant le besoin de PostgreSQL et Redis.

### ✅ Avantages de SQLite
- **Simplicité maximale** : Un seul fichier de base de données
- **Pas de serveur** : Base de données embarquée
- **Démarrage instantané** : Pas d'attente de services externes
- **Portabilité** : Fichier .db facilement sauvegardable
- **Performance** : Excellente pour les applications de taille petite à moyenne

## 🏗️ Architecture actuelle

### Services Docker
- **todo-service** (port 3001) : Service métier avec SQLite
- **api-gateway** (port 3002) : Point d'entrée avec documentation Swagger

### ❌ Services supprimés
- ~~PostgreSQL~~ : Remplacé par SQLite
- ~~Redis~~ : Cache supprimé (requêtes directes)

## 🔧 Configuration

### Base de données SQLite
```
DATABASE_URL=file:./data/todos.db
```

### Schéma Prisma adapté
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("todos")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 🚀 Démarrage

### Docker (recommandé)
```bash
# Construire et démarrer
docker compose up --build -d

# Vérifier les services
docker compose ps

# Voir les logs
docker compose logs -f todo-service
```

### Local (développement)
```bash
# Terminal 1 - Service TODO
cd todo-service
cp .env.local .env
npm install
npx prisma generate
npx prisma db push
npm run dev

# Terminal 2 - API Gateway
cd ../api-gateway
npm install
npm run dev
```

## 📊 Gestion de la base de données

### Initialisation
```bash
# Appliquer le schéma Prisma
docker compose exec todo-service npx prisma db push

# Injecter des données de test
docker compose exec todo-service npm run db:seed

# Interface graphique Prisma Studio
docker compose exec todo-service npx prisma studio
```

### Accès direct SQLite
```bash
# Se connecter à la base (si sqlite3 installé)
docker compose exec todo-service sqlite3 /app/data/todos.db

# Voir les tables
.tables

# Voir les TODOs
SELECT * FROM todos;

# Quitter
.quit
```

## 🌐 Endpoints disponibles

### API Gateway (port 3002)
- **Documentation Swagger** : http://localhost:3002/api-docs
- **Health check** : http://localhost:3002/health
- **API REST** : http://localhost:3002/api/todos

### Service TODO direct (port 3001)
- **Health check** : http://localhost:3001/health
- **API REST** : http://localhost:3001/api/todos

## 📋 Tests API

### Via Swagger UI
1. Ouvrir http://localhost:3002/api-docs
2. Tester les endpoints interactivement

### Via PowerShell
```powershell
# Lister tous les TODOs
Invoke-RestMethod -Uri "http://localhost:3002/api/todos" -Method GET

# Créer un TODO
$body = @{
    title = "Tâche avec SQLite"
    description = "Test de la nouvelle configuration"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/todos" -Method POST -Body $body -ContentType "application/json"
```

## 🔄 Comparaison des configurations

### Avant (PostgreSQL + Redis)
- ✅ Performance optimisée avec cache
- ✅ Scalabilité enterprise
- ❌ Complexité de configuration
- ❌ 3 services à maintenir
- ❌ Temps de démarrage plus long

### Maintenant (SQLite uniquement)
- ✅ Simplicité maximale
- ✅ Démarrage instantané
- ✅ Un seul service à maintenir
- ✅ Parfait pour développement/prototypage
- ❌ Moins adapté pour haute charge

## 💾 Persistance des données

### Docker Volumes
```yaml
volumes:
  - todo-data:/app/data
```

### Sauvegarde
```bash
# Copier la base depuis le conteneur
docker compose cp todo-service:/app/data/todos.db ./backup-todos.db

# Restaurer une sauvegarde
docker compose cp ./backup-todos.db todo-service:/app/data/todos.db
```

## 🔧 Maintenance

### Logs utiles
```bash
# Logs du service TODO
docker compose logs -f todo-service

# Logs de l'API Gateway
docker compose logs -f api-gateway

# Tous les logs
docker compose logs -f
```

### Nettoyage
```bash
# Arrêter les services
docker compose down

# Supprimer les volumes (⚠️ perte de données)
docker compose down -v

# Nettoyer les images
docker system prune -f
```

## 🚀 Migration depuis PostgreSQL

Si vous aviez des données dans PostgreSQL :

1. **Exporter les données** :
```bash
# Depuis l'ancien conteneur PostgreSQL
docker compose exec postgres pg_dump -U postgres todoapp > backup.sql
```

2. **Adapter le format** :
- Convertir le SQL PostgreSQL vers SQLite
- Ou utiliser un outil comme `pgloader`

3. **Importer dans SQLite** :
```bash
# Après avoir appliqué le nouveau schéma
docker compose exec todo-service sqlite3 /app/data/todos.db < adapted-backup.sql
```

## 🎯 Cas d'usage recommandés

### Idéal pour :
- **Développement local** : Configuration simple et rapide
- **Prototypage** : Démarrage immédiat
- **Applications petites/moyennes** : < 100k enregistrements
- **Démonstrations** : Pas de dépendances externes

### Considérer PostgreSQL pour :
- **Production haute charge** : > 1000 requêtes/seconde
- **Applications multi-utilisateurs** : Concurrence élevée
- **Données critiques** : Réplication et backup avancés
- **Intégrations complexes** : Fonctionnalités SQL avancées

---

**💡 Note** : Cette configuration SQLite est parfaite pour le développement et les applications de taille petite à moyenne. Elle élimine toute complexité de configuration tout en conservant toutes les fonctionnalités de l'API.
