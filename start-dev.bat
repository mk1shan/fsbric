@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org & pause & exit /b)
if not exist node_modules (
  echo Installing packages, this takes a minute...
  call npm install
)
echo Starting the site at http://localhost:3000
call npm run dev
pause
