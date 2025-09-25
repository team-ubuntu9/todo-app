# Documentation API Swagger - TODO Application

## 📚 Accès à la documentation

La documentation interactive Swagger est disponible à l'adresse suivante :

**🌐 [http://localhost:3002/api-docs](http://localhost:3002/api-docs)**

## ✨ Fonctionnalités de la documentation

### Interface Swagger UI
- **Interface interactive** : Testez directement les endpoints depuis le navigateur
- **Schémas détaillés** : Visualisation complète des modèles de données
- **Exemples de requêtes/réponses** : Formats JSON avec données d'exemple
- **Codes de statut** : Documentation complète des réponses HTTP

### Endpoints documentés

#### 📋 Gestion des TODOs
- `GET /api/todos` - Récupérer tous les TODOs
- `POST /api/todos` - Créer un nouveau TODO
- `GET /api/todos/{id}` - Récupérer un TODO par ID
- `PUT /api/todos/{id}` - Mettre à jour un TODO
- `DELETE /api/todos/{id}` - Supprimer un TODO
- `PATCH /api/todos/{id}/toggle` - Basculer le statut d'un TODO

#### 🏥 Health Check
- `GET /health` - Vérifier la santé de l'API Gateway

## 🚀 Comment utiliser la documentation

### 1. Accéder à l'interface
```bash
# Démarrer les services
cd todo-service && npm run dev
cd ../api-gateway && npm run dev

# Ouvrir dans le navigateur
http://localhost:3002/api-docs
```

### 2. Tester les endpoints
1. **Cliquez sur un endpoint** pour l'ouvrir
2. **Cliquez sur "Try it out"** pour activer le mode test
3. **Remplissez les paramètres** requis (ID, body JSON, etc.)
4. **Cliquez sur "Execute"** pour envoyer la requête
5. **Consultez la réponse** dans la section "Response"

### 3. Exemples de données

#### Créer un TODO
```json
{
  "title": "Nouvelle tâche importante",
  "description": "Description détaillée de la tâche",
  "priority": "high"
}
```

#### Mettre à jour un TODO
```json
{
  "title": "Titre modifié",
  "completed": true,
  "priority": "low"
}
```

## 📊 Modèles de données

### Todo
```json
{
  "id": "uuid",
  "title": "string (max 500 chars)",
  "description": "string (optionnel)",
  "completed": "boolean",
  "priority": "low | medium | high",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Réponse API standard
```json
{
  "success": "boolean",
  "data": "object | array",
  "count": "number (pour les listes)",
  "message": "string (optionnel)"
}
```

## 🔧 Configuration technique

### Dépendances Swagger
```json
{
  "swagger-jsdoc": "^6.x.x",
  "swagger-ui-express": "^4.x.x"
}
```

### Fichiers de configuration
- `api-gateway/swagger.js` - Configuration principale Swagger
- `api-gateway/routes/swagger-docs.js` - Annotations des endpoints
- `api-gateway/server.js` - Intégration dans Express

### Personnalisation
- **Thème** : Interface Swagger UI personnalisée
- **Titre** : "TODO API Documentation"
- **Serveurs** : API Gateway (3002) et Service direct (3001)

## 🎯 Avantages

### Pour les développeurs
- **Tests rapides** : Pas besoin de Postman/curl
- **Documentation à jour** : Générée automatiquement depuis le code
- **Validation** : Vérification des formats de données
- **Exemples concrets** : Données réalistes pour les tests

### Pour l'équipe
- **Spécifications claires** : Contrat API documenté
- **Onboarding facilité** : Nouvelle équipe peut comprendre rapidement
- **Maintenance** : Documentation synchronisée avec le code

## 🚀 Prochaines étapes

1. **Ajouter l'authentification** : JWT tokens dans Swagger
2. **Versioning API** : Support de plusieurs versions
3. **Environnements** : Dev, staging, production
4. **Tests automatisés** : Génération de tests depuis Swagger

---

**💡 Astuce** : Gardez cette documentation ouverte pendant le développement pour tester rapidement vos modifications !
