---
slug: multi-agentes-ia-personalidade-openclaw
title: "Eu criei um time de IAs com personalidades diferentes — e elas conversam entre si no Slack"
author: Thiago Sciotta
author_title: Principal Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [ia, agentes, multi-agent, openclaw, slack, automação, llm]
image: https://images.unsplash.com/photo-1531746790095-e5a970354768?w=1200
enableComments: true
---

A maioria das pessoas usa IA como um assistente genérico. Um ChatGPT aberto numa aba, respondendo qualquer coisa que você joga. Funciona? Funciona. Mas é como ter uma empresa onde todo mundo tem o mesmo cargo e a mesma descrição de trabalho.

Eu queria algo diferente: **um time de agentes de IA, cada um com personalidade e especialidade própria**, conversando entre si num canal do Slack como se fossem colegas de trabalho. E consegui.

<!--truncate-->

## O problema com "um agente pra tudo"

Quando você usa um único agente de IA, acontece algo previsível: ele tenta ser bom em tudo e acaba sendo medíocre em muita coisa. Pede pra ele escrever um post de marketing e em seguida revisar um PR — o contexto se mistura, o tom escorrega, e você acaba gastando mais tempo corrigindo do que teria gasto fazendo sozinho.

O problema não é a capacidade do modelo. É a **falta de escopo**. Humanos não trabalham assim — a gente cria times com papéis definidos. Por que com IA seria diferente?

## A ideia: um C-level inteiro de agentes

Inspirado na estrutura clássica de uma empresa de tecnologia, criei quatro agentes:

| Agente | Papel | Personalidade |
|--------|-------|---------------|
| **Tim** 🎤 | CEO / Coordenação | Calmo, metódico, direto. O maestro que orquestra. |
| **Steve** 🍎 | Produto & Marketing | Visionário, persuasivo, obsessivo com narrativa. |
| **John** 🎨 | Design & UX | Perfeccionista, minimalista, defende o usuário. |
| **Woz** 💻 | Engenharia | Pragmático, profundo, resolve problemas complexos. |

Cada um tem seu próprio workspace, sua própria memória, e — crucialmente — sua **própria personalidade definida via `SOUL.md`**.

## Como funciona na prática

A stack é surpreendentemente simples. Uso o [OpenClaw](https://github.com/openclaw/openclaw), um runtime open-source para agentes de IA que roda no seu servidor (no meu caso, uma EC2 na AWS).

### 1. Cada agente é isolado

No OpenClaw, um "agente" é uma unidade completa:

- **Workspace próprio** com arquivos de contexto (`SOUL.md`, `AGENTS.md`, `USER.md`)
- **Diretório de estado** separado (auth, sessões, memória)
- **Modelo configurável** — posso ter um agente rodando Opus pra tarefas complexas e outro rodando Sonnet pra respostas rápidas

A configuração fica no `openclaw.json`:

```json5
{
  agents: {
    list: [
      {
        id: "tim",
        name: "Tim",
        workspace: "~/.openclaw/workspace",
        model: "anthropic/claude-opus-4-6"
      },
      {
        id: "steve",
        name: "Steve",
        workspace: "~/.openclaw/workspace-steve",
        model: "anthropic/claude-sonnet-4-5"
      },
      {
        id: "john",
        name: "John",
        workspace: "~/.openclaw/workspace-john",
        model: "anthropic/claude-sonnet-4-5"
      },
      {
        id: "woz",
        name: "Woz",
        workspace: "~/.openclaw/workspace-woz",
        model: "anthropic/claude-opus-4-6"
      }
    ]
  }
}
```

### 2. Personalidade via SOUL.md

Aqui é onde a mágica acontece. Cada agente tem um arquivo `SOUL.md` no seu workspace que define **quem ele é**. Não é um system prompt genérico — é uma identidade completa.

Exemplo do `SOUL.md` do Steve (o agente de marketing):

```markdown
# SOUL.md - Steve 🍎

_O visionário. O cara que transforma features em histórias._

## Quem Você É

Você é o Steve, inspirado em Steve Jobs. A interface entre
o produto e o mundo. Sua obsessão não é com tecnologia —
é com a experiência que a tecnologia cria.

## Traços de Personalidade

- Storyteller nato. Não descreve features, cria narrativas.
- Perfeccionista com a mensagem — cada palavra importa.
- Provocador. Desafia o status quo.
- Pensa do ponto de vista do usuário, sempre.
```

O resultado? Quando peço pro Steve escrever um post de LinkedIn, o tom é completamente diferente de quando o Tim (CEO) escreve um relatório. Não preciso ficar ajustando prompts — a personalidade já está internalizada.

### 3. Cada agente conectado ao Slack

Cada agente tem sua própria conta no Slack (um bot por agente), roteado via bindings:

```json5
{
  bindings: [
    { agentId: "tim", match: { channel: "slack", accountId: "tim" } },
    { agentId: "steve", match: { channel: "slack", accountId: "steve" } },
    { agentId: "john", match: { channel: "slack", accountId: "john" } },
    { agentId: "woz", match: { channel: "slack", accountId: "woz" } }
  ]
}
```

No Slack, cada agente aparece como um usuário diferente — com nome e avatar próprios. Posso mandar DM pro Tim pra coordenar, pro Steve pra revisar um texto, pro Woz pra debugar um problema.

### 4. O que muda na prática

Antes: eu abria o ChatGPT, escrevia um prompt longo explicando o contexto, o tom, o objetivo, e torcia pro resultado ficar bom.

Agora: mando uma mensagem no Slack — "Steve, preciso de um post sobre nosso novo feature" — e recebo de volta um texto com a voz do Steve. Se preciso de revisão técnica, jogo pro Woz. Se preciso alinhar prioridades, falo com o Tim.

**É delegação real.** Não é "usar IA". É **gerenciar um time**.

## O que aprendi montando isso

### Personalidade importa mais do que prompt

A diferença entre um prompt genérico e um `SOUL.md` bem escrito é brutal. Quando você define personalidade, valores, tom de comunicação, e — igualmente importante — **o que o agente NÃO é**, as respostas ficam consistentes e úteis.

O Tim nunca tenta ser engraçado. O Steve nunca é técnico demais. O Woz nunca enrola. Cada um respeita seu papel.

### Isolamento é essencial

Se todos os agentes compartilhassem o mesmo workspace e sessões, as personalidades se contaminariam. O OpenClaw resolve isso dando a cada agente:

- Workspace isolado (arquivos de contexto separados)
- Diretório de estado separado (auth e sessões)
- Memória independente (cada um tem seus próprios `memory/*.md`)

Isso significa que o Steve não sabe o que o Woz discutiu ontem, a menos que eu explicitamente compartilhe. Como num time real.

### Modelos diferentes pra papéis diferentes

Nem todo agente precisa do modelo mais caro. O Steve (marketing) roda no Sonnet — rápido, bom com texto, custo menor. O Woz (engenharia) roda no Opus — mais lento, mas melhor pra raciocínio complexo e código. O Tim (coordenação) roda no Opus porque precisa tomar decisões que consideram múltiplos fatores.

Otimizar o modelo por papel economiza tokens sem sacrificar qualidade onde importa.

### A barreira de entrada caiu

Há seis meses, montar algo assim exigiria semanas de código, infra complexa e muita cola entre APIs. Hoje, com OpenClaw, é:

1. `openclaw agents add steve` — cria o workspace
2. Escreve o `SOUL.md` — define a personalidade
3. Configura o binding pro Slack — conecta o canal
4. `openclaw gateway restart` — pronto

Quatro passos. Nenhuma linha de código. Nenhum framework.

## O futuro é multi-agente

A conversa sobre IA ainda está presa no paradigma do "assistente único". Um chatbot. Uma interface. Uma personalidade.

Mas a realidade do trabalho é colaborativa. Nenhuma pessoa faz tudo sozinha — e nenhum agente deveria. Quando você dá a cada agente um papel claro, uma personalidade definida e as ferramentas certas, o resultado é algo que se parece menos com "usar IA" e mais com **liderar um time**.

Se você é dev e ainda não experimentou multi-agentes: tá perdendo tempo. O setup leva uma tarde. O ganho de produtividade é permanente.

---

*O código é open-source. O OpenClaw roda em qualquer servidor Linux. A documentação tá em [docs.openclaw.ai](https://docs.openclaw.ai). Se quiser trocar ideia sobre a arquitetura, me chama no [LinkedIn](https://www.linkedin.com/in/sciotta/).*
