@echo off
echo Starting PostgreSQL with Docker...
echo.

docker run --name postgres-todo -e POSTGRES_DB=todoapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine

if %errorlevel% equ 0 (
    echo ✅ PostgreSQL started successfully!
    echo.
    echo Database: todoapp
    echo User: postgres
    echo Password: password
    echo Port: 5432
    echo.
    echo Waiting for database to be ready...
    timeout /t 5 /nobreak > nul
    echo.
    echo ✅ PostgreSQL is ready!
) else (
    echo ❌ Failed to start PostgreSQL
    echo.
    echo If container already exists, try:
    echo docker start postgres-todo
)

echo.
echo Press any key to continue...
pause > nul
