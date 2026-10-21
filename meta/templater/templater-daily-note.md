<%*
// 0 = domingo, 1 = segunda ... 6 = sábado
const dia = Number(tp.date.now("d", 0, tp.file.title, "YYYY-MM-DD"));
-%>

## 🌅 Manhã — abertura e foco
**A Rocha do dia:** _escreva aqui uma prioridade acadêmica concreta_

- [ ] 07:30 - 08:00 Preparar o café da manhã #casa
- [ ] 08:00 - 08:15 Arrumar a cama e cuidar da louça #casa
- [ ] Beber água ao longo do dia (meta: 2 L) #extra
- [ ] Revisar a agenda e escolher uma única prioridade acadêmica #extra
- [ ] Finalizar corte para o canal Saber do Brasil #projeto

## 📖 Bloco de estudo — leitura e fichamento
> Siga o ciclo do [[fluxo de estudos]]: retome uma leitura ativa e avance apenas 1–3 blocos/parágrafos.

- [ ] 08:30 - 09:20 Sessão de leitura incremental (1 pomodoro) #estudo
- [ ] Registrar o avanço na nota de literatura em `01_notes/` #estudo

## 🧠 Bloco de estudo — elaboração
- [ ] 10:15 - 11:00 Processar ou amadurecer um Zettel: síntese autoral e uma conexão com nexo explícito #estudo

## 🌇 Tarde — movimento e tarefa da casa
- [ ] 12:00 - 13:00 Preparar o almoço #casa
- [ ] 14:00 - 14:45 Enviar 3 currículos #trabalho
<%* if (dia === 1) { -%>
- [ ] 15:00 - 16:00 Treino de força A (peito e ombros), 40 min #exercicio
- [ ] 16:00 - 16:30 Lavar um tênis #casa
#### Estudo do dia — História Medieval I
<%* } else if (dia === 2) { -%>
- [ ] 15:00 - 15:30 Caminhada, 30 min #exercicio
- [ ] 16:00 - 16:30 Tirar pó dos móveis e organizar a sala #casa
- [ ] Organizar uma pasta do computador #extra
#### Estudo do dia — História Contemporânea II
<%* } else if (dia === 3) { -%>
- [ ] 15:00 - 16:00 Treino de força B (costas e bíceps), 40 min #exercicio
- [ ] 16:00 - 16:30 Limpar fogão e geladeira #casa
#### Estudo do dia — História Contemporânea II
<%* } else if (dia === 4) { -%>
- [ ] 15:00 - 15:30 Alongamento e mobilidade #exercicio
- [ ] Limpar a caixa de e-mail #extra
- [ ] 16:00 - 16:30 Trocar lençóis e toalhas #casa
#### Estudo do dia — História Antiga I
<%* } else if (dia === 5) { -%>
- [ ] 15:00 - 16:00 Treino de força C (pernas), 40 min #exercicio
- [ ] 16:00 - 16:30 Limpar o banheiro #casa
#### Estudo do dia — Cultura Brasileira
<%* } else if (dia === 6) { -%>
- [ ] 15:00 - 15:45 Faxina geral (aspirar e passar pano) #casa
- [ ] 15:45 - 16:30 Caminhar ao ar livre, 45 min #exercicio
- [ ] 16:30 - 17:00 Lavar e estender a roupa #casa
- [ ] Tirar o lixo #casa
#### Estudo do dia — Prática de Pesquisa Histórica
<%* } else { -%>
- [ ] 15:00 - 15:30 Caminhada curta #exercicio
- [ ] 16:00 - 16:30 Organizar a mesa #casa
- [ ] Hobby / descanso ativo #extra
- [ ] Projeto financeiro com Cashew #extra
#### Estudo do dia — Teoria da História
<%* } -%>

## 🌙 Noite — fechamento e continuidade
- [ ] 19:00 - 19:45 Preparar o jantar #casa
- [ ] 20:30 - 20:45 Registrar `reading-position::` e `next-reading-step::` na nota da obra #estudo · [Registrar continuidade](obsidian://advanced-uri?vault=historia&commandid=quickadd%3Achoice%3A8fccdf26-e809-4000-a664-2e0bc7c3c5ae)
- [ ] 20:45 - 21:00 Preparar o estudo do próximo dia: disciplina, obra e trecho a retomar #estudo
- [ ] 21:00 - 21:10 Fazer uma revisão breve da agenda de amanhã #extra

<%* if (dia === 0) { -%>
## 🌱 Projeto semanal — escrita incremental
> Bônus semanal: reserve 30–45 min para avançar no mesmo ensaio, artigo ou MOC com tag `#escrita`.
- [ ] 11:15 - 12:00 Acrescentar um parágrafo, conectar 2 Zettels ou melhorar uma seção existente #escrita
- [ ] Registrar no projeto o próximo passo específico para a próxima semana #estudo
<%* } -%>
