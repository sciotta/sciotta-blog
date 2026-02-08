# Padrão State

O Padrão State é um dos padrões comportamentais que permite que um objeto altere seu comportamento quando seu estado interno muda. O padrão encapsula estados em classes separadas e delega o trabalho para o objeto que representa o estado atual, fazendo parecer que o objeto mudou de classe.

## Quando usar o Padrão State?
- Quando um objeto precisa mudar seu comportamento em tempo de execução dependendo de seu estado.
- Quando você tem muitas condicionais (if/switch) que escolhem diferentes comportamentos baseados no estado do objeto.
- Quando diferentes estados compartilham código similar ou precisam de transições de estado complexas.
- Quando você quer evitar grandes blocos condicionais que verificam o estado antes de cada operação.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão State pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um player de música que pode estar em diferentes estados (parado, tocando, pausado) e se comporta de maneira diferente dependendo do estado atual.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/state.ts
```

### Exemplo de uso

```typescript
const player = new PlayerDeMusica();

// Estado inicial: Parado
player.play("Bohemian Rhapsody");
// Output: Tocando: Bohemian Rhapsody

// Estado: Tocando
player.pause();
// Output: Pausado: Bohemian Rhapsody

// Estado: Pausado
player.play();
// Output: Retomando: Bohemian Rhapsody

// Estado: Tocando
player.play("Imagine");
// Output: Tocando: Imagine (troca de música)

player.stop();
// Output: Player parado

// Estado: Parado
player.pause();
// Output: Player já está parado (ação inválida neste estado)
```

Neste exemplo, o `PlayerDeMusica` delega todas as operações (play, pause, stop) para o objeto de estado atual. Cada estado (`EstadoParado`, `EstadoTocando`, `EstadoPausado`) implementa essas operações de forma diferente e controla as transições para outros estados. Isso elimina a necessidade de grandes blocos condicionais e torna fácil adicionar novos estados ou modificar comportamentos existentes.

## Conclusão

O padrão State é ideal para objetos cujo comportamento muda significativamente baseado em seu estado interno. Ele organiza código relacionado a estados específicos em classes separadas, facilita a adição de novos estados e torna as transições de estado explícitas. É amplamente usado em máquinas de estado, protocolos de rede, players de mídia e fluxos de trabalho com múltiplos estágios.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
