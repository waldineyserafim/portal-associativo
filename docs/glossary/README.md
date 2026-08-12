# Glossário — Portal Associativo (Plataforma)

Termos de arquitetura e produto da plataforma SaaS multi-tenant. Termos específicos de negócio de um tenant (ex.: Associado, Anuidade, Lote, Arrematação — CCBMG) ficam no glossário daquele repositório: `clubedocavalobonfimmg/docs/GLOSSARY.md`.

| Termo | Significado |
|---|---|
| **Tenant / Organização** | Um cliente da plataforma, isolado por `orgId`. Documento em `organizations/{orgId}`. |
| **`orgId`** | Identificador do tenant ao qual um documento pertence. |
| **`currentOrgId`** | Constante resolvida em runtime pelo Tenant Resolver (`getTenant({db})`), a partir do hostname que serviu a página — **não** é mais um valor fixo no código desde a Fase 3.10 (era `"org_bonfim"` fixo antes disso). |
| **Organization Master** (`master`) | Papel de organização com mais privilégio — único que pode alterar o papel de outros membros da equipe administrativa da própria organização. Sempre tem `orgId`. |
| **Organization Administrator** (`admin`) | Papel de organização com operação plena do dia a dia, sem poder alterar papéis. |
| **Organization Operator** (`operador`) | Papel de organização para tarefas pontuais (ex.: check-in de evento). |
| **Organization Viewer** (`Admin View`) | Papel de organização somente-leitura nas telas administrativas. |
| **Platform Owner** | Papel de plataforma com todo privilégio, incluindo gerenciar outros Administrator/Owner e ações irreversíveis. Nunca tem `orgId`. |
| **Platform Administrator** | Papel de plataforma que cria/edita organizações, gerencia planos, gerencia Operator. |
| **Platform Operator** | Papel de plataforma somente-leitura nas telas de plataforma — zero escrita. |
| **`platformAdmins`** | Coleção da equipe da Serafim Technologies — plano de identidade inteiramente separado de `users/{uid}.role`, nunca cruza tenant. |
| **Painel Master** | Área administrativa cross-tenant (`admin/*.html`, este repositório), usada pela equipe da plataforma — não confundir com o painel de uma organização (`admin.html`, no repositório do tenant). |
| **Módulo** | Funcionalidade habilitável/desabilitável por organização (`organizations/{orgId}.modules`), copiada do plano contratado no provisionamento. |
| **Provisionamento** | Criação idempotente e auditada de um tenant novo (`provisionOrganization`) — organização + primeiro Organization Master + módulos + billing + branding + CMS mínimo. |
| **`provisioningRuns`** | Auditoria por etapa de uma execução de provisionamento. |
| **Tenant Resolver** | Mecanismo que decide qual `orgId` uma página deve servir, a partir do hostname que a serviu (`domains/{hostname}`) — sem fallback: hostname não cadastrado nunca resolve organização nenhuma. |
| **`domains`** | Índice hostname→orgId, único escritor `setOrganizationDomains`, leitura pública. |
| **White Label** | Aplicação automática da identidade visual e contato institucional de cada organização (favicon, cores, nome, logo, `<title>`, meta description) a qualquer página que consuma o núcleo compartilhado. |
| **`organizations/{orgId}/public/branding`** | Projeção pública e curada de uma organização, mantida por trigger — o único jeito de expor branding a um visitante anônimo sem abrir o documento `organizations/{orgId}` inteiro. |
| **Feature Flag** | Kill-switch ou rollout gradual de uma funcionalidade, independente de deploy, resolvido por organização (`featureFlags/{flagKey}`) — fail-closed para flag desconhecida/arquivada. |
| **Sandbox oficial** | O único tenant de demonstração/QA/homologação da plataforma (`org_teste_etapa10`, identificado só por `isSandbox: true`) — nunca dados reais. |
| **Núcleo compartilhado (`shared/`)** | Código de frontend (auth, tenant, branding, feature flags, componentes visuais) consumido cross-origin por qualquer tenant via `import` de URL absoluta — nunca contém vocabulário de papel ou schema de negócio de um tenant específico. |
| **`systemPlans`** | Catálogo de planos SaaS (quais módulos cada plano inclui), editável no Painel Master. |
| **`systemLogs`** | Auditoria de mutações relevantes de plataforma e de organização. |
| **`leads`** | Funil comercial da plataforma (não de um tenant), gerido no Painel Master. |
