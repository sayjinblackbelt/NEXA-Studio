# NEXA Studio — System Domain Model

## Objetivo

Definir o modelo de negócio e de informação que substituirá o armazenamento exclusivamente local do NEXA Lab. Esta fase modela o sistema antes da escolha e implementação do backend.

## Princípio de modelagem

O sistema deve representar o trabalho real do studio, não apenas reproduzir as telas atuais. A interface é consequência do domínio.

## Entidades canônicas

| Entidade | Função | Relações principais |
|---|---|---|
| Client | Organização, empresa ou profissional atendido | possui Contacts e Projects |
| Contact | Pessoa ligada ao cliente | pertence a Client; participa de Projects |
| Project | Unidade central de trabalho contratado | pertence a Client; possui Briefing, Diagnosis, Proposal, Tasks, Deliverables, QA e Decisions |
| Briefing | Registro estruturado da necessidade | pertence a Project |
| Diagnosis | Leitura estratégica do problema e oportunidade | pertence a Project |
| Proposal | Proposta comercial/versionada | pertence a Project |
| Task | Unidade executável de trabalho | pertence a Project; pode ter assignee |
| Milestone | Marco relevante do projeto | pertence a Project |
| Deliverable | Entrega produzida/aprovada | pertence a Project; pode referenciar Assets |
| QAResult | Resultado de controle de qualidade | pertence a Project; registra critérios e conclusão |
| PortfolioCase | Representação pública de um projeto/case | pode referenciar Project; não deve expor dados privados por padrão |
| Asset | Arquivo ou recurso produzido/utilizado | pode estar ligado a Project, Deliverable ou PortfolioCase |
| Decision | Decisão relevante registrada | pertence a Project ou Studio |
| Note | Registro operacional/conhecimento | pertence a Project, Client ou Studio |
| Metric | Indicador agregado do studio | deriva de entidades operacionais; não é fonte primária |
| User | Identidade de acesso ao sistema | possui Role e pode ser responsável por tarefas/projetos |
| AuditEvent | Histórico de alterações relevantes | referencia entidade afetada e usuário |

## Relações essenciais

```text
Client
 ├── Contact
 └── Project
      ├── Briefing
      ├── Diagnosis
      ├── Proposal (versions)
      ├── Task
      ├── Milestone
      ├── Deliverable
      │    └── Asset
      ├── QAResult
      ├── Decision
      ├── Note
      └── PortfolioCase
           └── Asset

User ──< Task / Project participation / AuditEvent
Studio ──< Decision / Note / Metric
```

## Identidade e auditoria

Cada entidade persistente deve possuir, quando aplicável:

- `id` estável e único;
- `createdAt`;
- `updatedAt`;
- `createdBy`;
- `updatedBy`;
- `status` quando houver ciclo de vida;
- referência de auditoria para mudanças relevantes.

Exclusões físicas devem ser evitadas para registros que tenham valor histórico, comercial ou jurídico. Quando necessário, preferir arquivamento/inativação.

## O que sai do modelo atual

O MVP atual trata `Client`, `Project`, `Portfolio` e `QA` como estruturas simples no localStorage. Na arquitetura real:

- `client.projects` não será campo fonte; será relação derivada;
- Workflow será o estado do Project, não uma entidade isolada;
- QA será histórico/resultado associado ao projeto, não apenas um objeto booleano;
- PortfolioCase será separado do cadastro operacional do Project;
- briefing, diagnosis e proposal deixarão de ser somente templates e passarão a ter registros próprios;
- notas salvas localmente deverão ser substituídas por Notes persistentes e relacionadas;
- exportação JSON será ferramenta de portabilidade, não armazenamento principal.

## Dados públicos x privados

### Públicos
- nome do case;
- descrição aprovada;
- categoria;
- imagens/assets autorizados;
- resultados e créditos aprovados;
- status de publicação.

### Operacionais/privados
- contatos;
- briefing completo;
- diagnóstico;
- proposta e investimento;
- tarefas internas;
- notas internas;
- arquivos não publicados;
- dados de acesso;
- histórico e auditoria.

A publicação de um PortfolioCase deve ser uma decisão explícita; a existência de um Project não implica publicação.

## Regra arquitetural

O domínio deve ser independente da interface. A futura API/backend deverá expor operações sobre essas entidades e regras, enquanto o NEXA Lab será apenas uma das interfaces consumidoras.

## Critério de conclusão da modelagem

A fase só deve avançar para implementação de backend quando:

1. entidades estiverem definidas;
2. relações principais estiverem definidas;
3. estados e transições estiverem definidos;
4. permissões estiverem definidas;
5. histórico/auditoria estiverem definidos;
6. campos mínimos de cada entidade estiverem definidos;
7. estratégia de migração do MVP estiver definida.
