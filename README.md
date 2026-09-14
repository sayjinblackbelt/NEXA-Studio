# NEXA Studio

> **Estúdio de Design & Comunicação Visual**
>
> Estratégia, identidade visual, design gráfico e experiências digitais para marcas que querem comunicar com clareza, consistência e personalidade.

---

## Sobre

A **NEXA Studio** é um estúdio multidisciplinar que cruza **design, estratégia, tecnologia e comunicação visual** para transformar ideias, projetos e negócios em soluções visuais profissionais.

**Manifesto:** Não criamos apenas peças. Construímos sistemas de comunicação.

## Serviços

- Branding
- Design Gráfico
- Design Digital
- Comunicação Visual
- Projetos Especiais

## Processo

**Pensar → Criar → Construir → Comunicar**

A operação interna também possui fluxo estruturado de briefing, diagnóstico, proposta, produção, QA, entrega e conclusão.

## Estrutura

```text
NEXA-Studio/
├── 01_brand/
├── 02_services/
├── 03_clients/
├── 04_projects/
├── 05_portfolio/
├── 06_templates/
├── 07_assets/
├── 08_documentation/
├── 09_proposals/
├── 10_archive/
├── backend/
├── js/
├── css/
├── tests/
├── index.html
└── studio.html
```

## Plataforma NEXA

O repositório já contém:

- site público protótipo em GitHub Pages;
- **NEXA Lab** para operação interna;
- modelo de domínio e contrato de dados v1;
- PostgreSQL schema v1;
- API v1 em Node.js;
- validação e CI automatizados;
- PostgreSQL repository;
- integração preparada para Supabase;
- migration adapter v1;
- documentação de governança, QA, segurança e manutenção.

## Status atual — 14/09/2026

**4.10.3-A — HOSTING PREPARATION / IN VALIDATION**

Gates anteriores:

- 4.10.1 — PostgreSQL Repository: **PASS**
- 4.10.2 — API → PostgreSQL Wiring: **PASS**

O Supabase **NEXA-Studio** está no plano Free, com schema v1 aplicado. A API ainda não está hospedada publicamente.

### Próximos passos

1. **4.10.3-B** — Deploy do Node.js API no Render Free;
2. **4.10.3-C** — conectar Render ao PostgreSQL/Supabase;
3. **4.10.3-D** — integrar GitHub Pages/NEXA Lab à API pública;
4. **4.10.4** — validar persistência após reinicialização e fluxo integrado;
5. **4.11** — Auth + Supabase RLS;
6. **4.12** — segurança, observabilidade e hardening;
7. **4.13** — migração controlada de dados;
8. **4.14** — beta interno;
9. **E8** — preparação comercial e lançamento final.

O roadmap detalhado está em [`08_documentation/external/current-status-and-roadmap.md`](08_documentation/external/current-status-and-roadmap.md).

## Regra financeira

**Custo alvo atual: US$0.**

Nenhum upgrade, recurso pago ou cartão deve ser adicionado sem decisão explícita.

## Status público

**INTERNAL PROTOTYPE — NOT READY FOR PUBLIC COMMERCIAL LAUNCH**

Os cases atuais são conceituais e o contato público ainda é demonstrativo. O lançamento comercial depende de casos reais aprovados, canal comercial real e conclusão dos gates técnicos.

## Autor

**Filipe G. Morais**  
Designer · Educador · Tecnologia & Comunicação Visual
