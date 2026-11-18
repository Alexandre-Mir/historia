#!/usr/bin/env node

/**
 * Executor de testes de conformidade formal para o dataset de 10 notas rotuladas.
 * Valida aspectos determinísticos e reporta desvios em relação ao dataset-supervisor.json.
 */

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const datasetPath = path.join(__dirname, "dataset-supervisor.json");

if (!fs.existsSync(datasetPath)) {
  console.error("Dataset não encontrado:", datasetPath);
  process.exit(1);
}

const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
console.log(`\n=== Suíte de Regressão Metodológica (${dataset.casos.length} casos) ===\n`);

let passed = 0;
let issuesCount = 0;

for (const caso of dataset.casos) {
  const filePath = path.join(root, caso.arquivo);
  if (!fs.existsSync(filePath)) {
    console.error(`[FALHA] Arquivo ausente: ${caso.arquivo}`);
    issuesCount++;
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const formalIssues = [];

  // 1. Checagem de frontmatter
  if (!/^---\s*\n[\s\S]*?\n---\s*\n/.test(content)) {
    formalIssues.push("Frontmatter YAML ausente");
  } else {
    if (!/^type:\s*zettel\b/m.test(content)) formalIssues.push("type: zettel ausente");
    if (!/tags:\s*\n(\s+-\s*zettel\b)/m.test(content) && !/tags:.*?\bzettel\b/m.test(content)) {
      formalIssues.push("tag #zettel ausente");
    }
  }

  // 2. Checagem de Fonte
  const sourceMatch = content.match(/^\*\*Fonte:\*\*\s*\[\[([^\]]+)\]\]/m);
  if (!sourceMatch) {
    formalIssues.push("Linha de Fonte ausente");
  } else {
    const sourceTarget = sourceMatch[1].trim();
    const sourcePath = path.join(root, "01_notes", `${sourceTarget}.md`);
    if (!fs.existsSync(sourcePath)) {
      formalIssues.push(`Fonte não resolve em 01_notes/: [[${sourceTarget}]]`);
    }
  }

  // 3. Checagem de Seção de Síntese
  const synthesisMatch = content.match(/### Síntese\s*([\s\S]*?)(?:> \[!important\]|### Conexões|---)/);
  const synthesisText = synthesisMatch ? synthesisMatch[1].replace(/<!--[\s\S]*?-->/g, "").trim() : "";
  if (!synthesisText) {
    formalIssues.push("### Síntese vazia");
  }

  // 4. Checagem de Citação
  if (!content.includes("> [!important]")) {
    formalIssues.push("Citação > [!important] ausente");
  }

  // 5. Checagem de Conexões
  const hasInlineNexus = /(?:condiciona|tensiona|fundamenta|exemplifica)::\s*\[\[[^\]]+\]\]/.test(content);
  const hasPlaceholder = /<!--[^>]*(?:Explique|nexo|conex)[^>]*-->/i.test(content);

  const statusFormal = formalIssues.length === 0 ? "Conforme" : "Não Conforme";
  const statusMatches = statusFormal === caso.conformidade_formal_esperada;

  if (statusMatches) passed++;
  else issuesCount++;

  console.log(`[${statusMatches ? "OK" : "DIVERGÊNCIA"}] ${caso.id} (${caso.categoria})`);
  console.log(`  Arquivo: ${path.basename(caso.arquivo)}`);
  console.log(`  Formal: ${statusFormal} (Esperado: ${caso.conformidade_formal_esperada})`);
  if (formalIssues.length) console.log(`  Pendências formais: ${formalIssues.join("; ")}`);
  console.log(`  Nexos inline: ${hasInlineNexus ? "Sim" : "Não"} | Placeholder aberto: ${hasPlaceholder ? "Sim" : "Não"}`);
  console.log(`  Veredito Conceitual Esperado: ${caso.veredito_conceitual_esperado}\n`);
}

console.log(`Resultado: ${passed}/${dataset.casos.length} conformidades formais conferidas com o gabarito.`);
process.exit(issuesCount > 0 && passed === 0 ? 1 : 0);
