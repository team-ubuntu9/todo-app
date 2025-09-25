@echo off
echo Starting Redis with Docker...
echo.

docker run --name redis-todo -p 6379:6379 -d redis:7-alpine redis-server --appendonly yes

if %errorlevel% equ 0 (
    echo ✅ Redis started successfully!
    echo.
    echo Port: 6379
    echo.
    echo Waiting for Redis to be ready...
    timeout /t 3 /nobreak > nul
    echo.
    echo ✅ Redis is ready!
) else (
    echo ❌ Failed to start Redis
    echo.
    echo If container already exists, try:
    echo docker start redis-todo
)

echo.
echo Press any key to continue...
pause > nul
