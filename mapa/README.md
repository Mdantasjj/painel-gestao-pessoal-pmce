# Mapa territorial dos batalhões

Página independente do painel principal, disponível em `/mapa/`. Nenhum estudo ou componente da página principal é carregado ou alterado por esta página.

## Conteúdo

- 184 limites municipais oficiais do Ceará, edição IPECE 2026;
- 121 bairros oficiais de Fortaleza, edição IPLANFOR 2023;
- divisão territorial dos oito CRPMs, com contornos, cores, rótulos, legenda e pesquisa regional;
- 34 BPMs territoriais da análise situacional, com agrupamento automático quando os marcadores estão próximos;
- consulta por batalhão, município ou bairro;
- quadro situacional ao passar o mouse sobre cada batalhão.
- população estimada de 2026 e IDHM de 2010 em cada município;
- população e IDH-B de 2010 nos bairros de Fortaleza quando há correspondência histórica.

O quadro do batalhão apresenta efetivo, companhias, saldo situacional, exonerações, demissões, promoções requeridas, movimentações, perdas, reestruturação e necessidade consolidada. Os marcadores são referências territoriais de visualização, não endereços operacionais.

## Fontes cartográficas

- IPECE — Limites municipais do Ceará 2026: <https://www.ipece.ce.gov.br/limites-municipais/>
- IPECE — Mapas e legislação: <https://www.ipece.ce.gov.br/consulta-aos-mapas-e-legislacao/>
- IPLANFOR — Bairros de Fortaleza: <https://mapas.fortaleza.ce.gov.br/mapa/21/bairros-de-fortaleza>

Não existe, nas fontes indicadas, uma única malha oficial estadual de bairros. Por isso, a subdivisão de bairros é apresentada somente em Fortaleza; no restante do Ceará, a divisão oficial exibida é municipal. A relação territorial da planilha `DISTRI VTR (1).xlsx` vincula os 121 bairros da Capital às respectivas AIS, BPMs e CRPMs: 72 bairros pertencem ao 1º CRPM e 49 ao 5º CRPM. Caucaia recebe os dois marcadores territoriais correspondentes ao 12º e ao 26º BPM, ambos no 2º CRPM.

A paleta regional reproduz as cores vetoriais do mapa oficial `RISP_AIS_ESTADO_2026_Banner-90x120-1.pdf`, respeitando a correspondência RISP–CRPM: Capital Oeste/1º CRPM em azul, RMF Oeste/2º CRPM em laranja, Norte/3º CRPM em roxo, Sul/4º CRPM em vermelho, Capital Leste/5º CRPM em verde-água, RMF Leste/6º CRPM em rosa, Nordeste/7º CRPM em verde e Sudeste/8º CRPM em amarelo.

## Indicadores socioeconômicos

- População municipal: estimativa do IBGE com referência em 1º de julho de 2026 (<https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html>).
- IDHM municipal: Atlas do Desenvolvimento Humano/PNUD, ano-base 2010, reproduzido na tabela municipal do IPECE (<https://www.ipece.ce.gov.br/wp-content/uploads/sites/45/2012/12/Ipece_Informe_64_12_setembro_2013.pdf>).
- Bairros de Fortaleza: população do Censo 2010 e IDH-B 2010, disponibilizados pelo portal de dados abertos de Fortaleza.

Os anos são exibidos no próprio mapa. Assim, a população estimada de 2026 não é comparada como se fosse do mesmo período do IDHM/IDH-B de 2010. Os bairros Rachel de Queiroz, Aracapá, Olavo Oliveira, Novo Mondubim e Parque Santa Maria não possuem série histórica completa nas bases de 2010 e ficam marcados como “Não disponível” para o indicador ausente.

## Validação

```powershell
node --check mapa/map.js
node tests/validate_ceara_map.js
```
