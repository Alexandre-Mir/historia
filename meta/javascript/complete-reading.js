module.exports = async ({ app, quickAddApi }) => {
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
    new Notice("Não há leituras ativas para concluir em 01_notes.");
    return;
  }

  let work = works.find(({ file }) => file.path === active?.path);
  if (!work) {
    const displayItems = works.map(({ file, frontmatter }) =>
      `${file.basename} · ${frontmatter.title ?? ""} · ${frontmatter.author ?? ""}`,
    );
    work = await quickAddApi.suggester(displayItems, works, "Escolha a obra que terminou de ler");
  }
  if (!work) return;

  const confirmation = await quickAddApi.suggester(
    ["Sim, marcar como concluída", "Cancelar e voltar"],
    [true, false],
    `Confirme a conclusão da leitura de “${work.file.basename}”`,
  );
  if (confirmation !== true) return;

  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  const existingField = /^end-date::[ \t]*.*$/m;
  let content = work.content;
  if (existingField.test(content)) {
    content = content.replace(existingField, `end-date:: ${today}`);
  } else {
    const indexHeading = /^## Index\s*$/m;
    if (indexHeading.test(content)) {
      content = content.replace(indexHeading, (heading) => `${heading}\n\nend-date:: ${today}`);
    } else {
      content = `${content.trimEnd()}\n\nend-date:: ${today}\n`;
    }
  }

  await app.vault.modify(work.file, content);
  await app.workspace.getLeaf(false).openFile(work.file);
  new Notice(`Leitura concluída e registrada em ${work.file.basename} (${today}).`);
};
