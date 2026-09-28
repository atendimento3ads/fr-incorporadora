# Landing pages da FR Incorporadora

Este repositório reúne três landing pages estáticas, cada uma em uma pasta:

| Pasta | URL pública |
| --- | --- |
| `fr-bueno-municipal/` | `https://empreendimento.frincorporadora.com.br/fr-bueno-municipal/` |
| `fr-dgn/` | `https://empreendimento.frincorporadora.com.br/fr-dgn/` |
| `lina-praca-do-sol/` | `https://empreendimento.frincorporadora.com.br/lina-praca-do-sol/` |

## Publicação no cPanel

No Git Version Control, clone este repositório em uma pasta **fora** do diretório público, por exemplo `/home2/hg3ads37/repositories/fr-incorporadora`. No menu **Manage → Pull or Deploy**, use **Update from Remote** e depois **Deploy HEAD Commit**. O arquivo `.cpanel.yml` da raiz copia `index.html` e `images/` de cada LP para o respectivo slug em `/home2/hg3ads37/empreendimento.frincorporadora.com.br`.

O deploy por pull no cPanel é manual após cada atualização do GitHub.
