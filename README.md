# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

## Detalhamento interativo

Os quatro cards principais são clicáveis e também podem ser acionados pelas teclas `Enter` ou `Espaço`. Cada card abre uma memória de cálculo com composição do total, percentuais, tabelas discriminadas e ressalvas metodológicas. A janela pode ser fechada pelo botão, pela tecla `Esc` ou por um clique fora dela.

As quatro memórias de cálculo possuem o quadro transversal **Situação atual da unidade**. Um seletor permite consultar qualquer um dos 34 BPMs e relacionar efetivo, licenças saúde, média do CRPM, saídas administrativas, promoções requeridas e movimentações. O cenário de recomposição considera `movimentações − exonerações − demissões − requeridas vinculadas ao BPM`; o cenário operacional indicativo desconta também as licenças saúde. Promoção não é baixa da PMCE, e a planilha agregada não permite verificar sobreposição individual entre as fontes. As datas de referência também diferem; esses cenários não substituem o efetivo oficial nem alteram os cálculos originais dos demais projetos.

O card **PROJETO DE EFETIVO 2027–2030** apresenta o total consolidado de **1.543 policiais necessários**, correspondente à soma dos três eixos: **POG + COTAM + BPTUR** (271 policiais), **RAIO** (912 policiais) e **COPAC/PReVio** (360 policiais). Na subpágina, os três subcards navegáveis preservam a discriminação e a memória de cálculo de cada eixo. Os três níveis do RAIO, as três fases do PReVio, o detalhamento do POG, a consulta por batalhão e os quadros independentes da COTAM e do BPTUR foram preservados.

Nas tabelas de detalhamento, as colunas de identificação e os valores estratégicos recebem tipografia ampliada e destaque em verde: cidade-polo e total no RAIO, mês e total mensal nas saídas, OPM e saldo no POG, unidade/base e necessidade no COPAC, e batalhão e saldo na reestruturação do interior e do litoral.

O detalhamento do POG possui uma consulta para os 34 BPMs territoriais. Ao selecionar um batalhão, são apresentados a cidade de referência, os totais de saídas e entradas, o saldo e a perda líquida. CRPMs e demais OPMs não integram esse recorte, pois a fonte consolidada não permite redistribuir seus registros entre batalhões.

O detalhamento do COPAC/PReVio apresenta uma proposta estratégica de implantação em três fases, seguindo o padrão de seleção utilizado no RAIO. Cada fase reúne quatro bases, 120 policiais e 12 viaturas, com botões comparativos e uma tabela própria de bases, localizações e recursos. Como a resposta oficial do COPAC não informa cronograma ou prioridade, o faseamento territorial exibido é uma proposta de planejamento e não um cronograma oficial.

No primeiro eixo do **PROJETO DE EFETIVO 2027–2030**, o total de 271 policiais é composto por 111 do déficit do POG, 110 para a COTAM e 50 para a 6ª Cia/BPTUR. O resumo e os detalhamentos mantêm as três parcelas separadas. O Bloco 01 trata exclusivamente do déficit do POG, enquanto o Bloco 02 apresenta dois quadros independentes — um para a COTAM, com 10 oficiais e 100 praças, e outro para a 6ª Cia/BPTUR, com 02 oficiais e 48 praças.

O card **BATALHÕES - Análise situacional de Efetivo** apresenta **336 policiais necessários à reestruturação** no cenário de recomposição dos 34 BPMs. A nova planilha de 2026 informa 215 promoções requeridas por OPM: 110 vinculadas diretamente aos batalhões e 105 a outras unidades. Para cada BPM, a tabela calcula `saldo das movimentações − exonerações − demissões − requeridas`. O saldo conjunto passa de +90 nas movimentações para −252 após descontar 232 saídas administrativas e 110 requeridas vinculadas; a soma apenas dos resultados negativos é 336 policiais em 25 batalhões. Outros nove têm saldo positivo, que não compensa automaticamente necessidades locais. A tabela discrimina as quatro parcelas por batalhão, permite classificação interativa e mantém as 105 requeridas externas em linha separada. A base de efetivo cobre os 34 BPMs e oito CRPMs, totalizando 9.956 policiais; a aba de 2025 da nova planilha não foi incorporada ao indicador de 2026.

Os 34 BPMs possuem referências territoriais consolidadas, exibidas na mesma linha e ao lado do nome da unidade. A relação atual contempla dois municípios, bairros ou áreas de referência para cada BPM — incluindo os agrupamentos internos de Caucaia e Maracanaú — e substitui as associações parciais utilizadas anteriormente. Esse padrão acompanha todas as ocorrências visuais dos BPMs nas composições, seletores, tabelas, rankings e detalhamentos individuais.

O detalhamento apresenta somente informações agregadas, sem nomes ou matrículas. No COPAC/PReVio, a projeção atualizada considera 12 bases cidadãs, 30 policiais e três viaturas por unidade, totalizando 360 policiais e 36 viaturas. A subpágina também discrimina a composição funcional, os recursos mínimos de armamento, proteção e comunicação e a relação das localidades. O documento não informa efetivo já disponível, cronograma de obras, inauguração ou mobiliário; por isso, 360 representa necessidade bruta de funcionamento, e não déficit líquido.

O card **Reestruturação dos batalhões do interior e do litoral** apresenta **525** com a identificação **efetivo necessário** ao lado do número. Para garantir números inteiros e fazer cada unidade alcançar ou superar a média do respectivo comando, as metas de referência e as oito necessidades positivas foram arredondadas individualmente para cima: 116, 96, 90, 64, 52, 41, 41 e 25 policiais. O estudo utiliza somente a aba `Resumo Executivo` de `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx`. Após excluir 6º, 7º, 8º e 9º BPRAIO, o recorte contempla nove batalhões: oito abaixo da média do respectivo comando e um acima. A consulta individual permite selecionar cada BPM e visualizar cidade, efetivo atual, referência inteira, necessidade perante a reestruturação, cobertura percentual e interpretação do resultado. A subpágina também apresenta o Top 5 dos maiores saldos, com participação de cada batalhão no total acumulado. A planilha integral não é publicada; somente os agregados necessários ao painel são incorporados.

No detalhamento do RAIO, três botões permitem escolher os níveis de implantação. Antes da escolha, cada botão informa o total de bases, municípios satélites e policiais do respectivo nível. Após a seleção, o painel discrimina as cidades-polo, os municípios satélites e a composição do efetivo por base.

A tabela **Visão geral por batalhão** não exibe licenças saúde, efetivo médio do CRPM nem efetivo total do CRPM; esses dados permanecem no quadro transversal **Situação atual da unidade**. A relação funcional de 14/09/2026 reúne 645 militares em LTS própria ou de dependente nos BPMs, somados a 81 agregados por mais de um ano em LTS sem sobreposição de matrícula, totalizando 726 militares. Outros 15 agregados pertencem a comandos ou unidades fora do recorte. Licenças gestante, paternidade e interesse particular não integram esse indicador. Somente quantitativos agregados são publicados, sem nomes ou matrículas. **Reestruturação necessidade** apresenta apenas os resultados negativos após movimentações, exonerações, demissões e requeridas do BPM. O controle de classificação inclui somente campos exibidos na tabela.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

O símbolo fornecido para a reestruturação dos batalhões está preservado em `assets/icone-reestruturacao-batalhoes.jpeg` e é apresentado em formato reduzido no respectivo card.

A imagem fornecida para o COPAC/PReVio está preservada em `assets/icone-copac-previo.jpeg` e é utilizada como ícone reduzido no card das bases cidadãs.

A imagem fornecida para as saídas de efetivo está preservada em `assets/icone-saidas-efetivo.jpeg` e é utilizada como ícone reduzido no respectivo card.

## Próxima etapa

O card **PERDA DE EFETIVO** apresenta **543 registros consolidados**: 245 demissões, 83 exonerações e 215 promoções requeridas em 2026. A base administrativa contém 340 lançamentos de demissão/exoneração, dos quais 12 são duplicados, restando 328 saídas confirmadas. A nova planilha por OPM acrescenta 215 requeridas, oito acima da base anterior: 110 nos 34 BPMs e 105 em outras OPMs. Assim, o recorte territorial reúne 342 impactos registrados (232 saídas administrativas + 110 promoções), sem afirmar que sejam 342 pessoas únicas ou 342 baixas da corporação. O visualizador **Reconciliação da base de saídas** continua retirado da subpágina; os cálculos e ressalvas estão documentados no estudo.

No eixo POG/COTAM/BPTUR, os **160 policiais para implementação** permanecem discriminados: 110 para a COTAM (10 oficiais e 100 praças) e 50 para a 6ª Cia/BPTUR (02 oficiais e 48 praças). Esse quantitativo é adicional e não foi descontado nem redistribuído dos batalhões analisados no POG.

A página principal foi simplificada para exibir somente o cabeçalho institucional, a faixa de referência e quatro cards estratégicos. Os estudos do RAIO e do COPAC/PReVio foram incorporados como subcards do **PROJETO DE EFETIVO 2027–2030**. Os gráficos e visualizadores inferiores permanecem retirados; as análises discriminadas continuam disponíveis nas subpáginas abertas pelos cards.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, considerando somente os 34 BPMs numerados.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

Os arquivos abaixo são exportações históricas e não incorporam a atualização das promoções requeridas por OPM de 21/09/2026. Para os indicadores atuais, consulte o painel HTML; a regeneração do PDF e do PowerPoint editável exige atualizar o roteiro de exportação.

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF com duas páginas 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint com dois slides 16:9, textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
