# Worker de demonstração — demo.portalassociativo.com.br

Proxy reverso puro pra `demo.portalassociativo.com.br` → `clubedocavalobonfim.com.br` (ver `worker.js`). Não hospeda nada próprio — só existe pra fazer o Tenant Resolver enxergar o hostname certo (ver `CLAUDE.md` do repositório `clubedocavalobonfimmg`, Fase 3.9/3.10).

Já validado com `wrangler deploy --dry-run` — o pacote está pronto, só falta autenticar e publicar.

## Publicar (2 comandos, ~2 minutos)

```bash
cd cloudflare-worker-demo-proxy
npx wrangler login     # abre o navegador — só na primeira vez
npx wrangler deploy    # publica o Worker E cria o Custom Domain automaticamente
```

Isso é tudo. `wrangler deploy` lê o `wrangler.toml` (que já tem `custom_domain = true` pra `demo.portalassociativo.com.br`) e provisiona **DNS + certificado TLS + rota** na zona `portalassociativo.com.br` (já está no Cloudflare) — nenhum passo manual no dashboard é necessário.

## Se der erro de "conta ambígua"

Só acontece se o seu login Cloudflare tiver acesso a mais de uma conta/organização. Rode:

```bash
npx wrangler whoami
```

Copie o `Account ID` certo e descomente a linha `account_id = "..."` em `wrangler.toml`, depois rode `npx wrangler deploy` de novo.

## Validar que funcionou

Espere ~1-2 minutos (emissão do certificado TLS) e teste:

```bash
curl -I https://demo.portalassociativo.com.br/login.html
```

Deve devolver `HTTP/2 200`. Depois disso, abrir `https://demo.portalassociativo.com.br` no navegador já deve carregar o Clube dos Associados normalmente — nenhum outro passo de infraestrutura falta.

## Alterar o destino do proxy no futuro

Se o site do CCBMG mudar de domínio/origem, o único lugar a atualizar é a constante `ORIGIN` em `worker.js`, depois `npx wrangler deploy` de novo.

## Adicionar um domínio novo pra outra organização (futuro)

Este mesmo Worker atende qualquer domínio adicionado a ele — não precisa criar um Worker novo. Passos:
1. Adicionar um novo bloco `[[routes]]` em `wrangler.toml` com o hostname novo.
2. `npx wrangler deploy`.
3. Cadastrar o hostname em `domains/{hostname}` (Painel Master → Domínios, ou `setOrganizationDomains`).
