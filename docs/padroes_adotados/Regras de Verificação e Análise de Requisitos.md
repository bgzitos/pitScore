# Regras de Verificação e Análise de Requisitos

| | |
|---|---|
| **Projeto** | PitScore |
| **Equipe** | Eduardo Vilas Boas Rezende, Lucas Borges Lopes, Vincent Biazotti Collares |
| **Disciplina** | Engenharia de Software I — UFLA |
| **Documento** | Padrão adotado pela equipe |
| **Versão** | 2.0 |
| **Data** | 06/06/2026 |

---

## 1. Objetivo

Este documento define as regras **obrigatórias** que toda a equipe deve seguir ao escrever (especificar) e ao conferir (verificar/analisar) os requisitos do sistema PitScore. Toda regra é **objetiva e mensurável**: o requisito atende ou não atende, sem depender de interpretação pessoal.

## 2. Fundamentação

As regras foram retiradas do **Capítulo 1 — Análise de Requisitos** de MAGELA, Rogério. *Engenharia de Software Aplicada: Fundamentos*. Rio de Janeiro: Alta Books, 2006. O livro divide a Engenharia de Requisitos em cinco fases (Elicitação, Especificação, Análise, Validação e Gerência). Este documento padroniza duas delas:

- **Especificação** — como o requisito deve ser escrito (livro, seção 7.2). Tratada na Seção 4.
- **Análise / Verificação** — como o requisito é conferido quanto à qualidade e consistência (livro, seção 7.3). Tratada na Seção 5.

Os limites numéricos (nº de palavras, por exemplo) são **decisões da equipe** para eliminar subjetividade, conforme exigido na padronização; estão indicados como tal.

## 3. Nomenclatura e convenção de escrita

- **3.1 Requisito Funcional (RF):** identificador `RFnnn`, sequencial de três dígitos, único e não reutilizável. *Observação:* o livro (item 7.3.9) sugere identificação hierárquica (URQ1, URQ1.1); adotamos a forma `RFnnn` por ser o padrão do modelo de documento de requisitos da disciplina.
- **3.2 Requisito Não-Funcional (RNF):** identificador `RNFnnn`, mesmas regras de unicidade.
- **3.3 Convenção do enunciado (livro, 7.2):** todo requisito funcional do usuário é escrito no formato **"O software DEVE …"**.
- **3.4 Nome do RF = nome do caso de uso:** começa com **verbo no infinitivo**, é **único em todo o sistema** e é **idêntico** ao caso de uso no diagrama UML (livro, BR1: um caso de uso é sempre um requisito funcional do usuário).

## 4. Regras de Especificação — como escrever (livro, seção 7.2)

| Regra | Item do livro | Regra objetiva | Como verificar |
|---|---|---|---|
| **E1** | 7.2.1 — Defina somente um requisito por vez | Cada requisito descreve **uma única** função. Proibido unir duas funções no mesmo enunciado. | Há mais de uma função em um enunciado → **não atende**. |
| **E2** | 7.2.2 — Evite as palavras | O enunciado **não pode conter**: *E, OU, SOMENTE SE, EXCETO, SE NECESSÁRIO, MAS, CONTUDO, ENTRETANTO, USUALMENTE, GERALMENTE, FREQUENTEMENTE, TIPICAMENTE, AMIGÁVEL, VERSÁTIL, FLEXÍVEL, APROXIMADAMENTE, TÃO LOGO QUANTO POSSÍVEL, TALVEZ, PROVAVELMENTE* (nem sinônimos). | Buscar qualquer termo da lista no enunciado → **não atende**. |
| **E3** | 7.2.3 — Evite frases grandes | O **nome** do RF tem de 2 a 6 palavras; o **enunciado** tem no máximo 25 palavras *(limites definidos pela equipe)*. | Contar palavras; acima do limite → **não atende**. |
| **E4** | 7.2.4 — Utilize um vocabulário fechado | Todo termo de negócio usado em um requisito deve estar **definido no glossário** do projeto. Sinônimos são proibidos: cada conceito tem **um único** termo. | Termo de negócio fora do glossário, ou dois termos para o mesmo conceito → **não atende**. |
| **E5** | 7.2.5 / 7.2.7 — Estrutura hierárquica e agrupamento | Os requisitos são **agrupados por entidade** do sistema (ex.: Cliente, Produto, Venda). | Requisito fora de um agrupamento por entidade → **não atende**. |

## 5. Regras de Análise / Verificação — como conferir (livro, seção 7.3)

| Regra | Item do livro | Regra objetiva | Como verificar |
|---|---|---|---|
| **A1** | 7.3.1 — Correta | Todo requisito atende a uma **necessidade real** (não há requisito que ninguém pediu). | O atributo *Fonte* (ver A8) aponta para uma necessidade real registrada. Sem fonte → **não atende**. |
| **A2** | 7.3.2 — Completa | Toda necessidade levantada possui **pelo menos um** requisito que a especifica. | Necessidade da lista de elicitação sem RF correspondente → **não atende**. |
| **A3** | 7.3.3 — Sem ambiguidade | O requisito admite **uma única interpretação**. Quando houver condições lógicas, usar parênteses/colchetes/maiúsculas para estruturá-las. | Enunciado com mais de uma leitura possível → **não atende**. |
| **A4** | 7.3.4 — Verificável | Existe um **processo de verificação** que confirma se o produto atende ao requisito. **Adjetivos/advérbios** só são permitidos com valor numérico e unidade. | Adjetivo/advérbio sem quantificação (ex.: "amigável", "rápido") → **não atende**. |
| **A5** | 7.3.5 — Consistente | Não existem dois requisitos **logicamente contraditórios**. O glossário não tem termos redundantes. | Par de requisitos que se contradizem → **não atende**. |
| **A6** | 7.3.6 — Compreensível | O requisito usa o **jargão do negócio definido no glossário**, sem notação formal que o usuário não entenda. | Requisito incompreensível ao usuário ou com termo fora do glossário → **não atende**. |
| **A7** | 7.3.7 — Modificável | Requisitos pequenos e concisos (atendendo E1 e E3), permitindo alteração sem grande impacto. | Requisito que viola E1 ou E3 → **não atende**. |
| **A8** | 7.3.8 — Rastreável (para trás) | Todo requisito tem o atributo **Fonte** preenchido (de onde a necessidade veio). | Atributo *Fonte* vazio → **não atende**. |
| **A9** | 7.3.9 — Rastreável (para frente) | O mesmo identificador (`RFnnn`) aparece no **documento de requisitos**, no **diagrama de casos de uso** e no **título da issue** no backlog do GitHub. | ID ausente em algum dos três artefatos → **não atende**. |
| **A10** | 7.3.10 — Independência de projeto | O requisito descreve **o QUE**, não **o COMO**. Proibido citar módulos, arquitetura ou tecnologia no enunciado funcional. | Enunciado funcional que dita solução técnica → **não atende**. |
| **A11** | 7.3.11 — Organizada | A especificação é **organizada por dimensões** (por entidade e por funcional × não-funcional), não uma lista solta de frases. | Requisito sem classificação por entidade e por tipo → **não atende**. |

## 6. Checklist por requisito

Antes de marcar um requisito como concluído, o autor responde "Sim/Não". Qualquer "Não" reprova o requisito.

- [ ] Identificador no formato `RFnnn` / `RNFnnn`, único (Seção 3)
- [ ] Enunciado no formato "O software DEVE …"; nome com verbo no infinitivo, único, de 2 a 6 palavras (3.3, 3.4, E3)
- [ ] Uma única função no enunciado (E1)
- [ ] Sem nenhuma palavra da lista proibida (E2)
- [ ] Todos os termos de negócio estão no glossário, sem sinônimos (E4, A6)
- [ ] Uma única interpretação possível (A3)
- [ ] Verificável: nenhum adjetivo/advérbio sem número e unidade (A4)
- [ ] Não contradiz outro requisito (A5)
- [ ] Não dita solução técnica/arquitetura (A10)
- [ ] Atributo *Fonte* preenchido (A8)
- [ ] Mesmo ID no documento, no diagrama de casos de uso e na issue do backlog (A9)
- [ ] Se for RNF: tem valor numérico, unidade e, ao citar tecnologia, a versão mínima (A4)

## 7. Exemplos

**Requisito correto:**

> **RF003 — Cadastrar Produto**
> *Enunciado:* O software DEVE permitir o cadastro de produtos.
> *Fonte:* necessidade levantada na entrevista inicial (controle de estoque).
> *Critério de verificação:* o produto é gravado quando nome, preço e categoria estão preenchidos; o cadastro é recusado se o preço for menor que zero.

**Incorreto e correção (baseado nos itens 7.2.1, 7.2.2 e 7.3.4 do livro):**

> *Incorreto:* "O software DEVE ter uma interface amigável E ser rápido."
> Problemas: "amigável" é adjetivo sem medida (viola A4 — Verificável); "E" une duas funções (viola E1 e E2); admite várias interpretações (viola A3).
>
> *Reescrito como RNF mensurável:*
> **RNF002** — A tela de listagem de produtos DEVE ser carregada em no máximo 2 segundos para até 1.000 registros, no navegador Google Chrome a partir da versão 120.

## 8. Referências

- MAGELA, Rogério. *Engenharia de Software Aplicada: Fundamentos*. Rio de Janeiro: Alta Books, 2006 — Capítulo 1 (Análise de Requisitos), seções 7.2 (Especificação) e 7.3 (Análise).
- RESENDE, Antônio Maria P. de. *Diagrama de Casos de Uso* — material de aula, Engenharia de Software I, UFLA.
