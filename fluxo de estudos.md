Este documento consolida o fluxo de trabalho do cofre `historia`, integrando a captura do Zotero, leitura incremental, atomização Zettelkasten, evolução orgânica e escrita incremental. As skills metodológicas (somente leitura, ver `AGENTS.md`) são acionadas por demanda em pontos marcados com 🧭. Definições conceituais estão em [[glossario]].

## O Ciclo Diário Passo a Passo

### Fase 1: Captura & Fichamento (Zotero ➔ Obsidian)

1. **Backup:** Antes de importar, rodo o comando `Zotero: backup pré-importação` (Snapshot de `01_notes/` e anexos).
2. **Importação:** Sincronizo as anotações. O arquivo vai para `01_notes/`.
3. **Continuidade:** Para retomar uma obra, uso o **Painel de Estudo** (`Ctrl+S`) ou `Retomar leitura` (`Ctrl+Shift+R`).
4. **Registro:** Ao parar, uso `Registrar continuidade` (`Ctrl+Shift+E`) para atualizar `reading-position::`.

---

### Fase 2: Atomização do Zettelkasten

0. 🧭 **Forager (opcional):** Garimpa a nota. Se houver uma **Lente de Leitura** (lacuna vinda do Cartographer), forneço-a ao Forager para priorizar a busca. Respondo à pergunta-guia para gerar a tese.
1. **Workspace:** `Ctrl + N` para carregar o workspace de trabalho.
2. **Extração:** Seleciono o trecho e uso `Alt+Z` (`zettel-extract`).
    - Digito um **título provisório** (níveis 0–2).
3. **No Novo Zettel:**
    - Escrevo a **Síntese Autoral** (voz do pesquisador).
    - Registro **Nexos Tipados** em `### Conexões` ou no fluxo (ver Glossário).
4. 🧭 **Supervisor:** Submeto o Zettel para auditoria de maturidade e fidelidade.

---

### Fase 3: Evolução e Reencontro (SRS)

1. **Motor de Reencontro:** O Painel (`Ctrl+S`) lista notas que precisam de atenção (ex: `semente` antigas, `desenvolvimento` sem nexos).
2. **Revisão:** A cada encontro, lapido o título (para nível 3-4) e a síntese.
3. **Promoção:** Eu mesmo altero a `maturidade` seguindo a **Matriz de Conformidade**.

---

### Fase 4: Incremental Writing (MOCs e Ensaios)

1. **MOCs (Macro-Writing):**
    - 🧭 **Cartographer:** Quando um cluster parece denso, peço análise de massa crítica.
    - **Sucesso:** O Cartographer entrega o esqueleto; eu redijo o MOC em `00_MOCs/`.
    - **Fallback (Lentes):** O Cartographer gera **Lentes de Leitura**; eu as uso na Fase 2 para preencher lacunas.
2. **Ensaios (`99_ensaios/`):** Escrita contínua apoiada pelos Zettels.
    - 🧭 **Consultor Analítico (`zettelkasten-consultant`):** Audita o lastro das teses em `02_zettel/`, rastreia citações, formula objeções dialéticas e identifica Zettels maduros ociosos.

---

### Fase 5: Conclusão da Obra

1. Quando o Forager sinaliza que não restam faíscas densas e eu decido encerrar a leitura:
2. Uso o comando `Concluir leitura da obra` para preencher `end-date::`.

---

## 🧭 Mapa de Acionamento das Skills

| Fase | Skill | Objetivo |
|---|---|---|
| 2 | `zettelkasten-forager` | Identificar candidato e formular tese (integra Lentes do Cartographer). |
| 2.4 | `zettelkasten-supervisor` (Modo Triagem) | Checagem ultracurta pós-Alt+Z (fagulha, citação, atomicidade). |
| 3 | `zettelkasten-supervisor` (Modo Promoção) | Auditoria aprofundada de conformidade e prontidão para avanço na Matriz. |
| 4.1 | `zettelkasten-cartographer` | Mapear massa crítica de clusters, rotas de MOC e Lentes de Leitura. |
| 4.2 | `zettelkasten-consultant` | Auditar lastro de ensaios, rastreabilidade de fontes e objeções críticas. |

---

## ⌨️ Atalhos Rápidos
Consulte a tabela completa e atualizada em [[README]] (`meta/README.md`).
Os atalhos principais são: `Ctrl+N` (Workspace), `Alt+Z` (Extrair), `Ctrl+S` (Painel), `Ctrl+Shift+R` (Retomar Leitura).
