# Instruções para GitHub Copilot — MDreader

## Objetivo do projeto
- Aplicação SPA em React + Vite + TypeScript para upload, leitura e edição de Markdown.
- Fluxo principal: upload/extração de arquivos, escolha de documento, edição e preview em tempo real.
- Idioma da interface: português (pt-BR).

## Stack e ferramentas
- React 19, TypeScript, Vite, React Router.
- Extração de `.zip` com `jszip`; `.rar` via backend em `POST /api/extract-rar`.
- Lint com ESLint (`npm run lint`) e build com `npm run build`.

## Arquitetura atual (respeitar)
- Rotas em `src/App.tsx`: `/upload`, `/editor`, `/settings`, com fallback para `/editor`.
- Providers em `src/main.tsx` (ordem): `ThemeSettingsProvider` > `EditorProvider` > `App`.
- Estado do editor em `src/state/EditorContext.tsx`:
  - Persistência de rascunho no `localStorage` (`mdreader-editor-draft`).
  - Histórico com `undo/redo` e limite (`MARKDOWN_HISTORY_LIMIT`).
  - Controle de `markdown`, `documentTitle`, `currentDocPath` e `imageMap`.
  - Revogação de `blob:` URLs ao trocar `imageMap`.
- Tema em `src/state/ThemeSettingsContext.tsx`:
  - Persistência do preset (`mdreader-theme-preset`).
  - Atualização via variáveis CSS (`--bg`, `--text`, `--text-h`).
- Arquivos compactados em `src/services/archiveService.ts`:
  - Manter normalização de caminhos e resolução de imagens relativas.

## Convenções de código
- Usar componentes funcionais e hooks.
- Tipar tudo em TypeScript (evitar `any`).
- Manter estilo atual: sem ponto e vírgula, imports explícitos com extensão `.ts/.tsx` quando já adotado no arquivo.
- Evitar refactors amplos sem necessidade; mudanças devem ser pequenas e focadas na tarefa.
- Não adicionar novas dependências sem necessidade clara.
- Realizar commits pequenos e atômicos, com mensagens claras e descritivas em português.

## Regras para novas funcionalidades
- Preservar comportamento existente de upload (`.md`, `.zip`, `.rar`) e preview.
- Mensagens para o usuário devem ser claras e em português.
- Em mudanças de UI, priorizar simplicidade e acessibilidade (`aria-label`, textos descritivos).
- Não quebrar persistência de rascunho, histórico de edição e troca de tema.
- Reutilizar contexto/serviços existentes antes de criar novo estado global.

## Qualidade e validação
- Após mudanças relevantes, validar com:
  - `npm run lint`
  - `npm run build`
- Corrigir apenas problemas relacionados à alteração realizada.

## Escopo e limites
- Não implementar backend neste repositório quando não solicitado.
- Não remover recursos existentes para simplificar a entrega.
- Não alterar nomes de rotas sem atualizar toda a navegação.
- Responder sempre em português e manter consistência com o estilo atual do projeto.
