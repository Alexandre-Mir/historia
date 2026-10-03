<%* 
// 0 = domingo, 1 = segunda ... 6 = sábado 
const dia = Number(tp.date.now("d", 0, tp.file.title, "YYYY-MM-DD")); 
-%>

## dia a dia
- [ ] lavar louça #casa
- [ ] arrumar a cama #casa
- [ ] ler, 25 min #estudo
- [ ] processar zettel, 25 min #estudo 
- [ ] beber 2 litros de água #extra
- [ ] revisar a agenda do dia #extra 
## rotina do dia
<% if (dia === 1) { -%>
- [ ] treino de força A (peito e ombros), 40 min #exercicio
<%* } -%>
<% if (dia === 2) { -%>
- [ ] corrida leve, 30 min #exercicio 
<%* } -%>
<% if (dia === 3) { -%>
- [ ] treino de força B (costas e bíceps), 40 min #exercicio 
<%* } -%>
<% if (dia === 4) { -%>
- [ ] leitura de um capítulo, literatura #extra 
- [ ] alongamento e mobilidade, 30 min #exercicio 
- [ ] limpar a caixa de e-mail #extra 
<%* } -%>
<% if (dia === 5) { -%>
- [ ] treino de força C (pernas), 40 min #exercicio 
<%* } -%>
<% if (dia === 6) { -%>
- [ ] faxina geral (aspirar e passar pano) #casa 
- [ ] caminhar ao ar livre, 45 min #exercicio 
- [ ] lavar e estender a roupa #casa 
<%* } -%>
<% if (dia === 0) { -%>
- [ ] caminhada curta #exercicio 
- [ ] hobby
<%* } -%>