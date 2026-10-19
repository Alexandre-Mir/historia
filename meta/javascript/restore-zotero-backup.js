module.exports = async ({ app, quickAddApi }) => {
  const { join } = require("path");
  const backupsPath = join(app.vault.adapter.basePath, "meta", "javascript", "zotero-backups.js");
  const { listSnapshots, restoreSnapshot } = require(backupsPath);
  const snapshots = await listSnapshots(app);

  if (!snapshots.length) {
    new Notice("Nenhum backup Zotero disponível para restauração.");
    return;
  }

  const displayItems = snapshots.map((snapshot) => {
    const date = snapshot.manifest.createdAt ?? snapshot.root.split("/").at(-1);
    const label = snapshot.manifest.label ?? "Backup Zotero";
    return `${date} · ${label} · ${snapshot.manifest.files.length} arquivos`;
  });
  const selected = await quickAddApi.suggester(
    displayItems,
    snapshots,
    "Escolha um backup Zotero para restaurar",
  );

  if (!selected) return;
  const fileCount = selected.manifest.files.length;
  const accepted = window.confirm(
    `Restaurar ${fileCount} arquivos do backup ${selected.root}?\n\n` +
    "Os arquivos atuais serão copiados para um backup de segurança antes da restauração. " +
    "Arquivos criados depois do snapshot não serão apagados.",
  );
  if (!accepted) return;

  try {
    const result = await restoreSnapshot(app, selected);
    new Notice(
      `Backup restaurado (${result.restored} arquivos). Cópia de segurança: ${result.safetyCopy.root}`,
    );
  } catch (error) {
    console.error(error);
    new Notice(`Falha ao restaurar backup Zotero: ${error.message}`);
  }
};
