# Análise dos dados consolidados de 2025–2026

Fontes analisadas:

- `DISTRI VTR (1).xlsx` — SHA-256 `5BC0B6767E532ACBFDBBE8948B15BD18047FA1005565A20BACA990ACC0B0561A`. A aba `BASE` foi utilizada exclusivamente para relacionar BPM/CRPM aos municípios e ao campo `area_km2`. A planilha não contém uma coluna formal de sede; por isso, o painel apresenta somente o município de maior área vinculado a cada BPM ou CRPM, sem rótulo adicional.

- `data/Juntada_Dados_Demissoes_Exoneracoes_2026.xlsx` — SHA-256 `3FB25096CD58E846DFD43DD1C89547ABFF6A27F2715F1ADD77095DDA5DB2E6FE`.
- `data/MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf` — SHA-256 `3643F9840C3C312C97CEAB6D13345F2C57ACD3C2D6171791C4B0AB674AA36063`.
- `RELAÇÃO DOS PEDIDOS DE EXONERAÇÃO E DEMISSÃO - 2026 - AGOSTO.pdf` — SHA-256 `EE9B7090ACAF7E18635930BA87DDB2E5592FBF09740396CB1F19E281830DC312`. A fonte detalhada contém dados pessoais e, por isso, não foi copiada para o repositório público; somente os agregados por OPM e município foram utilizados.

## Totais das cinco abas

| Aba | Total utilizado no card | Composição principal |
|---|---:|---|
| Saídas de efetivo | 547 saídas | 252 demissões, 88 exonerações e 207 aposentadorias |
| RAIO — Necessidade de efetivo para compor as 20 bases satélites em 3 níveis de implementação | 912 policiais | 20 oficiais e 892 praças |
| Déficit de efetivo do POG — Policiamento Ordinário | 304 policiais | Principais unidades militares; soma dos saldos negativos de 22 OPM, excluídas COGEIC e CGP |
| COPAC — Necessidade de efetivo PReVio | 229 policiais | Composição de 10 bases, sendo 04 prioritárias em 2026 |
| Aposentadorias | 207 militares | Referência estratégica adotada: quantitativo das promoções requeridas |

## Principais achados

- As 547 saídas estratégicas são compostas por 252 demissões (46,1%), 88 exonerações (16,1%) e 207 aposentadorias (37,8%). Demissões e exonerações, juntas, correspondem a 62,2% do total.
- Entre as 340 demissões e exonerações, maio concentrou 165 registros, ou 48,5% do total de janeiro a agosto. Maio e junho, juntos, representam 72,6% desse recorte.
- Na relação individualizada, 326 registros únicos possuem origem identificável, distribuídos por 65 OPMs e 53 municípios. CPRAIO e 12º BPM lideram com 17 registros cada; Fortaleza concentra 153 registros.
- As 20 bases satélite projetam 912 policiais: 783 no emprego operacional, 60 na guarda, 49 em funções administrativas e 20 oficiais. O componente operacional corresponde a 85,9% do total.
- Após as exclusões metodológicas, 88 OPM foram analisadas: 22 apresentaram saldo negativo, 64 ganho líquido e duas equilíbrio. A soma dos saldos negativos é 304 policiais.
- O saldo líquido das OPM incluídas é +676, com 2.309 registros de origem e 2.985 de destino. Esse saldo positivo não elimina os déficits localizados.
- O 1º CRPM tem o maior saldo negativo individual (-145), seguido pelo 12º BPM (-37) e pelo 8º BPM (-23). Juntos, representam 67,4% do déficit acumulado.
- O quantitativo do 1º CRPM é apresentado conforme o PDF consolidado: 154 origens e 9 destinos. Como a fonte não traz os batalhões de vínculo nem os registros individualizados das movimentações, o painel não redistribui essas saídas entre unidades subordinadas.
- O COPAC mantém o indicador de 229 policiais e destaca a composição de 10 bases, sendo 04 prioritárias em 2026.
- Das 207 promoções requeridas, 153 correspondem ao acesso de SUBTEN PM a 2ºTEN QOAPM, representando 73,9% do total.

## Ressalvas metodológicas

- O valor de 304 é a soma dos saldos negativos das movimentações, após excluir COGEIC, CGP e os marcadores não OPM `-` e `(vazio)`. Não representa, isoladamente, o déficit real de efetivo, que exige comparar efetivo previsto e atual.
- A consulta por unidade discrimina os totais agregados disponíveis — saídas, entradas, saldo e perda líquida — mas não identifica o militar, o batalhão subordinado ou o pareamento individual entre origem e destino.
- O novo estudo de movimentações abrange do BCG 025/2025 ao BCG 153/2026. Os demais recortes continuam concentrados em 2026.
- A projeção do COPAC não inclui o comando das unidades, conforme ressalva da própria fonte.
- Os quantitativos das bases satélite e do COPAC não devem ser somados sem confirmação de que os escopos de efetivo são independentes.
- O valor de 207 foi classificado como aposentadorias por orientação do projeto, utilizando a aba de promoções requeridas como referência estratégica. A fonte original registra promoções requeridas, não atos individuais de aposentadoria.
- O visualizador de origem usa 326 registros únicos da relação cumulativa entre 01/01 e 10/08/2026. O total executivo de 340 permanece baseado na consolidação mensal; os dois recortes não devem ser tratados como uma conciliação individual exata.
- A base atual não informa a OPM de origem das 207 aposentadorias; por isso, o ranking territorial cobre apenas demissões e exonerações.
