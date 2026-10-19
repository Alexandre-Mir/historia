module.exports = async ({ app }) => {
  const dailyNotes = app.internalPlugins.getEnabledPluginById("daily-notes");
  if (!dailyNotes) {
    new Notice("O plugin Notas Diárias não está ativo.");
    return;
  }

  try {
    const file = await dailyNotes.getDailyNote();
    if (!file) throw new Error("Não foi possível criar ou localizar a nota de hoje.");
    await app.workspace.getLeaf(false).openFile(file);
  } catch (error) {
    console.error(error);
    new Notice(`Não foi possível abrir a nota de hoje: ${error.message}`);
  }
};
