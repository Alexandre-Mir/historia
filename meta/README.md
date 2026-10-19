# Mapa do backend do vault

Este diretório contém a infraestrutura técnica do vault. Notas de conteúdo em `01_notes/`, `02_zettel/`, `daily/` e na raiz continuam sob organização do pesquisador; automações devem consultá-las sem reestruturá-las.

## Componentes e fonte de configuração

| Componente | Responsabilidade | Configuração ou entrada principal |
|---|---|---|
| `templater/` | Template da nota diária e comandos de extração | `.obsidian/plugins/templater-obsidian/data.json` |
| `templater-scripts/` | Funções chamadas pelos templates Templater | `tp.user.*` nos templates |
| `zotero/` | Template de nota de literatura e fluxo de importação | `.obsidian/plugins/obsidian-zotero-desktop-connector/data.json` |
| `javascript/` | Scripts QuickAdd, busca, backups e execução do verificador | `.obsidian/plugins/quickadd/data.json` |
| Modal Forms | Formulário de encerramento de leitura e formulários de captura | `.obsidian/plugins/modalforms/data.json` + API usada por QuickAdd |
| Calendar | Navegação visual pelas notas diárias existentes e criação de outras datas | Plugin `calendar`; usa as configurações do plugin nativo Notas Diárias (`daily/`) e o modelo Templater dessa pasta |
| Text Case and Cleanup | Limpeza manual e reversível de trechos copiados de PDFs | Plugin `text-format`; comandos pela paleta, sem alteração automática |
| Omnisearch | Busca geral tolerante a erros e ranqueada | Plugin `omnisearch`; comando próprio na paleta de comandos |
| Tasks | Consulta geral e marcação de tarefas no arquivo de origem | Plugin `obsidian-tasks-plugin`; consulta no painel de estudo |
| Local Backup | Backup compactado do vault completo fora do vault | Plugin `local-backup`; destino `/home/alelinux/Backups/Obsidian/historia` |
| `dataview/` | Painel de estudo e formulário de busca | Blocos Dataview e `dv.view(...)` |
| `scripts/` | Verificação técnica executável pelo Node.js | `node meta/scripts/check-backend.js` |
| `attachments/` | Imagens extraídas de anotações Zotero | Caminho `imageOutputPathTemplate` do Zotero Integration |
| `backups/zotero/` | Snapshots pré-importação e cópias de segurança pré-restauração | QuickAdd: backup/restauração Zotero |
| `reports/` | Resultado mais recente do verificador automático | `javascript/backend-check-runner.js` |

## Atalhos de uso diário

- **Abrir nota de hoje** usa o plugin nativo Notas Diárias, que cria o arquivo quando necessário; o Templater aplica o modelo já configurado para `daily/`.
- **Retomar leitura** lista as obras ativas, abre a selecionada e mostra `reading-position::` (ou `page-no::`) junto de `next-reading-step::`.
- **Encerrar sessão de leitura** usa o formulário nomeado `encerrar-sessao-leitura` do Modal Forms; os valores atuais dos campos são pré-preenchidos.
- **Adicionar tarefa à nota de hoje** usa um formulário Modal Forms com os blocos presentes naquele dia e insere a tarefa na seção escolhida.
- **Abrir fonte do Zettel** segue o link `**Fonte:**` para a nota bibliográfica.
- **Extrair Zettel da seleção** abre a nota recém-criada e posiciona o cursor no início da síntese.
- **Buscar referência Zotero** pesquisa por citekey, título, autor ou publicação nas notas bibliográficas importadas em `01_notes/`.
- O painel oferece links para essas ações, extração de Zettel da seleção, busca de notas, resumo de tarefas do dia e listas de leituras sem página, sem Zettels ou sem atividade há mais de 90 dias.
- O Calendar usa a pasta e o formato configurados no plugin nativo Notas Diárias; o Templater aplica o modelo de `daily/` ao criar uma nota pela navegação do calendário.
- A seção **Pendências no vault** do painel lista tarefas abertas do Tasks; marcar uma tarefa nessa consulta atualiza sua nota de origem.
- Para limpar trechos copiados de PDFs, selecione o texto e execute **Join wrapped lines**, **Rejoin words split across lines** ou **Tidy note** na paleta do Text Case and Cleanup. As operações são manuais e podem ser desfeitas.
- Omnisearch complementa a busca bibliográfica focada em notas de literatura com uma busca geral no vault.
- Local Backup cria um backup na inicialização, mantém até 30 dias e até 3 arquivos por dia; backups por intervalo e empacotadores externos permanecem desativados.
- Atalhos globais: `Ctrl/Cmd + Shift + D` abre a nota diária; `Ctrl/Cmd + Shift + R` retoma leitura; `Ctrl/Cmd + Shift + E` encerra sessão; `Ctrl/Cmd + Shift + T` captura tarefa; `Ctrl/Cmd + Shift + O` abre a fonte do Zettel; `Ctrl/Cmd + Shift + Z` busca referências. As teclas ficam em `.obsidian/hotkeys.json`.

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
- Scripts QuickAdd usam `app` e `quickAddApi` recebidos no contexto do macro; seletores pesquisáveis usam `quickAddApi.suggester(...)`, sem importar `obsidian` pelo CommonJS.
- O comando **Verificar backend agora** também está disponível na paleta de comandos.
- O último resultado fica em `meta/reports/backend-check.log`. Avisos novos ou alterações no resultado são notificados na inicialização; execuções manuais sempre mostram um resumo.
- A verificação estática cobre JSON, plugins ativos, caminhos de templates/scripts/views, referências de comandos conhecidas, JavaScript local, sintaxe DataviewJS e links Markdown/Wikilinks em `meta/`.
- A prévia do Zotero continua necessária para verificar a renderização real do template e a compatibilidade com o plugin.

## Regra para evoluir o backend

Ao adicionar automação, registre neste mapa o ponto de entrada, a configuração que a ativa, os dados que lê, os arquivos que pode gravar e a forma de validar. Prefira uma fonte de verdade por dado e mantenha operações destrutivas explícitas, reversíveis e acompanhadas de backup.
