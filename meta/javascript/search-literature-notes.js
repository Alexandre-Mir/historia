module.exports = async ({ app, quickAddApi }) => {
  const notes = app.vault.getMarkdownFiles()
    .filter((file) => file.path.startsWith("01_notes/"))
    .map((file) => ({ file, frontmatter: app.metadataCache.getFileCache(file)?.frontmatter ?? {} }))
    .sort((a, b) => a.file.basename.localeCompare(b.file.basename, "pt-BR"));

  if (!notes.length) {
    new Notice("Não há notas de literatura em 01_notes.");
    return;
  }

  const displayItems = notes.map(({ file, frontmatter }) => {
    const authors = frontmatter.author ?? frontmatter.authors ?? "";
    const authorText = Array.isArray(authors) ? authors.join(", ") : String(authors);
    return `${file.basename} · ${frontmatter.title ?? ""} · ${authorText} · ${frontmatter.publication ?? ""}`;
  });
  const selected = await quickAddApi.suggester(
    displayItems,
    notes,
    "Buscar por citekey, título, autor ou publicação",
  );
  if (selected) await app.workspace.getLeaf(false).openFile(selected.file);
};
