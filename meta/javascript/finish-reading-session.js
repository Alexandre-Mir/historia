module.exports = async ({ app, quickAddApi }) => {
  const modalForms = app.plugins.plugins.modalforms?.api;
  if (!modalForms) {
    new Notice("Ative o plugin Modal Forms e recarregue o Obsidian para usar este comando.");
    return;
  }

  const active = app.workspace.getActiveFile();
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

  let work = works.find(({ file }) => file.path === active?.path);
  if (!work) {
    const displayItems = works.map(({ file, frontmatter }) =>
      `${file.basename} · ${frontmatter.title ?? ""} · ${frontmatter.author ?? ""}`,
    );
    work = await quickAddApi.suggester(displayItems, works, "Escolha uma leitura ativa");
  }
  if (!work) return;

  const readInline = (key) => work.content.match(new RegExp(`^${key}::[ \\t]*(.*)$`, "m"))?.[1]?.trim();
  let result;
  try {
    result = await modalForms.openForm("registrar-continuidade-leitura", {
      values: {
        readingPosition: readInline("reading-position") || readInline("page-no") || "",
        nextReadingStep: readInline("next-reading-step") || "",
      },
    });
  } catch (error) {
    console.error(error);
    new Notice(`Não foi possível abrir o formulário de leitura: ${error.message}`);
    return;
  }
  if (result.status !== "ok") return;

  const { readingPosition, nextReadingStep } = result.getData();
  let content = work.content;
  const upsert = (text, key, value) => {
    const line = new RegExp(`^${key}::.*$`, "m");
    const replacement = `${key}:: ${String(value ?? "").trim()}`;
    if (line.test(text)) return text.replace(line, () => replacement);
    const pageLine = /^page-no::.*$/m;
    if (pageLine.test(text)) return text.replace(pageLine, (match) => `${match}\n${replacement}`);
    const indexHeading = /^## Index\s*$/m;
    if (indexHeading.test(text)) return text.replace(indexHeading, (match) => `${match}\n\n${replacement}`);
    return `${text.trimEnd()}\n\n${replacement}\n`;
  };
  content = upsert(content, "reading-position", readingPosition);
  content = upsert(content, "next-reading-step", nextReadingStep);
  await app.vault.modify(work.file, content);
  await app.workspace.getLeaf(false).openFile(work.file);
  new Notice(`Continuidade registrada em ${work.file.basename}.`);
};
