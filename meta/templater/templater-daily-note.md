<%* 
// 0 = domingo, 1 = segunda ... 6 = sábado 
const dia = Number(tp.date.now("d", 0, tp.file.title, "YYYY-MM-DD")); 
-%>

## dia a dia
- [ ] beber 2 litros de água #extra
- [ ] lavar louça #casa
- [ ] arrumar a cama #casa
- [ ] revisar flashcards #estudo 
- [ ] revisar notas aleatórias #estudo 
- [ ] ler #estudo
- [ ] processar zettel #estudo 
- [ ] criar flashcards #estudo 
- [ ] preparar o estudo do dia seguinte #estudo 
- [ ] revisar a agenda do dia #extra 
## rotina do dia
<%* if (dia === 1) { -%>
- [ ] treino de força A (peito e ombros), 40 min #exercicio
- [ ] lavar 1 tênis #casa
#### Estudo do dia - Medieval 1
<%* } -%>
<%* if (dia === 2) { -%>
- [ ] caminhada, 30 min #exercicio 
- [ ] tirar pó dos móveis e organizar a sala #casa
- [ ] organizar uma pasta do pc #extra 
#### Estudo do dia - História Contemporânea II
<%* } -%>
<%* if (dia === 3) { -%>
- [ ] treino de força B (costas e bíceps), 40 min #exercicio 
- [ ] leitura de um capítulo, literatura #extra 
- [ ] limpar o fogão e geladeira #casa
#### Estudo do dia - História Contemporânea II
<%* } -%>
<%* if (dia === 4) { -%>
- [ ] alongamento e mobilidade, 30 min #exercicio 
- [ ] limpar a caixa de e-mail #extra 
- [ ] trocar lençóis e toalhas #casa
#### Estudo do dia - História Contemporânea II
<%* } -%>
<%* if (dia === 5) { -%>
- [ ] treino de força C (pernas), 40 min #exercicio 
- [ ] limpar o banheiro #casa
#### Estudo do dia - História Moderna II
<%* } -%>
<%* if (dia === 6) { -%>
- [ ] faxina geral (aspirar e passar pano) #casa 
- [ ] caminhar ao ar livre, 45 min #exercicio 
- [ ] lavar e estender a roupa #casa 
- [ ] tirar lixo #casa 
#### Estudo do dia - Prática de Pesquisa Histórica
<%* } -%>
<%* if (dia === 0) { -%>
- [ ] caminhada curta, 30 min #exercicio 
- [ ] hobby #extra 
- [ ] organizar mesa #casa
- [ ] projeto financeiro com cashew #extra 
#### Estudo do dia - História Contemporânea 2
<%* } -%>