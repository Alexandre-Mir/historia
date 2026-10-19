module.exports = async ({ app }) => {
  const { join } = require("path");
  const backupsPath = join(app.vault.adapter.basePath, "meta", "javascript", "zotero-backups.js");
  const { createSnapshot } = require(backupsPath);
  const result = await createSnapshot(app);
  const retention = result.movedToTrash
    ? `; ${result.movedToTrash} backup(s) antigo(s) movido(s) à lixeira`
    : "";
  new Notice(`Backup Zotero criado: ${result.count} arquivos em ${result.root}${retention}`);
};
