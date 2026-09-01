# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

## Detalhamento interativo

Os quatro cards são clicáveis e também podem ser acionados pelas teclas `Enter` ou `Espaço`. Cada card abre uma memória de cálculo com composição do total, percentuais, tabelas discriminadas e ressalvas metodológicas. A janela pode ser fechada pelo botão, pela tecla `Esc` ou por um clique fora dela.

Nas tabelas de detalhamento, as colunas de identificação e os valores estratégicos recebem tipografia ampliada e destaque em verde: cidade-polo e total no RAIO, mês e total mensal nas saídas, OPM e saldo no POG, unidade/base e necessidade no COPAC.

O detalhamento do POG possui uma consulta para os 34 BPMs territoriais. Ao selecionar um batalhão, são apresentados a cidade de referência, os totais de saídas e entradas, o saldo e a perda líquida. CRPMs e demais OPMs não integram esse recorte, pois a fonte consolidada não permite redistribuir seus registros entre batalhões.

Os 34 BPMs recebem uma referência territorial discreta baseada na aba `BASE` de `DISTRI VTR (1).xlsx`. Como a planilha não identifica formalmente a sede, cada batalhão mostra o município vinculado de maior `area_km2`. A cidade acompanha todas as ocorrências visuais dos BPMs: gráfico de origens, composição do indicador, seletor, tabela e detalhamento individual.

O detalhamento apresenta somente informações agregadas, sem nomes ou matrículas. No COPAC, a janela destaca que o título estratégico menciona 10 bases e 04 prioritárias, enquanto a fonte quantitativa disponível contém 12 unidades e não identifica quais são as quatro prioridades.

No detalhamento do RAIO, três botões permitem escolher os níveis de implantação. Antes da escolha, cada botão informa o total de bases, municípios satélites e policiais do respectivo nível. Após a seleção, o painel discrimina as cidades-polo, os municípios satélites e a composição do efetivo por base.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

## Próxima etapa

O primeiro dos quatro cards apresenta o cálculo estratégico de **547 saídas de efetivo**: 252 demissões, 88 exonerações e 207 aposentadorias. Conforme orientação do projeto, o quantitativo de promoções requeridas foi adotado como referência das aposentadorias. Os demais cards mantêm as necessidades de efetivo do RAIO, do POG — Policiamento Ordinário, com déficit de 111 policiais nos 34 BPMs territoriais — e do COPAC/PReVio, considerando 10 bases, sendo 04 prioritárias em 2026. As aposentadorias continuam detalhadas no mostrador inferior, sem card individual.

O visualizador inferior apresenta, sem nomes ou matrículas, as OPMs e os municípios de origem de 326 registros únicos de demissão e exoneração. A fonte individualizada não foi incluída no repositório público por conter dados pessoais; somente os agregados estatísticos foram publicados.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, considerando somente os 34 BPMs numerados.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF com duas páginas 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint com dois slides 16:9, textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
