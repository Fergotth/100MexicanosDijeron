@echo off
echo Iniciando servidor Node...
REM Abre otra ventana de consola y ejecuta node server.js
start cmd /k "node server.js"

REM Espera 2 segundos para asegurarnos de que el servidor se inicie
timeout /t 2 /nobreak >nul

REM Abre la página en el navegador por defecto (puerto 5500)
start http://127.0.0.1:5500
