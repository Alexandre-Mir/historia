<%*
const selection = tp.file.selection();
if (!selection?.trim()) {
    new Notice("Selecione algum texto antes de extrair o Zettel.");
    return;
}

const title = await tp.system.prompt("Título do Zettel Atômico");
if (!title) return;

const fileName = title
    .trim()
    .replace(/\.md$/i, "")
    .replace(/[\\/:*?"<>|#^\[\]]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/, "");
if (!fileName) {
    new Notice("O título não resultou em um nome de arquivo válido.");
    return;
}
if (fileName.length > 180) {
    new Notice("O título é longo demais para usar como nome de arquivo.");
    return;
}

const path = `02_zettel/${fileName}.md`;
if (tp.app.vault.getAbstractFileByPath(path)) {
    new Notice(`Já existe um Zettel com o título “${fileName}”.`);
    return;
}
const sourceTitle = tp.file.title;
const nowDateTime = tp.date.now("YYYY-MM-DD HH:mm");
// Cada linha da seleção vira citação Markdown, preservando trechos multilinha.
const quotedSelection = selection
    .split("\n")
    .map(line => `> ${line}`)
    .join("\n");

// Estrutura padrão da nota atômica
const noteContent = `---
created: ${nowDateTime}
type: zettel
maturidade: semente
tags:
  - zettel
---
### Síntese

> [!important] Trecho de origem
${quotedSelection}

### Conexões
- <!-- Explique em uma frase como esta ideia se relaciona à nota linkada. -->

---
**Fonte:** [[${sourceTitle}]]
`;

// Cria o novo Zettel antes de substituir o trecho de origem.
try {
    const created = await tp.file.create_new(noteContent, fileName, false, "02_zettel");
    if (!created) {
        new Notice("O Templater não conseguiu criar o Zettel em 02_zettel.");
        return;
    }
    await tp.file.cursor_append(`[[${fileName}]]`);
    await tp.app.workspace.getLeaf(false).openFile(created);
    const editor = tp.app.workspace.activeLeaf?.view?.editor;
    if (editor) {
        const content = await tp.app.vault.read(created);
        const synthesisLine = content.split(/\r?\n/).findIndex(line => line.trim() === "### Síntese");
        if (synthesisLine >= 0) {
            editor.setCursor({ line: synthesisLine + 1, ch: 0 });
            editor.focus();
        }
    }
} catch (error) {
    new Notice(`Não foi possível criar o Zettel: ${error.message}`);
    return;
}
new Notice("Zettel criado com sucesso em 02_zettel!");
%>
