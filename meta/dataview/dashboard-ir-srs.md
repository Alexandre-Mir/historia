# 🧭 Painel de estudo: leitura, revisão e escrita

## ⚡ Ações frequentes

### Leitura e Extração

- [Retomar leitura](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Ae2be231a-5fc8-4e86-9c3b-997fb8676356) · [Registrar continuidade](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A8fccdf26-e809-4000-a664-2e0bc7c3c5ae) · [Concluir leitura da obra](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Af6db9ad2-7bb9-4452-87d2-6ac7a255851c) · [Extrair da seleção](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3Af660fbef-76bf-44e1-b1fb-3e6de8976e18)

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
> Acompanhe e redija ensaios apoiados pela rede de Zettels na pasta `99_ensaios/`. Termine cada sessão registrando o próximo passo concreto.

## 🧰 Importação de referências

Procedimento de prévia, backup e validação: [[meta/zotero/fluxo-de-importacao|importar notas do Zotero com segurança]].
