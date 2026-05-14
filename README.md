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
- Banner de cookies com consentimento (aceitar, rejeitar e fechar temporariamente por 30 dias).

## Banner de cookies e rastreamento

O projeto inclui um banner global de consentimento, fixo no rodapé, com suporte a tema claro/escuro e presets.

### Comportamento

- **ACEITAR**: salva no `localStorage` com data (`{"cookieConsent":"accepted","date":"..."}`), fecha o banner e libera rastreamento.
- **REJEITAR**: salva no `localStorage` (`{"cookieConsent":"rejected"}`), fecha o banner e não carrega rastreamento.
- **X (fechar)**: salva estado temporário (`dismissed`) e exibe novamente após 30 dias.

Chave de storage: `mdreader-cookie-consent`.

### Variáveis opcionais

Crie um `.env` na raiz para personalizar integrações:

```bash
VITE_PRIVACY_POLICY_URL=https://seusite.com/politica-de-privacidade
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
```

- `VITE_PRIVACY_POLICY_URL`: link usado no banner (fallback para `/settings`).
- `VITE_GA_MEASUREMENT_ID`: ativa Google Analytics (gtag) após consentimento.
- `VITE_GTM_ID`: ativa Google Tag Manager após consentimento.

Sem consentimento de cookies, o app mantém bloqueados:

- Vercel Analytics
- loader de script Adsterra
- GA/GTM (quando configurados)

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
