#!/bin/bash

# 🚀 Script d'initialisation automatique Docker - TODO App
echo "🚀 Initialisation de l'application TODO..."

# Démarrer les conteneurs
echo "📦 Démarrage des conteneurs Docker..."
docker compose up --build -d

# Attendre que les services démarrent
echo "⏳ Attente du démarrage des services..."
sleep 10

# Appliquer le schéma Prisma
echo "🗄️ Application du schéma de base de données..."
docker compose exec -T todo-service npx prisma db push

# Injecter les données de test
echo "🌱 Injection des données de test..."
docker compose exec -T todo-service npm run db:seed

# Vérifier que tout fonctionne
echo "🧪 Test de l'API..."
if curl -s http://localhost:3002/health > /dev/null; then
    echo "✅ API Gateway : OK"
else
    echo "❌ API Gateway : Erreur"
fi

if curl -s http://localhost:3002/api/todos > /dev/null; then
    echo "✅ API REST : OK"
else
    echo "❌ API REST : Erreur"
fi

echo ""
echo "🎉 Application TODO initialisée avec succès !"
echo ""
echo "🌐 URLs disponibles :"
echo "   • Accueil : http://localhost:3002/"
echo "   • Swagger : http://localhost:3002/api-docs"
echo "   • API REST : http://localhost:3002/api/todos"
echo "   • Health : http://localhost:3002/health"
echo ""
echo "📚 Commandes utiles :"
echo "   • Voir les logs : docker compose logs -f"
echo "   • Arrêter : docker compose down"
echo "   • Redémarrer : docker compose restart"
echo ""
