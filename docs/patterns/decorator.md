# Padrão Decorator

O Padrão Decorator é um dos padrões estruturais que permite adicionar comportamentos a objetos individuais de forma dinâmica, sem afetar o comportamento de outros objetos da mesma classe. Este padrão oferece uma alternativa flexível à herança para estender funcionalidades, permitindo "embrulhar" objetos com novas responsabilidades em tempo de execução.

## Quando usar o Padrão Decorator?
- Quando você deseja adicionar responsabilidades a objetos de forma dinâmica e transparente.
- Quando a extensão por herança é impraticável ou resultaria em uma explosão de subclasses.
- Quando você precisa de combinações flexíveis de funcionalidades que podem ser aplicadas em diferentes ordens.
- Quando você quer seguir o princípio Open/Closed (aberto para extensão, fechado para modificação).

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Decorator pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de pedidos de café onde o cliente pode adicionar ingredientes extras (como leite, chocolate ou chantilly) ao café base.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/decorator.ts
```

### Exemplo de uso

```typescript
// Interface base
interface Cafe {
  obterDescricao(): string;
  obterPreco(): number;
}

// Componente concreto
class CafeSimples implements Cafe {
  obterDescricao(): string {
    return "Café";
  }

  obterPreco(): number {
    return 5.0;
  }
}

// Decorator base
abstract class DecoradorDeCafe implements Cafe {
  protected cafe: Cafe;

  constructor(cafe: Cafe) {
    this.cafe = cafe;
  }

  abstract obterDescricao(): string;
  abstract obterPreco(): number;
}

// Decoradores concretos
class ComLeite extends DecoradorDeCafe {
  obterDescricao(): string {
    return `${this.cafe.obterDescricao()} + Leite`;
  }

  obterPreco(): number {
    return this.cafe.obterPreco() + 2.0;
  }
}

class ComChocolate extends DecoradorDeCafe {
  obterDescricao(): string {
    return `${this.cafe.obterDescricao()} + Chocolate`;
  }

  obterPreco(): number {
    return this.cafe.obterPreco() + 3.5;
  }
}

class ComChantilly extends DecoradorDeCafe {
  obterDescricao(): string {
    return `${this.cafe.obterDescricao()} + Chantilly`;
  }

  obterPreco(): number {
    return this.cafe.obterPreco() + 1.5;
  }
}

// Uso
let meuCafe: Cafe = new CafeSimples();
console.log(`${meuCafe.obterDescricao()} = R$${meuCafe.obterPreco()}`);
// Output: Café = R$5

meuCafe = new ComLeite(meuCafe);
console.log(`${meuCafe.obterDescricao()} = R$${meuCafe.obterPreco()}`);
// Output: Café + Leite = R$7

meuCafe = new ComChocolate(meuCafe);
console.log(`${meuCafe.obterDescricao()} = R$${meuCafe.obterPreco()}`);
// Output: Café + Leite + Chocolate = R$10.5

meuCafe = new ComChantilly(meuCafe);
console.log(`${meuCafe.obterDescricao()} = R$${meuCafe.obterPreco()}`);
// Output: Café + Leite + Chocolate + Chantilly = R$12
```

Neste exemplo, cada decorador "embrulha" o café anterior, adicionando sua própria descrição e preço. O cliente pode combinar os decoradores na ordem que preferir, criando diferentes combinações de café sem precisar criar uma subclasse para cada combinação possível.

## Conclusão

O padrão Decorator é poderoso para adicionar funcionalidades de forma flexível e composicional. Em vez de criar classes como `CafeComLeiteEChocolate`, `CafeComLeiteEChantilly`, etc., você pode compor os comportamentos dinamicamente. Este padrão é amplamente usado em bibliotecas de I/O, middlewares de frameworks web e sistemas de logging.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
