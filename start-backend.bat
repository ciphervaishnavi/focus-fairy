@echo off
echo 🧚‍♀️ Starting Focus Fairy Backend...
echo.

cd backend
if not exist node_modules (
    echo Installing dependencies first...
    call npm install
)

echo Starting server...
call npm start