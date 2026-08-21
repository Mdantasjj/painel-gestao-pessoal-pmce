# Painel de Apresentação PMCE

Painel institucional responsivo da Polícia Militar do Ceará, preparado para apresentação em reunião, projetor ou telão no formato 16:9.

## Executar

Abra o arquivo `index.html` no navegador e use o botão de tela cheia no cabeçalho. Não há dependências externas nem etapa de compilação.

## Identidade visual

A assinatura institucional oficial fornecida está preservada em `assets/timbrado.png` e é exibida integralmente no cabeçalho lateral, sem cortes ou alteração de cores.

## Próxima etapa

Os cinco cards representam os totais das cinco abas da planilha consolidada. Os três mostradores inferiores apresentam simultaneamente: desligamentos; necessidades de efetivo do RAIO, do Policiamento Ostensivo Geral (POG) e do COPAC/PReVio; e promoções requeridas.

As fontes estão preservadas na pasta `data`. Os valores das quatro primeiras bases da planilha foram conferidos com suas fórmulas; o estudo de déficit foi recalculado a partir de `MOVIMENTAÇÕES DO BCG 025-2025 AO BCG 153-2026.pdf`, excluindo COGEIC, CGP e marcadores não OPM.

O detalhamento metodológico e o ranking completo estão em `ESTUDO_DEFICIT_2025_2026.md`.

## Exportações

- `exportacoes/Painel_Gestao_Pessoal_PMCE.pdf`: painel em PDF de página única 16:9.
- `exportacoes/Painel_Gestao_Pessoal_PMCE_EDITAVEL.pptx`: apresentação PowerPoint 16:9 com textos, formas e gráficos editáveis.
- `gerar_exportacoes.py`: recria as duas exportações a partir da prévia atualizada.
