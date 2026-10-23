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

### TaskFlow Python — Python

Gerenciador de tarefas com Streamlit e SQLite, incluindo criação, filtros, conclusão, exclusão e testes automatizados.

- [README e instruções de execução](taskflow-python/README.md)
- [Aplicação Streamlit](taskflow-python/app.py)
- [Persistência e regras de tarefas](taskflow-python/task_store.py)
- [Testes automatizados](taskflow-python/tests/test_task_store.py)

**Tecnologias:** Python · Streamlit · SQLite · Pytest  
**Status:** MVP inicial publicado no repositório.

### QuizLab — Python

Aplicação de quiz de múltipla escolha com perguntas em JSON, correção automática, explicações e testes automatizados.

- [README e instruções de execução](quizlab/README.md)
- [Aplicação Streamlit](quizlab/app.py)
- [Motor de perguntas e pontuação](quizlab/quiz_engine.py)
- [Banco de perguntas de demonstração](quizlab/data/questions.json)
- [Testes automatizados](quizlab/tests/test_quiz_engine.py)

**Tecnologias:** Python · Streamlit · JSON · Pytest  
**Status:** MVP inicial publicado no repositório.

### DataClean Mini — Python

Ferramenta para explorar e limpar arquivos CSV com Pandas, incluindo análise de valores ausentes, padronização de colunas, remoção de espaços e duplicatas e exportação.

- [README e instruções de execução](dataclean-mini/README.md)
- [Aplicação Streamlit](dataclean-mini/app.py)
- [Funções de limpeza de dados](dataclean-mini/cleaner.py)
- [CSV fictício para demonstração](dataclean-mini/sample_dirty.csv)
- [Testes automatizados](dataclean-mini/tests/test_cleaner.py)

**Tecnologias:** Python · Pandas · Streamlit · Pytest  
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
