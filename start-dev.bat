@echo off
echo Starting TODO Application in Development Mode...
echo.

echo Installing dependencies for TODO Service...
cd todo-service
call npm install
if %errorlevel% neq 0 (
    echo Failed to install TODO Service dependencies
    pause
    exit /b 1
)

echo.
echo Installing dependencies for API Gateway...
cd ..\api-gateway
call npm install
if %errorlevel% neq 0 (
    echo Failed to install API Gateway dependencies
    pause
    exit /b 1
)

echo.
echo Starting services...
echo.

echo Starting TODO Service on port 3001...
cd ..\todo-service
start "TODO Service" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo Starting API Gateway on port 3000...
cd ..\api-gateway
start "API Gateway" cmd /k "npm run dev"

echo.
echo ========================================
echo TODO Application is starting...
echo ========================================
echo API Gateway: http://localhost:3000
echo TODO Service: http://localhost:3001
echo ========================================
echo.
echo Press any key to exit...
pause > nul
