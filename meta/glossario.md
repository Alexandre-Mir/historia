---
type: doc
tags:
  - meta
  - metodologia
criado: 2026-11-16
atualizado: 2026-11-18
---

# Glossário Metodológico e Tipologia Canônica

Fonte única de definições e limiares para o fluxo de leitura, atomização e síntese no cofre `historia`. Consultada pelo pesquisador e referenciada pelo `AGENTS.md` e pelas skills metodológicas (`zettelkasten-forager`, `zettelkasten-supervisor`, `zettelkasten-cartographer`, `zettelkasten-consultant`).

---

## 0. Fundamentação Científica e Epistemológica (Luhmann / Costa, 2026)

O sistema metodológico deste cofre baseia-se na teoria do *Zettelkasten* de Niklas Luhmann, articulada à sociologia dos sistemas sociais e à teoria da informação, conforme sistematizada por **Antônio Luz Costa (2026)** e pelos pesquisadores do espólio de Bielefeld (**Johannes F. K. Schmidt, 2014, 2016, 2018**):

1. **O Cofre como Parceiro Comunicativo (Kommunikationspartner):**
   O Zettelkasten não é um depósito estático de anotações ("segundo cérebro" como disco rígido), mas um sistema comunicativo dotado de autonomia relativa e autorreferência (Luhmann, 1981; Costa, 2026). O sistema opera por fechamento operacional (sua malha de conexões internas) e abertura cognitiva (sensível às irritações de novas leituras em `01_notes/`). Seu objetivo primordial é a **produção de informação como redução de incerteza e geração de surpresa**, viabilizando a "fabricação de serendipidade" através do encontro entre ideias heterogêneas (Schmidt, 2018).

2. **Metodologia de Leitura Analítica (*Lesen Lernen*):**
   Conforme Luhmann (2002) e Costa (2026, §3), a leitura acadêmica visa superar a aleatoriedade dos textos através do treino de atenção para os *frames* e esquemas de observação do autor. A pergunta central da extração não é *"o que o autor diz?"*, mas **"que distinção o autor opera? O que ele diferencia de quê? O que está implícito, excluído ou não pensado?"**. O Zettel não aceita excertos mecânicos, exigindo sempre uma **reformulação condensada** autoral. O "material descartável" inicial é acolhido como treino evolutivo indispensável.

3. **Arquitetura de Remissões de Schmidt:**
   A conectividade do cofre estrutura-se nos três níveis analíticos identificados no ZKN de Luhmann (Schmidt, 2014):
   - *Remissões Individuais:* Nexos tipados inline e na seção `### Conexões`, conectando Zettels específicos via chaves epistemológicas e justificativas breves.
   - *Remissões Coletivas:* Agrupamentos e cabeças de chave no limiar de constelações temáticas.
   - *Remissões Estruturais:* Maps of Content (MOCs em `00_MOCs/`), estruturando sequências de travessia e tópicos por arestas conceituais.
   - *Índice Seletivo:* A indexação não pretende exaurir ocorrências, mas fornecer portas de entrada (1 a 3 níveis de ramificação) para percursos não lineares.

4. **Fundamentação da Autoria Exclusiva (Critério de Brodbeck):**
   Conforme demonstrado por Brodbeck (2002) e reiterado por Costa (2026, §4), o Zettelkasten não observa, não interpreta e não questiona por si próprio; ele depende ontologicamente da intervenção de um observador corporificado (o pesquisador). A cognição e a autoria são prerrogativas intransferíveis do historiador; os modelos de IA atuam exclusivamente como andaimes dialógicos e auditores estruturais.

5. **Ciclo Evolutivo e Retroalimentação Sistêmica:**
   O fluxo opera pelo tríptico evolutivo: variação (anotações e faíscas) $\to$ seleção (atomização de Zettels com nexos) $\to$ estabilização (MOCs e ensaios). A relação com os ensaios é bidirecional: a redação extrai argumentos do fichário e simultaneamente produz novas questões e teses que devem retroalimentar o cofre em novos Zettels (Schmidt, 2016; Costa, 2026).

---

## 1. Níveis de Titulação (Tese da Nota)

O título de um Zettel é a sua unidade de recuperação sintática e a enunciação da sua tese.

| Nível | Categoria | Descrição | Exemplo (Domínio Alheio) | Aceite por Maturidade |
|:---:|:---|:---|:---|:---|
| **0** | Rótulo / Vago | Menção solta a autor, tema amplo ou capítulo. | *Adam Smith e os mercados* | Apenas provisório no `Alt+Z` |
| **1** | Pergunta | Formulação interrogativa. (Notas guardam respostas, não perguntas abertas). | *Por que a divisão do trabalho aumenta a produção?* | Apenas provisório no `Alt+Z` |
| **2** | Tópico descritivo | Descreve um objeto, processo ou evento sem predicado ativo. | *O papel da divisão do trabalho na manufatura de alfinetes* | Tolerado em `semente` |
| **3** | Proposição declarativa | Frase completa (sujeito, verbo e predicado) afirmando uma tese, conceito ou definição ontológica estável. | *A divisão social do trabalho constitui a estrutura fundamental da diferenciação fabril na manufatura* | **Mínimo para `desenvolvimento`**; aceito em `madura` para teses ontológicas/fundacionais |
| **4** | Tese com dinâmica ativa | Enuncia relação explícita de causalidade, contradição estrutural, assimetria de poder ou tensão dialética. | *A especialização extrema do trabalho fragmenta a percepção do trabalhador sobre o processo produtivo* | Ideal para `desenvolvimento`; recomendado para `madura` |

> [!IMPORTANT] Regra de Transição
> O título provisório (níveis 0–2) é tolerado exclusivamente no estágio `semente`. **A nota não pode ser promovida a `desenvolvimento` sem que o título atinja nível 3 ou 4.** Em `madura`, teses de causalidade ou conflito exigem Nível 4; teses categoriais, morfológicas ou definitórias de base são plenamente aceitas com Nível 3.

---

## 2. Tipologia de Nexos (Chaves Inline Diretas)

As conexões expressam o mecanismo epistemológico da ligação entre ideias.

| Chave Inline | Semântica | Sentido da Relação | Teste de Decisão Operacional |
|:---|:---|:---|:---|
| `condiciona:: [[Nota]]` | Causalidade / Viabilização histórica | Esta nota explica o que causa, viabiliza, direciona ou condiciona a nota de destino. | **Teste factual/histórico:** Se a retirada de A faz o evento ou processo B deixar de ocorrer ou ocorrer de outro modo no tempo/espaço, é `condiciona`. |
| `tensiona:: [[Nota]]` | Contradição / Limite analítico | Esta nota problematiza, contrapõe, refuta ou impõe limites analíticos à tese de destino. | **Teste de atrito/fronteira:** Se A apresenta exceção empírica, restringe o escopo teórico ou contradiz as premissas de B, é `tensiona`. |
| `fundamenta:: [[Nota]]` | Condição de possibilidade teórica | Esta nota estabelece o solo conceitual, categoria ou premissa sem a qual a nota de destino não se sustenta. | **Teste de sustentação teórica:** Se a retirada de A faz a tese de B ruir por perda de validade conceitual lógica, é `fundamenta`. |
| `exemplifica:: [[Nota]]` | Empiria / Materialização | Esta nota traz o caso histórico, documento, vestígio ou evidência concreta que materializa a teoria da nota de destino. | **Teste de materialização:** Se A é o dado empírico, fato histórico ou vestígio documental que encarna a abstração de B, é `exemplifica`. |

### Sintaxe de Aplicação
1. **Seção `### Conexões` (Preferencial):**
   `- nexo:: [[Nome-da-Nota]] — Justificativa autoral sucinta indicando o mecanismo da ponte.`
2. **No fluxo da prosa (`### Síntese`):**
   `A emergência da manufatura [condiciona:: [[Nome-da-Nota]]] ao transformar o regime de trabalho...`

---

## 3. Matriz de Conformidade (Pilar vs. Estágio)

A promoção de maturidade é **atribuição exclusiva do pesquisador**. O Supervisor utiliza esta matriz para validar o estágio declarado.

| Pilar | `semente` | `desenvolvimento` | `madura` |
|:---|:---|:---|:---|
| **Título** | Nível 0–4 (N0–N2 provisório tolerado) | **Obrigatório Nível 3 ou 4** | **Obrigatório Nível 3 ou 4** (N4 para conflito/causa; N3 aceito para teses ontológicas) |
| **Síntese** | 1 frase autoral (faísca) ou reflexão inicial | Paráfrase autônoma completa na voz do pesquisador | Domínio conceitual rigoroso, autônomo e maduro |
| **Citação** | Obrigatória (`> [!important]`) | Obrigatória (como evidência ancorada) | Obrigatória (como evidência ancorada) |
| **Nexos** | Opcional (mínimo ou não tipado aceito) | **Mínimo 1 nexo tipado com justificativa** | **Múltiplos nexos tipados e consistentes** |
| **Uso / Reencontro** | Fase 2 (Extração recém-feita) | Fase 3 (Lapidação de tese e nexos em reencontro) | **Comprovação de uso/mobilização** (revisitada deliberadamente, integrada em MOC ou ensaio) |
| **Elegibilidade para MOC** | Não elegível | **Elegível individualmente** | **Elegível individualmente** |
| **Uso em Ensaio** | Não recomendado | Recomendado | **Ideal (pilar argumentativo mobilizado)** |

### 3.1. Tabela de Vereditos do Supervisor por Estágio

O Supervisor emite dois pareceres independentes:
1. **Estado Formal:** `Conforme` ou `Não Conforme` (presença de metadados, seções obrigatórias e resolução da Fonte). Falhas formais geram avisos para correção no checklist, mas **não** rebaixam sozinhas a nota para `reprovada`.
2. **Veredito Conceitual:** `apta`, `apta com ressalvas` ou `reprovada`, avaliado relativamente ao estágio declarado na propriedade `maturidade`:

| Estágio Declarado | `apta` | `apta com ressalvas` | `reprovada` (Bloqueante Conceitual) |
|:---|:---|:---|:---|
| **`semente`** | Título N3–N4, síntese autoral própria e ao menos 1 nexo inicial. | Título provisório (N0–N2) ou nexo ainda não tipado/em aberto. | Cópia literal da citação sem síntese autoral, ou ausência total de texto do pesquisador. |
| **`desenvolvimento`** | Título N3–N4, síntese em paráfrase completa e ao menos 1 nexo tipado com justificativa coerente. | Síntese sólida e título N3+, mas justificativa do nexo telegráfica ou ambígua. | Título provisório N0–N2; ausência total de nexo tipado; violação de atomicidade (duas teses concorrentes). |
| **`madura`** | Título N3–N4, múltiplos nexos consistentes, domínio rigoroso e registro de uso/revisão. | Requisitos teóricos plenos, mas sem registro evidente de mobilização em MOC/ensaio (recomenda manter em `desenvolvimento`). | Título provisório; nexo único ou incoerente; dependência mecânica da citação. |

---

## 4. Critérios para MOCs (Massa Crítica e Diversidade)

O `zettelkasten-cartographer` opera sob os seguintes limiares de emergência orgânica:

1. **Volume e Faixa:** Mínimo de **10 Zettels elegíveis individualmente** (`desenvolvimento` ou `madura`).
   - *Abaixo de 10:* Aciona imediatamente o **Comportamento de Fallback (Lentes de Leitura)**.
   - *10 a 15 Zettels:* Faixa ideal de coesão para proposição de um MOC completo.
   - *Acima de 15 Zettels:* O Cartographer seleciona as 10 a 14 notas de maior centralidade de intermediação para a espinha dorsal dos movimentos lógicos, trata as excedentes como **Satélites e Desdobramentos de Fronteira**, e avalia se o cluster apresenta duas bacias semânticas distintas, recomendando partição em MOCs irmãos.
2. **Diversidade de Fontes:** Mínimo de 3 obras distintas em `01_notes/`, sendo que nenhuma obra isolada pode representar mais de 50% das notas do cluster.
3. **Diversidade Topológica da Rede:** O cluster como um todo deve mobilizar **pelo menos 3 dos 4 tipos de nexo canônicos** (`fundamenta`, `condiciona`, `tensiona`, `exemplifica`), garantindo uma rede analítica multidimensional (com solo, dinâmica histórica e atrito dialético) e não uma lista temática unidirecional.
4. **Densidade Mínima de Conexão:** Média interna da rede ≥ 1,5 conexões por nota.

---

## 5. Vocabulário Unificado do Cofre

- **Pesquisador:** O autor da pesquisa. Cognição histórica e autoria intelectual exclusivas.
- **Nota de Leitura / Research Note:** Arquivo em `01_notes/` (ficha bibliográfica + destaques do Zotero).
- **Zettel / Nota Atômica:** Arquivo em `02_zettel/` (uma ideia/mecanismo conceitual com tese e nexos).
- **MOC (Map of Content):** Arquivo em `00_MOCs/` (mapa navegável de rotas e travessias conceituais montado por arestas).
- **Ensaio:** Arquivo em `99_ensaios/` (escrita cumulativa e prosa historiográfica contínua).
- **Lente de Leitura:** Pergunta ou tema pendente formulado pelo Cartographer para orientar novas prospecções do Forager.

---

## 6. Contrato de Schema Canônico do Zettel e Marcadores de Fichamento

### Schema do Zettel Atômico (`02_zettel/`)

```yaml
---
created: AAAA-MM-DD HH:mm
type: zettel
maturidade: semente # semente | desenvolvimento | madura
tags:
  - zettel
periodo: # Opcional: recorte temporal da tese (ex: Antiguidade Tardia, Século XIX)
espaco: # Opcional: recorte espacial/geográfico (ex: Mediterrâneo, Brasil Central)
last-reviewed: # Opcional: data do último reencontro/revisão deliberada
review-count: # Opcional: contador de revisões
---
### Síntese
[Paráfrase autoral do pesquisador, formulando a tese com suas próprias palavras]

> [!important] Trecho de origem
> [Citação extraída da obra em 01_notes]

### Conexões
- nexo:: [[Nome-da-Nota]] — Justificativa autoral da ponte.

---
**Fonte:** [[Nome-Exato-da-Nota-em-01_notes]]
```

### Marcadores de Leitura em `01_notes/`

O `zettelkasten-forager` apoia-se nos seguintes marcadores padronizados gerados pelo fluxo Zotero/Templater:

| Marcador | Origem | Função para o Forager |
|:---|:---|:---|
| `> [!important]`, `> [!quote]` | Destaques do leitor no PDF | Camada de evidência textual e autoridade do autor. |
| `>>...`, `comment::` | Marginália do leitor | **Faísca do pesquisador:** dúvidas, atritos conceituais, hipóteses provisórias. |
| `## Connections` / `[[Nota]]` | Anotações de articulação | Camada de rede pré-existente (evita duplicidades e sinaliza pontes). |
| `reading-position::` | Metadado de leitura | Marca o ponto de interrupção da última sessão na obra. |
| `end-date::` | Metadado de leitura | Marca a conclusão definitiva da leitura da obra (Fase 5). |
