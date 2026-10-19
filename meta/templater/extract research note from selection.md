<%*
const selection = tp.file.selection();
if (!selection?.trim()) {
    new Notice("Selecione algum texto antes de rodar o comando.");
    return;
}

const title = await tp.system.prompt("Título da nova nota");
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

const path = `01_notes/${fileName}.md`;
if (tp.app.vault.getAbstractFileByPath(path)) {
    new Notice(`Já existe uma nota em 01_notes com o nome “${fileName}”.`);
    return;
}

const header = tp.user.header(tp);
if (!header) {
    new Notice('A nota ativa não contém a seção "## Note" esperada.');
    return;
}

try {
    const created = await tp.file.create_new(header + selection, fileName, false, "01_notes");
    if (!created) {
        new Notice("O Templater não conseguiu criar a nota em 01_notes.");
        return;
    }
    await tp.file.cursor_append(`[[${fileName}]]`);
} catch (error) {
    new Notice(`Não foi possível criar a nota em 01_notes: ${error.message}`);
}
%>
