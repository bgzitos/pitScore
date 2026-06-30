# PitScore - Site da Copa

## 1. CONTEXTO DO PROBLEMA E SOLUÇÃO

**Problema:**
Os torcedores e entusiastas da Copa frequentemente precisam acessar múltiplas fontes para acompanhar tabelas, estatísticas de jogos e plantéis das seleções. Além disso, carecem de uma ferramenta centralizada e interativa para prever e simular os resultados do torneio.

**Solução:**
O PitScore é um sistema web desenvolvido para centralizar as informações e a interação com os dados da Copa. O sistema permite o cadastro e autenticação de usuários, fornecendo uma interface para visualizar seleções participantes, elencos, estatísticas das partidas encerradas e acompanhar a classificação dos grupos. Além disso, oferece um simulador interativo onde os usuários podem prever e salvar os resultados das partidas. Para manter a plataforma atualizada, usuários com perfil de Administrador possuem acesso ao gerenciamento completo do sistema, operando cadastros e exclusões de Seleções, Jogadores, Partidas (com seus respectivos estádios) e Estatísticas.

## 2. INSTRUÇÕES PARA USO

Para utilizar o sistema como um usuário, você pode acessar a nossa versão hospedada na nuvem ou rodar o sistema de forma simplificada em sua máquina.

Caso deseje baixar e usar o sistema localmente (sem precisar ser um desenvolvedor):

1. Baixe o `.zip` do projeto clicando no botão **"Code"** e depois em **"Download ZIP"** na página inicial do repositório no GitHub.
2. Extraia o conteúdo do arquivo baixado para uma pasta de sua preferência.
3. Certifique-se de ter o banco de dados PostgreSQL (versão 17) rodando em sua máquina.
4. Acesse seu gerenciador de banco de dados (pgAdmin, DBeaver ou terminal) e crie um banco de dados vazio chamado `pitscore`.
5. Após os scripts configurarem tudo automaticamente, abra o seu navegador e acesse a URL `http://localhost:3000` para começar a usar o sistema.

## 3. INSTRUÇÕES PARA DESENVOLVEDORES

Para atuar no desenvolvimento do projeto, é necessário preparar o
ecossistema completo (Banco de Dados, Backend, Frontend e Testes). Siga
o passo a passo:

### 3.1. Preparação Inicial

1.  Clone o repositório:

``` bash
git clone https://github.com/bgzitos/pitScore.git
```

2.  Acesse a pasta raiz do projeto:

``` bash
cd pitScore
```

### 3.2. Configuração do Banco de Dados

O projeto utiliza o **PostgreSQL 17** e o **Flyway** para controle de
migrações.

Crie o banco de dados e o usuário da aplicação:

``` sql
CREATE DATABASE pitscore;
CREATE USER admin_pitscore WITH ENCRYPTED PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE pitscore TO admin_pitscore;
```

> **Importante:** Nas versões mais recentes do PostgreSQL, é necessário
> garantir permissões no esquema `public`. Conecte-se ao banco
> `pitscore` e execute:

``` sql
GRANT ALL ON SCHEMA public TO admin_pitscore;
```

### 3.3. Executando a Aplicação

Você precisará de **dois terminais** abertos simultaneamente.

#### Terminal 1 -- Backend (Spring Boot / Java)

``` bash
cd backend
./mvnw spring-boot:run
```

O backend estará disponível na porta **8080** e as tabelas do banco
serão geradas automaticamente.

#### Terminal 2 -- Frontend (Node.js)

``` bash
cd frontend
npm install
npm start
```

O frontend estará disponível consumindo a API localmente.

### 3.4. Executando os Testes Automatizados (Selenium)

Para garantir a integridade das funcionalidades (como a tela de
cadastro), utilizamos scripts de validação em Python.

Certifique-se de que:

-   Backend e Frontend estejam em execução;
-   Chromium e ChromeDriver estejam instalados.

Execute:

``` bash
cd teste/selenium
pip install -r requirements.txt
python3 test_casos_validacao.py
```

## 4. TECNOLOGIAS UTILIZADAS

### Ecossistema Principal

Camada           Tecnologia
  ---------------- --------------------------------------
Frontend         React (v19.2.7) / Node.js
Backend          Java (v25 LTS) / Spring Boot / Maven
Banco de Dados   PostgreSQL (v17) / Flyway

### Qualidade e Automação

Área         Tecnologia
  ------------ ---------------------------------------
Testes E2E   Python (v3.12) com Selenium WebDriver

### Ferramentas e Ambiente

Categoria            Ferramenta
  -------------------- ------------------------
IDEs Recomendadas    VSCode e IntelliJ IDEA
Controle de Versão   Git / GitHub

## 5. ORGANIZAÇÃO DO PROJETO

Este projeto está organizado nas pastas descritas abaixo com as seguintes finalidades:

====================

## Estrutura de Pastas

- `frontend/`: Contém o código-fonte principal da aplicação web em React.
  - `frontend/src/components/`: Componentes reutilizáveis da interface do usuário.
  - `frontend/src/utils/`: Funções auxiliares e utilitárias.
- `backend/`: Contém a API e a lógica de negócios desenvolvida em Java.
- `docs/`: Documentação do projeto, incluindo manuais, diagrama de classes e documentação de casos de uso.
- `assets/`: Gitkeep.

## 6. PADRÕES DE GIT

Esta seção define as regras **obrigatórias** de uso do Git que toda a equipe deve seguir. O objetivo é manter um histórico limpo, rastreável e padronizado, alinhado à rastreabilidade exigida no documento de [Regras de Verificação e Análise de Requisitos](docs/padroes_adotados/Regras%20de%20Verificação%20e%20Análise%20de%20Requisitos.md) (regra A9).

### 6.1. Organização de pastas

O repositório separa **documentação** de **código-fonte**:

- `docs/`: toda a documentação do projeto (requisitos, padrões adotados, diagramas). Cada categoria fica em sua subpasta (ex.: `docs/padroes_adotados/`, `docs/documento_requisitos/`).
- `frontend/`, `backend/`, `config/`: código-fonte e configuração, conforme a [Estrutura de Pastas](#estrutura-de-pastas).
- Arquivos de documentação usam a extensão `.md` sempre que possível, para versionamento e leitura direta no GitHub.

### 6.2. Branches

- A branch `main` é **protegida**: nunca se faz commit direto nela. Ela contém apenas código revisado e funcional.
- Todo trabalho é feito em uma **branch específica**, criada a partir de `main`, seguindo o padrão:

  | Tipo                | Prefixo | Exemplo                  |
  | ------------------- | ------- | ------------------------ |
  | Nova funcionalidade | `feat/` | `feat/cadastrar-selecao` |
  | Correção de bug     | `fix/`  | `fix/login-bloqueio`     |
  | Documentação        | `docs/` | `docs/diagrama-classes`  |

- O nome da branch é escrito em **minúsculas**, com palavras separadas por hífen (`kebab-case`), e referencia a tarefa/requisito quando aplicável (ex.: `feat/rf004-cadastrar-selecao`).
- Após o merge na `main`, a branch de trabalho é **excluída**.

### 6.3. Padrão de commits

Os commits seguem o padrão **Conventional Commits**, com a mensagem escrita em **português**, no formato:

```
<tipo> - <descrição no imperativo>
```

- A descrição é curta (máximo 72 caracteres), inicia com verbo no imperativo e **não** termina com ponto final.
- Tipos permitidos:

  | Tipo       | Quando usar                                                 |
  | ---------- | ----------------------------------------------------------- |
  | `feat`     | Adição de uma nova funcionalidade                           |
  | `fix`      | Correção de um bug                                          |
  | `docs`     | Mudanças apenas em documentação                             |
  | `style`    | Formatação que não altera lógica (espaços, ponto e vírgula) |
  | `refactor` | Refatoração sem mudança de comportamento                    |
  | `test`     | Adição ou ajuste de testes                                  |
  | `chore`    | Tarefas de manutenção (build, dependências, scripts)        |

- **Exemplos válidos:**
  - `feat - Adiciona cadastro de seleção (RF004)`
  - `fix - Corrige bloqueio de login após 5 tentativas`
  - `docs - Atualiza documento de requisitos`
- Referência completa do padrão adotado: <https://github.com/iuricode/padroes-de-commits>

### 6.4. Fluxo de trabalho (resumo)

1. Atualizar a `main` local: `git pull origin main`.
2. Criar a branch da tarefa: `git checkout -b feat/rf004-cadastrar-selecao`.
3. Desenvolver, fazendo commits pequenos e no padrão da Seção 6.3.
4. Subir a branch: `git push origin feat/rf004-cadastrar-selecao`.
5. Abrir um **Pull Request** para a `main`, vinculando a issue correspondente.
6. Após revisão e aprovação de outro membro, fazer o merge e excluir a branch.

### 6.5. Arquivos ignorados

O repositório versiona apenas código-fonte e documentação. Artefatos gerados automaticamente, dependências e arquivos locais **não** são versionados, conforme definido no arquivo [`.gitignore`](.gitignore) na raiz do projeto (cobre Java, Node/React, Python, IDEs e arquivos de sistema operacional).
