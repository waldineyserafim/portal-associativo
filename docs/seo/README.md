# SEO — Portal Associativo

## Já preparado neste commit

- `robots.txt` (raiz) — libera indexação geral, bloqueia `pages/login.html`
- `sitemap.xml` (raiz) — URLs iniciais (home, contato, demonstração)
- Meta tags por página: `description`, `canonical`, Open Graph, Twitter Card
- `manifest.webmanifest` + favicon SVG

## Pendências

- [ ] Definir o domínio definitivo do Portal e atualizar todas as URLs
      absolutas (hoje usam o placeholder `https://portalassociativo.com.br/`
      em `index.html`, `pages/*.html`, `robots.txt`, `sitemap.xml`)
- [ ] Gerar `og-cover.png` (1200×630) definitivo em `assets/images/brand/`
- [ ] Pesquisa de palavras-chave (segmento "gestão de clube/associação")
- [ ] Dados estruturados (schema.org `Organization`/`SoftwareApplication`)
      quando o conteúdo definitivo estiver pronto
- [ ] Expandir `sitemap.xml` conforme novas páginas forem publicadas
