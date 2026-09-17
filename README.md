# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

## Detalhamento interativo

Os seis cards são clicáveis e também podem ser acionados pelas teclas `Enter` ou `Espaço`. Cada card abre uma memória de cálculo com composição do total, percentuais, tabelas discriminadas e ressalvas metodológicas. A janela pode ser fechada pelo botão, pela tecla `Esc` ou por um clique fora dela.

Todas as seis memórias de cálculo possuem o quadro transversal **Situação atual da unidade**. Um seletor permite consultar qualquer um dos 34 BPMs e relacionar, no mesmo ponto, efetivo do batalhão, disponibilidade estimada após licenças saúde, média do CRPM, saídas permanentes e saldo das movimentações. O quadro apresenta dois cenários: **estrutural** (`movimentações − exonerações − demissões`) e **operacional indicativo** (`cenário estrutural − licenças saúde`). As fontes possuem datas de referência distintas; portanto, o segundo cenário contextualiza a pressão temporária, não representa novo efetivo oficial e não modifica nenhum dos estudos, tabelas, fases ou cálculos originais dos cards.

Nas tabelas de detalhamento, as colunas de identificação e os valores estratégicos recebem tipografia ampliada e destaque em verde: cidade-polo e total no RAIO, mês e total mensal nas saídas, OPM e saldo no POG, unidade/base e necessidade no COPAC, e batalhão e saldo na reestruturação do interior e do litoral.

O detalhamento do POG possui uma consulta para os 34 BPMs territoriais. Ao selecionar um batalhão, são apresentados a cidade de referência, os totais de saídas e entradas, o saldo e a perda líquida. CRPMs e demais OPMs não integram esse recorte, pois a fonte consolidada não permite redistribuir seus registros entre batalhões.

O detalhamento do COPAC/PReVio apresenta uma proposta estratégica de implantação em três fases, seguindo o padrão de seleção utilizado no RAIO. Cada fase reúne quatro bases, 120 policiais e 12 viaturas, com botões comparativos e uma tabela própria de bases, localizações e recursos. Como a resposta oficial do COPAC não informa cronograma ou prioridade, o faseamento territorial exibido é uma proposta de planejamento e não um cronograma oficial.

O card consolidado reúne **Déficit de efetivo — POG — Policiamento Ostensivo Geral (atendimento de ocorrências)** e **Companhia Pronta-Resposta (COTAM) + BPTUR (Cariri e Guaramiranga)**. O total de 271 policiais é composto por 111 do déficit do POG, 110 para a COTAM e 50 para a 6ª Cia/BPTUR. Na subpágina, o resumo superior e os detalhamentos mantêm as três parcelas separadas. O Bloco 01 trata exclusivamente do déficit do POG, enquanto o Bloco 02 apresenta dois quadros independentes — um para a COTAM, com 10 oficiais e 100 praças, e outro para a 6ª Cia/BPTUR, com 02 oficiais e 48 praças.

O card **BATALHÕES - Análise situacional de Efetivo** apresenta os 34 BPMs territoriais. A subpágina mostra o ranking das movimentações e uma tabela ampliada com posição, batalhão/cidades, efetivo do batalhão, exonerações, demissões, saldo das movimentações e reestruturação necessidade. A situação de cada BPM é calculada por `saldo das movimentações − exonerações − demissões`. O conjunto registra +90 nas movimentações e 232 desligamentos administrativos territorialmente identificados, produzindo situação consolidada de −142. Como 11 BPMs ainda possuem resultado positivo e um permanece em equilíbrio, a soma somente dos resultados negativos dos outros 22 BPMs corresponde a um déficit territorial apurado de 254 policiais. As aposentadorias foram retiradas deste cálculo por enquanto. Um painel permite ordenar interativamente pelos campos exibidos e inverter a direção da ordem. A base consolidada cobre os 34 BPMs e os oito CRPMs, totalizando 9.956 policiais.

Os 34 BPMs possuem referências territoriais consolidadas, exibidas na mesma linha e ao lado do nome da unidade. A relação atual contempla dois municípios, bairros ou áreas de referência para cada BPM — incluindo os agrupamentos internos de Caucaia e Maracanaú — e substitui as associações parciais utilizadas anteriormente. Esse padrão acompanha todas as ocorrências visuais dos BPMs nas composições, seletores, tabelas, rankings e detalhamentos individuais.

O detalhamento apresenta somente informações agregadas, sem nomes ou matrículas. No COPAC/PReVio, a projeção atualizada considera 12 bases cidadãs, 30 policiais e três viaturas por unidade, totalizando 360 policiais e 36 viaturas. A subpágina também discrimina a composição funcional, os recursos mínimos de armamento, proteção e comunicação e a relação das localidades. O documento não informa efetivo já disponível, cronograma de obras, inauguração ou mobiliário; por isso, 360 representa necessidade bruta de funcionamento, e não déficit líquido.

O card **Reestruturação dos batalhões do interior e do litoral** apresenta **525** com a identificação **efetivo necessário** ao lado do número. Para garantir números inteiros e fazer cada unidade alcançar ou superar a média do respectivo comando, as oito necessidades positivas foram arredondadas individualmente para cima: 116, 96, 90, 64, 52, 41, 41 e 25 policiais. O estudo utiliza somente a aba `Resumo Executivo` de `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx`. Após excluir 6º, 7º, 8º e 9º BPRAIO, o recorte contempla nove batalhões: oito abaixo da média do respectivo comando e um acima. A consulta individual permite selecionar cada BPM e visualizar cidade, efetivo atual, média de referência, saldo operacional inteiro, cobertura percentual e interpretação do resultado. A subpágina também apresenta o Top 5 dos maiores saldos, com participação de cada batalhão no total acumulado. A planilha integral não é publicada; somente os agregados necessários ao painel são incorporados.

No detalhamento do RAIO, três botões permitem escolher os níveis de implantação. Antes da escolha, cada botão informa o total de bases, municípios satélites e policiais do respectivo nível. Após a seleção, o painel discrimina as cidades-polo, os municípios satélites e a composição do efetivo por base.

A tabela **Visão geral por batalhão** foi simplificada: as colunas de licença saúde, efetivo médio do CRPM e efetivo total do CRPM foram retiradas. Esses dados continuam preservados no quadro transversal **Situação atual da unidade**, onde contextualizam o BPM selecionado sem interferir nos cálculos da tabela. A relação funcional fornecida em 14/09/2026 contém 875 registros sem matrículas duplicadas e reúne 645 militares em LTS própria ou de dependente vinculados diretamente aos 34 BPMs. A planilha geral acrescenta 81 agregados por mais de um ano em LTS com vínculo direto aos BPMs, sem sobreposição de matrícula, totalizando 726 militares. Outros 15 agregados estão vinculados a comandos ou unidades fora do recorte. Licenças gestante, paternidade e interesse particular não integram esse indicador. Os dados são publicados somente de forma agregada, sem nomes ou matrículas. **Reestruturação necessidade** apresenta somente os resultados negativos do cálculo interno. O controle de classificação utiliza apenas os campos exibidos na tabela.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

O símbolo fornecido para a reestruturação dos batalhões está preservado em `assets/icone-reestruturacao-batalhoes.jpeg` e é apresentado em formato reduzido no respectivo card.

A imagem fornecida para o COPAC/PReVio está preservada em `assets/icone-copac-previo.jpeg` e é utilizada como ícone reduzido no card das bases cidadãs.

A imagem fornecida para as saídas de efetivo está preservada em `assets/icone-saidas-efetivo.jpeg` e é utilizada como ícone reduzido no respectivo card.

## Próxima etapa

O primeiro dos seis cards apresenta a contabilidade geral de **328 saídas de efetivo sem duplicidades**: 245 demissões e 83 exonerações. A base consolidada possui 340 lançamentos, dos quais 12 foram identificados como duplicados. Na subpágina, a reconciliação separa 232 registros vinculados aos 34 BPMs — utilizados na análise situacional — e 96 registros fora desse recorte, sendo 94 de outras OPMs e dois sem vínculo nominal extraível. As aposentadorias foram retiradas deste indicador por enquanto. Os demais cards mantêm as necessidades de efetivo do RAIO, do COPAC/PReVio, da reestruturação dos batalhões do interior e do litoral, o indicador consolidado do POG com a implementação da Companhia Pronta-Resposta (COTAM) e da 6ª Cia/BPTUR, e a análise situacional de efetivo dos batalhões.

No card combinado, os **160 policiais para implementação** permanecem discriminados: 110 para a COTAM (10 oficiais e 100 praças) e 50 para a 6ª Cia/BPTUR (02 oficiais e 48 praças). Esse quantitativo é adicional e não foi descontado nem redistribuído dos batalhões analisados no POG.

A página principal foi simplificada para exibir somente o cabeçalho institucional, a faixa de referência e os seis cards estratégicos. Os gráficos e visualizadores inferiores foram retirados; as análises discriminadas permanecem disponíveis nas subpáginas abertas pelos cards.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, considerando somente os 34 BPMs numerados.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF com duas páginas 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint com dois slides 16:9, textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
