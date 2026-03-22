---
slug: triagem-automatica-sentry-linear-claude-copilot
title: "Automatizei a triagem de bugs: Sentry detecta, Linear organiza, Copilot resolve"
author: Thiago Sciotta
author_title: Principal Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [ia, automação, sentry, linear, mcp, claude-code, devops, agentes]
image: https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200
enableComments: true
---

Todo desenvolvedor conhece o ciclo: erro acontece em produção, alguém percebe (ou não), alguém abre uma issue (ou esquece), alguém investiga (eventualmente), alguém corrige (um dia). Cada etapa desse fluxo depende de um humano lembrar de fazer algo. E humanos esquecem.

Eu montei um pipeline onde **nenhum humano precisa lembrar de nada**. O Sentry detecta o erro, o Claude Code cria a issue no Linear, e o GitHub Copilot abre um PR com a correção. Tudo automático, todo dia às 9h da manhã.

<!--truncate-->

## O problema: bugs que ninguém triou

No [123gas](https://123gas.com.br), nosso painel admin multi-tenant para revendas de gás, temos Sentry configurado capturando erros de produção. O problema é que esses erros ficam lá, acumulando, até alguém lembrar de olhar o dashboard.

A triagem manual é tediosa:
1. Abrir o Sentry
2. Filtrar issues novas
3. Ler stacktrace
4. Criar issue no Linear
5. Descrever o problema
6. Atribuir pra alguém

São 10 minutos por issue. Com 4 issues por dia, é quase uma hora perdida em trabalho burocrático que poderia ser automatizado.

## A solução: um agente de triagem com Claude Code

O Claude Code tem uma feature de **Scheduled Tasks** — basicamente cron jobs que rodam prompts automaticamente. Combinei isso com os MCP connectors do Sentry e do Linear pra criar um pipeline completo:

```
┌──────────┐     MCP      ┌─────────────┐     MCP      ┌──────────┐
│  Sentry  │◄────────────►│ Claude Code │◄────────────►│  Linear  │
│  (erros) │  search +    │ (scheduled  │  create +    │ (issues) │
│          │  details     │   task)     │  delegate    │          │
└──────────┘              └──────┬──────┘              └─────┬────┘
                                │                            │
                          Slack │                    GitHub   │
                          webhook                    Copilot │
                                ▼                            ▼
                         ┌──────────┐              ┌──────────┐
                         │ #develop │              │   Pull   │
                         │  -board  │              │ Request  │
                         └──────────┘              └──────────┘
```

### O fluxo em 7 passos

A cada execução, o agente:

1. **Busca issues novas no Sentry** — últimas 24h, todas as severidades
2. **Verifica duplicatas no Linear** — evita criar a mesma issue duas vezes
3. **Coleta detalhes** — stacktrace, metadata, contexto do erro
4. **Cria issue no Linear** — com título, descrição formatada, link do Sentry e prioridade mapeada
5. **Delega ao GitHub Copilot** — o agente do Copilot no Linear recebe a issue e cria um PR automaticamente
6. **Comenta na issue** — instrui o Copilot sobre o que investigar no código
7. **Notifica no Slack** — resumo com links diretos pro Linear e Sentry

### Mapeamento de prioridade

O agente traduz automaticamente o nível do Sentry pra prioridade do Linear:

| Sentry Level | Linear Priority |
|-------------|----------------|
| fatal | Urgent |
| error | High |
| warning | Normal |
| info | Low |

## Como montar na prática

### Pré-requisitos

Você precisa de:
- **Claude Code** (CLI ou Desktop)
- **MCP connector do Sentry** configurado
- **MCP connector do Linear** configurado
- **Slack webhook** (opcional, pra notificações)
- **GitHub Copilot** habilitado como agente no Linear

### Passo 1: A Scheduled Task

No Claude Code, crie uma scheduled task com o seguinte prompt (adapte os valores entre `{chaves}` pro seu projeto):

```markdown
Você é um agente de triagem automática. Sua tarefa é buscar issues novas
no Sentry, criar issues correspondentes no Linear, delegar ao GitHub
Copilot, e notificar no Slack.

## Passo 1: Buscar issues novas no Sentry

Use search_issues com:
- organizationSlug: "{SUA_ORG_SENTRY}"
- projectSlugOrId: "{SEU_PROJETO_SENTRY}"
- naturalLanguageQuery: "unresolved issues first seen in the last 24 hours"
- limit: 25

## Passo 2: Verificar duplicatas no Linear

Para cada issue encontrada, antes de criar no Linear, use list_issues com:
- query: "[Sentry] {titulo da issue do Sentry}"

Se já existir uma issue com mesmo título prefixado com [Sentry], PULE.

## Passo 3: Obter detalhes de cada issue nova

Para cada issue não-duplicata, use get_issue_details para obter
stacktrace e metadata.

## Passo 4: Criar issue no Linear

Use save_issue com:
- title: "[Sentry] {titulo original}"
- description: Markdown com stacktrace, contexto, link do Sentry
- team: "{SEU_TEAM_LINEAR}"
- project: "{SEU_PROJETO_LINEAR}"
- labels: ["bug"]
- priority: Mapear (fatal→1, error→2, warning→3, info→4)
- links: [{url: URL_SENTRY, title: "Sentry Issue"}]
- delegate: "GitHub Copilot"

## Passo 5: Comentar na issue

Adicione um comentário instruindo o Copilot a analisar o stacktrace
e criar um PR com a correção.

## Passo 6: Notificar no Slack

Envie via webhook um resumo com as issues criadas (ou aviso de
que não houve issues novas).

## Regras

- Nunca crie issues duplicatas no Linear
- Sempre inclua o link do Sentry na issue
- Sempre delegue ao GitHub Copilot
- Sempre notifique no Slack, mesmo sem issues novas
```

### Passo 2: Permissões

Ponto crucial que quase me pegou: **scheduled tasks rodam sem supervisão**. Se as ferramentas MCP não estiverem pré-autorizadas, a task trava esperando aprovação e ninguém está lá pra aprovar.

No `.claude/settings.local.json`, adicione:

```json
{
  "permissions": {
    "allow": [
      "mcp__sentry__search_issues",
      "mcp__sentry__get_issue_details",
      "mcp__linear__save_issue",
      "mcp__linear__list_issues",
      "mcp__linear__list_teams",
      "mcp__linear__save_comment",
      "Bash(curl -s -X POST -H 'Content-Type: application/json':*)"
    ]
  }
}
```

> **Nota:** Os IDs dos MCP connectors variam por instalação. Substitua pelos IDs que aparecem no seu ambiente.

### Passo 3: Agendar

```bash
# Via Claude Code, crie a scheduled task:
# taskId: sentry-to-linear-triage
# cronExpression: "0 9 * * *"  (9h todos os dias, horário local)
```

## O resultado real

Na primeira execução de teste, o agente encontrou **4 issues** no Sentry — todas variações do mesmo bug (`UPDATE requires a WHERE clause` em diferentes services). Em menos de 2 minutos:

- 4 issues criadas no Linear com stacktrace completo
- 4 issues delegadas ao GitHub Copilot
- 1 mensagem no Slack com links pra cada issue

A notificação no Slack fica assim:

```
🔍 Triagem Sentry → Linear
4 issue(s) nova(s) encontrada(s) nas ultimas 24h
────────────────────────────────────
• [High] Erro ao atualizar configurações: UPDATE requires a WHERE clause
   Ver no Linear | Ver no Sentry
• [High] Erro ao atualizar organização: UPDATE requires a WHERE clause
   Ver no Linear | Ver no Sentry
...
────────────────────────────────────
GitHub Copilot foi delegado para criar PRs automaticamente
```

Quando não tem issues novas:

```
✅ Triagem Sentry → Linear
Nenhuma issue nova encontrada nas ultimas 24h. Tudo limpo! 🎉
```

## Limitações honestas

Nem tudo são flores:

1. **Requer Claude Code aberto** — as scheduled tasks rodam localmente, não na nuvem. Se seu Mac estiver desligado às 9h, a task não roda (mas executa quando você abrir o Claude depois).

2. **Copilot nem sempre acerta** — o PR automático é um ponto de partida, não a solução final. Ainda precisa de review humano. Mas ter o PR aberto com uma primeira tentativa economiza muito tempo de investigação.

3. **Deduplicação por título** — a checagem de duplicatas compara títulos. Se o Sentry agrupar o mesmo erro com títulos diferentes, pode gerar issues duplicadas no Linear.

4. **Custo de API** — cada execução consome tokens do Claude (Sonnet). Com 4-5 issues por dia, o custo é negligível, mas vale monitorar.

## Por que isso importa

O ponto não é que cada peça é revolucionária — Sentry, Linear, Copilot, Slack, tudo já existia. O que muda é a **orquestração**. O Claude Code com MCP connectors funciona como a cola que conecta ferramentas que antes viviam isoladas.

Antes, a triagem de bugs era uma responsabilidade difusa que todo mundo empurrava pra depois. Agora é um processo que roda sozinho, todo dia, sem depender da boa vontade de ninguém.

O ciclo de feedback encurtou de **dias para minutos**: erro acontece → Sentry captura → Claude triagem → Linear organiza → Copilot investiga → PR aberto → dev revisa.

É o tipo de automação que não dá pra voltar atrás depois que você experimenta.

---

*A skill completa (sanitizada, sem dados sensíveis) está disponível como template. Se quiser adaptar pro seu projeto, é só trocar os placeholders pelos seus dados.*
