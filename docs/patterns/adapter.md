# Padrão Adapter

O Padrão Adapter é um dos padrões estruturais que permite que interfaces incompatíveis trabalhem juntas. Ele atua como um "tradutor" entre duas interfaces, convertendo a interface de uma classe em outra interface que o cliente espera. Este padrão é particularmente útil quando você precisa integrar classes existentes que não podem ser modificadas.

## Quando usar o Padrão Adapter?
- Quando você deseja usar uma classe existente, mas sua interface não é compatível com o restante do código.
- Quando você precisa integrar bibliotecas de terceiros ou código legado ao seu sistema.
- Quando você quer criar uma camada de abstração que isola seu código de APIs externas.
- Quando você precisa reutilizar classes existentes sem modificá-las.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Adapter pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de reprodução de áudio que precisa integrar um player de música antigo (que usa MP3) com uma nova interface que espera um formato de streaming moderno.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/adapter.ts
```

### Exemplo de uso

```typescript
// Interface esperada pelo cliente
interface PlayerDeMusica {
  tocar(musica: string): void;
  pausar(): void;
  obterStatus(): string;
}

// Classe legada com interface diferente
class PlayerMP3Antigo {
  iniciarReproducao(arquivo: string): void {
    console.log(`[MP3 Legado] Reproduzindo arquivo: ${arquivo}`);
  }

  pararReproducao(): void {
    console.log(`[MP3 Legado] Reprodução parada`);
  }

  estaReproduzindo(): boolean {
    return true;
  }
}

// Adapter que faz a ponte entre as interfaces
class AdapterPlayerMP3 implements PlayerDeMusica {
  private playerAntigo: PlayerMP3Antigo;

  constructor(playerAntigo: PlayerMP3Antigo) {
    this.playerAntigo = playerAntigo;
  }

  tocar(musica: string): void {
    this.playerAntigo.iniciarReproducao(musica);
  }

  pausar(): void {
    this.playerAntigo.pararReproducao();
  }

  obterStatus(): string {
    return this.playerAntigo.estaReproduzindo() 
      ? "Reproduzindo" 
      : "Parado";
  }
}

// Uso
const playerLegado = new PlayerMP3Antigo();
const player: PlayerDeMusica = new AdapterPlayerMP3(playerLegado);

player.tocar("minha-musica.mp3");
// Output: [MP3 Legado] Reproduzindo arquivo: minha-musica.mp3

console.log(player.obterStatus());
// Output: Reproduzindo

player.pausar();
// Output: [MP3 Legado] Reprodução parada
```

Neste exemplo, o `AdapterPlayerMP3` implementa a interface `PlayerDeMusica` que o cliente espera, mas internamente delega as chamadas para o `PlayerMP3Antigo` que possui uma interface diferente. O código cliente pode usar o player sem saber que está utilizando uma classe legada por baixo dos panos.

## Conclusão

O padrão Adapter é extremamente útil para integrar sistemas legados, bibliotecas de terceiros ou qualquer código que possua uma interface incompatível com a que você precisa. Ele promove o princípio de responsabilidade única ao separar a lógica de conversão de interface do código de negócio.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
