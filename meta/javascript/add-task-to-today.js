const SECTION_LABELS = [
  "Manhã — abertura e foco",
  "Bloco de estudo — leitura e fichamento",
  "Bloco de estudo — elaboração",
  "Tarde — movimento e tarefa da casa",
  "Noite — fechamento e continuidade",
  "Projeto semanal — escrita incremental",
];

module.exports = async ({ app }) => {
  const modalForms = app.plugins.plugins.modalforms?.api;
  if (!modalForms) {
    new Notice("Ative o plugin Modal Forms e recarregue o Obsidian para usar este comando.");
    return;
  }
  const dailyNotes = app.internalPlugins.getEnabledPluginById("daily-notes");
  if (!dailyNotes) {
    new Notice("O plugin Notas Diárias não está ativo.");
    return;
  }

  let templaterEvent;
  const templaterDone = new Promise((resolve) => {
    templaterEvent = app.workspace.on("templater:all-templates-executed", resolve);
  });
  try {
    const file = await dailyNotes.getDailyNote();
    if (!file) throw new Error("Não foi possível criar a nota de hoje.");
    let content = await app.vault.read(file);
    if (!content.includes("## 🌅 Manhã")) {
      await Promise.race([templaterDone, new Promise((resolve) => window.setTimeout(resolve, 5000))]);
      content = await app.vault.read(file);
    }
    if (!content.includes("## 🌅 Manhã")) {
      throw new Error("O template da nota diária ainda não foi aplicado. Tente novamente em alguns segundos.");
    }

    const lines = content.split(/\r?\n/);
    const sections = SECTION_LABELS.filter((label) =>
      lines.some((line) => line.startsWith("## ") && line.includes(label)),
    );
    if (!sections.length) throw new Error("O template de hoje não contém blocos reconhecidos para tarefas.");
    const result = await modalForms.openForm({
      title: "Adicionar tarefa à nota de hoje",
      name: "adicionar-tarefa-diaria",
      version: "1",
      fields: [
        {
          name: "section",
          label: "Bloco do dia",
          description: "Escolha onde a tarefa deve aparecer.",
          isRequired: true,
          input: {
            type: "select",
            source: "fixed",
            options: sections.map((section) => ({ value: section, label: section })),
          },
        },
        {
          name: "task",
          label: "Tarefa",
          description: "Escreva uma ação concreta.",
          isRequired: true,
          input: { type: "textarea", hidden: false },
        },
        {
          name: "timeRange",
          label: "Horário (opcional)",
          description: "Para mostrar no Day Planner, use HH:mm - HH:mm, por exemplo 14:00 - 14:30.",
          isRequired: false,
          input: { type: "text", hidden: false },
        },
      ],
    });
    if (result.status !== "ok") return;

    const { section, task, timeRange } = result.getData();
    if (!sections.includes(section) || !String(task ?? "").trim()) return;
    const schedule = String(timeRange ?? "").trim();
    if (schedule) {
      const match = schedule.match(/^((?:[01]\d|2[0-3]):[0-5]\d) - ((?:[01]\d|2[0-3]):[0-5]\d)$/);
      if (!match || match[1] >= match[2]) {
        new Notice("Horário inválido. Use HH:mm - HH:mm e informe o fim depois do início.");
        return;
      }
    }
    const headingIndex = lines.findIndex((line) => line.startsWith("## ") && line.includes(section));
    if (headingIndex < 0) throw new Error(`Bloco não encontrado no template: ${section}`);
    let insertAt = headingIndex + 1;
    while (insertAt < lines.length && !/^#{1,2}\s/.test(lines[insertAt])) insertAt += 1;
    while (insertAt > headingIndex + 1 && !lines[insertAt - 1].trim()) insertAt -= 1;
    lines.splice(insertAt, 0, `- [ ] ${schedule ? `${schedule} ` : ""}${String(task).trim()}`);
    await app.vault.modify(file, lines.join("\n"));
    await app.workspace.getLeaf(false).openFile(file);
    new Notice("Tarefa adicionada à nota de hoje.");
  } catch (error) {
    console.error(error);
    new Notice(`Não foi possível adicionar a tarefa: ${error.message}`);
  } finally {
    if (templaterEvent) app.workspace.offref(templaterEvent);
  }
};
