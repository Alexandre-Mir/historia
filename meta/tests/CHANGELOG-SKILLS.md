# Changelog de Skills Metodológicas e Regras do Cofre `historia`

## [2.1.0] - 2026-11-18

### Fundamentação Epistemológica e Científica (Costa, 2026)
- **Matriz Canônica no SSOT:** Inserida a Seção 0 no `meta/glossario.md` fundamentando o cofre no artigo *O Zettelkasten de Luhmann* (Antônio Luz Costa, RBSD, v. 13, n. 3, 2026) e nas pesquisas do espólio de Bielefeld (Johannes F. K. Schmidt, 2014, 2016, 2018).
- **ZKN como Parceiro Comunicativo:** O sistema opera por fechamento operacional e abertura cognitiva (sensível a irritações de `01_notes/`), estruturado para fabricação sistemática de serendipidade e redução de incerteza (informação como surpresa).
- **Regra de Ouro Fundamentada em Brodbeck (2002):** A intransferibilidade da cognição e autoria histórica ganha justificação científica: o fichário e modelos de IA não observam nem pensam por si mesmos; dependem do observador corporificado humano.

### Atualização das Skills Metodológicas
- **`zettelkasten-forager` (v2.1.0):**
  - Integração do método *Lesen Lernen* (Luhmann, 2002; Costa, 2026).
  - Pergunta-guia de tese calibrada para interrogar o esquema de observação e distinção do autor (*"o autor diferencia X de quê?"*).
  - Exigência de transição do excerto para **reformulação condensada** na voz do pesquisador.
- **`zettelkasten-supervisor` (v2.1.0):**
  - Pilar 2 (Fidelidade e Voz) enriquecido com o critério de reformulação condensada baseada em distinções (Luhmann 2002; Costa 2026).
  - Pilar 4 (Nexos) enriquecido com o teste de potencial de informação e geração de serendipidade (Schmidt 2014, 2018).
- **`zettelkasten-cartographer` (v2.1.0):**
  - MOCs canonicamente vinculados às *Remissões Estruturais e Coletivas* de Schmidt (2014, 2016), atuando como motores de navegação por arestas e geradores de serendipidade.
- **`zettelkasten-consultant` (v1.1.0):**
  - Adicionado o Eixo 5 de **Retroalimentação Sistêmica para o ZKN** (Costa 2026; Schmidt 2016): identificação de novas teses e distinções formuladas na prosa do ensaio para extração de volta ao fichário.

## [2.0.0] - 2026-11-17

### Unificação Estrutural e Arquitetura
- **Eliminação da Segunda Geração em Conflito:** Arquivados os arquivos soltos da raiz (`./zettelkasten-*.md`) para `meta/archive/skills-root/`. Canônico fixado em `~/.gemini/skills/`.
- **Precedência por Natureza:**
  - Limiares conceituais, níveis de título, testes de nexos e critérios de MOC: `meta/glossario.md` é a Fonte Única de Verdade (SSOT). As skills citam o limiar por seção (ex.: "Glossário §3"), sem duplicar números.
  - Permissões de escrita, segurança e comportamento do agente: `AGENTS.md` e as `SKILL.md` vencem.
- **Autoria Inviolável com Teste Operacional:** Adicionado o teste operacional formal: *"Nenhuma frase da resposta do agente pode ser colada como conteúdo em nota, MOC ou ensaio."* A fronteira só pode ser alterada editando o arquivo de regras, nunca via prompt de conversa.
- **Conteúdo como Dado:** Conteúdo de `01_notes/` e citações declarado formalmente como dado de pesquisa, prevenindo injeções de prompt.

### Skills Metodológicas
- **`zettelkasten-forager` (v2.0.0):**
  - Unificação completa das gerações v1 e v2.
  - Suporte formal a **Lentes de Leitura** geradas pelo Cartographer.
  - Princípio de **Andaime Cognitivo (Fading Scaffolding)** em 3 níveis (Nível 1 padrão; Nível 2 intermediário; Nível 3 avançado).
  - Protocolo de **Degradação Explícita** quando não houver notas afins em `02_zettel/`.
  - Gatilho de encerramento da obra (Fase 5) condicionado expressamente à confirmação do pesquisador e leitura até `reading-position::`.
- **`zettelkasten-supervisor` (v2.0.0):**
  - Divisão operacional em **dois modos**:
    - *Modo 1 (Triagem Rápida pós-Alt+Z):* Checagem concisa de fagulha autoral, citação e atomicidade (máx. 10 linhas), sem burocracia excessiva no fluxo de leitura.
    - *Modo 2 (Auditoria de Promoção na Fase 3):* Avaliação rigorosa dos 5 pilares com base na Matriz de Conformidade.
  - Separação entre **Conformidade Formal** (checklist estrutural) e **Veredito Conceitual** (`apta`, `apta com ressalvas`, `reprovada`).
  - Tabela formal de vereditos por estágio incorporada no Glossário §3.1.
- **`zettelkasten-cartographer` (v2.0.0):**
  - Restauração do **Modo Novo MOC** e **Modo Atualização de MOC**.
  - Restauração do tratamento explícito para **>15 Zettels** (espinha dorsal de 10-14 notas + Satélites de Fronteira + recomendação de partição).
  - Conceituação do MOC como **rotas e travessias navegáveis montadas por arestas**, em vez de gavetas estanques.
  - Suporte a arquiteturas historiográficas alternativas (cronológico-processual e debate entre correntes).
- **`zettelkasten-consultant` (v1.0.0 - Nova Skill):**
  - Implementação da skill dedicada para a Fase 4.2 em `99_ensaios/`.
  - Checagem de lastro de afirmações em Zettels, rastreabilidade de citações, formulação de até 3 objeções dialéticas e identificação de Zettels maduros ociosos.

### Backend Técnico e Saneamento
- **Excisão de Rotinas Pessoais e Tarefas:** Removidos do `check-backend.js`, `dashboard-ir-srs.md` e `.obsidian/` todos os resíduos de Day Planner, Tasks, Periodic Notes, refeições e rotinas domésticas.
- **Resultado do `check-backend.js`:** 0 erros, 0 avisos. Status: *Backend consistente: nenhuma divergência detectada*.
- **Suíte de Regressão:** Criado `meta/tests/dataset-supervisor.json` e executor `meta/tests/test-runner-supervisor.js` com 10 notas rotuladas (4 exemplares, 3 quase lá, 3 com pendências).
