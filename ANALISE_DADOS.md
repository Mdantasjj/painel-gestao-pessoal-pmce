# Análise dos dados consolidados de 2025–2026

Fontes analisadas:

- Documento oficial COPAC/PReVio de 08/09/2026 — SHA-256 `4A3AE90FC3C6EBF855941F69127F4F330BA4297E135016F59332A9D028D0BEFD`. Foram utilizados somente os dados agregados da resposta do COPAC. Como o processo está classificado com acesso restrito, o PDF integral, o identificador processual e os dados pessoais não foram publicados no repositório.

- `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx` — SHA-256 `64CEF17C93D1A5042975F5D72C2CE0D814386ABB6D7FEE13F6B759F513447A45`. Foi utilizada somente a aba `Resumo Executivo`. As quatro unidades ligadas ao CPRAIO/BPRAIO foram excluídas do novo indicador.

- `DISTRI VTR (1).xlsx` — SHA-256 `5BC0B6767E532ACBFDBBE8948B15BD18047FA1005565A20BACA990ACC0B0561A`. A aba `BASE` foi utilizada inicialmente para relacionar os 34 BPMs numerados aos municípios e ao campo `area_km2`. As referências territoriais foram posteriormente consolidadas pelo projeto, com dois municípios, bairros ou áreas associados a cada BPM e exibição ao lado do nome da unidade.

- `data/Juntada_Dados_Demissoes_Exoneracoes_2026.xlsx` — SHA-256 `3FB25096CD58E846DFD43DD1C89547ABFF6A27F2715F1ADD77095DDA5DB2E6FE`.
- `2 - Relação dos PM (Promovidos na Promoção Requerida) - Por OPM.xlsx` — SHA-256 `A2781C69909990C030D054F4048DB441D9676188E33D0AF7883C5A7AF7478DC9`. Foi utilizada somente a aba `PROMOÇÕES DOE - 2026` (215 registros por OPM); a aba de 2025 não integra o recorte. O arquivo original não foi publicado; somente os quantitativos agregados por BPM foram incorporados ao painel e ao CSV.
- `data/MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf` — SHA-256 `3643F9840C3C312C97CEAB6D13345F2C57ACD3C2D6171791C4B0AB674AA36063`.
- `RELAÇÃO DOS PEDIDOS DE EXONERAÇÃO E DEMISSÃO - 2026 - AGOSTO.pdf` — SHA-256 `EE9B7090ACAF7E18635930BA87DDB2E5592FBF09740396CB1F19E281830DC312`. A fonte detalhada contém dados pessoais e, por isso, não foi copiada para o repositório público; somente os agregados por OPM e município foram utilizados.

## Indicadores consolidados

| Aba | Total utilizado no card | Composição principal |
|---|---:|---|
| Perda de efetivo | 543 registros consolidados | 245 demissões, 83 exonerações e 215 requeridas; destas, 110 estão vinculadas diretamente aos 34 BPMs |
| RAIO — Necessidade de efetivo para compor as 20 bases satélites em 3 níveis de implementação | 912 policiais | 20 oficiais e 892 praças |
| Projeto de Efetivo 2027–2030 — Eixo POG + COTAM + BPTUR | 271 policiais | 111 de déficit nos 34 BPMs territoriais, 110 para a COTAM e 50 para a 6ª Cia/BPTUR |
| COPAC/PReVio — Efetivo mínimo das bases cidadãs | 360 policiais | 12 bases × 30 policiais; projeção bruta, sem dedução de efetivo disponível |
| Reestruturação dos batalhões do interior e do litoral | 525 policiais necessários | Necessidades dos 8 batalhões arredondadas individualmente para cima; 9 batalhões analisados, sendo 8 abaixo da média e 1 acima; RAIO excluído |
| BATALHÕES - Análise situacional de Efetivo | 336 policiais necessários | 34 BPMs analisados: 25 em déficit, 9 com saldo positivo; situação consolidada de −252 após incorporar saídas administrativas e requeridas vinculadas |

## Principais achados

- POG significa Policiamento Ostensivo Geral, atividade voltada ao atendimento de ocorrências e à maior visibilidade da Polícia Militar perante a sociedade.
- A fonte de demissões e exonerações registra 340 lançamentos. Retiradas 12 duplicidades, restam 328 saídas administrativas confirmadas — 245 demissões e 83 exonerações. A nova planilha por OPM soma 215 promoções requeridas em 2026, oito acima da base anterior, elevando o card a 543 registros de naturezas distintas.
- A análise territorial utiliza 232 saídas administrativas vinculadas aos 34 BPMs: 62 exonerações e 170 demissões. Outras 96 saídas administrativas ficam fora do recorte — 94 de outras OPMs e duas sem vínculo nominal extraível. Das 215 requeridas, 110 foram atribuídas diretamente aos BPMs e 105 permanecem em outras OPMs; somente as 110 entram no cálculo por batalhão.
- Na relação individualizada, 326 registros únicos possuem origem identificável, distribuídos por 65 OPMs e 53 municípios. No recorte visual por batalhão, o 12º BPM — Caucaia (Centro · Cumbuco) lidera com 17 registros; Fortaleza concentra 153 registros no recorte municipal.
- As 20 bases satélite projetam 912 policiais: 783 no emprego operacional, 60 na guarda, 49 em funções administrativas e 20 oficiais. O componente operacional corresponde a 85,9% do total.
- No recorte territorial, 34 BPMs foram analisados: 12 apresentaram saldo negativo, 20 ganho líquido e dois equilíbrio. A soma das perdas é 111 policiais.
- Os 34 BPMs registram 1.459 origens e 1.549 destinos, produzindo saldo conjunto de +90. Esse saldo positivo não elimina os déficits localizados.
- O 12º BPM — Caucaia (Centro · Cumbuco) tem o maior saldo negativo (-37), seguido pelo 8º BPM — Aldeota · Vicente Pinzón (-23) e pelo 22º BPM — Papicu · Dionísio Torres (-10). Os dois primeiros concentram 54,1% do déficit por batalhão.
- CRPMs, unidades especializadas e demais OPMs foram retirados do indicador. Os registros dos comandos regionais não foram redistribuídos porque a fonte não identifica o batalhão de vínculo.
- Na reestruturação do interior e do litoral, nove batalhões permanecem após excluir quatro unidades do RAIO. Oito estão abaixo da média do respectivo comando. A base analítica original produz diferenças fracionárias por utilizar médias; no painel, todas as metas de referência e necessidades são convertidas para efetivo inteiro, sempre garantindo que a unidade alcance ou supere a média. As necessidades resultam em 116, 96, 90, 64, 52, 41, 41 e 25 policiais, total de 525. O 33º BPM — Campos Sales · Assaré apresenta a maior necessidade, com 116.
- Na tabela situacional dos 34 batalhões, o vínculo regional BPM–CRPM utiliza a aba `BASE` de `DISTRI VTR (1).xlsx`. A base consolidada posteriormente fornecida cobre os 34 BPMs e os oito CRPMs. A soma dos batalhões vinculados a cada comando confere com o respectivo total regional: 1º CRPM 2.137; 2º CRPM 941; 3º CRPM 1.096; 4º CRPM 1.410; 5º CRPM 1.392; 6º CRPM 1.158; 7º CRPM 871; e 8º CRPM 951. O total geral é 9.956 policiais.
- O efetivo médio do CRPM divide o efetivo regional pela quantidade de BPMs vinculados ao comando e arredonda o resultado para o policial inteiro mais próximo: 1º CRPM 356; 2º CRPM 314; 3º CRPM 274; 4º CRPM 235; 5º CRPM 348; 6º CRPM 290; 7º CRPM 290; e 8º CRPM 238 policiais por BPM. A informação foi retirada da tabela geral, mas permanece no quadro `Situação atual da unidade`.
- Na análise integrada por batalhão, a situação é calculada por `saldo das movimentações − exonerações − demissões − requeridas vinculadas ao BPM`. O saldo conjunto de +90 passa a −252 depois de descontar 62 exonerações, 170 demissões e 110 requeridas vinculadas. A soma dos resultados negativos de 25 BPMs é 336 policiais; nove BPMs mantêm saldo positivo.
- O quadro transversal `Situação atual da unidade`, disponível nas quatro subpáginas principais, relaciona cada estudo à realidade dos 34 BPMs sem fundir universos metodológicos distintos. O cenário de recomposição usa `saldo das movimentações − exonerações − demissões − requeridas vinculadas ao BPM`; o cenário operacional indicativo desconta também LTS própria/dependente e agregados por mais de um ano em LTS. Como as fontes têm períodos de referência diferentes e a planilha de requeridas não permite conferência nominal, o cenário operacional é apenas sinal de pressão, não efetivo oficial nem substituto dos estudos originais de RAIO, POG, COPAC/PReVio, COTAM, BPTUR e reestruturação.
- O card `PROJETO DE EFETIVO 2027–2030` apresenta 1.543 como soma dos três eixos: POG/COTAM/BPTUR (271), RAIO (912) e COPAC/PReVio (360). As memórias de cálculo permanecem separadas nos subcards; o total é uma soma de necessidades apresentadas, não comprovação de escopos integralmente independentes.
- As 215 requeridas integram o total do card **PERDA DE EFETIVO**. A coluna por BPM apresenta os 110 registros vinculados diretamente; uma linha separa os 105 de outras OPMs. A promoção não representa baixa da PMCE, e a fonte agregada não permite conferir sobreposição nominal com exonerações ou demissões. O indicador de 336 é, portanto, um cenário de recomposição por OPM, não contagem de pessoas únicas desligadas da corporação. Outros 94 desligamentos administrativos pertencem a comandos, unidades especializadas e demais OPMs e não foram redistribuídos.
- O COPAC informa 12 bases cidadãs e padrão mínimo de 30 policiais por unidade, totalizando 360 policiais. A frota mínima consolidada é de 36 viaturas.
- A composição consolidada prevê 96 policiais na guarda, 48 na reserva de armamento, 36 no GAVV, 36 no GSC, 36 no GPF, 36 no administrativo, 24 no GSE A, 24 no GSE B e 24 na mediação de conflitos.
- Das 215 promoções requeridas, 153 correspondem ao acesso de SUBTEN PM a 2ºTEN QOAPM (71,2%); as demais 62 correspondem a promoções entre postos de oficiais (28,8%).

- O indicador de licença saúde foi alimentado pela relação funcional fornecida em 14/09/2026. Dos 875 registros sem matrículas duplicadas, 645 correspondem a LTS própria ou de dependente com vínculo direto a um dos 34 BPMs. A planilha geral possui ainda 96 agregados por mais de um ano em LTS: 81 vinculados diretamente aos BPMs e 15 pertencentes a comandos ou outras unidades. Não há sobreposição de matrícula entre os 81 agregados e a primeira relação. O total territorial é de 726 militares. O indicador exclui licenças gestante, paternidade e interesse particular. Somente os quantitativos agregados são publicados; nomes e matrículas permanecem fora do repositório. A coluna foi retirada da tabela geral, mas o dado permanece no quadro `Situação atual da unidade`. `Reestruturação necessidade` apresenta somente os resultados negativos após movimentações, exonerações, demissões e requeridas diretamente vinculadas ao BPM.

## Ressalvas metodológicas

- O valor de 111 é a soma dos saldos negativos dos 12 BPMs com perdas dentro do universo de 34 BPMs numerados. Não representa, isoladamente, o déficit estrutural, que exige comparar efetivo previsto e atual.
- A consulta por batalhão discrimina saídas, entradas, saldo e perda líquida, mas não identifica o militar nem o pareamento individual entre origem e destino.
- O novo estudo de movimentações abrange do BCG 025/2025 ao BCG 153/2026. Os demais recortes continuam concentrados em 2026.
- A projeção de 360 policiais do COPAC representa o efetivo mínimo bruto das 12 bases. O documento não informa efetivo já disponível que possa ser aproveitado e, portanto, não permite calcular o déficit líquido.
- O COPAC informa não dispor do cronograma das obras, inauguração e disponibilização do mobiliário; essas informações deverão ser obtidas junto ao PReVio.
- Os quantitativos das bases satélite e do COPAC não devem ser somados sem confirmação de que os escopos de efetivo são independentes.
- O valor atualizado de 215 é apresentado com o rótulo **Requeridas**. Seu uso na análise situacional representa impacto de recomposição do efetivo da OPM, não saída institucional consumada.
- A reconciliação da relação cumulativa entre 01/01 e 10/08/2026 demonstra integralmente os 340 lançamentos: 328 registros na contabilidade geral após retirar 12 duplicidades. Dentro desse total, 232 pertencem aos 34 BPMs e 96 ficam fora do recorte territorial.
- A nova base informa a OPM das 215 requeridas em 2026. Companhias subordinadas a BPM numerado foram agregadas ao respectivo batalhão; BPRAIO, CRPMs, CGP, COGEIC, COPAC e demais OPMs não foram redistribuídos aos BPMs. O ranking de movimentações continua restrito a movimentações e não inclui requeridas.
- As médias dos comandos podem produzir diferenças analíticas fracionárias na fonte. No painel, as referências e cada necessidade positiva da reestruturação são arredondadas para cima e exibidas somente como efetivo inteiro; o resultado não deve ser interpretado como quantitativo já autorizado para movimentação.
