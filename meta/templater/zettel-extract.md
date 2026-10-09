<%*
const selection = tp.file.selection();
if (!selection) {
    new Notice("Selecione algum texto antes de extrair o Zettel.");
    return;
}

const title = await tp.system.prompt("Título do Zettel Atômico");
if (!title) return;

const fileName = title.replace(/[\\/:*?"<>|#^\[\]]/g, "-").trim();
const sourceTitle = tp.file.title;
const nowDateTime = tp.date.now("YYYY-MM-DD HH:mm");
const nowDate = tp.date.now("YYYY-MM-DD");

// Conteúdo formatado da nova nota atômica
const noteContent = `---
created: ${nowDateTime}
type: zettel
tags:
  - zettel
  - review
  - seed
---
### Síntese

### Texto original
${selection}

### Conexões
- 

---
**Fonte:** [[${sourceTitle}]]
`;

// Cria a nova nota na pasta 02_zettel
await tp.file.create_new(noteContent, "02_zettel/" + fileName, false);

// Substitui a seleção na nota atual pelo link do Zettel criado
await tp.file.cursor_append("[[" + fileName + "]]");
new Notice("Zettel criado com sucesso em 02_zettel!");
%>