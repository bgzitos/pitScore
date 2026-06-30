@echo off
echo ===================================
echo    Iniciando o PitScore...
echo ===================================

echo -> Iniciando o Backend (Java/Spring Boot)...
cd backend
start "PitScore - Backend" cmd /c "mvnw.cmd spring-boot:run"
cd ..

echo -> Iniciando o Frontend...
cd frontend
call npm install
start "PitScore - Frontend" cmd /c "npm start"
cd ..

echo.
echo Sistema iniciado com sucesso!
echo Duas novas janelas foram abertas para o Backend e Frontend.
echo Para encerrar o sistema, basta fechar as janelas pretas que foram abertas.
pause