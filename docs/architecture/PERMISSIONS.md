# Matriz de Permissões — Portal Associativo

> Migrado do vault Obsidian de trabalho durante a reorganização de documentação de agosto de 2026 (a fonte original combinava leitura de código — `requireAuth`/`requirePlatformAccess`, Firestore Rules, gates inline — com validação ao vivo via Playwright contra o Painel Master em produção e o tenant Sandbox oficial, em 2026-08-11). Onde a UI e o comportamento real do servidor divergem, isso está marcado explicitamente.

## Como ler esta matriz

Existem **dois planos de identidade totalmente separados** nesta plataforma (ver `CLAUDE.md`, raiz deste repositório):

- **Plano de organização** (`users/{uid}.role`, sempre com `orgId`): Associado → Operador → Admin View → Admin → Master. Acesso via `login.html` (CPF), no repositório do tenant (`clubedocavalobonfimmg`).
- **Plano de plataforma** (`platformAdmins/{uid}.role`, nunca tem `orgId`): Operator → Administrator → Owner. Acesso via `admin/login.html` (e-mail/senha, sem CPF) — equipe da Serafim Technologies, nunca um cliente.

Legenda: ✓ pode · — não pode/não se aplica · 👁 só leitura · 🔒 exige confirmação extra (ação irreversível ou sensível)

---

## 1. Portal do Associado (repositório do tenant)

| Funcionalidade | Associado | Admin (org) | Master (Painel Master) |
|---|:---:|:---:|:---:|
| Login por CPF | ✓ | ✓ | — |
| Primeiro Acesso (troca de senha obrigatória) | ✓ | ✓ (se criado pelo admin) | — |
| Trocar senha (opcional) | ✓ | ✓ | — |
| Recuperar senha (CPF + código) | ✓ | ✓ | — |
| Ver situação da assinatura/vigência | ✓ | ✓ | 👁 (via organization-detail, agregado) |
| Renovar plano (`pay.html`) | ✓ | ✓ | — |
| Cancelar/reativar a própria assinatura | ✓ | ✓ | — |
| Ver Produtos/Serviços exclusivos | ✓ | ✓ | — |
| Navegar/filtrar/publicar Classificados | ✓ | ✓ | — |
| Navegar Leilões, dar lance, criar/editar lote próprio | ✓ | ✓ | — |
| Inscrever-se em Evento / ver comprovante (QR) | ✓ | ✓ | — |

## 2. Painel Admin (organização — `admin.html`/`admin_*.html`, repositório do tenant)

`✓*` = disponível na UI para Admin, mas a gravação é **rejeitada pelo servidor** (Firestore Rules) — só Master de fato consegue salvar.

| Funcionalidade | Associado | Operador | Admin View | Admin | Master (org) |
|---|:---:|:---:|:---:|:---:|:---:|
| Acessar `admin.html` (hub) | — | — | ✓ 👁 | ✓ | ✓ |
| Ver lista de Associados + filtros/indicadores | — | — | ✓ 👁 | ✓ | ✓ |
| Cadastrar/editar associado | — | — | — | ✓ | ✓ |
| Alterar o papel (`role`) de um associado | — | — | — | ✓* (UI permite, servidor rejeita) | ✓ |
| Ativar/desativar associado | — | — | — | ✓ | ✓ |
| Marcar/remover isenção financeira | — | — | — | ✓ | ✓ |
| Registrar pagamento / editar fatura / gerar ou cancelar cobrança | — | — | — | ✓ | ✓ |
| **Redefinir senha de um associado** | — | — | — | — | ✓ 🔒 |
| **Excluir associado** (Firestore + Auth + Asaas) | — | — | — | — | ✓ 🔒 |
| Gerenciar Produtos/Serviços/Classificados/Leilões/Conteúdo do Site | — | — | ✓ 👁 | ✓ | ✓ |
| Check-in de evento (QR scanner) | — | ✓ | ✓ | ✓ | ✓ |
| **Configurações da Associação** (`admin_configuracoes.html` — planos, preços, contato, comissão) | — | — | ✓ 👁 (bloqueado) | 👁 (modo leitura, banner "só Master") | ✓ |
| Validar CPFs em massa / auditar sincronização Asaas | — | — | — | ✓ | ✓ |
| Criar clientes/assinaturas Asaas em massa | — | — | — | ✓ 🔒 | ✓ 🔒 |

**Notas**: Operador só tem um caminho de acesso — a URL direta de `event_checkin.html` — sem link de navegação na UI. Admin View aplica somente-leitura globalmente via a classe `body.admin-view-mode`, que esconde botões de mutação em toda a área administrativa.

## 3. Painel Master (plataforma — `admin/*.html`, este repositório)

Escrita real verificada ao vivo para `administrator`; ações exclusivas de `owner` (gerenciar outros Administrator/Owner) documentadas a partir do código, não exercitadas ao vivo na auditoria original.

| Funcionalidade | Operator | Administrator | Owner |
|---|:---:|:---:|:---:|
| Ver Dashboard (KPIs gerais) | ✓ | ✓ | ✓ |
| Ver cards de Leads/Comercial no Dashboard | — | ✓ | ✓ |
| Listar Organizações / Provisionar nova Organização | ✓ | ✓ | ✓ |
| Editar dados/módulos/assinatura/Central de Configuração de uma Organização | ✓ | ✓ | ✓ |
| Ver aba Equipe de uma Organização | ✓ 👁 | ✓ 👁 | ✓ 👁 |
| Ver Domínios | ✓ 👁 | ✓ | ✓ |
| Cadastrar/remover Domínio | — | ✓ | ✓ |
| Ver Planos (`systemPlans`) | ✓ | ✓ | ✓ |
| Criar/editar/excluir Plano | ⚠️ ver nota abaixo | ✓ | ✓ |
| Ver Assinaturas / Módulos em uso (cross-org) | ✓ 👁 | ✓ 👁 | ✓ 👁 |
| Ver Feature Flags | ✓ 👁 | ✓ | ✓ |
| Criar/gerenciar/arquivar Feature Flag | — | ✓ | ✓ |
| Ver Equipe da Plataforma | ✓ | ✓ | ✓ |
| Criar novo membro (só papel Operator) | — | ✓ | ✓ |
| Criar membro com qualquer papel / alterar papel de um membro | — | — | ✓ |
| Ativar/desativar/excluir membro | — | ✓ (só sobre Operator) | ✓ (qualquer um) |
| Ver Auditoria (`systemLogs`) | ✓ 👁 | ✓ 👁 | ✓ 👁 |
| Ver/gerenciar Leads | — (bloqueado, redirecionado) | ✓ | ✓ |
| Ver/editar Configurações da Plataforma (`systemConfig/global`) | ✓ (sem distinção de papel na tela) | ✓ | ✓ |

> ⚠️ **Nota verificada nesta reorganização de documentação**: `admin/plans.html` chama `requirePlatformAccess()` sem restringir `requiredRole`, então a UI de criar/editar/excluir plano fica visível para `operator` também. Checado contra `firestore.rules`: a escrita em `systemPlans` já exige `isPlatformAdministrator()` — um `operator` que tentar salvar recebe `permission-denied` do servidor. **Não é uma falha de segurança explorável**, é uma inconsistência de UX (botão de escrita visível para um papel que o servidor vai rejeitar). Candidato a issue: condicionar a exibição desses controles ao papel real do usuário, e varrer as demais telas de plataforma pelo mesmo padrão (nenhuma outra foi reverificada com o mesmo rigor nesta rodada).

## 4. Encontrado no sistema, mas inatingível por qualquer conta real hoje

- `login_master.html`, `admin_master.html`, `admin_master_associacoes.html`, `admin_master_configuracoes.html`, `admin_master_faturamento.html` (repositório do tenant) — mecanismo pré-multi-tenant, gate exato `role==="master"` em `users/{uid}`, estruturalmente inatingível desde a migração da Fase 3.2 (nenhuma conta real tem mais esse valor de `role`). Ver `docs/roadmap/FASE3_12_LOGIN_MASTER_LEGADO_REPORT.md`.
- Bloco de JavaScript de "Novo Classificado" dentro de `pg_associado.html` (repositório do tenant) — referencia elementos DOM que não existem nesse arquivo; o fluxo real vive em `classificados.html`. Código morto inerte, nunca executável.

Os demais achados de UX/permissão reportados junto com esta matriz (ex.: campo "Perfil de acesso" não desabilitado para Admin, erros `internal` falsos em algumas Cloud Functions, `org_bonfim.plan === "custom"` sem `systemPlans/custom` correspondente) **não foram reverificados** durante esta reorganização de documentação — candidatos a issue, não fatos confirmados nesta passada.
