# Padrões de Codificação

| | |
|---|---|
| **Projeto** | PitScore |
| **Equipe** | Eduardo Vilas Boas Rezende, Lucas Borges Lopes, Vincent Biazotti Collares |
| **Disciplina** | Engenharia de Software I — UFLA |
| **Documento** | Padrão adotado pela equipe |
| **Versão** | 1.0 |
| **Data** | 17/06/2026 |

---

## 1. Objetivo

Este documento define as boas práticas de codificação **obrigatórias** que toda a equipe deve seguir ao implementar o sistema PitScore. Cada regra é **objetiva e verificável**: o código atende ou não atende, sem depender de interpretação pessoal. O objetivo é garantir um código legível, consistente e de fácil manutenção entre os três membros da equipe e nas três tecnologias do projeto (React, Java e Python).

## 2. Fundamentação

As regras baseiam-se em três fontes amplamente adotadas na indústria:

- **Clean Code** — MARTIN, Robert C. *Código Limpo: Habilidades Práticas do Agile Software*. Rio de Janeiro: Alta Books, 2009.
- **Princípios SOLID** — princípios de projeto orientado a objetos descritos por Robert C. Martin.
- **Guias de estilo oficiais** de cada linguagem (Java Code Conventions, Airbnb JavaScript Style Guide e PEP 8 para Python).

Os limites numéricos (tamanho de função, de linha, etc.) são **decisões da equipe** para eliminar subjetividade.

## 3. Regras obrigatórias

A equipe adota **8 regras**. As regras **C1** e **C2** são de cumprimento obrigatório em toda a base de código, conforme exigência da disciplina.

| Regra | Boas prática | Regra objetiva | Como verificar |
|---|---|---|---|
| **C1** ⭐ | **Padrão de notação** | Cada elemento segue a notação da sua linguagem: **Java/JavaScript** — variáveis e funções em `camelCase`, classes e componentes React em `PascalCase`, constantes em `UPPER_SNAKE_CASE`. **Python** — variáveis e funções em `snake_case`, classes em `PascalCase`. **Banco de dados** — tabelas e colunas em `snake_case` (ex.: `id_selecao`). | Identificador fora da notação da linguagem → **não atende**. |
| **C2** ⭐ | **Documentação e comentários** | Toda classe e todo método/função **público** possui comentário de documentação (`Javadoc` em Java, `JSDoc` em JS, `docstring` em Python) descrevendo seu propósito, parâmetros e retorno. Comentários explicam o **porquê**, não o **o quê** óbvio. | Método público sem documentação, ou comentário que apenas repete o código → **não atende**. |
| **C3** | **Idioma do código** | Identificadores (variáveis, funções, classes) são escritos em **português**, mantendo a consistência com o glossário e o dicionário de dados do documento de requisitos (ex.: `selecao`, `partida`, `cadastrarJogador`). | Identificador de negócio em idioma diferente do glossário → **não atende**. |
| **C4** | **Nomes significativos** (Clean Code) | Nomes revelam a intenção. Proibido nomes genéricos (`a`, `x`, `dado`, `temp`, `func1`) ou abreviações não óbvias. Variáveis booleanas começam com verbo de estado (`isValido`, `temPartidas`). | Nome que não revela o propósito do elemento → **não atende**. |
| **C5** | **Responsabilidade única** (SOLID — SRP) | Cada função/método faz **uma única coisa** e tem no máximo **30 linhas**. Cada classe tem uma única responsabilidade. | Função com mais de 30 linhas ou que executa mais de uma responsabilidade → **não atende**. |
| **C6** | **Sem valores mágicos** | Números e textos fixos com significado de negócio são declarados como **constantes nomeadas**, não escritos diretamente no código (ex.: `SENHA_TAMANHO_MINIMO = 8` em vez de `8`). | Número/texto mágico no meio do código → **não atende**. |
| **C7** | **Tratamento de erros** | Operações que podem falhar (acesso a banco, chamadas externas, validações) tratam o erro explicitamente. Proibido capturar exceção e ignorá-la (`catch` vazio). | Bloco de captura de erro vazio ou erro não tratado → **não atende**. |
| **C8** | **Formatação consistente** | Indentação de **2 espaços** (JS/React) ou **4 espaços** (Java/Python); linhas com no máximo **120 caracteres**; uso de formatador automático (Prettier para o frontend, formatador da IDE para o backend). | Indentação inconsistente ou linha acima de 120 caracteres → **não atende**. |

> ⭐ Regras de cumprimento **obrigatório** exigidas pela disciplina.

## 4. Checklist por arquivo

Antes de marcar um arquivo como concluído (ou abrir um Pull Request), o autor responde "Sim/Não". Qualquer "Não" reprova o arquivo.

- [ ] Identificadores seguem a notação da linguagem (C1)
- [ ] Classes e métodos públicos estão documentados (C2)
- [ ] Identificadores de negócio em português, conforme o glossário (C3)
- [ ] Nomes revelam a intenção; sem nomes genéricos (C4)
- [ ] Funções com responsabilidade única e até 30 linhas (C5)
- [ ] Sem números/textos mágicos; constantes nomeadas (C6)
- [ ] Erros tratados explicitamente; sem captura vazia (C7)
- [ ] Indentação e tamanho de linha consistentes (C8)

## 5. Exemplos

**Incorreto:**

```java
public boolean v(String e, String s) {        // C1, C4: nome sem significado
    if (s.length() < 8) return false;          // C6: número mágico
    try { return repo.check(e, s); }
    catch (Exception ex) {}                     // C7: captura vazia
    return false;
}
```

**Correto:**

```java
private static final int SENHA_TAMANHO_MINIMO = 8;   // C6: constante nomeada

/**
 * Valida as credenciais de um usuário no login.            // C2: documentação
 * @param email e-mail informado
 * @param senha senha em texto puro informada
 * @return true se as credenciais forem válidas
 */
public boolean validarCredenciais(String email, String senha) {   // C1, C4
    if (senha.length() < SENHA_TAMANHO_MINIMO) {
        return false;
    }
    try {
        return usuarioRepository.autenticar(email, senha);
    } catch (AcessoBancoException erro) {                          // C7
        logger.error("Falha ao autenticar usuário", erro);
        return false;
    }
}
```

## 6. Referências

- MARTIN, Robert C. *Código Limpo: Habilidades Práticas do Agile Software*. Rio de Janeiro: Alta Books, 2009.
- *Java Code Conventions* — Oracle/Sun Microsystems.
- *Airbnb JavaScript Style Guide* — <https://github.com/airbnb/javascript>.
- *PEP 8 — Style Guide for Python Code* — <https://peps.python.org/pep-0008/>.
