# Análise dos dados consolidados de 2025–2026

Fontes analisadas:

- `DISTRI VTR (1).xlsx` — SHA-256 `5BC0B6767E532ACBFDBBE8948B15BD18047FA1005565A20BACA990ACC0B0561A`. A aba `BASE` foi utilizada exclusivamente para relacionar os 34 BPMs numerados aos municípios e ao campo `area_km2`. Como a planilha não contém uma coluna formal de sede, o painel apresenta o município vinculado de maior área como referência territorial de cada batalhão.

- `data/Juntada_Dados_Demissoes_Exoneracoes_2026.xlsx` — SHA-256 `3FB25096CD58E846DFD43DD1C89547ABFF6A27F2715F1ADD77095DDA5DB2E6FE`.
- `data/MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf` — SHA-256 `3643F9840C3C312C97CEAB6D13345F2C57ACD3C2D6171791C4B0AB674AA36063`.
- `RELAÇÃO DOS PEDIDOS DE EXONERAÇÃO E DEMISSÃO - 2026 - AGOSTO.pdf` — SHA-256 `EE9B7090ACAF7E18635930BA87DDB2E5592FBF09740396CB1F19E281830DC312`. A fonte detalhada contém dados pessoais e, por isso, não foi copiada para o repositório público; somente os agregados por OPM e município foram utilizados.

## Totais das cinco abas

| Aba | Total utilizado no card | Composição principal |
|---|---:|---|
| Saídas de efetivo | 547 saídas | 252 demissões, 88 exonerações e 207 aposentadorias |
| RAIO — Necessidade de efetivo para compor as 20 bases satélites em 3 níveis de implementação | 912 policiais | 20 oficiais e 892 praças |
| Déficit de efetivo do POG — Policiamento Ordinário | 111 policiais | Recorte dos 34 BPMs territoriais; soma dos saldos negativos de 12 batalhões |
| COPAC — Necessidade de efetivo PReVio | 229 policiais | Composição de 10 bases, sendo 04 prioritárias em 2026 |
| Aposentadorias | 207 militares | Referência estratégica adotada: quantitativo das promoções requeridas |

## Principais achados

- As 547 saídas estratégicas são compostas por 252 demissões (46,1%), 88 exonerações (16,1%) e 207 aposentadorias (37,8%). Demissões e exonerações, juntas, correspondem a 62,2% do total.
- Entre as 340 demissões e exonerações, maio concentrou 165 registros, ou 48,5% do total de janeiro a agosto. Maio e junho, juntos, representam 72,6% desse recorte.
- Na relação individualizada, 326 registros únicos possuem origem identificável, distribuídos por 65 OPMs e 53 municípios. No recorte visual por batalhão, o 12º BPM lidera com 17 registros; Fortaleza concentra 153 registros no recorte municipal.
- As 20 bases satélite projetam 912 policiais: 783 no emprego operacional, 60 na guarda, 49 em funções administrativas e 20 oficiais. O componente operacional corresponde a 85,9% do total.
- No recorte territorial, 34 BPMs foram analisados: 12 apresentaram saldo negativo, 20 ganho líquido e dois equilíbrio. A soma das perdas é 111 policiais.
- Os 34 BPMs registram 1.459 origens e 1.549 destinos, produzindo saldo conjunto de +90. Esse saldo positivo não elimina os déficits localizados.
- O 12º BPM tem o maior saldo negativo (-37), seguido pelo 8º BPM (-23) e pelo 22º BPM (-10). Os dois primeiros concentram 54,1% do déficit por batalhão.
- CRPMs, unidades especializadas e demais OPMs foram retirados do indicador. Os registros dos comandos regionais não foram redistribuídos porque a fonte não identifica o batalhão de vínculo.
- O COPAC mantém o indicador de 229 policiais e destaca a composição de 10 bases, sendo 04 prioritárias em 2026.
- Das 207 promoções requeridas, 153 correspondem ao acesso de SUBTEN PM a 2ºTEN QOAPM, representando 73,9% do total.

## Ressalvas metodológicas

- O valor de 111 é a soma dos saldos negativos dos 12 BPMs com perdas dentro do universo de 34 BPMs numerados. Não representa, isoladamente, o déficit estrutural, que exige comparar efetivo previsto e atual.
- A consulta por batalhão discrimina saídas, entradas, saldo e perda líquida, mas não identifica o militar nem o pareamento individual entre origem e destino.
- O novo estudo de movimentações abrange do BCG 025/2025 ao BCG 153/2026. Os demais recortes continuam concentrados em 2026.
- A projeção do COPAC não inclui o comando das unidades, conforme ressalva da própria fonte.
- Os quantitativos das bases satélite e do COPAC não devem ser somados sem confirmação de que os escopos de efetivo são independentes.
- O valor de 207 foi classificado como aposentadorias por orientação do projeto, utilizando a aba de promoções requeridas como referência estratégica. A fonte original registra promoções requeridas, não atos individuais de aposentadoria.
- O visualizador de origem usa 326 registros únicos da relação cumulativa entre 01/01 e 10/08/2026. O total executivo de 340 permanece baseado na consolidação mensal; os dois recortes não devem ser tratados como uma conciliação individual exata.
- A base atual não informa a OPM de origem das 207 aposentadorias; por isso, o ranking territorial cobre apenas demissões e exonerações.
