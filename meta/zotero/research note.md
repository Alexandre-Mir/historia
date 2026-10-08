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
citekey: {{citekey}}
tags: leitura
---

{{bibliography}}

[online]({{uri}}) [local]({{desktopURI}}){% for attachment in attachments | filterby("path", "endswith", ".pdf") %} [pdf](file://{{attachment.path | replace(" ", "%20")}}){% endfor %}

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

## Connections

{% persist "comment" %}
%% begin comment %%
comment::
%% end comment %%
{% endpersist %}

## Note

{% macro calloutHeader(color) -%}
{%- if color == "#ff6666" or color == "#red" -%}Important
{%- elif color == "#5fb236" or color == "#green" -%}Tip
{%- elif color == "#2ea8e5" or color == "#blue" -%}Note
{%- elif color == "#a28ae5" or color == "#purple" -%}Summary
{%- elif color == "#f19837" or color == "#orange" -%}Warning
{%- else -%}Quote
{%- endif -%}
{%- endmacro %}

{% persist "annotations" %}
%% begin annotations %%
{% set annotations = annotations | filterby("date", "dateafter", lastImportDate) -%}
{% if annotations.length > 0 %}
Imported on {{importDate | format("YYYY-MM-DD h:mm a")}}

{% for annotation in annotations %}
> [!{{calloutHeader(annotation.color) | trim}}]
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]] ([p. {{annotation.pageLabel}}]({{annotation.desktopURI}}))
{%- endif %}
{%- if annotation.annotatedText %}
{{annotation.annotatedText}} ([p. {{annotation.pageLabel}}]({{annotation.desktopURI}}))
{%- endif %}
{%- if annotation.comment %}

> **Nota:** {{annotation.comment}}
{%- endif %}

{% endfor %}
{% endif %}
%% endannotations %%
{% endpersist %}