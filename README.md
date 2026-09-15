# NEXA Studio

> **Estúdio de Design & Comunicação Visual · Design & Visual Communication Studio · Estudio de Diseño y Comunicación Visual**

## 🌐 LIVE SITE — GITHUB PAGES

### **[https://sayjinblackbelt.github.io/NEXA-Studio/](https://sayjinblackbelt.github.io/NEXA-Studio/)**

**[NEXA Lab](https://sayjinblackbelt.github.io/NEXA-Studio/studio.html)** · **[Modelos](https://sayjinblackbelt.github.io/NEXA-Studio/modelos.html)**

---

# 🇧🇷 Português

## Sobre

A **NEXA Studio** é um estúdio multidisciplinar que cruza **design, estratégia, tecnologia e comunicação visual** para transformar ideias, projetos e negócios em soluções visuais profissionais.

**Manifesto:** Não criamos apenas peças. Construímos sistemas de comunicação.

### Posicionamento

> Transformar ideias em comunicação visual que gera compreensão, conexão e valor.

### Serviços

- Branding
- Design Gráfico
- Design Digital
- Comunicação Visual
- Projetos Especiais

### Processo

**Pensar → Criar → Construir → Comunicar**

### Site público

A homepage possui experiência visual experimental/futurista, hero animado, portfolio dinâmico, **14 concept cases**, mockups, materiais de projeto, filtros e carrossel de projetos em destaque.

Os cases são **conceituais** e não representam clientes, resultados ou métricas reais.

### NEXA Lab

Workspace operacional para projetos, clientes, portfolio, workflow, QA e ferramentas. Atualmente funciona como protótipo operacional com fallback local e integração de API preparada.

### Arquitetura atual

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
├── css/
├── js/
├── tests/
├── index.html
├── studio.html
└── modelos.html
```

### Plataforma técnica

- Frontend estático publicado no GitHub Pages;
- portfolio carregado dinamicamente por `data/portfolio.json`;
- biblioteca dinâmica de modelos;
- NEXA Lab;
- API v1 em Node.js;
- PostgreSQL schema v1;
- PostgreSQL repository;
- integração preparada para Supabase;
- CI e testes automatizados;
- governança, QA, segurança e manutenção documentados;
- camada visual pública de consistência e responsividade.

## Status técnico — 15/09/2026

**4.10.3-A — HOSTING PREPARATION / IN VALIDATION**

Gates concluídos:

- 4.10.1 — PostgreSQL Repository: **PASS**
- 4.10.2 — API → PostgreSQL Wiring: **PASS**
- revisão visual pública: **IMPLEMENTED**
- portfolio: **14 concept cases**
- carrossel de destaque: **IMPLEMENTED**

O Supabase **NEXA-Studio** permanece no plano Free, com schema v1 aplicado. A API ainda não está hospedada publicamente.

### Próximas etapas

1. **4.10.3-B** — Deploy do Node.js API no Render Free;
2. **4.10.3-C** — conectar Render ao PostgreSQL/Supabase;
3. **4.10.3-D** — integrar GitHub Pages/NEXA Lab à API pública;
4. **4.10.4** — validar persistência após reinicialização e fluxo integrado;
5. **4.11** — Auth + Supabase RLS;
6. **4.12** — segurança, observabilidade e hardening;
7. **4.13** — migração controlada de dados/produto;
8. **4.14** — beta interno;
9. **E8** — preparação comercial e publicação final.

Roadmap detalhado: [`08_documentation/external/current-status-and-roadmap.md`](08_documentation/external/current-status-and-roadmap.md).

## Regra financeira

**Custo alvo atual: US$0.**

Nenhum upgrade, recurso pago ou cartão deve ser adicionado sem decisão explícita.

## Status público

**INTERNAL PROTOTYPE — NOT READY FOR PUBLIC COMMERCIAL LAUNCH**

O site utiliza concept cases e contato demonstrativo. O lançamento comercial depende de casos reais aprovados, canal comercial real e conclusão dos gates técnicos.

---

# 🇺🇸 English

## About

**NEXA Studio** is a multidisciplinary design and visual communication studio combining **design, strategy, technology and communication** to turn ideas, projects and businesses into professional visual solutions.

**Manifesto:** We do not create only individual pieces. We build communication systems.

### Positioning

> Transform ideas into visual communication that creates understanding, connection and value.

### Services

- Branding
- Graphic Design
- Digital Design
- Visual Communication
- Special Projects

### Process

**Think → Create → Build → Communicate**

### Public website

The public homepage features an experimental/futuristic visual experience, animated hero, dynamic portfolio, **14 concept cases**, mockups, project materials, filters and a featured-project carousel.

All current cases are **conceptual** and do not represent real clients, results or metrics.

### NEXA Lab

An operational workspace for projects, clients, portfolio, workflow, QA and production tools. It currently operates as an operational prototype with local fallback and a prepared API integration layer.

### Technical status — 15 Sep 2026

**4.10.3-A — HOSTING PREPARATION / IN VALIDATION**

Completed gates include PostgreSQL repository and API-to-PostgreSQL wiring. The public visual consistency pass and featured portfolio carousel are implemented. The Supabase project remains on the Free plan, with schema v1 applied. The API is not yet publicly hosted.

### Next stages

1. **4.10.3-B** — Deploy the Node.js API on Render Free;
2. **4.10.3-C** — Connect Render to Supabase/PostgreSQL;
3. **4.10.3-D** — Integrate GitHub Pages/NEXA Lab with the public API;
4. **4.10.4** — Validate persistence after restart and the integrated flow;
5. **4.11** — Auth + Supabase RLS;
6. **4.12** — Security, observability and hardening;
7. **4.13** — Controlled product/data migration;
8. **4.14** — Internal beta;
9. **E8** — Commercial preparation and final publication.

Detailed roadmap: [`08_documentation/external/current-status-and-roadmap.md`](08_documentation/external/current-status-and-roadmap.md).

### Financial rule

**Current target cost: US$0.**

No paid upgrade, paid resource or credit card should be added without an explicit decision.

### Public status

**INTERNAL PROTOTYPE — NOT READY FOR PUBLIC COMMERCIAL LAUNCH**

The website currently uses concept cases and demonstrative contact information. Commercial launch depends on approved real cases, a real commercial contact channel and completion of the technical gates.

---

# 🇪🇸 Español

## Sobre

**NEXA Studio** es un estudio multidisciplinario de diseño y comunicación visual que combina **diseño, estrategia, tecnología y comunicación** para transformar ideas, proyectos y negocios en soluciones visuales profesionales.

**Manifiesto:** No creamos solamente piezas. Construimos sistemas de comunicación.

### Posicionamiento

> Transformar ideas en comunicación visual que genere comprensión, conexión y valor.

### Servicios

- Branding
- Diseño Gráfico
- Diseño Digital
- Comunicación Visual
- Proyectos Especiales

### Proceso

**Pensar → Crear → Construir → Comunicar**

### Sitio público

La página principal presenta una experiencia visual experimental/futurista, hero animado, portfolio dinámico, **14 concept cases**, mockups, materiales de proyectos, filtros y un carrusel de proyectos destacados.

Todos los casos actuales son **conceptuales** y no representan clientes, resultados ni métricas reales.

### NEXA Lab

Espacio operativo para proyectos, clientes, portfolio, workflow, QA y herramientas de producción. Actualmente funciona como prototipo operativo con almacenamiento local de respaldo y una capa de integración API preparada.

### Estado técnico — 15/09/2026

**4.10.3-A — HOSTING PREPARATION / IN VALIDATION**

Ya están aprobados el repositorio PostgreSQL y la conexión API → PostgreSQL. La revisión de consistencia visual pública y el carrusel de proyectos destacados están implementados. El proyecto Supabase continúa en el plan Free, con el schema v1 aplicado. La API todavía no está alojada públicamente.

### Próximas etapas

1. **4.10.3-B** — Publicar la API Node.js en Render Free;
2. **4.10.3-C** — Conectar Render con Supabase/PostgreSQL;
3. **4.10.3-D** — Integrar GitHub Pages/NEXA Lab con la API pública;
4. **4.10.4** — Validar persistencia después de reinicios y el flujo integrado;
5. **4.11** — Auth + Supabase RLS;
6. **4.12** — Seguridad, observabilidad y hardening;
7. **4.13** — Migración controlada de datos/producto;
8. **4.14** — Beta interna;
9. **E8** — Preparación comercial y publicación final.

Roadmap detallado: [`08_documentation/external/current-status-and-roadmap.md`](08_documentation/external/current-status-and-roadmap.md).

### Regla financiera

**Costo objetivo actual: US$0.**

No se debe añadir ninguna actualización, recurso de pago o tarjeta sin una decisión explícita.

### Estado público

**INTERNAL PROTOTYPE — NOT READY FOR PUBLIC COMMERCIAL LAUNCH**

El sitio utiliza actualmente casos conceptuales y un contacto demostrativo. El lanzamiento comercial depende de casos reales aprobados, un canal comercial real y la finalización de los gates técnicos.

---

## 🔗 Links / Links / Enlaces

- **LIVE SITE:** https://sayjinblackbelt.github.io/NEXA-Studio/
- **NEXA Lab:** https://sayjinblackbelt.github.io/NEXA-Studio/studio.html
- **Modelos:** https://sayjinblackbelt.github.io/NEXA-Studio/modelos.html
- **Repository:** https://github.com/sayjinblackbelt/NEXA-Studio

## Autor / Author / Autor

**Filipe G. Morais**  
Designer · Educator · Technology & Visual Communication
