var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TextFormatPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/segments.ts
var FILE_EXTENSIONS = [
  "md",
  "txt",
  "pdf",
  "canvas",
  "base",
  "csv",
  "json",
  "ya?ml",
  "toml",
  "xml",
  "html?",
  "css",
  "m?[jt]sx?",
  "cjs",
  "py",
  "rb",
  "rs",
  "go",
  "java",
  "kt",
  "swift",
  "c",
  "h",
  "cpp",
  "cs",
  "php",
  "sh",
  "sql",
  "png",
  "jpe?g",
  "gif",
  "svg",
  "webp",
  "mp[34]",
  "wav",
  "zip",
  "docx?",
  "xlsx?",
  "pptx?",
  "epub",
  "log",
  "ini",
  "lua",
  "tsv",
  "rtf",
  "odt",
  "ods",
  "heic",
  "ogg",
  "flac",
  "mov",
  "mkv",
  "gz",
  "exe",
  "bat",
  "ps1",
  "dmg",
  "apk",
  "ipynb",
  "lock",
  "env",
  "com",
  "org",
  "net",
  "io",
  "dev",
  "app",
  "edu",
  "gov"
];
var VERSION_SOURCE = "[vV]\\d+(?:\\.\\d+)+(?![\\p{L}\\p{N}])";
var FILE_NAME_SOURCE = `[\\p{L}\\p{N}_-]+(?:\\.[\\p{L}\\p{N}_-]+)*\\.(?:${FILE_EXTENSIONS.join("|")})(?![\\p{L}\\p{N}])`;
var PROTECTED_SOURCE = [
  // A Templater command: `<% tp.date.now("YYYY") %>` is code.
  "<%[^\\n]*?%>",
  // ``a ` b``: a double-backtick span can hold a single backtick.
  "``[^`\\n](?:[^\\n]*?[^`\\n])?``(?!`)",
  "`[^`\\n]*`",
  // An HTML tag with attributes, whose names and values are not prose:
  // `<span style="font-family: cursive">`. Without attributes it is an
  // autolink's job, below.
  "</?[A-Za-z][A-Za-z0-9-]*\\s[^<>\\n]*>",
  "\\$[^$\\n]+\\$",
  // A block id ending a line, `^my-block`, which links name exactly. (No
  // lookbehind for the space before it: older iOS cannot compile one.)
  "\\^[A-Za-z0-9-]+(?=[ \\t]*$)",
  "\\[\\[[^\\]\\n]*\\]\\]",
  "\\]\\([^)\\s]*\\)",
  "<[^<>\\s]+>",
  "https?://\\S+",
  "www\\.\\S+",
  "[\\w.+-]+@[\\w-]+\\.[\\w-]+(?:\\.[\\w-]+)*",
  FILE_NAME_SOURCE,
  VERSION_SOURCE
].join("|");
var ATOMIC_SOURCE = [
  "\\d+(?:[.,]\\d+)+",
  "(?:\\p{L}\\.){2,}"
].join("|");
var WORD_SOURCE = "[\\p{L}\\p{N}]+(?:['\u2019][\\p{L}\\p{N}]+)*";
var TOKEN_SOURCE = `(${PROTECTED_SOURCE})|(${ATOMIC_SOURCE})|(${WORD_SOURCE})`;
function tokenize(text) {
  const regex = new RegExp(TOKEN_SOURCE, "gu");
  const tokens = [];
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: "separator", text: text.slice(last, match.index) });
    }
    const kind = match[1] !== void 0 ? "protected" : match[2] !== void 0 ? "atomic" : "word";
    tokens.push({ kind, text: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    tokens.push({ kind: "separator", text: text.slice(last) });
  }
  return tokens;
}
function render(tokens) {
  return tokens.map((token) => token.text).join("");
}
function upper(text, locale) {
  return locale ? text.toLocaleUpperCase(locale) : text.toUpperCase();
}
function lower(text, locale) {
  return locale ? text.toLocaleLowerCase(locale) : text.toLowerCase();
}
function capitalise(word, locale) {
  const chars = Array.from(word);
  if (chars.length === 0)
    return word;
  return upper(chars[0], locale) + lower(chars.slice(1).join(""), locale);
}
function isAcronym(word, locale) {
  if (Array.from(word).length < 2)
    return false;
  if (word === lower(word, locale))
    return false;
  return word === upper(word, locale);
}
function isMixedCase(word) {
  return /\p{Ll}\p{Lu}/u.test(word);
}
var QUOTE_MARKERS = /^(?:[ \t]*>[ \t]?)*/;
var FENCE_OPEN = /^(?:[ \t]*>[ \t]?)*[ \t]*(?:(?:[-*+]|\d{1,9}[.)])[ \t]+)?(`{3,}|~{3,})/;
var FENCE_CLOSE = /^(?:[ \t]*>[ \t]?)*[ \t]*(`{3,}|~{3,})[ \t]*$/;
function quoteDepth(line) {
  var _a, _b;
  return ((_b = (_a = QUOTE_MARKERS.exec(line)) == null ? void 0 : _a[0]) != null ? _b : "").split(">").length - 1;
}
function withoutInlineCode(line) {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (line[i] !== "`") {
      out += line[i++];
      continue;
    }
    let run = 1;
    while (line[i + run] === "`")
      run++;
    const runs = /`+/g;
    runs.lastIndex = i + run;
    let close = -1;
    for (let m = runs.exec(line); m; m = runs.exec(line)) {
      if (m[0].length === run) {
        close = m.index;
        break;
      }
    }
    if (close === -1)
      out += line.slice(i, i + run);
    i = close === -1 ? i + run : close + run;
  }
  return out;
}
function countOf(haystack, needle) {
  let count = 0;
  for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, at + needle.length)) {
    count++;
  }
  return count;
}
function blockTracker() {
  let fence = null;
  let fenceDepth = 0;
  let inMath = false;
  return (line) => {
    if (fence !== null && quoteDepth(line) < fenceDepth)
      fence = null;
    if (fence !== null) {
      const close = FENCE_CLOSE.exec(line);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length && quoteDepth(line) === fenceDepth) {
        fence = null;
      }
      return true;
    }
    if (inMath) {
      if (countOf(withoutInlineCode(line), "$$") % 2 === 1)
        inMath = false;
      return true;
    }
    const open = FENCE_OPEN.exec(line);
    if (open && !(open[1][0] === "`" && line.slice(open[0].length).includes("`"))) {
      fence = open[1];
      fenceDepth = quoteDepth(line);
      return true;
    }
    if (countOf(withoutInlineCode(line), "$$") % 2 === 1) {
      inMath = true;
      return true;
    }
    return false;
  };
}
function frontmatterLineCount(line) {
  const first = line(0);
  if (first === void 0 || first.replace(/\s+$/, "") !== "---")
    return 0;
  for (let i = 1; ; i++) {
    const text = line(i);
    if (text === void 0)
      return 0;
    const trimmed = text.replace(/\s+$/, "");
    if (trimmed === "---" || trimmed === "...")
      return i + 1;
  }
}

// src/case.ts
var DEFAULT_STOP_WORDS = [
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "nor",
  "for",
  "yet",
  "so",
  "as",
  "at",
  "by",
  "down",
  "from",
  "in",
  "into",
  "like",
  "near",
  "of",
  "off",
  "on",
  "onto",
  "over",
  "past",
  "per",
  "to",
  "up",
  "upon",
  "via",
  "with",
  "vs",
  "v",
  "versus",
  "than",
  "en"
];
var LINE_PREFIX = /^([ \t]*(?:>[ \t]*)*(?:(?:[-*+]|\d+[.)])[ \t]+(?:\[[ xX/-][ \t]*\][ \t]+)?|#{1,6}[ \t]+)?)([\s\S]*)$/;
var SENTENCE_END = /[.!?…][)"'’”\]]*(?:\s|$)/;
function mapLines(text, fn) {
  const context = { sentenceStart: true };
  const inBlock = blockTracker();
  return text.split("\n").map((line) => {
    if (inBlock(line)) {
      context.sentenceStart = true;
      return line;
    }
    const match = line.match(LINE_PREFIX);
    if (!match)
      return line;
    const [, prefix, body] = match;
    if (body.trim().length === 0) {
      context.sentenceStart = true;
      return line;
    }
    if (prefix.trim().length > 0) {
      context.sentenceStart = true;
    }
    return prefix + fn(body, context);
  }).join("\n");
}
function mapWords(text, options, fn) {
  return mapLines(text, (body) => {
    const tokens = tokenize(body);
    const content = tokens.filter((token) => token.kind !== "separator");
    content.forEach((token, index) => {
      if (token.kind === "word")
        token.text = fn(token.text, index, content);
    });
    return render(tokens);
  });
}
function keepsCase(word, options) {
  return options.preserveAcronyms !== false && (isAcronym(word, options.locale) || isMixedCase(word));
}
function resolveOptions(text, options) {
  if (options.preserveAcronyms === false)
    return options;
  if (text === lower(text, options.locale))
    return options;
  if (text !== upper(text, options.locale))
    return options;
  return { ...options, preserveAcronyms: false };
}
function toUpperCase(text, options = {}) {
  return mapLines(text, (body) => {
    const tokens = tokenize(body);
    for (const token of tokens) {
      if (token.kind === "protected")
        continue;
      token.text = upper(token.text, options.locale);
    }
    return render(tokens);
  });
}
function toLowerCase(text, options = {}) {
  return mapLines(text, (body) => {
    const tokens = tokenize(body);
    for (const token of tokens) {
      if (token.kind === "protected")
        continue;
      token.text = lower(token.text, options.locale);
    }
    return render(tokens);
  });
}
function capitalizeWords(text, options = {}) {
  options = resolveOptions(text, options);
  return mapWords(text, options, (word) => keepsCase(word, options) ? word : capitalise(word, options.locale));
}
function toTitleCase(text, options = {}) {
  var _a;
  options = resolveOptions(text, options);
  const stopWords = new Set(
    ((_a = options.stopWords) != null ? _a : DEFAULT_STOP_WORDS).map((word) => word.toLowerCase())
  );
  return mapWords(text, options, (word, index, tokens) => {
    if (keepsCase(word, options))
      return word;
    const isEdge = index === 0 || index === tokens.length - 1;
    if (!isEdge && stopWords.has(word.toLowerCase())) {
      return lower(word, options.locale);
    }
    return capitalise(word, options.locale);
  });
}
function sentenceCase(text, options, flatten) {
  options = resolveOptions(text, options);
  return mapLines(text, (body, context) => {
    const tokens = tokenize(body);
    for (const token of tokens) {
      if (token.kind === "separator") {
        if (SENTENCE_END.test(token.text))
          context.sentenceStart = true;
        continue;
      }
      if (token.kind === "protected" || token.kind === "atomic") {
        context.sentenceStart = false;
        continue;
      }
      if (keepsCase(token.text, options)) {
        context.sentenceStart = false;
        continue;
      }
      if (context.sentenceStart) {
        token.text = flatten ? capitalise(token.text, options.locale) : upper(Array.from(token.text)[0], options.locale) + Array.from(token.text).slice(1).join("");
      } else if (flatten) {
        token.text = lower(token.text, options.locale);
      }
      context.sentenceStart = false;
    }
    return render(tokens);
  });
}
function toSentenceCase(text, options = {}) {
  return sentenceCase(text, options, true);
}
function capitalizeSentences(text, options = {}) {
  return sentenceCase(text, options, false);
}
function cycleCase(text, options = {}) {
  const cycling = { ...options, preserveAcronyms: false };
  if (text === toLowerCase(text, cycling))
    return toTitleCase(text, cycling);
  if (text === toTitleCase(text, cycling))
    return toUpperCase(text, cycling);
  return toLowerCase(text, cycling);
}

// src/identifier.ts
var LINE_PREFIX2 = /^([ \t]*(?:>[ \t]*)*(?:(?:[-*+]|\d+[.)])[ \t]+(?:\[[ xX/-][ \t]*\][ \t]+)?|#{1,6}[ \t]+)?)([\s\S]*)$/;
var PROTECTED = /`[^`\n]*`|\$[^$\n]+\$|!?\[\[[^\]\n]*\]\]|!?\[[^\]\n]*\]\([^)\s]*\)|<[^<>\s]+>|https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w-]+\.[\w-]+(?:\.[\w-]+)*/gu;
var CHUNK = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
function breakCamel(chunk) {
  return chunk.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1\0$2").replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1\0$2").split("\0");
}
function splitWords(text) {
  var _a;
  const words = [];
  for (const chunk of (_a = text.match(CHUNK)) != null ? _a : []) {
    for (const word of breakCamel(chunk.replace(/['’]/g, ""))) {
      if (word.length > 0)
        words.push(word);
    }
  }
  return words;
}
var TRANSLITERATIONS = {
  "\xDF": "ss",
  "\u1E9E": "ss",
  "\xE6": "ae",
  "\xC6": "ae",
  "\u0153": "oe",
  "\u0152": "oe",
  "\xF8": "o",
  "\xD8": "o",
  "\u0111": "d",
  "\u0110": "d",
  "\xF0": "d",
  "\xD0": "d",
  "\u0142": "l",
  "\u0141": "l",
  "\xFE": "th",
  "\xDE": "th",
  "\u0131": "i"
};
function stripAccents(text) {
  return text.normalize("NFKD").replace(/\p{M}+/gu, "").replace(/[ßẞæÆœŒøØđĐðÐłŁþÞı]/g, (letter) => TRANSLITERATIONS[letter]);
}
function capitalise2(word, locale) {
  const chars = Array.from(word);
  return upper(chars[0], locale) + lower(chars.slice(1).join(""), locale);
}
function joinWords(words, style, locale) {
  switch (style) {
    case "camel":
      return words.map((word, i) => i === 0 ? lower(word, locale) : capitalise2(word, locale)).join("");
    case "pascal":
      return words.map((word) => capitalise2(word, locale)).join("");
    case "snake":
      return words.map((word) => lower(word, locale)).join("_");
    case "constant":
      return words.map((word) => upper(word, locale)).join("_");
    case "kebab":
      return words.map((word) => lower(word, locale)).join("-");
    case "dot":
      return words.map((word) => lower(word, locale)).join(".");
    case "train":
      return words.map((word) => capitalise2(word, locale)).join("-");
    case "pascal-snake":
      return words.map((word) => capitalise2(word, locale)).join("_");
    case "path":
      return words.map((word) => lower(word, locale)).join("/");
    case "capital":
      return words.map((word) => capitalise2(word, locale)).join(" ");
    case "no":
      return words.map((word) => lower(word, locale)).join(" ");
    case "slug":
      return splitWords(stripAccents(words.join(" "))).map((word) => lower(word, locale)).join("-");
  }
}
function convertRun(run, style, locale) {
  var _a, _b, _c, _d;
  const words = splitWords(run);
  if (words.length === 0)
    return run;
  const lead = (_b = (_a = /^\s*/.exec(run)) == null ? void 0 : _a[0]) != null ? _b : "";
  const trail = (_d = (_c = /\s*$/.exec(run)) == null ? void 0 : _c[0]) != null ? _d : "";
  return lead + joinWords(words, style, locale) + trail;
}
function convertBody(body, style, locale) {
  let out = "";
  let last = 0;
  PROTECTED.lastIndex = 0;
  for (let match = PROTECTED.exec(body); match !== null; match = PROTECTED.exec(body)) {
    out += convertRun(body.slice(last, match.index), style, locale) + match[0];
    last = match.index + match[0].length;
  }
  return out + convertRun(body.slice(last), style, locale);
}
function toIdentifierCase(text, style, options = {}) {
  const inBlock = blockTracker();
  return text.split("\n").map((line) => {
    if (inBlock(line))
      return line;
    const match = LINE_PREFIX2.exec(line);
    if (!match)
      return line;
    const [, prefix, body] = match;
    return prefix + convertBody(body, style, options.locale);
  }).join("\n");
}

// src/cleanup.ts
var STRUCTURAL = /^[ \t]*(?:#{1,6}(?:[ \t]|$)|={2,}[ \t]*$|-{3,}[ \t]*$|\*{3,}[ \t]*$|_{3,}[ \t]*$|\||[ \t]*$)/;
var LINE_PREFIX3 = /^([ \t]*(?:>[ \t]*)*)((?:[-*+]|\d+[.)])(?:[ \t]+(?:\[[ xX/-][ \t]*\](?:[ \t]+|$))?|$)|#{1,6}[ \t]+)?([\s\S]*)$/;
var HARD_BREAK = /(?: {2}|\\)$/;
var CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/;
function readLine(raw) {
  const match = raw.match(LINE_PREFIX3);
  const [, quote = "", marker = "", body = ""] = match != null ? match : [];
  return {
    raw,
    quote,
    marker,
    body,
    structural: STRUCTURAL.test(raw)
  };
}
function joinWrappedLines(text, options = {}) {
  const lines = text.split("\n").map(readLine);
  const output = [];
  const inBlock = blockTracker();
  for (const line of lines) {
    if (inBlock(line.raw)) {
      line.structural = true;
      output.push(line);
      continue;
    }
    const previous = output[output.length - 1];
    const canJoin = previous !== void 0 && !previous.structural && !line.structural && previous.body.trim().length > 0 && line.body.trim().length > 0 && line.marker === "" && line.quote.trim() === previous.quote.trim() && (options.keepHardBreaks === false || !HARD_BREAK.test(previous.body));
    if (!canJoin) {
      output.push(line);
      continue;
    }
    previous.body = joinBodies(previous.body, line.body.replace(/^[ \t]+/, ""), options);
  }
  return output.map((line) => line.quote + line.marker + line.body).join("\n");
}
function joinBodies(left, right, options) {
  const trimmed = left.replace(/[ \t]+$/, "");
  if (/\p{L}-$/u.test(trimmed) && /^\p{Ll}/u.test(right)) {
    return options.removeHyphen === false ? trimmed + right : trimmed.slice(0, -1) + right;
  }
  if (CJK.test(trimmed.slice(-1)) && CJK.test(right.slice(0, 1))) {
    return trimmed + right;
  }
  return `${trimmed} ${right}`;
}
function removeLineHyphenation(text) {
  return text.replace(/(\p{L})-[ \t]*\n[ \t]*(\p{Ll})/gu, "$1$2");
}
function removeInvisibles(text) {
  return text.replace(/\r\n?/g, "\n").split(LINK_SPANS).map((part, i) => i % 2 === 1 ? part : removeInvisiblesFromProse(part)).join("");
}
var LINK_SPANS = /(!?\[\[[^\]\n]*\]\]|\]\([^)\n]*\)|https?:\/\/[^\s<>]+)/;
var JOINABLE = /\p{M}|\p{So}|[\u{1F3FB}-\u{1F3FF}]|\uFE0F|(?![A-Za-z])\p{L}/u;
function removeInvisiblesFromProse(text) {
  const chars = Array.from(text);
  return chars.map((char, i) => {
    var _a, _b;
    if (!/[\u00AD\u200B\u200C\u2060\uFEFF\u200D]/.test(char))
      return char;
    const joins = (char === "\u200C" || char === "\u200D") && JOINABLE.test((_a = chars[i - 1]) != null ? _a : "") && JOINABLE.test((_b = chars[i + 1]) != null ? _b : "");
    return joins ? char : "";
  }).join("").replace(/[\u00A0\u2000-\u200A\u2007\u202F\u205F]/g, " ");
}
var LIGATURES = {
  "\uFB00": "ff",
  "\uFB01": "fi",
  "\uFB02": "fl",
  "\uFB03": "ffi",
  "\uFB04": "ffl",
  "\uFB05": "st",
  "\uFB06": "st"
};
function replaceLigatures(text) {
  return eachProseSegment(text, (segment) => segment.replace(/[\uFB00-\uFB06]/g, (ligature) => LIGATURES[ligature]));
}
function straightenPunctuation(text) {
  return text.replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"').replace(/\u2014/g, "--").replace(/[\u2010\u2011\u2012\u2013\u2212]/g, "-").replace(/\u2026/g, "...");
}
function linksToPlainText(text, options = {}) {
  return eachProseSegment(text, (segment) => stripLinks(segment, options));
}
function eachProseSegment(text, fn) {
  const inBlock = blockTracker();
  return text.split("\n").map((line) => {
    if (inBlock(line))
      return line;
    return line.split(/(`+[^`]*`+)/).map((part, index) => index % 2 === 1 ? part : fn(part)).join("");
  }).join("\n");
}
function matchDelimiter(text, start, open, close) {
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === "\\") {
      i += 1;
      continue;
    }
    if (text[i] === open)
      depth += 1;
    else if (text[i] === close) {
      depth -= 1;
      if (depth === 0)
        return i;
    }
  }
  return -1;
}
function wikilinkText(inner) {
  const pipe = inner.indexOf("|");
  return (pipe === -1 ? inner : inner.slice(pipe + 1)).trim();
}
function stripLinks(text, options) {
  const keepAlt = options.keepImageAltText !== false;
  let out = "";
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    if (text[i] === "\\") {
      out += text.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (rest.startsWith("[[") || rest.startsWith("![[")) {
      const isEmbed = rest.startsWith("!");
      const open = i + (isEmbed ? 1 : 0);
      const close = text.indexOf("]]", open + 2);
      if (close !== -1) {
        out += wikilinkText(text.slice(open + 2, close));
        i = close + 2;
        continue;
      }
    }
    if (text[i] === "<") {
      const close = text.indexOf(">", i + 1);
      const inner = close === -1 ? "" : text.slice(i + 1, close);
      if (close !== -1 && /^(?:https?:\/\/|mailto:)\S+$/.test(inner)) {
        out += inner.replace(/^mailto:/, "");
        i = close + 1;
        continue;
      }
    }
    if (text[i] === "[" || text[i] === "!" && text[i + 1] === "[") {
      const isImage = text[i] === "!";
      const open = isImage ? i + 1 : i;
      const labelEnd = matchDelimiter(text, open, "[", "]");
      const after = labelEnd === -1 ? "" : text[labelEnd + 1];
      if (labelEnd !== -1 && (after === "(" || after === "[")) {
        const targetEnd = after === "(" ? matchDelimiter(text, labelEnd + 1, "(", ")") : matchDelimiter(text, labelEnd + 1, "[", "]");
        if (targetEnd !== -1) {
          const label = stripLinks(text.slice(open + 1, labelEnd), options);
          out += isImage && !keepAlt ? "" : label;
          i = targetEnd + 1;
          continue;
        }
      }
    }
    out += text[i];
    i += 1;
  }
  return out;
}

// src/lines.ts
var LIST_MARKER = /^(\s*)([-*+]|(\d+)([.)]))(\s+)(\[.\]\s+)?/;
function indentOf(line) {
  var _a, _b;
  return ((_b = (_a = /^[ \t]*/.exec(line)) == null ? void 0 : _a[0]) != null ? _b : "").replace(/\t/g, "    ").length;
}
function inCode(lines) {
  const inBlock = blockTracker();
  return lines.map((line) => inBlock(line));
}
function sortKey(line) {
  return line.replace(LIST_MARKER, "").trim();
}
var collator = (locale) => new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
function units(lines) {
  const nonBlank = lines.filter((line) => line.trim() !== "");
  if (nonBlank.length === 0)
    return lines.map((line) => [line]);
  const base = Math.min(...nonBlank.map(indentOf));
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const current2 = result[result.length - 1];
    if (line.trim() === "") {
      const next = lines.slice(i + 1).find((l) => l.trim() !== "");
      if (current2 && next !== void 0 && indentOf(next) > base)
        current2.push(line);
      else
        result.push([line]);
    } else if (current2 && indentOf(line) > base && current2[0].trim() !== "") {
      current2.push(line);
    } else {
      result.push([line]);
    }
  }
  return result;
}
function renumber(sorted) {
  const heads = sorted.filter((unit) => unit[0].trim() !== "").map((unit) => LIST_MARKER.exec(unit[0]));
  if (heads.length === 0 || heads.some((m) => m === null || m[3] === void 0))
    return;
  let n = Math.min(...heads.map((m) => Number(m[3])));
  for (const unit of sorted) {
    if (unit[0].trim() === "")
      continue;
    unit[0] = unit[0].replace(
      LIST_MARKER,
      (_all, indent, _m, _num, delim, space, box) => `${indent}${n}${delim}${space}${box != null ? box : ""}`
    );
    n++;
  }
}
function sortLines(text, order = "asc", locale) {
  const lines = text.split("\n");
  const trailing = lines.length > 1 && lines[lines.length - 1] === "" ? lines.pop() : void 0;
  const compare = collator(locale);
  const all = units(lines);
  const blanks = all.filter((unit) => unit[0].trim() === "");
  const items = all.filter((unit) => unit[0].trim() !== "");
  items.sort((a, b) => {
    const byKey = compare.compare(sortKey(a[0]), sortKey(b[0])) || compare.compare(a[0], b[0]);
    return order === "asc" ? byKey : -byKey;
  });
  renumber(items);
  const out = [...items, ...blanks].flat();
  if (trailing !== void 0)
    out.push(trailing);
  return out.join("\n");
}
function removeDuplicateLines(text) {
  const lines = text.split("\n");
  const code = inCode(lines);
  const seen = /* @__PURE__ */ new Set();
  return lines.filter((line, i) => {
    if (code[i] || line.trim() === "")
      return true;
    const key = line.replace(/\s+$/, "");
    if (seen.has(key))
      return false;
    seen.add(key);
    return true;
  }).join("\n");
}
function removeBlankLines(text) {
  const lines = text.split("\n");
  const trailing = lines.length > 1 && lines[lines.length - 1] === "";
  const code = inCode(lines);
  const kept = lines.filter((line, i) => code[i] || line.trim() !== "");
  if (trailing && kept[kept.length - 1] !== "")
    kept.push("");
  return kept.join("\n");
}
function collapseBlankLines(text) {
  const lines = text.split("\n");
  const code = inCode(lines);
  return lines.filter((line, i) => code[i] || line.trim() !== "" || i === 0 || lines[i - 1].trim() !== "" || code[i - 1]).join("\n");
}

// src/locales/de.ts
var de = {
  // Commands
  "command.upper": "Gro\xDFbuchstaben",
  "command.lower": "Kleinbuchstaben",
  "command.title": "Titel-Schreibweise",
  "command.sentence": "Satz-Schreibweise",
  "command.capitalizeWords": "Jedes Wort gro\xDFschreiben",
  "command.capitalizeSentences": "S\xE4tze gro\xDFschreiben, Rest unver\xE4ndert lassen",
  "command.cycle": "Schreibweise durchschalten",
  "command.slug": "Slug (Kleinbuchstaben, ohne Akzente, mit Bindestrichen)",
  "command.joinLines": "Umbrochene Zeilen verbinden",
  "command.dehyphenate": "\xDCber Zeilen getrennte W\xF6rter wieder verbinden",
  "command.stripInvisibles": "Unsichtbare Zeichen entfernen",
  "command.replaceLigatures": "Ligaturen ersetzen",
  "command.straightenPunctuation": "Anf\xFChrungszeichen und Striche begradigen",
  "command.removeTrailingWhitespace": "Leerzeichen am Zeilenende entfernen",
  "command.collapseSpaces": "Mehrfache Leerzeichen zusammenfassen",
  "command.unlink": "Links in einfachen Text umwandeln",
  "command.sortLines": "Zeilen von A bis Z sortieren",
  "command.sortLinesDesc": "Zeilen von Z bis A sortieren",
  "command.dedupeLines": "Doppelte Zeilen entfernen",
  "command.removeBlankLines": "Leerzeilen entfernen",
  "command.collapseBlankLines": "\xDCberz\xE4hlige Leerzeilen entfernen (eine bleibt)",
  "command.tidyNote": "Notiz aufr\xE4umen",
  "command.pickCase": "Gro\xDF-/Kleinschreibung \xE4ndern\u2026",
  "command.runSavedReplacement": "Gespeicherte Ersetzung ausf\xFChren\u2026",
  "command.replace": "Ersetzen: {name}",
  // Notices
  "notice.nothingToFormat": "Nichts zu formatieren.",
  "notice.nothingToTidy": "Nichts aufzur\xE4umen.",
  "notice.noTidySteps": "Es sind keine Aufr\xE4umschritte eingeschaltet. W\xE4hle in den Einstellungen welche aus.",
  "notice.noSavedReplacements": "Noch keine gespeicherten Ersetzungen. F\xFCge welche in den Einstellungen der Erweiterung hinzu.",
  "notice.replacementProblem": "Ersetzen: {name}: {problem}",
  "notice.unnamed": "ohne Namen",
  "notice.skippedInCode": "Die Auswahl beginnt oder endet in Code und blieb deshalb unver\xE4ndert.",
  "notice.noMatches": "Keine Treffer f\xFCr \u201E{name}\u201C.",
  "notice.replacements.one": "1 Ersetzung vorgenommen.",
  "notice.replacements.other": "{count} Ersetzungen vorgenommen.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "Schreibweise f\xFCr die Auswahl w\xE4hlen",
  "modal.noChange": "Keine \xC4nderung",
  "modal.pickReplacement": "Gespeicherte Ersetzung zum Ausf\xFChren w\xE4hlen",
  "modal.noName": "(ohne Namen)",
  "modal.tidy.line.one": "{step}: 1 Zeile",
  "modal.tidy.line.other": "{step}: {count} Zeilen",
  "modal.tidy.confirm": "Aufr\xE4umen",
  "modal.tidy.cancel": "Abbrechen",
  // The steps of Tidy note
  "tidy.invisibles": "Unsichtbare Zeichen entfernen",
  "tidy.ligatures": "Ligaturen ersetzen",
  "tidy.join": "Umbrochene Zeilen verbinden",
  "tidy.spaces": "Mehrfache Leerzeichen zusammenfassen",
  "tidy.trailing": "Leerzeichen am Zeilenende entfernen",
  "tidy.blank": "\xDCberz\xE4hlige Leerzeilen entfernen",
  // Why a saved replacement cannot run
  "error.findEmpty": "Der Suchtext ist leer.",
  "error.invalidRegex": "Kein g\xFCltiger regul\xE4rer Ausdruck: {reason}",
  // Settings: headings
  "heading.case": "Gro\xDF-/Kleinschreibung",
  "heading.cleanup": "Bereinigung",
  "heading.tidy": "Notiz aufr\xE4umen",
  "heading.replacements": "Gespeicherte Ersetzungen",
  // Settings: dropdown options
  "option.systemDefault": "Systemstandard",
  "option.turkish": "T\xFCrkisch",
  "option.azerbaijani": "Aserbaidschanisch",
  "option.lithuanian": "Litauisch",
  "option.wholeLine": "Ganze Zeile",
  "option.wordAtCaret": "Wort an der Schreibmarke",
  // Settings
  "setting.locale.name": "Sprachregeln",
  "setting.locale.desc": "T\xFCrkisch und Aserbaidschanisch ordnen das i mit und ohne Punkt anders zu als alle anderen Sprachen.",
  "setting.preserveAcronyms.name": "Akronyme unver\xE4ndert lassen",
  "setting.preserveAcronyms.desc": "L\xE4sst Akronyme wie NASA und PDF sowie Namen wie iPhone, macOS und GitHub unver\xE4ndert. Wird ignoriert, wenn die ganze Auswahl schon in Gro\xDFbuchstaben steht, weil dann jedes Wort wie ein Akronym aussieht.",
  "setting.stopWords.name": "W\xF6rter, die die Titel-Schreibweise klein l\xE4sst",
  "setting.stopWords.desc": "Durch Kommas getrennt. Das erste und das letzte Wort eines Titels werden immer gro\xDFgeschrieben, was diese Liste auch sagt.",
  "setting.removeHyphenOnJoin.name": "Bindestrich beim Verbinden von Zeilen entfernen",
  "setting.removeHyphenOnJoin.desc": 'Ein PDF trennt ein Wort als "trans-" und "lation". Schalte dies bei Texten aus, in denen ein echtes Kompositum wie "well-known" wahrscheinlicher ist als ein getrenntes Wort.',
  "setting.caseTarget.name": "Ohne Auswahl die Schreibweise \xE4ndern von",
  "setting.caseTarget.desc": "Der ganzen Zeile oder nur des Wortes an der Schreibmarke.",
  "setting.tidyInvisibles.name": "Unsichtbare Zeichen entfernen",
  "setting.tidyInvisibles.desc": "Nullbreite Zeichen und weiche Trennstriche fallen weg; gesch\xFCtzte Leerzeichen werden zu normalen Leerzeichen.",
  "setting.tidyLigatures.name": "Ligaturen ersetzen",
  "setting.tidyLigatures.desc": "\uFB01 und \uFB02 werden zu fi und fl.",
  "setting.tidyJoin.name": "Umbrochene Zeilen verbinden",
  "setting.tidyJoin.desc": "Verbindet einen fest \xFCber mehrere Zeilen umbrochenen Absatz. Standardm\xE4\xDFig aus: Es \xE4ndert die Zeilenstruktur.",
  "setting.tidySpaces.name": "Mehrfache Leerzeichen zusammenfassen",
  "setting.tidySpaces.desc": "Folgen von Leerzeichen zwischen W\xF6rtern werden zu einem. Einr\xFCckungen, Tabellen und Code bleiben unber\xFChrt.",
  "setting.tidyTrailing.name": "Leerzeichen am Zeilenende entfernen",
  "setting.tidyTrailing.desc": "Leerzeichen und Tabulatoren am Ende von Zeilen.",
  "setting.tidyBlank.name": "\xDCberz\xE4hlige Leerzeilen entfernen",
  "setting.tidyBlank.desc": "Folgen von Leerzeilen werden zu einer.",
  "setting.keepHardBreaks.name": "Harte Zeilenumbr\xFCche behalten",
  "setting.keepHardBreaks.desc": "Zwei Leerzeichen am Ende einer Textzeile sind in Markdown ein Zeilenumbruch, daher beh\xE4lt das Entfernen von Leerzeichen am Zeilenende sie. Schalte dies aus, um auch sie zu entfernen.",
  "setting.confirmTidy.name": "Vor dem Aufr\xE4umen best\xE4tigen",
  "setting.confirmTidy.desc": "Zeigt vor dem Anwenden, wie viele Zeilen jeder Schritt \xE4ndern w\xFCrde.",
  "setting.cleanOnPaste.name": "Beim Einf\xFCgen aufr\xE4umen",
  "setting.cleanOnPaste.desc": "F\xFChrt die obigen Schritte f\xFCr eingef\xFCgten einfachen Text aus. Nie in Code oder Frontmatter; Einf\xFCgen mit Formatierung \xFCberl\xE4sst es Obsidian. Standardm\xE4\xDFig aus.",
  "setting.keepImageAltText.name": "Alternativtext von Bildern behalten",
  "setting.keepImageAltText.desc": "L\xE4sst die Beschreibung stehen, wenn ein Bild in einfachen Text umgewandelt wird, statt das Bild ganz zu entfernen.",
  // Settings: saved replacements
  "replacements.name": "Deine Suchen-und-Ersetzen-Befehle",
  "replacements.desc": "Jede Ersetzung wird zu einem Befehl \u201EErsetzen: <Name>\u201C, dem du ein Tastenk\xFCrzel geben kannst, und steht in \u201EGespeicherte Ersetzung ausf\xFChren\u2026\u201C. Sie wirkt auf die Auswahl oder, wenn nichts ausgew\xE4hlt ist, auf die ganze Notiz und ber\xFChrt nie Code oder Frontmatter.",
  "replacements.nameField": "Name",
  "replacements.nameDesc": "Der Befehl hei\xDFt \u201EErsetzen: <Name>\u201C. Ohne Namen gibt es keinen Befehl.",
  "replacements.namePlaceholder": "Gedankenstriche korrigieren",
  "replacements.delete": "Diese Ersetzung l\xF6schen",
  "replacements.find": "Suchen",
  "replacements.replaceWith": "Ersetzen durch",
  "replacements.replaceWithDesc": "Leer lassen, um die Treffer zu l\xF6schen. Bei aktivem regul\xE4rem Ausdruck ist $1 die erste Gruppe und \\n ein Zeilenumbruch.",
  "replacements.regex": "Regul\xE4rer Ausdruck",
  "replacements.matchCase": "Gro\xDF-/Kleinschreibung beachten",
  "replacements.add": "Ersetzung hinzuf\xFCgen"
};
var de_default = de;

// src/locales/en.ts
var en = {
  // Commands
  "command.upper": "Uppercase",
  "command.lower": "Lowercase",
  "command.title": "Title case",
  "command.sentence": "Sentence case",
  "command.capitalizeWords": "Capitalize each word",
  "command.capitalizeSentences": "Capitalize sentences, leaving the rest",
  "command.cycle": "Cycle case",
  "command.slug": "Slug (lowercase, no accents, hyphens)",
  "command.joinLines": "Join wrapped lines",
  "command.dehyphenate": "Rejoin words split across lines",
  "command.stripInvisibles": "Remove invisible characters",
  "command.replaceLigatures": "Replace ligatures",
  "command.straightenPunctuation": "Straighten quotes and dashes",
  "command.removeTrailingWhitespace": "Remove trailing whitespace",
  "command.collapseSpaces": "Collapse multiple spaces",
  "command.unlink": "Links to plain text",
  "command.sortLines": "Sort lines A to Z",
  "command.sortLinesDesc": "Sort lines Z to A",
  "command.dedupeLines": "Remove duplicate lines",
  "command.removeBlankLines": "Remove blank lines",
  "command.collapseBlankLines": "Remove extra blank lines (keep one)",
  "command.tidyNote": "Tidy note",
  "command.pickCase": "Change case\u2026",
  "command.runSavedReplacement": "Run a saved replacement\u2026",
  "command.replace": "Replace: {name}",
  // Notices
  "notice.nothingToFormat": "Nothing to format.",
  "notice.nothingToTidy": "Nothing to tidy.",
  "notice.noTidySteps": "No tidy steps are turned on. Choose some in the settings.",
  "notice.noSavedReplacements": "No saved replacements yet. Add some in the plugin settings.",
  "notice.replacementProblem": "Replace: {name}: {problem}",
  "notice.unnamed": "Unnamed",
  "notice.skippedInCode": "The selection starts or ends inside code, so it was left alone.",
  "notice.noMatches": 'No matches for "{name}".',
  "notice.replacements.one": "Made 1 replacement.",
  "notice.replacements.other": "Made {count} replacements.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "Pick a case for the selection",
  "modal.noChange": "No change",
  "modal.pickReplacement": "Pick a saved replacement to run",
  "modal.noName": "(Unnamed)",
  "modal.tidy.line.one": "{step}: 1 line",
  "modal.tidy.line.other": "{step}: {count} lines",
  "modal.tidy.confirm": "Tidy",
  "modal.tidy.cancel": "Cancel",
  // The steps of Tidy note
  "tidy.invisibles": "Remove invisible characters",
  "tidy.ligatures": "Replace ligatures",
  "tidy.join": "Join wrapped lines",
  "tidy.spaces": "Collapse multiple spaces",
  "tidy.trailing": "Remove trailing whitespace",
  "tidy.blank": "Remove extra blank lines",
  // Why a saved replacement cannot run
  "error.findEmpty": "Find text is empty.",
  "error.invalidRegex": "Not a valid regular expression: {reason}",
  // Settings: headings
  "heading.case": "Case",
  "heading.cleanup": "Cleanup",
  "heading.tidy": "Tidy note",
  "heading.replacements": "Saved replacements",
  // Settings: dropdown options
  "option.systemDefault": "System default",
  "option.turkish": "Turkish",
  "option.azerbaijani": "Azerbaijani",
  "option.lithuanian": "Lithuanian",
  "option.wholeLine": "Whole line",
  "option.wordAtCaret": "Word at the caret",
  // Settings
  "setting.locale.name": "Language rules",
  "setting.locale.desc": "Turkish and Azerbaijani map the dotted and dotless i differently from every other language.",
  "setting.preserveAcronyms.name": "Keep acronyms as they are",
  "setting.preserveAcronyms.desc": "Leaves acronyms like NASA and PDF, and names like iPhone, macOS and GitHub, as they are. Ignored when the whole selection is already uppercase, since then every word looks like an acronym.",
  "setting.stopWords.name": "Words title case keeps lowercase",
  "setting.stopWords.desc": "Comma separated. The first and last word of a title are always capitalized, whatever this list says.",
  "setting.removeHyphenOnJoin.name": "Drop the hyphen when joining lines",
  "setting.removeHyphenOnJoin.desc": 'A PDF breaks a word as "trans-" and "lation". Turn this off for text where a real compound such as "well-known" is likelier than a broken word.',
  "setting.caseTarget.name": "With no selection, change case of",
  "setting.caseTarget.desc": "The whole line, or only the word at the caret.",
  "setting.tidyInvisibles.name": "Remove invisible characters",
  "setting.tidyInvisibles.desc": "Zero-width characters and soft hyphens go; non-breaking spaces become spaces.",
  "setting.tidyLigatures.name": "Replace ligatures",
  "setting.tidyLigatures.desc": "\uFB01 and \uFB02 become fi and fl.",
  "setting.tidyJoin.name": "Join wrapped lines",
  "setting.tidyJoin.desc": "Merges a paragraph hard-wrapped across lines. Off by default: it changes the line structure.",
  "setting.tidySpaces.name": "Collapse multiple spaces",
  "setting.tidySpaces.desc": "Runs of spaces between words become one. Indentation, tables and code are left alone.",
  "setting.tidyTrailing.name": "Remove trailing whitespace",
  "setting.tidyTrailing.desc": "Spaces and tabs at the end of lines.",
  "setting.tidyBlank.name": "Remove extra blank lines",
  "setting.tidyBlank.desc": "Runs of blank lines become one.",
  "setting.keepHardBreaks.name": "Keep hard line breaks",
  "setting.keepHardBreaks.desc": "Two trailing spaces before a line of text are a line break in Markdown, so trailing whitespace removal keeps them. Turn this off to strip them too.",
  "setting.confirmTidy.name": "Confirm before tidying",
  "setting.confirmTidy.desc": "Shows how many lines each step would change before applying.",
  "setting.cleanOnPaste.name": "Tidy on paste",
  "setting.cleanOnPaste.desc": "Runs the steps above on plain text you paste. Never inside code or frontmatter, and pastes that carry formatting are left to Obsidian. Off by default.",
  "setting.keepImageAltText.name": "Keep image alt text",
  "setting.keepImageAltText.desc": "Leaves the description behind when an image is turned into plain text, rather than removing the image entirely.",
  // Settings: saved replacements
  "replacements.name": "Your find-and-replace commands",
  "replacements.desc": 'Each replacement becomes a command, "Replace: <name>", that you can give a hotkey, and is listed in "Run a saved replacement\u2026". It works on the selection, or on the whole note when nothing is selected, and never touches code or front matter.',
  "replacements.nameField": "Name",
  "replacements.nameDesc": 'The command is called "Replace: <name>". Without a name there is no command.',
  "replacements.namePlaceholder": "Fix dashes",
  "replacements.delete": "Delete this replacement",
  "replacements.find": "Find",
  "replacements.replaceWith": "Replace with",
  "replacements.replaceWithDesc": "Leave empty to delete the matches. With regular expression on, $1 is the first group and \\n a line break.",
  "replacements.regex": "Regular expression",
  "replacements.matchCase": "Match case",
  "replacements.add": "Add a replacement"
};
var en_default = en;

// src/locales/es.ts
var es = {
  // Commands
  "command.upper": "May\xFAsculas",
  "command.lower": "Min\xFAsculas",
  "command.title": "May\xFAsculas de t\xEDtulo",
  "command.sentence": "May\xFAscula de oraci\xF3n",
  "command.capitalizeWords": "Poner en may\xFAscula cada palabra",
  "command.capitalizeSentences": "Poner en may\xFAscula las oraciones, sin tocar el resto",
  "command.cycle": "Alternar may\xFAsculas y min\xFAsculas",
  "command.slug": "Slug (min\xFAsculas, sin acentos, con guiones)",
  "command.joinLines": "Unir l\xEDneas partidas",
  "command.dehyphenate": "Reunir palabras partidas entre l\xEDneas",
  "command.stripInvisibles": "Quitar caracteres invisibles",
  "command.replaceLigatures": "Reemplazar ligaduras",
  "command.straightenPunctuation": "Enderezar comillas y rayas",
  "command.removeTrailingWhitespace": "Quitar espacios al final de las l\xEDneas",
  "command.collapseSpaces": "Reducir espacios m\xFAltiples",
  "command.unlink": "Enlaces a texto sin formato",
  "command.sortLines": "Ordenar l\xEDneas de la A a la Z",
  "command.sortLinesDesc": "Ordenar l\xEDneas de la Z a la A",
  "command.dedupeLines": "Quitar l\xEDneas duplicadas",
  "command.removeBlankLines": "Quitar l\xEDneas en blanco",
  "command.collapseBlankLines": "Quitar l\xEDneas en blanco sobrantes (dejar una)",
  "command.tidyNote": "Ordenar nota",
  "command.pickCase": "Cambiar may\xFAsculas y min\xFAsculas\u2026",
  "command.runSavedReplacement": "Ejecutar un reemplazo guardado\u2026",
  "command.replace": "Reemplazar: {name}",
  // Notices
  "notice.nothingToFormat": "No hay nada que formatear.",
  "notice.nothingToTidy": "No hay nada que ordenar.",
  "notice.noTidySteps": "No hay pasos de orden activados. Elige alguno en los ajustes.",
  "notice.noSavedReplacements": "A\xFAn no hay reemplazos guardados. A\xF1ade alguno en los ajustes del complemento.",
  "notice.replacementProblem": "Reemplazar: {name}: {problem}",
  "notice.unnamed": "sin nombre",
  "notice.skippedInCode": "La selecci\xF3n empieza o termina dentro de c\xF3digo, as\xED que se dej\xF3 como estaba.",
  "notice.noMatches": 'No hay coincidencias para "{name}".',
  "notice.replacements.one": "Se hizo 1 reemplazo.",
  "notice.replacements.other": "Se hicieron {count} reemplazos.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "Elige may\xFAsculas o min\xFAsculas para la selecci\xF3n",
  "modal.noChange": "Sin cambios",
  "modal.pickReplacement": "Elige un reemplazo guardado para ejecutar",
  "modal.noName": "(sin nombre)",
  "modal.tidy.line.one": "{step}: 1 l\xEDnea",
  "modal.tidy.line.other": "{step}: {count} l\xEDneas",
  "modal.tidy.confirm": "Ordenar",
  "modal.tidy.cancel": "Cancelar",
  // The steps of Tidy note
  "tidy.invisibles": "Quitar caracteres invisibles",
  "tidy.ligatures": "Reemplazar ligaduras",
  "tidy.join": "Unir l\xEDneas partidas",
  "tidy.spaces": "Reducir espacios m\xFAltiples",
  "tidy.trailing": "Quitar espacios al final de las l\xEDneas",
  "tidy.blank": "Quitar l\xEDneas en blanco sobrantes",
  // Why a saved replacement cannot run
  "error.findEmpty": "El texto a buscar est\xE1 vac\xEDo.",
  "error.invalidRegex": "No es una expresi\xF3n regular v\xE1lida: {reason}",
  // Settings: headings
  "heading.case": "May\xFAsculas y min\xFAsculas",
  "heading.cleanup": "Limpieza",
  "heading.tidy": "Ordenar nota",
  "heading.replacements": "Reemplazos guardados",
  // Settings: dropdown options
  "option.systemDefault": "Predeterminado del sistema",
  "option.turkish": "Turco",
  "option.azerbaijani": "Azer\xED",
  "option.lithuanian": "Lituano",
  "option.wholeLine": "L\xEDnea completa",
  "option.wordAtCaret": "Palabra bajo el cursor",
  // Settings
  "setting.locale.name": "Reglas del idioma",
  "setting.locale.desc": "El turco y el azer\xED asignan la i con punto y sin punto de forma distinta al resto de idiomas.",
  "setting.preserveAcronyms.name": "Respetar las siglas",
  "setting.preserveAcronyms.desc": "Deja como est\xE1n siglas como NASA y PDF, y nombres como iPhone, macOS y GitHub. Se ignora cuando toda la selecci\xF3n ya est\xE1 en may\xFAsculas, porque entonces todas las palabras parecen siglas.",
  "setting.stopWords.name": "Palabras que el t\xEDtulo mantiene en min\xFAscula",
  "setting.stopWords.desc": "Separadas por comas. La primera y la \xFAltima palabra de un t\xEDtulo siempre van en may\xFAscula, diga lo que diga esta lista.",
  "setting.removeHyphenOnJoin.name": "Quitar el guion al unir l\xEDneas",
  "setting.removeHyphenOnJoin.desc": 'Un PDF parte una palabra como "trans-" y "lation". Desact\xEDvalo para textos donde un compuesto real como "well-known" es m\xE1s probable que una palabra partida.',
  "setting.caseTarget.name": "Sin selecci\xF3n, cambiar las may\xFAsculas de",
  "setting.caseTarget.desc": "La l\xEDnea completa, o solo la palabra bajo el cursor.",
  "setting.tidyInvisibles.name": "Quitar caracteres invisibles",
  "setting.tidyInvisibles.desc": "Se eliminan los caracteres de ancho cero y los guiones suaves; los espacios de no separaci\xF3n pasan a ser espacios normales.",
  "setting.tidyLigatures.name": "Reemplazar ligaduras",
  "setting.tidyLigatures.desc": "\uFB01 y \uFB02 pasan a fi y fl.",
  "setting.tidyJoin.name": "Unir l\xEDneas partidas",
  "setting.tidyJoin.desc": "Une un p\xE1rrafo partido con saltos de l\xEDnea forzados. Desactivado por defecto: cambia la estructura de las l\xEDneas.",
  "setting.tidySpaces.name": "Reducir espacios m\xFAltiples",
  "setting.tidySpaces.desc": "Las series de espacios entre palabras pasan a ser uno. La sangr\xEDa, las tablas y el c\xF3digo no se tocan.",
  "setting.tidyTrailing.name": "Quitar espacios al final de las l\xEDneas",
  "setting.tidyTrailing.desc": "Espacios y tabulaciones al final de las l\xEDneas.",
  "setting.tidyBlank.name": "Quitar l\xEDneas en blanco sobrantes",
  "setting.tidyBlank.desc": "Las series de l\xEDneas en blanco pasan a ser una.",
  "setting.keepHardBreaks.name": "Conservar los saltos de l\xEDnea forzados",
  "setting.keepHardBreaks.desc": "Dos espacios al final de una l\xEDnea de texto son un salto de l\xEDnea en Markdown, as\xED que al quitar los espacios finales se conservan. Desact\xEDvalo para quitarlos tambi\xE9n.",
  "setting.confirmTidy.name": "Confirmar antes de ordenar",
  "setting.confirmTidy.desc": "Muestra cu\xE1ntas l\xEDneas cambiar\xEDa cada paso antes de aplicarlo.",
  "setting.cleanOnPaste.name": "Ordenar al pegar",
  "setting.cleanOnPaste.desc": "Aplica los pasos anteriores al texto sin formato que pegas. Nunca dentro de c\xF3digo o frontmatter, y los pegados con formato se dejan a Obsidian. Desactivado por defecto.",
  "setting.keepImageAltText.name": "Conservar el texto alternativo de las im\xE1genes",
  "setting.keepImageAltText.desc": "Deja la descripci\xF3n cuando una imagen se convierte en texto sin formato, en lugar de quitar la imagen por completo.",
  // Settings: saved replacements
  "replacements.name": "Tus comandos de buscar y reemplazar",
  "replacements.desc": 'Cada reemplazo se convierte en un comando, "Reemplazar: <nombre>", al que puedes asignar un atajo, y aparece en "Ejecutar un reemplazo guardado\u2026". Act\xFAa sobre la selecci\xF3n, o sobre toda la nota si no hay nada seleccionado, y nunca toca el c\xF3digo ni el frontmatter.',
  "replacements.nameField": "Nombre",
  "replacements.nameDesc": 'El comando se llama "Reemplazar: <nombre>". Sin nombre no hay comando.',
  "replacements.namePlaceholder": "Arreglar rayas",
  "replacements.delete": "Eliminar este reemplazo",
  "replacements.find": "Buscar",
  "replacements.replaceWith": "Reemplazar por",
  "replacements.replaceWithDesc": "D\xE9jalo vac\xEDo para eliminar las coincidencias. Con expresi\xF3n regular activada, $1 es el primer grupo y \\n un salto de l\xEDnea.",
  "replacements.regex": "Expresi\xF3n regular",
  "replacements.matchCase": "Distinguir may\xFAsculas y min\xFAsculas",
  "replacements.add": "A\xF1adir un reemplazo"
};
var es_default = es;

// src/locales/fr.ts
var fr = {
  // Commands
  "command.upper": "Majuscules",
  "command.lower": "Minuscules",
  "command.title": "Casse de titre",
  "command.sentence": "Casse de phrase",
  "command.capitalizeWords": "Majuscule \xE0 chaque mot",
  "command.capitalizeSentences": "Majuscule en d\xE9but de phrase, le reste inchang\xE9",
  "command.cycle": "Alterner la casse",
  "command.slug": "Slug (minuscules, sans accents, avec traits d\u2019union)",
  "command.joinLines": "Joindre les lignes coup\xE9es",
  "command.dehyphenate": "Rejoindre les mots coup\xE9s entre deux lignes",
  "command.stripInvisibles": "Supprimer les caract\xE8res invisibles",
  "command.replaceLigatures": "Remplacer les ligatures",
  "command.straightenPunctuation": "Redresser les guillemets et les tirets",
  "command.removeTrailingWhitespace": "Supprimer les espaces en fin de ligne",
  "command.collapseSpaces": "R\xE9duire les espaces multiples",
  "command.unlink": "Liens en texte brut",
  "command.sortLines": "Trier les lignes de A \xE0 Z",
  "command.sortLinesDesc": "Trier les lignes de Z \xE0 A",
  "command.dedupeLines": "Supprimer les lignes en double",
  "command.removeBlankLines": "Supprimer les lignes vides",
  "command.collapseBlankLines": "Supprimer les lignes vides en trop (en garder une)",
  "command.tidyNote": "Mettre la note en ordre",
  "command.pickCase": "Changer la casse\u2026",
  "command.runSavedReplacement": "Ex\xE9cuter un remplacement enregistr\xE9\u2026",
  "command.replace": "Remplacer : {name}",
  // Notices
  "notice.nothingToFormat": "Rien \xE0 mettre en forme.",
  "notice.nothingToTidy": "Rien \xE0 mettre en ordre.",
  "notice.noTidySteps": "Aucune \xE9tape de mise en ordre n\u2019est activ\xE9e. Choisissez-en dans les r\xE9glages.",
  "notice.noSavedReplacements": "Aucun remplacement enregistr\xE9 pour l\u2019instant. Ajoutez-en dans les r\xE9glages du module.",
  "notice.replacementProblem": "Remplacer : {name} : {problem}",
  "notice.unnamed": "sans nom",
  "notice.skippedInCode": "La s\xE9lection commence ou se termine dans du code ; elle a donc \xE9t\xE9 laiss\xE9e telle quelle.",
  "notice.noMatches": "Aucune correspondance pour \xAB {name} \xBB.",
  "notice.replacements.one": "1 remplacement effectu\xE9.",
  "notice.replacements.other": "{count} remplacements effectu\xE9s.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "Choisir une casse pour la s\xE9lection",
  "modal.noChange": "Aucun changement",
  "modal.pickReplacement": "Choisir un remplacement enregistr\xE9 \xE0 ex\xE9cuter",
  "modal.noName": "(sans nom)",
  "modal.tidy.line.one": "{step} : 1 ligne",
  "modal.tidy.line.other": "{step} : {count} lignes",
  "modal.tidy.confirm": "Mettre en ordre",
  "modal.tidy.cancel": "Annuler",
  // The steps of Tidy note
  "tidy.invisibles": "Supprimer les caract\xE8res invisibles",
  "tidy.ligatures": "Remplacer les ligatures",
  "tidy.join": "Joindre les lignes coup\xE9es",
  "tidy.spaces": "R\xE9duire les espaces multiples",
  "tidy.trailing": "Supprimer les espaces en fin de ligne",
  "tidy.blank": "Supprimer les lignes vides en trop",
  // Why a saved replacement cannot run
  "error.findEmpty": "Le texte \xE0 rechercher est vide.",
  "error.invalidRegex": "Expression r\xE9guli\xE8re non valide : {reason}",
  // Settings: headings
  "heading.case": "Casse",
  "heading.cleanup": "Nettoyage",
  "heading.tidy": "Mettre la note en ordre",
  "heading.replacements": "Remplacements enregistr\xE9s",
  // Settings: dropdown options
  "option.systemDefault": "Valeur par d\xE9faut du syst\xE8me",
  "option.turkish": "Turc",
  "option.azerbaijani": "Az\xE9ri",
  "option.lithuanian": "Lituanien",
  "option.wholeLine": "Ligne enti\xE8re",
  "option.wordAtCaret": "Mot sous le curseur",
  // Settings
  "setting.locale.name": "R\xE8gles de la langue",
  "setting.locale.desc": "Le turc et l\u2019az\xE9ri associent le i avec et sans point autrement que toutes les autres langues.",
  "setting.preserveAcronyms.name": "Conserver les sigles tels quels",
  "setting.preserveAcronyms.desc": "Laisse tels quels les sigles comme NASA et PDF, et les noms comme iPhone, macOS et GitHub. Ignor\xE9 lorsque toute la s\xE9lection est d\xE9j\xE0 en majuscules, car chaque mot ressemble alors \xE0 un sigle.",
  "setting.stopWords.name": "Mots que la casse de titre laisse en minuscules",
  "setting.stopWords.desc": "S\xE9par\xE9s par des virgules. Le premier et le dernier mot d\u2019un titre prennent toujours une majuscule, quoi que dise cette liste.",
  "setting.removeHyphenOnJoin.name": "Supprimer le trait d\u2019union en joignant les lignes",
  "setting.removeHyphenOnJoin.desc": 'Un PDF coupe un mot en "trans-" et "lation". D\xE9sactivez cette option pour les textes o\xF9 un vrai mot compos\xE9 comme "well-known" est plus probable qu\u2019un mot coup\xE9.',
  "setting.caseTarget.name": "Sans s\xE9lection, changer la casse de",
  "setting.caseTarget.desc": "La ligne enti\xE8re, ou seulement le mot sous le curseur.",
  "setting.tidyInvisibles.name": "Supprimer les caract\xE8res invisibles",
  "setting.tidyInvisibles.desc": "Les caract\xE8res de largeur nulle et les traits d\u2019union conditionnels disparaissent ; les espaces ins\xE9cables deviennent des espaces.",
  "setting.tidyLigatures.name": "Remplacer les ligatures",
  "setting.tidyLigatures.desc": "\uFB01 et \uFB02 deviennent fi et fl.",
  "setting.tidyJoin.name": "Joindre les lignes coup\xE9es",
  "setting.tidyJoin.desc": "Fusionne un paragraphe coup\xE9 en dur sur plusieurs lignes. D\xE9sactiv\xE9 par d\xE9faut : cela change la structure des lignes.",
  "setting.tidySpaces.name": "R\xE9duire les espaces multiples",
  "setting.tidySpaces.desc": "Les suites d\u2019espaces entre les mots deviennent un seul espace. L\u2019indentation, les tableaux et le code ne sont pas touch\xE9s.",
  "setting.tidyTrailing.name": "Supprimer les espaces en fin de ligne",
  "setting.tidyTrailing.desc": "Les espaces et tabulations \xE0 la fin des lignes.",
  "setting.tidyBlank.name": "Supprimer les lignes vides en trop",
  "setting.tidyBlank.desc": "Les suites de lignes vides deviennent une seule ligne.",
  "setting.keepHardBreaks.name": "Conserver les sauts de ligne forc\xE9s",
  "setting.keepHardBreaks.desc": "Deux espaces \xE0 la fin d\u2019une ligne de texte forment un saut de ligne en Markdown ; la suppression des espaces en fin de ligne les conserve donc. D\xE9sactivez cette option pour les supprimer aussi.",
  "setting.confirmTidy.name": "Confirmer avant de mettre en ordre",
  "setting.confirmTidy.desc": "Affiche le nombre de lignes que chaque \xE9tape modifierait avant de l\u2019appliquer.",
  "setting.cleanOnPaste.name": "Mettre en ordre au collage",
  "setting.cleanOnPaste.desc": "Ex\xE9cute les \xE9tapes ci-dessus sur le texte brut que vous collez. Jamais dans du code ou du frontmatter, et les collages avec mise en forme sont laiss\xE9s \xE0 Obsidian. D\xE9sactiv\xE9 par d\xE9faut.",
  "setting.keepImageAltText.name": "Conserver le texte alternatif des images",
  "setting.keepImageAltText.desc": "Garde la description lorsqu\u2019une image est convertie en texte brut, au lieu de supprimer enti\xE8rement l\u2019image.",
  // Settings: saved replacements
  "replacements.name": "Vos commandes de recherche et remplacement",
  "replacements.desc": "Chaque remplacement devient une commande \xAB Remplacer : <nom> \xBB \xE0 laquelle vous pouvez attribuer un raccourci, et figure dans \xAB Ex\xE9cuter un remplacement enregistr\xE9\u2026 \xBB. Elle agit sur la s\xE9lection, ou sur toute la note si rien n\u2019est s\xE9lectionn\xE9, et ne touche jamais au code ni au frontmatter.",
  "replacements.nameField": "Nom",
  "replacements.nameDesc": "La commande s\u2019appelle \xAB Remplacer : <nom> \xBB. Sans nom, il n\u2019y a pas de commande.",
  "replacements.namePlaceholder": "Corriger les tirets",
  "replacements.delete": "Supprimer ce remplacement",
  "replacements.find": "Rechercher",
  "replacements.replaceWith": "Remplacer par",
  "replacements.replaceWithDesc": "Laissez vide pour supprimer les correspondances. Avec l\u2019expression r\xE9guli\xE8re activ\xE9e, $1 est le premier groupe et \\n un saut de ligne.",
  "replacements.regex": "Expression r\xE9guli\xE8re",
  "replacements.matchCase": "Respecter la casse",
  "replacements.add": "Ajouter un remplacement"
};
var fr_default = fr;

// src/locales/ja.ts
var ja = {
  // Commands
  "command.upper": "\u5927\u6587\u5B57",
  "command.lower": "\u5C0F\u6587\u5B57",
  "command.title": "\u30BF\u30A4\u30C8\u30EB\u30B1\u30FC\u30B9",
  "command.sentence": "\u6587\u982D\u306E\u307F\u5927\u6587\u5B57\uFF08\u30BB\u30F3\u30C6\u30F3\u30B9\u30B1\u30FC\u30B9\uFF09",
  "command.capitalizeWords": "\u5404\u5358\u8A9E\u306E\u5148\u982D\u3092\u5927\u6587\u5B57\u306B\u3059\u308B",
  "command.capitalizeSentences": "\u5404\u6587\u306E\u5148\u982D\u3092\u5927\u6587\u5B57\u306B\u3057\u3001\u6B8B\u308A\u306F\u305D\u306E\u307E\u307E\u306B\u3059\u308B",
  "command.cycle": "\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57\u3092\u9806\u306B\u5207\u308A\u66FF\u3048",
  "command.slug": "\u30B9\u30E9\u30C3\u30B0\uFF08\u5C0F\u6587\u5B57\u3001\u30A2\u30AF\u30BB\u30F3\u30C8\u306A\u3057\u3001\u30CF\u30A4\u30D5\u30F3\uFF09",
  "command.joinLines": "\u6298\u308A\u8FD4\u3055\u308C\u305F\u884C\u3092\u7D50\u5408",
  "command.dehyphenate": "\u884C\u3092\u307E\u305F\u3044\u3067\u5206\u5272\u3055\u308C\u305F\u5358\u8A9E\u3092\u7D50\u5408",
  "command.stripInvisibles": "\u4E0D\u53EF\u8996\u6587\u5B57\u3092\u524A\u9664",
  "command.replaceLigatures": "\u5408\u5B57\u3092\u7F6E\u63DB",
  "command.straightenPunctuation": "\u5F15\u7528\u7B26\u3068\u30C0\u30C3\u30B7\u30E5\u3092\u30B9\u30C8\u30EC\u30FC\u30C8\u306B\u3059\u308B",
  "command.removeTrailingWhitespace": "\u884C\u672B\u306E\u7A7A\u767D\u3092\u524A\u9664",
  "command.collapseSpaces": "\u9023\u7D9A\u3059\u308B\u7A7A\u767D\u30921\u3064\u306B\u307E\u3068\u3081\u308B",
  "command.unlink": "\u30EA\u30F3\u30AF\u3092\u30D7\u30EC\u30FC\u30F3\u30C6\u30AD\u30B9\u30C8\u306B\u5909\u63DB",
  "command.sortLines": "\u884C\u3092 A \u304B\u3089 Z \u306E\u9806\u306B\u4E26\u3079\u66FF\u3048",
  "command.sortLinesDesc": "\u884C\u3092 Z \u304B\u3089 A \u306E\u9806\u306B\u4E26\u3079\u66FF\u3048",
  "command.dedupeLines": "\u91CD\u8907\u3059\u308B\u884C\u3092\u524A\u9664",
  "command.removeBlankLines": "\u7A7A\u884C\u3092\u524A\u9664",
  "command.collapseBlankLines": "\u4F59\u5206\u306A\u7A7A\u884C\u3092\u524A\u9664\uFF081\u884C\u306F\u6B8B\u3059\uFF09",
  "command.tidyNote": "\u30CE\u30FC\u30C8\u3092\u6574\u5F62",
  "command.pickCase": "\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57\u3092\u5909\u66F4\u2026",
  "command.runSavedReplacement": "\u4FDD\u5B58\u3057\u305F\u7F6E\u63DB\u3092\u5B9F\u884C\u2026",
  "command.replace": "\u7F6E\u63DB: {name}",
  // Notices
  "notice.nothingToFormat": "\u6574\u5F62\u3059\u308B\u3082\u306E\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
  "notice.nothingToTidy": "\u6574\u5F62\u3059\u308B\u3082\u306E\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
  "notice.noTidySteps": "\u6574\u5F62\u306E\u30B9\u30C6\u30C3\u30D7\u304C\u30AA\u30F3\u306B\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002\u8A2D\u5B9A\u3067\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
  "notice.noSavedReplacements": "\u4FDD\u5B58\u3057\u305F\u7F6E\u63DB\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u8A2D\u5B9A\u3067\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "notice.replacementProblem": "\u7F6E\u63DB: {name}: {problem}",
  "notice.unnamed": "\u540D\u524D\u306A\u3057",
  "notice.skippedInCode": "\u9078\u629E\u7BC4\u56F2\u306E\u59CB\u307E\u308A\u307E\u305F\u306F\u7D42\u308F\u308A\u304C\u30B3\u30FC\u30C9\u5185\u306B\u3042\u308B\u305F\u3081\u3001\u305D\u306E\u307E\u307E\u306B\u3057\u307E\u3057\u305F\u3002",
  "notice.noMatches": "\u300C{name}\u300D\u306B\u4E00\u81F4\u3059\u308B\u3082\u306E\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
  "notice.replacements.one": "1 \u4EF6\u3092\u7F6E\u63DB\u3057\u307E\u3057\u305F\u3002",
  "notice.replacements.other": "{count} \u4EF6\u3092\u7F6E\u63DB\u3057\u307E\u3057\u305F\u3002",
  // Pickers and the tidy confirmation
  "modal.pickCase": "\u9078\u629E\u7BC4\u56F2\u306E\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57\u3092\u9078\u629E",
  "modal.noChange": "\u5909\u66F4\u306A\u3057",
  "modal.pickReplacement": "\u5B9F\u884C\u3059\u308B\u4FDD\u5B58\u6E08\u307F\u306E\u7F6E\u63DB\u3092\u9078\u629E",
  "modal.noName": "\uFF08\u540D\u524D\u306A\u3057\uFF09",
  "modal.tidy.line.one": "{step}: 1 \u884C",
  "modal.tidy.line.other": "{step}: {count} \u884C",
  "modal.tidy.confirm": "\u6574\u5F62",
  "modal.tidy.cancel": "\u30AD\u30E3\u30F3\u30BB\u30EB",
  // The steps of Tidy note
  "tidy.invisibles": "\u4E0D\u53EF\u8996\u6587\u5B57\u3092\u524A\u9664",
  "tidy.ligatures": "\u5408\u5B57\u3092\u7F6E\u63DB",
  "tidy.join": "\u6298\u308A\u8FD4\u3055\u308C\u305F\u884C\u3092\u7D50\u5408",
  "tidy.spaces": "\u9023\u7D9A\u3059\u308B\u7A7A\u767D\u30921\u3064\u306B\u307E\u3068\u3081\u308B",
  "tidy.trailing": "\u884C\u672B\u306E\u7A7A\u767D\u3092\u524A\u9664",
  "tidy.blank": "\u4F59\u5206\u306A\u7A7A\u884C\u3092\u524A\u9664",
  // Why a saved replacement cannot run
  "error.findEmpty": "\u691C\u7D22\u3059\u308B\u30C6\u30AD\u30B9\u30C8\u304C\u7A7A\u3067\u3059\u3002",
  "error.invalidRegex": "\u6709\u52B9\u306A\u6B63\u898F\u8868\u73FE\u3067\u306F\u3042\u308A\u307E\u305B\u3093: {reason}",
  // Settings: headings
  "heading.case": "\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57",
  "heading.cleanup": "\u30AF\u30EA\u30FC\u30F3\u30A2\u30C3\u30D7",
  "heading.tidy": "\u30CE\u30FC\u30C8\u3092\u6574\u5F62",
  "heading.replacements": "\u4FDD\u5B58\u3057\u305F\u7F6E\u63DB",
  // Settings: dropdown options
  "option.systemDefault": "\u30B7\u30B9\u30C6\u30E0\u306E\u30C7\u30D5\u30A9\u30EB\u30C8",
  "option.turkish": "\u30C8\u30EB\u30B3\u8A9E",
  "option.azerbaijani": "\u30A2\u30BC\u30EB\u30D0\u30A4\u30B8\u30E3\u30F3\u8A9E",
  "option.lithuanian": "\u30EA\u30C8\u30A2\u30CB\u30A2\u8A9E",
  "option.wholeLine": "\u884C\u5168\u4F53",
  "option.wordAtCaret": "\u30AB\u30FC\u30BD\u30EB\u4F4D\u7F6E\u306E\u5358\u8A9E",
  // Settings
  "setting.locale.name": "\u8A00\u8A9E\u3054\u3068\u306E\u898F\u5247",
  "setting.locale.desc": "\u30C8\u30EB\u30B3\u8A9E\u3068\u30A2\u30BC\u30EB\u30D0\u30A4\u30B8\u30E3\u30F3\u8A9E\u3067\u306F\u3001\u70B9\u4ED8\u304D\u3068\u70B9\u306A\u3057\u306E i \u306E\u5BFE\u5FDC\u304C\u4ED6\u306E\u8A00\u8A9E\u3068\u7570\u306A\u308A\u307E\u3059\u3002",
  "setting.preserveAcronyms.name": "\u982D\u5B57\u8A9E\u3092\u305D\u306E\u307E\u307E\u306B\u3059\u308B",
  "setting.preserveAcronyms.desc": "NASA \u3084 PDF \u306A\u3069\u306E\u982D\u5B57\u8A9E\u3001iPhone\u3001macOS\u3001GitHub \u306A\u3069\u306E\u540D\u524D\u3092\u305D\u306E\u307E\u307E\u306B\u3057\u307E\u3059\u3002\u9078\u629E\u7BC4\u56F2\u5168\u4F53\u304C\u3059\u3067\u306B\u5927\u6587\u5B57\u306E\u5834\u5408\u306F\u3001\u3069\u306E\u5358\u8A9E\u3082\u982D\u5B57\u8A9E\u306B\u898B\u3048\u308B\u305F\u3081\u7121\u8996\u3055\u308C\u307E\u3059\u3002",
  "setting.stopWords.name": "\u30BF\u30A4\u30C8\u30EB\u30B1\u30FC\u30B9\u3067\u5C0F\u6587\u5B57\u306E\u307E\u307E\u306B\u3059\u308B\u5358\u8A9E",
  "setting.stopWords.desc": "\u30AB\u30F3\u30DE\u533A\u5207\u308A\u3002\u30BF\u30A4\u30C8\u30EB\u306E\u6700\u521D\u3068\u6700\u5F8C\u306E\u5358\u8A9E\u306F\u3001\u3053\u306E\u30EA\u30B9\u30C8\u306B\u304B\u304B\u308F\u3089\u305A\u5E38\u306B\u5927\u6587\u5B57\u306B\u306A\u308A\u307E\u3059\u3002",
  "setting.removeHyphenOnJoin.name": "\u884C\u306E\u7D50\u5408\u6642\u306B\u30CF\u30A4\u30D5\u30F3\u3092\u524A\u9664",
  "setting.removeHyphenOnJoin.desc": 'PDF \u3067\u306F\u5358\u8A9E\u304C "trans-" \u3068 "lation" \u306E\u3088\u3046\u306B\u5206\u65AD\u3055\u308C\u307E\u3059\u3002"well-known" \u306E\u3088\u3046\u306A\u672C\u7269\u306E\u8907\u5408\u8A9E\u306E\u307B\u3046\u304C\u3001\u5206\u65AD\u3055\u308C\u305F\u5358\u8A9E\u3088\u308A\u591A\u3044\u30C6\u30AD\u30B9\u30C8\u3067\u306F\u30AA\u30D5\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002',
  "setting.caseTarget.name": "\u9078\u629E\u304C\u306A\u3044\u3068\u304D\u306B\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57\u3092\u5909\u66F4\u3059\u308B\u5BFE\u8C61",
  "setting.caseTarget.desc": "\u884C\u5168\u4F53\u3001\u307E\u305F\u306F\u30AB\u30FC\u30BD\u30EB\u4F4D\u7F6E\u306E\u5358\u8A9E\u306E\u307F\u3002",
  "setting.tidyInvisibles.name": "\u4E0D\u53EF\u8996\u6587\u5B57\u3092\u524A\u9664",
  "setting.tidyInvisibles.desc": "\u30BC\u30ED\u5E45\u6587\u5B57\u3068\u30BD\u30D5\u30C8\u30CF\u30A4\u30D5\u30F3\u306F\u524A\u9664\u3057\u3001\u30CE\u30FC\u30D6\u30EC\u30FC\u30AF\u30B9\u30DA\u30FC\u30B9\u306F\u901A\u5E38\u306E\u7A7A\u767D\u306B\u3057\u307E\u3059\u3002",
  "setting.tidyLigatures.name": "\u5408\u5B57\u3092\u7F6E\u63DB",
  "setting.tidyLigatures.desc": "\uFB01 \u3068 \uFB02 \u3092 fi \u3068 fl \u306B\u3057\u307E\u3059\u3002",
  "setting.tidyJoin.name": "\u6298\u308A\u8FD4\u3055\u308C\u305F\u884C\u3092\u7D50\u5408",
  "setting.tidyJoin.desc": "\u884C\u3054\u3068\u306B\u5F37\u5236\u7684\u306B\u6298\u308A\u8FD4\u3055\u308C\u305F\u6BB5\u843D\u3092\u7D50\u5408\u3057\u307E\u3059\u3002\u884C\u306E\u69CB\u9020\u304C\u5909\u308F\u308B\u305F\u3081\u3001\u521D\u671F\u8A2D\u5B9A\u3067\u306F\u30AA\u30D5\u3067\u3059\u3002",
  "setting.tidySpaces.name": "\u9023\u7D9A\u3059\u308B\u7A7A\u767D\u30921\u3064\u306B\u307E\u3068\u3081\u308B",
  "setting.tidySpaces.desc": "\u5358\u8A9E\u9593\u306E\u9023\u7D9A\u3057\u305F\u7A7A\u767D\u30921\u3064\u306B\u3057\u307E\u3059\u3002\u30A4\u30F3\u30C7\u30F3\u30C8\u3001\u8868\u3001\u30B3\u30FC\u30C9\u306F\u305D\u306E\u307E\u307E\u3067\u3059\u3002",
  "setting.tidyTrailing.name": "\u884C\u672B\u306E\u7A7A\u767D\u3092\u524A\u9664",
  "setting.tidyTrailing.desc": "\u884C\u672B\u306E\u30B9\u30DA\u30FC\u30B9\u3068\u30BF\u30D6\u3002",
  "setting.tidyBlank.name": "\u4F59\u5206\u306A\u7A7A\u884C\u3092\u524A\u9664",
  "setting.tidyBlank.desc": "\u9023\u7D9A\u3059\u308B\u7A7A\u884C\u30921\u884C\u306B\u3057\u307E\u3059\u3002",
  "setting.keepHardBreaks.name": "\u5F37\u5236\u6539\u884C\u3092\u6B8B\u3059",
  "setting.keepHardBreaks.desc": "Markdown \u3067\u306F\u3001\u30C6\u30AD\u30B9\u30C8\u884C\u306E\u672B\u5C3E\u306B\u3042\u308B2\u3064\u306E\u7A7A\u767D\u306F\u6539\u884C\u3092\u610F\u5473\u3059\u308B\u305F\u3081\u3001\u884C\u672B\u306E\u7A7A\u767D\u306E\u524A\u9664\u3067\u306F\u6B8B\u3057\u307E\u3059\u3002\u3053\u308C\u3092\u30AA\u30D5\u306B\u3059\u308B\u3068\u3001\u305D\u308C\u3089\u3082\u524A\u9664\u3055\u308C\u307E\u3059\u3002",
  "setting.confirmTidy.name": "\u6574\u5F62\u524D\u306B\u78BA\u8A8D",
  "setting.confirmTidy.desc": "\u9069\u7528\u3059\u308B\u524D\u306B\u3001\u5404\u30B9\u30C6\u30C3\u30D7\u304C\u5909\u66F4\u3059\u308B\u884C\u6570\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
  "setting.cleanOnPaste.name": "\u8CBC\u308A\u4ED8\u3051\u6642\u306B\u6574\u5F62",
  "setting.cleanOnPaste.desc": "\u8CBC\u308A\u4ED8\u3051\u305F\u30D7\u30EC\u30FC\u30F3\u30C6\u30AD\u30B9\u30C8\u306B\u4E0A\u306E\u30B9\u30C6\u30C3\u30D7\u3092\u5B9F\u884C\u3057\u307E\u3059\u3002\u30B3\u30FC\u30C9\u3084\u30D5\u30ED\u30F3\u30C8\u30DE\u30BF\u30FC\u306E\u4E2D\u3067\u306F\u5B9F\u884C\u305B\u305A\u3001\u66F8\u5F0F\u4ED8\u304D\u306E\u8CBC\u308A\u4ED8\u3051\u306F Obsidian \u306B\u4EFB\u305B\u307E\u3059\u3002\u521D\u671F\u8A2D\u5B9A\u3067\u306F\u30AA\u30D5\u3067\u3059\u3002",
  "setting.keepImageAltText.name": "\u753B\u50CF\u306E\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8\u3092\u6B8B\u3059",
  "setting.keepImageAltText.desc": "\u753B\u50CF\u3092\u30D7\u30EC\u30FC\u30F3\u30C6\u30AD\u30B9\u30C8\u306B\u3059\u308B\u3068\u304D\u3001\u753B\u50CF\u3092\u5B8C\u5168\u306B\u524A\u9664\u305B\u305A\u3001\u305D\u306E\u8AAC\u660E\u3092\u6B8B\u3057\u307E\u3059\u3002",
  // Settings: saved replacements
  "replacements.name": "\u72EC\u81EA\u306E\u691C\u7D22\u30FB\u7F6E\u63DB\u30B3\u30DE\u30F3\u30C9",
  "replacements.desc": "\u5404\u7F6E\u63DB\u306F\u300C\u7F6E\u63DB: <\u540D\u524D>\u300D\u3068\u3044\u3046\u30B3\u30DE\u30F3\u30C9\u306B\u306A\u308A\u3001\u30DB\u30C3\u30C8\u30AD\u30FC\u3092\u5272\u308A\u5F53\u3066\u3089\u308C\u308B\u307B\u304B\u3001\u300C\u4FDD\u5B58\u3057\u305F\u7F6E\u63DB\u3092\u5B9F\u884C\u2026\u300D\u306B\u3082\u4E00\u89A7\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u9078\u629E\u7BC4\u56F2\u3001\u307E\u305F\u306F\u9078\u629E\u304C\u306A\u3044\u3068\u304D\u306F\u30CE\u30FC\u30C8\u5168\u4F53\u306B\u5BFE\u3057\u3066\u52D5\u4F5C\u3057\u3001\u30B3\u30FC\u30C9\u3084\u30D5\u30ED\u30F3\u30C8\u30DE\u30BF\u30FC\u306B\u306F\u89E6\u308C\u307E\u305B\u3093\u3002",
  "replacements.nameField": "\u540D\u524D",
  "replacements.nameDesc": "\u30B3\u30DE\u30F3\u30C9\u540D\u306F\u300C\u7F6E\u63DB: <\u540D\u524D>\u300D\u306B\u306A\u308A\u307E\u3059\u3002\u540D\u524D\u304C\u306A\u3044\u3068\u30B3\u30DE\u30F3\u30C9\u306F\u4F5C\u3089\u308C\u307E\u305B\u3093\u3002",
  "replacements.namePlaceholder": "\u30C0\u30C3\u30B7\u30E5\u3092\u4FEE\u6B63",
  "replacements.delete": "\u3053\u306E\u7F6E\u63DB\u3092\u524A\u9664",
  "replacements.find": "\u691C\u7D22",
  "replacements.replaceWith": "\u7F6E\u63DB\u5F8C",
  "replacements.replaceWithDesc": "\u7A7A\u306B\u3059\u308B\u3068\u4E00\u81F4\u3057\u305F\u90E8\u5206\u3092\u524A\u9664\u3057\u307E\u3059\u3002\u6B63\u898F\u8868\u73FE\u304C\u30AA\u30F3\u306E\u3068\u304D\u3001$1 \u306F\u6700\u521D\u306E\u30B0\u30EB\u30FC\u30D7\u3001\\n \u306F\u6539\u884C\u3067\u3059\u3002",
  "replacements.regex": "\u6B63\u898F\u8868\u73FE",
  "replacements.matchCase": "\u5927\u6587\u5B57\u30FB\u5C0F\u6587\u5B57\u3092\u533A\u5225",
  "replacements.add": "\u7F6E\u63DB\u3092\u8FFD\u52A0"
};
var ja_default = ja;

// src/locales/ko.ts
var ko = {
  // Commands
  "command.upper": "\uB300\uBB38\uC790",
  "command.lower": "\uC18C\uBB38\uC790",
  "command.title": "\uC81C\uBAA9 \uD615\uC2DD \uB300\uC18C\uBB38\uC790",
  "command.sentence": "\uBB38\uC7A5 \uD615\uC2DD \uB300\uC18C\uBB38\uC790",
  "command.capitalizeWords": "\uAC01 \uB2E8\uC5B4\uC758 \uCCAB \uAE00\uC790\uB97C \uB300\uBB38\uC790\uB85C",
  "command.capitalizeSentences": "\uBB38\uC7A5\uC758 \uCCAB \uAE00\uC790\uB9CC \uB300\uBB38\uC790\uB85C(\uB098\uBA38\uC9C0\uB294 \uC720\uC9C0)",
  "command.cycle": "\uB300\uC18C\uBB38\uC790 \uC21C\uD658",
  "command.slug": "\uC2AC\uB7EC\uADF8(\uC18C\uBB38\uC790, \uC545\uC13C\uD2B8 \uC81C\uAC70, \uD558\uC774\uD508)",
  "command.joinLines": "\uC904\uBC14\uAFC8\uB41C \uC904 \uD569\uCE58\uAE30",
  "command.dehyphenate": "\uC904 \uB05D\uC5D0\uC11C \uB098\uB25C \uB2E8\uC5B4 \uB2E4\uC2DC \uC787\uAE30",
  "command.stripInvisibles": "\uBCF4\uC774\uC9C0 \uC54A\uB294 \uBB38\uC790 \uC81C\uAC70",
  "command.replaceLigatures": "\uD569\uC790 \uBC14\uAFB8\uAE30",
  "command.straightenPunctuation": "\uB530\uC634\uD45C\uC640 \uB300\uC2DC\uB97C \uACE7\uAC8C \uBC14\uAFB8\uAE30",
  "command.removeTrailingWhitespace": "\uC904 \uB05D \uACF5\uBC31 \uC81C\uAC70",
  "command.collapseSpaces": "\uC5EC\uB7EC \uACF5\uBC31 \uD569\uCE58\uAE30",
  "command.unlink": "\uB9C1\uD06C\uB97C \uC77C\uBC18 \uD14D\uC2A4\uD2B8\uB85C",
  "command.sortLines": "\uC904\uC744 A\uBD80\uD130 Z\uB85C \uC815\uB82C",
  "command.sortLinesDesc": "\uC904\uC744 Z\uBD80\uD130 A\uB85C \uC815\uB82C",
  "command.dedupeLines": "\uC911\uBCF5\uB41C \uC904 \uC81C\uAC70",
  "command.removeBlankLines": "\uBE48 \uC904 \uC81C\uAC70",
  "command.collapseBlankLines": "\uBD88\uD544\uC694\uD55C \uBE48 \uC904 \uC81C\uAC70(\uD558\uB098\uB294 \uC720\uC9C0)",
  "command.tidyNote": "\uB178\uD2B8 \uC815\uB9AC",
  "command.pickCase": "\uB300\uC18C\uBB38\uC790 \uBCC0\uACBD\u2026",
  "command.runSavedReplacement": "\uC800\uC7A5\uB41C \uBC14\uAFB8\uAE30 \uC2E4\uD589\u2026",
  "command.replace": "\uBC14\uAFB8\uAE30: {name}",
  // Notices
  "notice.nothingToFormat": "\uC11C\uC2DD\uC744 \uBC14\uAFC0 \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "notice.nothingToTidy": "\uC815\uB9AC\uD560 \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "notice.noTidySteps": "\uCF1C\uC838 \uC788\uB294 \uC815\uB9AC \uB2E8\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC124\uC815\uC5D0\uC11C \uC120\uD0DD\uD558\uC138\uC694.",
  "notice.noSavedReplacements": "\uC800\uC7A5\uB41C \uBC14\uAFB8\uAE30\uAC00 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4. \uD50C\uB7EC\uADF8\uC778 \uC124\uC815\uC5D0\uC11C \uCD94\uAC00\uD558\uC138\uC694.",
  "notice.replacementProblem": "\uBC14\uAFB8\uAE30: {name}: {problem}",
  "notice.unnamed": "\uC774\uB984 \uC5C6\uC74C",
  "notice.skippedInCode": "\uC120\uD0DD \uC601\uC5ED\uC774 \uCF54\uB4DC \uC548\uC5D0\uC11C \uC2DC\uC791\uD558\uAC70\uB098 \uB05D\uB098\uBBC0\uB85C \uADF8\uB300\uB85C \uB450\uC5C8\uC2B5\uB2C8\uB2E4.",
  "notice.noMatches": '"{name}"\uC5D0 \uC77C\uCE58\uD558\uB294 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.',
  "notice.replacements.one": "1\uAC74\uC744 \uBC14\uAFE8\uC2B5\uB2C8\uB2E4.",
  "notice.replacements.other": "{count}\uAC74\uC744 \uBC14\uAFE8\uC2B5\uB2C8\uB2E4.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "\uC120\uD0DD \uC601\uC5ED\uC5D0 \uC801\uC6A9\uD560 \uB300\uC18C\uBB38\uC790\uB97C \uACE0\uB974\uC138\uC694",
  "modal.noChange": "\uBCC0\uACBD \uC5C6\uC74C",
  "modal.pickReplacement": "\uC2E4\uD589\uD560 \uC800\uC7A5\uB41C \uBC14\uAFB8\uAE30\uB97C \uACE0\uB974\uC138\uC694",
  "modal.noName": "(\uC774\uB984 \uC5C6\uC74C)",
  "modal.tidy.line.one": "{step}: 1\uC904",
  "modal.tidy.line.other": "{step}: {count}\uC904",
  "modal.tidy.confirm": "\uC815\uB9AC",
  "modal.tidy.cancel": "\uCDE8\uC18C",
  // The steps of Tidy note
  "tidy.invisibles": "\uBCF4\uC774\uC9C0 \uC54A\uB294 \uBB38\uC790 \uC81C\uAC70",
  "tidy.ligatures": "\uD569\uC790 \uBC14\uAFB8\uAE30",
  "tidy.join": "\uC904\uBC14\uAFC8\uB41C \uC904 \uD569\uCE58\uAE30",
  "tidy.spaces": "\uC5EC\uB7EC \uACF5\uBC31 \uD569\uCE58\uAE30",
  "tidy.trailing": "\uC904 \uB05D \uACF5\uBC31 \uC81C\uAC70",
  "tidy.blank": "\uBD88\uD544\uC694\uD55C \uBE48 \uC904 \uC81C\uAC70",
  // Why a saved replacement cannot run
  "error.findEmpty": "\uCC3E\uC744 \uD14D\uC2A4\uD2B8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.",
  "error.invalidRegex": "\uC62C\uBC14\uB978 \uC815\uADDC\uC2DD\uC774 \uC544\uB2D9\uB2C8\uB2E4: {reason}",
  // Settings: headings
  "heading.case": "\uB300\uC18C\uBB38\uC790",
  "heading.cleanup": "\uC815\uB9AC",
  "heading.tidy": "\uB178\uD2B8 \uC815\uB9AC",
  "heading.replacements": "\uC800\uC7A5\uB41C \uBC14\uAFB8\uAE30",
  // Settings: dropdown options
  "option.systemDefault": "\uC2DC\uC2A4\uD15C \uAE30\uBCF8\uAC12",
  "option.turkish": "\uD280\uB974\uD0A4\uC608\uC5B4",
  "option.azerbaijani": "\uC544\uC81C\uB974\uBC14\uC774\uC794\uC5B4",
  "option.lithuanian": "\uB9AC\uD22C\uC544\uB2C8\uC544\uC5B4",
  "option.wholeLine": "\uC904 \uC804\uCCB4",
  "option.wordAtCaret": "\uCEE4\uC11C \uC704\uCE58\uC758 \uB2E8\uC5B4",
  // Settings
  "setting.locale.name": "\uC5B8\uC5B4\uBCC4 \uADDC\uCE59",
  "setting.locale.desc": "\uD280\uB974\uD0A4\uC608\uC5B4\uC640 \uC544\uC81C\uB974\uBC14\uC774\uC794\uC5B4\uB294 \uC810\uC774 \uC788\uB294 i\uC640 \uC5C6\uB294 i\uC758 \uB300\uC751\uC774 \uB2E4\uB978 \uBAA8\uB4E0 \uC5B8\uC5B4\uC640 \uB2E4\uB985\uB2C8\uB2E4.",
  "setting.preserveAcronyms.name": "\uC57D\uC5B4 \uADF8\uB300\uB85C \uB450\uAE30",
  "setting.preserveAcronyms.desc": "NASA, PDF \uAC19\uC740 \uC57D\uC5B4\uC640 iPhone, macOS, GitHub \uAC19\uC740 \uC774\uB984\uC744 \uADF8\uB300\uB85C \uB461\uB2C8\uB2E4. \uC120\uD0DD \uC601\uC5ED \uC804\uCCB4\uAC00 \uC774\uBBF8 \uB300\uBB38\uC790\uC774\uBA74 \uBAA8\uB4E0 \uB2E8\uC5B4\uAC00 \uC57D\uC5B4\uCC98\uB7FC \uBCF4\uC774\uBBC0\uB85C \uBB34\uC2DC\uB429\uB2C8\uB2E4.",
  "setting.stopWords.name": "\uC81C\uBAA9 \uD615\uC2DD\uC5D0\uC11C \uC18C\uBB38\uC790\uB85C \uC720\uC9C0\uD560 \uB2E8\uC5B4",
  "setting.stopWords.desc": "\uC27C\uD45C\uB85C \uAD6C\uBD84\uD569\uB2C8\uB2E4. \uC774 \uBAA9\uB85D\uACFC \uAD00\uACC4\uC5C6\uC774 \uC81C\uBAA9\uC758 \uCCAB \uB2E8\uC5B4\uC640 \uB9C8\uC9C0\uB9C9 \uB2E8\uC5B4\uB294 \uD56D\uC0C1 \uB300\uBB38\uC790\uB85C \uC501\uB2C8\uB2E4.",
  "setting.removeHyphenOnJoin.name": "\uC904\uC744 \uD569\uCE60 \uB54C \uD558\uC774\uD508 \uC81C\uAC70",
  "setting.removeHyphenOnJoin.desc": 'PDF\uB294 \uB2E8\uC5B4\uB97C "trans-"\uC640 "lation"\uCC98\uB7FC \uB04A\uC2B5\uB2C8\uB2E4. "well-known" \uAC19\uC740 \uC2E4\uC81C \uBCF5\uD569\uC5B4\uAC00 \uB04A\uC5B4\uC9C4 \uB2E8\uC5B4\uBCF4\uB2E4 \uB9CE\uC740 \uAE00\uC5D0\uC11C\uB294 \uC774 \uC635\uC158\uC744 \uB044\uC138\uC694.',
  "setting.caseTarget.name": "\uC120\uD0DD \uC601\uC5ED\uC774 \uC5C6\uC744 \uB54C \uB300\uC18C\uBB38\uC790\uB97C \uBC14\uAFC0 \uB300\uC0C1",
  "setting.caseTarget.desc": "\uC904 \uC804\uCCB4, \uB610\uB294 \uCEE4\uC11C \uC704\uCE58\uC758 \uB2E8\uC5B4\uB9CC.",
  "setting.tidyInvisibles.name": "\uBCF4\uC774\uC9C0 \uC54A\uB294 \uBB38\uC790 \uC81C\uAC70",
  "setting.tidyInvisibles.desc": "\uB108\uBE44\uAC00 \uC5C6\uB294 \uBB38\uC790\uC640 \uC18C\uD504\uD2B8 \uD558\uC774\uD508\uC740 \uC81C\uAC70\uD558\uACE0, \uC904\uBC14\uAFC8 \uC5C6\uB294 \uACF5\uBC31\uC740 \uC77C\uBC18 \uACF5\uBC31\uC73C\uB85C \uBC14\uAFC9\uB2C8\uB2E4.",
  "setting.tidyLigatures.name": "\uD569\uC790 \uBC14\uAFB8\uAE30",
  "setting.tidyLigatures.desc": "\uFB01\uC640 \uFB02\uB97C fi\uC640 fl\uB85C \uBC14\uAFC9\uB2C8\uB2E4.",
  "setting.tidyJoin.name": "\uC904\uBC14\uAFC8\uB41C \uC904 \uD569\uCE58\uAE30",
  "setting.tidyJoin.desc": "\uC5EC\uB7EC \uC904\uB85C \uAC15\uC81C \uC904\uBC14\uAFC8\uB41C \uBB38\uB2E8\uC744 \uD569\uCE69\uB2C8\uB2E4. \uC904 \uAD6C\uC870\uB97C \uBC14\uAFB8\uBBC0\uB85C \uAE30\uBCF8\uAC12\uC740 \uAEBC\uC9D0\uC785\uB2C8\uB2E4.",
  "setting.tidySpaces.name": "\uC5EC\uB7EC \uACF5\uBC31 \uD569\uCE58\uAE30",
  "setting.tidySpaces.desc": "\uB2E8\uC5B4 \uC0AC\uC774\uC5D0 \uC5F0\uC18D\uB41C \uACF5\uBC31\uC744 \uD558\uB098\uB85C \uB9CC\uB4ED\uB2C8\uB2E4. \uB4E4\uC5EC\uC4F0\uAE30, \uD45C, \uCF54\uB4DC\uB294 \uADF8\uB300\uB85C \uB461\uB2C8\uB2E4.",
  "setting.tidyTrailing.name": "\uC904 \uB05D \uACF5\uBC31 \uC81C\uAC70",
  "setting.tidyTrailing.desc": "\uC904 \uB05D\uC758 \uACF5\uBC31\uACFC \uD0ED.",
  "setting.tidyBlank.name": "\uBD88\uD544\uC694\uD55C \uBE48 \uC904 \uC81C\uAC70",
  "setting.tidyBlank.desc": "\uC5F0\uC18D\uB41C \uBE48 \uC904\uC744 \uD558\uB098\uB85C \uB9CC\uB4ED\uB2C8\uB2E4.",
  "setting.keepHardBreaks.name": "\uAC15\uC81C \uC904\uBC14\uAFC8 \uC720\uC9C0",
  "setting.keepHardBreaks.desc": "\uB9C8\uD06C\uB2E4\uC6B4\uC5D0\uC11C\uB294 \uD14D\uC2A4\uD2B8 \uC904 \uB05D\uC758 \uACF5\uBC31 \uB450 \uAC1C\uAC00 \uC904\uBC14\uAFC8\uC774\uBBC0\uB85C, \uC904 \uB05D \uACF5\uBC31 \uC81C\uAC70 \uC2DC \uC774\uB97C \uC720\uC9C0\uD569\uB2C8\uB2E4. \uC774 \uC635\uC158\uC744 \uB044\uBA74 \uADF8\uAC83\uB3C4 \uC81C\uAC70\uD569\uB2C8\uB2E4.",
  "setting.confirmTidy.name": "\uC815\uB9AC\uD558\uAE30 \uC804\uC5D0 \uD655\uC778",
  "setting.confirmTidy.desc": "\uC801\uC6A9\uD558\uAE30 \uC804\uC5D0 \uAC01 \uB2E8\uACC4\uAC00 \uBC14\uAFC0 \uC904 \uC218\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4.",
  "setting.cleanOnPaste.name": "\uBD99\uC5EC\uB123\uC744 \uB54C \uC815\uB9AC",
  "setting.cleanOnPaste.desc": "\uBD99\uC5EC\uB123\uC740 \uC77C\uBC18 \uD14D\uC2A4\uD2B8\uC5D0 \uC704 \uB2E8\uACC4\uB97C \uC2E4\uD589\uD569\uB2C8\uB2E4. \uCF54\uB4DC\uB098 \uD504\uB860\uD2B8\uB9E4\uD130 \uC548\uC5D0\uC11C\uB294 \uC2E4\uD589\uD558\uC9C0 \uC54A\uC73C\uBA70, \uC11C\uC2DD\uC774 \uC788\uB294 \uBD99\uC5EC\uB123\uAE30\uB294 Obsidian\uC774 \uCC98\uB9AC\uD558\uB3C4\uB85D \uB461\uB2C8\uB2E4. \uAE30\uBCF8\uAC12\uC740 \uAEBC\uC9D0\uC785\uB2C8\uB2E4.",
  "setting.keepImageAltText.name": "\uC774\uBBF8\uC9C0 \uB300\uCCB4 \uD14D\uC2A4\uD2B8 \uC720\uC9C0",
  "setting.keepImageAltText.desc": "\uC774\uBBF8\uC9C0\uB97C \uC77C\uBC18 \uD14D\uC2A4\uD2B8\uB85C \uBC14\uAFC0 \uB54C \uC774\uBBF8\uC9C0\uB97C \uD1B5\uC9F8\uB85C \uC9C0\uC6B0\uC9C0 \uC54A\uACE0 \uC124\uBA85\uC744 \uB0A8\uAE41\uB2C8\uB2E4.",
  // Settings: saved replacements
  "replacements.name": "\uB098\uB9CC\uC758 \uCC3E\uC544 \uBC14\uAFB8\uAE30 \uBA85\uB839",
  "replacements.desc": '\uAC01 \uBC14\uAFB8\uAE30\uB294 \uB2E8\uCD95\uD0A4\uB97C \uC9C0\uC815\uD560 \uC218 \uC788\uB294 "\uBC14\uAFB8\uAE30: <\uC774\uB984>" \uBA85\uB839\uC774 \uB418\uBA70, "\uC800\uC7A5\uB41C \uBC14\uAFB8\uAE30 \uC2E4\uD589\u2026"\uC5D0\uB3C4 \uB098\uC5F4\uB429\uB2C8\uB2E4. \uC120\uD0DD \uC601\uC5ED\uC5D0, \uC120\uD0DD \uC601\uC5ED\uC774 \uC5C6\uC73C\uBA74 \uB178\uD2B8 \uC804\uCCB4\uC5D0 \uC801\uC6A9\uB418\uACE0 \uCF54\uB4DC\uB098 \uD504\uB860\uD2B8\uB9E4\uD130\uB294 \uAC74\uB4DC\uB9AC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.',
  "replacements.nameField": "\uC774\uB984",
  "replacements.nameDesc": '\uBA85\uB839 \uC774\uB984\uC740 "\uBC14\uAFB8\uAE30: <\uC774\uB984>"\uC774 \uB429\uB2C8\uB2E4. \uC774\uB984\uC774 \uC5C6\uC73C\uBA74 \uBA85\uB839\uB3C4 \uC5C6\uC2B5\uB2C8\uB2E4.',
  "replacements.namePlaceholder": "\uB300\uC2DC \uACE0\uCE58\uAE30",
  "replacements.delete": "\uC774 \uBC14\uAFB8\uAE30 \uC0AD\uC81C",
  "replacements.find": "\uCC3E\uAE30",
  "replacements.replaceWith": "\uBC14\uAFC0 \uB0B4\uC6A9",
  "replacements.replaceWithDesc": "\uBE44\uC6CC \uB450\uBA74 \uC77C\uCE58\uD55C \uBD80\uBD84\uC744 \uC0AD\uC81C\uD569\uB2C8\uB2E4. \uC815\uADDC\uC2DD\uC744 \uCF1C\uBA74 $1\uC740 \uCCAB \uBC88\uC9F8 \uADF8\uB8F9, \\n\uC740 \uC904\uBC14\uAFC8\uC785\uB2C8\uB2E4.",
  "replacements.regex": "\uC815\uADDC\uC2DD",
  "replacements.matchCase": "\uB300\uC18C\uBB38\uC790 \uAD6C\uBD84",
  "replacements.add": "\uBC14\uAFB8\uAE30 \uCD94\uAC00"
};
var ko_default = ko;

// src/locales/pt-BR.ts
var ptBR = {
  // Commands
  "command.upper": "Mai\xFAsculas",
  "command.lower": "Min\xFAsculas",
  "command.title": "Mai\xFAsculas de t\xEDtulo",
  "command.sentence": "Mai\xFAscula de frase",
  "command.capitalizeWords": "Capitalizar cada palavra",
  "command.capitalizeSentences": "Capitalizar frases, mantendo o resto",
  "command.cycle": "Alternar mai\xFAsculas e min\xFAsculas",
  "command.slug": "Slug (min\xFAsculas, sem acentos, com hifens)",
  "command.joinLines": "Juntar linhas quebradas",
  "command.dehyphenate": "Reunir palavras divididas entre linhas",
  "command.stripInvisibles": "Remover caracteres invis\xEDveis",
  "command.replaceLigatures": "Substituir ligaduras",
  "command.straightenPunctuation": "Endireitar aspas e travess\xF5es",
  "command.removeTrailingWhitespace": "Remover espa\xE7os no fim das linhas",
  "command.collapseSpaces": "Reduzir espa\xE7os m\xFAltiplos",
  "command.unlink": "Links para texto simples",
  "command.sortLines": "Ordenar linhas de A a Z",
  "command.sortLinesDesc": "Ordenar linhas de Z a A",
  "command.dedupeLines": "Remover linhas duplicadas",
  "command.removeBlankLines": "Remover linhas em branco",
  "command.collapseBlankLines": "Remover linhas em branco extras (manter uma)",
  "command.tidyNote": "Organizar nota",
  "command.pickCase": "Alterar mai\xFAsculas e min\xFAsculas\u2026",
  "command.runSavedReplacement": "Executar uma substitui\xE7\xE3o salva\u2026",
  "command.replace": "Substituir: {name}",
  // Notices
  "notice.nothingToFormat": "Nada para formatar.",
  "notice.nothingToTidy": "Nada para organizar.",
  "notice.noTidySteps": "Nenhuma etapa de organiza\xE7\xE3o est\xE1 ativada. Escolha algumas nas configura\xE7\xF5es.",
  "notice.noSavedReplacements": "Ainda n\xE3o h\xE1 substitui\xE7\xF5es salvas. Adicione algumas nas configura\xE7\xF5es do plugin.",
  "notice.replacementProblem": "Substituir: {name}: {problem}",
  "notice.unnamed": "sem nome",
  "notice.skippedInCode": "A sele\xE7\xE3o come\xE7a ou termina dentro de c\xF3digo, ent\xE3o foi deixada como estava.",
  "notice.noMatches": 'Nenhuma ocorr\xEAncia de "{name}".',
  "notice.replacements.one": "1 substitui\xE7\xE3o feita.",
  "notice.replacements.other": "{count} substitui\xE7\xF5es feitas.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "Escolha as mai\xFAsculas e min\xFAsculas para a sele\xE7\xE3o",
  "modal.noChange": "Sem altera\xE7\xE3o",
  "modal.pickReplacement": "Escolha uma substitui\xE7\xE3o salva para executar",
  "modal.noName": "(sem nome)",
  "modal.tidy.line.one": "{step}: 1 linha",
  "modal.tidy.line.other": "{step}: {count} linhas",
  "modal.tidy.confirm": "Organizar",
  "modal.tidy.cancel": "Cancelar",
  // The steps of Tidy note
  "tidy.invisibles": "Remover caracteres invis\xEDveis",
  "tidy.ligatures": "Substituir ligaduras",
  "tidy.join": "Juntar linhas quebradas",
  "tidy.spaces": "Reduzir espa\xE7os m\xFAltiplos",
  "tidy.trailing": "Remover espa\xE7os no fim das linhas",
  "tidy.blank": "Remover linhas em branco extras",
  // Why a saved replacement cannot run
  "error.findEmpty": "O texto a localizar est\xE1 vazio.",
  "error.invalidRegex": "N\xE3o \xE9 uma express\xE3o regular v\xE1lida: {reason}",
  // Settings: headings
  "heading.case": "Mai\xFAsculas e min\xFAsculas",
  "heading.cleanup": "Limpeza",
  "heading.tidy": "Organizar nota",
  "heading.replacements": "Substitui\xE7\xF5es salvas",
  // Settings: dropdown options
  "option.systemDefault": "Padr\xE3o do sistema",
  "option.turkish": "Turco",
  "option.azerbaijani": "Azerbaijano",
  "option.lithuanian": "Lituano",
  "option.wholeLine": "Linha inteira",
  "option.wordAtCaret": "Palavra sob o cursor",
  // Settings
  "setting.locale.name": "Regras do idioma",
  "setting.locale.desc": "O turco e o azerbaijano associam o i com ponto e sem ponto de forma diferente de todos os outros idiomas.",
  "setting.preserveAcronyms.name": "Manter siglas como est\xE3o",
  "setting.preserveAcronyms.desc": "Deixa como est\xE3o siglas como NASA e PDF e nomes como iPhone, macOS e GitHub. Ignorado quando toda a sele\xE7\xE3o j\xE1 est\xE1 em mai\xFAsculas, pois ent\xE3o todas as palavras parecem siglas.",
  "setting.stopWords.name": "Palavras que o t\xEDtulo mant\xE9m em min\xFAsculas",
  "setting.stopWords.desc": "Separadas por v\xEDrgulas. A primeira e a \xFAltima palavra de um t\xEDtulo sempre ficam em mai\xFAscula, seja qual for esta lista.",
  "setting.removeHyphenOnJoin.name": "Remover o h\xEDfen ao juntar linhas",
  "setting.removeHyphenOnJoin.desc": 'Um PDF quebra uma palavra como "trans-" e "lation". Desative para textos em que um composto real como "well-known" \xE9 mais prov\xE1vel que uma palavra quebrada.',
  "setting.caseTarget.name": "Sem sele\xE7\xE3o, alterar as mai\xFAsculas de",
  "setting.caseTarget.desc": "A linha inteira, ou apenas a palavra sob o cursor.",
  "setting.tidyInvisibles.name": "Remover caracteres invis\xEDveis",
  "setting.tidyInvisibles.desc": "Caracteres de largura zero e hifens suaves saem; espa\xE7os n\xE3o separ\xE1veis viram espa\xE7os comuns.",
  "setting.tidyLigatures.name": "Substituir ligaduras",
  "setting.tidyLigatures.desc": "\uFB01 e \uFB02 viram fi e fl.",
  "setting.tidyJoin.name": "Juntar linhas quebradas",
  "setting.tidyJoin.desc": "Une um par\xE1grafo quebrado \xE0 for\xE7a em v\xE1rias linhas. Desativado por padr\xE3o: altera a estrutura das linhas.",
  "setting.tidySpaces.name": "Reduzir espa\xE7os m\xFAltiplos",
  "setting.tidySpaces.desc": "Sequ\xEAncias de espa\xE7os entre palavras viram um s\xF3. Recuos, tabelas e c\xF3digo n\xE3o s\xE3o alterados.",
  "setting.tidyTrailing.name": "Remover espa\xE7os no fim das linhas",
  "setting.tidyTrailing.desc": "Espa\xE7os e tabula\xE7\xF5es no fim das linhas.",
  "setting.tidyBlank.name": "Remover linhas em branco extras",
  "setting.tidyBlank.desc": "Sequ\xEAncias de linhas em branco viram uma s\xF3.",
  "setting.keepHardBreaks.name": "Manter quebras de linha for\xE7adas",
  "setting.keepHardBreaks.desc": "Dois espa\xE7os no fim de uma linha de texto s\xE3o uma quebra de linha no Markdown, ent\xE3o a remo\xE7\xE3o de espa\xE7os no fim das linhas os mant\xE9m. Desative para remov\xEA-los tamb\xE9m.",
  "setting.confirmTidy.name": "Confirmar antes de organizar",
  "setting.confirmTidy.desc": "Mostra quantas linhas cada etapa alteraria antes de aplicar.",
  "setting.cleanOnPaste.name": "Organizar ao colar",
  "setting.cleanOnPaste.desc": "Executa as etapas acima no texto simples que voc\xEA cola. Nunca dentro de c\xF3digo ou frontmatter, e colagens com formata\xE7\xE3o ficam por conta do Obsidian. Desativado por padr\xE3o.",
  "setting.keepImageAltText.name": "Manter o texto alternativo das imagens",
  "setting.keepImageAltText.desc": "Mant\xE9m a descri\xE7\xE3o quando uma imagem \xE9 convertida em texto simples, em vez de remover a imagem por completo.",
  // Settings: saved replacements
  "replacements.name": "Seus comandos de localizar e substituir",
  "replacements.desc": 'Cada substitui\xE7\xE3o vira um comando, "Substituir: <nome>", ao qual voc\xEA pode atribuir um atalho, e aparece em "Executar uma substitui\xE7\xE3o salva\u2026". Atua na sele\xE7\xE3o, ou na nota inteira quando nada est\xE1 selecionado, e nunca mexe em c\xF3digo nem em frontmatter.',
  "replacements.nameField": "Nome",
  "replacements.nameDesc": 'O comando se chama "Substituir: <nome>". Sem nome, n\xE3o h\xE1 comando.',
  "replacements.namePlaceholder": "Corrigir travess\xF5es",
  "replacements.delete": "Excluir esta substitui\xE7\xE3o",
  "replacements.find": "Localizar",
  "replacements.replaceWith": "Substituir por",
  "replacements.replaceWithDesc": "Deixe vazio para excluir as ocorr\xEAncias. Com express\xE3o regular ativada, $1 \xE9 o primeiro grupo e \\n uma quebra de linha.",
  "replacements.regex": "Express\xE3o regular",
  "replacements.matchCase": "Diferenciar mai\xFAsculas de min\xFAsculas",
  "replacements.add": "Adicionar uma substitui\xE7\xE3o"
};
var pt_BR_default = ptBR;

// src/locales/ru.ts
var ru = {
  // Commands
  "command.upper": "\u0412\u0435\u0440\u0445\u043D\u0438\u0439 \u0440\u0435\u0433\u0438\u0441\u0442\u0440",
  "command.lower": "\u041D\u0438\u0436\u043D\u0438\u0439 \u0440\u0435\u0433\u0438\u0441\u0442\u0440",
  "command.title": "\u0420\u0435\u0433\u0438\u0441\u0442\u0440 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430",
  "command.sentence": "\u0420\u0435\u0433\u0438\u0441\u0442\u0440 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
  "command.capitalizeWords": "\u041A\u0430\u0436\u0434\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0441 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u0431\u0443\u043A\u0432\u044B",
  "command.capitalizeSentences": "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0441 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u0431\u0443\u043A\u0432\u044B, \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",
  "command.cycle": "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440 \u043F\u043E \u043A\u0440\u0443\u0433\u0443",
  "command.slug": "\u0421\u043B\u0430\u0433 (\u043D\u0438\u0436\u043D\u0438\u0439 \u0440\u0435\u0433\u0438\u0441\u0442\u0440, \u0431\u0435\u0437 \u0434\u0438\u0430\u043A\u0440\u0438\u0442\u0438\u043A\u0438, \u0447\u0435\u0440\u0435\u0437 \u0434\u0435\u0444\u0438\u0441\u044B)",
  "command.joinLines": "\u0421\u043A\u043B\u0435\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0451\u043D\u043D\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  "command.dehyphenate": "\u0421\u043A\u043B\u0435\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u0430, \u0440\u0430\u0437\u043E\u0440\u0432\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u043E\u043C \u0441\u0442\u0440\u043E\u043A\u0438",
  "command.stripInvisibles": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B",
  "command.replaceLigatures": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043B\u0438\u0433\u0430\u0442\u0443\u0440\u044B",
  "command.straightenPunctuation": "\u0412\u044B\u043F\u0440\u044F\u043C\u0438\u0442\u044C \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0438 \u0442\u0438\u0440\u0435",
  "command.removeTrailingWhitespace": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u043E\u0431\u0435\u043B\u044B \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A",
  "command.collapseSpaces": "\u0421\u0436\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u043F\u0440\u043E\u0431\u0435\u043B\u044B",
  "command.unlink": "\u0421\u0441\u044B\u043B\u043A\u0438 \u0432 \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442",
  "command.sortLines": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0438 \u043E\u0442 \u0410 \u0434\u043E \u042F",
  "command.sortLinesDesc": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0438 \u043E\u0442 \u042F \u0434\u043E \u0410",
  "command.dedupeLines": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u0441\u0442\u0440\u043E\u043A\u0438",
  "command.removeBlankLines": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  "command.collapseBlankLines": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043B\u0438\u0448\u043D\u0438\u0435 \u043F\u0443\u0441\u0442\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438 (\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043E\u0434\u043D\u0443)",
  "command.tidyNote": "\u041F\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u0432 \u043F\u043E\u0440\u044F\u0434\u043E\u043A",
  "command.pickCase": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u2026",
  "command.runSavedReplacement": "\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u0443\u044E \u0437\u0430\u043C\u0435\u043D\u0443\u2026",
  "command.replace": "\u0417\u0430\u043C\u0435\u043D\u0430: {name}",
  // Notices
  "notice.nothingToFormat": "\u0424\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u0435\u0447\u0435\u0433\u043E.",
  "notice.nothingToTidy": "\u041F\u0440\u0438\u0432\u043E\u0434\u0438\u0442\u044C \u0432 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043D\u0435\u0447\u0435\u0433\u043E.",
  "notice.noTidySteps": "\u041D\u0438 \u043E\u0434\u0438\u043D \u0448\u0430\u0433 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0451\u043D. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0448\u0430\u0433\u0438 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445.",
  "notice.noSavedReplacements": "\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0445 \u0437\u0430\u043C\u0435\u043D \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0438\u0445 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430.",
  "notice.replacementProblem": "\u0417\u0430\u043C\u0435\u043D\u0430: {name}: {problem}",
  "notice.unnamed": "\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F",
  "notice.skippedInCode": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0438\u043B\u0438 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u043D\u0443\u0442\u0440\u0438 \u043A\u043E\u0434\u0430, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043E\u043D\u043E \u043D\u0435 \u0442\u0440\u043E\u043D\u0443\u0442\u043E.",
  "notice.noMatches": "\u041D\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \xAB{name}\xBB.",
  "notice.replacements.one": "\u0421\u0434\u0435\u043B\u0430\u043D\u0430 1 \u0437\u0430\u043C\u0435\u043D\u0430.",
  "notice.replacements.other": "\u0421\u0434\u0435\u043B\u0430\u043D\u043E \u0437\u0430\u043C\u0435\u043D: {count}.",
  // Pickers and the tidy confirmation
  "modal.pickCase": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440 \u0434\u043B\u044F \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0442\u0435\u043A\u0441\u0442\u0430",
  "modal.noChange": "\u0411\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",
  "modal.pickReplacement": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u0443\u044E \u0437\u0430\u043C\u0435\u043D\u0443 \u0434\u043B\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",
  "modal.noName": "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)",
  "modal.tidy.line.one": "{step}: 1 \u0441\u0442\u0440\u043E\u043A\u0430",
  "modal.tidy.line.other": "{step}: \u0441\u0442\u0440\u043E\u043A \u2014 {count}",
  "modal.tidy.confirm": "\u041F\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u0432 \u043F\u043E\u0440\u044F\u0434\u043E\u043A",
  "modal.tidy.cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
  // The steps of Tidy note
  "tidy.invisibles": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B",
  "tidy.ligatures": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043B\u0438\u0433\u0430\u0442\u0443\u0440\u044B",
  "tidy.join": "\u0421\u043A\u043B\u0435\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0451\u043D\u043D\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  "tidy.spaces": "\u0421\u0436\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u043F\u0440\u043E\u0431\u0435\u043B\u044B",
  "tidy.trailing": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u043E\u0431\u0435\u043B\u044B \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A",
  "tidy.blank": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043B\u0438\u0448\u043D\u0438\u0435 \u043F\u0443\u0441\u0442\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  // Why a saved replacement cannot run
  "error.findEmpty": "\u0418\u0441\u043A\u043E\u043C\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043F\u0443\u0441\u0442.",
  "error.invalidRegex": "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435: {reason}",
  // Settings: headings
  "heading.case": "\u0420\u0435\u0433\u0438\u0441\u0442\u0440",
  "heading.cleanup": "\u041E\u0447\u0438\u0441\u0442\u043A\u0430",
  "heading.tidy": "\u041F\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u0432 \u043F\u043E\u0440\u044F\u0434\u043E\u043A",
  "heading.replacements": "\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u043D\u044B",
  // Settings: dropdown options
  "option.systemDefault": "\u041A\u0430\u043A \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435",
  "option.turkish": "\u0422\u0443\u0440\u0435\u0446\u043A\u0438\u0439",
  "option.azerbaijani": "\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D\u0441\u043A\u0438\u0439",
  "option.lithuanian": "\u041B\u0438\u0442\u043E\u0432\u0441\u043A\u0438\u0439",
  "option.wholeLine": "\u0412\u0441\u044F \u0441\u0442\u0440\u043E\u043A\u0430",
  "option.wordAtCaret": "\u0421\u043B\u043E\u0432\u043E \u043F\u043E\u0434 \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C",
  // Settings
  "setting.locale.name": "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u044F\u0437\u044B\u043A\u0430",
  "setting.locale.desc": "\u0412 \u0442\u0443\u0440\u0435\u0446\u043A\u043E\u043C \u0438 \u0430\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D\u0441\u043A\u043E\u043C \u044F\u0437\u044B\u043A\u0430\u0445 i \u0441 \u0442\u043E\u0447\u043A\u043E\u0439 \u0438 \u0431\u0435\u0437 \u0442\u043E\u0447\u043A\u0438 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443 \u0438\u043D\u0430\u0447\u0435, \u0447\u0435\u043C \u0432\u043E \u0432\u0441\u0435\u0445 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445.",
  "setting.preserveAcronyms.name": "\u041D\u0435 \u043C\u0435\u043D\u044F\u0442\u044C \u0430\u0431\u0431\u0440\u0435\u0432\u0438\u0430\u0442\u0443\u0440\u044B",
  "setting.preserveAcronyms.desc": "\u041E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0430\u0431\u0431\u0440\u0435\u0432\u0438\u0430\u0442\u0443\u0440\u044B \u0432\u0440\u043E\u0434\u0435 NASA \u0438 PDF \u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u0432\u0440\u043E\u0434\u0435 iPhone, macOS \u0438 GitHub. \u041D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F, \u0435\u0441\u043B\u0438 \u0432\u0441\u0451 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u0432 \u0432\u0435\u0440\u0445\u043D\u0435\u043C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0435: \u0442\u043E\u0433\u0434\u0430 \u043A\u0430\u0436\u0434\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u043F\u043E\u0445\u043E\u0436\u0435 \u043D\u0430 \u0430\u0431\u0431\u0440\u0435\u0432\u0438\u0430\u0442\u0443\u0440\u0443.",
  "setting.stopWords.name": "\u0421\u043B\u043E\u0432\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0441\u0442\u0440\u043E\u0447\u043D\u044B\u043C\u0438",
  "setting.stopWords.desc": "\u0427\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E. \u041F\u0435\u0440\u0432\u043E\u0435 \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0441\u043B\u043E\u0432\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0438\u0448\u0443\u0442\u0441\u044F \u0441 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u0431\u0443\u043A\u0432\u044B, \u0447\u0442\u043E \u0431\u044B \u043D\u0438 \u0433\u043E\u0432\u043E\u0440\u0438\u043B \u044D\u0442\u043E\u0442 \u0441\u043F\u0438\u0441\u043E\u043A.",
  "setting.removeHyphenOnJoin.name": "\u0423\u0431\u0438\u0440\u0430\u0442\u044C \u0434\u0435\u0444\u0438\u0441 \u043F\u0440\u0438 \u0441\u043A\u043B\u0435\u0439\u043A\u0435 \u0441\u0442\u0440\u043E\u043A",
  "setting.removeHyphenOnJoin.desc": 'PDF \u0440\u0430\u0437\u0440\u044B\u0432\u0430\u0435\u0442 \u0441\u043B\u043E\u0432\u043E \u043A\u0430\u043A "trans-" \u0438 "lation". \u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0434\u043B\u044F \u0442\u0435\u043A\u0441\u0442\u043E\u0432, \u0433\u0434\u0435 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435 \u0441\u043E\u0441\u0442\u0430\u0432\u043D\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0432\u0440\u043E\u0434\u0435 "well-known" \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u0435\u0435, \u0447\u0435\u043C \u0440\u0430\u0437\u043E\u0440\u0432\u0430\u043D\u043D\u043E\u0435.',
  "setting.caseTarget.name": "\u0411\u0435\u0437 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u044F \u043C\u0435\u043D\u044F\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440 \u0443",
  "setting.caseTarget.desc": "\u0412\u0441\u0435\u0439 \u0441\u0442\u0440\u043E\u043A\u0438 \u0438\u043B\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043B\u043E\u0432\u0430 \u043F\u043E\u0434 \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C.",
  "setting.tidyInvisibles.name": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B",
  "setting.tidyInvisibles.desc": "\u0421\u0438\u043C\u0432\u043E\u043B\u044B \u043D\u0443\u043B\u0435\u0432\u043E\u0439 \u0448\u0438\u0440\u0438\u043D\u044B \u0438 \u043C\u044F\u0433\u043A\u0438\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u044B \u0443\u0434\u0430\u043B\u044F\u044E\u0442\u0441\u044F; \u043D\u0435\u0440\u0430\u0437\u0440\u044B\u0432\u043D\u044B\u0435 \u043F\u0440\u043E\u0431\u0435\u043B\u044B \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043E\u0431\u044B\u0447\u043D\u044B\u043C\u0438.",
  "setting.tidyLigatures.name": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043B\u0438\u0433\u0430\u0442\u0443\u0440\u044B",
  "setting.tidyLigatures.desc": "\uFB01 \u0438 \uFB02 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F fi \u0438 fl.",
  "setting.tidyJoin.name": "\u0421\u043A\u043B\u0435\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0451\u043D\u043D\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  "setting.tidyJoin.desc": "\u0421\u043A\u043B\u0435\u0438\u0432\u0430\u0435\u0442 \u0430\u0431\u0437\u0430\u0446, \u0436\u0451\u0441\u0442\u043A\u043E \u0440\u0430\u0437\u0431\u0438\u0442\u044B\u0439 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0438. \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E: \u043C\u0435\u043D\u044F\u0435\u0442 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u0441\u0442\u0440\u043E\u043A.",
  "setting.tidySpaces.name": "\u0421\u0436\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0435\u0441\u044F \u043F\u0440\u043E\u0431\u0435\u043B\u044B",
  "setting.tidySpaces.desc": "\u041D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432 \u043F\u043E\u0434\u0440\u044F\u0434 \u043C\u0435\u0436\u0434\u0443 \u0441\u043B\u043E\u0432\u0430\u043C\u0438 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043E\u0434\u043D\u0438\u043C. \u041E\u0442\u0441\u0442\u0443\u043F\u044B, \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u0438 \u043A\u043E\u0434 \u043D\u0435 \u0437\u0430\u0442\u0440\u0430\u0433\u0438\u0432\u0430\u044E\u0442\u0441\u044F.",
  "setting.tidyTrailing.name": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u043E\u0431\u0435\u043B\u044B \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A",
  "setting.tidyTrailing.desc": "\u041F\u0440\u043E\u0431\u0435\u043B\u044B \u0438 \u0442\u0430\u0431\u0443\u043B\u044F\u0446\u0438\u0438 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A.",
  "setting.tidyBlank.name": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043B\u0438\u0448\u043D\u0438\u0435 \u043F\u0443\u0441\u0442\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
  "setting.tidyBlank.desc": "\u041D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0443\u0441\u0442\u044B\u0445 \u0441\u0442\u0440\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043E\u0434\u043D\u043E\u0439.",
  "setting.keepHardBreaks.name": "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0436\u0451\u0441\u0442\u043A\u0438\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u044B \u0441\u0442\u0440\u043E\u043A",
  "setting.keepHardBreaks.desc": "\u0414\u0432\u0430 \u043F\u0440\u043E\u0431\u0435\u043B\u0430 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A\u0438 \u0442\u0435\u043A\u0441\u0442\u0430 \u0432 Markdown \u043E\u0437\u043D\u0430\u0447\u0430\u044E\u0442 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0442\u0440\u043E\u043A \u043E\u043D\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F. \u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u0438 \u0438\u0445.",
  "setting.confirmTidy.name": "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0442\u044C \u043F\u0435\u0440\u0435\u0434 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0430",
  "setting.confirmTidy.desc": "\u041F\u0435\u0440\u0435\u0434 \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u0440\u043E\u043A \u0438\u0437\u043C\u0435\u043D\u0438\u0442 \u043A\u0430\u0436\u0434\u044B\u0439 \u0448\u0430\u0433.",
  "setting.cleanOnPaste.name": "\u041D\u0430\u0432\u043E\u0434\u0438\u0442\u044C \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043F\u0440\u0438 \u0432\u0441\u0442\u0430\u0432\u043A\u0435",
  "setting.cleanOnPaste.desc": "\u0412\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u043D\u044B\u0435 \u0432\u044B\u0448\u0435 \u0448\u0430\u0433\u0438 \u043D\u0430\u0434 \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C\u044B\u043C \u043E\u0431\u044B\u0447\u043D\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C. \u041D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0432 \u043A\u043E\u0434\u0435 \u0438\u043B\u0438 frontmatter; \u0432\u0441\u0442\u0430\u0432\u043A\u0430 \u0441 \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0437\u0430 Obsidian. \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E.",
  "setting.keepImageAltText.name": "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439",
  "setting.keepImageAltText.desc": "\u041E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043A\u043E\u0433\u0434\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442, \u0432\u043C\u0435\u0441\u0442\u043E \u043F\u043E\u043B\u043D\u043E\u0433\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F.",
  // Settings: saved replacements
  "replacements.name": "\u0412\u0430\u0448\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043F\u043E\u0438\u0441\u043A\u0430 \u0438 \u0437\u0430\u043C\u0435\u043D\u044B",
  "replacements.desc": "\u041A\u0430\u0436\u0434\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 \xAB\u0417\u0430\u043C\u0435\u043D\u0430: <\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435>\xBB, \u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u043C\u043E\u0436\u043D\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0438\u0442\u044C \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u043A\u043B\u0430\u0432\u0438\u0448, \u0438 \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u0441\u043F\u0438\u0441\u043E\u043A \xAB\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u0443\u044E \u0437\u0430\u043C\u0435\u043D\u0443\u2026\xBB. \u041E\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0441 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435\u043C, \u0430 \u0435\u0441\u043B\u0438 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043E, \u0441\u043E \u0432\u0441\u0435\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u043E\u0439, \u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0437\u0430\u0442\u0440\u0430\u0433\u0438\u0432\u0430\u0435\u0442 \u043A\u043E\u0434 \u0438 frontmatter.",
  "replacements.nameField": "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
  "replacements.nameDesc": "\u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u043D\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \xAB\u0417\u0430\u043C\u0435\u043D\u0430: <\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435>\xBB. \u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043D\u0435\u0442.",
  "replacements.namePlaceholder": "\u0418\u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0438\u0440\u0435",
  "replacements.delete": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u043C\u0435\u043D\u0443",
  "replacements.find": "\u041D\u0430\u0439\u0442\u0438",
  "replacements.replaceWith": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430",
  "replacements.replaceWithDesc": "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F. \u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u043E\u043C \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u043C \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0438 $1 \u2014 \u043F\u0435\u0440\u0432\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430, \u0430 \\n \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438.",
  "replacements.regex": "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
  "replacements.matchCase": "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440",
  "replacements.add": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u043D\u0443"
};
var ru_default = ru;

// src/locales/zh.ts
var zh = {
  // Commands
  "command.upper": "\u5927\u5199",
  "command.lower": "\u5C0F\u5199",
  "command.title": "\u6807\u9898\u5F0F\u5927\u5C0F\u5199",
  "command.sentence": "\u53E5\u5B50\u5F0F\u5927\u5C0F\u5199",
  "command.capitalizeWords": "\u6BCF\u4E2A\u5355\u8BCD\u9996\u5B57\u6BCD\u5927\u5199",
  "command.capitalizeSentences": "\u53E5\u9996\u5B57\u6BCD\u5927\u5199\uFF0C\u5176\u4F59\u4FDD\u6301\u4E0D\u53D8",
  "command.cycle": "\u5FAA\u73AF\u5207\u6362\u5927\u5C0F\u5199",
  "command.slug": "Slug\uFF08\u5C0F\u5199\u3001\u53BB\u9664\u91CD\u97F3\u7B26\u53F7\u3001\u8FDE\u5B57\u7B26\uFF09",
  "command.joinLines": "\u5408\u5E76\u6298\u884C",
  "command.dehyphenate": "\u91CD\u65B0\u8FDE\u63A5\u88AB\u5206\u884C\u62C6\u5F00\u7684\u5355\u8BCD",
  "command.stripInvisibles": "\u79FB\u9664\u4E0D\u53EF\u89C1\u5B57\u7B26",
  "command.replaceLigatures": "\u66FF\u6362\u8FDE\u5B57",
  "command.straightenPunctuation": "\u5C06\u5F15\u53F7\u548C\u7834\u6298\u53F7\u8F6C\u4E3A\u76F4\u5F62",
  "command.removeTrailingWhitespace": "\u79FB\u9664\u884C\u5C3E\u7A7A\u767D",
  "command.collapseSpaces": "\u5408\u5E76\u591A\u4E2A\u7A7A\u683C",
  "command.unlink": "\u94FE\u63A5\u8F6C\u4E3A\u7EAF\u6587\u672C",
  "command.sortLines": "\u6309 A \u5230 Z \u6392\u5E8F\u884C",
  "command.sortLinesDesc": "\u6309 Z \u5230 A \u6392\u5E8F\u884C",
  "command.dedupeLines": "\u79FB\u9664\u91CD\u590D\u884C",
  "command.removeBlankLines": "\u79FB\u9664\u7A7A\u884C",
  "command.collapseBlankLines": "\u79FB\u9664\u591A\u4F59\u7A7A\u884C\uFF08\u4FDD\u7559\u4E00\u884C\uFF09",
  "command.tidyNote": "\u6574\u7406\u7B14\u8BB0",
  "command.pickCase": "\u66F4\u6539\u5927\u5C0F\u5199\u2026",
  "command.runSavedReplacement": "\u8FD0\u884C\u5DF2\u4FDD\u5B58\u7684\u66FF\u6362\u2026",
  "command.replace": "\u66FF\u6362\uFF1A{name}",
  // Notices
  "notice.nothingToFormat": "\u6CA1\u6709\u9700\u8981\u683C\u5F0F\u5316\u7684\u5185\u5BB9\u3002",
  "notice.nothingToTidy": "\u6CA1\u6709\u9700\u8981\u6574\u7406\u7684\u5185\u5BB9\u3002",
  "notice.noTidySteps": "\u6CA1\u6709\u5F00\u542F\u4EFB\u4F55\u6574\u7406\u6B65\u9AA4\u3002\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9\u3002",
  "notice.noSavedReplacements": "\u8FD8\u6CA1\u6709\u5DF2\u4FDD\u5B58\u7684\u66FF\u6362\u3002\u8BF7\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u6DFB\u52A0\u3002",
  "notice.replacementProblem": "\u66FF\u6362\uFF1A{name}\uFF1A{problem}",
  "notice.unnamed": "\u672A\u547D\u540D",
  "notice.skippedInCode": "\u6240\u9009\u5185\u5BB9\u7684\u5F00\u5934\u6216\u7ED3\u5C3E\u4F4D\u4E8E\u4EE3\u7801\u4E2D\uFF0C\u56E0\u6B64\u672A\u4F5C\u5904\u7406\u3002",
  "notice.noMatches": "\u6CA1\u6709\u5339\u914D\u201C{name}\u201D\u7684\u5185\u5BB9\u3002",
  "notice.replacements.one": "\u5DF2\u5B8C\u6210 1 \u5904\u66FF\u6362\u3002",
  "notice.replacements.other": "\u5DF2\u5B8C\u6210 {count} \u5904\u66FF\u6362\u3002",
  // Pickers and the tidy confirmation
  "modal.pickCase": "\u4E3A\u6240\u9009\u5185\u5BB9\u9009\u62E9\u5927\u5C0F\u5199",
  "modal.noChange": "\u65E0\u53D8\u5316",
  "modal.pickReplacement": "\u9009\u62E9\u8981\u8FD0\u884C\u7684\u5DF2\u4FDD\u5B58\u66FF\u6362",
  "modal.noName": "\uFF08\u65E0\u540D\u79F0\uFF09",
  "modal.tidy.line.one": "{step}\uFF1A1 \u884C",
  "modal.tidy.line.other": "{step}\uFF1A{count} \u884C",
  "modal.tidy.confirm": "\u6574\u7406",
  "modal.tidy.cancel": "\u53D6\u6D88",
  // The steps of Tidy note
  "tidy.invisibles": "\u79FB\u9664\u4E0D\u53EF\u89C1\u5B57\u7B26",
  "tidy.ligatures": "\u66FF\u6362\u8FDE\u5B57",
  "tidy.join": "\u5408\u5E76\u6298\u884C",
  "tidy.spaces": "\u5408\u5E76\u591A\u4E2A\u7A7A\u683C",
  "tidy.trailing": "\u79FB\u9664\u884C\u5C3E\u7A7A\u767D",
  "tidy.blank": "\u79FB\u9664\u591A\u4F59\u7A7A\u884C",
  // Why a saved replacement cannot run
  "error.findEmpty": "\u67E5\u627E\u5185\u5BB9\u4E3A\u7A7A\u3002",
  "error.invalidRegex": "\u4E0D\u662F\u6709\u6548\u7684\u6B63\u5219\u8868\u8FBE\u5F0F\uFF1A{reason}",
  // Settings: headings
  "heading.case": "\u5927\u5C0F\u5199",
  "heading.cleanup": "\u6E05\u7406",
  "heading.tidy": "\u6574\u7406\u7B14\u8BB0",
  "heading.replacements": "\u5DF2\u4FDD\u5B58\u7684\u66FF\u6362",
  // Settings: dropdown options
  "option.systemDefault": "\u7CFB\u7EDF\u9ED8\u8BA4",
  "option.turkish": "\u571F\u8033\u5176\u8BED",
  "option.azerbaijani": "\u963F\u585E\u62DC\u7586\u8BED",
  "option.lithuanian": "\u7ACB\u9676\u5B9B\u8BED",
  "option.wholeLine": "\u6574\u884C",
  "option.wordAtCaret": "\u5149\u6807\u6240\u5728\u7684\u5355\u8BCD",
  // Settings
  "setting.locale.name": "\u8BED\u8A00\u89C4\u5219",
  "setting.locale.desc": "\u571F\u8033\u5176\u8BED\u548C\u963F\u585E\u62DC\u7586\u8BED\u5BF9\u5E26\u70B9\u548C\u4E0D\u5E26\u70B9\u7684 i \u7684\u5927\u5C0F\u5199\u6620\u5C04\u4E0E\u5176\u4ED6\u8BED\u8A00\u4E0D\u540C\u3002",
  "setting.preserveAcronyms.name": "\u4FDD\u6301\u9996\u5B57\u6BCD\u7F29\u5199\u4E0D\u53D8",
  "setting.preserveAcronyms.desc": "\u4FDD\u6301 NASA\u3001PDF \u4E4B\u7C7B\u7684\u9996\u5B57\u6BCD\u7F29\u5199\uFF0C\u4EE5\u53CA iPhone\u3001macOS\u3001GitHub \u4E4B\u7C7B\u7684\u540D\u79F0\u4E0D\u53D8\u3002\u5F53\u6574\u6BB5\u9009\u4E2D\u5185\u5BB9\u5DF2\u5168\u90E8\u5927\u5199\u65F6\u4F1A\u88AB\u5FFD\u7565\uFF0C\u56E0\u4E3A\u90A3\u65F6\u6BCF\u4E2A\u5355\u8BCD\u770B\u8D77\u6765\u90FD\u50CF\u7F29\u5199\u3002",
  "setting.stopWords.name": "\u6807\u9898\u5F0F\u5927\u5C0F\u5199\u4E2D\u4FDD\u6301\u5C0F\u5199\u7684\u5355\u8BCD",
  "setting.stopWords.desc": "\u7528\u9017\u53F7\u5206\u9694\u3002\u65E0\u8BBA\u6B64\u5217\u8868\u5982\u4F55\u8BBE\u7F6E\uFF0C\u6807\u9898\u7684\u7B2C\u4E00\u4E2A\u548C\u6700\u540E\u4E00\u4E2A\u5355\u8BCD\u59CB\u7EC8\u5927\u5199\u3002",
  "setting.removeHyphenOnJoin.name": "\u5408\u5E76\u884C\u65F6\u53BB\u6389\u8FDE\u5B57\u7B26",
  "setting.removeHyphenOnJoin.desc": 'PDF \u4F1A\u628A\u5355\u8BCD\u65AD\u6210 "trans-" \u548C "lation"\u3002\u5BF9\u4E8E\u771F\u6B63\u7684\u590D\u5408\u8BCD\uFF08\u5982 "well-known"\uFF09\u6BD4\u65AD\u5F00\u7684\u5355\u8BCD\u66F4\u5E38\u89C1\u7684\u6587\u672C\uFF0C\u8BF7\u5173\u95ED\u6B64\u9879\u3002',
  "setting.caseTarget.name": "\u6CA1\u6709\u9009\u4E2D\u5185\u5BB9\u65F6\uFF0C\u66F4\u6539\u5927\u5C0F\u5199\u7684\u8303\u56F4",
  "setting.caseTarget.desc": "\u6574\u884C\uFF0C\u6216\u4EC5\u5149\u6807\u6240\u5728\u7684\u5355\u8BCD\u3002",
  "setting.tidyInvisibles.name": "\u79FB\u9664\u4E0D\u53EF\u89C1\u5B57\u7B26",
  "setting.tidyInvisibles.desc": "\u96F6\u5BBD\u5B57\u7B26\u548C\u8F6F\u8FDE\u5B57\u7B26\u4F1A\u88AB\u79FB\u9664\uFF1B\u4E0D\u95F4\u65AD\u7A7A\u683C\u53D8\u4E3A\u666E\u901A\u7A7A\u683C\u3002",
  "setting.tidyLigatures.name": "\u66FF\u6362\u8FDE\u5B57",
  "setting.tidyLigatures.desc": "\uFB01 \u548C \uFB02 \u53D8\u4E3A fi \u548C fl\u3002",
  "setting.tidyJoin.name": "\u5408\u5E76\u6298\u884C",
  "setting.tidyJoin.desc": "\u5408\u5E76\u88AB\u786C\u6298\u884C\u62C6\u6210\u591A\u884C\u7684\u6BB5\u843D\u3002\u9ED8\u8BA4\u5173\u95ED\uFF1A\u5B83\u4F1A\u6539\u53D8\u884C\u7ED3\u6784\u3002",
  "setting.tidySpaces.name": "\u5408\u5E76\u591A\u4E2A\u7A7A\u683C",
  "setting.tidySpaces.desc": "\u5355\u8BCD\u4E4B\u95F4\u8FDE\u7EED\u7684\u7A7A\u683C\u53D8\u4E3A\u4E00\u4E2A\u3002\u7F29\u8FDB\u3001\u8868\u683C\u548C\u4EE3\u7801\u4E0D\u53D7\u5F71\u54CD\u3002",
  "setting.tidyTrailing.name": "\u79FB\u9664\u884C\u5C3E\u7A7A\u767D",
  "setting.tidyTrailing.desc": "\u884C\u5C3E\u7684\u7A7A\u683C\u548C\u5236\u8868\u7B26\u3002",
  "setting.tidyBlank.name": "\u79FB\u9664\u591A\u4F59\u7A7A\u884C",
  "setting.tidyBlank.desc": "\u8FDE\u7EED\u7684\u7A7A\u884C\u53D8\u4E3A\u4E00\u884C\u3002",
  "setting.keepHardBreaks.name": "\u4FDD\u7559\u786C\u6362\u884C",
  "setting.keepHardBreaks.desc": "\u5728 Markdown \u4E2D\uFF0C\u4E00\u884C\u6587\u5B57\u672B\u5C3E\u7684\u4E24\u4E2A\u7A7A\u683C\u8868\u793A\u6362\u884C\uFF0C\u56E0\u6B64\u79FB\u9664\u884C\u5C3E\u7A7A\u767D\u65F6\u4F1A\u4FDD\u7559\u5B83\u4EEC\u3002\u5173\u95ED\u6B64\u9879\u5219\u4E00\u5E76\u53BB\u9664\u3002",
  "setting.confirmTidy.name": "\u6574\u7406\u524D\u786E\u8BA4",
  "setting.confirmTidy.desc": "\u5E94\u7528\u4E4B\u524D\uFF0C\u663E\u793A\u6BCF\u4E2A\u6B65\u9AA4\u4F1A\u66F4\u6539\u591A\u5C11\u884C\u3002",
  "setting.cleanOnPaste.name": "\u7C98\u8D34\u65F6\u6574\u7406",
  "setting.cleanOnPaste.desc": "\u5BF9\u4F60\u7C98\u8D34\u7684\u7EAF\u6587\u672C\u6267\u884C\u4E0A\u9762\u7684\u6B65\u9AA4\u3002\u7EDD\u4E0D\u4F1A\u5728\u4EE3\u7801\u6216 frontmatter \u5185\u6267\u884C\uFF0C\u5E26\u683C\u5F0F\u7684\u7C98\u8D34\u4EA4\u7ED9 Obsidian \u5904\u7406\u3002\u9ED8\u8BA4\u5173\u95ED\u3002",
  "setting.keepImageAltText.name": "\u4FDD\u7559\u56FE\u7247\u66FF\u4EE3\u6587\u672C",
  "setting.keepImageAltText.desc": "\u5C06\u56FE\u7247\u8F6C\u4E3A\u7EAF\u6587\u672C\u65F6\u4FDD\u7559\u5176\u63CF\u8FF0\uFF0C\u800C\u4E0D\u662F\u6574\u4E2A\u79FB\u9664\u56FE\u7247\u3002",
  // Settings: saved replacements
  "replacements.name": "\u4F60\u7684\u67E5\u627E\u66FF\u6362\u547D\u4EE4",
  "replacements.desc": "\u6BCF\u6761\u66FF\u6362\u90FD\u4F1A\u6210\u4E3A\u4E00\u4E2A\u547D\u4EE4\u201C\u66FF\u6362\uFF1A<\u540D\u79F0>\u201D\uFF0C\u4F60\u53EF\u4EE5\u4E3A\u5B83\u8BBE\u7F6E\u5FEB\u6377\u952E\uFF0C\u5B83\u4E5F\u4F1A\u51FA\u73B0\u5728\u201C\u8FD0\u884C\u5DF2\u4FDD\u5B58\u7684\u66FF\u6362\u2026\u201D\u4E2D\u3002\u5B83\u4F5C\u7528\u4E8E\u6240\u9009\u5185\u5BB9\uFF0C\u6CA1\u6709\u9009\u4E2D\u5185\u5BB9\u65F6\u4F5C\u7528\u4E8E\u6574\u7BC7\u7B14\u8BB0\uFF0C\u5E76\u4E14\u7EDD\u4E0D\u4F1A\u6539\u52A8\u4EE3\u7801\u6216 frontmatter\u3002",
  "replacements.nameField": "\u540D\u79F0",
  "replacements.nameDesc": "\u547D\u4EE4\u540D\u4E3A\u201C\u66FF\u6362\uFF1A<\u540D\u79F0>\u201D\u3002\u6CA1\u6709\u540D\u79F0\u5C31\u6CA1\u6709\u547D\u4EE4\u3002",
  "replacements.namePlaceholder": "\u4FEE\u590D\u7834\u6298\u53F7",
  "replacements.delete": "\u5220\u9664\u6B64\u66FF\u6362",
  "replacements.find": "\u67E5\u627E",
  "replacements.replaceWith": "\u66FF\u6362\u4E3A",
  "replacements.replaceWithDesc": "\u7559\u7A7A\u5219\u5220\u9664\u5339\u914D\u9879\u3002\u5F00\u542F\u6B63\u5219\u8868\u8FBE\u5F0F\u65F6\uFF0C$1 \u8868\u793A\u7B2C\u4E00\u4E2A\u5206\u7EC4\uFF0C\\n \u8868\u793A\u6362\u884C\u3002",
  "replacements.regex": "\u6B63\u5219\u8868\u8FBE\u5F0F",
  "replacements.matchCase": "\u533A\u5206\u5927\u5C0F\u5199",
  "replacements.add": "\u6DFB\u52A0\u66FF\u6362"
};
var zh_default = zh;

// src/i18n.ts
var LOCALES = ["en", "zh", "ja", "ko", "es", "de", "fr", "pt-BR", "ru"];
var CATALOGS = { en: en_default, zh: zh_default, ja: ja_default, ko: ko_default, es: es_default, de: de_default, fr: fr_default, "pt-BR": pt_BR_default, ru: ru_default };
function resolveLocale(code) {
  var _a;
  const wanted = code == null ? void 0 : code.trim().toLowerCase();
  return (_a = LOCALES.find((l) => l.toLowerCase() === wanted)) != null ? _a : null;
}
var LANGUAGE_KEY = "language";
function detectLocale(getLanguage) {
  var _a;
  try {
    const code = getLanguage ? getLanguage() : typeof window === "undefined" ? null : window.localStorage.getItem(LANGUAGE_KEY);
    return (_a = resolveLocale(code)) != null ? _a : "en";
  } catch (e) {
    return "en";
  }
}
var current = detectLocale();
function format(text, vars) {
  if (!vars)
    return text;
  return text.replace(/\{(\w+)\}/g, (whole, name) => name in vars ? String(vars[name]) : whole);
}
function t(key, ...args) {
  const vars = args[0];
  return format(CATALOGS[current][key] || en_default[key], vars);
}

// src/replace.ts
function compile(source, flags) {
  try {
    return new RegExp(source, flags + "u");
  } catch (e) {
    return new RegExp(source, flags);
  }
}
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildPattern(r) {
  if (r.find === "")
    return t("error.findEmpty");
  const flags = r.matchCase ? "g" : "gi";
  try {
    return compile(r.regex ? r.find : escapeRegExp(r.find), flags);
  } catch (error) {
    const reason = error instanceof Error ? error.message.replace(/^Invalid regular expression:\s*/, "") : "invalid";
    return t("error.invalidRegex", { reason });
  }
}
function replacementError(r) {
  const pattern = buildPattern(r);
  return typeof pattern === "string" ? pattern : null;
}
function expand(template, match, groups) {
  var _a, _b, _c;
  let out = "";
  for (let i = 0; i < template.length; i++) {
    const ch = template[i];
    if (ch === "\\" && i + 1 < template.length) {
      const next = template[i + 1];
      if (next === "n") {
        out += "\n";
        i++;
        continue;
      }
      if (next === "t") {
        out += "	";
        i++;
        continue;
      }
      if (next === "\\") {
        out += "\\";
        i++;
        continue;
      }
    }
    if (ch === "$" && i + 1 < template.length) {
      const next = template[i + 1];
      if (next === "$") {
        out += "$";
        i++;
        continue;
      }
      if (next === "&") {
        out += match[0];
        i++;
        continue;
      }
      const digits = /^\d{1,2}/.exec(template.slice(i + 1));
      if (digits) {
        const two = Number(digits[0]);
        const one = Number(digits[0][0]);
        if (digits[0].length === 2 && two >= 1 && two < match.length) {
          out += (_a = match[two]) != null ? _a : "";
          i += 2;
          continue;
        }
        if (one >= 1 && one < match.length) {
          out += (_b = match[one]) != null ? _b : "";
          i += 1;
          continue;
        }
      }
      const named = /^<([^>]+)>/.exec(template.slice(i + 1));
      if (named && groups !== void 0 && named[1] in groups) {
        out += (_c = groups[named[1]]) != null ? _c : "";
        i += named[0].length;
        continue;
      }
    }
    out += ch;
  }
  return out;
}
function runReplacement(text, r) {
  const pattern = buildPattern(r);
  if (typeof pattern === "string")
    return { text, count: 0, error: pattern };
  let count = 0;
  const result = eachProseSegment(text, (segment) => segment.replace(pattern, (...args) => {
    const last = args[args.length - 1];
    const hasGroups = typeof last === "object" && last !== null;
    const captures = args.slice(0, hasGroups ? -3 : -2);
    const groups = hasGroups ? last : void 0;
    const replacement = r.regex ? expand(r.replace, captures, groups) : r.replace;
    if (replacement !== captures[0])
      count++;
    return replacement;
  }));
  return { text: result, count };
}
function normalizeReplacements(stored) {
  if (!Array.isArray(stored))
    return [];
  const seen = /* @__PURE__ */ new Set();
  const list = [];
  for (const item of stored) {
    if (typeof item !== "object" || item === null)
      continue;
    const raw = item;
    if (typeof raw.id !== "string" || raw.id === "" || seen.has(raw.id))
      continue;
    seen.add(raw.id);
    list.push({
      id: raw.id,
      name: typeof raw.name === "string" ? raw.name : "",
      find: typeof raw.find === "string" ? raw.find : "",
      replace: typeof raw.replace === "string" ? raw.replace : "",
      regex: raw.regex === true,
      matchCase: raw.matchCase === true
    });
  }
  return list;
}
function newReplacementId(existing, random = Math.random) {
  const used = new Set(existing.map((r) => r.id));
  const size = 36 ** 6;
  let n = Math.floor(random() * size) % size;
  while (used.has(n.toString(36).padStart(6, "0")))
    n = (n + 1) % size;
  return n.toString(36).padStart(6, "0");
}
function replacementCommandName(r) {
  return t("command.replace", { name: r.name.trim() });
}

// src/tidy.ts
var TIDY_STEPS = ["invisibles", "ligatures", "join", "spaces", "trailing", "blank"];
var TIDY_STEP_LABELS = {
  invisibles: t("tidy.invisibles"),
  ligatures: t("tidy.ligatures"),
  join: t("tidy.join"),
  spaces: t("tidy.spaces"),
  trailing: t("tidy.trailing"),
  blank: t("tidy.blank")
};
var DELIMITER_ROW = /^[ \t]*\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;
var HEADING = /^[ \t]*#{1,6}[ \t]/;
function tableLines(lines) {
  const mask = lines.map((line) => line.trimStart().startsWith("|"));
  lines.forEach((line, i) => {
    if (i === 0 || !line.includes("|") || !DELIMITER_ROW.test(line) || !lines[i - 1].includes("|"))
      return;
    mask[i - 1] = true;
    mask[i] = true;
    for (let j = i + 1; j < lines.length && lines[j].includes("|") && lines[j].trim() !== ""; j++)
      mask[j] = true;
  });
  return mask;
}
function codeLines(lines) {
  const inBlock = blockTracker();
  return lines.map((line) => inBlock(line));
}
function removeTrailingWhitespace(text, options = {}) {
  const keep = options.keepHardBreaks !== false;
  const lines = text.split("\n");
  const code = codeLines(lines);
  return lines.map((line, i) => {
    if (code[i])
      return line;
    const trimmed = line.replace(/[ \t]+$/, "");
    const next = lines[i + 1];
    const isBreak = keep && / {2,}$/.test(line) && trimmed.trim() !== "" && !HEADING.test(line) && next !== void 0 && next.trim() !== "";
    return isBreak ? `${trimmed}  ` : trimmed;
  }).join("\n");
}
var PREFIX = /^[ \t]*(?:>[ \t]*)*(?:(?:[-*+]|\d+[.)])[ \t]+(?:\[[^\]\n]\][ \t]+)?)?/;
var LIST_ITEM = /^[ \t]*(?:>[ \t]*)*(?:[-*+]|\d+[.)])[ \t]/;
var INLINE_PROTECTED = /(`+[^`]*`+|\[\[[^\]\n]*\]\]|\$[^$\n]+\$)/;
function indentWidth(line) {
  var _a, _b;
  return ((_b = (_a = /^[ \t]*/.exec(line)) == null ? void 0 : _a[0]) != null ? _b : "").replace(/\t/g, "    ").length;
}
function collapseMultipleSpaces(text) {
  const lines = text.split("\n");
  const code = codeLines(lines);
  const table = tableLines(lines);
  let inList = false;
  let afterIndentedCode = false;
  return lines.map((line, i) => {
    var _a, _b, _c, _d;
    if (code[i]) {
      afterIndentedCode = false;
      return line;
    }
    const blank = line.trim() === "";
    const isItem = LIST_ITEM.test(line);
    const indented = !blank && !isItem && !inList && indentWidth(line) >= 4 && (i === 0 || lines[i - 1].trim() === "" || afterIndentedCode);
    if (isItem)
      inList = true;
    else if (!blank && indentWidth(line) === 0)
      inList = false;
    afterIndentedCode = indented;
    if (blank || table[i] || indented)
      return line;
    const prefix = (_b = (_a = PREFIX.exec(line)) == null ? void 0 : _a[0]) != null ? _b : "";
    const rest = line.slice(prefix.length);
    const trailing = (_d = (_c = /[ \t]*$/.exec(rest)) == null ? void 0 : _c[0]) != null ? _d : "";
    const middle = rest.slice(0, rest.length - trailing.length);
    const collapsed = middle.split(INLINE_PROTECTED).map((part, k) => k % 2 === 1 ? part : part.replace(/ {2,}/g, " ")).join("");
    return prefix + collapsed + trailing;
  }).join("\n");
}
function countChangedLines(before, after) {
  if (before === after)
    return 0;
  const a = before.split("\n");
  const b = after.split("\n");
  if (a.length !== b.length)
    return Math.abs(a.length - b.length);
  return a.reduce((count, line, i) => count + (line === b[i] ? 0 : 1), 0);
}
function tidy(input, options) {
  let text = input.replace(/\r\n?/g, "\n");
  const report = [];
  const wanted = new Set(options.steps);
  const run = (step, fn) => {
    if (!wanted.has(step))
      return;
    const next = fn(text);
    const count = countChangedLines(text, next);
    if (count > 0)
      report.push({ step, count });
    text = next;
  };
  run("invisibles", (t2) => eachProseSegment(t2, removeInvisibles));
  run("ligatures", replaceLigatures);
  const keepHardBreaks = !(wanted.has("trailing") && options.keepHardBreaks === false);
  run("join", (t2) => joinWrappedLines(t2, { removeHyphen: options.removeHyphen, keepHardBreaks }));
  run("spaces", collapseMultipleSpaces);
  run("trailing", (t2) => removeTrailingWhitespace(t2, { keepHardBreaks: options.keepHardBreaks }));
  run("blank", collapseBlankLines);
  return { text, report };
}
function endsInsideCode(before) {
  const lines = before.split("\n");
  const inBlock = blockTracker();
  let inside = false;
  lines.forEach((line, i) => {
    var _a;
    inside = inBlock(line);
    if (i === lines.length - 1 && !inside) {
      const ticks = (_a = line.match(/`+/g)) != null ? _a : [];
      inside = ticks.length % 2 === 1;
    }
  });
  return inside;
}
function wordRangeAt(line, ch) {
  const isWordChar = (c) => c !== void 0 && /[\p{L}\p{N}_]/u.test(c);
  const isJoiner = (c) => c === "'" || c === "\u2019";
  let start = ch;
  let end = ch;
  if (!isWordChar(line[ch]) && !isWordChar(line[ch - 1]))
    return null;
  while (start > 0 && (isWordChar(line[start - 1]) || isJoiner(line[start - 1]) && isWordChar(line[start - 2]) && isWordChar(line[start])))
    start--;
  while (end < line.length && (isWordChar(line[end]) || isJoiner(line[end]) && isWordChar(line[end - 1]) && isWordChar(line[end + 1])))
    end++;
  return start === end ? null : [start, end];
}

// main.ts
var TIDY_KEYS = {
  invisibles: "tidyInvisibles",
  ligatures: "tidyLigatures",
  join: "tidyJoin",
  spaces: "tidySpaces",
  trailing: "tidyTrailing",
  blank: "tidyBlank"
};
var DEFAULT_SETTINGS = {
  locale: "",
  preserveAcronyms: true,
  stopWords: DEFAULT_STOP_WORDS.join(", "),
  removeHyphenOnJoin: true,
  keepImageAltText: true,
  caseTarget: "line",
  tidyInvisibles: true,
  tidyLigatures: true,
  tidyJoin: false,
  tidySpaces: true,
  tidyTrailing: true,
  tidyBlank: true,
  keepHardBreaks: true,
  confirmTidy: true,
  cleanOnPaste: false,
  replacements: []
};
function chosenSteps(settings) {
  return TIDY_STEPS.filter((step) => settings[TIDY_KEYS[step]] === true);
}
var LOCALES2 = {
  "": t("option.systemDefault"),
  tr: t("option.turkish"),
  az: t("option.azerbaijani"),
  lt: t("option.lithuanian")
};
function identifier(id, name, icon, style) {
  return {
    id,
    name,
    icon,
    isCase: true,
    casing: true,
    run: (t2, s) => toIdentifierCase(t2, style, { locale: caseOptions(s).locale })
  };
}
function caseOptions(settings) {
  return {
    locale: settings.locale === "" ? void 0 : settings.locale,
    preserveAcronyms: settings.preserveAcronyms,
    stopWords: settings.stopWords.split(",").map((word) => word.trim()).filter((word) => word.length > 0)
  };
}
var COMMANDS = [
  { id: "upper", icon: "case-upper", name: t("command.upper"), isCase: true, casing: true, run: (t2, s) => toUpperCase(t2, caseOptions(s)) },
  { id: "lower", icon: "case-lower", name: t("command.lower"), isCase: true, casing: true, run: (t2, s) => toLowerCase(t2, caseOptions(s)) },
  { id: "title", icon: "heading", name: t("command.title"), isCase: true, casing: true, run: (t2, s) => toTitleCase(t2, caseOptions(s)) },
  { id: "sentence", icon: "case-sensitive", name: t("command.sentence"), isCase: true, casing: true, run: (t2, s) => toSentenceCase(t2, caseOptions(s)) },
  {
    id: "capitalize-words",
    name: t("command.capitalizeWords"),
    icon: "whole-word",
    isCase: true,
    casing: true,
    run: (t2, s) => capitalizeWords(t2, caseOptions(s))
  },
  {
    id: "capitalize-sentences",
    name: t("command.capitalizeSentences"),
    icon: "pilcrow",
    isCase: true,
    casing: true,
    run: (t2, s) => capitalizeSentences(t2, caseOptions(s))
  },
  { id: "cycle", icon: "repeat", name: t("command.cycle"), casing: true, run: (t2, s) => cycleCase(t2, caseOptions(s)) },
  identifier("camel-case", "camelCase", "code", "camel"),
  identifier("pascal-case", "PascalCase", "braces", "pascal"),
  identifier("snake-case", "snake_case", "underline", "snake"),
  identifier("constant-case", "CONSTANT_CASE", "arrow-big-up", "constant"),
  identifier("kebab-case", "kebab-case", "minus", "kebab"),
  identifier("dot-case", "dot.case", "dot", "dot"),
  identifier("train-case", "Train-Case", "train-front", "train"),
  identifier("pascal-snake-case", "Pascal_Snake_Case", "baseline", "pascal-snake"),
  identifier("path-case", "path/case", "slash", "path"),
  identifier("capital-case", "Capital Case", "type", "capital"),
  identifier("no-case", "no case", "text", "no"),
  identifier("slug", t("command.slug"), "link", "slug"),
  {
    id: "join-lines",
    name: t("command.joinLines"),
    icon: "merge",
    run: (t2, s) => joinWrappedLines(t2, { removeHyphen: s.removeHyphenOnJoin })
  },
  {
    id: "dehyphenate",
    name: t("command.dehyphenate"),
    icon: "spell-check",
    run: (t2) => removeLineHyphenation(t2)
  },
  {
    id: "strip-invisibles",
    name: t("command.stripInvisibles"),
    icon: "eraser",
    run: (t2) => removeInvisibles(t2)
  },
  {
    id: "replace-ligatures",
    name: t("command.replaceLigatures"),
    icon: "case-lower",
    run: (t2) => replaceLigatures(t2)
  },
  {
    id: "straighten-punctuation",
    name: t("command.straightenPunctuation"),
    icon: "remove-formatting",
    run: (t2) => straightenPunctuation(t2)
  },
  {
    id: "remove-trailing-whitespace",
    name: t("command.removeTrailingWhitespace"),
    icon: "space",
    lines: true,
    run: (t2, s) => removeTrailingWhitespace(t2, { keepHardBreaks: s.keepHardBreaks })
  },
  {
    id: "collapse-spaces",
    name: t("command.collapseSpaces"),
    icon: "chevrons-left-right",
    lines: true,
    run: (t2) => collapseMultipleSpaces(t2)
  },
  {
    id: "unlink",
    name: t("command.unlink"),
    icon: "unlink",
    run: (t2, s) => linksToPlainText(t2, { keepImageAltText: s.keepImageAltText })
  },
  {
    id: "sort-lines",
    name: t("command.sortLines"),
    icon: "arrow-down-az",
    lines: true,
    run: (t2, s) => sortLines(t2, "asc", s.locale === "" ? void 0 : s.locale)
  },
  {
    id: "sort-lines-desc",
    name: t("command.sortLinesDesc"),
    icon: "arrow-up-za",
    lines: true,
    run: (t2, s) => sortLines(t2, "desc", s.locale === "" ? void 0 : s.locale)
  },
  { id: "dedupe-lines", name: t("command.dedupeLines"), icon: "copy-minus", lines: true, run: (t2) => removeDuplicateLines(t2) },
  { id: "remove-blank-lines", name: t("command.removeBlankLines"), icon: "fold-vertical", lines: true, run: (t2) => removeBlankLines(t2) },
  {
    id: "collapse-blank-lines",
    name: t("command.collapseBlankLines"),
    icon: "between-horizontal-start",
    lines: true,
    run: (t2) => collapseBlankLines(t2)
  }
];
function isBefore(a, b) {
  return a.line !== b.line ? a.line < b.line : a.ch < b.ch;
}
function isWholeNote(editor, from, to) {
  const last = editor.lastLine();
  return from.line === 0 && from.ch === 0 && to.line === last && to.ch === editor.getLine(last).length;
}
function rangeFor(editor, selection, lines = false, word = false, note = false) {
  const { anchor, head } = selection;
  if (note) {
    if (anchor.line === head.line && anchor.ch === head.ch) {
      const last = editor.lastLine();
      return [{ line: 0, ch: 0 }, { line: last, ch: editor.getLine(last).length }];
    }
    return isBefore(anchor, head) ? [anchor, head] : [head, anchor];
  }
  if (lines) {
    const empty = anchor.line === head.line && anchor.ch === head.ch;
    if (empty) {
      const last = editor.lastLine();
      return [{ line: 0, ch: 0 }, { line: last, ch: editor.getLine(last).length }];
    }
    const [from, to] = isBefore(anchor, head) ? [anchor, head] : [head, anchor];
    const lastLine = to.ch === 0 && to.line > from.line ? to.line - 1 : to.line;
    return [{ line: from.line, ch: 0 }, { line: lastLine, ch: editor.getLine(lastLine).length }];
  }
  if (anchor.line !== head.line || anchor.ch !== head.ch) {
    return isBefore(anchor, head) ? [anchor, head] : [head, anchor];
  }
  const line = editor.getLine(anchor.line);
  if (line.trim().length === 0)
    return null;
  if (word) {
    const span = wordRangeAt(line, anchor.ch);
    return span === null ? null : [{ line: anchor.line, ch: span[0] }, { line: anchor.line, ch: span[1] }];
  }
  return [{ line: anchor.line, ch: 0 }, { line: anchor.line, ch: line.length }];
}
var TextFormatPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    /** Set by `plan` when a selection was passed over because it begins or ends inside code. */
    this.skippedInCode = false;
  }
  async onload() {
    await this.loadSettings();
    for (const command of COMMANDS) {
      this.addCommand({
        id: command.id,
        name: command.name,
        icon: command.icon,
        editorCallback: (editor) => this.apply(editor, command)
      });
    }
    this.addCommand({
      id: "tidy-note",
      name: t("command.tidyNote"),
      icon: "sparkles",
      editorCallback: (editor) => this.tidyNote(editor)
    });
    this.registerEvent(this.app.workspace.on("editor-paste", (evt, editor) => this.cleanPaste(evt, editor)));
    this.addCommand({
      id: "pick-case",
      name: t("command.pickCase"),
      icon: "a-large-small",
      editorCallback: (editor) => {
        new CasePicker(this, editor, COMMANDS.filter((command) => command.isCase)).open();
      }
    });
    this.addCommand({
      id: "run-saved-replacement",
      name: t("command.runSavedReplacement"),
      icon: "replace-all",
      editorCallback: (editor) => {
        if (this.settings.replacements.length === 0) {
          new import_obsidian.Notice(t("notice.noSavedReplacements"));
          return;
        }
        new ReplacementPicker(this, editor).open();
      }
    });
    this.syncReplacementCommands();
    this.addSettingTab(new TextFormatSettingTab(this));
  }
  /**
   * Makes the command list match the saved replacements: one "Replace: name"
   * command each, so adding, renaming or deleting one in the settings takes
   * effect at once. A command's id comes from the replacement's own id, so a
   * hotkey survives a rename. Registering an id again replaces its name; a
   * command whose replacement was deleted, or has no name, hides itself
   * (the check below returns false) rather than being removed, because
   * `removeCommand` needs a newer Obsidian than this plugin supports.
   */
  syncReplacementCommands() {
    for (const replacement of this.settings.replacements) {
      if (replacement.name.trim() === "")
        continue;
      const id = `replace-${replacement.id}`;
      this.addCommand({
        id,
        name: replacementCommandName(replacement),
        icon: "replace",
        editorCheckCallback: (checking, editor) => {
          const current2 = this.settings.replacements.find((r) => r.id === replacement.id);
          if (current2 === void 0 || current2.name.trim() === "")
            return false;
          if (!checking)
            this.runSavedReplacement(editor, current2.id);
          return true;
        }
      });
    }
  }
  /**
   * Runs one saved replacement over the selection, or the whole note, as one
   * transaction. It is looked up by id when it runs, so edits made in the
   * settings apply without re-registering the command.
   */
  runSavedReplacement(editor, id) {
    const replacement = this.settings.replacements.find((r) => r.id === id);
    if (replacement === void 0)
      return;
    const problem = replacementError(replacement);
    if (problem !== null) {
      new import_obsidian.Notice(t("notice.replacementProblem", { name: replacement.name.trim() || t("notice.unnamed"), problem }));
      return;
    }
    let total = 0;
    const command = {
      id: `replace-${id}`,
      name: replacementCommandName(replacement),
      icon: "replace",
      noteWide: true,
      run: (text) => {
        const result = runReplacement(text, replacement);
        total += result.count;
        return result.text;
      }
    };
    const changes = this.plan(editor, command);
    if (changes.length === 0) {
      new import_obsidian.Notice(this.skippedInCode ? t("notice.skippedInCode") : t("notice.noMatches", { name: replacement.name.trim() }));
      return;
    }
    editor.transaction({ changes });
    new import_obsidian.Notice(total === 1 ? t("notice.replacements.one") : t("notice.replacements.other", { count: total }));
  }
  /**
   * Rewrites every selection in one editor transaction.
   *
   * One transaction is one undo step, and every change is a range edit, so
   * the document is never replaced wholesale. Replacing it would throw away
   * the undo history, the folds and the scroll position — the mistake this
   * repository already made once in `snap-markers`.
   */
  apply(editor, command) {
    const changes = this.plan(editor, command);
    if (changes.length === 0) {
      new import_obsidian.Notice(t("notice.nothingToFormat"));
      return;
    }
    editor.transaction({ changes });
  }
  /**
   * Tidy note: the steps chosen in settings, over the selection or the whole
   * note. What each step would change is shown first, and the edit is one
   * transaction, so one undo reverts all of it.
   */
  tidyNote(editor) {
    const totals = /* @__PURE__ */ new Map();
    const command = {
      id: "tidy-note",
      name: t("command.tidyNote"),
      icon: "sparkles",
      lines: true,
      run: (text, settings) => {
        var _a;
        const result = tidy(text, this.tidyOptions(settings));
        for (const { step, count } of result.report)
          totals.set(step, ((_a = totals.get(step)) != null ? _a : 0) + count);
        return result.text;
      }
    };
    if (chosenSteps(this.settings).length === 0) {
      new import_obsidian.Notice(t("notice.noTidySteps"));
      return;
    }
    const changes = this.plan(editor, command);
    if (changes.length === 0) {
      new import_obsidian.Notice(t("notice.nothingToTidy"));
      return;
    }
    const report = TIDY_STEPS.filter((step) => totals.has(step)).map((step) => {
      var _a;
      return { step, count: (_a = totals.get(step)) != null ? _a : 0 };
    });
    const apply = () => editor.transaction({ changes });
    if (this.settings.confirmTidy)
      new TidyModal(this, report, apply).open();
    else
      apply();
  }
  tidyOptions(settings) {
    return {
      steps: chosenSteps(settings),
      keepHardBreaks: settings.keepHardBreaks,
      removeHyphen: settings.removeHyphenOnJoin
    };
  }
  /**
   * Clean on paste, off unless turned on. Only a plain-text paste: anything
   * with HTML or files is left to Obsidian, which converts it itself, and
   * so is anything another handler already took. The clipboard is read, never
   * written, and nothing happens inside code or frontmatter.
   */
  cleanPaste(evt, editor) {
    if (!this.settings.cleanOnPaste || evt.defaultPrevented)
      return;
    const data = evt.clipboardData;
    if (data === null || data.files.length > 0 || data.types.includes("text/html"))
      return;
    const pasted = data.getData("text/plain");
    if (pasted === "")
      return;
    const lineCount = editor.lineCount();
    const bodyStart = frontmatterLineCount((i) => i < lineCount ? editor.getLine(i) : void 0);
    for (const { anchor, head } of editor.listSelections()) {
      const start = isBefore(anchor, head) ? anchor : head;
      if (start.line < bodyStart || endsInsideCode(editor.getRange({ line: 0, ch: 0 }, start)))
        return;
    }
    const result = tidy(pasted, this.tidyOptions(this.settings));
    if (result.text === pasted)
      return;
    evt.preventDefault();
    editor.replaceSelection(result.text);
  }
  endsInCode(editor, from, to) {
    const start = { line: 0, ch: 0 };
    return endsInsideCode(editor.getRange(start, from)) || endsInsideCode(editor.getRange(start, to));
  }
  /** The edits a command would make, without making them. */
  plan(editor, command) {
    const changes = [];
    const seen = /* @__PURE__ */ new Set();
    this.skippedInCode = false;
    const lineCount = editor.lineCount();
    const bodyStart = frontmatterLineCount((i) => i < lineCount ? editor.getLine(i) : void 0);
    for (const selection of editor.listSelections()) {
      const range = rangeFor(editor, selection, command.lines, command.casing === true && this.settings.caseTarget === "word", command.noteWide === true);
      if (range === null)
        continue;
      const [start, to] = range;
      let from = start;
      if (from.line < bodyStart) {
        if (to.line < bodyStart)
          continue;
        from = { line: bodyStart, ch: 0 };
        if (!isBefore(from, to))
          continue;
      }
      const key = `${from.line}:${from.ch}-${to.line}:${to.ch}`;
      if (seen.has(key))
        continue;
      seen.add(key);
      if (command.noteWide === true && !isWholeNote(editor, from, to) && this.endsInCode(editor, from, to)) {
        this.skippedInCode = true;
        continue;
      }
      const original = editor.getRange(from, to);
      const formatted = command.run(original, this.settings);
      if (formatted === original)
        continue;
      changes.push({ from, to, text: formatted });
    }
    return changes;
  }
  async loadSettings() {
    const stored = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...stored };
    this.settings.replacements = normalizeReplacements(stored == null ? void 0 : stored.replacements);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var TidyModal = class extends import_obsidian.Modal {
  constructor(plugin, report, onConfirm) {
    super(plugin.app);
    this.report = report;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    const { contentEl } = this;
    this.setTitle(t("command.tidyNote"));
    const list = contentEl.createEl("ul");
    for (const { step, count } of this.report) {
      list.createEl("li", {
        text: count === 1 ? t("modal.tidy.line.one", { step: TIDY_STEP_LABELS[step] }) : t("modal.tidy.line.other", { step: TIDY_STEP_LABELS[step], count })
      });
    }
    new import_obsidian.Setting(contentEl).addButton((button) => button.setButtonText(t("modal.tidy.confirm")).setCta().onClick(() => {
      this.close();
      this.onConfirm();
    })).addButton((button) => button.setButtonText(t("modal.tidy.cancel")).onClick(() => this.close()));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var PREVIEW_LENGTH = 60;
var CasePicker = class extends import_obsidian.SuggestModal {
  constructor(plugin, editor, commands) {
    super(plugin.app);
    this.plugin = plugin;
    this.editor = editor;
    this.commands = commands;
    this.setPlaceholder(t("modal.pickCase"));
  }
  getSuggestions(query) {
    const wanted = query.toLowerCase().replace(/[\s_.-]+/g, "");
    return this.commands.filter((command) => command.name.toLowerCase().replace(/[\s_.-]+/g, "").includes(wanted));
  }
  renderSuggestion(command, el) {
    el.createDiv({ text: command.name });
    el.createEl("small", { text: this.preview(command), cls: "text-format-preview" });
  }
  onChooseSuggestion(command) {
    this.plugin.apply(this.editor, command);
  }
  preview(command) {
    var _a;
    const change = this.plugin.plan(this.editor, command)[0];
    if (change === void 0)
      return t("modal.noChange");
    const text = (_a = change.text.split("\n").find((line) => line.trim().length > 0)) != null ? _a : change.text;
    const chars = Array.from(text.trim());
    return chars.length > PREVIEW_LENGTH ? chars.slice(0, PREVIEW_LENGTH).join("") + "\u2026" : chars.join("");
  }
};
var ReplacementPicker = class extends import_obsidian.SuggestModal {
  constructor(plugin, editor) {
    super(plugin.app);
    this.plugin = plugin;
    this.editor = editor;
    this.setPlaceholder(t("modal.pickReplacement"));
  }
  getSuggestions(query) {
    const wanted = query.toLowerCase().trim();
    return this.plugin.settings.replacements.filter((r) => `${r.name} ${r.find}`.toLowerCase().includes(wanted));
  }
  renderSuggestion(replacement, el) {
    el.createDiv({ text: replacement.name.trim() === "" ? t("modal.noName") : replacement.name });
    el.createEl("small", {
      text: `${replacement.find} \u2192 ${replacement.replace}`,
      cls: "text-format-preview"
    });
  }
  onChooseSuggestion(replacement) {
    this.plugin.runSavedReplacement(this.editor, replacement.id);
  }
};
var SETTING_TEXT = {
  locale: { name: t("setting.locale.name"), desc: t("setting.locale.desc") },
  preserveAcronyms: { name: t("setting.preserveAcronyms.name"), desc: t("setting.preserveAcronyms.desc") },
  stopWords: { name: t("setting.stopWords.name"), desc: t("setting.stopWords.desc") },
  removeHyphenOnJoin: { name: t("setting.removeHyphenOnJoin.name"), desc: t("setting.removeHyphenOnJoin.desc") },
  caseTarget: { name: t("setting.caseTarget.name"), desc: t("setting.caseTarget.desc") },
  tidyInvisibles: { name: t("setting.tidyInvisibles.name"), desc: t("setting.tidyInvisibles.desc") },
  tidyLigatures: { name: t("setting.tidyLigatures.name"), desc: t("setting.tidyLigatures.desc") },
  tidyJoin: { name: t("setting.tidyJoin.name"), desc: t("setting.tidyJoin.desc") },
  tidySpaces: { name: t("setting.tidySpaces.name"), desc: t("setting.tidySpaces.desc") },
  tidyTrailing: { name: t("setting.tidyTrailing.name"), desc: t("setting.tidyTrailing.desc") },
  tidyBlank: { name: t("setting.tidyBlank.name"), desc: t("setting.tidyBlank.desc") },
  keepHardBreaks: { name: t("setting.keepHardBreaks.name"), desc: t("setting.keepHardBreaks.desc") },
  confirmTidy: { name: t("setting.confirmTidy.name"), desc: t("setting.confirmTidy.desc") },
  cleanOnPaste: { name: t("setting.cleanOnPaste.name"), desc: t("setting.cleanOnPaste.desc") },
  keepImageAltText: { name: t("setting.keepImageAltText.name"), desc: t("setting.keepImageAltText.desc") }
};
var TIDY_TOGGLES = [
  "tidyInvisibles",
  "tidyLigatures",
  "tidyJoin",
  "tidySpaces",
  "tidyTrailing",
  "tidyBlank",
  "keepHardBreaks",
  "confirmTidy",
  "cleanOnPaste"
];
var REPLACEMENTS_DESC = t("replacements.desc");
var TextFormatSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  /**
   * The settings, described rather than drawn.
   *
   * Obsidian 1.13 and later renders this itself and, the reason for writing
   * it, indexes it so the settings turn up in the settings search. Older
   * versions know nothing about this method and fall back to `display()`.
   */
  getSettingDefinitions() {
    return [
      {
        type: "group",
        heading: t("heading.case"),
        items: [
          {
            ...SETTING_TEXT.locale,
            control: {
              type: "dropdown",
              key: "locale",
              options: LOCALES2,
              defaultValue: DEFAULT_SETTINGS.locale
            }
          },
          {
            ...SETTING_TEXT.preserveAcronyms,
            control: {
              type: "toggle",
              key: "preserveAcronyms",
              defaultValue: DEFAULT_SETTINGS.preserveAcronyms
            }
          },
          {
            ...SETTING_TEXT.caseTarget,
            control: {
              type: "dropdown",
              key: "caseTarget",
              options: { line: t("option.wholeLine"), word: t("option.wordAtCaret") },
              defaultValue: DEFAULT_SETTINGS.caseTarget
            }
          },
          {
            ...SETTING_TEXT.stopWords,
            control: {
              type: "textarea",
              key: "stopWords",
              placeholder: DEFAULT_STOP_WORDS.join(", "),
              // The list is a sentence's worth of text, not one word.
              rows: 4,
              defaultValue: DEFAULT_SETTINGS.stopWords
            }
          }
        ]
      },
      {
        type: "group",
        heading: t("heading.cleanup"),
        items: [
          {
            ...SETTING_TEXT.removeHyphenOnJoin,
            control: {
              type: "toggle",
              key: "removeHyphenOnJoin",
              defaultValue: DEFAULT_SETTINGS.removeHyphenOnJoin
            }
          },
          {
            ...SETTING_TEXT.keepImageAltText,
            control: {
              type: "toggle",
              key: "keepImageAltText",
              defaultValue: DEFAULT_SETTINGS.keepImageAltText
            }
          }
        ]
      },
      {
        type: "group",
        heading: t("heading.tidy"),
        items: TIDY_TOGGLES.map((key) => ({
          ...SETTING_TEXT[key],
          control: { type: "toggle", key, defaultValue: DEFAULT_SETTINGS[key] }
        }))
      },
      {
        type: "group",
        heading: t("heading.replacements"),
        items: [
          {
            name: t("replacements.name"),
            desc: REPLACEMENTS_DESC,
            aliases: ["find", "replace", "regex", "regular expression", "substitute"],
            // The editor draws its own rows inside this one.
            render: (setting) => {
              this.renderReplacements(setting.settingEl);
            }
          }
        ]
      }
    ];
  }
  /**
   * Persists a change made through a declarative control.
   *
   * The inherited version writes to `plugin.settings` too, but routing it
   * through `saveSettings()` keeps one path to disk for both renderings.
   */
  async setControlValue(key, value) {
    Object.assign(this.plugin.settings, { [key]: value });
    await this.plugin.saveSettings();
  }
  /**
   * The pre-1.13 rendering. Obsidian skips this entirely once
   * `getSettingDefinitions()` returns anything, so it is dead code on a
   * current app and only runs for users below the 1.13 line.
   */
  display() {
    const { containerEl } = this;
    const settings = this.plugin.settings;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName(t("heading.case")).setHeading();
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.locale.name).setDesc(SETTING_TEXT.locale.desc).addDropdown((dropdown) => {
      for (const [value, label] of Object.entries(LOCALES2))
        dropdown.addOption(value, label);
      dropdown.setValue(settings.locale).onChange(async (value) => {
        settings.locale = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.preserveAcronyms.name).setDesc(SETTING_TEXT.preserveAcronyms.desc).addToggle((toggle) => toggle.setValue(settings.preserveAcronyms).onChange(async (value) => {
      settings.preserveAcronyms = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.caseTarget.name).setDesc(SETTING_TEXT.caseTarget.desc).addDropdown((dropdown) => dropdown.addOption("line", t("option.wholeLine")).addOption("word", t("option.wordAtCaret")).setValue(settings.caseTarget).onChange(async (value) => {
      settings.caseTarget = value === "word" ? "word" : "line";
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.stopWords.name).setDesc(SETTING_TEXT.stopWords.desc).addTextArea((text) => {
      text.inputEl.addClass("text-format-stop-words");
      text.setPlaceholder(DEFAULT_STOP_WORDS.join(", ")).setValue(settings.stopWords).onChange(async (value) => {
        settings.stopWords = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName(t("heading.cleanup")).setHeading();
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.removeHyphenOnJoin.name).setDesc(SETTING_TEXT.removeHyphenOnJoin.desc).addToggle((toggle) => toggle.setValue(settings.removeHyphenOnJoin).onChange(async (value) => {
      settings.removeHyphenOnJoin = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.keepImageAltText.name).setDesc(SETTING_TEXT.keepImageAltText.desc).addToggle((toggle) => toggle.setValue(settings.keepImageAltText).onChange(async (value) => {
      settings.keepImageAltText = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(t("heading.tidy")).setHeading();
    for (const key of TIDY_TOGGLES) {
      new import_obsidian.Setting(containerEl).setName(SETTING_TEXT[key].name).setDesc(SETTING_TEXT[key].desc).addToggle((toggle) => toggle.setValue(settings[key]).onChange(async (value) => {
        settings[key] = value;
        await this.plugin.saveSettings();
      }));
    }
    new import_obsidian.Setting(containerEl).setName(t("heading.replacements")).setHeading();
    this.renderReplacements(containerEl.createDiv());
  }
  /**
   * The list editor for saved replacements, drawn into `host`. Both the
   * declarative settings and the older `display()` use it, and it redraws
   * itself after adding or deleting a row.
   */
  renderReplacements(host) {
    host.empty();
    host.addClass("text-format-replacements");
    const plugin = this.plugin;
    const redraw = () => this.renderReplacements(host);
    host.createEl("p", { text: REPLACEMENTS_DESC, cls: "setting-item-description" });
    for (const replacement of plugin.settings.replacements) {
      const card = host.createDiv({ cls: "text-format-replacement" });
      const error = card.createDiv({ cls: "text-format-replacement-error" });
      const showError = () => {
        const problem = replacement.find === "" ? null : replacementError(replacement);
        error.setText(problem != null ? problem : "");
        error.toggleClass("is-hidden", problem === null);
      };
      new import_obsidian.Setting(card).setName(t("replacements.nameField")).setDesc(t("replacements.nameDesc")).addText((text) => text.setPlaceholder(t("replacements.namePlaceholder")).setValue(replacement.name).onChange(async (value) => {
        replacement.name = value;
        await plugin.saveSettings();
        plugin.syncReplacementCommands();
      })).addExtraButton((button) => button.setIcon("trash-2").then((b) => b.extraSettingsEl.setAttribute("aria-label", t("replacements.delete"))).onClick(async () => {
        plugin.settings.replacements = plugin.settings.replacements.filter((r) => r.id !== replacement.id);
        await plugin.saveSettings();
        plugin.syncReplacementCommands();
        redraw();
      }));
      new import_obsidian.Setting(card).setName(t("replacements.find")).addText((text) => text.setValue(replacement.find).onChange(async (value) => {
        replacement.find = value;
        await plugin.saveSettings();
        showError();
      }));
      new import_obsidian.Setting(card).setName(t("replacements.replaceWith")).setDesc(t("replacements.replaceWithDesc")).addText((text) => text.setValue(replacement.replace).onChange(async (value) => {
        replacement.replace = value;
        await plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName(t("replacements.regex")).addToggle((toggle) => toggle.setValue(replacement.regex).onChange(async (value) => {
        replacement.regex = value;
        await plugin.saveSettings();
        showError();
      }));
      new import_obsidian.Setting(card).setName(t("replacements.matchCase")).addToggle((toggle) => toggle.setValue(replacement.matchCase).onChange(async (value) => {
        replacement.matchCase = value;
        await plugin.saveSettings();
      }));
      showError();
    }
    new import_obsidian.Setting(host).addButton((button) => button.setButtonText(t("replacements.add")).setCta().onClick(async () => {
      plugin.settings.replacements.push({
        id: newReplacementId(plugin.settings.replacements),
        name: "",
        find: "",
        replace: "",
        regex: false,
        matchCase: false
      });
      await plugin.saveSettings();
      redraw();
    }));
  }
};
