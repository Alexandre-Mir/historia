<%*
const selection = tp.file.selection();
if (!selection) {
    new Notice("Selecione algum texto antes de rodar o comando.");
    return;
}

const title = await tp.system.prompt("Título da nova nota");
if (!title) return;

const fileName = title.replace(/[\\/:*?"<>|#^\[\]]/g, "-").trim();

await tp.file.create_new(tp.user.header(tp) + selection, fileName, false);
await tp.file.cursor_append("[[" + fileName + "]]");
%>