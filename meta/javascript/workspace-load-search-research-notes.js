module.exports = async ({ app }) => {
  const vaultName = encodeURIComponent(app.vault.getName());
  window.open(
    `obsidian://advanced-uri?vault=${vaultName}&workspace=dashboard`,
  );
};
