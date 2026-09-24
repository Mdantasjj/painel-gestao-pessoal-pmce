# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

Para conferir a contabilidade interna, execute `node tests/validate_personnel_accounting.js`. A verificação compara os 34 BPMs com os oito CRPMs, confere os nove BPMs da reestruturação individualmente, reconcilia a tabela com o CSV e testa os totais de POG, RAIO, COPAC e dos cards. A conferência direta da planilha histórica e a comparação com a base mais recente estão documentadas em `ANALISE_DADOS.md`.

## Detalhamento interativo

Os quatro cards principais são clicáveis e também podem ser acionados pelas teclas `Enter` ou `Espaço`. Cada card abre uma memória de cálculo com composição do total, percentuais, tabelas discriminadas e ressalvas metodológicas. A janela pode ser fechada pelo botão, pela tecla `Esc` ou por um clique fora dela.

O card **PROJETO DE EFETIVO 2027–2030** apresenta o total consolidado de **1.543 policiais necessários**, correspondente à soma dos três eixos: **POG + COTAM + BPTUR** (271 policiais), **RAIO** (912 policiais) e **COPAC/PReVio** (360 policiais). Na subpágina, os três subcards navegáveis preservam a discriminação e a memória de cálculo de cada eixo. Os três níveis do RAIO, as três fases do PReVio, o detalhamento do POG, a consulta por batalhão e os quadros independentes da COTAM e do BPTUR foram preservados.

Nas tabelas de detalhamento, as colunas de identificação e os valores estratégicos recebem tipografia ampliada e destaque em verde: cidade-polo e total no RAIO, mês e total mensal nas saídas, OPM e saldo no POG, unidade/base e necessidade no COPAC, e batalhão e efetivo adicional necessário na reestruturação do interior e do litoral.

O detalhamento do POG possui uma consulta para os 34 BPMs territoriais. Ao selecionar um batalhão, são apresentados a cidade de referência, os totais de saídas e entradas, o saldo e a perda líquida. CRPMs e demais OPMs não integram esse recorte, pois a fonte consolidada não permite redistribuir seus registros entre batalhões.

O detalhamento do COPAC/PReVio apresenta uma proposta estratégica de implantação em três fases, seguindo o padrão de seleção utilizado no RAIO. Cada fase reúne quatro bases, 120 policiais e 12 viaturas, com botões comparativos e uma tabela própria de bases, localizações e recursos. Como a resposta oficial do COPAC não informa cronograma ou prioridade, o faseamento territorial exibido é uma proposta de planejamento e não um cronograma oficial.

No primeiro eixo do **PROJETO DE EFETIVO 2027–2030**, o total de 271 policiais é composto por 111 do déficit do POG, 110 para a COTAM e 50 para a 6ª Cia/BPTUR. O resumo e os detalhamentos mantêm as três parcelas separadas. O Bloco 01 trata exclusivamente do déficit do POG, enquanto o Bloco 02 apresenta dois quadros independentes — um para a COTAM, com 10 oficiais e 100 praças, e outro para a 6ª Cia/BPTUR, com 02 oficiais e 48 praças.

O card **BATALHÕES - Análise situacional de Efetivo** apresenta **1.256 policiais de necessidade consolidada apurada**: 587 da necessidade situacional dos 34 BPMs, 503 da reestruturação do interior e do litoral e 166 das unidades especializadas com movimentação individualizada. A tabela passou a reunir os 34 BPMs e 19 especializadas, incluindo a COPAC, com subtotais separados. As nove unidades do RAIO são exibidas na nomenclatura `RAIO - nº BPM`. A planilha por OPM contém 552 promoções requeridas detalhadas em 2025 e 215 em 2026: 430 vinculadas aos BPMs, 151 às especializadas listadas e 186 a outras OPMs. A COPAC possui 374 policiais na base funcional, nenhuma exoneração identificada, 13 demissões deduplicadas de 2026, quatro requeridas e saldo de movimentações de −6, resultando em 23 policiais de necessidade situacional. Para cada unidade com saldo disponível, **Perdas** corresponde a `máximo(0, exonerações + demissões + requeridas − saldo das movimentações)`. RAIO - 6º BPM a RAIO - 9º BPM permanecem com traço no saldo e na necessidade, pois a fonte histórica de movimentações não individualiza essas denominações atuais. Os 80 processos agregados de exoneração e demissão de 2025 também não foram rateados por unidade.

Os 34 BPMs possuem referências territoriais consolidadas, exibidas na mesma linha e ao lado do nome da unidade. A relação atual contempla dois municípios, bairros ou áreas de referência para cada BPM — incluindo os agrupamentos internos de Caucaia e Maracanaú — e substitui as associações parciais utilizadas anteriormente. Esse padrão acompanha todas as ocorrências visuais dos BPMs nas composições, seletores, tabelas, rankings e detalhamentos individuais.

O detalhamento apresenta somente informações agregadas, sem nomes ou matrículas. No COPAC/PReVio, a projeção atualizada considera 12 bases cidadãs, 30 policiais e três viaturas por unidade, totalizando 360 policiais e 36 viaturas. A subpágina também discrimina a composição funcional, os recursos mínimos de armamento, proteção e comunicação e a relação das localidades. O documento não informa efetivo já disponível, cronograma de obras, inauguração ou mobiliário; por isso, 360 representa necessidade bruta de funcionamento, e não déficit líquido.

O card **Reestruturação dos batalhões do interior e do litoral** apresenta **503 policiais adicionais necessários para implementação**. A planilha `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx` identifica o escopo dos nove BPMs (26º a 34º, excluindo BPRAIO), mas seus efetivos e médias foram substituídos pela base consolidada mais recente fornecida para os 34 BPMs e oito CRPMs. Os nove BPMs somam agora **1.831 policiais**; com o reforço, o conjunto chegaria a **2.334**. Cada referência é a média *atual* do respectivo CRPM arredondada para cima; todos os nove BPMs ficam abaixo dela. A tabela também exibe as perdas já apuradas de cada batalhão apenas como informação contextual; elas não alteram a coluna **Efetivo adicional necessário** nem o total de 503. Nessa coluna, cada necessidade é apresentada com sinal negativo para comunicar a insuficiência de efetivo, mas os valores-base permanecem positivos nos cálculos. A consulta individual mostra o efetivo, a referência e a necessidade de cada unidade. O Top 5 é calculado com esses mesmos nove valores. Trata-se de um cenário de nivelamento à média de referência atual — não uma média recalculada após o reforço, nem efetivo já autorizado. Conforme orientação posterior, os 503 são incorporados ao cenário consolidado da tabela dos 34 BPMs, embora a metodologia permaneça distinta da parcela situacional de 587. A conferência unidade a unidade está em `ANALISE_DADOS.md`.

No detalhamento do RAIO, três botões permitem escolher os níveis de implantação. Antes da escolha, cada botão informa o total de bases, municípios satélites e policiais do respectivo nível. Após a seleção, o painel discrimina as cidades-polo, os municípios satélites e a composição do efetivo por base.

A tabela **Visão geral por batalhão** não exibe licenças saúde, efetivo médio do CRPM nem efetivo total do CRPM. Esses dados permanecem documentados na base metodológica, mas não são apresentados no painel. A relação funcional de 14/09/2026 reúne 645 militares em LTS própria ou de dependente nos BPMs, somados a 81 agregados por mais de um ano em LTS sem sobreposição de matrícula, totalizando 726 militares. Outros 15 agregados pertencem a comandos ou unidades fora do recorte. Licenças gestante, paternidade e interesse particular não integram esse indicador. Somente quantitativos agregados são mantidos no projeto, sem nomes ou matrículas. **Reestruturação interior e litoral** mostra os valores do 26º ao 34º BPM e um hífen nos demais; **Necessidade de efetivo** incorpora esses valores à parcela situacional. O controle de classificação inclui somente campos exibidos na tabela.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

O símbolo fornecido para a reestruturação dos batalhões está preservado em `assets/icone-reestruturacao-batalhoes.jpeg` e é apresentado em formato reduzido no respectivo card.

A imagem fornecida para o COPAC/PReVio está preservada em `assets/icone-copac-previo.jpeg` e é utilizada como ícone reduzido no card das bases cidadãs.

A imagem fornecida para as saídas de efetivo está preservada em `assets/icone-saidas-efetivo.jpeg` e é utilizada como ícone reduzido no respectivo card.

## Próxima etapa

O card **PERDA DE EFETIVO** apresenta **1.549 registros considerados**. O subtotal de 1.175 reúne 16 processos de demissão e 64 de exoneração informados para 2025, 245 demissões e 83 exonerações deduplicadas de 2026 e 767 promoções requeridas de 2025–2026. A composição acrescenta **374 movimentações dos BPMs numerados para unidades especializadas**: 271 em 2025 e 103 em 2026. Esse fluxo representa perda de efetivo para o BPM de origem, mas movimentação interna para a corporação; ele já integra os saldos usados na análise situacional e não deve ser somado novamente à necessidade dos batalhões. O resumo agregado de 2025 não discrimina OPM nem comprova a consumação dos desligamentos. A base mais abrangente de 2026 contém 340 lançamentos, dos quais 12 são duplicados, restando 328 registros. O total geral combina fontes e naturezas diferentes e não comprova pessoas únicas ou baixas institucionais.

No painel, demissões e exonerações são identificadas como relacionadas a **outros concursos**, conforme orientação do responsável pelo estudo. Os totais não mudaram; os 80 registros de 2025 continuam classificados como processos agregados, sem confirmação individual de conclusão na fonte.

No eixo POG/COTAM/BPTUR, os **160 policiais para implementação** permanecem discriminados: 110 para a COTAM (10 oficiais e 100 praças) e 50 para a 6ª Cia/BPTUR (02 oficiais e 48 praças). Esse quantitativo é adicional e não foi descontado nem redistribuído dos batalhões analisados no POG.

A página principal foi simplificada para exibir somente o cabeçalho institucional, a faixa de referência e quatro cards estratégicos. Os estudos do RAIO e do COPAC/PReVio foram incorporados como subcards do **PROJETO DE EFETIVO 2027–2030**. Os gráficos e visualizadores inferiores permanecem retirados; as análises discriminadas continuam disponíveis nas subpáginas abertas pelos cards.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, considerando somente os 34 BPMs numerados.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

Os arquivos abaixo são exportações históricas e não incorporam a atualização das promoções requeridas de 2025–2026. Para os indicadores atuais, consulte o painel HTML; a regeneração do PDF e do PowerPoint editável exige atualizar o roteiro de exportação.

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF com duas páginas 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint com dois slides 16:9, textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
