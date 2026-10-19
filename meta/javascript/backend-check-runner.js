const run = (binary, checker, root) => new Promise((resolve) => {
  require("node:child_process").execFile(
    binary,
    [checker],
    { cwd: root, timeout: 60_000, windowsHide: true },
    (error, stdout = "", stderr = "") => resolve({ error, stdout, stderr }),
  );
});

module.exports.runBackendCheck = async (app) => {
  const { Platform } = require("obsidian");
  if (Platform.isMobile) return { skipped: true };

  const root = app.vault.adapter.basePath;
  const checker = "meta/scripts/check-backend.js";
  let result = await run("/usr/bin/node", checker, root);
  if (result.error?.code === "ENOENT") result = await run("node", checker, root);

  const exitCode = result.error?.code ?? 0;
  const output = [
    result.stdout.trim(),
    result.stderr.trim(),
    result.error && `${result.error.code ?? "falha"}: ${result.error.message}`,
  ].filter(Boolean).join("\n");
  const reportedErrors = [...output.matchAll(/^ERRO:/gm)].length;
  const errorCount = reportedErrors + (result.error && reportedErrors === 0 ? 1 : 0);
  const warningCount = [...output.matchAll(/^AVISO:/gm)].length;
  const reportPath = "meta/reports/backend-check.log";
  const report = [
    "Resultado mais recente do check-backend (o arquivo muda quando o resultado muda)",
    `Estado: ${result.error ? `erro (código ${exitCode})` : "sem erros"}`,
    `Erros: ${errorCount} · Avisos: ${warningCount}`,
    "",
    output || "O verificador não produziu saída.",
    "",
  ].join("\n");

  if (!app.vault.getAbstractFileByPath("meta/reports")) {
    await app.vault.createFolder("meta/reports");
  }
  const existing = app.vault.getAbstractFileByPath(reportPath);
  const previous = existing ? await app.vault.read(existing) : null;
  const changed = previous !== report;
  if (changed) {
    if (existing) await app.vault.modify(existing, report);
    else await app.vault.create(reportPath, report);
  }

  return {
    skipped: false,
    failed: Boolean(result.error),
    errorCount,
    warningCount,
    changed,
    reportPath,
  };
};
