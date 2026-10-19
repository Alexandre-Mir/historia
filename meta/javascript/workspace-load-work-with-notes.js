module.exports = async (params) => {
  const { app } = params;
  const workspaceName = "work-with-notes";
  const vaultName = encodeURIComponent(app.vault.getName());

  const waitForLayoutChange = () =>
    new Promise((resolve) => {
      let eventRef;
      const timeout = window.setTimeout(() => {
        app.workspace.offref(eventRef);
        resolve();
      }, 2000);

      eventRef = app.workspace.on("layout-change", () => {
        window.clearTimeout(timeout);
        app.workspace.offref(eventRef);
        resolve();
      });
    });
  
  // 1. Salva o arquivo que está ativo no momento
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    new Notice("Nenhum arquivo ativo para abrir no workspace.");
    return;
  }

  // 2. Carrega o layout de trabalho e aguarda a alteração da estrutura de painéis.
  const layoutChange = waitForLayoutChange();
  window.open(
    `obsidian://advanced-uri?vault=${vaultName}&workspace=${workspaceName}`,
  );
  await layoutChange;

  // 3. Reabre a nota original no painel ativo após a troca do layout.
  const leaf = app.workspace.getLeaf(false);
  if (leaf) {
    await leaf.openFile(activeFile);
  }
};
