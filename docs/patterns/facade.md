# Padrão Facade

O Padrão Facade é um dos padrões estruturais que fornece uma interface simplificada para um conjunto complexo de subsistemas. Ele atua como uma "fachada" que esconde a complexidade do sistema, oferecendo ao cliente uma maneira mais fácil de interagir com múltiplos componentes através de uma única interface unificada.

## Quando usar o Padrão Facade?
- Quando você quer fornecer uma interface simples para um subsistema complexo.
- Quando há muitas dependências entre clientes e classes de implementação.
- Quando você deseja organizar subsistemas em camadas.
- Quando você quer reduzir o acoplamento entre subsistemas e seus clientes.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Facade pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de home theater que coordena vários dispositivos (DVD, projetor, sistema de áudio e luzes) para proporcionar uma experiência cinematográfica completa.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/facade.ts
```

### Exemplo de uso

```typescript
const homeTheater = new HomeTheaterFacade();

// Ao invés de ligar cada dispositivo manualmente:
// luzes.escurecer(10);
// projetor.ligar();
// projetor.modoWideScreen();
// audio.ligar();
// audio.ajustarVolume(5);
// dvd.ligar();
// dvd.reproduzir("Matrix");

// Simplesmente:
homeTheater.assistirFilme("Matrix");
// Todos os dispositivos são configurados automaticamente!

// E ao final:
homeTheater.fimDoFilme();
// Tudo é desligado na ordem correta
```

Neste exemplo, o `HomeTheaterFacade` esconde toda a complexidade de coordenar múltiplos subsistemas. O cliente não precisa conhecer os detalhes de como ligar cada dispositivo ou em qual ordem isso deve ser feito. A facade oferece métodos simples (`assistirFilme` e `fimDoFilme`) que encapsulam todas essas operações.

## Conclusão

O padrão Facade é extremamente útil para simplificar interações com sistemas complexos. Ele promove baixo acoplamento ao isolar o código cliente dos detalhes internos dos subsistemas. É amplamente usado em bibliotecas, frameworks e APIs que precisam fornecer interfaces simples sobre funcionalidades complexas.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
