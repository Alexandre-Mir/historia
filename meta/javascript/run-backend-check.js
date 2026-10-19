module.exports = async ({ app }) => {
  const { runBackendCheck } = require("./backend-check-runner");
  const result = await runBackendCheck(app);
  if (result.skipped) return;

  if (result.changed && (result.failed || result.warningCount > 0)) {
    new Notice(
      `Check do backend: ${result.errorCount} erro(s), ${result.warningCount} aviso(s). Consulte ${result.reportPath}.`,
    );
  }
};
