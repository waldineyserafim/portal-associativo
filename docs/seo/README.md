# SEO — Portal Associativo

## Já preparado

- `robots.txt` (raiz) — libera indexação geral, bloqueia `pages/login.html`
- `sitemap.xml` (raiz) — 10 URLs (home + 9 páginas internas públicas)
- Meta tags por página: `description`, `canonical`, Open Graph, Twitter Card
- `manifest.webmanifest` + favicon SVG
- **Domínio definitivo `portalassociativo.com.br` em produção** (registro.br
  como registrador, DNS no Cloudflare, GitHub Pages como host, HTTPS
  obrigatório emitido e válido) — todas as URLs absolutas em `index.html`,
  `pages/*.html`, `robots.txt` e `sitemap.xml` já usam o domínio real, não
  um placeholder (ver `docs/roadmap/README.md` para o histórico do go-live).

## Pendências

- [ ] Gerar `og-cover.png` (1200×630) definitivo em `assets/images/brand/`,
      se ainda não estiver na versão final (ver `docs/brand-system/README.md`
      — lá já está marcado como concluído; confirmar antes de considerar
      este item redundante).
- [ ] Pesquisa de palavras-chave (segmento "gestão de clube/associação")
- [ ] Dados estruturados (schema.org `Organization`/`SoftwareApplication`)
- [ ] Registro DMARC (`_dmarc.portalassociativo.com.br`) — autorizado e em
      configuração no Cloudflare (ver Débito técnico em `docs/roadmap/README.md`).
- [ ] Expandir `sitemap.xml` conforme novas páginas forem publicadas
