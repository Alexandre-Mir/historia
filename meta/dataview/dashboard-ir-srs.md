# 🧭 Painel de estudo: leitura, revisão e escrita

## ⚡ Ações frequentes

### Leitura

- [Retomar leitura](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Ae2be231a-5fc8-4e86-9c3b-997fb8676356) · [Registrar continuidade](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A8fccdf26-e809-4000-a664-2e0bc7c3c5ae) · [Concluir leitura da obra](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Af6db9ad2-7bb9-4452-87d2-6ac7a255851c)

### Pesquisa

- **Pesquisa:** [Buscar referência Zotero](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A26e8a6b3-1321-4b2c-ab82-3c3a17939fcb) · [[meta/dataview/search research notes|Busca avançada]] · [Busca geral](obsidian://advanced-uri?vault=historia&commandid=omnisearch%3Ashow-modal)

Para revisar texto com LanguageTool, selecione um trecho e execute **Check Text** pela paleta de comandos. Sem seleção, o plugin verifica o documento ativo e envia esse texto ao endpoint configurado.

`Ctrl/Cmd + Shift + R` inicia a retomada; `Ctrl/Cmd + Shift + E` registra continuidade. A conclusão da obra é uma ação separada nesta página ou na paleta de comandos.

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
SORT file.mtime desc
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
