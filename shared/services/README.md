# Serviços de dados compartilhados — vazio nesta fase (deliberado)

`addMemberService`/`addMemberProduct` (CCBMG) são schema de catálogo específico de clube — não existe um segundo tenant ainda para provar o que, dali, seria genérico. "Produto"/"serviço" pode nem fazer sentido como conceito para uma associação de bairro ou uma federação esportiva.

Extrair um "serviço CRUD genérico" agora, com um único tenant como referência, é abstração prematura: o formato provável (algo como `createFirestoreCollectionService(db, collectionName, schema)`) só fica óbvio depois que um segundo tenant real mostrar o que de fato varia entre organizações.

Esta pasta existe como contrato de diretório (a estrutura já reserva o lugar), mas fica vazia até haver dado real de um segundo tenant para desenhar a abstração certa — ver `docs/architecture/README.md` do Portal Associativo e `docs/SAAS_MULTITENANT.md` do CCBMG para o contexto completo desta decisão.
