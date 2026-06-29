# Automação dos casos de teste de validação

Script Selenium que executa os casos `CT-001` a `CT-006` descritos em
[`../casos_de_teste_validacao.md`](../casos_de_teste_validacao.md), verificando o
retorno na interface (mensagens de sucesso/erro e conteúdo da listagem) e
salvando um print screen real de cada execução em `../screenshots/`.

## Pré-requisitos

- Backend e frontend do PitScore rodando localmente (`./mvnw spring-boot:run` e `npm start`, conforme o README do projeto).
- Google Chrome instalado.
- Python 3.10+.

## Como executar

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 test_casos_validacao.py
```

Por padrão o script aponta para `http://localhost:3000` (frontend) e
`http://localhost:8080/api/estadios` (backend). Para apontar para outras portas,
defina as variáveis de ambiente `PITSCORE_BASE_URL` e `PITSCORE_API_URL`.

Ao final, o script imprime o resultado de cada caso (`Aprovado`/`Reprovado`) e
grava o resumo em `../resultados.json`.
