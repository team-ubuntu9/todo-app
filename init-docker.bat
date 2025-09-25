@echo off
REM 🚀 Script d'initialisation automatique Docker - TODO App (Windows)
echo 🚀 Initialisation de l'application TODO...

REM Démarrer les conteneurs
echo 📦 Démarrage des conteneurs Docker...
docker compose up --build -d

REM Attendre que les services démarrent
echo ⏳ Attente du démarrage des services...
timeout /t 10 /nobreak > nul

REM Appliquer le schéma Prisma
echo 🗄️ Application du schéma de base de données...
docker compose exec -T todo-service npx prisma db push

REM Injecter les données de test
echo 🌱 Injection des données de test...
docker compose exec -T todo-service npm run db:seed

REM Vérifier que tout fonctionne
echo 🧪 Test de l'API...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3002/health' -Method GET -TimeoutSec 5 | Out-Null; Write-Host '✅ API Gateway : OK' } catch { Write-Host '❌ API Gateway : Erreur' }"

powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3002/api/todos' -Method GET -TimeoutSec 5 | Out-Null; Write-Host '✅ API REST : OK' } catch { Write-Host '❌ API REST : Erreur' }"

echo.
echo 🎉 Application TODO initialisée avec succès !
echo.
echo 🌐 URLs disponibles :
echo    • Accueil : http://localhost:3002/
echo    • Swagger : http://localhost:3002/api-docs
echo    • API REST : http://localhost:3002/api/todos
echo    • Health : http://localhost:3002/health
echo.
echo 📚 Commandes utiles :
echo    • Voir les logs : docker compose logs -f
echo    • Arrêter : docker compose down
echo    • Redémarrer : docker compose restart
echo.
pause
