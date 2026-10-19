const MAX_SNAPSHOTS = 20;
const PROTECTED_FOLDERS = ["01_notes", "meta/attachments"];
const BACKUP_FOLDER = "meta/backups/zotero";

const ensureFolder = async (app, folderPath) => {
  const parts = folderPath.split("/");
  for (let index = 1; index <= parts.length; index += 1) {
    const current = parts.slice(0, index).join("/");
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
  }
};

const listSnapshots = async (app) => {
  const manifests = app.vault.getFiles().filter((file) =>
    file.path.startsWith(`${BACKUP_FOLDER}/`) &&
    (file.name === "manifest.json" || file.name === "_manifest.md"),
  );
  const snapshots = new Map();

  for (const file of manifests) {
    const root = file.path.slice(0, file.path.lastIndexOf("/"));
    if (snapshots.has(root) && file.name !== "manifest.json") continue;

    if (file.name === "manifest.json") {
      try {
        snapshots.set(root, { root, manifestFile: file, manifest: JSON.parse(await app.vault.read(file)) });
      } catch {
        continue;
      }
    } else {
      const content = await app.vault.read(file);
      const sources = [...content.matchAll(/^- \[\[([^\]]+)\]\]$/gm)].map((match) => match[1]);
      snapshots.set(root, {
        root,
        manifestFile: file,
        manifest: {
          createdAt: root.slice(BACKUP_FOLDER.length + 1),
          label: "Backup Zotero legado",
          files: sources.map((source) => ({ source, backupPath: `${root}/${source}` })),
        },
      });
    }
  }

  return [...snapshots.values()].sort((a, b) => b.root.localeCompare(a.root));
};

const enforceRetention = async (app, protectedRoots = []) => {
  const snapshots = await listSnapshots(app);
  const protectedSet = new Set(protectedRoots);
  let movedToTrash = 0;

  for (const snapshot of snapshots.slice(MAX_SNAPSHOTS)) {
    if (protectedSet.has(snapshot.root)) continue;
    const folder = app.vault.getAbstractFileByPath(snapshot.root);
    if (folder) {
      await app.vault.trash(folder, false);
      movedToTrash += 1;
    }
  }
  return movedToTrash;
};

const createSnapshot = async (app, label = "pré-importação", options = {}) => {
  const files = app.vault.getFiles().filter((file) =>
    PROTECTED_FOLDERS.some((folder) => file.path.startsWith(`${folder}/`)),
  );
  if (!files.length) throw new Error("Nenhuma nota ou anexo do Zotero foi encontrado para copiar.");

  const createdAt = new Date().toISOString();
  const stamp = createdAt.replace(/[:.]/g, "-");
  const root = `${BACKUP_FOLDER}/${stamp}`;
  await ensureFolder(app, root);

  const entries = [];
  for (const file of files) {
    const backupPath = `${root}/${file.path}`;
    await ensureFolder(app, backupPath.slice(0, backupPath.lastIndexOf("/")));
    if (file.extension.toLowerCase() === "md") {
      await app.vault.create(backupPath, await app.vault.read(file));
    } else {
      await app.vault.createBinary(backupPath, await app.vault.readBinary(file));
    }
    entries.push({ source: file.path, backupPath, extension: file.extension });
  }

  const manifest = { version: 1, createdAt, label, files: entries };
  await app.vault.create(`${root}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
  const readableManifest = [
    `# Backup Zotero — ${new Date(createdAt).toLocaleString("pt-BR")}`,
    "",
    `Motivo: ${label}`,
    `Arquivos copiados: ${entries.length}`,
    "",
    ...entries.map(({ source }) => `- [[${source}]]`),
    "",
  ].join("\n");
  await app.vault.create(`${root}/_manifest.md`, readableManifest);

  const movedToTrash = options.applyRetention === false
    ? 0
    : await enforceRetention(app, options.protectedRoots ?? []);
  return { root, count: entries.length, movedToTrash };
};

const restoreSnapshot = async (app, snapshot) => {
  if (!snapshot?.root?.startsWith(`${BACKUP_FOLDER}/`)) {
    throw new Error("O backup selecionado está fora da pasta autorizada.");
  }
  const entries = snapshot.manifest.files ?? [];
  if (!entries.length) throw new Error("O backup não contém uma lista de arquivos para restaurar.");

  const validated = entries.map((entry) => {
    const source = entry.source;
    const backupPath = entry.backupPath ?? `${snapshot.root}/${source}`;
    const allowed = typeof source === "string" &&
      PROTECTED_FOLDERS.some((folder) => source.startsWith(`${folder}/`));
    if (
      !allowed ||
      source.split("/").includes("..") ||
      !backupPath.startsWith(`${snapshot.root}/`) ||
      backupPath.split("/").includes("..")
    ) {
      throw new Error(`Caminho fora das pastas permitidas no manifesto: ${source}`);
    }
    const backupFile = app.vault.getAbstractFileByPath(backupPath);
    if (!backupFile) throw new Error(`Arquivo ausente no backup: ${backupPath}`);
    if (typeof backupFile.extension !== "string") {
      throw new Error(`O caminho do backup não aponta para um arquivo: ${backupPath}`);
    }
    const current = app.vault.getAbstractFileByPath(source);
    if (current && typeof current.extension !== "string") {
      throw new Error(`O destino não é um arquivo e não pode ser substituído: ${source}`);
    }
    return { source, backupFile };
  });

  const safetyCopy = await createSnapshot(app, "segurança antes de restaurar", {
    protectedRoots: [snapshot.root],
  });

  for (const { source, backupFile } of validated) {
    await ensureFolder(app, source.slice(0, source.lastIndexOf("/")));
    const current = app.vault.getAbstractFileByPath(source);
    const isMarkdown = source.toLowerCase().endsWith(".md");
    if (isMarkdown) {
      const content = await app.vault.read(backupFile);
      if (current) await app.vault.modify(current, content);
      else await app.vault.create(source, content);
    } else {
      const content = await app.vault.readBinary(backupFile);
      if (current) await app.vault.modifyBinary(current, content);
      else await app.vault.createBinary(source, content);
    }
  }

  return { restored: validated.length, safetyCopy };
};

module.exports = { createSnapshot, listSnapshots, restoreSnapshot };
