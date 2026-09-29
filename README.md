# Landing pages da FR Incorporadora

Este repositório reúne três landing pages estáticas, cada uma em uma pasta:

| Pasta | URL pública |
| --- | --- |
| `bueno/` | `https://empreendimento.frincorporadora.com.br/bueno/` |
| `dgn/` | `https://empreendimento.frincorporadora.com.br/dgn/` |
| `lina/` | `https://empreendimento.frincorporadora.com.br/lina/` |

Após confirmação do webhook, cada formulário abre sua página de obrigado: `/bueno-obrigado/`, `/dgn-obrigado/` ou `/lina-obrigado/`. Os slugs antigos redirecionam para os novos pela configuração em `redirects/`.

As páginas legais compartilhadas são `/politica-de-privacidade/`, `/termos-de-uso/` e `/politica-de-cookies/`. Elas descrevem o funcionamento atual das LPs e apontam para a política oficial da FR. Antes de publicar, a FR deve revisar o conteúdo jurídico e confirmar o fluxo de dados após o webhook da Make.

Os cabeçalhos de segurança têm uma única fonte em `security-headers.htaccess`. O deploy copia a política para os nove diretórios com HTML. Os estilos e scripts próprios são arquivos externos, permitindo uma CSP sem `unsafe-inline`.

## GTM e conversão

Cada empreendimento carrega apenas o próprio contêiner, na LP e na página de obrigado, e só após o aceite conjunto de medição e publicidade: `GTM-567FGJ8X` (Bueno), `GTM-N8XMH8WZ` (DGN) e `GTM-TFTCTCLB` (Lina). As páginas legais não carregam GTM. O antigo contêiner compartilhado `GTM-KP6BMDSS` não é mais carregado. A escolha fica no armazenamento local por até 180 dias e pode ser alterada pelo link no rodapé. Sem aceite, o GTM não é baixado. O snippet `noscript` foi omitido porque não há mecanismo de consentimento sem JavaScript.

Após resposta HTTP positiva do webhook da Make, o formulário grava na sessão um marcador sem dados pessoais e abre a página de obrigado. Essa página consome o marcador uma só vez e emite `dataLayer.push({event: 'formSubmit', empreendimento: 'bueno' | 'dgn' | 'lina', origem: 'lp_fr'})`. Visita direta, recarga ou URL compartilhada não emite o evento. As tags de conversão acionadas por `formSubmit` precisam existir no contêiner de cada empreendimento; a medição real ainda depende do estado dessas tags, do consentimento, da CSP e do recebimento no destino. Configure conversões pelo evento, não por mera visualização da URL de obrigado.

O Microsoft Clarity (`ypvkeny2jq`) é carregado pelo `gtm-consent.js` com o mesmo aceite do GTM, somente em `/bueno/`, `/dgn/` e `/lina/`; a CSP libera `*.clarity.ms` e `c.bing.com`. O contêiner também tem tags de HTML personalizado (incluindo uma tag de Clarity, que deve ser pausada para não duplicar a medição). A CSP restritiva pode bloquear essas tags; migre-as para modelos compatíveis com CSP, sem liberar `unsafe-inline`. Revise as origens da CSP quando o contêiner for alterado.

## Publicação no cPanel

No Git Version Control, clone este repositório em uma pasta **fora** do diretório público, por exemplo `/home2/hg3ads37/repositories/fr-incorporadora`. No menu **Manage → Pull or Deploy**, use **Update from Remote** e depois **Deploy HEAD Commit**. O arquivo `.cpanel.yml` da raiz publica as LPs, as páginas de obrigado e os redirecionamentos em `/home2/hg3ads37/empreendimento.frincorporadora.com.br`.

O deploy por pull no cPanel é manual após cada atualização do GitHub.
