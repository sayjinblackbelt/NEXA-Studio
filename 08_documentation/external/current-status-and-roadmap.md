# NEXA Studio — Status Atual e Roadmap de Implementação

**Data de referência:** 15/09/2026

## 1. Status executivo

**NEXA Studio — infraestrutura em implementação.**

O projeto possui posicionamento de marca, operação documentada, site público protótipo, NEXA Lab, biblioteca de modelos, portfolio dinâmico com 14 concept cases, carrossel de projetos em destaque, sistema visual público consistente, modelo de domínio, contrato de dados, schema PostgreSQL, API v1, validações, CI, repositório PostgreSQL e conexão lógica com Supabase.

A implementação ainda **não está pronta para uso comercial público** porque o backend ainda não foi hospedado publicamente, a integração Lab → API pública não foi validada e autenticação/RLS ainda não foram implementados.

## 2. O que já está concluído

### Fundação e operação

- fases internas 1–11 estruturadas e documentadas;
- posicionamento, serviços, processos, QA, governança, métricas e manutenção definidos;
- site público protótipo e NEXA Lab implementados;
- biblioteca dinâmica de modelos implementada;
- separação entre conteúdo público e operação interna definida.

### Experiência pública

- homepage com direção visual experimental/futurista;
- portfolio carregado dinamicamente a partir de `data/portfolio.json`;
- 14 concept cases;
- mockups e materiais expandidos para os principais cases;
- carrossel de projetos em destaque com navegação, autoplay, indicadores e suporte mobile;
- camada de consistência visual para contraste, grid, espaçamento, mockups, tipografia, elementos técnicos, mobile e reduced motion;
- status de protótipo explicitado no conteúdo público.

### Documentação

- README trilingue (Português / English / Español);
- link do site GitHub Pages em destaque no README;
- links para NEXA Lab, Modelos e repositório;
- status e roadmap sincronizados em 15/09/2026.

### Arquitetura e dados

- modelo de entidades e relacionamentos definido;
- lifecycle e permissões definidos;
- data contract v1 definido;
- API v1 definida;
- PostgreSQL schema v1 preparado;
- migration adapter v1 implementado e testado;
- estratégia de persistência e migração documentada.

### Backend

- Node.js API base implementada;
- domínio de projetos e transições implementado;
- validação de payloads e erros implementada;
- CORS configurável;
- CI automatizado;
- PostgreSQL repository implementado;
- data layer seleciona PostgreSQL quando `DATABASE_URL` existe e MemoryRepository como fallback;
- servidor preparado para hospedagem externa com `HOST=0.0.0.0`.

### Supabase

- projeto **NEXA-Studio** criado no plano Free;
- região São Paulo;
- schema v1 aplicado;
- 16 tabelas validadas;
- nenhum upgrade pago realizado.

## 3. Gate atual

### 4.10.1 — PostgreSQL Repository

**PASS**

### 4.10.2 — API → PostgreSQL wiring

**PASS**

### 4.10.3-A — Hosting preparation

**IN VALIDATION**

A preparação para hosting está implementada. A camada visual pública, o portfolio de 14 concept cases, o carrossel de destaque e a documentação pública trilingue também estão implementados. O próximo gate objetivo é o deploy da API.

## 4. Próximos passos

```text
4.10.3-A  Preparação para hosting        ← ATUAL
     ↓
4.10.3-B  Deploy Render Free
     ↓
4.10.3-C  Render → Supabase PostgreSQL
     ↓
4.10.3-D  GitHub Pages/Lab → API pública
     ↓
4.10.4    Teste integrado + persistência
     ↓
4.11      Auth + Supabase RLS
     ↓
4.12      Segurança, observabilidade e hardening
     ↓
4.13      Migração controlada de dados/produto
     ↓
4.14      Beta interno
     ↓
E8        Preparação comercial/publicação final
```

## 5. Critérios de aprovação

### 4.10.3-B

- serviço público responde `/health`;
- serviço permanece no plano Free;
- variáveis configuradas sem secrets no GitHub;
- logs de inicialização sem exposição de credenciais.

### 4.10.3-C

- `/health` informa `persistence: postgres`;
- criação de cliente funciona;
- criação de projeto funciona;
- transições funcionam;
- registros aparecem no Supabase.

### 4.10.3-D

- Lab acessa API pública;
- CORS funciona somente para origens permitidas;
- criação/edição no Lab chega ao backend;
- fallback local não mascara falhas da integração sem sinalização clara.

### 4.10.4

- reinicialização do backend não perde dados;
- fluxo completo é validado;
- testes automatizados permanecem verdes;
- nenhum dado real de cliente é introduzido antes do controle de acesso.

### 4.11

- Supabase Auth;
- roles OWNER/ADMIN/EDITOR/VIEWER/CLIENT;
- isolamento por cliente;
- RLS;
- assets privados por padrão;
- API não confia em `clientId` ou role enviados pelo frontend.

## 6. Estado do produto público

**INTERNAL PROTOTYPE — NOT READY FOR PUBLIC COMMERCIAL LAUNCH**

O site continua usando casos conceituais e contato demonstrativo. Isso é intencional até que existam casos reais aprovados, canal comercial real e validação final.

## 7. Regra financeira

Até nova decisão explícita:

**Custo alvo = US$0.**

Nenhum upgrade, recurso pago ou cartão deve ser adicionado automaticamente.

## 8. Definição de “implementado”

A implementação técnica será considerada pronta para beta interno quando:

1. API pública estiver hospedada;
2. API estiver conectada ao PostgreSQL/Supabase real;
3. Lab estiver integrado à API pública;
4. persistência estiver comprovada após reinicialização;
5. Auth/RLS estiverem ativos;
6. testes de segurança e integração estiverem aprovados;
7. documentação e operação de backup/recuperação estiverem definidas.

Só então avançaremos para uso com dados reais e preparação comercial.
