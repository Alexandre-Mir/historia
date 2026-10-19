module.exports = async ({ app }) => {
  const { join } = require("path");
  const runnerPath = join(app.vault.adapter.basePath, "meta", "javascript", "backend-check-runner.js");
  const { runBackendCheck } = require(runnerPath);
  const result = await runBackendCheck(app);
  if (result.skipped) {
    new Notice("O check-backend automático requer Obsidian para desktop.");
    return;
  }

  const status = result.failed ? "falhou" : "concluído";
  new Notice(
    `Check do backend ${status}: ${result.errorCount} erro(s), ${result.warningCount} aviso(s). Relatório: ${result.reportPath}.`,
  );
};
