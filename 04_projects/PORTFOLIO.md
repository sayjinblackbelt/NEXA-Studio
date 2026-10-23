# Portfólio de desenvolvimento — NEXA Studio

Cinco MVPs em Python foram implementados no repositório e executados localmente no macOS. Os resultados de testes abaixo refletem os comandos executados durante a validação inicial; não significam auditoria completa nem validação de produção.

## Projetos

| Projeto | Objetivo | Stack | Testes relatados |
|---|---|---|---:|
| [FinTrack Lite](fintrack-lite/README.md) | Controle financeiro pessoal com CSV e gráficos | Python, Streamlit, Pandas | 4 aprovados |
| [TaskFlow Python](taskflow-python/README.md) | Gerenciamento de tarefas com persistência SQLite | Python, Streamlit, SQLite | 5 aprovados |
| [QuizLab](quizlab/README.md) | Quiz de múltipla escolha com correção automática | Python, Streamlit, JSON | 5 aprovados |
| [DataClean Mini](dataclean-mini/README.md) | Inspeção e limpeza de arquivos CSV | Python, Streamlit, Pandas | 5 aprovados |
| [FileOrganizer](fileorganizer/README.md) | Organiza arquivos por extensão com prévia e confirmação | Python, Streamlit, pathlib, shutil | 6 aprovados |

## Executar localmente

Cada projeto tem seu próprio `README.md`, `requirements.txt`, ambiente virtual e testes. Exemplo para o FileOrganizer:

```bash
cd 04_projects/fileorganizer
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m pytest -q
python -m streamlit run app.py
```

## Sobre a publicação web

O GitHub Pages pode hospedar páginas estáticas HTML, CSS e JavaScript — por exemplo, uma página de portfólio que apresenta os cinco projetos e encaminha para seus repositórios e instruções. Ele não executa os aplicativos Streamlit/Python. Para disponibilizar cada aplicativo interativamente na internet, será necessário hospedar cada app em uma plataforma que execute Python, configurar suas dependências e revisar dados, segurança e custos.

## Estado de validação

- Testes unitários locais executados com sucesso nos cinco projetos.
- Interfaces Streamlit foram abertas localmente; a interface do FileOrganizer também foi conferida e a organização de quatro arquivos de teste foi confirmada pelo usuário.
- Validação profunda, segurança, tratamento de casos extremos, persistência e publicação dos apps ainda são etapas futuras.
