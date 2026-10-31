@echo off
title English Coach
set REPO=https://github.com/sibghattranslator/english-coach.git
set DIR=%USERPROFILE%\english-coach
where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed. Install it from https://git-scm.com/download/win then run this file again.
  pause
  exit /b
)
if exist "%DIR%\.git" (
  echo Updating English Coach...
  git -C "%DIR%" pull
) else (
  echo Downloading English Coach...
  git clone %REPO% "%DIR%"
)
cd /d "%DIR%"
echo.
echo English Coach is opening in your browser. Keep this window open while you study.
start "" http://localhost:8000/
python -m http.server 8000 2>nul || py -m http.server 8000
pause
