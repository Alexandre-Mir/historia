# Mapa do backend do vault

Este diretório contém a infraestrutura técnica do vault. Notas de conteúdo em `01_notes/`, `02_zettel/`, `daily/` e na raiz continuam sob organização do pesquisador; automações devem consultá-las sem reestruturá-las.

## Componentes e fonte de configuração

| Componente | Responsabilidade | Configuração ou entrada principal |
|---|---|---|
| `templater/` | Template da nota diária e comandos de extração | `.obsidian/plugins/templater-obsidian/data.json` |
| `templater-scripts/` | Funções chamadas pelos templates Templater | `tp.user.*` nos templates |
| `zotero/` | Template de nota de literatura e fluxo de importação | `.obsidian/plugins/obsidian-zotero-desktop-connector/data.json` |
| `javascript/` | Scripts QuickAdd, busca, backups e execução do verificador | `.obsidian/plugins/quickadd/data.json` |
| Modal Forms | Formulário de continuidade de leitura e captura de tarefas | `.obsidian/plugins/modalforms/data.json` + API usada por QuickAdd |
| Notebook Navigator | Navegação por pastas, tags, propriedades e notas recentes; calendário integrado às notas diárias; homepage aponta para o painel de estudo | Plugin `notebook-navigator`; homepage `meta/dataview/dashboard-ir-srs.md`; modo de integração Notas Diárias, pasta `daily/`, criação via plugin nativo e modelo Templater |
| Minimal Theme | Tema visual com esquemas Flexoki claro/escuro, largura de leitura e tipografia | `.obsidian/appearance.json` + `.obsidian/plugins/obsidian-minimal-settings/data.json` |
| Text Case and Cleanup | Limpeza manual e reversível de trechos copiados de PDFs | Plugin `text-format`; comandos pela paleta, sem alteração automática |
| Footnote Shortcut | Inserção, navegação e edição de notas de rodapé em ensaios e capítulos | `.obsidian/community-plugins.json` + `.obsidian/plugins/obsidian-footnotes/data.json`; sem atalhos personalizados por enquanto |
| Linter | Formatação manual com escopo limitado aos arquivos Markdown em `meta/`; preview antes de aplicar | `.obsidian/plugins/obsidian-linter/data.json`; lint automático desligado, arquivos fora de `meta/` e pastas de conteúdo ignorados |
| Meta Bind | Plugin instalado; integração de botões suspensa porque a configuração é rejeitada pelo validador 1.5.1 | Links Advanced URI no painel; sem blocos Meta Bind ativos até corrigir a compatibilidade |
| Day Planner | Linha do tempo diária ligada às tarefas programadas no template Templater e ao Tasks; sem calendários externos cadastrados | `.obsidian/plugins/obsidian-day-planner/`; tarefas usam intervalos `HH:mm - HH:mm` |
| Periodic Notes | Criação sob demanda de notas semanais e mensais; notas diárias continuam no recurso nativo | `.obsidian/plugins/periodic-notes/data.json`; modelos `templater/weekly-review.md` e `templater/monthly-review.md`; destinos `periodic/weekly/` e `periodic/monthly/` |
| LanguageTool Integration | Revisão gramatical manual em português brasileiro | `.obsidian/plugins/obsidian-languagetool-plugin/data.json`; autocheck desligado; endpoint público padrão, que recebe o texto quando uma verificação é solicitada |
| Omnisearch | Busca geral tolerante a erros e ranqueada em notas Markdown | Plugin `omnisearch`; indexação de PDFs e imagens desligada |
| Tasks | Consulta geral e marcação de tarefas no arquivo de origem | Plugin `obsidian-tasks-plugin`; consulta no painel de estudo |
| Local Backup | Backup compactado do vault completo fora do vault | Plugin `local-backup`; destino `/home/alelinux/Backups/Obsidian/historia` |
| `dataview/` | Painel de estudo e formulário de busca | Blocos Dataview e `dv.view(...)` |
| `scripts/` | Verificação técnica executável pelo Node.js | `node meta/scripts/check-backend.js` |
| `sugestoes-plugins.md` | Lista priorizada de integrações candidatas, dependências e ressalvas | Avaliação antes da instalação de novos plugins |
| `attachments/` | Imagens extraídas de anotações Zotero | Caminho `imageOutputPathTemplate` do Zotero Integration |
| `backups/zotero/` | Snapshots pré-importação e cópias de segurança pré-restauração | QuickAdd: backup/restauração Zotero |
| `reports/` | Resultado mais recente do verificador automático | `javascript/backend-check-runner.js` |

## Atalhos de uso diário

- **Abrir nota de hoje** usa o plugin nativo Notas Diárias, que cria o arquivo quando necessário; o Templater aplica o modelo já configurado para `daily/`.
- **Retomar leitura** lista as obras ativas, abre a selecionada e mostra `reading-position::` (ou `page-no::`) junto de `next-reading-step::`.
- **Registrar continuidade da leitura** usa o formulário `registrar-continuidade-leitura` do Modal Forms; posição e próximo passo são pré-preenchidos e atualizam apenas esses campos.
- **Concluir leitura da obra** é uma ação separada: seleciona uma leitura ativa, pede confirmação explícita e grava a data em `end-date::`, conforme a Fase 5 do fluxo de estudos.
- **Adicionar tarefa à nota de hoje** usa um formulário Modal Forms com os blocos presentes naquele dia e insere a tarefa na seção escolhida. Um horário opcional no formato `HH:mm - HH:mm` a coloca também na linha do tempo do Day Planner; sem horário, continua como checklist.
- **Abrir fonte do Zettel** segue o link `**Fonte:**` para a nota bibliográfica.
- **Extrair Zettel da seleção** abre a nota recém-criada e posiciona o cursor no início da síntese.
- **Buscar referência Zotero** pesquisa por citekey, título, autor ou publicação nas notas bibliográficas importadas em `01_notes/`.
- O Footnote Shortcut cria e navega notas de rodapé pela paleta de comandos; não há atalho próprio atribuído ainda. `insertAtEndOfWord` e a correção automática de posição da pontuação estão desativados para permitir inserir a chamada antes da pontuação, conforme o padrão de escrita em português. Lint ao salvar e ao criar rodapé também está desligado; o lint manual continua disponível, mas não move referências para depois da pontuação. A nota temporária `meta/footnote-shortcut-test.md` guarda o roteiro de validação interativa.
- O Linter está configurado para aceitar apenas arquivos `.md` sob `meta/`: regex de exclusão para todos os caminhos fora de `meta/` e para arquivos não Markdown, mais exclusões explícitas de `01_notes/`, `02_zettel/` e `daily/`. Lint ao salvar e ao trocar de arquivo ficam desligados; a prévia de diff está ligada. Todas as regras de transformação começam desativadas e devem ser habilitadas uma a uma após comparação numa cópia de template. Não usar os comandos de lint em lote.
- O Meta Bind permanece instalado, mas os blocos `meta-bind-button` foram suspensos: a versão 1.5.1 rejeitou a configuração e gerou erros no console. O painel usa links Advanced URI funcionais para as mesmas ações. O protótipo registra o erro e não contém blocos executáveis; não associar `reading-position::` nem `next-reading-step::` a campos YAML.
- A Local REST API with MCP ainda não foi ativada: a sessão não encontrou Obsidian em execução nem listener local em `27123`/`27124`, então não foi possível confirmar a condição de cliente Codex e Obsidian na mesma máquina ou gerar e proteger o token. `.obsidian/` continua fora do escopo da API.
- Day Planner 0.35.1 está ativo com Daily Notes e Tasks, sem calendários online. O template diário programa refeições, estudo, currículos, movimento, tarefas domésticas e fechamento em blocos horários flexíveis. Para variar um dia, ajuste a tarefa naquela nota; não é necessário transformar o horário em compromisso rígido.
- Periodic Notes 0.0.17 está configurado para criar notas semanais (`gggg-[W]ww`) e mensais (`YYYY-MM`) somente quando seus comandos forem chamados. Elas vão para `periodic/weekly/` e `periodic/monthly/`, cada uma com template próprio em `meta/templater/`. A configuração de Daily Notes nativa continua apontando para `daily/`, evitando que o template diário seja aplicado às revisões.
- LanguageTool Integration 0.4.3 usa português do Brasil, com autocheck e ícone de ribbon desligados. O endpoint é `https://api.languagetool.org`; o plugin só transmite o texto quando o usuário executar uma revisão manual. As notas não são enviadas automaticamente.
- Os atalhos de painel para Day Planner e revisões semanal/mensal chamam comandos registrados pelos plugins. A revisão semanal/mensal cria sua nota sob demanda usando os modelos de `meta/templater/`.
- A homepage do Notebook Navigator abre `meta/dataview/dashboard-ir-srs.md`; o plugin Homepage separado não é necessário.
- O painel começa pelas ações frequentes (rotina, leitura e Zettels) e agrupa busca, navegação, agenda e revisões em seguida. O painel também oferece resumo de tarefas do dia, pendências gerais e diagnósticos de leitura/Zettels.
- O calendário do Notebook Navigator usa o plugin nativo Notas Diárias como fonte de verdade para a pasta `daily/`; o Templater aplica o modelo dessa pasta quando uma nota é criada pelo calendário. O plugin Calendar separado foi desativado para evitar dois calendários concorrentes.
- A seção **Pendências no vault** do painel lista tarefas abertas do Tasks; marcar uma tarefa nessa consulta atualiza sua nota de origem.
- Para limpar trechos copiados de PDFs, selecione o texto e execute **Join wrapped lines**, **Dehyphenate**, **Strip invisible characters**, **Replace ligatures** ou **Tidy note** na paleta do Text Case and Cleanup. Atalhos: `Ctrl/Cmd + Alt + J` junta linhas selecionadas e `Ctrl/Cmd + Alt + H` remove hifenização de quebra de linha. A limpeza automática ao colar está desativada; “Tidy note” pede confirmação, preserva quebras duras e não junta linhas automaticamente. As operações são manuais e podem ser desfeitas.
- Omnisearch complementa a busca bibliográfica focada em notas de literatura com busca geral no Markdown do vault. PDF e imagem estão desativados, e o Text Extractor foi removido por não haver necessidade de OCR no vault.
- O conflito de sincronização de plugins de 2026-09-08 foi arquivado em `reports/archive/community-plugins-conflict-20260908.json`; a lista ativa atual foi mantida, sem instalar `marker-api` nem `smart-connections` que apareciam apenas no snapshot conflitante.
- Local Backup cria um backup na inicialização, mantém até 30 dias e até 3 arquivos por dia; backups por intervalo e empacotadores externos permanecem desativados.
- Atalhos globais: `Ctrl/Cmd + Shift + D` abre a nota diária; `Ctrl/Cmd + Shift + R` retoma leitura; `Ctrl/Cmd + Shift + E` registra continuidade; `Ctrl/Cmd + Alt + T` captura tarefa; `Ctrl/Cmd + Shift + O` abre a fonte do Zettel; `Ctrl/Cmd + Shift + Z` busca referências. A conclusão de obra fica no painel ou na paleta para reduzir risco de acionamento acidental. As teclas ficam em `.obsidian/hotkeys.json`.

## Fluxos

### Leitura

- O estado atual da continuidade fica na nota da obra em `01_notes/`: `reading-position::` e `next-reading-step::`. A ação de registrar continuidade não modifica `end-date::`; concluir a obra exige confirmação e é um comando separado.
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
