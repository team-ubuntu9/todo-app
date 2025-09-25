@echo off
echo Setting up PostgreSQL for TODO Application...
echo.

echo ========================================
echo PostgreSQL Setup Instructions
echo ========================================
echo.
echo 1. Install PostgreSQL:
echo    - Download from: https://www.postgresql.org/download/windows/
echo    - Or use Chocolatey: choco install postgresql
echo    - Or use Docker: docker run --name postgres-todo -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
echo.
echo 2. Create database and user:
echo    Run these commands in psql or pgAdmin:
echo.
echo    CREATE DATABASE todoapp;
echo    CREATE USER postgres WITH PASSWORD 'password';
echo    GRANT ALL PRIVILEGES ON DATABASE todoapp TO postgres;
echo.
echo 3. Alternative - Use Docker:
echo    docker run --name postgres-todo -e POSTGRES_DB=todoapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
echo.
echo ========================================
echo Configuration
echo ========================================
echo.
echo Database configuration is in todo-service/.env:
echo - DB_HOST=localhost
echo - DB_PORT=5432
echo - DB_NAME=todoapp
echo - DB_USER=postgres
echo - DB_PASSWORD=password
echo.
echo ========================================
echo Next Steps
echo ========================================
echo.
echo 1. Make sure PostgreSQL is running
echo 2. Install dependencies: cd todo-service && npm install
echo 3. Start the application: npm start
echo.
echo Press any key to continue...
pause > nul
