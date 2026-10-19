---
cssclass: research-note
type: "{{itemType}}"
{%- for type, creators in creators | groupby("creatorType") %}
{%- set key = type | replace("interviewee", "author") | replace("director", "author") | replace("presenter", "author") | replace("podcaster", "author") | replace("programmer", "author") | replace("cartographer", "author") | replace("inventor", "author") | replace("sponsor", "author") | replace("performer", "author") | replace("artist", "author") %}
{{key}}:
{%- for creator in creators %}
  - "{% if creator.name %}{{creator.name | replace('"', "'")}}{% else %}{{creator.lastName | replace('"', "'")}}, {{creator.firstName | replace('"', "'")}}{% endif %}"
{%- endfor %}
{%- endfor %}
{%- if title %}
title: "{{title | replace('"', "'")}}"
{%- endif %}
{%- if publicationTitle %}
publication: "{{publicationTitle | replace('"', "'")}}"
{%- endif %}
{%- if date %}
date: {{date | format("YYYY-MM-DD")}}
{%- endif %}
{%- if archive %}
archive: "{{archive | replace('"', "'")}}"
{%- endif %}
{%- if archiveLocation %}
archive-location: "{{archiveLocation | replace('"', "'")}}"
{%- endif %}
{%- if doi %}
doi: "{{doi}}"
{%- endif %}
{%- if url %}
url: "{{url}}"
{%- endif %}
citekey: {{citekey}}
---

{% macro calloutType(color, colorCategory) -%}
{%- set c = (colorCategory or "") | lower -%}
{%- set hex = (color or "") | lower -%}
{%- if c == "red" or hex == "#ff6666" or hex == "#red" -%}
important
{%- elif c == "green" or hex == "#5fb236" or hex == "#green" -%}
tip
{%- elif c == "blue" or hex == "#2ea8e5" or hex == "#blue" -%}
info
{%- elif c == "purple" or hex == "#a28ae5" or hex == "#purple" -%}
summary
{%- elif c == "orange" or hex == "#f19837" or hex == "#orange" -%}
warning
{%- elif c == "yellow" or hex == "#ffd400" or hex == "#yellow" -%}
quote
{%- elif c == "magenta" or hex == "#e56eee" -%}
quote
{%- elif c == "gray" or hex == "#aaaaaa" -%}
note
{%- else -%}
quote
{%- endif -%}
{%- endmacro %}

{{bibliography}}

🔗 **Acesso:** [Zotero Desktop]({{desktopURI}}) · [Zotero URI]({{uri}}){% if url %} · [Página da publicação]({{url}}){% endif %}{% for attachment in attachments | filterby("path", "endswith", ".pdf") %}{% if attachment.pdfURI %} · [Abrir PDF no Zotero]({{attachment.pdfURI}}){% endif %} · [PDF local](file://{{attachment.path | replace(" ", "%20")}}){% endfor %}

{%- if abstractNote %}

> [!abstract]- Resumo da Obra (Abstract)
> {{abstractNote}}
{%- endif %}

{% if tags.length > 0 -%}
{%- for t in tags -%}
{%- if t.tag == "secondary" -%}#source/secondary
{%- elif t.tag == "primary" -%}#source/primary
{%- elif "-project" in t.tag -%}#project/{{t.tag | lower | replace(" ", "-") | replace("-project", "")}}
{%- else -%}#subject/{{t.tag | lower | replace(" ", "-")}}
{%- endif %}{% if not loop.last %} {% endif %}
{%- endfor %}
{%- endif %}

## Index

start-date:: {% if dateAdded %}{{dateAdded | format("YYYY-MM-DD")}}{% else %}{{importDate | format("YYYY-MM-DD")}}{% endif %}
end-date::
page-no:: {% for annotation in annotations %}{% if loop.last %}{{annotation.pageLabel}}{% endif %}{% endfor %}
reading-position::
next-reading-step::

```dataviewjs
const page = dv.current();
const position = page["reading-position"] || page["page-no"];
const nextStep = page["next-reading-step"];

dv.header(3, "Retomada da leitura");
dv.paragraph(`**Último ponto registrado:** ${position || "ainda não registrado"}`);
dv.paragraph(`**Próximo passo:** ${nextStep || "registre um passo curto em next-reading-step:: ao encerrar a sessão"}`);
```

## Connections

{% persist "connections" %}
{%- if not _retained.connections -%}
- 
{%- endif -%}
{% endpersist %}

{% persist "comment" %}
{%- if not _retained.comment -%}
comment::
{%- endif -%}
{% endpersist %}

## Note

{% persist "annotations" %}
{%- set newAnnotations = annotations | filterby("date", "dateafter", lastImportDate) -%}
{%- if newAnnotations.length > 0 %}
### 📅 Importado em {{importDate | format("YYYY-MM-DD HH:mm")}}

{% for annotation in newAnnotations %}
{%- if annotation.imageRelativePath %}
> [!{{calloutType(annotation.color, annotation.colorCategory)}}] Imagem (p. {{annotation.pageLabel}})
> ![[{{annotation.imageRelativePath}}]]
> [Ver no Zotero (p. {{annotation.pageLabel}})]({{annotation.desktopURI}})
{%- if annotation.comment %}
> 
> 💡 **Comentário:** {{annotation.comment}}
{%- endif %}
{%- if annotation.tags and annotation.tags.length > 0 %}
> 
> {%- for tag in annotation.tags %} #{{tag.tag | replace(" ", "-")}} {%- endfor %}
{%- endif %}

{% elif annotation.annotatedText %}
> [!{{calloutType(annotation.color, annotation.colorCategory)}}]
> {{annotation.annotatedText}} ([p. {{annotation.pageLabel}}]({{annotation.desktopURI}}))
{%- if annotation.comment %}
> 
> 💡 **Comentário:** {{annotation.comment}}
{%- endif %}
{%- if annotation.tags and annotation.tags.length > 0 %}
> 
> {%- for tag in annotation.tags %} #{{tag.tag | replace(" ", "-")}} {%- endfor %}
{%- endif %}

{% elif annotation.comment %}
> [!note] Comentário (p. {{annotation.pageLabel}})
> 💡 {{annotation.comment}} ([p. {{annotation.pageLabel}}]({{annotation.desktopURI}}))
{%- if annotation.tags and annotation.tags.length > 0 %}
> 
> {%- for tag in annotation.tags %} #{{tag.tag | replace(" ", "-")}} {%- endfor %}
{%- endif %}

{% endif %}
{% endfor %}
{%- endif %}
{% endpersist %}

---

## 💎 Zettels Atômicos Derivados

```dataview
TABLE file.cday AS "Criado em", tags AS "Tags"
FROM "02_zettel"
WHERE contains(Fonte, this.file.link) OR contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
SORT file.cday desc
```
