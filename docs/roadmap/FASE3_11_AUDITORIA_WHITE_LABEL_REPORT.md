# Fase 3.11 — Auditoria White Label — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

Varredura completa (frontend das 47 páginas do CCBMG, backend de `functions/index.js`, dados do Firestore — tudo no repositório `clubedocavalobonfimmg`) atrás de qualquer referência hardcoded a "Clube do Cavalo"/"CCBMG"/"Bonfim" que vazasse pro tenant Sandbox. ~688 ocorrências brutas encontradas; classificadas em 3 categorias e corrigidas seguindo essa classificação — nenhuma solução específica pro Sandbox, tudo via mecanismo genérico reaproveitável por qualquer organização futura.

## 2. Categoria 1 — Resolvido pelo Tenant Context (o grosso do trabalho)

- **`[data-tenant-name]`/`[data-tenant-logo]`**: existiam só no navbar de 7 páginas. Estendido (transformação em lote, ~161 mudanças) pra navbar **e** rodapé (logo, nome, linha de copyright) de todas as 41 páginas relevantes.
- **`[data-tenant-email]`/`[data-tenant-address]`** (novos): `organizations/{orgId}/public/branding` (projeção pública mantida por trigger, Fase 3.5) ganhou `telefone`/`email`/`site`/`endereco` porque páginas públicas (`index.html`, `board.html`, `sobre.html`) precisam ler contato institucional **sem login**.
- **`<title>` dinâmico**: cada página agora declara só o propósito em `<body data-page-title="Login">` (nunca o nome da organização) — `shared/core/tenant/branding.js` (este repositório) monta `"{propósito} — {nome da org}"` em runtime. 37 páginas migradas.
- **Favicon**: `applyBranding()` já trocava o favicon, mas só o primeiro `<link rel="icon">` — páginas com `rel="icon"` E `rel="shortcut icon"` deixavam o segundo com o ícone antigo. Corrigido pra atualizar todos.
- **Nome da organização em textos gerados por JS**: `getOrgBranding()` passou a ser usado pra montar mensagem de WhatsApp de cobrança, assunto de e-mail, cabeçalho/nome de PDF exportado — nada mais hardcoded pra "Clube do Cavalo".
- **URLs absolutas hardcoded** (bug funcional, não só estético): link de redefinição de senha via SMS e link de compartilhamento de lote de leilão apontavam pra `https://clubedocavalobonfim.com.br` fixo — um associado do Sandbox receberia um link pro site errado. Trocado por `location.origin`.
- **Backend (`functions/index.js`)**: `from` de e-mail (relatório diário, notificações admin, convite de conta) trocado do endereço fixo pro endereço realmente autenticado no transporter. Descrição de cobrança no Asaas ("Mensalidade CCBMG") agora interpola o nome real da organização.
- **`organizations/{orgId}.notificationEmails`**: condição mudou de "array não-vazio" pra "array presente" — uma organização pode agora configurar explicitamente "nenhum destinatário" sem cair no fallback de e-mails pessoais.
- **`cms_about`/`cms_board`/`cms_gallery`** (descoberta durante a auditoria, não nova): `board.html`/`gallery.html`/`sobre.html`/`events.html` **já eram** dirigidos por CMS por-organização — o conteúdo do CCBMG que a auditoria encontrou hardcoded era só o *fallback estático* mostrado antes dos dados carregarem, escondido automaticamente assim que a query do Firestore volta com resultado. Corrigido populando o CMS pro Sandbox — zero mudança de código, só dado.

## 3. Categoria 2 — Substituído por conteúdo genérico

Placeholders de formulário do Painel Master (`admin_master_associacoes.html`, `admin_master_configuracoes.html`, `organization-provision.html` — este repositório) que usavam "Clube do Cavalo Bonfim MG"/"org_bonfim"/"Bonfim" como exemplo — trocados por texto genérico. Prefixo "CCBMG" em assunto de e-mail de notificação administrativa — trocado por `[Portal Associativo]`. `admin_master.html`/`admin_leiloes.html` (repositório `clubedocavalobonfimmg`): título dizia "SaaS CCBMG"/"Admin CCBMG" — corrigido pra "Portal Associativo"/"Admin" genérico.

## 4. Categoria 3 — Existe só como dado do CCBMG (`org_bonfim`)

Conteúdo que é *de verdade* do CCBMG (endereço físico real, documento "Estatuto Social" real) não precisa de tradução: ou já é dado tenant-scoped (CMS) ou foi coberto por **`[data-hide-if-sandbox]`** (novo, `branding.js`, este repositório) — esconde bloco estático sem equivalente de CMS ainda, mostrando um fallback genérico quando existe. Gate por `organizations/{orgId}.isSandbox` (Fase 3.7, agora também na projeção pública) — nunca por orgId — genérico pra qualquer tenant de demonstração futuro.

## 5. Testes e validação

Suíte completa (repositório `clubedocavalobonfimmg`): **225 verificações, 0 falhas**. Todos os 41 arquivos HTML com script inline validados sintaticamente (`node --check`) antes do deploy.

## 6. Pendências (decisão de negócio, não técnica)

- `assets/img/logo_CCBMG.png` continua sendo o favicon/logo estático de fallback em todo HTML — funcionalmente correto, mas o nome do arquivo em si é CCBMG-específico. Cosmético, fora do escopo desta auditoria.
- Meta `<meta name="description">`/Open Graph (`og:image`) — resolvido num follow-up da mesma fase: `branding.js` ganhou `meta[property="og:image"]` e `meta[name="description"]` (via `data-desc-template` em `<body>`) — 11 páginas públicas migradas.
