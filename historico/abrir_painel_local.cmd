@echo off
cd /d "%~dp0.."
start "Painel Historico Local" /min cmd /c "python -m http.server 8787"
powershell -NoProfile -Command "Start-Sleep -Seconds 2"
start "" http://127.0.0.1:8787/historico/
