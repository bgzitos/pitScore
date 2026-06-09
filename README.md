# PitScore - Site da Copa

## 1. CONTEXTO DO PROBLEMA E SOLUÇÃO
**Problema:**
Os torcedores e entusiastas da Copa frequentemente precisam acessar múltiplas fontes para acompanhar tabelas, estatísticas de jogos e plantéis das seleções. Além disso, carecem de uma ferramenta centralizada e interativa para prever e simular os resultados do torneio.

**Solução:**
O PitScore é um sistema web desenvolvido para centralizar as informações e a interação com os dados da Copa. O sistema permite o cadastro e autenticação de usuários, fornecendo uma interface para visualizar seleções participantes, elencos, estatísticas das partidas encerradas e acompanhar a classificação dos grupos. Além disso, oferece um simulador interativo onde os usuários podem prever e salvar os resultados das partidas. Para manter a plataforma atualizada, usuários com perfil de Administrador possuem acesso ao gerenciamento completo do sistema, operando cadastros e exclusões de Seleções, Jogadores, Partidas (com seus respectivos estádios) e Estatísticas.

## 2. INSTRUÇÕES PARA USO
Para utilizar o sistema como um usuário, você pode acessar a nossa versão hospedada na nuvem ou rodar o sistema de forma simplificada em sua máquina. 

Caso deseje baixar e usar o sistema localmente (sem precisar ser um desenvolvedor):
1. Baixe o `.zip` do projeto clicando no botão "Code" e depois em "Download ZIP" na página inicial do repositório no GitHub.
2. Extraia o conteúdo do arquivo baixado para uma pasta de sua preferência.
3. Certifique-se de ter o banco de dados PostgreSQL rodando em sua máquina e crie um banco de dados chamado `pitscore`.
4. Acesse a pasta extraída e dê um duplo clique no arquivo executável `iniciar-sistema.bat` (se estiver no Windows) ou abra o terminal e execute `./iniciar-sistema.sh` (se estiver no Linux/macOS).
5. Após os scripts configurarem tudo automaticamente, abra o seu navegador e acesse a URL `http://localhost:3000` para começar a usar o sistema.

## 3. INSTRUÇÕES PARA DEVS
Siga as instruções abaixo para preparar seu ambiente e atuar como um DEV do projeto:

1. Clone o repositório com git clone https://github.com/bgzitos/pitScore.git.
2. Instale as dependências listadas nas [tecnologias](#4-tecnologias).
3. Para executar o projeto, vá na pasta backend e rode o arquivo principal java, depois rode o arquivo principal react na pasta frontend.

## 4. Tecnologias 

- **Frontend:** React versão 19.2.7
- **Backend:** Java versão 25 lts
- **Banco de Dados:** PostgreSQL versão 17
- **IDE:** VSCode e ou IntelliJ
- **Outras:** Python versão 3.12.12

## 5. ORGANIZAÇÃO DO PROJETO
Este projeto está organizado nas pastas descritas abaixo com as seguintes finalidades:

====================
## Estrutura de Pastas

* `frontend/`: Contém o código-fonte principal da aplicação web em React.
  * `frontend/src/components/`: Componentes reutilizáveis da interface do usuário.
  * `frontend/src/utils/`: Funções auxiliares e utilitárias.
* `backend/`: Contém a API e a lógica de negócios desenvolvida em Java.
* `docs/`: Documentação do projeto, incluindo manuais, diagrama de classes e documentação de casos de uso.
* `public/`: Arquivos estáticos, como imagens e o `index.html` inicial.
* `assets/`: Recursos visuais e outros ativos do projeto.
* `config/`: Arquivos de configuração do projeto e scripts de inicialização do banco de dados.
====================