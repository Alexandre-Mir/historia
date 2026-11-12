Este documento consolida o fluxo de trabalho do vault `historia`, integrando a captura do Zotero, leitura incremental, atomização Zettelkasten, evolução orgânica das notas e escrita incremental. As skills metodológicas (somente leitura, ver `AGENTS.md`) são acionadas por demanda em pontos marcados com 🧭.

## O Ciclo Diário Passo a Passo

### Fase 1: Captura & Fichamento (Zotero ➔ Obsidian)

1. Faço a leitura incremental no Zotero (PDFs, livros, artigos), destacando trechos importantes e adicionando comentários.
2. No Obsidian, importo ou sincronizo as anotações via Zotero Desktop Connector.
3. O arquivo gerado é salvo em `01_notes/` com a ficha bibliográfica e a seção `%% begin annotations %%`.
    1. O template é `/meta/zotero/research note.md`, cuja seção de conexões se chama `## Connections`.
4. A data de adição (`start-date::`) é preenchida automaticamente no cabeçalho.

---

### Fase 2: Atomização & Gatekeeper (Zettelkasten)

0. 🧭 **Forager (opcional):** peço a `zettelkasten-forager` que eleja **um** candidato na nota. Ele devolve âncora, padrão e uma pergunta-guia. Respondo à pergunta **sem consultar o PDF** antes de extrair.
1. Depois de importada a research note, seleciono-a e pressiono `Ctrl + N (work with notes)`, que carrega o layout de trabalho com Grafo Local, Links Inversos e Sumário, mantendo a nota aberta em foco.
2. Seleciono o trecho ou citação que contém a ideia central.
3. Pressiono `Alt+Z` (`zettel-extract`):
    1. O Obsidian abre uma caixa de diálogo: Título do Zettel Atômico.
    2. Digito um **título provisório** (semente). Posso usar uma formulação descritiva ou aproximada; **a revisão para um título proposicional (nível 3–4) é obrigatória**.
4. O que acontece automaticamente:
    1. Uma nova nota atômica é gerada em `02_zettel/<Título>.md`.
    2. O script gera o frontmatter: `type: zettel`, tag `#zettel`, `maturidade: semente`, `criado: AAAA-MM-DD`.
    3. A nota recebe `**Fonte:** [[Nome da Obra]]` e as seções `### Síntese`, citação `> [!important]` e `### Conexões`.
    4. Na nota de leitura original em `01_notes/`, a citação é substituída pelo link `[[Título do Zettel]]`.
5. Abro o novo Zettel em `02_zettel/`:
    1. Escrevo uma síntese com minhas próprias palavras.
    2. **Revejo o título** para a tese da nota.
    3. Adiciono conexões em `### Conexões` com outras ideias do cofre (`[[Conceito B]]`), explicando o nexo (causa, tensão, condição de possibilidade ou exemplificação), ou no corpo da síntese se a nota se encaixar semanticamente.
6. 🧭 **Supervisor (quando quiser auditar):** submeto o Zettel a `zettelkasten-supervisor` para veredito, nível de título e perguntas-guia.

---

### Fase 3: Evolução Orgânica dos Zettels

As notas amadurecem pelo uso e pelo contato com outras ideias:

1. Exploro o grafo local e os backlinks a partir do Zettel em que estou trabalhando.
2. Leio as notas conectadas e verifico quais relações, tensões ou diferenças ficam mais claras quando colocadas lado a lado.
3. Atualizo a síntese com minha compreensão atual, acrescento conexões com nexos explícitos e crio novos Zettels quando surgir uma ideia independente.
4. Retomo Zettels antigos em leituras cruzadas ou sessões de escrita; cada encontro pode aprofundar a rede e amadurecer as notas.
5. **Eu mesmo promovo a maturidade** (`semente` ➔ `desenvolvimento` ➔ `madura`) editando o campo do frontmatter. O Supervisor pode opinar, mas não decide nem altera.

---

### Fase 4: Incremental Writing (Escrita Incremental e Síntese)

O Incremental Writing atua tanto na escala micro (notas) quanto macro (MOCs e ensaios):

1. Micro-Writing (Refinamento de Zettels):
    1. Ao reencontrar uma nota de `02_zettel/` pelo grafo, backlinks, leitura cruzada ou escrita, aproveito alguns minutos para reescrever, aprimorar termos e adicionar conexões com nexos explícitos, se necessário.
2. Macro-Writing:
    1. 🧭 **Cartographer:** quando sinto que um tema acumulou notas, peço a `zettelkasten-cartographer` que identifique o cluster. Ele considera notas `desenvolvimento` e `madura` com mais de um tipo de nexo; sem massa crítica (10 a 15), devolve o diagnóstico de fallback.
    2. **MOCs** (`00_MOCs/`) são mapas de rotas entre Zettels. **Ensaios** (`99_ensaios/`) são o texto argumentativo; o MOC antecede e alimenta o ensaio.
    3. Projetos de escrita longos (artigos, capítulos, ensaios) recebem a tag `#escrita` e entram na fila do **Incremental Writing**.
    4. A cada ciclo da fila, não tento terminar o texto de uma vez:
        1. Adiciono novos links de `02_zettel/` relevantes.
        2. Escrevo 1 ou 2 parágrafos de transição entre ideias.
        3. O texto cresce de forma acumulativa, sem o bloqueio da folha em branco.

---

### Fase 5: Conclusão de uma Obra (Fechamento do Hub)

Quando terminar de ler todos os trechos de um livro ou artigo em `01_notes/`:

1. Preencho o campo `end-date:: AAAA-MM-DD` na seção `## Index`.
2. Minha nota em `01_notes/` agora é um Hub de Literatura Permanente, composta pelos links atômicos dos conceitos gerados.

---

## 🧭 Mapa de Acionamento das Skills

|Fase|Skill|Quando|
|---|---|---|
|2 (antes do `Alt+Z`)|`zettelkasten-forager`|Não sei qual trecho atomizar; quero 1 candidato e uma pergunta-guia|
|2 (após a síntese) / 3|`zettelkasten-supervisor`|Quero auditar título, atomicidade, síntese, nexos ou prontidão|
|4|`zettelkasten-cartographer`|Quero saber qual cluster está pronto para virar MOC|

---

## ⌨️ Atalhos Rápidos Cadastrados

|Tecla de Atalho|Ação|Descrição|
|:--|:--|:--|
|**`Ctrl+N`**|`work with notes`|Abre o workspace de trabalho sincronizado com a nota ativa.|
|**`Alt+Z`**|`extrair zettel`|Extrai o texto selecionado para `02_zettel/` com frontmatter, título provisório e link na fonte.|
|**`Ctrl+S`**|`search research notes`|Busca avançada de fichamentos e notas de pesquisa bibliográfica.|
|**`Ctrl+K`**|`extract research note`|Extração de nota de pesquisa com cabeçalho bibliográfico completo.|