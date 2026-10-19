<%*
// 0 = domingo, 1 = segunda ... 6 = sábado
const dia = Number(tp.date.now("d", 0, tp.file.title, "YYYY-MM-DD"));
-%>

## 🌅 Manhã — abertura e foco
- [ ] Preparar o café da manhã #casa
- [ ] Arrumar a cama e cuidar da louça #casa
- [ ] Beber água ao longo do dia (meta: 2 L) #extra
- [ ] Revisar agenda e escolher a prioridade do dia #extra

## 📖 Bloco de estudo — leitura e fichamento
> Siga o ciclo do [[fluxo de estudos]]: retome uma leitura ativa e avance apenas 1–3 blocos/parágrafos.
- [ ] Abrir o campo `next-reading-step::` da nota da obra e retomar dali #estudo
- [ ] Sessão de leitura incremental (1 pomodoro) #estudo
- [ ] Registrar/organizar o avanço na nota de literatura em `01_notes/` #estudo

## 🧠 Bloco de estudo — elaboração
- [ ] Processar um trecho em Zettel: paráfrase própria + ao menos uma conexão #estudo
- [ ] Refinar a síntese ou adicionar conexões ao Zettel trabalhado #estudo

## 🌇 Tarde — movimento e tarefa da casa
- [ ] Preparar o almoço #casa
- [ ] Enviar 3 currículos #trabalho
<%* if (dia === 1) { -%>
- [ ] Treino de força A (peito e ombros), 40 min #exercicio
- [ ] Lavar um tênis #casa
#### Estudo do dia — História Medieval I
<%* } else if (dia === 2) { -%>
- [ ] Caminhada, 30 min #exercicio
- [ ] Tirar pó dos móveis e organizar a sala #casa
- [ ] Organizar uma pasta do computador #extra
#### Estudo do dia — História Contemporânea II
<%* } else if (dia === 3) { -%>
- [ ] Treino de força B (costas e bíceps), 40 min #exercicio
- [ ] Limpar fogão e geladeira #casa
#### Estudo do dia — História Contemporânea II
<%* } else if (dia === 4) { -%>
- [ ] Alongamento e mobilidade, 30 min #exercicio
- [ ] Limpar a caixa de e-mail #extra
- [ ] Trocar lençóis e toalhas #casa
#### Estudo do dia — História Antiga I
<%* } else if (dia === 5) { -%>
- [ ] Treino de força C (pernas), 40 min #exercicio
- [ ] Limpar o banheiro #casa
#### Estudo do dia — Cultura Brasileira
<%* } else if (dia === 6) { -%>
- [ ] Faxina geral (aspirar e passar pano) #casa
- [ ] Caminhar ao ar livre, 45 min #exercicio
- [ ] Lavar e estender a roupa #casa
- [ ] Tirar o lixo #casa
#### Estudo do dia — Prática de Pesquisa Histórica
<%* } else { -%>
- [ ] Caminhada curta, 30 min #exercicio
- [ ] Organizar a mesa #casa
- [ ] Hobby / descanso ativo #extra
- [ ] Projeto financeiro com Cashew #extra
#### Estudo do dia — Teoria da História
<%* } -%>

## ✍️ Noite — fechamento e continuidade
- [ ] Preparar o jantar #casa
- [ ] Atualizar `reading-position::` e `next-reading-step::` na nota da obra #estudo
- [ ] Preparar o estudo do próximo dia (nota/obra e trecho a retomar) #estudo
- [ ] Fazer uma revisão breve da agenda de amanhã #extra

<%* if (dia === 0) { -%>
## 🌱 Projeto semanal — escrita incremental
> Reserve 30–45 min. Trabalhe sempre no mesmo ensaio, artigo ou MOC com tag `#escrita`. Cada sessão deve deixar um avanço reutilizável.
- [ ] Abrir o projeto `#escrita` e reler o último ponto de continuidade #estudo
- [ ] Acrescentar um parágrafo, conectar 2 Zettels ou melhorar uma seção existente #escrita
- [ ] Registrar no projeto o próximo passo específico para a próxima semana #escrita
<%* } -%>
