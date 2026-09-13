# Status do Cliente

## Estados

| Status | Significado |
|---|---|
| `LEAD` | Novo contato ou oportunidade ainda não avaliada. |
| `CONTACTED` | Primeiro contato realizado; aguardando ou conduzindo conversa. |
| `QUALIFIED` | Necessidade e aderência avaliadas. |
| `PROPOSAL` | Proposta em elaboração ou negociação. |
| `ACTIVE` | Cliente com projeto em andamento. |
| `COMPLETED` | Projeto concluído e entregue. |
| `FOLLOW-UP` | Pós-projeto ou acompanhamento. |
| `RECURRENT` | Cliente com relacionamento recorrente. |
| `INACTIVE` | Sem projeto ou oportunidade ativa no momento. |

## Regra

O status representa o **estado do relacionamento**, não o estado de um projeto específico.

Projetos devem usar o sistema de status definido em `04_projects/`.
