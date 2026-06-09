# PitScore

> Plataforma de estatísticas de jogadores e campeonatos de futebol, com cadastro de usuários e acompanhamento em tempo real de desempenho esportivo.

---

## 1. Contexto do Problema e Solução

### Problema

Torcedores, analistas amadores e organizadores de campeonatos locais não dispõem de uma plataforma acessível e centralizada para acompanhar estatísticas detalhadas de jogadores em campeonatos de menor expressão. Ferramentas como o SofaScore cobrem apenas ligas profissionais de grande porte, deixando de fora campeonatos universitários, regionais e amadores — onde há grande demanda por esse tipo de acompanhamento.

### Solução

O **PitScore** é um sistema web que permite:

- Cadastro e autenticação de usuários (torcedores, técnicos e organizadores).
- Registro e acompanhamento de estatísticas de jogadores por partida e por campeonato (gols, assistências, cartões, minutos jogados, etc.).
- Criação e gerenciamento de campeonatos, times e jogadores.
- Visualização de rankings e tabelas de desempenho.
- Análise preditiva de desempenho via modelos de machine learning (Python).

---

## 2. Instruções para Uso

> Siga os passos abaixo para baixar, instalar e rodar o PitScore na sua máquina. Não é necessário ter experiência em desenvolvimento.

### Pré-requisitos

Instale as ferramentas abaixo antes de começar:

| Ferramenta | Download |
|---|---|
| Java 26+ | https://adoptium.net |
| Node.js 22+ | https://nodejs.org |
| PostgreSQL 17 | https://www.postgresql.org/download |
| Python 3.12.2 | https://www.python.org/downloads/release/python-3122 |

### Passo a passo

**1. Baixe o projeto**

Acesse https://github.com/seu-usuario/pitScore, clique em **Code → Download ZIP** e extraia o arquivo.

Ou via terminal:
```bash
git clone https://github.com/seu-usuario/pitScore.git
cd pitScore
```

**2. Configure o banco de dados**

Abra o terminal e crie o banco de dados:
```bash
psql -U postgres
```
```sql
CREATE DATABASE pitscore;
\q
```

Edite o arquivo `backend/src/main/resources/application.properties` com suas credenciais:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pitscore
spring.datasource.username=postgres
spring.datasource.password=sua_senha
```

**3. Inicie o backend**

```bash
cd backend
./mvnw spring-boot:run
```

O servidor estará disponível em `http://localhost:8080`.

**4. Inicie o frontend**

Abra outro terminal:
```bash
cd frontend
npm install
npm start
```

Acesse `http://localhost:3000` no seu navegador. Você verá a tela inicial do PitScore.

---

## 3. Instruções para Devs

### 3.1 Clone o projeto

```bash
git clone https://github.com/seu-usuario/pitScore.git
cd pitScore
```

Ou baixe o ZIP em **Code → Download ZIP** e extraia na pasta desejada.

### 3.2 Instale as dependências

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:** As dependências são gerenciadas pelo Maven e baixadas automaticamente ao rodar o projeto.

**Machine Learning (Python):**
```bash
cd ml
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 3.3 Execute o projeto

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
API disponível em `http://localhost:8080`

**Frontend:**
```bash
cd frontend
npm start
```
Acesse `http://localhost:3000` no navegador.

**ML (opcional):**
```bash
cd ml
python app.py
```

---

## 4. Tecnologias

- **frontend:** React versão 19.2.7
- **backend:** Java (OpenJDK) versão 26-ea
- **banco de dados:** PostgreSQL versão 17
- **outras:** Python versão 3.12.2

---

## 5. Organização do Projeto

```
pitScore/
│
├── frontend/                  # Aplicação React (interface do usuário)
│   ├── public/                # Arquivos estáticos (index.html, ícones)
│   └── src/
│       ├── components/        # Componentes reutilizáveis da UI
│       ├── pages/             # Páginas da aplicação (Home, Login, Dashboard)
│       ├── services/          # Integração com a API do backend
│       └── assets/            # Imagens, fontes e estilos globais
│
├── backend/                   # API REST em Java (Spring Boot)
│   └── src/
│       ├── main/
│       │   ├── java/          # Código-fonte Java (controllers, services, models)
│       │   └── resources/     # Configurações (application.properties)
│       └── test/              # Testes automatizados
│
├── ml/                        # Modelos de machine learning em Python
│   ├── models/                # Modelos treinados
│   ├── notebooks/             # Jupyter Notebooks de análise
│   └── requirements.txt       # Dependências Python
│
├── database/                  # Scripts SQL de criação e população do banco
│   ├── schema.sql             # Estrutura das tabelas
│   └── seed.sql               # Dados iniciais de exemplo
│
└── docs/                      # Documentação adicional do projeto
```
