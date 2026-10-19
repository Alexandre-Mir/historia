module.exports = async ({ app }) => {
  const file = app.workspace.getActiveFile();
  if (!file || !file.path.startsWith("02_zettel/")) {
    new Notice("Abra um Zettel antes de procurar a nota de origem.");
    return;
  }

  const content = await app.vault.read(file);
  const match = content.match(/^\*\*Fonte:\*\*\s*\[\[([^\]|#]+)(?:#[^\]]*)?(?:\|[^\]]*)?\]\]/m);
  if (!match) {
    new Notice("Não encontrei um link de fonte nesta nota.");
    return;
  }

  const source = app.metadataCache.getFirstLinkpathDest(match[1].trim(), file.path);
  if (!source) {
    new Notice(`A nota de origem não existe: ${match[1].trim()}`);
    return;
  }
  await app.workspace.getLeaf(false).openFile(source);
};
