# Fase 3.4 — Configuração por Organização — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (nos dois repositórios).

---

## 1. Resumo executivo

Configurar uma organização deixou de exigir edição manual no Firestore. A antiga aba "Configurações" — que literalmente dizia "reservado para as próximas fases" — virou a Central de Configuração de verdade: 8 categorias reais, cada uma com campos administráveis, validação client-side e auditoria própria. Uma vulnerabilidade de segurança real e já ativa em produção (identificada, mas não corrigida, na Fase 3.3) foi fechada: `storage.rules` agora impede que uma organização escreva arquivos no caminho de outra.

A investigação desta fase (pesquisa dirigida + uma revisão crítica de arquitetura, ambas verificadas manualmente antes de eu confiar nelas) mudou 3 decisões de forma consequente, todas na direção de "menos decorativo, mais real":

1. **A correção do Storage vira uma sub-fase própria, feita primeiro** — não esperou as 8 categorias de UI, porque protege uma falha já explorável hoje (qualquer usuário autenticado podia escrever em `tenants/{orgId}/cms/...` de qualquer organização).
2. **`billingEnvironment` (sandbox/produção) foi conectado de verdade** — `asaas.js` já aceitava uma URL alternativa; deixar o campo salvo sem efeito real seria pior que não ter o campo (um operador acharia que mudou o roteamento das cobranças quando nada mudaria).
3. **"Parâmetros públicos" do Billing Provider virou um campo de verdade**, não descartado como aconteceu com Integrações — os dois eram pedidos igualmente explícitos, e tratá-los diferente sem justificar seria inconsistente com o próprio princípio de "não fabricar campo sem consumidor" já aplicado desde a Fase 3.1.

## 2. Arquitetura das configurações

### Verificação técnica que definiu o desenho do Storage

Antes de escrever a correção definitiva, verifiquei empiricamente (não assumi) se Firebase Storage Rules v2 consegue ler Firestore cross-service (`firestore.get()`) contra o emulador local deste projeto — recurso real da plataforma, nunca usado aqui. **Funciona**, com uma descoberta não-óbvia registrada em `storage-rules.test.js`: só resolve corretamente quando o `projectId` do ambiente de teste é o projeto real (`clubecavalobonfim`), não um projectId de teste isolado como `rules.test.js` (Firestore puro) usa sem problema. Documentado explicitamente no código — quem for estender esse padrão no futuro bateria na mesma armadilha sem esse registro.

### `organization-detail.html` — reestruturação de abas

"Dados" encolheu pra só o que a plataforma administra (plano, status/ciclo de vida, observações, slug). Identificação/contato saiu de lá e entrou em Configurações → Geral — confirmei antes de mover que é o mesmo documento, mesma operação (`update`, nunca `create`), só outra aba; nenhum dado mudou de lugar, só a UI.

### As 8 categorias (ver tabela completa no `CLAUDE.md`, seção "Fase 3.4")

Geral, Localização, Identidade Visual (upload real de logo/favicon via `createImageUploader`, sem compressão automática — preserva transparência de PNG), Financeiro, Comunicação, Portal (só redes sociais — conteúdo institucional continua no painel antigo do CCBMG, deliberadamente, é conteúdo não configuração), Integrações (estado vazio honesto, nenhum campo fabricado), Segurança (trilha de auditoria real, somente leitura).

Cada categoria tem seu próprio botão salvar e sua própria ação de auditoria (`org_config_geral_atualizada`, `org_config_localizacao_atualizada` etc.) — a própria aba Segurança exibe esses nomes pra um humano, então precisavam ser claros por si só.

## 3. Correções de segurança realizadas

- **`storage.rules`**: `tenants/{orgId}/cms/{categoria}/{arquivo}` e o novo `tenants/{orgId}/branding/{arquivo}` agora comparam o `{orgId}` do caminho com a organização de quem está enviando (antes: `isSignedIn() && isImage()`, sem checagem nenhuma de organização — qualquer usuário autenticado podia escrever na pasta de qualquer organização). Leitura continua pública nos dois caminhos (correto — logo/banner precisam aparecer no site público).
- **`billingEnvironment` deixou de ser decorativo**: campo "sandbox" que não mudasse nada seria pior que não existir — agora conectado de verdade em `getBillingProvider()`/`createAsaasBillingProvider`, com retrocompatibilidade total confirmada (organização sem o campo continua batendo em produção, exatamente como antes desta fase).

## 4. Arquivos modificados

**CCBMG:** `storage.rules` (correção de organização), `firebase.json` (+bloco `storage` no emulador), `functions/lib/billing/asaas.js` (+`SANDBOX_BASE_URL`, `environment` conectado), `functions/lib/billing/index.js` (repassa `environment` genérico ao provider), `functions/test/storage-rules.test.js` (novo, 126 linhas, 8 testes), `functions/test/billing-asaas.test.js` (+2 testes), `firestore.indexes.json` (+1 índice `systemLogs`), `functions/package.json` (+script `test:storage-rules`), `CLAUDE.md` (+seção "Fase 3.4" + schema atualizado).

**Portal Associativo:** `admin/organization-detail.html` (reestruturação completa: Dados encolhida, Central de Configuração com 8 sub-abas, upload de logo/favicon, validação client-side, trilha de auditoria), `docs/roadmap/README.md` + este relatório.

## 5. Testes executados

| Suíte | Resultado |
|---|---|
| `functions/test` (emulador, Admin SDK) | **116 passed, 0 failed** (114 pré-existentes + 2 novos de `billingEnvironment`) |
| `functions/test/rules.test.js` (Firestore Rules de verdade) | **21 passed, 0 failed** — sem mudança nesta fase |
| `functions/test/storage-rules.test.js` (Storage Rules de verdade, novo) | **8 passed, 0 failed** — cobre escrita cross-org bloqueada nos 2 caminhos (`cms` e `branding`), escrita na própria org permitida, conta de plataforma sem `orgId` bloqueada, usuário anônimo bloqueado, leitura pública preservada |
| e2e do CCBMG (Playwright, produção real) | **1258 passed, 86 failed** — idêntico byte a byte à baseline da Fase 3.3 (mesmas 2 categorias pré-existentes, mesmo split exato: 82 de string de versão do Bootstrap desatualizada + 4 de checagem de dado de produção não relacionada). Zero drift, zero categoria nova, zero falha em qualquer teste de autorização/Rules/Storage. |
| Smoke test manual (Chromium headless, 3 viewports) | **39/39 páginas carregadas sem erro de console**, incluindo as 8 categorias novas em `organization-detail.html`; confirmado por script que todo `getElementById` referenciado no JS tem um `id` correspondente no HTML (sem referência solta) e que não há `id` duplicado |

## 6. Riscos remanescentes

- **Validação client-side, não server-side**: Firestore Rules não validam formato de campo em `organizations` hoje (mesmo padrão do resto do projeto) — um escrita direta (fora da UI) poderia gravar um e-mail ou CNPJ malformado. Sinalizado como possível endurecimento futuro, não implementado nesta fase (fora do tamanho combinado).
- **`billingStatus` é só informativo** — "pausado" não bloqueia nada ainda (nenhum mecanismo de enforcement existe); documentado explicitamente na própria UI, não escondido.
- **Portal institucional não migrado** — conteúdo real (missão, benefícios, sede) continua editável só no painel antigo do CCBMG; uma futura fase de migração de CMS precisará decidir se herda esse padrão de abas por categoria ou usa outra abordagem.
- **`config.billingProvider` (campo cosmético da Fase 3.1) ainda pode existir em documentos salvos antes da correção da Fase 3.3** — inofensivo (nada lê mais), mas é uma pequena inconsistência histórica no dado que continua lá.

## 7. Recomendações para a Fase 3.5 (White Label)

- `organizations/{orgId}.config.{logoUrl,faviconUrl,corPrimaria,corSecundaria}` já existe e já é administrável — a Fase 3.5 tem a estrutura pronta, só falta o lado de consumo/renderização (nenhuma tela pública aplica esses valores ainda, de propósito).
- `tenants/{orgId}/branding/` já tem Storage Rules corretas — upload de novos ativos de White Label (ex.: banner customizado) pode reaproveitar o mesmo padrão de caminho + regra sem nada novo.
- O padrão "categoria com seu próprio save + sua própria ação de auditoria" estabelecido nesta fase é reutilizável por qualquer configuração futura — não precisa ser reinventado.

---

## Publicação

Nada foi commitado, enviado ou implantado, em nenhum dos dois repositórios. Aguardando aprovação explícita, conforme instruído.
