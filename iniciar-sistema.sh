#!/bin/bash

echo "==================================="
echo "   Iniciando o PitScore...         "
echo "==================================="

# Entra na pasta do backend e inicia o Spring Boot em segundo plano
echo "-> Iniciando o Backend (Java/Spring Boot)..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Entra na pasta do frontend, instala dependências e inicia
echo "-> Iniciando o Frontend..."
cd frontend
npm install
npm start

# Quando o usuário fechar o frontend (Ctrl+C), isso garante que o backend também seja derrubado
trap "kill $BACKEND_PID" EXIT