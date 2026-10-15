Este documento consolida o fluxo de trabalho do vault `historia`, integrando a captura do Zotero, leitura incremental, atomização Zettelkasten, evolução orgânica das notas e escrita incremental.

## O Ciclo Diário Passo a Passo

### Fase 1: Captura & Fichamento (Zotero ➔ Obsidian)
1. Faço a leitura incremental no **Zotero** (PDFs, livros, artigos), destacando trechos importantes e adicionando comentários.
2. No Obsidian, importo ou sincronizo as anotações via **Zotero Desktop Connector**.
3. O arquivo gerado é salvo na pasta `01_notes/` com a ficha bibliográfica e a seção `%% begin annotations %%`.
	1. O arquivo responsável pelo template do arquivo salvo em `01_notes/` é o `/meta/zotero/research note.md`
4. A data de adição (`start-date::`) é preenchida automaticamente no cabeçalho.

---

### Fase 2: Atomização & Gatekeeper (Zettelkasten)
1. Depois de importado a research note, seleciono-a e pressiono `Ctrl + N (work with notes)`, que carrega o layout de trabalho com Grafo Local, Links Inversos e Sumário, mantendo a nota aberta em foco.
2. **Seleciono o trecho ou citação** que contém a ideia central.
3. Pressiono **`Alt+Z`** (`zettel-extract`):
	1. O Obsidian abrirá uma caixa de diálogo: *Título do Zettel Atômico*.
	2. Digito um título conceitual claro e expressivo, que transmita a ideia atômica da nota.
4. **O que acontece automaticamente:**
	1. Uma nova nota atômica é gerada em `02_zettel/<Título>.md`.
	2. A nova nota recebe a tag `#zettel` e a referência `**Fonte:** [[Nome da Obra]]`.
	3. Na nota de leitura original em `01_notes/`, **a citação é substituída pelo link** `[[Título do Zettel]]`.
5. Abro o novo Zettel em `02_zettel/`:
	1. **Escrevo uma síntese com minhas próprias palavras**
	2. Adiciono conexões na seção `### Conexões` com outras ideias já existentes no seu cofre (`[[Conceito B]]`) ou no corpo da sintese se a nota referenciada encaixar semanticamente.

---

### Fase 3: Evolução Orgânica dos Zettels
As notas amadurecem pelo uso e pelo contato com outras ideias:
1. Exploro o grafo local e os backlinks a partir do Zettel em que estou trabalhando.
2. Leio as notas conectadas e verifico quais relações, tensões ou diferenças ficam mais claras quando colocadas lado a lado.
3. Atualizo a síntese com minha compreensão atual, acrescento conexões com nexos explícitos e crio novos Zettels quando surgir uma ideia independente.
4. Retomo Zettels antigos durante leituras cruzadas ou sessões de escrita; cada encontro pode aprofundar a rede e amadurecer as notas.

---

### Fase 4: Incremental Writing (Escrita Incremental e Síntese)
O Incremental Writing atua tanto na escala micro (notas) quanto macro (ensaios):
1. **Micro-Writing (Refinamento de Zettels):**
	1. Ao reencontrar uma nota de `02_zettel/` pelo grafo, backlinks, leitura cruzada ou escrita, aproveito alguns minutos para reescrever, aprimorar termos e adicionar conexões com nexos explícitos se acho necessário.
2. **Macro-Writing (Ensaios e MOCs):**
	1. Projetos de escrita longos (como artigos, capítulos ou ensaios em andamento) recebem a tag `#escrita` e entram na fila do **Incremental Writing**.
	2. A cada ciclo da fila, não tento terminar o texto de uma vez:
		1. Adiciono novos links de `02_zettel/` relevantes.
		2. Escrevo 1 ou 2 parágrafos de transição entre ideias.
		3. O texto cresce de forma acumulativa e sem o bloqueio da folha em branco.

---

### Fase 5: Conclusão de uma Obra (Fechamento do Hub)
Quando terminar de ler todos os trechos de um livro ou artigo em `01_notes/`:
1. Preencho o campo `end-date:: AAAA-MM-DD` na seção `## Index`.
2. Minha nota em `01_notes/` agora é um **Hub de Literatura Permanente**, composta pelos links atômicos dos conceitos gerados.

---

## ⌨️ Atalhos Rápidos Cadastrados

| Tecla de Atalho | Ação | Descrição |
| :--- | :--- | :--- |
| **`Ctrl+N`** | `work with notes` | Abre o workspace de trabalho sincronizado com a nota ativa. |
| **`Alt+Z`** | `extrair zettel` | Extrai o texto selecionado para `02_zettel/` e insere o link na fonte. |
| **`Ctrl+S`** | `search research notes` | Busca avançada de fichamentos e notas de pesquisa bibliográfica. |
| **`Ctrl+K`** | `extract research note` | Extração de nota de pesquisa com cabeçalho bibliográfico completo. |
