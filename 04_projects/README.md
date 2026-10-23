# Projetos

Área central de produção e documentação dos projetos da NEXA Studio e do portfólio de desenvolvimento.

## Projetos de desenvolvimento

### FinTrack Lite — Python

Aplicação web de controle financeiro pessoal com receitas, despesas, indicadores, gráficos, importação/exportação CSV e testes automatizados.

- [README e instruções de execução](fintrack-lite/README.md)
- [Aplicação Streamlit](fintrack-lite/app.py)
- [Funções e regras de negócio](fintrack-lite/finance.py)
- [Testes automatizados](fintrack-lite/tests/test_finance.py)

**Tecnologias:** Python · Streamlit · Pandas · Pytest  
**Status:** MVP inicial publicado no repositório.

## Projeto anexado — Desafio do Dia

`desafio-do-dia/` preserva o sistema visual e a referência de interface do projeto educacional gamificado **Desafio do Dia**, incluindo HTML, CSS principal, estilos complementares, metas e conquistas.

- [README do projeto](desafio-do-dia/README.md)
- [Referência visual](desafio-do-dia/index.html)
- [CSS principal](desafio-do-dia/style.css)
- [CSS — desafio diário e histórico](desafio-do-dia/enhancements.css)
- [CSS — metas](desafio-do-dia/goals.css)
- [CSS — conquistas](desafio-do-dia/badges.css)

**Classificação:** projeto educacional / experimental · não comercial.

## Estrutura padrão de projetos NEXA Studio

```text
04_projects/
└── NEXA_Projeto_Nome/
    ├── README.md
    ├── 01_discovery/
    ├── 02_strategy/
    ├── 03_concept/
    ├── 04_design/
    ├── 05_revision/
    ├── 06_approval/
    ├── 07_delivery/
    └── 08_case/
```

## Status de projetos

`BACKLOG` → `BRIEFING` → `STRATEGY` → `CONCEPT` → `PRODUCTION` → `REVIEW` → `APPROVAL` → `DELIVERY` → `CASE` → `COMPLETED` → `ARCHIVED`

## Versionamento

Usar `v01`, `v02`, `v03` etc. para versões de trabalho. Após aprovação, distinguir claramente a versão aprovada e a versão efetivamente entregue.

Evitar nomes ambíguos como `final_final2`.
