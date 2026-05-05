# MD Reader

Aplicação React para leitura e edição de arquivos Markdown com duas páginas:

1. **Upload e visualização** de arquivo `.md` ou pacote `.zip/.rar`.
2. **Editor Markdown** com preview em tempo real (lado a lado) e botões de formatação.

## Funcionalidades

- Upload de `.md`, `.zip` e `.rar`.
- Quando o pacote contém múltiplos `.md`, o usuário escolhe qual abrir.
- Renderização Markdown com GFM (tabelas, checklist etc).
- Resolução de imagens relativas vindas do pacote.
- Toolbar com: H1/H2/H3, negrito, itálico, link, imagem, lista, checklist, código inline, bloco de código, citação, separador e tabela.
- Estado em memória (sem autosave).

## Desenvolvimento

```bash
npm install
npm run dev
```

Build e lint:

```bash
npm run build
npm run lint
```

## Deploy no Vercel (rotas sem 404)

Para permitir acesso direto a rotas como `/upload`, `/editor` e `/settings`, o projeto inclui `vercel.json` com fallback para `index.html`.

Assim, qualquer rota da SPA abre corretamente mesmo após refresh ou acesso direto por URL.

## Backend para `.rar`

O front chama `POST /api/extract-rar` para extrair `.rar`.

Resposta esperada (JSON):

```json
{
  "markdownEntries": [
    { "path": "docs/readme.md", "content": "# Título" }
  ],
  "imageMap": {
    "docs/img/logo.png": "https://.../logo.png"
  }
}
```

- `markdownEntries`: lista de `.md` extraídos.
- `imageMap`: mapeamento `caminhoRelativo -> URL acessível` da imagem.

Se esse endpoint não existir, o upload de `.rar` exibirá erro amigável e `.md/.zip` continuam funcionando normalmente.
