# Importação Zotero com prévia e backup

## Antes de importar

1. Na paleta de comandos do Obsidian, procure **Data explorer**.
2. Clique em **Prompt For Selection** e escolha um item de teste ou os itens da importação.
3. Em **Preview Import Format**, selecione **create research note** e confira a nota renderizada, incluindo links, campos de leitura e seções persistentes.
4. Se o preview estiver correto, rode o QuickAdd **Zotero: backup pré-importação**. Ele copia `01_notes/` e `meta/attachments/` para uma pasta datada em `meta/backups/zotero/`.
5. Execute o comando nativo **Zotero Integration: create research note** para importar.

O preview do Data Explorer renderiza a saída do template para os itens selecionados; não simula a mesclagem com cada nota existente. O backup torna reversível uma reimportação que altere conteúdo manual fora das regiões `persist`.

Para restaurar, rode o QuickAdd **Restaurar backup Zotero**, escolha um manifesto e confirme. O comando cria uma cópia de segurança do estado atual antes de restaurar os arquivos listados; arquivos criados depois do snapshot não são apagados. A retenção mantém os 20 backups mais recentes e move os excedentes para a lixeira do Obsidian.

## Validação estática

O QuickAdd executa `check-backend.js` automaticamente quando o vault abre no Obsidian para desktop. Erros e avisos são notificados quando o resultado muda; o relatório fica em `meta/reports/backend-check.log`. Também é possível rodar **Verificar backend agora** pela paleta de comandos. No celular, a execução automática é ignorada porque depende do Node.js.

Antes de importar após mudanças no template, execute no terminal, na raiz do vault:

```sh
node meta/scripts/check-backend.js
```

O verificador confere se o formato ativo aponta para um template existente e se o template mantém campos e blocos necessários. A prévia no Obsidian continua sendo a validação visual do resultado renderizado.
