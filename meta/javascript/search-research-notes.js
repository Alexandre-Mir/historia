const FOLDER = '"01_notes"';
const current = dv.current();

// Normaliza datas do Dataview e valores ISO para o dia civil, sem comparar fusos.
const toDateKey = (value) => {
  if (!value) return null;
  if (typeof value.toISODate === "function") return value.toISODate();

  const text = String(value).trim();
  const isoDate = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Lê "< 1950-01-01", "> 1950-01-01" ou "1950-01-01" e devolve { op, value }.
const parseDateFilter = (raw) => {
  if (!raw) return null;
  const text = String(raw).trim();
  const op = text.startsWith("<") ? "<" : text.startsWith(">") ? ">" : "=";
  const value = text.replace(/^[<>]\s*/, "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { op, value, dateOnly: true };
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp)
    ? null
    : { op, value: timestamp, dateOnly: false };
};

const compare = (pageValue, filter) => {
  if (filter.dateOnly) {
    const date = toDateKey(pageValue);
    if (!date) return false;
    if (filter.op === "<") return date < filter.value;
    if (filter.op === ">") return date > filter.value;
    return date === filter.value;
  }

  const timestamp =
    typeof pageValue?.toMillis === "function"
      ? pageValue.toMillis()
      : new Date(pageValue).getTime();
  if (Number.isNaN(timestamp)) return false;
  if (filter.op === "<") return timestamp < filter.value;
  if (filter.op === ">") return timestamp > filter.value;
  return timestamp === filter.value;
};

// Busca por texto em valores simples ou em listas (author, recipient etc.).
const has = (value, term) => {
  if (!value) return false;
  const needle = String(term).toLowerCase();
  return dv.array(value).some((v) => String(v).toLowerCase().includes(needle));
};

const normalizeTags = (value) => {
  const values = Array.isArray(value)
    ? value
    : String(value ?? "").split(/[\s,]+/);
  return values
    .map((tag) => String(tag).trim().replace(/^#/, ""))
    .filter(Boolean);
};

const matchtags = (wanted, actual) => {
  const have = new Set(normalizeTags(actual));
  return normalizeTags(wanted).every((tag) => have.has(tag));
};

const zettelCounts = new Map();
for (const zettel of dv.pages('"02_zettel"')) {
  const sources = new Set(
    (zettel.file.outlinks ?? [])
      .filter((link) => link.path?.startsWith("01_notes/"))
      .map((link) => link.path.replace(/\.md$/i, "")),
  );
  for (const source of sources) {
    zettelCounts.set(source, (zettelCounts.get(source) ?? 0) + 1);
  }
}
const countZettels = (page) => zettelCounts.get(page.file.path.replace(/\.md$/i, "")) ?? 0;
const missingPage = (page) => page["page-no"] == null || String(page["page-no"]).trim() === "";
const inactiveDays = Number(current["inactive-days"]);

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
  "needs-page",
  "no-zettels",
  "inactive-days",
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
    (!current.tags || matchtags(current.tags, page.file.tags)) &&
    (!current["needs-page"] || missingPage(page)) &&
    (!current["no-zettels"] || countZettels(page) === 0) &&
    (!Number.isFinite(inactiveDays) || inactiveDays <= 0 ||
      page.file.mtime.toMillis() <= Date.now() - inactiveDays * 24 * 60 * 60 * 1000);

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
      "Derived Zettels",
      "Last Modified",
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
      countZettels(p),
      p.file.mtime,
      p.archive,
      p["archive-location"],
    ]),
  );
}
