function header(tp) {
  const content = tp.file.content;
  const selection = tp.file.selection();

  // Pega tudo do início da nota até o fim do título "## Note"
  const marker = "## Note";
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return "";
  const header = content.substring(0, markerIndex + marker.length) + "\n\n";

  // Tenta extrair a página do link do Zotero; se não houver, usa "(p. N)"
  let pageNo = "";
  const linkMatch = selection.match(/[?&]page=([^&)\s]+)/);
  const labelMatch = selection.match(/\(p\.\s*([^)]+)\)/);
  if (linkMatch) {
    pageNo = linkMatch[1];
  } else if (labelMatch) {
    pageNo = labelMatch[1].trim();
  }

  return header.replace("page-no::", "page-no:: " + pageNo);
}

module.exports = header;
