# 🧭 Painel de estudo: leitura, revisão e escrita

## Protótipo Meta Bind (suspenso)

Os blocos de botão deste protótipo e do painel foram rejeitados pela validação do Meta Bind 1.5.1 neste vault. Ações equivalentes permanecem disponíveis pelos links Advanced URI abaixo; não há botões Meta Bind ativos até a sintaxe ser validada no próprio Obsidian.

- **Rotina:** [Abrir nota de hoje](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A687ee15f-5e80-47c4-b8a9-5d92c19c67e4) · [Adicionar tarefa](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A0a8e34a0-121c-4eb8-a25d-3051c56f9a72)
- **Leitura:** [Retomar](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Ae2be231a-5fc8-4e86-9c3b-997fb8676356) · [Registrar continuidade](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A8fccdf26-e809-4000-a664-2e0bc7c3c5ae) · [Concluir obra](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Af6db9ad2-7bb9-4452-87d2-6ac7a255851c)
- **Zettels:** [Extrair da seleção](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Af660fbef-76bf-44e1-b1fb-3e6de8976e18) · [Abrir fonte](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A6560e10b-a2af-4b02-bcc4-8d0e9a7cb92d)
- **Pesquisa:** [Buscar referência Zotero](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A26e8a6b3-1321-4b2c-ab82-3c3a17939fcb) · [[meta/dataview/search research notes|Abrir busca avançada]]
- **Navegação:** [Navegador e calendário](obsidian://advanced-uri?vault=historia&commandid=notebook-navigator%3Aopen) · [Busca geral](obsidian://advanced-uri?vault=historia&commandid=omnisearch%3Ashow-modal)

Atalhos: `Ctrl/Cmd + Shift + D` abre a nota diária; `Ctrl/Cmd + Shift + R` inicia a retomada; `Ctrl/Cmd + Shift + E` registra continuidade; `Ctrl/Cmd + Alt + T` captura tarefa; `Ctrl/Cmd + Shift + O` abre a fonte do Zettel; `Ctrl/Cmd + Shift + Z` busca referências.

---

## ✅ Hoje

```dataviewjs
const now = new Date();
const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const today = dv.page(`daily/${dateKey}`);
if (!today) {
  dv.paragraph(`A nota de hoje ainda não existe. [Criar e abrir](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A687ee15f-5e80-47c4-b8a9-5d92c19c67e4).`);
} else {
  const tasks = today.file.tasks;
  const done = tasks.filter((task) => task.completed).length;
  const open = tasks.filter((task) => !task.completed);
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  dv.paragraph(`${today.file.link} · ${done}/${tasks.length} tarefas concluídas (${percent}%)`);
  if (open.length) dv.taskList(open, false);
  else dv.paragraph(tasks.length ? "Tudo concluído por hoje." : "A nota não tem tarefas pendentes.");
}
```

---

## 📋 Pendências no vault
> Consulta geral do Tasks. Marque itens aqui para atualizar a caixa de seleção na nota de origem.

```tasks
not done
sort by due
sort by path
```

---

## 🧹 Leituras para resolver rapidamente
> Consultas de visualização para encontrar obras com pequenos próximos passos de manutenção.

```dataviewjs
const works = dv.pages('"01_notes"').where((page) => !page["end-date"]);
const noPage = works.where((page) => page["page-no"] == null || String(page["page-no"]).trim() === "");
const stale = works.where((page) => page.file.mtime.toMillis() < Date.now() - 90 * 24 * 60 * 60 * 1000);
const zettelSources = new Set();
for (const zettel of dv.pages('"02_zettel"')) {
  for (const link of zettel.file.outlinks ?? []) {
    if (link.path?.startsWith("01_notes/")) zettelSources.add(link.path.replace(/\.md$/i, ""));
  }
}
const noZettels = works.where((page) => !zettelSources.has(page.file.path.replace(/\.md$/i, "")));
const show = (title, pages, description) => {
  dv.header(3, `${title} (${pages.length})`);
  if (pages.length) dv.list(pages.map((page) => page.file.link));
  else dv.paragraph(description);
};
show("Sem página registrada", noPage, "Todas as leituras ativas têm página registrada.");
show("Sem Zettels derivados", noZettels, "Todas as leituras ativas têm Zettels vinculados.");
show("Sem atividade há mais de 90 dias", stale, "Nenhuma leitura ativa está há mais de 90 dias sem alteração.");
```

---

## 📚 Leituras ativas
> Obras sem `end-date::`, ordenadas pela última modificação da nota (um indicador aproximado, não um registro garantido de leitura).

```dataview
TABLE
  dateformat(file.mtime, "yyyy-MM-dd") AS "Última modificação",
  page-no AS "Página",
  reading-position AS "Ponto de retomada",
  next-reading-step AS "Próximo passo"
FROM "01_notes"
WHERE !end-date
SORT file.mtime asc
LIMIT 15
```

> Atualize `reading-position::` e `next-reading-step::` na nota da obra ao encerrar uma sessão. Se os campos estiverem vazios, use `page-no::` como ponto de partida e registre o próximo passo ao retomar.

---

## 🧭 Continuidade encontrada nos diários
> `reading-position::` e `next-reading-step::` na nota da obra são o registro atual. Os diários recentes servem de recuperação quando esses campos estão vazios.

```dataviewjs
const active = dv.pages('"01_notes"').where((page) => !page["end-date"]);
const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
const logs = dv.pages('"daily"')
  .where((page) => page.file.day && page.file.day.toMillis() >= cutoff)
  .sort((page) => page.file.day, "desc");
const worksNeedingHistory = active.filter((work) => !work["reading-position"] || !work["next-reading-step"]);
const logRecords = worksNeedingHistory.length
  ? await Promise.all(logs.map(async (log) => ({
      log,
      lines: (await dv.io.load(log.file.path)).split(/\r?\n/),
    })))
  : [];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rows = active.map((work) => {
  const workLink = new RegExp(`\\[\\[${escapeRegExp(work.file.name)}(?:\\|[^\\]]*)?\\]\\]`);
  let history = null;
  if (!work["reading-position"] || !work["next-reading-step"]) {
    for (const { log, lines } of logRecords) {
      const linkedLines = lines.filter((line) => workLink.test(line));
      const stopLine = linkedLines.find((line) => /Onde parei/i.test(line));
      const nextLine = linkedLines.find((line) => /Próximo passo concreto/i.test(line));
      if (stopLine || nextLine) {
        const clean = (line, label) => line
          ?.replace(/^\s*[-*>]+\s*/, "")
          .replace(new RegExp(`^.*?${label}[^:]*:\\s*`, "i"), "")
          .trim();
        history = {
          log: log.file.link,
          position: clean(stopLine, "Onde parei"),
          nextStep: clean(nextLine, "Próximo passo concreto"),
        };
        break;
      }
    }
  }
  return [
    work.file.link,
    history?.log ?? "—",
    work["reading-position"] ?? history?.position ?? work["page-no"] ?? "—",
    work["next-reading-step"] ?? history?.nextStep ?? "Defina um próximo passo curto",
  ];
});

dv.table(["Obra", "Diário de referência", "Ponto de retomada", "Próximo passo"], rows);
```

---

## ↩️ Tarefas recentes para reavaliar
> Lista tarefas únicas ainda abertas, registradas nos últimos 14 dias. Considere cada uma conforme sua relevância atual; a lista não implica atraso.

```dataviewjs
const today = new Date();
today.setHours(0, 0, 0, 0);
const cutoff = today.getTime() - 14 * 24 * 60 * 60 * 1000;
const pages = dv.pages('"daily"')
  .where((page) => page.file.day && page.file.day.toMillis() >= cutoff && page.file.day.toMillis() < today.getTime());
const occurrences = new Map();

for (const page of pages) {
  for (const task of page.file.tasks) {
    const key = task.text.replace(/\s+/g, " ").trim();
    occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
  }
}

const suggestions = [];
for (const page of pages) {
  for (const task of page.file.tasks) {
    const key = task.text.replace(/\s+/g, " ").trim();
    if (!task.completed && occurrences.get(key) === 1) {
      suggestions.push({ page, task });
    }
  }
}

suggestions.sort((a, b) => b.page.file.day.toMillis() - a.page.file.day.toMillis());
const selected = suggestions.slice(0, 10);
if (selected.length) {
  dv.table(
    ["Dia", "Tarefa aberta"],
    selected.map(({ page, task }) => [page.file.link, task.text]),
  );
} else {
  dv.paragraph("Nenhuma tarefa única recente precisa ser reavaliada.");
}
```

---

## 🧠 Zettels recentes no grafo
> Use esta lista para escolher uma nota e explorar seus backlinks e conexões. As notas amadurecem ao serem retomadas em leituras cruzadas, ao explicitar relações com outras ideias e ao contribuir para a escrita.

```dataview
TABLE
  dateformat(file.ctime, "yyyy-MM-dd") AS "Criado em"
FROM "02_zettel"
SORT file.ctime desc
LIMIT 20
```

---

## 🔎 Integridade estrutural dos Zettels
> Diagnóstico não destrutivo de estrutura. Não avalia a qualidade intelectual da síntese nem sugere reescritas.

```dataviewjs
const pages = dv.pages('"02_zettel"');
const findings = await Promise.all(
  pages.map(async (page) => {
    const content = await dv.io.load(page.file.path);
    const lines = content.split(/\r?\n/);
    const sections = {};
    let currentSection = null;

    for (const line of lines) {
      const heading = line.match(/^###\s+(.+?)\s*$/);
      if (heading) {
        currentSection = heading[1].trim();
        sections[currentSection] = [];
        continue;
      }
      if (/^---\s*$/.test(line)) {
        currentSection = null;
        continue;
      }
      if (currentSection) sections[currentSection].push(line);
    }

    const issues = [];
    if (page.type !== "zettel") issues.push("type: zettel ausente");
    if (!page.created) issues.push("data created ausente");
    if (!(page.file.tags ?? []).includes("#zettel")) {
      issues.push("tag #zettel ausente");
    }
    if (!/^\*\*Fonte:\*\*\s*\[\[[^\]]+\]\]/m.test(content)) {
      issues.push("fonte bibliográfica ausente");
    }

    const synthesis = (sections["Síntese"] ?? [])
      .filter((line) => !line.trim().startsWith(">"))
      .join("\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
    if (!synthesis) issues.push("síntese autoral não detectada");

    const connections = (sections["Conexões"] ?? []).join("\n");
    const hasConceptLink = /\[\[[^\]]+\]\]/.test(connections);
    const hasPlaceholder = /<!--[^>]*(?:Explique|nexo|conex)[^>]*-->/i.test(
      connections,
    );
    if (!hasConceptLink || hasPlaceholder) {
      issues.push("conexão conceitual em aberto");
    }

    return issues.length ? [page.file.link, issues.join("; ")] : null;
  }),
);

const rows = findings.filter(Boolean);
if (rows.length) {
  dv.table(["Zettel", "Pontos estruturais para revisar"], rows);
} else {
  dv.paragraph("Nenhum problema estrutural detectado pelo verificador.");
}
```

---

## ✍️ Projetos de escrita incremental
> Escolha um item da [[IW-Queues/IW-Queue|fila de escrita]] e termine cada sessão deixando anotado o próximo passo concreto.

Fila: [[IW-Queues/IW-Queue|abrir a fila de escrita incremental]].

## 🧰 Importação de referências

Procedimento de prévia, backup e validação: [[meta/zotero/fluxo-de-importacao|importar notas do Zotero com segurança]].
