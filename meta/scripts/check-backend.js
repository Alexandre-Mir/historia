#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "../..");
const obsidian = path.join(root, ".obsidian");
const errors = [];
const warnings = [];
const jsonCache = new Map();

const readJson = (file, fallback = null) => {
  if (jsonCache.has(file)) return jsonCache.get(file);
  try {
    const value = JSON.parse(fs.readFileSync(file, "utf8"));
    jsonCache.set(file, value);
    return value;
  } catch (cause) {
    error(`JSON inválido ou ausente: ${path.relative(root, file)} (${cause.message})`);
    jsonCache.set(file, fallback);
    return fallback;
  }
};
const exists = (relativePath) =>
  fs.existsSync(path.resolve(root, relativePath));

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function error(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const jsonFiles = walk(obsidian).filter((file) => file.endsWith(".json"));
for (const file of jsonFiles) readJson(file);

const communityPlugins = readJson(path.join(obsidian, "community-plugins.json"), []) ?? [];
const corePlugins = readJson(path.join(obsidian, "core-plugins.json"), {}) ?? {};
const pluginCommands = new Map();
for (const pluginId of communityPlugins) {
  const manifest = path.join(obsidian, "plugins", pluginId, "manifest.json");
  if (!fs.existsSync(manifest)) {
    error(`Plugin ativo sem manifesto: ${pluginId}`);
  } else if (readJson(manifest, {})?.id !== pluginId) {
    error(`O id do manifesto não corresponde ao plugin ativo: ${pluginId}`);
  }
  const main = path.join(obsidian, "plugins", pluginId, "main.js");
  if (fs.existsSync(main)) {
    const source = fs.readFileSync(main, "utf8");
    pluginCommands.set(
      pluginId,
      new Set([...source.matchAll(/addCommand\(\{\s*id:\s*["']([^"']+)["']/g)].map((match) => match[1])),
    );
  }
}

const templaterFile = path.join(obsidian, "plugins/templater-obsidian/data.json");
const templater = readJson(templaterFile, {}) ?? {};
for (const relativePath of [templater.templates_folder, templater.user_scripts_folder]) {
  if (relativePath && !exists(relativePath)) {
    error(`Pasta do Templater ausente: ${relativePath}`);
  }
}
for (const rule of templater.folder_templates ?? []) {
  if (!exists(rule.template)) error(`Template de pasta ausente: ${rule.template}`);
}
for (const rule of templater.file_templates ?? []) {
  if (!exists(rule.template)) error(`Template regex ausente: ${rule.template}`);
}
for (const entry of templater.enabled_templates_hotkeys ?? []) {
  if (!exists(entry.template)) error(`Template de atalho ausente: ${entry.template}`);
}
for (const file of walk(path.join(root, "meta/templater")).filter((item) => item.endsWith(".md"))) {
  const content = fs.readFileSync(file, "utf8");
  for (const [, functionName] of content.matchAll(/tp\.user\.([a-zA-Z0-9_]+)/g)) {
    const script = path.posix.join(templater.user_scripts_folder, `${functionName}.js`);
    if (!exists(script)) error(`Função de usuário do Templater sem script: ${script}`);
  }
}

const quickAddFile = path.join(obsidian, "plugins/quickadd/data.json");
const quickAdd = readJson(quickAddFile, {}) ?? {};
const choiceIds = new Set();
for (const choice of quickAdd.choices ?? []) {
  if (choiceIds.has(choice.id)) error(`Id QuickAdd duplicado: ${choice.id}`);
  choiceIds.add(choice.id);
  for (const command of choice.macro?.commands ?? []) {
    if (command.type === "UserScript" && command.path && !exists(command.path)) {
      error(`Script QuickAdd ausente (${choice.name}): ${command.path}`);
    }
  }
}
const startupCheckConfigured = (quickAdd.choices ?? []).some((choice) =>
  choice.runOnStartup && choice.macro?.commands?.some((command) =>
    command.type === "UserScript" && command.path === "meta/javascript/run-backend-check.js",
  ),
);
if (!startupCheckConfigured) error("check-backend não está configurado para executar na inicialização do QuickAdd.");

const javascriptFiles = [
  ...walk(path.join(root, "meta/javascript")),
  ...walk(path.join(root, "meta/templater-scripts")),
  ...walk(path.join(root, "meta/scripts")),
].filter((file) => file.endsWith(".js"));
for (const file of javascriptFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    error(`JavaScript inválido: ${path.relative(root, file)} (${result.stderr.trim()})`);
  }

  const source = fs.readFileSync(file, "utf8");
  for (const [, specifier] of source.matchAll(/(?:require\s*\(|\bfrom\s*)["'](\.{1,2}\/[^"']+)["']/g)) {
    const base = path.resolve(path.dirname(file), specifier);
    const candidates = [base, `${base}.js`, `${base}.json`, path.join(base, "index.js")];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      warn(`Módulo local não encontrado em ${path.relative(root, file)}: ${specifier}`);
    }
  }
}

for (const file of walk(path.join(root, "meta/dataview")).filter((item) => item.endsWith(".md"))) {
  const content = fs.readFileSync(file, "utf8");
  for (const [, viewPath] of content.matchAll(/dv\.view\(["']([^"']+)["']/g)) {
    const script = viewPath.endsWith(".js") ? viewPath : `${viewPath}.js`;
    if (!exists(script)) error(`View do Dataview sem script (${path.relative(root, file)}): ${script}`);
  }
  for (const [, query] of content.matchAll(/```dataviewjs\s*([\s\S]*?)```/g)) {
    try {
      new Function("dv", `return (async () => {\n${query}\n})();`);
    } catch (cause) {
      error(`DataviewJS inválido em ${path.relative(root, file)} (${cause.message})`);
    }
  }
}

const zoteroDataFile = path.join(obsidian, "plugins/obsidian-zotero-desktop-connector/data.json");
const zoteroData = readJson(zoteroDataFile, {}) ?? {};
const zoteroTemplateContracts = new Map([
  [
    "meta/zotero/research note.md",
    [
      "{{bibliography}}",
      "{{desktopURI}}",
      "{{uri}}",
      "start-date::",
      "end-date::",
      "page-no::",
      "reading-position::",
      "next-reading-step::",
      'persist "connections"',
      'persist "comment"',
      'persist "annotations"',
    ],
  ],
]);
for (const format of zoteroData.exportFormats ?? []) {
  if (format.templatePath && !exists(format.templatePath)) {
    error(`Template Zotero ausente (${format.name}): ${format.templatePath}`);
    continue;
  }
  if (!format.templatePath) continue;

  const resolvedTemplate = path.resolve(root, format.templatePath);
  const templatePath = path.relative(root, resolvedTemplate).replace(/\\/g, "/");
  const template = fs.readFileSync(resolvedTemplate, "utf8");
  const requiredFragments = zoteroTemplateContracts.get(templatePath) ?? [];
  for (const fragment of requiredFragments) {
    if (!template.includes(fragment)) {
      error(`Template Zotero sem componente obrigatório (${format.name}, ${templatePath}): ${fragment}`);
    }
  }

  const blockPairs = [
    ["if", /\{%-?\s*if\b/g, /\{%-?\s*endif\s*-?%}/g],
    ["for", /\{%-?\s*for\b/g, /\{%-?\s*endfor\s*-?%}/g],
    ["macro", /\{%-?\s*macro\b/g, /\{%-?\s*endmacro\s*-?%}/g],
    ["persist", /\{%-?\s*persist\b/g, /\{%-?\s*endpersist\s*-?%}/g],
  ];
  for (const [name, openPattern, closePattern] of blockPairs) {
    const opens = [...template.matchAll(openPattern)].length;
    const closes = [...template.matchAll(closePattern)].length;
    if (opens !== closes) {
      error(`Blocos Zotero desbalanceados (${format.name}): ${name} (${opens} abertura(s), ${closes} fechamento(s))`);
    }
  }
}

// Resolve links locais escritos em Markdown nas notas técnicas de meta/.
function walkVaultFiles(directory, ignored = new Set([".git", ".obsidian", ".trash", "node_modules"])) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignored.has(entry.name)) return [];
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkVaultFiles(fullPath, ignored) : [fullPath];
  });
}
const vaultFiles = walkVaultFiles(root)
  .filter((file) => !file.split(path.sep).includes("backups"))
  .map((file) => path.relative(root, file).replace(/\\/g, "/"));
const normalizeVaultPath = (value) => value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\.md$/i, "").toLowerCase();
const exactVaultPaths = new Set(vaultFiles.map(normalizeVaultPath));
const vaultPathsByName = new Map();
for (const file of vaultFiles) {
  const normalized = normalizeVaultPath(file);
  const basename = normalized.split("/").at(-1);
  if (!vaultPathsByName.has(basename)) vaultPathsByName.set(basename, new Set());
  vaultPathsByName.get(basename).add(normalized);
}
const resolveVaultTarget = (rawTarget, sourceFile) => {
  const target = rawTarget.trim().replace(/^<|>$/g, "");
  if (!target || /^(?:[a-z]+:|#)/i.test(target) || /[<>]|\{\{|\{%/.test(target)) return true;
  let decoded = target;
  try { decoded = decodeURIComponent(target); } catch {}
  const targetPath = decoded.split(/[?#]/, 1)[0].replace(/^\//, "");
  const normalized = normalizeVaultPath(targetPath);
  const relative = normalizeVaultPath(path.posix.join(
    path.posix.dirname(path.relative(root, sourceFile)), targetPath,
  ));
  const basename = normalized.split("/").at(-1);
  return exactVaultPaths.has(normalized) || exactVaultPaths.has(relative) ||
    vaultPathsByName.has(basename);
};
for (const file of walk(path.join(root, "meta")).filter((item) =>
  item.endsWith(".md") && !item.includes(`${path.sep}backups${path.sep}`),
)) {
  const rawContent = fs.readFileSync(file, "utf8");
  const content = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/<!---[\s\S]*?--->/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/%%[\s\S]*?%%/g, "")
    .replace(/`[^`\n]*`/g, "");
  for (const [, rawTarget] of content.matchAll(/\[\[([^\]|#]+)(?:#[^\]]*)?(?:\|[^\]]*)?\]\]/g)) {
    if (!resolveVaultTarget(rawTarget, file)) {
      warn(`Wikilink local não resolvido em ${path.relative(root, file)}: [[${rawTarget.trim()}]]`);
    }
  }
  for (const [, rawTarget] of content.matchAll(/\]\(<?([^)>\s]+)>?(?:\s+["'][^)]*["'])?\)/g)) {
    if (!resolveVaultTarget(rawTarget, file)) {
      warn(`Link Markdown local não resolvido em ${path.relative(root, file)}: ${rawTarget}`);
    }
  }
}

const knownCommandPrefixes = new Set([
  ...communityPlugins,
  ...Object.keys(corePlugins),
  "app",
  "editor",
  "file-explorer",
]);
const verifyCommandReference = (rawKey, source) => {
  const key = rawKey.replace(/^"|"$/g, "");
  const separator = key.indexOf(":");
  if (separator < 0) return;
  const prefix = key.slice(0, separator);
  const command = key.slice(separator + 1);
  if (prefix === "quickadd" && command.startsWith("choice:")) {
    const choiceId = command.slice("choice:".length);
    if (!(quickadd.choices ?? []).some((choice) => choice.id === choiceId && choice.command)) {
      warn(`Comando QuickAdd não encontrado em ${source}: ${key}`);
    }
  } else if (prefix === "templater-obsidian" && command.endsWith(".md")) {
    if (!exists(command)) warn(`Comando de template Templater sem arquivo em ${source}: ${key}`);
  } else if (prefix === "obsidian-zotero-desktop-connector") {
    const exportName = command.match(/^zdc-exp-(.+)$/)?.[1];
    const citeName = command.match(/^zdc-(.+)$/)?.[1];
    const builtIn = new Set(["zdc-import-notes", "zdc-insert-notes", "show-zotero-debug-view"]);
    const existsInSettings = builtIn.has(command) || (exportName
      ? (zoteroData.exportFormats ?? []).some((format) => format.name === exportName)
      : citeName && (zoteroData.citeFormats ?? []).some((format) => format.name === citeName));
    if (!existsInSettings) warn(`Comando Zotero não encontrado nas configurações em ${source}: ${key}`);
  } else if (communityPlugins.includes(prefix)) {
    const registered = pluginCommands.get(prefix);
    if (registered?.size && !registered.has(command)) {
      warn(`Comando de plugin não encontrado no código carregado (${prefix}) em ${source}: ${key}`);
    }
  }
};
for (const file of [
  path.join(obsidian, "hotkeys.json"),
  path.join(obsidian, "workspace.json"),
  path.join(obsidian, "workspace-mobile.json"),
  path.join(obsidian, "workspaces.json"),
]) {
  if (!fs.existsSync(file)) continue;
  const data = readJson(file);
  const commandKeys = [];
  const collectHiddenItems = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (key === "hiddenItems" && child && typeof child === "object") {
        commandKeys.push(...Object.keys(child));
      } else {
        collectHiddenItems(child);
      }
    }
  };
  if (file.endsWith("hotkeys.json")) commandKeys.push(...Object.keys(data));
  else collectHiddenItems(data);
  for (const rawKey of commandKeys) {
    const key = rawKey.replace(/^"|"$/g, "");
    const prefix = key.match(/^([a-z0-9-]+):/i)?.[1];
    if (prefix && !knownCommandPrefixes.has(prefix)) {
      warn(`Referência de comando possivelmente obsoleta em ${path.relative(root, file)}: ${key}`);
    }
    verifyCommandReference(key, path.relative(root, file));
  }
}

for (const choice of quickadd.choices ?? []) {
  for (const command of choice.macro?.commands ?? []) {
    if (command.type === "Obsidian" && command.commandId) {
      verifyCommandReference(command.commandId, `QuickAdd (${choice.name})`);
    }
  }
}

for (const file of jsonFiles) {
  if (path.basename(file).includes("sync-conflict")) {
    warn(`Arquivo de conflito para revisão manual: ${path.relative(root, file)}`);
  }
}

for (const message of errors) console.error(`ERRO: ${message}`);
for (const message of warnings) console.warn(`AVISO: ${message}`);
if (!errors.length && !warnings.length) console.log("Backend consistente: nenhuma divergência detectada.");
else if (!errors.length) console.log("Backend válido; revise os avisos acima quando conveniente.");
else console.error(`Backend com ${errors.length} erro(s).`);

process.exitCode = errors.length ? 1 : 0;
