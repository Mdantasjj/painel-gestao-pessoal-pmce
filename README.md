# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

## Detalhamento interativo

Os seis cards são clicáveis e também podem ser acionados pelas teclas `Enter` ou `Espaço`. Cada card abre uma memória de cálculo com composição do total, percentuais, tabelas discriminadas e ressalvas metodológicas. A janela pode ser fechada pelo botão, pela tecla `Esc` ou por um clique fora dela.

Nas tabelas de detalhamento, as colunas de identificação e os valores estratégicos recebem tipografia ampliada e destaque em verde: cidade-polo e total no RAIO, mês e total mensal nas saídas, OPM e saldo no POG, unidade/base e necessidade no COPAC, e batalhão e defasagem na reestruturação do interior.

O detalhamento do POG possui uma consulta para os 34 BPMs territoriais. Ao selecionar um batalhão, são apresentados a cidade de referência, os totais de saídas e entradas, o saldo e a perda líquida. CRPMs e demais OPMs não integram esse recorte, pois a fonte consolidada não permite redistribuir seus registros entre batalhões.

O detalhamento do COPAC/PReVio apresenta uma proposta estratégica de implantação em três fases, seguindo o padrão de seleção utilizado no RAIO. Cada fase reúne quatro bases, 120 policiais e 12 viaturas, com botões comparativos e uma tabela própria de bases, localizações e recursos. Como a resposta oficial do COPAC não informa cronograma ou prioridade, o faseamento territorial exibido é uma proposta de planejamento e não um cronograma oficial.

O card principal utiliza o título completo **Déficit de efetivo — POG — Policiamento Ostensivo Geral (atendimento de ocorrências e maior visibilidade à sociedade)**. A linha inferior informa os 34 BPMs territoriais, e a explicação foi retirada do texto introdutório da subpágina para evitar repetição.

Os 34 BPMs recebem uma referência territorial baseada na aba `BASE` de `DISTRI VTR (1).xlsx`. Como a planilha não identifica formalmente a sede, cada batalhão mostra o município ou território de referência na mesma linha, ao lado do nome da unidade. Por orientação do projeto, foram ajustados: 5º BPM — Centro e Carlito Pamplona; 6º BPM — Parangaba; 8º BPM — Aldeota e Meireles; 16º BPM — Messejana; 17º BPM — Conjunto Ceará; 18º BPM — Antônio Bezerra e Parquelândia; 19º BPM — Tancredo Neves e Aerolândia; 20º BPM — Pirambu; 21º BPM — Conjunto Esperança; 22º BPM — Papicu e Praia do Futuro; 27º BPM — Tianguá; 28º BPM — Camocim; 30º BPM — Aracati; 32º BPM — Brejo Santo; e 33º BPM — Campos Sales. Esse padrão em linha única acompanha todas as ocorrências visuais dos BPMs nas composições, seletores, tabelas, rankings e detalhamentos individuais.

O detalhamento apresenta somente informações agregadas, sem nomes ou matrículas. No COPAC/PReVio, a projeção atualizada considera 12 bases cidadãs, 30 policiais e três viaturas por unidade, totalizando 360 policiais e 36 viaturas. A subpágina também discrimina a composição funcional, os recursos mínimos de armamento, proteção e comunicação e a relação das localidades. O documento não informa efetivo já disponível, cronograma de obras, inauguração ou mobiliário; por isso, 360 representa necessidade bruta de funcionamento, e não déficit líquido.

O card **Reestruturação dos batalhões do interior** utiliza somente a aba `Resumo Executivo` de `Resumo Organograma - Defasagem efetivo Unidades criadas.xlsx`. Após excluir 6º, 7º, 8º e 9º BPRAIO, o recorte apresenta nove batalhões: oito abaixo da média do respectivo comando, um acima e 520,5 de defasagem acumulada. A consulta individual permite selecionar cada BPM e visualizar cidade, efetivo atual, média de referência, defasagem, cobertura percentual e interpretação do resultado. A subpágina também apresenta o Top 5 das maiores defasagens, com participação de cada batalhão no total acumulado. A planilha integral não é publicada; somente os agregados necessários ao painel são incorporados.

No detalhamento do RAIO, três botões permitem escolher os níveis de implantação. Antes da escolha, cada botão informa o total de bases, municípios satélites e policiais do respectivo nível. Após a seleção, o painel discrimina as cidades-polo, os municípios satélites e a composição do efetivo por base.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

O símbolo fornecido para a reestruturação dos batalhões está preservado em `assets/icone-reestruturacao-batalhoes.jpeg` e é apresentado em formato reduzido no respectivo card.

A imagem fornecida para o COPAC/PReVio está preservada em `assets/icone-copac-previo.jpeg` e é utilizada como ícone reduzido no card das bases cidadãs.

A imagem fornecida para as saídas de efetivo está preservada em `assets/icone-saidas-efetivo.jpeg` e é utilizada como ícone reduzido no respectivo card.

## Próxima etapa

O primeiro dos seis cards apresenta o cálculo estratégico de **547 saídas de efetivo**: 252 demissões, 88 exonerações e 207 aposentadorias. Conforme orientação do projeto, o quantitativo de promoções requeridas foi adotado como referência das aposentadorias. Os demais cards mantêm as necessidades de efetivo do RAIO, do POG — Policiamento Ostensivo Geral, com déficit de 111 policiais nos 34 BPMs territoriais —, do COPAC/PReVio, agora com efetivo mínimo projetado de 360 policiais para 12 bases, da reestruturação dos batalhões do interior e da implementação conjunta da Companhia Pronta-Resposta (COTAM) com a 6ª Cia/BPTUR no Cariri e em Guaramiranga.

O novo card consolida **160 policiais**: 110 para a COTAM (10 oficiais e 100 praças) e 50 para a 6ª Cia/BPTUR (02 oficiais e 48 praças). A relação de 30,7% frente à defasagem acumulada de 520,5 dos batalhões do interior é apresentada apenas como referência de escala; não representa retirada nem redistribuição desse efetivo.

A página principal foi simplificada para exibir somente o cabeçalho institucional, a faixa de referência e os seis cards estratégicos. Os gráficos e visualizadores inferiores foram retirados; as análises discriminadas permanecem disponíveis nas subpáginas abertas pelos cards.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, considerando somente os 34 BPMs numerados.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF com duas páginas 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint com dois slides 16:9, textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
