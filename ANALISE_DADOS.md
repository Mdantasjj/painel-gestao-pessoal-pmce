# Análise dos dados consolidados de 2025–2026

Fontes analisadas:

- Documento oficial COPAC/PReVio de 08/09/2026 — SHA-256 `4A3AE90FC3C6EBF855941F69127F4F330BA4297E135016F59332A9D028D0BEFD`. Foram utilizados somente os dados agregados da resposta do COPAC. Como o processo está classificado com acesso restrito, o PDF integral, o identificador processual e os dados pessoais não foram publicados no repositório.

- `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx` — SHA-256 `64CEF17C93D1A5042975F5D72C2CE0D814386ABB6D7FEE13F6B759F513447A45`. Foi utilizada somente a aba `Resumo Executivo`. As quatro unidades ligadas ao CPRAIO/BPRAIO foram excluídas do novo indicador.

- `DISTRI VTR (1).xlsx` — SHA-256 `5BC0B6767E532ACBFDBBE8948B15BD18047FA1005565A20BACA990ACC0B0561A`. A aba `BASE` foi utilizada inicialmente para relacionar os 34 BPMs numerados aos municípios e ao campo `area_km2`. As referências territoriais foram posteriormente consolidadas pelo projeto, com dois municípios, bairros ou áreas associados a cada BPM e exibição ao lado do nome da unidade.

- `data/Juntada_Dados_Demissoes_Exoneracoes_2026.xlsx` — SHA-256 `3FB25096CD58E846DFD43DD1C89547ABFF6A27F2715F1ADD77095DDA5DB2E6FE`.
- `data/MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf` — SHA-256 `3643F9840C3C312C97CEAB6D13345F2C57ACD3C2D6171791C4B0AB674AA36063`.
- `RELAÇÃO DOS PEDIDOS DE EXONERAÇÃO E DEMISSÃO - 2026 - AGOSTO.pdf` — SHA-256 `EE9B7090ACAF7E18635930BA87DDB2E5592FBF09740396CB1F19E281830DC312`. A fonte detalhada contém dados pessoais e, por isso, não foi copiada para o repositório público; somente os agregados por OPM e município foram utilizados.

## Indicadores consolidados

| Aba | Total utilizado no card | Composição principal |
|---|---:|---|
| Saídas gerais de efetivo | 328 saídas sem duplicidades | 245 demissões e 83 exonerações; 232 registros vinculados diretamente aos 34 BPMs |
| RAIO — Necessidade de efetivo para compor as 20 bases satélites em 3 níveis de implementação | 912 policiais | 20 oficiais e 892 praças |
| POG + Companhia Pronta-Resposta (COTAM) + BPTUR | 271 policiais | 111 de déficit nos 34 BPMs territoriais, 110 para a COTAM e 50 para a 6ª Cia/BPTUR |
| COPAC/PReVio — Efetivo mínimo das bases cidadãs | 360 policiais | 12 bases × 30 policiais; projeção bruta, sem dedução de efetivo disponível |
| Reestruturação dos batalhões do interior e do litoral | 525 policiais necessários | Necessidades dos 8 batalhões arredondadas individualmente para cima; 9 batalhões analisados, sendo 8 abaixo da média e 1 acima; RAIO excluído |
| BATALHÕES - Análise situacional de Efetivo | 34 batalhões analisados | 22 em déficit, 11 com saldo positivo e 1 em equilíbrio; situação consolidada de −142 após incorporar exonerações e demissões |
| Aposentadorias | 207 militares | Referência estratégica adotada: quantitativo das promoções requeridas |

## Principais achados

- POG significa Policiamento Ostensivo Geral, atividade voltada ao atendimento de ocorrências e à maior visibilidade da Polícia Militar perante a sociedade.
- A fonte consolidada registra 340 demissões e exonerações. Retirando somente as 12 duplicidades, a contabilidade geral fica em 328 saídas — 245 demissões e 83 exonerações.
- A análise situacional utiliza o recorte territorial de 232 registros vinculados aos 34 BPMs. Os 96 registros restantes são mantidos na contabilidade geral, mas não redistribuídos entre os batalhões: 94 pertencem a outras OPMs e dois não possuem vínculo nominal extraível. As aposentadorias permanecem fora desse cálculo por enquanto.
- Na relação individualizada, 326 registros únicos possuem origem identificável, distribuídos por 65 OPMs e 53 municípios. No recorte visual por batalhão, o 12º BPM — Caucaia (Centro · Cumbuco) lidera com 17 registros; Fortaleza concentra 153 registros no recorte municipal.
- As 20 bases satélite projetam 912 policiais: 783 no emprego operacional, 60 na guarda, 49 em funções administrativas e 20 oficiais. O componente operacional corresponde a 85,9% do total.
- No recorte territorial, 34 BPMs foram analisados: 12 apresentaram saldo negativo, 20 ganho líquido e dois equilíbrio. A soma das perdas é 111 policiais.
- Os 34 BPMs registram 1.459 origens e 1.549 destinos, produzindo saldo conjunto de +90. Esse saldo positivo não elimina os déficits localizados.
- O 12º BPM — Caucaia (Centro · Cumbuco) tem o maior saldo negativo (-37), seguido pelo 8º BPM — Aldeota · Vicente Pinzón (-23) e pelo 22º BPM — Papicu · Dionísio Torres (-10). Os dois primeiros concentram 54,1% do déficit por batalhão.
- CRPMs, unidades especializadas e demais OPMs foram retirados do indicador. Os registros dos comandos regionais não foram redistribuídos porque a fonte não identifica o batalhão de vínculo.
- Na reestruturação do interior e do litoral, nove batalhões permanecem após excluir quatro unidades do RAIO. Oito estão abaixo da média do respectivo comando. A base analítica produz diferenças fracionárias por utilizar médias; para o planejamento operacional, cada necessidade positiva foi arredondada individualmente para cima, resultando em 116, 96, 90, 64, 52, 41, 41 e 25 policiais, total de 525. O 33º BPM — Campos Sales · Assaré apresenta a maior necessidade inteira, com 116.
- Na tabela situacional dos 34 batalhões, o vínculo regional BPM–CRPM utiliza a aba `BASE` de `DISTRI VTR (1).xlsx`. A base consolidada posteriormente fornecida cobre os 34 BPMs e os oito CRPMs. A soma dos batalhões vinculados a cada comando confere com o respectivo total regional: 1º CRPM 2.137; 2º CRPM 941; 3º CRPM 1.096; 4º CRPM 1.410; 5º CRPM 1.392; 6º CRPM 1.158; 7º CRPM 871; e 8º CRPM 951. O total geral é 9.956 policiais.
- A coluna `Efetivo médio do CRPM` divide o efetivo regional pela quantidade de BPMs vinculados ao comando: 1º CRPM 356,2; 2º CRPM 313,7; 3º CRPM 274,0; 4º CRPM 235,0; 5º CRPM 348,0; 6º CRPM 289,5; 7º CRPM 290,3; e 8º CRPM 237,8 policiais por BPM.
- Na análise integrada por batalhão, a situação média é calculada por `saldo das movimentações − exonerações − demissões`. O saldo conjunto de +90 passa a −142 depois de descontar 62 exonerações e 170 demissões territorialmente vinculadas. A soma dos resultados negativos de 22 BPMs é 254 policiais; 11 BPMs mantêm saldo positivo e um fica em equilíbrio.
- As 207 aposentadorias foram retiradas da tabela e do cálculo por batalhão enquanto a fonte não informar a unidade de origem. Outros 94 desligamentos administrativos pertencem a comandos, unidades especializadas e demais OPMs e não foram redistribuídos.
- O COPAC informa 12 bases cidadãs e padrão mínimo de 30 policiais por unidade, totalizando 360 policiais. A frota mínima consolidada é de 36 viaturas.
- A composição consolidada prevê 96 policiais na guarda, 48 na reserva de armamento, 36 no GAVV, 36 no GSC, 36 no GPF, 36 no administrativo, 24 no GSE A, 24 no GSE B e 24 na mediação de conflitos.
- Das 207 promoções requeridas, 153 correspondem ao acesso de SUBTEN PM a 2ºTEN QOAPM, representando 73,9% do total.

- A coluna `Efetivo de licença saúde` foi posicionada após o efetivo total do CRPM. Como as fontes disponíveis não discriminam esse afastamento por batalhão, os valores permanecem como não informados e não integram o cálculo do déficit de movimentação. As colunas antes chamadas `Situação média` e `Déficit apurado` são exibidas como `Déficit de movimentação` e `Reestruturação necessidade`, sem alteração da fórmula vigente.

## Ressalvas metodológicas

- O valor de 111 é a soma dos saldos negativos dos 12 BPMs com perdas dentro do universo de 34 BPMs numerados. Não representa, isoladamente, o déficit estrutural, que exige comparar efetivo previsto e atual.
- A consulta por batalhão discrimina saídas, entradas, saldo e perda líquida, mas não identifica o militar nem o pareamento individual entre origem e destino.
- O novo estudo de movimentações abrange do BCG 025/2025 ao BCG 153/2026. Os demais recortes continuam concentrados em 2026.
- A projeção de 360 policiais do COPAC representa o efetivo mínimo bruto das 12 bases. O documento não informa efetivo já disponível que possa ser aproveitado e, portanto, não permite calcular o déficit líquido.
- O COPAC informa não dispor do cronograma das obras, inauguração e disponibilização do mobiliário; essas informações deverão ser obtidas junto ao PReVio.
- Os quantitativos das bases satélite e do COPAC não devem ser somados sem confirmação de que os escopos de efetivo são independentes.
- O valor de 207 foi classificado como aposentadorias por orientação do projeto, utilizando a aba de promoções requeridas como referência estratégica. A fonte original registra promoções requeridas, não atos individuais de aposentadoria.
- A reconciliação da relação cumulativa entre 01/01 e 10/08/2026 demonstra integralmente os 340 lançamentos: 328 registros na contabilidade geral após retirar 12 duplicidades. Dentro desse total, 232 pertencem aos 34 BPMs e 96 ficam fora do recorte territorial.
- A base atual não informa a OPM de origem das 207 aposentadorias; por isso, o ranking territorial cobre apenas demissões e exonerações.
- As médias dos comandos podem produzir diferenças analíticas fracionárias. No painel, cada necessidade positiva da reestruturação é arredondada para cima e exibida como efetivo inteiro; o resultado não deve ser interpretado como quantitativo já autorizado para movimentação.
