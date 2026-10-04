# Auditoria geral do painel — 28/09/2026

## Escopo

A auditoria confrontou os números publicados no HTML, a memória de cálculo em `presentation.js`, o CSV por batalhão, os documentos metodológicos e as fontes disponíveis. Foram revistos desligamentos, promoções requeridas, movimentações, efetivos por Companhia, vínculos BPM–CRPM, reestruturação, RAIO, COPAC/PReVio e os totais dos quatro cards.

Nenhum dado pessoal foi incluído neste relatório. A validação de registros individualizados foi feita apenas para deduplicação e agrupamento; o repositório conserva somente resultados agregados.

## Correções comprovadas

1. **Saídas administrativas de 2026:** havia 340 lançamentos e 14 NUPs repetidos, não 12. Dois NUPs apareciam primeiro como exoneração e depois como demissão. Mantendo uma ocorrência por NUP e a classificação mais recente, o resultado correto é **326 registros únicos: 245 demissões e 81 exonerações**.
2. **15º BPM:** os dois NUPs que mudaram de classificação estavam nessa unidade. O total correto passou de três para **uma exoneração**, mantendo duas demissões. Com isso, as saídas únicas atribuídas aos 34 BPMs passaram de 232 para **230**.
3. **Promoções requeridas da COPAC:** a planilha contém cinco registros em 2025 e dois em 2026. O painel usava dois em 2025. A COPAC passou a registrar **sete requeridas**, e as especializadas passaram de 151 para **154** requeridas. As outras OPMs passaram de 186 para **183**, preservando o total geral de 767.
4. **Movimentações das especializadas:** os 15 saldos disponíveis foram alinhados literalmente ao relatório `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`. COGEIC e CGP permanecem excluídas como unidades do estudo, mas suas relações de origem ou destino não alteram artificialmente o saldo publicado das demais unidades. O saldo agregado das 15 especializadas é **+209**.

## Totais após a conciliação

| Indicador | Total validado | Composição |
|---|---:|---|
| Perda de efetivo | 1.547 registros considerados | 80 processos agregados de 2025 + 326 saídas únicas de 2026 + 767 requeridas + 374 movimentações BPM→especializadas |
| Necessidade situacional dos 34 BPMs | 585 policiais | Soma das necessidades locais; saldos positivos de outras unidades não compensam déficits locais |
| Reestruturação do interior e litoral | 600 policiais | Diferença inteira entre o efetivo atual e o teto da média atual do respectivo CRPM, nos BPMs 26º a 34º |
| Necessidade das especializadas | 161 policiais | 15 unidades com saldo individualizado; quatro unidades RAIO sem saldo disponível |
| Análise situacional consolidada | 1.346 policiais | 585 + 600 + 161 |
| Projeto de Efetivo 2027–2030 | 1.543 policiais na base | 271 POG/COTAM/BPTUR + 912 RAIO + 360 COPAC/PReVio |

## Conferências sem divergência

- Os 34 BPMs somam **10.241 policiais**, calculados a partir de 84 Companhias territoriais.
- Os oito totais de CRPM derivados dos BPMs também somam **10.241**.
- Os nove BPMs da reestruturação somam **1.797 policiais**; o reforço de 600 leva o recorte a **2.397**.
- As nove necessidades da reestruturação são inteiras e somam 600: 39, 64, 103, 58, 55, 81, 24, 121 e 55.
- O relatório de movimentações dos 34 BPMs soma **1.459 origens**, **1.549 destinos** e saldo **+90**; os saldos negativos isolados somam 111.
- O RAIO soma **912 policiais**: 20 oficiais e 892 praças; as três fases e as tabelas por base fecham no mesmo total.
- O COPAC/PReVio soma **360 policiais**: 12 bases com 30 policiais cada; as três fases fecham em 120 policiais cada.
- O projeto-base 2027–2030 fecha em **1.543**. Os cenários alternativos Maria da Penha acrescentam 21 ou 60, resultando em 1.564 ou 1.603.
- Todos os quantitativos de policiais são inteiros. Casas decimais permanecem somente em percentuais e médias analíticas anteriores ao arredondamento.

## Limites que não podem ser eliminados sem nova fonte

- Os 80 processos de demissão/exoneração de 2025 são agregados e não informam OPM; por isso, não podem ser distribuídos por batalhão.
- Promoção requerida representa impacto de recomposição da unidade, mas não baixa institucional confirmada.
- RAIO - 6º BPM a RAIO - 9º BPM não possuem saldo individualizado na fonte histórica de movimentações; a necessidade dessas quatro unidades continua indisponível.
- Os 360 policiais do COPAC/PReVio são necessidade bruta de funcionamento. A fonte não informa efetivo já disponível para calcular déficit líquido.
- A 4ª Cia/2º BPM possui um policial na base de efetivo, mas não tem localidade correspondente na planilha de endereços.
- A reestruturação é um cenário de nivelamento à média atual do CRPM, não efetivo autorizado nem média recalculada após o reforço.

## Validação automatizada

O teste `node tests/validate_personnel_accounting.js` verifica os 34 BPMs, os oito CRPMs, as 19 especializadas, os nove BPMs da reestruturação, os saldos oficiais das 15 especializadas, a COPAC, o POG, o RAIO, os cards e o CSV. Ele também impede a volta dos dois erros corrigidos: duplicidade no 15º BPM e subcontagem das requeridas da COPAC.

## Atualização de 02/10/2026 — 12º e 26º BPM

A revisão da série SAPM identificou 302 lançamentos recíprocos decorrentes da reorganização territorial de Caucaia: eles apareciam como saídas do 12º BPM e entradas do 26º BPM. Para não tratar a implantação da nova estrutura como perda e ganho operacional, as duas pontas foram neutralizadas. O saldo conjunto das unidades foi preservado em −49. O 12º BPM passou de 627 saídas, 285 entradas e saldo −342 para 325 saídas, 285 entradas e saldo −40; o 26º BPM passou de 533 saídas, 826 entradas e saldo +293 para 533 saídas, 524 entradas e saldo −9.

Após essa conciliação, o déficit de movimentações do POG passa de 847 para 554; a necessidade situacional calculada dos 34 BPMs, de 1.419 para 1.139; e o projeto-base 2027–2030, de 2.279 para 1.986 policiais. Em 04/10/2026 foram aplicados ajustes direcionados posteriores de −111 nos BPMs e −10 no BPMA, levando a análise consolidada exibida de 1.719 para **1.598** policiais, sem alterar os dados-base de movimentações, perdas ou reestruturação.
