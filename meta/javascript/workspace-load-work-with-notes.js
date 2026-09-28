module.exports = async (params) => {
  const { app } = params;
  
  // 1. Salva o arquivo que está ativo no momento
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    new Notice("Nenhum arquivo ativo para abrir no workspace.");
    return;
  }

  // 2. Carrega o layout do workspace "work-with-notes" usando o plugin nativo de workspaces
  const workspacesPlugin = app.internalPlugins?.plugins?.workspaces?.instance;
  if (workspacesPlugin && workspacesPlugin.loadWorkspace) {
    await workspacesPlugin.loadWorkspace("work-with-notes");
  } else {
    // Fallback via Advanced URI se o plugin interno não estiver diretamente acessível
    window.open("obsidian://advanced-uri?vault=historia&workspace=work-with-notes");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // 3. Aguarda o DOM/painéis estabilizarem após carregar o layout
  await new Promise((resolve) => setTimeout(resolve, 150));

  // 4. Substitui o arquivo da aba markdown principal pelo arquivo original capturado
  // O grupo de abas "09aeb1c4e718b146" mantém o grafo local e os backlinks sincronizados com a nota ativa!
  const leaf = app.workspace.getLeaf(false);
  if (leaf) {
    await leaf.openFile(activeFile);
  }
};
