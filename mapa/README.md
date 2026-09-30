# Mapa territorial dos batalhões

Página independente do painel principal, disponível em `/mapa/`. Nenhum estudo ou componente da página principal é carregado ou alterado por esta página.

## Conteúdo

- 184 limites municipais oficiais do Ceará, edição IPECE 2026;
- 121 bairros oficiais de Fortaleza, edição IPLANFOR 2023;
- divisão territorial dos oito CRPMs, com contornos, cores, rótulos, legenda e pesquisa regional;
- 34 BPMs territoriais da análise situacional, com agrupamento automático quando os marcadores estão próximos;
- consulta por batalhão, município ou bairro;
- quadro situacional ao passar o mouse sobre cada batalhão.

O quadro do batalhão apresenta efetivo, companhias, saldo situacional, exonerações, demissões, promoções requeridas, movimentações, perdas, reestruturação e necessidade consolidada. Os marcadores são referências territoriais de visualização, não endereços operacionais.

## Fontes cartográficas

- IPECE — Limites municipais do Ceará 2026: <https://www.ipece.ce.gov.br/limites-municipais/>
- IPECE — Mapas e legislação: <https://www.ipece.ce.gov.br/consulta-aos-mapas-e-legislacao/>
- IPLANFOR — Bairros de Fortaleza: <https://mapas.fortaleza.ce.gov.br/mapa/21/bairros-de-fortaleza>

Não existe, nas fontes indicadas, uma única malha oficial estadual de bairros. Por isso, a subdivisão de bairros é apresentada somente em Fortaleza; no restante do Ceará, a divisão oficial exibida é municipal. A relação territorial da planilha `DISTRI VTR (1).xlsx` vincula os 121 bairros da Capital às respectivas AIS, BPMs e CRPMs: 72 bairros pertencem ao 1º CRPM e 49 ao 5º CRPM. Caucaia recebe os dois marcadores territoriais correspondentes ao 12º e ao 26º BPM, ambos no 2º CRPM.

## Validação

```powershell
node --check mapa/map.js
node tests/validate_ceara_map.js
```
