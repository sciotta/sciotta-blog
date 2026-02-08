---
slug: design-patterns-guia-pratico
title: Design Patterns na Prática - Guia Completo com TypeScript
author: Thiago Sciotta
author_title: Principal Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [typescript, arquitetura, design-patterns, boas-praticas]
image: https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200
enableComments: true
---

Se você já se pegou reescrevendo código parecido pela terceira vez, ou lutando para entender aquela classe gigante que faz "tudo", provavelmente está na hora de conhecer **Design Patterns**. Não como teoria acadêmica distante, mas como ferramentas práticas que vão fazer você escrever código melhor desde amanhã.

<!--truncate-->

Recentemente, atualizei minha [wiki pessoal](/docs/patterns) com uma coleção completa de design patterns em TypeScript, com exemplos práticos (e alguns com tema de Pokémon, porque sim 🎮). Neste post, vou te dar um overview geral do que são esses padrões e quando usar cada um. Para implementações completas e código pronto para rodar, a wiki tem tudo detalhado.

## O Que São Design Patterns?

Design Patterns são soluções reutilizáveis para problemas comuns no desenvolvimento de software. Pense neles como "receitas" testadas e aprovadas pela comunidade ao longo de décadas. Não são código pronto para copiar e colar, mas sim **abordagens de design** que você adapta ao seu contexto.

O livro "Gang of Four" (GoF), de 1994, catalogou 23 padrões que até hoje são referência. E o mais legal? Eles continuam relevantes mesmo com TypeScript, React, e tecnologias modernas.

## As Três Categorias

Os padrões se dividem em três grupos, cada um resolvendo um tipo diferente de problema:

### 1. Padrões Criacionais

Lidam com a **criação de objetos** de forma controlada e flexível. Em vez de usar `new` direto e criar dependências duras, esses padrões te dão controle sobre como e quando objetos são criados.

**Quando usar:**
- Você tem lógica complexa de criação
- Precisa controlar quantas instâncias existem
- Quer desacoplar a criação do uso

**Padrões que documentei:**
- [**Singleton**](/docs/patterns/singleton): Garante uma única instância (ex: config global, pool de conexões)
- [**Factory Method**](/docs/patterns/factory-method): Delega a criação de objetos para subclasses
- [**Abstract Factory**](/docs/patterns/abstract-factory): Cria famílias de objetos relacionados

### 2. Padrões Estruturais

Focam em **como classes e objetos são compostos**. Ajudam a montar estruturas maiores mantendo flexibilidade e eficiência.

**Quando usar:**
- Precisa integrar código legado com novo
- Quer adicionar comportamento sem modificar código existente
- Precisa simplificar interfaces complexas

**Padrões que documentei:**
- [**Adapter**](/docs/patterns/adapter): Adapta uma interface para outra (ex: integrar API antiga com código novo)
- [**Decorator**](/docs/patterns/decorator): Adiciona comportamento dinamicamente (sem herança pesada)
- [**Facade**](/docs/patterns/facade): Simplifica uma interface complexa

### 3. Padrões Comportamentais

Tratam de **comunicação e responsabilidades** entre objetos. Como eles interagem e distribuem trabalho.

**Quando usar:**
- Tem lógica condicional complexa (`if/else` gigantes)
- Precisa notificar múltiplos objetos de mudanças
- Quer encapsular comportamentos como objetos

**Padrões que documentei:**
- [**Strategy**](/docs/patterns/strategy): Escolhe algoritmos em runtime (ex: diferentes formas de calcular frete)
- [**Observer**](/docs/patterns/observer): Notifica múltiplos objetos de mudanças (base do padrão pub/sub)
- [**Command**](/docs/patterns/command): Encapsula requisições como objetos (útil para undo/redo)
- [**State**](/docs/patterns/state): Muda comportamento baseado no estado interno

## Padrões na Prática: Exemplos Rápidos

Vou mostrar brevemente alguns casos de uso reais. Para código completo e runnable, confere a [wiki](/docs/patterns).

### Strategy: Diferentes Formas de Pagar

```typescript
// Em vez de if/else gigantes:
class PaymentProcessor {
  process(method: string, amount: number) {
    if (method === 'credit') {
      // lógica cartão
    } else if (method === 'pix') {
      // lógica pix
    } else if (method === 'boleto') {
      // lógica boleto
    }
  }
}

// Use Strategy:
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number) { /* ... */ }
}

class PixPayment implements PaymentStrategy {
  pay(amount: number) { /* ... */ }
}

class Checkout {
  constructor(private strategy: PaymentStrategy) {}
  
  processPayment(amount: number) {
    this.strategy.pay(amount);
  }
}
```

Agora adicionar novos métodos de pagamento não mexe no código existente. [Implementação completa na wiki](/docs/patterns/strategy).

### Observer: Sistema de Notificações

```typescript
// Quando algo muda, vários objetos precisam saber
class OrderStatusSubject {
  private observers: Observer[] = [];

  attach(observer: Observer) {
    this.observers.push(observer);
  }

  notify(order: Order) {
    this.observers.forEach(obs => obs.update(order));
  }
}

// Email, SMS, push notification - todos observam a mesma mudança
const orderStatus = new OrderStatusSubject();
orderStatus.attach(new EmailNotifier());
orderStatus.attach(new SMSNotifier());
orderStatus.attach(new PushNotifier());

// Uma mudança, três notificações
orderStatus.notify(newOrder);
```

Base do padrão pub/sub e do Redux, por exemplo. [Código completo aqui](/docs/patterns/observer).

### Factory Method: Criando Diferentes Tipos

Imagine um sistema de RPG onde você cria diferentes tipos de personagens:

```typescript
abstract class CharacterFactory {
  abstract createCharacter(): Character;

  startGame() {
    const character = this.createCharacter();
    character.render();
    return character;
  }
}

class WarriorFactory extends CharacterFactory {
  createCharacter() {
    return new Warrior();
  }
}

class MageFactory extends CharacterFactory {
  createCharacter() {
    return new Mage();
  }
}
```

Cada factory cria um tipo específico, mas a lógica de início de jogo é compartilhada. [Implementação com tema Pokémon na wiki](/docs/patterns/factory-method) 🎮.

## Quando NÃO Usar Design Patterns

Design patterns são ferramentas, não objetivos. Alguns sinais de que você está forçando:

- **Overengineering**: Você cria 5 classes para algo que seria 10 linhas simples
- **Padrão errado**: Forçar um padrão que não resolve o problema real
- **Complexidade prematura**: Adicionar abstrações "para o futuro" que nunca chega

A regra é simples: **use quando o problema aparecer, não antes**. Refatoração existe pra isso.

## Por Que TypeScript?

Todos os exemplos na wiki estão em TypeScript por algumas razões:

1. **Type safety**: Interfaces e tipos tornam os padrões mais explícitos
2. **Documentação viva**: Os tipos servem como documentação automática
3. **Refatoração segura**: Mudar um padrão é mais confiável com tipos
4. **Ecossistema moderno**: Funciona com React, Node, e todo stack moderno

## Próximos Passos

Se você quer aprofundar:

1. **Explore a [wiki pessoal](/docs/patterns)** - Cada padrão tem implementação completa, testes e explicação detalhada
2. **Clone e rode**: Todos os exemplos são código real rodando com testes
3. **Pratique refatoração**: Pegue código existente e identifique onde um padrão ajudaria
4. **Não decore, entenda**: Foque no **problema** que cada padrão resolve

Design patterns não vão magicamente fazer seu código perfeito. Mas vão te dar um vocabulário e ferramentas para resolver problemas comuns de forma elegante e testada. E quando alguém falar "usa um Observer aqui", você vai saber exatamente do que estão falando.

Happy coding! 🚀

---

**Recursos:**
- [Wiki Completa de Design Patterns](/docs/patterns) (com todos os padrões documentados)
- [Repositório com exemplos](https://github.com/sciotta/my-sandbox) (código executável)
