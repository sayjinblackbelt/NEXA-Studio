# NEXA Studio — Backend Architecture Decision

## Status

`PROPOSED — Phase 3`

## Decision

Não implementar backend imediatamente. Primeiro consolidar o modelo de domínio e os contratos de dados. A arquitetura do backend será escolhida a partir das necessidades reais identificadas neste modelo.

## Motivo

O NEXA Lab atual é um MVP local em `localStorage`, útil para validar interface, fluxo e regras básicas. Transformá-lo diretamente em backend poderia cristalizar entidades incompletas e gerar retrabalho.

## Requisitos mínimos da futura arquitetura

- autenticação segura;
- autorização por papel e escopo de cliente;
- banco de dados persistente;
- API ou camada de serviço para regras de negócio;
- validação server-side;
- auditoria de alterações relevantes;
- versionamento de propostas e registros que exigem histórico;
- armazenamento de assets separado do banco quando apropriado;
- backup e recuperação;
- logs operacionais sem exposição desnecessária de dados sensíveis;
- exportação/importação para portabilidade;
- possibilidade de evolução para portal do cliente.

## Separação de responsabilidades

```text
NEXA Lab / futuras interfaces
            ↓
       API / Services
            ↓
     Domain rules + Auth
            ↓
        Database
       ↙         ↘
  File storage   Audit/Logs
```

A interface não deve ser a autoridade final sobre permissões, estados ou integridade dos dados.

## Estratégia de migração

### Estado atual

`localStorage → modelo MVP`

### Estado intermediário

`modelo canônico → camada de persistência → seed/demo data`

### Estado futuro

`NEXA Lab → API autenticada → banco persistente`

### Regra de migração

Os dados demonstrativos atuais podem servir como seed/protótipo, mas não devem ser tratados como dados reais de clientes. A migração deve mapear explicitamente os campos existentes para as novas entidades.

## Critérios para escolher a tecnologia

A decisão técnica deve considerar:

1. simplicidade de manutenção;
2. custo inicial e recorrente;
3. autenticação e autorização maduras;
4. banco relacional adequado às relações do domínio;
5. armazenamento de arquivos;
6. facilidade de integração com frontend estático/hosting atual;
7. backups e observabilidade;
8. possibilidade de crescimento sem reescrita prematura.

## O que não fazer nesta fase

- não colocar dados reais de clientes no localStorage;
- não adicionar autenticação apenas no frontend;
- não escolher tecnologia de backend por moda;
- não transformar cada tela em uma tabela sem modelo de domínio;
- não remover a capacidade de exportação/portabilidade;
- não considerar o MVP atual como arquitetura definitiva.

## Próxima etapa

Definir o **contrato de dados**: campos mínimos, tipos, identificadores, obrigatoriedade, valores permitidos, regras de integridade e exemplos de registros para cada entidade canônica.
