# NEXA Studio — Lifecycle & Permissions

## 1. Client lifecycle

```text
LEAD → ACTIVE → RECURRENT
  │       │
  └───────┴──→ ARCHIVED
```

- `LEAD`: contato/oportunidade ainda não convertido em operação ativa.
- `ACTIVE`: cliente com relação operacional ativa.
- `RECURRENT`: cliente com recorrência ou histórico de novos projetos.
- `ARCHIVED`: relacionamento encerrado/inativo, preservado para histórico.

Não apagar cliente que possua projetos históricos.

## 2. Project lifecycle

O fluxo principal do NEXA Studio é:

```text
BRIEFING
   ↓
DIAGNOSIS
   ↓
PROPOSAL
   ↓
PRODUCTION
   ↓
QA
   ↓
DELIVERY
   ↓
COMPLETED
```

Estados auxiliares de saúde:

- `ON_TRACK`
- `ATTENTION`
- `BLOCKED`
- `ARCHIVED`

Saúde e etapa são conceitos diferentes: um projeto pode estar em `PRODUCTION` e simultaneamente `ATTENTION`.

### Regras de transição

- Não avançar para `DIAGNOSIS` sem briefing mínimo.
- Não avançar para `PRODUCTION` sem proposta aprovada, quando houver proposta aplicável.
- Não concluir sem QA e entrega registrados.
- `BLOCKED` não é etapa; é condição de impedimento que pode ocorrer em qualquer etapa operacional.
- Reabertura de projeto concluído deve gerar histórico/auditoria.

## 3. Proposal lifecycle

```text
DRAFT → SENT → APPROVED
             └→ REJECTED
```

Cada alteração comercial relevante deve criar nova versão, preservando versões anteriores.

## 4. Task lifecycle

```text
TODO → IN_PROGRESS → REVIEW → DONE
  └──────────────→ BLOCKED
```

`BLOCKED` pode retornar para `IN_PROGRESS` sem perder o histórico do bloqueio.

## 5. Deliverable lifecycle

```text
DRAFT → INTERNAL_REVIEW → APPROVED → DELIVERED
```

Um deliverable aprovado pode ser publicado no portfolio somente mediante autorização/publication state separado.

## 6. Portfolio lifecycle

```text
DRAFT → REVIEW → PUBLISHED → ARCHIVED
```

`PUBLISHED` exige conteúdo e assets autorizados. O case público não deve depender de acesso ao conteúdo privado do projeto.

## 7. Papéis de acesso

### OWNER
Controle total do studio, usuários, configurações, dados e auditoria.

### ADMIN
Gestão operacional ampla, sem necessariamente controlar a propriedade da conta.

### EDITOR
Cria e edita clientes, projetos, tarefas, entregas, QA e conteúdo operacional permitido.

### VIEWER
Consulta informações às quais recebeu acesso; não altera registros.

### CLIENT
Acesso restrito aos próprios projetos, entregas, aprovações e informações explicitamente compartilhadas.

## 8. Matriz inicial

| Recurso | OWNER | ADMIN | EDITOR | VIEWER | CLIENT |
|---|---:|---:|---:|---:|---:|
| Studio settings | CRUD | R | - | - | - |
| Users / roles | CRUD | R/U limitado | - | - | - |
| Clients | CRUD | CRUD | CRU | R | próprio: R |
| Contacts | CRUD | CRUD | CRU | R | próprio: R limitado |
| Projects | CRUD | CRUD | CRUD | R | próprio: R limitado |
| Proposals | CRUD | CRUD | CRU | R | próprio: R/approve |
| Tasks | CRUD | CRUD | CRUD | R | - |
| Deliverables | CRUD | CRUD | CRUD | R | próprio: R/approve |
| QA | CRUD | CRUD | CRUD | R | - |
| Portfolio | CRUD | CRUD | CRU | R | - |
| Assets | CRUD | CRUD | CRUD | R | próprios compartilhados |
| Decisions / Notes | CRUD | CRUD | CRU | R conforme escopo | - |
| Metrics | CRUD | CRUD | R | R | - |
| Audit | R | R | R limitado | - | - |

`CRUD` = criar, consultar, editar e excluir/arquivar conforme regra da entidade. Na implementação real, permissões devem ser verificadas no backend, nunca somente na interface.

## 9. Escopo de acesso do cliente

O papel `CLIENT` deve ser limitado por `clientId`. Um cliente não pode consultar registros de outro cliente apenas alterando uma URL, ID ou parâmetro de interface.

## 10. Auditoria obrigatória

Registrar pelo menos:

- criação;
- alteração de status/etapa;
- alteração de proposta;
- aprovação/rejeição;
- entrega;
- publicação/despublicação de case;
- arquivamento;
- alterações de permissões;
- exclusões administrativas quando inevitáveis.
