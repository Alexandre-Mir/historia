# 🧭 Painel de estudo: leitura, revisão e escrita

Atalhos para retomar o ciclo descrito em [[fluxo]]: leitura ativa, revisão de Zettels e avanço dos projetos de escrita.

---

## 📚 Leituras ativas
> Obras marcadas com `#leitura`, ordenadas da menos recentemente retomada para a mais recente.

```dataview
TABLE
  dateformat(file.mtime, "yyyy-MM-dd") AS "Última retomada"
FROM #leitura
SORT file.mtime asc
LIMIT 15
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

## 🔗 Conexões para conferir
> Use a lista como convite à revisão: confira se a síntese está na sua voz e se cada conexão explica o nexo entre as ideias. A contagem de links inclui também a fonte bibliográfica.

```dataview
TABLE
  length(file.inlinks) AS "Notas que apontam para cá",
  dateformat(file.mtime, "yyyy-MM-dd") AS "Última alteração"
FROM "02_zettel"
WHERE length(file.inlinks) = 0
SORT file.mtime asc
```

---

## ✍️ Projetos de escrita incremental
> Escolha um item da [[IW-Queues/IW-Queue|fila de escrita]] e termine cada sessão deixando anotado o próximo passo concreto.

Fila: [[IW-Queues/IW-Queue|abrir a fila de escrita incremental]].
