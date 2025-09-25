# Configuration Docker sans Redis

## 🚀 Architecture simplifiée

Cette configuration utilise uniquement **PostgreSQL** comme base de données, sans Redis pour le cache.

### Services Docker
- **PostgreSQL** (port 5432) : Base de données principale
- **todo-service** (port 3001) : Service métier TODO
- **api-gateway** (port 3002) : Point d'entrée API avec documentation Swagger

### ❌ Redis supprimé
- Pas de cache en mémoire
- Toutes les requêtes vont directement à PostgreSQL
- Performance légèrement réduite mais architecture simplifiée

## 🔧 Démarrage

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
npm install
npm run dev

# Terminal 2 - API Gateway
cd api-gateway
npm install
npm run dev
```

## 📊 Base de données

### Initialisation
```bash
# Appliquer le schéma Prisma
docker compose exec todo-service npx prisma db push

# Injecter des données de test
docker compose exec todo-service npm run db:seed
```

### Accès direct PostgreSQL
```bash
# Se connecter à la base
docker compose exec postgres psql -U postgres -d todoapp

# Voir les tables
\dt

# Voir les TODOs
SELECT * FROM todos;
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
    title = "Nouvelle tâche"
    description = "Description de la tâche"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/todos" -Method POST -Body $body -ContentType "application/json"
```

## 🔄 Différences avec la version Redis

### Avant (avec Redis)
- ✅ Cache automatique des requêtes
- ✅ Performance optimisée
- ❌ Complexité supplémentaire
- ❌ Service Redis à maintenir

### Maintenant (sans Redis)
- ✅ Architecture simplifiée
- ✅ Moins de services à gérer
- ✅ Démarrage plus rapide
- ❌ Pas de cache (requêtes directes à PostgreSQL)

## 🎯 Mode de fonctionnement

### Développement local (NODE_ENV=development)
- Utilise `database.js` (version avec Redis si disponible)
- Fallback gracieux si Redis n'est pas accessible

### Production Docker (NODE_ENV=production)
- Utilise `database-no-redis.js` automatiquement
- Toutes les requêtes vont directement à PostgreSQL
- Logs indiquent "Mode sans Redis - Cache désactivé"

## 📈 Performance

### Impact attendu
- **Lecture** : Légèrement plus lent (pas de cache)
- **Écriture** : Identique (pas d'impact)
- **Complexité** : Réduite significativement

### Optimisations PostgreSQL
- Index automatiques sur les clés primaires
- Requêtes optimisées par Prisma
- Pool de connexions configuré

## 🔧 Maintenance

### Logs utiles
```bash
# Logs du service TODO
docker compose logs -f todo-service

# Logs de PostgreSQL
docker compose logs -f postgres

# Logs de l'API Gateway
docker compose logs -f api-gateway
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

## 🚀 Prochaines étapes

1. **Tester la configuration** : Vérifier que tout fonctionne
2. **Optimiser PostgreSQL** : Index supplémentaires si nécessaire
3. **Monitoring** : Ajouter des métriques de performance
4. **Déploiement** : Configuration pour production

---

**💡 Note** : Cette configuration est idéale pour des applications de taille petite à moyenne où la simplicité prime sur les performances de cache.
