module.exports = async ({ app, quickAddApi }) => {
  const works = (await Promise.all(app.vault.getMarkdownFiles()
    .filter((file) => file.path.startsWith("01_notes/") && file.basename.trim())
    .map(async (file) => {
      const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
      const content = await app.vault.read(file);
      const endDate = content.match(/^end-date::[ \t]*(.*)$/m)?.[1]?.trim() ?? frontmatter["end-date"];
      return { file, frontmatter, content, isActive: !endDate };
    })))
    .filter((work) => work.isActive)
    .sort((a, b) => a.file.basename.localeCompare(b.file.basename, "pt-BR"));

  if (!works.length) {
    new Notice("Não há leituras ativas em 01_notes.");
    return;
  }

  const displayItems = works.map(({ file, frontmatter }) => {
    const authors = frontmatter.author ?? "";
    return `${file.basename} · ${frontmatter.title ?? ""} · ${Array.isArray(authors) ? authors.join(", ") : authors}`;
  });
  const work = await quickAddApi.suggester(displayItems, works, "Escolha uma leitura ativa");
  if (!work) return;

  const { file, frontmatter, content } = work;
  await app.workspace.getLeaf(false).openFile(file);
  const readField = (key) => content.match(new RegExp(`^${key}::[ \\t]*(.*)$`, "m"))?.[1]?.trim();
  const position = readField("reading-position") || readField("page-no") || frontmatter["page-no"] || "sem página registrada";
  const next = readField("next-reading-step") || frontmatter["next-reading-step"] || "Defina o próximo passo na nota.";
  new Notice(`Retomada: ${position}. Próximo passo: ${next}`, 8000);
};
