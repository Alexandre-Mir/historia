module.exports = async ({ app }) => {
  const { join } = require("path");
  const runnerPath = join(app.vault.adapter.basePath, "meta", "javascript", "backend-check-runner.js");
  const { runBackendCheck } = require(runnerPath);
  const result = await runBackendCheck(app);
  if (result.skipped) return;

  if (result.changed && (result.failed || result.warningCount > 0)) {
    new Notice(
      `Check do backend: ${result.errorCount} erro(s), ${result.warningCount} aviso(s). Consulte ${result.reportPath}.`,
    );
  }
};
