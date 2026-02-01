# Padrão Factory Method

O Padrão Factory Method é um dos padrões criacionais que define uma interface para criar objetos, mas permite que as subclasses decidam qual classe instanciar. Este padrão delega a responsabilidade de criação de objetos para as subclasses, promovendo o desacoplamento entre o código que usa os objetos e o código que os cria.

## Quando usar o Padrão Factory Method?
- Quando uma classe não pode antecipar a classe de objetos que deve criar.
- Quando você deseja que as subclasses especifiquem os objetos que criam.
- Quando você quer isolar a lógica de criação de objetos do código que os utiliza.
- Quando você precisa de flexibilidade para adicionar novos tipos de objetos sem modificar o código existente.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Factory Method pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de logística que pode utilizar diferentes tipos de transporte (caminhão ou navio) dependendo da necessidade.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/factory-method.ts
```

### Exemplo de uso

```typescript
// Interface do produto
interface Transporte {
  entregar(): string;
}

// Produtos concretos
class Caminhao implements Transporte {
  entregar(): string {
    return "Entrega por terra em caminhão";
  }
}

class Navio implements Transporte {
  entregar(): string {
    return "Entrega por mar em navio";
  }
}

// Criador abstrato
abstract class Logistica {
  abstract criarTransporte(): Transporte;

  planejarEntrega(): string {
    const transporte = this.criarTransporte();
    return `Logística planejada: ${transporte.entregar()}`;
  }
}

// Criadores concretos
class LogisticaTerrestre extends Logistica {
  criarTransporte(): Transporte {
    return new Caminhao();
  }
}

class LogisticaMaritima extends Logistica {
  criarTransporte(): Transporte {
    return new Navio();
  }
}

// Uso
const logisticaTerrestre = new LogisticaTerrestre();
console.log(logisticaTerrestre.planejarEntrega());
// Output: Logística planejada: Entrega por terra em caminhão

const logisticaMaritima = new LogisticaMaritima();
console.log(logisticaMaritima.planejarEntrega());
// Output: Logística planejada: Entrega por mar em navio
```

Neste exemplo, a classe abstrata `Logistica` define o método `criarTransporte()` que deve ser implementado pelas subclasses. Cada subclasse (`LogisticaTerrestre` e `LogisticaMaritima`) decide qual tipo de transporte criar, sem que o código cliente precise conhecer os detalhes da criação.

## Conclusão

O padrão Factory Method é útil quando você precisa de flexibilidade na criação de objetos e deseja evitar acoplamento direto entre o código cliente e as classes concretas. Ele é amplamente utilizado em frameworks e bibliotecas onde a criação de objetos precisa ser extensível.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
