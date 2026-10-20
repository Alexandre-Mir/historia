# Plugins candidatos para o vault

Lista de possibilidades para avaliar antes de instalar. O objetivo é acrescentar fluidez ao fluxo de pesquisa, escrita e rotina, evitando duplicar ferramentas que o vault já usa.

## Direção do fluxo

- Os PDFs permanecem no Zotero; não priorizar plugins que dependam de copiar PDFs para o vault.
- Zotero Annotations e Zotero Annotation Citations foram rejeitados pelo usuário; não reapresentar como recomendações prioritárias.
- Periodic Notes despertou interesse para revisões semanais/mensais.
- Avaliar cada plugin com uma tarefa real e observar dependências, privacidade, manutenção e alterações que ele faz nas notas.

## Sugestões anteriores

| Plugin | Uso possível no vault | Dependências e ressalvas | Referência |
|---|---|---|---|
| **Various Complements** | Completar termos recorrentes enquanto se escreve, reduzindo interrupções para procurar nomes e conceitos. | Configurar as fontes de sugestão para evitar excesso de sugestões irrelevantes. | [Página oficial](https://community.obsidian.md/plugins/various-complements) |
| **Excalidraw** | Criar mapas conceituais, cronologias e diagramas de atores ligados às notas. | Ferramenta visual ampla; vale começar com um diagrama pequeno. | [Página oficial](https://community.obsidian.md/plugins/obsidian-excalidraw-plugin) |
| **Footnote Shortcut** | Inserir e numerar notas de rodapé automaticamente ao redigir ensaios. | Bom encaixe para escrita historiográfica; pode atribuir prefixos por capítulo ao compilar textos longos. | [Página oficial](https://community.obsidian.md/plugins/obsidian-footnotes) |
| **LanguageTool Integration** | **Instalado 0.4.3.** Revisão manual de texto em português brasileiro. | Autocheck desligado. Usa o endpoint público `api.languagetool.org`; somente o texto selecionado ou nota verificada manualmente é transmitido. O servidor pode ser trocado por um local depois. | [Página oficial](https://community.obsidian.md/plugins/obsidian-languagetool-plugin) |
| **Periodic Notes** | **Instalado 0.0.17 estável.** Cria revisões semanais e mensais por comando, usando templates dedicados. | Sem periodicidade automática. Notas diárias nativas permanecem inalteradas. A versão estável publicada é antiga; monitorar compatibilidade após atualizar o Obsidian. | [Página oficial](https://community.obsidian.md/plugins/periodic-notes) |

## Novas sugestões

| Plugin | Ideia de integração | Dependências e ressalvas | Referência |
|---|---|---|---|
| **Day Planner** | **Instalado 0.35.1.** Linha do tempo e time tracking integrados a Daily Notes e Tasks. | Tarefas atuais permanecem intactas. Para ver um bloco agendado, adicionar horário ou data `scheduled`; calendários externos não foram configurados. | [Página oficial](https://community.obsidian.md/plugins/obsidian-day-planner) |
| **ExcaliBrain** | Explorar as relações entre leituras e Zettels como um mapa navegável: pais, filhos, notas relacionadas e notas irmãs. | Requer Dataview e Excalidraw; o segundo ainda não está instalado. A qualidade do mapa depende dos links existentes e de metadados consistentes. | [Página oficial](https://community.obsidian.md/plugins/excalibrain) |
| **Hover Editor** | Abrir uma prévia editável de uma nota ao passar sobre seu link, consultar uma fonte e voltar ao Zettel sem trocar de aba. | Usa partes internas do Obsidian que não fazem parte da API pública; atualizações do Obsidian podem quebrar o plugin. | [Página oficial](https://community.obsidian.md/plugins/obsidian-hover-editor) |
| **Unified Outliner** | Navegar por títulos e listas como uma estrutura única; localizar, reorganizar ou editar uma seção focada sem perder o contexto do texto. | Ações estruturais alteram Markdown. O plugin oferece aplicação explícita e proteção contra conflitos; experimentar primeiro em uma cópia. | [Página oficial](https://community.obsidian.md/plugins/unified-outliner) |
| **Meridian Timeline** | Montar cronologias navegáveis de notas de eventos, com períodos, datas aproximadas e referências às notas de origem. | Melhor quando há notas de eventos com datas próprias; `start-date`/`end-date` das leituras representam o progresso de leitura, não datas históricas. O serviço usa operações pagas após a franquia inicial. | [Página oficial](https://community.obsidian.md/plugins/meridian-timeline) |

## Mais sugestões — pesquisa histórica e navegação

| Plugin | Ideia de integração | Dependências e ressalvas | Referência |
|---|---|---|---|
| **Live Canvas** | Gerar um mapa Canvas sincronizado a partir de uma pasta ou tag, mostrando notas selecionadas e suas relações. Um Canvas específico para um tema pode reunir Zettels e leituras sem modificar os arquivos Markdown. | Plugin recente e ainda pouco adotado. Escreve no Canvas configurado; preserva posições e itens manuais segundo a documentação. Começar com um Canvas novo e uma tag pequena. | [Página oficial](https://community.obsidian.md/plugins/live-canvas) |
| **Timeline Canvas** | Comparar processos históricos em faixas paralelas — por exemplo, acontecimentos políticos, sociais e intelectuais — sobre o mesmo eixo temporal. | Exige posicionar cartões manualmente e gera arquivos Canvas e SVG. É uma cronologia visual, não uma extração automática de datas das notas. | [Página oficial](https://community.obsidian.md/plugins/timeline-canvas) |
| **TimeLineX** | Visualizar notas de eventos numa linha do tempo filtrável; permite períodos com data inicial/final e calendários diferentes. | Requer propriedades `date` e `timeline` nas notas de eventos. Não aplicar essas propriedades às notas de leitura por causa do significado próprio de `start-date`/`end-date`; adoção e histórico de atualizações são modestos. | [Página oficial](https://community.obsidian.md/plugins/timelinex) |
| **Better Backlinks** | Consultar, dentro de um Zettel, os parágrafos completos das notas que o citam; também reúne menções sem link e tarefas relacionadas. | Pode duplicar a seção inferior do plugin Backlinks nativo; desativar essa seção nativa se instalar. Tratar menções sem link como sugestões, pois transformar uma menção em wikilink implica uma decisão conceitual. | [Página oficial](https://community.obsidian.md/plugins/better-backlinks) |

## Integrações em avaliação — homepage, edição e acesso por IA

| Plugin | Integração proposta para este vault | Compatibilidade e limites | Referência |
|---|---|---|---|
| **Homepage** | Definir `meta/dataview/dashboard-ir-srs.md` como nota inicial do Obsidian. Ela já reúne rotina do dia, tarefas, leituras ativas, links QuickAdd e busca Zotero; Homepage só a abre no início e mantém disponível um comando/ribbon para voltar a ela. | Notebook Navigator já tem opção própria de homepage, atualmente `source: none`. Manter essa opção inativa evita duas páginas iniciais concorrentes. Não é necessário criar outro dashboard. | [Página oficial](https://community.obsidian.md/plugins/homepage) |
| **Linter** | **Instalado e habilitado (1.34.2).** Formatação manual com filtro positivo para apenas `.md` sob `meta/`, preview de diff e sem execução em salvar/troca de nota. | Todas as regras começam desligadas. Não usar lint em lote. Habilitar cada regra em cópia de template e inspecionar diferenças antes de qualquer aplicação real. Versão exige Obsidian 1.13.0+. | [Página oficial](https://community.obsidian.md/plugins/obsidian-linter) · [Escopo e regex](https://platers.github.io/obsidian-linter/usage/disabling-rules/) |
| **Meta Bind** | **Instalado e habilitado (1.5.1), mas integração suspensa.** O validador rejeitou os blocos de botão no painel e no protótipo. | Os blocos executáveis foram removidos para eliminar erros no console; o painel mantém links Advanced URI para as mesmas ações. Retomar apenas com configuração aceita pelo validador em execução. Não migrar `reading-position::` nem `next-reading-step::` para YAML. | [Página oficial](https://community.obsidian.md/plugins/obsidian-meta-bind-plugin) · [Botões](https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/) · [Ação de comando](https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/command/) |
| **Local REST API with MCP** | Manter como integração proposta de leitura/listagem/busca para Codex local. | **Não instalado nem configurado.** Não há Obsidian em execução ou serviço local nesta sessão, então não foi possível confirmar que Codex e Obsidian estão na mesma máquina nem gerar/proteger o token. Reavaliar quando a instância local estiver aberta; API bloqueia `.obsidian/` e deve permanecer presa ao loopback. | [Página oficial](https://community.obsidian.md/plugins/obsidian-local-rest-api) · [Documentação da API/MCP](https://coddingtonbear.github.io/obsidian-local-rest-api/) |


## Revisão estrutural e plano de implementação

### Decisão principal

**Etapa inicial concluída: Footnote Shortcut.** O plugin está instalado e habilitado, sem atalho personalizado; o teste interativo em Obsidian permanece pendente.

**Homepage não deve ser instalado por enquanto.** O Notebook Navigator atual já oferece homepage configurável e comando para abri-la; basta apontar esse recurso ao painel existente `meta/dataview/dashboard-ir-srs.md`. Isso entrega o resultado com menos um plugin e sem manter dois mecanismos de inicialização. A configuração atual está em `homepage.source: none`.

### Etapas anteriores e estado atual

| Ordem | Ação | Escopo e critério para avançar |
|---|---|---|
| **0 — usar recurso existente** | Configurar a homepage do Notebook Navigator para abrir `meta/dataview/dashboard-ir-srs.md`. | Preservar a disposição de abas existente; conferir que Dataview, Tasks e QuickAdd carregam no painel ao iniciar. Não instalar Homepage. |
| **1 — Footnote Shortcut** | Instalado e habilitado na lista de plugins, versão 0.2.0. A configuração deixa a inserção automática no fim da palavra desativada, permitindo colocar o marcador antes da pontuação; lint ao salvar/criar e a correção manual de pontuação estão desligados. | O uso interativo ainda precisa ser validado quando o Obsidian desktop for reaberto. A nota temporária `meta/footnote-shortcut-test.md` prepara os passos para testar inserção, navegação, edição e desfazer. Não há atalho personalizado atribuído. |
| **2 — Linter** | Adicionar formatação manual restrita a arquivos técnicos em `meta/`. | Excluir `01_notes/`, `02_zettel/` e `daily/`; não ligar lint ao salvar nem executar em lote no vault. Ativar regras uma a uma em cópias de templates e revisar diferenças antes de aplicar aos arquivos reais. |
| **3 — Meta Bind** | Experimentar botões no painel para chamar comandos QuickAdd que já existem. | Ao testar no Obsidian, a versão 1.5.1 rejeitou os blocos. Os botões foram removidos; manter os links Advanced URI até encontrar configuração validada. Não vincular campos inline de leitura a YAML. |
| **4 — Local REST API with MCP** | Conectar o Codex local ao Obsidian por MCP para consulta do vault. | Avançar apenas se Codex e Obsidian estiverem na mesma máquina. Começar com lista/leitura/busca, proteger o token fora do vault, manter `.obsidian/` inacessível e não expor a porta à rede. Avaliar escrita e execução de comandos em etapa separada. |
| **5 — plugins condicionais** | Reavaliar Day Planner, Periodic Notes, LanguageTool, Various Complements, Hover Editor, Unified Outliner, visualização de grafos e cronologias. | Day Planner, Periodic Notes e LanguageTool Integration foram instalados nesta etapa por autorização do usuário. Os demais continuam condicionados a um caso de uso concreto. Para cronologias, primeiro estabelecer notas de eventos e datas. |

### Resultado das etapas 2–5 (2026-10-19)

- **Linter:** instalado e restrito a Markdown em `meta/` com regex; `lintOnSave` e `lintOnFileChange` desligados; preview ligado; `01_notes/`, `02_zettel/` e `daily/` explicitamente ignorados. Nenhuma nota nem template real foi formatado. Como a sessão não tem interface Obsidian aberta, a ativação gradual das regras e comparação em cópias ainda depende da validação interativa.
- **Meta Bind:** instalado, mas a execução real mostrou rejeição dos blocos de botão pelo validador da versão 1.5.1. Os blocos foram retirados do painel e do protótipo; links Advanced URI continuam como ações de uso diário. O check-backend impede a reintrodução acidental de blocos não validados.
- **Local REST API with MCP:** adiada por condição local não confirmada. Não iniciar servidor, criar chave nem modificar configuração do Codex até que o Obsidian local esteja aberto e seja possível configurar acesso somente leitura/local.
- **Candidatos condicionais restantes:** Various Complements pode reduzir interrupções ao escrever termos recorrentes; testar somente depois de reunir um vocabulário real de nomes/conceitos. Hover Editor tem risco de compatibilidade por depender de APIs internas; Unified Outliner deve ser experimentado numa cópia de ensaio. Grafos e cronologias continuam adiados até existir um projeto específico de eventos/datas; não instalar várias ferramentas visuais sobrepostas.
- **Plugins condicionais instalados neste ciclo:** Day Planner, Periodic Notes e LanguageTool Integration. A integração evita alterar horários do cotidiano por suposição e deixa a revisão gramatical sob comando manual.
- **Day Planner:** ligado às notas diárias nativas e ao Tasks. A linha do tempo recebe tarefas com horário; nenhum horário foi acrescentado automaticamente ao template.
- **Periodic Notes:** semanal e mensal habilitados com destinos e templates separados de `daily/`; diário nativo preservado.
- **LanguageTool Integration:** autocheck desligado, variante pt-BR selecionada e revisão sob demanda no endpoint público padrão.
- **Candidatos ainda condicionais:** Various Complements pode reduzir interrupções ao escrever termos recorrentes; testar somente depois de reunir um vocabulário real de nomes/conceitos. Hover Editor tem risco de compatibilidade por depender de APIs internas; Unified Outliner deve ser experimentado numa cópia de ensaio. Grafos e cronologias continuam adiados até existir um projeto específico de eventos/datas; não instalar várias ferramentas visuais sobrepostas.

### Candidatos adiados ou redundantes

- **Homepage:** função já coberta pelo Notebook Navigator; configurar o recurso existente.
- **Better Backlinks:** ganho incremental sobre o Backlinks nativo; reavaliar apenas se faltar contexto dos trechos que apontam para um Zettel.
- **ExcaliBrain + Excalidraw, Live Canvas e cronologias (Meridian Timeline, Timeline Canvas, TimeLineX):** alternativas visuais que se sobrepõem parcialmente e exigem estrutura ou manutenção próprias. Não instalar em conjunto; escolher uma ferramenta só quando surgir um projeto temático de eventos ou conexões.
- **Meta Bind:** não usar para substituir propriedades inline de leitura. A integração de botões está suspensa até que sua configuração seja aceita pelo plugin instalado.
- **LanguageTool Integration:** instalado e limitado à revisão manual. O endpoint público recebe o texto submetido; pode ser trocado por um servidor próprio.
- **Periodic Notes:** instalado para revisões semanais e mensais sob demanda; a versão estável publicada é antiga, então conferir funcionamento após atualizações do Obsidian.
- **Omnisearch:** PDF/imagem desligados a pedido do usuário; o auxiliar Text Extractor foi removido.
- **Local REST API with MCP:** alto valor potencial para acesso ao vault em tempo real, mas maior privilégio e dependência de cliente local; por isso fica depois da integração de baixo risco.

### Limite desta revisão

As etapas foram autorizadas e as alterações concretas estão descritas acima. As verificações estáticas passam; a validação visual dos plugins (Footnote Shortcut, Meta Bind, Day Planner, Periodic Notes e LanguageTool) permanece pendente porque esta sessão não conseguiu iniciar o Obsidian: o processo encerrou ao procurar dispositivo DRM e o sandbox bloqueou a inicialização. O MCP também depende de confirmar a conexão local e configurar a chave no próprio plugin.

