const FOLDER = '"01_notes"';
const current = dv.current();

// Converte um valor do Dataview (DateTime, Date ou texto) em milissegundos.
const toMillis = (v) => {
  if (!v) return NaN;
  if (typeof v.toMillis === "function") return v.toMillis();
  return new Date(v).getTime();
};

// Lê "< 1950-01-01", "> 1950-01-01" ou "1950-01-01" e devolve { op, value }.
const parseDateFilter = (raw) => {
  if (!raw) return null;
  const text = String(raw).trim();
  const op = text.startsWith("<") ? "<" : text.startsWith(">") ? ">" : "=";
  const value = toMillis(text.replace(/^[<>]\s*/, ""));
  return Number.isNaN(value) ? null : { op, value };
};

const compare = (pageValue, filter) => {
  const t = toMillis(pageValue);
  if (Number.isNaN(t)) return false;
  if (filter.op === "<") return t < filter.value;
  if (filter.op === ">") return t > filter.value;
  return t === filter.value;
};

// Busca por texto em valores simples ou em listas (author, recipient etc.).
const has = (value, term) => {
  if (!value) return false;
  const needle = String(term).toLowerCase();
  return dv.array(value).some((v) => String(v).toLowerCase().includes(needle));
};

const matchtags = (wanted, actual) => {
  const have = new Set(actual ?? []);
  return [...new Set(wanted)].every((tag) => have.has(tag));
};

const filters = {
  date: parseDateFilter(current.date),
  start: parseDateFilter(current["start-date"]),
  end: parseDateFilter(current["end-date"]),
  created: parseDateFilter(current["note-created"]),
  modified: parseDateFilter(current["note-modified"]),
};

const hasAnyFilter = [
  "keyword",
  "author",
  "recipient",
  "title",
  "publication",
  "date",
  "archive",
  "archive-location",
  "note-title",
  "start-date",
  "end-date",
  "note-created",
  "note-modified",
  "comment",
  "tags",
].some((key) => current[key]);

if (!hasAnyFilter) {
  dv.paragraph(
    "Enter search terms into one or more fields to find research notes.",
  );
} else {
  const passes = (page) =>
    (!current.author || has(page.author, current.author)) &&
    (!current.recipient || has(page.recipient, current.recipient)) &&
    (!current.title || has(page.title, current.title)) &&
    (!current.publication || has(page.publication, current.publication)) &&
    (!current.archive || has(page.archive, current.archive)) &&
    (!current["archive-location"] ||
      has(page["archive-location"], current["archive-location"])) &&
    (!current["note-title"] || has(page.file.name, current["note-title"])) &&
    (!current.comment || has(page.comment, current.comment)) &&
    (!filters.date || compare(page.date, filters.date)) &&
    (!filters.start || compare(page["start-date"], filters.start)) &&
    (!filters.end || compare(page["end-date"], filters.end)) &&
    (!filters.created || compare(page.file.ctime, filters.created)) &&
    (!filters.modified || compare(page.file.mtime, filters.modified)) &&
    (!current.tags || matchtags(current.file.tags, page.file.tags));

  const sortKey = (p) =>
    ({
      "note-created": p.file.ctime,
      "note-modified": p.file.mtime,
      "note-title": p.file.name,
    })[current.sortby] ?? p[current.sortby];

  const candidates = dv
    .pages(FOLDER)
    .where(passes)
    .sort(sortKey, current.sortorder ?? "asc");

  // Só lê o conteúdo dos arquivos quando há busca por palavra-chave.
  const needsContent = Boolean(current.keyword);
  const keywordLower = needsContent
    ? String(current.keyword).toLowerCase()
    : "";

  const rows = await Promise.all(
    candidates.map(async (page) => {
      const content = needsContent ? await dv.io.load(page.file.path) : "";
      return { page, content };
    }),
  );

  const matches = rows.filter(
    ({ page, content }) =>
      !needsContent ||
      content.toLowerCase().includes(keywordLower) ||
      page.file.name.toLowerCase().includes(keywordLower),
  );

  dv.table(
    [
      "Note Title",
      "Start Date",
      "End Date",
      "Author",
      "Recipient",
      "Title",
      "Publication",
      "Date",
      "Pages",
      "Archive",
      "Loc. in Archive",
    ],
    matches.map(({ page: p }) => [
      p.file.link,
      p["start-date"],
      p["end-date"],
      p.author,
      p.recipient,
      p.title,
      p.publication,
      p.date,
      p["page-no"],
      p.archive,
      p["archive-location"],
    ]),
  );
}
