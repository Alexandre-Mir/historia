# Mapa do backend do cofre `historia`

Este diretório contém a infraestrutura técnica. As notas de conteúdo (`01_notes/`, `02_zettel/`, `99_ensaios/`, `00_MOCs/`) são estritamente para leitura por agentes; automações residem aqui.

## Fonte Única de Verdade (SSOT)

- **Fundamentação Epistemológica e Metodológica:** [[glossario]] (`meta/glossario.md §0`), alicerçada no artigo canônico de Antônio Luz Costa (*O Zettelkasten de Luhmann*, RBSD, v. 13, n. 3, 2026), Niklas Luhmann (1981, 2002) e Johannes Schmidt (2014, 2016, 2018).
- **Regras de Agente/Autoria:** [[AGENTS]] (`AGENTS.md`).
- **Passos do Fluxo:** [[fluxo de estudos]] (`fluxo de estudos.md`).
- **Estado Técnico e Atalhos:** Este arquivo (`meta/README.md`).

---

## ⌨️ Tabela de Atalhos Reais (`.obsidian/hotkeys.json`)

| Atalho | Ação | Plugin / Comando |
|:---|:---|:---|
| **`Ctrl + S`** / **`D`** | Abrir Painel (Dashboard) | QuickAdd: `dashboard` |
| **`Ctrl + N`** | Workspace `work with notes` | QuickAdd: `work with notes` |
| **`Alt + Z`** | Extrair Zettel da seleção | QuickAdd: `extrair zettel` |
| **`Mod + K`** | Extrair nota de pesquisa | Templater: `extract research note...` |
| **`Mod + Shift + R`** | Retomar leitura | QuickAdd: `Retomar leitura` |
| **`Mod + Shift + E`** | Registrar continuidade | QuickAdd: `Registrar continuidade...` |
| **`Mod + Shift + O`** | Abrir fonte do Zettel | QuickAdd: `Abrir fonte do Zettel` |
| **`Mod + Shift + Z`** | Buscar referência Zotero | QuickAdd: `Buscar referência Zotero` |
| **`Mod + Alt + J`** | Unir linhas (Join lines) | Text Format: `join-lines` |
| **`Mod + Alt + H`** | Remover hifens (Dehyphenate) | Text Format: `dehyphenate` |

---

## 🛠️ Verificação e Manutenção

O backend é monitorado pelo script `node meta/scripts/check-backend.js`.
- **Relatório Atual:** `meta/reports/backend-check.log`.
- **Execução:** O script roda na inicialização do Obsidian via QuickAdd e pode ser chamado manualmente pela paleta de comandos.
- **Atenção:** O relatório de integridade técnica alimenta a checagem formal do `zettelkasten-supervisor`, sinalizando inconsistências estruturais no cofre.

### Componentes Críticos
- `templater/`: Templates para extração bibliográfica e de Zettels atômicos.
- `zotero/`: Fluxo de importação bibliográfica.
- `javascript/`: Lógica de automação e integração Zotero-Obsidian.
- `dataview/`: Painéis de controle e consultas de integridade.

## Regra para Evolução
Ao adicionar automação:
1. Registre o ponto de entrada e configuração aqui.
2. Atualize o `check-backend.js` para cobrir o novo componente.
3. Garanta que a automação respeite a **Regra de Ouro de Autoria** em `AGENTS.md`.
