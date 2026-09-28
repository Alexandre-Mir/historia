# 🧠 Dashboard: Incremental Reading & Spaced Repetition

---

## 📚 1. Fila de Leitura Incremental (Leituras Ativas)
> Notas marcadas com `#leitura` ou localizadas em `01_notes`. Mostra as últimas notas modificadas para retomar o fluxo.

```dataview
TABLE 
  title AS "Título",
  dateformat(file.mtime, "D - HH:mm") AS "Última Interação"
FROM #leitura
SORT file.mtime asc
LIMIT 15
```

---

## 🔁 2. Revisões Espaçadas de Notas (SuperMemo / SM-2)
> Notas atômicas com a tag `#zettel` ou `#review` ordenadas pela data de vencimento (`sr-due`).

```dataview
TABLE 
  sr-due AS "Vencimento SRS",
  sr-interval AS "Intervalo (dias)",
  sr-ease AS "Ease Factor",
  Fonte AS "Obra de Origem"
FROM #zettel OR #review
SORT sr-due asc
LIMIT 20
```

---

## ⚡ 3. Zettels Recentes e Conexões Pendentes
> Notas atômicas criadas recentemente em `02_zettel`. Verifique se precisam de mais links bidirecionais (outlinks).

```dataview
TABLE 
  length(file.outlinks) AS "Links de Saída",
  length(file.inlinks) AS "Backlinks",
  file.cday AS "Criado em"
FROM "02_zettel"
SORT file.ctime desc
LIMIT 15
```

---

## 💡 4. Ideias Órfãs (Notas sem Conexões)
> Notas conceituais em `02_zettel` com poucos ou nenhum link. Ótimas candidatas para Incremental Writing e conexão com outras ideias.

```dataview
TABLE 
  file.cday AS "Criação"
FROM "02_zettel"
WHERE length(file.outlinks) <= 1
SORT file.ctime desc
```
