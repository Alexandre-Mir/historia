module.exports = async ({ app }) => {
  const { createSnapshot } = require("./zotero-backups");
  const result = await createSnapshot(app);
  const retention = result.movedToTrash
    ? `; ${result.movedToTrash} backup(s) antigo(s) movido(s) à lixeira`
    : "";
  new Notice(`Backup Zotero criado: ${result.count} arquivos em ${result.root}${retention}`);
};
