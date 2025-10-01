@echo off
echo ✨ Setting up Focus Fairy Extension ✨
echo.

echo 1. Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo 2. Backend setup complete!
echo.
echo 🧚‍♀️ Next steps:
echo 1. Edit backend\.env and add your Gemini API key
echo 2. Run: npm start (in the backend folder)
echo 3. Load the extension folder in Chrome (chrome://extensions/)
echo.

pause