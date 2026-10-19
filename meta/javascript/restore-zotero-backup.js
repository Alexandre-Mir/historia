module.exports = async ({ app }) => {
  const { FuzzySuggestModal } = require("obsidian");
  const { listSnapshots, restoreSnapshot } = require("./zotero-backups");
  const snapshots = await listSnapshots(app);

  if (!snapshots.length) {
    new Notice("Nenhum backup Zotero disponível para restauração.");
    return;
  }

  const selected = await new Promise((resolve) => {
    class SnapshotPicker extends FuzzySuggestModal {
      getItems() {
        return snapshots;
      }

      getItemText(snapshot) {
        const date = snapshot.manifest.createdAt ?? snapshot.root.split("/").at(-1);
        const label = snapshot.manifest.label ?? "Backup Zotero";
        return `${date} · ${label} · ${snapshot.manifest.files.length} arquivos`;
      }

      onChooseItem(snapshot) {
        resolve(snapshot);
      }

      onClose() {
        resolve(null);
      }
    }

    new SnapshotPicker(app).open();
  });

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
