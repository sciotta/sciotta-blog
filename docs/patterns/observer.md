# Padrão Observer

O Padrão Observer é um dos padrões comportamentais que define uma dependência um-para-muitos entre objetos, de maneira que quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente. Este padrão é útil quando um objeto precisa notificar outros objetos sem precisar saber quem são esses objetos.

## Quando usar o Padrão Observer?
- Quando uma mudança no estado de um objeto precisa ser refletida em outros objetos.
- Quando uma estrutura de eventos é necessária e você quer desacoplar o código de emissão de eventos do código de tratamento de eventos.
- Quando você deseja evitar chamadas de método diretas e criar um sistema de notificação flexível e reutilizável.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Observer pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema onde um Pokémon pode notificar o treinador Ash quando ele é golpeado durante uma batalha.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/observer.ts
```

### Exemplo de uso

```typescript
const pikachu = new Pikachu();
const charizard = new Charizard();

// Função que é chamada ao receber um ataque
const quandoAcontecerAtaque = (mensagem: string) => {
  console.log(mensagem);
}

const ash = new Ash(pikachu, charizard, quandoAcontecerAtaque);

pikachu.receberGolpe();
// Output: Pikachu foi golpeado e sua vida é: 90
charizard.receberGolpe()
 // Output: Charizard foi golpeado e sua vida é: 130

ash.pararDeObservarPikachu();
pikachu.receberGolpe();
// Nenhuma notificação é enviada, pois Ash parou de observar Pikachu

charizard.receberGolpe();
// Output: Charizard foi golpeado e sua vida é: 110
```