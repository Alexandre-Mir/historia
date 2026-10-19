# Mapa do backend do vault

Este diretório contém a infraestrutura técnica do vault. Notas de conteúdo em `01_notes/`, `02_zettel/`, `daily/` e na raiz continuam sob organização do pesquisador; automações devem consultá-las sem reestruturá-las.

## Componentes e fonte de configuração

| Componente | Responsabilidade | Configuração ou entrada principal |
|---|---|---|
| `templater/` | Template da nota diária e comandos de extração | `.obsidian/plugins/templater-obsidian/data.json` |
| `templater-scripts/` | Funções chamadas pelos templates Templater | `tp.user.*` nos templates |
| `zotero/` | Template de nota de literatura e fluxo de importação | `.obsidian/plugins/obsidian-zotero-desktop-connector/data.json` |
| `javascript/` | Scripts QuickAdd, busca, backups e execução do verificador | `.obsidian/plugins/quickadd/data.json` |
| `dataview/` | Painel de estudo e formulário de busca | Blocos Dataview e `dv.view(...)` |
| `scripts/` | Verificação técnica executável pelo Node.js | `node meta/scripts/check-backend.js` |
| `attachments/` | Imagens extraídas de anotações Zotero | Caminho `imageOutputPathTemplate` do Zotero Integration |
| `backups/zotero/` | Snapshots pré-importação e cópias de segurança pré-restauração | QuickAdd: backup/restauração Zotero |
| `reports/` | Resultado mais recente do verificador automático | `javascript/backend-check-runner.js` |

## Fluxos

### Leitura

- O estado atual da continuidade fica na nota da obra em `01_notes/`: `reading-position::` e `next-reading-step::`.
- O diário serve como histórico e fonte de recuperação para notas antigas quando esses campos ainda estão vazios.
- O painel em `dataview/dashboard-ir-srs.md` exibe leituras ativas, continuidade recuperada, tarefas recentes e integridade estrutural dos Zettels.
- O filtro “sem Zettels derivados” usa links de saída das notas em `02_zettel/` para as fontes em `01_notes/`; a indicação `**Fonte:**` no corpo é texto editorial, não propriedade Dataview.

### Importação Zotero

1. Conferir a renderização pelo Data Explorer do Zotero Integration.
2. Rodar **Zotero: backup pré-importação**.
3. Importar com o formato configurado.
4. Se necessário, rodar **Restaurar backup Zotero**; o comando cria um snapshot do estado atual antes de restaurar os arquivos escolhidos.

Snapshots incluem `01_notes/` e `meta/attachments/`. A retenção mantém os 20 mais recentes; os excedentes são enviados à lixeira do Obsidian. A restauração não apaga arquivos criados depois do snapshot.

### Verificação

- O QuickAdd roda `check-backend.js` na inicialização do Obsidian para desktop.
- O comando **Verificar backend agora** também está disponível na paleta de comandos.
- O último resultado fica em `meta/reports/backend-check.log`. Avisos novos ou alterações no resultado são notificados na inicialização; execuções manuais sempre mostram um resumo.
- A verificação estática cobre JSON, plugins ativos, caminhos de templates/scripts/views, referências de comandos conhecidas, JavaScript local, sintaxe DataviewJS e links Markdown/Wikilinks em `meta/`.
- A prévia do Zotero continua necessária para verificar a renderização real do template e a compatibilidade com o plugin.

## Regra para evoluir o backend

Ao adicionar automação, registre neste mapa o ponto de entrada, a configuração que a ativa, os dados que lê, os arquivos que pode gravar e a forma de validar. Prefira uma fonte de verdade por dado e mantenha operações destrutivas explícitas, reversíveis e acompanhadas de backup.
