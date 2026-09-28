# Landing pages da FR Incorporadora

Este repositório reúne três landing pages estáticas, cada uma em uma pasta:

| Pasta | URL pública |
| --- | --- |
| `bueno/` | `https://empreendimento.frincorporadora.com.br/bueno/` |
| `dgn/` | `https://empreendimento.frincorporadora.com.br/dgn/` |
| `lina/` | `https://empreendimento.frincorporadora.com.br/lina/` |

Após confirmação do webhook, cada formulário abre sua página de obrigado: `/bueno-obrigado/`, `/dgn-obrigado/` ou `/lina-obrigado/`. Os slugs antigos redirecionam para os novos pela configuração em `redirects/`.

As páginas legais compartilhadas são `/politica-de-privacidade/`, `/termos-de-uso/` e `/politica-de-cookies/`. Elas descrevem o funcionamento atual das LPs e apontam para a política oficial da FR. Antes de publicar, a FR deve revisar o conteúdo jurídico e confirmar o fluxo de dados após o webhook da Make.

Os cabeçalhos de segurança têm uma única fonte em `security-headers.htaccess`. O deploy copia a política para os nove diretórios com HTML. Os estilos e scripts próprios são arquivos externos, permitindo uma CSP sem `unsafe-inline`. Se forem adicionados analytics, pixels, fontes ou outros serviços, revise a CSP, os avisos de privacidade e cookies e os controles de escolha antes da ativação.

## Publicação no cPanel

No Git Version Control, clone este repositório em uma pasta **fora** do diretório público, por exemplo `/home2/hg3ads37/repositories/fr-incorporadora`. No menu **Manage → Pull or Deploy**, use **Update from Remote** e depois **Deploy HEAD Commit**. O arquivo `.cpanel.yml` da raiz publica as LPs, as páginas de obrigado e os redirecionamentos em `/home2/hg3ads37/empreendimento.frincorporadora.com.br`.

O deploy por pull no cPanel é manual após cada atualização do GitHub.
