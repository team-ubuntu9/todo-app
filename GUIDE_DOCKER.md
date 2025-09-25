# 🐳 Guide Docker - Application TODO

## ✅ Configuration Docker Corrigée

J'ai analysé et corrigé votre configuration Docker. Voici les **corrections apportées** :

### 🔧 **Corrections Effectuées**

1. **✅ Port API Gateway** : Corrigé de 3000 → 3002
2. **✅ Génération Prisma** : Ajoutée dans le Dockerfile todo-service
3. **✅ Health Checks** : Remplacé `curl` par `wget` (disponible dans Alpine)
4. **✅ Fichiers .dockerignore** : Créés pour optimiser les builds
5. **✅ Installation wget** : Ajoutée dans les Dockerfiles pour les health checks

---

## 🚀 Commandes pour Dockeriser Votre Application

### **Option 1 : Démarrage Complet (RECOMMANDÉ)**
```bash
# Construire et démarrer tous les services
docker-compose up --build

# En arrière-plan (détaché)
docker-compose up --build -d
```

### **Option 2 : Étape par Étape**
```bash
# 1. Construire les images
docker-compose build

# 2. Démarrer les services
docker-compose up

# 3. Ou en arrière-plan
docker-compose up -d
```

### **Option 3 : Services Individuels**
```bash
# Démarrer seulement PostgreSQL et Redis
docker-compose up postgres redis -d

# Puis démarrer les services Node.js
docker-compose up todo-service api-gateway
```

---

## 📊 Vérification et Monitoring

### **Vérifier l'État des Services**
```bash
# Voir tous les conteneurs
docker-compose ps

# Voir les logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs todo-service
docker-compose logs api-gateway
docker-compose logs postgres
docker-compose logs redis

# Suivre les logs en temps réel
docker-compose logs -f
```

### **Health Checks**
```bash
# Vérifier la santé des services
docker-compose ps

# Tester manuellement les endpoints
curl http://localhost:3002/health    # API Gateway
curl http://localhost:3001/health    # Service TODO (si exposé)
```

### **Accès aux Services**
- **Application** : http://localhost:3002
- **API Gateway** : http://localhost:3002
- **Service TODO** : http://localhost:3001 (interne)
- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379

---

## 🛠️ Commandes de Gestion

### **Arrêter les Services**
```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ PERTE DE DONNÉES)
docker-compose down -v

# Arrêter et supprimer les images
docker-compose down --rmi all
```

### **Redémarrer les Services**
```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart todo-service
```

### **Mise à Jour après Modifications**
```bash
# Reconstruire après modification du code
docker-compose up --build

# Reconstruire un service spécifique
docker-compose build todo-service
docker-compose up todo-service
```

---

## 🔍 Debug et Dépannage

### **Accéder aux Conteneurs**
```bash
# Shell dans le conteneur todo-service
docker-compose exec todo-service sh

# Shell dans le conteneur postgres
docker-compose exec postgres psql -U postgres -d todoapp

# Shell dans le conteneur redis
docker-compose exec redis redis-cli
```

### **Vérifier les Variables d'Environnement**
```bash
# Variables du todo-service
docker-compose exec todo-service env

# Variables de l'api-gateway
docker-compose exec api-gateway env
```

### **Problèmes Courants et Solutions**

#### **Port déjà utilisé**
```bash
# Vérifier les ports occupés
netstat -an | findstr "3001\|3002\|5432\|6379"

# Arrêter les services locaux si nécessaire
# Puis relancer Docker
docker-compose up
```

#### **Problème de base de données**
```bash
# Vérifier les logs PostgreSQL
docker-compose logs postgres

# Recréer la base de données
docker-compose down -v
docker-compose up postgres -d
# Attendre quelques secondes
docker-compose up
```

#### **Cache Redis ne fonctionne pas**
```bash
# Vérifier Redis
docker-compose exec redis redis-cli ping

# Vider le cache si nécessaire
docker-compose exec redis redis-cli flushall
```

---

## 📈 Optimisations de Production

### **Variables d'Environnement de Production**
Créer un fichier `.env.production` :
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:secure_password@postgres:5432/todoapp?schema=public
REDIS_URL=redis://redis:6379
PORT_TODO_SERVICE=3001
PORT_API_GATEWAY=3002
```

### **Docker Compose pour Production**
```bash
# Utiliser un fichier de production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Monitoring Avancé**
```bash
# Statistiques des conteneurs
docker stats

# Utilisation des ressources
docker-compose top

# Espace disque utilisé
docker system df
```

---

## 🔄 Workflow de Développement

### **Développement Local avec Docker**
```bash
# 1. Démarrer les services de base
docker-compose up postgres redis -d

# 2. Développer en local avec hot-reload
cd todo-service && npm run dev
cd api-gateway && npm run dev
```

### **Test Complet avec Docker**
```bash
# 1. Build et démarrage
docker-compose up --build -d

# 2. Tester l'API
npm run test-api

# 3. Vérifier les logs
docker-compose logs -f
```

### **Déploiement**
```bash
# 1. Build des images de production
docker-compose build --no-cache

# 2. Tag des images pour le registry
docker tag todo-app_todo-service:latest your-registry/todo-service:v1.0.0
docker tag todo-app_api-gateway:latest your-registry/api-gateway:v1.0.0

# 3. Push vers le registry
docker push your-registry/todo-service:v1.0.0
docker push your-registry/api-gateway:v1.0.0
```

---

## 📋 Checklist de Démarrage

### ✅ **Avant le Premier Démarrage**
- [ ] Docker et Docker Compose installés
- [ ] Ports 3001, 3002, 5432, 6379 libres
- [ ] Code source à jour
- [ ] Fichiers .dockerignore créés

### ✅ **Démarrage Standard**
```bash
# Commande unique pour tout démarrer
docker-compose up --build -d

# Vérifier que tout fonctionne
docker-compose ps
curl http://localhost:3002/health
```

### ✅ **Vérifications Post-Démarrage**
- [ ] Tous les conteneurs sont "healthy"
- [ ] API Gateway répond sur le port 3002
- [ ] Base de données PostgreSQL accessible
- [ ] Cache Redis opérationnel
- [ ] Logs sans erreurs critiques

---

## 🎯 **Résumé des Commandes Essentielles**

```bash
# Démarrage complet
docker-compose up --build -d

# Vérification
docker-compose ps
docker-compose logs

# Arrêt
docker-compose down

# Redémarrage après modification
docker-compose up --build

# Debug
docker-compose exec todo-service sh
docker-compose logs -f todo-service
```

---

**🎉 Votre configuration Docker est maintenant prête et optimisée !**

Utilisez `docker-compose up --build -d` pour démarrer votre application complète en mode conteneurisé.
