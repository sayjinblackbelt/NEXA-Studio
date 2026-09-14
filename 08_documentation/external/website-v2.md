# NEXA Studio — Website V2

## Status

**PROTOTYPE — E3 Website / Experiência Digital**

## Public Architecture

1. Home — NEXA Studio / Ideias ganham forma.
2. Manifesto — design, estratégia e comunicação.
3. Selected Work — prototype cases until real projects are available.
4. Capabilities — Branding, Design Gráfico, Design Digital, Comunicação Visual, Projetos Especiais.
5. Process — Pensar → Criar → Construir → Comunicar.
6. Principles — selected principles of the studio.
7. Contact — direct invitation to start a project.
8. Modelos — biblioteca dinâmica de templates reutilizáveis.
9. NEXA Lab — workspace operacional/protótipo interno.

## Dynamic Models Library

The public Pages layer includes `modelos.html`, backed by `data/modelos.json` and `js/modelos.js`.

The library supports search, category filters, sorting, model preview, copy and `Usar modelo` handoff to the NEXA Lab through localStorage and URL parameters.

Initial models cover briefing, diagnosis, proposal, portfolio case, social media briefing and project README.

The catalog is data-driven: new models can be added to the JSON catalog without rewriting the page structure.

## Prototype Rule

Prototype cases remain clearly identified as fictional until approved real portfolio cases replace them.

## QA Gate

Before public launch, check desktop/mobile, navigation, links, accessibility basics, performance, prototype labeling, dynamic JSON loading, preview/copy actions, Lab handoff and GitHub Pages publication.
