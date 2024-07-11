# Padrão Strategy

O Padrão Strategy é um dos padrões comportamentais que permite definir uma família de algoritmos, encapsulá-los e torná-los intercambiáveis. Este padrão é particularmente útil quando você precisa selecionar dinamicamente entre várias variações de um algoritmo. Ao utilizar o Padrão Strategy, você pode adicionar novos algoritmos ou modificar algoritmos existentes sem alterar o código cliente que os utiliza.

## Quando usar o Padrão Strategy?
- Quando você tem várias maneiras de realizar uma tarefa específica e deseja que o algoritmo a ser usado seja selecionado dinamicamente.
- Quando você deseja evitar a utilização de condicionais complexas (como `if-else` ou `switch-case`) para selecionar o comportamento a ser executado.
- Quando você deseja que diferentes classes possam reutilizar algoritmos de maneira flexível e independente.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Strategy pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de cálculo de impostos que pode utilizar diferentes tipos de impostos. Utilizaremos o Padrão Strategy para selecionar dinamicamente o tipo de imposto a ser aplicado.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/strategy.ts
```

### Exemplo de uso

```typescript
const calculadora = new CalculadoraDeImposto();
const icms = new ICMS();

const valorBase = 100;
const valorComImposto = calculadora.calcular(icms, valorBase);

console.log(`Valor com ICMS: ${valorComImposto}`);
// Output: Valor com ICMS: 120
